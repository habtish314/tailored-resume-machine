
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAIGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const generateContent = async (resumeData: any, type: 'resume' | 'coverLetter' | 'analysis', customPrompt?: string) => {
    setIsGenerating(true);

    try {
      // If user is not logged in or we're in demo mode, provide demo content
      if (!currentUser) {
        console.log('No authenticated user found, using demo content instead');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add small delay to simulate API call
        return type === 'analysis' 
          ? generateDemoAnalysis(resumeData)
          : generateDemoContent(resumeData, type);
      }

      // Attempt to call the Supabase function with enhanced error handling
      try {
        console.log(`Calling generate-resume-content with type: ${type}`);
        const { data, error } = await supabase.functions.invoke('generate-resume-content', {
          body: { 
            resumeData, 
            type, 
            customPrompt,
            enhancedGeneration: true,
            style: 'professional' // Default style
          },
        });

        if (error) {
          console.error('Error generating content:', error);
          toast({
            title: "Using Demo Content",
            description: "We're having trouble connecting to our AI service. Using sample content instead.",
            variant: "default",
          });
          return type === 'analysis' 
            ? generateDemoAnalysis(resumeData)
            : generateDemoContent(resumeData, type);
        }

        toast({
          title: "Content Generated",
          description: `Your ${type === 'resume' ? 'resume' : type === 'coverLetter' ? 'cover letter' : 'analysis'} has been generated successfully.`,
        });

        return data.content;
      } catch (error) {
        console.error('Supabase function error:', error);
        // Fall back to demo content if the Supabase function fails
        toast({
          title: "Using Demo Content",
          description: "We're having trouble connecting to our AI service. Using sample content instead.",
          variant: "default",
        });
        return type === 'analysis' 
          ? generateDemoAnalysis(resumeData)
          : generateDemoContent(resumeData, type);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Using Demo Content",
        description: "An unexpected error occurred. Using sample content instead.",
        variant: "default",
      });
      return type === 'analysis' 
        ? generateDemoAnalysis(resumeData)
        : generateDemoContent(resumeData, type);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFullResume = async (resumeData: any) => {
    try {
      setIsGenerating(true);
      
      // Generate both resume and cover letter
      const resumeContent = await generateContent(resumeData, 'resume');
      const coverLetterContent = await generateContent(resumeData, 'coverLetter');
      
      if (!resumeContent || !coverLetterContent) {
        throw new Error("Failed to generate complete resume package");
      }
      
      return { resumeContent, coverLetterContent };
    } catch (error) {
      console.error('Error generating full resume:', error);
      toast({
        title: "Using Demo Content",
        description: "We're having trouble with generation. Using sample content instead.",
        variant: "default",
      });
      
      // Provide demo content as fallback
      const resumeContent = generateDemoContent(resumeData, 'resume');
      const coverLetterContent = generateDemoContent(resumeData, 'coverLetter');
      return { resumeContent, coverLetterContent };
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate resume analysis
  const generateResumeAnalysis = async (resumeData: any, resumeContent: string) => {
    try {
      setIsGenerating(true);
      const analysis = await generateContent(
        { ...resumeData, resumeContent }, 
        'analysis',
        'Provide a detailed analysis of this resume including strengths, weaknesses, and suggestions for improvement'
      );
      
      return analysis;
    } catch (error) {
      console.error('Error generating resume analysis:', error);
      return generateDemoAnalysis(resumeData);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to generate demo analysis content when the real AI service isn't available
  const generateDemoAnalysis = (resumeData: any): any => {
    // Create a mock analysis response
    return {
      score: {
        overall: 78,
        content: 75,
        structure: 80,
        relevance: 79
      },
      strengths: [
        "Clear presentation of work experience",
        "Good organization of sections",
        "Professional summary provides a good overview"
      ],
      weaknesses: [
        "Could use more quantifiable achievements",
        "Skills section could be more comprehensive",
        "Some formatting inconsistencies"
      ],
      suggestions: [
        {
          section: "Experience",
          issue: "Descriptions are somewhat general",
          suggestion: "Add more specific achievements with metrics and numbers to demonstrate impact"
        },
        {
          section: "Skills",
          issue: "Limited list of technical skills",
          suggestion: "Expand your skills section to showcase more of your relevant abilities"
        },
        {
          section: "Summary",
          issue: "Professional summary could be more targeted",
          suggestion: "Tailor your summary to highlight your most impressive achievements and career goals"
        }
      ]
    };
  };

  // Function to generate demo content when the real AI service isn't available
  const generateDemoContent = (resumeData: any, type: 'resume' | 'coverLetter'): string => {
    const { personalInfo, experiences, education, skills } = resumeData;
    
    if (type === 'resume') {
      return `# ${personalInfo.name || 'Your Name'}
${personalInfo.jobTitle ? `## ${personalInfo.jobTitle}` : ''}

## Contact
- Email: ${personalInfo.email || 'your.email@example.com'}
- Phone: ${personalInfo.phone || '(123) 456-7890'}
- Location: ${personalInfo.location || 'City, State'}
${personalInfo.website ? `- Website: ${personalInfo.website}` : ''}
${personalInfo.linkedin ? `- LinkedIn: ${personalInfo.linkedin}` : ''}
${personalInfo.github ? `- GitHub: ${personalInfo.github}` : ''}

## Professional Summary
${personalInfo.summary || 'A dedicated professional with experience in various fields seeking new opportunities.'}

## Experience
${experiences[0]?.title ? experiences.map(exp => 
`### ${exp.title} at ${exp.company || 'Company'}
**${exp.startDate || 'Start Date'} - ${exp.endDate || 'Present'} | ${exp.location || 'Location'}**

${exp.description || '• Responsibility 1\n• Responsibility 2\n• Achievement 1'}
`).join('\n\n') : '### Position at Company\n**Date - Present | Location**\n\n• Achieved significant results\n• Led important projects\n• Collaborated with cross-functional teams'}

## Education
${education[0]?.school ? education.map(edu => 
`### ${edu.degree || 'Degree'} in ${edu.field || 'Field of Study'}
**${edu.school || 'University Name'} | ${edu.startDate || 'Start Date'} - ${edu.endDate || 'End Date'}**
`).join('\n\n') : '### Degree in Field\n**University Name | Year - Year**'}

## Skills
${skills.filter(Boolean).length ? skills.filter(Boolean).join(', ') : '• Skill 1\n• Skill 2\n• Skill 3\n• Skill 4'}`;
    } else {
      // Cover Letter Template
      return `# ${personalInfo.name || 'Your Name'}

${new Date().toLocaleDateString()}

Dear Hiring Manager,

I am writing to express my interest in the [Position] role at [Company Name]. With my background in ${experiences[0]?.title || 'the relevant field'} and passion for delivering results, I believe I would be a valuable addition to your team.

${personalInfo.summary || 'I am a dedicated professional with a strong work ethic and commitment to excellence.'}

Throughout my career at ${experiences[0]?.company || 'previous companies'}, I have ${experiences[0]?.description?.substring(0, 100) || 'developed valuable skills and achieved significant results'}. My experience has equipped me with the skills necessary to excel in this role.

I am particularly drawn to [Company Name] because of its reputation for [company value or achievement]. I am excited about the opportunity to contribute to your team and help achieve your goals.

Thank you for considering my application. I look forward to the possibility of discussing how my background, skills, and experiences may benefit your organization.

Sincerely,
${personalInfo.name || 'Your Name'}
${personalInfo.email || 'your.email@example.com'}
${personalInfo.phone || '(123) 456-7890'}`;
    }
  };

  return {
    generateContent,
    generateFullResume,
    generateResumeAnalysis,
    isGenerating
  };
};
