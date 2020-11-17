const { utils } = require('ethers')

function padding(value, length = 64, padChar = '0') {
  const h = value.substr(0, 2).toLowerCase() === '0x';
  const v = (h) ? value.substr(2) : value;
  return `${h ? '0x' : ''}${padChar.repeat(length - v.length)}${v}`;
}

function removePrefix(value) {
  return value.toLowerCase().replace('0x', '');
}

function addPrefix(value) {
  const h = value.substr(0, 2).toLowerCase() === '0x';
  return `${h ? '' : '0x'}${value}`;
}

function isAddress(address) {
  return /^0x[0-9-a-fA-F]{40,40}$/.test(address);
}

function isHexString(value, length) {
  const regexTest = new RegExp(`^[0-9a-fA-F]{${length},${length}}$`);
  return value.length % 2 === 0 && regexTest.test(value);
}

// Construct salt from vault address and 64 bits salt
function constructSalt(salt, vaultAddress, reserved = 0) {
  const stack = [];
  // PART2: uint256 salt
  // 64 bits customized salt, make sure there are 16 chars hex encoding
  const saltStr = padding(salt.toString(16), 16);
  if (reserved !== 0) {
    throw new Error('We did not have use this yet');
  }
  if (!isHexString(saltStr, 16)) {
    throw new Error('Something was wrong in salt transform to hex string');
  }
  stack.push(saltStr);
  // 32 bits reserved, we will keep them for later
  stack.push('00000000');
  // Target address
  stack.push(removePrefix(vaultAddress));
  const tmpHexString = stack.join('');
  if (!isHexString(tmpHexString, 64)) {
    throw new Error('Something was wrong in construction of salt');
  }
  return addPrefix(tmpHexString);
}

// Get minimal proxy code
function getMinimalProxyCode(implementationAddress) {
  if (isAddress(implementationAddress)) {
    const minimalProxyCode = `3d602d80600a3d3981f3363d3d373d3d3d363d73${
      removePrefix(implementationAddress)}5af43d82803e903d91602b57fd5bf3`;
    if (!isHexString(minimalProxyCode, 110)) {
      throw new Error('Minimal proxy code contain unexpected data');
    }
    return minimalProxyCode;
  }
  throw new Error('Invalid implementation address');
}

export function precalculate(
  creatorAddress,
  implementationAddress,
  vaultAddress,
  salt,
) {
  let checkPassed = true;
  // Must be address
  checkPassed = checkPassed && typeof (creatorAddress) === 'string' && isAddress(creatorAddress);
  // Must be address
  checkPassed = checkPassed && typeof (implementationAddress) === 'string' && isAddress(implementationAddress);
  // Must be address
  checkPassed = checkPassed && typeof (creatorAddress) === 'string' && isAddress(vaultAddress);
  // Make sure it wasn't NaN or Infinity
  checkPassed = checkPassed && typeof (salt) === 'number' && Number.isInteger(salt);

  /**
   * precalculateAddress = keccak256(address creator || uint256 salt || keccak256(bytes memory code))
   */
  if (checkPassed) {
    const stack = ['ff'];

    // PART1: Contract creator address
    stack.push(removePrefix(creatorAddress));

    // PART2: uint256 salt
    stack.push(removePrefix(constructSalt(salt, vaultAddress)));

    // PART3: Digest of code

    // Hash given code
    const digestOfMinimalProxyCode = removePrefix(utils.keccak256(
      addPrefix(getMinimalProxyCode(implementationAddress)),
    ));
    if (!isHexString(digestOfMinimalProxyCode, 64)) {
      throw new Error('Wrong digest of minimal proxy code');
    }
    stack.push(digestOfMinimalProxyCode);
    const lastDat = addPrefix(stack.join(''));
    if (lastDat.length !== 172) {
      throw new Error('Wrong length of data');
    }
    const retAddress = addPrefix(utils.keccak256(lastDat).substr(-40));
    if (isAddress(retAddress)) {
      return utils.getAddress(retAddress);
    }
    throw new Error('Calculation went wrong');
  }
  throw new Error('Unexpected input data');
}
