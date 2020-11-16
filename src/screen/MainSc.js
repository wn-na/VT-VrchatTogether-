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
    SafeAreaView,
    ScrollView,
    RefreshControl,
    View,
    TextInput,
    Dimensions,
    Alert,
    AsyncStorage,
    ToastAndroid,
    BackHandler,
    ActivityIndicator
} from "react-native";
import {UserGrade} from './../utils/UserUtils';
import Modal from 'react-native-modal';
import { Actions, Router } from "react-native-router-flux";
import { Col, Row } from "react-native-easy-grid";
import {VRChatAPIGet, VRChatImage, VRChatAPIPut} from '../utils/ApiUtils'

export default class MainSc extends Component {
    constructor(props) {
        console.info("MainSc => constructor");

        super(props);

        this.state = {
            getUserInfo:null,
            refreshing:false,
            onCount:0,
            offCount:0,
            allCount:0,
            refreshTime:false,
            exitApp:false,
            modalVisible:true
        };
    }

    async UNSAFE_componentWillMount() {
        console.info("MainSc => componentWillMount");

        this.getUserInfo();
        await this.getFirend();
        BackHandler.addEventListener('hardwareBackPress', this.backHandler);
    }

    componentWillUnmount() {
        console.info("MainSc => componentWillUnmount");
        BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
    }

    componentDidMount() {
        console.info("MainSc => componentDidMount");
    }

    // 로그아웃 처리
    logout = () =>
    {
        console.log("LoginSc => logout");
        Alert.alert(
            "안내",
            "로그아웃 하시겠습니까?",
            [
                {text: "확인", onPress: () => {
                    console.log("press logout")
                    fetch("https://api.vrchat.cloud/api/1/logout", VRChatAPIPut)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        Actions.replace("loginSc");
                    });
                }},
                {text: "취소", onPress: () => {console.log("press logout")}}
            ]
        );
    }

    // 자기정보 가져옴
    getUserInfo = () =>
    {
        console.log("LoginSc => getUserInfo");

        fetch("https://api.vrchat.cloud/api/1/auth/user", VRChatAPIGet)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                getUserInfo:responseJson
            });
        })
    }

    // 온라인친구 가져오기
    getFirendOn = async(offSet) =>
    {
        const responseOn = await fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=false&offset="+offSet, VRChatAPIGet);
        return new Promise((resolve, reject) =>
        setTimeout(() =>{
            resolve(responseOn.json());
        }, 100) );
    }

    // 오프라인친구 가져오기
    getFirendOff = async(offSet) =>
    {
        const responseOff = await fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=true&offset="+offSet, VRChatAPIGet);
        return new Promise((resolve, reject) =>
        setTimeout(() =>{
            resolve(responseOff.json());
        }, 100) );
    }

    // 온라인 & 오프라인친구 호출
    // 온라인 오프라인을 동시에 불러오기에는 병렬처리 효과가 크게 나지않기에 분리
    getFirend = async() =>
    {
        console.log("LoginSc => getFirend");

        let onCount  = 0;
        let offCount = 0;
        let offSet = 0;
        let promise;
        // Promise.all 이용하여 병렬처리 진행
        for(let i=0;i<10;i++)
        {
            promise = Promise.all([this.getFirendOn(offSet),this.getFirendOff(offSet)])
            .then((result) => {
                this.setState({
                    // result[0]은 온라인 친구 result[1]은 오프라인 친구
                    // 배열에 넣은순서대로 결과값도 순서대로 넘어옴
                    onCount : onCount += result[0].length,
                    offCount : offCount += result[1].length
                });
            });
            offSet+=100;
        }

        promise.done(() => {
            this.setState({
                modalVisible:false
            })
        })
    }

    // 새로고침 시 5초 카운팅기능
    refreshData = () =>
    {
        console.log("LoginSc => refreshData");

        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);
            this.getFirend();
            this.getUserInfo();
            this.setState({
                refreshing:false
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    // 백핸들러
    backHandler = () =>
    {
        // 메인화면일경우만 감지하여 종료실행
        if(Actions.currentScene == "mainSc")
        {
            let timeout;
            if (this.state.exitApp == false) {
                ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
                this.state.exitApp = true;
    
                timeout = setTimeout(() => {
                    this.state.exitApp = false;
                }, 3000);
            } else {
                BackHandler.exitApp();  // 앱 종료
            }
        }
    }

    render() {
        this.state.allCount = this.state.onCount + this.state.offCount;

        console.info("MainSc => render");
        
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshData}
                    />
                }
                >
                <View style={{alignItems:"flex-end",marginRight:"5%"}}>
                    <Button
                        onPress={this.logout.bind(this)}
                        style={{marginTop:10,width:100,justifyContent:"center"}}
                        >
                        <Text>로그아웃</Text>
                    </Button>
                </View>
                <View style={styles.topMain}>
                    {
                        this.state.getUserInfo != null ? 
                        <Image
                            style={{width: 100, height: 100, borderRadius:20, borderWidth:3, borderColor: UserGrade(this.state.getUserInfo.tags)}}
                            source={VRChatImage(this.state.getUserInfo.currentAvatarImageUrl)}
                        />
                        : null
                    }
                    <Text style={{textAlign:"right"}}>
                        {this.state.getUserInfo != null ? this.state.getUserInfo.displayName : null}{"\n"}
                    </Text>
                    <Row>
                        <Col>
                            <Text style={styles.friendsInfo}>
                                전체{"\n"}
                                {this.state.allCount+"명"}
                            </Text>
                        </Col>
                        <Col>
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
                <View style={styles.menu}>
                    <Button
                    onPress={Actions.alertSc}
                    style={styles.infoButton}>
                        <Text>알림</Text>
                    </Button>
                    <Button
                    onPress={Actions.friendListSc}
                    style={styles.infoButton}>
                        <Text>친구목록</Text>
                    </Button>
                    <Button
                    onPress={Actions.mapListSc}
                    style={styles.infoButton}>
                        <Text>맵 목록</Text>
                    </Button>
                    <Button
                    onPress={Actions.avatarListSc}
                    style={styles.infoButton}>
                        <Text>아바타 목록</Text>
                    </Button>
                    <Button
                    onPress={Actions.favoriteSc}
                    style={styles.infoButton}>
                        <Text>즐겨찾기 관리</Text>
                    </Button>
                    <Button
                    onPress={Actions.blockSc}
                    style={styles.infoButton}>
                        <Text>블락 관리</Text>
                    </Button>
                </View>
                <Modal
                isVisible={this.state.modalVisible}>
                    <ActivityIndicator size={100}/>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    topMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight:"5%",
        paddingLeft:"5%",
        paddingBottom:"5%",
    },
    friendsInfo: {
        textAlign:"center",
    },
    menu: {
        flex:1,
        flexWrap:"wrap",
        flexDirection:"row",
        marginTop:"-5%",
        justifyContent:"center",
        marginTop:"2%"
    },
    textView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"80%",
        flexDirection:"row",
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    infoButton:{
        alignItems: 'center',
        justifyContent: 'center',
        fontSize:25,
        width:"45%",
        marginTop:10,
        height:150,
        margin:5,
        borderRadius:20
    }
});