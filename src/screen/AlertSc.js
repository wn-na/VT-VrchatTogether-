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
import {
    getAlerts,
    alerts,
    friendRequest
} from './../utils/UserUtils';
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import styles from '../css/css';
import {NetmarbleL,NetmarbleM} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';

export default class AlertSc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing:false,
            refreshTime:false,
            refreshButton:false,
            modalVisible:false,
            update: false,
            updateFunction: () => this.setState({update:null}),
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({
            alerts: alerts
        });
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    alertSend(state, id, type) {
        friendRequest(state, id, type);
        this.props.updateFunction();
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
            if(this.state.alerts != null)
            {
                alerts = alerts.filter((v) => v.senderUsername.indexOf(this.state.search) !== -1) 
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
                    alerts: serachCheck
                });
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

            Promise.all([getAlerts(this.state)])
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
            this.setState({
                refreshTime: true,
                refreshButton: true,
                modalVisible: true
            });
            setTimeout(() => {
                this.setState({
                    refreshTime: false,
                });
            }, 5000);

            Promise.all([getAlerts(this.state)])
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
                        data={alerts}
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
                                    onPress={()=> this.alertSend(this.state, item.id, true)}
                                    style={[{width:"48%"},styles.requestButton]}>
                                        <NetmarbleL>{translate('accept')}</NetmarbleL>
                                    </Button>
                                    <Button 
                                    onPress={()=> this.alertSend(this.state, item.id, false)}
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