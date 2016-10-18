'use strict'

var Hapi = require('hapi')
var Inert = require('inert')
var Nes = require('nes')
var Path = require('path')
var Boom = require('boom')
var Mqtt = require('mqtt')

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

    // connect to the MQTT Broker
    const client = mqtt.connect(mqttUrl)
    client.on('connect', () => {
      server.subscription('/sensors')
      client.subscribe('temperature')

      client.on('temperature', (msg) => {
        console.log(msg)
      })

      setInterval(() => {
        server.publish('/sensors', {sensors: []})
      }, 1000)
    })

    console.log('server started on port 300-')
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
