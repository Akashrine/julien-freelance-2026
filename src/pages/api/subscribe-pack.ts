export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.LOOPS_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Configuration manquante." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { email?: string; source?: string } = {};
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Payload invalide." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const email = body.email?.trim();
  const source = body.source?.trim();

  if (!email || !source) {
    return new Response(JSON.stringify({ error: "Email et source requis." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Email invalide." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const loopsResponse = await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        eventName: "tool_signup",
        eventProperties: { source },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!loopsResponse.ok) {
      return new Response(JSON.stringify({ error: "Erreur lors de l'inscription." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    clearTimeout(timeoutId);
    return new Response(JSON.stringify({ error: "Erreur lors de l'inscription." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
