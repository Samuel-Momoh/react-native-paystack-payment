
package com.rnpaystack;

import android.app.Activity;
import android.util.Log;
import java.util.Map;

import javax.crypto.SecretKey;

import java.util.HashMap;

import co.paystack.android.Paystack;
import co.paystack.android.PaystackSdk;
import co.paystack.android.Transaction;
import co.paystack.android.model.Card;
import co.paystack.android.model.Charge;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;


public class RNPaystackPaymentModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  protected Card card;
  protected Charge charge;
  private Promise pendingPromise;
  public RNPaystackPaymentModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    PaystackSdk.initialize(reactContext);
  }

  @ReactMethod
  public void createPayment(
          int amount,
          String email,
          String panNum,
          String cvv,
          int expireMonth,
          int expireYear,
          String currency,
          String reference,
          String subaccount,
          int transaction_charge,
          String bearer,
          final Promise promise) {

//       Initialize paystack
      PaystackSdk.setPublicKey(BuildConfig.PUBLIC_KEY);

//Initialize card details
       card = new Card(panNum, expireMonth, expireYear, cvv);

// Initialize Charge parameter
      charge = new Charge();
      charge.setAmount(amount);
      charge.setEmail(email);

      //        Setting Optional payment option
      if(!isEmptyString(currency)){
          charge.setCurrency(currency);
      }
      if(!isEmptyString(reference)){
          charge.setReference(reference);
      }
      if(!isEmptyString(subaccount)){
          charge.setSubaccount(subaccount);
      }
      if(!isEmptyInt(transaction_charge)){
          charge.setTransactionCharge(transaction_charge);
      }
      if(!isEmptyString(bearer)){
          charge.setBearer(Charge.Bearer.valueOf(bearer));
      }
      charge.setCard(card);

      this.pendingPromise = promise;
//
      if (card != null && card.isValid()) {
          try {
              performCharge(charge);
          } catch (Exception error) {
              rejectPromise("CHARGE_ERROR", error.getMessage());
          }
      }else{
          rejectPromise("Card_is_InValid", "Invalid Card Details Provided");
      }

  }
  private void performCharge(Charge charge){
//       Get current Activity
      Activity currentActivity = getCurrentActivity();
//        Initiate Paystack Charge on Card
      PaystackSdk.chargeCard(currentActivity, charge, new Paystack.TransactionCallback() {
          @Override
          public void onSuccess(Transaction transaction) {

              WritableMap map = Arguments.createMap();
              map.putString("reference", transaction.getReference());

              resolvePromise(map);
          }

          @Override
          public void beforeValidate(Transaction transaction) {

              WritableMap map = Arguments.createMap();
              map.putString("reference", transaction.getReference());

            //   resolvePromise(map);

          }

          @Override
          public void onError(Throwable error, Transaction transaction) {
              rejectPromise("TRANSACTION_ERROR", error.getMessage());
          }

      });


  }
//Check if String parameter is empty
  private boolean isEmptyString(String s) {
      return s == null || s.length() < 1;
  }
  //Check if String parameter is empty
  private boolean isEmptyInt(int i) {
      return   i == 0;
  }

  private void rejectPromise(String code, String message) {
      if (this.pendingPromise != null) {
          this.pendingPromise.reject(code, message);
          this.pendingPromise = null;
      }
  }

  private void resolvePromise(Object data) {
      if (this.pendingPromise != null) {
          this.pendingPromise.resolve(data);
          this.pendingPromise = null;
      }
  }
  
    @Override
    public Map<String, Object> getConstants() {
      final Map<String, Object> constants= new HashMap<>();
      constants.put("secret_key", BuildConfig.SECRET_KEY);
      return constants;
    }
  @Override
  public String getName() {
    return "RNPaystackPayment";
  }
}