import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://sathvikreddy.dev"),
  title: {
    default: "Sathvik Reddy Puli — Senior Data Engineer",
    template: "%s · Sathvik Reddy Puli",
  },
  description:
    "Senior Data Engineer architecting real-time pipelines, cloud-native lakehouses, and AI-driven analytics platforms across fintech and healthcare.",
  keywords: [
    "Senior Data Engineer",
    "Real-time Pipelines",
    "Apache Spark",
    "Kafka",
    "Airflow",
    "AWS",
    "Redshift",
    "Databricks",
    "dbt",
    "AI Integrations",
    "Sathvik Reddy Puli",
  ],
  authors: [{ name: "Sathvik Reddy Puli" }],
  creator: "Sathvik Reddy Puli",
  openGraph: {
    type: "website",
    title: "Sathvik Reddy Puli — Senior Data Engineer",
    description:
      "Cinematic portfolio of a senior data engineer building enterprise-grade real-time data systems.",
    siteName: "Sathvik Reddy Puli",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sathvik Reddy Puli — Senior Data Engineer",
    description:
      "Cinematic portfolio of a senior data engineer building enterprise-grade real-time data systems.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#02030a",
  width: "device-width",
  initialScale: 1,
  // Allow user pinch-zoom for accessibility
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
