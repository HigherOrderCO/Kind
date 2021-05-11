(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[936],{

/***/ 936:
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

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $33 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $33;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $34 = null;
        return $34;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $35 = null;
        return $35;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $36 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $36;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $37 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $37;
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
                var $39 = self.pred;
                var $40 = (Word$to_bits$($39) + '0');
                var $38 = $40;
                break;
            case 'Word.i':
                var $41 = self.pred;
                var $42 = (Word$to_bits$($41) + '1');
                var $38 = $42;
                break;
            case 'Word.e':
                var $43 = Bits$e;
                var $38 = $43;
                break;
        };
        return $38;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $44 = 1n + _pred$1;
        return $44;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $46 = Bits$e;
            var $45 = $46;
        } else {
            var $47 = self.charCodeAt(0);
            var $48 = self.slice(1);
            var $49 = (String$to_bits$($48) + (u16_to_bits($47)));
            var $45 = $49;
        };
        return $45;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $51 = self.head;
                var $52 = self.tail;
                var self = $51;
                switch (self._) {
                    case 'Pair.new':
                        var $54 = self.fst;
                        var $55 = self.snd;
                        var $56 = (bitsmap_set(String$to_bits$($54), $55, Map$from_list$($52), 'set'));
                        var $53 = $56;
                        break;
                };
                var $50 = $53;
                break;
            case 'List.nil':
                var $57 = BitsMap$new;
                var $50 = $57;
                break;
        };
        return $50;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $58 = null;
        return $58;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $59 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $59;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $60 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $60;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function IO$(_A$1) {
        var $61 = null;
        return $61;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $62 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $62;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $64 = self.value;
                var $65 = _f$4($64);
                var $63 = $65;
                break;
            case 'IO.ask':
                var $66 = self.query;
                var $67 = self.param;
                var $68 = self.then;
                var $69 = IO$ask$($66, $67, (_x$8 => {
                    var $70 = IO$bind$($68(_x$8), _f$4);
                    return $70;
                }));
                var $63 = $69;
                break;
        };
        return $63;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $71 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $71;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $72 = _new$2(IO$bind)(IO$end);
        return $72;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $73 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $73;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $74 = _m$pure$2;
        return $74;
    }))(Dynamic$new$(Unit$new));

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $75 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $75;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

    function Maybe$(_A$1) {
        var $76 = null;
        return $76;
    };
    const Maybe = x0 => Maybe$(x0);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $78 = self.val;
                var $79 = Maybe$some$($78);
                var $77 = $79;
                break;
            case 'Parser.Reply.error':
                var $80 = Maybe$none;
                var $77 = $80;
                break;
        };
        return $77;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $81 = null;
        return $81;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function List$(_A$1) {
        var $82 = null;
        return $82;
    };
    const List = x0 => List$(x0);

    function Parser$Reply$error$(_err$2) {
        var $83 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $83;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);
    const Bool$false = false;
    const Bool$true = true;
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $85 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $87 = self.idx;
                        var self = ($85 > $87);
                        if (self) {
                            var $89 = _a$1;
                            var $88 = $89;
                        } else {
                            var $90 = _b$2;
                            var $88 = $90;
                        };
                        var $86 = $88;
                        break;
                };
                var $84 = $86;
                break;
        };
        return $84;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $92 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $94 = self.value;
                        var $95 = Maybe$some$(Parser$Error$combine$($92, $94));
                        var $93 = $95;
                        break;
                    case 'Maybe.none':
                        var $96 = _a$1;
                        var $93 = $96;
                        break;
                };
                var $91 = $93;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $98 = Maybe$none;
                        var $97 = $98;
                        break;
                    case 'Maybe.some':
                        var $99 = _b$2;
                        var $97 = $99;
                        break;
                };
                var $91 = $97;
                break;
        };
        return $91;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $100 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $100;
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
                                var $102 = self.pst;
                                var $103 = self.val;
                                var $104 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $105 = _values$3(List$cons$($103, _xs$12));
                                    return $105;
                                }), $102);
                                var $101 = $104;
                                break;
                            case 'Parser.Reply.error':
                                var $106 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $101 = $106;
                                break;
                        };
                        return $101;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $107 = Parser$many$go(_parser$2)((_x$3 => {
            var $108 = _x$3;
            return $108;
        }));
        return $107;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $110 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $112 = self.err;
                        var self = $110;
                        switch (self._) {
                            case 'Maybe.some':
                                var $114 = self.value;
                                var $115 = Parser$Reply$error$(Parser$Error$combine$($114, $112));
                                var $113 = $115;
                                break;
                            case 'Maybe.none':
                                var $116 = Parser$Reply$error$($112);
                                var $113 = $116;
                                break;
                        };
                        var $111 = $113;
                        break;
                    case 'Parser.Reply.value':
                        var $117 = self.pst;
                        var $118 = self.val;
                        var self = $117;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $120 = self.err;
                                var $121 = self.nam;
                                var $122 = self.ini;
                                var $123 = self.idx;
                                var $124 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($110, $120), $121, $122, $123, $124);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $126 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $128 = self.err;
                                                var self = $126;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $130 = self.value;
                                                        var $131 = Parser$Reply$error$(Parser$Error$combine$($130, $128));
                                                        var $129 = $131;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $132 = Parser$Reply$error$($128);
                                                        var $129 = $132;
                                                        break;
                                                };
                                                var $127 = $129;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $133 = self.pst;
                                                var $134 = self.val;
                                                var self = $133;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $136 = self.err;
                                                        var $137 = self.nam;
                                                        var $138 = self.ini;
                                                        var $139 = self.idx;
                                                        var $140 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($126, $136), $137, $138, $139, $140);
                                                        var $141 = Parser$Reply$value$(_reply$pst$31, List$cons$($118, $134));
                                                        var $135 = $141;
                                                        break;
                                                };
                                                var $127 = $135;
                                                break;
                                        };
                                        var $125 = $127;
                                        break;
                                };
                                var $119 = $125;
                                break;
                        };
                        var $111 = $119;
                        break;
                };
                var $109 = $111;
                break;
        };
        return $109;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $142 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $142;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $143 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $143;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $145 = Bool$false;
                var $144 = $145;
                break;
            case 'Cmp.eql':
                var $146 = Bool$true;
                var $144 = $146;
                break;
        };
        return $144;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);
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
                var $148 = self.pred;
                var $149 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $151 = self.pred;
                            var $152 = (_a$pred$10 => {
                                var $153 = Word$cmp$go$(_a$pred$10, $151, _c$4);
                                return $153;
                            });
                            var $150 = $152;
                            break;
                        case 'Word.i':
                            var $154 = self.pred;
                            var $155 = (_a$pred$10 => {
                                var $156 = Word$cmp$go$(_a$pred$10, $154, Cmp$ltn);
                                return $156;
                            });
                            var $150 = $155;
                            break;
                        case 'Word.e':
                            var $157 = (_a$pred$8 => {
                                var $158 = _c$4;
                                return $158;
                            });
                            var $150 = $157;
                            break;
                    };
                    var $150 = $150($148);
                    return $150;
                });
                var $147 = $149;
                break;
            case 'Word.i':
                var $159 = self.pred;
                var $160 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $162 = self.pred;
                            var $163 = (_a$pred$10 => {
                                var $164 = Word$cmp$go$(_a$pred$10, $162, Cmp$gtn);
                                return $164;
                            });
                            var $161 = $163;
                            break;
                        case 'Word.i':
                            var $165 = self.pred;
                            var $166 = (_a$pred$10 => {
                                var $167 = Word$cmp$go$(_a$pred$10, $165, _c$4);
                                return $167;
                            });
                            var $161 = $166;
                            break;
                        case 'Word.e':
                            var $168 = (_a$pred$8 => {
                                var $169 = _c$4;
                                return $169;
                            });
                            var $161 = $168;
                            break;
                    };
                    var $161 = $161($159);
                    return $161;
                });
                var $147 = $160;
                break;
            case 'Word.e':
                var $170 = (_b$5 => {
                    var $171 = _c$4;
                    return $171;
                });
                var $147 = $170;
                break;
        };
        var $147 = $147(_b$3);
        return $147;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $172 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $172;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $173 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $173;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $175 = self.err;
                var $176 = self.nam;
                var $177 = self.ini;
                var $178 = self.idx;
                var $179 = self.str;
                var self = $179;
                if (self.length === 0) {
                    var $181 = Parser$Reply$fail$($176, $177, $178, "Not a digit.");
                    var $180 = $181;
                } else {
                    var $182 = self.charCodeAt(0);
                    var $183 = self.slice(1);
                    var _pst$9 = Parser$State$new$($175, $176, $177, Nat$succ$($178), $183);
                    var self = ($182 === 48);
                    if (self) {
                        var $185 = Parser$Reply$value$(_pst$9, 0n);
                        var $184 = $185;
                    } else {
                        var self = ($182 === 49);
                        if (self) {
                            var $187 = Parser$Reply$value$(_pst$9, 1n);
                            var $186 = $187;
                        } else {
                            var self = ($182 === 50);
                            if (self) {
                                var $189 = Parser$Reply$value$(_pst$9, 2n);
                                var $188 = $189;
                            } else {
                                var self = ($182 === 51);
                                if (self) {
                                    var $191 = Parser$Reply$value$(_pst$9, 3n);
                                    var $190 = $191;
                                } else {
                                    var self = ($182 === 52);
                                    if (self) {
                                        var $193 = Parser$Reply$value$(_pst$9, 4n);
                                        var $192 = $193;
                                    } else {
                                        var self = ($182 === 53);
                                        if (self) {
                                            var $195 = Parser$Reply$value$(_pst$9, 5n);
                                            var $194 = $195;
                                        } else {
                                            var self = ($182 === 54);
                                            if (self) {
                                                var $197 = Parser$Reply$value$(_pst$9, 6n);
                                                var $196 = $197;
                                            } else {
                                                var self = ($182 === 55);
                                                if (self) {
                                                    var $199 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $198 = $199;
                                                } else {
                                                    var self = ($182 === 56);
                                                    if (self) {
                                                        var $201 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $200 = $201;
                                                    } else {
                                                        var self = ($182 === 57);
                                                        if (self) {
                                                            var $203 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $202 = $203;
                                                        } else {
                                                            var $204 = Parser$Reply$fail$($176, $177, $178, "Not a digit.");
                                                            var $202 = $204;
                                                        };
                                                        var $200 = $202;
                                                    };
                                                    var $198 = $200;
                                                };
                                                var $196 = $198;
                                            };
                                            var $194 = $196;
                                        };
                                        var $192 = $194;
                                    };
                                    var $190 = $192;
                                };
                                var $188 = $190;
                            };
                            var $186 = $188;
                        };
                        var $184 = $186;
                    };
                    var $180 = $184;
                };
                var $174 = $180;
                break;
        };
        return $174;
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
                        var $205 = self.head;
                        var $206 = self.tail;
                        var $207 = Nat$from_base$go$(_b$1, $206, (_b$1 * _p$3), (($205 * _p$3) + _res$4));
                        return $207;
                    case 'List.nil':
                        var $208 = _res$4;
                        return $208;
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
                        var $209 = self.head;
                        var $210 = self.tail;
                        var $211 = List$reverse$go$($210, List$cons$($209, _res$3));
                        return $211;
                    case 'List.nil':
                        var $212 = _res$3;
                        return $212;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $213 = List$reverse$go$(_xs$2, List$nil);
        return $213;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Nat$from_base$(_base$1, _ds$2) {
        var $214 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $214;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $216 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $218 = self.err;
                        var self = $216;
                        switch (self._) {
                            case 'Maybe.some':
                                var $220 = self.value;
                                var $221 = Parser$Reply$error$(Parser$Error$combine$($220, $218));
                                var $219 = $221;
                                break;
                            case 'Maybe.none':
                                var $222 = Parser$Reply$error$($218);
                                var $219 = $222;
                                break;
                        };
                        var $217 = $219;
                        break;
                    case 'Parser.Reply.value':
                        var $223 = self.pst;
                        var $224 = self.val;
                        var self = $223;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $226 = self.err;
                                var $227 = self.nam;
                                var $228 = self.ini;
                                var $229 = self.idx;
                                var $230 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($216, $226), $227, $228, $229, $230);
                                var $231 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $224));
                                var $225 = $231;
                                break;
                        };
                        var $217 = $225;
                        break;
                };
                var $215 = $217;
                break;
        };
        return $215;
    };
    const Parser$nat = x0 => Parser$nat$(x0);
    const Nat$read = a0 => (BigInt(a0));
    const IO$get_time = IO$ask$("get_time", "", (_time$1 => {
        var $232 = IO$end$((BigInt(_time$1)));
        return $232;
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
                    var $233 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $233;
                } else {
                    var $234 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $236 = _r$3;
                        var $235 = $236;
                    } else {
                        var $237 = (self - 1n);
                        var $238 = Nat$mod$go$($237, $234, Nat$succ$(_r$3));
                        var $235 = $238;
                    };
                    return $235;
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
        var $239 = (((_seed$1 * _m$2) + _i$3) % _q$4);
        return $239;
    };
    const Nat$random = x0 => Nat$random$(x0);

    function IO$random$(_a$1) {
        var $240 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $241 = _m$bind$2;
            return $241;
        }))(IO$get_time)((_seed$2 => {
            var _seed$3 = Nat$random$(_seed$2);
            var $242 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $243 = _m$pure$5;
                return $243;
            }))((_seed$3 % _a$1));
            return $242;
        }));
        return $240;
    };
    const IO$random = x0 => IO$random$(x0);

    function Nat$randoms$(_len$1, _seed$2, _max$3) {
        var self = _len$1;
        if (self === 0n) {
            var $245 = List$nil;
            var $244 = $245;
        } else {
            var $246 = (self - 1n);
            var _new_seed$5 = Nat$random$(_seed$2);
            var $247 = List$cons$((_new_seed$5 % _max$3), Nat$randoms$($246, _new_seed$5, _max$3));
            var $244 = $247;
        };
        return $244;
    };
    const Nat$randoms = x0 => x1 => x2 => Nat$randoms$(x0, x1, x2);

    function IO$randoms$(_len$1, _max$2) {
        var $248 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $249 = _m$bind$3;
            return $249;
        }))(IO$get_time)((_seed$3 => {
            var $250 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $251 = _m$pure$5;
                return $251;
            }))(Nat$randoms$(_len$1, _seed$3, _max$2));
            return $250;
        }));
        return $248;
    };
    const IO$randoms = x0 => x1 => IO$randoms$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $252 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $252;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $254 = self.head;
                var $255 = self.tail;
                var $256 = List$cons$($254, List$concat$($255, _bs$3));
                var $253 = $256;
                break;
            case 'List.nil':
                var $257 = _bs$3;
                var $253 = $257;
                break;
        };
        return $253;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$pop_at$go$(_idx$2, _list$3, _searched_list$4) {
        var List$pop_at$go$ = (_idx$2, _list$3, _searched_list$4) => ({
            ctr: 'TCO',
            arg: [_idx$2, _list$3, _searched_list$4]
        });
        var List$pop_at$go = _idx$2 => _list$3 => _searched_list$4 => List$pop_at$go$(_idx$2, _list$3, _searched_list$4);
        var arg = [_idx$2, _list$3, _searched_list$4];
        while (true) {
            let [_idx$2, _list$3, _searched_list$4] = arg;
            var R = (() => {
                var self = _idx$2;
                if (self === 0n) {
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $259 = self.head;
                            var $260 = self.tail;
                            var $261 = Pair$new$(Maybe$some$($259), List$concat$(_searched_list$4, $260));
                            var $258 = $261;
                            break;
                        case 'List.nil':
                            var $262 = Pair$new$(Maybe$none, _searched_list$4);
                            var $258 = $262;
                            break;
                    };
                    return $258;
                } else {
                    var $263 = (self - 1n);
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $265 = self.head;
                            var $266 = self.tail;
                            var $267 = List$pop_at$go$($263, $266, List$concat$(_searched_list$4, List$cons$($265, List$nil)));
                            var $264 = $267;
                            break;
                        case 'List.nil':
                            var $268 = Pair$new$(Maybe$none, _searched_list$4);
                            var $264 = $268;
                            break;
                    };
                    return $264;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$pop_at$go = x0 => x1 => x2 => List$pop_at$go$(x0, x1, x2);

    function List$pop_at$(_idx$2, _list$3) {
        var $269 = List$pop_at$go$(_idx$2, _list$3, List$nil);
        return $269;
    };
    const List$pop_at = x0 => x1 => List$pop_at$(x0, x1);

    function List$random$(_xs$1, _ys$2, _zs$3) {
        var List$random$ = (_xs$1, _ys$2, _zs$3) => ({
            ctr: 'TCO',
            arg: [_xs$1, _ys$2, _zs$3]
        });
        var List$random = _xs$1 => _ys$2 => _zs$3 => List$random$(_xs$1, _ys$2, _zs$3);
        var arg = [_xs$1, _ys$2, _zs$3];
        while (true) {
            let [_xs$1, _ys$2, _zs$3] = arg;
            var R = (() => {
                var self = _xs$1;
                switch (self._) {
                    case 'List.cons':
                        var $270 = self.head;
                        var $271 = self.tail;
                        var self = _ys$2;
                        switch (self._) {
                            case 'List.nil':
                                var $273 = List$nil;
                                var $272 = $273;
                                break;
                            case 'List.cons':
                                var _a$8 = List$pop_at$($270, _ys$2);
                                var self = _a$8;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $275 = self.fst;
                                        var $276 = self.snd;
                                        var self = $275;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $278 = self.value;
                                                var $279 = List$random$($271, $276, List$cons$($278, _zs$3));
                                                var $277 = $279;
                                                break;
                                            case 'Maybe.none':
                                                var $280 = List$random$(List$cons$((Nat$random$($270) % 10n), $271), _ys$2, _zs$3);
                                                var $277 = $280;
                                                break;
                                        };
                                        var $274 = $277;
                                        break;
                                };
                                var $272 = $274;
                                break;
                        };
                        return $272;
                    case 'List.nil':
                        var $281 = _zs$3;
                        return $281;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$random = x0 => x1 => x2 => List$random$(x0, x1, x2);

    function IO$prompt$(_text$1) {
        var $282 = IO$ask$("get_line", _text$1, (_line$2 => {
            var $283 = IO$end$(_line$2);
            return $283;
        }));
        return $282;
    };
    const IO$prompt = x0 => IO$prompt$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $284 = (String.fromCharCode(_head$1) + _tail$2);
        return $284;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $286 = self.head;
                var $287 = self.tail;
                var $288 = _cons$5($286)(List$fold$($287, _nil$4, _cons$5));
                var $285 = $288;
                break;
            case 'List.nil':
                var $289 = _nil$4;
                var $285 = $289;
                break;
        };
        return $285;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $290 = null;
        return $290;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $291 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $291;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $292 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $292;
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
                    var $293 = Either$left$(_n$1);
                    return $293;
                } else {
                    var $294 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $296 = Either$right$(Nat$succ$($294));
                        var $295 = $296;
                    } else {
                        var $297 = (self - 1n);
                        var $298 = Nat$sub_rem$($297, $294);
                        var $295 = $298;
                    };
                    return $295;
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
                        var $299 = self.value;
                        var $300 = Nat$div_mod$go$($299, _m$2, Nat$succ$(_d$3));
                        return $300;
                    case 'Either.right':
                        var $301 = Pair$new$(_d$3, _n$1);
                        return $301;
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
                        var $302 = self.fst;
                        var $303 = self.snd;
                        var self = $302;
                        if (self === 0n) {
                            var $305 = List$cons$($303, _res$3);
                            var $304 = $305;
                        } else {
                            var $306 = (self - 1n);
                            var $307 = Nat$to_base$go$(_base$1, $302, List$cons$($303, _res$3));
                            var $304 = $307;
                        };
                        return $304;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $308 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $308;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const String$nil = '';
    const Bool$and = a0 => a1 => (a0 && a1);
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
                        var $309 = self.head;
                        var $310 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $312 = Maybe$some$($309);
                            var $311 = $312;
                        } else {
                            var $313 = (self - 1n);
                            var $314 = List$at$($313, $310);
                            var $311 = $314;
                        };
                        return $311;
                    case 'List.nil':
                        var $315 = Maybe$none;
                        return $315;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = (_n$2 % _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $318 = self.value;
                    var $319 = $318;
                    var $317 = $319;
                    break;
                case 'Maybe.none':
                    var $320 = 35;
                    var $317 = $320;
                    break;
            };
            var $316 = $317;
        } else {
            var $321 = 35;
            var $316 = $321;
        };
        return $316;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $322 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $323 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $323;
        }));
        return $322;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $324 = Nat$to_string_base$(10n, _n$1);
        return $324;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $325 = (_a$1 === _b$2);
        return $325;
    };
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);

    function String$starts_with$(_xs$1, _match$2) {
        var String$starts_with$ = (_xs$1, _match$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _match$2]
        });
        var String$starts_with = _xs$1 => _match$2 => String$starts_with$(_xs$1, _match$2);
        var arg = [_xs$1, _match$2];
        while (true) {
            let [_xs$1, _match$2] = arg;
            var R = (() => {
                var self = _match$2;
                if (self.length === 0) {
                    var $326 = Bool$true;
                    return $326;
                } else {
                    var $327 = self.charCodeAt(0);
                    var $328 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $330 = Bool$false;
                        var $329 = $330;
                    } else {
                        var $331 = self.charCodeAt(0);
                        var $332 = self.slice(1);
                        var self = Char$eql$($327, $331);
                        if (self) {
                            var $334 = String$starts_with$($332, $328);
                            var $333 = $334;
                        } else {
                            var $335 = Bool$false;
                            var $333 = $335;
                        };
                        var $329 = $333;
                    };
                    return $329;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

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
                    var $336 = _xs$2;
                    return $336;
                } else {
                    var $337 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $339 = String$nil;
                        var $338 = $339;
                    } else {
                        var $340 = self.charCodeAt(0);
                        var $341 = self.slice(1);
                        var $342 = String$drop$($337, $341);
                        var $338 = $342;
                    };
                    return $338;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

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
                    var $343 = _n$2;
                    return $343;
                } else {
                    var $344 = self.charCodeAt(0);
                    var $345 = self.slice(1);
                    var $346 = String$length$go$($345, Nat$succ$(_n$2));
                    return $346;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $347 = String$length$go$(_xs$1, 0n);
        return $347;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $349 = List$cons$(_last$3, List$nil);
            var $348 = $349;
        } else {
            var $350 = self.charCodeAt(0);
            var $351 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $353 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $352 = $353;
            } else {
                var _next$6 = String$cons$($350, String$nil);
                var $354 = String$split$go$($351, _match$2, (_last$3 + _next$6));
                var $352 = $354;
            };
            var $348 = $352;
        };
        return $348;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $355 = String$split$go$(_xs$1, _match$2, "");
        return $355;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $357 = self.head;
                var $358 = self.tail;
                var $359 = List$cons$(_f$3($357), List$map$(_f$3, $358));
                var $356 = $359;
                break;
            case 'List.nil':
                var $360 = List$nil;
                var $356 = $360;
                break;
        };
        return $356;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $362 = self.head;
                var $363 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $365 = List$nil;
                    var $364 = $365;
                } else {
                    var $366 = (self - 1n);
                    var $367 = List$cons$($362, List$take$($366, $363));
                    var $364 = $367;
                };
                var $361 = $364;
                break;
            case 'List.nil':
                var $368 = List$nil;
                var $361 = $368;
                break;
        };
        return $361;
    };
    const List$take = x0 => x1 => List$take$(x0, x1);

    function Senhas$read_input$(_line$1) {
        var _split$2 = String$split$(_line$1, " ");
        var _map$3 = List$map$(Nat$read, _split$2);
        var _list$4 = List$take$(4n, _map$3);
        var $369 = _list$4;
        return $369;
    };
    const Senhas$read_input = x0 => Senhas$read_input$(x0);
    const Nat$eql = a0 => a1 => (a0 === a1);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Senha$tem_numero$(_num$1, _senha$2) {
        var _tmp$3 = List$map$(a1 => (_num$1 === a1), _senha$2);
        var _tmp$4 = List$fold$(_tmp$3, Bool$false, Bool$or);
        var $370 = _tmp$4;
        return $370;
    };
    const Senha$tem_numero = x0 => x1 => Senha$tem_numero$(x0, x1);

    function Senha$verifica$(_senha$1, _a$2, _b$3) {
        var self = _senha$1;
        switch (self._) {
            case 'List.nil':
                var $372 = "";
                var $371 = $372;
                break;
            case 'List.cons':
                var self = (_a$2 === _b$3);
                if (self) {
                    var $374 = "V ";
                    var $373 = $374;
                } else {
                    var self = Senha$tem_numero$(_b$3, _senha$1);
                    if (self) {
                        var $376 = "O ";
                        var $375 = $376;
                    } else {
                        var $377 = "X ";
                        var $375 = $377;
                    };
                    var $373 = $375;
                };
                var $371 = $373;
                break;
        };
        return $371;
    };
    const Senha$verifica = x0 => x1 => x2 => Senha$verifica$(x0, x1, x2);

    function Senhas$resposta$(_suporte$1, _senha$2, _tentativa$3) {
        var self = _tentativa$3;
        switch (self._) {
            case 'List.cons':
                var $379 = self.head;
                var $380 = self.tail;
                var self = _senha$2;
                switch (self._) {
                    case 'List.cons':
                        var $382 = self.head;
                        var $383 = self.tail;
                        var $384 = List$cons$(Senha$verifica$(_suporte$1, $379, $382), Senhas$resposta$(_suporte$1, $383, $380));
                        var $381 = $384;
                        break;
                    case 'List.nil':
                        var $385 = List$nil;
                        var $381 = $385;
                        break;
                };
                var $378 = $381;
                break;
            case 'List.nil':
                var $386 = List$nil;
                var $378 = $386;
                break;
        };
        return $378;
    };
    const Senhas$resposta = x0 => x1 => x2 => Senhas$resposta$(x0, x1, x2);

    function Senha$confirma$(_xs$1) {
        var _chck$2 = List$map$(a1 => (10n > a1), _xs$1);
        var _chck$3 = List$fold$(_chck$2, Bool$true, Bool$and);
        var $387 = _chck$3;
        return $387;
    };
    const Senha$confirma = x0 => Senha$confirma$(x0);

    function IO$put_string$(_text$1) {
        var $388 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $389 = IO$end$(Unit$new);
            return $389;
        }));
        return $388;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $390 = IO$put_string$((_text$1 + "\u{a}"));
        return $390;
    };
    const IO$print = x0 => IO$print$(x0);

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
                        var $391 = self.head;
                        var $392 = self.tail;
                        var $393 = String$flatten$go$($392, (_res$2 + $391));
                        return $393;
                    case 'List.nil':
                        var $394 = _res$2;
                        return $394;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $395 = String$flatten$go$(_xs$1, "");
        return $395;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $397 = self.head;
                var $398 = self.tail;
                var $399 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $400 = "";
                        return $400;
                    } else {
                        var $401 = _sep$1;
                        return $401;
                    };
                })(), List$cons$($397, List$cons$(String$join$go$(_sep$1, $398, Bool$false), List$nil))));
                var $396 = $399;
                break;
            case 'List.nil':
                var $402 = "";
                var $396 = $402;
                break;
        };
        return $396;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $403 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $403;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function List$eql$(_eql$2, _a$3, _b$4) {
        var self = _a$3;
        switch (self._) {
            case 'List.cons':
                var $405 = self.head;
                var $406 = self.tail;
                var self = _b$4;
                switch (self._) {
                    case 'List.cons':
                        var $408 = self.head;
                        var $409 = self.tail;
                        var $410 = (_eql$2($405)($408) && List$eql$(_eql$2, $406, $409));
                        var $407 = $410;
                        break;
                    case 'List.nil':
                        var $411 = Bool$false;
                        var $407 = $411;
                        break;
                };
                var $404 = $407;
                break;
            case 'List.nil':
                var self = _b$4;
                switch (self._) {
                    case 'List.nil':
                        var $413 = Bool$true;
                        var $412 = $413;
                        break;
                    case 'List.cons':
                        var $414 = Bool$false;
                        var $412 = $414;
                        break;
                };
                var $404 = $412;
                break;
        };
        return $404;
    };
    const List$eql = x0 => x1 => x2 => List$eql$(x0, x1, x2);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Senhas$loope$(_senha$1, _tentativas$2) {
        var $415 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $416 = _m$bind$3;
            return $416;
        }))(IO$prompt$(("\u{a}Voc\u{ea} tem: " + (Nat$show$((_tentativas$2 + 1n)) + (" tentativas." + " Escolha 4 n\u{fa}meros:")))))((_line$3 => {
            var _user_nums$4 = Senhas$read_input$(_line$3);
            var _user_try$5 = Senhas$resposta$(_senha$1, _user_nums$4, _senha$1);
            var self = Senha$confirma$(_user_nums$4);
            if (self) {
                var $418 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $419 = _m$bind$6;
                    return $419;
                }))(IO$print$("Sua resposta est\u{e1}:"))((_$6 => {
                    var $420 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                        var $421 = _m$bind$7;
                        return $421;
                    }))(IO$print$(String$join$("", _user_try$5)))((_$7 => {
                        var self = List$eql$(Nat$eql, _user_nums$4, _senha$1);
                        if (self) {
                            var $423 = IO$print$("Parab\u{e9}ns, voc\u{ea} venceu!");
                            var $422 = $423;
                        } else {
                            var self = (_tentativas$2 === 0n);
                            if (self) {
                                var $425 = IO$print$("Infelizmente, voc\u{ea} perdeu");
                                var $424 = $425;
                            } else {
                                var $426 = Senhas$loope$(_senha$1, (_tentativas$2 - 1n <= 0n ? 0n : _tentativas$2 - 1n));
                                var $424 = $426;
                            };
                            var $422 = $424;
                        };
                        return $422;
                    }));
                    return $420;
                }));
                var $417 = $418;
            } else {
                var $427 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $428 = _m$bind$6;
                    return $428;
                }))(IO$print$("Seu input n\u{e3}o foi v\u{e1}lido, tente novamente"))((_$6 => {
                    var $429 = Senhas$loope$(_senha$1, _tentativas$2);
                    return $429;
                }));
                var $417 = $427;
            };
            return $417;
        }));
        return $415;
    };
    const Senhas$loope = x0 => x1 => Senhas$loope$(x0, x1);
    const Senhas = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $430 = _m$bind$1;
        return $430;
    }))(IO$random$(10n))((_num$1 => {
        var $431 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $432 = _m$bind$2;
            return $432;
        }))(IO$randoms$(4n, 10n))((_num_1$2 => {
            var _lista$3 = List$cons$(1n, List$cons$(2n, List$cons$(3n, List$cons$(4n, List$cons$(5n, List$cons$(6n, List$cons$(7n, List$cons$(8n, List$cons$(9n, List$cons$(0n, List$nil))))))))));
            var $433 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $434 = _m$bind$4;
                return $434;
            }))(IO$randoms$(6n, 10n))((_lista1$4 => {
                var _senha$5 = List$random$(_num_1$2, _lista$3, List$nil);
                var $435 = Senhas$loope$(_senha$5, 4n);
                return $435;
            }));
            return $433;
        }));
        return $431;
    }));
    const User$Sipher$Senhas = Senhas;

    function App$new$(_init$2, _draw$3, _when$4) {
        var $436 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $436;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Senhas = (() => {
        var _draw$1 = (_state$1 => {
            var $438 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Bem-vindo ao joguinho das senhas! Instru\u{e7}\u{f5}es:"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("... TODO :) ..."), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Aperte qualquer tecla para come\u{e7}ar."), List$nil)), List$nil))));
            return $438;
        });
        var _when$2 = (_event$2 => _state$3 => {
            var self = _event$2;
            switch (self._) {
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                case 'App.Event.post':
                case 'App.Event.mouse_over':
                case 'App.Event.mouse_out':
                case 'App.Event.mouse_click':
                case 'App.Event.resize':
                    var $440 = App$pass;
                    var $439 = $440;
                    break;
                case 'App.Event.key_down':
                    var $441 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $442 = _m$bind$6;
                        return $442;
                    }))(User$Sipher$Senhas)((_$6 => {
                        var $443 = App$pass;
                        return $443;
                    }));
                    var $439 = $441;
                    break;
            };
            return $439;
        });
        var $437 = App$new$(Unit$new, _draw$1, _when$2);
        return $437;
    })();
    return {
        'DOM.node': DOM$node,
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
        'List.nil': List$nil,
        'Pair': Pair,
        'List.cons': List$cons,
        'DOM.text': DOM$text,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'Unit.new': Unit$new,
        'App.pass': App$pass,
        'Parser.State.new': Parser$State$new,
        'Maybe': Maybe,
        'Parser.run': Parser$run,
        'Parser.Reply': Parser$Reply,
        'List': List,
        'Parser.Reply.error': Parser$Reply$error,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Nat.gtn': Nat$gtn,
        'Parser.Error.combine': Parser$Error$combine,
        'Parser.Error.maybe_combine': Parser$Error$maybe_combine,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.many1': Parser$many1,
        'Parser.Error.new': Parser$Error$new,
        'Parser.Reply.fail': Parser$Reply$fail,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
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
        'Nat.randoms': Nat$randoms,
        'IO.randoms': IO$randoms,
        'Pair.new': Pair$new,
        'List.concat': List$concat,
        'List.pop_at.go': List$pop_at$go,
        'List.pop_at': List$pop_at,
        'List.random': List$random,
        'IO.prompt': IO$prompt,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Bool.and': Bool$and,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Char.eql': Char$eql,
        'String.starts_with': String$starts_with,
        'String.drop': String$drop,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'String.split.go': String$split$go,
        'String.split': String$split,
        'List.map': List$map,
        'List.take': List$take,
        'Senhas.read_input': Senhas$read_input,
        'Nat.eql': Nat$eql,
        'Bool.or': Bool$or,
        'Senha.tem_numero': Senha$tem_numero,
        'Senha.verifica': Senha$verifica,
        'Senhas.resposta': Senhas$resposta,
        'Senha.confirma': Senha$confirma,
        'IO.put_string': IO$put_string,
        'IO.print': IO$print,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'String.join.go': String$join$go,
        'String.join': String$join,
        'List.eql': List$eql,
        'Nat.sub': Nat$sub,
        'Senhas.loope': Senhas$loope,
        'Senhas': Senhas,
        'User.Sipher.Senhas': User$Sipher$Senhas,
        'App.new': App$new,
        'Web.Senhas': Web$Senhas,
    };
})();

/***/ })

}]);
//# sourceMappingURL=936.index.js.map