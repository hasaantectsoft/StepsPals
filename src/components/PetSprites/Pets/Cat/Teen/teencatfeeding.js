import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { cancelAnimation, Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { styles } from './styles';
import { teencatsprites } from '../../../../../assets/Sprites/Pets/Cat';

const { width: SW } = Dimensions.get('window');
const PADDING_X = 2;
const PADDING_Y = 2;

// ─── Base Component ──────────────────────────────────────────────────────────

export function CatTeenSprite_Feedingbase({
  spriteSheet,
  frameWidth,
  frameHeight,
  frameCount,
  frameStart = 0,
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
    const f = frameStart + Math.floor(progress.value % frameCount);
    rect.setXYWH(PADDING_X + f * frameWidth, PADDING_Y, frameWidth, frameHeight);
  });

  const transforms = [Skia.RSXform(spriteScale, 0, resolvedOffsetX, offsetY)];

  if (!image) return null;

  return (
    <Canvas style={[{ width: canvasWidth, height: resolvedCanvasHeight }, styles.canvas, style]}>
      <Atlas image={image} sprites={sprites} transforms={transforms} sampling={{ filter: 0, mipmap: 0 }} />
    </Canvas>
  );
}


export function CatTeenSprite_Feeding(props) {
  return (
    <CatTeenSprite_Feedingbase
      spriteSheet={teencatsprites.catmain}
      frameWidth={40}
      frameHeight={38}
      frameStart={42}
      frameCount={17}
      fps={12}
      {...props}
    />
  );
}

