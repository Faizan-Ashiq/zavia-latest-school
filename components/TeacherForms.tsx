"use client";
import { useState, useRef, useTransition } from "react";
import {
  createHomeworkAction,
  deleteHomeworkAction,
  uploadPastPaperAction,
  deletePaperAction,
} from "@/app/actions";
import {
  BookOpen,
  PlusCircle,
  Upload,
  Paperclip,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Download,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { DiaryHomework, PastPaper } from "@/lib/types";

// ==========================================
// 1. TEACHER HOMEWORK FORM
// ==========================================
export function TeacherHomeworkForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createHomeworkAction(formData);
        formRef.current?.reset();
        setMsg({ type: "success", text: "Daily homework published to student portals!" });
      } catch (err: any) {
        setMsg({ type: "error", text: err.message || "Failed to publish homework." });
      }
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl shadow-xs">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Publish Daily Homework</h2>
          <p className="text-xs text-slate-500">Assign subject homework, instructions, and worksheets</p>
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
            Target Class
          </label>
          <input
            name="class_name"
            required
            placeholder="e.g. 8-A, 10-B"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Subject
          </label>
          <input
            name="subject"
            required
            placeholder="e.g. Mathematics, Science"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Submission / Diary Date
          </label>
          <input
            type="date"
            name="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Attachment File (Optional)
          </label>
          <input
            type="file"
            name="file"
            className="input file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            disabled={isPending}
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Homework Instructions & Details
          </label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Enter questions, exercise pages, and reading instructions for students..."
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="sm:col-span-2 pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500 shadow-emerald-600/20"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Homework...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Homework</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// 2. TEACHER PAST PAPER FORM
// ==========================================
export function TeacherPaperForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await uploadPastPaperAction(formData);
        formRef.current?.reset();
        setMsg({ type: "success", text: "Past paper uploaded successfully!" });
      } catch (err: any) {
        setMsg({ type: "error", text: err.message || "Failed to upload test paper." });
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
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Upload Exam / Past Paper</h2>
          <p className="text-xs text-slate-500">Provide downloadable revision tests or past examination papers</p>
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
            Exam / Paper Title
          </label>
          <input
            name="title"
            required
            placeholder="e.g. Science Class 9 Monthly Test"
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

        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Document or PDF File
          </label>
          <input
            type="file"
            name="file"
            required
            accept=".pdf,image/*,.doc,.docx"
            className="input file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isPending}
          />
        </div>

        <div className="sm:col-span-2 pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500 shadow-blue-600/20"
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
// 3. TEACHER HOMEWORK FEED (WITH DELETE)
// ==========================================
export function TeacherHomeworkList({ homeworks }: { homeworks: DiaryHomework[] }) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string, url?: string | null) => {
    if (!confirm("Are you sure you want to delete this homework entry?")) return;
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Your Uploaded Homework</h3>
          <p className="text-xs text-slate-500">Live diary entries assigned by your teacher account</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {homeworks.length} {homeworks.length === 1 ? "Assignment" : "Assignments"}
        </span>
      </div>

      {!homeworks.length ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 text-center shadow-sm space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No Homework Posted by You Yet</p>
          <p className="text-xs text-slate-400">Use the form above to assign homework to your designated class.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {homeworks.map((hw) => (
            <div
              key={hw.id}
              className="bg-white border border-slate-200/90 hover:border-emerald-300 transition-all duration-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-100">
                      <BookOpen className="w-3.5 h-3.5" />
                      {hw.subject}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      Class: {hw.class_name}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                    <Calendar className="w-3 h-3" />
                    {hw.date}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {hw.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {hw.attachment_url ? (
                  <a
                    href={hw.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attached File</span>
                  </a>
                ) : (
                  <span className="text-slate-400">No file attached</span>
                )}

                <button
                  onClick={() => handleDelete(hw.id, hw.attachment_url)}
                  disabled={isPending && deletingId === hw.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg transition active:scale-95 disabled:opacity-50"
                  aria-label="Delete homework"
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
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. TEACHER PAPERS FEED (WITH DELETE)
// ==========================================
export function TeacherPapersList({ papers }: { papers: PastPaper[] }) {
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
        alert(err.message || "Failed to delete past paper.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Uploaded Past Papers & Tests</h3>
          <p className="text-xs text-slate-500">Repository of study and exam files</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {papers.length} {papers.length === 1 ? "File" : "Files"}
        </span>
      </div>

      {!papers.length ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 text-center shadow-sm space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
            <FileCheck className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No Past Papers Uploaded</p>
          <p className="text-xs text-slate-400">Upload past papers and test materials above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {papers.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200/90 hover:border-blue-300 transition-all duration-200 p-4.5 rounded-2xl shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{p.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Class: {p.class_name}
                    </span>
                    {p.created_at && (
                      <span className="text-[11px] text-slate-400">
                        • {new Date(p.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={p.file_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white border border-slate-200 transition active:scale-95"
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
      )}
    </div>
  );
}
