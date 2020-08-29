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
    AsyncStorage
} from "react-native";
import base64 from 'base-64';
import { Actions } from "react-native-router-flux";
import { Col, Row } from "react-native-easy-grid";

export default class MainScSc extends Component {
    constructor(props) {
        console.info("MainSc => constructor");

        super(props);

        this.state = {
            getFirend:null,
            getUserInfo:null,
            refreshing:false,
            getFirendOff:0,
            getFirendOff_1:0,
            getFirendOff_2:0,
            getFirendOff_3:0,
            getFirendActive:0,
            getFirendActive_1:0,
            getFirendActive_2:0,
            getFirendActive_3:0,
            getAllFriends:0
        };
    }

    UNSAFE_componentWillMount() {
        console.info("MainSc => componentWillMount");
        this.getFirend();
        this.getUserInfo();
    }

    componentWillUnmount() {
        console.info("MainSc => componentWillUnmount");
    }
    componentDidMount() {
        console.info("MainSc => componentDidMount");
    }
    logout()
    {
        console.log("LoginSc => logout");
        fetch("https://api.vrchat.cloud/api/1/logout", {
            method: "PUT",
            headers: {
            "User-Agent":"VT",
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            Actions.replace("loginSc");
        });
    }
    getUserInfo()
    {
        console.log("LoginSc => getUserInfo");
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
            this.setState({
                getUserInfo:responseJson
            });
        })
    }
    getFirend()
    {
        console.log("LoginSc => getFirend");
        // 온라인 유저 get
        fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=false", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "User-Agent":"VT",
            "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            this.setState({
                getFirendActive_1:responseJson
            });
        })
        fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=false&offset=100", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "User-Agent":"VT",
            "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            this.setState({
                getFirendActive_2:responseJson
            });
        })
        fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=false&offset=200", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "User-Agent":"VT",
            "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            this.setState({
                getFirendActive_3:responseJson
            });
        })

        // 오프라인 유저 get
        fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=true", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "User-Agent":"VT",
            "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            this.setState({
                getFirendOff_1:responseJson
            });
        })
        fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=true&offset=100", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "User-Agent":"VT",
            "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            this.setState({
                getFirendOff_2:responseJson
            });
        })
        fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=true&offset=200", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "User-Agent":"VT",
            "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            this.setState({
                getFirendOff_3:responseJson
            });
        })
    }
    refreshData = () =>
    {
        console.log("LoginSc => refreshData");
        this.getFirend();
        this.getUserInfo();
        this.setState({
            refreshing:false
        });
    }

    render() {
        this.state.getFirendOff = this.state.getFirendOff_1.length + this.state.getFirendOff_2.length + this.state.getFirendOff_3.length;
        this.state.getFirendActive = this.state.getFirendActive_1.length + this.state.getFirendActive_2.length + this.state.getFirendActive_3.length;
        this.state.getAllFriends = this.state.getFirendActive + this.state.getFirendOff;

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
                    <Text>
                        {"<"}등급{">"}
                    </Text>
                    {
                        this.state.getUserInfo != null ? 
                        <Image
                            style={{width: 100, height: 90}}
                            source={{uri:this.state.getUserInfo.currentAvatarThumbnailImageUrl}}
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
                                {this.state.getAllFriends+"명"}
                            </Text>
                        </Col>
                        <Col>
                            <Text style={styles.friendsInfo}>
                                온라인{"\n"}
                                {this.state.getFirendActive+"명"}
                            </Text>
                        </Col>
                        <Col>
                            <Text style={styles.friendsInfo}>
                                오프라인{"\n"}
                                {this.state.getFirendOff+"명"}
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