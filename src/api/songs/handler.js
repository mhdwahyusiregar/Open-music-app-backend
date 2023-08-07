/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const autoBind = require('auto-bind');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.ValidateSongPayload(request.payload);
    const {
      title = 'untitled',
      year,
      genre,
      performer,
      duration = '',
      albumId,
    } = request.payload;
    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'mendapatkan lagu',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();
    const response = songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
    return {
      status: 'success',
      message: 'mendapatkan seluruh lagu',
      data: {
        songs: response,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      message: 'mendapatkan lagu berdasarkan id',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.ValidateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    return {
      status: 'success',
      message: 'mengubah lagu berdasarkan id lagu',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'menghapus lagu berdasarkan id lagu',
    };
  }
}

module.exports = SongHandler;
