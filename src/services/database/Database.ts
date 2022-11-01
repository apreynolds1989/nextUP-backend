import { Types } from '.';

// export interface Database {
//     // CRUD => Create, Retrieve, Update, Delete

//     createWeeklyGamesFile: (datesArr: Types.WeeklyGames[]) => Promise<void>;
//     retrieveWeeklyGames: () => Promise<Types.WeeklyGames[]>;

//     createTeamsSchedulesFile: (teamsSchedulesArr: Types.TeamsSchedule[]) => Promise<void>;
//     retrieveTeamsSchedules: () => Promise<Types.TeamsSchedule[]>;

//     createSkaterStatsFile: (skatersStatsArr: Types.SkaterStats[]) => Promise<void>;
//     retrieveSkatersStats: () => Promise<Types.SkaterStats[]>;

//     createGoaliesStatsFile: (goaliesStatsArr: Types.GoalieStats[]) => Promise<void>;
//     retrieveGoaliesStats: () => Promise<Types.GoalieStats[]>;
// }

export abstract class ClassDatabase {
    abstract createWeeklyGamesFile(datesArr: Types.WeeklyGames[]): Promise<void>;
    abstract retrieveWeeklyGames(): Promise<Types.WeeklyGames[]>;

    abstract createTeamsSchedulesFile(teamsSchedulesArr: Types.TeamsSchedule[]): Promise<void>;
    abstract retrieveTeamsSchedules(): Promise<Types.TeamsSchedule[]>;

    abstract createSkaterStatsFile(skatersStatsArr: Types.SkaterStats[]): Promise<void>;
    abstract retrieveSkatersStats(): Promise<Types.SkaterStats[]>;

    abstract createGoaliesStatsFile(goaliesStatsArr: Types.GoalieStats[]): Promise<void>;
    abstract retrieveGoaliesStats(): Promise<Types.GoalieStats[]>;
}
