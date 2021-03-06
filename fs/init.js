load('api_config.js');
load('api_rpc.js');
load('api_sys.js');
load('api_gpio.js');
load('api_pwm.js');
load('api_timer.js');

let pwmConfig = {
  pin: Cfg.get('app.pin'),
  frq: Cfg.get('app.frq'),
};

let bypassConfig = {
  pin: Cfg.get('app.pin2'),
};

let ventlSteps = [
  { step: 0, duty: 0 },     // 0V => off
  { step: 1, duty: 0.37 },  // 3.7V => 1
  { step: 2, duty: 0.5 },   // 5.0V => 2
  { step: 3, duty: 0.57 },  // 5.6V
  { step: 4, duty: 0.66 },  // 6.5V
  { step: 5, duty: 0.72 },  // 7.0V => 3
  { step: 6, duty: 0.81 },  // 7.9V
  { step: 7, duty: 0.88 },  // 8.6V => 4
  { step: 8, duty: 1 }      // 10V
];

let state = {
  power: 'on',
  step: 2,
  bypass: 'off',
};

let getDuty = function(step) {
  for (let i = 0; i < ventlSteps.length; i++) {
    if (ventlSteps[i].step === step) {
      return ventlSteps[i].duty;
    }
  }
  return ventlSteps[2].duty;
};

let setBypass = function(val) {
  let level = 0;
  let newState = 'off';
  if (val === 'on') {
    level = 1;
    newState = 'on';
  }
  GPIO.write(bypassConfig.pin, level);
  state.bypass = newState;
};

print('PWM Config', JSON.stringify(pwmConfig));
print('Bypass Config', JSON.stringify(bypassConfig));
print('Init State', JSON.stringify(state));

PWM.set(pwmConfig.pin, pwmConfig.frq, getDuty(state.step));
GPIO.setup_output(bypassConfig.pin, 0);

RPC.addHandler('Ventl.Set', function(args) {
  let step = args.step;

  if (step < 0 || step > 8) {
    return { error: 1000, message: 'Invalid step number, expected value between 1-8' };
  }
  if (step === 0) {
    state.power = 'off';
  } else {
    state.power = 'on';
  }
  state.step = step;
  PWM.set(pwmConfig.pin, pwmConfig.frq, getDuty(step));
  return { result: state };
});

RPC.addHandler('Ventl.GetState', function(args) {
  return { result: state };
});

RPC.addHandler('Ventl.Off', function(args) {
  PWM.set(pwmConfig.pin, 0, 0);
  state.power = 'off';
  state.step = 0;
  return { result: state };
});

RPC.addHandler('Ventl.On', function(args) {
  let step = 2;
  PWM.set(pwmConfig.pin, pwmConfig.frq, getDuty(step));
  state.power = 'on';
  state.step = step;
  return { result: state };
});

RPC.addHandler('Bypass.On', function(args) {
  setBypass('on');
  return { result: state };
});

RPC.addHandler('Bypass.Off', function(args) {
  setBypass('off');
  return { result: state };
});

RPC.addHandler('Bypass.Toggle', function(args) {
  let newVal;
  if (state.bypass === 'off') {
    newVal = 'on';
  } else {
    newVal = 'off';
  }
  setBypass(newVal);
  return { result: state };
});