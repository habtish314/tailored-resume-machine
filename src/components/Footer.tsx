
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-resume-primary">AIResume</h3>
            <p className="text-gray-600">
              Create professional resumes and cover letters with the power of AI.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-resume-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-resume-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/resume-form" className="text-gray-600 hover:text-resume-accent">
                  Create Resume
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-resume-accent">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-resume-primary">Contact</h3>
            <p className="text-gray-600">
              Have questions or feedback? <br />
              <a href="mailto:support@airesume.com" className="text-resume-accent hover:underline">
                support@airesume.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AIResume. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
