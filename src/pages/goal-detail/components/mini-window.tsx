import React from 'react';
import {  View, Image } from "@tarojs/components";
import { PlayButton } from "../../../component";
import { Args } from "../types";

import './mini-window.scss'

const miniWindow: React.FC<Args> = (args) => {
  const {
    isExecuting,
    showAnimalEncourage,
    currentAnimal,
    showPlayBar,
    currentSubtitle,
    encourageConfig,
    executingTime,
    animals
  } = args;

  return (
    <View className="cover-wrapper" style={!isExecuting || showAnimalEncourage ? {background: 'rgba(0, 0, 0, 0.2)'} : {}}>
      {
        showAnimalEncourage && (
          <Image
            mode="heightFix"
            src={currentAnimal.imageUrl}
            className={(isExecuting && !showAnimalEncourage) ? "cover-image image-filter" : "cover-image"}
          ></Image>
        )
      }
      {
        isExecuting && !showAnimalEncourage && (
          <View
            className="executing-time-wrapper"
            style={{
              marginTop: showPlayBar && currentSubtitle && encourageConfig.isShowSubtitle && encourageConfig.isShowHero ?
              '-20%':
              0
            }}
          >
            {executingTime}
          </View>
        )
      }
      {
        isExecuting && showPlayBar && currentSubtitle && !showAnimalEncourage && encourageConfig.isShowSubtitle &&  (
          <View
            className="goal-subtitle"
            style={{
              marginTop: encourageConfig.isShowHero ?
              '-20%':
              0
            }}
          >
            {currentSubtitle}
          </View>
        )
      }
      {
        !!animals.length && !isExecuting && (
          <View className="play-button-wrapper flex-center">
            <PlayButton {...args}/>
          </View>
        )
      }
    </View>
  )
}

export default miniWindow;