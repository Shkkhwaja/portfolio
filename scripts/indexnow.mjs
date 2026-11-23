/**
 * Tells Bing (and other IndexNow search engines) that your pages exist / changed, so they are crawled quickly.
 * ChatGPT search relies on Bing's index, so this is the fastest way to get new pages seen.
 *
 * Usage (AFTER the site is deployed — the key file must be live at the URL below):
 *   node scripts/indexnow.mjs
 */
const SITE = 'https://khwajashaikh.vercel.app'
const KEY = '524fe37efdaecb37de091416f85e7464'

async function main() {
  // 1) the key file must be publicly reachable, otherwise IndexNow rejects the request
  const keyRes = await fetch(`${SITE}/${KEY}.txt`)
  if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
    console.error(`Key file not live yet at ${SITE}/${KEY}.txt — deploy first, then re-run.`)
    process.exit(1)
  }

  // 2) collect every URL from the live sitemap
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (!urlList.length) {
    console.error('No URLs found in the sitemap.')
    process.exit(1)
  }

  // 3) submit them
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  })
  console.log(`Submitted ${urlList.length} URLs → HTTP ${res.status} (200/202 = accepted)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
