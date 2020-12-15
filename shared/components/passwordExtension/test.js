

const handle = value => {
  const regExp = exp => RegExp(exp);
  const specialExp = regExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？ ]');
  const special = specialExp.test(value);

  const charExp = regExp('[a-zA-Z]');
  const char = charExp.test(value);

  const numExp = regExp('[0-9]');
  const num = numExp.test(value);

  console.warn(`value: ${value} \n special: ${special} \n char: ${char} \n num: ${num}`)
}

console.warn(handle('Abc@123456'))
console.warn(handle('Abc'))
console.warn(handle('123456'))
console.warn(handle('123@'))
