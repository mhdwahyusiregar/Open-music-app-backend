/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelSongs } = require('../../utils/indexSongs');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const songId = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO song (song_id, title, year, genre, performer, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING song_id',
      values: [songId, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Song failed to add');
    }

    return result.rows[0].song_id;
  }

  async getSongs() {
    const query = 'SELECT * FROM song';
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelSongs);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM song WHERE song_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Song not found');
    }

    return mapDBToModelSongs(result.rows[0]);
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE song_id = $7 RETURNING song_id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Failed to update song, Id is not found');
    }

    return result;
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM song WHERE song_id = $1 RETURNING song_id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete song, Id not found');
    }
  }
}

module.exports = SongService;
