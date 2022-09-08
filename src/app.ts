import express, { Express, Request, Response, NextFunction } from 'express';
import { Database } from './services/database/Database';
import { WeeklyGames, TeamsInfo, PlayerData } from './services/database/types';
import { FileDatabase } from './services/database/FileDatabase';
import { loggerFunc } from './middleware/Logger';
import { currentDate, endOfWeekDate } from './utilities/dates';

const app: Express = express();

const database: Database = FileDatabase;
// const useDatabase = async (req: Request, res: Response, next: NextFunction) => {
//     database.createWeeklyGames();
//     let datesArr = await database.retrieveWeeklyGames();
//     console.log(datesArr);
//     next();
// }

let datesArr: WeeklyGames[];
let teamsArr: TeamsInfo[];
let skatersArr: PlayerData[];
let goaliesArr: PlayerData[];
// {
//     teamAbrv: string;
//     locatonName: string;
//     teamName: string;
//     teamId: number;
//     teamRoster: {
//         name: string;
//         id: number;
//         position: string;
//     }[];
// };

app.use(loggerFunc);

app.use(async (req: Request, res: Response, next: NextFunction) => {
    await database.createTeamsInfo();
    next();
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
    await database.retrieveTeamsInfo().then((value) => {
        // console.log(`teamsArr: ${value}`);
        teamsArr = value;
    });
    next();
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
    await database.createPlayerArrs(teamsArr);
    next();
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
    await database.retrievePlayerArrs().then((value) => {
        skatersArr = value[0];
        goaliesArr = value[1];
    });
    next();
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
    await database.createWeeklyGames(currentDate, endOfWeekDate);
    next();
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
    await database.retrieveWeeklyGames().then((value) => {
        // console.log(`datesArr: ${value}`);
        datesArr = value;
    });
    next();
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
    await database.createSkaterStats(skatersArr, datesArr);
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send(datesArr);
});

app.listen(3000, () => {
    console.log(`Application listening at http://localhost:3000`);
});

// setInterval(() => {
//     // Grab api data from nhl

//     // format/aggregate

//     // save in database
//     database.savePlayerStats(stats);
// }, 1000);
