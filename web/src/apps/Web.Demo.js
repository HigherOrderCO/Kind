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
    const inst_unit = x => x(1);
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
                var $18 = c2;
                return $18;
            } else {
                var $19 = self.charCodeAt(0);
                var $20 = self.slice(1);
                var $21 = c2($19)($20);
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

    function Buffer32$new$(_depth$1, _array$2) {
        var $27 = u32array_to_buffer32(_array$2);
        return $27;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $28 = null;
        return $28;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $29 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $29;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $30 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $30;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $32 = Array$tip$(_x$3);
            var $31 = $32;
        } else {
            var $33 = (self - 1n);
            var _half$5 = Array$alloc$($33, _x$3);
            var $34 = Array$tie$(_half$5, _half$5);
            var $31 = $34;
        };
        return $31;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $35 = word_to_u32(_value$1);
        return $35;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $36 = null;
        return $36;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $37 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $37;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $39 = Word$e;
            var $38 = $39;
        } else {
            var $40 = (self - 1n);
            var $41 = Word$o$(Word$zero$($40));
            var $38 = $41;
        };
        return $38;
    };
    const Word$zero = x0 => Word$zero$(x0);
    const U32$zero = U32$new$(Word$zero$(32n));
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));
    const Bool$false = false;
    const Bool$true = true;

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $43 = Bool$false;
                var $42 = $43;
                break;
            case 'Cmp.eql':
                var $44 = Bool$true;
                var $42 = $44;
                break;
        };
        return $42;
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
                var $46 = self.pred;
                var $47 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $49 = self.pred;
                            var $50 = (_a$pred$10 => {
                                var $51 = Word$cmp$go$(_a$pred$10, $49, _c$4);
                                return $51;
                            });
                            var $48 = $50;
                            break;
                        case 'Word.i':
                            var $52 = self.pred;
                            var $53 = (_a$pred$10 => {
                                var $54 = Word$cmp$go$(_a$pred$10, $52, Cmp$ltn);
                                return $54;
                            });
                            var $48 = $53;
                            break;
                        case 'Word.e':
                            var $55 = (_a$pred$8 => {
                                var $56 = _c$4;
                                return $56;
                            });
                            var $48 = $55;
                            break;
                    };
                    var $48 = $48($46);
                    return $48;
                });
                var $45 = $47;
                break;
            case 'Word.i':
                var $57 = self.pred;
                var $58 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $60 = self.pred;
                            var $61 = (_a$pred$10 => {
                                var $62 = Word$cmp$go$(_a$pred$10, $60, Cmp$gtn);
                                return $62;
                            });
                            var $59 = $61;
                            break;
                        case 'Word.i':
                            var $63 = self.pred;
                            var $64 = (_a$pred$10 => {
                                var $65 = Word$cmp$go$(_a$pred$10, $63, _c$4);
                                return $65;
                            });
                            var $59 = $64;
                            break;
                        case 'Word.e':
                            var $66 = (_a$pred$8 => {
                                var $67 = _c$4;
                                return $67;
                            });
                            var $59 = $66;
                            break;
                    };
                    var $59 = $59($57);
                    return $59;
                });
                var $45 = $58;
                break;
            case 'Word.e':
                var $68 = (_b$5 => {
                    var $69 = _c$4;
                    return $69;
                });
                var $45 = $68;
                break;
        };
        var $45 = $45(_b$3);
        return $45;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $70 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $70;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $71 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $71;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $72 = 1n + _pred$1;
        return $72;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U32$eql = a0 => a1 => (a0 === a1);

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
                    var $73 = _x$4;
                    return $73;
                } else {
                    var $74 = (self - 1n);
                    var $75 = Nat$apply$($74, _f$3, _f$3(_x$4));
                    return $75;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$i$(_pred$2) {
        var $76 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $76;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $78 = self.pred;
                var $79 = Word$i$($78);
                var $77 = $79;
                break;
            case 'Word.i':
                var $80 = self.pred;
                var $81 = Word$o$(Word$inc$($80));
                var $77 = $81;
                break;
            case 'Word.e':
                var $82 = Word$e;
                var $77 = $82;
                break;
        };
        return $77;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function U32$inc$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $84 = u32_to_word(self);
                var $85 = U32$new$(Word$inc$($84));
                var $83 = $85;
                break;
        };
        return $83;
    };
    const U32$inc = x0 => U32$inc$(x0);
    const Nat$to_u32 = a0 => (Number(a0));
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function U32$needed_depth$go$(_n$1) {
        var self = (_n$1 === 0);
        if (self) {
            var $87 = 0n;
            var $86 = $87;
        } else {
            var $88 = Nat$succ$(U32$needed_depth$go$((_n$1 >>> 1)));
            var $86 = $88;
        };
        return $86;
    };
    const U32$needed_depth$go = x0 => U32$needed_depth$go$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $90 = self.pred;
                var $91 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $93 = self.pred;
                            var $94 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $96 = Word$i$(Word$subber$(_a$pred$10, $93, Bool$true));
                                    var $95 = $96;
                                } else {
                                    var $97 = Word$o$(Word$subber$(_a$pred$10, $93, Bool$false));
                                    var $95 = $97;
                                };
                                return $95;
                            });
                            var $92 = $94;
                            break;
                        case 'Word.i':
                            var $98 = self.pred;
                            var $99 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $101 = Word$o$(Word$subber$(_a$pred$10, $98, Bool$true));
                                    var $100 = $101;
                                } else {
                                    var $102 = Word$i$(Word$subber$(_a$pred$10, $98, Bool$true));
                                    var $100 = $102;
                                };
                                return $100;
                            });
                            var $92 = $99;
                            break;
                        case 'Word.e':
                            var $103 = (_a$pred$8 => {
                                var $104 = Word$e;
                                return $104;
                            });
                            var $92 = $103;
                            break;
                    };
                    var $92 = $92($90);
                    return $92;
                });
                var $89 = $91;
                break;
            case 'Word.i':
                var $105 = self.pred;
                var $106 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $108 = self.pred;
                            var $109 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $111 = Word$o$(Word$subber$(_a$pred$10, $108, Bool$false));
                                    var $110 = $111;
                                } else {
                                    var $112 = Word$i$(Word$subber$(_a$pred$10, $108, Bool$false));
                                    var $110 = $112;
                                };
                                return $110;
                            });
                            var $107 = $109;
                            break;
                        case 'Word.i':
                            var $113 = self.pred;
                            var $114 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $116 = Word$i$(Word$subber$(_a$pred$10, $113, Bool$true));
                                    var $115 = $116;
                                } else {
                                    var $117 = Word$o$(Word$subber$(_a$pred$10, $113, Bool$false));
                                    var $115 = $117;
                                };
                                return $115;
                            });
                            var $107 = $114;
                            break;
                        case 'Word.e':
                            var $118 = (_a$pred$8 => {
                                var $119 = Word$e;
                                return $119;
                            });
                            var $107 = $118;
                            break;
                    };
                    var $107 = $107($105);
                    return $107;
                });
                var $89 = $106;
                break;
            case 'Word.e':
                var $120 = (_b$5 => {
                    var $121 = Word$e;
                    return $121;
                });
                var $89 = $120;
                break;
        };
        var $89 = $89(_b$3);
        return $89;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $122 = Word$subber$(_a$2, _b$3, Bool$false);
        return $122;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function U32$needed_depth$(_size$1) {
        var $123 = U32$needed_depth$go$((Math.max(_size$1 - 1, 0)));
        return $123;
    };
    const U32$needed_depth = x0 => U32$needed_depth$(x0);

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $125 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $127 = Word$i$(Word$shift_left1$aux$($125, Bool$false));
                    var $126 = $127;
                } else {
                    var $128 = Word$o$(Word$shift_left1$aux$($125, Bool$false));
                    var $126 = $128;
                };
                var $124 = $126;
                break;
            case 'Word.i':
                var $129 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $131 = Word$i$(Word$shift_left1$aux$($129, Bool$true));
                    var $130 = $131;
                } else {
                    var $132 = Word$o$(Word$shift_left1$aux$($129, Bool$true));
                    var $130 = $132;
                };
                var $124 = $130;
                break;
            case 'Word.e':
                var $133 = Word$e;
                var $124 = $133;
                break;
        };
        return $124;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $135 = self.pred;
                var $136 = Word$o$(Word$shift_left1$aux$($135, Bool$false));
                var $134 = $136;
                break;
            case 'Word.i':
                var $137 = self.pred;
                var $138 = Word$o$(Word$shift_left1$aux$($137, Bool$true));
                var $134 = $138;
                break;
            case 'Word.e':
                var $139 = Word$e;
                var $134 = $139;
                break;
        };
        return $134;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $141 = self.pred;
                var $142 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $144 = self.pred;
                            var $145 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $147 = Word$i$(Word$adder$(_a$pred$10, $144, Bool$false));
                                    var $146 = $147;
                                } else {
                                    var $148 = Word$o$(Word$adder$(_a$pred$10, $144, Bool$false));
                                    var $146 = $148;
                                };
                                return $146;
                            });
                            var $143 = $145;
                            break;
                        case 'Word.i':
                            var $149 = self.pred;
                            var $150 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $152 = Word$o$(Word$adder$(_a$pred$10, $149, Bool$true));
                                    var $151 = $152;
                                } else {
                                    var $153 = Word$i$(Word$adder$(_a$pred$10, $149, Bool$false));
                                    var $151 = $153;
                                };
                                return $151;
                            });
                            var $143 = $150;
                            break;
                        case 'Word.e':
                            var $154 = (_a$pred$8 => {
                                var $155 = Word$e;
                                return $155;
                            });
                            var $143 = $154;
                            break;
                    };
                    var $143 = $143($141);
                    return $143;
                });
                var $140 = $142;
                break;
            case 'Word.i':
                var $156 = self.pred;
                var $157 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $159 = self.pred;
                            var $160 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $162 = Word$o$(Word$adder$(_a$pred$10, $159, Bool$true));
                                    var $161 = $162;
                                } else {
                                    var $163 = Word$i$(Word$adder$(_a$pred$10, $159, Bool$false));
                                    var $161 = $163;
                                };
                                return $161;
                            });
                            var $158 = $160;
                            break;
                        case 'Word.i':
                            var $164 = self.pred;
                            var $165 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $167 = Word$i$(Word$adder$(_a$pred$10, $164, Bool$true));
                                    var $166 = $167;
                                } else {
                                    var $168 = Word$o$(Word$adder$(_a$pred$10, $164, Bool$true));
                                    var $166 = $168;
                                };
                                return $166;
                            });
                            var $158 = $165;
                            break;
                        case 'Word.e':
                            var $169 = (_a$pred$8 => {
                                var $170 = Word$e;
                                return $170;
                            });
                            var $158 = $169;
                            break;
                    };
                    var $158 = $158($156);
                    return $158;
                });
                var $140 = $157;
                break;
            case 'Word.e':
                var $171 = (_b$5 => {
                    var $172 = Word$e;
                    return $172;
                });
                var $140 = $171;
                break;
        };
        var $140 = $140(_b$3);
        return $140;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $173 = Word$adder$(_a$2, _b$3, Bool$false);
        return $173;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);

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
                        var $174 = self.pred;
                        var $175 = Word$mul$go$($174, Word$shift_left1$(_b$4), _acc$5);
                        return $175;
                    case 'Word.i':
                        var $176 = self.pred;
                        var $177 = Word$mul$go$($176, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $177;
                    case 'Word.e':
                        var $178 = _acc$5;
                        return $178;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul$go = x0 => x1 => x2 => Word$mul$go$(x0, x1, x2);

    function Word$mul$(_size$1, _a$2, _b$3) {
        var $179 = Word$mul$go$(_a$2, _b$3, Word$zero$(_size$1));
        return $179;
    };
    const Word$mul = x0 => x1 => x2 => Word$mul$(x0, x1, x2);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function Image3D$new$(_length$1, _capacity$2, _buffer$3) {
        var $180 = ({
            _: 'Image3D.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $180;
    };
    const Image3D$new = x0 => x1 => x2 => Image3D$new$(x0, x1, x2);

    function Image3D$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $181 = Image3D$new$(0, _capacity$1, _buffer$2);
        return $181;
    };
    const Image3D$alloc_capacity = x0 => Image3D$alloc_capacity$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $182 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $182;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $184 = self.pred;
                var $185 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $187 = self.pred;
                            var $188 = (_a$pred$9 => {
                                var $189 = Word$o$(Word$or$(_a$pred$9, $187));
                                return $189;
                            });
                            var $186 = $188;
                            break;
                        case 'Word.i':
                            var $190 = self.pred;
                            var $191 = (_a$pred$9 => {
                                var $192 = Word$i$(Word$or$(_a$pred$9, $190));
                                return $192;
                            });
                            var $186 = $191;
                            break;
                        case 'Word.e':
                            var $193 = (_a$pred$7 => {
                                var $194 = Word$e;
                                return $194;
                            });
                            var $186 = $193;
                            break;
                    };
                    var $186 = $186($184);
                    return $186;
                });
                var $183 = $185;
                break;
            case 'Word.i':
                var $195 = self.pred;
                var $196 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $198 = self.pred;
                            var $199 = (_a$pred$9 => {
                                var $200 = Word$i$(Word$or$(_a$pred$9, $198));
                                return $200;
                            });
                            var $197 = $199;
                            break;
                        case 'Word.i':
                            var $201 = self.pred;
                            var $202 = (_a$pred$9 => {
                                var $203 = Word$i$(Word$or$(_a$pred$9, $201));
                                return $203;
                            });
                            var $197 = $202;
                            break;
                        case 'Word.e':
                            var $204 = (_a$pred$7 => {
                                var $205 = Word$e;
                                return $205;
                            });
                            var $197 = $204;
                            break;
                    };
                    var $197 = $197($195);
                    return $197;
                });
                var $183 = $196;
                break;
            case 'Word.e':
                var $206 = (_b$4 => {
                    var $207 = Word$e;
                    return $207;
                });
                var $183 = $206;
                break;
        };
        var $183 = $183(_b$3);
        return $183;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => (a0 << a1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $209 = self.capacity;
                var $210 = self.buffer;
                var $211 = Image3D$new$(_length$1, $209, $210);
                var $208 = $211;
                break;
        };
        return $208;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $212 = Image3D$set_length$(0, _img$1);
        return $212;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);

    function Word$div$(_a$2, _b$3) {
        var Word$div$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$div = _a$2 => _b$3 => Word$div$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$div$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$mod$(_a$2, _b$3) {
        var Word$mod$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$mod = _a$2 => _b$3 => Word$mod$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$mod$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $214 = Word$e;
            var $213 = $214;
        } else {
            var $215 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $217 = self.pred;
                    var $218 = Word$o$(Word$trim$($215, $217));
                    var $216 = $218;
                    break;
                case 'Word.i':
                    var $219 = self.pred;
                    var $220 = Word$i$(Word$trim$($215, $219));
                    var $216 = $220;
                    break;
                case 'Word.e':
                    var $221 = Word$o$(Word$trim$($215, Word$e));
                    var $216 = $221;
                    break;
            };
            var $213 = $216;
        };
        return $213;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $223 = self.value;
                var $224 = $223;
                var $222 = $224;
                break;
            case 'Array.tie':
                var $225 = Unit$new;
                var $222 = $225;
                break;
        };
        return $222;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$(_A$1, _B$2) {
        var $226 = null;
        return $226;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $228 = self.lft;
                var $229 = self.rgt;
                var $230 = Pair$new$($228, $229);
                var $227 = $230;
                break;
            case 'Array.tip':
                var $231 = Unit$new;
                var $227 = $231;
                break;
        };
        return $227;
    };
    const Array$extract_tie = x0 => Array$extract_tie$(x0);

    function Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6) {
        var Word$foldl$ = (_nil$3, _w0$4, _w1$5, _word$6) => ({
            ctr: 'TCO',
            arg: [_nil$3, _w0$4, _w1$5, _word$6]
        });
        var Word$foldl = _nil$3 => _w0$4 => _w1$5 => _word$6 => Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6);
        var arg = [_nil$3, _w0$4, _w1$5, _word$6];
        while (true) {
            let [_nil$3, _w0$4, _w1$5, _word$6] = arg;
            var R = (() => {
                var self = _word$6;
                switch (self._) {
                    case 'Word.o':
                        var $232 = self.pred;
                        var $233 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $232);
                        return $233;
                    case 'Word.i':
                        var $234 = self.pred;
                        var $235 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $234);
                        return $235;
                    case 'Word.e':
                        var $236 = _nil$3;
                        return $236;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $237 = Word$foldl$((_arr$6 => {
            var $238 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $238;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $240 = self.fst;
                    var $241 = self.snd;
                    var $242 = Array$tie$(_rec$7($240), $241);
                    var $239 = $242;
                    break;
            };
            return $239;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $244 = self.fst;
                    var $245 = self.snd;
                    var $246 = Array$tie$($244, _rec$7($245));
                    var $243 = $246;
                    break;
            };
            return $243;
        }), _idx$3)(_arr$5);
        return $237;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $247 = Array$mut$(_idx$3, (_x$6 => {
            var $248 = _val$4;
            return $248;
        }), _arr$5);
        return $247;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const Image3D$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const Image3D$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const Image3D$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function Image3D$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $249 = (() => {
            var $250 = _img$7;
            var $251 = 0;
            var $252 = _siz$8;
            let _pix$12 = $250;
            for (let _idx$11 = $251; _idx$11 < $252; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = (Math.max(((_x$1 + _v_x$13) >>> 0) - _w_2$9, 0));
                var _p_y$16 = (Math.max(((_y$2 + _v_y$14) >>> 0) - _h_2$10, 0));
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $250 = _pix$19;
                _pix$12 = $250;
            };
            return _pix$12;
        })();
        return $249;
    };
    const Image3D$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Image3D$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function App$Render$pix$(_pixs$1) {
        var $253 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $253;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function List$(_A$1) {
        var $254 = null;
        return $254;
    };
    const List = x0 => List$(x0);

    function App$Action$(_S$1) {
        var $255 = null;
        return $255;
    };
    const App$Action = x0 => App$Action$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$cons$(_head$2, _tail$3) {
        var $256 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $256;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function App$Action$state$(_value$2) {
        var $257 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $257;
    };
    const App$Action$state = x0 => App$Action$state$(x0);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $258 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $258;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Demo = (() => {
        var _img$1 = Image3D$alloc_capacity$(256);
        var _init$2 = Pair$new$(128, 128);
        var _draw$3 = (_state$3 => {
            var self = _state$3;
            switch (self._) {
                case 'Pair.new':
                    var $261 = self.fst;
                    var $262 = self.snd;
                    var _col$6 = (_x$6 => _y$7 => {
                        var _r$8 = ((96 + ((_x$6 * 4) >>> 0)) >>> 0);
                        var _g$9 = ((96 + ((_x$6 * 4) >>> 0)) >>> 0);
                        var _b$10 = 128;
                        var _a$11 = 255;
                        var $264 = ((0 | _r$8 | (_g$9 << 8) | (_b$10 << 16) | (_a$11 << 24)));
                        return $264;
                    });
                    var _img$7 = Image3D$clear$(_img$1);
                    var _img$8 = Image3D$Draw$square$($261, $262, 128, 16, 16, _col$6, _img$7);
                    var $263 = App$Render$pix$(_img$8);
                    var $260 = $263;
                    break;
            };
            return $260;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.xkey':
                    var $266 = self.down;
                    var $267 = self.code;
                    var self = $266;
                    if (self) {
                        var $269 = List$cons$(App$Action$state$((() => {
                            var self = _state$5;
                            switch (self._) {
                                case 'Pair.new':
                                    var $270 = self.fst;
                                    var $271 = self.snd;
                                    var self = ($267 === 65);
                                    if (self) {
                                        var $273 = Pair$new$((Math.max($270 - 4, 0)), $271);
                                        var $272 = $273;
                                    } else {
                                        var self = ($267 === 68);
                                        if (self) {
                                            var $275 = Pair$new$((($270 + 4) >>> 0), $271);
                                            var $274 = $275;
                                        } else {
                                            var self = ($267 === 87);
                                            if (self) {
                                                var $277 = Pair$new$($270, (Math.max($271 - 4, 0)));
                                                var $276 = $277;
                                            } else {
                                                var self = ($267 === 83);
                                                if (self) {
                                                    var $279 = Pair$new$($270, (($271 + 4) >>> 0));
                                                    var $278 = $279;
                                                } else {
                                                    var $280 = Pair$new$($270, $271);
                                                    var $278 = $280;
                                                };
                                                var $276 = $278;
                                            };
                                            var $274 = $276;
                                        };
                                        var $272 = $274;
                                    };
                                    return $272;
                            };
                        })()), List$nil);
                        var $268 = $269;
                    } else {
                        var $281 = List$nil;
                        var $268 = $281;
                    };
                    var $265 = $268;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.post':
                    var $282 = List$nil;
                    var $265 = $282;
                    break;
            };
            return $265;
        });
        var $259 = App$new$(_init$2, _draw$3, _when$4);
        return $259;
    })();
    return {
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'U32.new': U32$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.o': Word$o,
        'Word.zero': Word$zero,
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U32.eql': U32$eql,
        'Nat.apply': Nat$apply,
        'Word.i': Word$i,
        'Word.inc': Word$inc,
        'U32.inc': U32$inc,
        'Nat.to_u32': Nat$to_u32,
        'U32.shr': U32$shr,
        'U32.needed_depth.go': U32$needed_depth$go,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U32.sub': U32$sub,
        'U32.needed_depth': U32$needed_depth,
        'Word.shift_left1.aux': Word$shift_left1$aux,
        'Word.shift_left1': Word$shift_left1,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'Word.mul.go': Word$mul$go,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'Image3D.new': Image3D$new,
        'Image3D.alloc_capacity': Image3D$alloc_capacity,
        'Pair.new': Pair$new,
        'U32.add': U32$add,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Col32.new': Col32$new,
        'Image3D.set_length': Image3D$set_length,
        'Image3D.clear': Image3D$clear,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.for': U32$for,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Pos32.new': Pos32$new,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair': Pair,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'Image3D.set_pos': Image3D$set_pos,
        'Image3D.set_col': Image3D$set_col,
        'Image3D.push': Image3D$push,
        'Image3D.Draw.square': Image3D$Draw$square,
        'App.Render.pix': App$Render$pix,
        'List': List,
        'App.Action': App$Action,
        'List.nil': List$nil,
        'List.cons': List$cons,
        'App.Action.state': App$Action$state,
        'U16.eql': U16$eql,
        'App.new': App$new,
        'Web.Demo': Web$Demo,
    };
})();