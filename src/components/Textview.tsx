import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleProp,
  TextStyle,
} from 'react-native';
import Utils from '../services/Util';

interface TextviewProps {
  text_click?: () => void;
  active_opacity?: number;
  style?: StyleProp<TextStyle>;
  text: string;
  lines?: number;
  pt_key?: number | string
}

const Textview: React.FC<TextviewProps> = (props) => {
  const { text_click = () => {}, active_opacity = 1, style, text, lines, pt_key = '' } = props;

  return (
    <TouchableOpacity key={Utils.generateUniqueString()+pt_key} onPress={text_click} activeOpacity={active_opacity}>
      <Text key={Utils.generateUniqueString()+pt_key} style={style} numberOfLines={lines}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Textview;
