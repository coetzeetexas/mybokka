import { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  Zap,
  Target,
  Calendar,
  Upload,
  Shield,
  ChevronRight,
  AlertCircle,
  Loader2,
  FileText,
  X,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL as string,
      import.meta.env.VITE_SUPABASE_ANON_KEY as string
    );
  }
  return _supabase;
}

interface Props {
  onBack: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  // Personal
  full_name: string;
  age: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  // Work History
  employment_status: string;
  last_employer: string;
  last_job_title: string;
  years_experience: string;
  industries: string[];
  // Education
  highest_education: string;
  institution: string;
  field_of_study: string;
  certifications: string;
  // Skills
  technical_skills: string[];
  soft_skills: string[];
  languages: string[];
  other_skills: string;
  // Career Goals
  desired_job_type: string;
  desired_industry: string;
  desired_location: string;
  // Availability
  available_start_date: string;
  hours_per_week: string;
  willing_to_travel: boolean;
  // Consent
  consent_data_use: boolean;
  consent_communication: boolean;
}

const initialForm: FormData = {
  full_name: '', age: '', email: '', phone: '', address: '', city: '', state: '', zip: '',
  emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relation: '',
  employment_status: '', last_employer: '', last_job_title: '', years_experience: '', industries: [],
  highest_education: '', institution: '', field_of_study: '', certifications: '',
  technical_skills: [], soft_skills: [], languages: [], other_skills: '',
  desired_job_type: '', desired_industry: '', desired_location: '',
  available_start_date: '', hours_per_week: '', willing_to_travel: false,
  consent_data_use: false, consent_communication: false,
};

const INDUSTRY_OPTIONS = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Construction', 'Logistics', 'Hospitality', 'Government', 'Nonprofit', 'Other'];
const TECHNICAL_SKILL_OPTIONS = ['Microsoft Office', 'Data Entry', 'Customer Service', 'Project Management', 'Social Media', 'Coding / Programming', 'Accounting / Bookkeeping', 'Graphic Design', 'Sales / CRM Tools', 'AI Tools', 'Other'];
const SOFT_SKILL_OPTIONS = ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity', 'Attention to Detail'];
const LANGUAGE_OPTIONS = ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Portuguese', 'German', 'Hindi', 'Other'];

const steps = [
  { num: 1, label: 'Personal', icon: User },
  { num: 2, label: 'Experience', icon: Briefcase },
  { num: 3, label: 'Skills', icon: Zap },
  { num: 4, label: 'Goals', icon: Target },
  { num: 5, label: 'Finalize', icon: Shield },
];

