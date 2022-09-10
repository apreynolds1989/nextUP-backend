import { Database } from './Database';
import * as fs from 'fs/promises';
import { AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { PlayerData, SkaterStats, GoalieStats, TeamsInfo, WeeklyGames } from './types';
import {
    generateWeeklyGamesTally,
    generateWeeklyOffDayGamesTally,
} from '../../utilities/generateGameTallys';

// Axios with axios-retry to ensure any API calls that fail, get called again
// Without retry, sometimes random calls to the stats API fail
const axios = require('axios').default;
axiosRetry(axios, {
    retries: 3,
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`Request Config: ${requestConfig.url} -  Retry attempt # ${retryCount}`);
    },
});

export const FileDatabase: Database = {
    async createWeeklyGames(date1, date2) {
        interface GamesObj {
            home: number;
            away: number;
        }
        let weeklyGames: WeeklyGames[] = [];
        await axios
            .get(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${date1}&endDate=${date2}`)
            .then((response: AxiosResponse) => {
                let dates = response.data.dates;
                dates.map((day: any) => {
                    let games = day.games;
                    let thisDaysGames: GamesObj[] = [];
                    games.map((game: any) =>
                        thisDaysGames.push({
                            home: game.teams.home.team.id,
                            away: game.teams.away.team.id,
                        })
                    );
                    weeklyGames.push({ date: day.date, games: thisDaysGames });
                    return weeklyGames;
                });
                return weeklyGames;
            })
            .then((weeklyGames: WeeklyGames[]) => {
                // Write to file 'players.json'
                fs.writeFile('src/dataFiles/weeklyGames.json', JSON.stringify(weeklyGames)).catch(
                    (err) => {
                        console.log(err);
                    }
                );
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return [];
            });
    },

    async retrieveWeeklyGames() {
        let myResult: any;
        await fs
            .readFile('src/dataFiles/weeklyGames.json', 'utf8')
            .then((result) => {
                myResult = JSON.parse(result);
            })
            .catch((err) => {
                console.log(err);
                return [];
            });
        return myResult;
    },

    async createTeamsInfo() {
        let listOfTeams: TeamsInfo[] = [];
        await axios
            .get('https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster')
            .then((response: AxiosResponse) => {
                let teamsData = response.data.teams;

                teamsData.map((team: any) => {
                    let thisRoster: PlayerData[] = [];
                    // console.log(team.roster.roster);
                    // team.roster.roster.map((player: any) => console.log(player))
                    team.roster.roster.map((player: any) =>
                        thisRoster.push({
                            name: player.person.fullName,
                            id: player.person.id,
                            position: player.position.code,
                            teamId: team.id,
                            teamAbrv: team.abbreviation,
                        })
                    );

                    listOfTeams.push({
                        teamAbrv: team.abbreviation,
                        locationName: team.locationName,
                        teamName: team.teamName,
                        teamId: team.id,
                        teamRoster: thisRoster,
                    });
                    return listOfTeams;
                });
                return listOfTeams;
            })
            .catch((err: AxiosError) => {
                console.log(err);
                return [];
            })
            .then((listOfTeams: TeamsInfo[]) => {
                // Write to file 'players.json'
                fs.writeFile('src/dataFiles/teamsInfo.json', JSON.stringify(listOfTeams)).catch(
                    (err) => {
                        console.log(err);
                    }
                );
            });
    },

    async retrieveTeamsInfo() {
        let myResult: any;
        await fs
            .readFile('src/dataFiles/teamsInfo.json', 'utf8')
            .then((result) => {
                myResult = JSON.parse(result);
            })
            .catch((err) => {
                console.log(err);
                return [];
            });
        return myResult;
    },

    async createPlayerArrs(TeamsArr) {
        let playerArrs = [];
        let skatersArr: PlayerData[] = [];
        let goaliesArr: PlayerData[] = [];
        TeamsArr.map((team) => {
            // console.log(team.teamRoster);
            team.teamRoster.map((player) => {
                player.position === 'G' ? goaliesArr.push(player) : skatersArr.push(player);
            });
        });
        playerArrs.push(skatersArr, goaliesArr);
        await fs
            .writeFile('src/dataFiles/playerArrs.json', JSON.stringify(playerArrs))
            .catch((err) => console.log(err));
    },

    async retrievePlayerArrs() {
        let myResult: any;
        await fs
            .readFile('src/dataFiles/playerArrs.json', 'utf8')
            .then((result) => {
                myResult = JSON.parse(result);
            })
            .catch((err) => {
                console.log(err);
                return [];
            });
        return myResult;
    },

    async createSkaterStats(skatersArr, datesArr) {
        let skatersStatsArr: SkaterStats[] = [];
        let statsPromises = await Promise.all(
            skatersArr.map(async (skater) => {
                let id = skater.id;
                let url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=20212022`;
                let statsResponse = await axios
                    .get(url)
                    .then((response: AxiosResponse) => {
                        // console.log(`THIS IS THE STATS RESPONSE: ${response}`);
                        return response.data;
                    })
                    .catch((err: AxiosError) => {
                        console.log(
                            `ERROR while fetching STATS RESPONSE for NAME: ${skater.name} ID: ${skater.id}. ERROR: ${err}`
                        );
                    });
                return {
                    name: skater.name,
                    team: skater.teamAbrv,
                    teamId: skater.teamId,
                    playerStats: statsResponse,
                };
            })
        );

        const statsResponses = await Promise.all(statsPromises);
        //console.log(statsResponses);
        skatersStatsArr = statsResponses.reduce(
            (playerArr: SkaterStats[], currentPlayer, index) => {
                // console.log(`Logging: ${currentPlayer.name}`);
                // console.log(currentPlayer.playerStats.stats);
                let teamId = currentPlayer.teamId;
                let statsArr = currentPlayer.playerStats.stats[0].splits;
                let results: SkaterStats;
                let weeklyGames = generateWeeklyGamesTally(datesArr, teamId);
                let weeklyOffDayGames = generateWeeklyOffDayGamesTally(datesArr, teamId);
                if (statsArr.length > 0) {
                    let gamesPlayed = statsArr[0].stat.games;
                    if (gamesPlayed > 0) {
                        results = {
                            name: currentPlayer.name,
                            team: currentPlayer.team,
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
                            shortHandedTimeOnIcePerGame:
                                statsArr[0].stat.shortHandedTimeOnIcePerGame,
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
                // console.log(`THIS IS THE PLAYERS ARRAY: ${playerArr}`);
                return playerArr;
            },
            []
        );

        await fs
            .writeFile('src/dataFiles/skatersStatsArr.json', JSON.stringify(skatersStatsArr))
            .catch((err) => console.log(err));
        //console.log(`THIS IS THE SKATERS STATS ARRAY: ${skatersStatsArr}`);
    },

    async retrieveSkatersStats() {
        let myResult: any;
        await fs
            .readFile('src/dataFiles/skatersStatsArr.json', 'utf8')
            .then((result) => {
                myResult = JSON.parse(result);
            })
            .catch((err) => {
                console.log(err);
                return [];
            });
        return myResult;
    },

    async createGoaliesStats(goaliesArr, datesArr) {
        let goaliesStatsArr: GoalieStats[] = [];
        let statsPromises = await Promise.all(
            goaliesArr.map(async (goalie) => {
                let id = goalie.id;
                let url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=20212022`;
                let statsResponse = await axios
                    .get(url)
                    .then((response: AxiosResponse) => {
                        // console.log(`THIS IS THE STATS RESPONSE: ${response}`);
                        return response.data;
                    })
                    .catch((err: AxiosError) => {
                        console.log(
                            `ERROR while fetching STATS RESPONSE for NAME: ${goalie.name} ID: ${goalie.id}. ERROR: ${err}`
                        );
                    });
                return {
                    name: goalie.name,
                    team: goalie.teamAbrv,
                    teamId: goalie.teamId,
                    playerStats: statsResponse,
                };
            })
        );

        const statsResponses = await Promise.all(statsPromises);
        //console.log(statsResponses);
        goaliesStatsArr = statsResponses.reduce(
            (playerArr: GoalieStats[], currentPlayer, index) => {
                // console.log(`Logging: ${currentPlayer.name}`);
                // console.log(currentPlayer.playerStats.stats);
                let teamId = currentPlayer.teamId;
                let statsArr = currentPlayer.playerStats.stats[0].splits;
                let results: GoalieStats;
                let weeklyGames = generateWeeklyGamesTally(datesArr, teamId);
                let weeklyOffDayGames = generateWeeklyOffDayGamesTally(datesArr, teamId);
                if (statsArr.length > 0) {
                    let gamesPlayed = statsArr[0].stat.games;
                    if (gamesPlayed > 0) {
                        results = {
                            name: currentPlayer.name,
                            team: currentPlayer.team,
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
                // console.log(`THIS IS THE PLAYERS ARRAY: ${playerArr}`);
                return playerArr;
            },
            []
        );

        await fs
            .writeFile('src/dataFiles/goaliesStatsArr.json', JSON.stringify(goaliesStatsArr))
            .catch((err) => console.log(err));
        //console.log(`THIS IS THE SKATERS STATS ARRAY: ${skatersStatsArr}`);
    },

    async retrieveGoaliesStats() {
        let myResult: any;
        await fs
            .readFile('src/dataFiles/goaliesStatsArr.json', 'utf8')
            .then((result) => {
                myResult = JSON.parse(result);
            })
            .catch((err) => {
                console.log(err);
                return [];
            });
        return myResult;
    },
};
