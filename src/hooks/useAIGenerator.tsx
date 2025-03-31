
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAIGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const generateContent = async (resumeData: any, type: 'resume' | 'coverLetter') => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the AI generation feature.",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-resume-content', {
        body: { resumeData, type },
      });

      if (error) {
        console.error('Error generating content:', error);
        toast({
          title: "Generation Failed",
          description: error.message || "An error occurred while generating content.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Content Generated",
        description: `Your ${type === 'resume' ? 'resume' : 'cover letter'} has been generated successfully.`,
      });

      return data.content;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    isGenerating
  };
};
