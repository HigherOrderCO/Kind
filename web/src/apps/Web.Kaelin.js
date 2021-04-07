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
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));
    const U32$slice = a0 => a1 => a2 => (a2.slice(a0, a1));
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function Image3D$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $233 = (parseInt(_chr$3, 16));
        return $233;
    };
    const Image3D$parse_byte = x0 => x1 => Image3D$parse_byte$(x0, x1);

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
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $260 = Word$e;
            var $259 = $260;
        } else {
            var $261 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $263 = self.pred;
                    var $264 = Word$o$(Word$trim$($261, $263));
                    var $262 = $264;
                    break;
                case 'Word.i':
                    var $265 = self.pred;
                    var $266 = Word$i$(Word$trim$($261, $265));
                    var $262 = $266;
                    break;
                case 'Word.e':
                    var $267 = Word$o$(Word$trim$($261, Word$e));
                    var $262 = $267;
                    break;
            };
            var $259 = $262;
        };
        return $259;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $269 = self.value;
                var $270 = $269;
                var $268 = $270;
                break;
            case 'Array.tie':
                var $271 = Unit$new;
                var $268 = $271;
                break;
        };
        return $268;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $272 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $272;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $274 = self.lft;
                var $275 = self.rgt;
                var $276 = Pair$new$($274, $275);
                var $273 = $276;
                break;
            case 'Array.tip':
                var $277 = Unit$new;
                var $273 = $277;
                break;
        };
        return $273;
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
                        var $278 = self.pred;
                        var $279 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $278);
                        return $279;
                    case 'Word.i':
                        var $280 = self.pred;
                        var $281 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $280);
                        return $281;
                    case 'Word.e':
                        var $282 = _nil$3;
                        return $282;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $283 = Word$foldl$((_arr$6 => {
            var $284 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $284;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $286 = self.fst;
                    var $287 = self.snd;
                    var $288 = Array$tie$(_rec$7($286), $287);
                    var $285 = $288;
                    break;
            };
            return $285;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $290 = self.fst;
                    var $291 = self.snd;
                    var $292 = Array$tie$($290, _rec$7($291));
                    var $289 = $292;
                    break;
            };
            return $289;
        }), _idx$3)(_arr$5);
        return $283;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $293 = Array$mut$(_idx$3, (_x$6 => {
            var $294 = _val$4;
            return $294;
        }), _arr$5);
        return $293;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const Image3D$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const Image3D$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $296 = self.capacity;
                var $297 = self.buffer;
                var $298 = Image3D$new$(_length$1, $296, $297);
                var $295 = $298;
                break;
        };
        return $295;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);
    const Image3D$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function Image3D$parse$(_voxdata$1) {
        var _siz$2 = (((_voxdata$1.length) / 12) >>> 0);
        var _img$3 = Image3D$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $300 = _img$3;
            var $301 = 0;
            var $302 = _siz$2;
            let _img$5 = $300;
            for (let _i$4 = $301; _i$4 < $302; ++_i$4) {
                var _x$6 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $300 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $300;
            };
            return _img$5;
        })();
        var $299 = _img$4;
        return $299;
    };
    const Image3D$parse = x0 => Image3D$parse$(x0);
    const Kaelin$Assets$chars$croni_d_1 = Image3D$parse$("7f7516351d4d807516351d4d7d7615351d4d7e7615351d4d7f76156a3a868076158e4a9d817615351d4d827615351d4d7c7714351d4d7d77146a3a867e77146a3a867f77148e4a9d8077146a3a868177146a3a868277146a3a86837714351d4d7b7813351d4d7c78136a3a867d78136a3a867e78136a3a867f78136a3a868078136a3a868178136a3a868278136a3a868378136a3a86847813351d4d7a7912351d4d7b79126a3a867c79126a3a867d79126a3a867e79126a3a867f79126a3a868079126a3a868179126a3a868279126a3a868379126a3a868479126a3a86857912351d4d7a7a11351d4d7b7a116a3a867c7a116a3a867d7a116a3a867e7a116a3a867f7a116a3a86807a116a3a86817a116a3a86827a116a3a86837a116a3a86847a116a3a86857a11351d4d797b10351d4d7a7b106a3a867b7b106a3a867c7b106a3a867d7b106a3a867e7b106a3a867f7b106a3a86807b106a3a86817b106a3a86827b106a3a86837b106a3a86847b106a3a86857b106a3a86867b10351d4d797c0f351d4d7a7c0f6a3a867b7c0f6a3a867c7c0f602d807d7c0f602d807e7c0f6a3a867f7c0f6a3a86807c0f6a3a86817c0f6a3a86827c0f602d80837c0f602d80847c0f6a3a86857c0f6a3a86867c0f351d4d797d0e351d4d7a7d0e602d807b7d0e602d807c7d0e351d4d7d7d0e351d4d7e7d0e6a3a867f7d0e6a3a86807d0e6a3a86817d0e6a3a86827d0e351d4d837d0e351d4d847d0e602d80857d0e602d80867d0e351d4d797e0d351d4d7a7e0d602d807b7e0d351d4d7c7e0d351d4d7d7e0d531e487e7e0d351d4d7f7e0d6a3a86807e0d6a3a86817e0d351d4d827e0d531e48837e0d351d4d847e0d351d4d857e0d4a3580867e0d351d4d797f0c351d4d7a7f0c4a35807b7f0c351d4d7c7f0c531e487d7f0cdf3e467e7f0c531e487f7f0c351d4d807f0c351d4d817f0c531e48827f0cdf3e46837f0c531e48847f0c351d4d857f0c4a3580867f0c351d4d7a800b351d4d7b800b4a35807c800b351d4d7d800b531e487e800b351d4d7f800b351d4d80800b351d4d81800b351d4d82800b531e4883800b351d4d84800b4a358085800b351d4d7b810a351d4d7c810a4a35807d810a8e4a9d7e810a351d4d7f810a351d4d80810a351d4d81810a351d4d82810a8e4a9d83810a4a358084810a351d4d7d8209351d4d7e8209602d807f8209602d808082094a3580818209602d80828209351d4d7c8308351d4d7d83086a3a867e83086a3a867f83086a3a868083084a35808183086a3a868283086a3a86838308351d4d7c8407351d4d7d84076a3a867e84076a3a867f84076a3a868084074a35808184076a3a868284076a3a86838407351d4d7c8506351d4d7d85068e4a9d7e85066a3a867f85066a3a868085064a35808185066a3a868285068e4a9d838506351d4d7d8605351d4d7e8605351d4d7f8605351d4d808605351d4d818605351d4d828605351d4d818704351d4d828704351d4d");
    const Web$Jogo$hero$hex = "0d00000000000e00000000000f00000000001000000000001100000000000c01000000000d01000000001101000000000b02000000000c02000000001202000000000b03000000001203000000000b04000000000c04000000001104000000000c05000000000d05000000000e05000000001005000000001105000000000e06000000000f06000000000e07000000000e08000000000f08000000000d09000000000e09000000000f09000000000c0a000000000d0a000000000e0a000000000f0a00000000100a000000000c0b000000000e0b00000000100b000000000b0c000000000c0c000000000e0c00000000100c00000000110c000000000b0d000000000e0d00000000110d000000000a0e000000000b0e000000000e0e00000000110e00000000120e000000000a0f000000000e0f00000000120f000000000910000000000a10000000000e10000000001210000000001310000000000911000000000e11000000001311000000000e12000000000d13000000000e13000000000f13000000000d14000000000f14000000000d15000000000f15000000000c16000000000d16000000000f16000000000c17000000000f17000000000c18000000000f18000000000c19000000001019000000000c1a00000000101a000000000b1b000000000c1b00000000101b000000000b1c00000000101c000000000b1d00000000101d00000000111d000000000b1e00000000111e000000000a1f000000000b1f00000000111f00000000";
    const Web$Jogo$hero = Image3D$parse$(Web$Jogo$hero$hex);
    const Kaelin$Assets$dark_grass_0 = Image3D$parse$("787801347e57797801408d647a7801469e657b7801469e657c7801408d647d7801347e577e7801408d647f7801469e65807801469e65817801469e65827801408d64837801469e65847801469e65857801408d64867801408d64877801347e57787901408d64797901469e657a7901469e657b7901469e657c7901408d647d7901408d647e7901408d647f7901469e65807901469e65817901408d64827901408d64837901408d64847901408d64857901408d64867901408d64877901408d64787a01408d64797a01469e657a7a01469e657b7a01408d647c7a01469e657d7a01469e657e7a01408d647f7a01408d64807a01408d64817a01408d64827a01408d64837a01408d64847a01469e65857a01469e65867a01469e65877a01408d64787b01408d64797b01408d647a7b01408d647b7b01408d647c7b01469e657d7b01469e657e7b01408d647f7b01408d64807b01408d64817b01469e65827b01469e65837b01408d64847b01469e65857b01469e65867b01469e65877b01408d64787c01408d64797c01469e657a7c01408d647b7c01408d647c7c01408d647d7c01408d647e7c01408d647f7c01408d64807c01469e65817c01469e65827c01469e65837c01408d64847c01408d64857c01469e65867c01469e65877c01408d64787d01469e65797d01469e657a7d01469e657b7d01347e577c7d01408d647d7d01469e657e7d01469e657f7d01408d64807d01469e65817d01469e65827d01408d64837d01408d64847d01408d64857d01347e57867d01347e57877d01408d64787e01469e65797e01469e657a7e01408d647b7e01347e577c7e01347e577d7e01469e657e7e01469e657f7e01408d64807e01408d64817e01347e57827e01408d64837e01408d64847e01408d64857e01408d64867e01347e57877e01408d64787f01408d64797f01408d647a7f01408d647b7f01408d647c7f01408d647d7f01408d647e7f01408d647f7f01408d64807f01408d64817f01347e57827f01347e57837f01408d64847f01469e65857f01469e65867f01408d64877f01408d64788001347e57798001347e577a8001469e657b8001469e657c8001408d647d8001408d647e8001469e657f8001469e65808001408d64818001469e65828001469e65838001408d64848001469e65858001469e65868001469e65878001408d64788101347e57798101408d647a8101469e657b8101469e657c8101408d647d8101469e657e8101469e657f8101469e65808101408d64818101469e65828101469e65838101408d64848101408d64858101469e65868101469e65878101408d64788201408d64798201408d647a8201408d647b8201408d647c8201408d647d8201469e657e8201469e657f8201408d64808201408d64818201408d64828201408d64838201408d64848201408d64858201408d64868201408d64878201408d64788301469e65798301408d647a8301408d647b8301408d647c8301408d647d8301408d647e8301408d647f8301469e65808301469e65818301408d64828301347e57838301347e57848301408d64858301408d64868301408d64878301469e65788401469e65798401408d647a8401408d647b8401469e657c8401469e657d8401408d647e8401469e657f8401469e65808401469e65818401408d64828401347e57838401408d64848401469e65858401469e65868401408d64878401469e65788501408d64798501408d647a8501469e657b8501469e657c8501469e657d8501408d647e8501469e657f8501469e65808501408d64818501408d64828501408d64838501408d64848501469e65858501469e65868501469e65878501408d64788601408d64798601408d647a8601469e657b8601469e657c8601408d647d8601408d647e8601408d647f8601408d64808601408d64818601408d64828601408d64838601408d64848601408d64858601469e65868601469e65878601408d64788701347e57798701408d647a8701408d647b8701408d647c8701408d647d8701347e577e8701347e577f8701408d64808701469e65818701469e65828701408d64838701469e65848701469e65858701408d64868701408d64878701408d64");

    function Web$Kaelin$Entity$new$(_img$1) {
        var $303 = ({
            _: 'Web.Kaelin.Entity.new',
            'img': _img$1
        });
        return $303;
    };
    const Web$Kaelin$Entity$new = x0 => Web$Kaelin$Entity$new$(x0);

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $304 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $304;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);

    function String$cons$(_head$1, _tail$2) {
        var $305 = (String.fromCharCode(_head$1) + _tail$2);
        return $305;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Int$to_nat$(_a$1) {
        var $306 = _a$1((_a$x$2 => _a$y$3 => {
            var self = _a$y$3;
            if (self === 0n) {
                var $308 = Pair$new$(Bool$false, _a$x$2);
                var $307 = $308;
            } else {
                var $309 = (self - 1n);
                var $310 = Pair$new$(Bool$true, _a$y$3);
                var $307 = $310;
            };
            return $307;
        }));
        return $306;
    };
    const Int$to_nat = x0 => Int$to_nat$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $312 = self.head;
                var $313 = self.tail;
                var $314 = _cons$5($312)(List$fold$($313, _nil$4, _cons$5));
                var $311 = $314;
                break;
            case 'List.nil':
                var $315 = _nil$4;
                var $311 = $315;
                break;
        };
        return $311;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $316 = null;
        return $316;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $317 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $317;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $318 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $318;
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
                    var $319 = Either$left$(_n$1);
                    return $319;
                } else {
                    var $320 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $322 = Either$right$(Nat$succ$($320));
                        var $321 = $322;
                    } else {
                        var $323 = (self - 1n);
                        var $324 = Nat$sub_rem$($323, $320);
                        var $321 = $324;
                    };
                    return $321;
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
                        var $325 = self.value;
                        var $326 = Nat$div_mod$go$($325, _m$2, Nat$succ$(_d$3));
                        return $326;
                    case 'Either.right':
                        var $327 = Pair$new$(_d$3, _n$1);
                        return $327;
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
        var $328 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $328;
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
                        var $329 = self.fst;
                        var $330 = self.snd;
                        var self = $329;
                        if (self === 0n) {
                            var $332 = List$cons$($330, _res$3);
                            var $331 = $332;
                        } else {
                            var $333 = (self - 1n);
                            var $334 = Nat$to_base$go$(_base$1, $329, List$cons$($330, _res$3));
                            var $331 = $334;
                        };
                        return $331;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $335 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $335;
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
                    var $336 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $336;
                } else {
                    var $337 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $339 = _r$3;
                        var $338 = $339;
                    } else {
                        var $340 = (self - 1n);
                        var $341 = Nat$mod$go$($340, $337, Nat$succ$(_r$3));
                        var $338 = $341;
                    };
                    return $338;
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
        var $342 = null;
        return $342;
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
                        var $343 = self.head;
                        var $344 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $346 = Maybe$some$($343);
                            var $345 = $346;
                        } else {
                            var $347 = (self - 1n);
                            var $348 = List$at$($347, $344);
                            var $345 = $348;
                        };
                        return $345;
                    case 'List.nil':
                        var $349 = Maybe$none;
                        return $349;
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
                    var $352 = self.value;
                    var $353 = $352;
                    var $351 = $353;
                    break;
                case 'Maybe.none':
                    var $354 = 35;
                    var $351 = $354;
                    break;
            };
            var $350 = $351;
        } else {
            var $355 = 35;
            var $350 = $355;
        };
        return $350;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $356 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $357 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $357;
        }));
        return $356;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $358 = Nat$to_string_base$(10n, _n$1);
        return $358;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Int$show$(_a$1) {
        var _result$2 = Int$to_nat$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $360 = self.fst;
                var $361 = self.snd;
                var self = $360;
                if (self) {
                    var $363 = ("+" + Nat$show$($361));
                    var $362 = $363;
                } else {
                    var $364 = ("-" + Nat$show$($361));
                    var $362 = $364;
                };
                var $359 = $362;
                break;
        };
        return $359;
    };
    const Int$show = x0 => Int$show$(x0);

    function Web$Kaelin$Coord$show$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $366 = self.i;
                var $367 = self.j;
                var $368 = (Int$show$($366) + (":" + Int$show$($367)));
                var $365 = $368;
                break;
        };
        return $365;
    };
    const Web$Kaelin$Coord$show = x0 => Web$Kaelin$Coord$show$(x0);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $369 = BitsMap$set$(String$to_bits$(_key$2), _val$3, _map$4);
        return $369;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $371 = self.value;
                var $372 = $371;
                var $370 = $372;
                break;
            case 'Maybe.none':
                var $373 = _a$3;
                var $370 = $373;
                break;
        };
        return $370;
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
                        var $374 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $376 = self.lft;
                                var $377 = BitsMap$get$($374, $376);
                                var $375 = $377;
                                break;
                            case 'BitsMap.new':
                                var $378 = Maybe$none;
                                var $375 = $378;
                                break;
                        };
                        return $375;
                    case 'i':
                        var $379 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $381 = self.rgt;
                                var $382 = BitsMap$get$($379, $381);
                                var $380 = $382;
                                break;
                            case 'BitsMap.new':
                                var $383 = Maybe$none;
                                var $380 = $383;
                                break;
                        };
                        return $380;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $385 = self.val;
                                var $386 = $385;
                                var $384 = $386;
                                break;
                            case 'BitsMap.new':
                                var $387 = Maybe$none;
                                var $384 = $387;
                                break;
                        };
                        return $384;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $388 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $388;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Web$Kaelin$Map$push$(_coord$1, _ent$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$show$(_coord$1);
        var $389 = Map$set$(_key$4, List$cons$(_ent$2, Maybe$default$(Map$get$(_key$4, _map$3), List$nil)), _map$3);
        return $389;
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
                    var $390 = _new$4(Nat$zero)(_y$2);
                    return $390;
                } else {
                    var $391 = (self - 1n);
                    var self = _y$2;
                    if (self === 0n) {
                        var $393 = _new$4(Nat$succ$($391))(Nat$zero);
                        var $392 = $393;
                    } else {
                        var $394 = (self - 1n);
                        var $395 = Int$new$($391, $394, _new$4);
                        var $392 = $395;
                    };
                    return $392;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Int$new = x0 => x1 => x2 => Int$new$(x0, x1, x2);

    function Web$Kaelin$Draw$initial_ent$(_map$1) {
        var _croni$2 = Kaelin$Assets$chars$croni_d_1;
        var _hero$3 = Web$Jogo$hero;
        var _grass$4 = Kaelin$Assets$dark_grass_0;
        var _ent_croni$5 = Web$Kaelin$Entity$new$(_croni$2);
        var _ent_hero$6 = Web$Kaelin$Entity$new$(_hero$3);
        var _ent_grass$7 = Web$Kaelin$Entity$new$(_grass$4);
        var _new_coord$8 = Web$Kaelin$Coord$new;
        var _map$9 = Web$Kaelin$Map$push$(_new_coord$8(Int$new(0n)(0n))(Int$new(0n)(0n)), _ent_hero$6, _map$1);
        var _map$10 = Web$Kaelin$Map$push$(_new_coord$8(Int$new(1n)(0n))(Int$new(2n)(0n)), _ent_croni$5, _map$9);
        var _map$11 = Web$Kaelin$Map$push$(_new_coord$8(Int$new(1n)(0n))(Int$new(3n)(0n)), _ent_grass$7, _map$10);
        var $396 = _map$11;
        return $396;
    };
    const Web$Kaelin$Draw$initial_ent = x0 => Web$Kaelin$Draw$initial_ent$(x0);

    function Web$Kaelin$State$game$(_room$1, _tick$2, _pos$3, _map$4) {
        var $397 = ({
            _: 'Web.Kaelin.State.game',
            'room': _room$1,
            'tick': _tick$2,
            'pos': _pos$3,
            'map': _map$4
        });
        return $397;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => Web$Kaelin$State$game$(x0, x1, x2, x3);

    function App$Render$txt$(_text$1) {
        var $398 = ({
            _: 'App.Render.txt',
            'text': _text$1
        });
        return $398;
    };
    const App$Render$txt = x0 => App$Render$txt$(x0);

    function Image3D$clear$(_img$1) {
        var $399 = Image3D$set_length$(0, _img$1);
        return $399;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);
    const Web$Kaelin$Resources$map_size = 5;
    const Web$Kaelin$Resources$hexagon_radius = 10;
    const Nat$add = a0 => a1 => (a0 + a1);

    function Int$add$(_a$1, _b$2) {
        var $400 = _a$1((_a$x$3 => _a$y$4 => {
            var $401 = _b$2((_b$x$5 => _b$y$6 => {
                var $402 = Int$new((_a$x$3 + _b$x$5))((_a$y$4 + _b$y$6));
                return $402;
            }));
            return $401;
        }));
        return $400;
    };
    const Int$add = x0 => x1 => Int$add$(x0, x1);

    function Int$neg$(_a$1) {
        var $403 = _a$1((_a$x$2 => _a$y$3 => {
            var $404 = Int$new(_a$y$3)(_a$x$2);
            return $404;
        }));
        return $403;
    };
    const Int$neg = x0 => Int$neg$(x0);

    function Int$sub$(_a$1, _b$2) {
        var $405 = Int$add$(_a$1, Int$neg$(_b$2));
        return $405;
    };
    const Int$sub = x0 => x1 => Int$sub$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $407 = self.pred;
                var $408 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $407));
                var $406 = $408;
                break;
            case 'Word.i':
                var $409 = self.pred;
                var $410 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $409));
                var $406 = $410;
                break;
            case 'Word.e':
                var $411 = _nil$3;
                var $406 = $411;
                break;
        };
        return $406;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $412 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $413 = Nat$succ$((2n * _x$4));
            return $413;
        }), _word$2);
        return $412;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function U32$to_nat$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $415 = u32_to_word(self);
                var $416 = Word$to_nat$($415);
                var $414 = $416;
                break;
        };
        return $414;
    };
    const U32$to_nat = x0 => U32$to_nat$(x0);

    function Int$abs$(_a$1) {
        var _result$2 = Int$to_nat$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $418 = self.snd;
                var $419 = $418;
                var $417 = $419;
                break;
        };
        return $417;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $421 = Bool$true;
                var $420 = $421;
                break;
            case 'Cmp.gtn':
                var $422 = Bool$false;
                var $420 = $422;
                break;
        };
        return $420;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $423 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $423;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $425 = self.i;
                var $426 = self.j;
                var _i$5 = $425;
                var _j$6 = $426;
                var _sum$7 = Int$add$(_i$5, _j$6);
                var _abs$8 = Int$abs$(_sum$7);
                var _abs$9 = (Number(_abs$8));
                var $427 = (_abs$9 <= _map_size$2);
                var $424 = $427;
                break;
        };
        return $424;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);

    function Int$is_neg$(_a$1) {
        var $428 = _a$1((_a$x$2 => _a$y$3 => {
            var $429 = (_a$x$2 > _a$y$3);
            return $429;
        }));
        return $428;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var _rad$2 = Web$Kaelin$Resources$hexagon_radius;
        var _hlf$3 = ((_rad$2 / 2) >>> 0);
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $431 = self.i;
                var $432 = self.j;
                var _i$6 = $431;
                var _j$7 = $432;
                var $433 = _i$6((_i$x$8 => _i$y$9 => {
                    var $434 = _j$7((_j$x$10 => _j$y$11 => {
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
                                var $437 = Pair$new$(_cx$17, _cy$18);
                                var $436 = $437;
                            } else {
                                var _cx$16 = ((_cx$12 + (((Number(_j$y$11)) * _rad$2) >>> 0)) >>> 0);
                                var _cx$17 = (Math.max(_cx$16 - (((Number(_i$x$8)) * ((_rad$2 * 2) >>> 0)) >>> 0), 0));
                                var _cy$18 = ((_cy$13 + (((Number(_j$y$11)) * ((_hlf$3 * 3) >>> 0)) >>> 0)) >>> 0);
                                var $438 = Pair$new$(_cx$17, _cy$18);
                                var $436 = $438;
                            };
                            var $435 = $436;
                        } else {
                            var self = _is_neg_j$15;
                            if (self) {
                                var _cx$16 = (Math.max(_cx$12 - (((Number(_j$x$10)) * _rad$2) >>> 0), 0));
                                var _cx$17 = ((_cx$16 + (((Number(_i$y$9)) * ((_rad$2 * 2) >>> 0)) >>> 0)) >>> 0);
                                var _cy$18 = (Math.max(_cy$13 - (((Number(_j$x$10)) * ((_hlf$3 * 3) >>> 0)) >>> 0), 0));
                                var $440 = Pair$new$(_cx$17, _cy$18);
                                var $439 = $440;
                            } else {
                                var _cx$16 = ((_cx$12 + (((Number(_j$y$11)) * _rad$2) >>> 0)) >>> 0);
                                var _cx$17 = ((_cx$16 + (((Number(_i$y$9)) * ((_rad$2 * 2) >>> 0)) >>> 0)) >>> 0);
                                var _cy$18 = ((_cy$13 + (((Number(_j$y$11)) * ((_hlf$3 * 3) >>> 0)) >>> 0)) >>> 0);
                                var $441 = Pair$new$(_cx$17, _cy$18);
                                var $439 = $441;
                            };
                            var $435 = $439;
                        };
                        return $435;
                    }));
                    return $434;
                }));
                var $430 = $433;
                break;
        };
        return $430;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);

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
                var $444 = _img$12;
                var $445 = 0;
                var $446 = _rad$4;
                let _img$27 = $444;
                for (let _i$26 = $445; _i$26 < $446; ++_i$26) {
                    var _px$28 = _v1x$16;
                    var _py$29 = ((_v1y$17 + _i$26) >>> 0);
                    var $444 = ((_img$27.buffer[_img$27.length * 2] = ((0 | _px$28 | (_py$29 << 12) | (_cz$3 << 24))), _img$27.buffer[_img$27.length * 2 + 1] = _col$5, _img$27.length++, _img$27));
                    _img$27 = $444;
                };
                return _img$27;
            })();
            var $443 = _img$26;
            var _img$26 = $443;
        } else {
            var $447 = _img$12;
            var _img$26 = $447;
        };
        var self = _draw_d$9;
        if (self) {
            var _img$27 = (() => {
                var $449 = _img$26;
                var $450 = 0;
                var $451 = _rad$4;
                let _img$28 = $449;
                for (let _i$27 = $450; _i$27 < $451; ++_i$27) {
                    var _px$29 = _v3x$20;
                    var _py$30 = ((_v3y$21 + _i$27) >>> 0);
                    var $449 = ((_img$28.buffer[_img$28.length * 2] = ((0 | _px$29 | (_py$30 << 12) | (_cz$3 << 24))), _img$28.buffer[_img$28.length * 2 + 1] = _col$5, _img$28.length++, _img$28));
                    _img$28 = $449;
                };
                return _img$28;
            })();
            var $448 = _img$27;
            var _img$27 = $448;
        } else {
            var $452 = _img$26;
            var _img$27 = $452;
        };
        var self = _draw_b$7;
        if (self) {
            var _img$28 = (() => {
                var $454 = _img$27;
                var $455 = 0;
                var $456 = _rad$4;
                let _img$29 = $454;
                for (let _i$28 = $455; _i$28 < $456; ++_i$28) {
                    var _px$30 = ((_v2x$18 + _i$28) >>> 0);
                    var _py$31 = ((_v2y$19 + ((_i$28 / 2) >>> 0)) >>> 0);
                    var $454 = ((_img$29.buffer[_img$29.length * 2] = ((0 | _px$30 | (_py$31 << 12) | (_cz$3 << 24))), _img$29.buffer[_img$29.length * 2 + 1] = _col$5, _img$29.length++, _img$29));
                    _img$29 = $454;
                };
                return _img$29;
            })();
            var $453 = _img$28;
            var _img$28 = $453;
        } else {
            var $457 = _img$27;
            var _img$28 = $457;
        };
        var self = _draw_c$8;
        if (self) {
            var _img$29 = (() => {
                var $459 = _img$28;
                var $460 = 0;
                var $461 = _rad$4;
                let _img$30 = $459;
                for (let _i$29 = $460; _i$29 < $461; ++_i$29) {
                    var _px$31 = (Math.max(_v2x$18 - _i$29, 0));
                    var _py$32 = ((_v2y$19 + ((_i$29 / 2) >>> 0)) >>> 0);
                    var $459 = ((_img$30.buffer[_img$30.length * 2] = ((0 | _px$31 | (_py$32 << 12) | (_cz$3 << 24))), _img$30.buffer[_img$30.length * 2 + 1] = _col$5, _img$30.length++, _img$30));
                    _img$30 = $459;
                };
                return _img$30;
            })();
            var $458 = _img$29;
            var _img$29 = $458;
        } else {
            var $462 = _img$28;
            var _img$29 = $462;
        };
        var self = _draw_f$11;
        if (self) {
            var _img$30 = (() => {
                var $464 = _img$29;
                var $465 = 0;
                var $466 = _rad$4;
                let _img$31 = $464;
                for (let _i$30 = $465; _i$30 < $466; ++_i$30) {
                    var _px$32 = (Math.max((Math.max(_v0x$14 - _i$30, 0)) - 1, 0));
                    var _py$33 = ((_v0y$15 + ((_i$30 / 2) >>> 0)) >>> 0);
                    var $464 = ((_img$31.buffer[_img$31.length * 2] = ((0 | _px$32 | (_py$33 << 12) | (_cz$3 << 24))), _img$31.buffer[_img$31.length * 2 + 1] = _col$5, _img$31.length++, _img$31));
                    _img$31 = $464;
                };
                return _img$31;
            })();
            var $463 = _img$30;
            var _img$30 = $463;
        } else {
            var $467 = _img$29;
            var _img$30 = $467;
        };
        var self = _draw_e$10;
        if (self) {
            var _img$31 = (() => {
                var $469 = _img$30;
                var $470 = 0;
                var $471 = _rad$4;
                let _img$32 = $469;
                for (let _i$31 = $470; _i$31 < $471; ++_i$31) {
                    var _px$33 = ((((_v4x$22 + _i$31) >>> 0) + 1) >>> 0);
                    var _py$34 = ((_v4y$23 + ((_i$31 / 2) >>> 0)) >>> 0);
                    var $469 = ((_img$32.buffer[_img$32.length * 2] = ((0 | _px$33 | (_py$34 << 12) | (_cz$3 << 24))), _img$32.buffer[_img$32.length * 2 + 1] = _col$5, _img$32.length++, _img$32));
                    _img$32 = $469;
                };
                return _img$32;
            })();
            var $468 = _img$31;
            var _img$31 = $468;
        } else {
            var $472 = _img$30;
            var _img$31 = $472;
        };
        var $442 = _img$31;
        return $442;
    };
    const Image3D$Draw$deresagon = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => x11 => Image3D$Draw$deresagon$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11);

    function Web$Kaelin$Draw$hexagon_border$(_coord$1, _rad$2, _col$3, _img$4) {
        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
        switch (self._) {
            case 'Pair.new':
                var $474 = self.fst;
                var $475 = self.snd;
                var _img$7 = Image3D$Draw$deresagon$($474, $475, 0, _rad$2, _col$3, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, _img$4);
                var $476 = _img$7;
                var $473 = $476;
                break;
        };
        return $473;
    };
    const Web$Kaelin$Draw$hexagon_border = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$hexagon_border$(x0, x1, x2, x3);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var $477 = Maybe$default$(Map$get$(Web$Kaelin$Coord$show$(_coord$1), _map$2), List$nil);
        return $477;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Image3D$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'Image3D.new':
                var $479 = self.length;
                var $480 = $479;
                var $478 = $480;
                break;
        };
        return $478;
    };
    const Image3D$get_len = x0 => Image3D$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $481 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $483 = self.fst;
                    var $484 = _rec$6($483);
                    var $482 = $484;
                    break;
            };
            return $482;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $486 = self.snd;
                    var $487 = _rec$6($486);
                    var $485 = $487;
                    break;
            };
            return $485;
        }), _idx$3)(_arr$4);
        return $481;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const Image3D$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const Image3D$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $489 = self.pred;
                var $490 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $492 = self.pred;
                            var $493 = (_a$pred$9 => {
                                var $494 = Word$o$(Word$and$(_a$pred$9, $492));
                                return $494;
                            });
                            var $491 = $493;
                            break;
                        case 'Word.i':
                            var $495 = self.pred;
                            var $496 = (_a$pred$9 => {
                                var $497 = Word$o$(Word$and$(_a$pred$9, $495));
                                return $497;
                            });
                            var $491 = $496;
                            break;
                        case 'Word.e':
                            var $498 = (_a$pred$7 => {
                                var $499 = Word$e;
                                return $499;
                            });
                            var $491 = $498;
                            break;
                    };
                    var $491 = $491($489);
                    return $491;
                });
                var $488 = $490;
                break;
            case 'Word.i':
                var $500 = self.pred;
                var $501 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $503 = self.pred;
                            var $504 = (_a$pred$9 => {
                                var $505 = Word$o$(Word$and$(_a$pred$9, $503));
                                return $505;
                            });
                            var $502 = $504;
                            break;
                        case 'Word.i':
                            var $506 = self.pred;
                            var $507 = (_a$pred$9 => {
                                var $508 = Word$i$(Word$and$(_a$pred$9, $506));
                                return $508;
                            });
                            var $502 = $507;
                            break;
                        case 'Word.e':
                            var $509 = (_a$pred$7 => {
                                var $510 = Word$e;
                                return $510;
                            });
                            var $502 = $509;
                            break;
                    };
                    var $502 = $502($500);
                    return $502;
                });
                var $488 = $501;
                break;
            case 'Word.e':
                var $511 = (_b$4 => {
                    var $512 = Word$e;
                    return $512;
                });
                var $488 = $511;
                break;
        };
        var $488 = $488(_b$3);
        return $488;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);

    function Image3D$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = Image3D$get_len$(_src$4);
        var _img$7 = (() => {
            var $514 = _img$5;
            var $515 = 0;
            var $516 = _len$6;
            let _img$8 = $514;
            for (let _i$7 = $515; _i$7 < $516; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $514 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $514;
            };
            return _img$8;
        })();
        var $513 = _img$7;
        return $513;
    };
    const Image3D$Draw$image = x0 => x1 => x2 => x3 => x4 => Image3D$Draw$image$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$tile$(_coord$1, _map$2, _img$3) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
                switch (self._) {
                    case 'Pair.new':
                        var $519 = self.fst;
                        var $520 = self.snd;
                        var _tile$8 = Web$Kaelin$Map$get$(_coord$1, _map$2);
                        var _img$9 = (() => {
                            var $523 = _img$3;
                            var $524 = _tile$8;
                            let _img$10 = $523;
                            let _ent$9;
                            while ($524._ === 'List.cons') {
                                _ent$9 = $524.head;
                                var self = _ent$9;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.new':
                                        var $525 = self.img;
                                        var $526 = Image3D$Draw$image$($519, $520, 0, $525, _img$10);
                                        var $523 = $526;
                                        break;
                                };
                                _img$10 = $523;
                                $524 = $524.tail;
                            }
                            return _img$10;
                        })();
                        var $521 = _img$9;
                        var $518 = $521;
                        break;
                };
                var $517 = $518;
                break;
        };
        return $517;
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
            var $528 = _img$3;
            var $529 = 0;
            var $530 = _height$7;
            let _img$10 = $528;
            for (let _j$9 = $529; _j$9 < $530; ++_j$9) {
                var _img$11 = (() => {
                    var $531 = _img$10;
                    var $532 = 0;
                    var $533 = _width$6;
                    let _img$12 = $531;
                    for (let _i$11 = $532; _i$11 < $533; ++_i$11) {
                        var _coord_i$13 = Int$sub$(Int$new(0n)(U32$to_nat$(_i$11)), Int$new(0n)(U32$to_nat$(_map_size$5)));
                        var _coord_j$14 = Int$sub$(Int$new(0n)(U32$to_nat$(_j$9)), Int$new(0n)(U32$to_nat$(_map_size$5)));
                        var _coord$15 = Web$Kaelin$Coord$new$(_coord_i$13, _coord_j$14);
                        var _fit$16 = Web$Kaelin$Coord$fit$(_coord$15, _map_size$5);
                        var self = _fit$16;
                        if (self) {
                            var _img$17 = Web$Kaelin$Draw$hexagon_border$(_coord$15, _hex_rad$8, _col$4, _img$12);
                            var _img$18 = Web$Kaelin$Draw$tile$(_coord$15, _map$2, _img$17);
                            var $534 = _img$18;
                            var $531 = $534;
                        } else {
                            var $535 = _img$12;
                            var $531 = $535;
                        };
                        _img$12 = $531;
                    };
                    return _img$12;
                })();
                var $528 = _img$11;
                _img$10 = $528;
            };
            return _img$10;
        })();
        var $527 = _img$9;
        return $527;
    };
    const Web$Kaelin$Draw$map = x0 => x1 => Web$Kaelin$Draw$map$(x0, x1);

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
        var $536 = (() => {
            var $537 = _img$7;
            var $538 = 0;
            var $539 = _siz$8;
            let _pix$12 = $537;
            for (let _idx$11 = $538; _idx$11 < $539; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = (Math.max(((_x$1 + _v_x$13) >>> 0) - _w_2$9, 0));
                var _p_y$16 = (Math.max(((_y$2 + _v_y$14) >>> 0) - _h_2$10, 0));
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $537 = _pix$19;
                _pix$12 = $537;
            };
            return _pix$12;
        })();
        return $536;
    };
    const Image3D$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Image3D$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function Web$Kaelin$Draw$initial_ent$dot$(_img$1) {
        var _center$2 = ((0 | 0 | (255 << 8) | (255 << 16) | (255 << 24)));
        var _earth$3 = ((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24)));
        var _new_coord$4 = Web$Kaelin$Coord$new;
        var _coord_center$5 = _new_coord$4(Int$new(0n)(0n))(Int$new(0n)(0n));
        var _coord_earth$6 = _new_coord$4(Int$new(1n)(0n))(Int$new(2n)(0n));
        var self = Web$Kaelin$Coord$to_screen_xy$(_coord_center$5);
        switch (self._) {
            case 'Pair.new':
                var $541 = self.fst;
                var $542 = self.snd;
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord_earth$6);
                switch (self._) {
                    case 'Pair.new':
                        var $544 = self.fst;
                        var $545 = self.snd;
                        var _img$11 = Image3D$Draw$square$($541, $542, 0, 4, 4, (_cx$11 => _cy$12 => {
                            var $547 = _center$2;
                            return $547;
                        }), _img$1);
                        var $546 = Image3D$Draw$square$($544, $545, 0, 16, 19, (_ex$12 => _ey$13 => {
                            var $548 = _earth$3;
                            return $548;
                        }), _img$11);
                        var $543 = $546;
                        break;
                };
                var $540 = $543;
                break;
        };
        return $540;
    };
    const Web$Kaelin$Draw$initial_ent$dot = x0 => Web$Kaelin$Draw$initial_ent$dot$(x0);

    function App$Render$pix$(_pixs$1) {
        var $549 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $549;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function App$Action$(_S$1) {
        var $550 = null;
        return $550;
    };
    const App$Action = x0 => App$Action$(x0);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$Action$state$(_value$2) {
        var $551 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $551;
    };
    const App$Action$state = x0 => App$Action$state$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $552 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $552;
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
                    var $555 = self.map;
                    var _map$8 = $555;
                    var _img$9 = Web$Kaelin$Draw$map$(_img$1, _map$8);
                    var _img$10 = Web$Kaelin$Draw$initial_ent$dot$(_img$9);
                    var $556 = App$Render$pix$(_img$10);
                    var $554 = $556;
                    break;
                case 'Web.Kaelin.State.init':
                case 'Web.Kaelin.State.void':
                    var $557 = App$Render$txt$("TODO: create the renderer for this game state mode");
                    var $554 = $557;
                    break;
            };
            return $554;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.xkey':
                    var $559 = self.down;
                    var $560 = self.code;
                    var self = $559;
                    if (self) {
                        var self = ($560 === 68);
                        if (self) {
                            var self = _state$5;
                            switch (self._) {
                                case 'Web.Kaelin.State.init':
                                case 'Web.Kaelin.State.void':
                                    var $564 = List$nil;
                                    var $563 = $564;
                                    break;
                                case 'Web.Kaelin.State.game':
                                    var $565 = List$cons$(App$Action$state$(_state$5), List$nil);
                                    var $563 = $565;
                                    break;
                            };
                            var $562 = $563;
                        } else {
                            var $566 = List$nil;
                            var $562 = $566;
                        };
                        var $561 = $562;
                    } else {
                        var $567 = List$nil;
                        var $561 = $567;
                    };
                    var $558 = $561;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.post':
                    var $568 = List$nil;
                    var $558 = $568;
                    break;
            };
            return $558;
        });
        var $553 = App$new$(_init$2, _draw$3, _when$4);
        return $553;
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
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.length': U32$length,
        'U32.for': U32$for,
        'U32.slice': U32$slice,
        'U32.add': U32$add,
        'U32.read_base': U32$read_base,
        'Image3D.parse_byte': Image3D$parse_byte,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Col32.new': Col32$new,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair.new': Pair$new,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'Image3D.set_pos': Image3D$set_pos,
        'Image3D.set_col': Image3D$set_col,
        'Image3D.set_length': Image3D$set_length,
        'Image3D.push': Image3D$push,
        'Image3D.parse': Image3D$parse,
        'Kaelin.Assets.chars.croni_d_1': Kaelin$Assets$chars$croni_d_1,
        'Web.Jogo.hero.hex': Web$Jogo$hero$hex,
        'Web.Jogo.hero': Web$Jogo$hero,
        'Kaelin.Assets.dark_grass_0': Kaelin$Assets$dark_grass_0,
        'Web.Kaelin.Entity.new': Web$Kaelin$Entity$new,
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
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
        'Image3D.clear': Image3D$clear,
        'Web.Kaelin.Resources.map_size': Web$Kaelin$Resources$map_size,
        'Web.Kaelin.Resources.hexagon_radius': Web$Kaelin$Resources$hexagon_radius,
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
        'Int.is_neg': Int$is_neg,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
        'Image3D.Draw.deresagon': Image3D$Draw$deresagon,
        'Web.Kaelin.Draw.hexagon_border': Web$Kaelin$Draw$hexagon_border,
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'List.for': List$for,
        'Image3D.get_len': Image3D$get_len,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'Image3D.get_pos': Image3D$get_pos,
        'Image3D.get_col': Image3D$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Image3D.Draw.image': Image3D$Draw$image,
        'Web.Kaelin.Draw.tile': Web$Kaelin$Draw$tile,
        'Web.Kaelin.Draw.map': Web$Kaelin$Draw$map,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Image3D.Draw.square': Image3D$Draw$square,
        'Web.Kaelin.Draw.initial_ent.dot': Web$Kaelin$Draw$initial_ent$dot,
        'App.Render.pix': App$Render$pix,
        'App.Action': App$Action,
        'U16.eql': U16$eql,
        'App.Action.state': App$Action$state,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();