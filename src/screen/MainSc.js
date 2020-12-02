import React, { Component } from "react";
// common component
import {
    Button,
    Text,
} from "native-base";
import {
    Image,
    ScrollView,
    RefreshControl,
    View,
    Alert,
    ToastAndroid,
    ActivityIndicator,
    ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import {UserGrade,UserGradeName} from './../utils/UserUtils';
import Modal from 'react-native-modal';
import { Actions } from "react-native-router-flux";
import { Col, Row } from "react-native-easy-grid";
import {VRChatAPIGet, VRChatImage, VRChatAPIPut} from '../utils/ApiUtils';
import {getFavoriteMap, getFavoriteWorldTag} from '../utils/MapUtils';
import styles from '../css/css';
import {NetmarbleM,NetmarbleB,NetmarbleL} from '../utils/CssUtils';

export default class MainSc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getUserInfo:{
                currentAvatarImageUrl: null,
                tag: null
            },
            refreshing:false,
            onCount:0,
            offCount:0,
            allCount:0,
            alertCount:0,
            refreshTime:false,
            exitApp:false,
            modalVisible:true
        };
    }

    async UNSAFE_componentWillMount() {
        getFavoriteMap();
        getFavoriteWorldTag();

        Promise.all([this.getUserInfo(),this.getAlerts(),getFavoriteMap(),getFavoriteWorldTag()])
        .then(() => {
            this.setState({
                modalVisible:false
            });
        });
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    // 로그아웃 처리
    logout = () =>
    {
        Alert.alert(
            "안내",
            "로그아웃 하시겠습니까?",
            [
                {text: "확인", onPress: () => {
                    fetch(`https://api.vrchat.cloud/api/1/logout`, VRChatAPIPut)
                    .then((response) => response.json())
                    .then(() => {
                        Actions.replace("loginSc");
                    });
                }},
                {text: "취소"}
            ]
        );
    }

    // 자기정보 가져옴
    async getUserInfo ()
    {
        await fetch(`https://api.vrchat.cloud/api/1/auth/user`, VRChatAPIGet)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                getUserInfo : responseJson,
                onCount : responseJson.onlineFriends.length,
                offCount : responseJson.offlineFriends.length
            });
        })
    }

    getAlerts() {
        fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications`, VRChatAPIGet)
        .then(responses => responses.json())
        .then(json => {
            this.setState({
                alertCount:json.filter((v) => v.type.indexOf("friendRequest") !== -1).length
            })
        })
    }

    // 새로고침 시 5초 카운팅기능
    reset = () =>
    {
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalVisible = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);
            
            getFavoriteMap();
            getFavoriteWorldTag();

            Promise.all([this.getUserInfo(),this.getAlerts()])
            .then(() => {
                this.setState({
                    modalVisible:false
                });
            });

            this.setState({
                refreshing:false
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    render() {
        this.state.allCount = this.state.onCount + this.state.offCount;

        return (
            <ScrollView
                contentContainerStyle={{flex:1}}
                refreshControl={
                    <RefreshControl
                        onRefresh={this.reset.bind(this)}
                        refreshing={this.state.refreshing}
                    />
                }>
                <ImageBackground
                style={{width:"100%",height:"100%"}}
                source={require("../css/imgs/main_background.png")}>
                    <View style={{flex:2}}>
                        <View style={{alignItems:"flex-end",marginRight:"2%"}}>
                            <Button
                                onPress={this.logout.bind(this)}
                                style={{marginTop:10,width:100,justifyContent:"center"}}
                                >
                                <NetmarbleM style={{color:"white"}}>로그아웃</NetmarbleM>
                            </Button>
                        </View>
                        <View style={styles.myInfo}>
                            <View style={{flexDirection:"row"}}>
                                <Image
                                    style={{width: 100, height: 100, borderRadius:10}}
                                    source={VRChatImage(this.state.getUserInfo.currentAvatarThumbnailImageUrl)}
                                />
                                <NetmarbleL style={styles.myInfoText}>
                                    {this.state.getUserInfo.displayName}{"  "}
                                    {this.state.getUserInfo.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                                    {this.state.getUserInfo.statusDescription != "" && this.state.getUserInfo.statusDescription+"\n"}
                                </NetmarbleL>
                            </View>
                            <View style={{justifyContent:"center",marginTop:"5%"}}>
                                <View style={styles.userCount}>
                                    <Row>
                                        <Col>
                                            <NetmarbleL style={styles.friendsCount}>
                                                전체{"\n"}
                                                {this.state.allCount+"명"}
                                            </NetmarbleL>
                                        </Col>
                                        <Col style={{borderLeftWidth:1,borderRightWidth:1,borderColor:"#4d221e1f"}}>
                                            <NetmarbleL style={styles.friendsCount}>
                                                온라인{"\n"}
                                                {this.state.onCount+"명"}
                                            </NetmarbleL>
                                        </Col>
                                        <Col>
                                            <NetmarbleL style={styles.friendsCount}>
                                                오프라인{"\n"}
                                                {this.state.offCount+"명"}
                                            </NetmarbleL>
                                        </Col>
                                    </Row>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.menu}>
                        <Row>
                            <Col style={{alignItems:"flex-end"}}>
                                <Button
                                onPress={Actions.alertSc}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/alert_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>알림</NetmarbleM>
                                        {this.state.alertCount != 0 && 
                                            <View style={{
                                                position:"absolute",
                                                width:25,
                                                height:25,
                                                borderRadius:50,
                                                backgroundColor:"#f51414",
                                                justifyContent:"center",
                                                alignItems:"center",
                                                left:"55%",
                                                top:"-10%"
                                            }}/>}
                                        {this.state.alertCount != 0 && 
                                            <NetmarbleM style={{
                                                position:"absolute",
                                                left:"26.5%",
                                                top:"-7%",
                                                color:"white",
                                                fontSize:13,
                                                textAlign:"center",
                                                width:60
                                            }}>{this.state.alertCount}</NetmarbleM>}
                                    </View>
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                onPress={Actions.friendListSc}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/friend_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>친구목록</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{alignItems:"flex-end"}}>
                                <Button
                                onPress={Actions.favoriteSc}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/favorite_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>즐겨찾기 관리</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                onPress={Actions.avatarListSc}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/avatar_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>아바타 목록</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{alignItems:"flex-end"}}>
                                <Button
                                onPress={Actions.blockSc}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/block_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>블락 관리</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                onPress={Actions.mapListSc}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/world_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>맵 목록</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                        </Row>
                    </View>
                    <Modal
                    isVisible={this.state.modalVisible}>
                        <ActivityIndicator size={100}/>
                    </Modal>
                </ImageBackground>
            </ScrollView>
        );
    }
}