import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Layout, Empty } from './components';
import { AuthProvider, RequireAuth } from './auth';
import { AccountForm, Activity, Profile, Dashboard } from './account';
import { Browse, ItemDetail, ItemEditor, MyItems } from './items';

function App() {
  return <Layout><Routes>
    <Route path="/" element={<Browse/>}/>
    <Route path="/items/:id" element={<ItemDetail/>}/>
    <Route path="/login" element={<AccountForm key="login"/>}/>
    <Route path="/register" element={<AccountForm key="register" register/>}/>
    <Route path="/items/new" element={<RequireAuth><ItemEditor key="new"/></RequireAuth>}/>
    <Route path="/items/:id/edit" element={<RequireAuth><ItemEditor key="edit"/></RequireAuth>}/>
    <Route path="/my-items" element={<RequireAuth><MyItems/></RequireAuth>}/>
    <Route path="/dashboard" element={<RequireAuth><Dashboard/></RequireAuth>}/>
    <Route path="/profile" element={<RequireAuth><Profile/></RequireAuth>}/>
    <Route path="/activity" element={<RequireAuth><Activity/></RequireAuth>}/>
    <Route path="*" element={<Empty title="Page not found" description="This page does not exist." action={<Link to="/" className="btn btn-primary">Browse items</Link>}/>}/>
  </Routes></Layout>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><AuthProvider><App/></AuthProvider></BrowserRouter>);
