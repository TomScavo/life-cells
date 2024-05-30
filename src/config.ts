export const homePagePath = "pages/home/index";
export const goalPagePath = "pages/goal/index";
export const addGoalPagePath = "pages/add-goal/index";
export const goalDetailPagePath = "pages/goal-detail/index";
export const breathPagePath = "pages/breath/index";
export const goalLogsPagePath = "pages/goal-logs/index";
export const mediaPagePath = "pages/media/index";
export const homePage = `/${homePagePath}`;
export const goalPage = `/${goalPagePath}`;
export const addGoalPage = `/${addGoalPagePath}`;
export const goalDetailPage = `/${goalDetailPagePath}`;
export const breathPage = `/${breathPagePath}`;
export const goalLogsPage = `/${goalLogsPagePath}`;
export const mediaPage = `/${mediaPagePath}`;

export const serverIP = "lifecells.top";
export const serverAddress = "https://lifecells.top/";
export const apiPrefix = "https://lifecells.top/api";
export const serverImagesDir = "https://lifecells.top/images/";
export const serverVoicesDir = "https://lifecells.top/voices/";
export const serverMediaDir = "https://lifecells.top/media/";
export const serverEncourageVoicesDir = "https://lifecells.top/encourage-voices/";
export const serverHelperDir = "https://lifecells.top/helper/";

export const config = {
  requiredBackgroundModes: ["audio"],
  pages: [
    homePagePath,
    goalPagePath,
    addGoalPagePath,
    goalDetailPagePath,
    goalLogsPagePath,
    breathPagePath,
    mediaPagePath
  ],
  // // 分包配置
  // subPackages: [
  //   {
  //     root: "sub-query-pages",
  //     name: "query-pages",
  //     pages: ["goods-query/index", "goods-list/index", "order-list/index"],
  //   },
  // ],
  tabBar: {
    custom: true,
    color: "#333",
    selectedColor: "#ff0000",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/home/index",
        selectedIconPath: 'images/box_selected.png',
        iconPath: 'images/box.png',
        text: '生命格子'
      },
      {
        pagePath: goalPagePath,
        selectedIconPath: 'images/target-selected2.png',
        iconPath: 'images/target.png',
        text: '目标'
      },
      {
        pagePath: mediaPagePath,
        selectedIconPath: 'images/youtube-selected.png',
        iconPath: 'images/youtube.png',
        text: '影音'
      },
      {
        pagePath: breathPagePath,
        selectedIconPath: 'images/loop-selected.png',
        iconPath: 'images/loop.png',
        text: '呼吸'
      }
    ],
  },
  window: {
    backgroundColor: "#000",
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#000",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    navigationStyle: "custom",
    disableScroll: true,
  }
}

export const customTabBarConfigList = config.tabBar.list.map(item => ({
     ...item, 
     iconPath:  `../${item.iconPath}`,
     selectedIconPath: `../${item.selectedIconPath}`
}))
