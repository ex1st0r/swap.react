import React, { Component, Fragment } from 'react'

import actions from 'redux/actions'

import { links } from 'helpers'
import { Link } from 'react-router-dom'

import cssModules from 'react-css-modules'
import styles from './ConfirmOffer.scss'

import ButtonsInRow from 'components/controls/ButtonsInRow/ButtonsInRow'
import Button from 'components/controls/Button/Button'
import Coins from 'components/Coins/Coins'

import Amounts from './Amounts/Amounts'
import ExchangeRate from './ExchangeRate/ExchangeRate'
import Fee from './Fee/Fee'
import { connect } from 'redaction'


@connect(({ currencies: { items: currencies } }) => ({
  currencies,
}))
@cssModules(styles)
export default class ConfirmOffer extends Component {

  handleConfirm = () => {
    this.createOrder()
    actions.modals.close('OfferModal')
  }

  createOrder = () => {
    const { offer: { buyAmount, sellAmount, buyCurrency, sellCurrency, exchangeRate } } = this.props

    const data = {
      buyCurrency: `${buyCurrency}`,
      sellCurrency: `${sellCurrency}`,
      buyAmount: Number(buyAmount),
      sellAmount: Number(sellAmount),
      exchangeRate: Number(exchangeRate),
    }
    actions.analytics.dataEvent('orderbook-addoffer-click-confirm-button')
    actions.core.createOrder(data)
  }

  render() {
    const { offer: { buyAmount, sellAmount, buyCurrency, sellCurrency, exchangeRate }, onBack, currencies } = this.props

    const buy = currencies.find((el) => el.value === buyCurrency)
    const sell = currencies.find((el) => el.value === sellCurrency)

    return (
      <Fragment>
        <Coins styleName="coins" names={[ buyCurrency, sellCurrency ]} size={100} />
        <Amounts {...{ buyAmount, sellAmount, buyCurrency, sellCurrency }} />
        <ExchangeRate {...{ value: exchangeRate, buyCurrency, sellCurrency }} />
        <Fee amount={0.0001} currency={sellCurrency} />
        <ButtonsInRow styleName="buttonsInRow">
          <Button styleName="button" gray onClick={onBack}>Back</Button>
          <Link styleName="link" to={`${links.home}${buy.fullTitle}-to-${sell.fullTitle}`}>
            <Button styleName="button" id="confirm" brand onClick={this.handleConfirm} >Add</Button>
          </Link>
        </ButtonsInRow>
      </Fragment>
    )
  }
}
