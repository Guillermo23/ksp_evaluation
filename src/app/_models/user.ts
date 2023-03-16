import { Role } from './role';
import { Beneficiary } from './beneficiary';

export class User {
    id!: string;
    title!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    role!: Role;
    beneficiary?: Beneficiary
    isDeleting: boolean = false;
}