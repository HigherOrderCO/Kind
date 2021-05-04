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

    function Web$Playground$comp$btn_run_code$(_is_hover$1, _title$2) {
        var _normal$3 = Map$from_list$(List$cons$(Pair$new$("width", "40px"), List$cons$(Pair$new$("height", "20px"), List$cons$(Pair$new$("margin", "5px 0px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("border-radius", "4px"), List$nil)))))))));
        var _hover$4 = Map$from_list$(List$cons$(Pair$new$("background-color", "#44B8D3"), List$nil));
        var $77 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "btn_run_code"), List$nil)), (() => {
            var self = _is_hover$1;
            if (self) {
                var $78 = Map$union$(_normal$3, _hover$4);
                return $78;
            } else {
                var $79 = _normal$3;
                return $79;
            };
        })(), List$nil);
        return $77;
    };
    const Web$Playground$comp$btn_run_code = x0 => x1 => Web$Playground$comp$btn_run_code$(x0, x1);
    const Bool$false = false;

    function Web$Playground$comp$header$(_stt$1) {
        var _tab$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "30px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", Web$Playground$constant$light_gray_color), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("playground.kind"), List$nil));
        var _title$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "18px"), List$nil)), List$cons$(DOM$text$("KIND Playground"), List$nil));
        var _btn_run$4 = Web$Playground$comp$btn_run_code$(Bool$false, ">");
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
                var $85 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$nil))))), List$cons$(Web$Playground$comp$header$(_stt$1), List$cons$(Web$Playground$comp$input$($84), List$nil)));
                var $83 = $85;
                break;
        };
        return $83;
    };
    const Web$Playground$comp$main_area = x0 => Web$Playground$comp$main_area$(x0);

    function Web$Playground$comp$output_area$(_output$1) {
        var $86 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "300px"), List$cons$(Pair$new$("heigh", "100%"), List$cons$(Pair$new$("margin-top", "30px"), List$cons$(Pair$new$("padding", "10px"), List$cons$(Pair$new$("background-color", Web$Playground$constant$light_gray_color), List$nil)))))), List$cons$(DOM$text$(_output$1), List$nil));
        return $86;
    };
    const Web$Playground$comp$output_area = x0 => Web$Playground$comp$output_area$(x0);

    function Web$Playground$draw$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $88 = self.output;
                var $89 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin", "20px 0x"), List$cons$(Pair$new$("display", "flex"), List$nil))))), List$cons$(Web$Playground$comp$main_area$(_stt$1), List$cons$(Web$Playground$comp$output_area$($88), List$nil)));
                var $87 = $89;
                break;
        };
        return $87;
    };
    const Web$Playground$draw = x0 => Web$Playground$draw$(x0);

    function Web$playground$body$(_stt$1) {
        var $90 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "100px"), List$cons$(Pair$new$("height", "500px"), List$nil))), List$cons$(Web$Playground$draw$(_stt$1), List$nil));
        return $90;
    };
    const Web$playground$body = x0 => Web$playground$body$(x0);

    function IO$(_A$1) {
        var $91 = null;
        return $91;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $92 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $92;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $94 = self.value;
                var $95 = _f$4($94);
                var $93 = $95;
                break;
            case 'IO.ask':
                var $96 = self.query;
                var $97 = self.param;
                var $98 = self.then;
                var $99 = IO$ask$($96, $97, (_x$8 => {
                    var $100 = IO$bind$($98(_x$8), _f$4);
                    return $100;
                }));
                var $93 = $99;
                break;
        };
        return $93;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $101 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $101;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $102 = _new$2(IO$bind)(IO$end);
        return $102;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $103 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $103;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $104 = _m$pure$2;
        return $104;
    }))(Dynamic$new$(Unit$new));

    function App$store$(_value$2) {
        var $105 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $106 = _m$pure$4;
            return $106;
        }))(Dynamic$new$(_value$2));
        return $105;
    };
    const App$store = x0 => App$store$(x0);

    function Web$Playground$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $108 = self.device;
                var $109 = self.window;
                var $110 = self.code;
                var $111 = self.output;
                var $112 = Web$Playground$State$new$($108, $109, _id$1, $110, $111);
                var $107 = $112;
                break;
        };
        return $107;
    };
    const Web$Playground$set_mouse_over = x0 => x1 => Web$Playground$set_mouse_over$(x0, x1);
    const Bool$true = true;
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $114 = Bool$false;
                var $113 = $114;
                break;
            case 'Cmp.eql':
                var $115 = Bool$true;
                var $113 = $115;
                break;
        };
        return $113;
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
                var $117 = self.pred;
                var $118 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $120 = self.pred;
                            var $121 = (_a$pred$10 => {
                                var $122 = Word$cmp$go$(_a$pred$10, $120, _c$4);
                                return $122;
                            });
                            var $119 = $121;
                            break;
                        case 'Word.i':
                            var $123 = self.pred;
                            var $124 = (_a$pred$10 => {
                                var $125 = Word$cmp$go$(_a$pred$10, $123, Cmp$ltn);
                                return $125;
                            });
                            var $119 = $124;
                            break;
                        case 'Word.e':
                            var $126 = (_a$pred$8 => {
                                var $127 = _c$4;
                                return $127;
                            });
                            var $119 = $126;
                            break;
                    };
                    var $119 = $119($117);
                    return $119;
                });
                var $116 = $118;
                break;
            case 'Word.i':
                var $128 = self.pred;
                var $129 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $131 = self.pred;
                            var $132 = (_a$pred$10 => {
                                var $133 = Word$cmp$go$(_a$pred$10, $131, Cmp$gtn);
                                return $133;
                            });
                            var $130 = $132;
                            break;
                        case 'Word.i':
                            var $134 = self.pred;
                            var $135 = (_a$pred$10 => {
                                var $136 = Word$cmp$go$(_a$pred$10, $134, _c$4);
                                return $136;
                            });
                            var $130 = $135;
                            break;
                        case 'Word.e':
                            var $137 = (_a$pred$8 => {
                                var $138 = _c$4;
                                return $138;
                            });
                            var $130 = $137;
                            break;
                    };
                    var $130 = $130($128);
                    return $130;
                });
                var $116 = $129;
                break;
            case 'Word.e':
                var $139 = (_b$5 => {
                    var $140 = _c$4;
                    return $140;
                });
                var $116 = $139;
                break;
        };
        var $116 = $116(_b$3);
        return $116;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $141 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $141;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $142 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $142;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));
    const String$nil = '';

    function IO$request$(_url$1) {
        var $143 = IO$ask$("request", _url$1, (_text$2 => {
            var $144 = IO$end$(_text$2);
            return $144;
        }));
        return $143;
    };
    const IO$request = x0 => IO$request$(x0);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $146 = Bool$true;
                var $145 = $146;
                break;
            case 'Cmp.gtn':
                var $147 = Bool$false;
                var $145 = $147;
                break;
        };
        return $145;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $148 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $148;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function U32$new$(_value$1) {
        var $149 = word_to_u32(_value$1);
        return $149;
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
                    var $150 = _x$4;
                    return $150;
                } else {
                    var $151 = (self - 1n);
                    var $152 = Nat$apply$($151, _f$3, _f$3(_x$4));
                    return $152;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $153 = null;
        return $153;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $154 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $154;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $155 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $155;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $157 = self.pred;
                var $158 = Word$i$($157);
                var $156 = $158;
                break;
            case 'Word.i':
                var $159 = self.pred;
                var $160 = Word$o$(Word$inc$($159));
                var $156 = $160;
                break;
            case 'Word.e':
                var $161 = Word$e;
                var $156 = $161;
                break;
        };
        return $156;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $163 = Word$e;
            var $162 = $163;
        } else {
            var $164 = (self - 1n);
            var $165 = Word$o$(Word$zero$($164));
            var $162 = $165;
        };
        return $162;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $166 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $166;
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
            var $168 = Device$phone;
            var $167 = $168;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $170 = Device$tablet;
                var $169 = $170;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $172 = Device$desktop;
                    var $171 = $172;
                } else {
                    var $173 = Device$big_desktop;
                    var $171 = $173;
                };
                var $169 = $171;
            };
            var $167 = $169;
        };
        return $167;
    };
    const Device$classify = x0 => Device$classify$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $174 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $174;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Playground = (() => {
        var _init$1 = Web$Playground$State$new$(Device$big_desktop, Web$Playground$Window$input, "", "", "none");
        var _draw$2 = (_state$2 => {
            var $176 = Web$playground$body$(_state$2);
            return $176;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _state$4;
            switch (self._) {
                case 'Web.Playground.State.new':
                    var $178 = self.device;
                    var $179 = self.window;
                    var $180 = self.mouse_over;
                    var $181 = self.code;
                    var self = _event$3;
                    switch (self._) {
                        case 'App.Event.mouse_over':
                            var $183 = self.id;
                            var $184 = App$store$(Web$Playground$set_mouse_over$($183, _state$4));
                            var $182 = $184;
                            break;
                        case 'App.Event.mouse_click':
                            var $185 = self.id;
                            var self = ($185 === "btn_run_code");
                            if (self) {
                                var $187 = ((console.log(("btn clicked!" + String$nil)), (_x$13 => {
                                    var $188 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                        var $189 = _m$bind$14;
                                        return $189;
                                    }))(IO$request$("http://localhost:3030/api/check_term?code=type Foo { new(num: Nat) }"))((_checked$14 => {
                                        var $190 = ((console.log((("Checked: " + _checked$14) + String$nil)), (_x$15 => {
                                            var $191 = App$store$(Web$Playground$State$new$($178, $179, $180, $181, _checked$14));
                                            return $191;
                                        })()));
                                        return $190;
                                    }));
                                    return $188;
                                })()));
                                var $186 = $187;
                            } else {
                                var $192 = App$pass;
                                var $186 = $192;
                            };
                            var $182 = $186;
                            break;
                        case 'App.Event.resize':
                            var $193 = self.info;
                            var self = $193;
                            switch (self._) {
                                case 'App.EnvInfo.new':
                                    var $195 = self.screen_size;
                                    var self = $195;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $197 = self.fst;
                                            var self = _state$4;
                                            switch (self._) {
                                                case 'Web.Playground.State.new':
                                                    var $199 = self.window;
                                                    var $200 = self.mouse_over;
                                                    var $201 = self.code;
                                                    var _device$21 = Device$classify$($197);
                                                    var $202 = App$store$(Web$Playground$State$new(_device$21)($199)($200)($201));
                                                    var $198 = $202;
                                                    break;
                                            };
                                            var $196 = $198;
                                            break;
                                    };
                                    var $194 = $196;
                                    break;
                            };
                            var $182 = $194;
                            break;
                        case 'App.Event.init':
                        case 'App.Event.tick':
                        case 'App.Event.mouse_down':
                        case 'App.Event.mouse_up':
                        case 'App.Event.key_down':
                        case 'App.Event.key_up':
                        case 'App.Event.post':
                        case 'App.Event.mouse_out':
                        case 'App.Event.onsubmit':
                            var $203 = App$pass;
                            var $182 = $203;
                            break;
                    };
                    var $177 = $182;
                    break;
            };
            return $177;
        });
        var $175 = App$new$(_init$1, _draw$2, _when$3);
        return $175;
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
        'Web.Playground.comp.output_area': Web$Playground$comp$output_area,
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
        'App.store': App$store,
        'Web.Playground.set_mouse_over': Web$Playground$set_mouse_over,
        'Bool.true': Bool$true,
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
        'Debug.log': Debug$log,
        'String.nil': String$nil,
        'IO.request': IO$request,
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
        'App.new': App$new,
        'Web.Playground': Web$Playground,
    };
})();

/***/ })

}]);
//# sourceMappingURL=791.index.js.map