import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import {  teenDogsprites } from '../../../../../assets/Sprites/Pets/Dog';

const { width: SW } = Dimensions.get('window');

// ─── Base Component ──────────────────────────────────────────────────────────

export function DogTeenSprite({
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
      <Atlas image={image} sprites={sprites} transforms={transforms} sampling={{ B: 0, C: 0 }} />
    </Canvas>
  );
}
export function DogTeenSprite_main(props) {
  return (
    <DogTeenSprite
      spriteSheet={teenDogsprites.Dogmain}
      frameWidth={41}
      frameHeight={39}
      frameCount={23}
      fps={12}
      {...props}
    />
  );
}

export function DogTeenSprite_dead(props) {
  return (
    <DogTeenSprite
      spriteSheet={teenDogsprites.Dog_dead}
      frameWidth={33}
      frameHeight={32}
      frameCount={1}
      fps={12}
      {...props}
    />
  );
}

export function DogTeenSprite_sick(props) {
  return (
    <DogTeenSprite
      spriteSheet={teenDogsprites.Dogsick}
      frameWidth={41}
      frameHeight={38}
      frameCount={23}
      fps={12}
      {...props}
    />
  );
}

export function DogTeenSprite_verysick(props) {
  return (
    <DogTeenSprite
      spriteSheet={teenDogsprites.Dogverysick}
      frameWidth={41}
      frameHeight={38}
      frameCount={23}
      fps={12}
      {...props}
    />
  );
}

export function DogTeenSprite_feeding(props) {
  return (
    <DogTeenSprite
      spriteSheet={teenDogsprites.Dogfeeding}
      frameWidth={41}
      frameHeight={39}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DogTeenSprite_sickfeeding(props) {
  return (
    <DogTeenSprite
      spriteSheet={teenDogsprites.Dogsickfeeding}
      frameWidth={41}
      frameHeight={38}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DogTeenSprite_verysickfeeding(props) {
  return (
    <DogTeenSprite
      spriteSheet={teenDogsprites.Dogverysickfeeding}
      frameWidth={41}
      frameHeight={38}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}