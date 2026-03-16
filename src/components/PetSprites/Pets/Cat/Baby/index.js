import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import { babycatsprites } from '../../../../../assets/Sprites/Pets/Cat';

const { width: SW } = Dimensions.get('window');

// ─── Base Component ──────────────────────────────────────────────────────────

export function CatBabySprite({
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
export function CatBabySprite_main(props) {
  return (
    <CatBabySprite
      spriteSheet={babycatsprites.catmain}
      frameWidth={31}
      frameHeight={32}
      frameCount={42}
      fps={12}
      {...props}
    />
  );
}

export function CatBabySprite_dead(props) {
  return (
    <CatBabySprite
      spriteSheet={babycatsprites.cat_dead}
      frameWidth={27}
      frameHeight={26}
      frameCount={1}
      fps={12}
      {...props}
    />
  );
}

export function CatBabySprite_sick(props) {
  return (
    <CatBabySprite
      spriteSheet={babycatsprites.catsick}
      frameWidth={31}
      frameHeight={31}
      frameCount={17}
      fps={12}
      {...props}
    />
  );
}

export function CatBabySprite_verysick(props) {
  return (
    <CatBabySprite
      spriteSheet={babycatsprites.catverysick}
      frameWidth={32}
      frameHeight={32}
      frameCount={17}
      fps={12}
      {...props}
    />
  );
}