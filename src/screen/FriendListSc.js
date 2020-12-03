import React, { Component } from "react";
// common component
import {
    Text,
} from "native-base";
import {
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    View,
    TextInput,
    Alert,
    Picker,
    RefreshControl,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {UserGrade, UserGradeName} from './../utils/UserUtils';
import { Col, Row } from "react-native-easy-grid";
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils';
import styles from '../css/css';
import {NetmarbleL,NetmarbleM} from '../utils/CssUtils';

export default class FriendListSc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing:false,
            refreshTime:false,
            option:this.props.option,
            getFriend:[],
            getFilterFriend:[],
            getFriendAll:[],
            getFriendOn:[],
            getFriendOff:[],
            modalVisible:true,
            refreshButton:false,
            isSearch: false,
            onCount:0,
            offCount:0,
            allCount:0
        };
    }

    UNSAFE_componentWillMount() {
        this.getFriend();
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    async getFriendOn(offSet)
    {
        const responseOn = await fetch(`https://api.vrchat.cloud/api/1/auth/user/friends?offline=false&offset=${offSet}`, VRChatAPIGet);
        return new Promise((resolve, reject) =>
        resolve(responseOn.json()));
    }

    async getFriendOff(offSet)
    {
        const responseOff = await fetch(`https://api.vrchat.cloud/api/1/auth/user/friends?offline=true&offset=${offSet}`, VRChatAPIGet);
        return new Promise((resolve, reject) =>
        resolve(responseOff.json()));
    }

    getFriend()
    {
        let offSet = 0;
        let onCount  = 0;
        let offCount = 0;
        
        let promiseOn;
        let promiseOff;

        this.setState({
            getFriend:[],
            getFriendAll:[],
            getFriendOn:[],
            getFriendOff:[],
        })

        for(let i=0;i<10;i++)
        {
            promiseOn = Promise.all([this.getFriendOn(offSet)])
            .then((result) => {
                this.setState({
                    getFriendOn     : this.state.getFriendOn.concat(result[0]),
                    getFriend       : this.state.getFriend.concat(result[0]),
                    getFriendAll       : this.state.getFriendAll.concat(result[0]),
                    onCount         : onCount += result[0].length
                });
            });

            offSet+=100;
        }

        promiseOn.done(() => {
            offSet = 0;
            for(let i=0;i<10;i++)
            {
                promiseOff = Promise.all([this.getFriendOff(offSet)])
                .then((result) => {
                    this.setState({
                        getFriendOff    : this.state.getFriendOff.concat(result[0]),
                        getFriend       : this.state.getFriend.concat(result[0]),
                        getFriendAll       : this.state.getFriendAll.concat(result[0]),
                        offCount        : offCount += result[0].length
                    });
                });
                
                offSet+=100;
            }

            promiseOff.done(() => {
                this.setState({
                    modalVisible:false
                });
            })
        });
    }

    filter = value => {
        this.setState({
            option:value
        });
        if(value == "all")
        {
            this.setState({
                getFriend: this.state.getFriendAll
            });
        }
        else if(value == "on")
        {
            this.setState({
                getFriend: this.state.getFriendOn
            });
        }
        else if(value == "off")
        {
            this.setState({
                getFriend: this.state.getFriendOff
            });
        }
    }

    search=()=>{
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
            if(this.state.getFriend != null)
            {
                serachCheck = this.state.getFriendAll.filter((v) => v.displayName.indexOf(this.state.search) !== -1);
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
                this.setState({
                    isSearch:true,
                    getFilterFriend:serachCheck
                });
        
                this.flist();
            }
        }
    }

    flist(){

        if(this.state.getFilterFriend != null && this.state.isSearch == true)
        {
            return <FlatList
                data={this.state.getFilterFriend}
                onRefresh={this.reset.bind(this)}
                refreshing={this.state.refreshing}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "friendListSc" ? Actions.userDetail({userId:item.id, isFriend:true}) : {}}
                        style={[{backgroundColor:UserGrade(item.tags)},styles.friendList]}
                    >
                        <View style={styles.friendListView}>
                            <View style={{marginTop:-17}}>
                                <NetmarbleL style={{textAlign:"center",color:UserGrade(item.tags)}}>
                                    {UserGradeName(item.tags)}
                                </NetmarbleL>
                                <Image
                                    style={{width: 100, height: 100, borderRadius:10}}
                                    source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                                />
                            </View>
                            <NetmarbleL style={styles.friendInfoText}>
                                {item.displayName}{"  "}
                                {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                                {item.statusDescription != "" && item.statusDescription+"\n"}
                                {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}
                            </NetmarbleL>
                        </View>
                    </TouchableOpacity>
                }
            />
        }

        return <FlatList
            data={this.state.getFriend}
            renderItem={({item}) => 
                <TouchableOpacity
                    onPress={()=> Actions.currentScene == "friendListSc" ? Actions.userDetail({userId:item.id, isFriend:true}) : {}}
                    style={[{backgroundColor:UserGrade(item.tags)},styles.friendList]}
                >
                    <View style={styles.friendListView}>
                        <View style={{marginTop:-17}}>
                            <NetmarbleL style={{textAlign:"center",color:UserGrade(item.tags)}}>
                                {UserGradeName(item.tags)}
                            </NetmarbleL>
                            <Image
                                style={{width: 100, height: 100, borderRadius:10}}
                                source={VRChatImage(item.currentAvatarThumbnailImageUrl)}
                            />
                        </View>
                        <NetmarbleL style={styles.friendInfoText}>
                            {item.displayName}{"  "}
                            {item.location != "offline" ? <Icon style={{color:"green"}} name="controller-record"/> : <Icon style={{color:"#b22222"}} name="controller-record"/>}{"\n"}
                            {item.statusDescription != "" && item.statusDescription+"\n"}
                            {item.location == "private" ? "private" : item.location != "private" && item.location != "offline" ? "public" : item.location == "offline" ? "offline" : null}
                        </NetmarbleL>
                    </View>
                </TouchableOpacity>
            }
        />
    }
    
    reset(){
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalVisible = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.getFriend()])
            .then(() => {
                this.setState({
                    modalVisible : false
                });
            });

            this.setState({
                refreshing:false,
                isSearch:false,
                option:"all",
                search:null
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    resetButton(){
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.refreshButton = true;
            this.state.modalVisible = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.getFriend()])
            .then(() => {
                this.setState({
                    modalVisible: false
                });
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
            });

            this.setState({
                refreshing:false,
                isSearch:"1",
                option:"all",
                search:null
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    render() {
        this.state.allCount = this.state.onCount + this.state.offCount;

        return (
            <View style={{flex:1}}>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.reset.bind(this)}
                            refreshing={this.state.refreshing}
                        />
                    }
                >
                    <View style={styles.freindLogo}>
                        <Icon
                        onPress={()=>Actions.pop()}
                        name="chevron-left" size={25} style={{color:"white"}}/>
                        <NetmarbleM style={{color:"white"}}>친구목록</NetmarbleM>
                        {this.state.refreshButton == false ?
                        <Icon
                        onPress={this.resetButton.bind(this)}
                        name="cycle" size={20} style={{color:"white"}}
                        />
                        :
                        <ActivityIndicator size={20} color="white"/>
                        }
                    </View>
                    <View style={{justifyContent:"center",marginTop:-50,margin:"5%",padding:"2%",backgroundColor:"white",elevation:15,borderRadius:10}}>
                        <View style={{width:"100%",flexDirection:"row"}}>
                            <Row>
                                <Col>
                                    <NetmarbleL style={styles.friendsCount}>
                                        전체{"\n"}
                                        {this.state.allCount+"명"}
                                    </NetmarbleL>
                                </Col>
                                <Col style={{borderLeftWidth:1,borderRightWidth:1,borderColor:"#4d221e1f"}}>
                                    <NetmarbleL style={styles.friendsCount}>
                                        온라인{"\n"}
                                        {this.state.onCount+"명"}
                                    </NetmarbleL>
                                </Col>
                                <Col>
                                    <NetmarbleL style={styles.friendsCount}>
                                        오프라인{"\n"}
                                        {this.state.offCount+"명"}
                                    </NetmarbleL>
                                </Col>
                            </Row>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                        <View style={{borderBottomWidth:1,width:"90%",flexDirection:"row",justifyContent:"space-between"}}>
                            <TextInput 
                                value={this.state.search}
                                onChangeText={(text) => this.setState({search:text})}
                                onSubmitEditing={this.search}
                                placeholder={"이름 검색"}
                                style={{width:"80%",height:50,fontFamily:"NetmarbleL"}}/>
                            <Icon 
                                onPress={this.search}
                                name="magnifying-glass" size={25} style={{marginTop:15,color:"#3a4a6d"}}/>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"flex-end",marginRight:"5%",height:70}}>
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