import {UserType} from "../models/user";

let currentUser : UserType;

const setCurrentUserStates = (user: UserType) => {
    currentUser = user;
}

const getCurrentUserStates = (): UserType => {
    return currentUser;
}

export {
    setCurrentUserStates,
    getCurrentUserStates,
}