import { createSlice } from "@reduxjs/toolkit";
import Taro from "@tarojs/taro";

export const birthday = createSlice({
  // 命名空间，在调用action的时候会默认的设置为action的前缀
  name: "birthday",
  // 初始值
  initialState: {
    day: '',
    loading: false,
    showPassedLife: false,
    showBirthdayModal: true
  },
  // 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    updateBirthday(state, { payload }) {
      state.day = payload;
    },
    updateLoading(state, { payload }: {payload: boolean}) {
      state.loading = payload;
    },
    updateShowPassedLife(state, { payload }: {payload: boolean}) {
      state.showPassedLife = payload;
    },
    setShowBirthdayModal(state, { payload }) {
      state.showBirthdayModal = payload;
      if (!payload) {
        state.loading = false;
      }
    }
  },
});
// 导出actions
export const { updateBirthday, setShowBirthdayModal, updateLoading, updateShowPassedLife } = birthday.actions;
// 导出reducer，在创建store时使用到
export default birthday.reducer;
