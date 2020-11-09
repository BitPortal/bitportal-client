/*空值验证*/
const nullCheck = obj => {
  return (
    obj == null ||
    undefined == obj ||
    obj.length <= 0 ||
    typeof obj === 'undefined' ||
    isNaN(obj)
  );
};

export {
    nullCheck
}
