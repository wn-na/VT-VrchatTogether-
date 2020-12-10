import React, { Component } from "react";
// common component
import {
    Header,
    Text,
} from "native-base";
import {
    StyleSheet,
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
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils'
import styles from '../css/css';
import {NetmarbleL, NetmarbleM} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';

export default class BlockSc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing:false,
            refreshTime:false,
            refreshButton:false,
            option:"block",
            modalVisible:true,
            getBlock:[],
            getAgainst:[]
        };
    }

    UNSAFE_componentWillMount() {
        Promise.all([this.getBlock(),this.getAgainst()])
        .then(() => {
            this.setState({
                modalVisible:false
            })
        })
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    async getBlock () {
        await fetch(`https://api.vrchat.cloud/api/1/auth/user/playermoderations`, VRChatAPIGet)
        .then((response) => response.json())
        .then(json => {
            json.sort((a,b) =>{
                return a.created > b.created ? -1 : a.created > b.created ? 1 : 0;
            });
            this.setState({
                getBlock:json.filter((v) => v.type.indexOf("block") !== -1)
            });
        });
    }

    async getAgainst() {
        await fetch(`https://api.vrchat.cloud/api/1/auth/user/playermoderated`, VRChatAPIGet)
        .then((response) => response.json())
        .then(json => {
            json.sort((a,b) =>{
                return a.created > b.created ? -1 : a.created > b.created ? 1 : 0;
            });
            this.setState({
                getAgainst:json.filter((v) => v.type.indexOf("block") !== -1)
            });
        })
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
            if(this.state.option == "block" && this.state.getBlock != null)
            {
                serachCheck = this.state.getBlock.filter((v) => v.targetDisplayName.indexOf(this.state.search) !== -1) 
                this.setState({
                    getBlock:serachCheck
                })
            }
            if(this.state.option == "against" && this.state.getAgainst != null)
            {
                serachCheck = this.state.getAgainst.filter((v) => v.sourceDisplayName.indexOf(this.state.search) !== -1);
                this.setState({
                    getAgainst:serachCheck
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

    filter = value => {
        this.setState({
            option:value
        });
    }

    flist(){

        if(this.state.option == "block")
        {
            return <FlatList
                style={styles.list}
                data={this.state.getBlock}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "blockSc" ? Actions.userDetail({userId:item.targetUserId, option:"block"}) : {}}
                        style={{padding:"5%",borderWidth:1,marginLeft:"5%",marginRight:"5%",marginTop:"3%",marginBottom:"3%"}}
                    >
                        <View style={{flexDirection:"row",width:"100%"}}>
                            <NetmarbleL style={{width:"63%"}}>
                                {item.targetDisplayName}
                            </NetmarbleL>
                            <NetmarbleL style={{width:"37%"}}>
                                {item.created.substring(0,10)}
                            </NetmarbleL>
                        </View>
                    </TouchableOpacity>
                }
            />
        }
        else if(this.state.option == "against")
        {
            return <FlatList
                style={styles.list}
                data={this.state.getAgainst}
                renderItem={({item}) => 
                    <TouchableOpacity
                        onPress={()=> Actions.currentScene == "blockSc" ? Actions.userDetail({userId:item.sourceUserId, option:"against"}) : {}}
                        style={{padding:"5%",borderWidth:1,marginLeft:"5%",marginRight:"5%",marginTop:"3%",marginBottom:"3%"}}
                    >
                        <View style={{flexDirection:"row",width:"100%"}}>
                            <NetmarbleL style={{width:"63%"}}>
                                {item.sourceDisplayName}
                            </NetmarbleL>
                            <NetmarbleL style={{width:"37%"}}>
                                {item.created.substring(0,10)}
                            </NetmarbleL>
                        </View>
                    </TouchableOpacity>
                }
            />
        }
    }

    reset(){
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalVisible = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);
            
            Promise.all([this.getBlock(),this.getAgainst()])
            .then(() => {
                this.setState({
                    modalVisible : false
                });
            });

            this.setState({
                refreshing:false,
                option:"block",
                search:null
            });
        }
        else
        {
            ToastAndroid.show(translate('msg_refresh_time'), ToastAndroid.SHORT);
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

            let promise;

            promise = Promise.all([this.getBlock(),this.getAgainst()]);
            promise.done(() => {
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
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

    render() {
        return (
            <View style={{flex:1}}>
                <View style={styles.logo}>
                    <Icon
					onPress={()=>Actions.pop()}
					name="chevron-left" size={25} style={{color:"white"}}/>
                    <NetmarbleM style={{color:"white"}}>{translate('block_manage')}</NetmarbleM>
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
                    <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:"5%",marginRight:"5%",height:70}}>
                        <NetmarbleL style={{textAlignVertical:"center"}}>
                {this.state.option == "block" ? this.state.getBlock.length : this.state.getAgainst.length} {translate('people_count')}
                        </NetmarbleL>
                        <View style={[styles.selectView,{width:"45%"}]}>
                            <Picker 
                                selectedValue = {this.state.option}
                                onValueChange= {this.filter}
                            >
                                <Picker.Item label = {translate('msg_block')} value = "block" />
                                <Picker.Item label = {translate('msg_against')} value = "against" />
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