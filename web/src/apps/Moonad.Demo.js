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
                var $43 = Bool$false;
                var $42 = $43;
                break;
            case 'Cmp.eql':
                var $44 = Bool$true;
                var $42 = $44;
                break;
            case 'Cmp.gtn':
                var $45 = Bool$false;
                var $42 = $45;
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
            case 'Word.e':
                var $47 = (_b$5 => {
                    var $48 = _c$4;
                    return $48;
                });
                var $46 = $47;
                break;
            case 'Word.o':
                var $49 = self.pred;
                var $50 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $52 = (_a$pred$8 => {
                                var $53 = _c$4;
                                return $53;
                            });
                            var $51 = $52;
                            break;
                        case 'Word.o':
                            var $54 = self.pred;
                            var $55 = (_a$pred$10 => {
                                var $56 = Word$cmp$go$(_a$pred$10, $54, _c$4);
                                return $56;
                            });
                            var $51 = $55;
                            break;
                        case 'Word.i':
                            var $57 = self.pred;
                            var $58 = (_a$pred$10 => {
                                var $59 = Word$cmp$go$(_a$pred$10, $57, Cmp$ltn);
                                return $59;
                            });
                            var $51 = $58;
                            break;
                    };
                    var $51 = $51($49);
                    return $51;
                });
                var $46 = $50;
                break;
            case 'Word.i':
                var $60 = self.pred;
                var $61 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $63 = (_a$pred$8 => {
                                var $64 = _c$4;
                                return $64;
                            });
                            var $62 = $63;
                            break;
                        case 'Word.o':
                            var $65 = self.pred;
                            var $66 = (_a$pred$10 => {
                                var $67 = Word$cmp$go$(_a$pred$10, $65, Cmp$gtn);
                                return $67;
                            });
                            var $62 = $66;
                            break;
                        case 'Word.i':
                            var $68 = self.pred;
                            var $69 = (_a$pred$10 => {
                                var $70 = Word$cmp$go$(_a$pred$10, $68, _c$4);
                                return $70;
                            });
                            var $62 = $69;
                            break;
                    };
                    var $62 = $62($60);
                    return $62;
                });
                var $46 = $61;
                break;
        };
        var $46 = $46(_b$3);
        return $46;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $71 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $71;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $72 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $72;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $73 = 1n + _pred$1;
        return $73;
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
                    var $74 = _x$4;
                    return $74;
                } else {
                    var $75 = (self - 1n);
                    var $76 = Nat$apply$($75, _f$3, _f$3(_x$4));
                    return $76;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$i$(_pred$2) {
        var $77 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $77;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.e':
                var $79 = Word$e;
                var $78 = $79;
                break;
            case 'Word.o':
                var $80 = self.pred;
                var $81 = Word$i$($80);
                var $78 = $81;
                break;
            case 'Word.i':
                var $82 = self.pred;
                var $83 = Word$o$(Word$inc$($82));
                var $78 = $83;
                break;
        };
        return $78;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function U32$inc$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $85 = u32_to_word(self);
                var $86 = U32$new$(Word$inc$($85));
                var $84 = $86;
                break;
        };
        return $84;
    };
    const U32$inc = x0 => U32$inc$(x0);
    const Nat$to_u32 = a0 => (Number(a0));
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function U32$needed_depth$go$(_n$1) {
        var self = (_n$1 === 0);
        if (self) {
            var $88 = 0n;
            var $87 = $88;
        } else {
            var $89 = Nat$succ$(U32$needed_depth$go$((_n$1 >>> 1)));
            var $87 = $89;
        };
        return $87;
    };
    const U32$needed_depth$go = x0 => U32$needed_depth$go$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.e':
                var $91 = (_b$5 => {
                    var $92 = Word$e;
                    return $92;
                });
                var $90 = $91;
                break;
            case 'Word.o':
                var $93 = self.pred;
                var $94 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $96 = (_a$pred$8 => {
                                var $97 = Word$e;
                                return $97;
                            });
                            var $95 = $96;
                            break;
                        case 'Word.o':
                            var $98 = self.pred;
                            var $99 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $101 = Word$i$(Word$subber$(_a$pred$10, $98, Bool$true));
                                    var $100 = $101;
                                } else {
                                    var $102 = Word$o$(Word$subber$(_a$pred$10, $98, Bool$false));
                                    var $100 = $102;
                                };
                                return $100;
                            });
                            var $95 = $99;
                            break;
                        case 'Word.i':
                            var $103 = self.pred;
                            var $104 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $106 = Word$o$(Word$subber$(_a$pred$10, $103, Bool$true));
                                    var $105 = $106;
                                } else {
                                    var $107 = Word$i$(Word$subber$(_a$pred$10, $103, Bool$true));
                                    var $105 = $107;
                                };
                                return $105;
                            });
                            var $95 = $104;
                            break;
                    };
                    var $95 = $95($93);
                    return $95;
                });
                var $90 = $94;
                break;
            case 'Word.i':
                var $108 = self.pred;
                var $109 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $111 = (_a$pred$8 => {
                                var $112 = Word$e;
                                return $112;
                            });
                            var $110 = $111;
                            break;
                        case 'Word.o':
                            var $113 = self.pred;
                            var $114 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $116 = Word$o$(Word$subber$(_a$pred$10, $113, Bool$false));
                                    var $115 = $116;
                                } else {
                                    var $117 = Word$i$(Word$subber$(_a$pred$10, $113, Bool$false));
                                    var $115 = $117;
                                };
                                return $115;
                            });
                            var $110 = $114;
                            break;
                        case 'Word.i':
                            var $118 = self.pred;
                            var $119 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $121 = Word$i$(Word$subber$(_a$pred$10, $118, Bool$true));
                                    var $120 = $121;
                                } else {
                                    var $122 = Word$o$(Word$subber$(_a$pred$10, $118, Bool$false));
                                    var $120 = $122;
                                };
                                return $120;
                            });
                            var $110 = $119;
                            break;
                    };
                    var $110 = $110($108);
                    return $110;
                });
                var $90 = $109;
                break;
        };
        var $90 = $90(_b$3);
        return $90;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $123 = Word$subber$(_a$2, _b$3, Bool$false);
        return $123;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function U32$needed_depth$(_size$1) {
        var $124 = U32$needed_depth$go$((Math.max(_size$1 - 1, 0)));
        return $124;
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
        var $125 = ({
            _: 'Image3D.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $125;
    };
    const Image3D$new = x0 => x1 => x2 => Image3D$new$(x0, x1, x2);

    function Image3D$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $126 = Image3D$new$(0, _capacity$1, _buffer$2);
        return $126;
    };
    const Image3D$alloc_capacity = x0 => Image3D$alloc_capacity$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $127 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $127;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $129 = self.length;
                var $130 = self.capacity;
                var $131 = self.buffer;
                var $132 = Image3D$new$(_length$1, $130, $131);
                var $128 = $132;
                break;
        };
        return $128;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $133 = Image3D$set_length$(0, _img$1);
        return $133;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);

    function App$Render$vox$(_voxs$1) {
        var $134 = ({
            _: 'App.Render.vox',
            'voxs': _voxs$1
        });
        return $134;
    };
    const App$Render$vox = x0 => App$Render$vox$(x0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.e':
                var $136 = (_b$5 => {
                    var $137 = Word$e;
                    return $137;
                });
                var $135 = $136;
                break;
            case 'Word.o':
                var $138 = self.pred;
                var $139 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $141 = (_a$pred$8 => {
                                var $142 = Word$e;
                                return $142;
                            });
                            var $140 = $141;
                            break;
                        case 'Word.o':
                            var $143 = self.pred;
                            var $144 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $146 = Word$i$(Word$adder$(_a$pred$10, $143, Bool$false));
                                    var $145 = $146;
                                } else {
                                    var $147 = Word$o$(Word$adder$(_a$pred$10, $143, Bool$false));
                                    var $145 = $147;
                                };
                                return $145;
                            });
                            var $140 = $144;
                            break;
                        case 'Word.i':
                            var $148 = self.pred;
                            var $149 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $151 = Word$o$(Word$adder$(_a$pred$10, $148, Bool$true));
                                    var $150 = $151;
                                } else {
                                    var $152 = Word$i$(Word$adder$(_a$pred$10, $148, Bool$false));
                                    var $150 = $152;
                                };
                                return $150;
                            });
                            var $140 = $149;
                            break;
                    };
                    var $140 = $140($138);
                    return $140;
                });
                var $135 = $139;
                break;
            case 'Word.i':
                var $153 = self.pred;
                var $154 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $156 = (_a$pred$8 => {
                                var $157 = Word$e;
                                return $157;
                            });
                            var $155 = $156;
                            break;
                        case 'Word.o':
                            var $158 = self.pred;
                            var $159 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $161 = Word$o$(Word$adder$(_a$pred$10, $158, Bool$true));
                                    var $160 = $161;
                                } else {
                                    var $162 = Word$i$(Word$adder$(_a$pred$10, $158, Bool$false));
                                    var $160 = $162;
                                };
                                return $160;
                            });
                            var $155 = $159;
                            break;
                        case 'Word.i':
                            var $163 = self.pred;
                            var $164 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $166 = Word$i$(Word$adder$(_a$pred$10, $163, Bool$true));
                                    var $165 = $166;
                                } else {
                                    var $167 = Word$o$(Word$adder$(_a$pred$10, $163, Bool$true));
                                    var $165 = $167;
                                };
                                return $165;
                            });
                            var $155 = $164;
                            break;
                    };
                    var $155 = $155($153);
                    return $155;
                });
                var $135 = $154;
                break;
        };
        var $135 = $135(_b$3);
        return $135;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $168 = Word$adder$(_a$2, _b$3, Bool$false);
        return $168;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
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
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $170 = Word$e;
            var $169 = $170;
        } else {
            var $171 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.e':
                    var $173 = Word$o$(Word$trim$($171, Word$e));
                    var $172 = $173;
                    break;
                case 'Word.o':
                    var $174 = self.pred;
                    var $175 = Word$o$(Word$trim$($171, $174));
                    var $172 = $175;
                    break;
                case 'Word.i':
                    var $176 = self.pred;
                    var $177 = Word$i$(Word$trim$($171, $176));
                    var $172 = $177;
                    break;
            };
            var $169 = $172;
        };
        return $169;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $179 = self.value;
                var $180 = $179;
                var $178 = $180;
                break;
            case 'Array.tie':
                var $181 = self.lft;
                var $182 = self.rgt;
                var $183 = Unit$new;
                var $178 = $183;
                break;
        };
        return $178;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$(_A$1, _B$2) {
        var $184 = null;
        return $184;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tip':
                var $186 = self.value;
                var $187 = Unit$new;
                var $185 = $187;
                break;
            case 'Array.tie':
                var $188 = self.lft;
                var $189 = self.rgt;
                var $190 = Pair$new$($188, $189);
                var $185 = $190;
                break;
        };
        return $185;
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
                    case 'Word.e':
                        var $191 = _nil$3;
                        return $191;
                    case 'Word.o':
                        var $192 = self.pred;
                        var $193 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $192);
                        return $193;
                    case 'Word.i':
                        var $194 = self.pred;
                        var $195 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $194);
                        return $195;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $196 = Word$foldl$((_arr$6 => {
            var $197 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $197;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $199 = self.fst;
                    var $200 = self.snd;
                    var $201 = Array$tie$(_rec$7($199), $200);
                    var $198 = $201;
                    break;
            };
            return $198;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $203 = self.fst;
                    var $204 = self.snd;
                    var $205 = Array$tie$($203, _rec$7($204));
                    var $202 = $205;
                    break;
            };
            return $202;
        }), _idx$3)(_arr$5);
        return $196;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $206 = Array$mut$(_idx$3, (_x$6 => {
            var $207 = _val$4;
            return $207;
        }), _arr$5);
        return $206;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const Image3D$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const Image3D$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const Image3D$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function List$(_A$1) {
        var $208 = null;
        return $208;
    };
    const List = x0 => List$(x0);

    function App$Action$(_S$1) {
        var $209 = null;
        return $209;
    };
    const App$Action = x0 => App$Action$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$cons$(_head$2, _tail$3) {
        var $210 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $210;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function App$Action$print$(_text$2) {
        var $211 = ({
            _: 'App.Action.print',
            'text': _text$2
        });
        return $211;
    };
    const App$Action$print = x0 => App$Action$print$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $212 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $212;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Moonad$Demo = (() => {
        var _vox$1 = Image3D$alloc_capacity$(256);
        var $213 = App$new$(Pair$new$(64, 64), (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Pair.new':
                    var $215 = self.fst;
                    var $216 = self.snd;
                    var _vox$5 = Image3D$clear$(_vox$1);
                    var $217 = App$Render$vox$((() => {
                        var $218 = _vox$5;
                        var $219 = 0;
                        var $220 = 256;
                        let _vox$7 = $218;
                        for (let _idx$6 = $219; _idx$6 < $220; ++_idx$6) {
                            var _p_x$8 = (Math.max((($215 + (_idx$6 % 16)) >>> 0) - 8, 0));
                            var _p_y$9 = (Math.max((($216 + ((_idx$6 / 16) >>> 0)) >>> 0) - 8, 0));
                            var _pos$10 = ((0 | _p_x$8 | (_p_y$9 << 12) | (128 << 24)));
                            var _col$11 = ((0 | 255 | (0 << 8) | (0 << 16) | (255 << 24)));
                            var _vox$12 = ((_vox$7.buffer[_vox$7.length * 2] = _pos$10, _vox$7.buffer[_vox$7.length * 2 + 1] = _col$11, _vox$7.length++, _vox$7));
                            var $218 = _vox$12;
                            _vox$7 = $218;
                        };
                        return _vox$7;
                    })());
                    var $214 = $217;
                    break;
            };
            return $214;
        }), (_event$2 => _state$3 => {
            var self = _event$2;
            switch (self._) {
                case 'App.Event.init':
                    var $222 = self.time;
                    var $223 = self.addr;
                    var $224 = self.screen;
                    var $225 = self.mouse;
                    var $226 = List$nil;
                    var $221 = $226;
                    break;
                case 'App.Event.tick':
                    var $227 = self.time;
                    var $228 = self.screen;
                    var $229 = self.mouse;
                    var $230 = List$nil;
                    var $221 = $230;
                    break;
                case 'App.Event.xkey':
                    var $231 = self.time;
                    var $232 = self.down;
                    var $233 = self.code;
                    var $234 = List$cons$(App$Action$print$("test"), List$nil);
                    var $221 = $234;
                    break;
                case 'App.Event.post':
                    var $235 = self.time;
                    var $236 = self.room;
                    var $237 = self.addr;
                    var $238 = self.data;
                    var $239 = List$nil;
                    var $221 = $239;
                    break;
            };
            return $221;
        }));
        return $213;
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
        'App.Render.vox': App$Render$vox,
        'U32.for': U32$for,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U32.add': U32$add,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Col32.new': Col32$new,
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
        'List': List,
        'App.Action': App$Action,
        'List.nil': List$nil,
        'List.cons': List$cons,
        'App.Action.print': App$Action$print,
        'App.new': App$new,
        'Moonad.Demo': Moonad$Demo,
    };
})();