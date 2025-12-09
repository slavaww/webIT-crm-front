import { getUserDataFromToken } from './authUtils';

const userData = getUserDataFromToken();
export const isRole = {
    client: userData?.roles.includes('ROLE_USER') && !userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
    admin: userData?.roles.includes('ROLE_ADMIN') && !userData?.roles.includes('ROLE_SUPER_ADMIN'),
    superAdmin: userData?.roles.includes('ROLE_SUPER_ADMIN'),
};