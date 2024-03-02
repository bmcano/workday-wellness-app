// Define the exercises array and the easy array
const exercises: string[] = [];
const mode: number[] = [1, 2, 3];
const exerciseArray: string[] = ['test','other test','extra test']
const neckStretch: string[] = ['neck test','neck other test','neck extra test']
const backStretch: string[] = ['back test','back other test','back extra test']
const wristStretch: string[] = ['wrist test','wrist other test','wrist extra test']
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
function applyBaseAndRemainderLogic(stretchValue: number, array: number[]): void {
  let remainder = stretchValue % 3; //finds remainder after dividing by 3
  let base = Math.floor(stretchValue /3); //three main stretch types want to give all of them the same base even amount
  let counter = 1;
  const splitStretches: number[] = [base,base,base]

  if (remainder >= 1) {
     splitStretches[0] += 1; //if theres one remainder give it to back
  } 
  if (remainder >= 2) {
    splitStretches[1] += 1; //if theres two reaminder give one to back and one to neck
  }


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
