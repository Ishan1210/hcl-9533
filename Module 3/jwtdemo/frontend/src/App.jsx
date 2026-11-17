import { useCallback, useEffect, useState } from "react";
import api from "./api";
import AuthForm from "./AuthForm";
import PostForm from "./PostForm";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load posts. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">JWT<span>Blog</span></a>
        <div className="topbar-right">
          {user ? (
            <>
              <span className="welcome">Hi, {user}</span>
              <button className="button button-outline button-small" onClick={logout}>Logout</button>
            </>
          ) : <span className="secure-label">JWT Authentication Demo</span>}
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">WRITE. SHARE. CONNECT.</p>
          <h1>Your thoughts deserve<br />a place to live.</h1>
          <p className="hero-subtitle">A simple blog powered by React, Spring Boot and JWT authentication.</p>
        </div>
        <div className="hero-mark" aria-hidden="true">✦</div>
      </section>

      <div className="content-grid">
        <section className="panel auth-panel">
          {user ? (
            <>
              <p className="eyebrow">YOUR SPACE</p>
              <h2>Create a post</h2>
              <p className="muted">Share an idea with the community.</p>
              <PostForm onCreated={loadPosts} />
            </>
          ) : (
            <>
              <p className="eyebrow">GET STARTED</p>
              <h2>Join the conversation</h2>
              <p className="muted">Login or create an account to publish your thoughts.</p>
              <AuthForm onLogin={setUser} />
            </>
          )}
        </section>

        <section className="posts-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE COMMUNITY</p>
              <h2>Latest posts</h2>
            </div>
            <span className="count-pill">{posts.length} {posts.length === 1 ? "post" : "posts"}</span>
          </div>
          {loading && <p className="state-message">Loading posts…</p>}
          {error && <p className="error-message" role="alert">{error}</p>}
          {!loading && !error && posts.length === 0 && (
            <div className="empty-state"><span>✎</span><h3>Nothing here yet</h3><p>Be the first to publish a post.</p></div>
          )}
          <div className="post-list">
            {posts.map((post) => (
              <article className="post-card" key={post.id}>
                <h3>{post.title}</h3>
                <p className="post-content">{post.content}</p>
                <div className="post-meta">
                  <span className="author-avatar">{(post.author || "?").charAt(0).toUpperCase()}</span>
                  <span>By <strong>{post.author}</strong></span>
                  <time dateTime={post.createdAt}>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</time>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <footer>Built with React · Spring Boot · JWT</footer>
    </main>
  );
};

export default App;
