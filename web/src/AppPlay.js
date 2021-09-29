const { Component, render } = require("inferno");
const h = require("inferno-hyperscript").h;
const apps = require("./apps/index.js");
const ethsig = require("nano-ethereum-signer");
const utils = require("./utils.js");
const StateList = require("./StateList.js");
const DEBUG_SHOW_FPS = false;

module.exports = class AppPlay extends Component {

  // Sets up internal variables
  constructor(props) {
    super(props);

    this.name = props.name; // name of this application
    this.app = null; // application module, compiled from Kind
    this.app_state = null; // the state of the application

    this.app_global_states = null; // previous global states
    this.app_global_tick = null; // global tick we're at
    this.app_global_begin = null; // the first tick of this app
    this.app_global_posts = {}; // map of global posts
    this.app_has_ticker = false; // is there a tick function?

    this.received_posts = []; // list of posts in received order
    this.display = null; // message to display (overrides render)
    this.watching = {}; // rooms I'm watching
    this.intervals = {}; // timed intervals
    this.listeners = {}; // event listeners
    this.mouse_pos = { _: "Pair.new", fst: 0, snd: 0 };
    this.rendered = null; // document rendered by app, coming from Kind
    this.container = props.container; // container that holds rendered app
    this.canvas = {}; // multiple canvas that holds rendered pixel-art apps
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
      this.app_has_ticker = this.app.tick.toString() !== "x0 => x1 => App$no_tick$(x0, x1)"; // lil hacker's optimization
      this.app_state = {
        _: "App.Store.new",
        local: this.app.init.local,
        global: this.app.init.global
      };
    }
  }

  // Initializes the input event listeners
  async init_input_events() {
    //this.events = []; // this application's events

    //function print_time() {
      //console.clear();
      //console.log("local_time  : ", Date.now());
      //console.log("server_time : ", window.KindEvents.get_time());
      //console.log("delta_time  : ", Date.now() - window.KindEvents.get_time());
      //console.log("");
    //}
    //setInterval(print_time, 200);

    // Init event
    this.register_event({
      _: "App.Event.init",
      time: BigInt(0),
      user: ethsig.addressFromKey("0x"+KEY).slice(2),
      info: {
        _: "App.EnvInfo.new",
        screen_size: {
          _: "Pair.new",
          fst: this.container ? this.container.width  : 0,
          snd: this.container ? this.container.height : 0,
        },
        mouse_pos: this.mouse_pos,
      }
    });

   // Mouse movement event
    this.listeners.mousemove = (e) => {
      this.mouse_pos = {_: "Pair.new", fst: e.pageX, snd: e.pageY};
      this.register_event({
        _: "App.Event.mouse_move",
        time: BigInt(Date.now()),
        id: e.target.id,
        mouse_pos: {_: "Pair.new", fst: e.offsetX, snd: e.offsetY}
      });
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

    // Tick event
    this.intervals.tick = () => {
      setInterval(() => {
        this.register_tick(window.KindEvents.get_tick())
      }, 1000 / 60);
    };
    this.intervals.tick()

    // Frame event (60 fps)
    this.intervals.frame = () => {
      setInterval(() => {
        this.register_event({
          _: "App.Event.frame",
          time: BigInt(Date.now()),
          info: {
            _: "App.EnvInfo.new",
            screen_size: {
              _: "Pair.new",
              fst: screen.width,
              snd: screen.height,
            },
            mouse_pos: this.mouse_pos,
          }
        })
      }, 1000 / 60);
    };
    this.intervals.frame()
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
            //console.log("FPS: ", fps_count);
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

  // Registers a post
  register_post(post) {
    if (this.app && this.watching[post.room]) {
      var key = String(post.tick);
      if (!this.app_global_posts[key]) {
        this.app_global_posts[key] = [];
      }
      this.app_global_posts[key].push(post);
      // console.log("New post at " + this.show_tick(post.tick));
      if (!this.app_global_begin || post.tick < this.app_global_begin) {
        this.app_global_begin = post.tick;
        this.app_global_states = null;
        this.app_global_tick = null;
      }
      this.register_tick(post.tick);
      //console.log(this.app_global_posts);
      //console.log(this.app_global_begin);
    }
  }

  show_tick(tick){
    return (new Date(tick * 62.5)).toUTCString();
  }

  // Computes the global state at given tick (rollback netcode)
  register_tick(tick) {
    var restored = false;
    if (this.app && this.app_global_begin !== null) {
      // If the tick is older than the current state, rollback
      if (this.app_global_tick !== null && tick < this.app_global_tick) {
        //console.log("- older than " + this.app_global_tick);
        var latest = StateList.latest(tick, this.app_global_states);
        // If there is no previous state, reset to initial state
        if (latest === null) {
          this.app_global_tick = null;
          this.app_state.global = this.app.init.global;
        // Otherwise, restore found state
        } else {
          restored = true;
          this.app_global_tick = latest.tick;
          this.app_state.global = latest.state;
        }
      }
      if (this.app_global_tick === null) {
        //console.log("- init app_global_tick");
        this.app_global_tick = this.app_global_begin;
      }
      var count_ticks = 0;
      var count_posts = 0;
      var begin_time = Date.now();
      var total = tick - this.app_global_tick;
      if (total > 16 && this.app_has_ticker) {
        var from_date = new Date(this.app_global_tick * 62.5);
        var to_date = new Date(tick * 62.5);
        this.display = "Computing " + total + " ticks.\n";
        this.display += "From : " + from_date.toUTCString().slice(5) + "\n";
        this.display += "UpTo : " + to_date.toUTCString().slice(5) + "\n";
        this.forceUpdate();
      }

      // amount of ticks done after one post
      var tick_limit = 16 * 64;
      if (restored) {
        // posts between latest state and actual tick
        var post_ticks = [];
        // post before latest state
        // used to redo ticks between latest and first restored post
        var immediately_before = undefined;
        for (let key in this.app_global_posts) {
          let n_key = Number(key)
          // finding which posts restore
          if (n_key > this.app_global_tick) post_ticks.push(n_key);
          else
            // find post immediately before latest state
            if (n_key > immediately_before || immediately_before === undefined)
              immediately_before = n_key;
        }
        // order posts
        post_ticks.sort();

        // do ticks between latest state and first post restored
        if (immediately_before) {
          var compute_from_tick = this.app_global_tick;
          var compute_to_tick   = Math.min(this.app_global_tick 
            + (tick_limit - (this.app_global_tick - immediately_before)), post_ticks[0]);
          for (var t = compute_from_tick; t < compute_to_tick; ++t) {
            this.execute(t);
          }
        }

        // restore posts and their ticks between latest state and actual tick
        for (var j = 0; j < post_ticks.length - 1 ; j++) {
          var until = Math.min(post_ticks[j + 1] - post_ticks[j], tick_limit);
          var compute_from_tick = post_ticks[j];
          var compute_to_tick = compute_from_tick + until;
          for (var t = compute_from_tick; t < compute_to_tick; ++t) {
            this.execute(t);
          }
        }
      } else {
        var compute_from_tick = this.app_global_tick; 
        var compute_to_tick = Math.min(compute_from_tick + tick_limit, tick); // pauses after 16*64 ticks of no posts
        for (var t = compute_from_tick; t < compute_to_tick; ++t) {
          //++count_ticks;
          this.execute(t);
        };
      }
      this.display = null;
      this.app_global_tick = tick;
      //if (this.app_global_tick > (Date.now() - 1000) / 62.5) {
        //console.log("At " + tick + "("+(compute_to_tick-compute_from_tick)+" computed)");
      //}
    }
  }

  // receives a timestamp and execute its posts and tick
  execute(t) {
    var posts = this.app_global_posts[String(t)];
    var state = this.app_state.global;
    if (posts) {
      for (var i = 0; i < posts.length; ++i) {
        var post = posts[i];
        state = this.app.post(post.tick)(post.room)(post.addr)(post.data)(state);
      }
    }
    if (this.app_has_ticker) {
      state = this.app.tick(BigInt(t))(state);
    }
    this.app_global_states = StateList.push({tick: t+1, state}, this.app_global_states);
    this.app_state.global = state;
  }

  // Resets the state and recomputes all posts
  recompute_posts() {
    this.app_global_states = null;
    this.app_global_tick = null;
    this.app_global_begin = null;
    this.app_global_posts = {};
    this.app_state.global = this.app.init.global;
    for (var post of this.received_posts) {
      //console.log("recompute post: " + JSON.stringify(post));
      this.register_post(post);
    }
  }

  // Performs an IO computation
  run_io(io) {
    //console.log("hmmm", io);
    switch (io._) {
      case "IO.end":
        switch (io.value._) {
          case "Maybe.none":
            return Promise.resolve(null);
          case "Maybe.some": 
            this.app_state.local = io.value.value;
            return Promise.resolve(io.value.value);
        }
        break;
      case "IO.ask":
        // console.log("IO.ask", io);
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
            case "request": 
              return fetch(encodeURI(io.param))
                .then(result => result.text())
                .then(result => this.run_io(io.then(result)))
                .then(res)
                .catch(err => {
                  let msg = err.message;
                  let call_fix = ".\nLet us know ..."; // TODO: add call to Github issue
                  this.run_io(io.then("Oops, something went wrong: "+ msg + call_fix))
                });
            case "unwatch":
              if (utils.is_valid_hex(64, io.param)) {
                this.watching[io.param] = false;
                window.KindEvents.unwatch_room(io.param);
                this.recompute_posts();
              } else {
                // console.log("Error: invalid input on App.Action.unwatch");
              }
              return this.run_io(io.then("")).then(res).catch(err);
            case "watch":
              if (utils.is_valid_hex(64, io.param)) {
                //console.log('watch', io.param);
                this.watching[io.param] = true;
                window.KindEvents.watch_room(io.param);
                this.recompute_posts();
                window.KindEvents.on_post(({ room, tick, addr, data }) => {
                  var tick = parseInt(tick, 16);
                  this.register_post({room,tick,addr,data});
                  this.received_posts.push({room,tick,addr,data});
                  //this.register_event({ _: "App.Event.post", time, room, addr : addr, data });
                });
              } else {
                // console.log("Error: invalid input on App.Action.watch");
              }
              return this.run_io(io.then("")).then(res).catch(err);
            case "post":
              var [room, data] = io.param.split(";");
              if (utils.is_valid_hex(64, room) && utils.is_valid_hex(null, data)) {
                window.KindEvents.send_post(room, data);
              } else {
                // console.log("Error: invalid input on App.Action.post");
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
          style: style,
          onInput: (event) => {
            if (elem.tag === "input" || elem.tag === "textarea") {
              let time = BigInt(Date.now());
              this.register_event({_: "App.Event.input", time, id: props.id, text: event.target.value});
            }
          },
        }, utils.list_to_array(elem.children).map(x => this.render_dom(x)));
      // Renders a VoxBox using a canvas
      case "DOM.vbox":
        let canvas_props = utils.map_to_object(elem.props);
        let canvas_style = utils.map_to_object(elem.style);
        var id       = canvas_props ? canvas_props.id || "" : "";
        var width    = Number(canvas_props.width) || 256;
        var height   = Number(canvas_props.height) || 256;
        var scale    = Number(canvas_props.scale) || 1;
        var canvas   = this.get_canvas(id, width, height, scale);
        var length   = elem.value.length;
        var capacity = elem.value.capacity;
        var buffer   = elem.value.buffer;
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
    } else if (this.display) {
      return h("pre",
        {
          id: "container",
          style: {
            "width": "100%",
            "height": "100%",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
          },
        },
        [this.display]);
    } else {
      return h("div",
        {
          id: "container",
          style: {
            "width": "100%",
            "height": "100%",
          },
        },
        this.render_dom(this.rendered));
    }
  }

  // remove canvas element
  // used to avoid creation of infinite canvas
  remove_canvas(id) {
    let element = 
      id ? 
        document.getElementById(id) :
        document.querySelector("canvas")
    
    if (element) element.remove();
  }

  // Gets a pixel-art canvas
  get_canvas(id, width, height, scale=1) {
    if (!this.canvas[id] || this.canvas[id].width !== width || this.canvas[id].height !== height) {
      // console.log("creating canvas", id, width, height);
      this.remove_canvas(id);
      this.canvas[id] = document.createElement("canvas");
      this.canvas[id].id = id;
      this.canvas[id].classList.add("pixel-art");
      this.canvas[id].width = width;
      this.canvas[id].height = height;
      this.canvas[id].style.width = (width*scale) + "px";
      this.canvas[id].style.height = (height*scale) + "px";
      this.canvas[id].clear = { length: 0, data: new Uint32Array(width * height * 32) };
      //this.canvas[id].style.border = "1px solid black";
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

