import { ScrollView, Text, View, Canvas, Video, Image } from "@tarojs/components";
import { useEffect, useState, Component, useRef } from "react";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { Title, Mask, BirthDayProgressBar, BirthdayPicker, LoadingCover, Cells, Loading } from "../../component";
import { setShowTabBar } from "../../store/tabBar";
import { updateCurrentMusic, updateShowPlayBar, updateIsPlaying, updatePlay, setMedia } from "../../store/media";
import { serverMediaDir } from "../../config";
import { audioContext, MediaType } from "../../constants";

import './index.scss';

const MusicList: React.FC<{style?: React.CSSProperties; hasTabBar?: boolean}> = ({ style = {}, hasTabBar = true }) => {
  const dispatch = useDispatch();
  const media = useSelector(state => state.media.media);
  const activeType = useSelector(state => state.media.activeType);
  const showPlayBar = useSelector(state => state.media.showPlayBar);

  const mediaData = (media.find(i => (i as any).name === activeType) as any)?.data || [];
  const isSpeech = activeType === MediaType.Speech;


  useEffect(() => {
    dispatch(setMedia({}));
  }, []);

  // function getCoverThumbnail(index: number) {
  //   return `${serverMediaDir}musics/covers/${index}-thumbnail.jpg`
  // }

  // function getMusicCoverImage(index: number) {
  //   return `${serverMediaDir}musics/covers/${index}.jpg`
  // }

  // function getNextMusic(mediaUrl: string) {
  //   const index = mediaData.findIndex(i => i.mediaUrl === mediaUrl);
  //   const isLastIndex = index === mediaData.length - 1;
  //   if (isLastIndex) {
  //     return {...mediaData[0], index: 0}
  //   } else {
  //     return { ...mediaData[index + 1], index: index + 1};
  //   }
  // }

  // function getPrevMusic(mediaUrl: string) {
  //   const index = mediaData.findIndex(i => i.mediaUrl === mediaUrl);
  //   const isFirstIndex = index === 0;
  //   if (isFirstIndex) {
  //     return {...mediaData[mediaData.length - 1], index: mediaData.length - 1}
  //   } else {
  //     return { ...mediaData[index - 1], index: index - 1};
  //   }
  // }

  function playMusic({ name, duration, url, imageUrl, thumbnailUrl, subtitle = [] }: any, index: number) {
    // currentMusic.current = {name, mediaUrl}
    // audioContext.src = mediaUrl;
    // audioContext.title = name.split('.')[0];
    // audioContext.singer = 'Unknown';
    // audioContext.coverImgUrl = getMusicCoverImage(index);
    // audioContext.onNext(next);

    // audioContext.onPrev(prev);

    // audioContext.play();

    dispatch(updateCurrentMusic({
      name,
      duration,
      url,
      index,
      thumbnailUrl,
      imageUrl,
      subtitle,
      mediaType: activeType
    }))

    dispatch(updateShowPlayBar(true));

    dispatch(updateIsPlaying(true));

    dispatch(updatePlay(true));

    if (showPlayBar) {
      dispatch(updatePlay(true));
    }
  }

  function getMusicName(musicName: string) {
    const musicArr = musicName.split('-');
    return isSpeech ? musicArr[musicArr.length - 1] : musicName;
  }

  function getMusicAuthor(musicName: string) {
    const musicArr = musicName.split('-');
    return isSpeech ? musicArr[0] : '';
  }

  if (!media.length) {
    return (
      <View className="flex-center">
      <Loading></Loading>
      </View>
    )
  }

  return (
    <View className="music-list-wrapper" style={showPlayBar ? {maxHeight: `calc(100vh - env(safe-area-inset-bottom) - 370rpx - 130rpx)`, ...style} : { ...style}}>
      {
        (mediaData as any).map((item: any, index: number) => (
          <View className="music-item" onClick={() => playMusic(item, index)}>
            <View className="thumbnail-wrapper">
              <Image src={item.thumbnailUrl}></Image>
            </View>
            <View className="music-info">
              <View className="music-name text-ellipsis text-capitalize">{ getMusicName(item.name) }</View>
              <View className="music-duration text-capitalize">{ isSpeech ? getMusicAuthor(item.name) : `${item.duration}m` }</View>
            </View>
          </View>
        ))
      }
    </View>
  )
}

export default MusicList;