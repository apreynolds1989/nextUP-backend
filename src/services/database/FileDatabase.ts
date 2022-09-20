import { Database } from './Database';
import * as fs from 'fs/promises';
import axiosRetry from 'axios-retry';

// Axios with axios-retry to ensure any API calls that fail, get called again
// Without retry, sometimes random calls to the stats API fail
const axios = require('axios').default;
axiosRetry(axios, {
    retries: 3,
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`Request Config: ${requestConfig.url} -  Retry attempt # ${retryCount}`);
    },
});

export const FileDatabase: Database = {
    async createWeeklyGamesFile(datesArr) {
        await fs
            .writeFile('src/dataFiles/weeklyGames.json', JSON.stringify(datesArr))
            .catch((err) => console.log(err));
    },

    async retrieveWeeklyGames() {
        const result = await fs.readFile('src/dataFiles/weeklyGames.json', 'utf8');
        return result ? JSON.parse(result) : [];
    },

    async createTeamsSchedulesFile(teamsSchedulesArr) {
        await fs
            .writeFile('src/dataFiles/teamsSchedules.json', JSON.stringify(teamsSchedulesArr))
            .catch((err) => console.log(err));
    },

    async retrieveTeamsSchedules() {
        const result = await fs.readFile('src/dataFiles/teamsSchedules.json', 'utf8');
        return result ? JSON.parse(result) : [];
    },

    async createSkaterStatsFile(skatersStatsArr) {
        await fs
            .writeFile('src/dataFiles/skatersStatsArr.json', JSON.stringify(skatersStatsArr))
            .catch((err) => console.log(err));
    },

    async retrieveSkatersStats() {
        const result = await fs.readFile('src/dataFiles/skatersStatsArr.json', 'utf8');
        return result ? JSON.parse(result) : [];
    },

    async createGoaliesStatsFile(goaliesStatsArr) {
        await fs
            .writeFile('src/dataFiles/goaliesStatsArr.json', JSON.stringify(goaliesStatsArr))
            .catch((err) => console.log(err));
    },

    async retrieveGoaliesStats() {
        const result = await fs.readFile('src/dataFiles/goaliesStatsArr.json', 'utf8');
        return result ? JSON.parse(result) : [];
    },
};
