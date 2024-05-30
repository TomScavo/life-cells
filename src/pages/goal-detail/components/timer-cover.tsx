import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { serverEncourageVoicesDir } from '../../../config';
import { startExecutingGoal } from '../../../store/goals';

import './timer-cover.scss';

const audioContext = Taro.createInnerAudioContext();
const TimerCover: React.FC<{show: boolean, onEnd: () => any}> = ({ show, onEnd }) => {
  const dispatch = useDispatch();
  const encourageConfig = useSelector(state => state.goals.encourageConfig)
  const [destroy, setDestroy] = useState(false);
  const [time, setTime] = useState(3);
  const [showText, setShowText] = useState(false);
  const timeRef = useRef(time);
  const audioRef = useRef(audioContext);
  timeRef.current = time;

  useEffect(() => {
    audioRef.current.src = serverEncourageVoicesDir + 'start.mp3';
  }, [])

  useEffect(() => {
    if (!show) return;
    setTimeout(() => {
      setShowText(true);
      changeTime();

      if (encourageConfig.isPlayAudio) {
        audioRef.current.seek(0);
        audioRef.current.play();
      }
    }, 1000);
  }, [show])

  function changeTime() {
    setTimeout(() => {
      const time = timeRef.current;
      if (time === 0) {
        setTime(3);
        setShowText(false);
        onEnd();
        setDestroy(true);
        dispatch(startExecutingGoal());
        setTimeout(() => {
          setDestroy(false);
        },100)
        return
      };

      setTime(time - 1);
      changeTime();
    }, 1000)
  }

  if (destroy) return null;
  return (
    <View className="timer-cover-container">
      <View className={`timer-cover-wrapper ${show ? 'timer-cover-show' : ''}`}>
        
      </View>
      {showText && (
        <View className="timer flex-center">
          <Text>{time || '开始'}</Text>
        </View>
      )}
    </View>
  )
}

export default TimerCover