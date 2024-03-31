import React from 'react';
import {View, Text, StyleSheet,Image , TouchableNativeFeedback} from 'react-native'

const Card = props => {
    return(
            <View style = {{...style.product,...props.style}}>
                <View style={style.touchable}>
                    <TouchableNativeFeedback onPress={props.onViewDetail} useForeground>
                        <View  style ={style.details}>
                        {/* <Image source = {props.uri} style = {{ width: '85%', height: 200,resizeMode: 'stretch', marginTop:5 }} /> */}
                        <Text style={style.title}>{props.title}</Text> 
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
          )
}

const style = StyleSheet.create({

    product: {
        shadowColor : 'black',
        shadowOffset : {width: 0 ,height :2},
        shadowOpacity : 0.26,
        shadowRadius: 8,
        elevation : 5,
        borderRadius :10,
        backgroundColor : 'white',
        minHeight : 250,
        margin: 20
    },
    touchable:{
        borderRadius : 10,
        overflow :'hidden'
    },
    details: {
        alignItems : 'center',
        //padding : 30
    },
    title: {
        fontSize: 30,
    },

})

export default Card;