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
    ToastAndroid,
    BackHandler
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';

export default class LoginSc extends Component {
    constructor(props) {
        console.info("LoginSc => constructor");

        super(props);

        this.state = {
            id:"",
            pw:"",
            loginCheck:true,
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
        BackHandler.addEventListener('hardwareBackPress', this.backHandler);
        
    }

    componentWillUnmount() {
        console.info("LoginSc => componentWillUnmount");
        BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
    }

    componentDidMount() {
        console.info("LoginSc => componentDidMount");
    }

    loginCheck = () =>
    {
        console.log("LoginSc => loginCheck");
        fetch("https://api.vrchat.cloud/api/1/auth/user", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "User-Agent":"VT",
            "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(!responseJson.error)
            {
                this.setState({
                    loginCheck:true
                })
                Actions.mainSc();
            }
            else if(responseJson.error)
            {
                this.setState({
                    loginCheck:false
                })
            }
        });
    }

    login = () =>
    {
        console.log("LoginSc => login");
        
        // utf8 문자 감지 후 base64 변환
        const user = base64.encode(utf8.encode(this.state.id+":"+this.state.pw));

        fetch("https://api.vrchat.cloud/api/1/auth/user", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent":"VT",
            "Authorization":"Basic "+user
            }
        })
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

    // 백핸들러
    backHandler = () =>
    {
        // 메인화면일경우만 감지하여 종료실행
        console.log("asd");
        if(Actions.currentScene == "loginSc")
        {
            let timeout;
            if (this.state.exitApp == false) {
                ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
                this.state.exitApp = true;

                timeout = setTimeout(() => {
                    this.state.exitApp = false;
                },2500);
            } else {
                BackHandler.exitApp();  // 앱 종료
            }
        }
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
                        // onPress={this.logout.bind(this)}
                        style={{marginTop:30,width:"100%",justifyContent:"center"}}
                        >
                        <Text>회원가입</Text>
                        </Button>
                    </View>
                </View>
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