
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
const { width, height } = Dimensions.get("window");
const BALL_SIZE = width * 0.13;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
export default function BallRollJSX({ showBall = true, children }) {
  const ballX = useRef(new Animated.Value(-BALL_SIZE)).current;
  useEffect(() => {
    let isMounted = true;

    const run = () => {
      if (!isMounted) return;

      ballX.setValue(-BALL_SIZE);

      Animated.timing(ballX, {
        toValue: width,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || !isMounted) return;

        setTimeout(() => {
          if (!isMounted) return;

          ballX.setValue(width);

          Animated.timing(ballX, {
            toValue: -BALL_SIZE,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished) {
              setTimeout(run, 1500);
            }
          });
        }, 1500);
      });
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  const spin = ballX.interpolate({
    inputRange: [-BALL_SIZE, width],
    outputRange: ["0deg", "1440deg"],
  });

  return (
    <View
      style={[
        styles.container,
        { height: SCREEN_WIDTH <= 375 ? height * 0.4 : height * 0.38 },
      ]}
    >
      {showBall && (
        <Animated.Image
          source={require("../../assets/images/Ball.png")}
          style={[styles.ball, { transform: [{ translateX: ballX }, { rotate: spin }] }]}
          resizeMode="contain"
        />
      )}


      <View style={{

        flex: 1,
      }}>
        {children}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",

    // backgroundColor: "green",
  },
  ball: {
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
  },
  cat: {
    position: "absolute",
    left: "50%",
    marginLeft: -(width * 0.25) / 2,
    width: width * 0.25,
    height: width * 0.25,
  },
});
