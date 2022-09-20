import {
    TeamsInfo,
    PlayerData,
    PlayerArrs,
    SkaterStats,
    GoalieStats,
    WeeklyGames,
    TeamsSchedule,
} from './types';

export interface Database {
    // CRUD => Create, Retrieve, Update, Delete

    createWeeklyGamesFile: (datesArr: WeeklyGames[]) => Promise<void>;
    retrieveWeeklyGames: () => Promise<WeeklyGames[]>;

    createTeamsSchedulesFile: (teamsSchedulesArr: TeamsSchedule[]) => Promise<void>;
    retrieveTeamsSchedules: () => Promise<TeamsSchedule[]>;

    createSkaterStatsFile: (skatersStatsArr: SkaterStats[]) => Promise<void>;
    retrieveSkatersStats: () => Promise<SkaterStats[]>;

    createGoaliesStatsFile: (goaliesStatsArr: GoalieStats[]) => Promise<void>;
    retrieveGoaliesStats: () => Promise<GoalieStats[]>;
}
