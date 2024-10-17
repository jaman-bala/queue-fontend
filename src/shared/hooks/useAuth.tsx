import { jwtDecode } from 'jwt-decode';

export type UserRoles =
    | 'specialist'
    | 'spectator'
    | 'operator'
    | 'admin'
    | 'idle';

interface UserInfoPayload {
    UserInfo: {
        user: string;
        username: string;
        role: UserRoles;
        ticketsType: 'TS' | 'VS';
        name: string;
    };
    DepartmentInfo: {
        departmentId: string;
        name: string;
    };
    SessionInfo: {
        sessionId: string;
        windowNumber: number;
    };
}

const useAuth = () => {
    const token = localStorage.getItem('token');

    let userId = '';
    let username = '';
    let role: UserRoles = 'idle';
    let departmentId = '';
    let departmentName = '';
    let sessionId = '';
    let ticketsType = '';
    let windowNumber = 0;
    let name = '';

    const processToken = (decodedToken: UserInfoPayload) => {
        const { UserInfo, DepartmentInfo, SessionInfo } = decodedToken;

        return {
            userId: UserInfo.user,
            username: UserInfo.username,
            role: UserInfo.role,
            ticketsType: UserInfo.ticketsType,
            name: UserInfo.name,
            departmentId: DepartmentInfo.departmentId,
            departmentName: DepartmentInfo.name,
            sessionId: SessionInfo.sessionId,
            windowNumber: SessionInfo.windowNumber,
        };
    };

    try {
        if (token) {
            const decodedToken = jwtDecode<UserInfoPayload>(token);
            const decodedData = processToken(decodedToken);

            userId = decodedData.userId;
            username = decodedData.username;
            role = decodedData.role;
            departmentId = decodedData.departmentId;
            departmentName = decodedData.departmentName;
            sessionId = decodedData.sessionId;
            ticketsType = decodedData.ticketsType;
            windowNumber = decodedData.windowNumber;
            name = decodedData.name;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
    }

    return {
        userId,
        username,
        role,
        departmentId,
        departmentName,
        sessionId,
        ticketsType,
        windowNumber,
        name,
    };
};

export default useAuth;
