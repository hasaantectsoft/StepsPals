import {
  CatAdultSprite_dead,
  CatAdultSprite_main,
  CatAdultSprite_sick,
  CatAdultSprite_verysick,
  CatBabySprite_dead,
  CatBabySprite_main,
  CatBabySprite_sick,
  CatBabySprite_verysick,
  CatTeenSprite_dead,
  CatTeenSprite_main,
  CatTeenSprite_sick,
  CatTeenSprite_verysick,
} from './Pets/Cat';
import {
  DogAdultSprite_dead,
  DogAdultSprite_main,
  DogAdultSprite_sick,
  DogAdultSprite_verysick,
  DogBabySprite_dead,
  DogBabySprite_main,
  DogBabySprite_sick,
  DogBabySprite_verysick,
  DogTeenSprite_dead,
  DogTeenSprite_main,
  DogTeenSprite_sick,
  DogTeenSprite_verysick,
} from './Pets/Dog';
import {
  DinoAdultSprite_dead,
  DinoAdultSprite_main,
  DinoAdultSprite_sick,
  DinoAdultSprite_verysick,
  DinoBabySprite_dead,
  DinoBabySprite_main,
  DinoBabySprite_sick,
  DinoBabySprite_verysick,
  DinoTeenSprite_dead,
  DinoTeenSprite_main,
  DinoTeenSprite_sick,
  DinoTeenSprite_verysick,
} from './Pets/Dino';
import { DeathGhostSprite } from './DeathGhost';

const DOG = {
  baby: { main: DogBabySprite_main, sick: DogBabySprite_sick, verysick: DogBabySprite_verysick, dead: DogBabySprite_dead },
  teen: { main: DogTeenSprite_main, sick: DogTeenSprite_sick, verysick: DogTeenSprite_verysick, dead: DogTeenSprite_dead },
  adult: { main: DogAdultSprite_main, sick: DogAdultSprite_sick, verysick: DogAdultSprite_verysick, dead: DogAdultSprite_dead },
  ghost: DeathGhostSprite,
};
const CAT = {
  baby: { main: CatBabySprite_main, sick: CatBabySprite_sick, verysick: CatBabySprite_verysick, dead: CatBabySprite_dead },
  teen: { main: CatTeenSprite_main, sick: CatTeenSprite_sick, verysick: CatTeenSprite_verysick, dead: CatTeenSprite_dead },
  adult: { main: CatAdultSprite_main, sick: CatAdultSprite_sick, verysick: CatAdultSprite_verysick, dead: CatAdultSprite_dead },
  ghost: DeathGhostSprite,
};
const DINO = {
  baby: { main: DinoBabySprite_main, sick: DinoBabySprite_sick, verysick: DinoBabySprite_verysick, dead: DinoBabySprite_dead },
  teen: { main: DinoTeenSprite_main, sick: DinoTeenSprite_sick, verysick: DinoTeenSprite_verysick, dead: DinoTeenSprite_dead },
  adult: { main: DinoAdultSprite_main, sick: DinoAdultSprite_sick, verysick: DinoAdultSprite_verysick, dead: DinoAdultSprite_dead },
  ghost: DeathGhostSprite,
};

const PET_MAP = { '1': DOG, '2': CAT, '3': DINO };
const CONDITION_KEY = { Healthy: 'main', Sick: 'sick', 'Very Sick': 'verysick', Dead: 'dead' };

export function getPetSpriteComponent(petkey, stage, condition) {
  const key = String(petkey ?? '').trim() || '3';
  const pet = PET_MAP[key] ?? DINO;
  const normalizedStage = ['baby', 'teen', 'adult'].includes(stage) ? stage : 'baby';
  const condKey = CONDITION_KEY[condition] ?? 'main';
  return pet[normalizedStage]?.[condKey] ?? pet.baby.main;
}

/** Use when pet is dead: returns ghost component for current pet (show thora upar pet ke). */
export function getPetDeathGhostComponent(petkey) {
  const key = String(petkey ?? '').trim() || '3';
  const pet = PET_MAP[key] ?? DINO;
  return pet.ghost;
}
