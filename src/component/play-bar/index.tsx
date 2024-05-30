import { ScrollView, Text, View, Canvas, Video, Image } from "@tarojs/components";
import { useEffect, useState, Component, useRef } from "react";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { Title, Mask, BirthDayProgressBar, BirthdayPicker, LoadingCover, Cells, ProgressBar, MusicCover } from "../../component";
import { setShowTabBar } from "../../store/tabBar";
import {
  updateIsPlaying,
  updateCurrentMusic,
  updateShowPlayBar,
  closePlay,
  LoopType,
  updateLoopType,
  updatePlay,
  updateCurrentTime,
  updateCurrentSubtitle
} from "../../store/media";
import { serverMediaDir } from "../../config";
import { MediaType, audioContext } from "../../constants";
import { getMusicCoverThumbnail, getMusicCoverImage } from "../../utils";
import playForwardIcon from "../../images/play-forward.png";
import playBackwardIcon from "../../images/play-backward.png";
import playIcon from "../../images/triangle-right.png";
import pauseIcon from "../../images/pause.png";
import closeIcon from "../../images/close.png";
import arrowDownIcon from "../../images/arrow-down.png";
import loopWholeIcon from "../../images/loop-whole.png";
import loopOnceIcon from "../../images/loop-once.png";
import randomIcon from "../../images/random.png";
import playlistIcon from "../../images/playlist.png";

import './index.scss';

interface Props {
  hasTabBar?: boolean;
  style?: React.CSSProperties;
  pageUrl?: string;
}

