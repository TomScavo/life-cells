import Taro from "@tarojs/taro";
import store from "../store";

import { updateSelectedTab } from "../store/tabBar"
import { homePagePath, goalPagePath, goalPage } from "../config"

export const Route = {
    navigateBack: () => {
        let prevPage =  Taro.getCurrentPages()[Taro.getCurrentPages().length - 2].route;
        if (homePagePath === prevPage ) {
            prevPage = goalPagePath;
            Taro.switchTab({
                url: goalPage
            })
        } else {
            Taro.navigateBack();
        }

        store.dispatch(updateSelectedTab(prevPage));
    },
    navigateTo: (props: Taro.navigateTo.Option) => {
        const pagePath = props.url.substring(1);
        store.dispatch(updateSelectedTab(pagePath));

        Taro.navigateTo(props)
    },
    switchTab: (props: Taro.switchTab.Option) => {
        Taro.switchTab(props);
    }
}