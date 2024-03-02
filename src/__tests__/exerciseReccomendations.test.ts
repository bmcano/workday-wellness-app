import { applyExercises, splitUpMisc, splitUpStretches } from '../util/exerciseReccomendations.ts';
const exercises: string[] = [];
const mode: number[] = [1, 3, 3];
//const exerciseArray: string[] = ['test','other test','extra test']
const exerciseArray: string[] = []
//const neckStretch: string[] = ['neck test','neck other test','neck extra test']
const neckStretch: string[] = []
const backStretch: string[] = ['back test','back other test','back extra test']
const wristStretch: string[] = ['wrist test','wrist other test','wrist extra test']
const miscArray: string[] = ['misc test','misc other test','misc extra test']
test('renders home page', () => {
    applyExercises(exerciseArray,mode,exercises)
    splitUpStretches(mode,backStretch,neckStretch,wristStretch,exercises)
    splitUpMisc(miscArray,mode,exercises)
    
    // Perform exercises from the easy array
    //performExercises(easy, easy[0]);
    
    // Apply the base and remainder logic
    //applyBaseAndRemainderLogic(easy[1], easy);
    
    console.log(exercises);
});
