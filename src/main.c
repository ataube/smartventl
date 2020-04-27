#include <driver/gpio.h>
#include <driver/dac.h>

void dac_set(int a) {  
  dac_output_enable(DAC_CHANNEL_1); 
  dac_output_voltage(DAC_CHANNEL_1, a);
}

void dac_disable() {
  dac_output_disable(DAC_CHANNEL_1); 
}