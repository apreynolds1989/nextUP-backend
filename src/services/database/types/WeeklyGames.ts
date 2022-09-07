export interface WeeklyGames {
    date: string;
    games: {
        home: number;
        away: number;
    }[];
}