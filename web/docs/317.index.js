(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[317],{

/***/ 317:
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
                var $18 = c0;
                return $18;
            } else {
                var $19 = self.charCodeAt(0);
                var $20 = self.slice(1);
                var $21 = c1($19)($20);
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

    function App$Store$new$(_local$2, _global$3) {
        var $27 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $27;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $28 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $28;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Kind$State = App$State$new;

    function App$Kind$State$local$new$(_device$1, _page$2, _mouse_over$3) {
        var $29 = ({
            _: 'App.Kind.State.local.new',
            'device': _device$1,
            'page': _page$2,
            'mouse_over': _mouse_over$3
        });
        return $29;
    };
    const App$Kind$State$local$new = x0 => x1 => x2 => App$Kind$State$local$new$(x0, x1, x2);
    const Device$big_desktop = ({
        _: 'Device.big_desktop'
    });
    const App$Kind$Page$home = ({
        _: 'App.Kind.Page.home'
    });
    const Unit$new = null;

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $30 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $30;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BBL$(_K$1, _V$2) {
        var $31 = null;
        return $31;
    };
    const BBL = x0 => x1 => BBL$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $33 = self.fst;
                var $34 = $33;
                var $32 = $34;
                break;
        };
        return $32;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $36 = self.snd;
                var $37 = $36;
                var $35 = $37;
                break;
        };
        return $35;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function BBL$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $38 = ({
            _: 'BBL.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $38;
    };
    const BBL$bin = x0 => x1 => x2 => x3 => x4 => BBL$bin$(x0, x1, x2, x3, x4);

    function U32$new$(_value$1) {
        var $39 = word_to_u32(_value$1);
        return $39;
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
                    var $40 = _x$4;
                    return $40;
                } else {
                    var $41 = (self - 1n);
                    var $42 = Nat$apply$($41, _f$3, _f$3(_x$4));
                    return $42;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $43 = null;
        return $43;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $44 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $44;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $45 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $45;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $47 = self.pred;
                var $48 = Word$i$($47);
                var $46 = $48;
                break;
            case 'Word.i':
                var $49 = self.pred;
                var $50 = Word$o$(Word$inc$($49));
                var $46 = $50;
                break;
            case 'Word.e':
                var $51 = Word$e;
                var $46 = $51;
                break;
        };
        return $46;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $53 = Word$e;
            var $52 = $53;
        } else {
            var $54 = (self - 1n);
            var $55 = Word$o$(Word$zero$($54));
            var $52 = $55;
        };
        return $52;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $56 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $56;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $57 = 1n + _pred$1;
        return $57;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);
    const BBL$tip = ({
        _: 'BBL.tip'
    });

    function BBL$singleton$(_key$3, _val$4) {
        var $58 = BBL$bin$(1, _key$3, _val$4, BBL$tip, BBL$tip);
        return $58;
    };
    const BBL$singleton = x0 => x1 => BBL$singleton$(x0, x1);

    function BBL$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBL.bin':
                var $60 = self.size;
                var $61 = $60;
                var $59 = $61;
                break;
            case 'BBL.tip':
                var $62 = 0;
                var $59 = $62;
                break;
        };
        return $59;
    };
    const BBL$size = x0 => BBL$size$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $64 = self.pred;
                var $65 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $67 = self.pred;
                            var $68 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $70 = Word$i$(Word$adder$(_a$pred$10, $67, Bool$false));
                                    var $69 = $70;
                                } else {
                                    var $71 = Word$o$(Word$adder$(_a$pred$10, $67, Bool$false));
                                    var $69 = $71;
                                };
                                return $69;
                            });
                            var $66 = $68;
                            break;
                        case 'Word.i':
                            var $72 = self.pred;
                            var $73 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $75 = Word$o$(Word$adder$(_a$pred$10, $72, Bool$true));
                                    var $74 = $75;
                                } else {
                                    var $76 = Word$i$(Word$adder$(_a$pred$10, $72, Bool$false));
                                    var $74 = $76;
                                };
                                return $74;
                            });
                            var $66 = $73;
                            break;
                        case 'Word.e':
                            var $77 = (_a$pred$8 => {
                                var $78 = Word$e;
                                return $78;
                            });
                            var $66 = $77;
                            break;
                    };
                    var $66 = $66($64);
                    return $66;
                });
                var $63 = $65;
                break;
            case 'Word.i':
                var $79 = self.pred;
                var $80 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $82 = self.pred;
                            var $83 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $85 = Word$o$(Word$adder$(_a$pred$10, $82, Bool$true));
                                    var $84 = $85;
                                } else {
                                    var $86 = Word$i$(Word$adder$(_a$pred$10, $82, Bool$false));
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
                                    var $90 = Word$i$(Word$adder$(_a$pred$10, $87, Bool$true));
                                    var $89 = $90;
                                } else {
                                    var $91 = Word$o$(Word$adder$(_a$pred$10, $87, Bool$true));
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
                var $63 = $80;
                break;
            case 'Word.e':
                var $94 = (_b$5 => {
                    var $95 = Word$e;
                    return $95;
                });
                var $63 = $94;
                break;
        };
        var $63 = $63(_b$3);
        return $63;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $96 = Word$adder$(_a$2, _b$3, Bool$false);
        return $96;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $98 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $100 = Word$i$(Word$shift_left$one$go$($98, Bool$false));
                    var $99 = $100;
                } else {
                    var $101 = Word$o$(Word$shift_left$one$go$($98, Bool$false));
                    var $99 = $101;
                };
                var $97 = $99;
                break;
            case 'Word.i':
                var $102 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $104 = Word$i$(Word$shift_left$one$go$($102, Bool$true));
                    var $103 = $104;
                } else {
                    var $105 = Word$o$(Word$shift_left$one$go$($102, Bool$true));
                    var $103 = $105;
                };
                var $97 = $103;
                break;
            case 'Word.e':
                var $106 = Word$e;
                var $97 = $106;
                break;
        };
        return $97;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $108 = self.pred;
                var $109 = Word$o$(Word$shift_left$one$go$($108, Bool$false));
                var $107 = $109;
                break;
            case 'Word.i':
                var $110 = self.pred;
                var $111 = Word$o$(Word$shift_left$one$go$($110, Bool$true));
                var $107 = $111;
                break;
            case 'Word.e':
                var $112 = Word$e;
                var $107 = $112;
                break;
        };
        return $107;
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
                    var $113 = _value$3;
                    return $113;
                } else {
                    var $114 = (self - 1n);
                    var $115 = Word$shift_left$($114, Word$shift_left$one$(_value$3));
                    return $115;
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
                        var $116 = self.pred;
                        var $117 = Word$mul$go$($116, Word$shift_left$(1n, _b$4), _acc$5);
                        return $117;
                    case 'Word.i':
                        var $118 = self.pred;
                        var $119 = Word$mul$go$($118, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $119;
                    case 'Word.e':
                        var $120 = _acc$5;
                        return $120;
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
                var $122 = self.pred;
                var $123 = Word$o$(Word$to_zero$($122));
                var $121 = $123;
                break;
            case 'Word.i':
                var $124 = self.pred;
                var $125 = Word$o$(Word$to_zero$($124));
                var $121 = $125;
                break;
            case 'Word.e':
                var $126 = Word$e;
                var $121 = $126;
                break;
        };
        return $121;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $127 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $127;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);
    const BBL$w = 3;

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $129 = Bool$true;
                var $128 = $129;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $130 = Bool$false;
                var $128 = $130;
                break;
        };
        return $128;
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
                var $132 = self.pred;
                var $133 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $135 = self.pred;
                            var $136 = (_a$pred$10 => {
                                var $137 = Word$cmp$go$(_a$pred$10, $135, _c$4);
                                return $137;
                            });
                            var $134 = $136;
                            break;
                        case 'Word.i':
                            var $138 = self.pred;
                            var $139 = (_a$pred$10 => {
                                var $140 = Word$cmp$go$(_a$pred$10, $138, Cmp$ltn);
                                return $140;
                            });
                            var $134 = $139;
                            break;
                        case 'Word.e':
                            var $141 = (_a$pred$8 => {
                                var $142 = _c$4;
                                return $142;
                            });
                            var $134 = $141;
                            break;
                    };
                    var $134 = $134($132);
                    return $134;
                });
                var $131 = $133;
                break;
            case 'Word.i':
                var $143 = self.pred;
                var $144 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $146 = self.pred;
                            var $147 = (_a$pred$10 => {
                                var $148 = Word$cmp$go$(_a$pred$10, $146, Cmp$gtn);
                                return $148;
                            });
                            var $145 = $147;
                            break;
                        case 'Word.i':
                            var $149 = self.pred;
                            var $150 = (_a$pred$10 => {
                                var $151 = Word$cmp$go$(_a$pred$10, $149, _c$4);
                                return $151;
                            });
                            var $145 = $150;
                            break;
                        case 'Word.e':
                            var $152 = (_a$pred$8 => {
                                var $153 = _c$4;
                                return $153;
                            });
                            var $145 = $152;
                            break;
                    };
                    var $145 = $145($143);
                    return $145;
                });
                var $131 = $144;
                break;
            case 'Word.e':
                var $154 = (_b$5 => {
                    var $155 = _c$4;
                    return $155;
                });
                var $131 = $154;
                break;
        };
        var $131 = $131(_b$3);
        return $131;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $156 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $156;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$ltn$(_a$2, _b$3) {
        var $157 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $157;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);

    function BBL$node$(_key$3, _val$4, _left$5, _right$6) {
        var _size_left$7 = BBL$size$(_left$5);
        var _size_right$8 = BBL$size$(_right$6);
        var _new_size$9 = ((1 + ((_size_left$7 + _size_right$8) >>> 0)) >>> 0);
        var $158 = BBL$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $158;
    };
    const BBL$node = x0 => x1 => x2 => x3 => BBL$node$(x0, x1, x2, x3);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $160 = Bool$false;
                var $159 = $160;
                break;
            case 'Cmp.gtn':
                var $161 = Bool$true;
                var $159 = $161;
                break;
        };
        return $159;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $162 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $162;
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
            var $164 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
            var $163 = $164;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBL.bin':
                        var $167 = self.key;
                        var $168 = self.val;
                        var $169 = self.left;
                        var $170 = self.right;
                        var _size_rl$17 = BBL$size$($169);
                        var _size_rr$18 = BBL$size$($170);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $167;
                            var _new_val$20 = $168;
                            var _new_left$21 = BBL$node$(_k$3, _v$4, _l$5, $169);
                            var _new_right$22 = $170;
                            var $172 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $171 = $172;
                        } else {
                            var self = $169;
                            switch (self._) {
                                case 'BBL.bin':
                                    var $174 = self.key;
                                    var $175 = self.val;
                                    var $176 = self.left;
                                    var $177 = self.right;
                                    var _new_key$24 = $174;
                                    var _new_val$25 = $175;
                                    var _new_left$26 = BBL$node$(_k$3, _v$4, _l$5, $176);
                                    var _new_right$27 = BBL$node$($167, $168, $177, $170);
                                    var $178 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $173 = $178;
                                    break;
                                case 'BBL.tip':
                                    var $179 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $173 = $179;
                                    break;
                            };
                            var $171 = $173;
                        };
                        var $166 = $171;
                        break;
                    case 'BBL.tip':
                        var $180 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                        var $166 = $180;
                        break;
                };
                var $165 = $166;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBL.bin':
                            var $183 = self.key;
                            var $184 = self.val;
                            var $185 = self.left;
                            var $186 = self.right;
                            var _size_ll$17 = BBL$size$($185);
                            var _size_lr$18 = BBL$size$($186);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $183;
                                var _new_val$20 = $184;
                                var _new_left$21 = $185;
                                var _new_right$22 = BBL$node$(_k$3, _v$4, $186, _r$6);
                                var $188 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $187 = $188;
                            } else {
                                var self = $186;
                                switch (self._) {
                                    case 'BBL.bin':
                                        var $190 = self.key;
                                        var $191 = self.val;
                                        var $192 = self.left;
                                        var $193 = self.right;
                                        var _new_key$24 = $190;
                                        var _new_val$25 = $191;
                                        var _new_left$26 = BBL$node$($183, $184, $185, $192);
                                        var _new_right$27 = BBL$node$(_k$3, _v$4, $193, _r$6);
                                        var $194 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $189 = $194;
                                        break;
                                    case 'BBL.tip':
                                        var $195 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $189 = $195;
                                        break;
                                };
                                var $187 = $189;
                            };
                            var $182 = $187;
                            break;
                        case 'BBL.tip':
                            var $196 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                            var $182 = $196;
                            break;
                    };
                    var $181 = $182;
                } else {
                    var $197 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                    var $181 = $197;
                };
                var $165 = $181;
            };
            var $163 = $165;
        };
        return $163;
    };
    const BBL$balance = x0 => x1 => x2 => x3 => BBL$balance$(x0, x1, x2, x3);

    function BBL$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBL.bin':
                var $199 = self.key;
                var $200 = self.val;
                var $201 = self.left;
                var $202 = self.right;
                var self = _cmp$3(_key$4)($199);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $199;
                        var _new_val$13 = $200;
                        var _new_left$14 = BBL$insert$(_cmp$3, _key$4, _val$5, $201);
                        var _new_right$15 = $202;
                        var $204 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $203 = $204;
                        break;
                    case 'Cmp.eql':
                        var $205 = BBL$node$(_key$4, _val$5, $201, $202);
                        var $203 = $205;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $199;
                        var _new_val$13 = $200;
                        var _new_left$14 = $201;
                        var _new_right$15 = BBL$insert$(_cmp$3, _key$4, _val$5, $202);
                        var $206 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $203 = $206;
                        break;
                };
                var $198 = $203;
                break;
            case 'BBL.tip':
                var $207 = BBL$singleton$(_key$4, _val$5);
                var $198 = $207;
                break;
        };
        return $198;
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
                        var $208 = self.head;
                        var $209 = self.tail;
                        var _key$8 = Pair$fst$($208);
                        var _val$9 = Pair$snd$($208);
                        var _new_acc$10 = BBL$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $210 = BBL$from_list$go$(_cmp$3, _new_acc$10, $209);
                        return $210;
                    case 'List.nil':
                        var $211 = _acc$4;
                        return $211;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBL$from_list$go = x0 => x1 => x2 => BBL$from_list$go$(x0, x1, x2);

    function BBL$from_list$(_cmp$3, _xs$4) {
        var $212 = BBL$from_list$go$(_cmp$3, BBL$tip, _xs$4);
        return $212;
    };
    const BBL$from_list = x0 => x1 => BBL$from_list$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $214 = Bool$false;
                var $213 = $214;
                break;
            case 'Cmp.eql':
                var $215 = Bool$true;
                var $213 = $215;
                break;
        };
        return $213;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $216 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $216;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $218 = Cmp$ltn;
            var $217 = $218;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $220 = Cmp$eql;
                var $219 = $220;
            } else {
                var $221 = Cmp$gtn;
                var $219 = $221;
            };
            var $217 = $219;
        };
        return $217;
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
                        var $223 = Cmp$eql;
                        var $222 = $223;
                    } else {
                        var $224 = self.charCodeAt(0);
                        var $225 = self.slice(1);
                        var $226 = Cmp$ltn;
                        var $222 = $226;
                    };
                    return $222;
                } else {
                    var $227 = self.charCodeAt(0);
                    var $228 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $230 = Cmp$gtn;
                        var $229 = $230;
                    } else {
                        var $231 = self.charCodeAt(0);
                        var $232 = self.slice(1);
                        var self = U16$cmp$($227, $231);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $234 = Cmp$ltn;
                                var $233 = $234;
                                break;
                            case 'Cmp.eql':
                                var $235 = String$cmp$($228, $232);
                                var $233 = $235;
                                break;
                            case 'Cmp.gtn':
                                var $236 = Cmp$gtn;
                                var $233 = $236;
                                break;
                        };
                        var $229 = $233;
                    };
                    return $229;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$cmp = x0 => x1 => String$cmp$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $237 = BBL$from_list$(String$cmp, _xs$2);
        return $237;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $238 = null;
        return $238;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $239 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $239;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $240 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $240;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const App$Kind$typography$body_size = "12pt";
    const App$Kind$typography$typeface_body = "\'apl385\', \'Anonymous Pro\', \'Monaco\', \'Courier New\', monospace";
    const App$Kind$typography$body_strong = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_body), List$cons$(Pair$new$("font-weight", "800"), List$cons$(Pair$new$("line-height", "1.35"), List$nil)))));

    function Map$(_V$1) {
        var $241 = null;
        return $241;
    };
    const Map = x0 => Map$(x0);
    const App$Kind$typography$l = "16pt";
    const App$Kind$typography$typeface_header = "\'Lato\', \'Helvetica\', \'Verdana\', sans-serif";
    const App$Kind$typography$h2 = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$l), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));
    const App$Kind$typography$xl = "18pt";
    const App$Kind$typography$h1 = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$xl), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));
    const App$Kind$typography$body = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_body), List$cons$(Pair$new$("font-weight", "300"), List$cons$(Pair$new$("line-height", "1.35"), List$nil)))));
    const App$Kind$img$croni = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAxhJREFUSIm1lz9IW1EUh79YR0lTxFhsIKZJOigSMBA6NGnrH5yKUHARHCrYIqGDYMeqtKMBp1BqoR0EOzhlFKND7SApFkpopqQhkIY2JUMzuaWDvdf73rvvvSr1DIF73rv3u79z7znnxcPlWMflucdzGcC155sAjE/G5YP9vWPWXj4G8Mif/wUVQDfoRcC2IbSDAiRTcQur+zzAofA0AAO9AUaCIQCKtSqNVl0o4vDDsWHi/p5xLMxNsS1QZ8ValXwha4Dr1IKz4s5QeJqB3oB0OEHPnqdJpuIW5WbrcoJexEaCISYSaaH03GAAg9p/sWKtysbOssH399JZLqUObKu2WKs6gvOFLGvPN8kXstJnvuFOYABKlRz5QpZGqw5Ao1UnX8iysbNsUWXelJpaytigWgsuVXL4vWH83jClSo5Gq27w+b1hLVw19XKNT8YtcFvFR8N9HA33SbjfG5Y+wADXHYE5f80h14EtOef3hu32J6HifJ3gqmrbPL799Zejr9muMJFIA8h7oLP9vWPtBbMLtafZrtguZoaWKjkAWTZ1cLM51upmu2IJc7NdYSg8bQCqFU7AzWE3m12tluVSzUmziXfMpVTUbEtaKa3xig4KEItOAHDzRoJv3z+xuLCOr/uWHNtBAfp91+jpifL2/Qr37j6wQMEm1KJyjQRDhlS5MxXj4+4X2wioJhqGcu6G6Govl1NHisYGmUik5fk6lVHRMHRmBp+rKzmlkQoXa9uBDVAxYWNnmcWFdenvv36VaGzQsLhb81BUW0qmAWpW8urNMwB+/vhtWVS8W6xVLRvY/XwofUszGZZmMhIuDtzytdFo1ZkaTbo2A3We2IQY69JsNTNPMhWnC+iIUDZadfnyQG/ANYRm1QO9AaZGk4wEQxboia/Damae7a0DQDnj1+9WgNPwiIliciQSkQtEIhHD2GzmzZ74Ojx8ep/ZuTG2tw7Escl/Ep3FhXVm58YAePLoBXDalwWkXC4bNiHGcJb3QnU0NijXAlQgaP5JdADUDSRTcUd1wsrlsvarUgfUDtQNuLzjNsd1/h9Ji2BZJdnEIwAAAABJRU5ErkJggg==";

    function BBL$concat3$(_cmp$3, _key$4, _val$5, _left$6, _right$7) {
        var self = _left$6;
        switch (self._) {
            case 'BBL.bin':
                var $243 = self.size;
                var $244 = self.key;
                var $245 = self.val;
                var $246 = self.left;
                var $247 = self.right;
                var self = _right$7;
                switch (self._) {
                    case 'BBL.bin':
                        var $249 = self.size;
                        var $250 = self.key;
                        var $251 = self.val;
                        var $252 = self.left;
                        var $253 = self.right;
                        var _right_is_heavier$18 = (((BBL$w * $243) >>> 0) < $249);
                        var _left_is_heavier$19 = (((BBL$w * $249) >>> 0) < $243);
                        var self = _right_is_heavier$18;
                        if (self) {
                            var _new_key$20 = $250;
                            var _new_val$21 = $251;
                            var _new_left$22 = BBL$concat3$(_cmp$3, _key$4, _val$5, _left$6, $252);
                            var _new_right$23 = $253;
                            var $255 = BBL$balance$(_new_key$20, _new_val$21, _new_left$22, _new_right$23);
                            var $254 = $255;
                        } else {
                            var self = _left_is_heavier$19;
                            if (self) {
                                var _new_key$20 = $244;
                                var _new_val$21 = $245;
                                var _new_left$22 = $246;
                                var _new_right$23 = BBL$concat3$(_cmp$3, _key$4, _val$5, $247, _right$7);
                                var $257 = BBL$balance$(_new_key$20, _new_val$21, _new_left$22, _new_right$23);
                                var $256 = $257;
                            } else {
                                var $258 = BBL$node$(_key$4, _val$5, _left$6, _right$7);
                                var $256 = $258;
                            };
                            var $254 = $256;
                        };
                        var $248 = $254;
                        break;
                    case 'BBL.tip':
                        var $259 = BBL$insert$(_cmp$3, _key$4, _val$5, _left$6);
                        var $248 = $259;
                        break;
                };
                var $242 = $248;
                break;
            case 'BBL.tip':
                var self = _right$7;
                switch (self._) {
                    case 'BBL.tip':
                        var $261 = BBL$singleton$(_key$4, _val$5);
                        var $260 = $261;
                        break;
                    case 'BBL.bin':
                        var $262 = BBL$insert$(_cmp$3, _key$4, _val$5, _right$7);
                        var $260 = $262;
                        break;
                };
                var $242 = $260;
                break;
        };
        return $242;
    };
    const BBL$concat3 = x0 => x1 => x2 => x3 => x4 => BBL$concat3$(x0, x1, x2, x3, x4);

    function BBL$split_ltn$(_cmp$3, _cut$4, _map$5) {
        var self = _map$5;
        switch (self._) {
            case 'BBL.bin':
                var $264 = self.key;
                var $265 = self.val;
                var $266 = self.left;
                var $267 = self.right;
                var self = _cmp$3(_cut$4)($264);
                switch (self._) {
                    case 'Cmp.ltn':
                        var $269 = BBL$split_ltn$(_cmp$3, _cut$4, $266);
                        var $268 = $269;
                        break;
                    case 'Cmp.eql':
                        var $270 = $266;
                        var $268 = $270;
                        break;
                    case 'Cmp.gtn':
                        var _key$11 = $264;
                        var _val$12 = $265;
                        var _left$13 = $266;
                        var _right$14 = BBL$split_ltn$(_cmp$3, _cut$4, $267);
                        var $271 = BBL$concat3$(_cmp$3, _key$11, _val$12, _left$13, _right$14);
                        var $268 = $271;
                        break;
                };
                var $263 = $268;
                break;
            case 'BBL.tip':
                var $272 = _map$5;
                var $263 = $272;
                break;
        };
        return $263;
    };
    const BBL$split_ltn = x0 => x1 => x2 => BBL$split_ltn$(x0, x1, x2);

    function BBL$split_gtn$(_cmp$3, _cut$4, _map$5) {
        var self = _map$5;
        switch (self._) {
            case 'BBL.bin':
                var $274 = self.key;
                var $275 = self.val;
                var $276 = self.left;
                var $277 = self.right;
                var self = _cmp$3(_cut$4)($274);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _key$11 = $274;
                        var _val$12 = $275;
                        var _left$13 = BBL$split_gtn$(_cmp$3, _cut$4, $276);
                        var _right$14 = $277;
                        var $279 = BBL$concat3$(_cmp$3, _key$11, _val$12, _left$13, _right$14);
                        var $278 = $279;
                        break;
                    case 'Cmp.eql':
                        var $280 = $277;
                        var $278 = $280;
                        break;
                    case 'Cmp.gtn':
                        var $281 = BBL$split_gtn$(_cmp$3, _cut$4, $277);
                        var $278 = $281;
                        break;
                };
                var $273 = $278;
                break;
            case 'BBL.tip':
                var $282 = _map$5;
                var $273 = $282;
                break;
        };
        return $273;
    };
    const BBL$split_gtn = x0 => x1 => x2 => BBL$split_gtn$(x0, x1, x2);

    function BBL$union$(_cmp$3, _map_a$4, _map_b$5) {
        var self = _map_a$4;
        switch (self._) {
            case 'BBL.tip':
                var self = _map_b$5;
                switch (self._) {
                    case 'BBL.tip':
                        var $285 = BBL$tip;
                        var $284 = $285;
                        break;
                    case 'BBL.bin':
                        var $286 = _map_b$5;
                        var $284 = $286;
                        break;
                };
                var $283 = $284;
                break;
            case 'BBL.bin':
                var self = _map_b$5;
                switch (self._) {
                    case 'BBL.bin':
                        var $288 = self.key;
                        var $289 = self.val;
                        var $290 = self.left;
                        var $291 = self.right;
                        var _key$16 = $288;
                        var _val$17 = $289;
                        var _ltn$18 = BBL$split_ltn$(_cmp$3, $288, _map_a$4);
                        var _gtn$19 = BBL$split_gtn$(_cmp$3, $288, _map_a$4);
                        var _left$20 = BBL$union$(_cmp$3, _ltn$18, $290);
                        var _right$21 = BBL$union$(_cmp$3, _gtn$19, $291);
                        var $292 = BBL$concat3$(_cmp$3, _key$16, _val$17, _left$20, _right$21);
                        var $287 = $292;
                        break;
                    case 'BBL.tip':
                        var $293 = _map_a$4;
                        var $287 = $293;
                        break;
                };
                var $283 = $287;
                break;
        };
        return $283;
    };
    const BBL$union = x0 => x1 => x2 => BBL$union$(x0, x1, x2);

    function Map$union$(_a$2, _b$3) {
        var $294 = BBL$union$(String$cmp, _a$2, _b$3);
        return $294;
    };
    const Map$union = x0 => x1 => Map$union$(x0, x1);
    const App$Kind$typography$button = Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "600"), List$cons$(Pair$new$("line-height", "1"), List$nil))))));
    const App$Kind$constant$secondary_color = "#3891A6";

    function App$Kind$comp$btn_primary_solid$(_title$1, _id$2) {
        var $295 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$2), List$nil)), Map$union$(App$Kind$typography$button, Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("padding", "0.5em 1em"), List$cons$(Pair$new$("background-color", App$Kind$constant$secondary_color), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("border-radius", "7px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))))))), List$cons$(DOM$text$(_title$1), List$nil));
        return $295;
    };
    const App$Kind$comp$btn_primary_solid = x0 => x1 => App$Kind$comp$btn_primary_solid$(x0, x1);
    const App$Kind$typography$typeface_code = "\'apl385\', \'Anonymous Pro\', \'Monaco\', \'Courier New\', monospace";
    const App$Kind$typography$code = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_code), List$cons$(Pair$new$("font-weight", "400"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));

    function String$cons$(_head$1, _tail$2) {
        var $296 = (String.fromCharCode(_head$1) + _tail$2);
        return $296;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const App$Kind$constant$primary_color = "#71558C";

    function App$Kind$comp$heading$(_typography$1, _title$2) {
        var $297 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(_typography$1, Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$nil))), List$cons$(DOM$text$(_title$2), List$nil));
        return $297;
    };
    const App$Kind$comp$heading = x0 => x1 => App$Kind$comp$heading$(x0, x1);

    function Buffer32$new$(_depth$1, _array$2) {
        var $298 = u32array_to_buffer32(_array$2);
        return $298;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $299 = null;
        return $299;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $300 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $300;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $301 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $301;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $303 = Array$tip$(_x$3);
            var $302 = $303;
        } else {
            var $304 = (self - 1n);
            var _half$5 = Array$alloc$($304, _x$3);
            var $305 = Array$tie$(_half$5, _half$5);
            var $302 = $305;
        };
        return $302;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);
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
                        var $306 = self.pred;
                        var $307 = Word$bit_length$go$($306, Nat$succ$(_c$3), _n$4);
                        return $307;
                    case 'Word.i':
                        var $308 = self.pred;
                        var $309 = Word$bit_length$go$($308, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $309;
                    case 'Word.e':
                        var $310 = _n$4;
                        return $310;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $311 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $311;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $313 = u32_to_word(self);
                var $314 = Word$bit_length$($313);
                var $312 = $314;
                break;
        };
        return $312;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $315 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $315;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $316 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $316;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const App$Kind$typography$xxl = "21pt";
    const App$Kind$typography$subtitle = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$xxl), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("line-height", "1.5"), List$nil))))));

    function App$Kind$comp$title_phone$(_title$1) {
        var $317 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(App$Kind$typography$subtitle, Map$from_list$(List$cons$(Pair$new$("margin-top", "1em"), List$cons$(Pair$new$("width", "100%"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $317;
    };
    const App$Kind$comp$title_phone = x0 => App$Kind$comp$title_phone$(x0);
    const App$Kind$typography$xxxl = "24pt";
    const App$Kind$typography$title = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$xxxl), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("line-height", "1.5"), List$nil))))));

    function App$Kind$comp$title$(_title$1) {
        var $318 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(App$Kind$typography$title, Map$from_list$(List$cons$(Pair$new$("margin-top", "1em"), List$cons$(Pair$new$("width", "100%"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $318;
    };
    const App$Kind$comp$title = x0 => App$Kind$comp$title$(x0);
    const App$Kind$constant$light_gray_color = "#D3D3D3";

    function App$Kind$comp$header_tab$(_is_active$1, _is_hover$2, _title$3, _id$4) {
        var _normal$5 = Map$from_list$(List$cons$(Pair$new$("padding", "0.5em 1em"), List$cons$(Pair$new$("font-weight", "500"), List$cons$(Pair$new$("font-size", "1.1em"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))));
        var _active$6 = Map$from_list$(List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", App$Kind$constant$secondary_color), List$cons$(Pair$new$("border-width", "thin"), List$nil))));
        var _hover$7 = Map$from_list$(List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", App$Kind$constant$light_gray_color), List$cons$(Pair$new$("border-width", "thin"), List$nil))));
        var $319 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$4), List$nil)), (() => {
            var self = _is_active$1;
            if (self) {
                var $320 = Map$union$(_normal$5, _active$6);
                return $320;
            } else {
                var self = _is_hover$2;
                if (self) {
                    var $322 = Map$union$(_normal$5, _hover$7);
                    var $321 = $322;
                } else {
                    var $323 = _normal$5;
                    var $321 = $323;
                };
                return $321;
            };
        })(), List$cons$(DOM$text$(_title$3), List$nil));
        return $319;
    };
    const App$Kind$comp$header_tab = x0 => x1 => x2 => x3 => App$Kind$comp$header_tab$(x0, x1, x2, x3);

    function App$Kind$helper$is_eql$(_src$1, _trg$2) {
        var self = _src$1;
        switch (self._) {
            case 'App.Kind.Page.home':
                var self = _trg$2;
                switch (self._) {
                    case 'App.Kind.Page.home':
                        var $326 = Bool$true;
                        var $325 = $326;
                        break;
                    case 'App.Kind.Page.apps':
                        var $327 = Bool$false;
                        var $325 = $327;
                        break;
                };
                var $324 = $325;
                break;
            case 'App.Kind.Page.apps':
                var self = _trg$2;
                switch (self._) {
                    case 'App.Kind.Page.home':
                        var $329 = Bool$false;
                        var $328 = $329;
                        break;
                    case 'App.Kind.Page.apps':
                        var $330 = Bool$true;
                        var $328 = $330;
                        break;
                };
                var $324 = $328;
                break;
        };
        return $324;
    };
    const App$Kind$helper$is_eql = x0 => x1 => App$Kind$helper$is_eql$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const String$eql = a0 => a1 => (a0 === a1);
    const App$Kind$Page$apps = ({
        _: 'App.Kind.Page.apps'
    });

    function App$Kind$comp$header_tabs$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $332 = self.page;
                var $333 = self.mouse_over;
                var _tabs$5 = List$cons$(App$Kind$comp$header_tab$(App$Kind$helper$is_eql$(App$Kind$Page$home, $332), ("tab_home" === $333), "Home", "tab_home"), List$cons$(App$Kind$comp$header_tab$(App$Kind$helper$is_eql$(App$Kind$Page$apps, $332), ("tab_apps" === $333), "Apps", "tab_apps"), List$nil));
                var $334 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(App$Kind$typography$button, Map$from_list$(List$cons$(Pair$new$("padding-top", "0.5em"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil))))), _tabs$5);
                var $331 = $334;
                break;
        };
        return $331;
    };
    const App$Kind$comp$header_tabs = x0 => App$Kind$comp$header_tabs$(x0);

    function App$Kind$comp$header$(_stt$1, _container_layout$2) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $336 = self.device;
                var _vbox$6 = VoxBox$alloc_capacity$(100);
                var _line$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "auto"), List$cons$(Pair$new$("max-width", "65em"), List$cons$(Pair$new$("padding", "0.5em 0"), List$nil)))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "3pt"), List$cons$(Pair$new$("border-top", (App$Kind$constant$primary_color + " dashed 1pt")), List$cons$(Pair$new$("border-bottom", (App$Kind$constant$primary_color + " dashed 1pt")), List$cons$(Pair$new$("margin-left", "10%"), List$cons$(Pair$new$("margin-right", "10%"), List$nil)))))), List$nil), List$nil));
                var $337 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "header"), List$nil)), _container_layout$2, List$cons$((() => {
                    var self = $336;
                    switch (self._) {
                        case 'Device.phone':
                            var $338 = App$Kind$comp$title_phone$("KIND language");
                            return $338;
                        case 'Device.tablet':
                        case 'Device.desktop':
                        case 'Device.big_desktop':
                            var $339 = App$Kind$comp$title$("KIND language");
                            return $339;
                    };
                })(), List$cons$(_line$7, List$cons$(App$Kind$comp$header_tabs$(_stt$1), List$nil))));
                var $335 = $337;
                break;
        };
        return $335;
    };
    const App$Kind$comp$header = x0 => x1 => App$Kind$comp$header$(x0, x1);
    const App$Kind$typography$xs = "9pt";
    const App$Kind$typography$xxs = "8pt";
    const App$Kind$typography$s = "10pt";
    const App$Kind$typography$h3 = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $340 = null;
        return $340;
    };
    const List = x0 => List$(x0);

    function App$Kind$comp$list$(_items$1) {
        var _li$2 = List$nil;
        var _li$3 = (() => {
            var $343 = _li$2;
            var $344 = _items$1;
            let _li$4 = $343;
            let _item$3;
            while ($344._ === 'List.cons') {
                _item$3 = $344.head;
                var $343 = List$cons$(DOM$node$("li", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("line-height", "1.35"), List$nil)), List$cons$(_item$3, List$nil)), _li$4);
                _li$4 = $343;
                $344 = $344.tail;
            }
            return _li$4;
        })();
        var $341 = DOM$node$("ul", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("list-style-type", "none"), List$nil)), _li$3);
        return $341;
    };
    const App$Kind$comp$list = x0 => App$Kind$comp$list$(x0);

    function App$Kind$comp$link_white$(_txt$1, _font_size$2, _href$3) {
        var $345 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$3), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", _font_size$2), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $345;
    };
    const App$Kind$comp$link_white = x0 => x1 => x2 => App$Kind$comp$link_white$(x0, x1, x2);
    const App$Kind$constant$dark_pri_color = "#44366B";

    function App$Kind$comp$footer$(_device$1, _container_layout$2) {
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $347 = "0.5em 0";
                var _vertical_padding$3 = $347;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $348 = "1em 0";
                var _vertical_padding$3 = $348;
                break;
        };
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $349 = App$Kind$typography$xs;
                var _footer_font_size$4 = $349;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $350 = App$Kind$typography$body_size;
                var _footer_font_size$4 = $350;
                break;
        };
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $351 = App$Kind$typography$xxs;
                var _footer_font_size_s$5 = $351;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $352 = App$Kind$typography$s;
                var _footer_font_size_s$5 = $352;
                break;
        };
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $353 = App$Kind$typography$h3;
                var _heading_typography$6 = $353;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $354 = App$Kind$typography$h2;
                var _heading_typography$6 = $354;
                break;
        };
        var _join_us_txt$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(App$Kind$comp$heading$(_heading_typography$6, "Join Us"), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(App$Kind$comp$list$(List$cons$(App$Kind$comp$link_white$("Github", _footer_font_size$4, "https://github.com/uwu-tech/Kind"), List$cons$(App$Kind$comp$link_white$("Telegram", _footer_font_size$4, "https://t.me/formality_lang"), List$nil))), List$nil)), List$nil)));
        var _join_us$8 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(_container_layout$2, Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "flex-end"), List$nil)))))), List$cons$(_join_us_txt$7, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", _footer_font_size$4), List$nil)), List$cons$(DOM$text$("\u{2764} by UwU Tech"), List$nil)), List$nil)));
        var _join_us_wrapper$9 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", _vertical_padding$3), List$cons$(Pair$new$("background-color", App$Kind$constant$primary_color), List$nil))), List$cons$(_join_us$8, List$nil));
        var _msg_footer$10 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(_container_layout$2, Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", _footer_font_size_s$5), List$nil)), List$cons$(DOM$text$("This website was created using Kind!"), List$nil)), List$cons$(App$Kind$comp$link_white$("*u* show me the code!", _footer_font_size_s$5, "https://github.com/uwu-tech/Kind/blob/master/base/Web/Kind.kind"), List$nil)));
        var _msg_footer_wrapper$11 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "0.5em 0"), List$cons$(Pair$new$("background-color", App$Kind$constant$dark_pri_color), List$nil))), List$cons$(_msg_footer$10, List$nil));
        var $346 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "footer"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("color", "white"), List$nil)))), List$cons$(_join_us_wrapper$9, List$cons$(_msg_footer_wrapper$11, List$nil)));
        return $346;
    };
    const App$Kind$comp$footer = x0 => x1 => App$Kind$comp$footer$(x0, x1);

    function App$Kind$comp$page$(_page_name$1, _stt$2, _body_contents$3) {
        var self = _stt$2;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $356 = self.device;
                var self = $356;
                switch (self._) {
                    case 'Device.phone':
                        var $358 = Map$from_list$(List$cons$(Pair$new$("width", "85%"), List$cons$(Pair$new$("margin-left", "auto"), List$cons$(Pair$new$("margin-right", "auto"), List$nil))));
                        var _container_layout$7 = $358;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $359 = Map$from_list$(List$cons$(Pair$new$("width", "60%"), List$cons$(Pair$new$("max-width", "600pt"), List$cons$(Pair$new$("margin-left", "auto"), List$cons$(Pair$new$("margin-right", "auto"), List$nil)))));
                        var _container_layout$7 = $359;
                        break;
                };
                var self = $356;
                switch (self._) {
                    case 'Device.phone':
                        var $360 = "1.5em 0";
                        var _body_container_padding$8 = $360;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $361 = "2.5em 0";
                        var _body_container_padding$8 = $361;
                        break;
                };
                var _page_layout$9 = Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil)))));
                var $357 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("page-" + _page_name$1)), List$nil)), Map$union$(App$Kind$typography$body, _page_layout$9), List$cons$(App$Kind$comp$header$(_stt$2, _container_layout$7), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "body-container"), List$nil)), Map$union$(_container_layout$7, Map$from_list$(List$cons$(Pair$new$("flex", "1"), List$cons$(Pair$new$("padding", _body_container_padding$8), List$nil)))), _body_contents$3), List$cons$(App$Kind$comp$footer$($356, _container_layout$7), List$nil))));
                var $355 = $357;
                break;
        };
        return $355;
    };
    const App$Kind$comp$page = x0 => x1 => x2 => App$Kind$comp$page$(x0, x1, x2);

    function App$Kind$draw_page_home$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $363 = self.device;
                var _span$5 = (_txt$5 => {
                    var $365 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(_txt$5), List$nil));
                    return $365;
                });
                var _line$6 = (_txt$6 => {
                    var $366 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(_txt$6), List$nil));
                    return $366;
                });
                var _line_break$7 = DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil);
                var _span_bold$8 = (_txt$8 => {
                    var $367 = DOM$node$("span", Map$from_list$(List$nil), App$Kind$typography$body_strong, List$cons$(DOM$text$(_txt$8), List$nil));
                    return $367;
                });
                var self = $363;
                switch (self._) {
                    case 'Device.phone':
                        var $368 = "6em";
                        var _go_to_apps_height$9 = $368;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $369 = "10em";
                        var _go_to_apps_height$9 = $369;
                        break;
                };
                var self = $363;
                switch (self._) {
                    case 'Device.phone':
                        var $370 = App$Kind$typography$h2;
                        var _heading_typography$10 = $370;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $371 = App$Kind$typography$h1;
                        var _heading_typography$10 = $371;
                        break;
                };
                var _intro$11 = DOM$node$("div", Map$from_list$(List$nil), App$Kind$typography$body, List$cons$(_span$5("Kind is a cute "), List$cons$(_span_bold$8("proof"), List$cons$(_span$5("gramming language."), List$cons$(_line_break$7, List$cons$(_line_break$7, List$cons$(_span$5("It\'s "), List$cons$(_span_bold$8("capable of everything"), List$cons$(_line$6("from web apps to games to"), List$cons$(_line$6("advanced mathematical proofs."), List$nil))))))))));
                var _croni$12 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-left", "3em"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-end"), List$nil)))), List$cons$(_span$5("gl hf!"), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", App$Kind$img$croni), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "2em"), List$cons$(Pair$new$("height", "2em"), List$nil))), List$nil), List$nil)));
                var _call_to_apps$12 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", _go_to_apps_height$9), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))), List$cons$(App$Kind$comp$btn_primary_solid$("GO TO APPS", "btn_pri_home_go_to_apps"), List$cons$(_croni$12, List$nil)));
                var _instructions$13 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(App$Kind$typography$code, Map$from_list$(List$cons$(Pair$new$("margin-top", "0.5em"), List$cons$(Pair$new$("padding", "0.5em"), List$cons$(Pair$new$("box-shadow", (App$Kind$constant$primary_color + " -2px 2px 1px")), List$cons$(Pair$new$("border", "1px solid"), List$nil)))))), List$cons$(_line$6("npm i -g kind-lang"), List$cons$(_line$6("git clone https://github.com/uwu-tech/Kind"), List$cons$(_line$6("cd Kind/base"), List$cons$(_line$6("kind Main"), List$cons$(_line$6("kind Main --run"), List$nil))))));
                var _install$13 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "instructions"), List$nil)), Map$from_list$(List$nil), List$cons$(App$Kind$comp$heading$(_heading_typography$10, "Install"), List$cons$(_instructions$13, List$nil)));
                var $364 = App$Kind$comp$page$("home", _stt$1, List$cons$(_intro$11, List$cons$(_call_to_apps$12, List$cons$(_install$13, List$nil))));
                var $362 = $364;
                break;
        };
        return $362;
    };
    const App$Kind$draw_page_home = x0 => App$Kind$draw_page_home$(x0);

    function App$Kind$comp$game_card$(_src$1, _title$2, _path$3) {
        var _banner$4 = DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", _src$1), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100px"), List$cons$(Pair$new$("height", "100px"), List$nil))), List$nil);
        var $372 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _path$3), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("text-decoration", "none"), List$nil)))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "120px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("margin", "10px 20px"), List$cons$(Pair$new$("border", "solid 1px"), List$cons$(Pair$new$("padding", "2px"), List$nil))))))), List$cons$(_banner$4, List$cons$(DOM$text$(_title$2), List$nil))), List$nil));
        return $372;
    };
    const App$Kind$comp$game_card = x0 => x1 => x2 => App$Kind$comp$game_card$(x0, x1, x2);
    const App$Kind$img$app_tic_tac_toe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAdlJREFUeJztm01uglAURrFxRyylm2nSQdNBk27GpbgmHDBpFHnvwH0/lXNmTu41hw9FPjxN0zRIHm+t38B/QlkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBTiHT/z5+v378vP7I3xFq9UmC5BO1mUccwa9X6+b30TpFZnzkytMFiD3M2tFef5xa7tiPTU5K0wWIDdZs/i7gxOVqWordo41WYB0suZDvXIo9nwPVlsRMjb+onQDyZNi8QwtsddLhzC6SNbM4lFNnqFRu7x0CIYlq9AXeYXhIfNNFiDg585+ig4PnG+yAMoCnJ79HeXuruPRWLzLarIAygIoC6AswNMP+M1YhckwKAuhLICyAO0b6ai6uMIKkwXopZHeXxdXWGGyAB010uu7SqygmCxAF4106YFRizrqDevzCo30ZRxL12LbOGiybKSL00sj/Tg5fJeNdFXaN9IVLhRspBugLICyAMoC+KzDMj7rsBdlAZQFUBbAZx0AJgtgyQrmmyyAJSuYb7IAlqwAkwXosWStwLZT5KBVmKdhcXpMVv0Kw0uHePotWTtcYbIAlqwAkwVQFiD+TukLY7IAygIoC6AsgLIANxbY0ByDNCtkAAAAAElFTkSuQmCC";
    const App$Kind$img$app_kaelin = "data:image/png;base64,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";
    const App$Kind$content_apps = List$cons$(App$Kind$comp$game_card$(App$Kind$img$app_tic_tac_toe, "TicTacToe", "App.TicTacToe"), List$cons$(App$Kind$comp$game_card$(App$Kind$img$app_kaelin, "Kaelin", "App.KL"), List$nil));

    function App$Kind$comp$link_black$(_txt$1, _href$2) {
        var $373 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $373;
    };
    const App$Kind$comp$link_black = x0 => x1 => App$Kind$comp$link_black$(x0, x1);
    const App$Kind$content_apps_text = App$Kind$comp$list$(List$cons$(App$Kind$comp$link_black$("Hello!", "App.Hello"), List$cons$(App$Kind$comp$link_black$("Kind playground - try Kind online!", "App.Playground"), List$cons$(App$Kind$comp$link_black$("Browser", "App.Browser"), List$cons$(App$Kind$comp$link_black$("MiniMMO", "App.MiniMMO"), List$nil)))));

    function App$Kind$draw_page_apps$(_stt$1) {
        var _with_banner$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("flex-wrap", "wrap"), List$nil))))), App$Kind$content_apps);
        var _no_banner$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "2em"), List$nil)), List$cons$(App$Kind$content_apps_text, List$nil));
        var _games$2 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "game-container"), List$nil)), Map$from_list$(List$nil), List$cons$(App$Kind$comp$heading$(App$Kind$typography$h1, "Games"), List$cons$(_with_banner$2, List$cons$(_no_banner$3, List$nil))));
        var $374 = App$Kind$comp$page$("apps", _stt$1, List$cons$(_games$2, List$nil));
        return $374;
    };
    const App$Kind$draw_page_apps = x0 => App$Kind$draw_page_apps$(x0);

    function App$Kind$draw_page$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $376 = self.page;
                var self = $376;
                switch (self._) {
                    case 'App.Kind.Page.home':
                        var $378 = App$Kind$draw_page_home$(_stt$1);
                        var $377 = $378;
                        break;
                    case 'App.Kind.Page.apps':
                        var $379 = App$Kind$draw_page_apps$(_stt$1);
                        var $377 = $379;
                        break;
                };
                var $375 = $377;
                break;
        };
        return $375;
    };
    const App$Kind$draw_page = x0 => App$Kind$draw_page$(x0);

    function IO$(_A$1) {
        var $380 = null;
        return $380;
    };
    const IO = x0 => IO$(x0);

    function Maybe$(_A$1) {
        var $381 = null;
        return $381;
    };
    const Maybe = x0 => Maybe$(x0);
    const App$State$local = Pair$fst;

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $383 = Bool$true;
                var $382 = $383;
                break;
            case 'Cmp.gtn':
                var $384 = Bool$false;
                var $382 = $384;
                break;
        };
        return $382;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $385 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $385;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);
    const Device$phone = ({
        _: 'Device.phone'
    });
    const Device$tablet = ({
        _: 'Device.tablet'
    });
    const Device$desktop = ({
        _: 'Device.desktop'
    });

    function Device$classify$(_width$1) {
        var self = (_width$1 <= 600);
        if (self) {
            var $387 = Device$phone;
            var $386 = $387;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $389 = Device$tablet;
                var $388 = $389;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $391 = Device$desktop;
                    var $390 = $391;
                } else {
                    var $392 = Device$big_desktop;
                    var $390 = $392;
                };
                var $388 = $390;
            };
            var $386 = $388;
        };
        return $386;
    };
    const Device$classify = x0 => Device$classify$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $393 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $393;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $395 = self.value;
                var $396 = _f$4($395);
                var $394 = $396;
                break;
            case 'IO.ask':
                var $397 = self.query;
                var $398 = self.param;
                var $399 = self.then;
                var $400 = IO$ask$($397, $398, (_x$8 => {
                    var $401 = IO$bind$($399(_x$8), _f$4);
                    return $401;
                }));
                var $394 = $400;
                break;
        };
        return $394;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $402 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $402;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $403 = _new$2(IO$bind)(IO$end);
        return $403;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Maybe$some$(_value$2) {
        var $404 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $404;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function App$set_local$(_value$2) {
        var $405 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $406 = _m$pure$4;
            return $406;
        }))(Maybe$some$(_value$2));
        return $405;
    };
    const App$set_local = x0 => App$set_local$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $407 = _m$pure$3;
        return $407;
    }))(Maybe$none);

    function App$Kind$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $409 = self.device;
                var $410 = self.page;
                var $411 = App$Kind$State$local$new$($409, $410, _id$1);
                var $408 = $411;
                break;
        };
        return $408;
    };
    const App$Kind$set_mouse_over = x0 => x1 => App$Kind$set_mouse_over$(x0, x1);
    const App$Kind$Event$go_to_home = ({
        _: 'App.Kind.Event.go_to_home'
    });
    const App$Kind$Event$go_to_apps = ({
        _: 'App.Kind.Event.go_to_apps'
    });
    const App$Kind$comp$id_action = Map$from_list$(List$cons$(Pair$new$("tab_home", App$Kind$Event$go_to_home), List$cons$(Pair$new$("tab_apps", App$Kind$Event$go_to_apps), List$cons$(Pair$new$("btn_pri_home_go_to_apps", App$Kind$Event$go_to_apps), List$nil))));

    function BBL$lookup$(_cmp$3, _key$4, _map$5) {
        var BBL$lookup$ = (_cmp$3, _key$4, _map$5) => ({
            ctr: 'TCO',
            arg: [_cmp$3, _key$4, _map$5]
        });
        var BBL$lookup = _cmp$3 => _key$4 => _map$5 => BBL$lookup$(_cmp$3, _key$4, _map$5);
        var arg = [_cmp$3, _key$4, _map$5];
        while (true) {
            let [_cmp$3, _key$4, _map$5] = arg;
            var R = (() => {
                var self = _map$5;
                switch (self._) {
                    case 'BBL.bin':
                        var $412 = self.key;
                        var $413 = self.val;
                        var $414 = self.left;
                        var $415 = self.right;
                        var self = _cmp$3(_key$4)($412);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $417 = BBL$lookup$(_cmp$3, _key$4, $414);
                                var $416 = $417;
                                break;
                            case 'Cmp.eql':
                                var $418 = Maybe$some$($413);
                                var $416 = $418;
                                break;
                            case 'Cmp.gtn':
                                var $419 = BBL$lookup$(_cmp$3, _key$4, $415);
                                var $416 = $419;
                                break;
                        };
                        return $416;
                    case 'BBL.tip':
                        var $420 = Maybe$none;
                        return $420;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBL$lookup = x0 => x1 => x2 => BBL$lookup$(x0, x1, x2);

    function Map$get$(_key$2, _map$3) {
        var $421 = BBL$lookup$(String$cmp, _key$2, _map$3);
        return $421;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function App$Kind$exe_event$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $423 = self.device;
                var $424 = self.mouse_over;
                var _actions$6 = App$Kind$comp$id_action;
                var self = Map$get$(_id$1, _actions$6);
                switch (self._) {
                    case 'Maybe.some':
                        var $426 = self.value;
                        var self = $426;
                        switch (self._) {
                            case 'App.Kind.Event.go_to_home':
                                var $428 = App$Kind$State$local$new$($423, App$Kind$Page$home, $424);
                                var $427 = $428;
                                break;
                            case 'App.Kind.Event.go_to_apps':
                                var $429 = App$Kind$State$local$new$($423, App$Kind$Page$apps, $424);
                                var $427 = $429;
                                break;
                        };
                        var $425 = $427;
                        break;
                    case 'Maybe.none':
                        var $430 = _stt$2;
                        var $425 = $430;
                        break;
                };
                var $422 = $425;
                break;
        };
        return $422;
    };
    const App$Kind$exe_event = x0 => x1 => App$Kind$exe_event$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $431 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $431;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$Kind = (() => {
        var _init$1 = App$Store$new$(App$Kind$State$local$new$(Device$big_desktop, App$Kind$Page$home, ""), Unit$new);
        var _draw$2 = (_state$2 => {
            var $433 = App$Kind$draw_page$((() => {
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $434 = self.local;
                        var $435 = $434;
                        return $435;
                };
            })());
            return $433;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.init':
                    var $437 = self.info;
                    var self = $437;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $439 = self.screen_size;
                            var self = $439;
                            switch (self._) {
                                case 'Pair.new':
                                    var $441 = self.fst;
                                    var _device$12 = Device$classify$($441);
                                    var $442 = App$set_local$(App$Kind$State$local$new$(_device$12, App$Kind$Page$home, ""));
                                    var $440 = $442;
                                    break;
                            };
                            var $438 = $440;
                            break;
                    };
                    var $436 = $438;
                    break;
                case 'App.Event.mouse_over':
                    var $443 = self.id;
                    var $444 = App$set_local$(App$Kind$set_mouse_over$($443, (() => {
                        var self = _state$4;
                        switch (self._) {
                            case 'App.Store.new':
                                var $445 = self.local;
                                var $446 = $445;
                                return $446;
                        };
                    })()));
                    var $436 = $444;
                    break;
                case 'App.Event.mouse_click':
                    var $447 = self.id;
                    var $448 = App$set_local$(App$Kind$exe_event$($447, (() => {
                        var self = _state$4;
                        switch (self._) {
                            case 'App.Store.new':
                                var $449 = self.local;
                                var $450 = $449;
                                return $450;
                        };
                    })()));
                    var $436 = $448;
                    break;
                case 'App.Event.frame':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.mouse_move':
                case 'App.Event.input':
                    var $451 = App$pass;
                    var $436 = $451;
                    break;
            };
            return $436;
        });
        var _tick$4 = (_tick$4 => _glob$5 => {
            var $452 = _glob$5;
            return $452;
        });
        var _post$5 = (_time$5 => _room$6 => _addr$7 => _data$8 => _glob$9 => {
            var $453 = _glob$9;
            return $453;
        });
        var $432 = App$new$(_init$1, _draw$2, _when$3, _tick$4, _post$5);
        return $432;
    })();
    return {
        'App.Store.new': App$Store$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.Kind.State': App$Kind$State,
        'App.Kind.State.local.new': App$Kind$State$local$new,
        'Device.big_desktop': Device$big_desktop,
        'App.Kind.Page.home': App$Kind$Page$home,
        'Unit.new': Unit$new,
        'DOM.node': DOM$node,
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
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
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
        'List.nil': List$nil,
        'Pair': Pair,
        'List.cons': List$cons,
        'DOM.text': DOM$text,
        'App.Kind.typography.body_size': App$Kind$typography$body_size,
        'App.Kind.typography.typeface_body': App$Kind$typography$typeface_body,
        'App.Kind.typography.body_strong': App$Kind$typography$body_strong,
        'Map': Map,
        'App.Kind.typography.l': App$Kind$typography$l,
        'App.Kind.typography.typeface_header': App$Kind$typography$typeface_header,
        'App.Kind.typography.h2': App$Kind$typography$h2,
        'App.Kind.typography.xl': App$Kind$typography$xl,
        'App.Kind.typography.h1': App$Kind$typography$h1,
        'App.Kind.typography.body': App$Kind$typography$body,
        'App.Kind.img.croni': App$Kind$img$croni,
        'BBL.concat3': BBL$concat3,
        'BBL.split_ltn': BBL$split_ltn,
        'BBL.split_gtn': BBL$split_gtn,
        'BBL.union': BBL$union,
        'Map.union': Map$union,
        'App.Kind.typography.button': App$Kind$typography$button,
        'App.Kind.constant.secondary_color': App$Kind$constant$secondary_color,
        'App.Kind.comp.btn_primary_solid': App$Kind$comp$btn_primary_solid,
        'App.Kind.typography.typeface_code': App$Kind$typography$typeface_code,
        'App.Kind.typography.code': App$Kind$typography$code,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.Kind.constant.primary_color': App$Kind$constant$primary_color,
        'App.Kind.comp.heading': App$Kind$comp$heading,
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'U32.bit_length': U32$bit_length,
        'VoxBox.new': VoxBox$new,
        'VoxBox.alloc_capacity': VoxBox$alloc_capacity,
        'App.Kind.typography.xxl': App$Kind$typography$xxl,
        'App.Kind.typography.subtitle': App$Kind$typography$subtitle,
        'App.Kind.comp.title_phone': App$Kind$comp$title_phone,
        'App.Kind.typography.xxxl': App$Kind$typography$xxxl,
        'App.Kind.typography.title': App$Kind$typography$title,
        'App.Kind.comp.title': App$Kind$comp$title,
        'App.Kind.constant.light_gray_color': App$Kind$constant$light_gray_color,
        'App.Kind.comp.header_tab': App$Kind$comp$header_tab,
        'App.Kind.helper.is_eql': App$Kind$helper$is_eql,
        'Bool.and': Bool$and,
        'String.eql': String$eql,
        'App.Kind.Page.apps': App$Kind$Page$apps,
        'App.Kind.comp.header_tabs': App$Kind$comp$header_tabs,
        'App.Kind.comp.header': App$Kind$comp$header,
        'App.Kind.typography.xs': App$Kind$typography$xs,
        'App.Kind.typography.xxs': App$Kind$typography$xxs,
        'App.Kind.typography.s': App$Kind$typography$s,
        'App.Kind.typography.h3': App$Kind$typography$h3,
        'List.for': List$for,
        'List': List,
        'App.Kind.comp.list': App$Kind$comp$list,
        'App.Kind.comp.link_white': App$Kind$comp$link_white,
        'App.Kind.constant.dark_pri_color': App$Kind$constant$dark_pri_color,
        'App.Kind.comp.footer': App$Kind$comp$footer,
        'App.Kind.comp.page': App$Kind$comp$page,
        'App.Kind.draw_page_home': App$Kind$draw_page_home,
        'App.Kind.comp.game_card': App$Kind$comp$game_card,
        'App.Kind.img.app_tic_tac_toe': App$Kind$img$app_tic_tac_toe,
        'App.Kind.img.app_kaelin': App$Kind$img$app_kaelin,
        'App.Kind.content_apps': App$Kind$content_apps,
        'App.Kind.comp.link_black': App$Kind$comp$link_black,
        'App.Kind.content_apps_text': App$Kind$content_apps_text,
        'App.Kind.draw_page_apps': App$Kind$draw_page_apps,
        'App.Kind.draw_page': App$Kind$draw_page,
        'IO': IO,
        'Maybe': Maybe,
        'App.State.local': App$State$local,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'Device.phone': Device$phone,
        'Device.tablet': Device$tablet,
        'Device.desktop': Device$desktop,
        'Device.classify': Device$classify,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Maybe.some': Maybe$some,
        'App.set_local': App$set_local,
        'Maybe.none': Maybe$none,
        'App.pass': App$pass,
        'App.Kind.set_mouse_over': App$Kind$set_mouse_over,
        'App.Kind.Event.go_to_home': App$Kind$Event$go_to_home,
        'App.Kind.Event.go_to_apps': App$Kind$Event$go_to_apps,
        'App.Kind.comp.id_action': App$Kind$comp$id_action,
        'BBL.lookup': BBL$lookup,
        'Map.get': Map$get,
        'App.Kind.exe_event': App$Kind$exe_event,
        'App.new': App$new,
        'App.Kind': App$Kind,
    };
})();

/***/ })

}]);
//# sourceMappingURL=317.index.js.map