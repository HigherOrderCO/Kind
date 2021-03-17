(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[160],{

/***/ 160:
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
    const inst_unit = x => x(1);
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

    function Buffer32$new$(_depth$1, _array$2) {
        var $33 = u32array_to_buffer32(_array$2);
        return $33;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $34 = null;
        return $34;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $35 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $35;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $36 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $36;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $38 = Array$tip$(_x$3);
            var $37 = $38;
        } else {
            var $39 = (self - 1n);
            var _half$5 = Array$alloc$($39, _x$3);
            var $40 = Array$tie$(_half$5, _half$5);
            var $37 = $40;
        };
        return $37;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $41 = word_to_u32(_value$1);
        return $41;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $42 = null;
        return $42;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $43 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $43;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $45 = Word$e;
            var $44 = $45;
        } else {
            var $46 = (self - 1n);
            var $47 = Word$o$(Word$zero$($46));
            var $44 = $47;
        };
        return $44;
    };
    const Word$zero = x0 => Word$zero$(x0);
    const U32$zero = U32$new$(Word$zero$(32n));
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));
    const Bool$false = false;
    const Bool$true = true;

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $49 = Bool$false;
                var $48 = $49;
                break;
            case 'Cmp.eql':
                var $50 = Bool$true;
                var $48 = $50;
                break;
        };
        return $48;
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
                var $52 = self.pred;
                var $53 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $55 = self.pred;
                            var $56 = (_a$pred$10 => {
                                var $57 = Word$cmp$go$(_a$pred$10, $55, _c$4);
                                return $57;
                            });
                            var $54 = $56;
                            break;
                        case 'Word.i':
                            var $58 = self.pred;
                            var $59 = (_a$pred$10 => {
                                var $60 = Word$cmp$go$(_a$pred$10, $58, Cmp$ltn);
                                return $60;
                            });
                            var $54 = $59;
                            break;
                        case 'Word.e':
                            var $61 = (_a$pred$8 => {
                                var $62 = _c$4;
                                return $62;
                            });
                            var $54 = $61;
                            break;
                    };
                    var $54 = $54($52);
                    return $54;
                });
                var $51 = $53;
                break;
            case 'Word.i':
                var $63 = self.pred;
                var $64 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $66 = self.pred;
                            var $67 = (_a$pred$10 => {
                                var $68 = Word$cmp$go$(_a$pred$10, $66, Cmp$gtn);
                                return $68;
                            });
                            var $65 = $67;
                            break;
                        case 'Word.i':
                            var $69 = self.pred;
                            var $70 = (_a$pred$10 => {
                                var $71 = Word$cmp$go$(_a$pred$10, $69, _c$4);
                                return $71;
                            });
                            var $65 = $70;
                            break;
                        case 'Word.e':
                            var $72 = (_a$pred$8 => {
                                var $73 = _c$4;
                                return $73;
                            });
                            var $65 = $72;
                            break;
                    };
                    var $65 = $65($63);
                    return $65;
                });
                var $51 = $64;
                break;
            case 'Word.e':
                var $74 = (_b$5 => {
                    var $75 = _c$4;
                    return $75;
                });
                var $51 = $74;
                break;
        };
        var $51 = $51(_b$3);
        return $51;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $76 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $76;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $77 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $77;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $78 = 1n + _pred$1;
        return $78;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U32$eql = a0 => a1 => (a0 === a1);

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
                    var $79 = _x$4;
                    return $79;
                } else {
                    var $80 = (self - 1n);
                    var $81 = Nat$apply$($80, _f$3, _f$3(_x$4));
                    return $81;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$i$(_pred$2) {
        var $82 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $82;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $84 = self.pred;
                var $85 = Word$i$($84);
                var $83 = $85;
                break;
            case 'Word.i':
                var $86 = self.pred;
                var $87 = Word$o$(Word$inc$($86));
                var $83 = $87;
                break;
            case 'Word.e':
                var $88 = Word$e;
                var $83 = $88;
                break;
        };
        return $83;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function U32$inc$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $90 = u32_to_word(self);
                var $91 = U32$new$(Word$inc$($90));
                var $89 = $91;
                break;
        };
        return $89;
    };
    const U32$inc = x0 => U32$inc$(x0);
    const Nat$to_u32 = a0 => (Number(a0));
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function U32$needed_depth$go$(_n$1) {
        var self = (_n$1 === 0);
        if (self) {
            var $93 = 0n;
            var $92 = $93;
        } else {
            var $94 = Nat$succ$(U32$needed_depth$go$((_n$1 >>> 1)));
            var $92 = $94;
        };
        return $92;
    };
    const U32$needed_depth$go = x0 => U32$needed_depth$go$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $96 = self.pred;
                var $97 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $99 = self.pred;
                            var $100 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $102 = Word$i$(Word$subber$(_a$pred$10, $99, Bool$true));
                                    var $101 = $102;
                                } else {
                                    var $103 = Word$o$(Word$subber$(_a$pred$10, $99, Bool$false));
                                    var $101 = $103;
                                };
                                return $101;
                            });
                            var $98 = $100;
                            break;
                        case 'Word.i':
                            var $104 = self.pred;
                            var $105 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $107 = Word$o$(Word$subber$(_a$pred$10, $104, Bool$true));
                                    var $106 = $107;
                                } else {
                                    var $108 = Word$i$(Word$subber$(_a$pred$10, $104, Bool$true));
                                    var $106 = $108;
                                };
                                return $106;
                            });
                            var $98 = $105;
                            break;
                        case 'Word.e':
                            var $109 = (_a$pred$8 => {
                                var $110 = Word$e;
                                return $110;
                            });
                            var $98 = $109;
                            break;
                    };
                    var $98 = $98($96);
                    return $98;
                });
                var $95 = $97;
                break;
            case 'Word.i':
                var $111 = self.pred;
                var $112 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $114 = self.pred;
                            var $115 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $117 = Word$o$(Word$subber$(_a$pred$10, $114, Bool$false));
                                    var $116 = $117;
                                } else {
                                    var $118 = Word$i$(Word$subber$(_a$pred$10, $114, Bool$false));
                                    var $116 = $118;
                                };
                                return $116;
                            });
                            var $113 = $115;
                            break;
                        case 'Word.i':
                            var $119 = self.pred;
                            var $120 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $122 = Word$i$(Word$subber$(_a$pred$10, $119, Bool$true));
                                    var $121 = $122;
                                } else {
                                    var $123 = Word$o$(Word$subber$(_a$pred$10, $119, Bool$false));
                                    var $121 = $123;
                                };
                                return $121;
                            });
                            var $113 = $120;
                            break;
                        case 'Word.e':
                            var $124 = (_a$pred$8 => {
                                var $125 = Word$e;
                                return $125;
                            });
                            var $113 = $124;
                            break;
                    };
                    var $113 = $113($111);
                    return $113;
                });
                var $95 = $112;
                break;
            case 'Word.e':
                var $126 = (_b$5 => {
                    var $127 = Word$e;
                    return $127;
                });
                var $95 = $126;
                break;
        };
        var $95 = $95(_b$3);
        return $95;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $128 = Word$subber$(_a$2, _b$3, Bool$false);
        return $128;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function U32$needed_depth$(_size$1) {
        var $129 = U32$needed_depth$go$((Math.max(_size$1 - 1, 0)));
        return $129;
    };
    const U32$needed_depth = x0 => U32$needed_depth$(x0);

    function Word$mul$(_a$2, _b$3) {
        var Word$mul$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$mul = _a$2 => _b$3 => Word$mul$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$mul$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function Image3D$new$(_length$1, _capacity$2, _buffer$3) {
        var $130 = ({
            _: 'Image3D.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $130;
    };
    const Image3D$new = x0 => x1 => x2 => Image3D$new$(x0, x1, x2);

    function Image3D$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $131 = Image3D$new$(0, _capacity$1, _buffer$2);
        return $131;
    };
    const Image3D$alloc_capacity = x0 => Image3D$alloc_capacity$(x0);
    const Map$new = ({
        _: 'Map.new'
    });

    function Pair$(_A$1, _B$2) {
        var $132 = null;
        return $132;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $134 = self.capacity;
                var $135 = self.buffer;
                var $136 = Image3D$new$(_length$1, $134, $135);
                var $133 = $136;
                break;
        };
        return $133;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $137 = Image3D$set_length$(0, _img$1);
        return $137;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $138 = null;
        return $138;
    };
    const List = x0 => List$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $139 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $139;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.tie':
                var $141 = self.val;
                var $142 = self.lft;
                var $143 = self.rgt;
                var self = $141;
                switch (self._) {
                    case 'Maybe.some':
                        var $145 = self.value;
                        var $146 = List$cons$($145, _list$3);
                        var _list0$7 = $146;
                        break;
                    case 'Maybe.none':
                        var $147 = _list$3;
                        var _list0$7 = $147;
                        break;
                };
                var _list1$8 = Map$values$go$($142, _list0$7);
                var _list2$9 = Map$values$go$($143, _list1$8);
                var $144 = _list2$9;
                var $140 = $144;
                break;
            case 'Map.new':
                var $148 = _list$3;
                var $140 = $148;
                break;
        };
        return $140;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function Map$values$(_xs$2) {
        var $149 = Map$values$go$(_xs$2, List$nil);
        return $149;
    };
    const Map$values = x0 => Map$values$(x0);

    function Image3D$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'Image3D.new':
                var $151 = self.length;
                var $152 = $151;
                var $150 = $152;
                break;
        };
        return $150;
    };
    const Image3D$get_len = x0 => Image3D$get_len$(x0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $154 = Word$e;
            var $153 = $154;
        } else {
            var $155 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $157 = self.pred;
                    var $158 = Word$o$(Word$trim$($155, $157));
                    var $156 = $158;
                    break;
                case 'Word.i':
                    var $159 = self.pred;
                    var $160 = Word$i$(Word$trim$($155, $159));
                    var $156 = $160;
                    break;
                case 'Word.e':
                    var $161 = Word$o$(Word$trim$($155, Word$e));
                    var $156 = $161;
                    break;
            };
            var $153 = $156;
        };
        return $153;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $163 = self.value;
                var $164 = $163;
                var $162 = $164;
                break;
            case 'Array.tie':
                var $165 = Unit$new;
                var $162 = $165;
                break;
        };
        return $162;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $166 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $166;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $168 = self.lft;
                var $169 = self.rgt;
                var $170 = Pair$new$($168, $169);
                var $167 = $170;
                break;
            case 'Array.tip':
                var $171 = Unit$new;
                var $167 = $171;
                break;
        };
        return $167;
    };
    const Array$extract_tie = x0 => Array$extract_tie$(x0);

    function Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6) {
        var Word$foldl$ = (_nil$3, _w0$4, _w1$5, _word$6) => ({
            ctr: 'TCO',
            arg: [_nil$3, _w0$4, _w1$5, _word$6]
        });
        var Word$foldl = _nil$3 => _w0$4 => _w1$5 => _word$6 => Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6);
        var arg = [_nil$3, _w0$4, _w1$5, _word$6];
        while (true) {
            let [_nil$3, _w0$4, _w1$5, _word$6] = arg;
            var R = (() => {
                var self = _word$6;
                switch (self._) {
                    case 'Word.o':
                        var $172 = self.pred;
                        var $173 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $172);
                        return $173;
                    case 'Word.i':
                        var $174 = self.pred;
                        var $175 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $174);
                        return $175;
                    case 'Word.e':
                        var $176 = _nil$3;
                        return $176;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$get$(_idx$3, _arr$4) {
        var $177 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $179 = self.fst;
                    var $180 = _rec$6($179);
                    var $178 = $180;
                    break;
            };
            return $178;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $182 = self.snd;
                    var $183 = _rec$6($182);
                    var $181 = $183;
                    break;
            };
            return $181;
        }), _idx$3)(_arr$4);
        return $177;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const Image3D$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $185 = self.pred;
                var $186 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $188 = self.pred;
                            var $189 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $191 = Word$i$(Word$adder$(_a$pred$10, $188, Bool$false));
                                    var $190 = $191;
                                } else {
                                    var $192 = Word$o$(Word$adder$(_a$pred$10, $188, Bool$false));
                                    var $190 = $192;
                                };
                                return $190;
                            });
                            var $187 = $189;
                            break;
                        case 'Word.i':
                            var $193 = self.pred;
                            var $194 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $196 = Word$o$(Word$adder$(_a$pred$10, $193, Bool$true));
                                    var $195 = $196;
                                } else {
                                    var $197 = Word$i$(Word$adder$(_a$pred$10, $193, Bool$false));
                                    var $195 = $197;
                                };
                                return $195;
                            });
                            var $187 = $194;
                            break;
                        case 'Word.e':
                            var $198 = (_a$pred$8 => {
                                var $199 = Word$e;
                                return $199;
                            });
                            var $187 = $198;
                            break;
                    };
                    var $187 = $187($185);
                    return $187;
                });
                var $184 = $186;
                break;
            case 'Word.i':
                var $200 = self.pred;
                var $201 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $203 = self.pred;
                            var $204 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $206 = Word$o$(Word$adder$(_a$pred$10, $203, Bool$true));
                                    var $205 = $206;
                                } else {
                                    var $207 = Word$i$(Word$adder$(_a$pred$10, $203, Bool$false));
                                    var $205 = $207;
                                };
                                return $205;
                            });
                            var $202 = $204;
                            break;
                        case 'Word.i':
                            var $208 = self.pred;
                            var $209 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $211 = Word$i$(Word$adder$(_a$pred$10, $208, Bool$true));
                                    var $210 = $211;
                                } else {
                                    var $212 = Word$o$(Word$adder$(_a$pred$10, $208, Bool$true));
                                    var $210 = $212;
                                };
                                return $210;
                            });
                            var $202 = $209;
                            break;
                        case 'Word.e':
                            var $213 = (_a$pred$8 => {
                                var $214 = Word$e;
                                return $214;
                            });
                            var $202 = $213;
                            break;
                    };
                    var $202 = $202($200);
                    return $202;
                });
                var $184 = $201;
                break;
            case 'Word.e':
                var $215 = (_b$5 => {
                    var $216 = Word$e;
                    return $216;
                });
                var $184 = $215;
                break;
        };
        var $184 = $184(_b$3);
        return $184;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $217 = Word$adder$(_a$2, _b$3, Bool$false);
        return $217;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const Image3D$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var Word$and$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$and = _a$2 => _b$3 => Word$and$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$and$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);

    function Word$or$(_a$2, _b$3) {
        var Word$or$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$or = _a$2 => _b$3 => Word$or$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$or$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => (a0 << a1);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $218 = Word$foldl$((_arr$6 => {
            var $219 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $219;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $221 = self.fst;
                    var $222 = self.snd;
                    var $223 = Array$tie$(_rec$7($221), $222);
                    var $220 = $223;
                    break;
            };
            return $220;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $225 = self.fst;
                    var $226 = self.snd;
                    var $227 = Array$tie$($225, _rec$7($226));
                    var $224 = $227;
                    break;
            };
            return $224;
        }), _idx$3)(_arr$5);
        return $218;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $228 = Array$mut$(_idx$3, (_x$6 => {
            var $229 = _val$4;
            return $229;
        }), _arr$5);
        return $228;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const Image3D$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const Image3D$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const Image3D$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function Image3D$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = Image3D$get_len$(_src$4);
        var _img$7 = (() => {
            var $231 = _img$5;
            var $232 = 0;
            var $233 = _len$6;
            let _img$8 = $231;
            for (let _i$7 = $232; _i$7 < $233; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $231 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $231;
            };
            return _img$8;
        })();
        var $230 = _img$7;
        return $230;
    };
    const Image3D$Draw$image = x0 => x1 => x2 => x3 => x4 => Image3D$Draw$image$(x0, x1, x2, x3, x4);

    function Word$div$(_a$2, _b$3) {
        var Word$div$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$div = _a$2 => _b$3 => Word$div$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$div$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => (a0.length);
    const U32$slice = a0 => a1 => a2 => (a2.slice(a0, a1));
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function Image3D$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $234 = (parseInt(_chr$3, 16));
        return $234;
    };
    const Image3D$parse_byte = x0 => x1 => Image3D$parse_byte$(x0, x1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Image3D$parse$(_voxdata$1) {
        var _siz$2 = (((_voxdata$1.length) / 12) >>> 0);
        var _img$3 = Image3D$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $236 = _img$3;
            var $237 = 0;
            var $238 = _siz$2;
            let _img$5 = $236;
            for (let _i$4 = $237; _i$4 < $238; ++_i$4) {
                var _x$6 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $236 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $236;
            };
            return _img$5;
        })();
        var $235 = _img$4;
        return $235;
    };
    const Image3D$parse = x0 => Image3D$parse$(x0);
    const Web$Jogo$hero$hex = "0d00000000000e00000000000f00000000001000000000001100000000000c01000000000d01000000001101000000000b02000000000c02000000001202000000000b03000000001203000000000b04000000000c04000000001104000000000c05000000000d05000000000e05000000001005000000001105000000000e06000000000f06000000000e07000000000e08000000000f08000000000d09000000000e09000000000f09000000000c0a000000000d0a000000000e0a000000000f0a00000000100a000000000c0b000000000e0b00000000100b000000000b0c000000000c0c000000000e0c00000000100c00000000110c000000000b0d000000000e0d00000000110d000000000a0e000000000b0e000000000e0e00000000110e00000000120e000000000a0f000000000e0f00000000120f000000000910000000000a10000000000e10000000001210000000001310000000000911000000000e11000000001311000000000e12000000000d13000000000e13000000000f13000000000d14000000000f14000000000d15000000000f15000000000c16000000000d16000000000f16000000000c17000000000f17000000000c18000000000f18000000000c19000000001019000000000c1a00000000101a000000000b1b000000000c1b00000000101b000000000b1c00000000101c000000000b1d00000000101d00000000111d000000000b1e00000000111e000000000a1f000000000b1f00000000111f00000000";
    const Web$Jogo$hero = Image3D$parse$(Web$Jogo$hero$hex);

    function App$Render$pix$(_pixs$1) {
        var $239 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $239;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function App$Action$(_S$1) {
        var $240 = null;
        return $240;
    };
    const App$Action = x0 => App$Action$(x0);

    function Map$(_A$1) {
        var $241 = null;
        return $241;
    };
    const Map = x0 => Map$(x0);

    function App$Action$print$(_text$2) {
        var $242 = ({
            _: 'App.Action.print',
            'text': _text$2
        });
        return $242;
    };
    const App$Action$print = x0 => App$Action$print$(x0);

    function App$Action$watch$(_room$2) {
        var $243 = ({
            _: 'App.Action.watch',
            'room': _room$2
        });
        return $243;
    };
    const App$Action$watch = x0 => App$Action$watch$(x0);
    const Web$Jogo$room = "0x196581625482";
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$Action$post$(_room$2, _data$3) {
        var $244 = ({
            _: 'App.Action.post',
            'room': _room$2,
            'data': _data$3
        });
        return $244;
    };
    const App$Action$post = x0 => x1 => App$Action$post$(x0, x1);
    const Web$Jogo$command$A = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const Web$Jogo$command$D = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const Web$Jogo$command$W = "0x0000000000000000000000000000000000000000000000000000000000000003";
    const Web$Jogo$command$S = "0x0000000000000000000000000000000000000000000000000000000000000002";

    function String$cons$(_head$1, _tail$2) {
        var $245 = (String.fromCharCode(_head$1) + _tail$2);
        return $245;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$Action$state$(_value$2) {
        var $246 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $246;
    };
    const App$Action$state = x0 => App$Action$state$(x0);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $248 = self.pred;
                var $249 = (Word$to_bits$($248) + '0');
                var $247 = $249;
                break;
            case 'Word.i':
                var $250 = self.pred;
                var $251 = (Word$to_bits$($250) + '1');
                var $247 = $251;
                break;
            case 'Word.e':
                var $252 = Bits$e;
                var $247 = $252;
                break;
        };
        return $247;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $254 = Bits$e;
            var $253 = $254;
        } else {
            var $255 = self.charCodeAt(0);
            var $256 = self.slice(1);
            var $257 = (String$to_bits$($256) + (u16_to_bits($255)));
            var $253 = $257;
        };
        return $253;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Maybe$(_A$1) {
        var $258 = null;
        return $258;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Map$get$(_bits$2, _map$3) {
        var Map$get$ = (_bits$2, _map$3) => ({
            ctr: 'TCO',
            arg: [_bits$2, _map$3]
        });
        var Map$get = _bits$2 => _map$3 => Map$get$(_bits$2, _map$3);
        var arg = [_bits$2, _map$3];
        while (true) {
            let [_bits$2, _map$3] = arg;
            var R = (() => {
                var self = _bits$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $259 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.tie':
                                var $261 = self.lft;
                                var $262 = Map$get$($259, $261);
                                var $260 = $262;
                                break;
                            case 'Map.new':
                                var $263 = Maybe$none;
                                var $260 = $263;
                                break;
                        };
                        return $260;
                    case 'i':
                        var $264 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.tie':
                                var $266 = self.rgt;
                                var $267 = Map$get$($264, $266);
                                var $265 = $267;
                                break;
                            case 'Map.new':
                                var $268 = Maybe$none;
                                var $265 = $268;
                                break;
                        };
                        return $265;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.tie':
                                var $270 = self.val;
                                var $271 = $270;
                                var $269 = $271;
                                break;
                            case 'Map.new':
                                var $272 = Maybe$none;
                                var $269 = $272;
                                break;
                        };
                        return $269;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Map$tie$(_val$2, _lft$3, _rgt$4) {
        var $273 = ({
            _: 'Map.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $273;
    };
    const Map$tie = x0 => x1 => x2 => Map$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $274 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $274;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function Map$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $276 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $278 = self.val;
                        var $279 = self.lft;
                        var $280 = self.rgt;
                        var $281 = Map$tie$($278, Map$set$($276, _val$3, $279), $280);
                        var $277 = $281;
                        break;
                    case 'Map.new':
                        var $282 = Map$tie$(Maybe$none, Map$set$($276, _val$3, Map$new), Map$new);
                        var $277 = $282;
                        break;
                };
                var $275 = $277;
                break;
            case 'i':
                var $283 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $285 = self.val;
                        var $286 = self.lft;
                        var $287 = self.rgt;
                        var $288 = Map$tie$($285, $286, Map$set$($283, _val$3, $287));
                        var $284 = $288;
                        break;
                    case 'Map.new':
                        var $289 = Map$tie$(Maybe$none, Map$new, Map$set$($283, _val$3, Map$new));
                        var $284 = $289;
                        break;
                };
                var $275 = $284;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $291 = self.lft;
                        var $292 = self.rgt;
                        var $293 = Map$tie$(Maybe$some$(_val$3), $291, $292);
                        var $290 = $293;
                        break;
                    case 'Map.new':
                        var $294 = Map$tie$(Maybe$some$(_val$3), Map$new, Map$new);
                        var $290 = $294;
                        break;
                };
                var $275 = $290;
                break;
        };
        return $275;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);
    const Bool$and = a0 => a1 => (a0 && a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Jogo$command$(_user$1, _cmd$2, _state$3) {
        var _key$4 = String$to_bits$(_user$1);
        var self = Map$get$(_key$4, _state$3);
        switch (self._) {
            case 'Maybe.some':
                var $296 = self.value;
                var self = $296;
                switch (self._) {
                    case 'Pair.new':
                        var $298 = self.fst;
                        var $299 = self.snd;
                        var _spd$8 = 3;
                        var self = (_cmd$2 === Web$Jogo$command$A);
                        if (self) {
                            var $301 = Map$set$(_key$4, Pair$new$((Math.max($298 - _spd$8, 0)), $299), _state$3);
                            var $300 = $301;
                        } else {
                            var self = (_cmd$2 === Web$Jogo$command$D);
                            if (self) {
                                var $303 = Map$set$(_key$4, Pair$new$((($298 + _spd$8) >>> 0), $299), _state$3);
                                var $302 = $303;
                            } else {
                                var self = (_cmd$2 === Web$Jogo$command$W);
                                if (self) {
                                    var $305 = Map$set$(_key$4, Pair$new$($298, (Math.max($299 - _spd$8, 0))), _state$3);
                                    var $304 = $305;
                                } else {
                                    var self = (_cmd$2 === Web$Jogo$command$S);
                                    if (self) {
                                        var $307 = Map$set$(_key$4, Pair$new$($298, (($299 + _spd$8) >>> 0)), _state$3);
                                        var $306 = $307;
                                    } else {
                                        var $308 = _state$3;
                                        var $306 = $308;
                                    };
                                    var $304 = $306;
                                };
                                var $302 = $304;
                            };
                            var $300 = $302;
                        };
                        var $297 = $300;
                        break;
                };
                var $295 = $297;
                break;
            case 'Maybe.none':
                var $309 = Map$set$(_key$4, Pair$new$(128, 128), _state$3);
                var $295 = $309;
                break;
        };
        return $295;
    };
    const Web$Jogo$command = x0 => x1 => x2 => Web$Jogo$command$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $310 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $310;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Jogo = (() => {
        var _img$1 = Image3D$alloc_capacity$(3200);
        var $311 = App$new$(Map$new, (_state$2 => {
            var _img$3 = Image3D$clear$(_img$1);
            var _img$4 = (() => {
                var $314 = _img$3;
                var $315 = Map$values$(_state$2);
                let _img$5 = $314;
                let _pos$4;
                while ($315._ === 'List.cons') {
                    _pos$4 = $315.head;
                    var self = _pos$4;
                    switch (self._) {
                        case 'Pair.new':
                            var $316 = self.fst;
                            var $317 = self.snd;
                            var $318 = Image3D$Draw$image$($316, $317, 0, Web$Jogo$hero, _img$5);
                            var $314 = $318;
                            break;
                    };
                    _img$5 = $314;
                    $315 = $315.tail;
                }
                return _img$5;
            })();
            var $312 = App$Render$pix$(_img$4);
            return $312;
        }), (_event$2 => _state$3 => {
            var self = _event$2;
            switch (self._) {
                case 'App.Event.xkey':
                    var $320 = self.down;
                    var $321 = self.code;
                    var self = $320;
                    if (self) {
                        var self = ($321 === 65);
                        if (self) {
                            var $324 = List$cons$(App$Action$post$(Web$Jogo$room, Web$Jogo$command$A), List$nil);
                            var $323 = $324;
                        } else {
                            var self = ($321 === 68);
                            if (self) {
                                var $326 = List$cons$(App$Action$post$(Web$Jogo$room, Web$Jogo$command$D), List$nil);
                                var $325 = $326;
                            } else {
                                var self = ($321 === 87);
                                if (self) {
                                    var $328 = List$cons$(App$Action$post$(Web$Jogo$room, Web$Jogo$command$W), List$nil);
                                    var $327 = $328;
                                } else {
                                    var self = ($321 === 83);
                                    if (self) {
                                        var $330 = List$cons$(App$Action$post$(Web$Jogo$room, Web$Jogo$command$S), List$nil);
                                        var $329 = $330;
                                    } else {
                                        var $331 = List$nil;
                                        var $329 = $331;
                                    };
                                    var $327 = $329;
                                };
                                var $325 = $327;
                            };
                            var $323 = $325;
                        };
                        var $322 = $323;
                    } else {
                        var $332 = List$nil;
                        var $322 = $332;
                    };
                    var $319 = $322;
                    break;
                case 'App.Event.post':
                    var $333 = self.addr;
                    var $334 = self.data;
                    var $335 = List$cons$(App$Action$print$((">> received post: " + $334)), List$cons$(App$Action$state$(Web$Jogo$command$($333, $334, _state$3)), List$nil));
                    var $319 = $335;
                    break;
                case 'App.Event.init':
                    var $336 = List$cons$(App$Action$print$(">> started app"), List$cons$(App$Action$watch$(Web$Jogo$room), List$nil));
                    var $319 = $336;
                    break;
                case 'App.Event.tick':
                    var $337 = List$nil;
                    var $319 = $337;
                    break;
            };
            return $319;
        }));
        return $311;
    })();
    return {
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'U32.new': U32$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.o': Word$o,
        'Word.zero': Word$zero,
        'U32.zero': U32$zero,
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
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U32.eql': U32$eql,
        'Nat.apply': Nat$apply,
        'Word.i': Word$i,
        'Word.inc': Word$inc,
        'U32.inc': U32$inc,
        'Nat.to_u32': Nat$to_u32,
        'U32.shr': U32$shr,
        'U32.needed_depth.go': U32$needed_depth$go,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U32.sub': U32$sub,
        'U32.needed_depth': U32$needed_depth,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'Image3D.new': Image3D$new,
        'Image3D.alloc_capacity': Image3D$alloc_capacity,
        'Map.new': Map$new,
        'Pair': Pair,
        'Image3D.set_length': Image3D$set_length,
        'Image3D.clear': Image3D$clear,
        'List.for': List$for,
        'List': List,
        'List.cons': List$cons,
        'Map.values.go': Map$values$go,
        'List.nil': List$nil,
        'Map.values': Map$values,
        'Image3D.get_len': Image3D$get_len,
        'U32.for': U32$for,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair.new': Pair$new,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'Image3D.get_pos': Image3D$get_pos,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U32.add': U32$add,
        'Image3D.get_col': Image3D$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'Image3D.set_pos': Image3D$set_pos,
        'Image3D.set_col': Image3D$set_col,
        'Image3D.push': Image3D$push,
        'Image3D.Draw.image': Image3D$Draw$image,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.length': U32$length,
        'U32.slice': U32$slice,
        'U32.read_base': U32$read_base,
        'Image3D.parse_byte': Image3D$parse_byte,
        'Col32.new': Col32$new,
        'Image3D.parse': Image3D$parse,
        'Web.Jogo.hero.hex': Web$Jogo$hero$hex,
        'Web.Jogo.hero': Web$Jogo$hero,
        'App.Render.pix': App$Render$pix,
        'App.Action': App$Action,
        'Map': Map,
        'App.Action.print': App$Action$print,
        'App.Action.watch': App$Action$watch,
        'Web.Jogo.room': Web$Jogo$room,
        'U16.eql': U16$eql,
        'App.Action.post': App$Action$post,
        'Web.Jogo.command.A': Web$Jogo$command$A,
        'Web.Jogo.command.D': Web$Jogo$command$D,
        'Web.Jogo.command.W': Web$Jogo$command$W,
        'Web.Jogo.command.S': Web$Jogo$command$S,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.Action.state': App$Action$state,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Map.get': Map$get,
        'Map.tie': Map$tie,
        'Maybe.some': Maybe$some,
        'Map.set': Map$set,
        'Bool.and': Bool$and,
        'String.eql': String$eql,
        'Web.Jogo.command': Web$Jogo$command,
        'App.new': App$new,
        'Web.Jogo': Web$Jogo,
    };
})();

/***/ })

}]);
//# sourceMappingURL=160.index.js.map