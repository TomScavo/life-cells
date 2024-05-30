import { ScrollView, Text, View, Canvas, Video, Image } from "@tarojs/components";
import React, { useEffect, useState, Component } from "react";
import Taro, { useReady } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Title, Mask, ProgressBar, BirthdayPicker, LoadingCover } from "../../component";
import { homePagePath } from '../../config';
import { updateBirthday, setShowBirthdayModal } from '../../store/birthday';
import { setShowLoadingCover } from '../../store/loadingCover';
import { setShowTabBar } from '../../store/tabBar';
import { getSpendMonth, getAge } from '../../utils';
import './index.scss';

const numPerRow = 23;

let timer: any = null;
const Cells = () => {
  const dispatch = useDispatch();
  const [cellSize, setCellSize] = useState(0);
  const birthday = useSelector(state => state.birthday.day);
  const activePage = useSelector(state => state.tabBar.selectedTab);
  const spendMonth = getSpendMonth(birthday);
  const age = getAge(birthday);

  useEffect(() => {
    timer = setTimeout(() => {
      getCellSize();
    })

    return(() => {
      clearTimeout(timer);
    })
  }, [activePage])

  function getCellSize() {
    Taro.createSelectorQuery().select('#gird-main')
    .boundingClientRect(( rect ) => {
      if (!rect || !rect.width) {
        timer = setTimeout(() => {
          getCellSize();
        }, 200);
        return;
      }

      const { width } = rect;
      setCellSize(width / numPerRow);
    })
    .exec()
  }

  function getCells() {
    const totalMonths = 23 * 42;
    // const totalMonths = 23 * 1;
    const cells: JSX.Element[] = [];
    const daysRatio = Math.round((spendMonth % 1) * 10) / 10;

    for ( let i = 1; i <= totalMonths; i++ ) {
      const cellAge = (i) / 12;
      // 只标今年、今年.5、明年、和80岁
      const isThisYear = ((i % 12 === 0) && ((spendMonth  - i) > 0 &&  (spendMonth  - i) < 12));
      const isNextYear = ((i % 12 === 0) && ((i - spendMonth >= 0) && i - spendMonth <= 12));
      const isEightyYears = (i === 80 * 12);
      const showAge = isThisYear || isNextYear || isEightyYears;
      const isEdgeLeft = i % numPerRow === 1;
      const isEdgeBottom = i > totalMonths - numPerRow;
      const isHalf = (spendMonth - i + 1) > 0 && (spendMonth - i + 1)  <= 1;
      const isDay = (i % 12 !== 0) && isHalf;

      cells.push(
        <View id={`${i}`} style={{ width: cellSize, height: cellSize }} className="cell-wrapper">
          { isHalf && <View style={{ width: daysRatio * cellSize }} className="days"></View> }
          <View className={`cell ${i <= spendMonth ? 'cell-passed' : 'cell-remain'} ${showAge && isHalf ? ' cell-marked': '' }`}>
            { showAge && <Text className="text">{ cellAge }</Text> }
            { isDay && <Text className="text month">{ age }</Text> }
          </View>
          { !isEdgeLeft && <View className="border-left"></View> }
          { !isEdgeBottom && <View className="border-bottom"></View> }
        </View>
      )
    }

    return cells;
  }

  return (
    <View  className="gird-wrapper">
        <View  id="gird-main" className="grid-main">
          {getCells()}
        </View>
      </View>
  );
}

export default React.memo(Cells);