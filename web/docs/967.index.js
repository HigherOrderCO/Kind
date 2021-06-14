(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[967],{

/***/ 967:
/***/ ((module) => {

module.exports = (function() {
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
    var list_length = list => {
        var len = 0;
        while (list._ === 'List.cons') {
            len += 1;
            list = list.tail;
        };
        return BigInt(len);
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
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $14 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $9 = self.slice(0, -1);
                    var $10 = c1($9);
                    return $10;
                case 'i':
                    var $11 = self.slice(0, -1);
                    var $12 = c2($11);
                    return $12;
                case 'e':
                    var $13 = c0;
                    return $13;
            };
        })();
        return $14;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $17 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $15 = u16_to_word(self);
                    var $16 = c0($15);
                    return $16;
            };
        })();
        return $17;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $20 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $18 = u32_to_word(self);
                    var $19 = c0($18);
                    return $19;
            };
        })();
        return $20;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $23 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $21 = u64_to_word(self);
                    var $22 = c0($21);
                    return $22;
            };
        })();
        return $23;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $28 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $24 = c0;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c1($25)($26);
                return $27;
            };
        })();
        return $28;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $32 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $29 = buffer32_to_depth(self);
                    var $30 = buffer32_to_u32array(self);
                    var $31 = c0($29)($30);
                    return $31;
            };
        })();
        return $32;
    });

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $33 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $33;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);

    function Pair$new$(_fst$3, _snd$4) {
        var $34 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $34;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$KL$State = App$State$new;

    function App$KL$State$Local$lobby$(_state$1) {
        var $35 = ({
            _: 'App.KL.State.Local.lobby',
            'state': _state$1
        });
        return $35;
    };
    const App$KL$State$Local$lobby = x0 => App$KL$State$Local$lobby$(x0);

    function App$KL$Lobby$State$Local$new$(_user$1, _room_input$2) {
        var $36 = ({
            _: 'App.KL.Lobby.State.Local.new',
            'user': _user$1,
            'room_input': _room_input$2
        });
        return $36;
    };
    const App$KL$Lobby$State$Local$new = x0 => x1 => App$KL$Lobby$State$Local$new$(x0, x1);

    function App$KL$Global$State$new$(_game$1) {
        var $37 = ({
            _: 'App.KL.Global.State.new',
            'game': _game$1
        });
        return $37;
    };
    const App$KL$Global$State$new = x0 => App$KL$Global$State$new$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function App$Store$new$(_local$2, _global$3) {
        var $38 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $38;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const App$KL$init = (() => {
        var _local$1 = App$KL$State$Local$lobby$(App$KL$Lobby$State$Local$new$("", ""));
        var _global$2 = App$KL$Global$State$new$(Maybe$none);
        var $39 = App$Store$new$(_local$1, _global$2);
        return $39;
    })();

    function BitsMap$(_A$1) {
        var $40 = null;
        return $40;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $41 = null;
        return $41;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $42 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $42;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $43 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $43;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $45 = self.pred;
                var $46 = (Word$to_bits$($45) + '0');
                var $44 = $46;
                break;
            case 'Word.i':
                var $47 = self.pred;
                var $48 = (Word$to_bits$($47) + '1');
                var $44 = $48;
                break;
            case 'Word.e':
                var $49 = Bits$e;
                var $44 = $49;
                break;
        };
        return $44;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $50 = 1n + _pred$1;
        return $50;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $52 = Bits$e;
            var $51 = $52;
        } else {
            var $53 = self.charCodeAt(0);
            var $54 = self.slice(1);
            var $55 = (String$to_bits$($54) + (u16_to_bits($53)));
            var $51 = $55;
        };
        return $51;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $57 = self.head;
                var $58 = self.tail;
                var self = $57;
                switch (self._) {
                    case 'Pair.new':
                        var $60 = self.fst;
                        var $61 = self.snd;
                        var $62 = (bitsmap_set(String$to_bits$($60), $61, Map$from_list$($58), 'set'));
                        var $59 = $62;
                        break;
                };
                var $56 = $59;
                break;
            case 'List.nil':
                var $63 = BitsMap$new;
                var $56 = $63;
                break;
        };
        return $56;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $64 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $64;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $65 = null;
        return $65;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $66 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $66;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function DOM$text$(_value$1) {
        var $67 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $67;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const Map$new = BitsMap$new;

    function App$KL$Lobby$draw$input$(_id$1, _value$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("outline", "transparent"), List$nil))));
        var $68 = DOM$node$("input", Map$from_list$(List$cons$(Pair$new$("value", _value$2), List$cons$(Pair$new$("id", _id$1), List$nil))), _style$3, List$nil);
        return $68;
    };
    const App$KL$Lobby$draw$input = x0 => x1 => App$KL$Lobby$draw$input$(x0, x1);

    function App$KL$Lobby$draw$button$(_id$1, _content$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("margin-left", "10px"), List$cons$(Pair$new$("padding", "2px"), List$nil)))));
        var $69 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", _id$1), List$nil)), _style$3, List$cons$(DOM$text$(_content$2), List$nil));
        return $69;
    };
    const App$KL$Lobby$draw$button = x0 => x1 => App$KL$Lobby$draw$button$(x0, x1);

    function App$KL$Lobby$draw$(_local$1, _global$2) {
        var self = _local$1;
        switch (self._) {
            case 'App.KL.Lobby.State.Local.new':
                var $71 = self.room_input;
                var _style$5 = Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("font-size", "2rem"), List$nil))))))));
                var $72 = DOM$node$("div", Map$from_list$(List$nil), _style$5, List$cons$(DOM$node$("h1", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), List$cons$(DOM$text$("Welcome to Kaelin"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$("Enter a room number: "), List$cons$(App$KL$Lobby$draw$input$("text", $71), List$cons$(App$KL$Lobby$draw$button$("ready", "Enter"), List$cons$(App$KL$Lobby$draw$button$("random", "Random"), List$nil))))), List$nil)));
                var $70 = $72;
                break;
        };
        return $70;
    };
    const App$KL$Lobby$draw = x0 => x1 => App$KL$Lobby$draw$(x0, x1);

    function String$cons$(_head$1, _tail$2) {
        var $73 = (String.fromCharCode(_head$1) + _tail$2);
        return $73;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Maybe$(_A$1) {
        var $74 = null;
        return $74;
    };
    const Maybe = x0 => Maybe$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $76 = self.head;
                var $77 = self.tail;
                var $78 = _cons$5($76)(List$fold$($77, _nil$4, _cons$5));
                var $75 = $78;
                break;
            case 'List.nil':
                var $79 = _nil$4;
                var $75 = $79;
                break;
        };
        return $75;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $80 = null;
        return $80;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $81 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $81;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $82 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $82;
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
                    var $83 = Either$left$(_n$1);
                    return $83;
                } else {
                    var $84 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $86 = Either$right$(Nat$succ$($84));
                        var $85 = $86;
                    } else {
                        var $87 = (self - 1n);
                        var $88 = Nat$sub_rem$($87, $84);
                        var $85 = $88;
                    };
                    return $85;
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
                        var $89 = self.value;
                        var $90 = Nat$div_mod$go$($89, _m$2, Nat$succ$(_d$3));
                        return $90;
                    case 'Either.right':
                        var $91 = Pair$new$(_d$3, _n$1);
                        return $91;
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

    function List$(_A$1) {
        var $92 = null;
        return $92;
    };
    const List = x0 => List$(x0);

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
                        var $93 = self.fst;
                        var $94 = self.snd;
                        var self = $93;
                        if (self === 0n) {
                            var $96 = List$cons$($94, _res$3);
                            var $95 = $96;
                        } else {
                            var $97 = (self - 1n);
                            var $98 = Nat$to_base$go$(_base$1, $93, List$cons$($94, _res$3));
                            var $95 = $98;
                        };
                        return $95;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $99 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $99;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const String$nil = '';

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
                    var $100 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $100;
                } else {
                    var $101 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $103 = _r$3;
                        var $102 = $103;
                    } else {
                        var $104 = (self - 1n);
                        var $105 = Nat$mod$go$($104, $101, Nat$succ$(_r$3));
                        var $102 = $105;
                    };
                    return $102;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
    const Bool$false = false;
    const Bool$and = a0 => a1 => (a0 && a1);
    const Bool$true = true;
    const Nat$gtn = a0 => a1 => (a0 > a1);
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
                        var $106 = self.head;
                        var $107 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $109 = Maybe$some$($106);
                            var $108 = $109;
                        } else {
                            var $110 = (self - 1n);
                            var $111 = List$at$($110, $107);
                            var $108 = $111;
                        };
                        return $108;
                    case 'List.nil':
                        var $112 = Maybe$none;
                        return $112;
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
                    var $115 = self.value;
                    var $116 = $115;
                    var $114 = $116;
                    break;
                case 'Maybe.none':
                    var $117 = 35;
                    var $114 = $117;
                    break;
            };
            var $113 = $114;
        } else {
            var $118 = 35;
            var $113 = $118;
        };
        return $113;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $119 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $120 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $120;
        }));
        return $119;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $121 = Nat$to_string_base$(10n, _n$1);
        return $121;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const List$length = a0 => (list_length(a0));

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
                        var $122 = self.head;
                        var $123 = self.tail;
                        var $124 = List$reverse$go$($123, List$cons$($122, _res$3));
                        return $124;
                    case 'List.nil':
                        var $125 = _res$3;
                        return $125;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $126 = List$reverse$go$(_xs$2, List$nil);
        return $126;
    };
    const List$reverse = x0 => List$reverse$(x0);

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
                        var $127 = self.slice(0, -1);
                        var $128 = Bits$reverse$tco$($127, (_r$2 + '0'));
                        return $128;
                    case 'i':
                        var $129 = self.slice(0, -1);
                        var $130 = Bits$reverse$tco$($129, (_r$2 + '1'));
                        return $130;
                    case 'e':
                        var $131 = _r$2;
                        return $131;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $132 = Bits$reverse$tco$(_a$1, Bits$e);
        return $132;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $134 = self.val;
                var $135 = self.lft;
                var $136 = self.rgt;
                var self = $134;
                switch (self._) {
                    case 'Maybe.some':
                        var $138 = self.value;
                        var $139 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $138), _list$4);
                        var _list0$8 = $139;
                        break;
                    case 'Maybe.none':
                        var $140 = _list$4;
                        var _list0$8 = $140;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($135, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($136, (_key$3 + '1'), _list1$9);
                var $137 = _list2$10;
                var $133 = $137;
                break;
            case 'BitsMap.new':
                var $141 = _list$4;
                var $133 = $141;
                break;
        };
        return $133;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $143 = self.head;
                var $144 = self.tail;
                var $145 = List$cons$(_f$4($143), List$mapped$($144, _f$4));
                var $142 = $145;
                break;
            case 'List.nil':
                var $146 = List$nil;
                var $142 = $146;
                break;
        };
        return $142;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Bits$show$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $148 = self.slice(0, -1);
                var $149 = String$cons$(48, Bits$show$($148));
                var $147 = $149;
                break;
            case 'i':
                var $150 = self.slice(0, -1);
                var $151 = String$cons$(49, Bits$show$($150));
                var $147 = $151;
                break;
            case 'e':
                var $152 = "";
                var $147 = $152;
                break;
        };
        return $147;
    };
    const Bits$show = x0 => Bits$show$(x0);

    function Map$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $153 = List$mapped$(_kvs$3, (_kv$4 => {
            var self = _kv$4;
            switch (self._) {
                case 'Pair.new':
                    var $155 = self.fst;
                    var $156 = self.snd;
                    var $157 = Pair$new$(Bits$show$($155), $156);
                    var $154 = $157;
                    break;
            };
            return $154;
        }));
        return $153;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function App$KL$Game$draw$(_local$1, _global$2) {
        var $158 = DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$(("Sala: " + (() => {
            var self = _local$1;
            switch (self._) {
                case 'App.KL.Game.State.Local.new':
                    var $159 = self.room;
                    var $160 = $159;
                    return $160;
            };
        })())), List$nil)), List$cons$((() => {
            var self = _global$2;
            switch (self._) {
                case 'App.KL.Global.State.new':
                    var $162 = self.game;
                    var $163 = $162;
                    var _game$3 = $163;
                    break;
            };
            var self = _game$3;
            switch (self._) {
                case 'Maybe.some':
                    var $164 = self.value;
                    var $165 = DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$(("Online: " + Nat$show$((list_length(Map$to_list$((() => {
                        var self = $164;
                        switch (self._) {
                            case 'App.KL.Game.new':
                                var $166 = self.players;
                                var $167 = $166;
                                return $167;
                        };
                    })())))))), List$nil));
                    var $161 = $165;
                    break;
                case 'Maybe.none':
                    var $168 = DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$("Not ingame."), List$nil));
                    var $161 = $168;
                    break;
            };
            return $161;
        })(), List$nil)));
        return $158;
    };
    const App$KL$Game$draw = x0 => x1 => App$KL$Game$draw$(x0, x1);

    function App$KL$draw$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'App.Store.new':
                var $170 = self.local;
                var $171 = self.global;
                var self = $170;
                switch (self._) {
                    case 'App.KL.State.Local.lobby':
                        var $173 = self.state;
                        var $174 = App$KL$Lobby$draw$($173, $171);
                        var $172 = $174;
                        break;
                    case 'App.KL.State.Local.game':
                        var $175 = self.state;
                        var $176 = App$KL$Game$draw$($175, $171);
                        var $172 = $176;
                        break;
                };
                var $169 = $172;
                break;
        };
        return $169;
    };
    const App$KL$draw = x0 => App$KL$draw$(x0);

    function IO$(_A$1) {
        var $177 = null;
        return $177;
    };
    const IO = x0 => IO$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $179 = self.fst;
                var $180 = $179;
                var $178 = $180;
                break;
        };
        return $178;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function String$map$(_f$1, _as$2) {
        var self = _as$2;
        if (self.length === 0) {
            var $182 = String$nil;
            var $181 = $182;
        } else {
            var $183 = self.charCodeAt(0);
            var $184 = self.slice(1);
            var $185 = String$cons$(_f$1($183), String$map$(_f$1, $184));
            var $181 = $185;
        };
        return $181;
    };
    const String$map = x0 => x1 => String$map$(x0, x1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $187 = Bool$false;
                var $186 = $187;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $188 = Bool$true;
                var $186 = $188;
                break;
        };
        return $186;
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
                var $190 = self.pred;
                var $191 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $193 = self.pred;
                            var $194 = (_a$pred$10 => {
                                var $195 = Word$cmp$go$(_a$pred$10, $193, _c$4);
                                return $195;
                            });
                            var $192 = $194;
                            break;
                        case 'Word.i':
                            var $196 = self.pred;
                            var $197 = (_a$pred$10 => {
                                var $198 = Word$cmp$go$(_a$pred$10, $196, Cmp$ltn);
                                return $198;
                            });
                            var $192 = $197;
                            break;
                        case 'Word.e':
                            var $199 = (_a$pred$8 => {
                                var $200 = _c$4;
                                return $200;
                            });
                            var $192 = $199;
                            break;
                    };
                    var $192 = $192($190);
                    return $192;
                });
                var $189 = $191;
                break;
            case 'Word.i':
                var $201 = self.pred;
                var $202 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $204 = self.pred;
                            var $205 = (_a$pred$10 => {
                                var $206 = Word$cmp$go$(_a$pred$10, $204, Cmp$gtn);
                                return $206;
                            });
                            var $203 = $205;
                            break;
                        case 'Word.i':
                            var $207 = self.pred;
                            var $208 = (_a$pred$10 => {
                                var $209 = Word$cmp$go$(_a$pred$10, $207, _c$4);
                                return $209;
                            });
                            var $203 = $208;
                            break;
                        case 'Word.e':
                            var $210 = (_a$pred$8 => {
                                var $211 = _c$4;
                                return $211;
                            });
                            var $203 = $210;
                            break;
                    };
                    var $203 = $203($201);
                    return $203;
                });
                var $189 = $202;
                break;
            case 'Word.e':
                var $212 = (_b$5 => {
                    var $213 = _c$4;
                    return $213;
                });
                var $189 = $212;
                break;
        };
        var $189 = $189(_b$3);
        return $189;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $214 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $214;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $215 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $215;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $217 = Bool$true;
                var $216 = $217;
                break;
            case 'Cmp.gtn':
                var $218 = Bool$false;
                var $216 = $218;
                break;
        };
        return $216;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $219 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $219;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U16$lte = a0 => a1 => (a0 <= a1);

    function U16$new$(_value$1) {
        var $220 = word_to_u16(_value$1);
        return $220;
    };
    const U16$new = x0 => U16$new$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$(_size$1) {
        var $221 = null;
        return $221;
    };
    const Word = x0 => Word$(x0);

    function Word$i$(_pred$2) {
        var $222 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $222;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $223 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $223;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $225 = self.pred;
                var $226 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $228 = self.pred;
                            var $229 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $231 = Word$i$(Word$adder$(_a$pred$10, $228, Bool$false));
                                    var $230 = $231;
                                } else {
                                    var $232 = Word$o$(Word$adder$(_a$pred$10, $228, Bool$false));
                                    var $230 = $232;
                                };
                                return $230;
                            });
                            var $227 = $229;
                            break;
                        case 'Word.i':
                            var $233 = self.pred;
                            var $234 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $236 = Word$o$(Word$adder$(_a$pred$10, $233, Bool$true));
                                    var $235 = $236;
                                } else {
                                    var $237 = Word$i$(Word$adder$(_a$pred$10, $233, Bool$false));
                                    var $235 = $237;
                                };
                                return $235;
                            });
                            var $227 = $234;
                            break;
                        case 'Word.e':
                            var $238 = (_a$pred$8 => {
                                var $239 = Word$e;
                                return $239;
                            });
                            var $227 = $238;
                            break;
                    };
                    var $227 = $227($225);
                    return $227;
                });
                var $224 = $226;
                break;
            case 'Word.i':
                var $240 = self.pred;
                var $241 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $243 = self.pred;
                            var $244 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $246 = Word$o$(Word$adder$(_a$pred$10, $243, Bool$true));
                                    var $245 = $246;
                                } else {
                                    var $247 = Word$i$(Word$adder$(_a$pred$10, $243, Bool$false));
                                    var $245 = $247;
                                };
                                return $245;
                            });
                            var $242 = $244;
                            break;
                        case 'Word.i':
                            var $248 = self.pred;
                            var $249 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $251 = Word$i$(Word$adder$(_a$pred$10, $248, Bool$true));
                                    var $250 = $251;
                                } else {
                                    var $252 = Word$o$(Word$adder$(_a$pred$10, $248, Bool$true));
                                    var $250 = $252;
                                };
                                return $250;
                            });
                            var $242 = $249;
                            break;
                        case 'Word.e':
                            var $253 = (_a$pred$8 => {
                                var $254 = Word$e;
                                return $254;
                            });
                            var $242 = $253;
                            break;
                    };
                    var $242 = $242($240);
                    return $242;
                });
                var $224 = $241;
                break;
            case 'Word.e':
                var $255 = (_b$5 => {
                    var $256 = Word$e;
                    return $256;
                });
                var $224 = $255;
                break;
        };
        var $224 = $224(_b$3);
        return $224;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $257 = Word$adder$(_a$2, _b$3, Bool$false);
        return $257;
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
                    var $258 = _x$4;
                    return $258;
                } else {
                    var $259 = (self - 1n);
                    var $260 = Nat$apply$($259, _f$3, _f$3(_x$4));
                    return $260;
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
                var $262 = self.pred;
                var $263 = Word$i$($262);
                var $261 = $263;
                break;
            case 'Word.i':
                var $264 = self.pred;
                var $265 = Word$o$(Word$inc$($264));
                var $261 = $265;
                break;
            case 'Word.e':
                var $266 = Word$e;
                var $261 = $266;
                break;
        };
        return $261;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $268 = Word$e;
            var $267 = $268;
        } else {
            var $269 = (self - 1n);
            var $270 = Word$o$(Word$zero$($269));
            var $267 = $270;
        };
        return $267;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $271 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $271;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);

    function Char$to_lower$(_char$1) {
        var self = ((_char$1 >= 65) && (_char$1 <= 90));
        if (self) {
            var $273 = ((_char$1 + 32) & 0xFFFF);
            var $272 = $273;
        } else {
            var $274 = _char$1;
            var $272 = $274;
        };
        return $272;
    };
    const Char$to_lower = x0 => Char$to_lower$(x0);

    function String$to_lower$(_str$1) {
        var $275 = String$map$(Char$to_lower, _str$1);
        return $275;
    };
    const String$to_lower = x0 => String$to_lower$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $276 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $276;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $278 = self.value;
                var $279 = _f$4($278);
                var $277 = $279;
                break;
            case 'IO.ask':
                var $280 = self.query;
                var $281 = self.param;
                var $282 = self.then;
                var $283 = IO$ask$($280, $281, (_x$8 => {
                    var $284 = IO$bind$($282(_x$8), _f$4);
                    return $284;
                }));
                var $277 = $283;
                break;
        };
        return $277;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $285 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $285;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $286 = _new$2(IO$bind)(IO$end);
        return $286;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function App$set_local$(_value$2) {
        var $287 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $288 = _m$pure$4;
            return $288;
        }))(Maybe$some$(_value$2));
        return $287;
    };
    const App$set_local = x0 => App$set_local$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $289 = _m$pure$3;
        return $289;
    }))(Maybe$none);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $291 = Bool$false;
                var $290 = $291;
                break;
            case 'Cmp.eql':
                var $292 = Bool$true;
                var $290 = $292;
                break;
        };
        return $290;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $293 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $293;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $295 = self.value;
                var $296 = $295;
                var $294 = $296;
                break;
            case 'Maybe.none':
                var $297 = _a$3;
                var $294 = $297;
                break;
        };
        return $294;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $298 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $298;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $300 = self.val;
                var $301 = Maybe$some$($300);
                var $299 = $301;
                break;
            case 'Parser.Reply.error':
                var $302 = Maybe$none;
                var $299 = $302;
                break;
        };
        return $299;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $303 = null;
        return $303;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$error$(_err$2) {
        var $304 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $304;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $306 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $308 = self.idx;
                        var self = ($306 > $308);
                        if (self) {
                            var $310 = _a$1;
                            var $309 = $310;
                        } else {
                            var $311 = _b$2;
                            var $309 = $311;
                        };
                        var $307 = $309;
                        break;
                };
                var $305 = $307;
                break;
        };
        return $305;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $313 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $315 = self.value;
                        var $316 = Maybe$some$(Parser$Error$combine$($313, $315));
                        var $314 = $316;
                        break;
                    case 'Maybe.none':
                        var $317 = _a$1;
                        var $314 = $317;
                        break;
                };
                var $312 = $314;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $319 = Maybe$none;
                        var $318 = $319;
                        break;
                    case 'Maybe.some':
                        var $320 = _b$2;
                        var $318 = $320;
                        break;
                };
                var $312 = $318;
                break;
        };
        return $312;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $321 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $321;
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
                                var $323 = self.pst;
                                var $324 = self.val;
                                var $325 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $326 = _values$3(List$cons$($324, _xs$12));
                                    return $326;
                                }), $323);
                                var $322 = $325;
                                break;
                            case 'Parser.Reply.error':
                                var $327 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $322 = $327;
                                break;
                        };
                        return $322;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $328 = Parser$many$go(_parser$2)((_x$3 => {
            var $329 = _x$3;
            return $329;
        }));
        return $328;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $331 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $333 = self.err;
                        var self = $331;
                        switch (self._) {
                            case 'Maybe.some':
                                var $335 = self.value;
                                var $336 = Parser$Reply$error$(Parser$Error$combine$($335, $333));
                                var $334 = $336;
                                break;
                            case 'Maybe.none':
                                var $337 = Parser$Reply$error$($333);
                                var $334 = $337;
                                break;
                        };
                        var $332 = $334;
                        break;
                    case 'Parser.Reply.value':
                        var $338 = self.pst;
                        var $339 = self.val;
                        var self = $338;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $341 = self.err;
                                var $342 = self.nam;
                                var $343 = self.ini;
                                var $344 = self.idx;
                                var $345 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($331, $341), $342, $343, $344, $345);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $347 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $349 = self.err;
                                                var self = $347;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $351 = self.value;
                                                        var $352 = Parser$Reply$error$(Parser$Error$combine$($351, $349));
                                                        var $350 = $352;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $353 = Parser$Reply$error$($349);
                                                        var $350 = $353;
                                                        break;
                                                };
                                                var $348 = $350;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $354 = self.pst;
                                                var $355 = self.val;
                                                var self = $354;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $357 = self.err;
                                                        var $358 = self.nam;
                                                        var $359 = self.ini;
                                                        var $360 = self.idx;
                                                        var $361 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($347, $357), $358, $359, $360, $361);
                                                        var $362 = Parser$Reply$value$(_reply$pst$31, List$cons$($339, $355));
                                                        var $356 = $362;
                                                        break;
                                                };
                                                var $348 = $356;
                                                break;
                                        };
                                        var $346 = $348;
                                        break;
                                };
                                var $340 = $346;
                                break;
                        };
                        var $332 = $340;
                        break;
                };
                var $330 = $332;
                break;
        };
        return $330;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $363 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $363;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $364 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $364;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $366 = self.err;
                var $367 = self.nam;
                var $368 = self.ini;
                var $369 = self.idx;
                var $370 = self.str;
                var self = $370;
                if (self.length === 0) {
                    var $372 = Parser$Reply$fail$($367, $368, $369, "Not a digit.");
                    var $371 = $372;
                } else {
                    var $373 = self.charCodeAt(0);
                    var $374 = self.slice(1);
                    var _pst$9 = Parser$State$new$($366, $367, $368, Nat$succ$($369), $374);
                    var self = ($373 === 48);
                    if (self) {
                        var $376 = Parser$Reply$value$(_pst$9, 0n);
                        var $375 = $376;
                    } else {
                        var self = ($373 === 49);
                        if (self) {
                            var $378 = Parser$Reply$value$(_pst$9, 1n);
                            var $377 = $378;
                        } else {
                            var self = ($373 === 50);
                            if (self) {
                                var $380 = Parser$Reply$value$(_pst$9, 2n);
                                var $379 = $380;
                            } else {
                                var self = ($373 === 51);
                                if (self) {
                                    var $382 = Parser$Reply$value$(_pst$9, 3n);
                                    var $381 = $382;
                                } else {
                                    var self = ($373 === 52);
                                    if (self) {
                                        var $384 = Parser$Reply$value$(_pst$9, 4n);
                                        var $383 = $384;
                                    } else {
                                        var self = ($373 === 53);
                                        if (self) {
                                            var $386 = Parser$Reply$value$(_pst$9, 5n);
                                            var $385 = $386;
                                        } else {
                                            var self = ($373 === 54);
                                            if (self) {
                                                var $388 = Parser$Reply$value$(_pst$9, 6n);
                                                var $387 = $388;
                                            } else {
                                                var self = ($373 === 55);
                                                if (self) {
                                                    var $390 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $389 = $390;
                                                } else {
                                                    var self = ($373 === 56);
                                                    if (self) {
                                                        var $392 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $391 = $392;
                                                    } else {
                                                        var self = ($373 === 57);
                                                        if (self) {
                                                            var $394 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $393 = $394;
                                                        } else {
                                                            var $395 = Parser$Reply$fail$($367, $368, $369, "Not a digit.");
                                                            var $393 = $395;
                                                        };
                                                        var $391 = $393;
                                                    };
                                                    var $389 = $391;
                                                };
                                                var $387 = $389;
                                            };
                                            var $385 = $387;
                                        };
                                        var $383 = $385;
                                    };
                                    var $381 = $383;
                                };
                                var $379 = $381;
                            };
                            var $377 = $379;
                        };
                        var $375 = $377;
                    };
                    var $371 = $375;
                };
                var $365 = $371;
                break;
        };
        return $365;
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
                        var $396 = self.head;
                        var $397 = self.tail;
                        var $398 = Nat$from_base$go$(_b$1, $397, (_b$1 * _p$3), (($396 * _p$3) + _res$4));
                        return $398;
                    case 'List.nil':
                        var $399 = _res$4;
                        return $399;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $400 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $400;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $402 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $404 = self.err;
                        var self = $402;
                        switch (self._) {
                            case 'Maybe.some':
                                var $406 = self.value;
                                var $407 = Parser$Reply$error$(Parser$Error$combine$($406, $404));
                                var $405 = $407;
                                break;
                            case 'Maybe.none':
                                var $408 = Parser$Reply$error$($404);
                                var $405 = $408;
                                break;
                        };
                        var $403 = $405;
                        break;
                    case 'Parser.Reply.value':
                        var $409 = self.pst;
                        var $410 = self.val;
                        var self = $409;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $412 = self.err;
                                var $413 = self.nam;
                                var $414 = self.ini;
                                var $415 = self.idx;
                                var $416 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($402, $412), $413, $414, $415, $416);
                                var $417 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $410));
                                var $411 = $417;
                                break;
                        };
                        var $403 = $411;
                        break;
                };
                var $401 = $403;
                break;
        };
        return $401;
    };
    const Parser$nat = x0 => Parser$nat$(x0);
    const Nat$read = a0 => (BigInt(a0));
    const IO$get_time = IO$ask$("get_time", "", (_time$1 => {
        var $418 = IO$end$((BigInt(_time$1)));
        return $418;
    }));

    function Nat$random$(_seed$1) {
        var _m$2 = 1664525n;
        var _i$3 = 1013904223n;
        var _q$4 = 4294967296n;
        var $419 = (((_seed$1 * _m$2) + _i$3) % _q$4);
        return $419;
    };
    const Nat$random = x0 => Nat$random$(x0);

    function IO$random$(_a$1) {
        var $420 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $421 = _m$bind$2;
            return $421;
        }))(IO$get_time)((_seed$2 => {
            var _seed$3 = Nat$random$(_seed$2);
            var $422 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $423 = _m$pure$5;
                return $423;
            }))((_seed$3 % _a$1));
            return $422;
        }));
        return $420;
    };
    const IO$random = x0 => IO$random$(x0);

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
                    var $424 = _xs$2;
                    return $424;
                } else {
                    var $425 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $427 = String$nil;
                        var $426 = $427;
                    } else {
                        var $428 = self.charCodeAt(0);
                        var $429 = self.slice(1);
                        var $430 = String$drop$($425, $429);
                        var $426 = $430;
                    };
                    return $426;
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
                    var $431 = _n$2;
                    return $431;
                } else {
                    var $432 = self.charCodeAt(0);
                    var $433 = self.slice(1);
                    var $434 = String$length$go$($433, Nat$succ$(_n$2));
                    return $434;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $435 = String$length$go$(_xs$1, 0n);
        return $435;
    };
    const String$length = x0 => String$length$(x0);
    const Unit$new = null;

    function IO$do$(_call$1, _param$2) {
        var $436 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $437 = IO$end$(Unit$new);
            return $437;
        }));
        return $436;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$2, _param$3) {
        var $438 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $439 = _m$bind$4;
            return $439;
        }))(IO$do$(_call$2, _param$3))((_$4 => {
            var $440 = App$pass;
            return $440;
        }));
        return $438;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$2) {
        var $441 = App$do$("watch", _room$2);
        return $441;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$new_post$(_room$2, _data$3) {
        var $442 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $443 = _m$bind$4;
            return $443;
        }))(App$do$("post", (_room$2 + (";" + _data$3))))((_$4 => {
            var $444 = App$pass;
            return $444;
        }));
        return $442;
    };
    const App$new_post = x0 => x1 => App$new_post$(x0, x1);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $446 = String$nil;
            var $445 = $446;
        } else {
            var $447 = self.charCodeAt(0);
            var $448 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $450 = String$nil;
                var $449 = $450;
            } else {
                var $451 = (self - 1n);
                var $452 = String$cons$($447, String$take$($451, $448));
                var $449 = $452;
            };
            var $445 = $449;
        };
        return $445;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $454 = _str$3;
            var $453 = $454;
        } else {
            var $455 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $457 = String$cons$(_chr$2, String$pad_right$($455, _chr$2, ""));
                var $456 = $457;
            } else {
                var $458 = self.charCodeAt(0);
                var $459 = self.slice(1);
                var $460 = String$cons$($458, String$pad_right$($455, _chr$2, $459));
                var $456 = $460;
            };
            var $453 = $456;
        };
        return $453;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_right_exact$(_size$1, _chr$2, _str$3) {
        var $461 = String$take$(_size$1, String$pad_right$(_size$1, _chr$2, _str$3));
        return $461;
    };
    const String$pad_right_exact = x0 => x1 => x2 => String$pad_right_exact$(x0, x1, x2);

    function Bits$hex$encode$(_x$1) {
        var self = _x$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $463 = self.slice(0, -1);
                var self = $463;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $465 = self.slice(0, -1);
                        var self = $465;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $467 = self.slice(0, -1);
                                var self = $467;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $469 = self.slice(0, -1);
                                        var $470 = ("0" + Bits$hex$encode$($469));
                                        var $468 = $470;
                                        break;
                                    case 'i':
                                        var $471 = self.slice(0, -1);
                                        var $472 = ("8" + Bits$hex$encode$($471));
                                        var $468 = $472;
                                        break;
                                    case 'e':
                                        var $473 = "0";
                                        var $468 = $473;
                                        break;
                                };
                                var $466 = $468;
                                break;
                            case 'i':
                                var $474 = self.slice(0, -1);
                                var self = $474;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $476 = self.slice(0, -1);
                                        var $477 = ("4" + Bits$hex$encode$($476));
                                        var $475 = $477;
                                        break;
                                    case 'i':
                                        var $478 = self.slice(0, -1);
                                        var $479 = ("c" + Bits$hex$encode$($478));
                                        var $475 = $479;
                                        break;
                                    case 'e':
                                        var $480 = "4";
                                        var $475 = $480;
                                        break;
                                };
                                var $466 = $475;
                                break;
                            case 'e':
                                var $481 = "0";
                                var $466 = $481;
                                break;
                        };
                        var $464 = $466;
                        break;
                    case 'i':
                        var $482 = self.slice(0, -1);
                        var self = $482;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $484 = self.slice(0, -1);
                                var self = $484;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $486 = self.slice(0, -1);
                                        var $487 = ("2" + Bits$hex$encode$($486));
                                        var $485 = $487;
                                        break;
                                    case 'i':
                                        var $488 = self.slice(0, -1);
                                        var $489 = ("a" + Bits$hex$encode$($488));
                                        var $485 = $489;
                                        break;
                                    case 'e':
                                        var $490 = "2";
                                        var $485 = $490;
                                        break;
                                };
                                var $483 = $485;
                                break;
                            case 'i':
                                var $491 = self.slice(0, -1);
                                var self = $491;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $493 = self.slice(0, -1);
                                        var $494 = ("6" + Bits$hex$encode$($493));
                                        var $492 = $494;
                                        break;
                                    case 'i':
                                        var $495 = self.slice(0, -1);
                                        var $496 = ("e" + Bits$hex$encode$($495));
                                        var $492 = $496;
                                        break;
                                    case 'e':
                                        var $497 = "6";
                                        var $492 = $497;
                                        break;
                                };
                                var $483 = $492;
                                break;
                            case 'e':
                                var $498 = "2";
                                var $483 = $498;
                                break;
                        };
                        var $464 = $483;
                        break;
                    case 'e':
                        var $499 = "0";
                        var $464 = $499;
                        break;
                };
                var $462 = $464;
                break;
            case 'i':
                var $500 = self.slice(0, -1);
                var self = $500;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $502 = self.slice(0, -1);
                        var self = $502;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $504 = self.slice(0, -1);
                                var self = $504;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $506 = self.slice(0, -1);
                                        var $507 = ("1" + Bits$hex$encode$($506));
                                        var $505 = $507;
                                        break;
                                    case 'i':
                                        var $508 = self.slice(0, -1);
                                        var $509 = ("9" + Bits$hex$encode$($508));
                                        var $505 = $509;
                                        break;
                                    case 'e':
                                        var $510 = "1";
                                        var $505 = $510;
                                        break;
                                };
                                var $503 = $505;
                                break;
                            case 'i':
                                var $511 = self.slice(0, -1);
                                var self = $511;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $513 = self.slice(0, -1);
                                        var $514 = ("5" + Bits$hex$encode$($513));
                                        var $512 = $514;
                                        break;
                                    case 'i':
                                        var $515 = self.slice(0, -1);
                                        var $516 = ("d" + Bits$hex$encode$($515));
                                        var $512 = $516;
                                        break;
                                    case 'e':
                                        var $517 = "5";
                                        var $512 = $517;
                                        break;
                                };
                                var $503 = $512;
                                break;
                            case 'e':
                                var $518 = "1";
                                var $503 = $518;
                                break;
                        };
                        var $501 = $503;
                        break;
                    case 'i':
                        var $519 = self.slice(0, -1);
                        var self = $519;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $521 = self.slice(0, -1);
                                var self = $521;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $523 = self.slice(0, -1);
                                        var $524 = ("3" + Bits$hex$encode$($523));
                                        var $522 = $524;
                                        break;
                                    case 'i':
                                        var $525 = self.slice(0, -1);
                                        var $526 = ("b" + Bits$hex$encode$($525));
                                        var $522 = $526;
                                        break;
                                    case 'e':
                                        var $527 = "3";
                                        var $522 = $527;
                                        break;
                                };
                                var $520 = $522;
                                break;
                            case 'i':
                                var $528 = self.slice(0, -1);
                                var self = $528;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $530 = self.slice(0, -1);
                                        var $531 = ("7" + Bits$hex$encode$($530));
                                        var $529 = $531;
                                        break;
                                    case 'i':
                                        var $532 = self.slice(0, -1);
                                        var $533 = ("f" + Bits$hex$encode$($532));
                                        var $529 = $533;
                                        break;
                                    case 'e':
                                        var $534 = "7";
                                        var $529 = $534;
                                        break;
                                };
                                var $520 = $529;
                                break;
                            case 'e':
                                var $535 = "3";
                                var $520 = $535;
                                break;
                        };
                        var $501 = $520;
                        break;
                    case 'e':
                        var $536 = "1";
                        var $501 = $536;
                        break;
                };
                var $462 = $501;
                break;
            case 'e':
                var $537 = "";
                var $462 = $537;
                break;
        };
        return $462;
    };
    const Bits$hex$encode = x0 => Bits$hex$encode$(x0);

    function Serializer$run$(_serializer$2, _x$3) {
        var $538 = _serializer$2(_x$3)(Bits$e);
        return $538;
    };
    const Serializer$run = x0 => x1 => Serializer$run$(x0, x1);

    function App$KL$Global$Event$serializer$(_x$1, _bs$2) {
        var self = _x$1;
        switch (self._) {
            case 'App.KL.Global.Event.void':
                var $540 = (_bs$2 + '0');
                var $539 = $540;
                break;
            case 'App.KL.Global.Event.join_room':
                var $541 = (_bs$2 + '1');
                var $539 = $541;
                break;
        };
        return $539;
    };
    const App$KL$Global$Event$serializer = x0 => x1 => App$KL$Global$Event$serializer$(x0, x1);

    function App$KL$Global$Event$serialize_post$(_ev$1) {
        var $542 = ("0x" + String$pad_right_exact$(64n, 48, Bits$hex$encode$(Serializer$run$(App$KL$Global$Event$serializer, _ev$1))));
        return $542;
    };
    const App$KL$Global$Event$serialize_post = x0 => App$KL$Global$Event$serialize_post$(x0);
    const App$KL$Global$Event$join_room = ({
        _: 'App.KL.Global.Event.join_room'
    });

    function App$KL$State$Local$game$(_state$1) {
        var $543 = ({
            _: 'App.KL.State.Local.game',
            'state': _state$1
        });
        return $543;
    };
    const App$KL$State$Local$game = x0 => App$KL$State$Local$game$(x0);

    function App$KL$Game$State$Local$new$(_user$1, _room$2) {
        var $544 = ({
            _: 'App.KL.Game.State.Local.new',
            'user': _user$1,
            'room': _room$2
        });
        return $544;
    };
    const App$KL$Game$State$Local$new = x0 => x1 => App$KL$Game$State$Local$new$(x0, x1);

    function App$KL$Lobby$when$(_local$1, _event$2) {
        var self = _event$2;
        switch (self._) {
            case 'App.Event.init':
                var $546 = self.user;
                var self = _local$1;
                switch (self._) {
                    case 'App.KL.Lobby.State.Local.new':
                        var $548 = self.room_input;
                        var $549 = App$KL$Lobby$State$Local$new$(String$to_lower$($546), $548);
                        var _new_local$6 = $549;
                        break;
                };
                var $547 = App$set_local$(App$KL$State$Local$lobby$(_new_local$6));
                var $545 = $547;
                break;
            case 'App.Event.mouse_click':
                var $550 = self.id;
                var self = ($550 === "random");
                if (self) {
                    var $552 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $553 = _m$bind$6;
                        return $553;
                    }))(IO$random$(10000000000n))((_rnd$6 => {
                        var _str$7 = Nat$show$(_rnd$6);
                        var _room$8 = ("0x72214422" + String$drop$((String$length$(_str$7) - 6n <= 0n ? 0n : String$length$(_str$7) - 6n), _str$7));
                        var self = _local$1;
                        switch (self._) {
                            case 'App.KL.Lobby.State.Local.new':
                                var $555 = self.user;
                                var $556 = App$KL$Lobby$State$Local$new$($555, _room$8);
                                var _new_local$9 = $556;
                                break;
                        };
                        var $554 = App$set_local$(App$KL$State$Local$lobby$(_new_local$9));
                        return $554;
                    }));
                    var $551 = $552;
                } else {
                    var self = ($550 === "ready");
                    if (self) {
                        var $558 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                            var $559 = _m$bind$6;
                            return $559;
                        }))(App$watch$((() => {
                            var self = _local$1;
                            switch (self._) {
                                case 'App.KL.Lobby.State.Local.new':
                                    var $560 = self.room_input;
                                    var $561 = $560;
                                    return $561;
                            };
                        })()))((_$6 => {
                            var $562 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                                var $563 = _m$bind$7;
                                return $563;
                            }))(App$new_post$((() => {
                                var self = _local$1;
                                switch (self._) {
                                    case 'App.KL.Lobby.State.Local.new':
                                        var $564 = self.room_input;
                                        var $565 = $564;
                                        return $565;
                                };
                            })(), App$KL$Global$Event$serialize_post$(App$KL$Global$Event$join_room)))((_$7 => {
                                var $566 = App$set_local$(App$KL$State$Local$game$(App$KL$Game$State$Local$new$((() => {
                                    var self = _local$1;
                                    switch (self._) {
                                        case 'App.KL.Lobby.State.Local.new':
                                            var $567 = self.user;
                                            var $568 = $567;
                                            return $568;
                                    };
                                })(), (() => {
                                    var self = _local$1;
                                    switch (self._) {
                                        case 'App.KL.Lobby.State.Local.new':
                                            var $569 = self.room_input;
                                            var $570 = $569;
                                            return $570;
                                    };
                                })())));
                                return $566;
                            }));
                            return $562;
                        }));
                        var $557 = $558;
                    } else {
                        var $571 = App$pass;
                        var $557 = $571;
                    };
                    var $551 = $557;
                };
                var $545 = $551;
                break;
            case 'App.Event.input':
                var $572 = self.text;
                var self = _local$1;
                switch (self._) {
                    case 'App.KL.Lobby.State.Local.new':
                        var $574 = self.user;
                        var $575 = App$KL$Lobby$State$Local$new$($574, $572);
                        var _new_local$6 = $575;
                        break;
                };
                var $573 = App$set_local$(App$KL$State$Local$lobby$(_new_local$6));
                var $545 = $573;
                break;
            case 'App.Event.frame':
            case 'App.Event.mouse_down':
            case 'App.Event.mouse_up':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
                var $576 = App$pass;
                var $545 = $576;
                break;
        };
        return $545;
    };
    const App$KL$Lobby$when = x0 => x1 => App$KL$Lobby$when$(x0, x1);

    function App$KL$Game$when$(_local$1, _event$2) {
        var $577 = App$pass;
        return $577;
    };
    const App$KL$Game$when = x0 => x1 => App$KL$Game$when$(x0, x1);

    function App$KL$when$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $579 = self.local;
                var self = $579;
                switch (self._) {
                    case 'App.KL.State.Local.lobby':
                        var $581 = self.state;
                        var $582 = App$KL$Lobby$when$($581, _event$1);
                        var $580 = $582;
                        break;
                    case 'App.KL.State.Local.game':
                        var $583 = self.state;
                        var $584 = App$KL$Game$when$($583, _event$1);
                        var $580 = $584;
                        break;
                };
                var $578 = $580;
                break;
        };
        return $578;
    };
    const App$KL$when = x0 => x1 => App$KL$when$(x0, x1);

    function App$KL$Global$tick$(_tick$1, _glob$2) {
        var $585 = _glob$2;
        return $585;
    };
    const App$KL$Global$tick = x0 => x1 => App$KL$Global$tick$(x0, x1);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $587 = self.snd;
                var $588 = $587;
                var $586 = $588;
                break;
        };
        return $586;
    };
    const Pair$snd = x0 => Pair$snd$(x0);
    const App$State$global = Pair$snd;

    function Deserializer$run$(_deserializer$2, _bs$3) {
        var self = _deserializer$2(_bs$3);
        switch (self._) {
            case 'Maybe.some':
                var $590 = self.value;
                var $591 = Maybe$some$((() => {
                    var self = $590;
                    switch (self._) {
                        case 'Pair.new':
                            var $592 = self.snd;
                            var $593 = $592;
                            return $593;
                    };
                })());
                var $589 = $591;
                break;
            case 'Maybe.none':
                var $594 = Maybe$none;
                var $589 = $594;
                break;
        };
        return $589;
    };
    const Deserializer$run = x0 => x1 => Deserializer$run$(x0, x1);

    function Deserializer$Reply$(_A$1) {
        var $595 = null;
        return $595;
    };
    const Deserializer$Reply = x0 => Deserializer$Reply$(x0);

    function Deserializer$choice$go$(_pars$2, _bs$3) {
        var Deserializer$choice$go$ = (_pars$2, _bs$3) => ({
            ctr: 'TCO',
            arg: [_pars$2, _bs$3]
        });
        var Deserializer$choice$go = _pars$2 => _bs$3 => Deserializer$choice$go$(_pars$2, _bs$3);
        var arg = [_pars$2, _bs$3];
        while (true) {
            let [_pars$2, _bs$3] = arg;
            var R = (() => {
                var self = _pars$2;
                switch (self._) {
                    case 'List.cons':
                        var $596 = self.head;
                        var $597 = self.tail;
                        var self = $596(_bs$3);
                        switch (self._) {
                            case 'Maybe.some':
                                var $599 = self.value;
                                var self = $599;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $601 = self.fst;
                                        var $602 = self.snd;
                                        var $603 = Maybe$some$(Pair$new$($601, $602));
                                        var $600 = $603;
                                        break;
                                };
                                var $598 = $600;
                                break;
                            case 'Maybe.none':
                                var $604 = Deserializer$choice$go$($597, _bs$3);
                                var $598 = $604;
                                break;
                        };
                        return $598;
                    case 'List.nil':
                        var $605 = Maybe$none;
                        return $605;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Deserializer$choice$go = x0 => x1 => Deserializer$choice$go$(x0, x1);

    function Deserializer$choice$(_pars$2) {
        var $606 = Deserializer$choice$go(_pars$2);
        return $606;
    };
    const Deserializer$choice = x0 => Deserializer$choice$(x0);

    function Deserializer$(_A$1) {
        var $607 = null;
        return $607;
    };
    const Deserializer = x0 => Deserializer$(x0);

    function Deserializer$bind$(_deserialize$3, _next$4, _bs$5) {
        var self = _deserialize$3(_bs$5);
        switch (self._) {
            case 'Maybe.some':
                var $609 = self.value;
                var self = $609;
                switch (self._) {
                    case 'Pair.new':
                        var $611 = self.fst;
                        var $612 = self.snd;
                        var $613 = _next$4($612)($611);
                        var $610 = $613;
                        break;
                };
                var $608 = $610;
                break;
            case 'Maybe.none':
                var $614 = Maybe$none;
                var $608 = $614;
                break;
        };
        return $608;
    };
    const Deserializer$bind = x0 => x1 => x2 => Deserializer$bind$(x0, x1, x2);

    function Deserializer$bits$(_bits$1, _bs$2) {
        var Deserializer$bits$ = (_bits$1, _bs$2) => ({
            ctr: 'TCO',
            arg: [_bits$1, _bs$2]
        });
        var Deserializer$bits = _bits$1 => _bs$2 => Deserializer$bits$(_bits$1, _bs$2);
        var arg = [_bits$1, _bs$2];
        while (true) {
            let [_bits$1, _bs$2] = arg;
            var R = (() => {
                var self = _bits$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $615 = self.slice(0, -1);
                        var self = _bs$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $617 = self.slice(0, -1);
                                var $618 = Deserializer$bits$($615, $617);
                                var $616 = $618;
                                break;
                            case 'e':
                            case 'i':
                                var $619 = Maybe$none;
                                var $616 = $619;
                                break;
                        };
                        return $616;
                    case 'i':
                        var $620 = self.slice(0, -1);
                        var self = _bs$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'i':
                                var $622 = self.slice(0, -1);
                                var $623 = Deserializer$bits$($620, $622);
                                var $621 = $623;
                                break;
                            case 'e':
                            case 'o':
                                var $624 = Maybe$none;
                                var $621 = $624;
                                break;
                        };
                        return $621;
                    case 'e':
                        var $625 = Maybe$some$(Pair$new$(_bs$2, Unit$new));
                        return $625;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Deserializer$bits = x0 => x1 => Deserializer$bits$(x0, x1);

    function Deserializer$pure$(_value$2, _bs$3) {
        var $626 = Maybe$some$(Pair$new$(_bs$3, _value$2));
        return $626;
    };
    const Deserializer$pure = x0 => x1 => Deserializer$pure$(x0, x1);
    const App$KL$Global$Event$void = ({
        _: 'App.KL.Global.Event.void'
    });
    const App$KL$Global$Event$deserializer = Deserializer$choice$(List$cons$(Deserializer$bind(Deserializer$bits((Bits$e + '0')))((_$1 => {
        var $627 = Deserializer$pure(App$KL$Global$Event$void);
        return $627;
    })), List$cons$(Deserializer$bind(Deserializer$bits((Bits$e + '1')))((_$1 => {
        var $628 = Deserializer$pure(App$KL$Global$Event$join_room);
        return $628;
    })), List$nil)));

    function Bits$hex$decode$(_x$1) {
        var self = _x$1;
        if (self.length === 0) {
            var $630 = Bits$e;
            var $629 = $630;
        } else {
            var $631 = self.charCodeAt(0);
            var $632 = self.slice(1);
            var self = ($631 === 48);
            if (self) {
                var $634 = ((((Bits$hex$decode$($632) + '0') + '0') + '0') + '0');
                var $633 = $634;
            } else {
                var self = ($631 === 49);
                if (self) {
                    var $636 = ((((Bits$hex$decode$($632) + '0') + '0') + '0') + '1');
                    var $635 = $636;
                } else {
                    var self = ($631 === 50);
                    if (self) {
                        var $638 = ((((Bits$hex$decode$($632) + '0') + '0') + '1') + '0');
                        var $637 = $638;
                    } else {
                        var self = ($631 === 51);
                        if (self) {
                            var $640 = ((((Bits$hex$decode$($632) + '0') + '0') + '1') + '1');
                            var $639 = $640;
                        } else {
                            var self = ($631 === 52);
                            if (self) {
                                var $642 = ((((Bits$hex$decode$($632) + '0') + '1') + '0') + '0');
                                var $641 = $642;
                            } else {
                                var self = ($631 === 53);
                                if (self) {
                                    var $644 = ((((Bits$hex$decode$($632) + '0') + '1') + '0') + '1');
                                    var $643 = $644;
                                } else {
                                    var self = ($631 === 54);
                                    if (self) {
                                        var $646 = ((((Bits$hex$decode$($632) + '0') + '1') + '1') + '0');
                                        var $645 = $646;
                                    } else {
                                        var self = ($631 === 55);
                                        if (self) {
                                            var $648 = ((((Bits$hex$decode$($632) + '0') + '1') + '1') + '1');
                                            var $647 = $648;
                                        } else {
                                            var self = ($631 === 56);
                                            if (self) {
                                                var $650 = ((((Bits$hex$decode$($632) + '1') + '0') + '0') + '0');
                                                var $649 = $650;
                                            } else {
                                                var self = ($631 === 57);
                                                if (self) {
                                                    var $652 = ((((Bits$hex$decode$($632) + '1') + '0') + '0') + '1');
                                                    var $651 = $652;
                                                } else {
                                                    var self = ($631 === 97);
                                                    if (self) {
                                                        var $654 = ((((Bits$hex$decode$($632) + '1') + '0') + '1') + '0');
                                                        var $653 = $654;
                                                    } else {
                                                        var self = ($631 === 98);
                                                        if (self) {
                                                            var $656 = ((((Bits$hex$decode$($632) + '1') + '0') + '1') + '1');
                                                            var $655 = $656;
                                                        } else {
                                                            var self = ($631 === 99);
                                                            if (self) {
                                                                var $658 = ((((Bits$hex$decode$($632) + '1') + '1') + '0') + '0');
                                                                var $657 = $658;
                                                            } else {
                                                                var self = ($631 === 100);
                                                                if (self) {
                                                                    var $660 = ((((Bits$hex$decode$($632) + '1') + '1') + '0') + '1');
                                                                    var $659 = $660;
                                                                } else {
                                                                    var self = ($631 === 101);
                                                                    if (self) {
                                                                        var $662 = ((((Bits$hex$decode$($632) + '1') + '1') + '1') + '0');
                                                                        var $661 = $662;
                                                                    } else {
                                                                        var self = ($631 === 102);
                                                                        if (self) {
                                                                            var $664 = ((((Bits$hex$decode$($632) + '1') + '1') + '1') + '1');
                                                                            var $663 = $664;
                                                                        } else {
                                                                            var self = ($631 === 65);
                                                                            if (self) {
                                                                                var $666 = ((((Bits$hex$decode$($632) + '1') + '0') + '1') + '0');
                                                                                var $665 = $666;
                                                                            } else {
                                                                                var self = ($631 === 66);
                                                                                if (self) {
                                                                                    var $668 = ((((Bits$hex$decode$($632) + '1') + '0') + '1') + '1');
                                                                                    var $667 = $668;
                                                                                } else {
                                                                                    var self = ($631 === 67);
                                                                                    if (self) {
                                                                                        var $670 = ((((Bits$hex$decode$($632) + '1') + '1') + '0') + '0');
                                                                                        var $669 = $670;
                                                                                    } else {
                                                                                        var self = ($631 === 68);
                                                                                        if (self) {
                                                                                            var $672 = ((((Bits$hex$decode$($632) + '1') + '1') + '0') + '1');
                                                                                            var $671 = $672;
                                                                                        } else {
                                                                                            var self = ($631 === 69);
                                                                                            if (self) {
                                                                                                var $674 = ((((Bits$hex$decode$($632) + '1') + '1') + '1') + '0');
                                                                                                var $673 = $674;
                                                                                            } else {
                                                                                                var self = ($631 === 70);
                                                                                                if (self) {
                                                                                                    var $676 = ((((Bits$hex$decode$($632) + '1') + '1') + '1') + '1');
                                                                                                    var $675 = $676;
                                                                                                } else {
                                                                                                    var $677 = Bits$e;
                                                                                                    var $675 = $677;
                                                                                                };
                                                                                                var $673 = $675;
                                                                                            };
                                                                                            var $671 = $673;
                                                                                        };
                                                                                        var $669 = $671;
                                                                                    };
                                                                                    var $667 = $669;
                                                                                };
                                                                                var $665 = $667;
                                                                            };
                                                                            var $663 = $665;
                                                                        };
                                                                        var $661 = $663;
                                                                    };
                                                                    var $659 = $661;
                                                                };
                                                                var $657 = $659;
                                                            };
                                                            var $655 = $657;
                                                        };
                                                        var $653 = $655;
                                                    };
                                                    var $651 = $653;
                                                };
                                                var $649 = $651;
                                            };
                                            var $647 = $649;
                                        };
                                        var $645 = $647;
                                    };
                                    var $643 = $645;
                                };
                                var $641 = $643;
                            };
                            var $639 = $641;
                        };
                        var $637 = $639;
                    };
                    var $635 = $637;
                };
                var $633 = $635;
            };
            var $629 = $633;
        };
        return $629;
    };
    const Bits$hex$decode = x0 => Bits$hex$decode$(x0);

    function App$KL$Global$Event$deserialize_post$(_hex$1) {
        var $678 = Maybe$default$(Deserializer$run$(App$KL$Global$Event$deserializer, Bits$hex$decode$(String$drop$(2n, _hex$1))), App$KL$Global$Event$void);
        return $678;
    };
    const App$KL$Global$Event$deserialize_post = x0 => App$KL$Global$Event$deserialize_post$(x0);

    function App$KL$Game$new$(_players$1) {
        var $679 = ({
            _: 'App.KL.Game.new',
            'players': _players$1
        });
        return $679;
    };
    const App$KL$Game$new = x0 => App$KL$Game$new$(x0);
    const App$KL$Game$start = App$KL$Game$new$(Map$new);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $680 = (bitsmap_set(String$to_bits$(_key$2), _val$3, _map$4, 'set'));
        return $680;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);
    const App$KL$Game$Player$new = ({
        _: 'App.KL.Game.Player.new'
    });

    function App$KL$Global$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var $681 = ((console.log(("Event: " + (_room$2 + (" " + _data$4)))), (_$6 => {
            var self = App$KL$Global$Event$deserialize_post$(_data$4);
            switch (self._) {
                case 'App.KL.Global.Event.void':
                    var $683 = _glob$5;
                    var $682 = $683;
                    break;
                case 'App.KL.Global.Event.join_room':
                    var $684 = ((console.log("- join_room"), (_$7 => {
                        var self = _glob$5;
                        switch (self._) {
                            case 'App.KL.Global.State.new':
                                var $686 = self.game;
                                var _glob$game$9 = Maybe$default$($686, App$KL$Game$start);
                                var self = _glob$game$9;
                                switch (self._) {
                                    case 'App.KL.Game.new':
                                        var $688 = App$KL$Game$new$(Map$set$(_addr$3, App$KL$Game$Player$new, (() => {
                                            var self = _glob$game$9;
                                            switch (self._) {
                                                case 'App.KL.Game.new':
                                                    var $689 = self.players;
                                                    var $690 = $689;
                                                    return $690;
                                            };
                                        })()));
                                        var _glob$game$10 = $688;
                                        break;
                                };
                                var self = _glob$5;
                                switch (self._) {
                                    case 'App.KL.Global.State.new':
                                        var $691 = App$KL$Global$State$new$(Maybe$some$(_glob$game$10));
                                        var $687 = $691;
                                        break;
                                };
                                var $685 = $687;
                                break;
                        };
                        return $685;
                    })()));
                    var $682 = $684;
                    break;
            };
            return $682;
        })()));
        return $681;
    };
    const App$KL$Global$post = x0 => x1 => x2 => x3 => x4 => App$KL$Global$post$(x0, x1, x2, x3, x4);
    const App$KL = App$new$(App$KL$init, App$KL$draw, App$KL$when, App$KL$Global$tick, App$KL$Global$post);
    return {
        'App.new': App$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.KL.State': App$KL$State,
        'App.KL.State.Local.lobby': App$KL$State$Local$lobby,
        'App.KL.Lobby.State.Local.new': App$KL$Lobby$State$Local$new,
        'App.KL.Global.State.new': App$KL$Global$State$new,
        'Maybe.none': Maybe$none,
        'App.Store.new': App$Store$new,
        'App.KL.init': App$KL$init,
        'BitsMap': BitsMap,
        'Map': Map,
        'BitsMap.new': BitsMap$new,
        'BitsMap.tie': BitsMap$tie,
        'Maybe.some': Maybe$some,
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
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Maybe': Maybe,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'List': List,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.false': Bool$false,
        'Bool.and': Bool$and,
        'Bool.true': Bool$true,
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'List.length': List$length,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Bits.reverse.tco': Bits$reverse$tco,
        'Bits.reverse': Bits$reverse,
        'BitsMap.to_list.go': BitsMap$to_list$go,
        'List.mapped': List$mapped,
        'Bits.show': Bits$show,
        'Map.to_list': Map$to_list,
        'App.KL.Game.draw': App$KL$Game$draw,
        'App.KL.draw': App$KL$draw,
        'IO': IO,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'String.map': String$map,
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
        'Maybe.default': Maybe$default,
        'Parser.State.new': Parser$State$new,
        'Parser.run': Parser$run,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.error': Parser$Reply$error,
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
        'Nat.from_base': Nat$from_base,
        'Parser.nat': Parser$nat,
        'Nat.read': Nat$read,
        'IO.get_time': IO$get_time,
        'Nat.random': Nat$random,
        'IO.random': IO$random,
        'String.drop': String$drop,
        'Nat.sub': Nat$sub,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'Unit.new': Unit$new,
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.new_post': App$new_post,
        'String.take': String$take,
        'String.pad_right': String$pad_right,
        'String.pad_right_exact': String$pad_right_exact,
        'Bits.hex.encode': Bits$hex$encode,
        'Serializer.run': Serializer$run,
        'App.KL.Global.Event.serializer': App$KL$Global$Event$serializer,
        'App.KL.Global.Event.serialize_post': App$KL$Global$Event$serialize_post,
        'App.KL.Global.Event.join_room': App$KL$Global$Event$join_room,
        'App.KL.State.Local.game': App$KL$State$Local$game,
        'App.KL.Game.State.Local.new': App$KL$Game$State$Local$new,
        'App.KL.Lobby.when': App$KL$Lobby$when,
        'App.KL.Game.when': App$KL$Game$when,
        'App.KL.when': App$KL$when,
        'App.KL.Global.tick': App$KL$Global$tick,
        'Debug.log': Debug$log,
        'Pair.snd': Pair$snd,
        'App.State.global': App$State$global,
        'Deserializer.run': Deserializer$run,
        'Deserializer.Reply': Deserializer$Reply,
        'Deserializer.choice.go': Deserializer$choice$go,
        'Deserializer.choice': Deserializer$choice,
        'Deserializer': Deserializer,
        'Deserializer.bind': Deserializer$bind,
        'Deserializer.bits': Deserializer$bits,
        'Deserializer.pure': Deserializer$pure,
        'App.KL.Global.Event.void': App$KL$Global$Event$void,
        'App.KL.Global.Event.deserializer': App$KL$Global$Event$deserializer,
        'Bits.hex.decode': Bits$hex$decode,
        'App.KL.Global.Event.deserialize_post': App$KL$Global$Event$deserialize_post,
        'App.KL.Game.new': App$KL$Game$new,
        'App.KL.Game.start': App$KL$Game$start,
        'Map.set': Map$set,
        'App.KL.Game.Player.new': App$KL$Game$Player$new,
        'App.KL.Global.post': App$KL$Global$post,
        'App.KL': App$KL,
    };
})();

/***/ })

}]);
//# sourceMappingURL=967.index.js.map