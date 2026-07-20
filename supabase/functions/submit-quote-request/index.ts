// Supabase Edge Function (Deno). Deploy with: supabase functions deploy submit-quote-request
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// No email notification is sent on submission — there's no transactional
// email service (Resend/Postmark/etc.) configured for this project.
// Requests land in the quote_requests table only; review them via Supabase
// Studio. Wire up email notification later if that becomes a problem.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_BUYER_TYPES = ['government', 'education', 'nonprofit_disaster_response', 'commercial', 'other'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as {
      organizationName?: string;
      contactName?: string;
      email?: string;
      phone?: string;
      buyerType?: string;
      poNumber?: string;
      deliveryLocation?: string;
      itemsDescription?: string;
    };

    const required = {
      organization_name: body.organizationName?.trim(),
      contact_name: body.contactName?.trim(),
      email: body.email?.trim(),
      delivery_location: body.deliveryLocation?.trim(),
      items_description: body.itemsDescription?.trim(),
    };

    const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length > 0) {
      return new Response(JSON.stringify({ error: `Missing required fields: ${missing.join(', ')}` }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!body.buyerType || !VALID_BUYER_TYPES.includes(body.buyerType)) {
      return new Response(JSON.stringify({ error: 'Invalid buyer type' }), { status: 400, headers: corsHeaders });
    }

    // Loose sanity check, not full RFC validation — just catches empty/garbage input.
    if (!required.email!.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { error } = await supabase.from('quote_requests').insert({
      organization_name: required.organization_name,
      contact_name: required.contact_name,
      email: required.email,
      phone: body.phone?.trim() || null,
      buyer_type: body.buyerType,
      po_number: body.poNumber?.trim() || null,
      delivery_location: required.delivery_location,
      items_description: required.items_description,
    });

    if (error) {
      return new Response(JSON.stringify({ error: 'Could not submit request — please try again.' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
