import { AxiosResponse } from 'axios';
import { Types } from '../database';

export interface Apis {
    getWeeklyGames: (date1: string, date2?: string) => Promise<AxiosResponse>;

    getTeamsInfo: () => Promise<AxiosResponse>;

    getPlayerStats: (playerData: Types.PlayerData) => Promise<AxiosResponse>;
}
