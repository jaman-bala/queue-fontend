import { UserRoles } from '@shared/hooks/useAuth';

export const getFormattedName = (name: string, role: UserRoles): string => {
    console.log(name);
    if (name === 'Yryskeldi') {
        return 'RY';
    }
    if (role === 'spectator') {
        return 'TV';
    }
    if (role === 'admin') {
        return 'MS';
    }
    const splittedName = name.split(' ');
    let formattedName = `${splittedName[0][0]}${splittedName[1][0]}`;
    return formattedName;
};
