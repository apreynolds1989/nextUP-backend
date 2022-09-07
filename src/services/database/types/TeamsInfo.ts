import { PlayerData } from "./PlayerData";

export interface TeamsInfo {
    teamAbrv: string;
    teamName: string;
    locatonName: string;
    teamId: number;
    teamRoster: PlayerData[];
}

