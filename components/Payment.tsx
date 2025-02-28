import { useAuth } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { PaymentProps } from "@/types/type";

const Payment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState(false)

  const confirmHandler = async (
    paymentMethod,
    _,
    intentCreationCallback,
  ) => {
    const { paymentIntent, customer } = await fetchAPI('/(api)/(stripe)/(create)', {method: "POST",
        headers: {"Content-Type": "application/json",}, body: JSON.stringify({})
    });
    const { clientSecret, error } = await Response.json();
    if (clientSecret) {
        intentCreationCallback({clientSecret})
    } else {
        intentCreationCallback({error})
    }

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      intentConfiguration: {
        mode: {
          amount: 1099,
          currencyCode: "USD",
        },
        confirmHandler: confirmHandler,
      },
    });
    if (error) {
      // handle error
    }
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />
    </>
  );
};

export default Payment;
