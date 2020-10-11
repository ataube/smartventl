# Smart Ventilation - ValloPlus 350 SC L

## About
TODO

## Build
`mos build --platform esp32 --local`

## Flash ESP32
`mos flash`

## API

### Get State
```
curl -X POST -d '{}' http://IP_ADDR/rpc/Ventl.GetState
{
  power: 'on',
  step: 2,
  bypass: 'off',
}
```

### Set Step
Step range 0-8. 0 turns power into `off`
```
curl -d '{ "step": 1 }' http://IP_ADDR/rpc/Ventl.Set
```

### Toggle Bypass
```
curl -d '{}' http://IP_ADDR/rpc/Bypass.Toggle
```

### OTA Update
```
curl -v -F file=@build/fw.zip http://IP_ADDR/update
```