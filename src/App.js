import React, { useState, useEffect } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto space-y-10 bg-white text-black dark:bg-gray-900 dark:text-white transition-all">
      <div className="flex justify-end">
        <button
          className="border px-4 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <section className="text-center">
        <h1 className="text-5xl font-bold">Ankit Choudhary</h1>
        <p className="text-lg mt-2">Software Engineer | Data Scientist</p>
        <p className="text-md mt-1">
          Tampa, FL | ankit.er1803@gmail.com | +1 (813) 577-0169
        </p>
        <div className="mt-2 space-x-4">
          <a href="https://www.linkedin.com/in/ankit-choudhary1803/" className="underline text-blue-600 dark:text-blue-400">
            LinkedIn
          </a>
          <a href="https://github.com/ankit180396" className="underline text-blue-600 dark:text-blue-400">
            GitHub
          </a>
          <a href="https://ankit180396.github.io/" className="underline text-blue-600 dark:text-blue-400">
            Portfolio
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">About Me</h2>
        <p>
          I’m a Software Engineer and Data Scientist with over 6 years of experience delivering data-driven solutions that drive real business impact. I recently completed my Master’s in AI & Business Analytics from the University of South Florida. I specialize in Python, machine learning, full-stack systems, and turning complex datasets into actionable insights.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Experience</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold">Ernst & Young</h3>
            <p className="italic">Business Consultant (2022 – 2023)</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Reduced Python runtime by 60%, saving 1100+ hours and ~$1M annually.</li>
              <li>Led ML project for Dupont, cutting manual labor by 30%, saving $30M.</li>
              <li>Refactored APIs for P&G datasets, saving $10M and 250 hours of labor.</li>
              <li>Built a global AI-powered SaaS platform adopted in 7 countries.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold">Trident Analytical Solutions</h3>
            <p className="italic">Python Developer (2018 – 2022)</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Processed 1000 GB+ datasets from Amazon/eBay, boosting sales by 30%.</li>
              <li>Developed dashboards and ML tools, reducing manual work by 70%.</li>
              <li>Created a behavioral tracker that improved ROI by 20%.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold">TAC Automations</h3>
            <p className="italic">Junior Engineer (2017 – 2018)</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Built early-failure detection systems on Raspberry Pi, saving $5M.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border rounded p-4 dark:border-gray-700">
            <h4 className="font-semibold">ML Production Optimization</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Dupont project with $30M+ savings.</p>
          </div>
          <div className="border rounded p-4 dark:border-gray-700">
            <h4 className="font-semibold">SO2 Emissions Monitoring</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Real-time system with Kafka + Spark.</p>
          </div>
          <div className="border rounded p-4 dark:border-gray-700">
            <h4 className="font-semibold">Bank Term Deposit Model</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">Achieved 80% prediction accuracy.</p>
          </div>
          <div className="border rounded p-4 dark:border-gray-700">
            <h4 className="font-semibold">ETL Pipeline + DataMart</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">MySQL + Tableau integration for eCommerce.</p>
          </div>
          <div className="border rounded p-4 dark:border-gray-700">
            <h4 className="font-semibold">Campaign Analysis</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">R-based statistical modeling and testing.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Skills</h2>
        <p>
          <strong>Languages:</strong> Python, JavaScript, SQL, HTML, CSS, R, NodeJS<br />
          <strong>Frameworks:</strong> Flask, Django, FastAPI, ReactJS<br />
          <strong>Databases:</strong> PostgreSQL, MongoDB, MySQL, Cassandra, Oracle<br />
          <strong>Tools:</strong> Git, Spark, Kafka, Tableau, Power BI, Azure, AWS, Snowflake, GCP<br />
          <strong>Focus Areas:</strong> ML Models, APIs, Data Engineering, Forecasting, SaaS, Real-Time Systems
        </p>
      </section>

      <footer className="border-t pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Ankit Choudhary. All rights reserved.</p>
        <p className="mt-1">This site uses Umami for privacy-friendly analytics. No cookies or tracking.</p>
      </footer>
    </div>
  );
}
