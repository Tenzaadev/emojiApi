// src/components/EmojiFinder.tsx
import { useState, useEffect } from 'react';
import { getEmojis, type IEmojiItem } from '../api/emojiApi';

function EmojiFinder() {
    const [emojis, setEmojis] = useState<IEmojiItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [searchTerm]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEmojis(searchTerm);
            setEmojis(data);
        } catch (err) {
            setError('Не удалось загрузить данные. Проверьте, запущен ли сервер (start.bat).');
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h1>Поиск эмодзи</h1>

            <div style={{ marginBottom: '30px' }}>
                <input
                    type="text"
                    placeholder="Введите название или ключевое слово..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '100%',
                        boxSizing: 'border-box',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                    }}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        style={{
                            marginTop: '10px',
                            cursor: 'pointer',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            background: '#fff',
                        }}
                    >
                        Очистить поиск
                    </button>
                )}
            </div>

            {loading && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Загрузка эмодзи...
                </div>
            )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '15px',
                }}
            >
                {!loading && emojis.length === 0 ? (
                    <p>Эмодзи не найдены</p>
                ) : (
                    emojis.map((emoji, index) => (
                        <div
                            key={emoji.title + index}
                            style={{
                                border: '1px solid #ddd',
                                padding: '15px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                backgroundColor: '#f9f9f9',
                                transition: 'transform 0.2s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <div style={{ fontSize: '40px', lineHeight: '1' }}>{emoji.emoji}</div>
                            <h3 style={{ margin: '10px 0 5px', fontSize: '16px' }}>{emoji.title}</h3>
                            <small style={{ color: '#666', display: 'block' }}>
                                {emoji.keywords}
                            </small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default EmojiFinder;