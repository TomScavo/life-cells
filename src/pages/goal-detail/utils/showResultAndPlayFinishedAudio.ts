import moment from 'moment';

import { Args } from "../../../pages/goal-detail/types";
import { encourageVoices, audioContext as globalAudioContext } from "../../../constants";

import {
    getFinishedTotalTime,
    getRandomEncourage,
    getNumberAudios,
    getIncreasedRatio,
    playAudios,
    getExecutingTime
} from './';

export function showResultAndPlayFinishedAudio({
    increasedValue,
    isPlayUsedTime = true,
    ...args
}: Args & {
    increasedValue: number;
    isPlayUsedTime?: boolean;
}) {
    const {
      executingGoalRef,
      encouragesRef,
      setShowAnimalEncourage,
      decimalLength,
      total,
      finished,
      encourageConfig,
      setToast
    } = args;
    const finishedTime = getFinishedTotalTime(executingGoalRef);
    const hours = Math.trunc(moment.duration(finishedTime).asHours());
    const minutes = Math.trunc(moment.duration(finishedTime).minutes());
    const seconds = Math.trunc(moment.duration(finishedTime).seconds());
    const { compliment } = getRandomEncourage(encouragesRef);
    let audios = [ encourageVoices.finishPrefix ];
    setShowAnimalEncourage(true);
  
    let msg = `完成进度，`;

    if (isPlayUsedTime) {
      msg += `用时：${getExecutingTime(executingGoalRef)}，`
      audios = [
        ...audios,
        encourageVoices.usedTimePrefix,
        ...getNumberAudios(hours, encourageVoices.hour),
        ...getNumberAudios(minutes, encourageVoices.minute),
        ...getNumberAudios(seconds, encourageVoices.second),
      ]
    }
    const increasedRatio = getIncreasedRatio(    {
      decimalLength,
      executingGoalRef,
      total,
      ratio: increasedValue / total
    });
    msg += `总进度增加了 ${increasedRatio}%`;
  
    audios = [
      ...audios,
      encourageVoices.finishProgressPrefix,
      ...getNumberAudios(increasedRatio),
      compliment
    ]
  
    if (increasedValue + finished >= total) {
      audios = [
        ...audios,
        encourageVoices.goalFinished
      ]
  
      msg += '，目标已实现！'
    }

    setToast({
      text: msg,
      duration: 15000
    })
    
    if (encourageConfig.isPlayAudio) {
      playAudios({...args, voices: audios.filter(Boolean) });
    }
}
