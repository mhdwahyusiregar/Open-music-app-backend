/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    try {
      await this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;

      const songId = this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      const response = h.response({
        status: 'success',
        message: 'Menambahkan lagu',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();
    const simplifiedSongs = songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

    return {
      status: 'success',
      message: 'Mendapatkan seluruh lagu',
      data: {
        songs: simplifiedSongs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      const response = h.response({
        status: 'success',
        message: 'Mendapatkan lagu berdasarkan id',
        data: {
          song,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration } = request.payload;
      const { id } = request.params;

      await this._service.editSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
      });

      const response = h.response({
        status: 'success',
        message: 'Berhasil mengubah lagu berdasarkan ID lagu',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);

      const response = h.response({
        status: 'success',
        message: 'Menghapus lagu berdasarkan id',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = SongsHandler;
