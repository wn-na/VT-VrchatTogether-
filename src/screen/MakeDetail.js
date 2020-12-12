import React, { Component } from "react";
// common component
import {
    Button,
} from "native-base";
import {
    Image,
    FlatList,
    ScrollView,
    View,
    TextInput,
    Dimensions,
    Alert,
    Picker,
    TouchableOpacity,
    RefreshControl,
    ToastAndroid,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Modal from 'react-native-modal';
import { Actions } from 'react-native-router-flux';
import Carousel from 'react-native-snap-carousel';
import {VRChatAPIGet, VRChatImage, VRChatAPIPostBody, VRChatAPIDelete} from '../utils/ApiUtils';
import styles from '../css/css';
import {NetmarbleM,NetmarbleL} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';

export default class MakeDetail extends Component {
    constructor(props) {
        console.info("MakeDetail => constructor");

        super(props);

        this.state = {
            getAvatars:[],
            getWorlds:[],
            getFavoriteAvatars:[],
            getFavoriteWorlds:[],
            refreshing:false,
            refreshTime:false,
            refreshButton:false,
            option:"avatar",
            modalVisible:false,
            modalLoading:true,
        };
    }

    async UNSAFE_componentWillMount() {
        let offset=0;
        let checkPromise;

        for(let i=0;i<10;i++)
        {
            Promise.all([this.getAvatars(offset),this.getWorlds(offset)]);
        }

        for(let i=0;i<2;i++)
        {
            checkPromise = Promise.all([this.checkFavorite(offset)]);
        }

        checkPromise.done(()=>{
            for(let i=0;i<this.state.getAvatars.length;i++)
            {
                this.state.getAvatars[i].isFavorite = false;
                this.state.getAvatars[i].favoriteId = null;

                for(let j=0;j<this.state.getFavoriteAvatars.length;j++)
                {
                    if(this.state.getAvatars[i].id == this.state.getFavoriteAvatars[j].favoriteId)
                    {
                        this.state.getAvatars[i].isFavorite = true;
                        this.state.getAvatars[i].favoriteId = this.state.getFavoriteAvatars[j].id;
                    }
                }
            }

            for(let i=0;i<this.state.getWorlds.length;i++)
            {
                this.state.getWorlds[i].isFavorite = false;
                this.state.getWorlds[i].favoriteId = null;

                for(let j=0;j<this.state.getFavoriteWorlds.length;j++)
                {
                    if(this.state.getWorlds[i].id == this.state.getFavoriteWorlds[j].favoriteId)
                    {
                        this.state.getWorlds[i].isFavorite = true;
                        this.state.getWorlds[i].favoriteId = this.state.getFavoriteWorlds[j].id;
                    }
                }
            }

            this.setState({
                modalLoading: false
            })
        });
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    async checkFavorite(offset) {
        await fetch(`https://api.vrchat.cloud/api/1/favorites?type=avatar&n=100&offset=${offset}`, VRChatAPIGet)
        .then(res => res.json())
        .then(json => {
            this.setState({
                getFavoriteAvatars: this.state.getFavoriteAvatars.concat(json)
            });
        });

        await fetch(`https://api.vrchat.cloud/api/1/favorites?type=world&n=100&offset=${offset}`, VRChatAPIGet)
        .then(res => res.json())
        .then(json => {
            this.setState({
                getFavoriteWorlds: this.state.getFavoriteWorlds.concat(json)
            });
        });

        return new Promise((resolve, reject) =>
        resolve(this.state));
    }

    async getAvatars(avatarOffset) {
        let fetc = [];
        
        await fetch(`https://api.vrchat.cloud/api/1/avatars?n=100&userId=${this.props.userId}&offset=${avatarOffset}`, VRChatAPIGet)
        .then(response => response.json())
        .then(json => {
            fetc = fetc.concat(json);
        });

        this.setState({
            getAvatars:fetc
        });

        return new Promise((resolve, reject) =>
        resolve(this.state.getAvatars));
    }

    async getWorlds(worldOffset) {
        let fetc = [];

        await fetch(`https://api.vrchat.cloud/api/1/worlds?n=100&userId=${this.props.userId}&offset=${worldOffset}`, VRChatAPIGet)
        .then(response => response.json())
        .then(json => {
            fetc = fetc.concat(json);
        });

        this.setState({
            getWorlds:fetc
        });

        return new Promise((resolve, reject) => {
        resolve(this.state.getWorlds)});
    }

    avatarList() {
        if(this.state.getAvatars.length < 1)
        {
            return <View style={{paddingTop:"50%",paddingBottom:"2%",alignItems:"center"}}>
                <View>
                    <NetmarbleL>{translate('msg_avatar_list_not_found')}</NetmarbleL>
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
            </View>}
        />
    }

    worldList() {
        if(this.state.getWorlds.length < 1)
        {
            return <View style={{paddingTop:"50%",paddingBottom:"2%",alignItems:"center"}}>
                <View>
                    <NetmarbleL>{translate('msg_world_list_not_found')}</NetmarbleL>
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
                                    <NetmarbleM style={{textAlign:"center"}}>{item.name}</NetmarbleM>
                                    <View>
                                        {
                                            item.isFavorite == true ? 
                                            <TouchableOpacity
                                            style={styles.worldIcon}
                                            onPress={this.favoriteWorld.bind(this, 0, item.favoriteId, item.id, item.isFavorite)}>
                                                <Image
                                                source={require('../css/imgs/favorite_star.png')}
                                                style={{width:30,height:30}}/>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity
                                            style={styles.worldIcon}
                                            onPress={() => this.setState({modalVisible:true, getWorldsChooseId:item.id})}>
                                                <Image
                                                source={require('../css/imgs/unfavorite_star.png')}
                                                style={{width:30,height:30}}/>
                                            </TouchableOpacity>
                                        }
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
                            </View>
                            <View>
                                <NetmarbleL style={{lineHeight:30}}>
                                    {translate('creator')} : {item.authorName}{"\n"}
                                    {translate('all')} : {item.occupants}{translate('people_count')}{"\n"}
                                    {translate('update_date')} : {item.updated_at.substring(0, 10)}{"\n"}
                                </NetmarbleL> 
                            </View>
                        </View>
                    </View>}
            />
        </View>
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

    async favoriteWorld(number, favoriteId, worldId, isFavorite) {
        let groupName = null;
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

                    ToastAndroid.show(translate('msg_add_success'), ToastAndroid.SHORT);
                }
                else
                {
                    ToastAndroid.show(translate('msg_error'), ToastAndroid.SHORT);
                }

                this.setState({
                    modalVisible: false
                });
            });
        }
        else if(isFavorite == true)
        {
            await fetch("https://api.vrchat.cloud/api/1/favorites/"+favoriteId, VRChatAPIDelete)
            .then((response) => response.json())
            .then((json) => {
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

                    ToastAndroid.show(translate('msg_delete_success'), ToastAndroid.SHORT);
                }
                else
                {
                    ToastAndroid.show(translate('msg_error'), ToastAndroid.SHORT);
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
            this.state.modalVisible = true;
        }
        else
        {
            this.favoriteWorld(0, favoriteId, avatarId, isFavorite)
            this.state.modalVisible = false;
        }

        this.setState({
            favoriteId:favoriteId,
            avatarId:avatarId,
            isFavorite:isFavorite,
        })
    }

    filter = value => {
        this.setState({
            option:value
        });
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
                    translate('error'),
                    translate('msg_no_search_results'),
                    [{text: translate('ok')}]
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
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.modalLoading = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            let checkPromise;
            let offset = 0;

            for(let i=0;i<10;i++)
            {
                Promise.all([this.getAvatars(offset),this.getWorlds(offset)]);
            }

            for(let i=0;i<2;i++)
            {
                checkPromise = Promise.all([this.checkFavorite(offset)]);
            }

            checkPromise.done(()=>{
                for(let i=0;i<this.state.getAvatars.length;i++)
                {
                    this.state.getAvatars[i].isFavorite = false;
                    this.state.getAvatars[i].favoriteId = null;

                    for(let j=0;j<this.state.getFavoriteAvatars.length;j++)
                    {
                        if(this.state.getAvatars[i].id == this.state.getFavoriteAvatars[j].favoriteId)
                        {
                            this.state.getAvatars[i].isFavorite = true;
                            this.state.getAvatars[i].favoriteId = this.state.getFavoriteAvatars[j].id;
                        }
                    }
                }

                for(let i=0;i<this.state.getWorlds.length;i++)
                {
                    this.state.getWorlds[i].isFavorite = false;
                    this.state.getWorlds[i].favoriteId = null;

                    for(let j=0;j<this.state.getFavoriteWorlds.length;j++)
                    {
                        if(this.state.getWorlds[i].id == this.state.getFavoriteWorlds[j].favoriteId)
                        {
                            this.state.getWorlds[i].isFavorite = true;
                            this.state.getWorlds[i].favoriteId = this.state.getFavoriteWorlds[j].id;
                        }
                    }
                }

                this.setState({
                    modalLoading: false
                })
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

    resetButton(){
        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;
            this.state.refreshButton = true;
            this.state.modalLoading = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            let checkPromise;
            let offset = 0;

            for(let i=0;i<10;i++)
            {
                Promise.all([this.getAvatars(offset),this.getWorlds(offset)]);
            }
    
            for(let i=0;i<2;i++)
            {
                checkPromise = Promise.all([this.checkFavorite(offset)]);
            }
    
            checkPromise.done(()=>{
                setTimeout(() => {
                    this.setState({
                        refreshButton : false
                    });
                }, 1000);
                for(let i=0;i<this.state.getAvatars.length;i++)
                {
                    this.state.getAvatars[i].isFavorite = false;
                    this.state.getAvatars[i].favoriteId = null;
    
                    for(let j=0;j<this.state.getFavoriteAvatars.length;j++)
                    {
                        if(this.state.getAvatars[i].id == this.state.getFavoriteAvatars[j].favoriteId)
                        {
                            this.state.getAvatars[i].isFavorite = true;
                            this.state.getAvatars[i].favoriteId = this.state.getFavoriteAvatars[j].id;
                        }
                    }
                }
    
                for(let i=0;i<this.state.getWorlds.length;i++)
                {
                    this.state.getWorlds[i].isFavorite = false;
                    this.state.getWorlds[i].favoriteId = null;
    
                    for(let j=0;j<this.state.getFavoriteWorlds.length;j++)
                    {
                        if(this.state.getWorlds[i].id == this.state.getFavoriteWorlds[j].favoriteId)
                        {
                            this.state.getWorlds[i].isFavorite = true;
                            this.state.getWorlds[i].favoriteId = this.state.getFavoriteWorlds[j].id;
                        }
                    }
                }
    
                this.setState({
                    modalLoading: false
                })
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
                    <NetmarbleM style={{color:"white"}}>{translate('make_info')}</NetmarbleM>
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
								placeholder={translate('search')}
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
                                <Picker.Item label = {translate('avatar')} value = "avatar" />
                                <Picker.Item label = {translate('world')} value = "world" />
                            </Picker>
                        </View>
                    </View>
                    {this.state.option == "avatar" ? this.avatarList() : this.worldList()}
                    <Modal
                    style={styles.modal}
                    isVisible={this.state.modalVisible}
                    onBackButtonPress={()=>this.setState({modalVisible:false})}
                    onBackdropPress={()=>this.setState({modalVisible:false})}>
                        {this.state.modalVisible == true ? 
                        <View style={{backgroundColor:"#fff",borderRadius:10}}>
                            <Button style={styles.groupButton} onPress={this.favoriteWorld.bind(this, 0, null, this.state.getWorldsChooseId, false)}><NetmarbleL>{translate('group1')}</NetmarbleL></Button>
                            <Button style={styles.groupButton} onPress={this.favoriteWorld.bind(this, 1, null, this.state.getWorldsChooseId, false)}><NetmarbleL>{translate('group2')}</NetmarbleL></Button>
                            <Button style={styles.groupButton} onPress={this.favoriteWorld.bind(this, 2, null, this.state.getWorldsChooseId, false)}><NetmarbleL>{translate('group3')}</NetmarbleL></Button>
                            <Button style={styles.groupButton} onPress={this.favoriteWorld.bind(this, 3, null, this.state.getWorldsChooseId, false)}><NetmarbleL>{translate('group4')}</NetmarbleL></Button>
                            <View style={{alignItems:"center"}}>
                                <Button 
                                onPress={()=>this.setState({modalVisible:false})}
                                style={[styles.requestButton,{width:"20%",height:40,margin:10,justifyContent:"center"}]}>
                                    <NetmarbleL>{translate('cancel')}</NetmarbleL>
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