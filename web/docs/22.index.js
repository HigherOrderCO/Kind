(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[22],{

/***/ 22:
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
    var bitsmap_new = {
        _: 'BitsMap.new'
    };
    var bitsmap_tie = function(val, lft, rgt) {
        return {
            _: 'BitsMap.tip',
            val,
            lft,
            rgt
        };
    }
    var maybe_none = {
        _: 'Maybe.none'
    };
    var maybe_some = function(value) {
        return {
            _: 'Maybe.some',
            value
        };
    }
    var bitsmap_get = function(bits, map) {
        for (var i = bits.length - 1; i >= 0; --i) {
            if (map._ !== 'BitsMap.new') {
                map = bits[i] === '0' ? map.lft : map.rgt;
            }
        }
        return map._ === 'BitsMap.new' ? maybe_none : map.val;
    }
    var bitsmap_set = function(bits, val, map, mode) {
        var res = {
            value: map
        };
        var key = 'value';
        var obj = res;
        for (var i = bits.length - 1; i >= 0; --i) {
            var map = obj[key];
            if (map._ === 'BitsMap.new') {
                obj[key] = {
                    _: 'BitsMap.tie',
                    val: maybe_none,
                    lft: bitsmap_new,
                    rgt: bitsmap_new
                };
            } else {
                obj[key] = {
                    _: 'BitsMap.tie',
                    val: map.val,
                    lft: map.lft,
                    rgt: map.rgt
                };
            }
            obj = obj[key];
            key = bits[i] === '0' ? 'lft' : 'rgt';
        }
        var map = obj[key];
        if (map._ === 'BitsMap.new') {
            var x = mode === 'del' ? maybe_none : {
                _: 'Maybe.some',
                value: val
            };
            obj[key] = {
                _: 'BitsMap.tie',
                val: x,
                lft: bitsmap_new,
                rgt: bitsmap_new
            };
        } else {
            var x = mode === 'set' ? {
                _: 'Maybe.some',
                value: val
            } : mode === 'del' ? maybe_none : map.val;
            obj[key] = {
                _: 'BitsMap.tie',
                val: x,
                lft: map.lft,
                rgt: map.rgt
            };
        }
        return res.value;
    };
    var list_length = list => {
        var len = 0;
        while (list._ === 'List.cons') {
            len += 1;
            list = list.tail;
        };
        return BigInt(len);
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
                var $2 = c0;
                return $2;
            } else {
                var $3 = c1;
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
                var $5 = c0;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c1($6);
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
                var $24 = c0;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c1($25)($26);
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

    function Nat$succ$(_pred$1) {
        var $48 = 1n + _pred$1;
        return $48;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U32$zero = U32$new$(Word$zero$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero))))))))))))))))))))))))))))))))));
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));

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
                        var $49 = self.pred;
                        var $50 = Word$bit_length$go$($49, Nat$succ$(_c$3), _n$4);
                        return $50;
                    case 'Word.i':
                        var $51 = self.pred;
                        var $52 = Word$bit_length$go$($51, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $52;
                    case 'Word.e':
                        var $53 = _n$4;
                        return $53;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $54 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $54;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $56 = u32_to_word(self);
                var $57 = Word$bit_length$($56);
                var $55 = $57;
                break;
        };
        return $55;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $58 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $58;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $60 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $62 = Word$i$(Word$shift_left$one$go$($60, Bool$false));
                    var $61 = $62;
                } else {
                    var $63 = Word$o$(Word$shift_left$one$go$($60, Bool$false));
                    var $61 = $63;
                };
                var $59 = $61;
                break;
            case 'Word.i':
                var $64 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $66 = Word$i$(Word$shift_left$one$go$($64, Bool$true));
                    var $65 = $66;
                } else {
                    var $67 = Word$o$(Word$shift_left$one$go$($64, Bool$true));
                    var $65 = $67;
                };
                var $59 = $65;
                break;
            case 'Word.e':
                var $68 = Word$e;
                var $59 = $68;
                break;
        };
        return $59;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $70 = self.pred;
                var $71 = Word$o$(Word$shift_left$one$go$($70, Bool$false));
                var $69 = $71;
                break;
            case 'Word.i':
                var $72 = self.pred;
                var $73 = Word$o$(Word$shift_left$one$go$($72, Bool$true));
                var $69 = $73;
                break;
            case 'Word.e':
                var $74 = Word$e;
                var $69 = $74;
                break;
        };
        return $69;
    };
    const Word$shift_left$one = x0 => Word$shift_left$one$(x0);

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
                    var $75 = _value$3;
                    return $75;
                } else {
                    var $76 = (self - 1n);
                    var $77 = Word$shift_left$($76, Word$shift_left$one$(_value$3));
                    return $77;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $79 = self.pred;
                var $80 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $82 = self.pred;
                            var $83 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $85 = Word$i$(Word$adder$(_a$pred$10, $82, Bool$false));
                                    var $84 = $85;
                                } else {
                                    var $86 = Word$o$(Word$adder$(_a$pred$10, $82, Bool$false));
                                    var $84 = $86;
                                };
                                return $84;
                            });
                            var $81 = $83;
                            break;
                        case 'Word.i':
                            var $87 = self.pred;
                            var $88 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $90 = Word$o$(Word$adder$(_a$pred$10, $87, Bool$true));
                                    var $89 = $90;
                                } else {
                                    var $91 = Word$i$(Word$adder$(_a$pred$10, $87, Bool$false));
                                    var $89 = $91;
                                };
                                return $89;
                            });
                            var $81 = $88;
                            break;
                        case 'Word.e':
                            var $92 = (_a$pred$8 => {
                                var $93 = Word$e;
                                return $93;
                            });
                            var $81 = $92;
                            break;
                    };
                    var $81 = $81($79);
                    return $81;
                });
                var $78 = $80;
                break;
            case 'Word.i':
                var $94 = self.pred;
                var $95 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $97 = self.pred;
                            var $98 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $100 = Word$o$(Word$adder$(_a$pred$10, $97, Bool$true));
                                    var $99 = $100;
                                } else {
                                    var $101 = Word$i$(Word$adder$(_a$pred$10, $97, Bool$false));
                                    var $99 = $101;
                                };
                                return $99;
                            });
                            var $96 = $98;
                            break;
                        case 'Word.i':
                            var $102 = self.pred;
                            var $103 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $105 = Word$i$(Word$adder$(_a$pred$10, $102, Bool$true));
                                    var $104 = $105;
                                } else {
                                    var $106 = Word$o$(Word$adder$(_a$pred$10, $102, Bool$true));
                                    var $104 = $106;
                                };
                                return $104;
                            });
                            var $96 = $103;
                            break;
                        case 'Word.e':
                            var $107 = (_a$pred$8 => {
                                var $108 = Word$e;
                                return $108;
                            });
                            var $96 = $107;
                            break;
                    };
                    var $96 = $96($94);
                    return $96;
                });
                var $78 = $95;
                break;
            case 'Word.e':
                var $109 = (_b$5 => {
                    var $110 = Word$e;
                    return $110;
                });
                var $78 = $109;
                break;
        };
        var $78 = $78(_b$3);
        return $78;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $111 = Word$adder$(_a$2, _b$3, Bool$false);
        return $111;
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
                        var $112 = self.pred;
                        var $113 = Word$mul$go$($112, Word$shift_left$(1n, _b$4), _acc$5);
                        return $113;
                    case 'Word.i':
                        var $114 = self.pred;
                        var $115 = Word$mul$go$($114, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $115;
                    case 'Word.e':
                        var $116 = _acc$5;
                        return $116;
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
                var $118 = self.pred;
                var $119 = Word$o$(Word$to_zero$($118));
                var $117 = $119;
                break;
            case 'Word.i':
                var $120 = self.pred;
                var $121 = Word$o$(Word$to_zero$($120));
                var $117 = $121;
                break;
            case 'Word.e':
                var $122 = Word$e;
                var $117 = $122;
                break;
        };
        return $117;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $123 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $123;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

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
                    var $124 = _x$4;
                    return $124;
                } else {
                    var $125 = (self - 1n);
                    var $126 = Nat$apply$($125, _f$3, _f$3(_x$4));
                    return $126;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $128 = self.pred;
                var $129 = Word$i$($128);
                var $127 = $129;
                break;
            case 'Word.i':
                var $130 = self.pred;
                var $131 = Word$o$(Word$inc$($130));
                var $127 = $131;
                break;
            case 'Word.e':
                var $132 = Word$e;
                var $127 = $132;
                break;
        };
        return $127;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $133 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $133;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $134 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $134;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $135 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $135;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const App$Drawing$Constants$room = "0x10000000000999";
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });
    const Map$new = BitsMap$new;

    function App$Drawing$Phase$active$(_turn$1) {
        var $136 = ({
            _: 'App.Drawing.Phase.active',
            'turn': _turn$1
        });
        return $136;
    };
    const App$Drawing$Phase$active = x0 => App$Drawing$Phase$active$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function BitsMap$(_A$1) {
        var $137 = null;
        return $137;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $138 = null;
        return $138;
    };
    const Map = x0 => Map$(x0);

    function App$Drawing$Stage$boards$(_phase$1, _arts$2) {
        var $139 = ({
            _: 'App.Drawing.Stage.boards',
            'phase': _phase$1,
            'arts': _arts$2
        });
        return $139;
    };
    const App$Drawing$Stage$boards = x0 => x1 => App$Drawing$Stage$boards$(x0, x1);

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $140 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $140;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $141 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $141;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);
    const App$Drawing$Tool$pencil = ({
        _: 'App.Drawing.Tool.pencil'
    });

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $143 = self.pred;
                var $144 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $146 = self.pred;
                            var $147 = (_a$pred$9 => {
                                var $148 = Word$o$(Word$or$(_a$pred$9, $146));
                                return $148;
                            });
                            var $145 = $147;
                            break;
                        case 'Word.i':
                            var $149 = self.pred;
                            var $150 = (_a$pred$9 => {
                                var $151 = Word$i$(Word$or$(_a$pred$9, $149));
                                return $151;
                            });
                            var $145 = $150;
                            break;
                        case 'Word.e':
                            var $152 = (_a$pred$7 => {
                                var $153 = Word$e;
                                return $153;
                            });
                            var $145 = $152;
                            break;
                    };
                    var $145 = $145($143);
                    return $145;
                });
                var $142 = $144;
                break;
            case 'Word.i':
                var $154 = self.pred;
                var $155 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $157 = self.pred;
                            var $158 = (_a$pred$9 => {
                                var $159 = Word$i$(Word$or$(_a$pred$9, $157));
                                return $159;
                            });
                            var $156 = $158;
                            break;
                        case 'Word.i':
                            var $160 = self.pred;
                            var $161 = (_a$pred$9 => {
                                var $162 = Word$i$(Word$or$(_a$pred$9, $160));
                                return $162;
                            });
                            var $156 = $161;
                            break;
                        case 'Word.e':
                            var $163 = (_a$pred$7 => {
                                var $164 = Word$e;
                                return $164;
                            });
                            var $156 = $163;
                            break;
                    };
                    var $156 = $156($154);
                    return $156;
                });
                var $142 = $155;
                break;
            case 'Word.e':
                var $165 = (_b$4 => {
                    var $166 = Word$e;
                    return $166;
                });
                var $142 = $165;
                break;
        };
        var $142 = $142(_b$3);
        return $142;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $168 = self.pred;
                var $169 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $168));
                var $167 = $169;
                break;
            case 'Word.i':
                var $170 = self.pred;
                var $171 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $170));
                var $167 = $171;
                break;
            case 'Word.e':
                var $172 = _nil$3;
                var $167 = $172;
                break;
        };
        return $167;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $173 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $174 = Nat$succ$((2n * _x$4));
            return $174;
        }), _word$2);
        return $173;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $175 = Word$shift_left$(_n_nat$4, _value$3);
        return $175;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function App$Drawing$Whiteboard$new$(_past$1, _live$2, _future$3) {
        var $176 = ({
            _: 'App.Drawing.Whiteboard.new',
            'past': _past$1,
            'live': _live$2,
            'future': _future$3
        });
        return $176;
    };
    const App$Drawing$Whiteboard$new = x0 => x1 => x2 => App$Drawing$Whiteboard$new$(x0, x1, x2);

    function List$cons$(_head$2, _tail$3) {
        var $177 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $177;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function App$Drawing$Style$new$(_tool$1, _size$2, _color$3) {
        var $178 = ({
            _: 'App.Drawing.Style.new',
            'tool': _tool$1,
            'size': _size$2,
            'color': _color$3
        });
        return $178;
    };
    const App$Drawing$Style$new = x0 => x1 => x2 => App$Drawing$Style$new$(x0, x1, x2);

    function App$Store$new$(_local$2, _global$3) {
        var $179 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $179;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Drawing$State = App$State$new;

    function App$Drawing$State$local$new$(_input$1, _user$2, _drawing$3, _style$4, _whiteboard$5, _env_info$6) {
        var $180 = ({
            _: 'App.Drawing.State.local.new',
            'input': _input$1,
            'user': _user$2,
            'drawing': _drawing$3,
            'style': _style$4,
            'whiteboard': _whiteboard$5,
            'env_info': _env_info$6
        });
        return $180;
    };
    const App$Drawing$State$local$new = x0 => x1 => x2 => x3 => x4 => x5 => App$Drawing$State$local$new$(x0, x1, x2, x3, x4, x5);

    function App$Drawing$State$global$new$(_room$1, _players$2, _stage$3) {
        var $181 = ({
            _: 'App.Drawing.State.global.new',
            'room': _room$1,
            'players': _players$2,
            'stage': _stage$3
        });
        return $181;
    };
    const App$Drawing$State$global$new = x0 => x1 => x2 => App$Drawing$State$global$new$(x0, x1, x2);

    function App$Drawing$App$init$(_img$1) {
        var _room$2 = App$Drawing$Constants$room;
        var _players$3 = Map$new;
        var _phase$4 = App$Drawing$Phase$active$(0n);
        var _arts$5 = List$nil;
        var _stage$6 = App$Drawing$Stage$boards$(_phase$4, List$nil);
        var _input$7 = "";
        var _user$8 = "";
        var _env_info$9 = App$EnvInfo$new$(Pair$new$(256, 256), Pair$new$(0, 0));
        var _tool$10 = App$Drawing$Tool$pencil;
        var _size$11 = 3;
        var _color$12 = ((0 | 255 | (0 << 8) | (0 << 16) | (125 << 24)));
        var _whiteboard$13 = App$Drawing$Whiteboard$new$(List$cons$(_img$1, List$nil), _img$1, List$nil);
        var _style$14 = App$Drawing$Style$new$(_tool$10, _size$11, _color$12);
        var $182 = App$Store$new$(App$Drawing$State$local$new$(_input$7, _user$8, Bool$false, _style$14, _whiteboard$13, _env_info$9), App$Drawing$State$global$new$(_room$2, _players$3, _stage$6));
        return $182;
    };
    const App$Drawing$App$init = x0 => App$Drawing$App$init$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $184 = self.fst;
                var $185 = $184;
                var $183 = $185;
                break;
        };
        return $183;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $187 = self.capacity;
                var $188 = self.buffer;
                var $189 = VoxBox$new$(_length$1, $187, $188);
                var $186 = $189;
                break;
        };
        return $186;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);

    function VoxBox$clear$(_img$1) {
        var $190 = VoxBox$set_length$(0, _img$1);
        return $190;
    };
    const VoxBox$clear = x0 => VoxBox$clear$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $192 = self.length;
                var $193 = $192;
                var $191 = $193;
                break;
        };
        return $191;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $195 = Bool$false;
                var $194 = $195;
                break;
            case 'Cmp.eql':
                var $196 = Bool$true;
                var $194 = $196;
                break;
        };
        return $194;
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
                var $198 = self.pred;
                var $199 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $201 = self.pred;
                            var $202 = (_a$pred$10 => {
                                var $203 = Word$cmp$go$(_a$pred$10, $201, _c$4);
                                return $203;
                            });
                            var $200 = $202;
                            break;
                        case 'Word.i':
                            var $204 = self.pred;
                            var $205 = (_a$pred$10 => {
                                var $206 = Word$cmp$go$(_a$pred$10, $204, Cmp$ltn);
                                return $206;
                            });
                            var $200 = $205;
                            break;
                        case 'Word.e':
                            var $207 = (_a$pred$8 => {
                                var $208 = _c$4;
                                return $208;
                            });
                            var $200 = $207;
                            break;
                    };
                    var $200 = $200($198);
                    return $200;
                });
                var $197 = $199;
                break;
            case 'Word.i':
                var $209 = self.pred;
                var $210 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $212 = self.pred;
                            var $213 = (_a$pred$10 => {
                                var $214 = Word$cmp$go$(_a$pred$10, $212, Cmp$gtn);
                                return $214;
                            });
                            var $211 = $213;
                            break;
                        case 'Word.i':
                            var $215 = self.pred;
                            var $216 = (_a$pred$10 => {
                                var $217 = Word$cmp$go$(_a$pred$10, $215, _c$4);
                                return $217;
                            });
                            var $211 = $216;
                            break;
                        case 'Word.e':
                            var $218 = (_a$pred$8 => {
                                var $219 = _c$4;
                                return $219;
                            });
                            var $211 = $218;
                            break;
                    };
                    var $211 = $211($209);
                    return $211;
                });
                var $197 = $210;
                break;
            case 'Word.e':
                var $220 = (_b$5 => {
                    var $221 = _c$4;
                    return $221;
                });
                var $197 = $220;
                break;
        };
        var $197 = $197(_b$3);
        return $197;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $222 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $222;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $223 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $223;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $225 = Word$e;
            var $224 = $225;
        } else {
            var $226 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $228 = self.pred;
                    var $229 = Word$o$(Word$trim$($226, $228));
                    var $227 = $229;
                    break;
                case 'Word.i':
                    var $230 = self.pred;
                    var $231 = Word$i$(Word$trim$($226, $230));
                    var $227 = $231;
                    break;
                case 'Word.e':
                    var $232 = Word$o$(Word$trim$($226, Word$e));
                    var $227 = $232;
                    break;
            };
            var $224 = $227;
        };
        return $224;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $234 = self.value;
                var $235 = $234;
                var $233 = $235;
                break;
            case 'Array.tie':
                var $236 = Unit$new;
                var $233 = $236;
                break;
        };
        return $233;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$(_A$1, _B$2) {
        var $237 = null;
        return $237;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $239 = self.lft;
                var $240 = self.rgt;
                var $241 = Pair$new$($239, $240);
                var $238 = $241;
                break;
            case 'Array.tip':
                var $242 = Unit$new;
                var $238 = $242;
                break;
        };
        return $238;
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
                        var $243 = self.pred;
                        var $244 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $243);
                        return $244;
                    case 'Word.i':
                        var $245 = self.pred;
                        var $246 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $245);
                        return $246;
                    case 'Word.e':
                        var $247 = _nil$3;
                        return $247;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$get$(_idx$3, _arr$4) {
        var $248 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $250 = self.fst;
                    var $251 = _rec$6($250);
                    var $249 = $251;
                    break;
            };
            return $249;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $253 = self.snd;
                    var $254 = _rec$6($253);
                    var $252 = $254;
                    break;
            };
            return $252;
        }), _idx$3)(_arr$4);
        return $248;
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
                var $256 = self.pred;
                var $257 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $259 = self.pred;
                            var $260 = (_a$pred$9 => {
                                var $261 = Word$o$(Word$and$(_a$pred$9, $259));
                                return $261;
                            });
                            var $258 = $260;
                            break;
                        case 'Word.i':
                            var $262 = self.pred;
                            var $263 = (_a$pred$9 => {
                                var $264 = Word$o$(Word$and$(_a$pred$9, $262));
                                return $264;
                            });
                            var $258 = $263;
                            break;
                        case 'Word.e':
                            var $265 = (_a$pred$7 => {
                                var $266 = Word$e;
                                return $266;
                            });
                            var $258 = $265;
                            break;
                    };
                    var $258 = $258($256);
                    return $258;
                });
                var $255 = $257;
                break;
            case 'Word.i':
                var $267 = self.pred;
                var $268 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $270 = self.pred;
                            var $271 = (_a$pred$9 => {
                                var $272 = Word$o$(Word$and$(_a$pred$9, $270));
                                return $272;
                            });
                            var $269 = $271;
                            break;
                        case 'Word.i':
                            var $273 = self.pred;
                            var $274 = (_a$pred$9 => {
                                var $275 = Word$i$(Word$and$(_a$pred$9, $273));
                                return $275;
                            });
                            var $269 = $274;
                            break;
                        case 'Word.e':
                            var $276 = (_a$pred$7 => {
                                var $277 = Word$e;
                                return $277;
                            });
                            var $269 = $276;
                            break;
                    };
                    var $269 = $269($267);
                    return $269;
                });
                var $255 = $268;
                break;
            case 'Word.e':
                var $278 = (_b$4 => {
                    var $279 = Word$e;
                    return $279;
                });
                var $255 = $278;
                break;
        };
        var $255 = $255(_b$3);
        return $255;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $281 = self.pred;
                var $282 = Word$o$(Word$shift_right$one$go$($281));
                var $280 = $282;
                break;
            case 'Word.i':
                var $283 = self.pred;
                var $284 = Word$i$(Word$shift_right$one$go$($283));
                var $280 = $284;
                break;
            case 'Word.e':
                var $285 = Word$o$(Word$e);
                var $280 = $285;
                break;
        };
        return $280;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $287 = self.pred;
                var $288 = Word$shift_right$one$go$($287);
                var $286 = $288;
                break;
            case 'Word.i':
                var $289 = self.pred;
                var $290 = Word$shift_right$one$go$($289);
                var $286 = $290;
                break;
            case 'Word.e':
                var $291 = Word$e;
                var $286 = $291;
                break;
        };
        return $286;
    };
    const Word$shift_right$one = x0 => Word$shift_right$one$(x0);

    function Word$shift_right$(_n$2, _value$3) {
        var Word$shift_right$ = (_n$2, _value$3) => ({
            ctr: 'TCO',
            arg: [_n$2, _value$3]
        });
        var Word$shift_right = _n$2 => _value$3 => Word$shift_right$(_n$2, _value$3);
        var arg = [_n$2, _value$3];
        while (true) {
            let [_n$2, _value$3] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $292 = _value$3;
                    return $292;
                } else {
                    var $293 = (self - 1n);
                    var $294 = Word$shift_right$($293, Word$shift_right$one$(_value$3));
                    return $294;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_right = x0 => x1 => Word$shift_right$(x0, x1);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $295 = Word$shift_right$(_n_nat$4, _value$3);
        return $295;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);
    const U32$shr = a0 => a1 => (a0 >>> a1);
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

    function App$Drawing$draw$boards$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $313 = self.local;
                var $314 = $313;
                var _local$3 = $314;
                break;
        };
        var self = _local$3;
        switch (self._) {
            case 'App.Drawing.State.local.new':
                var $315 = self.whiteboard;
                var $316 = $315;
                var _whiteboard$4 = $316;
                break;
        };
        var _img$5 = VoxBox$clear$(_img$1);
        var $312 = VoxBox$Draw$image$(0, 0, 0, (() => {
            var self = _whiteboard$4;
            switch (self._) {
                case 'App.Drawing.Whiteboard.new':
                    var $317 = self.live;
                    var $318 = $317;
                    return $318;
            };
        })(), _img$5);
        return $312;
    };
    const App$Drawing$draw$boards = x0 => x1 => App$Drawing$draw$boards$(x0, x1);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $319 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $319;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $320 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $320;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $321 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $321;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $323 = self.pred;
                var $324 = (Word$to_bits$($323) + '0');
                var $322 = $324;
                break;
            case 'Word.i':
                var $325 = self.pred;
                var $326 = (Word$to_bits$($325) + '1');
                var $322 = $326;
                break;
            case 'Word.e':
                var $327 = Bits$e;
                var $322 = $327;
                break;
        };
        return $322;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $329 = Bits$e;
            var $328 = $329;
        } else {
            var $330 = self.charCodeAt(0);
            var $331 = self.slice(1);
            var $332 = (String$to_bits$($331) + (u16_to_bits($330)));
            var $328 = $332;
        };
        return $328;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $334 = self.head;
                var $335 = self.tail;
                var self = $334;
                switch (self._) {
                    case 'Pair.new':
                        var $337 = self.fst;
                        var $338 = self.snd;
                        var $339 = (bitsmap_set(String$to_bits$($337), $338, Map$from_list$($335), 'set'));
                        var $336 = $339;
                        break;
                };
                var $333 = $336;
                break;
            case 'List.nil':
                var $340 = BitsMap$new;
                var $333 = $340;
                break;
        };
        return $333;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function App$Drawing$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var _img$5 = App$Drawing$draw$boards$(_img$1, _state$2);
                var $342 = DOM$vbox$(Map$from_list$(List$cons$(Pair$new$("width", "256"), List$nil)), Map$from_list$(List$nil), _img$5);
                var $341 = $342;
                break;
        };
        return $341;
    };
    const App$Drawing$App$draw = x0 => x1 => App$Drawing$App$draw$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $344 = self.snd;
                var $345 = $344;
                var $343 = $345;
                break;
        };
        return $343;
    };
    const Pair$snd = x0 => Pair$snd$(x0);
    const App$State$global = Pair$snd;

    function IO$(_A$1) {
        var $346 = null;
        return $346;
    };
    const IO = x0 => IO$(x0);

    function Maybe$(_A$1) {
        var $347 = null;
        return $347;
    };
    const Maybe = x0 => Maybe$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $348 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $348;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $350 = self.value;
                var $351 = _f$4($350);
                var $349 = $351;
                break;
            case 'IO.ask':
                var $352 = self.query;
                var $353 = self.param;
                var $354 = self.then;
                var $355 = IO$ask$($352, $353, (_x$8 => {
                    var $356 = IO$bind$($354(_x$8), _f$4);
                    return $356;
                }));
                var $349 = $355;
                break;
        };
        return $349;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $357 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $357;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $358 = _new$2(IO$bind)(IO$end);
        return $358;
    };
    const IO$monad = x0 => IO$monad$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $359 = _m$pure$3;
        return $359;
    }))(Maybe$none);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $361 = Bool$false;
                var $360 = $361;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $362 = Bool$true;
                var $360 = $362;
                break;
        };
        return $360;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $363 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $363;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $365 = self.pred;
                var $366 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $368 = self.pred;
                            var $369 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $371 = Word$i$(Word$subber$(_a$pred$10, $368, Bool$true));
                                    var $370 = $371;
                                } else {
                                    var $372 = Word$o$(Word$subber$(_a$pred$10, $368, Bool$false));
                                    var $370 = $372;
                                };
                                return $370;
                            });
                            var $367 = $369;
                            break;
                        case 'Word.i':
                            var $373 = self.pred;
                            var $374 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $376 = Word$o$(Word$subber$(_a$pred$10, $373, Bool$true));
                                    var $375 = $376;
                                } else {
                                    var $377 = Word$i$(Word$subber$(_a$pred$10, $373, Bool$true));
                                    var $375 = $377;
                                };
                                return $375;
                            });
                            var $367 = $374;
                            break;
                        case 'Word.e':
                            var $378 = (_a$pred$8 => {
                                var $379 = Word$e;
                                return $379;
                            });
                            var $367 = $378;
                            break;
                    };
                    var $367 = $367($365);
                    return $367;
                });
                var $364 = $366;
                break;
            case 'Word.i':
                var $380 = self.pred;
                var $381 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $383 = self.pred;
                            var $384 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $386 = Word$o$(Word$subber$(_a$pred$10, $383, Bool$false));
                                    var $385 = $386;
                                } else {
                                    var $387 = Word$i$(Word$subber$(_a$pred$10, $383, Bool$false));
                                    var $385 = $387;
                                };
                                return $385;
                            });
                            var $382 = $384;
                            break;
                        case 'Word.i':
                            var $388 = self.pred;
                            var $389 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $391 = Word$i$(Word$subber$(_a$pred$10, $388, Bool$true));
                                    var $390 = $391;
                                } else {
                                    var $392 = Word$o$(Word$subber$(_a$pred$10, $388, Bool$false));
                                    var $390 = $392;
                                };
                                return $390;
                            });
                            var $382 = $389;
                            break;
                        case 'Word.e':
                            var $393 = (_a$pred$8 => {
                                var $394 = Word$e;
                                return $394;
                            });
                            var $382 = $393;
                            break;
                    };
                    var $382 = $382($380);
                    return $382;
                });
                var $364 = $381;
                break;
            case 'Word.e':
                var $395 = (_b$5 => {
                    var $396 = Word$e;
                    return $396;
                });
                var $364 = $395;
                break;
        };
        var $364 = $364(_b$3);
        return $364;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $397 = Word$subber$(_a$2, _b$3, Bool$false);
        return $397;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);

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
                    var $398 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $398;
                } else {
                    var $399 = Pair$new$(Bool$false, _value$5);
                    var self = $399;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $400 = self.fst;
                        var $401 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $403 = $401;
                            var $402 = $403;
                        } else {
                            var $404 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $400;
                            if (self) {
                                var $406 = Word$div$go$($404, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $401);
                                var $405 = $406;
                            } else {
                                var $407 = Word$div$go$($404, _sub_copy$3, _new_shift_copy$9, $401);
                                var $405 = $407;
                            };
                            var $402 = $405;
                        };
                        return $402;
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
            var $409 = Word$to_zero$(_a$2);
            var $408 = $409;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $410 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $408 = $410;
        };
        return $408;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $411 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $411;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function VoxBox$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $412 = (() => {
            var $413 = _img$7;
            var $414 = 0;
            var $415 = _siz$8;
            let _pix$12 = $413;
            for (let _idx$11 = $414; _idx$11 < $415; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = ((((_x$1 + _v_x$13) >>> 0) - _w_2$9) >>> 0);
                var _p_y$16 = ((((_y$2 + _v_y$14) >>> 0) - _h_2$10) >>> 0);
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _pix$18 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$6, _pix$12.length++, _pix$12));
                var $413 = _pix$18;
                _pix$12 = $413;
            };
            return _pix$12;
        })();
        return $412;
    };
    const VoxBox$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function App$Drawing$draw$pencil$(_local$1) {
        var $416 = ((console.log("push"), (_$2 => {
            var self = _local$1;
            switch (self._) {
                case 'App.Drawing.State.local.new':
                    var $418 = self.style;
                    var $419 = $418;
                    var _style$3 = $419;
                    break;
            };
            var self = _style$3;
            switch (self._) {
                case 'App.Drawing.Style.new':
                    var $420 = self.size;
                    var $421 = $420;
                    var _size$4 = $421;
                    break;
            };
            var self = _local$1;
            switch (self._) {
                case 'App.Drawing.State.local.new':
                    var $422 = self.whiteboard;
                    var $423 = $422;
                    var _wb$5 = $423;
                    break;
            };
            var self = _local$1;
            switch (self._) {
                case 'App.Drawing.State.local.new':
                    var $424 = self.env_info;
                    var $425 = $424;
                    var self = $425;
                    break;
            };
            switch (self._) {
                case 'App.EnvInfo.new':
                    var $426 = self.mouse_pos;
                    var $427 = $426;
                    var _info$6 = $427;
                    break;
            };
            var self = _style$3;
            switch (self._) {
                case 'App.Drawing.Style.new':
                    var $428 = self.color;
                    var $429 = $428;
                    var _color$7 = $429;
                    break;
            };
            var _new_board$8 = VoxBox$Draw$square$((() => {
                var self = _info$6;
                switch (self._) {
                    case 'Pair.new':
                        var $430 = self.fst;
                        var $431 = $430;
                        return $431;
                };
            })(), (() => {
                var self = _info$6;
                switch (self._) {
                    case 'Pair.new':
                        var $432 = self.snd;
                        var $433 = $432;
                        return $433;
                };
            })(), 0, _size$4, _size$4, _color$7, (() => {
                var self = _wb$5;
                switch (self._) {
                    case 'App.Drawing.Whiteboard.new':
                        var $434 = self.live;
                        var $435 = $434;
                        return $435;
                };
            })());
            var self = _wb$5;
            switch (self._) {
                case 'App.Drawing.Whiteboard.new':
                    var $436 = self.past;
                    var $437 = self.future;
                    var $438 = App$Drawing$Whiteboard$new$($436, _new_board$8, $437);
                    var _new_wb$9 = $438;
                    break;
            };
            var self = _local$1;
            switch (self._) {
                case 'App.Drawing.State.local.new':
                    var $439 = self.input;
                    var $440 = self.user;
                    var $441 = self.drawing;
                    var $442 = self.style;
                    var $443 = self.env_info;
                    var $444 = App$Drawing$State$local$new$($439, $440, $441, $442, _new_wb$9, $443);
                    var $417 = $444;
                    break;
            };
            return $417;
        })()));
        return $416;
    };
    const App$Drawing$draw$pencil = x0 => App$Drawing$draw$pencil$(x0);

    function App$set_local$(_value$2) {
        var $445 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $446 = _m$pure$4;
            return $446;
        }))(Maybe$some$(_value$2));
        return $445;
    };
    const App$set_local = x0 => App$set_local$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $448 = self.head;
                var $449 = self.tail;
                var $450 = _cons$5($448)(List$fold$($449, _nil$4, _cons$5));
                var $447 = $450;
                break;
            case 'List.nil':
                var $451 = _nil$4;
                var $447 = $451;
                break;
        };
        return $447;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $452 = null;
        return $452;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $453 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $453;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $454 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $454;
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
                    var $455 = Either$left$(_n$1);
                    return $455;
                } else {
                    var $456 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $458 = Either$right$(Nat$succ$($456));
                        var $457 = $458;
                    } else {
                        var $459 = (self - 1n);
                        var $460 = Nat$sub_rem$($459, $456);
                        var $457 = $460;
                    };
                    return $457;
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
                        var $461 = self.value;
                        var $462 = Nat$div_mod$go$($461, _m$2, Nat$succ$(_d$3));
                        return $462;
                    case 'Either.right':
                        var $463 = Pair$new$(_d$3, _n$1);
                        return $463;
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

    function List$(_A$1) {
        var $464 = null;
        return $464;
    };
    const List = x0 => List$(x0);

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
                        var $465 = self.fst;
                        var $466 = self.snd;
                        var self = $465;
                        if (self === 0n) {
                            var $468 = List$cons$($466, _res$3);
                            var $467 = $468;
                        } else {
                            var $469 = (self - 1n);
                            var $470 = Nat$to_base$go$(_base$1, $465, List$cons$($466, _res$3));
                            var $467 = $470;
                        };
                        return $467;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $471 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $471;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const String$nil = '';

    function String$cons$(_head$1, _tail$2) {
        var $472 = (String.fromCharCode(_head$1) + _tail$2);
        return $472;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);

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
                    var $473 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $473;
                } else {
                    var $474 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $476 = _r$3;
                        var $475 = $476;
                    } else {
                        var $477 = (self - 1n);
                        var $478 = Nat$mod$go$($477, $474, Nat$succ$(_r$3));
                        var $475 = $478;
                    };
                    return $475;
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
                        var $479 = self.head;
                        var $480 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $482 = Maybe$some$($479);
                            var $481 = $482;
                        } else {
                            var $483 = (self - 1n);
                            var $484 = List$at$($483, $480);
                            var $481 = $484;
                        };
                        return $481;
                    case 'List.nil':
                        var $485 = Maybe$none;
                        return $485;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = (_n$2 % _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $488 = self.value;
                    var $489 = $488;
                    var $487 = $489;
                    break;
                case 'Maybe.none':
                    var $490 = 35;
                    var $487 = $490;
                    break;
            };
            var $486 = $487;
        } else {
            var $491 = 35;
            var $486 = $491;
        };
        return $486;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $492 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $493 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $493;
        }));
        return $492;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $494 = Nat$to_string_base$(10n, _n$1);
        return $494;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const List$length = a0 => (list_length(a0));

    function App$Drawing$Action$local$save$(_local$1) {
        var self = _local$1;
        switch (self._) {
            case 'App.Drawing.State.local.new':
                var $496 = self.whiteboard;
                var self = $496;
                switch (self._) {
                    case 'App.Drawing.Whiteboard.new':
                        var $498 = self.past;
                        var $499 = self.live;
                        var _past$11 = List$cons$($499, $498);
                        var _live$12 = $499;
                        var _future$13 = List$nil;
                        var $500 = ((console.log(Nat$show$((list_length(_past$11)))), (_$14 => {
                            var _whiteboard$15 = App$Drawing$Whiteboard$new$(_past$11, _live$12, _future$13);
                            var self = _local$1;
                            switch (self._) {
                                case 'App.Drawing.State.local.new':
                                    var $502 = self.input;
                                    var $503 = self.user;
                                    var $504 = self.drawing;
                                    var $505 = self.style;
                                    var $506 = self.env_info;
                                    var $507 = App$Drawing$State$local$new$($502, $503, $504, $505, _whiteboard$15, $506);
                                    var $501 = $507;
                                    break;
                            };
                            return $501;
                        })()));
                        var $497 = $500;
                        break;
                };
                var $495 = $497;
                break;
        };
        return $495;
    };
    const App$Drawing$Action$local$save = x0 => App$Drawing$Action$local$save$(x0);
    const U16$eql = a0 => a1 => (a0 === a1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $509 = self.tail;
                var $510 = $509;
                var $508 = $510;
                break;
            case 'List.nil':
                var $511 = List$nil;
                var $508 = $511;
                break;
        };
        return $508;
    };
    const List$tail = x0 => List$tail$(x0);
    const String$concat = a0 => a1 => (a0 + a1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $513 = self.value;
                var $514 = $513;
                var $512 = $514;
                break;
            case 'Maybe.none':
                var $515 = _a$3;
                var $512 = $515;
                break;
        };
        return $512;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function List$head$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $517 = self.head;
                var $518 = Maybe$some$($517);
                var $516 = $518;
                break;
            case 'List.nil':
                var $519 = Maybe$none;
                var $516 = $519;
                break;
        };
        return $516;
    };
    const List$head = x0 => List$head$(x0);

    function App$Drawing$Action$local$ctrl_z$(_local$1) {
        var self = _local$1;
        switch (self._) {
            case 'App.Drawing.State.local.new':
                var $521 = self.whiteboard;
                var self = $521;
                switch (self._) {
                    case 'App.Drawing.Whiteboard.new':
                        var $523 = self.past;
                        var $524 = self.live;
                        var $525 = self.future;
                        var _past$11 = List$tail$($523);
                        var self = _past$11;
                        switch (self._) {
                            case 'List.nil':
                                var $527 = ((console.log("nil"), (_$12 => {
                                    var $528 = _local$1;
                                    return $528;
                                })()));
                                var $526 = $527;
                                break;
                            case 'List.cons':
                                var $529 = ((console.log("cons"), (_$14 => {
                                    var _square$15 = VoxBox$Draw$square$(126, 126, 0, 20, 20, ((0 | 0 | (255 << 8) | (0 << 16) | (125 << 24))), $524);
                                    var $530 = ((console.log(("past_length: " + Nat$show$((list_length(_past$11))))), (_$16 => {
                                        var head = List$head$(_past$11);
                                        console.log("head:", head);
                                        var _live$17 = Maybe$default$(head, _square$15);
                                        console.log("live:", _live$17);
                                        var _cleared$18 = VoxBox$clear$(_live$17);
                                        var _live$19 = VoxBox$Draw$image$(0, 0, 0, _live$17, _cleared$18);
                                        var _future$20 = List$cons$($524, $525);
                                        var _wb$21 = App$Drawing$Whiteboard$new$(_past$11, _live$19, _future$20);
                                        var self = _local$1;
                                        switch (self._) {
                                            case 'App.Drawing.State.local.new':
                                                var $532 = self.input;
                                                var $533 = self.user;
                                                var $534 = self.drawing;
                                                var $535 = self.style;
                                                var $536 = self.env_info;
                                                var $537 = App$Drawing$State$local$new$($532, $533, $534, $535, _wb$21, $536);
                                                var _new_local$22 = $537;
                                                break;
                                        };
                                        var $531 = _new_local$22;
                                        return $531;
                                    })()));
                                    return $530;
                                })()));
                                var $526 = $529;
                                break;
                        };
                        var $522 = $526;
                        break;
                };
                var $520 = $522;
                break;
        };
        return $520;
    };
    const App$Drawing$Action$local$ctrl_z = x0 => App$Drawing$Action$local$ctrl_z$(x0);

    function App$Drawing$when$boards$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $539 = self.local;
                var $540 = $539;
                var _local$3 = $540;
                break;
        };
        var self = _event$1;
        switch (self._) {
            case 'App.Event.frame':
                var $541 = self.info;
                var self = _local$3;
                switch (self._) {
                    case 'App.Drawing.State.local.new':
                        var $543 = self.drawing;
                        var $544 = $543;
                        var self = $544;
                        break;
                };
                if (self) {
                    var $545 = App$Drawing$draw$pencil$(_local$3);
                    var _new_local$6 = $545;
                } else {
                    var $546 = _local$3;
                    var _new_local$6 = $546;
                };
                var self = _local$3;
                switch (self._) {
                    case 'App.Drawing.State.local.new':
                        var $547 = self.input;
                        var $548 = self.user;
                        var $549 = self.drawing;
                        var $550 = self.style;
                        var $551 = self.whiteboard;
                        var $552 = App$Drawing$State$local$new$($547, $548, $549, $550, $551, $541);
                        var _new_local$7 = $552;
                        break;
                };
                var $542 = App$set_local$(_new_local$7);
                var $538 = $542;
                break;
            case 'App.Event.key_down':
                var $553 = self.code;
                var self = ($553 === 65);
                if (self) {
                    var self = _local$3;
                    switch (self._) {
                        case 'App.Drawing.State.local.new':
                            var $556 = self.style;
                            var $557 = $556;
                            var _style$6 = $557;
                            break;
                    };
                    var self = _style$6;
                    switch (self._) {
                        case 'App.Drawing.Style.new':
                            var $558 = self.tool;
                            var $559 = self.size;
                            var $560 = App$Drawing$Style$new$($558, $559, ((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24))));
                            var _style$7 = $560;
                            break;
                    };
                    var self = _local$3;
                    switch (self._) {
                        case 'App.Drawing.State.local.new':
                            var $561 = self.input;
                            var $562 = self.user;
                            var $563 = self.drawing;
                            var $564 = self.whiteboard;
                            var $565 = self.env_info;
                            var $566 = App$Drawing$State$local$new$($561, $562, $563, _style$7, $564, $565);
                            var _new_local$8 = $566;
                            break;
                    };
                    var $555 = App$set_local$(_new_local$8);
                    var $554 = $555;
                } else {
                    var self = ($553 === 83);
                    if (self) {
                        var self = _local$3;
                        switch (self._) {
                            case 'App.Drawing.State.local.new':
                                var $569 = self.style;
                                var $570 = $569;
                                var _style$6 = $570;
                                break;
                        };
                        var self = _style$6;
                        switch (self._) {
                            case 'App.Drawing.Style.new':
                                var $571 = self.tool;
                                var $572 = self.size;
                                var $573 = App$Drawing$Style$new$($571, $572, ((0 | 255 | (0 << 8) | (0 << 16) | (255 << 24))));
                                var _style$7 = $573;
                                break;
                        };
                        var self = _local$3;
                        switch (self._) {
                            case 'App.Drawing.State.local.new':
                                var $574 = self.input;
                                var $575 = self.user;
                                var $576 = self.drawing;
                                var $577 = self.whiteboard;
                                var $578 = self.env_info;
                                var $579 = App$Drawing$State$local$new$($574, $575, $576, _style$7, $577, $578);
                                var _new_local$8 = $579;
                                break;
                        };
                        var $568 = App$set_local$(_new_local$8);
                        var $567 = $568;
                    } else {
                        var self = ($553 === 90);
                        if (self) {
                            var $581 = App$set_local$(App$Drawing$Action$local$ctrl_z$(_local$3));
                            var $580 = $581;
                        } else {
                            var $582 = App$pass;
                            var $580 = $582;
                        };
                        var $567 = $580;
                    };
                    var $554 = $567;
                };
                var $538 = $554;
                break;
            case 'App.Event.init':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $583 = App$pass;
                var $538 = $583;
                break;
            case 'App.Event.mouse_down':
                var self = _local$3;
                switch (self._) {
                    case 'App.Drawing.State.local.new':
                        var $585 = self.input;
                        var $586 = self.user;
                        var $587 = self.style;
                        var $588 = self.whiteboard;
                        var $589 = self.env_info;
                        var $590 = App$Drawing$State$local$new$($585, $586, Bool$true, $587, $588, $589);
                        var _new_local$6 = $590;
                        break;
                };
                var $584 = App$set_local$(_new_local$6);
                var $538 = $584;
                break;
            case 'App.Event.mouse_up':
                var self = _local$3;
                switch (self._) {
                    case 'App.Drawing.State.local.new':
                        var $592 = self.input;
                        var $593 = self.user;
                        var $594 = self.style;
                        var $595 = self.whiteboard;
                        var $596 = self.env_info;
                        var $597 = App$Drawing$State$local$new$($592, $593, Bool$false, $594, $595, $596);
                        var _new_local$6 = $597;
                        break;
                };
                var _new_local$7 = App$Drawing$Action$local$save$(_new_local$6);
                var $591 = App$set_local$(_new_local$7);
                var $538 = $591;
                break;
        };
        return $538;
    };
    const App$Drawing$when$boards = x0 => x1 => App$Drawing$when$boards$(x0, x1);

    function App$Drawing$App$when$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $599 = self.global;
                var $600 = $599;
                var self = $600;
                break;
        };
        switch (self._) {
            case 'App.Drawing.State.global.new':
                var $601 = self.stage;
                var $602 = $601;
                var _stage$3 = $602;
                break;
        };
        var self = _stage$3;
        switch (self._) {
            case 'App.Drawing.Stage.start':
            case 'App.Drawing.Stage.menu':
                var $603 = App$pass;
                var $598 = $603;
                break;
            case 'App.Drawing.Stage.boards':
                var $604 = App$Drawing$when$boards$(_event$1, _state$2);
                var $598 = $604;
                break;
        };
        return $598;
    };
    const App$Drawing$App$when = x0 => x1 => App$Drawing$App$when$(x0, x1);

    function App$Drawing$App$tick$(_tick$1, _glob$2) {
        var $605 = _glob$2;
        return $605;
    };
    const App$Drawing$App$tick = x0 => x1 => App$Drawing$App$tick$(x0, x1);

    function App$Drawing$App$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var $606 = _glob$5;
        return $606;
    };
    const App$Drawing$App$post = x0 => x1 => x2 => x3 => x4 => App$Drawing$App$post$(x0, x1, x2, x3, x4);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $607 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $607;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$Drawing = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = App$Drawing$App$init$(_img$1);
        var _draw$3 = App$Drawing$App$draw(_img$1);
        var _when$4 = App$Drawing$App$when;
        var _tick$5 = App$Drawing$App$tick;
        var _post$6 = App$Drawing$App$post;
        var $608 = App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6);
        return $608;
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
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'U32.bit_length': U32$bit_length,
        'Word.i': Word$i,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Word.shift_left.one.go': Word$shift_left$one$go,
        'Word.shift_left.one': Word$shift_left$one,
        'Word.shift_left': Word$shift_left,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'Word.mul.go': Word$mul$go,
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'Nat.apply': Nat$apply,
        'Word.inc': Word$inc,
        'Nat.to_word': Nat$to_word,
        'Nat.to_u32': Nat$to_u32,
        'VoxBox.new': VoxBox$new,
        'VoxBox.alloc_capacity': VoxBox$alloc_capacity,
        'App.Drawing.Constants.room': App$Drawing$Constants$room,
        'BitsMap.new': BitsMap$new,
        'Map.new': Map$new,
        'App.Drawing.Phase.active': App$Drawing$Phase$active,
        'List.nil': List$nil,
        'BitsMap': BitsMap,
        'Map': Map,
        'App.Drawing.Stage.boards': App$Drawing$Stage$boards,
        'App.EnvInfo.new': App$EnvInfo$new,
        'Pair.new': Pair$new,
        'U32.from_nat': U32$from_nat,
        'App.Drawing.Tool.pencil': App$Drawing$Tool$pencil,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'Word.shl': Word$shl,
        'U32.shl': U32$shl,
        'Col32.new': Col32$new,
        'App.Drawing.Whiteboard.new': App$Drawing$Whiteboard$new,
        'List.cons': List$cons,
        'App.Drawing.Style.new': App$Drawing$Style$new,
        'App.Store.new': App$Store$new,
        'App.State.new': App$State$new,
        'App.Drawing.State': App$Drawing$State,
        'App.Drawing.State.local.new': App$Drawing$State$local$new,
        'App.Drawing.State.global.new': App$Drawing$State$global$new,
        'App.Drawing.App.init': App$Drawing$App$init,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.clear': VoxBox$clear,
        'VoxBox.get_len': VoxBox$get_len,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair': Pair,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'U32.add': U32$add,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Word.shift_right.one.go': Word$shift_right$one$go,
        'Word.shift_right.one': Word$shift_right$one,
        'Word.shift_right': Word$shift_right,
        'Word.shr': Word$shr,
        'U32.shr': U32$shr,
        'Pos32.new': Pos32$new,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.push': VoxBox$push,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'App.Drawing.draw.boards': App$Drawing$draw$boards,
        'DOM.vbox': DOM$vbox,
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
        'App.Drawing.App.draw': App$Drawing$App$draw,
        'Pair.snd': Pair$snd,
        'App.State.global': App$State$global,
        'IO': IO,
        'Maybe': Maybe,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'App.pass': App$pass,
        'Debug.log': Debug$log,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'U32.sub': U32$sub,
        'VoxBox.Draw.square': VoxBox$Draw$square,
        'App.Drawing.draw.pencil': App$Drawing$draw$pencil,
        'App.set_local': App$set_local,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'List': List,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'String.cons': String$cons,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.and': Bool$and,
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'List.length': List$length,
        'App.Drawing.Action.local.save': App$Drawing$Action$local$save,
        'U16.eql': U16$eql,
        'List.tail': List$tail,
        'String.concat': String$concat,
        'Maybe.default': Maybe$default,
        'List.head': List$head,
        'App.Drawing.Action.local.ctrl_z': App$Drawing$Action$local$ctrl_z,
        'App.Drawing.when.boards': App$Drawing$when$boards,
        'App.Drawing.App.when': App$Drawing$App$when,
        'App.Drawing.App.tick': App$Drawing$App$tick,
        'App.Drawing.App.post': App$Drawing$App$post,
        'App.new': App$new,
        'App.Drawing': App$Drawing,
    };
})();


/***/ })

}]);
//# sourceMappingURL=22.index.js.map