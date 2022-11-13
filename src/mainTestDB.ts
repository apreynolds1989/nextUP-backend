import * as postgres from 'postgres';

const func = async () => {
    const sql = postgres.default({
        database: 'nextup',
        username: 'postgres',
        password: '',
    });
    const columns = ['date', 'time', 'home_id', 'home_name', 'away_id', 'away_name'];
    console.log(`columns: ${columns}`);
    const retrieveWeeklyGames = await sql`select ${sql(columns)} from weekly_games`;
    console.log(retrieveWeeklyGames);
};

func();
