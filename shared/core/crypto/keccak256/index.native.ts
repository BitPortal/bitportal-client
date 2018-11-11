import createKeccakHash from 'keccak'

const keccak256 = async (a: any) => {
  const buffer = Buffer.from(a)
  return createKeccakHash('keccak256').update(buffer).digest()
}

export default keccak256
