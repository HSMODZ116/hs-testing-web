import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory cache (resets on cold start)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');

    if (!query) {
      console.log('No query provided');
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Looking up query: ${query}`);

    // Check cache first
    const cached = cache.get(query);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Cache hit for query: ${query}`);
      return new Response(
        JSON.stringify(cached.data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' } }
      );
    }

    console.log(`Cache miss for query: ${query}, fetching from API...`);

    // Fetch from external API
    const apiResponse = await fetch(
      `https://zaynix-api-osint.vercel.app/api/lookup?query=${query}&pretty=1`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LovableProxy/1.0)',
        },
      }
    );

    if (!apiResponse.ok) {
      console.error(`API returned status: ${apiResponse.status}`);
      return new Response(
        JSON.stringify({ error: 'External API error', status: apiResponse.status }),
        { status: apiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await apiResponse.json();
    console.log(`API response received, results count: ${data.results_count || 0}`);

    // Cache the result
    cache.set(query, { data, timestamp: Date.now() });

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' } }
    );
  } catch (error) {
    console.error('Error in lookup function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
