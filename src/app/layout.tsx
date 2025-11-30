import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "QuduratPrep",
  description: "Master your English exam with AI-generated quizzes.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
