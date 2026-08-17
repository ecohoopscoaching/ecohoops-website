import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ channel: 'msedge' });
  
  // 1. Desktop - Hero with Announcement Bar
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/asapp/.gemini/antigravity/brain/118cc4ec-a79e-4dc9-bde5-3c37ca8a76e0/desktop_hero_with_bar.png' });

  // 2. Desktop - Click Announcement Bar Button (Scroll to Waitlist)
  const waitlistBtn = await page.$('aside button');
  if (waitlistBtn) {
    await waitlistBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/asapp/.gemini/antigravity/brain/118cc4ec-a79e-4dc9-bde5-3c37ca8a76e0/desktop_waitlist_scrolled.png' });
  }

  // 3. Desktop - Capture Waitlist Section Element specifically
  const section = await page.$('#jr-nba-waitlist');
  if (section) {
    await section.screenshot({ path: 'C:/Users/asapp/.gemini/antigravity/brain/118cc4ec-a79e-4dc9-bde5-3c37ca8a76e0/desktop_waitlist_section.png' });
  }

  // 4. Mobile - Hero with Announcement Bar
  const mPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(1000);
  await mPage.screenshot({ path: 'C:/Users/asapp/.gemini/antigravity/brain/118cc4ec-a79e-4dc9-bde5-3c37ca8a76e0/mobile_hero_with_bar.png' });

  // 5. Mobile - Scroll to Waitlist & Capture Section
  const mSection = await mPage.$('#jr-nba-waitlist');
  if (mSection) {
    await mSection.scrollIntoViewIfNeeded();
    await mPage.waitForTimeout(800);
    await mPage.screenshot({ path: 'C:/Users/asapp/.gemini/antigravity/brain/118cc4ec-a79e-4dc9-bde5-3c37ca8a76e0/mobile_waitlist_scrolled.png' });
    await mSection.screenshot({ path: 'C:/Users/asapp/.gemini/antigravity/brain/118cc4ec-a79e-4dc9-bde5-3c37ca8a76e0/mobile_waitlist_section.png' });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(console.error);
