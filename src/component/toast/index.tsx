import { ScrollView, Text, View, Canvas } from "@tarojs/components";
import React, { useEffect, useState, useRef, Component } from "react";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import "./index.scss";
import { Title, Mask, ProgressBar, BirthdayPicker } from "../../component";
import './index.scss';

const Toast: React.FC<{toast: { text: string, duration: number }}> = ({ toast }) => {
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!toast.text) return;
    setShowToast(true);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setShowToast(false);
    }, toast.duration || 2000)
  }, [toast]);

  if (!showToast) return null;
  return (
    <View className="toast-wrapper">
      <Text>{toast.text}</Text>
    </View>
  );
}

export default Toast;