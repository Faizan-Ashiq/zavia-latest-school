import { addDiary, uploadPaper } from "@/app/actions";
import { PlusCircle, Upload, BookOpen, FileText } from "lucide-react";

export const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

export function DiaryForm() {
  return (
    <form action={addDiary} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2 flex items-center gap-2 pb-2 border-b border-slate-100">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
          <BookOpen className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Post Daily Homework</h2>
      </div>

      <Field label="Class">
        <input name="class_name" required placeholder="e.g. 8-A, 10-B" className="input" />
      </Field>

      <Field label="Subject">
        <input name="subject" required placeholder="e.g. Mathematics" className="input" />
      </Field>

      <Field label="Date">
        <input type="date" name="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="input" />
      </Field>

      <Field label="Attachment File (optional)">
        <input type="file" name="file" className="input file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Homework Description">
          <textarea name="description" required rows={3} placeholder="Enter homework instructions, pages, and exercises..." className="input" />
        </Field>
      </div>

      <button type="submit" className="btn sm:col-span-2 flex items-center justify-center gap-2">
        <PlusCircle className="w-4 h-4" />
        Publish Homework to Class
      </button>
    </form>
  );
}

export function PaperForm() {
  return (
    <form action={uploadPaper} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2 flex items-center gap-2 pb-2 border-b border-slate-100">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
          <FileText className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Upload Past Paper or Test</h2>
      </div>

      <Field label="Title / Exam Name">
        <input name="title" required placeholder="e.g. Mid-term Exam 2026" className="input" />
      </Field>

      <Field label="Target Class">
        <input name="class_name" required placeholder="e.g. 9-A" className="input" />
      </Field>

      <div className="sm:col-span-2">
        <Field label="PDF or Image File">
          <input type="file" name="file" required accept=".pdf,image/*" className="input file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
        </Field>
      </div>

      <button type="submit" className="btn sm:col-span-2 flex items-center justify-center gap-2">
        <Upload className="w-4 h-4" />
        Upload Past Paper
      </button>
    </form>
  );
}
