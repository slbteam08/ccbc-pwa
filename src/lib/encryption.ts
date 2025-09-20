#!/usr/bin/env node
/*
// Test script to verify encryption/decryption compatibility
const crypto = require('crypto-js');

// Use the same keys as in the utilities
const ENCRYPTION_KEY = 'ccbc-cms-qr-secret-key-2024';
const ENCRYPTION_IV = 'ccbc-cms-qr-iv';

// Test data
const testData = {
  worship_id: 123456,
  current_datetime: '202509201630'
};

console.log('🔧 Testing QR Code Encryption System');
console.log('=====================================');
console.log('Original data:', testData);

try {
  // Encrypt using same method as qrEncryption.js
  const jsonString = JSON.stringify(testData);
  
  const encrypted = crypto.AES.encrypt(jsonString, ENCRYPTION_KEY, {
    iv: crypto.enc.Utf8.parse(ENCRYPTION_IV.substring(0, 16)),
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7
  });

  const encryptedString = encrypted.toString();
  console.log('✅ Encrypted:', encryptedString);

  // Decrypt to verify
  const decrypted = crypto.AES.decrypt(encryptedString, ENCRYPTION_KEY, {
    iv: crypto.enc.Utf8.parse(ENCRYPTION_IV.substring(0, 16)),
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7
  });

  const decryptedString = decrypted.toString(crypto.enc.Utf8);
  const decryptedData = JSON.parse(decryptedString);
  
  console.log('✅ Decrypted:', decryptedData);
  
  // Verify they match
  if (JSON.stringify(testData) === JSON.stringify(decryptedData)) {
    console.log('✅ Encryption/Decryption test PASSED!');
    
    // Test format detection
    console.log('\\n🔍 Testing format detection...');
    
    // Test encrypted format detection
    const trimmed = encryptedString.trim();
    const isEncrypted = !trimmed.startsWith('{') && !trimmed.endsWith('}') && /^[A-Za-z0-9+/]+=*$/.test(trimmed);
    console.log(`Encrypted format detected: ${isEncrypted ? '✅' : '❌'}`);
    
    // Test JSON format detection
    const jsonString2 = JSON.stringify(testData);
    const trimmed2 = jsonString2.trim();
    const isJson = trimmed2.startsWith('{') && trimmed2.endsWith('}');
    console.log(`JSON format detected: ${isJson ? '✅' : '❌'}`);
    
    console.log('\\n🎉 All tests completed successfully!');
    console.log('\\n📋 Sample encrypted QR code for testing:');
    console.log(encryptedString);
    
  } else {
    console.log('❌ Data mismatch!');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
  */
