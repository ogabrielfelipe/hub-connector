import { FastifyInstance } from "fastify";
import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";

export async function loginAsAdmin(app: FastifyInstance) {

    await app.db.user.create({
        _id: uuidV4(),
        name: "Admin",
        email: "admin@test.com",
        role: 'admin',
        username: "admin",
        password: bcrypt.hashSync("123456", 10)
    });

    const res = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
            username: "admin",
            password: "123456"
        }
    });

    const data = res.json();

    return data.token;
}
