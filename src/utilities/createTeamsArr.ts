import { AxiosResponse } from 'axios';
import { Types } from '../services/database';

export const createTeamsArr = (teamsResponse: AxiosResponse) => {
    const teamsArr: Types.TeamsInfo[] = [];
    const teamsData = teamsResponse.data.teams;
    teamsData.forEach((team: any) => {
        const thisRoster: Types.PlayerData[] = [];
        team.roster.roster.forEach((player: any) =>
            thisRoster.push({
                name: player.person.fullName,
                id: player.person.id,
                position: player.position.code,
                teamId: team.id,
                teamAbrv: team.abbreviation,
            })
        );

        teamsArr.push({
            teamAbrv: team.abbreviation,
            locationName: team.locationName,
            teamName: team.teamName,
            teamId: team.id,
            teamRoster: thisRoster,
        });
        return teamsArr;
    });
    return teamsArr;
};
