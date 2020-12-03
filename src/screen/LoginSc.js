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
import {VRChatAPIGet, VRChatAPIGetAuth} from '../utils/ApiUtils';
import styles from '../css/css';
import {NetmarbleL,NetmarbleB} from '../utils/CssUtils';

export default class LoginSc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            pw: "",
            loginCheck: true,
            loginFail: null,
            isPermit: false,
            aniPosition: new Animated.ValueXY({x:0,y:0}),
            loadingText:"로딩중..."
        };
    }

    UNSAFE_componentWillMount() {
        AsyncStorage.getItem("storage_id",(err, value)=>{
            this.setState({
                id:value
            });
        });
        AsyncStorage.getItem("permit_check",(err, value)=>{
            this.setState({
                isPermit:value == "check" ? false : true
            });
        });
        this.loginCheck();
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
            isPermit: false
        });
    }

    loginCheck = async() =>
    {
        await fetch(`https://api.vrchat.cloud/api/1/auth/user`, VRChatAPIGet)
        .then((response) => response.json())
        .then((responseJson) => {
            if(!responseJson.error)
            {
                this.setState({
                    loginCheck:true,
                    loadingText: "잠시후 메인화면으로 이동합니다."
                });
                setTimeout(()=>{
                    Actions.mainSc();
                },1000);
            }
            else if(responseJson.error)
            {
                this.setState({
                    loginCheck:false
                });
            }
        });
    }

    login = async() =>
    {
        // utf8 문자 감지 후 base64 변환
        const user = base64.encode(utf8.encode(this.state.id+":"+this.state.pw));

        await fetch(`https://api.vrchat.cloud/api/1/auth/user`, VRChatAPIGetAuth(user))
        .then(response => response.json())
        .then(responseJson => {
            if(!responseJson.error)
            {
                AsyncStorage.setItem("storage_id", this.state.id);
                setTimeout(()=>{
                    Actions.mainSc();
                },1000);
                this.setState({
                    loginFail: true
                });
            }
            else
            {
                this.setState({
                    loginFail: false
                });
                this.shakeAni();
            }
        });
    }
    
    render() {
        return (
            this.state.loginCheck == false ?
            <View style={{flex:1}}>
                <ImageBackground
                style={{width:"100%",height:"100%"}}
                source={require('../css/imgs/login_background.png')}>
                    <View style={styles.loginBox}>
                        <View style={{height:100, justifyContent:"center"}}>
                            {
                                this.state.loginFail == true ?
                                <View>
                                    <Animated.View style={{alignItems:"center",transform:[{translateX:this.state.aniPosition.x}]}}>
                                        <Icon name={"check-circle"} size={80} style={{color:"#279cff"}} />
                                    </Animated.View>
                                    <NetmarbleL style={{color:"#279cff",fontSize:14,textAlign:"center"}}>로그인 성공</NetmarbleL>
                                </View>
                                : this.state.loginFail == false &&
                                <View>
                                    <Animated.View style={{alignItems:"center",transform:[{translateX:this.state.aniPosition.x}]}}>
                                        <Icon name={"x-circle"} size={80} style={{color:"#fc9090"}} />
                                    </Animated.View>
                                    <NetmarbleL style={{color:"#fc9090",fontSize:14,textAlign:"center"}}>아이디 혹은 비밀번호가 일치하지 않습니다.</NetmarbleL>
                                </View>
                            }
                        </View>
                        <NetmarbleB style={{color:"#279cff",fontSize:35}}>
                            Login
                        </NetmarbleB>
                        <View style={styles.loginTextBox}>
                            <TextInput 
                            placeholder="이메일을 입력해주세요."
                            value={this.state.id}
                            onChangeText={(text)=>this.setState({id:text})}
                            onSubmitEditing={() => { this.secondTextInput.focus(); }}
                            style={{marginRight:"0%",width:"90%",fontFamily:"NetmarbleL"}}/>
                            <Icon name="user" size={25} style={{marginTop:15,color:"#888c8b"}}/>
                        </View>
                        <View style={[styles.loginTextBox,{marginTop:20}]}>
                            <TextInput 
                            ref={(input) => { this.secondTextInput = input; }}
                            placeholder="비밀번호을 입력해주세요."
                            value={this.state.pw}
                            onChangeText={(text)=>this.setState({pw:text})}
                            onSubmitEditing={this.login.bind(this)}
                            secureTextEntry
                            style={{marginRight:"0%",width:"90%",fontFamily:"NetmarbleL"}}/>
                            <Icon name="lock" size={25} style={{marginTop:15,color:"#888c8b"}}/>
                        </View>
                        <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:"10%",width:"80%"}}>
                            <Button
                            onPress={this.login.bind(this)}
                            style={[styles.requestButton,{width:"48%",borderWidth:0,backgroundColor:"#279cff"}]}>
                            <NetmarbleB style={{color:"white"}}>로그인</NetmarbleB>
                            </Button>
                            <Button
                            onPress={()=>Linking.openURL("https://api.vrchat.cloud/home/register")}
                            style={[styles.requestButton,{width:"48%",borderWidth:0,elevation:0}]}>
                            <NetmarbleB style={{color:"black"}}>회원가입</NetmarbleB>
                            </Button>
                        </View>
                    </View>
                    <Modal
                    isVisible={this.state.isPermit}>
                        <View style={{backgroundColor:"#fff",padding:"5%",borderRadius:10}}>
                            <View style={{alignItems:"center"}}>
                                <NetmarbleB style={{fontSize:30}}>
                                    안내
                                </NetmarbleB>
                                <NetmarbleL style={{textAlign:"center"}}>
                                    VT는 <NetmarbleB>비공식 앱</NetmarbleB>입니다.{"\n"}
                                    앱을 악용할 경우 Vrchat 계정을 정지 당할 수 있습니다.
                                    그에 따른 책임은 사용자에게 있으며, 해당 앱을 사용하는 것은
                                    이 부분의 동의하는 것으로 간주합니다.{"\n"}
                                </NetmarbleL>
                                <NetmarbleB>
                                    동의 하시겠습니까?
                                </NetmarbleB>
                                <View style={{flexDirection:"row"}}>
                                    <Button 
                                    onPress={this.permit.bind(this)}
                                    style={[styles.requestButton,{width:"30%",height:40,margin:10,justifyContent:"center"}]}>
                                        <NetmarbleL>동의</NetmarbleL>
                                    </Button>
                                    <Button 
                                    onPress={()=>BackHandler.exitApp()}
                                    style={[styles.requestButton,{width:"30%",height:40,margin:10,justifyContent:"center"}]}>
                                        <NetmarbleL>비동의</NetmarbleL>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ImageBackground>
            </View>
            :
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Image
                style={{flex:0.5,width:"90%",height:"90%",resizeMode:"contain"}}
                source={require('../css/imgs/logo.png')}></Image>
                <ActivityIndicator size={100}/>
                <NetmarbleL>{this.state.loadingText}</NetmarbleL>
            </View>
        );
    }
}