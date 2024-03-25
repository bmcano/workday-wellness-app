import { getExerciseMenuList } from '../util/getExerciseMenuList.ts';

describe('getExerciseMenuList function', () => {
    it('should return an array of subPoint titles from the exercises', () => {
        const expectedOutput = [
            "Neck flexion and extension",
            "Neck retraction",
            "Neck rotation",
            "On the ground figure four",
            "Spinal twist",
            "Shoulder rolls",
            "Horizontal abduction",
            "Seated lower back",
            "Wrist rolls",
            "Finger to palm",
            "Squats",
            "Lunges",
            "Jumping jacks",
            "Push ups",
            "Walks",
            "Meditation",
            "Sun exposure",
            "Standing at work",
            "Posture reminder",
            "Ergonomic Tips"
        ];

        const result = getExerciseMenuList();
        expect(result).toEqual(expect.arrayContaining(expectedOutput));
        expect(result.length).toEqual(expectedOutput.length);
    });

    it('should not include any subPoint without a title', () => {
        const exercisesWithNoTitles = [
            {
                id: 21,
                title: "Test Exercise",
                subPoints: [
                    {
                        id: 22,
                        youtubeURL: "https://www.example.com"
                    }
                ]
            }
        ];

        jest.mock('../static/json/exercises_consts.json', () => exercisesWithNoTitles);
        const result = getExerciseMenuList();
        expect(result).not.toContain(undefined);
    });
});
