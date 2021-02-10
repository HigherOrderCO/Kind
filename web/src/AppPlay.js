const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const apps = require("./apps/index.js");

module.exports = class AppPlay extends Component {
  constructor(props) {
    super(props);

    this.name = props.name; // name of this application
    this.app = null; // application module, compiled from Formality
    this.app_state = null; // the state of the application

    //this.events = []; 
    //this.last_tick = 0;
    this.intervals = {}; // timed intervals
    this.listeners = {}; // event listeners
    this.mouse_pos = {_:"Pair.new", fst: 0, snd: 0}; 
    this.rendered = null; // document rendered by app, coming from Formality
    this.container = null; // container that holds rendered app
    this.canvas = null; // canvas that holds rendered pixel-art apps
    //this.log = "Loading...";
  }

  // Initializes everything
  async componentDidMount() {
    await this.init();
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

  // Initializes the pixel-art canvas
  async init_canvas(width, height) {
    if (!this.canvas || this.canvas.width !== width || this.canvas.height !== height) {
      console.log("init_canvas", width, height);
      this.canvas = document.createElement("canvas");
      this.canvas.style["image-rendering"] = "pixelated";
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.width = (width*2)+"px";
      this.canvas.style.height = (height*2)+"px";
      this.canvas.clear = {length:0, data:new Uint32Array(width*height*32)};
      this.canvas.style.border = "1px solid black";
      this.canvas.context = this.canvas.getContext("2d");
      this.canvas.image_data = this.canvas.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
      this.canvas.image_buf = new ArrayBuffer(this.canvas.image_data.data.length);
      this.canvas.image_u8 = new Uint8ClampedArray(this.canvas.image_buf);
      this.canvas.image_u32 = new Uint32Array(this.canvas.image_buf);
      this.canvas.depth_buf = new ArrayBuffer(this.canvas.image_u32.length);
      this.canvas.depth_u8 = new Uint8Array(this.canvas.depth_buf);
    }
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
    //this.register_event({
      //_: "App.Event.init",
      //time: 0,
      ////addr: lib.hex_to_fmword(front.get_addr()),
      //addr: "0x0000000000000000000000000000000000000000",
      //screen: {
        //_: "Pair.new",
        //fst: this.container ? this.container.offsetWidth : 0,
        //snd: this.container ? this.container.offsetHeight : 0,
      //},
      //mouse: this.mouse_pos,
    //});

    // Mouse movement
    this.listeners.mousemove = (e) => {
      this.mouse_pos = {_:"Pair.new", fst:e.offsetX, snd:e.offsetY};
    };
    document.body.addEventListener("mousemove", this.listeners.mousemove);

    // Mouse down event
    this.listeners.mousedown = (e) => {
      this.register_event({_:"App.Event.xkey", time:Date.now(), down:true, code:0});
    };
    document.body.addEventListener("mousedown", this.listeners.mousedown);

    // Mouse up event
    this.listeners.mouseup = (e) => {
      this.register_event({_:"App.Event.xkey", time:Date.now(), up:false, code:0});
    };
    document.body.addEventListener("mouseup", this.listeners.mouseup);

    // Key down event
    this.listeners.keydown = (e) => {
      if (!e.repeat) {
        this.register_event({_:"App.Event.xkey", time:Date.now(), down:true, code:e.keyCode});
      }
    };
    document.body.addEventListener("keydown", this.listeners.keydown);

    // Key up event
    this.listeners.keyup = (e) => {
      this.register_event({_:"App.Event.xkey", time:Date.now(), down:false, code:e.keyCode});
    };
    document.body.addEventListener("keyup", this.listeners.keyup);

    // Tick event
    //this.intervals.tick = setInterval(() => {
      //this.register_ticks();
    //}, 1000 / 80);

    //// State computer
    //this.intervals.compute_states = setInterval(() => {
      //this.compute_states(2000); // computes at most 128000 events per second
    //}, 1000 / 64);

    //// Save memory by freeing states older than 6 seconds
    ////this.intervals.clean_states = setInterval(() => {
      ////if (this.events.length > 0) {
        ////var i = this.events.length - 1;
        ////var ct = Date.now();
        ////while (i >= 0 && this.events[i].time > ct - 6000) {
          ////--i;
        ////}
        ////for (var j = i; j >= 0; --j) {
          ////if (this.events[j].state === null) {
            ////break;
          ////}
          ////this.events[j].state = null;
        ////}
      ////}
    ////}, 3000);
  }

  // Initializes the main render loop
  async init_renderer() {
    //console.log("to aqui!");
    this.intervals.renderer = setInterval(() => {
      //console.log("to aqui");
      if (!this.container) {
        this.container = document.getElementById("container");
      }
      if (this.app) {
        this.rendered = this.app.draw(this.app_state);
        if (this.rendered && this.rendered._ === "App.Render.pix") {
          var canvas = this.canvas;
          if (this.container && this.container.firstChild !== canvas) {
            this.container.innerHTML = "";
            this.container.appendChild(canvas);
          }
          var length = this.rendered.pixs.length;
          let capacity = this.rendered.pixs.capacity;
          var buffer = this.rendered.pixs.buffer;
          // Renders pixels to buffers
          for (var i = 0; i < length; ++i) {
            var pos = buffer[i*2+0];
            var col = buffer[i*2+1];
            var p_x = (pos >>> 0) & 0xFFF;
            var p_y = (pos >>> 12) & 0xFFF;
            var p_z = (pos >>> 24) & 0xFF;
            var idx = p_y * canvas.width + p_x;
            var dep = canvas.depth_u8[idx];
            if (p_z > dep) {
              canvas.image_u32[idx] = col;
              canvas.depth_u8[idx] = p_z;
              canvas.clear.data[canvas.clear.length++] = idx;
            }
          };
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
        }
        this.forceUpdate();
      }
    }, 1000 / 16);
  }

  // Initializes everything
  async init(name) {
    await this.init_app();
    await this.init_canvas(256, 256);
    await this.init_input_events();
    await this.init_renderer();
  }

  // Executes an event, returning the updated state
  execute_event(ev, state) {
    console.log("execute_event", JSON.stringify(ev));
    var actions = this.app.when(ev)(state);
    while (actions._ === "List.cons") {
      var action = actions.head;
      console.log("execute_action", JSON.stringify(action));
      switch (action._) {
        case "App.Action.state":
          state = action.value;
          console.log("new state", state)
          break;
        case "App.Action.print":
          if (!ev.done) {
            console.log(action.text);
          }
          break;
        //case "App.Action.post":
          //if (!ev.done) {
            //var data = lib.hex(256, lib.fmword_to_hex(action.data));
            //front.logs.send_post(lib.fmword_to_hex(action.room), data);
          //}
          //break;
        //case "App.Action.watch":
          //if (!ev.done) {
            //front.logs.watch_room(lib.fmword_to_hex(action.room));
            ////console.log("watching room");
            //front.logs.on_post(({room, time, addr, data}) => {
              ////var text = lib.hex_to_string(data).replace(/\0/g,"");
              ////console.log("got post");
              //this.register_event({
                //_: "App.Event.post",
                //time: parseInt(time.slice(2), 16),
                //room: lib.hex_to_fmword(room),
                //addr: lib.hex_to_fmword(addr),
                //data: lib.hex_to_fmword(data),
              //});
            //});
          //}
          //break;
        case "App.Action.resize":
          this.init_canvas(action.width, action.height);
          break;
      };
      actions = actions.tail;
    }
    return state;
  }

  //// Generates tick events
  //register_ticks() {
    //var dt = 32; // ticks per second
    //var ct = Date.now();
    //var lt = this.last_tick;
    //var ts = 0;
    ////console.log("Registering ticks...");
    //for (var t = lt + (dt - lt % dt); t < ct; t += dt) {
      //this.register_event({_: "App.Event.tick", time: t});
      //this.last_tick = t;
      //++ts;
    //}
    ////console.log("Registered "+ts+" ticks...");
  //}
  //
  
  // Adds an event to the list of events
  register_event(ev) {
    if (this.app) {
      this.app_state = this.execute_event(ev, this.app_state);
    }
    ////console.log("register", ev._, ev.time);
    //if (this.app) {
      //this.events.push(ev);
      //// If it is older than the last event, reorder 
      //var i = this.events.length - 1;
      //while (this.events[i-1] && this.events[i-1].time > this.events[i].time) {
        //var prev = this.events[i-1];
        //var next = this.events[i-0];
        //prev.state = null;
        //this.events[i-1] = next;
        //this.events[i-0] = prev;
        //--i;
      //}
      //// Frees memory of old events
      ////if (this.events.length > 64) {
        ////this.events[this.events.length - 64] = null;
      ////}
    //}
  }
  
  //compute_states(max_events = Infinity) {
    //if (this.events.length > 0) {
      //var last_with_state = this.events.length - 1;
      //while (last_with_state > 0 && !this.events[last_with_state-1].state) {
        //--last_with_state;
      //}
      //var lim = Math.min(last_with_state + max_events, this.events.length);
      //for (var i = last_with_state; i < lim; ++i) {
        //this.log = "Computing event " + i + "...";
        //var last_state = i === 0 ? this.app.init : this.events[i-1].state;
        //this.events[i].state = this.execute_event(this.events[i], last_state);
      //}
    //}
  //}
  
  render() {
    if (!this.app) {
      return "Loading app...";
    } else if (!this.rendered) {
      return "Rendering app...";
    } else {
      // Converts rendered object to an HTML element
      var app_element = null;
      switch (this.rendered._) {
        case "App.Render.txt":
          app_element = this.rendered.text;
          break;
        case "App.Render.pix":
          app_element = h("span");
          break;
      }
      var container = h("div", {
        id: "container",
        style: {
          "width": "100%",
          "min-height": "calc(100% - 30px)",
        },
      }, app_element);
      return container;
    }
  }
}
