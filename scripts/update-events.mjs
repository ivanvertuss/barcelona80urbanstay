import { writeFile } from 'node:fs/promises';

const apiKey = process.env.TICKETMASTER_API_KEY;
const city = process.env.EVENT_CITY || 'Vigo';
const countryCode = process.env.EVENT_COUNTRY || 'ES';
const output = process.env.EVENT_OUTPUT || 'events.json';

if (!apiKey) {
  throw new Error('Missing TICKETMASTER_API_KEY');
}

const startDateTime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
url.searchParams.set('apikey', apiKey);
url.searchParams.set('city', city);
url.searchParams.set('countryCode', countryCode);
url.searchParams.set('startDateTime', startDateTime);
url.searchParams.set('size', '20');
url.searchParams.set('sort', 'date,asc');

const response = await fetch(url, { headers: { accept: 'application/json' } });
if (!response.ok) {
  throw new Error(`Ticketmaster API error ${response.status}: ${await response.text()}`);
}

const payload = await response.json();
const sourceEvents = payload?._embedded?.events || [];
const seen = new Set();
const events = [];

for (const event of sourceEvents) {
  if (!event?.id || seen.has(event.id)) continue;
  if (event?.dates?.status?.code === 'cancelled') continue;
  const date = event?.dates?.start?.localDate;
  if (!date) continue;
  seen.add(event.id);
  const venue = event?._embedded?.venues?.[0];
  const segment = event?.classifications?.[0]?.segment?.name || '';
  events.push({
    id: event.id,
    name: event.name || 'Evento',
    date,
    time: event?.dates?.start?.localTime || '',
    venue: venue?.name || '',
    city: venue?.city?.name || city,
    category: segment,
    url: event.url || '',
    image: event?.images?.find(img => img?.ratio === '16_9')?.url || event?.images?.[0]?.url || ''
  });
  if (events.length >= 10) break;
}

const result = {
  source: 'Ticketmaster Discovery API',
  city,
  countryCode,
  updatedAt: new Date().toISOString(),
  events
};

await writeFile(output, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(`Saved ${events.length} events to ${output}`);
