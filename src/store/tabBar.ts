import { createSlice } from "@reduxjs/toolkit";
import { homePagePath } from "../config";

export const tabBar = createSlice({
  // 命名空间，在调用action的时候会默认的设置为action的前缀
  name: "tabBar",
  // 初始值
  initialState: {
    selectedTab: homePagePath,
    showTabBar: false,
  },
  // 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    setShowTabBar(state, { payload }) {
      state.showTabBar = payload;
    },
    updateSelectedTab(state, { payload }) {
      state.selectedTab = payload;
    }
  },
});
// 导出actions
export const { setShowTabBar, updateSelectedTab } = tabBar.actions;
// 导出reducer，在创建store时使用到
export default tabBar.reducer;
