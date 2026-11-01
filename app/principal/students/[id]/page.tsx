import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import Shell from "@/components/Shell";
import { Field } from "@/components/Forms";
import StudentDashboard from "@/components/StudentDashboard";
import { updateStudent, deleteStudentAndRedirectAction } from "@/app/actions";
import { ArrowLeft, Trash2, Save } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDetail({ params }: { params: { id: string } }) {
  const { sb } = await requireRole(["principal"]);
  const { data: s } = await sb.from("profiles").select("*").eq("id", params.id).eq("role", "student").single();
  if (!s) notFound();

  const [announcementsRes, homeworkRes, papersRes, settingsRes] = await Promise.all([
    sb
      .from("announcements")
      .select("*")
      .in("target_audience", ["all", "students"])
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false }),
    s.class_name
      ? sb
          .from("diary_homework")
          .select("*")
          .ilike("class_name", s.class_name.trim())
          .order("date", { ascending: false })
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    s.class_name
      ? sb
          .from("past_papers")
          .select("*")
          .ilike("class_name", s.class_name.trim())
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    sb.from("school_settings").select("*").limit(1).maybeSingle(),
  ]);

  return (
    <Shell title="Principal Portal" name={`Viewing ${s.full_name}`} role="principal">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/principal"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Students
          </Link>
        </div>

        {/* Edit Student Details Form */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit Student Record</h2>
              <p className="text-xs text-slate-500">{s.email}</p>
            </div>
            
            <form action={deleteStudentAndRedirectAction} className="self-start sm:self-auto">
              <input type="hidden" name="id" value={s.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 transition active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Student
              </button>
            </form>
          </div>

          <form action={updateStudent} className="grid gap-4 sm:grid-cols-3 pt-2">
            <input type="hidden" name="id" value={s.id} />
            <Field label="Full Name">
              <input name="full_name" defaultValue={s.full_name} required className="input" />
            </Field>
            <Field label="Class">
              <input name="class_name" defaultValue={s.class_name ?? ""} required className="input" />
            </Field>
            <Field label="Roll Number">
              <input name="roll_number" defaultValue={s.roll_number ?? ""} required className="input" />
            </Field>
            <div className="sm:col-span-3 flex justify-end">
              <button type="submit" className="btn inline-flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Live Student Dashboard View */}
        <div className="pt-6 border-t border-slate-200/80">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Dashboard View</h3>
              <p className="text-xs text-slate-400">Previewing this student's view in real-time</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Student View Mode
            </span>
          </div>

          <StudentDashboard
            student={s}
            announcements={announcementsRes.data ?? []}
            homeworks={homeworkRes.data ?? []}
            papers={papersRes.data ?? []}
            settings={settingsRes.data ?? null}
          />
        </div>
      </div>
    </Shell>
  );
}
