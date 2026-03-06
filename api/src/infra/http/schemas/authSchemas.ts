import z from "zod";

export const LoginSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
});

export const MeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  providerId: z.string().optional(),
  avatar: z.string().optional(),
  active: z.boolean(),
});


export const GitHubCallbackSchema = z.object({
  code: z.string(),
  state: z.string(),
});

export const GitHubGetUrlResponseSchema = z.object({
  url: z.string(),
});