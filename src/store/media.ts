import Taro from "@tarojs/taro";
import { createSlice,PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "./";
import { homePagePath } from "../config";
import { audioContext } from "../constants"
import services from "../services"

import { Store, MediaType } from '../constants';


const defaultCurrentMusic = {
    name: '',
    duration:'',
    index: 0,
    url: '',
    thumbnailUrl: '',
    imageUrl: '',
    subtitle: [],
    mediaType: ''
}

export enum LoopType {
  SingleLoop = 'singleLoop',
  WholeLoop = 'wholeLoop',
  Random = 'singleRandom',
}

const state = {
    showPlayBar: false,
    isPlaying: false,
    currentMusic: defaultCurrentMusic,
    loopType: LoopType.WholeLoop,
    play: false,
    currentTime: 0,
    isOnline: false,
    activeType: MediaType.Piano,
    media: [],
    currentSubtitle: ''
}

export const media = createSlice({
  // 命名空间，在调用action的时候会默认的设置为action的前缀
  name: "media",
  // 初始值
  initialState: state,
  // 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    updateCurrentSubtitle(state, { payload }) {
      state.currentSubtitle = payload;
    },
    updateMedia(state, { payload }) {
      state.media = payload;
    },
    updateActiveType(state, { payload }: PayloadAction<MediaType>) {
      state.activeType = payload;
    },
    updateCurrentMusic(state, { payload }: PayloadAction<typeof defaultCurrentMusic> ) {
      state.currentMusic = payload;
    },
    updateShowPlayBar(state, { payload }: PayloadAction<boolean>) {
      state.showPlayBar = payload;
    },
    updateIsPlaying(state, { payload }: PayloadAction<boolean>) {
      state.isPlaying = payload;
    },
    closePlay(state) {
      audioContext.stop();
      audioContext.seek(0);
      state.showPlayBar = false;
      state.isPlaying = false;
      state.currentMusic = defaultCurrentMusic;
    },
    updateLoopType(state, { payload }: PayloadAction<LoopType>) {
      state.loopType = payload;
      Taro.setStorage({
        key: Store.LoopType,
        data: payload
    });
    },
    updatePlay(state, { payload }: PayloadAction<boolean>) {
      state.play = payload;
    },
    updateCurrentTime(state, { payload }: PayloadAction<number>) {
      state.currentTime = payload;
    },
    updateIsOnline(state, { payload }: PayloadAction<boolean>) {
      state.isOnline = payload;
    },
  }
});


// 导出actions
export const {
    updateCurrentMusic,
    updateShowPlayBar,
    updateIsPlaying,
    closePlay,
    updateLoopType,
    updatePlay,
    updateCurrentTime,
    updateIsOnline,
    updateMedia,
    updateActiveType,
    updateCurrentSubtitle
} = media.actions;

export const setMedia = createAsyncThunk<any, any, { state: RootState }>('media/updateMedia', (data: any, { dispatch, getState }) => {
  if (!getState().media.media.length) {
    services.getMedia().then(data => {
      dispatch(updateMedia(data));
      return data;
    }).catch(e => [])
  }
  return;
})

// 导出reducer，在创建store时使用到
export default media.reducer;
