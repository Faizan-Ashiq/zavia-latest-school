"use client";
import { useState, useRef, useTransition } from "react";
import Link from "next/link";
import {
  addStudentByPrincipalAction,
  createAnnouncementAction,
  deleteAnnouncementAction,
  togglePinAnnouncementAction,
  uploadPaperAction,
  deletePaperAction,
  deleteStudentAction,
  saveSettingsAction,
  deleteHomeworkAction,
} from "@/app/actions";
import {
  UserPlus,
  Megaphone,
  Upload,
  Settings,
  Trash2,
  Pin,
  ExternalLink,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  Download,
  Calendar,
  Youtube,
  MessageCircle,
  Mail,
  GraduationCap,
  Sparkles,
  BookOpen,
  UserCheck,
  Paperclip,
  Search,
  Filter,
} from "lucide-react";
import { Profile, Announcement, PastPaper, SchoolSettings, DiaryHomework } from "@/lib/types";

// ==========================================
// 1. ADD STUDENT FORM
// ==========================================
export function AddStudentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await addStudentByPrincipalAction(formData);
        formRef.current?.reset();
        setMsg({ type: "success", text: "Student account created successfully and added to roster!" });
      } catch (err: any) {
        setMsg({ type: "error", text: err.message || "Failed to create student account." });
      }
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-xs">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Add New Student</h2>
          <p className="text-xs text-slate-500">Create a student login and enroll them in a class</p>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
          <input
            name="full_name"
            required
            placeholder="e.g. Ayaan Khan"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Class</label>
          <input
            name="class_name"
            required
            placeholder="e.g. 8-A, 10-B"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Roll Number</label>
          <input
            name="roll_number"
            required
            placeholder="e.g. 1042"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
          <input
            name="email"
            type="email"
            required
            placeholder="student@school.com"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Password (min 6 characters)
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="sm:col-span-2 pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Student...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Enroll Student</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 2. NEW ANNOUNCEMENT FORM
// ==========================================
export function NewAnnouncementForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createAnnouncementAction(formData);
        formRef.current?.reset();
        setMsg({ type: "success", text: "Announcement broadcasted successfully!" });
      } catch (err: any) {
        setMsg({ type: "error", text: err.message || "Failed to post announcement." });
      }
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl shadow-xs">
          <Megaphone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Broadcast Announcement</h2>
          <p className="text-xs text-slate-500">Publish notices to students, faculty, or the entire school</p>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Title</label>
          <input
            name="title"
            required
            placeholder="e.g. Mid-Term Examination Schedule Announced"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Notice Content / Message
          </label>
          <textarea
            name="content"
            required
            rows={3}
            placeholder="Enter announcement details, instructions, or guidelines..."
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Audience
              </label>
              <select
                name="target_audience"
                className="input py-2 text-xs w-auto font-medium"
                disabled={isPending}
              >
                <option value="all">Everyone (All School)</option>
                <option value="students">Students Only</option>
                <option value="teachers">Teachers Only</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-4 sm:pt-4">
              <input
                type="checkbox"
                name="pinned"
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                disabled={isPending}
              />
              <span className="flex items-center gap-1">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                Pin to Top
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn px-6 py-2.5 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Megaphone className="w-4 h-4" />
                <span>Publish Notice</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 3. PAST PAPER UPLOAD FORM
// ==========================================
export function UploadPastPaperForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await uploadPaperAction(formData);
        formRef.current?.reset();
        setMsg({ type: "success", text: "Past paper uploaded successfully!" });
      } catch (err: any) {
        setMsg({ type: "error", text: err.message || "Failed to upload past paper." });
      }
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl shadow-xs">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Upload Past Paper or Test</h2>
          <p className="text-xs text-slate-500">Upload syllabus materials or previous exam papers for students</p>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Paper Title / Exam Name
          </label>
          <input
            name="title"
            required
            placeholder="e.g. Mathematics Final Exam 2026"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Target Class
          </label>
          <input
            name="class_name"
            required
            placeholder="e.g. 9-A, 10-B"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            PDF or Document File
          </label>
          <input
            type="file"
            name="file"
            required
            accept=".pdf,image/*,.doc,.docx"
            className="input file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            disabled={isPending}
          />
        </div>

        <div className="sm:col-span-2 pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Paper...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Paper</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 4. CONNECT WITH SCHOOL / SETTINGS FORM
