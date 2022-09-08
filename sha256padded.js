// Imports
const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const easaForm1 = require('./easeForm1_filled.json');

// ============================
// EASA Form1 for js-sha256
// ============================
function document2buffer(document, maxBufferSize) {

    const bufInputDoc = JSON.stringify(document);    // length is 732 -> 732 bytes = 5.856 bits
    const buff = Buffer.alloc(maxBufferSize);    
    buff.write(bufInputDoc, buff.length - bufInputDoc.length);  // buffer.write(value, offset)
    
    return buff;
};

console.log('buff', document2buffer(easaForm1, 800));

// ============================
// Function: sha256 hashing algorithm
// ============================
function calcHash(pImage) {

    const hashAlgo = crypto.createHash('sha256');
  
    // compute hash digest, input must me buffer
    const hashDigest = hashAlgo.update(pImage).digest('hex');
  
    // returns a string
    return hashDigest
  
  };


// ============================
// Function: Padding hex vlaue
// ============================

function padding(inputString, padSize) {

    if (inputString.length < padSize) {
        var paddedString = inputString.padStart(padSize, '0')
    }
    else {paddedString = inputString};

    return paddedString;

}


// ============================
// Function: convert hexadecimal to 8 x 32bit integer
// ============================
function hexTo32Bit(hexValue) {

    // padding hexvalue
    var paddedHex = padding(hexValue, 64);  // 64 hexadecimal bits equal 256 binary bits

    var paddedBinary = BigInt("0x" + paddedHex).toString(2).padStart(256, '0');

    // initialize array for 32bit integers
    let array32 = [];
    
    for (let i = 0; i < paddedBinary.length; i+=32) {

        let chunk32Bit = paddedBinary.slice(i, i+32);
        let chunkInt = parseInt(chunk32Bit, 2);     // binary to integer for 32Bits
        array32.push(chunkInt);

    };

    return array32;
  };

  console.log('hexto32bits of EASA Form1', hexTo32Bit(calcHash( document2buffer(easaForm1, 800))))