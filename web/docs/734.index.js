(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[734],{

/***/ 734:
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
                var $2 = c2;
                return $2;
            } else {
                var $3 = c2;
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
                var $5 = c2;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c2($6);
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
                var $24 = c2;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c2($25)($26);
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

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $38 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $40 = self.val;
                        var $41 = self.lft;
                        var $42 = self.rgt;
                        var $43 = BitsMap$tie$($40, BitsMap$set$($38, _val$3, $41), $42);
                        var $39 = $43;
                        break;
                    case 'BitsMap.new':
                        var $44 = BitsMap$tie$(Maybe$none, BitsMap$set$($38, _val$3, BitsMap$new), BitsMap$new);
                        var $39 = $44;
                        break;
                };
                var $37 = $39;
                break;
            case 'i':
                var $45 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $47 = self.val;
                        var $48 = self.lft;
                        var $49 = self.rgt;
                        var $50 = BitsMap$tie$($47, $48, BitsMap$set$($45, _val$3, $49));
                        var $46 = $50;
                        break;
                    case 'BitsMap.new':
                        var $51 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($45, _val$3, BitsMap$new));
                        var $46 = $51;
                        break;
                };
                var $37 = $46;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $53 = self.lft;
                        var $54 = self.rgt;
                        var $55 = BitsMap$tie$(Maybe$some$(_val$3), $53, $54);
                        var $52 = $55;
                        break;
                    case 'BitsMap.new':
                        var $56 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $52 = $56;
                        break;
                };
                var $37 = $52;
                break;
        };
        return $37;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $58 = self.pred;
                var $59 = (Word$to_bits$($58) + '0');
                var $57 = $59;
                break;
            case 'Word.i':
                var $60 = self.pred;
                var $61 = (Word$to_bits$($60) + '1');
                var $57 = $61;
                break;
            case 'Word.e':
                var $62 = Bits$e;
                var $57 = $62;
                break;
        };
        return $57;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $63 = 1n + _pred$1;
        return $63;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $65 = Bits$e;
            var $64 = $65;
        } else {
            var $66 = self.charCodeAt(0);
            var $67 = self.slice(1);
            var $68 = (String$to_bits$($67) + (u16_to_bits($66)));
            var $64 = $68;
        };
        return $64;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $70 = self.head;
                var $71 = self.tail;
                var self = $70;
                switch (self._) {
                    case 'Pair.new':
                        var $73 = self.fst;
                        var $74 = self.snd;
                        var $75 = BitsMap$set$(String$to_bits$($73), $74, Map$from_list$($71));
                        var $72 = $75;
                        break;
                };
                var $69 = $72;
                break;
            case 'List.nil':
                var $76 = BitsMap$new;
                var $69 = $76;
                break;
        };
        return $69;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $77 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $77;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $78 = null;
        return $78;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $79 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $79;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$(_A$1) {
        var $80 = null;
        return $80;
    };
    const List = x0 => List$(x0);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $82 = self.value;
                var $83 = $82;
                var $81 = $83;
                break;
            case 'Maybe.none':
                var $84 = _a$3;
                var $81 = $84;
                break;
        };
        return $81;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Maybe$(_A$1) {
        var $85 = null;
        return $85;
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
                        var $86 = self.head;
                        var $87 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $89 = Maybe$some$($86);
                            var $88 = $89;
                        } else {
                            var $90 = (self - 1n);
                            var $91 = List$get$($90, $87);
                            var $88 = $91;
                        };
                        return $88;
                    case 'List.nil':
                        var $92 = Maybe$none;
                        return $92;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $93 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $93;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function DOM$text$(_value$1) {
        var $94 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $94;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $95 = (String.fromCharCode(_head$1) + _tail$2);
        return $95;
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
                        var $96 = self.head;
                        var $97 = self.tail;
                        var $98 = String$flatten$go$($97, (_res$2 + $96));
                        return $98;
                    case 'List.nil':
                        var $99 = _res$2;
                        return $99;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $100 = String$flatten$go$(_xs$1, "");
        return $100;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function List$pure$(_x$2) {
        var $101 = List$cons$(_x$2, List$nil);
        return $101;
    };
    const List$pure = x0 => List$pure$(x0);

    function List$intersperse$(_sep$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $103 = self.head;
                var $104 = self.tail;
                var self = $104;
                switch (self._) {
                    case 'List.nil':
                        var $106 = List$pure$($103);
                        var $105 = $106;
                        break;
                    case 'List.cons':
                        var $107 = List$cons$($103, List$cons$(_sep$2, List$intersperse$(_sep$2, $104)));
                        var $105 = $107;
                        break;
                };
                var $102 = $105;
                break;
            case 'List.nil':
                var $108 = List$nil;
                var $102 = $108;
                break;
        };
        return $102;
    };
    const List$intersperse = x0 => x1 => List$intersperse$(x0, x1);

    function String$intercalate$(_sep$1, _xs$2) {
        var $109 = String$flatten$(List$intersperse$(_sep$1, _xs$2));
        return $109;
    };
    const String$intercalate = x0 => x1 => String$intercalate$(x0, x1);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $111 = self.head;
                var $112 = self.tail;
                var $113 = List$cons$(_f$3($111), List$map$(_f$3, $112));
                var $110 = $113;
                break;
            case 'List.nil':
                var $114 = List$nil;
                var $110 = $114;
                break;
        };
        return $110;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$show$(_f$2, _xs$3) {
        var $115 = String$flatten$(List$cons$("[", List$cons$(String$intercalate$(",", List$map$(_f$2, _xs$3)), List$cons$("]", List$nil))));
        return $115;
    };
    const List$show = x0 => x1 => List$show$(x0, x1);
    const Bool$false = false;

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $117 = self.head;
                var $118 = self.tail;
                var $119 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $120 = "";
                        return $120;
                    } else {
                        var $121 = _sep$1;
                        return $121;
                    };
                })(), List$cons$($117, List$cons$(String$join$go$(_sep$1, $118, Bool$false), List$nil))));
                var $116 = $119;
                break;
            case 'List.nil':
                var $122 = "";
                var $116 = $122;
                break;
        };
        return $116;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);
    const Bool$true = true;

    function String$join$(_sep$1, _list$2) {
        var $123 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $123;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function IO$(_A$1) {
        var $124 = null;
        return $124;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $125 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $125;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $127 = self.value;
                var $128 = _f$4($127);
                var $126 = $128;
                break;
            case 'IO.ask':
                var $129 = self.query;
                var $130 = self.param;
                var $131 = self.then;
                var $132 = IO$ask$($129, $130, (_x$8 => {
                    var $133 = IO$bind$($131(_x$8), _f$4);
                    return $133;
                }));
                var $126 = $132;
                break;
        };
        return $126;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $134 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $134;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $135 = _new$2(IO$bind)(IO$end);
        return $135;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $136 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $136;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $137 = _m$pure$2;
        return $137;
    }))(Dynamic$new$(Unit$new));
    const String$nil = '';

    function App$store$(_value$2) {
        var $138 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $139 = _m$pure$4;
            return $139;
        }))(Dynamic$new$(_value$2));
        return $138;
    };
    const App$store = x0 => App$store$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $140 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $140;
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
            var $142 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(("Estado: " + List$show$(String$join(","), _state$3))), List$cons$(DOM$node$("table", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("tr", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "00"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v00$4), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "10"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v10$5), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "20"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v20$6), List$nil)), List$nil)))), List$cons$(DOM$node$("tr", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "01"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v01$7), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "11"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v11$8), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "21"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v21$9), List$nil)), List$nil)))), List$cons$(DOM$node$("tr", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "02"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v02$10), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "12"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v12$11), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "22"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v22$12), List$nil)), List$nil)))), List$nil)))), List$nil)));
            return $142;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.key_down':
                    var $144 = self.code;
                    var _key$8 = String$cons$($144, String$nil);
                    var $145 = App$store$(List$cons$(List$cons$(_key$8, List$cons$(_key$8, List$cons$(_key$8, List$nil))), List$cons$(List$cons$(_key$8, List$cons$(_key$8, List$cons$(_key$8, List$nil))), List$cons$(List$cons$(_key$8, List$cons$(_key$8, List$cons$(_key$8, List$nil))), List$nil))));
                    var $143 = $145;
                    break;
                case 'App.Event.mouse_click':
                    var $146 = self.id;
                    var _id$9 = $146;
                    var $147 = App$store$(List$cons$(List$cons$(_id$9, List$cons$(_id$9, List$cons$(_id$9, List$nil))), List$cons$(List$cons$(_id$9, List$cons$(_id$9, List$cons$(_id$9, List$nil))), List$cons$(List$cons$(_id$9, List$cons$(_id$9, List$cons$(_id$9, List$nil))), List$nil))));
                    var $143 = $147;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                case 'App.Event.post':
                case 'App.Event.mouse_over':
                case 'App.Event.mouse_out':
                    var $148 = App$pass;
                    var $143 = $148;
                    break;
            };
            return $143;
        });
        var $141 = App$new$(_init$2, _draw$3, _when$4);
        return $141;
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

/***/ })

}]);
//# sourceMappingURL=734.index.js.map