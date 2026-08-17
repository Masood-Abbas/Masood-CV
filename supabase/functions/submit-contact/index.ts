import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OWNER_EMAIL = "masoodabas421@gmail.com";

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const name = str(body.name, 100);
    const email = str(body.email, 255);
    const phone = str(body.phone, 40);
    const subject = str(body.subject, 200);
    const message = str(body.message, 5000);

    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid name, email and message." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: row, error } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Failed to store submission:", error.message);
      return new Response(JSON.stringify({ error: "Could not save your message." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Notify the site owner by email (skipped silently if email infra isn't ready yet).
    let emailed = false;
    try {
      const { error: mailError } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-notification",
          recipientEmail: OWNER_EMAIL,
          idempotencyKey: `contact-notification-${row.id}`,
          templateData: {
            name,
            email,
            phone,
            subject,
            message,
            submittedAt: new Date(row.created_at).toUTCString(),
          },
        },
      });
      emailed = !mailError;
      if (mailError) console.error("Email send failed:", mailError.message);
    } catch (e) {
      console.error("Email send threw:", e instanceof Error ? e.message : String(e));
    }

    return new Response(JSON.stringify({ success: true, emailed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("submit-contact error:", e instanceof Error ? e.message : String(e));
    return new Response(JSON.stringify({ error: "Unexpected error. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
