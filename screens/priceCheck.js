import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet,TextInput,FlatList,TouchableOpacity,ScrollView } from "react-native";
import RadioForm from 'react-native-simple-radio-button';
import PriceCard from '../components/priceCard';
import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('sql.db')

const priceCheck = () =>{

    const radioProps = [
        { label: 'NML', value: 'nml' },
        { label: 'HTL', value: 'htl' },
        { label: 'SPL', value: 'spl' },
        { label: 'ANG', value: 'ang' }
    ]

    const [state , setState] = useState({
        prodNameList : [],
        showFlatlist : false,
        custType : 'nml',
        nameText : '',
        priceDetails : '',
        bool : true
    })

    const {prodNameList, showFlatlist,custType,nameText,priceDetails,bool} = state
    const [allProducts,setAllProducts] = useState('')

    useEffect(() => {
        db.transaction(tx => {tx.executeSql('SELECT prod_id,prod_name FROM products', null,(txObj, { rows: { _array } }) =>{ setAllProducts(_array);},null)})
        }, [true])
    
    useEffect(() => {
    if(allProducts.length>0)getProdName()
    },[bool])
    const getProdName =   () => {
        if(nameText.length>1){
            let filtered = [];
            let toSearch = nameText.toUpperCase();
            if(toSearch.trim().length == 0) toSearch = null
            for(let i=0; i < allProducts.length; i++) 
            {
            for(var key in allProducts[i]) ;
            {
                if(String(allProducts[i][key]).indexOf(toSearch)!= -1) 
                {
                filtered.push(allProducts[i]);
                }
            }
            }
            setState({   
            prodNameList : filtered,
            showFlatlist : filtered.length != 0 ? true : false,
            custType : custType,
            nameText : nameText,
            priceDetails : priceDetails,
            bool : bool,
            })
        }
        else{
            let filtered = [];
            setState({   
                prodNameList : filtered,
                showFlatlist : filtered.length != 0 ? true : false,
                custType : custType,
                nameText : nameText,
                priceDetails : priceDetails,
                bool : bool,
                })
        }
        }

    async function getProdDetails (prodName,prodId) {
            db.transaction(tx => {tx.executeSql(`SELECT stk_cost,stk_sp_${custType},stk_prod_qty,acc_name,prod_unit_type,${custType}_unit,pur_date  FROM stocks,accounts,products  where stk_prod_id = ${prodId} and stk_sup_id=acc_id and prod_id = ${prodId} order  by stocks.stk_prod_qty desc limit 4 ;`, null,
            (txObj, { rows: { _array } }) =>{ 
                let stockDetails = _array 
                for(let i = stockDetails.length;i<4;i++)stockDetails.push({stk_cost:'',stk_sp_nml:": : : : :",stk_sp_ang :": : : : :",stk_sp_spl :": : : : :",stk_sp_htl :": : : : :",stk_prod_qty:'',acc_name:'',prod_unit_type:'',pur_date: 0})
                setState({
                    prodNameList : [],
                    showFlatlist : false,
                    custType : custType,
                    nameText : prodName,
                    priceDetails: stockDetails,
                    bool : bool
                });
            },
            null)})
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

                <View>
                <RadioForm
                  buttonSize={20}
                  buttonOuterSize={35}
                  buttonWrapStyle={{marginLeft: 15}}
                  radioStyle={{paddingTop:25,marginHorizontal:'3%'}}
                  selectedButtonColor="#000000"
                  radio_props={radioProps}
                  labelHorizontal={true}
                  formHorizontal={true} 
                  initial={0}
                  animation={true}
                  onPress={(value) =>  setState({
                                       prodNameList : [],
                                       showFlatlist : false,
                                       custType : value,
                                       nameText : nameText,
                                       bool : bool
                                      })
                    }
                />
                </View>

                <TextInput
                    selectTextOnFocus={true}
                    placeholder='Product Name'
                    style = {styles.Name}
                    value = {nameText}
                    onChangeText = {e=>  setState({
                        prodNameList: prodNameList,
                        showFlatlist: showFlatlist,
                        custType: custType,
                        nameText : e,
                        priceDetails : priceDetails,
                        bool : !bool
                    })}
                    />
                    {showFlatlist ? (
                        <FlatList
                        style = {styles.flatlist}
                        data = {prodNameList}
                        renderItem= {renderItem}
                        keyExtractor= {item =>item.prod_id}
                        />
                        ) :(
                            
                        <ScrollView>
                            { (priceDetails != null && typeof(priceDetails) != "undefined" && priceDetails.length == 4) ? (
                            <View>
                                    <PriceCard
                                        sup = {priceDetails[0].acc_name}
                                        cp = {`${"₹"} ${priceDetails[0].stk_cost}`}
                                        qty = {`${priceDetails[0].stk_prod_qty} ${priceDetails[0].prod_unit_type} `}
                                        date = {`${priceDetails[0].pur_date}`}
                                        sp0 = {`${"₹"} ${priceDetails[0][`stk_sp_${custType}`].split(':').slice(1,-1)[0]}`}
                                        sp1 = {`${"₹"} ${priceDetails[0][`stk_sp_${custType}`].split(':').slice(1,-1)[1]}`}
                                        sp2 = {`${"₹"} ${priceDetails[0][`stk_sp_${custType}`].split(':').slice(1,-1)[2]}`}
                                        sp3 = {`${"₹"} ${priceDetails[0][`stk_sp_${custType}`].split(':').slice(1,-1)[3]}`}
                                        qty0 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[0]} ${priceDetails[0].prod_unit_type} `}
                                        qty1 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[1]} ${priceDetails[0].prod_unit_type} `}
                                        qty2 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[2]} ${priceDetails[0].prod_unit_type} `}
                                        qty3 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[3]} ${priceDetails[0].prod_unit_type} `}
                                        />
                                    <PriceCard
                                        sup = {priceDetails[1].acc_name}
                                        cp = {`${"₹"} ${priceDetails[1].stk_cost}`}
                                        date = {`${priceDetails[1].pur_date}`}

                                        qty = {`${priceDetails[1].stk_prod_qty} ${priceDetails[0].prod_unit_type} `}
                                        sp0 = {`${"₹"} ${priceDetails[1][`stk_sp_${custType}`].split(':').slice(1,-1)[0]}`}
                                        sp1 = {`${"₹"} ${priceDetails[1][`stk_sp_${custType}`].split(':').slice(1,-1)[1]}`}
                                        sp2 = {`${"₹"} ${priceDetails[1][`stk_sp_${custType}`].split(':').slice(1,-1)[2]}`}
                                        sp3 = {`${"₹"} ${priceDetails[1][`stk_sp_${custType}`].split(':').slice(1,-1)[3]}`}
                                        qty0 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[0]} ${priceDetails[0].prod_unit_type} `}
                                        qty1 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[1]} ${priceDetails[0].prod_unit_type} `}
                                        qty2 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[2]} ${priceDetails[0].prod_unit_type} `}
                                        qty3 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[3]} ${priceDetails[0].prod_unit_type} `}
                                        />
                                    <PriceCard
                                        sup = {priceDetails[2].acc_name}
                                        date = {`${priceDetails[2].pur_date}`}

                                        cp = {`${"₹"} ${priceDetails[2].stk_cost}`}
                                        qty = {`${priceDetails[2].stk_prod_qty} ${priceDetails[0].prod_unit_type} `}
                                        sp0 = {`${"₹"} ${priceDetails[2][`stk_sp_${custType}`].split(':').slice(1,-1)[0]}`}
                                        sp1 = {`${"₹"} ${priceDetails[2][`stk_sp_${custType}`].split(':').slice(1,-1)[1]}`}
                                        sp2 = {`${"₹"} ${priceDetails[2][`stk_sp_${custType}`].split(':').slice(1,-1)[2]}`}
                                        sp3 = {`${"₹"} ${priceDetails[2][`stk_sp_${custType}`].split(':').slice(1,-1)[3]}`}
                                        qty0 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[0]} ${priceDetails[0].prod_unit_type} `}
                                        qty1 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[1]} ${priceDetails[0].prod_unit_type} `}
                                        qty2 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[2]} ${priceDetails[0].prod_unit_type} `}
                                        qty3 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[3]} ${priceDetails[0].prod_unit_type} `}
                                        />
                                    <PriceCard
                                        sup = {priceDetails[3].acc_name}
                                        date = {`${priceDetails[3].pur_date}`}

                                        cp = {`${"₹"} ${priceDetails[3].stk_cost}`}
                                        qty = {`${priceDetails[3].stk_prod_qty} ${priceDetails[0].prod_unit_type} `}
                                        sp0 = {`${"₹"} ${priceDetails[3][`stk_sp_${custType}`].split(':').slice(1,-1)[0]}`}
                                        sp1 = {`${"₹"} ${priceDetails[3][`stk_sp_${custType}`].split(':').slice(1,-1)[1]}`}
                                        sp2 = {`${"₹"} ${priceDetails[3][`stk_sp_${custType}`].split(':').slice(1,-1)[2]}`}
                                        sp3 = {`${"₹"} ${priceDetails[3][`stk_sp_${custType}`].split(':').slice(1,-1)[3]}`}
                                        qty0 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[0]} ${priceDetails[0].prod_unit_type} `}
                                        qty1 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[1]} ${priceDetails[0].prod_unit_type} `}
                                        qty2 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[2]} ${priceDetails[0].prod_unit_type} `}
                                        qty3 = {`${priceDetails[0][`${custType}_unit`].split(':').slice(1,-1)[3]} ${priceDetails[0].prod_unit_type} `}
                                        />
                            </View>):(<View/>) }
                        </ScrollView>
                        
                        )
                    }
        <View>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    entryScreen : {
        flex: 1,
        width : "100%",
        maxHeight : '100%',
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
})

export default priceCheck;