import { Text, View, CoverView, Image } from "@tarojs/components";
import { CSSProperties } from "react";
import { AtIcon } from 'taro-ui';
import loadingIcon from '../../images/spinner.png'
import "./index.scss";

const Loading: React.FC<{ size?: string }> = ({ children, size }) => {
  return (
    <Image mode="widthFix" src={loadingIcon} style={{ width: size || 30, height: 30 }} className="loading-icon"></Image>
    // <AtIcon value='loading-2' size={size || '30'} color='#fff' className="loading-icon"></AtIcon>
  )
}

export default Loading;