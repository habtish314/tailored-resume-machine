
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ConfirmationMessageProps {
  email: string;
  onLoginClick: () => void;
}

const ConfirmationMessage = ({ email, onLoginClick }: ConfirmationMessageProps) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle className="text-blue-800">Check your email</AlertTitle>
        <AlertDescription className="text-blue-700">
          We've sent a confirmation link to {email}. Please check your inbox and click the link to activate your account.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <p className="text-center text-gray-600">
          Didn't receive the email? Check your spam folder or try again.
        </p>
        <Button 
          className="w-full" 
          onClick={onLoginClick}
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
