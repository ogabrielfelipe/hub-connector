import { JWTService } from "@/infra/security/JWTService";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return reply.status(401).send({ error: "Unauthorized" });

    const payload = new JWTService().verify(token);
    req.user = payload;
  } catch {
    reply.status(401).send({ error: "Invalid token" });
  }
}
