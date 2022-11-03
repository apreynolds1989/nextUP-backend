import { Types } from '.';

export abstract class Database {
    abstract connect(): any;

    abstract createWeeklyGames(datesArr: Types.WeeklyGames[]): Promise<void>;
    abstract retrieveWeeklyGames(): Promise<Types.WeeklyGames[]>;

    abstract createTeamsSchedules(teamsSchedulesArr: Types.TeamsSchedule[]): Promise<void>;
    abstract retrieveTeamsSchedules(): Promise<Types.TeamsSchedule[]>;

    abstract createSkaterStats(skatersStatsArr: Types.SkaterStats[]): Promise<void>;
    abstract retrieveSkatersStats(): Promise<Types.SkaterStats[]>;

    abstract createGoaliesStats(goaliesStatsArr: Types.GoalieStats[]): Promise<void>;
    abstract retrieveGoaliesStats(): Promise<Types.GoalieStats[]>;
}
