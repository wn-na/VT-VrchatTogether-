
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
        marginTop:"1%",
        marginBottom:"10%"
    },
    textBox: {
        width:"80%",
        borderBottomWidth:1,
        borderBottomColor:"#3a4a6d",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
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
    worldIcon: {
        position:"absolute",
        color: "#FFBB00",
        top:"17%",
        right:"2%",
        zIndex:2
    }
});