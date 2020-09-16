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

export default class AvatarListSc extends Component {
	constructor(props) {
		console.info("AvatarListSc => constructor");

		super(props);

		this.state = {
			avatarList: [],
			index: 0,
			avatarCount: 10,
			refreshing: false,
			count: 0,
			search: null
		};
	}

	UNSAFE_componentWillMount() {
		console.info("AvatarListSc => componentWillMount");
	}

	componentWillUnmount() {
		console.info("AvatarListSc => componentWillUnmount");
	}
	componentDidMount() {
		console.info("AvatarListSc => componentDidMount");
	}

	render() {
		console.info("AvatarListSc => render");
		
		return (
			<View style={{flex:1}}>
				<Header style={styles.logo}>
					<Text>아바타 목록</Text>
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
						data={this.state.avatarList}
						refreshing={this.state.refreshing}
						renderItem={({item}) =>
							<View style={{borderWidth:1}}>
								<View style={{flexDirection:"row", padding:"5%"}}>
									<View>
										<Image
											style={{width: 185, height: 200, borderRadius:5}}
											source={this.state.refreshing && {url:item.thumbnailImageUrl}}
										/>
										<Text>아바타 이름 : {item.name} </Text>
										<Text>제작자 이름 : {item.authorId} </Text>
										<Text>업데이트 날짜 : {Moment(item.updated_at).format('LLLL')}} </Text>
									</View>
								</View>
								<View>
									<Button style={{marginRight:15, width:"48%", justifyContent:"center"}}>
										<Text>즐겨찾기 등록</Text>
									</Button>
									<Button onPress={()=>Actions.AvatarDetail({})}
										<Text>상세보기</Text>
									</Button>
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
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center',
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
		width:"80%",
		flexDirection:"row",
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	}
});
