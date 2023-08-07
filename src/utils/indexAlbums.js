/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const mapDBToModelAlbums = ({ album_id, name, year }) => ({
  id: album_id,
  name,
  year,
});

module.exports = { mapDBToModelAlbums };
