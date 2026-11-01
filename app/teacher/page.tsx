import { requireRole } from "@/lib/auth";
import Shell from "@/components/Shell";
import AnnouncementFeed from "@/components/AnnouncementFeed";
import {
  TeacherHomeworkForm,
  TeacherPaperForm,
  TeacherHomeworkList,
  TeacherPapersList,
} from "@/components/TeacherForms";
import { BookOpen, FileText, Megaphone, Sparkles, Youtube, MessageCircle, Mail, ExternalLink } from "lucide-react";
import { Announcement, DiaryHomework, PastPaper, SchoolSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TeacherPage() {
  const { sb, profile } = await requireRole(["teacher"]);

  const [announcementsRes, homeworkRes, papersRes, settingsRes] = await Promise.all([
    sb
      .from("announcements")
      .select("*")
      .in("target_audience", ["all", "teachers"])
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false }),
    sb
      .from("diary_homework")
      .select("*")
      .eq("created_by", profile.id)
      .order("created_at", { ascending: false })
      .order("date", { ascending: false }),
    sb
      .from("past_papers")
      .select("*")
      .order("created_at", { ascending: false }),
    sb.from("school_settings").select("*").limit(1).maybeSingle(),
  ]);

  const announcements: Announcement[] = announcementsRes.data ?? [];
  const homeworks: DiaryHomework[] = homeworkRes.data ?? [];
  const papers: PastPaper[] = papersRes.data ?? [];
  const settings: SchoolSettings | null = settingsRes?.data ?? null;

  const whatsappNum = settings?.whatsapp_number || "+92 301 4717700";
  const cleanPhone = (whatsappNum ? whatsappNum.replace(/\D/g, "") : "") || "923014717700";
  const rawYt = settings?.youtube_url || "https://youtube.com/";
  const ytUrl = rawYt.startsWith("http") ? rawYt : `https://${rawYt}`;
  const contactEmail = settings?.contact_email || "zaviaschool2015@gmail.com";

  return (
    <Shell
      title="Teacher & Faculty Portal"
      name={profile.full_name || profile.email}
      role="teacher"
    >
      <div className="space-y-10 max-w-6xl mx-auto pb-16">
        
        {/* Header Banner & Stats */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Faculty Academic Workspace
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Teacher Classroom Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                Post daily homework, upload examination papers, and review official school circulars
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Homework Entries
                </span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{homeworks.length}</p>
              <p className="text-[11px] text-slate-400">Published across class diaries</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Past Papers & Tests
                </span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{papers.length}</p>
              <p className="text-[11px] text-slate-400">Uploaded exam material</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Staff Notices
                </span>
                <Megaphone className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{announcements.length}</p>
              <p className="text-[11px] text-slate-400">Active faculty circulars</p>
            </div>
          </div>
        </div>

        {/* Socials & Official Connect Section */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-base tracking-tight">Connect with School & Official Channels</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Official video lectures, live helpdesk, and administration support</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200/80 transition-all duration-200 shadow-sm active:scale-95"
              >
                <div className="p-1 bg-red-600 text-white rounded-lg group-hover:bg-white group-hover:text-red-600 transition-colors">
                  <Youtube className="w-4 h-4" />
                </div>
                <span>YouTube Channel</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200/80 transition-all duration-200 shadow-sm active:scale-95"
              >
                <div className="p-1 bg-emerald-600 text-white rounded-lg group-hover:bg-white group-hover:text-emerald-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>WhatsApp Official</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>

              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 border border-slate-200 transition-all duration-200 shadow-sm active:scale-95"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>{contactEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Staff Announcements */}
        <section className="space-y-4 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-600" />
              Faculty & Staff Circulars
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {announcements.length} Updates
            </span>
          </div>
          <AnnouncementFeed announcements={announcements} />
        </section>

        {/* Section 1: Daily Homework Management */}
        <section className="space-y-6 pt-6 border-t border-slate-200/80">
          <TeacherHomeworkForm />
          <TeacherHomeworkList homeworks={homeworks} />
        </section>

        {/* Section 2: Past Papers & Tests Management */}
        <section className="space-y-6 pt-6 border-t border-slate-200/80">
          <TeacherPaperForm />
          <TeacherPapersList papers={papers} />
        </section>

      </div>
    </Shell>
  );
}
