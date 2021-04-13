(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[987],{

/***/ 987:
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

    function Buffer32$new$(_depth$1, _array$2) {
        var $33 = u32array_to_buffer32(_array$2);
        return $33;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $34 = null;
        return $34;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $35 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $35;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $36 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $36;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $38 = Array$tip$(_x$3);
            var $37 = $38;
        } else {
            var $39 = (self - 1n);
            var _half$5 = Array$alloc$($39, _x$3);
            var $40 = Array$tie$(_half$5, _half$5);
            var $37 = $40;
        };
        return $37;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $41 = word_to_u32(_value$1);
        return $41;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $42 = null;
        return $42;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $43 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $43;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $45 = Word$e;
            var $44 = $45;
        } else {
            var $46 = (self - 1n);
            var $47 = Word$o$(Word$zero$($46));
            var $44 = $47;
        };
        return $44;
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
                var $49 = Bool$false;
                var $48 = $49;
                break;
            case 'Cmp.eql':
                var $50 = Bool$true;
                var $48 = $50;
                break;
        };
        return $48;
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
                var $52 = self.pred;
                var $53 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $55 = self.pred;
                            var $56 = (_a$pred$10 => {
                                var $57 = Word$cmp$go$(_a$pred$10, $55, _c$4);
                                return $57;
                            });
                            var $54 = $56;
                            break;
                        case 'Word.i':
                            var $58 = self.pred;
                            var $59 = (_a$pred$10 => {
                                var $60 = Word$cmp$go$(_a$pred$10, $58, Cmp$ltn);
                                return $60;
                            });
                            var $54 = $59;
                            break;
                        case 'Word.e':
                            var $61 = (_a$pred$8 => {
                                var $62 = _c$4;
                                return $62;
                            });
                            var $54 = $61;
                            break;
                    };
                    var $54 = $54($52);
                    return $54;
                });
                var $51 = $53;
                break;
            case 'Word.i':
                var $63 = self.pred;
                var $64 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $66 = self.pred;
                            var $67 = (_a$pred$10 => {
                                var $68 = Word$cmp$go$(_a$pred$10, $66, Cmp$gtn);
                                return $68;
                            });
                            var $65 = $67;
                            break;
                        case 'Word.i':
                            var $69 = self.pred;
                            var $70 = (_a$pred$10 => {
                                var $71 = Word$cmp$go$(_a$pred$10, $69, _c$4);
                                return $71;
                            });
                            var $65 = $70;
                            break;
                        case 'Word.e':
                            var $72 = (_a$pred$8 => {
                                var $73 = _c$4;
                                return $73;
                            });
                            var $65 = $72;
                            break;
                    };
                    var $65 = $65($63);
                    return $65;
                });
                var $51 = $64;
                break;
            case 'Word.e':
                var $74 = (_b$5 => {
                    var $75 = _c$4;
                    return $75;
                });
                var $51 = $74;
                break;
        };
        var $51 = $51(_b$3);
        return $51;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $76 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $76;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $77 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $77;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $78 = 1n + _pred$1;
        return $78;
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
                    var $79 = _x$4;
                    return $79;
                } else {
                    var $80 = (self - 1n);
                    var $81 = Nat$apply$($80, _f$3, _f$3(_x$4));
                    return $81;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$i$(_pred$2) {
        var $82 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $82;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $84 = self.pred;
                var $85 = Word$i$($84);
                var $83 = $85;
                break;
            case 'Word.i':
                var $86 = self.pred;
                var $87 = Word$o$(Word$inc$($86));
                var $83 = $87;
                break;
            case 'Word.e':
                var $88 = Word$e;
                var $83 = $88;
                break;
        };
        return $83;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function U32$inc$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $90 = u32_to_word(self);
                var $91 = U32$new$(Word$inc$($90));
                var $89 = $91;
                break;
        };
        return $89;
    };
    const U32$inc = x0 => U32$inc$(x0);
    const Nat$to_u32 = a0 => (Number(a0));
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function U32$needed_depth$go$(_n$1) {
        var self = (_n$1 === 0);
        if (self) {
            var $93 = 0n;
            var $92 = $93;
        } else {
            var $94 = Nat$succ$(U32$needed_depth$go$((_n$1 >>> 1)));
            var $92 = $94;
        };
        return $92;
    };
    const U32$needed_depth$go = x0 => U32$needed_depth$go$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $96 = self.pred;
                var $97 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $99 = self.pred;
                            var $100 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $102 = Word$i$(Word$subber$(_a$pred$10, $99, Bool$true));
                                    var $101 = $102;
                                } else {
                                    var $103 = Word$o$(Word$subber$(_a$pred$10, $99, Bool$false));
                                    var $101 = $103;
                                };
                                return $101;
                            });
                            var $98 = $100;
                            break;
                        case 'Word.i':
                            var $104 = self.pred;
                            var $105 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $107 = Word$o$(Word$subber$(_a$pred$10, $104, Bool$true));
                                    var $106 = $107;
                                } else {
                                    var $108 = Word$i$(Word$subber$(_a$pred$10, $104, Bool$true));
                                    var $106 = $108;
                                };
                                return $106;
                            });
                            var $98 = $105;
                            break;
                        case 'Word.e':
                            var $109 = (_a$pred$8 => {
                                var $110 = Word$e;
                                return $110;
                            });
                            var $98 = $109;
                            break;
                    };
                    var $98 = $98($96);
                    return $98;
                });
                var $95 = $97;
                break;
            case 'Word.i':
                var $111 = self.pred;
                var $112 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $114 = self.pred;
                            var $115 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $117 = Word$o$(Word$subber$(_a$pred$10, $114, Bool$false));
                                    var $116 = $117;
                                } else {
                                    var $118 = Word$i$(Word$subber$(_a$pred$10, $114, Bool$false));
                                    var $116 = $118;
                                };
                                return $116;
                            });
                            var $113 = $115;
                            break;
                        case 'Word.i':
                            var $119 = self.pred;
                            var $120 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $122 = Word$i$(Word$subber$(_a$pred$10, $119, Bool$true));
                                    var $121 = $122;
                                } else {
                                    var $123 = Word$o$(Word$subber$(_a$pred$10, $119, Bool$false));
                                    var $121 = $123;
                                };
                                return $121;
                            });
                            var $113 = $120;
                            break;
                        case 'Word.e':
                            var $124 = (_a$pred$8 => {
                                var $125 = Word$e;
                                return $125;
                            });
                            var $113 = $124;
                            break;
                    };
                    var $113 = $113($111);
                    return $113;
                });
                var $95 = $112;
                break;
            case 'Word.e':
                var $126 = (_b$5 => {
                    var $127 = Word$e;
                    return $127;
                });
                var $95 = $126;
                break;
        };
        var $95 = $95(_b$3);
        return $95;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $128 = Word$subber$(_a$2, _b$3, Bool$false);
        return $128;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function U32$needed_depth$(_size$1) {
        var $129 = U32$needed_depth$go$((Math.max(_size$1 - 1, 0)));
        return $129;
    };
    const U32$needed_depth = x0 => U32$needed_depth$(x0);

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $131 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $133 = Word$i$(Word$shift_left1$aux$($131, Bool$false));
                    var $132 = $133;
                } else {
                    var $134 = Word$o$(Word$shift_left1$aux$($131, Bool$false));
                    var $132 = $134;
                };
                var $130 = $132;
                break;
            case 'Word.i':
                var $135 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $137 = Word$i$(Word$shift_left1$aux$($135, Bool$true));
                    var $136 = $137;
                } else {
                    var $138 = Word$o$(Word$shift_left1$aux$($135, Bool$true));
                    var $136 = $138;
                };
                var $130 = $136;
                break;
            case 'Word.e':
                var $139 = Word$e;
                var $130 = $139;
                break;
        };
        return $130;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $141 = self.pred;
                var $142 = Word$o$(Word$shift_left1$aux$($141, Bool$false));
                var $140 = $142;
                break;
            case 'Word.i':
                var $143 = self.pred;
                var $144 = Word$o$(Word$shift_left1$aux$($143, Bool$true));
                var $140 = $144;
                break;
            case 'Word.e':
                var $145 = Word$e;
                var $140 = $145;
                break;
        };
        return $140;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $147 = self.pred;
                var $148 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $150 = self.pred;
                            var $151 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $153 = Word$i$(Word$adder$(_a$pred$10, $150, Bool$false));
                                    var $152 = $153;
                                } else {
                                    var $154 = Word$o$(Word$adder$(_a$pred$10, $150, Bool$false));
                                    var $152 = $154;
                                };
                                return $152;
                            });
                            var $149 = $151;
                            break;
                        case 'Word.i':
                            var $155 = self.pred;
                            var $156 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $158 = Word$o$(Word$adder$(_a$pred$10, $155, Bool$true));
                                    var $157 = $158;
                                } else {
                                    var $159 = Word$i$(Word$adder$(_a$pred$10, $155, Bool$false));
                                    var $157 = $159;
                                };
                                return $157;
                            });
                            var $149 = $156;
                            break;
                        case 'Word.e':
                            var $160 = (_a$pred$8 => {
                                var $161 = Word$e;
                                return $161;
                            });
                            var $149 = $160;
                            break;
                    };
                    var $149 = $149($147);
                    return $149;
                });
                var $146 = $148;
                break;
            case 'Word.i':
                var $162 = self.pred;
                var $163 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $165 = self.pred;
                            var $166 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $168 = Word$o$(Word$adder$(_a$pred$10, $165, Bool$true));
                                    var $167 = $168;
                                } else {
                                    var $169 = Word$i$(Word$adder$(_a$pred$10, $165, Bool$false));
                                    var $167 = $169;
                                };
                                return $167;
                            });
                            var $164 = $166;
                            break;
                        case 'Word.i':
                            var $170 = self.pred;
                            var $171 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $173 = Word$i$(Word$adder$(_a$pred$10, $170, Bool$true));
                                    var $172 = $173;
                                } else {
                                    var $174 = Word$o$(Word$adder$(_a$pred$10, $170, Bool$true));
                                    var $172 = $174;
                                };
                                return $172;
                            });
                            var $164 = $171;
                            break;
                        case 'Word.e':
                            var $175 = (_a$pred$8 => {
                                var $176 = Word$e;
                                return $176;
                            });
                            var $164 = $175;
                            break;
                    };
                    var $164 = $164($162);
                    return $164;
                });
                var $146 = $163;
                break;
            case 'Word.e':
                var $177 = (_b$5 => {
                    var $178 = Word$e;
                    return $178;
                });
                var $146 = $177;
                break;
        };
        var $146 = $146(_b$3);
        return $146;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $179 = Word$adder$(_a$2, _b$3, Bool$false);
        return $179;
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
                        var $180 = self.pred;
                        var $181 = Word$mul$go$($180, Word$shift_left1$(_b$4), _acc$5);
                        return $181;
                    case 'Word.i':
                        var $182 = self.pred;
                        var $183 = Word$mul$go$($182, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $183;
                    case 'Word.e':
                        var $184 = _acc$5;
                        return $184;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul$go = x0 => x1 => x2 => Word$mul$go$(x0, x1, x2);

    function Word$to_zero$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $186 = self.pred;
                var $187 = Word$o$(Word$to_zero$($186));
                var $185 = $187;
                break;
            case 'Word.i':
                var $188 = self.pred;
                var $189 = Word$o$(Word$to_zero$($188));
                var $185 = $189;
                break;
            case 'Word.e':
                var $190 = Word$e;
                var $185 = $190;
                break;
        };
        return $185;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $191 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $191;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $192 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $192;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $193 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $193;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $194 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $194;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $196 = self.fst;
                var $197 = $196;
                var $195 = $197;
                break;
        };
        return $195;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $199 = self.snd;
                var $200 = $199;
                var $198 = $200;
                break;
        };
        return $198;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $202 = self.pred;
                var $203 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $205 = self.pred;
                            var $206 = (_a$pred$9 => {
                                var $207 = Word$o$(Word$or$(_a$pred$9, $205));
                                return $207;
                            });
                            var $204 = $206;
                            break;
                        case 'Word.i':
                            var $208 = self.pred;
                            var $209 = (_a$pred$9 => {
                                var $210 = Word$i$(Word$or$(_a$pred$9, $208));
                                return $210;
                            });
                            var $204 = $209;
                            break;
                        case 'Word.e':
                            var $211 = (_a$pred$7 => {
                                var $212 = Word$e;
                                return $212;
                            });
                            var $204 = $211;
                            break;
                    };
                    var $204 = $204($202);
                    return $204;
                });
                var $201 = $203;
                break;
            case 'Word.i':
                var $213 = self.pred;
                var $214 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $216 = self.pred;
                            var $217 = (_a$pred$9 => {
                                var $218 = Word$i$(Word$or$(_a$pred$9, $216));
                                return $218;
                            });
                            var $215 = $217;
                            break;
                        case 'Word.i':
                            var $219 = self.pred;
                            var $220 = (_a$pred$9 => {
                                var $221 = Word$i$(Word$or$(_a$pred$9, $219));
                                return $221;
                            });
                            var $215 = $220;
                            break;
                        case 'Word.e':
                            var $222 = (_a$pred$7 => {
                                var $223 = Word$e;
                                return $223;
                            });
                            var $215 = $222;
                            break;
                    };
                    var $215 = $215($213);
                    return $215;
                });
                var $201 = $214;
                break;
            case 'Word.e':
                var $224 = (_b$4 => {
                    var $225 = Word$e;
                    return $225;
                });
                var $201 = $224;
                break;
        };
        var $201 = $201(_b$3);
        return $201;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $226 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $226;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $227 = null;
        return $227;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $228 = null;
        return $228;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $229 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $229;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $230 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $230;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $232 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $234 = self.val;
                        var $235 = self.lft;
                        var $236 = self.rgt;
                        var $237 = BitsMap$tie$($234, BitsMap$set$($232, _val$3, $235), $236);
                        var $233 = $237;
                        break;
                    case 'BitsMap.new':
                        var $238 = BitsMap$tie$(Maybe$none, BitsMap$set$($232, _val$3, BitsMap$new), BitsMap$new);
                        var $233 = $238;
                        break;
                };
                var $231 = $233;
                break;
            case 'i':
                var $239 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $241 = self.val;
                        var $242 = self.lft;
                        var $243 = self.rgt;
                        var $244 = BitsMap$tie$($241, $242, BitsMap$set$($239, _val$3, $243));
                        var $240 = $244;
                        break;
                    case 'BitsMap.new':
                        var $245 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($239, _val$3, BitsMap$new));
                        var $240 = $245;
                        break;
                };
                var $231 = $240;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $247 = self.lft;
                        var $248 = self.rgt;
                        var $249 = BitsMap$tie$(Maybe$some$(_val$3), $247, $248);
                        var $246 = $249;
                        break;
                    case 'BitsMap.new':
                        var $250 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $246 = $250;
                        break;
                };
                var $231 = $246;
                break;
        };
        return $231;
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
                var $252 = self.pred;
                var $253 = (Word$to_bits$($252) + '0');
                var $251 = $253;
                break;
            case 'Word.i':
                var $254 = self.pred;
                var $255 = (Word$to_bits$($254) + '1');
                var $251 = $255;
                break;
            case 'Word.e':
                var $256 = Bits$e;
                var $251 = $256;
                break;
        };
        return $251;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $258 = Bits$e;
            var $257 = $258;
        } else {
            var $259 = self.charCodeAt(0);
            var $260 = self.slice(1);
            var $261 = (String$to_bits$($260) + (u16_to_bits($259)));
            var $257 = $261;
        };
        return $257;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $263 = self.head;
                var $264 = self.tail;
                var self = $263;
                switch (self._) {
                    case 'Pair.new':
                        var $266 = self.fst;
                        var $267 = self.snd;
                        var $268 = BitsMap$set$(String$to_bits$($266), $267, Map$from_list$($264));
                        var $265 = $268;
                        break;
                };
                var $262 = $265;
                break;
            case 'List.nil':
                var $269 = BitsMap$new;
                var $262 = $269;
                break;
        };
        return $262;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $270 = null;
        return $270;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $271 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $271;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $272 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $272;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $273 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $273;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function Word$bit_length$go$(_word$2, _c$3, _n$4) {
        var Word$bit_length$go$ = (_word$2, _c$3, _n$4) => ({
            ctr: 'TCO',
            arg: [_word$2, _c$3, _n$4]
        });
        var Word$bit_length$go = _word$2 => _c$3 => _n$4 => Word$bit_length$go$(_word$2, _c$3, _n$4);
        var arg = [_word$2, _c$3, _n$4];
        while (true) {
            let [_word$2, _c$3, _n$4] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                    case 'Word.o':
                        var $274 = self.pred;
                        var $275 = Word$bit_length$go$($274, Nat$succ$(_c$3), _n$4);
                        return $275;
                    case 'Word.i':
                        var $276 = self.pred;
                        var $277 = Word$bit_length$go$($276, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $277;
                    case 'Word.e':
                        var $278 = _n$4;
                        return $278;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $279 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $279;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Word$shift_left$(_n$2, _value$3) {
        var Word$shift_left$ = (_n$2, _value$3) => ({
            ctr: 'TCO',
            arg: [_n$2, _value$3]
        });
        var Word$shift_left = _n$2 => _value$3 => Word$shift_left$(_n$2, _value$3);
        var arg = [_n$2, _value$3];
        while (true) {
            let [_n$2, _value$3] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $280 = _value$3;
                    return $280;
                } else {
                    var $281 = (self - 1n);
                    var $282 = Word$shift_left$($281, Word$shift_left1$(_value$3));
                    return $282;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $284 = Bool$false;
                var $283 = $284;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $285 = Bool$true;
                var $283 = $285;
                break;
        };
        return $283;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $286 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $286;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $288 = self.pred;
                var $289 = Word$o$(Word$shift_right1$aux$($288));
                var $287 = $289;
                break;
            case 'Word.i':
                var $290 = self.pred;
                var $291 = Word$i$(Word$shift_right1$aux$($290));
                var $287 = $291;
                break;
            case 'Word.e':
                var $292 = Word$o$(Word$e);
                var $287 = $292;
                break;
        };
        return $287;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $294 = self.pred;
                var $295 = Word$shift_right1$aux$($294);
                var $293 = $295;
                break;
            case 'Word.i':
                var $296 = self.pred;
                var $297 = Word$shift_right1$aux$($296);
                var $293 = $297;
                break;
            case 'Word.e':
                var $298 = Word$e;
                var $293 = $298;
                break;
        };
        return $293;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5) {
        var Word$div$go$ = (_shift$2, _sub_copy$3, _shift_copy$4, _value$5) => ({
            ctr: 'TCO',
            arg: [_shift$2, _sub_copy$3, _shift_copy$4, _value$5]
        });
        var Word$div$go = _shift$2 => _sub_copy$3 => _shift_copy$4 => _value$5 => Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5);
        var arg = [_shift$2, _sub_copy$3, _shift_copy$4, _value$5];
        while (true) {
            let [_shift$2, _sub_copy$3, _shift_copy$4, _value$5] = arg;
            var R = (() => {
                var self = Word$gte$(_sub_copy$3, _shift_copy$4);
                if (self) {
                    var _mask$6 = Word$shift_left$(_shift$2, Word$inc$(Word$to_zero$(_sub_copy$3)));
                    var $299 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $299;
                } else {
                    var $300 = Pair$new$(Bool$false, _value$5);
                    var self = $300;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $301 = self.fst;
                        var $302 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $304 = $302;
                            var $303 = $304;
                        } else {
                            var $305 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $301;
                            if (self) {
                                var $307 = Word$div$go$($305, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $302);
                                var $306 = $307;
                            } else {
                                var $308 = Word$div$go$($305, _sub_copy$3, _new_shift_copy$9, $302);
                                var $306 = $308;
                            };
                            var $303 = $306;
                        };
                        return $303;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$div$go = x0 => x1 => x2 => x3 => Word$div$go$(x0, x1, x2, x3);

    function Word$div$(_a$2, _b$3) {
        var _a_bits$4 = Word$bit_length$(_a$2);
        var _b_bits$5 = Word$bit_length$(_b$3);
        var self = (_a_bits$4 < _b_bits$5);
        if (self) {
            var $310 = Word$to_zero$(_a$2);
            var $309 = $310;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $311 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $309 = $311;
        };
        return $309;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $312 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $312;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $314 = Word$e;
            var $313 = $314;
        } else {
            var $315 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $317 = self.pred;
                    var $318 = Word$o$(Word$trim$($315, $317));
                    var $316 = $318;
                    break;
                case 'Word.i':
                    var $319 = self.pred;
                    var $320 = Word$i$(Word$trim$($315, $319));
                    var $316 = $320;
                    break;
                case 'Word.e':
                    var $321 = Word$o$(Word$trim$($315, Word$e));
                    var $316 = $321;
                    break;
            };
            var $313 = $316;
        };
        return $313;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $323 = self.value;
                var $324 = $323;
                var $322 = $324;
                break;
            case 'Array.tie':
                var $325 = Unit$new;
                var $322 = $325;
                break;
        };
        return $322;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $327 = self.lft;
                var $328 = self.rgt;
                var $329 = Pair$new$($327, $328);
                var $326 = $329;
                break;
            case 'Array.tip':
                var $330 = Unit$new;
                var $326 = $330;
                break;
        };
        return $326;
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
                        var $331 = self.pred;
                        var $332 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $331);
                        return $332;
                    case 'Word.i':
                        var $333 = self.pred;
                        var $334 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $333);
                        return $334;
                    case 'Word.e':
                        var $335 = _nil$3;
                        return $335;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $336 = Word$foldl$((_arr$6 => {
            var $337 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $337;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $339 = self.fst;
                    var $340 = self.snd;
                    var $341 = Array$tie$(_rec$7($339), $340);
                    var $338 = $341;
                    break;
            };
            return $338;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $343 = self.fst;
                    var $344 = self.snd;
                    var $345 = Array$tie$($343, _rec$7($344));
                    var $342 = $345;
                    break;
            };
            return $342;
        }), _idx$3)(_arr$5);
        return $336;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $346 = Array$mut$(_idx$3, (_x$6 => {
            var $347 = _val$4;
            return $347;
        }), _arr$5);
        return $346;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $349 = self.capacity;
                var $350 = self.buffer;
                var $351 = VoxBox$new$(_length$1, $349, $350);
                var $348 = $351;
                break;
        };
        return $348;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $352 = (() => {
            var $353 = _img$7;
            var $354 = 0;
            var $355 = _siz$8;
            let _pix$12 = $353;
            for (let _idx$11 = $354; _idx$11 < $355; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = (Math.max(((_x$1 + _v_x$13) >>> 0) - _w_2$9, 0));
                var _p_y$16 = (Math.max(((_y$2 + _v_y$14) >>> 0) - _h_2$10, 0));
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $353 = _pix$19;
                _pix$12 = $353;
            };
            return _pix$12;
        })();
        return $352;
    };
    const VoxBox$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function IO$(_A$1) {
        var $356 = null;
        return $356;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $357 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $357;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $359 = self.value;
                var $360 = _f$4($359);
                var $358 = $360;
                break;
            case 'IO.ask':
                var $361 = self.query;
                var $362 = self.param;
                var $363 = self.then;
                var $364 = IO$ask$($361, $362, (_x$8 => {
                    var $365 = IO$bind$($363(_x$8), _f$4);
                    return $365;
                }));
                var $358 = $364;
                break;
        };
        return $358;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $366 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $366;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $367 = _new$2(IO$bind)(IO$end);
        return $367;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $368 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $368;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $369 = _m$pure$2;
        return $369;
    }))(Dynamic$new$(Unit$new));

    function IO$prompt$(_text$1) {
        var $370 = IO$ask$("get_line", _text$1, (_line$2 => {
            var $371 = IO$end$(_line$2);
            return $371;
        }));
        return $370;
    };
    const IO$prompt = x0 => IO$prompt$(x0);

    function IO$put_string$(_text$1) {
        var $372 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $373 = IO$end$(Unit$new);
            return $373;
        }));
        return $372;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $374 = (String.fromCharCode(_head$1) + _tail$2);
        return $374;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function IO$print$(_text$1) {
        var $375 = IO$put_string$((_text$1 + "\u{a}"));
        return $375;
    };
    const IO$print = x0 => IO$print$(x0);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$store$(_value$2) {
        var $376 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $377 = _m$pure$4;
            return $377;
        }))(Dynamic$new$(_value$2));
        return $376;
    };
    const App$store = x0 => App$store$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $378 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $378;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Demo = (() => {
        var _vbox$1 = VoxBox$alloc_capacity$(65536);
        var _init$2 = Pair$new$(128, 128);
        var _draw$3 = (_state$3 => {
            var _p_x$4 = Pair$fst$(_state$3);
            var _p_y$5 = Pair$snd$(_state$3);
            var _col$6 = (_x$6 => _y$7 => {
                var $381 = ((0 | 200 | (200 << 8) | (255 << 16) | (255 << 24)));
                return $381;
            });
            var $380 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Kind Demo App"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("- Press W/A/S/D to move"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "play_game"), List$nil)), Map$from_list$(List$cons$(Pair$new$("color", "blue"), List$cons$(Pair$new$("text-decoration", "underline"), List$nil))), List$cons$(DOM$text$("- Click here to play a game"), List$nil)), List$cons$(DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), VoxBox$Draw$square$(_p_x$4, _p_y$5, 128, 16, 16, _col$6, _vbox$1)), List$nil)))));
            return $380;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.key_down':
                    var $383 = self.code;
                    var self = _state$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $385 = self.fst;
                            var $386 = self.snd;
                            var self = ($383 === 65);
                            if (self) {
                                var $388 = App$store$(Pair$new$((Math.max($385 - 16, 0)), $386));
                                var $387 = $388;
                            } else {
                                var self = ($383 === 68);
                                if (self) {
                                    var $390 = App$store$(Pair$new$((($385 + 16) >>> 0), $386));
                                    var $389 = $390;
                                } else {
                                    var self = ($383 === 87);
                                    if (self) {
                                        var $392 = App$store$(Pair$new$($385, (Math.max($386 - 16, 0))));
                                        var $391 = $392;
                                    } else {
                                        var self = ($383 === 83);
                                        if (self) {
                                            var $394 = App$store$(Pair$new$($385, (($386 + 16) >>> 0)));
                                            var $393 = $394;
                                        } else {
                                            var $395 = App$pass;
                                            var $393 = $395;
                                        };
                                        var $391 = $393;
                                    };
                                    var $389 = $391;
                                };
                                var $387 = $389;
                            };
                            var $384 = $387;
                            break;
                    };
                    var $382 = $384;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                case 'App.Event.post':
                    var $396 = App$pass;
                    var $382 = $396;
                    break;
                case 'App.Event.dom':
                    var $397 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                        var $398 = _m$bind$9;
                        return $398;
                    }))(IO$prompt$("What is your name?"))((_line$9 => {
                        var $399 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                            var $400 = _m$bind$10;
                            return $400;
                        }))(IO$print$(("You\'re breath-taking, " + (_line$9 + "!"))))((_$10 => {
                            var $401 = App$pass;
                            return $401;
                        }));
                        return $399;
                    }));
                    var $382 = $397;
                    break;
            };
            return $382;
        });
        var $379 = App$new$(_init$2, _draw$3, _when$4);
        return $379;
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
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'VoxBox.new': VoxBox$new,
        'VoxBox.alloc_capacity': VoxBox$alloc_capacity,
        'Pair.new': Pair$new,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Col32.new': Col32$new,
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
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List.nil': List$nil,
        'Pair': Pair,
        'List.cons': List$cons,
        'DOM.text': DOM$text,
        'DOM.vbox': DOM$vbox,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Word.shift_left': Word$shift_left,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Word.shift_right1.aux': Word$shift_right1$aux,
        'Word.shift_right1': Word$shift_right1,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.for': U32$for,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'U32.add': U32$add,
        'Pos32.new': Pos32$new,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.push': VoxBox$push,
        'VoxBox.Draw.square': VoxBox$Draw$square,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'IO.prompt': IO$prompt,
        'IO.put_string': IO$put_string,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'IO.print': IO$print,
        'U16.eql': U16$eql,
        'App.store': App$store,
        'App.new': App$new,
        'Web.Demo': Web$Demo,
    };
})();

/***/ })

}]);
//# sourceMappingURL=987.index.js.map