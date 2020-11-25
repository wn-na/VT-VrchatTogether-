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
import {MapTags, MapInfo, drawModal} from '../utils/MapUtils';
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils'

export default class MapDetail extends Component {  
    constructor(props) {
        super(props);

        this.state = {
            mapInfo: {},
            userInfo: {}, 
            display : false,
            toggleModal : (t = null) => this.setState({display : t ? t : !this.state.display})
        };
    }


    getUserDetail = async() => await fetch(`https://api.vrchat.cloud/api/1/users/${this.state.mapInfo.authorId}`, VRChatAPIGet)
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState((prevState, prevProps) => {
            return { userInfo: responseJson}
        })
   })
    
    getMapDetail = async() => await
        fetch(`https://api.vrchat.cloud/api/1/worlds/${this.props.mapId}`, VRChatAPIGet)
        .then((response) =>  response.json())
        .then((responseJson) => {
            if(!responseJson.error){
                this.setState((prevState, prevProps) => {
                    return { mapInfo: responseJson}
                }, () => { 
                    this.getUserDetail();
                })
            }
        })
        
    UNSAFE_componentWillMount() {
        this.getMapDetail();
    }

    componentWillUnmount() {
    }
    componentDidMount() {
    }

    render() {
        Moment.locale('ko');
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>맵 제작자 정보보기</Text>
                </Header>
                <ScrollView style={{borderWidth:1}}>
                    <Text>제작자 정보</Text>
                    <View style={{borderWidth:1, flex:1, padding:"5%"}}>
                        <View style={{flexDirection:"row"}}>
                            <Image
                                style={{width: 100, height: 100, borderWidth:3, borderColor: UserGrade(this.state.userInfo.tags), borderRadius:20}}
                                source={VRChatImage(this.state.userInfo.currentAvatarThumbnailImageUrl)}/>
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
                    {MapInfo(this.state.mapInfo, this.state)}
                </ScrollView>
                {drawModal(this.state)}
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