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

  postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
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

  getSongsHandler() {
    const songs = this._service.getSongs();
    return {
      status: 'success',
      message: 'Mendapatkan seluruh lagu',
      data: {
        songs,
      },
    };
  }

  getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = this._service.getSongById(id);
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
      const { id } = request.params;
      const {
        title = 'tanpa judul',
        year,
        genre,
        performer,
        duration,
        albumId,
      } = request.payload;

      const updatedSong = await this._service.editSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      if (!updatedSong) {
        const response = h.response({
          status: 'fail',
          message: 'Lagu tidak ditemukan',
        });
        response.code(404);
        return response;
      }

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

  deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteSongById(id);
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
