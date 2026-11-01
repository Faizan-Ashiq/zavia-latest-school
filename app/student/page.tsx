import { requireRole } from "@/lib/auth";
import Shell from "@/components/Shell";
import StudentDashboard from "@/components/StudentDashboard";

export const dynamic = "force-dynamic";

export default async function StudentPage() {
  const { sb, profile } = await requireRole(["student"]);

  const studentClass = profile.class_name?.trim();

  const [announcementsRes, homeworkRes, papersRes, settingsRes] = await Promise.all([
    sb
      .from("announcements")
      .select("*")
      .in("target_audience", ["all", "students"])
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false }),
    studentClass
      ? sb
          .from("diary_homework")
          .select("*")
          .ilike("class_name", studentClass)
          .order("date", { ascending: false })
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    studentClass
      ? sb
          .from("past_papers")
          .select("*")
          .ilike("class_name", studentClass)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    sb.from("school_settings").select("*").limit(1).maybeSingle(),
  ]);

  return (
    <Shell title="Student Portal" name={profile.full_name || profile.email} role="student">
      <StudentDashboard
        student={profile}
        announcements={announcementsRes.data ?? []}
        homeworks={homeworkRes.data ?? []}
        papers={papersRes.data ?? []}
        settings={settingsRes.data ?? null}
      />
    </Shell>
  );
}
