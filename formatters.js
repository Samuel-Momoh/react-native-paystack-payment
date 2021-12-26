
export function cardNumberFormatter(
    oldValue,
    newValue,
  ) {
    // user is deleting so return without formatting
    if (oldValue.length > newValue.length) {
      return newValue;
    }
  
    return newValue
      .replace(/\W/gi, '')
      .replace(/(.{4})/g, '$1 ')
      .substring(0, 30);
  }
  
  export function expirationDateFormatter(
    oldValue,
    newValue,
  ) {
    // user is deleting so return without formatting
    if (oldValue.length > newValue.length) {
      return newValue;
    }
  
    return newValue
      .replace(/\W/gi, '')
      .replace(/(.{2})/g, '$1/')
      .substring(0, 5);
  }
  export function cvvFormatter(
    oldValue,
    newValue,
  ) {
    // user is deleting so return without formatting
    if (oldValue.length > newValue.length) {
      return newValue;
    }
  
    return newValue
      .replace(/\W/gi, '')
      .substring(0, 3);
  }
export function currencyFormatter(cur,amount){
  if(cur.toUpperCase() === "GHS"){
    return {
      cur:"GHS",
      amount: parseInt(amount) * 100
    }
  }else if(cur.toUpperCase() === "USD"){
    return {
      cur:"USD",
      amount: parseInt(amount) * 100
    }
  }
  else if(cur.toUpperCase() === "ZAR"){
    return {
      cur:"ZAR",
      amount: parseInt(amount) * 100
    }
  }
  else{
    return {
      cur:"NGN",
      amount: parseInt(amount) * 100
    }
  }
}