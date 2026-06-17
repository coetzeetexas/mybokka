import { useState, useEffect, useCallback } from 'react';
import {
  Cloud, Globe, Shield, BarChart3, Zap, Mail, Settings, Cpu, Layers,
  Wifi, Image, DollarSign, AlertCircle, Loader2, RefreshCw, ChevronRight,
  Trash2, Plus, CheckCircle2, XCircle, Copy, ExternalLink, Lock, Radio,
  Server, Activity,
} from 'lucide-react';

// ── API helper ────────────────────────────────────────────────────────────────
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://ebjszgjbhbhxillmywbv.supabase.co';
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVianN6Z2piaGJoeGlsbG15d2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDU2MzQsImV4cCI6MjA5NzA4MTYzNH0.Km6m5lOj6EKhqKa1Cv3uyC7aCuuY7TQV7ofEtWElbVY';

class CfConfigError extends Error { constructor() { super('not-configured'); } }

async function cfFetch<T = unknown>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/cloudflare-proxy`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path, method, body }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error === 'CLOUDFLARE_API_TOKEN not configured') throw new CfConfigError();
  return data as T;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface CfZone { id: string; name: string; status: string; plan: { name: string }; }
interface CfDnsRecord { id: string; type: string; name: string; content: string; ttl: number; proxied: boolean; }
interface CfFirewallRule { id: string; description: string; action: string; filter: { expression: string }; paused: boolean; }
interface CfWorkerScript { id: string; etag: string; created_on: string; modified_on: string; }
interface CfPageRule { id: string; status: string; targets: { target: string; constraint: { value: string } }[]; actions: { id: string; value: unknown }[]; }
interface CfAccessApp { id: string; name: string; domain: string; type: string; created_at: string; }
interface CfEmailRule { id: string; name: string; enabled: boolean; matchers: { field: string; type: string; value: string }[]; actions: { type: string; value: string[] }[]; }

type Section =
  | 'account' | 'dns' | 'security' | 'rules' | 'zerotrust'
  | 'analytics' | 'network' | 'media' | 'email' | 'cache' | 'workers';

// ── Shared UI ─────────────────────────────────────────────────────────────────
const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 bg-white';
const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

function SectionHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100">
      <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="font-bold text-gray-900 text-base">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
    </div>
  );
}

function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p className="text-sm text-gray-600 text-center max-w-xs">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-medium">
          <RefreshCw className="w-3.5 h-3.5" />Retry
        </button>
      )}
    </div>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return <div className="text-center py-10 text-sm text-gray-400">{label}</div>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button onClick={copy} className="p-1 text-gray-400 hover:text-gray-600 transition">
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function Tag({ label, color = 'gray' }: { label: string; color?: 'gray' | 'green' | 'red' | 'orange' | 'blue' }) {
  const cls: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-50 text-green-700 border border-green-200',
    red: 'bg-red-50 text-red-700 border border-red-200',
    orange: 'bg-orange-50 text-orange-700 border border-orange-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls[color]}`}>{label}</span>;
}

