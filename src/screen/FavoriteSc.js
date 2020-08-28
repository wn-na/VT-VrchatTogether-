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
    CheckBox
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';

export default class FavoriteSc extends Component {
    constructor(props) {
        console.info("FavoriteSc => constructor");

        super(props);

        this.state = {
            getAvatar:null,
            getWorld:null,
            avatarCheck:true,
            worldCheck:false
        };
    }

    UNSAFE_componentWillMount() {
        console.info("FavoriteSc => componentWillMount");
        this.getAavatar();
        this.getWorld();
    }

    componentWillUnmount() {
        console.info("FavoriteSc => componentWillUnmount");
    }
    componentDidMount() {
        console.info("FavoriteSc => componentDidMount");
    }
    getAavatar()
    {
        fetch("https://api.vrchat.cloud/api/1/avatars/favorites", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "User-Agent":"VT",
            "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                getAvatar:responseJson
            });
        });
    }
    getWorld()
    {
        fetch("https://api.vrchat.cloud/api/1/worlds/favorites", {
            method: "GET",
            headers: {
            Accept: "application/json",
            "User-Agent":"VT",
            "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                getWorld:responseJson
            });
        });
    }
    checkAChange(value)
    {
        this.setState({
            avatarCheck:value,
            worldCheck:false
        });
        this.flist();
    }
    checkWChange(value)
    {
        this.setState({
            avatarCheck:false,
            worldCheck:value
        });
        this.flist();
    }
    flist()
    {
        if(this.state.avatarCheck == true && this.state.getAvatar != null)
        {
            return    <FlatList
                        style={styles.list}
                        data={this.state.getAvatar}
                        // onRefresh={this.reset.bind(this)}
                        // refreshing={this.state.refreshing}
                        renderItem={({item}) => 
                            <View style={{borderWidth:1}}>
                                <View
                                style={{flexDirection:"row",padding:"5%"}}>
                                    <View>
                                        <Image
                                            style={{width: 100, height: 100, borderRadius:20}}
                                            source={{uri:item.imageUrl}}
                                        />
                                    </View>
                                    <View style={{marginLeft:"3%"}}>
                                    <Text>{item.name}</Text>
                                    <Text>{item.authorName}</Text>
                                    <Text>{item.updated_at}</Text>
                                    </View>    
                                </View>
                                <View style={{flexDirection:"row",width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                                    <Button
                                    style={{marginRight:15,width:"48%",justifyContent:"center"}}>
                                        <Text>즐겨찾기 해제</Text>
                                    </Button>
                                    <Button
                                    onPress={()=>Actions.friendDetail({userId:item.authorId,friendCheck:"false"})}
                                    style={{width:"48%",justifyContent:"center"}}>
                                        <Text>상세보기</Text>
                                    </Button>
                                </View>
                            </View>
                        }
                    />
        }
        if(this.state.worldCheck == true  && this.state.getWorld != null)
        {
            return    <FlatList
                        style={styles.list}
                        data={this.state.getWorld}
                        // onRefresh={this.reset.bind(this)}
                        // refreshing={this.state.refreshing}
                        renderItem={({item}) => 
                            <View style={{borderWidth:1}}>
                                <View style={styles.worldInfo}>
                                    <View>
                                        <Image
                                            style={{width: "100%", height: 250, borderRadius:20}}
                                            source={{uri:item.imageUrl}}
                                        />
                                    </View>
                                    <Text>
                                        {item.name}
                                    </Text>
                                    <Text>
                                        {item.description}
                                    </Text>
                                    <Text>전체 {item.occupants+" 명"}</Text>
                                    <Text>{item.authorName}</Text>
                                    <Text>{item.updated_at}</Text>
                                </View>
                                <View style={{flexDirection:"row",width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                                    <Button
                                    style={{marginRight:15,width:"48%",justifyContent:"center"}}>
                                        <Text>즐겨찾1기 해제</Text>
                                    </Button>
                                    <Button
                                    onPress={()=>Actions.friendDetail({userId:item.authorId,friendCheck:"false"})}
                                    style={{width:"48%",justifyContent:"center"}}>
                                        <Text>상세보기</Text>
                                    </Button>
                                </View>
                            </View>
                        }
                    />
        }
        
    }
    render() {
        console.info("FavoriteSc => render");
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>즐겨찾기 관리</Text>
                </Header>
                <ScrollView style={{borderWidth:1}}>
                    <View style={{width:"95%",marginRight:"2%",alignItems:"flex-end"}}>
                        <View style={{flexDirection:"row",marginTop:"3%",marginBottom:"3%",}}>
                            <CheckBox
                            onValueChange={this.checkAChange.bind(this)}
                            value={this.state.avatarCheck}
                            />
                            <Text>아바타</Text>
                            <CheckBox
                            onValueChange={this.checkWChange.bind(this)}
                            value={this.state.worldCheck}
                            />
                            <Text>월드</Text>
                        </View>
                    </View>
                    {this.flist()}
                </ScrollView>
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
    list:{
        width:"97%",
        marginLeft:"1.5%"
    },
    worldInfo: {
        flex: 1,
        width:"90%",
        padding:10,
        borderWidth:1,
        marginLeft:"5%"
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