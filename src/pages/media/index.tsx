import { ScrollView, Text, View, Canvas, Video, Image } from "@tarojs/components";
import { useEffect, useState, Component, useRef } from "react";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { Title, Mask, BirthDayProgressBar, BirthdayPicker, Loading, Cells, MusicList, PlayBar } from "../../component";
import { setShowTabBar } from "../../store/tabBar";
import { setMedia as updateMedia, updateActiveType } from "../../store/media";
import { serverMediaDir, mediaPagePath } from "../../config";
import { audioContext } from "../../constants";
import { MediaType } from "../../constants";
import VideoPlayerModal from './components/video-player-modal';

import './index.scss';

// type Medias = typeof medias;

const Media = () => {
  const media = useSelector(state => state.media.media);
  const activeType = useSelector(state => state.media.activeType);
  const dispatch = useDispatch();
  const scrollLeftRef = useRef(0);
  const [ list, setList ] = useState(media.length ? media.find(i => i.name === activeType)!.data : []);
  const [ videoTitle, setVideoTitle ] = useState('');
  const [ videoUrl, setVideoUrl ] = useState('');
  const showPlayBar = useSelector(state => state.media.showPlayBar);
  const isOnline = useSelector(state => state.media.isOnline);

  useEffect(() => {
    dispatch(updateMedia({}));
  }, []);

  function handleScroll(e: any) {
    scrollLeftRef.current = e.detail.scrollLeft;
  }

  function setMedia(name: MediaType) {
    if (name === activeType) return;

    dispatch(updateActiveType(name))
    setList(media.find(i => i.name === name)!.data);
  }

  function getCoverThumbnail(index: number) {
    if (activeType === MediaType.Piano) {
      return `${serverMediaDir}musics/covers/${index}-thumbnail.jpg`
    } else {
      return `${serverMediaDir}videos/covers/${index}.png`
    }
  }

  function playVideo(item: any, index: number) {
    setVideoTitle(item.chineseName);
    setVideoUrl(item.url);
    dispatch(setShowTabBar(false));
  }

  if (!isOnline) return (
    <View className="not-online flex-center">
      敬请期待
    </View>
  )

  if (!media.length) {
    return (
      <>
        <Title style={{ marginTop: '40rpx' }}>影音</Title>
        <View className="flex-center" style={{ marginTop: '80rpx' }}>
          <Loading></Loading>
        </View>
      </>

    )
  }

  return (
    <View className="media-container">
      <Title style={{ marginTop: '40rpx' }}>影音</Title>
      {
         <ScrollView scrollLeft={scrollLeftRef.current} scrollX={true} className='media-wrapper' onScroll={handleScroll}>
          {
            media.map(({ name, chineseName }) => (
              <View
                key={name}
                onClick={() => setMedia(name)}
                className={`media ${activeType === name ? 'media-selected' : ''}`}
              >
                { chineseName }
              </View>
            ))
          }
        </ScrollView>
      }
      {
        activeType !== MediaType.Video && (
          <MusicList></MusicList>
        )
      }

      {
        activeType === MediaType.Video && (
          <View className="media-item-wrapper" style={showPlayBar ? { height: 'calc(100vh - env(safe-area-inset-bottom) - 130rpx - 370rpx)' } : {}}>
            {
              list.map((item, index) => (
                <View className="media-item" onClick={() => playVideo(item, index)}>
                  <View className="thumbnail-wrapper">
                    <Image mode="heightFix" src={getCoverThumbnail(index)}></Image>
                  </View>
                  <View className="media-info">
                    <View className="media-name">{ item.chineseName.split('.')[0] }</View>
                    <View className="media-duration">{ item.duration }m</View>
                  </View>
                </View>
              ))
            }
          </View>
        )
      }

      <VideoPlayerModal
        title={videoTitle}
        videoUrl={videoUrl}
        onClose={() => {
          setVideoTitle('');
          setVideoUrl('');
          dispatch(setShowTabBar(true));
        }}
      ></VideoPlayerModal>
      <PlayBar pageUrl={mediaPagePath}></PlayBar>
    </View>
  );
}

export default Media;