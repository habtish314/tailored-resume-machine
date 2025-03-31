
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  currentTab: string;
  handlePreviousTab: () => void;
  handleNextTab: () => void;
  isGenerating: boolean;
}

const NavigationButtons = ({ 
  currentTab, 
  handlePreviousTab, 
  handleNextTab, 
  isGenerating 
}: NavigationButtonsProps) => {
  return (
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
  );
};

export default NavigationButtons;
