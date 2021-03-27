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
    const BitsMap$new = ({
        _: 'BitsMap.new'
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

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
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
                var _list1$8 = BitsMap$values$go$($142, _list0$7);
                var _list2$9 = BitsMap$values$go$($143, _list1$8);
                var $144 = _list2$9;
                var $140 = $144;
                break;
            case 'BitsMap.new':
                var $148 = _list$3;
                var $140 = $148;
                break;
        };
        return $140;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function BitsMap$values$(_xs$2) {
        var $149 = BitsMap$values$go$(_xs$2, List$nil);
        return $149;
    };
    const BitsMap$values = x0 => BitsMap$values$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $151 = self.pred;
                var $152 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $154 = self.pred;
                            var $155 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $157 = Word$i$(Word$adder$(_a$pred$10, $154, Bool$false));
                                    var $156 = $157;
                                } else {
                                    var $158 = Word$o$(Word$adder$(_a$pred$10, $154, Bool$false));
                                    var $156 = $158;
                                };
                                return $156;
                            });
                            var $153 = $155;
                            break;
                        case 'Word.i':
                            var $159 = self.pred;
                            var $160 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $162 = Word$o$(Word$adder$(_a$pred$10, $159, Bool$true));
                                    var $161 = $162;
                                } else {
                                    var $163 = Word$i$(Word$adder$(_a$pred$10, $159, Bool$false));
                                    var $161 = $163;
                                };
                                return $161;
                            });
                            var $153 = $160;
                            break;
                        case 'Word.e':
                            var $164 = (_a$pred$8 => {
                                var $165 = Word$e;
                                return $165;
                            });
                            var $153 = $164;
                            break;
                    };
                    var $153 = $153($151);
                    return $153;
                });
                var $150 = $152;
                break;
            case 'Word.i':
                var $166 = self.pred;
                var $167 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $169 = self.pred;
                            var $170 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $172 = Word$o$(Word$adder$(_a$pred$10, $169, Bool$true));
                                    var $171 = $172;
                                } else {
                                    var $173 = Word$i$(Word$adder$(_a$pred$10, $169, Bool$false));
                                    var $171 = $173;
                                };
                                return $171;
                            });
                            var $168 = $170;
                            break;
                        case 'Word.i':
                            var $174 = self.pred;
                            var $175 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $177 = Word$i$(Word$adder$(_a$pred$10, $174, Bool$true));
                                    var $176 = $177;
                                } else {
                                    var $178 = Word$o$(Word$adder$(_a$pred$10, $174, Bool$true));
                                    var $176 = $178;
                                };
                                return $176;
                            });
                            var $168 = $175;
                            break;
                        case 'Word.e':
                            var $179 = (_a$pred$8 => {
                                var $180 = Word$e;
                                return $180;
                            });
                            var $168 = $179;
                            break;
                    };
                    var $168 = $168($166);
                    return $168;
                });
                var $150 = $167;
                break;
            case 'Word.e':
                var $181 = (_b$5 => {
                    var $182 = Word$e;
                    return $182;
                });
                var $150 = $181;
                break;
        };
        var $150 = $150(_b$3);
        return $150;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $183 = Word$adder$(_a$2, _b$3, Bool$false);
        return $183;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

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
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

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
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$mod$(_a$2, _b$3) {
        var Word$mod$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$mod = _a$2 => _b$3 => Word$mod$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$mod$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $185 = Word$e;
            var $184 = $185;
        } else {
            var $186 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $188 = self.pred;
                    var $189 = Word$o$(Word$trim$($186, $188));
                    var $187 = $189;
                    break;
                case 'Word.i':
                    var $190 = self.pred;
                    var $191 = Word$i$(Word$trim$($186, $190));
                    var $187 = $191;
                    break;
                case 'Word.e':
                    var $192 = Word$o$(Word$trim$($186, Word$e));
                    var $187 = $192;
                    break;
            };
            var $184 = $187;
        };
        return $184;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $194 = self.value;
                var $195 = $194;
                var $193 = $195;
                break;
            case 'Array.tie':
                var $196 = Unit$new;
                var $193 = $196;
                break;
        };
        return $193;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $197 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $197;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $199 = self.lft;
                var $200 = self.rgt;
                var $201 = Pair$new$($199, $200);
                var $198 = $201;
                break;
            case 'Array.tip':
                var $202 = Unit$new;
                var $198 = $202;
                break;
        };
        return $198;
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
                        var $203 = self.pred;
                        var $204 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $203);
                        return $204;
                    case 'Word.i':
                        var $205 = self.pred;
                        var $206 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $205);
                        return $206;
                    case 'Word.e':
                        var $207 = _nil$3;
                        return $207;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $208 = Word$foldl$((_arr$6 => {
            var $209 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $209;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $211 = self.fst;
                    var $212 = self.snd;
                    var $213 = Array$tie$(_rec$7($211), $212);
                    var $210 = $213;
                    break;
            };
            return $210;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $215 = self.fst;
                    var $216 = self.snd;
                    var $217 = Array$tie$($215, _rec$7($216));
                    var $214 = $217;
                    break;
            };
            return $214;
        }), _idx$3)(_arr$5);
        return $208;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $218 = Array$mut$(_idx$3, (_x$6 => {
            var $219 = _val$4;
            return $219;
        }), _arr$5);
        return $218;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const Image3D$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const Image3D$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const Image3D$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function Image3D$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $220 = (() => {
            var $221 = _img$7;
            var $222 = 0;
            var $223 = _siz$8;
            let _pix$12 = $221;
            for (let _idx$11 = $222; _idx$11 < $223; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = (Math.max(((_x$1 + _v_x$13) >>> 0) - _w_2$9, 0));
                var _p_y$16 = (Math.max(((_y$2 + _v_y$14) >>> 0) - _h_2$10, 0));
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $221 = _pix$19;
                _pix$12 = $221;
            };
            return _pix$12;
        })();
        return $220;
    };
    const Image3D$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Image3D$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function App$Render$pix$(_pixs$1) {
        var $224 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $224;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function App$Action$(_S$1) {
        var $225 = null;
        return $225;
    };
    const App$Action = x0 => App$Action$(x0);

    function BitsMap$(_A$1) {
        var $226 = null;
        return $226;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function App$Action$print$(_text$2) {
        var $227 = ({
            _: 'App.Action.print',
            'text': _text$2
        });
        return $227;
    };
    const App$Action$print = x0 => App$Action$print$(x0);

    function App$Action$watch$(_room$2) {
        var $228 = ({
            _: 'App.Action.watch',
            'room': _room$2
        });
        return $228;
    };
    const App$Action$watch = x0 => App$Action$watch$(x0);
    const Web$Jogu$room = "0x196581625483";
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$Action$post$(_room$2, _data$3) {
        var $229 = ({
            _: 'App.Action.post',
            'room': _room$2,
            'data': _data$3
        });
        return $229;
    };
    const App$Action$post = x0 => x1 => App$Action$post$(x0, x1);
    const Web$Jogu$command$A = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const Web$Jogu$command$D = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const Web$Jogu$command$W = "0x0000000000000000000000000000000000000000000000000000000000000003";
    const Web$Jogu$command$S = "0x0000000000000000000000000000000000000000000000000000000000000002";

    function String$cons$(_head$1, _tail$2) {
        var $230 = (String.fromCharCode(_head$1) + _tail$2);
        return $230;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$Action$state$(_value$2) {
        var $231 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $231;
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
                var $233 = self.pred;
                var $234 = (Word$to_bits$($233) + '0');
                var $232 = $234;
                break;
            case 'Word.i':
                var $235 = self.pred;
                var $236 = (Word$to_bits$($235) + '1');
                var $232 = $236;
                break;
            case 'Word.e':
                var $237 = Bits$e;
                var $232 = $237;
                break;
        };
        return $232;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $239 = Bits$e;
            var $238 = $239;
        } else {
            var $240 = self.charCodeAt(0);
            var $241 = self.slice(1);
            var $242 = (String$to_bits$($241) + (u16_to_bits($240)));
            var $238 = $242;
        };
        return $238;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Maybe$(_A$1) {
        var $243 = null;
        return $243;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

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
                        var $244 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $246 = self.lft;
                                var $247 = BitsMap$get$($244, $246);
                                var $245 = $247;
                                break;
                            case 'BitsMap.new':
                                var $248 = Maybe$none;
                                var $245 = $248;
                                break;
                        };
                        return $245;
                    case 'i':
                        var $249 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $251 = self.rgt;
                                var $252 = BitsMap$get$($249, $251);
                                var $250 = $252;
                                break;
                            case 'BitsMap.new':
                                var $253 = Maybe$none;
                                var $250 = $253;
                                break;
                        };
                        return $250;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $255 = self.val;
                                var $256 = $255;
                                var $254 = $256;
                                break;
                            case 'BitsMap.new':
                                var $257 = Maybe$none;
                                var $254 = $257;
                                break;
                        };
                        return $254;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $258 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $258;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $259 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $259;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $261 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $263 = self.val;
                        var $264 = self.lft;
                        var $265 = self.rgt;
                        var $266 = BitsMap$tie$($263, BitsMap$set$($261, _val$3, $264), $265);
                        var $262 = $266;
                        break;
                    case 'BitsMap.new':
                        var $267 = BitsMap$tie$(Maybe$none, BitsMap$set$($261, _val$3, BitsMap$new), BitsMap$new);
                        var $262 = $267;
                        break;
                };
                var $260 = $262;
                break;
            case 'i':
                var $268 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $270 = self.val;
                        var $271 = self.lft;
                        var $272 = self.rgt;
                        var $273 = BitsMap$tie$($270, $271, BitsMap$set$($268, _val$3, $272));
                        var $269 = $273;
                        break;
                    case 'BitsMap.new':
                        var $274 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($268, _val$3, BitsMap$new));
                        var $269 = $274;
                        break;
                };
                var $260 = $269;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $276 = self.lft;
                        var $277 = self.rgt;
                        var $278 = BitsMap$tie$(Maybe$some$(_val$3), $276, $277);
                        var $275 = $278;
                        break;
                    case 'BitsMap.new':
                        var $279 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $275 = $279;
                        break;
                };
                var $260 = $275;
                break;
        };
        return $260;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);
    const Bool$and = a0 => a1 => (a0 && a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Jogu$command$(_user$1, _cmd$2, _state$3) {
        var _key$4 = String$to_bits$(_user$1);
        var self = BitsMap$get$(_key$4, _state$3);
        switch (self._) {
            case 'Maybe.some':
                var $281 = self.value;
                var self = $281;
                switch (self._) {
                    case 'Pair.new':
                        var $283 = self.fst;
                        var $284 = self.snd;
                        var _spd$8 = 3;
                        var _p_x$9 = $283;
                        var _p_y$10 = $284;
                        var self = (_cmd$2 === Web$Jogu$command$A);
                        if (self) {
                            var $286 = BitsMap$set$(_key$4, Pair$new$((Math.max(_p_x$9 - _spd$8, 0)), _p_y$10), _state$3);
                            var $285 = $286;
                        } else {
                            var self = (_cmd$2 === Web$Jogu$command$D);
                            if (self) {
                                var $288 = BitsMap$set$(_key$4, Pair$new$(((_p_x$9 + _spd$8) >>> 0), _p_y$10), _state$3);
                                var $287 = $288;
                            } else {
                                var self = (_cmd$2 === Web$Jogu$command$W);
                                if (self) {
                                    var $290 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, (Math.max(_p_y$10 - _spd$8, 0))), _state$3);
                                    var $289 = $290;
                                } else {
                                    var self = (_cmd$2 === Web$Jogu$command$S);
                                    if (self) {
                                        var $292 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, ((_p_y$10 + _spd$8) >>> 0)), _state$3);
                                        var $291 = $292;
                                    } else {
                                        var $293 = _state$3;
                                        var $291 = $293;
                                    };
                                    var $289 = $291;
                                };
                                var $287 = $289;
                            };
                            var $285 = $287;
                        };
                        var $282 = $285;
                        break;
                };
                var $280 = $282;
                break;
            case 'Maybe.none':
                var $294 = BitsMap$set$(_key$4, Pair$new$(128, 128), _state$3);
                var $280 = $294;
                break;
        };
        return $280;
    };
    const Web$Jogu$command = x0 => x1 => x2 => Web$Jogu$command$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $295 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $295;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Jogu = (() => {
        var _img$1 = Image3D$alloc_capacity$(3200);
        var _init$2 = BitsMap$new;
        var _draw$3 = (_state$3 => {
            var _img$4 = Image3D$clear$(_img$1);
            var _img$5 = (() => {
                var $299 = _img$4;
                var $300 = BitsMap$values$(_state$3);
                let _img$6 = $299;
                let _pos$5;
                while ($300._ === 'List.cons') {
                    _pos$5 = $300.head;
                    var self = _pos$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $301 = self.fst;
                            var $302 = self.snd;
                            var _col$9 = (_x$9 => _y$10 => {
                                var _r$11 = ((96 + ((_x$9 * 4) >>> 0)) >>> 0);
                                var _g$12 = ((96 + ((_x$9 * 4) >>> 0)) >>> 0);
                                var _b$13 = 128;
                                var _a$14 = 255;
                                var $304 = ((0 | _r$11 | (_g$12 << 8) | (_b$13 << 16) | (_a$14 << 24)));
                                return $304;
                            });
                            var $303 = Image3D$Draw$square$($301, $302, 128, 16, 16, _col$9, _img$6);
                            var $299 = $303;
                            break;
                    };
                    _img$6 = $299;
                    $300 = $300.tail;
                }
                return _img$6;
            })();
            var $297 = App$Render$pix$(_img$5);
            return $297;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.xkey':
                    var $306 = self.down;
                    var $307 = self.code;
                    var self = $306;
                    if (self) {
                        var self = ($307 === 65);
                        if (self) {
                            var $310 = List$cons$(App$Action$post$(Web$Jogu$room, Web$Jogu$command$A), List$nil);
                            var $309 = $310;
                        } else {
                            var self = ($307 === 68);
                            if (self) {
                                var $312 = List$cons$(App$Action$post$(Web$Jogu$room, Web$Jogu$command$D), List$nil);
                                var $311 = $312;
                            } else {
                                var self = ($307 === 87);
                                if (self) {
                                    var $314 = List$cons$(App$Action$post$(Web$Jogu$room, Web$Jogu$command$W), List$nil);
                                    var $313 = $314;
                                } else {
                                    var self = ($307 === 83);
                                    if (self) {
                                        var $316 = List$cons$(App$Action$post$(Web$Jogu$room, Web$Jogu$command$S), List$nil);
                                        var $315 = $316;
                                    } else {
                                        var $317 = List$nil;
                                        var $315 = $317;
                                    };
                                    var $313 = $315;
                                };
                                var $311 = $313;
                            };
                            var $309 = $311;
                        };
                        var $308 = $309;
                    } else {
                        var $318 = List$nil;
                        var $308 = $318;
                    };
                    var $305 = $308;
                    break;
                case 'App.Event.post':
                    var $319 = self.addr;
                    var $320 = self.data;
                    var $321 = List$cons$(App$Action$print$((">> received post: " + $320)), List$cons$(App$Action$state$(Web$Jogu$command$($319, $320, _state$5)), List$nil));
                    var $305 = $321;
                    break;
                case 'App.Event.init':
                    var $322 = List$cons$(App$Action$print$(">> started app"), List$cons$(App$Action$watch$(Web$Jogu$room), List$nil));
                    var $305 = $322;
                    break;
                case 'App.Event.tick':
                    var $323 = List$nil;
                    var $305 = $323;
                    break;
            };
            return $305;
        });
        var $296 = App$new$(_init$2, _draw$3, _when$4);
        return $296;
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
        'BitsMap.new': BitsMap$new,
        'Pair': Pair,
        'Image3D.set_length': Image3D$set_length,
        'Image3D.clear': Image3D$clear,
        'List.for': List$for,
        'List': List,
        'List.cons': List$cons,
        'BitsMap.values.go': BitsMap$values$go,
        'List.nil': List$nil,
        'BitsMap.values': BitsMap$values,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U32.add': U32$add,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Col32.new': Col32$new,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.for': U32$for,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Pos32.new': Pos32$new,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair.new': Pair$new,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'Image3D.set_pos': Image3D$set_pos,
        'Image3D.set_col': Image3D$set_col,
        'Image3D.push': Image3D$push,
        'Image3D.Draw.square': Image3D$Draw$square,
        'App.Render.pix': App$Render$pix,
        'App.Action': App$Action,
        'BitsMap': BitsMap,
        'App.Action.print': App$Action$print,
        'App.Action.watch': App$Action$watch,
        'Web.Jogu.room': Web$Jogu$room,
        'U16.eql': U16$eql,
        'App.Action.post': App$Action$post,
        'Web.Jogu.command.A': Web$Jogu$command$A,
        'Web.Jogu.command.D': Web$Jogu$command$D,
        'Web.Jogu.command.W': Web$Jogu$command$W,
        'Web.Jogu.command.S': Web$Jogu$command$S,
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
        'BitsMap.get': BitsMap$get,
        'BitsMap.tie': BitsMap$tie,
        'Maybe.some': Maybe$some,
        'BitsMap.set': BitsMap$set,
        'Bool.and': Bool$and,
        'String.eql': String$eql,
        'Web.Jogu.command': Web$Jogu$command,
        'App.new': App$new,
        'Web.Jogu': Web$Jogu,
    };
})();