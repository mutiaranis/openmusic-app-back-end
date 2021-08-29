require('dotenv').config();

const Hapi = require('@hapi/hapi');

// songs
const songs = require('./api/songs');
const ClientError = require('./exceptions/ClientError');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // extensions function untuk life cycle onPreResponse
  server.ext('onPreResponse', (request, h) => {
    const { response } = request; // mendapatkan konteks response dari request

    if (response instanceof ClientError) {
      const newResponse = h.response({ // membuat response baru dari response toolkit
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return response.continue || response; // jika bukan ClientError lanjutkan response sebelumnya
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
