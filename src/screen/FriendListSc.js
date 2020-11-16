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
    RefreshControl,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {UserGrade} from './../utils/UserUtils';
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils'

export default class FriendListSc extends Component {
    constructor(props) {
        console.info("FriendListSc => constructor");

        super(props);

        this.state = {
            refreshing:false,
            refreshTime:false,
            option:"all",
            getFirend:[],
            getFilterFirend:[],
            getFirendOn:[],
            getFirendOff:[],
            modalVisible:true
        };
    }

    UNSAFE_componentWillMount() {
        console.info("FriendListSc => componentWillMount");
        this.getFirend();
    }

    componentWillUnmount() {
        console.info("FriendListSc => componentWillUnmount");
    }

    componentDidMount() {
        console.info("FriendListSc => componentDidMount");
    }

    async getFirendOn(offSet)
    {
        const responseOn = await fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=false&offset="+offSet, VRChatAPIGet);
        return new Promise((resolve, reject) =>
        setTimeout(() =>{
            resolve(responseOn.json());
        }, 100) );
    }

    async getFirendOff(offSet)
    {
        const responseOff = await fetch("https://api.vrchat.cloud/api/1/auth/user/friends?offline=true&offset="+offSet, VRChatAPIGet);
        return new Promise((resolve, reject) =>
        setTimeout(() =>{
            resolve(responseOff.json());
        }, 100) );
    }

    getFirend()
    {
        let offSet = 0;
        let promiseOn;
        let promiseOff;

        this.setState({
            getFirend:[],
            getFirendOn:[],
            getFirendOff:[],
        })

        for(let i=0;i<10;i++)
        {
            promiseOn = Promise.all([this.getFirendOn(offSet)])
            .then((result) => {
                this.setState({
                    getFirendOn     : this.state.getFirendOn.concat(result[0]),
                    getFirend       : this.state.getFirend.concat(result[0])
                });
            });

            offSet+=100;
        }

        promiseOn.done(() => {
            offSet = 0;
            for(let i=0;i<10;i++)
            {
                promiseOff = Promise.all([this.getFirendOff(offSet)])
                .then((result) => {
                    this.setState({
                        getFirendOff    : this.state.getFirendOff.concat(result[0]),
                        getFirend       : this.state.getFirend.concat(result[0])
                    });
                });
                
                offSet+=100;
            }

            promiseOff.done(() => {
                this.setState({
                    modalVisible:false
                })
            })
        });
    }

    filter = value =>
    {
        console.log("FriendListSc => filter");
        this.setState({
            option:value
        });
    }

