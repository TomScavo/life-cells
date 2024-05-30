import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View, Canvas, Image, Button, PageContainer, } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { EncourageConfig } from "../../../store/types/goals"
import { MediaType } from '../../../constants';
import { ScrollTitles, MusicList } from '../../../component';
import musicIcon from '../../../images/music.png';
import CoverModal from './cover-modal';
import checkIcon from "../../../images/check.png";
import previewIcon from "../../../images/preview.png";

import './image-list.scss';

interface Props {
    updateFormValues: any;
    images: string[];
    name: keyof EncourageConfig;
}

const ImageList: React.FC<Props> = ({images, updateFormValues, name }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const showPlayBar = useSelector(state => state.media.showPlayBar);
  const isOnline = useSelector(state => state.media.isOnline);
  const media = useSelector(state => state.media.media);
  const activeType = useSelector(state => state.media.activeType);
  const encourageConfig = useSelector(state => state.goals.encourageConfig)
  const [showPreview, setShowPreview] = useState(false);

  return (
    <View className="config-image-list">
        <View className="image-list-wrapper flex-between">
            {
                images.map((imageUrl, index) => (
                    <View
                    className={`flex-center image-wrapper ${encourageConfig[name] === imageUrl ? 'selected-image' : '' }`}
                    key={`${imageUrl}${index}`} style={{ backgroundImage: `url(${imageUrl})` }}
                    onClick={() => {
                        if (encourageConfig[name] === imageUrl ) {
                        setShowPreview(true);
                        } else {
                        updateFormValues(name, imageUrl);
                        }
                    }}
                    >
                    <Image className={`check-icon ${encourageConfig[name] === imageUrl ? 'show-check-icon' : ''}`} src={checkIcon}></Image>
                    {
                        encourageConfig[name] === imageUrl && (
                        <Image src={previewIcon} className="preview-icon"></Image>
                        )
                    }
                    </View>
                ))
            }
        </View>
        {
            showPreview && (
            <View
                className={`preview-wrapper ${showPreview ? 'show-preview' : ''}`} onClick={() => setShowPreview(false)}
            >
                <Image mode='widthFix' src={encourageConfig[name] as string}></Image>
            </View>
            )
        }
    </View>
  )
}

export default ImageList;