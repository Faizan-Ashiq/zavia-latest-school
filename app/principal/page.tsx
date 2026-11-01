import { requireRole } from "@/lib/auth";
import Shell from "@/components/Shell";
import {
  AddStudentForm,
  NewAnnouncementForm,
  UploadPastPaperForm,
  SchoolSettingsForm,
  StudentRoster,
  PrincipalAnnouncementsList,
  PrincipalPapersList,
  PrincipalHomeworkList,
} from "@/components/PrincipalForms";
import { Users, Megaphone, FileText, School, Sparkles, GraduationCap, BookOpen } from "lucide-react";
import { Profile, Announcement, PastPaper, SchoolSettings, DiaryHomework } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PrincipalPage() {
  const { sb, profile } = await requireRole(["principal"]);

  const [studentsRes, announcementsRes, papersRes, settingsRes, homeworkRes, teachersRes] = await Promise.all([
    sb.from("profiles").select("*").eq("role", "student").order("roll_number"),
    sb.from("announcements").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false }),
    sb.from("past_papers").select("*").order("created_at", { ascending: false }),
    sb.from("school_settings").select("*").limit(1).maybeSingle(),
    sb.from("diary_homework").select("*").order("date", { ascending: false }),
    sb.from("profiles").select("id, full_name, email").eq("role", "teacher"),
  ]);

  const students: Profile[] = studentsRes.data ?? [];
  const announcements: Announcement[] = announcementsRes.data ?? [];
  const papers: PastPaper[] = papersRes.data ?? [];
  const settings: SchoolSettings | null = settingsRes.data ?? null;
  const homeworks: DiaryHomework[] = homeworkRes.data ?? [];
  const teachers = teachersRes.data ?? [];

  // Extract unique classes
  const uniqueClasses = Array.from(new Set(students.map((s) => s.class_name).filter(Boolean)));

  return (
    <Shell
      title="Principal Administration Portal"
      name={profile.full_name || profile.email}
      role="principal"
    >
      <div className="space-y-10 max-w-6xl mx-auto pb-16">
        
        {/* Top Header Banner & Stats */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Administrative Command Center
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                School Dashboard & Control
              </h1>
              <p className="text-sm text-slate-500">
                Manage student records, school-wide notices, exam syllabus, and contact links
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Students</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{students.length}</p>
              <p className="text-[11px] text-slate-400">Enrolled students</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Classes</span>
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{uniqueClasses.length}</p>
              <p className="text-[11px] text-slate-400">Configured grades</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Homework</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{homeworks.length}</p>
              <p className="text-[11px] text-slate-400">Active assignments</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notices</span>
                <Megaphone className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{announcements.length}</p>
              <p className="text-[11px] text-slate-400">Circulars broadcasted</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Past Papers</span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{papers.length}</p>
              <p className="text-[11px] text-slate-400">Exams & syllabus files</p>
            </div>
          </div>
        </div>

        {/* Section 1: Student Management (Add Student + Roster) */}
        <section className="space-y-6 pt-4 border-t border-slate-200/80">
          <AddStudentForm />
          <StudentRoster students={students} />
        </section>

        {/* Section 2: Announcements (Broadcast + Manage) */}
        <section className="space-y-6 pt-6 border-t border-slate-200/80">
          <NewAnnouncementForm />
          <PrincipalAnnouncementsList announcements={announcements} />
        </section>

        {/* Section 3: Past Papers & Tests */}
        <section className="space-y-6 pt-6 border-t border-slate-200/80">
          <UploadPastPaperForm />
          <PrincipalPapersList papers={papers} />
        </section>

        {/* Section 4: Homework Supervision Across All Classes & Teachers */}
        <section className="space-y-6 pt-6 border-t border-slate-200/80">
          <PrincipalHomeworkList homeworks={homeworks} teachers={teachers} />
        </section>

        {/* Section 5: Connect with School Settings */}
        <section className="space-y-6 pt-6 border-t border-slate-200/80">
          <SchoolSettingsForm settings={settings} />
        </section>

      </div>
    </Shell>
  );
}