    search=()=>{
        console.log("FriendListSc => search");
        let serachCheck;

        if(this.state.search == null || this.state.search == "")
        {
            Alert.alert(
                '오류',
                '검색어를 입력해주세요.',
                [{text: "확인"}]
            );
        }
        else
        {
            if(this.state.getFirend != null)
            {
                if(this.state.option == "on")
                {
                    serachCheck = this.state.getFirendOn.filter((v) => v.displayName.indexOf(this.state.search) !== -1)
                }
                if(this.state.option == "off")
                {
                    serachCheck = this.state.getFirendOff.filter((v) => v.displayName.indexOf(this.state.search) !== -1)
                }
                if(this.state.option == "all")
                {
                    serachCheck = this.state.getFirend.filter((v) => v.displayName.indexOf(this.state.search) !== -1)
                }
            }
            if(serachCheck.length == 0)
            {
                Alert.alert(
                    '오류',
                    '검색결과가 존재하지 않습니다.',
                    [{text: "확인"}]
                );
            }
            else
            {
                this.state.getFilterFirend = serachCheck;
                this.setState({
                    searchMode:"0"
                });
        
                this.flist();
            }
        }
    }
    reset(){
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            this.getFirend();

            this.setState({
                refreshing:false,
                searchMode:"1",
                option:"all",
                search:null
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    flist(){

        if(this.state.getFilterFirend != null && this.state.searchMode == "0")
        {
            return <FlatList
                style={styles.list}
                data={this.state.getFilterFirend}
                onRefresh={this.reset.bind(this)}
                refreshing={this.state.refreshing}
                renderItem={({item}) => 
                    <TouchableOpacity 
                        onPress={()=> Actions.currentScene == "friendListSc" ? Actions.friendDetail({userId:item.id}) : {}}
                        style={{flexDirection:"row",padding:"5%",borderWidth:1}}
                    >
                        <View>
                            <Image
                                style={{width: 100, height: 100, borderRadius:20, borderColor:UserGrade(item.tags), borderWidth:3}}
                                source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                            />
                        </View>
                        <View style={{width:"100%",marginLeft:"3%"}}>
                            <Text>
                                {item.displayName}{"  "}
                                {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}
                            </Text>
                            {item.statusDescription != "" ?
                                <Text style={{width:"70%",marginTop:"3%"}}>
                                    {item.statusDescription != "" ? item.statusDescription : ""}
                                </Text>
                                :
                                null
                            }
                            <Text style={{marginTop:"3%"}}>
                                {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}{"\n"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        }

        if(this.state.option == "all")
        {
            return <FlatList
                style={styles.list}
                data={this.state.getFirend}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "friendListSc" ? Actions.friendDetail({userId:item.id}) : {}}
                        style={{flexDirection:"row",padding:"5%",borderWidth:1}}
                    >
                        <View>
                            <Image
                                style={{width: 100, height: 100, borderRadius:20, borderColor:UserGrade(item.tags), borderWidth:3}}
                                source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                            />
                        </View>
                        <View style={{width:"100%",marginLeft:"3%"}}>
                            <Text>
                                {item.displayName}{"  "}
                                {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}
                            </Text>
                            {item.statusDescription != "" ?
                                <Text style={{width:"70%",marginTop:"3%"}}>
                                    {item.statusDescription != "" ? item.statusDescription : ""}
                                </Text>
                                :
                                null
                            }
                            <Text style={{marginTop:"3%"}}>
                                {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}{"\n"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        }
        else if(this.state.option == "on")
        {
            return <FlatList
                style={styles.list}
                data={this.state.getFirendOn}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "friendListSc" ? Actions.friendDetail({userId:item.id}) : {}}
                        style={{flexDirection:"row",padding:"5%",borderWidth:1}}
                    >
                        <View>
                            <Image
                                style={{width: 100, height: 100, borderRadius:20, borderColor:UserGrade(item.tags), borderWidth:3}}
                                source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                            />
                        </View>
                        <View style={{width:"100%",marginLeft:"3%"}}>
                            <Text>
                                {item.displayName}{"  "}
                                {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}
                            </Text>
                            {item.statusDescription != "" ?
                                <Text style={{width:"70%",marginTop:"3%"}}>
                                    {item.statusDescription != "" ? item.statusDescription : ""}
                                </Text>
                                :
                                null
                            }
                            <Text style={{marginTop:"3%"}}>
                                {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}{"\n"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        }
        else if(this.state.option == "off")
        {
            return <FlatList
                style={styles.list}
                data={this.state.getFirendOff}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "friendListSc" ? Actions.friendDetail({userId:item.id}) : {}}
                        style={{flexDirection:"row",padding:"5%",borderWidth:1}}
                    >
                        <View>
                            <Image
                                style={{width: 100, height: 100, borderRadius:20, borderColor:UserGrade(item.tags), borderWidth:3}}
                                source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                            />
                        </View>
                        <View style={{width:"100%",marginLeft:"3%"}}>
                            <Text>
                                {item.displayName}{"  "}
                                {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}
                            </Text>
                            {item.statusDescription != "" ?
                                <Text style={{width:"70%",marginTop:"3%"}}>
                                    {item.statusDescription != "" ? item.statusDescription : ""}
                                </Text>
                                :
                                null
                            }
                            <Text style={{marginTop:"3%"}}>
                                {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}{"\n"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        }
    }
    render() {
        
        console.info("FriendListSc => render");
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>친구목록</Text>
                </Header>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.reset.bind(this)}
                            refreshing={this.state.refreshing}
                        />
                    }
                >
                    <View style={styles.textView}>
                        <TextInput 
                            value={this.state.search}
                            onChangeText={(text)=>this.setState({search:text})}
                            onSubmitEditing={this.search}
                            style={{width:"85%"}}
                        />
                        <Icon 
                        onPress={this.search}
                        name="magnifying-glass" size={30} style={{marginTop:5}}/>
                    </View>
                    <View style={{alignItems:"flex-end",marginRight:"2%"}}>
                        <View style={styles.selectView}>
                            <Picker 
                                selectedValue = {this.state.option}
                                onValueChange= {this.filter}
                            >
                                <Picker.Item label = "모두보기" value = "all" />
                                <Picker.Item label = "온라인" value = "on" />
                                <Picker.Item label = "오프라인" value = "off" />
                            </Picker>
                        </View>
                    </View>
                    {this.flist()}
                </ScrollView>
                <Modal
                isVisible={this.state.modalVisible}>
                    <ActivityIndicator size={100}/>
                </Modal>
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
    info: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:"red",
        borderWidth:2
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