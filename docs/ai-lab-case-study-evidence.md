# AI Lab case study redesign evidence

Scope: Mindle, Perspective and Space Shooter case-study pages only, plus isolated CSS/JS and one script reference. AI Lab landing/process/workshop content, cards, existing source documents, recordings and other case studies were not rewritten.

## Reviewed sources

- assets/documents/Mindle_Detailed_Case_Study_Master.docx (complete paragraph text reviewed read-only).
- assets/documents/Perspective_Game_Case_Study_Dhrumil_Shah.docx (complete paragraph text reviewed read-only).
- Existing pages/case-mindle.html, pages/case-perspective.html, pages/case-space-shooter.html and server/knowledge.js.
- Existing gameplay recordings for all three projects and Perspective's usable screenshots/tutorial assets.
- User confirmed Perspective was vibe-coded in Visual Studio using Codex. No unsupported tool attribution or live AI functionality is inferred from the game's metaphor.

## Claim discipline

Mindle: retained the production core, stack, server actions, admin scheduling, persistence and signed gameplay-state contribution documented by the master. Explicitly labeled adaptive reflection, sharing/privacy options, browser identity, reflection streak and six-event instrumentation as later selected directions or proposals, not verified live features. June–October 2026 comes from the existing case record. The July 6 snapshot's 7 non-seed players and 6 scheduled concepts is a dated snapshot, not current adoption. The 2 reflections/month versus 3/two-weeks observation uses unequal windows and a tiny sample; no percentage increase, causality, sustained habit, conversion rate or accessibility certification is claimed. Cleanup-related result loss means retained rows cannot represent lifetime completions. No private community members' names, emails or reflections are reproduced.

Perspective: retained collaborative workshop context while attributing the game, mechanics, tutorial, debrief and implementation direction to the author. HTML/CSS/JS, Matter.js and static GitHub Pages deployment are documented by the primary source, not newly audited code claims. The game is a designed metaphor rather than literal LLM behavior. Extra ball generation from bar collisions is a documented conceptual contradiction; the narrative describes critique/refinement, not a scientifically validated comparison. Screenshot values 3 and 5 are one playthrough, not learning or decision-quality metrics. No participant outcomes or unrecorded tests are invented. Four decisions include the documented visual tutorial as its own decision.

Space Shooter: existing case and knowledge record establish ChatGPT for ideation/sequential prompts and Cursor for implementation, with author direction/review. Kept three actual decisions rather than inventing a fourth. Removed an unsupported comparative speed statement. No tech-stack specifics, deployment URL, player adoption, benchmark or user-test claim was added.

## Visuals and interactions

No generated product screenshots or mock interfaces. Existing recordings remain unchanged. One displayed PNG frame per Mindle/Space Shooter was extracted from its recording and used as a poster/evidence image. Extra extracted comparison frames are not needed by the public page. Perspective uses its existing game and tutorial screenshots. Native HTML diagrams are explicitly labeled summaries, hypotheses or selected design directions rather than shipped UI.

The same four-section navigation, chapter highlighting, editorial type and numbered/divided decisions are used. Videos start through an accessible poster button, retain native controls/fallback links and pause when leaving their route. Poster enhancement is scoped and progressive: without JS the native video remains available. Images use same-page full-screen dialogs, cursor-centered wheel zoom, pinch, drag, keyboard plus/minus/reset, Escape and top-right Close. Route cleanup observes the actual page class, because these cases intentionally share AI Lab's active global navigation state.

## Preservation

All 55 existing assistant tests passed. Final browser checks passed for all three cases on desktop/mobile, with additional 320px and 768px reflow checks, actual recording playback, real touch-pinch input, and modal focus/scroll/route cleanup. The unchanged landing page still has its three project links and all six functional workshop selectors. Static build, case-study placeholder check, JavaScript syntax, and whitespace checks passed.

The complete original documents and all original assets remain in their existing paths. Detailed source links are retained for Mindle and Perspective; video links/fallbacks remain for all three. Important original case content was reorganized under Overview, Problem, Decisions and Impact, with outcomes and reflection combined. Full pre-edit markup is preserved below for traceability.

## Validation

