import { Text, View, CoverView } from "@tarojs/components";
import { CSSProperties } from "react";
import "./index.scss";

const Mask: React.FC<{ style?: CSSProperties }> = ({ children, style }) => {
  return (
    <View style={style} className="mask-wrapper">
      { children }
    </View>
  )
}

export default Mask;