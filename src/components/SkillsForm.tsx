import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResume } from "@/contexts/ResumeContext";
import { useAIGenerator } from "@/hooks/useAIGenerator";
import AIGenerateButton from "@/components/AIGenerateButton";

const SkillsForm = () => {
  const { resumeData, updateSkills } = useResume();
  const [skills, setSkills] = useState(resumeData.skills.filter(Boolean).length ? resumeData.skills : ['']);
  const [newSkill, setNewSkill] = useState('');
  const { generateContent, isGenerating } = useAIGenerator();

  const addSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      updateSkills(updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills.length ? updatedSkills : ['']);
    updateSkills(updatedSkills.length ? updatedSkills : ['']);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const generateAISkills = async () => {
    // For AI-generated skills, we need experience data to be meaningful
    if (!resumeData.experiences.some(exp => exp.title && exp.description)) {
      return;
    }

    const generatedContent = await generateContent(resumeData, 'resume');
    if (generatedContent) {
      // Extract skills section
      const skillsMatch = generatedContent.match(/## Skills\s+([\s\S]+?)(?=##|$)/);
      if (skillsMatch && skillsMatch[1]) {
        // Extract skills - could be comma-separated or bullet points
        let skillsText = skillsMatch[1].trim();
        let extractedSkills: string[] = [];
        
        // Try to extract bullet points first
        const bulletSkills = skillsText.match(/- (.*?)(?=\n|$)/g);
        if (bulletSkills) {
          extractedSkills = bulletSkills.map(skill => skill.replace('- ', '').trim());
        } else {
          // Otherwise split by commas
          extractedSkills = skillsText.split(/,|•/).map(skill => skill.trim()).filter(Boolean);
        }
        
        if (extractedSkills.length > 0) {
          setSkills(extractedSkills);
          updateSkills(extractedSkills);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Label htmlFor="skills" className="text-lg">Skills</Label>
        <AIGenerateButton 
          onClick={generateAISkills}
          isGenerating={isGenerating}
          text="Generate Skills"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.filter(Boolean).map((skill, index) => (
          <div 
            key={index} 
            className="bg-resume-muted px-3 py-1 rounded-full flex items-center text-sm"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="ml-2 text-gray-400 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          id="newSkill"
          placeholder="Add a skill (e.g. JavaScript)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          onClick={addSkill}
          disabled={!newSkill.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default SkillsForm;
