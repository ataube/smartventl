# Smart Ventilation - ValloPlus 350 SC L

## About
This project extends the ValloPlus 350 ventilation system with a microcontroller in order to provide a smart remote control interface. It provides a HTTP based interface to control the fan-speed and to toggle the Bypass mode. The interface can be easily embedded in a smart home control setup like [Home Assistant](https://www.home-assistant.io/hassio/).

## Hardware Listing
* ESP32 Development Board WiFi+Bluetooth Ultra-Low Power Consumption Dual Cores ESP-32 ESP-32S Board [link](https://www.aliexpress.com/item/32969364642.html)
* PWM to Voltage Converter Module 0%-100% to 0-10V for PLC MCU Digital to Analog Signal PWM Adjustabl Converter Power Module [link](https://www.aliexpress.com/item/33021792064.html)
* AZDelivery 220V to 3,3V Mini Power Supply [link](https://www.amazon.de/gp/product/B07C4THP6G/ref=ppx_yo_dt_b_asin_title_o04_s00)
* AZDelivery Relais 5V KY-019 Modul [link](https://www.amazon.de/gp/product/B07CNR7K9B/ref=ppx_yo_dt_b_asin_title_o05_s00)
* AZDelivery 220V to 12V Mini Power Supply [link](https://www.amazon.de/gp/product/B07C4TLYSG/ref=ppx_yo_dt_b_asin_title_o05_s00)

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