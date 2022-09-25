import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Database } from './services/database/Database';
import {
    WeeklyGames,
    PlayerData,
    SkaterStats,
    GoalieStats,
    StatsResponsePlayerData,
} from './services/database/types';
import { FileDatabase } from './services/database/FileDatabase';
import { loggerFunc } from './middleware/Logger';
import { currentDate, endOfWeekDate } from './utilities/dates';
import { nhlApi } from './services/apis/nhl';
import { Apis } from './services/apis/Apis';
import { createTeamsArr } from './utilities/createTeamsArr';
import { createGamesArr } from './utilities/createGamesArr';
import { createGoalieStats, createSkaterStats } from './utilities/generateStats';
import { createTeamSchedulesArr } from './utilities/createTeamSchedulesArr';

const app: Express = express();

const database: Database = FileDatabase;

const main = async () => {
    const api: Apis = nhlApi;

    // Get initial data from NHL api
    const weeklyGamesResponse = await api.getWeeklyGames(currentDate, endOfWeekDate);
    const teamsResponse = await api.getTeamsInfo();

    // Format teamsInfo to create players Array
    const teamsArr = createTeamsArr(teamsResponse);
    const playersArr: PlayerData[] = [];
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
            (res): res is PromiseFulfilledResult<StatsResponsePlayerData> =>
                res.status === 'fulfilled'
        )
        .map((res) => res.value);

    const failedPlayersStatsResponseArr = playersStatsPromiseArr
        .filter((res): res is PromiseRejectedResult => res.status === 'rejected')
        .map((res) => res.reason);
    console.log(failedPlayersStatsResponseArr);

    // Split playerStatsResponseArr into skatersStatsResponseArr and goaliesStatsResponseArr
    const skatersStatsResponseArr: StatsResponsePlayerData[] = [];
    const goaliesStatsResponseArr: StatsResponsePlayerData[] = [];
    playersStatsResponseArr.map((player) => {
        player.position === 'G'
            ? goaliesStatsResponseArr.push(player)
            : skatersStatsResponseArr.push(player);
    });

    // Format weeklyGames to set up gamesArr
    const gamesArr: WeeklyGames[] = createGamesArr(weeklyGamesResponse);

    // Format teamsArr and gamesArr to set up Team's Schedules File
    const teamsSchedules = createTeamSchedulesArr(teamsArr, gamesArr);

    // Format response Arrays to create skatersStatsArr and goaliesStatsArr
    const skaterStatsArr: SkaterStats[] = createSkaterStats(skatersStatsResponseArr, gamesArr);
    const goalieStatsArr: GoalieStats[] = createGoalieStats(goaliesStatsResponseArr, gamesArr);

    // Store it in our database
    await database.createWeeklyGamesFile(gamesArr);
    await database.createTeamsSchedulesFile(teamsSchedules);
    await database.createSkaterStatsFile(skaterStatsArr);
    await database.createGoaliesStatsFile(goalieStatsArr);
};

const pollingJob = setInterval(() => main(), 1000 * 60 * 60 * 24);

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

app.listen(3000, () => {
    console.log(`Application listening at http://localhost:3000`);
});

process.on('exit', () => {
    console.log('Cleaning up jobs...');
    clearInterval(pollingJob);
    console.log('Server shut down successfully');
});
