import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet,TextInput,FlatList,TouchableOpacity,Keyboard, Alert} from "react-native";
import {  useSelector } from "react-redux";

const barcodePrint = () =>{

    const [state , setState] = useState({
        prodNameList : [],
        showFlatlist : false,
        nameText : '',
        priceDetails : '',
        bool : true,
        numBar : ''
    })

    const {prodNameList, showFlatlist,nameText,priceDetails,bool,numBar} = state

    const allCustomer = useSelector(state => state.productName.productName)
    useEffect(() => {
        getProdName()
        }, [bool])
      
      const getProdName =  () => {
              let filtered = [];
              let toSearch = nameText.toUpperCase();
              if(toSearch.trim().length == 0) toSearch = null
              for(let i=0; i < allCustomer.length; i++) 
              {
              for(var key in allCustomer[i]) ;
              {
                  if(String(allCustomer[i][key]).indexOf(toSearch)!= -1) 
                  {
                  filtered.push(allCustomer[i]);
                  }
              }
              }
              setState({   
              prodNameList : filtered,
              showFlatlist : filtered.length != 0 ? true : false,
              nameText : nameText,
              priceDetails : priceDetails,
              bool : bool,
              numBar : numBar

              })
          
        }
    function print(){
        if(numBar>0)
        {
            let x = String(Number(priceDetails[0].stk_cost).toFixed(2))
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
            Keyboard.dismiss()
            try{
            fetch(`http://192.168.0.111:7000/Barcode?name=${nameText}&barcode=${priceDetails[0].prod_bar}&mrp=${Number(priceDetails[0].prod_mrp).toFixed(2)}&cp=${cp}&sp=${Number(priceDetails[0].stk_sp_nml.split(':')[1]).toFixed(2)}&count=${numBar}`);
            }catch(error){
                Alert.alert("Offline","Connect To Somanath WIFI")
            }
        }
    }

    async function getProdDetails (prodName,prodId){
            try{
            //ip
            let getDbYear = () => {
                let today = new Date()
                let d = today.toISOString().slice(2,4)
                let m = today.toISOString().slice(5,7)
                if(parseInt(m)<4)
                    return parseInt(d)-1
                else
                    return  parseInt(d)
            }
            let dbYear =  getDbYear()
            const response1 = await fetch(`http://192.168.0.111:7000/onlySql?sql=SELECT stk_cost,stk_sp_nml,prod_mrp,prod_bar FROM somanath20${dbYear}.stocks,somanath.products where stk_prod_id =${prodId} and  prod_id =${prodId} order by stk_prod_qty desc limit 1;`);
            let stockDetails = await response1.json()
            for(let i = stockDetails.length;i<1;i++)stockDetails.push({stk_cost:'',stk_sp_nml:": : : : :",prod_mrp:''})
            setState({
                prodNameList : [],
                showFlatlist : false,
                nameText : prodName,
                priceDetails: stockDetails,
                bool : bool,
                numBar : numBar,
            });
            }
            catch(error){
            }
    }

    const renderItem = ({ item }) =>(
        <Item title={item.prod_name} id = {item.prod_id}/>
    );

    const Item = ({ title,id }) => (
        <TouchableOpacity 
        onPress={()=>
            getProdDetails(title,id)
            } 
        
        style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
        )

    return(
        <View style = {styles.entryScreen}>
                <TextInput
                    placeholder='Product Name'
                    style = {styles.Name}
                    value = {nameText}
                    onChangeText = {e=> setState({
                        prodNameList: prodNameList,
                        showFlatlist: showFlatlist,
                        nameText : e,
                        priceDetails : priceDetails,
                        bool : !bool,
                        numBar : numBar

                    })}
                    />
                    {showFlatlist ? (
                        <FlatList
                        style = {styles.flatlist}
                        data = {prodNameList}
                        renderItem= {renderItem}
                        keyExtractor= {item =>item.prod_id}
                        />
                        ):(
                        <View>
                            {(priceDetails!=null&&typeof(priceDetails)!="undefined"&&priceDetails.length==1)?(
                            <View style = {styles.barcodeDetails}>
                                <View style = {styles.price}>
                                    <Text style={styles.title}>{`CP    : ${"₹"}${Number(priceDetails[0].stk_cost).toFixed(2)}`}</Text>
                                    <Text style={styles.title}>{`MRP : ${"₹"}${Number(priceDetails[0].prod_mrp).toFixed(2)}`}</Text>
                                    <Text style={styles.title}>{`SP    : ${"₹"}${Number(priceDetails[0].stk_sp_nml.split(':')[1]).toFixed(2)}`}</Text>
                                </View>
                                
                                <TextInput
                                    placeholder='Print Count'
                                    style = {styles.Name}
                                    keyboardType = 'number-pad'
                                    value = {numBar}
                                    onChangeText = {e=> setState({
                                        prodNameList: prodNameList,
                                        showFlatlist: showFlatlist,
                                        nameText : nameText,
                                        priceDetails : priceDetails,
                                        bool : bool,
                                        numBar : e
                                    })}
                                />
                            <TouchableOpacity onPress={print} style = {styles.print}>
                            <Text style={{fontSize: 40}}>Print</Text>
                            </TouchableOpacity>
                            </View>
                            ):(<View/>)}
                        </View>
                        )
                    }

        </View>
    )
}

const styles = StyleSheet.create({
    entryScreen : {
        flex: 1,
        width : "100%",
        maxHeight : '100%',
    },
    barcodeDetails:{
        flex:1,
        width: '100%',
        minHeight:'80%',
        alignContent: 'center'
    },
    price:{
        flex:1,
        width: '100%',
        maxHeight:'30%',
    },
    item: {
        backgroundColor: '#f9c2ff',
        paddingVertical: 20,
        paddingHorizontal : 10,
        marginVertical: 8,
        borderRadius: 10,
    },
    flatlist:{
        width: "100%",
        height : "40%",
        marginVertical : 5,
        marginHorizontal: 5,
        //backgroundColor : 'blue'
      },
    Name : {
        fontSize : 22,
        borderWidth:1,
        paddingLeft : 5,
        height : '20%',
        minWidth : '90%', 
        borderRadius : 5,
        borderColor : 'black',
        margin : 10
    },
    product: {
        shadowColor : 'black',
        shadowOffset : {width: 0 ,height :2},
        shadowOpacity : 0.6,
        shadowRadius: 8,
        elevation : 5,
        borderRadius :10,
        backgroundColor : 'white',
        margin: 20
    },
    touchable:{
        borderRadius : 10,
        overflow :'hidden'
    },
    details: {
        alignItems : 'center',
        padding : 10
    },
    title: {
        fontSize: 30,
    },
    print: {
        alignItems: 'center',
        marginHorizontal: '10%',
        borderRadius: 10,
        width: '80%',
        backgroundColor : '#B5FFE1'
    }
})

export default barcodePrint;