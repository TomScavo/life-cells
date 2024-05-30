import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Title } from '../../../component';
import closeIcon from '../../../images/close.png';

import { serverEncourageVoicesDir } from '../../../config';

import './cover-modal.scss';

interface Props {
    visible: boolean;
    title: string;
    handleClose(): void;
    style?: React.CSSProperties
}

const CoverModal: React.FC<Props> = ({ visible, title, handleClose, children, style={} }) => {

  if (!visible) return null;
  return (
    <View className="cover-modal-wrapper" style={style}>
        <Title>
            <Text>{title}</Text>
            <Image src={closeIcon} className="close-icon" onClick={handleClose}></Image>
        </Title>
        { children }
    </View>
  )
}

export default CoverModal;