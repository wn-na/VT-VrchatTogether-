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
import Carousel from 'react-native-snap-carousel';
import {VRChatAPIGet, VRChatImage, VRChatAPIPostBody, VRChatAPIDelete} from '../utils/ApiUtils';
import styles from '../css/css';
import {NetmarbleM,NetmarbleL,NetmarbleB,GodoR} from '../utils/CssUtils';

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
        let avatarOffset = 0;
        let favoriteOffset = 0;
        let data = [];
        let fetc = [];

        for(let i=0;i<10;i++)
        {
            await fetch(`https://api.vrchat.cloud/api/1/avatars?n=100&userId=${this.props.userId}&offset=${avatarOffset}`, VRChatAPIGet)
            .then(response => response.json())
            .then(json => {
                fetc = fetc.concat(json);
                
                avatarOffset+= 100;
            });
        }

        // 즐겨찾기검사
        for(let i=0;i<2;i++){
            await fetch(`https://api.vrchat.cloud/api/1/favorites?type=avatar&n=100&offset=${favoriteOffset}`, VRChatAPIGet)
            .then(res => res.json())
            .then(json => {
                data = data.concat(json);
                
                favoriteOffset+=100;
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

        let fetc = await fetch(`https://api.vrchat.cloud/api/1/worlds?n=100&userId=${this.props.userId}`, VRChatAPIGet)
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
                    <NetmarbleL>아바타내역이 존재하지 않습니다.</NetmarbleL>
                </View>
            </View>
        }

        return <FlatList
        style={styles.avatarListCon}
        data={this.state.getAvatars}
        extraData={this.state}
        renderItem={({item}) => 
            <View
                style={styles.avatarList}>
                <View style={styles.avatarListView}>
                    <View>
                        <Image
                            style={{width: 100, height: 100, borderRadius:20}} 
                            source={VRChatImage(item.thumbnailImageUrl)}
                        />
                    </View>
                    <View style={{width:"100%",marginLeft:"3%"}}>
                        <NetmarbleL style={{width:"70%",lineHeight:30}}>
                            {item.name}{"\n"}
                            {item.authorName}{"\n"}
                            {item.updated_at.substring(0,10)}
                        </NetmarbleL>
                        <View style={{position:"absolute",top:"-10%",left:"60%"}}>
                            {
                            item.isFavorite == true ?
                            <Icon 
                            style={{zIndex:2}}
                            onPress={this.favoriteAvatar.bind(this, item.favoriteId, item.id, item.isFavorite)}
                            name="star" size={30} style={{color:"#FFBB00",marginBottom:5}}/>
                            :
                            <Icon 
                            style={{zIndex:2}}
                            onPress={this.favoriteAvatar.bind(this, item.favoriteId, item.id, item.isFavorite)}
                            name="star-outlined" size={30} style={{color:"#FFBB00",marginBottom:5}}/>
                            }
                        </View>
                    </View>
                </View>
            </View>}
        />
    }

    worldList() {
        console.info("MakeDetail => worldList");

        if(this.state.getWorlds.length < 1)
        {
            return <View style={{paddingTop:"50%",paddingBottom:"2%",alignItems:"center"}}>
                <View>
                    <NetmarbleL>월드내역이 존재하지 않습니다.</NetmarbleL>
                </View>
            </View>
        }
        return <View style={{marginTop:"10%",alignItems:"center",height:"100%"}}>
            <Carousel
                layout={'default'}
                ref={(c) => { this._carousel = c; }}
                extraData={this.state}
                enableMomentum={"fast"}
                data={this.state.getWorlds.filter((v) => v.group == this.state.selectedGroupKey)}
                sliderWidth={parseInt(Dimensions.get('window').width / 100 * 100)}
                itemWidth={parseInt(Dimensions.get('window').width / 100 * 80)}
                renderItem={({item}) => 
                    item.group == this.state.selectedGroupKey &&
                    <View style={styles.worldInfo}>
                        <View>
                            <View style={{flexDirection:"row",justifyContent:"center"}}>
                                <View>
                                    {
                                        item.isFavorite == true ?
                                        <Icon 
                                        style={{zIndex:2}}
                                        onPress={this.favoriteWorld.bind(this, 0, item.favoriteId, item.id, item.isFavorite)}
                                        name="star" size={35} style={styles.worldIcon}/>
                                        :
                                        <Icon 
                                        style={{zIndex:2}}
                                        onPress={() => this.setState({modalVisivle:true, getWorldsChooseId:item.id})}
                                        name="star-outlined" size={35} style={styles.worldIcon}/>
                                    }
                                    <NetmarbleM style={{textAlign:"center"}}>{item.name}</NetmarbleM>
                                    <Image
                                        style={{
                                            width: parseInt(Dimensions.get('window').width / 100 * 72), 
                                            height: parseInt(Dimensions.get('window').width / 100 * 50),
                                            borderRadius:5,
                                            marginTop:"5%",
                                            marginBottom:"5%"
                                        }}
                                        source={VRChatImage(item.thumbnailImageUrl)}
                                    />
                                </View>
                            </View>
                            <View>
                                <NetmarbleL style={{lineHeight:30}}>
                                    제작자 : {item.authorName}{"\n"}
                                    전체 : {item.occupants}명{"\n"}
                                    업데이트 날짜 : {item.updated_at.substring(0, 10)}{"\n"}
                                </NetmarbleL> 
                            </View>
                        </View>
                    </View>}
            />
        </View>
        // 보류
        // return <FlatList
        // data={this.state.getWorlds}
        // extraData={this.state}
        // renderItem={({item}) => 
        //     <View style={{flexDirection:"row", padding:"5%", borderWidth:1}}>
        //         <View>
        //             <Image
        //                 style={{width: 100, height: 100, borderRadius:20}}
        //                 source={VRChatImage(item.thumbnailImageUrl)}
        //             />
        //         </View>
        //         <View style={{width:"100%",marginLeft:"3%",flexDirection:"row"}}>
        //             <View style={{alignItems:"flex-start",flex:1}}>
        //                 <Text style={{width:"70%"}}>
        //                     {item.name}
        //                 </Text>
        //                 <Text>
        //                     {item.authorName}
        //                 </Text>
        //                 <Text style={{marginTop:"3%"}}>
        //                     {item.updated_at.substring(0,10)}
        //                 </Text>
        //             </View>
        //             <View style={{position:"absolute",top:"-10%",left:"63%"}}>
        //                 {
        //                 item.isFavorite == true ?
        //                 <Icon 
        //                 onPress={this.viewWorldFavorite.bind(this, item.favoriteId, item.id, item.isFavorite)}
        //                 name="star" size={30} style={{color:"#FFBB00",marginBottom:5}}/>
        //                 :
        //                 <Icon 
        //                 onPress={this.viewWorldFavorite.bind(this, item.favoriteId, item.id, item.isFavorite)}
        //                 name="star-outlined" size={30} style={{color:"#FFBB00",marginBottom:5}}/>
        //                 }
        //             </View>
        //         </View>
        //     </View>
        // }
        // />
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
                <View style={styles.logo}>
                    <Icon
					onPress={()=>Actions.pop()}
					name="chevron-left" size={25} style={{color:"white"}}/>
                    <NetmarbleM style={{color:"white"}}>제작정보</NetmarbleM>
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
						<View style={{borderBottomWidth:1,width:"100%",flexDirection:"row",justifyContent:"space-between",marginTop:"5%"}}>
							<TextInput 
								value={this.state.search}
								onChangeText={(text) => this.setState({search:text})}
								onSubmitEditing={this.search}
								placeholder={"검색"}
								style={{width:"80%",height:50,fontFamily:"NetmarbleL"}}/>
							<Icon 
								onPress={this.search}
								name="magnifying-glass" size={25} style={{marginTop:15,color:"#3a4a6d"}}/>
						</View>
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
                                <NetmarbleL>Group 1</NetmarbleL>
                            </Button>
                            <Button style={styles.groupButton} 
                            onPress={this.favoriteWorld.bind(this, 2, this.state.favoriteId, this.state.avatarId, this.state.isFavorite)} >
                                <NetmarbleL>Group 2</NetmarbleL>
                            </Button>
                            <Button style={styles.groupButton} 
                            onPress={this.favoriteWorld.bind(this, 3, this.state.favoriteId, this.state.avatarId, this.state.isFavorite)} >
                                <NetmarbleL>Group 3</NetmarbleL>
                            </Button>
                            <Button style={styles.groupButton} 
                            onPress={this.favoriteWorld.bind(this, 4, this.state.favoriteId, this.state.avatarId, this.state.isFavorite)} >
                                <NetmarbleL>Group 4</NetmarbleL>
                            </Button>
                            <View style={{alignItems:"center"}}>
                            <Button 
                            onPress={()=>this.setState({modalVisivle:false})}
                            style={{width:"20%",height:40,margin:10,justifyContent:"center"}}>
                                <NetmarbleL>취소</NetmarbleL>
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