/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbums } = require('../../utils/indexAlbums');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const albumId = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album (album_id, name, year) VALUES ($1, $2, $3) RETURNING album_id',
      values: [albumId, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].album_id;
  }

  async getAlbums() {
    const query = 'SELECT * FROM album';
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelAlbums); // Jika diperlukan
  }

  async getAlbumById(id) {
    const query = {
      text: `
        SELECT album.album_id, name, album.year, song_id, song.title, song.performer
        FROM album
        LEFT JOIN song ON song.album_id = album.album_id
        WHERE album.album_id = $1
      `,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return result;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE album_id = $3 RETURNING album_id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album, Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE album_id = $1 RETURNING album_id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
