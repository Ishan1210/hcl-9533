import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Layout({ children }) {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="shell header-inner">
      <Link to="/" className="brand"><svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="7" fill="#305d47"/><path d="M9 15 L20 8 L31 15 V28 L20 34 L9 28 Z M9 15 L20 21 L31 15 M20 21 V34 M14 12 L25 18" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round"/></svg><span>BorrowBuddy</span></Link>
      <nav aria-label="Main navigation" className="main-nav">
        <NavLink to="/" end>Browse items</NavLink>
        
      </nav>
      <div className="account-nav"><Link to="/items/new" className="btn btn-primary btn-sm">List an item</Link><Link to="/login" className="account-link">Sign in</Link></div>
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
