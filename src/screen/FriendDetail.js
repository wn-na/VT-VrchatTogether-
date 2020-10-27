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
    Textarea,
    Fab,
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
    Picker,
    TouchableOpacityBase,
    ToastAndroid
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';
import { List, ListItem } from "react-native-elements";

export default class FriendDetail extends Component {
    constructor(props) {
        console.info("FriendDetail => constructor");

        super(props);

        this.state = {
            indiInfo:[],
            getUserInfo:null,
            getUserWInfo:null,
            getIsblocked:null
        };
    }

    UNSAFE_componentWillMount() {
        console.info("FriendDetail => componentWillMount");
        
        // 검색유저 정보
        fetch("https://api.vrchat.cloud/api/1/users/"+this.props.userId, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "User-Agent":"VT",
                "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                getUserInfo:responseJson
            });

            fetch("https://api.vrchat.cloud/api/1/worlds/"+responseJson.worldId, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "User-Agent":"VT",
                    "Content-Type": "application/json",
                }
            })
            .then((response) => response.json())
            
            .then((responseJson) => {
                if(!responseJson.error)
                {
                    this.setState({
                        getUserWInfo:responseJson
                    });
                }
            });
        });
        fetch("https://api.vrchat.cloud/api/1/auth/user/playermoderations", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "User-Agent":"VT",
                "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            serachCheck = responseJson.filter((v) => v.targetUserId.indexOf(this.props.userId) !== -1);
        });
        
    }

    componentWillUnmount() {
        console.info("FriendDetail => componentWillUnmount");
    }

    componentDidMount() {
        console.info("FriendDetail => componentDidMount");
    }

    favorite(id) {
        console.info("FriendDetail => favoriteWorld")
        const response = fetch("https://api.vrchat.cloud/api/1/favorites", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "User-Agent":"VT",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "type":"world",
                "tags":["worlds2"],
                "favoriteId":id
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
        });
    }

    unfriend(id,type) {
        if(type == true)
        {
            Alert.alert(
                "안내",
                "친구삭제 하시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        const response = fetch("https://api.vrchat.cloud/api/1/auth/user/friends/"+id, {
                            method: "DELETE",
                            headers: {
                                "Accept": "application/json",
                                "User-Agent":"VT",
                                "Content-Type": "application/json",
                            }
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson.success.status_code == "200")
                            {
                                this.setState({
                                    getUserInfo:{
                                        isFriend:false
                                    }
                                })
                                ToastAndroid.show("삭제가 완료되었습니다.", ToastAndroid.SHORT);
                            }
                            else
                            {
                                ToastAndroid.show("삭제에 실패하였습니다.", ToastAndroid.SHORT);
                            }
                            
                        });
                    }},
                    {text: "취소"}
                ]
            );
        }
        else
        {
            Alert.alert(
                "안내",
                "친구신청을 보내시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        const response = fetch("https://api.vrchat.cloud/api/1/user/"+id+"/friendRequest", {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "User-Agent":"VT",
                                "Content-Type": "application/json",
                            }
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            ToastAndroid.show("신청이 완료되었습니다.", ToastAndroid.SHORT);
                        });
                    }},
                    {text: "취소"}
                ]
            );
        }
    }
    
    block() {
        
    }

    render() {
        console.info("FriendDetail => render");
        if(this.state.getUserWInfo != null)
        {
            this.state.indiInfo = this.state.getUserWInfo.instances.filter((v) => v.indexOf(this.state.getUserInfo.instanceId) != -1);
        }
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>
                        {this.props.friendCheck != "false" ? "친구정보" : "아바타 상세보기"}
                    </Text>
                </Header>
                {this.state.getUserInfo != null ? 
                    <ScrollView>
                        <View style={{flex:1,flexDirection:"row",padding:"5%"}}>
                            <View>
                                <Text style={{textAlign:"center"}}>(등급)</Text>
                                <Image
                                    style={{width: 100, height: 100, borderWidth:2, borderColor:"blue", borderRadius:20}}
                                    source={{
                                        uri:this.state.getUserInfo.currentAvatarThumbnailImageUrl,
                                        method: "get",
                                        headers: {
                                            "User-Agent":"VT",
                                        }
                                    }}
                                />
                            </View>
                            <View style={{width:"100%",marginLeft:"3%"}}>
                                <Text>
                                    {this.state.getUserInfo.displayName}{"  "}
                                    {this.state.getUserInfo.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}
                                </Text>
                                {this.state.getUserInfo.statusDescription != "" && this.state.getUserInfo.statusDescription != null ?
                                    <Text style={{width:"70%",marginTop:"3%"}}>
                                        {this.state.getUserInfo.statusDescription != "" ? this.state.getUserInfo.statusDescription : ""}
                                    </Text>
                                    :
                                    null
                                }
                                <Text style={{marginTop:"3%"}}>
                                    {this.state.getUserInfo.location == "private" ? "private" : this.state.getUserInfo.location != "private" && this.state.getUserInfo.location != "offline" ? "public" : this.state.getUserInfo.location == "offline" ? "offline" : null}{"\n"}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:"row",width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                            <Button 
                                onPress={this.unfriend.bind(this,this.state.getUserInfo.id,this.state.getUserInfo.isFriend)}
                                style={{marginRight:15,width:"48%",justifyContent:"center"}}
                            >
                                <Text>{this.state.getUserInfo.isFriend == true ? "친구삭제" : "친구신청"}</Text>
                            </Button>
                            <Button onPress={()=>Actions.MapDetail({mapId:item.id})}
                                style={{width:"48%",justifyContent:"center"}}>
                                <Text>블락</Text>
                            </Button>
                        </View>
                        <View style={{width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                            <Button style={{justifyContent:"center"}}>
                                <Text>제작정보</Text>
                            </Button>
                        </View>
                        {this.state.getUserWInfo != null ?
                            <View style={{marginTop:"2%"}}>
                                <Text style={{marginLeft:"5%",fontSize:25}}>현재 월드</Text>
                                <View style={styles.worldInfo}>
                                    <View>
                                        <Image
                                            style={{width: "100%", height: 250, borderRadius:20}}
                                            source={{
                                                uri:this.state.getUserWInfo.imageUrl,
                                                method: "get",
                                                headers: {
                                                    "User-Agent":"VT",
                                                }
                                            }}
                                        />
                                    </View>
                                    <Text>
                                        {this.state.getUserWInfo.name}
                                        {this.state.getUserInfo.instanceId.length <= 5 ? "#"+this.state.getUserInfo.instanceId : null}
                                    </Text>
                                    <Text>
                                        {this.state.getUserWInfo.description}
                                    </Text>
                                        {this.state.indiInfo.length != 0 ? <Text>{this.state.indiInfo[0][1]}{"/"}{this.state.getUserWInfo.capacity} 명</Text> : 
                                        <Text>{this.state.getUserWInfo.capacity}{"/"}{this.state.getUserWInfo.capacity} 명</Text>}
                                    <Text>전체 {this.state.getUserWInfo.occupants+" 명"}</Text>
                                    <Button
                                        onPress={this.favorite.bind(this,this.state.getUserWInfo.id)}
                                        style={{marginTop:10,width:"100%",justifyContent:"center"}}
                                        >
                                        <Text>즐겨찾기 등록</Text>
                                    </Button>
                                </View>
                            </View>
                            :
                            null
                        }
                    </ScrollView>
                    :
                    null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#fff"
    },
    login: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:"red",
        borderWidth:2
    },
    worldInfo: {
        flex: 1,
        width:"90%",
        padding:10,
        borderWidth:1,
        marginLeft:"5%"
    },
    list:{
        width:"97%",
        marginLeft:"1.5%"
    },
    textView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"95%",
        marginLeft:"2%",
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"35%",
        marginLeft:"2%",
        marginTop:"5%",
        marginBottom:"5%"
    }
});