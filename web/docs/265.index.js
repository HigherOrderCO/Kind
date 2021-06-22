(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[265],{

/***/ 265:
/***/ ((module) => {

module.exports = (function() {
    function int_pos(i) {
        return i >= 0n ? i : 0n;
    };

    function int_neg(i) {
        return i < 0n ? -i : 0n;
    };

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
    const inst_int = x => x(x0 => x1 => x0 - x1);
    const elim_int = (x => {
        var $12 = (() => c0 => {
            var self = x;
            switch ("new") {
                case 'new':
                    var $9 = int_pos(self);
                    var $10 = int_neg(self);
                    var $11 = c0($9)($10);
                    return $11;
            };
        })();
        return $12;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $15 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $13 = u16_to_word(self);
                    var $14 = c0($13);
                    return $14;
            };
        })();
        return $15;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $18 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $16 = u32_to_word(self);
                    var $17 = c0($16);
                    return $17;
            };
        })();
        return $18;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $21 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $19 = u64_to_word(self);
                    var $20 = c0($19);
                    return $20;
            };
        })();
        return $21;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $26 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $22 = c0;
                return $22;
            } else {
                var $23 = self.charCodeAt(0);
                var $24 = self.slice(1);
                var $25 = c1($23)($24);
                return $25;
            };
        })();
        return $26;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $30 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $27 = buffer32_to_depth(self);
                    var $28 = buffer32_to_u32array(self);
                    var $29 = c0($27)($28);
                    return $29;
            };
        })();
        return $30;
    });

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $31 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $31;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);

    function Pair$new$(_fst$3, _snd$4) {
        var $32 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $32;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Syntax$State = App$State$new;

    function App$Store$new$(_local$2, _global$3) {
        var $33 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $33;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const Unit$new = null;
    const App$Syntax$init = App$Store$new$(Unit$new, Unit$new);

    function List$cons$(_head$2, _tail$3) {
        var $34 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $34;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $35 = null;
        return $35;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);
    const Nat$zero = 0n;

    function Nat$succ$(_pred$1) {
        var $36 = 1n + _pred$1;
        return $36;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const List$nil = ({
        _: 'List.nil'
    });

    function BBL$(_K$1, _V$2) {
        var $37 = null;
        return $37;
    };
    const BBL = x0 => x1 => BBL$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $39 = self.fst;
                var $40 = $39;
                var $38 = $40;
                break;
        };
        return $38;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $42 = self.snd;
                var $43 = $42;
                var $41 = $43;
                break;
        };
        return $41;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function BBL$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $44 = ({
            _: 'BBL.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $44;
    };
    const BBL$bin = x0 => x1 => x2 => x3 => x4 => BBL$bin$(x0, x1, x2, x3, x4);

    function U32$new$(_value$1) {
        var $45 = word_to_u32(_value$1);
        return $45;
    };
    const U32$new = x0 => U32$new$(x0);

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
                    var $46 = _x$4;
                    return $46;
                } else {
                    var $47 = (self - 1n);
                    var $48 = Nat$apply$($47, _f$3, _f$3(_x$4));
                    return $48;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $49 = null;
        return $49;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $50 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $50;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $51 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $51;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $53 = self.pred;
                var $54 = Word$i$($53);
                var $52 = $54;
                break;
            case 'Word.i':
                var $55 = self.pred;
                var $56 = Word$o$(Word$inc$($55));
                var $52 = $56;
                break;
            case 'Word.e':
                var $57 = Word$e;
                var $52 = $57;
                break;
        };
        return $52;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $59 = Word$e;
            var $58 = $59;
        } else {
            var $60 = (self - 1n);
            var $61 = Word$o$(Word$zero$($60));
            var $58 = $61;
        };
        return $58;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $62 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $62;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);
    const BBL$tip = ({
        _: 'BBL.tip'
    });

    function BBL$singleton$(_key$3, _val$4) {
        var $63 = BBL$bin$(1, _key$3, _val$4, BBL$tip, BBL$tip);
        return $63;
    };
    const BBL$singleton = x0 => x1 => BBL$singleton$(x0, x1);

    function BBL$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBL.bin':
                var $65 = self.size;
                var $66 = $65;
                var $64 = $66;
                break;
            case 'BBL.tip':
                var $67 = 0;
                var $64 = $67;
                break;
        };
        return $64;
    };
    const BBL$size = x0 => BBL$size$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $69 = self.pred;
                var $70 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $72 = self.pred;
                            var $73 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $75 = Word$i$(Word$adder$(_a$pred$10, $72, Bool$false));
                                    var $74 = $75;
                                } else {
                                    var $76 = Word$o$(Word$adder$(_a$pred$10, $72, Bool$false));
                                    var $74 = $76;
                                };
                                return $74;
                            });
                            var $71 = $73;
                            break;
                        case 'Word.i':
                            var $77 = self.pred;
                            var $78 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $80 = Word$o$(Word$adder$(_a$pred$10, $77, Bool$true));
                                    var $79 = $80;
                                } else {
                                    var $81 = Word$i$(Word$adder$(_a$pred$10, $77, Bool$false));
                                    var $79 = $81;
                                };
                                return $79;
                            });
                            var $71 = $78;
                            break;
                        case 'Word.e':
                            var $82 = (_a$pred$8 => {
                                var $83 = Word$e;
                                return $83;
                            });
                            var $71 = $82;
                            break;
                    };
                    var $71 = $71($69);
                    return $71;
                });
                var $68 = $70;
                break;
            case 'Word.i':
                var $84 = self.pred;
                var $85 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
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
                            var $86 = $88;
                            break;
                        case 'Word.i':
                            var $92 = self.pred;
                            var $93 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $95 = Word$i$(Word$adder$(_a$pred$10, $92, Bool$true));
                                    var $94 = $95;
                                } else {
                                    var $96 = Word$o$(Word$adder$(_a$pred$10, $92, Bool$true));
                                    var $94 = $96;
                                };
                                return $94;
                            });
                            var $86 = $93;
                            break;
                        case 'Word.e':
                            var $97 = (_a$pred$8 => {
                                var $98 = Word$e;
                                return $98;
                            });
                            var $86 = $97;
                            break;
                    };
                    var $86 = $86($84);
                    return $86;
                });
                var $68 = $85;
                break;
            case 'Word.e':
                var $99 = (_b$5 => {
                    var $100 = Word$e;
                    return $100;
                });
                var $68 = $99;
                break;
        };
        var $68 = $68(_b$3);
        return $68;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $101 = Word$adder$(_a$2, _b$3, Bool$false);
        return $101;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $103 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $105 = Word$i$(Word$shift_left$one$go$($103, Bool$false));
                    var $104 = $105;
                } else {
                    var $106 = Word$o$(Word$shift_left$one$go$($103, Bool$false));
                    var $104 = $106;
                };
                var $102 = $104;
                break;
            case 'Word.i':
                var $107 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $109 = Word$i$(Word$shift_left$one$go$($107, Bool$true));
                    var $108 = $109;
                } else {
                    var $110 = Word$o$(Word$shift_left$one$go$($107, Bool$true));
                    var $108 = $110;
                };
                var $102 = $108;
                break;
            case 'Word.e':
                var $111 = Word$e;
                var $102 = $111;
                break;
        };
        return $102;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $113 = self.pred;
                var $114 = Word$o$(Word$shift_left$one$go$($113, Bool$false));
                var $112 = $114;
                break;
            case 'Word.i':
                var $115 = self.pred;
                var $116 = Word$o$(Word$shift_left$one$go$($115, Bool$true));
                var $112 = $116;
                break;
            case 'Word.e':
                var $117 = Word$e;
                var $112 = $117;
                break;
        };
        return $112;
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
                    var $118 = _value$3;
                    return $118;
                } else {
                    var $119 = (self - 1n);
                    var $120 = Word$shift_left$($119, Word$shift_left$one$(_value$3));
                    return $120;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

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
                        var $121 = self.pred;
                        var $122 = Word$mul$go$($121, Word$shift_left$(1n, _b$4), _acc$5);
                        return $122;
                    case 'Word.i':
                        var $123 = self.pred;
                        var $124 = Word$mul$go$($123, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $124;
                    case 'Word.e':
                        var $125 = _acc$5;
                        return $125;
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
                var $127 = self.pred;
                var $128 = Word$o$(Word$to_zero$($127));
                var $126 = $128;
                break;
            case 'Word.i':
                var $129 = self.pred;
                var $130 = Word$o$(Word$to_zero$($129));
                var $126 = $130;
                break;
            case 'Word.e':
                var $131 = Word$e;
                var $126 = $131;
                break;
        };
        return $126;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $132 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $132;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);
    const BBL$w = 3;

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $134 = Bool$true;
                var $133 = $134;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $135 = Bool$false;
                var $133 = $135;
                break;
        };
        return $133;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);
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
                var $137 = self.pred;
                var $138 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $140 = self.pred;
                            var $141 = (_a$pred$10 => {
                                var $142 = Word$cmp$go$(_a$pred$10, $140, _c$4);
                                return $142;
                            });
                            var $139 = $141;
                            break;
                        case 'Word.i':
                            var $143 = self.pred;
                            var $144 = (_a$pred$10 => {
                                var $145 = Word$cmp$go$(_a$pred$10, $143, Cmp$ltn);
                                return $145;
                            });
                            var $139 = $144;
                            break;
                        case 'Word.e':
                            var $146 = (_a$pred$8 => {
                                var $147 = _c$4;
                                return $147;
                            });
                            var $139 = $146;
                            break;
                    };
                    var $139 = $139($137);
                    return $139;
                });
                var $136 = $138;
                break;
            case 'Word.i':
                var $148 = self.pred;
                var $149 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $151 = self.pred;
                            var $152 = (_a$pred$10 => {
                                var $153 = Word$cmp$go$(_a$pred$10, $151, Cmp$gtn);
                                return $153;
                            });
                            var $150 = $152;
                            break;
                        case 'Word.i':
                            var $154 = self.pred;
                            var $155 = (_a$pred$10 => {
                                var $156 = Word$cmp$go$(_a$pred$10, $154, _c$4);
                                return $156;
                            });
                            var $150 = $155;
                            break;
                        case 'Word.e':
                            var $157 = (_a$pred$8 => {
                                var $158 = _c$4;
                                return $158;
                            });
                            var $150 = $157;
                            break;
                    };
                    var $150 = $150($148);
                    return $150;
                });
                var $136 = $149;
                break;
            case 'Word.e':
                var $159 = (_b$5 => {
                    var $160 = _c$4;
                    return $160;
                });
                var $136 = $159;
                break;
        };
        var $136 = $136(_b$3);
        return $136;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $161 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $161;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$ltn$(_a$2, _b$3) {
        var $162 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $162;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);

    function BBL$node$(_key$3, _val$4, _left$5, _right$6) {
        var _size_left$7 = BBL$size$(_left$5);
        var _size_right$8 = BBL$size$(_right$6);
        var _new_size$9 = ((1 + ((_size_left$7 + _size_right$8) >>> 0)) >>> 0);
        var $163 = BBL$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $163;
    };
    const BBL$node = x0 => x1 => x2 => x3 => BBL$node$(x0, x1, x2, x3);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $165 = Bool$false;
                var $164 = $165;
                break;
            case 'Cmp.gtn':
                var $166 = Bool$true;
                var $164 = $166;
                break;
        };
        return $164;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $167 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $167;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);
    const U32$gtn = a0 => a1 => (a0 > a1);

    function BBL$balance$(_k$3, _v$4, _l$5, _r$6) {
        var _size_l$7 = BBL$size$(_l$5);
        var _size_r$8 = BBL$size$(_r$6);
        var _size_l_plus_size_r$9 = ((_size_l$7 + _size_r$8) >>> 0);
        var _w_x_size_l$10 = ((BBL$w * _size_l$7) >>> 0);
        var _w_x_size_r$11 = ((BBL$w * _size_r$8) >>> 0);
        var self = (_size_l_plus_size_r$9 < 2);
        if (self) {
            var $169 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
            var $168 = $169;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBL.bin':
                        var $172 = self.key;
                        var $173 = self.val;
                        var $174 = self.left;
                        var $175 = self.right;
                        var _size_rl$17 = BBL$size$($174);
                        var _size_rr$18 = BBL$size$($175);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $172;
                            var _new_val$20 = $173;
                            var _new_left$21 = BBL$node$(_k$3, _v$4, _l$5, $174);
                            var _new_right$22 = $175;
                            var $177 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $176 = $177;
                        } else {
                            var self = $174;
                            switch (self._) {
                                case 'BBL.bin':
                                    var $179 = self.key;
                                    var $180 = self.val;
                                    var $181 = self.left;
                                    var $182 = self.right;
                                    var _new_key$24 = $179;
                                    var _new_val$25 = $180;
                                    var _new_left$26 = BBL$node$(_k$3, _v$4, _l$5, $181);
                                    var _new_right$27 = BBL$node$($172, $173, $182, $175);
                                    var $183 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $178 = $183;
                                    break;
                                case 'BBL.tip':
                                    var $184 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $178 = $184;
                                    break;
                            };
                            var $176 = $178;
                        };
                        var $171 = $176;
                        break;
                    case 'BBL.tip':
                        var $185 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                        var $171 = $185;
                        break;
                };
                var $170 = $171;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBL.bin':
                            var $188 = self.key;
                            var $189 = self.val;
                            var $190 = self.left;
                            var $191 = self.right;
                            var _size_ll$17 = BBL$size$($190);
                            var _size_lr$18 = BBL$size$($191);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $188;
                                var _new_val$20 = $189;
                                var _new_left$21 = $190;
                                var _new_right$22 = BBL$node$(_k$3, _v$4, $191, _r$6);
                                var $193 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $192 = $193;
                            } else {
                                var self = $191;
                                switch (self._) {
                                    case 'BBL.bin':
                                        var $195 = self.key;
                                        var $196 = self.val;
                                        var $197 = self.left;
                                        var $198 = self.right;
                                        var _new_key$24 = $195;
                                        var _new_val$25 = $196;
                                        var _new_left$26 = BBL$node$($188, $189, $190, $197);
                                        var _new_right$27 = BBL$node$(_k$3, _v$4, $198, _r$6);
                                        var $199 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $194 = $199;
                                        break;
                                    case 'BBL.tip':
                                        var $200 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $194 = $200;
                                        break;
                                };
                                var $192 = $194;
                            };
                            var $187 = $192;
                            break;
                        case 'BBL.tip':
                            var $201 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                            var $187 = $201;
                            break;
                    };
                    var $186 = $187;
                } else {
                    var $202 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                    var $186 = $202;
                };
                var $170 = $186;
            };
            var $168 = $170;
        };
        return $168;
    };
    const BBL$balance = x0 => x1 => x2 => x3 => BBL$balance$(x0, x1, x2, x3);

    function BBL$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBL.bin':
                var $204 = self.key;
                var $205 = self.val;
                var $206 = self.left;
                var $207 = self.right;
                var self = _cmp$3(_key$4)($204);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $204;
                        var _new_val$13 = $205;
                        var _new_left$14 = BBL$insert$(_cmp$3, _key$4, _val$5, $206);
                        var _new_right$15 = $207;
                        var $209 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $208 = $209;
                        break;
                    case 'Cmp.eql':
                        var $210 = BBL$node$(_key$4, _val$5, $206, $207);
                        var $208 = $210;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $204;
                        var _new_val$13 = $205;
                        var _new_left$14 = $206;
                        var _new_right$15 = BBL$insert$(_cmp$3, _key$4, _val$5, $207);
                        var $211 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $208 = $211;
                        break;
                };
                var $203 = $208;
                break;
            case 'BBL.tip':
                var $212 = BBL$singleton$(_key$4, _val$5);
                var $203 = $212;
                break;
        };
        return $203;
    };
    const BBL$insert = x0 => x1 => x2 => x3 => BBL$insert$(x0, x1, x2, x3);

    function BBL$from_list$go$(_cmp$3, _acc$4, _xs$5) {
        var BBL$from_list$go$ = (_cmp$3, _acc$4, _xs$5) => ({
            ctr: 'TCO',
            arg: [_cmp$3, _acc$4, _xs$5]
        });
        var BBL$from_list$go = _cmp$3 => _acc$4 => _xs$5 => BBL$from_list$go$(_cmp$3, _acc$4, _xs$5);
        var arg = [_cmp$3, _acc$4, _xs$5];
        while (true) {
            let [_cmp$3, _acc$4, _xs$5] = arg;
            var R = (() => {
                var self = _xs$5;
                switch (self._) {
                    case 'List.cons':
                        var $213 = self.head;
                        var $214 = self.tail;
                        var _key$8 = Pair$fst$($213);
                        var _val$9 = Pair$snd$($213);
                        var _new_acc$10 = BBL$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $215 = BBL$from_list$go$(_cmp$3, _new_acc$10, $214);
                        return $215;
                    case 'List.nil':
                        var $216 = _acc$4;
                        return $216;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBL$from_list$go = x0 => x1 => x2 => BBL$from_list$go$(x0, x1, x2);

    function BBL$from_list$(_cmp$3, _xs$4) {
        var $217 = BBL$from_list$go$(_cmp$3, BBL$tip, _xs$4);
        return $217;
    };
    const BBL$from_list = x0 => x1 => BBL$from_list$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $219 = Bool$false;
                var $218 = $219;
                break;
            case 'Cmp.eql':
                var $220 = Bool$true;
                var $218 = $220;
                break;
        };
        return $218;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $221 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $221;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $223 = Cmp$ltn;
            var $222 = $223;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $225 = Cmp$eql;
                var $224 = $225;
            } else {
                var $226 = Cmp$gtn;
                var $224 = $226;
            };
            var $222 = $224;
        };
        return $222;
    };
    const U16$cmp = x0 => x1 => U16$cmp$(x0, x1);

    function String$cmp$(_a$1, _b$2) {
        var String$cmp$ = (_a$1, _b$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _b$2]
        });
        var String$cmp = _a$1 => _b$2 => String$cmp$(_a$1, _b$2);
        var arg = [_a$1, _b$2];
        while (true) {
            let [_a$1, _b$2] = arg;
            var R = (() => {
                var self = _a$1;
                if (self.length === 0) {
                    var self = _b$2;
                    if (self.length === 0) {
                        var $228 = Cmp$eql;
                        var $227 = $228;
                    } else {
                        var $229 = self.charCodeAt(0);
                        var $230 = self.slice(1);
                        var $231 = Cmp$ltn;
                        var $227 = $231;
                    };
                    return $227;
                } else {
                    var $232 = self.charCodeAt(0);
                    var $233 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $235 = Cmp$gtn;
                        var $234 = $235;
                    } else {
                        var $236 = self.charCodeAt(0);
                        var $237 = self.slice(1);
                        var self = U16$cmp$($232, $236);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $239 = Cmp$ltn;
                                var $238 = $239;
                                break;
                            case 'Cmp.eql':
                                var $240 = String$cmp$($233, $237);
                                var $238 = $240;
                                break;
                            case 'Cmp.gtn':
                                var $241 = Cmp$gtn;
                                var $238 = $241;
                                break;
                        };
                        var $234 = $238;
                    };
                    return $234;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$cmp = x0 => x1 => String$cmp$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $242 = BBL$from_list$(String$cmp, _xs$2);
        return $242;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $243 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $243;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $244 = null;
        return $244;
    };
    const List = x0 => List$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $246 = self.head;
                var $247 = self.tail;
                var $248 = List$cons$($246, List$concat$($247, _bs$3));
                var $245 = $248;
                break;
            case 'List.nil':
                var $249 = _bs$3;
                var $245 = $249;
                break;
        };
        return $245;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);
    const Map$new = BBL$tip;

    function DOM$text$(_value$1) {
        var $250 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $250;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $251 = (String.fromCharCode(_head$1) + _tail$2);
        return $251;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Int$is_neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $253 = int_pos(self);
                var $254 = int_neg(self);
                var $255 = ($254 > $253);
                var $252 = $255;
                break;
        };
        return $252;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $257 = int_pos(self);
                var $258 = int_neg(self);
                var $259 = ($258 - $257);
                var $256 = $259;
                break;
        };
        return $256;
    };
    const Int$neg = x0 => Int$neg$(x0);

    function Int$abs$(_a$1) {
        var _neg$2 = Int$is_neg$(_a$1);
        var self = _neg$2;
        if (self) {
            var _a$3 = Int$neg$(_a$1);
            var self = _a$3;
            switch ("new") {
                case 'new':
                    var $262 = int_pos(self);
                    var $263 = $262;
                    var $261 = $263;
                    break;
            };
            var $260 = $261;
        } else {
            var self = _a$1;
            switch ("new") {
                case 'new':
                    var $265 = int_pos(self);
                    var $266 = $265;
                    var $264 = $266;
                    break;
            };
            var $260 = $264;
        };
        return $260;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Int$to_nat_signed$(_a$1) {
        var $267 = Pair$new$(Int$is_neg$(_a$1), Int$abs$(_a$1));
        return $267;
    };
    const Int$to_nat_signed = x0 => Int$to_nat_signed$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $269 = self.head;
                var $270 = self.tail;
                var $271 = _cons$5($269)(List$fold$($270, _nil$4, _cons$5));
                var $268 = $271;
                break;
            case 'List.nil':
                var $272 = _nil$4;
                var $268 = $272;
                break;
        };
        return $268;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $273 = null;
        return $273;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $274 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $274;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $275 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $275;
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
                    var $276 = Either$left$(_n$1);
                    return $276;
                } else {
                    var $277 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $279 = Either$right$(Nat$succ$($277));
                        var $278 = $279;
                    } else {
                        var $280 = (self - 1n);
                        var $281 = Nat$sub_rem$($280, $277);
                        var $278 = $281;
                    };
                    return $278;
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
                        var $282 = self.value;
                        var $283 = Nat$div_mod$go$($282, _m$2, Nat$succ$(_d$3));
                        return $283;
                    case 'Either.right':
                        var $284 = Pair$new$(_d$3, _n$1);
                        return $284;
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
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function Maybe$(_A$1) {
        var $298 = null;
        return $298;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Maybe$some$(_value$2) {
        var $299 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $299;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

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
                        var $300 = self.head;
                        var $301 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $303 = Maybe$some$($300);
                            var $302 = $303;
                        } else {
                            var $304 = (self - 1n);
                            var $305 = List$at$($304, $301);
                            var $302 = $305;
                        };
                        return $302;
                    case 'List.nil':
                        var $306 = Maybe$none;
                        return $306;
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
                    var $309 = self.value;
                    var $310 = $309;
                    var $308 = $310;
                    break;
                case 'Maybe.none':
                    var $311 = 35;
                    var $308 = $311;
                    break;
            };
            var $307 = $308;
        } else {
            var $312 = 35;
            var $307 = $312;
        };
        return $307;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $313 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $314 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $314;
        }));
        return $313;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $315 = Nat$to_string_base$(10n, _n$1);
        return $315;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Int$show$(_a$1) {
        var _result$2 = Int$to_nat_signed$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $317 = self.fst;
                var $318 = self.snd;
                var self = $317;
                if (self) {
                    var $320 = ("-" + Nat$show$($318));
                    var $319 = $320;
                } else {
                    var $321 = ("+" + Nat$show$($318));
                    var $319 = $321;
                };
                var $316 = $319;
                break;
        };
        return $316;
    };
    const Int$show = x0 => Int$show$(x0);

    function App$Syntax$card$(_name$1, _hp$2) {
        var $322 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("border", "2px solid black"), List$cons$(Pair$new$("padding", "5px"), List$nil))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$(("Her\u{f3}i: " + _name$1)), List$nil)), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$(("HP: " + Int$show$(_hp$2))), List$nil)), List$nil)));
        return $322;
    };
    const App$Syntax$card = x0 => x1 => App$Syntax$card$(x0, x1);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $323 = BBL$insert$(String$cmp, _key$2, _val$3, _map$4);
        return $323;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);
    const String$eql = a0 => a1 => (a0 === a1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function String$map$(_f$1, _as$2) {
        var self = _as$2;
        if (self.length === 0) {
            var $325 = String$nil;
            var $324 = $325;
        } else {
            var $326 = self.charCodeAt(0);
            var $327 = self.slice(1);
            var $328 = String$cons$(_f$1($326), String$map$(_f$1, $327));
            var $324 = $328;
        };
        return $324;
    };
    const String$map = x0 => x1 => String$map$(x0, x1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $330 = Bool$false;
                var $329 = $330;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $331 = Bool$true;
                var $329 = $331;
                break;
        };
        return $329;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $332 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $332;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $334 = Bool$true;
                var $333 = $334;
                break;
            case 'Cmp.gtn':
                var $335 = Bool$false;
                var $333 = $335;
                break;
        };
        return $333;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $336 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $336;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U16$lte = a0 => a1 => (a0 <= a1);

    function U16$new$(_value$1) {
        var $337 = word_to_u16(_value$1);
        return $337;
    };
    const U16$new = x0 => U16$new$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $339 = self.pred;
                var $340 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $342 = self.pred;
                            var $343 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $345 = Word$i$(Word$subber$(_a$pred$10, $342, Bool$true));
                                    var $344 = $345;
                                } else {
                                    var $346 = Word$o$(Word$subber$(_a$pred$10, $342, Bool$false));
                                    var $344 = $346;
                                };
                                return $344;
                            });
                            var $341 = $343;
                            break;
                        case 'Word.i':
                            var $347 = self.pred;
                            var $348 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $350 = Word$o$(Word$subber$(_a$pred$10, $347, Bool$true));
                                    var $349 = $350;
                                } else {
                                    var $351 = Word$i$(Word$subber$(_a$pred$10, $347, Bool$true));
                                    var $349 = $351;
                                };
                                return $349;
                            });
                            var $341 = $348;
                            break;
                        case 'Word.e':
                            var $352 = (_a$pred$8 => {
                                var $353 = Word$e;
                                return $353;
                            });
                            var $341 = $352;
                            break;
                    };
                    var $341 = $341($339);
                    return $341;
                });
                var $338 = $340;
                break;
            case 'Word.i':
                var $354 = self.pred;
                var $355 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $357 = self.pred;
                            var $358 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $360 = Word$o$(Word$subber$(_a$pred$10, $357, Bool$false));
                                    var $359 = $360;
                                } else {
                                    var $361 = Word$i$(Word$subber$(_a$pred$10, $357, Bool$false));
                                    var $359 = $361;
                                };
                                return $359;
                            });
                            var $356 = $358;
                            break;
                        case 'Word.i':
                            var $362 = self.pred;
                            var $363 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $365 = Word$i$(Word$subber$(_a$pred$10, $362, Bool$true));
                                    var $364 = $365;
                                } else {
                                    var $366 = Word$o$(Word$subber$(_a$pred$10, $362, Bool$false));
                                    var $364 = $366;
                                };
                                return $364;
                            });
                            var $356 = $363;
                            break;
                        case 'Word.e':
                            var $367 = (_a$pred$8 => {
                                var $368 = Word$e;
                                return $368;
                            });
                            var $356 = $367;
                            break;
                    };
                    var $356 = $356($354);
                    return $356;
                });
                var $338 = $355;
                break;
            case 'Word.e':
                var $369 = (_b$5 => {
                    var $370 = Word$e;
                    return $370;
                });
                var $338 = $369;
                break;
        };
        var $338 = $338(_b$3);
        return $338;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $371 = Word$subber$(_a$2, _b$3, Bool$false);
        return $371;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U16$sub = a0 => a1 => ((a0 - a1) & 0xFFFF);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);

    function Char$to_upper$(_char$1) {
        var self = ((_char$1 >= 97) && (_char$1 <= 122));
        if (self) {
            var $373 = ((_char$1 - 32) & 0xFFFF);
            var $372 = $373;
        } else {
            var $374 = _char$1;
            var $372 = $374;
        };
        return $372;
    };
    const Char$to_upper = x0 => Char$to_upper$(x0);

    function String$to_upper$(_str$1) {
        var $375 = String$map$(Char$to_upper, _str$1);
        return $375;
    };
    const String$to_upper = x0 => String$to_upper$(x0);

    function App$Syntax$draw$(_state$1) {
        var _team$2 = "azul";
        var _heroes$3 = List$cons$(Pair$new$("croni", (25n)), List$cons$(Pair$new$("cyclope", (30n)), List$cons$(Pair$new$("lela", (15n)), List$cons$(Pair$new$("octoking", (40n)), List$nil))));
        var _paragraph$4 = Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$nil));
        var $376 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "asd"), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("background-color", "#e4bbd9"), List$nil)))))))), List$cons$((() => {
            var _a$5 = List$nil;
            var _a$6 = (() => {
                var $379 = _a$5;
                var $380 = _heroes$3;
                let _a$7 = $379;
                let _i$6;
                while ($380._ === 'List.cons') {
                    _i$6 = $380.head;
                    var $379 = List$concat$(_a$7, List$cons$(App$Syntax$card$((() => {
                        var self = _i$6;
                        switch (self._) {
                            case 'Pair.new':
                                var $381 = self.fst;
                                var $382 = $381;
                                return $382;
                        };
                    })(), (() => {
                        var self = _i$6;
                        switch (self._) {
                            case 'Pair.new':
                                var $383 = self.snd;
                                var $384 = $383;
                                return $384;
                        };
                    })()), List$nil));
                    _a$7 = $379;
                    $380 = $380.tail;
                }
                return _a$7;
            })();
            var $377 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), _a$6);
            return $377;
        })(), List$cons$(DOM$node$("div", Map$new, Map$set$("display", "contents", Map$new), List$fold$(_heroes$3, List$nil, (_i$5 => _placeholder$6 => {
            var $385 = List$cons$(App$Syntax$card$((() => {
                var self = _i$5;
                switch (self._) {
                    case 'Pair.new':
                        var $386 = self.fst;
                        var $387 = $386;
                        return $387;
                };
            })(), (() => {
                var self = _i$5;
                switch (self._) {
                    case 'Pair.new':
                        var $388 = self.snd;
                        var $389 = $388;
                        return $389;
                };
            })()), _placeholder$6);
            return $385;
        }))), List$cons$(DOM$node$("div", Map$new, Map$set$("display", "contents", Map$new), List$fold$(_heroes$3, List$nil, (_i$5 => _placeholder$6 => {
            var $390 = List$cons$(App$Syntax$card$((() => {
                var self = _i$5;
                switch (self._) {
                    case 'Pair.new':
                        var $391 = self.fst;
                        var $392 = $391;
                        return $392;
                };
            })(), (() => {
                var self = _i$5;
                switch (self._) {
                    case 'Pair.new':
                        var $393 = self.snd;
                        var $394 = $393;
                        return $394;
                };
            })()), _placeholder$6);
            return $390;
        }))), List$cons$((() => {
            var self = (_team$2 === "azul");
            if (self) {
                var $395 = DOM$node$("p", Map$from_list$(List$nil), _paragraph$4, List$cons$(DOM$text$("\u{c9} do time azul"), List$nil));
                return $395;
            } else {
                var $396 = DOM$node$("p", Map$from_list$(List$nil), _paragraph$4, List$cons$(DOM$text$("N\u{e3}o \u{e9} do time azul"), List$nil));
                return $396;
            };
        })(), List$cons$((() => {
            var self = (1n === 1n);
            if (self) {
                var $397 = DOM$node$("p", Map$from_list$(List$nil), _paragraph$4, List$cons$(DOM$text$(String$to_upper$("Aparece if")), List$nil));
                return $397;
            } else {
                var $398 = DOM$node$("p", Map$from_list$(List$nil), _paragraph$4, List$cons$(DOM$text$(String$to_upper$("N\u{e3}o aparece if")), List$nil));
                return $398;
            };
        })(), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", "https://avatars.githubusercontent.com/u/79022763?s=200&v=4"), List$nil)), Map$new, List$nil), List$nil)))))));
        return $376;
    };
    const App$Syntax$draw = x0 => App$Syntax$draw$(x0);

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
    const App$State$local = Pair$fst;
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $411 = _m$pure$3;
        return $411;
    }))(Maybe$none);

    function App$no_when$(_event$2, _state$3) {
        var $412 = App$pass;
        return $412;
    };
    const App$no_when = x0 => x1 => App$no_when$(x0, x1);
    const App$Syntax$when = App$no_when;

    function App$no_tick$(_tick$2, _glob$3) {
        var $413 = _glob$3;
        return $413;
    };
    const App$no_tick = x0 => x1 => App$no_tick$(x0, x1);
    const App$Syntax$tick = App$no_tick;

    function App$no_post$(_time$2, _room$3, _addr$4, _data$5, _glob$6) {
        var $414 = _glob$6;
        return $414;
    };
    const App$no_post = x0 => x1 => x2 => x3 => x4 => App$no_post$(x0, x1, x2, x3, x4);
    const App$Syntax$post = App$no_post;
    const App$Syntax = App$new$(App$Syntax$init, App$Syntax$draw, App$Syntax$when, App$Syntax$tick, App$Syntax$post);
    return {
        'App.new': App$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.Syntax.State': App$Syntax$State,
        'App.Store.new': App$Store$new,
        'Unit.new': Unit$new,
        'App.Syntax.init': App$Syntax$init,
        'List.cons': List$cons,
        'Pair': Pair,
        'Nat.zero': Nat$zero,
        'Nat.succ': Nat$succ,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'List.nil': List$nil,
        'BBL': BBL,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'BBL.bin': BBL$bin,
        'U32.new': U32$new,
        'Nat.apply': Nat$apply,
        'Word': Word,
        'Word.e': Word$e,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.inc': Word$inc,
        'Word.zero': Word$zero,
        'Nat.to_word': Nat$to_word,
        'Nat.to_u32': Nat$to_u32,
        'BBL.tip': BBL$tip,
        'BBL.singleton': BBL$singleton,
        'BBL.size': BBL$size,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U32.add': U32$add,
        'Word.shift_left.one.go': Word$shift_left$one$go,
        'Word.shift_left.one': Word$shift_left$one,
        'Word.shift_left': Word$shift_left,
        'Word.mul.go': Word$mul$go,
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'BBL.w': BBL$w,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.ltn': Word$ltn,
        'U32.ltn': U32$ltn,
        'U32.from_nat': U32$from_nat,
        'BBL.node': BBL$node,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Word.gtn': Word$gtn,
        'U32.gtn': U32$gtn,
        'BBL.balance': BBL$balance,
        'BBL.insert': BBL$insert,
        'BBL.from_list.go': BBL$from_list$go,
        'BBL.from_list': BBL$from_list,
        'U16.ltn': U16$ltn,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'U16.cmp': U16$cmp,
        'String.cmp': String$cmp,
        'Map.from_list': Map$from_list,
        'DOM.node': DOM$node,
        'List.for': List$for,
        'List': List,
        'List.concat': List$concat,
        'Map.new': Map$new,
        'DOM.text': DOM$text,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Nat.gtn': Nat$gtn,
        'Int.is_neg': Int$is_neg,
        'Int.neg': Int$neg,
        'Int.abs': Int$abs,
        'Int.to_nat_signed': Int$to_nat_signed,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.and': Bool$and,
        'Nat.lte': Nat$lte,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Maybe.some': Maybe$some,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Int.show': Int$show,
        'App.Syntax.card': App$Syntax$card,
        'Map.set': Map$set,
        'String.eql': String$eql,
        'Nat.eql': Nat$eql,
        'String.map': String$map,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'U16.gte': U16$gte,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U16.lte': U16$lte,
        'U16.new': U16$new,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U16.sub': U16$sub,
        'Nat.to_u16': Nat$to_u16,
        'Char.to_upper': Char$to_upper,
        'String.to_upper': String$to_upper,
        'App.Syntax.draw': App$Syntax$draw,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'App.State.local': App$State$local,
        'App.pass': App$pass,
        'App.no_when': App$no_when,
        'App.Syntax.when': App$Syntax$when,
        'App.no_tick': App$no_tick,
        'App.Syntax.tick': App$Syntax$tick,
        'App.no_post': App$no_post,
        'App.Syntax.post': App$Syntax$post,
        'App.Syntax': App$Syntax,
    };
})();

/***/ })

}]);
//# sourceMappingURL=265.index.js.map