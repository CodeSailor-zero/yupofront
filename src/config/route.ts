//定义一些路由
import Index from "../pages/index.vue";
import TeamPage from "../pages/TeamPage.vue";
import UserPage from "../pages/UserPage.vue";
import SearchPage from "../pages/SearchPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import UserUpdatePage from "../pages/UserUpdatePage.vue";
import UserTeamCreatePage from "../pages/UserTeamCreatePage.vue";
import UserTeamJoinPage from "../pages/UserTeamJoinPage.vue";
import UserRegisterPage from "../pages/UserRegisterPage.vue";
import MyFriendPage from "../pages/MyFriendPage.vue";
import FriendInfoPage from "../pages/FriendInfoPage.vue";
import FriendApplyPage from "../pages/FriendApplyPage.vue";
import FriendChatPage from "../pages/FriendChatPage.vue";
import FriendAgreeApplyPage from "../pages/FriendAgreeApplyPage.vue";
import Blog from "../pages/Blog.vue";
import BlogCreatePage from "../pages/BlogCreatePage.vue";
import BlogDetailPage from "../pages/BlogDetailPage.vue";
import BlogSearchResultPage from "../pages/BlogSearchResultPage.vue";
import MyBlogPage from "../pages/MyBlogPage.vue";
import MyBlogUpdatePage from "../pages/MyBlogUpdatePage.vue";
import UpdateUserTags from "../pages/UpdateUserTags.vue";
import ScoreMyWebPage from "../pages/ScoreMyWebPage.vue";


const routes = [
    {path: '/',title: '首页', component: Index},
    {path: '/team', title: '找队伍',component: TeamPage},
    {path: '/team/add',title: '创建队伍', component: TeamAddPage},
    {path: '/team/update',title: '更新队伍', component: TeamUpdatePage},
    {path: '/user',title: '个人信息页', component: UserPage},
    {path: '/search',title: '找伙伴', component: SearchPage},
    {path: '/user/list',title: '用户列表', component: SearchResultPage},
    {path: '/user/edit',title: '编辑信息', component: UserEditPage},
    {path: '/user/login',title: '登录', component: UserLoginPage},
    {path: '/user/register',title: '登录', component: UserRegisterPage},
    {path: '/user/update',title: '更新信息', component: UserUpdatePage},
    {path: '/user/tags/update',title: '至少选择一个tag', component: UpdateUserTags},
    {path: '/user/team/join',title: '加入队伍',component: UserTeamJoinPage},
    {path: '/user/team/create', title: '创建队伍', component: UserTeamCreatePage},
    {path: '/my/friend', title: '好友列表', component: MyFriendPage},
    {path: '/friend/info', title: '好友信息', component: FriendInfoPage},
    {path: '/friend/apply', title: '好友申请', component: FriendApplyPage},
    {path: '/friend/agree', title: '好友申请列表', component: FriendAgreeApplyPage},
    {path: '/friend/chat', title: '好友聊天页面', component: FriendChatPage},
    {path: '/blog', title: '博客列表页', component: Blog},
    {path: '/blog/search/result', title: '博客搜索结果页', component: BlogSearchResultPage},
    {path: '/blog/add', title: '创建博客页', component: BlogCreatePage},
    {path: '/blog/detail', title: '博客详情页', component: BlogDetailPage},
    {path: '/my/blog', title: '我的博客页', component: MyBlogPage},
    {path: '/update/blog', title: '我的博客修改页', component: MyBlogUpdatePage},
    {path: '/score', title: '网站评分', component: ScoreMyWebPage},


]

export default routes;