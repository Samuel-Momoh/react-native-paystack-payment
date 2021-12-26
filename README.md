
# react-native-paystack-payment
[![NPM](https://img.shields.io/npm/v/react-native-paystack-payment.svg)](https://www.npmjs.com/package/react-date-time-formatter) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) ![react-native-paystack-paymentis released under the MIT license.](https://img.shields.io/badge/license-MIT-blue.svg) ![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

> A React native library for integrating paystack directly into react-native apps without popup or webview. Using this library lift the burden of PCI compliance by helping you send credit cards directly to paystack servers. This library embodied's processing, validating and verifying payment transactions.

## Demo

<div style="display:flex;flex-direction: row; justify-contents: center ">
<image src="./demo/Screenshot_20211224-150520.png" style="width: 15%; height: 15%; margin-right:5px" alt="demo" />
<image src="./demo/Screenshot_20211224-144016.png" style="width: 15%; height: 15%; margin-right:5px" alt="demo" />
<image src="./demo/Screenshot_20211224-150603.png" style="width: 15%; height: 15%; margin-right:5px" alt="demo" />
<image src="./demo/Screenshot_20211224-150718.png" style="width: 15%; height: 15%; margin-right:5px" alt="demo" />
<image src="./demo/Screenshot_20211224-150616.png" style="width: 15%; height: 15%; margin-right:5px" alt="demo" />
</div>
## Getting started
---

`$ npm install react-native-paystack-payment --save`

### Mostly automatic installation

`$ react-native link react-native-paystack-payment`


### Manual installation

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.paystacknative.RNPaystackPaymentPackage;` to the imports at the top of the file
  - Add `new RNPaystackPaymentPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-paystack-payment'
  	project(':react-native-paystack-payment').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-paystack-payment/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-paystack-payment')
  	```


#### iOS ( IN VIEW )

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-paystack-payment` and add `RNPaystackPayment.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNPaystackPayment.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<



<!-- #### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNPaystackPayment.sln` in `node_modules/react-native-paystack-payment/windows/RNPaystackPayment.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Paystack.Payment.RNPaystackPayment;` to the usings at the top of the file
  - Add `new RNPaystackPaymentPackage()` to the `List<IReactPackage>` returned by the `Packages` method -->


## Usage
---
## Configure Paystack credentials

To allow Paystack  to use the credentials, the paystackServices file must be added to the project. This requires modification to app.json in the Project directory.

1. Create a `paystackServices.json` file and add the following
```javascript
{
    
    "public_key":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "secret_key":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```
*In subsiquent update feature like logo, organisation name etc will be added to this file.*

2. Open `app.json` file and add the following
```javascript
{
  "name": "paystacknative",
  "displayName": "paystacknative",
  "paystackServices":"paystackconfig.json" // path to `paystackServices.json` file
}
```
Now you can go ahead and build your app.

Note: *`paystackServices` is a key and must match what is in your `app.json` file. If any of this requirement is not fufiled or file not found app will throw error during build*

## Basic Usage
```jsx
import RNPaystackPayment from 'react-native-paystack-payment'

const App = () => {
 

  return (
   <View>
    < RNPaystackPayment
    email='customer@exmple.com'
    amount={1000}
    onError={(error)=>{
      console.log(error) // Developer related error
    }}
    onSuccess={(data)=>{
      console.log(data) // Datas after payment verification from paysatck
    }}
    />
   </View>
  );
};
...
```
Oh! wait is that it, yes oooo! :)
## Props

| Property               | Required                  | Type | Description                                                                                                                                                                                                                                                                                       |
| ---------------------- | ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| email           | true                  | String              | Email address of customer                                                                                                                                                                                                                                             |
| amount                | true                   | Integer               | Amount  you are debiting customer.                                                                                                                                                                                                                                                         |
| reference            | Optional                  | String               | Unique case sensitive transaction reference. Only -,., =and alphanumeric characters allowed. If you do not pass this parameter, Paystack will generate a unique reference for you.                                                                                                                                                                                                                                                    |
| currency               | Optional                    | String               | Currency charge should be performed in. Allowed values are: NGN, GHS, ZAR or USD It defaults to your integration currency.                                                                                                                                                                                                                                 |
| subaccount      | Optional                     | String               | The code for the subaccount that owns the payment. e.g. ACCT_8f4s1eq7ml6rlzj                                                                                                                                                                                                                                                                         |
| transaction_charge               | Optional                    | Integer               | A flat fee to charge the subaccount for this transaction (in kobo, pesewas or cents). This overrides the split percentage set when the subaccount was created. Ideally, you will need to use this if you are splitting in flat rates (since subaccount creation only allows for percentage split).                                                                                                                                                                                                                          |
| bearer               | Optional                   | String               | Decide who will bear Paystack transaction charges between account and subaccount. Defaults to account.                                                                                                                                                                                                                 |
| onError          | Optional                   | Function               | Javascript function that is called if error from developer script is encountered like invalid secret key etc. This function return error as object                                                                                                                                                               |
| onSuccess        | Optional                    | Function               | Function that runs when payment is successful. This should ideally be a script that  accept props after plugin query Paystack verification API to check the status of the transaction.This function return error as  object
## Result Sample

```javascript
{"data": {"amount": 100000, "authorization": {"account_name": null, "authorization_code": "AUTH_80rp9154te", "bank": "TEST BANK", "bin": "408408", "brand": "visa", "card_type": "visa ", "channel": "card", "country_code": "NG", "exp_month": "12", "exp_year": "2022", "last4": "4081", "reusable": true, "signature": "SIG_AddUcji3MexpHUi90yXN"}, "channel": "card", "createdAt": "2021-12-24T12:18:58.000Z", "created_at": "2021-12-24T12:18:58.000Z", "currency": "NGN", "customer": {"customer_code": "CUS_guap9c5lutdhn97", "email": "customer@exmple.com", "first_name": null, "id": 65139299, "international_format_phone": null, "last_name": null, "metadata": null, "phone": null, "risk_action": "default"}, "domain": "test", "fees": 1500, "fees_breakdown": null, "fees_split": null, "gateway_response": "Approved", "id": 1525072096, "ip_address": null, "log": null, "message": null, "metadata": 0, "order_id": null, "paidAt": "2021-12-24T12:18:58.000Z", "paid_at": "2021-12-24T12:18:58.000Z", "plan": null, "plan_object": {}, "pos_transaction_data": null, "reference": "trx_xoli2yoa", "requested_amount": null, "source": null, "split": {}, "status": "success", "subaccount": {}, "transaction_date": "2021-12-24T12:18:58.000Z"}, "message": "Verification successful", "status": true}
```

Visit [Paystack](https://paystack.com/docs/payments/test-payments/) to get test cards for transaction, this library support all cards listed on paystack website

## Contribution

If this project help you reduce time to develop, you can give this project a star :)

## License

[MIT](./LICENSE)                                                                                                                                                                                               |
