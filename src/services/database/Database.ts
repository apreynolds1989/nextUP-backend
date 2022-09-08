import { TeamsInfo, PlayerArrs, SkaterStats, GoalieStats, WeeklyGames } from './types';

export interface Database {
    // CRUD => Create, Retrieve, Update, Delete

    createWeeklyGames: () => Promise<void>;
    retrieveWeeklyGames: () => Promise<WeeklyGames[]>;
    // updateWeeklyGames: () => Promise<void>;

    createTeamsInfo: () => Promise<void>;
    retrieveTeamsInfo: () => Promise<TeamsInfo[]>;
    // updateTeamRosters: () => TeamRosters;

    createPlayerArrs: (TeamsArr: TeamsInfo[]) => Promise<void>;
    retrievePlayerArrs: () => Promise<PlayerArrs>;
    // updatePlayerData: () => PlayerData;

    createSkaterStats: () => Promise<void>;
    // retrieveSkaterStats: () => SkaterStats;
    // updateSkaterStats: () => SkaterStats;

    // createGoalieStats: () => void;
    // retrieveGoalieStats: () => GoalieStats;
    // updateGoalieStats: () => GoalieStats;
}
