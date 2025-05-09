import React from "react";

export default function App() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <section className="text-center">
        <h1 className="text-4xl font-bold">Ankit Choudhary</h1>
        <p className="text-lg mt-2">Software Engineer | Data Scientist</p>
        <p className="text-md mt-1">
          Tampa, FL | ankit.er1803@gmail.com | +1 (813) 577-0169
        </p>
        <div className="mt-2 space-x-4">
          <a
            href="https://www.linkedin.com/in/ankit-choudhary1803/"
            className="underline text-blue-600"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/ankit180396"
            className="underline text-blue-600"
          >
            GitHub
          </a>
          <a
            href="https://ankit180396.github.io/"
            className="underline text-blue-600"
          >
            Portfolio
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">About Me</h2>
        <p>
          I’m a Software Engineer and Data Scientist with over 6 years of
          experience delivering data-driven solutions that drive real business
          impact. I recently completed my Master’s in AI & Business Analytics
          from the University of South Florida. I specialize in Python, machine
          learning, full-stack systems, and turning complex datasets into
          actionable insights.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Experience</h2>
        <ul className="space-y-4">
          <li>
            <strong>Ernst & Young</strong> — Business Consultant (2022 – 2023)
            <ul className="list-disc list-inside">
              <li>
                Reduced Python runtime by 60%, saving 1100+ hours and ~$1M
                annually.
              </li>
              <li>
                Led ML project for Dupont, cutting manual labor by 30%, saving
                $30M.
              </li>
              <li>
                Refactored APIs for P&G datasets, saving $10M and 250 hours of
                labor.
              </li>
              <li>
                Built a global AI-powered SaaS platform adopted in 7 countries.
              </li>
            </ul>
          </li>
          <li>
            <strong>Trident Analytical Solutions</strong> — Python Developer
            (2018 – 2022)
            <ul className="list-disc list-inside">
              <li>
                Processed 1000 GB+ datasets from Amazon/eBay, boosting sales by
                30%.
              </li>
              <li>
                Developed dashboards and ML tools, reducing manual work by 70%.
              </li>
              <li>
                Created a behavioral tracker that improved ROI by 20%.
              </li>
            </ul>
          </li>
          <li>
            <strong>TAC Automations</strong> — Junior Engineer (2017 – 2018)
            <ul className="list-disc list-inside">
              <li>
                Built early-failure detection systems on Raspberry Pi, saving
                $5M.
              </li>
            </ul>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Projects</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>ML Production Optimization:</strong> Dupont project with
            $30M+ savings.
          </li>
          <li>
            <strong>SO2 Emissions Monitoring:</strong> Real-time system with
            Kafka + Spark.
          </li>
          <li>
            <strong>Bank Term Deposit Model:</strong> Achieved 80% prediction
            accuracy.
          </li>
          <li>
            <strong>ETL Pipeline + DataMart:</strong> MySQL + Tableau
            integration for eCommerce.
          </li>
          <li>
            <strong>Campaign Analysis:</strong> R-based statistical modeling and
            testing.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Skills</h2>
        <p>
          <strong>Languages:</strong> Python, JavaScript, SQL, HTML, CSS, R,
          NodeJS
          <br />
          <strong>Frameworks:</strong> Flask, Django, FastAPI, ReactJS
          <br />
          <strong>Databases:</strong> PostgreSQL, MongoDB, MySQL, Cassandra,
          Oracle
          <br />
          <strong>Tools:</strong> Git, Spark, Kafka, Tableau, Power BI, Azure,
          AWS, Snowflake, GCP
          <br />
          <strong>Focus Areas:</strong> ML Models, APIs, Data Engineering,
          Forecasting, SaaS, Real-Time Systems
        </p>
      </section>
    </div>
  );
}
