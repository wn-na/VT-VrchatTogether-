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
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {UserGrade} from './../utils/UserUtils';

export default class FriendDetail extends Component {
    constructor(props) {
        console.info("FriendDetail => constructor");

        super(props);

        this.state = {
            indiInfo:[],
            getUserInfo:null,
            getUserWInfo:null,
            isBlocked:false,
            isFavorite:false,
            favoriteId:null,
            modalVisivle:false,
            modalLoading:true
        };
    }

    async UNSAFE_componentWillMount() {
        console.info("FriendDetail => componentWillMount");
        
        let isFavorite;

        // 검색유저 정보
        await fetch("https://api.vrchat.cloud/api/1/users/"+this.props.userId, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "User-Agent":"VT",
                "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        
        .then((json) => {
            this.setState({
                getUserInfo:json
            });

            fetch("https://api.vrchat.cloud/api/1/worlds/"+json.worldId, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "User-Agent":"VT",
                    "Content-Type": "application/json",
                }
            })
            .then((response) => response.json())
            
            .then((json) => {
                if(!json.error)
                {
                    this.setState({
                        getUserWInfo:json
                    });
                }

                this.isBlocked();
                

                isFavorite = Promise.all([this.isFavorite(json.id)]);

                isFavorite.done(() => {
                    this.setState({
                        modalLoading:false
                    })
                })
            });
        });
    }

    componentWillUnmount() {
        console.info("FriendDetail => componentWillUnmount");
    }

    componentDidMount() {
        console.info("FriendDetail => componentDidMount");
    }

    async isFavorite(id) {
        let offset=0;
        let isFavorite;

        for(let i=0;i<2;i++){
            isFavorite = await fetch("https://api.vrchat.cloud/api/1/favorites?type=world&n=100&offset="+offset,{
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "User-Agent":"VT",
                    "Content-Type": "application/json",
                }
            })
            .then(res => res.json())
            .then(json => {
                if(json.filter((v) => v.favoriteId.indexOf(id) !== -1).length > 0)
                {
                    this.setState({
                        isFavorite : true,
                        favoriteId : json.filter((v) => v.favoriteId.indexOf(id) !== -1)[0].id
                    });
                }
                offset+=100;
            })
        }

        return new Promise((resolve, reject) =>
        setTimeout(() =>{
            resolve(true);
        }, 5000) );
    }

    favorite(number,id) {
        console.info("FriendDetail => favoriteWorld")
        
        if(this.state.isFavorite == false)
        {
            this.setState({
                modalVisivle:true
            });

            Alert.alert(
                "안내",
                "Group "+number+"에 즐겨찾기 하시겠습니까?",
                [
                    {text:"확인", onPress: () => {
                        fetch("https://api.vrchat.cloud/api/1/favorites", {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "User-Agent":"VT",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                "type":"world",
                                "tags":["worlds"+number],
                                "favoriteId":id
                            })
                        })
                        .then((response) => response.json())
                        .then((json) => {
                            if(json.error)
                            {
                                Alert.alert(
                                    "오류",
                                    "이미 즐겨찾기 되었습니다.",
                                    [
                                        {text:"확인", onPress:()=>{
                                            this.setState({
                                                modalVisivle:false
                                            })
                                        }}
                                    ]
                                )
                            }
                            else
                            {
                                this.setState({
                                    modalVisivle:false,
                                    isFavorite:true,
                                })
                                ToastAndroid.show("등록이 완료되었습니다.", ToastAndroid.SHORT);
                            }
                        });
                    }},
                    {text:"취소"}
                ]
            );
        }
        else
        {
            fetch("https://api.vrchat.cloud/api/1/favorites/"+id, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "User-Agent":"VT",
                    "Content-Type": "application/json",
                }
            })
            Alert.alert(
                "안내",
                "즐겨찾기에서 삭제하시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        fetch("https://api.vrchat.cloud/api/1/favorites/"+id, {
                            method: "DELETE",
                            headers: {
                                "Accept": "application/json",
                                "User-Agent":"VT",
                                "Content-Type": "application/json",
                            }
                        })
                        .then((response) => response.json())
                        .then((json) => {
                            this.setState({
                                isFavorite:false
                            })
                            ToastAndroid.show("삭제가 완료되었습니다.", ToastAndroid.SHORT);
                        });
                    }},
                    {text: "취소"}
                ]
            );
        }
    }

    unfriend(id,type) {
        if(type == true)
        {
            Alert.alert(
                "안내",
                "친구삭제 하시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        fetch("https://api.vrchat.cloud/api/1/auth/user/friends/"+id, {
                            method: "DELETE",
                            headers: {
                                "Accept": "application/json",
                                "User-Agent":"VT",
                                "Content-Type": "application/json",
                            }
                        })
                        .then((response) => response.json())
                        .then((json) => {
                            if(json.success.status_code == "200")
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
                        fetch("https://api.vrchat.cloud/api/1/user/"+id+"/friendRequest", {
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "User-Agent":"VT",
                                "Content-Type": "application/json",
                            }
                        })
                        .then((response) => response.json())
                        .then((json) => {
                            ToastAndroid.show("신청이 완료되었습니다.", ToastAndroid.SHORT);
                        });
                    }},
                    {text: "취소"}
                ]
            );
        }
    }
    
    isBlocked() {
        fetch("https://api.vrchat.cloud/api/1/auth/user/playermoderated",{
            method: "GET",
            headers: {
                "Accept": "application/json",
                "User-Agent":"VT",
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(json => {
            json = json.filter((v) => v.type.indexOf("block") !== -1);
            if(json.filter((v) => v.sourceUserId.indexOf(this.props.userId) !== -1).length > 0)
            {
                this.setState({
                    isBlocked : true
                });
            }
        });
    }

    block() {
        if(this.state.isBlocked == false)
        {
            Alert.alert(
                "안내",
                "블락하시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        fetch("https://api.vrchat.cloud/api/1/auth/user/blocks",{
                            method: "POST",
                            headers: {
                                "Accept": "application/json",
                                "User-Agent":"VT",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                "blocked":this.props.userId
                            })
                        })
                        .then((response) => response.json())
                        .then((json) => {
                            ToastAndroid.show("처리가 완료되었습니다.", ToastAndroid.SHORT);
                            this.setState({
                                isBlocked:true
                            })
                        });
                    }},
                    {text: "취소"}
                ]
            );
        }
        else if(this.state.isBlocked == true)
        {
            Alert.alert(
                "안내",
                "블락을 해제하시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        fetch("https://api.vrchat.cloud/api/1/auth/user/unblocks",{
                            method: "PUT",
                            headers: {
                                "Accept": "application/json",
                                "User-Agent":"VT",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                "blocked":this.props.userId
                            })
                        })
                        .then((response) => response.json())
                        .then((json) => {
                            ToastAndroid.show("처리가 완료되었습니다.", ToastAndroid.SHORT);
                            this.setState({
                                isBlocked:false
                            })
                        });
                    }},
                    {text: "취소"}
                ]
            );
        }
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
                                <Image
                                    style={{width: 100, height: 100, borderRadius:20,borderColor:UserGrade(this.state.getUserInfo.tags), borderWidth:3}}
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
                            <Button onPress={this.block.bind(this)}
                                style={{width:"48%",justifyContent:"center"}}>
                                <Text>{this.state.isBlocked == true ? "블락해제" : "블락"}</Text>
                            </Button>
                        </View>
                        <View style={{width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                            <Button 
                            onPress={()=> Actions.currentScene == "friendDetail" ? Actions.makeDetail({userId:this.props.userId}) : {}}
                            style={{justifyContent:"center"}}>
                                <Text>제작정보</Text>
                            </Button>
                        </View>
                        {this.state.getUserWInfo != null ?
                            <View style={{marginTop:"2%"}}>
                                <Text style={{marginLeft:"5%",fontSize:25}}>현재 월드</Text>
                                <View style={styles.worldInfo}>
                                    <View style={{alignItems:"flex-end"}}>
                                    {this.state.isFavorite == true ? 
                                    <Icon 
                                    onPress={this.favorite.bind(this,0,this.state.favoriteId)}
                                    name="star" size={30} style={{color:"#FFBB00",marginBottom:5}}/>
                                    :
                                    <Icon 
                                    onPress={() => this.setState({modalVisivle:true})}
                                    name="star-outlined" size={30} style={{color:"#FFBB00",marginBottom:5}}/>}
                                    </View>
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
                                </View>
                                <Modal
                                style={styles.modal}
                                isVisible={this.state.modalVisivle}
                                onBackButtonPress={()=>this.setState({modalVisivle:false})}
                                onBackdropPress={()=>this.setState({modalVisivle:false})}>
                                    <View style={{backgroundColor:"#fff"}}>
                                        <Button style={styles.groupButton} onPress={this.favorite.bind(this,1,this.state.getUserWInfo.id)} ><Text style={{color:"#000"}}>Group 1</Text></Button>
                                        <Button style={styles.groupButton} onPress={this.favorite.bind(this,2,this.state.getUserWInfo.id)} ><Text style={{color:"#000"}}>Group 2</Text></Button>
                                        <Button style={styles.groupButton} onPress={this.favorite.bind(this,3,this.state.getUserWInfo.id)} ><Text style={{color:"#000"}}>Group 3</Text></Button>
                                        <Button style={styles.groupButton} onPress={this.favorite.bind(this,4,this.state.getUserWInfo.id)} ><Text style={{color:"#000"}}>Group 4</Text></Button>
                                        <View style={{alignItems:"center"}}>
                                        <Button 
                                        onPress={()=>this.setState({modalVisivle:false})}
                                        style={{width:"20%",height:40,margin:10,justifyContent:"center"}}>
                                            <Text>취소</Text>
                                        </Button>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                            :
                            null
                        }
                    </ScrollView>
                    :
                    null
                }
                <Modal
                isVisible={this.state.modalLoading}>
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
    worldInfo: {
        flex: 1,
        width:"90%",
        padding:10,
        borderWidth:1,
        marginLeft:"5%"
    },
    groupButton:{
        marginTop:10,
        margin:15,
        justifyContent:"center",
        backgroundColor:"#fff",
        color:"#000"
    },
    modal:{
        flex:1,
        height:250
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