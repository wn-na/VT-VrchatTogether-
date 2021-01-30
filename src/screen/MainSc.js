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
    TouchableOpacity,
    TextInput
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import {
    UserGrade,
    UserGradeName,
    getUserInfo,
    userInfo,
    getAlerts,
    alerts,
    changeStatus,
    getFriends
} from './../utils/UserUtils';
import Modal from 'react-native-modal';
import { Actions } from "react-native-router-flux";
import { Col, Row } from "react-native-easy-grid";
import {VRChatImage} from '../utils/ApiUtils';
import {getFavoriteMap, getFavoriteWorldTag} from '../utils/MapUtils';
import styles from '../css/css';
import {NetmarbleM,NetmarbleL, NetmarbleB} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';

export default class MainSc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing:false,
            alertCount:0,
            refreshTime:false,
            exitApp:false,
            modalVisible: false,
            statusModal: false,
            langChcek : false,
            update: false,
            statusText:userInfo.statusDescription,
            statusTextLength:userInfo.statusDescription.length,
            updateFunction: () => this.setState({update:!this.state.update}),
        };
    }

    UNSAFE_componentWillMount() {
        getFavoriteMap();
        getFavoriteWorldTag();
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    changeUpdate() {
        this.setState({
            update: !this.state.update
        });
        return this.setState({
            update: !this.state.update
        });
    }

    openChangeStatus = () => {
        this.setState({
            statusModal:true,
            statusText:userInfo.statusDescription
        });
    }

    changeStatus = async() => {
        changeStatus(this.state,this.state.statusText);
        this.setState({
            statusModal:false,
        });
    }

    // 새로고침 시 5초 카운팅기능
    reset = async() => {
        if(this.state.refreshTime == false)
        {
            this.setState({
                refreshTime: true,
                modalVisible: true
            });

            setTimeout(() => {
                this.setState({
                    refreshTime: false
                });
            }, 5000);
            
            await getUserInfo(this.state)
            await getFriends(this.state)
            Promise.all(getAlerts(this.state),getFavoriteMap(),getFavoriteWorldTag())
            .then(()=>
                this.setState({
                    refreshing: false,
                    modalVisible: false
                })
            );
        }
        else
        {
            ToastAndroid.show(translate('msg_refresh_time'), ToastAndroid.SHORT);
        }
    }

    userStateIcon(){
        if(userInfo.status == "active")
        {
            return <Icon style={{color:"green"}} name="controller-record"/>
        }
        if(userInfo.status == "ask me")
        {
            return <Icon style={{color:"#e88134"}} name="controller-record"/>
        }
        if(userInfo.status == "join me")
        {
            return <Icon style={{color:"#42caff"}} name="controller-record"/>
        }
        // don't disturb(color red)
        else(userInfo.status)
        {
            return <Icon style={{color:"#808080"}} name="controller-record"/>
        }
    }

    render() {
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
                    <View style={{height:"35%"}}>
                        <View style={styles.myInfo}>
                            <View style={{flexDirection:"row"}}>
                                <View style={{marginTop:-20}}>
                                    <NetmarbleL style={{textAlign:"center",color:UserGrade(userInfo.tags)}}>
                                        {UserGradeName(userInfo.tags)}
                                    </NetmarbleL>
                                    <Image
                                        style={{width: 100, height: 100, borderRadius:10,borderWidth:3,borderColor:UserGrade(userInfo.tags)}}
                                        source={VRChatImage(userInfo.currentAvatarThumbnailImageUrl)}
                                    />
                                </View>
                                <View style={{position:"absolute",right:"0%",zIndex:1,flexDirection:"row"}}>
                                    <TouchableOpacity
                                    onPress={()=> Actions.currentScene == "mainSc" && Actions.option({changeUpdate:this.changeUpdate.bind(this)})}>
                                        <Image 
                                        style={{width:30,height:30}}
                                        source={require('../css/imgs/option.png')}/>
                                    </TouchableOpacity>
                                </View>
                                <NetmarbleL style={[styles.myInfoText,{width:"55%"}]}>
                                    {userInfo.displayName}{"  "}
                                    {this.userStateIcon()}{"\n"}
                                    {userInfo.statusDescription.length > 25 ? userInfo.statusDescription.substr(0,25)+"..." : userInfo.statusDescription}
                                </NetmarbleL>
                                <TouchableOpacity
                                style={{position:"absolute",top:"40%",right:"2%"}}
                                onPress={()=>this.openChangeStatus()}>
                                    <Icon 
                                    style={{color:"#666"}}
                                    name={"edit"} size={20}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent:"center",marginTop:"5%"}}>
                                <View style={styles.userCount}>
                                    <Row>
                                        <Col>
                                            <TouchableOpacity onPress={()=>Actions.currentScene == "mainSc" && Actions.friendListSc({option:"on"})}>
                                                <NetmarbleL 
                                                style={styles.friendsCount}>
                                                    {`${translate('online')}\n`}
                                                    {userInfo.onlineFriends.length}{translate('people_count')}
                                                </NetmarbleL>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col style={{borderLeftWidth:1,borderRightWidth:1,borderColor:"#4d221e1f"}}>
                                            <TouchableOpacity onPress={()=>Actions.currentScene == "mainSc" && Actions.friendListSc({option:"off"})}>
                                                <NetmarbleL 
                                                style={styles.friendsCount}>
                                                    {`${translate('offline')}\n`}
                                                    {userInfo.offlineFriends.length}{translate('people_count')}
                                                </NetmarbleL>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col>
                                            <TouchableOpacity onPress={()=>Actions.currentScene == "mainSc" && Actions.friendListSc({option:"active"})}>
                                                <NetmarbleL 
                                                style={styles.friendsCount}>
                                                    {`${translate('active')}\n`}
                                                    {userInfo.activeFriends.length}{translate('people_count')}
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
                                onPress={() => Actions.currentScene == "mainSc" && Actions.alertSc({updateFunction:this.changeUpdate.bind(this)})}
                                style={styles.infoButton}>
                                    <View style={{alignItems:"center"}}>
                                        <Image 
                                        style={{width:50,height:50,resizeMode:"center"}}
                                        source={require("../css/imgs/alert_icon.png")}/>
                                        <NetmarbleM style={styles.infoButtonText}>{translate('notice')}</NetmarbleM>
                                        {alerts.length != 0 && 
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
                                        {alerts.length != 0 && 
                                            <NetmarbleM style={{
                                                position:"absolute",
                                                left:"26.5%",
                                                top:"-7%",
                                                color:"white",
                                                fontSize:13,
                                                textAlign:"center",
                                                width:60
                                            }}>{alerts.length}</NetmarbleM>}
                                    </View>
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                onPress={() => Actions.currentScene == "mainSc" && Actions.friendListSc({
                                    option:"all",
                                    allCount:userInfo.friends.length,
                                    onCount:userInfo.onlineFriends.length,
                                    offCount:userInfo.offlineFriends.length,
                                })}
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
                                onPress={() => Actions.currentScene == "mainSc" && Actions.favoriteSc({userId:userInfo.id})}
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
                                onPress={() => Actions.currentScene == "mainSc" && Actions.mapListSc({userId:userInfo.id})}
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
                    style={styles.modal}
                    onBackButtonPress={()=>this.setState({statusModal:false})}
                    onBackdropPress={()=>this.setState({statusModal:false})}
                    isVisible={this.state.statusModal}>
                        <View style={{backgroundColor:"#fff",padding:"2%",justifyContent:"center",alignItems:"center",borderRadius:10}}>
                            <NetmarbleL style={{marginTop:"5%"}}>
                                {translate('changeStatus')}
                            </NetmarbleL>
                            <View style={{borderBottomWidth:1,width:"90%"}}>
                                <TextInput 
                                autoFocus
                                value={this.state.statusText}
                                maxLength={200}
                                onChangeText={(text) =>
                                this.setState({
                                    statusText:text,
                                    statusTextLength:text.length
                                })}
                                onSubmitEditing={()=>this.changeStatus()}
                                style={{width:"100%",fontFamily:"NetmarbleL"}}/>
                            </View>
                            <NetmarbleL style={{width:"90%",textAlign:"right"}}>
                                {this.state.statusTextLength} / 200
                            </NetmarbleL>
                            <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                                <Button 
                                onPress={()=>this.changeStatus()}
                                style={[styles.requestButton,{width:"40%",height:40,margin:10,justifyContent:"center"}]}>
                                    <NetmarbleL>{translate('ok')}</NetmarbleL>
                                </Button>
                                <Button 
                                onPress={()=>this.setState({statusModal:false})}
                                style={[styles.requestButton,{width:"40%",height:40,margin:10,justifyContent:"center"}]}>
                                    <NetmarbleL>{translate('cancel')}</NetmarbleL>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </ImageBackground>
            </ScrollView>
        );
    }
}