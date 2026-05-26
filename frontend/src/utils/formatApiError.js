export default function formatApiError(payload, fallbackMessage) {
  if (!payload) return fallbackMessage;

  const source = payload.error ?? payload.detail ?? payload;

  if (typeof source === 'string') {
    return source;
  }

  if (Array.isArray(source)) {
    return source.map((item) => (typeof item === 'string' ? item : JSON.stringify(item))).join(' ');
  }

  if (typeof source === 'object') {
    return Object.entries(source)
      .map(([key, value]) => {
        if (Array.isArray(value)) return `${key}: ${value.join(', ')}`;
        if (typeof value === 'string') return `${key}: ${value}`;
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(' | ');
  }

  return fallbackMessage;
}
