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
    var list_for = list => nil => cons => {
        while (list._ !== 'List.nil') {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
    };
    var nat_to_bits = n => {
        return n === 0n ? '' : n.toString(2);
    };
    var fm_name_to_bits = name => {
        const TABLE = {
            'A': '000000',
            'B': '100000',
            'C': '010000',
            'D': '110000',
            'E': '001000',
            'F': '101000',
            'G': '011000',
            'H': '111000',
            'I': '000100',
            'J': '100100',
            'K': '010100',
            'L': '110100',
            'M': '001100',
            'N': '101100',
            'O': '011100',
            'P': '111100',
            'Q': '000010',
            'R': '100010',
            'S': '010010',
            'T': '110010',
            'U': '001010',
            'V': '101010',
            'W': '011010',
            'X': '111010',
            'Y': '000110',
            'Z': '100110',
            'a': '010110',
            'b': '110110',
            'c': '001110',
            'd': '101110',
            'e': '011110',
            'f': '111110',
            'g': '000001',
            'h': '100001',
            'i': '010001',
            'j': '110001',
            'k': '001001',
            'l': '101001',
            'm': '011001',
            'n': '111001',
            'o': '000101',
            'p': '100101',
            'q': '010101',
            'r': '110101',
            's': '001101',
            't': '101101',
            'u': '011101',
            'v': '111101',
            'w': '000011',
            'x': '100011',
            'y': '010011',
            'z': '110011',
            '0': '001011',
            '1': '101011',
            '2': '011011',
            '3': '111011',
            '4': '000111',
            '5': '100111',
            '6': '010111',
            '7': '110111',
            '8': '001111',
            '9': '101111',
            '.': '011111',
            '_': '111111',
        }
        var a = '';
        for (var i = name.length - 1; i >= 0; --i) {
            a += TABLE[name[i]];
        }
        return a;
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
                case 'e':
                    var $9 = c0;
                    return $9;
                case 'o':
                    var $10 = self.slice(0, -1);
                    var $11 = c1($10);
                    return $11;
                case 'i':
                    var $12 = self.slice(0, -1);
                    var $13 = c2($12);
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
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $22 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $18 = c2;
                return $18;
            } else {
                var $19 = self.charCodeAt(0);
                var $20 = self.slice(1);
                var $21 = c2($19)($20);
                return $21;
            };
        })();
        return $22;
    });
    var run = (p) => {
        var rdl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        return run_io(rdl, p).then((x) => {
            rdl.close();
            return x;
        });
    };
    var run_io = (rdl, p) => {
        switch (p._) {
            case 'IO.end':
                return Promise.resolve(p.value);
            case 'IO.ask':
                return new Promise((res, _) => {
                    switch (p.query) {
                        case 'print':
                            console.log(p.param);
                            run_io(rdl, p.then(1)).then(res);
                            break;
                        case 'get_line':
                            rdl.question('', (line) => run_io(rdl, p.then(line)).then(res));
                            break;
                        case 'get_file':
                            try {
                                run_io(rdl, p.then(require('fs').readFileSync(p.param, 'utf8'))).then(res);
                            } catch (e) {
                                console.log('Internal error on the Formality JavaScript runtime.');
                                process.exit();
                            };
                            break;
                        case 'get_args':
                            run_io(rdl, p.then(process.argv[2] || '')).then(res);
                            break;
                    }
                });
        }
    };

    function Monad$bind$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Monad.new':
                var $24 = self.bind;
                var $25 = self.pure;
                var $26 = $24;
                var $23 = $26;
                break;
        };
        return $23;
    };
    const Monad$bind = x0 => Monad$bind$(x0);

    function IO$(_A$1) {
        var $27 = null;
        return $27;
    };
    const IO = x0 => IO$(x0);

    function Monad$new$(_bind$2, _pure$3) {
        var $28 = ({
            _: 'Monad.new',
            'bind': _bind$2,
            'pure': _pure$3
        });
        return $28;
    };
    const Monad$new = x0 => x1 => Monad$new$(x0, x1);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $29 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $29;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $31 = self.value;
                var $32 = _f$4($31);
                var $30 = $32;
                break;
            case 'IO.ask':
                var $33 = self.query;
                var $34 = self.param;
                var $35 = self.then;
                var $36 = IO$ask$($33, $34, (_x$8 => {
                    var $37 = IO$bind$($35(_x$8), _f$4);
                    return $37;
                }));
                var $30 = $36;
                break;
        };
        return $30;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $38 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $38;
    };
    const IO$end = x0 => IO$end$(x0);
    const IO$monad = Monad$new$(IO$bind, IO$end);

    function Map$(_A$1) {
        var $39 = null;
        return $39;
    };
    const Map = x0 => Map$(x0);

    function Maybe$(_A$1) {
        var $40 = null;
        return $40;
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
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.new':
                                var $42 = Maybe$none;
                                var $41 = $42;
                                break;
                            case 'Map.tie':
                                var $43 = self.val;
                                var $44 = self.lft;
                                var $45 = self.rgt;
                                var $46 = $43;
                                var $41 = $46;
                                break;
                        };
                        return $41;
                    case 'o':
                        var $47 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.new':
                                var $49 = Maybe$none;
                                var $48 = $49;
                                break;
                            case 'Map.tie':
                                var $50 = self.val;
                                var $51 = self.lft;
                                var $52 = self.rgt;
                                var $53 = Map$get$($47, $51);
                                var $48 = $53;
                                break;
                        };
                        return $48;
                    case 'i':
                        var $54 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.new':
                                var $56 = Maybe$none;
                                var $55 = $56;
                                break;
                            case 'Map.tie':
                                var $57 = self.val;
                                var $58 = self.lft;
                                var $59 = self.rgt;
                                var $60 = Map$get$($54, $59);
                                var $55 = $60;
                                break;
                        };
                        return $55;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);
    const Bits$e = '';
    const Bool$false = false;
    const Bool$and = a0 => a1 => (a0 && a1);
    const Bool$true = true;

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $62 = Bool$true;
                var $61 = $62;
                break;
            case 'Cmp.eql':
                var $63 = Bool$true;
                var $61 = $63;
                break;
            case 'Cmp.gtn':
                var $64 = Bool$false;
                var $61 = $64;
                break;
        };
        return $61;
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
            case 'Word.e':
                var $66 = (_b$5 => {
                    var $67 = _c$4;
                    return $67;
                });
                var $65 = $66;
                break;
            case 'Word.o':
                var $68 = self.pred;
                var $69 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $71 = (_a$pred$8 => {
                                var $72 = _c$4;
                                return $72;
                            });
                            var $70 = $71;
                            break;
                        case 'Word.o':
                            var $73 = self.pred;
                            var $74 = (_a$pred$10 => {
                                var $75 = Word$cmp$go$(_a$pred$10, $73, _c$4);
                                return $75;
                            });
                            var $70 = $74;
                            break;
                        case 'Word.i':
                            var $76 = self.pred;
                            var $77 = (_a$pred$10 => {
                                var $78 = Word$cmp$go$(_a$pred$10, $76, Cmp$ltn);
                                return $78;
                            });
                            var $70 = $77;
                            break;
                    };
                    var $70 = $70($68);
                    return $70;
                });
                var $65 = $69;
                break;
            case 'Word.i':
                var $79 = self.pred;
                var $80 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $82 = (_a$pred$8 => {
                                var $83 = _c$4;
                                return $83;
                            });
                            var $81 = $82;
                            break;
                        case 'Word.o':
                            var $84 = self.pred;
                            var $85 = (_a$pred$10 => {
                                var $86 = Word$cmp$go$(_a$pred$10, $84, Cmp$gtn);
                                return $86;
                            });
                            var $81 = $85;
                            break;
                        case 'Word.i':
                            var $87 = self.pred;
                            var $88 = (_a$pred$10 => {
                                var $89 = Word$cmp$go$(_a$pred$10, $87, _c$4);
                                return $89;
                            });
                            var $81 = $88;
                            break;
                    };
                    var $81 = $81($79);
                    return $81;
                });
                var $65 = $80;
                break;
        };
        var $65 = $65(_b$3);
        return $65;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $90 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $90;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$lte$(_a$2, _b$3) {
        var $91 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $91;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $92 = 1n + _pred$1;
        return $92;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$lte = a0 => a1 => (a0 <= a1);

    function U16$btw$(_a$1, _b$2, _c$3) {
        var $93 = ((_a$1 <= _b$2) && (_b$2 <= _c$3));
        return $93;
    };
    const U16$btw = x0 => x1 => x2 => U16$btw$(x0, x1, x2);

    function U16$new$(_value$1) {
        var $94 = word_to_u16(_value$1);
        return $94;
    };
    const U16$new = x0 => U16$new$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$(_size$1) {
        var $95 = null;
        return $95;
    };
    const Word = x0 => Word$(x0);

    function Word$i$(_pred$2) {
        var $96 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $96;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $97 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $97;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.e':
                var $99 = (_b$5 => {
                    var $100 = Word$e;
                    return $100;
                });
                var $98 = $99;
                break;
            case 'Word.o':
                var $101 = self.pred;
                var $102 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $104 = (_a$pred$8 => {
                                var $105 = Word$e;
                                return $105;
                            });
                            var $103 = $104;
                            break;
                        case 'Word.o':
                            var $106 = self.pred;
                            var $107 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $109 = Word$i$(Word$subber$(_a$pred$10, $106, Bool$true));
                                    var $108 = $109;
                                } else {
                                    var $110 = Word$o$(Word$subber$(_a$pred$10, $106, Bool$false));
                                    var $108 = $110;
                                };
                                return $108;
                            });
                            var $103 = $107;
                            break;
                        case 'Word.i':
                            var $111 = self.pred;
                            var $112 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $114 = Word$o$(Word$subber$(_a$pred$10, $111, Bool$true));
                                    var $113 = $114;
                                } else {
                                    var $115 = Word$i$(Word$subber$(_a$pred$10, $111, Bool$true));
                                    var $113 = $115;
                                };
                                return $113;
                            });
                            var $103 = $112;
                            break;
                    };
                    var $103 = $103($101);
                    return $103;
                });
                var $98 = $102;
                break;
            case 'Word.i':
                var $116 = self.pred;
                var $117 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $119 = (_a$pred$8 => {
                                var $120 = Word$e;
                                return $120;
                            });
                            var $118 = $119;
                            break;
                        case 'Word.o':
                            var $121 = self.pred;
                            var $122 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $124 = Word$o$(Word$subber$(_a$pred$10, $121, Bool$false));
                                    var $123 = $124;
                                } else {
                                    var $125 = Word$i$(Word$subber$(_a$pred$10, $121, Bool$false));
                                    var $123 = $125;
                                };
                                return $123;
                            });
                            var $118 = $122;
                            break;
                        case 'Word.i':
                            var $126 = self.pred;
                            var $127 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $129 = Word$i$(Word$subber$(_a$pred$10, $126, Bool$true));
                                    var $128 = $129;
                                } else {
                                    var $130 = Word$o$(Word$subber$(_a$pred$10, $126, Bool$false));
                                    var $128 = $130;
                                };
                                return $128;
                            });
                            var $118 = $127;
                            break;
                    };
                    var $118 = $118($116);
                    return $118;
                });
                var $98 = $117;
                break;
        };
        var $98 = $98(_b$3);
        return $98;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $131 = Word$subber$(_a$2, _b$3, Bool$false);
        return $131;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U16$sub = a0 => a1 => (Math.max(a0 - a1, 0));

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
                    var $132 = _x$4;
                    return $132;
                } else {
                    var $133 = (self - 1n);
                    var $134 = Nat$apply$($133, _f$3, _f$3(_x$4));
                    return $134;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.e':
                var $136 = Word$e;
                var $135 = $136;
                break;
            case 'Word.o':
                var $137 = self.pred;
                var $138 = Word$i$($137);
                var $135 = $138;
                break;
            case 'Word.i':
                var $139 = self.pred;
                var $140 = Word$o$(Word$inc$($139));
                var $135 = $140;
                break;
        };
        return $135;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function U16$inc$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $142 = u16_to_word(self);
                var $143 = U16$new$(Word$inc$($142));
                var $141 = $143;
                break;
        };
        return $141;
    };
    const U16$inc = x0 => U16$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $145 = Word$e;
            var $144 = $145;
        } else {
            var $146 = (self - 1n);
            var $147 = Word$o$(Word$zero$($146));
            var $144 = $147;
        };
        return $144;
    };
    const Word$zero = x0 => Word$zero$(x0);
    const U16$zero = U16$new$(Word$zero$(16n));
    const Nat$to_u16 = a0 => (Number(a0));

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.e':
                var $149 = (_b$5 => {
                    var $150 = Word$e;
                    return $150;
                });
                var $148 = $149;
                break;
            case 'Word.o':
                var $151 = self.pred;
                var $152 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $154 = (_a$pred$8 => {
                                var $155 = Word$e;
                                return $155;
                            });
                            var $153 = $154;
                            break;
                        case 'Word.o':
                            var $156 = self.pred;
                            var $157 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $159 = Word$i$(Word$adder$(_a$pred$10, $156, Bool$false));
                                    var $158 = $159;
                                } else {
                                    var $160 = Word$o$(Word$adder$(_a$pred$10, $156, Bool$false));
                                    var $158 = $160;
                                };
                                return $158;
                            });
                            var $153 = $157;
                            break;
                        case 'Word.i':
                            var $161 = self.pred;
                            var $162 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $164 = Word$o$(Word$adder$(_a$pred$10, $161, Bool$true));
                                    var $163 = $164;
                                } else {
                                    var $165 = Word$i$(Word$adder$(_a$pred$10, $161, Bool$false));
                                    var $163 = $165;
                                };
                                return $163;
                            });
                            var $153 = $162;
                            break;
                    };
                    var $153 = $153($151);
                    return $153;
                });
                var $148 = $152;
                break;
            case 'Word.i':
                var $166 = self.pred;
                var $167 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.e':
                            var $169 = (_a$pred$8 => {
                                var $170 = Word$e;
                                return $170;
                            });
                            var $168 = $169;
                            break;
                        case 'Word.o':
                            var $171 = self.pred;
                            var $172 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $174 = Word$o$(Word$adder$(_a$pred$10, $171, Bool$true));
                                    var $173 = $174;
                                } else {
                                    var $175 = Word$i$(Word$adder$(_a$pred$10, $171, Bool$false));
                                    var $173 = $175;
                                };
                                return $173;
                            });
                            var $168 = $172;
                            break;
                        case 'Word.i':
                            var $176 = self.pred;
                            var $177 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $179 = Word$i$(Word$adder$(_a$pred$10, $176, Bool$true));
                                    var $178 = $179;
                                } else {
                                    var $180 = Word$o$(Word$adder$(_a$pred$10, $176, Bool$true));
                                    var $178 = $180;
                                };
                                return $178;
                            });
                            var $168 = $177;
                            break;
                    };
                    var $168 = $168($166);
                    return $168;
                });
                var $148 = $167;
                break;
        };
        var $148 = $148(_b$3);
        return $148;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $181 = Word$adder$(_a$2, _b$3, Bool$false);
        return $181;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $183 = Bool$false;
                var $182 = $183;
                break;
            case 'Cmp.eql':
                var $184 = Bool$true;
                var $182 = $184;
                break;
            case 'Cmp.gtn':
                var $185 = Bool$false;
                var $182 = $185;
                break;
        };
        return $182;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $186 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $186;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.e':
                var $188 = Bits$e;
                var $187 = $188;
                break;
            case 'Word.o':
                var $189 = self.pred;
                var $190 = (Word$to_bits$($189) + '0');
                var $187 = $190;
                break;
            case 'Word.i':
                var $191 = self.pred;
                var $192 = (Word$to_bits$($191) + '1');
                var $187 = $192;
                break;
        };
        return $187;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $194 = Word$e;
            var $193 = $194;
        } else {
            var $195 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.e':
                    var $197 = Word$o$(Word$trim$($195, Word$e));
                    var $196 = $197;
                    break;
                case 'Word.o':
                    var $198 = self.pred;
                    var $199 = Word$o$(Word$trim$($195, $198));
                    var $196 = $199;
                    break;
                case 'Word.i':
                    var $200 = self.pred;
                    var $201 = Word$i$(Word$trim$($195, $200));
                    var $196 = $201;
                    break;
            };
            var $193 = $196;
        };
        return $193;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Bits$reverse$tco$(_a$1, _r$2) {
        var Bits$reverse$tco$ = (_a$1, _r$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _r$2]
        });
        var Bits$reverse$tco = _a$1 => _r$2 => Bits$reverse$tco$(_a$1, _r$2);
        var arg = [_a$1, _r$2];
        while (true) {
            let [_a$1, _r$2] = arg;
            var R = (() => {
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $202 = _r$2;
                        return $202;
                    case 'o':
                        var $203 = self.slice(0, -1);
                        var $204 = Bits$reverse$tco$($203, (_r$2 + '0'));
                        return $204;
                    case 'i':
                        var $205 = self.slice(0, -1);
                        var $206 = Bits$reverse$tco$($205, (_r$2 + '1'));
                        return $206;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $207 = Bits$reverse$tco$(_a$1, Bits$e);
        return $207;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);
    const Fm$Name$to_bits = a0 => (fm_name_to_bits(a0));

    function Fm$get$(_name$2, _map$3) {
        var $208 = Map$get$((fm_name_to_bits(_name$2)), _map$3);
        return $208;
    };
    const Fm$get = x0 => x1 => Fm$get$(x0, x1);

    function String$cons$(_head$1, _tail$2) {
        var $209 = (String.fromCharCode(_head$1) + _tail$2);
        return $209;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);

    function Fm$Synth$file_of$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $211 = ".fm";
            var $210 = $211;
        } else {
            var $212 = self.charCodeAt(0);
            var $213 = self.slice(1);
            var self = ($212 === 46);
            if (self) {
                var $215 = ".fm";
                var $214 = $215;
            } else {
                var $216 = String$cons$($212, Fm$Synth$file_of$($213));
                var $214 = $216;
            };
            var $210 = $214;
        };
        return $210;
    };
    const Fm$Synth$file_of = x0 => Fm$Synth$file_of$(x0);

    function IO$get_file$(_name$1) {
        var $217 = IO$ask$("get_file", _name$1, (_file$2 => {
            var $218 = IO$end$(_file$2);
            return $218;
        }));
        return $217;
    };
    const IO$get_file = x0 => IO$get_file$(x0);

    function Parser$(_V$1) {
        var $219 = null;
        return $219;
    };
    const Parser = x0 => Parser$(x0);

    function Parser$Reply$(_V$1) {
        var $220 = null;
        return $220;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$error$(_idx$2, _code$3, _err$4) {
        var $221 = ({
            _: 'Parser.Reply.error',
            'idx': _idx$2,
            'code': _code$3,
            'err': _err$4
        });
        return $221;
    };
    const Parser$Reply$error = x0 => x1 => x2 => Parser$Reply$error$(x0, x1, x2);

    function Parser$bind$(_parse$3, _next$4, _idx$5, _code$6) {
        var self = _parse$3(_idx$5)(_code$6);
        switch (self._) {
            case 'Parser.Reply.error':
                var $223 = self.idx;
                var $224 = self.code;
                var $225 = self.err;
                var $226 = Parser$Reply$error$($223, $224, $225);
                var $222 = $226;
                break;
            case 'Parser.Reply.value':
                var $227 = self.idx;
                var $228 = self.code;
                var $229 = self.val;
                var $230 = _next$4($229)($227)($228);
                var $222 = $230;
                break;
        };
        return $222;
    };
    const Parser$bind = x0 => x1 => x2 => x3 => Parser$bind$(x0, x1, x2, x3);

    function Parser$Reply$value$(_idx$2, _code$3, _val$4) {
        var $231 = ({
            _: 'Parser.Reply.value',
            'idx': _idx$2,
            'code': _code$3,
            'val': _val$4
        });
        return $231;
    };
    const Parser$Reply$value = x0 => x1 => x2 => Parser$Reply$value$(x0, x1, x2);

    function Parser$pure$(_value$2, _idx$3, _code$4) {
        var $232 = Parser$Reply$value$(_idx$3, _code$4, _value$2);
        return $232;
    };
    const Parser$pure = x0 => x1 => x2 => Parser$pure$(x0, x1, x2);
    const Parser$monad = Monad$new$(Parser$bind, Parser$pure);

    function Parser$is_eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $234 = Parser$Reply$value$(_idx$1, _code$2, Bool$true);
            var $233 = $234;
        } else {
            var $235 = self.charCodeAt(0);
            var $236 = self.slice(1);
            var $237 = Parser$Reply$value$(_idx$1, _code$2, Bool$false);
            var $233 = $237;
        };
        return $233;
    };
    const Parser$is_eof = x0 => x1 => Parser$is_eof$(x0, x1);

    function Monad$pure$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Monad.new':
                var $239 = self.bind;
                var $240 = self.pure;
                var $241 = $240;
                var $238 = $241;
                break;
        };
        return $238;
    };
    const Monad$pure = x0 => Monad$pure$(x0);

    function Maybe$some$(_value$2) {
        var $242 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $242;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function Parser$ErrorAt$new$(_idx$1, _code$2, _err$3) {
        var $243 = ({
            _: 'Parser.ErrorAt.new',
            'idx': _idx$1,
            'code': _code$2,
            'err': _err$3
        });
        return $243;
    };
    const Parser$ErrorAt$new = x0 => x1 => x2 => Parser$ErrorAt$new$(x0, x1, x2);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$ErrorAt$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.none':
                var $245 = _b$2;
                var $244 = $245;
                break;
            case 'Maybe.some':
                var $246 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $248 = _a$1;
                        var $247 = $248;
                        break;
                    case 'Maybe.some':
                        var $249 = self.value;
                        var self = $246;
                        switch (self._) {
                            case 'Parser.ErrorAt.new':
                                var $251 = self.idx;
                                var $252 = self.code;
                                var $253 = self.err;
                                var self = $249;
                                switch (self._) {
                                    case 'Parser.ErrorAt.new':
                                        var $255 = self.idx;
                                        var $256 = self.code;
                                        var $257 = self.err;
                                        var self = ($251 > $255);
                                        if (self) {
                                            var $259 = _a$1;
                                            var $258 = $259;
                                        } else {
                                            var $260 = _b$2;
                                            var $258 = $260;
                                        };
                                        var $254 = $258;
                                        break;
                                };
                                var $250 = $254;
                                break;
                        };
                        var $247 = $250;
                        break;
                };
                var $244 = $247;
                break;
        };
        return $244;
    };
    const Parser$ErrorAt$combine = x0 => x1 => Parser$ErrorAt$combine$(x0, x1);

    function Parser$first_of$go$(_pars$2, _err$3, _idx$4, _code$5) {
        var Parser$first_of$go$ = (_pars$2, _err$3, _idx$4, _code$5) => ({
            ctr: 'TCO',
            arg: [_pars$2, _err$3, _idx$4, _code$5]
        });
        var Parser$first_of$go = _pars$2 => _err$3 => _idx$4 => _code$5 => Parser$first_of$go$(_pars$2, _err$3, _idx$4, _code$5);
        var arg = [_pars$2, _err$3, _idx$4, _code$5];
        while (true) {
            let [_pars$2, _err$3, _idx$4, _code$5] = arg;
            var R = (() => {
                var self = _pars$2;
                switch (self._) {
                    case 'List.nil':
                        var self = _err$3;
                        switch (self._) {
                            case 'Maybe.none':
                                var $262 = Parser$Reply$error$(_idx$4, _code$5, "No parse.");
                                var $261 = $262;
                                break;
                            case 'Maybe.some':
                                var $263 = self.value;
                                var self = $263;
                                switch (self._) {
                                    case 'Parser.ErrorAt.new':
                                        var $265 = self.idx;
                                        var $266 = self.code;
                                        var $267 = self.err;
                                        var $268 = Parser$Reply$error$($265, $266, $267);
                                        var $264 = $268;
                                        break;
                                };
                                var $261 = $264;
                                break;
                        };
                        return $261;
                    case 'List.cons':
                        var $269 = self.head;
                        var $270 = self.tail;
                        var _parsed$8 = $269(_idx$4)(_code$5);
                        var self = _parsed$8;
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $272 = self.idx;
                                var $273 = self.code;
                                var $274 = self.err;
                                var _neo$12 = Maybe$some$(Parser$ErrorAt$new$($272, $273, $274));
                                var _err$13 = Parser$ErrorAt$combine$(_neo$12, _err$3);
                                var $275 = Parser$first_of$go$($270, _err$13, _idx$4, _code$5);
                                var $271 = $275;
                                break;
                            case 'Parser.Reply.value':
                                var $276 = self.idx;
                                var $277 = self.code;
                                var $278 = self.val;
                                var $279 = Parser$Reply$value$($276, $277, $278);
                                var $271 = $279;
                                break;
                        };
                        return $271;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$first_of$go = x0 => x1 => x2 => x3 => Parser$first_of$go$(x0, x1, x2, x3);

    function Parser$first_of$(_pars$2) {
        var $280 = Parser$first_of$go(_pars$2)(Maybe$none);
        return $280;
    };
    const Parser$first_of = x0 => Parser$first_of$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $281 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $281;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function List$(_A$1) {
        var $282 = null;
        return $282;
    };
    const List = x0 => List$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Parser$many$go$(_parse$2, _values$3, _idx$4, _code$5) {
        var Parser$many$go$ = (_parse$2, _values$3, _idx$4, _code$5) => ({
            ctr: 'TCO',
            arg: [_parse$2, _values$3, _idx$4, _code$5]
        });
        var Parser$many$go = _parse$2 => _values$3 => _idx$4 => _code$5 => Parser$many$go$(_parse$2, _values$3, _idx$4, _code$5);
        var arg = [_parse$2, _values$3, _idx$4, _code$5];
        while (true) {
            let [_parse$2, _values$3, _idx$4, _code$5] = arg;
            var R = (() => {
                var self = _parse$2(_idx$4)(_code$5);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $283 = self.idx;
                        var $284 = self.code;
                        var $285 = self.err;
                        var $286 = Parser$Reply$value$(_idx$4, _code$5, _values$3(List$nil));
                        return $286;
                    case 'Parser.Reply.value':
                        var $287 = self.idx;
                        var $288 = self.code;
                        var $289 = self.val;
                        var $290 = Parser$many$go$(_parse$2, (_xs$9 => {
                            var $291 = _values$3(List$cons$($289, _xs$9));
                            return $291;
                        }), $287, $288);
                        return $290;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => x3 => Parser$many$go$(x0, x1, x2, x3);

    function Parser$many$(_parser$2) {
        var $292 = Parser$many$go(_parser$2)((_x$3 => {
            var $293 = _x$3;
            return $293;
        }));
        return $292;
    };
    const Parser$many = x0 => Parser$many$(x0);
    const Unit$new = 1;
    const String$concat = a0 => a1 => (a0 + a1);

    function String$flatten$go$(_xs$1, _res$2) {
        var String$flatten$go$ = (_xs$1, _res$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _res$2]
        });
        var String$flatten$go = _xs$1 => _res$2 => String$flatten$go$(_xs$1, _res$2);
        var arg = [_xs$1, _res$2];
        while (true) {
            let [_xs$1, _res$2] = arg;
            var R = (() => {
                var self = _xs$1;
                switch (self._) {
                    case 'List.nil':
                        var $294 = _res$2;
                        return $294;
                    case 'List.cons':
                        var $295 = self.head;
                        var $296 = self.tail;
                        var $297 = String$flatten$go$($296, (_res$2 + $295));
                        return $297;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $298 = String$flatten$go$(_xs$1, "");
        return $298;
    };
    const String$flatten = x0 => String$flatten$(x0);
    const String$nil = '';

    function Parser$text$go$(_text$1, _idx$2, _code$3) {
        var self = _text$1;
        if (self.length === 0) {
            var $300 = Parser$Reply$value$(_idx$2, _code$3, Unit$new);
            var $299 = $300;
        } else {
            var $301 = self.charCodeAt(0);
            var $302 = self.slice(1);
            var self = _code$3;
            if (self.length === 0) {
                var _error$6 = String$flatten$(List$cons$("Expected \'", List$cons$(_text$1, List$cons$("\', found end of file.", List$nil))));
                var $304 = Parser$Reply$error$(_idx$2, _code$3, _error$6);
                var $303 = $304;
            } else {
                var $305 = self.charCodeAt(0);
                var $306 = self.slice(1);
                var self = ($301 === $305);
                if (self) {
                    var $308 = Parser$text$($302, Nat$succ$(_idx$2), $306);
                    var $307 = $308;
                } else {
                    var _error$8 = String$flatten$(List$cons$("Expected \'", List$cons$(_text$1, List$cons$("\', found \'", List$cons$(String$cons$($305, String$nil), List$cons$("\'.", List$nil))))));
                    var $309 = Parser$Reply$error$(_idx$2, _code$3, _error$8);
                    var $307 = $309;
                };
                var $303 = $307;
            };
            var $299 = $303;
        };
        return $299;
    };
    const Parser$text$go = x0 => x1 => x2 => Parser$text$go$(x0, x1, x2);

    function Parser$text$(_text$1, _idx$2, _code$3) {
        var self = Parser$text$go$(_text$1, _idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $311 = self.idx;
                var $312 = self.code;
                var $313 = self.err;
                var $314 = Parser$Reply$error$(_idx$2, _code$3, $313);
                var $310 = $314;
                break;
            case 'Parser.Reply.value':
                var $315 = self.idx;
                var $316 = self.code;
                var $317 = self.val;
                var $318 = Parser$Reply$value$($315, $316, $317);
                var $310 = $318;
                break;
        };
        return $310;
    };
    const Parser$text = x0 => x1 => x2 => Parser$text$(x0, x1, x2);

    function Parser$until$go$(_until$2, _parse$3, _values$4, _idx$5, _code$6) {
        var Parser$until$go$ = (_until$2, _parse$3, _values$4, _idx$5, _code$6) => ({
            ctr: 'TCO',
            arg: [_until$2, _parse$3, _values$4, _idx$5, _code$6]
        });
        var Parser$until$go = _until$2 => _parse$3 => _values$4 => _idx$5 => _code$6 => Parser$until$go$(_until$2, _parse$3, _values$4, _idx$5, _code$6);
        var arg = [_until$2, _parse$3, _values$4, _idx$5, _code$6];
        while (true) {
            let [_until$2, _parse$3, _values$4, _idx$5, _code$6] = arg;
            var R = (() => {
                var _until_reply$7 = _until$2(_idx$5)(_code$6);
                var self = _until_reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $320 = self.idx;
                        var $321 = self.code;
                        var $322 = self.err;
                        var _reply$11 = _parse$3(_idx$5)(_code$6);
                        var self = _reply$11;
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $324 = self.idx;
                                var $325 = self.code;
                                var $326 = self.err;
                                var $327 = Parser$Reply$error$($324, $325, $326);
                                var $323 = $327;
                                break;
                            case 'Parser.Reply.value':
                                var $328 = self.idx;
                                var $329 = self.code;
                                var $330 = self.val;
                                var $331 = Parser$until$go$(_until$2, _parse$3, (_xs$15 => {
                                    var $332 = _values$4(List$cons$($330, _xs$15));
                                    return $332;
                                }), $328, $329);
                                var $323 = $331;
                                break;
                        };
                        var $319 = $323;
                        break;
                    case 'Parser.Reply.value':
                        var $333 = self.idx;
                        var $334 = self.code;
                        var $335 = self.val;
                        var $336 = Parser$Reply$value$($333, $334, _values$4(List$nil));
                        var $319 = $336;
                        break;
                };
                return $319;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$until$go = x0 => x1 => x2 => x3 => x4 => Parser$until$go$(x0, x1, x2, x3, x4);

    function Parser$until$(_until$2, _parse$3) {
        var $337 = Parser$until$go(_until$2)(_parse$3)((_x$4 => {
            var $338 = _x$4;
            return $338;
        }));
        return $337;
    };
    const Parser$until = x0 => x1 => Parser$until$(x0, x1);

    function Parser$one$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $340 = Parser$Reply$error$(_idx$1, _code$2, "Unexpected end of file.");
            var $339 = $340;
        } else {
            var $341 = self.charCodeAt(0);
            var $342 = self.slice(1);
            var $343 = Parser$Reply$value$(Nat$succ$(_idx$1), $342, $341);
            var $339 = $343;
        };
        return $339;
    };
    const Parser$one = x0 => x1 => Parser$one$(x0, x1);
    const Fm$Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$cons$(Monad$bind$(Parser$monad)(Parser$text("//"))((_$1 => {
        var $344 = Monad$bind$(Parser$monad)(Parser$until$(Parser$text("\u{a}"), Parser$one))((_$2 => {
            var $345 = Monad$pure$(Parser$monad)(Unit$new);
            return $345;
        }));
        return $344;
    })), List$nil)))));

    function Fm$Parser$text$(_text$1) {
        var $346 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $347 = Parser$text(_text$1);
            return $347;
        }));
        return $346;
    };
    const Fm$Parser$text = x0 => Fm$Parser$text$(x0);

    function Parser$many1$(_parser$2) {
        var $348 = Monad$bind$(Parser$monad)(_parser$2)((_head$3 => {
            var $349 = Monad$bind$(Parser$monad)(Parser$many$(_parser$2))((_tail$4 => {
                var $350 = Monad$pure$(Parser$monad)(List$cons$(_head$3, _tail$4));
                return $350;
            }));
            return $349;
        }));
        return $348;
    };
    const Parser$many1 = x0 => Parser$many1$(x0);

    function Fm$Name$is_letter$(_chr$1) {
        var self = U16$btw$(65, _chr$1, 90);
        if (self) {
            var $352 = Bool$true;
            var $351 = $352;
        } else {
            var self = U16$btw$(97, _chr$1, 122);
            if (self) {
                var $354 = Bool$true;
                var $353 = $354;
            } else {
                var self = U16$btw$(48, _chr$1, 57);
                if (self) {
                    var $356 = Bool$true;
                    var $355 = $356;
                } else {
                    var self = (46 === _chr$1);
                    if (self) {
                        var $358 = Bool$true;
                        var $357 = $358;
                    } else {
                        var self = (95 === _chr$1);
                        if (self) {
                            var $360 = Bool$true;
                            var $359 = $360;
                        } else {
                            var $361 = Bool$false;
                            var $359 = $361;
                        };
                        var $357 = $359;
                    };
                    var $355 = $357;
                };
                var $353 = $355;
            };
            var $351 = $353;
        };
        return $351;
    };
    const Fm$Name$is_letter = x0 => Fm$Name$is_letter$(x0);

    function Fm$Parser$letter$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $363 = Parser$Reply$error$(_idx$1, _code$2, "Unexpected eof.");
            var $362 = $363;
        } else {
            var $364 = self.charCodeAt(0);
            var $365 = self.slice(1);
            var self = Fm$Name$is_letter$($364);
            if (self) {
                var $367 = Parser$Reply$value$(Nat$succ$(_idx$1), $365, $364);
                var $366 = $367;
            } else {
                var $368 = Parser$Reply$error$(_idx$1, _code$2, "Expected letter.");
                var $366 = $368;
            };
            var $362 = $366;
        };
        return $362;
    };
    const Fm$Parser$letter = x0 => x1 => Fm$Parser$letter$(x0, x1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $370 = _nil$4;
                var $369 = $370;
                break;
            case 'List.cons':
                var $371 = self.head;
                var $372 = self.tail;
                var $373 = _cons$5($371)(List$fold$($372, _nil$4, _cons$5));
                var $369 = $373;
                break;
        };
        return $369;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);
    const Fm$Parser$name1 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$1 => {
        var $374 = Monad$bind$(Parser$monad)(Parser$many1$(Fm$Parser$letter))((_chrs$2 => {
            var $375 = Monad$pure$(Parser$monad)(List$fold$(_chrs$2, String$nil, String$cons));
            return $375;
        }));
        return $374;
    }));

    function Pair$(_A$1, _B$2) {
        var $376 = null;
        return $376;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Parser$until1$(_cond$2, _parser$3) {
        var $377 = Monad$bind$(Parser$monad)(_parser$3)((_head$4 => {
            var $378 = Monad$bind$(Parser$monad)(Parser$until$(_cond$2, _parser$3))((_tail$5 => {
                var $379 = Monad$pure$(Parser$monad)(List$cons$(_head$4, _tail$5));
                return $379;
            }));
            return $378;
        }));
        return $377;
    };
    const Parser$until1 = x0 => x1 => Parser$until1$(x0, x1);

    function Parser$maybe$(_parse$2, _idx$3, _code$4) {
        var self = _parse$2(_idx$3)(_code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $381 = self.idx;
                var $382 = self.code;
                var $383 = self.err;
                var $384 = Parser$Reply$value$(_idx$3, _code$4, Maybe$none);
                var $380 = $384;
                break;
            case 'Parser.Reply.value':
                var $385 = self.idx;
                var $386 = self.code;
                var $387 = self.val;
                var $388 = Parser$Reply$value$($385, $386, Maybe$some$($387));
                var $380 = $388;
                break;
        };
        return $380;
    };
    const Parser$maybe = x0 => x1 => x2 => Parser$maybe$(x0, x1, x2);

    function Fm$Parser$item$(_parser$2) {
        var $389 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$3 => {
            var $390 = Monad$bind$(Parser$monad)(_parser$2)((_value$4 => {
                var $391 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(",")))((_$5 => {
                    var $392 = Monad$pure$(Parser$monad)(_value$4);
                    return $392;
                }));
                return $391;
            }));
            return $390;
        }));
        return $389;
    };
    const Fm$Parser$item = x0 => Fm$Parser$item$(x0);
    const Fm$Parser$name = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$1 => {
        var $393 = Monad$bind$(Parser$monad)(Parser$many$(Fm$Parser$letter))((_chrs$2 => {
            var $394 = Monad$pure$(Parser$monad)(List$fold$(_chrs$2, String$nil, String$cons));
            return $394;
        }));
        return $393;
    }));

    function Parser$get_code$(_idx$1, _code$2) {
        var $395 = Parser$Reply$value$(_idx$1, _code$2, _code$2);
        return $395;
    };
    const Parser$get_code = x0 => x1 => Parser$get_code$(x0, x1);

    function Parser$get_index$(_idx$1, _code$2) {
        var $396 = Parser$Reply$value$(_idx$1, _code$2, _idx$1);
        return $396;
    };
    const Parser$get_index = x0 => x1 => Parser$get_index$(x0, x1);
    const Fm$Parser$init = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$1 => {
        var $397 = Monad$bind$(Parser$monad)(Parser$get_index)((_from$2 => {
            var $398 = Monad$pure$(Parser$monad)(_from$2);
            return $398;
        }));
        return $397;
    }));

    function Fm$Origin$new$(_file$1, _from$2, _upto$3) {
        var $399 = ({
            _: 'Fm.Origin.new',
            'file': _file$1,
            'from': _from$2,
            'upto': _upto$3
        });
        return $399;
    };
    const Fm$Origin$new = x0 => x1 => x2 => Fm$Origin$new$(x0, x1, x2);

    function Fm$Parser$stop$(_from$1) {
        var $400 = Monad$bind$(Parser$monad)(Parser$get_index)((_upto$2 => {
            var _orig$3 = Fm$Origin$new$("", _from$1, _upto$2);
            var $401 = Monad$pure$(Parser$monad)(_orig$3);
            return $401;
        }));
        return $400;
    };
    const Fm$Parser$stop = x0 => Fm$Parser$stop$(x0);

    function Fm$Term$ori$(_orig$1, _expr$2) {
        var $402 = ({
            _: 'Fm.Term.ori',
            'orig': _orig$1,
            'expr': _expr$2
        });
        return $402;
    };
    const Fm$Term$ori = x0 => x1 => Fm$Term$ori$(x0, x1);
    const Fm$Term$typ = ({
        _: 'Fm.Term.typ'
    });
    const Fm$Parser$type = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $403 = Monad$bind$(Parser$monad)(Fm$Parser$text$("Type"))((_$2 => {
            var $404 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$3 => {
                var $405 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$3, Fm$Term$typ));
                return $405;
            }));
            return $404;
        }));
        return $403;
    }));

    function Fm$Term$all$(_eras$1, _self$2, _name$3, _xtyp$4, _body$5) {
        var $406 = ({
            _: 'Fm.Term.all',
            'eras': _eras$1,
            'self': _self$2,
            'name': _name$3,
            'xtyp': _xtyp$4,
            'body': _body$5
        });
        return $406;
    };
    const Fm$Term$all = x0 => x1 => x2 => x3 => x4 => Fm$Term$all$(x0, x1, x2, x3, x4);
    const Fm$Parser$forall = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $407 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_self$2 => {
            var $408 = Monad$bind$(Parser$monad)(Fm$Parser$binder)((_bind$3 => {
                var $409 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$("->")))((_$4 => {
                    var $410 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$5 => {
                        var _term$6 = List$fold$(_bind$3, _body$5, (_x$6 => _t$7 => {
                            var self = _x$6;
                            switch (self._) {
                                case 'Fm.Binder.new':
                                    var $413 = self.eras;
                                    var $414 = self.name;
                                    var $415 = self.term;
                                    var $416 = Fm$Term$all$($413, "", $414, $415, (_s$11 => _x$12 => {
                                        var $417 = _t$7;
                                        return $417;
                                    }));
                                    var $412 = $416;
                                    break;
                            };
                            return $412;
                        }));
                        var $411 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                            var $418 = Monad$pure$(Parser$monad)((() => {
                                var self = _term$6;
                                switch (self._) {
                                    case 'Fm.Term.var':
                                        var $419 = self.name;
                                        var $420 = self.indx;
                                        var $421 = _term$6;
                                        return $421;
                                    case 'Fm.Term.ref':
                                        var $422 = self.name;
                                        var $423 = _term$6;
                                        return $423;
                                    case 'Fm.Term.typ':
                                        var $424 = _term$6;
                                        return $424;
                                    case 'Fm.Term.all':
                                        var $425 = self.eras;
                                        var $426 = self.self;
                                        var $427 = self.name;
                                        var $428 = self.xtyp;
                                        var $429 = self.body;
                                        var $430 = Fm$Term$ori$(_orig$7, Fm$Term$all$($425, _self$2, $427, $428, $429));
                                        return $430;
                                    case 'Fm.Term.lam':
                                        var $431 = self.name;
                                        var $432 = self.body;
                                        var $433 = _term$6;
                                        return $433;
                                    case 'Fm.Term.app':
                                        var $434 = self.func;
                                        var $435 = self.argm;
                                        var $436 = _term$6;
                                        return $436;
                                    case 'Fm.Term.let':
                                        var $437 = self.name;
                                        var $438 = self.expr;
                                        var $439 = self.body;
                                        var $440 = _term$6;
                                        return $440;
                                    case 'Fm.Term.def':
                                        var $441 = self.name;
                                        var $442 = self.expr;
                                        var $443 = self.body;
                                        var $444 = _term$6;
                                        return $444;
                                    case 'Fm.Term.ann':
                                        var $445 = self.done;
                                        var $446 = self.term;
                                        var $447 = self.type;
                                        var $448 = _term$6;
                                        return $448;
                                    case 'Fm.Term.gol':
                                        var $449 = self.name;
                                        var $450 = self.dref;
                                        var $451 = self.verb;
                                        var $452 = _term$6;
                                        return $452;
                                    case 'Fm.Term.hol':
                                        var $453 = self.path;
                                        var $454 = _term$6;
                                        return $454;
                                    case 'Fm.Term.nat':
                                        var $455 = self.natx;
                                        var $456 = _term$6;
                                        return $456;
                                    case 'Fm.Term.chr':
                                        var $457 = self.chrx;
                                        var $458 = _term$6;
                                        return $458;
                                    case 'Fm.Term.str':
                                        var $459 = self.strx;
                                        var $460 = _term$6;
                                        return $460;
                                    case 'Fm.Term.cse':
                                        var $461 = self.path;
                                        var $462 = self.expr;
                                        var $463 = self.name;
                                        var $464 = self.with;
                                        var $465 = self.cses;
                                        var $466 = self.moti;
                                        var $467 = _term$6;
                                        return $467;
                                    case 'Fm.Term.ori':
                                        var $468 = self.orig;
                                        var $469 = self.expr;
                                        var $470 = _term$6;
                                        return $470;
                                };
                            })());
                            return $418;
                        }));
                        return $411;
                    }));
                    return $410;
                }));
                return $409;
            }));
            return $408;
        }));
        return $407;
    }));

    function Fm$Term$lam$(_name$1, _body$2) {
        var $471 = ({
            _: 'Fm.Term.lam',
            'name': _name$1,
            'body': _body$2
        });
        return $471;
    };
    const Fm$Term$lam = x0 => x1 => Fm$Term$lam$(x0, x1);

    function Fm$Parser$make_lambda$(_names$1, _body$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.nil':
                var $473 = _body$2;
                var $472 = $473;
                break;
            case 'List.cons':
                var $474 = self.head;
                var $475 = self.tail;
                var $476 = Fm$Term$lam$($474, (_x$5 => {
                    var $477 = Fm$Parser$make_lambda$($475, _body$2);
                    return $477;
                }));
                var $472 = $476;
                break;
        };
        return $472;
    };
    const Fm$Parser$make_lambda = x0 => x1 => Fm$Parser$make_lambda$(x0, x1);
    const Fm$Parser$lambda = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $478 = Monad$bind$(Parser$monad)(Fm$Parser$text$("("))((_$2 => {
            var $479 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$(")"), Fm$Parser$item$(Fm$Parser$name1)))((_name$3 => {
                var $480 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$4 => {
                    var $481 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                        var _expr$6 = Fm$Parser$make_lambda$(_name$3, _body$4);
                        var $482 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _expr$6));
                        return $482;
                    }));
                    return $481;
                }));
                return $480;
            }));
            return $479;
        }));
        return $478;
    }));
    const Fm$Parser$lambda$erased = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $483 = Monad$bind$(Parser$monad)(Fm$Parser$text$("<"))((_$2 => {
            var $484 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$(">"), Fm$Parser$item$(Fm$Parser$name1)))((_name$3 => {
                var $485 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$4 => {
                    var $486 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                        var _expr$6 = Fm$Parser$make_lambda$(_name$3, _body$4);
                        var $487 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _expr$6));
                        return $487;
                    }));
                    return $486;
                }));
                return $485;
            }));
            return $484;
        }));
        return $483;
    }));
    const Fm$Parser$lambda$nameless = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $488 = Monad$bind$(Parser$monad)(Fm$Parser$text$("()"))((_$2 => {
            var $489 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$3 => {
                var $490 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$4 => {
                    var _expr$5 = Fm$Term$lam$("", (_x$5 => {
                        var $492 = _body$3;
                        return $492;
                    }));
                    var $491 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$4, _expr$5));
                    return $491;
                }));
                return $490;
            }));
            return $489;
        }));
        return $488;
    }));
    const Fm$Parser$parenthesis = Monad$bind$(Parser$monad)(Fm$Parser$text$("("))((_$1 => {
        var $493 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$2 => {
            var $494 = Monad$bind$(Parser$monad)(Fm$Parser$text$(")"))((_$3 => {
                var $495 = Monad$pure$(Parser$monad)(_term$2);
                return $495;
            }));
            return $494;
        }));
        return $493;
    }));

    function Fm$Term$ref$(_name$1) {
        var $496 = ({
            _: 'Fm.Term.ref',
            'name': _name$1
        });
        return $496;
    };
    const Fm$Term$ref = x0 => Fm$Term$ref$(x0);

    function Fm$Term$app$(_func$1, _argm$2) {
        var $497 = ({
            _: 'Fm.Term.app',
            'func': _func$1,
            'argm': _argm$2
        });
        return $497;
    };
    const Fm$Term$app = x0 => x1 => Fm$Term$app$(x0, x1);

    function Fm$Term$hol$(_path$1) {
        var $498 = ({
            _: 'Fm.Term.hol',
            'path': _path$1
        });
        return $498;
    };
    const Fm$Term$hol = x0 => Fm$Term$hol$(x0);

    function Fm$Term$let$(_name$1, _expr$2, _body$3) {
        var $499 = ({
            _: 'Fm.Term.let',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $499;
    };
    const Fm$Term$let = x0 => x1 => x2 => Fm$Term$let$(x0, x1, x2);
    const Fm$Parser$letforin = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $500 = Monad$bind$(Parser$monad)(Fm$Parser$text$("let "))((_$2 => {
            var $501 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$3 => {
                var $502 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$4 => {
                    var $503 = Monad$bind$(Parser$monad)(Fm$Parser$text$("for "))((_$5 => {
                        var $504 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_elem$6 => {
                            var $505 = Monad$bind$(Parser$monad)(Fm$Parser$text$("in"))((_$7 => {
                                var $506 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_list$8 => {
                                    var $507 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$9 => {
                                        var $508 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_loop$10 => {
                                            var $509 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$11 => {
                                                var $510 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$12 => {
                                                    var $511 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$13 => {
                                                        var _term$14 = Fm$Term$ref$("List.for");
                                                        var _term$15 = Fm$Term$app$(_term$14, Fm$Term$hol$(Bits$e));
                                                        var _term$16 = Fm$Term$app$(_term$15, _list$8);
                                                        var _term$17 = Fm$Term$app$(_term$16, Fm$Term$hol$(Bits$e));
                                                        var _term$18 = Fm$Term$app$(_term$17, Fm$Term$ref$(_name$3));
                                                        var _lamb$19 = Fm$Term$lam$(_elem$6, (_i$19 => {
                                                            var $513 = Fm$Term$lam$(_name$3, (_x$20 => {
                                                                var $514 = _loop$10;
                                                                return $514;
                                                            }));
                                                            return $513;
                                                        }));
                                                        var _term$20 = Fm$Term$app$(_term$18, _lamb$19);
                                                        var _term$21 = Fm$Term$let$(_name$3, _term$20, (_x$21 => {
                                                            var $515 = _body$12;
                                                            return $515;
                                                        }));
                                                        var $512 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$13, _term$21));
                                                        return $512;
                                                    }));
                                                    return $511;
                                                }));
                                                return $510;
                                            }));
                                            return $509;
                                        }));
                                        return $508;
                                    }));
                                    return $507;
                                }));
                                return $506;
                            }));
                            return $505;
                        }));
                        return $504;
                    }));
                    return $503;
                }));
                return $502;
            }));
            return $501;
        }));
        return $500;
    }));
    const Fm$Parser$let = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $516 = Monad$bind$(Parser$monad)(Fm$Parser$text$("let "))((_$2 => {
            var $517 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$3 => {
                var $518 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$4 => {
                    var $519 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$5 => {
                        var $520 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$6 => {
                            var $521 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$7 => {
                                var $522 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$8 => {
                                    var $523 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$8, Fm$Term$let$(_name$3, _expr$5, (_x$9 => {
                                        var $524 = _body$7;
                                        return $524;
                                    }))));
                                    return $523;
                                }));
                                return $522;
                            }));
                            return $521;
                        }));
                        return $520;
                    }));
                    return $519;
                }));
                return $518;
            }));
            return $517;
        }));
        return $516;
    }));
    const Fm$Parser$get = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $525 = Monad$bind$(Parser$monad)(Fm$Parser$text$("let "))((_$2 => {
            var $526 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$3 => {
                var $527 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_nam0$4 => {
                    var $528 = Monad$bind$(Parser$monad)(Fm$Parser$text$(","))((_$5 => {
                        var $529 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_nam1$6 => {
                            var $530 = Monad$bind$(Parser$monad)(Fm$Parser$text$("}"))((_$7 => {
                                var $531 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$8 => {
                                    var $532 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$9 => {
                                        var $533 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$10 => {
                                            var $534 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$11 => {
                                                var $535 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$12 => {
                                                    var _term$13 = _expr$9;
                                                    var _term$14 = Fm$Term$app$(_term$13, Fm$Term$lam$("x", (_x$14 => {
                                                        var $537 = Fm$Term$hol$(Bits$e);
                                                        return $537;
                                                    })));
                                                    var _term$15 = Fm$Term$app$(_term$14, Fm$Term$lam$(_nam0$4, (_x$15 => {
                                                        var $538 = Fm$Term$lam$(_nam1$6, (_y$16 => {
                                                            var $539 = _body$11;
                                                            return $539;
                                                        }));
                                                        return $538;
                                                    })));
                                                    var $536 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$12, _term$15));
                                                    return $536;
                                                }));
                                                return $535;
                                            }));
                                            return $534;
                                        }));
                                        return $533;
                                    }));
                                    return $532;
                                }));
                                return $531;
                            }));
                            return $530;
                        }));
                        return $529;
                    }));
                    return $528;
                }));
                return $527;
            }));
            return $526;
        }));
        return $525;
    }));

    function Fm$Term$def$(_name$1, _expr$2, _body$3) {
        var $540 = ({
            _: 'Fm.Term.def',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $540;
    };
    const Fm$Term$def = x0 => x1 => x2 => Fm$Term$def$(x0, x1, x2);
    const Fm$Parser$def = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $541 = Monad$bind$(Parser$monad)(Fm$Parser$text$("def "))((_$2 => {
            var $542 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$3 => {
                var $543 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$4 => {
                    var $544 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$5 => {
                        var $545 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$6 => {
                            var $546 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$7 => {
                                var $547 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$8 => {
                                    var $548 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$8, Fm$Term$def$(_name$3, _expr$5, (_x$9 => {
                                        var $549 = _body$7;
                                        return $549;
                                    }))));
                                    return $548;
                                }));
                                return $547;
                            }));
                            return $546;
                        }));
                        return $545;
                    }));
                    return $544;
                }));
                return $543;
            }));
            return $542;
        }));
        return $541;
    }));
    const Fm$Parser$if = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $550 = Monad$bind$(Parser$monad)(Fm$Parser$text$("if "))((_$2 => {
            var $551 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_cond$3 => {
                var $552 = Monad$bind$(Parser$monad)(Fm$Parser$text$("then"))((_$4 => {
                    var $553 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_tcse$5 => {
                        var $554 = Monad$bind$(Parser$monad)(Fm$Parser$text$("else"))((_$6 => {
                            var $555 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_fcse$7 => {
                                var $556 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$8 => {
                                    var _term$9 = _cond$3;
                                    var _term$10 = Fm$Term$app$(_term$9, Fm$Term$lam$("", (_x$10 => {
                                        var $558 = Fm$Term$hol$(Bits$e);
                                        return $558;
                                    })));
                                    var _term$11 = Fm$Term$app$(_term$10, _tcse$5);
                                    var _term$12 = Fm$Term$app$(_term$11, _fcse$7);
                                    var $557 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$8, _term$12));
                                    return $557;
                                }));
                                return $556;
                            }));
                            return $555;
                        }));
                        return $554;
                    }));
                    return $553;
                }));
                return $552;
            }));
            return $551;
        }));
        return $550;
    }));

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.nil':
                var $560 = List$nil;
                var $559 = $560;
                break;
            case 'List.cons':
                var $561 = self.head;
                var $562 = self.tail;
                var $563 = List$cons$(_f$4($561), List$mapped$($562, _f$4));
                var $559 = $563;
                break;
        };
        return $559;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $564 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $564;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const Fm$backslash = 92;
    const Fm$escapes = List$cons$(Pair$new$("\\b", 8), List$cons$(Pair$new$("\\f", 12), List$cons$(Pair$new$("\\n", 10), List$cons$(Pair$new$("\\r", 13), List$cons$(Pair$new$("\\t", 9), List$cons$(Pair$new$("\\v", 11), List$cons$(Pair$new$(String$cons$(Fm$backslash, String$cons$(Fm$backslash, String$nil)), Fm$backslash), List$cons$(Pair$new$("\\\"", 34), List$cons$(Pair$new$("\\0", 0), List$cons$(Pair$new$("\\\'", 39), List$nil))))))))));
    const Fm$Parser$char$single = Parser$first_of$(List$cons$(Parser$first_of$(List$mapped$(Fm$escapes, (_esc$1 => {
        var self = _esc$1;
        switch (self._) {
            case 'Pair.new':
                var $566 = self.fst;
                var $567 = self.snd;
                var $568 = Monad$bind$(Parser$monad)(Parser$text($566))((_$4 => {
                    var $569 = Monad$pure$(Parser$monad)($567);
                    return $569;
                }));
                var $565 = $568;
                break;
        };
        return $565;
    }))), List$cons$(Parser$one, List$nil)));

    function Fm$Term$chr$(_chrx$1) {
        var $570 = ({
            _: 'Fm.Term.chr',
            'chrx': _chrx$1
        });
        return $570;
    };
    const Fm$Term$chr = x0 => Fm$Term$chr$(x0);
    const Fm$Parser$char = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $571 = Monad$bind$(Parser$monad)(Fm$Parser$text$("\'"))((_$2 => {
            var $572 = Monad$bind$(Parser$monad)(Fm$Parser$char$single)((_chrx$3 => {
                var $573 = Monad$bind$(Parser$monad)(Parser$text("\'"))((_$4 => {
                    var $574 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                        var $575 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$chr$(_chrx$3)));
                        return $575;
                    }));
                    return $574;
                }));
                return $573;
            }));
            return $572;
        }));
        return $571;
    }));

    function Fm$Term$str$(_strx$1) {
        var $576 = ({
            _: 'Fm.Term.str',
            'strx': _strx$1
        });
        return $576;
    };
    const Fm$Term$str = x0 => Fm$Term$str$(x0);
    const Fm$Parser$string = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var _quot$2 = String$cons$(34, String$nil);
        var $577 = Monad$bind$(Parser$monad)(Fm$Parser$text$(_quot$2))((_$3 => {
            var $578 = Monad$bind$(Parser$monad)(Parser$until$(Parser$text(_quot$2), Fm$Parser$char$single))((_chrs$4 => {
                var _strx$5 = List$fold$(_chrs$4, String$nil, String$cons);
                var $579 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$6 => {
                    var $580 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, Fm$Term$str$(_strx$5)));
                    return $580;
                }));
                return $579;
            }));
            return $578;
        }));
        return $577;
    }));
    const Fm$Parser$pair = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $581 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$2 => {
            var $582 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val0$3 => {
                var $583 = Monad$bind$(Parser$monad)(Fm$Parser$text$(","))((_$4 => {
                    var $584 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$5 => {
                        var $585 = Monad$bind$(Parser$monad)(Fm$Parser$text$("}"))((_$6 => {
                            var $586 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                                var _term$8 = Fm$Term$ref$("Pair.new");
                                var _term$9 = Fm$Term$app$(_term$8, Fm$Term$hol$(Bits$e));
                                var _term$10 = Fm$Term$app$(_term$9, Fm$Term$hol$(Bits$e));
                                var _term$11 = Fm$Term$app$(_term$10, _val0$3);
                                var _term$12 = Fm$Term$app$(_term$11, _val1$5);
                                var $587 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$12));
                                return $587;
                            }));
                            return $586;
                        }));
                        return $585;
                    }));
                    return $584;
                }));
                return $583;
            }));
            return $582;
        }));
        return $581;
    }));
    const Fm$Parser$sigma$type = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $588 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$2 => {
            var $589 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$3 => {
                var $590 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$4 => {
                    var $591 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_typ0$5 => {
                        var $592 = Monad$bind$(Parser$monad)(Fm$Parser$text$("}"))((_$6 => {
                            var $593 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_typ1$7 => {
                                var $594 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$8 => {
                                    var _term$9 = Fm$Term$ref$("Sigma");
                                    var _term$10 = Fm$Term$app$(_term$9, _typ0$5);
                                    var _term$11 = Fm$Term$app$(_term$10, Fm$Term$lam$("x", (_x$11 => {
                                        var $596 = _typ1$7;
                                        return $596;
                                    })));
                                    var $595 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$8, _term$11));
                                    return $595;
                                }));
                                return $594;
                            }));
                            return $593;
                        }));
                        return $592;
                    }));
                    return $591;
                }));
                return $590;
            }));
            return $589;
        }));
        return $588;
    }));
    const Fm$Parser$some = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $597 = Monad$bind$(Parser$monad)(Fm$Parser$text$("some("))((_$2 => {
            var $598 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$3 => {
                var $599 = Monad$bind$(Parser$monad)(Fm$Parser$text$(")"))((_$4 => {
                    var $600 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                        var _term$6 = Fm$Term$ref$("Maybe.some");
                        var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                        var _term$8 = Fm$Term$app$(_term$7, _expr$3);
                        var $601 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$8));
                        return $601;
                    }));
                    return $600;
                }));
                return $599;
            }));
            return $598;
        }));
        return $597;
    }));
    const Fm$Parser$apply = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $602 = Monad$bind$(Parser$monad)(Fm$Parser$text$("apply("))((_$2 => {
            var $603 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_func$3 => {
                var $604 = Monad$bind$(Parser$monad)(Fm$Parser$text$(","))((_$4 => {
                    var $605 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_equa$5 => {
                        var $606 = Monad$bind$(Parser$monad)(Fm$Parser$text$(")"))((_$6 => {
                            var $607 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                                var _term$8 = Fm$Term$ref$("Equal.apply");
                                var _term$9 = Fm$Term$app$(_term$8, Fm$Term$hol$(Bits$e));
                                var _term$10 = Fm$Term$app$(_term$9, Fm$Term$hol$(Bits$e));
                                var _term$11 = Fm$Term$app$(_term$10, Fm$Term$hol$(Bits$e));
                                var _term$12 = Fm$Term$app$(_term$11, Fm$Term$hol$(Bits$e));
                                var _term$13 = Fm$Term$app$(_term$12, _func$3);
                                var _term$14 = Fm$Term$app$(_term$13, _equa$5);
                                var $608 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$14));
                                return $608;
                            }));
                            return $607;
                        }));
                        return $606;
                    }));
                    return $605;
                }));
                return $604;
            }));
            return $603;
        }));
        return $602;
    }));

    function Fm$Name$read$(_str$1) {
        var $609 = _str$1;
        return $609;
    };
    const Fm$Name$read = x0 => Fm$Name$read$(x0);
    const Fm$Parser$list = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $610 = Monad$bind$(Parser$monad)(Fm$Parser$text$("["))((_$2 => {
            var $611 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("]"), Fm$Parser$item$(Fm$Parser$term)))((_vals$3 => {
                var $612 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$4 => {
                    var $613 = Monad$pure$(Parser$monad)(List$fold$(_vals$3, Fm$Term$app$(Fm$Term$ref$(Fm$Name$read$("List.nil")), Fm$Term$hol$(Bits$e)), (_x$5 => _xs$6 => {
                        var _term$7 = Fm$Term$ref$(Fm$Name$read$("List.cons"));
                        var _term$8 = Fm$Term$app$(_term$7, Fm$Term$hol$(Bits$e));
                        var _term$9 = Fm$Term$app$(_term$8, _x$5);
                        var _term$10 = Fm$Term$app$(_term$9, _xs$6);
                        var $614 = Fm$Term$ori$(_orig$4, _term$10);
                        return $614;
                    })));
                    return $613;
                }));
                return $612;
            }));
            return $611;
        }));
        return $610;
    }));
    const Fm$Parser$log = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $615 = Monad$bind$(Parser$monad)(Fm$Parser$text$("log("))((_$2 => {
            var $616 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$(")"), Fm$Parser$item$(Fm$Parser$term)))((_strs$3 => {
                var $617 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_cont$4 => {
                    var _term$5 = Fm$Term$ref$("Debug.log");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$hol$(Bits$e));
                    var _args$7 = List$fold$(_strs$3, Fm$Term$ref$("String.nil"), (_x$7 => _xs$8 => {
                        var _arg$9 = Fm$Term$ref$("String.concat");
                        var _arg$10 = Fm$Term$app$(_arg$9, _x$7);
                        var _arg$11 = Fm$Term$app$(_arg$10, _xs$8);
                        var $619 = _arg$11;
                        return $619;
                    }));
                    var _term$8 = Fm$Term$app$(_term$6, _args$7);
                    var _term$9 = Fm$Term$app$(_term$8, Fm$Term$lam$("x", (_x$9 => {
                        var $620 = _cont$4;
                        return $620;
                    })));
                    var $618 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $621 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
                        return $621;
                    }));
                    return $618;
                }));
                return $617;
            }));
            return $616;
        }));
        return $615;
    }));
    const Fm$Parser$forin = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $622 = Monad$bind$(Parser$monad)(Fm$Parser$text$("for "))((_$2 => {
            var $623 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_elem$3 => {
                var $624 = Monad$bind$(Parser$monad)(Fm$Parser$text$("in"))((_$4 => {
                    var $625 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_list$5 => {
                        var $626 = Monad$bind$(Parser$monad)(Fm$Parser$text$("with"))((_$6 => {
                            var $627 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$7 => {
                                var $628 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$8 => {
                                    var $629 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_loop$9 => {
                                        var $630 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                                            var _term$11 = Fm$Term$ref$("List.for");
                                            var _term$12 = Fm$Term$app$(_term$11, Fm$Term$hol$(Bits$e));
                                            var _term$13 = Fm$Term$app$(_term$12, _list$5);
                                            var _term$14 = Fm$Term$app$(_term$13, Fm$Term$hol$(Bits$e));
                                            var _term$15 = Fm$Term$app$(_term$14, Fm$Term$ref$(_name$7));
                                            var _lamb$16 = Fm$Term$lam$(_elem$3, (_i$16 => {
                                                var $632 = Fm$Term$lam$(_name$7, (_x$17 => {
                                                    var $633 = _loop$9;
                                                    return $633;
                                                }));
                                                return $632;
                                            }));
                                            var _term$17 = Fm$Term$app$(_term$15, _lamb$16);
                                            var _term$18 = Fm$Term$let$(_name$7, _term$17, (_x$18 => {
                                                var $634 = Fm$Term$ref$(_name$7);
                                                return $634;
                                            }));
                                            var $631 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$18));
                                            return $631;
                                        }));
                                        return $630;
                                    }));
                                    return $629;
                                }));
                                return $628;
                            }));
                            return $627;
                        }));
                        return $626;
                    }));
                    return $625;
                }));
                return $624;
            }));
            return $623;
        }));
        return $622;
    }));
    const Fm$Parser$forin2 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $635 = Monad$bind$(Parser$monad)(Fm$Parser$text$("for "))((_$2 => {
            var $636 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_elem$3 => {
                var $637 = Monad$bind$(Parser$monad)(Fm$Parser$text$("in"))((_$4 => {
                    var $638 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_list$5 => {
                        var $639 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$6 => {
                            var $640 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$7 => {
                                var $641 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$8 => {
                                    var $642 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_loop$9 => {
                                        var $643 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$10 => {
                                            var $644 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$11 => {
                                                var $645 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$12 => {
                                                    var _term$13 = Fm$Term$ref$("List.for");
                                                    var _term$14 = Fm$Term$app$(_term$13, Fm$Term$hol$(Bits$e));
                                                    var _term$15 = Fm$Term$app$(_term$14, _list$5);
                                                    var _term$16 = Fm$Term$app$(_term$15, Fm$Term$hol$(Bits$e));
                                                    var _term$17 = Fm$Term$app$(_term$16, Fm$Term$ref$(_name$7));
                                                    var _lamb$18 = Fm$Term$lam$(_elem$3, (_i$18 => {
                                                        var $647 = Fm$Term$lam$(_name$7, (_x$19 => {
                                                            var $648 = _loop$9;
                                                            return $648;
                                                        }));
                                                        return $647;
                                                    }));
                                                    var _term$19 = Fm$Term$app$(_term$17, _lamb$18);
                                                    var _term$20 = Fm$Term$let$(_name$7, _term$19, (_x$20 => {
                                                        var $649 = _body$11;
                                                        return $649;
                                                    }));
                                                    var $646 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$12, _term$20));
                                                    return $646;
                                                }));
                                                return $645;
                                            }));
                                            return $644;
                                        }));
                                        return $643;
                                    }));
                                    return $642;
                                }));
                                return $641;
                            }));
                            return $640;
                        }));
                        return $639;
                    }));
                    return $638;
                }));
                return $637;
            }));
            return $636;
        }));
        return $635;
    }));

    function Fm$Parser$do$statements$(_monad_name$1) {
        var $650 = Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $651 = Monad$bind$(Parser$monad)(Fm$Parser$text$("var "))((_$3 => {
                var $652 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
                    var $653 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$5 => {
                        var $654 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$6 => {
                            var $655 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$7 => {
                                var $656 = Monad$bind$(Parser$monad)(Fm$Parser$do$statements$(_monad_name$1))((_body$8 => {
                                    var $657 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$2))((_orig$9 => {
                                        var _term$10 = Fm$Term$app$(Fm$Term$ref$("Monad.bind"), Fm$Term$ref$(_monad_name$1));
                                        var _term$11 = Fm$Term$app$(_term$10, Fm$Term$ref$((_monad_name$1 + ".monad")));
                                        var _term$12 = Fm$Term$app$(_term$11, Fm$Term$hol$(Bits$e));
                                        var _term$13 = Fm$Term$app$(_term$12, Fm$Term$hol$(Bits$e));
                                        var _term$14 = Fm$Term$app$(_term$13, _expr$6);
                                        var _term$15 = Fm$Term$app$(_term$14, Fm$Term$lam$(_name$4, (_x$15 => {
                                            var $659 = _body$8;
                                            return $659;
                                        })));
                                        var $658 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$9, _term$15));
                                        return $658;
                                    }));
                                    return $657;
                                }));
                                return $656;
                            }));
                            return $655;
                        }));
                        return $654;
                    }));
                    return $653;
                }));
                return $652;
            }));
            return $651;
        })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $660 = Monad$bind$(Parser$monad)(Fm$Parser$text$("let "))((_$3 => {
                var $661 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
                    var $662 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$5 => {
                        var $663 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$6 => {
                            var $664 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$7 => {
                                var $665 = Monad$bind$(Parser$monad)(Fm$Parser$do$statements$(_monad_name$1))((_body$8 => {
                                    var $666 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$2))((_orig$9 => {
                                        var $667 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$9, Fm$Term$let$(_name$4, _expr$6, (_x$10 => {
                                            var $668 = _body$8;
                                            return $668;
                                        }))));
                                        return $667;
                                    }));
                                    return $666;
                                }));
                                return $665;
                            }));
                            return $664;
                        }));
                        return $663;
                    }));
                    return $662;
                }));
                return $661;
            }));
            return $660;
        })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $669 = Monad$bind$(Parser$monad)(Fm$Parser$text$("return "))((_$3 => {
                var $670 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$4 => {
                    var $671 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$5 => {
                        var $672 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$2))((_orig$6 => {
                            var _term$7 = Fm$Term$app$(Fm$Term$ref$("Monad.pure"), Fm$Term$ref$(_monad_name$1));
                            var _term$8 = Fm$Term$app$(_term$7, Fm$Term$ref$((_monad_name$1 + ".monad")));
                            var _term$9 = Fm$Term$app$(_term$8, Fm$Term$hol$(Bits$e));
                            var _term$10 = Fm$Term$app$(_term$9, _expr$4);
                            var $673 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, _term$10));
                            return $673;
                        }));
                        return $672;
                    }));
                    return $671;
                }));
                return $670;
            }));
            return $669;
        })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $674 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$3 => {
                var $675 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$4 => {
                    var $676 = Monad$bind$(Parser$monad)(Fm$Parser$do$statements$(_monad_name$1))((_body$5 => {
                        var $677 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$2))((_orig$6 => {
                            var _term$7 = Fm$Term$app$(Fm$Term$ref$("Monad.bind"), Fm$Term$ref$(_monad_name$1));
                            var _term$8 = Fm$Term$app$(_term$7, Fm$Term$ref$((_monad_name$1 + ".monad")));
                            var _term$9 = Fm$Term$app$(_term$8, Fm$Term$hol$(Bits$e));
                            var _term$10 = Fm$Term$app$(_term$9, Fm$Term$hol$(Bits$e));
                            var _term$11 = Fm$Term$app$(_term$10, _expr$3);
                            var _term$12 = Fm$Term$app$(_term$11, Fm$Term$lam$("", (_x$12 => {
                                var $679 = _body$5;
                                return $679;
                            })));
                            var $678 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, _term$12));
                            return $678;
                        }));
                        return $677;
                    }));
                    return $676;
                }));
                return $675;
            }));
            return $674;
        })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$2 => {
            var $680 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$3 => {
                var $681 = Monad$pure$(Parser$monad)(_expr$2);
                return $681;
            }));
            return $680;
        })), List$nil))))));
        return $650;
    };
    const Fm$Parser$do$statements = x0 => Fm$Parser$do$statements$(x0);
    const Fm$Parser$do = Monad$bind$(Parser$monad)(Fm$Parser$text$("do "))((_$1 => {
        var $682 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $683 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$3 => {
                var $684 = Monad$bind$(Parser$monad)(Fm$Parser$do$statements$(_name$2))((_term$4 => {
                    var $685 = Monad$bind$(Parser$monad)(Fm$Parser$text$("}"))((_$5 => {
                        var $686 = Monad$pure$(Parser$monad)(_term$4);
                        return $686;
                    }));
                    return $685;
                }));
                return $684;
            }));
            return $683;
        }));
        return $682;
    }));

    function Fm$Term$nat$(_natx$1) {
        var $687 = ({
            _: 'Fm.Term.nat',
            'natx': _natx$1
        });
        return $687;
    };
    const Fm$Term$nat = x0 => Fm$Term$nat$(x0);

    function Fm$Term$unroll_nat$(_natx$1) {
        var self = _natx$1;
        if (self === 0n) {
            var $689 = Fm$Term$ref$(Fm$Name$read$("Nat.zero"));
            var $688 = $689;
        } else {
            var $690 = (self - 1n);
            var _func$3 = Fm$Term$ref$(Fm$Name$read$("Nat.succ"));
            var _argm$4 = Fm$Term$nat$($690);
            var $691 = Fm$Term$app$(_func$3, _argm$4);
            var $688 = $691;
        };
        return $688;
    };
    const Fm$Term$unroll_nat = x0 => Fm$Term$unroll_nat$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function Fm$Term$unroll_chr$bits$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $693 = Fm$Term$ref$(Fm$Name$read$("Bits.e"));
                var $692 = $693;
                break;
            case 'o':
                var $694 = self.slice(0, -1);
                var $695 = Fm$Term$app$(Fm$Term$ref$(Fm$Name$read$("Bits.o")), Fm$Term$unroll_chr$bits$($694));
                var $692 = $695;
                break;
            case 'i':
                var $696 = self.slice(0, -1);
                var $697 = Fm$Term$app$(Fm$Term$ref$(Fm$Name$read$("Bits.i")), Fm$Term$unroll_chr$bits$($696));
                var $692 = $697;
                break;
        };
        return $692;
    };
    const Fm$Term$unroll_chr$bits = x0 => Fm$Term$unroll_chr$bits$(x0);

    function Fm$Term$unroll_chr$(_chrx$1) {
        var _bits$2 = (u16_to_bits(_chrx$1));
        var _term$3 = Fm$Term$ref$(Fm$Name$read$("Word.from_bits"));
        var _term$4 = Fm$Term$app$(_term$3, Fm$Term$nat$(16n));
        var _term$5 = Fm$Term$app$(_term$4, Fm$Term$unroll_chr$bits$(_bits$2));
        var _term$6 = Fm$Term$app$(Fm$Term$ref$(Fm$Name$read$("U16.new")), _term$5);
        var $698 = _term$6;
        return $698;
    };
    const Fm$Term$unroll_chr = x0 => Fm$Term$unroll_chr$(x0);

    function Fm$Term$unroll_str$(_strx$1) {
        var self = _strx$1;
        if (self.length === 0) {
            var $700 = Fm$Term$ref$(Fm$Name$read$("String.nil"));
            var $699 = $700;
        } else {
            var $701 = self.charCodeAt(0);
            var $702 = self.slice(1);
            var _char$4 = Fm$Term$chr$($701);
            var _term$5 = Fm$Term$ref$(Fm$Name$read$("String.cons"));
            var _term$6 = Fm$Term$app$(_term$5, _char$4);
            var _term$7 = Fm$Term$app$(_term$6, Fm$Term$str$($702));
            var $703 = _term$7;
            var $699 = $703;
        };
        return $699;
    };
    const Fm$Term$unroll_str = x0 => Fm$Term$unroll_str$(x0);

    function Fm$Term$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $705 = self.name;
                var $706 = self.indx;
                var $707 = _term$1;
                var $704 = $707;
                break;
            case 'Fm.Term.ref':
                var $708 = self.name;
                var self = Fm$get$($708, _defs$2);
                switch (self._) {
                    case 'Maybe.none':
                        var $710 = Fm$Term$ref$($708);
                        var $709 = $710;
                        break;
                    case 'Maybe.some':
                        var $711 = self.value;
                        var self = $711;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $713 = self.file;
                                var $714 = self.code;
                                var $715 = self.name;
                                var $716 = self.term;
                                var $717 = self.type;
                                var $718 = self.stat;
                                var $719 = Fm$Term$reduce$($716, _defs$2);
                                var $712 = $719;
                                break;
                        };
                        var $709 = $712;
                        break;
                };
                var $704 = $709;
                break;
            case 'Fm.Term.typ':
                var $720 = _term$1;
                var $704 = $720;
                break;
            case 'Fm.Term.all':
                var $721 = self.eras;
                var $722 = self.self;
                var $723 = self.name;
                var $724 = self.xtyp;
                var $725 = self.body;
                var $726 = _term$1;
                var $704 = $726;
                break;
            case 'Fm.Term.lam':
                var $727 = self.name;
                var $728 = self.body;
                var $729 = _term$1;
                var $704 = $729;
                break;
            case 'Fm.Term.app':
                var $730 = self.func;
                var $731 = self.argm;
                var _func$5 = Fm$Term$reduce$($730, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $733 = self.name;
                        var $734 = self.indx;
                        var $735 = _term$1;
                        var $732 = $735;
                        break;
                    case 'Fm.Term.ref':
                        var $736 = self.name;
                        var $737 = _term$1;
                        var $732 = $737;
                        break;
                    case 'Fm.Term.typ':
                        var $738 = _term$1;
                        var $732 = $738;
                        break;
                    case 'Fm.Term.all':
                        var $739 = self.eras;
                        var $740 = self.self;
                        var $741 = self.name;
                        var $742 = self.xtyp;
                        var $743 = self.body;
                        var $744 = _term$1;
                        var $732 = $744;
                        break;
                    case 'Fm.Term.lam':
                        var $745 = self.name;
                        var $746 = self.body;
                        var $747 = Fm$Term$reduce$($746($731), _defs$2);
                        var $732 = $747;
                        break;
                    case 'Fm.Term.app':
                        var $748 = self.func;
                        var $749 = self.argm;
                        var $750 = _term$1;
                        var $732 = $750;
                        break;
                    case 'Fm.Term.let':
                        var $751 = self.name;
                        var $752 = self.expr;
                        var $753 = self.body;
                        var $754 = _term$1;
                        var $732 = $754;
                        break;
                    case 'Fm.Term.def':
                        var $755 = self.name;
                        var $756 = self.expr;
                        var $757 = self.body;
                        var $758 = _term$1;
                        var $732 = $758;
                        break;
                    case 'Fm.Term.ann':
                        var $759 = self.done;
                        var $760 = self.term;
                        var $761 = self.type;
                        var $762 = _term$1;
                        var $732 = $762;
                        break;
                    case 'Fm.Term.gol':
                        var $763 = self.name;
                        var $764 = self.dref;
                        var $765 = self.verb;
                        var $766 = _term$1;
                        var $732 = $766;
                        break;
                    case 'Fm.Term.hol':
                        var $767 = self.path;
                        var $768 = _term$1;
                        var $732 = $768;
                        break;
                    case 'Fm.Term.nat':
                        var $769 = self.natx;
                        var $770 = _term$1;
                        var $732 = $770;
                        break;
                    case 'Fm.Term.chr':
                        var $771 = self.chrx;
                        var $772 = _term$1;
                        var $732 = $772;
                        break;
                    case 'Fm.Term.str':
                        var $773 = self.strx;
                        var $774 = _term$1;
                        var $732 = $774;
                        break;
                    case 'Fm.Term.cse':
                        var $775 = self.path;
                        var $776 = self.expr;
                        var $777 = self.name;
                        var $778 = self.with;
                        var $779 = self.cses;
                        var $780 = self.moti;
                        var $781 = _term$1;
                        var $732 = $781;
                        break;
                    case 'Fm.Term.ori':
                        var $782 = self.orig;
                        var $783 = self.expr;
                        var $784 = _term$1;
                        var $732 = $784;
                        break;
                };
                var $704 = $732;
                break;
            case 'Fm.Term.let':
                var $785 = self.name;
                var $786 = self.expr;
                var $787 = self.body;
                var $788 = Fm$Term$reduce$($787($786), _defs$2);
                var $704 = $788;
                break;
            case 'Fm.Term.def':
                var $789 = self.name;
                var $790 = self.expr;
                var $791 = self.body;
                var $792 = Fm$Term$reduce$($791($790), _defs$2);
                var $704 = $792;
                break;
            case 'Fm.Term.ann':
                var $793 = self.done;
                var $794 = self.term;
                var $795 = self.type;
                var $796 = Fm$Term$reduce$($794, _defs$2);
                var $704 = $796;
                break;
            case 'Fm.Term.gol':
                var $797 = self.name;
                var $798 = self.dref;
                var $799 = self.verb;
                var $800 = _term$1;
                var $704 = $800;
                break;
            case 'Fm.Term.hol':
                var $801 = self.path;
                var $802 = _term$1;
                var $704 = $802;
                break;
            case 'Fm.Term.nat':
                var $803 = self.natx;
                var $804 = Fm$Term$reduce$(Fm$Term$unroll_nat$($803), _defs$2);
                var $704 = $804;
                break;
            case 'Fm.Term.chr':
                var $805 = self.chrx;
                var $806 = Fm$Term$reduce$(Fm$Term$unroll_chr$($805), _defs$2);
                var $704 = $806;
                break;
            case 'Fm.Term.str':
                var $807 = self.strx;
                var $808 = Fm$Term$reduce$(Fm$Term$unroll_str$($807), _defs$2);
                var $704 = $808;
                break;
            case 'Fm.Term.cse':
                var $809 = self.path;
                var $810 = self.expr;
                var $811 = self.name;
                var $812 = self.with;
                var $813 = self.cses;
                var $814 = self.moti;
                var $815 = _term$1;
                var $704 = $815;
                break;
            case 'Fm.Term.ori':
                var $816 = self.orig;
                var $817 = self.expr;
                var $818 = Fm$Term$reduce$($817, _defs$2);
                var $704 = $818;
                break;
        };
        return $704;
    };
    const Fm$Term$reduce = x0 => x1 => Fm$Term$reduce$(x0, x1);
    const Map$new = ({
        _: 'Map.new'
    });

    function Fm$Def$new$(_file$1, _code$2, _name$3, _term$4, _type$5, _stat$6) {
        var $819 = ({
            _: 'Fm.Def.new',
            'file': _file$1,
            'code': _code$2,
            'name': _name$3,
            'term': _term$4,
            'type': _type$5,
            'stat': _stat$6
        });
        return $819;
    };
    const Fm$Def$new = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Def$new$(x0, x1, x2, x3, x4, x5);
    const Fm$Status$init = ({
        _: 'Fm.Status.init'
    });
    const Fm$Parser$case$with = Monad$bind$(Parser$monad)(Fm$Parser$text$("with"))((_$1 => {
        var $820 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $821 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$3 => {
                var $822 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$4 => {
                    var $823 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$5 => {
                        var $824 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$6 => {
                            var $825 = Monad$pure$(Parser$monad)(Fm$Def$new$("", "", _name$2, _term$6, _type$4, Fm$Status$init));
                            return $825;
                        }));
                        return $824;
                    }));
                    return $823;
                }));
                return $822;
            }));
            return $821;
        }));
        return $820;
    }));
    const Fm$Parser$case$case = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$1 => {
        var $826 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$2 => {
            var $827 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$3 => {
                var $828 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(",")))((_$4 => {
                    var $829 = Monad$pure$(Parser$monad)(Pair$new$(_name$1, _term$3));
                    return $829;
                }));
                return $828;
            }));
            return $827;
        }));
        return $826;
    }));

    function Map$tie$(_val$2, _lft$3, _rgt$4) {
        var $830 = ({
            _: 'Map.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $830;
    };
    const Map$tie = x0 => x1 => x2 => Map$tie$(x0, x1, x2);

    function Map$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'Map.new':
                        var $833 = Map$tie$(Maybe$some$(_val$3), Map$new, Map$new);
                        var $832 = $833;
                        break;
                    case 'Map.tie':
                        var $834 = self.val;
                        var $835 = self.lft;
                        var $836 = self.rgt;
                        var $837 = Map$tie$(Maybe$some$(_val$3), $835, $836);
                        var $832 = $837;
                        break;
                };
                var $831 = $832;
                break;
            case 'o':
                var $838 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.new':
                        var $840 = Map$tie$(Maybe$none, Map$set$($838, _val$3, Map$new), Map$new);
                        var $839 = $840;
                        break;
                    case 'Map.tie':
                        var $841 = self.val;
                        var $842 = self.lft;
                        var $843 = self.rgt;
                        var $844 = Map$tie$($841, Map$set$($838, _val$3, $842), $843);
                        var $839 = $844;
                        break;
                };
                var $831 = $839;
                break;
            case 'i':
                var $845 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.new':
                        var $847 = Map$tie$(Maybe$none, Map$new, Map$set$($845, _val$3, Map$new));
                        var $846 = $847;
                        break;
                    case 'Map.tie':
                        var $848 = self.val;
                        var $849 = self.lft;
                        var $850 = self.rgt;
                        var $851 = Map$tie$($848, $849, Map$set$($845, _val$3, $850));
                        var $846 = $851;
                        break;
                };
                var $831 = $846;
                break;
        };
        return $831;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Map$from_list$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.nil':
                var $853 = Map$new;
                var $852 = $853;
                break;
            case 'List.cons':
                var $854 = self.head;
                var $855 = self.tail;
                var self = $854;
                switch (self._) {
                    case 'Pair.new':
                        var $857 = self.fst;
                        var $858 = self.snd;
                        var $859 = Map$set$(_f$3($857), $858, Map$from_list$(_f$3, $855));
                        var $856 = $859;
                        break;
                };
                var $852 = $856;
                break;
        };
        return $852;
    };
    const Map$from_list = x0 => x1 => Map$from_list$(x0, x1);

    function Fm$Term$cse$(_path$1, _expr$2, _name$3, _with$4, _cses$5, _moti$6) {
        var $860 = ({
            _: 'Fm.Term.cse',
            'path': _path$1,
            'expr': _expr$2,
            'name': _name$3,
            'with': _with$4,
            'cses': _cses$5,
            'moti': _moti$6
        });
        return $860;
    };
    const Fm$Term$cse = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Term$cse$(x0, x1, x2, x3, x4, x5);
    const Fm$Parser$case = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $861 = Monad$bind$(Parser$monad)(Fm$Parser$text$("case "))((_$2 => {
            var $862 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$3 => {
                var $863 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$4 => {
                    var $864 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("as"))((_$5 => {
                        var $865 = Fm$Parser$name1;
                        return $865;
                    }))))((_name$5 => {
                        var self = _name$5;
                        switch (self._) {
                            case 'Maybe.none':
                                var self = Fm$Term$reduce$(_expr$4, Map$new);
                                switch (self._) {
                                    case 'Fm.Term.var':
                                        var $868 = self.name;
                                        var $869 = self.indx;
                                        var $870 = $868;
                                        var $867 = $870;
                                        break;
                                    case 'Fm.Term.ref':
                                        var $871 = self.name;
                                        var $872 = $871;
                                        var $867 = $872;
                                        break;
                                    case 'Fm.Term.typ':
                                        var $873 = Fm$Name$read$("self");
                                        var $867 = $873;
                                        break;
                                    case 'Fm.Term.all':
                                        var $874 = self.eras;
                                        var $875 = self.self;
                                        var $876 = self.name;
                                        var $877 = self.xtyp;
                                        var $878 = self.body;
                                        var $879 = Fm$Name$read$("self");
                                        var $867 = $879;
                                        break;
                                    case 'Fm.Term.lam':
                                        var $880 = self.name;
                                        var $881 = self.body;
                                        var $882 = Fm$Name$read$("self");
                                        var $867 = $882;
                                        break;
                                    case 'Fm.Term.app':
                                        var $883 = self.func;
                                        var $884 = self.argm;
                                        var $885 = Fm$Name$read$("self");
                                        var $867 = $885;
                                        break;
                                    case 'Fm.Term.let':
                                        var $886 = self.name;
                                        var $887 = self.expr;
                                        var $888 = self.body;
                                        var $889 = Fm$Name$read$("self");
                                        var $867 = $889;
                                        break;
                                    case 'Fm.Term.def':
                                        var $890 = self.name;
                                        var $891 = self.expr;
                                        var $892 = self.body;
                                        var $893 = Fm$Name$read$("self");
                                        var $867 = $893;
                                        break;
                                    case 'Fm.Term.ann':
                                        var $894 = self.done;
                                        var $895 = self.term;
                                        var $896 = self.type;
                                        var $897 = Fm$Name$read$("self");
                                        var $867 = $897;
                                        break;
                                    case 'Fm.Term.gol':
                                        var $898 = self.name;
                                        var $899 = self.dref;
                                        var $900 = self.verb;
                                        var $901 = Fm$Name$read$("self");
                                        var $867 = $901;
                                        break;
                                    case 'Fm.Term.hol':
                                        var $902 = self.path;
                                        var $903 = Fm$Name$read$("self");
                                        var $867 = $903;
                                        break;
                                    case 'Fm.Term.nat':
                                        var $904 = self.natx;
                                        var $905 = Fm$Name$read$("self");
                                        var $867 = $905;
                                        break;
                                    case 'Fm.Term.chr':
                                        var $906 = self.chrx;
                                        var $907 = Fm$Name$read$("self");
                                        var $867 = $907;
                                        break;
                                    case 'Fm.Term.str':
                                        var $908 = self.strx;
                                        var $909 = Fm$Name$read$("self");
                                        var $867 = $909;
                                        break;
                                    case 'Fm.Term.cse':
                                        var $910 = self.path;
                                        var $911 = self.expr;
                                        var $912 = self.name;
                                        var $913 = self.with;
                                        var $914 = self.cses;
                                        var $915 = self.moti;
                                        var $916 = Fm$Name$read$("self");
                                        var $867 = $916;
                                        break;
                                    case 'Fm.Term.ori':
                                        var $917 = self.orig;
                                        var $918 = self.expr;
                                        var $919 = Fm$Name$read$("self");
                                        var $867 = $919;
                                        break;
                                };
                                var _name$6 = $867;
                                break;
                            case 'Maybe.some':
                                var $920 = self.value;
                                var $921 = $920;
                                var _name$6 = $921;
                                break;
                        };
                        var $866 = Monad$bind$(Parser$monad)(Parser$many$(Fm$Parser$case$with))((_wyth$7 => {
                            var $922 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$8 => {
                                var $923 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("}"), Fm$Parser$case$case))((_cses$9 => {
                                    var _cses$10 = Map$from_list$(Fm$Name$to_bits, _cses$9);
                                    var $924 = Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$11 => {
                                        var $925 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$12 => {
                                            var $926 = Monad$pure$(Parser$monad)(Maybe$some$(_term$12));
                                            return $926;
                                        }));
                                        return $925;
                                    })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$("!"))((_$11 => {
                                        var $927 = Monad$pure$(Parser$monad)(Maybe$none);
                                        return $927;
                                    })), List$cons$(Monad$pure$(Parser$monad)(Maybe$some$(Fm$Term$hol$(Bits$e))), List$nil)))))((_moti$11 => {
                                        var $928 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$12 => {
                                            var $929 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$12, Fm$Term$cse$(Bits$e, _expr$4, _name$6, _wyth$7, _cses$10, _moti$11)));
                                            return $929;
                                        }));
                                        return $928;
                                    }));
                                    return $924;
                                }));
                                return $923;
                            }));
                            return $922;
                        }));
                        return $866;
                    }));
                    return $864;
                }));
                return $863;
            }));
            return $862;
        }));
        return $861;
    }));
    const Fm$Parser$open = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $930 = Monad$bind$(Parser$monad)(Fm$Parser$text$("open "))((_$2 => {
            var $931 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$3 => {
                var $932 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$4 => {
                    var $933 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("as"))((_$5 => {
                        var $934 = Fm$Parser$name1;
                        return $934;
                    }))))((_name$5 => {
                        var $935 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$6 => {
                            var self = _name$5;
                            switch (self._) {
                                case 'Maybe.none':
                                    var self = Fm$Term$reduce$(_expr$4, Map$new);
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $938 = self.name;
                                            var $939 = self.indx;
                                            var $940 = $938;
                                            var $937 = $940;
                                            break;
                                        case 'Fm.Term.ref':
                                            var $941 = self.name;
                                            var $942 = $941;
                                            var $937 = $942;
                                            break;
                                        case 'Fm.Term.typ':
                                            var $943 = Fm$Name$read$("self");
                                            var $937 = $943;
                                            break;
                                        case 'Fm.Term.all':
                                            var $944 = self.eras;
                                            var $945 = self.self;
                                            var $946 = self.name;
                                            var $947 = self.xtyp;
                                            var $948 = self.body;
                                            var $949 = Fm$Name$read$("self");
                                            var $937 = $949;
                                            break;
                                        case 'Fm.Term.lam':
                                            var $950 = self.name;
                                            var $951 = self.body;
                                            var $952 = Fm$Name$read$("self");
                                            var $937 = $952;
                                            break;
                                        case 'Fm.Term.app':
                                            var $953 = self.func;
                                            var $954 = self.argm;
                                            var $955 = Fm$Name$read$("self");
                                            var $937 = $955;
                                            break;
                                        case 'Fm.Term.let':
                                            var $956 = self.name;
                                            var $957 = self.expr;
                                            var $958 = self.body;
                                            var $959 = Fm$Name$read$("self");
                                            var $937 = $959;
                                            break;
                                        case 'Fm.Term.def':
                                            var $960 = self.name;
                                            var $961 = self.expr;
                                            var $962 = self.body;
                                            var $963 = Fm$Name$read$("self");
                                            var $937 = $963;
                                            break;
                                        case 'Fm.Term.ann':
                                            var $964 = self.done;
                                            var $965 = self.term;
                                            var $966 = self.type;
                                            var $967 = Fm$Name$read$("self");
                                            var $937 = $967;
                                            break;
                                        case 'Fm.Term.gol':
                                            var $968 = self.name;
                                            var $969 = self.dref;
                                            var $970 = self.verb;
                                            var $971 = Fm$Name$read$("self");
                                            var $937 = $971;
                                            break;
                                        case 'Fm.Term.hol':
                                            var $972 = self.path;
                                            var $973 = Fm$Name$read$("self");
                                            var $937 = $973;
                                            break;
                                        case 'Fm.Term.nat':
                                            var $974 = self.natx;
                                            var $975 = Fm$Name$read$("self");
                                            var $937 = $975;
                                            break;
                                        case 'Fm.Term.chr':
                                            var $976 = self.chrx;
                                            var $977 = Fm$Name$read$("self");
                                            var $937 = $977;
                                            break;
                                        case 'Fm.Term.str':
                                            var $978 = self.strx;
                                            var $979 = Fm$Name$read$("self");
                                            var $937 = $979;
                                            break;
                                        case 'Fm.Term.cse':
                                            var $980 = self.path;
                                            var $981 = self.expr;
                                            var $982 = self.name;
                                            var $983 = self.with;
                                            var $984 = self.cses;
                                            var $985 = self.moti;
                                            var $986 = Fm$Name$read$("self");
                                            var $937 = $986;
                                            break;
                                        case 'Fm.Term.ori':
                                            var $987 = self.orig;
                                            var $988 = self.expr;
                                            var $989 = Fm$Name$read$("self");
                                            var $937 = $989;
                                            break;
                                    };
                                    var _name$7 = $937;
                                    break;
                                case 'Maybe.some':
                                    var $990 = self.value;
                                    var $991 = $990;
                                    var _name$7 = $991;
                                    break;
                            };
                            var _wyth$8 = List$nil;
                            var $936 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_rest$9 => {
                                var _cses$10 = Map$from_list$(Fm$Name$to_bits, List$cons$(Pair$new$("_", _rest$9), List$nil));
                                var _moti$11 = Maybe$some$(Fm$Term$hol$(Bits$e));
                                var $992 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$12 => {
                                    var $993 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$12, Fm$Term$cse$(Bits$e, _expr$4, _name$7, _wyth$8, _cses$10, _moti$11)));
                                    return $993;
                                }));
                                return $992;
                            }));
                            return $936;
                        }));
                        return $935;
                    }));
                    return $933;
                }));
                return $932;
            }));
            return $931;
        }));
        return $930;
    }));

    function Parser$digit$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $995 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
            var $994 = $995;
        } else {
            var $996 = self.charCodeAt(0);
            var $997 = self.slice(1);
            var _sidx$5 = Nat$succ$(_idx$1);
            var self = ($996 === 48);
            if (self) {
                var $999 = Parser$Reply$value$(_sidx$5, $997, 0n);
                var $998 = $999;
            } else {
                var self = ($996 === 49);
                if (self) {
                    var $1001 = Parser$Reply$value$(_sidx$5, $997, 1n);
                    var $1000 = $1001;
                } else {
                    var self = ($996 === 50);
                    if (self) {
                        var $1003 = Parser$Reply$value$(_sidx$5, $997, 2n);
                        var $1002 = $1003;
                    } else {
                        var self = ($996 === 51);
                        if (self) {
                            var $1005 = Parser$Reply$value$(_sidx$5, $997, 3n);
                            var $1004 = $1005;
                        } else {
                            var self = ($996 === 52);
                            if (self) {
                                var $1007 = Parser$Reply$value$(_sidx$5, $997, 4n);
                                var $1006 = $1007;
                            } else {
                                var self = ($996 === 53);
                                if (self) {
                                    var $1009 = Parser$Reply$value$(_sidx$5, $997, 5n);
                                    var $1008 = $1009;
                                } else {
                                    var self = ($996 === 54);
                                    if (self) {
                                        var $1011 = Parser$Reply$value$(_sidx$5, $997, 6n);
                                        var $1010 = $1011;
                                    } else {
                                        var self = ($996 === 55);
                                        if (self) {
                                            var $1013 = Parser$Reply$value$(_sidx$5, $997, 7n);
                                            var $1012 = $1013;
                                        } else {
                                            var self = ($996 === 56);
                                            if (self) {
                                                var $1015 = Parser$Reply$value$(_sidx$5, $997, 8n);
                                                var $1014 = $1015;
                                            } else {
                                                var self = ($996 === 57);
                                                if (self) {
                                                    var $1017 = Parser$Reply$value$(_sidx$5, $997, 9n);
                                                    var $1016 = $1017;
                                                } else {
                                                    var $1018 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
                                                    var $1016 = $1018;
                                                };
                                                var $1014 = $1016;
                                            };
                                            var $1012 = $1014;
                                        };
                                        var $1010 = $1012;
                                    };
                                    var $1008 = $1010;
                                };
                                var $1006 = $1008;
                            };
                            var $1004 = $1006;
                        };
                        var $1002 = $1004;
                    };
                    var $1000 = $1002;
                };
                var $998 = $1000;
            };
            var $994 = $998;
        };
        return $994;
    };
    const Parser$digit = x0 => x1 => Parser$digit$(x0, x1);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4) {
        var Nat$from_base$go$ = (_b$1, _ds$2, _p$3, _res$4) => ({
            ctr: 'TCO',
            arg: [_b$1, _ds$2, _p$3, _res$4]
        });
        var Nat$from_base$go = _b$1 => _ds$2 => _p$3 => _res$4 => Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4);
        var arg = [_b$1, _ds$2, _p$3, _res$4];
        while (true) {
            let [_b$1, _ds$2, _p$3, _res$4] = arg;
            var R = (() => {
                var self = _ds$2;
                switch (self._) {
                    case 'List.nil':
                        var $1019 = _res$4;
                        return $1019;
                    case 'List.cons':
                        var $1020 = self.head;
                        var $1021 = self.tail;
                        var $1022 = Nat$from_base$go$(_b$1, $1021, (_b$1 * _p$3), (($1020 * _p$3) + _res$4));
                        return $1022;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function List$reverse$go$(_xs$2, _res$3) {
        var List$reverse$go$ = (_xs$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_xs$2, _res$3]
        });
        var List$reverse$go = _xs$2 => _res$3 => List$reverse$go$(_xs$2, _res$3);
        var arg = [_xs$2, _res$3];
        while (true) {
            let [_xs$2, _res$3] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.nil':
                        var $1023 = _res$3;
                        return $1023;
                    case 'List.cons':
                        var $1024 = self.head;
                        var $1025 = self.tail;
                        var $1026 = List$reverse$go$($1025, List$cons$($1024, _res$3));
                        return $1026;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $1027 = List$reverse$go$(_xs$2, List$nil);
        return $1027;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Nat$from_base$(_base$1, _ds$2) {
        var $1028 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1028;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);
    const Parser$nat = Monad$bind$(Parser$monad)(Parser$many1$(Parser$digit))((_digits$1 => {
        var $1029 = Monad$pure$(Parser$monad)(Nat$from_base$(10n, _digits$1));
        return $1029;
    }));

    function Bits$tail$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $1031 = Bits$e;
                var $1030 = $1031;
                break;
            case 'o':
                var $1032 = self.slice(0, -1);
                var $1033 = $1032;
                var $1030 = $1033;
                break;
            case 'i':
                var $1034 = self.slice(0, -1);
                var $1035 = $1034;
                var $1030 = $1035;
                break;
        };
        return $1030;
    };
    const Bits$tail = x0 => Bits$tail$(x0);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $1037 = (Bits$e + '1');
                var $1036 = $1037;
                break;
            case 'o':
                var $1038 = self.slice(0, -1);
                var $1039 = ($1038 + '1');
                var $1036 = $1039;
                break;
            case 'i':
                var $1040 = self.slice(0, -1);
                var $1041 = (Bits$inc$($1040) + '0');
                var $1036 = $1041;
                break;
        };
        return $1036;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function Maybe$to_bool$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1043 = Bool$false;
                var $1042 = $1043;
                break;
            case 'Maybe.some':
                var $1044 = self.value;
                var $1045 = Bool$true;
                var $1042 = $1045;
                break;
        };
        return $1042;
    };
    const Maybe$to_bool = x0 => Maybe$to_bool$(x0);

    function Fm$Term$gol$(_name$1, _dref$2, _verb$3) {
        var $1046 = ({
            _: 'Fm.Term.gol',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3
        });
        return $1046;
    };
    const Fm$Term$gol = x0 => x1 => x2 => Fm$Term$gol$(x0, x1, x2);
    const Fm$Parser$goal = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1047 = Monad$bind$(Parser$monad)(Fm$Parser$text$("?"))((_$2 => {
            var $1048 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$3 => {
                var $1049 = Monad$bind$(Parser$monad)(Parser$many$(Monad$bind$(Parser$monad)(Fm$Parser$text$("-"))((_$4 => {
                    var $1050 = Monad$bind$(Parser$monad)(Parser$nat)((_nat$5 => {
                        var _bits$6 = Bits$reverse$(Bits$tail$(Bits$reverse$((nat_to_bits(_nat$5)))));
                        var $1051 = Monad$pure$(Parser$monad)(_bits$6);
                        return $1051;
                    }));
                    return $1050;
                }))))((_dref$4 => {
                    var $1052 = Monad$bind$(Parser$monad)(Monad$bind$(Parser$monad)(Parser$maybe(Parser$text("-")))((_verb$5 => {
                        var $1053 = Monad$pure$(Parser$monad)(Maybe$to_bool$(_verb$5));
                        return $1053;
                    })))((_verb$5 => {
                        var $1054 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$6 => {
                            var $1055 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, Fm$Term$gol$(_name$3, _dref$4, _verb$5)));
                            return $1055;
                        }));
                        return $1054;
                    }));
                    return $1052;
                }));
                return $1049;
            }));
            return $1048;
        }));
        return $1047;
    }));
    const Fm$Parser$hole = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1056 = Monad$bind$(Parser$monad)(Fm$Parser$text$("_"))((_$2 => {
            var $1057 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$3 => {
                var $1058 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$3, Fm$Term$hol$(Bits$e)));
                return $1058;
            }));
            return $1057;
        }));
        return $1056;
    }));
    const Fm$Parser$nat = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1059 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1060 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1061 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$4 => {
                    var $1062 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$4, Fm$Term$nat$(_natx$3)));
                    return $1062;
                }));
                return $1061;
            }));
            return $1060;
        }));
        return $1059;
    }));
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $1063 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $1063;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);
    const Fm$Parser$reference = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1064 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var self = (_name$2 === "case");
            if (self) {
                var $1066 = Parser$fail("Reserved keyword.");
                var $1065 = $1066;
            } else {
                var self = (_name$2 === "do");
                if (self) {
                    var $1068 = Parser$fail("Reserved keyword.");
                    var $1067 = $1068;
                } else {
                    var self = (_name$2 === "if");
                    if (self) {
                        var $1070 = Parser$fail("Reserved keyword.");
                        var $1069 = $1070;
                    } else {
                        var self = (_name$2 === "let");
                        if (self) {
                            var $1072 = Parser$fail("Reserved keyword.");
                            var $1071 = $1072;
                        } else {
                            var self = (_name$2 === "def");
                            if (self) {
                                var $1074 = Parser$fail("Reserved keyword.");
                                var $1073 = $1074;
                            } else {
                                var self = (_name$2 === "true");
                                if (self) {
                                    var $1076 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Bool.true"));
                                    var $1075 = $1076;
                                } else {
                                    var self = (_name$2 === "false");
                                    if (self) {
                                        var $1078 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Bool.false"));
                                        var $1077 = $1078;
                                    } else {
                                        var self = (_name$2 === "unit");
                                        if (self) {
                                            var $1080 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Unit.new"));
                                            var $1079 = $1080;
                                        } else {
                                            var self = (_name$2 === "none");
                                            if (self) {
                                                var _term$3 = Fm$Term$ref$("Maybe.none");
                                                var _term$4 = Fm$Term$app$(_term$3, Fm$Term$hol$(Bits$e));
                                                var $1082 = Monad$pure$(Parser$monad)(_term$4);
                                                var $1081 = $1082;
                                            } else {
                                                var self = (_name$2 === "refl");
                                                if (self) {
                                                    var _term$3 = Fm$Term$ref$("Equal.refl");
                                                    var _term$4 = Fm$Term$app$(_term$3, Fm$Term$hol$(Bits$e));
                                                    var _term$5 = Fm$Term$app$(_term$4, Fm$Term$hol$(Bits$e));
                                                    var $1084 = Monad$pure$(Parser$monad)(_term$5);
                                                    var $1083 = $1084;
                                                } else {
                                                    var $1085 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$3 => {
                                                        var $1086 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$3, Fm$Term$ref$(_name$2)));
                                                        return $1086;
                                                    }));
                                                    var $1083 = $1085;
                                                };
                                                var $1081 = $1083;
                                            };
                                            var $1079 = $1081;
                                        };
                                        var $1077 = $1079;
                                    };
                                    var $1075 = $1077;
                                };
                                var $1073 = $1075;
                            };
                            var $1071 = $1073;
                        };
                        var $1069 = $1071;
                    };
                    var $1067 = $1069;
                };
                var $1065 = $1067;
            };
            return $1065;
        }));
        return $1064;
    }));
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Fm$Parser$application$(_init$1, _func$2) {
        var $1087 = Monad$bind$(Parser$monad)(Parser$text("("))((_$3 => {
            var $1088 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$(")"), Fm$Parser$item$(Fm$Parser$term)))((_args$4 => {
                var $1089 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _expr$6 = (() => {
                        var $1092 = _func$2;
                        var $1093 = _args$4;
                        let _f$7 = $1092;
                        let _x$6;
                        while ($1093._ === 'List.cons') {
                            _x$6 = $1093.head;
                            var $1092 = Fm$Term$app$(_f$7, _x$6);
                            _f$7 = $1092;
                            $1093 = $1093.tail;
                        }
                        return _f$7;
                    })();
                    var $1090 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _expr$6));
                    return $1090;
                }));
                return $1089;
            }));
            return $1088;
        }));
        return $1087;
    };
    const Fm$Parser$application = x0 => x1 => Fm$Parser$application$(x0, x1);
    const Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$nil))));

    function Parser$spaces_text$(_text$1) {
        var $1094 = Monad$bind$(Parser$monad)(Parser$spaces)((_$2 => {
            var $1095 = Parser$text(_text$1);
            return $1095;
        }));
        return $1094;
    };
    const Parser$spaces_text = x0 => Parser$spaces_text$(x0);

    function Fm$Parser$application$erased$(_init$1, _func$2) {
        var $1096 = Monad$bind$(Parser$monad)(Parser$get_index)((_init$3 => {
            var $1097 = Monad$bind$(Parser$monad)(Parser$text("<"))((_$4 => {
                var $1098 = Monad$bind$(Parser$monad)(Parser$until1$(Parser$spaces_text$(">"), Fm$Parser$item$(Fm$Parser$term)))((_args$5 => {
                    var $1099 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$3))((_orig$6 => {
                        var _expr$7 = (() => {
                            var $1102 = _func$2;
                            var $1103 = _args$5;
                            let _f$8 = $1102;
                            let _x$7;
                            while ($1103._ === 'List.cons') {
                                _x$7 = $1103.head;
                                var $1102 = Fm$Term$app$(_f$8, _x$7);
                                _f$8 = $1102;
                                $1103 = $1103.tail;
                            }
                            return _f$8;
                        })();
                        var $1100 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, _expr$7));
                        return $1100;
                    }));
                    return $1099;
                }));
                return $1098;
            }));
            return $1097;
        }));
        return $1096;
    };
    const Fm$Parser$application$erased = x0 => x1 => Fm$Parser$application$erased$(x0, x1);

    function Fm$Parser$arrow$(_init$1, _xtyp$2) {
        var $1104 = Monad$bind$(Parser$monad)(Fm$Parser$text$("->"))((_$3 => {
            var $1105 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$4 => {
                var $1106 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1107 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$all$(Bool$false, "", "", _xtyp$2, (_s$6 => _x$7 => {
                        var $1108 = _body$4;
                        return $1108;
                    }))));
                    return $1107;
                }));
                return $1106;
            }));
            return $1105;
        }));
        return $1104;
    };
    const Fm$Parser$arrow = x0 => x1 => Fm$Parser$arrow$(x0, x1);

    function Fm$Parser$op$(_sym$1, _ref$2, _init$3, _val0$4) {
        var $1109 = Monad$bind$(Parser$monad)(Fm$Parser$text$(_sym$1))((_$5 => {
            var $1110 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$6 => {
                var $1111 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$3))((_orig$7 => {
                    var _term$8 = Fm$Term$ref$(_ref$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val0$4);
                    var _term$10 = Fm$Term$app$(_term$9, _val1$6);
                    var $1112 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$10));
                    return $1112;
                }));
                return $1111;
            }));
            return $1110;
        }));
        return $1109;
    };
    const Fm$Parser$op = x0 => x1 => x2 => x3 => Fm$Parser$op$(x0, x1, x2, x3);
    const Fm$Parser$add = Fm$Parser$op("+")("Nat.add");
    const Fm$Parser$sub = Fm$Parser$op("+")("Nat.add");
    const Fm$Parser$mul = Fm$Parser$op("*")("Nat.mul");
    const Fm$Parser$div = Fm$Parser$op("/")("Nat.div");
    const Fm$Parser$mod = Fm$Parser$op("%")("Nat.mod");

    function Fm$Parser$cons$(_init$1, _head$2) {
        var $1113 = Monad$bind$(Parser$monad)(Fm$Parser$text$("&"))((_$3 => {
            var $1114 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_tail$4 => {
                var $1115 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("List.cons");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _head$2);
                    var _term$9 = Fm$Term$app$(_term$8, _tail$4);
                    var $1116 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $1117 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
                        return $1117;
                    }));
                    return $1116;
                }));
                return $1115;
            }));
            return $1114;
        }));
        return $1113;
    };
    const Fm$Parser$cons = x0 => x1 => Fm$Parser$cons$(x0, x1);

    function Fm$Parser$concat$(_init$1, _lst0$2) {
        var $1118 = Monad$bind$(Parser$monad)(Fm$Parser$text$("++"))((_$3 => {
            var $1119 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_lst1$4 => {
                var $1120 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("List.concat");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _lst0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _lst1$4);
                    var $1121 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $1122 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
                        return $1122;
                    }));
                    return $1121;
                }));
                return $1120;
            }));
            return $1119;
        }));
        return $1118;
    };
    const Fm$Parser$concat = x0 => x1 => Fm$Parser$concat$(x0, x1);

    function Fm$Parser$string_concat$(_init$1, _str0$2) {
        var $1123 = Monad$bind$(Parser$monad)(Fm$Parser$text$("|"))((_$3 => {
            var $1124 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_str1$4 => {
                var $1125 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("String.concat");
                    var _term$7 = Fm$Term$app$(_term$6, _str0$2);
                    var _term$8 = Fm$Term$app$(_term$7, _str1$4);
                    var $1126 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$9 => {
                        var $1127 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$9, _term$8));
                        return $1127;
                    }));
                    return $1126;
                }));
                return $1125;
            }));
            return $1124;
        }));
        return $1123;
    };
    const Fm$Parser$string_concat = x0 => x1 => Fm$Parser$string_concat$(x0, x1);

    function Fm$Parser$sigma$(_init$1, _val0$2) {
        var $1128 = Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$3 => {
            var $1129 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1130 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Sigma.new");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, Fm$Term$hol$(Bits$e));
                    var _term$9 = Fm$Term$app$(_term$8, _val0$2);
                    var _term$10 = Fm$Term$app$(_term$9, _val1$4);
                    var $1131 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$10));
                    return $1131;
                }));
                return $1130;
            }));
            return $1129;
        }));
        return $1128;
    };
    const Fm$Parser$sigma = x0 => x1 => Fm$Parser$sigma$(x0, x1);

    function Fm$Parser$equality$(_init$1, _val0$2) {
        var $1132 = Monad$bind$(Parser$monad)(Fm$Parser$text$("=="))((_$3 => {
            var $1133 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1134 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Equal");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _val0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val1$4);
                    var $1135 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$9));
                    return $1135;
                }));
                return $1134;
            }));
            return $1133;
        }));
        return $1132;
    };
    const Fm$Parser$equality = x0 => x1 => Fm$Parser$equality$(x0, x1);

    function Fm$Term$ann$(_done$1, _term$2, _type$3) {
        var $1136 = ({
            _: 'Fm.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $1136;
    };
    const Fm$Term$ann = x0 => x1 => x2 => Fm$Term$ann$(x0, x1, x2);

    function Fm$Parser$annotation$(_init$1, _term$2) {
        var $1137 = Monad$bind$(Parser$monad)(Fm$Parser$text$("::"))((_$3 => {
            var $1138 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$4 => {
                var $1139 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1140 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$ann$(Bool$false, _term$2, _type$4)));
                    return $1140;
                }));
                return $1139;
            }));
            return $1138;
        }));
        return $1137;
    };
    const Fm$Parser$annotation = x0 => x1 => Fm$Parser$annotation$(x0, x1);

    function Fm$Parser$suffix$(_init$1, _term$2, _idx$3, _code$4) {
        var Fm$Parser$suffix$ = (_init$1, _term$2, _idx$3, _code$4) => ({
            ctr: 'TCO',
            arg: [_init$1, _term$2, _idx$3, _code$4]
        });
        var Fm$Parser$suffix = _init$1 => _term$2 => _idx$3 => _code$4 => Fm$Parser$suffix$(_init$1, _term$2, _idx$3, _code$4);
        var arg = [_init$1, _term$2, _idx$3, _code$4];
        while (true) {
            let [_init$1, _term$2, _idx$3, _code$4] = arg;
            var R = (() => {
                var _suffix_parser$5 = Parser$first_of$(List$cons$(Fm$Parser$application$(_init$1, _term$2), List$cons$(Fm$Parser$application$erased$(_init$1, _term$2), List$cons$(Fm$Parser$arrow$(_init$1, _term$2), List$cons$(Fm$Parser$add(_init$1)(_term$2), List$cons$(Fm$Parser$sub(_init$1)(_term$2), List$cons$(Fm$Parser$mul(_init$1)(_term$2), List$cons$(Fm$Parser$div(_init$1)(_term$2), List$cons$(Fm$Parser$mod(_init$1)(_term$2), List$cons$(Fm$Parser$cons$(_init$1, _term$2), List$cons$(Fm$Parser$concat$(_init$1, _term$2), List$cons$(Fm$Parser$string_concat$(_init$1, _term$2), List$cons$(Fm$Parser$sigma$(_init$1, _term$2), List$cons$(Fm$Parser$equality$(_init$1, _term$2), List$cons$(Fm$Parser$annotation$(_init$1, _term$2), List$nil)))))))))))))));
                var self = _suffix_parser$5(_idx$3)(_code$4);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1142 = self.idx;
                        var $1143 = self.code;
                        var $1144 = self.err;
                        var $1145 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $1141 = $1145;
                        break;
                    case 'Parser.Reply.value':
                        var $1146 = self.idx;
                        var $1147 = self.code;
                        var $1148 = self.val;
                        var $1149 = Fm$Parser$suffix$(_init$1, $1148, $1146, $1147);
                        var $1141 = $1149;
                        break;
                };
                return $1141;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Parser$suffix = x0 => x1 => x2 => x3 => Fm$Parser$suffix$(x0, x1, x2, x3);
    const Fm$Parser$term = Monad$bind$(Parser$monad)(Parser$get_code)((_code$1 => {
        var $1150 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $1151 = Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$type, List$cons$(Fm$Parser$forall, List$cons$(Fm$Parser$lambda, List$cons$(Fm$Parser$lambda$erased, List$cons$(Fm$Parser$lambda$nameless, List$cons$(Fm$Parser$parenthesis, List$cons$(Fm$Parser$letforin, List$cons$(Fm$Parser$let, List$cons$(Fm$Parser$get, List$cons$(Fm$Parser$def, List$cons$(Fm$Parser$if, List$cons$(Fm$Parser$char, List$cons$(Fm$Parser$string, List$cons$(Fm$Parser$pair, List$cons$(Fm$Parser$sigma$type, List$cons$(Fm$Parser$some, List$cons$(Fm$Parser$apply, List$cons$(Fm$Parser$list, List$cons$(Fm$Parser$log, List$cons$(Fm$Parser$forin, List$cons$(Fm$Parser$forin2, List$cons$(Fm$Parser$do, List$cons$(Fm$Parser$case, List$cons$(Fm$Parser$open, List$cons$(Fm$Parser$goal, List$cons$(Fm$Parser$hole, List$cons$(Fm$Parser$nat, List$cons$(Fm$Parser$reference, List$nil))))))))))))))))))))))))))))))((_term$3 => {
                var $1152 = Fm$Parser$suffix(_init$2)(_term$3);
                return $1152;
            }));
            return $1151;
        }));
        return $1150;
    }));
    const Fm$Parser$name_term = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$1 => {
        var $1153 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$2 => {
            var $1154 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$3 => {
                var $1155 = Monad$pure$(Parser$monad)(Pair$new$(_name$1, _type$3));
                return $1155;
            }));
            return $1154;
        }));
        return $1153;
    }));

    function Fm$Binder$new$(_eras$1, _name$2, _term$3) {
        var $1156 = ({
            _: 'Fm.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $1156;
    };
    const Fm$Binder$new = x0 => x1 => x2 => Fm$Binder$new$(x0, x1, x2);

    function Fm$Parser$binder$homo$(_eras$1) {
        var $1157 = Monad$bind$(Parser$monad)(Fm$Parser$text$((() => {
            var self = _eras$1;
            if (self) {
                var $1158 = "<";
                return $1158;
            } else {
                var $1159 = "(";
                return $1159;
            };
        })()))((_$2 => {
            var $1160 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$((() => {
                var self = _eras$1;
                if (self) {
                    var $1161 = ">";
                    return $1161;
                } else {
                    var $1162 = ")";
                    return $1162;
                };
            })()), Fm$Parser$item$(Fm$Parser$name_term)))((_bind$3 => {
                var $1163 = Monad$pure$(Parser$monad)(List$mapped$(_bind$3, (_pair$4 => {
                    var self = _pair$4;
                    switch (self._) {
                        case 'Pair.new':
                            var $1165 = self.fst;
                            var $1166 = self.snd;
                            var $1167 = Fm$Binder$new$(_eras$1, $1165, $1166);
                            var $1164 = $1167;
                            break;
                    };
                    return $1164;
                })));
                return $1163;
            }));
            return $1160;
        }));
        return $1157;
    };
    const Fm$Parser$binder$homo = x0 => Fm$Parser$binder$homo$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.nil':
                var $1169 = _bs$3;
                var $1168 = $1169;
                break;
            case 'List.cons':
                var $1170 = self.head;
                var $1171 = self.tail;
                var $1172 = List$cons$($1170, List$concat$($1171, _bs$3));
                var $1168 = $1172;
                break;
        };
        return $1168;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1174 = List$nil;
                var $1173 = $1174;
                break;
            case 'List.cons':
                var $1175 = self.head;
                var $1176 = self.tail;
                var $1177 = List$concat$($1175, List$flatten$($1176));
                var $1173 = $1177;
                break;
        };
        return $1173;
    };
    const List$flatten = x0 => List$flatten$(x0);
    const Fm$Parser$binder = Monad$bind$(Parser$monad)(Parser$many1$(Parser$first_of$(List$cons$(Fm$Parser$binder$homo$(Bool$true), List$cons$(Fm$Parser$binder$homo$(Bool$false), List$nil)))))((_lists$1 => {
        var $1178 = Monad$pure$(Parser$monad)(List$flatten$(_lists$1));
        return $1178;
    }));

    function Fm$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.nil':
                var $1180 = _body$2;
                var $1179 = $1180;
                break;
            case 'List.cons':
                var $1181 = self.head;
                var $1182 = self.tail;
                var self = $1181;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1184 = self.eras;
                        var $1185 = self.name;
                        var $1186 = self.term;
                        var $1187 = Fm$Term$all$($1184, "", $1185, $1186, (_s$8 => _x$9 => {
                            var $1188 = Fm$Parser$make_forall$($1182, _body$2);
                            return $1188;
                        }));
                        var $1183 = $1187;
                        break;
                };
                var $1179 = $1183;
                break;
        };
        return $1179;
    };
    const Fm$Parser$make_forall = x0 => x1 => Fm$Parser$make_forall$(x0, x1);

    function List$at$(_index$2, _list$3) {
        var List$at$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.nil':
                        var $1189 = Maybe$none;
                        return $1189;
                    case 'List.cons':
                        var $1190 = self.head;
                        var $1191 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $1193 = Maybe$some$($1190);
                            var $1192 = $1193;
                        } else {
                            var $1194 = (self - 1n);
                            var $1195 = List$at$($1194, $1191);
                            var $1192 = $1195;
                        };
                        return $1192;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $1196 = List$at$(_index$2, List$reverse$(_list$3));
        return $1196;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Fm$Term$var$(_name$1, _indx$2) {
        var $1197 = ({
            _: 'Fm.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $1197;
    };
    const Fm$Term$var = x0 => x1 => Fm$Term$var$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1199 = self.fst;
                var $1200 = self.snd;
                var $1201 = $1200;
                var $1198 = $1201;
                break;
        };
        return $1198;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Fm$Name$eql$(_a$1, _b$2) {
        var $1202 = (_a$1 === _b$2);
        return $1202;
    };
    const Fm$Name$eql = x0 => x1 => Fm$Name$eql$(x0, x1);

    function Fm$Context$find$(_name$1, _ctx$2) {
        var Fm$Context$find$ = (_name$1, _ctx$2) => ({
            ctr: 'TCO',
            arg: [_name$1, _ctx$2]
        });
        var Fm$Context$find = _name$1 => _ctx$2 => Fm$Context$find$(_name$1, _ctx$2);
        var arg = [_name$1, _ctx$2];
        while (true) {
            let [_name$1, _ctx$2] = arg;
            var R = (() => {
                var self = _ctx$2;
                switch (self._) {
                    case 'List.nil':
                        var $1203 = Maybe$none;
                        return $1203;
                    case 'List.cons':
                        var $1204 = self.head;
                        var $1205 = self.tail;
                        var self = $1204;
                        switch (self._) {
                            case 'Pair.new':
                                var $1207 = self.fst;
                                var $1208 = self.snd;
                                var self = Fm$Name$eql$(_name$1, $1207);
                                if (self) {
                                    var $1210 = Maybe$some$($1208);
                                    var $1209 = $1210;
                                } else {
                                    var $1211 = Fm$Context$find$(_name$1, $1205);
                                    var $1209 = $1211;
                                };
                                var $1206 = $1209;
                                break;
                        };
                        return $1206;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Context$find = x0 => x1 => Fm$Context$find$(x0, x1);

    function List$length$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1213 = 0n;
                var $1212 = $1213;
                break;
            case 'List.cons':
                var $1214 = self.head;
                var $1215 = self.tail;
                var $1216 = Nat$succ$(List$length$($1215));
                var $1212 = $1216;
                break;
        };
        return $1212;
    };
    const List$length = x0 => List$length$(x0);

    function Fm$Path$o$(_path$1, _x$2) {
        var $1217 = _path$1((_x$2 + '0'));
        return $1217;
    };
    const Fm$Path$o = x0 => x1 => Fm$Path$o$(x0, x1);

    function Fm$Path$i$(_path$1, _x$2) {
        var $1218 = _path$1((_x$2 + '1'));
        return $1218;
    };
    const Fm$Path$i = x0 => x1 => Fm$Path$i$(x0, x1);

    function Fm$Path$to_bits$(_path$1) {
        var $1219 = _path$1(Bits$e);
        return $1219;
    };
    const Fm$Path$to_bits = x0 => Fm$Path$to_bits$(x0);

    function Fm$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Fm.Term.var':
                var $1221 = self.name;
                var $1222 = self.indx;
                var self = List$at_last$($1222, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1224 = Fm$Term$var$($1221, $1222);
                        var $1223 = $1224;
                        break;
                    case 'Maybe.some':
                        var $1225 = self.value;
                        var $1226 = Pair$snd$($1225);
                        var $1223 = $1226;
                        break;
                };
                var $1220 = $1223;
                break;
            case 'Fm.Term.ref':
                var $1227 = self.name;
                var self = Fm$Context$find$($1227, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1229 = Fm$Term$ref$($1227);
                        var $1228 = $1229;
                        break;
                    case 'Maybe.some':
                        var $1230 = self.value;
                        var $1231 = $1230;
                        var $1228 = $1231;
                        break;
                };
                var $1220 = $1228;
                break;
            case 'Fm.Term.typ':
                var $1232 = Fm$Term$typ;
                var $1220 = $1232;
                break;
            case 'Fm.Term.all':
                var $1233 = self.eras;
                var $1234 = self.self;
                var $1235 = self.name;
                var $1236 = self.xtyp;
                var $1237 = self.body;
                var _vlen$9 = List$length$(_vars$1);
                var $1238 = Fm$Term$all$($1233, $1234, $1235, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1236), (_s$10 => _x$11 => {
                    var $1239 = Fm$Term$bind$(List$cons$(Pair$new$($1235, _x$11), List$cons$(Pair$new$($1234, _s$10), _vars$1)), Fm$Path$i(_path$2), $1237(Fm$Term$var$($1234, _vlen$9))(Fm$Term$var$($1235, Nat$succ$(_vlen$9))));
                    return $1239;
                }));
                var $1220 = $1238;
                break;
            case 'Fm.Term.lam':
                var $1240 = self.name;
                var $1241 = self.body;
                var _vlen$6 = List$length$(_vars$1);
                var $1242 = Fm$Term$lam$($1240, (_x$7 => {
                    var $1243 = Fm$Term$bind$(List$cons$(Pair$new$($1240, _x$7), _vars$1), Fm$Path$o(_path$2), $1241(Fm$Term$var$($1240, _vlen$6)));
                    return $1243;
                }));
                var $1220 = $1242;
                break;
            case 'Fm.Term.app':
                var $1244 = self.func;
                var $1245 = self.argm;
                var $1246 = Fm$Term$app$(Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1244), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1245));
                var $1220 = $1246;
                break;
            case 'Fm.Term.let':
                var $1247 = self.name;
                var $1248 = self.expr;
                var $1249 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1250 = Fm$Term$let$($1247, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1248), (_x$8 => {
                    var $1251 = Fm$Term$bind$(List$cons$(Pair$new$($1247, _x$8), _vars$1), Fm$Path$i(_path$2), $1249(Fm$Term$var$($1247, _vlen$7)));
                    return $1251;
                }));
                var $1220 = $1250;
                break;
            case 'Fm.Term.def':
                var $1252 = self.name;
                var $1253 = self.expr;
                var $1254 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1255 = Fm$Term$def$($1252, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1253), (_x$8 => {
                    var $1256 = Fm$Term$bind$(List$cons$(Pair$new$($1252, _x$8), _vars$1), Fm$Path$i(_path$2), $1254(Fm$Term$var$($1252, _vlen$7)));
                    return $1256;
                }));
                var $1220 = $1255;
                break;
            case 'Fm.Term.ann':
                var $1257 = self.done;
                var $1258 = self.term;
                var $1259 = self.type;
                var $1260 = Fm$Term$ann$($1257, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1258), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1259));
                var $1220 = $1260;
                break;
            case 'Fm.Term.gol':
                var $1261 = self.name;
                var $1262 = self.dref;
                var $1263 = self.verb;
                var $1264 = Fm$Term$gol$($1261, $1262, $1263);
                var $1220 = $1264;
                break;
            case 'Fm.Term.hol':
                var $1265 = self.path;
                var $1266 = Fm$Term$hol$(Fm$Path$to_bits$(_path$2));
                var $1220 = $1266;
                break;
            case 'Fm.Term.nat':
                var $1267 = self.natx;
                var $1268 = Fm$Term$nat$($1267);
                var $1220 = $1268;
                break;
            case 'Fm.Term.chr':
                var $1269 = self.chrx;
                var $1270 = Fm$Term$chr$($1269);
                var $1220 = $1270;
                break;
            case 'Fm.Term.str':
                var $1271 = self.strx;
                var $1272 = Fm$Term$str$($1271);
                var $1220 = $1272;
                break;
            case 'Fm.Term.cse':
                var $1273 = self.path;
                var $1274 = self.expr;
                var $1275 = self.name;
                var $1276 = self.with;
                var $1277 = self.cses;
                var $1278 = self.moti;
                var _expr$10 = Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1274);
                var _name$11 = $1275;
                var _wyth$12 = $1276;
                var _cses$13 = $1277;
                var _moti$14 = $1278;
                var $1279 = Fm$Term$cse$(Fm$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $1220 = $1279;
                break;
            case 'Fm.Term.ori':
                var $1280 = self.orig;
                var $1281 = self.expr;
                var $1282 = Fm$Term$ori$($1280, Fm$Term$bind$(_vars$1, _path$2, $1281));
                var $1220 = $1282;
                break;
        };
        return $1220;
    };
    const Fm$Term$bind = x0 => x1 => x2 => Fm$Term$bind$(x0, x1, x2);
    const Fm$Status$done = ({
        _: 'Fm.Status.done'
    });

    function Fm$set$(_name$2, _val$3, _map$4) {
        var $1283 = Map$set$((fm_name_to_bits(_name$2)), _val$3, _map$4);
        return $1283;
    };
    const Fm$set = x0 => x1 => x2 => Fm$set$(x0, x1, x2);

    function Fm$define$(_file$1, _code$2, _name$3, _term$4, _type$5, _done$6, _defs$7) {
        var self = _done$6;
        if (self) {
            var $1285 = Fm$Status$done;
            var _stat$8 = $1285;
        } else {
            var $1286 = Fm$Status$init;
            var _stat$8 = $1286;
        };
        var $1284 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$4, _type$5, _stat$8), _defs$7);
        return $1284;
    };
    const Fm$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Fm$define$(x0, x1, x2, x3, x4, x5, x6);

    function Fm$Parser$file$def$(_file$1, _code$2, _defs$3) {
        var $1287 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
            var $1288 = Monad$bind$(Parser$monad)(Parser$many$(Fm$Parser$binder))((_args$5 => {
                var _args$6 = List$flatten$(_args$5);
                var $1289 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$7 => {
                    var $1290 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$8 => {
                        var $1291 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$9 => {
                            var _type$10 = Fm$Parser$make_forall$(_args$6, _type$8);
                            var _term$11 = Fm$Parser$make_lambda$(List$mapped$(_args$6, (_x$11 => {
                                var self = _x$11;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $1294 = self.eras;
                                        var $1295 = self.name;
                                        var $1296 = self.term;
                                        var $1297 = $1295;
                                        var $1293 = $1297;
                                        break;
                                };
                                return $1293;
                            })), _term$9);
                            var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                                var $1298 = (_x$12 + '1');
                                return $1298;
                            }), _type$10);
                            var _term$13 = Fm$Term$bind$(List$nil, (_x$13 => {
                                var $1299 = (_x$13 + '0');
                                return $1299;
                            }), _term$11);
                            var _defs$14 = Fm$define$(_file$1, _code$2, _name$4, _term$13, _type$12, Bool$false, _defs$3);
                            var $1292 = Monad$pure$(Parser$monad)(_defs$14);
                            return $1292;
                        }));
                        return $1291;
                    }));
                    return $1290;
                }));
                return $1289;
            }));
            return $1288;
        }));
        return $1287;
    };
    const Fm$Parser$file$def = x0 => x1 => x2 => Fm$Parser$file$def$(x0, x1, x2);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $1301 = _a$2;
                var $1300 = $1301;
                break;
            case 'Maybe.some':
                var $1302 = self.value;
                var $1303 = $1302;
                var $1300 = $1303;
                break;
        };
        return $1300;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Fm$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $1304 = ({
            _: 'Fm.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $1304;
    };
    const Fm$Constructor$new = x0 => x1 => x2 => Fm$Constructor$new$(x0, x1, x2);

    function Fm$Parser$constructor$(_namespace$1) {
        var $1305 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1306 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_args$3 => {
                var $1307 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1308 = Fm$Parser$binder;
                    return $1308;
                }))))((_inds$4 => {
                    var _args$5 = Maybe$default$(List$nil, _args$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1309 = Monad$pure$(Parser$monad)(Fm$Constructor$new$(_name$2, _args$5, _inds$6));
                    return $1309;
                }));
                return $1307;
            }));
            return $1306;
        }));
        return $1305;
    };
    const Fm$Parser$constructor = x0 => Fm$Parser$constructor$(x0);

    function Fm$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $1310 = ({
            _: 'Fm.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $1310;
    };
    const Fm$Datatype$new = x0 => x1 => x2 => x3 => Fm$Datatype$new$(x0, x1, x2, x3);
    const Fm$Parser$datatype = Monad$bind$(Parser$monad)(Fm$Parser$text$("type "))((_$1 => {
        var $1311 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1312 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_pars$3 => {
                var $1313 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1314 = Fm$Parser$binder;
                    return $1314;
                }))))((_inds$4 => {
                    var _pars$5 = Maybe$default$(List$nil, _pars$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1315 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$7 => {
                        var $1316 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("}"), Fm$Parser$item$(Fm$Parser$constructor$(_name$2))))((_ctrs$8 => {
                            var $1317 = Monad$pure$(Parser$monad)(Fm$Datatype$new$(_name$2, _pars$5, _inds$6, _ctrs$8));
                            return $1317;
                        }));
                        return $1316;
                    }));
                    return $1315;
                }));
                return $1313;
            }));
            return $1312;
        }));
        return $1311;
    }));

    function Fm$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1320 = self.name;
                        var $1321 = self.pars;
                        var $1322 = self.inds;
                        var $1323 = self.ctrs;
                        var _slf$8 = Fm$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $1326 = _slf$8;
                            var $1327 = $1321;
                            let _slf$10 = $1326;
                            let _var$9;
                            while ($1327._ === 'List.cons') {
                                _var$9 = $1327.head;
                                var $1326 = Fm$Term$app$(_slf$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1328 = self.eras;
                                            var $1329 = self.name;
                                            var $1330 = self.term;
                                            var $1331 = $1329;
                                            return $1331;
                                    };
                                })()));
                                _slf$10 = $1326;
                                $1327 = $1327.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $1333 = _slf$9;
                            var $1334 = $1322;
                            let _slf$11 = $1333;
                            let _var$10;
                            while ($1334._ === 'List.cons') {
                                _var$10 = $1334.head;
                                var $1333 = Fm$Term$app$(_slf$11, Fm$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1335 = self.eras;
                                            var $1336 = self.name;
                                            var $1337 = self.term;
                                            var $1338 = $1336;
                                            return $1338;
                                    };
                                })()));
                                _slf$11 = $1333;
                                $1334 = $1334.tail;
                            }
                            return _slf$11;
                        })();
                        var $1324 = Fm$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $1339 = Fm$Term$typ;
                            return $1339;
                        }));
                        var $1319 = $1324;
                        break;
                };
                var $1318 = $1319;
                break;
            case 'List.cons':
                var $1340 = self.head;
                var $1341 = self.tail;
                var self = $1340;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1343 = self.eras;
                        var $1344 = self.name;
                        var $1345 = self.term;
                        var $1346 = Fm$Term$all$($1343, "", $1344, $1345, (_s$9 => _x$10 => {
                            var $1347 = Fm$Datatype$build_term$motive$go$(_type$1, _name$2, $1341);
                            return $1347;
                        }));
                        var $1342 = $1346;
                        break;
                };
                var $1318 = $1342;
                break;
        };
        return $1318;
    };
    const Fm$Datatype$build_term$motive$go = x0 => x1 => x2 => Fm$Datatype$build_term$motive$go$(x0, x1, x2);

    function Fm$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1349 = self.name;
                var $1350 = self.pars;
                var $1351 = self.inds;
                var $1352 = self.ctrs;
                var $1353 = Fm$Datatype$build_term$motive$go$(_type$1, $1349, $1351);
                var $1348 = $1353;
                break;
        };
        return $1348;
    };
    const Fm$Datatype$build_term$motive = x0 => Fm$Datatype$build_term$motive$(x0);

    function Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1356 = self.name;
                        var $1357 = self.pars;
                        var $1358 = self.inds;
                        var $1359 = self.ctrs;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Fm.Constructor.new':
                                var $1361 = self.name;
                                var $1362 = self.args;
                                var $1363 = self.inds;
                                var _ret$11 = Fm$Term$ref$(Fm$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $1366 = _ret$11;
                                    var $1367 = $1363;
                                    let _ret$13 = $1366;
                                    let _var$12;
                                    while ($1367._ === 'List.cons') {
                                        _var$12 = $1367.head;
                                        var $1366 = Fm$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1368 = self.eras;
                                                    var $1369 = self.name;
                                                    var $1370 = self.term;
                                                    var $1371 = $1370;
                                                    return $1371;
                                            };
                                        })());
                                        _ret$13 = $1366;
                                        $1367 = $1367.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($1356, List$cons$(Fm$Name$read$("."), List$cons$($1361, List$nil))));
                                var _slf$14 = Fm$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $1373 = _slf$14;
                                    var $1374 = $1357;
                                    let _slf$16 = $1373;
                                    let _var$15;
                                    while ($1374._ === 'List.cons') {
                                        _var$15 = $1374.head;
                                        var $1373 = Fm$Term$app$(_slf$16, Fm$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1375 = self.eras;
                                                    var $1376 = self.name;
                                                    var $1377 = self.term;
                                                    var $1378 = $1376;
                                                    return $1378;
                                            };
                                        })()));
                                        _slf$16 = $1373;
                                        $1374 = $1374.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $1380 = _slf$15;
                                    var $1381 = $1362;
                                    let _slf$17 = $1380;
                                    let _var$16;
                                    while ($1381._ === 'List.cons') {
                                        _var$16 = $1381.head;
                                        var $1380 = Fm$Term$app$(_slf$17, Fm$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1382 = self.eras;
                                                    var $1383 = self.name;
                                                    var $1384 = self.term;
                                                    var $1385 = $1383;
                                                    return $1385;
                                            };
                                        })()));
                                        _slf$17 = $1380;
                                        $1381 = $1381.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $1364 = Fm$Term$app$(_ret$12, _slf$16);
                                var $1360 = $1364;
                                break;
                        };
                        var $1355 = $1360;
                        break;
                };
                var $1354 = $1355;
                break;
            case 'List.cons':
                var $1386 = self.head;
                var $1387 = self.tail;
                var self = $1386;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1389 = self.eras;
                        var $1390 = self.name;
                        var $1391 = self.term;
                        var _eras$9 = $1389;
                        var _name$10 = $1390;
                        var _xtyp$11 = $1391;
                        var _body$12 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1387);
                        var $1392 = Fm$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $1393 = _body$12;
                            return $1393;
                        }));
                        var $1388 = $1392;
                        break;
                };
                var $1354 = $1388;
                break;
        };
        return $1354;
    };
    const Fm$Datatype$build_term$constructor$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Fm.Constructor.new':
                var $1395 = self.name;
                var $1396 = self.args;
                var $1397 = self.inds;
                var $1398 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1396);
                var $1394 = $1398;
                break;
        };
        return $1394;
    };
    const Fm$Datatype$build_term$constructor = x0 => x1 => Fm$Datatype$build_term$constructor$(x0, x1);

    function Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1401 = self.name;
                        var $1402 = self.pars;
                        var $1403 = self.inds;
                        var $1404 = self.ctrs;
                        var _ret$8 = Fm$Term$ref$(Fm$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $1407 = _ret$8;
                            var $1408 = $1403;
                            let _ret$10 = $1407;
                            let _var$9;
                            while ($1408._ === 'List.cons') {
                                _var$9 = $1408.head;
                                var $1407 = Fm$Term$app$(_ret$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1409 = self.eras;
                                            var $1410 = self.name;
                                            var $1411 = self.term;
                                            var $1412 = $1410;
                                            return $1412;
                                    };
                                })()));
                                _ret$10 = $1407;
                                $1408 = $1408.tail;
                            }
                            return _ret$10;
                        })();
                        var $1405 = Fm$Term$app$(_ret$9, Fm$Term$ref$((_name$2 + ".Self")));
                        var $1400 = $1405;
                        break;
                };
                var $1399 = $1400;
                break;
            case 'List.cons':
                var $1413 = self.head;
                var $1414 = self.tail;
                var self = $1413;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1416 = self.name;
                        var $1417 = self.args;
                        var $1418 = self.inds;
                        var $1419 = Fm$Term$all$(Bool$false, "", $1416, Fm$Datatype$build_term$constructor$(_type$1, $1413), (_s$9 => _x$10 => {
                            var $1420 = Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, $1414);
                            return $1420;
                        }));
                        var $1415 = $1419;
                        break;
                };
                var $1399 = $1415;
                break;
        };
        return $1399;
    };
    const Fm$Datatype$build_term$constructors$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1422 = self.name;
                var $1423 = self.pars;
                var $1424 = self.inds;
                var $1425 = self.ctrs;
                var $1426 = Fm$Datatype$build_term$constructors$go$(_type$1, $1422, $1425);
                var $1421 = $1426;
                break;
        };
        return $1421;
    };
    const Fm$Datatype$build_term$constructors = x0 => Fm$Datatype$build_term$constructors$(x0);

    function Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1429 = Fm$Term$all$(Bool$true, (_name$2 + ".Self"), Fm$Name$read$("P"), Fm$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $1430 = Fm$Datatype$build_term$constructors$(_type$1);
                            return $1430;
                        }));
                        var $1428 = $1429;
                        break;
                    case 'List.cons':
                        var $1431 = self.head;
                        var $1432 = self.tail;
                        var self = $1431;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1434 = self.eras;
                                var $1435 = self.name;
                                var $1436 = self.term;
                                var $1437 = Fm$Term$lam$($1435, (_x$10 => {
                                    var $1438 = Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $1432);
                                    return $1438;
                                }));
                                var $1433 = $1437;
                                break;
                        };
                        var $1428 = $1433;
                        break;
                };
                var $1427 = $1428;
                break;
            case 'List.cons':
                var $1439 = self.head;
                var $1440 = self.tail;
                var self = $1439;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1442 = self.eras;
                        var $1443 = self.name;
                        var $1444 = self.term;
                        var $1445 = Fm$Term$lam$($1443, (_x$10 => {
                            var $1446 = Fm$Datatype$build_term$go$(_type$1, _name$2, $1440, _inds$4);
                            return $1446;
                        }));
                        var $1441 = $1445;
                        break;
                };
                var $1427 = $1441;
                break;
        };
        return $1427;
    };
    const Fm$Datatype$build_term$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_term$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1448 = self.name;
                var $1449 = self.pars;
                var $1450 = self.inds;
                var $1451 = self.ctrs;
                var $1452 = Fm$Datatype$build_term$go$(_type$1, $1448, $1449, $1450);
                var $1447 = $1452;
                break;
        };
        return $1447;
    };
    const Fm$Datatype$build_term = x0 => Fm$Datatype$build_term$(x0);

    function Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1455 = Fm$Term$typ;
                        var $1454 = $1455;
                        break;
                    case 'List.cons':
                        var $1456 = self.head;
                        var $1457 = self.tail;
                        var self = $1456;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1459 = self.eras;
                                var $1460 = self.name;
                                var $1461 = self.term;
                                var $1462 = Fm$Term$all$(Bool$false, "", $1460, $1461, (_s$10 => _x$11 => {
                                    var $1463 = Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $1457);
                                    return $1463;
                                }));
                                var $1458 = $1462;
                                break;
                        };
                        var $1454 = $1458;
                        break;
                };
                var $1453 = $1454;
                break;
            case 'List.cons':
                var $1464 = self.head;
                var $1465 = self.tail;
                var self = $1464;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1467 = self.eras;
                        var $1468 = self.name;
                        var $1469 = self.term;
                        var $1470 = Fm$Term$all$(Bool$false, "", $1468, $1469, (_s$10 => _x$11 => {
                            var $1471 = Fm$Datatype$build_type$go$(_type$1, _name$2, $1465, _inds$4);
                            return $1471;
                        }));
                        var $1466 = $1470;
                        break;
                };
                var $1453 = $1466;
                break;
        };
        return $1453;
    };
    const Fm$Datatype$build_type$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_type$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1473 = self.name;
                var $1474 = self.pars;
                var $1475 = self.inds;
                var $1476 = self.ctrs;
                var $1477 = Fm$Datatype$build_type$go$(_type$1, $1473, $1474, $1475);
                var $1472 = $1477;
                break;
        };
        return $1472;
    };
    const Fm$Datatype$build_type = x0 => Fm$Datatype$build_type$(x0);

    function Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1480 = self.name;
                        var $1481 = self.args;
                        var $1482 = self.inds;
                        var _ret$7 = Fm$Term$ref$($1480);
                        var _ret$8 = (() => {
                            var $1485 = _ret$7;
                            var $1486 = $1481;
                            let _ret$9 = $1485;
                            let _arg$8;
                            while ($1486._ === 'List.cons') {
                                _arg$8 = $1486.head;
                                var $1485 = Fm$Term$app$(_ret$9, Fm$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1487 = self.eras;
                                            var $1488 = self.name;
                                            var $1489 = self.term;
                                            var $1490 = $1488;
                                            return $1490;
                                    };
                                })()));
                                _ret$9 = $1485;
                                $1486 = $1486.tail;
                            }
                            return _ret$9;
                        })();
                        var $1483 = _ret$8;
                        var $1479 = $1483;
                        break;
                };
                var $1478 = $1479;
                break;
            case 'List.cons':
                var $1491 = self.head;
                var $1492 = self.tail;
                var self = $1491;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1494 = self.name;
                        var $1495 = self.args;
                        var $1496 = self.inds;
                        var $1497 = Fm$Term$lam$($1494, (_x$9 => {
                            var $1498 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1492);
                            return $1498;
                        }));
                        var $1493 = $1497;
                        break;
                };
                var $1478 = $1493;
                break;
        };
        return $1478;
    };
    const Fm$Constructor$build_term$opt$go = x0 => x1 => x2 => Fm$Constructor$build_term$opt$go$(x0, x1, x2);

    function Fm$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1500 = self.name;
                var $1501 = self.pars;
                var $1502 = self.inds;
                var $1503 = self.ctrs;
                var $1504 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1503);
                var $1499 = $1504;
                break;
        };
        return $1499;
    };
    const Fm$Constructor$build_term$opt = x0 => x1 => Fm$Constructor$build_term$opt$(x0, x1);

    function Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.nil':
                        var $1507 = Fm$Term$lam$(Fm$Name$read$("P"), (_x$6 => {
                            var $1508 = Fm$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $1508;
                        }));
                        var $1506 = $1507;
                        break;
                    case 'List.cons':
                        var $1509 = self.head;
                        var $1510 = self.tail;
                        var self = $1509;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1512 = self.eras;
                                var $1513 = self.name;
                                var $1514 = self.term;
                                var $1515 = Fm$Term$lam$($1513, (_x$11 => {
                                    var $1516 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $1510);
                                    return $1516;
                                }));
                                var $1511 = $1515;
                                break;
                        };
                        var $1506 = $1511;
                        break;
                };
                var $1505 = $1506;
                break;
            case 'List.cons':
                var $1517 = self.head;
                var $1518 = self.tail;
                var self = $1517;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1520 = self.eras;
                        var $1521 = self.name;
                        var $1522 = self.term;
                        var $1523 = Fm$Term$lam$($1521, (_x$11 => {
                            var $1524 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $1518, _args$5);
                            return $1524;
                        }));
                        var $1519 = $1523;
                        break;
                };
                var $1505 = $1519;
                break;
        };
        return $1505;
    };
    const Fm$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1526 = self.name;
                var $1527 = self.pars;
                var $1528 = self.inds;
                var $1529 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1531 = self.name;
                        var $1532 = self.args;
                        var $1533 = self.inds;
                        var $1534 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, $1526, $1527, $1532);
                        var $1530 = $1534;
                        break;
                };
                var $1525 = $1530;
                break;
        };
        return $1525;
    };
    const Fm$Constructor$build_term = x0 => x1 => Fm$Constructor$build_term$(x0, x1);

    function Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.nil':
                        var self = _type$1;
                        switch (self._) {
                            case 'Fm.Datatype.new':
                                var $1538 = self.name;
                                var $1539 = self.pars;
                                var $1540 = self.inds;
                                var $1541 = self.ctrs;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Fm.Constructor.new':
                                        var $1543 = self.name;
                                        var $1544 = self.args;
                                        var $1545 = self.inds;
                                        var _type$13 = Fm$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $1548 = _type$13;
                                            var $1549 = $1539;
                                            let _type$15 = $1548;
                                            let _var$14;
                                            while ($1549._ === 'List.cons') {
                                                _var$14 = $1549.head;
                                                var $1548 = Fm$Term$app$(_type$15, Fm$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1550 = self.eras;
                                                            var $1551 = self.name;
                                                            var $1552 = self.term;
                                                            var $1553 = $1551;
                                                            return $1553;
                                                    };
                                                })()));
                                                _type$15 = $1548;
                                                $1549 = $1549.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $1555 = _type$14;
                                            var $1556 = $1545;
                                            let _type$16 = $1555;
                                            let _var$15;
                                            while ($1556._ === 'List.cons') {
                                                _var$15 = $1556.head;
                                                var $1555 = Fm$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1557 = self.eras;
                                                            var $1558 = self.name;
                                                            var $1559 = self.term;
                                                            var $1560 = $1559;
                                                            return $1560;
                                                    };
                                                })());
                                                _type$16 = $1555;
                                                $1556 = $1556.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $1546 = _type$15;
                                        var $1542 = $1546;
                                        break;
                                };
                                var $1537 = $1542;
                                break;
                        };
                        var $1536 = $1537;
                        break;
                    case 'List.cons':
                        var $1561 = self.head;
                        var $1562 = self.tail;
                        var self = $1561;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1564 = self.eras;
                                var $1565 = self.name;
                                var $1566 = self.term;
                                var $1567 = Fm$Term$all$($1564, "", $1565, $1566, (_s$11 => _x$12 => {
                                    var $1568 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $1562);
                                    return $1568;
                                }));
                                var $1563 = $1567;
                                break;
                        };
                        var $1536 = $1563;
                        break;
                };
                var $1535 = $1536;
                break;
            case 'List.cons':
                var $1569 = self.head;
                var $1570 = self.tail;
                var self = $1569;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1572 = self.eras;
                        var $1573 = self.name;
                        var $1574 = self.term;
                        var $1575 = Fm$Term$all$($1572, "", $1573, $1574, (_s$11 => _x$12 => {
                            var $1576 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $1570, _args$5);
                            return $1576;
                        }));
                        var $1571 = $1575;
                        break;
                };
                var $1535 = $1571;
                break;
        };
        return $1535;
    };
    const Fm$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1578 = self.name;
                var $1579 = self.pars;
                var $1580 = self.inds;
                var $1581 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1583 = self.name;
                        var $1584 = self.args;
                        var $1585 = self.inds;
                        var $1586 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, $1578, $1579, $1584);
                        var $1582 = $1586;
                        break;
                };
                var $1577 = $1582;
                break;
        };
        return $1577;
    };
    const Fm$Constructor$build_type = x0 => x1 => Fm$Constructor$build_type$(x0, x1);

    function Fm$Parser$file$adt$(_file$1, _code$2, _defs$3) {
        var $1587 = Monad$bind$(Parser$monad)(Fm$Parser$datatype)((_adt$4 => {
            var self = _adt$4;
            switch (self._) {
                case 'Fm.Datatype.new':
                    var $1589 = self.name;
                    var $1590 = self.pars;
                    var $1591 = self.inds;
                    var $1592 = self.ctrs;
                    var _term$9 = Fm$Datatype$build_term$(_adt$4);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $1594 = (_x$10 + '1');
                        return $1594;
                    }), _term$9);
                    var _type$11 = Fm$Datatype$build_type$(_adt$4);
                    var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                        var $1595 = (_x$12 + '0');
                        return $1595;
                    }), _type$11);
                    var _defs$13 = Fm$define$(_file$1, _code$2, $1589, _term$10, _type$12, Bool$false, _defs$3);
                    var _defs$14 = List$fold$($1592, _defs$13, (_ctr$14 => _defs$15 => {
                        var _typ_name$16 = $1589;
                        var _ctr_name$17 = String$flatten$(List$cons$(_typ_name$16, List$cons$(Fm$Name$read$("."), List$cons$((() => {
                            var self = _ctr$14;
                            switch (self._) {
                                case 'Fm.Constructor.new':
                                    var $1597 = self.name;
                                    var $1598 = self.args;
                                    var $1599 = self.inds;
                                    var $1600 = $1597;
                                    return $1600;
                            };
                        })(), List$nil))));
                        var _ctr_term$18 = Fm$Constructor$build_term$(_adt$4, _ctr$14);
                        var _ctr_term$19 = Fm$Term$bind$(List$nil, (_x$19 => {
                            var $1601 = (_x$19 + '1');
                            return $1601;
                        }), _ctr_term$18);
                        var _ctr_type$20 = Fm$Constructor$build_type$(_adt$4, _ctr$14);
                        var _ctr_type$21 = Fm$Term$bind$(List$nil, (_x$21 => {
                            var $1602 = (_x$21 + '0');
                            return $1602;
                        }), _ctr_type$20);
                        var $1596 = Fm$define$(_file$1, _code$2, _ctr_name$17, _ctr_term$19, _ctr_type$21, Bool$false, _defs$15);
                        return $1596;
                    }));
                    var $1593 = Monad$pure$(Parser$monad)(_defs$14);
                    var $1588 = $1593;
                    break;
            };
            return $1588;
        }));
        return $1587;
    };
    const Fm$Parser$file$adt = x0 => x1 => x2 => Fm$Parser$file$adt$(x0, x1, x2);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $1604 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $1603 = $1604;
        } else {
            var $1605 = self.charCodeAt(0);
            var $1606 = self.slice(1);
            var $1607 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $1603 = $1607;
        };
        return $1603;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Fm$Parser$file$end$(_file$1, _code$2, _defs$3) {
        var $1608 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$4 => {
            var $1609 = Monad$bind$(Parser$monad)(Parser$eof)((_$5 => {
                var $1610 = Monad$pure$(Parser$monad)(_defs$3);
                return $1610;
            }));
            return $1609;
        }));
        return $1608;
    };
    const Fm$Parser$file$end = x0 => x1 => x2 => Fm$Parser$file$end$(x0, x1, x2);

    function Fm$Parser$file$(_file$1, _code$2, _defs$3) {
        var $1611 = Monad$bind$(Parser$monad)(Parser$is_eof)((_stop$4 => {
            var self = _stop$4;
            if (self) {
                var $1613 = Monad$pure$(Parser$monad)(_defs$3);
                var $1612 = $1613;
            } else {
                var $1614 = Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$("#"))((_$5 => {
                    var $1615 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_file$6 => {
                        var $1616 = Fm$Parser$file$(_file$6, _code$2, _defs$3);
                        return $1616;
                    }));
                    return $1615;
                })), List$cons$(Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$file$def$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$adt$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$end$(_file$1, _code$2, _defs$3), List$nil)))))((_defs$5 => {
                    var $1617 = Fm$Parser$file$(_file$1, _code$2, _defs$5);
                    return $1617;
                })), List$nil)));
                var $1612 = $1614;
            };
            return $1612;
        }));
        return $1611;
    };
    const Fm$Parser$file = x0 => x1 => x2 => Fm$Parser$file$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $1618 = null;
        return $1618;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $1620 = "";
                var $1619 = $1620;
                break;
            case 'List.cons':
                var $1621 = self.head;
                var $1622 = self.tail;
                var $1623 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $1624 = "";
                        return $1624;
                    } else {
                        var $1625 = _sep$1;
                        return $1625;
                    };
                })(), List$cons$($1621, List$cons$(String$join$go$(_sep$1, $1622, Bool$false), List$nil))));
                var $1619 = $1623;
                break;
        };
        return $1619;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $1626 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $1626;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Fm$highlight$end$(_col$1, _row$2, _res$3) {
        var $1627 = String$join$("\u{a}", _res$3);
        return $1627;
    };
    const Fm$highlight$end = x0 => x1 => x2 => Fm$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1629 = _a$4;
                var $1628 = $1629;
                break;
            case 'Maybe.some':
                var $1630 = self.value;
                var $1631 = _f$5($1630);
                var $1628 = $1631;
                break;
        };
        return $1628;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1633 = Bool$true;
            var $1632 = $1633;
        } else {
            var $1634 = (self - 1n);
            var $1635 = Bool$false;
            var $1632 = $1635;
        };
        return $1632;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1637 = Nat$zero;
            var $1636 = $1637;
        } else {
            var $1638 = (self - 1n);
            var $1639 = Nat$succ$(Nat$succ$(Nat$double$($1638)));
            var $1636 = $1639;
        };
        return $1636;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1641 = Nat$zero;
            var $1640 = $1641;
        } else {
            var $1642 = (self - 1n);
            var $1643 = $1642;
            var $1640 = $1643;
        };
        return $1640;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.nil':
                var $1645 = List$nil;
                var $1644 = $1645;
                break;
            case 'List.cons':
                var $1646 = self.head;
                var $1647 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $1649 = List$nil;
                    var $1648 = $1649;
                } else {
                    var $1650 = (self - 1n);
                    var $1651 = List$cons$($1646, List$take$($1650, $1647));
                    var $1648 = $1651;
                };
                var $1644 = $1648;
                break;
        };
        return $1644;
    };
    const List$take = x0 => x1 => List$take$(x0, x1);

    function String$reverse$go$(_xs$1, _res$2) {
        var String$reverse$go$ = (_xs$1, _res$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _res$2]
        });
        var String$reverse$go = _xs$1 => _res$2 => String$reverse$go$(_xs$1, _res$2);
        var arg = [_xs$1, _res$2];
        while (true) {
            let [_xs$1, _res$2] = arg;
            var R = (() => {
                var self = _xs$1;
                if (self.length === 0) {
                    var $1652 = _res$2;
                    return $1652;
                } else {
                    var $1653 = self.charCodeAt(0);
                    var $1654 = self.slice(1);
                    var $1655 = String$reverse$go$($1654, String$cons$($1653, _res$2));
                    return $1655;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1656 = String$reverse$go$(_xs$1, String$nil);
        return $1656;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $1658 = _str$3;
            var $1657 = $1658;
        } else {
            var $1659 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $1661 = String$cons$(_chr$2, String$pad_right$($1659, _chr$2, ""));
                var $1660 = $1661;
            } else {
                var $1662 = self.charCodeAt(0);
                var $1663 = self.slice(1);
                var $1664 = String$cons$($1662, String$pad_right$($1659, _chr$2, $1663));
                var $1660 = $1664;
            };
            var $1657 = $1660;
        };
        return $1657;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $1665 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $1665;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $1666 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $1666;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $1667 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $1667;
    };
    const Either$right = x0 => Either$right$(x0);

    function Nat$sub_rem$(_n$1, _m$2) {
        var Nat$sub_rem$ = (_n$1, _m$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2]
        });
        var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
        var arg = [_n$1, _m$2];
        while (true) {
            let [_n$1, _m$2] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $1668 = Either$left$(_n$1);
                    return $1668;
                } else {
                    var $1669 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1671 = Either$right$(Nat$succ$($1669));
                        var $1670 = $1671;
                    } else {
                        var $1672 = (self - 1n);
                        var $1673 = Nat$sub_rem$($1672, $1669);
                        var $1670 = $1673;
                    };
                    return $1670;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

    function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
        var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _d$3]
        });
        var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
        var arg = [_n$1, _m$2, _d$3];
        while (true) {
            let [_n$1, _m$2, _d$3] = arg;
            var R = (() => {
                var self = Nat$sub_rem$(_n$1, _m$2);
                switch (self._) {
                    case 'Either.left':
                        var $1674 = self.value;
                        var $1675 = Nat$div_mod$go$($1674, _m$2, Nat$succ$(_d$3));
                        return $1675;
                    case 'Either.right':
                        var $1676 = self.value;
                        var $1677 = Pair$new$(_d$3, _n$1);
                        return $1677;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));

    function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
        var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_base$1, _nat$2, _res$3]
        });
        var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
        var arg = [_base$1, _nat$2, _res$3];
        while (true) {
            let [_base$1, _nat$2, _res$3] = arg;
            var R = (() => {
                var self = (({
                    _: 'Pair.new',
                    'fst': _nat$2 / _base$1,
                    'snd': _nat$2 % _base$1
                }));
                switch (self._) {
                    case 'Pair.new':
                        var $1678 = self.fst;
                        var $1679 = self.snd;
                        var self = $1678;
                        if (self === 0n) {
                            var $1681 = List$cons$($1679, _res$3);
                            var $1680 = $1681;
                        } else {
                            var $1682 = (self - 1n);
                            var $1683 = Nat$to_base$go$(_base$1, $1678, List$cons$($1679, _res$3));
                            var $1680 = $1683;
                        };
                        return $1680;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $1684 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $1684;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);

    function Nat$mod$go$(_n$1, _m$2, _r$3) {
        var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _r$3]
        });
        var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
        var arg = [_n$1, _m$2, _r$3];
        while (true) {
            let [_n$1, _m$2, _r$3] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $1685 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $1685;
                } else {
                    var $1686 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1688 = _r$3;
                        var $1687 = $1688;
                    } else {
                        var $1689 = (self - 1n);
                        var $1690 = Nat$mod$go$($1689, $1686, Nat$succ$(_r$3));
                        var $1687 = $1690;
                    };
                    return $1687;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $1691 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $1691;
    };
    const Nat$mod = x0 => x1 => Nat$mod$(x0, x1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = Nat$mod$(_n$2, _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.none':
                    var $1694 = 35;
                    var $1693 = $1694;
                    break;
                case 'Maybe.some':
                    var $1695 = self.value;
                    var $1696 = $1695;
                    var $1693 = $1696;
                    break;
            };
            var $1692 = $1693;
        } else {
            var $1697 = 35;
            var $1692 = $1697;
        };
        return $1692;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $1698 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $1699 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $1699;
        }));
        return $1698;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $1700 = Nat$to_string_base$(10n, _n$1);
        return $1700;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Fm$color$(_col$1, _str$2) {
        var $1701 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $1701;
    };
    const Fm$color = x0 => x1 => Fm$color$(x0, x1);

    function Fm$highlight$tc$(_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8) {
        var Fm$highlight$tc$ = (_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8) => ({
            ctr: 'TCO',
            arg: [_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8]
        });
        var Fm$highlight$tc = _code$1 => _ix0$2 => _ix1$3 => _col$4 => _row$5 => _lft$6 => _lin$7 => _res$8 => Fm$highlight$tc$(_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8);
        var arg = [_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8];
        while (true) {
            let [_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8] = arg;
            var R = (() => {
                var self = _code$1;
                if (self.length === 0) {
                    var $1702 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    return $1702;
                } else {
                    var $1703 = self.charCodeAt(0);
                    var $1704 = self.slice(1);
                    var self = ($1703 === 10);
                    if (self) {
                        var _stp$11 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$11;
                        if (self) {
                            var $1707 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $1706 = $1707;
                        } else {
                            var _spa$12 = 3n;
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$12));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $1710 = Maybe$some$(_spa$12);
                                        var $1709 = $1710;
                                        break;
                                    case 'Maybe.some':
                                        var $1711 = self.value;
                                        var $1712 = Maybe$some$(Nat$pred$($1711));
                                        var $1709 = $1712;
                                        break;
                                };
                                var _lft$14 = $1709;
                            } else {
                                var $1713 = (self - 1n);
                                var $1714 = _lft$6;
                                var _lft$14 = $1714;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$take$(_siz$13, List$cons$(String$reverse$(_lin$7), _res$8));
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $1708 = Fm$highlight$tc$($1704, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $1706 = $1708;
                        };
                        var $1705 = $1706;
                    } else {
                        var _chr$11 = String$cons$($1703, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $1716 = String$reverse$(Fm$color$("31", Fm$color$("4", _chr$11)));
                            var _chr$12 = $1716;
                        } else {
                            var $1717 = _chr$11;
                            var _chr$12 = $1717;
                        };
                        var _ix0$13 = Nat$pred$(_ix0$2);
                        var _ix1$14 = Nat$pred$(_ix1$3);
                        var _col$15 = Nat$succ$(_col$4);
                        var _lin$16 = String$flatten$(List$cons$(_chr$12, List$cons$(_lin$7, List$nil)));
                        var $1715 = Fm$highlight$tc$($1704, _ix0$13, _ix1$14, _col$15, _row$5, _lft$6, _lin$16, _res$8);
                        var $1705 = $1715;
                    };
                    return $1705;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $1718 = Fm$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $1718;
    };
    const Fm$highlight = x0 => x1 => x2 => Fm$highlight$(x0, x1, x2);

    function Fm$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Fm$Parser$file$(_file$1, _code$2, _defs$3)(0n)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1720 = self.idx;
                var $1721 = self.code;
                var $1722 = self.err;
                var _err$7 = $1722;
                var _hig$8 = Fm$highlight$(_code$2, $1720, Nat$succ$($1720));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $1723 = Either$left$(_str$9);
                var $1719 = $1723;
                break;
            case 'Parser.Reply.value':
                var $1724 = self.idx;
                var $1725 = self.code;
                var $1726 = self.val;
                var $1727 = Either$right$($1726);
                var $1719 = $1727;
                break;
        };
        return $1719;
    };
    const Fm$Defs$read = x0 => x1 => x2 => Fm$Defs$read$(x0, x1, x2);

    function Fm$Synth$load$(_name$1, _defs$2) {
        var _file$3 = Fm$Synth$file_of$(_name$1);
        var $1728 = Monad$bind$(IO$monad)(IO$get_file$(_file$3))((_code$4 => {
            var _read$5 = Fm$Defs$read$(_file$3, _code$4, _defs$2);
            var self = _read$5;
            switch (self._) {
                case 'Either.left':
                    var $1730 = self.value;
                    var $1731 = Monad$pure$(IO$monad)(Maybe$none);
                    var $1729 = $1731;
                    break;
                case 'Either.right':
                    var $1732 = self.value;
                    var _defs$7 = $1732;
                    var self = Fm$get$(_name$1, _defs$7);
                    switch (self._) {
                        case 'Maybe.none':
                            var $1734 = Monad$pure$(IO$monad)(Maybe$none);
                            var $1733 = $1734;
                            break;
                        case 'Maybe.some':
                            var $1735 = self.value;
                            var $1736 = Monad$pure$(IO$monad)(Maybe$some$(_defs$7));
                            var $1733 = $1736;
                            break;
                    };
                    var $1729 = $1733;
                    break;
            };
            return $1729;
        }));
        return $1728;
    };
    const Fm$Synth$load = x0 => x1 => Fm$Synth$load$(x0, x1);

    function IO$print$(_text$1) {
        var $1737 = IO$ask$("print", _text$1, (_skip$2 => {
            var $1738 = IO$end$(Unit$new);
            return $1738;
        }));
        return $1737;
    };
    const IO$print = x0 => IO$print$(x0);
    const Fm$Status$wait = ({
        _: 'Fm.Status.wait'
    });

    function Fm$Check$(_V$1) {
        var $1739 = null;
        return $1739;
    };
    const Fm$Check = x0 => Fm$Check$(x0);

    function Fm$Check$result$(_value$2, _errors$3) {
        var $1740 = ({
            _: 'Fm.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $1740;
    };
    const Fm$Check$result = x0 => x1 => Fm$Check$result$(x0, x1);

    function Fm$Check$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'Fm.Check.result':
                var $1742 = self.value;
                var $1743 = self.errors;
                var self = $1742;
                switch (self._) {
                    case 'Maybe.none':
                        var $1745 = Fm$Check$result$(Maybe$none, $1743);
                        var $1744 = $1745;
                        break;
                    case 'Maybe.some':
                        var $1746 = self.value;
                        var self = _f$4($1746);
                        switch (self._) {
                            case 'Fm.Check.result':
                                var $1748 = self.value;
                                var $1749 = self.errors;
                                var $1750 = Fm$Check$result$($1748, List$concat$($1743, $1749));
                                var $1747 = $1750;
                                break;
                        };
                        var $1744 = $1747;
                        break;
                };
                var $1741 = $1744;
                break;
        };
        return $1741;
    };
    const Fm$Check$bind = x0 => x1 => Fm$Check$bind$(x0, x1);

    function Fm$Check$pure$(_value$2) {
        var $1751 = Fm$Check$result$(Maybe$some$(_value$2), List$nil);
        return $1751;
    };
    const Fm$Check$pure = x0 => Fm$Check$pure$(x0);
    const Fm$Check$monad = Monad$new$(Fm$Check$bind, Fm$Check$pure);

    function Fm$Error$undefined_reference$(_origin$1, _name$2) {
        var $1752 = ({
            _: 'Fm.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $1752;
    };
    const Fm$Error$undefined_reference = x0 => x1 => Fm$Error$undefined_reference$(x0, x1);

    function Fm$Error$waiting$(_name$1) {
        var $1753 = ({
            _: 'Fm.Error.waiting',
            'name': _name$1
        });
        return $1753;
    };
    const Fm$Error$waiting = x0 => Fm$Error$waiting$(x0);

    function Fm$Error$indirect$(_name$1) {
        var $1754 = ({
            _: 'Fm.Error.indirect',
            'name': _name$1
        });
        return $1754;
    };
    const Fm$Error$indirect = x0 => Fm$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1756 = Maybe$none;
                var $1755 = $1756;
                break;
            case 'Maybe.some':
                var $1757 = self.value;
                var $1758 = Maybe$some$(_f$4($1757));
                var $1755 = $1758;
                break;
        };
        return $1755;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Fm$MPath$o$(_path$1) {
        var $1759 = Maybe$mapped$(_path$1, Fm$Path$o);
        return $1759;
    };
    const Fm$MPath$o = x0 => Fm$MPath$o$(x0);

    function Fm$MPath$i$(_path$1) {
        var $1760 = Maybe$mapped$(_path$1, Fm$Path$i);
        return $1760;
    };
    const Fm$MPath$i = x0 => Fm$MPath$i$(x0);

    function Fm$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $1761 = ({
            _: 'Fm.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $1761;
    };
    const Fm$Error$cant_infer = x0 => x1 => x2 => Fm$Error$cant_infer$(x0, x1, x2);

    function Fm$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $1762 = ({
            _: 'Fm.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $1762;
    };
    const Fm$Error$type_mismatch = x0 => x1 => x2 => x3 => Fm$Error$type_mismatch$(x0, x1, x2, x3);

    function Fm$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $1763 = ({
            _: 'Fm.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $1763;
    };
    const Fm$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Fm$Error$show_goal$(x0, x1, x2, x3, x4);

    function Fm$Term$normalize$(_term$1, _defs$2) {
        var self = Fm$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $1765 = self.name;
                var $1766 = self.indx;
                var $1767 = Fm$Term$var$($1765, $1766);
                var $1764 = $1767;
                break;
            case 'Fm.Term.ref':
                var $1768 = self.name;
                var $1769 = Fm$Term$ref$($1768);
                var $1764 = $1769;
                break;
            case 'Fm.Term.typ':
                var $1770 = Fm$Term$typ;
                var $1764 = $1770;
                break;
            case 'Fm.Term.all':
                var $1771 = self.eras;
                var $1772 = self.self;
                var $1773 = self.name;
                var $1774 = self.xtyp;
                var $1775 = self.body;
                var $1776 = Fm$Term$all$($1771, $1772, $1773, Fm$Term$normalize$($1774, _defs$2), (_s$8 => _x$9 => {
                    var $1777 = Fm$Term$normalize$($1775(_s$8)(_x$9), _defs$2);
                    return $1777;
                }));
                var $1764 = $1776;
                break;
            case 'Fm.Term.lam':
                var $1778 = self.name;
                var $1779 = self.body;
                var $1780 = Fm$Term$lam$($1778, (_x$5 => {
                    var $1781 = Fm$Term$normalize$($1779(_x$5), _defs$2);
                    return $1781;
                }));
                var $1764 = $1780;
                break;
            case 'Fm.Term.app':
                var $1782 = self.func;
                var $1783 = self.argm;
                var $1784 = Fm$Term$app$(Fm$Term$normalize$($1782, _defs$2), Fm$Term$normalize$($1783, _defs$2));
                var $1764 = $1784;
                break;
            case 'Fm.Term.let':
                var $1785 = self.name;
                var $1786 = self.expr;
                var $1787 = self.body;
                var $1788 = Fm$Term$let$($1785, Fm$Term$normalize$($1786, _defs$2), (_x$6 => {
                    var $1789 = Fm$Term$normalize$($1787(_x$6), _defs$2);
                    return $1789;
                }));
                var $1764 = $1788;
                break;
            case 'Fm.Term.def':
                var $1790 = self.name;
                var $1791 = self.expr;
                var $1792 = self.body;
                var $1793 = Fm$Term$def$($1790, Fm$Term$normalize$($1791, _defs$2), (_x$6 => {
                    var $1794 = Fm$Term$normalize$($1792(_x$6), _defs$2);
                    return $1794;
                }));
                var $1764 = $1793;
                break;
            case 'Fm.Term.ann':
                var $1795 = self.done;
                var $1796 = self.term;
                var $1797 = self.type;
                var $1798 = Fm$Term$ann$($1795, Fm$Term$normalize$($1796, _defs$2), Fm$Term$normalize$($1797, _defs$2));
                var $1764 = $1798;
                break;
            case 'Fm.Term.gol':
                var $1799 = self.name;
                var $1800 = self.dref;
                var $1801 = self.verb;
                var $1802 = Fm$Term$gol$($1799, $1800, $1801);
                var $1764 = $1802;
                break;
            case 'Fm.Term.hol':
                var $1803 = self.path;
                var $1804 = Fm$Term$hol$($1803);
                var $1764 = $1804;
                break;
            case 'Fm.Term.nat':
                var $1805 = self.natx;
                var $1806 = Fm$Term$nat$($1805);
                var $1764 = $1806;
                break;
            case 'Fm.Term.chr':
                var $1807 = self.chrx;
                var $1808 = Fm$Term$chr$($1807);
                var $1764 = $1808;
                break;
            case 'Fm.Term.str':
                var $1809 = self.strx;
                var $1810 = Fm$Term$str$($1809);
                var $1764 = $1810;
                break;
            case 'Fm.Term.cse':
                var $1811 = self.path;
                var $1812 = self.expr;
                var $1813 = self.name;
                var $1814 = self.with;
                var $1815 = self.cses;
                var $1816 = self.moti;
                var $1817 = _term$1;
                var $1764 = $1817;
                break;
            case 'Fm.Term.ori':
                var $1818 = self.orig;
                var $1819 = self.expr;
                var $1820 = Fm$Term$normalize$($1819, _defs$2);
                var $1764 = $1820;
                break;
        };
        return $1764;
    };
    const Fm$Term$normalize = x0 => x1 => Fm$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1822 = List$nil;
                var $1821 = $1822;
                break;
            case 'List.cons':
                var $1823 = self.head;
                var $1824 = self.tail;
                var $1825 = $1824;
                var $1821 = $1825;
                break;
        };
        return $1821;
    };
    const List$tail = x0 => List$tail$(x0);

    function Fm$SmartMotive$vals$cont$(_expr$1, _term$2, _args$3, _defs$4) {
        var Fm$SmartMotive$vals$cont$ = (_expr$1, _term$2, _args$3, _defs$4) => ({
            ctr: 'TCO',
            arg: [_expr$1, _term$2, _args$3, _defs$4]
        });
        var Fm$SmartMotive$vals$cont = _expr$1 => _term$2 => _args$3 => _defs$4 => Fm$SmartMotive$vals$cont$(_expr$1, _term$2, _args$3, _defs$4);
        var arg = [_expr$1, _term$2, _args$3, _defs$4];
        while (true) {
            let [_expr$1, _term$2, _args$3, _defs$4] = arg;
            var R = (() => {
                var self = Fm$Term$reduce$(_term$2, _defs$4);
                switch (self._) {
                    case 'Fm.Term.var':
                        var $1826 = self.name;
                        var $1827 = self.indx;
                        var $1828 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1828;
                    case 'Fm.Term.ref':
                        var $1829 = self.name;
                        var $1830 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1830;
                    case 'Fm.Term.typ':
                        var $1831 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1831;
                    case 'Fm.Term.all':
                        var $1832 = self.eras;
                        var $1833 = self.self;
                        var $1834 = self.name;
                        var $1835 = self.xtyp;
                        var $1836 = self.body;
                        var $1837 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1837;
                    case 'Fm.Term.lam':
                        var $1838 = self.name;
                        var $1839 = self.body;
                        var $1840 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1840;
                    case 'Fm.Term.app':
                        var $1841 = self.func;
                        var $1842 = self.argm;
                        var $1843 = Fm$SmartMotive$vals$cont$(_expr$1, $1841, List$cons$($1842, _args$3), _defs$4);
                        return $1843;
                    case 'Fm.Term.let':
                        var $1844 = self.name;
                        var $1845 = self.expr;
                        var $1846 = self.body;
                        var $1847 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1847;
                    case 'Fm.Term.def':
                        var $1848 = self.name;
                        var $1849 = self.expr;
                        var $1850 = self.body;
                        var $1851 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1851;
                    case 'Fm.Term.ann':
                        var $1852 = self.done;
                        var $1853 = self.term;
                        var $1854 = self.type;
                        var $1855 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1855;
                    case 'Fm.Term.gol':
                        var $1856 = self.name;
                        var $1857 = self.dref;
                        var $1858 = self.verb;
                        var $1859 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1859;
                    case 'Fm.Term.hol':
                        var $1860 = self.path;
                        var $1861 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1861;
                    case 'Fm.Term.nat':
                        var $1862 = self.natx;
                        var $1863 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1863;
                    case 'Fm.Term.chr':
                        var $1864 = self.chrx;
                        var $1865 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1865;
                    case 'Fm.Term.str':
                        var $1866 = self.strx;
                        var $1867 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1867;
                    case 'Fm.Term.cse':
                        var $1868 = self.path;
                        var $1869 = self.expr;
                        var $1870 = self.name;
                        var $1871 = self.with;
                        var $1872 = self.cses;
                        var $1873 = self.moti;
                        var $1874 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1874;
                    case 'Fm.Term.ori':
                        var $1875 = self.orig;
                        var $1876 = self.expr;
                        var $1877 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1877;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$SmartMotive$vals$cont = x0 => x1 => x2 => x3 => Fm$SmartMotive$vals$cont$(x0, x1, x2, x3);

    function Fm$SmartMotive$vals$(_expr$1, _type$2, _defs$3) {
        var Fm$SmartMotive$vals$ = (_expr$1, _type$2, _defs$3) => ({
            ctr: 'TCO',
            arg: [_expr$1, _type$2, _defs$3]
        });
        var Fm$SmartMotive$vals = _expr$1 => _type$2 => _defs$3 => Fm$SmartMotive$vals$(_expr$1, _type$2, _defs$3);
        var arg = [_expr$1, _type$2, _defs$3];
        while (true) {
            let [_expr$1, _type$2, _defs$3] = arg;
            var R = (() => {
                var self = Fm$Term$reduce$(_type$2, _defs$3);
                switch (self._) {
                    case 'Fm.Term.var':
                        var $1878 = self.name;
                        var $1879 = self.indx;
                        var $1880 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1880;
                    case 'Fm.Term.ref':
                        var $1881 = self.name;
                        var $1882 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1882;
                    case 'Fm.Term.typ':
                        var $1883 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1883;
                    case 'Fm.Term.all':
                        var $1884 = self.eras;
                        var $1885 = self.self;
                        var $1886 = self.name;
                        var $1887 = self.xtyp;
                        var $1888 = self.body;
                        var $1889 = Fm$SmartMotive$vals$(_expr$1, $1888(Fm$Term$typ)(Fm$Term$typ), _defs$3);
                        return $1889;
                    case 'Fm.Term.lam':
                        var $1890 = self.name;
                        var $1891 = self.body;
                        var $1892 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1892;
                    case 'Fm.Term.app':
                        var $1893 = self.func;
                        var $1894 = self.argm;
                        var $1895 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1895;
                    case 'Fm.Term.let':
                        var $1896 = self.name;
                        var $1897 = self.expr;
                        var $1898 = self.body;
                        var $1899 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1899;
                    case 'Fm.Term.def':
                        var $1900 = self.name;
                        var $1901 = self.expr;
                        var $1902 = self.body;
                        var $1903 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1903;
                    case 'Fm.Term.ann':
                        var $1904 = self.done;
                        var $1905 = self.term;
                        var $1906 = self.type;
                        var $1907 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1907;
                    case 'Fm.Term.gol':
                        var $1908 = self.name;
                        var $1909 = self.dref;
                        var $1910 = self.verb;
                        var $1911 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1911;
                    case 'Fm.Term.hol':
                        var $1912 = self.path;
                        var $1913 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1913;
                    case 'Fm.Term.nat':
                        var $1914 = self.natx;
                        var $1915 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1915;
                    case 'Fm.Term.chr':
                        var $1916 = self.chrx;
                        var $1917 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1917;
                    case 'Fm.Term.str':
                        var $1918 = self.strx;
                        var $1919 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1919;
                    case 'Fm.Term.cse':
                        var $1920 = self.path;
                        var $1921 = self.expr;
                        var $1922 = self.name;
                        var $1923 = self.with;
                        var $1924 = self.cses;
                        var $1925 = self.moti;
                        var $1926 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1926;
                    case 'Fm.Term.ori':
                        var $1927 = self.orig;
                        var $1928 = self.expr;
                        var $1929 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1929;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$SmartMotive$vals = x0 => x1 => x2 => Fm$SmartMotive$vals$(x0, x1, x2);

    function Fm$SmartMotive$nams$cont$(_name$1, _term$2, _binds$3, _defs$4) {
        var Fm$SmartMotive$nams$cont$ = (_name$1, _term$2, _binds$3, _defs$4) => ({
            ctr: 'TCO',
            arg: [_name$1, _term$2, _binds$3, _defs$4]
        });
        var Fm$SmartMotive$nams$cont = _name$1 => _term$2 => _binds$3 => _defs$4 => Fm$SmartMotive$nams$cont$(_name$1, _term$2, _binds$3, _defs$4);
        var arg = [_name$1, _term$2, _binds$3, _defs$4];
        while (true) {
            let [_name$1, _term$2, _binds$3, _defs$4] = arg;
            var R = (() => {
                var self = Fm$Term$reduce$(_term$2, _defs$4);
                switch (self._) {
                    case 'Fm.Term.var':
                        var $1930 = self.name;
                        var $1931 = self.indx;
                        var $1932 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1932;
                    case 'Fm.Term.ref':
                        var $1933 = self.name;
                        var $1934 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1934;
                    case 'Fm.Term.typ':
                        var $1935 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1935;
                    case 'Fm.Term.all':
                        var $1936 = self.eras;
                        var $1937 = self.self;
                        var $1938 = self.name;
                        var $1939 = self.xtyp;
                        var $1940 = self.body;
                        var $1941 = Fm$SmartMotive$nams$cont$(_name$1, $1940(Fm$Term$ref$($1937))(Fm$Term$ref$($1938)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($1938, List$nil)))), _binds$3), _defs$4);
                        return $1941;
                    case 'Fm.Term.lam':
                        var $1942 = self.name;
                        var $1943 = self.body;
                        var $1944 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1944;
                    case 'Fm.Term.app':
                        var $1945 = self.func;
                        var $1946 = self.argm;
                        var $1947 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1947;
                    case 'Fm.Term.let':
                        var $1948 = self.name;
                        var $1949 = self.expr;
                        var $1950 = self.body;
                        var $1951 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1951;
                    case 'Fm.Term.def':
                        var $1952 = self.name;
                        var $1953 = self.expr;
                        var $1954 = self.body;
                        var $1955 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1955;
                    case 'Fm.Term.ann':
                        var $1956 = self.done;
                        var $1957 = self.term;
                        var $1958 = self.type;
                        var $1959 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1959;
                    case 'Fm.Term.gol':
                        var $1960 = self.name;
                        var $1961 = self.dref;
                        var $1962 = self.verb;
                        var $1963 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1963;
                    case 'Fm.Term.hol':
                        var $1964 = self.path;
                        var $1965 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1965;
                    case 'Fm.Term.nat':
                        var $1966 = self.natx;
                        var $1967 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1967;
                    case 'Fm.Term.chr':
                        var $1968 = self.chrx;
                        var $1969 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1969;
                    case 'Fm.Term.str':
                        var $1970 = self.strx;
                        var $1971 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1971;
                    case 'Fm.Term.cse':
                        var $1972 = self.path;
                        var $1973 = self.expr;
                        var $1974 = self.name;
                        var $1975 = self.with;
                        var $1976 = self.cses;
                        var $1977 = self.moti;
                        var $1978 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1978;
                    case 'Fm.Term.ori':
                        var $1979 = self.orig;
                        var $1980 = self.expr;
                        var $1981 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1981;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$SmartMotive$nams$cont = x0 => x1 => x2 => x3 => Fm$SmartMotive$nams$cont$(x0, x1, x2, x3);

    function Fm$SmartMotive$nams$(_name$1, _type$2, _defs$3) {
        var self = Fm$Term$reduce$(_type$2, _defs$3);
        switch (self._) {
            case 'Fm.Term.var':
                var $1983 = self.name;
                var $1984 = self.indx;
                var $1985 = List$nil;
                var $1982 = $1985;
                break;
            case 'Fm.Term.ref':
                var $1986 = self.name;
                var $1987 = List$nil;
                var $1982 = $1987;
                break;
            case 'Fm.Term.typ':
                var $1988 = List$nil;
                var $1982 = $1988;
                break;
            case 'Fm.Term.all':
                var $1989 = self.eras;
                var $1990 = self.self;
                var $1991 = self.name;
                var $1992 = self.xtyp;
                var $1993 = self.body;
                var $1994 = Fm$SmartMotive$nams$cont$(_name$1, $1992, List$nil, _defs$3);
                var $1982 = $1994;
                break;
            case 'Fm.Term.lam':
                var $1995 = self.name;
                var $1996 = self.body;
                var $1997 = List$nil;
                var $1982 = $1997;
                break;
            case 'Fm.Term.app':
                var $1998 = self.func;
                var $1999 = self.argm;
                var $2000 = List$nil;
                var $1982 = $2000;
                break;
            case 'Fm.Term.let':
                var $2001 = self.name;
                var $2002 = self.expr;
                var $2003 = self.body;
                var $2004 = List$nil;
                var $1982 = $2004;
                break;
            case 'Fm.Term.def':
                var $2005 = self.name;
                var $2006 = self.expr;
                var $2007 = self.body;
                var $2008 = List$nil;
                var $1982 = $2008;
                break;
            case 'Fm.Term.ann':
                var $2009 = self.done;
                var $2010 = self.term;
                var $2011 = self.type;
                var $2012 = List$nil;
                var $1982 = $2012;
                break;
            case 'Fm.Term.gol':
                var $2013 = self.name;
                var $2014 = self.dref;
                var $2015 = self.verb;
                var $2016 = List$nil;
                var $1982 = $2016;
                break;
            case 'Fm.Term.hol':
                var $2017 = self.path;
                var $2018 = List$nil;
                var $1982 = $2018;
                break;
            case 'Fm.Term.nat':
                var $2019 = self.natx;
                var $2020 = List$nil;
                var $1982 = $2020;
                break;
            case 'Fm.Term.chr':
                var $2021 = self.chrx;
                var $2022 = List$nil;
                var $1982 = $2022;
                break;
            case 'Fm.Term.str':
                var $2023 = self.strx;
                var $2024 = List$nil;
                var $1982 = $2024;
                break;
            case 'Fm.Term.cse':
                var $2025 = self.path;
                var $2026 = self.expr;
                var $2027 = self.name;
                var $2028 = self.with;
                var $2029 = self.cses;
                var $2030 = self.moti;
                var $2031 = List$nil;
                var $1982 = $2031;
                break;
            case 'Fm.Term.ori':
                var $2032 = self.orig;
                var $2033 = self.expr;
                var $2034 = List$nil;
                var $1982 = $2034;
                break;
        };
        return $1982;
    };
    const Fm$SmartMotive$nams = x0 => x1 => x2 => Fm$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.nil':
                var $2036 = List$nil;
                var $2035 = $2036;
                break;
            case 'List.cons':
                var $2037 = self.head;
                var $2038 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.nil':
                        var $2040 = List$nil;
                        var $2039 = $2040;
                        break;
                    case 'List.cons':
                        var $2041 = self.head;
                        var $2042 = self.tail;
                        var $2043 = List$cons$(Pair$new$($2037, $2041), List$zip$($2038, $2042));
                        var $2039 = $2043;
                        break;
                };
                var $2035 = $2039;
                break;
        };
        return $2035;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Fm$Term$serialize$name$(_name$1) {
        var $2044 = (fm_name_to_bits(_name$1));
        return $2044;
    };
    const Fm$Term$serialize$name = x0 => Fm$Term$serialize$name$(x0);

    function Fm$Term$serialize$(_term$1, _depth$2, _init$3, _x$4) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2046 = self.name;
                var $2047 = self.indx;
                var self = ($2047 >= _init$3);
                if (self) {
                    var _name$7 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $2047 <= 0n ? 0n : _depth$2 - $2047)))));
                    var $2049 = (((_name$7(_x$4) + '1') + '0') + '0');
                    var $2048 = $2049;
                } else {
                    var _name$7 = a1 => (a1 + (nat_to_bits($2047)));
                    var $2050 = (((_name$7(_x$4) + '0') + '1') + '0');
                    var $2048 = $2050;
                };
                var $2045 = $2048;
                break;
            case 'Fm.Term.ref':
                var $2051 = self.name;
                var _name$6 = a1 => (a1 + Fm$Term$serialize$name$($2051));
                var $2052 = (((_name$6(_x$4) + '0') + '0') + '0');
                var $2045 = $2052;
                break;
            case 'Fm.Term.typ':
                var $2053 = (((_x$4 + '1') + '1') + '0');
                var $2045 = $2053;
                break;
            case 'Fm.Term.all':
                var $2054 = self.eras;
                var $2055 = self.self;
                var $2056 = self.name;
                var $2057 = self.xtyp;
                var $2058 = self.body;
                var self = $2054;
                if (self) {
                    var $2060 = Bits$i;
                    var _eras$10 = $2060;
                } else {
                    var $2061 = Bits$o;
                    var _eras$10 = $2061;
                };
                var _self$11 = a1 => (a1 + (fm_name_to_bits($2055)));
                var _xtyp$12 = Fm$Term$serialize($2057)(_depth$2)(_init$3);
                var _body$13 = Fm$Term$serialize($2058(Fm$Term$var$($2055, _depth$2))(Fm$Term$var$($2056, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3);
                var $2059 = (((_eras$10(_self$11(_xtyp$12(_body$13(_x$4)))) + '0') + '0') + '1');
                var $2045 = $2059;
                break;
            case 'Fm.Term.lam':
                var $2062 = self.name;
                var $2063 = self.body;
                var _body$7 = Fm$Term$serialize($2063(Fm$Term$var$($2062, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2064 = (((_body$7(_x$4) + '1') + '0') + '1');
                var $2045 = $2064;
                break;
            case 'Fm.Term.app':
                var $2065 = self.func;
                var $2066 = self.argm;
                var _func$7 = Fm$Term$serialize($2065)(_depth$2)(_init$3);
                var _argm$8 = Fm$Term$serialize($2066)(_depth$2)(_init$3);
                var $2067 = (((_func$7(_argm$8(_x$4)) + '0') + '1') + '1');
                var $2045 = $2067;
                break;
            case 'Fm.Term.let':
                var $2068 = self.name;
                var $2069 = self.expr;
                var $2070 = self.body;
                var _expr$8 = Fm$Term$serialize($2069)(_depth$2)(_init$3);
                var _body$9 = Fm$Term$serialize($2070(Fm$Term$var$($2068, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2071 = (((_expr$8(_body$9(_x$4)) + '1') + '1') + '1');
                var $2045 = $2071;
                break;
            case 'Fm.Term.def':
                var $2072 = self.name;
                var $2073 = self.expr;
                var $2074 = self.body;
                var $2075 = Fm$Term$serialize$($2074($2073), _depth$2, _init$3, _x$4);
                var $2045 = $2075;
                break;
            case 'Fm.Term.ann':
                var $2076 = self.done;
                var $2077 = self.term;
                var $2078 = self.type;
                var $2079 = Fm$Term$serialize$($2077, _depth$2, _init$3, _x$4);
                var $2045 = $2079;
                break;
            case 'Fm.Term.gol':
                var $2080 = self.name;
                var $2081 = self.dref;
                var $2082 = self.verb;
                var _name$8 = a1 => (a1 + (fm_name_to_bits($2080)));
                var $2083 = (((_name$8(_x$4) + '0') + '0') + '0');
                var $2045 = $2083;
                break;
            case 'Fm.Term.hol':
                var $2084 = self.path;
                var $2085 = _x$4;
                var $2045 = $2085;
                break;
            case 'Fm.Term.nat':
                var $2086 = self.natx;
                var $2087 = Fm$Term$serialize$(Fm$Term$unroll_nat$($2086), _depth$2, _init$3, _x$4);
                var $2045 = $2087;
                break;
            case 'Fm.Term.chr':
                var $2088 = self.chrx;
                var $2089 = Fm$Term$serialize$(Fm$Term$unroll_chr$($2088), _depth$2, _init$3, _x$4);
                var $2045 = $2089;
                break;
            case 'Fm.Term.str':
                var $2090 = self.strx;
                var $2091 = Fm$Term$serialize$(Fm$Term$unroll_str$($2090), _depth$2, _init$3, _x$4);
                var $2045 = $2091;
                break;
            case 'Fm.Term.cse':
                var $2092 = self.path;
                var $2093 = self.expr;
                var $2094 = self.name;
                var $2095 = self.with;
                var $2096 = self.cses;
                var $2097 = self.moti;
                var $2098 = _x$4;
                var $2045 = $2098;
                break;
            case 'Fm.Term.ori':
                var $2099 = self.orig;
                var $2100 = self.expr;
                var $2101 = Fm$Term$serialize$($2100, _depth$2, _init$3, _x$4);
                var $2045 = $2101;
                break;
        };
        return $2045;
    };
    const Fm$Term$serialize = x0 => x1 => x2 => x3 => Fm$Term$serialize$(x0, x1, x2, x3);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Fm$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Fm$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$e);
        var _bh$5 = Fm$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$e);
        var $2102 = (_bh$5 === _ah$4);
        return $2102;
    };
    const Fm$Term$identical = x0 => x1 => x2 => Fm$Term$identical$(x0, x1, x2);

    function Fm$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Fm$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $2104 = _to$3;
            var $2103 = $2104;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $2106 = self.name;
                    var $2107 = self.indx;
                    var $2108 = Fm$Term$var$($2106, $2107);
                    var $2105 = $2108;
                    break;
                case 'Fm.Term.ref':
                    var $2109 = self.name;
                    var $2110 = Fm$Term$ref$($2109);
                    var $2105 = $2110;
                    break;
                case 'Fm.Term.typ':
                    var $2111 = Fm$Term$typ;
                    var $2105 = $2111;
                    break;
                case 'Fm.Term.all':
                    var $2112 = self.eras;
                    var $2113 = self.self;
                    var $2114 = self.name;
                    var $2115 = self.xtyp;
                    var $2116 = self.body;
                    var _xtyp$10 = Fm$SmartMotive$replace$($2115, _from$2, _to$3, _lv$4);
                    var _body$11 = $2116(Fm$Term$ref$($2113))(Fm$Term$ref$($2114));
                    var _body$12 = Fm$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $2117 = Fm$Term$all$($2112, $2113, $2114, _xtyp$10, (_s$13 => _x$14 => {
                        var $2118 = _body$12;
                        return $2118;
                    }));
                    var $2105 = $2117;
                    break;
                case 'Fm.Term.lam':
                    var $2119 = self.name;
                    var $2120 = self.body;
                    var _body$7 = $2120(Fm$Term$ref$($2119));
                    var _body$8 = Fm$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2121 = Fm$Term$lam$($2119, (_x$9 => {
                        var $2122 = _body$8;
                        return $2122;
                    }));
                    var $2105 = $2121;
                    break;
                case 'Fm.Term.app':
                    var $2123 = self.func;
                    var $2124 = self.argm;
                    var _func$7 = Fm$SmartMotive$replace$($2123, _from$2, _to$3, _lv$4);
                    var _argm$8 = Fm$SmartMotive$replace$($2124, _from$2, _to$3, _lv$4);
                    var $2125 = Fm$Term$app$(_func$7, _argm$8);
                    var $2105 = $2125;
                    break;
                case 'Fm.Term.let':
                    var $2126 = self.name;
                    var $2127 = self.expr;
                    var $2128 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2127, _from$2, _to$3, _lv$4);
                    var _body$9 = $2128(Fm$Term$ref$($2126));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2129 = Fm$Term$let$($2126, _expr$8, (_x$11 => {
                        var $2130 = _body$10;
                        return $2130;
                    }));
                    var $2105 = $2129;
                    break;
                case 'Fm.Term.def':
                    var $2131 = self.name;
                    var $2132 = self.expr;
                    var $2133 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2132, _from$2, _to$3, _lv$4);
                    var _body$9 = $2133(Fm$Term$ref$($2131));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2134 = Fm$Term$def$($2131, _expr$8, (_x$11 => {
                        var $2135 = _body$10;
                        return $2135;
                    }));
                    var $2105 = $2134;
                    break;
                case 'Fm.Term.ann':
                    var $2136 = self.done;
                    var $2137 = self.term;
                    var $2138 = self.type;
                    var _term$8 = Fm$SmartMotive$replace$($2137, _from$2, _to$3, _lv$4);
                    var _type$9 = Fm$SmartMotive$replace$($2138, _from$2, _to$3, _lv$4);
                    var $2139 = Fm$Term$ann$($2136, _term$8, _type$9);
                    var $2105 = $2139;
                    break;
                case 'Fm.Term.gol':
                    var $2140 = self.name;
                    var $2141 = self.dref;
                    var $2142 = self.verb;
                    var $2143 = _term$1;
                    var $2105 = $2143;
                    break;
                case 'Fm.Term.hol':
                    var $2144 = self.path;
                    var $2145 = _term$1;
                    var $2105 = $2145;
                    break;
                case 'Fm.Term.nat':
                    var $2146 = self.natx;
                    var $2147 = _term$1;
                    var $2105 = $2147;
                    break;
                case 'Fm.Term.chr':
                    var $2148 = self.chrx;
                    var $2149 = _term$1;
                    var $2105 = $2149;
                    break;
                case 'Fm.Term.str':
                    var $2150 = self.strx;
                    var $2151 = _term$1;
                    var $2105 = $2151;
                    break;
                case 'Fm.Term.cse':
                    var $2152 = self.path;
                    var $2153 = self.expr;
                    var $2154 = self.name;
                    var $2155 = self.with;
                    var $2156 = self.cses;
                    var $2157 = self.moti;
                    var $2158 = _term$1;
                    var $2105 = $2158;
                    break;
                case 'Fm.Term.ori':
                    var $2159 = self.orig;
                    var $2160 = self.expr;
                    var $2161 = Fm$SmartMotive$replace$($2160, _from$2, _to$3, _lv$4);
                    var $2105 = $2161;
                    break;
            };
            var $2103 = $2105;
        };
        return $2103;
    };
    const Fm$SmartMotive$replace = x0 => x1 => x2 => x3 => Fm$SmartMotive$replace$(x0, x1, x2, x3);

    function Fm$SmartMotive$make$(_name$1, _expr$2, _type$3, _moti$4, _lv$5, _defs$6) {
        var _vals$7 = Fm$SmartMotive$vals$(_expr$2, _type$3, _defs$6);
        var _nams$8 = Fm$SmartMotive$nams$(_name$1, _type$3, _defs$6);
        var _subs$9 = List$zip$(_nams$8, _vals$7);
        var _moti$10 = List$fold$(_subs$9, _moti$4, (_sub$10 => _moti$11 => {
            var self = _sub$10;
            switch (self._) {
                case 'Pair.new':
                    var $2164 = self.fst;
                    var $2165 = self.snd;
                    var $2166 = Fm$SmartMotive$replace$(_moti$11, $2165, Fm$Term$ref$($2164), _lv$5);
                    var $2163 = $2166;
                    break;
            };
            return $2163;
        }));
        var $2162 = _moti$10;
        return $2162;
    };
    const Fm$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Fm$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Fm$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.nil':
                var $2168 = _moti$2;
                var $2167 = $2168;
                break;
            case 'List.cons':
                var $2169 = self.head;
                var $2170 = self.tail;
                var self = $2169;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $2172 = self.file;
                        var $2173 = self.code;
                        var $2174 = self.name;
                        var $2175 = self.term;
                        var $2176 = self.type;
                        var $2177 = self.stat;
                        var $2178 = Fm$Term$all$(Bool$false, "", $2174, $2176, (_s$11 => _x$12 => {
                            var $2179 = Fm$Term$desugar_cse$motive$($2170, _moti$2);
                            return $2179;
                        }));
                        var $2171 = $2178;
                        break;
                };
                var $2167 = $2171;
                break;
        };
        return $2167;
    };
    const Fm$Term$desugar_cse$motive = x0 => x1 => Fm$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $2181 = Bool$true;
            var $2180 = $2181;
        } else {
            var $2182 = self.charCodeAt(0);
            var $2183 = self.slice(1);
            var $2184 = Bool$false;
            var $2180 = $2184;
        };
        return $2180;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Fm$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $2186 = self.name;
                var $2187 = self.indx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2189 = _body$4;
                        var $2188 = $2189;
                        break;
                    case 'List.cons':
                        var $2190 = self.head;
                        var $2191 = self.tail;
                        var self = $2190;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2193 = self.file;
                                var $2194 = self.code;
                                var $2195 = self.name;
                                var $2196 = self.term;
                                var $2197 = self.type;
                                var $2198 = self.stat;
                                var $2199 = Fm$Term$lam$($2195, (_x$16 => {
                                    var $2200 = Fm$Term$desugar_cse$argument$(_name$1, $2191, _type$3, _body$4, _defs$5);
                                    return $2200;
                                }));
                                var $2192 = $2199;
                                break;
                        };
                        var $2188 = $2192;
                        break;
                };
                var $2185 = $2188;
                break;
            case 'Fm.Term.ref':
                var $2201 = self.name;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2203 = _body$4;
                        var $2202 = $2203;
                        break;
                    case 'List.cons':
                        var $2204 = self.head;
                        var $2205 = self.tail;
                        var self = $2204;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2207 = self.file;
                                var $2208 = self.code;
                                var $2209 = self.name;
                                var $2210 = self.term;
                                var $2211 = self.type;
                                var $2212 = self.stat;
                                var $2213 = Fm$Term$lam$($2209, (_x$15 => {
                                    var $2214 = Fm$Term$desugar_cse$argument$(_name$1, $2205, _type$3, _body$4, _defs$5);
                                    return $2214;
                                }));
                                var $2206 = $2213;
                                break;
                        };
                        var $2202 = $2206;
                        break;
                };
                var $2185 = $2202;
                break;
            case 'Fm.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2216 = _body$4;
                        var $2215 = $2216;
                        break;
                    case 'List.cons':
                        var $2217 = self.head;
                        var $2218 = self.tail;
                        var self = $2217;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2220 = self.file;
                                var $2221 = self.code;
                                var $2222 = self.name;
                                var $2223 = self.term;
                                var $2224 = self.type;
                                var $2225 = self.stat;
                                var $2226 = Fm$Term$lam$($2222, (_x$14 => {
                                    var $2227 = Fm$Term$desugar_cse$argument$(_name$1, $2218, _type$3, _body$4, _defs$5);
                                    return $2227;
                                }));
                                var $2219 = $2226;
                                break;
                        };
                        var $2215 = $2219;
                        break;
                };
                var $2185 = $2215;
                break;
            case 'Fm.Term.all':
                var $2228 = self.eras;
                var $2229 = self.self;
                var $2230 = self.name;
                var $2231 = self.xtyp;
                var $2232 = self.body;
                var $2233 = Fm$Term$lam$((() => {
                    var self = String$is_empty$($2230);
                    if (self) {
                        var $2234 = _name$1;
                        return $2234;
                    } else {
                        var $2235 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($2230, List$nil))));
                        return $2235;
                    };
                })(), (_x$11 => {
                    var $2236 = Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, $2232(Fm$Term$var$($2229, 0n))(Fm$Term$var$($2230, 0n)), _body$4, _defs$5);
                    return $2236;
                }));
                var $2185 = $2233;
                break;
            case 'Fm.Term.lam':
                var $2237 = self.name;
                var $2238 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2240 = _body$4;
                        var $2239 = $2240;
                        break;
                    case 'List.cons':
                        var $2241 = self.head;
                        var $2242 = self.tail;
                        var self = $2241;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2244 = self.file;
                                var $2245 = self.code;
                                var $2246 = self.name;
                                var $2247 = self.term;
                                var $2248 = self.type;
                                var $2249 = self.stat;
                                var $2250 = Fm$Term$lam$($2246, (_x$16 => {
                                    var $2251 = Fm$Term$desugar_cse$argument$(_name$1, $2242, _type$3, _body$4, _defs$5);
                                    return $2251;
                                }));
                                var $2243 = $2250;
                                break;
                        };
                        var $2239 = $2243;
                        break;
                };
                var $2185 = $2239;
                break;
            case 'Fm.Term.app':
                var $2252 = self.func;
                var $2253 = self.argm;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2255 = _body$4;
                        var $2254 = $2255;
                        break;
                    case 'List.cons':
                        var $2256 = self.head;
                        var $2257 = self.tail;
                        var self = $2256;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2259 = self.file;
                                var $2260 = self.code;
                                var $2261 = self.name;
                                var $2262 = self.term;
                                var $2263 = self.type;
                                var $2264 = self.stat;
                                var $2265 = Fm$Term$lam$($2261, (_x$16 => {
                                    var $2266 = Fm$Term$desugar_cse$argument$(_name$1, $2257, _type$3, _body$4, _defs$5);
                                    return $2266;
                                }));
                                var $2258 = $2265;
                                break;
                        };
                        var $2254 = $2258;
                        break;
                };
                var $2185 = $2254;
                break;
            case 'Fm.Term.let':
                var $2267 = self.name;
                var $2268 = self.expr;
                var $2269 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2271 = _body$4;
                        var $2270 = $2271;
                        break;
                    case 'List.cons':
                        var $2272 = self.head;
                        var $2273 = self.tail;
                        var self = $2272;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2275 = self.file;
                                var $2276 = self.code;
                                var $2277 = self.name;
                                var $2278 = self.term;
                                var $2279 = self.type;
                                var $2280 = self.stat;
                                var $2281 = Fm$Term$lam$($2277, (_x$17 => {
                                    var $2282 = Fm$Term$desugar_cse$argument$(_name$1, $2273, _type$3, _body$4, _defs$5);
                                    return $2282;
                                }));
                                var $2274 = $2281;
                                break;
                        };
                        var $2270 = $2274;
                        break;
                };
                var $2185 = $2270;
                break;
            case 'Fm.Term.def':
                var $2283 = self.name;
                var $2284 = self.expr;
                var $2285 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2287 = _body$4;
                        var $2286 = $2287;
                        break;
                    case 'List.cons':
                        var $2288 = self.head;
                        var $2289 = self.tail;
                        var self = $2288;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2291 = self.file;
                                var $2292 = self.code;
                                var $2293 = self.name;
                                var $2294 = self.term;
                                var $2295 = self.type;
                                var $2296 = self.stat;
                                var $2297 = Fm$Term$lam$($2293, (_x$17 => {
                                    var $2298 = Fm$Term$desugar_cse$argument$(_name$1, $2289, _type$3, _body$4, _defs$5);
                                    return $2298;
                                }));
                                var $2290 = $2297;
                                break;
                        };
                        var $2286 = $2290;
                        break;
                };
                var $2185 = $2286;
                break;
            case 'Fm.Term.ann':
                var $2299 = self.done;
                var $2300 = self.term;
                var $2301 = self.type;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2303 = _body$4;
                        var $2302 = $2303;
                        break;
                    case 'List.cons':
                        var $2304 = self.head;
                        var $2305 = self.tail;
                        var self = $2304;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2307 = self.file;
                                var $2308 = self.code;
                                var $2309 = self.name;
                                var $2310 = self.term;
                                var $2311 = self.type;
                                var $2312 = self.stat;
                                var $2313 = Fm$Term$lam$($2309, (_x$17 => {
                                    var $2314 = Fm$Term$desugar_cse$argument$(_name$1, $2305, _type$3, _body$4, _defs$5);
                                    return $2314;
                                }));
                                var $2306 = $2313;
                                break;
                        };
                        var $2302 = $2306;
                        break;
                };
                var $2185 = $2302;
                break;
            case 'Fm.Term.gol':
                var $2315 = self.name;
                var $2316 = self.dref;
                var $2317 = self.verb;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2319 = _body$4;
                        var $2318 = $2319;
                        break;
                    case 'List.cons':
                        var $2320 = self.head;
                        var $2321 = self.tail;
                        var self = $2320;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2323 = self.file;
                                var $2324 = self.code;
                                var $2325 = self.name;
                                var $2326 = self.term;
                                var $2327 = self.type;
                                var $2328 = self.stat;
                                var $2329 = Fm$Term$lam$($2325, (_x$17 => {
                                    var $2330 = Fm$Term$desugar_cse$argument$(_name$1, $2321, _type$3, _body$4, _defs$5);
                                    return $2330;
                                }));
                                var $2322 = $2329;
                                break;
                        };
                        var $2318 = $2322;
                        break;
                };
                var $2185 = $2318;
                break;
            case 'Fm.Term.hol':
                var $2331 = self.path;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2333 = _body$4;
                        var $2332 = $2333;
                        break;
                    case 'List.cons':
                        var $2334 = self.head;
                        var $2335 = self.tail;
                        var self = $2334;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2337 = self.file;
                                var $2338 = self.code;
                                var $2339 = self.name;
                                var $2340 = self.term;
                                var $2341 = self.type;
                                var $2342 = self.stat;
                                var $2343 = Fm$Term$lam$($2339, (_x$15 => {
                                    var $2344 = Fm$Term$desugar_cse$argument$(_name$1, $2335, _type$3, _body$4, _defs$5);
                                    return $2344;
                                }));
                                var $2336 = $2343;
                                break;
                        };
                        var $2332 = $2336;
                        break;
                };
                var $2185 = $2332;
                break;
            case 'Fm.Term.nat':
                var $2345 = self.natx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2347 = _body$4;
                        var $2346 = $2347;
                        break;
                    case 'List.cons':
                        var $2348 = self.head;
                        var $2349 = self.tail;
                        var self = $2348;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2351 = self.file;
                                var $2352 = self.code;
                                var $2353 = self.name;
                                var $2354 = self.term;
                                var $2355 = self.type;
                                var $2356 = self.stat;
                                var $2357 = Fm$Term$lam$($2353, (_x$15 => {
                                    var $2358 = Fm$Term$desugar_cse$argument$(_name$1, $2349, _type$3, _body$4, _defs$5);
                                    return $2358;
                                }));
                                var $2350 = $2357;
                                break;
                        };
                        var $2346 = $2350;
                        break;
                };
                var $2185 = $2346;
                break;
            case 'Fm.Term.chr':
                var $2359 = self.chrx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2361 = _body$4;
                        var $2360 = $2361;
                        break;
                    case 'List.cons':
                        var $2362 = self.head;
                        var $2363 = self.tail;
                        var self = $2362;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2365 = self.file;
                                var $2366 = self.code;
                                var $2367 = self.name;
                                var $2368 = self.term;
                                var $2369 = self.type;
                                var $2370 = self.stat;
                                var $2371 = Fm$Term$lam$($2367, (_x$15 => {
                                    var $2372 = Fm$Term$desugar_cse$argument$(_name$1, $2363, _type$3, _body$4, _defs$5);
                                    return $2372;
                                }));
                                var $2364 = $2371;
                                break;
                        };
                        var $2360 = $2364;
                        break;
                };
                var $2185 = $2360;
                break;
            case 'Fm.Term.str':
                var $2373 = self.strx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2375 = _body$4;
                        var $2374 = $2375;
                        break;
                    case 'List.cons':
                        var $2376 = self.head;
                        var $2377 = self.tail;
                        var self = $2376;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2379 = self.file;
                                var $2380 = self.code;
                                var $2381 = self.name;
                                var $2382 = self.term;
                                var $2383 = self.type;
                                var $2384 = self.stat;
                                var $2385 = Fm$Term$lam$($2381, (_x$15 => {
                                    var $2386 = Fm$Term$desugar_cse$argument$(_name$1, $2377, _type$3, _body$4, _defs$5);
                                    return $2386;
                                }));
                                var $2378 = $2385;
                                break;
                        };
                        var $2374 = $2378;
                        break;
                };
                var $2185 = $2374;
                break;
            case 'Fm.Term.cse':
                var $2387 = self.path;
                var $2388 = self.expr;
                var $2389 = self.name;
                var $2390 = self.with;
                var $2391 = self.cses;
                var $2392 = self.moti;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2394 = _body$4;
                        var $2393 = $2394;
                        break;
                    case 'List.cons':
                        var $2395 = self.head;
                        var $2396 = self.tail;
                        var self = $2395;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2398 = self.file;
                                var $2399 = self.code;
                                var $2400 = self.name;
                                var $2401 = self.term;
                                var $2402 = self.type;
                                var $2403 = self.stat;
                                var $2404 = Fm$Term$lam$($2400, (_x$20 => {
                                    var $2405 = Fm$Term$desugar_cse$argument$(_name$1, $2396, _type$3, _body$4, _defs$5);
                                    return $2405;
                                }));
                                var $2397 = $2404;
                                break;
                        };
                        var $2393 = $2397;
                        break;
                };
                var $2185 = $2393;
                break;
            case 'Fm.Term.ori':
                var $2406 = self.orig;
                var $2407 = self.expr;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2409 = _body$4;
                        var $2408 = $2409;
                        break;
                    case 'List.cons':
                        var $2410 = self.head;
                        var $2411 = self.tail;
                        var self = $2410;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2413 = self.file;
                                var $2414 = self.code;
                                var $2415 = self.name;
                                var $2416 = self.term;
                                var $2417 = self.type;
                                var $2418 = self.stat;
                                var $2419 = Fm$Term$lam$($2415, (_x$16 => {
                                    var $2420 = Fm$Term$desugar_cse$argument$(_name$1, $2411, _type$3, _body$4, _defs$5);
                                    return $2420;
                                }));
                                var $2412 = $2419;
                                break;
                        };
                        var $2408 = $2412;
                        break;
                };
                var $2185 = $2408;
                break;
        };
        return $2185;
    };
    const Fm$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Fm$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.none':
                var $2422 = _b$3;
                var $2421 = $2422;
                break;
            case 'Maybe.some':
                var $2423 = self.value;
                var $2424 = Maybe$some$($2423);
                var $2421 = $2424;
                break;
        };
        return $2421;
    };
    const Maybe$or = x0 => x1 => Maybe$or$(x0, x1);

    function Fm$Term$desugar_cse$cases$(_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7) {
        var Fm$Term$desugar_cse$cases$ = (_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7) => ({
            ctr: 'TCO',
            arg: [_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7]
        });
        var Fm$Term$desugar_cse$cases = _expr$1 => _name$2 => _wyth$3 => _cses$4 => _type$5 => _defs$6 => _ctxt$7 => Fm$Term$desugar_cse$cases$(_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7);
        var arg = [_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7];
        while (true) {
            let [_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7] = arg;
            var R = (() => {
                var self = Fm$Term$reduce$(_type$5, _defs$6);
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2425 = self.name;
                        var $2426 = self.indx;
                        var _expr$10 = (() => {
                            var $2429 = _expr$1;
                            var $2430 = _wyth$3;
                            let _expr$11 = $2429;
                            let _defn$10;
                            while ($2430._ === 'List.cons') {
                                _defn$10 = $2430.head;
                                var $2429 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2431 = self.file;
                                            var $2432 = self.code;
                                            var $2433 = self.name;
                                            var $2434 = self.term;
                                            var $2435 = self.type;
                                            var $2436 = self.stat;
                                            var $2437 = $2434;
                                            return $2437;
                                    };
                                })());
                                _expr$11 = $2429;
                                $2430 = $2430.tail;
                            }
                            return _expr$11;
                        })();
                        var $2427 = _expr$10;
                        return $2427;
                    case 'Fm.Term.ref':
                        var $2438 = self.name;
                        var _expr$9 = (() => {
                            var $2441 = _expr$1;
                            var $2442 = _wyth$3;
                            let _expr$10 = $2441;
                            let _defn$9;
                            while ($2442._ === 'List.cons') {
                                _defn$9 = $2442.head;
                                var $2441 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2443 = self.file;
                                            var $2444 = self.code;
                                            var $2445 = self.name;
                                            var $2446 = self.term;
                                            var $2447 = self.type;
                                            var $2448 = self.stat;
                                            var $2449 = $2446;
                                            return $2449;
                                    };
                                })());
                                _expr$10 = $2441;
                                $2442 = $2442.tail;
                            }
                            return _expr$10;
                        })();
                        var $2439 = _expr$9;
                        return $2439;
                    case 'Fm.Term.typ':
                        var _expr$8 = (() => {
                            var $2452 = _expr$1;
                            var $2453 = _wyth$3;
                            let _expr$9 = $2452;
                            let _defn$8;
                            while ($2453._ === 'List.cons') {
                                _defn$8 = $2453.head;
                                var $2452 = Fm$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2454 = self.file;
                                            var $2455 = self.code;
                                            var $2456 = self.name;
                                            var $2457 = self.term;
                                            var $2458 = self.type;
                                            var $2459 = self.stat;
                                            var $2460 = $2457;
                                            return $2460;
                                    };
                                })());
                                _expr$9 = $2452;
                                $2453 = $2453.tail;
                            }
                            return _expr$9;
                        })();
                        var $2450 = _expr$8;
                        return $2450;
                    case 'Fm.Term.all':
                        var $2461 = self.eras;
                        var $2462 = self.self;
                        var $2463 = self.name;
                        var $2464 = self.xtyp;
                        var $2465 = self.body;
                        var _got$13 = Maybe$or$(Fm$get$($2463, _cses$4), Fm$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $2469 = _expr$1;
                                    var $2470 = _wyth$3;
                                    let _expr$15 = $2469;
                                    let _defn$14;
                                    while ($2470._ === 'List.cons') {
                                        _defn$14 = $2470.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Fm.Def.new':
                                                var $2471 = self.file;
                                                var $2472 = self.code;
                                                var $2473 = self.name;
                                                var $2474 = self.term;
                                                var $2475 = self.type;
                                                var $2476 = self.stat;
                                                var $2477 = Fm$Term$app$(_expr$15, $2474);
                                                var $2469 = $2477;
                                                break;
                                        };
                                        _expr$15 = $2469;
                                        $2470 = $2470.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $2467 = _expr$14;
                                var $2466 = $2467;
                                break;
                            case 'Maybe.some':
                                var $2478 = self.value;
                                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, _wyth$3, $2464, $2478, _defs$6);
                                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $2465(Fm$Term$var$($2462, 0n))(Fm$Term$var$($2463, 0n));
                                var $2479 = Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $2466 = $2479;
                                break;
                        };
                        return $2466;
                    case 'Fm.Term.lam':
                        var $2480 = self.name;
                        var $2481 = self.body;
                        var _expr$10 = (() => {
                            var $2484 = _expr$1;
                            var $2485 = _wyth$3;
                            let _expr$11 = $2484;
                            let _defn$10;
                            while ($2485._ === 'List.cons') {
                                _defn$10 = $2485.head;
                                var $2484 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2486 = self.file;
                                            var $2487 = self.code;
                                            var $2488 = self.name;
                                            var $2489 = self.term;
                                            var $2490 = self.type;
                                            var $2491 = self.stat;
                                            var $2492 = $2489;
                                            return $2492;
                                    };
                                })());
                                _expr$11 = $2484;
                                $2485 = $2485.tail;
                            }
                            return _expr$11;
                        })();
                        var $2482 = _expr$10;
                        return $2482;
                    case 'Fm.Term.app':
                        var $2493 = self.func;
                        var $2494 = self.argm;
                        var _expr$10 = (() => {
                            var $2497 = _expr$1;
                            var $2498 = _wyth$3;
                            let _expr$11 = $2497;
                            let _defn$10;
                            while ($2498._ === 'List.cons') {
                                _defn$10 = $2498.head;
                                var $2497 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2499 = self.file;
                                            var $2500 = self.code;
                                            var $2501 = self.name;
                                            var $2502 = self.term;
                                            var $2503 = self.type;
                                            var $2504 = self.stat;
                                            var $2505 = $2502;
                                            return $2505;
                                    };
                                })());
                                _expr$11 = $2497;
                                $2498 = $2498.tail;
                            }
                            return _expr$11;
                        })();
                        var $2495 = _expr$10;
                        return $2495;
                    case 'Fm.Term.let':
                        var $2506 = self.name;
                        var $2507 = self.expr;
                        var $2508 = self.body;
                        var _expr$11 = (() => {
                            var $2511 = _expr$1;
                            var $2512 = _wyth$3;
                            let _expr$12 = $2511;
                            let _defn$11;
                            while ($2512._ === 'List.cons') {
                                _defn$11 = $2512.head;
                                var $2511 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2513 = self.file;
                                            var $2514 = self.code;
                                            var $2515 = self.name;
                                            var $2516 = self.term;
                                            var $2517 = self.type;
                                            var $2518 = self.stat;
                                            var $2519 = $2516;
                                            return $2519;
                                    };
                                })());
                                _expr$12 = $2511;
                                $2512 = $2512.tail;
                            }
                            return _expr$12;
                        })();
                        var $2509 = _expr$11;
                        return $2509;
                    case 'Fm.Term.def':
                        var $2520 = self.name;
                        var $2521 = self.expr;
                        var $2522 = self.body;
                        var _expr$11 = (() => {
                            var $2525 = _expr$1;
                            var $2526 = _wyth$3;
                            let _expr$12 = $2525;
                            let _defn$11;
                            while ($2526._ === 'List.cons') {
                                _defn$11 = $2526.head;
                                var $2525 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2527 = self.file;
                                            var $2528 = self.code;
                                            var $2529 = self.name;
                                            var $2530 = self.term;
                                            var $2531 = self.type;
                                            var $2532 = self.stat;
                                            var $2533 = $2530;
                                            return $2533;
                                    };
                                })());
                                _expr$12 = $2525;
                                $2526 = $2526.tail;
                            }
                            return _expr$12;
                        })();
                        var $2523 = _expr$11;
                        return $2523;
                    case 'Fm.Term.ann':
                        var $2534 = self.done;
                        var $2535 = self.term;
                        var $2536 = self.type;
                        var _expr$11 = (() => {
                            var $2539 = _expr$1;
                            var $2540 = _wyth$3;
                            let _expr$12 = $2539;
                            let _defn$11;
                            while ($2540._ === 'List.cons') {
                                _defn$11 = $2540.head;
                                var $2539 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2541 = self.file;
                                            var $2542 = self.code;
                                            var $2543 = self.name;
                                            var $2544 = self.term;
                                            var $2545 = self.type;
                                            var $2546 = self.stat;
                                            var $2547 = $2544;
                                            return $2547;
                                    };
                                })());
                                _expr$12 = $2539;
                                $2540 = $2540.tail;
                            }
                            return _expr$12;
                        })();
                        var $2537 = _expr$11;
                        return $2537;
                    case 'Fm.Term.gol':
                        var $2548 = self.name;
                        var $2549 = self.dref;
                        var $2550 = self.verb;
                        var _expr$11 = (() => {
                            var $2553 = _expr$1;
                            var $2554 = _wyth$3;
                            let _expr$12 = $2553;
                            let _defn$11;
                            while ($2554._ === 'List.cons') {
                                _defn$11 = $2554.head;
                                var $2553 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2555 = self.file;
                                            var $2556 = self.code;
                                            var $2557 = self.name;
                                            var $2558 = self.term;
                                            var $2559 = self.type;
                                            var $2560 = self.stat;
                                            var $2561 = $2558;
                                            return $2561;
                                    };
                                })());
                                _expr$12 = $2553;
                                $2554 = $2554.tail;
                            }
                            return _expr$12;
                        })();
                        var $2551 = _expr$11;
                        return $2551;
                    case 'Fm.Term.hol':
                        var $2562 = self.path;
                        var _expr$9 = (() => {
                            var $2565 = _expr$1;
                            var $2566 = _wyth$3;
                            let _expr$10 = $2565;
                            let _defn$9;
                            while ($2566._ === 'List.cons') {
                                _defn$9 = $2566.head;
                                var $2565 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2567 = self.file;
                                            var $2568 = self.code;
                                            var $2569 = self.name;
                                            var $2570 = self.term;
                                            var $2571 = self.type;
                                            var $2572 = self.stat;
                                            var $2573 = $2570;
                                            return $2573;
                                    };
                                })());
                                _expr$10 = $2565;
                                $2566 = $2566.tail;
                            }
                            return _expr$10;
                        })();
                        var $2563 = _expr$9;
                        return $2563;
                    case 'Fm.Term.nat':
                        var $2574 = self.natx;
                        var _expr$9 = (() => {
                            var $2577 = _expr$1;
                            var $2578 = _wyth$3;
                            let _expr$10 = $2577;
                            let _defn$9;
                            while ($2578._ === 'List.cons') {
                                _defn$9 = $2578.head;
                                var $2577 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2579 = self.file;
                                            var $2580 = self.code;
                                            var $2581 = self.name;
                                            var $2582 = self.term;
                                            var $2583 = self.type;
                                            var $2584 = self.stat;
                                            var $2585 = $2582;
                                            return $2585;
                                    };
                                })());
                                _expr$10 = $2577;
                                $2578 = $2578.tail;
                            }
                            return _expr$10;
                        })();
                        var $2575 = _expr$9;
                        return $2575;
                    case 'Fm.Term.chr':
                        var $2586 = self.chrx;
                        var _expr$9 = (() => {
                            var $2589 = _expr$1;
                            var $2590 = _wyth$3;
                            let _expr$10 = $2589;
                            let _defn$9;
                            while ($2590._ === 'List.cons') {
                                _defn$9 = $2590.head;
                                var $2589 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2591 = self.file;
                                            var $2592 = self.code;
                                            var $2593 = self.name;
                                            var $2594 = self.term;
                                            var $2595 = self.type;
                                            var $2596 = self.stat;
                                            var $2597 = $2594;
                                            return $2597;
                                    };
                                })());
                                _expr$10 = $2589;
                                $2590 = $2590.tail;
                            }
                            return _expr$10;
                        })();
                        var $2587 = _expr$9;
                        return $2587;
                    case 'Fm.Term.str':
                        var $2598 = self.strx;
                        var _expr$9 = (() => {
                            var $2601 = _expr$1;
                            var $2602 = _wyth$3;
                            let _expr$10 = $2601;
                            let _defn$9;
                            while ($2602._ === 'List.cons') {
                                _defn$9 = $2602.head;
                                var $2601 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2603 = self.file;
                                            var $2604 = self.code;
                                            var $2605 = self.name;
                                            var $2606 = self.term;
                                            var $2607 = self.type;
                                            var $2608 = self.stat;
                                            var $2609 = $2606;
                                            return $2609;
                                    };
                                })());
                                _expr$10 = $2601;
                                $2602 = $2602.tail;
                            }
                            return _expr$10;
                        })();
                        var $2599 = _expr$9;
                        return $2599;
                    case 'Fm.Term.cse':
                        var $2610 = self.path;
                        var $2611 = self.expr;
                        var $2612 = self.name;
                        var $2613 = self.with;
                        var $2614 = self.cses;
                        var $2615 = self.moti;
                        var _expr$14 = (() => {
                            var $2618 = _expr$1;
                            var $2619 = _wyth$3;
                            let _expr$15 = $2618;
                            let _defn$14;
                            while ($2619._ === 'List.cons') {
                                _defn$14 = $2619.head;
                                var $2618 = Fm$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2620 = self.file;
                                            var $2621 = self.code;
                                            var $2622 = self.name;
                                            var $2623 = self.term;
                                            var $2624 = self.type;
                                            var $2625 = self.stat;
                                            var $2626 = $2623;
                                            return $2626;
                                    };
                                })());
                                _expr$15 = $2618;
                                $2619 = $2619.tail;
                            }
                            return _expr$15;
                        })();
                        var $2616 = _expr$14;
                        return $2616;
                    case 'Fm.Term.ori':
                        var $2627 = self.orig;
                        var $2628 = self.expr;
                        var _expr$10 = (() => {
                            var $2631 = _expr$1;
                            var $2632 = _wyth$3;
                            let _expr$11 = $2631;
                            let _defn$10;
                            while ($2632._ === 'List.cons') {
                                _defn$10 = $2632.head;
                                var $2631 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2633 = self.file;
                                            var $2634 = self.code;
                                            var $2635 = self.name;
                                            var $2636 = self.term;
                                            var $2637 = self.type;
                                            var $2638 = self.stat;
                                            var $2639 = $2636;
                                            return $2639;
                                    };
                                })());
                                _expr$11 = $2631;
                                $2632 = $2632.tail;
                            }
                            return _expr$11;
                        })();
                        var $2629 = _expr$10;
                        return $2629;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Term$desugar_cse$cases = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Fm$Term$desugar_cse$cases$(x0, x1, x2, x3, x4, x5, x6);

    function Fm$Term$desugar_cse$(_expr$1, _name$2, _with$3, _cses$4, _moti$5, _type$6, _defs$7, _ctxt$8) {
        var self = Fm$Term$reduce$(_type$6, _defs$7);
        switch (self._) {
            case 'Fm.Term.var':
                var $2641 = self.name;
                var $2642 = self.indx;
                var $2643 = Maybe$none;
                var $2640 = $2643;
                break;
            case 'Fm.Term.ref':
                var $2644 = self.name;
                var $2645 = Maybe$none;
                var $2640 = $2645;
                break;
            case 'Fm.Term.typ':
                var $2646 = Maybe$none;
                var $2640 = $2646;
                break;
            case 'Fm.Term.all':
                var $2647 = self.eras;
                var $2648 = self.self;
                var $2649 = self.name;
                var $2650 = self.xtyp;
                var $2651 = self.body;
                var _moti$14 = Fm$Term$desugar_cse$motive$(_with$3, _moti$5);
                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, List$nil, $2650, _moti$14, _defs$7);
                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                var _type$17 = $2651(Fm$Term$var$($2648, 0n))(Fm$Term$var$($2649, 0n));
                var $2652 = Maybe$some$(Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _with$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $2640 = $2652;
                break;
            case 'Fm.Term.lam':
                var $2653 = self.name;
                var $2654 = self.body;
                var $2655 = Maybe$none;
                var $2640 = $2655;
                break;
            case 'Fm.Term.app':
                var $2656 = self.func;
                var $2657 = self.argm;
                var $2658 = Maybe$none;
                var $2640 = $2658;
                break;
            case 'Fm.Term.let':
                var $2659 = self.name;
                var $2660 = self.expr;
                var $2661 = self.body;
                var $2662 = Maybe$none;
                var $2640 = $2662;
                break;
            case 'Fm.Term.def':
                var $2663 = self.name;
                var $2664 = self.expr;
                var $2665 = self.body;
                var $2666 = Maybe$none;
                var $2640 = $2666;
                break;
            case 'Fm.Term.ann':
                var $2667 = self.done;
                var $2668 = self.term;
                var $2669 = self.type;
                var $2670 = Maybe$none;
                var $2640 = $2670;
                break;
            case 'Fm.Term.gol':
                var $2671 = self.name;
                var $2672 = self.dref;
                var $2673 = self.verb;
                var $2674 = Maybe$none;
                var $2640 = $2674;
                break;
            case 'Fm.Term.hol':
                var $2675 = self.path;
                var $2676 = Maybe$none;
                var $2640 = $2676;
                break;
            case 'Fm.Term.nat':
                var $2677 = self.natx;
                var $2678 = Maybe$none;
                var $2640 = $2678;
                break;
            case 'Fm.Term.chr':
                var $2679 = self.chrx;
                var $2680 = Maybe$none;
                var $2640 = $2680;
                break;
            case 'Fm.Term.str':
                var $2681 = self.strx;
                var $2682 = Maybe$none;
                var $2640 = $2682;
                break;
            case 'Fm.Term.cse':
                var $2683 = self.path;
                var $2684 = self.expr;
                var $2685 = self.name;
                var $2686 = self.with;
                var $2687 = self.cses;
                var $2688 = self.moti;
                var $2689 = Maybe$none;
                var $2640 = $2689;
                break;
            case 'Fm.Term.ori':
                var $2690 = self.orig;
                var $2691 = self.expr;
                var $2692 = Maybe$none;
                var $2640 = $2692;
                break;
        };
        return $2640;
    };
    const Fm$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Error$patch$(_path$1, _term$2) {
        var $2693 = ({
            _: 'Fm.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $2693;
    };
    const Fm$Error$patch = x0 => x1 => Fm$Error$patch$(x0, x1);

    function Fm$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.none':
                var $2695 = Bits$e;
                var $2694 = $2695;
                break;
            case 'Maybe.some':
                var $2696 = self.value;
                var $2697 = $2696(Bits$e);
                var $2694 = $2697;
                break;
        };
        return $2694;
    };
    const Fm$MPath$to_bits = x0 => Fm$MPath$to_bits$(x0);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $2699 = Bool$false;
                var $2698 = $2699;
                break;
            case 'Maybe.some':
                var $2700 = self.value;
                var $2701 = Bool$true;
                var $2698 = $2701;
                break;
        };
        return $2698;
    };
    const Set$has = x0 => x1 => Set$has$(x0, x1);

    function Fm$Term$equal$patch$(_path$2, _term$3, _ret$4) {
        var $2702 = Fm$Check$result$(Maybe$some$(_ret$4), List$cons$(Fm$Error$patch$(_path$2, Fm$Term$normalize$(_term$3, Map$new)), List$nil));
        return $2702;
    };
    const Fm$Term$equal$patch = x0 => x1 => x2 => Fm$Term$equal$patch$(x0, x1, x2);

    function Fm$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2704 = self.name;
                var $2705 = self.indx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2707 = self.name;
                        var $2708 = self.indx;
                        var $2709 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2709;
                        break;
                    case 'Fm.Term.ref':
                        var $2710 = self.name;
                        var $2711 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2711;
                        break;
                    case 'Fm.Term.typ':
                        var $2712 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2712;
                        break;
                    case 'Fm.Term.all':
                        var $2713 = self.eras;
                        var $2714 = self.self;
                        var $2715 = self.name;
                        var $2716 = self.xtyp;
                        var $2717 = self.body;
                        var $2718 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2718;
                        break;
                    case 'Fm.Term.lam':
                        var $2719 = self.name;
                        var $2720 = self.body;
                        var $2721 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2721;
                        break;
                    case 'Fm.Term.app':
                        var $2722 = self.func;
                        var $2723 = self.argm;
                        var $2724 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2724;
                        break;
                    case 'Fm.Term.let':
                        var $2725 = self.name;
                        var $2726 = self.expr;
                        var $2727 = self.body;
                        var $2728 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2728;
                        break;
                    case 'Fm.Term.def':
                        var $2729 = self.name;
                        var $2730 = self.expr;
                        var $2731 = self.body;
                        var $2732 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2732;
                        break;
                    case 'Fm.Term.ann':
                        var $2733 = self.done;
                        var $2734 = self.term;
                        var $2735 = self.type;
                        var $2736 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2736;
                        break;
                    case 'Fm.Term.gol':
                        var $2737 = self.name;
                        var $2738 = self.dref;
                        var $2739 = self.verb;
                        var $2740 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2740;
                        break;
                    case 'Fm.Term.hol':
                        var $2741 = self.path;
                        var $2742 = Fm$Term$equal$patch$($2741, _a$1, Unit$new);
                        var $2706 = $2742;
                        break;
                    case 'Fm.Term.nat':
                        var $2743 = self.natx;
                        var $2744 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2744;
                        break;
                    case 'Fm.Term.chr':
                        var $2745 = self.chrx;
                        var $2746 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2746;
                        break;
                    case 'Fm.Term.str':
                        var $2747 = self.strx;
                        var $2748 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2748;
                        break;
                    case 'Fm.Term.cse':
                        var $2749 = self.path;
                        var $2750 = self.expr;
                        var $2751 = self.name;
                        var $2752 = self.with;
                        var $2753 = self.cses;
                        var $2754 = self.moti;
                        var $2755 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2706 = $2755;
                        break;
                    case 'Fm.Term.ori':
                        var $2756 = self.orig;
                        var $2757 = self.expr;
                        var $2758 = Fm$Term$equal$extra_holes$(_a$1, $2757);
                        var $2706 = $2758;
                        break;
                };
                var $2703 = $2706;
                break;
            case 'Fm.Term.ref':
                var $2759 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2761 = self.name;
                        var $2762 = self.indx;
                        var $2763 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2763;
                        break;
                    case 'Fm.Term.ref':
                        var $2764 = self.name;
                        var $2765 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2765;
                        break;
                    case 'Fm.Term.typ':
                        var $2766 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2766;
                        break;
                    case 'Fm.Term.all':
                        var $2767 = self.eras;
                        var $2768 = self.self;
                        var $2769 = self.name;
                        var $2770 = self.xtyp;
                        var $2771 = self.body;
                        var $2772 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2772;
                        break;
                    case 'Fm.Term.lam':
                        var $2773 = self.name;
                        var $2774 = self.body;
                        var $2775 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2775;
                        break;
                    case 'Fm.Term.app':
                        var $2776 = self.func;
                        var $2777 = self.argm;
                        var $2778 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2778;
                        break;
                    case 'Fm.Term.let':
                        var $2779 = self.name;
                        var $2780 = self.expr;
                        var $2781 = self.body;
                        var $2782 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2782;
                        break;
                    case 'Fm.Term.def':
                        var $2783 = self.name;
                        var $2784 = self.expr;
                        var $2785 = self.body;
                        var $2786 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2786;
                        break;
                    case 'Fm.Term.ann':
                        var $2787 = self.done;
                        var $2788 = self.term;
                        var $2789 = self.type;
                        var $2790 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2790;
                        break;
                    case 'Fm.Term.gol':
                        var $2791 = self.name;
                        var $2792 = self.dref;
                        var $2793 = self.verb;
                        var $2794 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2794;
                        break;
                    case 'Fm.Term.hol':
                        var $2795 = self.path;
                        var $2796 = Fm$Term$equal$patch$($2795, _a$1, Unit$new);
                        var $2760 = $2796;
                        break;
                    case 'Fm.Term.nat':
                        var $2797 = self.natx;
                        var $2798 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2798;
                        break;
                    case 'Fm.Term.chr':
                        var $2799 = self.chrx;
                        var $2800 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2800;
                        break;
                    case 'Fm.Term.str':
                        var $2801 = self.strx;
                        var $2802 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2802;
                        break;
                    case 'Fm.Term.cse':
                        var $2803 = self.path;
                        var $2804 = self.expr;
                        var $2805 = self.name;
                        var $2806 = self.with;
                        var $2807 = self.cses;
                        var $2808 = self.moti;
                        var $2809 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2760 = $2809;
                        break;
                    case 'Fm.Term.ori':
                        var $2810 = self.orig;
                        var $2811 = self.expr;
                        var $2812 = Fm$Term$equal$extra_holes$(_a$1, $2811);
                        var $2760 = $2812;
                        break;
                };
                var $2703 = $2760;
                break;
            case 'Fm.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2814 = self.name;
                        var $2815 = self.indx;
                        var $2816 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2816;
                        break;
                    case 'Fm.Term.ref':
                        var $2817 = self.name;
                        var $2818 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2818;
                        break;
                    case 'Fm.Term.typ':
                        var $2819 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2819;
                        break;
                    case 'Fm.Term.all':
                        var $2820 = self.eras;
                        var $2821 = self.self;
                        var $2822 = self.name;
                        var $2823 = self.xtyp;
                        var $2824 = self.body;
                        var $2825 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2825;
                        break;
                    case 'Fm.Term.lam':
                        var $2826 = self.name;
                        var $2827 = self.body;
                        var $2828 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2828;
                        break;
                    case 'Fm.Term.app':
                        var $2829 = self.func;
                        var $2830 = self.argm;
                        var $2831 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2831;
                        break;
                    case 'Fm.Term.let':
                        var $2832 = self.name;
                        var $2833 = self.expr;
                        var $2834 = self.body;
                        var $2835 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2835;
                        break;
                    case 'Fm.Term.def':
                        var $2836 = self.name;
                        var $2837 = self.expr;
                        var $2838 = self.body;
                        var $2839 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2839;
                        break;
                    case 'Fm.Term.ann':
                        var $2840 = self.done;
                        var $2841 = self.term;
                        var $2842 = self.type;
                        var $2843 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2843;
                        break;
                    case 'Fm.Term.gol':
                        var $2844 = self.name;
                        var $2845 = self.dref;
                        var $2846 = self.verb;
                        var $2847 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2847;
                        break;
                    case 'Fm.Term.hol':
                        var $2848 = self.path;
                        var $2849 = Fm$Term$equal$patch$($2848, _a$1, Unit$new);
                        var $2813 = $2849;
                        break;
                    case 'Fm.Term.nat':
                        var $2850 = self.natx;
                        var $2851 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2851;
                        break;
                    case 'Fm.Term.chr':
                        var $2852 = self.chrx;
                        var $2853 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2853;
                        break;
                    case 'Fm.Term.str':
                        var $2854 = self.strx;
                        var $2855 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2855;
                        break;
                    case 'Fm.Term.cse':
                        var $2856 = self.path;
                        var $2857 = self.expr;
                        var $2858 = self.name;
                        var $2859 = self.with;
                        var $2860 = self.cses;
                        var $2861 = self.moti;
                        var $2862 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2813 = $2862;
                        break;
                    case 'Fm.Term.ori':
                        var $2863 = self.orig;
                        var $2864 = self.expr;
                        var $2865 = Fm$Term$equal$extra_holes$(_a$1, $2864);
                        var $2813 = $2865;
                        break;
                };
                var $2703 = $2813;
                break;
            case 'Fm.Term.all':
                var $2866 = self.eras;
                var $2867 = self.self;
                var $2868 = self.name;
                var $2869 = self.xtyp;
                var $2870 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2872 = self.name;
                        var $2873 = self.indx;
                        var $2874 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2874;
                        break;
                    case 'Fm.Term.ref':
                        var $2875 = self.name;
                        var $2876 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2876;
                        break;
                    case 'Fm.Term.typ':
                        var $2877 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2877;
                        break;
                    case 'Fm.Term.all':
                        var $2878 = self.eras;
                        var $2879 = self.self;
                        var $2880 = self.name;
                        var $2881 = self.xtyp;
                        var $2882 = self.body;
                        var $2883 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2883;
                        break;
                    case 'Fm.Term.lam':
                        var $2884 = self.name;
                        var $2885 = self.body;
                        var $2886 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2886;
                        break;
                    case 'Fm.Term.app':
                        var $2887 = self.func;
                        var $2888 = self.argm;
                        var $2889 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2889;
                        break;
                    case 'Fm.Term.let':
                        var $2890 = self.name;
                        var $2891 = self.expr;
                        var $2892 = self.body;
                        var $2893 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2893;
                        break;
                    case 'Fm.Term.def':
                        var $2894 = self.name;
                        var $2895 = self.expr;
                        var $2896 = self.body;
                        var $2897 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2897;
                        break;
                    case 'Fm.Term.ann':
                        var $2898 = self.done;
                        var $2899 = self.term;
                        var $2900 = self.type;
                        var $2901 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2901;
                        break;
                    case 'Fm.Term.gol':
                        var $2902 = self.name;
                        var $2903 = self.dref;
                        var $2904 = self.verb;
                        var $2905 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2905;
                        break;
                    case 'Fm.Term.hol':
                        var $2906 = self.path;
                        var $2907 = Fm$Term$equal$patch$($2906, _a$1, Unit$new);
                        var $2871 = $2907;
                        break;
                    case 'Fm.Term.nat':
                        var $2908 = self.natx;
                        var $2909 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2909;
                        break;
                    case 'Fm.Term.chr':
                        var $2910 = self.chrx;
                        var $2911 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2911;
                        break;
                    case 'Fm.Term.str':
                        var $2912 = self.strx;
                        var $2913 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2913;
                        break;
                    case 'Fm.Term.cse':
                        var $2914 = self.path;
                        var $2915 = self.expr;
                        var $2916 = self.name;
                        var $2917 = self.with;
                        var $2918 = self.cses;
                        var $2919 = self.moti;
                        var $2920 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2871 = $2920;
                        break;
                    case 'Fm.Term.ori':
                        var $2921 = self.orig;
                        var $2922 = self.expr;
                        var $2923 = Fm$Term$equal$extra_holes$(_a$1, $2922);
                        var $2871 = $2923;
                        break;
                };
                var $2703 = $2871;
                break;
            case 'Fm.Term.lam':
                var $2924 = self.name;
                var $2925 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2927 = self.name;
                        var $2928 = self.indx;
                        var $2929 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2929;
                        break;
                    case 'Fm.Term.ref':
                        var $2930 = self.name;
                        var $2931 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2931;
                        break;
                    case 'Fm.Term.typ':
                        var $2932 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2932;
                        break;
                    case 'Fm.Term.all':
                        var $2933 = self.eras;
                        var $2934 = self.self;
                        var $2935 = self.name;
                        var $2936 = self.xtyp;
                        var $2937 = self.body;
                        var $2938 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2938;
                        break;
                    case 'Fm.Term.lam':
                        var $2939 = self.name;
                        var $2940 = self.body;
                        var $2941 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2941;
                        break;
                    case 'Fm.Term.app':
                        var $2942 = self.func;
                        var $2943 = self.argm;
                        var $2944 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2944;
                        break;
                    case 'Fm.Term.let':
                        var $2945 = self.name;
                        var $2946 = self.expr;
                        var $2947 = self.body;
                        var $2948 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2948;
                        break;
                    case 'Fm.Term.def':
                        var $2949 = self.name;
                        var $2950 = self.expr;
                        var $2951 = self.body;
                        var $2952 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2952;
                        break;
                    case 'Fm.Term.ann':
                        var $2953 = self.done;
                        var $2954 = self.term;
                        var $2955 = self.type;
                        var $2956 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2956;
                        break;
                    case 'Fm.Term.gol':
                        var $2957 = self.name;
                        var $2958 = self.dref;
                        var $2959 = self.verb;
                        var $2960 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2960;
                        break;
                    case 'Fm.Term.hol':
                        var $2961 = self.path;
                        var $2962 = Fm$Term$equal$patch$($2961, _a$1, Unit$new);
                        var $2926 = $2962;
                        break;
                    case 'Fm.Term.nat':
                        var $2963 = self.natx;
                        var $2964 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2964;
                        break;
                    case 'Fm.Term.chr':
                        var $2965 = self.chrx;
                        var $2966 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2966;
                        break;
                    case 'Fm.Term.str':
                        var $2967 = self.strx;
                        var $2968 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2968;
                        break;
                    case 'Fm.Term.cse':
                        var $2969 = self.path;
                        var $2970 = self.expr;
                        var $2971 = self.name;
                        var $2972 = self.with;
                        var $2973 = self.cses;
                        var $2974 = self.moti;
                        var $2975 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2926 = $2975;
                        break;
                    case 'Fm.Term.ori':
                        var $2976 = self.orig;
                        var $2977 = self.expr;
                        var $2978 = Fm$Term$equal$extra_holes$(_a$1, $2977);
                        var $2926 = $2978;
                        break;
                };
                var $2703 = $2926;
                break;
            case 'Fm.Term.app':
                var $2979 = self.func;
                var $2980 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2982 = self.name;
                        var $2983 = self.indx;
                        var $2984 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $2984;
                        break;
                    case 'Fm.Term.ref':
                        var $2985 = self.name;
                        var $2986 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $2986;
                        break;
                    case 'Fm.Term.typ':
                        var $2987 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $2987;
                        break;
                    case 'Fm.Term.all':
                        var $2988 = self.eras;
                        var $2989 = self.self;
                        var $2990 = self.name;
                        var $2991 = self.xtyp;
                        var $2992 = self.body;
                        var $2993 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $2993;
                        break;
                    case 'Fm.Term.lam':
                        var $2994 = self.name;
                        var $2995 = self.body;
                        var $2996 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $2996;
                        break;
                    case 'Fm.Term.app':
                        var $2997 = self.func;
                        var $2998 = self.argm;
                        var $2999 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$($2979, $2997))((_$7 => {
                            var $3000 = Fm$Term$equal$extra_holes$($2980, $2998);
                            return $3000;
                        }));
                        var $2981 = $2999;
                        break;
                    case 'Fm.Term.let':
                        var $3001 = self.name;
                        var $3002 = self.expr;
                        var $3003 = self.body;
                        var $3004 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $3004;
                        break;
                    case 'Fm.Term.def':
                        var $3005 = self.name;
                        var $3006 = self.expr;
                        var $3007 = self.body;
                        var $3008 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $3008;
                        break;
                    case 'Fm.Term.ann':
                        var $3009 = self.done;
                        var $3010 = self.term;
                        var $3011 = self.type;
                        var $3012 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $3012;
                        break;
                    case 'Fm.Term.gol':
                        var $3013 = self.name;
                        var $3014 = self.dref;
                        var $3015 = self.verb;
                        var $3016 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $3016;
                        break;
                    case 'Fm.Term.hol':
                        var $3017 = self.path;
                        var $3018 = Fm$Term$equal$patch$($3017, _a$1, Unit$new);
                        var $2981 = $3018;
                        break;
                    case 'Fm.Term.nat':
                        var $3019 = self.natx;
                        var $3020 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $3020;
                        break;
                    case 'Fm.Term.chr':
                        var $3021 = self.chrx;
                        var $3022 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $3022;
                        break;
                    case 'Fm.Term.str':
                        var $3023 = self.strx;
                        var $3024 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $3024;
                        break;
                    case 'Fm.Term.cse':
                        var $3025 = self.path;
                        var $3026 = self.expr;
                        var $3027 = self.name;
                        var $3028 = self.with;
                        var $3029 = self.cses;
                        var $3030 = self.moti;
                        var $3031 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2981 = $3031;
                        break;
                    case 'Fm.Term.ori':
                        var $3032 = self.orig;
                        var $3033 = self.expr;
                        var $3034 = Fm$Term$equal$extra_holes$(_a$1, $3033);
                        var $2981 = $3034;
                        break;
                };
                var $2703 = $2981;
                break;
            case 'Fm.Term.let':
                var $3035 = self.name;
                var $3036 = self.expr;
                var $3037 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3039 = self.name;
                        var $3040 = self.indx;
                        var $3041 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3041;
                        break;
                    case 'Fm.Term.ref':
                        var $3042 = self.name;
                        var $3043 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3043;
                        break;
                    case 'Fm.Term.typ':
                        var $3044 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3044;
                        break;
                    case 'Fm.Term.all':
                        var $3045 = self.eras;
                        var $3046 = self.self;
                        var $3047 = self.name;
                        var $3048 = self.xtyp;
                        var $3049 = self.body;
                        var $3050 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3050;
                        break;
                    case 'Fm.Term.lam':
                        var $3051 = self.name;
                        var $3052 = self.body;
                        var $3053 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3053;
                        break;
                    case 'Fm.Term.app':
                        var $3054 = self.func;
                        var $3055 = self.argm;
                        var $3056 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3056;
                        break;
                    case 'Fm.Term.let':
                        var $3057 = self.name;
                        var $3058 = self.expr;
                        var $3059 = self.body;
                        var $3060 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3060;
                        break;
                    case 'Fm.Term.def':
                        var $3061 = self.name;
                        var $3062 = self.expr;
                        var $3063 = self.body;
                        var $3064 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3064;
                        break;
                    case 'Fm.Term.ann':
                        var $3065 = self.done;
                        var $3066 = self.term;
                        var $3067 = self.type;
                        var $3068 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3068;
                        break;
                    case 'Fm.Term.gol':
                        var $3069 = self.name;
                        var $3070 = self.dref;
                        var $3071 = self.verb;
                        var $3072 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3072;
                        break;
                    case 'Fm.Term.hol':
                        var $3073 = self.path;
                        var $3074 = Fm$Term$equal$patch$($3073, _a$1, Unit$new);
                        var $3038 = $3074;
                        break;
                    case 'Fm.Term.nat':
                        var $3075 = self.natx;
                        var $3076 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3076;
                        break;
                    case 'Fm.Term.chr':
                        var $3077 = self.chrx;
                        var $3078 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3078;
                        break;
                    case 'Fm.Term.str':
                        var $3079 = self.strx;
                        var $3080 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3080;
                        break;
                    case 'Fm.Term.cse':
                        var $3081 = self.path;
                        var $3082 = self.expr;
                        var $3083 = self.name;
                        var $3084 = self.with;
                        var $3085 = self.cses;
                        var $3086 = self.moti;
                        var $3087 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3038 = $3087;
                        break;
                    case 'Fm.Term.ori':
                        var $3088 = self.orig;
                        var $3089 = self.expr;
                        var $3090 = Fm$Term$equal$extra_holes$(_a$1, $3089);
                        var $3038 = $3090;
                        break;
                };
                var $2703 = $3038;
                break;
            case 'Fm.Term.def':
                var $3091 = self.name;
                var $3092 = self.expr;
                var $3093 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3095 = self.name;
                        var $3096 = self.indx;
                        var $3097 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3097;
                        break;
                    case 'Fm.Term.ref':
                        var $3098 = self.name;
                        var $3099 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3099;
                        break;
                    case 'Fm.Term.typ':
                        var $3100 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3100;
                        break;
                    case 'Fm.Term.all':
                        var $3101 = self.eras;
                        var $3102 = self.self;
                        var $3103 = self.name;
                        var $3104 = self.xtyp;
                        var $3105 = self.body;
                        var $3106 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3106;
                        break;
                    case 'Fm.Term.lam':
                        var $3107 = self.name;
                        var $3108 = self.body;
                        var $3109 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3109;
                        break;
                    case 'Fm.Term.app':
                        var $3110 = self.func;
                        var $3111 = self.argm;
                        var $3112 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3112;
                        break;
                    case 'Fm.Term.let':
                        var $3113 = self.name;
                        var $3114 = self.expr;
                        var $3115 = self.body;
                        var $3116 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3116;
                        break;
                    case 'Fm.Term.def':
                        var $3117 = self.name;
                        var $3118 = self.expr;
                        var $3119 = self.body;
                        var $3120 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3120;
                        break;
                    case 'Fm.Term.ann':
                        var $3121 = self.done;
                        var $3122 = self.term;
                        var $3123 = self.type;
                        var $3124 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3124;
                        break;
                    case 'Fm.Term.gol':
                        var $3125 = self.name;
                        var $3126 = self.dref;
                        var $3127 = self.verb;
                        var $3128 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3128;
                        break;
                    case 'Fm.Term.hol':
                        var $3129 = self.path;
                        var $3130 = Fm$Term$equal$patch$($3129, _a$1, Unit$new);
                        var $3094 = $3130;
                        break;
                    case 'Fm.Term.nat':
                        var $3131 = self.natx;
                        var $3132 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3132;
                        break;
                    case 'Fm.Term.chr':
                        var $3133 = self.chrx;
                        var $3134 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3134;
                        break;
                    case 'Fm.Term.str':
                        var $3135 = self.strx;
                        var $3136 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3136;
                        break;
                    case 'Fm.Term.cse':
                        var $3137 = self.path;
                        var $3138 = self.expr;
                        var $3139 = self.name;
                        var $3140 = self.with;
                        var $3141 = self.cses;
                        var $3142 = self.moti;
                        var $3143 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3094 = $3143;
                        break;
                    case 'Fm.Term.ori':
                        var $3144 = self.orig;
                        var $3145 = self.expr;
                        var $3146 = Fm$Term$equal$extra_holes$(_a$1, $3145);
                        var $3094 = $3146;
                        break;
                };
                var $2703 = $3094;
                break;
            case 'Fm.Term.ann':
                var $3147 = self.done;
                var $3148 = self.term;
                var $3149 = self.type;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3151 = self.name;
                        var $3152 = self.indx;
                        var $3153 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3153;
                        break;
                    case 'Fm.Term.ref':
                        var $3154 = self.name;
                        var $3155 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3155;
                        break;
                    case 'Fm.Term.typ':
                        var $3156 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3156;
                        break;
                    case 'Fm.Term.all':
                        var $3157 = self.eras;
                        var $3158 = self.self;
                        var $3159 = self.name;
                        var $3160 = self.xtyp;
                        var $3161 = self.body;
                        var $3162 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3162;
                        break;
                    case 'Fm.Term.lam':
                        var $3163 = self.name;
                        var $3164 = self.body;
                        var $3165 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3165;
                        break;
                    case 'Fm.Term.app':
                        var $3166 = self.func;
                        var $3167 = self.argm;
                        var $3168 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3168;
                        break;
                    case 'Fm.Term.let':
                        var $3169 = self.name;
                        var $3170 = self.expr;
                        var $3171 = self.body;
                        var $3172 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3172;
                        break;
                    case 'Fm.Term.def':
                        var $3173 = self.name;
                        var $3174 = self.expr;
                        var $3175 = self.body;
                        var $3176 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3176;
                        break;
                    case 'Fm.Term.ann':
                        var $3177 = self.done;
                        var $3178 = self.term;
                        var $3179 = self.type;
                        var $3180 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3180;
                        break;
                    case 'Fm.Term.gol':
                        var $3181 = self.name;
                        var $3182 = self.dref;
                        var $3183 = self.verb;
                        var $3184 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3184;
                        break;
                    case 'Fm.Term.hol':
                        var $3185 = self.path;
                        var $3186 = Fm$Term$equal$patch$($3185, _a$1, Unit$new);
                        var $3150 = $3186;
                        break;
                    case 'Fm.Term.nat':
                        var $3187 = self.natx;
                        var $3188 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3188;
                        break;
                    case 'Fm.Term.chr':
                        var $3189 = self.chrx;
                        var $3190 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3190;
                        break;
                    case 'Fm.Term.str':
                        var $3191 = self.strx;
                        var $3192 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3192;
                        break;
                    case 'Fm.Term.cse':
                        var $3193 = self.path;
                        var $3194 = self.expr;
                        var $3195 = self.name;
                        var $3196 = self.with;
                        var $3197 = self.cses;
                        var $3198 = self.moti;
                        var $3199 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3150 = $3199;
                        break;
                    case 'Fm.Term.ori':
                        var $3200 = self.orig;
                        var $3201 = self.expr;
                        var $3202 = Fm$Term$equal$extra_holes$(_a$1, $3201);
                        var $3150 = $3202;
                        break;
                };
                var $2703 = $3150;
                break;
            case 'Fm.Term.gol':
                var $3203 = self.name;
                var $3204 = self.dref;
                var $3205 = self.verb;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3207 = self.name;
                        var $3208 = self.indx;
                        var $3209 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3209;
                        break;
                    case 'Fm.Term.ref':
                        var $3210 = self.name;
                        var $3211 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3211;
                        break;
                    case 'Fm.Term.typ':
                        var $3212 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3212;
                        break;
                    case 'Fm.Term.all':
                        var $3213 = self.eras;
                        var $3214 = self.self;
                        var $3215 = self.name;
                        var $3216 = self.xtyp;
                        var $3217 = self.body;
                        var $3218 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3218;
                        break;
                    case 'Fm.Term.lam':
                        var $3219 = self.name;
                        var $3220 = self.body;
                        var $3221 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3221;
                        break;
                    case 'Fm.Term.app':
                        var $3222 = self.func;
                        var $3223 = self.argm;
                        var $3224 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3224;
                        break;
                    case 'Fm.Term.let':
                        var $3225 = self.name;
                        var $3226 = self.expr;
                        var $3227 = self.body;
                        var $3228 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3228;
                        break;
                    case 'Fm.Term.def':
                        var $3229 = self.name;
                        var $3230 = self.expr;
                        var $3231 = self.body;
                        var $3232 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3232;
                        break;
                    case 'Fm.Term.ann':
                        var $3233 = self.done;
                        var $3234 = self.term;
                        var $3235 = self.type;
                        var $3236 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3236;
                        break;
                    case 'Fm.Term.gol':
                        var $3237 = self.name;
                        var $3238 = self.dref;
                        var $3239 = self.verb;
                        var $3240 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3240;
                        break;
                    case 'Fm.Term.hol':
                        var $3241 = self.path;
                        var $3242 = Fm$Term$equal$patch$($3241, _a$1, Unit$new);
                        var $3206 = $3242;
                        break;
                    case 'Fm.Term.nat':
                        var $3243 = self.natx;
                        var $3244 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3244;
                        break;
                    case 'Fm.Term.chr':
                        var $3245 = self.chrx;
                        var $3246 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3246;
                        break;
                    case 'Fm.Term.str':
                        var $3247 = self.strx;
                        var $3248 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3248;
                        break;
                    case 'Fm.Term.cse':
                        var $3249 = self.path;
                        var $3250 = self.expr;
                        var $3251 = self.name;
                        var $3252 = self.with;
                        var $3253 = self.cses;
                        var $3254 = self.moti;
                        var $3255 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3206 = $3255;
                        break;
                    case 'Fm.Term.ori':
                        var $3256 = self.orig;
                        var $3257 = self.expr;
                        var $3258 = Fm$Term$equal$extra_holes$(_a$1, $3257);
                        var $3206 = $3258;
                        break;
                };
                var $2703 = $3206;
                break;
            case 'Fm.Term.hol':
                var $3259 = self.path;
                var $3260 = Fm$Term$equal$patch$($3259, _b$2, Unit$new);
                var $2703 = $3260;
                break;
            case 'Fm.Term.nat':
                var $3261 = self.natx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3263 = self.name;
                        var $3264 = self.indx;
                        var $3265 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3265;
                        break;
                    case 'Fm.Term.ref':
                        var $3266 = self.name;
                        var $3267 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3267;
                        break;
                    case 'Fm.Term.typ':
                        var $3268 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3268;
                        break;
                    case 'Fm.Term.all':
                        var $3269 = self.eras;
                        var $3270 = self.self;
                        var $3271 = self.name;
                        var $3272 = self.xtyp;
                        var $3273 = self.body;
                        var $3274 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3274;
                        break;
                    case 'Fm.Term.lam':
                        var $3275 = self.name;
                        var $3276 = self.body;
                        var $3277 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3277;
                        break;
                    case 'Fm.Term.app':
                        var $3278 = self.func;
                        var $3279 = self.argm;
                        var $3280 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3280;
                        break;
                    case 'Fm.Term.let':
                        var $3281 = self.name;
                        var $3282 = self.expr;
                        var $3283 = self.body;
                        var $3284 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3284;
                        break;
                    case 'Fm.Term.def':
                        var $3285 = self.name;
                        var $3286 = self.expr;
                        var $3287 = self.body;
                        var $3288 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3288;
                        break;
                    case 'Fm.Term.ann':
                        var $3289 = self.done;
                        var $3290 = self.term;
                        var $3291 = self.type;
                        var $3292 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3292;
                        break;
                    case 'Fm.Term.gol':
                        var $3293 = self.name;
                        var $3294 = self.dref;
                        var $3295 = self.verb;
                        var $3296 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3296;
                        break;
                    case 'Fm.Term.hol':
                        var $3297 = self.path;
                        var $3298 = Fm$Term$equal$patch$($3297, _a$1, Unit$new);
                        var $3262 = $3298;
                        break;
                    case 'Fm.Term.nat':
                        var $3299 = self.natx;
                        var $3300 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3300;
                        break;
                    case 'Fm.Term.chr':
                        var $3301 = self.chrx;
                        var $3302 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3302;
                        break;
                    case 'Fm.Term.str':
                        var $3303 = self.strx;
                        var $3304 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3304;
                        break;
                    case 'Fm.Term.cse':
                        var $3305 = self.path;
                        var $3306 = self.expr;
                        var $3307 = self.name;
                        var $3308 = self.with;
                        var $3309 = self.cses;
                        var $3310 = self.moti;
                        var $3311 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3262 = $3311;
                        break;
                    case 'Fm.Term.ori':
                        var $3312 = self.orig;
                        var $3313 = self.expr;
                        var $3314 = Fm$Term$equal$extra_holes$(_a$1, $3313);
                        var $3262 = $3314;
                        break;
                };
                var $2703 = $3262;
                break;
            case 'Fm.Term.chr':
                var $3315 = self.chrx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3317 = self.name;
                        var $3318 = self.indx;
                        var $3319 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3319;
                        break;
                    case 'Fm.Term.ref':
                        var $3320 = self.name;
                        var $3321 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3321;
                        break;
                    case 'Fm.Term.typ':
                        var $3322 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3322;
                        break;
                    case 'Fm.Term.all':
                        var $3323 = self.eras;
                        var $3324 = self.self;
                        var $3325 = self.name;
                        var $3326 = self.xtyp;
                        var $3327 = self.body;
                        var $3328 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3328;
                        break;
                    case 'Fm.Term.lam':
                        var $3329 = self.name;
                        var $3330 = self.body;
                        var $3331 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3331;
                        break;
                    case 'Fm.Term.app':
                        var $3332 = self.func;
                        var $3333 = self.argm;
                        var $3334 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3334;
                        break;
                    case 'Fm.Term.let':
                        var $3335 = self.name;
                        var $3336 = self.expr;
                        var $3337 = self.body;
                        var $3338 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3338;
                        break;
                    case 'Fm.Term.def':
                        var $3339 = self.name;
                        var $3340 = self.expr;
                        var $3341 = self.body;
                        var $3342 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3342;
                        break;
                    case 'Fm.Term.ann':
                        var $3343 = self.done;
                        var $3344 = self.term;
                        var $3345 = self.type;
                        var $3346 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3346;
                        break;
                    case 'Fm.Term.gol':
                        var $3347 = self.name;
                        var $3348 = self.dref;
                        var $3349 = self.verb;
                        var $3350 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3350;
                        break;
                    case 'Fm.Term.hol':
                        var $3351 = self.path;
                        var $3352 = Fm$Term$equal$patch$($3351, _a$1, Unit$new);
                        var $3316 = $3352;
                        break;
                    case 'Fm.Term.nat':
                        var $3353 = self.natx;
                        var $3354 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3354;
                        break;
                    case 'Fm.Term.chr':
                        var $3355 = self.chrx;
                        var $3356 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3356;
                        break;
                    case 'Fm.Term.str':
                        var $3357 = self.strx;
                        var $3358 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3358;
                        break;
                    case 'Fm.Term.cse':
                        var $3359 = self.path;
                        var $3360 = self.expr;
                        var $3361 = self.name;
                        var $3362 = self.with;
                        var $3363 = self.cses;
                        var $3364 = self.moti;
                        var $3365 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3316 = $3365;
                        break;
                    case 'Fm.Term.ori':
                        var $3366 = self.orig;
                        var $3367 = self.expr;
                        var $3368 = Fm$Term$equal$extra_holes$(_a$1, $3367);
                        var $3316 = $3368;
                        break;
                };
                var $2703 = $3316;
                break;
            case 'Fm.Term.str':
                var $3369 = self.strx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3371 = self.name;
                        var $3372 = self.indx;
                        var $3373 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3373;
                        break;
                    case 'Fm.Term.ref':
                        var $3374 = self.name;
                        var $3375 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3375;
                        break;
                    case 'Fm.Term.typ':
                        var $3376 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3376;
                        break;
                    case 'Fm.Term.all':
                        var $3377 = self.eras;
                        var $3378 = self.self;
                        var $3379 = self.name;
                        var $3380 = self.xtyp;
                        var $3381 = self.body;
                        var $3382 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3382;
                        break;
                    case 'Fm.Term.lam':
                        var $3383 = self.name;
                        var $3384 = self.body;
                        var $3385 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3385;
                        break;
                    case 'Fm.Term.app':
                        var $3386 = self.func;
                        var $3387 = self.argm;
                        var $3388 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3388;
                        break;
                    case 'Fm.Term.let':
                        var $3389 = self.name;
                        var $3390 = self.expr;
                        var $3391 = self.body;
                        var $3392 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3392;
                        break;
                    case 'Fm.Term.def':
                        var $3393 = self.name;
                        var $3394 = self.expr;
                        var $3395 = self.body;
                        var $3396 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3396;
                        break;
                    case 'Fm.Term.ann':
                        var $3397 = self.done;
                        var $3398 = self.term;
                        var $3399 = self.type;
                        var $3400 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3400;
                        break;
                    case 'Fm.Term.gol':
                        var $3401 = self.name;
                        var $3402 = self.dref;
                        var $3403 = self.verb;
                        var $3404 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3404;
                        break;
                    case 'Fm.Term.hol':
                        var $3405 = self.path;
                        var $3406 = Fm$Term$equal$patch$($3405, _a$1, Unit$new);
                        var $3370 = $3406;
                        break;
                    case 'Fm.Term.nat':
                        var $3407 = self.natx;
                        var $3408 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3408;
                        break;
                    case 'Fm.Term.chr':
                        var $3409 = self.chrx;
                        var $3410 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3410;
                        break;
                    case 'Fm.Term.str':
                        var $3411 = self.strx;
                        var $3412 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3412;
                        break;
                    case 'Fm.Term.cse':
                        var $3413 = self.path;
                        var $3414 = self.expr;
                        var $3415 = self.name;
                        var $3416 = self.with;
                        var $3417 = self.cses;
                        var $3418 = self.moti;
                        var $3419 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3370 = $3419;
                        break;
                    case 'Fm.Term.ori':
                        var $3420 = self.orig;
                        var $3421 = self.expr;
                        var $3422 = Fm$Term$equal$extra_holes$(_a$1, $3421);
                        var $3370 = $3422;
                        break;
                };
                var $2703 = $3370;
                break;
            case 'Fm.Term.cse':
                var $3423 = self.path;
                var $3424 = self.expr;
                var $3425 = self.name;
                var $3426 = self.with;
                var $3427 = self.cses;
                var $3428 = self.moti;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3430 = self.name;
                        var $3431 = self.indx;
                        var $3432 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3432;
                        break;
                    case 'Fm.Term.ref':
                        var $3433 = self.name;
                        var $3434 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3434;
                        break;
                    case 'Fm.Term.typ':
                        var $3435 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3435;
                        break;
                    case 'Fm.Term.all':
                        var $3436 = self.eras;
                        var $3437 = self.self;
                        var $3438 = self.name;
                        var $3439 = self.xtyp;
                        var $3440 = self.body;
                        var $3441 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3441;
                        break;
                    case 'Fm.Term.lam':
                        var $3442 = self.name;
                        var $3443 = self.body;
                        var $3444 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3444;
                        break;
                    case 'Fm.Term.app':
                        var $3445 = self.func;
                        var $3446 = self.argm;
                        var $3447 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3447;
                        break;
                    case 'Fm.Term.let':
                        var $3448 = self.name;
                        var $3449 = self.expr;
                        var $3450 = self.body;
                        var $3451 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3451;
                        break;
                    case 'Fm.Term.def':
                        var $3452 = self.name;
                        var $3453 = self.expr;
                        var $3454 = self.body;
                        var $3455 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3455;
                        break;
                    case 'Fm.Term.ann':
                        var $3456 = self.done;
                        var $3457 = self.term;
                        var $3458 = self.type;
                        var $3459 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3459;
                        break;
                    case 'Fm.Term.gol':
                        var $3460 = self.name;
                        var $3461 = self.dref;
                        var $3462 = self.verb;
                        var $3463 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3463;
                        break;
                    case 'Fm.Term.hol':
                        var $3464 = self.path;
                        var $3465 = Fm$Term$equal$patch$($3464, _a$1, Unit$new);
                        var $3429 = $3465;
                        break;
                    case 'Fm.Term.nat':
                        var $3466 = self.natx;
                        var $3467 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3467;
                        break;
                    case 'Fm.Term.chr':
                        var $3468 = self.chrx;
                        var $3469 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3469;
                        break;
                    case 'Fm.Term.str':
                        var $3470 = self.strx;
                        var $3471 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3471;
                        break;
                    case 'Fm.Term.cse':
                        var $3472 = self.path;
                        var $3473 = self.expr;
                        var $3474 = self.name;
                        var $3475 = self.with;
                        var $3476 = self.cses;
                        var $3477 = self.moti;
                        var $3478 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3429 = $3478;
                        break;
                    case 'Fm.Term.ori':
                        var $3479 = self.orig;
                        var $3480 = self.expr;
                        var $3481 = Fm$Term$equal$extra_holes$(_a$1, $3480);
                        var $3429 = $3481;
                        break;
                };
                var $2703 = $3429;
                break;
            case 'Fm.Term.ori':
                var $3482 = self.orig;
                var $3483 = self.expr;
                var $3484 = Fm$Term$equal$extra_holes$($3483, _b$2);
                var $2703 = $3484;
                break;
        };
        return $2703;
    };
    const Fm$Term$equal$extra_holes = x0 => x1 => Fm$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $3485 = Map$set$(_bits$1, Unit$new, _set$2);
        return $3485;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $3487 = _b$2;
            var $3486 = $3487;
        } else {
            var $3488 = (!_b$2);
            var $3486 = $3488;
        };
        return $3486;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Fm$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Fm$Term$serialize$(Fm$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$e);
        var _bh$7 = Fm$Term$serialize$(Fm$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $3490 = Monad$pure$(Fm$Check$monad)(Bool$true);
            var $3489 = $3490;
        } else {
            var _a1$8 = Fm$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Fm$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Fm$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$e);
            var _bh$11 = Fm$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $3492 = Monad$pure$(Fm$Check$monad)(Bool$true);
                var $3491 = $3492;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = Set$has$(_id$12, _seen$5);
                if (self) {
                    var $3494 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$(_a$1, _b$2))((_$13 => {
                        var $3495 = Monad$pure$(Fm$Check$monad)(Bool$true);
                        return $3495;
                    }));
                    var $3493 = $3494;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Fm.Term.var':
                            var $3497 = self.name;
                            var $3498 = self.indx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3500 = self.name;
                                    var $3501 = self.indx;
                                    var $3502 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3502;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3503 = self.name;
                                    var $3504 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3504;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3505 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3505;
                                    break;
                                case 'Fm.Term.all':
                                    var $3506 = self.eras;
                                    var $3507 = self.self;
                                    var $3508 = self.name;
                                    var $3509 = self.xtyp;
                                    var $3510 = self.body;
                                    var $3511 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3511;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3512 = self.name;
                                    var $3513 = self.body;
                                    var $3514 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3514;
                                    break;
                                case 'Fm.Term.app':
                                    var $3515 = self.func;
                                    var $3516 = self.argm;
                                    var $3517 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3517;
                                    break;
                                case 'Fm.Term.let':
                                    var $3518 = self.name;
                                    var $3519 = self.expr;
                                    var $3520 = self.body;
                                    var $3521 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3521;
                                    break;
                                case 'Fm.Term.def':
                                    var $3522 = self.name;
                                    var $3523 = self.expr;
                                    var $3524 = self.body;
                                    var $3525 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3525;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3526 = self.done;
                                    var $3527 = self.term;
                                    var $3528 = self.type;
                                    var $3529 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3529;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3530 = self.name;
                                    var $3531 = self.dref;
                                    var $3532 = self.verb;
                                    var $3533 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3533;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3534 = self.path;
                                    var $3535 = Fm$Term$equal$patch$($3534, _a$1, Bool$true);
                                    var $3499 = $3535;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3536 = self.natx;
                                    var $3537 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3537;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3538 = self.chrx;
                                    var $3539 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3539;
                                    break;
                                case 'Fm.Term.str':
                                    var $3540 = self.strx;
                                    var $3541 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3541;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3542 = self.path;
                                    var $3543 = self.expr;
                                    var $3544 = self.name;
                                    var $3545 = self.with;
                                    var $3546 = self.cses;
                                    var $3547 = self.moti;
                                    var $3548 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3548;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3549 = self.orig;
                                    var $3550 = self.expr;
                                    var $3551 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3499 = $3551;
                                    break;
                            };
                            var $3496 = $3499;
                            break;
                        case 'Fm.Term.ref':
                            var $3552 = self.name;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3554 = self.name;
                                    var $3555 = self.indx;
                                    var $3556 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3556;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3557 = self.name;
                                    var $3558 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3558;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3559 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3559;
                                    break;
                                case 'Fm.Term.all':
                                    var $3560 = self.eras;
                                    var $3561 = self.self;
                                    var $3562 = self.name;
                                    var $3563 = self.xtyp;
                                    var $3564 = self.body;
                                    var $3565 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3565;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3566 = self.name;
                                    var $3567 = self.body;
                                    var $3568 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3568;
                                    break;
                                case 'Fm.Term.app':
                                    var $3569 = self.func;
                                    var $3570 = self.argm;
                                    var $3571 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3571;
                                    break;
                                case 'Fm.Term.let':
                                    var $3572 = self.name;
                                    var $3573 = self.expr;
                                    var $3574 = self.body;
                                    var $3575 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3575;
                                    break;
                                case 'Fm.Term.def':
                                    var $3576 = self.name;
                                    var $3577 = self.expr;
                                    var $3578 = self.body;
                                    var $3579 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3579;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3580 = self.done;
                                    var $3581 = self.term;
                                    var $3582 = self.type;
                                    var $3583 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3583;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3584 = self.name;
                                    var $3585 = self.dref;
                                    var $3586 = self.verb;
                                    var $3587 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3587;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3588 = self.path;
                                    var $3589 = Fm$Term$equal$patch$($3588, _a$1, Bool$true);
                                    var $3553 = $3589;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3590 = self.natx;
                                    var $3591 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3591;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3592 = self.chrx;
                                    var $3593 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3593;
                                    break;
                                case 'Fm.Term.str':
                                    var $3594 = self.strx;
                                    var $3595 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3595;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3596 = self.path;
                                    var $3597 = self.expr;
                                    var $3598 = self.name;
                                    var $3599 = self.with;
                                    var $3600 = self.cses;
                                    var $3601 = self.moti;
                                    var $3602 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3602;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3603 = self.orig;
                                    var $3604 = self.expr;
                                    var $3605 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3553 = $3605;
                                    break;
                            };
                            var $3496 = $3553;
                            break;
                        case 'Fm.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3607 = self.name;
                                    var $3608 = self.indx;
                                    var $3609 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3609;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3610 = self.name;
                                    var $3611 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3611;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3612 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3612;
                                    break;
                                case 'Fm.Term.all':
                                    var $3613 = self.eras;
                                    var $3614 = self.self;
                                    var $3615 = self.name;
                                    var $3616 = self.xtyp;
                                    var $3617 = self.body;
                                    var $3618 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3618;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3619 = self.name;
                                    var $3620 = self.body;
                                    var $3621 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3621;
                                    break;
                                case 'Fm.Term.app':
                                    var $3622 = self.func;
                                    var $3623 = self.argm;
                                    var $3624 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3624;
                                    break;
                                case 'Fm.Term.let':
                                    var $3625 = self.name;
                                    var $3626 = self.expr;
                                    var $3627 = self.body;
                                    var $3628 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3628;
                                    break;
                                case 'Fm.Term.def':
                                    var $3629 = self.name;
                                    var $3630 = self.expr;
                                    var $3631 = self.body;
                                    var $3632 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3632;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3633 = self.done;
                                    var $3634 = self.term;
                                    var $3635 = self.type;
                                    var $3636 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3636;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3637 = self.name;
                                    var $3638 = self.dref;
                                    var $3639 = self.verb;
                                    var $3640 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3640;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3641 = self.path;
                                    var $3642 = Fm$Term$equal$patch$($3641, _a$1, Bool$true);
                                    var $3606 = $3642;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3643 = self.natx;
                                    var $3644 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3644;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3645 = self.chrx;
                                    var $3646 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3646;
                                    break;
                                case 'Fm.Term.str':
                                    var $3647 = self.strx;
                                    var $3648 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3648;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3649 = self.path;
                                    var $3650 = self.expr;
                                    var $3651 = self.name;
                                    var $3652 = self.with;
                                    var $3653 = self.cses;
                                    var $3654 = self.moti;
                                    var $3655 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3655;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3656 = self.orig;
                                    var $3657 = self.expr;
                                    var $3658 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3606 = $3658;
                                    break;
                            };
                            var $3496 = $3606;
                            break;
                        case 'Fm.Term.all':
                            var $3659 = self.eras;
                            var $3660 = self.self;
                            var $3661 = self.name;
                            var $3662 = self.xtyp;
                            var $3663 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3665 = self.name;
                                    var $3666 = self.indx;
                                    var $3667 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3667;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3668 = self.name;
                                    var $3669 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3669;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3670 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3670;
                                    break;
                                case 'Fm.Term.all':
                                    var $3671 = self.eras;
                                    var $3672 = self.self;
                                    var $3673 = self.name;
                                    var $3674 = self.xtyp;
                                    var $3675 = self.body;
                                    var _seen$23 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$24 = $3663(Fm$Term$var$($3660, _lv$4))(Fm$Term$var$($3661, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $3675(Fm$Term$var$($3672, _lv$4))(Fm$Term$var$($3673, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($3660 === $3672);
                                    var _eq_eras$27 = Bool$eql$($3659, $3671);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var $3677 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3662, $3674, _defs$3, _lv$4, _seen$23))((_eq_type$28 => {
                                            var $3678 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23))((_eq_body$29 => {
                                                var $3679 = Monad$pure$(Fm$Check$monad)((_eq_type$28 && _eq_body$29));
                                                return $3679;
                                            }));
                                            return $3678;
                                        }));
                                        var $3676 = $3677;
                                    } else {
                                        var $3680 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                        var $3676 = $3680;
                                    };
                                    var $3664 = $3676;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3681 = self.name;
                                    var $3682 = self.body;
                                    var $3683 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3683;
                                    break;
                                case 'Fm.Term.app':
                                    var $3684 = self.func;
                                    var $3685 = self.argm;
                                    var $3686 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3686;
                                    break;
                                case 'Fm.Term.let':
                                    var $3687 = self.name;
                                    var $3688 = self.expr;
                                    var $3689 = self.body;
                                    var $3690 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3690;
                                    break;
                                case 'Fm.Term.def':
                                    var $3691 = self.name;
                                    var $3692 = self.expr;
                                    var $3693 = self.body;
                                    var $3694 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3694;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3695 = self.done;
                                    var $3696 = self.term;
                                    var $3697 = self.type;
                                    var $3698 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3698;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3699 = self.name;
                                    var $3700 = self.dref;
                                    var $3701 = self.verb;
                                    var $3702 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3702;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3703 = self.path;
                                    var $3704 = Fm$Term$equal$patch$($3703, _a$1, Bool$true);
                                    var $3664 = $3704;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3705 = self.natx;
                                    var $3706 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3706;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3707 = self.chrx;
                                    var $3708 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3708;
                                    break;
                                case 'Fm.Term.str':
                                    var $3709 = self.strx;
                                    var $3710 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3710;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3711 = self.path;
                                    var $3712 = self.expr;
                                    var $3713 = self.name;
                                    var $3714 = self.with;
                                    var $3715 = self.cses;
                                    var $3716 = self.moti;
                                    var $3717 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3717;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3718 = self.orig;
                                    var $3719 = self.expr;
                                    var $3720 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3664 = $3720;
                                    break;
                            };
                            var $3496 = $3664;
                            break;
                        case 'Fm.Term.lam':
                            var $3721 = self.name;
                            var $3722 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3724 = self.name;
                                    var $3725 = self.indx;
                                    var $3726 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3726;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3727 = self.name;
                                    var $3728 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3728;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3729 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3729;
                                    break;
                                case 'Fm.Term.all':
                                    var $3730 = self.eras;
                                    var $3731 = self.self;
                                    var $3732 = self.name;
                                    var $3733 = self.xtyp;
                                    var $3734 = self.body;
                                    var $3735 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3735;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3736 = self.name;
                                    var $3737 = self.body;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$18 = $3722(Fm$Term$var$($3721, _lv$4));
                                    var _b1_body$19 = $3737(Fm$Term$var$($3736, _lv$4));
                                    var $3738 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17))((_eq_body$20 => {
                                        var $3739 = Monad$pure$(Fm$Check$monad)(_eq_body$20);
                                        return $3739;
                                    }));
                                    var $3723 = $3738;
                                    break;
                                case 'Fm.Term.app':
                                    var $3740 = self.func;
                                    var $3741 = self.argm;
                                    var $3742 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3742;
                                    break;
                                case 'Fm.Term.let':
                                    var $3743 = self.name;
                                    var $3744 = self.expr;
                                    var $3745 = self.body;
                                    var $3746 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3746;
                                    break;
                                case 'Fm.Term.def':
                                    var $3747 = self.name;
                                    var $3748 = self.expr;
                                    var $3749 = self.body;
                                    var $3750 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3750;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3751 = self.done;
                                    var $3752 = self.term;
                                    var $3753 = self.type;
                                    var $3754 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3754;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3755 = self.name;
                                    var $3756 = self.dref;
                                    var $3757 = self.verb;
                                    var $3758 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3758;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3759 = self.path;
                                    var $3760 = Fm$Term$equal$patch$($3759, _a$1, Bool$true);
                                    var $3723 = $3760;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3761 = self.natx;
                                    var $3762 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3762;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3763 = self.chrx;
                                    var $3764 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3764;
                                    break;
                                case 'Fm.Term.str':
                                    var $3765 = self.strx;
                                    var $3766 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3766;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3767 = self.path;
                                    var $3768 = self.expr;
                                    var $3769 = self.name;
                                    var $3770 = self.with;
                                    var $3771 = self.cses;
                                    var $3772 = self.moti;
                                    var $3773 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3773;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3774 = self.orig;
                                    var $3775 = self.expr;
                                    var $3776 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3723 = $3776;
                                    break;
                            };
                            var $3496 = $3723;
                            break;
                        case 'Fm.Term.app':
                            var $3777 = self.func;
                            var $3778 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3780 = self.name;
                                    var $3781 = self.indx;
                                    var $3782 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3782;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3783 = self.name;
                                    var $3784 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3784;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3785 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3785;
                                    break;
                                case 'Fm.Term.all':
                                    var $3786 = self.eras;
                                    var $3787 = self.self;
                                    var $3788 = self.name;
                                    var $3789 = self.xtyp;
                                    var $3790 = self.body;
                                    var $3791 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3791;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3792 = self.name;
                                    var $3793 = self.body;
                                    var $3794 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3794;
                                    break;
                                case 'Fm.Term.app':
                                    var $3795 = self.func;
                                    var $3796 = self.argm;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var $3797 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3777, $3795, _defs$3, _lv$4, _seen$17))((_eq_func$18 => {
                                        var $3798 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3778, $3796, _defs$3, _lv$4, _seen$17))((_eq_argm$19 => {
                                            var $3799 = Monad$pure$(Fm$Check$monad)((_eq_func$18 && _eq_argm$19));
                                            return $3799;
                                        }));
                                        return $3798;
                                    }));
                                    var $3779 = $3797;
                                    break;
                                case 'Fm.Term.let':
                                    var $3800 = self.name;
                                    var $3801 = self.expr;
                                    var $3802 = self.body;
                                    var $3803 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3803;
                                    break;
                                case 'Fm.Term.def':
                                    var $3804 = self.name;
                                    var $3805 = self.expr;
                                    var $3806 = self.body;
                                    var $3807 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3807;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3808 = self.done;
                                    var $3809 = self.term;
                                    var $3810 = self.type;
                                    var $3811 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3811;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3812 = self.name;
                                    var $3813 = self.dref;
                                    var $3814 = self.verb;
                                    var $3815 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3815;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3816 = self.path;
                                    var $3817 = Fm$Term$equal$patch$($3816, _a$1, Bool$true);
                                    var $3779 = $3817;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3818 = self.natx;
                                    var $3819 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3819;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3820 = self.chrx;
                                    var $3821 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3821;
                                    break;
                                case 'Fm.Term.str':
                                    var $3822 = self.strx;
                                    var $3823 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3823;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3824 = self.path;
                                    var $3825 = self.expr;
                                    var $3826 = self.name;
                                    var $3827 = self.with;
                                    var $3828 = self.cses;
                                    var $3829 = self.moti;
                                    var $3830 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3830;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3831 = self.orig;
                                    var $3832 = self.expr;
                                    var $3833 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3779 = $3833;
                                    break;
                            };
                            var $3496 = $3779;
                            break;
                        case 'Fm.Term.let':
                            var $3834 = self.name;
                            var $3835 = self.expr;
                            var $3836 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3838 = self.name;
                                    var $3839 = self.indx;
                                    var $3840 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3840;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3841 = self.name;
                                    var $3842 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3842;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3843 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3843;
                                    break;
                                case 'Fm.Term.all':
                                    var $3844 = self.eras;
                                    var $3845 = self.self;
                                    var $3846 = self.name;
                                    var $3847 = self.xtyp;
                                    var $3848 = self.body;
                                    var $3849 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3849;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3850 = self.name;
                                    var $3851 = self.body;
                                    var $3852 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3852;
                                    break;
                                case 'Fm.Term.app':
                                    var $3853 = self.func;
                                    var $3854 = self.argm;
                                    var $3855 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3855;
                                    break;
                                case 'Fm.Term.let':
                                    var $3856 = self.name;
                                    var $3857 = self.expr;
                                    var $3858 = self.body;
                                    var _seen$19 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$20 = $3836(Fm$Term$var$($3834, _lv$4));
                                    var _b1_body$21 = $3858(Fm$Term$var$($3856, _lv$4));
                                    var $3859 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3835, $3857, _defs$3, _lv$4, _seen$19))((_eq_expr$22 => {
                                        var $3860 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19))((_eq_body$23 => {
                                            var $3861 = Monad$pure$(Fm$Check$monad)((_eq_expr$22 && _eq_body$23));
                                            return $3861;
                                        }));
                                        return $3860;
                                    }));
                                    var $3837 = $3859;
                                    break;
                                case 'Fm.Term.def':
                                    var $3862 = self.name;
                                    var $3863 = self.expr;
                                    var $3864 = self.body;
                                    var $3865 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3865;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3866 = self.done;
                                    var $3867 = self.term;
                                    var $3868 = self.type;
                                    var $3869 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3869;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3870 = self.name;
                                    var $3871 = self.dref;
                                    var $3872 = self.verb;
                                    var $3873 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3873;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3874 = self.path;
                                    var $3875 = Fm$Term$equal$patch$($3874, _a$1, Bool$true);
                                    var $3837 = $3875;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3876 = self.natx;
                                    var $3877 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3877;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3878 = self.chrx;
                                    var $3879 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3879;
                                    break;
                                case 'Fm.Term.str':
                                    var $3880 = self.strx;
                                    var $3881 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3881;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3882 = self.path;
                                    var $3883 = self.expr;
                                    var $3884 = self.name;
                                    var $3885 = self.with;
                                    var $3886 = self.cses;
                                    var $3887 = self.moti;
                                    var $3888 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3888;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3889 = self.orig;
                                    var $3890 = self.expr;
                                    var $3891 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3837 = $3891;
                                    break;
                            };
                            var $3496 = $3837;
                            break;
                        case 'Fm.Term.def':
                            var $3892 = self.name;
                            var $3893 = self.expr;
                            var $3894 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3896 = self.name;
                                    var $3897 = self.indx;
                                    var $3898 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3898;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3899 = self.name;
                                    var $3900 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3900;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3901 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3901;
                                    break;
                                case 'Fm.Term.all':
                                    var $3902 = self.eras;
                                    var $3903 = self.self;
                                    var $3904 = self.name;
                                    var $3905 = self.xtyp;
                                    var $3906 = self.body;
                                    var $3907 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3907;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3908 = self.name;
                                    var $3909 = self.body;
                                    var $3910 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3910;
                                    break;
                                case 'Fm.Term.app':
                                    var $3911 = self.func;
                                    var $3912 = self.argm;
                                    var $3913 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3913;
                                    break;
                                case 'Fm.Term.let':
                                    var $3914 = self.name;
                                    var $3915 = self.expr;
                                    var $3916 = self.body;
                                    var $3917 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3917;
                                    break;
                                case 'Fm.Term.def':
                                    var $3918 = self.name;
                                    var $3919 = self.expr;
                                    var $3920 = self.body;
                                    var $3921 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3921;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3922 = self.done;
                                    var $3923 = self.term;
                                    var $3924 = self.type;
                                    var $3925 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3925;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3926 = self.name;
                                    var $3927 = self.dref;
                                    var $3928 = self.verb;
                                    var $3929 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3929;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3930 = self.path;
                                    var $3931 = Fm$Term$equal$patch$($3930, _a$1, Bool$true);
                                    var $3895 = $3931;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3932 = self.natx;
                                    var $3933 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3933;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3934 = self.chrx;
                                    var $3935 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3935;
                                    break;
                                case 'Fm.Term.str':
                                    var $3936 = self.strx;
                                    var $3937 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3937;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3938 = self.path;
                                    var $3939 = self.expr;
                                    var $3940 = self.name;
                                    var $3941 = self.with;
                                    var $3942 = self.cses;
                                    var $3943 = self.moti;
                                    var $3944 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3944;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3945 = self.orig;
                                    var $3946 = self.expr;
                                    var $3947 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3895 = $3947;
                                    break;
                            };
                            var $3496 = $3895;
                            break;
                        case 'Fm.Term.ann':
                            var $3948 = self.done;
                            var $3949 = self.term;
                            var $3950 = self.type;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3952 = self.name;
                                    var $3953 = self.indx;
                                    var $3954 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3954;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3955 = self.name;
                                    var $3956 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3956;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3957 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3957;
                                    break;
                                case 'Fm.Term.all':
                                    var $3958 = self.eras;
                                    var $3959 = self.self;
                                    var $3960 = self.name;
                                    var $3961 = self.xtyp;
                                    var $3962 = self.body;
                                    var $3963 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3963;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3964 = self.name;
                                    var $3965 = self.body;
                                    var $3966 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3966;
                                    break;
                                case 'Fm.Term.app':
                                    var $3967 = self.func;
                                    var $3968 = self.argm;
                                    var $3969 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3969;
                                    break;
                                case 'Fm.Term.let':
                                    var $3970 = self.name;
                                    var $3971 = self.expr;
                                    var $3972 = self.body;
                                    var $3973 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3973;
                                    break;
                                case 'Fm.Term.def':
                                    var $3974 = self.name;
                                    var $3975 = self.expr;
                                    var $3976 = self.body;
                                    var $3977 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3977;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3978 = self.done;
                                    var $3979 = self.term;
                                    var $3980 = self.type;
                                    var $3981 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3981;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3982 = self.name;
                                    var $3983 = self.dref;
                                    var $3984 = self.verb;
                                    var $3985 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3985;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3986 = self.path;
                                    var $3987 = Fm$Term$equal$patch$($3986, _a$1, Bool$true);
                                    var $3951 = $3987;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3988 = self.natx;
                                    var $3989 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3989;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3990 = self.chrx;
                                    var $3991 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3991;
                                    break;
                                case 'Fm.Term.str':
                                    var $3992 = self.strx;
                                    var $3993 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $3993;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3994 = self.path;
                                    var $3995 = self.expr;
                                    var $3996 = self.name;
                                    var $3997 = self.with;
                                    var $3998 = self.cses;
                                    var $3999 = self.moti;
                                    var $4000 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $4000;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4001 = self.orig;
                                    var $4002 = self.expr;
                                    var $4003 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3951 = $4003;
                                    break;
                            };
                            var $3496 = $3951;
                            break;
                        case 'Fm.Term.gol':
                            var $4004 = self.name;
                            var $4005 = self.dref;
                            var $4006 = self.verb;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4008 = self.name;
                                    var $4009 = self.indx;
                                    var $4010 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4010;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4011 = self.name;
                                    var $4012 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4012;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4013 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4013;
                                    break;
                                case 'Fm.Term.all':
                                    var $4014 = self.eras;
                                    var $4015 = self.self;
                                    var $4016 = self.name;
                                    var $4017 = self.xtyp;
                                    var $4018 = self.body;
                                    var $4019 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4019;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4020 = self.name;
                                    var $4021 = self.body;
                                    var $4022 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4022;
                                    break;
                                case 'Fm.Term.app':
                                    var $4023 = self.func;
                                    var $4024 = self.argm;
                                    var $4025 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4025;
                                    break;
                                case 'Fm.Term.let':
                                    var $4026 = self.name;
                                    var $4027 = self.expr;
                                    var $4028 = self.body;
                                    var $4029 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4029;
                                    break;
                                case 'Fm.Term.def':
                                    var $4030 = self.name;
                                    var $4031 = self.expr;
                                    var $4032 = self.body;
                                    var $4033 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4033;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4034 = self.done;
                                    var $4035 = self.term;
                                    var $4036 = self.type;
                                    var $4037 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4037;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4038 = self.name;
                                    var $4039 = self.dref;
                                    var $4040 = self.verb;
                                    var $4041 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4041;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4042 = self.path;
                                    var $4043 = Fm$Term$equal$patch$($4042, _a$1, Bool$true);
                                    var $4007 = $4043;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4044 = self.natx;
                                    var $4045 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4045;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4046 = self.chrx;
                                    var $4047 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4047;
                                    break;
                                case 'Fm.Term.str':
                                    var $4048 = self.strx;
                                    var $4049 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4049;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4050 = self.path;
                                    var $4051 = self.expr;
                                    var $4052 = self.name;
                                    var $4053 = self.with;
                                    var $4054 = self.cses;
                                    var $4055 = self.moti;
                                    var $4056 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4056;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4057 = self.orig;
                                    var $4058 = self.expr;
                                    var $4059 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4007 = $4059;
                                    break;
                            };
                            var $3496 = $4007;
                            break;
                        case 'Fm.Term.hol':
                            var $4060 = self.path;
                            var $4061 = Fm$Term$equal$patch$($4060, _b$2, Bool$true);
                            var $3496 = $4061;
                            break;
                        case 'Fm.Term.nat':
                            var $4062 = self.natx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4064 = self.name;
                                    var $4065 = self.indx;
                                    var $4066 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4066;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4067 = self.name;
                                    var $4068 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4068;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4069 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4069;
                                    break;
                                case 'Fm.Term.all':
                                    var $4070 = self.eras;
                                    var $4071 = self.self;
                                    var $4072 = self.name;
                                    var $4073 = self.xtyp;
                                    var $4074 = self.body;
                                    var $4075 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4075;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4076 = self.name;
                                    var $4077 = self.body;
                                    var $4078 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4078;
                                    break;
                                case 'Fm.Term.app':
                                    var $4079 = self.func;
                                    var $4080 = self.argm;
                                    var $4081 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4081;
                                    break;
                                case 'Fm.Term.let':
                                    var $4082 = self.name;
                                    var $4083 = self.expr;
                                    var $4084 = self.body;
                                    var $4085 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4085;
                                    break;
                                case 'Fm.Term.def':
                                    var $4086 = self.name;
                                    var $4087 = self.expr;
                                    var $4088 = self.body;
                                    var $4089 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4089;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4090 = self.done;
                                    var $4091 = self.term;
                                    var $4092 = self.type;
                                    var $4093 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4093;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4094 = self.name;
                                    var $4095 = self.dref;
                                    var $4096 = self.verb;
                                    var $4097 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4097;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4098 = self.path;
                                    var $4099 = Fm$Term$equal$patch$($4098, _a$1, Bool$true);
                                    var $4063 = $4099;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4100 = self.natx;
                                    var $4101 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4101;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4102 = self.chrx;
                                    var $4103 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4103;
                                    break;
                                case 'Fm.Term.str':
                                    var $4104 = self.strx;
                                    var $4105 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4105;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4106 = self.path;
                                    var $4107 = self.expr;
                                    var $4108 = self.name;
                                    var $4109 = self.with;
                                    var $4110 = self.cses;
                                    var $4111 = self.moti;
                                    var $4112 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4112;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4113 = self.orig;
                                    var $4114 = self.expr;
                                    var $4115 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4063 = $4115;
                                    break;
                            };
                            var $3496 = $4063;
                            break;
                        case 'Fm.Term.chr':
                            var $4116 = self.chrx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4118 = self.name;
                                    var $4119 = self.indx;
                                    var $4120 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4120;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4121 = self.name;
                                    var $4122 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4122;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4123 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4123;
                                    break;
                                case 'Fm.Term.all':
                                    var $4124 = self.eras;
                                    var $4125 = self.self;
                                    var $4126 = self.name;
                                    var $4127 = self.xtyp;
                                    var $4128 = self.body;
                                    var $4129 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4129;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4130 = self.name;
                                    var $4131 = self.body;
                                    var $4132 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4132;
                                    break;
                                case 'Fm.Term.app':
                                    var $4133 = self.func;
                                    var $4134 = self.argm;
                                    var $4135 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4135;
                                    break;
                                case 'Fm.Term.let':
                                    var $4136 = self.name;
                                    var $4137 = self.expr;
                                    var $4138 = self.body;
                                    var $4139 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4139;
                                    break;
                                case 'Fm.Term.def':
                                    var $4140 = self.name;
                                    var $4141 = self.expr;
                                    var $4142 = self.body;
                                    var $4143 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4143;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4144 = self.done;
                                    var $4145 = self.term;
                                    var $4146 = self.type;
                                    var $4147 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4147;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4148 = self.name;
                                    var $4149 = self.dref;
                                    var $4150 = self.verb;
                                    var $4151 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4151;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4152 = self.path;
                                    var $4153 = Fm$Term$equal$patch$($4152, _a$1, Bool$true);
                                    var $4117 = $4153;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4154 = self.natx;
                                    var $4155 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4155;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4156 = self.chrx;
                                    var $4157 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4157;
                                    break;
                                case 'Fm.Term.str':
                                    var $4158 = self.strx;
                                    var $4159 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4159;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4160 = self.path;
                                    var $4161 = self.expr;
                                    var $4162 = self.name;
                                    var $4163 = self.with;
                                    var $4164 = self.cses;
                                    var $4165 = self.moti;
                                    var $4166 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4166;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4167 = self.orig;
                                    var $4168 = self.expr;
                                    var $4169 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4117 = $4169;
                                    break;
                            };
                            var $3496 = $4117;
                            break;
                        case 'Fm.Term.str':
                            var $4170 = self.strx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4172 = self.name;
                                    var $4173 = self.indx;
                                    var $4174 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4174;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4175 = self.name;
                                    var $4176 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4176;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4177 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4177;
                                    break;
                                case 'Fm.Term.all':
                                    var $4178 = self.eras;
                                    var $4179 = self.self;
                                    var $4180 = self.name;
                                    var $4181 = self.xtyp;
                                    var $4182 = self.body;
                                    var $4183 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4183;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4184 = self.name;
                                    var $4185 = self.body;
                                    var $4186 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4186;
                                    break;
                                case 'Fm.Term.app':
                                    var $4187 = self.func;
                                    var $4188 = self.argm;
                                    var $4189 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4189;
                                    break;
                                case 'Fm.Term.let':
                                    var $4190 = self.name;
                                    var $4191 = self.expr;
                                    var $4192 = self.body;
                                    var $4193 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4193;
                                    break;
                                case 'Fm.Term.def':
                                    var $4194 = self.name;
                                    var $4195 = self.expr;
                                    var $4196 = self.body;
                                    var $4197 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4197;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4198 = self.done;
                                    var $4199 = self.term;
                                    var $4200 = self.type;
                                    var $4201 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4201;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4202 = self.name;
                                    var $4203 = self.dref;
                                    var $4204 = self.verb;
                                    var $4205 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4205;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4206 = self.path;
                                    var $4207 = Fm$Term$equal$patch$($4206, _a$1, Bool$true);
                                    var $4171 = $4207;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4208 = self.natx;
                                    var $4209 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4209;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4210 = self.chrx;
                                    var $4211 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4211;
                                    break;
                                case 'Fm.Term.str':
                                    var $4212 = self.strx;
                                    var $4213 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4213;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4214 = self.path;
                                    var $4215 = self.expr;
                                    var $4216 = self.name;
                                    var $4217 = self.with;
                                    var $4218 = self.cses;
                                    var $4219 = self.moti;
                                    var $4220 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4220;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4221 = self.orig;
                                    var $4222 = self.expr;
                                    var $4223 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4171 = $4223;
                                    break;
                            };
                            var $3496 = $4171;
                            break;
                        case 'Fm.Term.cse':
                            var $4224 = self.path;
                            var $4225 = self.expr;
                            var $4226 = self.name;
                            var $4227 = self.with;
                            var $4228 = self.cses;
                            var $4229 = self.moti;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4231 = self.name;
                                    var $4232 = self.indx;
                                    var $4233 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4233;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4234 = self.name;
                                    var $4235 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4235;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4236 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4236;
                                    break;
                                case 'Fm.Term.all':
                                    var $4237 = self.eras;
                                    var $4238 = self.self;
                                    var $4239 = self.name;
                                    var $4240 = self.xtyp;
                                    var $4241 = self.body;
                                    var $4242 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4242;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4243 = self.name;
                                    var $4244 = self.body;
                                    var $4245 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4245;
                                    break;
                                case 'Fm.Term.app':
                                    var $4246 = self.func;
                                    var $4247 = self.argm;
                                    var $4248 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4248;
                                    break;
                                case 'Fm.Term.let':
                                    var $4249 = self.name;
                                    var $4250 = self.expr;
                                    var $4251 = self.body;
                                    var $4252 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4252;
                                    break;
                                case 'Fm.Term.def':
                                    var $4253 = self.name;
                                    var $4254 = self.expr;
                                    var $4255 = self.body;
                                    var $4256 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4256;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4257 = self.done;
                                    var $4258 = self.term;
                                    var $4259 = self.type;
                                    var $4260 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4260;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4261 = self.name;
                                    var $4262 = self.dref;
                                    var $4263 = self.verb;
                                    var $4264 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4264;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4265 = self.path;
                                    var $4266 = Fm$Term$equal$patch$($4265, _a$1, Bool$true);
                                    var $4230 = $4266;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4267 = self.natx;
                                    var $4268 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4268;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4269 = self.chrx;
                                    var $4270 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4270;
                                    break;
                                case 'Fm.Term.str':
                                    var $4271 = self.strx;
                                    var $4272 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4272;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4273 = self.path;
                                    var $4274 = self.expr;
                                    var $4275 = self.name;
                                    var $4276 = self.with;
                                    var $4277 = self.cses;
                                    var $4278 = self.moti;
                                    var $4279 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4279;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4280 = self.orig;
                                    var $4281 = self.expr;
                                    var $4282 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4230 = $4282;
                                    break;
                            };
                            var $3496 = $4230;
                            break;
                        case 'Fm.Term.ori':
                            var $4283 = self.orig;
                            var $4284 = self.expr;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4286 = self.name;
                                    var $4287 = self.indx;
                                    var $4288 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4288;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4289 = self.name;
                                    var $4290 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4290;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4291 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4291;
                                    break;
                                case 'Fm.Term.all':
                                    var $4292 = self.eras;
                                    var $4293 = self.self;
                                    var $4294 = self.name;
                                    var $4295 = self.xtyp;
                                    var $4296 = self.body;
                                    var $4297 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4297;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4298 = self.name;
                                    var $4299 = self.body;
                                    var $4300 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4300;
                                    break;
                                case 'Fm.Term.app':
                                    var $4301 = self.func;
                                    var $4302 = self.argm;
                                    var $4303 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4303;
                                    break;
                                case 'Fm.Term.let':
                                    var $4304 = self.name;
                                    var $4305 = self.expr;
                                    var $4306 = self.body;
                                    var $4307 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4307;
                                    break;
                                case 'Fm.Term.def':
                                    var $4308 = self.name;
                                    var $4309 = self.expr;
                                    var $4310 = self.body;
                                    var $4311 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4311;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4312 = self.done;
                                    var $4313 = self.term;
                                    var $4314 = self.type;
                                    var $4315 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4315;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4316 = self.name;
                                    var $4317 = self.dref;
                                    var $4318 = self.verb;
                                    var $4319 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4319;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4320 = self.path;
                                    var $4321 = Fm$Term$equal$patch$($4320, _a$1, Bool$true);
                                    var $4285 = $4321;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4322 = self.natx;
                                    var $4323 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4323;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4324 = self.chrx;
                                    var $4325 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4325;
                                    break;
                                case 'Fm.Term.str':
                                    var $4326 = self.strx;
                                    var $4327 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4327;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4328 = self.path;
                                    var $4329 = self.expr;
                                    var $4330 = self.name;
                                    var $4331 = self.with;
                                    var $4332 = self.cses;
                                    var $4333 = self.moti;
                                    var $4334 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4334;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4335 = self.orig;
                                    var $4336 = self.expr;
                                    var $4337 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4285 = $4337;
                                    break;
                            };
                            var $3496 = $4285;
                            break;
                    };
                    var $3493 = $3496;
                };
                var $3491 = $3493;
            };
            var $3489 = $3491;
        };
        return $3489;
    };
    const Fm$Term$equal = x0 => x1 => x2 => x3 => x4 => Fm$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;

    function Fm$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var $4338 = Monad$bind$(Fm$Check$monad)((() => {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $4339 = self.name;
                    var $4340 = self.indx;
                    var self = List$at_last$($4340, _ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4342 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4339), List$nil));
                            var $4341 = $4342;
                            break;
                        case 'Maybe.some':
                            var $4343 = self.value;
                            var $4344 = Monad$pure$(Fm$Check$monad)((() => {
                                var self = $4343;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4345 = self.fst;
                                        var $4346 = self.snd;
                                        var $4347 = $4346;
                                        return $4347;
                                };
                            })());
                            var $4341 = $4344;
                            break;
                    };
                    return $4341;
                case 'Fm.Term.ref':
                    var $4348 = self.name;
                    var self = Fm$get$($4348, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4350 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4348), List$nil));
                            var $4349 = $4350;
                            break;
                        case 'Maybe.some':
                            var $4351 = self.value;
                            var self = $4351;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $4353 = self.file;
                                    var $4354 = self.code;
                                    var $4355 = self.name;
                                    var $4356 = self.term;
                                    var $4357 = self.type;
                                    var $4358 = self.stat;
                                    var _ref_name$15 = $4355;
                                    var _ref_type$16 = $4357;
                                    var _ref_term$17 = $4356;
                                    var _ref_stat$18 = $4358;
                                    var self = _ref_stat$18;
                                    switch (self._) {
                                        case 'Fm.Status.init':
                                            var $4360 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$waiting$(_ref_name$15), List$nil));
                                            var $4359 = $4360;
                                            break;
                                        case 'Fm.Status.wait':
                                            var $4361 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4359 = $4361;
                                            break;
                                        case 'Fm.Status.done':
                                            var $4362 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4359 = $4362;
                                            break;
                                        case 'Fm.Status.fail':
                                            var $4363 = self.errors;
                                            var $4364 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$indirect$(_ref_name$15), List$nil));
                                            var $4359 = $4364;
                                            break;
                                    };
                                    var $4352 = $4359;
                                    break;
                            };
                            var $4349 = $4352;
                            break;
                    };
                    return $4349;
                case 'Fm.Term.typ':
                    var $4365 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                    return $4365;
                case 'Fm.Term.all':
                    var $4366 = self.eras;
                    var $4367 = self.self;
                    var $4368 = self.name;
                    var $4369 = self.xtyp;
                    var $4370 = self.body;
                    var _ctx_size$12 = List$length$(_ctx$4);
                    var _self_var$13 = Fm$Term$var$($4367, _ctx_size$12);
                    var _body_var$14 = Fm$Term$var$($4368, Nat$succ$(_ctx_size$12));
                    var _body_ctx$15 = List$cons$(Pair$new$($4368, $4369), List$cons$(Pair$new$($4367, _term$1), _ctx$4));
                    var $4371 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4369, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$16 => {
                        var $4372 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4370(_self_var$13)(_body_var$14), Maybe$some$(Fm$Term$typ), _defs$3, _body_ctx$15, Fm$MPath$i$(_path$5), _orig$6))((_$17 => {
                            var $4373 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                            return $4373;
                        }));
                        return $4372;
                    }));
                    return $4371;
                case 'Fm.Term.lam':
                    var $4374 = self.name;
                    var $4375 = self.body;
                    var self = _type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4377 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                            var $4376 = $4377;
                            break;
                        case 'Maybe.some':
                            var $4378 = self.value;
                            var _typv$10 = Fm$Term$reduce$($4378, _defs$3);
                            var self = _typv$10;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4380 = self.name;
                                    var $4381 = self.indx;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4378);
                                    var $4382 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4379 = $4382;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4383 = self.name;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4378);
                                    var $4384 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4379 = $4384;
                                    break;
                                case 'Fm.Term.typ':
                                    var _expected$11 = Either$left$("Function");
                                    var _detected$12 = Either$right$($4378);
                                    var $4385 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                    var $4379 = $4385;
                                    break;
                                case 'Fm.Term.all':
                                    var $4386 = self.eras;
                                    var $4387 = self.self;
                                    var $4388 = self.name;
                                    var $4389 = self.xtyp;
                                    var $4390 = self.body;
                                    var _ctx_size$16 = List$length$(_ctx$4);
                                    var _self_var$17 = _term$1;
                                    var _body_var$18 = Fm$Term$var$($4374, _ctx_size$16);
                                    var _body_typ$19 = $4390(_self_var$17)(_body_var$18);
                                    var _body_ctx$20 = List$cons$(Pair$new$($4374, $4389), _ctx$4);
                                    var $4391 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4375(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Fm$MPath$o$(_path$5), _orig$6))((_$21 => {
                                        var $4392 = Monad$pure$(Fm$Check$monad)($4378);
                                        return $4392;
                                    }));
                                    var $4379 = $4391;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4393 = self.name;
                                    var $4394 = self.body;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4378);
                                    var $4395 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4379 = $4395;
                                    break;
                                case 'Fm.Term.app':
                                    var $4396 = self.func;
                                    var $4397 = self.argm;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4378);
                                    var $4398 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4379 = $4398;
                                    break;
                                case 'Fm.Term.let':
                                    var $4399 = self.name;
                                    var $4400 = self.expr;
                                    var $4401 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4378);
                                    var $4402 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4379 = $4402;
                                    break;
                                case 'Fm.Term.def':
                                    var $4403 = self.name;
                                    var $4404 = self.expr;
                                    var $4405 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4378);
                                    var $4406 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4379 = $4406;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4407 = self.done;
                                    var $4408 = self.term;
                                    var $4409 = self.type;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4378);
                                    var $4410 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4379 = $4410;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4411 = self.name;
                                    var $4412 = self.dref;
                                    var $4413 = self.verb;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4378);
                                    var $4414 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4379 = $4414;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4415 = self.path;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4378);
                                    var $4416 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4379 = $4416;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4417 = self.natx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4378);
                                    var $4418 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4379 = $4418;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4419 = self.chrx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4378);
                                    var $4420 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4379 = $4420;
                                    break;
                                case 'Fm.Term.str':
                                    var $4421 = self.strx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4378);
                                    var $4422 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4379 = $4422;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4423 = self.path;
                                    var $4424 = self.expr;
                                    var $4425 = self.name;
                                    var $4426 = self.with;
                                    var $4427 = self.cses;
                                    var $4428 = self.moti;
                                    var _expected$17 = Either$left$("Function");
                                    var _detected$18 = Either$right$($4378);
                                    var $4429 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                    var $4379 = $4429;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4430 = self.orig;
                                    var $4431 = self.expr;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4378);
                                    var $4432 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4379 = $4432;
                                    break;
                            };
                            var $4376 = $4379;
                            break;
                    };
                    return $4376;
                case 'Fm.Term.app':
                    var $4433 = self.func;
                    var $4434 = self.argm;
                    var $4435 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4433, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_func_typ$9 => {
                        var _func_typ$10 = Fm$Term$reduce$(_func_typ$9, _defs$3);
                        var self = _func_typ$10;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $4437 = self.name;
                                var $4438 = self.indx;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4439 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4436 = $4439;
                                break;
                            case 'Fm.Term.ref':
                                var $4440 = self.name;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4441 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4436 = $4441;
                                break;
                            case 'Fm.Term.typ':
                                var _expected$11 = Either$left$("Function");
                                var _detected$12 = Either$right$(_func_typ$10);
                                var $4442 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4436 = $4442;
                                break;
                            case 'Fm.Term.all':
                                var $4443 = self.eras;
                                var $4444 = self.self;
                                var $4445 = self.name;
                                var $4446 = self.xtyp;
                                var $4447 = self.body;
                                var $4448 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4434, Maybe$some$($4446), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$16 => {
                                    var $4449 = Monad$pure$(Fm$Check$monad)($4447($4433)($4434));
                                    return $4449;
                                }));
                                var $4436 = $4448;
                                break;
                            case 'Fm.Term.lam':
                                var $4450 = self.name;
                                var $4451 = self.body;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4452 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4436 = $4452;
                                break;
                            case 'Fm.Term.app':
                                var $4453 = self.func;
                                var $4454 = self.argm;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4455 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4436 = $4455;
                                break;
                            case 'Fm.Term.let':
                                var $4456 = self.name;
                                var $4457 = self.expr;
                                var $4458 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4459 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4436 = $4459;
                                break;
                            case 'Fm.Term.def':
                                var $4460 = self.name;
                                var $4461 = self.expr;
                                var $4462 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4463 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4436 = $4463;
                                break;
                            case 'Fm.Term.ann':
                                var $4464 = self.done;
                                var $4465 = self.term;
                                var $4466 = self.type;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4467 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4436 = $4467;
                                break;
                            case 'Fm.Term.gol':
                                var $4468 = self.name;
                                var $4469 = self.dref;
                                var $4470 = self.verb;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4471 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4436 = $4471;
                                break;
                            case 'Fm.Term.hol':
                                var $4472 = self.path;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4473 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4436 = $4473;
                                break;
                            case 'Fm.Term.nat':
                                var $4474 = self.natx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4475 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4436 = $4475;
                                break;
                            case 'Fm.Term.chr':
                                var $4476 = self.chrx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4477 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4436 = $4477;
                                break;
                            case 'Fm.Term.str':
                                var $4478 = self.strx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4479 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4436 = $4479;
                                break;
                            case 'Fm.Term.cse':
                                var $4480 = self.path;
                                var $4481 = self.expr;
                                var $4482 = self.name;
                                var $4483 = self.with;
                                var $4484 = self.cses;
                                var $4485 = self.moti;
                                var _expected$17 = Either$left$("Function");
                                var _detected$18 = Either$right$(_func_typ$10);
                                var $4486 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4436 = $4486;
                                break;
                            case 'Fm.Term.ori':
                                var $4487 = self.orig;
                                var $4488 = self.expr;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4489 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4436 = $4489;
                                break;
                        };
                        return $4436;
                    }));
                    return $4435;
                case 'Fm.Term.let':
                    var $4490 = self.name;
                    var $4491 = self.expr;
                    var $4492 = self.body;
                    var _ctx_size$10 = List$length$(_ctx$4);
                    var $4493 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4491, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_expr_typ$11 => {
                        var _body_val$12 = $4492(Fm$Term$var$($4490, _ctx_size$10));
                        var _body_ctx$13 = List$cons$(Pair$new$($4490, _expr_typ$11), _ctx$4);
                        var $4494 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_body_val$12, _type$2, _defs$3, _body_ctx$13, Fm$MPath$i$(_path$5), _orig$6))((_body_typ$14 => {
                            var $4495 = Monad$pure$(Fm$Check$monad)(_body_typ$14);
                            return $4495;
                        }));
                        return $4494;
                    }));
                    return $4493;
                case 'Fm.Term.def':
                    var $4496 = self.name;
                    var $4497 = self.expr;
                    var $4498 = self.body;
                    var $4499 = Fm$Term$check$($4498($4497), _type$2, _defs$3, _ctx$4, _path$5, _orig$6);
                    return $4499;
                case 'Fm.Term.ann':
                    var $4500 = self.done;
                    var $4501 = self.term;
                    var $4502 = self.type;
                    var self = $4500;
                    if (self) {
                        var $4504 = Monad$pure$(Fm$Check$monad)($4502);
                        var $4503 = $4504;
                    } else {
                        var $4505 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4501, Maybe$some$($4502), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$10 => {
                            var $4506 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4502, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$11 => {
                                var $4507 = Monad$pure$(Fm$Check$monad)($4502);
                                return $4507;
                            }));
                            return $4506;
                        }));
                        var $4503 = $4505;
                    };
                    return $4503;
                case 'Fm.Term.gol':
                    var $4508 = self.name;
                    var $4509 = self.dref;
                    var $4510 = self.verb;
                    var $4511 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$show_goal$($4508, $4509, $4510, _type$2, _ctx$4), List$nil));
                    return $4511;
                case 'Fm.Term.hol':
                    var $4512 = self.path;
                    var $4513 = Fm$Check$result$(_type$2, List$nil);
                    return $4513;
                case 'Fm.Term.nat':
                    var $4514 = self.natx;
                    var $4515 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Nat"));
                    return $4515;
                case 'Fm.Term.chr':
                    var $4516 = self.chrx;
                    var $4517 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Char"));
                    return $4517;
                case 'Fm.Term.str':
                    var $4518 = self.strx;
                    var $4519 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("String"));
                    return $4519;
                case 'Fm.Term.cse':
                    var $4520 = self.path;
                    var $4521 = self.expr;
                    var $4522 = self.name;
                    var $4523 = self.with;
                    var $4524 = self.cses;
                    var $4525 = self.moti;
                    var _expr$13 = $4521;
                    var $4526 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_etyp$14 => {
                        var self = $4525;
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _type$2;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4529 = Fm$Term$hol$(Bits$e);
                                        var _moti$15 = $4529;
                                        break;
                                    case 'Maybe.some':
                                        var $4530 = self.value;
                                        var _size$16 = List$length$(_ctx$4);
                                        var _typv$17 = Fm$Term$normalize$($4530, Map$new);
                                        var _moti$18 = Fm$SmartMotive$make$($4522, $4521, _etyp$14, _typv$17, _size$16, _defs$3);
                                        var $4531 = _moti$18;
                                        var _moti$15 = $4531;
                                        break;
                                };
                                var $4528 = Maybe$some$(Fm$Term$cse$($4520, $4521, $4522, $4523, $4524, Maybe$some$(_moti$15)));
                                var _dsug$15 = $4528;
                                break;
                            case 'Maybe.some':
                                var $4532 = self.value;
                                var $4533 = Fm$Term$desugar_cse$($4521, $4522, $4523, $4524, $4532, _etyp$14, _defs$3, _ctx$4);
                                var _dsug$15 = $4533;
                                break;
                        };
                        var self = _dsug$15;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4534 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                var $4527 = $4534;
                                break;
                            case 'Maybe.some':
                                var $4535 = self.value;
                                var $4536 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$patch$(Fm$MPath$to_bits$(_path$5), $4535), List$nil));
                                var $4527 = $4536;
                                break;
                        };
                        return $4527;
                    }));
                    return $4526;
                case 'Fm.Term.ori':
                    var $4537 = self.orig;
                    var $4538 = self.expr;
                    var $4539 = Fm$Term$check$($4538, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($4537));
                    return $4539;
            };
        })())((_infr$7 => {
            var self = _type$2;
            switch (self._) {
                case 'Maybe.none':
                    var $4541 = Fm$Check$result$(Maybe$some$(_infr$7), List$nil);
                    var $4540 = $4541;
                    break;
                case 'Maybe.some':
                    var $4542 = self.value;
                    var $4543 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($4542, _infr$7, _defs$3, List$length$(_ctx$4), Set$new))((_eqls$9 => {
                        var self = _eqls$9;
                        if (self) {
                            var $4545 = Monad$pure$(Fm$Check$monad)($4542);
                            var $4544 = $4545;
                        } else {
                            var $4546 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, Either$right$($4542), Either$right$(_infr$7), _ctx$4), List$nil));
                            var $4544 = $4546;
                        };
                        return $4544;
                    }));
                    var $4540 = $4543;
                    break;
            };
            return $4540;
        }));
        return $4338;
    };
    const Fm$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Term$check$(x0, x1, x2, x3, x4, x5);

    function Fm$Path$nil$(_x$1) {
        var $4547 = _x$1;
        return $4547;
    };
    const Fm$Path$nil = x0 => Fm$Path$nil$(x0);
    const Fm$MPath$nil = Maybe$some$(Fm$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $4549 = Bool$true;
                var $4548 = $4549;
                break;
            case 'List.cons':
                var $4550 = self.head;
                var $4551 = self.tail;
                var $4552 = Bool$false;
                var $4548 = $4552;
                break;
        };
        return $4548;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Fm$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Fm.Term.var':
                var $4554 = self.name;
                var $4555 = self.indx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4557 = _fn$3(_term$2);
                        var $4556 = $4557;
                        break;
                    case 'o':
                        var $4558 = self.slice(0, -1);
                        var $4559 = _term$2;
                        var $4556 = $4559;
                        break;
                    case 'i':
                        var $4560 = self.slice(0, -1);
                        var $4561 = _term$2;
                        var $4556 = $4561;
                        break;
                };
                var $4553 = $4556;
                break;
            case 'Fm.Term.ref':
                var $4562 = self.name;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4564 = _fn$3(_term$2);
                        var $4563 = $4564;
                        break;
                    case 'o':
                        var $4565 = self.slice(0, -1);
                        var $4566 = _term$2;
                        var $4563 = $4566;
                        break;
                    case 'i':
                        var $4567 = self.slice(0, -1);
                        var $4568 = _term$2;
                        var $4563 = $4568;
                        break;
                };
                var $4553 = $4563;
                break;
            case 'Fm.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4570 = _fn$3(_term$2);
                        var $4569 = $4570;
                        break;
                    case 'o':
                        var $4571 = self.slice(0, -1);
                        var $4572 = _term$2;
                        var $4569 = $4572;
                        break;
                    case 'i':
                        var $4573 = self.slice(0, -1);
                        var $4574 = _term$2;
                        var $4569 = $4574;
                        break;
                };
                var $4553 = $4569;
                break;
            case 'Fm.Term.all':
                var $4575 = self.eras;
                var $4576 = self.self;
                var $4577 = self.name;
                var $4578 = self.xtyp;
                var $4579 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4581 = _fn$3(_term$2);
                        var $4580 = $4581;
                        break;
                    case 'o':
                        var $4582 = self.slice(0, -1);
                        var $4583 = Fm$Term$all$($4575, $4576, $4577, Fm$Term$patch_at$($4582, $4578, _fn$3), $4579);
                        var $4580 = $4583;
                        break;
                    case 'i':
                        var $4584 = self.slice(0, -1);
                        var $4585 = Fm$Term$all$($4575, $4576, $4577, $4578, (_s$10 => _x$11 => {
                            var $4586 = Fm$Term$patch_at$($4584, $4579(_s$10)(_x$11), _fn$3);
                            return $4586;
                        }));
                        var $4580 = $4585;
                        break;
                };
                var $4553 = $4580;
                break;
            case 'Fm.Term.lam':
                var $4587 = self.name;
                var $4588 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4590 = _fn$3(_term$2);
                        var $4589 = $4590;
                        break;
                    case 'o':
                        var $4591 = self.slice(0, -1);
                        var $4592 = Fm$Term$lam$($4587, (_x$7 => {
                            var $4593 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4588(_x$7), _fn$3);
                            return $4593;
                        }));
                        var $4589 = $4592;
                        break;
                    case 'i':
                        var $4594 = self.slice(0, -1);
                        var $4595 = Fm$Term$lam$($4587, (_x$7 => {
                            var $4596 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4588(_x$7), _fn$3);
                            return $4596;
                        }));
                        var $4589 = $4595;
                        break;
                };
                var $4553 = $4589;
                break;
            case 'Fm.Term.app':
                var $4597 = self.func;
                var $4598 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4600 = _fn$3(_term$2);
                        var $4599 = $4600;
                        break;
                    case 'o':
                        var $4601 = self.slice(0, -1);
                        var $4602 = Fm$Term$app$(Fm$Term$patch_at$($4601, $4597, _fn$3), $4598);
                        var $4599 = $4602;
                        break;
                    case 'i':
                        var $4603 = self.slice(0, -1);
                        var $4604 = Fm$Term$app$($4597, Fm$Term$patch_at$($4603, $4598, _fn$3));
                        var $4599 = $4604;
                        break;
                };
                var $4553 = $4599;
                break;
            case 'Fm.Term.let':
                var $4605 = self.name;
                var $4606 = self.expr;
                var $4607 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4609 = _fn$3(_term$2);
                        var $4608 = $4609;
                        break;
                    case 'o':
                        var $4610 = self.slice(0, -1);
                        var $4611 = Fm$Term$let$($4605, Fm$Term$patch_at$($4610, $4606, _fn$3), $4607);
                        var $4608 = $4611;
                        break;
                    case 'i':
                        var $4612 = self.slice(0, -1);
                        var $4613 = Fm$Term$let$($4605, $4606, (_x$8 => {
                            var $4614 = Fm$Term$patch_at$($4612, $4607(_x$8), _fn$3);
                            return $4614;
                        }));
                        var $4608 = $4613;
                        break;
                };
                var $4553 = $4608;
                break;
            case 'Fm.Term.def':
                var $4615 = self.name;
                var $4616 = self.expr;
                var $4617 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4619 = _fn$3(_term$2);
                        var $4618 = $4619;
                        break;
                    case 'o':
                        var $4620 = self.slice(0, -1);
                        var $4621 = Fm$Term$def$($4615, Fm$Term$patch_at$($4620, $4616, _fn$3), $4617);
                        var $4618 = $4621;
                        break;
                    case 'i':
                        var $4622 = self.slice(0, -1);
                        var $4623 = Fm$Term$def$($4615, $4616, (_x$8 => {
                            var $4624 = Fm$Term$patch_at$($4622, $4617(_x$8), _fn$3);
                            return $4624;
                        }));
                        var $4618 = $4623;
                        break;
                };
                var $4553 = $4618;
                break;
            case 'Fm.Term.ann':
                var $4625 = self.done;
                var $4626 = self.term;
                var $4627 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4629 = _fn$3(_term$2);
                        var $4628 = $4629;
                        break;
                    case 'o':
                        var $4630 = self.slice(0, -1);
                        var $4631 = Fm$Term$ann$($4625, Fm$Term$patch_at$(_path$1, $4626, _fn$3), $4627);
                        var $4628 = $4631;
                        break;
                    case 'i':
                        var $4632 = self.slice(0, -1);
                        var $4633 = Fm$Term$ann$($4625, Fm$Term$patch_at$(_path$1, $4626, _fn$3), $4627);
                        var $4628 = $4633;
                        break;
                };
                var $4553 = $4628;
                break;
            case 'Fm.Term.gol':
                var $4634 = self.name;
                var $4635 = self.dref;
                var $4636 = self.verb;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4638 = _fn$3(_term$2);
                        var $4637 = $4638;
                        break;
                    case 'o':
                        var $4639 = self.slice(0, -1);
                        var $4640 = _term$2;
                        var $4637 = $4640;
                        break;
                    case 'i':
                        var $4641 = self.slice(0, -1);
                        var $4642 = _term$2;
                        var $4637 = $4642;
                        break;
                };
                var $4553 = $4637;
                break;
            case 'Fm.Term.hol':
                var $4643 = self.path;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4645 = _fn$3(_term$2);
                        var $4644 = $4645;
                        break;
                    case 'o':
                        var $4646 = self.slice(0, -1);
                        var $4647 = _term$2;
                        var $4644 = $4647;
                        break;
                    case 'i':
                        var $4648 = self.slice(0, -1);
                        var $4649 = _term$2;
                        var $4644 = $4649;
                        break;
                };
                var $4553 = $4644;
                break;
            case 'Fm.Term.nat':
                var $4650 = self.natx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4652 = _fn$3(_term$2);
                        var $4651 = $4652;
                        break;
                    case 'o':
                        var $4653 = self.slice(0, -1);
                        var $4654 = _term$2;
                        var $4651 = $4654;
                        break;
                    case 'i':
                        var $4655 = self.slice(0, -1);
                        var $4656 = _term$2;
                        var $4651 = $4656;
                        break;
                };
                var $4553 = $4651;
                break;
            case 'Fm.Term.chr':
                var $4657 = self.chrx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4659 = _fn$3(_term$2);
                        var $4658 = $4659;
                        break;
                    case 'o':
                        var $4660 = self.slice(0, -1);
                        var $4661 = _term$2;
                        var $4658 = $4661;
                        break;
                    case 'i':
                        var $4662 = self.slice(0, -1);
                        var $4663 = _term$2;
                        var $4658 = $4663;
                        break;
                };
                var $4553 = $4658;
                break;
            case 'Fm.Term.str':
                var $4664 = self.strx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4666 = _fn$3(_term$2);
                        var $4665 = $4666;
                        break;
                    case 'o':
                        var $4667 = self.slice(0, -1);
                        var $4668 = _term$2;
                        var $4665 = $4668;
                        break;
                    case 'i':
                        var $4669 = self.slice(0, -1);
                        var $4670 = _term$2;
                        var $4665 = $4670;
                        break;
                };
                var $4553 = $4665;
                break;
            case 'Fm.Term.cse':
                var $4671 = self.path;
                var $4672 = self.expr;
                var $4673 = self.name;
                var $4674 = self.with;
                var $4675 = self.cses;
                var $4676 = self.moti;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4678 = _fn$3(_term$2);
                        var $4677 = $4678;
                        break;
                    case 'o':
                        var $4679 = self.slice(0, -1);
                        var $4680 = _term$2;
                        var $4677 = $4680;
                        break;
                    case 'i':
                        var $4681 = self.slice(0, -1);
                        var $4682 = _term$2;
                        var $4677 = $4682;
                        break;
                };
                var $4553 = $4677;
                break;
            case 'Fm.Term.ori':
                var $4683 = self.orig;
                var $4684 = self.expr;
                var $4685 = Fm$Term$patch_at$(_path$1, $4684, _fn$3);
                var $4553 = $4685;
                break;
        };
        return $4553;
    };
    const Fm$Term$patch_at = x0 => x1 => x2 => Fm$Term$patch_at$(x0, x1, x2);

    function Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, _errs$7, _fixd$8) {
        var self = _errs$7;
        switch (self._) {
            case 'List.nil':
                var self = _fixd$8;
                if (self) {
                    var _type$9 = Fm$Term$bind$(List$nil, (_x$9 => {
                        var $4689 = (_x$9 + '1');
                        return $4689;
                    }), _type$5);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $4690 = (_x$10 + '0');
                        return $4690;
                    }), _term$4);
                    var _defs$11 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$10, _type$9, Fm$Status$init), _defs$6);
                    var $4688 = Monad$pure$(IO$monad)(Maybe$some$(_defs$11));
                    var $4687 = $4688;
                } else {
                    var $4691 = Monad$pure$(IO$monad)(Maybe$none);
                    var $4687 = $4691;
                };
                var $4686 = $4687;
                break;
            case 'List.cons':
                var $4692 = self.head;
                var $4693 = self.tail;
                var self = $4692;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $4695 = self.origin;
                        var $4696 = self.expected;
                        var $4697 = self.detected;
                        var $4698 = self.context;
                        var $4699 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4693, _fixd$8);
                        var $4694 = $4699;
                        break;
                    case 'Fm.Error.show_goal':
                        var $4700 = self.name;
                        var $4701 = self.dref;
                        var $4702 = self.verb;
                        var $4703 = self.goal;
                        var $4704 = self.context;
                        var $4705 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4693, _fixd$8);
                        var $4694 = $4705;
                        break;
                    case 'Fm.Error.waiting':
                        var $4706 = self.name;
                        var $4707 = Monad$bind$(IO$monad)(Fm$Synth$one$($4706, _defs$6))((_defs$12 => {
                            var $4708 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$12, $4693, Bool$true);
                            return $4708;
                        }));
                        var $4694 = $4707;
                        break;
                    case 'Fm.Error.indirect':
                        var $4709 = self.name;
                        var $4710 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4693, _fixd$8);
                        var $4694 = $4710;
                        break;
                    case 'Fm.Error.patch':
                        var $4711 = self.path;
                        var $4712 = self.term;
                        var self = $4711;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'e':
                                var $4714 = Monad$pure$(IO$monad)(Maybe$none);
                                var $4713 = $4714;
                                break;
                            case 'o':
                                var $4715 = self.slice(0, -1);
                                var _term$14 = Fm$Term$patch_at$($4715, _term$4, (_x$14 => {
                                    var $4717 = $4712;
                                    return $4717;
                                }));
                                var $4716 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$14, _type$5, _defs$6, $4693, Bool$true);
                                var $4713 = $4716;
                                break;
                            case 'i':
                                var $4718 = self.slice(0, -1);
                                var _type$14 = Fm$Term$patch_at$($4718, _type$5, (_x$14 => {
                                    var $4720 = $4712;
                                    return $4720;
                                }));
                                var $4719 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$14, _defs$6, $4693, Bool$true);
                                var $4713 = $4719;
                                break;
                        };
                        var $4694 = $4713;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $4721 = self.origin;
                        var $4722 = self.name;
                        var $4723 = Monad$bind$(IO$monad)(Fm$Synth$one$($4722, _defs$6))((_defs$13 => {
                            var $4724 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$13, $4693, Bool$true);
                            return $4724;
                        }));
                        var $4694 = $4723;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $4725 = self.origin;
                        var $4726 = self.term;
                        var $4727 = self.context;
                        var $4728 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4693, _fixd$8);
                        var $4694 = $4728;
                        break;
                };
                var $4686 = $4694;
                break;
        };
        return $4686;
    };
    const Fm$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Status$fail$(_errors$1) {
        var $4729 = ({
            _: 'Fm.Status.fail',
            'errors': _errors$1
        });
        return $4729;
    };
    const Fm$Status$fail = x0 => Fm$Status$fail$(x0);

    function Fm$Synth$one$(_name$1, _defs$2) {
        var self = Fm$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.none':
                var $4731 = Monad$bind$(IO$monad)(Fm$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4733 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("Undefined: ", List$cons$(_name$1, List$nil)))))((_$4 => {
                                var $4734 = Monad$pure$(IO$monad)(_defs$2);
                                return $4734;
                            }));
                            var $4732 = $4733;
                            break;
                        case 'Maybe.some':
                            var $4735 = self.value;
                            var $4736 = Fm$Synth$one$(_name$1, $4735);
                            var $4732 = $4736;
                            break;
                    };
                    return $4732;
                }));
                var $4730 = $4731;
                break;
            case 'Maybe.some':
                var $4737 = self.value;
                var self = $4737;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4739 = self.file;
                        var $4740 = self.code;
                        var $4741 = self.name;
                        var $4742 = self.term;
                        var $4743 = self.type;
                        var $4744 = self.stat;
                        var _file$10 = $4739;
                        var _code$11 = $4740;
                        var _name$12 = $4741;
                        var _term$13 = $4742;
                        var _type$14 = $4743;
                        var _stat$15 = $4744;
                        var self = _stat$15;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var _defs$16 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, Fm$Status$wait), _defs$2);
                                var _checked$17 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_type$14, Maybe$some$(Fm$Term$typ), _defs$16, List$nil, Fm$MPath$i$(Fm$MPath$nil), Maybe$none))((_chk_type$17 => {
                                    var $4747 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_term$13, Maybe$some$(_type$14), _defs$16, List$nil, Fm$MPath$o$(Fm$MPath$nil), Maybe$none))((_chk_term$18 => {
                                        var $4748 = Monad$pure$(Fm$Check$monad)(Unit$new);
                                        return $4748;
                                    }));
                                    return $4747;
                                }));
                                var self = _checked$17;
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $4749 = self.value;
                                        var $4750 = self.errors;
                                        var self = List$is_empty$($4750);
                                        if (self) {
                                            var _defs$20 = Fm$define$(_file$10, _code$11, _name$12, _term$13, _type$14, Bool$true, _defs$16);
                                            var $4752 = Monad$pure$(IO$monad)(_defs$20);
                                            var $4751 = $4752;
                                        } else {
                                            var $4753 = Monad$bind$(IO$monad)(Fm$Synth$fix$(_file$10, _code$11, _name$12, _term$13, _type$14, _defs$16, $4750, Bool$false))((_fixed$20 => {
                                                var self = _fixed$20;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var _stat$21 = Fm$Status$fail$($4750);
                                                        var _defs$22 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, _stat$21), _defs$16);
                                                        var $4755 = Monad$pure$(IO$monad)(_defs$22);
                                                        var $4754 = $4755;
                                                        break;
                                                    case 'Maybe.some':
                                                        var $4756 = self.value;
                                                        var $4757 = Fm$Synth$one$(_name$12, $4756);
                                                        var $4754 = $4757;
                                                        break;
                                                };
                                                return $4754;
                                            }));
                                            var $4751 = $4753;
                                        };
                                        var $4746 = $4751;
                                        break;
                                };
                                var $4745 = $4746;
                                break;
                            case 'Fm.Status.wait':
                                var $4758 = Monad$pure$(IO$monad)(_defs$2);
                                var $4745 = $4758;
                                break;
                            case 'Fm.Status.done':
                                var $4759 = Monad$pure$(IO$monad)(_defs$2);
                                var $4745 = $4759;
                                break;
                            case 'Fm.Status.fail':
                                var $4760 = self.errors;
                                var $4761 = Monad$pure$(IO$monad)(_defs$2);
                                var $4745 = $4761;
                                break;
                        };
                        var $4738 = $4745;
                        break;
                };
                var $4730 = $4738;
                break;
        };
        return $4730;
    };
    const Fm$Synth$one = x0 => x1 => Fm$Synth$one$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $4763 = _list$3;
                var $4762 = $4763;
                break;
            case 'Map.tie':
                var $4764 = self.val;
                var $4765 = self.lft;
                var $4766 = self.rgt;
                var self = $4764;
                switch (self._) {
                    case 'Maybe.none':
                        var $4768 = _list$3;
                        var _list0$7 = $4768;
                        break;
                    case 'Maybe.some':
                        var $4769 = self.value;
                        var $4770 = List$cons$($4769, _list$3);
                        var _list0$7 = $4770;
                        break;
                };
                var _list1$8 = Map$values$go$($4765, _list0$7);
                var _list2$9 = Map$values$go$($4766, _list1$8);
                var $4767 = _list2$9;
                var $4762 = $4767;
                break;
        };
        return $4762;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $4771 = Map$values$go$(_xs$2, List$nil);
        return $4771;
    };
    const Map$values = x0 => Map$values$(x0);

    function Fm$Name$show$(_name$1) {
        var $4772 = _name$1;
        return $4772;
    };
    const Fm$Name$show = x0 => Fm$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $4774 = 0n;
                var $4773 = $4774;
                break;
            case 'o':
                var $4775 = self.slice(0, -1);
                var $4776 = (2n * Bits$to_nat$($4775));
                var $4773 = $4776;
                break;
            case 'i':
                var $4777 = self.slice(0, -1);
                var $4778 = Nat$succ$((2n * Bits$to_nat$($4777)));
                var $4773 = $4778;
                break;
        };
        return $4773;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $4780 = u16_to_word(self);
                var $4781 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($4780)));
                var $4779 = $4781;
                break;
        };
        return $4779;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Fm$escape$char$(_chr$1) {
        var self = (_chr$1 === Fm$backslash);
        if (self) {
            var $4783 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
            var $4782 = $4783;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $4785 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                var $4784 = $4785;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $4787 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                    var $4786 = $4787;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $4789 = String$cons$(_chr$1, String$nil);
                        var $4788 = $4789;
                    } else {
                        var $4790 = String$flatten$(List$cons$(String$cons$(Fm$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $4788 = $4790;
                    };
                    var $4786 = $4788;
                };
                var $4784 = $4786;
            };
            var $4782 = $4784;
        };
        return $4782;
    };
    const Fm$escape$char = x0 => Fm$escape$char$(x0);

    function Fm$escape$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4792 = String$nil;
            var $4791 = $4792;
        } else {
            var $4793 = self.charCodeAt(0);
            var $4794 = self.slice(1);
            var _head$4 = Fm$escape$char$($4793);
            var _tail$5 = Fm$escape$($4794);
            var $4795 = (_head$4 + _tail$5);
            var $4791 = $4795;
        };
        return $4791;
    };
    const Fm$escape = x0 => Fm$escape$(x0);

    function Fm$Term$core$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4797 = self.name;
                var $4798 = self.indx;
                var $4799 = Fm$Name$show$($4797);
                var $4796 = $4799;
                break;
            case 'Fm.Term.ref':
                var $4800 = self.name;
                var $4801 = Fm$Name$show$($4800);
                var $4796 = $4801;
                break;
            case 'Fm.Term.typ':
                var $4802 = "*";
                var $4796 = $4802;
                break;
            case 'Fm.Term.all':
                var $4803 = self.eras;
                var $4804 = self.self;
                var $4805 = self.name;
                var $4806 = self.xtyp;
                var $4807 = self.body;
                var _eras$7 = $4803;
                var self = _eras$7;
                if (self) {
                    var $4809 = "%";
                    var _init$8 = $4809;
                } else {
                    var $4810 = "@";
                    var _init$8 = $4810;
                };
                var _self$9 = Fm$Name$show$($4804);
                var _name$10 = Fm$Name$show$($4805);
                var _xtyp$11 = Fm$Term$core$($4806);
                var _body$12 = Fm$Term$core$($4807(Fm$Term$var$($4804, 0n))(Fm$Term$var$($4805, 0n)));
                var $4808 = String$flatten$(List$cons$(_init$8, List$cons$(_self$9, List$cons$("(", List$cons$(_name$10, List$cons$(":", List$cons$(_xtyp$11, List$cons$(") ", List$cons$(_body$12, List$nil)))))))));
                var $4796 = $4808;
                break;
            case 'Fm.Term.lam':
                var $4811 = self.name;
                var $4812 = self.body;
                var _name$4 = Fm$Name$show$($4811);
                var _body$5 = Fm$Term$core$($4812(Fm$Term$var$($4811, 0n)));
                var $4813 = String$flatten$(List$cons$("#", List$cons$(_name$4, List$cons$(" ", List$cons$(_body$5, List$nil)))));
                var $4796 = $4813;
                break;
            case 'Fm.Term.app':
                var $4814 = self.func;
                var $4815 = self.argm;
                var _func$4 = Fm$Term$core$($4814);
                var _argm$5 = Fm$Term$core$($4815);
                var $4816 = String$flatten$(List$cons$("(", List$cons$(_func$4, List$cons$(" ", List$cons$(_argm$5, List$cons$(")", List$nil))))));
                var $4796 = $4816;
                break;
            case 'Fm.Term.let':
                var $4817 = self.name;
                var $4818 = self.expr;
                var $4819 = self.body;
                var _name$5 = Fm$Name$show$($4817);
                var _expr$6 = Fm$Term$core$($4818);
                var _body$7 = Fm$Term$core$($4819(Fm$Term$var$($4817, 0n)));
                var $4820 = String$flatten$(List$cons$("!", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4796 = $4820;
                break;
            case 'Fm.Term.def':
                var $4821 = self.name;
                var $4822 = self.expr;
                var $4823 = self.body;
                var _name$5 = Fm$Name$show$($4821);
                var _expr$6 = Fm$Term$core$($4822);
                var _body$7 = Fm$Term$core$($4823(Fm$Term$var$($4821, 0n)));
                var $4824 = String$flatten$(List$cons$("$", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4796 = $4824;
                break;
            case 'Fm.Term.ann':
                var $4825 = self.done;
                var $4826 = self.term;
                var $4827 = self.type;
                var _term$5 = Fm$Term$core$($4826);
                var _type$6 = Fm$Term$core$($4827);
                var $4828 = String$flatten$(List$cons$("{", List$cons$(_term$5, List$cons$(":", List$cons$(_type$6, List$cons$("}", List$nil))))));
                var $4796 = $4828;
                break;
            case 'Fm.Term.gol':
                var $4829 = self.name;
                var $4830 = self.dref;
                var $4831 = self.verb;
                var $4832 = "<GOL>";
                var $4796 = $4832;
                break;
            case 'Fm.Term.hol':
                var $4833 = self.path;
                var $4834 = "<HOL>";
                var $4796 = $4834;
                break;
            case 'Fm.Term.nat':
                var $4835 = self.natx;
                var $4836 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($4835), List$nil)));
                var $4796 = $4836;
                break;
            case 'Fm.Term.chr':
                var $4837 = self.chrx;
                var $4838 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($4837), List$cons$("\'", List$nil))));
                var $4796 = $4838;
                break;
            case 'Fm.Term.str':
                var $4839 = self.strx;
                var $4840 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($4839), List$cons$("\"", List$nil))));
                var $4796 = $4840;
                break;
            case 'Fm.Term.cse':
                var $4841 = self.path;
                var $4842 = self.expr;
                var $4843 = self.name;
                var $4844 = self.with;
                var $4845 = self.cses;
                var $4846 = self.moti;
                var $4847 = "<CSE>";
                var $4796 = $4847;
                break;
            case 'Fm.Term.ori':
                var $4848 = self.orig;
                var $4849 = self.expr;
                var $4850 = Fm$Term$core$($4849);
                var $4796 = $4850;
                break;
        };
        return $4796;
    };
    const Fm$Term$core = x0 => Fm$Term$core$(x0);

    function Fm$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $4853 = _result$2;
            var $4854 = Map$values$(_defs$1);
            let _result$4 = $4853;
            let _defn$3;
            while ($4854._ === 'List.cons') {
                _defn$3 = $4854.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4855 = self.file;
                        var $4856 = self.code;
                        var $4857 = self.name;
                        var $4858 = self.term;
                        var $4859 = self.type;
                        var $4860 = self.stat;
                        var self = $4860;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var $4862 = _result$4;
                                var $4861 = $4862;
                                break;
                            case 'Fm.Status.wait':
                                var $4863 = _result$4;
                                var $4861 = $4863;
                                break;
                            case 'Fm.Status.done':
                                var _name$11 = $4857;
                                var _term$12 = Fm$Term$core$($4858);
                                var _type$13 = Fm$Term$core$($4859);
                                var $4864 = String$flatten$(List$cons$(_result$4, List$cons$(_name$11, List$cons$(" : ", List$cons$(_type$13, List$cons$(" = ", List$cons$(_term$12, List$cons$(";\u{a}", List$nil))))))));
                                var $4861 = $4864;
                                break;
                            case 'Fm.Status.fail':
                                var $4865 = self.errors;
                                var $4866 = _result$4;
                                var $4861 = $4866;
                                break;
                        };
                        var $4853 = $4861;
                        break;
                };
                _result$4 = $4853;
                $4854 = $4854.tail;
            }
            return _result$4;
        })();
        var $4851 = _result$3;
        return $4851;
    };
    const Fm$Defs$core = x0 => Fm$Defs$core$(x0);

    function Fm$to_core$io$one$(_name$1) {
        var $4867 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $4868 = Monad$pure$(IO$monad)(Fm$Defs$core$(_defs$2));
            return $4868;
        }));
        return $4867;
    };
    const Fm$to_core$io$one = x0 => Fm$to_core$io$one$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $4870 = Maybe$none;
                var $4869 = $4870;
                break;
            case 'Maybe.some':
                var $4871 = self.value;
                var $4872 = _f$4($4871);
                var $4869 = $4872;
                break;
        };
        return $4869;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);
    const Maybe$monad = Monad$new$(Maybe$bind, Maybe$some);

    function Fm$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4874 = self.name;
                var $4875 = self.indx;
                var $4876 = Maybe$none;
                var $4873 = $4876;
                break;
            case 'Fm.Term.ref':
                var $4877 = self.name;
                var self = ($4877 === "Nat.zero");
                if (self) {
                    var $4879 = Maybe$some$(0n);
                    var $4878 = $4879;
                } else {
                    var $4880 = Maybe$none;
                    var $4878 = $4880;
                };
                var $4873 = $4878;
                break;
            case 'Fm.Term.typ':
                var $4881 = Maybe$none;
                var $4873 = $4881;
                break;
            case 'Fm.Term.all':
                var $4882 = self.eras;
                var $4883 = self.self;
                var $4884 = self.name;
                var $4885 = self.xtyp;
                var $4886 = self.body;
                var $4887 = Maybe$none;
                var $4873 = $4887;
                break;
            case 'Fm.Term.lam':
                var $4888 = self.name;
                var $4889 = self.body;
                var $4890 = Maybe$none;
                var $4873 = $4890;
                break;
            case 'Fm.Term.app':
                var $4891 = self.func;
                var $4892 = self.argm;
                var self = $4891;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $4894 = self.name;
                        var $4895 = self.indx;
                        var $4896 = Maybe$none;
                        var $4893 = $4896;
                        break;
                    case 'Fm.Term.ref':
                        var $4897 = self.name;
                        var self = ($4897 === "Nat.succ");
                        if (self) {
                            var $4899 = Monad$bind$(Maybe$monad)(Fm$Term$show$as_nat$go$($4892))((_pred$5 => {
                                var $4900 = Monad$pure$(Maybe$monad)(Nat$succ$(_pred$5));
                                return $4900;
                            }));
                            var $4898 = $4899;
                        } else {
                            var $4901 = Maybe$none;
                            var $4898 = $4901;
                        };
                        var $4893 = $4898;
                        break;
                    case 'Fm.Term.typ':
                        var $4902 = Maybe$none;
                        var $4893 = $4902;
                        break;
                    case 'Fm.Term.all':
                        var $4903 = self.eras;
                        var $4904 = self.self;
                        var $4905 = self.name;
                        var $4906 = self.xtyp;
                        var $4907 = self.body;
                        var $4908 = Maybe$none;
                        var $4893 = $4908;
                        break;
                    case 'Fm.Term.lam':
                        var $4909 = self.name;
                        var $4910 = self.body;
                        var $4911 = Maybe$none;
                        var $4893 = $4911;
                        break;
                    case 'Fm.Term.app':
                        var $4912 = self.func;
                        var $4913 = self.argm;
                        var $4914 = Maybe$none;
                        var $4893 = $4914;
                        break;
                    case 'Fm.Term.let':
                        var $4915 = self.name;
                        var $4916 = self.expr;
                        var $4917 = self.body;
                        var $4918 = Maybe$none;
                        var $4893 = $4918;
                        break;
                    case 'Fm.Term.def':
                        var $4919 = self.name;
                        var $4920 = self.expr;
                        var $4921 = self.body;
                        var $4922 = Maybe$none;
                        var $4893 = $4922;
                        break;
                    case 'Fm.Term.ann':
                        var $4923 = self.done;
                        var $4924 = self.term;
                        var $4925 = self.type;
                        var $4926 = Maybe$none;
                        var $4893 = $4926;
                        break;
                    case 'Fm.Term.gol':
                        var $4927 = self.name;
                        var $4928 = self.dref;
                        var $4929 = self.verb;
                        var $4930 = Maybe$none;
                        var $4893 = $4930;
                        break;
                    case 'Fm.Term.hol':
                        var $4931 = self.path;
                        var $4932 = Maybe$none;
                        var $4893 = $4932;
                        break;
                    case 'Fm.Term.nat':
                        var $4933 = self.natx;
                        var $4934 = Maybe$none;
                        var $4893 = $4934;
                        break;
                    case 'Fm.Term.chr':
                        var $4935 = self.chrx;
                        var $4936 = Maybe$none;
                        var $4893 = $4936;
                        break;
                    case 'Fm.Term.str':
                        var $4937 = self.strx;
                        var $4938 = Maybe$none;
                        var $4893 = $4938;
                        break;
                    case 'Fm.Term.cse':
                        var $4939 = self.path;
                        var $4940 = self.expr;
                        var $4941 = self.name;
                        var $4942 = self.with;
                        var $4943 = self.cses;
                        var $4944 = self.moti;
                        var $4945 = Maybe$none;
                        var $4893 = $4945;
                        break;
                    case 'Fm.Term.ori':
                        var $4946 = self.orig;
                        var $4947 = self.expr;
                        var $4948 = Maybe$none;
                        var $4893 = $4948;
                        break;
                };
                var $4873 = $4893;
                break;
            case 'Fm.Term.let':
                var $4949 = self.name;
                var $4950 = self.expr;
                var $4951 = self.body;
                var $4952 = Maybe$none;
                var $4873 = $4952;
                break;
            case 'Fm.Term.def':
                var $4953 = self.name;
                var $4954 = self.expr;
                var $4955 = self.body;
                var $4956 = Maybe$none;
                var $4873 = $4956;
                break;
            case 'Fm.Term.ann':
                var $4957 = self.done;
                var $4958 = self.term;
                var $4959 = self.type;
                var $4960 = Maybe$none;
                var $4873 = $4960;
                break;
            case 'Fm.Term.gol':
                var $4961 = self.name;
                var $4962 = self.dref;
                var $4963 = self.verb;
                var $4964 = Maybe$none;
                var $4873 = $4964;
                break;
            case 'Fm.Term.hol':
                var $4965 = self.path;
                var $4966 = Maybe$none;
                var $4873 = $4966;
                break;
            case 'Fm.Term.nat':
                var $4967 = self.natx;
                var $4968 = Maybe$none;
                var $4873 = $4968;
                break;
            case 'Fm.Term.chr':
                var $4969 = self.chrx;
                var $4970 = Maybe$none;
                var $4873 = $4970;
                break;
            case 'Fm.Term.str':
                var $4971 = self.strx;
                var $4972 = Maybe$none;
                var $4873 = $4972;
                break;
            case 'Fm.Term.cse':
                var $4973 = self.path;
                var $4974 = self.expr;
                var $4975 = self.name;
                var $4976 = self.with;
                var $4977 = self.cses;
                var $4978 = self.moti;
                var $4979 = Maybe$none;
                var $4873 = $4979;
                break;
            case 'Fm.Term.ori':
                var $4980 = self.orig;
                var $4981 = self.expr;
                var $4982 = Maybe$none;
                var $4873 = $4982;
                break;
        };
        return $4873;
    };
    const Fm$Term$show$as_nat$go = x0 => Fm$Term$show$as_nat$go$(x0);

    function Fm$Term$show$as_nat$(_term$1) {
        var $4983 = Maybe$mapped$(Fm$Term$show$as_nat$go$(_term$1), Nat$show);
        return $4983;
    };
    const Fm$Term$show$as_nat = x0 => Fm$Term$show$as_nat$(x0);

    function Fm$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4985 = self.name;
                var $4986 = self.indx;
                var $4987 = Bool$false;
                var $4984 = $4987;
                break;
            case 'Fm.Term.ref':
                var $4988 = self.name;
                var $4989 = (_name$2 === $4988);
                var $4984 = $4989;
                break;
            case 'Fm.Term.typ':
                var $4990 = Bool$false;
                var $4984 = $4990;
                break;
            case 'Fm.Term.all':
                var $4991 = self.eras;
                var $4992 = self.self;
                var $4993 = self.name;
                var $4994 = self.xtyp;
                var $4995 = self.body;
                var $4996 = Bool$false;
                var $4984 = $4996;
                break;
            case 'Fm.Term.lam':
                var $4997 = self.name;
                var $4998 = self.body;
                var $4999 = Bool$false;
                var $4984 = $4999;
                break;
            case 'Fm.Term.app':
                var $5000 = self.func;
                var $5001 = self.argm;
                var $5002 = Bool$false;
                var $4984 = $5002;
                break;
            case 'Fm.Term.let':
                var $5003 = self.name;
                var $5004 = self.expr;
                var $5005 = self.body;
                var $5006 = Bool$false;
                var $4984 = $5006;
                break;
            case 'Fm.Term.def':
                var $5007 = self.name;
                var $5008 = self.expr;
                var $5009 = self.body;
                var $5010 = Bool$false;
                var $4984 = $5010;
                break;
            case 'Fm.Term.ann':
                var $5011 = self.done;
                var $5012 = self.term;
                var $5013 = self.type;
                var $5014 = Bool$false;
                var $4984 = $5014;
                break;
            case 'Fm.Term.gol':
                var $5015 = self.name;
                var $5016 = self.dref;
                var $5017 = self.verb;
                var $5018 = Bool$false;
                var $4984 = $5018;
                break;
            case 'Fm.Term.hol':
                var $5019 = self.path;
                var $5020 = Bool$false;
                var $4984 = $5020;
                break;
            case 'Fm.Term.nat':
                var $5021 = self.natx;
                var $5022 = Bool$false;
                var $4984 = $5022;
                break;
            case 'Fm.Term.chr':
                var $5023 = self.chrx;
                var $5024 = Bool$false;
                var $4984 = $5024;
                break;
            case 'Fm.Term.str':
                var $5025 = self.strx;
                var $5026 = Bool$false;
                var $4984 = $5026;
                break;
            case 'Fm.Term.cse':
                var $5027 = self.path;
                var $5028 = self.expr;
                var $5029 = self.name;
                var $5030 = self.with;
                var $5031 = self.cses;
                var $5032 = self.moti;
                var $5033 = Bool$false;
                var $4984 = $5033;
                break;
            case 'Fm.Term.ori':
                var $5034 = self.orig;
                var $5035 = self.expr;
                var $5036 = Bool$false;
                var $4984 = $5036;
                break;
        };
        return $4984;
    };
    const Fm$Term$show$is_ref = x0 => x1 => Fm$Term$show$is_ref$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function Fm$Term$show$app$(_term$1, _path$2, _args$3) {
        var Fm$Term$show$app$ = (_term$1, _path$2, _args$3) => ({
            ctr: 'TCO',
            arg: [_term$1, _path$2, _args$3]
        });
        var Fm$Term$show$app = _term$1 => _path$2 => _args$3 => Fm$Term$show$app$(_term$1, _path$2, _args$3);
        var arg = [_term$1, _path$2, _args$3];
        while (true) {
            let [_term$1, _path$2, _args$3] = arg;
            var R = (() => {
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $5037 = self.name;
                        var $5038 = self.indx;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5040 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5039 = $5040;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5042 = Bool$false;
                                var _wrap$8 = $5042;
                            } else {
                                var $5043 = self.charCodeAt(0);
                                var $5044 = self.slice(1);
                                var $5045 = ($5043 === 40);
                                var _wrap$8 = $5045;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5046 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5046;
                            } else {
                                var $5047 = _func$7;
                                var _func$10 = $5047;
                            };
                            var $5041 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5039 = $5041;
                        };
                        return $5039;
                    case 'Fm.Term.ref':
                        var $5048 = self.name;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5050 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5049 = $5050;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5052 = Bool$false;
                                var _wrap$7 = $5052;
                            } else {
                                var $5053 = self.charCodeAt(0);
                                var $5054 = self.slice(1);
                                var $5055 = ($5053 === 40);
                                var _wrap$7 = $5055;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5056 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5056;
                            } else {
                                var $5057 = _func$6;
                                var _func$9 = $5057;
                            };
                            var $5051 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5049 = $5051;
                        };
                        return $5049;
                    case 'Fm.Term.typ':
                        var _arity$4 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
                        if (self) {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5059 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
                            var $5058 = $5059;
                        } else {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$5;
                            if (self.length === 0) {
                                var $5061 = Bool$false;
                                var _wrap$6 = $5061;
                            } else {
                                var $5062 = self.charCodeAt(0);
                                var $5063 = self.slice(1);
                                var $5064 = ($5062 === 40);
                                var _wrap$6 = $5064;
                            };
                            var _args$7 = String$join$(",", _args$3);
                            var self = _wrap$6;
                            if (self) {
                                var $5065 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                                var _func$8 = $5065;
                            } else {
                                var $5066 = _func$5;
                                var _func$8 = $5066;
                            };
                            var $5060 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
                            var $5058 = $5060;
                        };
                        return $5058;
                    case 'Fm.Term.all':
                        var $5067 = self.eras;
                        var $5068 = self.self;
                        var $5069 = self.name;
                        var $5070 = self.xtyp;
                        var $5071 = self.body;
                        var _arity$9 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$9 === 3n));
                        if (self) {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$11 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$12 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5073 = String$flatten$(List$cons$(_eq_lft$11, List$cons$(" == ", List$cons$(_eq_rgt$12, List$nil))));
                            var $5072 = $5073;
                        } else {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$10;
                            if (self.length === 0) {
                                var $5075 = Bool$false;
                                var _wrap$11 = $5075;
                            } else {
                                var $5076 = self.charCodeAt(0);
                                var $5077 = self.slice(1);
                                var $5078 = ($5076 === 40);
                                var _wrap$11 = $5078;
                            };
                            var _args$12 = String$join$(",", _args$3);
                            var self = _wrap$11;
                            if (self) {
                                var $5079 = String$flatten$(List$cons$("(", List$cons$(_func$10, List$cons$(")", List$nil))));
                                var _func$13 = $5079;
                            } else {
                                var $5080 = _func$10;
                                var _func$13 = $5080;
                            };
                            var $5074 = String$flatten$(List$cons$(_func$13, List$cons$("(", List$cons$(_args$12, List$cons$(")", List$nil)))));
                            var $5072 = $5074;
                        };
                        return $5072;
                    case 'Fm.Term.lam':
                        var $5081 = self.name;
                        var $5082 = self.body;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5084 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5083 = $5084;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5086 = Bool$false;
                                var _wrap$8 = $5086;
                            } else {
                                var $5087 = self.charCodeAt(0);
                                var $5088 = self.slice(1);
                                var $5089 = ($5087 === 40);
                                var _wrap$8 = $5089;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5090 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5090;
                            } else {
                                var $5091 = _func$7;
                                var _func$10 = $5091;
                            };
                            var $5085 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5083 = $5085;
                        };
                        return $5083;
                    case 'Fm.Term.app':
                        var $5092 = self.func;
                        var $5093 = self.argm;
                        var _argm$6 = Fm$Term$show$go$($5093, Fm$MPath$i$(_path$2));
                        var $5094 = Fm$Term$show$app$($5092, Fm$MPath$o$(_path$2), List$cons$(_argm$6, _args$3));
                        return $5094;
                    case 'Fm.Term.let':
                        var $5095 = self.name;
                        var $5096 = self.expr;
                        var $5097 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5099 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5098 = $5099;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5101 = Bool$false;
                                var _wrap$9 = $5101;
                            } else {
                                var $5102 = self.charCodeAt(0);
                                var $5103 = self.slice(1);
                                var $5104 = ($5102 === 40);
                                var _wrap$9 = $5104;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5105 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5105;
                            } else {
                                var $5106 = _func$8;
                                var _func$11 = $5106;
                            };
                            var $5100 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5098 = $5100;
                        };
                        return $5098;
                    case 'Fm.Term.def':
                        var $5107 = self.name;
                        var $5108 = self.expr;
                        var $5109 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5111 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5110 = $5111;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5113 = Bool$false;
                                var _wrap$9 = $5113;
                            } else {
                                var $5114 = self.charCodeAt(0);
                                var $5115 = self.slice(1);
                                var $5116 = ($5114 === 40);
                                var _wrap$9 = $5116;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5117 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5117;
                            } else {
                                var $5118 = _func$8;
                                var _func$11 = $5118;
                            };
                            var $5112 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5110 = $5112;
                        };
                        return $5110;
                    case 'Fm.Term.ann':
                        var $5119 = self.done;
                        var $5120 = self.term;
                        var $5121 = self.type;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5123 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5122 = $5123;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5125 = Bool$false;
                                var _wrap$9 = $5125;
                            } else {
                                var $5126 = self.charCodeAt(0);
                                var $5127 = self.slice(1);
                                var $5128 = ($5126 === 40);
                                var _wrap$9 = $5128;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5129 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5129;
                            } else {
                                var $5130 = _func$8;
                                var _func$11 = $5130;
                            };
                            var $5124 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5122 = $5124;
                        };
                        return $5122;
                    case 'Fm.Term.gol':
                        var $5131 = self.name;
                        var $5132 = self.dref;
                        var $5133 = self.verb;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5135 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5134 = $5135;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5137 = Bool$false;
                                var _wrap$9 = $5137;
                            } else {
                                var $5138 = self.charCodeAt(0);
                                var $5139 = self.slice(1);
                                var $5140 = ($5138 === 40);
                                var _wrap$9 = $5140;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5141 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5141;
                            } else {
                                var $5142 = _func$8;
                                var _func$11 = $5142;
                            };
                            var $5136 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5134 = $5136;
                        };
                        return $5134;
                    case 'Fm.Term.hol':
                        var $5143 = self.path;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5145 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5144 = $5145;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5147 = Bool$false;
                                var _wrap$7 = $5147;
                            } else {
                                var $5148 = self.charCodeAt(0);
                                var $5149 = self.slice(1);
                                var $5150 = ($5148 === 40);
                                var _wrap$7 = $5150;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5151 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5151;
                            } else {
                                var $5152 = _func$6;
                                var _func$9 = $5152;
                            };
                            var $5146 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5144 = $5146;
                        };
                        return $5144;
                    case 'Fm.Term.nat':
                        var $5153 = self.natx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5155 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5154 = $5155;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5157 = Bool$false;
                                var _wrap$7 = $5157;
                            } else {
                                var $5158 = self.charCodeAt(0);
                                var $5159 = self.slice(1);
                                var $5160 = ($5158 === 40);
                                var _wrap$7 = $5160;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5161 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5161;
                            } else {
                                var $5162 = _func$6;
                                var _func$9 = $5162;
                            };
                            var $5156 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5154 = $5156;
                        };
                        return $5154;
                    case 'Fm.Term.chr':
                        var $5163 = self.chrx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5165 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5164 = $5165;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5167 = Bool$false;
                                var _wrap$7 = $5167;
                            } else {
                                var $5168 = self.charCodeAt(0);
                                var $5169 = self.slice(1);
                                var $5170 = ($5168 === 40);
                                var _wrap$7 = $5170;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5171 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5171;
                            } else {
                                var $5172 = _func$6;
                                var _func$9 = $5172;
                            };
                            var $5166 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5164 = $5166;
                        };
                        return $5164;
                    case 'Fm.Term.str':
                        var $5173 = self.strx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5175 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5174 = $5175;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5177 = Bool$false;
                                var _wrap$7 = $5177;
                            } else {
                                var $5178 = self.charCodeAt(0);
                                var $5179 = self.slice(1);
                                var $5180 = ($5178 === 40);
                                var _wrap$7 = $5180;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5181 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5181;
                            } else {
                                var $5182 = _func$6;
                                var _func$9 = $5182;
                            };
                            var $5176 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5174 = $5176;
                        };
                        return $5174;
                    case 'Fm.Term.cse':
                        var $5183 = self.path;
                        var $5184 = self.expr;
                        var $5185 = self.name;
                        var $5186 = self.with;
                        var $5187 = self.cses;
                        var $5188 = self.moti;
                        var _arity$10 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$10 === 3n));
                        if (self) {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$12 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$13 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5190 = String$flatten$(List$cons$(_eq_lft$12, List$cons$(" == ", List$cons$(_eq_rgt$13, List$nil))));
                            var $5189 = $5190;
                        } else {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$11;
                            if (self.length === 0) {
                                var $5192 = Bool$false;
                                var _wrap$12 = $5192;
                            } else {
                                var $5193 = self.charCodeAt(0);
                                var $5194 = self.slice(1);
                                var $5195 = ($5193 === 40);
                                var _wrap$12 = $5195;
                            };
                            var _args$13 = String$join$(",", _args$3);
                            var self = _wrap$12;
                            if (self) {
                                var $5196 = String$flatten$(List$cons$("(", List$cons$(_func$11, List$cons$(")", List$nil))));
                                var _func$14 = $5196;
                            } else {
                                var $5197 = _func$11;
                                var _func$14 = $5197;
                            };
                            var $5191 = String$flatten$(List$cons$(_func$14, List$cons$("(", List$cons$(_args$13, List$cons$(")", List$nil)))));
                            var $5189 = $5191;
                        };
                        return $5189;
                    case 'Fm.Term.ori':
                        var $5198 = self.orig;
                        var $5199 = self.expr;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5201 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5200 = $5201;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5203 = Bool$false;
                                var _wrap$8 = $5203;
                            } else {
                                var $5204 = self.charCodeAt(0);
                                var $5205 = self.slice(1);
                                var $5206 = ($5204 === 40);
                                var _wrap$8 = $5206;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5207 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5207;
                            } else {
                                var $5208 = _func$7;
                                var _func$10 = $5208;
                            };
                            var $5202 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5200 = $5202;
                        };
                        return $5200;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Term$show$app = x0 => x1 => x2 => Fm$Term$show$app$(x0, x1, x2);

    function Map$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $5210 = _list$4;
                var $5209 = $5210;
                break;
            case 'Map.tie':
                var $5211 = self.val;
                var $5212 = self.lft;
                var $5213 = self.rgt;
                var self = $5211;
                switch (self._) {
                    case 'Maybe.none':
                        var $5215 = _list$4;
                        var _list0$8 = $5215;
                        break;
                    case 'Maybe.some':
                        var $5216 = self.value;
                        var $5217 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5216), _list$4);
                        var _list0$8 = $5217;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5212, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5213, (_key$3 + '1'), _list1$9);
                var $5214 = _list2$10;
                var $5209 = $5214;
                break;
        };
        return $5209;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5218 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5218;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $5220 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5219 = $5220;
                break;
            case 'o':
                var $5221 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5223 = List$cons$(_head$6, _tail$7);
                    var $5222 = $5223;
                } else {
                    var $5224 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5225 = Bits$chunks_of$go$(_len$1, $5221, $5224, _chunk$7);
                    var $5222 = $5225;
                };
                var $5219 = $5222;
                break;
            case 'i':
                var $5226 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5228 = List$cons$(_head$6, _tail$7);
                    var $5227 = $5228;
                } else {
                    var $5229 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5230 = Bits$chunks_of$go$(_len$1, $5226, $5229, _chunk$7);
                    var $5227 = $5230;
                };
                var $5219 = $5227;
                break;
        };
        return $5219;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5231 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5231;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5233 = Word$e;
            var $5232 = $5233;
        } else {
            var $5234 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'e':
                    var $5236 = Word$o$(Word$from_bits$($5234, Bits$e));
                    var $5235 = $5236;
                    break;
                case 'o':
                    var $5237 = self.slice(0, -1);
                    var $5238 = Word$o$(Word$from_bits$($5234, $5237));
                    var $5235 = $5238;
                    break;
                case 'i':
                    var $5239 = self.slice(0, -1);
                    var $5240 = Word$i$(Word$from_bits$($5234, $5239));
                    var $5235 = $5240;
                    break;
            };
            var $5232 = $5235;
        };
        return $5232;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Fm$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5243 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5243;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5245 = ((_u16$5 + 71) & 0xFFFF);
                    var $5244 = $5245;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5247 = (Math.max(_u16$5 - 4, 0));
                        var $5246 = $5247;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5249 = 46;
                            var $5248 = $5249;
                        } else {
                            var $5250 = 95;
                            var $5248 = $5250;
                        };
                        var $5246 = $5248;
                    };
                    var $5244 = $5246;
                };
                var _chr$6 = $5244;
            };
            var $5242 = String$cons$(_chr$6, _name$4);
            return $5242;
        }));
        var $5241 = _name$3;
        return $5241;
    };
    const Fm$Name$from_bits = x0 => Fm$Name$from_bits$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $5252 = self.fst;
                var $5253 = self.snd;
                var $5254 = $5252;
                var $5251 = $5254;
                break;
        };
        return $5251;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Fm$Term$show$go$(_term$1, _path$2) {
        var self = Fm$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $5257 = self.name;
                        var $5258 = self.indx;
                        var $5259 = Fm$Name$show$($5257);
                        var $5256 = $5259;
                        break;
                    case 'Fm.Term.ref':
                        var $5260 = self.name;
                        var _name$4 = Fm$Name$show$($5260);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5262 = _name$4;
                                var $5261 = $5262;
                                break;
                            case 'Maybe.some':
                                var $5263 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Fm$Path$to_bits$($5263));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5264 = String$flatten$(List$cons$(_name$4, List$cons$(Fm$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5261 = $5264;
                                break;
                        };
                        var $5256 = $5261;
                        break;
                    case 'Fm.Term.typ':
                        var $5265 = "Type";
                        var $5256 = $5265;
                        break;
                    case 'Fm.Term.all':
                        var $5266 = self.eras;
                        var $5267 = self.self;
                        var $5268 = self.name;
                        var $5269 = self.xtyp;
                        var $5270 = self.body;
                        var _eras$8 = $5266;
                        var _self$9 = Fm$Name$show$($5267);
                        var _name$10 = Fm$Name$show$($5268);
                        var _type$11 = Fm$Term$show$go$($5269, Fm$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5272 = "<";
                            var _open$12 = $5272;
                        } else {
                            var $5273 = "(";
                            var _open$12 = $5273;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5274 = ">";
                            var _clos$13 = $5274;
                        } else {
                            var $5275 = ")";
                            var _clos$13 = $5275;
                        };
                        var _body$14 = Fm$Term$show$go$($5270(Fm$Term$var$($5267, 0n))(Fm$Term$var$($5268, 0n)), Fm$MPath$i$(_path$2));
                        var $5271 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5256 = $5271;
                        break;
                    case 'Fm.Term.lam':
                        var $5276 = self.name;
                        var $5277 = self.body;
                        var _name$5 = Fm$Name$show$($5276);
                        var _body$6 = Fm$Term$show$go$($5277(Fm$Term$var$($5276, 0n)), Fm$MPath$o$(_path$2));
                        var $5278 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5256 = $5278;
                        break;
                    case 'Fm.Term.app':
                        var $5279 = self.func;
                        var $5280 = self.argm;
                        var $5281 = Fm$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5256 = $5281;
                        break;
                    case 'Fm.Term.let':
                        var $5282 = self.name;
                        var $5283 = self.expr;
                        var $5284 = self.body;
                        var _name$6 = Fm$Name$show$($5282);
                        var _expr$7 = Fm$Term$show$go$($5283, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5284(Fm$Term$var$($5282, 0n)), Fm$MPath$i$(_path$2));
                        var $5285 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5256 = $5285;
                        break;
                    case 'Fm.Term.def':
                        var $5286 = self.name;
                        var $5287 = self.expr;
                        var $5288 = self.body;
                        var _name$6 = Fm$Name$show$($5286);
                        var _expr$7 = Fm$Term$show$go$($5287, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5288(Fm$Term$var$($5286, 0n)), Fm$MPath$i$(_path$2));
                        var $5289 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5256 = $5289;
                        break;
                    case 'Fm.Term.ann':
                        var $5290 = self.done;
                        var $5291 = self.term;
                        var $5292 = self.type;
                        var _term$6 = Fm$Term$show$go$($5291, Fm$MPath$o$(_path$2));
                        var _type$7 = Fm$Term$show$go$($5292, Fm$MPath$i$(_path$2));
                        var $5293 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5256 = $5293;
                        break;
                    case 'Fm.Term.gol':
                        var $5294 = self.name;
                        var $5295 = self.dref;
                        var $5296 = self.verb;
                        var _name$6 = Fm$Name$show$($5294);
                        var $5297 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5256 = $5297;
                        break;
                    case 'Fm.Term.hol':
                        var $5298 = self.path;
                        var $5299 = "_";
                        var $5256 = $5299;
                        break;
                    case 'Fm.Term.nat':
                        var $5300 = self.natx;
                        var $5301 = String$flatten$(List$cons$(Nat$show$($5300), List$nil));
                        var $5256 = $5301;
                        break;
                    case 'Fm.Term.chr':
                        var $5302 = self.chrx;
                        var $5303 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($5302), List$cons$("\'", List$nil))));
                        var $5256 = $5303;
                        break;
                    case 'Fm.Term.str':
                        var $5304 = self.strx;
                        var $5305 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($5304), List$cons$("\"", List$nil))));
                        var $5256 = $5305;
                        break;
                    case 'Fm.Term.cse':
                        var $5306 = self.path;
                        var $5307 = self.expr;
                        var $5308 = self.name;
                        var $5309 = self.with;
                        var $5310 = self.cses;
                        var $5311 = self.moti;
                        var _expr$9 = Fm$Term$show$go$($5307, Fm$MPath$o$(_path$2));
                        var _name$10 = Fm$Name$show$($5308);
                        var _wyth$11 = String$join$("", List$mapped$($5309, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5314 = self.file;
                                    var $5315 = self.code;
                                    var $5316 = self.name;
                                    var $5317 = self.term;
                                    var $5318 = self.type;
                                    var $5319 = self.stat;
                                    var _name$18 = Fm$Name$show$($5316);
                                    var _type$19 = Fm$Term$show$go$($5318, Maybe$none);
                                    var _term$20 = Fm$Term$show$go$($5317, Maybe$none);
                                    var $5320 = String$flatten$(List$cons$(_name$18, List$cons$(": ", List$cons$(_type$19, List$cons$(" = ", List$cons$(_term$20, List$cons$(";", List$nil)))))));
                                    var $5313 = $5320;
                                    break;
                            };
                            return $5313;
                        })));
                        var _cses$12 = Map$to_list$($5310);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Fm$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Fm$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5321 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5321;
                        })));
                        var self = $5311;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5322 = "";
                                var _moti$14 = $5322;
                                break;
                            case 'Maybe.some':
                                var $5323 = self.value;
                                var $5324 = String$flatten$(List$cons$(": ", List$cons$(Fm$Term$show$go$($5323, Maybe$none), List$nil)));
                                var _moti$14 = $5324;
                                break;
                        };
                        var $5312 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5256 = $5312;
                        break;
                    case 'Fm.Term.ori':
                        var $5325 = self.orig;
                        var $5326 = self.expr;
                        var $5327 = Fm$Term$show$go$($5326, _path$2);
                        var $5256 = $5327;
                        break;
                };
                var $5255 = $5256;
                break;
            case 'Maybe.some':
                var $5328 = self.value;
                var $5329 = $5328;
                var $5255 = $5329;
                break;
        };
        return $5255;
    };
    const Fm$Term$show$go = x0 => x1 => Fm$Term$show$go$(x0, x1);

    function Fm$Term$show$(_term$1) {
        var $5330 = Fm$Term$show$go$(_term$1, Maybe$none);
        return $5330;
    };
    const Fm$Term$show = x0 => Fm$Term$show$(x0);

    function Fm$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.nil':
                var $5332 = List$nil;
                var $5331 = $5332;
                break;
            case 'List.cons':
                var $5333 = self.head;
                var $5334 = self.tail;
                var self = $5333;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5336 = self.origin;
                        var $5337 = self.expected;
                        var $5338 = self.detected;
                        var $5339 = self.context;
                        var $5340 = (!_got$2);
                        var _keep$5 = $5340;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5341 = self.name;
                        var $5342 = self.dref;
                        var $5343 = self.verb;
                        var $5344 = self.goal;
                        var $5345 = self.context;
                        var $5346 = Bool$true;
                        var _keep$5 = $5346;
                        break;
                    case 'Fm.Error.waiting':
                        var $5347 = self.name;
                        var $5348 = Bool$false;
                        var _keep$5 = $5348;
                        break;
                    case 'Fm.Error.indirect':
                        var $5349 = self.name;
                        var $5350 = Bool$false;
                        var _keep$5 = $5350;
                        break;
                    case 'Fm.Error.patch':
                        var $5351 = self.path;
                        var $5352 = self.term;
                        var $5353 = Bool$false;
                        var _keep$5 = $5353;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5354 = self.origin;
                        var $5355 = self.name;
                        var $5356 = (!_got$2);
                        var _keep$5 = $5356;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5357 = self.origin;
                        var $5358 = self.term;
                        var $5359 = self.context;
                        var $5360 = (!_got$2);
                        var _keep$5 = $5360;
                        break;
                };
                var self = $5333;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5361 = self.origin;
                        var $5362 = self.expected;
                        var $5363 = self.detected;
                        var $5364 = self.context;
                        var $5365 = Bool$true;
                        var _got$6 = $5365;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5366 = self.name;
                        var $5367 = self.dref;
                        var $5368 = self.verb;
                        var $5369 = self.goal;
                        var $5370 = self.context;
                        var $5371 = _got$2;
                        var _got$6 = $5371;
                        break;
                    case 'Fm.Error.waiting':
                        var $5372 = self.name;
                        var $5373 = _got$2;
                        var _got$6 = $5373;
                        break;
                    case 'Fm.Error.indirect':
                        var $5374 = self.name;
                        var $5375 = _got$2;
                        var _got$6 = $5375;
                        break;
                    case 'Fm.Error.patch':
                        var $5376 = self.path;
                        var $5377 = self.term;
                        var $5378 = _got$2;
                        var _got$6 = $5378;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5379 = self.origin;
                        var $5380 = self.name;
                        var $5381 = Bool$true;
                        var _got$6 = $5381;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5382 = self.origin;
                        var $5383 = self.term;
                        var $5384 = self.context;
                        var $5385 = _got$2;
                        var _got$6 = $5385;
                        break;
                };
                var _tail$7 = Fm$Error$relevant$($5334, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5386 = List$cons$($5333, _tail$7);
                    var $5335 = $5386;
                } else {
                    var $5387 = _tail$7;
                    var $5335 = $5387;
                };
                var $5331 = $5335;
                break;
        };
        return $5331;
    };
    const Fm$Error$relevant = x0 => x1 => Fm$Error$relevant$(x0, x1);

    function Fm$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.nil':
                var $5389 = "";
                var $5388 = $5389;
                break;
            case 'List.cons':
                var $5390 = self.head;
                var $5391 = self.tail;
                var self = $5390;
                switch (self._) {
                    case 'Pair.new':
                        var $5393 = self.fst;
                        var $5394 = self.snd;
                        var _name$6 = Fm$Name$show$($5393);
                        var _type$7 = Fm$Term$show$($5394);
                        var _rest$8 = Fm$Context$show$($5391);
                        var $5395 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5392 = $5395;
                        break;
                };
                var $5388 = $5392;
                break;
        };
        return $5388;
    };
    const Fm$Context$show = x0 => Fm$Context$show$(x0);

    function Fm$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5396 = Fm$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Fm.Term.var':
                    var $5398 = self.name;
                    var $5399 = self.indx;
                    var $5400 = _term$4;
                    var $5397 = $5400;
                    break;
                case 'Fm.Term.ref':
                    var $5401 = self.name;
                    var self = Fm$get$($5401, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5403 = Fm$Term$ref$($5401);
                            var $5402 = $5403;
                            break;
                        case 'Maybe.some':
                            var $5404 = self.value;
                            var self = $5404;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5406 = self.file;
                                    var $5407 = self.code;
                                    var $5408 = self.name;
                                    var $5409 = self.term;
                                    var $5410 = self.type;
                                    var $5411 = self.stat;
                                    var $5412 = $5409;
                                    var $5405 = $5412;
                                    break;
                            };
                            var $5402 = $5405;
                            break;
                    };
                    var $5397 = $5402;
                    break;
                case 'Fm.Term.typ':
                    var $5413 = _term$4;
                    var $5397 = $5413;
                    break;
                case 'Fm.Term.all':
                    var $5414 = self.eras;
                    var $5415 = self.self;
                    var $5416 = self.name;
                    var $5417 = self.xtyp;
                    var $5418 = self.body;
                    var $5419 = _term$4;
                    var $5397 = $5419;
                    break;
                case 'Fm.Term.lam':
                    var $5420 = self.name;
                    var $5421 = self.body;
                    var $5422 = _term$4;
                    var $5397 = $5422;
                    break;
                case 'Fm.Term.app':
                    var $5423 = self.func;
                    var $5424 = self.argm;
                    var $5425 = _term$4;
                    var $5397 = $5425;
                    break;
                case 'Fm.Term.let':
                    var $5426 = self.name;
                    var $5427 = self.expr;
                    var $5428 = self.body;
                    var $5429 = _term$4;
                    var $5397 = $5429;
                    break;
                case 'Fm.Term.def':
                    var $5430 = self.name;
                    var $5431 = self.expr;
                    var $5432 = self.body;
                    var $5433 = _term$4;
                    var $5397 = $5433;
                    break;
                case 'Fm.Term.ann':
                    var $5434 = self.done;
                    var $5435 = self.term;
                    var $5436 = self.type;
                    var $5437 = _term$4;
                    var $5397 = $5437;
                    break;
                case 'Fm.Term.gol':
                    var $5438 = self.name;
                    var $5439 = self.dref;
                    var $5440 = self.verb;
                    var $5441 = _term$4;
                    var $5397 = $5441;
                    break;
                case 'Fm.Term.hol':
                    var $5442 = self.path;
                    var $5443 = _term$4;
                    var $5397 = $5443;
                    break;
                case 'Fm.Term.nat':
                    var $5444 = self.natx;
                    var $5445 = _term$4;
                    var $5397 = $5445;
                    break;
                case 'Fm.Term.chr':
                    var $5446 = self.chrx;
                    var $5447 = _term$4;
                    var $5397 = $5447;
                    break;
                case 'Fm.Term.str':
                    var $5448 = self.strx;
                    var $5449 = _term$4;
                    var $5397 = $5449;
                    break;
                case 'Fm.Term.cse':
                    var $5450 = self.path;
                    var $5451 = self.expr;
                    var $5452 = self.name;
                    var $5453 = self.with;
                    var $5454 = self.cses;
                    var $5455 = self.moti;
                    var $5456 = _term$4;
                    var $5397 = $5456;
                    break;
                case 'Fm.Term.ori':
                    var $5457 = self.orig;
                    var $5458 = self.expr;
                    var $5459 = _term$4;
                    var $5397 = $5459;
                    break;
            };
            return $5397;
        }));
        return $5396;
    };
    const Fm$Term$expand_at = x0 => x1 => x2 => Fm$Term$expand_at$(x0, x1, x2);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Fm$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5461 = self.name;
                var $5462 = self.indx;
                var $5463 = Fm$Term$var$($5461, $5462);
                var $5460 = $5463;
                break;
            case 'Fm.Term.ref':
                var $5464 = self.name;
                var _expand$5 = Bool$false;
                var _expand$6 = ((($5464 === "Nat.succ") && (_arity$3 > 1n)) || _expand$5);
                var _expand$7 = ((($5464 === "Nat.zero") && (_arity$3 > 0n)) || _expand$6);
                var _expand$8 = ((($5464 === "Bool.true") && (_arity$3 > 0n)) || _expand$7);
                var _expand$9 = ((($5464 === "Bool.false") && (_arity$3 > 0n)) || _expand$8);
                var self = _expand$9;
                if (self) {
                    var self = Fm$get$($5464, _defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5467 = Fm$Term$ref$($5464);
                            var $5466 = $5467;
                            break;
                        case 'Maybe.some':
                            var $5468 = self.value;
                            var self = $5468;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5470 = self.file;
                                    var $5471 = self.code;
                                    var $5472 = self.name;
                                    var $5473 = self.term;
                                    var $5474 = self.type;
                                    var $5475 = self.stat;
                                    var $5476 = $5473;
                                    var $5469 = $5476;
                                    break;
                            };
                            var $5466 = $5469;
                            break;
                    };
                    var $5465 = $5466;
                } else {
                    var $5477 = Fm$Term$ref$($5464);
                    var $5465 = $5477;
                };
                var $5460 = $5465;
                break;
            case 'Fm.Term.typ':
                var $5478 = Fm$Term$typ;
                var $5460 = $5478;
                break;
            case 'Fm.Term.all':
                var $5479 = self.eras;
                var $5480 = self.self;
                var $5481 = self.name;
                var $5482 = self.xtyp;
                var $5483 = self.body;
                var $5484 = Fm$Term$all$($5479, $5480, $5481, Fm$Term$expand_ct$($5482, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5485 = Fm$Term$expand_ct$($5483(_s$9)(_x$10), _defs$2, 0n);
                    return $5485;
                }));
                var $5460 = $5484;
                break;
            case 'Fm.Term.lam':
                var $5486 = self.name;
                var $5487 = self.body;
                var $5488 = Fm$Term$lam$($5486, (_x$6 => {
                    var $5489 = Fm$Term$expand_ct$($5487(_x$6), _defs$2, 0n);
                    return $5489;
                }));
                var $5460 = $5488;
                break;
            case 'Fm.Term.app':
                var $5490 = self.func;
                var $5491 = self.argm;
                var $5492 = Fm$Term$app$(Fm$Term$expand_ct$($5490, _defs$2, Nat$succ$(_arity$3)), Fm$Term$expand_ct$($5491, _defs$2, 0n));
                var $5460 = $5492;
                break;
            case 'Fm.Term.let':
                var $5493 = self.name;
                var $5494 = self.expr;
                var $5495 = self.body;
                var $5496 = Fm$Term$let$($5493, Fm$Term$expand_ct$($5494, _defs$2, 0n), (_x$7 => {
                    var $5497 = Fm$Term$expand_ct$($5495(_x$7), _defs$2, 0n);
                    return $5497;
                }));
                var $5460 = $5496;
                break;
            case 'Fm.Term.def':
                var $5498 = self.name;
                var $5499 = self.expr;
                var $5500 = self.body;
                var $5501 = Fm$Term$def$($5498, Fm$Term$expand_ct$($5499, _defs$2, 0n), (_x$7 => {
                    var $5502 = Fm$Term$expand_ct$($5500(_x$7), _defs$2, 0n);
                    return $5502;
                }));
                var $5460 = $5501;
                break;
            case 'Fm.Term.ann':
                var $5503 = self.done;
                var $5504 = self.term;
                var $5505 = self.type;
                var $5506 = Fm$Term$ann$($5503, Fm$Term$expand_ct$($5504, _defs$2, 0n), Fm$Term$expand_ct$($5505, _defs$2, 0n));
                var $5460 = $5506;
                break;
            case 'Fm.Term.gol':
                var $5507 = self.name;
                var $5508 = self.dref;
                var $5509 = self.verb;
                var $5510 = Fm$Term$gol$($5507, $5508, $5509);
                var $5460 = $5510;
                break;
            case 'Fm.Term.hol':
                var $5511 = self.path;
                var $5512 = Fm$Term$hol$($5511);
                var $5460 = $5512;
                break;
            case 'Fm.Term.nat':
                var $5513 = self.natx;
                var $5514 = Fm$Term$nat$($5513);
                var $5460 = $5514;
                break;
            case 'Fm.Term.chr':
                var $5515 = self.chrx;
                var $5516 = Fm$Term$chr$($5515);
                var $5460 = $5516;
                break;
            case 'Fm.Term.str':
                var $5517 = self.strx;
                var $5518 = Fm$Term$str$($5517);
                var $5460 = $5518;
                break;
            case 'Fm.Term.cse':
                var $5519 = self.path;
                var $5520 = self.expr;
                var $5521 = self.name;
                var $5522 = self.with;
                var $5523 = self.cses;
                var $5524 = self.moti;
                var $5525 = _term$1;
                var $5460 = $5525;
                break;
            case 'Fm.Term.ori':
                var $5526 = self.orig;
                var $5527 = self.expr;
                var $5528 = Fm$Term$ori$($5526, $5527);
                var $5460 = $5528;
                break;
        };
        return $5460;
    };
    const Fm$Term$expand_ct = x0 => x1 => x2 => Fm$Term$expand_ct$(x0, x1, x2);

    function Fm$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Fm$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5531 = _term$4;
            var $5532 = _dref$1;
            let _term$6 = $5531;
            let _path$5;
            while ($5532._ === 'List.cons') {
                _path$5 = $5532.head;
                var _term$7 = Fm$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Fm$Term$normalize$(_term$7, Map$new);
                var _term$9 = Fm$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Fm$Term$normalize$(_term$9, Map$new);
                var $5531 = _term$10;
                _term$6 = $5531;
                $5532 = $5532.tail;
            }
            return _term$6;
        })();
        var $5529 = _term$5;
        return $5529;
    };
    const Fm$Term$expand = x0 => x1 => x2 => Fm$Term$expand$(x0, x1, x2);

    function Fm$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5534 = self.origin;
                var $5535 = self.expected;
                var $5536 = self.detected;
                var $5537 = self.context;
                var self = $5535;
                switch (self._) {
                    case 'Either.left':
                        var $5539 = self.value;
                        var $5540 = $5539;
                        var _expected$7 = $5540;
                        break;
                    case 'Either.right':
                        var $5541 = self.value;
                        var $5542 = Fm$Term$show$(Fm$Term$normalize$($5541, Map$new));
                        var _expected$7 = $5542;
                        break;
                };
                var self = $5536;
                switch (self._) {
                    case 'Either.left':
                        var $5543 = self.value;
                        var $5544 = $5543;
                        var _detected$8 = $5544;
                        break;
                    case 'Either.right':
                        var $5545 = self.value;
                        var $5546 = Fm$Term$show$(Fm$Term$normalize$($5545, Map$new));
                        var _detected$8 = $5546;
                        break;
                };
                var $5538 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5537;
                    switch (self._) {
                        case 'List.nil':
                            var $5547 = "";
                            return $5547;
                        case 'List.cons':
                            var $5548 = self.head;
                            var $5549 = self.tail;
                            var $5550 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Fm$Context$show$($5537), List$nil)));
                            return $5550;
                    };
                })(), List$nil)))))))));
                var $5533 = $5538;
                break;
            case 'Fm.Error.show_goal':
                var $5551 = self.name;
                var $5552 = self.dref;
                var $5553 = self.verb;
                var $5554 = self.goal;
                var $5555 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Fm$Name$show$($5551), List$cons$(":\u{a}", List$nil))));
                var self = $5554;
                switch (self._) {
                    case 'Maybe.none':
                        var $5557 = "";
                        var _with_type$9 = $5557;
                        break;
                    case 'Maybe.some':
                        var $5558 = self.value;
                        var _goal$10 = Fm$Term$expand$($5552, $5558, _defs$2);
                        var $5559 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5553;
                            if (self) {
                                var $5560 = Fm$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5561 = _x$11;
                                    return $5561;
                                })));
                                return $5560;
                            } else {
                                var $5562 = Fm$Term$show$(_goal$10);
                                return $5562;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5559;
                        break;
                };
                var self = $5555;
                switch (self._) {
                    case 'List.nil':
                        var $5563 = "";
                        var _with_ctxt$10 = $5563;
                        break;
                    case 'List.cons':
                        var $5564 = self.head;
                        var $5565 = self.tail;
                        var $5566 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Fm$Context$show$($5555), List$nil)));
                        var _with_ctxt$10 = $5566;
                        break;
                };
                var $5556 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5533 = $5556;
                break;
            case 'Fm.Error.waiting':
                var $5567 = self.name;
                var $5568 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5567, List$cons$("\'.", List$nil))));
                var $5533 = $5568;
                break;
            case 'Fm.Error.indirect':
                var $5569 = self.name;
                var $5570 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5569, List$cons$("\'.", List$nil))));
                var $5533 = $5570;
                break;
            case 'Fm.Error.patch':
                var $5571 = self.path;
                var $5572 = self.term;
                var $5573 = String$flatten$(List$cons$("Patching: ", List$cons$(Fm$Term$show$($5572), List$nil)));
                var $5533 = $5573;
                break;
            case 'Fm.Error.undefined_reference':
                var $5574 = self.origin;
                var $5575 = self.name;
                var $5576 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Fm$Name$show$($5575), List$cons$("\u{a}", List$nil))));
                var $5533 = $5576;
                break;
            case 'Fm.Error.cant_infer':
                var $5577 = self.origin;
                var $5578 = self.term;
                var $5579 = self.context;
                var _term$6 = Fm$Term$show$($5578);
                var _context$7 = Fm$Context$show$($5579);
                var $5580 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5533 = $5580;
                break;
        };
        return $5533;
    };
    const Fm$Error$show = x0 => x1 => Fm$Error$show$(x0, x1);

    function Fm$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5582 = self.origin;
                var $5583 = self.expected;
                var $5584 = self.detected;
                var $5585 = self.context;
                var $5586 = $5582;
                var $5581 = $5586;
                break;
            case 'Fm.Error.show_goal':
                var $5587 = self.name;
                var $5588 = self.dref;
                var $5589 = self.verb;
                var $5590 = self.goal;
                var $5591 = self.context;
                var $5592 = Maybe$none;
                var $5581 = $5592;
                break;
            case 'Fm.Error.waiting':
                var $5593 = self.name;
                var $5594 = Maybe$none;
                var $5581 = $5594;
                break;
            case 'Fm.Error.indirect':
                var $5595 = self.name;
                var $5596 = Maybe$none;
                var $5581 = $5596;
                break;
            case 'Fm.Error.patch':
                var $5597 = self.path;
                var $5598 = self.term;
                var $5599 = Maybe$none;
                var $5581 = $5599;
                break;
            case 'Fm.Error.undefined_reference':
                var $5600 = self.origin;
                var $5601 = self.name;
                var $5602 = $5600;
                var $5581 = $5602;
                break;
            case 'Fm.Error.cant_infer':
                var $5603 = self.origin;
                var $5604 = self.term;
                var $5605 = self.context;
                var $5606 = $5603;
                var $5581 = $5606;
                break;
        };
        return $5581;
    };
    const Fm$Error$origin = x0 => Fm$Error$origin$(x0);

    function Fm$Defs$report$go$(_defs$1, _list$2, _errs$3, _typs$4) {
        var Fm$Defs$report$go$ = (_defs$1, _list$2, _errs$3, _typs$4) => ({
            ctr: 'TCO',
            arg: [_defs$1, _list$2, _errs$3, _typs$4]
        });
        var Fm$Defs$report$go = _defs$1 => _list$2 => _errs$3 => _typs$4 => Fm$Defs$report$go$(_defs$1, _list$2, _errs$3, _typs$4);
        var arg = [_defs$1, _list$2, _errs$3, _typs$4];
        while (true) {
            let [_defs$1, _list$2, _errs$3, _typs$4] = arg;
            var R = (() => {
                var self = _list$2;
                switch (self._) {
                    case 'List.nil':
                        var $5607 = String$flatten$(List$cons$(_typs$4, List$cons$("\u{a}", List$cons$((() => {
                            var self = _errs$3;
                            if (self.length === 0) {
                                var $5608 = "All terms check.";
                                return $5608;
                            } else {
                                var $5609 = self.charCodeAt(0);
                                var $5610 = self.slice(1);
                                var $5611 = _errs$3;
                                return $5611;
                            };
                        })(), List$nil))));
                        return $5607;
                    case 'List.cons':
                        var $5612 = self.head;
                        var $5613 = self.tail;
                        var _name$7 = $5612;
                        var self = Fm$get$(_name$7, _defs$1);
                        switch (self._) {
                            case 'Maybe.none':
                                var $5615 = Fm$Defs$report$go$(_defs$1, $5613, _errs$3, _typs$4);
                                var $5614 = $5615;
                                break;
                            case 'Maybe.some':
                                var $5616 = self.value;
                                var self = $5616;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $5618 = self.file;
                                        var $5619 = self.code;
                                        var $5620 = self.name;
                                        var $5621 = self.term;
                                        var $5622 = self.type;
                                        var $5623 = self.stat;
                                        var _typs$15 = String$flatten$(List$cons$(_typs$4, List$cons$(_name$7, List$cons$(": ", List$cons$(Fm$Term$show$($5622), List$cons$("\u{a}", List$nil))))));
                                        var self = $5623;
                                        switch (self._) {
                                            case 'Fm.Status.init':
                                                var $5625 = Fm$Defs$report$go$(_defs$1, $5613, _errs$3, _typs$15);
                                                var $5624 = $5625;
                                                break;
                                            case 'Fm.Status.wait':
                                                var $5626 = Fm$Defs$report$go$(_defs$1, $5613, _errs$3, _typs$15);
                                                var $5624 = $5626;
                                                break;
                                            case 'Fm.Status.done':
                                                var $5627 = Fm$Defs$report$go$(_defs$1, $5613, _errs$3, _typs$15);
                                                var $5624 = $5627;
                                                break;
                                            case 'Fm.Status.fail':
                                                var $5628 = self.errors;
                                                var self = $5628;
                                                switch (self._) {
                                                    case 'List.nil':
                                                        var $5630 = Fm$Defs$report$go$(_defs$1, $5613, _errs$3, _typs$15);
                                                        var $5629 = $5630;
                                                        break;
                                                    case 'List.cons':
                                                        var $5631 = self.head;
                                                        var $5632 = self.tail;
                                                        var _name_str$19 = Fm$Name$show$($5620);
                                                        var _rel_errs$20 = Fm$Error$relevant$($5628, Bool$false);
                                                        var _rel_msgs$21 = List$mapped$(_rel_errs$20, (_err$21 => {
                                                            var $5634 = String$flatten$(List$cons$(Fm$Error$show$(_err$21, _defs$1), List$cons$((() => {
                                                                var self = Fm$Error$origin$(_err$21);
                                                                switch (self._) {
                                                                    case 'Maybe.none':
                                                                        var $5635 = "";
                                                                        return $5635;
                                                                    case 'Maybe.some':
                                                                        var $5636 = self.value;
                                                                        var self = $5636;
                                                                        switch (self._) {
                                                                            case 'Fm.Origin.new':
                                                                                var $5638 = self.file;
                                                                                var $5639 = self.from;
                                                                                var $5640 = self.upto;
                                                                                var $5641 = String$flatten$(List$cons$("Inside \'", List$cons$($5618, List$cons$("\':\u{a}", List$cons$(Fm$highlight$($5619, $5639, $5640), List$cons$("\u{a}", List$nil))))));
                                                                                var $5637 = $5641;
                                                                                break;
                                                                        };
                                                                        return $5637;
                                                                };
                                                            })(), List$nil)));
                                                            return $5634;
                                                        }));
                                                        var _errs$22 = String$flatten$(List$cons$(_errs$3, List$cons$(String$join$("\u{a}", _rel_msgs$21), List$cons$("\u{a}", List$nil))));
                                                        var $5633 = Fm$Defs$report$go$(_defs$1, $5613, _errs$22, _typs$15);
                                                        var $5629 = $5633;
                                                        break;
                                                };
                                                var $5624 = $5629;
                                                break;
                                        };
                                        var $5617 = $5624;
                                        break;
                                };
                                var $5614 = $5617;
                                break;
                        };
                        return $5614;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Defs$report$go = x0 => x1 => x2 => x3 => Fm$Defs$report$go$(x0, x1, x2, x3);

    function Fm$Defs$report$(_defs$1, _list$2) {
        var $5642 = Fm$Defs$report$go$(_defs$1, _list$2, "", "");
        return $5642;
    };
    const Fm$Defs$report = x0 => x1 => Fm$Defs$report$(x0, x1);

    function Fm$checker$io$one$(_name$1) {
        var $5643 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $5644 = IO$print$(Fm$Defs$report$(_defs$2, List$cons$(_name$1, List$nil)));
            return $5644;
        }));
        return $5643;
    };
    const Fm$checker$io$one = x0 => Fm$checker$io$one$(x0);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $5646 = _list$4;
                var $5645 = $5646;
                break;
            case 'Map.tie':
                var $5647 = self.val;
                var $5648 = self.lft;
                var $5649 = self.rgt;
                var self = $5647;
                switch (self._) {
                    case 'Maybe.none':
                        var $5651 = _list$4;
                        var _list0$8 = $5651;
                        break;
                    case 'Maybe.some':
                        var $5652 = self.value;
                        var $5653 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5653;
                        break;
                };
                var _list1$9 = Map$keys$go$($5648, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5649, (_key$3 + '1'), _list1$9);
                var $5650 = _list2$10;
                var $5645 = $5650;
                break;
        };
        return $5645;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5654 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5654;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Fm$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.nil':
                var $5656 = Monad$pure$(IO$monad)(_defs$2);
                var $5655 = $5656;
                break;
            case 'List.cons':
                var $5657 = self.head;
                var $5658 = self.tail;
                var $5659 = Monad$bind$(IO$monad)(Fm$Synth$one$($5657, _defs$2))((_defs$5 => {
                    var $5660 = Fm$Synth$many$($5658, _defs$5);
                    return $5660;
                }));
                var $5655 = $5659;
                break;
        };
        return $5655;
    };
    const Fm$Synth$many = x0 => x1 => Fm$Synth$many$(x0, x1);

    function Fm$Synth$file$(_file$1, _defs$2) {
        var $5661 = Monad$bind$(IO$monad)(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Fm$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5663 = self.value;
                    var $5664 = Monad$pure$(IO$monad)(Either$left$($5663));
                    var $5662 = $5664;
                    break;
                case 'Either.right':
                    var $5665 = self.value;
                    var _file_defs$6 = $5665;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Fm$Name$from_bits);
                    var $5666 = Monad$bind$(IO$monad)(Fm$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5667 = Monad$pure$(IO$monad)(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5667;
                    }));
                    var $5662 = $5666;
                    break;
            };
            return $5662;
        }));
        return $5661;
    };
    const Fm$Synth$file = x0 => x1 => Fm$Synth$file$(x0, x1);

    function Fm$checker$io$file$(_file$1) {
        var $5668 = Monad$bind$(IO$monad)(Fm$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5670 = self.value;
                    var $5671 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5672 = IO$print$($5670);
                        return $5672;
                    }));
                    var $5669 = $5671;
                    break;
                case 'Either.right':
                    var $5673 = self.value;
                    var self = $5673;
                    switch (self._) {
                        case 'Pair.new':
                            var $5675 = self.fst;
                            var $5676 = self.snd;
                            var _nams$6 = $5675;
                            var _defs$7 = $5676;
                            var $5677 = IO$print$(Fm$Defs$report$(_defs$7, _nams$6));
                            var $5674 = $5677;
                            break;
                    };
                    var $5669 = $5674;
                    break;
            };
            return $5669;
        }));
        return $5668;
    };
    const Fm$checker$io$file = x0 => Fm$checker$io$file$(x0);

    function IO$purify$(_io$2) {
        var IO$purify$ = (_io$2) => ({
            ctr: 'TCO',
            arg: [_io$2]
        });
        var IO$purify = _io$2 => IO$purify$(_io$2);
        var arg = [_io$2];
        while (true) {
            let [_io$2] = arg;
            var R = (() => {
                var self = _io$2;
                switch (self._) {
                    case 'IO.end':
                        var $5678 = self.value;
                        var $5679 = $5678;
                        return $5679;
                    case 'IO.ask':
                        var $5680 = self.query;
                        var $5681 = self.param;
                        var $5682 = self.then;
                        var $5683 = IO$purify$($5682(""));
                        return $5683;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const IO$purify = x0 => IO$purify$(x0);

    function Fm$checker$code$(_code$1) {
        var self = Fm$Defs$read$("Main.fm", _code$1, Map$new);
        switch (self._) {
            case 'Either.left':
                var $5685 = self.value;
                var $5686 = $5685;
                var $5684 = $5686;
                break;
            case 'Either.right':
                var $5687 = self.value;
                var $5688 = IO$purify$((() => {
                    var _defs$3 = $5687;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Fm$Name$from_bits);
                    var $5689 = Monad$bind$(IO$monad)(Fm$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5690 = Monad$pure$(IO$monad)(Fm$Defs$report$(_defs$5, _nams$4));
                        return $5690;
                    }));
                    return $5689;
                })());
                var $5684 = $5688;
                break;
        };
        return $5684;
    };
    const Fm$checker$code = x0 => Fm$checker$code$(x0);

    function Fm$Term$read$(_code$1) {
        var self = Fm$Parser$term(0n)(_code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $5692 = self.idx;
                var $5693 = self.code;
                var $5694 = self.err;
                var $5695 = Maybe$none;
                var $5691 = $5695;
                break;
            case 'Parser.Reply.value':
                var $5696 = self.idx;
                var $5697 = self.code;
                var $5698 = self.val;
                var $5699 = Maybe$some$($5698);
                var $5691 = $5699;
                break;
        };
        return $5691;
    };
    const Fm$Term$read = x0 => Fm$Term$read$(x0);
    const Fm = (() => {
        var __$1 = Fm$to_core$io$one;
        var __$2 = Fm$checker$io$one;
        var __$3 = Fm$checker$io$file;
        var __$4 = Fm$checker$code;
        var __$5 = Fm$Term$read;
        var $5700 = Fm$checker$io$file$("Main.fm");
        return $5700;
    })();
    return {
        '$main$': () => run(Fm),
        'run': run,
        'Monad.bind': Monad$bind,
        'IO': IO,
        'Monad.new': Monad$new,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Map': Map,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Map.get': Map$get,
        'Bits.e': Bits$e,
        'Bool.false': Bool$false,
        'Bool.and': Bool$and,
        'Bool.true': Bool$true,
        'Cmp.as_lte': Cmp$as_lte,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.lte': Word$lte,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U16.lte': U16$lte,
        'U16.btw': U16$btw,
        'U16.new': U16$new,
        'Word.e': Word$e,
        'Word': Word,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U16.sub': U16$sub,
        'Nat.apply': Nat$apply,
        'Word.inc': Word$inc,
        'U16.inc': U16$inc,
        'Word.zero': Word$zero,
        'U16.zero': U16$zero,
        'Nat.to_u16': Nat$to_u16,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U16.add': U16$add,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Word.to_bits': Word$to_bits,
        'Word.trim': Word$trim,
        'Bits.concat': Bits$concat,
        'Bits.reverse.tco': Bits$reverse$tco,
        'Bits.reverse': Bits$reverse,
        'Fm.Name.to_bits': Fm$Name$to_bits,
        'Fm.get': Fm$get,
        'String.cons': String$cons,
        'Fm.Synth.file_of': Fm$Synth$file_of,
        'IO.get_file': IO$get_file,
        'Parser': Parser,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser.bind': Parser$bind,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.pure': Parser$pure,
        'Parser.monad': Parser$monad,
        'Parser.is_eof': Parser$is_eof,
        'Monad.pure': Monad$pure,
        'Maybe.some': Maybe$some,
        'Parser.ErrorAt.new': Parser$ErrorAt$new,
        'Nat.gtn': Nat$gtn,
        'Parser.ErrorAt.combine': Parser$ErrorAt$combine,
        'Parser.first_of.go': Parser$first_of$go,
        'Parser.first_of': Parser$first_of,
        'List.cons': List$cons,
        'List': List,
        'List.nil': List$nil,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Unit.new': Unit$new,
        'String.concat': String$concat,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'String.nil': String$nil,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'Parser.until.go': Parser$until$go,
        'Parser.until': Parser$until,
        'Parser.one': Parser$one,
        'Fm.Parser.spaces': Fm$Parser$spaces,
        'Fm.Parser.text': Fm$Parser$text,
        'Parser.many1': Parser$many1,
        'Fm.Name.is_letter': Fm$Name$is_letter,
        'Fm.Parser.letter': Fm$Parser$letter,
        'List.fold': List$fold,
        'Fm.Parser.name1': Fm$Parser$name1,
        'Pair': Pair,
        'Parser.until1': Parser$until1,
        'Parser.maybe': Parser$maybe,
        'Fm.Parser.item': Fm$Parser$item,
        'Fm.Parser.name': Fm$Parser$name,
        'Parser.get_code': Parser$get_code,
        'Parser.get_index': Parser$get_index,
        'Fm.Parser.init': Fm$Parser$init,
        'Fm.Origin.new': Fm$Origin$new,
        'Fm.Parser.stop': Fm$Parser$stop,
        'Fm.Term.ori': Fm$Term$ori,
        'Fm.Term.typ': Fm$Term$typ,
        'Fm.Parser.type': Fm$Parser$type,
        'Fm.Term.all': Fm$Term$all,
        'Fm.Parser.forall': Fm$Parser$forall,
        'Fm.Term.lam': Fm$Term$lam,
        'Fm.Parser.make_lambda': Fm$Parser$make_lambda,
        'Fm.Parser.lambda': Fm$Parser$lambda,
        'Fm.Parser.lambda.erased': Fm$Parser$lambda$erased,
        'Fm.Parser.lambda.nameless': Fm$Parser$lambda$nameless,
        'Fm.Parser.parenthesis': Fm$Parser$parenthesis,
        'Fm.Term.ref': Fm$Term$ref,
        'Fm.Term.app': Fm$Term$app,
        'Fm.Term.hol': Fm$Term$hol,
        'Fm.Term.let': Fm$Term$let,
        'Fm.Parser.letforin': Fm$Parser$letforin,
        'Fm.Parser.let': Fm$Parser$let,
        'Fm.Parser.get': Fm$Parser$get,
        'Fm.Term.def': Fm$Term$def,
        'Fm.Parser.def': Fm$Parser$def,
        'Fm.Parser.if': Fm$Parser$if,
        'List.mapped': List$mapped,
        'Pair.new': Pair$new,
        'Fm.backslash': Fm$backslash,
        'Fm.escapes': Fm$escapes,
        'Fm.Parser.char.single': Fm$Parser$char$single,
        'Fm.Term.chr': Fm$Term$chr,
        'Fm.Parser.char': Fm$Parser$char,
        'Fm.Term.str': Fm$Term$str,
        'Fm.Parser.string': Fm$Parser$string,
        'Fm.Parser.pair': Fm$Parser$pair,
        'Fm.Parser.sigma.type': Fm$Parser$sigma$type,
        'Fm.Parser.some': Fm$Parser$some,
        'Fm.Parser.apply': Fm$Parser$apply,
        'Fm.Name.read': Fm$Name$read,
        'Fm.Parser.list': Fm$Parser$list,
        'Fm.Parser.log': Fm$Parser$log,
        'Fm.Parser.forin': Fm$Parser$forin,
        'Fm.Parser.forin2': Fm$Parser$forin2,
        'Fm.Parser.do.statements': Fm$Parser$do$statements,
        'Fm.Parser.do': Fm$Parser$do,
        'Fm.Term.nat': Fm$Term$nat,
        'Fm.Term.unroll_nat': Fm$Term$unroll_nat,
        'U16.to_bits': U16$to_bits,
        'Fm.Term.unroll_chr.bits': Fm$Term$unroll_chr$bits,
        'Fm.Term.unroll_chr': Fm$Term$unroll_chr,
        'Fm.Term.unroll_str': Fm$Term$unroll_str,
        'Fm.Term.reduce': Fm$Term$reduce,
        'Map.new': Map$new,
        'Fm.Def.new': Fm$Def$new,
        'Fm.Status.init': Fm$Status$init,
        'Fm.Parser.case.with': Fm$Parser$case$with,
        'Fm.Parser.case.case': Fm$Parser$case$case,
        'Map.tie': Map$tie,
        'Map.set': Map$set,
        'Map.from_list': Map$from_list,
        'Fm.Term.cse': Fm$Term$cse,
        'Fm.Parser.case': Fm$Parser$case,
        'Fm.Parser.open': Fm$Parser$open,
        'Parser.digit': Parser$digit,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Nat.from_base.go': Nat$from_base$go,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Nat.from_base': Nat$from_base,
        'Parser.nat': Parser$nat,
        'Bits.tail': Bits$tail,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'Maybe.to_bool': Maybe$to_bool,
        'Fm.Term.gol': Fm$Term$gol,
        'Fm.Parser.goal': Fm$Parser$goal,
        'Fm.Parser.hole': Fm$Parser$hole,
        'Fm.Parser.nat': Fm$Parser$nat,
        'String.eql': String$eql,
        'Parser.fail': Parser$fail,
        'Fm.Parser.reference': Fm$Parser$reference,
        'List.for': List$for,
        'Fm.Parser.application': Fm$Parser$application,
        'Parser.spaces': Parser$spaces,
        'Parser.spaces_text': Parser$spaces_text,
        'Fm.Parser.application.erased': Fm$Parser$application$erased,
        'Fm.Parser.arrow': Fm$Parser$arrow,
        'Fm.Parser.op': Fm$Parser$op,
        'Fm.Parser.add': Fm$Parser$add,
        'Fm.Parser.sub': Fm$Parser$sub,
        'Fm.Parser.mul': Fm$Parser$mul,
        'Fm.Parser.div': Fm$Parser$div,
        'Fm.Parser.mod': Fm$Parser$mod,
        'Fm.Parser.cons': Fm$Parser$cons,
        'Fm.Parser.concat': Fm$Parser$concat,
        'Fm.Parser.string_concat': Fm$Parser$string_concat,
        'Fm.Parser.sigma': Fm$Parser$sigma,
        'Fm.Parser.equality': Fm$Parser$equality,
        'Fm.Term.ann': Fm$Term$ann,
        'Fm.Parser.annotation': Fm$Parser$annotation,
        'Fm.Parser.suffix': Fm$Parser$suffix,
        'Fm.Parser.term': Fm$Parser$term,
        'Fm.Parser.name_term': Fm$Parser$name_term,
        'Fm.Binder.new': Fm$Binder$new,
        'Fm.Parser.binder.homo': Fm$Parser$binder$homo,
        'List.concat': List$concat,
        'List.flatten': List$flatten,
        'Fm.Parser.binder': Fm$Parser$binder,
        'Fm.Parser.make_forall': Fm$Parser$make_forall,
        'List.at': List$at,
        'List.at_last': List$at_last,
        'Fm.Term.var': Fm$Term$var,
        'Pair.snd': Pair$snd,
        'Fm.Name.eql': Fm$Name$eql,
        'Fm.Context.find': Fm$Context$find,
        'List.length': List$length,
        'Fm.Path.o': Fm$Path$o,
        'Fm.Path.i': Fm$Path$i,
        'Fm.Path.to_bits': Fm$Path$to_bits,
        'Fm.Term.bind': Fm$Term$bind,
        'Fm.Status.done': Fm$Status$done,
        'Fm.set': Fm$set,
        'Fm.define': Fm$define,
        'Fm.Parser.file.def': Fm$Parser$file$def,
        'Maybe.default': Maybe$default,
        'Fm.Constructor.new': Fm$Constructor$new,
        'Fm.Parser.constructor': Fm$Parser$constructor,
        'Fm.Datatype.new': Fm$Datatype$new,
        'Fm.Parser.datatype': Fm$Parser$datatype,
        'Fm.Datatype.build_term.motive.go': Fm$Datatype$build_term$motive$go,
        'Fm.Datatype.build_term.motive': Fm$Datatype$build_term$motive,
        'Fm.Datatype.build_term.constructor.go': Fm$Datatype$build_term$constructor$go,
        'Fm.Datatype.build_term.constructor': Fm$Datatype$build_term$constructor,
        'Fm.Datatype.build_term.constructors.go': Fm$Datatype$build_term$constructors$go,
        'Fm.Datatype.build_term.constructors': Fm$Datatype$build_term$constructors,
        'Fm.Datatype.build_term.go': Fm$Datatype$build_term$go,
        'Fm.Datatype.build_term': Fm$Datatype$build_term,
        'Fm.Datatype.build_type.go': Fm$Datatype$build_type$go,
        'Fm.Datatype.build_type': Fm$Datatype$build_type,
        'Fm.Constructor.build_term.opt.go': Fm$Constructor$build_term$opt$go,
        'Fm.Constructor.build_term.opt': Fm$Constructor$build_term$opt,
        'Fm.Constructor.build_term.go': Fm$Constructor$build_term$go,
        'Fm.Constructor.build_term': Fm$Constructor$build_term,
        'Fm.Constructor.build_type.go': Fm$Constructor$build_type$go,
        'Fm.Constructor.build_type': Fm$Constructor$build_type,
        'Fm.Parser.file.adt': Fm$Parser$file$adt,
        'Parser.eof': Parser$eof,
        'Fm.Parser.file.end': Fm$Parser$file$end,
        'Fm.Parser.file': Fm$Parser$file,
        'Either': Either,
        'String.join.go': String$join$go,
        'String.join': String$join,
        'Fm.highlight.end': Fm$highlight$end,
        'Maybe.extract': Maybe$extract,
        'Nat.is_zero': Nat$is_zero,
        'Nat.double': Nat$double,
        'Nat.pred': Nat$pred,
        'List.take': List$take,
        'String.reverse.go': String$reverse$go,
        'String.reverse': String$reverse,
        'String.pad_right': String$pad_right,
        'String.pad_left': String$pad_left,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Nat.lte': Nat$lte,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Bool.not': Bool$not,
        'Fm.color': Fm$color,
        'Fm.highlight.tc': Fm$highlight$tc,
        'Fm.highlight': Fm$highlight,
        'Fm.Defs.read': Fm$Defs$read,
        'Fm.Synth.load': Fm$Synth$load,
        'IO.print': IO$print,
        'Fm.Status.wait': Fm$Status$wait,
        'Fm.Check': Fm$Check,
        'Fm.Check.result': Fm$Check$result,
        'Fm.Check.bind': Fm$Check$bind,
        'Fm.Check.pure': Fm$Check$pure,
        'Fm.Check.monad': Fm$Check$monad,
        'Fm.Error.undefined_reference': Fm$Error$undefined_reference,
        'Fm.Error.waiting': Fm$Error$waiting,
        'Fm.Error.indirect': Fm$Error$indirect,
        'Maybe.mapped': Maybe$mapped,
        'Fm.MPath.o': Fm$MPath$o,
        'Fm.MPath.i': Fm$MPath$i,
        'Fm.Error.cant_infer': Fm$Error$cant_infer,
        'Fm.Error.type_mismatch': Fm$Error$type_mismatch,
        'Fm.Error.show_goal': Fm$Error$show_goal,
        'Fm.Term.normalize': Fm$Term$normalize,
        'List.tail': List$tail,
        'Fm.SmartMotive.vals.cont': Fm$SmartMotive$vals$cont,
        'Fm.SmartMotive.vals': Fm$SmartMotive$vals,
        'Fm.SmartMotive.nams.cont': Fm$SmartMotive$nams$cont,
        'Fm.SmartMotive.nams': Fm$SmartMotive$nams,
        'List.zip': List$zip,
        'Nat.gte': Nat$gte,
        'Nat.sub': Nat$sub,
        'Fm.Term.serialize.name': Fm$Term$serialize$name,
        'Fm.Term.serialize': Fm$Term$serialize,
        'Bits.eql': Bits$eql,
        'Fm.Term.identical': Fm$Term$identical,
        'Fm.SmartMotive.replace': Fm$SmartMotive$replace,
        'Fm.SmartMotive.make': Fm$SmartMotive$make,
        'Fm.Term.desugar_cse.motive': Fm$Term$desugar_cse$motive,
        'String.is_empty': String$is_empty,
        'Fm.Term.desugar_cse.argument': Fm$Term$desugar_cse$argument,
        'Maybe.or': Maybe$or,
        'Fm.Term.desugar_cse.cases': Fm$Term$desugar_cse$cases,
        'Fm.Term.desugar_cse': Fm$Term$desugar_cse,
        'Fm.Error.patch': Fm$Error$patch,
        'Fm.MPath.to_bits': Fm$MPath$to_bits,
        'Set.has': Set$has,
        'Fm.Term.equal.patch': Fm$Term$equal$patch,
        'Fm.Term.equal.extra_holes': Fm$Term$equal$extra_holes,
        'Set.set': Set$set,
        'Bool.eql': Bool$eql,
        'Fm.Term.equal': Fm$Term$equal,
        'Set.new': Set$new,
        'Fm.Term.check': Fm$Term$check,
        'Fm.Path.nil': Fm$Path$nil,
        'Fm.MPath.nil': Fm$MPath$nil,
        'List.is_empty': List$is_empty,
        'Fm.Term.patch_at': Fm$Term$patch_at,
        'Fm.Synth.fix': Fm$Synth$fix,
        'Fm.Status.fail': Fm$Status$fail,
        'Fm.Synth.one': Fm$Synth$one,
        'Map.values.go': Map$values$go,
        'Map.values': Map$values,
        'Fm.Name.show': Fm$Name$show,
        'Bits.to_nat': Bits$to_nat,
        'U16.show_hex': U16$show_hex,
        'Fm.escape.char': Fm$escape$char,
        'Fm.escape': Fm$escape,
        'Fm.Term.core': Fm$Term$core,
        'Fm.Defs.core': Fm$Defs$core,
        'Fm.to_core.io.one': Fm$to_core$io$one,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'Fm.Term.show.as_nat.go': Fm$Term$show$as_nat$go,
        'Fm.Term.show.as_nat': Fm$Term$show$as_nat,
        'Fm.Term.show.is_ref': Fm$Term$show$is_ref,
        'Nat.eql': Nat$eql,
        'Fm.Term.show.app': Fm$Term$show$app,
        'Map.to_list.go': Map$to_list$go,
        'Map.to_list': Map$to_list,
        'Bits.chunks_of.go': Bits$chunks_of$go,
        'Bits.chunks_of': Bits$chunks_of,
        'Word.from_bits': Word$from_bits,
        'Fm.Name.from_bits': Fm$Name$from_bits,
        'Pair.fst': Pair$fst,
        'Fm.Term.show.go': Fm$Term$show$go,
        'Fm.Term.show': Fm$Term$show,
        'Fm.Error.relevant': Fm$Error$relevant,
        'Fm.Context.show': Fm$Context$show,
        'Fm.Term.expand_at': Fm$Term$expand_at,
        'Bool.or': Bool$or,
        'Fm.Term.expand_ct': Fm$Term$expand_ct,
        'Fm.Term.expand': Fm$Term$expand,
        'Fm.Error.show': Fm$Error$show,
        'Fm.Error.origin': Fm$Error$origin,
        'Fm.Defs.report.go': Fm$Defs$report$go,
        'Fm.Defs.report': Fm$Defs$report,
        'Fm.checker.io.one': Fm$checker$io$one,
        'Map.keys.go': Map$keys$go,
        'Map.keys': Map$keys,
        'Fm.Synth.many': Fm$Synth$many,
        'Fm.Synth.file': Fm$Synth$file,
        'Fm.checker.io.file': Fm$checker$io$file,
        'IO.purify': IO$purify,
        'Fm.checker.code': Fm$checker$code,
        'Fm.Term.read': Fm$Term$read,
        'Fm': Fm,
    };
})();