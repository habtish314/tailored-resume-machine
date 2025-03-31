
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useResume } from "@/contexts/ResumeContext";
import { useAIGenerator } from "@/hooks/useAIGenerator";
import ResumeFormTabs from "@/components/resume/ResumeFormTabs";
import ResumeFormHeader from "@/components/resume/ResumeFormHeader";
import NavigationButtons from "@/components/resume/NavigationButtons";

const ResumeFormContainer = () => {
  const [currentTab, setCurrentTab] = useState("personal");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resumeData, setGeneratedContent } = useResume();
  const { generateFullResume, isGenerating } = useAIGenerator();

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
      // Use the enhanced generateFullResume function
      const fullContent = await generateFullResume(resumeData);
      
      if (fullContent) {
        setGeneratedContent(fullContent);
        
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

  const handleQuickGenerate = async () => {
    // Check if at least name is provided
    if (!resumeData.personalInfo.name) {
      toast({
        title: "Name Required",
        description: "Please provide at least your name before quick-generating.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Quick Generating",
      description: "Creating your resume with minimal information...",
    });

    try {
      const fullContent = await generateFullResume(resumeData);
      
      if (fullContent) {
        setGeneratedContent(fullContent);
        toast({
          title: "Resume Generated",
          description: "Your resume has been quick-generated!",
        });
        navigate("/resume-preview");
      }
    } catch (error) {
      console.error("Error quick generating:", error);
      toast({
        title: "Generation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <ResumeFormHeader 
        handleQuickGenerate={handleQuickGenerate} 
        isGenerating={isGenerating} 
      />
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <ResumeFormTabs 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
        />
        
        <NavigationButtons 
          currentTab={currentTab}
          handlePreviousTab={handlePreviousTab}
          handleNextTab={handleNextTab}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default ResumeFormContainer;
