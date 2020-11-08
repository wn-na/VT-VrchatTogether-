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
import Icon from "react-native-vector-icons/Feather";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';
import {UserGrade} from './../utils/UserUtils';
import {MapTags, MapInfo} from '../utils/MapUtils';

export default class MapDetail extends Component {  
    constructor(props) {
        console.info("MapDetail => constructor");

        super(props);

        this.state = {
            mapInfo: {},
            userInfo: {}
        };
    }


    getUserDetail = async() => await fetch(`https://api.vrchat.cloud/api/1/users/${this.state.mapInfo.authorId}`, {
        method: "GET",
        headers: {
        Accept: "application/json",
        "User-Agent":"VT",
        "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.info("A", responseJson)
        this.setState((prevState, prevProps) => {
            return { userInfo: responseJson}
        }, () => console.log("T", this.state))
   })
    
    getMapDetail = async() => await
        fetch(`https://api.vrchat.cloud/api/1/worlds/${this.props.mapId}`, {
            method: "GET",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent":"VT"
            }
        })
        .then((response) =>  response.json())
        .then((responseJson) => {
            if(!responseJson.error){
                console.info("A", responseJson)
                this.setState((prevState, prevProps) => {
                    return { mapInfo: responseJson}
                }, () => { 
                    console.info("B", this.state)
                    this.getUserDetail();
                })
                console.log("S", this.state)
            }
        })
        
    UNSAFE_componentWillMount() {
        console.info("MapDetail => componentWillMount");
        this.getMapDetail();
    }

    componentWillUnmount() {
        console.info("MapDetail => componentWillUnmount");
    }
    componentDidMount() {
        console.info("MapDetail => componentDidMount");
    }

    render() {
        console.info("MapDetail => render"); 
        Moment.locale('ko');
        if(this.state.mapInfo != null)
        {
            console.log(this.state.mapInfo);
        }
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>맵 상세보기</Text>
                </Header>
                <ScrollView style={{borderWidth:1}}>
                    <Text>제작자 정보</Text>
                    <View style={{borderWidth:1, flex:1, padding:"5%"}}>
                        <View style={{flexDirection:"row"}}>
                            <Image
                                style={{width: 100, height: 100, borderWidth:3, borderColor: UserGrade(this.state.userInfo.tags), borderRadius:20}}
                                source={{uri:this.state.userInfo.currentAvatarThumbnailImageUrl,
                                    method: "GET",
                                    headers: {
                                        "User-Agent" : "VT"
                                    }
                                }}/>
                        <Text style={{marginLeft:"3%"}}>
                            이름: {this.state.userInfo.displayName}{"\n"}
                            상태메시지 : {this.state.userInfo.statusDescription}{"\n"}
                            접속 월드: {this.state.userInfo.location != "" ? <Icon style={{color:"green"}} name="search"/> : "unknown"}{"\n"}
                            상태:  {this.state.userInfo.worldId == "private" ? "private" : this.state.userInfo.worldId != "private" && this.state.userInfo.worldId != "offline" ? "public" : this.state.userInfo.worldId == "offline" ? "offline" : null}{"\n"}
                        </Text>
                        </View>
                        <View style={{flexDirection:"row",width:"100%",paddingTop:"5%",marginBottom:"2%"}}>
                            <Button style={{marginRight:"2%",width:"49%",justifyContent:"center"}}>
                                <Text>친구 신청</Text>
                            </Button>
                            <Button style={{width:"49%", justifyContent:"center"}}>
                                <Text>블락</Text>
                            </Button>
                        </View>
                        <Button style={{width:"100%", justifyContent:"center"}}>
                            <Text>제작 정보</Text>
                        </Button>
                    </View>

                    <Text>현재 월드</Text>
                    {MapInfo(this.state.mapInfo, false)}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#fff"
    },
    login: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:"red",
        borderWidth:2
    },
    info: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:"red",
        borderWidth:2
    },
    textView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"80%",
        flexDirection:"row",
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    }
});