import fs     from 'node:fs/promises';
import path   from 'node:path';
import fetch  from 'node-fetch';

const API_KEY = process.env.AV_KEY;
const SYMBOLS = ['AAPL','TSLA','AMZN','MSFT','GOOGL','NU'];
const OUTDIR  = 'data';

await fs.mkdir(OUTDIR, { recursive: true });

for (const sym of SYMBOLS) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED`
            + `&symbol=${sym}&apikey=${API_KEY}`;

  const res  = await fetch(url);
  if (!res.ok) throw new Error(`${sym}: HTTP ${res.status}`);

  const json = await res.json();
  if (json.Note) throw new Error(`${sym}: Rate-limited`);

  await fs.writeFile(
    path.join(OUTDIR, `${sym}.json`),
    JSON.stringify(json, null, 2)
  );
  console.log(`${sym} saved`);
}
