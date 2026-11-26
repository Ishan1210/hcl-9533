import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api, dateLabel, localDate, money } from './api';
import { useAuth } from './auth';
import { Empty, ErrorMessage, Field, Heading, Loading } from './components';

import { useData } from './items';

export function AccountForm({ register = false }) {
  const { user, login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const from = typeof location.state?.from === 'string' && /^\/(?!\/)/.test(location.state.from) ? location.state.from : '/';
  useEffect(() => { if (user) navigate(from, { replace: true }); }, [user, from, navigate]);
  async function submit(e) {
    e.preventDefault(); setError(''); if (busy) return;
    if (register && !name.trim()) { setError('Enter your name.'); return; }
    setBusy(true);
    try {
      const credentials = { email: email.trim(), password };
      if (register) await api('/auth/register', { method: 'POST', body: { name: name.trim(), ...credentials } });
      await login(credentials); navigate(from, { replace: true });
    } catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  return <div className="auth-page"><Heading title={register ? 'Create an account' : 'Sign in to BorrowBuddy'} description={register ? 'Join your community to lend and borrow items.' : 'Manage your listings and borrowing requests.'}/><form onSubmit={submit} className="auth-form">
    {register && <Field id="name" label="Full name"><input id="name" autoComplete="name" className="form-control" value={name} onChange={e => setName(e.target.value)} required maxLength={100}/></Field>}
    <Field id="email" label="Email address"><input id="email" type="email" autoComplete="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} maxLength={150} required/></Field>
    <Field id="password" label="Password" hint={register ? 'Use at least 8 characters (up to 72 UTF-8 bytes).' : undefined}><input id="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} className="form-control" value={password} onChange={e => setPassword(e.target.value)} minLength={register ? 8 : undefined} maxLength={72} required/></Field>
    <ErrorMessage message={error}/><button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</button>
    <p className="auth-switch">{register ? 'Already have an account?' : 'New to BorrowBuddy?'} <Link to={register ? '/login' : '/register'} state={{ from }}>{register ? 'Sign in' : 'Create an account'}</Link></p>
  </form></div>;
}

const statuses = { PENDING: 'Awaiting approval', APPROVED: 'Approved', REJECTED: 'Declined', CANCELLED: 'Cancelled', BORROWED: 'On loan', RETURN_REQUESTED: 'Return requested', COMPLETED: 'Returned' };
const actionLabels = { approve: 'Approve', reject: 'Decline', cancel: 'Cancel request', handover: 'Confirm handover', 'request-return': 'Request return', 'confirm-return': 'Confirm return' };
const openStatuses = ['PENDING', 'APPROVED', 'BORROWED', 'RETURN_REQUESTED'];
function availableActions(request, lending) {
  const { status, startDate, endDate } = request;
  const today = localDate();
  if (status === 'PENDING') return lending ? [...(startDate >= today ? ['approve'] : []), 'reject', 'cancel'] : ['cancel'];
  if (status === 'APPROVED') return lending && startDate <= today && endDate >= today ? ['handover', 'cancel'] : ['cancel'];
  if (status === 'BORROWED' && !lending) return ['request-return'];
  if (status === 'RETURN_REQUESTED' && lending) return ['confirm-return'];
  return [];
}
export function Activity() {
  const { token } = useAuth(); const borrowing = useData('/borrow-requests/my', token); const incoming = useData('/borrow-requests/incoming', token);
  const [params, setParams] = useSearchParams(); const lending = params.get('view') === 'lending';
  const location = useLocation();
  const [filter, setFilter] = useState('open'), [busy, setBusy] = useState(null), [error, setError] = useState(''), [notice, setNotice] = useState(location.state?.message || '');
  const dashboard = lending ? incoming : borrowing;
  const records = dashboard.data || [];
  const visible = records.filter(r => filter === 'all' || (filter === 'open' ? openStatuses.includes(r.status) : !openStatuses.includes(r.status)));
  const pending = incoming.data?.filter(r => r.status === 'PENDING' || r.status === 'RETURN_REQUESTED').length || 0;
  async function action(r, name) {
    if (busy) return;
    if (['reject','cancel','handover','confirm-return'].includes(name) && !window.confirm(`${actionLabels[name]} for ${r.itemName}?`)) return;
    setBusy(r.id); setError(''); setNotice('');
    try { const updated = await api(`/borrow-requests/${r.id}/${name}`, { token, method: 'PATCH' }); setNotice(`${updated.itemName}: ${statuses[updated.status]}.`); borrowing.reload(); incoming.reload(); }
    catch(e) { setError(e.message); } finally { setBusy(null); }
  }
  return <><Heading title="My activity" description="Track your requests, handovers and returns." action={<Link to="/my-items" className="btn btn-outline-primary">My listings</Link>}/>
    <div className="activity-tabs" aria-label="Activity view"><button className={!lending ? 'selected' : ''} aria-pressed={!lending} onClick={() => {setParams({});setError('');}}>Borrowing</button><button className={lending ? 'selected' : ''} aria-pressed={lending} onClick={() => {setParams({ view: 'lending' });setError('');}}>Lending{pending > 0 && ` (${pending} to review)`}</button></div>
    <div className="activity-toolbar"><h2>{lending ? 'Requests for your items' : 'Items you requested'}</h2><label htmlFor="requestFilter" className="visually-hidden">Request status filter</label><select id="requestFilter" className="form-select" value={filter} onChange={e => setFilter(e.target.value)}><option value="open">Open requests</option><option value="all">All requests</option><option value="closed">Closed requests</option></select></div>
    <ErrorMessage message={dashboard.error || error}/>{notice && <div role="status" className="notice notice-success">{notice}</div>}
    {dashboard.error && <button className="btn btn-outline-primary" onClick={dashboard.reload}>Try again</button>}
    {dashboard.loading ? <Loading/> : visible.length ? <div className="request-list">{visible.map(r => <article key={r.id} className="request-row"><div className="request-info"><h3>{r.itemName}</h3><p className="muted">{lending ? `Requested by ${r.borrowerName}` : `Owner: ${r.ownerName}`}</p><p className="request-dates">{dateLabel(r.startDate)} – {dateLabel(r.endDate)}</p><p className="muted small">Request #{r.id}</p></div><div className="request-value"><span className={`status-text ${r.overdue ? 'danger' : ['APPROVED','COMPLETED'].includes(r.status) ? 'positive' : r.status === 'PENDING' || r.status === 'RETURN_REQUESTED' ? 'attention' : ''}`}>{r.overdue ? 'Overdue · ' : ''}{statuses[r.status] || r.status}</span><strong>{money(r.totalPrice)}</strong><span className="muted small">Rental total · offline payment</span></div><div className="request-actions">{availableActions(r,lending).map((name,i) => <button key={name} disabled={busy !== null} className={`btn btn-sm ${i === 0 && !['reject','cancel'].includes(name) ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => action(r,name)}>{busy === r.id ? 'Updating…' : actionLabels[name]}</button>)}{r.status === 'APPROVED' && lending && r.startDate > localDate() && <span className="muted small">Handover opens on {dateLabel(r.startDate)}.</span>}</div></article>)}</div> : !dashboard.error && <Empty title={filter === 'open' ? 'No open requests' : 'No requests to show'} description={lending ? 'Requests from borrowers will appear here.' : 'Choose an item and send a borrowing request.'} action={!lending ? <Link to="/" className="btn btn-outline-primary">Browse items</Link> : <Link to="/my-items" className="btn btn-outline-primary">View my listings</Link>}/>}</>;
}
