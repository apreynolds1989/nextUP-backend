import { AxiosResponse } from 'axios';
import { WeeklyGames, GamesObj } from '../services/database/types';

export const createGamesArr = (datesResponse: AxiosResponse) => {
    let gamesArr: WeeklyGames[] = [];
    let dates = datesResponse.data.dates;
    dates.map((day: any) => {
        let games = day.games;
        let thisDaysGames: GamesObj[] = [];
        games.map((game: any) =>
            thisDaysGames.push({
                home: game.teams.home.team.id,
                away: game.teams.away.team.id,
            })
        );
        gamesArr.push({ date: day.date, games: thisDaysGames });
        return gamesArr;
    });
    return gamesArr;
};
