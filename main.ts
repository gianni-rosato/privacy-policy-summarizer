import { Application, Router } from "jsr:@oak/oak";
import { initChat } from "jsr:@mumulhl/duckduckgo-ai-chat";

const app = new Application();
const router = new Router();

// Serve static files
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/views`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

// Summarize privacy policy & handle user input
router.post("/summarize", async (ctx) => {
  const body = ctx.request.body;

  // Check if the body is form data
  if (ctx.request.hasBody) {
    // TODO: Get the form data (I don't know how to do this)
    // const formData = body;
    // const age = formData.get("age");
    // const education = formData.get("education");
    // const understanding = formData.get("understanding");
    // const policyUrl = formData.get("policyUrl");

    const age: number = 18;
    const education: string = "college";
    const understanding: number = 8;
    const policyUrl: string = "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"

    // Fetch the privacy policy content
    // TODO: Fetch from URL proper
    // const policyContent = await fetch(policyUrl).then(res => res.text());
    const policyContent = 'GitHub, Inc. ("GitHub") is committed to protecting your privacy. We have prepared this Privacy Statement to describe our practices regarding the personal information we collect from users of our services. This Privacy Statement applies to all services offered by GitHub on the GitHub.com domain, as well as other GitHub sites, apps, communications, and services that state that they are offered under this Privacy Statement. This Privacy Statement does not apply to any services that state that they are offered under a different privacy statement.'

    // Initialize the chat
    const chat = await initChat("gpt-4o-mini");

    // prompt
    // TODO: Add the user's age, education, & understanding
    const prompt = `Summarize the following privacy policy for a ${age}-year-old with ${education} education and a ${understanding}/10 understanding of privacy concepts. The user would like an answer as a bulletted list:\n\n${policyContent}`;

    console.log(prompt);

    // get the summary
    const summary = await chat.fetchFull(prompt);
    console.log(summary);
    ctx.response.body = summary;

  } else {
    ctx.response.status = 400;
    ctx.response.body = "Invalid request body";
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
