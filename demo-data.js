/**
 * Sample pre-analyzed playlist data with complete artist frequency lists.
 */
const DEMO_PLAYLISTS = {
    'top_brasil': {
        id: 'top_brasil',
        name: 'Top Brasil 2026',
        owner: 'Spotify',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
        totalTracks: 50,
        totalArtists: 42,
        predominantGenre: 'Sertanejo Pop',
        diversityIndex: 'Médio-Alto (72/100)',
        genres: [
            { name: 'Sertanejo Pop', count: 18, percentage: 36.0, color: '#1DB954' },
            { name: 'Funk Carioca', count: 12, percentage: 24.0, color: '#FF4081' },
            { name: 'Pagode', count: 8, percentage: 16.0, color: '#FFB300' },
            { name: 'MPB', count: 5, percentage: 10.0, color: '#00E676' },
            { name: 'Pop Nacional', count: 4, percentage: 8.0, color: '#00B0FF' },
            { name: 'Trap Brasileiro', count: 3, percentage: 6.0, color: '#7C4DFF' }
        ],
        allArtists: [
            { id: '1', name: 'Jorge & Mateus', count: 8, percentage: 16.0, genres: ['Sertanejo Pop'] },
            { id: '2', name: 'Anitta', count: 6, percentage: 12.0, genres: ['Funk Carioca', 'Pop'] },
            { id: '3', name: 'Thiaguinho', count: 5, percentage: 10.0, genres: ['Pagode'] },
            { id: '4', name: 'Ludmilla', count: 4, percentage: 8.0, genres: ['Pagode', 'Funk'] },
            { id: '5', name: 'Henrique & Juliano', count: 4, percentage: 8.0, genres: ['Sertanejo'] },
            { id: '6', name: 'Marília Mendonça', count: 4, percentage: 8.0, genres: ['Sertanejo Pop'] },
            { id: '7', name: 'Luan Santana', count: 3, percentage: 6.0, genres: ['Sertanejo'] },
            { id: '8', name: 'MC Ryan SP', count: 3, percentage: 6.0, genres: ['Funk Carioca'] },
            { id: '9', name: 'Matuê', count: 2, percentage: 4.0, genres: ['Trap Brasileiro'] },
            { id: '10', name: 'Melim', count: 2, percentage: 4.0, genres: ['MPB', 'Pop'] }
        ]
    },
    'rock_classics': {
        id: 'rock_classics',
        name: 'Rock Classics Legend',
        owner: 'Spotify',
        image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80',
        totalTracks: 75,
        totalArtists: 38,
        predominantGenre: 'Classic Rock',
        diversityIndex: 'Focado (58/100)',
        genres: [
            { name: 'Classic Rock', count: 32, percentage: 42.7, color: '#E53935' },
            { name: 'Hard Rock', count: 20, percentage: 26.7, color: '#FF6D00' },
            { name: 'Album Rock', count: 11, percentage: 14.7, color: '#FFB300' },
            { name: 'Blues Rock', count: 7, percentage: 9.3, color: '#8D6E63' },
            { name: 'Psychedelic Rock', count: 5, percentage: 6.6, color: '#AB47BC' }
        ],
        allArtists: [
            { id: 'r1', name: 'Queen', count: 12, percentage: 16.0, genres: ['Classic Rock'] },
            { id: 'r2', name: 'AC/DC', count: 10, percentage: 13.3, genres: ['Hard Rock'] },
            { id: 'r3', name: 'Led Zeppelin', count: 9, percentage: 12.0, genres: ['Classic Rock'] },
            { id: 'r4', name: 'Pink Floyd', count: 8, percentage: 10.6, genres: ['Psychedelic Rock'] },
            { id: 'r5', name: 'Guns N\' Roses', count: 7, percentage: 9.3, genres: ['Hard Rock'] },
            { id: 'r6', name: 'Aerosmith', count: 6, percentage: 8.0, genres: ['Hard Rock'] },
            { id: 'r7', name: 'The Beatles', count: 5, percentage: 6.6, genres: ['Classic Rock'] },
            { id: 'r8', name: 'Rolling Stones', count: 5, percentage: 6.6, genres: ['Blues Rock'] }
        ]
    },
    'global_pop': {
        id: 'global_pop',
        name: 'Today\'s Top Hits',
        owner: 'Spotify',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
        totalTracks: 50,
        totalArtists: 45,
        predominantGenre: 'Dance Pop',
        diversityIndex: 'Alto (84/100)',
        genres: [
            { name: 'Dance Pop', count: 19, percentage: 38.0, color: '#1DB954' },
            { name: 'Pop', count: 13, percentage: 26.0, color: '#E91E63' },
            { name: 'Contemporary R&B', count: 7, percentage: 14.0, color: '#9C27B0' },
            { name: 'Trap / Hip Hop', count: 6, percentage: 12.0, color: '#3F51B5' },
            { name: 'Indie Pop', count: 5, percentage: 10.0, color: '#00BCD4' }
        ],
        allArtists: [
            { id: 'p1', name: 'The Weeknd', count: 7, percentage: 14.0, genres: ['Dance Pop', 'R&B'] },
            { id: 'p2', name: 'Dua Lipa', count: 6, percentage: 12.0, genres: ['Dance Pop'] },
            { id: 'p3', name: 'Taylor Swift', count: 5, percentage: 10.0, genres: ['Pop'] },
            { id: 'p4', name: 'Billie Eilish', count: 4, percentage: 8.0, genres: ['Indie Pop'] },
            { id: 'p5', name: 'Post Malone', count: 4, percentage: 8.0, genres: ['Trap / Hip Hop'] }
        ]
    }
};
