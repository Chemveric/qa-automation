import fs from 'fs';
import { DriverProvider, CookiesTag } from '../driver/DriverProvider';

export function getAdminCookie(): string {
    const envPath = DriverProvider.getCookiesStateFileName(CookiesTag.Admin);
  try {
    const raw = fs.readFileSync(envPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.adminCookie || '';
  } catch (e) {
  const err = e as Error;
  console.warn('No admin cookie found:', err.message);
  return '';
  }
}
