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

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $39 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $41 = self.val;
                        var $42 = self.lft;
                        var $43 = self.rgt;
                        var $44 = BitsMap$tie$($41, BitsMap$set$($39, _val$3, $42), $43);
                        var $40 = $44;
                        break;
                    case 'BitsMap.new':
                        var $45 = BitsMap$tie$(Maybe$none, BitsMap$set$($39, _val$3, BitsMap$new), BitsMap$new);
                        var $40 = $45;
                        break;
                };
                var $38 = $40;
                break;
            case 'i':
                var $46 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $48 = self.val;
                        var $49 = self.lft;
                        var $50 = self.rgt;
                        var $51 = BitsMap$tie$($48, $49, BitsMap$set$($46, _val$3, $50));
                        var $47 = $51;
                        break;
                    case 'BitsMap.new':
                        var $52 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($46, _val$3, BitsMap$new));
                        var $47 = $52;
                        break;
                };
                var $38 = $47;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $54 = self.lft;
                        var $55 = self.rgt;
                        var $56 = BitsMap$tie$(Maybe$some$(_val$3), $54, $55);
                        var $53 = $56;
                        break;
                    case 'BitsMap.new':
                        var $57 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $53 = $57;
                        break;
                };
                var $38 = $53;
                break;
        };
        return $38;
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
                var $59 = self.pred;
                var $60 = (Word$to_bits$($59) + '0');
                var $58 = $60;
                break;
            case 'Word.i':
                var $61 = self.pred;
                var $62 = (Word$to_bits$($61) + '1');
                var $58 = $62;
                break;
            case 'Word.e':
                var $63 = Bits$e;
                var $58 = $63;
                break;
        };
        return $58;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $64 = 1n + _pred$1;
        return $64;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $66 = Bits$e;
            var $65 = $66;
        } else {
            var $67 = self.charCodeAt(0);
            var $68 = self.slice(1);
            var $69 = (String$to_bits$($68) + (u16_to_bits($67)));
            var $65 = $69;
        };
        return $65;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $71 = self.head;
                var $72 = self.tail;
                var self = $71;
                switch (self._) {
                    case 'Pair.new':
                        var $74 = self.fst;
                        var $75 = self.snd;
                        var $76 = BitsMap$set$(String$to_bits$($74), $75, Map$from_list$($72));
                        var $73 = $76;
                        break;
                };
                var $70 = $73;
                break;
            case 'List.nil':
                var $77 = BitsMap$new;
                var $70 = $77;
                break;
        };
        return $70;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $78 = null;
        return $78;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $79 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $79;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $80 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $80;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function IO$(_A$1) {
        var $81 = null;
        return $81;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $82 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $82;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $84 = self.value;
                var $85 = _f$4($84);
                var $83 = $85;
                break;
            case 'IO.ask':
                var $86 = self.query;
                var $87 = self.param;
                var $88 = self.then;
                var $89 = IO$ask$($86, $87, (_x$8 => {
                    var $90 = IO$bind$($88(_x$8), _f$4);
                    return $90;
                }));
                var $83 = $89;
                break;
        };
        return $83;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $91 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $91;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $92 = _new$2(IO$bind)(IO$end);
        return $92;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $93 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $93;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $94 = _m$pure$2;
        return $94;
    }))(Dynamic$new$(Unit$new));

    function Parser$Reply$(_V$1) {
        var $95 = null;
        return $95;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function List$(_A$1) {
        var $96 = null;
        return $96;
    };
    const List = x0 => List$(x0);

    function Parser$Reply$error$(_idx$2, _code$3, _err$4) {
        var $97 = ({
            _: 'Parser.Reply.error',
            'idx': _idx$2,
            'code': _code$3,
            'err': _err$4
        });
        return $97;
    };
    const Parser$Reply$error = x0 => x1 => x2 => Parser$Reply$error$(x0, x1, x2);

    function Parser$Reply$value$(_idx$2, _code$3, _val$4) {
        var $98 = ({
            _: 'Parser.Reply.value',
            'idx': _idx$2,
            'code': _code$3,
            'val': _val$4
        });
        return $98;
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
                        var $99 = self.idx;
                        var $100 = self.code;
                        var $101 = self.val;
                        var $102 = Parser$many$go$(_parse$2, (_xs$9 => {
                            var $103 = _values$3(List$cons$($101, _xs$9));
                            return $103;
                        }), $99, $100);
                        return $102;
                    case 'Parser.Reply.error':
                        var $104 = Parser$Reply$value$(_idx$4, _code$5, _values$3(List$nil));
                        return $104;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => x3 => Parser$many$go$(x0, x1, x2, x3);

    function Parser$many$(_parser$2) {
        var $105 = Parser$many$go(_parser$2)((_x$3 => {
            var $106 = _x$3;
            return $106;
        }));
        return $105;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _idx$3, _code$4) {
        var self = _parser$2(_idx$3)(_code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $108 = self.idx;
                var $109 = self.code;
                var $110 = self.err;
                var $111 = Parser$Reply$error$($108, $109, $110);
                var $107 = $111;
                break;
            case 'Parser.Reply.value':
                var $112 = self.idx;
                var $113 = self.code;
                var $114 = self.val;
                var self = Parser$many$(_parser$2)($112)($113);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $116 = self.idx;
                        var $117 = self.code;
                        var $118 = self.err;
                        var $119 = Parser$Reply$error$($116, $117, $118);
                        var $115 = $119;
                        break;
                    case 'Parser.Reply.value':
                        var $120 = self.idx;
                        var $121 = self.code;
                        var $122 = self.val;
                        var $123 = Parser$Reply$value$($120, $121, List$cons$($114, $122));
                        var $115 = $123;
                        break;
                };
                var $107 = $115;
                break;
        };
        return $107;
    };
    const Parser$many1 = x0 => x1 => x2 => Parser$many1$(x0, x1, x2);
    const Bool$false = false;
    const Bool$true = true;

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $125 = Bool$false;
                var $124 = $125;
                break;
            case 'Cmp.eql':
                var $126 = Bool$true;
                var $124 = $126;
                break;
        };
        return $124;
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
                var $128 = self.pred;
                var $129 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $131 = self.pred;
                            var $132 = (_a$pred$10 => {
                                var $133 = Word$cmp$go$(_a$pred$10, $131, _c$4);
                                return $133;
                            });
                            var $130 = $132;
                            break;
                        case 'Word.i':
                            var $134 = self.pred;
                            var $135 = (_a$pred$10 => {
                                var $136 = Word$cmp$go$(_a$pred$10, $134, Cmp$ltn);
                                return $136;
                            });
                            var $130 = $135;
                            break;
                        case 'Word.e':
                            var $137 = (_a$pred$8 => {
                                var $138 = _c$4;
                                return $138;
                            });
                            var $130 = $137;
                            break;
                    };
                    var $130 = $130($128);
                    return $130;
                });
                var $127 = $129;
                break;
            case 'Word.i':
                var $139 = self.pred;
                var $140 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $142 = self.pred;
                            var $143 = (_a$pred$10 => {
                                var $144 = Word$cmp$go$(_a$pred$10, $142, Cmp$gtn);
                                return $144;
                            });
                            var $141 = $143;
                            break;
                        case 'Word.i':
                            var $145 = self.pred;
                            var $146 = (_a$pred$10 => {
                                var $147 = Word$cmp$go$(_a$pred$10, $145, _c$4);
                                return $147;
                            });
                            var $141 = $146;
                            break;
                        case 'Word.e':
                            var $148 = (_a$pred$8 => {
                                var $149 = _c$4;
                                return $149;
                            });
                            var $141 = $148;
                            break;
                    };
                    var $141 = $141($139);
                    return $141;
                });
                var $127 = $140;
                break;
            case 'Word.e':
                var $150 = (_b$5 => {
                    var $151 = _c$4;
                    return $151;
                });
                var $127 = $150;
                break;
        };
        var $127 = $127(_b$3);
        return $127;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $152 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $152;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $153 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $153;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function Parser$digit$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $155 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
            var $154 = $155;
        } else {
            var $156 = self.charCodeAt(0);
            var $157 = self.slice(1);
            var _sidx$5 = Nat$succ$(_idx$1);
            var self = ($156 === 48);
            if (self) {
                var $159 = Parser$Reply$value$(_sidx$5, $157, 0n);
                var $158 = $159;
            } else {
                var self = ($156 === 49);
                if (self) {
                    var $161 = Parser$Reply$value$(_sidx$5, $157, 1n);
                    var $160 = $161;
                } else {
                    var self = ($156 === 50);
                    if (self) {
                        var $163 = Parser$Reply$value$(_sidx$5, $157, 2n);
                        var $162 = $163;
                    } else {
                        var self = ($156 === 51);
                        if (self) {
                            var $165 = Parser$Reply$value$(_sidx$5, $157, 3n);
                            var $164 = $165;
                        } else {
                            var self = ($156 === 52);
                            if (self) {
                                var $167 = Parser$Reply$value$(_sidx$5, $157, 4n);
                                var $166 = $167;
                            } else {
                                var self = ($156 === 53);
                                if (self) {
                                    var $169 = Parser$Reply$value$(_sidx$5, $157, 5n);
                                    var $168 = $169;
                                } else {
                                    var self = ($156 === 54);
                                    if (self) {
                                        var $171 = Parser$Reply$value$(_sidx$5, $157, 6n);
                                        var $170 = $171;
                                    } else {
                                        var self = ($156 === 55);
                                        if (self) {
                                            var $173 = Parser$Reply$value$(_sidx$5, $157, 7n);
                                            var $172 = $173;
                                        } else {
                                            var self = ($156 === 56);
                                            if (self) {
                                                var $175 = Parser$Reply$value$(_sidx$5, $157, 8n);
                                                var $174 = $175;
                                            } else {
                                                var self = ($156 === 57);
                                                if (self) {
                                                    var $177 = Parser$Reply$value$(_sidx$5, $157, 9n);
                                                    var $176 = $177;
                                                } else {
                                                    var $178 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
                                                    var $176 = $178;
                                                };
                                                var $174 = $176;
                                            };
                                            var $172 = $174;
                                        };
                                        var $170 = $172;
                                    };
                                    var $168 = $170;
                                };
                                var $166 = $168;
                            };
                            var $164 = $166;
                        };
                        var $162 = $164;
                    };
                    var $160 = $162;
                };
                var $158 = $160;
            };
            var $154 = $158;
        };
        return $154;
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
                        var $179 = self.head;
                        var $180 = self.tail;
                        var $181 = Nat$from_base$go$(_b$1, $180, (_b$1 * _p$3), (($179 * _p$3) + _res$4));
                        return $181;
                    case 'List.nil':
                        var $182 = _res$4;
                        return $182;
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
                        var $183 = self.head;
                        var $184 = self.tail;
                        var $185 = List$reverse$go$($184, List$cons$($183, _res$3));
                        return $185;
                    case 'List.nil':
                        var $186 = _res$3;
                        return $186;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $187 = List$reverse$go$(_xs$2, List$nil);
        return $187;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Nat$from_base$(_base$1, _ds$2) {
        var $188 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $188;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_idx$1, _code$2) {
        var self = Parser$many1$(Parser$digit, _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $190 = self.idx;
                var $191 = self.code;
                var $192 = self.err;
                var $193 = Parser$Reply$error$($190, $191, $192);
                var $189 = $193;
                break;
            case 'Parser.Reply.value':
                var $194 = self.idx;
                var $195 = self.code;
                var $196 = self.val;
                var $197 = Parser$Reply$value$($194, $195, Nat$from_base$(10n, $196));
                var $189 = $197;
                break;
        };
        return $189;
    };
    const Parser$nat = x0 => x1 => Parser$nat$(x0, x1);

    function Nat$read$(_str$1) {
        var _p$2 = Parser$nat$(0n, _str$1);
        var self = _p$2;
        switch (self._) {
            case 'Parser.Reply.value':
                var $199 = self.val;
                var $200 = $199;
                var $198 = $200;
                break;
            case 'Parser.Reply.error':
                var $201 = 0n;
                var $198 = $201;
                break;
        };
        return $198;
    };
    const Nat$read = x0 => Nat$read$(x0);
    const IO$get_time = IO$ask$("get_time", "", (_time$1 => {
        var $202 = IO$end$(Nat$read$(_time$1));
        return $202;
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
                    var $203 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $203;
                } else {
                    var $204 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $206 = _r$3;
                        var $205 = $206;
                    } else {
                        var $207 = (self - 1n);
                        var $208 = Nat$mod$go$($207, $204, Nat$succ$(_r$3));
                        var $205 = $208;
                    };
                    return $205;
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
        var $209 = (((_seed$1 * _m$2) + _i$3) % _q$4);
        return $209;
    };
    const Nat$random = x0 => Nat$random$(x0);

    function IO$random$(_a$1) {
        var $210 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $211 = _m$bind$2;
            return $211;
        }))(IO$get_time)((_seed$2 => {
            var _seed$3 = Nat$random$(_seed$2);
            var $212 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $213 = _m$pure$5;
                return $213;
            }))((_seed$3 % _a$1));
            return $212;
        }));
        return $210;
    };
    const IO$random = x0 => IO$random$(x0);

    function Nat$randoms$(_len$1, _seed$2, _max$3) {
        var self = _len$1;
        if (self === 0n) {
            var $215 = List$nil;
            var $214 = $215;
        } else {
            var $216 = (self - 1n);
            var _new_seed$5 = Nat$random$(_seed$2);
            var $217 = List$cons$((_new_seed$5 % _max$3), Nat$randoms$($216, _new_seed$5, _max$3));
            var $214 = $217;
        };
        return $214;
    };
    const Nat$randoms = x0 => x1 => x2 => Nat$randoms$(x0, x1, x2);

    function IO$randoms$(_len$1, _max$2) {
        var $218 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $219 = _m$bind$3;
            return $219;
        }))(IO$get_time)((_seed$3 => {
            var $220 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $221 = _m$pure$5;
                return $221;
            }))(Nat$randoms$(_len$1, _seed$3, _max$2));
            return $220;
        }));
        return $218;
    };
    const IO$randoms = x0 => x1 => IO$randoms$(x0, x1);

    function Maybe$(_A$1) {
        var $222 = null;
        return $222;
    };
    const Maybe = x0 => Maybe$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $223 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $223;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $225 = self.head;
                var $226 = self.tail;
                var $227 = List$cons$($225, List$concat$($226, _bs$3));
                var $224 = $227;
                break;
            case 'List.nil':
                var $228 = _bs$3;
                var $224 = $228;
                break;
        };
        return $224;
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
                            var $230 = self.head;
                            var $231 = self.tail;
                            var $232 = Pair$new$(Maybe$some$($230), List$concat$(_searched_list$4, $231));
                            var $229 = $232;
                            break;
                        case 'List.nil':
                            var $233 = Pair$new$(Maybe$none, _searched_list$4);
                            var $229 = $233;
                            break;
                    };
                    return $229;
                } else {
                    var $234 = (self - 1n);
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $236 = self.head;
                            var $237 = self.tail;
                            var $238 = List$pop_at$go$($234, $237, List$concat$(_searched_list$4, List$cons$($236, List$nil)));
                            var $235 = $238;
                            break;
                        case 'List.nil':
                            var $239 = Pair$new$(Maybe$none, _searched_list$4);
                            var $235 = $239;
                            break;
                    };
                    return $235;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$pop_at$go = x0 => x1 => x2 => List$pop_at$go$(x0, x1, x2);

    function List$pop_at$(_idx$2, _list$3) {
        var $240 = List$pop_at$go$(_idx$2, _list$3, List$nil);
        return $240;
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
                        var $241 = self.head;
                        var $242 = self.tail;
                        var self = _ys$2;
                        switch (self._) {
                            case 'List.nil':
                                var $244 = List$nil;
                                var $243 = $244;
                                break;
                            case 'List.cons':
                                var _a$8 = List$pop_at$($241, _ys$2);
                                var self = _a$8;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $246 = self.fst;
                                        var $247 = self.snd;
                                        var self = $246;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $249 = self.value;
                                                var $250 = List$random$($242, $247, List$cons$($249, _zs$3));
                                                var $248 = $250;
                                                break;
                                            case 'Maybe.none':
                                                var $251 = List$random$(List$cons$((Nat$random$($241) % 10n), $242), _ys$2, _zs$3);
                                                var $248 = $251;
                                                break;
                                        };
                                        var $245 = $248;
                                        break;
                                };
                                var $243 = $245;
                                break;
                        };
                        return $243;
                    case 'List.nil':
                        var $252 = _zs$3;
                        return $252;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$random = x0 => x1 => x2 => List$random$(x0, x1, x2);

    function IO$prompt$(_text$1) {
        var $253 = IO$ask$("get_line", _text$1, (_line$2 => {
            var $254 = IO$end$(_line$2);
            return $254;
        }));
        return $253;
    };
    const IO$prompt = x0 => IO$prompt$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $255 = (String.fromCharCode(_head$1) + _tail$2);
        return $255;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $257 = self.head;
                var $258 = self.tail;
                var $259 = _cons$5($257)(List$fold$($258, _nil$4, _cons$5));
                var $256 = $259;
                break;
            case 'List.nil':
                var $260 = _nil$4;
                var $256 = $260;
                break;
        };
        return $256;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $261 = null;
        return $261;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $262 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $262;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $263 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $263;
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
                    var $264 = Either$left$(_n$1);
                    return $264;
                } else {
                    var $265 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $267 = Either$right$(Nat$succ$($265));
                        var $266 = $267;
                    } else {
                        var $268 = (self - 1n);
                        var $269 = Nat$sub_rem$($268, $265);
                        var $266 = $269;
                    };
                    return $266;
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
                        var $270 = self.value;
                        var $271 = Nat$div_mod$go$($270, _m$2, Nat$succ$(_d$3));
                        return $271;
                    case 'Either.right':
                        var $272 = Pair$new$(_d$3, _n$1);
                        return $272;
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
                        var $273 = self.fst;
                        var $274 = self.snd;
                        var self = $273;
                        if (self === 0n) {
                            var $276 = List$cons$($274, _res$3);
                            var $275 = $276;
                        } else {
                            var $277 = (self - 1n);
                            var $278 = Nat$to_base$go$(_base$1, $273, List$cons$($274, _res$3));
                            var $275 = $278;
                        };
                        return $275;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $279 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $279;
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
                        var $280 = self.head;
                        var $281 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $283 = Maybe$some$($280);
                            var $282 = $283;
                        } else {
                            var $284 = (self - 1n);
                            var $285 = List$at$($284, $281);
                            var $282 = $285;
                        };
                        return $282;
                    case 'List.nil':
                        var $286 = Maybe$none;
                        return $286;
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
                    var $289 = self.value;
                    var $290 = $289;
                    var $288 = $290;
                    break;
                case 'Maybe.none':
                    var $291 = 35;
                    var $288 = $291;
                    break;
            };
            var $287 = $288;
        } else {
            var $292 = 35;
            var $287 = $292;
        };
        return $287;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $293 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $294 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $294;
        }));
        return $293;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $295 = Nat$to_string_base$(10n, _n$1);
        return $295;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $296 = (_a$1 === _b$2);
        return $296;
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
                    var $297 = Bool$true;
                    return $297;
                } else {
                    var $298 = self.charCodeAt(0);
                    var $299 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $301 = Bool$false;
                        var $300 = $301;
                    } else {
                        var $302 = self.charCodeAt(0);
                        var $303 = self.slice(1);
                        var self = Char$eql$($298, $302);
                        if (self) {
                            var $305 = String$starts_with$($303, $299);
                            var $304 = $305;
                        } else {
                            var $306 = Bool$false;
                            var $304 = $306;
                        };
                        var $300 = $304;
                    };
                    return $300;
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
                    var $307 = _xs$2;
                    return $307;
                } else {
                    var $308 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $310 = String$nil;
                        var $309 = $310;
                    } else {
                        var $311 = self.charCodeAt(0);
                        var $312 = self.slice(1);
                        var $313 = String$drop$($308, $312);
                        var $309 = $313;
                    };
                    return $309;
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
                    var $314 = _n$2;
                    return $314;
                } else {
                    var $315 = self.charCodeAt(0);
                    var $316 = self.slice(1);
                    var $317 = String$length$go$($316, Nat$succ$(_n$2));
                    return $317;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $318 = String$length$go$(_xs$1, 0n);
        return $318;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $320 = List$cons$(_last$3, List$nil);
            var $319 = $320;
        } else {
            var $321 = self.charCodeAt(0);
            var $322 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $324 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $323 = $324;
            } else {
                var _next$6 = String$cons$($321, String$nil);
                var $325 = String$split$go$($322, _match$2, (_last$3 + _next$6));
                var $323 = $325;
            };
            var $319 = $323;
        };
        return $319;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $326 = String$split$go$(_xs$1, _match$2, "");
        return $326;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $328 = self.head;
                var $329 = self.tail;
                var $330 = List$cons$(_f$3($328), List$map$(_f$3, $329));
                var $327 = $330;
                break;
            case 'List.nil':
                var $331 = List$nil;
                var $327 = $331;
                break;
        };
        return $327;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $333 = self.head;
                var $334 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $336 = List$nil;
                    var $335 = $336;
                } else {
                    var $337 = (self - 1n);
                    var $338 = List$cons$($333, List$take$($337, $334));
                    var $335 = $338;
                };
                var $332 = $335;
                break;
            case 'List.nil':
                var $339 = List$nil;
                var $332 = $339;
                break;
        };
        return $332;
    };
    const List$take = x0 => x1 => List$take$(x0, x1);

    function Senhas$read_input$(_line$1) {
        var _split$2 = String$split$(_line$1, " ");
        var _map$3 = List$map$(Nat$read, _split$2);
        var _list$4 = List$take$(4n, _map$3);
        var $340 = _list$4;
        return $340;
    };
    const Senhas$read_input = x0 => Senhas$read_input$(x0);
    const Nat$eql = a0 => a1 => (a0 === a1);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Senha$tem_numero$(_num$1, _senha$2) {
        var _tmp$3 = List$map$(a1 => (_num$1 === a1), _senha$2);
        var _tmp$4 = List$fold$(_tmp$3, Bool$false, Bool$or);
        var $341 = _tmp$4;
        return $341;
    };
    const Senha$tem_numero = x0 => x1 => Senha$tem_numero$(x0, x1);

    function Senha$verifica$(_senha$1, _a$2, _b$3) {
        var self = _senha$1;
        switch (self._) {
            case 'List.nil':
                var $343 = "";
                var $342 = $343;
                break;
            case 'List.cons':
                var self = (_a$2 === _b$3);
                if (self) {
                    var $345 = "V ";
                    var $344 = $345;
                } else {
                    var self = Senha$tem_numero$(_b$3, _senha$1);
                    if (self) {
                        var $347 = "O ";
                        var $346 = $347;
                    } else {
                        var $348 = "X ";
                        var $346 = $348;
                    };
                    var $344 = $346;
                };
                var $342 = $344;
                break;
        };
        return $342;
    };
    const Senha$verifica = x0 => x1 => x2 => Senha$verifica$(x0, x1, x2);

    function Senhas$resposta$(_suporte$1, _senha$2, _tentativa$3) {
        var self = _tentativa$3;
        switch (self._) {
            case 'List.cons':
                var $350 = self.head;
                var $351 = self.tail;
                var self = _senha$2;
                switch (self._) {
                    case 'List.cons':
                        var $353 = self.head;
                        var $354 = self.tail;
                        var $355 = List$cons$(Senha$verifica$(_suporte$1, $350, $353), Senhas$resposta$(_suporte$1, $354, $351));
                        var $352 = $355;
                        break;
                    case 'List.nil':
                        var $356 = List$nil;
                        var $352 = $356;
                        break;
                };
                var $349 = $352;
                break;
            case 'List.nil':
                var $357 = List$nil;
                var $349 = $357;
                break;
        };
        return $349;
    };
    const Senhas$resposta = x0 => x1 => x2 => Senhas$resposta$(x0, x1, x2);

    function Senha$confirma$(_xs$1) {
        var _chck$2 = List$map$(a1 => (10n > a1), _xs$1);
        var _chck$3 = List$fold$(_chck$2, Bool$true, Bool$and);
        var $358 = _chck$3;
        return $358;
    };
    const Senha$confirma = x0 => Senha$confirma$(x0);

    function IO$put_string$(_text$1) {
        var $359 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $360 = IO$end$(Unit$new);
            return $360;
        }));
        return $359;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $361 = IO$put_string$((_text$1 + "\u{a}"));
        return $361;
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
                        var $362 = self.head;
                        var $363 = self.tail;
                        var $364 = String$flatten$go$($363, (_res$2 + $362));
                        return $364;
                    case 'List.nil':
                        var $365 = _res$2;
                        return $365;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $366 = String$flatten$go$(_xs$1, "");
        return $366;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $368 = self.head;
                var $369 = self.tail;
                var $370 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $371 = "";
                        return $371;
                    } else {
                        var $372 = _sep$1;
                        return $372;
                    };
                })(), List$cons$($368, List$cons$(String$join$go$(_sep$1, $369, Bool$false), List$nil))));
                var $367 = $370;
                break;
            case 'List.nil':
                var $373 = "";
                var $367 = $373;
                break;
        };
        return $367;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $374 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $374;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function List$eql$(_eql$2, _a$3, _b$4) {
        var self = _a$3;
        switch (self._) {
            case 'List.cons':
                var $376 = self.head;
                var $377 = self.tail;
                var self = _b$4;
                switch (self._) {
                    case 'List.cons':
                        var $379 = self.head;
                        var $380 = self.tail;
                        var $381 = (_eql$2($376)($379) && List$eql$(_eql$2, $377, $380));
                        var $378 = $381;
                        break;
                    case 'List.nil':
                        var $382 = Bool$false;
                        var $378 = $382;
                        break;
                };
                var $375 = $378;
                break;
            case 'List.nil':
                var self = _b$4;
                switch (self._) {
                    case 'List.nil':
                        var $384 = Bool$true;
                        var $383 = $384;
                        break;
                    case 'List.cons':
                        var $385 = Bool$false;
                        var $383 = $385;
                        break;
                };
                var $375 = $383;
                break;
        };
        return $375;
    };
    const List$eql = x0 => x1 => x2 => List$eql$(x0, x1, x2);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Senhas$loope$(_senha$1, _tentativas$2) {
        var $386 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $387 = _m$bind$3;
            return $387;
        }))(IO$prompt$(("\u{a}Voc\u{ea} tem: " + (Nat$show$((_tentativas$2 + 1n)) + (" tentativas." + " Escolha 4 n\u{fa}meros:")))))((_line$3 => {
            var _user_nums$4 = Senhas$read_input$(_line$3);
            var _user_try$5 = Senhas$resposta$(_senha$1, _user_nums$4, _senha$1);
            var self = Senha$confirma$(_user_nums$4);
            if (self) {
                var $389 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $390 = _m$bind$6;
                    return $390;
                }))(IO$print$("Sua resposta est\u{e1}:"))((_$6 => {
                    var $391 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                        var $392 = _m$bind$7;
                        return $392;
                    }))(IO$print$(String$join$("", _user_try$5)))((_$7 => {
                        var self = List$eql$(Nat$eql, _user_nums$4, _senha$1);
                        if (self) {
                            var $394 = IO$print$("Parab\u{e9}ns, voc\u{ea} venceu!");
                            var $393 = $394;
                        } else {
                            var self = (_tentativas$2 === 0n);
                            if (self) {
                                var $396 = IO$print$("Infelizmente, voc\u{ea} perdeu");
                                var $395 = $396;
                            } else {
                                var $397 = Senhas$loope$(_senha$1, (_tentativas$2 - 1n <= 0n ? 0n : _tentativas$2 - 1n));
                                var $395 = $397;
                            };
                            var $393 = $395;
                        };
                        return $393;
                    }));
                    return $391;
                }));
                var $388 = $389;
            } else {
                var $398 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $399 = _m$bind$6;
                    return $399;
                }))(IO$print$("Seu input n\u{e3}o foi v\u{e1}lido, tente novamente"))((_$6 => {
                    var $400 = Senhas$loope$(_senha$1, _tentativas$2);
                    return $400;
                }));
                var $388 = $398;
            };
            return $388;
        }));
        return $386;
    };
    const Senhas$loope = x0 => x1 => Senhas$loope$(x0, x1);
    const Senhas = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $401 = _m$bind$1;
        return $401;
    }))(IO$random$(10n))((_num$1 => {
        var $402 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $403 = _m$bind$2;
            return $403;
        }))(IO$randoms$(4n, 10n))((_num_1$2 => {
            var _lista$3 = List$cons$(1n, List$cons$(2n, List$cons$(3n, List$cons$(4n, List$cons$(5n, List$cons$(6n, List$cons$(7n, List$cons$(8n, List$cons$(9n, List$cons$(0n, List$nil))))))))));
            var $404 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $405 = _m$bind$4;
                return $405;
            }))(IO$randoms$(6n, 10n))((_lista1$4 => {
                var _senha$5 = List$random$(_num_1$2, _lista$3, List$nil);
                var $406 = Senhas$loope$(_senha$5, 4n);
                return $406;
            }));
            return $404;
        }));
        return $402;
    }));
    const User$Sipher$Senhas = Senhas;

    function App$new$(_init$2, _draw$3, _when$4) {
        var $407 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $407;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Senhas = (() => {
        var _draw$1 = (_state$1 => {
            var $409 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Bem-vindo ao joguinho das senhas! Instru\u{e7}\u{f5}es:"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("... TODO :) ..."), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Aperte qualquer tecla para come\u{e7}ar."), List$nil)), List$nil))));
            return $409;
        });
        var _when$2 = (_event$2 => _state$3 => {
            var self = _event$2;
            switch (self._) {
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.dom':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                case 'App.Event.post':
                case 'App.Event.mouse_over':
                    var $411 = App$pass;
                    var $410 = $411;
                    break;
                case 'App.Event.key_down':
                    var $412 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $413 = _m$bind$6;
                        return $413;
                    }))(User$Sipher$Senhas)((_$6 => {
                        var $414 = App$pass;
                        return $414;
                    }));
                    var $410 = $412;
                    break;
            };
            return $410;
        });
        var $408 = App$new$(Unit$new, _draw$1, _when$2);
        return $408;
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