
export const createAppData = ({
    pet,
    steps,
   goal,
    care,
  }) => {
    return {
      petData: {
        name: pet.name,
        species: pet.species,
        maturity: pet.maturity,
        condition: pet.condition,
      },
      stepData: {
        currentSteps: steps,
        stepsGoal: goal,
      },
      careData: care,
      lastUpdated: new Date().toISOString(),
    };
  };