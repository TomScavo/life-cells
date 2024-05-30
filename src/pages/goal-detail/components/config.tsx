import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, Switch, Input} from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { serverHelperDir } from '../../../config';
import { getAllBackgroundImages } from '../../../utils';
import { EncourageConfig, updateEncourageConfig } from '../../../store/goals';
import configIcon from '../../../images/setting.png';
import checkIcon from "../../../images/check.png";
import previewIcon from "../../../images/preview.png";
import plusIcon from "../../../images/plus.png";
import copyIcon from "../../../images/copy.png";
import closeIcon from "../../../images/close.png";

import CoverModal from './cover-modal';
import ImageList from './image-list';

import './config.scss';

interface Props {
  stopCurrentAudio(): any
}

const Config: React.FC<Props> = ({stopCurrentAudio}) => {
  const dispatch = useDispatch();
  const encourageConfig = useSelector(state => state.goals.encourageConfig)
  const anime: any = useSelector(state => state.goals.anime)
  const selectedGoal = useSelector(state => state.goals.selectedGoal)
  const [visible, setVisible] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showImageCover, setShowImageCover] = useState(false);
  const [formValues, setFormValues] = useState(encourageConfig);
  const addedImageUrlRef = useRef('');
  const animeRef = useRef(null);
  const {
    isPlayAudio,
    isPlayProgress,
    isPlayCompliment,
    isPlayEncourage,
    isPlayAnimalAudio,
    intervalTime,
    isShowConsumeLife,
    isShowSubtitle,
    isShowBackgroundImage,
    isShowHero,
    customImages,
    backgroundOpacity
  } = formValues;
  const isUnitHour = selectedGoal!.unit === '小时';
  const images = getAllBackgroundImages();

  function closeModal() {
    setFormValues(encourageConfig);
    setVisible(false);
  }

  function showModal() {
    setVisible(true);
  }

  function saveConfig(formValues: EncourageConfig) {
    const intervalTime = Number(formValues.intervalTime);
    const backgroundOpacity = Number(formValues.backgroundOpacity);
    if (!intervalTime || !backgroundOpacity) {
      Taro.showToast({
        title: !intervalTime ? `请填写播报间隔` : `请填写背景不透明度`,
        icon: 'none',
        duration: 2000
      });

      return;
    }

    dispatch(updateEncourageConfig({...formValues, intervalTime, backgroundOpacity}));
  }

  function updateFormValues(key: keyof EncourageConfig, value: any) {
    const newFormValue = { ...formValues, ...{ [key]: value } };
    setFormValues(newFormValue);
    saveConfig(newFormValue);
  }

  function copyPexelsUrl() {
    Taro.setClipboardData({
      data: 'https://www.pexels.com'
    })
  }

  function handleClickAddImage() {
    if (!addedImageUrlRef.current.trim()) {
      Taro.showToast({ title: '请填写图片地址' , icon: 'none' })
      return;
    }

    const newFormValue = { ...formValues, customImages: [...(formValues.customImages || []), addedImageUrlRef.current.trim()] }
    setFormValues(newFormValue);
    saveConfig(newFormValue);
    setShowImageCover(false);
    addedImageUrlRef.current = '';
  }

  function showDeleteConfirm(index: number) {
    Taro.showModal({
      title: `确定要删除这张图片吗？`,
      confirmText: '删除',
      cancelText: '取消',
      confirmColor: '#dc5046',
      cancelColor: '#576B95',
      success (res) {
        if (res.confirm) {
          const customImages = [...(formValues.customImages || [])];
          customImages.splice(index, 1);
          const newFormValue = { ...formValues, customImages}
          setFormValues(newFormValue);
          saveConfig(newFormValue);
        }
      }
    })
  }

  return (
    <View className="goal-detail-config-wrapper">
      <View className="icon-wrapper" onClick={showModal}>
        <Image src={configIcon}></Image>
      </View>
        <CoverModal title="设置" visible={visible} handleClose={closeModal} style={{ zIndex: 11 }}>
          <View className="main-wrapper">
            <View className="config-title">语音设置:</View>
            <View className="form-wrapper">
              <View>
                <Text>语音播报</Text>
                <Switch
                  checked={isPlayAudio}
                  onChange={e => {
                    const value = e.detail.value;
                    if (!value) {
                      stopCurrentAudio();
                    }
                    updateFormValues('isPlayAudio', value)
                  }}
                />
              </View>
              <View>
                <Text>进度播报 (单位为“小时”时有效)</Text>
                <Switch
                  disabled={!isUnitHour}
                  checked={isUnitHour ? isPlayProgress : false}
                  onChange={e => updateFormValues('isPlayProgress', e.detail.value)}
                />
              </View>
              <View>
                <Text>称赞播报</Text>
                <Switch
                  checked={isPlayCompliment}
                  onChange={e => updateFormValues('isPlayCompliment', e.detail.value)}
                />
              </View>
              <View>
                <Text>鼓励播报</Text>
                <Switch
                  checked={isPlayEncourage}
                  onChange={e => updateFormValues('isPlayEncourage', e.detail.value)}
                />
              </View>
              <View>
                <Text>动物播报</Text>
                <Switch
                  checked={isPlayAnimalAudio}
                  onChange={e => updateFormValues('isPlayAnimalAudio', e.detail.value)}
                />
              </View>
              <View>
                <Text>显示字幕</Text>
                <Switch
                  checked={isShowSubtitle}
                  onChange={e => updateFormValues('isShowSubtitle', e.detail.value)}
                />
              </View>
              <View className="interval-time">
                <Text>播报间隔</Text>
                <View className="interval-time-input">
                  <Input
                    type="number"
                    value={`${Number(intervalTime) ? intervalTime : ''}`}
                    onBlur={(e) => updateFormValues('intervalTime',  Number(parseInt(e.detail.value)))}
                  />
                  <Text className="unit flex-center">
                    分钟
                  </Text>
                </View>
              </View>
            </View>
            <View className="config-title">其它设置:</View>
            <View className="form-wrapper">
              <View className="consume-life-switch">
                <Text>显示需要消耗的生命 (单位为“小时”时有效)</Text>
                <Switch
                  disabled={!isUnitHour}
                  checked={isUnitHour ? isShowConsumeLife : false}
                  onChange={e => updateFormValues('isShowConsumeLife', e.detail.value)}
                />
              </View>
              <View className="consume-life-switch">
                <Text>显示背景图片</Text>
                <Switch
                  checked={isShowBackgroundImage}
                  onChange={e => updateFormValues('isShowBackgroundImage', e.detail.value)}
                />
              </View>
              <View className="interval-time">
                <Text>背景不透明度</Text>
                <View className="interval-time-input">
                  <Input
                    type="number"
                    value={`${Number(backgroundOpacity) ? backgroundOpacity : ''}`}
                    onBlur={(e) => {
                      let value = Number(parseInt(e.detail.value));
                      if (value && value > 100) {
                        value = 100;
                      }
                      updateFormValues('backgroundOpacity', value)
                    }}
                  />
                  <Text className="unit flex-center">
                    %
                  </Text>
                </View>
              </View>
              <View className="select-image-wrapper">
                <Text>选择一张背景图片</Text>
                <View className="image-list-wrapper flex-between">
                  {
                    images.map((imageUrl, index) => (
                      <View
                        className={`flex-center image-wrapper ${encourageConfig.selectedImage === imageUrl ? 'selected-image' : '' }`}
                        key={`${imageUrl}${index}`} style={{ backgroundImage: `url(${imageUrl})` }}
                        onClick={() => {
                          if (encourageConfig.selectedImage === imageUrl ) {
                            setShowPreview(true);
                          } else {
                            updateFormValues('selectedImage', imageUrl);
                          }
                        }}
                      >
                        <Image className={`check-icon ${encourageConfig.selectedImage === imageUrl ? 'show-check-icon' : ''}`} src={checkIcon}></Image>
                        {
                          encourageConfig.selectedImage === imageUrl && (
                            <Image src={previewIcon} className="preview-icon"></Image>
                          )
                        }
                      </View>
                    ))
                  }

                  {
                    (encourageConfig.customImages || []).map((imageUrl, index) => (
                      <View
                        className={`flex-center image-wrapper ${encourageConfig.selectedImage === imageUrl ? 'selected-image' : '' }`}
                        key={`${imageUrl}${index}`} style={{ backgroundImage: `url(${imageUrl})` }}
                        onClick={() => {
                          if (encourageConfig.selectedImage === imageUrl ) {
                            setShowPreview(true);
                          } else {
                            updateFormValues('selectedImage', imageUrl);
                          }
                        }}
                      >
                        <Image className={`check-icon ${encourageConfig.selectedImage === imageUrl ? 'show-check-icon' : ''}`} src={checkIcon}></Image>
                        <View className="close-icon-wrapper flex-center">
                          <Image
                            src={closeIcon}
                            onClick={(e) => {
                              e.stopPropagation();
                              showDeleteConfirm(index);
                            }}
                          >
                          </Image>
                        </View>
                        {
                          encourageConfig.selectedImage === imageUrl && (
                            <Image src={previewIcon} className="preview-icon"></Image>
                          )
                        }
                      </View>
                    ))
                  }

                  <View className="add-image flex-center" onClick={() => setShowImageCover(true)}>
                    <Image src={plusIcon}></Image>
                  </View>
                </View>
              </View>
            </View>
            {
              showPreview && (
                <View
                  className={`preview-wrapper ${showPreview ? 'show-preview' : ''}`} onClick={() => setShowPreview(false)}
                >
                  <Image mode='widthFix' src={encourageConfig.selectedImage}></Image>
                </View>
              )
            }
            <View className="config-title">勇者设置:</View>
            <View className="form-wrapper">
              <View>
                <Text>显示勇者</Text>
                <Switch
                  checked={isShowHero}
                  onChange={e => updateFormValues('isShowHero', e.detail.value)}
                />
              </View>

              <View className="select-image-wrapper">
                <Text>选择一位勇者</Text>
                <ImageList
                  updateFormValues={updateFormValues}
                  images={anime.heros || []}
                  name="selectedHero"
                ></ImageList>
              </View>
              <View className="select-image-wrapper">
                <Text>选择一位要被拯救的公主/王子</Text>
                <ImageList
                  updateFormValues={updateFormValues}
                  images={anime.princess || []}
                  name="selectedPrincess"
                ></ImageList>
              </View>
            </View>
        </View>
      </CoverModal>
      <CoverModal title="添加图片" visible={showImageCover} handleClose={() => setShowImageCover(false)} style={{ zIndex: 12 }}>
        <View className="add-image-form-wrapper flex-between">
            <Text>图片地址：</Text>
            <Input
              placeholder="请填写图片地址"
              placeholderStyle="color: #e8e8e8"
              onInput={e => { addedImageUrlRef.current = e.detail.value }}
            ></Input>
            <Button onClick={handleClickAddImage}>
                添加
            </Button>
        </View>
        <View className="tips">
          <View>如何获取图片地址？</View>
          <View className="step-one">
            <Text> 1.前往任意一个网站，例如：pexels.com</Text>
            <Image src={copyIcon} onClick={copyPexelsUrl}></Image>。
          </View>
          <View className="step-two">
            <Text> 2.用浏览器打开网站，预览要选的图片。</Text>
            <Image mode="widthFix" src={serverHelperDir + 'add-image-step-one.jpg'}></Image>
          </View>
          <View className="step-three">
            <Text> 3.长按图片，选择复制，再粘贴到输入框中，点击添加即可。</Text>
            <Image mode="widthFix" src={serverHelperDir + 'add-image-step-two.jpg'}></Image>
          </View>
        </View>
      </CoverModal>
    </View>
  )
}

export default React.memo(Config)