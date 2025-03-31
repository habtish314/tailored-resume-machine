
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Mail, Linkedin } from "lucide-react";

interface OAuthButtonsProps {
  onGoogleSignup: () => Promise<void>;
  onLinkedInSignup: () => Promise<void>;
  disabled: boolean;
}

const OAuthButtons = ({ onGoogleSignup, onLinkedInSignup, disabled }: OAuthButtonsProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOAuthClick = async (provider: 'google' | 'linkedin') => {
    try {
      setLoading(true);
      if (provider === 'google') {
        await onGoogleSignup();
      } else {
        await onLinkedInSignup();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to sign up with ${provider}`,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <p className="text-center text-gray-700 mb-2">Sign up with</p>
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={() => handleOAuthClick('google')}
          disabled={disabled || loading}
          className="w-full"
        >
          <Mail className="mr-2 h-4 w-4" />
          Google
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => handleOAuthClick('linkedin')}
          disabled={disabled || loading}
          className="w-full"
        >
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
};

export default OAuthButtons;
