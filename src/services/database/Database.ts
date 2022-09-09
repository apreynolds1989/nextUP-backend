import { TeamsInfo, PlayerData, PlayerArrs, SkaterStats, GoalieStats, WeeklyGames } from './types';

export interface Database {
    // CRUD => Create, Retrieve, Update, Delete

    createWeeklyGames: (date1: string, date2: string) => Promise<void>;
    retrieveWeeklyGames: () => Promise<WeeklyGames[]>;
    // updateWeeklyGames: () => Promise<void>;

    createTeamsInfo: () => Promise<void>;
    retrieveTeamsInfo: () => Promise<TeamsInfo[]>;
    // updateTeamRosters: () => TeamRosters;

    createPlayerArrs: (TeamsArr: TeamsInfo[]) => Promise<void>;
    retrievePlayerArrs: () => Promise<PlayerArrs>;
    // updatePlayerData: () => PlayerData;

    createSkaterStats: (skatersArr: PlayerData[], datesArr: WeeklyGames[]) => Promise<void>;
    retrieveSkatersStats: () => Promise<SkaterStats[]>;
    // updateSkaterStats: () => SkaterStats;

    // createGoalieStats: () => void;
    // retrieveGoalieStats: () => GoalieStats;
    // updateGoalieStats: () => GoalieStats;
}
