'use strict'

import {
  SENSOR_SUBSCRIBE,
    SENSOR_UPDATE,
  SENSOR_UNSUBSCRIBE
} from '../actions/sensor'

const subState = {
  isSubscribing: true,
  isSubscribed: false,
  data: {}
}

export default function sensor (state = subState, action) {
  switch (action.type) {
    case SENSOR_SUBSCRIBE:
      return Object.assign({}, state, {
        isSubscribing: true,
        isSubscribed: false,
        data: {}
      })

    case SENSOR_UPDATE:
      return Object.assign({}, state, {
        isSubscribing: false,
        isSubscribed: true,
        data: action.data
      })

    case SENSOR_UNSUBSCRIBE:
      return Object.assign({}, state, {
        isSubscribing: false,
        isSubscribed: false,
        data: {}
      })

    default:
      return state
  }
}
