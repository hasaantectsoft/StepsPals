import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import { adultDogsprites } from '../../../../../assets/Sprites/Pets/Dog';

const { width: SW } = Dimensions.get('window');

// ─── Base Component ──────────────────────────────────────────────────────────

export function DogAdultSprite({
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
}) {
  const resolvedCanvasHeight = canvasHeight ?? frameHeight * spriteScale + 20;
  const resolvedOffsetX = offsetX ?? (SW - frameWidth * spriteScale) / 2;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(frameCount, { duration: (frameCount / fps) * 1000, easing: Easing.linear }),
      -1,
    );
    return () => cancelAnimation(progress);
  }, [fps, frameCount]);

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
      <Atlas image={image} sprites={sprites} transforms={transforms} />
    </Canvas>
  );
}export function DogAdultSprite_main(props) {
  return (
    <DogAdultSprite
      spriteSheet={adultDogsprites.Dogmain}
      frameWidth={47}
      frameHeight={40}
      frameCount={28}
      fps={12}
      {...props}
    />
  );
}

export function DogAdultSprite_dead(props) {
  return (
    <DogAdultSprite
      spriteSheet={adultDogsprites.Dog_dead}
      frameWidth={39}
      frameHeight={35}
      frameCount={1}
      fps={12}
      {...props}
    />
  );
}

export function DogAdultSprite_sick(props) {
  return (
    <DogAdultSprite
      spriteSheet={adultDogsprites.Dogsick}
      frameWidth={44}
      frameHeight={40}
      frameCount={24}
      fps={12}
      {...props}
    />
  );
}

export function DogAdultSprite_verysick(props) {
  return (
    <DogAdultSprite
      spriteSheet={adultDogsprites.Dogverysick}
      frameWidth={44}
      frameHeight={40}
      frameCount={24}
      fps={12}
      {...props}
    />
  );
}

export function DogAdultSprite_feeding(props) {
  return (
    <DogAdultSprite
      spriteSheet={adultDogsprites.Dogfeeding}
      frameWidth={47}
      frameHeight={40}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DogAdultSprite_sickfeeding(props) {
  return (
    <DogAdultSprite
      spriteSheet={adultDogsprites.Dogsickfeeding}
      frameWidth={44}
      frameHeight={40}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DogAdultSprite_verysickfeeding(props) {
  return (
    <DogAdultSprite
      spriteSheet={adultDogsprites.Dogverysickfeeding}
      frameWidth={44}
      frameHeight={40}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}