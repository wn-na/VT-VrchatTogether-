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
import {
    UserGrade,
    UserGradeName,
    getFriends,
    friends,
    friendOn,
    friendOff,
} from './../utils/UserUtils';
import { Col, Row } from "react-native-easy-grid";
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils';
import styles from '../css/css';
import {NetmarbleL,NetmarbleM} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';
import AsyncStorage from "@react-native-community/async-storage";

export default class FriendListSc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing:false,
            refreshTime:false,
            option:this.props.option,
            modalVisible:false,
            refreshButton:false,
            fake_image: "none",
            high_image: "none",
            friends: [],
            update: false,
            search: null,
            updateFunction: () => this.setState({update:!this.state.update}),
        };
    }

    async UNSAFE_componentWillMount() {
        AsyncStorage.getItem("user_high_image",(err,value)=>{
            this.setState({
                high_image: value
            });
        });
        AsyncStorage.getItem("user_fake_image",(err,value)=>{
            this.setState({
                fake_image: value
            });
        });
        await getFriends(this.state);
        this.setState({
            friends: friends
        });
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    filter = value => {
        this.setState({
            option:value
        });
        if(value == "all")
        {
            this.setState({
                friends: friends
            });
        }
        else if(value == "on")
        {
            this.setState({
                friends: friendOn
            });
        }
        else if(value == "off")
        {
            this.setState({
                friends: friendOff
            });
        }
    }

    search = () => {
        let serachCheck;

        if(this.state.search == null)
        {
            Alert.alert(
                translate('error'),
                translate('msg_search_key_not_found'),
                [{text: translate('ok')}]
            );
        }
        else
        {
            if(this.state.friends != null)
            {
                serachCheck = friends.filter((v) => v.displayName.indexOf(this.state.search) !== -1);
            }

            if(serachCheck.length == 0)
            {
                Alert.alert(
                    translate('error'),
                    translate('msg_no_search_results'),
                    [{text: translate('ok')}]
                );
            }
            else
            {
                this.setState({
                    friends:serachCheck,
                    option: "all",
                });
        
                this.flist();
            }
        }
    }

    flist() {
        return <FlatList
            data={this.state.friends}
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
                            source={
                                this.state.high_image == "check"
                                ?
                                VRChatImage(item.currentAvatarImageUrl)
                                :
                                this.state.fake_image == "check"
                                ?
                                require("../css/imgs/data_safe.png")
                                :
                                VRChatImage(item.currentAvatarThumbnailImageUrl)
                            }/>
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
    
    reset() {
        if(this.state.refreshTime == false)
        {
            this.setState({
                refreshTime: true,
                modalVisible: true
            });

            setTimeout(() => {
                this.setState({
                    refreshTime: false
                });
            }, 5000);

            Promise.all([getFriends(this.state)])
            .then(() => {
                this.setState({
                    friends : friends,
                    modalVisible : false
                });
            });

            this.setState({
                refreshing:false,
                option:"all",
                search:null
            });
        }
        else
        {
            ToastAndroid.show(translate('msg_refresh_time'), ToastAndroid.SHORT);
        }
    }

    resetButton() {
        if(this.state.refreshTime == false)
        {
            this.setState({
                refreshTime: true,
                refreshButton: true,
                modalVisible: true
            });
            setTimeout(() => {
                this.setState({
                    refreshTime: false
                });
            }, 5000);

            Promise.all([getFriends(this.state)])
            .then(() => {
                this.setState({
                    modalVisible: false,
                    friends : friends,
                });
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
            });

            this.setState({
                refreshing:false,
                option:"all",
                search:null
            });
        }
        else
        {
            ToastAndroid.show(translate('msg_refresh_time'), ToastAndroid.SHORT);
        }
    }

    render() {
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
                        <NetmarbleM style={{color:"white"}}>{translate('friend_list')}</NetmarbleM>
                        {this.state.refreshButton == false ?
                        <Icon
                        onPress={this.resetButton.bind(this)}
                        name="cycle" size={20} style={{color:"white"}}
                        />
                        :
                        <ActivityIndicator size={20} color="white" style={{width:20,height:20}}/>
                        }
                    </View>
                    <View style={{justifyContent:"center",marginTop:-50,margin:"5%",padding:"2%",backgroundColor:"white",elevation:15,borderRadius:10}}>
                        <View style={{width:"100%",flexDirection:"row"}}>
                            <Row>
                                <Col>
                                    <NetmarbleL style={styles.friendsCount}>
                                        {translate('all_user')}{"\n"}
                                        {this.props.allCount+translate('people_count')}
                                    </NetmarbleL>
                                </Col>
                                <Col style={{borderLeftWidth:1,borderRightWidth:1,borderColor:"#4d221e1f"}}>
                                    <NetmarbleL style={styles.friendsCount}>
                                        {translate('online')}{"\n"}
                                        {this.props.onCount+translate('people_count')}
                                    </NetmarbleL>
                                </Col>
                                <Col>
                                    <NetmarbleL style={styles.friendsCount}>
                                        {translate('offline')}{"\n"}
                                        {this.props.offCount+translate('people_count')}
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
                                placeholder={translate('name_search')}
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
                                <Picker.Item label = {translate('show_all')} value = "all" />
                                <Picker.Item label = {translate('online')} value = "on" />
                                <Picker.Item label = {translate('offline')} value = "off" />
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