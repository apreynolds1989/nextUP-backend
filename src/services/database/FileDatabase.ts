import { Database } from './Database';
import * as fs from 'fs/promises';
import { AxiosError, AxiosResponse } from 'axios';

const axios = require('axios').default;

export const FileDatabase: Database = {
    async createWeeklyGames(date1, date2) {
        interface GamesObj {
            home: number;
            away: number;
        }
        interface DayObj {
            date: string;
            games: GamesObj[];
        }
        let weeklyGames: DayObj[] = [];
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
            .then((weeklyGames: GamesObj[]) => {
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
        interface PlayerObj {
            name: string;
            id: number;
            position: string;
        }
        interface TeamObj {
            teamAbrv: string;
            locationName: string;
            teamName: string;
            teamId: number;
            teamRoster: PlayerObj[];
        }
        let listOfTeams: TeamObj[] = [];
        await axios
            .get('https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster')
            .then((response: AxiosResponse) => {
                let teamsData = response.data.teams;

                teamsData.map((team: any) => {
                    let thisRoster: PlayerObj[] = [];
                    // console.log(team.roster.roster);
                    // team.roster.roster.map((player: any) => console.log(player))
                    team.roster.roster.map((player: any) =>
                        thisRoster.push({
                            name: player.person.fullName,
                            id: player.person.id,
                            position: player.position.code,
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
            .then((listOfTeams: TeamObj[]) => {
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
        interface Player {
            name: string;
            id: number;
            position: string;
        }
        let playerArrs = [];
        let skatersArr: Player[] = [];
        let goaliesArr: Player[] = [];
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
                console.log(myResult);
            })
            .catch((err) => {
                console.log(err);
                return [];
            });
        return myResult;
    },

    async createSkaterStats() {},
};
