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

    async retrieveWeeklyGames() {
        const columns = ['date', 'time', 'home_id', 'home_name', 'away_id', 'away_name'];
        const result = await this.sql`select ${this.sql(columns)} from weekly_games`;
        return result;
    }

    async createTeamsSchedules(teamsSchedulesArr: Types.TeamsSchedule[]) {}
    // @ts-ignore
    async retrieveTeamsSchedules() {
        return 'retrieve teams schedules';
    }

    async createSkaterStats(skatersStatsArr: Types.SkaterStats[]) {}
    // @ts-ignore
    async retrieveSkatersStats() {
        return 'retrieve skater stats';
    }

    async createGoaliesStats(goaliesStatsArr: Types.GoalieStats[]) {}
    // @ts-ignore
    async retrieveGoaliesStats() {
        return 'retrieve goalies stats';
    }
}

const sqlDatabse = new SqlDatabase();
sqlDatabse.connect();

console.log(sqlDatabse.retrieveWeeklyGames());
