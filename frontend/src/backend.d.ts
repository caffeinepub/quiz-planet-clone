import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Question {
    correctOption: bigint;
    text: string;
    category: string;
    options: Array<string>;
}
export interface backendInterface {
    answerQuestion(playerName: string, answerIndex: bigint): Promise<boolean>;
    checkUsernameAvailable(username: string): Promise<boolean>;
    getCategories(): Promise<Array<string>>;
    getHighScores(): Promise<Array<[string, bigint]>>;
    getPlayerScore(playerName: string): Promise<bigint>;
    getQuestion(playerName: string): Promise<Question>;
    isGameFinished(playerName: string): Promise<boolean>;
    startNewGame(playerName: string): Promise<void>;
}
