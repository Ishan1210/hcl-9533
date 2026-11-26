import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';
import { api, getLocation, rate } from './api';
import { Empty, ErrorMessage, Field, Heading, ItemCard, ItemPhoto, Loading } from './components';

// Reloads when the URL or token changes. Abort stale requests when navigating.
export function useData(path, token) {
  const [state, setState] = useState({ data: null, loading: true, error: '', status: null });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!path) { setState({ data: null, loading: false, error: '', status: null }); return; }
    const controller = new AbortController();
    setState({ data: null, loading: true, error: '', status: null });
    api(path, { token, signal: controller.signal }).then(data => {
      if (!controller.signal.aborted) setState({ data, loading: false, error: '', status: null });
    }).catch(error => {
      if (!controller.signal.aborted) setState({ data: null, loading: false, error: error.message, status: error.status });
    });
    return () => controller.abort();
  }, [path, token, version]);
  return { ...state, reload: () => setVersion(v => v + 1) };
}

export function Browse() {
  const categories = useData('/categories');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [radius, setRadius] = useState('5');
  const [location, setLocation] = useState(null);
  const [query, setQuery] = useState('');
  const [locationError, setLocationError] = useState('');
  const [locating, setLocating] = useState(false);
  const items = useData('/items' + query);
  function apply(filters = {}) {
    const values = { search, category, radius, location, ...filters };
    const params = new URLSearchParams();
    if (values.search.trim()) params.set('search', values.search.trim());
    if (values.category) params.set('categoryId', values.category);
    if (values.location) {
      params.set('latitude', values.location.latitude);
      params.set('longitude', values.location.longitude);
      params.set('radius', values.radius);
    }
    const next = params.toString() ? '?' + params.toString() : '';
    if (query === next) items.reload(); else setQuery(next);
  }
  async function nearby() {
    setLocating(true); setLocationError('');
    try { const point = await getLocation(); setLocation(point); apply({ location: point }); }
    catch (e) { setLocationError('Location access is unavailable. Allow access in your browser or continue browsing without a distance filter.'); }
    finally { setLocating(false); }
  }
  function reset() {
    setSearch(''); setCategory(''); setRadius('5'); setLocation(null); setLocationError('');
    apply({ search: '', category: '', radius: '5', location: null });
  }
  return <>
    <Heading title="Find something to borrow" description="Browse items shared by people in your community."/>
    <form className="search-bar" role="search" onSubmit={e => { e.preventDefault(); apply(); }}>
      <label htmlFor="search" className="visually-hidden">Search items</label><input id="search" className="form-control search-input" placeholder="Search tools, books, equipment…" value={search} onChange={e => setSearch(e.target.value)}/>
      <button className="btn btn-primary" type="submit">Search</button>
    </form>
    <div className="market-layout">
      <aside className="filters" aria-label="Filter items"><div className="filter-heading"><h2>Filters</h2><button className="text-button" disabled={locating} onClick={reset}>Clear all</button></div>
        <Field id="category" label="Category"><select id="category" className="form-select" value={category} onChange={e => { setCategory(e.target.value); apply({ category: e.target.value }); }}><option value="">All categories</option>{categories.data?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <ErrorMessage message={categories.error}/>
        <div className="filter-section"><h3>Distance</h3><p className="muted small">Find listings near your current location.</p><button type="button" className="btn btn-outline-primary w-100" disabled={locating} onClick={nearby}>{locating ? 'Finding location…' : location ? 'Refresh my location' : 'Use my location'}</button>
          {location && <p className="small location-confirmed" role="status">Location selected</p>}
          <ErrorMessage message={locationError}/>
          <Field id="radius" label="Search radius"><select id="radius" className="form-select" value={radius} onChange={e => { setRadius(e.target.value); if (location) apply({ radius: e.target.value }); }} disabled={!location}>{[1,5,10,20,50].map(r => <option key={r} value={r}>{r} km</option>)}</select></Field>
          {location && <button className="text-button" onClick={() => { setLocation(null); setLocationError(''); apply({ location: null }); }}>Browse without location</button>}
        </div>
      </aside>
      <section aria-label="Item results"><div className="results-heading"><h2>{items.loading ? 'Listings' : `${items.data?.length || 0} ${items.data?.length === 1 ? 'listing' : 'listings'}`}</h2><span className="muted small">{query.includes('latitude=') ? 'Nearest first' : 'Newest first'}</span></div>
        <ErrorMessage message={items.error}/>{items.error && <button className="btn btn-outline-primary" onClick={items.reload}>Try again</button>}
        {items.loading ? <Loading/> : items.data?.length ? <div className="listing-grid">{items.data.map(item => <ItemCard key={item.id} item={item}/>)}</div> : !items.error && <Empty title="No matching items" description="Try another search, category or a wider radius." action={<button className="btn btn-outline-primary" onClick={reset}>Reset filters</button>}/>}
      </section>
    </div>
  </>;
}

export function ItemDetail() {
  const { id } = useParams();
  const { data: item, loading, error, reload } = useData('/items/' + id);
  if (loading) return <Loading/>;
  if (!item) return <><ErrorMessage message={error}/><Link to="/" className="btn btn-outline-primary">Browse items</Link><button className="btn btn-link" onClick={reload}>Try again</button></>;
  return <><Link to="/" className="back-link">← Browse items</Link><div className="detail-layout">
    <section><p className="eyebrow">{item.categoryName}</p><h1>{item.name}</h1><p className="muted">{item.locality}</p><ItemPhoto item={item} large/><div className="detail-section"><h2>About this item</h2><p className="description">{item.description}</p></div><div className="detail-section"><h2>Listed by</h2><p>{item.ownerName}</p><p className="muted small">Exact pickup coordinates are not public.</p></div></section>
    <aside className="booking-panel"><div className="booking-price">{rate(item.pricePerDay)}</div><p className="muted">Borrowing requests will be enabled in a later milestone.</p><Link to="/" className="btn btn-outline-primary w-100">Browse more items</Link></aside>
  </div></>;
}

const emptyForm = { name: '', description: '', categoryId: '', pricePerDay: '0', locality: '', latitude: '', longitude: '', imageUrl: '' };
export function ItemEditor() {
  const { id } = useParams(); const { token } = useAuth(); const navigate = useNavigate();
  const categories = useData('/categories');
  const existing = useData(id ? '/users/me/items/' + id : null, token);
  const [form, setForm] = useState(emptyForm), [error, setError] = useState(''), [saving, setSaving] = useState(false), [locating, setLocating] = useState(false);
  useEffect(() => { setForm(emptyForm); }, [id]);
  useEffect(() => { if (id && existing.data && String(existing.data.id) === String(id)) setForm(Object.fromEntries(Object.keys(emptyForm).map(key => [key, existing.data[key] ?? '']))); }, [existing.data, id]);
  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  async function useLocation() { setLocating(true); setError(''); try { const point = await getLocation(); setForm(f => ({ ...f, ...point })); } catch(e) { setError(e.message); } finally { setLocating(false); } }
  async function submit(e) {
    e.preventDefault(); setError(''); if (saving) return;
    if (form.imageUrl && !/^https?:\/\//i.test(form.imageUrl)) { setError('Use an http or https photo URL.'); return; }
    if (![form.name,form.description,form.locality].every(s => s.trim())) { setError('Enter an item name, description and locality.'); return; }
    if (form.latitude === '' || form.longitude === '') { setError('Enter pickup coordinates or use your current location.'); return; }
    const body = { ...form, categoryId: Number(form.categoryId), pricePerDay: Number(form.pricePerDay), latitude: Number(form.latitude), longitude: Number(form.longitude), imageUrl: form.imageUrl.trim() || null };
    if (!Number.isFinite(body.latitude) || !Number.isFinite(body.longitude) || Math.abs(body.latitude)>90 || Math.abs(body.longitude)>180) { setError('Enter valid coordinates.'); return; }
    setSaving(true);
    try { await api(id ? '/items/' + id : '/items', { method: id ? 'PUT' : 'POST', body, token }); navigate('/my-items', { state: { message: id ? 'Listing updated.' : 'Your item has been listed.' } }); }
    catch (e) { setError(e.message); } finally { setSaving(false); }
  }
  if (id && existing.loading) return <Loading/>;
  if (id && existing.error) return <><ErrorMessage message={existing.error}/><Link to="/my-items">Back to my listings</Link></>;
  return <div className="form-page"><Link className="back-link" to="/my-items">← My listings</Link><Heading title={id ? 'Edit listing' : 'List an item'} description="Share what you have, where it can be collected and what it costs to borrow."/>
    <form onSubmit={submit}><section className="form-section"><h2>Item details</h2>
      <Field id="name" label="Item name"><input id="name" name="name" className="form-control" value={form.name} onChange={update} maxLength={150} required/></Field>
      <Field id="categoryId" label="Category"><select id="categoryId" name="categoryId" className="form-select" required value={form.categoryId} onChange={update}><option value="">Choose a category</option>{categories.data?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><ErrorMessage message={categories.error}/>
      <Field id="description" label="Description" hint="Include condition, what is included, and anything the borrower should know."><textarea id="description" name="description" rows="5" className="form-control" value={form.description} onChange={update} maxLength={1000} required aria-describedby="description-hint"/></Field>
      <Field id="imageUrl" label="Photo URL (optional)" hint="Use a direct image link. File uploads are not supported."><input id="imageUrl" name="imageUrl" className="form-control" type="url" value={form.imageUrl} onChange={update} maxLength={1000} aria-describedby="imageUrl-hint"/></Field>
      {form.imageUrl && <div className="editor-preview"><ItemPhoto item={form}/></div>}
    </section><section className="form-section"><h2>Rental price</h2><Field id="pricePerDay" label="Daily price (₹)" hint="Enter 0 to lend for free."><input id="pricePerDay" name="pricePerDay" type="number" min="0" max="99999999.99" step="0.01" className="form-control" value={form.pricePerDay} onChange={update} required aria-describedby="pricePerDay-hint"/></Field></section>
    <section className="form-section"><h2>Pickup location</h2><Field id="locality" label="Locality" hint="Use an area or neighbourhood name, not a private street address."><input id="locality" name="locality" className="form-control" value={form.locality} onChange={update} maxLength={150} required aria-describedby="locality-hint"/></Field>
      <button className="btn btn-outline-primary mb-3" type="button" disabled={locating} onClick={useLocation}>{locating ? 'Finding location…' : 'Use my current location'}</button>
      <div className="two-fields"><Field id="latitude" label="Latitude"><input id="latitude" name="latitude" type="number" min="-90" max="90" step="any" className="form-control" value={form.latitude} onChange={update} required/></Field><Field id="longitude" label="Longitude"><input id="longitude" name="longitude" type="number" min="-180" max="180" step="any" className="form-control" value={form.longitude} onChange={update} required/></Field></div><p className="field-hint">Coordinates are used for distance filtering and are not included in public listing responses. Current-location coordinates are rounded to three decimal places (roughly 100 metres).</p>
    </section><ErrorMessage message={error}/><div className="form-actions"><button className="btn btn-primary" disabled={saving || categories.loading || !!categories.error}>{saving ? 'Saving…' : id ? 'Save changes' : 'Publish listing'}</button><Link className="btn btn-outline-secondary" to="/my-items">Cancel</Link></div></form></div>;
}

export function MyItems() {
  const { token } = useAuth(); const listings = useData('/items/my', token); const navigation = useLocation();
  const [busy, setBusy] = useState(null), [failure, setFailure] = useState(''), [notice, setNotice] = useState(navigation.state?.message || ''), [archive, setArchive] = useState(null);
  async function change(item, remove = false) {
    setBusy(item.id); setFailure(''); setNotice('');
    try { await api('/items/' + item.id + (remove ? '' : '/status?status=' + (item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')), { method: remove ? 'DELETE' : 'PATCH', token }); setNotice(remove ? 'Listing archived.' : 'Listing status updated.'); setArchive(null); listings.reload(); }
    catch(e) { setFailure(e.message); } finally { setBusy(null); }
  }
  return <><Heading title="My listings" description="Manage the items you share with your community." action={<Link to="/items/new" className="btn btn-primary">List an item</Link>}/><ErrorMessage message={listings.error || failure}/>{notice && <p role="status" className="notice notice-success">{notice}</p>}
    {listings.error && <button className="btn btn-outline-primary" onClick={listings.reload}>Try again</button>}
    {listings.loading ? <Loading/> : listings.data?.length ? <div className="management-list">{listings.data.map(item => <article key={item.id} className="management-row"><ItemPhoto item={item}/><div className="management-info"><span className="listing-meta">{item.categoryName}</span><h2>{item.status === 'ACTIVE' ? <Link to={`/items/${item.id}`}>{item.name}</Link> : item.name}</h2><span className="muted small">{item.locality} · {rate(item.pricePerDay)}</span><p className={item.status === 'ACTIVE' ? 'status-text positive' : 'status-text'}>{item.status === 'ACTIVE' ? 'Active' : 'Hidden'}</p></div><div className="management-actions"><Link className="btn btn-outline-primary btn-sm" to={`/items/${item.id}/edit`}>Edit</Link><button className="btn btn-outline-secondary btn-sm" disabled={busy !== null} onClick={() => change(item)}>{item.status === 'ACTIVE' ? 'Hide' : 'Activate'}</button><button className="text-button danger" disabled={busy !== null} onClick={() => setArchive(item.id)}>Archive</button>{archive === item.id && <div className="archive-confirm"><p>Archive this listing permanently?</p><button className="btn btn-danger btn-sm" disabled={busy !== null} onClick={() => change(item, true)}>Archive listing</button><button className="text-button" onClick={() => setArchive(null)}>Cancel</button></div>}</div></article>)}</div> : !listings.error && <Empty title="You haven't listed anything yet" description="List a tool, book or other item you are willing to lend." action={<Link className="btn btn-primary" to="/items/new">Create a listing</Link>}/>}</>;
}
