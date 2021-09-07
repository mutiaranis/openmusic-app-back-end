const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (server, { playlistSongsService, validator }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongsService, validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
