import { Text, View, CoverView, Image } from "@tarojs/components";
import { CSSProperties } from "react";
import { AtIcon } from 'taro-ui';
import catIcon from "../../images/cat.png";
import "./index.scss";

interface Props {
  text: string;
}

const Empty: React.FC<Props> = ({ children, text }) => {
  return (
    <View className="empty-wrapper">
      <Image
        mode="widthFix"
        className="cat-image"
        src={catIcon}
      >
      </Image>
      <Text>{text}</Text>
    </View>
  )
}

export default Empty;