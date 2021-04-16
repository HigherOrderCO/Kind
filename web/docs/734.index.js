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
                        var $74 = BitsMap$set$(String$to_bits$($72), $73, Map$from_list$($70));
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

    function Pair$new$(_fst$3, _snd$4) {
        var $78 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $78;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$(_A$1) {
        var $79 = null;
        return $79;
    };
    const List = x0 => List$(x0);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $81 = self.value;
                var $82 = $81;
                var $80 = $82;
                break;
            case 'Maybe.none':
                var $83 = _a$3;
                var $80 = $83;
                break;
        };
        return $80;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Maybe$(_A$1) {
        var $84 = null;
        return $84;
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
                        var $85 = self.head;
                        var $86 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $88 = Maybe$some$($85);
                            var $87 = $88;
                        } else {
                            var $89 = (self - 1n);
                            var $90 = List$get$($89, $86);
                            var $87 = $90;
                        };
                        return $87;
                    case 'List.nil':
                        var $91 = Maybe$none;
                        return $91;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $92 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $92;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function DOM$text$(_value$1) {
        var $93 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $93;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $94 = (String.fromCharCode(_head$1) + _tail$2);
        return $94;
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
                        var $95 = self.head;
                        var $96 = self.tail;
                        var $97 = String$flatten$go$($96, (_res$2 + $95));
                        return $97;
                    case 'List.nil':
                        var $98 = _res$2;
                        return $98;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $99 = String$flatten$go$(_xs$1, "");
        return $99;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function List$pure$(_x$2) {
        var $100 = List$cons$(_x$2, List$nil);
        return $100;
    };
    const List$pure = x0 => List$pure$(x0);

    function List$intersperse$(_sep$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $102 = self.head;
                var $103 = self.tail;
                var self = $103;
                switch (self._) {
                    case 'List.nil':
                        var $105 = List$pure$($102);
                        var $104 = $105;
                        break;
                    case 'List.cons':
                        var $106 = List$cons$($102, List$cons$(_sep$2, List$intersperse$(_sep$2, $103)));
                        var $104 = $106;
                        break;
                };
                var $101 = $104;
                break;
            case 'List.nil':
                var $107 = List$nil;
                var $101 = $107;
                break;
        };
        return $101;
    };
    const List$intersperse = x0 => x1 => List$intersperse$(x0, x1);

    function String$intercalate$(_sep$1, _xs$2) {
        var $108 = String$flatten$(List$intersperse$(_sep$1, _xs$2));
        return $108;
    };
    const String$intercalate = x0 => x1 => String$intercalate$(x0, x1);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $110 = self.head;
                var $111 = self.tail;
                var $112 = List$cons$(_f$3($110), List$map$(_f$3, $111));
                var $109 = $112;
                break;
            case 'List.nil':
                var $113 = List$nil;
                var $109 = $113;
                break;
        };
        return $109;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$show$(_f$2, _xs$3) {
        var $114 = String$flatten$(List$cons$("[", List$cons$(String$intercalate$(",", List$map$(_f$2, _xs$3)), List$cons$("]", List$nil))));
        return $114;
    };
    const List$show = x0 => x1 => List$show$(x0, x1);
    const Bool$false = false;

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $116 = self.head;
                var $117 = self.tail;
                var $118 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $119 = "";
                        return $119;
                    } else {
                        var $120 = _sep$1;
                        return $120;
                    };
                })(), List$cons$($116, List$cons$(String$join$go$(_sep$1, $117, Bool$false), List$nil))));
                var $115 = $118;
                break;
            case 'List.nil':
                var $121 = "";
                var $115 = $121;
                break;
        };
        return $115;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);
    const Bool$true = true;

    function String$join$(_sep$1, _list$2) {
        var $122 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $122;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function IO$(_A$1) {
        var $123 = null;
        return $123;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $124 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $124;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $126 = self.value;
                var $127 = _f$4($126);
                var $125 = $127;
                break;
            case 'IO.ask':
                var $128 = self.query;
                var $129 = self.param;
                var $130 = self.then;
                var $131 = IO$ask$($128, $129, (_x$8 => {
                    var $132 = IO$bind$($130(_x$8), _f$4);
                    return $132;
                }));
                var $125 = $131;
                break;
        };
        return $125;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $133 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $133;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $134 = _new$2(IO$bind)(IO$end);
        return $134;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $135 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $135;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $136 = _m$pure$2;
        return $136;
    }))(Dynamic$new$(Unit$new));

    function App$store$(_value$2) {
        var $137 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $138 = _m$pure$4;
            return $138;
        }))(Dynamic$new$(_value$2));
        return $137;
    };
    const App$store = x0 => App$store$(x0);
    const String$nil = '';

    function App$new$(_init$2, _draw$3, _when$4) {
        var $139 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $139;
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
            var $141 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(("Estado: " + List$show$(String$join(","), _state$3))), List$cons$(DOM$node$("table", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("tr", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "00"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v00$4), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "10"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v10$5), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "20"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v20$6), List$nil)), List$nil)))), List$cons$(DOM$node$("tr", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "01"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v01$7), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "11"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v11$8), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "21"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v21$9), List$nil)), List$nil)))), List$cons$(DOM$node$("tr", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "02"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v02$10), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "12"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v12$11), List$nil)), List$cons$(DOM$node$("td", Map$from_list$(List$cons$(Pair$new$("id", "22"), List$nil)), _place_style$1, List$cons$(DOM$text$(_v22$12), List$nil)), List$nil)))), List$nil)))), List$nil)));
            return $141;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.dom':
                    var $143 = self.id;
                    var _id$9 = $143;
                    var $144 = App$store$(List$cons$(List$cons$(_id$9, List$cons$(_id$9, List$cons$(_id$9, List$nil))), List$cons$(List$cons$(_id$9, List$cons$(_id$9, List$cons$(_id$9, List$nil))), List$cons$(List$cons$(_id$9, List$cons$(_id$9, List$cons$(_id$9, List$nil))), List$nil))));
                    var $142 = $144;
                    break;
                case 'App.Event.key_down':
                    var $145 = self.code;
                    var _key$8 = String$cons$($145, String$nil);
                    var $146 = App$store$(List$cons$(List$cons$(_key$8, List$cons$(_key$8, List$cons$(_key$8, List$nil))), List$cons$(List$cons$(_key$8, List$cons$(_key$8, List$cons$(_key$8, List$nil))), List$cons$(List$cons$(_key$8, List$cons$(_key$8, List$cons$(_key$8, List$nil))), List$nil))));
                    var $142 = $146;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                case 'App.Event.post':
                    var $147 = App$pass;
                    var $142 = $147;
                    break;
            };
            return $142;
        });
        var $140 = App$new$(_init$2, _draw$3, _when$4);
        return $140;
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
        'App.store': App$store,
        'String.nil': String$nil,
        'App.new': App$new,
        'Web.TicTacToe': Web$TicTacToe,
    };
})();

/***/ })

}]);
//# sourceMappingURL=734.index.js.map