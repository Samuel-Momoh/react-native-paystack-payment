import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView,View,TextInput,Dimensions,Image,ActivityIndicator,TouchableOpacity } from 'react-native';
import PropTypes from "prop-types"
import {cardNumberFormatter,expirationDateFormatter,cvvFormatter,currencyFormatter } from "./formatters";
import CardIcon from "./CardIcon";
import cardValidator from 'card-validator';
import creditCardType from "credit-card-type";
import FlashMessage,{showMessage} from 'react-native-flash-message';
import  PaystackModule from './PaystackModule';


creditCardType.updateCard(creditCardType.types.MASTERCARD, {
  lengths: [13, 16, 20],
});

const {width} = Dimensions.get('screen')
const conInputWith = (85 * width)  / 100
const RNPaystackPayment = (props) => {
// Get secret key from native
  const secretKey = PaystackModule.getConstants().secret_key

  var onSuccess = (data) => {
    return renderSucessFunc(data)
  }
  var onError = (data) => {
    return renderErrorFunc(data)
  }
  const {email,amount,reference,currency,subaccount,transaction_charge,bearer,onError:renderErrorFunc,onSuccess:renderSucessFunc} =  props
  /**
   * Returns null if any of the three require props is not fufil this entails a the component will not render
   */

  if(!email){
    onError("Customer email address must be pass")
    return null
  }
  if(typeof email !== "string"){
    onError("Customer email address must be an string")
    return null
  }
  if(!amount){
    onError("The require charge amount must be pass")
    return null
  }
  if(typeof amount !== "number"){
    onError("The require charge amount must be a number")
    return null
  }
  if(typeof currency !== "string"){
    onError("The require curreny must be a string")
    return null
  }


const [PanNum, setPanNum] = useState('')
const [expire, setexpire] = useState('')
const [cvv, setcvv] = useState('')
const [PanNumError, setPanNumError] = useState(false)
const [expireError, setexpireError] = useState(false)
const [cvvError, setcvvError] = useState(false)
const [isLoading, setisLoading] = useState(false)
const [isSucessfull, setisSucessfull] = useState(false)
const [transreference, setTransreference] = useState(null)


   /**
    * 
    * @param {*} value 
    * Card number validator
    */
 const validateCardNum = (value) =>{
   let cleanVal = value.replace(/ /g,'');
 var cardNum = cardValidator.number(cleanVal)
 if(!cardNum.isPotentiallyValid){
  setPanNumError(true)
 }else{
  setPanNumError(false)
 }
}
/**
 * 
 * @param {*} value 
 * Card cvv number validator
 */
 const validateCardCvv = (value) =>{
 var cardNum = cardValidator.cvv(value)
 if(!cardNum.isPotentiallyValid){
  setcvvError(true)
 }else{
  setcvvError(false)
 }

}
/**
 * 
 * @param {*} value 
 * Card expiration data validator
 */
 const validateCardDate = (value) =>{
 var cardNum = cardValidator.expirationDate(value,4)
 if(!cardNum.isPotentiallyValid){
  setexpireError(true)
 }else{
  setexpireError(false)
 }
}
/**
 * 
 * @param {*} transactionId 
 * Verify payment after processing transaction
 */
const VerifyPayment = async (transactionId) => {
  let response = await fetch(`https://api.paystack.co/transaction/verify/${transactionId}`,{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`
    }
  });
  let data = await response.json();
if(response.status == 200){
// Check if payment verification was successfull 
  if(data.status){
 // Sent transaction data to developer
    onSuccess(data)
    setTransreference(transactionId)
    setisLoading(false)
    setisSucessfull(true)
  }else{
    setisLoading(false)
  }
}else{
  setisLoading(false)
// Send Error message to Developer to show invalid key
if(data.message !== "Invalid key"){
  // Send User genereted error message
showMessage({
  message:"Verification Error",
  description: data.message,
  type:'danger',
  icon:'danger',
  duration:2000
})
}else{
  showMessage({
    message:"Developer Error",
    description:`Contact service provided`,
    type:'danger',
    icon:'danger',
    duration:2000
  })
  onError(data)
}

}
};
/**
 * On user click payment button
 */
var onsubmit = async () =>{
    // Set loading True to get spinner running
    setisLoading(true)
  if(PanNum !=='' && !PanNumError && expire !=='' && !expireError && cvv !== '' && !cvvError){
  let cleanDate = expire.split('/');
  let cleanpanNum = PanNum.replace(/ /g,'')
  let cleanAmount = currency? currencyFormatter(currency,amount).amount: amount * 100;
  let cleanCurrency = currency? currencyFormatter(currency,amount).cur:  currency;
// Process Payment
try {
  const performCharge = await PaystackModule.createPayment(
    cleanAmount, // Amount 
    email, // Email of customer 
    cleanpanNum, // Card pan Number
    cvv, // Card cvv number
    parseInt(cleanDate[0]), // month of card expiration 
    parseInt(cleanDate[1]), // Year of card Expiration 
    cleanCurrency, // Currency
    reference, // Transaction reference 
    subaccount, // sub account for the transaction charge
    transaction_charge, // transaction_charge 
    bearer // bearer of charges if provided subaccount must be provided and transaction_charge
  );
  VerifyPayment(performCharge.reference)
} catch (e) {
  // Stop loading and display error message
  setisLoading(false)
// Display error message to developer
if(e.message !=='Invalid Public Key'){
  showMessage({
    message:"Payment Error",
    description: e.message,
    type:'danger',
    icon:'danger',
    duration:2000
  })
}else{
  showMessage({
    message:"Developer Error",
    description:`Contact service provided`,
    type:'danger',
    icon:'danger',
    duration:2000
  })
  onError(e)
}

}

  }else{
   setisLoading(false)
   showMessage({
     message:"Validation Error",
     description:"One or more input is invalid",
     type:'danger',
     icon:'danger',
     duration:2000
   })
  }
}

  return (
    <ScrollView contentContainerStyle={styles.content}>

      <View style={styles.CardTop}>

<View style={styles.imageTop} >
<Image source={require("./assests/IMG_20211220_140254_449.jpg")} style={{height: 40, width: 40}}/>
</View>

<View>
<Text style={styles.initialDetailsEmail}>customer@example.com</Text>
<View style={styles.initialDetailsAmount}>
<Text style={styles.payText}>{!isSucessfull? "Pay":"Paid"}</Text>
<Text style={styles.payAmount}>{currency? currencyFormatter(currency,amount).cur: "NGN" } {amount}</Text>
</View>
</View>
</View>

 {  
 !isSucessfull?
 <View style={styles.cardDetails} >

      <View style={styles.paymentHeader}>
        <Text style={styles.title}>Enter your card details to Pay</Text>
      </View>

            <View style={styles.cardForm}>

              {/* Card Number Input */}
                <View style={styles.cardInputCon}>
                <Text style={styles.cardInputHead}>Card Number</Text>
                  <View style={{...styles.InputCon, borderColor:PanNumError? 'red':'#ddd'}}>
                    <TextInput 
                    style={styles.cardInput} 
                    placeholder='0000 0000 0000 0000' 
                    keyboardType='number-pad'
                    value={PanNum}
                    onChangeText={(value)=>{
                      validateCardNum(value)
                      setPanNum(cardNumberFormatter(PanNum,value))
                      
                    }}
                    />
                    <CardIcon cardNumber={PanNum} />
                  </View>
                {PanNumError && <Text style={styles.error}>Invalid Card Details Supplied</Text>}
                </View>

                <View style={styles.cardInputConSub}>
              {/* Card Expire Date Input */}
              <View style={styles.subInputCon}>
                <Text style={styles.cardInputHead}>EXPIRY</Text>
                  <View style={{...styles.InputConSub, borderColor:expireError? 'red':'#ddd'}}>
                    <TextInput  style={styles.cardInputSub}
                     keyboardType='number-pad'
                    placeholder='MM/YY' 
                    value={expire}
                    onChangeText={(value)=>{
                      validateCardDate(expire)
                      setexpire(expirationDateFormatter(expire,value))
                     
                    }}
                    />
                  </View>
                { expireError && <Text style={styles.error}>Invalid Expiry Date</Text>}
                </View>
                        {/* Card CVV Input */}
                <View style={styles.subInputCon}>
                <Text style={styles.cardInputHead}>CVV</Text>
                  <View style={{...styles.InputConSub, borderColor:cvvError? 'red':'#ddd'}}>
                    <TextInput  style={styles.cardInputSub}
                    keyboardType='number-pad'
                    placeholder="000"
                    value={cvv}
                    onChangeText={(value)=>{
                      validateCardCvv(cvv)
                      setcvv(cvvFormatter(cvv,value))
                      
                    }}
                    />
                  </View>
              {cvvError && <Text style={styles.error}>Invalid Card CVV</Text>}
                </View>
                </View>
                {/* Pay Now Button */}
                <TouchableOpacity 
                style={styles.payNowBtn}
                 onPress={isLoading? null : onsubmit}
                disabled={isLoading}
                 >
               {
                 isLoading?
                <ActivityIndicator size='large' color='#fff'  />
                :
                <Text style={{color:'#fff',fontWeight:"bold"}}>Pay {currency? currencyFormatter(currency,amount).cur: "NGN" } {amount}</Text>
                
                }
             
                </TouchableOpacity>
            {/* Paystack Brand */}
                <View style={styles.secured}>
              <Text style={styles.securedText} >Secured By</Text>
              <Image source={require("./assests/IMG_20211220_140340_294.jpg")} style={{height: 30, width: 100}} />
                </View>
            </View>
            </View>
            :
            <View style={styles.sucessFull}>
              <View style={styles.sucessFullHead}>
                <Image source={require('./assests/thank-you.png')} style={{width:100,height:100}} />
                <Text style={styles.sucessFullHeadText}>Payment</Text>
                  <Text style={styles.sucessFullHeadText}>Successfull</Text>
                  </View>
                    <View style={styles.sucessFullBottom}>
                    <Text style={styles.sucessFullBottomText}>Your transaction reference is</Text>
                    <Text style={styles.sucessFullBottomText}>{transreference? transreference : null}</Text>
                    </View>
            </View>}
          <FlashMessage position="top" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    display:'flex',
    alignItems:'center',
    paddingTop: 20,
    paddingBottom:20,
    paddingHorizontal: 36,
    backgroundColor:'#fff',
    minHeight:520
  },

  CardTop:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    width:conInputWith,
    paddingBottom:5
    
  },
  initialDetailsAmount:{
display:'flex',
flexDirection:'row',
alignSelf:'flex-end'
  },
  payText:{
fontWeight:"bold",
color:'#3bb75e',
marginRight:6
  },
  payAmount:{
    fontWeight: "bold",
    color:'#3bb75e'
  },
  paymentHeader:{
display:'flex',
alignItems:'center',
width:conInputWith,
marginTop:30,
marginBottom:30,
  },

  title: {
    fontFamily: 'Avenir-Heavy',
    color: 'black',
    fontSize: 15,
    textAlign:'center',
    fontWeight:"500",
    marginBottom: 26,
  },

  cardInputCon:{
width:conInputWith,
  },
  cardInputHead:{
    fontWeight:"bold",
    color:'grey'
  },
  InputCon:{
    marginTop:2,
    borderWidth:1,
    padding:8,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  cardInput:{
   width: conInputWith - 67,
   fontSize:16
  },
  error:{
    color:'red'
  },
  cardInputConSub:{
    marginTop:10,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    width:conInputWith,
  },
  InputConSub:{
    marginTop:2,
    borderWidth:1,
    padding:8,
  },
  cardInputSub:{
    width: (conInputWith - 67) /2,
    height:50,
    padding:8,
    fontSize:16
   },
   payNowBtn:{
     marginTop: 15,
     height:55,
     width:conInputWith,
     backgroundColor:'#3bb75e',
     display:'flex',
     justifyContent:'center',
     alignItems:'center',
     borderRadius:5,
     elevation:2
   },
   secured:{
    marginTop: 4,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    width:conInputWith,


   },
   securedText:{
    fontWeight:"500",
    textAlign:'center',
   },
   initialDetailsEmail:{
     color:'grey'
   },
  

   sucessFull:{
     flex:1,
     alignItems:'center',
     justifyContent:'center'
   },
   sucessFullHead:{
     marginBottom:10,
     display:'flex',
     alignItems:'center'
   },
   sucessFullHeadText:{
     color:'#3bb75e',
     fontSize:30,
     textAlign:'center',
     fontWeight:"600"
   },
   sucessFullBottom:{
     display:'flex',
     alignItems:'center',
   },
   sucessFullBottomText:{
     fontSize:16
   }
});

export default RNPaystackPayment;

RNPaystackPayment.defaultProps = {

  /** 
   * Assign default props to customer email
   */
  email: null,
  /*
 * Assign default props t payment amount
 */
  amount: 0,
 /**
  * Assign default props to transaction reference
  */
  reference: null,
/**
 * Assign default props to transaction reference
 */
  currency: null,
  /**
   * Assign default props to transaction currency
   */
   subaccount: null,
  /**
   * Assign default props to  transaction_charge
   */
   transaction_charge: 0,
  /**
   * Assign default props to  charge bearer
   */
   bearer: null,

}


RNPaystackPayment.propTypes = {

 /** 
   * Assign props type to customer email
   */
  email: PropTypes.string.isRequired,
  /*
 * Assign  props type to payment amount
 */
  amount: PropTypes.number.isRequired,
 /**
  * Assign  props type to transaction reference
  */
  reference: PropTypes.string,
/**
 * Assign  props type to transaction reference
 */
  currency: PropTypes.string,
  /**
   * Assign  props type to transaction currency
   */
   subaccount: PropTypes.string,
  /**
   * Assign  props type to  transaction_charge
   */
   transaction_charge: PropTypes.number,
  /**
   * Assign  props type to  charge bearer
   */
   bearer: PropTypes.string,
  /**
   * Sucess function 
   */
  onSuccess: PropTypes.func,
     /**
   * error function 
   */
    onError: PropTypes.func,
}