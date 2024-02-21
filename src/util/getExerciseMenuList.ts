import exerecises from "../static/json/exercises_consts.json"

export const getExerciseMenuList = (): Array<string> => {
    const result: Array<string> = [];

    exerecises.forEach(item => {
        if (item.subPoints) {
            item.subPoints.forEach(subPoint => {
                result.push(subPoint.title);
            });
        }
    });

    return result;
}
