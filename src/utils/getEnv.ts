import fs from 'fs';
import path from 'path';

export function getAdminCookie(): string {
  const envPath = path.join(__dirname, '../config/env.json');
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
