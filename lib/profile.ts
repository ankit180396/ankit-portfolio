export type ProjectCategory = "AI & Backend" | "Data & ML" | "Full Stack";

export type Project = {
  title: string;
  eyebrow: string;
  summary: string;
  outcome: string;
  tags: string[];
  categories: ProjectCategory[];
  href?: string;
  linkLabel?: string;
  featured?: boolean;
};

export const impactStats = [
  { value: "7+", label: "years building production systems" },
  { value: "1,500+", label: "users served by healthcare software" },
  { value: "300+", label: "facilities supported" },
  { value: "80%+", label: "manual documentation reduced" },
];

export const focusAreas = [
  {
    label: "Applied AI",
    title: "Grounded AI that fits real workflows",
    description:
      "LLM applications, RAG, evaluation, and human-in-the-loop workflows designed around reliability and measurable adoption.",
    tags: ["Azure OpenAI", "RAG", "LangGraph", "Evaluation"],
  },
  {
    label: "Backend Engineering",
    title: "APIs and services built for production",
    description:
      "Python and C# services with clear contracts, asynchronous jobs, validation, observability, and maintainable boundaries.",
    tags: ["Python", "FastAPI", "C#/.NET", "REST"],
  },
  {
    label: "Data Platforms",
    title: "Data systems that move decisions forward",
    description:
      "High-volume ingestion, transformation, analytics, and cloud workflows spanning application and data layers.",
    tags: ["SQL", "Databricks", "PySpark", "AWS & Azure"],
  },
];

export const projects: Project[] = [
  {
    title: "Clinical AI Operations Platform",
    eyebrow: "Production case study · Blue Purpose",
    summary:
      "Built healthcare application workflows across Python, FastAPI, C#/.NET, SQL Server, Azure jobs, and Azure OpenAI for a multi-organization clinical platform.",
    outcome:
      "Served about 1,500 users across 14 organizations and 300+ facilities while reducing manual clinical documentation by more than 80%.",
    tags: ["Python", "FastAPI", "Azure OpenAI", "C#/.NET", "SQL Server"],
    categories: ["AI & Backend", "Full Stack"],
    featured: true,
  },
  {
    title: "MarketplaceSpendAI",
    eyebrow: "AI architecture case study",
    summary:
      "Designed a multi-tenant spend analytics platform with tenant-isolated workflows, API-driven document processing, and grounded AI analysis.",
    outcome:
      "Connected Python and C# services with Azure SQL, Azure App Service, and Azure OpenAI in a scalable SaaS architecture.",
    tags: ["RAG", "Python", "Azure OpenAI", "Azure SQL", "Multi-tenant SaaS"],
    categories: ["AI & Backend", "Data & ML", "Full Stack"],
    featured: true,
  },
  {
    title: "Enterprise Procurement Intelligence",
    eyebrow: "Applied ML · Ernst & Young",
    summary:
      "Translated procurement and planning workflows into machine-learning and automation systems used for enterprise decision support.",
    outcome:
      "Contributed approximately $30M in business impact and delivered additional Python automation associated with about $1M in savings.",
    tags: ["Python", "Machine Learning", "SQL", "APIs", "Automation"],
    categories: ["Data & ML", "AI & Backend"],
    featured: true,
  },
  {
    title: "Portfolio AI Assistant",
    eyebrow: "Open-source system · This repository",
    summary:
      "A recruiter-facing assistant over a curated public knowledge base, with deterministic retrieval, streaming responses, request validation, and bounded usage.",
    outcome:
      "Turns this portfolio into a working example of product thinking, safe AI integration, TypeScript, and production-aware engineering.",
    tags: ["Next.js", "TypeScript", "AI SDK", "AI Gateway", "Testing"],
    categories: ["AI & Backend", "Full Stack"],
    href: "https://github.com/ankit180396/ankit-portfolio",
    linkLabel: "View source",
    featured: true,
  },
  {
    title: "NFL Statistics Platform",
    eyebrow: "Public code",
    summary:
      "An ASP.NET Core MVC application for game statistics, team views, comments, flags, and detailed football analysis.",
    outcome:
      "Demonstrates C# web application structure, controllers, domain models, views, and external data integration.",
    tags: ["C#", "ASP.NET Core", "MVC", "REST APIs"],
    categories: ["Full Stack", "AI & Backend"],
    href: "https://github.com/ankit180396/NFL-Stats",
    linkLabel: "View repository",
  },
  {
    title: "Bank Marketing Analysis",
    eyebrow: "Public notebook",
    summary:
      "Exploratory analysis and predictive modeling over a bank marketing dataset to study term-deposit conversion behavior.",
    outcome:
      "Demonstrates an end-to-end analytics workflow from data exploration through model evaluation and business interpretation.",
    tags: ["Python", "Jupyter", "Classification", "EDA"],
    categories: ["Data & ML"],
    href: "https://github.com/ankit180396/Bank-Marketing-Case",
    linkLabel: "View notebook",
  },
];

