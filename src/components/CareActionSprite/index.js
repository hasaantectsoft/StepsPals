import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { careActions } from '../../assets/CareActions';
import { styles } from './styles';

const { width: SW } = Dimensions.get('window');

// ─── Base Component ──────────────────────────────────────────────────────────

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

// ─── Pre-configured Care Action Sprites ──────────────────────────────────────

// 1824 × 51 px → 32 frames × 57 px
export function CleanPoopSprite(props) {
  return (
    <CareActionSprite
      spriteSheet={careActions.cleanpoop}
      frameWidth={100}
      frameHeight={100}
      frameCount={64}
      fps={20}
      {...props}
    />
  );
}

// 671 × 26 px → 14 frames × 46 px
export function DrinkWaterSprite(props) {
  return (
    <CareActionSprite
      spriteSheet={careActions.drinking}
      frameWidth={46}
      frameHeight={26}
      
      frameCount={14}
      fps={10}
      {...props}
    />
  );
}

// 137 × 19 px → 7 frames × 19 px
export function FeedingSprite(props) {
  return (
    <CareActionSprite
      spriteSheet={careActions.feeding}
      frameWidth={19}
      frameHeight={19}
      frameCount={7}
      fps={8}
      {...props}
    />
  );
}

// 2585 × 41 px → 55 frames × 47 px
export function GivingTreatSprite(props) {
  return (
    <CareActionSprite
      spriteSheet={careActions.treat}
      frameWidth={47}
      frameHeight={41}
      frameCount={55}
      fps={14}
      {...props}
    />
  );
}
