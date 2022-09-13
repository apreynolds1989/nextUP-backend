import { AxiosResponse } from 'axios';

export interface PlayerData {
    name: string;
    id: number;
    position: string;
    teamId: number;
    teamAbrv: string;
}

export interface StatsResponsePlayerData extends PlayerData {
    playerStats: AxiosResponse;
}
