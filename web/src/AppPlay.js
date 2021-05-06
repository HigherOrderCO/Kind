const { Component, render } = require("inferno");
const h = require("inferno-hyperscript").h;
const apps = require("./apps/index.js");
const sign = require("nano-ethereum-signer");
const utils = require("./utils.js");
const DEBUG_SHOW_FPS = false;

module.exports = class AppPlay extends Component {

  // Sets up internal variables
  constructor(props) {
    super(props);

    this.name = props.name; // name of this application
    this.app = null; // application module, compiled from Kind
    this.app_state = null; // the state of the application

    this.intervals = {}; // timed intervals
    this.listeners = {}; // event listeners
    this.mouse_pos = { _: "Pair.new", fst: 0, snd: 0 };
    this.rendered = null; // document rendered by app, coming from Kind
    this.container = null; // container that holds rendered app
    this.canvas = {}; // canvas that holds rendered pixel-art apps
  }

  // Initializes everything
  async componentDidMount() {
    await this.init_app();
    await this.init_input_events();
    await this.init_renderer();
  }

  // Clear up intervals and event listeners
  async componentWillUnmount() {
    for (var key in this.intervals) {
      clearInterval(this.intervals[key]);
    }
    for (var key in this.listeners) {
      document.body.removeEventListener(key, this.listeners[key]);
    };
  }

  // Loads the application from Moonad, which was pre-compiled to JavaScript
  async init_app() {
    if (!this.app && apps[this.name]) {
      //console.log("loading app...");
      this.app = (await apps[this.name])[this.name];
      this.app_state = this.app.init;
      //console.log("loaded: ", this.app);
    }
  }

  // Initializes the input event listeners
  async init_input_events() {
    //this.events = []; // this application's events

    // Init event
    this.register_event({
      _: "App.Event.init",
      time: BigInt(0),
      user: sign.addressFromKey(KEY).toLowerCase(),
      info: {
        _: "App.EnvInfo.new",
        screen_size: {
          _: "Pair.new",
          fst: window.innerWidth, // this.container ? this.container.offsetWidth : 0,
          snd: window.innerHeight // this.container ? this.container.offsetHeight : 0,
        },
        mouse_pos: this.mouse_pos,
      }
    });

   // Mouse movement event
    this.listeners.mousemove = (e) => {
      this.mouse_pos = {_ : "Pair.new", fst: e.offsetX, snd : e.offsetY}
    }

    document.body.addEventListener("mousemove", this.listeners.mousemove);

    // Mouse down event
    this.listeners.mousedown = (e) => {
      this.register_event({
        _: "App.Event.mouse_down",
        time: BigInt(Date.now()),
      });
    };
    document.body.addEventListener("mousedown", this.listeners.mousedown);

    this.listeners.mouseover = (e) => {
      this.register_event({
        _: "App.Event.mouse_over",
        time: BigInt(Date.now()),
        id: e.target.id
      });
    };
    document.body.addEventListener("mouseover", this.listeners.mouseover); 

    this.listeners.mouseover = (e) => {
      this.register_event({
        _: "App.Event.mouse_out",
        time: BigInt(Date.now()),
        id: e.target.id
      });
    };
    document.body.addEventListener("mouseout", this.listeners.mouseout);

    this.listeners.click = (e) => {
      this.register_event({
        _: "App.Event.mouse_click",
        time: BigInt(Date.now()),
        id: e.target.id
      });
    };
    document.body.addEventListener("click", this.listeners.click); 

    // Mouse up event
    this.listeners.mouseup = (e) => {
      this.register_event({
        _: "App.Event.mouse_up",
        time: BigInt(Date.now()),
      });
    };
    document.body.addEventListener("mouseup", this.listeners.mouseup);

    // Key down event
    this.listeners.keydown = (e) => {
      if (!e.repeat) {
        this.register_event({
          _: "App.Event.key_down",
          time: BigInt(Date.now()),
          code: e.keyCode,
        });
      }
    };
    document.body.addEventListener("keydown", this.listeners.keydown);

    // Key up event
    this.listeners.keyup = (e) => {
      this.register_event({
        _: "App.Event.key_up",
        time: BigInt(Date.now()),
        code: e.keyCode,
      });
    };
    document.body.addEventListener("keyup", this.listeners.keyup);

    // Resize event
    this.listeners.resize = (e) => {
      this.register_event({
        _: "App.Event.resize",
        time: BigInt(Date.now()),
        info: {
          _: "App.EnvInfo.new",
          screen_size: {
            _: "Pair.new",
            fst: e.target.innerWidth,
            snd: e.target.innerHeight,
          },
          mouse_pos: this.mouse_pos,
        }
      });
    };
    window.addEventListener("resize", this.listeners.resize);

    //Tick event
    this.intervals.tick = () => {
      let time = performance.now()
      let frame = 1000/16
      let self = (mileseconds) => {
        if (mileseconds-time > frame) {
          this.register_event({
            _: "App.Event.tick",
            time: BigInt(Date.now()),
            info: {
              _: "App.EnvInfo.new",
              screen_size: {
                _: "Pair.new",
                fst: this.container ? this.container.offsetWidth : 0,
                snd: this.container ? this.container.offsetHeight : 0,
              },
              mouse_pos: this.mouse_pos,
            }
          })
          time = performance.now()
        }
        window.requestAnimationFrame(self)
      }
      return window.requestAnimationFrame(self)
    }

    this.intervals.tick()
  }
  
  // Initializes the main render loop
  
  async init_renderer() {
    if (DEBUG_SHOW_FPS) {
      var last_time = Date.now();
      var fps_count = 0;
    }
    this.intervals.renderer = setInterval(() => {
      if (this.app) {
        if (DEBUG_SHOW_FPS) {
          if (Date.now() - last_time > 1000) {
            console.log("FPS: ", fps_count);
            fps_count = 0;
            last_time = Date.now();
          }
          fps_count++;
        }
        this.rendered = this.app.draw(this.app_state);
        this.forceUpdate();
      }
    }, 1000 / 32);
  }

  // Adds an event to the list of events
  register_event(ev) {
    if (this.app) {
      this.run_io(this.app.when(ev)(this.app_state));
    }
  }

  // Performs an IO computation
  run_io(io) {
    //console.log("Run IO", io);
    switch (io._) {
      case "IO.end":
        if (io.value.value !== null) {
          this.app_state = io.value.value;
          return Promise.resolve(io.value.value);
        }
        return Promise.resolve(null);
      case "IO.ask":
        //console.log("IO.ask", io.param);
        return new Promise((res, err) => {
          switch (io.query) {
            case "print":
              alert(io.param);
              return this.run_io(io.then("")).then(res).catch(err);
            case "put_string":
              alert(io.param);
              return this.run_io(io.then("")).then(res).catch(err);
            case "get_time":
              return this.run_io(io.then(String(Date.now()))).then(res).catch(err);
            case "get_line":
              var answer = prompt(io.param) || "";
              return this.run_io(io.then(answer)).then(res).catch(err);
            case "get_file":
              var data = localStorage.getItem(io.param) || "";
              return this.run_io(io.then(data)).then(res).catch(err);
            case "set_file":
              var path = '';
              for (var i = 0; i < io.param.length && io.param[i] !== '='; ++i) {
                path += param[i];
              };
              var data = io.param.slice(i + 1);
              localStorage.setItem(path, data);
              return this.run_io(io.then("")).then(res).catch(err);
            case "del_file":
              localStorage.removeItem(io.param);
              return this.run_io(io.then("")).then(res).catch(err);
            case "watch":
              if (utils.is_valid_hex(48, io.param)) {
                window.KindEvents.watch_room(io.param);
                window.KindEvents.on_post(({ room, time, addr, data }) => {
                  var time = BigInt(parseInt(time.slice(2), 16));
                  this.register_event({ _: "App.Event.post", time, room, addr : addr.toLowerCase(), data });
                });
              } else {
                console.log("Error: invalid input on App.Action.watch");
              }
              return this.run_io(io.then("")).then(res).catch(err);
            case "post":
              var [room, data] = io.param.split(";");
              if (utils.is_valid_hex(48, room) && utils.is_valid_hex(256, data)) {
                console.log("Posting: ", room, data);
                window.KindEvents.send_post(room, data);
              } else {
                console.log("Error: invalid input on App.Action.post");
              }
              return this.run_io(io.then("")).then(res).catch(err);
          }
        });
    }
  }

  // Renders a document
  render_dom(elem) {
    //console.log("render_dom", elem);
    switch (elem._) {
      // Renders a HTML element
      case "DOM.node":
        let props = utils.map_to_object(elem.props);
        let style = utils.map_to_object(elem.style);
        return h(elem.tag, {
          ...props,
          style: style
        }, utils.list_to_array(elem.children).map(x => this.render_dom(x)));
      // Renders a VoxBox using a canvas
      case "DOM.vbox":
        var id = elem.props ? elem.props.id || "" : "";
        var width = Number(elem.props.width) || 256;
        var height = Number(elem.props.height) || 256;
        var canvas = this.get_canvas(id, width, height);
        var length = elem.value.length;
        var capacity = elem.value.capacity;
        var buffer = elem.value.buffer;
        // Renders pixels to buffers
        for (var i = 0; i < length; ++i) {
          var pos = buffer[i * 2 + 0];
          var col = buffer[i * 2 + 1];
          var p_x = (pos >>> 0) & 0xFFF;
          var p_y = (pos >>> 12) & 0xFFF;
          var p_z = (pos >>> 24) & 0xFF;
          var idx = p_y * canvas.width + p_x;
          var dep = canvas.depth_u8[idx];
          if (p_x >= 0 && p_x < width && p_y >= 0 && p_y < height && p_z >= dep) {
            canvas.image_u32[idx] = col;
            canvas.depth_u8[idx] = p_z;
            canvas.clear.data[canvas.clear.length++] = idx;
          }
        }
        // Renders buffers to canvas
        canvas.image_data.data.set(canvas.image_u8);
        canvas.context.putImageData(canvas.image_data, 0, 0);
        // Erases pixels from buffers
        for (var i = 0; i < canvas.clear.length; ++i) {
          var idx = canvas.clear.data[i];
          canvas.image_u32[idx] = 0;
          canvas.depth_u8[idx] = 0;
        }
        canvas.clear.length = 0;
        // Mutably resets the length of the VoxBox
        elem.value.length = 0;
        return h("div", {
          ref: function (x) { if (x) { x.appendChild(canvas) } }
        });
      // Renders plain text
      case "DOM.text":
        return elem.value;
    }
  }

  // Component's render function
  render() {
    if (!this.app) {
      return "Loading app...";
    } else if (!this.rendered) {
      return "Rendering app...";
    } else {
      var element = this.render_dom(this.rendered);
      var container = h("div", {
        id: "container",
        style: {
          "width": "100%",
          "height": "100%",
        },
      }, element);
      return container;
    }
  }

  // Gets a pixel-art canvas
  get_canvas(id, width, height) {
    if (!this.canvas[id] || this.canvas[id].width !== width || this.canvas[id].height !== height) {
      console.log("creating canvas", id, width, height);
      this.canvas[id] = document.createElement("canvas");
      this.canvas[id].style["image-rendering"] = "pixelated";
      this.canvas[id].width = width;
      this.canvas[id].height = height;
      this.canvas[id].style.width = width + "px";
      this.canvas[id].style.height = height + "px";
      this.canvas[id].clear = { length: 0, data: new Uint32Array(width * height * 32) };
      this.canvas[id].style.border = "1px solid black";
      this.canvas[id].context = this.canvas[id].getContext("2d");
      this.canvas[id].image_data = this.canvas[id].context.getImageData(0, 0, this.canvas[id].width, this.canvas[id].height)
      this.canvas[id].image_buf = new ArrayBuffer(this.canvas[id].image_data.data.length);
      this.canvas[id].image_u8 = new Uint8ClampedArray(this.canvas[id].image_buf);
      this.canvas[id].image_u32 = new Uint32Array(this.canvas[id].image_buf);
      this.canvas[id].depth_buf = new ArrayBuffer(this.canvas[id].image_u32.length);
      this.canvas[id].depth_u8 = new Uint8Array(this.canvas[id].depth_buf);
    }
    return this.canvas[id];
  }

}

