
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AIGenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  text?: string;
}

const AIGenerateButton = ({ onClick, isGenerating, text = 'Generate with AI' }: AIGenerateButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={onClick}
      disabled={isGenerating}
      className="flex items-center gap-1 text-resume-primary"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles size={16} />
          {text}
        </>
      )}
    </Button>
  );
};

export default AIGenerateButton;
