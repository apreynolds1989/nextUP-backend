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
    // Generate an array of Game Objects for each day of the given week from the schedule API
    // Each game object lists the teamId for both the home and away teams
    // Dates handed in from dates.ts file where they are dynamically generated
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

    // Generate an Array of Team Objects from the teams API
    // Each Team response is mapped over to access the team roster
    // Team's teamAbrv, locationName, teamName, teamId and player info are pushed into an array
    // The list of teams array is written to a 'teamsInfo.json' file
    async createTeamsInfo() {
        let listOfTeams: TeamsInfo[] = [];
        await axios
            .get('https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster')
            .then((response: AxiosResponse) => {
                let teamsData = response.data.teams;

                teamsData.map((team: any) => {
                    let thisRoster: PlayerData[] = [];
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

    // Use the previously generated Teams Array to access each player off each roster
    // Players are split into skatersArr and goaliesArr based on their position
    // Returns an Array which contains the skatersArr and goaliesArr
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

    // Takes in the previously generated skatersArr and the weeklyGames Array
    // Generate stats for every active NHL non-goalie player from the stats API
    // Each player requires a unique API call based on their id, calls are made al at once with Promise.all
    // After Promises are returned, each player is mapped over and their stats Object is pushed to an Array
    // the stats array is then written to a 'skatersStatsArr.json' file
    async createSkaterStats(skatersArr, datesArr) {
        let skatersStatsArr: SkaterStats[] = [];
        let statsPromises = await Promise.all(
            skatersArr.map(async (skater) => {
                let id = skater.id;
                let url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=20212022`;
                let statsResponse = await axios
                    .get(url)
                    .then((response: AxiosResponse) => {
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
        skatersStatsArr = statsResponses.reduce(
            (playerArr: SkaterStats[], currentPlayer, index) => {
                // console.log(`Logging: ${currentPlayer.name}`);
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
                return playerArr;
            },
            []
        );

        await fs
            .writeFile('src/dataFiles/skatersStatsArr.json', JSON.stringify(skatersStatsArr))
            .catch((err) => console.log(err));
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

    // Takes in the previously generated goaliesArr and the weeklyGames Array
    // Generate stats for every active NHL goalie from the stats API
    // Each goalie requires a unique API call based on their id, calls are made al at once with Promise.all
    // After Promises are returned, each goalie is mapped over and their stats Object is pushed to an Array
    // the stats array is then written to a 'goaliesStatsArr.json' file
    async createGoaliesStats(goaliesArr, datesArr) {
        let goaliesStatsArr: GoalieStats[] = [];
        let statsPromises = await Promise.all(
            goaliesArr.map(async (goalie) => {
                let id = goalie.id;
                let url = `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=20212022`;
                let statsResponse = await axios
                    .get(url)
                    .then((response: AxiosResponse) => {
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
        goaliesStatsArr = statsResponses.reduce(
            (playerArr: GoalieStats[], currentPlayer, index) => {
                // console.log(`Logging: ${currentPlayer.name}`);
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
                return playerArr;
            },
            []
        );

        await fs
            .writeFile('src/dataFiles/goaliesStatsArr.json', JSON.stringify(goaliesStatsArr))
            .catch((err) => console.log(err));
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
