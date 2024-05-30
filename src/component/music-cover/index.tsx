import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { ScrollTitles, MusicList } from '../../component';
import musicIcon from '../../images/music.png';
import { updateActiveType } from '../../store/media';
import { MediaType } from '../../constants';
import CoverModal from './cover-modal';

import './index.scss';

interface Props {
  visible: boolean;
  onClose(): any;
}

const MusicCover: React.FC<Props> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const activeType = useSelector(state => state.media.activeType)
  const media = useSelector(state => state.media.media)

  function setMedia(name: MediaType) {
    if (name === activeType) return;

    dispatch(updateActiveType(name))
  }

  return (
    <CoverModal title="音乐" visible={visible} handleClose={onClose} style={{ padding: '40rpx 0' }}>
      <View className="music-cover-scroll-title-wrapper">
        <ScrollTitles
          titles={media.map(({name, chineseName}) => ({name: chineseName, key: name}))}
          selectedTitle={activeType}
          onChange={setMedia}
        ></ScrollTitles>
      </View>
      <MusicList hasTabBar={false} style={{ maxHeight: 'calc(100vh - env(safe-area-inset-bottom) - 270rpx)' }}></MusicList>
    </CoverModal>
  )
}

export default MusicCover