export const experience = [
  {
    company: "Blue Purpose",
    role: "AI Software Engineer",
    period: "2026 · Most recent",
    summary:
      "Production healthcare applications, AI-assisted workflows, APIs, asynchronous jobs, cloud services, and reliability work across Python and .NET.",
    highlights: ["1,500 users", "14 organizations", "300+ facilities"],
  },
  {
    company: "ClinDCast",
    role: "Data Engineer / AI Engineer",
    period: "2025 – 2026",
    summary:
      "Healthcare data ingestion, validation, transformation, APIs, and analytics using Python, SQL, AWS Lambda, S3, and Redshift.",
    highlights: ["60% less manual QA", "Nearly 3× faster reporting"],
  },
  {
    company: "Ernst & Young",
    role: "Business Consultant / Software & Data Engineer",
    period: "2022 – 2023",
    summary:
      "Enterprise software, ML, automation, and analytical solutions delivered from requirements through production with cross-functional stakeholders.",
    highlights: ["$30M business impact", "$1M automation savings"],
  },
  {
    company: "Trident Analytical Solutions",
    role: "Python Developer",
    period: "2018 – 2022",
    summary:
      "Python applications, reusable backend components, REST APIs, and high-volume production data processing with testing and CI/CD.",
    highlights: ["1+ TB workloads", "Parallel processing"],
  },
  {
    company: "TAC Automations",
    role: "Junior Engineer",
    period: "2017 – 2018",
    summary:
      "Python and MySQL predictive-maintenance software on Raspberry Pi for real-time industrial equipment monitoring.",
    highlights: ["Python", "IoT", "Real-time systems"],
  },
];

export const skillGroups = [
  {
    title: "Languages & services",
    items: ["Python", "SQL", "TypeScript", "JavaScript", "C#", "FastAPI", "Flask", "REST", "Microservices"],
  },
  {
    title: "Applied AI & ML",
    items: ["LLMs", "RAG", "Azure OpenAI", "LangGraph", "LangChain", "MCP", "scikit-learn", "PyTorch"],
  },
  {
    title: "Data & cloud",
    items: ["PostgreSQL", "SQL Server", "Databricks", "PySpark", "Azure", "AWS", "Docker", "CI/CD"],
  },
  {
    title: "Engineering practice",
    items: ["System design", "Async workflows", "Pytest", "API testing", "Observability", "Git", "Agile delivery"],
  },
];

export type KnowledgeChunk = {
  id: string;
  source: string;
  keywords: string[];
  text: string;
};