// ── Zone Selector ─────────────────────────────────────────────────────────────
function ZoneSelector({ zones, selected, onChange }: {
  zones: CfZone[]; selected: string; onChange: (id: string) => void;
}) {
  if (zones.length === 0) return null;
  return (
    <div className="mb-4">
      <label className={labelCls}>Zone / Domain</label>
      <select value={selected} onChange={e => onChange(e.target.value)}
        className={inputCls + ' max-w-xs'}>
        {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
      </select>
    </div>
  );
}

// ── Not Configured Screen ─────────────────────────────────────────────────────
function NotConfigured() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 gap-4 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
        <Cloud className="w-8 h-8 text-orange-400" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">Cloudflare Not Connected</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          To connect your Cloudflare account, add these two secrets in your Bolt project settings under
          <span className="font-semibold"> Environment Variables</span>:
        </p>
      </div>
      <div className="w-full max-w-sm space-y-2 text-left">
        {[
          { key: 'CLOUDFLARE_API_TOKEN', hint: 'Your API token (e.g. bitter-butterfly-9039 value)' },
          { key: 'CLOUDFLARE_ACCOUNT_ID', hint: 'Found in Cloudflare dashboard → right sidebar' },
        ].map(s => (
          <div key={s.key} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">{s.key}</code>
              <CopyButton text={s.key} />
            </div>
            <p className="text-xs text-gray-500">{s.hint}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">After saving secrets, refresh the page.</p>
    </div>
  );
}

// ── Section: Account & Billing ────────────────────────────────────────────────
function AccountSection({ accountId }: { accountId: string | null }) {
  const [account, setAccount] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const path = accountId ? `/accounts/${accountId}` : '/accounts';
      const data = await cfFetch<{ result: unknown; success: boolean }>(path);
      setAccount(accountId ? (data as { result: unknown }).result : (data as { result: unknown[] }).result);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [accountId]);

  useEffect(() => { load(); }, [load]);

  const renderField = (label: string, value: unknown) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'object') return null;
    return (
      <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
        <span className="text-sm text-gray-500 capitalize">{label.replace(/_/g, ' ')}</span>
        <span className="text-sm font-medium text-gray-900 text-right ml-4">{String(value)}</span>
      </div>
    );
  };

  return (
    <div>
      <SectionHeader title="Account & Billing" subtitle="Cloudflare account details and subscription information"
        icon={<DollarSign className="w-5 h-5" />} />
      {loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> : (
        <div className="space-y-4">
          {Array.isArray(account) ? (
            account.map((acc: Record<string, unknown>) => (
              <div key={String(acc.id)} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-gray-900">{String(acc.name ?? 'Account')}</span>
                  <Tag label={String(acc.type ?? 'standard')} color="orange" />
                </div>
                {Object.entries(acc).filter(([k]) => !['settings', 'legacy_flags', 'type'].includes(k))
                  .map(([k, v]) => renderField(k, v))}
              </div>
            ))
          ) : account ? (
            <div className="bg-gray-50 rounded-xl p-4">
              {Object.entries(account as Record<string, unknown>)
                .filter(([k]) => !['settings', 'legacy_flags'].includes(k))
                .map(([k, v]) => renderField(k, v))}
            </div>
          ) : <EmptyBlock label="No account data found" />}
        </div>
      )}
    </div>
  );
}

