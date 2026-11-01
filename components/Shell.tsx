import Link from "next/link";
import { LogOut, ShieldCheck, GraduationCap, BookOpen, User } from "lucide-react";
import { signOut } from "@/app/actions";

interface ShellProps {
  title: string;
  name: string;
  role?: "principal" | "teacher" | "student" | string;
  children: React.ReactNode;
}

export default function Shell({ title, name, role, children }: ShellProps) {
  // Infer role badge style
  const roleDisplay = role || (title.toLowerCase().includes("principal") ? "principal" : title.toLowerCase().includes("teacher") ? "teacher" : "student");
  
  const roleBadgeStyles: Record<string, string> = {
    principal: "bg-purple-100 text-purple-800 border-purple-200",
    teacher: "bg-emerald-100 text-emerald-800 border-emerald-200",
    student: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const roleIcons: Record<string, any> = {
    principal: ShieldCheck,
    teacher: BookOpen,
    student: GraduationCap,
  };

  const RoleIcon = roleIcons[roleDisplay] || User;

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans flex flex-col">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          
          {/* Brand & School Info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <img
                src="/Zavia.jpeg"
                alt="Zavia School Logo"
                className="w-10 h-10 rounded-full border border-slate-200 shadow-sm object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
              />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900">
                  Zavia School System
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border capitalize ${roleBadgeStyles[roleDisplay] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  <RoleIcon className="w-3 h-3" />
                  {roleDisplay}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 truncate max-w-[200px] sm:max-w-md">
                {title} · <span className="text-slate-400">{name}</span>
              </p>
            </div>
          </div>

          {/* Actions: Sign Out */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-red-50 border border-slate-200/80 hover:border-red-200 transition-all duration-150 active:scale-95 shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/80 backdrop-blur-sm py-6 text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-700">Zavia School System</p>
            <p className="text-slate-400 text-[11px] mt-0.5">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-4 text-xs font-medium text-slate-600">
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-600 transition"
            >
              YouTube
            </a>
            <span>•</span>
            <a
              href="https://wa.me/923486868167"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 transition"
            >
              WhatsApp (+92 348 6868167)
            </a>
            <span>•</span>
            <a
              href="mailto:zaviaschool2015@gmail.com"
              className="hover:text-indigo-600 transition"
            >
              zaviaschool2015@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