function TagSelect({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter(s => s !== val) : [...selected, val]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
            selected.includes(opt)
              ? 'bg-navy-700 border-navy-700 text-white'
              : 'bg-white border-gray-200 text-gray-600 hover:border-navy-400 hover:text-navy-700'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-accent-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition bg-white text-sm";
const selectCls = inputCls + " cursor-pointer";

export function TrainingApplicationPage({ onBack }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (step === 1) {
      if (!form.full_name.trim()) e.full_name = 'Required';
      if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 16 || Number(form.age) > 80) e.age = 'Enter a valid age (16–80)';
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
      if (!form.phone.trim()) e.phone = 'Required';
      if (!form.address.trim()) e.address = 'Required';
      if (!form.city.trim()) e.city = 'Required';
      if (!form.state.trim()) e.state = 'Required';
      if (!form.zip.trim()) e.zip = 'Required';
      if (!form.emergency_contact_name.trim()) e.emergency_contact_name = 'Required';
      if (!form.emergency_contact_phone.trim()) e.emergency_contact_phone = 'Required';
      if (!form.emergency_contact_relation.trim()) e.emergency_contact_relation = 'Required';
    }
    if (step === 2) {
      if (!form.employment_status) e.employment_status = 'Required';
      if (!form.highest_education) e.highest_education = 'Required';
    }
    if (step === 4) {
      if (!form.desired_job_type) e.desired_job_type = 'Required';
      if (!form.desired_industry.trim()) e.desired_industry = 'Required';
      if (!form.desired_location.trim()) e.desired_location = 'Required';
      if (!form.available_start_date) e.available_start_date = 'Required';
      if (!form.hours_per_week) e.hours_per_week = 'Required';
    }
    if (step === 5) {
      if (!form.consent_data_use) e.consent_data_use = 'You must agree to continue';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep(s => (s < 5 ? (s + 1) as Step : s));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prev = () => {
    setStep(s => (s > 1 ? (s - 1) as Step : s));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File must be under 5MB'); return; }
    setCvFile(file);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      let cv_file_url: string | null = null;
      let cv_file_name: string | null = null;

      if (cvFile) {
        const ext = cvFile.name.split('.').pop();
        const path = `cvs/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await getSupabase().storage
          .from('training-cvs')
          .upload(path, cvFile, { contentType: cvFile.type });
        if (!uploadErr) {
          const { data } = getSupabase().storage.from('training-cvs').getPublicUrl(path);
          cv_file_url = data.publicUrl;
          cv_file_name = cvFile.name;
        }
      }

      const payload = {
        full_name: form.full_name.trim(),
        age: parseInt(form.age),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
        emergency_contact_name: form.emergency_contact_name.trim(),
        emergency_contact_phone: form.emergency_contact_phone.trim(),
        emergency_contact_relation: form.emergency_contact_relation.trim(),
        employment_status: form.employment_status,
        last_employer: form.last_employer || null,
        last_job_title: form.last_job_title || null,
        years_experience: form.years_experience ? parseInt(form.years_experience) : null,
        industries: form.industries,
        highest_education: form.highest_education,
        institution: form.institution || null,
        field_of_study: form.field_of_study || null,
        certifications: form.certifications || null,
        technical_skills: form.technical_skills,
        soft_skills: form.soft_skills,
        languages: form.languages,
        other_skills: form.other_skills || null,
        desired_job_type: form.desired_job_type,
        desired_industry: form.desired_industry.trim(),
        desired_location: form.desired_location.trim(),
        available_start_date: form.available_start_date,
        hours_per_week: form.hours_per_week,
        willing_to_travel: form.willing_to_travel,
        cv_file_url,
        cv_file_name,
        consent_data_use: form.consent_data_use,
        consent_communication: form.consent_communication,
      };

      const { error } = await getSupabase().from('training_applications').insert(payload);
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      setSubmitError('Something went wrong. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Application Submitted!</h1>
          <p className="text-white/70 mb-2">Thank you, <span className="text-white font-semibold">{form.full_name}</span>.</p>
          <p className="text-white/60 text-sm mb-8">
            We've received your training application and will review it shortly. Expect to hear from us within 3–5 business days at <span className="text-accent-400">{form.email}</span>.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to KORIX LLC
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header */}
      <header className="bg-navy-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            KORIX LLC
          </button>
          <div className="text-center">
            <div className="font-bold text-lg tracking-wide">Training Application</div>
            <div className="text-white/50 text-xs">Free Workforce Development Program</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs text-white/50">Step {step} of 5</div>
            <div className="text-xs text-accent-400 font-medium">{steps[step - 1].label}</div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-navy-800 h-1">
        <div
          className="h-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-500"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-10 gap-1 sm:gap-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.num;
            const active = step === s.num;
            return (
              <div key={s.num} className="flex items-center gap-1 sm:gap-2">
                <div className={`flex flex-col items-center gap-1`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    done ? 'bg-green-500 text-white' : active ? 'bg-navy-700 text-white ring-2 ring-navy-400 ring-offset-2' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${active ? 'text-navy-700' : done ? 'text-green-600' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-14 h-0.5 mb-4 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Step Header */}
          <div className="bg-gradient-to-r from-navy-900 to-navy-700 px-8 py-6">
            <h2 className="text-xl font-bold text-white">{stepTitle(step)}</h2>
            <p className="text-white/60 text-sm mt-1">{stepSubtitle(step)}</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {step === 1 && <Step1 form={form} set={set} errors={errors} />}
            {step === 2 && <Step2 form={form} set={set} errors={errors} />}
            {step === 3 && <Step3 form={form} set={set} />}
            {step === 4 && <Step4 form={form} set={set} errors={errors} cvFile={cvFile} fileRef={fileRef} onFileChange={handleFileChange} onRemoveFile={() => setCvFile(null)} />}
            {step === 5 && <Step5 form={form} set={set} errors={errors} cvFile={cvFile} />}

            {submitError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {submitError}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-2">
              <button
                onClick={prev}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              {step < 5 ? (
                <button
                  onClick={next}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-semibold transition text-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold transition disabled:opacity-60 text-sm"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Your data is encrypted and stored securely</div>
          <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Questions? contact@korixllc.com</div>
          <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> KORIX LLC — Dallas, TX</div>
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Personal Details ──────────────────────────────────────────────────
function Step1({ form, set, errors }: { form: FormData; set: (f: keyof FormData, v: unknown) => void; errors: Partial<Record<keyof FormData, string>> }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <input className={inputCls} placeholder="Jane Doe" value={form.full_name} onChange={e => set('full_name', e.target.value)} />
          {errors.full_name && <Err msg={errors.full_name} />}
        </Field>
        <Field label="Age" required>
          <input className={inputCls} type="number" placeholder="28" min={16} max={80} value={form.age} onChange={e => set('age', e.target.value)} />
          {errors.age && <Err msg={errors.age} />}
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email Address" required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className={inputCls + ' pl-10'} type="email" placeholder="jane@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          {errors.email && <Err msg={errors.email} />}
        </Field>
        <Field label="Phone Number" required>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className={inputCls + ' pl-10'} type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          {errors.phone && <Err msg={errors.phone} />}
        </Field>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Address</p>
        <div className="space-y-4">
          <Field label="Street Address" required>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className={inputCls + ' pl-10'} placeholder="123 Main St, Apt 4B" value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
            {errors.address && <Err msg={errors.address} />}
          </Field>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <Field label="City" required>
                <input className={inputCls} placeholder="Dallas" value={form.city} onChange={e => set('city', e.target.value)} />
                {errors.city && <Err msg={errors.city} />}
              </Field>
            </div>
            <Field label="State" required>
              <input className={inputCls} placeholder="TX" maxLength={2} value={form.state} onChange={e => set('state', e.target.value.toUpperCase())} />
              {errors.state && <Err msg={errors.state} />}
            </Field>
            <Field label="ZIP Code" required>
              <input className={inputCls} placeholder="75201" value={form.zip} onChange={e => set('zip', e.target.value)} />
              {errors.zip && <Err msg={errors.zip} />}
            </Field>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Emergency Contact</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Contact Name" required>
            <input className={inputCls} placeholder="John Doe" value={form.emergency_contact_name} onChange={e => set('emergency_contact_name', e.target.value)} />
            {errors.emergency_contact_name && <Err msg={errors.emergency_contact_name} />}
          </Field>
          <Field label="Contact Phone" required>
            <input className={inputCls} type="tel" placeholder="(555) 000-0000" value={form.emergency_contact_phone} onChange={e => set('emergency_contact_phone', e.target.value)} />
            {errors.emergency_contact_phone && <Err msg={errors.emergency_contact_phone} />}
          </Field>
          <Field label="Relationship" required>
            <input className={inputCls} placeholder="Parent / Sibling / Friend" value={form.emergency_contact_relation} onChange={e => set('emergency_contact_relation', e.target.value)} />
            {errors.emergency_contact_relation && <Err msg={errors.emergency_contact_relation} />}
          </Field>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Work History & Education ─────────────────────────────────────────
function Step2({ form, set, errors }: { form: FormData; set: (f: keyof FormData, v: unknown) => void; errors: Partial<Record<keyof FormData, string>> }) {
  return (
    <div className="space-y-6">
      <Field label="Current Employment Status" required>
        <select className={selectCls} value={form.employment_status} onChange={e => set('employment_status', e.target.value)}>
          <option value="">Select status</option>
          <option>Unemployed — seeking work</option>
          <option>Underemployed — part-time or low-wage</option>
          <option>Recently laid off</option>
          <option>Career changer</option>
          <option>Student / Recent graduate</option>
          <option>Returning to workforce</option>
        </select>
        {errors.employment_status && <Err msg={errors.employment_status} />}
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Last Employer" hint="Leave blank if first job">
          <input className={inputCls} placeholder="Company name" value={form.last_employer} onChange={e => set('last_employer', e.target.value)} />
        </Field>
        <Field label="Last Job Title">
          <input className={inputCls} placeholder="e.g. Sales Associate" value={form.last_job_title} onChange={e => set('last_job_title', e.target.value)} />
        </Field>
      </div>

      <Field label="Total Years of Work Experience">
        <select className={selectCls} value={form.years_experience} onChange={e => set('years_experience', e.target.value)}>
          <option value="">Select range</option>
          <option value="0">No prior experience</option>
          <option value="1">Less than 1 year</option>
          <option value="2">1–3 years</option>
          <option value="5">3–7 years</option>
          <option value="10">7–15 years</option>
          <option value="15">15+ years</option>
        </select>
      </Field>

      <Field label="Industries You've Worked In" hint="Select all that apply">
        <TagSelect options={INDUSTRY_OPTIONS} selected={form.industries} onChange={v => set('industries', v)} />
      </Field>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Education</p>
        <div className="space-y-4">
          <Field label="Highest Education Level" required>
            <select className={selectCls} value={form.highest_education} onChange={e => set('highest_education', e.target.value)}>
              <option value="">Select level</option>
              <option>Some high school</option>
              <option>High school diploma / GED</option>
              <option>Some college</option>
              <option>Associate's degree</option>
              <option>Bachelor's degree</option>
              <option>Master's degree</option>
              <option>Doctoral degree</option>
              <option>Vocational / Trade certificate</option>
            </select>
            {errors.highest_education && <Err msg={errors.highest_education} />}
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Institution Name">
              <input className={inputCls} placeholder="e.g. Dallas College" value={form.institution} onChange={e => set('institution', e.target.value)} />
            </Field>
            <Field label="Field of Study">
              <input className={inputCls} placeholder="e.g. Business Administration" value={form.field_of_study} onChange={e => set('field_of_study', e.target.value)} />
            </Field>
          </div>
          <Field label="Certifications or Licenses" hint="List any professional certifications">
            <textarea
              className={inputCls + ' resize-none'}
              rows={2}
              placeholder="e.g. CompTIA A+, ServSafe, Forklift Operator..."
              value={form.certifications}
              onChange={e => set('certifications', e.target.value)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Skills ────────────────────────────────────────────────────────────
function Step3({ form, set }: { form: FormData; set: (f: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <Field label="Technical Skills" hint="Select all that apply">
        <TagSelect options={TECHNICAL_SKILL_OPTIONS} selected={form.technical_skills} onChange={v => set('technical_skills', v)} />
      </Field>
      <Field label="Soft Skills" hint="Select all that apply">
        <TagSelect options={SOFT_SKILL_OPTIONS} selected={form.soft_skills} onChange={v => set('soft_skills', v)} />
      </Field>
      <Field label="Languages Spoken" hint="Select all that apply">
        <TagSelect options={LANGUAGE_OPTIONS} selected={form.languages} onChange={v => set('languages', v)} />
      </Field>
      <Field label="Other Skills or Abilities" hint="Describe any additional relevant skills">
        <textarea
          className={inputCls + ' resize-none'}
          rows={3}
          placeholder="e.g. Bilingual in English and Spanish, CDL Class A license, experienced in conflict resolution..."
          value={form.other_skills}
          onChange={e => set('other_skills', e.target.value)}
        />
      </Field>
    </div>
  );
}

// ── Step 4: Career Goals & Availability ──────────────────────────────────────
function Step4({
  form, set, errors, cvFile, fileRef, onFileChange, onRemoveFile,
}: {
  form: FormData;
  set: (f: keyof FormData, v: unknown) => void;
  errors: Partial<Record<keyof FormData, string>>;
  cvFile: File | null;
  fileRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Desired Job Type" required>
          <select className={selectCls} value={form.desired_job_type} onChange={e => set('desired_job_type', e.target.value)}>
            <option value="">Select type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract / Freelance</option>
            <option>Internship / Apprenticeship</option>
            <option>Remote</option>
            <option>Open to any</option>
          </select>
          {errors.desired_job_type && <Err msg={errors.desired_job_type} />}
        </Field>
        <Field label="Desired Industry" required>
          <input className={inputCls} placeholder="e.g. Technology, Healthcare..." value={form.desired_industry} onChange={e => set('desired_industry', e.target.value)} />
          {errors.desired_industry && <Err msg={errors.desired_industry} />}
        </Field>
      </div>

      <Field label="Preferred Work Location" required>
        <input className={inputCls} placeholder="City, State or 'Remote'" value={form.desired_location} onChange={e => set('desired_location', e.target.value)} />
        {errors.desired_location && <Err msg={errors.desired_location} />}
      </Field>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Availability</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Available Start Date" required>
            <input className={inputCls} type="date" value={form.available_start_date} onChange={e => set('available_start_date', e.target.value)} />
            {errors.available_start_date && <Err msg={errors.available_start_date} />}
          </Field>
          <Field label="Hours Available Per Week" required>
            <select className={selectCls} value={form.hours_per_week} onChange={e => set('hours_per_week', e.target.value)}>
              <option value="">Select range</option>
              <option>Less than 10 hrs</option>
              <option>10–20 hrs (part-time)</option>
              <option>20–30 hrs</option>
              <option>30–40 hrs (full-time)</option>
              <option>Flexible / Any</option>
            </select>
            {errors.hours_per_week && <Err msg={errors.hours_per_week} />}
          </Field>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set('willing_to_travel', !form.willing_to_travel)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                form.willing_to_travel ? 'bg-navy-700 border-navy-700' : 'border-gray-300 group-hover:border-navy-400'
              }`}
            >
              {form.willing_to_travel && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-gray-700">I am willing to travel for work if required</span>
          </label>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Resume / CV Upload</p>
        {!cvFile ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-navy-400 rounded-2xl p-8 text-center cursor-pointer transition-all group"
          >
            <Upload className="w-8 h-8 text-gray-300 group-hover:text-navy-400 mx-auto mb-3 transition-colors" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-navy-700 transition-colors">Click to upload your Resume or CV</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — max 5MB</p>
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={onFileChange} />
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-navy-50 border border-navy-200 rounded-xl">
            <FileText className="w-8 h-8 text-navy-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy-800 truncate">{cvFile.name}</p>
              <p className="text-xs text-navy-500">{(cvFile.size / 1024).toFixed(0)} KB</p>
            </div>
            <button onClick={onRemoveFile} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">Optional but strongly recommended. You may also email your CV to contact@korixllc.com.</p>
      </div>
    </div>
  );
}

// ── Step 5: Consent & Review ──────────────────────────────────────────────────
function Step5({
  form, set, errors, cvFile,
}: {
  form: FormData;
  set: (f: keyof FormData, v: unknown) => void;
  errors: Partial<Record<keyof FormData, string>>;
  cvFile: File | null;
}) {
  const reviewItems = [
    { label: 'Name', value: form.full_name },
    { label: 'Email', value: form.email },
    { label: 'Phone', value: form.phone },
    { label: 'Location', value: [form.city, form.state].filter(Boolean).join(', ') },
    { label: 'Employment Status', value: form.employment_status },
    { label: 'Highest Education', value: form.highest_education },
    { label: 'Desired Job Type', value: form.desired_job_type },
    { label: 'Desired Industry', value: form.desired_industry },
    { label: 'Available From', value: form.available_start_date },
    { label: 'CV / Resume', value: cvFile ? cvFile.name : 'Not uploaded' },
  ];

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Review Your Application</p>
        <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 overflow-hidden border border-gray-100">
          {reviewItems.map(item => (
            <div key={item.label} className="flex justify-between items-center px-4 py-2.5 text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="text-gray-900 font-medium text-right max-w-[60%] truncate">{item.value || '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 leading-relaxed">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Data Privacy Notice:</strong> Your information is collected solely for the purpose of evaluating your eligibility for KORIX LLC's workforce training program. We store your data securely and do not sell or share it with third parties without your consent. You may request deletion of your data at any time by emailing contact@korixllc.com. This complies with applicable CCPA regulations.
          </div>
        </div>
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => set('consent_data_use', !form.consent_data_use)}
            className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              form.consent_data_use ? 'bg-navy-700 border-navy-700' : 'border-gray-300 group-hover:border-navy-400'
            }`}
          >
            {form.consent_data_use && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className="text-sm text-gray-700">
            <span className="font-semibold">I consent</span> to KORIX LLC collecting, storing, and processing my personal information and CV for the purpose of this training program application. <span className="text-accent-500">*</span>
          </span>
        </label>
        {errors.consent_data_use && <div className="ml-8"><Err msg={errors.consent_data_use} /></div>}

        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => set('consent_communication', !form.consent_communication)}
            className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              form.consent_communication ? 'bg-navy-700 border-navy-700' : 'border-gray-300 group-hover:border-navy-400'
            }`}
          >
            {form.consent_communication && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className="text-sm text-gray-700">
            I agree to receive follow-up communications from KORIX LLC via email and/or phone regarding my application and related training opportunities. (Optional)
          </span>
        </label>
      </div>

      {/* CTA hint */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <ChevronRight className="w-3.5 h-3.5" />
        <span>Click <strong className="text-gray-600">Submit Application</strong> below. We'll be in touch within 3–5 business days.</span>
      </div>
    </div>
  );
}

function Err({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
      <AlertCircle className="w-3 h-3" />
      {msg}
    </div>
  );
}

function stepTitle(step: Step) {
  return ['Personal Details', 'Work History & Education', 'Skills & Abilities', 'Career Goals & Availability', 'Review & Consent'][step - 1];
}

function stepSubtitle(step: Step) {
  return [
    'Tell us about yourself and how to reach you.',
    'Share your work background and education level.',
    'Highlight the skills and languages you bring.',
    'Describe your goals, availability, and upload your CV.',
    'Review your application and agree to our data terms.',
  ][step - 1];
}
