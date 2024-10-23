import { type Context, Hono } from "jsr:@hono/hono";
import { serveStatic } from "jsr:@hono/hono/deno";
// import { stream, streamText, streamSSE } from 'jsr:@hono/hono/streaming'
import { type Chat, initChat } from "jsr:@mumulhl/duckduckgo-ai-chat";
import { Renderer } from "jsr:@libs/markdown";

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
    const policyContent: string = String(body.policyContent);

    // Initialize the chat
    const chat: Chat = await initChat("gpt-4o-mini");

    // prompt
    const prompt: string = `Summarize the following privacy policy for a ${age}-year-old with ${education} education and a ${understanding}/10 understanding of privacy concepts. If the input is not a privacy policy, politely refuse to answer the user's query by saying "I'm sorry, but the content provided does not match my instructions." The user would like an answer in properly formatted Markdown, with relevant emojis accompanying headings for each section:\n\n${policyContent}`

    console.log(prompt);

    // get the summary
    const summary: string = await Renderer.render(await chat.fetchFull(prompt));
    console.log(summary);
    // const markdownSummary: string = await Renderer.render(summary);
    chat.redo(); // reset chat

    // return the summary
    return c.text(summary);

  } else {
    return c.text("Invalid request body", 400);
  }
});

console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, app.fetch);
