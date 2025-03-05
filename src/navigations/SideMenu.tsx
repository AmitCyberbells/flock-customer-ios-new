import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

function SideMenu() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
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
