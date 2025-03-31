
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface QuickGenerateButtonProps {
  handleQuickGenerate: () => void;
  isGenerating: boolean;
}

const QuickGenerateButton = ({ handleQuickGenerate, isGenerating }: QuickGenerateButtonProps) => {
  return (
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
  );
};

export default QuickGenerateButton;
