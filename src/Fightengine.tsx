import { ICharacter } from "./Character";

export interface IGamestate {
  char1: ICharacter;
  char2: ICharacter;
  currStep: number;
  stepsList: number[];
  fightEnded: boolean;
  hp1: number;
  hp2: number;
  logs: IFightLogLine[];
}

export interface IFightLogLine {
  // textRepresentation: string;
  currHp1: number;
  currHp2: number;
  whoHit: string;
  currTime: number;
}

const multiplyDelaysWithNoFloatProblems = (
  num1: number,
  num2: number
): number => +((num1 * num2 * 100) / 100).toFixed(2);

// const divideDelaysWithNoFloatProblems = (num1: number, num2: number): number =>
//   +((num1 * 100) / (num2 * 100)).toFixed(2);

const moduloWithNoFloatProblems = (num1: number, num2: number): number =>
  (num1 * 100) % (num2 * 100);

const timeToHit = (currTime: number, delay: number): boolean =>
  moduloWithNoFloatProblems(currTime, delay) === 0;

export const Fightengine = {
  init: (char1: ICharacter, char2: ICharacter): IGamestate => ({
    char1: char1,
    char2: char2,
    currStep: 0,
    stepsList: new Array(200)
      .fill(null)
      .map((e, i): number =>
        multiplyDelaysWithNoFloatProblems(i + 1, char1.delay)
      )
      .concat(
        new Array(200)
          .fill(null)
          .map((e, i): number =>
            multiplyDelaysWithNoFloatProblems(i + 1, char2.delay)
          )
      )
      .sort((a, b) => a - b)
      .map((num) => +num.toFixed(2)),
    fightEnded: false,
    hp1: char1.hp,
    hp2: char2.hp,
    logs: [
      {
        currHp1: char1.hp,
        currHp2: char2.hp,
        whoHit: "",
        currTime: 0
        // textRepresentation: "Taistelu alkaa"
      }
    ]
  }),
  getNextStep: (state: IGamestate): IGamestate => {
    const newHp1 = timeToHit(state.stepsList[state.currStep], state.char2.delay)
      ? +(
          state.hp1 -
          state.char2.attackPower * (1 - state.char1.defencePower / 100)
        )
      : state.hp1;
    const newHp2 = timeToHit(state.stepsList[state.currStep], state.char1.delay)
      ? +(
          state.hp2 -
          state.char1.attackPower * (1 - state.char2.defencePower / 100)
        )
      : state.hp2;
    return {
      char1: state.char1,
      char2: state.char2,
      currStep: state.currStep + 1,
      stepsList: state.stepsList,
      fightEnded: Math.min(newHp1, newHp2) <= 0,
      hp1: newHp1,
      hp2: newHp2,
      logs: state.logs.concat({
        currHp1: newHp1,
        currHp2: newHp2,
        currTime: state.stepsList[state.currStep],
        whoHit:
          newHp1 !== state.hp1 && newHp2 !== state.hp2
            ? state.char1.name + ", " + state.char2.name
            : newHp1 !== state.hp1
            ? state.char2.name
            : state.char1.name
      })
    };
  }
};
