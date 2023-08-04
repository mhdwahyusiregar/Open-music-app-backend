/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const mapDBToModelSongs = ({
  id,
  title,
  performer,
  genre,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  performer,
  genre,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModelSongs };
