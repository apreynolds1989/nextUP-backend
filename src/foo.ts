const axios = require('axios').default;

async function main() {
    const url =
        'https://statsapi.web.nhl.com/api/v1/people/8480382/stats?stats=statsSingleSeason&season=20212022';

    const promises = [];

    for (let i = 0; i < 100; i++) {
        promises.push(axios.get(url));
    }

    const results = await Promise.allSettled(promises);

    // @ts-ignore
    results.forEach((result) =>
        console.log(`RES: ${result.status}: ${result?.value?.data ?? null}`)
    );
}

main().catch((e) => console.error(e));
