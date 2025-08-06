import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenProps from '../../types/ScreenProps';
import { CSS } from '../../constants/CSS';
import Loader from '../../components/Loader';
import Imageview from '../../components/Imageview';
import Images from '../../constants/Images';
import { Fonts } from '../../constants/Fonts';
import TabHeader from '../../components/TabHeader';
import Notification from '../../types/Notification';
import Request from '../../services/Request';
import MtToast from '../../constants/MtToast';
import Textview from '../../components/Textview';
import { Colors } from '../../constants/Colors';
import { isIos } from '../../constants/IsPlatform';
import NoData from '../../components/NoData';
import VirtualizedList from '../../components/VirtualizedList';
import Utils from '../../services/Utils';
import { useThemeColors } from '../../constants/useThemeColors';

const ImageSkelton: React.FC<{ item: Notification }> = (props) => {
  const { item } = props;

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      height: isIos ? 50 : 40,
      width: isIos ? 50 : 40,
      padding: 10,
      backgroundColor: Colors.dark_blue,
      borderRadius: 50,
      overflow: 'hidden'
    }}>

      <Text style={{
        color: Colors.white,
        fontSize: Fonts.fs_14
      }}>{
          (item.data.title || 'NT')
            .split(' ')
            .slice(0, 2)  // Only take the first two words
            .map((item: string) => item.charAt(0).toUpperCase())
            .join('')
        }</Text>
    </View>
  )
}

const Notifications: React.FC<ScreenProps<'Tabs'>> = props => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Array<Notification>>([]);
  const theme = useThemeColors();

  useEffect(() => {
    fetch_notifications();
  }, [])

  const fetch_notifications = () => {
    setIsLoading(true);

    Request.notifications((success, error) => {
      setIsLoading(false);
      console.log(success.data.map((item: Notification) => item.data))
      if (success) {
        setNotifications(success.data);
      } else {
        MtToast.error(error.message);
      }
    })
  }

  const renderItem_notificationList = useCallback(
    ({ item, index }: { item: Notification, index: number }) => (
      <View>
        <View style={{
          marginVertical: 10,
          flexDirection: 'row',
          alignItems: 'center'
        }}>

          {!Utils.isEmpty(item.data.image) ?

            <Imageview
              url={item.data.image}
              style={{
                width: isIos ? 50 : 40,
                height: isIos ? 50 : 40,
                marginTop: 7,
                borderRadius: 50,
                overflow: 'hidden',
                backgroundColor: '#B2B2B2'
              }}
            />
            :
            <ImageSkelton item={item} />
          }
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <Text
              style={{
                fontFamily: Fonts.regular,
                color: theme.text,
                fontSize: Fonts.fs_14
              }}
            >
              {item.data.title}
            </Text>

            <Text
              style={{
                fontFamily: Fonts.regular,
                color: theme.textDes,
                fontSize: Fonts.fs_12
              }}
            >
              {Utils.stripHtmlTags(item.data.description)}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontFamily: Fonts.regular,
            color: Colors.grey,
            fontSize: Fonts.fs_12,
            textAlign: 'right',
            marginBottom: isIos ? 5 : 5
          }}
        >
          {item.created_at}
        </Text>

        <View style={{ borderColor: Colors.grey, borderWidth: isIos ? 0.6 : 0.3, marginVertical: isIos ? 2 : 0, }} />
      </View>
    ), [notifications]);

  const keyExtractor_notificationList = (item: Notification, index: number) => index.toString();

  return (
    <View style={[CSS.Favcontainer, { paddingHorizontal: 15, backgroundColor: theme.background }]}>
      <TabHeader
        title="Notifications"
        navigation={props.navigation}
        hideSideMenuButton={true}

      />

      <Loader isLoading={isLoading} />

      <VirtualizedList>
        {
          notifications.length > 0 ?

            <FlatList
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={notifications}
              style={{
                marginTop: isIos ? 18 : 15,
                marginHorizontal: 10,
                marginBottom: isIos ? 80 : 65
              }}
              renderItem={renderItem_notificationList}
              keyExtractor={keyExtractor_notificationList}
            />

            :
            <View style={{ height: (Utils.DEVICE_HEIGHT - 150) }}>
              <NoData isLoading={isLoading} />
            </View>
        }
      </VirtualizedList>
    </View>
  );
};

export default Notifications;


