import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import { babydinosprites } from '../../../../../assets/Sprites/Pets/Dino';
const { width: SW } = Dimensions.get('window');

// ─── Base Component ──────────────────────────────────────────────────────────

export function DinoBabySprite({
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
}

export function DinoBabySprite_main(props) {
  return (
    <DinoBabySprite
      spriteSheet={babydinosprites.dinomain}
      frameWidth={36}
      frameHeight={33}
      frameCount={31}
      fps={12}
      {...props}
    />
  );
}

export function DinoBabySprite_dead(props) {
  return (
    <DinoBabySprite
      spriteSheet={babydinosprites.dino_dead}
      frameWidth={29}
      frameHeight={27}
      frameCount={1}
      fps={12}
      {...props}
    />
  );
}

export function DinoBabySprite_sick(props) {
  return (
    <DinoBabySprite
      spriteSheet={babydinosprites.dinosick}
      frameWidth={33}
      frameHeight={33}
      frameCount={26}
      fps={12}
      {...props}
    />
  );
}

export function DinoBabySprite_verysick(props) {
  return (
    <DinoBabySprite
      spriteSheet={babydinosprites.dinoverysick}
      frameWidth={33}
      frameHeight={33}
      frameCount={26}
      fps={12}
      {...props}
    />
  );
}

export function DinoBabySprite_feeding(props) {
  return (
    <DinoBabySprite
      spriteSheet={babydinosprites.dinofeeding}
      frameWidth={36}
      frameHeight={33}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DinoBabySprite_sickfeeding(props) {
  return (
    <DinoBabySprite
      spriteSheet={babydinosprites.dinosickfeeding}
      frameWidth={33}
      frameHeight={33}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DinoBabySprite_verysickfeeding(props) {
  return (
    <DinoBabySprite
      spriteSheet={babydinosprites.dinoverysickfeeding}
      frameWidth={33}
      frameHeight={33}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}