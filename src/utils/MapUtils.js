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
            console.log(responseJson)
            FavoriteWorldTag.clear();
            responseJson.forEach(element => FavoriteWorldTag.set(element.id, element.displayName))
            console.log('test', FavoriteWorldTag);
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
            console.log('test', FavoriteWorld);
        }
    })
}

export function drawMapTag(tag, selectStyle, unSelectStyle, event) {
    return [...MapTags.keys()].map((key, idx) => 
        <Text key={idx} style={tag == key ? selectStyle : unSelectStyle} onPress={() => event(key)}>{key}</Text>
    );
}


updateNewFavoriteWorld = (state, item, tags) => {
    fetch(`https://api.vrchat.cloud/api/1/favorites`, VRChatAPIPostBody({
        'type': 'world',
        'favoriteId': item.id,
        'tags': tags
    })).
    then(response => response.json()).
    then(responseJson => {
        state.toggleModal()   
        console.log(responseJson)
        Alert.alert(
            `즐겨찾기(추가)`,
            `맵 id : ${item.id} / ${!responseJson.error ? '성공' : `실패 : ${responseJson.error.message}`}`,
            [{text: "확인", onPress: () => console.log('MapUtils => updateFavoriteMap')}]
        )
        if(!responseJson.error){
            FavoriteWorld.set(responseJson.favoriteId, {...item, favoriteId : responseJson.id})
            console.log(FavoriteWorld)
        }
    })
}

updateFavoriteMap = (state, item, isFavorite) => {
    if(isFavorite){
         fetch(`https://api.vrchat.cloud/api/1/favorites/${FavoriteWorld.get(item.id).favoriteId}?type=world`, VRChatAPIDelete).
        then(r => r.json()).
        then(responseJson => {
            console.log(FavoriteWorld.get(item.id).favoriteId, responseJson)
            isFavorite = !(!responseJson.error)
            Alert.alert(
                `즐겨찾기(해제)`,
                `맵 id : ${item.id} / ${!responseJson.error ? '성공' : `실패 : ${responseJson.error.message}`}`,
                [{text: "확인", onPress: () => console.log('MapUtils => updateFavoriteMap')}]
            )
            if(!isFavorite){
                FavoriteWorld.delete(item.id)
                console.log(FavoriteWorld)
            }
        })    
        } else {
            state.toggleModal(item)            
    }
       
}

drawWorldTagList = (state, item) => {
    console.log('te', item)
    return [...FavoriteWorldTag.keys()].map((element, idx) => 
        <Button
            key={idx}
            onPress={() => this.updateNewFavoriteWorld(state, item, FavoriteWorldTag.get(element))}
            style={{width:"90%", height:"20%",justifyContent:"center"}}>
            <Text>{FavoriteWorldTag.get(element)}</Text>
        </Button>
    )
}

isFavorite = (flag) => {
    if(flag) return "star-outlined"
    else return "star"
}

export function drawModal(state){
    console.log(!!(state.display), state)
    return <Modal style={{flex:1}}
        visible={!!state.display || false}
        animationType="slide"
        onRequestClose={()=>state.toggleModal()} //for android hardware back
    >
        {drawWorldTagList(state, state.display)}
        <View>
            <Button onPress={() => state.toggleModal()}>
                <Text>Close</Text>
            </Button>
        </View>
    </Modal>
}

DrawMap = (state, item) => {
    return (
        <View style={{borderWidth:1}}>
            <Icon 
                onPress={() => this.updateFavoriteMap(state, item, FavoriteWorld.get(item.id))}
                name={this.isFavorite(FavoriteWorld.get(item.id))}
                size={40} 
                style={{marginLeft:15, justifyContent:"center"}}
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
        </View>
    )
}

export function MapInfo(item, state = null, isTouchable = false, viewFunction = null, viewProp = null){
   
   console.log(state)
    return isTouchable ? 
    (
        <TouchableOpacity style={{borderWidth:1}} onPress={() => viewFunction == null ? {} : viewFunction(viewProp)}>
           {DrawMap(state, item)} 
        </TouchableOpacity>
    ) : DrawMap(state, item)
}