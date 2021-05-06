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

    function Web$Playground$State$new$(_device$1, _window$2, _mouse_over$3, _code$4, _output$5) {
        var $33 = ({
            _: 'Web.Playground.State.new',
            'device': _device$1,
            'window': _window$2,
            'mouse_over': _mouse_over$3,
            'code': _code$4,
            'output': _output$5
        });
        return $33;
    };
    const Web$Playground$State$new = x0 => x1 => x2 => x3 => x4 => Web$Playground$State$new$(x0, x1, x2, x3, x4);
    const Device$big_desktop = ({
        _: 'Device.big_desktop'
    });
    const Web$Playground$Window$input = ({
        _: 'Web.Playground.Window.input'
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $34 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $34;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $35 = null;
        return $35;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $36 = null;
        return $36;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $37 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $37;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $38 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $38;
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
                var $40 = self.pred;
                var $41 = (Word$to_bits$($40) + '0');
                var $39 = $41;
                break;
            case 'Word.i':
                var $42 = self.pred;
                var $43 = (Word$to_bits$($42) + '1');
                var $39 = $43;
                break;
            case 'Word.e':
                var $44 = Bits$e;
                var $39 = $44;
                break;
        };
        return $39;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $45 = 1n + _pred$1;
        return $45;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $47 = Bits$e;
            var $46 = $47;
        } else {
            var $48 = self.charCodeAt(0);
            var $49 = self.slice(1);
            var $50 = (String$to_bits$($49) + (u16_to_bits($48)));
            var $46 = $50;
        };
        return $46;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $52 = self.head;
                var $53 = self.tail;
                var self = $52;
                switch (self._) {
                    case 'Pair.new':
                        var $55 = self.fst;
                        var $56 = self.snd;
                        var $57 = (bitsmap_set(String$to_bits$($55), $56, Map$from_list$($53), 'set'));
                        var $54 = $57;
                        break;
                };
                var $51 = $54;
                break;
            case 'List.nil':
                var $58 = BitsMap$new;
                var $51 = $58;
                break;
        };
        return $51;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $59 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $59;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $60 = null;
        return $60;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $61 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $61;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });
    const Web$Playground$constant$light_gray_color = "#E0E0E0";
    const Web$Playground$constant$white_smoke = "#F5F5F5";

    function DOM$text$(_value$1) {
        var $62 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $62;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const Bool$true = true;
    const Bool$false = false;
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $64 = Bool$false;
                var $63 = $64;
                break;
            case 'Cmp.eql':
                var $65 = Bool$true;
                var $63 = $65;
                break;
        };
        return $63;
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
                var $67 = self.pred;
                var $68 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $70 = self.pred;
                            var $71 = (_a$pred$10 => {
                                var $72 = Word$cmp$go$(_a$pred$10, $70, _c$4);
                                return $72;
                            });
                            var $69 = $71;
                            break;
                        case 'Word.i':
                            var $73 = self.pred;
                            var $74 = (_a$pred$10 => {
                                var $75 = Word$cmp$go$(_a$pred$10, $73, Cmp$ltn);
                                return $75;
                            });
                            var $69 = $74;
                            break;
                        case 'Word.e':
                            var $76 = (_a$pred$8 => {
                                var $77 = _c$4;
                                return $77;
                            });
                            var $69 = $76;
                            break;
                    };
                    var $69 = $69($67);
                    return $69;
                });
                var $66 = $68;
                break;
            case 'Word.i':
                var $78 = self.pred;
                var $79 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $81 = self.pred;
                            var $82 = (_a$pred$10 => {
                                var $83 = Word$cmp$go$(_a$pred$10, $81, Cmp$gtn);
                                return $83;
                            });
                            var $80 = $82;
                            break;
                        case 'Word.i':
                            var $84 = self.pred;
                            var $85 = (_a$pred$10 => {
                                var $86 = Word$cmp$go$(_a$pred$10, $84, _c$4);
                                return $86;
                            });
                            var $80 = $85;
                            break;
                        case 'Word.e':
                            var $87 = (_a$pred$8 => {
                                var $88 = _c$4;
                                return $88;
                            });
                            var $80 = $87;
                            break;
                    };
                    var $80 = $80($78);
                    return $80;
                });
                var $66 = $79;
                break;
            case 'Word.e':
                var $89 = (_b$5 => {
                    var $90 = _c$4;
                    return $90;
                });
                var $66 = $89;
                break;
        };
        var $66 = $66(_b$3);
        return $66;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $91 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $91;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $92 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $92;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);
    const Web$Kind$constant$secondary_color = "#3891A6";

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $94 = self.val;
                var $95 = self.lft;
                var $96 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $98 = self.val;
                        var $99 = self.lft;
                        var $100 = self.rgt;
                        var self = $94;
                        switch (self._) {
                            case 'Maybe.none':
                                var $102 = BitsMap$tie$($98, BitsMap$union$($95, $99), BitsMap$union$($96, $100));
                                var $101 = $102;
                                break;
                            case 'Maybe.some':
                                var $103 = BitsMap$tie$($94, BitsMap$union$($95, $99), BitsMap$union$($96, $100));
                                var $101 = $103;
                                break;
                        };
                        var $97 = $101;
                        break;
                    case 'BitsMap.new':
                        var $104 = _a$2;
                        var $97 = $104;
                        break;
                };
                var $93 = $97;
                break;
            case 'BitsMap.new':
                var $105 = _b$3;
                var $93 = $105;
                break;
        };
        return $93;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function Map$union$(_a$2, _b$3) {
        var $106 = BitsMap$union$(_a$2, _b$3);
        return $106;
    };
    const Map$union = x0 => x1 => Map$union$(x0, x1);

    function Web$Playground$comp$btn_run_code$(_mouse_over$1) {
        var _is_hover$2 = ("btn_run_code" === _mouse_over$1);
        var _normal$3 = Map$from_list$(List$cons$(Pair$new$("width", "50px"), List$cons$(Pair$new$("height", "25px"), List$cons$(Pair$new$("margin", "5px 0px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("border-radius", "4px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))))))))));
        var _hover$4 = Map$from_list$(List$cons$(Pair$new$("background-color", "#44B8D3"), List$nil));
        var $107 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "btn_run_code"), List$nil)), (() => {
            var self = _is_hover$2;
            if (self) {
                var $108 = Map$union$(_normal$3, _hover$4);
                return $108;
            } else {
                var $109 = _normal$3;
                return $109;
            };
        })(), List$cons$(DOM$text$("check"), List$nil));
        return $107;
    };
    const Web$Playground$comp$btn_run_code = x0 => Web$Playground$comp$btn_run_code$(x0);

    function Web$Playground$comp$header$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $111 = self.device;
                var $112 = self.window;
                var $113 = self.mouse_over;
                var _playground$7 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "input_view"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "35px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", (() => {
                    var self = $112;
                    switch (self._) {
                        case 'Web.Playground.Window.input':
                            var $115 = Web$Playground$constant$light_gray_color;
                            return $115;
                        case 'Web.Playground.Window.terminal':
                            var $116 = Web$Playground$constant$white_smoke;
                            return $116;
                    };
                })()), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("playground.kind"), List$nil));
                var _btn_run$8 = Web$Playground$comp$btn_run_code$($113);
                var self = $111;
                switch (self._) {
                    case 'Device.phone':
                        var _terminal$9 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "terminal_view"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "35px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", (() => {
                            var self = $112;
                            switch (self._) {
                                case 'Web.Playground.Window.input':
                                    var $118 = Web$Playground$constant$white_smoke;
                                    return $118;
                                case 'Web.Playground.Window.terminal':
                                    var $119 = Web$Playground$constant$light_gray_color;
                                    return $119;
                            };
                        })()), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("output"), List$nil));
                        var $117 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$nil)))), List$cons$(_playground$7, List$cons$(_terminal$9, List$nil))), List$cons$(_btn_run$8, List$nil)));
                        var $114 = $117;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $120 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))), List$cons$(_playground$7, List$cons$(_btn_run$8, List$nil)));
                        var $114 = $120;
                        break;
                };
                var $110 = $114;
                break;
        };
        return $110;
    };
    const Web$Playground$comp$header = x0 => Web$Playground$comp$header$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $121 = (String.fromCharCode(_head$1) + _tail$2);
        return $121;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Web$Playground$comp$input$(_code$1) {
        var $122 = DOM$node$("textarea", Map$from_list$(List$cons$(Pair$new$("id", "input_code"), List$cons$(Pair$new$("placeholder", "Write Kind code in this online editor and run it <3"), List$nil))), Map$from_list$(List$cons$(Pair$new$("cols", "100"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("border", ("solid 5px " + Web$Playground$constant$light_gray_color)), List$cons$(Pair$new$("resize", "none"), List$cons$(Pair$new$("padding", "10px"), List$nil)))))), List$cons$(DOM$text$(_code$1), List$nil));
        return $122;
    };
    const Web$Playground$comp$input = x0 => Web$Playground$comp$input$(x0);

    function Web$Playground$comp$output_area$(_output$1, _device$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("width", "400px"), List$cons$(Pair$new$("max-width", "500px"), List$cons$(Pair$new$("overflow", "auto"), List$cons$(Pair$new$("padding", "10px"), List$cons$(Pair$new$("background-color", Web$Playground$constant$light_gray_color), List$nil))))));
        var $123 = DOM$node$("div", Map$from_list$(List$nil), (() => {
            var self = _device$2;
            switch (self._) {
                case 'Device.phone':
                    var $124 = Map$union$(_style$3, Map$from_list$(List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin-top", "0px"), List$nil))));
                    return $124;
                case 'Device.tablet':
                case 'Device.desktop':
                case 'Device.big_desktop':
                    var $125 = Map$union$(_style$3, Map$from_list$(List$cons$(Pair$new$("height", "100% - 35px"), List$cons$(Pair$new$("margin-top", "35px"), List$nil))));
                    return $125;
            };
        })(), List$cons$(DOM$node$("pre", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(_output$1), List$nil)), List$nil));
        return $123;
    };
    const Web$Playground$comp$output_area = x0 => x1 => Web$Playground$comp$output_area$(x0, x1);

    function Web$Playground$comp$main_area$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $127 = self.device;
                var $128 = self.window;
                var $129 = self.code;
                var $130 = self.output;
                var self = $127;
                switch (self._) {
                    case 'Device.phone':
                        var $132 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$nil))))), List$cons$(Web$Playground$comp$header$(_stt$1), List$cons$((() => {
                            var self = $128;
                            switch (self._) {
                                case 'Web.Playground.Window.input':
                                    var $133 = Web$Playground$comp$input$($129);
                                    return $133;
                                case 'Web.Playground.Window.terminal':
                                    var $134 = Web$Playground$comp$output_area$($130, $127);
                                    return $134;
                            };
                        })(), List$nil)));
                        var $131 = $132;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $135 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("width", "60%"), List$nil)))), List$cons$(Web$Playground$comp$header$(_stt$1), List$cons$(Web$Playground$comp$input$($129), List$nil))), List$cons$(Web$Playground$comp$output_area$($130, $127), List$nil)));
                        var $131 = $135;
                        break;
                };
                var $126 = $131;
                break;
        };
        return $126;
    };
    const Web$Playground$comp$main_area = x0 => Web$Playground$comp$main_area$(x0);

    function Web$Playground$draw$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $137 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin", "20px 0x"), List$cons$(Pair$new$("display", "flex"), List$nil))))), List$cons$(Web$Playground$comp$main_area$(_stt$1), List$nil));
                var $136 = $137;
                break;
        };
        return $136;
    };
    const Web$Playground$draw = x0 => Web$Playground$draw$(x0);

    function Web$playground$body$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $139 = self.device;
                var self = $139;
                switch (self._) {
                    case 'Device.phone':
                        var $141 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "10px"), List$cons$(Pair$new$("height", "300px"), List$nil))), List$cons$(Web$Playground$draw$(_stt$1), List$nil));
                        var $140 = $141;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $142 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "100px"), List$cons$(Pair$new$("height", "500px"), List$nil))), List$cons$(Web$Playground$draw$(_stt$1), List$nil));
                        var $140 = $142;
                        break;
                };
                var $138 = $140;
                break;
        };
        return $138;
    };
    const Web$playground$body = x0 => Web$playground$body$(x0);

    function IO$(_A$1) {
        var $143 = null;
        return $143;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $144 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $144;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $146 = self.value;
                var $147 = _f$4($146);
                var $145 = $147;
                break;
            case 'IO.ask':
                var $148 = self.query;
                var $149 = self.param;
                var $150 = self.then;
                var $151 = IO$ask$($148, $149, (_x$8 => {
                    var $152 = IO$bind$($150(_x$8), _f$4);
                    return $152;
                }));
                var $145 = $151;
                break;
        };
        return $145;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $153 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $153;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $154 = _new$2(IO$bind)(IO$end);
        return $154;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $155 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $155;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $156 = _m$pure$2;
        return $156;
    }))(Dynamic$new$(Unit$new));

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $158 = Bool$true;
                var $157 = $158;
                break;
            case 'Cmp.gtn':
                var $159 = Bool$false;
                var $157 = $159;
                break;
        };
        return $157;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $160 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $160;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function U32$new$(_value$1) {
        var $161 = word_to_u32(_value$1);
        return $161;
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
                    var $162 = _x$4;
                    return $162;
                } else {
                    var $163 = (self - 1n);
                    var $164 = Nat$apply$($163, _f$3, _f$3(_x$4));
                    return $164;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $165 = null;
        return $165;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $166 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $166;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $167 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $167;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $169 = self.pred;
                var $170 = Word$i$($169);
                var $168 = $170;
                break;
            case 'Word.i':
                var $171 = self.pred;
                var $172 = Word$o$(Word$inc$($171));
                var $168 = $172;
                break;
            case 'Word.e':
                var $173 = Word$e;
                var $168 = $173;
                break;
        };
        return $168;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $175 = Word$e;
            var $174 = $175;
        } else {
            var $176 = (self - 1n);
            var $177 = Word$o$(Word$zero$($176));
            var $174 = $177;
        };
        return $174;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $178 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $178;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);
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
            var $180 = Device$phone;
            var $179 = $180;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $182 = Device$tablet;
                var $181 = $182;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $184 = Device$desktop;
                    var $183 = $184;
                } else {
                    var $185 = Device$big_desktop;
                    var $183 = $185;
                };
                var $181 = $183;
            };
            var $179 = $181;
        };
        return $179;
    };
    const Device$classify = x0 => Device$classify$(x0);

    function App$store$(_value$2) {
        var $186 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $187 = _m$pure$4;
            return $187;
        }))(Dynamic$new$(_value$2));
        return $186;
    };
    const App$store = x0 => App$store$(x0);

    function Web$Playground$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $189 = self.device;
                var $190 = self.window;
                var $191 = self.code;
                var $192 = self.output;
                var $193 = Web$Playground$State$new$($189, $190, _id$1, $191, $192);
                var $188 = $193;
                break;
        };
        return $188;
    };
    const Web$Playground$set_mouse_over = x0 => x1 => Web$Playground$set_mouse_over$(x0, x1);
    const Web$Playground$Window$terminal = ({
        _: 'Web.Playground.Window.terminal'
    });

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $195 = Bool$true;
            var $194 = $195;
        } else {
            var $196 = self.charCodeAt(0);
            var $197 = self.slice(1);
            var $198 = Bool$false;
            var $194 = $198;
        };
        return $194;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function IO$request$(_url$1) {
        var $199 = IO$ask$("request", _url$1, (_text$2 => {
            var $200 = IO$end$(_text$2);
            return $200;
        }));
        return $199;
    };
    const IO$request = x0 => IO$request$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $201 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $201;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Playground = (() => {
        var _init$1 = Web$Playground$State$new$(Device$big_desktop, Web$Playground$Window$input, "", "", "");
        var _draw$2 = (_state$2 => {
            var $203 = Web$playground$body$(_state$2);
            return $203;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _state$4;
            switch (self._) {
                case 'Web.Playground.State.new':
                    var $205 = self.device;
                    var $206 = self.window;
                    var $207 = self.mouse_over;
                    var $208 = self.code;
                    var $209 = self.output;
                    var self = _event$3;
                    switch (self._) {
                        case 'App.Event.tick':
                            var $211 = self.info;
                            var self = $211;
                            switch (self._) {
                                case 'App.EnvInfo.new':
                                    var $213 = self.screen_size;
                                    var self = $213;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $215 = self.fst;
                                            var _device$16 = Device$classify$($215);
                                            var $216 = App$store$(Web$Playground$State$new$(_device$16, $206, $207, $208, $209));
                                            var $214 = $216;
                                            break;
                                    };
                                    var $212 = $214;
                                    break;
                            };
                            var $210 = $212;
                            break;
                        case 'App.Event.mouse_over':
                            var $217 = self.id;
                            var $218 = App$store$(Web$Playground$set_mouse_over$($217, _state$4));
                            var $210 = $218;
                            break;
                        case 'App.Event.mouse_click':
                            var $219 = self.id;
                            var self = ($219 === "btn_run_code");
                            if (self) {
                                var self = $205;
                                switch (self._) {
                                    case 'Device.phone':
                                        var $222 = Web$Playground$Window$terminal;
                                        var _window$13 = $222;
                                        break;
                                    case 'Device.tablet':
                                    case 'Device.desktop':
                                    case 'Device.big_desktop':
                                        var $223 = Web$Playground$Window$input;
                                        var _window$13 = $223;
                                        break;
                                };
                                var self = String$is_empty$($208);
                                if (self) {
                                    var $224 = App$store$(Web$Playground$State$new$($205, _window$13, $207, $208, "How can I type check an empty code? haha"));
                                    var $221 = $224;
                                } else {
                                    var $225 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                        var $226 = _m$bind$14;
                                        return $226;
                                    }))(IO$request$(("http://localhost:3030/api/check_term?code=" + $208)))((_checked$14 => {
                                        var $227 = App$store$(Web$Playground$State$new$($205, _window$13, $207, $208, _checked$14));
                                        return $227;
                                    }));
                                    var $221 = $225;
                                };
                                var $220 = $221;
                            } else {
                                var self = ($219 === "terminal_view");
                                if (self) {
                                    var $229 = App$store$(Web$Playground$State$new$($205, Web$Playground$Window$terminal, $207, $208, $209));
                                    var $228 = $229;
                                } else {
                                    var self = ($219 === "input_view");
                                    if (self) {
                                        var $231 = App$store$(Web$Playground$State$new$($205, Web$Playground$Window$input, $207, $208, $209));
                                        var $230 = $231;
                                    } else {
                                        var $232 = App$pass;
                                        var $230 = $232;
                                    };
                                    var $228 = $230;
                                };
                                var $220 = $228;
                            };
                            var $210 = $220;
                            break;
                        case 'App.Event.input':
                            var $233 = self.id;
                            var $234 = self.text;
                            var self = ($233 === "input_code");
                            if (self) {
                                var $236 = App$store$(Web$Playground$State$new$($205, $206, $207, $234, $209));
                                var $235 = $236;
                            } else {
                                var $237 = App$pass;
                                var $235 = $237;
                            };
                            var $210 = $235;
                            break;
                        case 'App.Event.init':
                        case 'App.Event.mouse_down':
                        case 'App.Event.mouse_up':
                        case 'App.Event.key_down':
                        case 'App.Event.key_up':
                        case 'App.Event.post':
                            var $238 = App$pass;
                            var $210 = $238;
                            break;
                    };
                    var $204 = $210;
                    break;
            };
            return $204;
        });
        var $202 = App$new$(_init$1, _draw$2, _when$3);
        return $202;
    })();
    return {
        'Web.Playground.State.new': Web$Playground$State$new,
        'Device.big_desktop': Device$big_desktop,
        'Web.Playground.Window.input': Web$Playground$Window$input,
        'DOM.node': DOM$node,
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
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List.cons': List$cons,
        'Pair': Pair,
        'Pair.new': Pair$new,
        'List.nil': List$nil,
        'Web.Playground.constant.light_gray_color': Web$Playground$constant$light_gray_color,
        'Web.Playground.constant.white_smoke': Web$Playground$constant$white_smoke,
        'DOM.text': DOM$text,
        'Bool.true': Bool$true,
        'Bool.false': Bool$false,
        'Bool.and': Bool$and,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
        'Web.Kind.constant.secondary_color': Web$Kind$constant$secondary_color,
        'BitsMap.union': BitsMap$union,
        'Map.union': Map$union,
        'Web.Playground.comp.btn_run_code': Web$Playground$comp$btn_run_code,
        'Web.Playground.comp.header': Web$Playground$comp$header,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Web.Playground.comp.input': Web$Playground$comp$input,
        'Web.Playground.comp.output_area': Web$Playground$comp$output_area,
        'Web.Playground.comp.main_area': Web$Playground$comp$main_area,
        'Web.Playground.draw': Web$Playground$draw,
        'Web.playground.body': Web$playground$body,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'Unit.new': Unit$new,
        'App.pass': App$pass,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
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
        'Device.phone': Device$phone,
        'Device.tablet': Device$tablet,
        'Device.desktop': Device$desktop,
        'Device.classify': Device$classify,
        'App.store': App$store,
        'Web.Playground.set_mouse_over': Web$Playground$set_mouse_over,
        'Web.Playground.Window.terminal': Web$Playground$Window$terminal,
        'String.is_empty': String$is_empty,
        'IO.request': IO$request,
        'App.new': App$new,
        'Web.Playground': Web$Playground,
    };
})();