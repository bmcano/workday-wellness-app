// Define the exercises array and the easy array
const exercises: string[] = [];
const mode: number[] = [1, 2, 3];
const exerciseArray: string[] = ['test','other test','extra test']
const neckStretch: string[] = ['neck test','neck other test','neck extra test']
const backStretch: string[] = ['back test','back other test','back extra test']
const wristStretch: string[] = ['wrist test','wrist other test','wrist extra test']
// Function to perform exercises
function applyExercises(exerciseArray: string[], mode: number[], exercises: string[]): void {
    if (exerciseArray.length >= mode[0]) //if there are more exercises avaiable than there are assigned
    {
        for (let i =0; i<mode[0]; i++) //randomly get as many exercises as there are assigned and then delete the exercise for the array to make sure no duplicates
        {
            const randomPoint = Math.floor(Math.random() * exerciseArray.length)
            const randomExercise = exerciseArray[randomPoint];
            exercises.push(randomExercise);
            exerciseArray.splice(randomPoint, 1);
        }
    }
    if (exerciseArray.length < mode[0] && exerciseArray.length != 0){ //if there are more exercises assigned than there is available then just do as many as available and send the extra to stretches
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
        mode[1] += 2* mode[0] //if no exercsise available send to stretches
    }
}

function applyStretches(stretchArray: string[],  strectchSubArray: number, exercises: string[]){ //same logic as exercises but instead of instantly passing off extra it collect it
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
function splitUpStretches(mode: number[], exercises: string[]): void {
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
  extra += applyStretches(backStretch,splitStretches[0],exercises) //adds back stretches to exercise array and gets back extra if there are more to do than there are strectches
  extra += applyStretches(neckStretch,splitStretches[1],exercises) //adds neck stretches to exercise array and gets back extra if there are more to do than there are strectches
  extra += applyStretches(wristStretch,splitStretches[2],exercises) //adds wrist stretches to exercise array and gets back extra if there are more to do than there are strectches
  let allStretches = backStretch.concat(neckStretch, wristStretch); //combines all stretches in one array
  let leftover =  applyStretches(allStretches,extra,exercises) //adds any extra stretches to exercise array returning if theres still some to do
  if (leftover > 0) {
    mode[2] += leftover * 2 //gives extra to meditation area
  }  
}

// Perform exercises from the easy array
//performExercises(easy, easy[0]);

// Apply the base and remainder logic
//applyBaseAndRemainderLogic(easy[1], easy);

//console.log(exercises);
//console.log(easy);
