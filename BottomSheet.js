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

// the minimum position of the bottom sheet, it won't move below that
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT / 4;

// the maximum position of the bottom sheet, it won't move above that
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 100;

// style your bottom sheet
const styles = StyleSheet.create({
  bottomSheet: {
    width: "100%",
    height: SCREEN_HEIGHT,
    top: SCREEN_HEIGHT,
    backgroundColor: "gray",
  },
});

const BottomSheet = () => {
  //translationY shared value from reanimated
  const translationY = useSharedValue(0);

  //context, previous value from translationY
  const context = useSharedValue(0);

  //optional
  const borderRadius = useSharedValue(25);

  //Gesture.Pan() from react native gesture handler
  const gesture = Gesture.Pan()
    //on gesture start store the translation.value in context.value
    .onStart(() => {
      context.value = translationY.value;
    })
    //on update set the translationY value to event.translationY + context.value;
    .onUpdate((event) => {
      //check to make sure the bottom sheet doesn't move below the MIN_TRANSLATE_Y value
      if (event.translationY + context.value < MIN_TRANSLATE_Y) {
        translationY.value = event.translationY + context.value;
        translationY.value = Math.max(MAX_TRANSLATE_Y, translationY.value);
      }
    })

    //here will will check for the swipe threshold
    //use event velocity to check if the swipe is up or down,

    .onEnd((event) => {
      // when the swipe is down the event velocity is positive
      // on pan gesture end check if the translationY.value is less than MAX_TRANSLATE_Y

      if (translationY.value > MAX_TRANSLATE_Y && event.velocityY > 0) {
        translationY.value = withSpring(MIN_TRANSLATE_Y, {
          damping: 30,
        });
        borderRadius.value = withTiming(25);
      }

      // when the swipe is up the event velocity is negative
      // on pan gesture end check if the translationY.value is greater than MAX_TRANSLATE_Y
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
