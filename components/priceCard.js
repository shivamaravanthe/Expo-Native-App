import React from 'react';
import {View, Text, StyleSheet} from 'react-native'

const PriceCard = props => {
    let date = new Date(props.date).toString().substring(4, 15)
    if(props.date==0){
        date = 'Not Purchased'
    }
    function getCPinABC(){
        let x = String(Number(props.cp.split(' ')[1]).toFixed(2))
        let cp = ''
        for(let i=0;i<x.length;i++)
            {
                switch(x.charAt(i))
                {
                case '1':
                    cp += 'A'
                    break;
                case '2':
                    cp += 'B'
                    break;
                case '3':
                    cp += 'C'
                    break;
                case '4':
                    cp += 'D'
                    break;
                case '5':
                    cp += 'E'
                    break;
                case '6':
                    cp += 'F'
                    break;
                case '7':
                    cp += 'G'
                    break;
                case '8':
                    cp += 'H'
                    break;
                case '9':
                    cp += 'I'
                    break;
                case '0':
                    cp += 'O'
                    break;
                default:
                    cp += ''
                    break;
                }
            }
        return cp
    }
    
    return(
            <View style = {{...style.card,...props.style}}>
                        <View  style ={style.details}>
                        <Text style={style.title}>{props.sup}</Text>
                        
                        <Text style={style.title}>{date}</Text>

                        <View style ={style.cpqty}>
                                <Text style={style.title}>{props.qty}</Text>
                                <Text style={style.title}>{getCPinABC()}</Text>
                        </View>
                        <View style ={style.cpqty}>
                                <Text style={style.title}>{props.qty0}</Text>
                                <Text style={style.title}>{props.sp0}</Text>
                        </View>
                        <View style ={style.cpqty}>
                                <Text style={style.title}>{props.qty1}</Text>
                                <Text style={style.title}>{props.sp1}</Text>
                        </View>
                        <View style ={style.cpqty}>
                                <Text style={style.title}>{props.qty2}</Text>
                                <Text style={style.title}>{props.sp2}</Text>
                        </View>
                        <View style ={style.cpqty}>
                                <Text style={style.title}>{props.qty3}</Text>
                                <Text style={style.title}>{props.sp3}</Text>
                        </View>

                        </View>
            </View>
          )
}

const style = StyleSheet.create({

    card: {
        shadowColor : 'black',
        shadowOffset : {width: 0 ,height :2},
        shadowOpacity : 0.26,
        shadowRadius: 8,
        elevation : 5,
        borderRadius :10,
        overflow :'hidden',
        backgroundColor : 'white',
        minHeight : 250,
        margin: 20
    },
    
    details: {
        alignItems : 'center',
        //padding : 30
    },
    title: {
        fontSize: 30,
    },
    cpqty:{
        flex:1,
        width:'100%',
        flexDirection : 'row',
        justifyContent : 'space-around',
    }


})

export default PriceCard;
