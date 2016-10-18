'use strict'

var Hapi = require('hapi')
var Inert = require('inert')
var Nes = require('nes')
var Path = require('path')
var Boom = require('boom')
var Domain = require('bg-domain')
var _ = require('lodash')

var server = new Hapi.Server()
server.connection({port: '3000'})
server.realm.settings.files.relativeTo = Path.join(__dirname, '../dist/')

var plugins = [
  {register: Nes},
  {register: Inert}
]

server.register(plugins, (err) => {
  exitIfErr(err)

  server.route(uiRoutes())

  server.start((err) => {
    exitIfErr(err)

    var payload = {
    }

    // connect to the MQTT Broker
    const domain = new Domain({url: 'mqtt://localhost:3040', topic: 'brewgauge'})
    domain.on('connect', () => {
      server.subscription('/api/sensor')

      domain.on('temperature', (msg) => {
        var channel = msg.channel_id
        var board = msg.board_id

        payload[board] = payload[board] || {
          board: board,
          channels: {}
        }

        payload[board].channels[channel] = payload[board].channels[channel] || {
          channel: channel,
          time: [],
          temp: []
        }

        payload[board].channels[channel].time.push(Date.now())
        payload[board].channels[channel].temp.push(msg.temperature)

        _.each(payload, (board) => {
          _.each(board.channels, (channel) => {
            channel.time = _.chunk(channel.time, 60)[0]
            channel.temp = _.chunk(channel.temp, 60)[0]
          })
        })
      })

      setInterval(() => {


        server.publish('/api/sensor', payload)
        console.log(JSON.stringify(payload, null, 2))
      }, 1000)
    })

    console.log('server started on port 3000')
  })
})

function exitIfErr (err) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
}

function uiRoutes () {
  return [
    {
      method: 'GET',
      path: '/css/{path*}',
      handler: {
        directory: {
          path: './css/',
          redirectToSlash: true,
          index: false
        }
      }
    },
    {
      method: 'GET',
      path: '/js/{path*}',
      handler: {
        directory: {
          path: './js/',
          redirectToSlash: true,
          index: false
        }
      }
    },
    {
      method: 'GET',
      path: '/img/{path*}',
      handler: {
        directory: {
          path: './img/',
          redirectToSlash: true,
          index: false
        }
      }
    },
    {
      method: 'GET',
      path: '/{path*}',
      handler: {
        file: {
          path: './index.html'
        }
      }
    }
  ]
}
