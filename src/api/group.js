import _axios from '@/plugins/axios';


// 群聊列表
export function groupList() {
    return _axios({
        url: '/group/list',
        method: 'get'
    })

}

//群聊详情信息
export function groupInfo(groupId) {
    return _axios({
        url: '/group/info',
        method: 'post',
        data:{
            groupId
        }
    })
}

//获取完整群成员
export function groupMembers(groupId) {
    return _axios({
        url: '/group/members',
        method: 'post',
        data:{
            groupId
        }
    })
}

//修改群名称
export function groupeditName(groupId, name) {
    return _axios({
        url: '/group/editName',
        method: 'post',
        data:{
            groupId,
            name
        }
    })
}

//修改群公告
export function groupeditAnno(groupId, announcement) {
    return _axios({
        url: '/group/editAnno',
        method: 'post',
        data:{
            groupId,
            announcement
        }
    })
}
