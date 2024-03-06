// Define the exercises array and the easy array

import { ExerciseCategories } from "../types/ExerciseCategories";

// Function to perform exercises
export function applyExercises(exerciseArray: string[], mode: number[], exercises: string[]): void {
    //console.log("exercisearray length "+ exerciseArray.length);
    if (exerciseArray.length >= mode[0]) //if there are more exercises avaiable than there are assigned
    {
        for (let i = 0; i < mode[0]; i++) //randomly get as many exercises as there are assigned and then delete the exercise for the array to make sure no duplicates
        {
            const randomPoint = Math.floor(Math.random() * exerciseArray.length)
            const randomExercise = exerciseArray[randomPoint];
            exercises.push(randomExercise);
            exerciseArray.splice(randomPoint, 1);
        }
    }
    else if (exerciseArray.length < mode[0] && exerciseArray.length !== 0) { //if there are more exercises assigned than there is available then just do as many as available and send the extra to stretches
        const extra = mode[0] - exerciseArray.length
        mode[1] += 2 * extra
        for (let i = 0; i < exerciseArray.length; i++) {
            const randomPoint = Math.floor(Math.random() * exerciseArray.length)
            const randomExercise = exerciseArray[randomPoint];
            exercises.push(randomExercise);
            exerciseArray.splice(randomPoint, 1);
        }
    }
    else {
        mode[1] += 2 * mode[0] //if no exercsise available send to stretches
    }
}

export function applyStretches(stretchArray: string[], strectchSubArray: number, exercises: string[]) { //same logic as exercises but instead of instantly passing off extra it collect it
    let extra = 0;
    if (stretchArray.length >= strectchSubArray) {
        for (let i = 0; i < strectchSubArray; i++) {
            const randomPoint = Math.floor(Math.random() * stretchArray.length)
            const randomExercise = stretchArray[randomPoint];
            exercises.push(randomExercise);
            stretchArray.splice(randomPoint, 1);
        }
    }
    else if (stretchArray.length < strectchSubArray && stretchArray.length !== 0) {
        extra = strectchSubArray - stretchArray.length
        for (let i = 0; i < stretchArray.length; i++) {
            const randomPoint = Math.floor(Math.random() * stretchArray.length)
            const randomExercise = stretchArray[randomPoint];
            exercises.push(randomExercise);
            stretchArray.splice(randomPoint, 1);
        }
    }
    else {
        extra = strectchSubArray
    }
    return (extra)
}

// Function to apply the base and remainder logic
export function splitUpStretches(mode: number[], backStretch: string[], neckStretch: string[], wristStretch: string[], exercises: string[]): void {
    let extra = 0
    //console.log("mode "+ mode[1]);
    let remainder = mode[1] % 3; //finds remainder after dividing by 3
    //console.log("remainder "+ remainder);
    let base = Math.floor(mode[1] / 3); //three main stretch types want to give all of them the same base even amount
    //console.log("base " + base);
    const splitStretches: number[] = [base, base, base]
    //console.log("split stretches " + splitStretches[0] + " " + splitStretches[1]+ " " +splitStretches[2]);

    if (remainder >= 1) {
        splitStretches[0] += 1; //if theres one remainder give it to back
    }
    if (remainder >= 2) {
        splitStretches[1] += 1; //if theres two reaminder give one to back and one to neck
    }
    //console.log("split stretches after remainder " + splitStretches[0] + " " + splitStretches[1]+ " " +splitStretches[2]);
    extra += applyStretches(backStretch, splitStretches[0], exercises) //adds back stretches to exercise array and gets back extra if there are more to do than there are strectches
    //console.log("extra first " +extra);
    extra += applyStretches(neckStretch, splitStretches[1], exercises) //adds neck stretches to exercise array and gets back extra if there are more to do than there are strectches
    //console.log("extra second " +extra);
    extra += applyStretches(wristStretch, splitStretches[2], exercises) //adds wrist stretches to exercise array and gets back extra if there are more to do than there are strectches
    //console.log("extra third " +extra);
    let allStretches = backStretch.concat(neckStretch, wristStretch); //combines all stretches in one array
    //console.log("all strecthes " + allStretches);
    let leftover = applyStretches(allStretches, extra, exercises) //adds any extra stretches to exercise array returning if theres still some to do
    //console.log("leftover " + leftover);
    if (leftover > 0) {
        mode[2] += leftover * 2 //gives extra to meditation area
        //console.log();
    }
}
export function splitUpMisc(miscArray: string[], mode: number[], exercises: string[]): void {
    if (miscArray.length > 0) {
        //console.log("got inside if ");
        for (let i = 0; i < mode[2]; i++) {
            //console.log("got inside for ");
            const randomPoint = Math.floor(Math.random() * miscArray.length)
            const randomExercise = miscArray[randomPoint];
            exercises.push(randomExercise);
        }
    }
    else {
        console.log(mode[3])
    }

}

export const getModeValues = (intensity: string) => {
    //easy mode[1,2,3]
    //medium mode[2,4,5]
    //hard mode[3,6,7]
    let mode: Array<number> = []
    if (intensity === "high") {
        mode = [3, 6, 7];
    } else if (intensity === "medium") {
        mode = [2, 4, 5];
    } else {
        mode = [1, 2, 3];
    }
    return mode;
}

interface Exercise {
    id: number;
    name: string;
    values: {
        time?: number;
        reps?: number;
    };
    isEnabled: boolean;
}

export const splitExerciseData = (data: Object): ExerciseCategories => {
    const categories = {
        neck: [] as Array<string>,
        back: [] as Array<string>,
        wrist: [] as Array<string>,
        exercise: [] as Array<string>,
        misc: [] as Array<string>
    }

    const back = ["on the ground figure four", "spinal twist", "shoulder rolls", "horizontal abduction", "seated lower back"];
    const wrist = ["wrist rolls", "finger to palm"];
    const movement = ["squats", "lunges", "jumping jacks", "push ups", "walks"];

    Object.values(data).forEach((exercise: Exercise) => {
        if (exercise.isEnabled) {
            if (exercise.name.toLowerCase().includes('neck')) {
                categories.neck.push(exercise.name);
            } else if (back.includes(exercise.name.toLowerCase())) {
                categories.back.push(exercise.name);
            } else if (wrist.includes(exercise.name.toLowerCase())) {
                categories.wrist.push(exercise.name);
            } else if (movement.includes(exercise.name.toLowerCase())) {
                categories.exercise.push(exercise.name);
            } else {
                categories.misc.push(exercise.name);
            }
        }
    });

    return categories as ExerciseCategories;
}