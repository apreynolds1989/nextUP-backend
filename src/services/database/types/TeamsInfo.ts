import { PlayerData } from './PlayerData';

export interface TeamsInfo {
    teamAbrv: string;
    teamName: string;
    locationName: string;
    teamId: number;
    teamRoster: PlayerData[];
}
