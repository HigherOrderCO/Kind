(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[870],{

/***/ 870:
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

    function Web$KindWebsite$State$new$(_screen_size$1, _page$2) {
        var $33 = ({
            _: 'Web.KindWebsite.State.new',
            'screen_size': _screen_size$1,
            'page': _page$2
        });
        return $33;
    };
    const Web$KindWebsite$State$new = x0 => x1 => Web$KindWebsite$State$new$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $34 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $34;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

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
                    var $35 = _x$4;
                    return $35;
                } else {
                    var $36 = (self - 1n);
                    var $37 = Nat$apply$($36, _f$3, _f$3(_x$4));
                    return $37;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function U32$new$(_value$1) {
        var $38 = word_to_u32(_value$1);
        return $38;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $39 = null;
        return $39;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $40 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $40;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $41 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $41;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $43 = self.pred;
                var $44 = Word$i$($43);
                var $42 = $44;
                break;
            case 'Word.i':
                var $45 = self.pred;
                var $46 = Word$o$(Word$inc$($45));
                var $42 = $46;
                break;
            case 'Word.e':
                var $47 = Word$e;
                var $42 = $47;
                break;
        };
        return $42;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$succ$(_pred$1) {
        var $48 = 1n + _pred$1;
        return $48;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;

    function U32$inc$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $50 = u32_to_word(self);
                var $51 = U32$new$(Word$inc$($50));
                var $49 = $51;
                break;
        };
        return $49;
    };
    const U32$inc = x0 => U32$inc$(x0);

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
    const U32$zero = U32$new$(Word$zero$(32n));
    const Nat$to_u32 = a0 => (Number(a0));
    const Web$KindWebsite$Page$home = ({
        _: 'Web.KindWebsite.Page.home'
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $56 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $56;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $57 = null;
        return $57;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $58 = null;
        return $58;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $59 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $59;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $60 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $60;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $62 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $64 = self.val;
                        var $65 = self.lft;
                        var $66 = self.rgt;
                        var $67 = BitsMap$tie$($64, BitsMap$set$($62, _val$3, $65), $66);
                        var $63 = $67;
                        break;
                    case 'BitsMap.new':
                        var $68 = BitsMap$tie$(Maybe$none, BitsMap$set$($62, _val$3, BitsMap$new), BitsMap$new);
                        var $63 = $68;
                        break;
                };
                var $61 = $63;
                break;
            case 'i':
                var $69 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $71 = self.val;
                        var $72 = self.lft;
                        var $73 = self.rgt;
                        var $74 = BitsMap$tie$($71, $72, BitsMap$set$($69, _val$3, $73));
                        var $70 = $74;
                        break;
                    case 'BitsMap.new':
                        var $75 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($69, _val$3, BitsMap$new));
                        var $70 = $75;
                        break;
                };
                var $61 = $70;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $77 = self.lft;
                        var $78 = self.rgt;
                        var $79 = BitsMap$tie$(Maybe$some$(_val$3), $77, $78);
                        var $76 = $79;
                        break;
                    case 'BitsMap.new':
                        var $80 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $76 = $80;
                        break;
                };
                var $61 = $76;
                break;
        };
        return $61;
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
                var $82 = self.pred;
                var $83 = (Word$to_bits$($82) + '0');
                var $81 = $83;
                break;
            case 'Word.i':
                var $84 = self.pred;
                var $85 = (Word$to_bits$($84) + '1');
                var $81 = $85;
                break;
            case 'Word.e':
                var $86 = Bits$e;
                var $81 = $86;
                break;
        };
        return $81;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $88 = Bits$e;
            var $87 = $88;
        } else {
            var $89 = self.charCodeAt(0);
            var $90 = self.slice(1);
            var $91 = (String$to_bits$($90) + (u16_to_bits($89)));
            var $87 = $91;
        };
        return $87;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $93 = self.head;
                var $94 = self.tail;
                var self = $93;
                switch (self._) {
                    case 'Pair.new':
                        var $96 = self.fst;
                        var $97 = self.snd;
                        var $98 = BitsMap$set$(String$to_bits$($96), $97, Map$from_list$($94));
                        var $95 = $98;
                        break;
                };
                var $92 = $95;
                break;
            case 'List.nil':
                var $99 = BitsMap$new;
                var $92 = $99;
                break;
        };
        return $92;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $100 = null;
        return $100;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $101 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $101;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $102 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $102;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function Web$Kind$component$title$(_title$1) {
        var $103 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "20px"), List$cons$(Pair$new$("font-family", "Helvetica"), List$cons$(Pair$new$("font-weight", "bold"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $103;
    };
    const Web$Kind$component$title = x0 => Web$Kind$component$title$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $104 = null;
        return $104;
    };
    const List = x0 => List$(x0);

    function Web$Kind$component$list$(_items$1) {
        var _li$2 = List$nil;
        var _li$3 = (() => {
            var $107 = _li$2;
            var $108 = _items$1;
            let _li$4 = $107;
            let _item$3;
            while ($108._ === 'List.cons') {
                _item$3 = $108.head;
                var $107 = List$cons$(DOM$node$("li", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "5px"), List$nil)), List$cons$(_item$3, List$nil)), _li$4);
                _li$4 = $107;
                $108 = $108.tail;
            }
            return _li$4;
        })();
        var $105 = DOM$node$("ul", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("list-style-type", "circle"), List$cons$(Pair$new$("margin-left", "20px"), List$nil))), _li$3);
        return $105;
    };
    const Web$Kind$component$list = x0 => Web$Kind$component$list$(x0);

    function Web$Kind$component$link$(_txt$1, _href$2) {
        var $109 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$nil)), List$cons$(DOM$text$(_txt$1), List$nil));
        return $109;
    };
    const Web$Kind$component$link = x0 => x1 => Web$Kind$component$link$(x0, x1);

    function Buffer32$new$(_depth$1, _array$2) {
        var $110 = u32array_to_buffer32(_array$2);
        return $110;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $111 = null;
        return $111;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $112 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $112;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $113 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $113;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $115 = Array$tip$(_x$3);
            var $114 = $115;
        } else {
            var $116 = (self - 1n);
            var _half$5 = Array$alloc$($116, _x$3);
            var $117 = Array$tie$(_half$5, _half$5);
            var $114 = $117;
        };
        return $114;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));
    const Bool$false = false;
    const Bool$true = true;

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $119 = Bool$false;
                var $118 = $119;
                break;
            case 'Cmp.eql':
                var $120 = Bool$true;
                var $118 = $120;
                break;
        };
        return $118;
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
                var $122 = self.pred;
                var $123 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $125 = self.pred;
                            var $126 = (_a$pred$10 => {
                                var $127 = Word$cmp$go$(_a$pred$10, $125, _c$4);
                                return $127;
                            });
                            var $124 = $126;
                            break;
                        case 'Word.i':
                            var $128 = self.pred;
                            var $129 = (_a$pred$10 => {
                                var $130 = Word$cmp$go$(_a$pred$10, $128, Cmp$ltn);
                                return $130;
                            });
                            var $124 = $129;
                            break;
                        case 'Word.e':
                            var $131 = (_a$pred$8 => {
                                var $132 = _c$4;
                                return $132;
                            });
                            var $124 = $131;
                            break;
                    };
                    var $124 = $124($122);
                    return $124;
                });
                var $121 = $123;
                break;
            case 'Word.i':
                var $133 = self.pred;
                var $134 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $136 = self.pred;
                            var $137 = (_a$pred$10 => {
                                var $138 = Word$cmp$go$(_a$pred$10, $136, Cmp$gtn);
                                return $138;
                            });
                            var $135 = $137;
                            break;
                        case 'Word.i':
                            var $139 = self.pred;
                            var $140 = (_a$pred$10 => {
                                var $141 = Word$cmp$go$(_a$pred$10, $139, _c$4);
                                return $141;
                            });
                            var $135 = $140;
                            break;
                        case 'Word.e':
                            var $142 = (_a$pred$8 => {
                                var $143 = _c$4;
                                return $143;
                            });
                            var $135 = $142;
                            break;
                    };
                    var $135 = $135($133);
                    return $135;
                });
                var $121 = $134;
                break;
            case 'Word.e':
                var $144 = (_b$5 => {
                    var $145 = _c$4;
                    return $145;
                });
                var $121 = $144;
                break;
        };
        var $121 = $121(_b$3);
        return $121;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $146 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $146;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $147 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $147;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function U32$needed_depth$go$(_n$1) {
        var self = (_n$1 === 0);
        if (self) {
            var $149 = 0n;
            var $148 = $149;
        } else {
            var $150 = Nat$succ$(U32$needed_depth$go$((_n$1 >>> 1)));
            var $148 = $150;
        };
        return $148;
    };
    const U32$needed_depth$go = x0 => U32$needed_depth$go$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $152 = self.pred;
                var $153 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $155 = self.pred;
                            var $156 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $158 = Word$i$(Word$subber$(_a$pred$10, $155, Bool$true));
                                    var $157 = $158;
                                } else {
                                    var $159 = Word$o$(Word$subber$(_a$pred$10, $155, Bool$false));
                                    var $157 = $159;
                                };
                                return $157;
                            });
                            var $154 = $156;
                            break;
                        case 'Word.i':
                            var $160 = self.pred;
                            var $161 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $163 = Word$o$(Word$subber$(_a$pred$10, $160, Bool$true));
                                    var $162 = $163;
                                } else {
                                    var $164 = Word$i$(Word$subber$(_a$pred$10, $160, Bool$true));
                                    var $162 = $164;
                                };
                                return $162;
                            });
                            var $154 = $161;
                            break;
                        case 'Word.e':
                            var $165 = (_a$pred$8 => {
                                var $166 = Word$e;
                                return $166;
                            });
                            var $154 = $165;
                            break;
                    };
                    var $154 = $154($152);
                    return $154;
                });
                var $151 = $153;
                break;
            case 'Word.i':
                var $167 = self.pred;
                var $168 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $170 = self.pred;
                            var $171 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $173 = Word$o$(Word$subber$(_a$pred$10, $170, Bool$false));
                                    var $172 = $173;
                                } else {
                                    var $174 = Word$i$(Word$subber$(_a$pred$10, $170, Bool$false));
                                    var $172 = $174;
                                };
                                return $172;
                            });
                            var $169 = $171;
                            break;
                        case 'Word.i':
                            var $175 = self.pred;
                            var $176 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $178 = Word$i$(Word$subber$(_a$pred$10, $175, Bool$true));
                                    var $177 = $178;
                                } else {
                                    var $179 = Word$o$(Word$subber$(_a$pred$10, $175, Bool$false));
                                    var $177 = $179;
                                };
                                return $177;
                            });
                            var $169 = $176;
                            break;
                        case 'Word.e':
                            var $180 = (_a$pred$8 => {
                                var $181 = Word$e;
                                return $181;
                            });
                            var $169 = $180;
                            break;
                    };
                    var $169 = $169($167);
                    return $169;
                });
                var $151 = $168;
                break;
            case 'Word.e':
                var $182 = (_b$5 => {
                    var $183 = Word$e;
                    return $183;
                });
                var $151 = $182;
                break;
        };
        var $151 = $151(_b$3);
        return $151;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $184 = Word$subber$(_a$2, _b$3, Bool$false);
        return $184;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function U32$needed_depth$(_size$1) {
        var $185 = U32$needed_depth$go$((Math.max(_size$1 - 1, 0)));
        return $185;
    };
    const U32$needed_depth = x0 => U32$needed_depth$(x0);

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $187 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $189 = Word$i$(Word$shift_left1$aux$($187, Bool$false));
                    var $188 = $189;
                } else {
                    var $190 = Word$o$(Word$shift_left1$aux$($187, Bool$false));
                    var $188 = $190;
                };
                var $186 = $188;
                break;
            case 'Word.i':
                var $191 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $193 = Word$i$(Word$shift_left1$aux$($191, Bool$true));
                    var $192 = $193;
                } else {
                    var $194 = Word$o$(Word$shift_left1$aux$($191, Bool$true));
                    var $192 = $194;
                };
                var $186 = $192;
                break;
            case 'Word.e':
                var $195 = Word$e;
                var $186 = $195;
                break;
        };
        return $186;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $197 = self.pred;
                var $198 = Word$o$(Word$shift_left1$aux$($197, Bool$false));
                var $196 = $198;
                break;
            case 'Word.i':
                var $199 = self.pred;
                var $200 = Word$o$(Word$shift_left1$aux$($199, Bool$true));
                var $196 = $200;
                break;
            case 'Word.e':
                var $201 = Word$e;
                var $196 = $201;
                break;
        };
        return $196;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $203 = self.pred;
                var $204 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $206 = self.pred;
                            var $207 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $209 = Word$i$(Word$adder$(_a$pred$10, $206, Bool$false));
                                    var $208 = $209;
                                } else {
                                    var $210 = Word$o$(Word$adder$(_a$pred$10, $206, Bool$false));
                                    var $208 = $210;
                                };
                                return $208;
                            });
                            var $205 = $207;
                            break;
                        case 'Word.i':
                            var $211 = self.pred;
                            var $212 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $214 = Word$o$(Word$adder$(_a$pred$10, $211, Bool$true));
                                    var $213 = $214;
                                } else {
                                    var $215 = Word$i$(Word$adder$(_a$pred$10, $211, Bool$false));
                                    var $213 = $215;
                                };
                                return $213;
                            });
                            var $205 = $212;
                            break;
                        case 'Word.e':
                            var $216 = (_a$pred$8 => {
                                var $217 = Word$e;
                                return $217;
                            });
                            var $205 = $216;
                            break;
                    };
                    var $205 = $205($203);
                    return $205;
                });
                var $202 = $204;
                break;
            case 'Word.i':
                var $218 = self.pred;
                var $219 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $221 = self.pred;
                            var $222 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $224 = Word$o$(Word$adder$(_a$pred$10, $221, Bool$true));
                                    var $223 = $224;
                                } else {
                                    var $225 = Word$i$(Word$adder$(_a$pred$10, $221, Bool$false));
                                    var $223 = $225;
                                };
                                return $223;
                            });
                            var $220 = $222;
                            break;
                        case 'Word.i':
                            var $226 = self.pred;
                            var $227 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $229 = Word$i$(Word$adder$(_a$pred$10, $226, Bool$true));
                                    var $228 = $229;
                                } else {
                                    var $230 = Word$o$(Word$adder$(_a$pred$10, $226, Bool$true));
                                    var $228 = $230;
                                };
                                return $228;
                            });
                            var $220 = $227;
                            break;
                        case 'Word.e':
                            var $231 = (_a$pred$8 => {
                                var $232 = Word$e;
                                return $232;
                            });
                            var $220 = $231;
                            break;
                    };
                    var $220 = $220($218);
                    return $220;
                });
                var $202 = $219;
                break;
            case 'Word.e':
                var $233 = (_b$5 => {
                    var $234 = Word$e;
                    return $234;
                });
                var $202 = $233;
                break;
        };
        var $202 = $202(_b$3);
        return $202;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $235 = Word$adder$(_a$2, _b$3, Bool$false);
        return $235;
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
                        var $236 = self.pred;
                        var $237 = Word$mul$go$($236, Word$shift_left1$(_b$4), _acc$5);
                        return $237;
                    case 'Word.i':
                        var $238 = self.pred;
                        var $239 = Word$mul$go$($238, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $239;
                    case 'Word.e':
                        var $240 = _acc$5;
                        return $240;
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
                var $242 = self.pred;
                var $243 = Word$o$(Word$to_zero$($242));
                var $241 = $243;
                break;
            case 'Word.i':
                var $244 = self.pred;
                var $245 = Word$o$(Word$to_zero$($244));
                var $241 = $245;
                break;
            case 'Word.e':
                var $246 = Word$e;
                var $241 = $246;
                break;
        };
        return $241;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $247 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $247;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $248 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $248;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $249 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $249;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const String$nil = '';

    function String$cons$(_head$1, _tail$2) {
        var $250 = (String.fromCharCode(_head$1) + _tail$2);
        return $250;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $252 = String$nil;
            var $251 = $252;
        } else {
            var $253 = (self - 1n);
            var $254 = (_xs$1 + String$repeat$(_xs$1, $253));
            var $251 = $254;
        };
        return $251;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function Web$Kind$component$header_tab$(_is_active$1, _title$2) {
        var self = _is_active$1;
        if (self) {
            var $256 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "5px 50px 5px 0px"), List$cons$(Pair$new$("text-decoration", "underline"), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))))), List$cons$(DOM$text$(_title$2), List$nil));
            var $255 = $256;
        } else {
            var $257 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "5px 50px 5px 0px"), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_title$2), List$nil));
            var $255 = $257;
        };
        return $255;
    };
    const Web$Kind$component$header_tab = x0 => x1 => Web$Kind$component$header_tab$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Kind$helper$is_current$(_title$1, _page$2) {
        var self = _page$2;
        switch (self._) {
            case 'Web.KindWebsite.Page.home':
                var $259 = (_title$1 === "Home");
                var $258 = $259;
                break;
            case 'Web.KindWebsite.Page.apps':
                var $260 = (_title$1 === "Apps");
                var $258 = $260;
                break;
        };
        return $258;
    };
    const Web$Kind$helper$is_current = x0 => x1 => Web$Kind$helper$is_current$(x0, x1);

    function Web$Kind$component$header_tabs$(_page$1) {
        var _titles$2 = List$cons$("Apps", List$cons$("Home", List$nil));
        var _tabs$3 = List$nil;
        var _tabs$4 = (() => {
            var $263 = _tabs$3;
            var $264 = _titles$2;
            let _tabs$5 = $263;
            let _title$4;
            while ($264._ === 'List.cons') {
                _title$4 = $264.head;
                var $263 = List$cons$(Web$Kind$component$header_tab$(Web$Kind$helper$is_current$(_title$4, _page$1), _title$4), _tabs$5);
                _tabs$5 = $263;
                $264 = $264.tail;
            }
            return _tabs$5;
        })();
        var $261 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding-left", "20%"), List$nil)), _tabs$4);
        return $261;
    };
    const Web$Kind$component$header_tabs = x0 => Web$Kind$component$header_tabs$(x0);

    function Web$Kind$component$header$(_page$1) {
        var _vbox$2 = VoxBox$alloc_capacity$(100);
        var _line$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("padding", "10px 50px 10px 50px"), List$nil))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("color", "#9370DB"), List$nil)), List$cons$(DOM$text$(String$repeat$("=", 90n)), List$nil)), List$nil));
        var $265 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("h2", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "40px"), List$cons$(Pair$new$("font-family", "verdana"), List$cons$(Pair$new$("text-align", "center"), List$nil)))), List$cons$(DOM$text$("KIND language"), List$nil)), List$cons$(_line$3, List$cons$(Web$Kind$component$header_tabs$(_page$1), List$nil))));
        return $265;
    };
    const Web$Kind$component$header = x0 => Web$Kind$component$header$(x0);

    function Web$Kind$component$body_container$(_ele$1) {
        var $266 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "40px 20% 100px 20%"), List$nil)), _ele$1);
        return $266;
    };
    const Web$Kind$component$body_container = x0 => Web$Kind$component$body_container$(x0);
    const Web$Kind$draw_page_home = (() => {
        var _line$1 = (_txt$1 => {
            var $268 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(_txt$1), List$nil));
            return $268;
        });
        var _instructions$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$cons$(Pair$new$("padding", "5px"), List$cons$(Pair$new$("border", "1px solid"), List$nil)))), List$cons$(_line$1("npm i -g kind-lang"), List$cons$(_line$1("git clone https://github.com/uwu-tech/Kind"), List$cons$(_line$1("cd Kind/base"), List$cons$(_line$1("kind Main"), List$cons$(_line$1("kind Main --run"), List$nil))))));
        var _install$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Install"), List$cons$(_instructions$2, List$nil)));
        var _txt$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$nil)), List$cons$(Web$Kind$component$list$(List$cons$(Web$Kind$component$link$(" Github", "https://github.com/uwu-tech/Kind"), List$cons$(Web$Kind$component$link$(" Telegram", "https://t.me/formality_lang"), List$nil))), List$nil));
        var _join_us$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Join Us"), List$cons$(_txt$3, List$nil)));
        var $267 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(Web$Kind$component$header$(Web$KindWebsite$Page$home), List$cons$(Web$Kind$component$body_container$(List$cons$(_install$2, List$cons$(_join_us$3, List$nil))), List$nil)));
        return $267;
    })();

    function Web$Kind$component$draw_page$(_page$1) {
        var self = _page$1;
        switch (self._) {
            case 'Web.KindWebsite.Page.home':
                var $270 = Web$Kind$draw_page_home;
                var $269 = $270;
                break;
            case 'Web.KindWebsite.Page.apps':
                var $271 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "20px"), List$nil)), List$cons$(DOM$text$("Hello from Apps!"), List$nil));
                var $269 = $271;
                break;
        };
        return $269;
    };
    const Web$Kind$component$draw_page = x0 => Web$Kind$component$draw_page$(x0);

    function IO$(_A$1) {
        var $272 = null;
        return $272;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $273 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $273;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $275 = self.value;
                var $276 = _f$4($275);
                var $274 = $276;
                break;
            case 'IO.ask':
                var $277 = self.query;
                var $278 = self.param;
                var $279 = self.then;
                var $280 = IO$ask$($277, $278, (_x$8 => {
                    var $281 = IO$bind$($279(_x$8), _f$4);
                    return $281;
                }));
                var $274 = $280;
                break;
        };
        return $274;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $282 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $282;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $283 = _new$2(IO$bind)(IO$end);
        return $283;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $284 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $284;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $285 = _m$pure$2;
        return $285;
    }))(Dynamic$new$(Unit$new));

    function App$new$(_init$2, _draw$3, _when$4) {
        var $286 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $286;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$KindWebsite = (() => {
        var _init$1 = Web$KindWebsite$State$new$(Pair$new$(500, 400), Web$KindWebsite$Page$home);
        var _draw$2 = (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Web.KindWebsite.State.new':
                    var $289 = self.page;
                    var $290 = Web$Kind$component$draw_page$($289);
                    var $288 = $290;
                    break;
            };
            return $288;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.dom':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.post':
                    var $292 = App$pass;
                    var $291 = $292;
                    break;
            };
            return $291;
        });
        var $287 = App$new$(_init$1, _draw$2, _when$3);
        return $287;
    })();
    return {
        'Web.KindWebsite.State.new': Web$KindWebsite$State$new,
        'Pair.new': Pair$new,
        'Nat.apply': Nat$apply,
        'U32.new': U32$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.inc': Word$inc,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U32.inc': U32$inc,
        'Word.zero': Word$zero,
        'U32.zero': U32$zero,
        'Nat.to_u32': Nat$to_u32,
        'Web.KindWebsite.Page.home': Web$KindWebsite$Page$home,
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
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List.nil': List$nil,
        'Pair': Pair,
        'List.cons': List$cons,
        'DOM.text': DOM$text,
        'Web.Kind.component.title': Web$Kind$component$title,
        'List.for': List$for,
        'List': List,
        'Web.Kind.component.list': Web$Kind$component$list,
        'Web.Kind.component.link': Web$Kind$component$link,
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'Buffer32.alloc': Buffer32$alloc,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U32.eql': U32$eql,
        'U32.shr': U32$shr,
        'U32.needed_depth.go': U32$needed_depth$go,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U32.sub': U32$sub,
        'U32.needed_depth': U32$needed_depth,
        'Word.shift_left1.aux': Word$shift_left1$aux,
        'Word.shift_left1': Word$shift_left1,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'Word.mul.go': Word$mul$go,
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'VoxBox.new': VoxBox$new,
        'VoxBox.alloc_capacity': VoxBox$alloc_capacity,
        'String.nil': String$nil,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.repeat': String$repeat,
        'Web.Kind.component.header_tab': Web$Kind$component$header_tab,
        'Bool.and': Bool$and,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
        'Web.Kind.helper.is_current': Web$Kind$helper$is_current,
        'Web.Kind.component.header_tabs': Web$Kind$component$header_tabs,
        'Web.Kind.component.header': Web$Kind$component$header,
        'Web.Kind.component.body_container': Web$Kind$component$body_container,
        'Web.Kind.draw_page_home': Web$Kind$draw_page_home,
        'Web.Kind.component.draw_page': Web$Kind$component$draw_page,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'Unit.new': Unit$new,
        'App.pass': App$pass,
        'App.new': App$new,
        'Web.KindWebsite': Web$KindWebsite,
    };
})();

/***/ })

}]);
//# sourceMappingURL=870.index.js.map