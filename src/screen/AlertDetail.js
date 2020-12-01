import React, { Component } from "react";
// common component
import {
    Header,
    Button,
    Text,
} from "native-base";
import {
    Image,
    StyleSheet,
    ScrollView,
    View,
    Alert,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {UserGrade} from '../utils/UserUtils';
import {VRChatAPIGet, VRChatImage, VRChatAPIPutBody, VRChatAPIPostBody, VRChatAPIDelete, VRChatAPIPut} from '../utils/ApiUtils';

export default class AlertDetail extends Component {
    constructor(props) {
        console.info("AlertDetail => constructor");

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
        console.info("AlertDetail => componentWillMount");
        
        let isFavorite;

        // 검색유저 정보
        await fetch(`https://api.vrchat.cloud/api/1/users/${this.props.userId}`, VRChatAPIGet)
        .then((response) => response.json())
        
        .then((json) => {
            this.setState({
                getUserInfo:json
            });
            
            if(json.isFriend == true)
            {
                Actions.replace("friendDetail",{id:json.id});
            }

            fetch(`https://api.vrchat.cloud/api/1/worlds/${json.worldId}`, VRChatAPIGet)
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
        console.info("AlertDetail => componentWillUnmount");
    }

    componentDidMount() {
        console.info("AlertDetail => componentDidMount");
    }

    async isFavorite(id) {
        let offset=0;
        let isFavorite;

        for(let i=0;i<2;i++){
            isFavorite = await fetch(`https://api.vrchat.cloud/api/1/favorites?type=world&n=100&offset=${offset}`, VRChatAPIGet)
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
        resolve(true));
    }

    favorite(number,id) {
        console.info("AlertDetail => favoriteWorld")
        
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
                        fetch(`https://api.vrchat.cloud/api/1/favorites`, VRChatAPIPostBody({
                            "type":"world",
                            "tags":["worlds"+number],
                            "favoriteId":id
                        }))
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
            fetch(`https://api.vrchat.cloud/api/1/favorites/${id}`, VRChatAPIDelete)
            Alert.alert(
                "안내",
                "즐겨찾기에서 삭제하시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        fetch(`https://api.vrchat.cloud/api/1/favorites/${id}`, VRChatAPIDelete)
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

    friendRequest(type) {
        if(type == true)
        {
            Alert.alert(
                "안내",
                "친구신청을 수락하시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications/${this.props.notiId}/accept`, VRChatAPIPut)
                        .then((response) => response.json())
                        .then((json) => {
                            console.log(json);
                            if(json.success.status_code == "200")
                            {
                                Actions.replace("friendDetail",{userId:this.props.userId})
                                ToastAndroid.show("수락이 완료되었습니다.", ToastAndroid.SHORT);
                            }
                            else
                            {
                                ToastAndroid.show("수락에 실패하였습니다.", ToastAndroid.SHORT);
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
                "친구신청을 거절하시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications/${this.props.notiId}/accept`, VRChatAPIDelete)
                        .then((response) => response.json())
                        .then((json) => {
                            ToastAndroid.show("거절이 완료되었습니다.", ToastAndroid.SHORT);
                        });
                    }},
                    {text: "취소"}
                ]
            );
        }
    }
    
    async isBlocked() {
        await fetch(`https://api.vrchat.cloud/api/1/auth/user/playermoderations`, VRChatAPIGet)
        .then(response => response.json())
        .then(json => {
            json = json.filter((v) => v.type.indexOf("block") !== -1);
            
            if(json.filter((v) => v.targetUserId.indexOf(this.props.userId) !== -1).length > 0)
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
                        fetch(`https://api.vrchat.cloud/api/1/auth/user/blocks`, VRChatAPIPostBody({
                            "blocked":this.props.userId
                        }))
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
                        fetch(`https://api.vrchat.cloud/api/1/auth/user/unblocks`, VRChatAPIPutBody({
                            "blocked":this.props.userId
                        }))
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
        console.info("AlertDetail => render");
        if(this.state.getUserWInfo != null)
        {
            this.state.indiInfo = this.state.getUserWInfo.instances.filter((v) => v.indexOf(this.state.getUserInfo.instanceId) != -1);
        }
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>유저상세보기</Text>
                </Header>
                {this.state.getUserInfo != null ? 
                    <ScrollView>
                        <View style={{flex:1,flexDirection:"row",padding:"5%"}}>
                            <View>
                                <Image
                                    style={{width: 100, height: 100, borderRadius:20,borderColor:UserGrade(this.state.getUserInfo.tags), borderWidth:3}}
                                    source={VRChatImage(this.state.getUserInfo.currentAvatarThumbnailImageUrl)}
                                />
                            </View>
                            <View style={{width:"100%",marginLeft:"3%"}}>
                                <Text>
                                    {this.state.getUserInfo.displayName}{"  "}
                                    {this.state.getUserInfo.location != "offline" && this.state.getUserInfo.location != "" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}
                                </Text>
                                {this.state.getUserInfo.statusDescription != "" && this.state.getUserInfo.statusDescription != null ?
                                    <Text style={{width:"70%",marginTop:"3%"}}>
                                        {this.state.getUserInfo.statusDescription != "" ? this.state.getUserInfo.statusDescription : ""}
                                    </Text>
                                    :
                                    null
                                }
                                <Text style={{marginTop:"3%"}}>
                                    {this.state.getUserInfo.location == "private" ? "private" : this.state.getUserInfo.location != "private" && this.state.getUserInfo.location != "offline" && this.state.getUserInfo.location != "" ? "public" : this.state.getUserInfo.location == "offline" || this.state.getUserInfo.location == "" ? "offline" : null}{"\n"}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:"row",width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                            <Button 
                                onPress={this.friendRequest.bind(this,true)}
                                style={{marginRight:15,width:"48%",justifyContent:"center"}}
                            >
                                <Text>수락</Text>
                            </Button>
                            <Button 
                                onPress={this.friendRequest.bind(this,false)}
                                style={{marginRight:15,width:"48%",justifyContent:"center"}}
                            >
                                <Text>거절</Text>
                            </Button>
                        </View>
                        <View style={{width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                            <Button onPress={this.block.bind(this)}
                                style={{justifyContent:"center"}}>
                                <Text>{this.state.isBlocked == true ? "블락해제" : "블락"}</Text>
                            </Button>
                        </View>
                        <View style={{width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                            <Button 
                            onPress={()=> Actions.currentScene == "AlertDetail" ? Actions.makeDetail({userId:this.props.userId}) : {}}
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
                                            source={VRChatImage(this.state.getUserWInfo.imageUrl)}
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
                                    {this.state.modalVisivle == true ?
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
                                    :
                                    null}
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