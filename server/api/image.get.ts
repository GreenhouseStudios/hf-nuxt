export default defineEventHandler(async (event) => {
  const { url } = getQuery(event);

  if (!url || typeof url !== 'string') {
    setResponseStatus(event, 400);
    return 'Missing "url" query parameter';
  }

  // This should be a path like:
  // /hartford_foundation/wp-content/uploads/2025/05/...
  const target = 'https://leamh.org' + url;

  const res = await fetch(target);

  if (!res.ok) {
    setResponseStatus(event, res.status);
    return `Image fetch failed: ${res.statusText}`;
  }

  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  const arrayBuffer = await res.arrayBuffer();

  setHeader(event, 'Content-Type', contentType);

  // In Nitro (Nuxt server) Buffer is available globally in Node preset
  return Buffer.from(arrayBuffer);
});
