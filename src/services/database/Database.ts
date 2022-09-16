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

    createWeeklyGamesFile: (datesArr: WeeklyGames[]) => void;
    retrieveWeeklyGames: () => Promise<WeeklyGames[]>;

    createTeamsSchedulesFile: (teamsSchedulesArr: TeamsSchedule[]) => void;
    retrieveTeamsSchedules: () => Promise<TeamsSchedule[]>;

    createSkaterStatsFile: (skatersStatsArr: SkaterStats[]) => void;
    retrieveSkatersStats: () => Promise<SkaterStats[]>;

    createGoaliesStatsFile: (goaliesStatsArr: GoalieStats[]) => void;
    retrieveGoaliesStats: () => Promise<GoalieStats[]>;
}
