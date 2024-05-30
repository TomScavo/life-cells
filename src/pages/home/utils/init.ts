import Taro, { useReady } from '@tarojs/taro'
import { uuid } from '../../../utils'
import { RootState, AppDispatch } from '../../../store';

import { Store } from '../../../constants';
import { updateBirthday, setShowBirthdayModal } from '../../../store/birthday';
import { setShowLoadingCover } from '../../../store/loadingCover';
import { setShowTabBar, updateSelectedTab } from '../../../store/tabBar';
import { updateLoopType } from '../../../store/media';
import { initGoals, updateSelectedGoal, initExecutingGoal, updateEncourageConfig, initTodayGoals, updateGoalType, initEverydayGoals } from '../../../store/goals';
import { Goal } from '../../../store/types/goals'
import { goalPage, goalPagePath, goalDetailPage, goalDetailPagePath } from '../../../config';


export default function index(dispatch: AppDispatch) {
    const birthday = Taro.getStorageSync(Store.Birthday);
    const goals = Taro.getStorageSync(Store.Goals);
    const todayGoals = Taro.getStorageSync(Store.TodayGoals);
    const loopType = Taro.getStorageSync(Store.LoopType);
    const encourageConfig  = Taro.getStorageSync(Store.EncourageConfig);
    let executingGoal  = Taro.getStorageSync(Store.ExecutingGoal);
    let goalType  = Taro.getStorageSync(Store.GoalType);
    let everydayGoals  = Taro.getStorageSync(Store.EverydayGoals);

    Taro.setKeepScreenOn({
      keepScreenOn: true
    })

    dispatch(setShowTabBar(false));

    if (birthday) {
      dispatch(updateBirthday(birthday));
      dispatch(setShowBirthdayModal(false));
      dispatch(setShowLoadingCover(true));
  
      setTimeout(() => {
        dispatch(setShowLoadingCover(false));
        dispatch(setShowTabBar(true));
      }, 2000);
    }

    if (!birthday) {
      dispatch(setShowLoadingCover(false));
    }

    if (goalType) {
      dispatch(updateGoalType(goalType));
    }

    if (executingGoal) {
      executingGoal = JSON.parse(executingGoal);
      if (executingGoal.isExecuting) {
        dispatch(updateSelectedGoal(executingGoal.selectedGoal));
        dispatch(initExecutingGoal(executingGoal));
        dispatch(updateSelectedTab(goalDetailPagePath))
        Taro.navigateTo({
          url: goalDetailPage
        })
      }
    }

    if (todayGoals && JSON.parse(todayGoals)) {
      dispatch(initTodayGoals(JSON.parse(todayGoals)));

      if (!executingGoal.isExecuting) {
        dispatch(updateSelectedTab(goalPagePath))
        Taro.switchTab({
          url: goalPage
        })
      }
    }

    if (goals && JSON.parse(goals).length) {
      let parsedGoals = JSON.parse(goals) as Goal[];

      parsedGoals = parsedGoals.map(goal => {
        const id = goal.id || uuid();
        return {
          ...goal,
          id
        }
      });
      dispatch(initGoals(parsedGoals));

      if (!executingGoal.isExecuting) {
        dispatch(updateSelectedTab(goalPagePath))
        Taro.switchTab({
          url: goalPage
        })
      }
    }

    if (everydayGoals && JSON.parse(everydayGoals)) {
      dispatch(initEverydayGoals(JSON.parse(everydayGoals)));
    }

    if (loopType) {
      dispatch(updateLoopType(loopType));
    }

    if (encourageConfig) {
      const data = JSON.parse(encourageConfig);
      if (!('isShowHero' in data)) {
        data.isShowHero = true;
      }
      if (!('backgroundOpacity' in data)) {
        data.backgroundOpacity = 40;
      }
      dispatch(updateEncourageConfig(data));
    }
  }