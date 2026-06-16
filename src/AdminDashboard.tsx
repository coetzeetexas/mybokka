import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import {
  LogOut,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ChevronDown,
  Eye,
  X,
  ArrowLeft,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Zap,
  Target,
  AlertCircle,
  Loader2,
  Shield,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

type AppStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'interviewing';

interface Application {
  id: string;
  created_at: string;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  employment_status: string;
  last_employer: string | null;
  last_job_title: string | null;
  years_experience: number | null;
  industries: string[];
  highest_education: string;
  institution: string | null;
  field_of_study: string | null;
  certifications: string | null;
  technical_skills: string[];
  soft_skills: string[];
  languages: string[];
  other_skills: string | null;
  desired_job_type: string;
  desired_industry: string;
  desired_location: string;
  available_start_date: string;
  hours_per_week: string;
  willing_to_travel: boolean;
  cv_file_url: string | null;
  cv_file_name: string | null;
  consent_data_use: boolean;
  consent_communication: boolean;
  status: AppStatus;
}

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:      { label: 'Pending',      color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  icon: <Clock className="w-3.5 h-3.5" /> },
  reviewing:    { label: 'Reviewing',    color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    icon: <Eye className="w-3.5 h-3.5" /> },
  interviewing: { label: 'Interviewing', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',icon: <UserCheck className="w-3.5 h-3.5" /> },
  approved:     { label: 'Approved',     color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected:     { label: 'Rejected',     color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      icon: <XCircle className="w-3.5 h-3.5" /> },
};

function StatusBadge({ status }: { status: AppStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}
      {cfg.label}
    </span>
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
    setError('');
    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) throw authErr;
      if (data.user) onLogin(data.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/50 text-sm mt-1">KORIX LLC — Training Applications</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-xl transition disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Application Detail Modal ──────────────────────────────────────────────────
function AppDetailModal({
  app,
  onClose,
  onStatusChange,
}: {
  app: Application;
  onClose: () => void;
  onStatusChange: (id: string, status: AppStatus) => void;
}) {
  const [updating, setUpdating] = useState(false);

  const changeStatus = async (status: AppStatus) => {
    setUpdating(true);
    await onStatusChange(app.id, status);
    setUpdating(false);
  };

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="text-navy-600">{icon}</div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 flex-shrink-0 w-40">{label}</span>
      <span className="text-sm text-gray-900 font-medium text-right">{value || '—'}</span>
    </div>
  );

  const Tags = ({ items }: { items: string[] }) =>
    items.length ? (
      <div className="flex flex-wrap gap-1.5">
        {items.map(t => (
          <span key={t} className="px-2.5 py-1 bg-navy-50 text-navy-700 text-xs rounded-full font-medium border border-navy-100">{t}</span>
        ))}
      </div>
    ) : <span className="text-sm text-gray-400">None listed</span>;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-end">
      <div className="w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 text-white px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold">{app.full_name}</h2>
            <p className="text-white/60 text-sm">{app.email} &bull; Applied {new Date(app.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-gray-500 font-medium">Status:</span>
          <StatusBadge status={app.status} />
          <div className="flex gap-2 ml-auto flex-wrap">
            {(Object.keys(STATUS_CONFIG) as AppStatus[]).filter(s => s !== app.status).map(s => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                disabled={updating}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition disabled:opacity-50 ${STATUS_CONFIG[s].color} ${STATUS_CONFIG[s].bg} hover:opacity-80`}
              >
                {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : STATUS_CONFIG[s].icon}
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <Section title="Personal Details" icon={<Users className="w-4 h-4" />}>
            <div className="bg-gray-50 rounded-xl p-4">
              <Row label="Age" value={`${app.age} years old`} />
              <Row label="Phone" value={<a href={`tel:${app.phone}`} className="text-navy-600 hover:underline">{app.phone}</a>} />
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
              <div className="py-2">
                <span className="text-sm text-gray-500 block mb-2">Industries</span>
                <Tags items={app.industries ?? []} />
              </div>
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
            </div>
          </Section>

          {app.cv_file_url && (
            <Section title="CV / Resume" icon={<FileText className="w-4 h-4" />}>
              <a
                href={app.cv_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-navy-50 border border-navy-200 rounded-xl hover:bg-navy-100 transition group"
              >
                <FileText className="w-8 h-8 text-navy-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-800">{app.cv_file_name ?? 'View CV'}</p>
                  <p className="text-xs text-navy-500">Click to open in new tab</p>
                </div>
                <Download className="w-4 h-4 text-navy-600 group-hover:text-navy-800 transition" />
              </a>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppStatus | 'all'>('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApps = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    const { data, error } = await supabase
      .from('training_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setApps(data as Application[]);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const updateStatus = async (id: string, status: AppStatus) => {
    const { error } = await supabase
      .from('training_applications')
      .update({ status })
      .eq('id', id);
    if (!error) {
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev);
    }
  };

  const filtered = apps.filter(a => {
    const matchSearch = !search || [a.full_name, a.email, a.city, a.desired_industry, a.employment_status]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    reviewing: apps.filter(a => a.status === 'reviewing').length,
    interviewing: apps.filter(a => a.status === 'interviewing').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  const statsCards = [
    { label: 'Total Applications', value: counts.total, icon: <Users className="w-5 h-5" />, color: 'bg-navy-50 text-navy-700 border-navy-200' },
    { label: 'Pending Review', value: counts.pending, icon: <Clock className="w-5 h-5" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'In Progress', value: counts.reviewing + counts.interviewing, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Approved', value: counts.approved, icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Rejected', value: counts.rejected, icon: <XCircle className="w-5 h-5" />, color: 'bg-red-50 text-red-700 border-red-200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar */}
      <header className="bg-navy-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm">KORIX LLC</span>
              <span className="text-white/40 text-sm ml-2">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/50">Signed in as</p>
              <p className="text-xs font-semibold text-white/80">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statsCards.map(card => (
            <div key={card.label} className={`rounded-xl p-4 border ${card.color} flex flex-col gap-2`}>
              <div className="opacity-70">{card.icon}</div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs font-medium opacity-70">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Controls */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">Applications</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, email, city..."
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 w-full sm:w-56"
                />
              </div>
              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as AppStatus | 'all')}
                  className="pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  {(Object.keys(STATUS_CONFIG) as AppStatus[]).map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              {/* Refresh */}
              <button
                onClick={() => fetchApps(true)}
                disabled={refreshing}
                className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:text-navy-700 hover:border-navy-300 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-navy-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">{search || statusFilter !== 'all' ? 'No matching applications' : 'No applications yet'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Applicant', 'Contact', 'Location', 'Education', 'Job Type', 'Available', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{app.full_name}</p>
                          <p className="text-xs text-gray-400">{new Date(app.created_at).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs text-gray-600"><Mail className="w-3 h-3" />{app.email}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-400"><Phone className="w-3 h-3" />{app.phone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-gray-600"><MapPin className="w-3 h-3" />{app.city}, {app.state}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 whitespace-nowrap">{app.highest_education}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 whitespace-nowrap">{app.desired_job_type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          {app.available_start_date ? new Date(app.available_start_date).toLocaleDateString() : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(app)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-navy-50 hover:bg-navy-100 text-navy-700 text-xs font-semibold rounded-lg transition border border-navy-200 whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {apps.length} applications
            </div>
          )}
        </div>
      </div>

      {selected && (
        <AppDetailModal
          app={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}

// ── Root Export ───────────────────────────────────────────────────────────────
export function AdminDashboard({ onBack }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/50" />
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={setUser} />;
  return <Dashboard user={user} onLogout={handleLogout} />;
}
