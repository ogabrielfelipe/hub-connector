/* eslint-disable @typescript-eslint/no-explicit-any */
import fastifyBasicAuth from "@fastify/basic-auth";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

import fs from "fs";

export function configureSwagger(app: FastifyInstance) {
    app.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Hub Connector API",
                version: "1.0.0",
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ]
        },
        transform: jsonSchemaTransform,
    });

    app.register(async function (instance) {
        await instance.register(fastifyBasicAuth, {
            validate: async (username, password) => {
                const valid =
                    username === process.env.SWAGGER_USER &&
                    password === process.env.SWAGGER_PASSWORD;

                if (!valid) {
                    return new Error('Unauthorized');
                }
            },
            authenticate: { realm: 'docs' },
        });

        // Scoped error handler -- catches the auth error BEFORE your global handler
        instance.setErrorHandler((error, req, reply) => {
            if ((error as any).statusCode === 401) {
                reply
                    .code(401)
                    .header('WWW-Authenticate', 'Basic realm="docs"')
                    .send({ message: 'Unauthorized' });
                return;
            }
            // For non-auth errors, delegate to the parent error handler
            throw error;
        });

        instance.addHook('onRequest', instance.basicAuth);

        await instance.register(fastifySwaggerUi, {
            routePrefix: '/docs',
        });
    });
}


export function generateSwaggerFiles(app: FastifyInstance) {
    const fullSwagger = app.swagger();

    fs.writeFileSync(
        "./swagger.json",
        JSON.stringify(fullSwagger, null, 2)
    );

    const publicPaths = Object.fromEntries(
        Object.entries(fullSwagger.paths).filter(([_, methods]: any) =>
            Object.values(methods).some((method: any) =>
                method.tags?.includes("Public")
            )
        )
            .map(([path, methods]: any) => [
                path,
                Object.fromEntries(
                    Object.entries(methods).map(([method, details]: any) => [
                        method,
                        details.tags
                            ? {
                                ...details,
                                tags: details.tags.filter((tag: string) => tag !== "Public"),
                            }
                            : details,
                    ])
                ),
            ])
    );




    const publicSwagger = {
        ...fullSwagger,
        paths: publicPaths,
    };

    fs.writeFileSync(
        "./public-docs/swagger-public.json",
        JSON.stringify(publicSwagger, null, 2)
    );
}