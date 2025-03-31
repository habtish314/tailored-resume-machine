
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import EducationForm from "@/components/resume/EducationForm";
import SkillsForm from "@/components/SkillsForm";
import AdditionalForm from "@/components/resume/AdditionalForm";

interface ResumeFormTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const ResumeFormTabs = ({ currentTab, setCurrentTab }: ResumeFormTabsProps) => {
  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
      <div className="px-6 pt-6">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-5">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
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
  );
};

export default ResumeFormTabs;
