export const prerender = false;

import type { APIRoute } from 'astro';
import { gatedPrompts } from '../../lib/pack-prompts';

export const GET: APIRoute = async ({ request }) => {
  const unlockedHeader = request.headers.get("x-pack-unlocked");

  if (unlockedHeader !== "true") {
    return new Response(JSON.stringify({ error: "Accès restreint." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ prompts: gatedPrompts }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
