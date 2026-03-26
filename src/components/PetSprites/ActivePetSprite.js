import React from 'react';
import { useSelector } from 'react-redux';
import { getCondition } from '../../utils/petCondition';
import { getPetFeedingSpriteComponent, getPetSpriteComponent } from './petSpriteMap';
import { DinoBabySprite_main } from './Pets/Dino';

const BABY_SPRITE_MULT = 1.38;

/** Base scale passed from Home; hatch/tutorial use `getFixedBabySpriteScale()`. */
export const PET_HOME_SPRITE_BASE = 3.4;

export function getFixedBabySpriteScale() {
  return PET_HOME_SPRITE_BASE * BABY_SPRITE_MULT;
}

const getStage = (days) => {
  if (days <= 7) return 'baby';
  if (days <= 21) return 'teen';
  return 'adult';
};

/** Same scale as main pet — use for care/feeding overlay on Home. */
export function getPetDisplaySpriteScale(baseScale, petcreatedat) {
  const age = petcreatedat ? Math.floor((Date.now() - petcreatedat) / 86400000) : 0;
  return getStage(age) === 'baby' ? baseScale * BABY_SPRITE_MULT : baseScale;
}

export default function ActivePetSprite({ activeCareKey, spriteScale, ...rest }) {
  const { petkey, petcreatedat, missedDays } = useSelector((s) => s.petReducer);
  const ageInDays = petcreatedat ? Math.floor((Date.now() - petcreatedat) / 86400000) : 0;
  const stage = getStage(ageInDays);
  const condition = getCondition(missedDays ?? 0);
  const useFeeding = activeCareKey === 'feed' || activeCareKey === 'treat';
  const getSprite = useFeeding ? getPetFeedingSpriteComponent : getPetSpriteComponent;
  const SpriteComponent = getSprite(petkey, stage, condition) ?? DinoBabySprite_main;
  const scaled = getPetDisplaySpriteScale(spriteScale ?? 1, petcreatedat);
  return <SpriteComponent {...rest} spriteScale={scaled} />;
}
