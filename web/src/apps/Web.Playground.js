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
                var $24 = c2;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c2($25)($26);
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
    const Web$Playground$constant$light_gray_color = "#D3D3D3";

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

    function Web$Playground$comp$run_code$(_is_hover$1, _title$2, _id$3) {
        var _normal$4 = Map$from_list$(List$cons$(Pair$new$("width", "20px"), List$cons$(Pair$new$("height", "20px"), List$cons$(Pair$new$("margin", "5px 0px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("font-color", "white"), List$nil))))));
        var _hover$5 = Map$from_list$(List$cons$(Pair$new$("background-color", "#44B8D3"), List$nil));
        var $97 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$3), List$nil)), (() => {
            var self = _is_hover$1;
            if (self) {
                var $98 = Map$union$(_normal$4, _hover$5);
                return $98;
            } else {
                var $99 = _normal$4;
                return $99;
            };
        })(), List$cons$(DOM$text$(_title$2), List$nil));
        return $97;
    };
    const Web$Playground$comp$run_code = x0 => x1 => x2 => Web$Playground$comp$run_code$(x0, x1, x2);
    const Bool$false = false;

    function Web$Playground$comp$header$(_stt$1) {
        var _tab$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "30px"), List$cons$(Pair$new$("padding", "5px 10px"), List$cons$(Pair$new$("border-style", "solid"), List$cons$(Pair$new$("border-width", "thin"), List$cons$(Pair$new$("border-color", Web$Playground$constant$light_gray_color), List$cons$(Pair$new$("display", "flex"), List$nil)))))))), List$cons$(DOM$text$("playground.kind"), List$nil));
        var _title$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "18px"), List$nil)), List$cons$(DOM$text$("KIND Playground"), List$nil));
        var _btn_run$4 = Web$Playground$comp$run_code$(Bool$false, ">", "btn_run_code");
        var $100 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))), List$cons$(_tab$2, List$cons$(_btn_run$4, List$nil)));
        return $100;
    };
    const Web$Playground$comp$header = x0 => Web$Playground$comp$header$(x0);

    function Web$Playground$comp$code$(_code$1) {
        var $101 = DOM$node$("textarea", Map$from_list$(List$cons$(Pair$new$("id", "input_code"), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("border", "solid 1px"), List$cons$(Pair$new$("resize", "none"), List$nil))))), List$cons$(DOM$text$("Placeholder"), List$nil));
        return $101;
    };
    const Web$Playground$comp$code = x0 => Web$Playground$comp$code$(x0);

    function Web$Playground$comp$main_area$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $103 = self.code;
                var $104 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("cols", "80"), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$nil)))), List$cons$(Web$Playground$comp$header$(_stt$1), List$cons$(Web$Playground$comp$code$($103), List$nil)));
                var $102 = $104;
                break;
        };
        return $102;
    };
    const Web$Playground$comp$main_area = x0 => Web$Playground$comp$main_area$(x0);

    function Web$Playground$draw$(_stt$1) {
        var $105 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("margin", "20px 0x"), List$nil))), List$cons$(Web$Playground$comp$main_area$(_stt$1), List$nil));
        return $105;
    };
    const Web$Playground$draw = x0 => Web$Playground$draw$(x0);

    function Web$playground$body$(_stt$1) {
        var $106 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "100px"), List$cons$(Pair$new$("height", "500px"), List$nil))), List$cons$(Web$Playground$draw$(_stt$1), List$nil));
        return $106;
    };
    const Web$playground$body = x0 => Web$playground$body$(x0);

    function IO$(_A$1) {
        var $107 = null;
        return $107;
    };
    const IO = x0 => IO$(x0);
    const Bool$true = true;

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $109 = Bool$true;
                var $108 = $109;
                break;
            case 'Cmp.gtn':
                var $110 = Bool$false;
                var $108 = $110;
                break;
        };
        return $108;
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
                var $112 = self.pred;
                var $113 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $115 = self.pred;
                            var $116 = (_a$pred$10 => {
                                var $117 = Word$cmp$go$(_a$pred$10, $115, _c$4);
                                return $117;
                            });
                            var $114 = $116;
                            break;
                        case 'Word.i':
                            var $118 = self.pred;
                            var $119 = (_a$pred$10 => {
                                var $120 = Word$cmp$go$(_a$pred$10, $118, Cmp$ltn);
                                return $120;
                            });
                            var $114 = $119;
                            break;
                        case 'Word.e':
                            var $121 = (_a$pred$8 => {
                                var $122 = _c$4;
                                return $122;
                            });
                            var $114 = $121;
                            break;
                    };
                    var $114 = $114($112);
                    return $114;
                });
                var $111 = $113;
                break;
            case 'Word.i':
                var $123 = self.pred;
                var $124 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $126 = self.pred;
                            var $127 = (_a$pred$10 => {
                                var $128 = Word$cmp$go$(_a$pred$10, $126, Cmp$gtn);
                                return $128;
                            });
                            var $125 = $127;
                            break;
                        case 'Word.i':
                            var $129 = self.pred;
                            var $130 = (_a$pred$10 => {
                                var $131 = Word$cmp$go$(_a$pred$10, $129, _c$4);
                                return $131;
                            });
                            var $125 = $130;
                            break;
                        case 'Word.e':
                            var $132 = (_a$pred$8 => {
                                var $133 = _c$4;
                                return $133;
                            });
                            var $125 = $132;
                            break;
                    };
                    var $125 = $125($123);
                    return $125;
                });
                var $111 = $124;
                break;
            case 'Word.e':
                var $134 = (_b$5 => {
                    var $135 = _c$4;
                    return $135;
                });
                var $111 = $134;
                break;
        };
        var $111 = $111(_b$3);
        return $111;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $136 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $136;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$lte$(_a$2, _b$3) {
        var $137 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $137;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function U32$new$(_value$1) {
        var $138 = word_to_u32(_value$1);
        return $138;
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
                    var $139 = _x$4;
                    return $139;
                } else {
                    var $140 = (self - 1n);
                    var $141 = Nat$apply$($140, _f$3, _f$3(_x$4));
                    return $141;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $142 = null;
        return $142;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $143 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $143;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $144 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $144;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $146 = self.pred;
                var $147 = Word$i$($146);
                var $145 = $147;
                break;
            case 'Word.i':
                var $148 = self.pred;
                var $149 = Word$o$(Word$inc$($148));
                var $145 = $149;
                break;
            case 'Word.e':
                var $150 = Word$e;
                var $145 = $150;
                break;
        };
        return $145;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $152 = Word$e;
            var $151 = $152;
        } else {
            var $153 = (self - 1n);
            var $154 = Word$o$(Word$zero$($153));
            var $151 = $154;
        };
        return $151;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $155 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $155;
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
            var $157 = Device$phone;
            var $156 = $157;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $159 = Device$tablet;
                var $158 = $159;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $161 = Device$desktop;
                    var $160 = $161;
                } else {
                    var $162 = Device$big_desktop;
                    var $160 = $162;
                };
                var $158 = $160;
            };
            var $156 = $158;
        };
        return $156;
    };
    const Device$classify = x0 => Device$classify$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $163 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $163;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $165 = self.value;
                var $166 = _f$4($165);
                var $164 = $166;
                break;
            case 'IO.ask':
                var $167 = self.query;
                var $168 = self.param;
                var $169 = self.then;
                var $170 = IO$ask$($167, $168, (_x$8 => {
                    var $171 = IO$bind$($169(_x$8), _f$4);
                    return $171;
                }));
                var $164 = $170;
                break;
        };
        return $164;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $172 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $172;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $173 = _new$2(IO$bind)(IO$end);
        return $173;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $174 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $174;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);

    function App$store$(_value$2) {
        var $175 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $176 = _m$pure$4;
            return $176;
        }))(Dynamic$new$(_value$2));
        return $175;
    };
    const App$store = x0 => App$store$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $177 = _m$pure$2;
        return $177;
    }))(Dynamic$new$(Unit$new));

    function Web$Playground$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Playground.State.new':
                var $179 = self.device;
                var $180 = self.window;
                var $181 = self.code;
                var $182 = Web$Playground$State$new$($179, $180, _id$1, $181);
                var $178 = $182;
                break;
        };
        return $178;
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
        var $183 = null;
        return $183;
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
                        var $184 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $186 = self.lft;
                                var $187 = BitsMap$get$($184, $186);
                                var $185 = $187;
                                break;
                            case 'BitsMap.new':
                                var $188 = Maybe$none;
                                var $185 = $188;
                                break;
                        };
                        return $185;
                    case 'i':
                        var $189 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $191 = self.rgt;
                                var $192 = BitsMap$get$($189, $191);
                                var $190 = $192;
                                break;
                            case 'BitsMap.new':
                                var $193 = Maybe$none;
                                var $190 = $193;
                                break;
                        };
                        return $190;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $195 = self.val;
                                var $196 = $195;
                                var $194 = $196;
                                break;
                            case 'BitsMap.new':
                                var $197 = Maybe$none;
                                var $194 = $197;
                                break;
                        };
                        return $194;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $198 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $198;
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
                        var $201 = _stt$2;
                        var $200 = $201;
                        break;
                };
                var $199 = $200;
                break;
        };
        return $199;
    };
    const Web$Playground$exe_event = x0 => x1 => Web$Playground$exe_event$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $202 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $202;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Playground = (() => {
        var _init$1 = Web$Playground$State$new$(Device$big_desktop, Web$Playground$Window$input, "", "");
        var _draw$2 = (_state$2 => {
            var $204 = Web$playground$body$(_state$2);
            return $204;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.init':
                    var $206 = self.info;
                    var self = $206;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $208 = self.screen_size;
                            var self = $208;
                            switch (self._) {
                                case 'Pair.new':
                                    var $210 = self.fst;
                                    var _device$12 = Device$classify$($210);
                                    var $211 = App$store$(Web$Playground$State$new$(_device$12, Web$Playground$Window$input, "", ""));
                                    var $209 = $211;
                                    break;
                            };
                            var $207 = $209;
                            break;
                    };
                    var $205 = $207;
                    break;
                case 'App.Event.mouse_over':
                    var $212 = self.id;
                    var $213 = App$store$(Web$Playground$set_mouse_over$($212, _state$4));
                    var $205 = $213;
                    break;
                case 'App.Event.mouse_click':
                    var $214 = self.id;
                    var $215 = App$store$(Web$Playground$exe_event$($214, _state$4));
                    var $205 = $215;
                    break;
                case 'App.Event.resize':
                    var $216 = self.info;
                    var self = $216;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $218 = self.screen_size;
                            var self = $218;
                            switch (self._) {
                                case 'Pair.new':
                                    var $220 = self.fst;
                                    var self = _state$4;
                                    switch (self._) {
                                        case 'Web.Playground.State.new':
                                            var $222 = self.window;
                                            var $223 = self.mouse_over;
                                            var $224 = self.code;
                                            var _device$15 = Device$classify$($220);
                                            var $225 = App$store$(Web$Playground$State$new$(_device$15, $222, $223, $224));
                                            var $221 = $225;
                                            break;
                                    };
                                    var $219 = $221;
                                    break;
                            };
                            var $217 = $219;
                            break;
                    };
                    var $205 = $217;
                    break;
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.post':
                case 'App.Event.mouse_out':
                    var $226 = App$pass;
                    var $205 = $226;
                    break;
            };
            return $205;
        });
        var $203 = App$new$(_init$1, _draw$2, _when$3);
        return $203;
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
        'Web.Playground.comp.run_code': Web$Playground$comp$run_code,
        'Bool.false': Bool$false,
        'Web.Playground.comp.header': Web$Playground$comp$header,
        'Web.Playground.comp.code': Web$Playground$comp$code,
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