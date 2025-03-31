
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
    // Get request data
    const { resumeData, type = 'resume' } = await req.json();
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

    // Construct the prompt based on resume data
    let prompt = '';
    
    if (type === 'resume') {
      prompt = `Create a professional resume for ${resumeData.personalInfo.name}, who has the following information:
      
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

Please create a well-formatted, professional resume in markdown format. Be concise, highlight achievements, and focus on relevant skills and experiences.`;
    } else if (type === 'coverLetter') {
      prompt = `Create a professional cover letter for ${resumeData.personalInfo.name}, who has the following information:
      
Professional Summary: ${resumeData.personalInfo.summary || 'No summary provided'}

Experience:
${resumeData.experiences.map(exp => 
  `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  ${exp.description || 'No description provided'}`
).join('\n\n')}

Skills: ${resumeData.skills.filter(Boolean).join(', ')}

Please write a general cover letter that can be customized for specific job applications. The cover letter should be in markdown format, professional in tone, and highlight key skills and experiences. Do not reference a specific company, but leave placeholders like [Company Name] and [Position] that can be filled in later.`;
    }

    console.log(`Generating ${type} for user ${user.id}`);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume and cover letter writer. Create professional ${type} content based on the user's information.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
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
