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
	RefreshControl,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import {VRChatAPIGet, VRChatImage, VRChatAPIPostBody, VRChatAPIDelete} from '../utils/ApiUtils';
import styles from '../css/css';
import {NetmarbleM,NetmarbleL} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';

export default class AvatarListSc extends Component {
	constructor(props) {
		super(props);

		this.state = {
			refreshing:false,
			refreshButton: false,
			modalVisible: true,
			search: "",
			getAvatars: [],
			getAvatarFilter: [],
			avatarOffset: 10,
			isSearch:false
		};
	}

	UNSAFE_componentWillMount() {
		this.getAvatar();
	}

	componentWillUnmount() {
	}

	componentDidMount() {
	}

	async getAvatar(){
		let favoriteOffset = 0;
		let data = [];

		let fetc = await fetch(`https://api.vrchat.cloud/api/1/avatars?featured=true&sort=_updated_at&order=descending&n=10`, VRChatAPIGet)
		.then(response => response.json());
		
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
			getAvatars:fetc,
			modalVisible: false
        });
	}

	async moreGetAvatar() {
		let favoriteOffset = 0;
		let data = [];
		
		this.setState({
			avatarOffset: this.state.avatarOffset+10,
			modalVisible: true
		});
		
		let fetc = await fetch(`https://api.vrchat.cloud/api/1/avatars?featured=true&sort=_updated_at&order=descending&n=10&offset=${this.state.avatarOffset}`, VRChatAPIGet)
		.then(response => response.json());
		
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
			getAvatars:this.state.getAvatars.concat(fetc),
			modalVisible:false
        });
	}

	async favoriteAvatar(favoriteId, avatarId, isFavorite) {
		if(isFavorite == false)
        {
            await fetch(`https://api.vrchat.cloud/api/1/favorites`, VRChatAPIPostBody({
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

                    ToastAndroid.show(translate('msg_add_success'), ToastAndroid.SHORT);
				}
                else
                {
                    ToastAndroid.show(translate('msg_error'), ToastAndroid.SHORT);
                }
            });
        }
        else if(isFavorite == true)
        {
            await fetch(`https://api.vrchat.cloud/api/1/favorites/${favoriteId}`, VRChatAPIDelete)
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

                    ToastAndroid.show(translate('msg_delete_success'), ToastAndroid.SHORT);
                }
                else
                {
                    ToastAndroid.show(translate('msg_error'), ToastAndroid.SHORT);
                }
            });
        }

        this.setState({
            getAvatars: this.state.getAvatars
        })
	}

	flist() {
		if(this.state.isSearch == false)
		{
			return <FlatList
				data={this.state.getAvatars}
				extraData={this.state}
				renderItem={({item}) =>
					<TouchableOpacity
					onPress={()=> Actions.currentScene == "avatarListSc" ? Actions.userDetail({userId:item.authorId, isFriend:false}) : {}}
					style={styles.avatarList}>
					<View style={styles.avatarListView}>
						<View>
							<Image
								style={{width: 100, height: 100, borderRadius:20}} 
								source={VRChatImage(item.thumbnailImageUrl)}
							/>
						</View>
						<View style={{width:"100%",marginLeft:"3%",flexDirection:"row"}}>
							<NetmarbleL style={{width:"70%",lineHeight:30}}>
								{item.name}{"\n"}
								{item.authorName}{"\n"}
								{item.updated_at.substring(0,10)}
							</NetmarbleL>
							<View style={{position:"absolute",top:"-10%",left:"60%"}}>
								{
								item.isFavorite == true ?
								<TouchableOpacity
								onPress={this.favoriteAvatar.bind(this, item.favoriteId, item.id, item.isFavorite)}>
									<Image
									source={require('../css/imgs/favorite_star.png')}
									style={{width:30,height:30}}/>
								</TouchableOpacity>
								:
								<TouchableOpacity
								onPress={this.favoriteAvatar.bind(this, item.favoriteId, item.id, item.isFavorite)}>
									<Image
									source={require('../css/imgs/unfavorite_star.png')}
									style={{width:30,height:30}}/>
								</TouchableOpacity>
								}
							</View>
						</View>
					</View>
				</TouchableOpacity>}
			/>
		}
		else if(this.state.isSearch == true)
		{
			return <FlatList
				data={this.state.getAvatarFilter}
				extraData={this.state}
				renderItem={({item}) =>
					<TouchableOpacity
					onPress={()=> Actions.currentScene == "avatarListSc" ? Actions.userDetail({userId:item.authorId, isFriend:false}) : {}}
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
								<TouchableOpacity
								onPress={this.favoriteAvatar.bind(this, item.favoriteId, item.id, item.isFavorite)}>
									<Image
									source={require('../css/imgs/favorite_star.png')}
									style={{width:30,height:30}}/>
								</TouchableOpacity>
								:
								<TouchableOpacity
								onPress={this.favoriteAvatar.bind(this, item.favoriteId, item.id, item.isFavorite)}>
									<Image
									source={require('../css/imgs/unfavorite_star.png')}
									style={{width:30,height:30}}/>
								</TouchableOpacity>
								}
							</View>
						</View>
					</View>
				</TouchableOpacity>}
			/>
		}
	}

	search=()=>{
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
            if(this.state.getAvatars != null)
            {
				serachCheck = this.state.getAvatars.filter((v) => v.name.indexOf(this.state.search) !== -1);
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
					getAvatarFilter: serachCheck,
                    isSearch:true
				});

				this.flist();
            }
        }
    }

	reset() {
		this.state.modalVisible = true;
		this.state.refreshButton = true;

		setTimeout(() => {
			this.setState({
				refreshButton: false
			});
		}, 1000);

		this.setState({
			refreshing:false,
			search:null,
			isSearch:false,
			modalVisible:false
		});
	}

	render() {
		
		return (
			<View style={{flex:1}}>
				<View style={styles.logo}>
					<Icon
					onPress={()=>Actions.pop()}
					name="chevron-left" size={25} style={{color:"white"}}/>
					<NetmarbleM style={{color:"white"}}>{translate('avatar_list')}</NetmarbleM>
					{this.state.refreshButton == false ?
					<Icon
					onPress={this.reset.bind(this)}
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
				}>
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
					{this.flist()}
					{this.state.isSearch == false ?
						<View style={{
							width:"90%",
							marginLeft:"5%",
							marginBottom:"5%",
						}}>
							<Button
							onPress={this.moreGetAvatar.bind(this)}
							style={[{
								width:"100%",
								justifyContent:"center",
								alignItems:"center",
								backgroundColor: "#5a82dc"
							},styles.requestButton]}>
								<NetmarbleL style={styles}>{translate('more')}</NetmarbleL>
							</Button>
						</View>
					:null}
				</ScrollView>
				<Modal
                isVisible={this.state.modalVisible}>
                    <ActivityIndicator size={100}/>
                </Modal>
			</View>
		);
	}
}
