import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import services from "../../services";
import { encourageVoices, Route, audioContext as globalAudioContext } from "../../constants";
import { Title, Mask, ProgressBar, BirthdayPicker, PlayButton, AddProgressModal, PlayBar, Toast } from "../../component";
import { goalDetailPagePath } from "../../config";
import { useGetRef } from "../../hooks";
import { updateAnime } from "../../store/goals";
import Music from "./components/music";
import Config from "./components/config";
import OperationIcons from "./components/operation-icons";
import StartPauseButton from "./components/start-pause-buttons";
import MiniWindow from "./components/mini-window";
import { Args } from "./types";

import {
  reportProgress,
  stopAnimalMusic,
  playCoverAudio,
  calculateDecimalLength,
  getExecutingTime,
  start,
  getRatio,
  endExecutingGoal,
  onGoBack,
  showResultAndPlayFinishedAudio,
  checkIsHourUnit
} from "./utils";

import './index.scss';

let executingTimer: any = null;
const GoalDetail = () => {
  // const goals = useSelector(state => state.goals.goals);
  const dispatch = useDispatch();
  const selectedGoal = useSelector(state => state.goals.selectedGoal);
  const isMediaPlying = useSelector(state => state.media.isPlaying);
  const currentSubtitle = useSelector(state => state.media.currentSubtitle);
  const isMediaPlyingRef = useGetRef(isMediaPlying);
  const currentTime = useSelector(state => state.media.currentTime);
  const showPlayBar = useSelector(state => state.media.showPlayBar);
  const encourageConfig = useSelector(state => state.goals.encourageConfig);
  const executingGoal = useSelector(state => state.goals.executingGoal);
  const executingGoalRef = useGetRef(executingGoal);
  const [decimalLength, setDecimalLength] = useState(7);
  const [toast, setToast] = useState({ duration: 2000, text: '' });
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);
  const [animals, setAnimals] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // const [backgroundImage, setBackgroundImage] = useState<string>(encourageConfig.selectedImage || getRandomBackgroundImage());
  const isPlayingRef = useGetRef(isPlaying);
  const [showTimerCover, setShowTimerCover] = useState<boolean>(false);
  const animalsRef = useGetRef<any[]>(animals);
  const reportedMinutesRef = useRef<any[]>([]);
  const selectedGoalRef = useGetRef<any>(selectedGoal);
  const isPlayingAnimalAudioRef = useRef(false);
  // const animalAudioContextRef = useRef<Taro.InnerAudioContext>();

  const [currentAnimal, setCurrentAnimal] = useState(selectedGoal!.animal);
  const [executingTime, setExecutingTime] = useState<string>(() => {
    const { isExecuting } = executingGoal;
    if (isExecuting) {
      return getExecutingTime(executingGoalRef, executingGoal)
    } else {
      return '00:00:00';
    }
  });
  const [showAnimalEncourage, setShowAnimalEncourage] = useState(!executingGoal.isExecuting);
  const currentAnimalRef = useGetRef(currentAnimal);
  const { isExecuting, isPaused } = executingGoal;
  const encouragesRef = useRef<{ compliments: string[], encourages: string[]  }>({compliments: [], encourages: []});

  const audioRef = useRef(Taro.getBackgroundAudioManager());
  const isPlayingAudioRef = useRef(false);
  const currentPlayingAudioContextRef = useRef<Taro.InnerAudioContext | null>(null);
  const currentPlayingAudioContextsRef = useRef<Taro.InnerAudioContext[]>([]);

  if (!selectedGoal) return;
  const {
    goal,
    task,
    total,
    unit,
    index,
    animal,
    finished
  } = selectedGoal;

  const stopCurrentAudio = useCallback(() => {
    currentPlayingAudioContextRef.current?.stop();
    currentPlayingAudioContextsRef.current.forEach(i => i?.destroy())

    if (isPlayingAnimalAudioRef.current) {
      // animalAudioContextRef.current!.stop();
      setShowAnimalEncourage(false);
      isPlayingAnimalAudioRef.current = false;
    }
  }, []);

  const args: Args = {
    executingGoalRef,
    encouragesRef,
    reportedMinutesRef,
    encourageConfig,
    selectedGoalRef,
    finished,
    total,
    decimalLength,
    animalsRef,
    setCurrentAnimal,
    currentPlayingAudioContextsRef,
    currentPlayingAudioContextRef,
    showPlayBar,
    setShowAnimalEncourage,
    isPlayingAnimalAudioRef,
    audioRef,
    animals,
    currentAnimal,
    currentAnimalRef,
    setIsPlaying,
    stopCurrentAudio,
    setToast,
    showTimerCover,
    isExecuting,
    isPaused,
    executingTimer,
    executingGoal,
    setExecutingTime,
    setShowTimerCover,
    executingTime,
    setShowAddProgressModal,
    isPlaying,
    isPlayingRef,
    showAnimalEncourage,
    currentSubtitle
  }

  useEffect(() => {
    if (isExecuting && !isPaused) {
      start(
        setExecutingTime,
        executingGoalRef,
        executingGoal,
        executingTimer
      );
    }
  }, []);

  useEffect(() => {
    services.getEncourages((res) => {
      encouragesRef.current = res.data;
    })
  }, [])

  useEffect(() => {
    setCurrentAnimal(selectedGoal!.animal);
  }, [selectedGoal?.animal.imageUrl])

  useEffect(() => {
    services.getAnimals((res) => {
      setAnimals(res.data);
    });

    services.getAnime().then(res => {
      dispatch(updateAnime(res));
    })
  }, [])

  useEffect(() => {
    if (!isExecuting) return;
    if (!animals.length) return;
    if (!encouragesRef.current.compliments.length) return;
    reportProgress(args);
  }, [executingTime, animals])

  useEffect(() => {
    if (isExecuting && isPlaying) {
      audioRef.current.stop();
      setIsPlaying(false);
    }
  }, [isExecuting])

  useEffect(() => {
    if (!isPlaying) return;

    playCoverAudio(args);
  }, [currentAnimal])

  useEffect(() => {
    return(() => {
      stopCurrentAudio();
      stopAnimalMusic(isPlayingRef, audioRef);
    })
  }, []);

  useEffect(() => {
    calculateDecimalLength(unit, total, setDecimalLength);
  }, [selectedGoal?.total, selectedGoal?.unit]);

  return (
    <View className="goal-detail-wrapper" style={encourageConfig.isShowBackgroundImage ? { backgroundImage: `url(${encourageConfig.selectedImage})` } : {}}>
      {
        encourageConfig.isShowBackgroundImage && (
          <View
            className="background-mask"
            style={{
              background: encourageConfig.backgroundOpacity === 100 ? `#000` : `rgba(0,0,0,0.${encourageConfig.backgroundOpacity.toString().padStart(2, '0')})`
            }}
          ></View>
        )
      }

      <Title showGoBack onGoBack={() => onGoBack(isExecuting, stopCurrentAudio, executingTimer)}>{goal}</Title>
      {
        encourageConfig.isShowBackgroundImage && (
          <View className="text-ellipsis remark">
            {task}
          </View>
        )
      }

      {
        encourageConfig.isShowConsumeLife && checkIsHourUnit(selectedGoalRef) && (
          <View className="consume-life">
            {`需要消耗 ${((total / (80 * 365 * 24)) * 100).toFixed(5)}% 的生命来完成此目标`}
          </View>
        )
      }

      <MiniWindow {...args} />

      <View className="progress-bar-detail-wrapper">
        <ProgressBar
          needPadEnd
          showHero
          decimalLength={decimalLength}
          ratio={
            getRatio({
              isExecuting,
              selectedGoalRef,
              finished,
              total,
              executingGoalRef,
            })
          }
        ></ProgressBar>
      </View>

      <OperationIcons
          isExecuting={isExecuting}
          setToast={setToast}
          setShowAddProgressModal={setShowAddProgressModal}
          setIsPlaying={setIsPlaying}
          isPlayingRef={isPlayingRef}
          audioRef={audioRef}
      />

      <View className="button-container flex-center">
        <View className="button-wrapper flex-between">
          <Music></Music>
          <StartPauseButton {...args}/>
          <Config stopCurrentAudio={stopCurrentAudio}/>
        </View>
      </View>
      <AddProgressModal
        visible={showAddProgressModal}
        executingTime={executingTime}
        playFinishedAudio={
          ({ increasedValue, isPlayUsedTime}) => 
            showResultAndPlayFinishedAudio({
              ...args,
              increasedValue,
              isPlayUsedTime,
            })
        }
        onCancel={() => {setShowAddProgressModal(false)}}
        onSuccess={() => {setShowAddProgressModal(false)}}
        endExecutingGoal={() => endExecutingGoal(stopCurrentAudio, executingTimer)}
      />
      <PlayBar pageUrl={goalDetailPagePath} hasTabBar={false}></PlayBar>
      <Toast toast={toast}></Toast>
    </View>
  );
}

export default GoalDetail;
