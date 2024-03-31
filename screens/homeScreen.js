import {ScrollView,RefreshControl,View,Alert, Button} from 'react-native';
import React,{useState,useCallback,useEffect} from 'react';
import Card from '../components/card';
import { fetchName} from '../store/actions/getData'
import { useDispatch } from 'react-redux'
import {  useSelector } from "react-redux";
import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('sql.db')
import NetInfo from '@react-native-community/netinfo';
import { PermissionsAndroid } from 'react-native';

const Menu = props => {
    useEffect(() => {
        (async () => {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                } else {
                  alert("Location permission denied")
                }
              } catch (err) {
                console.warn(err)
              }
        })();
      }, []);
    const [online, setOnline] = useState(false)

    async function isWifiConnected(page){ 
        const state = await NetInfo.fetch("wifi")
        if(String(state.details.ssid)=='SomanathNilaya'||String(state.details.ssid)=='Somanathstores'){
            setOnline(true)
            if(page.length!=0)props.navigation.navigate(page)
        }
        else setOnline(false)
        
    }

    isWifiConnected('')

    const dispatch = useDispatch();
    const [ready,setReady] = useState(false)
    const [refreshing, setRefreshing] = useState(false); 

    const getDb = async() => {
        try {
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
        const response1 = await fetch(`http://192.168.0.111:7000/onlySql?sql=SELECT stk_prod_id,stk_cost,stk_sp_nml,stk_sp_spl,stk_sp_ang,stk_sp_htl,stk_prod_qty,insert_time as pur_date,stk_sup_id FROM somanath20${dbYear}.stocks`);
        let stockDetails = await response1.json()
        let values = ''
        stockDetails.forEach(element => values += '('+element.stk_prod_id+','+element.stk_cost+',"'+element.stk_sp_nml+'","'+element.stk_sp_spl+'","'+element.stk_sp_ang+'","'+element.stk_sp_htl+'",'+element.stk_prod_qty+',"'+element.pur_date+'",'+element.stk_sup_id+'),');
        db.transaction(tx => {tx.executeSql('CREATE TABLE IF NOT EXISTS stocks (stk_prod_id INTEGER,stk_cost REAL,stk_sp_nml TEXT,stk_sp_spl TEXT,stk_sp_ang TEXT,stk_sp_htl TEXT,stk_prod_qty REAL,pur_date TEXT,stk_sup_id INTEGER)', null,null,null)})
        db.transaction(tx => {tx.executeSql('DELETE FROM stocks')})
        db.transaction(tx => {tx.executeSql(`INSERT INTO stocks values ${values.slice(0,-1)}`, null,null,null)})
        const response2 = await fetch(`http://192.168.0.111:7000/onlySql?sql=SELECT acc_id,acc_name FROM somanath.accounts where acc_type="SUPP"`);
        stockDetails = await response2.json()
        let values1 = ''
        db.transaction(tx => {tx.executeSql('CREATE TABLE IF NOT EXISTS accounts (acc_id INTEGER,acc_name TEXT)', null,null,null)})
        stockDetails.forEach(element => values1 += '('+element.acc_id+',"'+element.acc_name+'"),');
        db.transaction(tx => {tx.executeSql('DELETE FROM accounts')})
        db.transaction(tx => {tx.executeSql(`INSERT INTO accounts values ${values1.slice(0,-1)}`, null,null,null)})
        const response3 = await fetch(`http://192.168.0.111:7000/onlySql?sql=SELECT prod_id,prod_name,prod_unit_type,nml_unit,htl_unit,spl_unit,ang_unit FROM somanath.products`);
        stockDetails = await response3.json()
        let values2 = ''
        db.transaction(tx => {tx.executeSql('CREATE TABLE IF NOT EXISTS products (prod_id INTEGER,prod_name TEXT,prod_unit_type TEXT,nml_unit TEXT,htl_unit TEXT,spl_unit TEXT,ang_unit TEXT)', null,null,null)})
        stockDetails.forEach(element => values2 += '('+element.prod_id+',"'+element.prod_name+'","'+element.prod_unit_type+'","'+element.nml_unit+'","'+element.htl_unit+'","'+element.spl_unit+'","'+element.ang_unit+'"),');
        db.transaction(tx => {tx.executeSql('DELETE FROM products')})
        db.transaction(tx => {tx.executeSql(`INSERT INTO products values ${values2.slice(0,-1)}`, null,() =>setRefreshing(false),null)})
        } catch (error){
            Alert.alert("Offline","Connect To Somanath WIFI ,"+error)
      }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getDb();
      }, []);

      useEffect(() => {
        setReady(false)
        dispatch(fetchName()).then(()=>{setReady(true);}).catch(()=>{setReady(false);});
    }, [true])

    const allCustomer = useSelector(state => state.productName.productName);
    
    if(ready && !refreshing && online)
    {
    if(allCustomer.length>0 && online){
    return(
        <ScrollView 
        refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
         >
            {/* <Card 
                title = "ಬಾರಕೋಡ್ ಪ್ರಿಂಟ್"
                uri = {require('E:/Hosangadi2.0MobileApp/Hosanagadi/images/barcodePrint.jpeg')}
                onViewDetail = {()=>isWifiConnected('barcodePrint')} 
                /> */}
            <Card 
                title = "ಐಟೆಮ್ ರೇಟ್"
                onViewDetail = {()=>props.navigation.navigate('priceCheck')} 
                />
            {/* <Card 
                title = "ಬಿಲ್ WhatsApp ಮಾಡುಕೆ"
                uri = {require('E:/Hosangadi2.0MobileApp/Hosanagadi/images/invoice.jpeg')}
                onViewDetail = {()=>isWifiConnected('sendBill')} 
                />
         */}
        </ScrollView>
    )}
    else{ 
        return(
        <View>
            <Card 
                title = "ಐಟೆಮ್ ರೇಟ್"
                onViewDetail = {()=>props.navigation.navigate('priceCheck')} 
                />
        </View>
        )
    }
    }
    else{
            return(
            <View>
                <Card 
                    title = "ಐಟೆಮ್ ರೇಟ್"
                    onViewDetail = {()=>props.navigation.navigate('priceCheck')} 
                    />
            </View>
            )
      
    }

}

export default Menu;
