import { AxiosResponse } from 'axios';
import { Types } from '../database';

// YYYY-MM-DD
//? TypeScript tells me "Argument of type 'string' is not assignable to parameter of type `${string}-${string}-${string}`"
// type IsoDate = `${string}-${string}-${string}`;

export interface Apis {
    getWeeklyGames: (date1: string, date2?: string) => Promise<AxiosResponse>;

    getTeamsInfo: () => Promise<AxiosResponse>;

    getPlayerStats: (playerData: Types.PlayerData) => Promise<AxiosResponse>;
}
