import React, { Component } from "react";
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
    AsyncStorage,
    Linking,
    BackHandler
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';
import Modal from 'react-native-modal';
import {VRChatAPIGet, VRChatAPIGetAuth} from '../utils/ApiUtils'

export default class LoginSc extends Component {
    constructor(props) {
        console.info("LoginSc => constructor");

        super(props);

        this.state = {
            id: "",
            pw: "",
            loginCheck: true,
            isPermit: true
        };
    }

    UNSAFE_componentWillMount() {
        console.info("LoginSc => componentWillMount");
        AsyncStorage.getItem("storage_id",(err, value)=>{
            this.setState({
                id:value
            });
        });
        
        this.loginCheck();
    }

    componentWillUnmount() {
        console.info("LoginSc => componentWillUnmount");
    }

    componentDidMount() {
        console.info("LoginSc => componentDidMount");
    }

    loginCheck = () =>
    {
        console.log("LoginSc => loginCheck");

        fetch("https://api.vrchat.cloud/api/1/auth/user", VRChatAPIGet)
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
        console.log("LoginSc => login");
        
        // utf8 문자 감지 후 base64 변환
        const user = base64.encode(utf8.encode(this.state.id+":"+this.state.pw));

        fetch("https://api.vrchat.cloud/api/1/auth/user", VRChatAPIGetAuth(user))
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
                    [{text: "확인", onPress: () => console.log("press login")}]
                );
            }
        })
        .catch((r) => {
            console.log(r);
        })
    }
    
    render() {
        console.info("LoginSc => render");
        
        return (
            this.state.loginCheck == false ?
            <View style={{flex:1}}>
                <View style={styles.logo}>
                    <Text>로고</Text>
                </View>
                <View style={styles.login}>
                    <View style={styles.textView}>
                        <Icon name="user" size={30} style={{marginTop:5}}/>
                        <TextInput 
                        placeholder="이메일을 입력해주세요."
                        value={this.state.id}
                        onChangeText={(text)=>this.setState({id:text})}
                        style={{marginLeft:"5%",width:"95%"}}/>
                    </View>
                    <View style={styles.textView}>
                        <Icon name="lock" size={30} style={{marginTop:5}}/>
                        <TextInput 
                        placeholder="비밀번호을 입력해주세요."
                        value={this.state.pw}
                        onChangeText={(text)=>this.setState({pw:text})}
                        secureTextEntry
                        style={{marginLeft:"5%",width:"95%"}}/>
                    </View>
                    <View style={{flexDirection:"row",width:"80%"}}>
                        <Button
                        onPress={this.login.bind(this)}
                        style={{marginTop:40,width:"100%",justifyContent:"center"}}
                        >
                        <Text>로그인</Text>
                        </Button>
                    </View>
                    <View style={{flexDirection:"row",width:"80%"}}>
                        <Button
                        onPress={()=>Linking.openURL("https://vrchat.com/home/register")}
                        style={{marginTop:30,width:"100%",justifyContent:"center"}}
                        >
                        <Text>회원가입</Text>
                        </Button>
                    </View>
                </View>
                <Modal
                isVisible={this.state.isPermit}>
                    <View style={{backgroundColor:"#fff",padding:"5%"}}>
                        <View style={{alignItems:"center"}}>
                            <Text style={{fontSize:30}}>
                                안내
                            </Text>
                            <Text style={{textAlign:"center"}}>
                                이 앱은 비공식 앱입니다. API서비스가 종료되면 스토어에서 내려오게됩니다.{"\n"}
                                또한 앱을 악용할 경우 Vrchat 계정 자체를 정지당할 수 있습니다.
                                그에 따른 책임은 사용자에게 있으며, 해당 앱을 사용하는 것은
                                이 부분의 동의하는 것으로 간주합니다.{"\n"}
                            </Text>
                            <Text>
                                동의 하시겠습니까?
                            </Text>
                            <View style={{flexDirection:"row"}}>
                                <Button 
                                onPress={()=>this.setState({isPermit:false})}
                                style={{width:"20%",height:40,margin:10,justifyContent:"center"}}>
                                    <Text>동의</Text>
                                </Button>
                                <Button 
                                onPress={()=>BackHandler.exitApp()}
                                style={{width:"20%",height:40,margin:10,justifyContent:"center"}}>
                                    <Text>취소</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            :
            <View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    login: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
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