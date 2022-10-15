import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Database, FileDatabase, Types } from './services/database/';
import { loggerFunc } from './middleware/Logger';
import { Apis, nhlApi } from './services/apis';
import {
    createTeamsArr,
    createGamesArr,
    createGoalieStats,
    createSkaterStats,
    createTeamSchedulesArr,
} from './utilities';
import { DateTime } from 'luxon';

const app: Express = express();
const database: Database = FileDatabase;

const main = async () => {
    const api: Apis = nhlApi;
    const now = DateTime.now();
    const currentWeekday = now.toFormat('cccc');
    const currentDate = now.toFormat("yyyy'-'LL'-'dd");
    const endOfWeekDate = now.endOf('week').toFormat("yyyy'-'LL'-'dd");

    // Get initial data from NHL api
    const weeklyGamesResponse =
        currentWeekday === 'Sunday'
            ? await api.getWeeklyGames(currentDate)
            : await api.getWeeklyGames(currentDate, endOfWeekDate);
    const teamsResponse = await api.getTeamsInfo();

    // Format teamsInfo to create players Array
    const teamsArr = createTeamsArr(teamsResponse);
    const playersArr: Types.PlayerData[] = [];
    teamsArr.map((team) => {
        team.teamRoster.map((player) => playersArr.push(player));
    });

    // Get player stats data from NHL api
    const playersStatsPromiseArr = await Promise.allSettled(
        playersArr.map(async (skater) => {
            const thisResponse = await api.getPlayerStats(skater);
            return {
                name: skater.name,
                id: skater.id,
                position: skater.position,
                teamAbrv: skater.teamAbrv,
                teamId: skater.teamId,
                playerStats: thisResponse,
            };
        })
    );
    const playersStatsResponseArr = playersStatsPromiseArr
        .filter(
            (res): res is PromiseFulfilledResult<Types.StatsResponsePlayerData> =>
                res.status === 'fulfilled'
        )
        .map((res) => res.value);

    const failedPlayersStatsResponseArr = playersStatsPromiseArr
        .filter((res): res is PromiseRejectedResult => res.status === 'rejected')
        .map((res) => res.reason);
    console.log(`FAILED RESPONSES: ${failedPlayersStatsResponseArr}`);

    // Split playerStatsResponseArr into skatersStatsResponseArr and goaliesStatsResponseArr
    const skatersStatsResponseArr: Types.StatsResponsePlayerData[] = [];
    const goaliesStatsResponseArr: Types.StatsResponsePlayerData[] = [];
    playersStatsResponseArr.map((player) => {
        player.position === 'G'
            ? goaliesStatsResponseArr.push(player)
            : skatersStatsResponseArr.push(player);
    });

    // Format weeklyGames to set up gamesArr
    const gamesArr: Types.WeeklyGames[] = createGamesArr(weeklyGamesResponse);

    // Format teamsArr and gamesArr to set up Team's Schedules File
    const teamsSchedules = createTeamSchedulesArr(teamsArr, gamesArr);

    // Format response Arrays to create skatersStatsArr and goaliesStatsArr
    const skaterStatsArr: Types.SkaterStats[] = createSkaterStats(
        skatersStatsResponseArr,
        gamesArr
    );
    const goalieStatsArr: Types.GoalieStats[] = createGoalieStats(
        goaliesStatsResponseArr,
        gamesArr
    );

    // Store it in our database
    await database.createWeeklyGamesFile(gamesArr);
    await database.createTeamsSchedulesFile(teamsSchedules);
    await database.createSkaterStatsFile(skaterStatsArr);
    await database.createGoaliesStatsFile(goalieStatsArr);
};

const calculateTimeoutDelay = () => {
    // Setting times in Eastern Standard Time to be consistent with NHL scheduling
    const now = DateTime.now().setZone('America/New_York');
    const currentTime = DateTime.now().setZone('America/New_York').toMillis();
    const today = now.toFormat("yyyy'-'LL'-'dd");
    const tomorrow = now.plus({ days: 1 }).toFormat("yyyy'-'LL'-'dd");
    const todayAt4am = DateTime.fromISO(`${today}T04:00:00.000`, {
        zone: 'America/New_York',
    }).toMillis();
    const tomorrowAt4am = DateTime.fromISO(`${tomorrow}T04:00:00.000`, {
        zone: 'America/New_York',
    }).toMillis();

    return todayAt4am - currentTime >= 0 ? todayAt4am - currentTime : tomorrowAt4am - currentTime;
};

let pollingJob = setTimeout(() => {
    main();
    pollingJob = setInterval(main, 1000 * 60 * 60 * 24);
}, calculateTimeoutDelay());

main();

app.use(loggerFunc);

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.json('Welcome to the nextUP server.');
});

app.get('/weeklyGames', async (req: Request, res: Response) => {
    res.json(await database.retrieveWeeklyGames());
});

app.get('/skaters', async (req: Request, res: Response) => {
    res.json(await database.retrieveSkatersStats());
});

app.get('/goalies', async (req: Request, res: Response) => {
    res.json(await database.retrieveGoaliesStats());
});
app.get('/teamsSchedules', async (req: Request, res: Response) => {
    res.json(await database.retrieveTeamsSchedules());
});

const PORT = process.env.PORT;
const URL = process.env.RAILWAY_STATIC_URL;
app.listen(PORT, () => {
    console.log(`Application listening at ${URL}:${PORT}`);
});

process.on('exit', () => {
    console.log('Cleaning up jobs...');
    clearInterval(pollingJob);
    console.log('Server shut down successfully');
});
