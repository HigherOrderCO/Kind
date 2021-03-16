(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[160],{

/***/ 160:
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

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $128 = self.capacity;
                var $129 = self.buffer;
                var $130 = Image3D$new$(_length$1, $128, $129);
                var $127 = $130;
                break;
        };
        return $127;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $131 = Image3D$set_length$(0, _img$1);
        return $131;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);

    function Image3D$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'Image3D.new':
                var $133 = self.length;
                var $134 = $133;
                var $132 = $134;
                break;
        };
        return $132;
    };
    const Image3D$get_len = x0 => Image3D$get_len$(x0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $136 = Word$e;
            var $135 = $136;
        } else {
            var $137 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $139 = self.pred;
                    var $140 = Word$o$(Word$trim$($137, $139));
                    var $138 = $140;
                    break;
                case 'Word.i':
                    var $141 = self.pred;
                    var $142 = Word$i$(Word$trim$($137, $141));
                    var $138 = $142;
                    break;
                case 'Word.e':
                    var $143 = Word$o$(Word$trim$($137, Word$e));
                    var $138 = $143;
                    break;
            };
            var $135 = $138;
        };
        return $135;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $145 = self.value;
                var $146 = $145;
                var $144 = $146;
                break;
            case 'Array.tie':
                var $147 = Unit$new;
                var $144 = $147;
                break;
        };
        return $144;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$(_A$1, _B$2) {
        var $148 = null;
        return $148;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $150 = self.lft;
                var $151 = self.rgt;
                var $152 = Pair$new$($150, $151);
                var $149 = $152;
                break;
            case 'Array.tip':
                var $153 = Unit$new;
                var $149 = $153;
                break;
        };
        return $149;
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
                        var $154 = self.pred;
                        var $155 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $154);
                        return $155;
                    case 'Word.i':
                        var $156 = self.pred;
                        var $157 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $156);
                        return $157;
                    case 'Word.e':
                        var $158 = _nil$3;
                        return $158;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$get$(_idx$3, _arr$4) {
        var $159 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $161 = self.fst;
                    var $162 = _rec$6($161);
                    var $160 = $162;
                    break;
            };
            return $160;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $164 = self.snd;
                    var $165 = _rec$6($164);
                    var $163 = $165;
                    break;
            };
            return $163;
        }), _idx$3)(_arr$4);
        return $159;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const Image3D$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $167 = self.pred;
                var $168 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $170 = self.pred;
                            var $171 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $173 = Word$i$(Word$adder$(_a$pred$10, $170, Bool$false));
                                    var $172 = $173;
                                } else {
                                    var $174 = Word$o$(Word$adder$(_a$pred$10, $170, Bool$false));
                                    var $172 = $174;
                                };
                                return $172;
                            });
                            var $169 = $171;
                            break;
                        case 'Word.i':
                            var $175 = self.pred;
                            var $176 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $178 = Word$o$(Word$adder$(_a$pred$10, $175, Bool$true));
                                    var $177 = $178;
                                } else {
                                    var $179 = Word$i$(Word$adder$(_a$pred$10, $175, Bool$false));
                                    var $177 = $179;
                                };
                                return $177;
                            });
                            var $169 = $176;
                            break;
                        case 'Word.e':
                            var $180 = (_a$pred$8 => {
                                var $181 = Word$e;
                                return $181;
                            });
                            var $169 = $180;
                            break;
                    };
                    var $169 = $169($167);
                    return $169;
                });
                var $166 = $168;
                break;
            case 'Word.i':
                var $182 = self.pred;
                var $183 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $185 = self.pred;
                            var $186 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $188 = Word$o$(Word$adder$(_a$pred$10, $185, Bool$true));
                                    var $187 = $188;
                                } else {
                                    var $189 = Word$i$(Word$adder$(_a$pred$10, $185, Bool$false));
                                    var $187 = $189;
                                };
                                return $187;
                            });
                            var $184 = $186;
                            break;
                        case 'Word.i':
                            var $190 = self.pred;
                            var $191 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $193 = Word$i$(Word$adder$(_a$pred$10, $190, Bool$true));
                                    var $192 = $193;
                                } else {
                                    var $194 = Word$o$(Word$adder$(_a$pred$10, $190, Bool$true));
                                    var $192 = $194;
                                };
                                return $192;
                            });
                            var $184 = $191;
                            break;
                        case 'Word.e':
                            var $195 = (_a$pred$8 => {
                                var $196 = Word$e;
                                return $196;
                            });
                            var $184 = $195;
                            break;
                    };
                    var $184 = $184($182);
                    return $184;
                });
                var $166 = $183;
                break;
            case 'Word.e':
                var $197 = (_b$5 => {
                    var $198 = Word$e;
                    return $198;
                });
                var $166 = $197;
                break;
        };
        var $166 = $166(_b$3);
        return $166;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $199 = Word$adder$(_a$2, _b$3, Bool$false);
        return $199;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const Image3D$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var Word$and$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$and = _a$2 => _b$3 => Word$and$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$and$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);

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
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $200 = Word$foldl$((_arr$6 => {
            var $201 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $201;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $203 = self.fst;
                    var $204 = self.snd;
                    var $205 = Array$tie$(_rec$7($203), $204);
                    var $202 = $205;
                    break;
            };
            return $202;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $207 = self.fst;
                    var $208 = self.snd;
                    var $209 = Array$tie$($207, _rec$7($208));
                    var $206 = $209;
                    break;
            };
            return $206;
        }), _idx$3)(_arr$5);
        return $200;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $210 = Array$mut$(_idx$3, (_x$6 => {
            var $211 = _val$4;
            return $211;
        }), _arr$5);
        return $210;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const Image3D$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const Image3D$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const Image3D$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function Image3D$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = Image3D$get_len$(_src$4);
        var _img$7 = (() => {
            var $213 = _img$5;
            var $214 = 0;
            var $215 = _len$6;
            let _img$8 = $213;
            for (let _i$7 = $214; _i$7 < $215; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $213 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $213;
            };
            return _img$8;
        })();
        var $212 = _img$7;
        return $212;
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
        var $216 = (parseInt(_chr$3, 16));
        return $216;
    };
    const Image3D$parse_byte = x0 => x1 => Image3D$parse_byte$(x0, x1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Image3D$parse$(_voxdata$1) {
        var _siz$2 = (((_voxdata$1.length) / 12) >>> 0);
        var _img$3 = Image3D$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $218 = _img$3;
            var $219 = 0;
            var $220 = _siz$2;
            let _img$5 = $218;
            for (let _i$4 = $219; _i$4 < $220; ++_i$4) {
                var _x$6 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $218 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $218;
            };
            return _img$5;
        })();
        var $217 = _img$4;
        return $217;
    };
    const Image3D$parse = x0 => Image3D$parse$(x0);
    const Web$Jogo$hero$hex = "0d00000000000e00000000000f00000000001000000000001100000000000c01000000000d01000000001101000000000b02000000000c02000000001202000000000b03000000001203000000000b04000000000c04000000001104000000000c05000000000d05000000000e05000000001005000000001105000000000e06000000000f06000000000e07000000000e08000000000f08000000000d09000000000e09000000000f09000000000c0a000000000d0a000000000e0a000000000f0a00000000100a000000000c0b000000000e0b00000000100b000000000b0c000000000c0c000000000e0c00000000100c00000000110c000000000b0d000000000e0d00000000110d000000000a0e000000000b0e000000000e0e00000000110e00000000120e000000000a0f000000000e0f00000000120f000000000910000000000a10000000000e10000000001210000000001310000000000911000000000e11000000001311000000000e12000000000d13000000000e13000000000f13000000000d14000000000f14000000000d15000000000f15000000000c16000000000d16000000000f16000000000c17000000000f17000000000c18000000000f18000000000c19000000001019000000000c1a00000000101a000000000b1b000000000c1b00000000101b000000000b1c00000000101c000000000b1d00000000101d00000000111d000000000b1e00000000111e000000000a1f000000000b1f00000000111f00000000";
    const Web$Jogo$hero = Image3D$parse$(Web$Jogo$hero$hex);

    function App$Render$pix$(_pixs$1) {
        var $221 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $221;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function List$(_A$1) {
        var $222 = null;
        return $222;
    };
    const List = x0 => List$(x0);

    function App$Action$(_S$1) {
        var $223 = null;
        return $223;
    };
    const App$Action = x0 => App$Action$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$cons$(_head$2, _tail$3) {
        var $224 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $224;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$Action$state$(_value$2) {
        var $225 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $225;
    };
    const App$Action$state = x0 => App$Action$state$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $226 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $226;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Jogo = (() => {
        var _img$1 = Image3D$alloc_capacity$(3200);
        var $227 = App$new$(Pair$new$(128, 128), (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Pair.new':
                    var $229 = self.fst;
                    var $230 = self.snd;
                    var _img$5 = Image3D$clear$(_img$1);
                    var _img$6 = Image3D$Draw$image$($229, $230, 0, Web$Jogo$hero, _img$5);
                    var _img$7 = Image3D$Draw$image$(0, 0, 0, Web$Jogo$hero, _img$6);
                    var $231 = App$Render$pix$(_img$7);
                    var $228 = $231;
                    break;
            };
            return $228;
        }), (_event$2 => _state$3 => {
            var self = _event$2;
            switch (self._) {
                case 'App.Event.xkey':
                    var $233 = self.down;
                    var $234 = self.code;
                    var $235 = List$cons$((() => {
                        var self = _state$3;
                        switch (self._) {
                            case 'Pair.new':
                                var $236 = self.fst;
                                var $237 = self.snd;
                                var self = ($234 === 65);
                                if (self) {
                                    var $239 = Pair$new$((Math.max($236 - 4, 0)), $237);
                                    var self = $239;
                                } else {
                                    var self = ($234 === 68);
                                    if (self) {
                                        var $241 = Pair$new$((($236 + 4) >>> 0), $237);
                                        var $240 = $241;
                                    } else {
                                        var self = ($234 === 87);
                                        if (self) {
                                            var $243 = Pair$new$($236, (Math.max($237 - 4, 0)));
                                            var $242 = $243;
                                        } else {
                                            var self = ($234 === 83);
                                            if (self) {
                                                var $245 = Pair$new$($236, (($237 + 4) >>> 0));
                                                var $244 = $245;
                                            } else {
                                                var $246 = Pair$new$($236, $237);
                                                var $244 = $246;
                                            };
                                            var $242 = $244;
                                        };
                                        var $240 = $242;
                                    };
                                    var self = $240;
                                };
                                switch (self._) {
                                    case 'Pair.new':
                                        var $247 = self.fst;
                                        var $248 = self.snd;
                                        var $249 = App$Action$state$((() => {
                                            var self = $233;
                                            if (self) {
                                                var $250 = Pair$new$($247, $248);
                                                return $250;
                                            } else {
                                                var $251 = Pair$new$($236, $237);
                                                return $251;
                                            };
                                        })());
                                        var $238 = $249;
                                        break;
                                };
                                return $238;
                        };
                    })(), List$nil);
                    var $232 = $235;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.post':
                    var $252 = List$nil;
                    var $232 = $252;
                    break;
            };
            return $232;
        }));
        return $227;
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
        'Image3D.set_length': Image3D$set_length,
        'Image3D.clear': Image3D$clear,
        'Image3D.get_len': Image3D$get_len,
        'U32.for': U32$for,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair': Pair,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'Image3D.get_pos': Image3D$get_pos,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
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
        'List': List,
        'App.Action': App$Action,
        'List.nil': List$nil,
        'List.cons': List$cons,
        'U16.eql': U16$eql,
        'App.Action.state': App$Action$state,
        'App.new': App$new,
        'Web.Jogo': Web$Jogo,
    };
})();

/***/ })

}]);
//# sourceMappingURL=160.index.js.map