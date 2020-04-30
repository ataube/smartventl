load('api_config.js');
load('api_rpc.js');
load('api_sys.js');
load('api_gpio.js');
load('api_pwm.js');
load('api_timer.js');

let f = ffi('void dac_set(int)');
let f2 = ffi('void dac_disable()');

let ventl = {
  step1: 0.37, // 3.7V => 1
  step2: 0.5, // 5.0V => 2
  step3: 0.57, // 5.6V
  step4: 0.66, //6.5V
  step5: 0.72, // 7.0V => 3
  step6: 0.81, // 7.9V
  step7: 0.88 // 8.6V => 4
};

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