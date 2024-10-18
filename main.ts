import { type Context, Hono } from "jsr:@hono/hono";
import { serveStatic } from "jsr:@hono/hono/deno";
// import { stream, streamText, streamSSE } from 'jsr:@hono/hono/streaming'
import { type Chat, initChat } from "jsr:@mumulhl/duckduckgo-ai-chat";

const app = new Hono();

// Serve static files
app.use("/*", serveStatic({ root: "./views" }));

// Summarize privacy policy & handle user input
app.post("/summarize", async (c: Context) => {
  const body = await c.req.parseBody();

  if (body) {
    const age: number = Number(body.age);
    const education: string = String(body.education);
    const understanding: number = Number(body.understanding);
    const policyUrl: string = String(body.policyUrl);

    // Fetch the privacy policy content
    // TODO: Fetch from URL proper
    // const policyContent = await fetch(policyUrl).then(res => res.text());
    const policyContent: string =
      'GitHub, Inc. ("GitHub") is committed to protecting your privacy. We have prepared this Privacy Statement to describe our practices regarding the personal information we collect from users of our services. This Privacy Statement applies to all services offered by GitHub on the GitHub.com domain, as well as other GitHub sites, apps, communications, and services that state that they are offered under this Privacy Statement. This Privacy Statement does not apply to any services that state that they are offered under a different privacy statement.';

    // Initialize the chat
    const chat: Chat = await initChat("gpt-4o-mini");

    // prompt
    const prompt: string =
      'Summarize the following privacy policy for a ${age}-year-old with ${education} education and a ${understanding}/10 understanding of privacy concepts. The user would like an answer as a bulletted list:\n\n${policyContent}';

    console.log(prompt);

    // get the summary
    const summary: string = await chat.fetchFull(prompt);
    console.log(summary);
    chat.redo(); // reset chat

    // return the summary
    return c.text(summary);

    // TODO: Streaming code doesn't work for some reason even though
    // I feel like it should - summary shows up but all at once. Need to
    // look at the htmx config
    // return streamText(c, async (stream) => {
    //   const dataStream = chat.fetchStream(prompt);
    //   for await (const chunk of dataStream) {
    //     await stream.write(chunk);
    //     console.log(chunk);
    //   }
    //   chat.redo();  // reset chat
    // });
  } else {
    return c.text("Invalid request body", 400);
  }
});

console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, app.fetch);
