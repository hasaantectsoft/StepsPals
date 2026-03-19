// CatAdultSprite_Feeding.js (or add to your existing Cat sprite file)
import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import { adultcatsprites } from '../../../../../assets/Sprites/Pets/Cat';

const { width: SW } = Dimensions.get('window');
const PADDING_X = 2;
const PADDING_Y = 2;

export function CatAdultSprite_Feeding({
  frameWidth = 48,
  frameHeight = 42,
  frameStart = 45,
  frameCount = 18,
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

  const image = useImage(adultcatsprites.catmain);

  const sprites = useRectBuffer(1, (rect) => {
    'worklet';
    const f = frameStart + Math.floor(progress.value % frameCount);
    rect.setXYWH(PADDING_X + f * frameWidth, PADDING_Y, frameWidth, frameHeight);
  });

  const transforms = [Skia.RSXform(spriteScale, 0, resolvedOffsetX, offsetY)];

  if (!image) return null;

  return (
    <Canvas style={[{ width: canvasWidth, height: resolvedCanvasHeight }, styles.canvas, style]}>
      <Atlas image={image} sprites={sprites} transforms={transforms} sampling={{ B: 0, C: 0 }} />
    </Canvas>
  );
}