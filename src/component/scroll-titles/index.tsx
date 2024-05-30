import { ScrollView, Text, View, Canvas, Video, Image } from "@tarojs/components";
import React, { useEffect, useState, Component, useRef } from "react";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { Title, Mask, BirthDayProgressBar, BirthdayPicker, LoadingCover, Cells } from "../../component";
import { setShowTabBar } from "../../store/tabBar";
import { GoalType } from "../../store/goals";
import { serverMediaDir } from "../../config";
import { audioContext } from "../../constants";

import './index.scss';

interface Props {
  selectedTitle: string;
  titles: { name: string, key: string }[];
  onChange(key: string): any;
  style?: React.CSSProperties
}

const ScrollTitles: React.FC<Props> = ({ style, titles, selectedTitle, onChange }) => {
  const scrollLeftRef = useRef(0);

  function handleScroll(e: any) {
    scrollLeftRef.current = e.detail.scrollLeft;
  }

  return (
    <ScrollView
      style={style}
      scrollLeft={scrollLeftRef.current}
      scrollX={true}
      className='scroll-titles-wrapper'
      onScroll={handleScroll}
    >
      {
        titles.map(({ name, key }) => (
          <View
            key={name}
            onClick={() => onChange(key)}
            className={`title ${selectedTitle === key ? 'title-selected' : ''}`}
          >
            { name }
          </View>
        ))
      }
    </ScrollView>
  )
}

export default ScrollTitles;