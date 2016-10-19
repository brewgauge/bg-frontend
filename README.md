# bg-dashboard

- __Sponsor:__ [nearForm][Sponsor]

A web app used to chart data from the BrewGauge system.

- __Work in progress:__ This module is currently a work in progress.

## Running
To run the dashboard,

1. Run `npm install`
2. Run `npm run build`
3. Run `npm run start`

## Running (as demo)
1. Install and start a MQTT broker, locally, using the `3040` port,  e.g.:  
```
npm install mosca pino -g
mosca -v -p 3040 | pino
```

2. Clone and start `bg-emu-temperature` (will subscribe to a topic on the MQTT broker)
3. Start the frontend: `npm run start`

## License
Copyright (c) 2016, Dean McDonnell and other contributors.
Licensed under [MIT][License].

[Sponsor]: http://www.nearform.com/
[License]: ./LICENSE
