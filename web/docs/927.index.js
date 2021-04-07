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

    function BitsMap$(_A$1) {
        var $188 = null;
        return $188;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $189 = null;
        return $189;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $190 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $190;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $191 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $191;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $193 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $195 = self.val;
                        var $196 = self.lft;
                        var $197 = self.rgt;
                        var $198 = BitsMap$tie$($195, BitsMap$set$($193, _val$3, $196), $197);
                        var $194 = $198;
                        break;
                    case 'BitsMap.new':
                        var $199 = BitsMap$tie$(Maybe$none, BitsMap$set$($193, _val$3, BitsMap$new), BitsMap$new);
                        var $194 = $199;
                        break;
                };
                var $192 = $194;
                break;
            case 'i':
                var $200 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $202 = self.val;
                        var $203 = self.lft;
                        var $204 = self.rgt;
                        var $205 = BitsMap$tie$($202, $203, BitsMap$set$($200, _val$3, $204));
                        var $201 = $205;
                        break;
                    case 'BitsMap.new':
                        var $206 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($200, _val$3, BitsMap$new));
                        var $201 = $206;
                        break;
                };
                var $192 = $201;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $208 = self.lft;
                        var $209 = self.rgt;
                        var $210 = BitsMap$tie$(Maybe$some$(_val$3), $208, $209);
                        var $207 = $210;
                        break;
                    case 'BitsMap.new':
                        var $211 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $207 = $211;
                        break;
                };
                var $192 = $207;
                break;
        };
        return $192;
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
                var $213 = self.pred;
                var $214 = (Word$to_bits$($213) + '0');
                var $212 = $214;
                break;
            case 'Word.i':
                var $215 = self.pred;
                var $216 = (Word$to_bits$($215) + '1');
                var $212 = $216;
                break;
            case 'Word.e':
                var $217 = Bits$e;
                var $212 = $217;
                break;
        };
        return $212;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $219 = Bits$e;
            var $218 = $219;
        } else {
            var $220 = self.charCodeAt(0);
            var $221 = self.slice(1);
            var $222 = (String$to_bits$($221) + (u16_to_bits($220)));
            var $218 = $222;
        };
        return $218;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $224 = self.head;
                var $225 = self.tail;
                var self = $224;
                switch (self._) {
                    case 'Pair.new':
                        var $227 = self.fst;
                        var $228 = self.snd;
                        var $229 = BitsMap$set$(String$to_bits$($227), $228, Map$from_list$($225));
                        var $226 = $229;
                        break;
                };
                var $223 = $226;
                break;
            case 'List.nil':
                var $230 = BitsMap$new;
                var $223 = $230;
                break;
        };
        return $223;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$(_A$1) {
        var $231 = null;
        return $231;
    };
    const List = x0 => List$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $232 = null;
        return $232;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Web$Kaelin$Entity$new$(_color$1) {
        var $233 = ({
            _: 'Web.Kaelin.Entity.new',
            'color': _color$1
        });
        return $233;
    };
    const Web$Kaelin$Entity$new = x0 => Web$Kaelin$Entity$new$(x0);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $235 = self.pred;
                var $236 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $238 = self.pred;
                            var $239 = (_a$pred$9 => {
                                var $240 = Word$o$(Word$or$(_a$pred$9, $238));
                                return $240;
                            });
                            var $237 = $239;
                            break;
                        case 'Word.i':
                            var $241 = self.pred;
                            var $242 = (_a$pred$9 => {
                                var $243 = Word$i$(Word$or$(_a$pred$9, $241));
                                return $243;
                            });
                            var $237 = $242;
                            break;
                        case 'Word.e':
                            var $244 = (_a$pred$7 => {
                                var $245 = Word$e;
                                return $245;
                            });
                            var $237 = $244;
                            break;
                    };
                    var $237 = $237($235);
                    return $237;
                });
                var $234 = $236;
                break;
            case 'Word.i':
                var $246 = self.pred;
                var $247 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $249 = self.pred;
                            var $250 = (_a$pred$9 => {
                                var $251 = Word$i$(Word$or$(_a$pred$9, $249));
                                return $251;
                            });
                            var $248 = $250;
                            break;
                        case 'Word.i':
                            var $252 = self.pred;
                            var $253 = (_a$pred$9 => {
                                var $254 = Word$i$(Word$or$(_a$pred$9, $252));
                                return $254;
                            });
                            var $248 = $253;
                            break;
                        case 'Word.e':
                            var $255 = (_a$pred$7 => {
                                var $256 = Word$e;
                                return $256;
                            });
                            var $248 = $255;
                            break;
                    };
                    var $248 = $248($246);
                    return $248;
                });
                var $234 = $247;
                break;
            case 'Word.e':
                var $257 = (_b$4 => {
                    var $258 = Word$e;
                    return $258;
                });
                var $234 = $257;
                break;
        };
        var $234 = $234(_b$3);
        return $234;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => (a0 << a1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $259 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $259;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);

    function String$cons$(_head$1, _tail$2) {
        var $260 = (String.fromCharCode(_head$1) + _tail$2);
        return $260;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Pair$new$(_fst$3, _snd$4) {
        var $261 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $261;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Int$to_nat$(_a$1) {
        var $262 = _a$1((_a$x$2 => _a$y$3 => {
            var self = _a$y$3;
            if (self === 0n) {
                var $264 = Pair$new$(Bool$false, _a$x$2);
                var $263 = $264;
            } else {
                var $265 = (self - 1n);
                var $266 = Pair$new$(Bool$true, _a$y$3);
                var $263 = $266;
            };
            return $263;
        }));
        return $262;
    };
    const Int$to_nat = x0 => Int$to_nat$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $268 = self.head;
                var $269 = self.tail;
                var $270 = _cons$5($268)(List$fold$($269, _nil$4, _cons$5));
                var $267 = $270;
                break;
            case 'List.nil':
                var $271 = _nil$4;
                var $267 = $271;
                break;
        };
        return $267;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $272 = null;
        return $272;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $273 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $273;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $274 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $274;
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
                    var $275 = Either$left$(_n$1);
                    return $275;
                } else {
                    var $276 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $278 = Either$right$(Nat$succ$($276));
                        var $277 = $278;
                    } else {
                        var $279 = (self - 1n);
                        var $280 = Nat$sub_rem$($279, $276);
                        var $277 = $280;
                    };
                    return $277;
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
                        var $281 = self.value;
                        var $282 = Nat$div_mod$go$($281, _m$2, Nat$succ$(_d$3));
                        return $282;
                    case 'Either.right':
                        var $283 = Pair$new$(_d$3, _n$1);
                        return $283;
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
        var $284 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $284;
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
                        var $285 = self.fst;
                        var $286 = self.snd;
                        var self = $285;
                        if (self === 0n) {
                            var $288 = List$cons$($286, _res$3);
                            var $287 = $288;
                        } else {
                            var $289 = (self - 1n);
                            var $290 = Nat$to_base$go$(_base$1, $285, List$cons$($286, _res$3));
                            var $287 = $290;
                        };
                        return $287;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $291 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $291;
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
                    var $292 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $292;
                } else {
                    var $293 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $295 = _r$3;
                        var $294 = $295;
                    } else {
                        var $296 = (self - 1n);
                        var $297 = Nat$mod$go$($296, $293, Nat$succ$(_r$3));
                        var $294 = $297;
                    };
                    return $294;
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
        var $298 = null;
        return $298;
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
                        var $299 = self.head;
                        var $300 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $302 = Maybe$some$($299);
                            var $301 = $302;
                        } else {
                            var $303 = (self - 1n);
                            var $304 = List$at$($303, $300);
                            var $301 = $304;
                        };
                        return $301;
                    case 'List.nil':
                        var $305 = Maybe$none;
                        return $305;
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
                    var $308 = self.value;
                    var $309 = $308;
                    var $307 = $309;
                    break;
                case 'Maybe.none':
                    var $310 = 35;
                    var $307 = $310;
                    break;
            };
            var $306 = $307;
        } else {
            var $311 = 35;
            var $306 = $311;
        };
        return $306;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $312 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $313 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $313;
        }));
        return $312;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $314 = Nat$to_string_base$(10n, _n$1);
        return $314;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Int$show$(_a$1) {
        var _result$2 = Int$to_nat$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $316 = self.fst;
                var $317 = self.snd;
                var self = $316;
                if (self) {
                    var $319 = ("+" + Nat$show$($317));
                    var $318 = $319;
                } else {
                    var $320 = ("-" + Nat$show$($317));
                    var $318 = $320;
                };
                var $315 = $318;
                break;
        };
        return $315;
    };
    const Int$show = x0 => Int$show$(x0);

    function Web$Kaelin$Coord$show$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $322 = self.i;
                var $323 = self.j;
                var $324 = (Int$show$($322) + (":" + Int$show$($323)));
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

    function Int$new$(_x$1, _y$2, _new$4) {
        var Int$new$ = (_x$1, _y$2, _new$4) => ({
            ctr: 'TCO',
            arg: [_x$1, _y$2, _new$4]
        });
        var Int$new = _x$1 => _y$2 => _new$4 => Int$new$(_x$1, _y$2, _new$4);
        var arg = [_x$1, _y$2, _new$4];
        while (true) {
            let [_x$1, _y$2, _new$4] = arg;
            var R = (() => {
                var self = _x$1;
                if (self === 0n) {
                    var $346 = _new$4(Nat$zero)(_y$2);
                    return $346;
                } else {
                    var $347 = (self - 1n);
                    var self = _y$2;
                    if (self === 0n) {
                        var $349 = _new$4(Nat$succ$($347))(Nat$zero);
                        var $348 = $349;
                    } else {
                        var $350 = (self - 1n);
                        var $351 = Int$new$($347, $350, _new$4);
                        var $348 = $351;
                    };
                    return $348;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Int$new = x0 => x1 => x2 => Int$new$(x0, x1, x2);

    function Web$Kaelin$Draw$initial_ent$(_map$1) {
        var _ent_r$2 = Web$Kaelin$Entity$new$(((0 | 255 | (0 << 8) | (0 << 16) | (255 << 24))));
        var _ent_g$3 = Web$Kaelin$Entity$new$(((0 | 0 | (255 << 8) | (0 << 16) | (255 << 24))));
        var _ent_b$4 = Web$Kaelin$Entity$new$(((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24))));
        var _new_coord$5 = Web$Kaelin$Coord$new;
        var _map$6 = Web$Kaelin$Map$push$(_new_coord$5(Int$new(0n)(0n))(Int$new(0n)(0n)), _ent_r$2, _map$1);
        var _map$7 = Web$Kaelin$Map$push$(_new_coord$5(Int$new(0n)(1n))(Int$new(0n)(0n)), _ent_g$3, _map$6);
        var _map$8 = Web$Kaelin$Map$push$(_new_coord$5(Int$new(0n)(0n))(Int$new(0n)(2n)), _ent_b$4, _map$7);
        var $352 = _map$8;
        return $352;
    };
    const Web$Kaelin$Draw$initial_ent = x0 => Web$Kaelin$Draw$initial_ent$(x0);

    function Web$Kaelin$State$game$(_room$1, _tick$2, _pos$3, _map$4) {
        var $353 = ({
            _: 'Web.Kaelin.State.game',
            'room': _room$1,
            'tick': _tick$2,
            'pos': _pos$3,
            'map': _map$4
        });
        return $353;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => Web$Kaelin$State$game$(x0, x1, x2, x3);

    function App$Render$txt$(_text$1) {
        var $354 = ({
            _: 'App.Render.txt',
            'text': _text$1
        });
        return $354;
    };
    const App$Render$txt = x0 => App$Render$txt$(x0);

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $356 = self.capacity;
                var $357 = self.buffer;
                var $358 = Image3D$new$(_length$1, $356, $357);
                var $355 = $358;
                break;
        };
        return $355;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $359 = Image3D$set_length$(0, _img$1);
        return $359;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);
    const Web$Kaelin$Resources$map_size = 5;
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const Web$Kaelin$Resources$hexagon_radius = 10;
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));
    const Nat$add = a0 => a1 => (a0 + a1);

    function Int$add$(_a$1, _b$2) {
        var $360 = _a$1((_a$x$3 => _a$y$4 => {
            var $361 = _b$2((_b$x$5 => _b$y$6 => {
                var $362 = Int$new((_a$x$3 + _b$x$5))((_a$y$4 + _b$y$6));
                return $362;
            }));
            return $361;
        }));
        return $360;
    };
    const Int$add = x0 => x1 => Int$add$(x0, x1);

    function Int$neg$(_a$1) {
        var $363 = _a$1((_a$x$2 => _a$y$3 => {
            var $364 = Int$new(_a$y$3)(_a$x$2);
            return $364;
        }));
        return $363;
    };
    const Int$neg = x0 => Int$neg$(x0);

    function Int$sub$(_a$1, _b$2) {
        var $365 = Int$add$(_a$1, Int$neg$(_b$2));
        return $365;
    };
    const Int$sub = x0 => x1 => Int$sub$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $367 = self.pred;
                var $368 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $367));
                var $366 = $368;
                break;
            case 'Word.i':
                var $369 = self.pred;
                var $370 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $369));
                var $366 = $370;
                break;
            case 'Word.e':
                var $371 = _nil$3;
                var $366 = $371;
                break;
        };
        return $366;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $372 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $373 = Nat$succ$((2n * _x$4));
            return $373;
        }), _word$2);
        return $372;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function U32$to_nat$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $375 = u32_to_word(self);
                var $376 = Word$to_nat$($375);
                var $374 = $376;
                break;
        };
        return $374;
    };
    const U32$to_nat = x0 => U32$to_nat$(x0);

    function Int$abs$(_a$1) {
        var _result$2 = Int$to_nat$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $378 = self.snd;
                var $379 = $378;
                var $377 = $379;
                break;
        };
        return $377;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $381 = Bool$true;
                var $380 = $381;
                break;
            case 'Cmp.gtn':
                var $382 = Bool$false;
                var $380 = $382;
                break;
        };
        return $380;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $383 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $383;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $385 = self.i;
                var $386 = self.j;
                var _i$5 = $385;
                var _j$6 = $386;
                var _sum$7 = Int$add$(_i$5, _j$6);
                var _abs$8 = Int$abs$(_sum$7);
                var _abs$9 = (Number(_abs$8));
                var $387 = (_abs$9 <= _map_size$2);
                var $384 = $387;
                break;
        };
        return $384;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);

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

    function Int$is_neg$(_a$1) {
        var $388 = _a$1((_a$x$2 => _a$y$3 => {
            var $389 = (_a$x$2 > _a$y$3);
            return $389;
        }));
        return $388;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var _rad$2 = Web$Kaelin$Resources$hexagon_radius;
        var _hlf$3 = ((_rad$2 / 2) >>> 0);
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $391 = self.i;
                var $392 = self.j;
                var _i$6 = $391;
                var _j$7 = $392;
                var $393 = _i$6((_i$x$8 => _i$y$9 => {
                    var $394 = _j$7((_j$x$10 => _j$y$11 => {
                        var _cx$12 = 128;
                        var _cy$13 = 128;
                        var _is_neg_i$14 = Int$is_neg$(_i$6);
                        var _is_neg_j$15 = Int$is_neg$(_j$7);
                        var self = _is_neg_i$14;
                        if (self) {
                            var self = _is_neg_j$15;
                            if (self) {
                                var _cx$16 = (Math.max(_cx$12 - (((Number(_j$x$10)) * _rad$2) >>> 0), 0));
                                var _cx$17 = (Math.max(_cx$16 - (((Number(_i$x$8)) * ((_rad$2 * 2) >>> 0)) >>> 0), 0));
                                var _cy$18 = (Math.max(_cy$13 - (((Number(_j$x$10)) * ((_hlf$3 * 3) >>> 0)) >>> 0), 0));
                                var $397 = Pair$new$(_cx$17, _cy$18);
                                var $396 = $397;
                            } else {
                                var _cx$16 = ((_cx$12 + (((Number(_j$y$11)) * _rad$2) >>> 0)) >>> 0);
                                var _cx$17 = (Math.max(_cx$16 - (((Number(_i$x$8)) * ((_rad$2 * 2) >>> 0)) >>> 0), 0));
                                var _cy$18 = ((_cy$13 + (((Number(_j$y$11)) * ((_hlf$3 * 3) >>> 0)) >>> 0)) >>> 0);
                                var $398 = Pair$new$(_cx$17, _cy$18);
                                var $396 = $398;
                            };
                            var $395 = $396;
                        } else {
                            var self = _is_neg_j$15;
                            if (self) {
                                var _cx$16 = (Math.max(_cx$12 - (((Number(_j$x$10)) * _rad$2) >>> 0), 0));
                                var _cx$17 = ((_cx$16 + (((Number(_i$y$9)) * ((_rad$2 * 2) >>> 0)) >>> 0)) >>> 0);
                                var _cy$18 = (Math.max(_cy$13 - (((Number(_j$x$10)) * ((_hlf$3 * 3) >>> 0)) >>> 0), 0));
                                var $400 = Pair$new$(_cx$17, _cy$18);
                                var $399 = $400;
                            } else {
                                var _cx$16 = ((_cx$12 + (((Number(_j$y$11)) * _rad$2) >>> 0)) >>> 0);
                                var _cx$17 = ((_cx$16 + (((Number(_i$y$9)) * ((_rad$2 * 2) >>> 0)) >>> 0)) >>> 0);
                                var _cy$18 = ((_cy$13 + (((Number(_j$y$11)) * ((_hlf$3 * 3) >>> 0)) >>> 0)) >>> 0);
                                var $401 = Pair$new$(_cx$17, _cy$18);
                                var $399 = $401;
                            };
                            var $395 = $399;
                        };
                        return $395;
                    }));
                    return $394;
                }));
                var $390 = $393;
                break;
        };
        return $390;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $403 = Word$e;
            var $402 = $403;
        } else {
            var $404 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $406 = self.pred;
                    var $407 = Word$o$(Word$trim$($404, $406));
                    var $405 = $407;
                    break;
                case 'Word.i':
                    var $408 = self.pred;
                    var $409 = Word$i$(Word$trim$($404, $408));
                    var $405 = $409;
                    break;
                case 'Word.e':
                    var $410 = Word$o$(Word$trim$($404, Word$e));
                    var $405 = $410;
                    break;
            };
            var $402 = $405;
        };
        return $402;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $412 = self.value;
                var $413 = $412;
                var $411 = $413;
                break;
            case 'Array.tie':
                var $414 = Unit$new;
                var $411 = $414;
                break;
        };
        return $411;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $416 = self.lft;
                var $417 = self.rgt;
                var $418 = Pair$new$($416, $417);
                var $415 = $418;
                break;
            case 'Array.tip':
                var $419 = Unit$new;
                var $415 = $419;
                break;
        };
        return $415;
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
                        var $420 = self.pred;
                        var $421 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $420);
                        return $421;
                    case 'Word.i':
                        var $422 = self.pred;
                        var $423 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $422);
                        return $423;
                    case 'Word.e':
                        var $424 = _nil$3;
                        return $424;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $425 = Word$foldl$((_arr$6 => {
            var $426 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $426;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $428 = self.fst;
                    var $429 = self.snd;
                    var $430 = Array$tie$(_rec$7($428), $429);
                    var $427 = $430;
                    break;
            };
            return $427;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $432 = self.fst;
                    var $433 = self.snd;
                    var $434 = Array$tie$($432, _rec$7($433));
                    var $431 = $434;
                    break;
            };
            return $431;
        }), _idx$3)(_arr$5);
        return $425;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $435 = Array$mut$(_idx$3, (_x$6 => {
            var $436 = _val$4;
            return $436;
        }), _arr$5);
        return $435;
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
                var $439 = _img$12;
                var $440 = 0;
                var $441 = _rad$4;
                let _img$27 = $439;
                for (let _i$26 = $440; _i$26 < $441; ++_i$26) {
                    var _px$28 = _v1x$16;
                    var _py$29 = ((_v1y$17 + _i$26) >>> 0);
                    var $439 = ((_img$27.buffer[_img$27.length * 2] = ((0 | _px$28 | (_py$29 << 12) | (_cz$3 << 24))), _img$27.buffer[_img$27.length * 2 + 1] = _col$5, _img$27.length++, _img$27));
                    _img$27 = $439;
                };
                return _img$27;
            })();
            var $438 = _img$26;
            var _img$26 = $438;
        } else {
            var $442 = _img$12;
            var _img$26 = $442;
        };
        var self = _draw_d$9;
        if (self) {
            var _img$27 = (() => {
                var $444 = _img$26;
                var $445 = 0;
                var $446 = _rad$4;
                let _img$28 = $444;
                for (let _i$27 = $445; _i$27 < $446; ++_i$27) {
                    var _px$29 = _v3x$20;
                    var _py$30 = ((_v3y$21 + _i$27) >>> 0);
                    var $444 = ((_img$28.buffer[_img$28.length * 2] = ((0 | _px$29 | (_py$30 << 12) | (_cz$3 << 24))), _img$28.buffer[_img$28.length * 2 + 1] = _col$5, _img$28.length++, _img$28));
                    _img$28 = $444;
                };
                return _img$28;
            })();
            var $443 = _img$27;
            var _img$27 = $443;
        } else {
            var $447 = _img$26;
            var _img$27 = $447;
        };
        var self = _draw_b$7;
        if (self) {
            var _img$28 = (() => {
                var $449 = _img$27;
                var $450 = 0;
                var $451 = _rad$4;
                let _img$29 = $449;
                for (let _i$28 = $450; _i$28 < $451; ++_i$28) {
                    var _px$30 = ((_v2x$18 + _i$28) >>> 0);
                    var _py$31 = ((_v2y$19 + ((_i$28 / 2) >>> 0)) >>> 0);
                    var $449 = ((_img$29.buffer[_img$29.length * 2] = ((0 | _px$30 | (_py$31 << 12) | (_cz$3 << 24))), _img$29.buffer[_img$29.length * 2 + 1] = _col$5, _img$29.length++, _img$29));
                    _img$29 = $449;
                };
                return _img$29;
            })();
            var $448 = _img$28;
            var _img$28 = $448;
        } else {
            var $452 = _img$27;
            var _img$28 = $452;
        };
        var self = _draw_c$8;
        if (self) {
            var _img$29 = (() => {
                var $454 = _img$28;
                var $455 = 0;
                var $456 = _rad$4;
                let _img$30 = $454;
                for (let _i$29 = $455; _i$29 < $456; ++_i$29) {
                    var _px$31 = (Math.max(_v2x$18 - _i$29, 0));
                    var _py$32 = ((_v2y$19 + ((_i$29 / 2) >>> 0)) >>> 0);
                    var $454 = ((_img$30.buffer[_img$30.length * 2] = ((0 | _px$31 | (_py$32 << 12) | (_cz$3 << 24))), _img$30.buffer[_img$30.length * 2 + 1] = _col$5, _img$30.length++, _img$30));
                    _img$30 = $454;
                };
                return _img$30;
            })();
            var $453 = _img$29;
            var _img$29 = $453;
        } else {
            var $457 = _img$28;
            var _img$29 = $457;
        };
        var self = _draw_f$11;
        if (self) {
            var _img$30 = (() => {
                var $459 = _img$29;
                var $460 = 0;
                var $461 = _rad$4;
                let _img$31 = $459;
                for (let _i$30 = $460; _i$30 < $461; ++_i$30) {
                    var _px$32 = (Math.max((Math.max(_v0x$14 - _i$30, 0)) - 1, 0));
                    var _py$33 = ((_v0y$15 + ((_i$30 / 2) >>> 0)) >>> 0);
                    var $459 = ((_img$31.buffer[_img$31.length * 2] = ((0 | _px$32 | (_py$33 << 12) | (_cz$3 << 24))), _img$31.buffer[_img$31.length * 2 + 1] = _col$5, _img$31.length++, _img$31));
                    _img$31 = $459;
                };
                return _img$31;
            })();
            var $458 = _img$30;
            var _img$30 = $458;
        } else {
            var $462 = _img$29;
            var _img$30 = $462;
        };
        var self = _draw_e$10;
        if (self) {
            var _img$31 = (() => {
                var $464 = _img$30;
                var $465 = 0;
                var $466 = _rad$4;
                let _img$32 = $464;
                for (let _i$31 = $465; _i$31 < $466; ++_i$31) {
                    var _px$33 = ((((_v4x$22 + _i$31) >>> 0) + 1) >>> 0);
                    var _py$34 = ((_v4y$23 + ((_i$31 / 2) >>> 0)) >>> 0);
                    var $464 = ((_img$32.buffer[_img$32.length * 2] = ((0 | _px$33 | (_py$34 << 12) | (_cz$3 << 24))), _img$32.buffer[_img$32.length * 2 + 1] = _col$5, _img$32.length++, _img$32));
                    _img$32 = $464;
                };
                return _img$32;
            })();
            var $463 = _img$31;
            var _img$31 = $463;
        } else {
            var $467 = _img$30;
            var _img$31 = $467;
        };
        var $437 = _img$31;
        return $437;
    };
    const Image3D$Draw$deresagon = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => x11 => Image3D$Draw$deresagon$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11);

    function Web$Kaelin$Draw$hexagon_border$(_coord$1, _rad$2, _col$3, _img$4) {
        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
        switch (self._) {
            case 'Pair.new':
                var $469 = self.fst;
                var $470 = self.snd;
                var _img$7 = Image3D$Draw$deresagon$($469, $470, 0, _rad$2, _col$3, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, _img$4);
                var $471 = _img$7;
                var $468 = $471;
                break;
        };
        return $468;
    };
    const Web$Kaelin$Draw$hexagon_border = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$hexagon_border$(x0, x1, x2, x3);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var $472 = Maybe$default$(Map$get$(Web$Kaelin$Coord$show$(_coord$1), _map$2), List$nil);
        return $472;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

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

    function Image3D$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $473 = (() => {
            var $474 = _img$7;
            var $475 = 0;
            var $476 = _siz$8;
            let _pix$12 = $474;
            for (let _idx$11 = $475; _idx$11 < $476; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = (Math.max(((_x$1 + _v_x$13) >>> 0) - _w_2$9, 0));
                var _p_y$16 = (Math.max(((_y$2 + _v_y$14) >>> 0) - _h_2$10, 0));
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $474 = _pix$19;
                _pix$12 = $474;
            };
            return _pix$12;
        })();
        return $473;
    };
    const Image3D$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Image3D$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function Web$Kaelin$Draw$tile$(_coord$1, _map$2, _img$3) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
                switch (self._) {
                    case 'Pair.new':
                        var $479 = self.fst;
                        var $480 = self.snd;
                        var _tile$8 = Web$Kaelin$Map$get$(_coord$1, _map$2);
                        var _img$9 = (() => {
                            var $483 = _img$3;
                            var $484 = _tile$8;
                            let _img$10 = $483;
                            let _ent$9;
                            while ($484._ === 'List.cons') {
                                _ent$9 = $484.head;
                                var self = _ent$9;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.new':
                                        var $485 = self.color;
                                        var $486 = Image3D$Draw$square$($479, $480, 0, 4, 4, (_x$12 => _y$13 => {
                                            var $487 = $485;
                                            return $487;
                                        }), _img$10);
                                        var $483 = $486;
                                        break;
                                };
                                _img$10 = $483;
                                $484 = $484.tail;
                            }
                            return _img$10;
                        })();
                        var $481 = _img$9;
                        var $478 = $481;
                        break;
                };
                var $477 = $478;
                break;
        };
        return $477;
    };
    const Web$Kaelin$Draw$tile = x0 => x1 => x2 => Web$Kaelin$Draw$tile$(x0, x1, x2);

    function Web$Kaelin$Draw$map$(_img$1, _map$2) {
        var _img$3 = Image3D$clear$(_img$1);
        var _col$4 = ((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24)));
        var _map_size$5 = Web$Kaelin$Resources$map_size;
        var _width$6 = ((((_map_size$5 * 2) >>> 0) + 1) >>> 0);
        var _height$7 = ((((_map_size$5 * 2) >>> 0) + 1) >>> 0);
        var _hex_rad$8 = Web$Kaelin$Resources$hexagon_radius;
        var _img$9 = (() => {
            var $489 = _img$3;
            var $490 = 0;
            var $491 = _height$7;
            let _img$10 = $489;
            for (let _j$9 = $490; _j$9 < $491; ++_j$9) {
                var _img$11 = (() => {
                    var $492 = _img$10;
                    var $493 = 0;
                    var $494 = _width$6;
                    let _img$12 = $492;
                    for (let _i$11 = $493; _i$11 < $494; ++_i$11) {
                        var _coord_i$13 = Int$sub$(Int$new(0n)(U32$to_nat$(_i$11)), Int$new(0n)(U32$to_nat$(_map_size$5)));
                        var _coord_j$14 = Int$sub$(Int$new(0n)(U32$to_nat$(_j$9)), Int$new(0n)(U32$to_nat$(_map_size$5)));
                        var _coord$15 = Web$Kaelin$Coord$new$(_coord_i$13, _coord_j$14);
                        var _fit$16 = Web$Kaelin$Coord$fit$(_coord$15, _map_size$5);
                        var self = _fit$16;
                        if (self) {
                            var _img$17 = Web$Kaelin$Draw$hexagon_border$(_coord$15, _hex_rad$8, _col$4, _img$12);
                            var _img$18 = Web$Kaelin$Draw$tile$(_coord$15, _map$2, _img$17);
                            var $495 = _img$18;
                            var $492 = $495;
                        } else {
                            var $496 = _img$12;
                            var $492 = $496;
                        };
                        _img$12 = $492;
                    };
                    return _img$12;
                })();
                var $489 = _img$11;
                _img$10 = $489;
            };
            return _img$10;
        })();
        var $488 = _img$9;
        return $488;
    };
    const Web$Kaelin$Draw$map = x0 => x1 => Web$Kaelin$Draw$map$(x0, x1);

    function App$Render$pix$(_pixs$1) {
        var $497 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $497;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function App$Action$(_S$1) {
        var $498 = null;
        return $498;
    };
    const App$Action = x0 => App$Action$(x0);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$Action$state$(_value$2) {
        var $499 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $499;
    };
    const App$Action$state = x0 => App$Action$state$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $500 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $500;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = Image3D$alloc_capacity$(65536);
        var _map$2 = Map$from_list$(List$nil);
        var _map$3 = Web$Kaelin$Draw$initial_ent$(_map$2);
        var _init_pos$4 = Web$Kaelin$Coord$new$(Int$new(0n)(0n), Int$new(0n)(2n));
        var _init$2 = Web$Kaelin$State$game$("0x000000000000", 0n, _init_pos$4, _map$3);
        var _draw$3 = (_state$3 => {
            var self = _state$3;
            switch (self._) {
                case 'Web.Kaelin.State.game':
                    var $503 = self.map;
                    var _map$8 = $503;
                    var _img$9 = Web$Kaelin$Draw$map$(_img$1, _map$8);
                    var $504 = App$Render$pix$(_img$9);
                    var $502 = $504;
                    break;
                case 'Web.Kaelin.State.init':
                case 'Web.Kaelin.State.void':
                    var $505 = App$Render$txt$("TODO: create the renderer for this game state mode");
                    var $502 = $505;
                    break;
            };
            return $502;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.xkey':
                    var $507 = self.down;
                    var $508 = self.code;
                    var self = $507;
                    if (self) {
                        var self = ($508 === 68);
                        if (self) {
                            var self = _state$5;
                            switch (self._) {
                                case 'Web.Kaelin.State.init':
                                case 'Web.Kaelin.State.void':
                                    var $512 = List$nil;
                                    var $511 = $512;
                                    break;
                                case 'Web.Kaelin.State.game':
                                    var $513 = List$cons$(App$Action$state$(_state$5), List$nil);
                                    var $511 = $513;
                                    break;
                            };
                            var $510 = $511;
                        } else {
                            var $514 = List$nil;
                            var $510 = $514;
                        };
                        var $509 = $510;
                    } else {
                        var $515 = List$nil;
                        var $509 = $515;
                    };
                    var $506 = $509;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.post':
                    var $516 = List$nil;
                    var $506 = $516;
                    break;
            };
            return $506;
        });
        var $501 = App$new$(_init$2, _draw$3, _when$4);
        return $501;
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
        'Web.Kaelin.Entity.new': Web$Kaelin$Entity$new,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Col32.new': Col32$new,
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Pair.new': Pair$new,
        'Int.to_nat': Int$to_nat,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
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
        'Nat.show': Nat$show,
        'Int.show': Int$show,
        'Web.Kaelin.Coord.show': Web$Kaelin$Coord$show,
        'Map.set': Map$set,
        'Maybe.default': Maybe$default,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'Web.Kaelin.Map.push': Web$Kaelin$Map$push,
        'Int.new': Int$new,
        'Web.Kaelin.Draw.initial_ent': Web$Kaelin$Draw$initial_ent,
        'Web.Kaelin.State.game': Web$Kaelin$State$game,
        'App.Render.txt': App$Render$txt,
        'Image3D.set_length': Image3D$set_length,
        'Image3D.clear': Image3D$clear,
        'Web.Kaelin.Resources.map_size': Web$Kaelin$Resources$map_size,
        'U32.add': U32$add,
        'Web.Kaelin.Resources.hexagon_radius': Web$Kaelin$Resources$hexagon_radius,
        'U32.for': U32$for,
        'Nat.add': Nat$add,
        'Int.add': Int$add,
        'Int.neg': Int$neg,
        'Int.sub': Int$sub,
        'Word.fold': Word$fold,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'U32.to_nat': U32$to_nat,
        'Int.abs': Int$abs,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'Web.Kaelin.Coord.fit': Web$Kaelin$Coord$fit,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'Int.is_neg': Int$is_neg,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
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
        'Web.Kaelin.Draw.hexagon_border': Web$Kaelin$Draw$hexagon_border,
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'List.for': List$for,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Image3D.Draw.square': Image3D$Draw$square,
        'Web.Kaelin.Draw.tile': Web$Kaelin$Draw$tile,
        'Web.Kaelin.Draw.map': Web$Kaelin$Draw$map,
        'App.Render.pix': App$Render$pix,
        'App.Action': App$Action,
        'U16.eql': U16$eql,
        'App.Action.state': App$Action$state,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();

/***/ })

}]);
//# sourceMappingURL=927.index.js.map