import {VRChatAPIGet, VRChatAPIDelete, VRChatAPIPut} from '../utils/ApiUtils';
import {
    ToastAndroid,
    Alert
} from "react-native";
import {translate} from '../translate/TranslateUtils';

export const UserTagColor = {
    'system_legend': '#f8bc3a',
    'system_trust_legend': '#be64a5',
    'system_trust_veteran': '#be64a5',
    'system_trust_trusted': '#ff781e',
    'system_trust_known': '#64be46',
    'system_trust_basic': '#392be7',
    'none': '#dcdcdc'
}

export const UserTagName = {
    'system_legend': 'Legend',
    'system_trust_legend': 'Veteran',
    'system_trust_veteran': 'Trusted',
    'system_trust_trusted': 'Known',
    'system_trust_known': 'User',
    'system_trust_basic': 'New User',
    'none': 'Visitor'
}

export function UserGrade(tags){
    if(tags === undefined || tags == null){
        return UserTagColor.none;
    }
    let tagList = tags.join('/')

    if(tagList.includes('system_legend')) return UserTagColor.system_trust_legend;
    if(tagList.includes('system_trust_legend')) return UserTagColor.system_trust_legend;
    if(tagList.includes('system_trust_veteran')) return UserTagColor.system_trust_veteran;
    if(tagList.includes('system_trust_trusted')) return UserTagColor.system_trust_trusted;
    if(tagList.includes('system_trust_known')) return UserTagColor.system_trust_known;
    if(tagList.includes('system_trust_basic')) return UserTagColor.system_trust_basic;
    else return UserTagColor.none;
}

export function UserGradeName(tags){
    if(tags === undefined || tags == null){
        return UserTagName.none;
    }
    let tagList = tags.join('/')

    if(tagList.includes('system_legend')) return UserTagName.system_trust_legend;
    if(tagList.includes('system_trust_legend')) return UserTagName.system_trust_legend;
    if(tagList.includes('system_trust_veteran')) return UserTagName.system_trust_veteran;
    if(tagList.includes('system_trust_trusted')) return UserTagName.system_trust_trusted;
    if(tagList.includes('system_trust_known')) return UserTagName.system_trust_known;
    if(tagList.includes('system_trust_basic')) return UserTagName.system_trust_basic;
    else return UserTagName.none;
}

export let userInfo = {
    currentAvatarImageUrl: null,
    tag: null,
    friends: [],
    onlineFriends: [],
    offlineFriends: []
}

export let alerts = new Array();

export let friends = new Array();
export let friendOn = new Array();
export let friendOff = new Array();

export let blocks = new Array();
export let against = new Array();

export async function getUserInfo (state) {
    await fetch(`https://api.vrchat.cloud/api/1/auth/user`, VRChatAPIGet)
    .then((response) => response.json())
    .then((json) => {
        if(!json.error)
        {
            userInfo = json;
        }
        state.updateFunction();
    });
}

export async function getAlerts(state) {
    await fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications?type=friendRequest`, VRChatAPIGet)
    .then(responses => responses.json())
    .then(json => {
        alerts = new Array();
        if(!json.error)
        {
            alerts = alerts.concat(json);
        }
        state.updateFunction();
    })
}

export async function getFriends(state) {
    let offSet = 0;

    Promise.all([getFriendOn(offSet)])
    .then((result) => {
        friends = new Array();
        friendOn = new Array();
        friendOff = new Array();
        return result;
    })
    .done((result) => {
        friends = friends.concat(result[0]);
        friendOn = friendOn.concat(result[0]);
    });

    let promiseOff = Promise.all([getFriendOff(offSet)])
    .then((result) => {
        friends = friends.concat(result[0]);
        friendOff = friendOff.concat(result[0]);
    });
    
    promiseOff.done(() => {
        state.updateFunction();
    });
}

async function getFriendOn() {
    let offSet = 0;
    let responseOn = new Array();

    for(let i=0;i<Math.ceil(userInfo.offlineFriends.length/100);i++)
    {
        await fetch(`https://api.vrchat.cloud/api/1/auth/user/friends?offline=false&offset=${offSet}`, VRChatAPIGet)
        .then((response) => response.json())
        .then(json => {
            responseOn = responseOn.concat(json);
        });
        offSet += 100;
    }

    return new Promise((resolve, reject) =>
    resolve(responseOn));
}

async function getFriendOff() {
    let offSet = 0;
    let responseOff = new Array();

    for(let i=0;i<Math.ceil(userInfo.offlineFriends.length/100);i++)
    {
        await fetch(`https://api.vrchat.cloud/api/1/auth/user/friends?offline=true&offset=${offSet}`, VRChatAPIGet)
        .then((response) => response.json())
        .then(json => {
            responseOff = responseOff.concat(json)
        });
        offSet += 100;
    }

    return new Promise((resolve, reject) =>
    resolve(responseOff));
}

export function friendRequest(state, notiId, type) {
    if(type == true)
    {
        Alert.alert(
            translate('information'),
            translate('msg_friendrequest'),
            [
                {text: translate('ok'), onPress: () => {
                    fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications/${notiId}/accept`, VRChatAPIPut)
                    .then((response) => response.json())
                    .then((json) => {
                        if(json.success.status_code == "200")
                        {
                            alerts = alerts.filter(v => v.id !== notiId)
                            ToastAndroid.show(translate('msg_success_friend_request'), ToastAndroid.SHORT);
                        }
                        else
                        {
                            ToastAndroid.show(translate('msg_fail_friend_request'), ToastAndroid.SHORT);
                        }
                        state.updateFunction();
                    });
                }},
                {text: translate('cancel')}
            ]
        );
    }
    else
    {
        Alert.alert(
            translate('information'),
            translate('msg_friendrequest_deny'),
            [
                {text: translate('ok'), onPress: () => {
                    fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications/${notiId}/hide`, VRChatAPIPut)
                    .then((response) => response.json())
                    .then(() => {
                        alerts = alerts.filter(v => v.id !== notiId)
                        ToastAndroid.show(translate('msg_deny_friend_request'), ToastAndroid.SHORT);
                        state.updateFunction();
                    });
                }},
                {text: translate('cancel')}
            ]
        );
    }
}

export async function getBlocks (state) {
    await fetch(`https://api.vrchat.cloud/api/1/auth/user/playermoderations`, VRChatAPIGet)
    .then((response) => response.json())
    .then(json => {
        json.sort((a,b) =>{
            return a.created > b.created ? -1 : a.created > b.created ? 1 : 0;
        });
        blocks = json.filter((v) => v.type.indexOf("block") !== -1);
        state.updateFunction();
    });
}

export async function getAgainst(state) {
    await fetch(`https://api.vrchat.cloud/api/1/auth/user/playermoderated`, VRChatAPIGet)
    .then((response) => response.json())
    .then(json => {
        json.sort((a,b) =>{
            return a.created > b.created ? -1 : a.created > b.created ? 1 : 0;
        });
        against = json.filter((v) => v.type.indexOf("block") !== -1);
        state.updateFunction();
    })
}