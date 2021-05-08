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
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $11 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $9 = u16_to_word(self);
                    var $10 = c0($9);
                    return $10;
            };
        })();
        return $11;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $14 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $12 = u32_to_word(self);
                    var $13 = c0($12);
                    return $13;
            };
        })();
        return $14;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $17 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $15 = u64_to_word(self);
                    var $16 = c0($15);
                    return $16;
            };
        })();
        return $17;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $22 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $18 = c0;
                return $18;
            } else {
                var $19 = self.charCodeAt(0);
                var $20 = self.slice(1);
                var $21 = c1($19)($20);
                return $21;
            };
        })();
        return $22;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $26 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $23 = buffer32_to_depth(self);
                    var $24 = buffer32_to_u32array(self);
                    var $25 = c0($23)($24);
                    return $25;
            };
        })();
        return $26;
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $27 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $27;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function List$cons$(_head$2, _tail$3) {
        var $28 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $28;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $29 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $29;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function IO$(_A$1) {
        var $30 = null;
        return $30;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $31 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $31;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $33 = self.value;
                var $34 = _f$4($33);
                var $32 = $34;
                break;
            case 'IO.ask':
                var $35 = self.query;
                var $36 = self.param;
                var $37 = self.then;
                var $38 = IO$ask$($35, $36, (_x$8 => {
                    var $39 = IO$bind$($37(_x$8), _f$4);
                    return $39;
                }));
                var $32 = $38;
                break;
        };
        return $32;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $40 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $40;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $41 = _new$2(IO$bind)(IO$end);
        return $41;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $42 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $42;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $43 = _m$pure$2;
        return $43;
    }))(Dynamic$new$(Unit$new));

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $44 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $44;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Maybe$(_A$1) {
        var $45 = null;
        return $45;
    };
    const Maybe = x0 => Maybe$(x0);

    function Maybe$some$(_value$2) {
        var $46 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $46;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $48 = self.val;
                var $49 = Maybe$some$($48);
                var $47 = $49;
                break;
            case 'Parser.Reply.error':
                var $50 = Maybe$none;
                var $47 = $50;
                break;
        };
        return $47;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $51 = null;
        return $51;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function List$(_A$1) {
        var $52 = null;
        return $52;
    };
    const List = x0 => List$(x0);

    function Parser$Reply$error$(_err$2) {
        var $53 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $53;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);
    const Bool$false = false;
    const Bool$true = true;
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $55 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $57 = self.idx;
                        var self = ($55 > $57);
                        if (self) {
                            var $59 = _a$1;
                            var $58 = $59;
                        } else {
                            var $60 = _b$2;
                            var $58 = $60;
                        };
                        var $56 = $58;
                        break;
                };
                var $54 = $56;
                break;
        };
        return $54;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $62 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $64 = self.value;
                        var $65 = Maybe$some$(Parser$Error$combine$($62, $64));
                        var $63 = $65;
                        break;
                    case 'Maybe.none':
                        var $66 = _a$1;
                        var $63 = $66;
                        break;
                };
                var $61 = $63;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $68 = Maybe$none;
                        var $67 = $68;
                        break;
                    case 'Maybe.some':
                        var $69 = _b$2;
                        var $67 = $69;
                        break;
                };
                var $61 = $67;
                break;
        };
        return $61;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $70 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $70;
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
                                var $72 = self.pst;
                                var $73 = self.val;
                                var $74 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $75 = _values$3(List$cons$($73, _xs$12));
                                    return $75;
                                }), $72);
                                var $71 = $74;
                                break;
                            case 'Parser.Reply.error':
                                var $76 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $71 = $76;
                                break;
                        };
                        return $71;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $77 = Parser$many$go(_parser$2)((_x$3 => {
            var $78 = _x$3;
            return $78;
        }));
        return $77;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $80 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $82 = self.err;
                        var self = $80;
                        switch (self._) {
                            case 'Maybe.some':
                                var $84 = self.value;
                                var $85 = Parser$Reply$error$(Parser$Error$combine$($84, $82));
                                var $83 = $85;
                                break;
                            case 'Maybe.none':
                                var $86 = Parser$Reply$error$($82);
                                var $83 = $86;
                                break;
                        };
                        var $81 = $83;
                        break;
                    case 'Parser.Reply.value':
                        var $87 = self.pst;
                        var $88 = self.val;
                        var self = $87;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $90 = self.err;
                                var $91 = self.nam;
                                var $92 = self.ini;
                                var $93 = self.idx;
                                var $94 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($80, $90), $91, $92, $93, $94);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $96 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $98 = self.err;
                                                var self = $96;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $100 = self.value;
                                                        var $101 = Parser$Reply$error$(Parser$Error$combine$($100, $98));
                                                        var $99 = $101;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $102 = Parser$Reply$error$($98);
                                                        var $99 = $102;
                                                        break;
                                                };
                                                var $97 = $99;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $103 = self.pst;
                                                var $104 = self.val;
                                                var self = $103;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $106 = self.err;
                                                        var $107 = self.nam;
                                                        var $108 = self.ini;
                                                        var $109 = self.idx;
                                                        var $110 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($96, $106), $107, $108, $109, $110);
                                                        var $111 = Parser$Reply$value$(_reply$pst$31, List$cons$($88, $104));
                                                        var $105 = $111;
                                                        break;
                                                };
                                                var $97 = $105;
                                                break;
                                        };
                                        var $95 = $97;
                                        break;
                                };
                                var $89 = $95;
                                break;
                        };
                        var $81 = $89;
                        break;
                };
                var $79 = $81;
                break;
        };
        return $79;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $112 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $112;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $113 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $113;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);

    function Nat$succ$(_pred$1) {
        var $114 = 1n + _pred$1;
        return $114;
    };
    const Nat$succ = x0 => Nat$succ$(x0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $116 = Bool$false;
                var $115 = $116;
                break;
            case 'Cmp.eql':
                var $117 = Bool$true;
                var $115 = $117;
                break;
        };
        return $115;
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
                var $119 = self.pred;
                var $120 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $122 = self.pred;
                            var $123 = (_a$pred$10 => {
                                var $124 = Word$cmp$go$(_a$pred$10, $122, _c$4);
                                return $124;
                            });
                            var $121 = $123;
                            break;
                        case 'Word.i':
                            var $125 = self.pred;
                            var $126 = (_a$pred$10 => {
                                var $127 = Word$cmp$go$(_a$pred$10, $125, Cmp$ltn);
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
                var $118 = $120;
                break;
            case 'Word.i':
                var $130 = self.pred;
                var $131 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $133 = self.pred;
                            var $134 = (_a$pred$10 => {
                                var $135 = Word$cmp$go$(_a$pred$10, $133, Cmp$gtn);
                                return $135;
                            });
                            var $132 = $134;
                            break;
                        case 'Word.i':
                            var $136 = self.pred;
                            var $137 = (_a$pred$10 => {
                                var $138 = Word$cmp$go$(_a$pred$10, $136, _c$4);
                                return $138;
                            });
                            var $132 = $137;
                            break;
                        case 'Word.e':
                            var $139 = (_a$pred$8 => {
                                var $140 = _c$4;
                                return $140;
                            });
                            var $132 = $139;
                            break;
                    };
                    var $132 = $132($130);
                    return $132;
                });
                var $118 = $131;
                break;
            case 'Word.e':
                var $141 = (_b$5 => {
                    var $142 = _c$4;
                    return $142;
                });
                var $118 = $141;
                break;
        };
        var $118 = $118(_b$3);
        return $118;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $143 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $143;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $144 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $144;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const Nat$zero = 0n;
    const U16$eql = a0 => a1 => (a0 === a1);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $146 = self.err;
                var $147 = self.nam;
                var $148 = self.ini;
                var $149 = self.idx;
                var $150 = self.str;
                var self = $150;
                if (self.length === 0) {
                    var $152 = Parser$Reply$fail$($147, $148, $149, "Not a digit.");
                    var $151 = $152;
                } else {
                    var $153 = self.charCodeAt(0);
                    var $154 = self.slice(1);
                    var _pst$9 = Parser$State$new$($146, $147, $148, Nat$succ$($149), $154);
                    var self = ($153 === 48);
                    if (self) {
                        var $156 = Parser$Reply$value$(_pst$9, 0n);
                        var $155 = $156;
                    } else {
                        var self = ($153 === 49);
                        if (self) {
                            var $158 = Parser$Reply$value$(_pst$9, 1n);
                            var $157 = $158;
                        } else {
                            var self = ($153 === 50);
                            if (self) {
                                var $160 = Parser$Reply$value$(_pst$9, 2n);
                                var $159 = $160;
                            } else {
                                var self = ($153 === 51);
                                if (self) {
                                    var $162 = Parser$Reply$value$(_pst$9, 3n);
                                    var $161 = $162;
                                } else {
                                    var self = ($153 === 52);
                                    if (self) {
                                        var $164 = Parser$Reply$value$(_pst$9, 4n);
                                        var $163 = $164;
                                    } else {
                                        var self = ($153 === 53);
                                        if (self) {
                                            var $166 = Parser$Reply$value$(_pst$9, 5n);
                                            var $165 = $166;
                                        } else {
                                            var self = ($153 === 54);
                                            if (self) {
                                                var $168 = Parser$Reply$value$(_pst$9, 6n);
                                                var $167 = $168;
                                            } else {
                                                var self = ($153 === 55);
                                                if (self) {
                                                    var $170 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $169 = $170;
                                                } else {
                                                    var self = ($153 === 56);
                                                    if (self) {
                                                        var $172 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $171 = $172;
                                                    } else {
                                                        var self = ($153 === 57);
                                                        if (self) {
                                                            var $174 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $173 = $174;
                                                        } else {
                                                            var $175 = Parser$Reply$fail$($147, $148, $149, "Not a digit.");
                                                            var $173 = $175;
                                                        };
                                                        var $171 = $173;
                                                    };
                                                    var $169 = $171;
                                                };
                                                var $167 = $169;
                                            };
                                            var $165 = $167;
                                        };
                                        var $163 = $165;
                                    };
                                    var $161 = $163;
                                };
                                var $159 = $161;
                            };
                            var $157 = $159;
                        };
                        var $155 = $157;
                    };
                    var $151 = $155;
                };
                var $145 = $151;
                break;
        };
        return $145;
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
                        var $176 = self.head;
                        var $177 = self.tail;
                        var $178 = Nat$from_base$go$(_b$1, $177, (_b$1 * _p$3), (($176 * _p$3) + _res$4));
                        return $178;
                    case 'List.nil':
                        var $179 = _res$4;
                        return $179;
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
                        var $180 = self.head;
                        var $181 = self.tail;
                        var $182 = List$reverse$go$($181, List$cons$($180, _res$3));
                        return $182;
                    case 'List.nil':
                        var $183 = _res$3;
                        return $183;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $184 = List$reverse$go$(_xs$2, List$nil);
        return $184;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Nat$from_base$(_base$1, _ds$2) {
        var $185 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $185;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $187 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $189 = self.err;
                        var self = $187;
                        switch (self._) {
                            case 'Maybe.some':
                                var $191 = self.value;
                                var $192 = Parser$Reply$error$(Parser$Error$combine$($191, $189));
                                var $190 = $192;
                                break;
                            case 'Maybe.none':
                                var $193 = Parser$Reply$error$($189);
                                var $190 = $193;
                                break;
                        };
                        var $188 = $190;
                        break;
                    case 'Parser.Reply.value':
                        var $194 = self.pst;
                        var $195 = self.val;
                        var self = $194;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $197 = self.err;
                                var $198 = self.nam;
                                var $199 = self.ini;
                                var $200 = self.idx;
                                var $201 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($187, $197), $198, $199, $200, $201);
                                var $202 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $195));
                                var $196 = $202;
                                break;
                        };
                        var $188 = $196;
                        break;
                };
                var $186 = $188;
                break;
        };
        return $186;
    };
    const Parser$nat = x0 => Parser$nat$(x0);

    function Nat$read$(_str$1) {
        var _p$2 = Parser$run$(Parser$nat, _str$1);
        var self = _p$2;
        switch (self._) {
            case 'Maybe.some':
                var $204 = self.value;
                var $205 = $204;
                var $203 = $205;
                break;
            case 'Maybe.none':
                var $206 = 0n;
                var $203 = $206;
                break;
        };
        return $203;
    };
    const Nat$read = x0 => Nat$read$(x0);
    const IO$get_time = IO$ask$("get_time", "", (_time$1 => {
        var $207 = IO$end$(Nat$read$(_time$1));
        return $207;
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
                    var $208 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $208;
                } else {
                    var $209 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $211 = _r$3;
                        var $210 = $211;
                    } else {
                        var $212 = (self - 1n);
                        var $213 = Nat$mod$go$($212, $209, Nat$succ$(_r$3));
                        var $210 = $213;
                    };
                    return $210;
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
        var $214 = (((_seed$1 * _m$2) + _i$3) % _q$4);
        return $214;
    };
    const Nat$random = x0 => Nat$random$(x0);

    function IO$random$(_a$1) {
        var $215 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $216 = _m$bind$2;
            return $216;
        }))(IO$get_time)((_seed$2 => {
            var _seed$3 = Nat$random$(_seed$2);
            var $217 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $218 = _m$pure$5;
                return $218;
            }))((_seed$3 % _a$1));
            return $217;
        }));
        return $215;
    };
    const IO$random = x0 => IO$random$(x0);

    function Nat$randoms$(_len$1, _seed$2, _max$3) {
        var self = _len$1;
        if (self === 0n) {
            var $220 = List$nil;
            var $219 = $220;
        } else {
            var $221 = (self - 1n);
            var _new_seed$5 = Nat$random$(_seed$2);
            var $222 = List$cons$((_new_seed$5 % _max$3), Nat$randoms$($221, _new_seed$5, _max$3));
            var $219 = $222;
        };
        return $219;
    };
    const Nat$randoms = x0 => x1 => x2 => Nat$randoms$(x0, x1, x2);

    function IO$randoms$(_len$1, _max$2) {
        var $223 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $224 = _m$bind$3;
            return $224;
        }))(IO$get_time)((_seed$3 => {
            var $225 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $226 = _m$pure$5;
                return $226;
            }))(Nat$randoms$(_len$1, _seed$3, _max$2));
            return $225;
        }));
        return $223;
    };
    const IO$randoms = x0 => x1 => IO$randoms$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $227 = null;
        return $227;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $228 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $228;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $230 = self.head;
                var $231 = self.tail;
                var $232 = List$cons$($230, List$concat$($231, _bs$3));
                var $229 = $232;
                break;
            case 'List.nil':
                var $233 = _bs$3;
                var $229 = $233;
                break;
        };
        return $229;
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
                            var $235 = self.head;
                            var $236 = self.tail;
                            var $237 = Pair$new$(Maybe$some$($235), List$concat$(_searched_list$4, $236));
                            var $234 = $237;
                            break;
                        case 'List.nil':
                            var $238 = Pair$new$(Maybe$none, _searched_list$4);
                            var $234 = $238;
                            break;
                    };
                    return $234;
                } else {
                    var $239 = (self - 1n);
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $241 = self.head;
                            var $242 = self.tail;
                            var $243 = List$pop_at$go$($239, $242, List$concat$(_searched_list$4, List$cons$($241, List$nil)));
                            var $240 = $243;
                            break;
                        case 'List.nil':
                            var $244 = Pair$new$(Maybe$none, _searched_list$4);
                            var $240 = $244;
                            break;
                    };
                    return $240;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$pop_at$go = x0 => x1 => x2 => List$pop_at$go$(x0, x1, x2);

    function List$pop_at$(_idx$2, _list$3) {
        var $245 = List$pop_at$go$(_idx$2, _list$3, List$nil);
        return $245;
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
                        var $246 = self.head;
                        var $247 = self.tail;
                        var self = _ys$2;
                        switch (self._) {
                            case 'List.nil':
                                var $249 = List$nil;
                                var $248 = $249;
                                break;
                            case 'List.cons':
                                var _a$8 = List$pop_at$($246, _ys$2);
                                var self = _a$8;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $251 = self.fst;
                                        var $252 = self.snd;
                                        var self = $251;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $254 = self.value;
                                                var $255 = List$random$($247, $252, List$cons$($254, _zs$3));
                                                var $253 = $255;
                                                break;
                                            case 'Maybe.none':
                                                var $256 = List$random$(List$cons$((Nat$random$($246) % 10n), $247), _ys$2, _zs$3);
                                                var $253 = $256;
                                                break;
                                        };
                                        var $250 = $253;
                                        break;
                                };
                                var $248 = $250;
                                break;
                        };
                        return $248;
                    case 'List.nil':
                        var $257 = _zs$3;
                        return $257;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$random = x0 => x1 => x2 => List$random$(x0, x1, x2);

    function IO$prompt$(_text$1) {
        var $258 = IO$ask$("get_line", _text$1, (_line$2 => {
            var $259 = IO$end$(_line$2);
            return $259;
        }));
        return $258;
    };
    const IO$prompt = x0 => IO$prompt$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $260 = (String.fromCharCode(_head$1) + _tail$2);
        return $260;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $262 = self.head;
                var $263 = self.tail;
                var $264 = _cons$5($262)(List$fold$($263, _nil$4, _cons$5));
                var $261 = $264;
                break;
            case 'List.nil':
                var $265 = _nil$4;
                var $261 = $265;
                break;
        };
        return $261;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $266 = null;
        return $266;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $267 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $267;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $268 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $268;
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
                    var $269 = Either$left$(_n$1);
                    return $269;
                } else {
                    var $270 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $272 = Either$right$(Nat$succ$($270));
                        var $271 = $272;
                    } else {
                        var $273 = (self - 1n);
                        var $274 = Nat$sub_rem$($273, $270);
                        var $271 = $274;
                    };
                    return $271;
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
                        var $275 = self.value;
                        var $276 = Nat$div_mod$go$($275, _m$2, Nat$succ$(_d$3));
                        return $276;
                    case 'Either.right':
                        var $277 = Pair$new$(_d$3, _n$1);
                        return $277;
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
                        var $278 = self.fst;
                        var $279 = self.snd;
                        var self = $278;
                        if (self === 0n) {
                            var $281 = List$cons$($279, _res$3);
                            var $280 = $281;
                        } else {
                            var $282 = (self - 1n);
                            var $283 = Nat$to_base$go$(_base$1, $278, List$cons$($279, _res$3));
                            var $280 = $283;
                        };
                        return $280;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $284 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $284;
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
                        var $285 = self.head;
                        var $286 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $288 = Maybe$some$($285);
                            var $287 = $288;
                        } else {
                            var $289 = (self - 1n);
                            var $290 = List$at$($289, $286);
                            var $287 = $290;
                        };
                        return $287;
                    case 'List.nil':
                        var $291 = Maybe$none;
                        return $291;
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
                    var $294 = self.value;
                    var $295 = $294;
                    var $293 = $295;
                    break;
                case 'Maybe.none':
                    var $296 = 35;
                    var $293 = $296;
                    break;
            };
            var $292 = $293;
        } else {
            var $297 = 35;
            var $292 = $297;
        };
        return $292;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $298 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $299 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $299;
        }));
        return $298;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $300 = Nat$to_string_base$(10n, _n$1);
        return $300;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $301 = (_a$1 === _b$2);
        return $301;
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
                    var $302 = Bool$true;
                    return $302;
                } else {
                    var $303 = self.charCodeAt(0);
                    var $304 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $306 = Bool$false;
                        var $305 = $306;
                    } else {
                        var $307 = self.charCodeAt(0);
                        var $308 = self.slice(1);
                        var self = Char$eql$($303, $307);
                        if (self) {
                            var $310 = String$starts_with$($308, $304);
                            var $309 = $310;
                        } else {
                            var $311 = Bool$false;
                            var $309 = $311;
                        };
                        var $305 = $309;
                    };
                    return $305;
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
                    var $312 = _xs$2;
                    return $312;
                } else {
                    var $313 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $315 = String$nil;
                        var $314 = $315;
                    } else {
                        var $316 = self.charCodeAt(0);
                        var $317 = self.slice(1);
                        var $318 = String$drop$($313, $317);
                        var $314 = $318;
                    };
                    return $314;
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
                    var $319 = _n$2;
                    return $319;
                } else {
                    var $320 = self.charCodeAt(0);
                    var $321 = self.slice(1);
                    var $322 = String$length$go$($321, Nat$succ$(_n$2));
                    return $322;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $323 = String$length$go$(_xs$1, 0n);
        return $323;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $325 = List$cons$(_last$3, List$nil);
            var $324 = $325;
        } else {
            var $326 = self.charCodeAt(0);
            var $327 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $329 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $328 = $329;
            } else {
                var _next$6 = String$cons$($326, String$nil);
                var $330 = String$split$go$($327, _match$2, (_last$3 + _next$6));
                var $328 = $330;
            };
            var $324 = $328;
        };
        return $324;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $331 = String$split$go$(_xs$1, _match$2, "");
        return $331;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $333 = self.head;
                var $334 = self.tail;
                var $335 = List$cons$(_f$3($333), List$map$(_f$3, $334));
                var $332 = $335;
                break;
            case 'List.nil':
                var $336 = List$nil;
                var $332 = $336;
                break;
        };
        return $332;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $338 = self.head;
                var $339 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $341 = List$nil;
                    var $340 = $341;
                } else {
                    var $342 = (self - 1n);
                    var $343 = List$cons$($338, List$take$($342, $339));
                    var $340 = $343;
                };
                var $337 = $340;
                break;
            case 'List.nil':
                var $344 = List$nil;
                var $337 = $344;
                break;
        };
        return $337;
    };
    const List$take = x0 => x1 => List$take$(x0, x1);

    function Senhas$read_input$(_line$1) {
        var _split$2 = String$split$(_line$1, " ");
        var _map$3 = List$map$(Nat$read, _split$2);
        var _list$4 = List$take$(4n, _map$3);
        var $345 = _list$4;
        return $345;
    };
    const Senhas$read_input = x0 => Senhas$read_input$(x0);
    const Nat$eql = a0 => a1 => (a0 === a1);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Senha$tem_numero$(_num$1, _senha$2) {
        var _tmp$3 = List$map$(a1 => (_num$1 === a1), _senha$2);
        var _tmp$4 = List$fold$(_tmp$3, Bool$false, Bool$or);
        var $346 = _tmp$4;
        return $346;
    };
    const Senha$tem_numero = x0 => x1 => Senha$tem_numero$(x0, x1);

    function Senha$verifica$(_senha$1, _a$2, _b$3) {
        var self = _senha$1;
        switch (self._) {
            case 'List.nil':
                var $348 = "";
                var $347 = $348;
                break;
            case 'List.cons':
                var self = (_a$2 === _b$3);
                if (self) {
                    var $350 = "V ";
                    var $349 = $350;
                } else {
                    var self = Senha$tem_numero$(_b$3, _senha$1);
                    if (self) {
                        var $352 = "O ";
                        var $351 = $352;
                    } else {
                        var $353 = "X ";
                        var $351 = $353;
                    };
                    var $349 = $351;
                };
                var $347 = $349;
                break;
        };
        return $347;
    };
    const Senha$verifica = x0 => x1 => x2 => Senha$verifica$(x0, x1, x2);

    function Senhas$resposta$(_suporte$1, _senha$2, _tentativa$3) {
        var self = _tentativa$3;
        switch (self._) {
            case 'List.cons':
                var $355 = self.head;
                var $356 = self.tail;
                var self = _senha$2;
                switch (self._) {
                    case 'List.cons':
                        var $358 = self.head;
                        var $359 = self.tail;
                        var $360 = List$cons$(Senha$verifica$(_suporte$1, $355, $358), Senhas$resposta$(_suporte$1, $359, $356));
                        var $357 = $360;
                        break;
                    case 'List.nil':
                        var $361 = List$nil;
                        var $357 = $361;
                        break;
                };
                var $354 = $357;
                break;
            case 'List.nil':
                var $362 = List$nil;
                var $354 = $362;
                break;
        };
        return $354;
    };
    const Senhas$resposta = x0 => x1 => x2 => Senhas$resposta$(x0, x1, x2);

    function Senha$confirma$(_xs$1) {
        var _chck$2 = List$map$(a1 => (10n > a1), _xs$1);
        var _chck$3 = List$fold$(_chck$2, Bool$true, Bool$and);
        var $363 = _chck$3;
        return $363;
    };
    const Senha$confirma = x0 => Senha$confirma$(x0);

    function IO$put_string$(_text$1) {
        var $364 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $365 = IO$end$(Unit$new);
            return $365;
        }));
        return $364;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $366 = IO$put_string$((_text$1 + "\u{a}"));
        return $366;
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
                        var $367 = self.head;
                        var $368 = self.tail;
                        var $369 = String$flatten$go$($368, (_res$2 + $367));
                        return $369;
                    case 'List.nil':
                        var $370 = _res$2;
                        return $370;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $371 = String$flatten$go$(_xs$1, "");
        return $371;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $373 = self.head;
                var $374 = self.tail;
                var $375 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $376 = "";
                        return $376;
                    } else {
                        var $377 = _sep$1;
                        return $377;
                    };
                })(), List$cons$($373, List$cons$(String$join$go$(_sep$1, $374, Bool$false), List$nil))));
                var $372 = $375;
                break;
            case 'List.nil':
                var $378 = "";
                var $372 = $378;
                break;
        };
        return $372;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $379 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $379;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function List$eql$(_eql$2, _a$3, _b$4) {
        var self = _a$3;
        switch (self._) {
            case 'List.cons':
                var $381 = self.head;
                var $382 = self.tail;
                var self = _b$4;
                switch (self._) {
                    case 'List.cons':
                        var $384 = self.head;
                        var $385 = self.tail;
                        var $386 = (_eql$2($381)($384) && List$eql$(_eql$2, $382, $385));
                        var $383 = $386;
                        break;
                    case 'List.nil':
                        var $387 = Bool$false;
                        var $383 = $387;
                        break;
                };
                var $380 = $383;
                break;
            case 'List.nil':
                var self = _b$4;
                switch (self._) {
                    case 'List.nil':
                        var $389 = Bool$true;
                        var $388 = $389;
                        break;
                    case 'List.cons':
                        var $390 = Bool$false;
                        var $388 = $390;
                        break;
                };
                var $380 = $388;
                break;
        };
        return $380;
    };
    const List$eql = x0 => x1 => x2 => List$eql$(x0, x1, x2);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Senhas$loope$(_senha$1, _tentativas$2) {
        var $391 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $392 = _m$bind$3;
            return $392;
        }))(IO$prompt$(("\u{a}Voc\u{ea} tem: " + (Nat$show$((_tentativas$2 + 1n)) + (" tentativas." + " Escolha 4 n\u{fa}meros:")))))((_line$3 => {
            var _user_nums$4 = Senhas$read_input$(_line$3);
            var _user_try$5 = Senhas$resposta$(_senha$1, _user_nums$4, _senha$1);
            var self = Senha$confirma$(_user_nums$4);
            if (self) {
                var $394 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $395 = _m$bind$6;
                    return $395;
                }))(IO$print$("Sua resposta est\u{e1}:"))((_$6 => {
                    var $396 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                        var $397 = _m$bind$7;
                        return $397;
                    }))(IO$print$(String$join$("", _user_try$5)))((_$7 => {
                        var self = List$eql$(Nat$eql, _user_nums$4, _senha$1);
                        if (self) {
                            var $399 = IO$print$("Parab\u{e9}ns, voc\u{ea} venceu!");
                            var $398 = $399;
                        } else {
                            var self = (_tentativas$2 === 0n);
                            if (self) {
                                var $401 = IO$print$("Infelizmente, voc\u{ea} perdeu");
                                var $400 = $401;
                            } else {
                                var $402 = Senhas$loope$(_senha$1, (_tentativas$2 - 1n <= 0n ? 0n : _tentativas$2 - 1n));
                                var $400 = $402;
                            };
                            var $398 = $400;
                        };
                        return $398;
                    }));
                    return $396;
                }));
                var $393 = $394;
            } else {
                var $403 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $404 = _m$bind$6;
                    return $404;
                }))(IO$print$("Seu input n\u{e3}o foi v\u{e1}lido, tente novamente"))((_$6 => {
                    var $405 = Senhas$loope$(_senha$1, _tentativas$2);
                    return $405;
                }));
                var $393 = $403;
            };
            return $393;
        }));
        return $391;
    };
    const Senhas$loope = x0 => x1 => Senhas$loope$(x0, x1);
    const Senhas = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $406 = _m$bind$1;
        return $406;
    }))(IO$random$(10n))((_num$1 => {
        var $407 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $408 = _m$bind$2;
            return $408;
        }))(IO$randoms$(4n, 10n))((_num_1$2 => {
            var _lista$3 = List$cons$(1n, List$cons$(2n, List$cons$(3n, List$cons$(4n, List$cons$(5n, List$cons$(6n, List$cons$(7n, List$cons$(8n, List$cons$(9n, List$cons$(0n, List$nil))))))))));
            var $409 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $410 = _m$bind$4;
                return $410;
            }))(IO$randoms$(6n, 10n))((_lista1$4 => {
                var _senha$5 = List$random$(_num_1$2, _lista$3, List$nil);
                var $411 = Senhas$loope$(_senha$5, 4n);
                return $411;
            }));
            return $409;
        }));
        return $407;
    }));
    const User$Sipher$Senhas = Senhas;

    function App$new$(_init$2, _draw$3, _when$4) {
        var $412 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $412;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Senhas = (() => {
        var _draw$1 = (_state$1 => {
            var $414 = DOM$node$("div", BitsMap$new, BitsMap$new, List$cons$(DOM$node$("div", BitsMap$new, BitsMap$new, List$cons$(DOM$text$("Bem-vindo ao joguinho das senhas! Instru\u{e7}\u{f5}es:"), List$nil)), List$cons$(DOM$node$("div", BitsMap$new, BitsMap$new, List$cons$(DOM$text$("... TODO :) ..."), List$nil)), List$cons$(DOM$node$("div", BitsMap$new, BitsMap$new, List$cons$(DOM$text$("Aperte qualquer tecla para come\u{e7}ar."), List$nil)), List$nil))));
            return $414;
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
                    var $416 = App$pass;
                    var $415 = $416;
                    break;
                case 'App.Event.key_down':
                    var $417 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $418 = _m$bind$6;
                        return $418;
                    }))(User$Sipher$Senhas)((_$6 => {
                        var $419 = App$pass;
                        return $419;
                    }));
                    var $415 = $417;
                    break;
            };
            return $415;
        });
        var $413 = App$new$(Unit$new, _draw$1, _when$2);
        return $413;
    })();
    return {
        'DOM.node': DOM$node,
        'BitsMap.new': BitsMap$new,
        'List.cons': List$cons,
        'DOM.text': DOM$text,
        'List.nil': List$nil,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'Unit.new': Unit$new,
        'App.pass': App$pass,
        'Parser.State.new': Parser$State$new,
        'Maybe.none': Maybe$none,
        'Maybe': Maybe,
        'Maybe.some': Maybe$some,
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
        'Nat.succ': Nat$succ,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'Nat.zero': Nat$zero,
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
        'Pair': Pair,
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