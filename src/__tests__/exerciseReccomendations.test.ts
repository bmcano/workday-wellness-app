import { applyExercises, splitUpMisc, splitUpStretches } from '../util/exerciseReccomendations.ts';

describe('applyExercises', () => {
  const exercises: string[] = [];
  const mode: number[] = [1, 3, 3];
  const exerciseArray: string[] = ['test', 'other test', 'extra test'];

  test('with enough exercises available', () => {
    applyExercises(exerciseArray, mode, exercises);
    expect(exercises.length).toBe(mode[0]);
  });

  test('with fewer exercises available than assigned', () => {
    const mode2: number[] = [2, 3, 3];
    const exerciseArray2: string[] = ['test'];
    const exercises2: string[] = [];
    applyExercises(exerciseArray2, mode2, exercises2);
    expect(exercises2.length).toBe(1);
    expect(mode2[1]).toBe(5);
  });

  test('with no exercises available', () => {
    const exerciseArray3: string[] = [];
    applyExercises(exerciseArray3, mode, exercises);
    expect(mode[1]).toBe(5);
  });
});

describe('splitUpStretches', () => {
  const exercises: string[] = [];
  const mode: number[] = [1, 3, 3];
  const backStretch: string[] = ['back test', 'back other test', 'back extra test'];
  const neckStretch: string[] = ['neck test', 'neck other test', 'neck extra test'];
  const wristStretch: string[] = ['wrist test', 'wrist other test', 'wrist extra test'];
  const miscArray: string[] = ['misc test', 'misc other test', 'misc extra test'];

  test('with base and no remainder', () => {
    const modeWithoutRemainder: number[] = [1, 3, 0];
    splitUpStretches(modeWithoutRemainder, backStretch, neckStretch, wristStretch, exercises);
    expect(exercises.length).toBe(modeWithoutRemainder[1]);
  });

  test('with base and remainder 1', () => {
    const exercises: string[] = [];
    splitUpStretches(mode, backStretch, neckStretch, wristStretch, exercises);
    expect(exercises.length).toBe(mode[1]);
  });

  test('with base and remainder 2', () => {
    const exercises: string[] = [];
    const modeWithRemainder2: number[] = [1, 2, 0];
    splitUpStretches(modeWithRemainder2, backStretch, neckStretch, wristStretch, exercises);
    expect(exercises.length).toBe(modeWithRemainder2[1]);
  });

  test('with no stretches available', () => {
    const exercises: string[] = [];
    const backStretchEmpty: string[] = [];
    const neckStretchEmpty: string[] = [];
    const wristStretchEmpty: string[] = [];
    splitUpStretches(mode, backStretchEmpty, neckStretchEmpty, wristStretchEmpty, exercises);
    expect(exercises.length).toBe(0);
  });
});

describe('splitUpMisc', () => {
  const exercises: string[] = [];
  const mode: number[] = [1, 3, 3];
  const miscArray: string[] = ['misc test', 'misc other test', 'misc extra test'];

  test('with misc exercises available', () => {
    splitUpMisc(miscArray, mode, exercises);
    expect(exercises.length).toBe(mode[2]);
  });

  test('with no misc exercises available', () => {
    const exercises: string[] = [];
    const miscArrayEmpty: string[] = [];
    splitUpMisc(miscArrayEmpty, mode, exercises);
    expect(exercises.length).toBe(0);
  });
});
