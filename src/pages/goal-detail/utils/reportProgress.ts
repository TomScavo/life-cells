import moment from 'moment';

import { Args } from "../../../pages/goal-detail/types";

import { encourageVoices, audioContext as globalAudioContext } from "../../../constants";

import {
    getFinishedTotalTime,
    getRandomEncourage,
    checkIsHourUnit,
    getIncreasedTotalHour,
    getNumberAudios,
    getIncreasedRatio,
    playAudios
} from './';

type Audios = (string | {voiceUrl: string, type: 'animal'})[]

export function getRandomAnimal(animalsRef: React.MutableRefObject<any[]>) {
    const animals = animalsRef.current;
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    const randomAnimalData = randomAnimal.data[Math.floor(Math.random() * randomAnimal.data.length)]
  
    return ({
      ...randomAnimalData,
      name: randomAnimal.name
    })
}

function addFinishedAudios(audios: Audios, {
    executingGoalRef,
    selectedGoalRef,
    finished,
    total
  }: Args
) {
    const isHourUnit = checkIsHourUnit(selectedGoalRef);
    if (!isHourUnit) return audios;

    const isFinished = getIncreasedTotalHour(executingGoalRef) + finished >= total;
    if (!isFinished) return audios;

    return [
        ...audios,
        encourageVoices.goalFinished
    ]
}

function addTimeAudios(audios: Audios, { executingGoalRef }: Args) {
    const hours = Math.trunc(moment.duration(getFinishedTotalTime(executingGoalRef)).asHours());
    const minutes = Math.trunc(moment.duration(getFinishedTotalTime(executingGoalRef)).minutes());

    return [
        ...audios,
        encourageVoices.numberPrefix,
        ...getNumberAudios(hours, encourageVoices.hour),
        ...getNumberAudios(minutes, encourageVoices.minute)
    ].filter(Boolean);
}

function addProgressAudios(audios: Audios, args: Args) {
    const {
        executingGoalRef,
        total,
        encourageConfig,
        decimalLength,
        selectedGoalRef
      } = args;
    const isHourUnit = checkIsHourUnit(selectedGoalRef)
    if (!isHourUnit || !encourageConfig.isPlayProgress) return audios;

    const increasedRatio = getIncreasedRatio({
        decimalLength,
        executingGoalRef,
        total,
    });
    return [
        ...audios,
        encourageVoices.progressPrefix,
        ...getNumberAudios(increasedRatio),
    ]
}

function addComplimentAudios(audios: Audios, { encourageConfig, encouragesRef }: Args) {
    const { compliment }  = getRandomEncourage(encouragesRef);

    if (!encourageConfig.isPlayCompliment) return audios; 

    return [
        ...audios,
        compliment
    ]
}

function addEncourageAudios(audios: Audios, { encourageConfig, encouragesRef }: Args) {
    const { encourage }  = getRandomEncourage(encouragesRef);

    if (encourageConfig.isPlayEncourage) {
        return [
            ...audios,
            encourage,
        ]
    } else {
        return audios
    }
}

function addAnimalAudios(audios: Audios, args: Args) {
    const {
        animalsRef,
        setCurrentAnimal,
        encourageConfig
    } = args;

    if (!encourageConfig.isPlayAnimalAudio) return audios;

    const randomAnimal = getRandomAnimal(animalsRef);
    setCurrentAnimal(randomAnimal);

    return [
        ...audios,
        encourageVoices[randomAnimal.name],
        encourageVoices.talk,
        {
        voiceUrl: randomAnimal.voiceUrl,
        type: 'animal'
        }
    ]
}

function getAudios(args: Args) {
    let audios: Audios = [];

    audios = addFinishedAudios(audios, args);

    audios = addTimeAudios(audios, args);

    audios = addProgressAudios(audios, args);

    audios = addComplimentAudios(audios, args);

    audios = addEncourageAudios(audios, args);

    audios = addAnimalAudios(audios, args);

    return audios;
}

export function reportProgress(args: Args) {
    const {
      executingGoalRef,
      reportedMinutesRef,
      encourageConfig,
    } = args;
    const currentMinute = Math.trunc(moment.duration(getFinishedTotalTime(executingGoalRef), 'milliseconds').asMinutes());
    const shouldReport = !reportedMinutesRef.current.includes(currentMinute) && !!currentMinute && currentMinute % encourageConfig.intervalTime === 0 && encourageConfig.isPlayAudio;
    if (!shouldReport) return;

    reportedMinutesRef.current.push(currentMinute);

    playAudios({
        ...args,
        voices: getAudios(args),
    });
  }