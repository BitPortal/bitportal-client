const bs58check = require('bs58check')

const hash160L = "00000000000000000000000000000000000000000000" //hash representing uncompressed
const hash160H = "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF" //hash representing uncompressed

function startsWith(version) {
  if (version.length % 2 === 1) {
    version = '0' + version
  }

  const ahash = bs58check.encode(Buffer.from(version + hash160L, 'hex'))
  const lowEnd = ahash.slice(0, 2)
  const bhash = bs58check.encode(Buffer.from(version + hash160H, 'hex'))
  const highEnd = bhash.slice(0, 2)
  return lowEnd == highEnd ? lowEnd : [lowEnd, highEnd]
}

for(let i = 866430; i < 2560000; i++) {
  console.log(i + " will produce addresses starting with: " + startsWith(i.toString(16)))
}
