import CryptoJS from 'crypto-js';

/**
 * Encrypts data using AES encryption with the Room ID as the key.
 * @param {string} data - The message, image(base64), or audio(base64) to encrypt.
 * @param {string} roomId - The current Room ID used as the passphrase.
 * @returns {string} The encrypted ciphertext.
 */
export const encryptMessage = (data, roomId) => {
  if (!data || !roomId) return data;
  try {
    // Encrypt using the RoomID as the secret passphrase.
    // CryptoJS generates a random salt automatically and prepends it.
    return CryptoJS.AES.encrypt(data, roomId).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return data;
  }
};

/**
 * Decrypts data using AES encryption with the Room ID as the key.
 * @param {string} ciphertext - The encrypted message.
 * @param {string} roomId - The current Room ID used as the passphrase.
 * @returns {string} The original decrypted data.
 */
export const decryptMessage = (ciphertext, roomId) => {
  if (!ciphertext || !roomId) return ciphertext;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, roomId);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    // As a fallback, if decryption yields empty string (wrong key/malformed),
    // return original or a placeholder.
    if (!originalText) return ciphertext; 
    
    return originalText;
  } catch (error) {
    // If it fails (e.g. not encrypted or wrong format), return original
    return ciphertext;
  }
};
