import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import CustomDrawerContent from './CustomDrawerContent';
import { useThemeColors } from '../constants/useThemeColors';

const Drawer = createDrawerNavigator();

function SideMenu() {
  const theme = useThemeColors();

  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: theme.background
        },
      }}>
      <Drawer.Screen
        name="Main"
        component={StackNavigator}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

export default SideMenu;
