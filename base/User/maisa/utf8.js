// Not all sequences of bytes are valid UTF-8. A UTF-8 decoder should be prepared for:

// - invalid bytes
// - an unexpected continuation byte
// - a non-continuation byte before the end of the character
// - the string ending before the end of the character (which can happen in simple string truncation)
// - an overlong encoding
// - a sequence that decodes to an invalid code point

const utf8encode=
n=>
  (m=>
    m<0x80
   ?Uint8Array.from(
      [ m>>0&0x7f|0x00])
   :m<0x800
   ?Uint8Array.from(
      [ m>>6&0x1f|0xc0,m>>0&0x3f|0x80])
   :m<0x10000
   ?Uint8Array.from(
      [ m>>12&0x0f|0xe0,m>>6&0x3f|0x80,m>>0&0x3f|0x80])
   :m<0x110000
   ?Uint8Array.from(
      [ m>>18&0x07|0xf0,m>>12&0x3f|0x80,m>>6&0x3f|0x80,m>>0&0x3f|0x80])
   :(()=>{throw'Invalid Unicode Code Point!'})())
  ( typeof n==='string'
   ?n.codePointAt(0)
   :n&0x1fffff)

// utf8decode takes an array of one to four uint8 representing utf8 code 
// units and returns a uint32 representing that code point. 
const utf8decode=
([m,n,o,p])=>
  m<0x80
 ?( m&0x7f)<<0
 :0xc1<m&&m<0xe0&&n===(n&0xbf)
 ?( m&0x1f)<<6|( n&0x3f)<<0
 :( m===0xe0&&0x9f<n&&n<0xc0
  ||0xe0<m&&m<0xed&&0x7f<n&&n<0xc0
  ||m===0xed&&0x7f<n&&n<0xa0
  ||0xed<m&&m<0xf0&&0x7f<n&&n<0xc0)
&&o===o&0xbf
 ?( m&0x0f)<<12|( n&0x3f)<<6|( o&0x3f)<<0
 :( m===0xf0&&0x8f<n&&n<0xc0
  ||m===0xf4&&0x7f<n&&n<0x90
  ||0xf0<m&&m<0xf4&&0x7f<n&&n<0xc0)
&&o===o&0xbf&&p===p&0xbf
 ?( m&0x07)<<18|( n&0x3f)<<12|( o&0x3f)<<6|( p&0x3f)<<0
 :(()=>{throw'Invalid UTF-8 encoding!'})()


 const
  str=
    'AöЖ€𝄞'
 ,cps=
    Uint32Array.from(str,s=>s.codePointAt(0))
 ,cus=
    [ [ 0x41]
     ,[ 0xc3,0xb6]
     ,[ 0xd0,0x96]
     ,[ 0xe2,0x82,0xac]
     ,[ 0xf0,0x9d,0x84,0x9e]]
   .map(a=>Uint8Array.from(a))
 ,zip3=
    ([a,...as],[b,...bs],[c,...cs])=>
      0<as.length+bs.length+cs.length
     ?[ [ a,b,c],...zip3(as,bs,cs)]
     :[ [ a,b,c]]
 ,inputs=zip3(str,cps,cus);
 
//  console.log("inputs: ", inputs);

 console.log(`\
 ${'Character'.padEnd(16)}\
 ${'CodePoint'.padEnd(16)}\
 ${'CodeUnits'.padEnd(16)}\
 ${'uft8encode(ch)'.padEnd(16)}\
 ${'uft8encode(cp)'.padEnd(16)}\
 utf8decode(cu)`)
 for(let [ch,cp,cu] of inputs)
   console.log(`\
 ${ch.padEnd(16)}\
 ${cp.toString(0x10).padStart(8,'U+000000').padEnd(16)}\
 ${`[${[...cu].map(n=>n.toString(0x10))}]`.padEnd(16)}\
 ${`[${[...utf8encode(ch)].map(n=>n.toString(0x10))}]`.padEnd(16)}\
 ${`[${[...utf8encode(cp)].map(n=>n.toString(0x10))}]`.padEnd(16)}\
 ${utf8decode(cu).toString(0x10).padStart(8,'U+000000')}`)
  