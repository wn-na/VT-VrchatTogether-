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
    Image,
    ScrollView
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
            isPermit: true
        };
    }

    UNSAFE_componentWillMount() {
        AsyncStorage.getItem("storage_id",(err, value)=>{
            this.setState({
                id:value
            });
        });
        
        AsyncStorage.getItem("permit_check",(err, value)=>{
            // this.setState({
            //     isPermit:value == "check" ? false : true
            // });
        });
        
        this.loginCheck();
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    permit() {
        AsyncStorage.setItem("permit_check", "check");
        
        this.setState({
            isPermit: false
        });
    }

    loginCheck = () =>
    {
        fetch(`https://api.vrchat.cloud/api/1/auth/user`, VRChatAPIGet)
        .then((response) => response.json())
        .then((responseJson) => {
            if(!responseJson.error)
            {
                this.setState({
                    loginCheck:true
                });
                Actions.mainSc();
            }
            else if(responseJson.error)
            {
                this.setState({
                    loginCheck:false
                });
            }
        });
    }

    login = () =>
    {
        // utf8 문자 감지 후 base64 변환
        const user = base64.encode(utf8.encode(this.state.id+":"+this.state.pw));

        fetch(`https://api.vrchat.cloud/api/1/auth/user`, VRChatAPIGetAuth(user))
        .then(response => response.json())
        .then(responseJson => {
            if(!responseJson.error)
            {
                AsyncStorage.setItem("storage_id", this.state.id);
                Actions.replace("mainSc");
            }
            else
            {
                Alert.alert(
                    "오류",
                    "아이디 혹은 비밀번호가 일치하지 않습니다.",
                    [{text: "확인"}]
                );
            }
        });
    }
    
    render() {
        return (
            this.state.loginCheck == false ?
            <ScrollView style={{flexGrow:1}}>
                <View style={styles.loginLogo}>
                    <Image
                    style={{width:450,height:450}}
                    source={require('../css/imgs/logo.png')}/>
                </View>
                <View style={styles.loginBox}>
                    <View style={styles.loginTextBox}>
                        <Icon name="user" size={30} style={{marginTop:5}}/>
                        <TextInput 
                        placeholder="이메일을 입력해주세요."
                        value={this.state.id}
                        onChangeText={(text)=>this.setState({id:text})}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        style={{marginLeft:"5%",width:"95%",fontFamily:"NetmarbleL"}}/>
                    </View>
                    <View style={styles.loginTextBox}>
                        <Icon name="lock" size={30} style={{marginTop:5}}/>
                        <TextInput 
                        ref={(input) => { this.secondTextInput = input; }}
                        placeholder="비밀번호을 입력해주세요."
                        value={this.state.pw}
                        onChangeText={(text)=>this.setState({pw:text})}
                        onSubmitEditing={this.login.bind(this)}
                        secureTextEntry
                        style={{marginLeft:"5%",width:"95%",fontFamily:"NetmarbleL"}}/>
                    </View>
                    <View style={{flexDirection:"row",width:"80%"}}>
                        <Button
                        onPress={this.login.bind(this)}
                        style={[styles.requestButton,{width:"100%",marginTop:40}]}>
                        <NetmarbleL>로그인</NetmarbleL>
                        </Button>
                    </View>
                    <View style={{flexDirection:"row",width:"80%"}}>
                        <Button
                        onPress={()=>Linking.openURL("https://api.vrchat.cloud/home/register")}
                        style={[styles.requestButton,{width:"100%",marginTop:30}]}>
                        <NetmarbleL>회원가입</NetmarbleL>
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
            </ScrollView>
            :
            <View>

            </View>
        );
    }
}

// const styles = StyleSheet.create({
//     logo: {
//         flex: 2,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     login: {
//         flex: 2,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     textView:{
//         borderBottomWidth:1,
//         borderBottomColor:"#000",
//         width:"80%",
//         flexDirection:"row",
//         alignItems: 'flex-start',
//         justifyContent: 'flex-start'
//     }
// });