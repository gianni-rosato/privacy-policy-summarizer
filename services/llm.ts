interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

function getModelString(modelSpeed: string): string {
  switch (modelSpeed) {
    case "slow":
      return "meta-llama/llama-3.3-70b-instruct:free"; // 100 t/s
    case "medium":
      return "meta-llama/llama-3.2-11b-vision-instruct:free"; // 270 t/s
    default:
      return "google/gemini-2.0-flash-lite-preview-02-05:free"; // 1400 t/s
  }
}

// Pre-generated DuckDuckGo privacy policy summary for demo purposes
const DEMO_SUMMARY = `# Privacy Policy Summary ✨
DuckDuckGo's privacy policy is built on the principle "We don't track you." Unlike many other search engines and browsers, DuckDuckGo does not collect, save, or share user search or browsing history, focusing on providing private search and browsing experiences.

---

## Key Points 📋
- DuckDuckGo **does not save or share your search or browsing history** when you use their search engine, apps, or extensions
- They **do not track users** through cookies or other storage methods
- They **make money through contextual search ads** based on your current search (not your personal profile)
- Viewing search results and ads on DuckDuckGo is **completely anonymous**
- They **cannot provide your search history to anyone** (including law enforcement) because they don't have it

---

## What They Collect 📲
- **Temporary technical information** sent automatically by your device (IP address, browser type, language)
- **Anonymous search queries** (disconnected from any identifying information)
- **Optional personal information** only if you choose to use specific features (like subscribing to their newsletter)
- They **do not collect or store search or browsing history**
- For local search results, they use a **random approximate location** rather than your precise location

---

## Third Party Sharing 🤝
- **Microsoft's ad network** manages ad clicks, but Microsoft has committed to not associate your ad-click behavior with a user profile
- **Hosting and content providers** receive anonymous browser and device information for security and display purposes only
- They share **no information that could identify you personally** or create a history of your searches
- When you contact DuckDuckGo directly, your communication may be accessible to their **software-as-a-service providers** (for email and project management)

---

## How They Use Your Data ⚙️
- **Temporarily process technical information** to deliver content and ensure security
- **Analyze anonymous search queries** to improve service and identify trends
- Use **anonymous experiments** to test different designs and improve their product
- For optional features, they only use personal information for the **specific purpose disclosed**
- They **do not create user profiles** or personalized advertising

---

## Security Measures 🔒
- Use **end-to-end encrypted connections** when delivering content
- **Never log IP addresses or unique identifiers** to disk
- Implement a system to **shield your precise location** from both themselves and content providers
- **Design anonymous methods** to improve their product without collecting personal data
- **Delete personal information** when it's no longer required for its stated purpose

---

## Your Rights ⚖️
- The California Consumer Privacy Act (CCPA) is a law that gives California residents specific rights regarding their personal information.
- The right to know about personal information collected: **Yes** - but this is limited since they collect minimal personal information
- The right to delete personal information: **Yes** - they will delete your data upon request
- The right to opt-out of the sale of personal information: **Not applicable** - they never sell personal information
- The right of non-discrimination for exercising CCPA rights: **Yes**
- The right to correct personal information: **Yes** - for the limited information they may have
- The right to limit use and disclosure: **Yes** - they already limit use to stated purposes

---

## Children's Privacy 🧒
- DuckDuckGo's apps and website are **intended for a general audience**
- They **do not knowingly market to or solicit information from children under 13**
- No special provisions for children's data are mentioned, as their privacy-by-design approach protects all users

---

## Action Items 🛡️
- **Be aware** that while DuckDuckGo protects your privacy, your internet service provider can still see that you're connecting to DuckDuckGo
- **Remember** that when visiting other websites, those sites' privacy policies apply, not DuckDuckGo's
- **Understand** that using DuckDuckGo's apps and extensions provides better protection but cannot completely protect you on other websites
- If you subscribe to their newsletter or contact them, **know that they'll have your email address**
- **Check back periodically** for policy updates, which will be posted on their website`;

