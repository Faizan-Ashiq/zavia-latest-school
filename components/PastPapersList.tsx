import { PastPaper } from '@/lib/types';
import { FileText, Download, FileCheck } from 'lucide-react';

export default function PastPapersList({ papers }: { papers: PastPaper[] }) {
  if (!papers.length) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center text-slate-400 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <FileText className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-700">No Past Papers or Tests</p>
        <p className="text-xs text-slate-400 mt-1">No exam material or past papers have been uploaded for your class yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {papers.map((p) => (
        <div
          key={p.id}
          className="group bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-4.5 rounded-2xl shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {p.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Class {p.class_name}
                </span>
                {p.created_at && (
                  <span className="text-[11px] text-slate-400">
                    {new Date(p.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <a
            href={p.file_url}
            target="_blank"
            rel="noreferrer"
            download
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-600 hover:text-white border border-slate-200/80 transition-all duration-150 active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      ))}
    </div>
  );
}
