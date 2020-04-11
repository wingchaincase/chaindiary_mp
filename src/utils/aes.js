
import aesjs from 'aes-js';
import secureRandom from 'secure-random';

const getKeyAndIv = () => {
  const key = secureRandom(16);
  const iv = secureRandom(16);
  return {key, iv}
}
/**
* 加密
* @param text
* @returns {*}
*/

const encrypt = function (text, key){
  const textBytes = aesjs.utils.utf8.toBytes(text);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  const encryptedBytes = aesCtr.encrypt(textBytes);
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex
}

/**
* 解密
* @param word
* @returns {*}
*/

const decrypt = function (encryptedHex, key){
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText
}

export default {
  decrypt,
  encrypt,
  getKeyAndIv
}