import { useState, useEffect, useRef } from 'react';
import Taro from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { updateShowPassedLife } from '../../store/birthday';

import {  getSpendTime } from '../../utils'

import "./index.scss";

const totalTime = 1000 * 60 * 60 * 24 * 365 * 80;

let timer: any;
const BirthDayProgressBar: React.FC = () => {
  const dispatch = useDispatch();
  const showPassedLife = useSelector(state => state.birthday.showPassedLife);
  const birthday = useSelector(state => state.birthday.day);
  const birthdayRef = useRef(birthday);
  birthdayRef.current = birthday;
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    if (ratio && showPassedLife) {
      setTimeout(() => {
        Taro.showToast({
          title: `距离 80 岁已经过去了 ${ratio.toFixed(1)}%`,
          icon: 'none',
          duration: 8000
        });
      }, 2200);

      dispatch(updateShowPassedLife(false));
    }
  }, [ratio]);

  function getSpendTimeRatio() {
    const spendTime = getSpendTime(birthdayRef.current);
  
    return Number(((Number(spendTime) / totalTime) * 100).toFixed(7));
  }

  function updateProgress() {
    timer = setTimeout(() => {
      setRatio(getSpendTimeRatio());
      updateProgress();
    }, 1000);
  }

  function getPadRatio() {
    // const numArr = (100 - ratio).toString().split('.');
    const numArr = ratio.toString().split('.');

    return numArr[0] + '.' + (numArr[1] || '').padEnd(7, '0');
  }

  useEffect(() => {
    updateProgress();

    return(() => {
      clearTimeout(timer)
    })
  }, []);

  return (
    <View className="birthday-progress-bar-wrapper">
      <View className="progress-bar-container">
        <View style={{ width: `${ratio}%` }} className="progress-bar"></View>
      </View>
      <View>
        <Text className="text">{`${getPadRatio() || 0}%`}</Text>
      </View>
    </View>
  )
}

export default BirthDayProgressBar;