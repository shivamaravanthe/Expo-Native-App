import { GET_DATA_PRODUCT } from "../actions/getData"

const initialState = {
    productName : []
}
export default (state = initialState,action)=>{
    
    switch(action.type){
        case GET_DATA_PRODUCT:
            return{  productName :  action.prodName }
            default:
                return state
    }
}