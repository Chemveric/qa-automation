import { Page, expect } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  // Adjust selectors based on actual UI
  await page.getByRole('link', { name: /sign in|log in/i }).click();
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|log in/i }).click();
  await expect(page.getByRole('button', { name: /logout|sign out/i })).toBeVisible({ timeout: 15000 });
}
