import { Database } from './Database';
import { Types } from '.';
import * as fs from 'fs/promises';
import axiosRetry from 'axios-retry';
import path from 'node:path';

// Axios with axios-retry to ensure any API calls that fail, get called again
// Without retry, sometimes random calls to the stats API fail
const axios = require('axios').default;
axiosRetry(axios, {
    retries: 3,
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`Request Config: ${requestConfig.url} -  Retry attempt # ${retryCount}`);
    },
});

export class FileDatabase extends Database {
    dir: string;

    private WEEKLY_GAME_FILE = 'weeklyGames.json';

    constructor(dir: string) {
        super();
        this.dir = dir;
    }

    async createWeeklyGamesFile(datesArr: Types.WeeklyGames[]) {
        await fs
            .writeFile(path.join(this.dir, this.WEEKLY_GAME_FILE), JSON.stringify(datesArr))
            .catch((err) => console.log(err));
    }

    async retrieveWeeklyGames() {
        const result = await fs.readFile(path.join(this.dir, this.WEEKLY_GAME_FILE), 'utf8');
        return result ? JSON.parse(result) : [];
    }

    async createTeamsSchedulesFile(teamsSchedulesArr: Types.TeamsSchedule[]) {
        await fs
            .writeFile('src/dataFiles/teamsSchedules.json', JSON.stringify(teamsSchedulesArr))
            .catch((err) => console.log(err));
    }

    async retrieveTeamsSchedules() {
        const result = await fs.readFile('src/dataFiles/teamsSchedules.json', 'utf8');
        return result ? JSON.parse(result) : [];
    }

    async createSkaterStatsFile(skatersStatsArr: Types.SkaterStats[]) {
        await fs
            .writeFile('src/dataFiles/skatersStatsArr.json', JSON.stringify(skatersStatsArr))
            .catch((err) => console.log(err));
    }

    async retrieveSkatersStats() {
        const result = await fs.readFile('src/dataFiles/skatersStatsArr.json', 'utf8');
        return result ? JSON.parse(result) : [];
    }

    async createGoaliesStatsFile(goaliesStatsArr: Types.GoalieStats[]) {
        await fs
            .writeFile('src/dataFiles/goaliesStatsArr.json', JSON.stringify(goaliesStatsArr))
            .catch((err) => console.log(err));
    }

    async retrieveGoaliesStats() {
        const result = await fs.readFile('src/dataFiles/goaliesStatsArr.json', 'utf8');
        return result ? JSON.parse(result) : [];
    }
}
