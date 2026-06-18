import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { SOC_CODES, SOCEntry, getMajorGroup } from './socCodes';
import {
  LogOut, Users, CheckCircle2, Clock, XCircle, Search, ChevronDown, Eye, X,
  ArrowLeft, Download, Filter, RefreshCw, FileText, Phone, Mail, MapPin,
  Briefcase, GraduationCap, Calendar, Zap, Target, AlertCircle, Loader2,
  Shield, TrendingUp, UserCheck, Plus, Trash2, LayoutDashboard, Settings,
  Building2, Edit2, Save, Tag, ChevronRight,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props { onBack: () => void; }

type AppStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'interviewing';
type Tab = 'overview' | 'candidates' | 'vacancies' | 'settings';
type VacancyStatus = 'open' | 'closed' | 'on_hold';

interface Application {
  id: string; created_at: string; full_name: string; age: number; email: string;
  phone: string; address: string; city: string; state: string; zip: string;
  emergency_contact_name: string; emergency_contact_phone: string; emergency_contact_relation: string;
  employment_status: string; last_employer: string | null; last_job_title: string | null;
  years_experience: number | null; industries: string[]; highest_education: string;
  institution: string | null; field_of_study: string | null; certifications: string | null;
  technical_skills: string[]; soft_skills: string[]; languages: string[];
  other_skills: string | null; desired_job_type: string; desired_industry: string;
  desired_location: string; available_start_date: string; hours_per_week: string;
  willing_to_travel: boolean; cv_file_url: string | null; cv_file_name: string | null;
  consent_data_use: boolean; consent_communication: boolean; status: AppStatus;
  desired_soc_code: string | null; desired_soc_title: string | null;
}

interface Vacancy {
  id: string; created_at: string; title: string; department: string; location: string;
  type: string; status: VacancyStatus; description: string | null; requirements: string | null;
  salary_min: number | null; salary_max: number | null; deadline: string | null; positions: number;
  soc_code: string | null; soc_title: string | null;
}


// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:      { label: 'Pending',      color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  icon: <Clock className="w-3.5 h-3.5" /> },
  reviewing:    { label: 'Reviewing',    color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    icon: <Eye className="w-3.5 h-3.5" /> },
  interviewing: { label: 'Interviewing', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',icon: <UserCheck className="w-3.5 h-3.5" /> },
  approved:     { label: 'Approved',     color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected:     { label: 'Rejected',     color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      icon: <XCircle className="w-3.5 h-3.5" /> },
};

const VACANCY_STATUS_CONFIG: Record<VacancyStatus, { label: string; color: string; bg: string }> = {
  open:    { label: 'Open',    color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  closed:  { label: 'Closed',  color: 'text-gray-600',  bg: 'bg-gray-50 border-gray-200' },
  on_hold: { label: 'On Hold', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
};

// ── Shared UI ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AppStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function VacancyBadge({ status }: { status: VacancyStatus }) {
  const cfg = VACANCY_STATUS_CONFIG[status] ?? VACANCY_STATUS_CONFIG.open;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white";
const labelCls = "block text-xs font-medium text-gray-600 mb-1";

// ── SOC Selector ──────────────────────────────────────────────────────────────
function SOCSelector({ value, onChange, placeholder }: {
  value: { code: string; title: string } | null;
  onChange: (v: { code: string; title: string } | null) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SOC_CODES.filter(c => c.level === 'major');
    return SOC_CODES.filter(c =>
      c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    ).slice(0, 25);
  }, [query]);

  const select = (entry: SOCEntry) => {
    onChange({ code: entry.code, title: entry.title });
    setQuery('');
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      {value ? (
        <div className="flex items-center gap-2 px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg">
          <Tag className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-blue-700 mr-1.5">{value.code}</span>
            <span className="text-xs text-blue-600 truncate">{value.title}</span>
          </div>
          <button type="button" onClick={clear}
            className="flex-shrink-0 text-blue-400 hover:text-blue-700 transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? 'Search SOC code or title…'}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
      )}

      {open && !value && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-400">No matching SOC codes</div>
          ) : (
            <>
              {!query.trim() && (
                <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  Major Groups
                </div>
              )}
              {filtered.map(entry => (
                <button key={entry.code} type="button" onClick={() => select(entry)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-blue-50 transition text-left">
                  <span className={`text-xs font-bold tabular-nums flex-shrink-0 mt-0.5 ${
                    entry.level === 'major' ? 'text-blue-600' : 'text-gray-500'
                  }`}>{entry.code}</span>
                  <span className="text-xs text-gray-700 leading-tight">{entry.title}</span>
                  {entry.level === 'major' && <ChevronRight className="w-3 h-3 text-gray-300 ml-auto flex-shrink-0 mt-0.5" />}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Charts ────────────────────────────────────────────────────────────────────
function PipelineChart({ apps }: { apps: Application[] }) {
  const stages: { label: string; status: AppStatus; color: string }[] = [
    { label: 'Pending',      status: 'pending',      color: 'bg-amber-400' },
    { label: 'Reviewing',    status: 'reviewing',    color: 'bg-blue-400' },
    { label: 'Interviewing', status: 'interviewing', color: 'bg-purple-400' },
    { label: 'Approved',     status: 'approved',     color: 'bg-green-400' },
    { label: 'Rejected',     status: 'rejected',     color: 'bg-red-400' },
  ];
  const max = Math.max(...stages.map(s => apps.filter(a => a.status === s.status).length), 1);
  return (
    <div className="space-y-3">
      {stages.map(s => {
        const count = apps.filter(a => a.status === s.status).length;
        const pct = Math.round((count / max) * 100);
        return (
          <div key={s.status} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-24 flex-shrink-0">{s.label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
              <div
                className={`h-full ${s.color} rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
              >
                {count > 0 && <span className="text-xs font-bold text-white">{count}</span>}
              </div>
            </div>
            {count === 0 && <span className="text-xs text-gray-400 w-4">0</span>}
          </div>
        );
      })}
    </div>
  );
}

function MonthlyChart({ apps }: { apps: Application[] }) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { label: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear(), month: d.getMonth() };
  });
  const counts = months.map(m =>
    apps.filter(a => {
      const d = new Date(a.created_at);
      return d.getMonth() === m.month && d.getFullYear() === m.year;
    }).length
  );
  const max = Math.max(...counts, 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {months.map((m, i) => (
        <div key={m.label + m.year} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-gray-700">{counts[i] > 0 ? counts[i] : ''}</span>
          <div className="w-full bg-gray-100 rounded-t-md overflow-hidden" style={{ height: '80px' }}>
            <div
              className="w-full bg-blue-400 rounded-t-md transition-all duration-500"
              style={{ height: `${Math.max((counts[i] / max) * 100, counts[i] > 0 ? 8 : 0)}%`, marginTop: 'auto' }}
            />
          </div>
          <span className="text-xs text-gray-400">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ pct, label, color = '#3b82f6' }: { pct: number; label: string; color?: string }) {
  const r = 36; const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
          strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s' }} />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="700" fill="#111827">
          {pct}%
        </text>
      </svg>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState('admin@korixllc.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) throw authErr;
      if (data.user) onLogin(data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Recruitment Manager</h1>
          <p className="text-white/50 text-sm mt-1">KORIX LLC — Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          <div>
            <label className={labelCls}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" required />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Application Detail Modal ──────────────────────────────────────────────────
function AppDetailModal({ app, onClose, onStatusChange }: {
  app: Application; onClose: () => void;
  onStatusChange: (id: string, status: AppStatus) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const changeStatus = async (status: AppStatus) => {
    setUpdating(true); await onStatusChange(app.id, status); setUpdating(false);
  };

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="text-blue-600">{icon}</div>
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 flex-shrink-0 w-40">{label}</span>
      <span className="text-sm text-gray-900 font-medium text-right">{value || '—'}</span>
    </div>
  );

  const Tags = ({ items }: { items: string[] }) =>
    items.length ? (
      <div className="flex flex-wrap gap-1.5">
        {items.map(t => <span key={t} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">{t}</span>)}
      </div>
    ) : <span className="text-sm text-gray-400">None listed</span>;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-end">
      <div className="w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold">{app.full_name}</h2>
            <p className="text-white/60 text-sm">{app.email} &bull; Applied {new Date(app.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">Status:</span>
          <StatusBadge status={app.status} />
          <div className="flex gap-2 ml-auto flex-wrap">
            {(Object.keys(STATUS_CONFIG) as AppStatus[]).filter(s => s !== app.status).map(s => (
              <button key={s} onClick={() => changeStatus(s)} disabled={updating}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition disabled:opacity-50 ${STATUS_CONFIG[s].color} ${STATUS_CONFIG[s].bg} hover:opacity-80`}>
                {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : STATUS_CONFIG[s].icon}
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Section title="Personal Details" icon={<Users className="w-4 h-4" />}>
            <div className="bg-gray-50 rounded-xl p-4">
              <Row label="Age" value={`${app.age} years old`} />
              <Row label="Phone" value={<a href={`tel:${app.phone}`} className="text-blue-600 hover:underline">{app.phone}</a>} />
              <Row label="Address" value={`${app.address}, ${app.city}, ${app.state} ${app.zip}`} />
              <Row label="Emergency Contact" value={`${app.emergency_contact_name} (${app.emergency_contact_relation}) — ${app.emergency_contact_phone}`} />
            </div>
          </Section>
          <Section title="Work History" icon={<Briefcase className="w-4 h-4" />}>
            <div className="bg-gray-50 rounded-xl p-4">
              <Row label="Employment Status" value={app.employment_status} />
              <Row label="Last Employer" value={app.last_employer} />
              <Row label="Last Job Title" value={app.last_job_title} />
              <Row label="Years Experience" value={app.years_experience !== null ? `${app.years_experience}` : null} />
              <div className="py-2"><span className="text-xs text-gray-500 block mb-2">Industries</span><Tags items={app.industries ?? []} /></div>
            </div>
          </Section>
          <Section title="Education" icon={<GraduationCap className="w-4 h-4" />}>
            <div className="bg-gray-50 rounded-xl p-4">
              <Row label="Highest Level" value={app.highest_education} />
              <Row label="Institution" value={app.institution} />
              <Row label="Field of Study" value={app.field_of_study} />
              <Row label="Certifications" value={app.certifications} />
            </div>
          </Section>
          <Section title="Skills" icon={<Zap className="w-4 h-4" />}>
            <div className="space-y-3">
              <div><p className="text-xs text-gray-500 mb-1.5">Technical Skills</p><Tags items={app.technical_skills ?? []} /></div>
              <div><p className="text-xs text-gray-500 mb-1.5">Soft Skills</p><Tags items={app.soft_skills ?? []} /></div>
              <div><p className="text-xs text-gray-500 mb-1.5">Languages</p><Tags items={app.languages ?? []} /></div>
              {app.other_skills && <div><p className="text-xs text-gray-500 mb-1.5">Other</p><p className="text-sm text-gray-800">{app.other_skills}</p></div>}
            </div>
          </Section>
          <Section title="Career Goals & Availability" icon={<Target className="w-4 h-4" />}>
            <div className="bg-gray-50 rounded-xl p-4">
              <Row label="Job Type" value={app.desired_job_type} />
              <Row label="Desired Industry" value={app.desired_industry} />
              <Row label="Preferred Location" value={app.desired_location} />
              <Row label="Available From" value={app.available_start_date ? new Date(app.available_start_date).toLocaleDateString() : null} />
              <Row label="Hours / Week" value={app.hours_per_week} />
              <Row label="Willing to Travel" value={app.willing_to_travel ? 'Yes' : 'No'} />
              {app.desired_soc_code && (
                <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500 flex-shrink-0 w-40">SOC Classification</span>
                  <span className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {app.desired_soc_code}
                    </span>
                    {app.desired_soc_title && <span className="block text-xs text-gray-500 mt-0.5">{app.desired_soc_title}</span>}
                  </span>
                </div>
              )}
            </div>
          </Section>
          {app.cv_file_url && (
            <Section title="CV / Resume" icon={<FileText className="w-4 h-4" />}>
              <a href={app.cv_file_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition group">
                <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-800">{app.cv_file_name ?? 'View CV'}</p>
                  <p className="text-xs text-blue-500">Click to open in new tab</p>
                </div>
                <Download className="w-4 h-4 text-blue-600 group-hover:text-blue-800 transition" />
              </a>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Vacancy Form Modal ────────────────────────────────────────────────────────
type VacancyForm = Omit<Vacancy, 'id' | 'created_at'>;
const emptyVacancy: VacancyForm = {
  title: '', department: '', location: '', type: 'Full-time', status: 'open',
  description: '', requirements: '', salary_min: null, salary_max: null,
  deadline: null, positions: 1, soc_code: null, soc_title: null,
};

function VacancyModal({ vacancy, onClose, onSave }: {
  vacancy: Vacancy | null; onClose: () => void;
  onSave: (v: VacancyForm) => Promise<void>;
}) {
  const [form, setForm] = useState<VacancyForm>(vacancy ? {
    title: vacancy.title, department: vacancy.department, location: vacancy.location,
    type: vacancy.type, status: vacancy.status, description: vacancy.description ?? '',
    requirements: vacancy.requirements ?? '', salary_min: vacancy.salary_min,
    salary_max: vacancy.salary_max, deadline: vacancy.deadline, positions: vacancy.positions,
    soc_code: vacancy.soc_code, soc_title: vacancy.soc_title,
  } : emptyVacancy);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof VacancyForm, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await onSave(form); setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-base">{vacancy ? 'Edit Vacancy' : 'New Vacancy'}</h2>
          <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white transition"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Job Title *</label>
              <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. Sales Representative" />
            </div>
            <div>
              <label className={labelCls}>Department *</label>
              <input className={inputCls} value={form.department} onChange={e => set('department', e.target.value)} required placeholder="e.g. Sales" />
            </div>
            <div>
              <label className={labelCls}>Location *</label>
              <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} required placeholder="e.g. New York, NY" />
            </div>
            <div>
              <label className={labelCls}>Employment Type</label>
              <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
                {['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value as VacancyStatus)}>
                <option value="open">Open</option>
                <option value="on_hold">On Hold</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Open Positions</label>
              <input type="number" min={1} className={inputCls} value={form.positions}
                onChange={e => set('positions', parseInt(e.target.value) || 1)} />
            </div>
            <div>
              <label className={labelCls}>Application Deadline</label>
              <input type="date" className={inputCls} value={form.deadline ?? ''}
                onChange={e => set('deadline', e.target.value || null)} />
            </div>
            <div>
              <label className={labelCls}>Salary Min ($/yr)</label>
              <input type="number" className={inputCls} value={form.salary_min ?? ''}
                onChange={e => set('salary_min', e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 40000" />
            </div>
            <div>
              <label className={labelCls}>Salary Max ($/yr)</label>
              <input type="number" className={inputCls} value={form.salary_max ?? ''}
                onChange={e => set('salary_max', e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 60000" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>SOC Classification (2018)</label>
              <SOCSelector
                value={form.soc_code ? { code: form.soc_code, title: form.soc_title ?? '' } : null}
                onChange={v => { set('soc_code', v?.code ?? null); set('soc_title', v?.title ?? null); }}
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Job Description</label>
              <textarea className={inputCls + ' resize-none'} rows={3} value={form.description ?? ''}
                onChange={e => set('description', e.target.value)} placeholder="Describe the role..." />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Requirements</label>
              <textarea className={inputCls + ' resize-none'} rows={3} value={form.requirements ?? ''}
                onChange={e => set('requirements', e.target.value)} placeholder="List key requirements..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Vacancy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

const SOC_PALETTE: Record<string, string> = {
  '11': '#475569', '13': '#2563eb', '15': '#0891b2', '17': '#7c3aed',
  '19': '#059669', '21': '#dc2626', '23': '#d97706', '25': '#4f46e5',
  '27': '#db2777', '29': '#16a34a', '31': '#0d9488', '33': '#ea580c',
  '35': '#ca8a04', '37': '#65a30d', '39': '#9333ea', '41': '#0284c7',
  '43': '#1d4ed8', '45': '#15803d', '47': '#57534e', '49': '#b91c1c',
  '51': '#c2410c', '53': '#4338ca', '55': '#71717a',
};

function getSOCColor(code: string): string {
  const prefix = code.slice(0, 2);
  return SOC_PALETTE[prefix] ?? '#94a3b8';
}

interface SOCGroupData {
  majorCode: string;
  majorTitle: string;
  color: string;
  vacancies: number;
  candidates: number;
  total: number;
}

function SOCCategorizationChart({ vacancies, apps }: { vacancies: Vacancy[]; apps: Application[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groupMap: Record<string, SOCGroupData> = {};
  vacancies.forEach(v => {
    if (!v.soc_code) return;
    const major = getMajorGroup(v.soc_code);
    if (!major) return;
    const k = major.code;
    if (!groupMap[k]) groupMap[k] = { majorCode: k, majorTitle: major.title, color: getSOCColor(k), vacancies: 0, candidates: 0, total: 0 };
    groupMap[k].vacancies += 1;
    groupMap[k].total += 1;
  });
  apps.forEach(a => {
    if (!a.desired_soc_code) return;
    const major = getMajorGroup(a.desired_soc_code);
    if (!major) return;
    const k = major.code;
    if (!groupMap[k]) groupMap[k] = { majorCode: k, majorTitle: major.title, color: getSOCColor(k), vacancies: 0, candidates: 0, total: 0 };
    groupMap[k].candidates += 1;
    groupMap[k].total += 1;
  });

  const groups = Object.values(groupMap).sort((a, b) => b.total - a.total);
  const grandTotal = groups.reduce((s, g) => s + g.total, 0);
  const vacanciesCategorized = vacancies.filter(v => v.soc_code).length;
  const candidatesCategorized = apps.filter(a => a.desired_soc_code).length;

  // Aligned groups (appear in both vacancies and candidates)
  const aligned = groups.filter(g => g.vacancies > 0 && g.candidates > 0);
  const matchRate = groups.length > 0
    ? Math.round((aligned.length / groups.length) * 100)
    : 0;

  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Tag className="w-7 h-7 text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-1">No SOC Classifications Yet</p>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Assign SOC codes to vacancies and candidate profiles to see detailed occupational breakdowns here.
        </p>
      </div>
    );
  }

  const active = activeGroup ? groupMap[activeGroup] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-gray-900">Job Categorization — SOC 2018</h3>
            </div>
            <p className="text-xs text-gray-400">Standard Occupational Classification · Major Group distribution</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{groups.length}</p>
              <p className="text-xs text-gray-400">SOC groups</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{vacanciesCategorized}</p>
              <p className="text-xs text-gray-400">vacancies classified</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{candidatesCategorized}</p>
              <p className="text-xs text-gray-400">candidates classified</p>
            </div>
            {aligned.length > 0 && (
              <>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-600">{matchRate}%</p>
                  <p className="text-xs text-gray-400">group alignment</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Proportion band */}
      <div className="px-6 pt-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Distribution by major group</p>
        <div className="flex h-8 rounded-xl overflow-hidden shadow-inner bg-gray-100 gap-px">
          {groups.map(g => (
            <div
              key={g.majorCode}
              style={{ width: `${(g.total / grandTotal) * 100}%`, backgroundColor: g.color, minWidth: '4px' }}
              className="relative group cursor-pointer transition-opacity hover:opacity-80 flex items-center justify-center overflow-hidden"
              onMouseEnter={() => setActiveGroup(g.majorCode)}
              onMouseLeave={() => setActiveGroup(null)}
            >
              {(g.total / grandTotal) > 0.07 && (
                <span className="text-white text-xs font-bold drop-shadow">{g.majorCode}</span>
              )}
            </div>
          ))}
        </div>

        {/* Active tooltip */}
        {active && (
          <div className="mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all"
            style={{ backgroundColor: active.color + '15', borderLeft: `3px solid ${active.color}` }}>
            <span className="font-bold" style={{ color: active.color }}>{active.majorCode}</span>
            <span className="font-semibold text-gray-700 flex-1">{active.majorTitle}</span>
            <span className="text-blue-600 font-medium">{active.vacancies} vacancies</span>
            <span className="text-gray-300">·</span>
            <span className="text-green-600 font-medium">{active.candidates} candidates</span>
          </div>
        )}
        {!active && (
          <p className="mt-2 text-xs text-gray-300 text-center">Hover a segment for details</p>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 py-4 flex flex-wrap gap-2">
        {groups.map(g => (
          <div key={g.majorCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium cursor-default transition-all"
            style={{
              backgroundColor: g.color + '12',
              borderColor: g.color + '40',
              color: g.color,
            }}
            onMouseEnter={() => setActiveGroup(g.majorCode)}
            onMouseLeave={() => setActiveGroup(null)}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
            <span className="font-bold">{g.majorCode}</span>
            <span className="text-xs opacity-70 font-normal hidden sm:inline truncate max-w-28">
              {g.majorTitle.split(/[,–]/)[0].trim()}
            </span>
            <span className="font-bold opacity-90">{g.total}</span>
          </div>
        ))}
      </div>

      {/* Card grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(g => {
            const maxBar = Math.max(g.vacancies, g.candidates, 1);
            const pctVac = Math.round((g.vacancies / maxBar) * 100);
            const pctCand = Math.round((g.candidates / maxBar) * 100);
            const isAligned = g.vacancies > 0 && g.candidates > 0;
            return (
              <div key={g.majorCode}
                className="rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
                style={{ borderColor: g.color + '30' }}>
                {/* Color header stripe */}
                <div className="px-4 py-3 flex items-center gap-3"
                  style={{ background: `linear-gradient(135deg, ${g.color}18 0%, ${g.color}08 100%)` }}>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: g.color }}>
                    {g.majorCode}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 flex-1">
                    {g.majorTitle}
                  </span>
                  {isAligned && (
                    <span title="Vacancies and candidates aligned in this group"
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: g.color + '20' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: g.color }} />
                    </span>
                  )}
                </div>

                {/* Bars */}
                <div className="px-4 py-3 space-y-2.5 bg-white">
                  {/* Vacancies bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />Vacancies
                      </span>
                      <span className="text-xs font-bold" style={{ color: g.color }}>{g.vacancies}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pctVac}%`, backgroundColor: g.color, opacity: 0.85 }} />
                    </div>
                  </div>
                  {/* Candidates bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />Candidates
                      </span>
                      <span className="text-xs font-bold text-green-600">{g.candidates}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-green-400 transition-all duration-700"
                        style={{ width: `${pctCand}%` }} />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t flex items-center justify-between"
                  style={{ borderColor: g.color + '20', backgroundColor: g.color + '05' }}>
                  <span className="text-xs text-gray-400">
                    {Math.round((g.total / grandTotal) * 100)}% of classified
                  </span>
                  <span className="text-xs font-bold" style={{ color: g.color }}>
                    {g.total} total
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coverage footer */}
      <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex flex-wrap gap-4 text-xs text-gray-400">
        <span>
          Vacancy coverage:{' '}
          <strong className="text-gray-600">
            {vacancies.length > 0 ? Math.round((vacanciesCategorized / vacancies.length) * 100) : 0}%
          </strong>
          {' '}({vacanciesCategorized}/{vacancies.length})
        </span>
        <span>
          Candidate coverage:{' '}
          <strong className="text-gray-600">
            {apps.length > 0 ? Math.round((candidatesCategorized / apps.length) * 100) : 0}%
          </strong>
          {' '}({candidatesCategorized}/{apps.length})
        </span>
        <span className="ml-auto">Source: U.S. Bureau of Labor Statistics SOC 2018</span>
      </div>
    </div>
  );
}

function OverviewTab({ apps, vacancies }: { apps: Application[]; vacancies: Vacancy[] }) {
  const counts = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    reviewing: apps.filter(a => a.status === 'reviewing').length,
    interviewing: apps.filter(a => a.status === 'interviewing').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
    activeVacancies: vacancies.filter(v => v.status === 'open').length,
  };
  const inProgress = counts.reviewing + counts.interviewing;
  const fillRate = counts.total > 0 ? Math.round((counts.approved / counts.total) * 100) : 0;

  const kpis = [
    { label: 'Total Applicants', value: counts.total, icon: <Users className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50', border: 'border-blue-100' },
    { label: 'Pending Review', value: counts.pending, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50', border: 'border-amber-100' },
    { label: 'In Progress', value: inProgress, icon: <TrendingUp className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50', border: 'border-purple-100' },
    { label: 'Approved / Hired', value: counts.approved, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-green-600 bg-green-50', border: 'border-green-100' },
    { label: 'Active Vacancies', value: counts.activeVacancies, icon: <Building2 className="w-5 h-5" />, color: 'text-slate-600 bg-slate-50', border: 'border-slate-200' },
    { label: 'Rejected', value: counts.rejected, icon: <XCircle className="w-5 h-5" />, color: 'text-red-600 bg-red-50', border: 'border-red-100' },
  ];

  // Top industries
  const industryMap: Record<string, number> = {};
  apps.forEach(a => (a.industries ?? []).forEach(ind => { industryMap[ind] = (industryMap[ind] ?? 0) + 1; }));
  const topIndustries = Object.entries(industryMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Job types
  const typeMap: Record<string, number> = {};
  apps.forEach(a => { if (a.desired_job_type) typeMap[a.desired_job_type] = (typeMap[a.desired_job_type] ?? 0) + 1; });
  const typeTotal = Object.values(typeMap).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`bg-white rounded-xl border ${k.border} p-4 flex flex-col gap-3`}>
            <div className={`w-9 h-9 rounded-lg ${k.color} flex items-center justify-center`}>{k.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 font-medium leading-tight">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 lg:col-span-1">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Recruitment Pipeline</h3>
          <PipelineChart apps={apps} />
        </div>

        {/* Monthly */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 lg:col-span-1">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Applications — Last 6 Months</h3>
          {apps.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-300 text-sm">No data yet</div>
          ) : (
            <MonthlyChart apps={apps} />
          )}
        </div>

        {/* Fill rate + top industries */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">Approval Rate</h3>
            <div className="flex justify-center">
              <DonutChart pct={fillRate} label="of applicants approved" color="#22c55e" />
            </div>
          </div>
          {topIndustries.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Top Industries</h3>
              <div className="space-y-1.5">
                {topIndustries.map(([ind, cnt]) => (
                  <div key={ind} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 truncate">{ind}</span>
                    <span className="font-semibold text-gray-800 ml-2">{cnt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job type breakdown + recent applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desired Job Types */}
        {typeTotal > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Desired Job Types</h3>
            <div className="space-y-2">
              {Object.entries(typeMap).sort((a, b) => b[1] - a[1]).map(([type, cnt]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 flex-shrink-0">{type}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.round((cnt / typeTotal) * 100)}%` }}>
                      <span className="text-xs font-bold text-white">{cnt}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{Math.round((cnt / typeTotal) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applicants */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Recent Applicants</h3>
          {apps.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No applications yet</div>
          ) : (
            <div className="space-y-3">
              {apps.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm">
                      {a.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.full_name}</p>
                      <p className="text-xs text-gray-400">{a.desired_industry || a.desired_job_type}</p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SOC Job Categorization */}
      <SOCCategorizationChart vacancies={vacancies} apps={apps} />
    </div>
  );
}

// ── Candidate Form Modal ──────────────────────────────────────────────────────
type CandidateForm = Omit<Application, 'id' | 'created_at' | 'cv_file_url' | 'cv_file_name'>;

const emptyCandidate: CandidateForm = {
  full_name: '', age: 25, email: '', phone: '',
  address: '', city: '', state: '', zip: '',
  emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relation: '',
  employment_status: 'unemployed', last_employer: null, last_job_title: null,
  years_experience: null, industries: [],
  highest_education: 'High School', institution: null, field_of_study: null, certifications: null,
  technical_skills: [], soft_skills: [], languages: [], other_skills: null,
  desired_job_type: 'Full-time', desired_industry: '', desired_location: '',
  available_start_date: '', hours_per_week: '40', willing_to_travel: false,
  consent_data_use: true, consent_communication: true, status: 'pending',
  desired_soc_code: null, desired_soc_title: null,
};

type CandidateSection = 'personal' | 'employment' | 'education' | 'skills' | 'preferences';
const CANDIDATE_SECTIONS: { id: CandidateSection; label: string }[] = [
  { id: 'personal',    label: 'Personal' },
  { id: 'employment',  label: 'Employment' },
  { id: 'education',   label: 'Education' },
  { id: 'skills',      label: 'Skills' },
  { id: 'preferences', label: 'Preferences' },
];

function TagInput({ label, values, onChange, placeholder }: {
  label: string; values: string[];
  onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setInput('');
  };
  const remove = (v: string) => onChange(values.filter(x => x !== v));
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder ?? 'Type and press Enter'}
          className={inputCls} />
        <button type="button" onClick={add}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition flex-shrink-0">
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map(v => (
            <span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs rounded-full font-medium">
              {v}
              <button type="button" onClick={() => remove(v)} className="text-blue-400 hover:text-blue-700 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateModal({ candidate, onClose, onSave }: {
  candidate: Application | null;
  onClose: () => void;
  onSave: (f: CandidateForm) => Promise<void>;
}) {
  const [section, setSection] = useState<CandidateSection>('personal');
  const [form, setForm] = useState<CandidateForm>(() =>
    candidate ? {
      full_name: candidate.full_name, age: candidate.age, email: candidate.email,
      phone: candidate.phone, address: candidate.address, city: candidate.city,
      state: candidate.state, zip: candidate.zip,
      emergency_contact_name: candidate.emergency_contact_name,
      emergency_contact_phone: candidate.emergency_contact_phone,
      emergency_contact_relation: candidate.emergency_contact_relation,
      employment_status: candidate.employment_status,
      last_employer: candidate.last_employer, last_job_title: candidate.last_job_title,
      years_experience: candidate.years_experience, industries: candidate.industries ?? [],
      highest_education: candidate.highest_education, institution: candidate.institution,
      field_of_study: candidate.field_of_study, certifications: candidate.certifications,
      technical_skills: candidate.technical_skills ?? [], soft_skills: candidate.soft_skills ?? [],
      languages: candidate.languages ?? [], other_skills: candidate.other_skills,
      desired_job_type: candidate.desired_job_type, desired_industry: candidate.desired_industry,
      desired_location: candidate.desired_location, available_start_date: candidate.available_start_date,
      hours_per_week: candidate.hours_per_week, willing_to_travel: candidate.willing_to_travel,
      consent_data_use: candidate.consent_data_use, consent_communication: candidate.consent_communication,
      status: candidate.status,
      desired_soc_code: candidate.desired_soc_code, desired_soc_title: candidate.desired_soc_title,
    } : emptyCandidate
  );
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof CandidateForm>(k: K, v: CandidateForm[K]) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await onSave(form); setSaving(false);
  };

  const sectionIdx = CANDIDATE_SECTIONS.findIndex(s => s.id === section);
  const isLast = sectionIdx === CANDIDATE_SECTIONS.length - 1;
  const isFirst = sectionIdx === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-base">{candidate ? 'Edit Candidate' : 'Add Candidate'}</h2>
          <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 flex-shrink-0 overflow-x-auto">
          {CANDIDATE_SECTIONS.map((s, i) => (
            <button key={s.id} type="button" onClick={() => setSection(s.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                section === s.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs mr-1.5 ${
                section === s.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>{i + 1}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <form id="candidate-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">

            {/* ── Personal ─────────────────────────────────────── */}
            {section === 'personal' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>Full Name *</label>
                    <input className={inputCls} required value={form.full_name}
                      onChange={e => set('full_name', e.target.value)} placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className={labelCls}>Age *</label>
                    <input type="number" min={16} max={90} className={inputCls} required
                      value={form.age} onChange={e => set('age', parseInt(e.target.value) || 18)} />
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select className={inputCls} value={form.status}
                      onChange={e => set('status', e.target.value as AppStatus)}>
                      {(Object.keys(STATUS_CONFIG) as AppStatus[]).map(s => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input type="email" className={inputCls} required value={form.email}
                      onChange={e => set('email', e.target.value)} placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone *</label>
                    <input type="tel" className={inputCls} required value={form.phone}
                      onChange={e => set('phone', e.target.value)} placeholder="+1 555 000 0000" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Street Address</label>
                    <input className={inputCls} value={form.address}
                      onChange={e => set('address', e.target.value)} placeholder="123 Main St" />
                  </div>
                  <div>
                    <label className={labelCls}>City</label>
                    <input className={inputCls} value={form.city}
                      onChange={e => set('city', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>State</label>
                    <input className={inputCls} value={form.state}
                      onChange={e => set('state', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>ZIP / Postal Code</label>
                    <input className={inputCls} value={form.zip}
                      onChange={e => set('zip', e.target.value)} />
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Emergency Contact</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Name</label>
                      <input className={inputCls} value={form.emergency_contact_name}
                        onChange={e => set('emergency_contact_name', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Relation</label>
                      <input className={inputCls} value={form.emergency_contact_relation}
                        onChange={e => set('emergency_contact_relation', e.target.value)}
                        placeholder="e.g. Spouse, Parent" />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Phone</label>
                      <input type="tel" className={inputCls} value={form.emergency_contact_phone}
                        onChange={e => set('emergency_contact_phone', e.target.value)} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Employment ───────────────────────────────────── */}
            {section === 'employment' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Employment Status</label>
                  <select className={inputCls} value={form.employment_status}
                    onChange={e => set('employment_status', e.target.value)}>
                    {['Employed', 'Unemployed', 'Self-employed', 'Student', 'Retired', 'Other'].map(v => (
                      <option key={v} value={v.toLowerCase()}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Years of Experience</label>
                  <input type="number" min={0} max={60} className={inputCls}
                    value={form.years_experience ?? ''}
                    onChange={e => set('years_experience', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="0" />
                </div>
                <div>
                  <label className={labelCls}>Last Employer</label>
                  <input className={inputCls} value={form.last_employer ?? ''}
                    onChange={e => set('last_employer', e.target.value || null)} />
                </div>
                <div>
                  <label className={labelCls}>Last Job Title</label>
                  <input className={inputCls} value={form.last_job_title ?? ''}
                    onChange={e => set('last_job_title', e.target.value || null)} />
                </div>
                <div className="col-span-2">
                  <TagInput label="Industries" values={form.industries}
                    onChange={v => set('industries', v)} placeholder="e.g. Healthcare, Finance" />
                </div>
              </div>
            )}

            {/* ── Education ────────────────────────────────────── */}
            {section === 'education' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Highest Education</label>
                  <select className={inputCls} value={form.highest_education}
                    onChange={e => set('highest_education', e.target.value)}>
                    {['Less than High School', 'High School', 'Some College', "Associate's", "Bachelor's", "Master's", 'Doctorate', 'Trade / Vocational'].map(v => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Institution</label>
                  <input className={inputCls} value={form.institution ?? ''}
                    onChange={e => set('institution', e.target.value || null)} />
                </div>
                <div>
                  <label className={labelCls}>Field of Study</label>
                  <input className={inputCls} value={form.field_of_study ?? ''}
                    onChange={e => set('field_of_study', e.target.value || null)} />
                </div>
                <div>
                  <label className={labelCls}>Certifications</label>
                  <input className={inputCls} value={form.certifications ?? ''}
                    onChange={e => set('certifications', e.target.value || null)}
                    placeholder="e.g. PMP, AWS, SHRM" />
                </div>
              </div>
            )}

            {/* ── Skills ───────────────────────────────────────── */}
            {section === 'skills' && (
              <div className="space-y-4">
                <TagInput label="Technical Skills" values={form.technical_skills}
                  onChange={v => set('technical_skills', v)} placeholder="e.g. Python, Excel, SAP" />
                <TagInput label="Soft Skills" values={form.soft_skills}
                  onChange={v => set('soft_skills', v)} placeholder="e.g. Leadership, Communication" />
                <TagInput label="Languages" values={form.languages}
                  onChange={v => set('languages', v)} placeholder="e.g. English, Spanish" />
                <div>
                  <label className={labelCls}>Other Skills / Notes</label>
                  <textarea className={inputCls + ' resize-none'} rows={3}
                    value={form.other_skills ?? ''}
                    onChange={e => set('other_skills', e.target.value || null)} />
                </div>
              </div>
            )}

            {/* ── Preferences ──────────────────────────────────── */}
            {section === 'preferences' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Desired Job Type</label>
                  <select className={inputCls} value={form.desired_job_type}
                    onChange={e => set('desired_job_type', e.target.value)}>
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Freelance'].map(v => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Desired Industry</label>
                  <input className={inputCls} value={form.desired_industry}
                    onChange={e => set('desired_industry', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Preferred Location</label>
                  <input className={inputCls} value={form.desired_location}
                    onChange={e => set('desired_location', e.target.value)}
                    placeholder="e.g. New York, Remote" />
                </div>
                <div>
                  <label className={labelCls}>Available From</label>
                  <input type="date" className={inputCls} value={form.available_start_date}
                    onChange={e => set('available_start_date', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Hours per Week</label>
                  <select className={inputCls} value={form.hours_per_week}
                    onChange={e => set('hours_per_week', e.target.value)}>
                    {['40', '32', '24', '20', '16', '10', 'Flexible'].map(v => (
                      <option key={v} value={v}>{v === '40' ? '40 (Full-time)' : v === 'Flexible' ? 'Flexible' : `${v} hrs`}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <input type="checkbox" id="travel" checked={form.willing_to_travel}
                    onChange={e => set('willing_to_travel', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                  <label htmlFor="travel" className="text-sm text-gray-700">Willing to travel</label>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Desired SOC Classification (2018)</label>
                  <SOCSelector
                    value={form.desired_soc_code ? { code: form.desired_soc_code, title: form.desired_soc_title ?? '' } : null}
                    onChange={v => { set('desired_soc_code', v?.code ?? null); set('desired_soc_title', v?.title ?? null); }}
                    placeholder="Search occupation type…"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
          <div className="flex gap-1.5 flex-1">
            {CANDIDATE_SECTIONS.map((s, i) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full transition ${
                i <= sectionIdx ? 'bg-blue-500' : 'bg-gray-200'}`} />
            ))}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {!isFirst && (
              <button type="button"
                onClick={() => setSection(CANDIDATE_SECTIONS[sectionIdx - 1].id)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Back
              </button>
            )}
            {isFirst && (
              <button type="button" onClick={onClose}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Cancel
              </button>
            )}
            {!isLast ? (
              <button type="button"
                onClick={() => setSection(CANDIDATE_SECTIONS[sectionIdx + 1].id)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition">
                Next
              </button>
            ) : (
              <button type="submit" form="candidate-form" disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving…' : candidate ? 'Save Changes' : 'Add Candidate'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Candidates Tab ────────────────────────────────────────────────────────────
function CandidatesTab({ apps, loading, refreshing, onRefresh, onSelect, onStatusChange, onAdd, onEdit, onDelete }: {
  apps: Application[]; loading: boolean; refreshing: boolean;
  onRefresh: () => void; onSelect: (a: Application) => void;
  onStatusChange: (id: string, s: AppStatus) => void;
  onAdd: () => void; onEdit: (a: Application) => void; onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppStatus | 'all'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = apps.filter(a => {
    const matchSearch = !search || [a.full_name, a.email, a.city, a.desired_industry, a.employment_status]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (statusFilter === 'all' || a.status === statusFilter);
  });

  const handleDelete = async (app: Application) => {
    if (!confirm(`Delete ${app.full_name}? This cannot be undone.`)) return;
    setDeletingId(app.id);
    await onDelete(app.id);
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="font-bold text-gray-900">All Candidates <span className="text-gray-400 font-normal text-sm">({apps.length})</span></h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as AppStatus | 'all')}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none appearance-none bg-white cursor-pointer">
              <option value="all">All Statuses</option>
              {(Object.keys(STATUS_CONFIG) as AppStatus[]).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <button onClick={onRefresh} disabled={refreshing}
            className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 transition disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={onAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition">
            <Plus className="w-4 h-4" />Add Candidate
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium mb-3">
            {search || statusFilter !== 'all' ? 'No matching candidates' : 'No candidates yet'}
          </p>
          {!search && statusFilter === 'all' && (
            <button onClick={onAdd} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Add your first candidate
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Candidate', 'Contact', 'Location', 'Education', 'Job Type', 'Available', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs flex-shrink-0">
                        {app.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 whitespace-nowrap">{app.full_name}</p>
                        <p className="text-xs text-gray-400">{new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs text-gray-600"><Mail className="w-3 h-3" />{app.email}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400"><Phone className="w-3 h-3" />{app.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1 text-xs text-gray-600"><MapPin className="w-3 h-3" />{app.city}, {app.state}</div></td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-600 whitespace-nowrap">{app.highest_education}</span></td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-600 whitespace-nowrap">{app.desired_job_type}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                      <Calendar className="w-3 h-3" />
                      {app.available_start_date ? new Date(app.available_start_date).toLocaleDateString() : '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={app.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onSelect(app)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View details">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onEdit(app)}
                        className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
                        title="Edit candidate">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(app)} disabled={deletingId === app.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30"
                        title="Delete candidate">
                        {deletingId === app.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {apps.length} candidates
        </div>
      )}
    </div>
  );
}

// ── Vacancies Tab ─────────────────────────────────────────────────────────────
function VacanciesTab({ vacancies, loading, onAdd, onEdit, onDelete, onStatusChange }: {
  vacancies: Vacancy[]; loading: boolean;
  onAdd: () => void; onEdit: (v: Vacancy) => void;
  onDelete: (id: string) => void; onStatusChange: (id: string, s: VacancyStatus) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VacancyStatus | 'all'>('all');

  const filtered = vacancies.filter(v => {
    const matchSearch = !search || [v.title, v.department, v.location]
      .some(s => s?.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (statusFilter === 'all' || v.status === statusFilter);
  });

  const fmtSalary = (v: Vacancy) => {
    if (!v.salary_min && !v.salary_max) return '—';
    if (v.salary_min && v.salary_max) return `$${(v.salary_min / 1000).toFixed(0)}k–$${(v.salary_max / 1000).toFixed(0)}k`;
    if (v.salary_min) return `From $${(v.salary_min / 1000).toFixed(0)}k`;
    return `Up to $${(v.salary_max! / 1000).toFixed(0)}k`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="font-bold text-gray-900">Job Vacancies <span className="text-gray-400 font-normal text-sm">({vacancies.filter(v => v.status === 'open').length} open)</span></h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vacancies..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-44" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as VacancyStatus | 'all')}
              className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none appearance-none bg-white cursor-pointer">
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="on_hold">On Hold</option>
              <option value="closed">Closed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <button onClick={onAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition">
            <Plus className="w-4 h-4" />Add Vacancy
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium mb-3">{search || statusFilter !== 'all' ? 'No matching vacancies' : 'No vacancies yet'}</p>
          {!search && statusFilter === 'all' && (
            <button onClick={onAdd} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Add your first vacancy</button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Position', 'SOC', 'Department', 'Location', 'Type', 'Salary', 'Positions', 'Deadline', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 whitespace-nowrap">{v.title}</p>
                    <p className="text-xs text-gray-400">{new Date(v.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    {v.soc_code ? (
                      <div title={v.soc_title ?? ''} className="flex items-center gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                          {v.soc_code}
                        </span>
                      </div>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-600">{v.department}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap"><MapPin className="w-3 h-3" />{v.location}</div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-600 whitespace-nowrap">{v.type}</span></td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-600 whitespace-nowrap">{fmtSalary(v)}</span></td>
                  <td className="px-4 py-3 text-center"><span className="text-xs font-semibold text-gray-700">{v.positions}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                      <Calendar className="w-3 h-3" />
                      {v.deadline ? new Date(v.deadline).toLocaleDateString() : '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select value={v.status} onChange={e => onStatusChange(v.id, e.target.value as VacancyStatus)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none cursor-pointer">
                      <option value="open">Open</option>
                      <option value="on_hold">On Hold</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onEdit(v)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (confirm('Delete this vacancy?')) onDelete(v.id); }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {filtered.length} of {vacancies.length} vacancies
        </div>
      )}
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

type UserModalMode = 'add' | 'edit';

function UserModal({ mode, user: editUser, currentUserId, onClose, onSave }: {
  mode: UserModalMode;
  user: AdminUser | null;
  currentUserId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [email, setEmail] = useState(editUser?.email ?? '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const body = mode === 'add'
        ? { action: 'create', email, password }
        : { action: 'update', id: editUser!.id, email, password: password || undefined };

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-management`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-base">
            {mode === 'add' ? 'Add Administrator' : 'Edit User'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                placeholder="admin@korixllc.com" />
            </div>
          </div>
          <div>
            <label className={labelCls}>
              {mode === 'add' ? 'Password' : 'New Password'}
              {mode === 'edit' && <span className="text-gray-400 font-normal ml-1">(leave blank to keep current)</span>}
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" required={mode === 'add'} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'add' ? 'Min. 8 characters' : '••••••••'}
                minLength={mode === 'add' ? 8 : undefined}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {mode === 'edit' && editUser?.id === currentUserId && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              You are editing your own account.
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : mode === 'add' ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserManagementCard({ currentUser }: { currentUser: User }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: UserModalMode; user: AdminUser | null }>({
    open: false, mode: 'add', user: null,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-management`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list' }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setUsers(json.data as AdminUser[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const deleteUser = async (u: AdminUser) => {
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    setDeletingId(u.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-management`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id: u.id }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setUsers(prev => prev.filter(x => x.id !== u.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const openAdd = () => setModal({ open: true, mode: 'add', user: null });
  const openEdit = (u: AdminUser) => setModal({ open: true, mode: 'edit', user: u });
  const closeModal = () => setModal({ open: false, mode: 'add', user: null });
  const handleSaved = () => { closeModal(); fetchUsers(); };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">User Management</h3>
            <p className="text-xs text-gray-400 mt-0.5">Administrators who can access this portal</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition">
            <Plus className="w-4 h-4" />Add User
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-6 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            <button onClick={fetchUsers} className="ml-auto text-xs text-blue-600 hover:underline flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No users found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map(u => {
              const isCurrentUser = u.id === currentUser.id;
              const initials = (u.email ?? '?').charAt(0).toUpperCase();
              return (
                <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isCurrentUser ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{u.email}</p>
                      {isCurrentUser && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 flex-shrink-0">
                          You
                        </span>
                      )}
                      {u.email_confirmed_at ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3" />Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 flex-shrink-0">
                          Unverified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                      <span>Added {new Date(u.created_at).toLocaleDateString()}</span>
                      {u.last_sign_in_at && (
                        <span>Last login {new Date(u.last_sign_in_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(u)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit user">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(u)}
                      disabled={isCurrentUser || deletingId === u.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                      title={isCurrentUser ? "Cannot delete your own account" : "Delete user"}>
                      {deletingId === u.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>{users.length} user{users.length !== 1 ? 's' : ''} total</span>
            <button onClick={fetchUsers} className="flex items-center gap-1 hover:text-blue-600 transition">
              <RefreshCw className="w-3 h-3" />Refresh
            </button>
          </div>
        )}
      </div>

      {modal.open && (
        <UserModal
          mode={modal.mode}
          user={modal.user}
          currentUserId={currentUser.id}
          onClose={closeModal}
          onSave={handleSaved}
        />
      )}
    </>
  );
}

function SettingsTab({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <div className="max-w-3xl space-y-6">
      <UserManagementCard currentUser={user} />

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Your Account</h3>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg">
            {(user.email ?? 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{user.email}</p>
            <p className="text-xs text-gray-400">Administrator · KORIX LLC</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm rounded-xl transition">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-1">About</h3>
        <p className="text-sm text-gray-500 mb-4">KORIX LLC Recruitment Manager — Admin Dashboard</p>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between"><span>Version</span><span className="font-medium text-gray-600">1.0.0</span></div>
          <div className="flex justify-between"><span>Database</span><span className="font-medium text-green-600">Connected</span></div>
        </div>
      </div>
    </div>
  );
}
// ── Main Dashboard Shell ──────────────────────────────────────────────────────
function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [apps, setApps] = useState<Application[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingVacancies, setLoadingVacancies] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [vacancyModal, setVacancyModal] = useState<{ open: boolean; vacancy: Vacancy | null }>({ open: false, vacancy: null });
  const [candidateModal, setCandidateModal] = useState<{ open: boolean; candidate: Application | null }>({ open: false, candidate: null });

  const fetchApps = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    const { data, error } = await supabase.from('training_applications').select('*').order('created_at', { ascending: false });
    if (!error && data) setApps(data as Application[]);
    setLoadingApps(false); setRefreshing(false);
  }, []);

  const fetchVacancies = useCallback(async () => {
    const { data, error } = await supabase.from('vacancies').select('*').order('created_at', { ascending: false });
    if (!error && data) setVacancies(data as Vacancy[]);
    setLoadingVacancies(false);
  }, []);

  useEffect(() => { fetchApps(); fetchVacancies(); }, [fetchApps, fetchVacancies]);

  const updateAppStatus = async (id: string, status: AppStatus) => {
    const { error } = await supabase.from('training_applications').update({ status }).eq('id', id);
    if (!error) {
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status } : prev);
    }
  };

  const saveCandidate = async (form: CandidateForm) => {
    if (candidateModal.candidate) {
      const { error } = await supabase.from('training_applications').update(form).eq('id', candidateModal.candidate.id);
      if (!error) {
        setApps(prev => prev.map(a => a.id === candidateModal.candidate!.id ? { ...a, ...form } : a));
        if (selectedApp?.id === candidateModal.candidate.id) setSelectedApp(prev => prev ? { ...prev, ...form } : prev);
      }
    } else {
      const { data, error } = await supabase.from('training_applications').insert({
        ...form, cv_file_url: null, cv_file_name: null,
      }).select().single();
      if (!error && data) setApps(prev => [data as Application, ...prev]);
    }
    setCandidateModal({ open: false, candidate: null });
  };

  const deleteCandidate = async (id: string) => {
    const { error } = await supabase.from('training_applications').delete().eq('id', id);
    if (!error) {
      setApps(prev => prev.filter(a => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    }
  };

  const saveVacancy = async (form: VacancyForm) => {
    if (vacancyModal.vacancy) {
      const { error } = await supabase.from('vacancies').update(form).eq('id', vacancyModal.vacancy.id);
      if (!error) setVacancies(prev => prev.map(v => v.id === vacancyModal.vacancy!.id ? { ...v, ...form } : v));
    } else {
      const { data, error } = await supabase.from('vacancies').insert(form).select().single();
      if (!error && data) setVacancies(prev => [data as Vacancy, ...prev]);
    }
    setVacancyModal({ open: false, vacancy: null });
  };

  const deleteVacancy = async (id: string) => {
    const { error } = await supabase.from('vacancies').delete().eq('id', id);
    if (!error) setVacancies(prev => prev.filter(v => v.id !== id));
  };

  const updateVacancyStatus = async (id: string, status: VacancyStatus) => {
    const { error } = await supabase.from('vacancies').update({ status }).eq('id', id);
    if (!error) setVacancies(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',   label: 'Overview',   icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'candidates', label: 'Candidates', icon: <Users className="w-4 h-4" /> },
    { id: 'vacancies',  label: 'Vacancies',  icon: <Briefcase className="w-4 h-4" /> },
    { id: 'settings',   label: 'Settings',   icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">KORIX LLC</span>
            <span className="hidden sm:block text-white/30 text-sm">|</span>
            <span className="hidden sm:block text-white/60 text-sm">Recruitment Manager</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-white/50">{user.email}</span>
            <button onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition text-xs font-medium">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 -mb-px">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  tab === t.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                {t.icon}{t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tab === 'overview' && <OverviewTab apps={apps} vacancies={vacancies} />}
        {tab === 'candidates' && (
          <CandidatesTab apps={apps} loading={loadingApps} refreshing={refreshing}
            onRefresh={() => fetchApps(true)} onSelect={setSelectedApp} onStatusChange={updateAppStatus}
            onAdd={() => setCandidateModal({ open: true, candidate: null })}
            onEdit={a => setCandidateModal({ open: true, candidate: a })}
            onDelete={deleteCandidate} />
        )}
        {tab === 'vacancies' && (
          <VacanciesTab vacancies={vacancies} loading={loadingVacancies}
            onAdd={() => setVacancyModal({ open: true, vacancy: null })}
            onEdit={v => setVacancyModal({ open: true, vacancy: v })}
            onDelete={deleteVacancy}
            onStatusChange={updateVacancyStatus} />
        )}
        {tab === 'settings' && <SettingsTab user={user} onLogout={onLogout} />}
      </main>

      {selectedApp && (
        <AppDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} onStatusChange={updateAppStatus} />
      )}
      {candidateModal.open && (
        <CandidateModal candidate={candidateModal.candidate} onClose={() => setCandidateModal({ open: false, candidate: null })} onSave={saveCandidate} />
      )}
      {vacancyModal.open && (
        <VacancyModal vacancy={vacancyModal.vacancy} onClose={() => setVacancyModal({ open: false, vacancy: null })} onSave={saveVacancy} />
      )}
    </div>
  );
}

// ── Root Export ───────────────────────────────────────────────────────────────
export function AdminDashboard({ onBack }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); };

  if (checking) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-white/50" />
    </div>
  );

  if (!isSupabaseConfigured) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Database Not Configured</h2>
        <p className="text-gray-500 text-sm mb-6">Supabase environment variables are missing from this deployment.</p>
        <button onClick={onBack} className="flex items-center gap-2 mx-auto text-sm text-blue-600 font-medium hover:text-blue-700 transition">
          <ArrowLeft className="w-4 h-4" />Back to site
        </button>
      </div>
    </div>
  );

  if (!user) return <LoginScreen onLogin={setUser} />;
  return <Dashboard user={user} onLogout={handleLogout} />;
}
