import React, { Component } from "react";
// common component
import {
    Button,
    Text,
} from "native-base";
import {
    Image,
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
import {VRChatAPIGet, VRChatImage, VRChatAPIPutBody, VRChatAPIPost, VRChatAPIPostBody, VRChatAPIDelete} from '../utils/ApiUtils';
import styles from '../css/css';
import {NetmarbleM,NetmarbleL,NetmarbleB,GodoR} from '../utils/CssUtils';

export default class UserDetail extends Component {
    constructor(props) {
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
        let isFavorite;

        // 검색유저 정보
        await fetch(`https://api.vrchat.cloud/api/1/users/${this.props.userId}`, VRChatAPIGet)
        .then((response) => response.json())
        .then((json) => {
            this.setState({
                getUserInfo:json
            });

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
    }

    componentDidMount() {
    }

    async isFavorite(id) {
        let offset=0;

        for(let i=0;i<2;i++){
            await fetch(`https://api.vrchat.cloud/api/1/favorites?type=world&n=100&offset=${offset}`, VRChatAPIGet)
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

    favorite(number, id) {
        let groupName = null;

        fetch(`https://api.vrchat.cloud/api/1/favorite/groups?type=world`, VRChatAPIGet)
        .then(res => res.json())
        .then(json => {
            groupName = json[number];
            
            if(groupName == null)
            {
                groupName = "worlds"+(number+1);
            }
            else
            {
                groupName = json[number].name;
            }
        });

        if(this.state.isFavorite == false)
        {
            this.setState({
                modalVisivle:true
            });

            Alert.alert(
                "안내",
                "Group "+(number+1)+"에 즐겨찾기 하시겠습니까?",
                [
                    {text:"확인", onPress: () => {
                        fetch(`https://api.vrchat.cloud/api/1/favorites`, VRChatAPIPostBody({
                            "type":"world",
                            "tags":[groupName],
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
                                            });
                                        }}
                                    ]
                                )
                            }
                            else
                            {
                                this.setState({
                                    modalVisivle:false,
                                    isFavorite:true,
                                    favoriteId:json.id
                                });
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

    friendRequest(id,type) {
        if(type == true)
        {
            Alert.alert(
                "안내",
                "친구삭제 하시겠습니까?",
                [
                    {text: "확인", onPress: () => {
                        fetch(`https://api.vrchat.cloud/api/1/auth/user/friends/${id}`, VRChatAPIDelete)
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
                        fetch(`https://api.vrchat.cloud/api/1/user/${id}/friendRequest`, VRChatAPIPost)
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
        fetch(`https://api.vrchat.cloud/api/1/auth/user/playermoderations`, VRChatAPIGet)
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
                        .then(() => {
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
        if(this.state.getUserWInfo != null)
        {
            this.state.indiInfo = this.state.getUserWInfo.instances.filter((v) => v.indexOf(this.state.getUserInfo.instanceId) != -1);
        }
        return (
            <View style={{flex:1}}>
                <View style={[styles.logo,{justifyContent:"center"}]}>
                    <Icon
                    onPress={()=>Actions.pop()}
                    name="chevron-left" size={25}
                    style={{color:"white",position:"absolute",left:15,top:10}}/>
                    <NetmarbleB style={{color:"white"}}>
                        {this.props.isFriend == true ? "친구정보" : this.props.isFriend == false ? "제작자정보" : "유저정보"}
                    </NetmarbleB>
                </View>
                {this.state.getUserInfo != null ? 
                    <ScrollView>
                        <View style={{flex:1}}>
                            <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:"5%",marginRight:"5%",marginTop:"3%"}}>
                                <GodoR style={{fontSize:25,color:"#5a82dc"}}>Information</GodoR>
                                {this.state.isBlocked == true ? 
                                <Icon 
                                onPress={this.block.bind(this)}
                                name={"block"} size={30} style={{textAlignVertical:"bottom",color:"#ef5261"}}/>
                                :
                                <Icon 
                                onPress={this.block.bind(this)}
                                name={"block"} size={30} style={{textAlignVertical:"bottom",color:"#888c8b"}}/>
                                }
                            </View>
                            <View style={{flexDirection:"row",margin:"5%"}}>
                                <View>
                                    <Image
                                        style={{width: 100, height: 100, borderRadius:20,borderColor:UserGrade(this.state.getUserInfo.tags), borderWidth:3}}
                                        source={VRChatImage(this.state.getUserInfo.currentAvatarThumbnailImageUrl)}
                                    />
                                </View>
                                <View style={{width:"100%",marginLeft:"3%"}}>
                                    <NetmarbleL style={styles.friendInfoText}>
                                        {this.state.getUserInfo.displayName}{"  "}
                                        {this.state.getUserInfo.location != "offline" && this.state.getUserInfo.location != "" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                                        {this.state.getUserInfo.statusDescription != "" && this.state.getUserInfo.statusDescription+"\n"}
                                        {this.state.getUserInfo.location == "private" ? "private" : this.state.getUserInfo.location != "private" && this.state.getUserInfo.location != "offline" && this.state.getUserInfo.location != "" ? "public" : this.state.getUserInfo.location == "offline" || this.state.getUserInfo.location == "" ? "offline" : null}
                                    </NetmarbleL>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:"row",width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                            <Button 
                                onPress={this.friendRequest.bind(this,this.state.getUserInfo.id,this.state.getUserInfo.isFriend)}
                                style={[{marginRight:15,width:"48%"},styles.requestButton]}
                            >
                                <NetmarbleL>{this.state.getUserInfo.isFriend == true ? "친구삭제" : "친구신청"}</NetmarbleL>
                            </Button>
                            <Button onPress={()=> Actions.currentScene == "userDetail" ? Actions.makeDetail({userId:this.props.userId}) : {}}
                                style={[{width:"48%"},styles.requestButton]}>
                                <NetmarbleL>제작정보</NetmarbleL>
                            </Button>
                        </View>
                        {this.state.getUserWInfo != null ?
                            <View style={{marginTop:"2%"}}>
                                <NetmarbleL style={{marginLeft:"5%",fontSize:20}}>현재 월드</NetmarbleL>
                                <View style={styles.worldInfoDetail}>
                                    <View style={{
                                        position:"absolute",
                                        top:"17%",
                                        right:"10%",
                                        zIndex:1
                                    }}>
                                        {this.state.isFavorite == true ? 
                                        <Icon 
                                        onPress={this.favorite.bind(this,-1,this.state.favoriteId)}
                                        name="star" size={30} style={{color:"#FFBB00"}}/>
                                        :
                                        <Icon 
                                        onPress={() => this.setState({modalVisivle:true})}
                                        name="star-outlined" size={30} style={{color:"#FFBB00"}}/>}
                                    </View>
                                    <NetmarbleM style={{textAlign:"center",fontFamily:"NetmarbleM",color:"#2b3956"}}>
                                        {this.state.getUserWInfo.name}
                                        {this.state.getUserInfo.instanceId.length <= 5 ? "#"+this.state.getUserInfo.instanceId : null}
                                    </NetmarbleM>
                                    <View style={{marginTop:"2%",marginBottom:"4%"}}>
                                        <Image
                                            style={{width: "100%", height: 200, borderRadius:20}}
                                            source={VRChatImage(this.state.getUserWInfo.thumbnailImageUrl)}
                                        />
                                    </View>
                                    <NetmarbleL style={{lineHeight:25}}>
                                        제작자 : {this.state.getUserWInfo.authorName}{"\n"}
                                        접속중인 월드 인원 : {this.state.indiInfo.length != 0 ? this.state.indiInfo[0][1]+"/"+this.state.getUserWInfo.capacity : 
                                        this.state.getUserWInfo.capacity+"/"+this.state.getUserWInfo.capacity}{"\n"}
                                        전체 : {this.state.getUserWInfo.occupants+" 명"}{"\n"}
                                        업데이트 날짜 : {this.state.getUserWInfo.updated_at.substring(0,10)}
                                        {this.state.getUserWInfo.description != "" && this.state.getUserWInfo.description != null &&
                                        "\n"+"\n"+this.state.getUserWInfo.description}
                                    </NetmarbleL>
                                </View>
                                <Modal
                                style={{flex:1,height:250}}
                                isVisible={this.state.modalVisivle}
                                onBackButtonPress={()=>this.setState({modalVisivle:false})}
                                onBackdropPress={()=>this.setState({modalVisivle:false})}>
                                    {this.state.modalVisivle == true ?
                                        <View style={{backgroundColor:"#fff"}}>
                                        <Button style={styles.groupButton} onPress={this.favorite.bind(this, 0, this.state.getUserWInfo.id)} ><NetmarbleL>Group 1</NetmarbleL></Button>
                                        <Button style={styles.groupButton} onPress={this.favorite.bind(this, 1, this.state.getUserWInfo.id)} ><NetmarbleL>Group 2</NetmarbleL></Button>
                                        <Button style={styles.groupButton} onPress={this.favorite.bind(this, 2, this.state.getUserWInfo.id)} ><NetmarbleL>Group 3</NetmarbleL></Button>
                                        <Button style={styles.groupButton} onPress={this.favorite.bind(this, 3, this.state.getUserWInfo.id)} ><NetmarbleL>Group 4</NetmarbleL></Button>
                                        <View style={{alignItems:"center"}}>
                                        <Button 
                                        onPress={()=>this.setState({modalVisivle:false})}
                                        style={[styles.requestButton,{width:"20%",height:40,margin:10,justifyContent:"center"}]}>
                                            <NetmarbleL>취소</NetmarbleL>
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