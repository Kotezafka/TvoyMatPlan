export function resolveLivekitUrl(configured?: string) {
  if (typeof window !== 'undefined') {
    const configuredUrl = configured?.trim();
    const configuredIsLocal =
      !configuredUrl ||
      /:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(?:\/|$)/i.test(
        configuredUrl,
      );

    // The local Cloudflare gateway proxies LiveKit signaling on the same host.
    // Use that HTTPS origin even if the backend is configured with a LAN IP.
    if (window.location.protocol === 'https:' && !configuredUrl?.startsWith('wss://')) {
      return `wss://${window.location.host}`;
    }

    if (configuredIsLocal && window.location.protocol === 'http:' && window.location.port !== '3004') {
      return `ws://${window.location.host}`;
    }
  }

  if (
    typeof window !== 'undefined' &&
    window.location.port === '3004' &&
    window.location.protocol === 'http:'
  ) {
    return `ws://${window.location.hostname}:7890`;
  }
  return configured || '';
}
