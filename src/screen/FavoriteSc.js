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
    Picker,
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
    AsyncStorage,
    CheckBox,
	RefreshControl,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Carousel from 'react-native-snap-carousel';
import Modal from 'react-native-modal';
import {MapTags, updateFavoriteMap, FavoriteWorld, drawModal} from '../utils/MapUtils';
import {VRChatAPIGet, VRChatImage, VRChatAPIPostBody, VRChatAPIDelete} from '../utils/ApiUtils';
import {MapInfo} from '../utils/MapUtils';

export default class FavoriteSc extends Component {
    constructor(props) {
        console.info("FavoriteSc => constructor");

        super(props);

        this.state = {
            refreshing: false,
            refreshButton: false,
            refreshTime: false,
            modalVisible: false,
            modalLoding: true,
			search: "",
			avatarOffset: 10,
            isAvatarSearch: false,
            isWorldSearch: false,
            option: "avatar",
            getAvatars: [],
            getAvatarFilter: [],
            getWorlds: [],
            getWorldsFilter: [],
            getWorldsChooseId: null
        };
    }

    UNSAFE_componentWillMount() {
        console.info("FavoriteSc => componentWillMount");
        Promise.all([this.getAvatar(),this.getWorld()])
        .then(() => {
            this.setState({
                modalLoding: false
            });
        });
    }

    componentWillUnmount() {
        console.info("FavoriteSc => componentWillUnmount");
    }

    componentDidMount() {
        console.info("FavoriteSc => componentDidMount");
    }

    async getAvatar(){
		console.log("AvatarListSc => getAvatar");

		let fetc = await fetch(`https://api.vrchat.cloud/api/1/avatars/favorites?sort=_updated_at&order=descending`, VRChatAPIGet)
		.then(response => response.json());
		
		for(let i=0;i<fetc.length;i++)
        {
            fetc[i].isFavorite = true;
        }

        this.setState({
			getAvatars:fetc,
			modalVisible: false
        });

        console.log(this.state.getAvatars);

        return new Promise((resolve, reject) =>
        resolve(fetc));
	}

    async getWorld() {
        let fetc = await fetch("https://api.vrchat.cloud/api/1/worlds/favorites", VRChatAPIGet)
        .then((response) => response.json());

        for(let i=0;i<fetc.length;i++)
        {
            fetc[i].isFavorite = true;
        }

        this.setState({
			getWorlds:fetc,
			modalVisible: false
        });

        return new Promise((resolve, reject) =>
        resolve(fetc));
    }

