// Supabase Edge Function: ai-chat
// Proxies AI Studio chat requests to Gemini or Groq, keeping API keys server-side.
//
// Deploy: supabase functions deploy ai-chat
// Secrets needed (set once): supabase secrets set GEMINI_API_KEY=xxx GROQ_API_KEY=xxx

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { model, modelId, messages } = (await req.json()) as {
      model?: string;
      modelId?: string;
      messages?: IncomingMessage[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let replyText = "";

    if (model?.startsWith("openrouter")) {
      const apiKey = Deno.env.get("OPENROUTER_API_KEY");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "OPENROUTER_API_KEY is not set on the server. Add it as a Supabase secret." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ritronix.ai",
          "X-Title": "Ritronix Ai",
        },
        body: JSON.stringify({
          model: modelId || "openrouter/free",
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: data?.error?.message || "OpenRouter API error" }),
          { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      replyText = data.choices?.[0]?.message?.content ?? "";
    } else if (model === "groq") {
      const apiKey = Deno.env.get("GROQ_API_KEY");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "GROQ_API_KEY is not set on the server. Add it as a Supabase secret." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: data?.error?.message || "Groq API error" }),
          { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      replyText = data.choices?.[0]?.message?.content ?? "";
    } else {
      // default provider: gemini
      const apiKey = Deno.env.get("GEMINI_API_KEY");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "GEMINI_API_KEY is not set on the server. Add it as a Supabase secret." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        return new Response(
          JSON.stringify({ error: data?.error?.message || "Gemini API error" }),
          { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      replyText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    }

    return new Response(JSON.stringify({ reply: replyText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
