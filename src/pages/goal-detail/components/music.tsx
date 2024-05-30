import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { updateActiveType } from '../../../store/media';
import { MediaType } from '../../../constants';
import { ScrollTitles, MusicList } from '../../../component';
import musicIcon from '../../../images/music.png';
import CoverModal from './cover-modal';

import './music.scss';

interface Props {
}

const Music: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const showPlayBar = useSelector(state => state.media.showPlayBar);
  const isOnline = useSelector(state => state.media.isOnline);
  const media = useSelector(state => state.media.media);
  const activeType = useSelector(state => state.media.activeType);

  function showModal() {
    setVisible(true);
  }

  function closeModal() {
    setVisible(false);
  }

  function setMedia(name: MediaType) {
    if (name === activeType) return;

    dispatch(updateActiveType(name))
    // setList(media.find(i => i.name === name)!.data);
  }

  if (!isOnline) return <View style={{ width: '80rpx', height: '80rpx' }}></View>
  return (
    <View className="goal-detail-music-wrapper">
      <View className="icon-wrapper" onClick={showModal}>
        <Image src={musicIcon}></Image>
      </View>
      <CoverModal title="音乐" visible={visible} handleClose={closeModal} style={{ padding: '40rpx 0' }}>
        <View className="scroll-title-wrapper">
        <ScrollTitles
          titles={media.map(({name, chineseName}) => ({name: chineseName, key: name}))}
          selectedTitle={activeType}
          onChange={setMedia}
        ></ScrollTitles>
        </View>
        <MusicList hasTabBar={false} style={{ maxHeight: `calc(100vh - env(safe-area-inset-bottom) - 270rpx ${showPlayBar? '- 130rpx' : ''})` }}></MusicList>
      </CoverModal>
    </View>
  )
}

export default Music