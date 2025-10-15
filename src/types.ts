export type Role = "admin" | "doctor" | "nurse" | "patient" | "other";


export interface UserSession {
username: string;
password: string;
role: Role | string;
loggedIn: boolean;
}