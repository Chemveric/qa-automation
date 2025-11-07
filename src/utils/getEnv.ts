import fs from 'fs';
import { DriverProvider, CookiesTag } from '../driver/DriverProvider';

export function getAdminCookie(): string {
    const storagePath = DriverProvider.getCookiesStateFileName(CookiesTag.Admin);
  try {
    const storage = JSON.parse(fs.readFileSync(storagePath, "utf8"));
    const cookies = storage.cookies;
    const sessionCookie = storage.cookies.find(
    (cookie: { name: string; value: string }) => cookie.name === "__Secure-admin-sid");
    if (!sessionCookie) throw new Error("__Secure-admin-sid cookie not found");
    const cookieHeader = `__Secure-admin-sid=${sessionCookie.value}`;
    return cookieHeader;
  } catch (e) {
  const err = e as Error;
  console.warn('No admin cookie found:', err.message);
  return '';
  }
}
