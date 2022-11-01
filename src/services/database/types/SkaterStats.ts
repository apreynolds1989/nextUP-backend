export interface SkaterStats {
    name: string;
    team: string;
    gamesPlayed: number;
    weeklyGames: number;
    weeklyOffDayGames: number;
    goals: number;
    assists: number;
    points: number;
    gameWinningGoals: number;
    pointsPerGame: number;
    timeOnIcePerGame: string;
    powerPlayGoals: number;
    powerPlayPoints: number;
    powerPlayTimeOnIcePerGame: string;
    shortHandedGoals: number;
    shortHandedPoints: number;
    shortHandedTimeOnIcePerGame: string;
    hits: number;
    blocks: number;
    shots: number;
    faceoffPercentage: number;
    penaltyMinutes: number;
}
