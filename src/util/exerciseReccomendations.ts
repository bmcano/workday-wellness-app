// Define the exercises array and the easy array
const exercises: string[] = [];
const mode: number[] = [1, 2, 3];
const exerciseArray: string[] = ['test','other test','extra test']
const neckStretch: string[] = ['neck test','neck other test','neck extra test']
const backStretch: string[] = ['back test','back other test','back extra test']
const wristStretch: string[] = ['wrist test','wrist other test','wrist extra test']
// Function to perform exercises
function performExercises(exerciseArray: string[], mode: number[], exercises: string[]): void {
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

function performStretches(stretchArray: string[],  strectchSubArray: number, exercises: string[]){
    let extra = 0;
    if (stretchArray.length >= strectchSubArray)
    {
        for (let i =0; i<strectchSubArray; i++)
        {
            const randomPoint = Math.floor(Math.random() * stretchArray.length)
            const randomExercise = stretchArray[randomPoint];
            exercises.push(randomExercise);
            stretchArray.splice(randomPoint, 1);
        }
    }
    if (stretchArray.length < strectchSubArray && stretchArray.length != 0){
        extra = strectchSubArray - stretchArray.length
        for (let i =0; i<stretchArray.length; i++)
        {
            const randomPoint = Math.floor(Math.random() * stretchArray.length)
            const randomExercise = stretchArray[randomPoint];
            exercises.push(randomExercise);
            stretchArray.splice(randomPoint, 1);
        }
    }
    else{
        extra = strectchSubArray
    }
    return (extra)
}

// Function to apply the base and remainder logic
function applyBaseAndRemainderLogic(mode: number[], exercises: string[]): void {
  let extra =0
  let remainder = mode[1] % 3; //finds remainder after dividing by 3
  let base = Math.floor(mode[1] /3); //three main stretch types want to give all of them the same base even amount
  const splitStretches: number[] = [base,base,base]

  if (remainder >= 1) {
     splitStretches[0] += 1; //if theres one remainder give it to back
  } 
  if (remainder >= 2) {
    splitStretches[1] += 1; //if theres two reaminder give one to back and one to neck
  }


  // Implement exercise logic by looping with subarray [0, 6]
  extra += performStretches(backStretch,splitStretches[0],exercises)
  extra += performStretches(neckStretch,splitStretches[1],exercises)
  extra += performStretches(wristStretch,splitStretches[2],exercises)
  let allStretches = backStretch.concat(neckStretch, wristStretch);
  let leftover =  performStretches(allStretches,extra,exercises)
  if (leftover > 0) {
    mode[2] += leftover * 2
  }
  

}

// Perform exercises from the easy array
//performExercises(easy, easy[0]);

// Apply the base and remainder logic
//applyBaseAndRemainderLogic(easy[1], easy);

//console.log(exercises);
//console.log(easy);
