import React, { useState, useRef } from 'react';
import './MediaArchive.css';

const CATEGORIES = [
    { key: 'FILM',       label: 'FILM',       color: '#c084fc' },
    { key: 'SERİ',       label: 'SERİ',       color: '#60a5fa' },
    { key: 'ANİME',      label: 'ANİME',      color: '#f472b6' },
    { key: 'BELGESEL',   label: 'BELGESEL',   color: '#34d399' },
    { key: 'OYUN',       label: 'OYUN',       color: '#fb923c' },
    { key: 'DİĞER',      label: 'DİĞER',      color: '#94a3b8' },
];

const STATUS_OPTS = [
    { key: 'WATCHED',   label: 'WATCHED'  },
    { key: 'WATCHING',  label: 'WATCHING' },
    { key: 'QUEUED',    label: 'QUEUED'   },
];

function getCatColor(key) {
    return CATEGORIES.find(c => c.key === key)?.color || '#94a3b8';
}

function DVD({ item, isSelected, onClick }) {
    const color = getCatColor(item.category);
    return (
        <div
            className={`dvd-spine${isSelected ? ' dvd-selected' : ''}`}
            style={{ '--dvd-color': color }}
            onClick={onClick}
            title={item.title}
        >
            <span className="dvd-cat-dot" />
            <span className="dvd-title-text">{item.title}</span>
            {item.year && <span className="dvd-year">{item.year}</span>}
        </div>
    );
}

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

function MediaArchive() {
    const [items, setItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem('orderland-archive')) || []; }
        catch { return []; }
    });
    const [selected, setSelected]   = useState(null);
    const [showForm, setShowForm]   = useState(false);
    const [catFilter, setCatFilter] = useState('ALL');
    const [form, setForm] = useState({
        title: '', category: 'FILM', status: 'WATCHED', rating: 5, year: ''
    });
    const shelfRef = useRef(null);

    const save = (next) => {
        setItems(next);
        localStorage.setItem('orderland-archive', JSON.stringify(next));
    };

    const addItem = () => {
        if (!form.title.trim()) return;
        const next = [...items, { ...form, id: Date.now() }];
        save(next);
        setForm({ title: '', category: 'FILM', status: 'WATCHED', rating: 5, year: '' });
        setShowForm(false);
    };

    const removeItem = (id) => {
        save(items.filter(i => i.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    const visible = catFilter === 'ALL' ? items : items.filter(i => i.category === catFilter);

    const counts = items.reduce((acc, i) => {
        acc[i.category] = (acc[i.category] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="archive-container">
            <div className="game-header">
                <span className="module-tag">MOD: 005 // MEDIA_ARCHIVE_PROTOCOL</span>
                <h2 className="game-title">ARCHIVE</h2>
            </div>

            {/* Toplam / Kategori Sayıları */}
            <div className="arc-stats">
                <span className="arc-stat-total">{items.length} FILES LOGGED</span>
                <div className="arc-cat-pills">
                    {CATEGORIES.filter(c => counts[c.key]).map(c => (
                        <span key={c.key} className="arc-cat-pill" style={{ borderColor: c.color, color: c.color }}>
                            {c.label} {counts[c.key]}
                        </span>
                    ))}
                </div>
            </div>

            {/* Kategori Filtresi */}
            <div className="arc-filters">
                {['ALL', ...CATEGORIES.map(c => c.key)].map(f => (
                    <button
                        key={f}
                        className={`lib-filter-btn ${catFilter === f ? 'active' : ''}`}
                        style={catFilter === f && f !== 'ALL' ? {
                            borderColor: getCatColor(f),
                            color: getCatColor(f),
                        } : {}}
                        onClick={() => { setCatFilter(f); setSelected(null); }}
                    >{f}</button>
                ))}
            </div>

            {/* DVD Rafı */}
            {visible.length === 0 ? (
                <div className="arc-empty">
                    {items.length === 0
                        ? '> NO FILES IN DATABASE. ARCHIVE YOUR FIRST MEDIA.'
                        : '> NO FILES MATCH FILTER.'}
                </div>
            ) : (
                <div className="dvd-shelf" ref={shelfRef}>
                    <div className="dvd-shelf-inner">
                        {visible.map(item => (
                            <DVD
                                key={item.id}
                                item={item}
                                isSelected={selected?.id === item.id}
                                onClick={() => setSelected(s => s?.id === item.id ? null : item)}
                            />
                        ))}
                    </div>
                    <div className="shelf-plank" />
                </div>
            )}

            {/* Seçili DVD Detayı */}
            {selected && (
                <div className="dvd-detail" style={{ '--dvd-color': getCatColor(selected.category) }}>
                    <div className="dvd-detail-header">
                        <span className="dvd-detail-cat" style={{ color: getCatColor(selected.category) }}>
                            [{selected.category}]
                        </span>
                        <span className="dvd-detail-title">{selected.title}</span>
                        {selected.year && <span className="dvd-detail-year">{selected.year}</span>}
                    </div>
                    <div className="dvd-detail-meta">
                        <span className="dvd-detail-stars">{'★'.repeat(selected.rating)}{'☆'.repeat(5 - selected.rating)}</span>
                        <span className="dvd-detail-status">{selected.status}</span>
                        <button className="dvd-delete-btn" onClick={() => removeItem(selected.id)}>✕ DELETE</button>
                    </div>
                </div>
            )}

            {/* Form */}
            {showForm ? (
                <div className="lib-form arc-form">
                    <input
                        className="lib-input"
                        placeholder="TITLE"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && addItem()}
                        autoFocus
                    />
                    <div className="arc-form-row">
                        <select
                            className="lib-select"
                            value={form.category}
                            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        >
                            {CATEGORIES.map(c => (
                                <option key={c.key} value={c.key}>{c.label}</option>
                            ))}
                        </select>
                        <select
                            className="lib-select"
                            value={form.status}
                            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        >
                            {STATUS_OPTS.map(s => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                        </select>
                        <input
                            className="lib-input arc-year-input"
                            placeholder="YEAR"
                            value={form.year}
                            maxLength={4}
                            onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                        />
                    </div>
                    <StarInput value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
                    <div className="lib-form-actions">
                        <button className="lib-add-confirm" onClick={addItem}>LOG_FILE</button>
                        <button className="lib-cancel" onClick={() => setShowForm(false)}>CANCEL</button>
                    </div>
                </div>
            ) : (
                <button className="lib-add-btn" onClick={() => setShowForm(true)}>
                    + ADD_FILE
                </button>
            )}
        </div>
    );
}

export default MediaArchive;
