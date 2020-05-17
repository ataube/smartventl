const baseUrl = '';

function post(url, body) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.timeout = 2000;
    req.open('POST', url);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.addEventListener('abort', () => {
      reject(new Error('Request aborted'));
    });
    req.addEventListener('error', () => {
      reject(new Error('Request error'));
    });
    req.onload = function () {
      if (req.status !== 200) {
        return reject(new Error('Request error', req.statusText));
      }
      try {
        const result = JSON.parse(req.responseText);
        return resolve(result);
      } catch (err) {
        return reject(new Error('Error parsing response', err));
      }
    };
    req.send(JSON.stringify(body || {}));
  });
}

const apiClient = {
  getState: () => {
    return post(baseUrl + '/rpc/Ventl.GetState').then((res) => res.result);
  },
  setVentilatorSpeed: (speed) => {
    return post(baseUrl + '/rpc/Ventl.Set', { step: speed });
  },
};

class ButtonComp {
  constructor(props, el) {
    this.props = props;
    this.el = el;
    this.state = {
      active: false,
    };
    this.el.addEventListener('click', (e) => {
      props.onClick(this);
    });
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.render();
  }

  render() {
    if (this.state.active) {
      this.el.classList.add('pure-button-active');
    } else {
      this.el.classList.remove('pure-button-active');
    }
  }
}

class VentilationStepList {
  constructor(props, el) {
    this.state = {
      ventlSpeed: 0,
    };
    this.props = props;
    this.el = el;
    this.buttons = [];
    this.el.querySelectorAll('button').forEach((btnEl, idx) => {
      this.buttons.push(
        new ButtonComp(
          { id: idx, onClick: this.onStepButtonClick.bind(this) },
          btnEl
        )
      );
    });
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.render();
  }

  async onStepButtonClick(event) {
    try {
      await apiClient.setVentilatorSpeed(event.props.id);
      this.setState({ ventlSpeed: event.props.id });
    } catch (err) {
      alert('Error setting ventilator state');
    }
  }

  render() {
    this.buttons.forEach((btn) => {
      if (btn.props.id === this.state.ventlSpeed) {
        btn.setState({ active: true });
      } else {
        btn.setState({ active: false });
      }
    });
  }
}

async function init() {
  const steps = new VentilationStepList(
    {},
    document.getElementById('ventilator-steps')
  );

  try {
    const state = await apiClient.getState();
    steps.setState({ ventlSpeed: state.step });
  } catch (err) {
    alert('Error fetching ventilator state');
  }
}

init();
