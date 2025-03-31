
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, Trash, Sparkles } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { useAIGenerator } from "@/hooks/useAIGenerator";
import AIGenerateButton from "@/components/AIGenerateButton";

const PersonalInfoForm = () => {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;
  const { generateContent, isGenerating } = useAIGenerator();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
  };

  const handleGenerateSummary = async () => {
    // Generate a summary based on the existing resume data
    const generatedSummary = await generateContent(resumeData, 'resume');
    if (generatedSummary) {
      // Extract just the professional summary section from the full resume
      const summaryMatch = generatedSummary.match(/## Professional Summary\s+([\s\S]+?)(?=##|$)/);
      const summaryText = summaryMatch ? summaryMatch[1].trim() : '';
      
      if (summaryText) {
        updatePersonalInfo({ summary: summaryText });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={personalInfo.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john.doe@example.com"
            value={personalInfo.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="(123) 456-7890"
            value={personalInfo.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="City, State"
            value={personalInfo.location}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          placeholder="Write a short summary highlighting your skills and experience..."
          value={personalInfo.summary}
          onChange={handleChange}
          className="h-32"
        />
        <div className="flex justify-end">
          <AIGenerateButton 
            onClick={handleGenerateSummary}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};

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

const EducationForm = () => {
  const { resumeData, updateEducation } = useResume();
  const [education, setEducation] = useState(resumeData.education);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [name]: value,
    };
    setEducation(updatedEducation);
    updateEducation(updatedEducation);
  };

  const addEducation = () => {
    const newEducation = {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    setEducation([...education, newEducation]);
    updateEducation([...education, newEducation]);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      const updatedEducation = education.filter((_, i) => i !== index);
      setEducation(updatedEducation);
      updateEducation(updatedEducation);
    }
  };

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <Card key={index} className="relative">
          {education.length > 1 && (
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
            >
              <Trash size={16} />
            </button>
          )}
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`school-${index}`}>School / University</Label>
                <Input
                  id={`school-${index}`}
                  name="school"
                  placeholder="University of California"
                  value={edu.school}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Degree</Label>
                <Input
                  id={`degree-${index}`}
                  name="degree"
                  placeholder="Bachelor's, Master's, etc."
                  value={edu.degree}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`field-${index}`}>Field of Study</Label>
                <Input
                  id={`field-${index}`}
                  name="field"
                  placeholder="Computer Science"
                  value={edu.field}
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
                    value={edu.startDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`}>End Date</Label>
                  <Input
                    id={`endDate-${index}`}
                    name="endDate"
                    placeholder="MM/YYYY or Present"
                    value={edu.endDate}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add Another Education
      </Button>
    </div>
  );
};

const SkillsForm = () => {
  const { resumeData, updateSkills } = useResume();
  const [skills, setSkills] = useState(resumeData.skills.filter(Boolean).length ? resumeData.skills : ['']);
  const [newSkill, setNewSkill] = useState('');

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

  const generateAISkills = () => {
    // Simulate AI skill generation with a sample set
    const aiGeneratedSkills = [
      'JavaScript', 'React', 'TypeScript', 'Node.js', 'HTML/CSS',
      'Git', 'RESTful API', 'Problem Solving', 'Team Collaboration',
      'Agile Methodology', 'UI/UX Design'
    ];
    setSkills(aiGeneratedSkills);
    updateSkills(aiGeneratedSkills);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Label htmlFor="skills" className="text-lg">Skills</Label>
        <Button 
          variant="outline" 
          size="sm"
          onClick={generateAISkills}
          className="flex items-center gap-1 text-resume-primary"
        >
          <Sparkles size={16} />
          Generate with AI
        </Button>
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

const AdditionalForm = () => {
  const { resumeData, updateCertifications, updateHobbies } = useResume();
  const [certifications, setCertifications] = useState(resumeData.certifications.filter(Boolean).length ? resumeData.certifications : ['']);
  const [hobbies, setHobbies] = useState(resumeData.hobbies.filter(Boolean).length ? resumeData.hobbies : ['']);
  const [newCertification, setNewCertification] = useState('');
  const [newHobby, setNewHobby] = useState('');

  const addCertification = () => {
    if (newCertification.trim()) {
      const updatedCerts = [...certifications, newCertification.trim()];
      setCertifications(updatedCerts);
      updateCertifications(updatedCerts);
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    const updatedCerts = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCerts.length ? updatedCerts : ['']);
    updateCertifications(updatedCerts.length ? updatedCerts : ['']);
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      const updatedHobbies = [...hobbies, newHobby.trim()];
      setHobbies(updatedHobbies);
      updateHobbies(updatedHobbies);
      setNewHobby('');
    }
  };

  const removeHobby = (index: number) => {
    const updatedHobbies = hobbies.filter((_, i) => i !== index);
    setHobbies(updatedHobbies.length ? updatedHobbies : ['']);
    updateHobbies(updatedHobbies.length ? updatedHobbies : ['']);
  };

  const handleCertificationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCertification();
    }
  };

  const handleHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHobby();
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="certifications" className="text-lg">Certifications</Label>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {certifications.filter(Boolean).map((cert, index) => (
            <div 
              key={index} 
              className="bg-resume-muted px-3 py-1 rounded-full flex items-center text-sm"
            >
              <span>{cert}</span>
              <button
                type="button"
                onClick={() => removeCertification(index)}
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
            id="newCertification"
            placeholder="Add a certification (e.g. AWS Certified Solutions Architect)"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyDown={handleCertificationKeyDown}
          />
          <Button
            type="button"
            onClick={addCertification}
            disabled={!newCertification.trim()}
          >
            Add
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="hobbies" className="text-lg">Hobbies & Interests</Label>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {hobbies.filter(Boolean).map((hobby, index) => (
            <div 
              key={index} 
              className="bg-resume-muted px-3 py-1 rounded-full flex items-center text-sm"
            >
              <span>{hobby}</span>
              <button
                type="button"
                onClick={() => removeHobby(index)}
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
            id="newHobby"
            placeholder="Add a hobby (e.g. Photography)"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyDown={handleHobbyKeyDown}
          />
          <Button
            type="button"
            onClick={addHobby}
            disabled={!newHobby.trim()}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

const ResumeFormInner = () => {
  const [currentTab, setCurrentTab] = useState("personal");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resumeData, setGeneratedContent } = useResume();
  const { generateContent, isGenerating } = useAIGenerator();

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "additional", label: "Additional" },
  ];

  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1].id);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    // Check if essential fields are filled
    if (!resumeData.personalInfo.name || !resumeData.personalInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least your name and email in the personal information section.",
        variant: "destructive",
      });
      setCurrentTab("personal");
      return;
    }

    toast({
      title: "Generating Content",
      description: "We're creating your resume and cover letter with AI...",
    });

    try {
      // Generate resume content
      const resumeContent = await generateContent(resumeData, 'resume');
      
      // Generate cover letter
      const coverLetterContent = await generateContent(resumeData, 'coverLetter');
      
      if (resumeContent && coverLetterContent) {
        setGeneratedContent({
          resumeContent,
          coverLetterContent
        });
        
        toast({
          title: "Resume Generated",
          description: "Your resume has been successfully created!",
        });
        
        navigate("/resume-preview");
      } else {
        toast({
          title: "Generation Issue",
          description: "There was a problem generating your content. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation Failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Helper function to generate mock resume content
  const generateMockResumeContent = (data: any) => {
    return `
# ${data.personalInfo.name}
${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}

## Professional Summary
${data.personalInfo.summary || "A skilled professional with experience in..."}

## Work Experience
${data.experiences.map((exp: any) => `
### ${exp.title} at ${exp.company}
${exp.startDate} - ${exp.endDate}
${exp.location}

${exp.description || "Responsibilities included..."}
`).join("")}

## Education
${data.education.map((edu: any) => `
### ${edu.degree} in ${edu.field}
${edu.school}
${edu.startDate} - ${edu.endDate}
`).join("")}

## Skills
${data.skills.filter(Boolean).join(", ")}

${data.certifications.filter(Boolean).length ? `
## Certifications
${data.certifications.filter(Boolean).join(", ")}
` : ""}

${data.hobbies.filter(Boolean).length ? `
## Hobbies & Interests
${data.hobbies.filter(Boolean).join(", ")}
` : ""}
    `;
  };

  // Helper function to generate mock cover letter content
  const generateMockCoverLetterContent = (data: any) => {
    return `
Dear Hiring Manager,

I am writing to express my interest in [Position] at [Company Name]. With my background in ${data.experiences.length > 0 ? data.experiences[0].title : "the field"} and expertise in ${data.skills.filter(Boolean).join(", ")}, I believe I would be a valuable addition to your team.

${data.personalInfo.summary}

Throughout my career at ${data.experiences.map((exp: any) => exp.company).filter(Boolean).join(", ")}, I have developed strong skills in ${data.skills.filter(Boolean).slice(0, 3).join(", ")}. My educational background in ${data.education.map((edu: any) => edu.field).filter(Boolean).join(", ")} has provided me with a solid foundation for success in this role.

I am particularly drawn to [Company Name] because of your commitment to [Company Value/Mission]. I am excited about the opportunity to contribute to your team and help drive success.

Thank you for considering my application. I look forward to the possibility of discussing how my skills and experiences align with your needs.

Sincerely,
${data.personalInfo.name}
    `;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-resume-primary">Create Your Resume</h1>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="w-full grid grid-cols-1 md:grid-cols-5">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex-1">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <div className="p-6">
                <TabsContent value="personal">
                  <PersonalInfoForm />
                </TabsContent>
                
                <TabsContent value="experience">
                  <ExperienceForm />
                </TabsContent>
                
                <TabsContent value="education">
                  <EducationForm />
                </TabsContent>
                
                <TabsContent value="skills">
                  <SkillsForm />
                </TabsContent>
                
                <TabsContent value="additional">
                  <AdditionalForm />
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="p-6 border-t flex justify-between">
              {currentTab !== "personal" ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousTab}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button
                type="button"
                onClick={handleNextTab}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {currentTab === "additional" ? (
                  isGenerating ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                      Generating...
                    </>
                  ) : (
                    "Generate Resume"
                  )
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ResumeForm = () => {
  return (
    <ResumeProvider>
      <ResumeFormInner />
    </ResumeProvider>
  );
};

export default ResumeForm;
