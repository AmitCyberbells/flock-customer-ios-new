import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from './Colors';

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DarkTheme : LightTheme;
};