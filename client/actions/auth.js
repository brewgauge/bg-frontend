'use strict'

import {push} from 'react-router-redux'

export function login (user, pass) {
  return (dispatch) => {
    dispatch({type: 'LOGIN_REQUEST'})

    if (user === 'admin@metalman.ie' & pass === 'pass') {
      dispatch({type: 'LOGIN_RESPONSE', isLoggedIn: true})
      dispatch(push('/'))

    } else {
      dispatch({type: 'LOGOUT_RESPONSE', isLoggedIn: false})
      dispatch(push('/login'))
    }
  }
}

export function logout () {
  return (dispatch) => {
    dispatch({type: 'LOGOUT_REQUEST'})
  }
}
