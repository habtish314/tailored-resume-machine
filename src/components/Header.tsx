
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract name from user metadata
  const userName = currentUser?.user_metadata?.name || 
                  currentUser?.user_metadata?.full_name || 
                  'User';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-resume-primary flex items-center">
          <span className="text-resume-accent">AI</span>Resume
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-resume-primary">
                Dashboard
              </Link>
              <Link to="/resume-form" className="text-gray-600 hover:text-resume-primary">
                Create Resume
              </Link>
              <div className="flex items-center ml-4">
                <span className="mr-4 text-gray-600">
                  Hello, {userName}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-resume-primary">
                Log In
              </Link>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white py-4 px-4 border-t">
          <ul className="space-y-4">
            {currentUser ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="block text-gray-600 hover:text-resume-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resume-form"
                    className="block text-gray-600 hover:text-resume-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Resume
                  </Link>
                </li>
                <li className="pt-2 border-t">
                  <span className="block text-gray-600 mb-2">
                    Hello, {userName}
                  </span>
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Log Out
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block text-gray-600 hover:text-resume-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
