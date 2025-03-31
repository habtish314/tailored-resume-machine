
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useResume } from "@/contexts/ResumeContext";
import { useAIGenerator } from "@/hooks/useAIGenerator";
import AIGenerateButton from "@/components/AIGenerateButton";
import { Separator } from "@/components/ui/separator";
import { AtSign, Globe, Linkedin, Github, MapPin, Phone } from "lucide-react";

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
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
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
            <Label htmlFor="jobTitle">Professional Title</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              placeholder="Senior Software Engineer"
              value={personalInfo.jobTitle || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <AtSign size={14} /> Email
            </Label>
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
            <Label htmlFor="phone" className="flex items-center gap-1">
              <Phone size={14} /> Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="(123) 456-7890"
              value={personalInfo.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-1">
              <MapPin size={14} /> Location
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="City, State"
              value={personalInfo.location}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Online Presence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-1">
              <Globe size={14} /> Personal Website
            </Label>
            <Input
              id="website"
              name="website"
              placeholder="https://johndoe.com"
              value={personalInfo.website || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-1">
              <Linkedin size={14} /> LinkedIn
            </Label>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="https://linkedin.com/in/johndoe"
              value={personalInfo.linkedin || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-1">
              <Github size={14} /> GitHub
            </Label>
            <Input
              id="github"
              name="github"
              placeholder="https://github.com/johndoe"
              value={personalInfo.github || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
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

export default PersonalInfoForm;
