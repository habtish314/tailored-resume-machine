
import QuickGenerateButton from "@/components/resume/QuickGenerateButton";

interface ResumeFormHeaderProps {
  handleQuickGenerate: () => void;
  isGenerating: boolean;
}

const ResumeFormHeader = ({ handleQuickGenerate, isGenerating }: ResumeFormHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-resume-primary">Create Your Resume</h1>
      <QuickGenerateButton 
        handleQuickGenerate={handleQuickGenerate} 
        isGenerating={isGenerating} 
      />
    </div>
  );
};

export default ResumeFormHeader;
