import { View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import backIcon from "../../images/back.png";
import { Route } from "../../constants";

import "./index.scss";

interface Props {
  title?: string,
  style?: React.CSSProperties,
  className?: string,
  backStyle?: React.CSSProperties,
  showGoBack?: boolean,
  onGoBack?(): void,
  addPadding?: boolean
}

const Title: React.FC<Props> = ({ title, style, children, showGoBack = false, backStyle = {}, onGoBack, className = '', addPadding = false }) => {
  function goBack() {
    if (onGoBack) {
      onGoBack()
    } else {
      Route.navigateBack();
    }
  }

  return (
    <View className={`text-ellipsis page-title ${className}`} style={{...(style || {}), paddingLeft: addPadding ? '40rpx' : 0, paddingRight:  addPadding ? '40rpx' : 0}}>
      <View className="title-main">
        {showGoBack && (
          <View onClick={goBack} className='back-icon-wrapper flex-center'>
            <Image style={backStyle} src={backIcon} className="back-icon" ></Image>
          </View>
        )}
        { title }
        {children}
      </View>
    </View>
  )
}

export default Title;