// ── Section: DNS & Zones ──────────────────────────────────────────────────────
function DnsSection({ zones }: { zones: CfZone[] }) {
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '');
  const [records, setRecords] = useState<CfDnsRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newRec, setNewRec] = useState({ type: 'A', name: '', content: '', ttl: 1, proxied: false });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!zoneId) return;
    setLoading(true); setError('');
    try {
      const data = await cfFetch<{ result: CfDnsRecord[] }>(`/zones/${zoneId}/dns_records?per_page=100`);
      setRecords(data.result ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [zoneId]);

  useEffect(() => { load(); }, [load]);

  const addRecord = async () => {
    setSaving(true);
    try {
      await cfFetch(`/zones/${zoneId}/dns_records`, 'POST', newRec);
      setShowAdd(false);
      setNewRec({ type: 'A', name: '', content: '', ttl: 1, proxied: false });
      await load();
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed to add record'); }
    finally { setSaving(false); }
  };

  const deleteRecord = async (id: string) => {
    if (!confirm('Delete this DNS record?')) return;
    try {
      await cfFetch(`/zones/${zoneId}/dns_records/${id}`, 'DELETE');
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
  };

  const typeColor: Record<string, 'blue' | 'green' | 'orange' | 'gray'> = {
    A: 'blue', AAAA: 'blue', CNAME: 'green', MX: 'orange', TXT: 'gray', NS: 'gray',
  };

  return (
    <div>
      <SectionHeader title="DNS & Zones" subtitle="Manage DNS records for your domains" icon={<Globe className="w-5 h-5" />} />
      <ZoneSelector zones={zones} selected={zoneId} onChange={setZoneId} />
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-gray-500">{records.length} records</span>
        <button onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition">
          <Plus className="w-3.5 h-3.5" />Add Record
        </button>
      </div>

      {showAdd && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 space-y-3">
          <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wider">New DNS Record</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={newRec.type} onChange={e => setNewRec(p => ({ ...p, type: e.target.value }))}>
                {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Name</label>
              <input className={inputCls} placeholder="@ or subdomain" value={newRec.name}
                onChange={e => setNewRec(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Content / Value</label>
              <input className={inputCls} placeholder="IP address or hostname" value={newRec.content}
                onChange={e => setNewRec(p => ({ ...p, content: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>TTL</label>
              <select className={inputCls} value={newRec.ttl} onChange={e => setNewRec(p => ({ ...p, ttl: parseInt(e.target.value) }))}>
                <option value={1}>Auto</option>
                <option value={60}>1 min</option>
                <option value={300}>5 min</option>
                <option value={3600}>1 hr</option>
                <option value={86400}>1 day</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" id="proxied" checked={newRec.proxied}
                onChange={e => setNewRec(p => ({ ...p, proxied: e.target.checked }))} className="rounded" />
              <label htmlFor="proxied" className="text-sm text-gray-700">Proxied (orange cloud)</label>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowAdd(false)}
              className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
            <button onClick={addRecord} disabled={saving || !newRec.name || !newRec.content}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Save
            </button>
          </div>
        </div>
      )}

      {loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> : records.length === 0 ? <EmptyBlock label="No DNS records found" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Type', 'Name', 'Content', 'TTL', 'Proxy', ''].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5"><Tag label={r.type} color={typeColor[r.type] ?? 'gray'} /></td>
                  <td className="px-3 py-2.5 font-mono text-xs text-gray-700 max-w-[140px] truncate">{r.name}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-gray-600 max-w-[180px] truncate">
                    <div className="flex items-center gap-1">{r.content}<CopyButton text={r.content} /></div>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-gray-500">{r.ttl === 1 ? 'Auto' : `${r.ttl}s`}</td>
                  <td className="px-3 py-2.5">
                    {r.proxied
                      ? <span className="text-orange-500 font-bold text-xs">ON</span>
                      : <span className="text-gray-400 text-xs">OFF</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => deleteRecord(r.id)} className="p-1 text-gray-300 hover:text-red-500 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Section: App Security ─────────────────────────────────────────────────────
function SecuritySection({ zones }: { zones: CfZone[] }) {
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '');
  const [rules, setRules] = useState<CfFirewallRule[]>([]);
  const [events, setEvents] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!zoneId) return;
    setLoading(true); setError('');
    try {
      const [rulesData, eventsData] = await Promise.all([
        cfFetch<{ result: CfFirewallRule[] }>(`/zones/${zoneId}/firewall/rules`),
        cfFetch<{ result: unknown[] }>(`/zones/${zoneId}/firewall/events?per_page=20`),
      ]);
      setRules(rulesData.result ?? []);
      setEvents(eventsData.result ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [zoneId]);

  useEffect(() => { load(); }, [load]);

  const actionColor: Record<string, 'green' | 'red' | 'orange' | 'blue'> = {
    allow: 'green', block: 'red', challenge: 'orange', js_challenge: 'orange', managed_challenge: 'blue',
  };

  return (
    <div>
      <SectionHeader title="App Security" subtitle="Firewall rules and recent security events" icon={<Shield className="w-5 h-5" />} />
      <ZoneSelector zones={zones} selected={zoneId} onChange={setZoneId} />
      {loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> : (
        <div className="space-y-5">
          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Firewall Rules ({rules.length})</h3>
            {rules.length === 0 ? <EmptyBlock label="No firewall rules configured" /> : (
              <div className="space-y-2">
                {rules.map(r => (
                  <div key={r.id} className="bg-gray-50 rounded-xl p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">{r.description || 'Unnamed rule'}</span>
                        {r.paused && <Tag label="Paused" color="gray" />}
                      </div>
                      <code className="text-xs text-gray-500 truncate block">{r.filter?.expression}</code>
                    </div>
                    <Tag label={r.action} color={actionColor[r.action] ?? 'gray'} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Recent Events ({events.length})</h3>
            {events.length === 0 ? <EmptyBlock label="No recent firewall events" /> : (
              <div className="space-y-1.5">
                {events.slice(0, 15).map((ev: unknown, i) => {
                  const e = ev as Record<string, unknown>;
                  return (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Tag label={String(e.action ?? '—')} color={e.action === 'block' ? 'red' : 'orange'} />
                        <span className="text-gray-600 font-mono">{String(e.client_ip ?? '—')}</span>
                        <span className="text-gray-400">{String(e.client_country ?? '')}</span>
                      </div>
                      <span className="text-gray-400">{e.occurred_at ? new Date(String(e.occurred_at)).toLocaleTimeString() : '—'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section: Analytics & Logs ─────────────────────────────────────────────────
function AnalyticsSection({ zones }: { zones: CfZone[] }) {
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '');
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!zoneId) return;
    setLoading(true); setError('');
    try {
      const data = await cfFetch<{ result: Record<string, unknown> }>(
        `/zones/${zoneId}/analytics/dashboard?since=-43200&until=0&continuous=true`
      );
      setAnalytics(data.result);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [zoneId]);

  useEffect(() => { load(); }, [load]);

  const fmtBytes = (b: number) => b > 1e9 ? `${(b / 1e9).toFixed(2)} GB` : b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${(b / 1e3).toFixed(0)} KB`;

  const totals = analytics && typeof analytics.totals === 'object' ? analytics.totals as Record<string, Record<string, number>> : null;

  return (
    <div>
      <SectionHeader title="Analytics & Logs" subtitle="Traffic, bandwidth, threats and page views (last 12 hours)" icon={<BarChart3 className="w-5 h-5" />} />
      <ZoneSelector zones={zones} selected={zoneId} onChange={setZoneId} />
      {loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> : !totals ? <EmptyBlock label="No analytics data" /> : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Requests', value: totals.requests?.all?.toLocaleString() ?? '—', icon: <Activity className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50' },
              { label: 'Bandwidth', value: totals.bandwidth?.all ? fmtBytes(totals.bandwidth.all) : '—', icon: <Wifi className="w-4 h-4" />, color: 'text-green-600 bg-green-50' },
              { label: 'Threats', value: totals.threats?.all?.toLocaleString() ?? '—', icon: <Shield className="w-4 h-4" />, color: 'text-red-600 bg-red-50' },
              { label: 'Unique Visitors', value: totals.uniques?.all?.toLocaleString() ?? '—', icon: <Globe className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
            ].map(m => (
              <div key={m.label} className="bg-gray-50 rounded-xl p-4">
                <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center mb-2`}>{m.icon}</div>
                <div className="text-xl font-bold text-gray-900">{m.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {totals.requests && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Request Breakdown</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-500 text-xs">Cached</span><div className="font-semibold text-green-700">{totals.requests.cached?.toLocaleString() ?? '—'}</div></div>
                <div><span className="text-gray-500 text-xs">Uncached</span><div className="font-semibold text-orange-700">{totals.requests.uncached?.toLocaleString() ?? '—'}</div></div>
                <div><span className="text-gray-500 text-xs">SSL</span><div className="font-semibold text-blue-700">{totals.requests.ssl?.encrypted?.toLocaleString() ?? '—'}</div></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Section: Cache & Performance ──────────────────────────────────────────────
function CacheSection({ zones }: { zones: CfZone[] }) {
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '');
  const [mode, setMode] = useState<'all' | 'url'>('all');
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const purge = async () => {
    setLoading(true); setResult(null);
    try {
      const body = mode === 'all' ? { purge_everything: true } : { files: urls.split('\n').map(u => u.trim()).filter(Boolean) };
      const data = await cfFetch<{ success: boolean; errors: unknown[] }>(`/zones/${zoneId}/purge_cache`, 'POST', body);
      setResult({ ok: data.success, message: data.success ? 'Cache purged successfully.' : `Error: ${JSON.stringify(data.errors)}` });
    } catch (e) { setResult({ ok: false, message: e instanceof Error ? e.message : 'Failed' }); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <SectionHeader title="Cache & Performance" subtitle="Purge cached content from Cloudflare's edge network" icon={<Zap className="w-5 h-5" />} />
      <ZoneSelector zones={zones} selected={zoneId} onChange={setZoneId} />
      <div className="max-w-md space-y-4">
        <div>
          <label className={labelCls}>Purge Mode</label>
          <div className="flex gap-2">
            {(['all', 'url'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                  mode === m ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {m === 'all' ? 'Purge Everything' : 'Purge by URL'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'url' && (
          <div>
            <label className={labelCls}>URLs to purge (one per line)</label>
            <textarea className={inputCls + ' resize-none'} rows={4} value={urls} onChange={e => setUrls(e.target.value)}
              placeholder="https://yourdomain.com/page&#10;https://yourdomain.com/image.jpg" />
          </div>
        )}

        {mode === 'all' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            This will purge ALL cached content for the selected zone. Visitors may experience slower load times until content is re-cached.
          </div>
        )}

        {result && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${result.ok ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {result.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {result.message}
          </div>
        )}

        <button onClick={purge} disabled={loading || !zoneId || (mode === 'url' && !urls.trim())}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Purging...' : 'Purge Cache'}
        </button>
      </div>
    </div>
  );
}

// ── Section: Rules & Configuration ────────────────────────────────────────────
function RulesSection({ zones }: { zones: CfZone[] }) {
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '');
  const [pageRules, setPageRules] = useState<CfPageRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!zoneId) return;
    setLoading(true); setError('');
    try {
      const data = await cfFetch<{ result: CfPageRule[] }>(`/zones/${zoneId}/pagerules?status=active`);
      setPageRules(data.result ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [zoneId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionHeader title="Rules & Configuration" subtitle="Page rules and zone configuration" icon={<Settings className="w-5 h-5" />} />
      <ZoneSelector zones={zones} selected={zoneId} onChange={setZoneId} />
      {loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> : pageRules.length === 0 ? <EmptyBlock label="No page rules configured" /> : (
        <div className="space-y-3">
          {pageRules.map(r => (
            <div key={r.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag label={r.status} color={r.status === 'active' ? 'green' : 'gray'} />
                <code className="text-xs text-gray-700 font-mono">{r.targets?.[0]?.constraint?.value ?? '—'}</code>
              </div>
              <div className="flex flex-wrap gap-2">
                {r.actions?.map((a, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-medium">
                    {a.id}: {typeof a.value === 'object' ? JSON.stringify(a.value) : String(a.value)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section: Zero Trust ───────────────────────────────────────────────────────
function ZeroTrustSection({ accountId }: { accountId: string | null }) {
  const [apps, setApps] = useState<CfAccessApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!accountId) return;
    setLoading(true); setError('');
    try {
      const data = await cfFetch<{ result: CfAccessApp[] }>(`/accounts/${accountId}/access/apps`);
      setApps(data.result ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [accountId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionHeader title="Cloudflare One / Zero Trust" subtitle="Access applications and tunnel configurations" icon={<Lock className="w-5 h-5" />} />
      {!accountId ? <ErrorBlock message="Account ID required for Zero Trust." /> :
        loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> :
          apps.length === 0 ? <EmptyBlock label="No Access applications configured" /> : (
            <div className="space-y-3">
              {apps.map(a => (
                <div key={a.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{a.name}</span>
                      <Tag label={a.type} color="blue" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ExternalLink className="w-3 h-3" />{a.domain}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}

// ── Section: Network Services ─────────────────────────────────────────────────
function NetworkSection({ zones }: { zones: CfZone[] }) {
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '');
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const keys = ['http2', 'http3', 'ipv6', 'websockets', 'opportunistic_onion', 'pseudo_ipv4', 'ip_geolocation'];

  const load = useCallback(async () => {
    if (!zoneId) return;
    setLoading(true); setError('');
    try {
      const results = await Promise.allSettled(
        keys.map(k => cfFetch<{ result: { value: unknown } }>(`/zones/${zoneId}/settings/${k}`))
      );
      const map: Record<string, unknown> = {};
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') map[keys[i]] = r.value.result?.value;
      });
      setSettings(map);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [zoneId]);

  useEffect(() => { load(); }, [load]);

  const labels: Record<string, string> = {
    http2: 'HTTP/2', http3: 'HTTP/3 (QUIC)', ipv6: 'IPv6 Compatibility',
    websockets: 'WebSockets', opportunistic_onion: 'Onion Routing',
    pseudo_ipv4: 'Pseudo IPv4', ip_geolocation: 'IP Geolocation',
  };

  return (
    <div>
      <SectionHeader title="Network Services" subtitle="Network protocol and routing settings for your zone" icon={<Radio className="w-5 h-5" />} />
      <ZoneSelector zones={zones} selected={zoneId} onChange={setZoneId} />
      {loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> : (
        <div className="bg-gray-50 rounded-xl overflow-hidden">
          {keys.map((k, i) => (
            <div key={k} className={`flex items-center justify-between px-4 py-3 ${i < keys.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-700">{labels[k]}</span>
              </div>
              {settings[k] === undefined ? (
                <span className="text-xs text-gray-400">—</span>
              ) : (
                <Tag
                  label={String(settings[k]).toUpperCase()}
                  color={settings[k] === 'on' || settings[k] === true ? 'green' : 'gray'}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section: Developer Platform (Workers) ─────────────────────────────────────
function WorkersSection({ accountId }: { accountId: string | null }) {
  const [scripts, setScripts] = useState<CfWorkerScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!accountId) return;
    setLoading(true); setError('');
    try {
      const data = await cfFetch<{ result: CfWorkerScript[] }>(`/accounts/${accountId}/workers/scripts`);
      setScripts(data.result ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [accountId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionHeader title="Developer Platform" subtitle="Cloudflare Workers scripts deployed to your account" icon={<Cpu className="w-5 h-5" />} />
      {!accountId ? <ErrorBlock message="Account ID required for Workers." /> :
        loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> :
          scripts.length === 0 ? <EmptyBlock label="No Workers scripts deployed" /> : (
            <div className="space-y-2">
              {scripts.map(s => (
                <div key={s.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{s.id}</p>
                      <p className="text-xs text-gray-400">Modified {new Date(s.modified_on).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Tag label="Deployed" color="green" />
                </div>
              ))}
            </div>
          )}
    </div>
  );
}

// ── Section: Email & Messaging ────────────────────────────────────────────────
function EmailSection({ accountId }: { accountId: string | null }) {
  const [rules, setRules] = useState<CfEmailRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!accountId) return;
    setLoading(true); setError('');
    try {
      const data = await cfFetch<{ result: CfEmailRule[] }>(`/accounts/${accountId}/email/routing/rules`);
      setRules(data.result ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [accountId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionHeader title="Email & Messaging" subtitle="Email routing rules configured for your account" icon={<Mail className="w-5 h-5" />} />
      {!accountId ? <ErrorBlock message="Account ID required for email routing." /> :
        loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> :
          rules.length === 0 ? <EmptyBlock label="No email routing rules configured" /> : (
            <div className="space-y-3">
              {rules.map(r => (
                <div key={r.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-sm text-gray-900">{r.name}</span>
                    <Tag label={r.enabled ? 'Enabled' : 'Disabled'} color={r.enabled ? 'green' : 'gray'} />
                  </div>
                  <div className="space-y-1">
                    {r.matchers?.map((m, i) => (
                      <div key={i} className="text-xs text-gray-500">
                        If <span className="font-medium text-gray-700">{m.field}</span> {m.type} <code className="bg-gray-100 px-1 rounded">{m.value}</code>
                      </div>
                    ))}
                    {r.actions?.map((a, i) => (
                      <div key={i} className="text-xs text-gray-500">
                        → <span className="font-medium text-blue-700">{a.type}</span>: {a.value?.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}

// ── Section: Media ────────────────────────────────────────────────────────────
function MediaSection({ accountId }: { accountId: string | null }) {
  const [images, setImages] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!accountId) return;
    setLoading(true); setError('');
    try {
      const data = await cfFetch<{ result: { images: unknown[] } }>(`/accounts/${accountId}/images/v1`);
      setImages(data.result?.images ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }, [accountId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <SectionHeader title="Media" subtitle="Cloudflare Images stored in your account" icon={<Image className="w-5 h-5" />} />
      {!accountId ? <ErrorBlock message="Account ID required for media." /> :
        loading ? <LoadingBlock /> : error ? <ErrorBlock message={error} onRetry={load} /> :
          images.length === 0 ? <EmptyBlock label="No images uploaded to Cloudflare Images" /> : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.slice(0, 20).map((img: unknown) => {
                const i = img as Record<string, unknown>;
                const variants = Array.isArray(i.variants) ? i.variants as string[] : [];
                return (
                  <div key={String(i.id)} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    {variants[0] ? (
                      <img src={variants[0]} alt={String(i.filename ?? '')} className="w-full h-24 object-cover" />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center bg-gray-100">
                        <Image className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{String(i.filename ?? i.id)}</p>
                      <p className="text-xs text-gray-400">{i.uploaded ? new Date(String(i.uploaded)).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
    </div>
  );
}

// ── Section: Other ────────────────────────────────────────────────────────────
function OtherSection({ zones, accountId }: { zones: CfZone[]; accountId: string | null }) {
  return (
    <div>
      <SectionHeader title="Other" subtitle="Zone overview and miscellaneous account information" icon={<Layers className="w-5 h-5" />} />
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Zones ({zones.length})</h3>
        {zones.length === 0 ? <EmptyBlock label="No zones found" /> : (
          <div className="space-y-2">
            {zones.map(z => (
              <div key={z.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{z.name}</p>
                    <p className="text-xs text-gray-400">{z.plan?.name ?? 'Free'} plan</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag label={z.status} color={z.status === 'active' ? 'green' : 'orange'} />
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono text-gray-400 hidden sm:block">{z.id}</span>
                    <CopyButton text={z.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {accountId && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Account ID</h4>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-gray-700">{accountId}</code>
              <CopyButton text={accountId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────
export function CloudflarePanel() {
  const [section, setSection] = useState<Section>('analytics');
  const [zones, setZones] = useState<CfZone[]>([]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await cfFetch<{ result: CfZone[] & { _accountId?: string }; _accountId?: string }>('/zones?per_page=50');
        if (data._accountId) setAccountId(data._accountId);
        setZones(data.result ?? []);
      } catch (e) {
        if (e instanceof CfConfigError) setNotConfigured(true);
      } finally {
        setLoadingInit(false);
      }
    })();
  }, []);

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'analytics',  label: 'Analytics & Logs',         icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'dns',        label: 'DNS & Zones',               icon: <Globe className="w-4 h-4" /> },
    { id: 'security',   label: 'App Security',              icon: <Shield className="w-4 h-4" /> },
    { id: 'cache',      label: 'Cache & Performance',       icon: <Zap className="w-4 h-4" /> },
    { id: 'rules',      label: 'Rules & Configuration',     icon: <Settings className="w-4 h-4" /> },
    { id: 'network',    label: 'Network Services',          icon: <Radio className="w-4 h-4" /> },
    { id: 'zerotrust',  label: 'Zero Trust',                icon: <Lock className="w-4 h-4" /> },
    { id: 'workers',    label: 'Developer Platform',        icon: <Cpu className="w-4 h-4" /> },
    { id: 'email',      label: 'Email & Messaging',         icon: <Mail className="w-4 h-4" /> },
    { id: 'media',      label: 'Media',                     icon: <Image className="w-4 h-4" /> },
    { id: 'account',    label: 'Account & Billing',         icon: <DollarSign className="w-4 h-4" /> },
    { id: 'other',      label: 'Other',                     icon: <Layers className="w-4 h-4" /> },
  ];

  if (loadingInit) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
    </div>
  );

  if (notConfigured) return <NotConfigured />;

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Cloud className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-gray-800 text-sm">Cloudflare</span>
          <span className="ml-auto">
            <Tag label={zones.length > 0 ? `${zones.length} zone${zones.length > 1 ? 's' : ''}` : 'Connected'} color="orange" />
          </span>
        </div>
        <nav className="space-y-0.5">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition text-left ${
                section === item.id
                  ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-100'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}>
              <span className={section === item.id ? 'text-orange-500' : 'text-gray-400'}>{item.icon}</span>
              <span className="truncate">{item.label}</span>
              {section === item.id && <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-orange-400" />}
            </button>
          ))}
        </nav>
        {/* Status indicator */}
        <div className="mt-4 px-3 py-2.5 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs text-green-700 font-medium">API Connected</span>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-white rounded-xl border border-gray-100 p-6 overflow-y-auto">
        {section === 'analytics'  && <AnalyticsSection zones={zones} />}
        {section === 'dns'        && <DnsSection zones={zones} />}
        {section === 'security'   && <SecuritySection zones={zones} />}
        {section === 'cache'      && <CacheSection zones={zones} />}
        {section === 'rules'      && <RulesSection zones={zones} />}
        {section === 'network'    && <NetworkSection zones={zones} />}
        {section === 'zerotrust'  && <ZeroTrustSection accountId={accountId} />}
        {section === 'workers'    && <WorkersSection accountId={accountId} />}
        {section === 'email'      && <EmailSection accountId={accountId} />}
        {section === 'media'      && <MediaSection accountId={accountId} />}
        {section === 'account'    && <AccountSection accountId={accountId} />}
        {section === 'other'      && <OtherSection zones={zones} accountId={accountId} />}
      </main>
    </div>
  );
}
