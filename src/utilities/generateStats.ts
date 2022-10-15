import { Types } from '../services/database';
import { generateWeeklyGamesTally, generateWeeklyOffDayGamesTally } from './generateGameTallys';

export const createSkaterStats = (
    skatersArr: Types.StatsResponsePlayerData[],
    gamesArr: Types.WeeklyGames[]
) => {
    const skatersStatsArr = skatersArr.reduce(
        (playerArr: Types.SkaterStats[], currentPlayer, index) => {
            // console.log(`Logging: ${currentPlayer.name}`);
            const teamId = currentPlayer.teamId;
            const statsArr = currentPlayer.playerStats.data.stats[0].splits;
            const weeklyGames = generateWeeklyGamesTally(gamesArr, teamId);
            const weeklyOffDayGames = generateWeeklyOffDayGamesTally(gamesArr, teamId);
            if (statsArr.length > 0) {
                const gamesPlayed = statsArr[0].stat.games;
                const results = {
                    name: currentPlayer.name,
                    team: currentPlayer.teamAbrv,
                    gamesPlayed: gamesPlayed > 0 ? gamesPlayed : 0,
                    weeklyGames: weeklyGames,
                    weeklyOffDayGames: weeklyOffDayGames,
                    goals: gamesPlayed > 0 ? statsArr[0].stat.goals : 0,
                    assists: gamesPlayed > 0 ? statsArr[0].stat.assists : 0,
                    points: gamesPlayed > 0 ? statsArr[0].stat.points : 0,
                    gameWinningGoals: gamesPlayed > 0 ? statsArr[0].stat.gameWinningGoals : 0,
                    pointsPerGame: gamesPlayed > 0 ? statsArr[0].stat.points / gamesPlayed : 0,
                    timeOnIcePerGame: gamesPlayed > 0 ? statsArr[0].stat.timeOnIcePerGame : '0:00',
                    powerPlayerGoals: gamesPlayed > 0 ? statsArr[0].stat.powerPlayGoals : 0,
                    powerPlayerPoints: gamesPlayed > 0 ? statsArr[0].stat.powerPlayPoints : 0,
                    powerPlayTimeOnIcePerGame:
                        gamesPlayed > 0 ? statsArr[0].stat.powerPlayTimeOnIcePerGame : '0:00',
                    shortHandedGoals: gamesPlayed > 0 ? statsArr[0].stat.shortHandedGoals : 0,
                    shortHandedPoints: gamesPlayed > 0 ? statsArr[0].stat.shortHandedPoints : 0,
                    shortHandedTimeOnIcePerGame:
                        gamesPlayed > 0 ? statsArr[0].stat.shortHandedTimeOnIcePerGame : '0:00',
                    hits: gamesPlayed > 0 ? statsArr[0].stat.hits : 0,
                    blocks: gamesPlayed > 0 ? statsArr[0].stat.blocked : 0,
                    shots: gamesPlayed > 0 ? statsArr[0].stat.shots : 0,
                    faceoffPercentage: gamesPlayed > 0 ? statsArr[0].stat.faceOffPct : 0,
                    penaltyMinutes: gamesPlayed > 0 ? statsArr[0].stat.pim : 0,
                };
                playerArr.push(results);
                return playerArr;
            } else {
                const results = {
                    name: currentPlayer.name,
                    team: currentPlayer.teamAbrv,
                    gamesPlayed: 0,
                    weeklyGames: weeklyGames,
                    weeklyOffDayGames: weeklyOffDayGames,
                    goals: 0,
                    assists: 0,
                    points: 0,
                    gameWinningGoals: 0,
                    pointsPerGame: 0,
                    timeOnIcePerGame: '0:00',
                    powerPlayerGoals: 0,
                    powerPlayerPoints: 0,
                    powerPlayTimeOnIcePerGame: '0:00',
                    shortHandedGoals: 0,
                    shortHandedPoints: 0,
                    shortHandedTimeOnIcePerGame: '0:00',
                    hits: 0,
                    blocks: 0,
                    shots: 0,
                    faceoffPercentage: 0,
                    penaltyMinutes: 0,
                };
                playerArr.push(results);
                return playerArr;
            }
        },
        []
    );
    return skatersStatsArr;
};

export const createGoalieStats = (
    goaliesArr: Types.StatsResponsePlayerData[],
    gamesArr: Types.WeeklyGames[]
) => {
    const goaliesStatsArr = goaliesArr.reduce(
        (playerArr: Types.GoalieStats[], currentPlayer, index) => {
            // console.log(`Logging: ${currentPlayer.name}`);
            const teamId = currentPlayer.teamId;
            const statsArr = currentPlayer.playerStats.data.stats[0].splits;
            const weeklyGames = generateWeeklyGamesTally(gamesArr, teamId);
            const weeklyOffDayGames = generateWeeklyOffDayGamesTally(gamesArr, teamId);
            if (statsArr.length > 0) {
                const gamesPlayed = statsArr[0].stat.games;
                const results = {
                    name: currentPlayer.name,
                    team: currentPlayer.teamAbrv,
                    weeklyGames: weeklyGames,
                    weeklyOffDayGames: weeklyOffDayGames,
                    gamesPlayed: gamesPlayed > 0 ? gamesPlayed : 0,
                    gamesStarted: gamesPlayed > 0 ? statsArr[0].stat.gamesStarted : 0,
                    wins: gamesPlayed > 0 ? statsArr[0].stat.wins : 0,
                    loses: gamesPlayed > 0 ? statsArr[0].stat.losses : 0,
                    shutouts: gamesPlayed > 0 ? statsArr[0].stat.shutouts : 0,
                    shotsAgainst: gamesPlayed > 0 ? statsArr[0].stat.shotsAgainst : 0,
                    saves: gamesPlayed > 0 ? statsArr[0].stat.saves : 0,
                    savePercentage: gamesPlayed > 0 ? statsArr[0].stat.savePercentage : 0,
                    goalsAgainst: gamesPlayed > 0 ? statsArr[0].stat.goalsAgainst : 0,
                    goalsAgainstAverage: gamesPlayed > 0 ? statsArr[0].stat.goalAgainstAverage : 0,
                };
                playerArr.push(results);
                return playerArr;
            } else {
                const results = {
                    name: currentPlayer.name,
                    team: currentPlayer.teamAbrv,
                    weeklyGames: weeklyGames,
                    weeklyOffDayGames: weeklyOffDayGames,
                    gamesPlayed: 0,
                    gamesStarted: 0,
                    wins: 0,
                    loses: 0,
                    shutouts: 0,
                    shotsAgainst: 0,
                    saves: 0,
                    savePercentage: 0,
                    goalsAgainst: 0,
                    goalsAgainstAverage: 0,
                };
                playerArr.push(results);
                return playerArr;
            }
        },
        []
    );
    return goaliesStatsArr;
};
