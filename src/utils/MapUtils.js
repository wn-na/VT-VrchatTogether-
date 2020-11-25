import React, { Component } from "react";
import Moment from 'moment';
// common component
import {
    Container,
    Header,
    Content,
    Footer,
    Button,
    Left,
    Right,
    Body,
    Item,
    Label,
    Input,
    H2,
    H1,
    Badge,
    Text,
    SwipeRow,
    Picker,
    Textarea,
    Fab,
    List,
    ListItem,
    Switch,
    Drawer
} from "native-base";
import {
    Image,
    StyleSheet,
    SectionList,
    FlatList,
    TouchableOpacity,
    ScrollView,
    View,
    TextInput,
    Dimensions,
    Alert,
    Modal,
    AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import {VRChatAPIDelete, VRChatAPIGet, VRChatAPIPostBody, VRChatAPIPut, VRChatImage} from '../utils/ApiUtils'

export let FavoriteWorld = new Map();
export let FavoriteWorldTag = new Map();

export const MapTags = new Map([
    ['new', 'system_updated_recently'],
    ['hot', 'system_approved'],
    ['avatar', 'author_tag_avatar'],
    ['game', 'author_tag_game']
])


export function getFavoriteWorldTag() {
    fetch(`https://api.vrchat.cloud/api/1/favorite/groups?type=world`, VRChatAPIGet).
    then(response => response.json()).
    then(responseJson => {
        if(!responseJson.error){
            FavoriteWorldTag.clear();
            responseJson.forEach(element => FavoriteWorldTag.set(element.displayName, element.id))
            if(FavoriteWorldTag.size < 4){
                for(let i = FavoriteWorldTag.size; i < 4; i++)
                    FavoriteWorldTag.set(`worlds${i+1}`, `worlds${i+1}`)
            }
        }
    })
}

export function getFavoriteMap() {
    fetch(`https://api.vrchat.cloud/api/1/worlds/favorites`, VRChatAPIGet)
    .then(response => response.json())
    .then(responseJson => {
        if(!responseJson.error){
            FavoriteWorld.clear()
            responseJson.forEach(element => FavoriteWorld.set(element.id, element))
        }
    })
}

addFavoriteWorld = (state, item, tags) => {
    fetch(`https://api.vrchat.cloud/api/1/favorites`, VRChatAPIPostBody({
        'type': 'world',
        'favoriteId': item.id,
        'tags': tags
    })).
    then(response => response.json()).
    then(responseJson => {
        if(!responseJson.error) {
            FavoriteWorld.set(responseJson.favoriteId, {...item, favoriteId : responseJson.id})
        }   
        state.toggleModal()
        Alert.alert(
            `즐겨찾기(추가)`,
            `맵 id : ${item.id} / ${!responseJson.error ? '성공' : `실패 : ${responseJson.error.message}`}`,
            [{text: "확인", onPress: () => null}]
        )
    })
}

deleteFavoiriteWorld = (state, item) => {
    fetch(`https://api.vrchat.cloud/api/1/favorites/${FavoriteWorld.get(item.id).favoriteId}?type=world`, VRChatAPIDelete).
    then(response => response.json()).
    then(responseJson => {
        if(!responseJson.error) {
            FavoriteWorld.delete(item.id)
        }
        state.updateFunction()
        Alert.alert(
            `즐겨찾기(해제)`,
            `맵 id : ${item.id} / ${!responseJson.error ? '성공' : `실패 : ${responseJson.error.message}`}`,
            [{text: "확인", onPress: () => null}]
        )
    })   
}

export function updateFavoriteMap (state, item, isFavorite)  {
    if(isFavorite){
        this.deleteFavoiriteWorld(state, item)
    } else {
        state.toggleModal(item)            
    }
}

drawWorldTagList = (state, item) => {
    return [...FavoriteWorldTag.keys()].map((element, idx) => 
        <Button
            key={FavoriteWorldTag.get(element)}
            onPress={() => this.addFavoriteWorld(state, item, element)}
            style={{width:"80%", height:40, margin:15, justifyContent:"center", backgroundColor:"#fff", color:"#000"}}>
            <Text style={{color:"#000"}}>Group {String(idx + 1)}</Text>
        </Button>
    )
}

export function drawModal(state) {
    return <Modal animationType="fade"
                transparent={true}
                visible={!!state.display || false}
                onBackButtonPress={()=>state.toggleModal()}
                onBackdropPress={()=>state.toggleModal()}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                    <View style={{alignItems:"center", height:"45%", width:"95%", borderColor:"#cdcdcd", borderWidth: 1, backgroundColor:"#fff"}}>
                        {drawWorldTagList(state, state.display)}
                        <Button style={{width:"80%",height:40,margin:10,justifyContent:"center"}}
                            onPress={()=>state.toggleModal()}>
                            <Text>취소</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
}

DrawMap = (state, item) => 
    (<View style={{borderWidth:1}}>
        <Icon 
            visible={!!FavoriteWorld.get(item.id) || false}
            onPress={() => updateFavoriteMap(state, item, FavoriteWorld.get(item.id))}
            name={(FavoriteWorld.get(item.id) ? "star-outlined" : "star")}
            size={40} 
            style={{marginLeft:15, justifyContent:"center", width:40, height:40}}
        />
        <View style={{flexDirection:"row",padding:"5%"}}>
            <View>
                <Image
                    style={{width: parseInt(Dimensions.get('window').width / 100 * 62), 
                        height: parseInt(Dimensions.get('window').width / 100 * 40),
                        borderRadius:5}}
                    source={VRChatImage(item.thumbnailImageUrl)}
                />
            </View>
        </View>   
        <View style={{marginLeft:"3%"}}>
            <Text>맵 이름 : {item.name}</Text>
            <Text>맵 정보 : {item.releaseStatus}</Text>
            {item.publicOccupants !== undefined ? <Text>접속중인 월드 인원수 : {item.publicOccupants}</Text> : null}
            <Text>맵 전체 인원수 : {item.occupants}</Text>
            <Text>마지막 업데이트 날짜 : {Moment(item.updated_at).format('LLLL')}</Text> 
        </View>
    </View>)

export function MapInfo(item, state = null, isTouchable = false, viewFunction = null, viewProp = null){
    return isTouchable ? 
    (
        <TouchableOpacity style={{borderWidth:1}} onPress={() => viewFunction == null ? {} : viewFunction(viewProp)}>
           {DrawMap(state, item)} 
        </TouchableOpacity>
    ) : DrawMap(state, item)
}