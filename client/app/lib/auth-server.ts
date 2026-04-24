export interface ServerAuthResult {
  accessToken: string;
  user: { id: string; email: string };
}
