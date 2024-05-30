import { useState, useRef, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { CoverView, CoverImage, View, PageContainer } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux';
import { find } from 'lodash-es';
import { updateSelectedTab, setShowTabBar } from '../store/tabBar'

import { customTabBarConfigList, breathPagePath, homePagePath, goalPagePath, mediaPagePath } from '../config'

import './index.scss'
import { setShowLoadingCover } from '../store/loadingCover';

const CustomTabBar = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector(state => state.tabBar.selectedTab);
  const [color, setColor] = useState('#b7d3fd');
  const [selectedColor, setSelectedColor] = useState('#fff');
  const showTabBar = useSelector(state => state.tabBar.showTabBar);

  function switchTab(url: string) {
    dispatch(updateSelectedTab(url));
    if (url === breathPagePath) {
      dispatch(setShowTabBar(false));
      dispatch(setShowLoadingCover(true));
    }
    setTimeout(() => {
      Taro.switchTab({ url: `/${url}` });

      setTimeout(() => {
        dispatch(setShowLoadingCover(false));
      }, 3000);
    }, 300)
  }

  function getClassName(pagePath: string) {
    let className = '';
    className = pagePath !== homePagePath ? 'goal-icon' : '';

    if (pagePath === mediaPagePath) {
      className += ' media-icon'
    }

    return className;
  }

  if (!showTabBar) return null;
  return (
      <View className="tab-bar">
        <CoverView  className='tab-bar-wrapper'>
          {customTabBarConfigList.map(({ pagePath, selectedIconPath, iconPath, text }) => {
            return (
              <CoverView key={pagePath} className='tab-bar-item' onClick={() => switchTab(pagePath)}>
                <CoverImage
                  src={selectedTab === pagePath ? selectedIconPath : iconPath}
                  className={getClassName(pagePath)}
                />
                <CoverView style={{ color: selectedTab === pagePath ? selectedColor : color }} className={ pagePath !== homePagePath ? 'goal-text' : ''  } >{text}</CoverView>
              </CoverView>
            )
          })}
        </CoverView>
      </View>
    )
}

export default CustomTabBar;