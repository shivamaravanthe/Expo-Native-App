export const GET_DATA_PRODUCT = 'GET_DATA_PRODUCT';

export const getData = (data) => {
    return { type : GET_DATA_PRODUCT ,
             prodName : data 
           }
}

export const fetchName =  () => {

    return async dispatch => {
            try {
              //ip
                const response = await fetch(`http://192.168.0.111:7000/onlySql?sql=select  prod_id,prod_name from somanath.products order by prod_name`)
                const json = await response.json();
                dispatch(getData(json))
              } catch (error){
                throw(error)
              }
    }
}