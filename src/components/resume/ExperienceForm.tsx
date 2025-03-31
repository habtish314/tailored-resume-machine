
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { useAIGenerator } from "@/hooks/useAIGenerator";
import AIGenerateButton from "@/components/AIGenerateButton";

const ExperienceForm = () => {
  const { resumeData, updateExperiences } = useResume();
  const [experiences, setExperiences] = useState(resumeData.experiences);
  const { generateContent, isGenerating } = useAIGenerator();

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [name]: value,
    };
    setExperiences(updatedExperiences);
    updateExperiences(updatedExperiences);
  };

  const addExperience = () => {
    const newExperience = {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setExperiences([...experiences, newExperience]);
    updateExperiences([...experiences, newExperience]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const updatedExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(updatedExperiences);
      updateExperiences(updatedExperiences);
    }
  };

  const handleGenerateDescription = async (index: number) => {
    const experience = experiences[index];
    if (!experience.title || !experience.company) {
      return;
    }

    // Create a minimal resume data object focused on this experience
    const focusedResumeData = {
      ...resumeData,
      experiences: [experience]
    };

    const generatedContent = await generateContent(focusedResumeData, 'resume');
    if (generatedContent) {
      // Extract just the job description for this experience
      const regex = new RegExp(`${experience.title}.*?\\n(.*?)(?=###|##|$)`, 's');
      const descriptionMatch = generatedContent.match(regex);
      
      if (descriptionMatch && descriptionMatch[1]) {
        // Extract bullet points if they exist
        const bulletPoints = descriptionMatch[1].match(/- (.*?)(?=\n|$)/g);
        
        let descriptionText = '';
        if (bulletPoints) {
          descriptionText = bulletPoints.map(point => point.replace('- ', '').trim()).join('\n• ');
          if (descriptionText) {
            descriptionText = '• ' + descriptionText;
          }
        } else {
          descriptionText = descriptionMatch[1].trim();
        }
        
        const updatedExperiences = [...experiences];
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          description: descriptionText,
        };
        setExperiences(updatedExperiences);
        updateExperiences(updatedExperiences);
      }
    }
  };

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => (
        <Card key={index} className="relative">
          {experiences.length > 1 && (
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
            >
              <Trash size={16} />
            </button>
          )}
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${index}`}>Job Title</Label>
                <Input
                  id={`title-${index}`}
                  name="title"
                  placeholder="Software Developer"
                  value={experience.title}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`company-${index}`}>Company</Label>
                <Input
                  id={`company-${index}`}
                  name="company"
                  placeholder="Acme Inc."
                  value={experience.company}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  name="location"
                  placeholder="City, State"
                  value={experience.location}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                  <Input
                    id={`startDate-${index}`}
                    name="startDate"
                    placeholder="MM/YYYY"
                    value={experience.startDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`}>End Date</Label>
                  <Input
                    id={`endDate-${index}`}
                    name="endDate"
                    placeholder="MM/YYYY or Present"
                    value={experience.endDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Job Description</Label>
              <Textarea
                id={`description-${index}`}
                name="description"
                placeholder="Describe your responsibilities and achievements..."
                value={experience.description}
                onChange={(e) => handleChange(index, e)}
                className="h-32"
              />
              <div className="flex justify-end">
                <AIGenerateButton 
                  onClick={() => handleGenerateDescription(index)}
                  isGenerating={isGenerating}
                  text="Generate Description"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add Another Experience
      </Button>
    </div>
  );
};

export default ExperienceForm;
