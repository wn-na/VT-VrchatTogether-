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
    RefreshControl,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Modal from 'react-native-modal';
import {VRChatAPIGet, VRChatImage, VRChatAPIPostBody, VRChatAPIDelete} from '../utils/ApiUtils'

export default class MakeDetail extends Component {
    constructor(props) {
        console.info("MakeDetail => constructor");

        super(props);

        this.state = {
            getAvatars:[],
            getWorlds:[],
            refreshing:false,
            refreshTime:false,
            refreshButton:false,
            option:"avatar",
            modalVisivle:false,
            modalLoading:true,
        };
    }

    async UNSAFE_componentWillMount() {
        console.info("MakeDetail => componentWillMount");
        let promise;

        promise = Promise.all([this.getAvatars(),this.getWorlds()]);
        promise.done(() => {
            this.setState({
                modalLoading:false
            })
        })
    }

    componentWillUnmount() {
        console.info("MakeDetail => componentWillUnmount");
    }

    componentDidMount() {
        console.info("MakeDetail => componentDidMount");
    }

    async getAvatars() {
        console.info("MakeDetail => getAvatars");
        let offset = 0;
        let data = [];

        let fetc = await fetch(`https://api.vrchat.cloud/api/1/avatars?n=100&userId=`+this.props.userId, VRChatAPIGet)
        .then(response => response.json());

        // 즐겨찾기검사
        for(let i=0;i<2;i++){
            await fetch(`https://api.vrchat.cloud/api/1/favorites?type=avatar&n=100&offset=${offset}`, VRChatAPIGet)
            .then(res => res.json())
            .then(json => {
                data = data.concat(json);
                
                offset+=100;
            });
        }

        for(let i=0;i<fetc.length;i++)
        {
            fetc[i].isFavorite = false;
            fetc[i].favoriteId = null;

            for(let j=0;j<data.length;j++)
            {
                if(fetc[i].id == data[j].favoriteId)
                {
                    fetc[i].isFavorite = true;
                    fetc[i].favoriteId = data[j].id;
                }
            }
        }

        this.setState({
            getAvatars:fetc
        });
    }

    async getWorlds() {
        console.info("MakeDetail => getWorlds");
        let offset=0;
        let data = [];

        let fetc = await fetch(`https://api.vrchat.cloud/api/1/worlds?n=100&userId=`+this.props.userId, VRChatAPIGet)
        .then(response => response.json());

        // 즐겨찾기검사
        for(let i=0;i<2;i++){
            await fetch(`https://api.vrchat.cloud/api/1/favorites?type=world&n=100&offset=${offset}`, VRChatAPIGet)
            .then(res => res.json())
            .then(json => {
                data = data.concat(json);
                
                offset+=100;
            });
        }

        for(let i=0;i<fetc.length;i++)
        {
            fetc[i].isFavorite = false;
            fetc[i].favoriteId = null;

            for(let j=0;j<data.length;j++)
            {
                if(fetc[i].id == data[j].favoriteId)
                {
                    fetc[i].isFavorite = true;
                    fetc[i].favoriteId = data[j].id;
                }
            }
        }

        this.setState({
            getWorlds:fetc
        });
    }

    avatarList() {
        console.info("MakeDetail => avatarList");

        if(this.state.getAvatars.length < 1)
        {
            return <View style={{paddingTop:"50%",paddingBottom:"2%",alignItems:"center"}}>
                <View>
                <Text>아바타내역이 존재하지 않습니다.</Text>
                </View>
            </View>
        }

        return <FlatList
        data={this.state.getAvatars}
        extraData={this.state}
        renderItem={({item}) => 
            <View style={{flexDirection:"row", padding:"5%", borderWidth:1}}>
                <View>
                    <Image
                        style={{width: 100, height: 100, borderRadius:20}} 
                        source={VRChatImage(item.thumbnailImageUrl)}
                    />
                </View>
                <View style={{width:"100%",marginLeft:"3%",flexDirection:"row"}}>
                    <View style={{alignItems:"flex-start"}}>
                        <Text>
                            {item.name}
                        </Text>
                        <Text style={{marginTop:"3%"}}>
                            {item.updated_at.substring(0,10)}
                        </Text>
                    </View>
                    <View style={{position:"absolute",top:"-10%",left:"63%"}}>
                        {
                        item.isFavorite == true ?
                        <Icon 
                        onPress={this.favoriteAvatar.bind(this, item.favoriteId, item.id, item.isFavorite)}
                        name="star" size={30} style={{color:"#FFBB00",marginBottom:5}}/>
                        :
                        <Icon 
                        onPress={this.favoriteAvatar.bind(this, item.favoriteId, item.id, item.isFavorite)}
                        name="star-outlined" size={30} style={{color:"#FFBB00",marginBottom:5}}/>
                        }
                    </View>
                </View>
            </View>
        }
        />
    }

