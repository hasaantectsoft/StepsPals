import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { careActions } from '../../assets/CareActions';
import { styles } from './styles';

const { width: SW } = Dimensions.get('window');


export function CareActionSprite({
  spriteSheet,
  frameWidth,
  frameHeight,
  frameCount,
  fps = 12,
  spriteScale = 4,
  canvasWidth = SW,
  canvasHeight,
  offsetX,
  offsetY = 0,
  style,
  loop = true,
}) {
  const resolvedCanvasHeight = canvasHeight ?? frameHeight * spriteScale + 20;
  const resolvedOffsetX = offsetX ?? (SW - frameWidth * spriteScale) / 2;

  const progress = useSharedValue(0);

  useEffect(() => {
    const duration = (frameCount / fps) * 1000;

    if (loop) {
      progress.value = withRepeat(
        withTiming(frameCount, { duration, easing: Easing.linear }),
        -1,
      );
    } else {
      progress.value = withTiming(frameCount, { duration, easing: Easing.linear });
    }

    return () => cancelAnimation(progress);
  }, [fps, frameCount, loop]);

  const image = useImage(spriteSheet);

  const sprites = useRectBuffer(1, (rect) => {
    'worklet';
    const f = Math.floor(progress.value % frameCount);
    rect.setXYWH(f * frameWidth, 0, frameWidth, frameHeight);
  });

  const transforms = [Skia.RSXform(spriteScale, 0, resolvedOffsetX, offsetY)];

  if (!image) return null;

  return (
    <Canvas style={[{ width: canvasWidth, height: resolvedCanvasHeight }, styles.canvas, style]}>
      <Atlas image={image} sprites={sprites} transforms={transforms} sampling={{ filter: 0, mipmap: 0 }} />
    </Canvas>
  );
}

export function CleanPoopSprite(props) {
  return (
    <CareActionSprite
      spriteSheet={careActions.cleanpoop}
      frameWidth={52}
      frameHeight={47}
      frameCount={36}
      fps={12}
      loop={false}
      {...props}
    />
  );
}


export function DrinkWaterSprite(props) {
  return (
    <CareActionSprite
      spriteSheet={careActions.drinking}
      frameWidth={23}
      frameHeight={22}
      frameCount={29}
      fps={12}
      loop={false}
      {...props}
    />
  );
}

export function FeedingSprite(props) {
  return (
    <CareActionSprite
      spriteSheet={careActions.feeding}
      frameWidth={19}
      frameHeight={19}
      frameCount={7}
      fps={8}
      loop={false}
      {...props}
    />
  );
}

export function GivingTreatSprite(props) {
  return (
    <CareActionSprite
      spriteSheet={careActions.treat}
      frameWidth={41}
      frameHeight={37}
      frameCount={78}
      fps={12}
      loop={false}
      {...props}
    />
  );
}