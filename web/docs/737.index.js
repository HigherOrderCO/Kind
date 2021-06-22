(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[737],{

/***/ 737:
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
    const App$Playground$State = App$State$new;

    function App$Playground$State$local$new$(_device$1, _window$2, _mouse_over$3, _code$4, _output$5, _kind_version$6) {
        var $29 = ({
            _: 'App.Playground.State.local.new',
            'device': _device$1,
            'window': _window$2,
            'mouse_over': _mouse_over$3,
            'code': _code$4,
            'output': _output$5,
            'kind_version': _kind_version$6
        });
        return $29;
    };
    const App$Playground$State$local$new = x0 => x1 => x2 => x3 => x4 => x5 => App$Playground$State$local$new$(x0, x1, x2, x3, x4, x5);
    const Device$big_desktop = ({
        _: 'Device.big_desktop'
    });
    const App$Playground$Window$input = ({
        _: 'App.Playground.Window.input'
    });
    const App$Playground$State$local_empty = App$Playground$State$local$new$(Device$big_desktop, App$Playground$Window$input, "", "", "", "");
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

    function List$cons$(_head$2, _tail$3) {
        var $238 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $238;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $239 = null;
        return $239;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });
    const App$Playground$constant$light_gray_color = "#E0E0E0";
    const App$Playground$constant$white_smoke = "#F5F5F5";

    function DOM$text$(_value$1) {
        var $240 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $240;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const Bool$and = a0 => a1 => (a0 && a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Map$(_V$1) {
        var $241 = null;
        return $241;
    };
    const Map = x0 => Map$(x0);

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
    const App$Kind$constant$secondary_color = "#3891A6";

    function App$Playground$comp$btn$(_mouse_over$1, _id$2, _text$3) {
        var _is_hover$4 = (_id$2 === _mouse_over$1);
        var _normal$5 = Map$from_list$(List$cons$(Pair$new$("width", "50px"), List$cons$(Pair$new$("height", "25px"), List$cons$(Pair$new$("margin", "5px 0px"), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("border-radius", "4px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil))))))))))));
        var $295 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$2), List$nil)), (() => {
            var self = _is_hover$4;
            if (self) {
                var $296 = Map$union$(_normal$5, Map$from_list$(List$cons$(Pair$new$("background-color", "#44B8D3"), List$nil)));
                return $296;
            } else {
                var $297 = Map$union$(_normal$5, Map$from_list$(List$cons$(Pair$new$("background-color", App$Kind$constant$secondary_color), List$nil)));
                return $297;
            };
        })(), List$cons$(DOM$text$(_text$3), List$nil));
        return $295;
    };
    const App$Playground$comp$btn = x0 => x1 => x2 => App$Playground$comp$btn$(x0, x1, x2);

    function App$Playground$comp$header$(_device$1, _mouse_over$2, _window$3) {
        var _playground$4 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "input_view"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "35px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", (() => {
            var self = _window$3;
            switch (self._) {
                case 'App.Playground.Window.input':
                    var $299 = App$Playground$constant$light_gray_color;
                    return $299;
                case 'App.Playground.Window.terminal':
                    var $300 = App$Playground$constant$white_smoke;
                    return $300;
            };
        })()), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("playground.kind"), List$nil));
        var _btn_check$5 = App$Playground$comp$btn$(_mouse_over$2, "btn_type_check", "check");
        var _btn_run$6 = App$Playground$comp$btn$(_mouse_over$2, "btn_run_code", "run");
        var _style_header$7 = Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$nil))));
        var _btn_area$8 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("width", "120px"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$nil))))), List$cons$(_btn_check$5, List$cons$(_btn_run$6, List$nil)));
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var _terminal$9 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "terminal_view"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "35px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", (() => {
                    var self = _window$3;
                    switch (self._) {
                        case 'App.Playground.Window.input':
                            var $302 = App$Playground$constant$white_smoke;
                            return $302;
                        case 'App.Playground.Window.terminal':
                            var $303 = App$Playground$constant$light_gray_color;
                            return $303;
                    };
                })()), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("output"), List$nil));
                var $301 = DOM$node$("div", Map$from_list$(List$nil), _style_header$7, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$nil)))), List$cons$(_playground$4, List$cons$(_terminal$9, List$nil))), List$cons$(_btn_area$8, List$nil)));
                var $298 = $301;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $304 = DOM$node$("div", Map$from_list$(List$nil), _style_header$7, List$cons$(_playground$4, List$cons$(_btn_area$8, List$nil)));
                var $298 = $304;
                break;
        };
        return $298;
    };
    const App$Playground$comp$header = x0 => x1 => x2 => App$Playground$comp$header$(x0, x1, x2);

    function String$cons$(_head$1, _tail$2) {
        var $305 = (String.fromCharCode(_head$1) + _tail$2);
        return $305;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$Playground$comp$input$(_code$1) {
        var $306 = DOM$node$("textarea", Map$from_list$(List$cons$(Pair$new$("id", "input_code"), List$cons$(Pair$new$("placeholder", "Write Kind code in this online editor and run it <3"), List$nil))), Map$from_list$(List$cons$(Pair$new$("cols", "100"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("border", ("solid 5px " + App$Playground$constant$light_gray_color)), List$cons$(Pair$new$("resize", "none"), List$cons$(Pair$new$("padding", "10px"), List$nil)))))), List$cons$(DOM$text$(_code$1), List$nil));
        return $306;
    };
    const App$Playground$comp$input = x0 => App$Playground$comp$input$(x0);

    function App$Playground$comp$output_area$(_output$1, _device$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("width", "400px"), List$cons$(Pair$new$("max-width", "500px"), List$cons$(Pair$new$("overflow", "auto"), List$cons$(Pair$new$("padding", "10px"), List$cons$(Pair$new$("background-color", App$Playground$constant$light_gray_color), List$nil))))));
        var $307 = DOM$node$("div", Map$from_list$(List$nil), (() => {
            var self = _device$2;
            switch (self._) {
                case 'Device.phone':
                    var $308 = Map$union$(_style$3, Map$from_list$(List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin-top", "0px"), List$nil))));
                    return $308;
                case 'Device.tablet':
                case 'Device.desktop':
                case 'Device.big_desktop':
                    var $309 = Map$union$(_style$3, Map$from_list$(List$cons$(Pair$new$("height", "100% - 35px"), List$cons$(Pair$new$("margin-top", "35px"), List$nil))));
                    return $309;
            };
        })(), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("kind-lang@1.0.51"), List$nil)), List$cons$(DOM$node$("pre", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$nil)), List$cons$(DOM$text$(_output$1), List$nil)), List$nil)));
        return $307;
    };
    const App$Playground$comp$output_area = x0 => x1 => App$Playground$comp$output_area$(x0, x1);

    function App$Playground$comp$main_area$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Playground.State.local.new':
                var $311 = self.device;
                var $312 = self.window;
                var $313 = self.mouse_over;
                var $314 = self.code;
                var $315 = self.output;
                var _header$8 = App$Playground$comp$header$($311, $313, $312);
                var _input_view$9 = App$Playground$comp$input$($314);
                var _output_view$10 = App$Playground$comp$output_area$($315, $311);
                var self = $311;
                switch (self._) {
                    case 'Device.phone':
                        var $317 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$nil))))), List$cons$(_header$8, List$cons$((() => {
                            var self = $312;
                            switch (self._) {
                                case 'App.Playground.Window.input':
                                    var $318 = _input_view$9;
                                    return $318;
                                case 'App.Playground.Window.terminal':
                                    var $319 = _output_view$10;
                                    return $319;
                            };
                        })(), List$nil)));
                        var $316 = $317;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $320 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("width", "60%"), List$nil)))), List$cons$(_header$8, List$cons$(_input_view$9, List$nil))), List$cons$(_output_view$10, List$nil)));
                        var $316 = $320;
                        break;
                };
                var $310 = $316;
                break;
        };
        return $310;
    };
    const App$Playground$comp$main_area = x0 => App$Playground$comp$main_area$(x0);

    function App$Playground$draw$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Playground.State.local.new':
                var $322 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin", "20px 0x"), List$cons$(Pair$new$("display", "flex"), List$nil))))), List$cons$(App$Playground$comp$main_area$(_stt$1), List$nil));
                var $321 = $322;
                break;
        };
        return $321;
    };
    const App$Playground$draw = x0 => App$Playground$draw$(x0);

    function App$playground$body$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Playground.State.local.new':
                var $324 = self.device;
                var self = $324;
                switch (self._) {
                    case 'Device.phone':
                        var $326 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "10px"), List$cons$(Pair$new$("height", "300px"), List$nil))), List$cons$(App$Playground$draw$(_stt$1), List$nil));
                        var $325 = $326;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $327 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "100px"), List$cons$(Pair$new$("height", "500px"), List$nil))), List$cons$(App$Playground$draw$(_stt$1), List$nil));
                        var $325 = $327;
                        break;
                };
                var $323 = $325;
                break;
        };
        return $323;
    };
    const App$playground$body = x0 => App$playground$body$(x0);
    const App$State$local = Pair$fst;

    function IO$(_A$1) {
        var $328 = null;
        return $328;
    };
    const IO = x0 => IO$(x0);

    function Maybe$(_A$1) {
        var $329 = null;
        return $329;
    };
    const Maybe = x0 => Maybe$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $330 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $330;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $332 = self.value;
                var $333 = _f$4($332);
                var $331 = $333;
                break;
            case 'IO.ask':
                var $334 = self.query;
                var $335 = self.param;
                var $336 = self.then;
                var $337 = IO$ask$($334, $335, (_x$8 => {
                    var $338 = IO$bind$($336(_x$8), _f$4);
                    return $338;
                }));
                var $331 = $337;
                break;
        };
        return $331;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $339 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $339;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $340 = _new$2(IO$bind)(IO$end);
        return $340;
    };
    const IO$monad = x0 => IO$monad$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $341 = _m$pure$3;
        return $341;
    }))(Maybe$none);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $343 = Bool$true;
                var $342 = $343;
                break;
            case 'Cmp.gtn':
                var $344 = Bool$false;
                var $342 = $344;
                break;
        };
        return $342;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $345 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $345;
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
            var $347 = Device$phone;
            var $346 = $347;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $349 = Device$tablet;
                var $348 = $349;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $351 = Device$desktop;
                    var $350 = $351;
                } else {
                    var $352 = Device$big_desktop;
                    var $350 = $352;
                };
                var $348 = $350;
            };
            var $346 = $348;
        };
        return $346;
    };
    const Device$classify = x0 => Device$classify$(x0);

    function Maybe$some$(_value$2) {
        var $353 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $353;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function App$set_local$(_value$2) {
        var $354 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $355 = _m$pure$4;
            return $355;
        }))(Maybe$some$(_value$2));
        return $354;
    };
    const App$set_local = x0 => App$set_local$(x0);

    function App$Playground$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'App.Playground.State.local.new':
                var $357 = self.device;
                var $358 = self.window;
                var $359 = self.code;
                var $360 = self.output;
                var $361 = self.kind_version;
                var $362 = App$Playground$State$local$new$($357, $358, _id$1, $359, $360, $361);
                var $356 = $362;
                break;
        };
        return $356;
    };
    const App$Playground$set_mouse_over = x0 => x1 => App$Playground$set_mouse_over$(x0, x1);
    const App$Playground$Window$terminal = ({
        _: 'App.Playground.Window.terminal'
    });

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $364 = Bool$true;
            var $363 = $364;
        } else {
            var $365 = self.charCodeAt(0);
            var $366 = self.slice(1);
            var $367 = Bool$false;
            var $363 = $367;
        };
        return $363;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function App$Playground$set_output$(_output$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Playground.State.local.new':
                var $369 = self.device;
                var $370 = self.window;
                var $371 = self.mouse_over;
                var $372 = self.code;
                var $373 = self.kind_version;
                var $374 = App$Playground$State$local$new$($369, $370, $371, $372, _output$1, $373);
                var $368 = $374;
                break;
        };
        return $368;
    };
    const App$Playground$set_output = x0 => x1 => App$Playground$set_output$(x0, x1);

    function IO$request$(_url$1) {
        var $375 = IO$ask$("request", _url$1, (_text$2 => {
            var $376 = IO$end$(_text$2);
            return $376;
        }));
        return $375;
    };
    const IO$request = x0 => IO$request$(x0);

    function App$Playground$set_window$(_window$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Playground.State.local.new':
                var $378 = self.device;
                var $379 = self.mouse_over;
                var $380 = self.code;
                var $381 = self.output;
                var $382 = self.kind_version;
                var $383 = App$Playground$State$local$new$($378, _window$1, $379, $380, $381, $382);
                var $377 = $383;
                break;
        };
        return $377;
    };
    const App$Playground$set_window = x0 => x1 => App$Playground$set_window$(x0, x1);

    function App$Playground$set_code$(_input$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Playground.State.local.new':
                var $385 = self.device;
                var $386 = self.window;
                var $387 = self.mouse_over;
                var $388 = self.output;
                var $389 = self.kind_version;
                var $390 = App$Playground$State$local$new$($385, $386, $387, _input$1, $388, $389);
                var $384 = $390;
                break;
        };
        return $384;
    };
    const App$Playground$set_code = x0 => x1 => App$Playground$set_code$(x0, x1);

    function App$Playground$when$(_event$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'App.Store.new':
                var $392 = self.local;
                var $393 = $392;
                var _state$3 = $393;
                break;
        };
        var self = _state$3;
        switch (self._) {
            case 'App.Playground.State.local.new':
                var $394 = self.device;
                var $395 = self.code;
                var self = _event$1;
                switch (self._) {
                    case 'App.Event.frame':
                        var $397 = self.info;
                        var self = $397;
                        switch (self._) {
                            case 'App.EnvInfo.new':
                                var $399 = self.screen_size;
                                var self = $399;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $401 = self.fst;
                                        var _device$16 = Device$classify$($401);
                                        var self = _state$3;
                                        switch (self._) {
                                            case 'App.Playground.State.local.new':
                                                var $403 = self.window;
                                                var $404 = self.mouse_over;
                                                var $405 = self.code;
                                                var $406 = self.output;
                                                var $407 = self.kind_version;
                                                var $408 = App$Playground$State$local$new$(_device$16, $403, $404, $405, $406, $407);
                                                var _stt$17 = $408;
                                                break;
                                        };
                                        var $402 = App$set_local$(_stt$17);
                                        var $400 = $402;
                                        break;
                                };
                                var $398 = $400;
                                break;
                        };
                        var $396 = $398;
                        break;
                    case 'App.Event.mouse_over':
                        var $409 = self.id;
                        var $410 = App$set_local$(App$Playground$set_mouse_over$($409, _state$3));
                        var $396 = $410;
                        break;
                    case 'App.Event.mouse_click':
                        var $411 = self.id;
                        var self = $394;
                        switch (self._) {
                            case 'Device.phone':
                                var $413 = App$Playground$Window$terminal;
                                var _window$13 = $413;
                                break;
                            case 'Device.tablet':
                            case 'Device.desktop':
                            case 'Device.big_desktop':
                                var $414 = App$Playground$Window$input;
                                var _window$13 = $414;
                                break;
                        };
                        var self = ($411 === "btn_type_check");
                        if (self) {
                            var self = String$is_empty$($395);
                            if (self) {
                                var _stt$14 = App$Playground$set_output$("How can I type check an empty code? haha", _state$3);
                                var $416 = App$set_local$(_stt$14);
                                var $415 = $416;
                            } else {
                                var $417 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                    var $418 = _m$bind$14;
                                    return $418;
                                }))(IO$request$(("http://18.222.191.174:3030/api/check_term?code=" + $395)))((_checked$14 => {
                                    var _stt$15 = App$Playground$set_output$(_checked$14, _state$3);
                                    var _stt$16 = App$Playground$set_window$(_window$13, _stt$15);
                                    var $419 = App$set_local$(_stt$16);
                                    return $419;
                                }));
                                var $415 = $417;
                            };
                            var $412 = $415;
                        } else {
                            var self = ($411 === "btn_run_code");
                            if (self) {
                                var self = String$is_empty$($395);
                                if (self) {
                                    var self = _state$3;
                                    switch (self._) {
                                        case 'App.Playground.State.local.new':
                                            var $423 = self.device;
                                            var $424 = self.window;
                                            var $425 = self.mouse_over;
                                            var $426 = self.code;
                                            var $427 = self.kind_version;
                                            var $428 = App$Playground$State$local$new$($423, $424, $425, $426, "How can I type check an empty code? haha", $427);
                                            var _stt$14 = $428;
                                            break;
                                    };
                                    var $422 = App$set_local$(_stt$14);
                                    var $421 = $422;
                                } else {
                                    var $429 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                        var $430 = _m$bind$14;
                                        return $430;
                                    }))(IO$request$(("http://18.222.191.174:3030/api/run_term?code=" + $395)))((_checked$14 => {
                                        var _stt$15 = App$Playground$set_output$(_checked$14, _state$3);
                                        var _stt$16 = App$Playground$set_window$(_window$13, _stt$15);
                                        var $431 = App$set_local$(_stt$16);
                                        return $431;
                                    }));
                                    var $421 = $429;
                                };
                                var $420 = $421;
                            } else {
                                var self = ($411 === "terminal_view");
                                if (self) {
                                    var _stt$14 = App$Playground$set_window$(App$Playground$Window$terminal, _state$3);
                                    var $433 = App$set_local$(_stt$14);
                                    var $432 = $433;
                                } else {
                                    var self = ($411 === "input_view");
                                    if (self) {
                                        var _stt$14 = App$Playground$set_window$(App$Playground$Window$input, _state$3);
                                        var $435 = App$set_local$(_stt$14);
                                        var $434 = $435;
                                    } else {
                                        var $436 = App$pass;
                                        var $434 = $436;
                                    };
                                    var $432 = $434;
                                };
                                var $420 = $432;
                            };
                            var $412 = $420;
                        };
                        var $396 = $412;
                        break;
                    case 'App.Event.input':
                        var $437 = self.id;
                        var $438 = self.text;
                        var self = ($437 === "input_code");
                        if (self) {
                            var $440 = App$set_local$(App$Playground$set_code$($438, _state$3));
                            var $439 = $440;
                        } else {
                            var $441 = App$pass;
                            var $439 = $441;
                        };
                        var $396 = $439;
                        break;
                    case 'App.Event.init':
                    case 'App.Event.mouse_down':
                    case 'App.Event.mouse_up':
                    case 'App.Event.key_down':
                    case 'App.Event.key_up':
                    case 'App.Event.mouse_move':
                        var $442 = App$pass;
                        var $396 = $442;
                        break;
                };
                var $391 = $396;
                break;
        };
        return $391;
    };
    const App$Playground$when = x0 => x1 => App$Playground$when$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $443 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $443;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$Playground = (() => {
        var _init$1 = App$Store$new$(App$Playground$State$local_empty, Unit$new);
        var _draw$2 = (_state$2 => {
            var $445 = App$playground$body$((() => {
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $446 = self.local;
                        var $447 = $446;
                        return $447;
                };
            })());
            return $445;
        });
        var _when$3 = App$Playground$when;
        var _tick$4 = (_tick$4 => _glob$5 => {
            var $448 = _glob$5;
            return $448;
        });
        var _post$5 = (_time$5 => _room$6 => _addr$7 => _data$8 => _glob$9 => {
            var $449 = _glob$9;
            return $449;
        });
        var $444 = App$new$(_init$1, _draw$2, _when$3, _tick$4, _post$5);
        return $444;
    })();
    return {
        'App.Store.new': App$Store$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.Playground.State': App$Playground$State,
        'App.Playground.State.local.new': App$Playground$State$local$new,
        'Device.big_desktop': Device$big_desktop,
        'App.Playground.Window.input': App$Playground$Window$input,
        'App.Playground.State.local_empty': App$Playground$State$local_empty,
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
        'List.cons': List$cons,
        'Pair': Pair,
        'List.nil': List$nil,
        'App.Playground.constant.light_gray_color': App$Playground$constant$light_gray_color,
        'App.Playground.constant.white_smoke': App$Playground$constant$white_smoke,
        'DOM.text': DOM$text,
        'Bool.and': Bool$and,
        'String.eql': String$eql,
        'Map': Map,
        'BBL.concat3': BBL$concat3,
        'BBL.split_ltn': BBL$split_ltn,
        'BBL.split_gtn': BBL$split_gtn,
        'BBL.union': BBL$union,
        'Map.union': Map$union,
        'App.Kind.constant.secondary_color': App$Kind$constant$secondary_color,
        'App.Playground.comp.btn': App$Playground$comp$btn,
        'App.Playground.comp.header': App$Playground$comp$header,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.Playground.comp.input': App$Playground$comp$input,
        'App.Playground.comp.output_area': App$Playground$comp$output_area,
        'App.Playground.comp.main_area': App$Playground$comp$main_area,
        'App.Playground.draw': App$Playground$draw,
        'App.playground.body': App$playground$body,
        'App.State.local': App$State$local,
        'IO': IO,
        'Maybe': Maybe,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Maybe.none': Maybe$none,
        'App.pass': App$pass,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'Device.phone': Device$phone,
        'Device.tablet': Device$tablet,
        'Device.desktop': Device$desktop,
        'Device.classify': Device$classify,
        'Maybe.some': Maybe$some,
        'App.set_local': App$set_local,
        'App.Playground.set_mouse_over': App$Playground$set_mouse_over,
        'App.Playground.Window.terminal': App$Playground$Window$terminal,
        'String.is_empty': String$is_empty,
        'App.Playground.set_output': App$Playground$set_output,
        'IO.request': IO$request,
        'App.Playground.set_window': App$Playground$set_window,
        'App.Playground.set_code': App$Playground$set_code,
        'App.Playground.when': App$Playground$when,
        'App.new': App$new,
        'App.Playground': App$Playground,
    };
})();

/***/ })

}]);
//# sourceMappingURL=737.index.js.map