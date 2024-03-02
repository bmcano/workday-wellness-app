// Define the exercises array and the easy array
const exercises: string[] = [];
const mode: number[] = [1, 2, 3];
const exerciseArray: string[] = ['test','test','test']

// Function to perform exercises
function performExercises(exerciseArray: string[], times: number, exercises: string[]): void {
    if (exerciseArray.length >= mode[0])
    {
        for (let i =0; i<mode[0])
    }
  for (let i = 0; i < times; i++) {
    const randomExercise = exerciseArray[Math.floor(Math.random() * exerciseArray.length)];
    exercises.push(randomExercise);
    exerciseArray.splice(exerciseArray.indexOf(randomExercise), 1);
  }
}

// Function to apply the base and remainder logic
function applyBaseAndRemainderLogic(baseValue: number, array: number[]): void {
  const remainder = array[1] % 3;
  let base = baseValue;
  let counter = 1;

  if (remainder === 1) {
    counter = 1;
  } else if (remainder === 2) {
    counter = 2;
  }

  array[1] += counter;

  // Implement exercise logic by looping with subarray [0, 6]
  for (let i = 0; i < 6; i++) {
    const exerciseSubArray = array.slice(0, 6);
    performExercises(exerciseSubArray, exerciseSubArray[0]);
  }
}

// Perform exercises from the easy array
performExercises(easy, easy[0]);

// Apply the base and remainder logic
applyBaseAndRemainderLogic(easy[1], easy);

console.log(exercises);
console.log(easy);
