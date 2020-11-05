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
    AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';
import Carousel from 'react-native-snap-carousel';
import {MapTags, MapInfo} from '../utils/MapUtils';

export default class MapListSc extends Component {
    constructor(props) {
        console.info("MapListSc => constructor");

        super(props);

        this.state = {
            mapList: [],
            index: 0,
            mapCount: 10,
            search:'',
            tag: 'new'
        };
    }
    
    searchMapList = (callback) => fetch(`https://api.vrchat.cloud/api/1/worlds?search=${this.state.search}`, {
            method: "GET",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent":"VT"
            }
        })
        .then((response) =>  response.json())
        .then((responseJson) => {
            console.info("S", responseJson)
            if(!responseJson.error){
                console.info(responseJson)
                this.setState({
                    mapList: responseJson,
                    mapCount: responseJson.length
                })
            }
            callback();
        })

    UNSAFE_componentWillMount() {
        console.info("MapListSc => componentWillMount");
        this.searchTagMap();
    }

    componentWillUnmount() {
        console.info("MapListSc => componentWillUnmount");
    }
    componentDidMount() {
        console.info("MapListSc => componentDidMount");
    }
    
    isFavorite = (item) => {
        console.log("TEST", item)
        if(!item) return "star-outlined"
        else return "star"
    }

    searchMap = () => {
        console.log("MapListSc => search");
        if(this.state.search == null || this.state.search == "")
        {
            Alert.alert(
                '오류',
                '검색어를 입력해주세요.',
                [{text: "확인", onPress: () => console.log('press search')}]
            );
        }
        else
        {
            this.searchMapList(
                () => {
                    console.log("TEST", this.state.mapCount)
                    if(this.state.mapCount == 0)
                    {
                        Alert.alert(
                            '오류',
                            '검색결과가 존재하지 않습니다.',
                            [{text: "확인", onPress: () => console.log('please new search')}]
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
    
    searchTagMap = (tagname) => {
        if(!tagname){
            tagname = this.state.tag;
        }
        if(!(tagname in MapTags)){
            return;
        }
        console.log("MapListSc => searchTagMap");
        fetch(`https://api.vrchat.cloud/api/1/worlds?tag=${MapTags[tagname]}&sort=_updated_at&offset=${this.state.index * this.state.mapCount}`, {
            method: "GET",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent":"VT"
            }
        })
        .then((response) =>  response.json())
        .then((responseJson) => {
            if(!responseJson.error){

                this.setState((prevState, prevProps) => {
                    return {
                        mapList: responseJson,
                        mapCount: responseJson.length,
                        search:'',
                        tag: tagname
                    }
                  })
                console.info(responseJson)
                
                Alert.alert(
                    tagname,
                    String(responseJson),
                    [{text: "확인", onPress: () => console.log('please new search')}]
                );
            }
        })
    }

    render() {
        console.info("MapListSc => render"); 
        Moment.locale('ko');
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>맵 목록</Text>
                </Header>
                <View style={styles.textView}>
                    <TextInput 
                        value={this.state.search}
                        onChangeText={(text)=>this.setState({search:text})}
                        onSubmitEditing={this.searchMap}
                        style={{width:"85%"}}/>
                    <Icon 
                        onPress={this.searchMap}
                        name="magnifying-glass" size={30} style={{marginTop:5}}/>
                </View>

                <View style={styles.textView}>
                    <ScrollView horizontal style={{width:"94%", height:30, marginBottom:"3%", marginTop:"3%", marginLeft:"3%", borderWidth:1, borderColor:"#efefef", flexDirection:"row"}}>
                            <Text style={this.state.tag == 'new' ? styles.mapSelectTag : styles.mapTag} onPress={() => this.searchTagMap('new')}>new</Text>
                            <Text style={this.state.tag == 'hot' ? styles.mapSelectTag : styles.mapTag} onPress={() => this.searchTagMap('hot')}>hot</Text>
                            <Text style={this.state.tag == 'avatar' ? styles.mapSelectTag : styles.mapTag} onPress={() => this.searchTagMap('avatar')}>avatar</Text>
                            <Text style={this.state.tag == 'game' ? styles.mapSelectTag : styles.mapTag} onPress={() => this.searchTagMap('game')}>game</Text>
                    </ScrollView>
                </View>

                <View style={{width:"94%", marginLeft:"3%", flexDirection:"row", borderWidth:1, borderColor:"#dfdfdf"}}>
                    <Carousel
                        layout={'default'}
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.mapList}
                        sliderWidth={300}
                        itemWidth={300}
                        renderItem={({item}) => MapInfo(item, this.searchMap, this.isFavorite(item))}
                    />
                </View>
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
