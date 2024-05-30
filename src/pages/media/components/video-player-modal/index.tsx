import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Taro from '@tarojs/taro';
import { Text, View, CoverView, Button, Image, Input, Video } from "@tarojs/components";
import { Title } from "../../../../component";
import playIcon from "../../../../images/play.png";
import closeIcon from "../../../../images/close.png";

import "./index.scss";

interface Props {
  title: string;
  videoUrl: string;
  onClose(): void;
}

const VideoPlayerModal: React.FC<Props> = ({ title, videoUrl, onClose }) => {
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  function handleClose() {
    onClose();
  }

  function handleEnd() {

  }

  function handleLoadedMetaData() {

  }

  function handleUpdate() {

  }

  if (!videoUrl) return null;
  return (
  <View className="video-player-modal-container">
        <Title>{title}</Title>
        <Video
          id="media"
          loop
          autoplay
          direction={90}
          onEnded={handleEnd}
          onLoadedMetaData={handleLoadedMetaData}
          onTimeUpdate={handleUpdate}
          src={videoUrl}
          className="video"
        ></Video>
        <Image src={closeIcon} className="close-icon" onClick={handleClose}></Image>
    </View>
  )
}

export default VideoPlayerModal;