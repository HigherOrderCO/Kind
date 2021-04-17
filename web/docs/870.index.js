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

    function U32$new$(_value$1) {
        var $35 = word_to_u32(_value$1);
        return $35;
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
                    var $36 = _x$4;
                    return $36;
                } else {
                    var $37 = (self - 1n);
                    var $38 = Nat$apply$($37, _f$3, _f$3(_x$4));
                    return $38;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

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

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $49 = Word$e;
            var $48 = $49;
        } else {
            var $50 = (self - 1n);
            var $51 = Word$o$(Word$zero$($50));
            var $48 = $51;
        };
        return $48;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $52 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $52;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $53 = 1n + _pred$1;
        return $53;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);
    const Web$KindWebsite$Page$home = ({
        _: 'Web.KindWebsite.Page.home'
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $54 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $54;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $55 = null;
        return $55;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $56 = null;
        return $56;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $57 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $57;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $58 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $58;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $60 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $62 = self.val;
                        var $63 = self.lft;
                        var $64 = self.rgt;
                        var $65 = BitsMap$tie$($62, BitsMap$set$($60, _val$3, $63), $64);
                        var $61 = $65;
                        break;
                    case 'BitsMap.new':
                        var $66 = BitsMap$tie$(Maybe$none, BitsMap$set$($60, _val$3, BitsMap$new), BitsMap$new);
                        var $61 = $66;
                        break;
                };
                var $59 = $61;
                break;
            case 'i':
                var $67 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $69 = self.val;
                        var $70 = self.lft;
                        var $71 = self.rgt;
                        var $72 = BitsMap$tie$($69, $70, BitsMap$set$($67, _val$3, $71));
                        var $68 = $72;
                        break;
                    case 'BitsMap.new':
                        var $73 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($67, _val$3, BitsMap$new));
                        var $68 = $73;
                        break;
                };
                var $59 = $68;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $75 = self.lft;
                        var $76 = self.rgt;
                        var $77 = BitsMap$tie$(Maybe$some$(_val$3), $75, $76);
                        var $74 = $77;
                        break;
                    case 'BitsMap.new':
                        var $78 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $74 = $78;
                        break;
                };
                var $59 = $74;
                break;
        };
        return $59;
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
                var $80 = self.pred;
                var $81 = (Word$to_bits$($80) + '0');
                var $79 = $81;
                break;
            case 'Word.i':
                var $82 = self.pred;
                var $83 = (Word$to_bits$($82) + '1');
                var $79 = $83;
                break;
            case 'Word.e':
                var $84 = Bits$e;
                var $79 = $84;
                break;
        };
        return $79;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $86 = Bits$e;
            var $85 = $86;
        } else {
            var $87 = self.charCodeAt(0);
            var $88 = self.slice(1);
            var $89 = (String$to_bits$($88) + (u16_to_bits($87)));
            var $85 = $89;
        };
        return $85;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $91 = self.head;
                var $92 = self.tail;
                var self = $91;
                switch (self._) {
                    case 'Pair.new':
                        var $94 = self.fst;
                        var $95 = self.snd;
                        var $96 = BitsMap$set$(String$to_bits$($94), $95, Map$from_list$($92));
                        var $93 = $96;
                        break;
                };
                var $90 = $93;
                break;
            case 'List.nil':
                var $97 = BitsMap$new;
                var $90 = $97;
                break;
        };
        return $90;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $98 = null;
        return $98;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $99 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $99;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $100 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $100;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function Web$Kind$component$title$(_title$1) {
        var $101 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "20px"), List$cons$(Pair$new$("font-family", "Helvetica"), List$cons$(Pair$new$("font-weight", "bold"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $101;
    };
    const Web$Kind$component$title = x0 => Web$Kind$component$title$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $102 = null;
        return $102;
    };
    const List = x0 => List$(x0);

    function Web$Kind$component$list$(_items$1) {
        var _li$2 = List$nil;
        var _li$3 = (() => {
            var $105 = _li$2;
            var $106 = _items$1;
            let _li$4 = $105;
            let _item$3;
            while ($106._ === 'List.cons') {
                _item$3 = $106.head;
                var $105 = List$cons$(DOM$node$("li", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "5px"), List$nil)), List$cons$(_item$3, List$nil)), _li$4);
                _li$4 = $105;
                $106 = $106.tail;
            }
            return _li$4;
        })();
        var $103 = DOM$node$("ul", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("list-style-type", "circle"), List$cons$(Pair$new$("margin-left", "20px"), List$nil))), _li$3);
        return $103;
    };
    const Web$Kind$component$list = x0 => Web$Kind$component$list$(x0);

    function Web$Kind$component$link$(_txt$1, _href$2) {
        var $107 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$nil)), List$cons$(DOM$text$(_txt$1), List$nil));
        return $107;
    };
    const Web$Kind$component$link = x0 => x1 => Web$Kind$component$link$(x0, x1);

    function Buffer32$new$(_depth$1, _array$2) {
        var $108 = u32array_to_buffer32(_array$2);
        return $108;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $109 = null;
        return $109;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $110 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $110;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $111 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $111;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $113 = Array$tip$(_x$3);
            var $112 = $113;
        } else {
            var $114 = (self - 1n);
            var _half$5 = Array$alloc$($114, _x$3);
            var $115 = Array$tie$(_half$5, _half$5);
            var $112 = $115;
        };
        return $112;
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
                        var $116 = self.pred;
                        var $117 = Word$bit_length$go$($116, Nat$succ$(_c$3), _n$4);
                        return $117;
                    case 'Word.i':
                        var $118 = self.pred;
                        var $119 = Word$bit_length$go$($118, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $119;
                    case 'Word.e':
                        var $120 = _n$4;
                        return $120;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $121 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $121;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $123 = u32_to_word(self);
                var $124 = Word$bit_length$($123);
                var $122 = $124;
                break;
        };
        return $122;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $126 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $128 = Word$i$(Word$shift_left1$aux$($126, Bool$false));
                    var $127 = $128;
                } else {
                    var $129 = Word$o$(Word$shift_left1$aux$($126, Bool$false));
                    var $127 = $129;
                };
                var $125 = $127;
                break;
            case 'Word.i':
                var $130 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $132 = Word$i$(Word$shift_left1$aux$($130, Bool$true));
                    var $131 = $132;
                } else {
                    var $133 = Word$o$(Word$shift_left1$aux$($130, Bool$true));
                    var $131 = $133;
                };
                var $125 = $131;
                break;
            case 'Word.e':
                var $134 = Word$e;
                var $125 = $134;
                break;
        };
        return $125;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $136 = self.pred;
                var $137 = Word$o$(Word$shift_left1$aux$($136, Bool$false));
                var $135 = $137;
                break;
            case 'Word.i':
                var $138 = self.pred;
                var $139 = Word$o$(Word$shift_left1$aux$($138, Bool$true));
                var $135 = $139;
                break;
            case 'Word.e':
                var $140 = Word$e;
                var $135 = $140;
                break;
        };
        return $135;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $142 = self.pred;
                var $143 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $145 = self.pred;
                            var $146 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $148 = Word$i$(Word$adder$(_a$pred$10, $145, Bool$false));
                                    var $147 = $148;
                                } else {
                                    var $149 = Word$o$(Word$adder$(_a$pred$10, $145, Bool$false));
                                    var $147 = $149;
                                };
                                return $147;
                            });
                            var $144 = $146;
                            break;
                        case 'Word.i':
                            var $150 = self.pred;
                            var $151 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $153 = Word$o$(Word$adder$(_a$pred$10, $150, Bool$true));
                                    var $152 = $153;
                                } else {
                                    var $154 = Word$i$(Word$adder$(_a$pred$10, $150, Bool$false));
                                    var $152 = $154;
                                };
                                return $152;
                            });
                            var $144 = $151;
                            break;
                        case 'Word.e':
                            var $155 = (_a$pred$8 => {
                                var $156 = Word$e;
                                return $156;
                            });
                            var $144 = $155;
                            break;
                    };
                    var $144 = $144($142);
                    return $144;
                });
                var $141 = $143;
                break;
            case 'Word.i':
                var $157 = self.pred;
                var $158 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $160 = self.pred;
                            var $161 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $163 = Word$o$(Word$adder$(_a$pred$10, $160, Bool$true));
                                    var $162 = $163;
                                } else {
                                    var $164 = Word$i$(Word$adder$(_a$pred$10, $160, Bool$false));
                                    var $162 = $164;
                                };
                                return $162;
                            });
                            var $159 = $161;
                            break;
                        case 'Word.i':
                            var $165 = self.pred;
                            var $166 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $168 = Word$i$(Word$adder$(_a$pred$10, $165, Bool$true));
                                    var $167 = $168;
                                } else {
                                    var $169 = Word$o$(Word$adder$(_a$pred$10, $165, Bool$true));
                                    var $167 = $169;
                                };
                                return $167;
                            });
                            var $159 = $166;
                            break;
                        case 'Word.e':
                            var $170 = (_a$pred$8 => {
                                var $171 = Word$e;
                                return $171;
                            });
                            var $159 = $170;
                            break;
                    };
                    var $159 = $159($157);
                    return $159;
                });
                var $141 = $158;
                break;
            case 'Word.e':
                var $172 = (_b$5 => {
                    var $173 = Word$e;
                    return $173;
                });
                var $141 = $172;
                break;
        };
        var $141 = $141(_b$3);
        return $141;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $174 = Word$adder$(_a$2, _b$3, Bool$false);
        return $174;
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
                        var $175 = self.pred;
                        var $176 = Word$mul$go$($175, Word$shift_left1$(_b$4), _acc$5);
                        return $176;
                    case 'Word.i':
                        var $177 = self.pred;
                        var $178 = Word$mul$go$($177, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $178;
                    case 'Word.e':
                        var $179 = _acc$5;
                        return $179;
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
                var $181 = self.pred;
                var $182 = Word$o$(Word$to_zero$($181));
                var $180 = $182;
                break;
            case 'Word.i':
                var $183 = self.pred;
                var $184 = Word$o$(Word$to_zero$($183));
                var $180 = $184;
                break;
            case 'Word.e':
                var $185 = Word$e;
                var $180 = $185;
                break;
        };
        return $180;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $186 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $186;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $187 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $187;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $188 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $188;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const String$nil = '';

    function String$cons$(_head$1, _tail$2) {
        var $189 = (String.fromCharCode(_head$1) + _tail$2);
        return $189;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $191 = String$nil;
            var $190 = $191;
        } else {
            var $192 = (self - 1n);
            var $193 = (_xs$1 + String$repeat$(_xs$1, $192));
            var $190 = $193;
        };
        return $190;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function Web$Kind$component$header_tab$(_is_active$1, _title$2) {
        var self = _is_active$1;
        if (self) {
            var $195 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "5px 50px 5px 0px"), List$cons$(Pair$new$("text-decoration", "underline"), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))))), List$cons$(DOM$text$(_title$2), List$nil));
            var $194 = $195;
        } else {
            var $196 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "5px 50px 5px 0px"), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_title$2), List$nil));
            var $194 = $196;
        };
        return $194;
    };
    const Web$Kind$component$header_tab = x0 => x1 => Web$Kind$component$header_tab$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $198 = Bool$false;
                var $197 = $198;
                break;
            case 'Cmp.eql':
                var $199 = Bool$true;
                var $197 = $199;
                break;
        };
        return $197;
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
                var $201 = self.pred;
                var $202 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $204 = self.pred;
                            var $205 = (_a$pred$10 => {
                                var $206 = Word$cmp$go$(_a$pred$10, $204, _c$4);
                                return $206;
                            });
                            var $203 = $205;
                            break;
                        case 'Word.i':
                            var $207 = self.pred;
                            var $208 = (_a$pred$10 => {
                                var $209 = Word$cmp$go$(_a$pred$10, $207, Cmp$ltn);
                                return $209;
                            });
                            var $203 = $208;
                            break;
                        case 'Word.e':
                            var $210 = (_a$pred$8 => {
                                var $211 = _c$4;
                                return $211;
                            });
                            var $203 = $210;
                            break;
                    };
                    var $203 = $203($201);
                    return $203;
                });
                var $200 = $202;
                break;
            case 'Word.i':
                var $212 = self.pred;
                var $213 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $215 = self.pred;
                            var $216 = (_a$pred$10 => {
                                var $217 = Word$cmp$go$(_a$pred$10, $215, Cmp$gtn);
                                return $217;
                            });
                            var $214 = $216;
                            break;
                        case 'Word.i':
                            var $218 = self.pred;
                            var $219 = (_a$pred$10 => {
                                var $220 = Word$cmp$go$(_a$pred$10, $218, _c$4);
                                return $220;
                            });
                            var $214 = $219;
                            break;
                        case 'Word.e':
                            var $221 = (_a$pred$8 => {
                                var $222 = _c$4;
                                return $222;
                            });
                            var $214 = $221;
                            break;
                    };
                    var $214 = $214($212);
                    return $214;
                });
                var $200 = $213;
                break;
            case 'Word.e':
                var $223 = (_b$5 => {
                    var $224 = _c$4;
                    return $224;
                });
                var $200 = $223;
                break;
        };
        var $200 = $200(_b$3);
        return $200;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $225 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $225;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $226 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $226;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Kind$helper$is_current$(_title$1, _page$2) {
        var self = _page$2;
        switch (self._) {
            case 'Web.KindWebsite.Page.home':
                var $228 = (_title$1 === "Home");
                var $227 = $228;
                break;
            case 'Web.KindWebsite.Page.apps':
                var $229 = (_title$1 === "Apps");
                var $227 = $229;
                break;
        };
        return $227;
    };
    const Web$Kind$helper$is_current = x0 => x1 => Web$Kind$helper$is_current$(x0, x1);

    function Web$Kind$component$header_tabs$(_page$1) {
        var _titles$2 = List$cons$("Apps", List$cons$("Home", List$nil));
        var _tabs$3 = List$nil;
        var _tabs$4 = (() => {
            var $232 = _tabs$3;
            var $233 = _titles$2;
            let _tabs$5 = $232;
            let _title$4;
            while ($233._ === 'List.cons') {
                _title$4 = $233.head;
                var $232 = List$cons$(Web$Kind$component$header_tab$(Web$Kind$helper$is_current$(_title$4, _page$1), _title$4), _tabs$5);
                _tabs$5 = $232;
                $233 = $233.tail;
            }
            return _tabs$5;
        })();
        var $230 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding-left", "20%"), List$nil)), _tabs$4);
        return $230;
    };
    const Web$Kind$component$header_tabs = x0 => Web$Kind$component$header_tabs$(x0);

    function Web$Kind$component$header$(_page$1) {
        var _vbox$2 = VoxBox$alloc_capacity$(100);
        var _line$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("padding", "10px 50px 10px 50px"), List$nil))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("color", "#9370DB"), List$nil)), List$cons$(DOM$text$(String$repeat$("=", 90n)), List$nil)), List$nil));
        var $234 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("h2", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "40px"), List$cons$(Pair$new$("font-family", "verdana"), List$cons$(Pair$new$("text-align", "center"), List$nil)))), List$cons$(DOM$text$("KIND language"), List$nil)), List$cons$(_line$3, List$cons$(Web$Kind$component$header_tabs$(_page$1), List$nil))));
        return $234;
    };
    const Web$Kind$component$header = x0 => Web$Kind$component$header$(x0);

    function Web$Kind$component$body_container$(_ele$1) {
        var $235 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "40px 20% 100px 20%"), List$nil)), _ele$1);
        return $235;
    };
    const Web$Kind$component$body_container = x0 => Web$Kind$component$body_container$(x0);
    const Web$Kind$draw_page_home = (() => {
        var _line$1 = (_txt$1 => {
            var $237 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(_txt$1), List$nil));
            return $237;
        });
        var _instructions$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$cons$(Pair$new$("padding", "5px"), List$cons$(Pair$new$("border", "1px solid"), List$nil)))), List$cons$(_line$1("npm i -g kind-lang"), List$cons$(_line$1("git clone https://github.com/uwu-tech/Kind"), List$cons$(_line$1("cd Kind/base"), List$cons$(_line$1("kind Main"), List$cons$(_line$1("kind Main --run"), List$nil))))));
        var _install$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Install"), List$cons$(_instructions$2, List$nil)));
        var _txt$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$nil)), List$cons$(Web$Kind$component$list$(List$cons$(Web$Kind$component$link$(" Github", "https://github.com/uwu-tech/Kind"), List$cons$(Web$Kind$component$link$(" Telegram", "https://t.me/formality_lang"), List$nil))), List$nil));
        var _join_us$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Join Us"), List$cons$(_txt$3, List$nil)));
        var $236 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(Web$Kind$component$header$(Web$KindWebsite$Page$home), List$cons$(Web$Kind$component$body_container$(List$cons$(_install$2, List$cons$(_join_us$3, List$nil))), List$nil)));
        return $236;
    })();

    function Web$Kind$component$draw_page$(_page$1) {
        var self = _page$1;
        switch (self._) {
            case 'Web.KindWebsite.Page.home':
                var $239 = Web$Kind$draw_page_home;
                var $238 = $239;
                break;
            case 'Web.KindWebsite.Page.apps':
                var $240 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "20px"), List$nil)), List$cons$(DOM$text$("Hello from Apps!"), List$nil));
                var $238 = $240;
                break;
        };
        return $238;
    };
    const Web$Kind$component$draw_page = x0 => Web$Kind$component$draw_page$(x0);

    function IO$(_A$1) {
        var $241 = null;
        return $241;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $242 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $242;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $244 = self.value;
                var $245 = _f$4($244);
                var $243 = $245;
                break;
            case 'IO.ask':
                var $246 = self.query;
                var $247 = self.param;
                var $248 = self.then;
                var $249 = IO$ask$($246, $247, (_x$8 => {
                    var $250 = IO$bind$($248(_x$8), _f$4);
                    return $250;
                }));
                var $243 = $249;
                break;
        };
        return $243;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $251 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $251;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $252 = _new$2(IO$bind)(IO$end);
        return $252;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $253 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $253;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $254 = _m$pure$2;
        return $254;
    }))(Dynamic$new$(Unit$new));

    function App$new$(_init$2, _draw$3, _when$4) {
        var $255 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $255;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$KindWebsite = (() => {
        var _init$1 = Web$KindWebsite$State$new$(Pair$new$(500, 400), Web$KindWebsite$Page$home);
        var _draw$2 = (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Web.KindWebsite.State.new':
                    var $258 = self.page;
                    var $259 = Web$Kind$component$draw_page$($258);
                    var $257 = $259;
                    break;
            };
            return $257;
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
                    var $261 = App$pass;
                    var $260 = $261;
                    break;
            };
            return $260;
        });
        var $256 = App$new$(_init$1, _draw$2, _when$3);
        return $256;
    })();
    return {
        'Web.KindWebsite.State.new': Web$KindWebsite$State$new,
        'Pair.new': Pair$new,
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
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'U32.bit_length': U32$bit_length,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
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
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
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