import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import { babyDogsprites } from '../../../../../assets/Sprites/Pets/Dog';

const { width: SW } = Dimensions.get('window');

// ─── Base Component ──────────────────────────────────────────────────────────

export function DogBabySprite({
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
      <Atlas image={image} sprites={sprites} transforms={transforms} sampling={{ filter: 0, mipmap: 0 }} />
    </Canvas>
  );
}export function DogBabySprite_main(props) {
  return (
    <DogBabySprite
      spriteSheet={babyDogsprites.Dogmain}
      frameWidth={37}
      frameHeight={32}
      frameCount={23}
      fps={12}
      {...props}
    />
  );
}

export function DogBabySprite_dead(props) {
  return (
    <DogBabySprite
      spriteSheet={babyDogsprites.Dog_dead}
      frameWidth={29}
      frameHeight={26}
      frameCount={1}
      fps={12}
      {...props}
    />
  );
}

export function DogBabySprite_sick(props) {
  return (
    <DogBabySprite
      spriteSheet={babyDogsprites.Dogsick}
      frameWidth={37}
      frameHeight={32}
      frameCount={24}
      fps={12}
      {...props}
    />
  );
}

export function DogBabySprite_verysick(props) {
  return (
    <DogBabySprite
      spriteSheet={babyDogsprites.Dogverysick}
      frameWidth={37}
      frameHeight={31}
      frameCount={24}
      fps={12}
      {...props}
    />
  );
}

export function DogBabySprite_feeding(props) {
  return (
    <DogBabySprite
      spriteSheet={babyDogsprites.Dogfeeding}
      frameWidth={37}
      frameHeight={32}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DogBabySprite_sickfeeding(props) {
  return (
    <DogBabySprite
      spriteSheet={babyDogsprites.Dogsickfeeding}
      frameWidth={37}
      frameHeight={32}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DogBabySprite_verysickfeeding(props) {
  return (
    <DogBabySprite
      spriteSheet={babyDogsprites.Dogverysickfeeding}
      frameWidth={37}
      frameHeight={31}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}