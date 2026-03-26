import { NativeModules, Platform } from "react-native";
import { createAppData } from "../types/AppData";
import { getCondition } from "./petCondition";

const PET_KEY_TO_SPECIES = {
  "1": "Dog",
  "2": "Cat",
  "3": "Dino",
};

export function maturityFromCreatedAt(createdAtMs) {
  if (createdAtMs == null) return "Baby";
  const days = Math.floor((Date.now() - createdAtMs) / 86400000);
  if (days <= 7) return "Baby";
  if (days <= 21) return "Teen";
  return "Adult";
}

export function conditionKeyForWidget(missedDays) {
  const c = getCondition(missedDays ?? 0);
  if (c === "Very Sick") return "VerySick";
  return c;
}

/**
 * Maps RetroStepsBar internal states (0=locked, 1=unlocked, 2=done) + star to Swift CareStatus strings.
 */
export function carePayloadFromBar({ boul, wat, pop, starTapped, step, goal }) {
  const st = (n) => (n >= 2 ? "completed" : n >= 1 ? "pending" : "disabled");
  const goalN = Number(goal) || 1;
  const stepN = Number(step) || 0;
  const complete = goalN > 0 && stepN >= goalN;
  const baseDone = boul >= 2 && wat >= 2 && pop >= 2;
  let giveTreat = "disabled";
  if (starTapped) giveTreat = "completed";
  else if (complete && baseDone) giveTreat = "pending";

  return {
    feed: st(boul),
    giveWater: st(wat),
    cleanPoop: st(pop),
    giveTreat,
  };
}

/**
 * Pushes home snapshot to the iOS widget app group (`appData` JSON).
 */
export function syncIOSWidgetFromHomeState(state, careBar) {
  if (Platform.OS !== "ios" || !NativeModules.StepWidget?.updateAppData) return;

  const pet = state.petReducer;
  const progress = state.progressReducer;
  if (pet?.petcreatedat == null) return;

  const species = PET_KEY_TO_SPECIES[String(pet.petkey)] || "Dino";
  const care = carePayloadFromBar({
    boul: careBar.boul,
    wat: careBar.wat,
    pop: careBar.pop,
    starTapped: careBar.starTapped,
    step: progress?.step ?? 0,
    goal: pet.petsteps ?? 1,
  });

  const payload = createAppData({
    pet: {
      name: pet.petname || "Pet",
      species,
      maturity: maturityFromCreatedAt(pet.petcreatedat),
      condition: conditionKeyForWidget(pet.missedDays ?? 0),
    },
    steps: Math.round(Number(progress?.step) || 0),
    goal: Math.max(1, Math.round(Number(pet.petsteps) || 1)),
    care,
  });

  NativeModules.StepWidget.updateAppData(JSON.stringify(payload));
}

export function mergeIOSWidgetStepsOnly(steps) {
  if (Platform.OS !== "ios" || !NativeModules.StepWidget?.updateSteps) return;
  NativeModules.StepWidget.updateSteps(Math.round(Number(steps) || 0));
}
