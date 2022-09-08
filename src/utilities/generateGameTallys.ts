import { WeeklyGames } from '../services/database/types';

export const generateWeeklyGamesTally = (datesArr: WeeklyGames[], teamNum: number) => {
    let playerGamesTally = 0;
    datesArr.map((date) => {
        date.games.map((game) => {
            let awayTeam = game.away;
            let homeTeam = game.home;
            if (awayTeam === teamNum || homeTeam === teamNum) playerGamesTally++;
        });
    });
    return playerGamesTally;
};

export const generateWeeklyOffDayGamesTally = (datesArr: WeeklyGames[], teamNum: number) => {
    let playerOffDayGamesTally = 0;
    datesArr.map((date, dateIndex) => {
        date.games.map((game) => {
            if (datesArr.length % 2) {
                if (dateIndex === 0 || dateIndex === 2 || dateIndex === 4 || dateIndex === 6) {
                    let awayTeam = game.away;
                    let homeTeam = game.home;
                    if (awayTeam === teamNum || homeTeam === teamNum) playerOffDayGamesTally++;
                }
            } else {
                if (dateIndex === 1 || dateIndex === 3 || dateIndex === 5) {
                    let awayTeam = game.away;
                    let homeTeam = game.home;
                    if (awayTeam === teamNum || homeTeam === teamNum) playerOffDayGamesTally++;
                }
            }
        });
    });
    return playerOffDayGamesTally;
};
