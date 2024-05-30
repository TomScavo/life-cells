import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Title } from '../../../component';
import { encourageVoices, Route, audioContext as globalAudioContext } from "../../../constants";
import { serverIP, addGoalPage, addGoalPagePath, serverImagesDir, goalLogsPagePath, goalLogsPage, goalDetailPagePath } from "../../../config";
import { deleteGoal, updateIsEdit } from "../../../store/goals";
import recordIcon from "../../../images/record.png";
import editIcon from "../../../images/edit.png";
import deleteIcon from "../../../images/delete.png";
import logIcon from "../../../images/log.png";

import { serverEncourageVoicesDir } from '../../../config';

import { stopAnimalMusic } from "../utils";

import './operation-icons.scss';

interface Props {
  isExecuting: boolean;
  setToast: React.Dispatch<React.SetStateAction<{
    duration: number;
    text: string;
  }>>;
  setShowAddProgressModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isPlayingRef:React.MutableRefObject<boolean>;
  audioRef: React.MutableRefObject<Taro.BackgroundAudioManager>;
}

const OperationIcons: React.FC<Props> = ({
  isExecuting,
  setToast,
  setShowAddProgressModal,
  setIsPlaying,
  isPlayingRef,
  audioRef
}) => {
  const dispatch = useDispatch();
  const selectedGoal = useSelector(state => state.goals.selectedGoal);
  const { index } = selectedGoal!;

  function addProgress() {
    if (isExecuting) {
      setToast({text:'执行目标中，不允许此操作', duration: 4000})
      return;
    }
    setShowAddProgressModal(true);
  }

  function navigateToLogPage() {
    if (isExecuting) {
      setToast({text:'执行目标中，不允许此操作', duration: 4000})
      return;
    }

    Route.navigateTo({
      url: goalLogsPage
    })
  }


 function handleEdit() {
  if (isExecuting) {
    setToast({text:'执行目标中，不允许此操作', duration: 4000})
    return;
  }

  setIsPlaying(false);
  stopAnimalMusic(isPlayingRef, audioRef);
  dispatch(updateIsEdit(true));
  Route.navigateTo({ url: addGoalPage })
}

  function showDeleteConfirm() {
    if (isExecuting) {
      setToast({text:'正在执行目标中，不允许此操作', duration: 4000})
      return;
    }

    Taro.showModal({
      title: `确定要删除 "${selectedGoal?.goal}"吗？`,
      content: `删除后将不可恢复`,
      confirmText: '删除',
      cancelText: '取消',
      confirmColor: '#dc5046',
      cancelColor: '#576B95',
      success (res) {
        if (res.confirm) {
          dispatch(deleteGoal(index));
          Route.navigateBack();
        }
      }
    })
  }

  return (
    <View className="flex-center">
        <View
          className="options-wrapper flex-between"
          // style={{ visibility: isExecuting ? 'hidden' : 'visible' }}
        >
          <View onClick={addProgress}>
            <Image src={recordIcon}></Image>
          </View>
          <View onClick={navigateToLogPage}>
            <Image src={logIcon}></Image>
          </View>
          <View onClick={handleEdit}>
            <Image src={editIcon}></Image>
          </View>
          <View onClick={showDeleteConfirm}>
            <Image src={deleteIcon}></Image>
          </View>
        </View>
      </View>
  )
}

export default OperationIcons;