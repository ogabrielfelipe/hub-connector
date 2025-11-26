import { FastifyReply, FastifyRequest } from "fastify";
import { defineAbilityFor } from "@/core/application/security/casl.factory";
import { Actions, Subjects } from "@/core/application/security/casl.types";

export function authorize(action: Actions, subject: Subjects) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.user) return reply.status(401).send({ error: "Unauthorized" });

    const ability = defineAbilityFor(req.user.role);

    if (ability.cannot(action, subject)) {
      return reply.status(403).send({ error: "User is not authorized to perform this action" });
    }
  };
}
