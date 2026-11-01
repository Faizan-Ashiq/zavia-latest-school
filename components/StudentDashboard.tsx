import { Profile, Announcement, DiaryHomework, PastPaper, SchoolSettings } from '@/lib/types';
import AnnouncementFeed from './AnnouncementFeed';
import PastPapersList from './PastPapersList';
import { BookOpen, Calendar, Youtube, MessageCircle, Mail, Sparkles, GraduationCap, Award, Paperclip, ExternalLink } from 'lucide-react';

export default function StudentDashboard({
  student,
  announcements = [],
  homeworks = [],
  papers = [],
  settings = null,
}: {
  student: Profile;
  announcements?: Announcement[];
  homeworks?: DiaryHomework[];
  papers?: PastPaper[];
  settings?: SchoolSettings | null;
}) {
  // Format WhatsApp number strictly to digits only for international wa.me links
  const whatsappNum = settings?.whatsapp_number || '+92 301 4717700';
  const cleanPhone = (whatsappNum ? whatsappNum.replace(/\D/g, '') : '') || '923014717700';
  
  // Format YouTube URL to ensure protocol prefix
  const rawYt = settings?.youtube_url || 'https://youtube.com/';
  const ytUrl = rawYt.startsWith('http') ? rawYt : `https://${rawYt}`;

  const contactEmail = settings?.contact_email || 'zaviaschool2015@gmail.com';

  const hasSocials = Boolean(ytUrl || cleanPhone || contactEmail);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Hero Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-blue-100 border border-white/10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Student Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {student.full_name || 'Student'}
            </h1>
            <p className="text-sm font-medium text-blue-200/90">{student.email}</p>
          </div>

          <div className="flex items-center gap-3.5 flex-wrap">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl text-center min-w-[110px] shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs text-blue-200 uppercase font-bold tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
                Class
              </div>
              <div className="text-xl font-black mt-0.5 text-white tracking-tight">
                {student.class_name || 'N/A'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl text-center min-w-[110px] shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs text-blue-200 uppercase font-bold tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                Roll No
              </div>
              <div className="text-xl font-black mt-0.5 text-white tracking-tight">
                {student.roll_number || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Socials & Official Connect Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-slate-800 text-base tracking-tight">Connect with School</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Official video lectures, live helpdesk, and direct support</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {ytUrl && (
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200/80 transition-all duration-200 shadow-sm active:scale-95"
              >
                <div className="p-1 bg-red-600 text-white rounded-lg group-hover:bg-white group-hover:text-red-600 transition-colors">
                  <Youtube className="w-4 h-4" />
                </div>
                <span>YouTube Channel</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>
            )}

            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200/80 transition-all duration-200 shadow-sm active:scale-95"
              >
                <div className="p-1 bg-emerald-600 text-white rounded-lg group-hover:bg-white group-hover:text-emerald-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>WhatsApp Official</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>
            )}

            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 border border-slate-200 transition-all duration-200 shadow-sm active:scale-95"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>{contactEmail}</span>
              </a>
            )}

            {!hasSocials && (
              <p className="text-xs text-slate-400 italic">No official channels configured yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Announcements & Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Announcements (1 Col = 1/3 width) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Announcements
            </h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold border border-indigo-100">
              {announcements.length} {announcements.length === 1 ? 'Update' : 'Updates'}
            </span>
          </div>
          <AnnouncementFeed announcements={announcements} />
        </div>

        {/* Right Column: Diary & Past Papers (2 Cols = 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Daily Diary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Daily Diary & Homework</h3>
                <p className="text-xs text-slate-500">Subject-wise tasks assigned by class teachers</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                Class: {student.class_name || 'N/A'}
              </span>
            </div>

            {homeworks.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-700">No Homework Assigned</p>
                <p className="text-xs text-slate-400 mt-1">There is no pending homework for your class today.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homeworks.map((hw) => (
                  <div
                    key={hw.id}
                    className="bg-white border border-slate-200/90 hover:border-indigo-300 transition-all duration-200 p-5 rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                          <BookOpen className="w-3.5 h-3.5" />
                          {hw.subject}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                          <Calendar className="w-3 h-3" />
                          {hw.date}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
                        {hw.description}
                      </p>
                    </div>

                    {hw.attachment_url && (
                      <div className="pt-2 border-t border-slate-100">
                        <a
                          href={hw.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>View Attached Worksheet / File</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Papers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Past Papers & Tests</h3>
                <p className="text-xs text-slate-500">Download syllabus tests and past examination papers</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                Class: {student.class_name || 'N/A'}
              </span>
            </div>
            <PastPapersList papers={papers} />
          </div>

        </div>
      </div>
    </div>
  );
}