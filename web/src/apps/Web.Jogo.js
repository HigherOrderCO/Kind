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
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function Pair$(_A$1, _B$2) {
        var $194 = null;
        return $194;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $196 = self.capacity;
                var $197 = self.buffer;
                var $198 = VoxBox$new$(_length$1, $196, $197);
                var $195 = $198;
                break;
        };
        return $195;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);

    function VoxBox$clear$(_img$1) {
        var $199 = VoxBox$set_length$(0, _img$1);
        return $199;
    };
    const VoxBox$clear = x0 => VoxBox$clear$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $200 = null;
        return $200;
    };
    const List = x0 => List$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $201 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $201;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $203 = self.val;
                var $204 = self.lft;
                var $205 = self.rgt;
                var self = $203;
                switch (self._) {
                    case 'Maybe.some':
                        var $207 = self.value;
                        var $208 = List$cons$($207, _list$3);
                        var _list0$7 = $208;
                        break;
                    case 'Maybe.none':
                        var $209 = _list$3;
                        var _list0$7 = $209;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($204, _list0$7);
                var _list2$9 = BitsMap$values$go$($205, _list1$8);
                var $206 = _list2$9;
                var $202 = $206;
                break;
            case 'BitsMap.new':
                var $210 = _list$3;
                var $202 = $210;
                break;
        };
        return $202;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function BitsMap$values$(_xs$2) {
        var $211 = BitsMap$values$go$(_xs$2, List$nil);
        return $211;
    };
    const BitsMap$values = x0 => BitsMap$values$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $213 = self.length;
                var $214 = $213;
                var $212 = $214;
                break;
        };
        return $212;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $216 = Word$e;
            var $215 = $216;
        } else {
            var $217 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $219 = self.pred;
                    var $220 = Word$o$(Word$trim$($217, $219));
                    var $218 = $220;
                    break;
                case 'Word.i':
                    var $221 = self.pred;
                    var $222 = Word$i$(Word$trim$($217, $221));
                    var $218 = $222;
                    break;
                case 'Word.e':
                    var $223 = Word$o$(Word$trim$($217, Word$e));
                    var $218 = $223;
                    break;
            };
            var $215 = $218;
        };
        return $215;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $225 = self.value;
                var $226 = $225;
                var $224 = $226;
                break;
            case 'Array.tie':
                var $227 = Unit$new;
                var $224 = $227;
                break;
        };
        return $224;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $228 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $228;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $230 = self.lft;
                var $231 = self.rgt;
                var $232 = Pair$new$($230, $231);
                var $229 = $232;
                break;
            case 'Array.tip':
                var $233 = Unit$new;
                var $229 = $233;
                break;
        };
        return $229;
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
                        var $234 = self.pred;
                        var $235 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $234);
                        return $235;
                    case 'Word.i':
                        var $236 = self.pred;
                        var $237 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $236);
                        return $237;
                    case 'Word.e':
                        var $238 = _nil$3;
                        return $238;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$get$(_idx$3, _arr$4) {
        var $239 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $241 = self.fst;
                    var $242 = _rec$6($241);
                    var $240 = $242;
                    break;
            };
            return $240;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $244 = self.snd;
                    var $245 = _rec$6($244);
                    var $243 = $245;
                    break;
            };
            return $243;
        }), _idx$3)(_arr$4);
        return $239;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $247 = self.pred;
                var $248 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $250 = self.pred;
                            var $251 = (_a$pred$9 => {
                                var $252 = Word$o$(Word$and$(_a$pred$9, $250));
                                return $252;
                            });
                            var $249 = $251;
                            break;
                        case 'Word.i':
                            var $253 = self.pred;
                            var $254 = (_a$pred$9 => {
                                var $255 = Word$o$(Word$and$(_a$pred$9, $253));
                                return $255;
                            });
                            var $249 = $254;
                            break;
                        case 'Word.e':
                            var $256 = (_a$pred$7 => {
                                var $257 = Word$e;
                                return $257;
                            });
                            var $249 = $256;
                            break;
                    };
                    var $249 = $249($247);
                    return $249;
                });
                var $246 = $248;
                break;
            case 'Word.i':
                var $258 = self.pred;
                var $259 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $261 = self.pred;
                            var $262 = (_a$pred$9 => {
                                var $263 = Word$o$(Word$and$(_a$pred$9, $261));
                                return $263;
                            });
                            var $260 = $262;
                            break;
                        case 'Word.i':
                            var $264 = self.pred;
                            var $265 = (_a$pred$9 => {
                                var $266 = Word$i$(Word$and$(_a$pred$9, $264));
                                return $266;
                            });
                            var $260 = $265;
                            break;
                        case 'Word.e':
                            var $267 = (_a$pred$7 => {
                                var $268 = Word$e;
                                return $268;
                            });
                            var $260 = $267;
                            break;
                    };
                    var $260 = $260($258);
                    return $260;
                });
                var $246 = $259;
                break;
            case 'Word.e':
                var $269 = (_b$4 => {
                    var $270 = Word$e;
                    return $270;
                });
                var $246 = $269;
                break;
        };
        var $246 = $246(_b$3);
        return $246;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $272 = self.pred;
                var $273 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $275 = self.pred;
                            var $276 = (_a$pred$9 => {
                                var $277 = Word$o$(Word$or$(_a$pred$9, $275));
                                return $277;
                            });
                            var $274 = $276;
                            break;
                        case 'Word.i':
                            var $278 = self.pred;
                            var $279 = (_a$pred$9 => {
                                var $280 = Word$i$(Word$or$(_a$pred$9, $278));
                                return $280;
                            });
                            var $274 = $279;
                            break;
                        case 'Word.e':
                            var $281 = (_a$pred$7 => {
                                var $282 = Word$e;
                                return $282;
                            });
                            var $274 = $281;
                            break;
                    };
                    var $274 = $274($272);
                    return $274;
                });
                var $271 = $273;
                break;
            case 'Word.i':
                var $283 = self.pred;
                var $284 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $286 = self.pred;
                            var $287 = (_a$pred$9 => {
                                var $288 = Word$i$(Word$or$(_a$pred$9, $286));
                                return $288;
                            });
                            var $285 = $287;
                            break;
                        case 'Word.i':
                            var $289 = self.pred;
                            var $290 = (_a$pred$9 => {
                                var $291 = Word$i$(Word$or$(_a$pred$9, $289));
                                return $291;
                            });
                            var $285 = $290;
                            break;
                        case 'Word.e':
                            var $292 = (_a$pred$7 => {
                                var $293 = Word$e;
                                return $293;
                            });
                            var $285 = $292;
                            break;
                    };
                    var $285 = $285($283);
                    return $285;
                });
                var $271 = $284;
                break;
            case 'Word.e':
                var $294 = (_b$4 => {
                    var $295 = Word$e;
                    return $295;
                });
                var $271 = $294;
                break;
        };
        var $271 = $271(_b$3);
        return $271;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $296 = Word$foldl$((_arr$6 => {
            var $297 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $297;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $299 = self.fst;
                    var $300 = self.snd;
                    var $301 = Array$tie$(_rec$7($299), $300);
                    var $298 = $301;
                    break;
            };
            return $298;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $303 = self.fst;
                    var $304 = self.snd;
                    var $305 = Array$tie$($303, _rec$7($304));
                    var $302 = $305;
                    break;
            };
            return $302;
        }), _idx$3)(_arr$5);
        return $296;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $306 = Array$mut$(_idx$3, (_x$6 => {
            var $307 = _val$4;
            return $307;
        }), _arr$5);
        return $306;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $309 = _img$5;
            var $310 = 0;
            var $311 = _len$6;
            let _img$8 = $309;
            for (let _i$7 = $310; _i$7 < $311; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $309 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $309;
            };
            return _img$8;
        })();
        var $308 = _img$7;
        return $308;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

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
                        var $312 = self.pred;
                        var $313 = Word$bit_length$go$($312, Nat$succ$(_c$3), _n$4);
                        return $313;
                    case 'Word.i':
                        var $314 = self.pred;
                        var $315 = Word$bit_length$go$($314, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $315;
                    case 'Word.e':
                        var $316 = _n$4;
                        return $316;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $317 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $317;
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
                    var $318 = _value$3;
                    return $318;
                } else {
                    var $319 = (self - 1n);
                    var $320 = Word$shift_left$($319, Word$shift_left1$(_value$3));
                    return $320;
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
                var $322 = Bool$false;
                var $321 = $322;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $323 = Bool$true;
                var $321 = $323;
                break;
        };
        return $321;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $324 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $324;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $326 = self.pred;
                var $327 = Word$o$(Word$shift_right1$aux$($326));
                var $325 = $327;
                break;
            case 'Word.i':
                var $328 = self.pred;
                var $329 = Word$i$(Word$shift_right1$aux$($328));
                var $325 = $329;
                break;
            case 'Word.e':
                var $330 = Word$o$(Word$e);
                var $325 = $330;
                break;
        };
        return $325;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $332 = self.pred;
                var $333 = Word$shift_right1$aux$($332);
                var $331 = $333;
                break;
            case 'Word.i':
                var $334 = self.pred;
                var $335 = Word$shift_right1$aux$($334);
                var $331 = $335;
                break;
            case 'Word.e':
                var $336 = Word$e;
                var $331 = $336;
                break;
        };
        return $331;
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
                    var $337 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $337;
                } else {
                    var $338 = Pair$new$(Bool$false, _value$5);
                    var self = $338;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $339 = self.fst;
                        var $340 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $342 = $340;
                            var $341 = $342;
                        } else {
                            var $343 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $339;
                            if (self) {
                                var $345 = Word$div$go$($343, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $340);
                                var $344 = $345;
                            } else {
                                var $346 = Word$div$go$($343, _sub_copy$3, _new_shift_copy$9, $340);
                                var $344 = $346;
                            };
                            var $341 = $344;
                        };
                        return $341;
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
            var $348 = Word$to_zero$(_a$2);
            var $347 = $348;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $349 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $347 = $349;
        };
        return $347;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => (a0.length);
    const U32$slice = a0 => a1 => a2 => (a2.slice(a0, a1));
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function VoxBox$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $350 = (parseInt(_chr$3, 16));
        return $350;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = (((_voxdata$1.length) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $352 = _img$3;
            var $353 = 0;
            var $354 = _siz$2;
            let _img$5 = $352;
            for (let _i$4 = $353; _i$4 < $354; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $352 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $352;
            };
            return _img$5;
        })();
        var $351 = _img$4;
        return $351;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Jogo$hero$hex = "0d00000000000e00000000000f00000000001000000000001100000000000c01000000000d01000000001101000000000b02000000000c02000000001202000000000b03000000001203000000000b04000000000c04000000001104000000000c05000000000d05000000000e05000000001005000000001105000000000e06000000000f06000000000e07000000000e08000000000f08000000000d09000000000e09000000000f09000000000c0a000000000d0a000000000e0a000000000f0a00000000100a000000000c0b000000000e0b00000000100b000000000b0c000000000c0c000000000e0c00000000100c00000000110c000000000b0d000000000e0d00000000110d000000000a0e000000000b0e000000000e0e00000000110e00000000120e000000000a0f000000000e0f00000000120f000000000910000000000a10000000000e10000000001210000000001310000000000911000000000e11000000001311000000000e12000000000d13000000000e13000000000f13000000000d14000000000f14000000000d15000000000f15000000000c16000000000d16000000000f16000000000c17000000000f17000000000c18000000000f18000000000c19000000001019000000000c1a00000000101a000000000b1b000000000c1b00000000101b000000000b1c00000000101c000000000b1d00000000101d00000000111d000000000b1e00000000111e000000000a1f000000000b1f00000000111f00000000";
    const Web$Jogo$hero = VoxBox$parse$(Web$Jogo$hero$hex);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $355 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $355;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BitsMap$(_A$1) {
        var $356 = null;
        return $356;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $357 = null;
        return $357;
    };
    const Map = x0 => Map$(x0);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $358 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $358;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $359 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $359;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $361 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $363 = self.val;
                        var $364 = self.lft;
                        var $365 = self.rgt;
                        var $366 = BitsMap$tie$($363, BitsMap$set$($361, _val$3, $364), $365);
                        var $362 = $366;
                        break;
                    case 'BitsMap.new':
                        var $367 = BitsMap$tie$(Maybe$none, BitsMap$set$($361, _val$3, BitsMap$new), BitsMap$new);
                        var $362 = $367;
                        break;
                };
                var $360 = $362;
                break;
            case 'i':
                var $368 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $370 = self.val;
                        var $371 = self.lft;
                        var $372 = self.rgt;
                        var $373 = BitsMap$tie$($370, $371, BitsMap$set$($368, _val$3, $372));
                        var $369 = $373;
                        break;
                    case 'BitsMap.new':
                        var $374 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($368, _val$3, BitsMap$new));
                        var $369 = $374;
                        break;
                };
                var $360 = $369;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $376 = self.lft;
                        var $377 = self.rgt;
                        var $378 = BitsMap$tie$(Maybe$some$(_val$3), $376, $377);
                        var $375 = $378;
                        break;
                    case 'BitsMap.new':
                        var $379 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $375 = $379;
                        break;
                };
                var $360 = $375;
                break;
        };
        return $360;
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
                var $381 = self.pred;
                var $382 = (Word$to_bits$($381) + '0');
                var $380 = $382;
                break;
            case 'Word.i':
                var $383 = self.pred;
                var $384 = (Word$to_bits$($383) + '1');
                var $380 = $384;
                break;
            case 'Word.e':
                var $385 = Bits$e;
                var $380 = $385;
                break;
        };
        return $380;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $387 = Bits$e;
            var $386 = $387;
        } else {
            var $388 = self.charCodeAt(0);
            var $389 = self.slice(1);
            var $390 = (String$to_bits$($389) + (u16_to_bits($388)));
            var $386 = $390;
        };
        return $386;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $392 = self.head;
                var $393 = self.tail;
                var self = $392;
                switch (self._) {
                    case 'Pair.new':
                        var $395 = self.fst;
                        var $396 = self.snd;
                        var $397 = BitsMap$set$(String$to_bits$($395), $396, Map$from_list$($393));
                        var $394 = $397;
                        break;
                };
                var $391 = $394;
                break;
            case 'List.nil':
                var $398 = BitsMap$new;
                var $391 = $398;
                break;
        };
        return $391;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function IO$(_A$1) {
        var $399 = null;
        return $399;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $400 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $400;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $402 = self.value;
                var $403 = _f$4($402);
                var $401 = $403;
                break;
            case 'IO.ask':
                var $404 = self.query;
                var $405 = self.param;
                var $406 = self.then;
                var $407 = IO$ask$($404, $405, (_x$8 => {
                    var $408 = IO$bind$($406(_x$8), _f$4);
                    return $408;
                }));
                var $401 = $407;
                break;
        };
        return $401;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $409 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $409;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $410 = _new$2(IO$bind)(IO$end);
        return $410;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$do$(_call$1, _param$2) {
        var $411 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $412 = IO$end$(Unit$new);
            return $412;
        }));
        return $411;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function Dynamic$new$(_value$2) {
        var $413 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $413;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $414 = _m$pure$2;
        return $414;
    }))(Dynamic$new$(Unit$new));

    function App$do$(_call$1, _param$2) {
        var $415 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $416 = _m$bind$3;
            return $416;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $417 = App$pass;
            return $417;
        }));
        return $415;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $418 = App$do$("watch", _room$1);
        return $418;
    };
    const App$watch = x0 => App$watch$(x0);
    const Web$Jogo$room = "0x196581625482";
    const U16$eql = a0 => a1 => (a0 === a1);

    function String$cons$(_head$1, _tail$2) {
        var $419 = (String.fromCharCode(_head$1) + _tail$2);
        return $419;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$post$(_room$1, _data$2) {
        var $420 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $420;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);
    const Web$Jogo$command$A = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const Web$Jogo$command$D = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const Web$Jogo$command$W = "0x0000000000000000000000000000000000000000000000000000000000000003";
    const Web$Jogo$command$S = "0x0000000000000000000000000000000000000000000000000000000000000002";

    function App$store$(_value$2) {
        var $421 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $422 = _m$pure$4;
            return $422;
        }))(Dynamic$new$(_value$2));
        return $421;
    };
    const App$store = x0 => App$store$(x0);

    function Maybe$(_A$1) {
        var $423 = null;
        return $423;
    };
    const Maybe = x0 => Maybe$(x0);

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
                        var $424 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $426 = self.lft;
                                var $427 = BitsMap$get$($424, $426);
                                var $425 = $427;
                                break;
                            case 'BitsMap.new':
                                var $428 = Maybe$none;
                                var $425 = $428;
                                break;
                        };
                        return $425;
                    case 'i':
                        var $429 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $431 = self.rgt;
                                var $432 = BitsMap$get$($429, $431);
                                var $430 = $432;
                                break;
                            case 'BitsMap.new':
                                var $433 = Maybe$none;
                                var $430 = $433;
                                break;
                        };
                        return $430;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $435 = self.val;
                                var $436 = $435;
                                var $434 = $436;
                                break;
                            case 'BitsMap.new':
                                var $437 = Maybe$none;
                                var $434 = $437;
                                break;
                        };
                        return $434;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Jogo$command$(_user$1, _cmd$2, _state$3) {
        var _key$4 = String$to_bits$(_user$1);
        var self = BitsMap$get$(_key$4, _state$3);
        switch (self._) {
            case 'Maybe.some':
                var $439 = self.value;
                var self = $439;
                switch (self._) {
                    case 'Pair.new':
                        var $441 = self.fst;
                        var $442 = self.snd;
                        var _spd$8 = 3;
                        var _p_x$9 = $441;
                        var _p_y$10 = $442;
                        var self = (_cmd$2 === Web$Jogo$command$A);
                        if (self) {
                            var $444 = BitsMap$set$(_key$4, Pair$new$((Math.max(_p_x$9 - _spd$8, 0)), _p_y$10), _state$3);
                            var $443 = $444;
                        } else {
                            var self = (_cmd$2 === Web$Jogo$command$D);
                            if (self) {
                                var $446 = BitsMap$set$(_key$4, Pair$new$(((_p_x$9 + _spd$8) >>> 0), _p_y$10), _state$3);
                                var $445 = $446;
                            } else {
                                var self = (_cmd$2 === Web$Jogo$command$W);
                                if (self) {
                                    var $448 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, (Math.max(_p_y$10 - _spd$8, 0))), _state$3);
                                    var $447 = $448;
                                } else {
                                    var self = (_cmd$2 === Web$Jogo$command$S);
                                    if (self) {
                                        var $450 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, ((_p_y$10 + _spd$8) >>> 0)), _state$3);
                                        var $449 = $450;
                                    } else {
                                        var $451 = _state$3;
                                        var $449 = $451;
                                    };
                                    var $447 = $449;
                                };
                                var $445 = $447;
                            };
                            var $443 = $445;
                        };
                        var $440 = $443;
                        break;
                };
                var $438 = $440;
                break;
            case 'Maybe.none':
                var $452 = BitsMap$set$(_key$4, Pair$new$(128, 128), _state$3);
                var $438 = $452;
                break;
        };
        return $438;
    };
    const Web$Jogo$command = x0 => x1 => x2 => Web$Jogo$command$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $453 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $453;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Jogo = (() => {
        var _vbox$1 = VoxBox$alloc_capacity$(3200);
        var _init$2 = BitsMap$new;
        var _draw$3 = (_state$3 => {
            var _vbox$4 = VoxBox$clear$(_vbox$1);
            var _vbox$5 = (() => {
                var $457 = _vbox$4;
                var $458 = BitsMap$values$(_state$3);
                let _vbox$6 = $457;
                let _pos$5;
                while ($458._ === 'List.cons') {
                    _pos$5 = $458.head;
                    var self = _pos$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $459 = self.fst;
                            var $460 = self.snd;
                            var $461 = VoxBox$Draw$image$($459, $460, 0, Web$Jogo$hero, _vbox$6);
                            var $457 = $461;
                            break;
                    };
                    _vbox$6 = $457;
                    $458 = $458.tail;
                }
                return _vbox$6;
            })();
            var $455 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _vbox$5);
            return $455;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.key_down':
                    var $463 = self.code;
                    var self = ($463 === 65);
                    if (self) {
                        var $465 = App$post$(Web$Jogo$room, Web$Jogo$command$A);
                        var $464 = $465;
                    } else {
                        var self = ($463 === 68);
                        if (self) {
                            var $467 = App$post$(Web$Jogo$room, Web$Jogo$command$D);
                            var $466 = $467;
                        } else {
                            var self = ($463 === 87);
                            if (self) {
                                var $469 = App$post$(Web$Jogo$room, Web$Jogo$command$W);
                                var $468 = $469;
                            } else {
                                var self = ($463 === 83);
                                if (self) {
                                    var $471 = App$post$(Web$Jogo$room, Web$Jogo$command$S);
                                    var $470 = $471;
                                } else {
                                    var $472 = App$pass;
                                    var $470 = $472;
                                };
                                var $468 = $470;
                            };
                            var $466 = $468;
                        };
                        var $464 = $466;
                    };
                    var $462 = $464;
                    break;
                case 'App.Event.post':
                    var $473 = self.addr;
                    var $474 = self.data;
                    var $475 = App$store$(Web$Jogo$command$($473, $474, _state$5));
                    var $462 = $475;
                    break;
                case 'App.Event.init':
                    var $476 = App$watch$(Web$Jogo$room);
                    var $462 = $476;
                    break;
                case 'App.Event.tick':
                case 'App.Event.dom':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                    var $477 = App$pass;
                    var $462 = $477;
                    break;
            };
            return $462;
        });
        var $454 = App$new$(_init$2, _draw$3, _when$4);
        return $454;
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
        'BitsMap.new': BitsMap$new,
        'Pair': Pair,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.clear': VoxBox$clear,
        'List.for': List$for,
        'List': List,
        'List.cons': List$cons,
        'BitsMap.values.go': BitsMap$values$go,
        'List.nil': List$nil,
        'BitsMap.values': BitsMap$values,
        'VoxBox.get_len': VoxBox$get_len,
        'U32.for': U32$for,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair.new': Pair$new,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'U32.add': U32$add,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.push': VoxBox$push,
        'VoxBox.Draw.image': VoxBox$Draw$image,
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
        'U32.length': U32$length,
        'U32.slice': U32$slice,
        'U32.read_base': U32$read_base,
        'VoxBox.parse_byte': VoxBox$parse_byte,
        'Col32.new': Col32$new,
        'VoxBox.parse': VoxBox$parse,
        'Web.Jogo.hero.hex': Web$Jogo$hero$hex,
        'Web.Jogo.hero': Web$Jogo$hero,
        'DOM.vbox': DOM$vbox,
        'BitsMap': BitsMap,
        'Map': Map,
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
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'IO.do': IO$do,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'App.do': App$do,
        'App.watch': App$watch,
        'Web.Jogo.room': Web$Jogo$room,
        'U16.eql': U16$eql,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.post': App$post,
        'Web.Jogo.command.A': Web$Jogo$command$A,
        'Web.Jogo.command.D': Web$Jogo$command$D,
        'Web.Jogo.command.W': Web$Jogo$command$W,
        'Web.Jogo.command.S': Web$Jogo$command$S,
        'App.store': App$store,
        'Maybe': Maybe,
        'BitsMap.get': BitsMap$get,
        'Bool.and': Bool$and,
        'String.eql': String$eql,
        'Web.Jogo.command': Web$Jogo$command,
        'App.new': App$new,
        'Web.Jogo': Web$Jogo,
    };
})();