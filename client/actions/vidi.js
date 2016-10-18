'use strict'



import {subscribeSocket, unsubscribeSocket} from '../lib/socket'
import _ from 'lodash'

export const SENSOR_SUBSCRIBE = 'SENSOR_SUBSCRIBE'
export const SENSOR_UPDATE = 'SENSOR_UPDATE'
export const SENSOR_UNSUBSCRIBE = 'SENSOR_UNSUBSCRIBE'

export function subscribe (metric) {
  return (dispatch) => {
    const uri = '/api/sensor'

    dispatch({type: SENSOR_SUBSCRIBE})

    subscribeSocket(uri, (msg) => {
      dispatch({type: SENSOR_UPDATE, data: msg})
    })
  }
}

export function unsubscribe (metric) {
  return (dispatch) => {
    const uri = '/api/sensor'

    unsubscribeSocket(uri, () => {
      dispatch({type: SENSOR_UNSUBSCRIBE})
    })
  }
}
