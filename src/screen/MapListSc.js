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
import Icon from "react-native-vector-icons/Feather";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';

export default class MapListSc extends Component {
    constructor(props) {
        console.info("MapListSc => constructor");

        super(props);

        this.state = {
            mapList: [],
            index: 0,
            mapCount: 10,
            refreshing: false,
            count:0,
            search:null
        };
    }

    imageurl = async(i, url) => await (fetch(url, {
        method: "GET",
        headers: {
        Accept: "application/json",
        "User-Agent":"VT",
        "Content-Type": "application/json",
        }
    }).then((respose) => {
        this.state.count += 1
        if(!respose.error){
            if(respose.url !=null) this.state.mapList[i].thumbnailImageUrl = respose.url
            return respose.url
        }
        return respose;
    }))


    getMapList(){
        console.info("url : ", `https://api.vrchat.cloud/api/1/worlds?sort=_updated_at&offset=${this.state.index * this.state.mapCount}&n=50`);
        fetch(`https://api.vrchat.cloud/api/1/worlds?sort=_updated_at&offset=${this.state.index * this.state.mapCount}&n=50`, {
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
                        search:null,
                        refreshing: false
                    }
                  }, () => {
                    for(var i = 0; i < responseJson.length; i++){
                        console.info(responseJson[i].imageUrl)
                        this.imageurl(i, responseJson[i].thumbnailImageUrl);
                    }
                })
                console.info(responseJson)
            }
        })
    }
    
    searchMapList(){
        fetch(`https://api.vrchat.cloud/api/1/worlds?search=${this.state.search}`, {
            method: "GET",
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent":"VT"
            }
        })
        .then((response) =>  response.json())
        .then((responseJson) => {
            console.info(responseJson)
            if(!responseJson.error){
                console.info(responseJson)
                this.setState({
                    mapList: responseJson,
                    mapCount: responseJson.length
                })
            }
        })
    }

    UNSAFE_componentWillMount() {
        console.info("MapListSc => componentWillMount");
        this.getMapList();
        this.timeout();
    }

    componentWillUnmount() {
        console.info("MapListSc => componentWillUnmount");
    }
    componentDidMount() {
        console.info("MapListSc => componentDidMount");
    }
    
    timeout(){
        setTimeout(() =>{
            console.info("RES", this.state.count, this.state.mapCount)
            this.setState({refreshing:this.state.count == this.state.mapCount})
            if(this.state.count != this.state.mapCount) this.timeout()
        } , 100)
    }
    search() {
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
            let searchCheck = searchMapList();
            if(searchCheck.length == 0)
            {
                Alert.alert(
                    '오류',
                    '검색결과가 존재하지 않습니다.',
                    [{text: "확인", onPress: () => console.log('press login')}]
                );
            }
            else
            {
                this.forceUpdate();
            }
        }
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
                        onSubmitEditing={this.search}
                        style={{width:"85%"}}/>
                    <Icon 
                        onPress={this.search}
                        name="magnifying-glass" size={30} style={{marginTop:5}}/>
                </View>
                <ScrollView style={{borderWidth:1}}>
                    <FlatList
                        style={styles.list}
                        data={this.state.mapList}
                        // onRefresh={this.reset.bind(this)}
                        refreshing={this.state.refreshing}
                        renderItem={({item}) => 
                            <View style={{borderWidth:1}}>
                                <View style={{flexDirection:"row",padding:"5%"}}>
                                    <View>
                                        <Image
                                            style={{width: 370, height: 200, borderRadius:5}}
                                            source={this.state.refreshing && {uri:item.thumbnailImageUrl}}
                                        />
                                    </View>
                                    </View>   
                                <View style={{marginLeft:"3%"}}>
                                    <Text>맵 이름 : {item.name}</Text>
                                    <Text>맵 정보 : {item.releaseStatus}</Text>
                                    <Text>맵 전체 인원수 : {item.occupants}</Text>
                                    <Text>마지막 업데이트 날짜 : {Moment(item.updated_at).format('LLLL')}</Text> 
                                </View>
                                <View style={{flexDirection:"row",width:"100%",paddingTop:"5%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                                    <Button style={{marginRight:15,width:"48%",justifyContent:"center"}}>
                                        <Text>즐겨찾기 등록</Text>
                                    </Button>
                                    <Button onPress={()=>Actions.MapDetail({mapId:item.id})}
                                        style={{width:"48%",justifyContent:"center"}}>
                                        <Text>상세보기</Text>
                                    </Button>
                                </View>
                            </View>
                        }
                    />
                </ScrollView>
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
    }
});
