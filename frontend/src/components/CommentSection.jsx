import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

export default function CommentSection({ postId, comments: initialComments }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/comment/${postId}`, { content: newComment });
      // Re-fetch this post's data to get updated comments with author info
      const res = await api.get(`/post`);
      const updated = res.data.allPosts?.find((p) => p.id === postId);
      if (updated) setComments(updated.comments || []);
      setNewComment('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      await api.put(`/comment/${commentId}`, { content: editContent });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: editContent } : c))
      );
      setEditingId(null);
      setEditContent('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  const isMyComment = (comment) =>
    user && comment.author && comment.author.username === user.username;

  return (
    <div style={s.section}>
      <h3 style={s.heading}>
        <span style={s.headingIcon}>💬</span>
        Comments <span style={s.count}>({comments.length})</span>
      </h3>

      {error && <div style={s.errorBox}>{error}</div>}

      {/* Add comment form */}
      {user ? (
        <form onSubmit={handleAddComment} style={s.form}>
          <div style={s.inputRow}>
            <div style={s.myAvatar}>
              {user.avatar
                ? <img src={`https://zonal-growth-production-561c.up.railway.app/${user.avatar}`} alt="" style={s.myAvatarImg} />
                : <span>{user.username?.[0]?.toUpperCase()}</span>
              }
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              style={s.textarea}
              rows={2}
            />
          </div>
          <div style={s.formFooter}>
            <button type="submit" disabled={submitting} style={s.submitBtn}>
              {submitting ? 'Posting…' : '✉️ Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div style={s.loginNote}>
          Please <a href="/login" style={s.loginLink}>log in</a> to leave a comment.
        </div>
      )}

      {/* Comments list */}
      <div style={s.list}>
        {comments.length === 0 ? (
          <div style={s.empty}>No comments yet — be the first! 🌸</div>
        ) : (
          comments.map((comment, i) => {
            const initial = comment.author?.username?.[0]?.toUpperCase() || '?';
            const avatarUrl = comment.author?.avatar ? `https://zonal-growth-production-561c.up.railway.app/${comment.author.avatar}` : null;
            const isMine = isMyComment(comment);
            return (
              <div key={comment.id} style={{ ...s.bubble, ...(isMine ? s.bubbleMine : {}) }}>
                <div style={{ ...s.commentAvatar, ...(isMine ? s.commentAvatarMine : {}) }}>
                  {avatarUrl ? <img src={avatarUrl} alt="" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} /> : initial}
                </div>
                <div style={s.bubbleContent}>
                  <div style={s.bubbleHeader}>
                    <span style={s.commenter}>{comment.author?.username || 'User'}</span>
                    {isMine && (
                      <div style={s.actions}>
                        <button onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }} style={s.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(comment.id)} style={s.deleteBtn}>Delete</button>
                      </div>
                    )}
                  </div>

                  {editingId === comment.id ? (
                    <div style={s.editBox}>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={s.editTextarea}
                        rows={2}
                      />
                      <div style={s.editBtns}>
                        <button onClick={() => handleSaveEdit(comment.id)} style={s.saveBtn}>Save</button>
                        <button onClick={() => setEditingId(null)} style={s.cancelBtn}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p style={s.commentText}>{comment.content}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const s = {
  section: {
    marginTop: '32px',
    padding: '28px 32px 32px',
    borderTop: `1px solid ${theme.border}`,
    background: theme.bgCardHover,
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: '800',
    color: theme.text,
    marginBottom: '20px',
  },
  headingIcon: { fontSize: '20px' },
  count: { color: theme.textMuted, fontWeight: '600', fontSize: '15px' },
  errorBox: {
    background: theme.dangerLight,
    color: theme.danger,
    padding: '10px 16px',
    borderRadius: theme.radiusSm,
    fontSize: '13px',
    marginBottom: '12px',
    fontWeight: '600',
  },
  form: {
    marginBottom: '24px',
    background: '#fff',
    borderRadius: theme.radiusSm,
    padding: '16px',
    border: `1px solid ${theme.border}`,
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  myAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: theme.primary,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0,
    overflow: 'hidden',
  },
  myAvatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  textarea: {
    flex: 1,
    padding: '10px 14px',
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radiusSm,
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'Nunito, sans-serif',
    color: theme.text,
    lineHeight: '1.6',
    transition: 'border 0.2s',
    background: '#faf8ff',
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px',
  },
  submitBtn: {
    background: theme.primary,
    color: '#fff',
    border: 'none',
    padding: '9px 22px',
    borderRadius: theme.radiusSm,
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    opacity: 1,
    transition: 'opacity 0.2s',
  },
  loginNote: {
    textAlign: 'center',
    color: theme.textMuted,
    fontSize: '14px',
    padding: '16px',
    background: '#fff',
    borderRadius: theme.radiusSm,
    marginBottom: '20px',
    border: `1px solid ${theme.border}`,
  },
  loginLink: { color: theme.primaryDark, fontWeight: '700' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  empty: {
    textAlign: 'center',
    color: theme.textMuted,
    fontStyle: 'italic',
    padding: '24px',
    fontSize: '14px',
  },
  bubble: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  bubbleMine: { flexDirection: 'row' },
  commentAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: theme.mintLight,
    color: '#059669',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
    flexShrink: 0,
  },
  commentAvatarMine: {
    background: theme.accentLight,
    color: theme.accentDark,
  },
  bubbleContent: {
    flex: 1,
    background: '#fff',
    borderRadius: theme.radiusSm,
    padding: '16px',
    border: `1px solid ${theme.border}`,
  },
  bubbleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  commenter: {
    fontWeight: '700',
    fontSize: '13px',
    color: theme.text,
  },
  actions: { display: 'flex', gap: '8px' },
  editBtn: {
    background: 'none', border: 'none', color: theme.primary,
    fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  deleteBtn: {
    background: 'none', border: 'none', color: theme.danger,
    fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  commentText: { fontSize: '14px', color: theme.text, lineHeight: '1.6' },
  editBox: { display: 'flex', flexDirection: 'column', gap: '8px' },
  editTextarea: {
    width: '100%',
    padding: '8px 12px',
    border: `2px solid ${theme.border}`,
    borderRadius: theme.radiusSm,
    fontSize: '14px',
    resize: 'none',
    fontFamily: 'Nunito, sans-serif',
    color: theme.text,
    outline: 'none',
  },
  editBtns: { display: 'flex', gap: '8px' },
  saveBtn: {
    padding: '5px 16px', background: theme.mint, color: '#065f46',
    border: 'none', borderRadius: theme.radiusPill, fontWeight: '700',
    fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  cancelBtn: {
    padding: '5px 16px', background: theme.border, color: theme.textMuted,
    border: 'none', borderRadius: theme.radiusPill, fontWeight: '700',
    fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
};
