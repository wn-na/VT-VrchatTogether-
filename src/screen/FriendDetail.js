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
    TouchableOpacityBase
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
            indiInfo:[]
        };
    }

    UNSAFE_componentWillMount() {
        console.info("FriendDetail => componentWillMount");
        
        // 검색유저 정보
        fetch('https://api.vrchat.cloud/api/1/users/'+this.props.userId, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            console.log(responseJson)
            this.setState({
                getUserInfo:responseJson
            });

            fetch('https://api.vrchat.cloud/api/1/worlds/'+responseJson.worldId, {
                method: 'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            
            .then((responseJson) => {
                console.log(responseJson);
                if(!responseJson.error)
                {
                    this.setState({
                        getUserWInfo:responseJson
                    });
                }
            });
        })
    }

    componentWillUnmount() {
        console.info("FriendDetail => componentWillUnmount");
    }
    componentDidMount() {
        console.info("FriendDetail => componentDidMount");
    }
    
    render() {
        console.info("FriendDetail => render");
        if(this.state.getUserWInfo != null)
        {
            console.log(this.state.totalCount);
            this.state.indiInfo = this.state.getUserWInfo.instances.filter((v) => v.indexOf(this.state.getUserInfo.instanceId) != -1);
            console.log(this.state.indiInfo);
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
                                source={{uri:this.state.getUserInfo.currentAvatarThumbnailImageUrl}}
                            />
                        </View>
                        <Text style={{marginLeft:"3%"}}>
                            {this.state.getUserInfo.displayName}{"  "}
                            
                            {this.state.getUserInfo.location != "" ? <Icon style={{color:"green"}} name="controller-record"/> : null}
                            {this.state.getUserInfo.location == "" ? <Icon style={{color:"#b22222"}} name="controller-record"/> : null}
                            {"\n"}
                            
                            {this.state.getUserInfo.worldId == "private" ? "private" : this.state.getUserInfo.worldId != "private" && this.state.getUserInfo.worldId != "offline" ? "public" : this.state.getUserInfo.worldId == "offline" ? "offline" : null}{"\n"}
                        </Text>
                    </View>
                    {this.state.getUserWInfo != null ?
                    <View style={{marginTop:"2%"}}>
                        <Text style={{marginLeft:"5%",fontSize:25}}>현재 월드</Text>
                        <View style={styles.worldInfo}>
                            <View>
                                <Image
                                    style={{width: "100%", height: 250, borderRadius:20}}
                                    source={{uri:this.state.getUserWInfo.imageUrl}}
                                />
                            </View>
                            <Text>
                                {this.state.getUserWInfo.name}
                                {this.state.getUserInfo.instanceId.length <= 5 ? ": "+this.state.getUserInfo.instanceId : null}
                            </Text>
                            <Text>
                                {this.state.getUserWInfo.description}
                            </Text>
                            {this.state.indiInfo.length != 0 ? <Text>{this.state.indiInfo[0][1]}{"/"}{this.state.getUserWInfo.capacity} 명</Text> : null}
                            <Text>전체 {this.state.getUserWInfo.occupants+" 명"}</Text>
                        </View>
                    </View>
                    :null}
                </ScrollView>
                :null}
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