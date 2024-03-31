import React, { useCallback,useState } from "react";
import { Alert, Keyboard, Linking, StyleSheet, View ,TouchableOpacity ,Text, TextInput, Button} from "react-native";
import * as MediaLibrary from 'expo-media-library';
import { downloadToFolder } from 'expo-file-dl';
import Icon from 'react-native-vector-icons/FontAwesome';


const sendBill = () => {
    const [billNumber,setBillNumber] = useState('')
    const [custName, setCustName] = useState('')
    const requestPermission = async (bill,supported,url) => {

      try {
            const perm = await MediaLibrary.requestPermissionsAsync()
            if (perm.status != 'granted') {
              return;
            }
            let dbYear
            let billNumber
            if(bill.split(' ').length == 2)
            {
              billNumber = bill.split(' ')[1]
              dbYear  = bill.split(' ')[0]
              if(year < 23 && month < 4) dbYear = 21
              else if(month < 4) dbYear -= 1
            }
            else{
            billNumber = bill
            const d = new Date()
            const year = String(d.getFullYear()).slice(2);
            const month = d.getMonth();
            dbYear = year
            if(year < 23 && month < 4) dbYear = 21
            else if(month < 4) dbYear -= 1
            }
            const response = await fetch(`http://192.168.0.111:7000/onlySql?sql=SELECT acc_name,acc_mob1 FROM somanath20${dbYear}.sales,somanath.accounts where sales_id ='${dbYear}_${billNumber}' and acc_id = sales_acc`);
            let check = await response.json()
            if(check.length>0){
              if(check[0].acc_mob1.length==10){
                url += `?phone=+91${check[0].acc_mob1}`
              }
              else{
                url = 'whatsapp://send?phone=+919902664717'
              }
              await downloadToFolder(
                'http://192.168.0.111:7000/billOnly?billNumber='+billNumber+'&dbYear='+dbYear,
                 billNumber+'_Invoice.pdf',
                'Documents',
                "DownloadInfo",
                { notificationType: { notification: "none" }}
              );
              if (supported) {
                Keyboard.dismiss()
                await Linking.openURL(url);
              }
              else{
                Alert.alert('Install WhatsApp');
              }
            }
            else{
              Alert.alert('Enter Correct Bill Number');
            }
          }
      catch(error)
      {Alert.alert("Offline","Connect To Somanath WIFI")}

    }


    const supportedURL = "whatsapp://send";
    function OpenURLButton({ url }) {
    
    const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);
      await requestPermission(billNumber, supported, url);
    }, [url]);
    return (
      <Icon.Button name="whatsapp" onPress={handlePress} backgroundColor="#25d366" >
        <Text style={styles.whatsapp}>
          WhatsApp
        </Text>
      </Icon.Button>
    );
  }

  const check = async () =>{
            let bill = billNumber
            let dbYear
            let billNumTemp
            if(bill.split(' ').length == 2)
            {
              billNumTemp = bill.split(' ')[1]
              dbYear  = bill.split(' ')[0]
            }
            else{
            billNumTemp = bill
            const d = new Date()
            const year = String(d.getFullYear()).slice(2);
            const month = d.getMonth();
            dbYear = year
            if(year < 23 && month < 4) dbYear = 21
            else if(month < 4) dbYear -= 1
            }

    try
    {
      const response = await fetch(`http://192.168.0.111:7000/onlySql?sql=SELECT acc_name,acc_mob1 FROM somanath20${dbYear}.sales,somanath.accounts where sales_id ='${dbYear}_${billNumTemp}' and acc_id = sales_acc`);
      let check = await response.json()
      if(check.length>0){
        setCustName(check)
        if(check[0].acc_mob1.length==0){
          Alert.alert('No Mobile Number',`${check[0].acc_name} Mobile Number is Not Available`)
        }
      }
      else{
        setCustName('Wrong Bill Number')
      }
    }catch(error){
      Alert.alert("Offline","Connect To Somanath WIFI") 
    }
  }

  return (
    <View style={styles.container}>
      <Text style = {{fontSize:20}}>{custName =='Wrong Bill Number' || custName =='' ?   custName : custName[0]['acc_name']}</Text>
      <TextInput
                selectTextOnFocus={true}
                placeholder='Bill Number'
                keyboardType="number-pad"
                style = {styles.Name}
                value = {billNumber}
                onChangeText = {e=> setBillNumber(e)}
                />
      <View style={styles.Button}>
          <TouchableOpacity onPress={check}>
            <Text style = {styles.check}>Check</Text>
          </TouchableOpacity>

          <OpenURLButton url={supportedURL} >New Number</OpenURLButton>
      </View>
      
    </View>

  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    width:'100%',
    justifyContent: 'space-between',
    alignItems: "center",
    maxHeight:'50%'
  }, 
  Name : {
    fontSize : 22,
    borderWidth:1,
    paddingLeft : 5,
    height : '30%',
    minWidth : '90%', 
    borderRadius : 5,
    borderColor : 'black',
  },
  check : {
    fontSize:20,
    color:'white'
    ,backgroundColor:'black',
    borderRadius:15,
    paddingHorizontal:25,
    paddingVertical:9,
    marginRight:15
  },
  whatsapp : {
    fontSize: 20, 
    color: 'white'
  },
  Button:{
    flex : 1,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems : 'center',
    maxHeight: '20%'
  }
});

export default sendBill;
