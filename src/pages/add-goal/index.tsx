import { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, Form, Input, Picker, Switch } from "@tarojs/components";
import Taro, { useReady, InnerAudioContext } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import pick from 'lodash-es/pick';

import { convertToNumber, getErrorMsg } from './utils';
import { Animal, animalList, animalTotal } from './constants';

import { Title, Mask, ProgressBar, BirthdayPicker, Loading, PlayBar } from "../../component";
import services from "../../services";
import { audioContext } from "../../constants";
import { serverImagesDir, serverIP, serverVoicesDir, apiPrefix } from "../../config";
import { addGoal, updateGoal, deleteGoal, updateSelectedGoal, updateIsEdit } from "../../store/goals";
import { Goal, GoalType } from "../../store/types/goals";
import plusIcon from "../../images/plus.png";
import requiredIcon from "../../images/required.png";
import checkIcon from "../../images/check.png";
import backIcon from "../../images/back.png";
import { getAudioSrcFromImageUri } from '../../utils';
import { Route } from "../../constants";
import './index.scss';

const defaultValue = {
  parentId: '',
  goal: '',
  task: '',
  total: '',
  unit: "小时",
  isEveryday: false,
  animal: {
    name: '',
    imageUrl: '',
    voiceUrl: ''
  }
};

type FormValue = typeof defaultValue;

interface ImageUrl {
  imageUrl: string,
  voiceUrl: string
}

interface AnimalData {
  name: string,
  chinese_name: string,
  data: {
    imageUrl: string,
    voiceUrl: string
  }[]
}

type Animals = AnimalData[];

