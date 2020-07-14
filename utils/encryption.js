const CryptoJS = require('crypto-js');

const encrypt = text => {
	text = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
	return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(text));
};

const decrypt = data => {
	data = CryptoJS.enc.Hex.parse(data).toString(CryptoJS.enc.Utf8);
	return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };