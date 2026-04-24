import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('FAILED REQUEST:', request.url()));
  
  await page.goto('https://articleblogwebsite.web.app/category/culture', {waitUntil: 'networkidle0'});
  
  await browser.close();
})();