Rendered all three complete cases on desktop 1440px and mobile 390px; reviewed all sections and each decision. Corrected a global heading-specificity clash without changing shared CSS. Checked assets, four-link navigation, no accordions, no horizontal overflow, and modal wheel/reset/Escape/focus behavior. Additional validation covers narrower/tablet widths, playback, real touch pinch, route cleanup, shared workshops, build and existing regression tests.

## Original mindle page

```html
<section class="page" data-page-view="case-mindle">
  <article class="case-study case-study-mindle" aria-labelledby="mindle-title">
    <div class="case-study-shell">
      <aside class="case-sidebar" aria-label="Mindle case study sections">
        <div class="case-sidebar-inner">
          <button class="back-link icon-button-label" type="button" data-page="ai-lab" data-scroll-target="ai-projects"><span class="ui-icon ui-icon--chevron-left" aria-hidden="true"></span>AI Lab projects</button>
          <nav>
            <a href="#mindle-overview" aria-current="true">Overview</a>
            <a href="#mindle-challenge">Challenge</a>
            <a href="#mindle-decisions">Key Decisions</a>
            <a href="#mindle-experience">Final Experience</a>
            <a href="#mindle-reflection">Reflection</a>
          </nav>
        </div>
      </aside>

      <div class="case-study-content">
        <section class="case-section case-overview" id="mindle-overview">
          <p class="case-kicker">Product design &amp; development &middot; Designed Minds</p>
          <h1 id="mindle-title">Mindle</h1>
          <p class="case-lede">I built a weekly UX word game to make learning, reflection, and sharing feel like a natural community ritual.</p>
          <figure class="perspective-video case-media-hero" aria-label="Mindle gameplay video">
            <video class="case-game-video" controls autoplay muted loop playsinline preload="metadata" aria-label="Watch Mindle gameplay">
              <source src="assets/videos/mindle.mp4" type="video/mp4" />
              Your browser does not support embedded video. <a href="assets/videos/mindle.mp4">Download the Mindle video</a>.
            </video>
          </figure>
          <dl class="project-snapshot" aria-label="Project snapshot">
            <div><dt>My role</dt><dd>Product designer and developer</dd></div>
            <div><dt>Timeline</dt><dd>June&ndash;October 2026 &middot; Ongoing iterations</dd></div>
            <div><dt>Platform</dt><dd>Responsive web application</dd></div>
          </dl>
          <p><a class="icon-link" href="https://mindle-xi.vercel.app/" target="_blank" rel="noopener noreferrer">Play Mindle<span class="ui-icon ui-icon--arrow-up-right" aria-hidden="true"></span></a> &middot; <a class="icon-link" href="https://github.com/Dhrumil-Shah-UX/mindle" target="_blank" rel="noopener noreferrer">View source on GitHub<span class="ui-icon ui-icon--arrow-up-right" aria-hidden="true"></span></a></p>
        </section>

        <section class="case-section section-challenge" id="mindle-challenge">
          <div class="section-copy">
            <p class="case-kicker">Challenge</p>
            <h2>The community had a place to share. People needed a reason to begin.</h2>
            <p>Designed Minds members were building products, exploring AI, and navigating career transitions, but much of that work stayed invisible. Weekly prompts asking what people built or struggled with received approximately two reflections over one month.</p>
            <p>Open-ended questions ask people to recall their week, decide what matters, and judge whether to share it publicly. I reframed the opportunity: how might reflection become a low-effort part of a rewarding weekly experience?</p>
          </div>
        </section>

        <section class="case-section section-decisions" id="mindle-decisions">
          <div class="section-copy">
            <p class="case-kicker">Key decisions</p>
            <h2>Let the puzzle invite people in. Make participation easier afterward.</h2>
          </div>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 01</span>
              <h3>Start with a familiar, two-minute challenge.</h3>
              <p>A word-guessing game offered a short, repeatable way to revisit UX concepts without learning a new interaction model. Players guess letters or the full word, with 13 attempts, three progressive hints, and optional prefilled letters. Configurable hints let me adjust difficulty for each concept.</p>
              <p>A concise UX lesson follows the result, creating a transition from solving a puzzle to thinking about the player&rsquo;s own work.</p>
            </div>
          </section>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 02</span>
              <h3>Replace two universal questions with one adaptive check-in.</h3>
              <p>The original reflection asked what players built and what challenges they faced. That assumed everyone had the same kind of week. I redesigned it around four choices: made progress, hit a challenge, learned something, or need help.</p>
              <p>Only the relevant follow-up appears. Recognizing a category gives people a starting point, and one meaningful thought is enough to contribute.</p>
            </div>
          </section>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 03</span>
              <h3>Separate playing, identity, and public sharing.</h3>
              <p>I redesigned onboarding from landing, name/email, and game to immediate play, with optional identity when needed for sharing. Browser-based identity keeps entry lightweight, with the trade-off that switching devices or clearing storage can create a new identity.</p>
              <p>The reflection design offers named community sharing, anonymous sharing, or a private response. Sharing behavior is disclosed before submission. The proposed weekly streak would credit every completed reflection, regardless of visibility.</p>
            </div>
          </section>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 04</span>
              <h3>Design the weekly operation alongside the player experience.</h3>
              <p>I built an admin workflow for words, hints, lessons, prefilled letters, and timezone-aware scheduling, so new puzzles could go live without code changes. The reflection redesign also required a flexible data model for category, response, and sharing preference while preserving older responses.</p>
              <p>For community distribution, I consolidated the content strategy into one Friday roundup: last week&rsquo;s lesson, reflection highlights, and an invitation to the new puzzle. This gives members recognition without spoiling the current answer.</p>
            </div>
          </section>
        </section>

        <section class="case-section section-sage" id="mindle-experience">
          <div class="section-copy">
            <p class="case-kicker">Final experience</p>
            <h2>Discover. Play. Learn. Reflect. Return.</h2>
            <p>Mindle shipped as a responsive production application built with Next.js, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL, and Vercel. I used Figma and AI-assisted development to work across design and implementation while retaining responsibility for product decisions and validation.</p>
            <p>The core experience connects a weekly puzzle, a short UX lesson, and a reflection. Ongoing iterations focus on reducing onboarding effort, making the check-in contextual, and helping members choose how they participate.</p>
            <h3>Early participation was encouraging, with a small sample.</h3>
            <p>An early community comparison recorded three reflections over two weeks after launch, versus two over approximately one month before Mindle. This supported continued iteration, but did not establish causality or a sustained weekly habit.</p>
            <p>A July 6 snapshot recorded seven non-seed registered players and six UX concepts. Earlier test-player cleanup also removed associated results, so the retained result count could not represent lifetime participation.</p>
            <h3>Measure where reflection breaks down.</h3>
            <p>I defined a proposed six-event funnel covering game start, game completion, reflection view, category selection, response start, and submission. Its purpose is to identify the next product decision. Production instrumentation and conversion improvements still need verification.</p>
          </div>
        </section>

        <section class="case-section reflection-section" id="mindle-reflection">
          <div class="section-copy">
            <p class="case-kicker">Reflection</p>
            <h2>The game was the invitation. Participation was the product challenge.</h2>
            <p>A required name field can stop someone from trying. A generic question can make a check-in feel difficult. An unclear sharing preference can make someone hesitate. Building Mindle taught me how these small decisions shape whether people feel ready to participate.</p>
            <p>Next, I want to validate the adaptive reflection flow, understand contribution quality, and observe whether reflections lead to useful support or conversation. Puzzle completion is a starting point; the community value continues after the player leaves.</p>
          </div>
        </section>
      </div>
    </div>
    <section class="case-next-project next-project" aria-labelledby="mindle-more-title">
      <div class="case-next-project__inner">
        <p class="case-kicker">More experiments</p>
        <h3 id="mindle-more-title">Explore AI Lab</h3>
        <p>Projects, workshops, and experiments in designing with AI.</p>
        <a class="icon-link" href="#ai-lab" data-page="ai-lab" data-scroll-target="ai-projects">Back to AI Lab projects<span class="ui-icon ui-icon--arrow-right" aria-hidden="true"></span></a>
      </div>
    </section>
  </article>
</section>
```

