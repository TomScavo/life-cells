import { Text, View, CoverView, Button, Image } from "@tarojs/components";
import playIcon from "../../images/play.png";
import { useState, useRef } from "react";

import { stopAnimalMusic, playCoverAudio } from '../../pages/goal-detail/utils'
import { Args } from "../../pages/goal-detail/types";

import "./index.scss";

let timer: any = null;
const PlayButton: React.FC<Args> = args => {
  const {
    isPlaying,
    setIsPlaying,
    isPlayingRef,
    audioRef,
  } = args;
  const [fade, setFade] = useState(false);

  function fadeTimeOut(duration?: number) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!isPlayingRef.current) return;

      setFade(true);
    }, duration || 5000);
  }

  function handleClickMask() {
    if (isPlaying) {
      fadeTimeOut();
      setFade(false);
    }
  }

  function stopPlay(e?: any) {
    clearTimeout(timer);
    e && e.stopPropagation && e.stopPropagation();
    setFade(false);
  }

  function handlePlay(e) {
    if (fade) return;

    if (isPlaying) {
      stopPlay(e);
    } else {
      fadeTimeOut();
    }

    handleClickCoverPlayButton();
  }

  function handleClickCoverPlayButton() {
    if (isPlaying) {
      stopAnimalMusic(isPlayingRef, audioRef);
    } else {
      playCoverAudio(args);
    }
  
    setIsPlaying(!isPlaying);
  }

  return (
    <View className={`play-button-wrapper flex-center ${fade ? 'fade' : ''}`} onClick={handleClickMask}>
      <Button className="play-button flex-center" onClick={handlePlay}>
      {
        isPlaying && (
          <View className="stop-wrapper">
            <View className="stop-before"></View>
            <View className="stop-after"></View>
          </View>
        )
      }
      {
        !isPlaying && <Image className="play-icon" src={playIcon} />
      }
    </Button>
  </View>
  )
}

export default PlayButton;