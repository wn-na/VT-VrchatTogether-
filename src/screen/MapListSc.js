import React, { Component } from "react";
import Moment from 'moment';
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
} from "native-base"
import {
    Image,
    ActivityIndicator,
    StyleSheet,
    SectionList,
    FlatList,
    TouchableOpacity,
    ScrollView,
    View,
    TextInput,
    Dimensions,
    Alert,
    Modal,
    AsyncStorage
} from "react-native"
import Icon from "react-native-vector-icons/Entypo"
import { Actions } from 'react-native-router-flux'
import utf8 from "utf8"
import base64 from 'base-64'
import Carousel from 'react-native-snap-carousel'
import {MapTags, updateFavoriteMap, FavoriteWorld, drawModal} from '../utils/MapUtils'
import {VRChatAPIGet, VRChatImage} from '../utils/ApiUtils'

export default class MapListSc extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            <Text key={idx} style={this.state.tag == key ? styles.mapSelectTag : styles.mapTag} onPress={() => this.searchTagMap(key)}>{key}</Text>
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


    render() {
        Moment.locale('ko');
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>맵 목록</Text>
                </Header>
                <View style={styles.textView}>
                    <TextInput 
                        value={this.state.search}
                        onChangeText={(text) => this.setState({search:text})}
                        onSubmitEditing={this.searchMap}
                        style={{width:"85%"}}/>
                    <Icon 
                        onPress={() => this.searchMap}
                        name="magnifying-glass" size={30} style={{marginTop:5}}/>
                </View>
                <View style={styles.textView}>
                    <ScrollView horizontal style={{width:"94%", height:30, marginBottom:"3%", marginTop:"3%", marginLeft:"3%", borderWidth:1, borderColor:"#efefef", flexDirection:"row"}}>
                    {this.drawMapTag()}
                    </ScrollView>
                </View>

                <View style={{width:"94%", marginLeft:"3%", height:"100%",paddingTop:"15%"}}>
                    <Carousel
                        layout={'default'}
                        ref={(c) => { this._carousel = c; }} 
                        onBeforeSnapToItem={(idx) => {
                            if(idx == this.state.mapList.length - 1){
                                this.searchTagMap(this.state.tag, this.state.index + 1);
                            }
                        }}
                        extraData={this.state}
                        data={this.state.mapList}
                        sliderWidth={parseInt(Dimensions.get('window').width / 100 * 94)}
                        itemWidth={parseInt(Dimensions.get('window').width / 100 * 70)}
                        sliderHeight={parseInt(Dimensions.get('window').width / 100 * 94)}
                        renderItem={({item}) => 
                            <TouchableOpacity onPress={() => Actions.friendDetail({userId:item.authorId, isMap:true})}>
                                <View style={{borderWidth:1}}>
                                    <Icon 
                                        onPress={() => updateFavoriteMap(this.state, item, FavoriteWorld.get(item.id))}
                                        name={(FavoriteWorld.get(item.id) ? "star" : "star-outlined")}
                                        size={40} 
                                        style={{marginLeft:15, justifyContent:"center", width:40, height:40}}
                                    />
                                    <View style={{flexDirection:"row",padding:"5%"}}>
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
                                        <Text>업데이트 날짜 : {item.updated_at.substring(0, 10)}</Text> 
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

const styles = StyleSheet.create({
    logo: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#fff"
    },
    info: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:"red",
        borderWidth:2
    },
    textView:{
        width:"95%",
        marginLeft:"2%",
        flexDirection:"row",
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    mapTag: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        width:"20%",
        minWidth: 90,
        height:30,
        fontSize: 20,
        borderWidth: 1,
        borderColor:'#e4f4f4'
    },
    mapSelectTag: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        width:"20%",
        minWidth: 90,
        height:30,
        fontSize: 20,
        borderWidth: 2,
        borderColor:'#e4f4f4',
        borderBottomWidth:2,
        borderBottomColor:"red",
    }
});
