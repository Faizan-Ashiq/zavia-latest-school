import { Announcement } from '@/lib/types';
import { Pin, Bell, Calendar, Sparkles } from 'lucide-react';

export default function AnnouncementFeed({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (!sorted.length) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Bell className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-700">No Announcements</p>
        <p className="text-xs text-slate-400 mt-1">There are no school announcements at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {sorted.map((a) => (
        <article
          key={a.id}
          className={`relative p-5 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
            a.pinned
              ? 'bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border-amber-300/80 ring-1 ring-amber-200/50'
              : 'bg-white border-slate-200/90 hover:border-indigo-200'
          }`}
        >
          {a.pinned && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold border border-amber-200">
                <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                Pinned Notice
              </span>
            </div>
          )}

          <h4 className="text-base font-bold text-slate-900 leading-snug tracking-tight">
            {a.title}
          </h4>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {a.content}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(a.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
              {a.target_audience === 'all' ? 'Everyone' : a.target_audience}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
