import { AxiosResponse } from 'axios';
import { Types } from '../services/database';

export const createGamesArr = (datesResponse: AxiosResponse) => {
    const gamesArr: Types.WeeklyGames[] = [];
    const dates = datesResponse.data.dates;
    dates.forEach((day: any) => {
        const games = day.games;
        const thisDaysGames: Types.GamesObj[] = [];
        games.forEach((game: any) =>
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
