import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Title, Mask, ProgressBar, BirthdayPicker, Empty, PlayBar } from "../../component";
import { serverIP, addGoalPage, addGoalPagePath, serverImagesDir, goalLogsPagePath } from "../../config";
import {  updateFinished } from "../../store/goals";
import { Log, UpdateFinishedType } from "../../store/types/goals";
import { getAudioSrcFromImageUri } from "../../utils";
import recordIcon from "../../images/record.png";
import editIcon from "../../images/edit.png";
import deleteIcon from "../../images/delete.png";
import logIcon from "../../images/log.png";
import './index.scss';

const GoalLogs = () => {
  const selectedGoal = useSelector(state => state.goals.selectedGoal);
  const showPlayBar = useSelector(state => state.media.showPlayBar);
  const dispatch = useDispatch();
  const logs = selectedGoal!.logs || [];
  const imageUrl = selectedGoal!.animal.imageUrl;

  function showDeleteConfirmModal(item: Log,index: number) {
    Taro.showModal({
      title: `确定要删除此进度吗？`,
      content: `此进度将被扣除`,
      confirmText: '删除',
      cancelText: '取消',
      confirmColor: '#dc5046',
      cancelColor: '#576B95',
      success (res) {
        if (res.confirm) {
          dispatch(updateFinished({
            index: selectedGoal!.index,
            changedValue: item.increasedValue,
            logIndex: index,
            type: UpdateFinishedType.Decrease
          }))
        }
      }
    })
  }

  return (
    <View className="goal-logs-wrapper">
      <View className="title-wrapper">
        <Title showGoBack>进度日志</Title>
      </View>
      {
        !logs.length && (
          <Empty text='暂无日志'></Empty>
        )
      }
      <View className="goals-wrapper" style={showPlayBar ? { height: `calc(100vh - 200rpx - 170rpx)` } : {}}>
        {
            logs.map((item, index) => {
              const {
                timestamp,
                duration,
                increasedValue
              } = item;

              return (
                <View key={timestamp} className="goal-item">
                  <View className="thumbnail-wrapper">
                    <Image mode="heightFix" src={imageUrl || ''} className="thumbnail"></Image>
                  </View>
                  <View className="goal-item-container">
                    <View  className="goal-item-wrapper">
                      <Text className="goal text-ellipsis">{timestamp}</Text>
                      <Text className="task text-ellipsis">用时：{duration}</Text>
                      <View className="flex-between delete-wrapper">
                        <Text className="task text-ellipsis">增加：{Math.round(increasedValue * 10000000) / 10000000}{' '}{selectedGoal?.unit}</Text>
                        <Image className="delete-icon" src={deleteIcon} onClick={() => showDeleteConfirmModal(item, index)}></Image>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          }
        </View>
        <PlayBar pageUrl={goalLogsPagePath} hasTabBar={false}></PlayBar>
    </View>
  );
}

export default GoalLogs;
