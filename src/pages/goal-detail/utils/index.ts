import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import services from "../../../services";
import store from "../../../store";

import { closePlay } from "../../../store/media";
import { Args } from "../../../pages/goal-detail/types";

import { encourageVoices, Route, audioContext as globalAudioContext } from "../../../constants";
import { Title, Mask, ProgressBar, BirthdayPicker, PlayButton, AddProgressModal, PlayBar, Toast } from "../../../component";
import { serverIP, addGoalPage, addGoalPagePath, serverImagesDir, goalLogsPagePath, goalLogsPage, goalDetailPagePath } from "../../../config";
import { resetExecutingGoal } from "../../../store/goals";
import { ExecutingGoal, EncourageConfig } from "../../../store/types/goals"

export * from "./reportProgress";
export * from "./showResultAndPlayFinishedAudio";

const dispatch = store.dispatch;

export function getFinishedTotalTime(executingGoalRef: React.MutableRefObject<ExecutingGoal> ) {
    const { startTimestamp, finishedTimeSlice, isPaused } = executingGoalRef.current;
    const newTime = moment().valueOf() - startTimestamp ;
    const totalTime = finishedTimeSlice + (isPaused ? 0 : newTime);
    return totalTime;
}

export function getNumberAudios(num: number, unit?: string): string[] {
    let number = num.toString();
    const isDecimal = number.indexOf('.') !== -1;
    let integer = number.split('.')[0];
    const decimal = isDecimal ? number.split('.')[1] : ''

    if (!num && unit === encourageVoices.second) {
      return [encourageVoices[0], unit];
    }
    if (!num) return [];
  
    const audios: string[] = []
  
    if (integer.length > 3) {
      integer = integer.substring(integer.length - 2);
    }

    if (integer.length === 2) {
      audios.push(encourageVoices[`${integer[0]}0`]);
      if (integer[1] !== '0') {
        audios.push(encourageVoices[`${integer[1]}`]);
      }
    } else {
      if (integer === '2' && unit) {
        audios.push(encourageVoices['twoForTime'])
      } else {
        audios.push(encourageVoices[`${integer}`]);
      }
    }

    if (decimal) {
      audios.push(encourageVoices.point);
      for (let i = 0; i < decimal.length; i++) {
        audios.push(encourageVoices[`${decimal[i]}`])
      }
    }

    if (unit) {
      audios.push(unit);
    }

    return audios;
}

export function getIncreasedTotalHour(executingGoalRef: React.MutableRefObject<ExecutingGoal>) {
  return moment.duration(getFinishedTotalTime(executingGoalRef), 'milliseconds').asHours();
}

export function getIncreasedRatio({
  decimalLength,
  executingGoalRef,
  total,
  ratio
}: {
  decimalLength: number,
  executingGoalRef: React.MutableRefObject<ExecutingGoal>,
  total: number,
  ratio?: number
}) {
  let newDecimalLength = decimalLength;
  ratio = (ratio ?? getIncreasedTotalHour(executingGoalRef) / total) * 100;

  if (ratio >= 100) return 100;
  if (newDecimalLength >= 100) newDecimalLength = 99;
  if (newDecimalLength < 0) newDecimalLength = 1;

  const fixedRatio = ratio.toFixed(newDecimalLength);
  return Number(fixedRatio);
}

export function getRandomEncourage(encouragesRef:
React.MutableRefObject<{
  compliments: string[];
  encourages: string[];
}>) {
  const { compliments, encourages } = encouragesRef.current;
  return ({
    compliment: compliments[Math.floor(Math.random() * compliments.length)],
    encourage:  encourages[Math.floor(Math.random() * encourages.length)]
  })
}

export function checkIsHourUnit(selectedGoalRef: React.MutableRefObject<any>) {
  return selectedGoalRef.current.unit === '小时'
}

export function stopAnimalMusic(isPlayingRef: React.MutableRefObject<boolean>, audioRef: React.MutableRefObject<Taro.BackgroundAudioManager>) {
  if (isPlayingRef.current) {
    audioRef.current.stop();
  }
}

