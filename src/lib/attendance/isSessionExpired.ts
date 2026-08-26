export function isSessionExpired(expiresAt: Date, now = new Date()) {
    return now >= expiresAt;
  }