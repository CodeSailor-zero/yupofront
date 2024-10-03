import {userType} from "./user";

/**
 * 队伍类别
 */
export type TeamType = {
    id: number;
    name: string;
    description: string;
    expireTime?: Date;
    maxNum: number;
    password?: string;
    // todo 定义枚举值，更加规范
    status: number;
    createTime: Date;
    updateTime: Date;
    createUser?: userType;
    hasJoin: boolean;
    hasJoinNum?: number;
}