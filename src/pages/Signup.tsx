
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Linkedin, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [emailSignupsDisabled, setEmailSignupsDisabled] = useState(false);
  const { signup, googleLogin, linkedinLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
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
      
      // Don't navigate automatically - wait for confirmation or user action
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
            
            {emailSignupsDisabled && (
              <Alert className="mb-6 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-800" />
                <AlertTitle className="text-amber-800">Email signups are currently disabled</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Please use Google or LinkedIn authentication to create an account.
                </AlertDescription>
              </Alert>
            )}
            
            {showConfirmMessage ? (
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
                    onClick={handleLoginClick}
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-center text-gray-700 mb-2">Sign up with</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleGoogleSignup}
                      disabled={loading}
                      className="w-full"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleLinkedInSignup}
                      disabled={loading}
                      className="w-full"
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or with email</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={emailSignupsDisabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={emailSignupsDisabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={emailSignupsDisabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={emailSignupsDisabled}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || emailSignupsDisabled}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
                
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
