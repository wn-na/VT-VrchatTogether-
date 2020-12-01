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
		console.log("AvatarListSc => UNSAFE_componentWillMount");
		this.getAvatar();
	}

	componentWillUnmount() {
		console.log("AvatarListSc => componentWillUnmount");
	}

	componentDidMount() {
		console.log("AvatarListSc => componentDidMount");
	}

	async getAvatar(){
		console.log("AvatarListSc => getAvatar");

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
		console.log("AvatarListSc => moreGetAvatar");

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
		console.log("AvatarListSc => favoriteAvatar");

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

	flist() {
		if(this.state.isSearch == false)
		{
			return <FlatList
				style={styles.avatarListCon}
				data={this.state.getAvatars}
				extraData={this.state}
				renderItem={({item}) =>
					<TouchableOpacity
					onPress={()=> Actions.currentScene == "avatarListSc" ? Actions.friendDetail({userId:item.authorId, friendCheck:false}) : {}}
					style={styles.avatarList}>
					<View style={styles.avatarListView}>
						<View>
							<Image
								style={{width: 100, height: 100, borderRadius:20}} 
								source={VRChatImage(item.thumbnailImageUrl)}
							/>
						</View>
						<View style={{width:"100%",marginLeft:"3%",flexDirection:"row"}}>
							<Text style={{fontFamily:"NetmarbleL",lineHeight:30}}>
								{item.name}{"\n"}
								{item.authorName}{"\n"}
								{item.updated_at.substring(0,10)}
							</Text>
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
				</TouchableOpacity>}
			/>
		}
		else if(this.state.isSearch == true)
		{
			return <FlatList
				style={styles.avatarListCon}
				data={this.state.getAvatarFilter}
				extraData={this.state}
				renderItem={({item}) =>
					<TouchableOpacity
					onPress={()=> Actions.currentScene == "avatarListSc" ? Actions.friendDetail({userId:item.authorId, friendCheck:false}) : {}}
					style={styles.avatarList}>
					<View style={styles.avatarListView}>
						<View>
							<Image
								style={{width: 100, height: 100, borderRadius:20}} 
								source={VRChatImage(item.thumbnailImageUrl)}
							/>
						</View>
						<View style={{width:"100%",marginLeft:"3%"}}>
							<Text style={{fontFamily:"NetmarbleL",lineHeight:30}}>
								{item.name}{"\n"}
								{item.authorName}{"\n"}
								{item.updated_at.substring(0,10)}
							</Text>
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
				</TouchableOpacity>}
			/>
		}
	}

	search=()=>{
        console.log("AvatarListSc => search");
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
            if(this.state.getAvatars != null)
            {
				serachCheck = this.state.getAvatars.filter((v) => v.name.indexOf(this.state.search) !== -1);
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
                this.setState({
					getAvatarFilter: serachCheck,
                    isSearch:true
				});

				this.flist();
            }
        }
    }

	reset() {
		console.log("AvatarListSc => reset");

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
					<Text style={{fontFamily:"NetmarbleM",color:"white"}}>아바타목록</Text>
                    <View  style={{position:"absolute",right:"5%"}}>
                    {this.state.refreshButton == false ?
                    <Icon
                    onPress={this.reset.bind(this)}
                    name="cycle" size={20} style={{color:"white"}}
                    />
                    :
                    <ActivityIndicator size={20} color="white"/>
                    }
                    </View>
                </View>
				<ScrollView
				onEndReached={() => console.log("end of list")}
				onEndReachedThreshold={0}
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
								placeholder={"이름 검색"}
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
							style={{
								width:"100%",
								justifyContent:"center",
								alignItems:"center",
								backgroundColor: "#5a82dc"
							}}>
								<Text style={{fontFamily:"NetmarbleL"}}>더보기</Text>
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
