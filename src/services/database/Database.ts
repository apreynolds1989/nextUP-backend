import { TeamsInfo, PlayerData, PlayerArrs, SkaterStats, GoalieStats, WeeklyGames } from './types';

export interface Database {
    // CRUD => Create, Retrieve, Update, Delete

    createWeeklyGamesFile: (datesArr: WeeklyGames[]) => void;
    retrieveWeeklyGames: () => Promise<WeeklyGames[]>;

    createSkaterStatsFile: (skatersStatsArr: SkaterStats[]) => void;
    retrieveSkatersStats: () => Promise<SkaterStats[]>;

    createGoaliesStatsFile: (goaliesStatsArr: GoalieStats[]) => void;
    retrieveGoaliesStats: () => Promise<GoalieStats[]>;
}
