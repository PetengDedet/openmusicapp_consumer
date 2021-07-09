const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer
        FROM playlistsongs ps
        LEFT JOIN songs s ON ps.song_id = s.id
        WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((song) => ({
      ...song,
      id: `song-${song.id}`,
    }));
  }
}

module.exports = PlaylistsService;
