/**
 * Normaliza el string de location a (lat, lng) para persistir en PostgreSQL point.
 * Clientes antiguos envían (lng, lat) p. ej. Colombia (-74.x, 4.x); se reordena a (4.x, -74.x).
 */
function normalizePuntoLocationString(location) {
  if (!location || typeof location !== 'string') return location;
  const trimmed = location.trim();
  const m = trimmed.match(/^\(\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*,\s*([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*\)$/);
  if (!m) return location;
  const a = parseFloat(m[1], 10);
  const b = parseFloat(m[2], 10);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return location;
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  // Patrón típico (longitud, latitud): primer valor |.| grande (>25), segundo chico (<22)
  const looksLikeLngLat = absA > 25 && absB < 22;
  if (looksLikeLngLat) {
    return `(${b}, ${a})`;
  }
  return location;
}

module.exports = { normalizePuntoLocationString };