## Original perspective page

```html
<section class="page" data-page-view="case-perspective">
  <article class="case-study case-study-perspective" aria-labelledby="perspective-title">
    <div class="case-study-shell">
      <aside class="case-sidebar" aria-label="Perspective case study sections">
        <div class="case-sidebar-inner">
          <button class="back-link icon-button-label" type="button" data-page="ai-lab" data-scroll-target="ai-projects"><span class="ui-icon ui-icon--chevron-left" aria-hidden="true"></span>AI Lab projects</button>
          <nav>
            <a href="#perspective-overview" aria-current="true">Overview</a>
            <a href="#perspective-challenge">Challenge</a>
            <a href="#perspective-decisions">Key Decisions</a>
            <a href="#perspective-experience">Final Experience</a>
            <a href="#perspective-reflection">Reflection</a>
          </nav>
        </div>
      </aside>

      <div class="case-study-content">
        <section class="case-section case-overview" id="perspective-overview">
          <p class="case-kicker">Interaction design &middot; AI decision-making</p>
          <h1 id="perspective-title">Perspective</h1>
          <p class="case-lede">I turned an abstract AI decision-making concept into a playable workshop activity, then refined a mechanic that risked teaching the wrong lesson.</p>
          <figure class="perspective-video case-media-hero" aria-label="Perspective gameplay video">
            <video class="case-game-video" controls autoplay muted loop playsinline preload="metadata" aria-label="Watch Perspective gameplay">
              <source src="assets/videos/perspective.mp4" type="video/mp4" />
              Your browser does not support embedded video. <a href="assets/videos/perspective.mp4">Download the Perspective video</a>.
            </video>
          </figure>
          <dl class="project-snapshot" aria-label="Project snapshot">
            <div><dt>Context</dt><dd>Designed Minds Workshop 6</dd></div>
            <div><dt>My contribution</dt><dd>Game concept, interaction mechanics, tutorial, and debrief</dd></div>
            <div><dt>Format</dt><dd>Interactive workshop game</dd></div>
          </dl>
        </section>

        <section class="case-section section-challenge" id="perspective-challenge">
          <div class="section-copy">
            <p class="case-kicker">Challenge</p>
            <h2>Make the effect of decision criteria something participants could experience.</h2>
            <p>AI can generate options quickly. Deciding which deserve to move forward requires judgment. For a live workshop, I designed a short game to explore how clearer criteria shape the possibilities people evaluate.</p>
          </div>
        </section>

        <section class="case-section section-decisions" id="perspective-decisions">
          <div class="section-copy">
            <p class="case-kicker">Key decisions</p>
            <h2>Keep the comparison focused and the lesson accurate.</h2>
          </div>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 01</span>
              <h3>Change the possibility space. Keep the player and goal the same.</h3>
              <p>I created wide- and narrow-funnel versions while keeping the player, bucket, goal, and controls unchanged. This focused the comparison on how criteria shape the space, with human intervention required in both versions.</p>
            </div>
            <div class="media-pair perspective-play-comparison" aria-label="The two gameplay versions">
              <figure class="case-media perspective-evidence">
              <img src="assets/images/ai_projects/perspective/usable/open-ideation.webp" alt="Version 1 gameplay with an open funnel, movable bars, idea balls, and the bucket." width="780" height="1411" loading="lazy" decoding="async" />
              <figcaption>Version 1: broad possibility space.</figcaption>
            </figure>
              <figure class="case-media perspective-evidence">
              <img src="assets/images/ai_projects/perspective/usable/constrained-ideation.webp" alt="Version 2 gameplay with a focused funnel and the same bucket and movable bar controls." width="781" height="1410" loading="lazy" decoding="async" />
              <figcaption>Version 2: focused possibility space.</figcaption>
            </figure>
            </div>
          </section>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 02</span>
              <h3>Refine a mechanic that rewarded the wrong thing.</h3>
              <p>Early collisions could generate extra idea balls, allowing the broader version to score higher simply by creating more opportunities. I refined the mechanic around a clearer model: AI generates possibilities; human judgment guides them.</p>
            </div>
          </section>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 03</span>
              <h3>Make the score and debrief reinforce the same idea.</h3>
              <p>I renamed &ldquo;balls caught&rdquo; to &ldquo;ideas moved forward&rdquo; to signal relevance for further evaluation. The debrief clarified that exploration still matters: clearer criteria help when the task shifts toward deciding what progresses.</p>
            </div>
            <figure class="case-media perspective-evidence perspective-score">
              <img src="assets/images/ai_projects/perspective/usable/score-comparison.webp" alt="End screen comparing broad and focused possibility spaces, with 3 and 5 ideas moved forward in this playthrough." width="862" height="419" loading="lazy" decoding="async" />
              <figcaption>&ldquo;Ideas moved forward&rdquo; keeps the score tied to relevance. One playthrough shown.</figcaption>
            </figure>
          </section>
        </section>

        <section class="case-section section-sage" id="perspective-experience">
          <div class="section-copy">
            <p class="case-kicker">Final experience</p>
            <h2>Play first. Discuss the decision model afterward.</h2>
            <p>Participants launch idea balls and move two vertical bars to guide them into a bucket. A mostly visual tutorial introduces the controls before the theory.</p>
          </div>
          <figure class="case-media perspective-evidence perspective-tutorial">
            <div class="perspective-tutorial-grid">
              <div class="perspective-tutorial-step">
                <img src="assets/images/ai_projects/perspective/usable/tutorial-detail-1.webp" alt="" width="258" height="240" loading="lazy" decoding="async" />
                <p><span>01</span> Launch an idea</p>
              </div>
              <div class="perspective-tutorial-step">
                <img src="assets/images/ai_projects/perspective/usable/tutorial-detail-2.webp" alt="" width="308" height="240" loading="lazy" decoding="async" />
                <p><span>02</span> Move the bars</p>
              </div>
              <div class="perspective-tutorial-step">
                <img src="assets/images/ai_projects/perspective/usable/tutorial-detail-3.webp" alt="" width="262" height="321" loading="lazy" decoding="async" />
                <p><span>03</span> Guide the ideas</p>
              </div>
              <div class="perspective-tutorial-step">
                <img src="assets/images/ai_projects/perspective/usable/tutorial-detail-4.webp" alt="" width="281" height="317" loading="lazy" decoding="async" />
                <p><span>04</span> Move ideas forward</p>
              </div>
            </div>
            <figcaption>Four visual steps introduce the controls before the theory.</figcaption>
          </figure>
        </section>

        <section class="case-section reflection-section" id="perspective-reflection">
          <div class="section-copy">
            <p class="case-kicker">Reflection</p>
            <h2>Every interaction teaches something.</h2>
            <p>A working mechanic can still communicate the wrong model. This project pushed me to evaluate what the system rewards alongside how it plays, and to keep human judgment visible throughout an AI-assisted experience.</p>
          </div>
        </section>
      </div>
    </div>
    <section class="case-next-project next-project" aria-labelledby="perspective-more-title">
      <div class="case-next-project__inner">
        <p class="case-kicker">More experiments</p>
        <h3 id="perspective-more-title">Explore AI Lab</h3>
        <p>Projects, workshops, and experiments in designing with AI.</p>
        <a class="icon-link" href="#ai-lab" data-page="ai-lab" data-scroll-target="ai-projects">Back to AI Lab projects<span class="ui-icon ui-icon--arrow-right" aria-hidden="true"></span></a>
      </div>
    </section>
  </article>
</section>
```

