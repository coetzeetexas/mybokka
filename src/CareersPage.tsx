import { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabase';
import {
  ArrowLeft,
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  ChevronRight,
  X,
  Loader2,
  CheckCircle2,
  Users,
  Building2,
  Filter,
  ChevronDown,
  Send,
  ExternalLink,
} from 'lucide-react';

interface Vacancy {
  id: string;
  created_at: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  description: string | null;
  requirements: string | null;
  salary_min: number | null;
  salary_max: number | null;
  deadline: string | null;
  positions: number;
  soc_code: string | null;
  soc_title: string | null;
}

interface AppForm {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  years_experience: string;
  cover_letter: string;
  heard_about: string;
}

const emptyForm: AppForm = {
  full_name: '',
  email: '',
  phone: '',
  location: '',
  linkedin_url: '',
  years_experience: '',
  cover_letter: '',
  heard_about: '',
};

const fmtSalary = (v: Vacancy) => {
  if (!v.salary_min && !v.salary_max) return null;
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
  if (v.salary_min && v.salary_max) return `${fmt(v.salary_min)} – ${fmt(v.salary_max)}`;
  if (v.salary_min) return `From ${fmt(v.salary_min)}`;
  return `Up to ${fmt(v.salary_max!)}`;
};

const typeColor: Record<string, string> = {
  'Full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Part-time': 'bg-sky-50 text-sky-700 border-sky-200',
  'Contract': 'bg-amber-50 text-amber-700 border-amber-200',
  'Internship': 'bg-violet-50 text-violet-700 border-violet-200',
  'Temporary': 'bg-orange-50 text-orange-700 border-orange-200',
};

// ── Apply Modal ──────────────────────────────────────────────────────────────
function ApplyModal({ vacancy, onClose }: { vacancy: Vacancy; onClose: () => void }) {
  const [form, setForm] = useState<AppForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof AppForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const { error: err } = await supabase.from('job_applications').insert({
        vacancy_id: vacancy.id,
        job_title: vacancy.title,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        location: form.location || null,
        linkedin_url: form.linkedin_url || null,
        years_experience: form.years_experience || null,
        cover_letter: form.cover_letter || null,
        heard_about: form.heard_about || null,
      });
      if (err) throw err;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition bg-white placeholder:text-gray-400';
  const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-navy-950 text-white px-6 py-5 rounded-t-2xl sm:rounded-t-2xl flex items-start justify-between flex-shrink-0">
          <div>
            <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Applying for</p>
            <h2 className="font-bold text-xl leading-tight">{vacancy.title}</h2>
            <p className="text-white/60 text-sm mt-1">{vacancy.department} &bull; {vacancy.location}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-white transition mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-500 max-w-sm mb-8">
              Thanks for applying to the {vacancy.title} role. Our team will review your application and be in touch soon.
            </p>
            <button onClick={onClose}
              className="px-8 py-3 bg-navy-950 hover:bg-navy-800 text-white font-semibold rounded-xl transition">
              Back to Jobs
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 space-y-4">
              {/* Personal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Full Name *</label>
                  <input className={inputCls} value={form.full_name} onChange={e => set('full_name', e.target.value)}
                    required placeholder="Jane Smith" />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)}
                    required placeholder="jane@email.com" />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="tel" className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className={labelCls}>City, State</label>
                  <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)}
                    placeholder="Dallas, TX" />
                </div>
                <div>
                  <label className={labelCls}>Years of Experience</label>
                  <div className="relative">
                    <select className={inputCls + ' appearance-none pr-8'} value={form.years_experience}
                      onChange={e => set('years_experience', e.target.value)}>
                      <option value="">Select...</option>
                      {['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years'].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>LinkedIn / Portfolio URL</label>
                  <input className={inputCls} value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/yourname" />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Cover Letter</label>
                  <textarea className={inputCls + ' resize-none'} rows={4} value={form.cover_letter}
                    onChange={e => set('cover_letter', e.target.value)}
                    placeholder="Tell us why you're a great fit for this role..." />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>How did you hear about us?</label>
                  <div className="relative">
                    <select className={inputCls + ' appearance-none pr-8'} value={form.heard_about}
                      onChange={e => set('heard_about', e.target.value)}>
                      <option value="">Select...</option>
                      {['Company Website', 'LinkedIn', 'Indeed', 'Referral', 'Google', 'Social Media', 'Other'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <X className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3 flex-shrink-0">
              <button type="button" onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-navy-950 hover:bg-navy-800 text-white font-semibold rounded-xl transition disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {saving ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Job Detail Panel ─────────────────────────────────────────────────────────
function JobDetail({ vacancy, onApply, onClose }: {
  vacancy: Vacancy; onApply: () => void; onClose?: () => void;
}) {
  const salary = fmtSalary(vacancy);

  const renderParagraphs = (text: string) =>
    text.split('\n').filter(Boolean).map((p, i) => (
      <p key={i} className="text-gray-600 text-sm leading-relaxed">{p}</p>
    ));

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Detail header */}
      <div className="px-8 py-7 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border mb-3 ${typeColor[vacancy.type] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {vacancy.type}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{vacancy.title}</h2>
            <p className="text-gray-500 mt-1">{vacancy.department}</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition lg:hidden">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-3 mt-5">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />{vacancy.location}
          </div>
          {salary && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-gray-400" />{salary} / yr
            </div>
          )}
          {vacancy.deadline && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              Apply by {new Date(vacancy.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />{vacancy.positions} {vacancy.positions === 1 ? 'opening' : 'openings'}
          </div>
          {vacancy.soc_code && (
            <div className="flex items-center gap-1.5 text-sm">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold">
                SOC {vacancy.soc_code}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-7">
        {vacancy.description && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">About the Role</h3>
            <div className="space-y-2">{renderParagraphs(vacancy.description)}</div>
          </div>
        )}
        {vacancy.requirements && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Requirements</h3>
            <ul className="space-y-2">
              {vacancy.requirements.split('\n').filter(Boolean).map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-navy-500 rounded-full mt-1.5 flex-shrink-0" />
                  {r.replace(/^[-•*]\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!vacancy.description && !vacancy.requirements && (
          <p className="text-gray-400 text-sm italic">No additional details provided for this role.</p>
        )}
      </div>

      {/* CTA */}
      <div className="px-8 py-5 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
        <button onClick={onApply}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-navy-950 hover:bg-navy-800 text-white font-semibold rounded-xl transition text-sm tracking-wide">
          Apply Now <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-center text-xs text-gray-400 mt-2.5">
          Applications reviewed within 5 business days
        </p>
      </div>
    </div>
  );
}

// ── Main Careers Page ────────────────────────────────────────────────────────
export function CareersPage({ onBack }: { onBack: () => void }) {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false); // mobile drawer
  const [applyVacancy, setApplyVacancy] = useState<Vacancy | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('vacancies')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      setVacancies(data ?? []);
      if (data && data.length > 0) setSelectedId(data[0].id);
      setLoading(false);
    })();
  }, []);

  const departments = useMemo(() => [...new Set(vacancies.map(v => v.department))].sort(), [vacancies]);
  const locations = useMemo(() => [...new Set(vacancies.map(v => v.location))].sort(), [vacancies]);
  const types = useMemo(() => [...new Set(vacancies.map(v => v.type))].sort(), [vacancies]);

  const filtered = useMemo(() =>
    vacancies.filter(v => {
      const q = search.toLowerCase();
      const matchSearch = !q || v.title.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q) || v.location.toLowerCase().includes(q);
      const matchDept = !deptFilter || v.department === deptFilter;
      const matchLoc = !locationFilter || v.location === locationFilter;
      const matchType = !typeFilter || v.type === typeFilter;
      return matchSearch && matchDept && matchLoc && matchType;
    }), [vacancies, search, deptFilter, locationFilter, typeFilter]);

  const selectedVacancy = filtered.find(v => v.id === selectedId) ?? filtered[0] ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setShowDetail(true);
  };

  const handleApply = (v: Vacancy) => {
    setApplyVacancy(v);
  };

  const selectCls = 'pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 text-gray-700';

  return (
    <div className="min-h-screen bg-white">

      {/* ── Top Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to KORIX
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-white rounded overflow-hidden">
              <img src="/WhatsApp_Image_2026-06-15_at_06.33.37.jpeg" alt="KORIX LLC" className="h-8 w-auto object-contain px-2 py-0.5" />
            </div>
          </div>
          <a href="#jobs" className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition">
            {loading ? '—' : `${filtered.length} Open Role${filtered.length !== 1 ? 's' : ''}`}
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-navy-950 text-white pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-accent-500 text-xs font-bold uppercase tracking-[0.2em] mb-5">
              Careers at KORIX LLC
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              Build the<br />
              <span className="text-white/40">future of AI</span><br />
              with us.
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              We're growing our team of thinkers, builders, and strategists who believe AI should work for every business — not just the Fortune 500.
            </p>
          </div>

          {/* Stats row */}
          {!loading && vacancies.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { label: 'Open Positions', value: vacancies.length },
                { label: 'Departments', value: departments.length },
                { label: 'Locations', value: locations.length },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-white">{value}</p>
                  <p className="text-white/40 text-sm mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diagonal cut */}
        <div className="h-12 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />
      </section>

      {/* ── Filter Bar ── */}
      <div id="jobs" className="sticky top-14 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search roles..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 bg-white"
              />
            </div>

            <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />

            {/* Dropdowns */}
            {departments.length > 1 && (
              <div className="relative">
                <select className={selectCls} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            )}
            {locations.length > 1 && (
              <div className="relative">
                <select className={selectCls} value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
                  <option value="">All Locations</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            )}
            {types.length > 1 && (
              <div className="relative">
                <select className={selectCls} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="">All Types</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            )}

            {(search || deptFilter || locationFilter || typeFilter) && (
              <button onClick={() => { setSearch(''); setDeptFilter(''); setLocationFilter(''); setTypeFilter(''); }}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-2.5 py-2 transition">
                <X className="w-3 h-3" /> Clear
              </button>
            )}

            <span className="ml-auto text-xs text-gray-400 whitespace-nowrap hidden sm:block">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── Split Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-navy-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Briefcase className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {vacancies.length === 0 ? 'No open positions right now' : 'No matching roles'}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
              {vacancies.length === 0
                ? "We're not actively hiring at the moment. Check back soon!"
                : 'Try adjusting your filters to see more results.'}
            </p>
            {(search || deptFilter || locationFilter || typeFilter) && (
              <button onClick={() => { setSearch(''); setDeptFilter(''); setLocationFilter(''); setTypeFilter(''); }}
                className="text-sm text-navy-600 hover:text-navy-800 font-medium transition">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-5 lg:gap-6 lg:items-start">

            {/* ── Job List ── */}
            <div className="lg:col-span-2 space-y-0 border border-gray-100 rounded-2xl overflow-hidden">
              {filtered.map((v, idx) => {
                const salary = fmtSalary(v);
                const isSelected = selectedId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleSelect(v.id)}
                    className={`w-full text-left px-5 py-5 transition-all flex items-start justify-between gap-3 group
                      ${isSelected ? 'bg-navy-950 text-white' : 'bg-white hover:bg-gray-50/80'}
                      ${idx > 0 ? 'border-t border-gray-100' : ''}
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border
                          ${isSelected
                            ? 'bg-white/10 text-white/80 border-white/20'
                            : (typeColor[v.type] ?? 'bg-gray-50 text-gray-500 border-gray-200')
                          }`}>
                          {v.type}
                        </span>
                      </div>
                      <h3 className={`font-bold text-base leading-snug ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {v.title}
                      </h3>
                      <p className={`text-sm mt-1 ${isSelected ? 'text-white/60' : 'text-gray-500'}`}>
                        {v.department}
                      </p>
                      <div className={`flex flex-wrap items-center gap-3 mt-2 text-xs ${isSelected ? 'text-white/50' : 'text-gray-400'}`}>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{v.location}
                        </span>
                        {salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />{salary}
                          </span>
                        )}
                        {v.deadline && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Closes {new Date(v.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-1 flex-shrink-0 transition-transform group-hover:translate-x-0.5
                      ${isSelected ? 'text-white/60' : 'text-gray-300 group-hover:text-gray-500'}`} />
                  </button>
                );
              })}
            </div>

            {/* ── Job Detail — Desktop sticky panel ── */}
            <div className="hidden lg:block lg:col-span-3 sticky top-[7.5rem] border border-gray-100 rounded-2xl overflow-hidden max-h-[calc(100vh-10rem)]">
              {selectedVacancy ? (
                <JobDetail vacancy={selectedVacancy} onApply={() => handleApply(selectedVacancy)} />
              ) : (
                <div className="flex flex-col items-center justify-center h-80 text-gray-300">
                  <Briefcase className="w-10 h-10 mb-3" />
                  <p className="text-sm">Select a role to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Job Detail Drawer ── */}
      {showDetail && selectedVacancy && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <JobDetail
              vacancy={selectedVacancy}
              onApply={() => { setShowDetail(false); handleApply(selectedVacancy); }}
              onClose={() => setShowDetail(false)}
            />
          </div>
        </div>
      )}

      {/* ── Apply Modal ── */}
      {applyVacancy && (
        <ApplyModal vacancy={applyVacancy} onClose={() => setApplyVacancy(null)} />
      )}

      {/* ── Footer ── */}
      <footer className="bg-navy-950 text-white mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded overflow-hidden">
              <img src="/WhatsApp_Image_2026-06-15_at_06.33.37.jpeg" alt="KORIX LLC" className="h-8 w-auto object-contain px-2 py-0.5" />
            </div>
            <span className="text-white/40 text-sm">Careers</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="mailto:admin@korixllc.com" className="hover:text-white transition flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> admin@korixllc.com
            </a>
            <button onClick={onBack} className="hover:text-white transition">Back to Website</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
