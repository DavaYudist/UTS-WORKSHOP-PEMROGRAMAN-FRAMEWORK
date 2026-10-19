const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const CryptoJS = require('crypto-js');

function decryptData(cipherText) {
  if (!cipherText) {
    return '';
  }
  try {
    const secret = process.env.SECRET_KEY || 'UTS_SECRET_2026_DAVANA';
    const bytes = CryptoJS.AES.decrypt(cipherText, secret);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || cipherText;
  } catch (e) {
    return cipherText;
  }
}

module.exports = {
  decryptData
};
