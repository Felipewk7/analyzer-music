/**
 * Sample pre-analyzed playlist data for instant demo mode without needing Spotify API keys.
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
        topArtists: ['Jorge & Mateus', 'Anitta', 'Thiaguinho', 'Ludmilla', 'Luan Santana']
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
        topArtists: ['AC/DC', 'Queen', 'Led Zeppelin', 'Pink Floyd', 'Guns N\' Roses']
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
        topArtists: ['Dua Lipa', 'The Weeknd', 'Taylor Swift', 'Billie Eilish', 'Post Malone']
    },
    'electronic_vibes': {
        id: 'electronic_vibes',
        name: 'Electronic Rave & House',
        owner: 'Spotify',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
        totalTracks: 60,
        totalArtists: 32,
        predominantGenre: 'Edm / House',
        diversityIndex: 'Concentrado (65/100)',
        genres: [
            { name: 'Edm / House', count: 26, percentage: 43.3, color: '#00E5FF' },
            { name: 'Progressive House', count: 14, percentage: 23.3, color: '#651FFF' },
            { name: 'Electro House', count: 10, percentage: 16.7, color: '#D500F9' },
            { name: 'Deep House', count: 6, percentage: 10.0, color: '#00E676' },
            { name: 'Techno', count: 4, percentage: 6.7, color: '#FF3D00' }
        ],
        topArtists: ['Calvin Harris', 'David Guetta', 'Avicii', 'Tiësto', 'Alok']
    },
    'lofi_chill': {
        id: 'lofi_chill',
        name: 'Lofi Beats to Study/Relax',
        owner: 'Spotify',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
        totalTracks: 80,
        totalArtists: 60,
        predominantGenre: 'Lofi Hip Hop',
        diversityIndex: 'Muito Focado (88/100)',
        genres: [
            { name: 'Lofi Hip Hop', count: 48, percentage: 60.0, color: '#795548' },
            { name: 'Chillhop', count: 16, percentage: 20.0, color: '#8D6E63' },
            { name: 'Jazz Hop', count: 10, percentage: 12.5, color: '#BCAAA4' },
            { name: 'Ambient', count: 6, percentage: 7.5, color: '#D7CCC8' }
        ],
        topArtists: ['ChilledCow', 'Kupla', 'Idealism', 'j\'san', 'Nymano']
    }
};
