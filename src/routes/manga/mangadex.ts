import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const mangadex = new MANGA.MangaDex();

  fastify.get(
    '/mangadex/:query',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.params as { query: string }).query;

      const page = (request.query as { page: number }).page;

      const res = await mangadex.search(query, page);

      reply.status(200).send(res);
    }
  );

  fastify.get(
    '/mangadex/info/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = decodeURIComponent((request.params as { id: string }).id);

      try {
        const res = await mangadex
          .fetchMangaInfo(id)
          .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    }
  );

  fastify.get(
    '/mangadex/read/:chapterId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const chapterId = (request.params as { chapterId: string }).chapterId;

      try {
        const res = await mangadex
          .fetchChapterPages(chapterId)
          .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    }
  );
};

export default routes;
