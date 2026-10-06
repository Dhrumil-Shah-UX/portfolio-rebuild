var articles = [
  {
    slug: "the-art-of-task-framing",
    title: "Designing Better AI Inputs",
    summary:
      "A practical note on how better task framing can produce better AI outputs than changing tools or writing longer prompts.",
    topic: "Product Thinking",
    platform: "Substack",
    originalUrl: "https://designedminds.substack.com/p/the-art-of-task-framing",
    publishedDate: "",
    image: "",
    content: [
      { type: "p", text: "Sometimes, the better result does not come from changing the AI tool." },
      { type: "p", text: "It comes from changing how you frame the task." },
      {
        type: "p",
        text:
          "I was working on a project where I had generated an image for a website. The image worked well overall, but I also wanted to use some of the icons from that image separately."
      },
      { type: "p", text: "So I tried extracting the icons directly from the AI-generated image." },
      { type: "p", text: "The result was not great." },
      {
        type: "p",
        text: "The icons kept coming out distorted, uneven, and far from something I could confidently use."
      },
      {
        type: "p",
        text:
          "To see whether the issue was specific to that image, I decided to run another experiment using a different visual I found on Freepik. I used it as a test case and tried the same extraction process to compare the results and better understand where the limitations were coming from."
      },
      {
        type: "p",
        text:
          'To keep the experiment fair, I used almost the same basic prompt across GPT, Claude, and Gemini - "Extract the icon and give me in SVG format. It should be exactly like the image, but in SVG. It should be perfect as I need to use it commercially."'
      },
      {
        type: "p",
        text:
          "I first tried it with GPT, then experimented with Claude and Gemini as well. But the issue stayed almost the same: the extracted icons looked off every time."
      },
      {
        type: "p",
        text: "Some outputs were closer than others, but none of them felt clean enough for professional use."
      },
      {
        type: "p",
        text:
          "Then I happened to speak with one of the Designed Minds members, Ellen Li, who also works with a bit of graphic design. She suggested something very simple:"
      },
      {
        type: "blockquote",
        text: "Instead of giving the full image, crop each icon individually and try generating them one by one."
      },
      { type: "p", text: "And that small change made a big difference." },
      {
        type: "p",
        text:
          "The result from GPT was better than my earlier attempts, but still not perfect. The icon was usable as a direction, but it still had inconsistencies, distortion, and details that would need manual cleanup before using it professionally."
      },
      {
        type: "p",
        text:
          "This could be a limitation of the model, my prompting approach, or simply the challenge of converting a generated raster image into a clean SVG. But maybe as these models continue to improve - and as we learn how to give them better context - we'll get closer to perfect, production-ready outputs directly from AI."
      },
      { type: "h2", text: "Key Takeaway" },
      {
        type: "p",
        text:
          "AI tools can be powerful, but the way we break down the task matters just as much as the tool itself."
      },
      {
        type: "p",
        text:
          "Sometimes, instead of asking AI to solve the full problem at once, giving it a smaller and cleaner input can lead to a much better output."
      },
      { type: "p", text: "The prompt mattered, but the input framing mattered even more." },
      { type: "h2", text: "For Designers" },
      { type: "p", text: "AI is not just about prompting." },
      { type: "p", text: "It is also about preparing the right context." },
      { type: "h2", text: "Try This Experiment" },
      {
        type: "p",
        text: "Take one complex visual, crop out one small part, and ask AI to recreate or refine only that section."
      },
      { type: "h2", text: "Question for You" },
      { type: "p", text: "Would the result be better than giving it the full image at once?" }
    ]
  },
  {
    slug: "sometimes-the-best-ai-prompt-is-a",
    title: "Talk to AI With a Sketch",
    summary:
      "A short reflection on using rough sketches and wireframes to communicate visual intent to AI more clearly than words alone.",
    topic: "AI & Design",
    platform: "Substack",
    originalUrl: "https://designedminds.substack.com/p/sometimes-the-best-ai-prompt-is-a",
    publishedDate: "",
    image: "",
    content: [
      { type: "p", text: "I was experimenting with AI image generation for a case study visual." },
      { type: "p", text: "The output was close, but not exactly what I wanted." },
      { type: "p", text: "I kept refining the prompt:" },
      {
        type: "ul",
        items: [
          "Change the color theme.",
          "Adjust the needle position.",
          "Match the layout better.",
          "Make it feel more realistic."
        ]
      },
      {
        type: "p",
        text:
          "Each iteration improved something, but the AI was still missing the exact visual structure I had in mind."
      },
      { type: "p", text: "I created a quick flow sketch to show the direction more clearly:" },
      {
        type: "blockquote",
        text: "Initial prompt -> AI output -> refined prompt -> rough sketch/wireframe -> final output"
      },
      {
        type: "p",
        text:
          "This helped me see where the gap was. The issue was not just the prompt; it was the missing visual context."
      },
      { type: "p", text: "Then I tried a simpler approach." },
      { type: "p", text: "I gave it a rough sketch." },
      { type: "p", text: "Not a polished design." },
      { type: "p", text: "Not a perfect wireframe." },
      { type: "p", text: "Just a quick visual cue showing placement, spacing, and layout." },
      { type: "p", text: "And that worked better than adding more words." },
      {
        type: "p",
        text:
          "The sketch helped communicate the part that text was struggling to explain: where things should go and how they should relate to each other."
      },
      { type: "p", text: "That was the small learning for me." },
      {
        type: "p",
        text:
          "Prompting is not always about writing longer instructions. Sometimes it is about giving AI the right kind of input."
      },
      { type: "p", text: "For visual work, quick sketches can help with:" },
      {
        type: "ul",
        items: [
          "Layout - where elements should sit",
          "Spacing - how much room each part needs",
          "Hierarchy - what should stand out first",
          "Composition - how everything should feel together"
        ]
      },
      { type: "h2", text: "My takeaway" },
      { type: "p", text: "When AI does not understand your visual intent, try sketching it first." },
      { type: "p", text: "It does not need to look good." },
      { type: "p", text: "It just needs to make your direction clearer." },
      { type: "p", text: "Have you tried using quick sketches or wireframes to guide AI outputs?" }
    ]
  },
  {
    slug: "accessibility-isnt-a-checklist",
    title: "Accessibility Isn't a Checklist - It's a Product Responsibility",
    summary:
      "Accessibility issues often reveal deeper product and system-level problems that affect far more users than we expect.",
    topic: "Accessibility",
    platform: "Medium",
    originalUrl:
      "https://medium.com/@dhrumilshah_4837/accessibility-isnt-a-checklist-it-s-a-product-responsibility-cd38087749e9",
    publishedDate: "January 27, 2026",
    image: "",
    content: [
      {
        type: "p",
        text:
          'Accessibility is often treated as a final step in the design process - something to "check" before launch. In reality, accessibility issues usually reveal deeper product and system-level problems that affect far more users than we expect.'
      },
      {
        type: "p",
        text:
          "During a recent accessibility audit, I evaluated a public-facing nonprofit website that supports time-sensitive, mission-critical services. Because users often interact with the site in urgent situations, accessibility plays a key role in ensuring information can be found, understood, and acted on quickly."
      },
      {
        type: "p",
        text:
          "The audit focused on three high-traffic pages and applied WCAG 2.2 Level AA criteria and the POUR principles (Perceivable, Operable, Understandable, Robust). What stood out wasn't just the number of issues - but how consistently they appeared across the product."
      },
      { type: "h2", text: 'When "Nothing Looks Broken," But Everything Is' },
      {
        type: "p",
        text:
          "On the surface, the interface looked clean and functional. But once tested with accessibility in mind, critical barriers emerged:"
      },
      {
        type: "ul",
        items: [
          "Screen reader users couldn't understand content due to missing alternative text and broken heading hierarchy",
          "Keyboard-only users were blocked by hover-only navigation, invisible focus states, and keyboard traps inside modals",
          "Low-vision users struggled with insufficient text and non-text contrast",
          "Motor-impaired users faced difficulty interacting with small tap targets"
        ]
      },
      {
        type: "p",
        text: "These issues didn't just reduce usability - they prevented users from completing essential tasks."
      },
      { type: "h2", text: "Accessibility Issues Are Rarely Isolated" },
      {
        type: "p",
        text:
          "One of the biggest insights from this project was that accessibility failures were systemic, not page-specific. Missing labels, inaccessible navigation patterns, and reliance on color alone appeared repeatedly. This pointed to gaps in design standards and component decisions rather than isolated implementation mistakes."
      },
      {
        type: "p",
        text: "This is where accessibility becomes a design system and product thinking problem, not just a QA task."
      },
      { type: "h2", text: "Accessibility Is a Risk and Trust Consideration" },
      {
        type: "p",
        text:
          "For public-facing organizations, accessibility gaps can create avoidable operational and reputational challenges while limiting the ability to serve their communities effectively. Addressing accessibility early helps reduce downstream rework, supports inclusive access, and builds long-term trust with users."
      },
      { type: "h2", text: "Inclusive Design Improves UX for Everyone" },
      {
        type: "p",
        text:
          "Accessibility improvements don't only benefit users with disabilities. Clear focus states, logical structure, keyboard support, and sufficient contrast improve usability for all users -especially in high-stress, task-driven scenarios."
      },
      { type: "p", text: "Accessibility is not about designing for edge cases. It's about designing for reality." },
      {
        type: "p",
        text:
          "For example, improving keyboard navigation and visible focus states helps users complete important tasks more efficiently, while clearer structure and sufficient contrast make it easier to scan and understand information under pressure. These changes support accessibility needs while also improving speed, clarity, and confidence for all users."
      },
      { type: "h2", text: "From Findings to Action" },
      {
        type: "p",
        text:
          "Rather than stopping at problem identification, this audit produced a prioritized remediation roadmap, separating critical blockers from moderate improvements. The goal was to make accessibility actionable for designers, developers, and stakeholders alike."
      },
      { type: "h2", text: "Final Thought" },
      {
        type: "p",
        text:
          "Accessibility work has taught me that some of the most important UX problems are invisible until you look for them. When accessibility is treated as a core product responsibility instead of a compliance checkbox, it leads to better systems, clearer experiences, and more resilient products."
      },
      {
        type: "p",
        text: "I'm always interested in working on teams where accessibility is treated as a first-class requirement - not an afterthought."
      },
      {
        type: "p",
        text:
          "This accessibility audit was conducted as part of an academic project, with guidance and instruction from Prof. Deborah Prewitt. I'm grateful for her mentorship and emphasis on thoughtful, standards-driven accessibility practice."
      },
      {
        type: "p",
        text:
          "#Accessibility #InclusiveDesign #UXDesign #ProductDesign #WCAG #DesignSystems #UserCenteredDesign"
      }
    ]
  }
];
