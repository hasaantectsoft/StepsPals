import {
    Atlas,
    Canvas,
    Skia,
    useImage,
    useRectBuffer,
  } from "@shopify/react-native-skia";
  import { useEffect, useRef } from "react";
  import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
  
  import { useSharedValue } from "react-native-reanimated";
  const { width, height } = Dimensions.get("window");
  
  const BALL_SIZE = width * 0.13;
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  let MoveTop = 129;
  const getIconSize = () => {
    if (SCREEN_WIDTH <= 375) {
      MoveTop = 115;
  
      return -7;
    }
    return 0;
  };
  
  const ICON_SIZE = getIconSize();

  const DEFAULT_SPRITE = require("../../assets/Sprites/Pets/Dino/Baby/Anim_Dino_Baby_Idle.png");

  export default function BallRollJSX({ spriteImage = DEFAULT_SPRITE, spriteFrameWidth = 34, spriteFrameHeight = 80, showBall = true }) {
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
  
        {/* Cat */}
        {/* <Image
          source={require("../assets/images/Cat.png")}
          style={styles.cat}
          resizeMode="contain"
        /> */}
        <AnimatedStyleUpdateExample
          spriteImage={spriteImage}
          spriteFrameWidth={spriteFrameWidth}
          spriteFrameHeight={spriteFrameHeight}
        />
      </View>
    );
  }
  
  function AnimatedStyleUpdateExample({ spriteImage = DEFAULT_SPRITE, spriteFrameWidth = 34, spriteFrameHeight = 80 }) {
    const counter = useSharedValue(0);
    useEffect(() => {
      const interval = setInterval(() => {
        counter.value = (counter.value + 1) % 31;
      }, 100);

      return () => clearInterval(interval);
    }, []);

    const spriteMap = useImage(spriteImage);

    const numberOfSprites = 1;
    const sprites = useRectBuffer(numberOfSprites, (rect, i) => {
      "worklet";
      let frameSelect;
      if (!counter) {
        frameSelect = 0;
      } else {
        frameSelect = 36 * Math.floor(counter.value);
      }
      rect.setXYWH(frameSelect + 1, 0, spriteFrameWidth, spriteFrameHeight);
    });
  
    const transforms = [Skia.RSXform(3, 0, MoveTop, ICON_SIZE)];
  
    return (
      <Canvas
        style={{
          flex: 0.5,
        }}
      >
        <Atlas image={spriteMap } sprites={sprites} transforms={transforms} />
      </Canvas>
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
  