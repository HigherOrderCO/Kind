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
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function Pair$(_A$1, _B$2) {
        var $188 = null;
        return $188;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $190 = self.capacity;
                var $191 = self.buffer;
                var $192 = Image3D$new$(_length$1, $190, $191);
                var $189 = $192;
                break;
        };
        return $189;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $193 = Image3D$set_length$(0, _img$1);
        return $193;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $194 = null;
        return $194;
    };
    const List = x0 => List$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $195 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $195;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $197 = self.val;
                var $198 = self.lft;
                var $199 = self.rgt;
                var self = $197;
                switch (self._) {
                    case 'Maybe.some':
                        var $201 = self.value;
                        var $202 = List$cons$($201, _list$3);
                        var _list0$7 = $202;
                        break;
                    case 'Maybe.none':
                        var $203 = _list$3;
                        var _list0$7 = $203;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($198, _list0$7);
                var _list2$9 = BitsMap$values$go$($199, _list1$8);
                var $200 = _list2$9;
                var $196 = $200;
                break;
            case 'BitsMap.new':
                var $204 = _list$3;
                var $196 = $204;
                break;
        };
        return $196;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function BitsMap$values$(_xs$2) {
        var $205 = BitsMap$values$go$(_xs$2, List$nil);
        return $205;
    };
    const BitsMap$values = x0 => BitsMap$values$(x0);

    function Image3D$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'Image3D.new':
                var $207 = self.length;
                var $208 = $207;
                var $206 = $208;
                break;
        };
        return $206;
    };
    const Image3D$get_len = x0 => Image3D$get_len$(x0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $210 = Word$e;
            var $209 = $210;
        } else {
            var $211 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $213 = self.pred;
                    var $214 = Word$o$(Word$trim$($211, $213));
                    var $212 = $214;
                    break;
                case 'Word.i':
                    var $215 = self.pred;
                    var $216 = Word$i$(Word$trim$($211, $215));
                    var $212 = $216;
                    break;
                case 'Word.e':
                    var $217 = Word$o$(Word$trim$($211, Word$e));
                    var $212 = $217;
                    break;
            };
            var $209 = $212;
        };
        return $209;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $219 = self.value;
                var $220 = $219;
                var $218 = $220;
                break;
            case 'Array.tie':
                var $221 = Unit$new;
                var $218 = $221;
                break;
        };
        return $218;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $222 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $222;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $224 = self.lft;
                var $225 = self.rgt;
                var $226 = Pair$new$($224, $225);
                var $223 = $226;
                break;
            case 'Array.tip':
                var $227 = Unit$new;
                var $223 = $227;
                break;
        };
        return $223;
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
                        var $228 = self.pred;
                        var $229 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $228);
                        return $229;
                    case 'Word.i':
                        var $230 = self.pred;
                        var $231 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $230);
                        return $231;
                    case 'Word.e':
                        var $232 = _nil$3;
                        return $232;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$get$(_idx$3, _arr$4) {
        var $233 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $235 = self.fst;
                    var $236 = _rec$6($235);
                    var $234 = $236;
                    break;
            };
            return $234;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $238 = self.snd;
                    var $239 = _rec$6($238);
                    var $237 = $239;
                    break;
            };
            return $237;
        }), _idx$3)(_arr$4);
        return $233;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const Image3D$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const Image3D$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $241 = self.pred;
                var $242 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $244 = self.pred;
                            var $245 = (_a$pred$9 => {
                                var $246 = Word$o$(Word$and$(_a$pred$9, $244));
                                return $246;
                            });
                            var $243 = $245;
                            break;
                        case 'Word.i':
                            var $247 = self.pred;
                            var $248 = (_a$pred$9 => {
                                var $249 = Word$o$(Word$and$(_a$pred$9, $247));
                                return $249;
                            });
                            var $243 = $248;
                            break;
                        case 'Word.e':
                            var $250 = (_a$pred$7 => {
                                var $251 = Word$e;
                                return $251;
                            });
                            var $243 = $250;
                            break;
                    };
                    var $243 = $243($241);
                    return $243;
                });
                var $240 = $242;
                break;
            case 'Word.i':
                var $252 = self.pred;
                var $253 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $255 = self.pred;
                            var $256 = (_a$pred$9 => {
                                var $257 = Word$o$(Word$and$(_a$pred$9, $255));
                                return $257;
                            });
                            var $254 = $256;
                            break;
                        case 'Word.i':
                            var $258 = self.pred;
                            var $259 = (_a$pred$9 => {
                                var $260 = Word$i$(Word$and$(_a$pred$9, $258));
                                return $260;
                            });
                            var $254 = $259;
                            break;
                        case 'Word.e':
                            var $261 = (_a$pred$7 => {
                                var $262 = Word$e;
                                return $262;
                            });
                            var $254 = $261;
                            break;
                    };
                    var $254 = $254($252);
                    return $254;
                });
                var $240 = $253;
                break;
            case 'Word.e':
                var $263 = (_b$4 => {
                    var $264 = Word$e;
                    return $264;
                });
                var $240 = $263;
                break;
        };
        var $240 = $240(_b$3);
        return $240;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $266 = self.pred;
                var $267 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $269 = self.pred;
                            var $270 = (_a$pred$9 => {
                                var $271 = Word$o$(Word$or$(_a$pred$9, $269));
                                return $271;
                            });
                            var $268 = $270;
                            break;
                        case 'Word.i':
                            var $272 = self.pred;
                            var $273 = (_a$pred$9 => {
                                var $274 = Word$i$(Word$or$(_a$pred$9, $272));
                                return $274;
                            });
                            var $268 = $273;
                            break;
                        case 'Word.e':
                            var $275 = (_a$pred$7 => {
                                var $276 = Word$e;
                                return $276;
                            });
                            var $268 = $275;
                            break;
                    };
                    var $268 = $268($266);
                    return $268;
                });
                var $265 = $267;
                break;
            case 'Word.i':
                var $277 = self.pred;
                var $278 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $280 = self.pred;
                            var $281 = (_a$pred$9 => {
                                var $282 = Word$i$(Word$or$(_a$pred$9, $280));
                                return $282;
                            });
                            var $279 = $281;
                            break;
                        case 'Word.i':
                            var $283 = self.pred;
                            var $284 = (_a$pred$9 => {
                                var $285 = Word$i$(Word$or$(_a$pred$9, $283));
                                return $285;
                            });
                            var $279 = $284;
                            break;
                        case 'Word.e':
                            var $286 = (_a$pred$7 => {
                                var $287 = Word$e;
                                return $287;
                            });
                            var $279 = $286;
                            break;
                    };
                    var $279 = $279($277);
                    return $279;
                });
                var $265 = $278;
                break;
            case 'Word.e':
                var $288 = (_b$4 => {
                    var $289 = Word$e;
                    return $289;
                });
                var $265 = $288;
                break;
        };
        var $265 = $265(_b$3);
        return $265;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => (a0 << a1);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $290 = Word$foldl$((_arr$6 => {
            var $291 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $291;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $293 = self.fst;
                    var $294 = self.snd;
                    var $295 = Array$tie$(_rec$7($293), $294);
                    var $292 = $295;
                    break;
            };
            return $292;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $297 = self.fst;
                    var $298 = self.snd;
                    var $299 = Array$tie$($297, _rec$7($298));
                    var $296 = $299;
                    break;
            };
            return $296;
        }), _idx$3)(_arr$5);
        return $290;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $300 = Array$mut$(_idx$3, (_x$6 => {
            var $301 = _val$4;
            return $301;
        }), _arr$5);
        return $300;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const Image3D$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const Image3D$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const Image3D$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function Image3D$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = Image3D$get_len$(_src$4);
        var _img$7 = (() => {
            var $303 = _img$5;
            var $304 = 0;
            var $305 = _len$6;
            let _img$8 = $303;
            for (let _i$7 = $304; _i$7 < $305; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $303 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $303;
            };
            return _img$8;
        })();
        var $302 = _img$7;
        return $302;
    };
    const Image3D$Draw$image = x0 => x1 => x2 => x3 => x4 => Image3D$Draw$image$(x0, x1, x2, x3, x4);

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
    const U32$length = a0 => (a0.length);
    const U32$slice = a0 => a1 => a2 => (a2.slice(a0, a1));
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function Image3D$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $306 = (parseInt(_chr$3, 16));
        return $306;
    };
    const Image3D$parse_byte = x0 => x1 => Image3D$parse_byte$(x0, x1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Image3D$parse$(_voxdata$1) {
        var _siz$2 = (((_voxdata$1.length) / 12) >>> 0);
        var _img$3 = Image3D$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $308 = _img$3;
            var $309 = 0;
            var $310 = _siz$2;
            let _img$5 = $308;
            for (let _i$4 = $309; _i$4 < $310; ++_i$4) {
                var _x$6 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $308 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $308;
            };
            return _img$5;
        })();
        var $307 = _img$4;
        return $307;
    };
    const Image3D$parse = x0 => Image3D$parse$(x0);
    const Web$Jogo$hero$hex = "0d00000000000e00000000000f00000000001000000000001100000000000c01000000000d01000000001101000000000b02000000000c02000000001202000000000b03000000001203000000000b04000000000c04000000001104000000000c05000000000d05000000000e05000000001005000000001105000000000e06000000000f06000000000e07000000000e08000000000f08000000000d09000000000e09000000000f09000000000c0a000000000d0a000000000e0a000000000f0a00000000100a000000000c0b000000000e0b00000000100b000000000b0c000000000c0c000000000e0c00000000100c00000000110c000000000b0d000000000e0d00000000110d000000000a0e000000000b0e000000000e0e00000000110e00000000120e000000000a0f000000000e0f00000000120f000000000910000000000a10000000000e10000000001210000000001310000000000911000000000e11000000001311000000000e12000000000d13000000000e13000000000f13000000000d14000000000f14000000000d15000000000f15000000000c16000000000d16000000000f16000000000c17000000000f17000000000c18000000000f18000000000c19000000001019000000000c1a00000000101a000000000b1b000000000c1b00000000101b000000000b1c00000000101c000000000b1d00000000101d00000000111d000000000b1e00000000111e000000000a1f000000000b1f00000000111f00000000";
    const Web$Jogo$hero = Image3D$parse$(Web$Jogo$hero$hex);

    function App$Render$pix$(_pixs$1) {
        var $311 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $311;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function App$Action$(_S$1) {
        var $312 = null;
        return $312;
    };
    const App$Action = x0 => App$Action$(x0);

    function BitsMap$(_A$1) {
        var $313 = null;
        return $313;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function App$Action$print$(_text$2) {
        var $314 = ({
            _: 'App.Action.print',
            'text': _text$2
        });
        return $314;
    };
    const App$Action$print = x0 => App$Action$print$(x0);

    function App$Action$watch$(_room$2) {
        var $315 = ({
            _: 'App.Action.watch',
            'room': _room$2
        });
        return $315;
    };
    const App$Action$watch = x0 => App$Action$watch$(x0);
    const Web$Jogo$room = "0x196581625482";
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$Action$post$(_room$2, _data$3) {
        var $316 = ({
            _: 'App.Action.post',
            'room': _room$2,
            'data': _data$3
        });
        return $316;
    };
    const App$Action$post = x0 => x1 => App$Action$post$(x0, x1);
    const Web$Jogo$command$A = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const Web$Jogo$command$D = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const Web$Jogo$command$W = "0x0000000000000000000000000000000000000000000000000000000000000003";
    const Web$Jogo$command$S = "0x0000000000000000000000000000000000000000000000000000000000000002";

    function String$cons$(_head$1, _tail$2) {
        var $317 = (String.fromCharCode(_head$1) + _tail$2);
        return $317;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$Action$state$(_value$2) {
        var $318 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $318;
    };
    const App$Action$state = x0 => App$Action$state$(x0);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $320 = self.pred;
                var $321 = (Word$to_bits$($320) + '0');
                var $319 = $321;
                break;
            case 'Word.i':
                var $322 = self.pred;
                var $323 = (Word$to_bits$($322) + '1');
                var $319 = $323;
                break;
            case 'Word.e':
                var $324 = Bits$e;
                var $319 = $324;
                break;
        };
        return $319;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $326 = Bits$e;
            var $325 = $326;
        } else {
            var $327 = self.charCodeAt(0);
            var $328 = self.slice(1);
            var $329 = (String$to_bits$($328) + (u16_to_bits($327)));
            var $325 = $329;
        };
        return $325;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Maybe$(_A$1) {
        var $330 = null;
        return $330;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

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
                        var $331 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $333 = self.lft;
                                var $334 = BitsMap$get$($331, $333);
                                var $332 = $334;
                                break;
                            case 'BitsMap.new':
                                var $335 = Maybe$none;
                                var $332 = $335;
                                break;
                        };
                        return $332;
                    case 'i':
                        var $336 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $338 = self.rgt;
                                var $339 = BitsMap$get$($336, $338);
                                var $337 = $339;
                                break;
                            case 'BitsMap.new':
                                var $340 = Maybe$none;
                                var $337 = $340;
                                break;
                        };
                        return $337;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $342 = self.val;
                                var $343 = $342;
                                var $341 = $343;
                                break;
                            case 'BitsMap.new':
                                var $344 = Maybe$none;
                                var $341 = $344;
                                break;
                        };
                        return $341;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $345 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $345;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $346 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $346;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $348 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $350 = self.val;
                        var $351 = self.lft;
                        var $352 = self.rgt;
                        var $353 = BitsMap$tie$($350, BitsMap$set$($348, _val$3, $351), $352);
                        var $349 = $353;
                        break;
                    case 'BitsMap.new':
                        var $354 = BitsMap$tie$(Maybe$none, BitsMap$set$($348, _val$3, BitsMap$new), BitsMap$new);
                        var $349 = $354;
                        break;
                };
                var $347 = $349;
                break;
            case 'i':
                var $355 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $357 = self.val;
                        var $358 = self.lft;
                        var $359 = self.rgt;
                        var $360 = BitsMap$tie$($357, $358, BitsMap$set$($355, _val$3, $359));
                        var $356 = $360;
                        break;
                    case 'BitsMap.new':
                        var $361 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($355, _val$3, BitsMap$new));
                        var $356 = $361;
                        break;
                };
                var $347 = $356;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $363 = self.lft;
                        var $364 = self.rgt;
                        var $365 = BitsMap$tie$(Maybe$some$(_val$3), $363, $364);
                        var $362 = $365;
                        break;
                    case 'BitsMap.new':
                        var $366 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $362 = $366;
                        break;
                };
                var $347 = $362;
                break;
        };
        return $347;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);
    const Bool$and = a0 => a1 => (a0 && a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Jogo$command$(_user$1, _cmd$2, _state$3) {
        var _key$4 = String$to_bits$(_user$1);
        var self = BitsMap$get$(_key$4, _state$3);
        switch (self._) {
            case 'Maybe.some':
                var $368 = self.value;
                var self = $368;
                switch (self._) {
                    case 'Pair.new':
                        var $370 = self.fst;
                        var $371 = self.snd;
                        var _spd$8 = 3;
                        var _p_x$9 = $370;
                        var _p_y$10 = $371;
                        var self = (_cmd$2 === Web$Jogo$command$A);
                        if (self) {
                            var $373 = BitsMap$set$(_key$4, Pair$new$((Math.max(_p_x$9 - _spd$8, 0)), _p_y$10), _state$3);
                            var $372 = $373;
                        } else {
                            var self = (_cmd$2 === Web$Jogo$command$D);
                            if (self) {
                                var $375 = BitsMap$set$(_key$4, Pair$new$(((_p_x$9 + _spd$8) >>> 0), _p_y$10), _state$3);
                                var $374 = $375;
                            } else {
                                var self = (_cmd$2 === Web$Jogo$command$W);
                                if (self) {
                                    var $377 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, (Math.max(_p_y$10 - _spd$8, 0))), _state$3);
                                    var $376 = $377;
                                } else {
                                    var self = (_cmd$2 === Web$Jogo$command$S);
                                    if (self) {
                                        var $379 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, ((_p_y$10 + _spd$8) >>> 0)), _state$3);
                                        var $378 = $379;
                                    } else {
                                        var $380 = _state$3;
                                        var $378 = $380;
                                    };
                                    var $376 = $378;
                                };
                                var $374 = $376;
                            };
                            var $372 = $374;
                        };
                        var $369 = $372;
                        break;
                };
                var $367 = $369;
                break;
            case 'Maybe.none':
                var $381 = BitsMap$set$(_key$4, Pair$new$(128, 128), _state$3);
                var $367 = $381;
                break;
        };
        return $367;
    };
    const Web$Jogo$command = x0 => x1 => x2 => Web$Jogo$command$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $382 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $382;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Jogo = (() => {
        var _img$1 = Image3D$alloc_capacity$(3200);
        var _init$2 = BitsMap$new;
        var _draw$3 = (_state$3 => {
            var _img$4 = Image3D$clear$(_img$1);
            var _img$5 = (() => {
                var $386 = _img$4;
                var $387 = BitsMap$values$(_state$3);
                let _img$6 = $386;
                let _pos$5;
                while ($387._ === 'List.cons') {
                    _pos$5 = $387.head;
                    var self = _pos$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $388 = self.fst;
                            var $389 = self.snd;
                            var $390 = Image3D$Draw$image$($388, $389, 0, Web$Jogo$hero, _img$6);
                            var $386 = $390;
                            break;
                    };
                    _img$6 = $386;
                    $387 = $387.tail;
                }
                return _img$6;
            })();
            var $384 = App$Render$pix$(_img$5);
            return $384;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.xkey':
                    var $392 = self.down;
                    var $393 = self.code;
                    var self = $392;
                    if (self) {
                        var self = ($393 === 65);
                        if (self) {
                            var $396 = List$cons$(App$Action$post$(Web$Jogo$room, Web$Jogo$command$A), List$nil);
                            var $395 = $396;
                        } else {
                            var self = ($393 === 68);
                            if (self) {
                                var $398 = List$cons$(App$Action$post$(Web$Jogo$room, Web$Jogo$command$D), List$nil);
                                var $397 = $398;
                            } else {
                                var self = ($393 === 87);
                                if (self) {
                                    var $400 = List$cons$(App$Action$post$(Web$Jogo$room, Web$Jogo$command$W), List$nil);
                                    var $399 = $400;
                                } else {
                                    var self = ($393 === 83);
                                    if (self) {
                                        var $402 = List$cons$(App$Action$post$(Web$Jogo$room, Web$Jogo$command$S), List$nil);
                                        var $401 = $402;
                                    } else {
                                        var $403 = List$nil;
                                        var $401 = $403;
                                    };
                                    var $399 = $401;
                                };
                                var $397 = $399;
                            };
                            var $395 = $397;
                        };
                        var $394 = $395;
                    } else {
                        var $404 = List$nil;
                        var $394 = $404;
                    };
                    var $391 = $394;
                    break;
                case 'App.Event.post':
                    var $405 = self.addr;
                    var $406 = self.data;
                    var $407 = List$cons$(App$Action$print$((">> received post by " + ($405 + (": " + $406)))), List$cons$(App$Action$state$(Web$Jogo$command$($405, $406, _state$5)), List$nil));
                    var $391 = $407;
                    break;
                case 'App.Event.init':
                    var $408 = List$cons$(App$Action$print$(">> started app"), List$cons$(App$Action$watch$(Web$Jogo$room), List$nil));
                    var $391 = $408;
                    break;
                case 'App.Event.tick':
                    var $409 = List$nil;
                    var $391 = $409;
                    break;
            };
            return $391;
        });
        var $383 = App$new$(_init$2, _draw$3, _when$4);
        return $383;
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
        'BitsMap.new': BitsMap$new,
        'Pair': Pair,
        'Image3D.set_length': Image3D$set_length,
        'Image3D.clear': Image3D$clear,
        'List.for': List$for,
        'List': List,
        'List.cons': List$cons,
        'BitsMap.values.go': BitsMap$values$go,
        'List.nil': List$nil,
        'BitsMap.values': BitsMap$values,
        'Image3D.get_len': Image3D$get_len,
        'U32.for': U32$for,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair.new': Pair$new,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'Image3D.get_pos': Image3D$get_pos,
        'U32.add': U32$add,
        'Image3D.get_col': Image3D$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'Image3D.set_pos': Image3D$set_pos,
        'Image3D.set_col': Image3D$set_col,
        'Image3D.push': Image3D$push,
        'Image3D.Draw.image': Image3D$Draw$image,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.length': U32$length,
        'U32.slice': U32$slice,
        'U32.read_base': U32$read_base,
        'Image3D.parse_byte': Image3D$parse_byte,
        'Col32.new': Col32$new,
        'Image3D.parse': Image3D$parse,
        'Web.Jogo.hero.hex': Web$Jogo$hero$hex,
        'Web.Jogo.hero': Web$Jogo$hero,
        'App.Render.pix': App$Render$pix,
        'App.Action': App$Action,
        'BitsMap': BitsMap,
        'App.Action.print': App$Action$print,
        'App.Action.watch': App$Action$watch,
        'Web.Jogo.room': Web$Jogo$room,
        'U16.eql': U16$eql,
        'App.Action.post': App$Action$post,
        'Web.Jogo.command.A': Web$Jogo$command$A,
        'Web.Jogo.command.D': Web$Jogo$command$D,
        'Web.Jogo.command.W': Web$Jogo$command$W,
        'Web.Jogo.command.S': Web$Jogo$command$S,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.Action.state': App$Action$state,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'BitsMap.get': BitsMap$get,
        'BitsMap.tie': BitsMap$tie,
        'Maybe.some': Maybe$some,
        'BitsMap.set': BitsMap$set,
        'Bool.and': Bool$and,
        'String.eql': String$eql,
        'Web.Jogo.command': Web$Jogo$command,
        'App.new': App$new,
        'Web.Jogo': Web$Jogo,
    };
})();