export type RecordsType = {
    /**
     * id
     */
    id: number;

    /**
     * 用户昵称
     */
    username : string;

    /**
     * 账号
     */
    userAccount: string;

    /**
     * 用户头像
     */
    avatarUrl : string;


    /**
     * 0-未通过 1-已同意 2-已过期 3-已撤销
     */
    status : number;

    /**
     * 好友申请的描述
     */
    remark : string;


    /**
     * 用户标签
     */
    tags : string;
}