// Define the exercises array and the easy array
const exercises: string[] = [];
const mode: number[] = [1, 2, 3];
const exerciseArray: string[] = ['test','other test','extra test']

// Function to perform exercises
function performExercises(exerciseArray: string[], times: number, exercises: string[]): void {
    if (exerciseArray.length >= mode[0])
    {
        for (let i =0; i<mode[0]; i++)
        {
            const randomPoint = Math.floor(Math.random() * exerciseArray.length)
            const randomExercise = exerciseArray[randomPoint];
            exercises.push(randomExercise);
            exerciseArray.splice(randomPoint, 1);
        }
    }
    if (exerciseArray.length < mode[0] && exerciseArray.length != 0){
        const extra = mode[0] - exerciseArray.length
        mode[1] += 2*extra
        for (let i =0; i<exerciseArray.length; i++)
        {
            const randomPoint = Math.floor(Math.random() * exerciseArray.length)
            const randomExercise = exerciseArray[randomPoint];
            exercises.push(randomExercise);
            exerciseArray.splice(randomPoint, 1);
        }
    }
    else{
        mode[1] += 2* mode[0]
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
