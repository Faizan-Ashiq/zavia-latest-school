import { Pin, Download, Paperclip, Trash2, Bell, BookOpen, FileCheck } from "lucide-react";
import { togglePin, deleteAnnouncement, deletePaper } from "@/app/actions";

export function Announcements({ items, manage = false }: { items: any[]; manage?: boolean }) {
  const sorted = [...items].sort((a, b) => Number(b.pinned) - Number(a.pinned) || +new Date(b.created_at) - +new Date(a.created_at));

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Announcements</h2>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
          {sorted.length} {sorted.length === 1 ? 'Notice' : 'Notices'}
        </span>
      </div>

      {!sorted.length && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No Announcements</p>
          <p className="text-xs text-slate-400 mt-1">No announcements posted yet.</p>
        </div>
      )}

      {sorted.map((a) => (
        <article
          key={a.id}
          className={`p-5 rounded-2xl border transition-all duration-200 shadow-sm ${
            a.pinned
              ? "bg-gradient-to-br from-amber-50/90 via-orange-50/30 to-white border-amber-300/80 ring-1 ring-amber-200/50"
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
              <h3 className="text-base font-bold text-slate-900 tracking-tight">{a.title}</h3>
            </div>

            {manage && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <form action={togglePin}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="pinned" value={String(a.pinned)} />
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg transition"
                  >
                    {a.pinned ? "Unpin" : "Pin"}
                  </button>
                </form>
                <form action={deleteAnnouncement}>
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    type="submit"
                    className="p-1.5 text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-lg transition"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{a.content}</p>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>{new Date(a.created_at).toLocaleDateString()}</span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
              For {a.target_audience}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}

export function Diary({ items }: { items: any[] }) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Daily Diary & Homework</h2>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
          {items.length} Entries
        </span>
      </div>

      {!items.length && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No Homework</p>
          <p className="text-xs text-slate-400 mt-1">No homework posted yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((d) => (
          <article key={d.id} className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                  {d.subject}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{d.date}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{d.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Class {d.class_name}</span>
              {d.attachment_url && (
                <a
                  href={d.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Attachment
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Papers({ items, manage = false }: { items: any[]; manage?: boolean }) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Past Papers & Tests</h2>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
          {items.length} Files
        </span>
      </div>

      {!items.length && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No Past Papers</p>
          <p className="text-xs text-slate-400 mt-1">No papers uploaded yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {items.map((p) => (
          <div key={p.id} className="bg-white border border-slate-200/90 p-4.5 rounded-2xl shadow-sm flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{p.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">Class {p.class_name}</p>
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
                Download
              </a>
              {manage && (
                <form action={deletePaper}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="url" value={p.file_url} />
                  <button
                    type="submit"
                    className="p-2 text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-xl transition"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
