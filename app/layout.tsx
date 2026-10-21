import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://ankit-choudhary-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ankit Choudhary | Senior Software & Applied AI Engineer",
  description:
    "Senior Python, full-stack, and applied AI engineer building production APIs, data platforms, and reliable LLM workflows.",
  keywords: [
    "Ankit Choudhary",
    "Senior Software Engineer",
    "AI Engineer",
    "Python",
    "FastAPI",
    "RAG",
    "LLM",
    "Data Engineer",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Ankit Choudhary | Senior Software & Applied AI Engineer",
    description:
      "Production-minded engineering across applied AI, backend services, and data platforms.",
    siteName: "Ankit Choudhary Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Ankit Choudhary | Senior Software & Applied AI Engineer",
    description:
      "Production-minded engineering across applied AI, backend services, and data platforms.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
