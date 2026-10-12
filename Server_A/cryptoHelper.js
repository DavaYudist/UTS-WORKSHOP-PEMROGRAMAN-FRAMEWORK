const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const CryptoJS = require('crypto-js');

function encryptData(payload) {
  if (payload === null || payload === undefined) {
    return '';
  }
  const textToEncrypt = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
  return CryptoJS.AES.encrypt(textToEncrypt, process.env.SECRET_KEY).toString();
}

module.exports = {
  encryptData
};
