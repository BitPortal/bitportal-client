/*空值验证*/
const nullCheck = obj => {

  const str = `${obj}`
  return (
    str == null ||
    undefined == str ||
    str.length <= 0 ||
    typeof str === 'undefined' ||
    str == 'NaN'
  );
};

export {
    nullCheck
}
