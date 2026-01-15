// services/TokenService.js
import crypto from 'crypto';

/**
 * Service handling secure token encryption, decryption, and expiration validation.
 */
export default class TokenService {
    constructor() {
        this.algorithm = 'aes-256-cbc';
        this.encryptionKey = this.#loadAndValidateKey();
    }

    /**
     * @private
     * @description Loads and validates the encryption key from environment variables.
     * @throws {Error} If APP_KEY is missing or invalid.
     * @returns {Buffer}
     */
    #loadAndValidateKey() {
        const keyString = process.env.APP_KEY;
        if (!keyString) {
            throw new Error('APP_KEY env var is required (base64-encoded 32 bytes)');
        }

        const keyBuffer = Buffer.from(keyString, 'base64');
        if (keyBuffer.length !== 32) {
            throw new Error('APP_KEY must be exactly 32 bytes when base64-decoded');
        }

        return keyBuffer;
    }

    /**
     * @method encrypt
     * @description Encrypts a plain text token using AES-256-CBC.
     * @param {string} plainToken - The raw token string to encrypt.
     * @returns {string|null} The formatted string "iv:encrypted" or null.
     */
    encrypt(plainToken) {
        if (!plainToken || plainToken.length === 0) return null;

        const iv = crypto.randomBytes(16); // Random IV per token
        const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

        let encrypted = cipher.update(plainToken, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return `${iv.toString('hex')}:${encrypted}`;
    }

    /**
     * @method decrypt
     * @description Decrypts a stored token string.
     * @param {string} encryptedToken - The "iv:encrypted" string from the database.
     * @returns {string|null} The decrypted plain text token.
     * @throws {Error} If the token format or IV length is invalid.
     */
    decrypt(encryptedToken) {
        console.log('Func call: decrypt', encryptedToken);
        if (!encryptedToken) return null;

        const [ivHex, encryptedHex] = encryptedToken.split(':');
        if (!ivHex || !encryptedHex) {
            throw new Error('Invalid encrypted token format (expected "iv:encrypted")');
        }

        const iv = Buffer.from(ivHex, 'hex');
        if (iv.length !== 16) {
            throw new Error('Invalid IV length (must be 16 bytes)');
        }

        const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);

        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        console.log('Func call: decrypt 1', decrypted);
        return decrypted;
    }

    /**
     * @method isExpired
     * @description Checks if a given date has passed the current time.
     * @param {Date|string} expiresAt - The expiration timestamp.
     * @returns {boolean} True if the token is expired, false otherwise.
     */
    isExpired(expiresAt) {
        return expiresAt && new Date(expiresAt) < new Date();
    }
}