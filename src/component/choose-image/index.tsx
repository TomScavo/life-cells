import { ScrollView, Text, View, Canvas, Image } from "@tarojs/components";
import { useEffect, useState, Component, useRef } from "react";
import Taro, { useReady, InnerAudioContext } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import checkIcon from "../../images/check.png";

import "./index.scss";
import { Title, Mask, ProgressBar, BirthdayPicker } from "../../component";
import './index.scss';

interface ImageUrl {
  imageUrl: string,
  voiceUrl: string
}

interface Props {
  selectedImage: string;
  images: string[];
  onSelect(image: string): any;
}

const ChooseImage: React.FC<Props> = ({selectedImage, images, onSelect }) => {
  const audioContextRef = useRef<InnerAudioContext>(Taro.createInnerAudioContext());
  const loadedImageRef = useRef(0);
  const totalImageRef = useRef(images.length);
  const [showLoading, setShowLoading] = useState(true);
  const [leftImages, setLeftImages] = useState<ImageUrl[]>([]);
  const [rightImages, setRightImages] = useState<ImageUrl[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    totalImageRef.current = images.length;
  }, [images])

  function handleImageLoad() {
    loadedImageRef.current++;

    if (loadedImageRef.current === totalImageRef.current - 3) {
      setShowLoading(false);
    }
  }

  function playAudio(voiceUrl: string) {
    const audio = audioContextRef.current;
    audio.src = voiceUrl;

    audio.play();
  }

  function handleClickImage({imageUrl, voiceUrl}: ImageUrl) {
    onSelect(imageUrl)
  }

  function getImageItem({imageUrl, voiceUrl}: ImageUrl, index: number, isLeft: boolean) {
    return (
      <View className='image-wrapper' onClick={() => playAudio(voiceUrl)}>
        <Image
          className={`image ${selectedImage=== imageUrl ? "selected-image" : ""}`}
          mode="widthFix"
          key={imageUrl}
          src={imageUrl}
          onLoad={handleImageLoad}
          // onError={() => handleImageError({url, isLeft, i: index })}
          onClick={() => handleClickImage({ imageUrl, voiceUrl })}
        ></Image>
        <Image className={`check-icon ${selectedImage=== imageUrl ? 'show-check-icon' : ''}`} src={checkIcon}></Image>
        <View
          className={`preview-btn ${selectedImage=== imageUrl ? 'show-check-icon' : ''}`}
          onClick={() => setShowPreview(true)}
        >
          预览
        </View>
      </View>
    )
  }

  return (
    <View className="choose-image-wrapper">
      <View className={`image-group ${showLoading ? 'hide-image-group' : ''}`} style={{ opacity: showLoading ? 0 : 1 }}>
        <View className="image-column">
          {
            leftImages.map((image, i) =>  getImageItem(image, i, true))
          }
        </View>
        <View className="image-column image-column-right">
          {
            rightImages.map((image, i) => getImageItem(image, i, false))
          }
          {/* {getRightColumnImages()} */}
        </View>
      </View>
    </View>
  );
}

export default ChooseImage;