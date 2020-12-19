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
    Switch,
    Linking,
    AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Modal from 'react-native-modal';
import { Actions } from "react-native-router-flux";
import { Col, Row } from "react-native-easy-grid";
import styles from '../css/css';
import {NetmarbleM,NetmarbleB,NetmarbleL,Komako} from '../utils/CssUtils';
import {translate,userLang,getLanguage,setLanguage} from '../translate/TranslateUtils';
import {VRChatAPIPut} from '../utils/ApiUtils';

export default class Option extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fakeImage: false,
            highImage: false,
            langCheck: false,
        };
    }

    UNSAFE_componentWillMount() {
        AsyncStorage.getItem("user_fake_image",(err,value)=>{
            if(value == "check")
            {
                this.setState({
                    fakeImage: true
                });
            }
        });
        AsyncStorage.getItem("user_high_image",(err,value)=>{
            if(value == "check")
            {
                this.setState({
                    highImage: true
                });
            }
        });
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    // 로그아웃 처리
    logout = () => {
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

    setFakeImage() {
        if(!this.state.fakeImage == true)
        {
            AsyncStorage.removeItem("user_fake_image");
            AsyncStorage.setItem("user_fake_image","check");
            AsyncStorage.removeItem("user_high_image");
            AsyncStorage.setItem("user_high_image","none");
            this.setState({
                fakeImage: !this.state.fakeImage,
                highImage: false
            });
        }
        else
        {
            AsyncStorage.removeItem("user_fake_image");
            AsyncStorage.setItem("user_fake_image","none");
            this.setState({
                fakeImage: !this.state.fakeImage
            });
        }
    }

    setHighImage() {
        if(!this.state.highImage == true)
        {
            AsyncStorage.removeItem("user_high_image");
            AsyncStorage.setItem("user_high_image","check");
            AsyncStorage.removeItem("user_fake_image");
            AsyncStorage.setItem("user_fake_image","none");
            this.setState({
                highImage: !this.state.highImage,
                fakeImage: false
            });
        }
        else
        {
            AsyncStorage.removeItem("user_high_image");
            AsyncStorage.setItem("user_high_image","none");
            this.setState({
                highImage: !this.state.highImage
            });
        }
    }

    langSelect(lang) {
        userLang(lang);
        setLanguage(lang)
        this.setState({
            langCheck: false
        });
        this.props.changeUpdate();
    }
    
    render() {
        return (
            <ScrollView style={{flex:1}}>
                <View style={[styles.logo,{justifyContent:"center"}]}>
                    <Icon
                    onPress={()=>Actions.pop()}
                    name="chevron-left" size={25}
                    style={{color:"white",position:"absolute",left:15,top:10}}/>
                    <NetmarbleB style={{color:"white"}}>{translate('option')}</NetmarbleB>
                </View>
                <View style={styles.userOption}>
                    <View style={styles.userOptionBox}>
                        <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        onValueChange={()=>this.setFakeImage()}
                        thumbColor={"#f4f3f4"}
                        value={this.state.fakeImage}/>
                        <NetmarbleL style={{color:"#646464"}}>{translate('fake_image')}</NetmarbleL>
                    </View>
                    <View style={styles.userOptionBox}>
                        <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        onValueChange={()=>this.setHighImage()}
                        thumbColor={"#f4f3f4"}
                        value={this.state.highImage}/>
                        <NetmarbleL style={{color:"#646464"}}>{translate('high_image')}</NetmarbleL>
                    </View>
                </View>
                <View style={styles.setting}>
                    <TouchableOpacity
                    onPress={()=>this.setState({langCheck:true})}>
                        <View style={styles.settingMenu}>
                            <Image source={require('../css/imgs/trans_icon.png')} style={styles.settingMenuImage}/>
                            <NetmarbleL>{translate('lang_option')}</NetmarbleL>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>Linking.openURL("http://www.vrct.kr")}>
                        <View style={styles.settingMenu}>
                            <Image source={require('../css/imgs/homepage.png')} style={styles.settingMenuImage}/>
                            <NetmarbleL>{translate('homepage')}</NetmarbleL>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>this.logout()}>
                        <View style={styles.settingMenu}>
                            <Image source={require('../css/imgs/logout.png')} style={styles.settingMenuImage}/>
                            <NetmarbleL>{translate('logout')}</NetmarbleL>
                        </View>
                    </TouchableOpacity>
                    <View style={{borderColor:"#4d221e1f",borderWidth:1,alignItems:"center",padding:25,marginTop:40}}>
                        <View style={{borderColor:"#b4b4b4",borderBottomWidth:1,alignItems:"center",paddingBottom:20,width:"100%"}}>
                            <NetmarbleL>{translate('dev_info')}</NetmarbleL>
                        </View>
                        <View style={{alignItems:"center"}}>
                            <NetmarbleL style={{marginTop:20,color:"#b4b4b4",fontSize:14}}>{translate('pm')}</NetmarbleL>
                            <Komako>Aboa (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> Aboa#9076)</Komako>
                            <NetmarbleL style={{marginTop:20,color:"#b4b4b4",fontSize:14}}>{translate('developer')}</NetmarbleL>
                            <Komako>Leth (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> Hana#4158)</Komako>
                            <Komako>늦잠 (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> sychoi#4273)</Komako>
                            <NetmarbleL style={{marginTop:20,color:"#b4b4b4",fontSize:14}}>{translate('designer')}</NetmarbleL>
                            <Komako>세르뀨 (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> 세르뀨#1388)</Komako>
                            <Komako>은혜 (<Image style={{width:20,height:20}} source={require('../css/imgs/discord.png')}/> 은혜#0372)</Komako>
                            <NetmarbleL style={{marginTop:20,color:"#b4b4b4",fontSize:14}}>{translate('tester')}</NetmarbleL>
                            <Komako>Excite / きゆ / 옌딩</Komako>
                        </View>
                    </View>
                </View>
                <Modal
                isVisible={this.state.langCheck}
                onBackButtonPress={()=>this.setState({langCheck:!this.state.langCheck})}
                onBackdropPress={()=>this.setState({langCheck:!this.state.langCheck})}>
                    <View style={{backgroundColor:"#fff",padding:"5%",borderRadius:10}}>
                        <View style={{alignItems:"center"}}>
                            <View style={{flexDirection:"column",width:"100%"}}>
                                <Button
                                onPress={this.langSelect.bind(this,'kr')}
                                style={[styles.requestButton,{borderWidth:0,backgroundColor:"#279cff"}]}>
                                    <NetmarbleB style={{color:"white"}}>한국어</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'en')}
                                style={[styles.requestButton,{marginTop:10,marginBottom:10,borderWidth:0,backgroundColor:"#279cff"}]}>
                                    <NetmarbleB style={{color:"white"}}>English</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'jp')}
                                style={[styles.requestButton,{borderWidth:0,backgroundColor:"#279cff"}]}>
                                    <NetmarbleB style={{color:"white"}}>日本語</NetmarbleB>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}