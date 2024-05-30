import { createSlice } from "@reduxjs/toolkit";
export const loadingCover = createSlice({
  // 命名空间，在调用action的时候会默认的设置为action的前缀
  name: "tabBar",
  // 初始值
  initialState: {
    showLoadingCover: true,
  },
  // 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    setShowLoadingCover(state, { payload }) {
      state.showLoadingCover = payload;
    },
  },
});
// 导出actions
export const { setShowLoadingCover } = loadingCover.actions;
// 导出reducer，在创建store时使用到
export default loadingCover.reducer;
