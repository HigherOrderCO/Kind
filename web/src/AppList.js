const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const apps = require("./apps/index.js");

module.exports = class AppList extends Component {
  render() {
    var list = Object.keys(apps).map(app => {
      return h("div", {}, [
        h("span", {}, "- "),
        h("a", {
          style: {
            "text-decoration": "underline",
            "cursor": "pointer",
          },
          onClick: () => {
            window.location = "#"+app;
            window.location.reload(false);
          },
        }, app),
      ]);
    });
    return h("pre", {
      style: {
        "padding": "6px",
        "font-size": "16px",
        "font-family": "monospace",
      }
    }, [
      h("div", {}, [h("pre", {}, ["Select an application:"])]),
      list,
    ]);
  }
}