const PlayBar: React.FC<Props> = ({ style = {}, hasTabBar = true, pageUrl }) => {
  const currentMusic = useSelector(state => state.media.currentMusic);
  const currentSubtitle = useSelector(state => state.media.currentSubtitle);
  const loopType = useSelector(state => state.media.loopType);
  const media = useSelector(state => state.media.media);
  const activeType = useSelector(state => state.media.activeType);
  const currentTime = useSelector(state => state.media.currentTime);
  const selectedTab = useSelector(state => state.tabBar.selectedTab);
  const loopTypeRef = useRef(loopType);
  loopTypeRef.current = loopType;
  const isPlaying = useSelector(state => state.media.isPlaying);
  const [isCurrentPage, setIsCurrentPage] = useState(false);
  const showPlayBar = useSelector(state => state.media.showPlayBar);
  const needPlay = useSelector(state => state.media.play);
  const showTabBar = useSelector(state => state.tabBar.showTabBar);
  const [durationMovedString, setDurationMovedString] = useState('00:00');
  const [showCover, setShowCover] = useState(false);
  const dispatch = useDispatch();
  const currentMusicRef = useRef(currentMusic);
  currentMusicRef.current = currentMusic;
  const isMovingRef = useRef(false);
  const currentTimeRef = useRef(0);
  currentTimeRef.current = currentTime;
  const [showMusicList, setShowMusicList] = useState(false);
  const pages = Taro.getCurrentPages();

  const mediaData = (media.find(i => (i as any).name === currentMusic.mediaType) as any)?.data || [];

  const loopTypeIcons = {
    [LoopType.SingleLoop]: loopOnceIcon,
    [LoopType.Random]: randomIcon,
    [LoopType.WholeLoop]: loopWholeIcon
  }

  const musicName = currentMusic.name.split('.')[0];
  const isSpeech = currentMusic.mediaType === MediaType.Speech;

  useEffect(() => {
    if (!showPlayBar && currentSubtitle) {
      dispatch(updateCurrentSubtitle(''));
    }
  }, [showPlayBar])

  useEffect(() => {
    if (!showPlayBar || isPlaying || currentTime) return;
    playMusic();
  }, [showPlayBar]);

  useEffect(() => {
    setIsCurrentPage(selectedTab === pageUrl);
  }, [selectedTab])

  useEffect(() => {
    if (!needPlay) return;
    playMusic();
    dispatch(updatePlay(false));
    setShowMusicList(false);
  }, [needPlay])

  function checkIsSpeech() {
    return currentMusic.mediaType === MediaType.Speech;
  }

  function getNextMusic(url: string) {
    const musics = mediaData;
    const index = musics.findIndex(i => i.url === url);
    const isLastIndex = index === musics.length - 1;
    if (isLastIndex) {
      return {...musics[0], index: 0}
    } else {
      return { ...musics[index + 1], index: index + 1};
    }
  }

  function getPrevMusic(url: string) {
    const musics = mediaData;
    const index = musics.findIndex(i => i.url === url);
    const isFirstIndex = index === 0;
    if (isFirstIndex) {
      return {...musics[musics.length - 1], index: musics.length - 1}
    } else {
      return { ...musics[index - 1], index: index - 1};
    }
  }

  function getCurrentTimeString(currentTime?: number) {
    currentTime = currentTime ?? audioContext.currentTime;
    const seconds = moment.duration(currentTime, 'seconds').seconds().toString().padStart(2, '0');
    const minutes = moment.duration(currentTime, 'seconds').minutes().toString().padStart(2, '0');

    return currentTime ? minutes + ':' + seconds : '00:00'
  }

  function getTotalTimeString() {
    const duration = audioContext.duration;
    const totalSeconds = moment.duration(duration, 'seconds').seconds().toString().padStart(2, '0');
    const totalMinutes = moment.duration(duration, 'seconds').minutes().toString().padStart(2, '0');
    return duration ?  totalMinutes + ':' + totalSeconds : '00:00';
  }

  function randomPlay() {
    if(currentSubtitle) {
      dispatch(updateCurrentSubtitle(''))
    }
    const musics = mediaData.map((item, index) => ({ ...item, index})).filter(i => i.url !== currentMusicRef.current.url);
    const music = musics[Math.floor(Math.random() * musics.length)];
    const { url, name, index, duration, thumbnailUrl, imageUrl, subtitle = [] } = music;
    audioContext.src = url;
    audioContext.title = getMusicName(name.split('.')[0]);
    audioContext.singer = getMusicAuthor(name);
    audioContext.coverImgUrl = imageUrl;
    audioContext.play();

    dispatch(updateCurrentMusic({
      name,
      duration,
      url,
      index,
      thumbnailUrl, 
      imageUrl,
      subtitle,
      mediaType: currentMusicRef.current.mediaType
    }))
  }

  function next(isManual = false) {
    if(currentSubtitle) {
      dispatch(updateCurrentSubtitle(''))
    }
    if (loopTypeRef.current === LoopType.Random) {
      return randomPlay()
    }

    if (!isManual && loopTypeRef.current === LoopType.SingleLoop) {
      playMusic();
      return;
    }
  
    if (isManual || loopTypeRef.current === LoopType.WholeLoop) {
      const music = getNextMusic((currentMusicRef.current as any).url);
      const { url, name, index: nextIndex, duration, thumbnailUrl, imageUrl, subtitle = [] } = music;
      audioContext.src = url;
      audioContext.title = getMusicName(name.split('.')[0]);
      audioContext.singer = getMusicAuthor(name);
      audioContext.coverImgUrl = imageUrl;
      audioContext.play();
  
      dispatch(updateCurrentMusic({
        name,
        duration,
        url,
        index: nextIndex,
        thumbnailUrl,
        imageUrl,
        subtitle,
        mediaType: currentMusicRef.current.mediaType
      }))
    }
  }

  function prev() {
    if(currentSubtitle) {
      dispatch(updateCurrentSubtitle(''))
    }
    if (loopTypeRef.current === LoopType.Random) {
      return randomPlay()
    }

    const music = getPrevMusic((currentMusicRef.current as any).url);
    const { url, name, index: prevIndex, duration, thumbnailUrl, imageUrl, subtitle = [] } = music;
    audioContext.src = url;
    audioContext.title = getMusicName(name.split('.')[0]);
    audioContext.singer = getMusicAuthor(name);
    audioContext.coverImgUrl = imageUrl;
    audioContext.play();

    dispatch(updateCurrentMusic({
      name,
      duration,
      url,
      index: prevIndex,
      thumbnailUrl,
      imageUrl,
      subtitle,
      mediaType: currentMusicRef.current.mediaType
    }))
  }

  function playMusic() {
    const { name, duration, url, index, imageUrl, thumbnailUrl, subtitle = [] } = currentMusicRef.current;
    audioContext.src = url;
    audioContext.title = getMusicName();
    audioContext.singer = getMusicAuthor();
    audioContext.coverImgUrl = imageUrl;
    audioContext.onNext(() => next(true));

    audioContext.onPrev(prev);

    audioContext.play();

    audioContext.onPause(() => {
      dispatch(updateIsPlaying(false));
    })
    audioContext.onPlay(() => {
      dispatch(updateIsPlaying(true));
    })
    audioContext.onEnded(() => {
      next();
    })
    audioContext.onTimeUpdate(() => {
      const currentTime = audioContext.currentTime;
      const duration = audioContext.duration;
      const subtitle = currentMusicRef.current.subtitle.find(({from, to}) => (from <= currentTime && to >= currentTime));
      if (subtitle) {
        dispatch(updateCurrentSubtitle((subtitle as any).words))
      } else if(!checkIsSpeech() && currentSubtitle) {
        dispatch(updateCurrentSubtitle(''))
      }

      if (getCurrentTimeString() !== getCurrentTimeString(currentTimeRef.current)) {
        dispatch(updateCurrentTime(currentTime));
      }
    })

    dispatch(updateCurrentMusic({
      name,
      duration,
      url,
      index,
      imageUrl,
      thumbnailUrl,
      subtitle,
      mediaType: currentMusicRef.current.mediaType
    }))

    dispatch(updateShowPlayBar(true));

    dispatch(updateIsPlaying(true));
  }

  function pause() {
    audioContext.pause();
  }

  function continuePlay() {
    audioContext.pause();
  }

  function stop() {
    dispatch(closePlay());
  }

  function showMusicCover() {
    setShowCover(true);
    dispatch(setShowTabBar(false));
  }

  function closeCover() {
    setShowCover(false);
    dispatch(setShowTabBar(true));
  }

  function changeToNextLoopType() {
    const types = [LoopType.WholeLoop, LoopType.SingleLoop, LoopType.Random];
    const currentIndex = types.findIndex(i => i === loopType);
    let nextIndex = currentIndex + 1;

    if (nextIndex >= 3) {
      nextIndex = 0;
    }

    dispatch(updateLoopType(types[nextIndex]));
  }

  function handleMove(ratio: number) {
    isMovingRef.current = true;
    const currentTime = audioContext.currentTime;
    const duration = audioContext.duration;
    dispatch(updateCurrentTime(currentTime));
    const seconds = moment.duration(duration * ratio / 100, 'seconds').seconds().toString().padStart(2, '0');
    const minutes = moment.duration(duration * ratio / 100, 'seconds').minutes().toString().padStart(2, '0');
    setDurationMovedString((ratio && duration) ? minutes + ':' + seconds : '00:00');
  }

  function handleMoveEnd(ratio: number) {
    let currentTime = ratio * audioContext.duration / 100
    if (ratio >= 100) {
      currentTime =  audioContext.duration - 1;
    }
    audioContext.seek(currentTime);
    dispatch(updateCurrentTime(currentTime));
    currentTimeRef.current = currentTime;
    isMovingRef.current = false;
  }

  function handleClickPlayIcon() {
    if (currentTime) {
      audioContext.play();
    } else {
      playMusic();
    }
  }

  function getMusicName(name?: string) {
    const musicArr = (name || musicName).split('-');
    return checkIsSpeech() ? musicArr[musicArr.length - 1] : musicName;
  }

  function getMusicAuthor(name?: string) {
    const musicArr = (name || currentMusicRef.current.name).split('.')[0].split('-');
    return checkIsSpeech() ? musicArr[0] : 'Unknown';
  }

  if (!isCurrentPage) return null;
  if (!showPlayBar) return null;
  return (
    <View className='play-bar-container'>
      {
        !showCover && (
          <View className={`play-bar-wrapper ${showTabBar && hasTabBar ? 'play-bar-padding' : ''}`} style={style}>
            <View className="bottom-bar-wrapper" onClick={showMusicCover}>
              <View
                className="thumbnail"
                style={{
                  backgroundImage: `url(${currentMusic.thumbnailUrl})`
                }}
              ></View>
              <View className="info flex-between">
                <View className="name-and-progress">
                  <View className="text-ellipsis text-capitalize">{getMusicName()}</View>
                  <View>
                  <ProgressBar
                    ratio={currentTime / audioContext.duration}
                    text={getCurrentTimeString()}
                    textStyle={{
                      justifyContent: 'flex-start',
                      width: '60rpx'
                    }}
                  ></ProgressBar>
                  </View>
                </View>
                <View className="controls">
                  <View className="play-icons">
                    <Image
                      src={playBackwardIcon}
                      onClick={(e) => {
                        e.stopPropagation()
                        prev();
                      }
                    }></Image>
                    {
                      isPlaying ? (
                        <Image
                          src={pauseIcon}
                          onClick={(e) => {
                            e.stopPropagation()
                            pause();
                          }}
                        ></Image>
                        ) : (
                        <Image
                          src={playIcon}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClickPlayIcon();
                          }}
                        ></Image>
                      )
                    }
                    <Image
                      src={playForwardIcon}
                      onClick={(e) => {
                        e.stopPropagation()
                        next(true);
                      }}
                    ></Image>
                    <Image
                      src={closeIcon}
                      onClick={(e) => {
                        e.stopPropagation()
                        stop();
                      }}
                    ></Image>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )
      }

      <View className={`music-cover ${showCover ? 'show-cover' : ''}`}>
        <View
          className="background-cover"
          style={{
            backgroundImage: `url(${currentMusic.imageUrl})`
          }}
        ></View>
        <View className="mask"></View>
        <View className="arrow-down flex-center" onClick={closeCover}>
          <Image src={arrowDownIcon}></Image>
        </View>
        <View style={{ padding: '0 40rpx' }}>
          <Title className="title text-capitalize text-ellipse">
            {getMusicName()}
          </Title>
        </View>
        {
          isSpeech && (
              <Title className="text-capitalize">{getMusicAuthor()}</Title>
          )
        }
        <Title className="subtitle">
          {currentSubtitle}
        </Title>
        <View className="controls">
          <View className="progress-wrapper">
            <View className="duration">
              {isMovingRef.current ? durationMovedString  : getCurrentTimeString()}
            </View>
            <View className="progress">
              <ProgressBar
                showDot
                ratio={currentTimeRef.current / audioContext.duration}
                text={getTotalTimeString()}
                textStyle={{ width: '80rpx' }}
                // onMoveStart={() => isMovingRef.current = true}
                onMove={handleMove}
                onMoveEnd={handleMoveEnd}
              ></ProgressBar>
            </View>
          </View>
          <View className="play-icons">
            <View>
              <Image src={loopTypeIcons[loopType]} onClick={changeToNextLoopType}></Image>
            </View>
            <Image
              src={playBackwardIcon}
              onClick={(e) => {
                e.stopPropagation()
                prev();
              }
            }></Image>
            {
              isPlaying ? (
                <Image
                  src={pauseIcon}
                  onClick={(e) => {
                    e.stopPropagation()
                    pause();
                  }}
                ></Image>
                ) : (
                <Image
                  src={playIcon}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClickPlayIcon();
                  }}
                ></Image>
              )
            }
            <Image
              src={playForwardIcon}
              onClick={(e) => {
                e.stopPropagation()
                next(true);
              }}
            ></Image>
            <Image
              src={playlistIcon}
              onClick={(e) => {
                e.stopPropagation()
                setShowMusicList(true);
              }}
            ></Image>
          </View>
        </View>
      </View>
      <View style={{ zIndex: 5, position: 'relative' }}>
        <MusicCover visible={showMusicList} onClose={() => setShowMusicList(false)}></MusicCover>
      </View>
    </View>
  )
}

export default PlayBar;