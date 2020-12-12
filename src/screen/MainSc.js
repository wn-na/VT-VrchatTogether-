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
    TouchableOpacity
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
import {translate} from '../translate/TranslateUtils';

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
            modalVisible:true,
            infoModal:false
        };
    }

    UNSAFE_componentWillMount() {
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
            translate('information'),
            translate('msg_logout'),
            [
                {text: translate('ok'), onPress: () => {
                    fetch(`https://api.vrchat.cloud/api/1/logout`, VRChatAPIPut)
                    .then((response) => response.json())
                    .then(() => {
                        Actions.replace("loginSc");
                    });
                }},
                {text: translate('cancel')}
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
            ToastAndroid.show(translate('msg_refresh_time'), ToastAndroid.SHORT);
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
                    <View style={{flex:2,zIndex:2}}>
                        <View style={styles.myInfo}>
                            <View style={{flexDirection:"row"}}>
                                <View style={{marginTop:-20}}>
                                    <NetmarbleL style={{textAlign:"center",color:UserGrade(this.state.getUserInfo.tags)}}>
                                        {UserGradeName(this.state.getUserInfo.tags)}
                                    </NetmarbleL>
                                    <Image
                                        style={{width: 100, height: 100, borderRadius:10,borderWidth:3,borderColor:UserGrade(this.state.getUserInfo.tags)}}
                                        source={VRChatImage(this.state.getUserInfo.currentAvatarThumbnailImageUrl)}
                                    />
                                </View>
                                <View style={{position:"absolute",right:"0%",zIndex:1,flexDirection:"row"}}>
                                    <TouchableOpacity
                                    onPress={()=>this.setState({infoModal:true})}>
                                        <Icon
                                        size={25} name={"light-bulb"} style={{color:"#c4c4c4",marginRight:10}}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                    onPress={this.logout.bind(this)}>
                                        <Icon
                                        size={25} name={"log-out"} style={{color:"#2b3956"}}/>
                                    </TouchableOpacity>
                                </View>
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
                                            <TouchableOpacity onPress={()=>Actions.currentScene == "mainSc" && Actions.friendListSc({option:"all"})}>
                                                <NetmarbleL 
                                                style={styles.friendsCount}>
                                                    {`${translate('all_user')}\n`}
                                                    {this.state.allCount}{translate('people_count')}
                                                </NetmarbleL>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col style={{borderLeftWidth:1,borderRightWidth:1,borderColor:"#4d221e1f"}}>
                                            <TouchableOpacity onPress={()=>Actions.currentScene == "mainSc" && Actions.friendListSc({option:"on"})}>
                                                <NetmarbleL 
                                                style={styles.friendsCount}>
                                                    {`${translate('online')}\n`}
                                                    {this.state.onCount}{translate('people_count')}
                                                </NetmarbleL>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col>
                                            <TouchableOpacity onPress={()=>Actions.currentScene == "mainSc" && Actions.friendListSc({option:"off"})}>
                                                <NetmarbleL 
                                                style={styles.friendsCount}>
                                                    {`${translate('offline')}\n`}
                                                    {this.state.offCount}{translate('people_count')}
                                                </NetmarbleL>
                                            </TouchableOpacity>
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
                                onPress={() => Actions.currentScene == "mainSc" && Actions.alertSc()}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/alert_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>{translate('notice')}</NetmarbleM>
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
                                onPress={() => Actions.currentScene == "mainSc" && Actions.friendListSc({option:"all"})}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/friend_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>{translate('friend_list')}</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{alignItems:"flex-end"}}>
                                <Button
                                onPress={() => Actions.currentScene == "mainSc" && Actions.favoriteSc({userId:this.state.getUserInfo.id})}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/favorite_icon.png")}/>
                                        <NetmarbleM style={[styles.infoButtonText,{textAlign:"center"}]}>{translate('favorite_manage')}</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                onPress={() => Actions.currentScene == "mainSc" && Actions.avatarListSc()}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/avatar_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>{translate('avatar_list')}</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{alignItems:"flex-end"}}>
                                <Button
                                onPress={() => Actions.currentScene == "mainSc" && Actions.blockSc()}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/block_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>{translate('block_manage')}</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                onPress={() => Actions.currentScene == "mainSc" && Actions.mapListSc({userId:this.state.getUserInfo.id})}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/world_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>{translate('world_list')}</NetmarbleM>
                                    </View>
                                </Button>
                            </Col>
                        </Row>
                    </View>
                    <Modal
                    isVisible={this.state.modalVisible}>
                        <ActivityIndicator size={100}/>
                    </Modal>
                    <Modal
                    onBackButtonPress={()=>this.setState({infoModal:false})}
                    onBackdropPress={()=>this.setState({infoModal:false})}
                    isVisible={this.state.infoModal}>
                        <View style={{backgroundColor:"#fff",padding:"5%",borderRadius:10}}>
                            <View style={{alignItems:"center"}}>
                                <NetmarbleL style={{textAlign:"center"}}>
                                    {translate('pm')} : Aboa{"\n"}
                                    {translate('developer')} : [ leth, 늦잠 ]{"\n"}
                                    {translate('designer')} : [ 세르뀨, 은혜 ]{"\n"}
                                    {translate('tester')} : [ Excite, きゆ, 옌딩 ]{"\n"}{"\n"}

                                    <Image 
                                    style={{width:30,height:30}}
                                    source={require('../css/imgs/discord.png')}/>
                                    {"  "}Aboa#9076{"\n"}
                                </NetmarbleL>
                                <View style={{flexDirection:"row"}}>
                                    <Button 
                                    onPress={()=>this.setState({infoModal:false})}
                                    style={[styles.requestButton,{width:"30%",height:40,margin:10,justifyContent:"center"}]}>
                                        <NetmarbleL>{translate('ok')}</NetmarbleL>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ImageBackground>
            </ScrollView>
        );
    }
}