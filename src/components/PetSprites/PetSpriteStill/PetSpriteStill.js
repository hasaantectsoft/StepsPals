import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { Atlas, Canvas, Skia, useImage, useRectBuffer } from '@shopify/react-native-skia';
import { adultDogsprites, babyDogsprites, teenDogsprites } from '../../../assets/Sprites/Pets/Dog';
import { adultcatsprites, babycatsprites, teencatsprites } from '../../../assets/Sprites/Pets/Cat';
import { adultdinosprites, babydinosprites, teendinosprites } from '../../../assets/Sprites/Pets/Dino';
import { getSpriteByCondition } from '../../../utils/petCondition';
import { styles } from './Styles';

const { width: SW } = Dimensions.get('window');

const STAGES = ['baby', 'teen', 'adult'];
const CONDITIONS = ['Healthy', 'Sick', 'Very Sick', 'Dead'];

const SPRITESET_MAP = {
  '1': { baby: babyDogsprites, teen: teenDogsprites, adult: adultDogsprites },
  '2': { baby: babycatsprites, teen: teencatsprites, adult: adultcatsprites },
  '3': { baby: babydinosprites, teen: teendinosprites, adult: adultdinosprites },
};

const META = {
  '1': {
    baby: {
      Healthy: { w: 37, h: 32 },
      Sick: { w: 37, h: 32 },
      'Very Sick': { w: 37, h: 31 },
      Dead: { w: 29, h: 26 },
    },
    teen: {
      Healthy: { w: 41, h: 39 },
      Sick: { w: 41, h: 38 },
      'Very Sick': { w: 41, h: 38 },
      Dead: { w: 33, h: 32 },
    },
    adult: {
      Healthy: { w: 47, h: 40 },
      Sick: { w: 44, h: 40 },
      'Very Sick': { w: 44, h: 40 },
      Dead: { w: 39, h: 35 },
    },
  },
  '2': {
    baby: {
      Healthy: { w: 31, h: 32 },
      Sick: { w: 31, h: 31 },
      'Very Sick': { w: 32, h: 32 },
      Dead: { w: 27, h: 26 },
    },
    teen: {
      Healthy: { w: 40, h: 38 },
      Sick: { w: 40, h: 38 },
      'Very Sick': { w: 43, h: 35 },
      Dead: { w: 39, h: 30 },
    },
    adult: {
      Healthy: { w: 48, h: 42 },
      Sick: { w: 48, h: 42 },
      'Very Sick': { w: 50, h: 42 },
      Dead: { w: 46, h: 34 },
    },
  },
  '3': {
    baby: {
      Healthy: { w: 36, h: 33 },
      Sick: { w: 33, h: 33 },
      'Very Sick': { w: 33, h: 33 },
      Dead: { w: 29, h: 27 },
    },
    teen: {
      Healthy: { w: 42, h: 39 },
      Sick: { w: 40, h: 38 },
      'Very Sick': { w: 40, h: 38 },
      Dead: { w: 34, h: 32 },
    },
    adult: {
      Healthy: { w: 50, h: 44 },
      Sick: { w: 48, h: 43 },
      'Very Sick': { w: 48, h: 43 },
      Dead: { w: 39, h: 36 },
    },
  },
};

function normalizePetKey(petkey) {
  const key = String(petkey ?? '').trim();
  return SPRITESET_MAP[key] ? key : '3';
}

function normalizeStage(stage) {
  return STAGES.includes(stage) ? stage : 'baby';
}

function normalizeCondition(condition) {
  return CONDITIONS.includes(condition) ? condition : 'Healthy';
}

export default function PetSpriteStill({
  petkey,
  stage,
  condition,
  size,
  canvasWidth = SW,
  offsetX,
  offsetY = 0,
  style,
}) {
  const key = normalizePetKey(petkey);
  const s = normalizeStage(stage);
  const c = normalizeCondition(condition);

  const meta = META[key]?.[s]?.[c] ?? META['3'].baby.Healthy;
  const spriteSet = SPRITESET_MAP[key]?.[s];
  const spriteSheet = getSpriteByCondition(spriteSet, key, c);

  const { frameWidth, frameHeight, spriteScale, canvasHeight, resolvedOffsetX } = useMemo(() => {
    const frameWidth = meta.w;
    const frameHeight = meta.h;
    const spriteScale = size ? size / frameWidth : 4;
    const canvasHeight = size ? frameHeight * spriteScale : frameHeight * spriteScale + 20;
    const resolvedOffsetX = offsetX ?? (canvasWidth - frameWidth * spriteScale) / 2;
    return { frameWidth, frameHeight, spriteScale, canvasHeight, resolvedOffsetX };
  }, [canvasWidth, meta.h, meta.w, offsetX, size]);

  const image = useImage(spriteSheet);
  const sprites = useRectBuffer(1, (rect) => {
    'worklet';
    rect.setXYWH(0, 0, frameWidth, frameHeight);
  });
  const transforms = [Skia.RSXform(spriteScale, 0, resolvedOffsetX, offsetY)];

  if (!image) return null;

  return (
    <Canvas style={[{ width: canvasWidth, height: canvasHeight }, styles.canvas, style]}>
      <Atlas image={image} sprites={sprites} transforms={transforms} sampling={{ B: 0, C: 0 }} />
    </Canvas>
  );
}

