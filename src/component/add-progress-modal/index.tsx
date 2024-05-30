import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Taro from '@tarojs/taro';
import { Text, View, CoverView, Button, Image, Input } from "@tarojs/components";
import Title from "../title";
import playIcon from "../../images/play.png";
import closeIcon from "../../images/close.png";
import { updateFinished } from "../../store/goals";
import { UpdateFinishedType } from "../../store/types/goals";
import "./index.scss";

interface Props {
  visible: boolean;
  executingTime: string,
  onCancel(): void;
  onSuccess(): void;
  playFinishedAudio: (opts: {increasedValue: number, isPlayUsedTime?: boolean}) => void;
  endExecutingGoal: () => any,
}

const AddProgressModal: React.FC<Props> = ({ visible, executingTime, onCancel, onSuccess, playFinishedAudio, endExecutingGoal}) => {
  const selectedGoal = useSelector(state => state.goals.selectedGoal);
  const executingGoal = useSelector(state => state.goals.executingGoal);
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  function handleContinue() {
    if (!value) return;
    const finished = Number(parseFloat(value));
    if (!finished) {
      return Taro.showToast({
        title: '格式不正确',
        icon: 'none',
        duration: 2000
      });
    }

    if (executingGoal.isExecuting) {
      playFinishedAudio({ increasedValue: finished, isPlayUsedTime: true});

      dispatch(updateFinished({
        index: selectedGoal!.index,
        duration: executingTime,
        changedValue: finished,
        type: UpdateFinishedType.Increase
      }));
    } else {
      playFinishedAudio({ increasedValue: finished, isPlayUsedTime: false })
      dispatch(updateFinished({
        index: selectedGoal!.index,
        changedValue: finished,
        type: UpdateFinishedType.Increase
      }));
    }

    onSuccess();
  }

  function onInput(e: any) {
    setValue(e.detail.value);
  }

  function handleClose() {
    if (executingGoal.isExecuting) {
      Taro.showModal({
        title: `确定要退出吗？`,
        content: `本次进度将会丢失`,
        confirmText: '退出',
        cancelText: '取消',
        confirmColor: '#dc5046',
        cancelColor: '#576B95',
        success (res) {
          if (res.confirm) {
            onCancel();
            endExecutingGoal();
          }
        }
      })
    } else {
      onCancel();
    }
  }

  if (!visible) return null;
  return (
    <View className="add-progress-modal-container">
        <Image src={closeIcon} className="close-icon" onClick={handleClose}></Image>
        <View className="flex-container">
          <Title>添加进度</Title>
          <View className="input-container">
            <View className="input-wrapper">
              <Input
                type="digit"
                placeholder="请填写进度"
                placeholderStyle="color: #aeaeae"
                onInput={onInput}
              ></Input>
            </View>
            <Text>{selectedGoal!.unit}</Text>
          </View>
          <Button
            className={`btn bold ${value ? 'btn-confirmed' : ''}`}
            // loading={loading}
            onClick={handleContinue}
          >
            <Text className='continue'>添 加</Text>
          </Button>
        </View>
    </View>
  )
}

export default AddProgressModal;