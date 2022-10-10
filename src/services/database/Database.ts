import { Types } from '.';

export interface Database {
    // CRUD => Create, Retrieve, Update, Delete

    createWeeklyGamesFile: (datesArr: Types.WeeklyGames[]) => Promise<void>;
    retrieveWeeklyGames: () => Promise<Types.WeeklyGames[]>;

    createTeamsSchedulesFile: (teamsSchedulesArr: Types.TeamsSchedule[]) => Promise<void>;
    retrieveTeamsSchedules: () => Promise<Types.TeamsSchedule[]>;

    createSkaterStatsFile: (skatersStatsArr: Types.SkaterStats[]) => Promise<void>;
    retrieveSkatersStats: () => Promise<Types.SkaterStats[]>;

    createGoaliesStatsFile: (goaliesStatsArr: Types.GoalieStats[]) => Promise<void>;
    retrieveGoaliesStats: () => Promise<Types.GoalieStats[]>;
}
