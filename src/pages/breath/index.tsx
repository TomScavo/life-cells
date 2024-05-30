import { ScrollView, Text, View, Canvas, Video, Button, Image } from "@tarojs/components";
import { useEffect, useState, Component } from "react";
import Taro, { getCurrentPages, useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import "./index.scss";
import { Title, Mask, ProgressBar, BirthdayPicker, LoadingCover } from "../../component";
import { setShowTabBar, updateSelectedTab } from "../../store/tabBar";
import { setShowLoadingCover } from "../../store/loadingCover";

import playIcon from "../../images/play.png";
import goBackIcon from "../../images/left-arrow.png";
import { VideoProps } from '@tarojs/components/types/Video';
import { customTabBarConfigList, serverAddress, homePagePath, goalPagePath, homePage, goalPage } from '../../config'

import './index.scss';

// const homePagePath = customTabBarConfigList[0].pagePath;

let timer: any = null;
let isPlayingGlobal = false;
const Breath = () => {
  const showLoadingCover = useSelector(state => state.loadingCover.showLoadingCover);
  const goals = useSelector(state => state.goals.goals);
  const [fade, setFade] = useState(false);
  const [duration, setDuration] = useState('2:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowTabBar(false));

    return(() => {
      clearTimeout(timer);
    })
  }, []);

  function updateIsPlaying(isPlaying: boolean) {
    isPlayingGlobal = isPlaying;
    setIsPlaying(isPlaying);
  }

  function fadeTimeOut(duration?: number) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!isPlayingGlobal) return;

      setFade(true);
    }, duration || 5000);
  }

  function handlePlay(e) {
    if (fade) return;

    const videoContext = Taro.createVideoContext('breath');

    if (isPlaying) {
      videoContext.pause();
      stopPlay(e);
    } else {
      updateIsPlaying(true);
      fadeTimeOut();
      videoContext.play();
    }
  }

  function handleUpdate({ detail }: any) {
    const {currentTime, duration} = detail;
    const restTime = duration - currentTime;
    const restSeconds = restTime % 60;

    setDuration(`${Math.floor(restTime / 60)}:${Math.floor(restSeconds).toString().padStart(2, '0')}`);

    if (showLoadingCover) {
      dispatch(setShowLoadingCover(false));
    }
  }

  function goBack() {
    if (fade) return;

    stopPlay();

    const videoContext = Taro.createVideoContext('breath');
    videoContext.seek(0);
    setDuration('2:00');

    dispatch(setShowTabBar(true));
    if (goals && goals.length) {
      dispatch(updateSelectedTab(goalPagePath));
      Taro.switchTab({ url: goalPage });
    } else {
      dispatch(updateSelectedTab(homePagePath));
      Taro.switchTab({ url: homePage });
    }
  }

  function handleClickMask() {
    if (isPlaying) {
      fadeTimeOut();
      setFade(false);
    }
  }

  function handleLoadedMetaData() {
    setTimeout(() => {
      dispatch(setShowLoadingCover(false));
    }, 2000);
  }

  function stopPlay(e?: any) {
    clearTimeout(timer);
    e && e.stopPropagation && e.stopPropagation();
    const videoContext = Taro.createVideoContext('breath');
    videoContext.pause();
    updateIsPlaying(false);
    setFade(false);
  }

  return (
    <View className="breath">
      <Video
        id="breath"
        showCenterPlayBtn={false}
        onEnded={stopPlay}
        onLoadedMetaData={handleLoadedMetaData}
        onTimeUpdate={handleUpdate}
        controls={false}
        src={serverAddress + 'breath.mp4'}
        className="video"
        objectFit="cover"
      ></Video>
      <View className="mask" onClick={handleClickMask}>
        <View className={`fade-mask ${fade ? 'fade' : ''}`}>
          <View className="go-back" onClick={goBack}>
            <Image src={goBackIcon} className="go-back-icon" />
          </View>
          <View className="breath-title">
            <Text className="title">呼 吸</Text>
            <Text>{ duration }</Text>
          </View>
          <Button className="play" onClick={handlePlay}>
            {
              isPlaying && (
                <View className="stop-wrapper">
                  <View className="stop-before"></View>
                  <View className="stop-after"></View>
                </View>
              )
            }
            {
              !isPlaying && <Image className="play-icon" src={playIcon} />
            }
          </Button>
        </View>
      </View>
      <LoadingCover></LoadingCover>
    </View>
  );
}

export default Breath;