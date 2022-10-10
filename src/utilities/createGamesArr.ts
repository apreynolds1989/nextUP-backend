import { AxiosResponse } from 'axios';
import { WeeklyGames, GamesObj } from '../services/database/types';

export const createGamesArr = (datesResponse: AxiosResponse) => {
    let gamesArr: WeeklyGames[] = [];
    let dates = datesResponse.data.dates;
    dates.forEach((day: any) => {
        let games = day.games;
        let thisDaysGames: GamesObj[] = [];
        games.map((game: any) =>
            thisDaysGames.push({
                time: game.gameDate,
                homeId: game.teams.home.team.id,
                homeName: game.teams.home.team.name,
                awayId: game.teams.away.team.id,
                awayName: game.teams.away.team.name,
            })
        );
        gamesArr.push({ date: day.date, games: thisDaysGames });
        return gamesArr;
    });
    return gamesArr;
};
