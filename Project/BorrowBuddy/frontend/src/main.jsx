import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Layout, Heading, Empty } from './components';
import { AuthProvider, RequireAuth } from './auth';
import { AccountForm } from './account';
import { Browse, ItemDetail } from './items';

function PendingPage({ title, description }) {
  return <><Heading title={title}/><Empty title="Not available yet" description={description} action={<Link to="/" className="btn btn-outline-primary">Back to browse</Link>}/></>;
}
function App() {
  return <Layout><Routes>
    <Route path="/" element={<Browse/>}/>
    <Route path="/items/:id" element={<ItemDetail/>}/>
    <Route path="/login" element={<AccountForm key="login"/>}/>
    <Route path="/register" element={<AccountForm key="register" register/>}/>
    <Route path="/items/new" element={<RequireAuth><PendingPage title="List an item" description="Listing creation will be implemented in a later milestone."/></RequireAuth>}/>
    <Route path="*" element={<Empty title="Page not found" description="This page does not exist." action={<Link to="/" className="btn btn-primary">Browse items</Link>}/>}/>
  </Routes></Layout>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><AuthProvider><App/></AuthProvider></BrowserRouter>);
