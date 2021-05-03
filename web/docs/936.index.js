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

    function Parser$Reply$(_V$1) {
        var $75 = null;
        return $75;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function List$(_A$1) {
        var $76 = null;
        return $76;
    };
    const List = x0 => List$(x0);

    function Parser$Reply$error$(_idx$2, _code$3, _err$4) {
        var $77 = ({
            _: 'Parser.Reply.error',
            'idx': _idx$2,
            'code': _code$3,
            'err': _err$4
        });
        return $77;
    };
    const Parser$Reply$error = x0 => x1 => x2 => Parser$Reply$error$(x0, x1, x2);

    function Parser$Reply$value$(_idx$2, _code$3, _val$4) {
        var $78 = ({
            _: 'Parser.Reply.value',
            'idx': _idx$2,
            'code': _code$3,
            'val': _val$4
        });
        return $78;
    };
    const Parser$Reply$value = x0 => x1 => x2 => Parser$Reply$value$(x0, x1, x2);

    function Parser$many$go$(_parse$2, _values$3, _idx$4, _code$5) {
        var Parser$many$go$ = (_parse$2, _values$3, _idx$4, _code$5) => ({
            ctr: 'TCO',
            arg: [_parse$2, _values$3, _idx$4, _code$5]
        });
        var Parser$many$go = _parse$2 => _values$3 => _idx$4 => _code$5 => Parser$many$go$(_parse$2, _values$3, _idx$4, _code$5);
        var arg = [_parse$2, _values$3, _idx$4, _code$5];
        while (true) {
            let [_parse$2, _values$3, _idx$4, _code$5] = arg;
            var R = (() => {
                var self = _parse$2(_idx$4)(_code$5);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $79 = self.idx;
                        var $80 = self.code;
                        var $81 = self.val;
                        var $82 = Parser$many$go$(_parse$2, (_xs$9 => {
                            var $83 = _values$3(List$cons$($81, _xs$9));
                            return $83;
                        }), $79, $80);
                        return $82;
                    case 'Parser.Reply.error':
                        var $84 = Parser$Reply$value$(_idx$4, _code$5, _values$3(List$nil));
                        return $84;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => x3 => Parser$many$go$(x0, x1, x2, x3);

    function Parser$many$(_parser$2) {
        var $85 = Parser$many$go(_parser$2)((_x$3 => {
            var $86 = _x$3;
            return $86;
        }));
        return $85;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _idx$3, _code$4) {
        var self = _parser$2(_idx$3)(_code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $88 = self.idx;
                var $89 = self.code;
                var $90 = self.err;
                var $91 = Parser$Reply$error$($88, $89, $90);
                var $87 = $91;
                break;
            case 'Parser.Reply.value':
                var $92 = self.idx;
                var $93 = self.code;
                var $94 = self.val;
                var self = Parser$many$(_parser$2)($92)($93);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $96 = self.idx;
                        var $97 = self.code;
                        var $98 = self.err;
                        var $99 = Parser$Reply$error$($96, $97, $98);
                        var $95 = $99;
                        break;
                    case 'Parser.Reply.value':
                        var $100 = self.idx;
                        var $101 = self.code;
                        var $102 = self.val;
                        var $103 = Parser$Reply$value$($100, $101, List$cons$($94, $102));
                        var $95 = $103;
                        break;
                };
                var $87 = $95;
                break;
        };
        return $87;
    };
    const Parser$many1 = x0 => x1 => x2 => Parser$many1$(x0, x1, x2);
    const Bool$false = false;
    const Bool$true = true;

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $105 = Bool$false;
                var $104 = $105;
                break;
            case 'Cmp.eql':
                var $106 = Bool$true;
                var $104 = $106;
                break;
        };
        return $104;
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

    function Word$eql$(_a$2, _b$3) {
        var $133 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $133;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function Parser$digit$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $135 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
            var $134 = $135;
        } else {
            var $136 = self.charCodeAt(0);
            var $137 = self.slice(1);
            var _sidx$5 = Nat$succ$(_idx$1);
            var self = ($136 === 48);
            if (self) {
                var $139 = Parser$Reply$value$(_sidx$5, $137, 0n);
                var $138 = $139;
            } else {
                var self = ($136 === 49);
                if (self) {
                    var $141 = Parser$Reply$value$(_sidx$5, $137, 1n);
                    var $140 = $141;
                } else {
                    var self = ($136 === 50);
                    if (self) {
                        var $143 = Parser$Reply$value$(_sidx$5, $137, 2n);
                        var $142 = $143;
                    } else {
                        var self = ($136 === 51);
                        if (self) {
                            var $145 = Parser$Reply$value$(_sidx$5, $137, 3n);
                            var $144 = $145;
                        } else {
                            var self = ($136 === 52);
                            if (self) {
                                var $147 = Parser$Reply$value$(_sidx$5, $137, 4n);
                                var $146 = $147;
                            } else {
                                var self = ($136 === 53);
                                if (self) {
                                    var $149 = Parser$Reply$value$(_sidx$5, $137, 5n);
                                    var $148 = $149;
                                } else {
                                    var self = ($136 === 54);
                                    if (self) {
                                        var $151 = Parser$Reply$value$(_sidx$5, $137, 6n);
                                        var $150 = $151;
                                    } else {
                                        var self = ($136 === 55);
                                        if (self) {
                                            var $153 = Parser$Reply$value$(_sidx$5, $137, 7n);
                                            var $152 = $153;
                                        } else {
                                            var self = ($136 === 56);
                                            if (self) {
                                                var $155 = Parser$Reply$value$(_sidx$5, $137, 8n);
                                                var $154 = $155;
                                            } else {
                                                var self = ($136 === 57);
                                                if (self) {
                                                    var $157 = Parser$Reply$value$(_sidx$5, $137, 9n);
                                                    var $156 = $157;
                                                } else {
                                                    var $158 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
                                                    var $156 = $158;
                                                };
                                                var $154 = $156;
                                            };
                                            var $152 = $154;
                                        };
                                        var $150 = $152;
                                    };
                                    var $148 = $150;
                                };
                                var $146 = $148;
                            };
                            var $144 = $146;
                        };
                        var $142 = $144;
                    };
                    var $140 = $142;
                };
                var $138 = $140;
            };
            var $134 = $138;
        };
        return $134;
    };
    const Parser$digit = x0 => x1 => Parser$digit$(x0, x1);
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
                        var $159 = self.head;
                        var $160 = self.tail;
                        var $161 = Nat$from_base$go$(_b$1, $160, (_b$1 * _p$3), (($159 * _p$3) + _res$4));
                        return $161;
                    case 'List.nil':
                        var $162 = _res$4;
                        return $162;
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
                        var $163 = self.head;
                        var $164 = self.tail;
                        var $165 = List$reverse$go$($164, List$cons$($163, _res$3));
                        return $165;
                    case 'List.nil':
                        var $166 = _res$3;
                        return $166;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $167 = List$reverse$go$(_xs$2, List$nil);
        return $167;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Nat$from_base$(_base$1, _ds$2) {
        var $168 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $168;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_idx$1, _code$2) {
        var self = Parser$many1$(Parser$digit, _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $170 = self.idx;
                var $171 = self.code;
                var $172 = self.err;
                var $173 = Parser$Reply$error$($170, $171, $172);
                var $169 = $173;
                break;
            case 'Parser.Reply.value':
                var $174 = self.idx;
                var $175 = self.code;
                var $176 = self.val;
                var $177 = Parser$Reply$value$($174, $175, Nat$from_base$(10n, $176));
                var $169 = $177;
                break;
        };
        return $169;
    };
    const Parser$nat = x0 => x1 => Parser$nat$(x0, x1);

    function Nat$read$(_str$1) {
        var _p$2 = Parser$nat$(0n, _str$1);
        var self = _p$2;
        switch (self._) {
            case 'Parser.Reply.value':
                var $179 = self.val;
                var $180 = $179;
                var $178 = $180;
                break;
            case 'Parser.Reply.error':
                var $181 = 0n;
                var $178 = $181;
                break;
        };
        return $178;
    };
    const Nat$read = x0 => Nat$read$(x0);
    const IO$get_time = IO$ask$("get_time", "", (_time$1 => {
        var $182 = IO$end$(Nat$read$(_time$1));
        return $182;
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
                    var $183 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $183;
                } else {
                    var $184 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $186 = _r$3;
                        var $185 = $186;
                    } else {
                        var $187 = (self - 1n);
                        var $188 = Nat$mod$go$($187, $184, Nat$succ$(_r$3));
                        var $185 = $188;
                    };
                    return $185;
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
        var $189 = (((_seed$1 * _m$2) + _i$3) % _q$4);
        return $189;
    };
    const Nat$random = x0 => Nat$random$(x0);

    function IO$random$(_a$1) {
        var $190 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $191 = _m$bind$2;
            return $191;
        }))(IO$get_time)((_seed$2 => {
            var _seed$3 = Nat$random$(_seed$2);
            var $192 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $193 = _m$pure$5;
                return $193;
            }))((_seed$3 % _a$1));
            return $192;
        }));
        return $190;
    };
    const IO$random = x0 => IO$random$(x0);

    function Nat$randoms$(_len$1, _seed$2, _max$3) {
        var self = _len$1;
        if (self === 0n) {
            var $195 = List$nil;
            var $194 = $195;
        } else {
            var $196 = (self - 1n);
            var _new_seed$5 = Nat$random$(_seed$2);
            var $197 = List$cons$((_new_seed$5 % _max$3), Nat$randoms$($196, _new_seed$5, _max$3));
            var $194 = $197;
        };
        return $194;
    };
    const Nat$randoms = x0 => x1 => x2 => Nat$randoms$(x0, x1, x2);

    function IO$randoms$(_len$1, _max$2) {
        var $198 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $199 = _m$bind$3;
            return $199;
        }))(IO$get_time)((_seed$3 => {
            var $200 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $201 = _m$pure$5;
                return $201;
            }))(Nat$randoms$(_len$1, _seed$3, _max$2));
            return $200;
        }));
        return $198;
    };
    const IO$randoms = x0 => x1 => IO$randoms$(x0, x1);

    function Maybe$(_A$1) {
        var $202 = null;
        return $202;
    };
    const Maybe = x0 => Maybe$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $203 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $203;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $205 = self.head;
                var $206 = self.tail;
                var $207 = List$cons$($205, List$concat$($206, _bs$3));
                var $204 = $207;
                break;
            case 'List.nil':
                var $208 = _bs$3;
                var $204 = $208;
                break;
        };
        return $204;
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
                            var $210 = self.head;
                            var $211 = self.tail;
                            var $212 = Pair$new$(Maybe$some$($210), List$concat$(_searched_list$4, $211));
                            var $209 = $212;
                            break;
                        case 'List.nil':
                            var $213 = Pair$new$(Maybe$none, _searched_list$4);
                            var $209 = $213;
                            break;
                    };
                    return $209;
                } else {
                    var $214 = (self - 1n);
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $216 = self.head;
                            var $217 = self.tail;
                            var $218 = List$pop_at$go$($214, $217, List$concat$(_searched_list$4, List$cons$($216, List$nil)));
                            var $215 = $218;
                            break;
                        case 'List.nil':
                            var $219 = Pair$new$(Maybe$none, _searched_list$4);
                            var $215 = $219;
                            break;
                    };
                    return $215;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$pop_at$go = x0 => x1 => x2 => List$pop_at$go$(x0, x1, x2);

    function List$pop_at$(_idx$2, _list$3) {
        var $220 = List$pop_at$go$(_idx$2, _list$3, List$nil);
        return $220;
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
                        var $221 = self.head;
                        var $222 = self.tail;
                        var self = _ys$2;
                        switch (self._) {
                            case 'List.nil':
                                var $224 = List$nil;
                                var $223 = $224;
                                break;
                            case 'List.cons':
                                var _a$8 = List$pop_at$($221, _ys$2);
                                var self = _a$8;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $226 = self.fst;
                                        var $227 = self.snd;
                                        var self = $226;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $229 = self.value;
                                                var $230 = List$random$($222, $227, List$cons$($229, _zs$3));
                                                var $228 = $230;
                                                break;
                                            case 'Maybe.none':
                                                var $231 = List$random$(List$cons$((Nat$random$($221) % 10n), $222), _ys$2, _zs$3);
                                                var $228 = $231;
                                                break;
                                        };
                                        var $225 = $228;
                                        break;
                                };
                                var $223 = $225;
                                break;
                        };
                        return $223;
                    case 'List.nil':
                        var $232 = _zs$3;
                        return $232;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$random = x0 => x1 => x2 => List$random$(x0, x1, x2);

    function IO$prompt$(_text$1) {
        var $233 = IO$ask$("get_line", _text$1, (_line$2 => {
            var $234 = IO$end$(_line$2);
            return $234;
        }));
        return $233;
    };
    const IO$prompt = x0 => IO$prompt$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $235 = (String.fromCharCode(_head$1) + _tail$2);
        return $235;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $237 = self.head;
                var $238 = self.tail;
                var $239 = _cons$5($237)(List$fold$($238, _nil$4, _cons$5));
                var $236 = $239;
                break;
            case 'List.nil':
                var $240 = _nil$4;
                var $236 = $240;
                break;
        };
        return $236;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $241 = null;
        return $241;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $242 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $242;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $243 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $243;
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
                    var $244 = Either$left$(_n$1);
                    return $244;
                } else {
                    var $245 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $247 = Either$right$(Nat$succ$($245));
                        var $246 = $247;
                    } else {
                        var $248 = (self - 1n);
                        var $249 = Nat$sub_rem$($248, $245);
                        var $246 = $249;
                    };
                    return $246;
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
                        var $250 = self.value;
                        var $251 = Nat$div_mod$go$($250, _m$2, Nat$succ$(_d$3));
                        return $251;
                    case 'Either.right':
                        var $252 = Pair$new$(_d$3, _n$1);
                        return $252;
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
                        var $253 = self.fst;
                        var $254 = self.snd;
                        var self = $253;
                        if (self === 0n) {
                            var $256 = List$cons$($254, _res$3);
                            var $255 = $256;
                        } else {
                            var $257 = (self - 1n);
                            var $258 = Nat$to_base$go$(_base$1, $253, List$cons$($254, _res$3));
                            var $255 = $258;
                        };
                        return $255;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $259 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $259;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const String$nil = '';
    const Bool$and = a0 => a1 => (a0 && a1);
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
                        var $260 = self.head;
                        var $261 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $263 = Maybe$some$($260);
                            var $262 = $263;
                        } else {
                            var $264 = (self - 1n);
                            var $265 = List$at$($264, $261);
                            var $262 = $265;
                        };
                        return $262;
                    case 'List.nil':
                        var $266 = Maybe$none;
                        return $266;
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
                    var $269 = self.value;
                    var $270 = $269;
                    var $268 = $270;
                    break;
                case 'Maybe.none':
                    var $271 = 35;
                    var $268 = $271;
                    break;
            };
            var $267 = $268;
        } else {
            var $272 = 35;
            var $267 = $272;
        };
        return $267;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $273 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $274 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $274;
        }));
        return $273;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $275 = Nat$to_string_base$(10n, _n$1);
        return $275;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $276 = (_a$1 === _b$2);
        return $276;
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
                    var $277 = Bool$true;
                    return $277;
                } else {
                    var $278 = self.charCodeAt(0);
                    var $279 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $281 = Bool$false;
                        var $280 = $281;
                    } else {
                        var $282 = self.charCodeAt(0);
                        var $283 = self.slice(1);
                        var self = Char$eql$($278, $282);
                        if (self) {
                            var $285 = String$starts_with$($283, $279);
                            var $284 = $285;
                        } else {
                            var $286 = Bool$false;
                            var $284 = $286;
                        };
                        var $280 = $284;
                    };
                    return $280;
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
                    var $287 = _xs$2;
                    return $287;
                } else {
                    var $288 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $290 = String$nil;
                        var $289 = $290;
                    } else {
                        var $291 = self.charCodeAt(0);
                        var $292 = self.slice(1);
                        var $293 = String$drop$($288, $292);
                        var $289 = $293;
                    };
                    return $289;
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
                    var $294 = _n$2;
                    return $294;
                } else {
                    var $295 = self.charCodeAt(0);
                    var $296 = self.slice(1);
                    var $297 = String$length$go$($296, Nat$succ$(_n$2));
                    return $297;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $298 = String$length$go$(_xs$1, 0n);
        return $298;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $300 = List$cons$(_last$3, List$nil);
            var $299 = $300;
        } else {
            var $301 = self.charCodeAt(0);
            var $302 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $304 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $303 = $304;
            } else {
                var _next$6 = String$cons$($301, String$nil);
                var $305 = String$split$go$($302, _match$2, (_last$3 + _next$6));
                var $303 = $305;
            };
            var $299 = $303;
        };
        return $299;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $306 = String$split$go$(_xs$1, _match$2, "");
        return $306;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $308 = self.head;
                var $309 = self.tail;
                var $310 = List$cons$(_f$3($308), List$map$(_f$3, $309));
                var $307 = $310;
                break;
            case 'List.nil':
                var $311 = List$nil;
                var $307 = $311;
                break;
        };
        return $307;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $313 = self.head;
                var $314 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $316 = List$nil;
                    var $315 = $316;
                } else {
                    var $317 = (self - 1n);
                    var $318 = List$cons$($313, List$take$($317, $314));
                    var $315 = $318;
                };
                var $312 = $315;
                break;
            case 'List.nil':
                var $319 = List$nil;
                var $312 = $319;
                break;
        };
        return $312;
    };
    const List$take = x0 => x1 => List$take$(x0, x1);

    function Senhas$read_input$(_line$1) {
        var _split$2 = String$split$(_line$1, " ");
        var _map$3 = List$map$(Nat$read, _split$2);
        var _list$4 = List$take$(4n, _map$3);
        var $320 = _list$4;
        return $320;
    };
    const Senhas$read_input = x0 => Senhas$read_input$(x0);
    const Nat$eql = a0 => a1 => (a0 === a1);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Senha$tem_numero$(_num$1, _senha$2) {
        var _tmp$3 = List$map$(a1 => (_num$1 === a1), _senha$2);
        var _tmp$4 = List$fold$(_tmp$3, Bool$false, Bool$or);
        var $321 = _tmp$4;
        return $321;
    };
    const Senha$tem_numero = x0 => x1 => Senha$tem_numero$(x0, x1);

    function Senha$verifica$(_senha$1, _a$2, _b$3) {
        var self = _senha$1;
        switch (self._) {
            case 'List.nil':
                var $323 = "";
                var $322 = $323;
                break;
            case 'List.cons':
                var self = (_a$2 === _b$3);
                if (self) {
                    var $325 = "V ";
                    var $324 = $325;
                } else {
                    var self = Senha$tem_numero$(_b$3, _senha$1);
                    if (self) {
                        var $327 = "O ";
                        var $326 = $327;
                    } else {
                        var $328 = "X ";
                        var $326 = $328;
                    };
                    var $324 = $326;
                };
                var $322 = $324;
                break;
        };
        return $322;
    };
    const Senha$verifica = x0 => x1 => x2 => Senha$verifica$(x0, x1, x2);

    function Senhas$resposta$(_suporte$1, _senha$2, _tentativa$3) {
        var self = _tentativa$3;
        switch (self._) {
            case 'List.cons':
                var $330 = self.head;
                var $331 = self.tail;
                var self = _senha$2;
                switch (self._) {
                    case 'List.cons':
                        var $333 = self.head;
                        var $334 = self.tail;
                        var $335 = List$cons$(Senha$verifica$(_suporte$1, $330, $333), Senhas$resposta$(_suporte$1, $334, $331));
                        var $332 = $335;
                        break;
                    case 'List.nil':
                        var $336 = List$nil;
                        var $332 = $336;
                        break;
                };
                var $329 = $332;
                break;
            case 'List.nil':
                var $337 = List$nil;
                var $329 = $337;
                break;
        };
        return $329;
    };
    const Senhas$resposta = x0 => x1 => x2 => Senhas$resposta$(x0, x1, x2);

    function Senha$confirma$(_xs$1) {
        var _chck$2 = List$map$(a1 => (10n > a1), _xs$1);
        var _chck$3 = List$fold$(_chck$2, Bool$true, Bool$and);
        var $338 = _chck$3;
        return $338;
    };
    const Senha$confirma = x0 => Senha$confirma$(x0);

    function IO$put_string$(_text$1) {
        var $339 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $340 = IO$end$(Unit$new);
            return $340;
        }));
        return $339;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $341 = IO$put_string$((_text$1 + "\u{a}"));
        return $341;
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
                        var $342 = self.head;
                        var $343 = self.tail;
                        var $344 = String$flatten$go$($343, (_res$2 + $342));
                        return $344;
                    case 'List.nil':
                        var $345 = _res$2;
                        return $345;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $346 = String$flatten$go$(_xs$1, "");
        return $346;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $348 = self.head;
                var $349 = self.tail;
                var $350 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $351 = "";
                        return $351;
                    } else {
                        var $352 = _sep$1;
                        return $352;
                    };
                })(), List$cons$($348, List$cons$(String$join$go$(_sep$1, $349, Bool$false), List$nil))));
                var $347 = $350;
                break;
            case 'List.nil':
                var $353 = "";
                var $347 = $353;
                break;
        };
        return $347;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $354 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $354;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function List$eql$(_eql$2, _a$3, _b$4) {
        var self = _a$3;
        switch (self._) {
            case 'List.cons':
                var $356 = self.head;
                var $357 = self.tail;
                var self = _b$4;
                switch (self._) {
                    case 'List.cons':
                        var $359 = self.head;
                        var $360 = self.tail;
                        var $361 = (_eql$2($356)($359) && List$eql$(_eql$2, $357, $360));
                        var $358 = $361;
                        break;
                    case 'List.nil':
                        var $362 = Bool$false;
                        var $358 = $362;
                        break;
                };
                var $355 = $358;
                break;
            case 'List.nil':
                var self = _b$4;
                switch (self._) {
                    case 'List.nil':
                        var $364 = Bool$true;
                        var $363 = $364;
                        break;
                    case 'List.cons':
                        var $365 = Bool$false;
                        var $363 = $365;
                        break;
                };
                var $355 = $363;
                break;
        };
        return $355;
    };
    const List$eql = x0 => x1 => x2 => List$eql$(x0, x1, x2);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Senhas$loope$(_senha$1, _tentativas$2) {
        var $366 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $367 = _m$bind$3;
            return $367;
        }))(IO$prompt$(("\u{a}Voc\u{ea} tem: " + (Nat$show$((_tentativas$2 + 1n)) + (" tentativas." + " Escolha 4 n\u{fa}meros:")))))((_line$3 => {
            var _user_nums$4 = Senhas$read_input$(_line$3);
            var _user_try$5 = Senhas$resposta$(_senha$1, _user_nums$4, _senha$1);
            var self = Senha$confirma$(_user_nums$4);
            if (self) {
                var $369 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $370 = _m$bind$6;
                    return $370;
                }))(IO$print$("Sua resposta est\u{e1}:"))((_$6 => {
                    var $371 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                        var $372 = _m$bind$7;
                        return $372;
                    }))(IO$print$(String$join$("", _user_try$5)))((_$7 => {
                        var self = List$eql$(Nat$eql, _user_nums$4, _senha$1);
                        if (self) {
                            var $374 = IO$print$("Parab\u{e9}ns, voc\u{ea} venceu!");
                            var $373 = $374;
                        } else {
                            var self = (_tentativas$2 === 0n);
                            if (self) {
                                var $376 = IO$print$("Infelizmente, voc\u{ea} perdeu");
                                var $375 = $376;
                            } else {
                                var $377 = Senhas$loope$(_senha$1, (_tentativas$2 - 1n <= 0n ? 0n : _tentativas$2 - 1n));
                                var $375 = $377;
                            };
                            var $373 = $375;
                        };
                        return $373;
                    }));
                    return $371;
                }));
                var $368 = $369;
            } else {
                var $378 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $379 = _m$bind$6;
                    return $379;
                }))(IO$print$("Seu input n\u{e3}o foi v\u{e1}lido, tente novamente"))((_$6 => {
                    var $380 = Senhas$loope$(_senha$1, _tentativas$2);
                    return $380;
                }));
                var $368 = $378;
            };
            return $368;
        }));
        return $366;
    };
    const Senhas$loope = x0 => x1 => Senhas$loope$(x0, x1);
    const Senhas = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $381 = _m$bind$1;
        return $381;
    }))(IO$random$(10n))((_num$1 => {
        var $382 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $383 = _m$bind$2;
            return $383;
        }))(IO$randoms$(4n, 10n))((_num_1$2 => {
            var _lista$3 = List$cons$(1n, List$cons$(2n, List$cons$(3n, List$cons$(4n, List$cons$(5n, List$cons$(6n, List$cons$(7n, List$cons$(8n, List$cons$(9n, List$cons$(0n, List$nil))))))))));
            var $384 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $385 = _m$bind$4;
                return $385;
            }))(IO$randoms$(6n, 10n))((_lista1$4 => {
                var _senha$5 = List$random$(_num_1$2, _lista$3, List$nil);
                var $386 = Senhas$loope$(_senha$5, 4n);
                return $386;
            }));
            return $384;
        }));
        return $382;
    }));
    const User$Sipher$Senhas = Senhas;

    function App$new$(_init$2, _draw$3, _when$4) {
        var $387 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $387;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Senhas = (() => {
        var _draw$1 = (_state$1 => {
            var $389 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Bem-vindo ao joguinho das senhas! Instru\u{e7}\u{f5}es:"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("... TODO :) ..."), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Aperte qualquer tecla para come\u{e7}ar."), List$nil)), List$nil))));
            return $389;
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
                    var $391 = App$pass;
                    var $390 = $391;
                    break;
                case 'App.Event.key_down':
                    var $392 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $393 = _m$bind$6;
                        return $393;
                    }))(User$Sipher$Senhas)((_$6 => {
                        var $394 = App$pass;
                        return $394;
                    }));
                    var $390 = $392;
                    break;
            };
            return $390;
        });
        var $388 = App$new$(Unit$new, _draw$1, _when$2);
        return $388;
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
        'Parser.Reply': Parser$Reply,
        'List': List,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.many1': Parser$many1,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
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
        'Maybe': Maybe,
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
        'Nat.gtn': Nat$gtn,
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