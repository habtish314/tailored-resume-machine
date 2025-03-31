
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ResumeProvider } from "@/contexts/ResumeContext";
import ResumeFormContainer from "@/components/resume/ResumeFormContainer";

const ResumeFormInner = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <ResumeFormContainer />
      </main>
      
      <Footer />
    </div>
  );
};

const ResumeForm = () => {
  return (
    <ResumeProvider>
      <ResumeFormInner />
    </ResumeProvider>
  );
};

export default ResumeForm;
