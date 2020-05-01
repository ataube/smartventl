load('api_config.js');
load('api_rpc.js');
load('api_sys.js');
load('api_gpio.js');
load('api_pwm.js');
load('api_timer.js');

let f = ffi('void dac_set(int)');
let f2 = ffi('void dac_disable()');

let pwmConfig = {
  pin: Cfg.get('app.pin'),
  frq: Cfg.get('app.frq'),
};

let ventlSteps = [
  { step: 1, duty: 0.37 },  // 3.7V => 1
  { step: 2, duty: 0.5 },   // 5.0V => 2
  { step: 3, duty: 0.57 },  // 5.6V
  { step: 4, duty: 0.66 },  // 6.5V
  { step: 5, duty: 0.72 },  // 7.0V => 3
  { step: 6, duty: 0.81 },  // 7.9V
  { step: 7, duty: 0.88 }   // 8.6V => 4
];

let getDuty = function(step) {
  for (let i = 0; i < ventlSteps.length; i++) {
    if (ventlSteps[i].step === step) {
      return ventlSteps[i].duty;
    }
  }
  return ventlSteps[0].duty;
};

let state = {
  step: 2,
  bypass: 'off'
};

print('PWM Config', JSON.stringify(pwmConfig));
print('Init state', JSON.stringify(state));

PWM.set(pwmConfig.pin, pwmConfig.frq, getDuty(state.step));

RPC.addHandler('Ventl.Set', function(args) {
  let step = args.step;

  if (step < 1 || step > 7) {
    return { error: 1000, message: 'Invalid step number, expected value between 1-7' };
  }
  state.step = step;
  PWM.set(pwmConfig.pin, pwmConfig.frq, getDuty(step));
});

RPC.addHandler('Ventl.GetState', function(args) {
  return { result: state }
});

RPC.addHandler('Ventl.Off', function(args) {
  PWM.set(pwmConfig.pin, 0, 0)
});