import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Youtube,
  MessageCircle,
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Award,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const portals = [
  {
    key: "student",
    title: "Student Portal",
    subtitle: "Students & Parents",
    text: "Access daily diary homework, exam papers, syllabus, and official school circulars.",
    href: "/login?role=student",
    accent: "blue",
    iconBg: "bg-blue-600 text-white shadow-blue-500/30",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    features: ["Daily Diary & Homework", "Past Papers & Test Bank", "Circulars & Notices"],
    Icon: GraduationCap,
  },
  {
    key: "teacher",
    title: "Teacher Portal",
    subtitle: "Faculty & Staff",
    text: "Assign daily homework, upload exam test papers, and view faculty announcements.",
    href: "/login?role=teacher",
    accent: "emerald",
    iconBg: "bg-emerald-600 text-white shadow-emerald-500/30",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    features: ["Post Subject Homework", "Upload Exam Papers", "Staff Circulars"],
    Icon: BookOpen,
  },
  {
    key: "principal",
    title: "Principal Portal",
    subtitle: "School Administration",
    text: "Complete administrative control: manage student roster, broadcast notices, and school settings.",
    href: "/login?role=principal",
    accent: "purple",
    iconBg: "bg-indigo-700 text-white shadow-indigo-500/30",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    features: ["Student Roster & Classes", "Broadcast Notices", "System Configuration"],
    Icon: ShieldCheck,
  },
];

export default async function Home() {
  let settings = null;
  try {
    const { data } = await createClient()
      .from("school_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    settings = data;
  } catch (err) {
    // Graceful fallback if database connection or tables are initializing
    settings = null;
  }

  // Fallback defaults if not set in database
  const rawYt = settings?.youtube_url || "https://youtube.com/";
  const youtubeUrl = rawYt.startsWith("http") ? rawYt : `https://${rawYt}`;
  const whatsappNum = settings?.whatsapp_number || "+92 301 4717700";
  const contactEmail = settings?.contact_email || "zaviaschool2015@gmail.com";
  const cleanPhone = (whatsappNum ? whatsappNum.replace(/\D/g, "") : "") || "923486868167";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">

      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-3.5 group">
            <img
              src="/Zavia.jpeg"
              alt="Zavia School System Logo"
              className="w-11 h-11 rounded-full border border-slate-200 shadow-sm object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">
                Zavia School System
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                25 Years of Academic Excellence
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-all duration-150 active:scale-95 shadow-sm"
            >
              <span>Student Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-10 sm:py-14 space-y-16">

        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Prominent Logo */}
          <div className="flex justify-center">
            <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-xl">
              <img
                src="/Zavia.jpeg"
                alt="Zavia School System Crest"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-inner object-cover"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>25 Years of Academic Excellence</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Zavia School System
            </h1>
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
              School Management & Academic Portal
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            A unified, secure academic platform for Students, Teachers, and Administration to access daily homework, past papers, syllabus notices, and direct school communication.
          </p>
        </div>

        {/* 3 Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {portals.map(({ key, title, subtitle, text, href, iconBg, badge, features, Icon }) => (
            <Link
              key={key}
              href={href}
              className="group relative bg-white border border-slate-200/90 hover:border-indigo-400 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badge}`}>
                    {subtitle}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {text}
                  </p>
                </div>

                {/* Feature checklist */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 group-hover:underline">
                  Sign In to Portal
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Socials & Official Connect Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl border border-slate-800">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-indigo-200 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Stay Connected with Zavia School System
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Official Channels & Direct Support
              </h3>
              <p className="text-sm text-slate-300">
                Subscribe to our official YouTube channel for recorded syllabus lectures, reach our WhatsApp helpdesk for instant queries, or email school management.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* YouTube Button */}
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all duration-200 shadow-sm active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-sm">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-red-200 font-semibold block">Official Video Portal</span>
                    <span className="text-sm font-bold text-white">YouTube Channel</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </a>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all duration-200 shadow-sm active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-200 font-semibold block">Direct Helpdesk</span>
                    <span className="text-sm font-bold text-white">WhatsApp Official</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </a>

              {/* Support Email */}
              <a
                href={`mailto:${contactEmail}`}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all duration-200 shadow-sm active:scale-95"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-slate-700 text-white rounded-xl shadow-sm flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-slate-300 font-semibold block">Administration Email</span>
                    <span className="text-sm font-bold text-white truncate block">{contactEmail}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* New Student Onboarding Banner */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-900">Are you a newly admitted student?</h4>
            <p className="text-sm text-slate-600">
              Create your student account to register your class and start receiving real-time homework & notices.
            </p>
          </div>
          <Link
            href="/signup"
            className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all duration-150 active:scale-95"
          >
            <span>Register Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3 font-medium">
            <img
              src="/Zavia.jpeg"
              alt="Zavia School System"
              className="w-7 h-7 rounded-full border border-slate-200 object-cover"
            />
            <span>Zavia School System</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition font-medium">YouTube</a>
            <span>•</span>
            <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition font-medium">WhatsApp (+92 348 6868167)</a>
            <span>•</span>
            <a href={`mailto:${contactEmail}`} className="hover:text-indigo-600 transition font-medium">{contactEmail}</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