    worldList() {
        console.info("MakeDetail => worldList");

        if(this.state.getWorlds.length < 1)
        {
            return <View style={{paddingTop:"50%",paddingBottom:"2%",alignItems:"center"}}>
                <View>
                <Text>월드내역이 존재하지 않습니다.</Text>
                </View>
            </View>
        }

        return <FlatList
        data={this.state.getWorlds}
        extraData={this.state}
        renderItem={({item}) => 
            <View style={{flexDirection:"row", padding:"5%", borderWidth:1}}>
                <View>
                    <Image
                        style={{width: 100, height: 100, borderRadius:20}}
                        source={VRChatImage(item.thumbnailImageUrl)}
                    />
                </View>
                <View style={{width:"100%",marginLeft:"3%",flexDirection:"row"}}>
                    <View style={{alignItems:"flex-start",flex:1}}>
                        <Text style={{width:"70%"}}>
                            {item.name}
                        </Text>
                        <Text>
                            {item.authorName}
                        </Text>
                        <Text style={{marginTop:"3%"}}>
                            {item.updated_at.substring(0,10)}
                        </Text>
                    </View>
                    <View style={{position:"absolute",top:"-10%",left:"63%"}}>
                        {
                        item.isFavorite == true ?
                        <Icon 
                        onPress={this.viewWorldFavorite.bind(this, item.favoriteId, item.id, item.isFavorite)}
                        name="star" size={30} style={{color:"#FFBB00",marginBottom:5}}/>
                        :
                        <Icon 
                        onPress={this.viewWorldFavorite.bind(this, item.favoriteId, item.id, item.isFavorite)}
                        name="star-outlined" size={30} style={{color:"#FFBB00",marginBottom:5}}/>
                        }
                    </View>
                </View>
            </View>
        }
        />
    }

    async favoriteAvatar(favoriteId, avatarId, isFavorite) {

        if(isFavorite == false)
        {
            await fetch("https://api.vrchat.cloud/api/1/favorites", VRChatAPIPostBody({
                "type":"avatar",
                "tags":["avatars1"],
                "favoriteId":avatarId
            }))
            .then((response) => response.json())
            .then((json) => {
                
                if(!json.error)
                {
                    for(let i=0;i<this.state.getAvatars.length;i++)
                    {
                        if(this.state.getAvatars[i].id == avatarId)
                        {
                            this.state.getAvatars[i].isFavorite = true;
                            this.state.getAvatars[i].favoriteId = json.id;
                        }
                    }

                    ToastAndroid.show("추가 완료되었습니다.", ToastAndroid.SHORT);
                }
                else
                {
                    ToastAndroid.show("오류가 발생했습니다.", ToastAndroid.SHORT);
                }
            });
        }
        else if(isFavorite == true)
        {
            await fetch("https://api.vrchat.cloud/api/1/favorites/"+favoriteId, VRChatAPIDelete)
            .then((response) => response.json())
            .then((json) => {
                if(!json.error)
                {
                    for(let i=0;i<this.state.getAvatars.length;i++)
                    {
                        if(this.state.getAvatars[i].id == avatarId)
                        {
                            this.state.getAvatars[i].isFavorite = false;
                            this.state.getAvatars[i].favoriteId = null;
                        }
                    }

                    ToastAndroid.show("삭제 완료되었습니다.", ToastAndroid.SHORT);
                }
                else
                {
                    ToastAndroid.show("오류가 발생하였습니다.", ToastAndroid.SHORT);
                }
            });
        }

        this.setState({
            getAvatars: this.state.getAvatars
        })
    }

