import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { careActions } from '../../assets/CareActions';
import { styles } from './styles';
import { teendinosprites } from '../../../../../assets/Sprites/Pets/Dino';

const { width: SW } = Dimensions.get('window');

// ─── Base Component ──────────────────────────────────────────────────────────

export function DinoTeenSprite({
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
}export function DinoTeenSprite_main(props) {
  return (
    <DinoTeenSprite
      spriteSheet={teendinosprites.dinomain}
      frameWidth={42}
      frameHeight={39}
      frameCount={33}
      fps={12}
      {...props}
    />
  );
}

export function DinoTeenSprite_dead(props) {
  return (
    <DinoTeenSprite
      spriteSheet={teendinosprites.dino_dead}
      frameWidth={34}
      frameHeight={32}
      frameCount={1}
      fps={12}
      {...props}
    />
  );
}

export function DinoTeenSprite_sick(props) {
  return (
    <DinoTeenSprite
      spriteSheet={teendinosprites.dinosick}
      frameWidth={40}
      frameHeight={38}
      frameCount={25}
      fps={12}
      {...props}
    />
  );
}

export function DinoTeenSprite_verysick(props) {
  return (
    <DinoTeenSprite
      spriteSheet={teendinosprites.dinoverysick}
      frameWidth={40}
      frameHeight={38}
      frameCount={25}
      fps={12}
      {...props}
    />
  );
}

export function DinoTeenSprite_feeding(props) {
  return (
    <DinoTeenSprite
      spriteSheet={teendinosprites.dinofeeding}
      frameWidth={42}
      frameHeight={39}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DinoTeenSprite_sickfeeding(props) {
  return (
    <DinoTeenSprite
      spriteSheet={teendinosprites.dinosickfeeding}
      frameWidth={40}
      frameHeight={38}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}

export function DinoTeenSprite_verysickfeeding(props) {
  return (
    <DinoTeenSprite
      spriteSheet={teendinosprites.dinoverysickfeeding}
      frameWidth={40}
      frameHeight={38}
      frameCount={18}
      fps={12}
      {...props}
    />
  );
}