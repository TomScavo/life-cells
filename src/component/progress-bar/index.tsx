import Taro, { useReady } from '@tarojs/taro';
import { useState, useEffect, useRef } from 'react';
import { Text, View, Image } from "@tarojs/components";
import { useSelector, useDispatch } from 'react-redux';
import { serverAddress } from '../../config';
import "./index.scss";

interface Props {
  ratio: number;
  decimalLength?: number;
  needPadEnd?: boolean;
  textStyle?: React.CSSProperties;
  showPercent?: boolean;
  text?: string;
  showDot?: boolean;
  showHero?: boolean;
  onMoveStart?(): any;
  onMove?(ratio: number): any;
  onMoveEnd?(ratio: number): any;
}

const ProgressBar: React.FC<Props> = ({
  ratio,
  decimalLength = 7,
  needPadEnd = false,
  textStyle = {},
  showPercent = true,
  text = '',
  showDot = false,
  showHero = false,
  onMoveStart,
  onMove,
  onMoveEnd,
  // alwaysShowDecimal = false
}) => {
  const { isShowHero, selectedHero, selectedPrincess } = useSelector(state => state.goals.encourageConfig)
  const anime: any = useSelector(state => state.goals.anime)
  const isExecuting = useSelector(state => state.goals.executingGoal.isExecuting)
  const [showLevelUp, setShowLevelUp] = useState(false);
  const isMovingRef = useRef(false);
  const isMoveEndRef = useRef(true);
  const [endClientX, setEndClientX] = useState(0);
  const [dragons, setDragons] = useState<null | [string, string, string]>(null);
  const throttleRef = useRef(false);
  const endClientXRef = useRef(0);
  const currentHeroLevelRef = useRef(Math.floor(getRatio()));
  endClientXRef.current = endClientX;
  const startRatioRef = useRef({
    ratio: 0,
    clientX: 0,
  });
  const progressBarWidthRef = useRef(0);

  useEffect(() => {
    const currentLevel = Math.floor(getRatio());

    if (showHero && isShowHero && selectedHero && dragons && isExecuting && currentHeroLevelRef.current !== currentLevel) {
      currentHeroLevelRef.current = currentLevel;
      setShowLevelUp(true);
      setTimeout(() => {
        setShowLevelUp(false);
      }, 500);
    }
  }, [ratio]);

  useEffect(() => {
    Taro.getSystemInfo({
      success (res) {
        const result = res.windowWidth - (80 + 80 + 80 + 10) / (750 / res.windowWidth);

        progressBarWidthRef.current = result;
      }
    })
  }, [])

  useEffect(() => {
    if ((anime as any).dragons && !dragons) {
      getRandomDragons();
    }
  }, [anime])

  function getRandomDragons(){
    let dragons = [];
    if (!(anime as any).dragons) return;
    const allDragons = [...anime.dragons];
    const index = Math.floor(Math.random() * allDragons.length);
    dragons.push(allDragons[index]);
    allDragons.splice(index, 1);
    const secondIndex = Math.floor(Math.random() * allDragons.length);
    dragons.push(allDragons[secondIndex]);
    allDragons.splice(secondIndex, 1);
    const thirdIndex = Math.floor(Math.random() * allDragons.length);
    dragons.push(allDragons[thirdIndex]);
    setDragons(dragons as any);
  }

  ratio = ratio * 100;
  function getPadRatio() {
    if (ratio >= 100) return 100;
    if (decimalLength >= 100) decimalLength = 99;
    if (decimalLength <= 0) decimalLength = 1;

    const fixedRatio = ratio.toFixed(decimalLength);
    if (!needPadEnd) return Number(fixedRatio);

    const numArr = fixedRatio.toString().split('.');
    return numArr[0] + '.' + (numArr[1] || '').padEnd(decimalLength, '0');
  }

  function getRatio () {
    let newRatio = ratio;

    if (isMovingRef.current && endClientXRef.current) {
      const totalRatio = getMovedTotalRatio();
      newRatio = totalRatio * 100;

      if (newRatio < 0) {
        return 0
      } else if (newRatio > 100) {
        return 100
      } else {
        return newRatio;
      }
    } else {
      return newRatio >= 100 ? 100 : newRatio;
    }
  }

  function throttle(e: any) {
    if(throttleRef.current) return;
    isMovingRef.current = true;
    isMoveEndRef.current = false;
    throttleRef.current = true;
    setEndClientX(e.changedTouches[0].clientX);
    onMove && onMove(getRatio());
    setTimeout(() => {
      throttleRef.current = false;
    }, 30);
  }

  function handleTouchStart(e: any) {
    startRatioRef.current = {
      ratio: ratio / 100,
      clientX: e.changedTouches[0].clientX
    }
  }

  function getMovedTotalRatio() {
    if (!endClientXRef || !startRatioRef || !progressBarWidthRef ) return 0;

    const movedRatio = (endClientXRef.current - startRatioRef.current.clientX) / (progressBarWidthRef.current);
    const totalRatio = movedRatio + startRatioRef.current.ratio;

    return totalRatio;
  }

  function handleTouchEnd(e: any) {
    const movedRatio = (endClientXRef.current - startRatioRef.current.clientX) / (progressBarWidthRef.current);
    const totalRatio = movedRatio + startRatioRef.current.ratio;

    onMoveEnd && onMoveEnd(getRatio());
    isMoveEndRef.current = true;
    setTimeout(() => {
      isMovingRef.current = false;
    }, 400)
  }

  return (
    <View className="progress-bar-wrapper">
      <View style={{ height: showDot ? '10rpx' : '10rpx' }} {...(showDot ? {id: "progress-bar"} : {})} className="progress-bar-container">
        <View style={{ width: `${getRatio() || 0}%` }} className={`progress-bar ${getRatio() >= 100 && !showDot ? 'finished' : ''}`}></View>
        {
          showDot && (
            <View
              style={{ left: `calc(${getRatio() || 0}% - 14rpx)`, transform: isMovingRef.current && !isMoveEndRef.current ? 'scale(1.5)' : 'none' }}
              className='dot-wrapper flex-center'
              onTouchStart={handleTouchStart}
              onTouchMove={throttle}
              onTouchEnd={handleTouchEnd}
            >
              <View
                className="dot"
              ></View>
            </View>
          )
        }
        {
          showHero && isShowHero && selectedHero && dragons && isExecuting && getRatio() < 100 && (
            <View className='anime-wrapper'>
              <View style={{ left: `${getRatio() - 10 || 0}%` }}>
                <Image style={{ visibility: showLevelUp ? 'visible' : 'hidden' }} className='level-up' src={serverAddress + 'anime/level-up.png'} ></Image>
                <View className='level'>Lv.{Math.floor(getRatio())}</View>
                <Image className='hero' src={selectedHero}></Image>
              </View>
              <View style={{ visibility: getRatio() < 25 ? 'visible' : 'hidden' }}>
                <View className='level'>Lv.25</View>
                <Image mode="widthFix" src={dragons[0]}></Image>
              </View>
              <View style={{ visibility: getRatio() < 50 ? 'visible' : 'hidden' }}>
                <View className='level'>Lv.50</View>
                <Image mode="widthFix" src={dragons[1]}></Image>
              </View>
              <View style={{ visibility: getRatio() < 75 ? 'visible' : 'hidden' }}>
                <View className='level'>Lv.75</View>
                <Image mode="widthFix" src={dragons[2]}></Image>
              </View>
              <View>
                <Image className='princess' mode="widthFix" src={selectedPrincess}></Image>
              </View>
            </View>
          )
        }
      </View>
      {
        showPercent && (
          <View>
            <Text style={textStyle} className="text">{text || `${getPadRatio() || 0}%`}</Text>
          </View>
        )
      }
    </View>
  )
}

export default ProgressBar;