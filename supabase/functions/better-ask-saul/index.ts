
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are not configured correctly');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch leads with less restrictive filter - don't filter by user_id initially
    console.log("Fetching all leads in the database:");
    const { data: allLeads, error: leadsError } = await supabase
      .from('leads')
      .select('*');
    
    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw new Error(`Failed to fetch leads: ${leadsError.message}`);
    }
    
    // Log all leads to help with debugging
    console.log(`Found ${allLeads?.length || 0} total leads in database`);
    if (allLeads && allLeads.length > 0) {
      console.log("All leads in database:");
      allLeads.forEach((lead, index) => {
        console.log(`Lead ${index + 1}:`, JSON.stringify({
          id: lead.id,
          client_name: lead.client_name,
          email: lead.email_address,
          user_id: lead.user_id
        }));
      });
    }

    // Then filter for user's leads if userId is provided
    const leads = userId 
      ? allLeads.filter(lead => lead.user_id === userId || lead.user_id === null)
      : allLeads;
    
    console.log(`After filtering, found ${leads?.length || 0} leads for user ${userId || 'anonymous'}`);
    
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');
      
    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      throw new Error(`Failed to fetch projects: ${projectsError.message}`);
    }

    const { data: tasks, error: tasksError } = await supabase
      .from('project_tasks')
      .select('*');

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }

    // Create dynamic context based on the data with more detailed information
    const contextData = `
You are Saul, an AI assistant for CRM and business development.
You have access to the following CRM data:

Leads (${leads?.length || 0} total):
${leads?.map(lead => {
  return `- Client: ${lead.client_name}
  Email: ${lead.email_address || 'Not provided'}
  Phone: ${lead.contact_number || 'Not provided'}
  Status: ${lead.status || 'New'}
  Source: ${lead.source || 'Not specified'}
  Business: ${lead.business_description || 'Not provided'}
  Services: ${lead.services_required || 'Not specified'}
  Budget: ${lead.budget || 'Not specified'}
  Location: ${lead.city_state || 'Not provided'}
  Agent: ${lead.agent || 'Not assigned'}
  Notes: ${lead.additional_info || 'None'}`;
}).join('\n\n') || 'No leads found'}

Projects (${projects?.length || 0} total):
${projects?.map(project => `- ${project.name} (${project.status}): Due on ${project.due_date}, Client: ${project.client}, Progress: ${project.progress || 0}%`).join('\n') || 'No projects found'}

Tasks (${tasks?.length || 0} total):
${tasks?.map(task => `- ${task.title} (${task.status}): Due on ${task.due_date || 'No date'}, Priority: ${task.priority}`).join('\n') || 'No tasks found'}

Keep your responses professional, concise and focused on helping the user manage their business effectively.
If asked about specific data, provide exact numbers and details from the available information.
If asked about specific leads, projects, or tasks, search through the data carefully and provide all relevant details.
If asked about trends or patterns, analyze the available data to provide insights.
If asked about a specific client or lead that you can't find, explain that you don't have that information in your current dataset.

IMPORTANT: When searching for leads or clients, make sure to check for partial matches in client names, not just exact matches. Be thorough in your search.
If the user asks about a specific client, check if any part of the client's name matches what the user asked about.
`;

    try {
      console.log("Sending request to OpenAI with context length:", contextData.length);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: contextData },
            ...messages.slice(-10) // Keep last 10 messages for context
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      console.log("Successfully received response from OpenAI");

      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (openaiError) {
      console.error('Error calling OpenAI API:', openaiError);
      throw new Error(`Failed to communicate with OpenAI: ${openaiError.message}`);
    }
    
  } catch (error) {
    console.error('Error in function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
