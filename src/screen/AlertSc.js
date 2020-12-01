import React, { Component } from "react";
// common component
import {
    Text,
} from "native-base";
import {
    FlatList,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    View,
    TextInput,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {VRChatAPIGet} from '../utils/ApiUtils';
import styles from '../css/css';

export default class AlertSc extends Component {
    constructor(props) {
        console.info("AlertSc => constructor");

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
        console.info("AlertSc => componentWillMount");

        this.getAlerts();
    }

    componentWillUnmount() {
        console.info("AlertSc => componentWillUnmount");
    }

    componentDidMount() {
        console.info("AlertSc => componentDidMount");
    }

    async getAlerts() {
        console.info("AlertSc => getAlerts");

        await fetch(`https://api.vrchat.cloud/api/1/auth/user/notifications`, VRChatAPIGet)
        .then(responses => responses.json())
        .then(json => {
            this.setState({
                getAlerts:json.filter((v) => v.type.indexOf("friendRequest") !== -1),
                modalVisible:false
            });
        })
    }

    reset() {
        console.info("AlertSc => reset");

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
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    resetButton() {
        console.info("AlertSc => resetButton");

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
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    render() {
        console.info("AlertSc => render");
        
        return (
            <View style={{flex:1}}>
                <View style={styles.logo}>
                    <Text style={{fontFamily:"NetmarbleM",color:"white"}}>알림</Text>
                    <View  style={{position:"absolute",right:"5%"}}>
                    {this.state.refreshButton == false ?
                    <Icon
                    onPress={this.resetButton.bind(this)}
                    name="cycle" size={20} style={{color:"white"}}
                    />
                    :
                    <ActivityIndicator size={20} color="white"/>
                    }
                    </View>
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
								placeholder={"이름 검색"}
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
                                onPress={()=> Actions.currentScene == "alertSc" ? Actions.alertDetail({userId:item.senderUserId, notiId:item.id, option:"against"}) : {}}
                                style={{padding:"5%",borderWidth:1,marginLeft:"5%",marginRight:"5%",marginTop:"3%",marginBottom:"3%"}}
                            >
                                <Text>친구추가요청</Text>
                                <View style={{flexDirection:"row",width:"100%"}}>
                                    <Text style={{width:"70%"}}>
                                        {item.senderUsername}
                                    </Text>
                                    <Text style={{width:"30%"}}>
                                        {item.created_at.substring(0,10)}
                                    </Text>
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