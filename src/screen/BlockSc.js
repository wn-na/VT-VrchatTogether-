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
    List,
    ListItem,
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
    Picker,
    RefreshControl,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {UserGrade} from './../utils/UserUtils';
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils'

export default class BlockSc extends Component {
    constructor(props) {
        console.info("BlockSc => constructor");

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
        console.info("BlockSc => componentWillMount");

        Promise.all([this.getBlock(),this.getAgainst()])
        .then(() => {
            this.setState({
                modalVisible:false
            })
        })
    }

    componentWillUnmount() {
        console.info("BlockSc => componentWillUnmount");
    }

    componentDidMount() {
        console.info("BlockSc => componentDidMount");
    }

    async getBlock () {
        await fetch("https://api.vrchat.cloud/api/1/auth/user/playermoderations", VRChatAPIGet)
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
        await fetch("https://api.vrchat.cloud/api/1/auth/user/playermoderated", VRChatAPIGet)
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
        console.log("BlockSc => search")
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
                    '오류',
                    '검색결과가 존재하지 않습니다.',
                    [{text: "확인"}]
                );
            }
        }
    }

    filter = value => {
        console.log("BlockSc => filter");
        
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
                        onPress={()=> Actions.currentScene == "blockSc" ? Actions.blockDetail({userId:item.targetUserId, option:"block"}) : {}}
                        style={{padding:"5%",borderWidth:1,marginLeft:"5%",marginRight:"5%",marginTop:"3%",marginBottom:"3%"}}
                    >
                        <View style={{flexDirection:"row",width:"100%"}}>
                            <Text style={{width:"70%"}}>
                                {item.targetDisplayName}
                            </Text>
                            <Text style={{width:"30%"}}>
                                {item.created.substring(0,10)}
                            </Text>
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
                        onPress={()=> Actions.currentScene == "blockSc" ? Actions.blockDetail({userId:item.sourceUserId, option:"against"}) : {}}
                        style={{padding:"5%",borderWidth:1,marginLeft:"5%",marginRight:"5%",marginTop:"3%",marginBottom:"3%"}}
                    >
                        <View style={{flexDirection:"row",width:"100%"}}>
                            <Text style={{width:"70%"}}>
                                {item.sourceDisplayName}
                            </Text>
                            <Text style={{width:"30%"}}>
                                {item.created.substring(0,10)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        }
    }

    reset(){
        console.info("BlockSc => reset");

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
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    resetButton(){
        console.info("MakeDetail => resetButton");

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
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    render() {
        console.info("BlockSc => render");
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>블락관리</Text>
                    <View  style={{position:"absolute",right:"5%"}}>
                    {this.state.refreshButton == false ?
                    <Icon
                    onPress={this.resetButton.bind(this)}
                    name="cycle" size={20}
                    />
                    :
                    <ActivityIndicator size={20} color="black"/>
                    }
                    </View>
                </Header>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.reset.bind(this)}
                            refreshing={this.state.refreshing}
                        />
                    }
                >
                    <View style={styles.textView}>
                        <TextInput 
                            value={this.state.search}
                            onChangeText={(text)=>this.setState({search:text})}
                            onSubmitEditing={this.search}
                            style={{width:"85%"}}
                        />
                        <Icon 
                        onPress={this.search}
                        name="magnifying-glass" size={30} style={{marginTop:5}}/>
                    </View>
                    <View style={{alignItems:"flex-end",marginRight:"2%"}}>
                        <View style={styles.selectView}>
                            <Picker 
                                selectedValue = {this.state.option}
                                onValueChange= {this.filter}
                            >
                                <Picker.Item label = "내가 블락한" value = "block" />
                                <Picker.Item label = "나를 블락한" value = "against" />
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
        width:"45%",
        marginLeft:"2%",
        marginTop:"5%",
        marginBottom:"5%"
    }
});