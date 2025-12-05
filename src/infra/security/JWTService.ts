import { ITokenService } from "@/core/application/user/interfaces/security/ITokenService";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export class JWTService implements ITokenService {
  private readonly PUBLIC_KEY = env.PUBLIC_KEY;
  private readonly PRIVATE_KEY = env.PRIVATE_KEY;

  generate(payload: object) {
    return jwt.sign(payload, Buffer.from(this.PRIVATE_KEY, "base64"), {
      expiresIn: "1h",
      algorithm: "RS256",
    });
  }
  verify(token: string) {
    return jwt.verify(token, Buffer.from(this.PUBLIC_KEY, "base64")) as {
      userId: string;
      role: string;
    };
  }
}
