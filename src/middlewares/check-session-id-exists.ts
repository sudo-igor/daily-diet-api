import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdSession(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = req.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      message: 'Não autorizado. Cookie de sessão não encontrado.'
    })
  }
}