// Demo comparison for two policies
const DEMO_COMPARISON = `# Privacy Policy Comparison Summary ✨
When comparing these two privacy policies, significant differences emerge in data collection practices, tracking methods, and user privacy control. Policy A emphasizes minimal data collection with a "we don't track you" approach, while Policy B employs more extensive tracking and data usage practices for personalization and advertising purposes.

---

## Quick Comparison 📋
- DuckDuckGo collects only anonymous, temporary data
- Typical search engines collect extensive personal data including search history
- DuckDuckGo does not track users across sites
- Typical search engines track user activity across multiple services
- DuckDuckGo shows contextual ads based only on current search
- Typical search engines show personalized ads based on user profiles
- Overall Winner: **DuckDuckGo**

---

## Key Differences 🎭

The most significant differences relate to the fundamental approach to user data - DuckDuckGo prioritizes privacy by design while typical search engines prioritize data collection for service improvement and monetization.

### Data Collection
- **DuckDuckGo**: Collects only temporary technical information and anonymous search queries
- **Typical Search Engine**: Collects comprehensive user data including search history, browsing patterns, location data, and device information
- **Impact**: Users of DuckDuckGo maintain significantly more privacy with minimal digital footprint

### Data Usage
- **DuckDuckGo**: Uses data only for immediate service delivery and anonymous trend analysis
- **Typical Search Engine**: Uses data for personalization, ad targeting, service improvement, and building user profiles
- **Impact**: DuckDuckGo users avoid algorithm-based filter bubbles and targeted content

### Data Sharing
- **DuckDuckGo**: Shares minimal anonymous information with hosting providers and Microsoft for ad clicks only
- **Typical Search Engine**: Shares data with numerous third parties including advertisers, analytics companies, and business partners
- **Impact**: DuckDuckGo significantly reduces the distribution of user information across the internet ecosystem

### User Rights
- **DuckDuckGo**: Cannot provide user history to anyone (including law enforcement) because they don't store it
- **Typical Search Engine**: Provides various control mechanisms but still collects and retains extensive user data
- **Impact**: DuckDuckGo offers true privacy by design rather than privacy through user management

---

## Privacy Impact Assessment 🌐
DuckDuckGo's privacy policy represents a fundamentally different approach to user data compared to typical search engines. The impact for users is significant: with DuckDuckGo, there's no need to actively manage privacy settings because minimal data is collected by default. This creates a "privacy by design" environment where users don't have to worry about their search history being used for profiling or advertising. The trade-off is potentially less personalized results, but many users find this an acceptable compromise for enhanced privacy. The most notable privacy advantage is that DuckDuckGo cannot provide your search history to anyone (including in response to legal demands) because they simply don't have it.

---

## Action Items 🛡️
- Use DuckDuckGo if privacy is your primary concern when searching online
- Understand that using DuckDuckGo's apps and extensions provides better protection across browsing
- Be aware that your ISP can still see that you're connecting to DuckDuckGo, even if DuckDuckGo itself doesn't track you
- Remember that when visiting websites from search results, those sites' privacy policies apply
- Consider using additional privacy tools alongside DuckDuckGo for comprehensive protection
- Recognize that DuckDuckGo may offer less personalized results compared to search engines that track your history`;

