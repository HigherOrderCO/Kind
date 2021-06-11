(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[967],{

/***/ 967:
/***/ ((module) => {

module.exports = (function() {
    function int_pos(i) {
        return i >= 0n ? i : 0n;
    };

    function int_neg(i) {
        return i < 0n ? -i : 0n;
    };

    function word_to_u8(w) {
        var u = 0;
        for (var i = 0; i < 8; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u8_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 8; ++i) {
            w = {
                _: (u >>> (8 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function word_to_u16(w) {
        var u = 0;
        for (var i = 0; i < 16; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u16_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 16; ++i) {
            w = {
                _: (u >>> (16 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u16_to_bits(x) {
        var s = '';
        for (var i = 0; i < 16; ++i) {
            s = (x & 1 ? '1' : '0') + s;
            x = x >>> 1;
        }
        return s;
    };

    function word_to_u32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >>> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_i32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function i32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function i32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_u64(w) {
        var u = 0n;
        for (var i = 0n; i < 64n; i += 1n) {
            u = u | (w._ === 'Word.i' ? 1n << i : 0n);
            w = w.pred;
        };
        return u;
    };

    function u64_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0n; i < 64n; i += 1n) {
            w = {
                _: (u >> (64n - i - 1n)) & 1n ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };
    var f64 = new Float64Array(1);
    var u32 = new Uint32Array(f64.buffer);

    function f64_get_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            return (u32[0] >>> i) & 1;
        } else {
            return (u32[1] >>> (i - 32)) & 1;
        }
    };

    function f64_set_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            u32[0] = u32[0] | (1 << i);
        } else {
            u32[1] = u32[1] | (1 << (i - 32));
        }
        return f64[0];
    };

    function word_to_f64(w) {
        var x = 0;
        for (var i = 0; i < 64; ++i) {
            x = w._ === 'Word.i' ? f64_set_bit(x, i) : x;
            w = w.pred;
        };
        return x;
    };

    function f64_to_word(x) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 64; ++i) {
            w = {
                _: f64_get_bit(x, 64 - i - 1) ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function f64_make(s, a, b) {
        return (s ? 1 : -1) * Number(a) / 10 ** Number(b);
    };

    function u32array_to_buffer32(a) {
        function go(a, buffer) {
            switch (a._) {
                case 'Array.tip':
                    buffer.push(a.value);
                    break;
                case 'Array.tie':
                    go(a.lft, buffer);
                    go(a.rgt, buffer);
                    break;
            }
            return buffer;
        };
        return new Uint32Array(go(a, []));
    };

    function buffer32_to_u32array(b) {
        function go(b) {
            if (b.length === 1) {
                return {
                    _: 'Array.tip',
                    value: b[0]
                };
            } else {
                var lft = go(b.slice(0, b.length / 2));
                var rgt = go(b.slice(b.length / 2));
                return {
                    _: 'Array.tie',
                    lft,
                    rgt
                };
            };
        };
        return go(b);
    };

    function buffer32_to_depth(b) {
        return BigInt(Math.log(b.length) / Math.log(2));
    };
    var bitsmap_new = {
        _: 'BitsMap.new'
    };
    var bitsmap_tie = function(val, lft, rgt) {
        return {
            _: 'BitsMap.tip',
            val,
            lft,
            rgt
        };
    }
    var maybe_none = {
        _: 'Maybe.none'
    };
    var maybe_some = function(value) {
        return {
            _: 'Maybe.some',
            value
        };
    }
    var bitsmap_get = function(bits, map) {
        for (var i = bits.length - 1; i >= 0; --i) {
            if (map._ !== 'BitsMap.new') {
                map = bits[i] === '0' ? map.lft : map.rgt;
            }
        }
        return map._ === 'BitsMap.new' ? maybe_none : map.val;
    }
    var bitsmap_set = function(bits, val, map, mode) {
        var res = {
            value: map
        };
        var key = 'value';
        var obj = res;
        for (var i = bits.length - 1; i >= 0; --i) {
            var map = obj[key];
            if (map._ === 'BitsMap.new') {
                obj[key] = {
                    _: 'BitsMap.tie',
                    val: maybe_none,
                    lft: bitsmap_new,
                    rgt: bitsmap_new
                };
            } else {
                obj[key] = {
                    _: 'BitsMap.tie',
                    val: map.val,
                    lft: map.lft,
                    rgt: map.rgt
                };
            }
            obj = obj[key];
            key = bits[i] === '0' ? 'lft' : 'rgt';
        }
        var map = obj[key];
        if (map._ === 'BitsMap.new') {
            var x = mode === 'del' ? maybe_none : {
                _: 'Maybe.some',
                value: val
            };
            obj[key] = {
                _: 'BitsMap.tie',
                val: x,
                lft: bitsmap_new,
                rgt: bitsmap_new
            };
        } else {
            var x = mode === 'set' ? {
                _: 'Maybe.some',
                value: val
            } : mode === 'del' ? maybe_none : map.val;
            obj[key] = {
                _: 'BitsMap.tie',
                val: x,
                lft: map.lft,
                rgt: map.rgt
            };
        }
        return res.value;
    };
    var nat_to_bits = n => {
        return n === 0n ? '' : n.toString(2);
    };
    const inst_unit = x => x(null);
    const elim_unit = (x => {
        var $1 = (() => c0 => {
            var self = x;
            switch ("unit") {
                case 'unit':
                    var $0 = c0;
                    return $0;
            };
        })();
        return $1;
    });
    const inst_bool = x => x(true)(false);
    const elim_bool = (x => {
        var $4 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $2 = c0;
                return $2;
            } else {
                var $3 = c1;
                return $3;
            };
        })();
        return $4;
    });
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $8 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $5 = c0;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c1($6);
                return $7;
            };
        })();
        return $8;
    });
    const inst_int = x => x(x0 => x1 => x0 - x1);
    const elim_int = (x => {
        var $12 = (() => c0 => {
            var self = x;
            switch ("new") {
                case 'new':
                    var $9 = int_pos(self);
                    var $10 = int_neg(self);
                    var $11 = c0($9)($10);
                    return $11;
            };
        })();
        return $12;
    });
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $18 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $13 = self.slice(0, -1);
                    var $14 = c1($13);
                    return $14;
                case 'i':
                    var $15 = self.slice(0, -1);
                    var $16 = c2($15);
                    return $16;
                case 'e':
                    var $17 = c0;
                    return $17;
            };
        })();
        return $18;
    });
    const inst_u8 = x => x(x0 => word_to_u8(x0));
    const elim_u8 = (x => {
        var $21 = (() => c0 => {
            var self = x;
            switch ('u8') {
                case 'u8':
                    var $19 = u8_to_word(self);
                    var $20 = c0($19);
                    return $20;
            };
        })();
        return $21;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $24 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $22 = u16_to_word(self);
                    var $23 = c0($22);
                    return $23;
            };
        })();
        return $24;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $27 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $25 = u32_to_word(self);
                    var $26 = c0($25);
                    return $26;
            };
        })();
        return $27;
    });
    const inst_i32 = x => x(x0 => word_to_i32(x0));
    const elim_i32 = (x => {
        var $30 = (() => c0 => {
            var self = x;
            switch ('i32') {
                case 'i32':
                    var $28 = i32_to_word(self);
                    var $29 = c0($28);
                    return $29;
            };
        })();
        return $30;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $33 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $31 = u64_to_word(self);
                    var $32 = c0($31);
                    return $32;
            };
        })();
        return $33;
    });
    const inst_f64 = x => x(x0 => word_to_f64(x0));
    const elim_f64 = (x => {
        var $36 = (() => c0 => {
            var self = x;
            switch ('f64') {
                case 'f64':
                    var $34 = f64_to_word(self);
                    var $35 = c0($34);
                    return $35;
            };
        })();
        return $36;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $41 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $37 = c0;
                return $37;
            } else {
                var $38 = self.charCodeAt(0);
                var $39 = self.slice(1);
                var $40 = c1($38)($39);
                return $40;
            };
        })();
        return $41;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $45 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $42 = buffer32_to_depth(self);
                    var $43 = buffer32_to_u32array(self);
                    var $44 = c0($42)($43);
                    return $44;
            };
        })();
        return $45;
    });

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $46 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $46;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);

    function Pair$new$(_fst$3, _snd$4) {
        var $47 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $47;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$KL$State = App$State$new;

    function App$KL$State$Local$lobby$(_state$1) {
        var $48 = ({
            _: 'App.KL.State.Local.lobby',
            'state': _state$1
        });
        return $48;
    };
    const App$KL$State$Local$lobby = x0 => App$KL$State$Local$lobby$(x0);

    function App$KL$Lobby$State$Local$new$(_user$1, _room_input$2) {
        var $49 = ({
            _: 'App.KL.Lobby.State.Local.new',
            'user': _user$1,
            'room_input': _room_input$2
        });
        return $49;
    };
    const App$KL$Lobby$State$Local$new = x0 => x1 => App$KL$Lobby$State$Local$new$(x0, x1);
    const App$KL$State$Global$new = ({
        _: 'App.KL.State.Global.new'
    });

    function App$Store$new$(_local$2, _global$3) {
        var $50 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $50;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const App$KL$init = (() => {
        var _local$1 = App$KL$State$Local$lobby$(App$KL$Lobby$State$Local$new$("", ""));
        var _global$2 = App$KL$State$Global$new;
        var $51 = App$Store$new$(_local$1, _global$2);
        return $51;
    })();

    function BitsMap$(_A$1) {
        var $52 = null;
        return $52;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $53 = null;
        return $53;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $54 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $54;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $55 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $55;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $57 = self.pred;
                var $58 = (Word$to_bits$($57) + '0');
                var $56 = $58;
                break;
            case 'Word.i':
                var $59 = self.pred;
                var $60 = (Word$to_bits$($59) + '1');
                var $56 = $60;
                break;
            case 'Word.e':
                var $61 = Bits$e;
                var $56 = $61;
                break;
        };
        return $56;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $62 = 1n + _pred$1;
        return $62;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $64 = Bits$e;
            var $63 = $64;
        } else {
            var $65 = self.charCodeAt(0);
            var $66 = self.slice(1);
            var $67 = (String$to_bits$($66) + (u16_to_bits($65)));
            var $63 = $67;
        };
        return $63;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $69 = self.head;
                var $70 = self.tail;
                var self = $69;
                switch (self._) {
                    case 'Pair.new':
                        var $72 = self.fst;
                        var $73 = self.snd;
                        var $74 = (bitsmap_set(String$to_bits$($72), $73, Map$from_list$($70), 'set'));
                        var $71 = $74;
                        break;
                };
                var $68 = $71;
                break;
            case 'List.nil':
                var $75 = BitsMap$new;
                var $68 = $75;
                break;
        };
        return $68;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $76 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $76;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $77 = null;
        return $77;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $78 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $78;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function DOM$text$(_value$1) {
        var $79 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $79;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const Map$new = BitsMap$new;

    function App$KL$Lobby$draw$input$(_id$1, _value$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("outline", "transparent"), List$nil))));
        var $80 = DOM$node$("input", Map$from_list$(List$cons$(Pair$new$("value", _value$2), List$cons$(Pair$new$("id", _id$1), List$nil))), _style$3, List$nil);
        return $80;
    };
    const App$KL$Lobby$draw$input = x0 => x1 => App$KL$Lobby$draw$input$(x0, x1);

    function App$KL$Lobby$draw$button$(_id$1, _content$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("margin-left", "10px"), List$cons$(Pair$new$("padding", "2px"), List$nil)))));
        var $81 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", _id$1), List$nil)), _style$3, List$cons$(DOM$text$(_content$2), List$nil));
        return $81;
    };
    const App$KL$Lobby$draw$button = x0 => x1 => App$KL$Lobby$draw$button$(x0, x1);

    function App$KL$Lobby$draw$(_local$1) {
        var self = _local$1;
        switch (self._) {
            case 'App.KL.Lobby.State.Local.new':
                var $83 = self.room_input;
                var _style$4 = Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("font-size", "2rem"), List$nil))))))));
                var $84 = DOM$node$("div", Map$from_list$(List$nil), _style$4, List$cons$(DOM$node$("h1", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), List$cons$(DOM$text$("Welcome to Kaelin"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$("Enter a room number: "), List$cons$(App$KL$Lobby$draw$input$("text", $83), List$cons$(App$KL$Lobby$draw$button$("ready", "Enter"), List$cons$(App$KL$Lobby$draw$button$("random", "Random"), List$nil))))), List$nil)));
                var $82 = $84;
                break;
        };
        return $82;
    };
    const App$KL$Lobby$draw = x0 => App$KL$Lobby$draw$(x0);

    function App$KL$Game$draw$(_local$1) {
        var $85 = DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$("TODO"), List$nil));
        return $85;
    };
    const App$KL$Game$draw = x0 => App$KL$Game$draw$(x0);

    function App$KL$draw$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'App.Store.new':
                var $87 = self.local;
                var self = $87;
                switch (self._) {
                    case 'App.KL.State.Local.lobby':
                        var $89 = self.state;
                        var $90 = App$KL$Lobby$draw$($89);
                        var $88 = $90;
                        break;
                    case 'App.KL.State.Local.game':
                        var $91 = self.state;
                        var $92 = App$KL$Game$draw$($91);
                        var $88 = $92;
                        break;
                };
                var $86 = $88;
                break;
        };
        return $86;
    };
    const App$KL$draw = x0 => App$KL$draw$(x0);

    function IO$(_A$1) {
        var $93 = null;
        return $93;
    };
    const IO = x0 => IO$(x0);

    function Maybe$(_A$1) {
        var $94 = null;
        return $94;
    };
    const Maybe = x0 => Maybe$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $96 = self.fst;
                var $97 = $96;
                var $95 = $97;
                break;
        };
        return $95;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;
    const String$nil = '';

    function String$cons$(_head$1, _tail$2) {
        var $98 = (String.fromCharCode(_head$1) + _tail$2);
        return $98;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);

    function String$map$(_f$1, _as$2) {
        var self = _as$2;
        if (self.length === 0) {
            var $100 = String$nil;
            var $99 = $100;
        } else {
            var $101 = self.charCodeAt(0);
            var $102 = self.slice(1);
            var $103 = String$cons$(_f$1($101), String$map$(_f$1, $102));
            var $99 = $103;
        };
        return $99;
    };
    const String$map = x0 => x1 => String$map$(x0, x1);
    const Bool$false = false;
    const Bool$and = a0 => a1 => (a0 && a1);
    const Bool$true = true;

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $105 = Bool$false;
                var $104 = $105;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $106 = Bool$true;
                var $104 = $106;
                break;
        };
        return $104;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);
    const Cmp$ltn = ({
        _: 'Cmp.ltn'
    });
    const Cmp$gtn = ({
        _: 'Cmp.gtn'
    });

    function Word$cmp$go$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $108 = self.pred;
                var $109 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $111 = self.pred;
                            var $112 = (_a$pred$10 => {
                                var $113 = Word$cmp$go$(_a$pred$10, $111, _c$4);
                                return $113;
                            });
                            var $110 = $112;
                            break;
                        case 'Word.i':
                            var $114 = self.pred;
                            var $115 = (_a$pred$10 => {
                                var $116 = Word$cmp$go$(_a$pred$10, $114, Cmp$ltn);
                                return $116;
                            });
                            var $110 = $115;
                            break;
                        case 'Word.e':
                            var $117 = (_a$pred$8 => {
                                var $118 = _c$4;
                                return $118;
                            });
                            var $110 = $117;
                            break;
                    };
                    var $110 = $110($108);
                    return $110;
                });
                var $107 = $109;
                break;
            case 'Word.i':
                var $119 = self.pred;
                var $120 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $122 = self.pred;
                            var $123 = (_a$pred$10 => {
                                var $124 = Word$cmp$go$(_a$pred$10, $122, Cmp$gtn);
                                return $124;
                            });
                            var $121 = $123;
                            break;
                        case 'Word.i':
                            var $125 = self.pred;
                            var $126 = (_a$pred$10 => {
                                var $127 = Word$cmp$go$(_a$pred$10, $125, _c$4);
                                return $127;
                            });
                            var $121 = $126;
                            break;
                        case 'Word.e':
                            var $128 = (_a$pred$8 => {
                                var $129 = _c$4;
                                return $129;
                            });
                            var $121 = $128;
                            break;
                    };
                    var $121 = $121($119);
                    return $121;
                });
                var $107 = $120;
                break;
            case 'Word.e':
                var $130 = (_b$5 => {
                    var $131 = _c$4;
                    return $131;
                });
                var $107 = $130;
                break;
        };
        var $107 = $107(_b$3);
        return $107;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $132 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $132;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $133 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $133;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $135 = Bool$true;
                var $134 = $135;
                break;
            case 'Cmp.gtn':
                var $136 = Bool$false;
                var $134 = $136;
                break;
        };
        return $134;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $137 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $137;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U16$lte = a0 => a1 => (a0 <= a1);

    function U16$new$(_value$1) {
        var $138 = word_to_u16(_value$1);
        return $138;
    };
    const U16$new = x0 => U16$new$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$(_size$1) {
        var $139 = null;
        return $139;
    };
    const Word = x0 => Word$(x0);

    function Word$i$(_pred$2) {
        var $140 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $140;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $141 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $141;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $143 = self.pred;
                var $144 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $146 = self.pred;
                            var $147 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $149 = Word$i$(Word$adder$(_a$pred$10, $146, Bool$false));
                                    var $148 = $149;
                                } else {
                                    var $150 = Word$o$(Word$adder$(_a$pred$10, $146, Bool$false));
                                    var $148 = $150;
                                };
                                return $148;
                            });
                            var $145 = $147;
                            break;
                        case 'Word.i':
                            var $151 = self.pred;
                            var $152 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $154 = Word$o$(Word$adder$(_a$pred$10, $151, Bool$true));
                                    var $153 = $154;
                                } else {
                                    var $155 = Word$i$(Word$adder$(_a$pred$10, $151, Bool$false));
                                    var $153 = $155;
                                };
                                return $153;
                            });
                            var $145 = $152;
                            break;
                        case 'Word.e':
                            var $156 = (_a$pred$8 => {
                                var $157 = Word$e;
                                return $157;
                            });
                            var $145 = $156;
                            break;
                    };
                    var $145 = $145($143);
                    return $145;
                });
                var $142 = $144;
                break;
            case 'Word.i':
                var $158 = self.pred;
                var $159 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $161 = self.pred;
                            var $162 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $164 = Word$o$(Word$adder$(_a$pred$10, $161, Bool$true));
                                    var $163 = $164;
                                } else {
                                    var $165 = Word$i$(Word$adder$(_a$pred$10, $161, Bool$false));
                                    var $163 = $165;
                                };
                                return $163;
                            });
                            var $160 = $162;
                            break;
                        case 'Word.i':
                            var $166 = self.pred;
                            var $167 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $169 = Word$i$(Word$adder$(_a$pred$10, $166, Bool$true));
                                    var $168 = $169;
                                } else {
                                    var $170 = Word$o$(Word$adder$(_a$pred$10, $166, Bool$true));
                                    var $168 = $170;
                                };
                                return $168;
                            });
                            var $160 = $167;
                            break;
                        case 'Word.e':
                            var $171 = (_a$pred$8 => {
                                var $172 = Word$e;
                                return $172;
                            });
                            var $160 = $171;
                            break;
                    };
                    var $160 = $160($158);
                    return $160;
                });
                var $142 = $159;
                break;
            case 'Word.e':
                var $173 = (_b$5 => {
                    var $174 = Word$e;
                    return $174;
                });
                var $142 = $173;
                break;
        };
        var $142 = $142(_b$3);
        return $142;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $175 = Word$adder$(_a$2, _b$3, Bool$false);
        return $175;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Nat$apply$(_n$2, _f$3, _x$4) {
        var Nat$apply$ = (_n$2, _f$3, _x$4) => ({
            ctr: 'TCO',
            arg: [_n$2, _f$3, _x$4]
        });
        var Nat$apply = _n$2 => _f$3 => _x$4 => Nat$apply$(_n$2, _f$3, _x$4);
        var arg = [_n$2, _f$3, _x$4];
        while (true) {
            let [_n$2, _f$3, _x$4] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $176 = _x$4;
                    return $176;
                } else {
                    var $177 = (self - 1n);
                    var $178 = Nat$apply$($177, _f$3, _f$3(_x$4));
                    return $178;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $180 = self.pred;
                var $181 = Word$i$($180);
                var $179 = $181;
                break;
            case 'Word.i':
                var $182 = self.pred;
                var $183 = Word$o$(Word$inc$($182));
                var $179 = $183;
                break;
            case 'Word.e':
                var $184 = Word$e;
                var $179 = $184;
                break;
        };
        return $179;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $186 = Word$e;
            var $185 = $186;
        } else {
            var $187 = (self - 1n);
            var $188 = Word$o$(Word$zero$($187));
            var $185 = $188;
        };
        return $185;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $189 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $189;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);

    function Char$to_lower$(_char$1) {
        var self = ((_char$1 >= 65) && (_char$1 <= 90));
        if (self) {
            var $191 = ((_char$1 + 32) & 0xFFFF);
            var $190 = $191;
        } else {
            var $192 = _char$1;
            var $190 = $192;
        };
        return $190;
    };
    const Char$to_lower = x0 => Char$to_lower$(x0);

    function String$to_lower$(_str$1) {
        var $193 = String$map$(Char$to_lower, _str$1);
        return $193;
    };
    const String$to_lower = x0 => String$to_lower$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $194 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $194;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $196 = self.value;
                var $197 = _f$4($196);
                var $195 = $197;
                break;
            case 'IO.ask':
                var $198 = self.query;
                var $199 = self.param;
                var $200 = self.then;
                var $201 = IO$ask$($198, $199, (_x$8 => {
                    var $202 = IO$bind$($200(_x$8), _f$4);
                    return $202;
                }));
                var $195 = $201;
                break;
        };
        return $195;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $203 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $203;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $204 = _new$2(IO$bind)(IO$end);
        return $204;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function App$set_local$(_value$2) {
        var $205 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $206 = _m$pure$4;
            return $206;
        }))(Maybe$some$(_value$2));
        return $205;
    };
    const App$set_local = x0 => App$set_local$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $207 = _m$pure$3;
        return $207;
    }))(Maybe$none);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $209 = Bool$false;
                var $208 = $209;
                break;
            case 'Cmp.eql':
                var $210 = Bool$true;
                var $208 = $210;
                break;
        };
        return $208;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $211 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $211;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $212 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $212;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $214 = self.val;
                var $215 = Maybe$some$($214);
                var $213 = $215;
                break;
            case 'Parser.Reply.error':
                var $216 = Maybe$none;
                var $213 = $216;
                break;
        };
        return $213;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $217 = null;
        return $217;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function List$(_A$1) {
        var $218 = null;
        return $218;
    };
    const List = x0 => List$(x0);

    function Parser$Reply$error$(_err$2) {
        var $219 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $219;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $221 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $223 = self.idx;
                        var self = ($221 > $223);
                        if (self) {
                            var $225 = _a$1;
                            var $224 = $225;
                        } else {
                            var $226 = _b$2;
                            var $224 = $226;
                        };
                        var $222 = $224;
                        break;
                };
                var $220 = $222;
                break;
        };
        return $220;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $228 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $230 = self.value;
                        var $231 = Maybe$some$(Parser$Error$combine$($228, $230));
                        var $229 = $231;
                        break;
                    case 'Maybe.none':
                        var $232 = _a$1;
                        var $229 = $232;
                        break;
                };
                var $227 = $229;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $234 = Maybe$none;
                        var $233 = $234;
                        break;
                    case 'Maybe.some':
                        var $235 = _b$2;
                        var $233 = $235;
                        break;
                };
                var $227 = $233;
                break;
        };
        return $227;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $236 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $236;
    };
    const Parser$Reply$value = x0 => x1 => Parser$Reply$value$(x0, x1);

    function Parser$many$go$(_parse$2, _values$3, _pst$4) {
        var Parser$many$go$ = (_parse$2, _values$3, _pst$4) => ({
            ctr: 'TCO',
            arg: [_parse$2, _values$3, _pst$4]
        });
        var Parser$many$go = _parse$2 => _values$3 => _pst$4 => Parser$many$go$(_parse$2, _values$3, _pst$4);
        var arg = [_parse$2, _values$3, _pst$4];
        while (true) {
            let [_parse$2, _values$3, _pst$4] = arg;
            var R = (() => {
                var self = _pst$4;
                switch (self._) {
                    case 'Parser.State.new':
                        var self = _parse$2(_pst$4);
                        switch (self._) {
                            case 'Parser.Reply.value':
                                var $238 = self.pst;
                                var $239 = self.val;
                                var $240 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $241 = _values$3(List$cons$($239, _xs$12));
                                    return $241;
                                }), $238);
                                var $237 = $240;
                                break;
                            case 'Parser.Reply.error':
                                var $242 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $237 = $242;
                                break;
                        };
                        return $237;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $243 = Parser$many$go(_parser$2)((_x$3 => {
            var $244 = _x$3;
            return $244;
        }));
        return $243;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $246 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $248 = self.err;
                        var self = $246;
                        switch (self._) {
                            case 'Maybe.some':
                                var $250 = self.value;
                                var $251 = Parser$Reply$error$(Parser$Error$combine$($250, $248));
                                var $249 = $251;
                                break;
                            case 'Maybe.none':
                                var $252 = Parser$Reply$error$($248);
                                var $249 = $252;
                                break;
                        };
                        var $247 = $249;
                        break;
                    case 'Parser.Reply.value':
                        var $253 = self.pst;
                        var $254 = self.val;
                        var self = $253;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $256 = self.err;
                                var $257 = self.nam;
                                var $258 = self.ini;
                                var $259 = self.idx;
                                var $260 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($246, $256), $257, $258, $259, $260);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $262 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $264 = self.err;
                                                var self = $262;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $266 = self.value;
                                                        var $267 = Parser$Reply$error$(Parser$Error$combine$($266, $264));
                                                        var $265 = $267;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $268 = Parser$Reply$error$($264);
                                                        var $265 = $268;
                                                        break;
                                                };
                                                var $263 = $265;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $269 = self.pst;
                                                var $270 = self.val;
                                                var self = $269;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $272 = self.err;
                                                        var $273 = self.nam;
                                                        var $274 = self.ini;
                                                        var $275 = self.idx;
                                                        var $276 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($262, $272), $273, $274, $275, $276);
                                                        var $277 = Parser$Reply$value$(_reply$pst$31, List$cons$($254, $270));
                                                        var $271 = $277;
                                                        break;
                                                };
                                                var $263 = $271;
                                                break;
                                        };
                                        var $261 = $263;
                                        break;
                                };
                                var $255 = $261;
                                break;
                        };
                        var $247 = $255;
                        break;
                };
                var $245 = $247;
                break;
        };
        return $245;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $278 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $278;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $279 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $279;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $281 = self.err;
                var $282 = self.nam;
                var $283 = self.ini;
                var $284 = self.idx;
                var $285 = self.str;
                var self = $285;
                if (self.length === 0) {
                    var $287 = Parser$Reply$fail$($282, $283, $284, "Not a digit.");
                    var $286 = $287;
                } else {
                    var $288 = self.charCodeAt(0);
                    var $289 = self.slice(1);
                    var _pst$9 = Parser$State$new$($281, $282, $283, Nat$succ$($284), $289);
                    var self = ($288 === 48);
                    if (self) {
                        var $291 = Parser$Reply$value$(_pst$9, 0n);
                        var $290 = $291;
                    } else {
                        var self = ($288 === 49);
                        if (self) {
                            var $293 = Parser$Reply$value$(_pst$9, 1n);
                            var $292 = $293;
                        } else {
                            var self = ($288 === 50);
                            if (self) {
                                var $295 = Parser$Reply$value$(_pst$9, 2n);
                                var $294 = $295;
                            } else {
                                var self = ($288 === 51);
                                if (self) {
                                    var $297 = Parser$Reply$value$(_pst$9, 3n);
                                    var $296 = $297;
                                } else {
                                    var self = ($288 === 52);
                                    if (self) {
                                        var $299 = Parser$Reply$value$(_pst$9, 4n);
                                        var $298 = $299;
                                    } else {
                                        var self = ($288 === 53);
                                        if (self) {
                                            var $301 = Parser$Reply$value$(_pst$9, 5n);
                                            var $300 = $301;
                                        } else {
                                            var self = ($288 === 54);
                                            if (self) {
                                                var $303 = Parser$Reply$value$(_pst$9, 6n);
                                                var $302 = $303;
                                            } else {
                                                var self = ($288 === 55);
                                                if (self) {
                                                    var $305 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $304 = $305;
                                                } else {
                                                    var self = ($288 === 56);
                                                    if (self) {
                                                        var $307 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $306 = $307;
                                                    } else {
                                                        var self = ($288 === 57);
                                                        if (self) {
                                                            var $309 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $308 = $309;
                                                        } else {
                                                            var $310 = Parser$Reply$fail$($282, $283, $284, "Not a digit.");
                                                            var $308 = $310;
                                                        };
                                                        var $306 = $308;
                                                    };
                                                    var $304 = $306;
                                                };
                                                var $302 = $304;
                                            };
                                            var $300 = $302;
                                        };
                                        var $298 = $300;
                                    };
                                    var $296 = $298;
                                };
                                var $294 = $296;
                            };
                            var $292 = $294;
                        };
                        var $290 = $292;
                    };
                    var $286 = $290;
                };
                var $280 = $286;
                break;
        };
        return $280;
    };
    const Parser$digit = x0 => Parser$digit$(x0);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4) {
        var Nat$from_base$go$ = (_b$1, _ds$2, _p$3, _res$4) => ({
            ctr: 'TCO',
            arg: [_b$1, _ds$2, _p$3, _res$4]
        });
        var Nat$from_base$go = _b$1 => _ds$2 => _p$3 => _res$4 => Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4);
        var arg = [_b$1, _ds$2, _p$3, _res$4];
        while (true) {
            let [_b$1, _ds$2, _p$3, _res$4] = arg;
            var R = (() => {
                var self = _ds$2;
                switch (self._) {
                    case 'List.cons':
                        var $311 = self.head;
                        var $312 = self.tail;
                        var $313 = Nat$from_base$go$(_b$1, $312, (_b$1 * _p$3), (($311 * _p$3) + _res$4));
                        return $313;
                    case 'List.nil':
                        var $314 = _res$4;
                        return $314;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function List$reverse$go$(_xs$2, _res$3) {
        var List$reverse$go$ = (_xs$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_xs$2, _res$3]
        });
        var List$reverse$go = _xs$2 => _res$3 => List$reverse$go$(_xs$2, _res$3);
        var arg = [_xs$2, _res$3];
        while (true) {
            let [_xs$2, _res$3] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $315 = self.head;
                        var $316 = self.tail;
                        var $317 = List$reverse$go$($316, List$cons$($315, _res$3));
                        return $317;
                    case 'List.nil':
                        var $318 = _res$3;
                        return $318;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $319 = List$reverse$go$(_xs$2, List$nil);
        return $319;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Nat$from_base$(_base$1, _ds$2) {
        var $320 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $320;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $322 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $324 = self.err;
                        var self = $322;
                        switch (self._) {
                            case 'Maybe.some':
                                var $326 = self.value;
                                var $327 = Parser$Reply$error$(Parser$Error$combine$($326, $324));
                                var $325 = $327;
                                break;
                            case 'Maybe.none':
                                var $328 = Parser$Reply$error$($324);
                                var $325 = $328;
                                break;
                        };
                        var $323 = $325;
                        break;
                    case 'Parser.Reply.value':
                        var $329 = self.pst;
                        var $330 = self.val;
                        var self = $329;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $332 = self.err;
                                var $333 = self.nam;
                                var $334 = self.ini;
                                var $335 = self.idx;
                                var $336 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($322, $332), $333, $334, $335, $336);
                                var $337 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $330));
                                var $331 = $337;
                                break;
                        };
                        var $323 = $331;
                        break;
                };
                var $321 = $323;
                break;
        };
        return $321;
    };
    const Parser$nat = x0 => Parser$nat$(x0);
    const Nat$read = a0 => (BigInt(a0));
    const IO$get_time = IO$ask$("get_time", "", (_time$1 => {
        var $338 = IO$end$((BigInt(_time$1)));
        return $338;
    }));

    function Nat$mod$go$(_n$1, _m$2, _r$3) {
        var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _r$3]
        });
        var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
        var arg = [_n$1, _m$2, _r$3];
        while (true) {
            let [_n$1, _m$2, _r$3] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $339 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $339;
                } else {
                    var $340 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $342 = _r$3;
                        var $341 = $342;
                    } else {
                        var $343 = (self - 1n);
                        var $344 = Nat$mod$go$($343, $340, Nat$succ$(_r$3));
                        var $341 = $344;
                    };
                    return $341;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);

    function Nat$random$(_seed$1) {
        var _m$2 = 1664525n;
        var _i$3 = 1013904223n;
        var _q$4 = 4294967296n;
        var $345 = (((_seed$1 * _m$2) + _i$3) % _q$4);
        return $345;
    };
    const Nat$random = x0 => Nat$random$(x0);

    function IO$random$(_a$1) {
        var $346 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $347 = _m$bind$2;
            return $347;
        }))(IO$get_time)((_seed$2 => {
            var _seed$3 = Nat$random$(_seed$2);
            var $348 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $349 = _m$pure$5;
                return $349;
            }))((_seed$3 % _a$1));
            return $348;
        }));
        return $346;
    };
    const IO$random = x0 => IO$random$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $351 = self.head;
                var $352 = self.tail;
                var $353 = _cons$5($351)(List$fold$($352, _nil$4, _cons$5));
                var $350 = $353;
                break;
            case 'List.nil':
                var $354 = _nil$4;
                var $350 = $354;
                break;
        };
        return $350;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $355 = null;
        return $355;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $356 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $356;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $357 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $357;
    };
    const Either$right = x0 => Either$right$(x0);

    function Nat$sub_rem$(_n$1, _m$2) {
        var Nat$sub_rem$ = (_n$1, _m$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2]
        });
        var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
        var arg = [_n$1, _m$2];
        while (true) {
            let [_n$1, _m$2] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $358 = Either$left$(_n$1);
                    return $358;
                } else {
                    var $359 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $361 = Either$right$(Nat$succ$($359));
                        var $360 = $361;
                    } else {
                        var $362 = (self - 1n);
                        var $363 = Nat$sub_rem$($362, $359);
                        var $360 = $363;
                    };
                    return $360;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

    function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
        var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _d$3]
        });
        var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
        var arg = [_n$1, _m$2, _d$3];
        while (true) {
            let [_n$1, _m$2, _d$3] = arg;
            var R = (() => {
                var self = Nat$sub_rem$(_n$1, _m$2);
                switch (self._) {
                    case 'Either.left':
                        var $364 = self.value;
                        var $365 = Nat$div_mod$go$($364, _m$2, Nat$succ$(_d$3));
                        return $365;
                    case 'Either.right':
                        var $366 = Pair$new$(_d$3, _n$1);
                        return $366;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));

    function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
        var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_base$1, _nat$2, _res$3]
        });
        var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
        var arg = [_base$1, _nat$2, _res$3];
        while (true) {
            let [_base$1, _nat$2, _res$3] = arg;
            var R = (() => {
                var self = (({
                    _: 'Pair.new',
                    'fst': _nat$2 / _base$1,
                    'snd': _nat$2 % _base$1
                }));
                switch (self._) {
                    case 'Pair.new':
                        var $367 = self.fst;
                        var $368 = self.snd;
                        var self = $367;
                        if (self === 0n) {
                            var $370 = List$cons$($368, _res$3);
                            var $369 = $370;
                        } else {
                            var $371 = (self - 1n);
                            var $372 = Nat$to_base$go$(_base$1, $367, List$cons$($368, _res$3));
                            var $369 = $372;
                        };
                        return $369;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $373 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $373;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function List$at$(_index$2, _list$3) {
        var List$at$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $374 = self.head;
                        var $375 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $377 = Maybe$some$($374);
                            var $376 = $377;
                        } else {
                            var $378 = (self - 1n);
                            var $379 = List$at$($378, $375);
                            var $376 = $379;
                        };
                        return $376;
                    case 'List.nil':
                        var $380 = Maybe$none;
                        return $380;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = (_n$2 % _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $383 = self.value;
                    var $384 = $383;
                    var $382 = $384;
                    break;
                case 'Maybe.none':
                    var $385 = 35;
                    var $382 = $385;
                    break;
            };
            var $381 = $382;
        } else {
            var $386 = 35;
            var $381 = $386;
        };
        return $381;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $387 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $388 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $388;
        }));
        return $387;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $389 = Nat$to_string_base$(10n, _n$1);
        return $389;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const String$concat = a0 => a1 => (a0 + a1);

    function String$drop$(_n$1, _xs$2) {
        var String$drop$ = (_n$1, _xs$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _xs$2]
        });
        var String$drop = _n$1 => _xs$2 => String$drop$(_n$1, _xs$2);
        var arg = [_n$1, _xs$2];
        while (true) {
            let [_n$1, _xs$2] = arg;
            var R = (() => {
                var self = _n$1;
                if (self === 0n) {
                    var $390 = _xs$2;
                    return $390;
                } else {
                    var $391 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $393 = String$nil;
                        var $392 = $393;
                    } else {
                        var $394 = self.charCodeAt(0);
                        var $395 = self.slice(1);
                        var $396 = String$drop$($391, $395);
                        var $392 = $396;
                    };
                    return $392;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function String$length$go$(_xs$1, _n$2) {
        var String$length$go$ = (_xs$1, _n$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _n$2]
        });
        var String$length$go = _xs$1 => _n$2 => String$length$go$(_xs$1, _n$2);
        var arg = [_xs$1, _n$2];
        while (true) {
            let [_xs$1, _n$2] = arg;
            var R = (() => {
                var self = _xs$1;
                if (self.length === 0) {
                    var $397 = _n$2;
                    return $397;
                } else {
                    var $398 = self.charCodeAt(0);
                    var $399 = self.slice(1);
                    var $400 = String$length$go$($399, Nat$succ$(_n$2));
                    return $400;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $401 = String$length$go$(_xs$1, 0n);
        return $401;
    };
    const String$length = x0 => String$length$(x0);
    const Unit$new = null;

    function IO$do$(_call$1, _param$2) {
        var $402 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $403 = IO$end$(Unit$new);
            return $403;
        }));
        return $402;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$2, _param$3) {
        var $404 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $405 = _m$bind$4;
            return $405;
        }))(IO$do$(_call$2, _param$3))((_$4 => {
            var $406 = App$pass;
            return $406;
        }));
        return $404;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$2) {
        var $407 = App$do$("watch", _room$2);
        return $407;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$new_post$(_room$2, _data$3) {
        var $408 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $409 = _m$bind$4;
            return $409;
        }))(App$do$("post", (_room$2 + (";" + _data$3))))((_$4 => {
            var $410 = App$pass;
            return $410;
        }));
        return $408;
    };
    const App$new_post = x0 => x1 => App$new_post$(x0, x1);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $412 = self.slice(0, -1);
                var $413 = ($412 + '1');
                var $411 = $413;
                break;
            case 'i':
                var $414 = self.slice(0, -1);
                var $415 = (Bits$inc$($414) + '0');
                var $411 = $415;
                break;
            case 'e':
                var $416 = (Bits$e + '1');
                var $411 = $416;
                break;
        };
        return $411;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function U8$to_bits$(_a$1) {
        var self = _a$1;
        switch ('u8') {
            case 'u8':
                var $418 = u8_to_word(self);
                var $419 = Word$to_bits$($418);
                var $417 = $419;
                break;
        };
        return $417;
    };
    const U8$to_bits = x0 => U8$to_bits$(x0);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $421 = self.head;
                var $422 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $424 = self.head;
                        var $425 = self.tail;
                        var $426 = List$cons$(Pair$new$($421, $424), List$zip$($422, $425));
                        var $423 = $426;
                        break;
                    case 'List.nil':
                        var $427 = List$nil;
                        var $423 = $427;
                        break;
                };
                var $420 = $423;
                break;
            case 'List.nil':
                var $428 = List$nil;
                var $420 = $428;
                break;
        };
        return $420;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $430 = self.head;
                var $431 = self.tail;
                var $432 = List$cons$($430, List$concat$($431, _bs$3));
                var $429 = $432;
                break;
            case 'List.nil':
                var $433 = _bs$3;
                var $429 = $433;
                break;
        };
        return $429;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function U8$new$(_value$1) {
        var $434 = word_to_u8(_value$1);
        return $434;
    };
    const U8$new = x0 => U8$new$(x0);
    const Nat$to_u8 = a0 => (Number(a0) & 0xFF);
    const App$Kaelin$Event$Code$action = List$cons$(2, List$nil);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $436 = String$nil;
            var $435 = $436;
        } else {
            var $437 = (self - 1n);
            var $438 = (_xs$1 + String$repeat$(_xs$1, $437));
            var $435 = $438;
        };
        return $435;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function App$Kaelin$Event$Code$Hex$set_min_length$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var $439 = (_hex$2 + String$repeat$("0", _dif$3));
        return $439;
    };
    const App$Kaelin$Event$Code$Hex$set_min_length = x0 => x1 => App$Kaelin$Event$Code$Hex$set_min_length$(x0, x1);

    function List$foldr$(_b$3, _f$4, _xs$5) {
        var $440 = List$fold$(_xs$5, _b$3, _f$4);
        return $440;
    };
    const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);
    const Nat$ltn = a0 => a1 => (a0 < a1);

    function App$Kaelin$Event$Code$Hex$format_hex$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var self = (String$length$(_hex$2) < _min$1);
        if (self) {
            var $442 = (String$repeat$("0", _dif$3) + _hex$2);
            var $441 = $442;
        } else {
            var $443 = _hex$2;
            var $441 = $443;
        };
        return $441;
    };
    const App$Kaelin$Event$Code$Hex$format_hex = x0 => x1 => App$Kaelin$Event$Code$Hex$format_hex$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $445 = self.slice(0, -1);
                var $446 = (2n * Bits$to_nat$($445));
                var $444 = $446;
                break;
            case 'i':
                var $447 = self.slice(0, -1);
                var $448 = Nat$succ$((2n * Bits$to_nat$($447)));
                var $444 = $448;
                break;
            case 'e':
                var $449 = 0n;
                var $444 = $449;
                break;
        };
        return $444;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function Bits$reverse$tco$(_a$1, _r$2) {
        var Bits$reverse$tco$ = (_a$1, _r$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _r$2]
        });
        var Bits$reverse$tco = _a$1 => _r$2 => Bits$reverse$tco$(_a$1, _r$2);
        var arg = [_a$1, _r$2];
        while (true) {
            let [_a$1, _r$2] = arg;
            var R = (() => {
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $450 = self.slice(0, -1);
                        var $451 = Bits$reverse$tco$($450, (_r$2 + '0'));
                        return $451;
                    case 'i':
                        var $452 = self.slice(0, -1);
                        var $453 = Bits$reverse$tco$($452, (_r$2 + '1'));
                        return $453;
                    case 'e':
                        var $454 = _r$2;
                        return $454;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $455 = Bits$reverse$tco$(_a$1, Bits$e);
        return $455;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $457 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $459 = List$cons$(_head$6, _tail$7);
                    var $458 = $459;
                } else {
                    var $460 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $461 = Bits$chunks_of$go$(_len$1, $457, $460, _chunk$7);
                    var $458 = $461;
                };
                var $456 = $458;
                break;
            case 'i':
                var $462 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $464 = List$cons$(_head$6, _tail$7);
                    var $463 = $464;
                } else {
                    var $465 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $466 = Bits$chunks_of$go$(_len$1, $462, $465, _chunk$7);
                    var $463 = $466;
                };
                var $456 = $463;
                break;
            case 'e':
                var $467 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $456 = $467;
                break;
        };
        return $456;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $468 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $468;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Function$flip$(_f$4, _y$5, _x$6) {
        var $469 = _f$4(_x$6)(_y$5);
        return $469;
    };
    const Function$flip = x0 => x1 => x2 => Function$flip$(x0, x1, x2);

    function Bits$to_hex_string$(_x$1) {
        var _hex_to_string$2 = (_x$2 => {
            var self = (Bits$to_nat$(_x$2) === 0n);
            if (self) {
                var $472 = "0";
                var $471 = $472;
            } else {
                var self = (Bits$to_nat$(_x$2) === 1n);
                if (self) {
                    var $474 = "1";
                    var $473 = $474;
                } else {
                    var self = (Bits$to_nat$(_x$2) === 2n);
                    if (self) {
                        var $476 = "2";
                        var $475 = $476;
                    } else {
                        var self = (Bits$to_nat$(_x$2) === 3n);
                        if (self) {
                            var $478 = "3";
                            var $477 = $478;
                        } else {
                            var self = (Bits$to_nat$(_x$2) === 4n);
                            if (self) {
                                var $480 = "4";
                                var $479 = $480;
                            } else {
                                var self = (Bits$to_nat$(_x$2) === 5n);
                                if (self) {
                                    var $482 = "5";
                                    var $481 = $482;
                                } else {
                                    var self = (Bits$to_nat$(_x$2) === 6n);
                                    if (self) {
                                        var $484 = "6";
                                        var $483 = $484;
                                    } else {
                                        var self = (Bits$to_nat$(_x$2) === 7n);
                                        if (self) {
                                            var $486 = "7";
                                            var $485 = $486;
                                        } else {
                                            var self = (Bits$to_nat$(_x$2) === 8n);
                                            if (self) {
                                                var $488 = "8";
                                                var $487 = $488;
                                            } else {
                                                var self = (Bits$to_nat$(_x$2) === 9n);
                                                if (self) {
                                                    var $490 = "9";
                                                    var $489 = $490;
                                                } else {
                                                    var self = (Bits$to_nat$(_x$2) === 10n);
                                                    if (self) {
                                                        var $492 = "a";
                                                        var $491 = $492;
                                                    } else {
                                                        var self = (Bits$to_nat$(_x$2) === 11n);
                                                        if (self) {
                                                            var $494 = "b";
                                                            var $493 = $494;
                                                        } else {
                                                            var self = (Bits$to_nat$(_x$2) === 12n);
                                                            if (self) {
                                                                var $496 = "c";
                                                                var $495 = $496;
                                                            } else {
                                                                var self = (Bits$to_nat$(_x$2) === 13n);
                                                                if (self) {
                                                                    var $498 = "d";
                                                                    var $497 = $498;
                                                                } else {
                                                                    var self = (Bits$to_nat$(_x$2) === 14n);
                                                                    if (self) {
                                                                        var $500 = "e";
                                                                        var $499 = $500;
                                                                    } else {
                                                                        var self = (Bits$to_nat$(_x$2) === 15n);
                                                                        if (self) {
                                                                            var $502 = "f";
                                                                            var $501 = $502;
                                                                        } else {
                                                                            var $503 = "?";
                                                                            var $501 = $503;
                                                                        };
                                                                        var $499 = $501;
                                                                    };
                                                                    var $497 = $499;
                                                                };
                                                                var $495 = $497;
                                                            };
                                                            var $493 = $495;
                                                        };
                                                        var $491 = $493;
                                                    };
                                                    var $489 = $491;
                                                };
                                                var $487 = $489;
                                            };
                                            var $485 = $487;
                                        };
                                        var $483 = $485;
                                    };
                                    var $481 = $483;
                                };
                                var $479 = $481;
                            };
                            var $477 = $479;
                        };
                        var $475 = $477;
                    };
                    var $473 = $475;
                };
                var $471 = $473;
            };
            return $471;
        });
        var _ls$3 = Bits$chunks_of$(4n, _x$1);
        var $470 = List$foldr$("", (_x$4 => {
            var $504 = Function$flip(String$concat)(_hex_to_string$2(_x$4));
            return $504;
        }), _ls$3);
        return $470;
    };
    const Bits$to_hex_string = x0 => Bits$to_hex_string$(x0);

    function App$Kaelin$Event$Code$Hex$append$(_hex$1, _size$2, _x$3) {
        var _hex2$4 = App$Kaelin$Event$Code$Hex$format_hex$(_size$2, Bits$to_hex_string$(_x$3));
        var $505 = (_hex$1 + _hex2$4);
        return $505;
    };
    const App$Kaelin$Event$Code$Hex$append = x0 => x1 => x2 => App$Kaelin$Event$Code$Hex$append$(x0, x1, x2);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $507 = self.pred;
                var $508 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $507));
                var $506 = $508;
                break;
            case 'Word.i':
                var $509 = self.pred;
                var $510 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $509));
                var $506 = $510;
                break;
            case 'Word.e':
                var $511 = _nil$3;
                var $506 = $511;
                break;
        };
        return $506;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);

    function Word$to_nat$(_word$2) {
        var $512 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $513 = Nat$succ$((2n * _x$4));
            return $513;
        }), _word$2);
        return $512;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U8$to_nat = a0 => (BigInt(a0));

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $515 = self.snd;
                var $516 = $515;
                var $514 = $516;
                break;
        };
        return $514;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function App$Kaelin$Event$Code$generate_hex$(_xs$1) {
        var $517 = List$foldr$("", (_x$2 => _y$3 => {
            var $518 = App$Kaelin$Event$Code$Hex$append$(_y$3, (BigInt(Pair$fst$(_x$2))), Pair$snd$(_x$2));
            return $518;
        }), List$reverse$(_xs$1));
        return $517;
    };
    const App$Kaelin$Event$Code$generate_hex = x0 => App$Kaelin$Event$Code$generate_hex$(x0);

    function generate_hex$(_xs$1, _ys$2) {
        var _consumer$3 = List$zip$(List$concat$(App$Kaelin$Event$Code$action, _xs$1), _ys$2);
        var $519 = ("0x" + App$Kaelin$Event$Code$Hex$set_min_length$(64n, App$Kaelin$Event$Code$generate_hex$(_consumer$3)));
        return $519;
    };
    const generate_hex = x0 => x1 => generate_hex$(x0, x1);
    const App$Kaelin$Event$Code$create_hero = List$cons$(2, List$nil);

    function Parser$maybe$(_parse$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var self = _parse$2(_pst$3);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $522 = self.pst;
                        var $523 = self.val;
                        var $524 = Parser$Reply$value$($522, Maybe$some$($523));
                        var $521 = $524;
                        break;
                    case 'Parser.Reply.error':
                        var $525 = Parser$Reply$value$(_pst$3, Maybe$none);
                        var $521 = $525;
                        break;
                };
                var $520 = $521;
                break;
        };
        return $520;
    };
    const Parser$maybe = x0 => x1 => Parser$maybe$(x0, x1);

    function Parser$text$go$(_ini_idx$1, _ini_txt$2, _text$3, _pst$4) {
        var Parser$text$go$ = (_ini_idx$1, _ini_txt$2, _text$3, _pst$4) => ({
            ctr: 'TCO',
            arg: [_ini_idx$1, _ini_txt$2, _text$3, _pst$4]
        });
        var Parser$text$go = _ini_idx$1 => _ini_txt$2 => _text$3 => _pst$4 => Parser$text$go$(_ini_idx$1, _ini_txt$2, _text$3, _pst$4);
        var arg = [_ini_idx$1, _ini_txt$2, _text$3, _pst$4];
        while (true) {
            let [_ini_idx$1, _ini_txt$2, _text$3, _pst$4] = arg;
            var R = (() => {
                var self = _pst$4;
                switch (self._) {
                    case 'Parser.State.new':
                        var $526 = self.err;
                        var $527 = self.nam;
                        var $528 = self.ini;
                        var $529 = self.idx;
                        var $530 = self.str;
                        var self = _text$3;
                        if (self.length === 0) {
                            var $532 = Parser$Reply$value$(_pst$4, Unit$new);
                            var $531 = $532;
                        } else {
                            var $533 = self.charCodeAt(0);
                            var $534 = self.slice(1);
                            var self = $530;
                            if (self.length === 0) {
                                var _error_msg$12 = ("Expected \'" + (_ini_txt$2 + "\', found end of file."));
                                var $536 = Parser$Reply$fail$($527, $528, _ini_idx$1, _error_msg$12);
                                var $535 = $536;
                            } else {
                                var $537 = self.charCodeAt(0);
                                var $538 = self.slice(1);
                                var self = ($533 === $537);
                                if (self) {
                                    var _pst$14 = Parser$State$new$($526, $527, $528, Nat$succ$($529), $538);
                                    var $540 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $534, _pst$14);
                                    var $539 = $540;
                                } else {
                                    var _chr$14 = String$cons$($537, String$nil);
                                    var _err$15 = ("Expected \'" + (_ini_txt$2 + ("\', found \'" + (_chr$14 + "\'."))));
                                    var $541 = Parser$Reply$fail$($527, $528, _ini_idx$1, _err$15);
                                    var $539 = $541;
                                };
                                var $535 = $539;
                            };
                            var $531 = $535;
                        };
                        return $531;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$text$go = x0 => x1 => x2 => x3 => Parser$text$go$(x0, x1, x2, x3);

    function Parser$text$(_text$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $543 = self.idx;
                var self = Parser$text$go$($543, _text$1, _text$1, _pst$2);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $545 = self.err;
                        var $546 = Parser$Reply$error$($545);
                        var $544 = $546;
                        break;
                    case 'Parser.Reply.value':
                        var $547 = self.pst;
                        var $548 = self.val;
                        var $549 = Parser$Reply$value$($547, $548);
                        var $544 = $549;
                        break;
                };
                var $542 = $544;
                break;
        };
        return $542;
    };
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);

    function Parser$hex_digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $551 = self.err;
                var $552 = self.nam;
                var $553 = self.ini;
                var $554 = self.idx;
                var $555 = self.str;
                var self = $555;
                if (self.length === 0) {
                    var $557 = Parser$Reply$fail$($552, $553, $554, "Not a digit.");
                    var $556 = $557;
                } else {
                    var $558 = self.charCodeAt(0);
                    var $559 = self.slice(1);
                    var _pst$9 = Parser$State$new$($551, $552, $553, Nat$succ$($554), $559);
                    var self = ($558 === 48);
                    if (self) {
                        var $561 = Parser$Reply$value$(_pst$9, 0n);
                        var $560 = $561;
                    } else {
                        var self = ($558 === 49);
                        if (self) {
                            var $563 = Parser$Reply$value$(_pst$9, 1n);
                            var $562 = $563;
                        } else {
                            var self = ($558 === 50);
                            if (self) {
                                var $565 = Parser$Reply$value$(_pst$9, 2n);
                                var $564 = $565;
                            } else {
                                var self = ($558 === 51);
                                if (self) {
                                    var $567 = Parser$Reply$value$(_pst$9, 3n);
                                    var $566 = $567;
                                } else {
                                    var self = ($558 === 52);
                                    if (self) {
                                        var $569 = Parser$Reply$value$(_pst$9, 4n);
                                        var $568 = $569;
                                    } else {
                                        var self = ($558 === 53);
                                        if (self) {
                                            var $571 = Parser$Reply$value$(_pst$9, 5n);
                                            var $570 = $571;
                                        } else {
                                            var self = ($558 === 54);
                                            if (self) {
                                                var $573 = Parser$Reply$value$(_pst$9, 6n);
                                                var $572 = $573;
                                            } else {
                                                var self = ($558 === 55);
                                                if (self) {
                                                    var $575 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $574 = $575;
                                                } else {
                                                    var self = ($558 === 56);
                                                    if (self) {
                                                        var $577 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $576 = $577;
                                                    } else {
                                                        var self = ($558 === 57);
                                                        if (self) {
                                                            var $579 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $578 = $579;
                                                        } else {
                                                            var self = ($558 === 97);
                                                            if (self) {
                                                                var $581 = Parser$Reply$value$(_pst$9, 10n);
                                                                var $580 = $581;
                                                            } else {
                                                                var self = ($558 === 98);
                                                                if (self) {
                                                                    var $583 = Parser$Reply$value$(_pst$9, 11n);
                                                                    var $582 = $583;
                                                                } else {
                                                                    var self = ($558 === 99);
                                                                    if (self) {
                                                                        var $585 = Parser$Reply$value$(_pst$9, 12n);
                                                                        var $584 = $585;
                                                                    } else {
                                                                        var self = ($558 === 100);
                                                                        if (self) {
                                                                            var $587 = Parser$Reply$value$(_pst$9, 13n);
                                                                            var $586 = $587;
                                                                        } else {
                                                                            var self = ($558 === 101);
                                                                            if (self) {
                                                                                var $589 = Parser$Reply$value$(_pst$9, 14n);
                                                                                var $588 = $589;
                                                                            } else {
                                                                                var self = ($558 === 102);
                                                                                if (self) {
                                                                                    var $591 = Parser$Reply$value$(_pst$9, 15n);
                                                                                    var $590 = $591;
                                                                                } else {
                                                                                    var self = ($558 === 65);
                                                                                    if (self) {
                                                                                        var $593 = Parser$Reply$value$(_pst$9, 10n);
                                                                                        var $592 = $593;
                                                                                    } else {
                                                                                        var self = ($558 === 66);
                                                                                        if (self) {
                                                                                            var $595 = Parser$Reply$value$(_pst$9, 11n);
                                                                                            var $594 = $595;
                                                                                        } else {
                                                                                            var self = ($558 === 67);
                                                                                            if (self) {
                                                                                                var $597 = Parser$Reply$value$(_pst$9, 12n);
                                                                                                var $596 = $597;
                                                                                            } else {
                                                                                                var self = ($558 === 68);
                                                                                                if (self) {
                                                                                                    var $599 = Parser$Reply$value$(_pst$9, 13n);
                                                                                                    var $598 = $599;
                                                                                                } else {
                                                                                                    var self = ($558 === 69);
                                                                                                    if (self) {
                                                                                                        var $601 = Parser$Reply$value$(_pst$9, 14n);
                                                                                                        var $600 = $601;
                                                                                                    } else {
                                                                                                        var self = ($558 === 70);
                                                                                                        if (self) {
                                                                                                            var $603 = Parser$Reply$value$(_pst$9, 15n);
                                                                                                            var $602 = $603;
                                                                                                        } else {
                                                                                                            var $604 = Parser$Reply$fail$($552, $553, $554, "Not a digit.");
                                                                                                            var $602 = $604;
                                                                                                        };
                                                                                                        var $600 = $602;
                                                                                                    };
                                                                                                    var $598 = $600;
                                                                                                };
                                                                                                var $596 = $598;
                                                                                            };
                                                                                            var $594 = $596;
                                                                                        };
                                                                                        var $592 = $594;
                                                                                    };
                                                                                    var $590 = $592;
                                                                                };
                                                                                var $588 = $590;
                                                                            };
                                                                            var $586 = $588;
                                                                        };
                                                                        var $584 = $586;
                                                                    };
                                                                    var $582 = $584;
                                                                };
                                                                var $580 = $582;
                                                            };
                                                            var $578 = $580;
                                                        };
                                                        var $576 = $578;
                                                    };
                                                    var $574 = $576;
                                                };
                                                var $572 = $574;
                                            };
                                            var $570 = $572;
                                        };
                                        var $568 = $570;
                                    };
                                    var $566 = $568;
                                };
                                var $564 = $566;
                            };
                            var $562 = $564;
                        };
                        var $560 = $562;
                    };
                    var $556 = $560;
                };
                var $550 = $556;
                break;
        };
        return $550;
    };
    const Parser$hex_digit = x0 => Parser$hex_digit$(x0);

    function Hex_to_nat$parser$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $606 = self.err;
                var _reply$7 = Parser$maybe$(Parser$text("0x"), _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $608 = self.err;
                        var self = $606;
                        switch (self._) {
                            case 'Maybe.some':
                                var $610 = self.value;
                                var $611 = Parser$Reply$error$(Parser$Error$combine$($610, $608));
                                var $609 = $611;
                                break;
                            case 'Maybe.none':
                                var $612 = Parser$Reply$error$($608);
                                var $609 = $612;
                                break;
                        };
                        var $607 = $609;
                        break;
                    case 'Parser.Reply.value':
                        var $613 = self.pst;
                        var self = $613;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $615 = self.err;
                                var $616 = self.nam;
                                var $617 = self.ini;
                                var $618 = self.idx;
                                var $619 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($606, $615), $616, $617, $618, $619);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $621 = self.err;
                                        var _reply$21 = Parser$many1$(Parser$hex_digit, _reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $623 = self.err;
                                                var self = $621;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $625 = self.value;
                                                        var $626 = Parser$Reply$error$(Parser$Error$combine$($625, $623));
                                                        var $624 = $626;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $627 = Parser$Reply$error$($623);
                                                        var $624 = $627;
                                                        break;
                                                };
                                                var $622 = $624;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $628 = self.pst;
                                                var $629 = self.val;
                                                var self = $628;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $631 = self.err;
                                                        var $632 = self.nam;
                                                        var $633 = self.ini;
                                                        var $634 = self.idx;
                                                        var $635 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($621, $631), $632, $633, $634, $635);
                                                        var $636 = Parser$Reply$value$(_reply$pst$29, Nat$from_base$(16n, $629));
                                                        var $630 = $636;
                                                        break;
                                                };
                                                var $622 = $630;
                                                break;
                                        };
                                        var $620 = $622;
                                        break;
                                };
                                var $614 = $620;
                                break;
                        };
                        var $607 = $614;
                        break;
                };
                var $605 = $607;
                break;
        };
        return $605;
    };
    const Hex_to_nat$parser = x0 => Hex_to_nat$parser$(x0);

    function App$Kaelin$Event$Code$Hex$to_nat$(_x$1) {
        var self = Parser$run$(Hex_to_nat$parser, _x$1);
        switch (self._) {
            case 'Maybe.some':
                var $638 = self.value;
                var $639 = $638;
                var $637 = $639;
                break;
            case 'Maybe.none':
                var $640 = 0n;
                var $637 = $640;
                break;
        };
        return $637;
    };
    const App$Kaelin$Event$Code$Hex$to_nat = x0 => App$Kaelin$Event$Code$Hex$to_nat$(x0);

    function App$Kaelin$Resources$Action$to_bits$(_x$1) {
        var self = _x$1;
        switch (self._) {
            case 'App.Kaelin.Action.walk':
                var $642 = 0n;
                var _n$2 = $642;
                break;
            case 'App.Kaelin.Action.ability_0':
                var $643 = 1n;
                var _n$2 = $643;
                break;
            case 'App.Kaelin.Action.ability_1':
                var $644 = 2n;
                var _n$2 = $644;
                break;
        };
        var $641 = (nat_to_bits(_n$2));
        return $641;
    };
    const App$Kaelin$Resources$Action$to_bits = x0 => App$Kaelin$Resources$Action$to_bits$(x0);

    function I32$new$(_value$1) {
        var $645 = word_to_i32(_value$1);
        return $645;
    };
    const I32$new = x0 => I32$new$(x0);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $647 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $649 = Word$o$(Word$neg$aux$($647, Bool$true));
                    var $648 = $649;
                } else {
                    var $650 = Word$i$(Word$neg$aux$($647, Bool$false));
                    var $648 = $650;
                };
                var $646 = $648;
                break;
            case 'Word.i':
                var $651 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $653 = Word$i$(Word$neg$aux$($651, Bool$false));
                    var $652 = $653;
                } else {
                    var $654 = Word$o$(Word$neg$aux$($651, Bool$false));
                    var $652 = $654;
                };
                var $646 = $652;
                break;
            case 'Word.e':
                var $655 = Word$e;
                var $646 = $655;
                break;
        };
        return $646;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $657 = self.pred;
                var $658 = Word$o$(Word$neg$aux$($657, Bool$true));
                var $656 = $658;
                break;
            case 'Word.i':
                var $659 = self.pred;
                var $660 = Word$i$(Word$neg$aux$($659, Bool$false));
                var $656 = $660;
                break;
            case 'Word.e':
                var $661 = Word$e;
                var $656 = $661;
                break;
        };
        return $656;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const I32$from_nat = a0 => (Number(a0));

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $663 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $665 = Word$i$(Word$shift_left$one$go$($663, Bool$false));
                    var $664 = $665;
                } else {
                    var $666 = Word$o$(Word$shift_left$one$go$($663, Bool$false));
                    var $664 = $666;
                };
                var $662 = $664;
                break;
            case 'Word.i':
                var $667 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $669 = Word$i$(Word$shift_left$one$go$($667, Bool$true));
                    var $668 = $669;
                } else {
                    var $670 = Word$o$(Word$shift_left$one$go$($667, Bool$true));
                    var $668 = $670;
                };
                var $662 = $668;
                break;
            case 'Word.e':
                var $671 = Word$e;
                var $662 = $671;
                break;
        };
        return $662;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $673 = self.pred;
                var $674 = Word$o$(Word$shift_left$one$go$($673, Bool$false));
                var $672 = $674;
                break;
            case 'Word.i':
                var $675 = self.pred;
                var $676 = Word$o$(Word$shift_left$one$go$($675, Bool$true));
                var $672 = $676;
                break;
            case 'Word.e':
                var $677 = Word$e;
                var $672 = $677;
                break;
        };
        return $672;
    };
    const Word$shift_left$one = x0 => Word$shift_left$one$(x0);

    function Word$shift_left$(_n$2, _value$3) {
        var Word$shift_left$ = (_n$2, _value$3) => ({
            ctr: 'TCO',
            arg: [_n$2, _value$3]
        });
        var Word$shift_left = _n$2 => _value$3 => Word$shift_left$(_n$2, _value$3);
        var arg = [_n$2, _value$3];
        while (true) {
            let [_n$2, _value$3] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $678 = _value$3;
                    return $678;
                } else {
                    var $679 = (self - 1n);
                    var $680 = Word$shift_left$($679, Word$shift_left$one$(_value$3));
                    return $680;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Word$mul$go$(_a$3, _b$4, _acc$5) {
        var Word$mul$go$ = (_a$3, _b$4, _acc$5) => ({
            ctr: 'TCO',
            arg: [_a$3, _b$4, _acc$5]
        });
        var Word$mul$go = _a$3 => _b$4 => _acc$5 => Word$mul$go$(_a$3, _b$4, _acc$5);
        var arg = [_a$3, _b$4, _acc$5];
        while (true) {
            let [_a$3, _b$4, _acc$5] = arg;
            var R = (() => {
                var self = _a$3;
                switch (self._) {
                    case 'Word.o':
                        var $681 = self.pred;
                        var $682 = Word$mul$go$($681, Word$shift_left$(1n, _b$4), _acc$5);
                        return $682;
                    case 'Word.i':
                        var $683 = self.pred;
                        var $684 = Word$mul$go$($683, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $684;
                    case 'Word.e':
                        var $685 = _acc$5;
                        return $685;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul$go = x0 => x1 => x2 => Word$mul$go$(x0, x1, x2);

    function Word$to_zero$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $687 = self.pred;
                var $688 = Word$o$(Word$to_zero$($687));
                var $686 = $688;
                break;
            case 'Word.i':
                var $689 = self.pred;
                var $690 = Word$o$(Word$to_zero$($689));
                var $686 = $690;
                break;
            case 'Word.e':
                var $691 = Word$e;
                var $686 = $691;
                break;
        };
        return $686;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $692 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $692;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);
    const F64$to_u32 = a0 => ((a0 >>> 0));

    function Word$s_to_f64$(_a$2) {
        var Word$s_to_f64$ = (_a$2) => ({
            ctr: 'TCO',
            arg: [_a$2]
        });
        var Word$s_to_f64 = _a$2 => Word$s_to_f64$(_a$2);
        var arg = [_a$2];
        while (true) {
            let [_a$2] = arg;
            var R = Word$s_to_f64$(_a$2);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$s_to_f64 = x0 => Word$s_to_f64$(x0);
    const I32$to_f64 = a0 => (a0);

    function I32$to_u32$(_n$1) {
        var $693 = (((_n$1) >>> 0));
        return $693;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function U32$new$(_value$1) {
        var $694 = word_to_u32(_value$1);
        return $694;
    };
    const U32$new = x0 => U32$new$(x0);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const U32$to_nat = a0 => (BigInt(a0));

    function App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $696 = self.i;
                var $697 = self.j;
                var _i$4 = (($696 + 100) >> 0);
                var _i$5 = ((_i$4 * 1000) >> 0);
                var _i$6 = I32$to_u32$(_i$5);
                var _j$7 = (($697 + 100) >> 0);
                var _j$8 = I32$to_u32$(_j$7);
                var _sum$9 = ((_i$6 + _j$8) >>> 0);
                var $698 = (BigInt(_sum$9));
                var $695 = $698;
                break;
        };
        return $695;
    };
    const App$Kaelin$Coord$Convert$axial_to_nat = x0 => App$Kaelin$Coord$Convert$axial_to_nat$(x0);

    function App$Kaelin$Coord$Convert$axial_to_bits$(_x$1) {
        var _unique_nat$2 = App$Kaelin$Coord$Convert$axial_to_nat$(_x$1);
        var $699 = (nat_to_bits(_unique_nat$2));
        return $699;
    };
    const App$Kaelin$Coord$Convert$axial_to_bits = x0 => App$Kaelin$Coord$Convert$axial_to_bits$(x0);
    const App$Kaelin$Event$Code$user_input = List$cons$(40, List$cons$(2, List$cons$(8, List$nil)));
    const App$Kaelin$Event$Code$exe_skill = List$cons$(40, List$cons$(8, List$cons$(4, List$nil)));
    const U8$from_nat = a0 => (Number(a0) & 0xFF);

    function App$Kaelin$Team$code$(_team$1) {
        var self = _team$1;
        switch (self._) {
            case 'App.Kaelin.Team.red':
                var $701 = 1;
                var $700 = $701;
                break;
            case 'App.Kaelin.Team.blue':
                var $702 = 2;
                var $700 = $702;
                break;
            case 'App.Kaelin.Team.neutral':
                var $703 = 0;
                var $700 = $703;
                break;
        };
        return $700;
    };
    const App$Kaelin$Team$code = x0 => App$Kaelin$Team$code$(x0);
    const App$Kaelin$Event$Code$save_skill = List$cons$(40, List$cons$(8, List$cons$(4, List$cons$(2, List$nil))));
    const App$Kaelin$Event$Code$remove_skill = List$cons$(40, List$cons$(8, List$cons$(4, List$nil)));
    const App$Kaelin$Event$Code$draft_hero = List$cons$(2, List$nil);
    const App$Kaelin$Event$Code$draft_coord = List$cons$(8, List$nil);
    const App$Kaelin$Event$Code$draft_team = List$cons$(2, List$nil);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));
    const App$Kaelin$Event$Code$draft_ready = List$cons$(2, List$nil);

    function App$Kaelin$Event$serialize$(_event$1) {
        var self = _event$1;
        switch (self._) {
            case 'App.Kaelin.Event.create_hero':
                var $705 = self.hero_id;
                var _cod$3 = List$cons$((nat_to_bits(1n)), List$cons$(U8$to_bits$($705), List$nil));
                var $706 = generate_hex$(App$Kaelin$Event$Code$create_hero, _cod$3);
                var $704 = $706;
                break;
            case 'App.Kaelin.Event.user_input':
                var $707 = self.player;
                var $708 = self.coord;
                var $709 = self.action;
                var _cod$5 = List$cons$((nat_to_bits(4n)), List$cons$((nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($707))), List$cons$(App$Kaelin$Resources$Action$to_bits$($709), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($708), List$nil))));
                var $710 = generate_hex$(App$Kaelin$Event$Code$user_input, _cod$5);
                var $704 = $710;
                break;
            case 'App.Kaelin.Event.exe_skill':
                var $711 = self.player;
                var $712 = self.target_pos;
                var $713 = self.key;
                var _cod$5 = List$cons$((nat_to_bits(5n)), List$cons$((nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($711))), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($712), List$cons$((u16_to_bits($713)), List$nil))));
                var $714 = generate_hex$(App$Kaelin$Event$Code$exe_skill, _cod$5);
                var $704 = $714;
                break;
            case 'App.Kaelin.Event.save_skill':
                var $715 = self.player;
                var $716 = self.target_pos;
                var $717 = self.key;
                var $718 = self.team;
                var _cod$6 = List$cons$((nat_to_bits(11n)), List$cons$((nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($715))), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($716), List$cons$((u16_to_bits($717)), List$cons$(U8$to_bits$(App$Kaelin$Team$code$($718)), List$nil)))));
                var $719 = generate_hex$(App$Kaelin$Event$Code$save_skill, _cod$6);
                var $704 = $719;
                break;
            case 'App.Kaelin.Event.remove_skill':
                var $720 = self.player;
                var $721 = self.target_pos;
                var $722 = self.key;
                var $723 = self.team;
                var _cod$6 = List$cons$((nat_to_bits(12n)), List$cons$((nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($720))), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($721), List$cons$((u16_to_bits($722)), List$cons$(U8$to_bits$(App$Kaelin$Team$code$($723)), List$nil)))));
                var $724 = generate_hex$(App$Kaelin$Event$Code$remove_skill, _cod$6);
                var $704 = $724;
                break;
            case 'App.Kaelin.Event.draft_hero':
                var $725 = self.hero;
                var _cod$3 = List$cons$((nat_to_bits(6n)), List$cons$(U8$to_bits$($725), List$nil));
                var $726 = generate_hex$(App$Kaelin$Event$Code$draft_hero, _cod$3);
                var $704 = $726;
                break;
            case 'App.Kaelin.Event.draft_coord':
                var $727 = self.coord;
                var _cod$3 = List$cons$((nat_to_bits(7n)), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($727), List$nil));
                var $728 = generate_hex$(App$Kaelin$Event$Code$draft_coord, _cod$3);
                var $704 = $728;
                break;
            case 'App.Kaelin.Event.draft_team':
                var $729 = self.team;
                var _cod$3 = List$cons$((nat_to_bits(10n)), List$cons$(U8$to_bits$($729), List$nil));
                var $730 = generate_hex$(App$Kaelin$Event$Code$draft_team, _cod$3);
                var $704 = $730;
                break;
            case 'App.Kaelin.Event.draft_ready':
                var $731 = self.ready;
                var $732 = ((console.log("serialize ready"), (_$3 => {
                    var _cod$4 = List$cons$((nat_to_bits(14n)), List$cons$(U8$to_bits$($731), List$nil));
                    var $733 = generate_hex$(App$Kaelin$Event$Code$draft_ready, _cod$4);
                    return $733;
                })()));
                var $704 = $732;
                break;
            case 'App.Kaelin.Event.start_game':
            case 'App.Kaelin.Event.create_user':
                var $734 = "";
                var $704 = $734;
                break;
            case 'App.Kaelin.Event.end_action':
                var _cod$2 = List$cons$((nat_to_bits(13n)), List$nil);
                var $735 = generate_hex$(List$nil, _cod$2);
                var $704 = $735;
                break;
            case 'App.Kaelin.Event.to_draft':
                var _cod$2 = List$cons$((nat_to_bits(9n)), List$nil);
                var $736 = generate_hex$(List$nil, _cod$2);
                var $704 = $736;
                break;
            case 'App.Kaelin.Event.control_map':
                var _cod$2 = List$cons$((nat_to_bits(15n)), List$nil);
                var $737 = generate_hex$(List$nil, _cod$2);
                var $704 = $737;
                break;
        };
        return $704;
    };
    const App$Kaelin$Event$serialize = x0 => App$Kaelin$Event$serialize$(x0);
    const App$Kaelin$Event$to_draft = ({
        _: 'App.Kaelin.Event.to_draft'
    });

    function App$KL$Lobby$when$(_local$1, _event$2) {
        var self = _event$2;
        switch (self._) {
            case 'App.Event.init':
                var $739 = self.user;
                var self = _local$1;
                switch (self._) {
                    case 'App.KL.Lobby.State.Local.new':
                        var $741 = self.room_input;
                        var $742 = App$KL$Lobby$State$Local$new$(String$to_lower$($739), $741);
                        var _new_local$6 = $742;
                        break;
                };
                var $740 = App$set_local$(App$KL$State$Local$lobby$(_new_local$6));
                var $738 = $740;
                break;
            case 'App.Event.mouse_click':
                var $743 = self.id;
                var self = ($743 === "random");
                if (self) {
                    var $745 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $746 = _m$bind$6;
                        return $746;
                    }))(IO$random$(10000000000n))((_rnd$6 => {
                        var _str$7 = Nat$show$(_rnd$6);
                        var _room$8 = ("0x72214422" + String$drop$((String$length$(_str$7) - 6n <= 0n ? 0n : String$length$(_str$7) - 6n), _str$7));
                        var self = _local$1;
                        switch (self._) {
                            case 'App.KL.Lobby.State.Local.new':
                                var $748 = self.user;
                                var $749 = App$KL$Lobby$State$Local$new$($748, _room$8);
                                var _new_local$9 = $749;
                                break;
                        };
                        var $747 = App$set_local$(App$KL$State$Local$lobby$(_new_local$9));
                        return $747;
                    }));
                    var $744 = $745;
                } else {
                    var self = ($743 === "ready");
                    if (self) {
                        var $751 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                            var $752 = _m$bind$6;
                            return $752;
                        }))(App$watch$((() => {
                            var self = _local$1;
                            switch (self._) {
                                case 'App.KL.Lobby.State.Local.new':
                                    var $753 = self.room_input;
                                    var $754 = $753;
                                    return $754;
                            };
                        })()))((_$6 => {
                            var $755 = App$new_post$((() => {
                                var self = _local$1;
                                switch (self._) {
                                    case 'App.KL.Lobby.State.Local.new':
                                        var $756 = self.room_input;
                                        var $757 = $756;
                                        return $757;
                                };
                            })(), App$Kaelin$Event$serialize$(App$Kaelin$Event$to_draft));
                            return $755;
                        }));
                        var $750 = $751;
                    } else {
                        var $758 = App$pass;
                        var $750 = $758;
                    };
                    var $744 = $750;
                };
                var $738 = $744;
                break;
            case 'App.Event.input':
                var $759 = self.text;
                var self = _local$1;
                switch (self._) {
                    case 'App.KL.Lobby.State.Local.new':
                        var $761 = self.user;
                        var $762 = App$KL$Lobby$State$Local$new$($761, $759);
                        var _new_local$6 = $762;
                        break;
                };
                var $760 = App$set_local$(App$KL$State$Local$lobby$(_new_local$6));
                var $738 = $760;
                break;
            case 'App.Event.frame':
            case 'App.Event.mouse_down':
            case 'App.Event.mouse_up':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
                var $763 = App$pass;
                var $738 = $763;
                break;
        };
        return $738;
    };
    const App$KL$Lobby$when = x0 => x1 => App$KL$Lobby$when$(x0, x1);

    function App$KL$Game$when$(_local$1, _event$2) {
        var $764 = App$pass;
        return $764;
    };
    const App$KL$Game$when = x0 => x1 => App$KL$Game$when$(x0, x1);

    function App$KL$when$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $766 = self.local;
                var self = $766;
                switch (self._) {
                    case 'App.KL.State.Local.lobby':
                        var $768 = self.state;
                        var $769 = App$KL$Lobby$when$($768, _event$1);
                        var $767 = $769;
                        break;
                    case 'App.KL.State.Local.game':
                        var $770 = self.state;
                        var $771 = App$KL$Game$when$($770, _event$1);
                        var $767 = $771;
                        break;
                };
                var $765 = $767;
                break;
        };
        return $765;
    };
    const App$KL$when = x0 => x1 => App$KL$when$(x0, x1);

    function App$no_tick$(_tick$2, _glob$3) {
        var $772 = _glob$3;
        return $772;
    };
    const App$no_tick = x0 => x1 => App$no_tick$(x0, x1);
    const App$KL$tick = App$no_tick;

    function App$KL$post$(_time$1, _room$2, _addr$3, _data$4, _global_state$5) {
        var $773 = _global_state$5;
        return $773;
    };
    const App$KL$post = x0 => x1 => x2 => x3 => x4 => App$KL$post$(x0, x1, x2, x3, x4);
    const App$KL = App$new$(App$KL$init, App$KL$draw, App$KL$when, App$KL$tick, App$KL$post);
    return {
        'App.new': App$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.KL.State': App$KL$State,
        'App.KL.State.Local.lobby': App$KL$State$Local$lobby,
        'App.KL.Lobby.State.Local.new': App$KL$Lobby$State$Local$new,
        'App.KL.State.Global.new': App$KL$State$Global$new,
        'App.Store.new': App$Store$new,
        'App.KL.init': App$KL$init,
        'BitsMap': BitsMap,
        'Map': Map,
        'BitsMap.new': BitsMap$new,
        'BitsMap.tie': BitsMap$tie,
        'Maybe.some': Maybe$some,
        'Maybe.none': Maybe$none,
        'BitsMap.set': BitsMap$set,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List.cons': List$cons,
        'Pair': Pair,
        'List.nil': List$nil,
        'DOM.node': DOM$node,
        'DOM.text': DOM$text,
        'Map.new': Map$new,
        'App.KL.Lobby.draw.input': App$KL$Lobby$draw$input,
        'App.KL.Lobby.draw.button': App$KL$Lobby$draw$button,
        'App.KL.Lobby.draw': App$KL$Lobby$draw,
        'App.KL.Game.draw': App$KL$Game$draw,
        'App.KL.draw': App$KL$draw,
        'IO': IO,
        'Maybe': Maybe,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'String.nil': String$nil,
        'String.cons': String$cons,
        'String.map': String$map,
        'Bool.false': Bool$false,
        'Bool.and': Bool$and,
        'Bool.true': Bool$true,
        'Cmp.as_gte': Cmp$as_gte,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.gte': Word$gte,
        'U16.gte': U16$gte,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U16.lte': U16$lte,
        'U16.new': U16$new,
        'Word.e': Word$e,
        'Word': Word,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U16.add': U16$add,
        'Nat.apply': Nat$apply,
        'Word.inc': Word$inc,
        'Word.zero': Word$zero,
        'Nat.to_word': Nat$to_word,
        'Nat.to_u16': Nat$to_u16,
        'Char.to_lower': Char$to_lower,
        'String.to_lower': String$to_lower,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'App.set_local': App$set_local,
        'App.pass': App$pass,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
        'Parser.State.new': Parser$State$new,
        'Parser.run': Parser$run,
        'Parser.Reply': Parser$Reply,
        'List': List,
        'Parser.Reply.error': Parser$Reply$error,
        'Nat.gtn': Nat$gtn,
        'Parser.Error.combine': Parser$Error$combine,
        'Parser.Error.maybe_combine': Parser$Error$maybe_combine,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.many1': Parser$many1,
        'Parser.Error.new': Parser$Error$new,
        'Parser.Reply.fail': Parser$Reply$fail,
        'Parser.digit': Parser$digit,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Nat.from_base.go': Nat$from_base$go,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Nat.from_base': Nat$from_base,
        'Parser.nat': Parser$nat,
        'Nat.read': Nat$read,
        'IO.get_time': IO$get_time,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Nat.random': Nat$random,
        'IO.random': IO$random,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'String.concat': String$concat,
        'String.drop': String$drop,
        'Nat.sub': Nat$sub,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'Unit.new': Unit$new,
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.new_post': App$new_post,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'U8.to_bits': U8$to_bits,
        'List.zip': List$zip,
        'List.concat': List$concat,
        'U8.new': U8$new,
        'Nat.to_u8': Nat$to_u8,
        'App.Kaelin.Event.Code.action': App$Kaelin$Event$Code$action,
        'String.repeat': String$repeat,
        'App.Kaelin.Event.Code.Hex.set_min_length': App$Kaelin$Event$Code$Hex$set_min_length,
        'List.foldr': List$foldr,
        'Nat.ltn': Nat$ltn,
        'App.Kaelin.Event.Code.Hex.format_hex': App$Kaelin$Event$Code$Hex$format_hex,
        'Nat.eql': Nat$eql,
        'Bits.to_nat': Bits$to_nat,
        'Bits.reverse.tco': Bits$reverse$tco,
        'Bits.reverse': Bits$reverse,
        'Bits.chunks_of.go': Bits$chunks_of$go,
        'Bits.chunks_of': Bits$chunks_of,
        'Function.flip': Function$flip,
        'Bits.to_hex_string': Bits$to_hex_string,
        'App.Kaelin.Event.Code.Hex.append': App$Kaelin$Event$Code$Hex$append,
        'Word.fold': Word$fold,
        'Word.to_nat': Word$to_nat,
        'U8.to_nat': U8$to_nat,
        'Pair.snd': Pair$snd,
        'App.Kaelin.Event.Code.generate_hex': App$Kaelin$Event$Code$generate_hex,
        'generate_hex': generate_hex,
        'App.Kaelin.Event.Code.create_hero': App$Kaelin$Event$Code$create_hero,
        'Parser.maybe': Parser$maybe,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'Parser.hex_digit': Parser$hex_digit,
        'Hex_to_nat.parser': Hex_to_nat$parser,
        'App.Kaelin.Event.Code.Hex.to_nat': App$Kaelin$Event$Code$Hex$to_nat,
        'App.Kaelin.Resources.Action.to_bits': App$Kaelin$Resources$Action$to_bits,
        'I32.new': I32$new,
        'I32.add': I32$add,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.from_nat': I32$from_nat,
        'Word.shift_left.one.go': Word$shift_left$one$go,
        'Word.shift_left.one': Word$shift_left$one,
        'Word.shift_left': Word$shift_left,
        'Word.mul.go': Word$mul$go,
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'I32.mul': I32$mul,
        'F64.to_u32': F64$to_u32,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'I32.to_u32': I32$to_u32,
        'U32.new': U32$new,
        'U32.add': U32$add,
        'U32.to_nat': U32$to_nat,
        'App.Kaelin.Coord.Convert.axial_to_nat': App$Kaelin$Coord$Convert$axial_to_nat,
        'App.Kaelin.Coord.Convert.axial_to_bits': App$Kaelin$Coord$Convert$axial_to_bits,
        'App.Kaelin.Event.Code.user_input': App$Kaelin$Event$Code$user_input,
        'App.Kaelin.Event.Code.exe_skill': App$Kaelin$Event$Code$exe_skill,
        'U8.from_nat': U8$from_nat,
        'App.Kaelin.Team.code': App$Kaelin$Team$code,
        'App.Kaelin.Event.Code.save_skill': App$Kaelin$Event$Code$save_skill,
        'App.Kaelin.Event.Code.remove_skill': App$Kaelin$Event$Code$remove_skill,
        'App.Kaelin.Event.Code.draft_hero': App$Kaelin$Event$Code$draft_hero,
        'App.Kaelin.Event.Code.draft_coord': App$Kaelin$Event$Code$draft_coord,
        'App.Kaelin.Event.Code.draft_team': App$Kaelin$Event$Code$draft_team,
        'Debug.log': Debug$log,
        'App.Kaelin.Event.Code.draft_ready': App$Kaelin$Event$Code$draft_ready,
        'App.Kaelin.Event.serialize': App$Kaelin$Event$serialize,
        'App.Kaelin.Event.to_draft': App$Kaelin$Event$to_draft,
        'App.KL.Lobby.when': App$KL$Lobby$when,
        'App.KL.Game.when': App$KL$Game$when,
        'App.KL.when': App$KL$when,
        'App.no_tick': App$no_tick,
        'App.KL.tick': App$KL$tick,
        'App.KL.post': App$KL$post,
        'App.KL': App$KL,
    };
})();

/***/ })

}]);
//# sourceMappingURL=967.index.js.map