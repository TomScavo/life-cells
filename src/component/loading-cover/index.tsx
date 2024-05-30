import { ScrollView, Text, View, Canvas } from "@tarojs/components";
import { useEffect, useState, Component } from "react";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import "./index.scss";
import { Title, Mask, ProgressBar, BirthdayPicker } from "../../component";
import './index.scss';

const loadingCover = () => {
  const showLoadingCover = useSelector(state => state.loadingCover.showLoadingCover);


  if (!showLoadingCover) return null;
  return (
    <View className="loading-cover">
      <Text>take a deep breath</Text>
    </View>
  );
}

export default loadingCover;