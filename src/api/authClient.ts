import { APIRequestContext } from '@playwright/test';
export class AuthClient {
  constructor(private api: APIRequestContext) {}
  async login(email: string, password: string) {
    // Adjust endpoint to real auth route if available
    return await this.api.post('/auth/login', { data: { email, password } });
  }
}
