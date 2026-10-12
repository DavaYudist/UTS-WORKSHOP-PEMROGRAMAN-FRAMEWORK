const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const CryptoJS = require('crypto-js');

function decryptData(cipherText) {
  if (!cipherText) {
    return '';
  }
  const bytes = CryptoJS.AES.decrypt(cipherText, process.env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  decryptData
};
