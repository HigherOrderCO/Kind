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

    function Web$Playground$State$new$(_device$1, _window$2, _mouse_over$3, _code$4) {
        var $33 = ({
            _: 'Web.Playground.State.new',
            'device': _device$1,
            'window': _window$2,
            'mouse_over': _mouse_over$3,
            'code': _code$4
        });
        return $33;
    };
    const Web$Playground$State$new = x0 => x1 => x2 => x3 => Web$Playground$State$new$(x0, x1, x2, x3);
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
    const Web$Playground$constant$light_gray_color = "#F3F4F7";

    function DOM$text$(_value$1) {
        var $62 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $62;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const Web$Kind$constant$secondary_color = "#3891A6";

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $64 = self.val;
                var $65 = self.lft;
                var $66 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $68 = self.val;
                        var $69 = self.lft;
                        var $70 = self.rgt;
                        var self = $64;
                        switch (self._) {
                            case 'Maybe.none':
                                var $72 = BitsMap$tie$($68, BitsMap$union$($65, $69), BitsMap$union$($66, $70));
                                var $71 = $72;
                                break;
                            case 'Maybe.some':
                                var $73 = BitsMap$tie$($64, BitsMap$union$($65, $69), BitsMap$union$($66, $70));
                                var $71 = $73;
                                break;
                        };
                        var $67 = $71;
                        break;
                    case 'BitsMap.new':
                        var $74 = _a$2;
                        var $67 = $74;
                        break;
                };
                var $63 = $67;
                break;
            case 'BitsMap.new':
                var $75 = _b$3;
                var $63 = $75;
                break;
        };
        return $63;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function Map$union$(_a$2, _b$3) {
        var $76 = BitsMap$union$(_a$2, _b$3);
        return $76;
    };
    const Map$union = x0 => x1 => Map$union$(x0, x1);

    function Web$Playground$comp$btn_run_code$(_is_hover$1, _title$2, _id$3) {
        var _normal$4 = Map$from_list$(List$cons$(Pair$new$("width", "40px"), List$cons$(Pair$new$("height", "20px"), List$cons$(Pair$new$("margin", "5px 0px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("border-radius", "4px"), List$nil)))))))));
        var _hover$5 = Map$from_list$(List$cons$(Pair$new$("background-color", "#44B8D3"), List$nil));
        var $77 = DOM$node$("input", Map$from_list$(List$cons$(Pair$new$("id", _id$3), List$cons$(Pair$new$("type", "submit"), List$cons$(Pair$new$("value", ">"), List$nil)))), (() => {
            var self = _is_hover$1;
            if (self) {
                var $78 = Map$union$(_normal$4, _hover$5);
                return $78;
            } else {
                var $79 = _normal$4;
                return $79;
            };
        })(), List$nil);
        return $77;
    };
    const Web$Playground$comp$btn_run_code = x0 => x1 => x2 => Web$Playground$comp$btn_run_code$(x0, x1, x2);
    const Bool$false = false;

    function Web$Playground$comp$header$(_stt$1) {
        var _tab$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "30px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", Web$Playground$constant$light_gray_color), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("playground.kind"), List$nil));
        var _title$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "18px"), List$nil)), List$cons$(DOM$text$("KIND Playground"), List$nil));
        var _btn_run$4 = Web$Playground$comp$btn_run_code$(Bool$false, ">", "btn_run_code");
        var $80 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))), List$cons$(_tab$2, List$cons$(_btn_run$4, List$nil)));
        return $80;
    };
    const Web$Playground$comp$header = x0 => Web$Playground$comp$header$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $81 = (String.fromCharCode(_head$1) + _tail$2);
        return $81;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Web$Playground$comp$input$(_code$1) {
        var $82 = DOM$node$("textarea", Map$from_list$(List$cons$(Pair$new$("id", "input_code"), List$cons$(Pair$new$("placeholder", "Write Kind code in this online editor and run it <3"), List$nil))), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("border", ("solid 5px " + Web$Playground$constant$light_gray_color)), List$cons$(Pair$new$("resize", "none"), List$cons$(Pair$new$("padding", "10px"), List$nil)))))), List$cons$(DOM$text$(_code$1), List$nil));
        return $82;
    };
    const Web$Playground$comp$input = x0 => Web$Playground$comp$input$(x0);

    function Web$Playground$comp$main_area$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $84 = self.code;
                var $85 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$nil))))), List$cons$(DOM$node$("form", Map$from_list$(List$cons$(Pair$new$("id", "code_input"), List$cons$(Pair$new$("method", "get"), List$cons$(Pair$new$("action", "http://localhost/api/lib"), List$nil)))), Map$from_list$(List$cons$(Pair$new$("height", "100%"), List$nil)), List$cons$(Web$Playground$comp$header$(_stt$1), List$cons$(Web$Playground$comp$input$($84), List$nil))), List$nil));
                var $83 = $85;
                break;
        };
        return $83;
    };
    const Web$Playground$comp$main_area = x0 => Web$Playground$comp$main_area$(x0);

    function Web$Playground$draw$(_stt$1) {
        var $86 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin", "20px 0x"), List$nil)))), List$cons$(Web$Playground$comp$main_area$(_stt$1), List$nil));
        return $86;
    };
    const Web$Playground$draw = x0 => Web$Playground$draw$(x0);

    function Web$playground$body$(_stt$1) {
        var $87 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "100px"), List$cons$(Pair$new$("height", "500px"), List$nil))), List$cons$(Web$Playground$draw$(_stt$1), List$nil));
        return $87;
    };
    const Web$playground$body = x0 => Web$playground$body$(x0);

    function IO$(_A$1) {
        var $88 = null;
        return $88;
    };
    const IO = x0 => IO$(x0);
    const Bool$true = true;

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $90 = Bool$true;
                var $89 = $90;
                break;
            case 'Cmp.gtn':
                var $91 = Bool$false;
                var $89 = $91;
                break;
        };
        return $89;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);
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
                var $93 = self.pred;
                var $94 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $96 = self.pred;
                            var $97 = (_a$pred$10 => {
                                var $98 = Word$cmp$go$(_a$pred$10, $96, _c$4);
                                return $98;
                            });
                            var $95 = $97;
                            break;
                        case 'Word.i':
                            var $99 = self.pred;
                            var $100 = (_a$pred$10 => {
                                var $101 = Word$cmp$go$(_a$pred$10, $99, Cmp$ltn);
                                return $101;
                            });
                            var $95 = $100;
                            break;
                        case 'Word.e':
                            var $102 = (_a$pred$8 => {
                                var $103 = _c$4;
                                return $103;
                            });
                            var $95 = $102;
                            break;
                    };
                    var $95 = $95($93);
                    return $95;
                });
                var $92 = $94;
                break;
            case 'Word.i':
                var $104 = self.pred;
                var $105 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $107 = self.pred;
                            var $108 = (_a$pred$10 => {
                                var $109 = Word$cmp$go$(_a$pred$10, $107, Cmp$gtn);
                                return $109;
                            });
                            var $106 = $108;
                            break;
                        case 'Word.i':
                            var $110 = self.pred;
                            var $111 = (_a$pred$10 => {
                                var $112 = Word$cmp$go$(_a$pred$10, $110, _c$4);
                                return $112;
                            });
                            var $106 = $111;
                            break;
                        case 'Word.e':
                            var $113 = (_a$pred$8 => {
                                var $114 = _c$4;
                                return $114;
                            });
                            var $106 = $113;
                            break;
                    };
                    var $106 = $106($104);
                    return $106;
                });
                var $92 = $105;
                break;
            case 'Word.e':
                var $115 = (_b$5 => {
                    var $116 = _c$4;
                    return $116;
                });
                var $92 = $115;
                break;
        };
        var $92 = $92(_b$3);
        return $92;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $117 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $117;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$lte$(_a$2, _b$3) {
        var $118 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $118;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function U32$new$(_value$1) {
        var $119 = word_to_u32(_value$1);
        return $119;
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
                    var $120 = _x$4;
                    return $120;
                } else {
                    var $121 = (self - 1n);
                    var $122 = Nat$apply$($121, _f$3, _f$3(_x$4));
                    return $122;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $123 = null;
        return $123;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $124 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $124;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $125 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $125;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $127 = self.pred;
                var $128 = Word$i$($127);
                var $126 = $128;
                break;
            case 'Word.i':
                var $129 = self.pred;
                var $130 = Word$o$(Word$inc$($129));
                var $126 = $130;
                break;
            case 'Word.e':
                var $131 = Word$e;
                var $126 = $131;
                break;
        };
        return $126;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $133 = Word$e;
            var $132 = $133;
        } else {
            var $134 = (self - 1n);
            var $135 = Word$o$(Word$zero$($134));
            var $132 = $135;
        };
        return $132;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $136 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $136;
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
            var $138 = Device$phone;
            var $137 = $138;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $140 = Device$tablet;
                var $139 = $140;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $142 = Device$desktop;
                    var $141 = $142;
                } else {
                    var $143 = Device$big_desktop;
                    var $141 = $143;
                };
                var $139 = $141;
            };
            var $137 = $139;
        };
        return $137;
    };
    const Device$classify = x0 => Device$classify$(x0);

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

    function App$store$(_value$2) {
        var $156 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $157 = _m$pure$4;
            return $157;
        }))(Dynamic$new$(_value$2));
        return $156;
    };
    const App$store = x0 => App$store$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $158 = _m$pure$2;
        return $158;
    }))(Dynamic$new$(Unit$new));

    function Web$Playground$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $160 = self.device;
                var $161 = self.window;
                var $162 = self.code;
                var $163 = Web$Playground$State$new$($160, $161, _id$1, $162);
                var $159 = $163;
                break;
        };
        return $159;
    };
    const Web$Playground$set_mouse_over = x0 => x1 => Web$Playground$set_mouse_over$(x0, x1);
    const Web$Playground$Event$check_terms = ({
        _: 'Web.Playground.Event.check_terms'
    });
    const Web$Playground$Event$run_code = ({
        _: 'Web.Playground.Event.run_code'
    });
    const Web$Playground$Event$display_output = ({
        _: 'Web.Playground.Event.display_output'
    });
    const Web$Playground$Actions = Map$from_list$(List$cons$(Pair$new$("btn_check_terms", Web$Playground$Event$check_terms), List$cons$(Pair$new$("btn_run_code", Web$Playground$Event$run_code), List$cons$(Pair$new$("display_output", Web$Playground$Event$display_output), List$nil))));

    function Maybe$(_A$1) {
        var $164 = null;
        return $164;
    };
    const Maybe = x0 => Maybe$(x0);
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));

    function Map$get$(_key$2, _map$3) {
        var $165 = (bitsmap_get(String$to_bits$(_key$2), _map$3));
        return $165;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Web$Playground$exe_event$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Playground.State.new':
                var _actions$7 = Web$Playground$Actions;
                var self = Map$get$(_id$1, _actions$7);
                switch (self._) {
                    case 'Maybe.none':
                    case 'Maybe.some':
                        var $168 = _stt$2;
                        var $167 = $168;
                        break;
                };
                var $166 = $167;
                break;
        };
        return $166;
    };
    const Web$Playground$exe_event = x0 => x1 => Web$Playground$exe_event$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $169 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $169;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Playground = (() => {
        var _init$1 = Web$Playground$State$new$(Device$big_desktop, Web$Playground$Window$input, "", "");
        var _draw$2 = (_state$2 => {
            var $171 = Web$playground$body$(_state$2);
            return $171;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.init':
                    var $173 = self.info;
                    var self = $173;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $175 = self.screen_size;
                            var self = $175;
                            switch (self._) {
                                case 'Pair.new':
                                    var $177 = self.fst;
                                    var _device$12 = Device$classify$($177);
                                    var $178 = App$store$(Web$Playground$State$new$(_device$12, Web$Playground$Window$input, "", ""));
                                    var $176 = $178;
                                    break;
                            };
                            var $174 = $176;
                            break;
                    };
                    var $172 = $174;
                    break;
                case 'App.Event.mouse_over':
                    var $179 = self.id;
                    var $180 = App$store$(Web$Playground$set_mouse_over$($179, _state$4));
                    var $172 = $180;
                    break;
                case 'App.Event.mouse_click':
                    var $181 = self.id;
                    var $182 = App$store$(Web$Playground$exe_event$($181, _state$4));
                    var $172 = $182;
                    break;
                case 'App.Event.resize':
                    var $183 = self.info;
                    var self = $183;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $185 = self.screen_size;
                            var self = $185;
                            switch (self._) {
                                case 'Pair.new':
                                    var $187 = self.fst;
                                    var self = _state$4;
                                    switch (self._) {
                                        case 'Web.Playground.State.new':
                                            var $189 = self.window;
                                            var $190 = self.mouse_over;
                                            var $191 = self.code;
                                            var _device$15 = Device$classify$($187);
                                            var $192 = App$store$(Web$Playground$State$new$(_device$15, $189, $190, $191));
                                            var $188 = $192;
                                            break;
                                    };
                                    var $186 = $188;
                                    break;
                            };
                            var $184 = $186;
                            break;
                    };
                    var $172 = $184;
                    break;
                case 'App.Event.onsubmit':
                    var $193 = self.response;
                    var $194 = ((console.log(("Submit " + ($193 + String$nil))), (_x$8 => {
                        var $195 = App$pass;
                        return $195;
                    })()));
                    var $172 = $194;
                    break;
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.post':
                case 'App.Event.mouse_out':
                    var $196 = App$pass;
                    var $172 = $196;
                    break;
            };
            return $172;
        });
        var $170 = App$new$(_init$1, _draw$2, _when$3);
        return $170;
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
        'DOM.text': DOM$text,
        'Web.Kind.constant.secondary_color': Web$Kind$constant$secondary_color,
        'BitsMap.union': BitsMap$union,
        'Map.union': Map$union,
        'Web.Playground.comp.btn_run_code': Web$Playground$comp$btn_run_code,
        'Bool.false': Bool$false,
        'Web.Playground.comp.header': Web$Playground$comp$header,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Web.Playground.comp.input': Web$Playground$comp$input,
        'Web.Playground.comp.main_area': Web$Playground$comp$main_area,
        'Web.Playground.draw': Web$Playground$draw,
        'Web.playground.body': Web$playground$body,
        'IO': IO,
        'Bool.true': Bool$true,
        'Cmp.as_lte': Cmp$as_lte,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
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
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.store': App$store,
        'Unit.new': Unit$new,
        'App.pass': App$pass,
        'Web.Playground.set_mouse_over': Web$Playground$set_mouse_over,
        'Web.Playground.Event.check_terms': Web$Playground$Event$check_terms,
        'Web.Playground.Event.run_code': Web$Playground$Event$run_code,
        'Web.Playground.Event.display_output': Web$Playground$Event$display_output,
        'Web.Playground.Actions': Web$Playground$Actions,
        'Maybe': Maybe,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'Web.Playground.exe_event': Web$Playground$exe_event,
        'App.new': App$new,
        'Web.Playground': Web$Playground,
    };
})();