## Original space-shooter page

```html
<section class="page" data-page-view="case-space-shooter">
  <article class="case-study case-study-space-shooter" aria-labelledby="space-shooter-title">
    <div class="case-study-shell">
      <aside class="case-sidebar" aria-label="Space Shooter case study sections">
        <div class="case-sidebar-inner">
          <button class="back-link icon-button-label" type="button" data-page="ai-lab" data-scroll-target="ai-projects"><span class="ui-icon ui-icon--chevron-left" aria-hidden="true"></span>AI Lab projects</button>
          <nav>
            <a href="#space-shooter-overview" aria-current="true">Overview</a>
            <a href="#space-shooter-challenge">Challenge</a>
            <a href="#space-shooter-decisions">Key Decisions</a>
            <a href="#space-shooter-experience">Final Experience</a>
            <a href="#space-shooter-reflection">Reflection</a>
          </nav>
        </div>
      </aside>

      <div class="case-study-content">
        <section class="case-section case-overview" id="space-shooter-overview">
          <p class="case-kicker">AI-assisted building &middot; First experiment</p>
          <h1 id="space-shooter-title">Space Shooter</h1>
          <p class="case-lede">I used ChatGPT to turn a rough game idea into a build plan, then worked through it in Cursor to create my first playable AI-assisted experiment.</p>
          <figure class="perspective-video case-media-hero" aria-label="Space Shooter gameplay video">
            <video class="case-game-video" controls autoplay muted loop playsinline preload="metadata" aria-label="Watch Space Shooter gameplay">
              <source src="assets/videos/space_shooter.mp4" type="video/mp4" />
              Your browser does not support embedded video. <a href="assets/videos/space_shooter.mp4">Download the Space Shooter video</a>.
            </video>
          </figure>
          <dl class="project-snapshot" aria-label="Project snapshot">
            <div><dt>Context</dt><dd>My first experiment building with AI</dd></div>
            <div><dt>My contribution</dt><dd>Concept exploration, build direction, and output review</dd></div>
            <div><dt>Tools</dt><dd>ChatGPT and Cursor</dd></div>
          </dl>
        </section>

        <section class="case-section section-challenge" id="space-shooter-challenge">
          <div class="section-copy">
            <p class="case-kicker">Challenge</p>
            <h2>Could AI help me take a rough game idea all the way to something playable?</h2>
            <p>I started with a question rather than a detailed specification. I wanted to explore a simple game, find a direction small enough to build, and understand how AI could help me get there.</p>
            <p>Early conversations with ChatGPT explored familiar mechanics, including Flappy Bird-style interaction. Comparing those possibilities gradually led me toward a space rocket game: Space Shooter.</p>
          </div>
        </section>

        <section class="case-section section-decisions" id="space-shooter-decisions">
          <div class="section-copy">
            <p class="case-kicker">Key decisions</p>
            <h2>Explore the idea, then give the build a clear structure.</h2>
          </div>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 01</span>
              <h3>Use conversation to find a manageable direction.</h3>
              <p>I used ChatGPT to brainstorm concepts, compare simple mechanics, and narrow the idea. This helped me turn an open-ended interest in making a game into a small, buildable interaction.</p>
            </div>
          </section>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 02</span>
              <h3>Break implementation into sequential prompts.</h3>
              <p>Once the concept was clear, I asked ChatGPT to create step-by-step implementation prompts. I took those prompts into Cursor one at a time, giving me a path through the build and opportunities to review the result as it developed.</p>
            </div>
          </section>
          <section class="decision-card decision-card--stacked">
            <div class="decision-copy">
              <span>Decision 03</span>
              <h3>Give each tool a role while keeping the direction with me.</h3>
              <p>ChatGPT helped me think through the concept and structure the work. Cursor helped translate those instructions into a working interactive experience. I decided what to make, evaluated the output, and guided the process.</p>
            </div>
          </section>
        </section>

        <section class="case-section section-sage" id="space-shooter-experience">
          <div class="section-copy">
            <p class="case-kicker">Final experience</p>
            <h2>A playable game, and a workflow I could use again.</h2>
            <p>The experiment resulted in a working space shooter game. Moving from a conversation to sequential implementation prompts helped me reach a playable result faster than figuring out the entire implementation path myself.</p>
            <p>The workflow was simple: ideate in ChatGPT, define the game, generate build prompts, implement in Cursor, and review the result.</p>
          </div>
        </section>

        <section class="case-section reflection-section" id="space-shooter-reflection">
          <div class="section-copy">
            <p class="case-kicker">Reflection</p>
            <h2>I didn&rsquo;t need a perfect specification to start building.</h2>
            <p>I learned that I could explore, narrow, structure, and build with AI supporting each step differently. The value extended beyond generating code: AI helped me move from an unclear idea to a structured, buildable interaction.</p>
            <p>This became the starting point for how I approached more complex AI-assisted prototypes and design-to-code work.</p>
          </div>
        </section>
      </div>
    </div>
    <section class="case-next-project next-project" aria-labelledby="space-shooter-more-title">
      <div class="case-next-project__inner">
        <p class="case-kicker">More experiments</p>
        <h3 id="space-shooter-more-title">Explore AI Lab</h3>
        <p>Projects, workshops, and experiments in designing with AI.</p>
        <a class="icon-link" href="#ai-lab" data-page="ai-lab" data-scroll-target="ai-projects">Back to AI Lab projects<span class="ui-icon ui-icon--arrow-right" aria-hidden="true"></span></a>
      </div>
    </section>
  </article>
</section>
```

