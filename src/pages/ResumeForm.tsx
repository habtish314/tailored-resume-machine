import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { useAIGenerator } from "@/hooks/useAIGenerator";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import EducationForm from "@/components/resume/EducationForm";
import SkillsForm from "@/components/SkillsForm";
import AdditionalForm from "@/components/resume/AdditionalForm";

const ResumeFormInner = () => {
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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-resume-primary">Create Your Resume</h1>
            
            <Button
              onClick={handleQuickGenerate}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Quick Generate with AI
                </>
              )}
            </Button>
          </div>
          
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
