
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Award, CheckCircle, X, Info, ThumbsUp, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIGenerator } from '@/hooks/useAIGenerator';

interface ResumeRatingCardProps {
  resumeData: any;
  resumeContent: string;
  onClose: () => void;
}

interface ResumeScore {
  overall: number;
  content: number;
  structure: number;
  relevance: number;
}

interface ImprovementSuggestion {
  section: string;
  issue: string;
  suggestion: string;
}

const ResumeRatingCard = ({ resumeData, resumeContent, onClose }: ResumeRatingCardProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [score, setScore] = useState<ResumeScore>({ overall: 0, content: 0, structure: 0, relevance: 0 });
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const { toast } = useToast();
  const { generateContent, isGenerating } = useAIGenerator();

  // Analyze the resume
  useEffect(() => {
    const analyzeResume = async () => {
      setIsAnalyzing(true);
      try {
        // Simple algorithm to rate the resume
        await simulateAnalysis();
      } catch (error) {
        console.error("Error analyzing resume:", error);
        toast({
          title: "Analysis Failed",
          description: "There was an error analyzing your resume.",
          variant: "destructive",
        });
      }
      setIsAnalyzing(false);
    };

    analyzeResume();
  }, [resumeContent, toast]);

  // Simulate AI analysis with a scoring algorithm
  const simulateAnalysis = async () => {
    // Wait 1.5 seconds to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple scoring based on resume components
    const contentScore = calculateContentScore();
    const structureScore = calculateStructureScore();
    const relevanceScore = calculateRelevanceScore();
    
    // Overall score is a weighted average
    const overallScore = Math.round((contentScore * 0.4) + (structureScore * 0.3) + (relevanceScore * 0.3));
    
    setScore({
      overall: overallScore,
      content: contentScore,
      structure: structureScore,
      relevance: relevanceScore
    });

    // Generate suggestions based on scores
    const generatedSuggestions = generateSuggestions(contentScore, structureScore, relevanceScore);
    setSuggestions(generatedSuggestions);

    // Identify strengths
    const generatedStrengths = generateStrengths(contentScore, structureScore, relevanceScore);
    setStrengths(generatedStrengths);
  };

  const calculateContentScore = () => {
    let score = 70; // Base score
    
    // Check for personal info completeness
    if (resumeData.personalInfo.name && resumeData.personalInfo.email && resumeData.personalInfo.phone) {
      score += 5;
    }
    
    // Check summary length
    const summaryLength = resumeData.personalInfo.summary?.length || 0;
    if (summaryLength > 200) score += 10;
    else if (summaryLength > 100) score += 5;
    
    // Check experience details
    const experienceScore = resumeData.experiences.reduce((total: number, exp: any) => {
      let points = 0;
      if (exp.title && exp.company) points += 2;
      if (exp.description && exp.description.length > 100) points += 3;
      if (exp.description && exp.description.includes('•')) points += 5; // Bullet points are good
      return total + points;
    }, 0);
    
    score += Math.min(15, experienceScore); // Cap at 15 points
    
    return Math.min(100, score); // Cap at 100
  };

  const calculateStructureScore = () => {
    let score = 65; // Base score
    
    // Check if resume has good section organization
    const sections = ["personal info", "experience", "education", "skills"].filter(
      section => resumeContent.toLowerCase().includes(section)
    );
    
    score += sections.length * 5;
    
    // Check for bullet points
    const bulletPointMatches = resumeContent.match(/•|–|-\s/g);
    const bulletPoints = bulletPointMatches ? bulletPointMatches.length : 0;
    if (bulletPoints > 10) score += 10;
    else if (bulletPoints > 5) score += 5;
    
    return Math.min(100, score); // Cap at 100
  };

  const calculateRelevanceScore = () => {
    // Since we don't have a job description to compare against,
    // use a simpler approach based on skills and keywords
    let score = 75; // Base score
    
    // Check for diverse skills
    if (resumeData.skills.filter(Boolean).length > 5) score += 10;
    else if (resumeData.skills.filter(Boolean).length > 3) score += 5;
    
    // Check for quantifiable achievements
    const achievementPatterns = /increased|improved|achieved|reduced|managed|led|created|developed|implemented/gi;
    const matches = resumeContent.match(achievementPatterns) || [];
    
    if (matches.length > 5) score += 15;
    else if (matches.length > 2) score += 10;
    
    return Math.min(100, score); // Cap at 100
  };

  const generateSuggestions = (contentScore: number, structureScore: number, relevanceScore: number): ImprovementSuggestion[] => {
    const suggestions: ImprovementSuggestion[] = [];
    
    // Content suggestions
    if (contentScore < 80) {
      if (!resumeData.personalInfo.summary || resumeData.personalInfo.summary.length < 100) {
        suggestions.push({
          section: "Summary",
          issue: "Professional summary is too brief or missing",
          suggestion: "Add a compelling professional summary (2-3 sentences) highlighting your key strengths and career goals."
        });
      }
      
      const experienceWithoutBullets = resumeData.experiences.find((exp: any) => 
        !exp.description?.includes('•') && exp.description?.length > 0
      );
      
      if (experienceWithoutBullets) {
        suggestions.push({
          section: "Experience",
          issue: "Job descriptions lack bullet points",
          suggestion: "Convert paragraph descriptions into bullet points that start with action verbs and highlight achievements."
        });
      }
    }
    
    // Structure suggestions
    if (structureScore < 85) {
      suggestions.push({
        section: "Structure",
        issue: "Resume organization could be improved",
        suggestion: "Use clear section headings and consistent formatting throughout your resume."
      });
    }
    
    // Relevance suggestions
    if (relevanceScore < 85) {
      const skillsCount = resumeData.skills.filter(Boolean).length;
      
      if (skillsCount < 5) {
        suggestions.push({
          section: "Skills",
          issue: "Limited skills list",
          suggestion: "Add more relevant skills to showcase your diverse capabilities."
        });
      }
      
      suggestions.push({
        section: "Achievements",
        issue: "Not enough quantifiable achievements",
        suggestion: "Add measurable accomplishments with numbers (e.g., 'Increased sales by 25%' rather than 'Increased sales')."
      });
    }
    
    // If everything looks good but we want to give at least one suggestion
    if (suggestions.length === 0) {
      suggestions.push({
        section: "Polish",
        issue: "Good resume, but can still be refined",
        suggestion: "Consider tailoring your resume for specific job applications by highlighting relevant experiences."
      });
    }
    
    return suggestions;
  };

  const generateStrengths = (contentScore: number, structureScore: number, relevanceScore: number): string[] => {
    const strengths: string[] = [];
    
    if (contentScore >= 85) {
      strengths.push("Strong content with detailed professional information");
    }
    
    if (structureScore >= 85) {
      strengths.push("Well-structured resume with clear organization");
    }
    
    if (relevanceScore >= 85) {
      strengths.push("Good use of relevant skills and achievements");
    }
    
    if (resumeData.personalInfo.summary && resumeData.personalInfo.summary.length > 150) {
      strengths.push("Compelling professional summary");
    }
    
    if (resumeData.experiences.some((exp: any) => exp.description?.includes('•'))) {
      strengths.push("Effective use of bullet points in experience section");
    }
    
    if (resumeData.skills.filter(Boolean).length > 5) {
      strengths.push("Comprehensive skills section");
    }
    
    // Ensure we have at least one strength
    if (strengths.length === 0) {
      strengths.push("Good starting point for a professional resume");
    }
    
    return strengths;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-green-600";
    if (score >= 70) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart2 className="text-resume-primary" />
              Resume Analysis
            </CardTitle>
            <CardDescription>
              AI-powered evaluation of your resume's strengths and weaknesses
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-resume-primary mb-4"></div>
            <p className="text-resume-primary font-medium">Analyzing your resume...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Overall Score */}
              <div className="flex-1 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
                      {score.overall}
                    </span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200 stroke-current" 
                      strokeWidth="10" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                    />
                    <circle 
                      className={`${getScoreColor(score.overall).replace('text-', 'text-')} stroke-current`} 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                      strokeDasharray={`${2.5 * Math.PI * 40 * score.overall / 100} ${2.5 * Math.PI * 40 * (100 - score.overall) / 100}`}
                      strokeDashoffset={`${2.5 * Math.PI * 10}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-center">Overall Score</h3>
              </div>
              
              {/* Detailed Scores */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Content Quality</span>
                    <span className={`text-sm font-medium ${getScoreColor(score.content)}`}>{score.content}%</span>
                  </div>
                  <Progress value={score.content} className={`h-2 ${getProgressColor(score.content)}`} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Structure & Format</span>
                    <span className={`text-sm font-medium ${getScoreColor(score.structure)}`}>{score.structure}%</span>
                  </div>
                  <Progress value={score.structure} className={`h-2 ${getProgressColor(score.structure)}`} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Relevance & Impact</span>
                    <span className={`text-sm font-medium ${getScoreColor(score.relevance)}`}>{score.relevance}%</span>
                  </div>
                  <Progress value={score.relevance} className={`h-2 ${getProgressColor(score.relevance)}`} />
                </div>
              </div>
            </div>
            
            {/* Strengths */}
            <div className="mt-6">
              <h3 className="font-semibold text-green-700 flex items-center gap-2 mb-3">
                <ThumbsUp size={16} />
                Resume Strengths
              </h3>
              <ul className="space-y-1 pl-5 list-disc text-sm">
                {strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            {/* Improvement Suggestions */}
            <div className="mt-6">
              <h3 className="font-semibold text-amber-700 flex items-center gap-2 mb-3">
                <AlertCircle size={16} />
                Improvement Suggestions
              </h3>
              
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-amber-50 border border-amber-200 rounded-md p-4">
                    <div className="font-medium text-amber-800 mb-1">
                      {suggestion.section}: {suggestion.issue}
                    </div>
                    <p className="text-sm text-gray-700">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t flex justify-between">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Info size={14} />
          Analysis is based on resume content quality and industry best practices
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClose}
        >
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeRatingCard;
