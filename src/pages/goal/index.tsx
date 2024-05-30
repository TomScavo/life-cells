import { useState, useRef, useEffect } from 'react';
import omit from 'lodash-es/omit';
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, MovableArea, MovableView } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Title, Mask, ProgressBar, BirthdayPicker, Empty, PlayBar, ScrollTitles } from "../../component";
import { serverIP, addGoalPage, serverImagesDir, goalDetailPage, goalPagePath } from "../../config";
import {  updateSelectedGoal, updateGoals, updateGoalType } from "../../store/goals";
import { Goal as IGoal, GoalType } from "../../store/types/goals";
import plusIcon from "../../images/plus.png";
import catIcon from "../../images/cat.png";
import { Route } from "../../constants";
import './index.scss';

const Goal: React.FC = () => {
  const goals = useSelector(state => state.goals.goals);
  const todayGoals = useSelector(state => state.goals.todayGoals);
  const[ selectedGoals, setSelectedGoals ] = useState<IGoal[]>([]);
  const goalType = useSelector(state => state.goals.goalType);
  const showPlayBar = useSelector(state => state.media.showPlayBar);
  const dispatch = useDispatch();
  const selectedGoalsRef = useRef(selectedGoals);
  selectedGoalsRef.current = selectedGoals;
  const [movedGoal, setMovedGoal] = useState('');
  const endYRef = useRef(0);
  const randomNumYRef = useRef(0);
  const movedGoalRef = useRef('');
  const hasMovedRef = useRef(false);
  const isEmpty = !selectedGoals.length;

  useEffect(() => {
    if (goalType === GoalType.Today) {
      const today = moment().format('YYYY-MM-DD');
      setSelectedGoals(todayGoals[today] || []);
    } else {
      setSelectedGoals(goals);
    }
  }, [goalType, goals, todayGoals])

  function handleClickAddButton() {
    Route.navigateTo({url: addGoalPage});
  }

  function switchToDetailPage(goal: IGoal, index: number) {
    Route.navigateTo({ url: goalDetailPage });
    dispatch(updateSelectedGoal({...goal, index, date: moment().format('YYYY-MM-DD')}));
  }

  function moving(event: any, movedGoal: string) {
    const {
      detail,
    } = event

    if (detail.y) {
      hasMovedRef.current = true;
    }

    endYRef.current = (detail.y);
  }

  function moveEnd(e: any) {
    if (!hasMovedRef.current) return;
    const goalsWithY = selectedGoalsRef.current.map((goal, index) =>( {...goal, y: index * 200 + index * 30 }));
    const movedItem = goalsWithY.find(item => item.goal === movedGoalRef.current);
    if (!movedItem) return;
    Taro.getSystemInfo({
      success (res) {
        movedItem.y = endYRef.current * (750 / res.windowWidth) - 20;
        const newGoals = goalsWithY.sort((a, b) => a.y - b.y).map(i => (omit(i, ['y'])));
    
        movedGoalRef.current = '';
        randomNumYRef.current = Math.random();
        movedGoalRef.current = '';
        endYRef.current = 0;
        hasMovedRef.current = false;
        dispatch(updateGoals(newGoals));
        setMovedGoal('');
      }
    })
  }

  function moveStart(goal: string, initPosition: number) {
    movedGoalRef.current = goal;
    setMovedGoal(goal);
  }

  return (
    <View className="goals-container">
      <Title style={{ marginTop: '40rpx' }}>目标</Title>
      <View className="sub-title-wrapper">
        <ScrollTitles
          selectedTitle={goalType}
          titles={[{name: `今日目标 ${moment().format('YYYY-MM-DD')}`, key: GoalType.Today}, {name: '总目标', key: GoalType.LifeTime}]}
          onChange={(goal) => {dispatch(updateGoalType(goal as GoalType))}}
        ></ScrollTitles>
      </View>

      {
        isEmpty && (
          <Empty text="还未制定任何目标"></Empty>
        )
      }

      <View className="goals-wrapper" style={showPlayBar ? {height: `calc(100vh - env(safe-area-inset-bottom) - 380rpx - 100rpx)`} : {}}>
        {
          !isEmpty && (
            <MovableArea
              style={{ height: `${selectedGoals.length * 200 + selectedGoals.length * 30}rpx`, width: '100%' }}
            >
              {
                selectedGoals.map((item, index) => {
                  const {
                    goal,
                    task,
                    total,
                    unit,
                    animal,
                    finished
                  } = item;

                  return (
                    <MovableView
                      direction="vertical"
                      // key={goal + animal?.imageUrl || ''}
                      key={goal + animal?.imageUrl + randomNumYRef.current || ''}
                      className="goal-item"
                      onClick={() => switchToDetailPage(item, index)}
                      y={goal === movedGoalRef.current && hasMovedRef.current ? endYRef.current : `${index * 200 + index * 30}rpx`}
                      onTouchMove={e => moveStart(goal, index * 200 + index * 30)}
                      onChange={e => moving(e, goal)}
                      onTouchEnd={moveEnd}
                      style={goal === movedGoalRef.current ? { zIndex: 1, background: 'rgb(21 36 95)' } : {}}
                    >
                      <View className="thumbnail-wrapper">
                        <Image mode="heightFix" src={animal?.imageUrl || ''} className="thumbnail"></Image>
                      </View>
                      <View className="goal-item-container">
                        <View  className="goal-item-wrapper">
                          <Text className="goal text-ellipsis">{goal}</Text>
                          <Text className="task text-ellipsis">{task}</Text>
                          <View className="progress-bar">
                            <ProgressBar ratio={finished / total}></ProgressBar>
                          </View>
                        </View>
                      </View>
                    </MovableView>
                  )
                })
              }
            </MovableArea>
          )
        }
        <Button className="add-button" onClick={handleClickAddButton}>
          <Image src={plusIcon}></Image>
          {
            goalType === GoalType.Today ? (
              <Text>添加今日目标</Text>
            ) : (
              <Text>添加总目标</Text>
            )
          }
        </Button>
      </View>
      <PlayBar pageUrl={goalPagePath}></PlayBar>
    </View>
  );
}

export default Goal;