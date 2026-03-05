import fp from "fastify-plugin";
import oauth2, { FastifyOAuth2Options } from "@fastify/oauth2";
import { env } from "@/infra/config/env";
import { FastifyInstance } from "fastify";

export const registerOAuth2 = fp(
  async (app: FastifyInstance) => {
    const options: FastifyOAuth2Options = {
      name: "githubOAuth2",
      scope: ["user:email", "read:user"],
      credentials: {
        client: {
          id: env.GITHUB_CLIENT_ID,
          secret: env.GITHUB_CLIENT_SECRET,
        },
        auth: oauth2.GITHUB_CONFIGURATION,
      },
      startRedirectPath: "/login/github",
      callbackUri: env.GITHUB_CALLBACK_URL,
    };

    await app.register(oauth2, options);
  },
  {
    name: "oauth2-plugin",
  },
);
