(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[791],{

/***/ 791:
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
    const Web$Kind$constant$secondary_color = "#3891A6";

    function Web$Playground$comp$btn_run_code$(_mouse_over$1) {
        var _is_hover$2 = ("btn_run_code" === _mouse_over$1);
        var _normal$3 = Map$from_list$(List$cons$(Pair$new$("width", "50px"), List$cons$(Pair$new$("height", "25px"), List$cons$(Pair$new$("margin", "5px 0px"), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("border-radius", "4px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil))))))))))));
        var $107 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "btn_run_code"), List$nil)), (() => {
            var self = _is_hover$2;
            if (self) {
                var $108 = Map$union$(_normal$3, Map$from_list$(List$cons$(Pair$new$("background-color", "#44B8D3"), List$nil)));
                return $108;
            } else {
                var $109 = Map$union$(_normal$3, Map$from_list$(List$cons$(Pair$new$("background-color", Web$Kind$constant$secondary_color), List$nil)));
                return $109;
            };
        })(), List$cons$(DOM$text$("check"), List$nil));
        return $107;
    };
    const Web$Playground$comp$btn_run_code = x0 => Web$Playground$comp$btn_run_code$(x0);

    function Web$Playground$comp$header$(_device$1, _mouse_over$2, _window$3) {
        var _playground$4 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "input_view"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "35px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", (() => {
            var self = _window$3;
            switch (self._) {
                case 'Web.Playground.Window.input':
                    var $111 = Web$Playground$constant$light_gray_color;
                    return $111;
                case 'Web.Playground.Window.terminal':
                    var $112 = Web$Playground$constant$white_smoke;
                    return $112;
            };
        })()), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("playground.kind"), List$nil));
        var _btn_run$5 = Web$Playground$comp$btn_run_code$(_mouse_over$2);
        var _style_header$6 = Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))));
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var _terminal$7 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "terminal_view"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "35px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", (() => {
                    var self = _window$3;
                    switch (self._) {
                        case 'Web.Playground.Window.input':
                            var $114 = Web$Playground$constant$white_smoke;
                            return $114;
                        case 'Web.Playground.Window.terminal':
                            var $115 = Web$Playground$constant$light_gray_color;
                            return $115;
                    };
                })()), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("output"), List$nil));
                var $113 = DOM$node$("div", Map$from_list$(List$nil), _style_header$6, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$nil)))), List$cons$(_playground$4, List$cons$(_terminal$7, List$nil))), List$cons$(_btn_run$5, List$nil)));
                var $110 = $113;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $116 = DOM$node$("div", Map$from_list$(List$nil), _style_header$6, List$cons$(_playground$4, List$cons$(_btn_run$5, List$nil)));
                var $110 = $116;
                break;
        };
        return $110;
    };
    const Web$Playground$comp$header = x0 => x1 => x2 => Web$Playground$comp$header$(x0, x1, x2);

    function String$cons$(_head$1, _tail$2) {
        var $117 = (String.fromCharCode(_head$1) + _tail$2);
        return $117;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Web$Playground$comp$input$(_code$1) {
        var $118 = DOM$node$("textarea", Map$from_list$(List$cons$(Pair$new$("id", "input_code"), List$cons$(Pair$new$("placeholder", "Write Kind code in this online editor and run it <3"), List$nil))), Map$from_list$(List$cons$(Pair$new$("cols", "100"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("border", ("solid 5px " + Web$Playground$constant$light_gray_color)), List$cons$(Pair$new$("resize", "none"), List$cons$(Pair$new$("padding", "10px"), List$nil)))))), List$cons$(DOM$text$(_code$1), List$nil));
        return $118;
    };
    const Web$Playground$comp$input = x0 => Web$Playground$comp$input$(x0);

    function Web$Playground$comp$output_area$(_output$1, _device$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("width", "400px"), List$cons$(Pair$new$("max-width", "500px"), List$cons$(Pair$new$("overflow", "auto"), List$cons$(Pair$new$("padding", "10px"), List$cons$(Pair$new$("background-color", Web$Playground$constant$light_gray_color), List$nil))))));
        var $119 = DOM$node$("div", Map$from_list$(List$nil), (() => {
            var self = _device$2;
            switch (self._) {
                case 'Device.phone':
                    var $120 = Map$union$(_style$3, Map$from_list$(List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin-top", "0px"), List$nil))));
                    return $120;
                case 'Device.tablet':
                case 'Device.desktop':
                case 'Device.big_desktop':
                    var $121 = Map$union$(_style$3, Map$from_list$(List$cons$(Pair$new$("height", "100% - 35px"), List$cons$(Pair$new$("margin-top", "35px"), List$nil))));
                    return $121;
            };
        })(), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("kind-lang@1.0.51"), List$nil)), List$cons$(DOM$node$("pre", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$nil)), List$cons$(DOM$text$(_output$1), List$nil)), List$nil)));
        return $119;
    };
    const Web$Playground$comp$output_area = x0 => x1 => Web$Playground$comp$output_area$(x0, x1);

    function Web$Playground$comp$main_area$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $123 = self.device;
                var $124 = self.window;
                var $125 = self.mouse_over;
                var $126 = self.code;
                var $127 = self.output;
                var _header$7 = Web$Playground$comp$header$($123, $125, $124);
                var _input_view$8 = Web$Playground$comp$input$($126);
                var _output_view$9 = Web$Playground$comp$output_area$($127, $123);
                var self = $123;
                switch (self._) {
                    case 'Device.phone':
                        var $129 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$nil))))), List$cons$(_header$7, List$cons$((() => {
                            var self = $124;
                            switch (self._) {
                                case 'Web.Playground.Window.input':
                                    var $130 = _input_view$8;
                                    return $130;
                                case 'Web.Playground.Window.terminal':
                                    var $131 = _output_view$9;
                                    return $131;
                            };
                        })(), List$nil)));
                        var $128 = $129;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $132 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("width", "60%"), List$nil)))), List$cons$(_header$7, List$cons$(_input_view$8, List$nil))), List$cons$(_output_view$9, List$nil)));
                        var $128 = $132;
                        break;
                };
                var $122 = $128;
                break;
        };
        return $122;
    };
    const Web$Playground$comp$main_area = x0 => Web$Playground$comp$main_area$(x0);

    function Web$Playground$draw$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $134 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin", "20px 0x"), List$cons$(Pair$new$("display", "flex"), List$nil))))), List$cons$(Web$Playground$comp$main_area$(_stt$1), List$nil));
                var $133 = $134;
                break;
        };
        return $133;
    };
    const Web$Playground$draw = x0 => Web$Playground$draw$(x0);

    function Web$playground$body$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $136 = self.device;
                var self = $136;
                switch (self._) {
                    case 'Device.phone':
                        var $138 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "10px"), List$cons$(Pair$new$("height", "300px"), List$nil))), List$cons$(Web$Playground$draw$(_stt$1), List$nil));
                        var $137 = $138;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $139 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "100px"), List$cons$(Pair$new$("height", "500px"), List$nil))), List$cons$(Web$Playground$draw$(_stt$1), List$nil));
                        var $137 = $139;
                        break;
                };
                var $135 = $137;
                break;
        };
        return $135;
    };
    const Web$playground$body = x0 => Web$playground$body$(x0);

    function IO$(_A$1) {
        var $140 = null;
        return $140;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $141 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $141;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $143 = self.value;
                var $144 = _f$4($143);
                var $142 = $144;
                break;
            case 'IO.ask':
                var $145 = self.query;
                var $146 = self.param;
                var $147 = self.then;
                var $148 = IO$ask$($145, $146, (_x$8 => {
                    var $149 = IO$bind$($147(_x$8), _f$4);
                    return $149;
                }));
                var $142 = $148;
                break;
        };
        return $142;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $150 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $150;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $151 = _new$2(IO$bind)(IO$end);
        return $151;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $152 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $152;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $153 = _m$pure$2;
        return $153;
    }))(Dynamic$new$(Unit$new));

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $155 = Bool$true;
                var $154 = $155;
                break;
            case 'Cmp.gtn':
                var $156 = Bool$false;
                var $154 = $156;
                break;
        };
        return $154;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $157 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $157;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function U32$new$(_value$1) {
        var $158 = word_to_u32(_value$1);
        return $158;
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
                    var $159 = _x$4;
                    return $159;
                } else {
                    var $160 = (self - 1n);
                    var $161 = Nat$apply$($160, _f$3, _f$3(_x$4));
                    return $161;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $162 = null;
        return $162;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $163 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $163;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $164 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $164;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $166 = self.pred;
                var $167 = Word$i$($166);
                var $165 = $167;
                break;
            case 'Word.i':
                var $168 = self.pred;
                var $169 = Word$o$(Word$inc$($168));
                var $165 = $169;
                break;
            case 'Word.e':
                var $170 = Word$e;
                var $165 = $170;
                break;
        };
        return $165;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $172 = Word$e;
            var $171 = $172;
        } else {
            var $173 = (self - 1n);
            var $174 = Word$o$(Word$zero$($173));
            var $171 = $174;
        };
        return $171;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $175 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $175;
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
            var $177 = Device$phone;
            var $176 = $177;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $179 = Device$tablet;
                var $178 = $179;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $181 = Device$desktop;
                    var $180 = $181;
                } else {
                    var $182 = Device$big_desktop;
                    var $180 = $182;
                };
                var $178 = $180;
            };
            var $176 = $178;
        };
        return $176;
    };
    const Device$classify = x0 => Device$classify$(x0);

    function App$store$(_value$2) {
        var $183 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $184 = _m$pure$4;
            return $184;
        }))(Dynamic$new$(_value$2));
        return $183;
    };
    const App$store = x0 => App$store$(x0);

    function Web$Playground$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $186 = self.device;
                var $187 = self.window;
                var $188 = self.code;
                var $189 = self.output;
                var $190 = Web$Playground$State$new$($186, $187, _id$1, $188, $189);
                var $185 = $190;
                break;
        };
        return $185;
    };
    const Web$Playground$set_mouse_over = x0 => x1 => Web$Playground$set_mouse_over$(x0, x1);
    const Web$Playground$Window$terminal = ({
        _: 'Web.Playground.Window.terminal'
    });

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $192 = Bool$true;
            var $191 = $192;
        } else {
            var $193 = self.charCodeAt(0);
            var $194 = self.slice(1);
            var $195 = Bool$false;
            var $191 = $195;
        };
        return $191;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function IO$request$(_url$1) {
        var $196 = IO$ask$("request", _url$1, (_text$2 => {
            var $197 = IO$end$(_text$2);
            return $197;
        }));
        return $196;
    };
    const IO$request = x0 => IO$request$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $198 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $198;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Playground = (() => {
        var _init$1 = Web$Playground$State$new$(Device$big_desktop, Web$Playground$Window$input, "", "", "");
        var _draw$2 = (_state$2 => {
            var $200 = Web$playground$body$(_state$2);
            return $200;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _state$4;
            switch (self._) {
                case 'Web.Playground.State.new':
                    var $202 = self.device;
                    var $203 = self.window;
                    var $204 = self.mouse_over;
                    var $205 = self.code;
                    var $206 = self.output;
                    var self = _event$3;
                    switch (self._) {
                        case 'App.Event.tick':
                            var $208 = self.info;
                            var self = $208;
                            switch (self._) {
                                case 'App.EnvInfo.new':
                                    var $210 = self.screen_size;
                                    var self = $210;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $212 = self.fst;
                                            var _device$16 = Device$classify$($212);
                                            var $213 = App$store$(Web$Playground$State$new$(_device$16, $203, $204, $205, $206));
                                            var $211 = $213;
                                            break;
                                    };
                                    var $209 = $211;
                                    break;
                            };
                            var $207 = $209;
                            break;
                        case 'App.Event.mouse_over':
                            var $214 = self.id;
                            var $215 = App$store$(Web$Playground$set_mouse_over$($214, _state$4));
                            var $207 = $215;
                            break;
                        case 'App.Event.mouse_click':
                            var $216 = self.id;
                            var self = ($216 === "btn_run_code");
                            if (self) {
                                var self = $202;
                                switch (self._) {
                                    case 'Device.phone':
                                        var $219 = Web$Playground$Window$terminal;
                                        var _window$13 = $219;
                                        break;
                                    case 'Device.tablet':
                                    case 'Device.desktop':
                                    case 'Device.big_desktop':
                                        var $220 = Web$Playground$Window$input;
                                        var _window$13 = $220;
                                        break;
                                };
                                var self = String$is_empty$($205);
                                if (self) {
                                    var $221 = App$store$(Web$Playground$State$new$($202, _window$13, $204, $205, "How can I type check an empty code? haha"));
                                    var $218 = $221;
                                } else {
                                    var $222 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                        var $223 = _m$bind$14;
                                        return $223;
                                    }))(IO$request$(("http://18.222.191.174:3030/api/check_term?code=" + $205)))((_checked$14 => {
                                        var $224 = App$store$(Web$Playground$State$new$($202, _window$13, $204, $205, _checked$14));
                                        return $224;
                                    }));
                                    var $218 = $222;
                                };
                                var $217 = $218;
                            } else {
                                var self = ($216 === "terminal_view");
                                if (self) {
                                    var $226 = App$store$(Web$Playground$State$new$($202, Web$Playground$Window$terminal, $204, $205, $206));
                                    var $225 = $226;
                                } else {
                                    var self = ($216 === "input_view");
                                    if (self) {
                                        var $228 = App$store$(Web$Playground$State$new$($202, Web$Playground$Window$input, $204, $205, $206));
                                        var $227 = $228;
                                    } else {
                                        var $229 = App$pass;
                                        var $227 = $229;
                                    };
                                    var $225 = $227;
                                };
                                var $217 = $225;
                            };
                            var $207 = $217;
                            break;
                        case 'App.Event.input':
                            var $230 = self.id;
                            var $231 = self.text;
                            var self = ($230 === "input_code");
                            if (self) {
                                var $233 = App$store$(Web$Playground$State$new$($202, $203, $204, $231, $206));
                                var $232 = $233;
                            } else {
                                var $234 = App$pass;
                                var $232 = $234;
                            };
                            var $207 = $232;
                            break;
                        case 'App.Event.init':
                        case 'App.Event.mouse_down':
                        case 'App.Event.mouse_up':
                        case 'App.Event.key_down':
                        case 'App.Event.key_up':
                        case 'App.Event.post':
                            var $235 = App$pass;
                            var $207 = $235;
                            break;
                    };
                    var $201 = $207;
                    break;
            };
            return $201;
        });
        var $199 = App$new$(_init$1, _draw$2, _when$3);
        return $199;
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
        'BitsMap.union': BitsMap$union,
        'Map.union': Map$union,
        'Web.Kind.constant.secondary_color': Web$Kind$constant$secondary_color,
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

/***/ })

}]);
//# sourceMappingURL=791.index.js.map