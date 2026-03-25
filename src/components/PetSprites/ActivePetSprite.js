import React from 'react';
import { useSelector } from 'react-redux';
import { getCondition } from '../../utils/petCondition';
import { getPetFeedingSpriteComponent, getPetSpriteComponent } from './petSpriteMap';
import { DinoBabySprite_main } from './Pets/Dino';

const getStage = (days) => {
  if (days <= 7) return 'baby';
  if (days <= 21) return 'teen';
  return 'adult';
};

export default function ActivePetSprite({ activeCareKey, ...props }) {
  const { petkey, petcreatedat, missedDays } = useSelector((s) => s.petReducer);
  const ageInDays = petcreatedat ? Math.floor((Date.now() - petcreatedat) / 86400000) : 0;
  const stage = getStage(ageInDays);
  const condition = getCondition(missedDays ?? 0);
  const useFeeding = activeCareKey === 'feed' || activeCareKey === 'treat';
  const getSprite = useFeeding ? getPetFeedingSpriteComponent : getPetSpriteComponent;
  const SpriteComponent = getSprite(petkey, stage, condition) ?? DinoBabySprite_main;
  return <SpriteComponent {...props} />;
}
