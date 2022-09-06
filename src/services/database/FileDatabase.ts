import { Database } from './Database';
import * as fs from 'fs/promises';
import weeklyGamesJSON from '../../dataFIles/mockWeeklyGamesJSON.json';
import { AxiosError, AxiosResponse } from 'axios';

const axios = require('axios').default;

export const FileDatabase: Database = {
    createWeeklyGames() {
        axios.get('https://statsapi.web.nhl.com/api/v1/schedule?startDate=2022-01-02&endDate=2022-01-08')
            .catch((error: AxiosError) => {
                console.log(error);
            })
            .then((response: AxiosResponse) => {
                // Write to file 'players.json'
                fs.writeFile('src/dataFiles/weeklyGames.json', JSON.stringify(response.data))
                    .catch((err) => {
                        console.log(err);
                    })
            })    
    },

    async retrieveWeeklyGames() {
        interface GamesObj {
            home: number,
            away: number
        }
        let weeklyGames: GamesObj[] = [];
        // Read from file 'weeklyGames.json'
        await fs.readFile('src/dataFiles/weeklyGames.json', 'utf8')
            .then((result) => {
                let myResult = JSON.parse(result);
                let dates = myResult.dates;
                
                dates.map((day: any) => {
                    let games = day.games;
                    games.map((game: any) => weeklyGames.push({home: game.teams.home.team.id, away: game.teams.away.team.id}));
                    return weeklyGames;
                });
                return weeklyGames;
            })
            .catch((err) => {
                return [];
            })
        return weeklyGames;
    },
}