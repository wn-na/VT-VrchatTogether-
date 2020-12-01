
import {
    StyleSheet,
    Dimensions
} from 'react-native';

export default StyleSheet.create({
    logo: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#5a82dc",
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        height:50
    },
    topMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userCountInfo :{
        justifyContent:"center",
        flexDirection:"row"
    },
    userCount :{
        width:"60%",
        backgroundColor:"#5a82dc",
        flexDirection:"row",
        borderRadius: 10,
        padding:5
    },
    friendsInfo: {
        textAlign:"center",
        fontSize:13,
        padding:"10%",
        color:"white",
        fontFamily:"NetmarbleB"
    },
    menu: {
        flex:3
    },
    textView: {
        alignItems:"center",
        marginTop:"1%"
    },
    textBox: {
        width:"80%",
        borderBottomWidth:1,
        borderBottomColor:"#3a4a6d",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
    },
    textViewSmall: {
        justifyContent:"space-around",
        marginTop:"1%"
    },
    textBoxSmall: {
        width:"50%",
        borderBottomWidth:1,
        borderBottomColor:"#3a4a6d",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end",
    },
    selectView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"35%",
        marginLeft:"2%",
        marginBottom:"5%"
    },
    infoButton:{
        backgroundColor:"white",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:10,
        width:"70%",
        height:"91.5%",
        margin:5,
        borderRadius:15
    },
    infoButtonText: {
        marginTop:"10%",
        color:"#2b3956",
        fontSize:15,
        fontFamily:"NetmarbleM",
    },
    mapTag: {
        textAlign: 'center',
        fontFamily:"Godo_R",
        width:"20%",
        color:"#3a4a6d",
        minWidth: 90,
        fontSize: 25,
        justifyContent:"center"
    },
    mapSelectTag: {
        textAlign: 'center',
        justifyContent:"center",
        fontFamily:"Godo_R",
        width:"20%",
        color:"#3a4a6d",
        minWidth: 90,
        fontSize: 25,
        borderBottomWidth:4,
        borderBottomColor:"#5a82dc",
    },
    worldInfo: {
        borderWidth:1,
        borderRadius:2.8,
        borderColor:"#4d221e1f",
        padding:"5%"
    },
    worldInfoDetail: {
        borderWidth:1,
        borderRadius:2.8,
        borderColor:"#4d221e1f",
        padding:"5%",
        marginTop:"5%",
        margin:"7%"
    },
    worldIcon: {
        position:"absolute",
        color: "#FFBB00",
        top:"20%",
        right:"2%",
        zIndex:2
    },
    friendListCon: {
        marginLeft:"5%",
        marginRight:"5%"
    },
    friendList: {
        borderWidth:1,
        borderRadius:10,
        borderColor:"#4d221e1f",
        marginBottom:"5%",
        alignItems:"flex-end",
    },
    friendListView: {
        flexDirection:"row",
        width:"97%",
        padding:"5%",
        borderRadius:9,
        backgroundColor:"white"
    },
    avatarListCon: {
        marginLeft:"5%",
        marginRight:"5%"
    },
    avatarList: {
        borderWidth:1,
        borderRadius:10,
        borderColor:"#4d221e1f",
        backgroundColor:"#9ccbeb",
        marginBottom:"5%",
        alignItems:"flex-end",
    },
    avatarListView: {
        flexDirection:"row",
        width:"97%",
        padding:"5%",
        borderRadius:9,
        backgroundColor:"white"
    },
    friendInfoText: {
        marginLeft:"3%",
        width:"70%",
        fontFamily:"NetmarbleL",
        lineHeight:30,
        color:"#2b3956"
    },
    groupButton: {
        marginTop:10,
        margin:15,
        justifyContent:"center",
        backgroundColor:"#fff",
        color:"#000"
    },
    requestButton: {
        justifyContent:"center",
        borderRadius: 4.3,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#b3e59f"
    },
    selectedMenuGroup:{
        fontFamily:"NemarbleL",
        color:"#2b3956",
        paddingTop:"1%",
        paddingBottom:"1%",
        paddingLeft:"2%",
        paddingRight:"2%",
        marginLeft:"2%",
        marginRight:"2%",
        borderBottomWidth:1,
        borderColor:"red"
    },
    menuGroup:{
        fontFamily:"NemarbleL",
        color:"#2b3956",
        paddingTop:"1%",
        paddingBottom:"1%",
        paddingLeft:"2%",
        paddingRight:"2%",
        marginLeft:"2%",
        marginRight:"2%"
    }
});