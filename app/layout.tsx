import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://zavia-school.vercel.app"),
  title: {
    default: "Zavia School System - Academic & Management Portal",
    template: "%s | Zavia School System",
  },
  description:
    "Official Academic & Management Portal for Zavia School System. Dedicated platform for students, faculty, and administration for homework diaries, past papers, syllabus, and official circulars.",
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  openGraph: {
    title: "Zavia School System - Academic & Management Portal",
    description:
      "Official Academic & Management Portal for Zavia School System. Daily homework diaries, past papers, syllabus notices, and administrative announcements.",
    siteName: "Zavia School System",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 800,
        alt: "Zavia School System Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
