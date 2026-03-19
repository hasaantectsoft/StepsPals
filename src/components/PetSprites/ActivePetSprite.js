import React from 'react';
import { useSelector } from 'react-redux';
import { getCondition } from '../../utils/petCondition';
import { getPetSpriteComponent } from './petSpriteMap';
import { DinoBabySprite_main } from './Pets/Dino';

const getStage = (days) => {
  if (days <= 7) return 'baby';
  if (days <= 21) return 'teen';
  return 'adult';
};

export default function ActivePetSprite(props) {
  const { petkey, petcreatedat, missedDays } = useSelector((s) => s.petReducer);
  const ageInDays = petcreatedat
    ? Math.floor((Date.now() - petcreatedat) / 86400000)
    : 0;
  const stage = getStage(ageInDays);
  const condition = getCondition(missedDays ?? 0);
  const SpriteComponent = getPetSpriteComponent(petkey, stage, condition) ?? DinoBabySprite_main;
  return <SpriteComponent {...props} />;
}
