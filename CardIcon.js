import React from 'react'
import { Image, StyleSheet } from 'react-native'
import cardValidator from 'card-validator'

const VISA = require('./assests/visa.png')
const MASTERCARD = require('./assests/mastercard.png')
const AMEX = require('./assests/amex.png')
const DISCOVER = require('./assests/discover.png')



const CardIcon = (props) => {
  const { cardNumber } = props
  const { card } = cardValidator.number(cardNumber)

  let source
  switch (card?.type) {
    case 'visa':
      source = VISA
      break
    case 'mastercard':
      source = MASTERCARD
      break
    case 'discover':
      source = DISCOVER
      break
    case 'american-express':
      source = AMEX
      break
    default:
      break
  }

  if (!source) return null

  return <Image style={styles.image} source={source} />
}

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
  },
})

export default CardIcon