import { Types } from '.';

export abstract class Database {
    abstract connect(): any;

    abstract createWeeklyGamesFile(datesArr: Types.WeeklyGames[]): Promise<void>;
    abstract retrieveWeeklyGames(): Promise<Types.WeeklyGames[]>;

    abstract createTeamsSchedulesFile(teamsSchedulesArr: Types.TeamsSchedule[]): Promise<void>;
    abstract retrieveTeamsSchedules(): Promise<Types.TeamsSchedule[]>;

    abstract createSkaterStatsFile(skatersStatsArr: Types.SkaterStats[]): Promise<void>;
    abstract retrieveSkatersStats(): Promise<Types.SkaterStats[]>;

    abstract createGoaliesStatsFile(goaliesStatsArr: Types.GoalieStats[]): Promise<void>;
    abstract retrieveGoaliesStats(): Promise<Types.GoalieStats[]>;
}
