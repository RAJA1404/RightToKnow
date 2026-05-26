const crypto = require('crypto');

/**
 * Verifies Django's pbkdf2_sha256 hash.
 * Format: pbkdf2_sha256$<iterations>$<salt>$<hash>
 */
exports.verifyDjangoHash = (password, djangoHash) => {
  try {
    const parts = djangoHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') return false;

    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const originalHash = parts[3];

    const derivedHash = crypto.pbkdf2Sync(
      password,
      salt,
      iterations,
      32,
      'sha256'
    ).toString('base64');

    return derivedHash === originalHash;
  } catch (err) {
    console.error('Legacy Hash Verification Error:', err);
    return false;
  }
};
