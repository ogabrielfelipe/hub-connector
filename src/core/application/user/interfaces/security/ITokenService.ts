export interface ITokenService {
  generate({ userId, role }: { userId: string; role: string }): string;
  verify(token: string): { userId: string; role: string };
}
