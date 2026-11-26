import React, { useEffect, useState } from 'react';
import { rate } from './api';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from './auth';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="shell header-inner">
      <Link to="/" className="brand"><svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="7" fill="#305d47"/><path d="M9 15 L20 8 L31 15 V28 L20 34 L9 28 Z M9 15 L20 21 L31 15 M20 21 V34 M14 12 L25 18" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round"/></svg><span>BorrowBuddy</span></Link>
      <nav aria-label="Main navigation" className="main-nav">
        <NavLink to="/" end>Browse items</NavLink>
        
      </nav>
      <div className="account-nav"><Link to="/items/new" className="btn btn-primary btn-sm">List an item</Link>{user ? <><span className="account-link">{user.name}</span><button className="plain-button" onClick={logout}>Sign out</button></> : <Link to="/login" className="account-link">Sign in</Link>}</div>
    </div></header>
    <main id="main" className="shell main-content" tabIndex={-1}>{children}</main>
    <footer className="site-footer"><div className="shell footer-inner"><span>BorrowBuddy</span><span>Community item lending and rentals</span></div></footer>
  </>;
}
export function Heading({ title, description, action }) {
  return <div className="page-heading"><div><h1>{title}</h1>{description && <p className="muted mb-0">{description}</p>}</div>{action}</div>;
}
export function ErrorMessage({ message }) { return message ? <div role="alert" className="notice notice-error">{message}</div> : null; }
export function Loading() { return <p role="status" className="state-text">Loading…</p>; }
export function Empty({ title, description, action }) { return <div className="empty-state"><h2>{title}</h2><p>{description}</p>{action}</div>; }

export function Field({ label, id, hint, children }) { return <div className="form-field"><label htmlFor={id}>{label}</label>{children}{hint && <div id={`${id}-hint`} className="field-hint">{hint}</div>}</div>; }

export function ItemPhoto({ item, large = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [item.imageUrl]);
  const valid = /^https?:\/\//i.test(item.imageUrl || '');
  return <div className={`item-photo ${large ? 'photo-large' : ''}`}>
    {valid && !failed ? <img src={item.imageUrl} alt={item.name} loading="lazy" onError={() => setFailed(true)} referrerPolicy="no-referrer"/> : <div className="photo-placeholder"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m4 18 5-5 3 3 4-5 4 5"/></svg><span>No photo</span></div>}
  </div>;
}
export function ItemCard({ item }) {
  return <article className="listing"><Link to={`/items/${item.id}`} className="listing-link"><ItemPhoto item={item}/><div className="listing-body"><div className="listing-meta">{item.categoryName}</div><h2>{item.name}</h2><p className="location-text">{item.locality}{item.distanceKm != null && ` · ${item.distanceKm.toFixed(1)} km away`}</p><div className="listing-price">{rate(item.pricePerDay)}</div></div></Link></article>;
}
