import {UserType} from "./user";

/**
 * 用户类别
 */
export type BlogType = {
    /**
     * 博客文章Id
     */
    blogId : number;

    /**
     * 创建人
     */

    createUser : UserType;

    /**
     * 标题
     */
    tittle : string;

    /**
     * 正文
     */
    text : string;

    /**
     * 话题标签 | json字符串
     */
    topicTags : string;

    /**
     * 点赞数
     */
    remarkNum : number;

    /**
     * 浏览量
     */
    startNum : number;

    /**
     * 创建时间
     */
    createTime : Date;
}