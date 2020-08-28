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
    Picker
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';
import { List, ListItem } from "react-native-elements";

export default class FriendListSc extends Component {
    constructor(props) {
        console.info("FriendListSc => constructor");

        super(props);

        this.state = {
            refreshing:false,
            option:"all",
            getFirend:null,
            getFilterFirend:[],
            getFirendOff:[],
            getFirendOff_1:[],
            getFirendOff_2:[],
            getFirendOff_3:[],
            getFirendActive:[],
            getFirendActive_1:[],
            getFirendActive_2:[],
            getFirendActive_3:[],
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
    getFirend()
    {
        console.log("FriendListSc => getFirend");
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
        });
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
        });
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
        });
    }
    filter=value=>
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
                [{text: "확인", onPress: () => console.log('press login')}]
            );
        }
        else
        {
            if(this.state.getFirend != null)
            {
                if(this.state.option == "on")
                {
                    serachCheck = this.state.getFirendActive.filter((v) => v.displayName.indexOf(this.state.search) !== -1)
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
                    [{text: "확인", onPress: () => console.log('press login')}]
                );
            }
            else
            {
                this.state.getFilterFirend = serachCheck;
                this.setState({
                    searchMode:"0"
                });
        
                this.flist();
                this.forceUpdate();
            }
        }
    }
    reset(){
        
        this.getFirend();

        this.state.getFirendActive = this.state.getFirendActive_1.concat(this.state.getFirendActive_2,this.state.getFirendActive_3);
        
        this.state.getFirendOff = this.state.getFirendOff_1.concat(this.state.getFirendOff_2,this.state.getFirendOff_3);
        
        {
            this.state.getFirendActive != null ?
            this.state.getFirend = this.state.getFirendActive.concat(this.state.getFirendOff)
            :null
        }

        this.setState({
            refreshing:false,
            searchMode:"1",
            option:"all",
            search:null
        });
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
                    onPress={()=>Actions.friendDetail({userId:item.id})}
                    style={{flexDirection:"row",padding:"5%",borderWidth:1}}>
                        <View>
                            <Text style={{textAlign:"center"}}>(등급)</Text>
                            <Image
                                style={{width: 100, height: 100, borderRadius:20}}
                                source={{uri:item.currentAvatarThumbnailImageUrl}}
                            />
                        </View>
                        <Text style={{marginLeft:"3%"}}>
                            {item.displayName}{"  "}
                            {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                            {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}{"\n"}
                        </Text>
                    </TouchableOpacity>
                }
            />
        }

        if(this.state.option == "all")
        {
            return <FlatList
                style={styles.list}
                data={this.state.getFirend}
                onRefresh={this.reset.bind(this)}
                refreshing={this.state.refreshing}
                renderItem={({item}) => 
                    <TouchableOpacity
                    onPress={()=>Actions.friendDetail({userId:item.id})}
                    style={{flexDirection:"row",padding:"5%",borderWidth:1}}>
                        <View>
                            <Text style={{textAlign:"center"}}>(등급)</Text>
                            <Image
                                style={{width: 100, height: 100, borderRadius:20}}
                                source={{uri:item.currentAvatarThumbnailImageUrl}}
                            />
                        </View>
                        <Text style={{marginLeft:"3%"}}>
                            {item.displayName}{"  "}
                            {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                            {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}{"\n"}
                        </Text>
                    </TouchableOpacity>
                }
            />
        }
        else if(this.state.option == "on")
        {
            return <FlatList
                style={styles.list}
                data={this.state.getFirendActive}
                onRefresh={this.reset.bind(this)}
                refreshing={this.state.refreshing}
                renderItem={({item}) => 
                    <TouchableOpacity
                    onPress={()=>Actions.friendDetail({userId:item.id})}
                    style={{flexDirection:"row",padding:"5%",borderWidth:1}}>
                        <View>
                            <Text style={{textAlign:"center"}}>(등급)</Text>
                            <Image
                                style={{width: 100, height: 100, borderRadius:20}}
                                source={{uri:item.currentAvatarThumbnailImageUrl}}
                            />
                        </View>
                        <Text style={{marginLeft:"3%"}}>
                            {item.displayName}{"  "}
                            {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                            {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}{"\n"}
                        </Text>
                    </TouchableOpacity>
                }
            />
        }
        else if(this.state.option == "off")
        {
            return <FlatList
                style={styles.list}
                data={this.state.getFirendOff}
                onRefresh={this.reset.bind(this)}
                refreshing={this.state.refreshing}
                renderItem={({item}) => 
                    <TouchableOpacity
                    onPress={()=>Actions.friendDetail({userId:item.id})}
                    style={{flexDirection:"row",padding:"5%",borderWidth:1}}>
                        <View>
                            <Text style={{textAlign:"center"}}>(등급)</Text>
                            <Image
                                style={{width: 100, height: 100, borderRadius:20}}
                                source={{uri:item.currentAvatarThumbnailImageUrl}}
                            />
                        </View>
                        <Text style={{marginLeft:"3%"}}>
                            {item.displayName}{"  "}
                            {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                            {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}{"\n"}
                        </Text>
                    </TouchableOpacity>
                }
            />
        }
    }
    render() {
        // {
        //     this.state.getFirendActive_1 != null ? 
        //     this.state.getFirendActive.concat(this.state.getFirendActive_1,this.state.getFirendActive_2,this.state.getFirendActive_3)
        //     : null
        // }
        // {
        //     this.state.getFirendOff_1 != null ?
        //     this.state.getFirendOff.concat(this.state.getFirendOff_1,this.state.getFirendOff_1,this.state.getFirendOff_1)
        //     : null
        // }
        this.state.getFirendActive = this.state.getFirendActive_1.concat(this.state.getFirendActive_2,this.state.getFirendActive_3);
        
        this.state.getFirendOff = this.state.getFirendOff_1.concat(this.state.getFirendOff_2,this.state.getFirendOff_3);
        
        {
            this.state.getFirendActive != null ?
            this.state.getFirend = this.state.getFirendActive.concat(this.state.getFirendOff)
            :null
        }
        
        console.info("FriendListSc => render");
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>친구목록</Text>
                </Header>
                <ScrollView style={{borderWidth:1}}>
                    <View style={styles.textView}>
                        <TextInput 
                        value={this.state.search}
                        onChangeText={(text)=>this.setState({search:text})}
                        onSubmitEditing={this.search}
                        style={{width:"85%"}}/>
                        <Icon 
                        onPress={this.search}
                        name="magnifying-glass" size={30} style={{marginTop:5}}/>
                    </View>
                    <View style={{alignItems:"flex-end",marginRight:"2%"}}>
                        <View style={styles.selectView}>
                            <Picker 
                                // style={{width:50,height:50,borderWidth:200}}
                                selectedValue = {this.state.option}
                                // onValueChange= {(value)=> this.setState({option:value})}
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