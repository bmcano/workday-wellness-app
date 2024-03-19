import { formatDateforDatabase } from '../util/dateUtils.ts';

// Note: other functions are not tested since the dates give dynamic results, and mocking doesn't work properly

describe('formatDateforDatabase function', () => {
    it('formats date for database correctly', () => {
        const inputDate = new Date('2024-02-20T14:30:00.000Z');
        const formattedDate = formatDateforDatabase(inputDate);
        expect(formattedDate).toEqual('2024-02-20T08:30:00.000');
    });
});
