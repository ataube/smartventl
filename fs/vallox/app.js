function post(url, body) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.timeout = 2000;
    req.open('POST', url);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.onload = function () {
      if (req.status !== 200) {
        return reject(new Error('Request error', req.statusText));
      }
      try {
        var result = JSON.parse(req.responseText);
        return resolve(result);
      } catch (err) {
        return reject(new Error('Error parsing response', err));
      }
    };
    req.send(JSON.stringify(body || {}));
  });
}

var ButtonComp = function (props, el) {
  var state = {
    active: false,
  };

  el.addEventListener('click', function (e) {
    if (props.onClick) {
      props.onClick(state, props);
    }
  });

  return {
    setActive: function () {
      el.classList.add('pure-button-active');
      state.active = true;
    },
    setInactive: function () {
      el.classList.remove('pure-button-active');
      state.active = false;
    },
    getState: function () {
      return Object.assign({}, state);
    },
    getProps: function () {
      return Object.assign({}, props);
    },
  };
};

var VentilationStepsComp = function (props, el) {
  var buttons = [];
  var onButtonClick = function (state, props) {
    buttons.forEach(function (btn) {
      if (btn.getProps().id === props.id) {
        btn.setActive();
      } else {
        btn.setInactive();
      }
    });
  };

  el.querySelectorAll('button').forEach(function (btnEl, idx) {
    buttons.push(ButtonComp({ id: idx + 1, onClick: onButtonClick }, btnEl));
  });
};

function app() {
  var steps = VentilationStepsComp(
    {},
    document.getElementById('ventilator-steps')
  );

  var state = {
    ventlSpeed: 3,
  };
}

app();
// post('http://192.168.178.44/rpc/Ventl.GetState').then(res => {
//   console.log('>>>', res)
// }).catch(err => console.error('err', err))
