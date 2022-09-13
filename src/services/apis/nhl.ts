import { AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { Apis } from './Apis';

const axios = require('axios').default;
axiosRetry(axios, {
    retries: 3,
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`Request Config: ${requestConfig.url} -  Retry attempt # ${retryCount}`);
    },
});
// const api = axios.create({
//     baseUrl: 'https://statsapi.web.nhl.com/api/v1/',
// });
// ? The above was giving the following error:
// ? Error: connect ECONNREFUSED 127.0.0.1:80 at TCPConnectWrap.afterConnect [as oncomplete]

export const nhlApi: Apis = {
    async getWeeklyGames(date1, date2) {
        return await axios
            .get(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${date1}&endDate=${date2}`)
            .catch((err: AxiosError) => {
                console.log(`ERROR at getWeeklyGames: ${err}`);
                return [];
            });
    },

    async getTeamsInfo() {
        return await axios
            .get('https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster')
            .catch((err: AxiosError) => {
                console.log(`ERROR at getTeamsInfo: ${err}`);
                return [];
            });
    },

    async getPlayerStats(playerData) {
        return await axios
            .get(
                `https://statsapi.web.nhl.com/api/v1/people/${playerData.id}/stats?stats=statsSingleSeason&season=20212022`
            )
            .catch((err: AxiosError) => {
                console.log(`ERROR at getPlayerStats: ${err} for ${playerData.name}`);
            });
    },
};