export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: "profile",
    source: "Profile summary",
    keywords: ["about", "summary", "background", "years", "engineer", "location", "relocation"],
    text:
      "Ankit Choudhary is a Senior Python and Full Stack Software Engineer with 7+ years of experience building production backend services, AI-enabled applications, APIs, and data-intensive platforms. He is based in Tampa, Florida and is open to relocation. His strongest areas are Python, FastAPI, SQL, C#/.NET, TypeScript, cloud systems, and applied AI.",
  },
  {
    id: "blue-purpose",
    source: "Experience: Blue Purpose",
    keywords: ["blue", "purpose", "healthcare", "clinical", "latest", "recent", "users", "facilities", "documentation"],
    text:
      "At Blue Purpose in 2026, Ankit worked as an AI Software Engineer on production healthcare applications. The platform served about 1,500 users across 14 organizations and 300+ facilities. He built workflows using Python, FastAPI, C#/.NET Razor Pages, SQL Server, Azure WebJobs, Azure OpenAI, and REST APIs. An AI-assisted documentation workflow reduced manual effort by more than 80% and changed report generation from hours to seconds.",
  },
  {
    id: "clindcast",
    source: "Experience: ClinDCast",
    keywords: ["clindcast", "data", "healthcare", "aws", "lambda", "redshift", "validation", "qa", "reporting"],
    text:
      "At ClinDCast from 2025 to 2026, Ankit developed production Python services and healthcare data pipelines for ingestion, validation, transformation, APIs, and analytics. Automated validation reduced manual QA effort by about 60%, and SQL and data-processing optimization improved reporting performance by nearly 3x. The stack included AWS Lambda, S3, Redshift, Python, SQL, and REST APIs.",
  },
  {
    id: "ey",
    source: "Experience: Ernst & Young",
    keywords: ["ey", "ernst", "young", "consulting", "procurement", "million", "impact", "automation", "stakeholder"],
    text:
      "At Ernst & Young from 2022 to 2023, Ankit delivered enterprise software, automation, machine-learning, and analytics solutions. A procurement intelligence initiative contributed approximately $30M in business impact. Separate Python automation reduced processing time by about 60%, automated nearly 90% of manual effort, and contributed about $1M in savings. He worked across requirements, technical design, implementation, testing, demos, and production delivery.",
  },
  {
    id: "trident",
    source: "Experience: Trident Analytical Solutions",
    keywords: ["trident", "python", "developer", "terabyte", "parallel", "oop", "backend", "api", "early"],
    text:
      "At Trident Analytical Solutions from 2018 to 2022, Ankit designed and maintained Python applications, backend automation, REST APIs, and production data-processing systems. He built reusable OOP-based components and high-volume workflows handling more than 1 TB with parallel and multiprocessing techniques. His work included Git-based development, peer reviews, automated testing, CI/CD, and production troubleshooting.",
  },
  {
    id: "marketplace-spend-ai",
    source: "Project: MarketplaceSpendAI",
    keywords: ["marketplace", "spend", "rag", "saas", "tenant", "azure", "document", "architecture"],
    text:
      "MarketplaceSpendAI is Ankit's selected architecture project. He designed a multi-tenant SaaS analytics platform with scalable APIs, modular services, tenant-isolated Azure SQL workflows, API-driven batch and report processing, and AI-assisted document analysis. The stack includes Python, C#, Azure SQL, Azure App Service, and Azure OpenAI.",
  },
  {
    id: "skills",
    source: "Technical skills",
    keywords: ["skills", "stack", "technology", "python", "fastapi", "sql", "cloud", "azure", "aws", "llm", "rag", "frontend"],
    text:
      "Ankit's core stack includes Python, SQL, TypeScript, JavaScript, C#, FastAPI, Flask, Django, REST APIs, microservices, async Python, PostgreSQL, SQL Server, Azure SQL, Databricks, PySpark, Azure, AWS Lambda, S3, Redshift, Docker, Git, CI/CD, Pytest, system design, Azure OpenAI, LLM applications, RAG, LangGraph, LangChain, and MCP.",
  },
  {
    id: "education",
    source: "Education",
    keywords: ["education", "degree", "masters", "university", "usf", "gpa", "btech"],
    text:
      "Ankit earned an MS in Business Analytics and Information Systems from the University of South Florida in 2025 with a 3.87 GPA. He earned a B.Tech in Electronics and Communication Engineering from Krishna Engineering College in 2017.",
  },
  {
    id: "working-style",
    source: "Working style",
    keywords: ["leadership", "team", "stakeholder", "work", "style", "ownership", "communication", "fit"],
    text:
      "Ankit works across engineering, data, product, and business stakeholders. His experience spans discovery, requirements translation, solution design, hands-on implementation, testing, production support, and explaining technical tradeoffs in business terms. He is strongest in roles that combine coding ownership with measurable operational outcomes.",
  },
];

export const suggestedQuestions = [
  "What production AI systems has Ankit built?",
  "Which backend technologies is he strongest in?",
  "What measurable impact has his work delivered?",
  "Why is he a fit for an applied AI engineering role?",
];
