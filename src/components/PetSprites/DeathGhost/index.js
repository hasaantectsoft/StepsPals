import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import { catghost } from '../../../assets/Sprites/Pets/Cat';
import { Dogghost } from '../../../assets/Sprites/Pets/Dog';
import { dinoghost } from '../../../assets/Sprites/Pets/Dino';
const { width: SW } = Dimensions.get('window');

// ─── Base Component ──────────────────────────────────────────────────────────

export function AllDeathGhostSprite({
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
const ghostFrame = { frameWidth: 27, frameHeight: 31, frameCount: 17, fps: 12 };

export function DeathGhostSprite({ spriteSheet = catghost, ...props }) {
  return <AllDeathGhostSprite spriteSheet={spriteSheet} {...ghostFrame} {...props} />;
}

export function CatDeathGhostSprite(props) {
  return <DeathGhostSprite spriteSheet={catghost} {...props} />;
}

export function DogDeathGhostSprite(props) {
  return <DeathGhostSprite spriteSheet={Dogghost} {...props} />;
}

export function DinoDeathGhostSprite(props) {
  return <DeathGhostSprite spriteSheet={dinoghost} {...props} />;
}