// ==========================================
export function SchoolSettingsForm({ settings }: { settings: SchoolSettings | null }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await saveSettingsAction(formData);
        setMsg({ type: "success", text: "School channels updated and active across all portals!" });
      } catch (err: any) {
        setMsg({ type: "error", text: err.message || "Failed to update school settings." });
      }
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl shadow-xs">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Connect with School / Official Channels</h2>
          <p className="text-xs text-slate-500">Configure YouTube lectures, WhatsApp helpdesk, and official email</p>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Youtube className="w-3.5 h-3.5 text-red-600" />
            YouTube Channel URL
          </label>
          <input
            name="youtube_url"
            defaultValue={settings?.youtube_url ?? "https://youtube.com/"}
            placeholder="https://youtube.com/"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            WhatsApp Official Number
          </label>
          <input
            name="whatsapp_number"
            defaultValue={settings?.whatsapp_number ?? "+92 348 6868167"}
            placeholder="+92 348 6868167"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-600" />
            Official Support Email
          </label>
          <input
            name="contact_email"
            type="email"
            defaultValue={settings?.contact_email ?? "zaviaschool2015@gmail.com"}
            placeholder="zaviaschool2015@gmail.com"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="sm:col-span-3 pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Links...</span>
              </>
            ) : (
              <>
                <Settings className="w-4 h-4" />
                <span>Save School Links</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 5. ENROLLED STUDENTS BY CLASS (ROSTER)
// ==========================================
export function StudentRoster({ students }: { students: Profile[] }) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const byClass = students.reduce<Record<string, Profile[]>>((acc, curr) => {
    const cls = curr.class_name || "Unassigned Class";
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(curr);
    return acc;
  }, {});

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete student "${name}"?`)) return;
    setDeletingId(id);
    const formData = new FormData();
    formData.append("id", id);

    startTransition(async () => {
      try {
        await deleteStudentAction(formData);
      } catch (err: any) {
        alert(err.message || "Failed to delete student.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Enrolled Students Roster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized class-wise with live portal inspection and account management
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold">
          <GraduationCap className="w-4 h-4" />
          <span>{students.length} Students Total</span>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 text-center shadow-sm space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-700">No Students Enrolled</p>
          <p className="text-xs text-slate-400">Use the form above to add your first student to the portal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {Object.entries(byClass)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([className, list]) => (
              <div
                key={className}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Class {className}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {list.length} {list.length === 1 ? "Student" : "Students"}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {list.map((st) => (
                    <div
                      key={st.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/70 px-2 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {st.roll_number ? `#${st.roll_number}` : "?"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {st.full_name}
                          </h4>
                          <p className="text-xs text-slate-400 truncate">{st.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                        <Link
                          href={`/principal/students/${st.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect View</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(st.id, st.full_name)}
                          disabled={isPending && deletingId === st.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 transition active:scale-95 disabled:opacity-50"
                        >
                          {isPending && deletingId === st.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. PRINCIPAL ANNOUNCEMENTS LIST
// ==========================================
export function PrincipalAnnouncementsList({ announcements }: { announcements: Announcement[] }) {
  const [isPending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleTogglePin = (id: string, currentPinned: boolean) => {
    setActiveId(id);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("pinned", String(currentPinned));

    startTransition(async () => {
      try {
        await togglePinAnnouncementAction(formData);
      } catch (err: any) {
        alert(err.message || "Failed to toggle pin.");
      } finally {
        setActiveId(null);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    setActiveId(id);
    const formData = new FormData();
    formData.append("id", id);

    startTransition(async () => {
      try {
        await deleteAnnouncementAction(formData);
      } catch (err: any) {
        alert(err.message || "Failed to delete announcement.");
      } finally {
        setActiveId(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Active Announcements</h3>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
          {sorted.length} Total
        </span>
      </div>

      {!sorted.length && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No Announcements</p>
          <p className="text-xs text-slate-400 mt-1">Publish notices using the form above.</p>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((a) => (
          <div
            key={a.id}
            className={`p-5 rounded-2xl border transition-all duration-200 shadow-sm ${
              a.pinned
                ? "bg-gradient-to-br from-amber-50/80 via-orange-50/30 to-white border-amber-300/80 ring-1 ring-amber-200/50"
                : "bg-white border-slate-200/90"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                {a.pinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold border border-amber-200">
                    <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                    Pinned Notice
                  </span>
                )}
                <h4 className="text-base font-bold text-slate-900 tracking-tight">{a.title}</h4>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleTogglePin(a.id, a.pinned)}
                  disabled={isPending && activeId === a.id}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg transition"
                >
                  {a.pinned ? "Unpin" : "Pin"}
                </button>

                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={isPending && activeId === a.id}
                  className="p-1.5 text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-lg transition"
                  aria-label="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{a.content}</p>

            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(a.created_at).toLocaleDateString()}
              </span>
              <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                For {a.target_audience}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. PRINCIPAL PAPERS LIST
// ==========================================
export function PrincipalPapersList({ papers }: { papers: PastPaper[] }) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string, url: string, title: string) => {
    if (!confirm(`Are you sure you want to delete past paper "${title}"?`)) return;
    setDeletingId(id);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("url", url);

    startTransition(async () => {
      try {
        await deletePaperAction(formData);
      } catch (err: any) {
        alert(err.message || "Failed to delete paper.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Uploaded Papers & Tests</h3>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
          {papers.length} Files
        </span>
      </div>

      {!papers.length && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No Past Papers Uploaded</p>
          <p className="text-xs text-slate-400 mt-1">Upload exam test papers using the form above.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {papers.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200/90 p-4.5 rounded-2xl shadow-sm flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{p.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Class: {p.class_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={p.file_url}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-600 hover:text-white border border-slate-200 transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>

              <button
                onClick={() => handleDelete(p.id, p.file_url, p.title)}
                disabled={isPending && deletingId === p.id}
                className="p-2 text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-xl transition active:scale-95 disabled:opacity-50"
                aria-label="Delete paper"
              >
                {isPending && deletingId === p.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. PRINCIPAL HOMEWORK MONITORING & LIST
// ==========================================
export function PrincipalHomeworkList({
  homeworks,
  teachers = [],
}: {
  homeworks: DiaryHomework[];
  teachers?: { id: string; full_name?: string | null; email?: string }[];
}) {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique classes
  const classes = Array.from(new Set(homeworks.map((h) => h.class_name).filter(Boolean))).sort();

  // Map teacher ID to display name
  const teacherMap = new Map(teachers.map((t) => [t.id, t.full_name || t.email || "Faculty Teacher"]));

  // Filter homeworks
  const filtered = homeworks.filter((hw) => {
    if (selectedClass !== "all" && hw.class_name.toLowerCase() !== selectedClass.toLowerCase()) {
      return false;
    }
    if (selectedTeacher !== "all" && hw.created_by !== selectedTeacher) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = hw.subject?.toLowerCase().includes(q);
      const matchDesc = hw.description?.toLowerCase().includes(q);
      const matchTeacher = hw.created_by && teacherMap.get(hw.created_by)?.toLowerCase().includes(q);
      if (!matchSubject && !matchDesc && !matchTeacher) return false;
    }
    return true;
  });

  const handleDelete = (id: string, url?: string | null, subject?: string) => {
    if (!confirm(`Are you sure you want to delete this homework assignment (${subject || "assignment"}) as Principal?`)) return;
    setDeletingId(id);
    const formData = new FormData();
    formData.append("id", id);
    if (url) formData.append("url", url);

    startTransition(async () => {
      try {
        await deleteHomeworkAction(formData);
      } catch (err: any) {
        alert(err.message || "Failed to delete homework.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                School-Wide Homework & Diary Supervision
              </h3>
              <p className="text-xs text-slate-500">
                Full principal access across all grade levels and teachers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {filtered.length} of {homeworks.length} Assignments
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Class Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Filter by Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input py-2 text-xs"
          >
            <option value="all">All Classes ({classes.length})</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </div>

        {/* Teacher Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Filter by Teacher
          </label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="input py-2 text-xs"
          >
            <option value="all">All Teachers ({teachers.length})</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name || t.email}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Search Subject / Content
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Mathematics, Chapter 3..."
              className="input py-2 pl-8 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Homework Grid */}
      {!filtered.length ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No Homework Matches Found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your class or teacher filters above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((hw) => {
            const authorName = hw.created_by
              ? teacherMap.get(hw.created_by) || "Teacher (" + hw.created_by.slice(0, 6) + ")"
              : "Staff";

            return (
              <div
                key={hw.id}
                className="bg-white border border-slate-200 hover:border-indigo-300 transition p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                        {hw.subject}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        Class: {hw.class_name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                      <Calendar className="w-3 h-3" />
                      {hw.date}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-100/70 px-2.5 py-1 rounded-lg">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Teacher: <strong className="text-slate-800">{authorName}</strong></span>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
                    {hw.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {hw.attachment_url ? (
                    <a
                      href={hw.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:underline"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Attachment</span>
                    </a>
                  ) : (
                    <span className="text-slate-400">No file</span>
                  )}

                  <button
                    onClick={() => handleDelete(hw.id, hw.attachment_url, hw.subject)}
                    disabled={isPending && deletingId === hw.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg transition active:scale-95 disabled:opacity-50"
                  >
                    {isPending && deletingId === hw.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
