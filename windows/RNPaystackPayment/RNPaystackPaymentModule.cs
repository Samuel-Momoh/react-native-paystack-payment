using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Paystack.Payment.RNPaystackPayment
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNPaystackPaymentModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNPaystackPaymentModule"/>.
        /// </summary>
        internal RNPaystackPaymentModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNPaystackPayment";
            }
        }
    }
}
