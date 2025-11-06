import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export enum CookiesTag {
    Admin = 'admin',
    Buyer = 'buyer',
    Vendor = 'vendor',
    None = 'none',
}

export class DriverProvider {
    private browser?: Browser;
    private context?: BrowserContext;
    private page?: Page;

    private static readonly storageDir = path.join(__dirname, '../../storage');

    constructor() {
        if (!fs.existsSync(DriverProvider.storageDir)) {
            fs.mkdirSync(DriverProvider.storageDir, { recursive: true });
        }
    }

    private static getCookiesStateFileName(tag: CookiesTag) {
        return path.join(DriverProvider.storageDir, `cookies_state_${tag}.json`);
    }

    async initDriver(useCookies: boolean, tag: CookiesTag = CookiesTag.Admin): Promise<Page> {
        this.browser = await chromium.launch();

        this.context = await this.browser.newContext({
            storageState: useCookies && fs.existsSync(DriverProvider.getCookiesStateFileName(tag))
                ? DriverProvider.getCookiesStateFileName(tag)
                : undefined,
        });

        this.page = await this.context.newPage();
        return this.page;
    }

    async storeCookies(tag: CookiesTag = CookiesTag.Admin) {
        if (!this.context) throw new Error('Context not initialized');
        await this.context.storageState({ path: DriverProvider.getCookiesStateFileName(tag) });
    }

    async dispose() {
        if (!this.context) return;

        if (this.context.tracing) {
            await this.context.tracing.stop();
        }

        await this.context.close();
        await this.browser?.close();
    }
}
