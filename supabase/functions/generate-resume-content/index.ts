
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://knconqoinrqxnfpczham.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data with enhanced options
    const { 
      resumeData, 
      type = 'resume', 
      customPrompt = '',
      enhancedGeneration = false,
      style = 'professional'
    } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create authenticated Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false }
    });
    
    // Get user data from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct the enhanced prompt based on resume data and options
    let prompt = '';
    let systemPrompt = '';
    
    if (enhancedGeneration) {
      // Enhanced system prompt with style guidance
      systemPrompt = `You are an expert professional resume and cover letter writer specializing in the ${style} style. 
Create highly effective, ATS-friendly content that highlights achievements and key qualifications.
Use concise bullet points, strong action verbs, and quantifiable results wherever possible.
Format output in clean, readable markdown that will look professional when rendered.`;
    } else {
      systemPrompt = `You are an expert resume and cover letter writer. Create professional ${type} content based on the user's information.`;
    }
    
    if (type === 'resume') {
      prompt = `Create a professional resume for ${resumeData.personalInfo.name}, who has the following information:
      
Professional Title: ${resumeData.personalInfo.jobTitle || 'Not specified'}
      
Professional Summary: ${resumeData.personalInfo.summary || 'No summary provided'}

Experience:
${resumeData.experiences.map(exp => 
  `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  ${exp.description || 'No description provided'}`
).join('\n\n')}

Education:
${resumeData.education.map(edu => 
  `${edu.degree} in ${edu.field} from ${edu.school} (${edu.startDate} - ${edu.endDate})`
).join('\n\n')}

Skills: ${resumeData.skills.filter(Boolean).join(', ')}

${resumeData.certifications.filter(Boolean).length ? 
  `Certifications: ${resumeData.certifications.filter(Boolean).join(', ')}` : ''}

${resumeData.hobbies.filter(Boolean).length ? 
  `Hobbies & Interests: ${resumeData.hobbies.filter(Boolean).join(', ')}` : ''}

Please create a well-formatted, professional resume in markdown format. Be concise, highlight achievements, and focus on relevant skills and experiences. ${customPrompt}`;
    } else if (type === 'coverLetter') {
      prompt = `Create a professional cover letter for ${resumeData.personalInfo.name}, who has the following information:
      
Professional Title: ${resumeData.personalInfo.jobTitle || 'Not specified'}
      
Professional Summary: ${resumeData.personalInfo.summary || 'No summary provided'}

Experience:
${resumeData.experiences.map(exp => 
  `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  ${exp.description || 'No description provided'}`
).join('\n\n')}

Skills: ${resumeData.skills.filter(Boolean).join(', ')}

Please write a general cover letter that can be customized for specific job applications. The cover letter should be in markdown format, professional in tone, and highlight key skills and experiences. Do not reference a specific company, but leave placeholders like [Company Name] and [Position] that can be filled in later. ${customPrompt}`;
    } else if (type === 'analysis') {
      // For resume analysis
      systemPrompt = `You are an expert resume reviewer who analyzes resumes and provides detailed feedback. 
You assess resumes based on content quality, structure/formatting, and relevance/impact.
Your analysis is honest but constructive, aimed at helping job seekers improve their resumes.`;

      prompt = `Analyze the following resume and provide detailed feedback:

${resumeData.resumeContent}

Please provide a comprehensive analysis including:
1. An overall score (0-100) and scores for content quality, structure, and relevance
2. 3-5 specific strengths of the resume
3. 3-5 specific weaknesses or areas for improvement
4. Detailed suggestions for improvement for each section (work experience, education, skills, etc.)

Format your response as a JSON object with the following structure:
{
  "score": {
    "overall": number,
    "content": number,
    "structure": number,
    "relevance": number
  },
  "strengths": [string, string, ...],
  "weaknesses": [string, string, ...],
  "suggestions": [
    {
      "section": string,
      "issue": string,
      "suggestion": string
    },
    ...
  ]
}

${customPrompt}`;
    }

    console.log(`Generating ${type} for user ${user.id} with style: ${style}`);

    // Call OpenAI API with enhanced model selection
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: enhancedGeneration ? 'gpt-4o' : 'gpt-4o-mini', // Use more powerful model for enhanced generation
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          { role: 'user', content: prompt }
        ],
        temperature: style === 'creative' ? 0.8 : 0.6, // Adjust creativity based on style
        response_format: type === 'analysis' ? { type: "json_object" } : undefined
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openAIData = await openAIResponse.json();
    const generatedContent = openAIData.choices[0].message.content;

    // Store the generated content in the database
    const { data: contentData, error: contentError } = await supabase
      .from('ai_generated_content')
      .insert({
        user_id: user.id,
        prompt,
        content: generatedContent,
        content_type: type
      })
      .select('id')
      .single();

    if (contentError) {
      console.error('Error saving content to database:', contentError);
    } else {
      console.log(`Content saved with ID: ${contentData.id}`);
    }

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-resume-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
