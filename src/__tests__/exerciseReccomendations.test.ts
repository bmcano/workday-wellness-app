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
    const exerciseArray2: string[] = ['test'];
    applyExercises(exerciseArray2, mode, exercises);
    expect(exercises.length).toBe(mode[0]);
    expect(mode[1]).toBe(2);
  });

  test('with no exercises available', () => {
    const exerciseArray3: string[] = [];
    applyExercises(exerciseArray3, mode, exercises);
    expect(mode[1]).toBe(6);
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
    splitUpStretches(mode, backStretch, neckStretch, wristStretch, exercises);
    expect(exercises.length).toBe(mode[1] + 1);
  });

  test('with base and remainder 2', () => {
    const modeWithRemainder2: number[] = [1, 2, 0];
    splitUpStretches(modeWithRemainder2, backStretch, neckStretch, wristStretch, exercises);
    expect(exercises.length).toBe(modeWithRemainder2[1] + 2);
  });

  test('with no stretches available', () => {
    const backStretchEmpty: string[] = [];
    const neckStretchEmpty: string[] = [];
    const wristStretchEmpty: string[] = [];
    splitUpStretches(mode, backStretchEmpty, neckStretchEmpty, wristStretchEmpty, exercises);
    expect(exercises.length).toBe(mode[1] + mode[2]);
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
    const miscArrayEmpty: string[] = [];
    splitUpMisc(miscArrayEmpty, mode, exercises);
    expect(exercises.length).toBe(0);
  });
});
