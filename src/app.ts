import express, { Express, Request, Response } from 'express';
import { loggerFunc } from './middleware/Logger';

const app: Express = express();


// const database: Database = FileDatabase;

app.use(loggerFunc);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
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
