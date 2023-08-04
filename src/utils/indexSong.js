/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const mapDBToModelSong = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = { mapDBToModelSong };
