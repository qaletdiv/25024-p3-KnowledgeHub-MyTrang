import { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/post');
        setPosts(res.data.allPosts || []);
      } catch (err) {
        if (err.response?.status === 400) {
          setPosts([]);
        } else {
          setError('Failed to load posts. Is the server running?');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.loadingSpinner}></div>
      <p style={s.loadingText}>Loading posts…</p>
    </div>
  );

  return (
    <div style={s.page}>
      {/* Hero banner */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Knowledge Hub</h1>
        <p style={s.heroSub}>Discover stories, ideas & knowledge shared by our community</p>
        {user && (
          <Link to="/create-post" style={s.heroBtn}>Write your story</Link>
        )}
      </div>

      <div style={s.container}>
        {error && <div style={s.errorBox}>{error}</div>}

        {posts.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>+</div>
            <h3 style={s.emptyTitle}>No posts yet!</h3>
            <p style={s.emptyText}>Be the first to share your knowledge.</p>
            {user && <Link to="/create-post" style={s.emptyBtn}>Create First Post</Link>}
          </div>
        ) : (
          <>
            <h2 style={s.sectionTitle}>Recent Posts</h2>
            <div style={s.grid}>
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: theme.bg, minHeight: '100%' },
  hero: {
    background: theme.primaryLight,
    borderBottom: `1px solid ${theme.border}`,
    padding: '40px 24px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '28px', fontWeight: '800', color: theme.primaryDark, marginBottom: '8px',
  },
  heroSub: { color: theme.textMuted, fontSize: '15px', fontWeight: '500', marginBottom: '20px' },
  heroBtn: {
    display: 'inline-block',
    background: theme.primary,
    color: '#fff', padding: '10px 24px', borderRadius: theme.radiusSm,
    fontWeight: '600', fontSize: '14px', textDecoration: 'none',
    transition: 'opacity 0.2s',
  },
  container: { maxWidth: '780px', margin: '0 auto', padding: '24px' },
  loadingWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: '16px',
  },
  loadingSpinner: { 
    width: '32px', height: '32px', 
    border: `3px solid ${theme.border}`, 
    borderTopColor: theme.primary, 
    borderRadius: '50%', 
    animation: 'spin 1s linear infinite' 
  },
  loadingText: { color: theme.textMuted, fontWeight: '500', fontSize: '14px' },
  errorBox: {
    background: theme.dangerLight, color: theme.danger,
    padding: '12px 20px', borderRadius: theme.radiusSm,
    fontWeight: '500', fontSize: '14px', marginBottom: '20px',
    border: `1px solid rgba(248,113,113,0.2)`,
  },
  sectionTitle: {
    fontSize: '20px', fontWeight: '700', color: theme.text, marginBottom: '24px',
    borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  empty: {
    textAlign: 'center', padding: '80px 24px',
    background: theme.bgCard, borderRadius: theme.radiusSm,
    border: `1px dashed ${theme.border}`,
  },
  emptyIcon: { 
    width: '48px', height: '48px', margin: '0 auto 16px',
    background: theme.primaryLight, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: theme.primary, fontSize: '20px'
  },
  emptyTitle: { fontSize: '18px', fontWeight: '600', color: theme.text, marginBottom: '8px' },
  emptyText: { color: theme.textMuted, fontSize: '14px', marginBottom: '24px', fontWeight: '400' },
  emptyBtn: {
    display: 'inline-block',
    background: theme.primary,
    color: '#fff', padding: '10px 20px', borderRadius: theme.radiusSm,
    fontWeight: '600', fontSize: '14px', textDecoration: 'none',
  },
};
