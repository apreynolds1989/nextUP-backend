import * as postgres from 'postgres';

const func = async () => {
    const sql = postgres.default({
        database: 'nextup',
        username: 'postgres',
        password: '',
    });
    const foo = await sql`insert into test(id, name) values(1, 'Andrew') returning *`;
    console.log(JSON.stringify(foo));
};

func();
