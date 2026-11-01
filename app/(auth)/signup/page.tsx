"use client";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { registerProfileSyncAction } from "@/app/actions";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  User,
  BookOpen,
  Award,
  Mail,
  Lock,
  GraduationCap,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  
  const [role, setRole] = useState<"student" | "teacher">(
    roleParam === "teacher" ? "teacher" : "student"
  );
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (roleParam === "teacher" || roleParam === "student") {
      setRole(roleParam);
    }
  }, [roleParam]);

  const isTeacher = role === "teacher";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const full_name = String(formData.get("full_name") ?? "").trim();
    const roll_number = isTeacher ? null : String(formData.get("roll_number") ?? "").trim();
    const class_name = isTeacher ? null : String(formData.get("class_name") ?? "").trim();
    const subject = isTeacher ? String(formData.get("subject") ?? "").trim() : null;

    if (!full_name) {
      setErr("Full Name is required.");
      setBusy(false);
      return;
    }

    if (isTeacher && !subject) {
      setErr("Subject / Specialization is required for teacher registration.");
      setBusy(false);
      return;
    }

    if (!isTeacher && (!class_name || !roll_number)) {
      setErr("Class name and roll number are required for student registration.");
      setBusy(false);
      return;
    }

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            role: role, // 'student' or 'teacher'
            full_name: full_name,
            class_name: class_name || null,
            roll_number: roll_number || null,
            subject: subject || null,
          },
        },
      });

      if (error) {
        setErr(error.message || "Registration error occurred. Please try again.");
        setBusy(false);
        return;
      }

      // Gracefully sync into public.profiles in background
      if (data?.user?.id) {
        try {
          await registerProfileSyncAction({
            userId: data.user.id,
            email: email.trim(),
            role,
            full_name,
            roll_number,
            class_name,
            subject,
          });
        } catch (syncErr: any) {
          console.warn("Background profile sync notice:", syncErr?.message || syncErr);
        }
      }

      // Check if session was returned directly
      if (data?.session) {
        router.push(`/${role}`);
        router.refresh();
        return;
      }

      // Immediate auto-login so user does not need to manually enter credentials
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (!signInErr && signInData?.session) {
        router.push(`/${role}`);
        router.refresh();
        return;
      }

      // If instant login was blocked (e.g. email verification required), redirect to login with registered badge
      router.push(`/login?role=${role}&registered=true`);
    } catch (err: any) {
      console.error("Registration error:", err);
      // Display exact error message (e.g. error.message)
      const exactMsg =
        err?.message ||
        err?.error_description ||
        (typeof err === "string" ? err : "Failed to register account.");

      if (exactMsg.toLowerCase().includes("failed to fetch")) {
        setErr(
          "Network error (Failed to fetch): Supabase host is unreachable or .env.local was updated. Please restart your dev server (Ctrl+C then npm run dev) so the new Supabase credentials take effect."
        );
      } else {
        setErr(exactMsg);
      }
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portal Directory</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <img
                src="/Zavia.jpeg"
                alt="Zavia School System"
                className="w-16 h-16 rounded-full border-2 border-slate-200 shadow-md object-cover mx-auto hover:scale-105 transition-transform"
              />
            </Link>
            <div className="pt-2">
              <span className="text-xs font-bold text-indigo-600 block uppercase tracking-wider">
                Zavia School System
              </span>
              <span
                className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mt-1 border transition-colors ${
                  isTeacher
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {isTeacher ? "Teacher Registration" : "Student Registration"}
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                {isTeacher ? "Create Teacher Account" : "Create Student Account"}
              </h1>
              <p className="text-xs text-slate-500">
                {isTeacher
                  ? "Register your faculty profile to post daily homework & examination tests"
                  : "Register your profile to access class homework & tests"}
              </p>
            </div>
          </div>

          {/* Account Role Switcher */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setRole("student");
                setErr("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                !isTeacher
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${!isTeacher ? "text-indigo-600" : "text-slate-400"}`} />
              <span>Student Account</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("teacher");
                setErr("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                isTeacher
                  ? "bg-white text-emerald-700 shadow-sm border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className={`w-4 h-4 ${isTeacher ? "text-emerald-600" : "text-slate-400"}`} />
              <span>Teacher Account</span>
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder={isTeacher ? "e.g. Sir Asim" : "e.g. Ayaan Khan"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Teacher Specific: Subject / Specialization */}
            {isTeacher && (
              <div className="space-y-1 animate-fadeIn">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Subject / Specialization
                </label>
                <div className="relative">
                  <input
                    name="subject"
                    type="text"
                    required
                    placeholder="e.g. Mathematics, English, Science"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            {/* Student Specific: Class & Roll Number */}
            {!isTeacher && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Class (e.g. 8-A, 10-B)
                  </label>
                  <div className="relative">
                    <input
                      name="class_name"
                      type="text"
                      required={!isTeacher}
                      placeholder="Class Name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Roll Number
                  </label>
                  <div className="relative">
                    <input
                      name="roll_number"
                      type="text"
                      required={!isTeacher}
                      placeholder="Roll No"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={isTeacher ? "teacher@example.com" : "student@example.com"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {err && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{err}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50 ${
                isTeacher
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
              }`}
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>{isTeacher ? "Register Teacher Account" : "Register Student Account"}</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link
              href={isTeacher ? "/login?role=teacher" : "/login?role=student"}
              className={`font-bold hover:underline ${
                isTeacher ? "text-emerald-600" : "text-indigo-600"
              }`}
            >
              Sign In here
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
