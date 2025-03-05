import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Dimensions,
    GestureResponderEvent,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Icon from '@react-native-vector-icons/fontawesome6';

const { height } = Dimensions.get('window');

interface BottomDrawerProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
    visible,
    onClose,
    children,
}) => {
    const translateY = useSharedValue(height);

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.out(Easing.exp),
            });
        } else {
            translateY.value = withTiming(height, {
                duration: 300,
                easing: Easing.in(Easing.exp),
            });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationY > 0) {
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            if (event.translationY > height * 0.3) {
                // Call onClose on the JS thread using runOnJS
                translateY.value = withTiming(height, {
                    duration: 300,
                    easing: Easing.in(Easing.exp),
                });
                setTimeout(onClose, 300);
            } else {
                translateY.value = withTiming(0, {
                    duration: 300,
                    easing: Easing.out(Easing.exp),
                });
            }
        });

    const handleBackdropPress = (event: GestureResponderEvent) => {
        event.stopPropagation();
        translateY.value = withTiming(height, {
            duration: 300,
            easing: Easing.in(Easing.exp),
        }, (finished) => {
            if (finished) onClose();
        });
    };

    return (
        <Animated.View
            style={[
                styles.overlay,
                { opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' },
            ]}
        >
            <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.drawer, animatedStyle]}>
                    <View style={styles.header}>
                        <Pressable
                            onPress={() => {
                                translateY.value = withTiming(height, {
                                    duration: 300,
                                    easing: Easing.in(Easing.exp),
                                }, (finished) => {
                                    if (finished) onClose();
                                });
                            }}
                            style={styles.closeButton}
                        >
                            <Icon name="circle-xmark" />
                        </Pressable>
                    </View>
                    <View style={styles.content}>{children}</View>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
};

export default BottomDrawer;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    drawer: {
        height: height * 0.5,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    header: {
        height: 50,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    closeButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 16,
    },
});