let timer: any = null;
const AddGoal = () => {
  const goals = useSelector(state => state.goals.goals);
  const todayGoals = useSelector(state => state.goals.todayGoals);
  const isEdit = useSelector(state => state.goals.isEdit);
  const selectedGoal = useSelector(state => state.goals.selectedGoal);
  const goalType = useSelector(state => state.goals.goalType);
  const dispatch = useDispatch();
  const [activeAnimal, setActiveAnimal] = useState<string>();
  const [animals, setAnimals] = useState<Animals>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Goal['animal']>({
    name: '',
    imageUrl: '',
    voiceUrl: ''
  });
  const [leftImages, setLeftImages] = useState<ImageUrl[]>([]);
  const [rightImages, setRightImages] = useState<ImageUrl[]>([]);
  const [showLoading, setShowLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState((isEdit && selectedGoal?.parentId) ? goals.findIndex(i => selectedGoal?.parentId === i.id) + 1 : 0);
  // const [selectedImageUrl, setSelectedImageUrl] = useState(isEdit ? selectedGoal!.imageUrl : '');
  const [showPreview, setShowPreview] = useState(false);
  const [formValues, setFormValues] = useState<FormValue>(isEdit ? { ...selectedGoal!, total: String(selectedGoal!.total) }  : { ...defaultValue });
  const scrollLeftRef = useRef(0);
  const totalImageRef = useRef(0);
  const loadedImageRef = useRef(0);
  const showAnimals = !!animals.length;
  const isTodayGoal = goalType === GoalType.Today;

  const total = Number(parseFloat(formValues.total));

  useEffect(() => {
    if (!activeAnimal) return;
    setTotalImage();
    getImageUrl();
  }, [activeAnimal]);

  useEffect(() => {
    getAnimals();

    if (isEdit) {
      const imageUrl = selectedGoal?.animal.imageUrl || Animal.Cat;
      const lastIndex = imageUrl.indexOf('/') === -1 ? imageUrl.length : imageUrl.indexOf('/');
      setSelectedAnimal(selectedGoal!.animal);
    }

    return(() => {
      audioContext.stop();
      if (isEdit) {
        dispatch(updateIsEdit(false));
      }
    })
  }, [])

  function setTotalImage() {
    if (!animals.length) return;
    const animal = animals.find((item) => item.name === activeAnimal)!;

    totalImageRef.current = animal.data.length;
  }

  function getAnimals() {
    services.getAnimals(
      (res) => {
        setAnimals(res.data);
        if (isEdit) setActiveAnimal(selectedGoal?.animal.name);
        // if (!isEdit) totalImageRef.current = res.data[0].data.length;
        if (!isEdit) setActiveAnimal(res.data[0].name);
      }
    )
  }

  // function updateShowLoadingTimer() {
  //   clearTimeout(timer);
  //   timer = setTimeout(() => {
  //     setShowLoading(false);
  //   }, 300);
  // }

  function getImageUrl() {
    // if (!selectedAnimal) return;

    // const leftImages: string[] = [];
    // const rightImageUrl: string[] = [];
    const animal = animals.find((item) => item.name === activeAnimal)!;
    const total = animal?.data.length || 0;
    const leftTotal = Math.ceil(total / 2);
    // const rightStartIndex = Math.ceil(total / 2);

    setLeftImages(animal.data.slice(0, leftTotal));
    setRightImages(animal.data.slice(leftTotal));
  }

  // function handleImageError({ url, isLeft, i }: {url: string, isLeft: boolean, i: number}) {
  //   const newUrl = changeImageFormat(url);
  //   if (!newUrl) return;

  //   if (isLeft) {
  //     leftImages.splice(i, 1, newUrl);
  //     setLeftImageUrl([...leftImageUrl]);
  //   } else {
  //     rightImageUrl.splice(i, 1, newUrl);
  //     setRightImageUrl([...rightImageUrl])
  //   }
  // }

  function handleClickAnimal(name: string) {
    if (name === activeAnimal) return;
    totalImageRef.current = 0;
    loadedImageRef.current = 0;
    setActiveAnimal(name);
    setShowLoading(true);
  }

  function handleClickImage({imageUrl, voiceUrl}: ImageUrl) {
    setSelectedAnimal({
      imageUrl,
      voiceUrl,
      name: activeAnimal!
    });
  }

  function handleSubmit() {
    const { goal, task, total, unit, isEveryday } = formValues;
    const { parentId } = formValues;
    const errorMsg = getErrorMsg({
      formValues: {
        ...formValues,
        selectedImageUrl: selectedAnimal.imageUrl
      },
      todayGoals,
      isTodayGoal,
      goals,
      isEdit,
      selectedGoal
    });

    if (errorMsg) return Taro.showToast({
      title: errorMsg,
      icon: 'none',
      duration: 5000
    });

    const data = {
      parentId,
      goal,
      task,
      total: parseFloat(total),
      unit,
      isEveryday,
      animal: selectedAnimal
    }

    console.log(data, formValues);

    if (isEdit) {
      dispatch(updateIsEdit(false));
      dispatch(updateGoal({index: selectedGoal!.index, data}));
    } else {
      dispatch(addGoal(data));
    }

    Route.navigateBack();
  }

  function goBack() {
    if (isEdit) {
      dispatch(updateIsEdit(false));
    }
    Route.navigateBack();
  }

  function handleScroll(e: any) {
    scrollLeftRef.current = e.detail.scrollLeft;
  }

  function playAudio(voiceUrl: string) {
    const audio = audioContext;
    audio.src = voiceUrl;

    audio.play();
  }

  function handleValueChange(value: string | boolean, name: keyof FormValue) {
    if (name === 'task' && value && !formValues.total) {
      const total = parseInt((value as string).replace(/[^0-9\.]/g, ''), 10);
      if (total) {
        formValues.total = String(total);
      }
    }

    setFormValues({
      ...formValues,
      [name]: value
    })
  }

  function handleImageLoad() {
    loadedImageRef.current++;

    if (loadedImageRef.current === totalImageRef.current - 3) {
      setShowLoading(false);
    }
  }

  function getConsumedLife() {
    
    return `需要消耗 ${((total / (80 * 365 * 24)) * 100).toFixed(5)}% 的生命来完成此目标`;
  }

  function getImageItem({imageUrl, voiceUrl}: ImageUrl, index: number, isLeft: boolean) {
    return (
      <View className='image-wrapper' onClick={() => playAudio(voiceUrl)}>
        <Image
          className={`image ${selectedAnimal.imageUrl === imageUrl ? "selected-image" : ""}`}
          mode="widthFix"
          key={imageUrl}
          src={imageUrl}
          onLoad={handleImageLoad}
          // onError={() => handleImageError({url, isLeft, i: index })}
          onClick={() => handleClickImage({ imageUrl, voiceUrl })}
        ></Image>
        <Image className={`check-icon ${selectedAnimal.imageUrl === imageUrl ? 'show-check-icon' : ''}`} src={checkIcon}></Image>
        <View
          className={`preview-btn ${selectedAnimal.imageUrl === imageUrl ? 'show-check-icon' : ''}`}
          onClick={() => setShowPreview(true)}
        >
          预览
        </View>
      </View>
    )
  }

  const parentGoals = ['无', ...goals.map(goal => goal.goal)];
  return (
    <View className='add-goal-container'>
      <Title showGoBack addPadding>
        {!isTodayGoal && (isEdit  ? '编辑总目标' : '添加总目标')}
        {isTodayGoal && (isEdit  ? '编辑今日目标' : '添加今日目标')}
      </Title>
      <View className="add-goal-wrapper">
        <Form className="add-goal-form" onSubmit={handleSubmit}>

          {
            isTodayGoal && (
              <>
                <View className="label">
                  <Text className="page-section-title">
                    父目标（进度将自动同步到父目标中）：
                  </Text>
                </View>
                <Picker
                  mode='selector'
                  range={parentGoals}
                  onChange={e => {
                    const index = Number(e.detail.value);
                    const parentId = !index ? '' : goals[index - 1].id;
                    const parentGoal = !index ? '' : goals[index - 1].goal;
                    setFormValues({
                      ...formValues,
                      goal: formValues.goal || parentGoal,
                      parentId: parentId
                    })

                    setSelectedParent(index);
                  }}
                  value={selectedParent}
                  className="form-gap"
                >
                  <View className='picker'>
                  {parentGoals[selectedParent]}
                  </View>
                </Picker>
              </>
            )
          }

          <View className="label">
            <Image src={requiredIcon} className="required"></Image>
            <Text className="page-section-title">
              目标：
            </Text>
          </View>
          <Input onBlur={e => handleValueChange(e.detail.value, 'goal')} value={formValues.goal} placeholder="请填写目标" className="form-gap" name="goal"></Input>

          <View className="label">
            <Image src={requiredIcon} className="required"></Image>
            <Text className="page-section-title">需要做什么来实现目标：</Text>
          </View>
          <Input onBlur={e => handleValueChange(e.detail.value, 'task')} value={formValues.task} name="task" placeholder='例如：“学习1000个小时” 或 “跑4000公里”' className="form-gap"></Input>

          <View className="label">
            <Image src={requiredIcon} className="required"></Image>
            <Text className="page-section-title">可量化的总量及单位：</Text>
          </View>
          <View className="total form-gap">
            <Input onBlur={e => handleValueChange(e.detail.value, 'total')} value={String(formValues.total)} type='digit' name="total" placeholder='总量：如1000小时请填写“1000”' className="value"></Input>
            <Input onBlur={e => handleValueChange(e.detail.value, 'unit')} value={formValues.unit} name="unit" placeholder='单位' className="unit title-gap"></Input>
            {!!total && formValues.unit === '小时' && (
              <View className="life-consume-ratio">{getConsumedLife()}</View>
            )}
          </View>

          {
            isTodayGoal && (
              <View className="label form-gap">
                <Image src={requiredIcon} className="required"></Image>
                <Text className="page-section-title">设为每日必做：</Text>
                <Switch
                  checked={formValues.isEveryday}
                  onChange={e => {
                    handleValueChange(e.detail.value, 'isEveryday')
                  }}
                />
              </View>
            )
          }

          <View className="label">
            <Image src={requiredIcon} className="required"></Image>
            <Text>选择一张封面图片：</Text>
          </View>
          {
            showAnimals && (
              <ScrollView scrollLeft={scrollLeftRef.current} scrollX={true} className='animal-wrapper' onScroll={handleScroll}>
                {
                  animals.map(({ name, chinese_name }) => (
                    <View
                      key={name}
                      onClick={() => handleClickAnimal(name)}
                      className={`animal ${activeAnimal === name ? 'animal-selected' : ''}`}
                    >
                      { chinese_name }
                    </View>
                  ))
                }
              </ScrollView>
            )
          }

          {
            (!showAnimals || showLoading) && (
              <View className='loading-wrapper'>
                <Loading></Loading>
              </View>
            )
          }
          {
            <View className={`image-group ${showLoading ? 'hide-image-group' : ''}`} style={{ opacity: showLoading ? 0 : 1 }}>
              <View className="image-column">
                {
                  leftImages.map((image, i) =>  getImageItem(image, i, true))
                }
              </View>
              <View className="image-column image-column-right">
                {
                  rightImages.map((image, i) => getImageItem(image, i, false))
                }
                {/* {getRightColumnImages()} */}
              </View>
            </View>
          }

            <Button className="add-btn" formType="submit">{isEdit ? "确认" : "添加"}</Button>
        </Form>
      </View>

      {
        showPreview && (
          <View
            className={`preview-wrapper ${showPreview ? 'show-preview' : ''}`} onClick={() => setShowPreview(false)}
          >
            <Image mode='widthFix' src={selectedAnimal.imageUrl}></Image>
          </View>
        )
      }
    </View>
  );
}

export default AddGoal;