    async favoriteAvatar(favoriteId, avatarId, isFavorite) {
		console.log("AvatarListSc => favoriteAvatar");

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
        });
	}

    async favoriteWorld(number, favoriteId, worldId, isFavorite) {

        let groupName = null;

        console.log(favoriteId);

        await fetch("https://api.vrchat.cloud/api/1/favorite/groups?type=world", VRChatAPIGet)
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
        });
    }

    flistAvatar() {
        if(this.state.getAvatars.length < 1)
        {
            return <View style={{paddingTop:"50%",paddingBottom:"2%",alignItems:"center"}}>
                <View>
                <Text>아바타내역이 존재하지 않습니다.</Text>
                </View>
            </View>
        }
        if(this.state.isAvatarSearch == false)
		{
			return <FlatList
				style={styles.list}
				data={this.state.getAvatars}
				extraData={this.state}
				renderItem={({item}) =>
					<TouchableOpacity
					onPress={()=> Actions.currentScene == "favoriteSc" ? Actions.friendDetail({userId:item.authorId, friendCheck:false}) : {}}
					style={{flexDirection:"row",padding:"5%",borderWidth:1}}
				>
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
				</TouchableOpacity>
				}
			/>
		}
		else if(this.state.isAvatarSearch == true)
		{
			return <FlatList
				style={styles.list}
				data={this.state.getAvatarFilter}
				extraData={this.state}
				renderItem={({item}) =>
					<TouchableOpacity
					onPress={()=> Actions.currentScene == "avatarListSc" ? Actions.friendDetail({userId:item.authorId, friendCheck:false}) : {}}
					style={{flexDirection:"row",padding:"5%",borderWidth:1}}
				>
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
				</TouchableOpacity>
				}
			/>
		}
    }

    flistWorld() {
        if(this.state.getWorlds.length < 1)
        {
            return <View style={{paddingTop:"50%",paddingBottom:"2%",alignItems:"center"}}>
                <View>
                <Text>월드내역이 존재하지 않습니다.</Text>
                </View>
            </View>
        }
        if(this.state.isWorldSearch == false)
        {
            return <View style={{width:"94%", marginLeft:"3%", height:"100%",paddingTop:"15%"}}>
                <Carousel
                    layout={'default'}
                    ref={(c) => { this._carousel = c; }} 
                    extraData={this.state}
                    data={this.state.getWorlds}
                    sliderWidth={parseInt(Dimensions.get('window').width / 100 * 94)}
                    itemWidth={parseInt(Dimensions.get('window').width / 100 * 70)}
                    renderItem={({item}) => 
                        <TouchableOpacity onPress={() => Actions.friendDetail({userId:item.authorId, isMap:true})}>
                            <View style={{borderWidth:1,padding:"5%"}}>
                                <View style={{alignItems:"flex-end"}}>
                                    {
                                    item.isFavorite == true ?
                                    <Icon 
                                    style={{zIndex:2}}
                                    onPress={this.favoriteWorld.bind(this, 0, item.favoriteId, item.id, item.isFavorite)}
                                    name="star" size={35} style={{color:"#FFBB00",marginBottom:5}}/>
                                    :
                                    <Icon 
                                    style={{zIndex:2}}
                                    onPress={() => this.setState({modalVisivle:true, getWorldsChooseId:item.id})}
                                    name="star-outlined" size={35} style={{color:"#FFBB00",marginBottom:5}}/>
                                    }
                                </View>
                                <View style={{flexDirection:"row"}}>
                                    <View>
                                        <Image
                                            style={{width: parseInt(Dimensions.get('window').width / 100 * 62), 
                                                height: parseInt(Dimensions.get('window').width / 100 * 40),
                                                borderRadius:5}}
                                            source={VRChatImage(item.thumbnailImageUrl)}
                                        />
                                    </View>
                                </View>   
                                <View style={{marginTop:"2%"}}>
                                    <Text>{item.name}</Text>
                                    <Text>전체 {item.occupants}명</Text>
                                    <Text>업데이트 날짜 : {item.updated_at != null && item.updated_at.substring(0,10)} </Text> 
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        }
        else if(this.state.isWorldSearch == true)
        {
            return <View style={{width:"94%", marginLeft:"3%", height:"100%",paddingTop:"15%"}}>
                <Carousel
                    layout={'default'}
                    ref={(c) => { this._carousel = c; }} 
                    extraData={this.state}
                    data={this.state.getWorldsFilter}
                    sliderWidth={parseInt(Dimensions.get('window').width / 100 * 94)}
                    itemWidth={parseInt(Dimensions.get('window').width / 100 * 70)}
                    renderItem={({item}) => 
                        <TouchableOpacity onPress={() => Actions.friendDetail({userId:item.authorId, isMap:true})}>
                            <View style={{borderWidth:1,padding:"5%"}}>
                                <View style={{alignItems:"flex-end"}}>
                                    {
                                    item.isFavorite == true ?
                                    <Icon 
                                    style={{zIndex:2}}
                                    onPress={this.favoriteWorld.bind(this, 0, item.favoriteId, item.id, item.isFavorite)}
                                    name="star" size={35} style={{color:"#FFBB00",marginBottom:5}}/>
                                    :
                                    <Icon 
                                    style={{zIndex:2}}
                                    onPress={() => this.setState({modalVisivle:true, getWorldsChooseId:item.id})}
                                    name="star-outlined" size={35} style={{color:"#FFBB00",marginBottom:5}}/>
                                    }
                                </View>
                                <View style={{flexDirection:"row"}}>
                                    <View>
                                        <Image
                                            style={{width: parseInt(Dimensions.get('window').width / 100 * 62), 
                                                height: parseInt(Dimensions.get('window').width / 100 * 40),
                                                borderRadius:5}}
                                            source={VRChatImage(item.thumbnailImageUrl)}
                                        />
                                    </View>
                                </View>   
                                <View style={{marginTop:"2%"}}>
                                    <Text>{item.name}</Text>
                                    <Text>전체 {item.occupants}명</Text>
                                    <Text>업데이트 날짜 : {item.updated_at != null && item.updated_at.substring(0,10)} </Text> 
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        }
    }

    filter = value => {
        this.setState({
            option: value
        })
    }

    search = () => {
        console.log("FavoriteSc => search")

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
            
            if(this.state.getAvatars != null && this.state.option == "avatar")
            {
                serachCheck = this.state.getAvatars.filter((v) => v.name.indexOf(this.state.search) !== -1)
            }
            if(this.state.getWorlds != null && this.state.option == "world")
            {
                serachCheck = this.state.getWorlds.filter((v) => v.name.indexOf(this.state.search) !== -1)
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
                if(this.state.getAvatars != null && this.state.option == "avatar")
                {
                    this.setState({
                        getAvatarFilter: serachCheck,
                        isAvatarSearch: true
                    });

                    this.flistAvatar();
                }
                if(this.state.getWorlds != null && this.state.option == "world")
                {
                    this.setState({
                        getWorldsFilter: serachCheck,
                        isWorldSearch: true,
                    });

                    this.flistWorld();
                }
            }
        }
    }

    reset(){
        console.log("FriendListSc => reset");
        console.log(this.state.refreshTime);
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalLoding = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.getAvatar(),this.getWorld()])
            .then(() => {
                this.setState({
                    modalLoding : false
                });
            });

            this.setState({
                refreshing:false,
                isAvatarSearch:false,
                isWorldSearch:false,
                search:null
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    resetButton() {
        console.log("FriendListSc => resetButton");

        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalLoding = true;
            this.state.refreshButton = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            Promise.all([this.getAvatar(),this.getWorld()])
            .then(() => {
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
                this.setState({
                    modalLoding : false
                });
            });

            this.setState({
                refreshing:false,
                isAvatarSearch:false,
                isWorldSearch:false,
                search:null
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    render() {
        console.info("FavoriteSc => render");
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>즐겨찾기 관리</Text>
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
                    { this.state.option == "avatar" ? this.flistAvatar() : this.flistWorld() }
                </ScrollView>
                {this.state.getWorlds != null ?
                    <Modal
                    style={styles.modal}
                    isVisible={this.state.modalVisible}
                    onBackButtonPress={()=>this.setState({modalVisivle:false})}
                    onBackdropPress={()=>this.setState({modalVisivle:false})}>
                        {this.state.modalVisivle == true ?
                            <View style={{backgroundColor:"#fff"}}>
                            <Button style={styles.groupButton} onPress={this.favoriteWorld.bind(this, 0, null, this.state.getWorldsChooseId, false)} ><Text style={{color:"#000"}}>Group 1</Text></Button>
                            <Button style={styles.groupButton} onPress={this.favoriteWorld.bind(this, 1, null, this.state.getWorldsChooseId, false)} ><Text style={{color:"#000"}}>Group 2</Text></Button>
                            <Button style={styles.groupButton} onPress={this.favoriteWorld.bind(this, 2, null, this.state.getWorldsChooseId, false)} ><Text style={{color:"#000"}}>Group 3</Text></Button>
                            <Button style={styles.groupButton} onPress={this.favoriteWorld.bind(this, 3, null, this.state.getWorldsChooseId, false)} ><Text style={{color:"#000"}}>Group 4</Text></Button>
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
                    : null
                }
                <Modal
                isVisible={this.state.modalLoding}>
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
    worldInfo: {
        flex: 1,
        width:"90%",
        padding:10,
        borderWidth:1,
        marginLeft:"5%"
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
        width:"35%",
        marginLeft:"2%",
        marginBottom:"5%",
        paddingBottom:"2%",
    }
});