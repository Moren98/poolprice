const { Actor } = require('apify');

Actor.main(async () => {
    const { requestQueue, enqueueLinks, launchPuppeteer } = Actor;

    const browser = await Actor.launchPuppeteer();
    const page = await browser.newPage();

    const url = 'https://app.hyperswap.exchange/#/pool/0x56abfaf40f5b7464e9cc8cff1af13863d6914508';
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    // Esperar a que cargue el elemento del APR
    await page.waitForTimeout(5000);

    // Intentar extraer el texto que parece un APR
    const apr = await page.evaluate(() => {
        const possible = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent.includes('%') && el.textContent.includes('APR')
        );
        return possible ? possible.textContent.trim() : null;
    });

    await Actor.pushData({ apr: apr || 'APR not found', timestamp: new Date().toISOString() });

    await browser.close();
});
