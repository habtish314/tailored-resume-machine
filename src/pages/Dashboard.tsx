
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PlusCircle, File, FileText, Download, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Resume {
  id: string;
  title: string;
  createdAt: string;
  lastModified: string;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching resumes from localStorage
    const fetchResumes = () => {
      setLoading(true);
      try {
        const storedResumes = localStorage.getItem('userResumes');
        if (storedResumes) {
          setResumes(JSON.parse(storedResumes));
        } else {
          // Add sample resumes for demo
          const sampleResumes = [
            {
              id: '1',
              title: 'Software Developer Resume',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '2',
              title: 'Marketing Specialist Resume',
              createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              lastModified: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ];
          setResumes(sampleResumes);
          localStorage.setItem('userResumes', JSON.stringify(sampleResumes));
        }
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleDeleteResume = (id: string) => {
    const updatedResumes = resumes.filter(resume => resume.id !== id);
    setResumes(updatedResumes);
    localStorage.setItem('userResumes', JSON.stringify(updatedResumes));
    
    toast({
      title: "Resume Deleted",
      description: "Your resume has been deleted successfully.",
    });
  };

  const handleDownload = (id: string) => {
    toast({
      title: "Download Started",
      description: "Your resume is being prepared for download.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your resume has been downloaded successfully.",
      });
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-resume-primary">My Dashboard</h1>
            <Button asChild>
              <Link to="/resume-form" className="flex items-center gap-2">
                <PlusCircle size={18} />
                Create New Resume
              </Link>
            </Button>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-resume-primary">My Resumes</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-resume-primary rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <File className="text-gray-400 h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No resumes yet</h3>
                <p className="text-gray-600 mb-6">Create your first resume to get started</p>
                <Button asChild>
                  <Link to="/resume-form" className="flex items-center gap-2 mx-auto">
                    <PlusCircle size={18} />
                    Create New Resume
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {resumes.map((resume) => (
                      <tr key={resume.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-resume-muted">
                              <FileText className="h-5 w-5 text-resume-primary" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {resume.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(resume.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(resume.lastModified)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(resume.id)}
                              className="text-resume-secondary"
                            >
                              <Download size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-resume-primary"
                            >
                              <Link to="/resume-form">
                                <Edit size={16} />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteResume(resume.id)}
                              className="text-red-500"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
