
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ResumeProvider, useResume } from "@/contexts/ResumeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Download, ArrowLeft, FileText, MessageSquare, Star, AlertCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import ResumeRatingCard from "@/components/resume/ResumeRatingCard";

const ResumePreviewInner = () => {
  const [activeTab, setActiveTab] = useState("resume");
  const [showRating, setShowRating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resumeData, generatedContent } = useResume();

  useEffect(() => {
    if (!generatedContent) {
      navigate("/resume-form");
    }
  }, [generatedContent, navigate]);

  if (!generatedContent) {
    return null;
  }

  const handleDownload = (type: "resume" | "coverLetter") => {
    const content = type === "resume" ? generatedContent.resumeContent : generatedContent.coverLetterContent;
    const filename = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_${type === "resume" ? "Resume" : "Cover_Letter"}.md`;
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: `${type === "resume" ? "Resume" : "Cover Letter"} Downloaded`,
      description: `Your ${type === "resume" ? "resume" : "cover letter"} has been downloaded successfully.`,
    });
  };

  const handleSaveToDashboard = async () => {
    // Get existing resumes or initialize empty array
    const existingResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
    
    // Add new resume
    const newResume = {
      id: Date.now().toString(),
      title: `${resumeData.personalInfo.name}'s Resume`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      content: {
        resumeContent: generatedContent.resumeContent,
        coverLetterContent: generatedContent.coverLetterContent
      }
    };
    
    // Save updated resumes
    localStorage.setItem('userResumes', JSON.stringify([...existingResumes, newResume]));
    
    toast({
      title: "Saved to Dashboard",
      description: "Your resume has been saved to your dashboard.",
    });
    
    navigate("/dashboard");
  };

  const toggleRating = () => {
    setShowRating(prev => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/resume-form")}
              >
                <ArrowLeft size={16} className="mr-2" /> Edit Resume
              </Button>
              <h1 className="text-3xl font-bold text-resume-primary">Preview</h1>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => handleDownload(activeTab === "resume" ? "resume" : "coverLetter")}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download {activeTab === "resume" ? "Resume" : "Cover Letter"}
              </Button>
              
              <Button
                onClick={handleSaveToDashboard}
                className="flex items-center gap-2"
              >
                Save to Dashboard
              </Button>
              
              <Button
                variant={showRating ? "default" : "outline"}
                onClick={toggleRating}
                className="flex items-center gap-2"
              >
                <Star size={16} />
                {showRating ? "Hide Rating" : "Rate Resume"}
              </Button>
            </div>
          </div>
          
          {showRating && (
            <ResumeRatingCard 
              resumeData={resumeData} 
              resumeContent={generatedContent.resumeContent}
              onClose={() => setShowRating(false)}
            />
          )}
          
          <Tabs defaultValue="resume" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger value="resume" className="flex items-center gap-2">
                <FileText size={16} />
                Resume
              </TabsTrigger>
              <TabsTrigger value="coverLetter" className="flex items-center gap-2">
                <MessageSquare size={16} />
                Cover Letter
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume">
              <Card className="p-8 bg-white max-w-4xl mx-auto shadow-lg">
                <div className="prose prose-sm sm:prose max-w-none">
                  <ReactMarkdown>{generatedContent.resumeContent}</ReactMarkdown>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="coverLetter">
              <Card className="p-8 bg-white max-w-4xl mx-auto shadow-lg">
                <div className="prose prose-sm sm:prose max-w-none">
                  <ReactMarkdown>{generatedContent.coverLetterContent}</ReactMarkdown>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ResumePreview = () => {
  return (
    <ResumeProvider>
      <ResumePreviewInner />
    </ResumeProvider>
  );
};

export default ResumePreview;
