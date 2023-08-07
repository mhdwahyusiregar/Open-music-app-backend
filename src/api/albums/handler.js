/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'untitled', year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h
      .response({
        status: 'success',
        message: 'Menambahkan Album',
        data: {
          albumId,
        },
      })
      .code(201);

    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();

    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const albumData = await this._service.getAlbumById(id);

    const album = {
      id: albumData.rows[0].album_id,
      name: albumData.rows[0].name,
      year: albumData.rows[0].year,
      songs: albumData.rows.map((song) => ({
        id: song.song_id,
        title: song.title,
        performer: song.performer,
      })),
    };

    const response = {
      status: 'success',
      message: 'Mendapatkan album berdasarkan id',
      data: {
        album,
      },
    };

    return response;
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Mengubah album berdasarkan id album',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Menghapus album berdasarkan id album',
    };
  }
}

module.exports = AlbumHandler;