export function changeToNextAnimal(animalsRef: React.MutableRefObject<any[]>, currentAnimalRef: React.MutableRefObject<any>, setCurrentAnimal: React.Dispatch<React.SetStateAction<{
  name: string;
  imageUrl: string;
  voiceUrl: string;
}>>) {
  const animals = animalsRef.current;
  const currentAnimal = currentAnimalRef.current;
  // const { name, imageUrl, voiceUrl } = currentAnimal;
  const totalAnimals = animals.length;
  const currentAnimalData = animals.find(i => i.name === currentAnimal.name).data;
  const currentAnimalDataLength = currentAnimalData.length;
  const currentAnimalDataIndex = currentAnimalData.findIndex((i: any) => i.imageUrl === currentAnimal.imageUrl);
  const isLastAnimalData =  currentAnimalDataIndex + 1 === currentAnimalDataLength;
  const currentAnimalIndex = animals.findIndex(i => i.name === currentAnimal.name);
  const isLastAnimal = currentAnimalIndex + 1 === animals.length;

  if (isLastAnimalData) {
    if (isLastAnimal) {
      setCurrentAnimal({
        ...animals[0].data[0],
        name: animals[0].name,
      })
    } else {
      const nextAnimalData = animals[currentAnimalIndex + 1].data[0]
      setCurrentAnimal({
        ...nextAnimalData,
        name: animals[currentAnimalIndex + 1].name
      });
    }
  } else {
    const nextAnimalData = currentAnimalData[currentAnimalDataIndex + 1]
    setCurrentAnimal({
      ...nextAnimalData,
      name: currentAnimal.name
    });
  }
}

export function playCoverAudio({
  audioRef,
  animals,
  currentAnimal,
  animalsRef,
  currentAnimalRef,
  setCurrentAnimal,
  setIsPlaying
}: Args) {
  dispatch(closePlay());
  const audio = audioRef.current;
  audio.title = animals.find((i: any) => i.name === currentAnimal.name).chinese_name;
  audio.singer = 'keep it up!';
  audio.coverImgUrl = currentAnimal.imageUrl
  audio.src = currentAnimal.voiceUrl;
  const changeAnimal = () => {
    changeToNextAnimal(animalsRef, currentAnimalRef, setCurrentAnimal)
  }
  audio.onEnded(changeAnimal)
  audio.onNext(changeAnimal);
  audio.onPrev(changeAnimal);
  audio.onPause(() => {
    setIsPlaying(false);
  })

  audio.play();
}

export function calculateDecimalLength(unit: string, total: number, setDecimalLength: React.Dispatch<React.SetStateAction<number>>) {
  if (unit !== '小时') {
    return setDecimalLength(7);
  }

  // 1 秒最大的位置
  const result = (1 / (60 * 60 * total)) * 100;
  const resultStr = result.toString();
  const arr = resultStr.split('');
  const index = arr.findIndex(i => (i !== '0' && i !== '.'));
  if (index === -1 ) return setDecimalLength(7);

  if (arr.includes('e')) {
    setDecimalLength(Number(resultStr.split('-').pop()));
    return;
  }
  setDecimalLength(index - 2 + 1);
}

