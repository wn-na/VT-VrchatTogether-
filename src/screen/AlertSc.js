import React, { Component } from "react";
// common component
import {
    Text,
    Button
} from "native-base";
import {
    FlatList,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    View,
    TextInput,
    ToastAndroid,
    ActivityIndicator,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {VRChatAPIGet,VRChatAPIDelete,VRChatAPIPut} from '../utils/ApiUtils';
import styles from '../css/css';
import {NetmarbleL,NetmarbleM} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';

export default class AlertSc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getAlerts:[],
            refreshing:false,
            refreshTime:false,
            refreshButton:false,
            modalVisible:true
        };
    }

    UNSAFE_componentWillMount() {
        this.getAlerts();
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    async getAlerts() {
        await fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications`, VRChatAPIGet)
        .then(responses => responses.json())
        .then(json => {
            this.setState({
                getAlerts:json.filter((v) => v.type.indexOf("friendRequest") !== -1),
                modalVisible:false
            });
        });
    }

    friendRequest(notiId,type) {
        if(type == true)
        {
            Alert.alert(
                translate('information'),
                translate('msg_friendrequest'),
                [
                    {text: translate('ok'), onPress: () => {
                        fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications/${notiId}/accept`, VRChatAPIPut)
                        .then((response) => response.json())
                        .then((json) => {
                            if(json.success.status_code == "200")
                            {
                                this.setState({
                                    getAlerts: this.state.getAlerts.filter(v => v.id !== notiId)
                                });

                                ToastAndroid.show(translate('msg_success_friend_request'), ToastAndroid.SHORT);
                            }
                            else
                            {
                                ToastAndroid.show(translate('msg_fail_friend_request'), ToastAndroid.SHORT);
                            }
                        });
                    }},
                    {text: translate('cancel')}
                ]
            );
        }
        else
        {
            Alert.alert(
                translate('information'),
                translate('msg_friendrequest_deny'),
                [
                    {text: translate('ok'), onPress: () => {
                        fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications/${notiId}/accept`, VRChatAPIDelete)
                        .then((response) => response.json())
                        .then(() => {
                            this.setState({
                                getAlerts: this.state.getAlerts.filter(v => v.id !== notiId)
                            });
                            ToastAndroid.show(translate('msg_deny_friend_request'), ToastAndroid.SHORT);
                        });
                    }},
                    {text: translate('cancel')}
                ]
            );
        }
    }

    search = () => {
        let serachCheck;

        if(this.state.search == null || this.state.search == "")
        {
            Alert.alert(
                translate('error'),
                translate('msg_search_key_not_found'),
                [{text: translate('ok')}]
            );
        }
        else
        {
            if(this.state.getAlerts != null)
            {
                serachCheck = this.state.getAlerts.filter((v) => v.senderUsername.indexOf(this.state.search) !== -1) 
                this.setState({
                    getAlerts:serachCheck
                })
            }

            if(serachCheck.length == 0)
            {
                Alert.alert(
                    translate('error'),
                    translate('msg_no_search_results'),
                    [{text: translate('ok')}]
                );
            }
        }
    }

    reset() {
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalVisible = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.getAlerts()])
            .then(() => {
                this.setState({
                    modalVisible : false
                });
            });

            this.setState({
                refreshing:false,
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
            this.state.refreshTime = true;
            this.state.refreshButton = true;
            this.state.modalVisible = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.getAlerts()])
            .then(() => {
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
                this.setState({
                    modalVisible: false
                });
            });

            this.setState({
                refreshing:false,
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
                <View style={styles.logo}>
                    <Icon
					onPress={()=>Actions.pop()}
					name="chevron-left" size={25} style={{color:"white"}}/>
                    <NetmarbleM style={{color:"white"}}>{translate('notice')}</NetmarbleM>
                    {this.state.refreshButton == false ?
                    <Icon
                    onPress={this.resetButton.bind(this)}
                    name="cycle" size={20} style={{color:"white"}}
                    />
                    :
                    <ActivityIndicator size={20} color="white"/>
                    }
                </View>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.reset.bind(this)}
                            refreshing={this.state.refreshing}
                        />
                    }
                >
                    <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:"5%",marginRight:"5%"}}>
						<View style={{borderBottomWidth:1,width:"100%",flexDirection:"row",justifyContent:"space-between",marginTop:"5%",marginBottom:"5%"}}>
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
                    <FlatList
                        data={this.state.getAlerts}
                        renderItem={({item}) => 
                            <TouchableOpacity
                                onPress={()=> Actions.currentScene == "alertSc" ? Actions.userDetail({userId:item.senderUserId, notiId:item.id, option:"against"}) : {}}
                                style={{padding:"5%",borderWidth:1,borderRadius:10,borderColor:"#4d221e1f",marginLeft:"5%",marginRight:"5%",marginTop:"3%",marginBottom:"3%"}}
                            >
                                <View style={{flexDirection:"row",width:"100%"}}>
                                    <NetmarbleL style={{width:"60%"}}>
                                        {item.senderUsername}
                                    </NetmarbleL>
                                    <NetmarbleL style={{width:"40%"}}>
                                        {item.created_at.substring(0,10)}
                                    </NetmarbleL>
                                </View>
                                <View style={{justifyContent:"space-around",flexDirection:"row",marginTop:"10%"}}>
                                    <Button 
                                    onPress={this.friendRequest.bind(this,item.id,true)}
                                    style={[{width:"48%"},styles.requestButton]}>
                                        <NetmarbleL>{translate('accept')}</NetmarbleL>
                                    </Button>
                                    <Button 
                                    onPress={this.friendRequest.bind(this,item.id,false)}
                                    style={[{width:"48%"},styles.requestButton]}>
                                        <NetmarbleL>{translate('reject')}</NetmarbleL>
                                    </Button>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </ScrollView>
                <Modal
                isVisible={this.state.modalVisible}>
                    <ActivityIndicator size={100}/>
                </Modal>
            </View>
        );
    }
}