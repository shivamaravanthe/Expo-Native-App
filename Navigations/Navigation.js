import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import Menu from '../screens/homeScreen';
import priceCheck from '../screens/priceCheck';
import barcodePrint from '../screens/barcodePrint';
import sendBill from '../screens/sendBill'
const MainNavigator = createStackNavigator({
    homePage : {
        screen : Menu,
        navigationOptions:{
            title : "Menu",
            headerLeft: ()=> null
        }
    },
    priceCheck : {
        screen : priceCheck,
        navigationOptions:{
          title : "Check Price"
        }
    },
    barcodePrint : {
        screen : barcodePrint,
        navigationOptions:{
          title : "Print Barcode"
        }
    },
    sendBill : {
        screen : sendBill,
        navigationOptions:{
          title : "Send Bill on WhatsApp"
        }
    },
    

})

export default createAppContainer(MainNavigator);