export function getExecutingTime(executingGoalRef: React.MutableRefObject<ExecutingGoal>, executingGoal?: ExecutingGoal) {
  const totalTime = getFinishedTotalTime(executingGoalRef)

  const seconds = moment.duration(totalTime).seconds().toString().padStart(2, '0');
  const minutes = moment.duration(totalTime).minutes().toString().padStart(2, '0');
  const hours = Math.trunc(moment.duration(totalTime).asHours()).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function start(
  setExecutingTime: React.Dispatch<React.SetStateAction<string>>,
  executingGoalRef: React.MutableRefObject<ExecutingGoal>,
  executingGoal: ExecutingGoal,
  executingTimer: any
) {
  setExecutingTime(getExecutingTime(executingGoalRef, executingGoal));
  executingTimer = setTimeout(() => {
    start(setExecutingTime, executingGoalRef, executingGoal, executingTimer);
  }, 1000);
}

export function getRatio({
  isExecuting,
  selectedGoalRef,
  finished,
  total,
  executingGoalRef,
}: {
  isExecuting: boolean;
  selectedGoalRef: React.MutableRefObject<any>;
  finished: number;
  total: number;
  executingGoalRef: React.MutableRefObject<ExecutingGoal>;
}) {
  if (!isExecuting || !checkIsHourUnit(selectedGoalRef)) {

    return finished / total;
  } else {
    const totalHour = getIncreasedTotalHour(executingGoalRef);

    return (totalHour + finished) / total;
  }
}

export function endExecutingGoal(stopCurrentAudio: () => void, executingTimer: any) {
  stopCurrentAudio();
  dispatch(resetExecutingGoal());
  clearTimeout(executingTimer);
}

export function onGoBack(isExecuting: boolean, stopCurrentAudio: () => void, executingTimer: any) {
  if (isExecuting) {
    Taro.showModal({
      title: `确定要退出吗？`,
      content: `本次进度将会丢失`,
      confirmText: '退出',
      cancelText: '取消',
      confirmColor: '#dc5046',
      cancelColor: '#576B95',
      success (res) {
        if (res.confirm) {
          endExecutingGoal(stopCurrentAudio, executingTimer);
          Route.navigateBack();
        }
      }
    })
  } else {
    Route.navigateBack();
    dispatch(resetExecutingGoal());
  }
}

export function playAudiosRecursively({
  audioContexts,
  onEnd,
  currentPlayingAudioContextRef,
  showPlayBar,
  setShowAnimalEncourage,
  isPlayingAnimalAudioRef,
}: {
    audioContexts: {audioContext: Taro.InnerAudioContext; type: string;}[],
    onEnd?: (cb?: () => any ) =>  any,
    currentPlayingAudioContextRef: React.MutableRefObject<Taro.InnerAudioContext | null>,
    showPlayBar: boolean,
    setShowAnimalEncourage: React.Dispatch<React.SetStateAction<boolean>>,
    isPlayingAnimalAudioRef: React.MutableRefObject<boolean>,
  }
) {
  if (!audioContexts.length) {
    currentPlayingAudioContextRef.current = null;

    if (showPlayBar && globalAudioContext.paused) {
      if (onEnd) {
        onEnd(() => globalAudioContext.play())
      } else {
        globalAudioContext.play();
      }
    } else if (onEnd) {
      onEnd();
    }
    return;
  };

  const {audioContext, type} = audioContexts.shift()!;
  currentPlayingAudioContextRef.current = audioContext;
  audioContext.play();
  if (type === 'animal') {
    setShowAnimalEncourage(true);
    isPlayingAnimalAudioRef.current = true;
  }
  audioContext.onEnded(() => {
    if (type === 'animal') {
      // animalAudioContextRef.current?.destroy();
      isPlayingAnimalAudioRef.current = false;
      setShowAnimalEncourage(false);
    }
    currentPlayingAudioContextRef.current?.destroy();
    playAudiosRecursively({
      audioContexts,
      onEnd,
      currentPlayingAudioContextRef,
      showPlayBar,
      setShowAnimalEncourage,
      isPlayingAnimalAudioRef,
    });
  });
  audioContext.onPause(() => {
    setShowAnimalEncourage(false);
  })
}

export function playAudios({
    voices,
    onEnd,
    stopCurrentAudio,
    encourageConfig,
    currentPlayingAudioContextsRef,
    currentPlayingAudioContextRef,
    showPlayBar,
    setShowAnimalEncourage,
    isPlayingAnimalAudioRef,
  }: Args & {
    voices: (string | {voiceUrl: string, type: 'animal'})[],
    onEnd?: (cb?: () => any ) =>  any;
  }) {
  stopCurrentAudio();

  if (!encourageConfig.isPlayAudio) return;

  const audioContexts: {audioContext: Taro.InnerAudioContext; type: string;}[] = [];
  voices.filter(Boolean).forEach(voice => {
    const audioContext = Taro.createInnerAudioContext();
    const voiceUrl = typeof voice === 'string' ? voice : voice.voiceUrl;
    const type = typeof voice === 'string' ? '' : voice.type;
    audioContext.src = voiceUrl;
    audioContexts.push({audioContext, type});
  })

  currentPlayingAudioContextsRef.current = audioContexts.map(i => i.audioContext);

  playAudiosRecursively({
    audioContexts,
    onEnd,
    currentPlayingAudioContextRef,
    showPlayBar,
    setShowAnimalEncourage,
    isPlayingAnimalAudioRef,
  });
}
