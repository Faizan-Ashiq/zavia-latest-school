"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { School, ArrowLeft, Lock, Mail, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? "student";
  const registered = searchParams.get("registered") === "true";
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    const sb = createClient();
    const { data, error } = await sb.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErr("Invalid email or password. Please try again.");
      setBusy(false);
      return;
    }

    const { data: p } = await sb
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    const actualRole = (p?.role || data.user.user_metadata?.role || "student").toString().toLowerCase();
    const expectedRole = role.toLowerCase();

    if (actualRole !== expectedRole) {
      await sb.auth.signOut();
      setErr(`Access Denied: This account is registered as a ${p?.role || data.user.user_metadata?.role || "different"} account, not ${role}.`);
      setBusy(false);
      return;
    }

    router.push(`/${role}`);
    router.refresh();
  }

  const roleTitles: Record<string, string> = {
    student: "Student Portal Login",
    teacher: "Teacher & Staff Login",
    principal: "Principal Administration",
  };

  const roleBadges: Record<string, string> = {
    student: "bg-blue-50 text-blue-700 border-blue-200",
    teacher: "bg-emerald-50 text-emerald-700 border-emerald-200",
    principal: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
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
              <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border mt-1 ${roleBadges[role] || 'bg-slate-100 text-slate-700'}`}>
                {role}
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                {roleTitles[role] || "Portal Login"}
              </h1>
              <p className="text-xs text-slate-500">Enter your official credentials to continue</p>
            </div>
          </div>

          {registered && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Account registered successfully! Please sign in with your credentials.
              </span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@school.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {role === "teacher" ? "Password / PIN" : "Password"}
                </label>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to {role.charAt(0).toUpperCase() + role.slice(1)}</span>
              )}
            </button>
          </form>

          {role === "student" && (
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              New student?{" "}
              <Link href="/signup?role=student" className="font-bold text-indigo-600 hover:underline">
                Register an account
              </Link>
            </div>
          )}

          {role === "teacher" && (
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Need an account?{" "}
              <Link href="/signup?role=teacher" className="font-bold text-emerald-600 hover:underline">
                Register as Teacher
              </Link>
            </div>
          )}

          {/* Quick Switch role */}
          <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-3">
            <span>Switch Portal:</span>
            {role !== "student" && (
              <Link href="/login?role=student" className="hover:text-indigo-600 transition underline">
                Student
              </Link>
            )}
            {role !== "teacher" && (
              <Link href="/login?role=teacher" className="hover:text-indigo-600 transition underline">
                Teacher
              </Link>
            )}
            {role !== "principal" && (
              <Link href="/login?role=principal" className="hover:text-indigo-600 transition underline">
                Principal
              </Link>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
