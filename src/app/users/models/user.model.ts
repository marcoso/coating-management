import { UserRoles } from "src/app/core/enums/user-roles";

export class User {
    userId: string;
    username: string;
    password: string;    
    firstName: string;
    lastName: string;    
    role: UserRoles
    isActive: boolean = false;    
    createdAt: string;
    updatedAt: string; 

    constructor() {}
}