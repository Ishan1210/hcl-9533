import { useCallback, useEffect, useState } from "react";
import api from "./api";
import AuthForm from "./AuthForm";
import PostForm from "./PostForm";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get("/posts");
      if (!Array.isArray(data)) {
        throw new Error("The posts endpoint did not return a JSON array.");
      }
      setPosts(data);
    } catch (error) {
      console.error("Unable to load posts:", error);
      setLoadError(
        error.response
          ? `Could not load posts (HTTP ${error.response.status}). Check the backend response.`
          : error.message === "Network Error"
            ? "Cannot reach the API. Check that Spring Boot is running and CORS allows http://localhost:5173."
            : error.message || "Unable to load posts."
      );
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
        <a className="brand" href="/">JWT <span>Blog</span></a>
        <div className="topbar-actions">
          {user ? <><span className="user-label">Signed in as <strong>{user}</strong></span><button className="button button-ghost" onClick={logout}>Logout</button></> : <span className="topbar-note">A simple place for your thoughts</span>}
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">WRITE · SHARE · CONNECT</p>
        <h1>Ideas worth <span>sharing.</span></h1>
        <p className="hero-copy">Publish your thoughts and discover what others are writing.</p>
      </section>

      <div className="content-grid">
        <section className="panel auth-panel">
          {user ? <>
            <div className="section-heading"><p className="eyebrow">YOUR SPACE</p><h2>Create a post</h2></div>
            <PostForm onCreated={loadPosts} />
          </> : <>
            <div className="section-heading"><p className="eyebrow">GET STARTED</p><h2>Join the conversation</h2></div>
            <AuthForm onLogin={setUser} />
          </>}
        </section>

        <section className="posts-section">
          <div className="posts-heading"><div><p className="eyebrow">THE COMMUNITY</p><h2>Latest posts</h2></div><span className="post-count">{posts.length} {posts.length === 1 ? "POST" : "POSTS"}</span></div>
          {loading && <p className="notice">Loading posts…</p>}
          {!loading && loadError && <div className="error-box" role="alert"><p>{loadError}</p><button className="button button-small" onClick={loadPosts}>Try again</button></div>}
          {!loading && !loadError && posts.length === 0 && <div className="empty-state"><span className="empty-icon">✎</span><h3>Nothing here yet</h3><p>Be the first to publish something worth reading.</p></div>}
          <div className="post-list">
            {posts.map((post) => <article className="post-card" key={post.id}>
              <h3>{post.title}</h3><p className="post-content">{post.content}</p>
              <div className="post-meta"><span>By <strong>{post.author}</strong></span><time dateTime={post.createdAt}>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</time></div>
            </article>)}
          </div>
        </section>
      </div>
      <footer className="footer">JWT Blog Demo <span>·</span> Built with React & Spring Boot</footer>
    </main>
  );
};

export default App;
