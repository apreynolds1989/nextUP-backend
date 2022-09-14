import express, { Express, Request, Response, NextFunction } from 'express';
import { Database } from './services/database/Database';
import {
    WeeklyGames,
    TeamsInfo,
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

const app: Express = express();

const database: Database = FileDatabase;
// const useDatabase = async (req: Request, res: Response, next: NextFunction) => {
//     database.createWeeklyGames();
//     let datesArr = await database.retrieveWeeklyGames();
//     console.log(datesArr);
//     next();
// }

setInterval(async () => {
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
    const playersStatsResponseArr = await Promise.all(
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

    // Format response Arrays to create skatersStatsArr and goaliesStatsArr
    const skaterStatsArr: SkaterStats[] = createSkaterStats(skatersStatsResponseArr, gamesArr);
    const goalieStatsArr: GoalieStats[] = createGoalieStats(goaliesStatsResponseArr, gamesArr);

    // Store it in our database
    database.createWeeklyGamesFile(gamesArr);
    database.createSkaterStatsFile(skaterStatsArr);
    database.createGoaliesStatsFile(goalieStatsArr);
}, 1000 * 60 * 60 * 24);

app.use(loggerFunc);

app.get('/', async (req: Request, res: Response) => {
    res.send(await database.retrieveWeeklyGames());
});

app.get('/skaters', async (req: Request, res: Response) => {
    res.send(await database.retrieveSkatersStats());
});

app.get('/goalies', async (req: Request, res: Response) => {
    res.send(await database.retrieveGoaliesStats());
});

app.listen(3000, () => {
    console.log(`Application listening at http://localhost:3000`);
});
