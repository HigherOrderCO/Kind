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

    function Buffer32$new$(_depth$1, _array$2) {
        var $103 = u32array_to_buffer32(_array$2);
        return $103;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $104 = null;
        return $104;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $105 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $105;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $106 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $106;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $108 = Array$tip$(_x$3);
            var $107 = $108;
        } else {
            var $109 = (self - 1n);
            var _half$5 = Array$alloc$($109, _x$3);
            var $110 = Array$tie$(_half$5, _half$5);
            var $107 = $110;
        };
        return $107;
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
                var $112 = Bool$false;
                var $111 = $112;
                break;
            case 'Cmp.eql':
                var $113 = Bool$true;
                var $111 = $113;
                break;
        };
        return $111;
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
                var $115 = self.pred;
                var $116 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $118 = self.pred;
                            var $119 = (_a$pred$10 => {
                                var $120 = Word$cmp$go$(_a$pred$10, $118, _c$4);
                                return $120;
                            });
                            var $117 = $119;
                            break;
                        case 'Word.i':
                            var $121 = self.pred;
                            var $122 = (_a$pred$10 => {
                                var $123 = Word$cmp$go$(_a$pred$10, $121, Cmp$ltn);
                                return $123;
                            });
                            var $117 = $122;
                            break;
                        case 'Word.e':
                            var $124 = (_a$pred$8 => {
                                var $125 = _c$4;
                                return $125;
                            });
                            var $117 = $124;
                            break;
                    };
                    var $117 = $117($115);
                    return $117;
                });
                var $114 = $116;
                break;
            case 'Word.i':
                var $126 = self.pred;
                var $127 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $129 = self.pred;
                            var $130 = (_a$pred$10 => {
                                var $131 = Word$cmp$go$(_a$pred$10, $129, Cmp$gtn);
                                return $131;
                            });
                            var $128 = $130;
                            break;
                        case 'Word.i':
                            var $132 = self.pred;
                            var $133 = (_a$pred$10 => {
                                var $134 = Word$cmp$go$(_a$pred$10, $132, _c$4);
                                return $134;
                            });
                            var $128 = $133;
                            break;
                        case 'Word.e':
                            var $135 = (_a$pred$8 => {
                                var $136 = _c$4;
                                return $136;
                            });
                            var $128 = $135;
                            break;
                    };
                    var $128 = $128($126);
                    return $128;
                });
                var $114 = $127;
                break;
            case 'Word.e':
                var $137 = (_b$5 => {
                    var $138 = _c$4;
                    return $138;
                });
                var $114 = $137;
                break;
        };
        var $114 = $114(_b$3);
        return $114;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $139 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $139;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $140 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $140;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function U32$needed_depth$go$(_n$1) {
        var self = (_n$1 === 0);
        if (self) {
            var $142 = 0n;
            var $141 = $142;
        } else {
            var $143 = Nat$succ$(U32$needed_depth$go$((_n$1 >>> 1)));
            var $141 = $143;
        };
        return $141;
    };
    const U32$needed_depth$go = x0 => U32$needed_depth$go$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $145 = self.pred;
                var $146 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $148 = self.pred;
                            var $149 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $151 = Word$i$(Word$subber$(_a$pred$10, $148, Bool$true));
                                    var $150 = $151;
                                } else {
                                    var $152 = Word$o$(Word$subber$(_a$pred$10, $148, Bool$false));
                                    var $150 = $152;
                                };
                                return $150;
                            });
                            var $147 = $149;
                            break;
                        case 'Word.i':
                            var $153 = self.pred;
                            var $154 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $156 = Word$o$(Word$subber$(_a$pred$10, $153, Bool$true));
                                    var $155 = $156;
                                } else {
                                    var $157 = Word$i$(Word$subber$(_a$pred$10, $153, Bool$true));
                                    var $155 = $157;
                                };
                                return $155;
                            });
                            var $147 = $154;
                            break;
                        case 'Word.e':
                            var $158 = (_a$pred$8 => {
                                var $159 = Word$e;
                                return $159;
                            });
                            var $147 = $158;
                            break;
                    };
                    var $147 = $147($145);
                    return $147;
                });
                var $144 = $146;
                break;
            case 'Word.i':
                var $160 = self.pred;
                var $161 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $163 = self.pred;
                            var $164 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $166 = Word$o$(Word$subber$(_a$pred$10, $163, Bool$false));
                                    var $165 = $166;
                                } else {
                                    var $167 = Word$i$(Word$subber$(_a$pred$10, $163, Bool$false));
                                    var $165 = $167;
                                };
                                return $165;
                            });
                            var $162 = $164;
                            break;
                        case 'Word.i':
                            var $168 = self.pred;
                            var $169 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $171 = Word$i$(Word$subber$(_a$pred$10, $168, Bool$true));
                                    var $170 = $171;
                                } else {
                                    var $172 = Word$o$(Word$subber$(_a$pred$10, $168, Bool$false));
                                    var $170 = $172;
                                };
                                return $170;
                            });
                            var $162 = $169;
                            break;
                        case 'Word.e':
                            var $173 = (_a$pred$8 => {
                                var $174 = Word$e;
                                return $174;
                            });
                            var $162 = $173;
                            break;
                    };
                    var $162 = $162($160);
                    return $162;
                });
                var $144 = $161;
                break;
            case 'Word.e':
                var $175 = (_b$5 => {
                    var $176 = Word$e;
                    return $176;
                });
                var $144 = $175;
                break;
        };
        var $144 = $144(_b$3);
        return $144;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $177 = Word$subber$(_a$2, _b$3, Bool$false);
        return $177;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function U32$needed_depth$(_size$1) {
        var $178 = U32$needed_depth$go$((Math.max(_size$1 - 1, 0)));
        return $178;
    };
    const U32$needed_depth = x0 => U32$needed_depth$(x0);

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $180 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $182 = Word$i$(Word$shift_left1$aux$($180, Bool$false));
                    var $181 = $182;
                } else {
                    var $183 = Word$o$(Word$shift_left1$aux$($180, Bool$false));
                    var $181 = $183;
                };
                var $179 = $181;
                break;
            case 'Word.i':
                var $184 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $186 = Word$i$(Word$shift_left1$aux$($184, Bool$true));
                    var $185 = $186;
                } else {
                    var $187 = Word$o$(Word$shift_left1$aux$($184, Bool$true));
                    var $185 = $187;
                };
                var $179 = $185;
                break;
            case 'Word.e':
                var $188 = Word$e;
                var $179 = $188;
                break;
        };
        return $179;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $190 = self.pred;
                var $191 = Word$o$(Word$shift_left1$aux$($190, Bool$false));
                var $189 = $191;
                break;
            case 'Word.i':
                var $192 = self.pred;
                var $193 = Word$o$(Word$shift_left1$aux$($192, Bool$true));
                var $189 = $193;
                break;
            case 'Word.e':
                var $194 = Word$e;
                var $189 = $194;
                break;
        };
        return $189;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $196 = self.pred;
                var $197 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $199 = self.pred;
                            var $200 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $202 = Word$i$(Word$adder$(_a$pred$10, $199, Bool$false));
                                    var $201 = $202;
                                } else {
                                    var $203 = Word$o$(Word$adder$(_a$pred$10, $199, Bool$false));
                                    var $201 = $203;
                                };
                                return $201;
                            });
                            var $198 = $200;
                            break;
                        case 'Word.i':
                            var $204 = self.pred;
                            var $205 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $207 = Word$o$(Word$adder$(_a$pred$10, $204, Bool$true));
                                    var $206 = $207;
                                } else {
                                    var $208 = Word$i$(Word$adder$(_a$pred$10, $204, Bool$false));
                                    var $206 = $208;
                                };
                                return $206;
                            });
                            var $198 = $205;
                            break;
                        case 'Word.e':
                            var $209 = (_a$pred$8 => {
                                var $210 = Word$e;
                                return $210;
                            });
                            var $198 = $209;
                            break;
                    };
                    var $198 = $198($196);
                    return $198;
                });
                var $195 = $197;
                break;
            case 'Word.i':
                var $211 = self.pred;
                var $212 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $214 = self.pred;
                            var $215 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $217 = Word$o$(Word$adder$(_a$pred$10, $214, Bool$true));
                                    var $216 = $217;
                                } else {
                                    var $218 = Word$i$(Word$adder$(_a$pred$10, $214, Bool$false));
                                    var $216 = $218;
                                };
                                return $216;
                            });
                            var $213 = $215;
                            break;
                        case 'Word.i':
                            var $219 = self.pred;
                            var $220 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $222 = Word$i$(Word$adder$(_a$pred$10, $219, Bool$true));
                                    var $221 = $222;
                                } else {
                                    var $223 = Word$o$(Word$adder$(_a$pred$10, $219, Bool$true));
                                    var $221 = $223;
                                };
                                return $221;
                            });
                            var $213 = $220;
                            break;
                        case 'Word.e':
                            var $224 = (_a$pred$8 => {
                                var $225 = Word$e;
                                return $225;
                            });
                            var $213 = $224;
                            break;
                    };
                    var $213 = $213($211);
                    return $213;
                });
                var $195 = $212;
                break;
            case 'Word.e':
                var $226 = (_b$5 => {
                    var $227 = Word$e;
                    return $227;
                });
                var $195 = $226;
                break;
        };
        var $195 = $195(_b$3);
        return $195;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $228 = Word$adder$(_a$2, _b$3, Bool$false);
        return $228;
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
                        var $229 = self.pred;
                        var $230 = Word$mul$go$($229, Word$shift_left1$(_b$4), _acc$5);
                        return $230;
                    case 'Word.i':
                        var $231 = self.pred;
                        var $232 = Word$mul$go$($231, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $232;
                    case 'Word.e':
                        var $233 = _acc$5;
                        return $233;
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
                var $235 = self.pred;
                var $236 = Word$o$(Word$to_zero$($235));
                var $234 = $236;
                break;
            case 'Word.i':
                var $237 = self.pred;
                var $238 = Word$o$(Word$to_zero$($237));
                var $234 = $238;
                break;
            case 'Word.e':
                var $239 = Word$e;
                var $234 = $239;
                break;
        };
        return $234;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $240 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $240;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $241 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $241;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $242 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $242;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const String$nil = '';

    function String$cons$(_head$1, _tail$2) {
        var $243 = (String.fromCharCode(_head$1) + _tail$2);
        return $243;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $245 = String$nil;
            var $244 = $245;
        } else {
            var $246 = (self - 1n);
            var $247 = (_xs$1 + String$repeat$(_xs$1, $246));
            var $244 = $247;
        };
        return $244;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function Web$Kind$component$header$(_page$1) {
        var _vbox$2 = VoxBox$alloc_capacity$(100);
        var _line$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("padding", "10px 50px 10px 50px"), List$nil))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("color", "#9370DB"), List$nil)), List$cons$(DOM$text$(String$repeat$("=", 90n)), List$nil)), List$nil));
        var $248 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("h2", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "40px"), List$cons$(Pair$new$("font-family", "verdana"), List$cons$(Pair$new$("text-align", "center"), List$nil)))), List$cons$(DOM$text$("KIND language"), List$nil)), List$cons$(_line$3, List$nil)));
        return $248;
    };
    const Web$Kind$component$header = x0 => Web$Kind$component$header$(x0);
    const Web$Kind$component$draw_page$home = (() => {
        var _home$1 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "20px"), List$nil)), List$cons$(DOM$text$("Hello from Home!"), List$nil));
        var $249 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(Web$Kind$component$header$(Web$KindWebsite$Page$home), List$cons$(_home$1, List$nil)));
        return $249;
    })();

    function Web$Kind$component$draw_page$(_page$1) {
        var self = _page$1;
        switch (self._) {
            case 'Web.KindWebsite.Page.home':
                var $251 = Web$Kind$component$draw_page$home;
                var $250 = $251;
                break;
            case 'Web.KindWebsite.Page.apps':
                var $252 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "20px"), List$nil)), List$cons$(DOM$text$("Hello from Apps!"), List$nil));
                var $250 = $252;
                break;
            case 'Web.KindWebsite.Page.team':
                var $253 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "20px"), List$nil)), List$cons$(DOM$text$("Hello from Team!"), List$nil));
                var $250 = $253;
                break;
        };
        return $250;
    };
    const Web$Kind$component$draw_page = x0 => Web$Kind$component$draw_page$(x0);

    function IO$(_A$1) {
        var $254 = null;
        return $254;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $255 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $255;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $257 = self.value;
                var $258 = _f$4($257);
                var $256 = $258;
                break;
            case 'IO.ask':
                var $259 = self.query;
                var $260 = self.param;
                var $261 = self.then;
                var $262 = IO$ask$($259, $260, (_x$8 => {
                    var $263 = IO$bind$($261(_x$8), _f$4);
                    return $263;
                }));
                var $256 = $262;
                break;
        };
        return $256;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $264 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $264;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $265 = _new$2(IO$bind)(IO$end);
        return $265;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $266 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $266;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $267 = _m$pure$2;
        return $267;
    }))(Dynamic$new$(Unit$new));

    function App$new$(_init$2, _draw$3, _when$4) {
        var $268 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $268;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$KindWebsite = (() => {
        var _init$1 = Web$KindWebsite$State$new$(Pair$new$(500, 400), Web$KindWebsite$Page$home);
        var _draw$2 = (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Web.KindWebsite.State.new':
                    var $271 = self.page;
                    var $272 = Web$Kind$component$draw_page$($271);
                    var $270 = $272;
                    break;
            };
            return $270;
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
                    var $274 = App$pass;
                    var $273 = $274;
                    break;
            };
            return $273;
        });
        var $269 = App$new$(_init$1, _draw$2, _when$3);
        return $269;
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
        'Web.Kind.component.header': Web$Kind$component$header,
        'Web.Kind.component.draw_page.home': Web$Kind$component$draw_page$home,
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