export const getCondition = (missedDays) => {
  if (missedDays >= 3) return 'Dead';
  if (missedDays === 2) return 'Very Sick';
  if (missedDays === 1) return 'Sick';
  return 'Healthy';
};

export const getSpriteByCondition = (spriteSet, petkey, condition) => {
  const key = String(petkey);

  const conditionMap = {
    '1': { Healthy: 'Dogmain',    Sick: 'Dogsick',    'Very Sick': 'Dogverysick',    Dead: 'Dog_dead'  },
    '2': { Healthy: 'catmain',    Sick: 'catsick',    'Very Sick': 'catverysick',    Dead: 'cat_dead'  },
    '3': { Healthy: 'dinomain',   Sick: 'dinosick',   'Very Sick': 'dinoverysick',   Dead: 'dino_dead' },
  };

  const spriteKey = conditionMap[key]?.[condition] ?? conditionMap[key]?.Healthy;
  return spriteSet?.[spriteKey] ?? spriteSet?.[Object.keys(spriteSet)[0]];
};
