import { ScrollView, Text, View, Canvas, Video, Image } from "@tarojs/components";
import { useEffect, useState, Component } from "react";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { uuid } from '../../utils'
import init from './utils/init';

import { Title, Mask, BirthDayProgressBar, BirthdayPicker, LoadingCover, Cells, PlayBar } from "../../component";
import { Store } from '../../constants';
import store from '../../store';
import { updateBirthday, setShowBirthdayModal } from '../../store/birthday';
import { setShowLoadingCover } from '../../store/loadingCover';
import { setShowTabBar, updateSelectedTab } from '../../store/tabBar';
import { getMode } from '../../services';
import { updateLoopType } from '../../store/media';
import { initGoals, updateSelectedGoal, initExecutingGoal, updateEncourageConfig, initTodayGoals, updateGoalType, initEverydayGoals } from '../../store/goals';
import { Goal } from '../../store/types/goals'
import { updateIsOnline } from '../../store/media';
import { goalPage, goalPagePath, homePagePath, goalDetailPage, goalDetailPagePath } from '../../config';
import editIcon from '../../images/edit.png';
import settingIcon from '../../images/setting.png';

import './index.scss';

const numPerRow = 23;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov']
let ref: any = null;
const Home = () => {
  const showBirthdayModal = useSelector(state => state.birthday.showBirthdayModal);
  const goals = useSelector(state => state.goals);
  const everydayGoals = useSelector(state => state.goals.everydayGoals);
  const todayGoals = useSelector(state => state.goals.todayGoals);
  const showPlayBar = useSelector(state => state.media.showPlayBar);
  const activePath = useSelector(state => state.tabBar.selectedTab);
  const dispatch = useDispatch();
  const pages = Taro.getCurrentPages();
  const currentPage = pages[pages.length - 1].route;

  useEffect(() => {
    checkIsOnline();
    init(dispatch);
  }, [])

  useEffect(() => {
    clearInterval(ref as any);
    test();
  }, [goals, everydayGoals, todayGoals])

  function checkIsOnline() {
    getMode((res) => {
      dispatch(updateIsOnline(res.data.online || false));
    })
  }

  function test() {
    // Taro.request({
    //   url: 'https://lifecells.top/encourage-voices/start.mp3', //仅为示例，并非真实的接口地址
    //   header: {
    //     'content-type': 'application/octet-stream' // 默认值
    //   },
    //   success (res) {
    //     console.log(res.data)
    //   }
    // })

    ref = setInterval(() => {
      console.log('----------------------');
      console.log('goals', goals.goals);
      console.log('todayGoals', todayGoals['2024-03-10']);
      console.log('everydayGoals', everydayGoals);
    }, 20000)
  }

  function handleEdit() {
    dispatch(setShowBirthdayModal(true));
  }

  if (activePath !== homePagePath) return null;
  return (
    <View className="home-wrapper" style={showPlayBar ? {maxHeight: `calc(100vh - env(safe-area-inset-bottom) - 100rpx - 130rpx)`} : {}}>
      <Title>
        <Text>生命格子</Text>
        <Image
          onClick={handleEdit}
          src={editIcon}
          className="edit-icon"
          mode="heightFix"
        ></Image>
      </Title>
      <Cells />
      <Mask style={{ padding: '5px 20px', marginTop: '10px' }}>
        <BirthDayProgressBar></BirthDayProgressBar>
      </Mask>
      {showBirthdayModal && <BirthdayPicker />}
      <LoadingCover></LoadingCover>
      <PlayBar pageUrl={homePagePath}></PlayBar>
    </View>
  );
}

Home.onShareAppMessage = () => {}

Home.onShareTimeline = () => {}

export default Home;