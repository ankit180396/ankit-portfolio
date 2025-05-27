import React, { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaGithub, FaLinkedin, FaGlobe, FaExternalLinkAlt, FaPython, FaReact, FaAws, FaJsSquare, FaChartBar } from "react-icons/fa";
import { SiTypescript, SiFastapi, SiRedux, SiMongodb, SiPostgresql, SiSnowflake, SiApachekafka, SiApachespark, SiScikitlearn, SiTensorflow, SiPytorch, SiNumpy, SiPandas, SiTableau, SiGooglecloud } from "react-icons/si";
export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark;
    }
    return false;
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const toast = document.createElement('div');
    toast.id = 'theme-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '10px 20px';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.borderRadius = '5px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.transition = 'opacity 0.3s ease-in-out';
    toast.innerHTML = darkMode 
      ? '<span style="margin-right: 8px;">🌙</span> Dark Mode Enabled' 
      : '<span style="margin-right: 8px;">☀️</span> Light Mode Enabled';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const skills = {
    Languages: [
      { name: "Python", icon: <FaPython className="text-yellow-300 text-3xl mx-auto" /> },
      { name: "JavaScript", icon: <FaJsSquare className="text-yellow-200 text-3xl mx-auto" /> },
      { name: "TypeScript", icon: <SiTypescript className="text-blue-400 text-3xl mx-auto" /> },
      { name: "R", icon: <FaChartBar className="text-purple-400 text-3xl mx-auto" /> },
      { name: "SAS", icon: <FaChartBar className="text-purple-300 text-3xl mx-auto" /> }
    ],
    Frameworks: [
      { name: "ReactJS", icon: <FaReact className="text-blue-400 text-3xl mx-auto" /> },
      { name: "FastAPI", icon: <SiFastapi className="text-teal-400 text-3xl mx-auto" /> },
      { name: "Redux", icon: <SiRedux className="text-purple-300 text-3xl mx-auto" /> },
      { name: "Django", icon: <FaPython className="text-green-300 text-3xl mx-auto" /> },
      { name: "Flask", icon: <FaPython className="text-gray-300 text-3xl mx-auto" /> },
      { name: "NodeJS", icon: <FaJsSquare className="text-green-300 text-3xl mx-auto" /> }
    ],
    Databases: [
      { name: "MongoDB", icon: <SiMongodb className="text-green-400 text-3xl mx-auto" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="text-indigo-300 text-3xl mx-auto" /> },
      { name: "Snowflake", icon: <SiSnowflake className="text-blue-300 text-3xl mx-auto" /> },
      { name: "MySQL", icon: <FaChartBar className="text-blue-400 text-3xl mx-auto" /> },
      { name: "Oracle", icon: <FaChartBar className="text-orange-400 text-3xl mx-auto" /> },
      { name: "Redshift", icon: <FaAws className="text-red-300 text-3xl mx-auto" /> },
      { name: "MSSQL", icon: <FaChartBar className="text-blue-800 text-3xl mx-auto" /> },
      { name: "Cassandra", icon: <FaChartBar className="text-gray-400 text-3xl mx-auto" /> }
    ],
    Tools: [
      { name: "Kafka", icon: <SiApachekafka className="text-gray-200 text-3xl mx-auto" /> },
      { name: "Spark", icon: <SiApachespark className="text-orange-400 text-3xl mx-auto" /> },
      { name: "scikit-learn", icon: <SiScikitlearn className="text-green-300 text-3xl mx-auto" /> },
      { name: "TensorFlow", icon: <SiTensorflow className="text-orange-400 text-3xl mx-auto" /> },
      { name: "PyTorch", icon: <SiPytorch className="text-red-400 text-3xl mx-auto" /> },
      { name: "NumPy", icon: <SiNumpy className="text-blue-300 text-3xl mx-auto" /> },
      { name: "Pandas", icon: <SiPandas className="text-purple-300 text-3xl mx-auto" /> },
      { name: "XGBoost", icon: <FaChartBar className="text-orange-300 text-3xl mx-auto" /> },
      { name: "VSCode", icon: <FaChartBar className="text-blue-300 text-3xl mx-auto" /> },
      { name: "Git", icon: <FaGithub className="text-gray-300 text-3xl mx-auto" /> }
    ],
    CloudAndBI: [
      { name: "AWS", icon: <FaAws className="text-orange-300 text-3xl mx-auto" /> },
      { name: "Tableau", icon: <SiTableau className="text-blue-200 text-3xl mx-auto" /> },
      { name: "Power BI", icon: <FaChartBar className="text-yellow-300 text-3xl mx-auto" /> },
      { name: "Azure", icon: <FaChartBar className="text-blue-500 text-3xl mx-auto" /> },
      { name: "GCP", icon: <SiGooglecloud className="text-yellow-300 text-3xl mx-auto" /> }
    ]
  };

  const projects = [
    {
      title: "ML Production Optimization",
      description: "Dupont model that saved $30M by cutting manual processes by 30%.",
      tech: ["Python", "ML", "APIs"],
      link: "https://github.com/ankit180396/",
      image: "https://tse3.mm.bing.net/th?id=OIP.XX0RxXaAMwsLjCBdCdAJzgHaEK&cb=iwp1&pid=Api"
    },
    {
      title: "SO2 Emissions Monitor",
      description: "Real-time emissions tracking using Kafka and Spark.",
      tech: ["Kafka", "Spark", "Streaming"],
      link: "https://github.com/ankit180396/",
      image: "https://tse3.mm.bing.net/th?id=OIP.SXSMb2sx0ly7Nv4oJPSCfAHaE8&cb=iwc1&pid=Api"
    },
    {
      title: "Bank Term Deposit Predictor",
      description: "Classification model with 80% accuracy using call data.",
      tech: ["scikit-learn", "XGBoost"],
      link: "https://github.com/ankit180396/",
      image: "https://tse3.mm.bing.net/th/id/OIP.koWvAsh_UmILmf-OybknfQHaFj?cb=iwc1&pid=Api"
    },
    {
      title: "E-commerce ETL & Dashboard",
      description: "Data pipeline + dashboarding for product tracking.",
      tech: ["MySQL", "Tableau", "ETL"],
      link: "https://github.com/ankit180396/",
      image: "https://tse1.mm.bing.net/th/id/OIP.g7o7ntlHFmlFHXMmtQzmuQHaEK?cb=iwc1&pid=Api"
    },
    {
      title: "NLP Product Categorizer",
      description: "TF-IDF + SVM pipeline classifying e-comm listings with 85% accuracy.",
      tech: ["Python", "SVM", "NLP"],
      link: "https://github.com/ankit180396/",
      image: "https://images.ctfassets.net/3viuren4us1n/4jw95A7JsM8bx6jPGCBSka/c4b3e5539e9b405ef4f927ef626dd9ad/product_categorization.jpg?fm=webp&w=1920"
    },
    {
      title: "Supply Chain Optimizer",
      description: "Simulation model identifying optimum solution for Suppy Chain.",
      tech: ["Python", "Pandas", "NumPy", "Power Bi"],
      link: "https://github.com/ankit180396/",
      image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FOF6O_3efCQRJ1BvIRJsYg.png"
    },
    {
      title: "ESG Analytics Platform",
      description: "FastAPI + GCP platform generating enterprise ESG reports.",
      tech: ["FastAPI", "SQL", "GCP", "Airflow"],
      link: "https://github.com/ankit180396/",
      image: "https://images.prismic.io/greenly/d5cb8bdb-af3d-4853-904d-bac96a4d54a0_youtube2.jpg?auto=compress%2Cformat&w=894&fit=max&dpr=3"
    },
    {
      title: "Sales Forecast Dashboard",
      description: "ARIMA-powered forecast engine with interactive Power BI visualizations.",
      tech: ["Python", "ARIMA", "Power BI"],
      link: "https://github.com/ankit180396/",
      image: "https://miro.medium.com/v2/resize:fit:1202/1*Vl9EIB10VGioZr7p631kvg.png"
    }
  ];
  

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen px-4 sm:px-8 py-10 bg-white text-black dark:bg-gradient-to-r dark:from-gray-900 dark:via-black dark:to-gray-900 dark:text-white transition-all font-sans">
        <div className="flex justify-end mb-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((prev) => {
              localStorage.setItem('darkMode', JSON.stringify(!prev));
              return !prev;
            })} className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer dark:peer-checked:bg-teal-500 peer-checked:bg-yellow-400 transition-all duration-300"></div>
            <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 flex items-center justify-center">
              {darkMode ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21.75 15.5a9 9 0 01-9.25-14A9 9 0 1012 21c4.08 0 7.53-2.73 8.73-6.5z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6.76 4.84l-1.8-1.79-1.42 1.41 1.79 1.8 1.43-1.42zm10.45-1.79l-1.79 1.8 1.42 1.42 1.8-1.8-1.43-1.42zM12 4c.55 0 1-.45 1-1V1h-2v2c0 .55.45 1 1 1zm8 7h-2c-.55 0-1 .45-1 1s.45 1 1 1h2v-2zm-8 8c-.55 0-1 .45-1 1v2h2v-2c0-.55-.45-1-1-1zm5.24-2.84l1.79 1.8 1.42-1.42-1.8-1.79-1.41 1.41zM4 13c.55 0 1-.45 1-1s-.45-1-1-1H2v2h2zm2.76 4.24l-1.8 1.79 1.42 1.42 1.79-1.8-1.41-1.41zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/></svg>}
            </span>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-700 dark:text-gray-300">{darkMode ? "Dark" : "Light"} Mode</span>
          </label>
        </div>

        {/* HERO SECTION */}
        <section className="text-center mt-10">
          <img
            src="/ankit-photo.jpg"
            alt="Avatar"
            className="w-28 h-28 mx-auto rounded-full shadow-lg border-4 border-white mb-4 transform transition-transform duration-300 hover:scale-110 hover:shadow-xl"
          />
          <h1 className="text-5xl font-extrabold tracking-tight">Ankit Choudhary</h1>
          <p className="text-lg mt-3 font-light">Software Engineer & Data Scientist</p>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-600 dark:text-gray-400">Tampa, FL | ankit.er1803@gmail.com | +1 (813) 577-0169</p>

          <div className="flex justify-center mt-4 gap-6 text-xl">
            <a href="https://www.linkedin.com/in/ankit-choudhary1803/" className="hover:text-blue-400" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://github.com/ankit180396" className="hover:text-gray-300" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="https://ankit180396.github.io/" className="hover:text-teal-400" target="_blank" rel="noopener noreferrer"><FaGlobe /></a>
          </div>
        </section>

        {/* ICON GRID SKILLS SECTION */}
        <section className="mt-16">
          <h2 className="text-3xl font-semibold mb-6 text-center transition-transform duration-300 hover:scale-105 hover:text-teal-500">Skills</h2>
          {Object.entries(skills).map(([category, items], i) => (
            <div key={i} className="mb-10" data-aos="fade-up">
              <h3 className="text-xl font-bold mb-4 text-teal-600 dark:text-teal-300">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center text-sm">
                {items.map((skill, idx) => (
                  <div key={idx} className="bg-white text-black dark:bg-gray-800 dark:text-white p-4 rounded shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105" data-aos="fade-up" data-aos-delay={idx * 100}>
                    {skill.icon}
                    <p className="mt-2">{skill.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

      {/* EXPERIENCE SECTION */}
      <section className="mt-20" data-aos="fade-up">
        <h2 className="text-3xl font-semibold mb-6 text-center">Experience</h2>
        <div className="space-y-6" data-aos="fade-up">
          {[
            {
              company: 'Ernst & Young',
              role: 'Business Consultant',
              dates: 'Jan 2022 – Jul 2023',
              bullets: [
                'Promoted from Assovciate Business Consultant to Business Consultant in under 12 months.',
                'Optimized ETL pipelines in Python and SQL, improving data processing speed by 60%.',
                'Led ML initiatives using scikit-learn and TensorFlow that delivered $30M+ in annualized business impact.',
                'Redesigned data workflows for global CPG client P&G, eliminating 250+ manual hours/month.',
                'Delivered a scalable SaaS analytics platform for ESG metrics using FastAPI and GCP.',
                'Built advanced regression models and classification pipelines for marketing and finance analytics.',
                'Performed statistical hypothesis testing and A/B experimentation for client insights.',
                'Worked closely with cross-functional teams on data modeling and stakeholder dashboards.',
                'Used Docker and Kubernetes to deploy ML microservices across cloud environments.',
                'Created Airflow DAGs for automating data ingestion from external APIs.',
                'Collaborated with DevOps to optimize CI/CD pipelines for data science projects.',
                'Built interactive data visualizations using Power BI and Tableau for executive reporting.'
              ]
            },
            {
              company: 'Trident Analytical Solutions',
              role: 'Python Developer',
              dates: 'Jun 2018 – Jan 2022',
              bullets: [
                'Promoted from Junior Developer to Lead Developer within 2 years.',
                'Built Python-based scraping and enrichment pipelines processing 1000GB+ e-commerce data.',
                'Developed dashboards using Tableau and Power BI to reduce reporting efforts by 70%.',
                'Increased marketing ROI by 20% through predictive analytics and user segmentation.',
                'Designed relational and NoSQL data models for performance-optimized querying.',
                'Used Pandas and NumPy for heavy data wrangling and feature engineering tasks.',
                'Created REST APIs using Flask for data integration with frontend dashboards.',
                'Built scalable ML pipelines for recommendation systems and churn prediction.',
                'Deployed predictive models using CI/CD workflows and Docker containers.',
                'Collaborated with data analysts and DevOps teams for real-time data sync.',
                'Implemented Kafka consumers for event-driven architecture and streaming ingestion.',
                'Developed unit-tested, modularized codebases that were later adopted across projects.'
              ]
            },
            {
              company: 'TAC Automations Pvt Ltd',
              role: 'Junior Engineer (R&D)',
              dates: 'Nov 2017 – May 2018',
              bullets: [
                'Developed fault detection system using Raspberry Pi, reducing manual error by 30%.',
                'Worked on microcontroller interfacing for industrial process control applications.',
                'Built embedded Python scripts for sensor calibration and signal processing.',
                'Collaborated on designing a web-based monitoring tool using Flask and SQLite.',
                'Tested system stability across various fault conditions and provided QA reports.',
                'Integrated serial communication modules for real-time status dashboards.'
              ]
            }
          ].map((job, idx) => (
            <div key={idx} className="bg-white text-black dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-teal-400 transition-transform duration-300">
              <h3 className="text-xl font-bold">{job.company}</h3>
              <p className="text-sm text-gray-600">{job.role} | {job.dates}</p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-500 space-y-1">
                {job.bullets.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <section className="mt-20 animate-fade-in">
        <h2 className="text-3xl font-semibold mb-6 text-center">Education</h2>
        <div className="space-y-6">
          <div className="bg-white text-black dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">University of South Florida</h3>
            <p className="text-sm text-gray-700">MS in Business Analytics & Information Systems | 2023</p>
            <p className="text-sm text-gray-500">Specialized in AI, Machine Learning, and Data Analytics</p>
          </div>
          <div className="bg-white text-black dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">APJ Abdul Kalam Technical University</h3>
            <p className="text-sm text-gray-700">B.Tech in Electronics and Communication | 2017</p>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="mt-20 animate-fade-in">
        <h2 className="text-3xl font-semibold mb-6 text-center">Projects</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6" data-aos="fade-up">
          {projects.map((project, index) => (
            <div key={index} className="bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:-translate-y-1 hover:ring-2 hover:ring-teal-400" data-aos="fade-up" data-aos-delay={index * 100}>
              <img src={project.image} alt={project.title} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Project+Image'; }} className="w-full h-40 object-cover mb-4 hover:opacity-80 transition-opacity duration-300" />
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 text-xs mb-3">
                {project.tech.map((tech, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white px-2 py-1 rounded-full">{tech}</span>
                ))}
              </div>
              <a href={project.link} className="inline-flex items-center text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                View on GitHub <FaExternalLinkAlt className="ml-2 text-sm" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT BUTTON */}
      <a
        href="mailto:ankit.er1803@gmail.com"
        className="fixed bottom-6 right-6 bg-teal-500 hover:bg-teal-600 text-white px-5 py-3 rounded-full shadow-lg text-sm font-semibold tracking-wide transition-all duration-300 z-50"
      >
        Contact Me
      </a>
    </div>
    </div>
  );
}
