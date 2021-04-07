(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[927],{

/***/ 927:
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
    var list_for = list => nil => cons => {
        while (list._ !== 'List.nil') {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
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

    function Word$mul$(_size$1, _a$2, _b$3) {
        var $185 = Word$mul$go$(_a$2, _b$3, Word$zero$(_size$1));
        return $185;
    };
    const Word$mul = x0 => x1 => x2 => Word$mul$(x0, x1, x2);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function Image3D$new$(_length$1, _capacity$2, _buffer$3) {
        var $186 = ({
            _: 'Image3D.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $186;
    };
    const Image3D$new = x0 => x1 => x2 => Image3D$new$(x0, x1, x2);

    function Image3D$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $187 = Image3D$new$(0, _capacity$1, _buffer$2);
        return $187;
    };
    const Image3D$alloc_capacity = x0 => Image3D$alloc_capacity$(x0);

    function Web$Kaelin$Entity$new$(_color$1) {
        var $188 = ({
            _: 'Web.Kaelin.Entity.new',
            'color': _color$1
        });
        return $188;
    };
    const Web$Kaelin$Entity$new = x0 => Web$Kaelin$Entity$new$(x0);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $190 = self.pred;
                var $191 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $193 = self.pred;
                            var $194 = (_a$pred$9 => {
                                var $195 = Word$o$(Word$or$(_a$pred$9, $193));
                                return $195;
                            });
                            var $192 = $194;
                            break;
                        case 'Word.i':
                            var $196 = self.pred;
                            var $197 = (_a$pred$9 => {
                                var $198 = Word$i$(Word$or$(_a$pred$9, $196));
                                return $198;
                            });
                            var $192 = $197;
                            break;
                        case 'Word.e':
                            var $199 = (_a$pred$7 => {
                                var $200 = Word$e;
                                return $200;
                            });
                            var $192 = $199;
                            break;
                    };
                    var $192 = $192($190);
                    return $192;
                });
                var $189 = $191;
                break;
            case 'Word.i':
                var $201 = self.pred;
                var $202 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $204 = self.pred;
                            var $205 = (_a$pred$9 => {
                                var $206 = Word$i$(Word$or$(_a$pred$9, $204));
                                return $206;
                            });
                            var $203 = $205;
                            break;
                        case 'Word.i':
                            var $207 = self.pred;
                            var $208 = (_a$pred$9 => {
                                var $209 = Word$i$(Word$or$(_a$pred$9, $207));
                                return $209;
                            });
                            var $203 = $208;
                            break;
                        case 'Word.e':
                            var $210 = (_a$pred$7 => {
                                var $211 = Word$e;
                                return $211;
                            });
                            var $203 = $210;
                            break;
                    };
                    var $203 = $203($201);
                    return $203;
                });
                var $189 = $202;
                break;
            case 'Word.e':
                var $212 = (_b$4 => {
                    var $213 = Word$e;
                    return $213;
                });
                var $189 = $212;
                break;
        };
        var $189 = $189(_b$3);
        return $189;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => (a0 << a1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $214 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $214;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);

    function BitsMap$(_A$1) {
        var $215 = null;
        return $215;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $216 = null;
        return $216;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $217 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $217;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $218 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $218;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $220 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $222 = self.val;
                        var $223 = self.lft;
                        var $224 = self.rgt;
                        var $225 = BitsMap$tie$($222, BitsMap$set$($220, _val$3, $223), $224);
                        var $221 = $225;
                        break;
                    case 'BitsMap.new':
                        var $226 = BitsMap$tie$(Maybe$none, BitsMap$set$($220, _val$3, BitsMap$new), BitsMap$new);
                        var $221 = $226;
                        break;
                };
                var $219 = $221;
                break;
            case 'i':
                var $227 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $229 = self.val;
                        var $230 = self.lft;
                        var $231 = self.rgt;
                        var $232 = BitsMap$tie$($229, $230, BitsMap$set$($227, _val$3, $231));
                        var $228 = $232;
                        break;
                    case 'BitsMap.new':
                        var $233 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($227, _val$3, BitsMap$new));
                        var $228 = $233;
                        break;
                };
                var $219 = $228;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $235 = self.lft;
                        var $236 = self.rgt;
                        var $237 = BitsMap$tie$(Maybe$some$(_val$3), $235, $236);
                        var $234 = $237;
                        break;
                    case 'BitsMap.new':
                        var $238 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $234 = $238;
                        break;
                };
                var $219 = $234;
                break;
        };
        return $219;
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
                var $240 = self.pred;
                var $241 = (Word$to_bits$($240) + '0');
                var $239 = $241;
                break;
            case 'Word.i':
                var $242 = self.pred;
                var $243 = (Word$to_bits$($242) + '1');
                var $239 = $243;
                break;
            case 'Word.e':
                var $244 = Bits$e;
                var $239 = $244;
                break;
        };
        return $239;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $246 = Bits$e;
            var $245 = $246;
        } else {
            var $247 = self.charCodeAt(0);
            var $248 = self.slice(1);
            var $249 = (String$to_bits$($248) + (u16_to_bits($247)));
            var $245 = $249;
        };
        return $245;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $251 = self.head;
                var $252 = self.tail;
                var self = $251;
                switch (self._) {
                    case 'Pair.new':
                        var $254 = self.fst;
                        var $255 = self.snd;
                        var $256 = BitsMap$set$(String$to_bits$($254), $255, Map$from_list$($252));
                        var $253 = $256;
                        break;
                };
                var $250 = $253;
                break;
            case 'List.nil':
                var $257 = BitsMap$new;
                var $250 = $257;
                break;
        };
        return $250;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$(_A$1) {
        var $258 = null;
        return $258;
    };
    const List = x0 => List$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $259 = null;
        return $259;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

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

    function Pair$new$(_fst$3, _snd$4) {
        var $275 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $275;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

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
                        var $276 = self.value;
                        var $277 = Nat$div_mod$go$($276, _m$2, Nat$succ$(_d$3));
                        return $277;
                    case 'Either.right':
                        var $278 = Pair$new$(_d$3, _n$1);
                        return $278;
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

    function List$cons$(_head$2, _tail$3) {
        var $279 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $279;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

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
                        var $280 = self.fst;
                        var $281 = self.snd;
                        var self = $280;
                        if (self === 0n) {
                            var $283 = List$cons$($281, _res$3);
                            var $282 = $283;
                        } else {
                            var $284 = (self - 1n);
                            var $285 = Nat$to_base$go$(_base$1, $280, List$cons$($281, _res$3));
                            var $282 = $285;
                        };
                        return $282;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $286 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $286;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const String$nil = '';

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
                    var $287 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $287;
                } else {
                    var $288 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $290 = _r$3;
                        var $289 = $290;
                    } else {
                        var $291 = (self - 1n);
                        var $292 = Nat$mod$go$($291, $288, Nat$succ$(_r$3));
                        var $289 = $292;
                    };
                    return $289;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const Nat$gtn = a0 => a1 => (a0 > a1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function Maybe$(_A$1) {
        var $293 = null;
        return $293;
    };
    const Maybe = x0 => Maybe$(x0);

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
                        var $294 = self.head;
                        var $295 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $297 = Maybe$some$($294);
                            var $296 = $297;
                        } else {
                            var $298 = (self - 1n);
                            var $299 = List$at$($298, $295);
                            var $296 = $299;
                        };
                        return $296;
                    case 'List.nil':
                        var $300 = Maybe$none;
                        return $300;
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
                    var $303 = self.value;
                    var $304 = $303;
                    var $302 = $304;
                    break;
                case 'Maybe.none':
                    var $305 = 35;
                    var $302 = $305;
                    break;
            };
            var $301 = $302;
        } else {
            var $306 = 35;
            var $301 = $306;
        };
        return $301;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $307 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $308 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $308;
        }));
        return $307;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $310 = self.pred;
                var $311 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $310));
                var $309 = $311;
                break;
            case 'Word.i':
                var $312 = self.pred;
                var $313 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $312));
                var $309 = $313;
                break;
            case 'Word.e':
                var $314 = _nil$3;
                var $309 = $314;
                break;
        };
        return $309;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $315 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $316 = Nat$succ$((2n * _x$4));
            return $316;
        }), _word$2);
        return $315;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function U32$to_nat$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $318 = u32_to_word(self);
                var $319 = Word$to_nat$($318);
                var $317 = $319;
                break;
        };
        return $317;
    };
    const U32$to_nat = x0 => U32$to_nat$(x0);

    function U32$to_string$(_n$1) {
        var $320 = Nat$to_string_base$(10n, U32$to_nat$(_n$1));
        return $320;
    };
    const U32$to_string = x0 => U32$to_string$(x0);

    function Web$Kaelin$Coord$show$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $322 = self.i;
                var $323 = self.j;
                var $324 = (U32$to_string$($322) + (":" + U32$to_string$($323)));
                var $321 = $324;
                break;
        };
        return $321;
    };
    const Web$Kaelin$Coord$show = x0 => Web$Kaelin$Coord$show$(x0);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $325 = BitsMap$set$(String$to_bits$(_key$2), _val$3, _map$4);
        return $325;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $327 = self.value;
                var $328 = $327;
                var $326 = $328;
                break;
            case 'Maybe.none':
                var $329 = _a$3;
                var $326 = $329;
                break;
        };
        return $326;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function BitsMap$get$(_bits$2, _map$3) {
        var BitsMap$get$ = (_bits$2, _map$3) => ({
            ctr: 'TCO',
            arg: [_bits$2, _map$3]
        });
        var BitsMap$get = _bits$2 => _map$3 => BitsMap$get$(_bits$2, _map$3);
        var arg = [_bits$2, _map$3];
        while (true) {
            let [_bits$2, _map$3] = arg;
            var R = (() => {
                var self = _bits$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $330 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $332 = self.lft;
                                var $333 = BitsMap$get$($330, $332);
                                var $331 = $333;
                                break;
                            case 'BitsMap.new':
                                var $334 = Maybe$none;
                                var $331 = $334;
                                break;
                        };
                        return $331;
                    case 'i':
                        var $335 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $337 = self.rgt;
                                var $338 = BitsMap$get$($335, $337);
                                var $336 = $338;
                                break;
                            case 'BitsMap.new':
                                var $339 = Maybe$none;
                                var $336 = $339;
                                break;
                        };
                        return $336;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $341 = self.val;
                                var $342 = $341;
                                var $340 = $342;
                                break;
                            case 'BitsMap.new':
                                var $343 = Maybe$none;
                                var $340 = $343;
                                break;
                        };
                        return $340;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $344 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $344;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Web$Kaelin$Map$push$(_coord$1, _ent$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$show$(_coord$1);
        var $345 = Map$set$(_key$4, List$cons$(_ent$2, Maybe$default$(Map$get$(_key$4, _map$3), List$nil)), _map$3);
        return $345;
    };
    const Web$Kaelin$Map$push = x0 => x1 => x2 => Web$Kaelin$Map$push$(x0, x1, x2);

    function Web$Kaelin$State$game$(_room$1, _tick$2, _pos$3, _map$4) {
        var $346 = ({
            _: 'Web.Kaelin.State.game',
            'room': _room$1,
            'tick': _tick$2,
            'pos': _pos$3,
            'map': _map$4
        });
        return $346;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => Web$Kaelin$State$game$(x0, x1, x2, x3);

    function App$Render$txt$(_text$1) {
        var $347 = ({
            _: 'App.Render.txt',
            'text': _text$1
        });
        return $347;
    };
    const App$Render$txt = x0 => App$Render$txt$(x0);

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $349 = self.capacity;
                var $350 = self.buffer;
                var $351 = Image3D$new$(_length$1, $349, $350);
                var $348 = $351;
                break;
        };
        return $348;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $352 = Image3D$set_length$(0, _img$1);
        return $352;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));
    const Web$Kaelin$Coord$hexagon_radius = 10;

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

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $354 = self.i;
                var $355 = self.j;
                var _i$4 = $354;
                var _j$5 = $355;
                var _rad$6 = Web$Kaelin$Coord$hexagon_radius;
                var _hlf$7 = ((_rad$6 / 2) >>> 0);
                var _cx$8 = (Math.max(128 - ((_rad$6 * 4) >>> 0), 0));
                var _cx$9 = ((_cx$8 + ((((_rad$6 * 2) >>> 0) * _i$4) >>> 0)) >>> 0);
                var _cy$10 = (Math.max(128 - ((_hlf$7 * 5) >>> 0), 0));
                var _cy$11 = ((_cy$10 + ((((_hlf$7 * 3) >>> 0) * _j$5) >>> 0)) >>> 0);
                var self = ((_j$5 % 2) === 0);
                if (self) {
                    var $357 = _cx$9;
                    var _cx$12 = $357;
                } else {
                    var $358 = ((_cx$9 + _rad$6) >>> 0);
                    var _cx$12 = $358;
                };
                var $356 = Pair$new$(_cx$12, _cy$11);
                var $353 = $356;
                break;
        };
        return $353;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $360 = Word$e;
            var $359 = $360;
        } else {
            var $361 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $363 = self.pred;
                    var $364 = Word$o$(Word$trim$($361, $363));
                    var $362 = $364;
                    break;
                case 'Word.i':
                    var $365 = self.pred;
                    var $366 = Word$i$(Word$trim$($361, $365));
                    var $362 = $366;
                    break;
                case 'Word.e':
                    var $367 = Word$o$(Word$trim$($361, Word$e));
                    var $362 = $367;
                    break;
            };
            var $359 = $362;
        };
        return $359;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $369 = self.value;
                var $370 = $369;
                var $368 = $370;
                break;
            case 'Array.tie':
                var $371 = Unit$new;
                var $368 = $371;
                break;
        };
        return $368;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $373 = self.lft;
                var $374 = self.rgt;
                var $375 = Pair$new$($373, $374);
                var $372 = $375;
                break;
            case 'Array.tip':
                var $376 = Unit$new;
                var $372 = $376;
                break;
        };
        return $372;
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
                        var $377 = self.pred;
                        var $378 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $377);
                        return $378;
                    case 'Word.i':
                        var $379 = self.pred;
                        var $380 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $379);
                        return $380;
                    case 'Word.e':
                        var $381 = _nil$3;
                        return $381;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $382 = Word$foldl$((_arr$6 => {
            var $383 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $383;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $385 = self.fst;
                    var $386 = self.snd;
                    var $387 = Array$tie$(_rec$7($385), $386);
                    var $384 = $387;
                    break;
            };
            return $384;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $389 = self.fst;
                    var $390 = self.snd;
                    var $391 = Array$tie$($389, _rec$7($390));
                    var $388 = $391;
                    break;
            };
            return $388;
        }), _idx$3)(_arr$5);
        return $382;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $392 = Array$mut$(_idx$3, (_x$6 => {
            var $393 = _val$4;
            return $393;
        }), _arr$5);
        return $392;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const Image3D$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const Image3D$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const Image3D$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Image3D$Draw$deresagon$(_cx$1, _cy$2, _cz$3, _rad$4, _col$5, _draw_a$6, _draw_b$7, _draw_c$8, _draw_d$9, _draw_e$10, _draw_f$11, _img$12) {
        var _hlf$13 = ((_rad$4 / 2) >>> 0);
        var _v0x$14 = ((_cx$1 + _rad$4) >>> 0);
        var _v0y$15 = ((_cy$2 + _hlf$13) >>> 0);
        var _v1x$16 = ((_cx$1 + _rad$4) >>> 0);
        var _v1y$17 = (Math.max(_cy$2 - _hlf$13, 0));
        var _v2x$18 = _cx$1;
        var _v2y$19 = (Math.max(_cy$2 - _rad$4, 0));
        var _v3x$20 = (Math.max(_cx$1 - _rad$4, 0));
        var _v3y$21 = (Math.max(_cy$2 - _hlf$13, 0));
        var _v4x$22 = (Math.max(_cx$1 - _rad$4, 0));
        var _v4y$23 = ((_cy$2 + _hlf$13) >>> 0);
        var _v5x$24 = _cx$1;
        var _v5y$25 = ((_cy$2 + _rad$4) >>> 0);
        var self = _draw_a$6;
        if (self) {
            var _img$26 = (() => {
                var $396 = _img$12;
                var $397 = 0;
                var $398 = _rad$4;
                let _img$27 = $396;
                for (let _i$26 = $397; _i$26 < $398; ++_i$26) {
                    var _px$28 = _v1x$16;
                    var _py$29 = ((_v1y$17 + _i$26) >>> 0);
                    var $396 = ((_img$27.buffer[_img$27.length * 2] = ((0 | _px$28 | (_py$29 << 12) | (_cz$3 << 24))), _img$27.buffer[_img$27.length * 2 + 1] = _col$5, _img$27.length++, _img$27));
                    _img$27 = $396;
                };
                return _img$27;
            })();
            var $395 = _img$26;
            var _img$26 = $395;
        } else {
            var $399 = _img$12;
            var _img$26 = $399;
        };
        var self = _draw_d$9;
        if (self) {
            var _img$27 = (() => {
                var $401 = _img$26;
                var $402 = 0;
                var $403 = _rad$4;
                let _img$28 = $401;
                for (let _i$27 = $402; _i$27 < $403; ++_i$27) {
                    var _px$29 = _v3x$20;
                    var _py$30 = ((_v3y$21 + _i$27) >>> 0);
                    var $401 = ((_img$28.buffer[_img$28.length * 2] = ((0 | _px$29 | (_py$30 << 12) | (_cz$3 << 24))), _img$28.buffer[_img$28.length * 2 + 1] = _col$5, _img$28.length++, _img$28));
                    _img$28 = $401;
                };
                return _img$28;
            })();
            var $400 = _img$27;
            var _img$27 = $400;
        } else {
            var $404 = _img$26;
            var _img$27 = $404;
        };
        var self = _draw_b$7;
        if (self) {
            var _img$28 = (() => {
                var $406 = _img$27;
                var $407 = 0;
                var $408 = _rad$4;
                let _img$29 = $406;
                for (let _i$28 = $407; _i$28 < $408; ++_i$28) {
                    var _px$30 = ((_v2x$18 + _i$28) >>> 0);
                    var _py$31 = ((_v2y$19 + ((_i$28 / 2) >>> 0)) >>> 0);
                    var $406 = ((_img$29.buffer[_img$29.length * 2] = ((0 | _px$30 | (_py$31 << 12) | (_cz$3 << 24))), _img$29.buffer[_img$29.length * 2 + 1] = _col$5, _img$29.length++, _img$29));
                    _img$29 = $406;
                };
                return _img$29;
            })();
            var $405 = _img$28;
            var _img$28 = $405;
        } else {
            var $409 = _img$27;
            var _img$28 = $409;
        };
        var self = _draw_c$8;
        if (self) {
            var _img$29 = (() => {
                var $411 = _img$28;
                var $412 = 0;
                var $413 = _rad$4;
                let _img$30 = $411;
                for (let _i$29 = $412; _i$29 < $413; ++_i$29) {
                    var _px$31 = (Math.max(_v2x$18 - _i$29, 0));
                    var _py$32 = ((_v2y$19 + ((_i$29 / 2) >>> 0)) >>> 0);
                    var $411 = ((_img$30.buffer[_img$30.length * 2] = ((0 | _px$31 | (_py$32 << 12) | (_cz$3 << 24))), _img$30.buffer[_img$30.length * 2 + 1] = _col$5, _img$30.length++, _img$30));
                    _img$30 = $411;
                };
                return _img$30;
            })();
            var $410 = _img$29;
            var _img$29 = $410;
        } else {
            var $414 = _img$28;
            var _img$29 = $414;
        };
        var self = _draw_f$11;
        if (self) {
            var _img$30 = (() => {
                var $416 = _img$29;
                var $417 = 0;
                var $418 = _rad$4;
                let _img$31 = $416;
                for (let _i$30 = $417; _i$30 < $418; ++_i$30) {
                    var _px$32 = (Math.max((Math.max(_v0x$14 - _i$30, 0)) - 1, 0));
                    var _py$33 = ((_v0y$15 + ((_i$30 / 2) >>> 0)) >>> 0);
                    var $416 = ((_img$31.buffer[_img$31.length * 2] = ((0 | _px$32 | (_py$33 << 12) | (_cz$3 << 24))), _img$31.buffer[_img$31.length * 2 + 1] = _col$5, _img$31.length++, _img$31));
                    _img$31 = $416;
                };
                return _img$31;
            })();
            var $415 = _img$30;
            var _img$30 = $415;
        } else {
            var $419 = _img$29;
            var _img$30 = $419;
        };
        var self = _draw_e$10;
        if (self) {
            var _img$31 = (() => {
                var $421 = _img$30;
                var $422 = 0;
                var $423 = _rad$4;
                let _img$32 = $421;
                for (let _i$31 = $422; _i$31 < $423; ++_i$31) {
                    var _px$33 = ((((_v4x$22 + _i$31) >>> 0) + 1) >>> 0);
                    var _py$34 = ((_v4y$23 + ((_i$31 / 2) >>> 0)) >>> 0);
                    var $421 = ((_img$32.buffer[_img$32.length * 2] = ((0 | _px$33 | (_py$34 << 12) | (_cz$3 << 24))), _img$32.buffer[_img$32.length * 2 + 1] = _col$5, _img$32.length++, _img$32));
                    _img$32 = $421;
                };
                return _img$32;
            })();
            var $420 = _img$31;
            var _img$31 = $420;
        } else {
            var $424 = _img$30;
            var _img$31 = $424;
        };
        var $394 = _img$31;
        return $394;
    };
    const Image3D$Draw$deresagon = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => x11 => Image3D$Draw$deresagon$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var $425 = Maybe$default$(Map$get$(Web$Kaelin$Coord$show$(_coord$1), _map$2), List$nil);
        return $425;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Image3D$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $426 = (() => {
            var $427 = _img$7;
            var $428 = 0;
            var $429 = _siz$8;
            let _pix$12 = $427;
            for (let _idx$11 = $428; _idx$11 < $429; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = (Math.max(((_x$1 + _v_x$13) >>> 0) - _w_2$9, 0));
                var _p_y$16 = (Math.max(((_y$2 + _v_y$14) >>> 0) - _h_2$10, 0));
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $427 = _pix$19;
                _pix$12 = $427;
            };
            return _pix$12;
        })();
        return $426;
    };
    const Image3D$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Image3D$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function Web$Kaelin$Draw$tile$(_coord$1, _map$2, _img$3) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
                switch (self._) {
                    case 'Pair.new':
                        var $432 = self.fst;
                        var $433 = self.snd;
                        var _tile$8 = Web$Kaelin$Map$get$(_coord$1, _map$2);
                        var _img$9 = (() => {
                            var $436 = _img$3;
                            var $437 = _tile$8;
                            let _img$10 = $436;
                            let _ent$9;
                            while ($437._ === 'List.cons') {
                                _ent$9 = $437.head;
                                var self = _ent$9;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.new':
                                        var $438 = self.color;
                                        var $439 = Image3D$Draw$square$($432, $433, 0, 4, 4, (_x$12 => _y$13 => {
                                            var $440 = $438;
                                            return $440;
                                        }), _img$10);
                                        var $436 = $439;
                                        break;
                                };
                                _img$10 = $436;
                                $437 = $437.tail;
                            }
                            return _img$10;
                        })();
                        var $434 = _img$9;
                        var $431 = $434;
                        break;
                };
                var $430 = $431;
                break;
        };
        return $430;
    };
    const Web$Kaelin$Draw$tile = x0 => x1 => x2 => Web$Kaelin$Draw$tile$(x0, x1, x2);

    function App$Render$pix$(_pixs$1) {
        var $441 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $441;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function App$Action$(_S$1) {
        var $442 = null;
        return $442;
    };
    const App$Action = x0 => App$Action$(x0);
    const U16$eql = a0 => a1 => (a0 === a1);

    function Web$Kaelin$Map$pop$(_coord$1, _map$2) {
        var _key$3 = Web$Kaelin$Coord$show$(_coord$1);
        var _tile$4 = Maybe$default$(Map$get$(_key$3, _map$2), List$nil);
        var self = _tile$4;
        switch (self._) {
            case 'List.cons':
                var $444 = self.head;
                var $445 = self.tail;
                var $446 = Pair$new$(Map$set$(_key$3, $445, _map$2), Maybe$some$($444));
                var $443 = $446;
                break;
            case 'List.nil':
                var $447 = Pair$new$(_map$2, Maybe$none);
                var $443 = $447;
                break;
        };
        return $443;
    };
    const Web$Kaelin$Map$pop = x0 => x1 => Web$Kaelin$Map$pop$(x0, x1);

    function App$Action$state$(_value$2) {
        var $448 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $448;
    };
    const App$Action$state = x0 => App$Action$state$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $449 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $449;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = Image3D$alloc_capacity$(65536);
        var _ent_r$2 = Web$Kaelin$Entity$new$(((0 | 255 | (0 << 8) | (0 << 16) | (255 << 24))));
        var _ent_g$3 = Web$Kaelin$Entity$new$(((0 | 0 | (255 << 8) | (0 << 16) | (255 << 24))));
        var _ent_b$4 = Web$Kaelin$Entity$new$(((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24))));
        var _Pos$5 = Web$Kaelin$Coord$new;
        var _pos$6 = _Pos$5(0)(2);
        var _map$7 = Map$from_list$(List$nil);
        var _map$8 = Web$Kaelin$Map$push$(_Pos$5(0)(0), _ent_r$2, _map$7);
        var _map$9 = Web$Kaelin$Map$push$(_Pos$5(1)(0), _ent_g$3, _map$8);
        var _map$10 = Web$Kaelin$Map$push$(_pos$6, _ent_b$4, _map$9);
        var _init$5 = Web$Kaelin$State$game$("0x000000000000", 0n, _pos$6, _map$10);
        var _draw$6 = (_state$6 => {
            var self = _state$6;
            switch (self._) {
                case 'Web.Kaelin.State.game':
                    var $452 = self.map;
                    var _map$11 = $452;
                    var _img$12 = Image3D$clear$(_img$1);
                    var _col$13 = ((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24)));
                    var _rad$14 = 10;
                    var _img$15 = (() => {
                        var $454 = _img$12;
                        var $455 = 0;
                        var $456 = 5;
                        let _img$16 = $454;
                        for (let _j$15 = $455; _j$15 < $456; ++_j$15) {
                            var _img$17 = (() => {
                                var $457 = _img$16;
                                var $458 = 0;
                                var $459 = 5;
                                let _img$18 = $457;
                                for (let _i$17 = $458; _i$17 < $459; ++_i$17) {
                                    var _coord$19 = Web$Kaelin$Coord$new$(_i$17, _j$15);
                                    var self = Web$Kaelin$Coord$to_screen_xy$(_coord$19);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $460 = self.fst;
                                            var $461 = self.snd;
                                            var _draw_e$22 = ((((_j$15 % 2) === 0) && (_i$17 === 0)) || (_j$15 === 4));
                                            var _draw_f$23 = ((((_j$15 % 2) === 1) && (_i$17 === 4)) || (_j$15 === 4));
                                            var _img$24 = Image3D$Draw$deresagon$($460, $461, 0, _rad$14, _col$13, Bool$true, Bool$true, Bool$true, Bool$true, _draw_e$22, _draw_f$23, _img$18);
                                            var _img$25 = Web$Kaelin$Draw$tile$(_coord$19, _map$11, _img$24);
                                            var $462 = _img$25;
                                            var $457 = $462;
                                            break;
                                    };
                                    _img$18 = $457;
                                };
                                return _img$18;
                            })();
                            var $454 = _img$17;
                            _img$16 = $454;
                        };
                        return _img$16;
                    })();
                    var $453 = App$Render$pix$(_img$15);
                    var $451 = $453;
                    break;
                case 'Web.Kaelin.State.init':
                case 'Web.Kaelin.State.void':
                    var $463 = App$Render$txt$("TODO: create the renderer for this game state mode");
                    var $451 = $463;
                    break;
            };
            return $451;
        });
        var _when$7 = (_event$7 => _state$8 => {
            var self = _event$7;
            switch (self._) {
                case 'App.Event.xkey':
                    var $465 = self.down;
                    var $466 = self.code;
                    var self = $465;
                    if (self) {
                        var self = ($466 === 68);
                        if (self) {
                            var self = _state$8;
                            switch (self._) {
                                case 'Web.Kaelin.State.game':
                                    var $470 = self.room;
                                    var $471 = self.tick;
                                    var $472 = self.pos;
                                    var $473 = self.map;
                                    var _old_pos$16 = $472;
                                    var self = _old_pos$16;
                                    switch (self._) {
                                        case 'Web.Kaelin.Coord.new':
                                            var $475 = self.i;
                                            var $476 = self.j;
                                            var $477 = Web$Kaelin$Coord$new$((($475 + 1) >>> 0), $476);
                                            var _new_pos$17 = $477;
                                            break;
                                    };
                                    var self = Web$Kaelin$Map$pop$(_old_pos$16, $473);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $478 = self.fst;
                                            var $479 = self.snd;
                                            var self = $479;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $481 = self.value;
                                                    var $482 = Web$Kaelin$Map$push$(_new_pos$17, $481, $478);
                                                    var _map$20 = $482;
                                                    break;
                                                case 'Maybe.none':
                                                    var $483 = $478;
                                                    var _map$20 = $483;
                                                    break;
                                            };
                                            var _state$21 = Web$Kaelin$State$game$($470, $471, _new_pos$17, _map$20);
                                            var $480 = List$cons$(App$Action$state$(_state$21), List$nil);
                                            var $474 = $480;
                                            break;
                                    };
                                    var $469 = $474;
                                    break;
                                case 'Web.Kaelin.State.init':
                                case 'Web.Kaelin.State.void':
                                    var $484 = List$nil;
                                    var $469 = $484;
                                    break;
                            };
                            var $468 = $469;
                        } else {
                            var $485 = List$nil;
                            var $468 = $485;
                        };
                        var $467 = $468;
                    } else {
                        var $486 = List$nil;
                        var $467 = $486;
                    };
                    var $464 = $467;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.post':
                    var $487 = List$nil;
                    var $464 = $487;
                    break;
            };
            return $464;
        });
        var $450 = App$new$(_init$5, _draw$6, _when$7);
        return $450;
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
        'Web.Kaelin.Entity.new': Web$Kaelin$Entity$new,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Col32.new': Col32$new,
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
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
        'List': List,
        'List.nil': List$nil,
        'Pair': Pair,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Pair.new': Pair$new,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'List.cons': List$cons,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.and': Bool$and,
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'Maybe': Maybe,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'U32.to_nat': U32$to_nat,
        'U32.to_string': U32$to_string,
        'Web.Kaelin.Coord.show': Web$Kaelin$Coord$show,
        'Map.set': Map$set,
        'Maybe.default': Maybe$default,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'Web.Kaelin.Map.push': Web$Kaelin$Map$push,
        'Web.Kaelin.State.game': Web$Kaelin$State$game,
        'App.Render.txt': App$Render$txt,
        'Image3D.set_length': Image3D$set_length,
        'Image3D.clear': Image3D$clear,
        'U32.for': U32$for,
        'Web.Kaelin.Coord.hexagon_radius': Web$Kaelin$Coord$hexagon_radius,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.add': U32$add,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
        'Bool.or': Bool$or,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
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
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'List.for': List$for,
        'Image3D.Draw.square': Image3D$Draw$square,
        'Web.Kaelin.Draw.tile': Web$Kaelin$Draw$tile,
        'App.Render.pix': App$Render$pix,
        'App.Action': App$Action,
        'U16.eql': U16$eql,
        'Web.Kaelin.Map.pop': Web$Kaelin$Map$pop,
        'App.Action.state': App$Action$state,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();

/***/ })

}]);
//# sourceMappingURL=927.index.js.map