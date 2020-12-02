import React, { Component } from "react";
// common component
import {
    Text,
} from "native-base"
import {
    Image,
    TouchableOpacity,
    ScrollView,
    View,
    TextInput,
    Dimensions,
    Alert,
    ActivityIndicator,
} from "react-native"
import Icon from "react-native-vector-icons/Entypo"
import { Actions } from 'react-native-router-flux'
import Carousel from 'react-native-snap-carousel'
import {MapTags, updateFavoriteMap, FavoriteWorld, drawModal} from '../utils/MapUtils'
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils'
import styles from '../css/css'
import {NetmarbleL,NetmarbleM} from '../utils/CssUtils';

export default class MapListSc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing:false,
            refreshTime:false,
            refreshButton:false,
            mapList: [],
            index: 0,
            mapCount: 10,
            search:'',
            tag: 'new',
            display : false,
            toggleModal : (t = null) => this.setState({display : t ? t : !this.state.display}),
            update : false,
            updateFunction : () => this.setState({update : !this.state.update})
        };
    }

    drawMapTag = () => 
        [...MapTags.keys()].map((key, idx) => 
            <NetmarbleL
            key={idx} style={this.state.tag == key ? styles.mapSelectTag : styles.mapTag} 
            onPress={() => {
                this.searchTagMap(key);
                this._carousel.snapToItem(0,true,true);
            }}>{key}</NetmarbleL>
        )

    searchMapList = (callback) => 
        fetch(`https://api.vrchat.cloud/api/1/worlds?search=${this.state.search}`, VRChatAPIGet)
        .then((response) =>  response.json())
        .then((responseJson) => {
            if(!responseJson.error){
                this.setState({
                    mapList: responseJson
                }, () => callback())
            }
        })


    UNSAFE_componentWillMount() {
        this.searchTagMap()
    }

    componentWillUnmount() {
    }
    componentDidMount() {
    }
    
    searchMap = () => {
        if(this.state.search == null || this.state.search == "")
        {
            Alert.alert(
                '오류',
                '검색어를 입력해주세요.',
                [{text: "확인", onPress: () => null}]
            )
        }
        else
        {
            this.searchMapList(() => {
                    if(this.state.mapCount == 0)
                    {
                        Alert.alert(
                            '오류',
                            '검색결과가 존재하지 않습니다.',
                            [{text: "확인", onPress: () => null}]
                        );
                    }
                    else
                    {
                        this.forceUpdate();
                    }
                }
            )
        }
    }
    
    searchTagMap = (tagName = this.state.tag, idx = this.state.index) => {
        // 리로드 모달 보여주기
        if(!MapTags.has(tagName)) return
        let isSameTag = this.state.tag == tagName
        fetch(`https://api.vrchat.cloud/api/1/worlds?tag=${MapTags.get(tagName)}&sort=_updated_at&offset=${idx * this.state.mapCount}`, VRChatAPIGet)
        .then((response) =>  response.json())
        .then((responseJson) => {
            if(!responseJson.error){
                this.setState((prevState, prevProps) => {
                    return {
                        mapList: isSameTag ? [...prevState.mapList, ...responseJson] : responseJson,
                        search: '',
                        tag: tagName,
                        index : idx
                    }
                });
            }
        })
    }

    reset() {

    }

    resetButton() {

    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={styles.logo}>
                    <Icon
					onPress={()=>Actions.pop()}
					name="chevron-left" size={25} style={{color:"white"}}/>
                    <NetmarbleM style={{color:"white"}}>맵 목록</NetmarbleM>
                    {this.state.refreshButton == false ?
                    <Icon
                    onPress={this.resetButton.bind(this)}
                    name="cycle" size={20} style={{color:"white"}}
                    />
                    :
                    <ActivityIndicator size={20} color="white"/>
                    }
                </View>
                <View style={styles.textView}>
                    <View style={styles.textBox}>
                        <TextInput 
                            value={this.state.search}
                            onChangeText={(text) => this.setState({search:text})}
                            onSubmitEditing={this.searchMap}
                            placeholder={"맵 검색"}
                            style={{width:"90%",height:50,fontFamily:"NetmarbleL"}}/>
                        <Icon 
                            onPress={() => this.searchMap}
                            name="magnifying-glass" size={25} style={{marginTop:5,color:"#3a4a6d"}}/>
                    </View>
                </View>
                <View style={{alignItems:"center",marginTop:"10%"}}>
                    <ScrollView
                    horizontal
                    style={{
                        width:"94%",
                        minHeight:50,
                        maxHeight:50,
                        flexDirection:"row",
                        borderColor:"#5a82dc",
                        borderTopWidth:1,
                        borderBottomWidth:1
                    }}>
                    {this.drawMapTag()}
                    </ScrollView>
                </View>

                <View style={{marginTop:"10%",alignItems:"center",flex:1}}>
                    <Carousel
                        layout={'default'}
                        ref={(c) => { this._carousel = c; }} 
                        onBeforeSnapToItem={(idx) => {
                            if(idx == this.state.mapList.length - 1){
                                this.searchTagMap(this.state.tag, this.state.index + 1);
                            }
                        }}
                        enableMomentum={"fast"}
                        extraData={this.state}
                        data={this.state.mapList}
                        sliderWidth={parseInt(Dimensions.get('window').width / 100 * 100)}
                        itemWidth={parseInt(Dimensions.get('window').width / 100 * 80)}
                        renderItem={({item}) => 
                            <TouchableOpacity
                            style={styles.worldInfo}
                            onPress={() => Actions.currentScene == "mapListSc" && Actions.userDetail({userId:item.authorId, isFriend:false})}>
                                <View>
                                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                                        <View>
                                            <NetmarbleM style={{textAlign:"center"}}>{item.name}</NetmarbleM>
                                            <Icon 
                                                onPress={() => updateFavoriteMap(this.state, item, FavoriteWorld.get(item.id))}
                                                name={(FavoriteWorld.get(item.id) ? "star" : "star-outlined")}
                                                size={40} 
                                                style={styles.worldIcon}
                                            />
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
                            </TouchableOpacity>
                        }
                    />
                </View>
                {drawModal(this.state)}
            </View>
        );
    }
}