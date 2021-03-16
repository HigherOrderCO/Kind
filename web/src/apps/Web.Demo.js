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

    function Word$mul$(_a$2, _b$3) {
        var Word$mul$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$mul = _a$2 => _b$3 => Word$mul$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$mul$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function Image3D$new$(_length$1, _capacity$2, _buffer$3) {
        var $124 = ({
            _: 'Image3D.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $124;
    };
    const Image3D$new = x0 => x1 => x2 => Image3D$new$(x0, x1, x2);

    function Image3D$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $125 = Image3D$new$(0, _capacity$1, _buffer$2);
        return $125;
    };
    const Image3D$alloc_capacity = x0 => Image3D$alloc_capacity$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $126 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $126;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$adder$(_a$2, _b$3, _c$4) {
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
                                var self = _c$4;
                                if (self) {
                                    var $134 = Word$i$(Word$adder$(_a$pred$10, $131, Bool$false));
                                    var $133 = $134;
                                } else {
                                    var $135 = Word$o$(Word$adder$(_a$pred$10, $131, Bool$false));
                                    var $133 = $135;
                                };
                                return $133;
                            });
                            var $130 = $132;
                            break;
                        case 'Word.i':
                            var $136 = self.pred;
                            var $137 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $139 = Word$o$(Word$adder$(_a$pred$10, $136, Bool$true));
                                    var $138 = $139;
                                } else {
                                    var $140 = Word$i$(Word$adder$(_a$pred$10, $136, Bool$false));
                                    var $138 = $140;
                                };
                                return $138;
                            });
                            var $130 = $137;
                            break;
                        case 'Word.e':
                            var $141 = (_a$pred$8 => {
                                var $142 = Word$e;
                                return $142;
                            });
                            var $130 = $141;
                            break;
                    };
                    var $130 = $130($128);
                    return $130;
                });
                var $127 = $129;
                break;
            case 'Word.i':
                var $143 = self.pred;
                var $144 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $146 = self.pred;
                            var $147 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $149 = Word$o$(Word$adder$(_a$pred$10, $146, Bool$true));
                                    var $148 = $149;
                                } else {
                                    var $150 = Word$i$(Word$adder$(_a$pred$10, $146, Bool$false));
                                    var $148 = $150;
                                };
                                return $148;
                            });
                            var $145 = $147;
                            break;
                        case 'Word.i':
                            var $151 = self.pred;
                            var $152 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $154 = Word$i$(Word$adder$(_a$pred$10, $151, Bool$true));
                                    var $153 = $154;
                                } else {
                                    var $155 = Word$o$(Word$adder$(_a$pred$10, $151, Bool$true));
                                    var $153 = $155;
                                };
                                return $153;
                            });
                            var $145 = $152;
                            break;
                        case 'Word.e':
                            var $156 = (_a$pred$8 => {
                                var $157 = Word$e;
                                return $157;
                            });
                            var $145 = $156;
                            break;
                    };
                    var $145 = $145($143);
                    return $145;
                });
                var $127 = $144;
                break;
            case 'Word.e':
                var $158 = (_b$5 => {
                    var $159 = Word$e;
                    return $159;
                });
                var $127 = $158;
                break;
        };
        var $127 = $127(_b$3);
        return $127;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $160 = Word$adder$(_a$2, _b$3, Bool$false);
        return $160;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function Word$or$(_a$2, _b$3) {
        var Word$or$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$or = _a$2 => _b$3 => Word$or$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$or$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => (a0 << a1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $162 = self.capacity;
                var $163 = self.buffer;
                var $164 = Image3D$new$(_length$1, $162, $163);
                var $161 = $164;
                break;
        };
        return $161;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $165 = Image3D$set_length$(0, _img$1);
        return $165;
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
            var $167 = Word$e;
            var $166 = $167;
        } else {
            var $168 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $170 = self.pred;
                    var $171 = Word$o$(Word$trim$($168, $170));
                    var $169 = $171;
                    break;
                case 'Word.i':
                    var $172 = self.pred;
                    var $173 = Word$i$(Word$trim$($168, $172));
                    var $169 = $173;
                    break;
                case 'Word.e':
                    var $174 = Word$o$(Word$trim$($168, Word$e));
                    var $169 = $174;
                    break;
            };
            var $166 = $169;
        };
        return $166;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $176 = self.value;
                var $177 = $176;
                var $175 = $177;
                break;
            case 'Array.tie':
                var $178 = Unit$new;
                var $175 = $178;
                break;
        };
        return $175;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$(_A$1, _B$2) {
        var $179 = null;
        return $179;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $181 = self.lft;
                var $182 = self.rgt;
                var $183 = Pair$new$($181, $182);
                var $180 = $183;
                break;
            case 'Array.tip':
                var $184 = Unit$new;
                var $180 = $184;
                break;
        };
        return $180;
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
                        var $185 = self.pred;
                        var $186 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $185);
                        return $186;
                    case 'Word.i':
                        var $187 = self.pred;
                        var $188 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $187);
                        return $188;
                    case 'Word.e':
                        var $189 = _nil$3;
                        return $189;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $190 = Word$foldl$((_arr$6 => {
            var $191 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $191;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $193 = self.fst;
                    var $194 = self.snd;
                    var $195 = Array$tie$(_rec$7($193), $194);
                    var $192 = $195;
                    break;
            };
            return $192;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $197 = self.fst;
                    var $198 = self.snd;
                    var $199 = Array$tie$($197, _rec$7($198));
                    var $196 = $199;
                    break;
            };
            return $196;
        }), _idx$3)(_arr$5);
        return $190;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $200 = Array$mut$(_idx$3, (_x$6 => {
            var $201 = _val$4;
            return $201;
        }), _arr$5);
        return $200;
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
        var $202 = (() => {
            var $203 = _img$7;
            var $204 = 0;
            var $205 = _siz$8;
            let _pix$12 = $203;
            for (let _idx$11 = $204; _idx$11 < $205; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = (Math.max(((_x$1 + _v_x$13) >>> 0) - _w_2$9, 0));
                var _p_y$16 = (Math.max(((_y$2 + _v_y$14) >>> 0) - _h_2$10, 0));
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $203 = _pix$19;
                _pix$12 = $203;
            };
            return _pix$12;
        })();
        return $202;
    };
    const Image3D$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Image3D$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function App$Render$pix$(_pixs$1) {
        var $206 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $206;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function List$(_A$1) {
        var $207 = null;
        return $207;
    };
    const List = x0 => List$(x0);

    function App$Action$(_S$1) {
        var $208 = null;
        return $208;
    };
    const App$Action = x0 => App$Action$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$cons$(_head$2, _tail$3) {
        var $209 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $209;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$Action$state$(_value$2) {
        var $210 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $210;
    };
    const App$Action$state = x0 => App$Action$state$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $211 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $211;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Demo = (() => {
        var _img$1 = Image3D$alloc_capacity$(256);
        var $212 = App$new$(Pair$new$(128, 128), (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Pair.new':
                    var $214 = self.fst;
                    var $215 = self.snd;
                    var _img$5 = Image3D$clear$(_img$1);
                    var _img$6 = Image3D$Draw$square$($214, $215, 128, 16, 16, (_x$6 => _y$7 => {
                        var _r$8 = ((96 + ((_x$6 * 4) >>> 0)) >>> 0);
                        var _g$9 = ((96 + ((_x$6 * 4) >>> 0)) >>> 0);
                        var _b$10 = 128;
                        var _a$11 = 255;
                        var $217 = ((0 | _r$8 | (_g$9 << 8) | (_b$10 << 16) | (_a$11 << 24)));
                        return $217;
                    }), _img$5);
                    var $216 = App$Render$pix$(_img$6);
                    var $213 = $216;
                    break;
            };
            return $213;
        }), (_event$2 => _state$3 => {
            var self = _event$2;
            switch (self._) {
                case 'App.Event.xkey':
                    var $219 = self.down;
                    var $220 = self.code;
                    var $221 = List$cons$((() => {
                        var self = _state$3;
                        switch (self._) {
                            case 'Pair.new':
                                var $222 = self.fst;
                                var $223 = self.snd;
                                var self = ($220 === 65);
                                if (self) {
                                    var $225 = Pair$new$((Math.max($222 - 4, 0)), $223);
                                    var self = $225;
                                } else {
                                    var self = ($220 === 68);
                                    if (self) {
                                        var $227 = Pair$new$((($222 + 4) >>> 0), $223);
                                        var $226 = $227;
                                    } else {
                                        var self = ($220 === 87);
                                        if (self) {
                                            var $229 = Pair$new$($222, (Math.max($223 - 4, 0)));
                                            var $228 = $229;
                                        } else {
                                            var self = ($220 === 83);
                                            if (self) {
                                                var $231 = Pair$new$($222, (($223 + 4) >>> 0));
                                                var $230 = $231;
                                            } else {
                                                var $232 = Pair$new$($222, $223);
                                                var $230 = $232;
                                            };
                                            var $228 = $230;
                                        };
                                        var $226 = $228;
                                    };
                                    var self = $226;
                                };
                                switch (self._) {
                                    case 'Pair.new':
                                        var $233 = self.fst;
                                        var $234 = self.snd;
                                        var $235 = App$Action$state$((() => {
                                            var self = $219;
                                            if (self) {
                                                var $236 = Pair$new$($233, $234);
                                                return $236;
                                            } else {
                                                var $237 = Pair$new$($222, $223);
                                                return $237;
                                            };
                                        })());
                                        var $224 = $235;
                                        break;
                                };
                                return $224;
                        };
                    })(), List$nil);
                    var $218 = $221;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.post':
                    var $238 = List$nil;
                    var $218 = $238;
                    break;
            };
            return $218;
        }));
        return $212;
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
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'Image3D.new': Image3D$new,
        'Image3D.alloc_capacity': Image3D$alloc_capacity,
        'Pair.new': Pair$new,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
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
        'U16.eql': U16$eql,
        'App.Action.state': App$Action$state,
        'App.new': App$new,
        'Web.Demo': Web$Demo,
    };
})();