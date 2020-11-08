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
    AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
export const MapTags = {
    'hot': 'system_approved',
    'avatar': 'author_tag_avatar',
    'game': 'author_tag_game',
    'new': 'system_updated_recently'
}

updateFavoriteMap = (objectId, isFavorite) => {
    Alert.alert(
        `즐겨찾기 (${isFavorite ? '해제' : '추가'})`,
        `맵 id : ${objectId}`,
        [{text: "확인", onPress: () => console.log('MapUtils => updateFavoriteMap')}]
    );
}
isFavorite = (item) => {
    if(!item) return "star-outlined"
    else return "star"
}


DrawMap = (item, isFavorite) => {
    return (
        <View style={{borderWidth:1}}>
            <Icon 
                onPress={() => this.updateFavoriteMap(item, isFavorite)}
                name={this.isFavorite(isFavorite)}
                size={40} 
                style={{marginLeft:15, justifyContent:"center"}}
            />

            <View style={{flexDirection:"row",padding:"5%"}}>
                <View>
                    <Image
                        style={{width: 370, height: 200, borderRadius:5}}
                        source={{
                            uri:item.thumbnailImageUrl,
                            method: "GET",
                            headers: {
                                "User-Agent" : "VT"
                            }
                        }}
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

export function MapInfo(item, isFavorite, isTouchable = false, viewFunction = null, viewProp = null){
    return isTouchable ? 
    (
        <TouchableOpacity style={{borderWidth:1}} onPress={() => viewFunction(viewProp)}>
           {DrawMap(item, isFavorite)} 
        </TouchableOpacity>
    ) : DrawMap(item, isFavorite)
}