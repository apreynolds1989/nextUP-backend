import {
    GoalieStats,
    SkaterStats,
    StatsResponsePlayerData,
    WeeklyGames,
} from '../services/database/types';
import { generateWeeklyGamesTally, generateWeeklyOffDayGamesTally } from './generateGameTallys';

export const createSkaterStats = (
    skatersArr: StatsResponsePlayerData[],
    gamesArr: WeeklyGames[]
) => {
    const skatersStatsArr = skatersArr.reduce((playerArr: SkaterStats[], currentPlayer, index) => {
        // console.log(`Logging: ${currentPlayer.name}`);
        let teamId = currentPlayer.teamId;
        let statsArr = currentPlayer.playerStats.data.stats[0].splits;
        let results: SkaterStats;
        let weeklyGames = generateWeeklyGamesTally(gamesArr, teamId);
        let weeklyOffDayGames = generateWeeklyOffDayGamesTally(gamesArr, teamId);
        if (statsArr.length > 0) {
            let gamesPlayed = statsArr[0].stat.games;
            if (gamesPlayed > 0) {
                results = {
                    name: currentPlayer.name,
                    team: currentPlayer.teamAbrv,
                    gamesPlayed: gamesPlayed,
                    weeklyGames: weeklyGames,
                    weeklyOffDayGames: weeklyOffDayGames,
                    goals: statsArr[0].stat.goals,
                    assists: statsArr[0].stat.assists,
                    points: statsArr[0].stat.points,
                    gameWinningGoals: statsArr[0].stat.gameWinningGoals,
                    pointsPerGame: statsArr[0].stat.points / gamesPlayed,
                    timeOnIcePerGame: statsArr[0].stat.timeOnIcePerGame,
                    powerPlayerGoals: statsArr[0].stat.powerPlayGoals,
                    powerPlayerPoints: statsArr[0].stat.powerPlayPoints,
                    powerPlayTimeOnIcePerGame: statsArr[0].stat.powerPlayTimeOnIcePerGame,
                    shortHandedGoals: statsArr[0].stat.shortHandedGoals,
                    shortHandedPoints: statsArr[0].stat.shortHandedPoints,
                    shortHandedTimeOnIcePerGame: statsArr[0].stat.shortHandedTimeOnIcePerGame,
                    hits: statsArr[0].stat.hits,
                    blocks: statsArr[0].stat.blocked,
                    shots: statsArr[0].stat.shots,
                    faceoffPercentage: statsArr[0].stat.faceOffPct,
                    penaltyMinutes: statsArr[0].stat.pim,
                };
                playerArr.push(results);
                return playerArr;
            }
            return playerArr;
        }
        return playerArr;
    }, []);
    return skatersStatsArr;
};

export const createGoalieStats = (
    goaliesArr: StatsResponsePlayerData[],
    gamesArr: WeeklyGames[]
) => {
    const goaliesStatsArr = goaliesArr.reduce((playerArr: GoalieStats[], currentPlayer, index) => {
        // console.log(`Logging: ${currentPlayer.name}`);
        let teamId = currentPlayer.teamId;
        let statsArr = currentPlayer.playerStats.data.stats[0].splits;
        let results: GoalieStats;
        let weeklyGames = generateWeeklyGamesTally(gamesArr, teamId);
        let weeklyOffDayGames = generateWeeklyOffDayGamesTally(gamesArr, teamId);
        if (statsArr.length > 0) {
            let gamesPlayed = statsArr[0].stat.games;
            if (gamesPlayed > 0) {
                results = {
                    name: currentPlayer.name,
                    team: currentPlayer.teamAbrv,
                    weeklyGames: weeklyGames,
                    weeklyOffDayGames: weeklyOffDayGames,
                    gamesPlayed: gamesPlayed,
                    gamesStarted: statsArr[0].stat.gamesStarted,
                    wins: statsArr[0].stat.wins,
                    loses: statsArr[0].stat.losses,
                    shutouts: statsArr[0].stat.shutouts,
                    shotsAgainst: statsArr[0].stat.shotsAgainst,
                    saves: statsArr[0].stat.saves,
                    savePercentage: statsArr[0].stat.savePercentage,
                    goalsAgainst: statsArr[0].stat.goalsAgainst,
                    goalsAgainstAverage: statsArr[0].stat.goalAgainstAverage,
                };
                playerArr.push(results);
                return playerArr;
            }
            return playerArr;
        }
        return playerArr;
    }, []);
    return goaliesStatsArr;
};
