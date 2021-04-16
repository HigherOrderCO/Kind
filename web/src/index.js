require("./assets/moonad_logo.png").default;

const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;

const EthSign = require("nano-ethereum-signer");
const AppPlay = require("./AppPlay.js");
const AppList = require("./AppList.js");
const KindEventsClient = require("./../events/client.js");

function random_hex(bits_len) {
  var bytes = crypto.getRandomValues(new Uint8Array((bits_len/8)>>>0));
  var chars = Array.from(bytes).map(b => ("00" + b.toString(16)).slice(-2));
  return "0x" + chars.join("");
}

function get_from_storage(key, init) {
  var value = localStorage.getItem(key);
  if (!value) {
    value = init();
    localStorage.setItem(key, value);
  }
  return value;
}

window.KEY = get_from_storage("KEY", () => random_hex(256));
window.KindEvents = KindEventsClient({url: "ws://uwu.tech:7171", key: window.KEY});
console.log("KEY: ", window.KEY);
console.log("ADDRESS: ", EthSign.addressFromKey(window.KEY));

class Moonad extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    window.addEventListener('popstate', (event) => {
      this.forceUpdate();
    });
  }
  render() {
    var path = window.location.pathname.slice(1);
    if (path === "") {
      return h(AppList);
    } else {
      return h(AppPlay, {name: path});
    }
  }
};

window.onload = () => render(h(Moonad), document.getElementById("main"));
