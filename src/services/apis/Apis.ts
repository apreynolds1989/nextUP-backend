import { AxiosResponse } from 'axios';
import { PlayerData } from '../database/types';

export interface Apis {
    getWeeklyGames: (date1: string, date2?: string) => Promise<AxiosResponse>;

    getTeamsInfo: () => Promise<AxiosResponse>;

    getPlayerStats: (playerData: PlayerData) => Promise<AxiosResponse>;
}
