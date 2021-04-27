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

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $40 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $42 = self.val;
                        var $43 = self.lft;
                        var $44 = self.rgt;
                        var $45 = BitsMap$tie$($42, BitsMap$set$($40, _val$3, $43), $44);
                        var $41 = $45;
                        break;
                    case 'BitsMap.new':
                        var $46 = BitsMap$tie$(Maybe$none, BitsMap$set$($40, _val$3, BitsMap$new), BitsMap$new);
                        var $41 = $46;
                        break;
                };
                var $39 = $41;
                break;
            case 'i':
                var $47 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $49 = self.val;
                        var $50 = self.lft;
                        var $51 = self.rgt;
                        var $52 = BitsMap$tie$($49, $50, BitsMap$set$($47, _val$3, $51));
                        var $48 = $52;
                        break;
                    case 'BitsMap.new':
                        var $53 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($47, _val$3, BitsMap$new));
                        var $48 = $53;
                        break;
                };
                var $39 = $48;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $55 = self.lft;
                        var $56 = self.rgt;
                        var $57 = BitsMap$tie$(Maybe$some$(_val$3), $55, $56);
                        var $54 = $57;
                        break;
                    case 'BitsMap.new':
                        var $58 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $54 = $58;
                        break;
                };
                var $39 = $54;
                break;
        };
        return $39;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $60 = self.pred;
                var $61 = (Word$to_bits$($60) + '0');
                var $59 = $61;
                break;
            case 'Word.i':
                var $62 = self.pred;
                var $63 = (Word$to_bits$($62) + '1');
                var $59 = $63;
                break;
            case 'Word.e':
                var $64 = Bits$e;
                var $59 = $64;
                break;
        };
        return $59;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $65 = 1n + _pred$1;
        return $65;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $67 = Bits$e;
            var $66 = $67;
        } else {
            var $68 = self.charCodeAt(0);
            var $69 = self.slice(1);
            var $70 = (String$to_bits$($69) + (u16_to_bits($68)));
            var $66 = $70;
        };
        return $66;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $72 = self.head;
                var $73 = self.tail;
                var self = $72;
                switch (self._) {
                    case 'Pair.new':
                        var $75 = self.fst;
                        var $76 = self.snd;
                        var $77 = BitsMap$set$(String$to_bits$($75), $76, Map$from_list$($73));
                        var $74 = $77;
                        break;
                };
                var $71 = $74;
                break;
            case 'List.nil':
                var $78 = BitsMap$new;
                var $71 = $78;
                break;
        };
        return $71;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $79 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $79;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $80 = null;
        return $80;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $81 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $81;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });
    const Web$Playground$constant$light_gray_color = "#F3F4F7";

    function DOM$text$(_value$1) {
        var $82 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $82;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const Web$Kind$constant$secondary_color = "#3891A6";

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $84 = self.val;
                var $85 = self.lft;
                var $86 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $88 = self.val;
                        var $89 = self.lft;
                        var $90 = self.rgt;
                        var self = $84;
                        switch (self._) {
                            case 'Maybe.none':
                                var $92 = BitsMap$tie$($88, BitsMap$union$($85, $89), BitsMap$union$($86, $90));
                                var $91 = $92;
                                break;
                            case 'Maybe.some':
                                var $93 = BitsMap$tie$($84, BitsMap$union$($85, $89), BitsMap$union$($86, $90));
                                var $91 = $93;
                                break;
                        };
                        var $87 = $91;
                        break;
                    case 'BitsMap.new':
                        var $94 = _a$2;
                        var $87 = $94;
                        break;
                };
                var $83 = $87;
                break;
            case 'BitsMap.new':
                var $95 = _b$3;
                var $83 = $95;
                break;
        };
        return $83;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function Map$union$(_a$2, _b$3) {
        var $96 = BitsMap$union$(_a$2, _b$3);
        return $96;
    };
    const Map$union = x0 => x1 => Map$union$(x0, x1);

    function Web$Playground$comp$btn_run_code$(_is_hover$1, _title$2, _id$3) {
        var _normal$4 = Map$from_list$(List$cons$(Pair$new$("width", "40px"), List$cons$(Pair$new$("height", "20px"), List$cons$(Pair$new$("margin", "5px 0px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("border-radius", "4px"), List$nil)))))))));
        var _hover$5 = Map$from_list$(List$cons$(Pair$new$("background-color", "#44B8D3"), List$nil));
        var $97 = DOM$node$("input", Map$from_list$(List$cons$(Pair$new$("id", _id$3), List$cons$(Pair$new$("type", "submit"), List$cons$(Pair$new$("value", ">"), List$nil)))), (() => {
            var self = _is_hover$1;
            if (self) {
                var $98 = Map$union$(_normal$4, _hover$5);
                return $98;
            } else {
                var $99 = _normal$4;
                return $99;
            };
        })(), List$nil);
        return $97;
    };
    const Web$Playground$comp$btn_run_code = x0 => x1 => x2 => Web$Playground$comp$btn_run_code$(x0, x1, x2);
    const Bool$false = false;

    function Web$Playground$comp$header$(_stt$1) {
        var _tab$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "30px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", Web$Playground$constant$light_gray_color), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("playground.kind"), List$nil));
        var _title$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "18px"), List$nil)), List$cons$(DOM$text$("KIND Playground"), List$nil));
        var _btn_run$4 = Web$Playground$comp$btn_run_code$(Bool$false, ">", "btn_run_code");
        var $100 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))), List$cons$(_tab$2, List$cons$(_btn_run$4, List$nil)));
        return $100;
    };
    const Web$Playground$comp$header = x0 => Web$Playground$comp$header$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $101 = (String.fromCharCode(_head$1) + _tail$2);
        return $101;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Web$Playground$comp$input$(_code$1) {
        var $102 = DOM$node$("textarea", Map$from_list$(List$cons$(Pair$new$("id", "input_code"), List$cons$(Pair$new$("placeholder", "Write Kind code in this online editor and run it <3"), List$nil))), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("border", ("solid 5px " + Web$Playground$constant$light_gray_color)), List$cons$(Pair$new$("resize", "none"), List$cons$(Pair$new$("padding", "10px"), List$nil)))))), List$cons$(DOM$text$(_code$1), List$nil));
        return $102;
    };
    const Web$Playground$comp$input = x0 => Web$Playground$comp$input$(x0);

    function Web$Playground$comp$main_area$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $104 = self.code;
                var $105 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$nil))))), List$cons$(DOM$node$("form", Map$from_list$(List$cons$(Pair$new$("id", "code_input"), List$nil)), Map$from_list$(List$cons$(Pair$new$("height", "100%"), List$nil)), List$cons$(Web$Playground$comp$header$(_stt$1), List$cons$(Web$Playground$comp$input$($104), List$nil))), List$nil));
                var $103 = $105;
                break;
        };
        return $103;
    };
    const Web$Playground$comp$main_area = x0 => Web$Playground$comp$main_area$(x0);

    function Web$Playground$draw$(_stt$1) {
        var $106 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin", "20px 0x"), List$nil)))), List$cons$(Web$Playground$comp$main_area$(_stt$1), List$nil));
        return $106;
    };
    const Web$Playground$draw = x0 => Web$Playground$draw$(x0);

    function Web$playground$body$(_stt$1) {
        var $107 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "100px"), List$cons$(Pair$new$("height", "500px"), List$nil))), List$cons$(Web$Playground$draw$(_stt$1), List$nil));
        return $107;
    };
    const Web$playground$body = x0 => Web$playground$body$(x0);

    function IO$(_A$1) {
        var $108 = null;
        return $108;
    };
    const IO = x0 => IO$(x0);
    const Bool$true = true;

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $110 = Bool$true;
                var $109 = $110;
                break;
            case 'Cmp.gtn':
                var $111 = Bool$false;
                var $109 = $111;
                break;
        };
        return $109;
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
                var $113 = self.pred;
                var $114 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $116 = self.pred;
                            var $117 = (_a$pred$10 => {
                                var $118 = Word$cmp$go$(_a$pred$10, $116, _c$4);
                                return $118;
                            });
                            var $115 = $117;
                            break;
                        case 'Word.i':
                            var $119 = self.pred;
                            var $120 = (_a$pred$10 => {
                                var $121 = Word$cmp$go$(_a$pred$10, $119, Cmp$ltn);
                                return $121;
                            });
                            var $115 = $120;
                            break;
                        case 'Word.e':
                            var $122 = (_a$pred$8 => {
                                var $123 = _c$4;
                                return $123;
                            });
                            var $115 = $122;
                            break;
                    };
                    var $115 = $115($113);
                    return $115;
                });
                var $112 = $114;
                break;
            case 'Word.i':
                var $124 = self.pred;
                var $125 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $127 = self.pred;
                            var $128 = (_a$pred$10 => {
                                var $129 = Word$cmp$go$(_a$pred$10, $127, Cmp$gtn);
                                return $129;
                            });
                            var $126 = $128;
                            break;
                        case 'Word.i':
                            var $130 = self.pred;
                            var $131 = (_a$pred$10 => {
                                var $132 = Word$cmp$go$(_a$pred$10, $130, _c$4);
                                return $132;
                            });
                            var $126 = $131;
                            break;
                        case 'Word.e':
                            var $133 = (_a$pred$8 => {
                                var $134 = _c$4;
                                return $134;
                            });
                            var $126 = $133;
                            break;
                    };
                    var $126 = $126($124);
                    return $126;
                });
                var $112 = $125;
                break;
            case 'Word.e':
                var $135 = (_b$5 => {
                    var $136 = _c$4;
                    return $136;
                });
                var $112 = $135;
                break;
        };
        var $112 = $112(_b$3);
        return $112;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $137 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $137;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$lte$(_a$2, _b$3) {
        var $138 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $138;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function U32$new$(_value$1) {
        var $139 = word_to_u32(_value$1);
        return $139;
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
                    var $140 = _x$4;
                    return $140;
                } else {
                    var $141 = (self - 1n);
                    var $142 = Nat$apply$($141, _f$3, _f$3(_x$4));
                    return $142;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $143 = null;
        return $143;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $144 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $144;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $145 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $145;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $147 = self.pred;
                var $148 = Word$i$($147);
                var $146 = $148;
                break;
            case 'Word.i':
                var $149 = self.pred;
                var $150 = Word$o$(Word$inc$($149));
                var $146 = $150;
                break;
            case 'Word.e':
                var $151 = Word$e;
                var $146 = $151;
                break;
        };
        return $146;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $153 = Word$e;
            var $152 = $153;
        } else {
            var $154 = (self - 1n);
            var $155 = Word$o$(Word$zero$($154));
            var $152 = $155;
        };
        return $152;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $156 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $156;
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
            var $158 = Device$phone;
            var $157 = $158;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $160 = Device$tablet;
                var $159 = $160;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $162 = Device$desktop;
                    var $161 = $162;
                } else {
                    var $163 = Device$big_desktop;
                    var $161 = $163;
                };
                var $159 = $161;
            };
            var $157 = $159;
        };
        return $157;
    };
    const Device$classify = x0 => Device$classify$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $164 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $164;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $166 = self.value;
                var $167 = _f$4($166);
                var $165 = $167;
                break;
            case 'IO.ask':
                var $168 = self.query;
                var $169 = self.param;
                var $170 = self.then;
                var $171 = IO$ask$($168, $169, (_x$8 => {
                    var $172 = IO$bind$($170(_x$8), _f$4);
                    return $172;
                }));
                var $165 = $171;
                break;
        };
        return $165;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $173 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $173;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $174 = _new$2(IO$bind)(IO$end);
        return $174;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $175 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $175;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);

    function App$store$(_value$2) {
        var $176 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $177 = _m$pure$4;
            return $177;
        }))(Dynamic$new$(_value$2));
        return $176;
    };
    const App$store = x0 => App$store$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $178 = _m$pure$2;
        return $178;
    }))(Dynamic$new$(Unit$new));

    function Web$Playground$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $180 = self.device;
                var $181 = self.window;
                var $182 = self.code;
                var $183 = Web$Playground$State$new$($180, $181, _id$1, $182);
                var $179 = $183;
                break;
        };
        return $179;
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
        var $184 = null;
        return $184;
    };
    const Maybe = x0 => Maybe$(x0);

    function BitsMap$get$(_bits$2, _map$3) {
        var BitsMap$get$ = (_bits$2, _map$3) => ({
            ctr: 'TCO',
            arg: [_bits$2, _map$3]
        });
        var BitsMap$get = _bits$2 => _map$3 => BitsMap$get$(_bits$2, _map$3);
        var arg = [_bits$2, _map$3];
        while (true) {
            let [_bits$2, _map$3] = arg;
            var R = (() => {
                var self = _bits$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $185 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $187 = self.lft;
                                var $188 = BitsMap$get$($185, $187);
                                var $186 = $188;
                                break;
                            case 'BitsMap.new':
                                var $189 = Maybe$none;
                                var $186 = $189;
                                break;
                        };
                        return $186;
                    case 'i':
                        var $190 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $192 = self.rgt;
                                var $193 = BitsMap$get$($190, $192);
                                var $191 = $193;
                                break;
                            case 'BitsMap.new':
                                var $194 = Maybe$none;
                                var $191 = $194;
                                break;
                        };
                        return $191;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $196 = self.val;
                                var $197 = $196;
                                var $195 = $197;
                                break;
                            case 'BitsMap.new':
                                var $198 = Maybe$none;
                                var $195 = $198;
                                break;
                        };
                        return $195;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $199 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $199;
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
                        var $202 = _stt$2;
                        var $201 = $202;
                        break;
                };
                var $200 = $201;
                break;
        };
        return $200;
    };
    const Web$Playground$exe_event = x0 => x1 => Web$Playground$exe_event$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $203 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $203;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Playground = (() => {
        var _init$1 = Web$Playground$State$new$(Device$big_desktop, Web$Playground$Window$input, "", "");
        var _draw$2 = (_state$2 => {
            var $205 = Web$playground$body$(_state$2);
            return $205;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.init':
                    var $207 = self.info;
                    var self = $207;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $209 = self.screen_size;
                            var self = $209;
                            switch (self._) {
                                case 'Pair.new':
                                    var $211 = self.fst;
                                    var _device$12 = Device$classify$($211);
                                    var $212 = App$store$(Web$Playground$State$new$(_device$12, Web$Playground$Window$input, "", ""));
                                    var $210 = $212;
                                    break;
                            };
                            var $208 = $210;
                            break;
                    };
                    var $206 = $208;
                    break;
                case 'App.Event.mouse_over':
                    var $213 = self.id;
                    var $214 = App$store$(Web$Playground$set_mouse_over$($213, _state$4));
                    var $206 = $214;
                    break;
                case 'App.Event.mouse_click':
                    var $215 = self.id;
                    var $216 = App$store$(Web$Playground$exe_event$($215, _state$4));
                    var $206 = $216;
                    break;
                case 'App.Event.resize':
                    var $217 = self.info;
                    var self = $217;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $219 = self.screen_size;
                            var self = $219;
                            switch (self._) {
                                case 'Pair.new':
                                    var $221 = self.fst;
                                    var self = _state$4;
                                    switch (self._) {
                                        case 'Web.Playground.State.new':
                                            var $223 = self.window;
                                            var $224 = self.mouse_over;
                                            var $225 = self.code;
                                            var _device$15 = Device$classify$($221);
                                            var $226 = App$store$(Web$Playground$State$new$(_device$15, $223, $224, $225));
                                            var $222 = $226;
                                            break;
                                    };
                                    var $220 = $222;
                                    break;
                            };
                            var $218 = $220;
                            break;
                    };
                    var $206 = $218;
                    break;
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.post':
                case 'App.Event.mouse_out':
                case 'App.Event.onsubmit':
                    var $227 = App$pass;
                    var $206 = $227;
                    break;
            };
            return $206;
        });
        var $204 = App$new$(_init$1, _draw$2, _when$3);
        return $204;
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

/***/ })

}]);
//# sourceMappingURL=791.index.js.map