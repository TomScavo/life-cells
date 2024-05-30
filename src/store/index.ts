import { configureStore, combineReducers } from "@reduxjs/toolkit";
import birthday from "./birthday";
import tabBar from "./tabBar";
import loadingCover from "./loadingCover";
import goals from "./goals";
import media from "./media";

const rootReducer = combineReducers({
  birthday,
  tabBar,
  loadingCover,
  goals,
  media
});

const store = configureStore({
  reducer: rootReducer,

});

export default store;

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;
