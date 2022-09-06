import { TeamRosters, PlayerData, SkaterStats, GoalieStats, WeeklyGames } from '../../types';

export interface Database {
        // CRUD => Create, Retrieve, Update, Delete

    createWeeklyGames: () => void;
    retrieveWeeklyGames: () => WeeklyGames[];
    // updateWeeklyGames: () => string[];

    // createTeamRosters: () => void;
    // retrieveTeamRosters: () => TeamRosters;
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