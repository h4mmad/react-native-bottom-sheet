import React, { useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const MIN_TRANSLATE_Y = -SCREEN_HEIGHT / 4;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 100;

const styles = StyleSheet.create({
  bottomSheet: {
    width: "100%",
    height: SCREEN_HEIGHT,
    top: SCREEN_HEIGHT,
    backgroundColor: "gray",
  },
});

const BottomSheet = () => {
  const translationY = useSharedValue(0);
  const context = useSharedValue(0);
  const borderRadius = useSharedValue(25);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = translationY.value;
    })
    .onUpdate((event) => {
      if (event.translationY + context.value < MIN_TRANSLATE_Y) {
        translationY.value = event.translationY + context.value;
        translationY.value = Math.max(MAX_TRANSLATE_Y, translationY.value);
      }
    })
    .onEnd((event) => {
      if (translationY.value > MAX_TRANSLATE_Y && event.velocityY > 0) {
        translationY.value = withSpring(MIN_TRANSLATE_Y, {
          damping: 30,
        });
        borderRadius.value = withTiming(25);
      }

      if (translationY.value < MIN_TRANSLATE_Y && event.velocityY - 30 < 0) {
        translationY.value = withSpring(MAX_TRANSLATE_Y, { damping: 30 });
        borderRadius.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderRadius: borderRadius.value,
      transform: [
        {
          translateY: translationY.value,
        },
      ],
    };
  });

  useEffect(() => {
    translationY.value = withSpring(MIN_TRANSLATE_Y, { damping: 30 });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, animatedStyle]} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default BottomSheet;
