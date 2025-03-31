
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const EmailSignupDisabledAlert = () => {
  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-800" />
      <AlertTitle className="text-amber-800">Email signups are currently disabled</AlertTitle>
      <AlertDescription className="text-amber-700">
        Please use Google or LinkedIn authentication to create an account.
      </AlertDescription>
    </Alert>
  );
};

export default EmailSignupDisabledAlert;
