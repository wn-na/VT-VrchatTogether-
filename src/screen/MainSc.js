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
import {UserGrade,UserGradeName} from './../utils/UserUtils';
import Modal from 'react-native-modal';
import { Actions } from "react-native-router-flux";
import { Col, Row } from "react-native-easy-grid";
import {VRChatAPIGet, VRChatImage, VRChatAPIPut} from '../utils/ApiUtils';
import {getFavoriteMap, getFavoriteWorldTag} from '../utils/MapUtils';
import styles from '../css/css';

export default class MainSc extends Component {
    constructor(props) {
        console.info("MainSc => constructor");

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
        console.info("MainSc => componentWillMount");
        
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
        console.info("MainSc => componentWillUnmount");
    }

    componentDidMount() {
        console.info("MainSc => componentDidMount");
    }

    // 로그아웃 처리
    logout = () =>
    {
        console.log("MainSc => logout");

        Alert.alert(
            "안내",
            "로그아웃 하시겠습니까?",
            [
                {text: "확인", onPress: () => {
                    console.log("press logout")
                    fetch(`https://api.vrchat.cloud/api/1/logout`, VRChatAPIPut)
                    .then((response) => response.json())
                    .then(() => {
                        Actions.replace("loginSc");
                    });
                }},
                {text: "취소", onPress: () => {console.log("press logout")}}
            ]
        );
    }

    // 자기정보 가져옴
    async getUserInfo ()
    {
        console.log("LoginSc => getUserInfo");

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
        console.info("MainSc => getAlerts");

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
        console.log("LoginSc => reset");

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
        console.info("MainSc => render");

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
                        <ImageBackground
                        style={{width:"100%",height:"100%"}}
                        source={require("../css/imgs/main_top.png")}>
                        <View style={{alignItems:"flex-start",position:"absolute",marginLeft:"2%"}}>
                            <Button
                                onPress={this.logout.bind(this)}
                                style={{marginTop:10,width:100,justifyContent:"center"}}
                                >
                                <Text style={{fontFamily:"NetmarbleM"}}>로그아웃</Text>
                            </Button>
                        </View>
                        <View style={{alignItems:"center",marginTop:"5%"}}>
                            <View 
                            style={{
                                    width:110,
                                    borderRadius:20,
                                    borderWidth:2,
                                    borderColor:UserGrade(this.state.getUserInfo.tags),
                                    backgroundColor:UserGrade(this.state.getUserInfo.tags)
                                }}>
                                <Text style={{textAlign:"center",color:"white",fontFamily:"NetmarbleM"}}>
                                    {UserGradeName(this.state.getUserInfo.tags)}
                                </Text>
                                <Image
                                    style={{width:"100%", height: 90,borderBottomLeftRadius:20,borderBottomRightRadius:20}}
                                    source={VRChatImage(this.state.getUserInfo.currentAvatarImageUrl)}
                                />
                            </View>
                        </View>
                        <Text style={{textAlign:"center",fontFamily:"NetmarbleM",color:"#2b3956",marginTop:"2%"}}>
                            {this.state.getUserInfo != null && this.state.getUserInfo.displayName}{"\n"}
                            {this.state.getUserInfo != null && this.state.getUserInfo.statusDescription}{"\n"}
                        </Text>
                        <View style={styles.userCountInfo}>
                            <View style={styles.userCount}>
                                <Row>
                                    <Col>
                                        <Text style={styles.friendsInfo}>
                                            전체{"\n"}
                                            {this.state.allCount+"명"}
                                        </Text>
                                    </Col>
                                    <Col style={{borderLeftWidth:1,borderRightWidth:1,borderColor:"white"}}>
                                        <Text style={styles.friendsInfo}>
                                            온라인{"\n"}
                                            {this.state.onCount+"명"}
                                        </Text>
                                    </Col>
                                    <Col>
                                        <Text style={styles.friendsInfo}>
                                            오프라인{"\n"}
                                            {this.state.offCount+"명"}
                                        </Text>
                                    </Col>
                                </Row>
                            </View>
                        </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.menu}>
                        <View style={{height:"10%"}}/>
                        <Row>
                            <Col style={{alignItems:"flex-end"}}>
                                <Button
                                onPress={Actions.alertSc}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/alert_icon.png")}/>
                                        <Text style={styles.infoButtonText}>알림</Text>
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
                                            <Text style={{
                                                position:"absolute",
                                                left:"26.5%",
                                                top:"-7%",
                                                color:"white",
                                                fontSize:13,
                                                fontFamily:"NetmarbleM",
                                                textAlign:"center",
                                                width:60
                                            }}>{this.state.alertCount}</Text>}
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
                                        <Text style={styles.infoButtonText}>친구목록</Text>
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
                                        <Text style={styles.infoButtonText}>즐겨찾기 관리</Text>
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
                                        <Text style={styles.infoButtonText}>아바타 목록</Text>
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
                                        <Text style={styles.infoButtonText}>블락 관리</Text>
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
                                        <Text style={styles.infoButtonText}>맵 목록</Text>
                                    </View>
                                </Button>
                            </Col>
                        </Row>
                        <View style={{height:"10%"}}/>
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