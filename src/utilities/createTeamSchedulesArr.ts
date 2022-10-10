import { Types } from '../services/database';

// Create an array of objects which contain the team name and their opponent on each day of the week
// if they have no game on a given day, that day will contain an empty string
export const createTeamSchedulesArr = (
    teamsArr: Types.TeamsInfo[],
    gamesArr: Types.WeeklyGames[]
) => {
    const teamSchedulesArr: Types.TeamsSchedule[] = [];

    // map over the teams array to get each teams id
    teamsArr.map((team) => {
        const thisTeamsId = team.teamId;
        const teamName = {
            team: team.locationName,
        };
        let dates: { [date: string]: string } = {};

        // use each team's id to map over each day of the week, then each game on each day
        // if a game contains the team's id, store the opponent's id
        // map over the teamsArr again to get the opponent's name based on the id
        // return the opponent's name
        gamesArr.map((day) => {
            let opponentName: string = '';
            day.games.map((game) => {
                const opponentId =
                    thisTeamsId === game.homeId
                        ? game.awayId
                        : thisTeamsId === game.awayId
                        ? game.homeId
                        : null;
                if (opponentId) {
                    teamsArr.map((team) => {
                        if (team.teamId === opponentId) opponentName = team.locationName;
                    });
                }
                return opponentName;
            });

            // append date: opponent to the dates object for each date
            dates = Object.assign(dates, { [day.date]: opponentName });
        });
        // assign the teamName Obj and dates Obj to a new Obj
        const teamsSchedule = Object.assign(teamName, dates);
        // push the newly created Obj into the array and return the array
        teamSchedulesArr.push(teamsSchedule);
    });
    return teamSchedulesArr;
};
