import { AxiosResponse } from 'axios';
import { TeamsInfo, PlayerData } from '../services/database/types';

export const createTeamsArr = (teamsResponse: AxiosResponse) => {
    let teamsArr: TeamsInfo[] = [];
    let teamsData = teamsResponse.data.teams;
    teamsData.map((team: any) => {
        let thisRoster: PlayerData[] = [];
        team.roster.roster.map((player: any) =>
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
