import express, { Express, Request, Response, NextFunction } from 'express';
import { Database } from './services/database/Database';
import { WeeklyGames } from './types';
import { FileDatabase } from './services/database/FileDatabase';
import { loggerFunc } from './middleware/Logger';

const app: Express = express();

const database: Database = FileDatabase;
const useDatabase = async (req: Request, res: Response, next: NextFunction) => {
    database.createWeeklyGames();
    let gamesArr = await database.retrieveWeeklyGames();
    console.log(gamesArr);
    next();
}

let gamesArr: WeeklyGames[];

app.use(loggerFunc);

app.use((req: Request, res: Response, next: NextFunction) => {
    database.createWeeklyGames();
    next();
});

app.use(async (req: Request, res: Response, next: NextFunction) => {

    await database.retrieveWeeklyGames().then((value) => {
        gamesArr = value;
    });
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send(gamesArr)
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
