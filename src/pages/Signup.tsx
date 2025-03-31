
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OAuthButtons from "@/components/auth/OAuthButtons";
import EmailSignupForm from "@/components/auth/EmailSignupForm";
import ConfirmationMessage from "@/components/auth/ConfirmationMessage";
import EmailSignupDisabledAlert from "@/components/auth/EmailSignupDisabledAlert";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [emailSignupsDisabled, setEmailSignupsDisabled] = useState(false);
  const { signup, googleLogin, linkedinLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFormSubmit = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      setEmail(email);
      const { success, message } = await signup(email, password, name);
      
      if (!success) {
        if (message && message.includes("Email signups are disabled")) {
          setEmailSignupsDisabled(true);
        }
        return;
      }
      
      // Check if we need to show the confirmation email message
      setShowConfirmMessage(true);
      
      toast({
        title: "Success",
        description: "Your account has been created.",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await googleLogin();
      // The redirect will be handled by the OAuth provider and the redirectTo option
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account with Google",
        variant: "destructive",
      });
      console.error(error);
      setLoading(false);
    }
  };

  const handleLinkedInSignup = async () => {
    try {
      setLoading(true);
      await linkedinLogin();
      // The redirect will be handled by the OAuth provider and the redirectTo option
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account with LinkedIn",
        variant: "destructive",
      });
      console.error(error);
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-6 text-resume-primary">
              Create an Account
            </h1>
            
            {emailSignupsDisabled && <EmailSignupDisabledAlert />}
            
            {showConfirmMessage ? (
              <ConfirmationMessage email={email} onLoginClick={handleLoginClick} />
            ) : (
              <>
                <OAuthButtons
                  onGoogleSignup={handleGoogleSignup}
                  onLinkedInSignup={handleLinkedInSignup}
                  disabled={loading}
                />
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or with email</span>
                  </div>
                </div>
                
                <EmailSignupForm
                  onSubmit={handleFormSubmit}
                  loading={loading}
                  disabled={emailSignupsDisabled}
                />
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-resume-accent hover:underline">
                      Log in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
