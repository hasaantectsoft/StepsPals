import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
const { width: SW } = Dimensions.get('window');
import { adultcatsprites } from '../../../../../assets/Sprites/Pets/Cat';
// ─── Base Component ──────────────────────────────────────────────────────────

export function CatAdultSprite({
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
}export function CatAdultSprite_main(props) {
  return (
    <CatAdultSprite
      spriteSheet={adultcatsprites.catmain}
      frameWidth={48}
      frameHeight={42}
      frameCount={45}
      fps={12}
      {...props}
    />
  );
}

export function CatAdultSprite_dead(props) {
  return (
    <CatAdultSprite
      spriteSheet={adultcatsprites.cat_dead}
      frameWidth={46}
      frameHeight={34}
      frameCount={1}
      fps={12}
      {...props}
    />
  );
}

export function CatAdultSprite_sick(props) {
  return (
    <CatAdultSprite
      spriteSheet={adultcatsprites.catsick}
      frameWidth={48}
      frameHeight={42}
      frameCount={23}
      fps={12}
      {...props}
    />
  );
}

export function CatAdultSprite_verysick(props) {
  return (
    <CatAdultSprite
      spriteSheet={adultcatsprites.catverysick}
      frameWidth={50}
      frameHeight={42}
      frameCount={23}
      fps={12}
      {...props}
    />
  );
}