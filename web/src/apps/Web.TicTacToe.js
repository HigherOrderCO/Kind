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

    function BitsMap$(_A$1) {
        var $33 = null;
        return $33;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $34 = null;
        return $34;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $35 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $35;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $36 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $36;
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
                var $38 = self.pred;
                var $39 = (Word$to_bits$($38) + '0');
                var $37 = $39;
                break;
            case 'Word.i':
                var $40 = self.pred;
                var $41 = (Word$to_bits$($40) + '1');
                var $37 = $41;
                break;
            case 'Word.e':
                var $42 = Bits$e;
                var $37 = $42;
                break;
        };
        return $37;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $43 = 1n + _pred$1;
        return $43;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $45 = Bits$e;
            var $44 = $45;
        } else {
            var $46 = self.charCodeAt(0);
            var $47 = self.slice(1);
            var $48 = (String$to_bits$($47) + (u16_to_bits($46)));
            var $44 = $48;
        };
        return $44;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $50 = self.head;
                var $51 = self.tail;
                var self = $50;
                switch (self._) {
                    case 'Pair.new':
                        var $53 = self.fst;
                        var $54 = self.snd;
                        var $55 = (bitsmap_set(String$to_bits$($53), $54, Map$from_list$($51), 'set'));
                        var $52 = $55;
                        break;
                };
                var $49 = $52;
                break;
            case 'List.nil':
                var $56 = BitsMap$new;
                var $49 = $56;
                break;
        };
        return $49;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $57 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $57;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $58 = null;
        return $58;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $59 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $59;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$(_A$1) {
        var $60 = null;
        return $60;
    };
    const List = x0 => List$(x0);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $62 = self.value;
                var $63 = $62;
                var $61 = $63;
                break;
            case 'Maybe.none':
                var $64 = _a$3;
                var $61 = $64;
                break;
        };
        return $61;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Maybe$(_A$1) {
        var $65 = null;
        return $65;
    };
    const Maybe = x0 => Maybe$(x0);

    function List$get$(_index$2, _list$3) {
        var List$get$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$get = _index$2 => _list$3 => List$get$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $66 = self.head;
                        var $67 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $69 = Maybe$some$($66);
                            var $68 = $69;
                        } else {
                            var $70 = (self - 1n);
                            var $71 = List$get$($70, $67);
                            var $68 = $71;
                        };
                        return $68;
                    case 'List.nil':
                        var $72 = Maybe$none;
                        return $72;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $73 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $73;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function DOM$text$(_value$1) {
        var $74 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $74;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $75 = (String.fromCharCode(_head$1) + _tail$2);
        return $75;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function String$flatten$go$(_xs$1, _res$2) {
        var String$flatten$go$ = (_xs$1, _res$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _res$2]
        });
        var String$flatten$go = _xs$1 => _res$2 => String$flatten$go$(_xs$1, _res$2);
        var arg = [_xs$1, _res$2];
        while (true) {
            let [_xs$1, _res$2] = arg;
            var R = (() => {
                var self = _xs$1;
                switch (self._) {
                    case 'List.cons':
                        var $76 = self.head;
                        var $77 = self.tail;
                        var $78 = String$flatten$go$($77, (_res$2 + $76));
                        return $78;
                    case 'List.nil':
                        var $79 = _res$2;
                        return $79;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $80 = String$flatten$go$(_xs$1, "");
        return $80;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function List$pure$(_x$2) {
        var $81 = List$cons$(_x$2, List$nil);
        return $81;
    };
    const List$pure = x0 => List$pure$(x0);

    function List$intersperse$(_sep$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $83 = self.head;
                var $84 = self.tail;
                var self = $84;
                switch (self._) {
                    case 'List.nil':
                        var $86 = List$pure$($83);
                        var $85 = $86;
                        break;
                    case 'List.cons':
                        var $87 = List$cons$($83, List$cons$(_sep$2, List$intersperse$(_sep$2, $84)));
                        var $85 = $87;
                        break;
                };
                var $82 = $85;
                break;
            case 'List.nil':
                var $88 = List$nil;
                var $82 = $88;
                break;
        };
        return $82;
    };
    const List$intersperse = x0 => x1 => List$intersperse$(x0, x1);

    function String$intercalate$(_sep$1, _xs$2) {
        var $89 = String$flatten$(List$intersperse$(_sep$1, _xs$2));
        return $89;
    };
    const String$intercalate = x0 => x1 => String$intercalate$(x0, x1);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $91 = self.head;
                var $92 = self.tail;
                var $93 = List$cons$(_f$3($91), List$map$(_f$3, $92));
                var $90 = $93;
                break;
            case 'List.nil':
                var $94 = List$nil;
                var $90 = $94;
                break;
        };
        return $90;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$show$(_f$2, _xs$3) {
        var $95 = String$flatten$(List$cons$("[", List$cons$(String$intercalate$(",", List$map$(_f$2, _xs$3)), List$cons$("]", List$nil))));
        return $95;
    };
    const List$show = x0 => x1 => List$show$(x0, x1);
    const Bool$false = false;

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $97 = self.head;
                var $98 = self.tail;
                var $99 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $100 = "";
                        return $100;
                    } else {
                        var $101 = _sep$1;
                        return $101;
                    };
                })(), List$cons$($97, List$cons$(String$join$go$(_sep$1, $98, Bool$false), List$nil))));
                var $96 = $99;
                break;
            case 'List.nil':
                var $102 = "";
                var $96 = $102;
                break;
        };
        return $96;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);
    const Bool$true = true;

    function String$join$(_sep$1, _list$2) {
        var $103 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $103;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function IO$(_A$1) {
        var $104 = null;
        return $104;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $105 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $105;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $107 = self.value;
                var $108 = _f$4($107);
                var $106 = $108;
                break;
            case 'IO.ask':
                var $109 = self.query;
                var $110 = self.param;
                var $111 = self.then;
                var $112 = IO$ask$($109, $110, (_x$8 => {
                    var $113 = IO$bind$($111(_x$8), _f$4);
                    return $113;
                }));
                var $106 = $112;
                break;
        };
        return $106;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $114 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $114;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $115 = _new$2(IO$bind)(IO$end);
        return $115;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $116 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $116;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $117 = _m$pure$2;
        return $117;
    }))(Dynamic$new$(Unit$new));
    const String$nil = '';

    function App$store$(_value$2) {
        var $118 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $119 = _m$pure$4;
            return $119;
        }))(Dynamic$new$(_value$2));
        return $118;
    };
    const App$store = x0 => App$store$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $120 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $120;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$TicTacToe = (() => {
        var _place_style$1 = Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$nil));
        var _init$2 = List$cons$(List$cons$("A", List$cons$("b", List$cons$("c", List$nil))), List$cons$(List$cons$("d", List$cons$("e", List$cons$("f", List$nil))), List$cons$(List$cons$("g", List$cons$("h", List$cons$("i", List$nil))), List$nil)));
        var _draw$3 = (_state$3 => {
            var _v00$4 = Maybe$default$(List$get$(0n, Maybe$default$(List$get$(0n, _state$3), List$nil)), "");
            var _v10$5 = Maybe$default$(List$get$(1n, Maybe$default$(List$get$(0n, _state$3), List$nil)), "");
            var _v20$6 = Maybe$default$(List$get$(2n, Maybe$default$(List$get$(0n, _state$3), List$nil)), "");
            var _v01$7 = Maybe$default$(List$get$(0n, Maybe$default$(List$get$(1n, _state$3), List$nil)), "");
            var _v11$8 = Maybe$default$(List$get$(1n, Maybe$default$(List$get$(1n, _state$3), List$nil)), "");
            var _v21$9 = Maybe$default$(List$get$(2n, Maybe$default$(List$get$(1n, _state$3), List$nil)), "");
            var _v02$10 = Maybe$default$(List$get$(0n, Maybe$default$(List$get$(2n, _state$3), List$nil)), "");
            var _v12$11 = Maybe$default$(List$get$(1n, Maybe$default$(List$get$(2n, _state$3), List$nil)), "");
            var _v22$12 = Maybe$default$(List$get$(2n, Maybe$default$(List$get$(2n, _state$3), List$nil)), "");
            var $122 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(("Estado: " + List$show$(String$join(","), _state$3))), List$cons$(DOM$node$("table", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("tr", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "00"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v00$4), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "10"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v10$5), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "20"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v20$6), List$nil)), List$nil)))), List$cons$(DOM$node$("tr", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "01"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v01$7), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "11"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v11$8), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "21"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v21$9), List$nil)), List$nil)))), List$cons$(DOM$node$("tr", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "02"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v02$10), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "12"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v12$11), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "22"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v22$12), List$nil)), List$nil)))), List$nil)))), List$nil)));
            return $122;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.key_down':
                    var $124 = self.code;
                    var _key$8 = String$cons$($124, String$nil);
                    var $125 = App$store$(List$cons$(List$cons$(_key$8, List$cons$(_key$8, List$cons$(_key$8, List$nil))), List$cons$(List$cons$(_key$8, List$cons$(_key$8, List$cons$(_key$8, List$nil))), List$cons$(List$cons$(_key$8, List$cons$(_key$8, List$cons$(_key$8, List$nil))), List$nil))));
                    var $123 = $125;
                    break;
                case 'App.Event.mouse_click':
                    var $126 = self.id;
                    var _id$9 = $126;
                    var $127 = App$store$(List$cons$(List$cons$(_id$9, List$cons$(_id$9, List$cons$(_id$9, List$nil))), List$cons$(List$cons$(_id$9, List$cons$(_id$9, List$cons$(_id$9, List$nil))), List$cons$(List$cons$(_id$9, List$cons$(_id$9, List$cons$(_id$9, List$nil))), List$nil))));
                    var $123 = $127;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                case 'App.Event.post':
                case 'App.Event.mouse_over':
                case 'App.Event.mouse_out':
                case 'App.Event.resize':
                    var $128 = App$pass;
                    var $123 = $128;
                    break;
            };
            return $123;
        });
        var $121 = App$new$(_init$2, _draw$3, _when$4);
        return $121;
    })();
    return {
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
        'Pair.new': Pair$new,
        'List.nil': List$nil,
        'List': List,
        'Maybe.default': Maybe$default,
        'Maybe': Maybe,
        'List.get': List$get,
        'DOM.node': DOM$node,
        'DOM.text': DOM$text,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'List.pure': List$pure,
        'List.intersperse': List$intersperse,
        'String.intercalate': String$intercalate,
        'List.map': List$map,
        'List.show': List$show,
        'Bool.false': Bool$false,
        'String.join.go': String$join$go,
        'Bool.true': Bool$true,
        'String.join': String$join,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'Unit.new': Unit$new,
        'App.pass': App$pass,
        'String.nil': String$nil,
        'App.store': App$store,
        'App.new': App$new,
        'Web.TicTacToe': Web$TicTacToe,
    };
})();