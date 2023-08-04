/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const mapDBToModelAlbums = ({ id, name, year, created_at, updated_at }) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToModelAlbums };
