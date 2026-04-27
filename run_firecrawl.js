import fs from 'fs';
const apiKey = 'fc-650d470958d04c238954d7eb2c68357b';
const url = 'https://articleblogwebsite.web.app/';

async function crawl() {
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        limit: 15,
        scrapeOptions: {
          formats: ['markdown']
        }
      })
    });
    const data = await res.json();
    console.log("Crawl initiation response:", data);
    
    if (data.success && data.id) {
      const id = data.id;
      // Poll for completion
      while (true) {
        await new Promise(r => setTimeout(r, 3000));
        const statusRes = await fetch(`https://api.firecrawl.dev/v1/crawl/${id}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        const statusData = await statusRes.json();
        console.log("Status:", statusData.status);
        if (statusData.status === 'completed') {
          fs.writeFileSync('crawl_results.json', JSON.stringify(statusData.data, null, 2));
          console.log("Saved to crawl_results.json");
          break;
        } else if (statusData.status === 'failed') {
          console.error("Crawl failed:", statusData);
          break;
        }
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
crawl();
