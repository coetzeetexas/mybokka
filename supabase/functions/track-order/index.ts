// Supabase Edge Function (Deno). Deploy with: supabase functions deploy track-order
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderNumber, email } = (await req.json()) as { orderNumber?: string; email?: string };
    if (!orderNumber?.trim() || !email?.trim()) {
      return new Response(JSON.stringify({ error: 'Order number and email are required.' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Match on both order number and email together — a mismatch on either
    // returns the same generic "not found" so this can't be used to probe
    // for valid order numbers or confirm an email placed an order.
    const { data: order, error } = await supabase
      .from('orders')
      .select(
        'id, order_number, status, cancellation_reason, subtotal, shipping_cost, tax, total, tracking_number, tracking_url, created_at'
      )
      .eq('order_number', orderNumber.trim().toUpperCase())
      .ilike('customer_email', email.trim())
      .maybeSingle();

    if (error || !order) {
      return new Response(JSON.stringify({ error: 'No order found with that order number and email.' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const { data: items } = await supabase
      .from('order_items')
      .select('product_name_snapshot, quantity, line_total')
      .eq('order_id', order.id);

    return new Response(
      JSON.stringify({
        orderNumber: order.order_number,
        status: order.status,
        cancellationReason: order.cancellation_reason,
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        tax: order.tax,
        total: order.total,
        trackingNumber: order.tracking_number,
        trackingUrl: order.tracking_url,
        createdAt: order.created_at,
        items: items ?? [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
