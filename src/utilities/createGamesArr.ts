import { AxiosResponse } from 'axios';
import { Types } from '../services/database';

export const createGamesArr = (datesResponse: AxiosResponse) => {
    let gamesArr: Types.WeeklyGames[] = [];
    let dates = datesResponse.data.dates;
    dates.forEach((day: any) => {
        let games = day.games;
        let thisDaysGames: Types.GamesObj[] = [];
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
