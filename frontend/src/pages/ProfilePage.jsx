import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import theme from '../theme';

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const fileInputRef = useRef();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', gender: '', birth: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // Sync form when user changes (bug fix: form was stale on first render)
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        gender: user.gender || '',
        birth: user.birth ? user.birth.split('T')[0] : '',
      });
    }
  }, [user]);

  // Fetch user's own posts using GET /post/:id (user id) — bug fix: missing feature
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user) return;
      setPostsLoading(true);
      try {
        // Backend: GET /post/:id returns posts where userId = :id
        const res = await api.get(`/post/${user.id}`);
        setMyPosts(res.data.userPosts || []);
      } catch (err) {
        if (err.response?.status === 400) setMyPosts([]); // "no post yet"
      } finally {
        setPostsLoading(false);
      }
    };
    if (activeTab === 'posts') fetchMyPosts();
  }, [user, activeTab]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const payload = { ...form };
      if (!payload.birth) delete payload.birth;
      if (!payload.gender) delete payload.gender;

      await api.put('/profile', payload);
      setSuccess('Profile updated! ✨');
      setEditing(false);
      await checkAuth();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.map(e => e.msg).join(' · '));
      } else {
        setError(data?.message || 'Failed to update profile');
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      await api.put('/profile/avatar', formData);
      setSuccess('Avatar updated! 🌸');
      setAvatarFile(null);
      setAvatarPreview(null);
      await checkAuth();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload avatar');
    }
  };

  if (!user) return (
    <div style={s.center}>
      <p style={{ color: theme.textMuted, fontWeight: '600', marginBottom: '16px' }}>Please log in to view your profile.</p>
      <Link to="/login" style={s.loginLink}>Go to Login</Link>
    </div>
  );

  const avatarUrl = user.avatar ? `https://zonal-growth-production-561c.up.railway.app/${user.avatar}` : null;
  const displayAvatar = avatarPreview || avatarUrl;

  return (
    <div style={s.page}>
      {/* Profile hero */}
      <div style={s.hero}>
        <div style={s.avatarWrap}>
          <div style={s.avatarRing}>
            {displayAvatar
              ? <img src={displayAvatar} alt="avatar" style={s.avatarImg} />
              : <div style={s.avatarInitial}>{user.username?.[0]?.toUpperCase()}</div>
            }
          </div>
          <button onClick={() => fileInputRef.current?.click()} style={s.changeAvatarBtn} title="Change avatar">
            📷
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
        </div>

        {avatarPreview && (
          <div style={s.avatarUploadActions}>
            <button onClick={handleAvatarUpload} style={s.uploadAvatarBtn}>✅ Save Avatar</button>
            <button onClick={() => { setAvatarPreview(null); setAvatarFile(null); }} style={s.cancelAvatarBtn}>Cancel</button>
          </div>
        )}

        <h2 style={s.heroName}>{user.username}</h2>
        <p style={s.heroEmail}>{user.email}</p>
      </div>

      {/* Tab bar */}
      <div style={s.tabs}>
        <button onClick={() => setActiveTab('info')} style={{ ...s.tab, ...(activeTab === 'info' ? s.tabActive : {}) }}>
          👤 Profile Info
        </button>
        <button onClick={() => setActiveTab('posts')} style={{ ...s.tab, ...(activeTab === 'posts' ? s.tabActive : {}) }}>
          📝 My Posts
        </button>
      </div>

      <div style={s.container}>
        {error && <div style={s.errorBox}>{error}</div>}
        {success && <div style={s.successBox}>{success}</div>}

        {/* Profile info tab */}
        {activeTab === 'info' && (
          <div style={s.card}>
            <form onSubmit={handleUpdateProfile}>
              <h3 style={s.cardTitle}>Profile Information</h3>
              <div style={s.field}>
                <label style={s.label}>Email (Read-only)</label>
                <input value={user.email} style={{...s.input, background: theme.bgCardHover, color: theme.textMuted, cursor: 'not-allowed'}} disabled />
              </div>
              <div style={s.field}>
                <label style={s.label}>Username</label>
                <input name="username" value={form.username} onChange={handleChange} style={s.input} />
              </div>
              <div style={s.row}>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={s.label}>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} style={s.input}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ ...s.field, flex: 1 }}>
                  <label style={s.label}>Date of Birth</label>
                  <input name="birth" type="date" value={form.birth} onChange={handleChange} style={s.input} />
                </div>
              </div>
              <div style={s.editActions}>
                <button type="submit" style={s.saveBtn}>💾 Save Changes</button>
              </div>
            </form>
          </div>
        )}

        {/* My Posts tab — uses GET /post/:id (bug fix: was completely missing) */}
        {activeTab === 'posts' && (
          <div>
            <div style={s.postsHeader}>
              <h3 style={s.cardTitle}>My Posts ({myPosts.length})</h3>
              <Link to="/create-post" style={s.newPostBtn}>✏️ New Post</Link>
            </div>

            {postsLoading ? (
              <div style={s.postsLoading}>🌸 Loading your posts…</div>
            ) : myPosts.length === 0 ? (
              <div style={s.emptyPosts}>
                <span style={s.emptyIcon}>📭</span>
                <p style={s.emptyText}>You haven't written any posts yet.</p>
                <Link to="/create-post" style={s.writeFirstBtn}>Write your first post!</Link>
              </div>
            ) : (
              <div style={s.postsList}>
                {myPosts.map((post) => {
                  const thumbUrl = post.thumbnail ? `https://zonal-growth-production-561c.up.railway.app/${post.thumbnail}` : null;
                  const date = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                  return (
                    <div key={post.id} style={s.postRow}>
                      {thumbUrl && <img src={thumbUrl} alt="" style={s.postThumb} />}
                      <div style={s.postRowContent}>
                        <h4 style={s.postRowTitle}>{post.title}</h4>
                        <p style={s.postRowExcerpt}>
                          {post.content ? post.content.replace(/<[^>]*>/g, '').slice(0, 100) + '…' : ''}
                        </p>
                        {date && <span style={s.postRowDate}>📅 {date}</span>}
                      </div>
                      <div style={s.postRowActions}>
                        <Link to={`/post/${post.id}`} style={s.viewBtn}>View</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: theme.bg, minHeight: 'calc(100vh - 65px)', paddingBottom: '60px' },
  center: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: '12px',
  },
  loginLink: {
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', padding: '12px 24px', borderRadius: theme.radiusPill,
    fontWeight: '800', fontSize: '14px', textDecoration: 'none',
  },
  hero: {
    background: `linear-gradient(135deg, ${theme.primaryLight} 0%, ${theme.accentLight} 100%)`,
    borderBottom: `1px solid ${theme.border}`,
    padding: '40px 24px 32px',
    textAlign: 'center',
  },
  avatarWrap: { position: 'relative', display: 'inline-block', marginBottom: '16px' },
  avatarRing: {
    width: '100px', height: '100px', borderRadius: '50%',
    border: `4px solid ${theme.primary}`,
    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    boxShadow: '0 4px 20px rgba(167,139,250,0.35)',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarInitial: { fontSize: '40px', fontWeight: '800', color: '#fff' },
  changeAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    background: '#fff', border: `2px solid ${theme.border}`,
    borderRadius: '50%', width: '30px', height: '30px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: '14px', boxShadow: theme.shadowCard,
  },
  avatarUploadActions: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' },
  uploadAvatarBtn: {
    background: theme.success, color: '#065f46', border: 'none',
    padding: '7px 18px', borderRadius: theme.radiusPill, fontWeight: '700',
    fontSize: '13px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  cancelAvatarBtn: {
    background: theme.border, color: theme.textMuted, border: 'none',
    padding: '7px 14px', borderRadius: theme.radiusPill, fontWeight: '700',
    fontSize: '13px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  heroName: { fontSize: '26px', fontWeight: '800', color: theme.text, marginBottom: '4px' },
  heroEmail: { color: theme.textMuted, fontSize: '14px', fontWeight: '600' },
  tabs: {
    display: 'flex', justifyContent: 'center', gap: '4px',
    padding: '16px 24px 0',
    background: '#fff', borderBottom: `1px solid ${theme.border}`,
  },
  tab: {
    padding: '10px 24px', background: 'none', border: 'none',
    borderBottom: '3px solid transparent', cursor: 'pointer',
    fontWeight: '700', fontSize: '14px', color: theme.textMuted,
    fontFamily: 'Nunito, sans-serif', transition: 'all 0.2s',
  },
  tabActive: { color: theme.primaryDark, borderBottomColor: theme.primary },
  container: { maxWidth: '700px', margin: '0 auto', padding: '28px 24px' },
  errorBox: {
    background: theme.dangerLight, color: theme.danger,
    padding: '12px 20px', borderRadius: theme.radiusSm,
    fontWeight: '600', fontSize: '14px', marginBottom: '16px',
  },
  successBox: {
    background: theme.successLight, color: '#065f46',
    padding: '12px 20px', borderRadius: theme.radiusSm,
    fontWeight: '600', fontSize: '14px', marginBottom: '16px',
  },
  card: {
    background: '#fff', borderRadius: theme.radius, padding: '28px',
    border: `1px solid ${theme.border}`, boxShadow: theme.shadowCard,
  },
  cardTitle: { fontSize: '18px', fontWeight: '800', color: theme.text, marginBottom: '20px' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  infoItem: {
    display: 'flex', gap: '12px', alignItems: 'flex-start',
    background: theme.bgCardHover, borderRadius: theme.radiusSm,
    padding: '14px', border: `1px solid ${theme.border}`,
  },
  infoIcon: { fontSize: '20px', flexShrink: 0 },
  infoLabel: { fontSize: '11px', fontWeight: '700', color: theme.textMuted, textTransform: 'uppercase', marginBottom: '2px' },
  infoValue: { fontSize: '14px', fontWeight: '700', color: theme.text },
  editProfileBtn: {
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', border: 'none', padding: '11px 24px',
    borderRadius: theme.radiusPill, fontWeight: '700', fontSize: '14px',
    cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
    boxShadow: '0 4px 12px rgba(167,139,250,0.3)',
  },
  field: { marginBottom: '16px' },
  row: { display: 'flex', gap: '12px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '700', color: theme.text, marginBottom: '6px' },
  input: {
    width: '100%', padding: '11px 16px', border: `2px solid ${theme.border}`,
    borderRadius: theme.radiusSm, fontSize: '14px', fontFamily: 'Nunito, sans-serif',
    color: theme.text, outline: 'none', boxSizing: 'border-box', background: '#faf8ff',
  },
  editActions: { display: 'flex', gap: '10px', marginTop: '8px' },
  saveBtn: {
    padding: '11px 24px',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', border: 'none', borderRadius: theme.radiusSm,
    fontWeight: '800', fontSize: '14px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
    boxShadow: '0 4px 12px rgba(167,139,250,0.3)',
  },
  cancelBtn: {
    padding: '11px 20px', background: theme.border, color: theme.textMuted,
    border: 'none', borderRadius: theme.radiusSm,
    fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  // My Posts
  postsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  newPostBtn: {
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', padding: '9px 20px', borderRadius: theme.radiusPill,
    fontWeight: '700', fontSize: '13px', textDecoration: 'none',
    boxShadow: '0 4px 10px rgba(167,139,250,0.3)',
  },
  postsLoading: { textAlign: 'center', color: theme.textMuted, padding: '32px', fontWeight: '600' },
  emptyPosts: {
    textAlign: 'center', padding: '48px 24px',
    background: '#fff', borderRadius: theme.radius, border: `1px solid ${theme.border}`,
  },
  emptyIcon: { fontSize: '48px', display: 'block', marginBottom: '12px' },
  emptyText: { color: theme.textMuted, fontWeight: '600', fontSize: '15px', marginBottom: '16px' },
  writeFirstBtn: {
    display: 'inline-block',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', padding: '11px 24px', borderRadius: theme.radiusPill,
    fontWeight: '800', fontSize: '14px', textDecoration: 'none',
  },
  postsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  postRow: {
    background: '#fff', borderRadius: theme.radius, border: `1px solid ${theme.border}`,
    boxShadow: theme.shadowCard, padding: '16px', display: 'flex', gap: '14px', alignItems: 'center',
  },
  postThumb: { width: '72px', height: '60px', objectFit: 'cover', borderRadius: theme.radiusSm, flexShrink: 0 },
  postRowContent: { flex: 1, minWidth: 0 },
  postRowTitle: {
    fontSize: '15px', fontWeight: '800', color: theme.text, marginBottom: '4px',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  postRowExcerpt: {
    fontSize: '12px', color: theme.textMuted, fontWeight: '600',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px',
  },
  postRowDate: { fontSize: '11px', color: theme.textLight, fontWeight: '600' },
  postRowActions: { flexShrink: 0 },
  viewBtn: {
    display: 'inline-block', padding: '7px 18px',
    background: theme.primaryLight, color: theme.primaryDark,
    borderRadius: theme.radiusPill, fontWeight: '700', fontSize: '13px', textDecoration: 'none',
  },
};
