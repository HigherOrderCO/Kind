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

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $183 = self.capacity;
                var $184 = self.buffer;
                var $185 = Image3D$new$(_length$1, $183, $184);
                var $182 = $185;
                break;
        };
        return $182;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $186 = Image3D$set_length$(0, _img$1);
        return $186;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $188 = self.pred;
                var $189 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $191 = self.pred;
                            var $192 = (_a$pred$9 => {
                                var $193 = Word$o$(Word$or$(_a$pred$9, $191));
                                return $193;
                            });
                            var $190 = $192;
                            break;
                        case 'Word.i':
                            var $194 = self.pred;
                            var $195 = (_a$pred$9 => {
                                var $196 = Word$i$(Word$or$(_a$pred$9, $194));
                                return $196;
                            });
                            var $190 = $195;
                            break;
                        case 'Word.e':
                            var $197 = (_a$pred$7 => {
                                var $198 = Word$e;
                                return $198;
                            });
                            var $190 = $197;
                            break;
                    };
                    var $190 = $190($188);
                    return $190;
                });
                var $187 = $189;
                break;
            case 'Word.i':
                var $199 = self.pred;
                var $200 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $202 = self.pred;
                            var $203 = (_a$pred$9 => {
                                var $204 = Word$i$(Word$or$(_a$pred$9, $202));
                                return $204;
                            });
                            var $201 = $203;
                            break;
                        case 'Word.i':
                            var $205 = self.pred;
                            var $206 = (_a$pred$9 => {
                                var $207 = Word$i$(Word$or$(_a$pred$9, $205));
                                return $207;
                            });
                            var $201 = $206;
                            break;
                        case 'Word.e':
                            var $208 = (_a$pred$7 => {
                                var $209 = Word$e;
                                return $209;
                            });
                            var $201 = $208;
                            break;
                    };
                    var $201 = $201($199);
                    return $201;
                });
                var $187 = $200;
                break;
            case 'Word.e':
                var $210 = (_b$4 => {
                    var $211 = Word$e;
                    return $211;
                });
                var $187 = $210;
                break;
        };
        var $187 = $187(_b$3);
        return $187;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => (a0 << a1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

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
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

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

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $213 = Word$e;
            var $212 = $213;
        } else {
            var $214 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $216 = self.pred;
                    var $217 = Word$o$(Word$trim$($214, $216));
                    var $215 = $217;
                    break;
                case 'Word.i':
                    var $218 = self.pred;
                    var $219 = Word$i$(Word$trim$($214, $218));
                    var $215 = $219;
                    break;
                case 'Word.e':
                    var $220 = Word$o$(Word$trim$($214, Word$e));
                    var $215 = $220;
                    break;
            };
            var $212 = $215;
        };
        return $212;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $222 = self.value;
                var $223 = $222;
                var $221 = $223;
                break;
            case 'Array.tie':
                var $224 = Unit$new;
                var $221 = $224;
                break;
        };
        return $221;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$(_A$1, _B$2) {
        var $225 = null;
        return $225;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $226 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $226;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

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
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Image3D$Draw$deresagon$(_cx$1, _cy$2, _cz$3, _rad$4, _col$5, _img$6) {
        var _hlf$7 = ((_rad$4 / 2) >>> 0);
        var _v0x$8 = ((_cx$1 + _rad$4) >>> 0);
        var _v0y$9 = ((_cy$2 + _hlf$7) >>> 0);
        var _v1x$10 = ((_cx$1 + _rad$4) >>> 0);
        var _v1y$11 = (Math.max(_cy$2 - _hlf$7, 0));
        var _v2x$12 = _cx$1;
        var _v2y$13 = (Math.max(_cy$2 - _rad$4, 0));
        var _v3x$14 = (Math.max(_cx$1 - _rad$4, 0));
        var _v3y$15 = (Math.max(_cy$2 - _hlf$7, 0));
        var _v4x$16 = (Math.max(_cx$1 - _rad$4, 0));
        var _v4y$17 = ((_cy$2 + _hlf$7) >>> 0);
        var _v5x$18 = _cx$1;
        var _v5y$19 = ((_cy$2 + _rad$4) >>> 0);
        var _img$20 = (() => {
            var $250 = _img$6;
            var $251 = 0;
            var $252 = _rad$4;
            let _img$21 = $250;
            for (let _i$20 = $251; _i$20 < $252; ++_i$20) {
                var _px$22 = _v1x$10;
                var _py$23 = ((_v1y$11 + _i$20) >>> 0);
                var $250 = ((_img$21.buffer[_img$21.length * 2] = ((0 | _px$22 | (_py$23 << 12) | (_cz$3 << 24))), _img$21.buffer[_img$21.length * 2 + 1] = _col$5, _img$21.length++, _img$21));
                _img$21 = $250;
            };
            return _img$21;
        })();
        var _img$21 = (() => {
            var $253 = _img$20;
            var $254 = 0;
            var $255 = _rad$4;
            let _img$22 = $253;
            for (let _i$21 = $254; _i$21 < $255; ++_i$21) {
                var _px$23 = _v3x$14;
                var _py$24 = ((_v3y$15 + _i$21) >>> 0);
                var $253 = ((_img$22.buffer[_img$22.length * 2] = ((0 | _px$23 | (_py$24 << 12) | (_cz$3 << 24))), _img$22.buffer[_img$22.length * 2 + 1] = _col$5, _img$22.length++, _img$22));
                _img$22 = $253;
            };
            return _img$22;
        })();
        var _img$22 = (() => {
            var $256 = _img$21;
            var $257 = 0;
            var $258 = _rad$4;
            let _img$23 = $256;
            for (let _i$22 = $257; _i$22 < $258; ++_i$22) {
                var _px$24 = ((_v2x$12 + _i$22) >>> 0);
                var _py$25 = ((_v2y$13 + ((_i$22 / 2) >>> 0)) >>> 0);
                var $256 = ((_img$23.buffer[_img$23.length * 2] = ((0 | _px$24 | (_py$25 << 12) | (_cz$3 << 24))), _img$23.buffer[_img$23.length * 2 + 1] = _col$5, _img$23.length++, _img$23));
                _img$23 = $256;
            };
            return _img$23;
        })();
        var _img$23 = (() => {
            var $259 = _img$22;
            var $260 = 0;
            var $261 = _rad$4;
            let _img$24 = $259;
            for (let _i$23 = $260; _i$23 < $261; ++_i$23) {
                var _px$25 = (Math.max(_v2x$12 - _i$23, 0));
                var _py$26 = ((_v2y$13 + ((_i$23 / 2) >>> 0)) >>> 0);
                var $259 = ((_img$24.buffer[_img$24.length * 2] = ((0 | _px$25 | (_py$26 << 12) | (_cz$3 << 24))), _img$24.buffer[_img$24.length * 2 + 1] = _col$5, _img$24.length++, _img$24));
                _img$24 = $259;
            };
            return _img$24;
        })();
        var _img$24 = (() => {
            var $262 = _img$23;
            var $263 = 0;
            var $264 = _rad$4;
            let _img$25 = $262;
            for (let _i$24 = $263; _i$24 < $264; ++_i$24) {
                var _px$26 = (Math.max((Math.max(_v0x$8 - _i$24, 0)) - 1, 0));
                var _py$27 = ((_v0y$9 + ((_i$24 / 2) >>> 0)) >>> 0);
                var $262 = ((_img$25.buffer[_img$25.length * 2] = ((0 | _px$26 | (_py$27 << 12) | (_cz$3 << 24))), _img$25.buffer[_img$25.length * 2 + 1] = _col$5, _img$25.length++, _img$25));
                _img$25 = $262;
            };
            return _img$25;
        })();
        var _img$25 = (() => {
            var $265 = _img$24;
            var $266 = 0;
            var $267 = _rad$4;
            let _img$26 = $265;
            for (let _i$25 = $266; _i$25 < $267; ++_i$25) {
                var _px$27 = ((((_v4x$16 + _i$25) >>> 0) + 1) >>> 0);
                var _py$28 = ((_v4y$17 + ((_i$25 / 2) >>> 0)) >>> 0);
                var $265 = ((_img$26.buffer[_img$26.length * 2] = ((0 | _px$27 | (_py$28 << 12) | (_cz$3 << 24))), _img$26.buffer[_img$26.length * 2 + 1] = _col$5, _img$26.length++, _img$26));
                _img$26 = $265;
            };
            return _img$26;
        })();
        var $249 = _img$25;
        return $249;
    };
    const Image3D$Draw$deresagon = x0 => x1 => x2 => x3 => x4 => x5 => Image3D$Draw$deresagon$(x0, x1, x2, x3, x4, x5);

    function App$Render$pix$(_pixs$1) {
        var $268 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $268;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function List$(_A$1) {
        var $269 = null;
        return $269;
    };
    const List = x0 => List$(x0);

    function App$Action$(_S$1) {
        var $270 = null;
        return $270;
    };
    const App$Action = x0 => App$Action$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$cons$(_head$2, _tail$3) {
        var $271 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $271;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function App$Action$state$(_value$2) {
        var $272 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $272;
    };
    const App$Action$state = x0 => App$Action$state$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $273 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $273;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Test = (() => {
        var _img$1 = Image3D$alloc_capacity$(65536);
        var _init$2 = 10;
        var _draw$3 = (_state$3 => {
            var _img$4 = Image3D$clear$(_img$1);
            var _col$5 = ((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24)));
            var _rad$6 = _state$3;
            var _img$7 = (() => {
                var $276 = _img$4;
                var $277 = 0;
                var $278 = 5;
                let _img$8 = $276;
                for (let _j$7 = $277; _j$7 < $278; ++_j$7) {
                    var _img$9 = (() => {
                        var $279 = _img$8;
                        var $280 = 0;
                        var $281 = 5;
                        let _img$10 = $279;
                        for (let _i$9 = $280; _i$9 < $281; ++_i$9) {
                            var _hlf$11 = ((_rad$6 / 2) >>> 0);
                            var _cx$12 = (Math.max(128 - ((_rad$6 * 4) >>> 0), 0));
                            var _cx$13 = ((_cx$12 + ((((_rad$6 * 2) >>> 0) * _i$9) >>> 0)) >>> 0);
                            var _cy$14 = (Math.max(128 - ((_hlf$11 * 5) >>> 0), 0));
                            var _cy$15 = ((_cy$14 + ((((_hlf$11 * 3) >>> 0) * _j$7) >>> 0)) >>> 0);
                            var _cy$16 = ((_cy$15 + ((_j$7 * 2) >>> 0)) >>> 0);
                            var self = ((_j$7 % 2) === 0);
                            if (self) {
                                var $282 = _cx$13;
                                var _cx$17 = $282;
                            } else {
                                var $283 = ((_cx$13 + _rad$6) >>> 0);
                                var _cx$17 = $283;
                            };
                            var $279 = Image3D$Draw$deresagon$(_cx$17, _cy$16, 0, _rad$6, _col$5, _img$10);
                            _img$10 = $279;
                        };
                        return _img$10;
                    })();
                    var $276 = _img$9;
                    _img$8 = $276;
                };
                return _img$8;
            })();
            var $275 = App$Render$pix$(_img$7);
            return $275;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.post':
                    var $285 = List$nil;
                    var $284 = $285;
                    break;
                case 'App.Event.xkey':
                    var $286 = List$cons$(App$Action$state$(((_state$5 + 1) >>> 0)), List$nil);
                    var $284 = $286;
                    break;
            };
            return $284;
        });
        var $274 = App$new$(_init$2, _draw$3, _when$4);
        return $274;
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
        'Image3D.set_length': Image3D$set_length,
        'Image3D.clear': Image3D$clear,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Col32.new': Col32$new,
        'U32.for': U32$for,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.add': U32$add,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair': Pair,
        'Pair.new': Pair$new,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'Image3D.set_pos': Image3D$set_pos,
        'Image3D.set_col': Image3D$set_col,
        'Image3D.push': Image3D$push,
        'Pos32.new': Pos32$new,
        'Image3D.Draw.deresagon': Image3D$Draw$deresagon,
        'App.Render.pix': App$Render$pix,
        'List': List,
        'App.Action': App$Action,
        'List.nil': List$nil,
        'List.cons': List$cons,
        'App.Action.state': App$Action$state,
        'App.new': App$new,
        'Web.Test': Web$Test,
    };
})();