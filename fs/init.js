load('api_config.js');
load('api_rpc.js');
load('api_sys.js');
load('api_gpio.js');
load('api_pwm.js');
load('api_timer.js');

/*
  0V - 02.5V  => 1
2.5V - 05.0V  => 2
5.0V - 07.5V  => 3
7.5V - 10.0V  => 4
*/

let f = ffi('void dac_set(int)');
let f2 = ffi('void dac_disable()');

let pwmConfig = {
  pin: Cfg.get('app.pin'),
  frq: Cfg.get('app.frq'),
  duty: Cfg.get('app.duty')
};

print('PWM Config', JSON.stringify(pwmConfig));

PWM.set(pwmConfig.pin, pwmConfig.frq, pwmConfig.duty);

RPC.addHandler('Ventl.Set', function(args) {
  let step = args.step;
  if (step < 0 || step > 1) {
    return { error: 1000, message: 'Bad request' };
  }
  PWM.set(pwmConfig.pin, pwmConfig.frq, step);
});

RPC.addHandler('Ventl.Off', function(args) {
  PWM.set(pwmConfig.pin, 0, 0)
});

// Build in DAC
RPC.addHandler('Ventl.Set2', function(args) {
  let step = args.step;
  if (step < 0 || step > 255) {
    return { error: 1000, message: 'Bad request' };
  }
  print('Calling C my_func:', f(step));
});

// Build in DAC
RPC.addHandler('Ventl.Off2', function(args) {
  print('Disable dac:', f2());
});