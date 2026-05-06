import React, { useState } from 'react';
import './Library.css';

const STATUS_LABELS = {
    READ:    { label: 'READ',    cls: 'status-read' },
    READING: { label: 'READING', cls: 'status-reading' },
    QUEUED:  { label: 'QUEUED',  cls: 'status-queued' },
};

function StarInput({ value, onChange }) {
    return (
        <div className="star-input">
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    className={`star-pick ${n <= value ? 'filled' : ''}`}
                    onClick={() => onChange(n)}
                >★</span>
            ))}
        </div>
    );
}

function Library() {
    const [books, setBooks] = useState(() => {
        try { return JSON.parse(localStorage.getItem('orderland-library')) || []; }
        catch { return []; }
    });
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter]   = useState('ALL');
    const [form, setForm] = useState({ title: '', author: '', status: 'READ', rating: 5 });

    const save = (next) => {
        setBooks(next);
        localStorage.setItem('orderland-library', JSON.stringify(next));
    };

    const addBook = () => {
        if (!form.title.trim()) return;
        save([...books, { ...form, id: Date.now() }]);
        setForm({ title: '', author: '', status: 'READ', rating: 5 });
        setShowForm(false);
    };

    const removeBook = (id) => save(books.filter(b => b.id !== id));

    const visible = filter === 'ALL' ? books : books.filter(b => b.status === filter);

    const counts = books.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="library-container">
            <div className="game-header">
                <span className="module-tag">MOD: 004 // CODEX_PROTOCOL</span>
                <h2 className="game-title">CODEX</h2>
            </div>

            {/* İstatistik */}
            <div className="lib-stats">
                <span className="lib-stat"><span className="stat-val">{books.length}</span> ENTRIES</span>
                <span className="lib-stat"><span className="stat-val status-read">{counts.READ || 0}</span> READ</span>
                <span className="lib-stat"><span className="stat-val status-reading">{counts.READING || 0}</span> READING</span>
                <span className="lib-stat"><span className="stat-val status-queued">{counts.QUEUED || 0}</span> QUEUED</span>
            </div>

            {/* Filtre */}
            <div className="lib-filters">
                {['ALL', 'READ', 'READING', 'QUEUED'].map(f => (
                    <button
                        key={f}
                        className={`lib-filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >{f}</button>
                ))}
            </div>

            {/* Kitap Listesi */}
            <div className="lib-list">
                {visible.length === 0 ? (
                    <div className="lib-empty">
                        {books.length === 0
                            ? '> NO ENTRIES FOUND. LOG YOUR FIRST BOOK.'
                            : '> NO ENTRIES MATCH FILTER.'}
                    </div>
                ) : (
                    visible.map(book => (
                        <div key={book.id} className="lib-entry">
                            <span className={`lib-status ${STATUS_LABELS[book.status].cls}`}>
                                {STATUS_LABELS[book.status].label}
                            </span>
                            <span className="lib-stars">
                                {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                            </span>
                            <div className="lib-info">
                                <span className="lib-title">"{book.title}"</span>
                                {book.author && (
                                    <span className="lib-author"> — {book.author}</span>
                                )}
                            </div>
                            <button
                                className="lib-delete"
                                onClick={() => removeBook(book.id)}
                                title="Delete"
                            >✕</button>
                        </div>
                    ))
                )}
            </div>

            {/* Form */}
            {showForm ? (
                <div className="lib-form">
                    <input
                        className="lib-input"
                        placeholder="TITLE"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && addBook()}
                        autoFocus
                    />
                    <input
                        className="lib-input"
                        placeholder="AUTHOR (optional)"
                        value={form.author}
                        onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    />
                    <div className="lib-form-row">
                        <select
                            className="lib-select"
                            value={form.status}
                            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        >
                            <option value="READ">READ</option>
                            <option value="READING">READING</option>
                            <option value="QUEUED">QUEUED</option>
                        </select>
                        <StarInput
                            value={form.rating}
                            onChange={r => setForm(f => ({ ...f, rating: r }))}
                        />
                    </div>
                    <div className="lib-form-actions">
                        <button className="lib-add-confirm" onClick={addBook}>LOG_ENTRY</button>
                        <button className="lib-cancel" onClick={() => setShowForm(false)}>CANCEL</button>
                    </div>
                </div>
            ) : (
                <button className="lib-add-btn" onClick={() => setShowForm(true)}>
                    + ADD_ENTRY
                </button>
            )}
        </div>
    );
}

export default Library;
