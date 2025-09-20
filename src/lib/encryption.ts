#!/usr/bin/env node

// Test script to verify encryption/decryption compatibility
import crypto from "crypto-js";

// Use the same keys as in the utilities
const ENCRYPTION_KEY = "ccbc-cms-qr-secret-key-2024";
const ENCRYPTION_IV = "ccbc-cms-qr-iv";

// // Test data
// const testData = {
//   worship_id: 123456,
//   current_datetime: "202509201630",
// };

export const encrypt = ({
  worship_id,
  current_datetime,
}: {
  worship_id: string;
  current_datetime: string;
}): string => {
  const data = {
    worship_id,
    current_datetime,
  };
  console.log("🔧 Testing QR Code Encryption System");
  console.log("=====================================");
  console.log("Original data:", data);

  try {
    // Encrypt using same method as qrEncryption.js
    const jsonString = JSON.stringify(data);

    const encrypted = crypto.AES.encrypt(jsonString, ENCRYPTION_KEY, {
      iv: crypto.enc.Utf8.parse(ENCRYPTION_IV.substring(0, 16)),
      mode: crypto.mode.CBC,
      padding: crypto.pad.Pkcs7,
    });

    const encryptedString = encrypted.toString();
    console.log("✅ Encrypted:", encryptedString);

    return encryptedString;
  } catch (error) {
    console.error("❌ Test failed:", error);

    return "";
  }
};
