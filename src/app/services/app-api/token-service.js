// services/TokenService.js
import crypto from 'crypto';

export default class TokenService {
    constructor() {
        this.algorithm = 'aes-256-cbc';
        this.encryptionKey = this.#loadAndValidateKey();
    }

    // Private: Load key from env (base64) and validate
    #loadAndValidateKey() {
        const keyString = process.env.TOKEN_ENCRYPTION_KEY;
        if (!keyString) {
            throw new Error('TOKEN_ENCRYPTION_KEY env var is required (base64-encoded 32 bytes)');
        }

        const keyBuffer = Buffer.from(keyString, 'base64');
        if (keyBuffer.length !== 32) {
            throw new Error('TOKEN_ENCRYPTION_KEY must be exactly 32 bytes when base64-decoded');
        }

        return keyBuffer;
    }

    /**
     * Encrypts a plain token string.
     * Returns null if input is null/empty; else "iv_hex:encrypted_hex" for DB storage.
     */
    encrypt(plainToken) {
        if (!plainToken || plainToken.length === 0) return null;

        const iv = crypto.randomBytes(16); // Random IV per token
        const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
        cipher.setIV(iv);

        let encrypted = cipher.update(plainToken, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return `${iv.toString('hex')}:${encrypted}`;
    }

    /**
     * Decrypts a stored encrypted token.
     * Returns plain token or throws on error (invalid format/tampered).
     */
    decrypt(encryptedToken) {
        if (!encryptedToken) return null;

        const [ivHex, encryptedHex] = encryptedToken.split(':');
        if (!ivHex || !encryptedHex) {
            throw new Error('Invalid encrypted token format (expected "iv:encrypted")');
        }

        const iv = Buffer.from(ivHex, 'hex');
        if (iv.length !== 16) {
            throw new Error('Invalid IV length (must be 16 bytes)');
        }

        const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
        decipher.setIV(iv);

        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    /**
     * Checks if a token is expired (optional utility).
     */
    isExpired(expiresAt) {
        return expiresAt && new Date(expiresAt) < new Date();
    }

    /**
     * Rotates a token: Decrypts old, encrypts new (for refresh flows).
     */
    rotate(oldEncrypted, newPlain) {
        const oldPlain = this.decrypt(oldEncrypted);
        if (oldPlain !== newPlain) {
            throw new Error('Rotation failed: Tokens mismatch');
        }
        return this.encrypt(newPlain); // Or increment expiry if needed
    }
}

// Example usage (test at bottom for module execution)
if (import.meta.url === `file://${process.argv[1]}`) {
    const service = new TokenService();
    const plain = 'dummy_fb_token_abc123def456';
    const encrypted = service.encrypt(plain);
    console.log('Encrypted:', encrypted);

    const decrypted = service.decrypt(encrypted);
    console.log('Decrypted:', decrypted);
    console.log('Match?', plain === decrypted); // true

    // Error case
    try {
        service.decrypt('invalid');
    } catch (err) {
        console.log('Expected error:', err.message);
    }
}