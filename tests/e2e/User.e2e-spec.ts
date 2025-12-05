import { buildServer } from "../../src/server";
import { FastifyInstance } from "fastify";
import { loginAsAdmin } from "./utils/auth";

import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";


let app: FastifyInstance;

describe("User E2E", () => {

    beforeAll(async () => {
        app = await buildServer();
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    });


    it('should be able to create a User', async () => {
        const token = await loginAsAdmin(app);

        const response = await app.inject({
            method: 'POST',
            url: '/users',
            headers: {
                Authorization: `Bearer ${token}`
            },
            payload: {
                "name": "John Doe USER",
                "email": "john2.doe@mail.com",
                "role": "user",
                "username": "john2.doe",
                "password": "Test@123"
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toHaveProperty("userId");
    })

    it('should be able to Update a user existing', async () => {
        const token = await loginAsAdmin(app);

        const user = await app.db.user.create({
            _id: uuidV4(),
            name: "John Doe USER",
            email: "john2.doe@mail.com",
            role: 'user',
            username: "john2.doe",
            password: bcrypt.hashSync("123456", 10)
        });

        const response = await app.inject({
            method: 'PUT',
            url: `/users/${user._id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            payload: {
                "name": "John Doe Updated",
            },
        });


        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(expect.objectContaining({
            name: "John Doe Updated",
        }));
    })

    it('should be able to delete a user existing', async () => {
        const token = await loginAsAdmin(app);

        const user = await app.db.user.create({
            _id: uuidV4(),
            name: "John Doe USER",
            email: "john2.doe@mail.com",
            role: 'user',
            username: "john2.doe",
            password: bcrypt.hashSync("123456", 10)
        });

        const response = await app.inject({
            method: 'DELETE',
            url: `/users/${user._id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        expect(response.statusCode).toBe(204);

        const userDeleted = await app.db.user.findById(user._id);

        expect(userDeleted).toBeNull();
    })


    it('should be able to find by id a user existing', async () => {
        const token = await loginAsAdmin(app);

        const user = await app.db.user.create({
            _id: uuidV4(),
            name: "John Doe USER",
            email: "john2.doe@mail.com",
            role: 'user',
            username: "john2.doe",
            password: bcrypt.hashSync("123456", 10)
        });

        const response = await app.inject({
            method: 'GET',
            url: `/users/${user._id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(expect.objectContaining({
            name: "John Doe USER",
        }));
    })

    it('should be able to list all users', async () => {
        const token = await loginAsAdmin(app);

        await app.db.user.create({
            _id: uuidV4(),
            name: "John Doe USER",
            email: "john.doe@mail.com",
            role: 'user',
            username: "john.doe",
            password: bcrypt.hashSync("123456", 10)
        });

        await app.db.user.create({
            _id: uuidV4(),
            name: "John Doe USER 2",
            email: "john2.doe2@mail.com",
            role: 'user',
            username: "john2.doe2",
            password: bcrypt.hashSync("123456", 10)
        });

        const response = await app.inject({
            method: 'GET',
            url: `/users`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().docs).toEqual(expect.arrayContaining([
            expect.objectContaining({
                name: "John Doe USER",
            }),
            expect.objectContaining({
                name: "John Doe USER 2",
            })
        ]));


        const response2 = await app.inject({
            method: 'GET',
            url: `/users?page=1&limit=1&role=user`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        expect(response2.statusCode).toBe(200);
        expect(response2.json().docs).toEqual(expect.arrayContaining([
            expect.objectContaining({
                name: "John Doe USER",
            })
        ]));
        expect(response2.json().page).toBe(1);
        expect(response2.json().limit).toBe(1);
        expect(response2.json().total).toBe(2);
    })
})