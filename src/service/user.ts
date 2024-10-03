import myAxios from "../plugins/myAxios";
import {setCurrentUserStates} from "../states/user";

export const getCurrentUser = async () => {
    // const currentUser = getCurrentUserStates();
    // if (currentUser){
    //     return currentUser;
    // }
    //不存在则从远程获取
    const res = await myAxios.get('/user/current');
    if (res.code === 0) {
        setCurrentUserStates(res.data);
        return res.data;
    }
    return null;
}
