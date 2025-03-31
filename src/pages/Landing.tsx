
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Sparkles, Download, Clock } from "lucide-react";

const Landing = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-resume-primary to-resume-secondary py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Create Professional Resumes with AI
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Build standout resumes and cover letters in minutes using our AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="bg-white text-resume-primary hover:bg-gray-100">
                <Link to={currentUser ? "/resume-form" : "/signup"}>
                  {currentUser ? "Create Resume" : "Get Started Free"}
                </Link>
              </Button>
              {!currentUser && (
                <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10">
                  <Link to="/login">
                    I Already Have an Account
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-resume-primary">
              AI-Powered Resume Building
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="bg-resume-muted p-3 rounded-full">
                    <FileText className="text-resume-primary h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-resume-primary">
                  AI-Generated Content
                </h3>
                <p className="text-gray-600 text-center">
                  Let our AI create professional descriptions and highlights based on your experience.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="bg-resume-muted p-3 rounded-full">
                    <Sparkles className="text-resume-primary h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-resume-primary">
                  Beautiful Templates
                </h3>
                <p className="text-gray-600 text-center">
                  Choose from professionally designed templates that stand out to recruiters.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="bg-resume-muted p-3 rounded-full">
                    <Download className="text-resume-primary h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-resume-primary">
                  Easy Download
                </h3>
                <p className="text-gray-600 text-center">
                  Download your resume as a PDF file ready to send to potential employers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Preview Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-resume-primary">
              Resume Preview
            </h2>
            <p className="text-xl text-center text-gray-600 mb-10 max-w-3xl mx-auto">
              Here's an example of what your professional resume could look like.
            </p>
            
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6 bg-resume-primary text-white">
                <h3 className="text-2xl font-bold">Alex Johnson</h3>
                <p className="text-sm mt-1">Product Manager | San Francisco, CA</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span>alex.johnson@email.com</span>
                  <span>•</span>
                  <span>(555) 123-4567</span>
                  <span>•</span>
                  <span>linkedin.com/in/alexjohnson</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3 text-resume-primary">
                    SUMMARY
                  </h4>
                  <p className="text-gray-700">
                    Innovative Product Manager with 6+ years of experience leading cross-functional teams to deliver user-centered digital products. Skilled in product strategy, user research, and agile methodologies with a track record of increasing user engagement by 40%.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3 text-resume-primary">
                    EXPERIENCE
                  </h4>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <h5 className="font-semibold">Senior Product Manager</h5>
                      <span className="text-sm text-gray-500">Jan 2020 - Present</span>
                    </div>
                    <div className="text-sm font-medium text-resume-secondary mb-2">
                      TechCorp Inc., San Francisco, CA
                    </div>
                    <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                      <li>Led the development of a new mobile app that increased user engagement by 40%</li>
                      <li>Managed a $2M product budget and prioritized features for quarterly releases</li>
                      <li>Collaborated with engineering, design, and marketing teams to launch 5 major features</li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start">
                      <h5 className="font-semibold">Product Manager</h5>
                      <span className="text-sm text-gray-500">Mar 2017 - Dec 2019</span>
                    </div>
                    <div className="text-sm font-medium text-resume-secondary mb-2">
                      StartupXYZ, San Francisco, CA
                    </div>
                    <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                      <li>Defined product roadmap and sprint priorities for a team of 8 developers</li>
                      <li>Conducted user research and usability testing to inform product decisions</li>
                      <li>Implemented agile methodologies that improved delivery timelines by 25%</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-3 text-resume-primary">
                    SKILLS
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-resume-muted px-3 py-1 rounded-full text-sm">Product Strategy</span>
                    <span className="bg-resume-muted px-3 py-1 rounded-full text-sm">User Research</span>
                    <span className="bg-resume-muted px-3 py-1 rounded-full text-sm">Agile/Scrum</span>
                    <span className="bg-resume-muted px-3 py-1 rounded-full text-sm">A/B Testing</span>
                    <span className="bg-resume-muted px-3 py-1 rounded-full text-sm">Product Analytics</span>
                    <span className="bg-resume-muted px-3 py-1 rounded-full text-sm">Jira</span>
                    <span className="bg-resume-muted px-3 py-1 rounded-full text-sm">Figma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-resume-primary py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Create Your Professional Resume?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who've used our AI to land their dream jobs.
            </p>
            <Button size="lg" asChild className="bg-white text-resume-primary hover:bg-gray-100">
              <Link to={currentUser ? "/resume-form" : "/signup"}>
                {currentUser ? "Create My Resume" : "Get Started Free"}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
