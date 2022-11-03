import { Database } from './Database';
import { Types } from '.';
import * as postgres from 'postgres';

export class SqlDatabase extends Database {
    sql: any;

    constructor() {
        super();
    }

    connect() {
        this.sql = postgres.default({
            database: 'nextup',
            username: 'postgres',
            password: '',
        });
    }

    async createWeeklyGames(datesArr: Types.WeeklyGames[]) {}
    // @ts-ignore
    async retrieveWeeklyGames() {}

    async createTeamsSchedules(teamsSchedulesArr: Types.TeamsSchedule[]) {}
    // @ts-ignore
    async retrieveTeamsSchedules() {}

    async createSkaterStats(skatersStatsArr: Types.SkaterStats[]) {}
    // @ts-ignore
    async retrieveSkatersStats() {}

    async createGoaliesStats(goaliesStatsArr: Types.GoalieStats[]) {}
    // @ts-ignore
    async retrieveGoaliesStats() {}
}
