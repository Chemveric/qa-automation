import { BaseAPIClient } from '../core/BaseAPIClient';

export class AuthClient extends BaseAPIClient {
  async health() {
    return this.get('/auth/login');
  }
}
