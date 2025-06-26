import { Actor } from 'apify';
import { launchPuppeteer } from 'crawlee';

Actor.main(async () => {
    const browser = await launchPuppeteer();
    const page = await browser.newPage();

    const url = 'https://app.hyperswap.exchange/#/pool/0x56abfaf40f5b7464e9cc8cff1af13863d6914508';
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    // Esperar a que cargue el APR
    await page.waitForTimeout(5000);

    const apr = await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("*"))
            .find(e => e.textContent.includes('%') && e.textContent.includes('APR'));
        return el ? el.textContent.trim() : null;
    });

    await Actor.pushData({ apr: apr || "APR not found", timestamp: new Date().toISOString() });

    await browser.close();
});
