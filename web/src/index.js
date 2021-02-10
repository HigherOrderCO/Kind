require("./assets/moonad_logo.png").default;

const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;

const AppPlay = require("./AppPlay.js");
const AppList = require("./AppList.js");

class Moonad extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    // Back button
    window.addEventListener('popstate', (event) => {
      this.forceUpdate();
    });
  }
  render() {
    var path = window.location.hash.slice(1);
    if (path === "") {
      return h(AppList);
    } else {
      return h(AppPlay, {name: path});
    }
  }
};

window.onload = () => render(h(Moonad), document.getElementById("main"));
