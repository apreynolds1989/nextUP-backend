import { Types } from '../services/database';

export const generateWeeklyGamesTally = (datesArr: Types.WeeklyGames[], teamNum: number) => {
    let playerGamesTally = 0;
    datesArr.map((date) => {
        date.games.map((game) => {
            let awayTeam = game.awayId;
            let homeTeam = game.homeId;
            if (awayTeam === teamNum || homeTeam === teamNum) playerGamesTally++;
        });
    });
    return playerGamesTally;
};

export const generateWeeklyOffDayGamesTally = (datesArr: Types.WeeklyGames[], teamNum: number) => {
    let playerOffDayGamesTally = 0;
    datesArr.map((date, dateIndex) => {
        date.games.map((game) => {
            if (datesArr.length % 2) {
                if (dateIndex === 0 || dateIndex === 2 || dateIndex === 4 || dateIndex === 6) {
                    let awayTeam = game.awayId;
                    let homeTeam = game.homeId;
                    if (awayTeam === teamNum || homeTeam === teamNum) playerOffDayGamesTally++;
                }
            } else {
                if (dateIndex === 1 || dateIndex === 3 || dateIndex === 5) {
                    let awayTeam = game.awayId;
                    let homeTeam = game.homeId;
                    if (awayTeam === teamNum || homeTeam === teamNum) playerOffDayGamesTally++;
                }
            }
        });
    });
    return playerOffDayGamesTally;
};
