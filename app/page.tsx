import { ChatPanel } from "@/components/chat-panel";
import Image from "next/image";
import {
  ArrowUpRight,
  Brain,
  Code,
  Database,
  Github,
  Linkedin,
  Mail,
  Sparkles,
} from "@/components/icons";
import { ProjectExplorer } from "@/components/project-explorer";
import { ThemeToggle } from "@/components/theme-toggle";
import { experience, focusAreas, impactStats, skillGroups } from "@/lib/profile";

const focusIcons = [Brain, Code, Database];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ankit Choudhary",
  url: "https://ankit-choudhary-portfolio.vercel.app",
  jobTitle: "Senior Software and Applied AI Engineer",
  address: { "@type": "PostalAddress", addressLocality: "Tampa", addressRegion: "FL" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of South Florida",
  },
  sameAs: [
    "https://github.com/ankit180396",
    "https://www.linkedin.com/in/ankit-choudhary1803/",
  ],
  knowsAbout: ["Python", "FastAPI", "Applied AI", "RAG", "SQL", "Azure", "AWS", "C#"],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="siteHeader">
        <a className="brand" href="#top" aria-label="Ankit Choudhary, back to top">
          <span>AC</span>
          <strong>Ankit Choudhary</strong>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#assistant">Ask AI</a>
          <ThemeToggle />
          <a className="navContact" href="mailto:ankit.er1803@gmail.com">
            Let&apos;s talk
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />
        <div className="heroContent">
          <div className="heroCopy">
            <p className="eyebrow">
              <span /> Senior Software Engineer · Applied AI · Production Systems
            </p>
            <h1>
              I build intelligent systems that <em>hold up in production.</em>
            </h1>
            <p className="heroLead">
              Seven-plus years turning complex operational problems into reliable APIs,
              data platforms, and AI-enabled products with measurable business impact.
            </p>
            <div className="heroActions">
              <a className="primaryButton" href="#work">
                Explore selected work <ArrowUpRight />
              </a>
              <a className="secondaryButton" href="#assistant">
                <Sparkles /> Ask my portfolio
              </a>
            </div>
            <div className="availabilityRow">
              <span className="availabilityDot" />
              Tampa, FL · Open to relocation · Exploring senior engineering opportunities
            </div>
          </div>

          <div className="heroVisual">
            <figure className="portraitCard">
              <div className="portraitFrame">
                <Image
                  src="/ankit-headshot-v2.webp"
                  alt="Ankit Choudhary"
                  fill
                  priority
                  sizes="(max-width: 600px) 82vw, 400px"
                />
              </div>
              <figcaption className="portraitCaption">
                <div className="portraitIdentity">
                  <span className="portraitStatus"><i /> Currently exploring</span>
                  <strong>Senior AI &amp; backend engineering roles</strong>
                </div>
                <div className="portraitExperience" aria-label="More than seven years building production systems">
                  <strong>7+</strong>
                  <span>years shipping<br />production systems</span>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="impactGrid" aria-label="Career impact highlights">
          {impactStats.map((stat) => (
            <div className="impactItem" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section sectionIntro" aria-labelledby="what-i-build">
        <div className="sectionHeading">
          <p className="sectionKicker">Where I create value</p>
          <h2 id="what-i-build">Engineering across the full path from idea to adoption.</h2>
          <p>
            My best work sits where product judgment, software engineering, data, and AI
            meet. I stay close to the workflow and own the details needed to ship.
          </p>
        </div>
        <div className="focusGrid">
          {focusAreas.map((area, index) => {
            const Icon = focusIcons[index];
            return (
              <article className="focusCard" key={area.title}>
                <div className="focusIcon"><Icon /></div>
                <span className="focusLabel">0{index + 1} · {area.label}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <div className="tagRow">
                  {area.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section" id="work" aria-labelledby="selected-work">
        <div className="sectionHeading sectionHeadingSplit">
          <div>
            <p className="sectionKicker">Selected work</p>
            <h2 id="selected-work">Proof over buzzwords.</h2>
          </div>
          <p>
            Case studies foreground the problem, engineering choices, and outcome. Public
            links are included only where the repository is appropriate to share.
          </p>
        </div>
        <ProjectExplorer />
      </section>

      <section className="section experienceSection" id="experience" aria-labelledby="experience-title">
        <div className="sectionHeading sectionHeadingSplit">
          <div>
            <p className="sectionKicker">Experience</p>
            <h2 id="experience-title">A progression toward production AI.</h2>
          </div>
          <p>
            Built from a foundation in automation and data systems into backend,
            full-stack, cloud, and applied AI ownership.
          </p>
        </div>
        <div className="timeline">
          {experience.map((job, index) => (
            <article className="timelineItem" key={`${job.company}-${job.role}`}>
              <div className="timelineIndex">{String(index + 1).padStart(2, "0")}</div>
              <div className="timelineMeta">
                <span>{job.period}</span>
                <h3>{job.company}</h3>
                <p>{job.role}</p>
              </div>
              <div className="timelineBody">
                <p>{job.summary}</p>
                <div className="timelineHighlights">
                  {job.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section skillsSection" aria-labelledby="skills-title">
        <div className="sectionHeading">
          <p className="sectionKicker">Technical range</p>
          <h2 id="skills-title">Broad enough to connect the system. Deep where it counts.</h2>
        </div>
        <div className="skillsGrid">
          {skillGroups.map((group, index) => (
            <article className="skillGroup" key={group.title}>
              <span>0{index + 1}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className="educationBand">
          <div>
            <span>Education</span>
            <strong>MS, Business Analytics & Information Systems</strong>
            <p>University of South Florida · 2025 · GPA 3.87</p>
          </div>
          <div>
            <span>Foundation</span>
            <strong>B.Tech, Electronics & Communication Engineering</strong>
            <p>Krishna Engineering College · 2017</p>
          </div>
        </div>
      </section>

      <section className="section assistantSection" id="assistant" aria-labelledby="assistant-title">
        <div className="assistantCopy">
          <p className="sectionKicker">Interactive portfolio</p>
          <h2 id="assistant-title">Ask the questions you would ask in a first-round screen.</h2>
          <p>
            This assistant retrieves from a curated, public knowledge base and responds
            with source labels. It is deliberately bounded: no private history, no
            confidential client details, and no invented answers.
          </p>
          <ul className="assistantPrinciples">
            <li><span>01</span> Deterministic retrieval before generation</li>
            <li><span>02</span> Bounded context, output, and request rate</li>
            <li><span>03</span> Honest fallback when evidence is missing</li>
          </ul>
        </div>
        <ChatPanel />
      </section>

      <section className="contactSection" id="contact">
        <p className="sectionKicker">Let&apos;s build something useful</p>
        <h2>Looking for an engineer who can connect AI ambition to production reality?</h2>
        <p>
          I&apos;m open to senior software, applied AI, backend, and forward-deployed
          engineering opportunities where ownership and measurable outcomes matter.
        </p>
        <div className="contactActions">
          <a className="primaryButton" href="mailto:ankit.er1803@gmail.com?subject=Opportunity%20for%20Ankit%20Choudhary">
            <Mail /> Start a conversation
          </a>
          <a className="secondaryButton" href="https://www.linkedin.com/in/ankit-choudhary1803/" target="_blank" rel="noreferrer">
            <Linkedin /> LinkedIn
          </a>
          <a className="secondaryButton" href="https://github.com/ankit180396" target="_blank" rel="noreferrer">
            <Github /> GitHub
          </a>
        </div>
      </section>

      <footer>
        <div className="footerBrand"><span>AC</span><strong>Ankit Choudhary</strong></div>
        <p>Designed and engineered as a production-minded portfolio.</p>
        <div>
          <a href="mailto:ankit.er1803@gmail.com" aria-label="Email Ankit"><Mail /></a>
          <a href="https://www.linkedin.com/in/ankit-choudhary1803/" target="_blank" rel="noreferrer" aria-label="Ankit on LinkedIn"><Linkedin /></a>
          <a href="https://github.com/ankit180396" target="_blank" rel="noreferrer" aria-label="Ankit on GitHub"><Github /></a>
        </div>
      </footer>
    </main>
  );
}
