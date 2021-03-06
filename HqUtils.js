
const bitcoin = require('bitcoinjs-lib')
// msg: 'hello'
// privatekey: 9f9b465e5db8e793a71d116bcf595f098d5a2f928f1d292acc6a62900bdba58e
// signature: 1f6cace2e99f7514e2d50c1de7b2c90ab11562c9bda904aec783289400de3e3dab46181aa62a8cc52e69b316346783c908beeaa4500245174a5ffd6ce8ad916183
function hqIntToHex(length) {
    if (length<15){
        return '0'+length;
    }
    return ''+length.toString(16);
}
function hqFormtSignMessage(message) {
    const msgPrefix = "Bitcoin Signed Message:\n";
    var prefixLength = hqIntToHex(msgPrefix.length);
    var prefrxiBuffer = new Buffer(msgPrefix);

    var messageBuffer = new  Buffer(message);
    var msgLength = hqIntToHex(message.length);
    var hashMsg = ''+ prefixLength + prefrxiBuffer.toString('hex')+msgLength+messageBuffer.toString('hex')
    var btsh = bitcoin.crypto.sha256(new Buffer(hashMsg,'hex'));
    var btsh2 = bitcoin.crypto.sha256(new Buffer(btsh))

    return btsh2;
}

// 创建消息签名的预备格式
var hqMessage = hqFormtSignMessage('hello');
console.log("hqMessage=="+hqMessage.toString('hex'));

const secp256k1 = require('secp256k1')
//创建一个私钥
let privKey
do {
    privKey = new Buffer('9f9b465e5db8e793a71d116bcf595f098d5a2f928f1d292acc6a62900bdba58e', 'hex')
} while (!secp256k1.privateKeyVerify(privKey))
console.log('privKey=='+privKey.toString('hex'));

// get the public key in a compressed format
const pubKey = secp256k1.publicKeyCreate(privKey)
console.log('pubKey=='+pubKey.toString('hex'));

//签名消息生成消息结果，这里会少一个前缀qi
const sigObj = secp256k1.sign(hqMessage, privKey)
var signature = sigObj.signature.toString('hex');
console.log('signature=='+signature);

// 验证签名
console.log(secp256k1.verify(hqMessage, sigObj.signature, pubKey))
// => true

