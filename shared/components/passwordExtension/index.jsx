import React, { useState } from 'react'
import { View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet';

export const PasswordStrong = ({ password ,style}) => {

  const level = handleLevel(password);
  let child = []
  if (level === 0) {
    child = [<GrayLine/>,<GrayLine/>,<GrayLine/>];
  }else if (level === 1) {
    child = [<GrayLine/>,<GrayLine/>,<RedLine/>];
  }else if (level === 2) {
    child = [<GrayLine/>,<OrangeLine/>,<OrangeLine/>];
  }else if (level === 3) {
    child = [<GreenLine/>,<GreenLine/>,<GreenLine/>];
  }

  return (
    <View style={[{width:20},style]}>
      {child}
    </View>
  );
};

const GreenLine = () => <Line color={'#007AFF'}/>
const RedLine = () => <Line color={'#A52A2A'}/>
const OrangeLine = () => <Line color={'#FF8C00'}/>
const GrayLine = () => <Line color={'#D0D0D0'}/>

const Line = ({ color }) => {
  return (
    <View style={[styles.line, { backgroundColor: color }]}/>
  );
}

const handleLevel = value => {
  const regExp = exp => RegExp(exp);
  const specialExp = regExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？ ]');
  const special = specialExp.test(value || '');

  const charExp = regExp('[a-zA-Z]');
  const char = charExp.test(value || '');

  const numExp = regExp('[0-9]');
  const num = numExp.test(value || '');

  let level = 0;
  special && level ++;
  char && level ++;
  num && level ++;

  return level
}

const styles = EStyleSheet.create({
    container: {
      flex: 1,
    },
    line: {
      height: 4,
      width: 20,
      marginVertical: 2,
    },
  }
);

