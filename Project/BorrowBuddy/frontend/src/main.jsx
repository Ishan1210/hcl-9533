import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Layout, Heading, Empty } from './components';

function Browse() {
  return <><Heading title="Browse items" description="Find items to borrow or rent in your neighbourhood."/>
    <Empty title="Marketplace setup" description="Item discovery will be connected to the backend in the marketplace milestone."/>
  </>;
}
function PendingPage({ title, description }) {
  return <><Heading title={title}/><Empty title="Not available yet" description={description} action={<Link to="/" className="btn btn-outline-primary">Back to browse</Link>}/></>;
}
function App() {
  return <Layout><Routes>
    <Route path="/" element={<Browse/>}/>
    <Route path="/login" element={<PendingPage title="Sign in" description="Account access will be implemented in the next milestone."/>}/>
    <Route path="/register" element={<PendingPage title="Create account" description="Registration will be implemented in the next milestone."/>}/>
    <Route path="/items/new" element={<PendingPage title="List an item" description="Listing creation will be implemented in a later milestone."/>}/>
    <Route path="*" element={<Empty title="Page not found" description="This page does not exist." action={<Link to="/" className="btn btn-primary">Browse items</Link>}/>}/>
  </Routes></Layout>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
