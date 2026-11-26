import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
