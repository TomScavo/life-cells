import { useState, useEffect } from 'react';
import moment from 'moment';
import { Text, View, CoverView, Picker, Image, CoverImage, Button } from "@tarojs/components";
import { useDispatch, useSelector } from 'react-redux';
import { updateBirthday, setShowBirthdayModal, updateLoading, updateShowPassedLife } from '../../store/birthday';
import { setShowTabBar } from '../../store/tabBar';

import bgImg from '../../images/sky.jpg';
import dateIcon from '../../images/date.png';
import { Store } from '../../constants';

import "./index.scss";

import store from '../../store';
import Taro from '@tarojs/taro';

const BirthdayPicker: React.FC = () => {
  const loading = useSelector(state => state.birthday.loading);
  const birthday = useSelector(state => state.birthday.day);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(birthday);

  function handleDateChange(e) {
    setSelectedDate(e.detail.value);
  }

  function handleContinue() {
    if (!selectedDate) return;

    dispatch(updateLoading(true));

    dispatch(updateBirthday(selectedDate));

    setTimeout(() => {
      dispatch(setShowBirthdayModal(false));
      dispatch(setShowTabBar(true));
    }, 2000);

    dispatch(updateShowPassedLife(true));

    Taro.setStorage({
      key: Store.Birthday,
      data: selectedDate
    });
  }

  useEffect(() => {
    dispatch(setShowTabBar(false));
  }, [])

  return (
    <View className='birthday-picker'>
      <Image src={bgImg} className='image'></Image>
      <View className='mask'>
        <View className="flex-container">
          <Text className='bold'>出生日期</Text>
          <Picker
            mode='date'
            value={selectedDate}
            className='picker-wrapper'
            onChange={handleDateChange}
            start="1940-01-01"
            end={moment().format('YYYY-MM-DD')}
          >
            <View className={`picker ${!selectedDate ? 'empty-picker' : ''}`}>
              <Image mode="heightFix" className='date-icon' src={dateIcon}></Image>
              <Text>{!selectedDate ? "请选择出生日期" : selectedDate}</Text>
            </View>
          </Picker>
          <Button
            className={`btn bold ${selectedDate ? 'btn-confirmed' : ''}`}
            loading={loading}
            onClick={handleContinue}
          >
            <Text className='continue'>继 续</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default BirthdayPicker;