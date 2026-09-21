/**
 * Utility functions for file identification, validation, and byte formatting.
 * Uses standard decimal file size units (1 KB = 1,000 B, 1 MB = 1,000,000 B)
 * consistent with modern operating systems (macOS, mobile) and download managers.
 */

export function getFileType(file) {
  if (!file) return null;
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    return 'PDF';
  }
  if (
    type === 'image/jpeg' ||
    type === 'image/jpg' ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg')
  ) {
    return 'JPG';
  }
  if (type === 'image/png' || name.endsWith('.png')) {
    return 'PNG';
  }
  return 'UNSUPPORTED';
}

export function formatBytes(bytes) {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return '—';
  if (bytes <= 0) return '0 B';

  if (bytes < 1000 * 1000) {
    const kb = bytes / 1000;
    return `${kb >= 10 ? Math.round(kb) : kb.toFixed(1)} KB`;
  }

  const mb = bytes / (1000 * 1000);
  return `${mb.toFixed(2)} MB`;
}

export function parseTargetToBytes(value, unit = 'MB') {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return null;
  if (unit === 'KB') {
    return Math.round(num * 1000);
  }
  return Math.round(num * 1000 * 1000);
}

export function calculateSeverityFromBytes(fileSizeBytes, targetBytes) {
  if (!fileSizeBytes || !targetBytes || targetBytes <= 0) {
    return { level: 'UNKNOWN', label: '—', reductionPercent: 0, isRequired: false };
  }

  if (fileSizeBytes <= targetBytes) {
    return { level: 'NONE', label: 'Already compliant', reductionPercent: 0, isRequired: false };
  }

  const reductionPercent = Math.min(
    99,
    Math.round(((fileSizeBytes - targetBytes) / fileSizeBytes) * 100)
  );

  if (reductionPercent <= 35) {
    return { level: 'LIGHT', label: 'Light', reductionPercent, isRequired: true };
  } else if (reductionPercent <= 65) {
    return { level: 'MEDIUM', label: 'Medium', reductionPercent, isRequired: true };
  } else {
    return { level: 'STRONG', label: 'Strong', reductionPercent, isRequired: true };
  }
}
