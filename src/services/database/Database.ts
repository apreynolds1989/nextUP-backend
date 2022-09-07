import { TeamsInfo, PlayerData, SkaterStats, GoalieStats, WeeklyGames } from './types';

export interface Database {
        // CRUD => Create, Retrieve, Update, Delete

    createWeeklyGames: () => Promise<void>;
    retrieveWeeklyGames: () => Promise<WeeklyGames[]>;
    // updateWeeklyGames: () => Promise<void>;

    createTeamsInfo: () => Promise<void>;
    retrieveTeamsInfo: () => Promise<TeamsInfo>;
    // updateTeamRosters: () => TeamRosters;

    // createPlayerData: () => void;
    // retrievePlayerData: () => PlayerData;
    // updatePlayerData: () => PlayerData;

    // createSkaterStats: () => void;
    // retrieveSkaterStats: () => SkaterStats;
    // updateSkaterStats: () => SkaterStats;

    // createGoalieStats: () => void;
    // retrieveGoalieStats: () => GoalieStats;
    // updateGoalieStats: () => GoalieStats;
}