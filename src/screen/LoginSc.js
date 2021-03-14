import React, { Component } from "react";
// common component
import {
    Button,
    Text,
} from "native-base";
import {
    View,
    TextInput,
    Alert,
    AsyncStorage,
    Linking,
    BackHandler,
    ImageBackground,
    Animated,
    Image,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';
import Modal from 'react-native-modal';
import {
    getUserInfo,
    getAlerts,
    getFriends,
    getBlocks,
    getAgainst,
    userInfo
} from './../utils/UserUtils';
import {getFavoriteMap, getFavoriteWorldTag} from '../utils/MapUtils';
import {VRChatAPIGet, VRChatAPIGetAuth, VRChatAPIPostBody, VRChatAPIPut} from '../utils/ApiUtils';
import styles from '../css/css';
import {NetmarbleL,NetmarbleB} from '../utils/CssUtils';
import {translate, getLanguage, setLanguage, userLang} from '../translate/TranslateUtils';

export default class LoginSc extends Component {
    constructor(props) {
        super(props);
        AsyncStorage.getItem("storage_id",(err, value)=>{
            this.setState({
                id:value
            });
        });
        AsyncStorage.getItem("storage_pw",(err, value)=>{
            this.setState({
                pw:value
            });
        });
        AsyncStorage.getItem("user_lang",(err, value)=>{
            if(value != null)
            {
                getLanguage();
                setLanguage(value);
                this.autoLogin();
                this.setState({
                    langCheck: false,
                });
            }
            else
            {
                this.setState({
                    langCheck: true
                });
                getLanguage();
            }
        });
        this.state = {
            id: null,
            pw: null,
            otp: null,
            otpCheck: false,
            autoLogin: null,
            autoLoginCheck: true,
            loginCheck: null,
            isPermit: false,
            langCheck: true,
            langReCheck: false,
            aniPosition: new Animated.ValueXY({x:0,y:0}),
            loadingText: translate('loading'),
            update: false,
            updateFunction: () => this.setState({update:!this.state.update}),
            loginLoading: false,
        };
    }

    UNSAFE_componentWillMount() {
        AsyncStorage.getItem("permit_check",(err, value)=>{
            this.setState({
                isPermit:value == "check" ? false : true
            });
        });
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    shakeAni() {
        Animated.sequence([
            Animated.timing(
                this.state.aniPosition,{
                    toValue : {x:7, y:0},
                    duration: 50,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                this.state.aniPosition,{
                    toValue : {x:-7, y:0},
                    duration: 50,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                this.state.aniPosition,{
                    toValue : {x:7, y:0},
                    duration: 50,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                this.state.aniPosition,{
                    toValue : {x:-7, y:0},
                    duration: 50,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                this.state.aniPosition,{
                    toValue : {x:0, y:0},
                    duration: 50,
                    useNativeDriver: true
                }
            )
        ]).start();
    }

    permit() {
        AsyncStorage.setItem("permit_check", "check");
        
        this.setState({
            isPermit: false,
            langCheck: false,
        });
    }

    async autoLogin() {
        if(this.state.pw != null)
        {
            this.setState({
                autoLogin: true
            })
            const user = base64.encode(utf8.encode(this.state.id+":"+this.state.pw));

            await fetch(`https://api.vrchat.cloud/api/1/auth/user`, VRChatAPIGetAuth(user))
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.requiresTwoFactorAuth)
                {
                    this.setState({
                        autoLoginCheck:false,
                        otpCheck: true
                    })
                }
                else if(!responseJson.error)
                {
                    AsyncStorage.setItem("storage_id", this.state.id);
                    AsyncStorage.setItem("storage_pw", this.state.pw);
                    this.setState({
                        autoLoginCheck:true,
                        loadingText: translate('msg_redirect_main'),
                        loginCheck: true
                    });
                    this.getData();
                }
                else if(responseJson.error)
                {
                    this.setState({
                        autoLoginCheck:false,
                        loginCheck: false
                    });
                }
            });
        }
        else
        {
            this.setState({
                autoLoginCheck : false
            });
        }
    }

    login = async() => {
        if(this.state.id == null || this.state.id == "")
        {
            Alert.alert(
                translate('error'),
                translate('id_null_error'),
                [{text: translate('ok')}]
            );

            return false;
        }
        if(this.state.pw == null || this.state.pw == "")
        {
            Alert.alert(
                translate('error'),
                translate('pw_null_error'),
                [{text: translate('ok')}]
            );

            return false;
        }

        // utf8 문자 감지 후 base64 변환
        const user = base64.encode(utf8.encode(this.state.id+":"+this.state.pw));
        
        this.setState({
            loginLoading: true
        });

        await fetch(`https://api.vrchat.cloud/api/1/auth/user`, VRChatAPIGetAuth(user))
        .then(response => response.json())
        .then(responseJson => {
            if(responseJson.requiresTwoFactorAuth)
            {
                AsyncStorage.setItem("storage_id", this.state.id);
                AsyncStorage.setItem("storage_pw", this.state.pw);
                this.setState({
                    autoLoginCheck:false,
                    otpCheck: true
                })
            }
            else if(!responseJson.error)
            {
                AsyncStorage.setItem("storage_id", this.state.id);
                AsyncStorage.setItem("storage_pw", this.state.pw);
                this.setState({
                    loadingText: translate('msg_redirect_main'),
                    loginCheck: true
                });
                this.getData();
            }
            else if(responseJson.error)
            {
                this.setState({
                    autoLoginCheck:false,
                    loginCheck: false,
                    loginLoading: false
                });
            }
        });
    }

    async getData() {
        await getUserInfo(this.state);
        Promise.all([
            getAlerts(this.state),
            getBlocks(this.state),
            getAgainst(this.state),
            getFavoriteMap(),
            getFavoriteWorldTag()
        ])
        
        this.setState({
            loadingText: translate('msg_friend_list'),
            loginLoading: false
        });

        await getFriends(this.state)
        .then(() => Actions.mainSc());
    }
    
    langSelect(lang) {
        userLang(lang);
        this.setState({
            langCheck: false,
            langReCheck: false,
        });

        this.autoLogin();
    }
    
    async checkOtpNumber() {
        if(this.state.otp == null || this.state.otp == "" || this.state.otp.length != 6)
        {
            Alert.alert(
                translate('error'),
                translate('otp_check_length_msg'),
                [{text: translate('ok')}]
            );
        }
        else
        {
            await fetch("https://api.vrchat.cloud/api/1/auth/twofactorauth/totp/verify", VRChatAPIPostBody({
                "code":this.state.otp,
            }))
            .then(response => response.json())
            .then(responseJson => {
                if(responseJson.verified)
                {
                    Alert.alert(
                        translate('notice'),
                        translate('otp_check_success'),
                        [{text: translate('ok'), onPress: () => this.getData()}]
                    );
                }
                else if(!responseJson.verified)
                {
                    Alert.alert(
                        translate('error'),
                        translate('otp_check_fail'),
                        [{text: translate('ok')}]
                    );
                }
                else
                {
                    Alert.alert(
                        translate('error'),
                        translate('otp_request_error'),
                        [{text: translate('ok')}]
                    );
                }
            });
        }
    }

    logout = () => {
        Alert.alert(
            translate('information'),
            translate('msg_logout'),
            [
                {text: translate('ok'), onPress: () => {
                    fetch(`https://api.vrchat.cloud/api/1/logout`, VRChatAPIPut)
                    .then((response) => response.json())
                    .then(() => {
                        AsyncStorage.removeItem("storage_pw");
                        Actions.replace("loginSc");
                        this.setState({
                            autoLoginCheck:false,
                            otpCheck: false,
                            pw: ""
                        })
                    });
                }},
                {text: translate('cancel')}
            ]
        );
    }

    render() {
        if(this.state.langCheck == true)
        {
            return (
                <Modal
                isVisible={this.state.langCheck}>
                    <View style={{backgroundColor:"#fff",padding:"5%",borderRadius:10}}>
                        <View style={{alignItems:"center"}}>
                            <View style={{flexDirection:"column",width:"100%"}}>
                                <Button
                                onPress={this.langSelect.bind(this,'kr')}
                                style={[styles.requestButton, { borderWidth:0, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>한국어</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'en')}
                                style={[styles.requestButton, { marginTop:10, marginBottom:10, borderWidth:0, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>English</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'jp')}
                                style={[styles.requestButton, { borderWidth:0, marginBottom:10, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>日本語</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'es')}
                                style={[styles.requestButton, { borderWidth:0, marginBottom:10, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>Español</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.langSelect.bind(this,'br')}
                                style={[styles.requestButton, { borderWidth:0, backgroundColor:"#279cff" }]}>
                                    <NetmarbleB style={{color:"white"}}>Portugués</NetmarbleB>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            )
        }
        if(this.state.autoLoginCheck == false && this.state.otpCheck == true)
        {
            return (
                <Modal
                isVisible={this.state.otpCheck}>
                    <View style={{backgroundColor:"#fff",padding:"5%",borderRadius:10}}>
                        <View>
                            <Animated.View style={{alignItems:"center",transform:[{translateX:this.state.aniPosition.x}]}}>
                                <Icon name={"alert-circle"} size={80} style={{color:"#0fb74c"}} />
                            </Animated.View>
                            <NetmarbleL style={{color:"#0fb74c",fontSize:14,textAlign:"center"}}>
                                {translate('otp_check_info')}
                            </NetmarbleL>
                            <View style={[styles.loginTextBox,{width:"100%"}]}>
                                <TextInput 
                                    placeholder={translate('otp_check_length_msg')}
                                    value={this.state.otp}
                                    onChangeText={(text)=>this.setState({otp:text})}
                                    onSubmitEditing={() => this.checkOtpNumber()}
                                    keyboardType={"numeric"}
                                    style={{marginRight:"0%",width:"100%",fontFamily:"NetmarbleL"}}/>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:"3%",width:"100%"}}>
                                <Button
                                onPress={this.checkOtpNumber.bind(this)}
                                style={[styles.requestButton,{width:"48%",borderWidth:0,backgroundColor:"#279cff"}]}>
                                <NetmarbleB style={{color:"white"}}>{translate('otp_check')}</NetmarbleB>
                                </Button>
                                <Button
                                onPress={this.logout.bind(this)}
                                style={[styles.requestButton,{width:"48%",borderWidth:0,elevation:0}]}>
                                <NetmarbleB style={{color:"black"}}>{translate('logout')}</NetmarbleB>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            )
        }
        else if(this.state.autoLoginCheck == false && this.state.otpCheck == false)
        {
            return (
                <View style={{flex:1}}>
                    <ImageBackground
                    style={{width:"100%",height:"100%"}}
                    source={require('../css/imgs/login_background.png')}>
                        <View style={styles.loginBox}>
                            <View style={{height:100, justifyContent:"center"}}>
                                {
                                    this.state.loginCheck == true ?
                                    <View>
                                        <Animated.View style={{alignItems:"center",transform:[{translateX:this.state.aniPosition.x}]}}>
                                            <Icon name={"check-circle"} size={80} style={{color:"#279cff"}} />
                                        </Animated.View>
                                        <NetmarbleL style={{color:"#279cff",fontSize:14,textAlign:"center"}}>{translate('login_success')}</NetmarbleL>
                                    </View>
                                    : this.state.loginCheck == false &&
                                    <View>
                                        <Animated.View style={{alignItems:"center",transform:[{translateX:this.state.aniPosition.x}]}}>
                                            <Icon name={"x-circle"} size={80} style={{color:"#fc9090"}} />
                                        </Animated.View>
                                        <NetmarbleL style={{color:"#fc9090",fontSize:14,textAlign:"center"}}>{translate('login_fail')}</NetmarbleL>
                                    </View>
                                }
                            </View>
                            <NetmarbleB style={{color:"#279cff",fontSize:35}}>
                                {translate('login')}
                            </NetmarbleB>
                            <View style={styles.loginTextBox}>
                                <TextInput 
                                placeholder={translate('email_placeholder')}
                                value={this.state.id}
                                onChangeText={(text)=>this.setState({id:text})}
                                onSubmitEditing={() => { this.secondTextInput.focus(); }}
                                style={{marginRight:"0%",width:"90%",fontFamily:"NetmarbleL"}}/>
                                <Icon name="user" size={25} style={{marginTop:15,color:"#888c8b"}}/>
                            </View>
                            <View style={[styles.loginTextBox,{marginTop:20}]}>
                                <TextInput 
                                ref={(input) => { this.secondTextInput = input; }}
                                placeholder={translate('password_placeholder')}
                                value={this.state.pw}
                                onChangeText={(text)=>this.setState({pw:text})}
                                onSubmitEditing={this.login.bind(this)}
                                secureTextEntry
                                style={{marginRight:"0%",width:"90%",fontFamily:"NetmarbleL"}}/>
                                <Icon name="lock" size={25} style={{marginTop:15,color:"#888c8b"}}/>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:"3%",width:"80%"}}>
                                <Button
                                onPress={this.login.bind(this)}
                                disabled={this.state.loginCheck == true ? true : false}
                                style={[styles.requestButton,{width:"48%",borderWidth:0,backgroundColor:"#279cff"}]}>
                                    <NetmarbleB style={{color:"white",textAlign:"center"}}>{translate('login')}</NetmarbleB>
                                </Button>
                                <Button
                                onPress={()=>Linking.openURL("https://api.vrchat.cloud/home/register")}
                                disabled={this.state.loginCheck == true ? true : false}
                                style={[styles.requestButton,{width:"48%",borderWidth:0,elevation:0}]}>
                                    <NetmarbleB style={{color:"black",textAlign:"center"}}>{translate('register')}</NetmarbleB>
                                </Button>
                            </View>
                            <View style={{width: "80%", marginTop: "3%", flexDirection: "row", justifyContent:"center" }}>
                                <Button
                                onPress={()=>this.setState({ langReCheck: true })}
                                disabled={this.state.loginCheck == true ? true : false}
                                style={[styles.requestButton,{borderWidth:0,elevation:0}]}>
                                    <Image source={require('../css/imgs/trans_icon.png')} style={styles.settingMenuImage}/>
                                    <NetmarbleB style={{ height:25 }}>{translate('lang_option')}</NetmarbleB>
                                </Button>
                            </View>
                        </View>
                        <Modal
                        isVisible={this.state.langReCheck}
                        onBackButtonPress={()=>this.setState({ langReCheck: false })}
                        onBackdropPress={()=>this.setState({ langReCheck: false })}>
                            <View style={{backgroundColor:"#fff",padding:"5%",borderRadius:10}}>
                                <View style={{alignItems:"center"}}>
                                    <View style={{flexDirection:"column",width:"100%"}}>
                                        <Button
                                        onPress={this.langSelect.bind(this,'kr')}
                                        style={[styles.requestButton, { borderWidth:0, backgroundColor:"#279cff" }]}>
                                            <NetmarbleB style={{color:"white"}}>한국어</NetmarbleB>
                                        </Button>
                                        <Button
                                        onPress={this.langSelect.bind(this,'en')}
                                        style={[styles.requestButton, { marginTop:10, marginBottom:10, borderWidth:0, backgroundColor:"#279cff" }]}>
                                            <NetmarbleB style={{color:"white"}}>English</NetmarbleB>
                                        </Button>
                                        <Button
                                        onPress={this.langSelect.bind(this,'jp')}
                                        style={[styles.requestButton, { borderWidth:0, marginBottom:10, backgroundColor:"#279cff" }]}>
                                            <NetmarbleB style={{color:"white"}}>日本語</NetmarbleB>
                                        </Button>
                                        <Button
                                        onPress={this.langSelect.bind(this,'es')}
                                        style={[styles.requestButton, { borderWidth:0, marginBottom:10, backgroundColor:"#279cff" }]}>
                                            <NetmarbleB style={{color:"white"}}>Español</NetmarbleB>
                                        </Button>
                                        <Button
                                        onPress={this.langSelect.bind(this,'br')}
                                        style={[styles.requestButton, { borderWidth:0, backgroundColor:"#279cff" }]}>
                                            <NetmarbleB style={{color:"white"}}>Portugués</NetmarbleB>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <Modal
                        isVisible={this.state.loginLoading}>
                            <ActivityIndicator size={100}/>
                        </Modal>
                        <Modal
                        isVisible={this.state.isPermit}>
                            <View style={{backgroundColor:"#fff",padding:"5%",borderRadius:10}}>
                                <View style={{alignItems:"center"}}>
                                    <NetmarbleB style={{fontSize:30}}>
                                    {translate('information')}
                                    </NetmarbleB>
                                    <NetmarbleL style={{textAlign:"center"}}>
                                        {translate('msg_agreement_first')}<NetmarbleB>{translate('msg_agreement_unoffice')}</NetmarbleB>{translate('msg_agreement_second')}{'\n'}
                                        {translate('msg_agreement')}
                                    </NetmarbleL>
                                    <NetmarbleB>
                                        {translate('msg_agree_yn')}
                                    </NetmarbleB>
                                    <View style={{flexDirection:"row"}}>
                                        <Button 
                                        onPress={this.permit.bind(this)}
                                        style={[styles.requestButton,{width:"50%",height:40,margin:5,justifyContent:"center",textAlign:"center"}]}>
                                            <NetmarbleL>{translate('agree')}</NetmarbleL>
                                        </Button>
                                        <Button 
                                        onPress={()=>BackHandler.exitApp()}
                                        style={[styles.requestButton,{width:"50%",height:40,margin:5,justifyContent:"center",textAlign:"center"}]}>
                                            <NetmarbleL>{translate('disagree')}</NetmarbleL>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </ImageBackground>
                </View>
            )
        }
        if(this.state.autoLogin == true)
        {
            return (
                <View style={{flex:1,height:"100%",justifyContent:"center",alignItems:"center"}}>
                    <ImageBackground
                    style={{width:"100%",height:"100%"}}
                    source={require('../css/imgs/logo.png')}>
                        <View style={{flex:1,justifyContent:"flex-end",alignItems:"center"}}>
                            <View style={{marginBottom:80}}>
                                <ActivityIndicator color="#111459" size={100}/>
                                <NetmarbleL style={{color:"#fff"}}>{this.state.loadingText}</NetmarbleL>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            )
        }
        else
        {
            return (
                <></>
            )
        }
    }
}