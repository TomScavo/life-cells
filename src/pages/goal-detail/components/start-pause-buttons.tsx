import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { updateActiveType } from '../../../store/media';
import { MediaType } from '../../../constants';
import { ScrollTitles, MusicList } from '../../../component';
import musicIcon from '../../../images/music.png';
import CoverModal from './cover-modal';
import { ExecutingGoal, EncourageConfig } from "../../../store/types/goals"
import {
    pauseExecutingGoal,
    startExecutingGoal,
    finishUnitHourExecutingGoal,
} from "../../../store/goals";
import TimerCover from "../components/timer-cover";

import triangleRightIcon from "../../../images/triangle-right.png";
import squareIcon from "../../../images/square.png";


import {
    playAudios,
    start,
    checkIsHourUnit,
    getIncreasedTotalHour,
    showResultAndPlayFinishedAudio,
    getRandomEncourage
} from "../utils"
import { encourageVoices, Route, audioContext as globalAudioContext } from "../../../constants";
import { Args } from '../types'

import './start-pause-buttons.scss';

interface Props extends Args {
   
}

const StartPauseButtons: React.FC<Props> = (args) => {
    const {
      isExecuting,
      isPaused,
      stopCurrentAudio,
      encourageConfig,
      currentPlayingAudioContextsRef,
      currentPlayingAudioContextRef,
      showPlayBar,
      setShowAnimalEncourage,
      isPlayingAnimalAudioRef,
      executingTimer,
      executingGoalRef,
      executingGoal,
      setExecutingTime,
      setShowTimerCover,
      selectedGoalRef,
      executingTime,
      setShowAddProgressModal,
      encouragesRef,
      decimalLength,
      total,
      finished,
      setToast,
      showTimerCover
  } = args;

    const dispatch = useDispatch();

    function handlePauseExecutingGoal() {
        clearTimeout(executingTimer);
        dispatch(pauseExecutingGoal());
        playAudios({
          ...args,
          voices: [encourageVoices.pause],
        });
    }

    function startExecute() {
        setShowAnimalEncourage(false);
        dispatch(startExecutingGoal());
        start(
          setExecutingTime,
          executingGoalRef,
          executingGoal,
          executingTimer
        );
    }

    function handleContinue() {
        startExecute();
        playAudios({
          ...args,
          voices: [encourageVoices.continue],
        });
    }


function handleFinish() {
    Taro.showModal({
      title: `确定要结束吗？`,
      content: ``,
      confirmText: '确定',
      cancelText: '取消',
      // confirmColor: '#dc5046',
      cancelColor: '#5a5a5a',
      success (res) {
        if (res.confirm) {
          if (checkIsHourUnit(selectedGoalRef)) {
            const totalHour = getIncreasedTotalHour(executingGoalRef);
            showResultAndPlayFinishedAudio({
              ...args,
              increasedValue: totalHour,
              isPlayUsedTime: true,
            })
            dispatch(finishUnitHourExecutingGoal({ duration: executingTime }));
          } else {
            setShowAddProgressModal(true);
          }
        }
      }
    })
    // playAudios([encourageVoices.continue]);
  }

    return (
        <>
            {
                !isExecuting && (
                <Button className="start-button" onClick={() => { setShowTimerCover(true); }}>
                    开始
                </Button>
                )
            }

            {
                isExecuting && !isPaused && (
                <Button
                    className="button pause-button"
                    onClick={handlePauseExecutingGoal}
                >
                    暂停
                </Button>
                )
            }

            {
                isExecuting && isPaused && (
                <>
                    <Button
                    className="button continue-button flex-center"
                    onClick={handleContinue}
                    >
                    <Image src={triangleRightIcon} />
                    </Button>
                    <Button
                    className="button finish-button flex-center"
                    onClick={handleFinish}>
                    <Image src={squareIcon} />
                    </Button>
                </>
                )
            }


          <TimerCover
            show={showTimerCover}
            onEnd={() => {
              playAudios({
                ...args,
                voices: [getRandomEncourage(encouragesRef).encourage],
              });
              setShowTimerCover(false);
              startExecute();
              if (!checkIsHourUnit(selectedGoalRef)) {
                setToast({
                  text: '单位非 “小时“，无法自动增加进度，请在结束后手动添加进度',
                  duration: 8000
                })
              }
            }}
          ></TimerCover>
        </>
    )
}

export default StartPauseButtons;