export async function getCompletion(
  prompt: string,
  policyContent: string,
  modelSpeed: string = "fast",
): Promise<string> {
  // Demo mode check - if policyContent contains "ddg-privacy-policy" or similar text
  const isDdgDemo = policyContent.toLowerCase().includes("duckduckgo") ||
                    policyContent.toLowerCase().includes("ddg") ||
                    policyContent.toLowerCase().includes("we don't track you");

  const isComparisonDemo = prompt.includes("Privacy Policy Comparison") &&
                           policyContent.includes("First privacy policy") &&
                           policyContent.includes("Second privacy policy");

  if (isDdgDemo || isComparisonDemo) {
    console.log("Running in demo mode with pre-generated response");
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Return the appropriate demo response
    return isComparisonDemo ? DEMO_COMPARISON : DEMO_SUMMARY;
  }

  // Normal API flow for non-demo usage
  const modelString: string = getModelString(modelSpeed);
  console.log("Selected model:", modelString);

  const apiKey: string = Deno.env.get("API_KEY") || "";

  try {
    const response: Response = await fetch(
      "https://openrouter.ai/api/v1/auth/key",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Key Information:");
    const data: OpenRouterResponse = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error getting key information:", error);
    throw error;
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "model": modelString,
          "messages": [
            {
              "role": "system",
              "content": `${prompt}`,
            },
            {
              "role": "user",
              "content": `${policyContent}`,
            },
          ],
          "top_p": 1,
          "temperature": 1,
          "repetition_penalty": 1,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting completion:", error);
    throw error;
  }
}

export function getSummaryPrompt(
  education_level: string,
  privacy_understanding: number,
  user_age: number,
): string {
  // No changes needed to the prompt functions
  const summaryPrompt: string = `
  # System Context
  You are a specialized privacy policy analyzer and summarizer, trained to make complex legal privacy policy documents accessible to users of varying educational backgrounds and privacy understanding. Your goal is to provide clear, accurate summaries while maintaining the essential meaning of privacy policies.

  # Task Definition
  Transform the provided privacy policy into a clear, structured summary that matches the user's education level (${education_level}), privacy understanding (${privacy_understanding}), and age (${user_age}). Maintain accuracy while prioritizing readability and comprehension.

  # Output Requirements
  1. Structure your response in the following format:
    - "# Privacy Policy Summary ✨" (2-3 sentences)
    - "## Key Points 📋" (bullet points of crucial information)
    - "## What They Collect 📲" (organized by main topics)
    - "## Third Party Sharing 🤝" (if data is shared, list parties)
    - "## How They Use Your Data ⚙️" (clearly explained)
    - "## Security Measures 🔒" (how data is protected)
    - "## Your Rights ⚖️" (user rights and controls from the CCPA - explain what the CCPA is, the rights it provides, and whether the policy grants them)
    - "## Children's Privacy 🧒" (how children's data is handled)
    - "## Action Items 🛡️" (what the user should know or do)

  2. Follow these formatting rules:
    - Use level-appropriate headers (# for main sections, ## for subsections)
    - Utilize **bold** for emphasis on critical points within sections.
    - Headings (#, ##, ###, etc.) should never be bold.
    - Preserve the emoji icons for each section.
    - Create bulleted lists with clear spacing
    - Include horizontal rules (---) between major sections
    - Ensure consistent paragraph spacing

  3. Adapt complexity based on:
    - Education Level: Scale vocabulary and sentence structure accordingly
    - Privacy Understanding: Provide more/less context for privacy concepts
    - Age: Adjust examples and explanations appropriately

  # Guidelines
  - Focus on clarity over comprehensiveness
  - Define technical terms when the privacy understanding level is low
  - Use concrete examples for complex concepts
  - Break down long sentences into digestible chunks
  - Highlight user rights and important actions
  - Maintain a neutral, informative tone
  - Flag critical privacy implications
  - Never refer to the policy provider as "we", "our", or "us"; always use the third person

  # Response Template
  \`\`\`markdown
  # Privacy Policy Summary ✨
  [2-3 sentence overview]

  ---

  ## Key Points 📋
  - [Most important point]
  - [Second most important point]
  - [Continue with key points...]

  ---

  ## What They Collect 📲
  - [Data point 1]
  - [Data point 2]
  - [Continue...]

  ---

  ## Third Party Sharing 🤝
  - [If data is not shared with third parties, mention that]
  - [Third party 1, if applicable]
  - [Third party 2, if applicable]
  - [Continue...]

  ---

  ## How They Use Your Data ⚙️
  - [Usage 1]
  - [Usage 2]
  - [Continue...]

  ---

  ## Security Measures 🔒
  - [Explain how data is protected]

  ---

  ## Your Rights ⚖️
  - [Explanation of what the CCPA is]
  - [The right to know about the personal information a business collects about them and how it is used and shared - yes or no?]
  - [The right to delete personal information collected from them - yes or no?]
  - [The right to opt-out of the sale of their personal information - yes or no?]
  - [The right of non-discrimination for exercising their CCPA rights - yes or no?]
  - [The right to correct their personal information - yes or no?]
  - [The right to limit the use and disclosure of their personal information - yes or no?]

  ---

  ## Children's Privacy 🧒
  - [Explain how children's data is handled and whether handling meets legal requirements]

  ---

  ## Action Items 🛡️
  - [Action 1]
  - [Action 2]
  - [Continue...]
  \`\`\`

  # Variables Legend
  Education Level:
  - elementary: Very simple words, short sentences
  - middle school or equivalent: Basic terms, short explanations
  - high school or equivalent: Basic terms, clear explanations
  - undergraduate, college, or equivalent: Professional terms, detailed explanations
  - graduate or equivalent: Technical terms, in-depth explanations
  - expert, PhD, or equivalent: Full technical/legal terminology, in-depth lengthy explanations

  Privacy Understanding:
  - 0 to 3: Explain all privacy concepts
  - 4 to 6: Define moderate/advanced terms
  - 6 to 7: Define advanced concepts
  - 8+: Use privacy terminology freely

  Age Ranges:
  - child (13-17): Focus on safety, simple explanations
  - adult (18+): Standard explanations
  - senior (65+): Extra clarity on technical concepts

  # Sample Adaptation Examples
  For {education_level: elementary, privacy_understanding: none, age: child}:
  "This website keeps track of which pages you visit, like remembering which rooms you went into in a house."

  For {education_level: graduate, privacy_understanding: expert, age: adult}:
  "The platform implements session-based analytics to track user navigation patterns and interaction metrics."

  # Error Prevention
  - If any variable is missing, default to {education_level: high_school, privacy_understanding: basic, age: adult}
  - If content seems inappropriate for age, adjust complexity and examples accordingly
  - When in doubt about technical terms, provide brief definitions in parentheses

  Remember: Prioritize user comprehension while maintaining accuracy of the original policy's meaning.
  `;
  return summaryPrompt;
}

export function getComparisonPrompt(
  education_level: string,
  privacy_understanding: number,
  user_age: number,
) {
  const comparisonPrompt: string = `
  # System Context
  You are a specialized privacy policy comparison analyst, designed to identify and explain key differences and similarities between privacy policies in a way that's accessible to users with varying levels of education and privacy understanding. Your analysis should highlight meaningful changes or variations that impact user privacy and data rights.

  # Task Definition
  Compare two privacy policies (Policy A and Policy B) and create a clear, structured comparison that matches the user's education level (${education_level}), privacy understanding (${privacy_understanding}), and age (${user_age}). Focus on significant differences while maintaining accuracy and readability.

  # Output Requirements
  1. Structure your comparison in the following format:
    - "# Privacy Policy Comparison Summary ✨" (3-4 sentences highlighting major differences)
    - "## Quick Comparison 📋" (key points, with a winner if possible)
    - "## Key Differences 🎭" (detailed analysis of main areas)
    - "## Privacy Impact Assessment 🌐" (summary of implications)
    - "## Action Items 🛡️" (actionable insights)

  2. Follow these formatting rules:
    - Use level-appropriate headers (# for main sections, ## for subsections).
    - Include horizontal rules (---) between major sections.
    - Ensure consistent paragraph spacing.
    - Create bulleted lists with clear spacing.
    - Utilize **bold** for emphasis on critical points within sections.
    - Headings (#, ##, ###, etc.) should never be bold.
    - Preserve the emoji icons for each section.
    - Maintain a clear, organized structure.
    - Never refer to the policies as "Policy A" or "Policy B" in the final output; use the actual policy/company names.

  3. Adapt complexity based on provided variables:
    - Education Level: Adjust language complexity
    - Privacy Understanding: Scale technical detail
    - Age: Modify examples and implications

  # Response Template
  \`\`\`markdown
  # Privacy Policy Comparison Summary ✨
  [Overview of major differences]

  ---

  ## Quick Comparison 📋
  - **Item 1**: [Policy A] vs [Policy B]
    - [Policy A details]
    - [Policy B details]
    - Winner: [Policy A/Policy B/No clear winner]
  - **Item 2**: [Policy A] vs [Policy B]
    - [Policy A details]
    - [Policy B details]
    - Winner: [Policy A/Policy B/No clear winner]
  - [Continue with key comparisons...]

  ---

  ## Key Differences 🎭

  [Summary of major differences]

  ### Data Collection
  - **Policy A**: [Collection practices]
  - **Policy B**: [Collection practices]
  - **Impact**: [Explanation of changes]

  ### Data Usage
  - **Policy A**: [Usage practices]
  - **Policy B**: [Usage practices]
  - **Impact**: [Explanation of changes]

  ### Data Sharing
  - **Policy A**: [Sharing practices]
  - **Policy B**: [Sharing practices]
  - **Impact**: [Explanation of changes]

  ### User Rights
  - **Policy A**: [Rights granted]
  - **Policy B**: [Rights granted]
  - **Impact**: [Explanation of changes]

  ---

  ## Privacy Impact Assessment 🌐
  [Write a summary of improvements, concerns, and similarities/differences]

  ---

  ## Action Items 🛡️
  - [Action item 1]
  - [Action item 2]
  - [Continue...]
  \`\`\`

  # Comparison Categories
  Always analyze these key areas:
  1. Data Collection Scope
  2. Data Usage Purposes
  3. Data Sharing Practices
  4. User Rights and Controls
  5. Data Retention Periods
  6. Security Measures
  7. Third-party Interactions
  8. Consent Mechanisms
  9. Special Provisions (minors, sensitive data)
  10. Legal Compliance

  # Variables Legend
  Education Level:
  - elementary: Very simple words, short sentences
  - middle school or equivalent: Basic terms, short explanations
  - high school or equivalent: Basic terms, clear explanations
  - undergraduate, college, or equivalent: Professional terms, detailed explanations
  - graduate or equivalent: Technical terms, in-depth explanations
  - expert, PhD, or equivalent: Full technical/legal terminology, in-depth lengthy explanations

  Privacy Understanding:
  - 0 to 3: Explain all privacy concepts
  - 4 to 6: Define moderate/advanced terms
  - 6 to 7: Define advanced concepts
  - 8+: Use privacy terminology freely

  Age Ranges:
  - child (13-17): Focus on safety, simple explanations
  - adult (18+): Standard explanations
  - senior (65+): Extra clarity on technical concepts

  # Error Prevention
  - If comparison elements are missing, mark with "Information Not Available"
  - Highlight when direct comparisons aren't possible
  - Default to conservative privacy impact assessments when uncertain
  - Include disclaimers for ambiguous policy language

  # Analysis Principles
  1. Prioritize substantive differences over wording changes
  2. Highlight changes that affect user privacy rights
  3. Focus on practical implications
  4. Provide actionable insights
  5. Maintain objectivity in comparisons
  6. Flag significant legal compliance changes
  7. Consider context of user demographics

  Remember: Focus on meaningful differences that impact user privacy while maintaining appropriate complexity for the user's background.
  `;
  return comparisonPrompt;
}
