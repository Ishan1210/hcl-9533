import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from './api';
import { useAuth } from './auth';
import { ErrorMessage, Field, Heading } from './components';

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