    async favoriteWorld(number, favoriteId, worldId, isFavorite) {
        console.log("MakeDetail => this.favoriteWorld");

        let groupName = null;

        fetch("https://api.vrchat.cloud/api/1/favorite/groups?type=world", VRChatAPIGet)
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

        if(isFavorite == false)
        {
            Alert.alert(
                "안내",
                "Group "+(number+1)+"에 즐겨찾기 하시겠습니까?",
                [
                    {text:"확인", onPress: () => {
                        fetch("https://api.vrchat.cloud/api/1/favorites", VRChatAPIPostBody({
                            "type":"world",
                            "tags":[groupName],
                            "favoriteId":worldId
                        }))
                        .then((response) => response.json())
                        .then((json) => {
                            console.log(json)
                            if(!json.error)
                            {
                                for(let i=0;i<this.state.getWorlds.length;i++)
                                {
                                    if(this.state.getWorlds[i].id == worldId)
                                    {
                                        this.state.getWorlds[i].isFavorite = true;
                                        this.state.getWorlds[i].favoriteId = json.id;
                                    }
                                }
                                
                                this.setState({
                                    modalVisivle: false
                                });

                                ToastAndroid.show("추가 완료되었습니다.", ToastAndroid.SHORT);
                            }
                            else
                            {
                                ToastAndroid.show("오류가 발생했습니다.", ToastAndroid.SHORT);
                            }
                        });
                    }},
                    {text:"취소"}
                ]
            );
        }
        else if(isFavorite == true)
        {
            await fetch("https://api.vrchat.cloud/api/1/favorites/"+favoriteId, VRChatAPIDelete)
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if(!json.error)
                {
                    for(let i=0;i<this.state.getWorlds.length;i++)
                    {
                        if(this.state.getWorlds[i].id == worldId)
                        {
                            this.state.getWorlds[i].isFavorite = false;
                            this.state.getWorlds[i].favoriteId = null;
                        }
                    }

                    ToastAndroid.show("삭제 완료되었습니다.", ToastAndroid.SHORT);
                }
                else
                {
                    ToastAndroid.show("오류가 발생하였습니다.", ToastAndroid.SHORT);
                }
            });
        }

        this.setState({
            getWorlds: this.state.getWorlds,
        })
    }

    viewWorldFavorite(favoriteId, avatarId, isFavorite) {
        if(isFavorite == false)
        {
            this.state.modalVisivle = true;
        }
        else
        {
            this.favoriteWorld(0, favoriteId, avatarId, isFavorite)
            this.state.modalVisivle = false;
        }

        this.setState({
            favoriteId:favoriteId,
            avatarId:avatarId,
            isFavorite:isFavorite,
        })
    }

    filter = value => {
        console.info("MakeDetail => filter");

        this.setState({
            option:value
        });
    }

    search = () => {
        console.info("MakeDetail => search");
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
            if(this.state.getAvatars != null || this.state.getWorlds)
            {
                if(this.state.option == "avatar")
                {
                    serachCheck = this.state.getAvatars.filter((v) => v.name.indexOf(this.state.search) !== -1)
                }
                if(this.state.option == "world")
                {
                    serachCheck = this.state.getWorlds.filter((v) => v.name.indexOf(this.state.search) !== -1)
                }
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
                if(this.state.option == "avatar")
                {
                    this.setState({
                        getAvatars:serachCheck
                    });
                }
                if(this.state.option == "world")
                {
                    this.setState({
                        getWorlds:serachCheck
                    });
                }
                
            }
        }
    }

    reset() {
        console.info("MakeDetail => reset");

        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalLoading = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.getAvatars(),this.getWorlds()])
            .then(() => {
                this.setState({
                    modalLoading : false
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

    resetButton(){
        console.info("MakeDetail => resetButton");

        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.refreshButton = true;
            this.state.modalLoading = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            let promise;

            promise = Promise.all([this.getAvatars(),this.getWorlds()]);
            promise.done(() => {
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
                this.setState({
                    modalLoading : false
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
        console.info("MakeDetail => render");
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>
                        제작정보
                    </Text>
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
                                <Picker.Item label = "아바타" value = "avatar" />
                                <Picker.Item label = "월드" value = "world" />
                            </Picker>
                        </View>
                    </View>
                    {this.state.option == "avatar" ? this.avatarList() : this.worldList()}
                    <Modal
                    style={styles.modal}
                    isVisible={this.state.modalVisivle}
                    onBackButtonPress={()=>this.setState({modalVisivle:false})}
                    onBackdropPress={()=>this.setState({modalVisivle:false})}>
                        {this.state.modalVisivle == true ? 
                        <View style={{backgroundColor:"#fff"}}>
                            <Button style={styles.groupButton} 
                            onPress={this.favoriteWorld.bind(this, 1, this.state.favoriteId, this.state.avatarId, this.state.isFavorite)} >
                                <Text style={{color:"#000"}}>Group 1</Text>
                            </Button>
                            <Button style={styles.groupButton} 
                            onPress={this.favoriteWorld.bind(this, 2, this.state.favoriteId, this.state.avatarId, this.state.isFavorite)} >
                                <Text style={{color:"#000"}}>Group 2</Text>
                            </Button>
                            <Button style={styles.groupButton} 
                            onPress={this.favoriteWorld.bind(this, 3, this.state.favoriteId, this.state.avatarId, this.state.isFavorite)} >
                                <Text style={{color:"#000"}}>Group 3</Text>
                            </Button>
                            <Button style={styles.groupButton} 
                            onPress={this.favoriteWorld.bind(this, 4, this.state.favoriteId, this.state.avatarId, this.state.isFavorite)} >
                                <Text style={{color:"#000"}}>Group 4</Text>
                            </Button>
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
                </ScrollView>
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
    list:{
        width:"97%",
        marginLeft:"1.5%"
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