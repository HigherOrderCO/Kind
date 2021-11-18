# RLP

The purpose of RLP (Recursive Length Prefix) is to encode arbitrarily nested arrays of binary data, and RLP is the main encoding method used to serialize objects in Ethereum. The only purpose of RLP is to encode structure; encoding specific data types (eg. strings, floats) is left up to higher-order protocols;

### Example  
The string “dog” = `[ 0x83, ‘d’, ‘o’, ‘g’ ]`   
The list [ “cat”, “dog” ] = `[ 0xc8, 0x83, 'c', 'a', 't', 0x83, 'd', 'o', 'g' ]`  
The empty string (‘null’) = `[ 0x80 ]`  
The empty list = `[ 0xc0 ]`  
The integer 0 = `[ 0x80 ]`  
The encoded integer 0 (’\x00’) = `[ 0x00 ]`  
The encoded integer 15 (’\x0f’) = `[ 0x0f ]`  
The encoded integer 1024 (’\x04\x00’) = `[ 0x82, 0x04, 0x00 ]`  
The set theoretical representation of three, [ [], [[]], [ [], [[]] ] ] = `[ 0xc7, 0xc0, 0xc1, 0xc0, 0xc3, 0xc0, 0xc1, 0xc0 ]`  
The string “Lorem ipsum dolor sit amet, consectetur adipisicing elit” = `[ 0xb8, 0x38, 'L', 'o', 'r', 'e', 'm', ' ', ... , 'e', 'l', 'i', 't' ]`  


### Reference
- [Ethereum Wiki](https://eth.wiki/fundamentals/rlp)
- [Ethers.js](https://github.com/ethers-io/ethers.js/tree/master/packages/rlp)