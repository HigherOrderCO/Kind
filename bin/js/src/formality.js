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

    function Fm$Parser$inequality$(_init$1, _val0$2) {
        var $1136 = Monad$bind$(Parser$monad)(Fm$Parser$text$("!="))((_$3 => {
            var $1137 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1138 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Equal");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _val0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val1$4);
                    var _term$10 = Fm$Term$app$(Fm$Term$ref$("Not"), _term$9);
                    var $1139 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$10));
                    return $1139;
                }));
                return $1138;
            }));
            return $1137;
        }));
        return $1136;
    };
    const Fm$Parser$inequality = x0 => x1 => Fm$Parser$inequality$(x0, x1);

    function Fm$Parser$rewrite$(_init$1, _subt$2) {
        var $1140 = Monad$bind$(Parser$monad)(Fm$Parser$text$("::"))((_$3 => {
            var $1141 = Monad$bind$(Parser$monad)(Fm$Parser$text$("rewrite"))((_$4 => {
                var $1142 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$5 => {
                    var $1143 = Monad$bind$(Parser$monad)(Fm$Parser$text$("in"))((_$6 => {
                        var $1144 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$7 => {
                            var $1145 = Monad$bind$(Parser$monad)(Fm$Parser$text$("with"))((_$8 => {
                                var $1146 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_iseq$9 => {
                                    var $1147 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                                        var _term$11 = Fm$Term$ref$("Equal.rewrite");
                                        var _term$12 = Fm$Term$app$(_term$11, Fm$Term$hol$(Bits$e));
                                        var _term$13 = Fm$Term$app$(_term$12, Fm$Term$hol$(Bits$e));
                                        var _term$14 = Fm$Term$app$(_term$13, Fm$Term$hol$(Bits$e));
                                        var _term$15 = Fm$Term$app$(_term$14, Fm$Term$lam$(_name$5, (_x$15 => {
                                            var $1149 = _type$7;
                                            return $1149;
                                        })));
                                        var _term$16 = Fm$Term$app$(_term$15, _iseq$9);
                                        var _term$17 = Fm$Term$app$(_term$16, _subt$2);
                                        var $1148 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$17));
                                        return $1148;
                                    }));
                                    return $1147;
                                }));
                                return $1146;
                            }));
                            return $1145;
                        }));
                        return $1144;
                    }));
                    return $1143;
                }));
                return $1142;
            }));
            return $1141;
        }));
        return $1140;
    };
    const Fm$Parser$rewrite = x0 => x1 => Fm$Parser$rewrite$(x0, x1);

    function Fm$Term$ann$(_done$1, _term$2, _type$3) {
        var $1150 = ({
            _: 'Fm.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $1150;
    };
    const Fm$Term$ann = x0 => x1 => x2 => Fm$Term$ann$(x0, x1, x2);

    function Fm$Parser$annotation$(_init$1, _term$2) {
        var $1151 = Monad$bind$(Parser$monad)(Fm$Parser$text$("::"))((_$3 => {
            var $1152 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$4 => {
                var $1153 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1154 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$ann$(Bool$false, _term$2, _type$4)));
                    return $1154;
                }));
                return $1153;
            }));
            return $1152;
        }));
        return $1151;
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
                var _suffix_parser$5 = Parser$first_of$(List$cons$(Fm$Parser$application$(_init$1, _term$2), List$cons$(Fm$Parser$application$erased$(_init$1, _term$2), List$cons$(Fm$Parser$arrow$(_init$1, _term$2), List$cons$(Fm$Parser$add(_init$1)(_term$2), List$cons$(Fm$Parser$sub(_init$1)(_term$2), List$cons$(Fm$Parser$mul(_init$1)(_term$2), List$cons$(Fm$Parser$div(_init$1)(_term$2), List$cons$(Fm$Parser$mod(_init$1)(_term$2), List$cons$(Fm$Parser$cons$(_init$1, _term$2), List$cons$(Fm$Parser$concat$(_init$1, _term$2), List$cons$(Fm$Parser$string_concat$(_init$1, _term$2), List$cons$(Fm$Parser$sigma$(_init$1, _term$2), List$cons$(Fm$Parser$equality$(_init$1, _term$2), List$cons$(Fm$Parser$inequality$(_init$1, _term$2), List$cons$(Fm$Parser$rewrite$(_init$1, _term$2), List$cons$(Fm$Parser$annotation$(_init$1, _term$2), List$nil)))))))))))))))));
                var self = _suffix_parser$5(_idx$3)(_code$4);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1156 = self.idx;
                        var $1157 = self.code;
                        var $1158 = self.err;
                        var $1159 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $1155 = $1159;
                        break;
                    case 'Parser.Reply.value':
                        var $1160 = self.idx;
                        var $1161 = self.code;
                        var $1162 = self.val;
                        var $1163 = Fm$Parser$suffix$(_init$1, $1162, $1160, $1161);
                        var $1155 = $1163;
                        break;
                };
                return $1155;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Parser$suffix = x0 => x1 => x2 => x3 => Fm$Parser$suffix$(x0, x1, x2, x3);
    const Fm$Parser$term = Monad$bind$(Parser$monad)(Parser$get_code)((_code$1 => {
        var $1164 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $1165 = Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$type, List$cons$(Fm$Parser$forall, List$cons$(Fm$Parser$lambda, List$cons$(Fm$Parser$lambda$erased, List$cons$(Fm$Parser$lambda$nameless, List$cons$(Fm$Parser$parenthesis, List$cons$(Fm$Parser$letforin, List$cons$(Fm$Parser$let, List$cons$(Fm$Parser$get, List$cons$(Fm$Parser$def, List$cons$(Fm$Parser$if, List$cons$(Fm$Parser$char, List$cons$(Fm$Parser$string, List$cons$(Fm$Parser$pair, List$cons$(Fm$Parser$sigma$type, List$cons$(Fm$Parser$some, List$cons$(Fm$Parser$apply, List$cons$(Fm$Parser$list, List$cons$(Fm$Parser$log, List$cons$(Fm$Parser$forin, List$cons$(Fm$Parser$forin2, List$cons$(Fm$Parser$do, List$cons$(Fm$Parser$case, List$cons$(Fm$Parser$open, List$cons$(Fm$Parser$goal, List$cons$(Fm$Parser$hole, List$cons$(Fm$Parser$nat, List$cons$(Fm$Parser$reference, List$nil))))))))))))))))))))))))))))))((_term$3 => {
                var $1166 = Fm$Parser$suffix(_init$2)(_term$3);
                return $1166;
            }));
            return $1165;
        }));
        return $1164;
    }));
    const Fm$Parser$name_term = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$1 => {
        var $1167 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$2 => {
            var $1168 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$3 => {
                var $1169 = Monad$pure$(Parser$monad)(Pair$new$(_name$1, _type$3));
                return $1169;
            }));
            return $1168;
        }));
        return $1167;
    }));

    function Fm$Binder$new$(_eras$1, _name$2, _term$3) {
        var $1170 = ({
            _: 'Fm.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $1170;
    };
    const Fm$Binder$new = x0 => x1 => x2 => Fm$Binder$new$(x0, x1, x2);

    function Fm$Parser$binder$homo$(_eras$1) {
        var $1171 = Monad$bind$(Parser$monad)(Fm$Parser$text$((() => {
            var self = _eras$1;
            if (self) {
                var $1172 = "<";
                return $1172;
            } else {
                var $1173 = "(";
                return $1173;
            };
        })()))((_$2 => {
            var $1174 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$((() => {
                var self = _eras$1;
                if (self) {
                    var $1175 = ">";
                    return $1175;
                } else {
                    var $1176 = ")";
                    return $1176;
                };
            })()), Fm$Parser$item$(Fm$Parser$name_term)))((_bind$3 => {
                var $1177 = Monad$pure$(Parser$monad)(List$mapped$(_bind$3, (_pair$4 => {
                    var self = _pair$4;
                    switch (self._) {
                        case 'Pair.new':
                            var $1179 = self.fst;
                            var $1180 = self.snd;
                            var $1181 = Fm$Binder$new$(_eras$1, $1179, $1180);
                            var $1178 = $1181;
                            break;
                    };
                    return $1178;
                })));
                return $1177;
            }));
            return $1174;
        }));
        return $1171;
    };
    const Fm$Parser$binder$homo = x0 => Fm$Parser$binder$homo$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.nil':
                var $1183 = _bs$3;
                var $1182 = $1183;
                break;
            case 'List.cons':
                var $1184 = self.head;
                var $1185 = self.tail;
                var $1186 = List$cons$($1184, List$concat$($1185, _bs$3));
                var $1182 = $1186;
                break;
        };
        return $1182;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1188 = List$nil;
                var $1187 = $1188;
                break;
            case 'List.cons':
                var $1189 = self.head;
                var $1190 = self.tail;
                var $1191 = List$concat$($1189, List$flatten$($1190));
                var $1187 = $1191;
                break;
        };
        return $1187;
    };
    const List$flatten = x0 => List$flatten$(x0);
    const Fm$Parser$binder = Monad$bind$(Parser$monad)(Parser$many1$(Parser$first_of$(List$cons$(Fm$Parser$binder$homo$(Bool$true), List$cons$(Fm$Parser$binder$homo$(Bool$false), List$nil)))))((_lists$1 => {
        var $1192 = Monad$pure$(Parser$monad)(List$flatten$(_lists$1));
        return $1192;
    }));

    function Fm$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.nil':
                var $1194 = _body$2;
                var $1193 = $1194;
                break;
            case 'List.cons':
                var $1195 = self.head;
                var $1196 = self.tail;
                var self = $1195;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1198 = self.eras;
                        var $1199 = self.name;
                        var $1200 = self.term;
                        var $1201 = Fm$Term$all$($1198, "", $1199, $1200, (_s$8 => _x$9 => {
                            var $1202 = Fm$Parser$make_forall$($1196, _body$2);
                            return $1202;
                        }));
                        var $1197 = $1201;
                        break;
                };
                var $1193 = $1197;
                break;
        };
        return $1193;
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
                        var $1203 = Maybe$none;
                        return $1203;
                    case 'List.cons':
                        var $1204 = self.head;
                        var $1205 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $1207 = Maybe$some$($1204);
                            var $1206 = $1207;
                        } else {
                            var $1208 = (self - 1n);
                            var $1209 = List$at$($1208, $1205);
                            var $1206 = $1209;
                        };
                        return $1206;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $1210 = List$at$(_index$2, List$reverse$(_list$3));
        return $1210;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Fm$Term$var$(_name$1, _indx$2) {
        var $1211 = ({
            _: 'Fm.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $1211;
    };
    const Fm$Term$var = x0 => x1 => Fm$Term$var$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1213 = self.fst;
                var $1214 = self.snd;
                var $1215 = $1214;
                var $1212 = $1215;
                break;
        };
        return $1212;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Fm$Name$eql$(_a$1, _b$2) {
        var $1216 = (_a$1 === _b$2);
        return $1216;
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
                        var $1217 = Maybe$none;
                        return $1217;
                    case 'List.cons':
                        var $1218 = self.head;
                        var $1219 = self.tail;
                        var self = $1218;
                        switch (self._) {
                            case 'Pair.new':
                                var $1221 = self.fst;
                                var $1222 = self.snd;
                                var self = Fm$Name$eql$(_name$1, $1221);
                                if (self) {
                                    var $1224 = Maybe$some$($1222);
                                    var $1223 = $1224;
                                } else {
                                    var $1225 = Fm$Context$find$(_name$1, $1219);
                                    var $1223 = $1225;
                                };
                                var $1220 = $1223;
                                break;
                        };
                        return $1220;
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
                var $1227 = 0n;
                var $1226 = $1227;
                break;
            case 'List.cons':
                var $1228 = self.head;
                var $1229 = self.tail;
                var $1230 = Nat$succ$(List$length$($1229));
                var $1226 = $1230;
                break;
        };
        return $1226;
    };
    const List$length = x0 => List$length$(x0);

    function Fm$Path$o$(_path$1, _x$2) {
        var $1231 = _path$1((_x$2 + '0'));
        return $1231;
    };
    const Fm$Path$o = x0 => x1 => Fm$Path$o$(x0, x1);

    function Fm$Path$i$(_path$1, _x$2) {
        var $1232 = _path$1((_x$2 + '1'));
        return $1232;
    };
    const Fm$Path$i = x0 => x1 => Fm$Path$i$(x0, x1);

    function Fm$Path$to_bits$(_path$1) {
        var $1233 = _path$1(Bits$e);
        return $1233;
    };
    const Fm$Path$to_bits = x0 => Fm$Path$to_bits$(x0);

    function Fm$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Fm.Term.var':
                var $1235 = self.name;
                var $1236 = self.indx;
                var self = List$at_last$($1236, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1238 = Fm$Term$var$($1235, $1236);
                        var $1237 = $1238;
                        break;
                    case 'Maybe.some':
                        var $1239 = self.value;
                        var $1240 = Pair$snd$($1239);
                        var $1237 = $1240;
                        break;
                };
                var $1234 = $1237;
                break;
            case 'Fm.Term.ref':
                var $1241 = self.name;
                var self = Fm$Context$find$($1241, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1243 = Fm$Term$ref$($1241);
                        var $1242 = $1243;
                        break;
                    case 'Maybe.some':
                        var $1244 = self.value;
                        var $1245 = $1244;
                        var $1242 = $1245;
                        break;
                };
                var $1234 = $1242;
                break;
            case 'Fm.Term.typ':
                var $1246 = Fm$Term$typ;
                var $1234 = $1246;
                break;
            case 'Fm.Term.all':
                var $1247 = self.eras;
                var $1248 = self.self;
                var $1249 = self.name;
                var $1250 = self.xtyp;
                var $1251 = self.body;
                var _vlen$9 = List$length$(_vars$1);
                var $1252 = Fm$Term$all$($1247, $1248, $1249, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1250), (_s$10 => _x$11 => {
                    var $1253 = Fm$Term$bind$(List$cons$(Pair$new$($1249, _x$11), List$cons$(Pair$new$($1248, _s$10), _vars$1)), Fm$Path$i(_path$2), $1251(Fm$Term$var$($1248, _vlen$9))(Fm$Term$var$($1249, Nat$succ$(_vlen$9))));
                    return $1253;
                }));
                var $1234 = $1252;
                break;
            case 'Fm.Term.lam':
                var $1254 = self.name;
                var $1255 = self.body;
                var _vlen$6 = List$length$(_vars$1);
                var $1256 = Fm$Term$lam$($1254, (_x$7 => {
                    var $1257 = Fm$Term$bind$(List$cons$(Pair$new$($1254, _x$7), _vars$1), Fm$Path$o(_path$2), $1255(Fm$Term$var$($1254, _vlen$6)));
                    return $1257;
                }));
                var $1234 = $1256;
                break;
            case 'Fm.Term.app':
                var $1258 = self.func;
                var $1259 = self.argm;
                var $1260 = Fm$Term$app$(Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1258), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1259));
                var $1234 = $1260;
                break;
            case 'Fm.Term.let':
                var $1261 = self.name;
                var $1262 = self.expr;
                var $1263 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1264 = Fm$Term$let$($1261, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1262), (_x$8 => {
                    var $1265 = Fm$Term$bind$(List$cons$(Pair$new$($1261, _x$8), _vars$1), Fm$Path$i(_path$2), $1263(Fm$Term$var$($1261, _vlen$7)));
                    return $1265;
                }));
                var $1234 = $1264;
                break;
            case 'Fm.Term.def':
                var $1266 = self.name;
                var $1267 = self.expr;
                var $1268 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1269 = Fm$Term$def$($1266, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1267), (_x$8 => {
                    var $1270 = Fm$Term$bind$(List$cons$(Pair$new$($1266, _x$8), _vars$1), Fm$Path$i(_path$2), $1268(Fm$Term$var$($1266, _vlen$7)));
                    return $1270;
                }));
                var $1234 = $1269;
                break;
            case 'Fm.Term.ann':
                var $1271 = self.done;
                var $1272 = self.term;
                var $1273 = self.type;
                var $1274 = Fm$Term$ann$($1271, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1272), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1273));
                var $1234 = $1274;
                break;
            case 'Fm.Term.gol':
                var $1275 = self.name;
                var $1276 = self.dref;
                var $1277 = self.verb;
                var $1278 = Fm$Term$gol$($1275, $1276, $1277);
                var $1234 = $1278;
                break;
            case 'Fm.Term.hol':
                var $1279 = self.path;
                var $1280 = Fm$Term$hol$(Fm$Path$to_bits$(_path$2));
                var $1234 = $1280;
                break;
            case 'Fm.Term.nat':
                var $1281 = self.natx;
                var $1282 = Fm$Term$nat$($1281);
                var $1234 = $1282;
                break;
            case 'Fm.Term.chr':
                var $1283 = self.chrx;
                var $1284 = Fm$Term$chr$($1283);
                var $1234 = $1284;
                break;
            case 'Fm.Term.str':
                var $1285 = self.strx;
                var $1286 = Fm$Term$str$($1285);
                var $1234 = $1286;
                break;
            case 'Fm.Term.cse':
                var $1287 = self.path;
                var $1288 = self.expr;
                var $1289 = self.name;
                var $1290 = self.with;
                var $1291 = self.cses;
                var $1292 = self.moti;
                var _expr$10 = Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1288);
                var _name$11 = $1289;
                var _wyth$12 = $1290;
                var _cses$13 = $1291;
                var _moti$14 = $1292;
                var $1293 = Fm$Term$cse$(Fm$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $1234 = $1293;
                break;
            case 'Fm.Term.ori':
                var $1294 = self.orig;
                var $1295 = self.expr;
                var $1296 = Fm$Term$ori$($1294, Fm$Term$bind$(_vars$1, _path$2, $1295));
                var $1234 = $1296;
                break;
        };
        return $1234;
    };
    const Fm$Term$bind = x0 => x1 => x2 => Fm$Term$bind$(x0, x1, x2);
    const Fm$Status$done = ({
        _: 'Fm.Status.done'
    });

    function Fm$set$(_name$2, _val$3, _map$4) {
        var $1297 = Map$set$((fm_name_to_bits(_name$2)), _val$3, _map$4);
        return $1297;
    };
    const Fm$set = x0 => x1 => x2 => Fm$set$(x0, x1, x2);

    function Fm$define$(_file$1, _code$2, _name$3, _term$4, _type$5, _done$6, _defs$7) {
        var self = _done$6;
        if (self) {
            var $1299 = Fm$Status$done;
            var _stat$8 = $1299;
        } else {
            var $1300 = Fm$Status$init;
            var _stat$8 = $1300;
        };
        var $1298 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$4, _type$5, _stat$8), _defs$7);
        return $1298;
    };
    const Fm$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Fm$define$(x0, x1, x2, x3, x4, x5, x6);

    function Fm$Parser$file$def$(_file$1, _code$2, _defs$3) {
        var $1301 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
            var $1302 = Monad$bind$(Parser$monad)(Parser$many$(Fm$Parser$binder))((_args$5 => {
                var _args$6 = List$flatten$(_args$5);
                var $1303 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$7 => {
                    var $1304 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$8 => {
                        var $1305 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$9 => {
                            var _type$10 = Fm$Parser$make_forall$(_args$6, _type$8);
                            var _term$11 = Fm$Parser$make_lambda$(List$mapped$(_args$6, (_x$11 => {
                                var self = _x$11;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $1308 = self.eras;
                                        var $1309 = self.name;
                                        var $1310 = self.term;
                                        var $1311 = $1309;
                                        var $1307 = $1311;
                                        break;
                                };
                                return $1307;
                            })), _term$9);
                            var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                                var $1312 = (_x$12 + '1');
                                return $1312;
                            }), _type$10);
                            var _term$13 = Fm$Term$bind$(List$nil, (_x$13 => {
                                var $1313 = (_x$13 + '0');
                                return $1313;
                            }), _term$11);
                            var _defs$14 = Fm$define$(_file$1, _code$2, _name$4, _term$13, _type$12, Bool$false, _defs$3);
                            var $1306 = Monad$pure$(Parser$monad)(_defs$14);
                            return $1306;
                        }));
                        return $1305;
                    }));
                    return $1304;
                }));
                return $1303;
            }));
            return $1302;
        }));
        return $1301;
    };
    const Fm$Parser$file$def = x0 => x1 => x2 => Fm$Parser$file$def$(x0, x1, x2);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $1315 = _a$2;
                var $1314 = $1315;
                break;
            case 'Maybe.some':
                var $1316 = self.value;
                var $1317 = $1316;
                var $1314 = $1317;
                break;
        };
        return $1314;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Fm$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $1318 = ({
            _: 'Fm.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $1318;
    };
    const Fm$Constructor$new = x0 => x1 => x2 => Fm$Constructor$new$(x0, x1, x2);

    function Fm$Parser$constructor$(_namespace$1) {
        var $1319 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1320 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_args$3 => {
                var $1321 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1322 = Fm$Parser$binder;
                    return $1322;
                }))))((_inds$4 => {
                    var _args$5 = Maybe$default$(List$nil, _args$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1323 = Monad$pure$(Parser$monad)(Fm$Constructor$new$(_name$2, _args$5, _inds$6));
                    return $1323;
                }));
                return $1321;
            }));
            return $1320;
        }));
        return $1319;
    };
    const Fm$Parser$constructor = x0 => Fm$Parser$constructor$(x0);

    function Fm$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $1324 = ({
            _: 'Fm.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $1324;
    };
    const Fm$Datatype$new = x0 => x1 => x2 => x3 => Fm$Datatype$new$(x0, x1, x2, x3);
    const Fm$Parser$datatype = Monad$bind$(Parser$monad)(Fm$Parser$text$("type "))((_$1 => {
        var $1325 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1326 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_pars$3 => {
                var $1327 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1328 = Fm$Parser$binder;
                    return $1328;
                }))))((_inds$4 => {
                    var _pars$5 = Maybe$default$(List$nil, _pars$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1329 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$7 => {
                        var $1330 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("}"), Fm$Parser$item$(Fm$Parser$constructor$(_name$2))))((_ctrs$8 => {
                            var $1331 = Monad$pure$(Parser$monad)(Fm$Datatype$new$(_name$2, _pars$5, _inds$6, _ctrs$8));
                            return $1331;
                        }));
                        return $1330;
                    }));
                    return $1329;
                }));
                return $1327;
            }));
            return $1326;
        }));
        return $1325;
    }));

    function Fm$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1334 = self.name;
                        var $1335 = self.pars;
                        var $1336 = self.inds;
                        var $1337 = self.ctrs;
                        var _slf$8 = Fm$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $1340 = _slf$8;
                            var $1341 = $1335;
                            let _slf$10 = $1340;
                            let _var$9;
                            while ($1341._ === 'List.cons') {
                                _var$9 = $1341.head;
                                var $1340 = Fm$Term$app$(_slf$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1342 = self.eras;
                                            var $1343 = self.name;
                                            var $1344 = self.term;
                                            var $1345 = $1343;
                                            return $1345;
                                    };
                                })()));
                                _slf$10 = $1340;
                                $1341 = $1341.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $1347 = _slf$9;
                            var $1348 = $1336;
                            let _slf$11 = $1347;
                            let _var$10;
                            while ($1348._ === 'List.cons') {
                                _var$10 = $1348.head;
                                var $1347 = Fm$Term$app$(_slf$11, Fm$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1349 = self.eras;
                                            var $1350 = self.name;
                                            var $1351 = self.term;
                                            var $1352 = $1350;
                                            return $1352;
                                    };
                                })()));
                                _slf$11 = $1347;
                                $1348 = $1348.tail;
                            }
                            return _slf$11;
                        })();
                        var $1338 = Fm$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $1353 = Fm$Term$typ;
                            return $1353;
                        }));
                        var $1333 = $1338;
                        break;
                };
                var $1332 = $1333;
                break;
            case 'List.cons':
                var $1354 = self.head;
                var $1355 = self.tail;
                var self = $1354;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1357 = self.eras;
                        var $1358 = self.name;
                        var $1359 = self.term;
                        var $1360 = Fm$Term$all$($1357, "", $1358, $1359, (_s$9 => _x$10 => {
                            var $1361 = Fm$Datatype$build_term$motive$go$(_type$1, _name$2, $1355);
                            return $1361;
                        }));
                        var $1356 = $1360;
                        break;
                };
                var $1332 = $1356;
                break;
        };
        return $1332;
    };
    const Fm$Datatype$build_term$motive$go = x0 => x1 => x2 => Fm$Datatype$build_term$motive$go$(x0, x1, x2);

    function Fm$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1363 = self.name;
                var $1364 = self.pars;
                var $1365 = self.inds;
                var $1366 = self.ctrs;
                var $1367 = Fm$Datatype$build_term$motive$go$(_type$1, $1363, $1365);
                var $1362 = $1367;
                break;
        };
        return $1362;
    };
    const Fm$Datatype$build_term$motive = x0 => Fm$Datatype$build_term$motive$(x0);

    function Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1370 = self.name;
                        var $1371 = self.pars;
                        var $1372 = self.inds;
                        var $1373 = self.ctrs;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Fm.Constructor.new':
                                var $1375 = self.name;
                                var $1376 = self.args;
                                var $1377 = self.inds;
                                var _ret$11 = Fm$Term$ref$(Fm$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $1380 = _ret$11;
                                    var $1381 = $1377;
                                    let _ret$13 = $1380;
                                    let _var$12;
                                    while ($1381._ === 'List.cons') {
                                        _var$12 = $1381.head;
                                        var $1380 = Fm$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1382 = self.eras;
                                                    var $1383 = self.name;
                                                    var $1384 = self.term;
                                                    var $1385 = $1384;
                                                    return $1385;
                                            };
                                        })());
                                        _ret$13 = $1380;
                                        $1381 = $1381.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($1370, List$cons$(Fm$Name$read$("."), List$cons$($1375, List$nil))));
                                var _slf$14 = Fm$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $1387 = _slf$14;
                                    var $1388 = $1371;
                                    let _slf$16 = $1387;
                                    let _var$15;
                                    while ($1388._ === 'List.cons') {
                                        _var$15 = $1388.head;
                                        var $1387 = Fm$Term$app$(_slf$16, Fm$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1389 = self.eras;
                                                    var $1390 = self.name;
                                                    var $1391 = self.term;
                                                    var $1392 = $1390;
                                                    return $1392;
                                            };
                                        })()));
                                        _slf$16 = $1387;
                                        $1388 = $1388.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $1394 = _slf$15;
                                    var $1395 = $1376;
                                    let _slf$17 = $1394;
                                    let _var$16;
                                    while ($1395._ === 'List.cons') {
                                        _var$16 = $1395.head;
                                        var $1394 = Fm$Term$app$(_slf$17, Fm$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1396 = self.eras;
                                                    var $1397 = self.name;
                                                    var $1398 = self.term;
                                                    var $1399 = $1397;
                                                    return $1399;
                                            };
                                        })()));
                                        _slf$17 = $1394;
                                        $1395 = $1395.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $1378 = Fm$Term$app$(_ret$12, _slf$16);
                                var $1374 = $1378;
                                break;
                        };
                        var $1369 = $1374;
                        break;
                };
                var $1368 = $1369;
                break;
            case 'List.cons':
                var $1400 = self.head;
                var $1401 = self.tail;
                var self = $1400;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1403 = self.eras;
                        var $1404 = self.name;
                        var $1405 = self.term;
                        var _eras$9 = $1403;
                        var _name$10 = $1404;
                        var _xtyp$11 = $1405;
                        var _body$12 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1401);
                        var $1406 = Fm$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $1407 = _body$12;
                            return $1407;
                        }));
                        var $1402 = $1406;
                        break;
                };
                var $1368 = $1402;
                break;
        };
        return $1368;
    };
    const Fm$Datatype$build_term$constructor$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Fm.Constructor.new':
                var $1409 = self.name;
                var $1410 = self.args;
                var $1411 = self.inds;
                var $1412 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1410);
                var $1408 = $1412;
                break;
        };
        return $1408;
    };
    const Fm$Datatype$build_term$constructor = x0 => x1 => Fm$Datatype$build_term$constructor$(x0, x1);

    function Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1415 = self.name;
                        var $1416 = self.pars;
                        var $1417 = self.inds;
                        var $1418 = self.ctrs;
                        var _ret$8 = Fm$Term$ref$(Fm$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $1421 = _ret$8;
                            var $1422 = $1417;
                            let _ret$10 = $1421;
                            let _var$9;
                            while ($1422._ === 'List.cons') {
                                _var$9 = $1422.head;
                                var $1421 = Fm$Term$app$(_ret$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1423 = self.eras;
                                            var $1424 = self.name;
                                            var $1425 = self.term;
                                            var $1426 = $1424;
                                            return $1426;
                                    };
                                })()));
                                _ret$10 = $1421;
                                $1422 = $1422.tail;
                            }
                            return _ret$10;
                        })();
                        var $1419 = Fm$Term$app$(_ret$9, Fm$Term$ref$((_name$2 + ".Self")));
                        var $1414 = $1419;
                        break;
                };
                var $1413 = $1414;
                break;
            case 'List.cons':
                var $1427 = self.head;
                var $1428 = self.tail;
                var self = $1427;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1430 = self.name;
                        var $1431 = self.args;
                        var $1432 = self.inds;
                        var $1433 = Fm$Term$all$(Bool$false, "", $1430, Fm$Datatype$build_term$constructor$(_type$1, $1427), (_s$9 => _x$10 => {
                            var $1434 = Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, $1428);
                            return $1434;
                        }));
                        var $1429 = $1433;
                        break;
                };
                var $1413 = $1429;
                break;
        };
        return $1413;
    };
    const Fm$Datatype$build_term$constructors$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1436 = self.name;
                var $1437 = self.pars;
                var $1438 = self.inds;
                var $1439 = self.ctrs;
                var $1440 = Fm$Datatype$build_term$constructors$go$(_type$1, $1436, $1439);
                var $1435 = $1440;
                break;
        };
        return $1435;
    };
    const Fm$Datatype$build_term$constructors = x0 => Fm$Datatype$build_term$constructors$(x0);

    function Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1443 = Fm$Term$all$(Bool$true, (_name$2 + ".Self"), Fm$Name$read$("P"), Fm$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $1444 = Fm$Datatype$build_term$constructors$(_type$1);
                            return $1444;
                        }));
                        var $1442 = $1443;
                        break;
                    case 'List.cons':
                        var $1445 = self.head;
                        var $1446 = self.tail;
                        var self = $1445;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1448 = self.eras;
                                var $1449 = self.name;
                                var $1450 = self.term;
                                var $1451 = Fm$Term$lam$($1449, (_x$10 => {
                                    var $1452 = Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $1446);
                                    return $1452;
                                }));
                                var $1447 = $1451;
                                break;
                        };
                        var $1442 = $1447;
                        break;
                };
                var $1441 = $1442;
                break;
            case 'List.cons':
                var $1453 = self.head;
                var $1454 = self.tail;
                var self = $1453;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1456 = self.eras;
                        var $1457 = self.name;
                        var $1458 = self.term;
                        var $1459 = Fm$Term$lam$($1457, (_x$10 => {
                            var $1460 = Fm$Datatype$build_term$go$(_type$1, _name$2, $1454, _inds$4);
                            return $1460;
                        }));
                        var $1455 = $1459;
                        break;
                };
                var $1441 = $1455;
                break;
        };
        return $1441;
    };
    const Fm$Datatype$build_term$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_term$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1462 = self.name;
                var $1463 = self.pars;
                var $1464 = self.inds;
                var $1465 = self.ctrs;
                var $1466 = Fm$Datatype$build_term$go$(_type$1, $1462, $1463, $1464);
                var $1461 = $1466;
                break;
        };
        return $1461;
    };
    const Fm$Datatype$build_term = x0 => Fm$Datatype$build_term$(x0);

    function Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1469 = Fm$Term$typ;
                        var $1468 = $1469;
                        break;
                    case 'List.cons':
                        var $1470 = self.head;
                        var $1471 = self.tail;
                        var self = $1470;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1473 = self.eras;
                                var $1474 = self.name;
                                var $1475 = self.term;
                                var $1476 = Fm$Term$all$(Bool$false, "", $1474, $1475, (_s$10 => _x$11 => {
                                    var $1477 = Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $1471);
                                    return $1477;
                                }));
                                var $1472 = $1476;
                                break;
                        };
                        var $1468 = $1472;
                        break;
                };
                var $1467 = $1468;
                break;
            case 'List.cons':
                var $1478 = self.head;
                var $1479 = self.tail;
                var self = $1478;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1481 = self.eras;
                        var $1482 = self.name;
                        var $1483 = self.term;
                        var $1484 = Fm$Term$all$(Bool$false, "", $1482, $1483, (_s$10 => _x$11 => {
                            var $1485 = Fm$Datatype$build_type$go$(_type$1, _name$2, $1479, _inds$4);
                            return $1485;
                        }));
                        var $1480 = $1484;
                        break;
                };
                var $1467 = $1480;
                break;
        };
        return $1467;
    };
    const Fm$Datatype$build_type$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_type$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1487 = self.name;
                var $1488 = self.pars;
                var $1489 = self.inds;
                var $1490 = self.ctrs;
                var $1491 = Fm$Datatype$build_type$go$(_type$1, $1487, $1488, $1489);
                var $1486 = $1491;
                break;
        };
        return $1486;
    };
    const Fm$Datatype$build_type = x0 => Fm$Datatype$build_type$(x0);

    function Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1494 = self.name;
                        var $1495 = self.args;
                        var $1496 = self.inds;
                        var _ret$7 = Fm$Term$ref$($1494);
                        var _ret$8 = (() => {
                            var $1499 = _ret$7;
                            var $1500 = $1495;
                            let _ret$9 = $1499;
                            let _arg$8;
                            while ($1500._ === 'List.cons') {
                                _arg$8 = $1500.head;
                                var $1499 = Fm$Term$app$(_ret$9, Fm$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1501 = self.eras;
                                            var $1502 = self.name;
                                            var $1503 = self.term;
                                            var $1504 = $1502;
                                            return $1504;
                                    };
                                })()));
                                _ret$9 = $1499;
                                $1500 = $1500.tail;
                            }
                            return _ret$9;
                        })();
                        var $1497 = _ret$8;
                        var $1493 = $1497;
                        break;
                };
                var $1492 = $1493;
                break;
            case 'List.cons':
                var $1505 = self.head;
                var $1506 = self.tail;
                var self = $1505;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1508 = self.name;
                        var $1509 = self.args;
                        var $1510 = self.inds;
                        var $1511 = Fm$Term$lam$($1508, (_x$9 => {
                            var $1512 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1506);
                            return $1512;
                        }));
                        var $1507 = $1511;
                        break;
                };
                var $1492 = $1507;
                break;
        };
        return $1492;
    };
    const Fm$Constructor$build_term$opt$go = x0 => x1 => x2 => Fm$Constructor$build_term$opt$go$(x0, x1, x2);

    function Fm$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1514 = self.name;
                var $1515 = self.pars;
                var $1516 = self.inds;
                var $1517 = self.ctrs;
                var $1518 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1517);
                var $1513 = $1518;
                break;
        };
        return $1513;
    };
    const Fm$Constructor$build_term$opt = x0 => x1 => Fm$Constructor$build_term$opt$(x0, x1);

    function Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.nil':
                        var $1521 = Fm$Term$lam$(Fm$Name$read$("P"), (_x$6 => {
                            var $1522 = Fm$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $1522;
                        }));
                        var $1520 = $1521;
                        break;
                    case 'List.cons':
                        var $1523 = self.head;
                        var $1524 = self.tail;
                        var self = $1523;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1526 = self.eras;
                                var $1527 = self.name;
                                var $1528 = self.term;
                                var $1529 = Fm$Term$lam$($1527, (_x$11 => {
                                    var $1530 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $1524);
                                    return $1530;
                                }));
                                var $1525 = $1529;
                                break;
                        };
                        var $1520 = $1525;
                        break;
                };
                var $1519 = $1520;
                break;
            case 'List.cons':
                var $1531 = self.head;
                var $1532 = self.tail;
                var self = $1531;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1534 = self.eras;
                        var $1535 = self.name;
                        var $1536 = self.term;
                        var $1537 = Fm$Term$lam$($1535, (_x$11 => {
                            var $1538 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $1532, _args$5);
                            return $1538;
                        }));
                        var $1533 = $1537;
                        break;
                };
                var $1519 = $1533;
                break;
        };
        return $1519;
    };
    const Fm$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1540 = self.name;
                var $1541 = self.pars;
                var $1542 = self.inds;
                var $1543 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1545 = self.name;
                        var $1546 = self.args;
                        var $1547 = self.inds;
                        var $1548 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, $1540, $1541, $1546);
                        var $1544 = $1548;
                        break;
                };
                var $1539 = $1544;
                break;
        };
        return $1539;
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
                                var $1552 = self.name;
                                var $1553 = self.pars;
                                var $1554 = self.inds;
                                var $1555 = self.ctrs;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Fm.Constructor.new':
                                        var $1557 = self.name;
                                        var $1558 = self.args;
                                        var $1559 = self.inds;
                                        var _type$13 = Fm$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $1562 = _type$13;
                                            var $1563 = $1553;
                                            let _type$15 = $1562;
                                            let _var$14;
                                            while ($1563._ === 'List.cons') {
                                                _var$14 = $1563.head;
                                                var $1562 = Fm$Term$app$(_type$15, Fm$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1564 = self.eras;
                                                            var $1565 = self.name;
                                                            var $1566 = self.term;
                                                            var $1567 = $1565;
                                                            return $1567;
                                                    };
                                                })()));
                                                _type$15 = $1562;
                                                $1563 = $1563.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $1569 = _type$14;
                                            var $1570 = $1559;
                                            let _type$16 = $1569;
                                            let _var$15;
                                            while ($1570._ === 'List.cons') {
                                                _var$15 = $1570.head;
                                                var $1569 = Fm$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1571 = self.eras;
                                                            var $1572 = self.name;
                                                            var $1573 = self.term;
                                                            var $1574 = $1573;
                                                            return $1574;
                                                    };
                                                })());
                                                _type$16 = $1569;
                                                $1570 = $1570.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $1560 = _type$15;
                                        var $1556 = $1560;
                                        break;
                                };
                                var $1551 = $1556;
                                break;
                        };
                        var $1550 = $1551;
                        break;
                    case 'List.cons':
                        var $1575 = self.head;
                        var $1576 = self.tail;
                        var self = $1575;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1578 = self.eras;
                                var $1579 = self.name;
                                var $1580 = self.term;
                                var $1581 = Fm$Term$all$($1578, "", $1579, $1580, (_s$11 => _x$12 => {
                                    var $1582 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $1576);
                                    return $1582;
                                }));
                                var $1577 = $1581;
                                break;
                        };
                        var $1550 = $1577;
                        break;
                };
                var $1549 = $1550;
                break;
            case 'List.cons':
                var $1583 = self.head;
                var $1584 = self.tail;
                var self = $1583;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1586 = self.eras;
                        var $1587 = self.name;
                        var $1588 = self.term;
                        var $1589 = Fm$Term$all$($1586, "", $1587, $1588, (_s$11 => _x$12 => {
                            var $1590 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $1584, _args$5);
                            return $1590;
                        }));
                        var $1585 = $1589;
                        break;
                };
                var $1549 = $1585;
                break;
        };
        return $1549;
    };
    const Fm$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1592 = self.name;
                var $1593 = self.pars;
                var $1594 = self.inds;
                var $1595 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1597 = self.name;
                        var $1598 = self.args;
                        var $1599 = self.inds;
                        var $1600 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, $1592, $1593, $1598);
                        var $1596 = $1600;
                        break;
                };
                var $1591 = $1596;
                break;
        };
        return $1591;
    };
    const Fm$Constructor$build_type = x0 => x1 => Fm$Constructor$build_type$(x0, x1);

    function Fm$Parser$file$adt$(_file$1, _code$2, _defs$3) {
        var $1601 = Monad$bind$(Parser$monad)(Fm$Parser$datatype)((_adt$4 => {
            var self = _adt$4;
            switch (self._) {
                case 'Fm.Datatype.new':
                    var $1603 = self.name;
                    var $1604 = self.pars;
                    var $1605 = self.inds;
                    var $1606 = self.ctrs;
                    var _term$9 = Fm$Datatype$build_term$(_adt$4);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $1608 = (_x$10 + '1');
                        return $1608;
                    }), _term$9);
                    var _type$11 = Fm$Datatype$build_type$(_adt$4);
                    var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                        var $1609 = (_x$12 + '0');
                        return $1609;
                    }), _type$11);
                    var _defs$13 = Fm$define$(_file$1, _code$2, $1603, _term$10, _type$12, Bool$false, _defs$3);
                    var _defs$14 = List$fold$($1606, _defs$13, (_ctr$14 => _defs$15 => {
                        var _typ_name$16 = $1603;
                        var _ctr_name$17 = String$flatten$(List$cons$(_typ_name$16, List$cons$(Fm$Name$read$("."), List$cons$((() => {
                            var self = _ctr$14;
                            switch (self._) {
                                case 'Fm.Constructor.new':
                                    var $1611 = self.name;
                                    var $1612 = self.args;
                                    var $1613 = self.inds;
                                    var $1614 = $1611;
                                    return $1614;
                            };
                        })(), List$nil))));
                        var _ctr_term$18 = Fm$Constructor$build_term$(_adt$4, _ctr$14);
                        var _ctr_term$19 = Fm$Term$bind$(List$nil, (_x$19 => {
                            var $1615 = (_x$19 + '1');
                            return $1615;
                        }), _ctr_term$18);
                        var _ctr_type$20 = Fm$Constructor$build_type$(_adt$4, _ctr$14);
                        var _ctr_type$21 = Fm$Term$bind$(List$nil, (_x$21 => {
                            var $1616 = (_x$21 + '0');
                            return $1616;
                        }), _ctr_type$20);
                        var $1610 = Fm$define$(_file$1, _code$2, _ctr_name$17, _ctr_term$19, _ctr_type$21, Bool$false, _defs$15);
                        return $1610;
                    }));
                    var $1607 = Monad$pure$(Parser$monad)(_defs$14);
                    var $1602 = $1607;
                    break;
            };
            return $1602;
        }));
        return $1601;
    };
    const Fm$Parser$file$adt = x0 => x1 => x2 => Fm$Parser$file$adt$(x0, x1, x2);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $1618 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $1617 = $1618;
        } else {
            var $1619 = self.charCodeAt(0);
            var $1620 = self.slice(1);
            var $1621 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $1617 = $1621;
        };
        return $1617;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Fm$Parser$file$end$(_file$1, _code$2, _defs$3) {
        var $1622 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$4 => {
            var $1623 = Monad$bind$(Parser$monad)(Parser$eof)((_$5 => {
                var $1624 = Monad$pure$(Parser$monad)(_defs$3);
                return $1624;
            }));
            return $1623;
        }));
        return $1622;
    };
    const Fm$Parser$file$end = x0 => x1 => x2 => Fm$Parser$file$end$(x0, x1, x2);

    function Fm$Parser$file$(_file$1, _code$2, _defs$3) {
        var $1625 = Monad$bind$(Parser$monad)(Parser$is_eof)((_stop$4 => {
            var self = _stop$4;
            if (self) {
                var $1627 = Monad$pure$(Parser$monad)(_defs$3);
                var $1626 = $1627;
            } else {
                var $1628 = Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$("#"))((_$5 => {
                    var $1629 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_file$6 => {
                        var $1630 = Fm$Parser$file$(_file$6, _code$2, _defs$3);
                        return $1630;
                    }));
                    return $1629;
                })), List$cons$(Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$file$def$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$adt$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$end$(_file$1, _code$2, _defs$3), List$nil)))))((_defs$5 => {
                    var $1631 = Fm$Parser$file$(_file$1, _code$2, _defs$5);
                    return $1631;
                })), List$nil)));
                var $1626 = $1628;
            };
            return $1626;
        }));
        return $1625;
    };
    const Fm$Parser$file = x0 => x1 => x2 => Fm$Parser$file$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $1632 = null;
        return $1632;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $1634 = "";
                var $1633 = $1634;
                break;
            case 'List.cons':
                var $1635 = self.head;
                var $1636 = self.tail;
                var $1637 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $1638 = "";
                        return $1638;
                    } else {
                        var $1639 = _sep$1;
                        return $1639;
                    };
                })(), List$cons$($1635, List$cons$(String$join$go$(_sep$1, $1636, Bool$false), List$nil))));
                var $1633 = $1637;
                break;
        };
        return $1633;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $1640 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $1640;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Fm$highlight$end$(_col$1, _row$2, _res$3) {
        var $1641 = String$join$("\u{a}", _res$3);
        return $1641;
    };
    const Fm$highlight$end = x0 => x1 => x2 => Fm$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1643 = _a$4;
                var $1642 = $1643;
                break;
            case 'Maybe.some':
                var $1644 = self.value;
                var $1645 = _f$5($1644);
                var $1642 = $1645;
                break;
        };
        return $1642;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1647 = Bool$true;
            var $1646 = $1647;
        } else {
            var $1648 = (self - 1n);
            var $1649 = Bool$false;
            var $1646 = $1649;
        };
        return $1646;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1651 = Nat$zero;
            var $1650 = $1651;
        } else {
            var $1652 = (self - 1n);
            var $1653 = Nat$succ$(Nat$succ$(Nat$double$($1652)));
            var $1650 = $1653;
        };
        return $1650;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1655 = Nat$zero;
            var $1654 = $1655;
        } else {
            var $1656 = (self - 1n);
            var $1657 = $1656;
            var $1654 = $1657;
        };
        return $1654;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.nil':
                var $1659 = List$nil;
                var $1658 = $1659;
                break;
            case 'List.cons':
                var $1660 = self.head;
                var $1661 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $1663 = List$nil;
                    var $1662 = $1663;
                } else {
                    var $1664 = (self - 1n);
                    var $1665 = List$cons$($1660, List$take$($1664, $1661));
                    var $1662 = $1665;
                };
                var $1658 = $1662;
                break;
        };
        return $1658;
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
                    var $1666 = _res$2;
                    return $1666;
                } else {
                    var $1667 = self.charCodeAt(0);
                    var $1668 = self.slice(1);
                    var $1669 = String$reverse$go$($1668, String$cons$($1667, _res$2));
                    return $1669;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1670 = String$reverse$go$(_xs$1, String$nil);
        return $1670;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $1672 = _str$3;
            var $1671 = $1672;
        } else {
            var $1673 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $1675 = String$cons$(_chr$2, String$pad_right$($1673, _chr$2, ""));
                var $1674 = $1675;
            } else {
                var $1676 = self.charCodeAt(0);
                var $1677 = self.slice(1);
                var $1678 = String$cons$($1676, String$pad_right$($1673, _chr$2, $1677));
                var $1674 = $1678;
            };
            var $1671 = $1674;
        };
        return $1671;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $1679 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $1679;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $1680 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $1680;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $1681 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $1681;
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
                    var $1682 = Either$left$(_n$1);
                    return $1682;
                } else {
                    var $1683 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1685 = Either$right$(Nat$succ$($1683));
                        var $1684 = $1685;
                    } else {
                        var $1686 = (self - 1n);
                        var $1687 = Nat$sub_rem$($1686, $1683);
                        var $1684 = $1687;
                    };
                    return $1684;
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
                        var $1688 = self.value;
                        var $1689 = Nat$div_mod$go$($1688, _m$2, Nat$succ$(_d$3));
                        return $1689;
                    case 'Either.right':
                        var $1690 = self.value;
                        var $1691 = Pair$new$(_d$3, _n$1);
                        return $1691;
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
                        var $1692 = self.fst;
                        var $1693 = self.snd;
                        var self = $1692;
                        if (self === 0n) {
                            var $1695 = List$cons$($1693, _res$3);
                            var $1694 = $1695;
                        } else {
                            var $1696 = (self - 1n);
                            var $1697 = Nat$to_base$go$(_base$1, $1692, List$cons$($1693, _res$3));
                            var $1694 = $1697;
                        };
                        return $1694;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $1698 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $1698;
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
                    var $1699 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $1699;
                } else {
                    var $1700 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1702 = _r$3;
                        var $1701 = $1702;
                    } else {
                        var $1703 = (self - 1n);
                        var $1704 = Nat$mod$go$($1703, $1700, Nat$succ$(_r$3));
                        var $1701 = $1704;
                    };
                    return $1701;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $1705 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $1705;
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
                    var $1708 = 35;
                    var $1707 = $1708;
                    break;
                case 'Maybe.some':
                    var $1709 = self.value;
                    var $1710 = $1709;
                    var $1707 = $1710;
                    break;
            };
            var $1706 = $1707;
        } else {
            var $1711 = 35;
            var $1706 = $1711;
        };
        return $1706;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $1712 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $1713 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $1713;
        }));
        return $1712;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $1714 = Nat$to_string_base$(10n, _n$1);
        return $1714;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Fm$color$(_col$1, _str$2) {
        var $1715 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $1715;
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
                    var $1716 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    return $1716;
                } else {
                    var $1717 = self.charCodeAt(0);
                    var $1718 = self.slice(1);
                    var self = ($1717 === 10);
                    if (self) {
                        var _stp$11 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$11;
                        if (self) {
                            var $1721 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $1720 = $1721;
                        } else {
                            var _spa$12 = 3n;
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$12));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $1724 = Maybe$some$(_spa$12);
                                        var $1723 = $1724;
                                        break;
                                    case 'Maybe.some':
                                        var $1725 = self.value;
                                        var $1726 = Maybe$some$(Nat$pred$($1725));
                                        var $1723 = $1726;
                                        break;
                                };
                                var _lft$14 = $1723;
                            } else {
                                var $1727 = (self - 1n);
                                var $1728 = _lft$6;
                                var _lft$14 = $1728;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$take$(_siz$13, List$cons$(String$reverse$(_lin$7), _res$8));
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $1722 = Fm$highlight$tc$($1718, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $1720 = $1722;
                        };
                        var $1719 = $1720;
                    } else {
                        var _chr$11 = String$cons$($1717, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $1730 = String$reverse$(Fm$color$("31", Fm$color$("4", _chr$11)));
                            var _chr$12 = $1730;
                        } else {
                            var $1731 = _chr$11;
                            var _chr$12 = $1731;
                        };
                        var _ix0$13 = Nat$pred$(_ix0$2);
                        var _ix1$14 = Nat$pred$(_ix1$3);
                        var _col$15 = Nat$succ$(_col$4);
                        var _lin$16 = String$flatten$(List$cons$(_chr$12, List$cons$(_lin$7, List$nil)));
                        var $1729 = Fm$highlight$tc$($1718, _ix0$13, _ix1$14, _col$15, _row$5, _lft$6, _lin$16, _res$8);
                        var $1719 = $1729;
                    };
                    return $1719;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $1732 = Fm$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $1732;
    };
    const Fm$highlight = x0 => x1 => x2 => Fm$highlight$(x0, x1, x2);

    function Fm$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Fm$Parser$file$(_file$1, _code$2, _defs$3)(0n)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1734 = self.idx;
                var $1735 = self.code;
                var $1736 = self.err;
                var _err$7 = $1736;
                var _hig$8 = Fm$highlight$(_code$2, $1734, Nat$succ$($1734));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $1737 = Either$left$(_str$9);
                var $1733 = $1737;
                break;
            case 'Parser.Reply.value':
                var $1738 = self.idx;
                var $1739 = self.code;
                var $1740 = self.val;
                var $1741 = Either$right$($1740);
                var $1733 = $1741;
                break;
        };
        return $1733;
    };
    const Fm$Defs$read = x0 => x1 => x2 => Fm$Defs$read$(x0, x1, x2);

    function Fm$Synth$load$(_name$1, _defs$2) {
        var _file$3 = Fm$Synth$file_of$(_name$1);
        var $1742 = Monad$bind$(IO$monad)(IO$get_file$(_file$3))((_code$4 => {
            var _read$5 = Fm$Defs$read$(_file$3, _code$4, _defs$2);
            var self = _read$5;
            switch (self._) {
                case 'Either.left':
                    var $1744 = self.value;
                    var $1745 = Monad$pure$(IO$monad)(Maybe$none);
                    var $1743 = $1745;
                    break;
                case 'Either.right':
                    var $1746 = self.value;
                    var _defs$7 = $1746;
                    var self = Fm$get$(_name$1, _defs$7);
                    switch (self._) {
                        case 'Maybe.none':
                            var $1748 = Monad$pure$(IO$monad)(Maybe$none);
                            var $1747 = $1748;
                            break;
                        case 'Maybe.some':
                            var $1749 = self.value;
                            var $1750 = Monad$pure$(IO$monad)(Maybe$some$(_defs$7));
                            var $1747 = $1750;
                            break;
                    };
                    var $1743 = $1747;
                    break;
            };
            return $1743;
        }));
        return $1742;
    };
    const Fm$Synth$load = x0 => x1 => Fm$Synth$load$(x0, x1);

    function IO$print$(_text$1) {
        var $1751 = IO$ask$("print", _text$1, (_skip$2 => {
            var $1752 = IO$end$(Unit$new);
            return $1752;
        }));
        return $1751;
    };
    const IO$print = x0 => IO$print$(x0);
    const Fm$Status$wait = ({
        _: 'Fm.Status.wait'
    });

    function Fm$Check$(_V$1) {
        var $1753 = null;
        return $1753;
    };
    const Fm$Check = x0 => Fm$Check$(x0);

    function Fm$Check$result$(_value$2, _errors$3) {
        var $1754 = ({
            _: 'Fm.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $1754;
    };
    const Fm$Check$result = x0 => x1 => Fm$Check$result$(x0, x1);

    function Fm$Check$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'Fm.Check.result':
                var $1756 = self.value;
                var $1757 = self.errors;
                var self = $1756;
                switch (self._) {
                    case 'Maybe.none':
                        var $1759 = Fm$Check$result$(Maybe$none, $1757);
                        var $1758 = $1759;
                        break;
                    case 'Maybe.some':
                        var $1760 = self.value;
                        var self = _f$4($1760);
                        switch (self._) {
                            case 'Fm.Check.result':
                                var $1762 = self.value;
                                var $1763 = self.errors;
                                var $1764 = Fm$Check$result$($1762, List$concat$($1757, $1763));
                                var $1761 = $1764;
                                break;
                        };
                        var $1758 = $1761;
                        break;
                };
                var $1755 = $1758;
                break;
        };
        return $1755;
    };
    const Fm$Check$bind = x0 => x1 => Fm$Check$bind$(x0, x1);

    function Fm$Check$pure$(_value$2) {
        var $1765 = Fm$Check$result$(Maybe$some$(_value$2), List$nil);
        return $1765;
    };
    const Fm$Check$pure = x0 => Fm$Check$pure$(x0);
    const Fm$Check$monad = Monad$new$(Fm$Check$bind, Fm$Check$pure);

    function Fm$Error$undefined_reference$(_origin$1, _name$2) {
        var $1766 = ({
            _: 'Fm.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $1766;
    };
    const Fm$Error$undefined_reference = x0 => x1 => Fm$Error$undefined_reference$(x0, x1);

    function Fm$Error$waiting$(_name$1) {
        var $1767 = ({
            _: 'Fm.Error.waiting',
            'name': _name$1
        });
        return $1767;
    };
    const Fm$Error$waiting = x0 => Fm$Error$waiting$(x0);

    function Fm$Error$indirect$(_name$1) {
        var $1768 = ({
            _: 'Fm.Error.indirect',
            'name': _name$1
        });
        return $1768;
    };
    const Fm$Error$indirect = x0 => Fm$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1770 = Maybe$none;
                var $1769 = $1770;
                break;
            case 'Maybe.some':
                var $1771 = self.value;
                var $1772 = Maybe$some$(_f$4($1771));
                var $1769 = $1772;
                break;
        };
        return $1769;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Fm$MPath$o$(_path$1) {
        var $1773 = Maybe$mapped$(_path$1, Fm$Path$o);
        return $1773;
    };
    const Fm$MPath$o = x0 => Fm$MPath$o$(x0);

    function Fm$MPath$i$(_path$1) {
        var $1774 = Maybe$mapped$(_path$1, Fm$Path$i);
        return $1774;
    };
    const Fm$MPath$i = x0 => Fm$MPath$i$(x0);

    function Fm$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $1775 = ({
            _: 'Fm.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $1775;
    };
    const Fm$Error$cant_infer = x0 => x1 => x2 => Fm$Error$cant_infer$(x0, x1, x2);

    function Fm$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $1776 = ({
            _: 'Fm.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $1776;
    };
    const Fm$Error$type_mismatch = x0 => x1 => x2 => x3 => Fm$Error$type_mismatch$(x0, x1, x2, x3);

    function Fm$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $1777 = ({
            _: 'Fm.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $1777;
    };
    const Fm$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Fm$Error$show_goal$(x0, x1, x2, x3, x4);

    function Fm$Term$normalize$(_term$1, _defs$2) {
        var self = Fm$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $1779 = self.name;
                var $1780 = self.indx;
                var $1781 = Fm$Term$var$($1779, $1780);
                var $1778 = $1781;
                break;
            case 'Fm.Term.ref':
                var $1782 = self.name;
                var $1783 = Fm$Term$ref$($1782);
                var $1778 = $1783;
                break;
            case 'Fm.Term.typ':
                var $1784 = Fm$Term$typ;
                var $1778 = $1784;
                break;
            case 'Fm.Term.all':
                var $1785 = self.eras;
                var $1786 = self.self;
                var $1787 = self.name;
                var $1788 = self.xtyp;
                var $1789 = self.body;
                var $1790 = Fm$Term$all$($1785, $1786, $1787, Fm$Term$normalize$($1788, _defs$2), (_s$8 => _x$9 => {
                    var $1791 = Fm$Term$normalize$($1789(_s$8)(_x$9), _defs$2);
                    return $1791;
                }));
                var $1778 = $1790;
                break;
            case 'Fm.Term.lam':
                var $1792 = self.name;
                var $1793 = self.body;
                var $1794 = Fm$Term$lam$($1792, (_x$5 => {
                    var $1795 = Fm$Term$normalize$($1793(_x$5), _defs$2);
                    return $1795;
                }));
                var $1778 = $1794;
                break;
            case 'Fm.Term.app':
                var $1796 = self.func;
                var $1797 = self.argm;
                var $1798 = Fm$Term$app$(Fm$Term$normalize$($1796, _defs$2), Fm$Term$normalize$($1797, _defs$2));
                var $1778 = $1798;
                break;
            case 'Fm.Term.let':
                var $1799 = self.name;
                var $1800 = self.expr;
                var $1801 = self.body;
                var $1802 = Fm$Term$let$($1799, Fm$Term$normalize$($1800, _defs$2), (_x$6 => {
                    var $1803 = Fm$Term$normalize$($1801(_x$6), _defs$2);
                    return $1803;
                }));
                var $1778 = $1802;
                break;
            case 'Fm.Term.def':
                var $1804 = self.name;
                var $1805 = self.expr;
                var $1806 = self.body;
                var $1807 = Fm$Term$def$($1804, Fm$Term$normalize$($1805, _defs$2), (_x$6 => {
                    var $1808 = Fm$Term$normalize$($1806(_x$6), _defs$2);
                    return $1808;
                }));
                var $1778 = $1807;
                break;
            case 'Fm.Term.ann':
                var $1809 = self.done;
                var $1810 = self.term;
                var $1811 = self.type;
                var $1812 = Fm$Term$ann$($1809, Fm$Term$normalize$($1810, _defs$2), Fm$Term$normalize$($1811, _defs$2));
                var $1778 = $1812;
                break;
            case 'Fm.Term.gol':
                var $1813 = self.name;
                var $1814 = self.dref;
                var $1815 = self.verb;
                var $1816 = Fm$Term$gol$($1813, $1814, $1815);
                var $1778 = $1816;
                break;
            case 'Fm.Term.hol':
                var $1817 = self.path;
                var $1818 = Fm$Term$hol$($1817);
                var $1778 = $1818;
                break;
            case 'Fm.Term.nat':
                var $1819 = self.natx;
                var $1820 = Fm$Term$nat$($1819);
                var $1778 = $1820;
                break;
            case 'Fm.Term.chr':
                var $1821 = self.chrx;
                var $1822 = Fm$Term$chr$($1821);
                var $1778 = $1822;
                break;
            case 'Fm.Term.str':
                var $1823 = self.strx;
                var $1824 = Fm$Term$str$($1823);
                var $1778 = $1824;
                break;
            case 'Fm.Term.cse':
                var $1825 = self.path;
                var $1826 = self.expr;
                var $1827 = self.name;
                var $1828 = self.with;
                var $1829 = self.cses;
                var $1830 = self.moti;
                var $1831 = _term$1;
                var $1778 = $1831;
                break;
            case 'Fm.Term.ori':
                var $1832 = self.orig;
                var $1833 = self.expr;
                var $1834 = Fm$Term$normalize$($1833, _defs$2);
                var $1778 = $1834;
                break;
        };
        return $1778;
    };
    const Fm$Term$normalize = x0 => x1 => Fm$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1836 = List$nil;
                var $1835 = $1836;
                break;
            case 'List.cons':
                var $1837 = self.head;
                var $1838 = self.tail;
                var $1839 = $1838;
                var $1835 = $1839;
                break;
        };
        return $1835;
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
                        var $1840 = self.name;
                        var $1841 = self.indx;
                        var $1842 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1842;
                    case 'Fm.Term.ref':
                        var $1843 = self.name;
                        var $1844 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1844;
                    case 'Fm.Term.typ':
                        var $1845 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1845;
                    case 'Fm.Term.all':
                        var $1846 = self.eras;
                        var $1847 = self.self;
                        var $1848 = self.name;
                        var $1849 = self.xtyp;
                        var $1850 = self.body;
                        var $1851 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1851;
                    case 'Fm.Term.lam':
                        var $1852 = self.name;
                        var $1853 = self.body;
                        var $1854 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1854;
                    case 'Fm.Term.app':
                        var $1855 = self.func;
                        var $1856 = self.argm;
                        var $1857 = Fm$SmartMotive$vals$cont$(_expr$1, $1855, List$cons$($1856, _args$3), _defs$4);
                        return $1857;
                    case 'Fm.Term.let':
                        var $1858 = self.name;
                        var $1859 = self.expr;
                        var $1860 = self.body;
                        var $1861 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1861;
                    case 'Fm.Term.def':
                        var $1862 = self.name;
                        var $1863 = self.expr;
                        var $1864 = self.body;
                        var $1865 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1865;
                    case 'Fm.Term.ann':
                        var $1866 = self.done;
                        var $1867 = self.term;
                        var $1868 = self.type;
                        var $1869 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1869;
                    case 'Fm.Term.gol':
                        var $1870 = self.name;
                        var $1871 = self.dref;
                        var $1872 = self.verb;
                        var $1873 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1873;
                    case 'Fm.Term.hol':
                        var $1874 = self.path;
                        var $1875 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1875;
                    case 'Fm.Term.nat':
                        var $1876 = self.natx;
                        var $1877 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1877;
                    case 'Fm.Term.chr':
                        var $1878 = self.chrx;
                        var $1879 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1879;
                    case 'Fm.Term.str':
                        var $1880 = self.strx;
                        var $1881 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1881;
                    case 'Fm.Term.cse':
                        var $1882 = self.path;
                        var $1883 = self.expr;
                        var $1884 = self.name;
                        var $1885 = self.with;
                        var $1886 = self.cses;
                        var $1887 = self.moti;
                        var $1888 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1888;
                    case 'Fm.Term.ori':
                        var $1889 = self.orig;
                        var $1890 = self.expr;
                        var $1891 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1891;
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
                        var $1892 = self.name;
                        var $1893 = self.indx;
                        var $1894 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1894;
                    case 'Fm.Term.ref':
                        var $1895 = self.name;
                        var $1896 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1896;
                    case 'Fm.Term.typ':
                        var $1897 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1897;
                    case 'Fm.Term.all':
                        var $1898 = self.eras;
                        var $1899 = self.self;
                        var $1900 = self.name;
                        var $1901 = self.xtyp;
                        var $1902 = self.body;
                        var $1903 = Fm$SmartMotive$vals$(_expr$1, $1902(Fm$Term$typ)(Fm$Term$typ), _defs$3);
                        return $1903;
                    case 'Fm.Term.lam':
                        var $1904 = self.name;
                        var $1905 = self.body;
                        var $1906 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1906;
                    case 'Fm.Term.app':
                        var $1907 = self.func;
                        var $1908 = self.argm;
                        var $1909 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1909;
                    case 'Fm.Term.let':
                        var $1910 = self.name;
                        var $1911 = self.expr;
                        var $1912 = self.body;
                        var $1913 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1913;
                    case 'Fm.Term.def':
                        var $1914 = self.name;
                        var $1915 = self.expr;
                        var $1916 = self.body;
                        var $1917 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1917;
                    case 'Fm.Term.ann':
                        var $1918 = self.done;
                        var $1919 = self.term;
                        var $1920 = self.type;
                        var $1921 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1921;
                    case 'Fm.Term.gol':
                        var $1922 = self.name;
                        var $1923 = self.dref;
                        var $1924 = self.verb;
                        var $1925 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1925;
                    case 'Fm.Term.hol':
                        var $1926 = self.path;
                        var $1927 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1927;
                    case 'Fm.Term.nat':
                        var $1928 = self.natx;
                        var $1929 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1929;
                    case 'Fm.Term.chr':
                        var $1930 = self.chrx;
                        var $1931 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1931;
                    case 'Fm.Term.str':
                        var $1932 = self.strx;
                        var $1933 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1933;
                    case 'Fm.Term.cse':
                        var $1934 = self.path;
                        var $1935 = self.expr;
                        var $1936 = self.name;
                        var $1937 = self.with;
                        var $1938 = self.cses;
                        var $1939 = self.moti;
                        var $1940 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1940;
                    case 'Fm.Term.ori':
                        var $1941 = self.orig;
                        var $1942 = self.expr;
                        var $1943 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1943;
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
                        var $1944 = self.name;
                        var $1945 = self.indx;
                        var $1946 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1946;
                    case 'Fm.Term.ref':
                        var $1947 = self.name;
                        var $1948 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1948;
                    case 'Fm.Term.typ':
                        var $1949 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1949;
                    case 'Fm.Term.all':
                        var $1950 = self.eras;
                        var $1951 = self.self;
                        var $1952 = self.name;
                        var $1953 = self.xtyp;
                        var $1954 = self.body;
                        var $1955 = Fm$SmartMotive$nams$cont$(_name$1, $1954(Fm$Term$ref$($1951))(Fm$Term$ref$($1952)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($1952, List$nil)))), _binds$3), _defs$4);
                        return $1955;
                    case 'Fm.Term.lam':
                        var $1956 = self.name;
                        var $1957 = self.body;
                        var $1958 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1958;
                    case 'Fm.Term.app':
                        var $1959 = self.func;
                        var $1960 = self.argm;
                        var $1961 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1961;
                    case 'Fm.Term.let':
                        var $1962 = self.name;
                        var $1963 = self.expr;
                        var $1964 = self.body;
                        var $1965 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1965;
                    case 'Fm.Term.def':
                        var $1966 = self.name;
                        var $1967 = self.expr;
                        var $1968 = self.body;
                        var $1969 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1969;
                    case 'Fm.Term.ann':
                        var $1970 = self.done;
                        var $1971 = self.term;
                        var $1972 = self.type;
                        var $1973 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1973;
                    case 'Fm.Term.gol':
                        var $1974 = self.name;
                        var $1975 = self.dref;
                        var $1976 = self.verb;
                        var $1977 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1977;
                    case 'Fm.Term.hol':
                        var $1978 = self.path;
                        var $1979 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1979;
                    case 'Fm.Term.nat':
                        var $1980 = self.natx;
                        var $1981 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1981;
                    case 'Fm.Term.chr':
                        var $1982 = self.chrx;
                        var $1983 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1983;
                    case 'Fm.Term.str':
                        var $1984 = self.strx;
                        var $1985 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1985;
                    case 'Fm.Term.cse':
                        var $1986 = self.path;
                        var $1987 = self.expr;
                        var $1988 = self.name;
                        var $1989 = self.with;
                        var $1990 = self.cses;
                        var $1991 = self.moti;
                        var $1992 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1992;
                    case 'Fm.Term.ori':
                        var $1993 = self.orig;
                        var $1994 = self.expr;
                        var $1995 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1995;
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
                var $1997 = self.name;
                var $1998 = self.indx;
                var $1999 = List$nil;
                var $1996 = $1999;
                break;
            case 'Fm.Term.ref':
                var $2000 = self.name;
                var $2001 = List$nil;
                var $1996 = $2001;
                break;
            case 'Fm.Term.typ':
                var $2002 = List$nil;
                var $1996 = $2002;
                break;
            case 'Fm.Term.all':
                var $2003 = self.eras;
                var $2004 = self.self;
                var $2005 = self.name;
                var $2006 = self.xtyp;
                var $2007 = self.body;
                var $2008 = Fm$SmartMotive$nams$cont$(_name$1, $2006, List$nil, _defs$3);
                var $1996 = $2008;
                break;
            case 'Fm.Term.lam':
                var $2009 = self.name;
                var $2010 = self.body;
                var $2011 = List$nil;
                var $1996 = $2011;
                break;
            case 'Fm.Term.app':
                var $2012 = self.func;
                var $2013 = self.argm;
                var $2014 = List$nil;
                var $1996 = $2014;
                break;
            case 'Fm.Term.let':
                var $2015 = self.name;
                var $2016 = self.expr;
                var $2017 = self.body;
                var $2018 = List$nil;
                var $1996 = $2018;
                break;
            case 'Fm.Term.def':
                var $2019 = self.name;
                var $2020 = self.expr;
                var $2021 = self.body;
                var $2022 = List$nil;
                var $1996 = $2022;
                break;
            case 'Fm.Term.ann':
                var $2023 = self.done;
                var $2024 = self.term;
                var $2025 = self.type;
                var $2026 = List$nil;
                var $1996 = $2026;
                break;
            case 'Fm.Term.gol':
                var $2027 = self.name;
                var $2028 = self.dref;
                var $2029 = self.verb;
                var $2030 = List$nil;
                var $1996 = $2030;
                break;
            case 'Fm.Term.hol':
                var $2031 = self.path;
                var $2032 = List$nil;
                var $1996 = $2032;
                break;
            case 'Fm.Term.nat':
                var $2033 = self.natx;
                var $2034 = List$nil;
                var $1996 = $2034;
                break;
            case 'Fm.Term.chr':
                var $2035 = self.chrx;
                var $2036 = List$nil;
                var $1996 = $2036;
                break;
            case 'Fm.Term.str':
                var $2037 = self.strx;
                var $2038 = List$nil;
                var $1996 = $2038;
                break;
            case 'Fm.Term.cse':
                var $2039 = self.path;
                var $2040 = self.expr;
                var $2041 = self.name;
                var $2042 = self.with;
                var $2043 = self.cses;
                var $2044 = self.moti;
                var $2045 = List$nil;
                var $1996 = $2045;
                break;
            case 'Fm.Term.ori':
                var $2046 = self.orig;
                var $2047 = self.expr;
                var $2048 = List$nil;
                var $1996 = $2048;
                break;
        };
        return $1996;
    };
    const Fm$SmartMotive$nams = x0 => x1 => x2 => Fm$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.nil':
                var $2050 = List$nil;
                var $2049 = $2050;
                break;
            case 'List.cons':
                var $2051 = self.head;
                var $2052 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.nil':
                        var $2054 = List$nil;
                        var $2053 = $2054;
                        break;
                    case 'List.cons':
                        var $2055 = self.head;
                        var $2056 = self.tail;
                        var $2057 = List$cons$(Pair$new$($2051, $2055), List$zip$($2052, $2056));
                        var $2053 = $2057;
                        break;
                };
                var $2049 = $2053;
                break;
        };
        return $2049;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Fm$Term$serialize$name$(_name$1) {
        var $2058 = (fm_name_to_bits(_name$1));
        return $2058;
    };
    const Fm$Term$serialize$name = x0 => Fm$Term$serialize$name$(x0);

    function Fm$Term$serialize$(_term$1, _depth$2, _init$3, _x$4) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2060 = self.name;
                var $2061 = self.indx;
                var self = ($2061 >= _init$3);
                if (self) {
                    var _name$7 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $2061 <= 0n ? 0n : _depth$2 - $2061)))));
                    var $2063 = (((_name$7(_x$4) + '1') + '0') + '0');
                    var $2062 = $2063;
                } else {
                    var _name$7 = a1 => (a1 + (nat_to_bits($2061)));
                    var $2064 = (((_name$7(_x$4) + '0') + '1') + '0');
                    var $2062 = $2064;
                };
                var $2059 = $2062;
                break;
            case 'Fm.Term.ref':
                var $2065 = self.name;
                var _name$6 = a1 => (a1 + Fm$Term$serialize$name$($2065));
                var $2066 = (((_name$6(_x$4) + '0') + '0') + '0');
                var $2059 = $2066;
                break;
            case 'Fm.Term.typ':
                var $2067 = (((_x$4 + '1') + '1') + '0');
                var $2059 = $2067;
                break;
            case 'Fm.Term.all':
                var $2068 = self.eras;
                var $2069 = self.self;
                var $2070 = self.name;
                var $2071 = self.xtyp;
                var $2072 = self.body;
                var self = $2068;
                if (self) {
                    var $2074 = Bits$i;
                    var _eras$10 = $2074;
                } else {
                    var $2075 = Bits$o;
                    var _eras$10 = $2075;
                };
                var _self$11 = a1 => (a1 + (fm_name_to_bits($2069)));
                var _xtyp$12 = Fm$Term$serialize($2071)(_depth$2)(_init$3);
                var _body$13 = Fm$Term$serialize($2072(Fm$Term$var$($2069, _depth$2))(Fm$Term$var$($2070, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3);
                var $2073 = (((_eras$10(_self$11(_xtyp$12(_body$13(_x$4)))) + '0') + '0') + '1');
                var $2059 = $2073;
                break;
            case 'Fm.Term.lam':
                var $2076 = self.name;
                var $2077 = self.body;
                var _body$7 = Fm$Term$serialize($2077(Fm$Term$var$($2076, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2078 = (((_body$7(_x$4) + '1') + '0') + '1');
                var $2059 = $2078;
                break;
            case 'Fm.Term.app':
                var $2079 = self.func;
                var $2080 = self.argm;
                var _func$7 = Fm$Term$serialize($2079)(_depth$2)(_init$3);
                var _argm$8 = Fm$Term$serialize($2080)(_depth$2)(_init$3);
                var $2081 = (((_func$7(_argm$8(_x$4)) + '0') + '1') + '1');
                var $2059 = $2081;
                break;
            case 'Fm.Term.let':
                var $2082 = self.name;
                var $2083 = self.expr;
                var $2084 = self.body;
                var _expr$8 = Fm$Term$serialize($2083)(_depth$2)(_init$3);
                var _body$9 = Fm$Term$serialize($2084(Fm$Term$var$($2082, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2085 = (((_expr$8(_body$9(_x$4)) + '1') + '1') + '1');
                var $2059 = $2085;
                break;
            case 'Fm.Term.def':
                var $2086 = self.name;
                var $2087 = self.expr;
                var $2088 = self.body;
                var $2089 = Fm$Term$serialize$($2088($2087), _depth$2, _init$3, _x$4);
                var $2059 = $2089;
                break;
            case 'Fm.Term.ann':
                var $2090 = self.done;
                var $2091 = self.term;
                var $2092 = self.type;
                var $2093 = Fm$Term$serialize$($2091, _depth$2, _init$3, _x$4);
                var $2059 = $2093;
                break;
            case 'Fm.Term.gol':
                var $2094 = self.name;
                var $2095 = self.dref;
                var $2096 = self.verb;
                var _name$8 = a1 => (a1 + (fm_name_to_bits($2094)));
                var $2097 = (((_name$8(_x$4) + '0') + '0') + '0');
                var $2059 = $2097;
                break;
            case 'Fm.Term.hol':
                var $2098 = self.path;
                var $2099 = _x$4;
                var $2059 = $2099;
                break;
            case 'Fm.Term.nat':
                var $2100 = self.natx;
                var $2101 = Fm$Term$serialize$(Fm$Term$unroll_nat$($2100), _depth$2, _init$3, _x$4);
                var $2059 = $2101;
                break;
            case 'Fm.Term.chr':
                var $2102 = self.chrx;
                var $2103 = Fm$Term$serialize$(Fm$Term$unroll_chr$($2102), _depth$2, _init$3, _x$4);
                var $2059 = $2103;
                break;
            case 'Fm.Term.str':
                var $2104 = self.strx;
                var $2105 = Fm$Term$serialize$(Fm$Term$unroll_str$($2104), _depth$2, _init$3, _x$4);
                var $2059 = $2105;
                break;
            case 'Fm.Term.cse':
                var $2106 = self.path;
                var $2107 = self.expr;
                var $2108 = self.name;
                var $2109 = self.with;
                var $2110 = self.cses;
                var $2111 = self.moti;
                var $2112 = _x$4;
                var $2059 = $2112;
                break;
            case 'Fm.Term.ori':
                var $2113 = self.orig;
                var $2114 = self.expr;
                var $2115 = Fm$Term$serialize$($2114, _depth$2, _init$3, _x$4);
                var $2059 = $2115;
                break;
        };
        return $2059;
    };
    const Fm$Term$serialize = x0 => x1 => x2 => x3 => Fm$Term$serialize$(x0, x1, x2, x3);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Fm$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Fm$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$e);
        var _bh$5 = Fm$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$e);
        var $2116 = (_bh$5 === _ah$4);
        return $2116;
    };
    const Fm$Term$identical = x0 => x1 => x2 => Fm$Term$identical$(x0, x1, x2);

    function Fm$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Fm$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $2118 = _to$3;
            var $2117 = $2118;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $2120 = self.name;
                    var $2121 = self.indx;
                    var $2122 = Fm$Term$var$($2120, $2121);
                    var $2119 = $2122;
                    break;
                case 'Fm.Term.ref':
                    var $2123 = self.name;
                    var $2124 = Fm$Term$ref$($2123);
                    var $2119 = $2124;
                    break;
                case 'Fm.Term.typ':
                    var $2125 = Fm$Term$typ;
                    var $2119 = $2125;
                    break;
                case 'Fm.Term.all':
                    var $2126 = self.eras;
                    var $2127 = self.self;
                    var $2128 = self.name;
                    var $2129 = self.xtyp;
                    var $2130 = self.body;
                    var _xtyp$10 = Fm$SmartMotive$replace$($2129, _from$2, _to$3, _lv$4);
                    var _body$11 = $2130(Fm$Term$ref$($2127))(Fm$Term$ref$($2128));
                    var _body$12 = Fm$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $2131 = Fm$Term$all$($2126, $2127, $2128, _xtyp$10, (_s$13 => _x$14 => {
                        var $2132 = _body$12;
                        return $2132;
                    }));
                    var $2119 = $2131;
                    break;
                case 'Fm.Term.lam':
                    var $2133 = self.name;
                    var $2134 = self.body;
                    var _body$7 = $2134(Fm$Term$ref$($2133));
                    var _body$8 = Fm$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2135 = Fm$Term$lam$($2133, (_x$9 => {
                        var $2136 = _body$8;
                        return $2136;
                    }));
                    var $2119 = $2135;
                    break;
                case 'Fm.Term.app':
                    var $2137 = self.func;
                    var $2138 = self.argm;
                    var _func$7 = Fm$SmartMotive$replace$($2137, _from$2, _to$3, _lv$4);
                    var _argm$8 = Fm$SmartMotive$replace$($2138, _from$2, _to$3, _lv$4);
                    var $2139 = Fm$Term$app$(_func$7, _argm$8);
                    var $2119 = $2139;
                    break;
                case 'Fm.Term.let':
                    var $2140 = self.name;
                    var $2141 = self.expr;
                    var $2142 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2141, _from$2, _to$3, _lv$4);
                    var _body$9 = $2142(Fm$Term$ref$($2140));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2143 = Fm$Term$let$($2140, _expr$8, (_x$11 => {
                        var $2144 = _body$10;
                        return $2144;
                    }));
                    var $2119 = $2143;
                    break;
                case 'Fm.Term.def':
                    var $2145 = self.name;
                    var $2146 = self.expr;
                    var $2147 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2146, _from$2, _to$3, _lv$4);
                    var _body$9 = $2147(Fm$Term$ref$($2145));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2148 = Fm$Term$def$($2145, _expr$8, (_x$11 => {
                        var $2149 = _body$10;
                        return $2149;
                    }));
                    var $2119 = $2148;
                    break;
                case 'Fm.Term.ann':
                    var $2150 = self.done;
                    var $2151 = self.term;
                    var $2152 = self.type;
                    var _term$8 = Fm$SmartMotive$replace$($2151, _from$2, _to$3, _lv$4);
                    var _type$9 = Fm$SmartMotive$replace$($2152, _from$2, _to$3, _lv$4);
                    var $2153 = Fm$Term$ann$($2150, _term$8, _type$9);
                    var $2119 = $2153;
                    break;
                case 'Fm.Term.gol':
                    var $2154 = self.name;
                    var $2155 = self.dref;
                    var $2156 = self.verb;
                    var $2157 = _term$1;
                    var $2119 = $2157;
                    break;
                case 'Fm.Term.hol':
                    var $2158 = self.path;
                    var $2159 = _term$1;
                    var $2119 = $2159;
                    break;
                case 'Fm.Term.nat':
                    var $2160 = self.natx;
                    var $2161 = _term$1;
                    var $2119 = $2161;
                    break;
                case 'Fm.Term.chr':
                    var $2162 = self.chrx;
                    var $2163 = _term$1;
                    var $2119 = $2163;
                    break;
                case 'Fm.Term.str':
                    var $2164 = self.strx;
                    var $2165 = _term$1;
                    var $2119 = $2165;
                    break;
                case 'Fm.Term.cse':
                    var $2166 = self.path;
                    var $2167 = self.expr;
                    var $2168 = self.name;
                    var $2169 = self.with;
                    var $2170 = self.cses;
                    var $2171 = self.moti;
                    var $2172 = _term$1;
                    var $2119 = $2172;
                    break;
                case 'Fm.Term.ori':
                    var $2173 = self.orig;
                    var $2174 = self.expr;
                    var $2175 = Fm$SmartMotive$replace$($2174, _from$2, _to$3, _lv$4);
                    var $2119 = $2175;
                    break;
            };
            var $2117 = $2119;
        };
        return $2117;
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
                    var $2178 = self.fst;
                    var $2179 = self.snd;
                    var $2180 = Fm$SmartMotive$replace$(_moti$11, $2179, Fm$Term$ref$($2178), _lv$5);
                    var $2177 = $2180;
                    break;
            };
            return $2177;
        }));
        var $2176 = _moti$10;
        return $2176;
    };
    const Fm$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Fm$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Fm$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.nil':
                var $2182 = _moti$2;
                var $2181 = $2182;
                break;
            case 'List.cons':
                var $2183 = self.head;
                var $2184 = self.tail;
                var self = $2183;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $2186 = self.file;
                        var $2187 = self.code;
                        var $2188 = self.name;
                        var $2189 = self.term;
                        var $2190 = self.type;
                        var $2191 = self.stat;
                        var $2192 = Fm$Term$all$(Bool$false, "", $2188, $2190, (_s$11 => _x$12 => {
                            var $2193 = Fm$Term$desugar_cse$motive$($2184, _moti$2);
                            return $2193;
                        }));
                        var $2185 = $2192;
                        break;
                };
                var $2181 = $2185;
                break;
        };
        return $2181;
    };
    const Fm$Term$desugar_cse$motive = x0 => x1 => Fm$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $2195 = Bool$true;
            var $2194 = $2195;
        } else {
            var $2196 = self.charCodeAt(0);
            var $2197 = self.slice(1);
            var $2198 = Bool$false;
            var $2194 = $2198;
        };
        return $2194;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Fm$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $2200 = self.name;
                var $2201 = self.indx;
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
                                var $2213 = Fm$Term$lam$($2209, (_x$16 => {
                                    var $2214 = Fm$Term$desugar_cse$argument$(_name$1, $2205, _type$3, _body$4, _defs$5);
                                    return $2214;
                                }));
                                var $2206 = $2213;
                                break;
                        };
                        var $2202 = $2206;
                        break;
                };
                var $2199 = $2202;
                break;
            case 'Fm.Term.ref':
                var $2215 = self.name;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2217 = _body$4;
                        var $2216 = $2217;
                        break;
                    case 'List.cons':
                        var $2218 = self.head;
                        var $2219 = self.tail;
                        var self = $2218;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2221 = self.file;
                                var $2222 = self.code;
                                var $2223 = self.name;
                                var $2224 = self.term;
                                var $2225 = self.type;
                                var $2226 = self.stat;
                                var $2227 = Fm$Term$lam$($2223, (_x$15 => {
                                    var $2228 = Fm$Term$desugar_cse$argument$(_name$1, $2219, _type$3, _body$4, _defs$5);
                                    return $2228;
                                }));
                                var $2220 = $2227;
                                break;
                        };
                        var $2216 = $2220;
                        break;
                };
                var $2199 = $2216;
                break;
            case 'Fm.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2230 = _body$4;
                        var $2229 = $2230;
                        break;
                    case 'List.cons':
                        var $2231 = self.head;
                        var $2232 = self.tail;
                        var self = $2231;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2234 = self.file;
                                var $2235 = self.code;
                                var $2236 = self.name;
                                var $2237 = self.term;
                                var $2238 = self.type;
                                var $2239 = self.stat;
                                var $2240 = Fm$Term$lam$($2236, (_x$14 => {
                                    var $2241 = Fm$Term$desugar_cse$argument$(_name$1, $2232, _type$3, _body$4, _defs$5);
                                    return $2241;
                                }));
                                var $2233 = $2240;
                                break;
                        };
                        var $2229 = $2233;
                        break;
                };
                var $2199 = $2229;
                break;
            case 'Fm.Term.all':
                var $2242 = self.eras;
                var $2243 = self.self;
                var $2244 = self.name;
                var $2245 = self.xtyp;
                var $2246 = self.body;
                var $2247 = Fm$Term$lam$((() => {
                    var self = String$is_empty$($2244);
                    if (self) {
                        var $2248 = _name$1;
                        return $2248;
                    } else {
                        var $2249 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($2244, List$nil))));
                        return $2249;
                    };
                })(), (_x$11 => {
                    var $2250 = Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, $2246(Fm$Term$var$($2243, 0n))(Fm$Term$var$($2244, 0n)), _body$4, _defs$5);
                    return $2250;
                }));
                var $2199 = $2247;
                break;
            case 'Fm.Term.lam':
                var $2251 = self.name;
                var $2252 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2254 = _body$4;
                        var $2253 = $2254;
                        break;
                    case 'List.cons':
                        var $2255 = self.head;
                        var $2256 = self.tail;
                        var self = $2255;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2258 = self.file;
                                var $2259 = self.code;
                                var $2260 = self.name;
                                var $2261 = self.term;
                                var $2262 = self.type;
                                var $2263 = self.stat;
                                var $2264 = Fm$Term$lam$($2260, (_x$16 => {
                                    var $2265 = Fm$Term$desugar_cse$argument$(_name$1, $2256, _type$3, _body$4, _defs$5);
                                    return $2265;
                                }));
                                var $2257 = $2264;
                                break;
                        };
                        var $2253 = $2257;
                        break;
                };
                var $2199 = $2253;
                break;
            case 'Fm.Term.app':
                var $2266 = self.func;
                var $2267 = self.argm;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2269 = _body$4;
                        var $2268 = $2269;
                        break;
                    case 'List.cons':
                        var $2270 = self.head;
                        var $2271 = self.tail;
                        var self = $2270;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2273 = self.file;
                                var $2274 = self.code;
                                var $2275 = self.name;
                                var $2276 = self.term;
                                var $2277 = self.type;
                                var $2278 = self.stat;
                                var $2279 = Fm$Term$lam$($2275, (_x$16 => {
                                    var $2280 = Fm$Term$desugar_cse$argument$(_name$1, $2271, _type$3, _body$4, _defs$5);
                                    return $2280;
                                }));
                                var $2272 = $2279;
                                break;
                        };
                        var $2268 = $2272;
                        break;
                };
                var $2199 = $2268;
                break;
            case 'Fm.Term.let':
                var $2281 = self.name;
                var $2282 = self.expr;
                var $2283 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2285 = _body$4;
                        var $2284 = $2285;
                        break;
                    case 'List.cons':
                        var $2286 = self.head;
                        var $2287 = self.tail;
                        var self = $2286;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2289 = self.file;
                                var $2290 = self.code;
                                var $2291 = self.name;
                                var $2292 = self.term;
                                var $2293 = self.type;
                                var $2294 = self.stat;
                                var $2295 = Fm$Term$lam$($2291, (_x$17 => {
                                    var $2296 = Fm$Term$desugar_cse$argument$(_name$1, $2287, _type$3, _body$4, _defs$5);
                                    return $2296;
                                }));
                                var $2288 = $2295;
                                break;
                        };
                        var $2284 = $2288;
                        break;
                };
                var $2199 = $2284;
                break;
            case 'Fm.Term.def':
                var $2297 = self.name;
                var $2298 = self.expr;
                var $2299 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2301 = _body$4;
                        var $2300 = $2301;
                        break;
                    case 'List.cons':
                        var $2302 = self.head;
                        var $2303 = self.tail;
                        var self = $2302;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2305 = self.file;
                                var $2306 = self.code;
                                var $2307 = self.name;
                                var $2308 = self.term;
                                var $2309 = self.type;
                                var $2310 = self.stat;
                                var $2311 = Fm$Term$lam$($2307, (_x$17 => {
                                    var $2312 = Fm$Term$desugar_cse$argument$(_name$1, $2303, _type$3, _body$4, _defs$5);
                                    return $2312;
                                }));
                                var $2304 = $2311;
                                break;
                        };
                        var $2300 = $2304;
                        break;
                };
                var $2199 = $2300;
                break;
            case 'Fm.Term.ann':
                var $2313 = self.done;
                var $2314 = self.term;
                var $2315 = self.type;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2317 = _body$4;
                        var $2316 = $2317;
                        break;
                    case 'List.cons':
                        var $2318 = self.head;
                        var $2319 = self.tail;
                        var self = $2318;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2321 = self.file;
                                var $2322 = self.code;
                                var $2323 = self.name;
                                var $2324 = self.term;
                                var $2325 = self.type;
                                var $2326 = self.stat;
                                var $2327 = Fm$Term$lam$($2323, (_x$17 => {
                                    var $2328 = Fm$Term$desugar_cse$argument$(_name$1, $2319, _type$3, _body$4, _defs$5);
                                    return $2328;
                                }));
                                var $2320 = $2327;
                                break;
                        };
                        var $2316 = $2320;
                        break;
                };
                var $2199 = $2316;
                break;
            case 'Fm.Term.gol':
                var $2329 = self.name;
                var $2330 = self.dref;
                var $2331 = self.verb;
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
                                var $2343 = Fm$Term$lam$($2339, (_x$17 => {
                                    var $2344 = Fm$Term$desugar_cse$argument$(_name$1, $2335, _type$3, _body$4, _defs$5);
                                    return $2344;
                                }));
                                var $2336 = $2343;
                                break;
                        };
                        var $2332 = $2336;
                        break;
                };
                var $2199 = $2332;
                break;
            case 'Fm.Term.hol':
                var $2345 = self.path;
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
                var $2199 = $2346;
                break;
            case 'Fm.Term.nat':
                var $2359 = self.natx;
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
                var $2199 = $2360;
                break;
            case 'Fm.Term.chr':
                var $2373 = self.chrx;
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
                var $2199 = $2374;
                break;
            case 'Fm.Term.str':
                var $2387 = self.strx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2389 = _body$4;
                        var $2388 = $2389;
                        break;
                    case 'List.cons':
                        var $2390 = self.head;
                        var $2391 = self.tail;
                        var self = $2390;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2393 = self.file;
                                var $2394 = self.code;
                                var $2395 = self.name;
                                var $2396 = self.term;
                                var $2397 = self.type;
                                var $2398 = self.stat;
                                var $2399 = Fm$Term$lam$($2395, (_x$15 => {
                                    var $2400 = Fm$Term$desugar_cse$argument$(_name$1, $2391, _type$3, _body$4, _defs$5);
                                    return $2400;
                                }));
                                var $2392 = $2399;
                                break;
                        };
                        var $2388 = $2392;
                        break;
                };
                var $2199 = $2388;
                break;
            case 'Fm.Term.cse':
                var $2401 = self.path;
                var $2402 = self.expr;
                var $2403 = self.name;
                var $2404 = self.with;
                var $2405 = self.cses;
                var $2406 = self.moti;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2408 = _body$4;
                        var $2407 = $2408;
                        break;
                    case 'List.cons':
                        var $2409 = self.head;
                        var $2410 = self.tail;
                        var self = $2409;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2412 = self.file;
                                var $2413 = self.code;
                                var $2414 = self.name;
                                var $2415 = self.term;
                                var $2416 = self.type;
                                var $2417 = self.stat;
                                var $2418 = Fm$Term$lam$($2414, (_x$20 => {
                                    var $2419 = Fm$Term$desugar_cse$argument$(_name$1, $2410, _type$3, _body$4, _defs$5);
                                    return $2419;
                                }));
                                var $2411 = $2418;
                                break;
                        };
                        var $2407 = $2411;
                        break;
                };
                var $2199 = $2407;
                break;
            case 'Fm.Term.ori':
                var $2420 = self.orig;
                var $2421 = self.expr;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2423 = _body$4;
                        var $2422 = $2423;
                        break;
                    case 'List.cons':
                        var $2424 = self.head;
                        var $2425 = self.tail;
                        var self = $2424;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2427 = self.file;
                                var $2428 = self.code;
                                var $2429 = self.name;
                                var $2430 = self.term;
                                var $2431 = self.type;
                                var $2432 = self.stat;
                                var $2433 = Fm$Term$lam$($2429, (_x$16 => {
                                    var $2434 = Fm$Term$desugar_cse$argument$(_name$1, $2425, _type$3, _body$4, _defs$5);
                                    return $2434;
                                }));
                                var $2426 = $2433;
                                break;
                        };
                        var $2422 = $2426;
                        break;
                };
                var $2199 = $2422;
                break;
        };
        return $2199;
    };
    const Fm$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Fm$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.none':
                var $2436 = _b$3;
                var $2435 = $2436;
                break;
            case 'Maybe.some':
                var $2437 = self.value;
                var $2438 = Maybe$some$($2437);
                var $2435 = $2438;
                break;
        };
        return $2435;
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
                        var $2439 = self.name;
                        var $2440 = self.indx;
                        var _expr$10 = (() => {
                            var $2443 = _expr$1;
                            var $2444 = _wyth$3;
                            let _expr$11 = $2443;
                            let _defn$10;
                            while ($2444._ === 'List.cons') {
                                _defn$10 = $2444.head;
                                var $2443 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2445 = self.file;
                                            var $2446 = self.code;
                                            var $2447 = self.name;
                                            var $2448 = self.term;
                                            var $2449 = self.type;
                                            var $2450 = self.stat;
                                            var $2451 = $2448;
                                            return $2451;
                                    };
                                })());
                                _expr$11 = $2443;
                                $2444 = $2444.tail;
                            }
                            return _expr$11;
                        })();
                        var $2441 = _expr$10;
                        return $2441;
                    case 'Fm.Term.ref':
                        var $2452 = self.name;
                        var _expr$9 = (() => {
                            var $2455 = _expr$1;
                            var $2456 = _wyth$3;
                            let _expr$10 = $2455;
                            let _defn$9;
                            while ($2456._ === 'List.cons') {
                                _defn$9 = $2456.head;
                                var $2455 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2457 = self.file;
                                            var $2458 = self.code;
                                            var $2459 = self.name;
                                            var $2460 = self.term;
                                            var $2461 = self.type;
                                            var $2462 = self.stat;
                                            var $2463 = $2460;
                                            return $2463;
                                    };
                                })());
                                _expr$10 = $2455;
                                $2456 = $2456.tail;
                            }
                            return _expr$10;
                        })();
                        var $2453 = _expr$9;
                        return $2453;
                    case 'Fm.Term.typ':
                        var _expr$8 = (() => {
                            var $2466 = _expr$1;
                            var $2467 = _wyth$3;
                            let _expr$9 = $2466;
                            let _defn$8;
                            while ($2467._ === 'List.cons') {
                                _defn$8 = $2467.head;
                                var $2466 = Fm$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2468 = self.file;
                                            var $2469 = self.code;
                                            var $2470 = self.name;
                                            var $2471 = self.term;
                                            var $2472 = self.type;
                                            var $2473 = self.stat;
                                            var $2474 = $2471;
                                            return $2474;
                                    };
                                })());
                                _expr$9 = $2466;
                                $2467 = $2467.tail;
                            }
                            return _expr$9;
                        })();
                        var $2464 = _expr$8;
                        return $2464;
                    case 'Fm.Term.all':
                        var $2475 = self.eras;
                        var $2476 = self.self;
                        var $2477 = self.name;
                        var $2478 = self.xtyp;
                        var $2479 = self.body;
                        var _got$13 = Maybe$or$(Fm$get$($2477, _cses$4), Fm$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $2483 = _expr$1;
                                    var $2484 = _wyth$3;
                                    let _expr$15 = $2483;
                                    let _defn$14;
                                    while ($2484._ === 'List.cons') {
                                        _defn$14 = $2484.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Fm.Def.new':
                                                var $2485 = self.file;
                                                var $2486 = self.code;
                                                var $2487 = self.name;
                                                var $2488 = self.term;
                                                var $2489 = self.type;
                                                var $2490 = self.stat;
                                                var $2491 = Fm$Term$app$(_expr$15, $2488);
                                                var $2483 = $2491;
                                                break;
                                        };
                                        _expr$15 = $2483;
                                        $2484 = $2484.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $2481 = _expr$14;
                                var $2480 = $2481;
                                break;
                            case 'Maybe.some':
                                var $2492 = self.value;
                                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, _wyth$3, $2478, $2492, _defs$6);
                                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $2479(Fm$Term$var$($2476, 0n))(Fm$Term$var$($2477, 0n));
                                var $2493 = Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $2480 = $2493;
                                break;
                        };
                        return $2480;
                    case 'Fm.Term.lam':
                        var $2494 = self.name;
                        var $2495 = self.body;
                        var _expr$10 = (() => {
                            var $2498 = _expr$1;
                            var $2499 = _wyth$3;
                            let _expr$11 = $2498;
                            let _defn$10;
                            while ($2499._ === 'List.cons') {
                                _defn$10 = $2499.head;
                                var $2498 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2500 = self.file;
                                            var $2501 = self.code;
                                            var $2502 = self.name;
                                            var $2503 = self.term;
                                            var $2504 = self.type;
                                            var $2505 = self.stat;
                                            var $2506 = $2503;
                                            return $2506;
                                    };
                                })());
                                _expr$11 = $2498;
                                $2499 = $2499.tail;
                            }
                            return _expr$11;
                        })();
                        var $2496 = _expr$10;
                        return $2496;
                    case 'Fm.Term.app':
                        var $2507 = self.func;
                        var $2508 = self.argm;
                        var _expr$10 = (() => {
                            var $2511 = _expr$1;
                            var $2512 = _wyth$3;
                            let _expr$11 = $2511;
                            let _defn$10;
                            while ($2512._ === 'List.cons') {
                                _defn$10 = $2512.head;
                                var $2511 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
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
                                _expr$11 = $2511;
                                $2512 = $2512.tail;
                            }
                            return _expr$11;
                        })();
                        var $2509 = _expr$10;
                        return $2509;
                    case 'Fm.Term.let':
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
                    case 'Fm.Term.def':
                        var $2534 = self.name;
                        var $2535 = self.expr;
                        var $2536 = self.body;
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
                    case 'Fm.Term.ann':
                        var $2548 = self.done;
                        var $2549 = self.term;
                        var $2550 = self.type;
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
                    case 'Fm.Term.gol':
                        var $2562 = self.name;
                        var $2563 = self.dref;
                        var $2564 = self.verb;
                        var _expr$11 = (() => {
                            var $2567 = _expr$1;
                            var $2568 = _wyth$3;
                            let _expr$12 = $2567;
                            let _defn$11;
                            while ($2568._ === 'List.cons') {
                                _defn$11 = $2568.head;
                                var $2567 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2569 = self.file;
                                            var $2570 = self.code;
                                            var $2571 = self.name;
                                            var $2572 = self.term;
                                            var $2573 = self.type;
                                            var $2574 = self.stat;
                                            var $2575 = $2572;
                                            return $2575;
                                    };
                                })());
                                _expr$12 = $2567;
                                $2568 = $2568.tail;
                            }
                            return _expr$12;
                        })();
                        var $2565 = _expr$11;
                        return $2565;
                    case 'Fm.Term.hol':
                        var $2576 = self.path;
                        var _expr$9 = (() => {
                            var $2579 = _expr$1;
                            var $2580 = _wyth$3;
                            let _expr$10 = $2579;
                            let _defn$9;
                            while ($2580._ === 'List.cons') {
                                _defn$9 = $2580.head;
                                var $2579 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2581 = self.file;
                                            var $2582 = self.code;
                                            var $2583 = self.name;
                                            var $2584 = self.term;
                                            var $2585 = self.type;
                                            var $2586 = self.stat;
                                            var $2587 = $2584;
                                            return $2587;
                                    };
                                })());
                                _expr$10 = $2579;
                                $2580 = $2580.tail;
                            }
                            return _expr$10;
                        })();
                        var $2577 = _expr$9;
                        return $2577;
                    case 'Fm.Term.nat':
                        var $2588 = self.natx;
                        var _expr$9 = (() => {
                            var $2591 = _expr$1;
                            var $2592 = _wyth$3;
                            let _expr$10 = $2591;
                            let _defn$9;
                            while ($2592._ === 'List.cons') {
                                _defn$9 = $2592.head;
                                var $2591 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2593 = self.file;
                                            var $2594 = self.code;
                                            var $2595 = self.name;
                                            var $2596 = self.term;
                                            var $2597 = self.type;
                                            var $2598 = self.stat;
                                            var $2599 = $2596;
                                            return $2599;
                                    };
                                })());
                                _expr$10 = $2591;
                                $2592 = $2592.tail;
                            }
                            return _expr$10;
                        })();
                        var $2589 = _expr$9;
                        return $2589;
                    case 'Fm.Term.chr':
                        var $2600 = self.chrx;
                        var _expr$9 = (() => {
                            var $2603 = _expr$1;
                            var $2604 = _wyth$3;
                            let _expr$10 = $2603;
                            let _defn$9;
                            while ($2604._ === 'List.cons') {
                                _defn$9 = $2604.head;
                                var $2603 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2605 = self.file;
                                            var $2606 = self.code;
                                            var $2607 = self.name;
                                            var $2608 = self.term;
                                            var $2609 = self.type;
                                            var $2610 = self.stat;
                                            var $2611 = $2608;
                                            return $2611;
                                    };
                                })());
                                _expr$10 = $2603;
                                $2604 = $2604.tail;
                            }
                            return _expr$10;
                        })();
                        var $2601 = _expr$9;
                        return $2601;
                    case 'Fm.Term.str':
                        var $2612 = self.strx;
                        var _expr$9 = (() => {
                            var $2615 = _expr$1;
                            var $2616 = _wyth$3;
                            let _expr$10 = $2615;
                            let _defn$9;
                            while ($2616._ === 'List.cons') {
                                _defn$9 = $2616.head;
                                var $2615 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2617 = self.file;
                                            var $2618 = self.code;
                                            var $2619 = self.name;
                                            var $2620 = self.term;
                                            var $2621 = self.type;
                                            var $2622 = self.stat;
                                            var $2623 = $2620;
                                            return $2623;
                                    };
                                })());
                                _expr$10 = $2615;
                                $2616 = $2616.tail;
                            }
                            return _expr$10;
                        })();
                        var $2613 = _expr$9;
                        return $2613;
                    case 'Fm.Term.cse':
                        var $2624 = self.path;
                        var $2625 = self.expr;
                        var $2626 = self.name;
                        var $2627 = self.with;
                        var $2628 = self.cses;
                        var $2629 = self.moti;
                        var _expr$14 = (() => {
                            var $2632 = _expr$1;
                            var $2633 = _wyth$3;
                            let _expr$15 = $2632;
                            let _defn$14;
                            while ($2633._ === 'List.cons') {
                                _defn$14 = $2633.head;
                                var $2632 = Fm$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2634 = self.file;
                                            var $2635 = self.code;
                                            var $2636 = self.name;
                                            var $2637 = self.term;
                                            var $2638 = self.type;
                                            var $2639 = self.stat;
                                            var $2640 = $2637;
                                            return $2640;
                                    };
                                })());
                                _expr$15 = $2632;
                                $2633 = $2633.tail;
                            }
                            return _expr$15;
                        })();
                        var $2630 = _expr$14;
                        return $2630;
                    case 'Fm.Term.ori':
                        var $2641 = self.orig;
                        var $2642 = self.expr;
                        var _expr$10 = (() => {
                            var $2645 = _expr$1;
                            var $2646 = _wyth$3;
                            let _expr$11 = $2645;
                            let _defn$10;
                            while ($2646._ === 'List.cons') {
                                _defn$10 = $2646.head;
                                var $2645 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2647 = self.file;
                                            var $2648 = self.code;
                                            var $2649 = self.name;
                                            var $2650 = self.term;
                                            var $2651 = self.type;
                                            var $2652 = self.stat;
                                            var $2653 = $2650;
                                            return $2653;
                                    };
                                })());
                                _expr$11 = $2645;
                                $2646 = $2646.tail;
                            }
                            return _expr$11;
                        })();
                        var $2643 = _expr$10;
                        return $2643;
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
                var $2655 = self.name;
                var $2656 = self.indx;
                var $2657 = Maybe$none;
                var $2654 = $2657;
                break;
            case 'Fm.Term.ref':
                var $2658 = self.name;
                var $2659 = Maybe$none;
                var $2654 = $2659;
                break;
            case 'Fm.Term.typ':
                var $2660 = Maybe$none;
                var $2654 = $2660;
                break;
            case 'Fm.Term.all':
                var $2661 = self.eras;
                var $2662 = self.self;
                var $2663 = self.name;
                var $2664 = self.xtyp;
                var $2665 = self.body;
                var _moti$14 = Fm$Term$desugar_cse$motive$(_with$3, _moti$5);
                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, List$nil, $2664, _moti$14, _defs$7);
                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                var _type$17 = $2665(Fm$Term$var$($2662, 0n))(Fm$Term$var$($2663, 0n));
                var $2666 = Maybe$some$(Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _with$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $2654 = $2666;
                break;
            case 'Fm.Term.lam':
                var $2667 = self.name;
                var $2668 = self.body;
                var $2669 = Maybe$none;
                var $2654 = $2669;
                break;
            case 'Fm.Term.app':
                var $2670 = self.func;
                var $2671 = self.argm;
                var $2672 = Maybe$none;
                var $2654 = $2672;
                break;
            case 'Fm.Term.let':
                var $2673 = self.name;
                var $2674 = self.expr;
                var $2675 = self.body;
                var $2676 = Maybe$none;
                var $2654 = $2676;
                break;
            case 'Fm.Term.def':
                var $2677 = self.name;
                var $2678 = self.expr;
                var $2679 = self.body;
                var $2680 = Maybe$none;
                var $2654 = $2680;
                break;
            case 'Fm.Term.ann':
                var $2681 = self.done;
                var $2682 = self.term;
                var $2683 = self.type;
                var $2684 = Maybe$none;
                var $2654 = $2684;
                break;
            case 'Fm.Term.gol':
                var $2685 = self.name;
                var $2686 = self.dref;
                var $2687 = self.verb;
                var $2688 = Maybe$none;
                var $2654 = $2688;
                break;
            case 'Fm.Term.hol':
                var $2689 = self.path;
                var $2690 = Maybe$none;
                var $2654 = $2690;
                break;
            case 'Fm.Term.nat':
                var $2691 = self.natx;
                var $2692 = Maybe$none;
                var $2654 = $2692;
                break;
            case 'Fm.Term.chr':
                var $2693 = self.chrx;
                var $2694 = Maybe$none;
                var $2654 = $2694;
                break;
            case 'Fm.Term.str':
                var $2695 = self.strx;
                var $2696 = Maybe$none;
                var $2654 = $2696;
                break;
            case 'Fm.Term.cse':
                var $2697 = self.path;
                var $2698 = self.expr;
                var $2699 = self.name;
                var $2700 = self.with;
                var $2701 = self.cses;
                var $2702 = self.moti;
                var $2703 = Maybe$none;
                var $2654 = $2703;
                break;
            case 'Fm.Term.ori':
                var $2704 = self.orig;
                var $2705 = self.expr;
                var $2706 = Maybe$none;
                var $2654 = $2706;
                break;
        };
        return $2654;
    };
    const Fm$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Error$patch$(_path$1, _term$2) {
        var $2707 = ({
            _: 'Fm.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $2707;
    };
    const Fm$Error$patch = x0 => x1 => Fm$Error$patch$(x0, x1);

    function Fm$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.none':
                var $2709 = Bits$e;
                var $2708 = $2709;
                break;
            case 'Maybe.some':
                var $2710 = self.value;
                var $2711 = $2710(Bits$e);
                var $2708 = $2711;
                break;
        };
        return $2708;
    };
    const Fm$MPath$to_bits = x0 => Fm$MPath$to_bits$(x0);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $2713 = Bool$false;
                var $2712 = $2713;
                break;
            case 'Maybe.some':
                var $2714 = self.value;
                var $2715 = Bool$true;
                var $2712 = $2715;
                break;
        };
        return $2712;
    };
    const Set$has = x0 => x1 => Set$has$(x0, x1);

    function Fm$Term$equal$patch$(_path$2, _term$3, _ret$4) {
        var $2716 = Fm$Check$result$(Maybe$some$(_ret$4), List$cons$(Fm$Error$patch$(_path$2, Fm$Term$normalize$(_term$3, Map$new)), List$nil));
        return $2716;
    };
    const Fm$Term$equal$patch = x0 => x1 => x2 => Fm$Term$equal$patch$(x0, x1, x2);

    function Fm$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2718 = self.name;
                var $2719 = self.indx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2721 = self.name;
                        var $2722 = self.indx;
                        var $2723 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2723;
                        break;
                    case 'Fm.Term.ref':
                        var $2724 = self.name;
                        var $2725 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2725;
                        break;
                    case 'Fm.Term.typ':
                        var $2726 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2726;
                        break;
                    case 'Fm.Term.all':
                        var $2727 = self.eras;
                        var $2728 = self.self;
                        var $2729 = self.name;
                        var $2730 = self.xtyp;
                        var $2731 = self.body;
                        var $2732 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2732;
                        break;
                    case 'Fm.Term.lam':
                        var $2733 = self.name;
                        var $2734 = self.body;
                        var $2735 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2735;
                        break;
                    case 'Fm.Term.app':
                        var $2736 = self.func;
                        var $2737 = self.argm;
                        var $2738 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2738;
                        break;
                    case 'Fm.Term.let':
                        var $2739 = self.name;
                        var $2740 = self.expr;
                        var $2741 = self.body;
                        var $2742 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2742;
                        break;
                    case 'Fm.Term.def':
                        var $2743 = self.name;
                        var $2744 = self.expr;
                        var $2745 = self.body;
                        var $2746 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2746;
                        break;
                    case 'Fm.Term.ann':
                        var $2747 = self.done;
                        var $2748 = self.term;
                        var $2749 = self.type;
                        var $2750 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2750;
                        break;
                    case 'Fm.Term.gol':
                        var $2751 = self.name;
                        var $2752 = self.dref;
                        var $2753 = self.verb;
                        var $2754 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2754;
                        break;
                    case 'Fm.Term.hol':
                        var $2755 = self.path;
                        var $2756 = Fm$Term$equal$patch$($2755, _a$1, Unit$new);
                        var $2720 = $2756;
                        break;
                    case 'Fm.Term.nat':
                        var $2757 = self.natx;
                        var $2758 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2758;
                        break;
                    case 'Fm.Term.chr':
                        var $2759 = self.chrx;
                        var $2760 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2760;
                        break;
                    case 'Fm.Term.str':
                        var $2761 = self.strx;
                        var $2762 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2762;
                        break;
                    case 'Fm.Term.cse':
                        var $2763 = self.path;
                        var $2764 = self.expr;
                        var $2765 = self.name;
                        var $2766 = self.with;
                        var $2767 = self.cses;
                        var $2768 = self.moti;
                        var $2769 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2720 = $2769;
                        break;
                    case 'Fm.Term.ori':
                        var $2770 = self.orig;
                        var $2771 = self.expr;
                        var $2772 = Fm$Term$equal$extra_holes$(_a$1, $2771);
                        var $2720 = $2772;
                        break;
                };
                var $2717 = $2720;
                break;
            case 'Fm.Term.ref':
                var $2773 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2775 = self.name;
                        var $2776 = self.indx;
                        var $2777 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2777;
                        break;
                    case 'Fm.Term.ref':
                        var $2778 = self.name;
                        var $2779 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2779;
                        break;
                    case 'Fm.Term.typ':
                        var $2780 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2780;
                        break;
                    case 'Fm.Term.all':
                        var $2781 = self.eras;
                        var $2782 = self.self;
                        var $2783 = self.name;
                        var $2784 = self.xtyp;
                        var $2785 = self.body;
                        var $2786 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2786;
                        break;
                    case 'Fm.Term.lam':
                        var $2787 = self.name;
                        var $2788 = self.body;
                        var $2789 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2789;
                        break;
                    case 'Fm.Term.app':
                        var $2790 = self.func;
                        var $2791 = self.argm;
                        var $2792 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2792;
                        break;
                    case 'Fm.Term.let':
                        var $2793 = self.name;
                        var $2794 = self.expr;
                        var $2795 = self.body;
                        var $2796 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2796;
                        break;
                    case 'Fm.Term.def':
                        var $2797 = self.name;
                        var $2798 = self.expr;
                        var $2799 = self.body;
                        var $2800 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2800;
                        break;
                    case 'Fm.Term.ann':
                        var $2801 = self.done;
                        var $2802 = self.term;
                        var $2803 = self.type;
                        var $2804 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2804;
                        break;
                    case 'Fm.Term.gol':
                        var $2805 = self.name;
                        var $2806 = self.dref;
                        var $2807 = self.verb;
                        var $2808 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2808;
                        break;
                    case 'Fm.Term.hol':
                        var $2809 = self.path;
                        var $2810 = Fm$Term$equal$patch$($2809, _a$1, Unit$new);
                        var $2774 = $2810;
                        break;
                    case 'Fm.Term.nat':
                        var $2811 = self.natx;
                        var $2812 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2812;
                        break;
                    case 'Fm.Term.chr':
                        var $2813 = self.chrx;
                        var $2814 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2814;
                        break;
                    case 'Fm.Term.str':
                        var $2815 = self.strx;
                        var $2816 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2816;
                        break;
                    case 'Fm.Term.cse':
                        var $2817 = self.path;
                        var $2818 = self.expr;
                        var $2819 = self.name;
                        var $2820 = self.with;
                        var $2821 = self.cses;
                        var $2822 = self.moti;
                        var $2823 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2774 = $2823;
                        break;
                    case 'Fm.Term.ori':
                        var $2824 = self.orig;
                        var $2825 = self.expr;
                        var $2826 = Fm$Term$equal$extra_holes$(_a$1, $2825);
                        var $2774 = $2826;
                        break;
                };
                var $2717 = $2774;
                break;
            case 'Fm.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2828 = self.name;
                        var $2829 = self.indx;
                        var $2830 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2830;
                        break;
                    case 'Fm.Term.ref':
                        var $2831 = self.name;
                        var $2832 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2832;
                        break;
                    case 'Fm.Term.typ':
                        var $2833 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2833;
                        break;
                    case 'Fm.Term.all':
                        var $2834 = self.eras;
                        var $2835 = self.self;
                        var $2836 = self.name;
                        var $2837 = self.xtyp;
                        var $2838 = self.body;
                        var $2839 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2839;
                        break;
                    case 'Fm.Term.lam':
                        var $2840 = self.name;
                        var $2841 = self.body;
                        var $2842 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2842;
                        break;
                    case 'Fm.Term.app':
                        var $2843 = self.func;
                        var $2844 = self.argm;
                        var $2845 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2845;
                        break;
                    case 'Fm.Term.let':
                        var $2846 = self.name;
                        var $2847 = self.expr;
                        var $2848 = self.body;
                        var $2849 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2849;
                        break;
                    case 'Fm.Term.def':
                        var $2850 = self.name;
                        var $2851 = self.expr;
                        var $2852 = self.body;
                        var $2853 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2853;
                        break;
                    case 'Fm.Term.ann':
                        var $2854 = self.done;
                        var $2855 = self.term;
                        var $2856 = self.type;
                        var $2857 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2857;
                        break;
                    case 'Fm.Term.gol':
                        var $2858 = self.name;
                        var $2859 = self.dref;
                        var $2860 = self.verb;
                        var $2861 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2861;
                        break;
                    case 'Fm.Term.hol':
                        var $2862 = self.path;
                        var $2863 = Fm$Term$equal$patch$($2862, _a$1, Unit$new);
                        var $2827 = $2863;
                        break;
                    case 'Fm.Term.nat':
                        var $2864 = self.natx;
                        var $2865 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2865;
                        break;
                    case 'Fm.Term.chr':
                        var $2866 = self.chrx;
                        var $2867 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2867;
                        break;
                    case 'Fm.Term.str':
                        var $2868 = self.strx;
                        var $2869 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2869;
                        break;
                    case 'Fm.Term.cse':
                        var $2870 = self.path;
                        var $2871 = self.expr;
                        var $2872 = self.name;
                        var $2873 = self.with;
                        var $2874 = self.cses;
                        var $2875 = self.moti;
                        var $2876 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2827 = $2876;
                        break;
                    case 'Fm.Term.ori':
                        var $2877 = self.orig;
                        var $2878 = self.expr;
                        var $2879 = Fm$Term$equal$extra_holes$(_a$1, $2878);
                        var $2827 = $2879;
                        break;
                };
                var $2717 = $2827;
                break;
            case 'Fm.Term.all':
                var $2880 = self.eras;
                var $2881 = self.self;
                var $2882 = self.name;
                var $2883 = self.xtyp;
                var $2884 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2886 = self.name;
                        var $2887 = self.indx;
                        var $2888 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2888;
                        break;
                    case 'Fm.Term.ref':
                        var $2889 = self.name;
                        var $2890 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2890;
                        break;
                    case 'Fm.Term.typ':
                        var $2891 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2891;
                        break;
                    case 'Fm.Term.all':
                        var $2892 = self.eras;
                        var $2893 = self.self;
                        var $2894 = self.name;
                        var $2895 = self.xtyp;
                        var $2896 = self.body;
                        var $2897 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2897;
                        break;
                    case 'Fm.Term.lam':
                        var $2898 = self.name;
                        var $2899 = self.body;
                        var $2900 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2900;
                        break;
                    case 'Fm.Term.app':
                        var $2901 = self.func;
                        var $2902 = self.argm;
                        var $2903 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2903;
                        break;
                    case 'Fm.Term.let':
                        var $2904 = self.name;
                        var $2905 = self.expr;
                        var $2906 = self.body;
                        var $2907 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2907;
                        break;
                    case 'Fm.Term.def':
                        var $2908 = self.name;
                        var $2909 = self.expr;
                        var $2910 = self.body;
                        var $2911 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2911;
                        break;
                    case 'Fm.Term.ann':
                        var $2912 = self.done;
                        var $2913 = self.term;
                        var $2914 = self.type;
                        var $2915 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2915;
                        break;
                    case 'Fm.Term.gol':
                        var $2916 = self.name;
                        var $2917 = self.dref;
                        var $2918 = self.verb;
                        var $2919 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2919;
                        break;
                    case 'Fm.Term.hol':
                        var $2920 = self.path;
                        var $2921 = Fm$Term$equal$patch$($2920, _a$1, Unit$new);
                        var $2885 = $2921;
                        break;
                    case 'Fm.Term.nat':
                        var $2922 = self.natx;
                        var $2923 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2923;
                        break;
                    case 'Fm.Term.chr':
                        var $2924 = self.chrx;
                        var $2925 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2925;
                        break;
                    case 'Fm.Term.str':
                        var $2926 = self.strx;
                        var $2927 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2927;
                        break;
                    case 'Fm.Term.cse':
                        var $2928 = self.path;
                        var $2929 = self.expr;
                        var $2930 = self.name;
                        var $2931 = self.with;
                        var $2932 = self.cses;
                        var $2933 = self.moti;
                        var $2934 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2885 = $2934;
                        break;
                    case 'Fm.Term.ori':
                        var $2935 = self.orig;
                        var $2936 = self.expr;
                        var $2937 = Fm$Term$equal$extra_holes$(_a$1, $2936);
                        var $2885 = $2937;
                        break;
                };
                var $2717 = $2885;
                break;
            case 'Fm.Term.lam':
                var $2938 = self.name;
                var $2939 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2941 = self.name;
                        var $2942 = self.indx;
                        var $2943 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2943;
                        break;
                    case 'Fm.Term.ref':
                        var $2944 = self.name;
                        var $2945 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2945;
                        break;
                    case 'Fm.Term.typ':
                        var $2946 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2946;
                        break;
                    case 'Fm.Term.all':
                        var $2947 = self.eras;
                        var $2948 = self.self;
                        var $2949 = self.name;
                        var $2950 = self.xtyp;
                        var $2951 = self.body;
                        var $2952 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2952;
                        break;
                    case 'Fm.Term.lam':
                        var $2953 = self.name;
                        var $2954 = self.body;
                        var $2955 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2955;
                        break;
                    case 'Fm.Term.app':
                        var $2956 = self.func;
                        var $2957 = self.argm;
                        var $2958 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2958;
                        break;
                    case 'Fm.Term.let':
                        var $2959 = self.name;
                        var $2960 = self.expr;
                        var $2961 = self.body;
                        var $2962 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2962;
                        break;
                    case 'Fm.Term.def':
                        var $2963 = self.name;
                        var $2964 = self.expr;
                        var $2965 = self.body;
                        var $2966 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2966;
                        break;
                    case 'Fm.Term.ann':
                        var $2967 = self.done;
                        var $2968 = self.term;
                        var $2969 = self.type;
                        var $2970 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2970;
                        break;
                    case 'Fm.Term.gol':
                        var $2971 = self.name;
                        var $2972 = self.dref;
                        var $2973 = self.verb;
                        var $2974 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2974;
                        break;
                    case 'Fm.Term.hol':
                        var $2975 = self.path;
                        var $2976 = Fm$Term$equal$patch$($2975, _a$1, Unit$new);
                        var $2940 = $2976;
                        break;
                    case 'Fm.Term.nat':
                        var $2977 = self.natx;
                        var $2978 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2978;
                        break;
                    case 'Fm.Term.chr':
                        var $2979 = self.chrx;
                        var $2980 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2980;
                        break;
                    case 'Fm.Term.str':
                        var $2981 = self.strx;
                        var $2982 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2982;
                        break;
                    case 'Fm.Term.cse':
                        var $2983 = self.path;
                        var $2984 = self.expr;
                        var $2985 = self.name;
                        var $2986 = self.with;
                        var $2987 = self.cses;
                        var $2988 = self.moti;
                        var $2989 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2940 = $2989;
                        break;
                    case 'Fm.Term.ori':
                        var $2990 = self.orig;
                        var $2991 = self.expr;
                        var $2992 = Fm$Term$equal$extra_holes$(_a$1, $2991);
                        var $2940 = $2992;
                        break;
                };
                var $2717 = $2940;
                break;
            case 'Fm.Term.app':
                var $2993 = self.func;
                var $2994 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2996 = self.name;
                        var $2997 = self.indx;
                        var $2998 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $2998;
                        break;
                    case 'Fm.Term.ref':
                        var $2999 = self.name;
                        var $3000 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3000;
                        break;
                    case 'Fm.Term.typ':
                        var $3001 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3001;
                        break;
                    case 'Fm.Term.all':
                        var $3002 = self.eras;
                        var $3003 = self.self;
                        var $3004 = self.name;
                        var $3005 = self.xtyp;
                        var $3006 = self.body;
                        var $3007 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3007;
                        break;
                    case 'Fm.Term.lam':
                        var $3008 = self.name;
                        var $3009 = self.body;
                        var $3010 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3010;
                        break;
                    case 'Fm.Term.app':
                        var $3011 = self.func;
                        var $3012 = self.argm;
                        var $3013 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$($2993, $3011))((_$7 => {
                            var $3014 = Fm$Term$equal$extra_holes$($2994, $3012);
                            return $3014;
                        }));
                        var $2995 = $3013;
                        break;
                    case 'Fm.Term.let':
                        var $3015 = self.name;
                        var $3016 = self.expr;
                        var $3017 = self.body;
                        var $3018 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3018;
                        break;
                    case 'Fm.Term.def':
                        var $3019 = self.name;
                        var $3020 = self.expr;
                        var $3021 = self.body;
                        var $3022 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3022;
                        break;
                    case 'Fm.Term.ann':
                        var $3023 = self.done;
                        var $3024 = self.term;
                        var $3025 = self.type;
                        var $3026 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3026;
                        break;
                    case 'Fm.Term.gol':
                        var $3027 = self.name;
                        var $3028 = self.dref;
                        var $3029 = self.verb;
                        var $3030 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3030;
                        break;
                    case 'Fm.Term.hol':
                        var $3031 = self.path;
                        var $3032 = Fm$Term$equal$patch$($3031, _a$1, Unit$new);
                        var $2995 = $3032;
                        break;
                    case 'Fm.Term.nat':
                        var $3033 = self.natx;
                        var $3034 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3034;
                        break;
                    case 'Fm.Term.chr':
                        var $3035 = self.chrx;
                        var $3036 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3036;
                        break;
                    case 'Fm.Term.str':
                        var $3037 = self.strx;
                        var $3038 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3038;
                        break;
                    case 'Fm.Term.cse':
                        var $3039 = self.path;
                        var $3040 = self.expr;
                        var $3041 = self.name;
                        var $3042 = self.with;
                        var $3043 = self.cses;
                        var $3044 = self.moti;
                        var $3045 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2995 = $3045;
                        break;
                    case 'Fm.Term.ori':
                        var $3046 = self.orig;
                        var $3047 = self.expr;
                        var $3048 = Fm$Term$equal$extra_holes$(_a$1, $3047);
                        var $2995 = $3048;
                        break;
                };
                var $2717 = $2995;
                break;
            case 'Fm.Term.let':
                var $3049 = self.name;
                var $3050 = self.expr;
                var $3051 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3053 = self.name;
                        var $3054 = self.indx;
                        var $3055 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3055;
                        break;
                    case 'Fm.Term.ref':
                        var $3056 = self.name;
                        var $3057 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3057;
                        break;
                    case 'Fm.Term.typ':
                        var $3058 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3058;
                        break;
                    case 'Fm.Term.all':
                        var $3059 = self.eras;
                        var $3060 = self.self;
                        var $3061 = self.name;
                        var $3062 = self.xtyp;
                        var $3063 = self.body;
                        var $3064 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3064;
                        break;
                    case 'Fm.Term.lam':
                        var $3065 = self.name;
                        var $3066 = self.body;
                        var $3067 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3067;
                        break;
                    case 'Fm.Term.app':
                        var $3068 = self.func;
                        var $3069 = self.argm;
                        var $3070 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3070;
                        break;
                    case 'Fm.Term.let':
                        var $3071 = self.name;
                        var $3072 = self.expr;
                        var $3073 = self.body;
                        var $3074 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3074;
                        break;
                    case 'Fm.Term.def':
                        var $3075 = self.name;
                        var $3076 = self.expr;
                        var $3077 = self.body;
                        var $3078 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3078;
                        break;
                    case 'Fm.Term.ann':
                        var $3079 = self.done;
                        var $3080 = self.term;
                        var $3081 = self.type;
                        var $3082 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3082;
                        break;
                    case 'Fm.Term.gol':
                        var $3083 = self.name;
                        var $3084 = self.dref;
                        var $3085 = self.verb;
                        var $3086 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3086;
                        break;
                    case 'Fm.Term.hol':
                        var $3087 = self.path;
                        var $3088 = Fm$Term$equal$patch$($3087, _a$1, Unit$new);
                        var $3052 = $3088;
                        break;
                    case 'Fm.Term.nat':
                        var $3089 = self.natx;
                        var $3090 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3090;
                        break;
                    case 'Fm.Term.chr':
                        var $3091 = self.chrx;
                        var $3092 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3092;
                        break;
                    case 'Fm.Term.str':
                        var $3093 = self.strx;
                        var $3094 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3094;
                        break;
                    case 'Fm.Term.cse':
                        var $3095 = self.path;
                        var $3096 = self.expr;
                        var $3097 = self.name;
                        var $3098 = self.with;
                        var $3099 = self.cses;
                        var $3100 = self.moti;
                        var $3101 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3101;
                        break;
                    case 'Fm.Term.ori':
                        var $3102 = self.orig;
                        var $3103 = self.expr;
                        var $3104 = Fm$Term$equal$extra_holes$(_a$1, $3103);
                        var $3052 = $3104;
                        break;
                };
                var $2717 = $3052;
                break;
            case 'Fm.Term.def':
                var $3105 = self.name;
                var $3106 = self.expr;
                var $3107 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3109 = self.name;
                        var $3110 = self.indx;
                        var $3111 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3111;
                        break;
                    case 'Fm.Term.ref':
                        var $3112 = self.name;
                        var $3113 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3113;
                        break;
                    case 'Fm.Term.typ':
                        var $3114 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3114;
                        break;
                    case 'Fm.Term.all':
                        var $3115 = self.eras;
                        var $3116 = self.self;
                        var $3117 = self.name;
                        var $3118 = self.xtyp;
                        var $3119 = self.body;
                        var $3120 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3120;
                        break;
                    case 'Fm.Term.lam':
                        var $3121 = self.name;
                        var $3122 = self.body;
                        var $3123 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3123;
                        break;
                    case 'Fm.Term.app':
                        var $3124 = self.func;
                        var $3125 = self.argm;
                        var $3126 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3126;
                        break;
                    case 'Fm.Term.let':
                        var $3127 = self.name;
                        var $3128 = self.expr;
                        var $3129 = self.body;
                        var $3130 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3130;
                        break;
                    case 'Fm.Term.def':
                        var $3131 = self.name;
                        var $3132 = self.expr;
                        var $3133 = self.body;
                        var $3134 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3134;
                        break;
                    case 'Fm.Term.ann':
                        var $3135 = self.done;
                        var $3136 = self.term;
                        var $3137 = self.type;
                        var $3138 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3138;
                        break;
                    case 'Fm.Term.gol':
                        var $3139 = self.name;
                        var $3140 = self.dref;
                        var $3141 = self.verb;
                        var $3142 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3142;
                        break;
                    case 'Fm.Term.hol':
                        var $3143 = self.path;
                        var $3144 = Fm$Term$equal$patch$($3143, _a$1, Unit$new);
                        var $3108 = $3144;
                        break;
                    case 'Fm.Term.nat':
                        var $3145 = self.natx;
                        var $3146 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3146;
                        break;
                    case 'Fm.Term.chr':
                        var $3147 = self.chrx;
                        var $3148 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3148;
                        break;
                    case 'Fm.Term.str':
                        var $3149 = self.strx;
                        var $3150 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3150;
                        break;
                    case 'Fm.Term.cse':
                        var $3151 = self.path;
                        var $3152 = self.expr;
                        var $3153 = self.name;
                        var $3154 = self.with;
                        var $3155 = self.cses;
                        var $3156 = self.moti;
                        var $3157 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3108 = $3157;
                        break;
                    case 'Fm.Term.ori':
                        var $3158 = self.orig;
                        var $3159 = self.expr;
                        var $3160 = Fm$Term$equal$extra_holes$(_a$1, $3159);
                        var $3108 = $3160;
                        break;
                };
                var $2717 = $3108;
                break;
            case 'Fm.Term.ann':
                var $3161 = self.done;
                var $3162 = self.term;
                var $3163 = self.type;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3165 = self.name;
                        var $3166 = self.indx;
                        var $3167 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3167;
                        break;
                    case 'Fm.Term.ref':
                        var $3168 = self.name;
                        var $3169 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3169;
                        break;
                    case 'Fm.Term.typ':
                        var $3170 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3170;
                        break;
                    case 'Fm.Term.all':
                        var $3171 = self.eras;
                        var $3172 = self.self;
                        var $3173 = self.name;
                        var $3174 = self.xtyp;
                        var $3175 = self.body;
                        var $3176 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3176;
                        break;
                    case 'Fm.Term.lam':
                        var $3177 = self.name;
                        var $3178 = self.body;
                        var $3179 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3179;
                        break;
                    case 'Fm.Term.app':
                        var $3180 = self.func;
                        var $3181 = self.argm;
                        var $3182 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3182;
                        break;
                    case 'Fm.Term.let':
                        var $3183 = self.name;
                        var $3184 = self.expr;
                        var $3185 = self.body;
                        var $3186 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3186;
                        break;
                    case 'Fm.Term.def':
                        var $3187 = self.name;
                        var $3188 = self.expr;
                        var $3189 = self.body;
                        var $3190 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3190;
                        break;
                    case 'Fm.Term.ann':
                        var $3191 = self.done;
                        var $3192 = self.term;
                        var $3193 = self.type;
                        var $3194 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3194;
                        break;
                    case 'Fm.Term.gol':
                        var $3195 = self.name;
                        var $3196 = self.dref;
                        var $3197 = self.verb;
                        var $3198 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3198;
                        break;
                    case 'Fm.Term.hol':
                        var $3199 = self.path;
                        var $3200 = Fm$Term$equal$patch$($3199, _a$1, Unit$new);
                        var $3164 = $3200;
                        break;
                    case 'Fm.Term.nat':
                        var $3201 = self.natx;
                        var $3202 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3202;
                        break;
                    case 'Fm.Term.chr':
                        var $3203 = self.chrx;
                        var $3204 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3204;
                        break;
                    case 'Fm.Term.str':
                        var $3205 = self.strx;
                        var $3206 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3206;
                        break;
                    case 'Fm.Term.cse':
                        var $3207 = self.path;
                        var $3208 = self.expr;
                        var $3209 = self.name;
                        var $3210 = self.with;
                        var $3211 = self.cses;
                        var $3212 = self.moti;
                        var $3213 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3164 = $3213;
                        break;
                    case 'Fm.Term.ori':
                        var $3214 = self.orig;
                        var $3215 = self.expr;
                        var $3216 = Fm$Term$equal$extra_holes$(_a$1, $3215);
                        var $3164 = $3216;
                        break;
                };
                var $2717 = $3164;
                break;
            case 'Fm.Term.gol':
                var $3217 = self.name;
                var $3218 = self.dref;
                var $3219 = self.verb;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3221 = self.name;
                        var $3222 = self.indx;
                        var $3223 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3223;
                        break;
                    case 'Fm.Term.ref':
                        var $3224 = self.name;
                        var $3225 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3225;
                        break;
                    case 'Fm.Term.typ':
                        var $3226 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3226;
                        break;
                    case 'Fm.Term.all':
                        var $3227 = self.eras;
                        var $3228 = self.self;
                        var $3229 = self.name;
                        var $3230 = self.xtyp;
                        var $3231 = self.body;
                        var $3232 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3232;
                        break;
                    case 'Fm.Term.lam':
                        var $3233 = self.name;
                        var $3234 = self.body;
                        var $3235 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3235;
                        break;
                    case 'Fm.Term.app':
                        var $3236 = self.func;
                        var $3237 = self.argm;
                        var $3238 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3238;
                        break;
                    case 'Fm.Term.let':
                        var $3239 = self.name;
                        var $3240 = self.expr;
                        var $3241 = self.body;
                        var $3242 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3242;
                        break;
                    case 'Fm.Term.def':
                        var $3243 = self.name;
                        var $3244 = self.expr;
                        var $3245 = self.body;
                        var $3246 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3246;
                        break;
                    case 'Fm.Term.ann':
                        var $3247 = self.done;
                        var $3248 = self.term;
                        var $3249 = self.type;
                        var $3250 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3250;
                        break;
                    case 'Fm.Term.gol':
                        var $3251 = self.name;
                        var $3252 = self.dref;
                        var $3253 = self.verb;
                        var $3254 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3254;
                        break;
                    case 'Fm.Term.hol':
                        var $3255 = self.path;
                        var $3256 = Fm$Term$equal$patch$($3255, _a$1, Unit$new);
                        var $3220 = $3256;
                        break;
                    case 'Fm.Term.nat':
                        var $3257 = self.natx;
                        var $3258 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3258;
                        break;
                    case 'Fm.Term.chr':
                        var $3259 = self.chrx;
                        var $3260 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3260;
                        break;
                    case 'Fm.Term.str':
                        var $3261 = self.strx;
                        var $3262 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3262;
                        break;
                    case 'Fm.Term.cse':
                        var $3263 = self.path;
                        var $3264 = self.expr;
                        var $3265 = self.name;
                        var $3266 = self.with;
                        var $3267 = self.cses;
                        var $3268 = self.moti;
                        var $3269 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3220 = $3269;
                        break;
                    case 'Fm.Term.ori':
                        var $3270 = self.orig;
                        var $3271 = self.expr;
                        var $3272 = Fm$Term$equal$extra_holes$(_a$1, $3271);
                        var $3220 = $3272;
                        break;
                };
                var $2717 = $3220;
                break;
            case 'Fm.Term.hol':
                var $3273 = self.path;
                var $3274 = Fm$Term$equal$patch$($3273, _b$2, Unit$new);
                var $2717 = $3274;
                break;
            case 'Fm.Term.nat':
                var $3275 = self.natx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3277 = self.name;
                        var $3278 = self.indx;
                        var $3279 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3279;
                        break;
                    case 'Fm.Term.ref':
                        var $3280 = self.name;
                        var $3281 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3281;
                        break;
                    case 'Fm.Term.typ':
                        var $3282 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3282;
                        break;
                    case 'Fm.Term.all':
                        var $3283 = self.eras;
                        var $3284 = self.self;
                        var $3285 = self.name;
                        var $3286 = self.xtyp;
                        var $3287 = self.body;
                        var $3288 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3288;
                        break;
                    case 'Fm.Term.lam':
                        var $3289 = self.name;
                        var $3290 = self.body;
                        var $3291 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3291;
                        break;
                    case 'Fm.Term.app':
                        var $3292 = self.func;
                        var $3293 = self.argm;
                        var $3294 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3294;
                        break;
                    case 'Fm.Term.let':
                        var $3295 = self.name;
                        var $3296 = self.expr;
                        var $3297 = self.body;
                        var $3298 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3298;
                        break;
                    case 'Fm.Term.def':
                        var $3299 = self.name;
                        var $3300 = self.expr;
                        var $3301 = self.body;
                        var $3302 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3302;
                        break;
                    case 'Fm.Term.ann':
                        var $3303 = self.done;
                        var $3304 = self.term;
                        var $3305 = self.type;
                        var $3306 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3306;
                        break;
                    case 'Fm.Term.gol':
                        var $3307 = self.name;
                        var $3308 = self.dref;
                        var $3309 = self.verb;
                        var $3310 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3310;
                        break;
                    case 'Fm.Term.hol':
                        var $3311 = self.path;
                        var $3312 = Fm$Term$equal$patch$($3311, _a$1, Unit$new);
                        var $3276 = $3312;
                        break;
                    case 'Fm.Term.nat':
                        var $3313 = self.natx;
                        var $3314 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3314;
                        break;
                    case 'Fm.Term.chr':
                        var $3315 = self.chrx;
                        var $3316 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3316;
                        break;
                    case 'Fm.Term.str':
                        var $3317 = self.strx;
                        var $3318 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3318;
                        break;
                    case 'Fm.Term.cse':
                        var $3319 = self.path;
                        var $3320 = self.expr;
                        var $3321 = self.name;
                        var $3322 = self.with;
                        var $3323 = self.cses;
                        var $3324 = self.moti;
                        var $3325 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3276 = $3325;
                        break;
                    case 'Fm.Term.ori':
                        var $3326 = self.orig;
                        var $3327 = self.expr;
                        var $3328 = Fm$Term$equal$extra_holes$(_a$1, $3327);
                        var $3276 = $3328;
                        break;
                };
                var $2717 = $3276;
                break;
            case 'Fm.Term.chr':
                var $3329 = self.chrx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3331 = self.name;
                        var $3332 = self.indx;
                        var $3333 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3333;
                        break;
                    case 'Fm.Term.ref':
                        var $3334 = self.name;
                        var $3335 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3335;
                        break;
                    case 'Fm.Term.typ':
                        var $3336 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3336;
                        break;
                    case 'Fm.Term.all':
                        var $3337 = self.eras;
                        var $3338 = self.self;
                        var $3339 = self.name;
                        var $3340 = self.xtyp;
                        var $3341 = self.body;
                        var $3342 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3342;
                        break;
                    case 'Fm.Term.lam':
                        var $3343 = self.name;
                        var $3344 = self.body;
                        var $3345 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3345;
                        break;
                    case 'Fm.Term.app':
                        var $3346 = self.func;
                        var $3347 = self.argm;
                        var $3348 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3348;
                        break;
                    case 'Fm.Term.let':
                        var $3349 = self.name;
                        var $3350 = self.expr;
                        var $3351 = self.body;
                        var $3352 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3352;
                        break;
                    case 'Fm.Term.def':
                        var $3353 = self.name;
                        var $3354 = self.expr;
                        var $3355 = self.body;
                        var $3356 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3356;
                        break;
                    case 'Fm.Term.ann':
                        var $3357 = self.done;
                        var $3358 = self.term;
                        var $3359 = self.type;
                        var $3360 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3360;
                        break;
                    case 'Fm.Term.gol':
                        var $3361 = self.name;
                        var $3362 = self.dref;
                        var $3363 = self.verb;
                        var $3364 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3364;
                        break;
                    case 'Fm.Term.hol':
                        var $3365 = self.path;
                        var $3366 = Fm$Term$equal$patch$($3365, _a$1, Unit$new);
                        var $3330 = $3366;
                        break;
                    case 'Fm.Term.nat':
                        var $3367 = self.natx;
                        var $3368 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3368;
                        break;
                    case 'Fm.Term.chr':
                        var $3369 = self.chrx;
                        var $3370 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3370;
                        break;
                    case 'Fm.Term.str':
                        var $3371 = self.strx;
                        var $3372 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3372;
                        break;
                    case 'Fm.Term.cse':
                        var $3373 = self.path;
                        var $3374 = self.expr;
                        var $3375 = self.name;
                        var $3376 = self.with;
                        var $3377 = self.cses;
                        var $3378 = self.moti;
                        var $3379 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3330 = $3379;
                        break;
                    case 'Fm.Term.ori':
                        var $3380 = self.orig;
                        var $3381 = self.expr;
                        var $3382 = Fm$Term$equal$extra_holes$(_a$1, $3381);
                        var $3330 = $3382;
                        break;
                };
                var $2717 = $3330;
                break;
            case 'Fm.Term.str':
                var $3383 = self.strx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3385 = self.name;
                        var $3386 = self.indx;
                        var $3387 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3387;
                        break;
                    case 'Fm.Term.ref':
                        var $3388 = self.name;
                        var $3389 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3389;
                        break;
                    case 'Fm.Term.typ':
                        var $3390 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3390;
                        break;
                    case 'Fm.Term.all':
                        var $3391 = self.eras;
                        var $3392 = self.self;
                        var $3393 = self.name;
                        var $3394 = self.xtyp;
                        var $3395 = self.body;
                        var $3396 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3396;
                        break;
                    case 'Fm.Term.lam':
                        var $3397 = self.name;
                        var $3398 = self.body;
                        var $3399 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3399;
                        break;
                    case 'Fm.Term.app':
                        var $3400 = self.func;
                        var $3401 = self.argm;
                        var $3402 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3402;
                        break;
                    case 'Fm.Term.let':
                        var $3403 = self.name;
                        var $3404 = self.expr;
                        var $3405 = self.body;
                        var $3406 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3406;
                        break;
                    case 'Fm.Term.def':
                        var $3407 = self.name;
                        var $3408 = self.expr;
                        var $3409 = self.body;
                        var $3410 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3410;
                        break;
                    case 'Fm.Term.ann':
                        var $3411 = self.done;
                        var $3412 = self.term;
                        var $3413 = self.type;
                        var $3414 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3414;
                        break;
                    case 'Fm.Term.gol':
                        var $3415 = self.name;
                        var $3416 = self.dref;
                        var $3417 = self.verb;
                        var $3418 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3418;
                        break;
                    case 'Fm.Term.hol':
                        var $3419 = self.path;
                        var $3420 = Fm$Term$equal$patch$($3419, _a$1, Unit$new);
                        var $3384 = $3420;
                        break;
                    case 'Fm.Term.nat':
                        var $3421 = self.natx;
                        var $3422 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3422;
                        break;
                    case 'Fm.Term.chr':
                        var $3423 = self.chrx;
                        var $3424 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3424;
                        break;
                    case 'Fm.Term.str':
                        var $3425 = self.strx;
                        var $3426 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3426;
                        break;
                    case 'Fm.Term.cse':
                        var $3427 = self.path;
                        var $3428 = self.expr;
                        var $3429 = self.name;
                        var $3430 = self.with;
                        var $3431 = self.cses;
                        var $3432 = self.moti;
                        var $3433 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3384 = $3433;
                        break;
                    case 'Fm.Term.ori':
                        var $3434 = self.orig;
                        var $3435 = self.expr;
                        var $3436 = Fm$Term$equal$extra_holes$(_a$1, $3435);
                        var $3384 = $3436;
                        break;
                };
                var $2717 = $3384;
                break;
            case 'Fm.Term.cse':
                var $3437 = self.path;
                var $3438 = self.expr;
                var $3439 = self.name;
                var $3440 = self.with;
                var $3441 = self.cses;
                var $3442 = self.moti;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3444 = self.name;
                        var $3445 = self.indx;
                        var $3446 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3446;
                        break;
                    case 'Fm.Term.ref':
                        var $3447 = self.name;
                        var $3448 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3448;
                        break;
                    case 'Fm.Term.typ':
                        var $3449 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3449;
                        break;
                    case 'Fm.Term.all':
                        var $3450 = self.eras;
                        var $3451 = self.self;
                        var $3452 = self.name;
                        var $3453 = self.xtyp;
                        var $3454 = self.body;
                        var $3455 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3455;
                        break;
                    case 'Fm.Term.lam':
                        var $3456 = self.name;
                        var $3457 = self.body;
                        var $3458 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3458;
                        break;
                    case 'Fm.Term.app':
                        var $3459 = self.func;
                        var $3460 = self.argm;
                        var $3461 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3461;
                        break;
                    case 'Fm.Term.let':
                        var $3462 = self.name;
                        var $3463 = self.expr;
                        var $3464 = self.body;
                        var $3465 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3465;
                        break;
                    case 'Fm.Term.def':
                        var $3466 = self.name;
                        var $3467 = self.expr;
                        var $3468 = self.body;
                        var $3469 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3469;
                        break;
                    case 'Fm.Term.ann':
                        var $3470 = self.done;
                        var $3471 = self.term;
                        var $3472 = self.type;
                        var $3473 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3473;
                        break;
                    case 'Fm.Term.gol':
                        var $3474 = self.name;
                        var $3475 = self.dref;
                        var $3476 = self.verb;
                        var $3477 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3477;
                        break;
                    case 'Fm.Term.hol':
                        var $3478 = self.path;
                        var $3479 = Fm$Term$equal$patch$($3478, _a$1, Unit$new);
                        var $3443 = $3479;
                        break;
                    case 'Fm.Term.nat':
                        var $3480 = self.natx;
                        var $3481 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3481;
                        break;
                    case 'Fm.Term.chr':
                        var $3482 = self.chrx;
                        var $3483 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3483;
                        break;
                    case 'Fm.Term.str':
                        var $3484 = self.strx;
                        var $3485 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3485;
                        break;
                    case 'Fm.Term.cse':
                        var $3486 = self.path;
                        var $3487 = self.expr;
                        var $3488 = self.name;
                        var $3489 = self.with;
                        var $3490 = self.cses;
                        var $3491 = self.moti;
                        var $3492 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3443 = $3492;
                        break;
                    case 'Fm.Term.ori':
                        var $3493 = self.orig;
                        var $3494 = self.expr;
                        var $3495 = Fm$Term$equal$extra_holes$(_a$1, $3494);
                        var $3443 = $3495;
                        break;
                };
                var $2717 = $3443;
                break;
            case 'Fm.Term.ori':
                var $3496 = self.orig;
                var $3497 = self.expr;
                var $3498 = Fm$Term$equal$extra_holes$($3497, _b$2);
                var $2717 = $3498;
                break;
        };
        return $2717;
    };
    const Fm$Term$equal$extra_holes = x0 => x1 => Fm$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $3499 = Map$set$(_bits$1, Unit$new, _set$2);
        return $3499;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $3501 = _b$2;
            var $3500 = $3501;
        } else {
            var $3502 = (!_b$2);
            var $3500 = $3502;
        };
        return $3500;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Fm$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Fm$Term$serialize$(Fm$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$e);
        var _bh$7 = Fm$Term$serialize$(Fm$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $3504 = Monad$pure$(Fm$Check$monad)(Bool$true);
            var $3503 = $3504;
        } else {
            var _a1$8 = Fm$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Fm$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Fm$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$e);
            var _bh$11 = Fm$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $3506 = Monad$pure$(Fm$Check$monad)(Bool$true);
                var $3505 = $3506;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = Set$has$(_id$12, _seen$5);
                if (self) {
                    var $3508 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$(_a$1, _b$2))((_$13 => {
                        var $3509 = Monad$pure$(Fm$Check$monad)(Bool$true);
                        return $3509;
                    }));
                    var $3507 = $3508;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Fm.Term.var':
                            var $3511 = self.name;
                            var $3512 = self.indx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3514 = self.name;
                                    var $3515 = self.indx;
                                    var $3516 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3516;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3517 = self.name;
                                    var $3518 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3518;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3519 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3519;
                                    break;
                                case 'Fm.Term.all':
                                    var $3520 = self.eras;
                                    var $3521 = self.self;
                                    var $3522 = self.name;
                                    var $3523 = self.xtyp;
                                    var $3524 = self.body;
                                    var $3525 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3525;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3526 = self.name;
                                    var $3527 = self.body;
                                    var $3528 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3528;
                                    break;
                                case 'Fm.Term.app':
                                    var $3529 = self.func;
                                    var $3530 = self.argm;
                                    var $3531 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3531;
                                    break;
                                case 'Fm.Term.let':
                                    var $3532 = self.name;
                                    var $3533 = self.expr;
                                    var $3534 = self.body;
                                    var $3535 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3535;
                                    break;
                                case 'Fm.Term.def':
                                    var $3536 = self.name;
                                    var $3537 = self.expr;
                                    var $3538 = self.body;
                                    var $3539 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3539;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3540 = self.done;
                                    var $3541 = self.term;
                                    var $3542 = self.type;
                                    var $3543 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3543;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3544 = self.name;
                                    var $3545 = self.dref;
                                    var $3546 = self.verb;
                                    var $3547 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3547;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3548 = self.path;
                                    var $3549 = Fm$Term$equal$patch$($3548, _a$1, Bool$true);
                                    var $3513 = $3549;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3550 = self.natx;
                                    var $3551 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3551;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3552 = self.chrx;
                                    var $3553 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3553;
                                    break;
                                case 'Fm.Term.str':
                                    var $3554 = self.strx;
                                    var $3555 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3555;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3556 = self.path;
                                    var $3557 = self.expr;
                                    var $3558 = self.name;
                                    var $3559 = self.with;
                                    var $3560 = self.cses;
                                    var $3561 = self.moti;
                                    var $3562 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3562;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3563 = self.orig;
                                    var $3564 = self.expr;
                                    var $3565 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3513 = $3565;
                                    break;
                            };
                            var $3510 = $3513;
                            break;
                        case 'Fm.Term.ref':
                            var $3566 = self.name;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3568 = self.name;
                                    var $3569 = self.indx;
                                    var $3570 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3570;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3571 = self.name;
                                    var $3572 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3572;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3573 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3573;
                                    break;
                                case 'Fm.Term.all':
                                    var $3574 = self.eras;
                                    var $3575 = self.self;
                                    var $3576 = self.name;
                                    var $3577 = self.xtyp;
                                    var $3578 = self.body;
                                    var $3579 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3579;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3580 = self.name;
                                    var $3581 = self.body;
                                    var $3582 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3582;
                                    break;
                                case 'Fm.Term.app':
                                    var $3583 = self.func;
                                    var $3584 = self.argm;
                                    var $3585 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3585;
                                    break;
                                case 'Fm.Term.let':
                                    var $3586 = self.name;
                                    var $3587 = self.expr;
                                    var $3588 = self.body;
                                    var $3589 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3589;
                                    break;
                                case 'Fm.Term.def':
                                    var $3590 = self.name;
                                    var $3591 = self.expr;
                                    var $3592 = self.body;
                                    var $3593 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3593;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3594 = self.done;
                                    var $3595 = self.term;
                                    var $3596 = self.type;
                                    var $3597 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3597;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3598 = self.name;
                                    var $3599 = self.dref;
                                    var $3600 = self.verb;
                                    var $3601 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3601;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3602 = self.path;
                                    var $3603 = Fm$Term$equal$patch$($3602, _a$1, Bool$true);
                                    var $3567 = $3603;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3604 = self.natx;
                                    var $3605 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3605;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3606 = self.chrx;
                                    var $3607 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3607;
                                    break;
                                case 'Fm.Term.str':
                                    var $3608 = self.strx;
                                    var $3609 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3609;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3610 = self.path;
                                    var $3611 = self.expr;
                                    var $3612 = self.name;
                                    var $3613 = self.with;
                                    var $3614 = self.cses;
                                    var $3615 = self.moti;
                                    var $3616 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3616;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3617 = self.orig;
                                    var $3618 = self.expr;
                                    var $3619 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3567 = $3619;
                                    break;
                            };
                            var $3510 = $3567;
                            break;
                        case 'Fm.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3621 = self.name;
                                    var $3622 = self.indx;
                                    var $3623 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3623;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3624 = self.name;
                                    var $3625 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3625;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3626 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3626;
                                    break;
                                case 'Fm.Term.all':
                                    var $3627 = self.eras;
                                    var $3628 = self.self;
                                    var $3629 = self.name;
                                    var $3630 = self.xtyp;
                                    var $3631 = self.body;
                                    var $3632 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3632;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3633 = self.name;
                                    var $3634 = self.body;
                                    var $3635 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3635;
                                    break;
                                case 'Fm.Term.app':
                                    var $3636 = self.func;
                                    var $3637 = self.argm;
                                    var $3638 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3638;
                                    break;
                                case 'Fm.Term.let':
                                    var $3639 = self.name;
                                    var $3640 = self.expr;
                                    var $3641 = self.body;
                                    var $3642 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3642;
                                    break;
                                case 'Fm.Term.def':
                                    var $3643 = self.name;
                                    var $3644 = self.expr;
                                    var $3645 = self.body;
                                    var $3646 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3646;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3647 = self.done;
                                    var $3648 = self.term;
                                    var $3649 = self.type;
                                    var $3650 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3650;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3651 = self.name;
                                    var $3652 = self.dref;
                                    var $3653 = self.verb;
                                    var $3654 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3654;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3655 = self.path;
                                    var $3656 = Fm$Term$equal$patch$($3655, _a$1, Bool$true);
                                    var $3620 = $3656;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3657 = self.natx;
                                    var $3658 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3658;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3659 = self.chrx;
                                    var $3660 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3660;
                                    break;
                                case 'Fm.Term.str':
                                    var $3661 = self.strx;
                                    var $3662 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3662;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3663 = self.path;
                                    var $3664 = self.expr;
                                    var $3665 = self.name;
                                    var $3666 = self.with;
                                    var $3667 = self.cses;
                                    var $3668 = self.moti;
                                    var $3669 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3669;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3670 = self.orig;
                                    var $3671 = self.expr;
                                    var $3672 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3620 = $3672;
                                    break;
                            };
                            var $3510 = $3620;
                            break;
                        case 'Fm.Term.all':
                            var $3673 = self.eras;
                            var $3674 = self.self;
                            var $3675 = self.name;
                            var $3676 = self.xtyp;
                            var $3677 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3679 = self.name;
                                    var $3680 = self.indx;
                                    var $3681 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3681;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3682 = self.name;
                                    var $3683 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3683;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3684 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3684;
                                    break;
                                case 'Fm.Term.all':
                                    var $3685 = self.eras;
                                    var $3686 = self.self;
                                    var $3687 = self.name;
                                    var $3688 = self.xtyp;
                                    var $3689 = self.body;
                                    var _seen$23 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$24 = $3677(Fm$Term$var$($3674, _lv$4))(Fm$Term$var$($3675, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $3689(Fm$Term$var$($3686, _lv$4))(Fm$Term$var$($3687, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($3674 === $3686);
                                    var _eq_eras$27 = Bool$eql$($3673, $3685);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var $3691 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3676, $3688, _defs$3, _lv$4, _seen$23))((_eq_type$28 => {
                                            var $3692 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23))((_eq_body$29 => {
                                                var $3693 = Monad$pure$(Fm$Check$monad)((_eq_type$28 && _eq_body$29));
                                                return $3693;
                                            }));
                                            return $3692;
                                        }));
                                        var $3690 = $3691;
                                    } else {
                                        var $3694 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                        var $3690 = $3694;
                                    };
                                    var $3678 = $3690;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3695 = self.name;
                                    var $3696 = self.body;
                                    var $3697 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3697;
                                    break;
                                case 'Fm.Term.app':
                                    var $3698 = self.func;
                                    var $3699 = self.argm;
                                    var $3700 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3700;
                                    break;
                                case 'Fm.Term.let':
                                    var $3701 = self.name;
                                    var $3702 = self.expr;
                                    var $3703 = self.body;
                                    var $3704 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3704;
                                    break;
                                case 'Fm.Term.def':
                                    var $3705 = self.name;
                                    var $3706 = self.expr;
                                    var $3707 = self.body;
                                    var $3708 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3708;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3709 = self.done;
                                    var $3710 = self.term;
                                    var $3711 = self.type;
                                    var $3712 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3712;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3713 = self.name;
                                    var $3714 = self.dref;
                                    var $3715 = self.verb;
                                    var $3716 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3716;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3717 = self.path;
                                    var $3718 = Fm$Term$equal$patch$($3717, _a$1, Bool$true);
                                    var $3678 = $3718;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3719 = self.natx;
                                    var $3720 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3720;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3721 = self.chrx;
                                    var $3722 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3722;
                                    break;
                                case 'Fm.Term.str':
                                    var $3723 = self.strx;
                                    var $3724 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3724;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3725 = self.path;
                                    var $3726 = self.expr;
                                    var $3727 = self.name;
                                    var $3728 = self.with;
                                    var $3729 = self.cses;
                                    var $3730 = self.moti;
                                    var $3731 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3731;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3732 = self.orig;
                                    var $3733 = self.expr;
                                    var $3734 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3678 = $3734;
                                    break;
                            };
                            var $3510 = $3678;
                            break;
                        case 'Fm.Term.lam':
                            var $3735 = self.name;
                            var $3736 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3738 = self.name;
                                    var $3739 = self.indx;
                                    var $3740 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3740;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3741 = self.name;
                                    var $3742 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3742;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3743 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3743;
                                    break;
                                case 'Fm.Term.all':
                                    var $3744 = self.eras;
                                    var $3745 = self.self;
                                    var $3746 = self.name;
                                    var $3747 = self.xtyp;
                                    var $3748 = self.body;
                                    var $3749 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3749;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3750 = self.name;
                                    var $3751 = self.body;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$18 = $3736(Fm$Term$var$($3735, _lv$4));
                                    var _b1_body$19 = $3751(Fm$Term$var$($3750, _lv$4));
                                    var $3752 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17))((_eq_body$20 => {
                                        var $3753 = Monad$pure$(Fm$Check$monad)(_eq_body$20);
                                        return $3753;
                                    }));
                                    var $3737 = $3752;
                                    break;
                                case 'Fm.Term.app':
                                    var $3754 = self.func;
                                    var $3755 = self.argm;
                                    var $3756 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3756;
                                    break;
                                case 'Fm.Term.let':
                                    var $3757 = self.name;
                                    var $3758 = self.expr;
                                    var $3759 = self.body;
                                    var $3760 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3760;
                                    break;
                                case 'Fm.Term.def':
                                    var $3761 = self.name;
                                    var $3762 = self.expr;
                                    var $3763 = self.body;
                                    var $3764 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3764;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3765 = self.done;
                                    var $3766 = self.term;
                                    var $3767 = self.type;
                                    var $3768 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3768;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3769 = self.name;
                                    var $3770 = self.dref;
                                    var $3771 = self.verb;
                                    var $3772 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3772;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3773 = self.path;
                                    var $3774 = Fm$Term$equal$patch$($3773, _a$1, Bool$true);
                                    var $3737 = $3774;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3775 = self.natx;
                                    var $3776 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3776;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3777 = self.chrx;
                                    var $3778 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3778;
                                    break;
                                case 'Fm.Term.str':
                                    var $3779 = self.strx;
                                    var $3780 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3780;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3781 = self.path;
                                    var $3782 = self.expr;
                                    var $3783 = self.name;
                                    var $3784 = self.with;
                                    var $3785 = self.cses;
                                    var $3786 = self.moti;
                                    var $3787 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3787;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3788 = self.orig;
                                    var $3789 = self.expr;
                                    var $3790 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3737 = $3790;
                                    break;
                            };
                            var $3510 = $3737;
                            break;
                        case 'Fm.Term.app':
                            var $3791 = self.func;
                            var $3792 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3794 = self.name;
                                    var $3795 = self.indx;
                                    var $3796 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3796;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3797 = self.name;
                                    var $3798 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3798;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3799 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3799;
                                    break;
                                case 'Fm.Term.all':
                                    var $3800 = self.eras;
                                    var $3801 = self.self;
                                    var $3802 = self.name;
                                    var $3803 = self.xtyp;
                                    var $3804 = self.body;
                                    var $3805 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3805;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3806 = self.name;
                                    var $3807 = self.body;
                                    var $3808 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3808;
                                    break;
                                case 'Fm.Term.app':
                                    var $3809 = self.func;
                                    var $3810 = self.argm;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var $3811 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3791, $3809, _defs$3, _lv$4, _seen$17))((_eq_func$18 => {
                                        var $3812 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3792, $3810, _defs$3, _lv$4, _seen$17))((_eq_argm$19 => {
                                            var $3813 = Monad$pure$(Fm$Check$monad)((_eq_func$18 && _eq_argm$19));
                                            return $3813;
                                        }));
                                        return $3812;
                                    }));
                                    var $3793 = $3811;
                                    break;
                                case 'Fm.Term.let':
                                    var $3814 = self.name;
                                    var $3815 = self.expr;
                                    var $3816 = self.body;
                                    var $3817 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3817;
                                    break;
                                case 'Fm.Term.def':
                                    var $3818 = self.name;
                                    var $3819 = self.expr;
                                    var $3820 = self.body;
                                    var $3821 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3821;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3822 = self.done;
                                    var $3823 = self.term;
                                    var $3824 = self.type;
                                    var $3825 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3825;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3826 = self.name;
                                    var $3827 = self.dref;
                                    var $3828 = self.verb;
                                    var $3829 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3829;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3830 = self.path;
                                    var $3831 = Fm$Term$equal$patch$($3830, _a$1, Bool$true);
                                    var $3793 = $3831;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3832 = self.natx;
                                    var $3833 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3833;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3834 = self.chrx;
                                    var $3835 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3835;
                                    break;
                                case 'Fm.Term.str':
                                    var $3836 = self.strx;
                                    var $3837 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3837;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3838 = self.path;
                                    var $3839 = self.expr;
                                    var $3840 = self.name;
                                    var $3841 = self.with;
                                    var $3842 = self.cses;
                                    var $3843 = self.moti;
                                    var $3844 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3844;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3845 = self.orig;
                                    var $3846 = self.expr;
                                    var $3847 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3793 = $3847;
                                    break;
                            };
                            var $3510 = $3793;
                            break;
                        case 'Fm.Term.let':
                            var $3848 = self.name;
                            var $3849 = self.expr;
                            var $3850 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3852 = self.name;
                                    var $3853 = self.indx;
                                    var $3854 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3854;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3855 = self.name;
                                    var $3856 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3856;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3857 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3857;
                                    break;
                                case 'Fm.Term.all':
                                    var $3858 = self.eras;
                                    var $3859 = self.self;
                                    var $3860 = self.name;
                                    var $3861 = self.xtyp;
                                    var $3862 = self.body;
                                    var $3863 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3863;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3864 = self.name;
                                    var $3865 = self.body;
                                    var $3866 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3866;
                                    break;
                                case 'Fm.Term.app':
                                    var $3867 = self.func;
                                    var $3868 = self.argm;
                                    var $3869 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3869;
                                    break;
                                case 'Fm.Term.let':
                                    var $3870 = self.name;
                                    var $3871 = self.expr;
                                    var $3872 = self.body;
                                    var _seen$19 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$20 = $3850(Fm$Term$var$($3848, _lv$4));
                                    var _b1_body$21 = $3872(Fm$Term$var$($3870, _lv$4));
                                    var $3873 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3849, $3871, _defs$3, _lv$4, _seen$19))((_eq_expr$22 => {
                                        var $3874 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19))((_eq_body$23 => {
                                            var $3875 = Monad$pure$(Fm$Check$monad)((_eq_expr$22 && _eq_body$23));
                                            return $3875;
                                        }));
                                        return $3874;
                                    }));
                                    var $3851 = $3873;
                                    break;
                                case 'Fm.Term.def':
                                    var $3876 = self.name;
                                    var $3877 = self.expr;
                                    var $3878 = self.body;
                                    var $3879 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3879;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3880 = self.done;
                                    var $3881 = self.term;
                                    var $3882 = self.type;
                                    var $3883 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3883;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3884 = self.name;
                                    var $3885 = self.dref;
                                    var $3886 = self.verb;
                                    var $3887 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3887;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3888 = self.path;
                                    var $3889 = Fm$Term$equal$patch$($3888, _a$1, Bool$true);
                                    var $3851 = $3889;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3890 = self.natx;
                                    var $3891 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3891;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3892 = self.chrx;
                                    var $3893 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3893;
                                    break;
                                case 'Fm.Term.str':
                                    var $3894 = self.strx;
                                    var $3895 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3895;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3896 = self.path;
                                    var $3897 = self.expr;
                                    var $3898 = self.name;
                                    var $3899 = self.with;
                                    var $3900 = self.cses;
                                    var $3901 = self.moti;
                                    var $3902 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3902;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3903 = self.orig;
                                    var $3904 = self.expr;
                                    var $3905 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3851 = $3905;
                                    break;
                            };
                            var $3510 = $3851;
                            break;
                        case 'Fm.Term.def':
                            var $3906 = self.name;
                            var $3907 = self.expr;
                            var $3908 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3910 = self.name;
                                    var $3911 = self.indx;
                                    var $3912 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3912;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3913 = self.name;
                                    var $3914 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3914;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3915 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3915;
                                    break;
                                case 'Fm.Term.all':
                                    var $3916 = self.eras;
                                    var $3917 = self.self;
                                    var $3918 = self.name;
                                    var $3919 = self.xtyp;
                                    var $3920 = self.body;
                                    var $3921 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3921;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3922 = self.name;
                                    var $3923 = self.body;
                                    var $3924 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3924;
                                    break;
                                case 'Fm.Term.app':
                                    var $3925 = self.func;
                                    var $3926 = self.argm;
                                    var $3927 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3927;
                                    break;
                                case 'Fm.Term.let':
                                    var $3928 = self.name;
                                    var $3929 = self.expr;
                                    var $3930 = self.body;
                                    var $3931 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3931;
                                    break;
                                case 'Fm.Term.def':
                                    var $3932 = self.name;
                                    var $3933 = self.expr;
                                    var $3934 = self.body;
                                    var $3935 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3935;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3936 = self.done;
                                    var $3937 = self.term;
                                    var $3938 = self.type;
                                    var $3939 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3939;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3940 = self.name;
                                    var $3941 = self.dref;
                                    var $3942 = self.verb;
                                    var $3943 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3943;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3944 = self.path;
                                    var $3945 = Fm$Term$equal$patch$($3944, _a$1, Bool$true);
                                    var $3909 = $3945;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3946 = self.natx;
                                    var $3947 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3947;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3948 = self.chrx;
                                    var $3949 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3949;
                                    break;
                                case 'Fm.Term.str':
                                    var $3950 = self.strx;
                                    var $3951 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3951;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3952 = self.path;
                                    var $3953 = self.expr;
                                    var $3954 = self.name;
                                    var $3955 = self.with;
                                    var $3956 = self.cses;
                                    var $3957 = self.moti;
                                    var $3958 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3958;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3959 = self.orig;
                                    var $3960 = self.expr;
                                    var $3961 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3909 = $3961;
                                    break;
                            };
                            var $3510 = $3909;
                            break;
                        case 'Fm.Term.ann':
                            var $3962 = self.done;
                            var $3963 = self.term;
                            var $3964 = self.type;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3966 = self.name;
                                    var $3967 = self.indx;
                                    var $3968 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3968;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3969 = self.name;
                                    var $3970 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3970;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3971 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3971;
                                    break;
                                case 'Fm.Term.all':
                                    var $3972 = self.eras;
                                    var $3973 = self.self;
                                    var $3974 = self.name;
                                    var $3975 = self.xtyp;
                                    var $3976 = self.body;
                                    var $3977 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3977;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3978 = self.name;
                                    var $3979 = self.body;
                                    var $3980 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3980;
                                    break;
                                case 'Fm.Term.app':
                                    var $3981 = self.func;
                                    var $3982 = self.argm;
                                    var $3983 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3983;
                                    break;
                                case 'Fm.Term.let':
                                    var $3984 = self.name;
                                    var $3985 = self.expr;
                                    var $3986 = self.body;
                                    var $3987 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3987;
                                    break;
                                case 'Fm.Term.def':
                                    var $3988 = self.name;
                                    var $3989 = self.expr;
                                    var $3990 = self.body;
                                    var $3991 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3991;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3992 = self.done;
                                    var $3993 = self.term;
                                    var $3994 = self.type;
                                    var $3995 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3995;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3996 = self.name;
                                    var $3997 = self.dref;
                                    var $3998 = self.verb;
                                    var $3999 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $3999;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4000 = self.path;
                                    var $4001 = Fm$Term$equal$patch$($4000, _a$1, Bool$true);
                                    var $3965 = $4001;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4002 = self.natx;
                                    var $4003 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $4003;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4004 = self.chrx;
                                    var $4005 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $4005;
                                    break;
                                case 'Fm.Term.str':
                                    var $4006 = self.strx;
                                    var $4007 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $4007;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4008 = self.path;
                                    var $4009 = self.expr;
                                    var $4010 = self.name;
                                    var $4011 = self.with;
                                    var $4012 = self.cses;
                                    var $4013 = self.moti;
                                    var $4014 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $4014;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4015 = self.orig;
                                    var $4016 = self.expr;
                                    var $4017 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3965 = $4017;
                                    break;
                            };
                            var $3510 = $3965;
                            break;
                        case 'Fm.Term.gol':
                            var $4018 = self.name;
                            var $4019 = self.dref;
                            var $4020 = self.verb;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4022 = self.name;
                                    var $4023 = self.indx;
                                    var $4024 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4024;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4025 = self.name;
                                    var $4026 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4026;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4027 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4027;
                                    break;
                                case 'Fm.Term.all':
                                    var $4028 = self.eras;
                                    var $4029 = self.self;
                                    var $4030 = self.name;
                                    var $4031 = self.xtyp;
                                    var $4032 = self.body;
                                    var $4033 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4033;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4034 = self.name;
                                    var $4035 = self.body;
                                    var $4036 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4036;
                                    break;
                                case 'Fm.Term.app':
                                    var $4037 = self.func;
                                    var $4038 = self.argm;
                                    var $4039 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4039;
                                    break;
                                case 'Fm.Term.let':
                                    var $4040 = self.name;
                                    var $4041 = self.expr;
                                    var $4042 = self.body;
                                    var $4043 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4043;
                                    break;
                                case 'Fm.Term.def':
                                    var $4044 = self.name;
                                    var $4045 = self.expr;
                                    var $4046 = self.body;
                                    var $4047 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4047;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4048 = self.done;
                                    var $4049 = self.term;
                                    var $4050 = self.type;
                                    var $4051 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4051;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4052 = self.name;
                                    var $4053 = self.dref;
                                    var $4054 = self.verb;
                                    var $4055 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4055;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4056 = self.path;
                                    var $4057 = Fm$Term$equal$patch$($4056, _a$1, Bool$true);
                                    var $4021 = $4057;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4058 = self.natx;
                                    var $4059 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4059;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4060 = self.chrx;
                                    var $4061 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4061;
                                    break;
                                case 'Fm.Term.str':
                                    var $4062 = self.strx;
                                    var $4063 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4063;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4064 = self.path;
                                    var $4065 = self.expr;
                                    var $4066 = self.name;
                                    var $4067 = self.with;
                                    var $4068 = self.cses;
                                    var $4069 = self.moti;
                                    var $4070 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4070;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4071 = self.orig;
                                    var $4072 = self.expr;
                                    var $4073 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4021 = $4073;
                                    break;
                            };
                            var $3510 = $4021;
                            break;
                        case 'Fm.Term.hol':
                            var $4074 = self.path;
                            var $4075 = Fm$Term$equal$patch$($4074, _b$2, Bool$true);
                            var $3510 = $4075;
                            break;
                        case 'Fm.Term.nat':
                            var $4076 = self.natx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4078 = self.name;
                                    var $4079 = self.indx;
                                    var $4080 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4080;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4081 = self.name;
                                    var $4082 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4082;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4083 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4083;
                                    break;
                                case 'Fm.Term.all':
                                    var $4084 = self.eras;
                                    var $4085 = self.self;
                                    var $4086 = self.name;
                                    var $4087 = self.xtyp;
                                    var $4088 = self.body;
                                    var $4089 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4089;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4090 = self.name;
                                    var $4091 = self.body;
                                    var $4092 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4092;
                                    break;
                                case 'Fm.Term.app':
                                    var $4093 = self.func;
                                    var $4094 = self.argm;
                                    var $4095 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4095;
                                    break;
                                case 'Fm.Term.let':
                                    var $4096 = self.name;
                                    var $4097 = self.expr;
                                    var $4098 = self.body;
                                    var $4099 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4099;
                                    break;
                                case 'Fm.Term.def':
                                    var $4100 = self.name;
                                    var $4101 = self.expr;
                                    var $4102 = self.body;
                                    var $4103 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4103;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4104 = self.done;
                                    var $4105 = self.term;
                                    var $4106 = self.type;
                                    var $4107 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4107;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4108 = self.name;
                                    var $4109 = self.dref;
                                    var $4110 = self.verb;
                                    var $4111 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4111;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4112 = self.path;
                                    var $4113 = Fm$Term$equal$patch$($4112, _a$1, Bool$true);
                                    var $4077 = $4113;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4114 = self.natx;
                                    var $4115 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4115;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4116 = self.chrx;
                                    var $4117 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4117;
                                    break;
                                case 'Fm.Term.str':
                                    var $4118 = self.strx;
                                    var $4119 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4119;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4120 = self.path;
                                    var $4121 = self.expr;
                                    var $4122 = self.name;
                                    var $4123 = self.with;
                                    var $4124 = self.cses;
                                    var $4125 = self.moti;
                                    var $4126 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4126;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4127 = self.orig;
                                    var $4128 = self.expr;
                                    var $4129 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4077 = $4129;
                                    break;
                            };
                            var $3510 = $4077;
                            break;
                        case 'Fm.Term.chr':
                            var $4130 = self.chrx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4132 = self.name;
                                    var $4133 = self.indx;
                                    var $4134 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4134;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4135 = self.name;
                                    var $4136 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4136;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4137 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4137;
                                    break;
                                case 'Fm.Term.all':
                                    var $4138 = self.eras;
                                    var $4139 = self.self;
                                    var $4140 = self.name;
                                    var $4141 = self.xtyp;
                                    var $4142 = self.body;
                                    var $4143 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4143;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4144 = self.name;
                                    var $4145 = self.body;
                                    var $4146 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4146;
                                    break;
                                case 'Fm.Term.app':
                                    var $4147 = self.func;
                                    var $4148 = self.argm;
                                    var $4149 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4149;
                                    break;
                                case 'Fm.Term.let':
                                    var $4150 = self.name;
                                    var $4151 = self.expr;
                                    var $4152 = self.body;
                                    var $4153 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4153;
                                    break;
                                case 'Fm.Term.def':
                                    var $4154 = self.name;
                                    var $4155 = self.expr;
                                    var $4156 = self.body;
                                    var $4157 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4157;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4158 = self.done;
                                    var $4159 = self.term;
                                    var $4160 = self.type;
                                    var $4161 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4161;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4162 = self.name;
                                    var $4163 = self.dref;
                                    var $4164 = self.verb;
                                    var $4165 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4165;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4166 = self.path;
                                    var $4167 = Fm$Term$equal$patch$($4166, _a$1, Bool$true);
                                    var $4131 = $4167;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4168 = self.natx;
                                    var $4169 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4169;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4170 = self.chrx;
                                    var $4171 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4171;
                                    break;
                                case 'Fm.Term.str':
                                    var $4172 = self.strx;
                                    var $4173 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4173;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4174 = self.path;
                                    var $4175 = self.expr;
                                    var $4176 = self.name;
                                    var $4177 = self.with;
                                    var $4178 = self.cses;
                                    var $4179 = self.moti;
                                    var $4180 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4180;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4181 = self.orig;
                                    var $4182 = self.expr;
                                    var $4183 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4131 = $4183;
                                    break;
                            };
                            var $3510 = $4131;
                            break;
                        case 'Fm.Term.str':
                            var $4184 = self.strx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4186 = self.name;
                                    var $4187 = self.indx;
                                    var $4188 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4188;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4189 = self.name;
                                    var $4190 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4190;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4191 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4191;
                                    break;
                                case 'Fm.Term.all':
                                    var $4192 = self.eras;
                                    var $4193 = self.self;
                                    var $4194 = self.name;
                                    var $4195 = self.xtyp;
                                    var $4196 = self.body;
                                    var $4197 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4197;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4198 = self.name;
                                    var $4199 = self.body;
                                    var $4200 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4200;
                                    break;
                                case 'Fm.Term.app':
                                    var $4201 = self.func;
                                    var $4202 = self.argm;
                                    var $4203 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4203;
                                    break;
                                case 'Fm.Term.let':
                                    var $4204 = self.name;
                                    var $4205 = self.expr;
                                    var $4206 = self.body;
                                    var $4207 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4207;
                                    break;
                                case 'Fm.Term.def':
                                    var $4208 = self.name;
                                    var $4209 = self.expr;
                                    var $4210 = self.body;
                                    var $4211 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4211;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4212 = self.done;
                                    var $4213 = self.term;
                                    var $4214 = self.type;
                                    var $4215 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4215;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4216 = self.name;
                                    var $4217 = self.dref;
                                    var $4218 = self.verb;
                                    var $4219 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4219;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4220 = self.path;
                                    var $4221 = Fm$Term$equal$patch$($4220, _a$1, Bool$true);
                                    var $4185 = $4221;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4222 = self.natx;
                                    var $4223 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4223;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4224 = self.chrx;
                                    var $4225 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4225;
                                    break;
                                case 'Fm.Term.str':
                                    var $4226 = self.strx;
                                    var $4227 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4227;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4228 = self.path;
                                    var $4229 = self.expr;
                                    var $4230 = self.name;
                                    var $4231 = self.with;
                                    var $4232 = self.cses;
                                    var $4233 = self.moti;
                                    var $4234 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4234;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4235 = self.orig;
                                    var $4236 = self.expr;
                                    var $4237 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4185 = $4237;
                                    break;
                            };
                            var $3510 = $4185;
                            break;
                        case 'Fm.Term.cse':
                            var $4238 = self.path;
                            var $4239 = self.expr;
                            var $4240 = self.name;
                            var $4241 = self.with;
                            var $4242 = self.cses;
                            var $4243 = self.moti;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4245 = self.name;
                                    var $4246 = self.indx;
                                    var $4247 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4247;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4248 = self.name;
                                    var $4249 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4249;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4250 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4250;
                                    break;
                                case 'Fm.Term.all':
                                    var $4251 = self.eras;
                                    var $4252 = self.self;
                                    var $4253 = self.name;
                                    var $4254 = self.xtyp;
                                    var $4255 = self.body;
                                    var $4256 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4256;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4257 = self.name;
                                    var $4258 = self.body;
                                    var $4259 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4259;
                                    break;
                                case 'Fm.Term.app':
                                    var $4260 = self.func;
                                    var $4261 = self.argm;
                                    var $4262 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4262;
                                    break;
                                case 'Fm.Term.let':
                                    var $4263 = self.name;
                                    var $4264 = self.expr;
                                    var $4265 = self.body;
                                    var $4266 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4266;
                                    break;
                                case 'Fm.Term.def':
                                    var $4267 = self.name;
                                    var $4268 = self.expr;
                                    var $4269 = self.body;
                                    var $4270 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4270;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4271 = self.done;
                                    var $4272 = self.term;
                                    var $4273 = self.type;
                                    var $4274 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4274;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4275 = self.name;
                                    var $4276 = self.dref;
                                    var $4277 = self.verb;
                                    var $4278 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4278;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4279 = self.path;
                                    var $4280 = Fm$Term$equal$patch$($4279, _a$1, Bool$true);
                                    var $4244 = $4280;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4281 = self.natx;
                                    var $4282 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4282;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4283 = self.chrx;
                                    var $4284 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4284;
                                    break;
                                case 'Fm.Term.str':
                                    var $4285 = self.strx;
                                    var $4286 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4286;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4287 = self.path;
                                    var $4288 = self.expr;
                                    var $4289 = self.name;
                                    var $4290 = self.with;
                                    var $4291 = self.cses;
                                    var $4292 = self.moti;
                                    var $4293 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4293;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4294 = self.orig;
                                    var $4295 = self.expr;
                                    var $4296 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4244 = $4296;
                                    break;
                            };
                            var $3510 = $4244;
                            break;
                        case 'Fm.Term.ori':
                            var $4297 = self.orig;
                            var $4298 = self.expr;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4300 = self.name;
                                    var $4301 = self.indx;
                                    var $4302 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4302;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4303 = self.name;
                                    var $4304 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4304;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4305 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4305;
                                    break;
                                case 'Fm.Term.all':
                                    var $4306 = self.eras;
                                    var $4307 = self.self;
                                    var $4308 = self.name;
                                    var $4309 = self.xtyp;
                                    var $4310 = self.body;
                                    var $4311 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4311;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4312 = self.name;
                                    var $4313 = self.body;
                                    var $4314 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4314;
                                    break;
                                case 'Fm.Term.app':
                                    var $4315 = self.func;
                                    var $4316 = self.argm;
                                    var $4317 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4317;
                                    break;
                                case 'Fm.Term.let':
                                    var $4318 = self.name;
                                    var $4319 = self.expr;
                                    var $4320 = self.body;
                                    var $4321 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4321;
                                    break;
                                case 'Fm.Term.def':
                                    var $4322 = self.name;
                                    var $4323 = self.expr;
                                    var $4324 = self.body;
                                    var $4325 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4325;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4326 = self.done;
                                    var $4327 = self.term;
                                    var $4328 = self.type;
                                    var $4329 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4329;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4330 = self.name;
                                    var $4331 = self.dref;
                                    var $4332 = self.verb;
                                    var $4333 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4333;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4334 = self.path;
                                    var $4335 = Fm$Term$equal$patch$($4334, _a$1, Bool$true);
                                    var $4299 = $4335;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4336 = self.natx;
                                    var $4337 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4337;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4338 = self.chrx;
                                    var $4339 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4339;
                                    break;
                                case 'Fm.Term.str':
                                    var $4340 = self.strx;
                                    var $4341 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4341;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4342 = self.path;
                                    var $4343 = self.expr;
                                    var $4344 = self.name;
                                    var $4345 = self.with;
                                    var $4346 = self.cses;
                                    var $4347 = self.moti;
                                    var $4348 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4348;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4349 = self.orig;
                                    var $4350 = self.expr;
                                    var $4351 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4299 = $4351;
                                    break;
                            };
                            var $3510 = $4299;
                            break;
                    };
                    var $3507 = $3510;
                };
                var $3505 = $3507;
            };
            var $3503 = $3505;
        };
        return $3503;
    };
    const Fm$Term$equal = x0 => x1 => x2 => x3 => x4 => Fm$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;

    function Fm$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var $4352 = Monad$bind$(Fm$Check$monad)((() => {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $4353 = self.name;
                    var $4354 = self.indx;
                    var self = List$at_last$($4354, _ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4356 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4353), List$nil));
                            var $4355 = $4356;
                            break;
                        case 'Maybe.some':
                            var $4357 = self.value;
                            var $4358 = Monad$pure$(Fm$Check$monad)((() => {
                                var self = $4357;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4359 = self.fst;
                                        var $4360 = self.snd;
                                        var $4361 = $4360;
                                        return $4361;
                                };
                            })());
                            var $4355 = $4358;
                            break;
                    };
                    return $4355;
                case 'Fm.Term.ref':
                    var $4362 = self.name;
                    var self = Fm$get$($4362, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4364 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4362), List$nil));
                            var $4363 = $4364;
                            break;
                        case 'Maybe.some':
                            var $4365 = self.value;
                            var self = $4365;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $4367 = self.file;
                                    var $4368 = self.code;
                                    var $4369 = self.name;
                                    var $4370 = self.term;
                                    var $4371 = self.type;
                                    var $4372 = self.stat;
                                    var _ref_name$15 = $4369;
                                    var _ref_type$16 = $4371;
                                    var _ref_term$17 = $4370;
                                    var _ref_stat$18 = $4372;
                                    var self = _ref_stat$18;
                                    switch (self._) {
                                        case 'Fm.Status.init':
                                            var $4374 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$waiting$(_ref_name$15), List$nil));
                                            var $4373 = $4374;
                                            break;
                                        case 'Fm.Status.wait':
                                            var $4375 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4373 = $4375;
                                            break;
                                        case 'Fm.Status.done':
                                            var $4376 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4373 = $4376;
                                            break;
                                        case 'Fm.Status.fail':
                                            var $4377 = self.errors;
                                            var $4378 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$indirect$(_ref_name$15), List$nil));
                                            var $4373 = $4378;
                                            break;
                                    };
                                    var $4366 = $4373;
                                    break;
                            };
                            var $4363 = $4366;
                            break;
                    };
                    return $4363;
                case 'Fm.Term.typ':
                    var $4379 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                    return $4379;
                case 'Fm.Term.all':
                    var $4380 = self.eras;
                    var $4381 = self.self;
                    var $4382 = self.name;
                    var $4383 = self.xtyp;
                    var $4384 = self.body;
                    var _ctx_size$12 = List$length$(_ctx$4);
                    var _self_var$13 = Fm$Term$var$($4381, _ctx_size$12);
                    var _body_var$14 = Fm$Term$var$($4382, Nat$succ$(_ctx_size$12));
                    var _body_ctx$15 = List$cons$(Pair$new$($4382, $4383), List$cons$(Pair$new$($4381, _term$1), _ctx$4));
                    var $4385 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4383, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$16 => {
                        var $4386 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4384(_self_var$13)(_body_var$14), Maybe$some$(Fm$Term$typ), _defs$3, _body_ctx$15, Fm$MPath$i$(_path$5), _orig$6))((_$17 => {
                            var $4387 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                            return $4387;
                        }));
                        return $4386;
                    }));
                    return $4385;
                case 'Fm.Term.lam':
                    var $4388 = self.name;
                    var $4389 = self.body;
                    var self = _type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4391 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                            var $4390 = $4391;
                            break;
                        case 'Maybe.some':
                            var $4392 = self.value;
                            var _typv$10 = Fm$Term$reduce$($4392, _defs$3);
                            var self = _typv$10;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4394 = self.name;
                                    var $4395 = self.indx;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4392);
                                    var $4396 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4393 = $4396;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4397 = self.name;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4392);
                                    var $4398 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4393 = $4398;
                                    break;
                                case 'Fm.Term.typ':
                                    var _expected$11 = Either$left$("Function");
                                    var _detected$12 = Either$right$($4392);
                                    var $4399 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                    var $4393 = $4399;
                                    break;
                                case 'Fm.Term.all':
                                    var $4400 = self.eras;
                                    var $4401 = self.self;
                                    var $4402 = self.name;
                                    var $4403 = self.xtyp;
                                    var $4404 = self.body;
                                    var _ctx_size$16 = List$length$(_ctx$4);
                                    var _self_var$17 = _term$1;
                                    var _body_var$18 = Fm$Term$var$($4388, _ctx_size$16);
                                    var _body_typ$19 = $4404(_self_var$17)(_body_var$18);
                                    var _body_ctx$20 = List$cons$(Pair$new$($4388, $4403), _ctx$4);
                                    var $4405 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4389(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Fm$MPath$o$(_path$5), _orig$6))((_$21 => {
                                        var $4406 = Monad$pure$(Fm$Check$monad)($4392);
                                        return $4406;
                                    }));
                                    var $4393 = $4405;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4407 = self.name;
                                    var $4408 = self.body;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4392);
                                    var $4409 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4393 = $4409;
                                    break;
                                case 'Fm.Term.app':
                                    var $4410 = self.func;
                                    var $4411 = self.argm;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4392);
                                    var $4412 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4393 = $4412;
                                    break;
                                case 'Fm.Term.let':
                                    var $4413 = self.name;
                                    var $4414 = self.expr;
                                    var $4415 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4392);
                                    var $4416 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4393 = $4416;
                                    break;
                                case 'Fm.Term.def':
                                    var $4417 = self.name;
                                    var $4418 = self.expr;
                                    var $4419 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4392);
                                    var $4420 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4393 = $4420;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4421 = self.done;
                                    var $4422 = self.term;
                                    var $4423 = self.type;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4392);
                                    var $4424 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4393 = $4424;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4425 = self.name;
                                    var $4426 = self.dref;
                                    var $4427 = self.verb;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4392);
                                    var $4428 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4393 = $4428;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4429 = self.path;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4392);
                                    var $4430 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4393 = $4430;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4431 = self.natx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4392);
                                    var $4432 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4393 = $4432;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4433 = self.chrx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4392);
                                    var $4434 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4393 = $4434;
                                    break;
                                case 'Fm.Term.str':
                                    var $4435 = self.strx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4392);
                                    var $4436 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4393 = $4436;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4437 = self.path;
                                    var $4438 = self.expr;
                                    var $4439 = self.name;
                                    var $4440 = self.with;
                                    var $4441 = self.cses;
                                    var $4442 = self.moti;
                                    var _expected$17 = Either$left$("Function");
                                    var _detected$18 = Either$right$($4392);
                                    var $4443 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                    var $4393 = $4443;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4444 = self.orig;
                                    var $4445 = self.expr;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4392);
                                    var $4446 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4393 = $4446;
                                    break;
                            };
                            var $4390 = $4393;
                            break;
                    };
                    return $4390;
                case 'Fm.Term.app':
                    var $4447 = self.func;
                    var $4448 = self.argm;
                    var $4449 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4447, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_func_typ$9 => {
                        var _func_typ$10 = Fm$Term$reduce$(_func_typ$9, _defs$3);
                        var self = _func_typ$10;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $4451 = self.name;
                                var $4452 = self.indx;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4453 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4450 = $4453;
                                break;
                            case 'Fm.Term.ref':
                                var $4454 = self.name;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4455 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4450 = $4455;
                                break;
                            case 'Fm.Term.typ':
                                var _expected$11 = Either$left$("Function");
                                var _detected$12 = Either$right$(_func_typ$10);
                                var $4456 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4450 = $4456;
                                break;
                            case 'Fm.Term.all':
                                var $4457 = self.eras;
                                var $4458 = self.self;
                                var $4459 = self.name;
                                var $4460 = self.xtyp;
                                var $4461 = self.body;
                                var $4462 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4448, Maybe$some$($4460), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$16 => {
                                    var $4463 = Monad$pure$(Fm$Check$monad)($4461($4447)($4448));
                                    return $4463;
                                }));
                                var $4450 = $4462;
                                break;
                            case 'Fm.Term.lam':
                                var $4464 = self.name;
                                var $4465 = self.body;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4466 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4450 = $4466;
                                break;
                            case 'Fm.Term.app':
                                var $4467 = self.func;
                                var $4468 = self.argm;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4469 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4450 = $4469;
                                break;
                            case 'Fm.Term.let':
                                var $4470 = self.name;
                                var $4471 = self.expr;
                                var $4472 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4473 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4450 = $4473;
                                break;
                            case 'Fm.Term.def':
                                var $4474 = self.name;
                                var $4475 = self.expr;
                                var $4476 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4477 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4450 = $4477;
                                break;
                            case 'Fm.Term.ann':
                                var $4478 = self.done;
                                var $4479 = self.term;
                                var $4480 = self.type;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4481 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4450 = $4481;
                                break;
                            case 'Fm.Term.gol':
                                var $4482 = self.name;
                                var $4483 = self.dref;
                                var $4484 = self.verb;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4485 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4450 = $4485;
                                break;
                            case 'Fm.Term.hol':
                                var $4486 = self.path;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4487 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4450 = $4487;
                                break;
                            case 'Fm.Term.nat':
                                var $4488 = self.natx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4489 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4450 = $4489;
                                break;
                            case 'Fm.Term.chr':
                                var $4490 = self.chrx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4491 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4450 = $4491;
                                break;
                            case 'Fm.Term.str':
                                var $4492 = self.strx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4493 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4450 = $4493;
                                break;
                            case 'Fm.Term.cse':
                                var $4494 = self.path;
                                var $4495 = self.expr;
                                var $4496 = self.name;
                                var $4497 = self.with;
                                var $4498 = self.cses;
                                var $4499 = self.moti;
                                var _expected$17 = Either$left$("Function");
                                var _detected$18 = Either$right$(_func_typ$10);
                                var $4500 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4450 = $4500;
                                break;
                            case 'Fm.Term.ori':
                                var $4501 = self.orig;
                                var $4502 = self.expr;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4503 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4450 = $4503;
                                break;
                        };
                        return $4450;
                    }));
                    return $4449;
                case 'Fm.Term.let':
                    var $4504 = self.name;
                    var $4505 = self.expr;
                    var $4506 = self.body;
                    var _ctx_size$10 = List$length$(_ctx$4);
                    var $4507 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4505, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_expr_typ$11 => {
                        var _body_val$12 = $4506(Fm$Term$var$($4504, _ctx_size$10));
                        var _body_ctx$13 = List$cons$(Pair$new$($4504, _expr_typ$11), _ctx$4);
                        var $4508 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_body_val$12, _type$2, _defs$3, _body_ctx$13, Fm$MPath$i$(_path$5), _orig$6))((_body_typ$14 => {
                            var $4509 = Monad$pure$(Fm$Check$monad)(_body_typ$14);
                            return $4509;
                        }));
                        return $4508;
                    }));
                    return $4507;
                case 'Fm.Term.def':
                    var $4510 = self.name;
                    var $4511 = self.expr;
                    var $4512 = self.body;
                    var $4513 = Fm$Term$check$($4512($4511), _type$2, _defs$3, _ctx$4, _path$5, _orig$6);
                    return $4513;
                case 'Fm.Term.ann':
                    var $4514 = self.done;
                    var $4515 = self.term;
                    var $4516 = self.type;
                    var self = $4514;
                    if (self) {
                        var $4518 = Monad$pure$(Fm$Check$monad)($4516);
                        var $4517 = $4518;
                    } else {
                        var $4519 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4515, Maybe$some$($4516), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$10 => {
                            var $4520 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4516, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$11 => {
                                var $4521 = Monad$pure$(Fm$Check$monad)($4516);
                                return $4521;
                            }));
                            return $4520;
                        }));
                        var $4517 = $4519;
                    };
                    return $4517;
                case 'Fm.Term.gol':
                    var $4522 = self.name;
                    var $4523 = self.dref;
                    var $4524 = self.verb;
                    var $4525 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$show_goal$($4522, $4523, $4524, _type$2, _ctx$4), List$nil));
                    return $4525;
                case 'Fm.Term.hol':
                    var $4526 = self.path;
                    var $4527 = Fm$Check$result$(_type$2, List$nil);
                    return $4527;
                case 'Fm.Term.nat':
                    var $4528 = self.natx;
                    var $4529 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Nat"));
                    return $4529;
                case 'Fm.Term.chr':
                    var $4530 = self.chrx;
                    var $4531 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Char"));
                    return $4531;
                case 'Fm.Term.str':
                    var $4532 = self.strx;
                    var $4533 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("String"));
                    return $4533;
                case 'Fm.Term.cse':
                    var $4534 = self.path;
                    var $4535 = self.expr;
                    var $4536 = self.name;
                    var $4537 = self.with;
                    var $4538 = self.cses;
                    var $4539 = self.moti;
                    var _expr$13 = $4535;
                    var $4540 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_etyp$14 => {
                        var self = $4539;
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _type$2;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4543 = Fm$Term$hol$(Bits$e);
                                        var _moti$15 = $4543;
                                        break;
                                    case 'Maybe.some':
                                        var $4544 = self.value;
                                        var _size$16 = List$length$(_ctx$4);
                                        var _typv$17 = Fm$Term$normalize$($4544, Map$new);
                                        var _moti$18 = Fm$SmartMotive$make$($4536, $4535, _etyp$14, _typv$17, _size$16, _defs$3);
                                        var $4545 = _moti$18;
                                        var _moti$15 = $4545;
                                        break;
                                };
                                var $4542 = Maybe$some$(Fm$Term$cse$($4534, $4535, $4536, $4537, $4538, Maybe$some$(_moti$15)));
                                var _dsug$15 = $4542;
                                break;
                            case 'Maybe.some':
                                var $4546 = self.value;
                                var $4547 = Fm$Term$desugar_cse$($4535, $4536, $4537, $4538, $4546, _etyp$14, _defs$3, _ctx$4);
                                var _dsug$15 = $4547;
                                break;
                        };
                        var self = _dsug$15;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4548 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                var $4541 = $4548;
                                break;
                            case 'Maybe.some':
                                var $4549 = self.value;
                                var $4550 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$patch$(Fm$MPath$to_bits$(_path$5), $4549), List$nil));
                                var $4541 = $4550;
                                break;
                        };
                        return $4541;
                    }));
                    return $4540;
                case 'Fm.Term.ori':
                    var $4551 = self.orig;
                    var $4552 = self.expr;
                    var $4553 = Fm$Term$check$($4552, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($4551));
                    return $4553;
            };
        })())((_infr$7 => {
            var self = _type$2;
            switch (self._) {
                case 'Maybe.none':
                    var $4555 = Fm$Check$result$(Maybe$some$(_infr$7), List$nil);
                    var $4554 = $4555;
                    break;
                case 'Maybe.some':
                    var $4556 = self.value;
                    var $4557 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($4556, _infr$7, _defs$3, List$length$(_ctx$4), Set$new))((_eqls$9 => {
                        var self = _eqls$9;
                        if (self) {
                            var $4559 = Monad$pure$(Fm$Check$monad)($4556);
                            var $4558 = $4559;
                        } else {
                            var $4560 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, Either$right$($4556), Either$right$(_infr$7), _ctx$4), List$nil));
                            var $4558 = $4560;
                        };
                        return $4558;
                    }));
                    var $4554 = $4557;
                    break;
            };
            return $4554;
        }));
        return $4352;
    };
    const Fm$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Term$check$(x0, x1, x2, x3, x4, x5);

    function Fm$Path$nil$(_x$1) {
        var $4561 = _x$1;
        return $4561;
    };
    const Fm$Path$nil = x0 => Fm$Path$nil$(x0);
    const Fm$MPath$nil = Maybe$some$(Fm$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $4563 = Bool$true;
                var $4562 = $4563;
                break;
            case 'List.cons':
                var $4564 = self.head;
                var $4565 = self.tail;
                var $4566 = Bool$false;
                var $4562 = $4566;
                break;
        };
        return $4562;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Fm$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Fm.Term.var':
                var $4568 = self.name;
                var $4569 = self.indx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4571 = _fn$3(_term$2);
                        var $4570 = $4571;
                        break;
                    case 'o':
                        var $4572 = self.slice(0, -1);
                        var $4573 = _term$2;
                        var $4570 = $4573;
                        break;
                    case 'i':
                        var $4574 = self.slice(0, -1);
                        var $4575 = _term$2;
                        var $4570 = $4575;
                        break;
                };
                var $4567 = $4570;
                break;
            case 'Fm.Term.ref':
                var $4576 = self.name;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4578 = _fn$3(_term$2);
                        var $4577 = $4578;
                        break;
                    case 'o':
                        var $4579 = self.slice(0, -1);
                        var $4580 = _term$2;
                        var $4577 = $4580;
                        break;
                    case 'i':
                        var $4581 = self.slice(0, -1);
                        var $4582 = _term$2;
                        var $4577 = $4582;
                        break;
                };
                var $4567 = $4577;
                break;
            case 'Fm.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4584 = _fn$3(_term$2);
                        var $4583 = $4584;
                        break;
                    case 'o':
                        var $4585 = self.slice(0, -1);
                        var $4586 = _term$2;
                        var $4583 = $4586;
                        break;
                    case 'i':
                        var $4587 = self.slice(0, -1);
                        var $4588 = _term$2;
                        var $4583 = $4588;
                        break;
                };
                var $4567 = $4583;
                break;
            case 'Fm.Term.all':
                var $4589 = self.eras;
                var $4590 = self.self;
                var $4591 = self.name;
                var $4592 = self.xtyp;
                var $4593 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4595 = _fn$3(_term$2);
                        var $4594 = $4595;
                        break;
                    case 'o':
                        var $4596 = self.slice(0, -1);
                        var $4597 = Fm$Term$all$($4589, $4590, $4591, Fm$Term$patch_at$($4596, $4592, _fn$3), $4593);
                        var $4594 = $4597;
                        break;
                    case 'i':
                        var $4598 = self.slice(0, -1);
                        var $4599 = Fm$Term$all$($4589, $4590, $4591, $4592, (_s$10 => _x$11 => {
                            var $4600 = Fm$Term$patch_at$($4598, $4593(_s$10)(_x$11), _fn$3);
                            return $4600;
                        }));
                        var $4594 = $4599;
                        break;
                };
                var $4567 = $4594;
                break;
            case 'Fm.Term.lam':
                var $4601 = self.name;
                var $4602 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4604 = _fn$3(_term$2);
                        var $4603 = $4604;
                        break;
                    case 'o':
                        var $4605 = self.slice(0, -1);
                        var $4606 = Fm$Term$lam$($4601, (_x$7 => {
                            var $4607 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4602(_x$7), _fn$3);
                            return $4607;
                        }));
                        var $4603 = $4606;
                        break;
                    case 'i':
                        var $4608 = self.slice(0, -1);
                        var $4609 = Fm$Term$lam$($4601, (_x$7 => {
                            var $4610 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4602(_x$7), _fn$3);
                            return $4610;
                        }));
                        var $4603 = $4609;
                        break;
                };
                var $4567 = $4603;
                break;
            case 'Fm.Term.app':
                var $4611 = self.func;
                var $4612 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4614 = _fn$3(_term$2);
                        var $4613 = $4614;
                        break;
                    case 'o':
                        var $4615 = self.slice(0, -1);
                        var $4616 = Fm$Term$app$(Fm$Term$patch_at$($4615, $4611, _fn$3), $4612);
                        var $4613 = $4616;
                        break;
                    case 'i':
                        var $4617 = self.slice(0, -1);
                        var $4618 = Fm$Term$app$($4611, Fm$Term$patch_at$($4617, $4612, _fn$3));
                        var $4613 = $4618;
                        break;
                };
                var $4567 = $4613;
                break;
            case 'Fm.Term.let':
                var $4619 = self.name;
                var $4620 = self.expr;
                var $4621 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4623 = _fn$3(_term$2);
                        var $4622 = $4623;
                        break;
                    case 'o':
                        var $4624 = self.slice(0, -1);
                        var $4625 = Fm$Term$let$($4619, Fm$Term$patch_at$($4624, $4620, _fn$3), $4621);
                        var $4622 = $4625;
                        break;
                    case 'i':
                        var $4626 = self.slice(0, -1);
                        var $4627 = Fm$Term$let$($4619, $4620, (_x$8 => {
                            var $4628 = Fm$Term$patch_at$($4626, $4621(_x$8), _fn$3);
                            return $4628;
                        }));
                        var $4622 = $4627;
                        break;
                };
                var $4567 = $4622;
                break;
            case 'Fm.Term.def':
                var $4629 = self.name;
                var $4630 = self.expr;
                var $4631 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4633 = _fn$3(_term$2);
                        var $4632 = $4633;
                        break;
                    case 'o':
                        var $4634 = self.slice(0, -1);
                        var $4635 = Fm$Term$def$($4629, Fm$Term$patch_at$($4634, $4630, _fn$3), $4631);
                        var $4632 = $4635;
                        break;
                    case 'i':
                        var $4636 = self.slice(0, -1);
                        var $4637 = Fm$Term$def$($4629, $4630, (_x$8 => {
                            var $4638 = Fm$Term$patch_at$($4636, $4631(_x$8), _fn$3);
                            return $4638;
                        }));
                        var $4632 = $4637;
                        break;
                };
                var $4567 = $4632;
                break;
            case 'Fm.Term.ann':
                var $4639 = self.done;
                var $4640 = self.term;
                var $4641 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4643 = _fn$3(_term$2);
                        var $4642 = $4643;
                        break;
                    case 'o':
                        var $4644 = self.slice(0, -1);
                        var $4645 = Fm$Term$ann$($4639, Fm$Term$patch_at$($4644, $4640, _fn$3), $4641);
                        var $4642 = $4645;
                        break;
                    case 'i':
                        var $4646 = self.slice(0, -1);
                        var $4647 = Fm$Term$ann$($4639, $4640, Fm$Term$patch_at$($4646, $4641, _fn$3));
                        var $4642 = $4647;
                        break;
                };
                var $4567 = $4642;
                break;
            case 'Fm.Term.gol':
                var $4648 = self.name;
                var $4649 = self.dref;
                var $4650 = self.verb;
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
                var $4567 = $4651;
                break;
            case 'Fm.Term.hol':
                var $4657 = self.path;
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
                var $4567 = $4658;
                break;
            case 'Fm.Term.nat':
                var $4664 = self.natx;
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
                var $4567 = $4665;
                break;
            case 'Fm.Term.chr':
                var $4671 = self.chrx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4673 = _fn$3(_term$2);
                        var $4672 = $4673;
                        break;
                    case 'o':
                        var $4674 = self.slice(0, -1);
                        var $4675 = _term$2;
                        var $4672 = $4675;
                        break;
                    case 'i':
                        var $4676 = self.slice(0, -1);
                        var $4677 = _term$2;
                        var $4672 = $4677;
                        break;
                };
                var $4567 = $4672;
                break;
            case 'Fm.Term.str':
                var $4678 = self.strx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4680 = _fn$3(_term$2);
                        var $4679 = $4680;
                        break;
                    case 'o':
                        var $4681 = self.slice(0, -1);
                        var $4682 = _term$2;
                        var $4679 = $4682;
                        break;
                    case 'i':
                        var $4683 = self.slice(0, -1);
                        var $4684 = _term$2;
                        var $4679 = $4684;
                        break;
                };
                var $4567 = $4679;
                break;
            case 'Fm.Term.cse':
                var $4685 = self.path;
                var $4686 = self.expr;
                var $4687 = self.name;
                var $4688 = self.with;
                var $4689 = self.cses;
                var $4690 = self.moti;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4692 = _fn$3(_term$2);
                        var $4691 = $4692;
                        break;
                    case 'o':
                        var $4693 = self.slice(0, -1);
                        var $4694 = _term$2;
                        var $4691 = $4694;
                        break;
                    case 'i':
                        var $4695 = self.slice(0, -1);
                        var $4696 = _term$2;
                        var $4691 = $4696;
                        break;
                };
                var $4567 = $4691;
                break;
            case 'Fm.Term.ori':
                var $4697 = self.orig;
                var $4698 = self.expr;
                var $4699 = Fm$Term$patch_at$(_path$1, $4698, _fn$3);
                var $4567 = $4699;
                break;
        };
        return $4567;
    };
    const Fm$Term$patch_at = x0 => x1 => x2 => Fm$Term$patch_at$(x0, x1, x2);

    function Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, _errs$7, _fixd$8) {
        var self = _errs$7;
        switch (self._) {
            case 'List.nil':
                var self = _fixd$8;
                if (self) {
                    var _type$9 = Fm$Term$bind$(List$nil, (_x$9 => {
                        var $4703 = (_x$9 + '1');
                        return $4703;
                    }), _type$5);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $4704 = (_x$10 + '0');
                        return $4704;
                    }), _term$4);
                    var _defs$11 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$10, _type$9, Fm$Status$init), _defs$6);
                    var $4702 = Monad$pure$(IO$monad)(Maybe$some$(_defs$11));
                    var $4701 = $4702;
                } else {
                    var $4705 = Monad$pure$(IO$monad)(Maybe$none);
                    var $4701 = $4705;
                };
                var $4700 = $4701;
                break;
            case 'List.cons':
                var $4706 = self.head;
                var $4707 = self.tail;
                var self = $4706;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $4709 = self.origin;
                        var $4710 = self.expected;
                        var $4711 = self.detected;
                        var $4712 = self.context;
                        var $4713 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4707, _fixd$8);
                        var $4708 = $4713;
                        break;
                    case 'Fm.Error.show_goal':
                        var $4714 = self.name;
                        var $4715 = self.dref;
                        var $4716 = self.verb;
                        var $4717 = self.goal;
                        var $4718 = self.context;
                        var $4719 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4707, _fixd$8);
                        var $4708 = $4719;
                        break;
                    case 'Fm.Error.waiting':
                        var $4720 = self.name;
                        var $4721 = Monad$bind$(IO$monad)(Fm$Synth$one$($4720, _defs$6))((_defs$12 => {
                            var $4722 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$12, $4707, Bool$true);
                            return $4722;
                        }));
                        var $4708 = $4721;
                        break;
                    case 'Fm.Error.indirect':
                        var $4723 = self.name;
                        var $4724 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4707, _fixd$8);
                        var $4708 = $4724;
                        break;
                    case 'Fm.Error.patch':
                        var $4725 = self.path;
                        var $4726 = self.term;
                        var self = $4725;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'e':
                                var $4728 = Monad$pure$(IO$monad)(Maybe$none);
                                var $4727 = $4728;
                                break;
                            case 'o':
                                var $4729 = self.slice(0, -1);
                                var _term$14 = Fm$Term$patch_at$($4729, _term$4, (_x$14 => {
                                    var $4731 = $4726;
                                    return $4731;
                                }));
                                var $4730 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$14, _type$5, _defs$6, $4707, Bool$true);
                                var $4727 = $4730;
                                break;
                            case 'i':
                                var $4732 = self.slice(0, -1);
                                var _type$14 = Fm$Term$patch_at$($4732, _type$5, (_x$14 => {
                                    var $4734 = $4726;
                                    return $4734;
                                }));
                                var $4733 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$14, _defs$6, $4707, Bool$true);
                                var $4727 = $4733;
                                break;
                        };
                        var $4708 = $4727;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $4735 = self.origin;
                        var $4736 = self.name;
                        var $4737 = Monad$bind$(IO$monad)(Fm$Synth$one$($4736, _defs$6))((_defs$13 => {
                            var $4738 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$13, $4707, Bool$true);
                            return $4738;
                        }));
                        var $4708 = $4737;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $4739 = self.origin;
                        var $4740 = self.term;
                        var $4741 = self.context;
                        var $4742 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4707, _fixd$8);
                        var $4708 = $4742;
                        break;
                };
                var $4700 = $4708;
                break;
        };
        return $4700;
    };
    const Fm$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Status$fail$(_errors$1) {
        var $4743 = ({
            _: 'Fm.Status.fail',
            'errors': _errors$1
        });
        return $4743;
    };
    const Fm$Status$fail = x0 => Fm$Status$fail$(x0);

    function Fm$Synth$one$(_name$1, _defs$2) {
        var self = Fm$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.none':
                var $4745 = Monad$bind$(IO$monad)(Fm$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4747 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("Undefined: ", List$cons$(_name$1, List$nil)))))((_$4 => {
                                var $4748 = Monad$pure$(IO$monad)(_defs$2);
                                return $4748;
                            }));
                            var $4746 = $4747;
                            break;
                        case 'Maybe.some':
                            var $4749 = self.value;
                            var $4750 = Fm$Synth$one$(_name$1, $4749);
                            var $4746 = $4750;
                            break;
                    };
                    return $4746;
                }));
                var $4744 = $4745;
                break;
            case 'Maybe.some':
                var $4751 = self.value;
                var self = $4751;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4753 = self.file;
                        var $4754 = self.code;
                        var $4755 = self.name;
                        var $4756 = self.term;
                        var $4757 = self.type;
                        var $4758 = self.stat;
                        var _file$10 = $4753;
                        var _code$11 = $4754;
                        var _name$12 = $4755;
                        var _term$13 = $4756;
                        var _type$14 = $4757;
                        var _stat$15 = $4758;
                        var self = _stat$15;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var _defs$16 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, Fm$Status$wait), _defs$2);
                                var _checked$17 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_type$14, Maybe$some$(Fm$Term$typ), _defs$16, List$nil, Fm$MPath$i$(Fm$MPath$nil), Maybe$none))((_chk_type$17 => {
                                    var $4761 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_term$13, Maybe$some$(_type$14), _defs$16, List$nil, Fm$MPath$o$(Fm$MPath$nil), Maybe$none))((_chk_term$18 => {
                                        var $4762 = Monad$pure$(Fm$Check$monad)(Unit$new);
                                        return $4762;
                                    }));
                                    return $4761;
                                }));
                                var self = _checked$17;
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $4763 = self.value;
                                        var $4764 = self.errors;
                                        var self = List$is_empty$($4764);
                                        if (self) {
                                            var _defs$20 = Fm$define$(_file$10, _code$11, _name$12, _term$13, _type$14, Bool$true, _defs$16);
                                            var $4766 = Monad$pure$(IO$monad)(_defs$20);
                                            var $4765 = $4766;
                                        } else {
                                            var $4767 = Monad$bind$(IO$monad)(Fm$Synth$fix$(_file$10, _code$11, _name$12, _term$13, _type$14, _defs$16, $4764, Bool$false))((_fixed$20 => {
                                                var self = _fixed$20;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var _stat$21 = Fm$Status$fail$($4764);
                                                        var _defs$22 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, _stat$21), _defs$16);
                                                        var $4769 = Monad$pure$(IO$monad)(_defs$22);
                                                        var $4768 = $4769;
                                                        break;
                                                    case 'Maybe.some':
                                                        var $4770 = self.value;
                                                        var $4771 = Fm$Synth$one$(_name$12, $4770);
                                                        var $4768 = $4771;
                                                        break;
                                                };
                                                return $4768;
                                            }));
                                            var $4765 = $4767;
                                        };
                                        var $4760 = $4765;
                                        break;
                                };
                                var $4759 = $4760;
                                break;
                            case 'Fm.Status.wait':
                                var $4772 = Monad$pure$(IO$monad)(_defs$2);
                                var $4759 = $4772;
                                break;
                            case 'Fm.Status.done':
                                var $4773 = Monad$pure$(IO$monad)(_defs$2);
                                var $4759 = $4773;
                                break;
                            case 'Fm.Status.fail':
                                var $4774 = self.errors;
                                var $4775 = Monad$pure$(IO$monad)(_defs$2);
                                var $4759 = $4775;
                                break;
                        };
                        var $4752 = $4759;
                        break;
                };
                var $4744 = $4752;
                break;
        };
        return $4744;
    };
    const Fm$Synth$one = x0 => x1 => Fm$Synth$one$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $4777 = _list$3;
                var $4776 = $4777;
                break;
            case 'Map.tie':
                var $4778 = self.val;
                var $4779 = self.lft;
                var $4780 = self.rgt;
                var self = $4778;
                switch (self._) {
                    case 'Maybe.none':
                        var $4782 = _list$3;
                        var _list0$7 = $4782;
                        break;
                    case 'Maybe.some':
                        var $4783 = self.value;
                        var $4784 = List$cons$($4783, _list$3);
                        var _list0$7 = $4784;
                        break;
                };
                var _list1$8 = Map$values$go$($4779, _list0$7);
                var _list2$9 = Map$values$go$($4780, _list1$8);
                var $4781 = _list2$9;
                var $4776 = $4781;
                break;
        };
        return $4776;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $4785 = Map$values$go$(_xs$2, List$nil);
        return $4785;
    };
    const Map$values = x0 => Map$values$(x0);

    function Fm$Name$show$(_name$1) {
        var $4786 = _name$1;
        return $4786;
    };
    const Fm$Name$show = x0 => Fm$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $4788 = 0n;
                var $4787 = $4788;
                break;
            case 'o':
                var $4789 = self.slice(0, -1);
                var $4790 = (2n * Bits$to_nat$($4789));
                var $4787 = $4790;
                break;
            case 'i':
                var $4791 = self.slice(0, -1);
                var $4792 = Nat$succ$((2n * Bits$to_nat$($4791)));
                var $4787 = $4792;
                break;
        };
        return $4787;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $4794 = u16_to_word(self);
                var $4795 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($4794)));
                var $4793 = $4795;
                break;
        };
        return $4793;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Fm$escape$char$(_chr$1) {
        var self = (_chr$1 === Fm$backslash);
        if (self) {
            var $4797 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
            var $4796 = $4797;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $4799 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                var $4798 = $4799;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $4801 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                    var $4800 = $4801;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $4803 = String$cons$(_chr$1, String$nil);
                        var $4802 = $4803;
                    } else {
                        var $4804 = String$flatten$(List$cons$(String$cons$(Fm$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $4802 = $4804;
                    };
                    var $4800 = $4802;
                };
                var $4798 = $4800;
            };
            var $4796 = $4798;
        };
        return $4796;
    };
    const Fm$escape$char = x0 => Fm$escape$char$(x0);

    function Fm$escape$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4806 = String$nil;
            var $4805 = $4806;
        } else {
            var $4807 = self.charCodeAt(0);
            var $4808 = self.slice(1);
            var _head$4 = Fm$escape$char$($4807);
            var _tail$5 = Fm$escape$($4808);
            var $4809 = (_head$4 + _tail$5);
            var $4805 = $4809;
        };
        return $4805;
    };
    const Fm$escape = x0 => Fm$escape$(x0);

    function Fm$Term$core$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4811 = self.name;
                var $4812 = self.indx;
                var $4813 = Fm$Name$show$($4811);
                var $4810 = $4813;
                break;
            case 'Fm.Term.ref':
                var $4814 = self.name;
                var $4815 = Fm$Name$show$($4814);
                var $4810 = $4815;
                break;
            case 'Fm.Term.typ':
                var $4816 = "*";
                var $4810 = $4816;
                break;
            case 'Fm.Term.all':
                var $4817 = self.eras;
                var $4818 = self.self;
                var $4819 = self.name;
                var $4820 = self.xtyp;
                var $4821 = self.body;
                var _eras$7 = $4817;
                var self = _eras$7;
                if (self) {
                    var $4823 = "%";
                    var _init$8 = $4823;
                } else {
                    var $4824 = "@";
                    var _init$8 = $4824;
                };
                var _self$9 = Fm$Name$show$($4818);
                var _name$10 = Fm$Name$show$($4819);
                var _xtyp$11 = Fm$Term$core$($4820);
                var _body$12 = Fm$Term$core$($4821(Fm$Term$var$($4818, 0n))(Fm$Term$var$($4819, 0n)));
                var $4822 = String$flatten$(List$cons$(_init$8, List$cons$(_self$9, List$cons$("(", List$cons$(_name$10, List$cons$(":", List$cons$(_xtyp$11, List$cons$(") ", List$cons$(_body$12, List$nil)))))))));
                var $4810 = $4822;
                break;
            case 'Fm.Term.lam':
                var $4825 = self.name;
                var $4826 = self.body;
                var _name$4 = Fm$Name$show$($4825);
                var _body$5 = Fm$Term$core$($4826(Fm$Term$var$($4825, 0n)));
                var $4827 = String$flatten$(List$cons$("#", List$cons$(_name$4, List$cons$(" ", List$cons$(_body$5, List$nil)))));
                var $4810 = $4827;
                break;
            case 'Fm.Term.app':
                var $4828 = self.func;
                var $4829 = self.argm;
                var _func$4 = Fm$Term$core$($4828);
                var _argm$5 = Fm$Term$core$($4829);
                var $4830 = String$flatten$(List$cons$("(", List$cons$(_func$4, List$cons$(" ", List$cons$(_argm$5, List$cons$(")", List$nil))))));
                var $4810 = $4830;
                break;
            case 'Fm.Term.let':
                var $4831 = self.name;
                var $4832 = self.expr;
                var $4833 = self.body;
                var _name$5 = Fm$Name$show$($4831);
                var _expr$6 = Fm$Term$core$($4832);
                var _body$7 = Fm$Term$core$($4833(Fm$Term$var$($4831, 0n)));
                var $4834 = String$flatten$(List$cons$("!", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4810 = $4834;
                break;
            case 'Fm.Term.def':
                var $4835 = self.name;
                var $4836 = self.expr;
                var $4837 = self.body;
                var _name$5 = Fm$Name$show$($4835);
                var _expr$6 = Fm$Term$core$($4836);
                var _body$7 = Fm$Term$core$($4837(Fm$Term$var$($4835, 0n)));
                var $4838 = String$flatten$(List$cons$("$", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4810 = $4838;
                break;
            case 'Fm.Term.ann':
                var $4839 = self.done;
                var $4840 = self.term;
                var $4841 = self.type;
                var _term$5 = Fm$Term$core$($4840);
                var _type$6 = Fm$Term$core$($4841);
                var $4842 = String$flatten$(List$cons$("{", List$cons$(_term$5, List$cons$(":", List$cons$(_type$6, List$cons$("}", List$nil))))));
                var $4810 = $4842;
                break;
            case 'Fm.Term.gol':
                var $4843 = self.name;
                var $4844 = self.dref;
                var $4845 = self.verb;
                var $4846 = "<GOL>";
                var $4810 = $4846;
                break;
            case 'Fm.Term.hol':
                var $4847 = self.path;
                var $4848 = "<HOL>";
                var $4810 = $4848;
                break;
            case 'Fm.Term.nat':
                var $4849 = self.natx;
                var $4850 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($4849), List$nil)));
                var $4810 = $4850;
                break;
            case 'Fm.Term.chr':
                var $4851 = self.chrx;
                var $4852 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($4851), List$cons$("\'", List$nil))));
                var $4810 = $4852;
                break;
            case 'Fm.Term.str':
                var $4853 = self.strx;
                var $4854 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($4853), List$cons$("\"", List$nil))));
                var $4810 = $4854;
                break;
            case 'Fm.Term.cse':
                var $4855 = self.path;
                var $4856 = self.expr;
                var $4857 = self.name;
                var $4858 = self.with;
                var $4859 = self.cses;
                var $4860 = self.moti;
                var $4861 = "<CSE>";
                var $4810 = $4861;
                break;
            case 'Fm.Term.ori':
                var $4862 = self.orig;
                var $4863 = self.expr;
                var $4864 = Fm$Term$core$($4863);
                var $4810 = $4864;
                break;
        };
        return $4810;
    };
    const Fm$Term$core = x0 => Fm$Term$core$(x0);

    function Fm$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $4867 = _result$2;
            var $4868 = Map$values$(_defs$1);
            let _result$4 = $4867;
            let _defn$3;
            while ($4868._ === 'List.cons') {
                _defn$3 = $4868.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4869 = self.file;
                        var $4870 = self.code;
                        var $4871 = self.name;
                        var $4872 = self.term;
                        var $4873 = self.type;
                        var $4874 = self.stat;
                        var self = $4874;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var $4876 = _result$4;
                                var $4875 = $4876;
                                break;
                            case 'Fm.Status.wait':
                                var $4877 = _result$4;
                                var $4875 = $4877;
                                break;
                            case 'Fm.Status.done':
                                var _name$11 = $4871;
                                var _term$12 = Fm$Term$core$($4872);
                                var _type$13 = Fm$Term$core$($4873);
                                var $4878 = String$flatten$(List$cons$(_result$4, List$cons$(_name$11, List$cons$(" : ", List$cons$(_type$13, List$cons$(" = ", List$cons$(_term$12, List$cons$(";\u{a}", List$nil))))))));
                                var $4875 = $4878;
                                break;
                            case 'Fm.Status.fail':
                                var $4879 = self.errors;
                                var $4880 = _result$4;
                                var $4875 = $4880;
                                break;
                        };
                        var $4867 = $4875;
                        break;
                };
                _result$4 = $4867;
                $4868 = $4868.tail;
            }
            return _result$4;
        })();
        var $4865 = _result$3;
        return $4865;
    };
    const Fm$Defs$core = x0 => Fm$Defs$core$(x0);

    function Fm$to_core$io$one$(_name$1) {
        var $4881 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $4882 = Monad$pure$(IO$monad)(Fm$Defs$core$(_defs$2));
            return $4882;
        }));
        return $4881;
    };
    const Fm$to_core$io$one = x0 => Fm$to_core$io$one$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $4884 = Maybe$none;
                var $4883 = $4884;
                break;
            case 'Maybe.some':
                var $4885 = self.value;
                var $4886 = _f$4($4885);
                var $4883 = $4886;
                break;
        };
        return $4883;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);
    const Maybe$monad = Monad$new$(Maybe$bind, Maybe$some);

    function Fm$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4888 = self.name;
                var $4889 = self.indx;
                var $4890 = Maybe$none;
                var $4887 = $4890;
                break;
            case 'Fm.Term.ref':
                var $4891 = self.name;
                var self = ($4891 === "Nat.zero");
                if (self) {
                    var $4893 = Maybe$some$(0n);
                    var $4892 = $4893;
                } else {
                    var $4894 = Maybe$none;
                    var $4892 = $4894;
                };
                var $4887 = $4892;
                break;
            case 'Fm.Term.typ':
                var $4895 = Maybe$none;
                var $4887 = $4895;
                break;
            case 'Fm.Term.all':
                var $4896 = self.eras;
                var $4897 = self.self;
                var $4898 = self.name;
                var $4899 = self.xtyp;
                var $4900 = self.body;
                var $4901 = Maybe$none;
                var $4887 = $4901;
                break;
            case 'Fm.Term.lam':
                var $4902 = self.name;
                var $4903 = self.body;
                var $4904 = Maybe$none;
                var $4887 = $4904;
                break;
            case 'Fm.Term.app':
                var $4905 = self.func;
                var $4906 = self.argm;
                var self = $4905;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $4908 = self.name;
                        var $4909 = self.indx;
                        var $4910 = Maybe$none;
                        var $4907 = $4910;
                        break;
                    case 'Fm.Term.ref':
                        var $4911 = self.name;
                        var self = ($4911 === "Nat.succ");
                        if (self) {
                            var $4913 = Monad$bind$(Maybe$monad)(Fm$Term$show$as_nat$go$($4906))((_pred$5 => {
                                var $4914 = Monad$pure$(Maybe$monad)(Nat$succ$(_pred$5));
                                return $4914;
                            }));
                            var $4912 = $4913;
                        } else {
                            var $4915 = Maybe$none;
                            var $4912 = $4915;
                        };
                        var $4907 = $4912;
                        break;
                    case 'Fm.Term.typ':
                        var $4916 = Maybe$none;
                        var $4907 = $4916;
                        break;
                    case 'Fm.Term.all':
                        var $4917 = self.eras;
                        var $4918 = self.self;
                        var $4919 = self.name;
                        var $4920 = self.xtyp;
                        var $4921 = self.body;
                        var $4922 = Maybe$none;
                        var $4907 = $4922;
                        break;
                    case 'Fm.Term.lam':
                        var $4923 = self.name;
                        var $4924 = self.body;
                        var $4925 = Maybe$none;
                        var $4907 = $4925;
                        break;
                    case 'Fm.Term.app':
                        var $4926 = self.func;
                        var $4927 = self.argm;
                        var $4928 = Maybe$none;
                        var $4907 = $4928;
                        break;
                    case 'Fm.Term.let':
                        var $4929 = self.name;
                        var $4930 = self.expr;
                        var $4931 = self.body;
                        var $4932 = Maybe$none;
                        var $4907 = $4932;
                        break;
                    case 'Fm.Term.def':
                        var $4933 = self.name;
                        var $4934 = self.expr;
                        var $4935 = self.body;
                        var $4936 = Maybe$none;
                        var $4907 = $4936;
                        break;
                    case 'Fm.Term.ann':
                        var $4937 = self.done;
                        var $4938 = self.term;
                        var $4939 = self.type;
                        var $4940 = Maybe$none;
                        var $4907 = $4940;
                        break;
                    case 'Fm.Term.gol':
                        var $4941 = self.name;
                        var $4942 = self.dref;
                        var $4943 = self.verb;
                        var $4944 = Maybe$none;
                        var $4907 = $4944;
                        break;
                    case 'Fm.Term.hol':
                        var $4945 = self.path;
                        var $4946 = Maybe$none;
                        var $4907 = $4946;
                        break;
                    case 'Fm.Term.nat':
                        var $4947 = self.natx;
                        var $4948 = Maybe$none;
                        var $4907 = $4948;
                        break;
                    case 'Fm.Term.chr':
                        var $4949 = self.chrx;
                        var $4950 = Maybe$none;
                        var $4907 = $4950;
                        break;
                    case 'Fm.Term.str':
                        var $4951 = self.strx;
                        var $4952 = Maybe$none;
                        var $4907 = $4952;
                        break;
                    case 'Fm.Term.cse':
                        var $4953 = self.path;
                        var $4954 = self.expr;
                        var $4955 = self.name;
                        var $4956 = self.with;
                        var $4957 = self.cses;
                        var $4958 = self.moti;
                        var $4959 = Maybe$none;
                        var $4907 = $4959;
                        break;
                    case 'Fm.Term.ori':
                        var $4960 = self.orig;
                        var $4961 = self.expr;
                        var $4962 = Maybe$none;
                        var $4907 = $4962;
                        break;
                };
                var $4887 = $4907;
                break;
            case 'Fm.Term.let':
                var $4963 = self.name;
                var $4964 = self.expr;
                var $4965 = self.body;
                var $4966 = Maybe$none;
                var $4887 = $4966;
                break;
            case 'Fm.Term.def':
                var $4967 = self.name;
                var $4968 = self.expr;
                var $4969 = self.body;
                var $4970 = Maybe$none;
                var $4887 = $4970;
                break;
            case 'Fm.Term.ann':
                var $4971 = self.done;
                var $4972 = self.term;
                var $4973 = self.type;
                var $4974 = Maybe$none;
                var $4887 = $4974;
                break;
            case 'Fm.Term.gol':
                var $4975 = self.name;
                var $4976 = self.dref;
                var $4977 = self.verb;
                var $4978 = Maybe$none;
                var $4887 = $4978;
                break;
            case 'Fm.Term.hol':
                var $4979 = self.path;
                var $4980 = Maybe$none;
                var $4887 = $4980;
                break;
            case 'Fm.Term.nat':
                var $4981 = self.natx;
                var $4982 = Maybe$none;
                var $4887 = $4982;
                break;
            case 'Fm.Term.chr':
                var $4983 = self.chrx;
                var $4984 = Maybe$none;
                var $4887 = $4984;
                break;
            case 'Fm.Term.str':
                var $4985 = self.strx;
                var $4986 = Maybe$none;
                var $4887 = $4986;
                break;
            case 'Fm.Term.cse':
                var $4987 = self.path;
                var $4988 = self.expr;
                var $4989 = self.name;
                var $4990 = self.with;
                var $4991 = self.cses;
                var $4992 = self.moti;
                var $4993 = Maybe$none;
                var $4887 = $4993;
                break;
            case 'Fm.Term.ori':
                var $4994 = self.orig;
                var $4995 = self.expr;
                var $4996 = Maybe$none;
                var $4887 = $4996;
                break;
        };
        return $4887;
    };
    const Fm$Term$show$as_nat$go = x0 => Fm$Term$show$as_nat$go$(x0);

    function Fm$Term$show$as_nat$(_term$1) {
        var $4997 = Maybe$mapped$(Fm$Term$show$as_nat$go$(_term$1), Nat$show);
        return $4997;
    };
    const Fm$Term$show$as_nat = x0 => Fm$Term$show$as_nat$(x0);

    function Fm$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4999 = self.name;
                var $5000 = self.indx;
                var $5001 = Bool$false;
                var $4998 = $5001;
                break;
            case 'Fm.Term.ref':
                var $5002 = self.name;
                var $5003 = (_name$2 === $5002);
                var $4998 = $5003;
                break;
            case 'Fm.Term.typ':
                var $5004 = Bool$false;
                var $4998 = $5004;
                break;
            case 'Fm.Term.all':
                var $5005 = self.eras;
                var $5006 = self.self;
                var $5007 = self.name;
                var $5008 = self.xtyp;
                var $5009 = self.body;
                var $5010 = Bool$false;
                var $4998 = $5010;
                break;
            case 'Fm.Term.lam':
                var $5011 = self.name;
                var $5012 = self.body;
                var $5013 = Bool$false;
                var $4998 = $5013;
                break;
            case 'Fm.Term.app':
                var $5014 = self.func;
                var $5015 = self.argm;
                var $5016 = Bool$false;
                var $4998 = $5016;
                break;
            case 'Fm.Term.let':
                var $5017 = self.name;
                var $5018 = self.expr;
                var $5019 = self.body;
                var $5020 = Bool$false;
                var $4998 = $5020;
                break;
            case 'Fm.Term.def':
                var $5021 = self.name;
                var $5022 = self.expr;
                var $5023 = self.body;
                var $5024 = Bool$false;
                var $4998 = $5024;
                break;
            case 'Fm.Term.ann':
                var $5025 = self.done;
                var $5026 = self.term;
                var $5027 = self.type;
                var $5028 = Bool$false;
                var $4998 = $5028;
                break;
            case 'Fm.Term.gol':
                var $5029 = self.name;
                var $5030 = self.dref;
                var $5031 = self.verb;
                var $5032 = Bool$false;
                var $4998 = $5032;
                break;
            case 'Fm.Term.hol':
                var $5033 = self.path;
                var $5034 = Bool$false;
                var $4998 = $5034;
                break;
            case 'Fm.Term.nat':
                var $5035 = self.natx;
                var $5036 = Bool$false;
                var $4998 = $5036;
                break;
            case 'Fm.Term.chr':
                var $5037 = self.chrx;
                var $5038 = Bool$false;
                var $4998 = $5038;
                break;
            case 'Fm.Term.str':
                var $5039 = self.strx;
                var $5040 = Bool$false;
                var $4998 = $5040;
                break;
            case 'Fm.Term.cse':
                var $5041 = self.path;
                var $5042 = self.expr;
                var $5043 = self.name;
                var $5044 = self.with;
                var $5045 = self.cses;
                var $5046 = self.moti;
                var $5047 = Bool$false;
                var $4998 = $5047;
                break;
            case 'Fm.Term.ori':
                var $5048 = self.orig;
                var $5049 = self.expr;
                var $5050 = Bool$false;
                var $4998 = $5050;
                break;
        };
        return $4998;
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
                        var $5051 = self.name;
                        var $5052 = self.indx;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5054 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5053 = $5054;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5056 = Bool$false;
                                var _wrap$8 = $5056;
                            } else {
                                var $5057 = self.charCodeAt(0);
                                var $5058 = self.slice(1);
                                var $5059 = ($5057 === 40);
                                var _wrap$8 = $5059;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5060 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5060;
                            } else {
                                var $5061 = _func$7;
                                var _func$10 = $5061;
                            };
                            var $5055 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5053 = $5055;
                        };
                        return $5053;
                    case 'Fm.Term.ref':
                        var $5062 = self.name;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5064 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5063 = $5064;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5066 = Bool$false;
                                var _wrap$7 = $5066;
                            } else {
                                var $5067 = self.charCodeAt(0);
                                var $5068 = self.slice(1);
                                var $5069 = ($5067 === 40);
                                var _wrap$7 = $5069;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5070 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5070;
                            } else {
                                var $5071 = _func$6;
                                var _func$9 = $5071;
                            };
                            var $5065 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5063 = $5065;
                        };
                        return $5063;
                    case 'Fm.Term.typ':
                        var _arity$4 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
                        if (self) {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5073 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
                            var $5072 = $5073;
                        } else {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$5;
                            if (self.length === 0) {
                                var $5075 = Bool$false;
                                var _wrap$6 = $5075;
                            } else {
                                var $5076 = self.charCodeAt(0);
                                var $5077 = self.slice(1);
                                var $5078 = ($5076 === 40);
                                var _wrap$6 = $5078;
                            };
                            var _args$7 = String$join$(",", _args$3);
                            var self = _wrap$6;
                            if (self) {
                                var $5079 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                                var _func$8 = $5079;
                            } else {
                                var $5080 = _func$5;
                                var _func$8 = $5080;
                            };
                            var $5074 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
                            var $5072 = $5074;
                        };
                        return $5072;
                    case 'Fm.Term.all':
                        var $5081 = self.eras;
                        var $5082 = self.self;
                        var $5083 = self.name;
                        var $5084 = self.xtyp;
                        var $5085 = self.body;
                        var _arity$9 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$9 === 3n));
                        if (self) {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$11 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$12 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5087 = String$flatten$(List$cons$(_eq_lft$11, List$cons$(" == ", List$cons$(_eq_rgt$12, List$nil))));
                            var $5086 = $5087;
                        } else {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$10;
                            if (self.length === 0) {
                                var $5089 = Bool$false;
                                var _wrap$11 = $5089;
                            } else {
                                var $5090 = self.charCodeAt(0);
                                var $5091 = self.slice(1);
                                var $5092 = ($5090 === 40);
                                var _wrap$11 = $5092;
                            };
                            var _args$12 = String$join$(",", _args$3);
                            var self = _wrap$11;
                            if (self) {
                                var $5093 = String$flatten$(List$cons$("(", List$cons$(_func$10, List$cons$(")", List$nil))));
                                var _func$13 = $5093;
                            } else {
                                var $5094 = _func$10;
                                var _func$13 = $5094;
                            };
                            var $5088 = String$flatten$(List$cons$(_func$13, List$cons$("(", List$cons$(_args$12, List$cons$(")", List$nil)))));
                            var $5086 = $5088;
                        };
                        return $5086;
                    case 'Fm.Term.lam':
                        var $5095 = self.name;
                        var $5096 = self.body;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5098 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5097 = $5098;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5100 = Bool$false;
                                var _wrap$8 = $5100;
                            } else {
                                var $5101 = self.charCodeAt(0);
                                var $5102 = self.slice(1);
                                var $5103 = ($5101 === 40);
                                var _wrap$8 = $5103;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5104 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5104;
                            } else {
                                var $5105 = _func$7;
                                var _func$10 = $5105;
                            };
                            var $5099 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5097 = $5099;
                        };
                        return $5097;
                    case 'Fm.Term.app':
                        var $5106 = self.func;
                        var $5107 = self.argm;
                        var _argm$6 = Fm$Term$show$go$($5107, Fm$MPath$i$(_path$2));
                        var $5108 = Fm$Term$show$app$($5106, Fm$MPath$o$(_path$2), List$cons$(_argm$6, _args$3));
                        return $5108;
                    case 'Fm.Term.let':
                        var $5109 = self.name;
                        var $5110 = self.expr;
                        var $5111 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5113 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5112 = $5113;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5115 = Bool$false;
                                var _wrap$9 = $5115;
                            } else {
                                var $5116 = self.charCodeAt(0);
                                var $5117 = self.slice(1);
                                var $5118 = ($5116 === 40);
                                var _wrap$9 = $5118;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5119 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5119;
                            } else {
                                var $5120 = _func$8;
                                var _func$11 = $5120;
                            };
                            var $5114 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5112 = $5114;
                        };
                        return $5112;
                    case 'Fm.Term.def':
                        var $5121 = self.name;
                        var $5122 = self.expr;
                        var $5123 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5125 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5124 = $5125;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5127 = Bool$false;
                                var _wrap$9 = $5127;
                            } else {
                                var $5128 = self.charCodeAt(0);
                                var $5129 = self.slice(1);
                                var $5130 = ($5128 === 40);
                                var _wrap$9 = $5130;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5131 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5131;
                            } else {
                                var $5132 = _func$8;
                                var _func$11 = $5132;
                            };
                            var $5126 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5124 = $5126;
                        };
                        return $5124;
                    case 'Fm.Term.ann':
                        var $5133 = self.done;
                        var $5134 = self.term;
                        var $5135 = self.type;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5137 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5136 = $5137;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5139 = Bool$false;
                                var _wrap$9 = $5139;
                            } else {
                                var $5140 = self.charCodeAt(0);
                                var $5141 = self.slice(1);
                                var $5142 = ($5140 === 40);
                                var _wrap$9 = $5142;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5143 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5143;
                            } else {
                                var $5144 = _func$8;
                                var _func$11 = $5144;
                            };
                            var $5138 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5136 = $5138;
                        };
                        return $5136;
                    case 'Fm.Term.gol':
                        var $5145 = self.name;
                        var $5146 = self.dref;
                        var $5147 = self.verb;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5149 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5148 = $5149;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5151 = Bool$false;
                                var _wrap$9 = $5151;
                            } else {
                                var $5152 = self.charCodeAt(0);
                                var $5153 = self.slice(1);
                                var $5154 = ($5152 === 40);
                                var _wrap$9 = $5154;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5155 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5155;
                            } else {
                                var $5156 = _func$8;
                                var _func$11 = $5156;
                            };
                            var $5150 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5148 = $5150;
                        };
                        return $5148;
                    case 'Fm.Term.hol':
                        var $5157 = self.path;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5159 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5158 = $5159;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5161 = Bool$false;
                                var _wrap$7 = $5161;
                            } else {
                                var $5162 = self.charCodeAt(0);
                                var $5163 = self.slice(1);
                                var $5164 = ($5162 === 40);
                                var _wrap$7 = $5164;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5165 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5165;
                            } else {
                                var $5166 = _func$6;
                                var _func$9 = $5166;
                            };
                            var $5160 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5158 = $5160;
                        };
                        return $5158;
                    case 'Fm.Term.nat':
                        var $5167 = self.natx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5169 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5168 = $5169;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5171 = Bool$false;
                                var _wrap$7 = $5171;
                            } else {
                                var $5172 = self.charCodeAt(0);
                                var $5173 = self.slice(1);
                                var $5174 = ($5172 === 40);
                                var _wrap$7 = $5174;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5175 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5175;
                            } else {
                                var $5176 = _func$6;
                                var _func$9 = $5176;
                            };
                            var $5170 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5168 = $5170;
                        };
                        return $5168;
                    case 'Fm.Term.chr':
                        var $5177 = self.chrx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5179 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5178 = $5179;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5181 = Bool$false;
                                var _wrap$7 = $5181;
                            } else {
                                var $5182 = self.charCodeAt(0);
                                var $5183 = self.slice(1);
                                var $5184 = ($5182 === 40);
                                var _wrap$7 = $5184;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5185 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5185;
                            } else {
                                var $5186 = _func$6;
                                var _func$9 = $5186;
                            };
                            var $5180 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5178 = $5180;
                        };
                        return $5178;
                    case 'Fm.Term.str':
                        var $5187 = self.strx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5189 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5188 = $5189;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5191 = Bool$false;
                                var _wrap$7 = $5191;
                            } else {
                                var $5192 = self.charCodeAt(0);
                                var $5193 = self.slice(1);
                                var $5194 = ($5192 === 40);
                                var _wrap$7 = $5194;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5195 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5195;
                            } else {
                                var $5196 = _func$6;
                                var _func$9 = $5196;
                            };
                            var $5190 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5188 = $5190;
                        };
                        return $5188;
                    case 'Fm.Term.cse':
                        var $5197 = self.path;
                        var $5198 = self.expr;
                        var $5199 = self.name;
                        var $5200 = self.with;
                        var $5201 = self.cses;
                        var $5202 = self.moti;
                        var _arity$10 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$10 === 3n));
                        if (self) {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$12 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$13 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5204 = String$flatten$(List$cons$(_eq_lft$12, List$cons$(" == ", List$cons$(_eq_rgt$13, List$nil))));
                            var $5203 = $5204;
                        } else {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$11;
                            if (self.length === 0) {
                                var $5206 = Bool$false;
                                var _wrap$12 = $5206;
                            } else {
                                var $5207 = self.charCodeAt(0);
                                var $5208 = self.slice(1);
                                var $5209 = ($5207 === 40);
                                var _wrap$12 = $5209;
                            };
                            var _args$13 = String$join$(",", _args$3);
                            var self = _wrap$12;
                            if (self) {
                                var $5210 = String$flatten$(List$cons$("(", List$cons$(_func$11, List$cons$(")", List$nil))));
                                var _func$14 = $5210;
                            } else {
                                var $5211 = _func$11;
                                var _func$14 = $5211;
                            };
                            var $5205 = String$flatten$(List$cons$(_func$14, List$cons$("(", List$cons$(_args$13, List$cons$(")", List$nil)))));
                            var $5203 = $5205;
                        };
                        return $5203;
                    case 'Fm.Term.ori':
                        var $5212 = self.orig;
                        var $5213 = self.expr;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5215 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5214 = $5215;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5217 = Bool$false;
                                var _wrap$8 = $5217;
                            } else {
                                var $5218 = self.charCodeAt(0);
                                var $5219 = self.slice(1);
                                var $5220 = ($5218 === 40);
                                var _wrap$8 = $5220;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5221 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5221;
                            } else {
                                var $5222 = _func$7;
                                var _func$10 = $5222;
                            };
                            var $5216 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5214 = $5216;
                        };
                        return $5214;
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
                var $5224 = _list$4;
                var $5223 = $5224;
                break;
            case 'Map.tie':
                var $5225 = self.val;
                var $5226 = self.lft;
                var $5227 = self.rgt;
                var self = $5225;
                switch (self._) {
                    case 'Maybe.none':
                        var $5229 = _list$4;
                        var _list0$8 = $5229;
                        break;
                    case 'Maybe.some':
                        var $5230 = self.value;
                        var $5231 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5230), _list$4);
                        var _list0$8 = $5231;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5226, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5227, (_key$3 + '1'), _list1$9);
                var $5228 = _list2$10;
                var $5223 = $5228;
                break;
        };
        return $5223;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5232 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5232;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $5234 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5233 = $5234;
                break;
            case 'o':
                var $5235 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5237 = List$cons$(_head$6, _tail$7);
                    var $5236 = $5237;
                } else {
                    var $5238 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5239 = Bits$chunks_of$go$(_len$1, $5235, $5238, _chunk$7);
                    var $5236 = $5239;
                };
                var $5233 = $5236;
                break;
            case 'i':
                var $5240 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5242 = List$cons$(_head$6, _tail$7);
                    var $5241 = $5242;
                } else {
                    var $5243 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5244 = Bits$chunks_of$go$(_len$1, $5240, $5243, _chunk$7);
                    var $5241 = $5244;
                };
                var $5233 = $5241;
                break;
        };
        return $5233;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5245 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5245;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5247 = Word$e;
            var $5246 = $5247;
        } else {
            var $5248 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'e':
                    var $5250 = Word$o$(Word$from_bits$($5248, Bits$e));
                    var $5249 = $5250;
                    break;
                case 'o':
                    var $5251 = self.slice(0, -1);
                    var $5252 = Word$o$(Word$from_bits$($5248, $5251));
                    var $5249 = $5252;
                    break;
                case 'i':
                    var $5253 = self.slice(0, -1);
                    var $5254 = Word$i$(Word$from_bits$($5248, $5253));
                    var $5249 = $5254;
                    break;
            };
            var $5246 = $5249;
        };
        return $5246;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Fm$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5257 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5257;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5259 = ((_u16$5 + 71) & 0xFFFF);
                    var $5258 = $5259;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5261 = (Math.max(_u16$5 - 4, 0));
                        var $5260 = $5261;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5263 = 46;
                            var $5262 = $5263;
                        } else {
                            var $5264 = 95;
                            var $5262 = $5264;
                        };
                        var $5260 = $5262;
                    };
                    var $5258 = $5260;
                };
                var _chr$6 = $5258;
            };
            var $5256 = String$cons$(_chr$6, _name$4);
            return $5256;
        }));
        var $5255 = _name$3;
        return $5255;
    };
    const Fm$Name$from_bits = x0 => Fm$Name$from_bits$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $5266 = self.fst;
                var $5267 = self.snd;
                var $5268 = $5266;
                var $5265 = $5268;
                break;
        };
        return $5265;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Fm$Term$show$go$(_term$1, _path$2) {
        var self = Fm$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $5271 = self.name;
                        var $5272 = self.indx;
                        var $5273 = Fm$Name$show$($5271);
                        var $5270 = $5273;
                        break;
                    case 'Fm.Term.ref':
                        var $5274 = self.name;
                        var _name$4 = Fm$Name$show$($5274);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5276 = _name$4;
                                var $5275 = $5276;
                                break;
                            case 'Maybe.some':
                                var $5277 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Fm$Path$to_bits$($5277));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5278 = String$flatten$(List$cons$(_name$4, List$cons$(Fm$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5275 = $5278;
                                break;
                        };
                        var $5270 = $5275;
                        break;
                    case 'Fm.Term.typ':
                        var $5279 = "Type";
                        var $5270 = $5279;
                        break;
                    case 'Fm.Term.all':
                        var $5280 = self.eras;
                        var $5281 = self.self;
                        var $5282 = self.name;
                        var $5283 = self.xtyp;
                        var $5284 = self.body;
                        var _eras$8 = $5280;
                        var _self$9 = Fm$Name$show$($5281);
                        var _name$10 = Fm$Name$show$($5282);
                        var _type$11 = Fm$Term$show$go$($5283, Fm$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5286 = "<";
                            var _open$12 = $5286;
                        } else {
                            var $5287 = "(";
                            var _open$12 = $5287;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5288 = ">";
                            var _clos$13 = $5288;
                        } else {
                            var $5289 = ")";
                            var _clos$13 = $5289;
                        };
                        var _body$14 = Fm$Term$show$go$($5284(Fm$Term$var$($5281, 0n))(Fm$Term$var$($5282, 0n)), Fm$MPath$i$(_path$2));
                        var $5285 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5270 = $5285;
                        break;
                    case 'Fm.Term.lam':
                        var $5290 = self.name;
                        var $5291 = self.body;
                        var _name$5 = Fm$Name$show$($5290);
                        var _body$6 = Fm$Term$show$go$($5291(Fm$Term$var$($5290, 0n)), Fm$MPath$o$(_path$2));
                        var $5292 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5270 = $5292;
                        break;
                    case 'Fm.Term.app':
                        var $5293 = self.func;
                        var $5294 = self.argm;
                        var $5295 = Fm$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5270 = $5295;
                        break;
                    case 'Fm.Term.let':
                        var $5296 = self.name;
                        var $5297 = self.expr;
                        var $5298 = self.body;
                        var _name$6 = Fm$Name$show$($5296);
                        var _expr$7 = Fm$Term$show$go$($5297, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5298(Fm$Term$var$($5296, 0n)), Fm$MPath$i$(_path$2));
                        var $5299 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5270 = $5299;
                        break;
                    case 'Fm.Term.def':
                        var $5300 = self.name;
                        var $5301 = self.expr;
                        var $5302 = self.body;
                        var _name$6 = Fm$Name$show$($5300);
                        var _expr$7 = Fm$Term$show$go$($5301, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5302(Fm$Term$var$($5300, 0n)), Fm$MPath$i$(_path$2));
                        var $5303 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5270 = $5303;
                        break;
                    case 'Fm.Term.ann':
                        var $5304 = self.done;
                        var $5305 = self.term;
                        var $5306 = self.type;
                        var _term$6 = Fm$Term$show$go$($5305, Fm$MPath$o$(_path$2));
                        var _type$7 = Fm$Term$show$go$($5306, Fm$MPath$i$(_path$2));
                        var $5307 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5270 = $5307;
                        break;
                    case 'Fm.Term.gol':
                        var $5308 = self.name;
                        var $5309 = self.dref;
                        var $5310 = self.verb;
                        var _name$6 = Fm$Name$show$($5308);
                        var $5311 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5270 = $5311;
                        break;
                    case 'Fm.Term.hol':
                        var $5312 = self.path;
                        var $5313 = "_";
                        var $5270 = $5313;
                        break;
                    case 'Fm.Term.nat':
                        var $5314 = self.natx;
                        var $5315 = String$flatten$(List$cons$(Nat$show$($5314), List$nil));
                        var $5270 = $5315;
                        break;
                    case 'Fm.Term.chr':
                        var $5316 = self.chrx;
                        var $5317 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($5316), List$cons$("\'", List$nil))));
                        var $5270 = $5317;
                        break;
                    case 'Fm.Term.str':
                        var $5318 = self.strx;
                        var $5319 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($5318), List$cons$("\"", List$nil))));
                        var $5270 = $5319;
                        break;
                    case 'Fm.Term.cse':
                        var $5320 = self.path;
                        var $5321 = self.expr;
                        var $5322 = self.name;
                        var $5323 = self.with;
                        var $5324 = self.cses;
                        var $5325 = self.moti;
                        var _expr$9 = Fm$Term$show$go$($5321, Fm$MPath$o$(_path$2));
                        var _name$10 = Fm$Name$show$($5322);
                        var _wyth$11 = String$join$("", List$mapped$($5323, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5328 = self.file;
                                    var $5329 = self.code;
                                    var $5330 = self.name;
                                    var $5331 = self.term;
                                    var $5332 = self.type;
                                    var $5333 = self.stat;
                                    var _name$18 = Fm$Name$show$($5330);
                                    var _type$19 = Fm$Term$show$go$($5332, Maybe$none);
                                    var _term$20 = Fm$Term$show$go$($5331, Maybe$none);
                                    var $5334 = String$flatten$(List$cons$(_name$18, List$cons$(": ", List$cons$(_type$19, List$cons$(" = ", List$cons$(_term$20, List$cons$(";", List$nil)))))));
                                    var $5327 = $5334;
                                    break;
                            };
                            return $5327;
                        })));
                        var _cses$12 = Map$to_list$($5324);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Fm$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Fm$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5335 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5335;
                        })));
                        var self = $5325;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5336 = "";
                                var _moti$14 = $5336;
                                break;
                            case 'Maybe.some':
                                var $5337 = self.value;
                                var $5338 = String$flatten$(List$cons$(": ", List$cons$(Fm$Term$show$go$($5337, Maybe$none), List$nil)));
                                var _moti$14 = $5338;
                                break;
                        };
                        var $5326 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5270 = $5326;
                        break;
                    case 'Fm.Term.ori':
                        var $5339 = self.orig;
                        var $5340 = self.expr;
                        var $5341 = Fm$Term$show$go$($5340, _path$2);
                        var $5270 = $5341;
                        break;
                };
                var $5269 = $5270;
                break;
            case 'Maybe.some':
                var $5342 = self.value;
                var $5343 = $5342;
                var $5269 = $5343;
                break;
        };
        return $5269;
    };
    const Fm$Term$show$go = x0 => x1 => Fm$Term$show$go$(x0, x1);

    function Fm$Term$show$(_term$1) {
        var $5344 = Fm$Term$show$go$(_term$1, Maybe$none);
        return $5344;
    };
    const Fm$Term$show = x0 => Fm$Term$show$(x0);

    function Fm$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.nil':
                var $5346 = List$nil;
                var $5345 = $5346;
                break;
            case 'List.cons':
                var $5347 = self.head;
                var $5348 = self.tail;
                var self = $5347;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5350 = self.origin;
                        var $5351 = self.expected;
                        var $5352 = self.detected;
                        var $5353 = self.context;
                        var $5354 = (!_got$2);
                        var _keep$5 = $5354;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5355 = self.name;
                        var $5356 = self.dref;
                        var $5357 = self.verb;
                        var $5358 = self.goal;
                        var $5359 = self.context;
                        var $5360 = Bool$true;
                        var _keep$5 = $5360;
                        break;
                    case 'Fm.Error.waiting':
                        var $5361 = self.name;
                        var $5362 = Bool$false;
                        var _keep$5 = $5362;
                        break;
                    case 'Fm.Error.indirect':
                        var $5363 = self.name;
                        var $5364 = Bool$false;
                        var _keep$5 = $5364;
                        break;
                    case 'Fm.Error.patch':
                        var $5365 = self.path;
                        var $5366 = self.term;
                        var $5367 = Bool$false;
                        var _keep$5 = $5367;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5368 = self.origin;
                        var $5369 = self.name;
                        var $5370 = (!_got$2);
                        var _keep$5 = $5370;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5371 = self.origin;
                        var $5372 = self.term;
                        var $5373 = self.context;
                        var $5374 = (!_got$2);
                        var _keep$5 = $5374;
                        break;
                };
                var self = $5347;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5375 = self.origin;
                        var $5376 = self.expected;
                        var $5377 = self.detected;
                        var $5378 = self.context;
                        var $5379 = Bool$true;
                        var _got$6 = $5379;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5380 = self.name;
                        var $5381 = self.dref;
                        var $5382 = self.verb;
                        var $5383 = self.goal;
                        var $5384 = self.context;
                        var $5385 = _got$2;
                        var _got$6 = $5385;
                        break;
                    case 'Fm.Error.waiting':
                        var $5386 = self.name;
                        var $5387 = _got$2;
                        var _got$6 = $5387;
                        break;
                    case 'Fm.Error.indirect':
                        var $5388 = self.name;
                        var $5389 = _got$2;
                        var _got$6 = $5389;
                        break;
                    case 'Fm.Error.patch':
                        var $5390 = self.path;
                        var $5391 = self.term;
                        var $5392 = _got$2;
                        var _got$6 = $5392;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5393 = self.origin;
                        var $5394 = self.name;
                        var $5395 = Bool$true;
                        var _got$6 = $5395;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5396 = self.origin;
                        var $5397 = self.term;
                        var $5398 = self.context;
                        var $5399 = _got$2;
                        var _got$6 = $5399;
                        break;
                };
                var _tail$7 = Fm$Error$relevant$($5348, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5400 = List$cons$($5347, _tail$7);
                    var $5349 = $5400;
                } else {
                    var $5401 = _tail$7;
                    var $5349 = $5401;
                };
                var $5345 = $5349;
                break;
        };
        return $5345;
    };
    const Fm$Error$relevant = x0 => x1 => Fm$Error$relevant$(x0, x1);

    function Fm$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.nil':
                var $5403 = "";
                var $5402 = $5403;
                break;
            case 'List.cons':
                var $5404 = self.head;
                var $5405 = self.tail;
                var self = $5404;
                switch (self._) {
                    case 'Pair.new':
                        var $5407 = self.fst;
                        var $5408 = self.snd;
                        var _name$6 = Fm$Name$show$($5407);
                        var _type$7 = Fm$Term$show$(Fm$Term$normalize$($5408, Map$new));
                        var _rest$8 = Fm$Context$show$($5405);
                        var $5409 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5406 = $5409;
                        break;
                };
                var $5402 = $5406;
                break;
        };
        return $5402;
    };
    const Fm$Context$show = x0 => Fm$Context$show$(x0);

    function Fm$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5410 = Fm$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Fm.Term.var':
                    var $5412 = self.name;
                    var $5413 = self.indx;
                    var $5414 = _term$4;
                    var $5411 = $5414;
                    break;
                case 'Fm.Term.ref':
                    var $5415 = self.name;
                    var self = Fm$get$($5415, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5417 = Fm$Term$ref$($5415);
                            var $5416 = $5417;
                            break;
                        case 'Maybe.some':
                            var $5418 = self.value;
                            var self = $5418;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5420 = self.file;
                                    var $5421 = self.code;
                                    var $5422 = self.name;
                                    var $5423 = self.term;
                                    var $5424 = self.type;
                                    var $5425 = self.stat;
                                    var $5426 = $5423;
                                    var $5419 = $5426;
                                    break;
                            };
                            var $5416 = $5419;
                            break;
                    };
                    var $5411 = $5416;
                    break;
                case 'Fm.Term.typ':
                    var $5427 = _term$4;
                    var $5411 = $5427;
                    break;
                case 'Fm.Term.all':
                    var $5428 = self.eras;
                    var $5429 = self.self;
                    var $5430 = self.name;
                    var $5431 = self.xtyp;
                    var $5432 = self.body;
                    var $5433 = _term$4;
                    var $5411 = $5433;
                    break;
                case 'Fm.Term.lam':
                    var $5434 = self.name;
                    var $5435 = self.body;
                    var $5436 = _term$4;
                    var $5411 = $5436;
                    break;
                case 'Fm.Term.app':
                    var $5437 = self.func;
                    var $5438 = self.argm;
                    var $5439 = _term$4;
                    var $5411 = $5439;
                    break;
                case 'Fm.Term.let':
                    var $5440 = self.name;
                    var $5441 = self.expr;
                    var $5442 = self.body;
                    var $5443 = _term$4;
                    var $5411 = $5443;
                    break;
                case 'Fm.Term.def':
                    var $5444 = self.name;
                    var $5445 = self.expr;
                    var $5446 = self.body;
                    var $5447 = _term$4;
                    var $5411 = $5447;
                    break;
                case 'Fm.Term.ann':
                    var $5448 = self.done;
                    var $5449 = self.term;
                    var $5450 = self.type;
                    var $5451 = _term$4;
                    var $5411 = $5451;
                    break;
                case 'Fm.Term.gol':
                    var $5452 = self.name;
                    var $5453 = self.dref;
                    var $5454 = self.verb;
                    var $5455 = _term$4;
                    var $5411 = $5455;
                    break;
                case 'Fm.Term.hol':
                    var $5456 = self.path;
                    var $5457 = _term$4;
                    var $5411 = $5457;
                    break;
                case 'Fm.Term.nat':
                    var $5458 = self.natx;
                    var $5459 = _term$4;
                    var $5411 = $5459;
                    break;
                case 'Fm.Term.chr':
                    var $5460 = self.chrx;
                    var $5461 = _term$4;
                    var $5411 = $5461;
                    break;
                case 'Fm.Term.str':
                    var $5462 = self.strx;
                    var $5463 = _term$4;
                    var $5411 = $5463;
                    break;
                case 'Fm.Term.cse':
                    var $5464 = self.path;
                    var $5465 = self.expr;
                    var $5466 = self.name;
                    var $5467 = self.with;
                    var $5468 = self.cses;
                    var $5469 = self.moti;
                    var $5470 = _term$4;
                    var $5411 = $5470;
                    break;
                case 'Fm.Term.ori':
                    var $5471 = self.orig;
                    var $5472 = self.expr;
                    var $5473 = _term$4;
                    var $5411 = $5473;
                    break;
            };
            return $5411;
        }));
        return $5410;
    };
    const Fm$Term$expand_at = x0 => x1 => x2 => Fm$Term$expand_at$(x0, x1, x2);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Fm$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5475 = self.name;
                var $5476 = self.indx;
                var $5477 = Fm$Term$var$($5475, $5476);
                var $5474 = $5477;
                break;
            case 'Fm.Term.ref':
                var $5478 = self.name;
                var _expand$5 = Bool$false;
                var _expand$6 = ((($5478 === "Nat.succ") && (_arity$3 > 1n)) || _expand$5);
                var _expand$7 = ((($5478 === "Nat.zero") && (_arity$3 > 0n)) || _expand$6);
                var _expand$8 = ((($5478 === "Bool.true") && (_arity$3 > 0n)) || _expand$7);
                var _expand$9 = ((($5478 === "Bool.false") && (_arity$3 > 0n)) || _expand$8);
                var self = _expand$9;
                if (self) {
                    var self = Fm$get$($5478, _defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5481 = Fm$Term$ref$($5478);
                            var $5480 = $5481;
                            break;
                        case 'Maybe.some':
                            var $5482 = self.value;
                            var self = $5482;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5484 = self.file;
                                    var $5485 = self.code;
                                    var $5486 = self.name;
                                    var $5487 = self.term;
                                    var $5488 = self.type;
                                    var $5489 = self.stat;
                                    var $5490 = $5487;
                                    var $5483 = $5490;
                                    break;
                            };
                            var $5480 = $5483;
                            break;
                    };
                    var $5479 = $5480;
                } else {
                    var $5491 = Fm$Term$ref$($5478);
                    var $5479 = $5491;
                };
                var $5474 = $5479;
                break;
            case 'Fm.Term.typ':
                var $5492 = Fm$Term$typ;
                var $5474 = $5492;
                break;
            case 'Fm.Term.all':
                var $5493 = self.eras;
                var $5494 = self.self;
                var $5495 = self.name;
                var $5496 = self.xtyp;
                var $5497 = self.body;
                var $5498 = Fm$Term$all$($5493, $5494, $5495, Fm$Term$expand_ct$($5496, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5499 = Fm$Term$expand_ct$($5497(_s$9)(_x$10), _defs$2, 0n);
                    return $5499;
                }));
                var $5474 = $5498;
                break;
            case 'Fm.Term.lam':
                var $5500 = self.name;
                var $5501 = self.body;
                var $5502 = Fm$Term$lam$($5500, (_x$6 => {
                    var $5503 = Fm$Term$expand_ct$($5501(_x$6), _defs$2, 0n);
                    return $5503;
                }));
                var $5474 = $5502;
                break;
            case 'Fm.Term.app':
                var $5504 = self.func;
                var $5505 = self.argm;
                var $5506 = Fm$Term$app$(Fm$Term$expand_ct$($5504, _defs$2, Nat$succ$(_arity$3)), Fm$Term$expand_ct$($5505, _defs$2, 0n));
                var $5474 = $5506;
                break;
            case 'Fm.Term.let':
                var $5507 = self.name;
                var $5508 = self.expr;
                var $5509 = self.body;
                var $5510 = Fm$Term$let$($5507, Fm$Term$expand_ct$($5508, _defs$2, 0n), (_x$7 => {
                    var $5511 = Fm$Term$expand_ct$($5509(_x$7), _defs$2, 0n);
                    return $5511;
                }));
                var $5474 = $5510;
                break;
            case 'Fm.Term.def':
                var $5512 = self.name;
                var $5513 = self.expr;
                var $5514 = self.body;
                var $5515 = Fm$Term$def$($5512, Fm$Term$expand_ct$($5513, _defs$2, 0n), (_x$7 => {
                    var $5516 = Fm$Term$expand_ct$($5514(_x$7), _defs$2, 0n);
                    return $5516;
                }));
                var $5474 = $5515;
                break;
            case 'Fm.Term.ann':
                var $5517 = self.done;
                var $5518 = self.term;
                var $5519 = self.type;
                var $5520 = Fm$Term$ann$($5517, Fm$Term$expand_ct$($5518, _defs$2, 0n), Fm$Term$expand_ct$($5519, _defs$2, 0n));
                var $5474 = $5520;
                break;
            case 'Fm.Term.gol':
                var $5521 = self.name;
                var $5522 = self.dref;
                var $5523 = self.verb;
                var $5524 = Fm$Term$gol$($5521, $5522, $5523);
                var $5474 = $5524;
                break;
            case 'Fm.Term.hol':
                var $5525 = self.path;
                var $5526 = Fm$Term$hol$($5525);
                var $5474 = $5526;
                break;
            case 'Fm.Term.nat':
                var $5527 = self.natx;
                var $5528 = Fm$Term$nat$($5527);
                var $5474 = $5528;
                break;
            case 'Fm.Term.chr':
                var $5529 = self.chrx;
                var $5530 = Fm$Term$chr$($5529);
                var $5474 = $5530;
                break;
            case 'Fm.Term.str':
                var $5531 = self.strx;
                var $5532 = Fm$Term$str$($5531);
                var $5474 = $5532;
                break;
            case 'Fm.Term.cse':
                var $5533 = self.path;
                var $5534 = self.expr;
                var $5535 = self.name;
                var $5536 = self.with;
                var $5537 = self.cses;
                var $5538 = self.moti;
                var $5539 = _term$1;
                var $5474 = $5539;
                break;
            case 'Fm.Term.ori':
                var $5540 = self.orig;
                var $5541 = self.expr;
                var $5542 = Fm$Term$ori$($5540, $5541);
                var $5474 = $5542;
                break;
        };
        return $5474;
    };
    const Fm$Term$expand_ct = x0 => x1 => x2 => Fm$Term$expand_ct$(x0, x1, x2);

    function Fm$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Fm$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5545 = _term$4;
            var $5546 = _dref$1;
            let _term$6 = $5545;
            let _path$5;
            while ($5546._ === 'List.cons') {
                _path$5 = $5546.head;
                var _term$7 = Fm$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Fm$Term$normalize$(_term$7, Map$new);
                var _term$9 = Fm$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Fm$Term$normalize$(_term$9, Map$new);
                var $5545 = _term$10;
                _term$6 = $5545;
                $5546 = $5546.tail;
            }
            return _term$6;
        })();
        var $5543 = _term$5;
        return $5543;
    };
    const Fm$Term$expand = x0 => x1 => x2 => Fm$Term$expand$(x0, x1, x2);

    function Fm$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5548 = self.origin;
                var $5549 = self.expected;
                var $5550 = self.detected;
                var $5551 = self.context;
                var self = $5549;
                switch (self._) {
                    case 'Either.left':
                        var $5553 = self.value;
                        var $5554 = $5553;
                        var _expected$7 = $5554;
                        break;
                    case 'Either.right':
                        var $5555 = self.value;
                        var $5556 = Fm$Term$show$(Fm$Term$normalize$($5555, Map$new));
                        var _expected$7 = $5556;
                        break;
                };
                var self = $5550;
                switch (self._) {
                    case 'Either.left':
                        var $5557 = self.value;
                        var $5558 = $5557;
                        var _detected$8 = $5558;
                        break;
                    case 'Either.right':
                        var $5559 = self.value;
                        var $5560 = Fm$Term$show$(Fm$Term$normalize$($5559, Map$new));
                        var _detected$8 = $5560;
                        break;
                };
                var $5552 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5551;
                    switch (self._) {
                        case 'List.nil':
                            var $5561 = "";
                            return $5561;
                        case 'List.cons':
                            var $5562 = self.head;
                            var $5563 = self.tail;
                            var $5564 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Fm$Context$show$($5551), List$nil)));
                            return $5564;
                    };
                })(), List$nil)))))))));
                var $5547 = $5552;
                break;
            case 'Fm.Error.show_goal':
                var $5565 = self.name;
                var $5566 = self.dref;
                var $5567 = self.verb;
                var $5568 = self.goal;
                var $5569 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Fm$Name$show$($5565), List$cons$(":\u{a}", List$nil))));
                var self = $5568;
                switch (self._) {
                    case 'Maybe.none':
                        var $5571 = "";
                        var _with_type$9 = $5571;
                        break;
                    case 'Maybe.some':
                        var $5572 = self.value;
                        var _goal$10 = Fm$Term$expand$($5566, $5572, _defs$2);
                        var $5573 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5567;
                            if (self) {
                                var $5574 = Fm$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5575 = _x$11;
                                    return $5575;
                                })));
                                return $5574;
                            } else {
                                var $5576 = Fm$Term$show$(_goal$10);
                                return $5576;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5573;
                        break;
                };
                var self = $5569;
                switch (self._) {
                    case 'List.nil':
                        var $5577 = "";
                        var _with_ctxt$10 = $5577;
                        break;
                    case 'List.cons':
                        var $5578 = self.head;
                        var $5579 = self.tail;
                        var $5580 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Fm$Context$show$($5569), List$nil)));
                        var _with_ctxt$10 = $5580;
                        break;
                };
                var $5570 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5547 = $5570;
                break;
            case 'Fm.Error.waiting':
                var $5581 = self.name;
                var $5582 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5581, List$cons$("\'.", List$nil))));
                var $5547 = $5582;
                break;
            case 'Fm.Error.indirect':
                var $5583 = self.name;
                var $5584 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5583, List$cons$("\'.", List$nil))));
                var $5547 = $5584;
                break;
            case 'Fm.Error.patch':
                var $5585 = self.path;
                var $5586 = self.term;
                var $5587 = String$flatten$(List$cons$("Patching: ", List$cons$(Fm$Term$show$($5586), List$nil)));
                var $5547 = $5587;
                break;
            case 'Fm.Error.undefined_reference':
                var $5588 = self.origin;
                var $5589 = self.name;
                var $5590 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Fm$Name$show$($5589), List$cons$("\u{a}", List$nil))));
                var $5547 = $5590;
                break;
            case 'Fm.Error.cant_infer':
                var $5591 = self.origin;
                var $5592 = self.term;
                var $5593 = self.context;
                var _term$6 = Fm$Term$show$($5592);
                var _context$7 = Fm$Context$show$($5593);
                var $5594 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5547 = $5594;
                break;
        };
        return $5547;
    };
    const Fm$Error$show = x0 => x1 => Fm$Error$show$(x0, x1);

    function Fm$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5596 = self.origin;
                var $5597 = self.expected;
                var $5598 = self.detected;
                var $5599 = self.context;
                var $5600 = $5596;
                var $5595 = $5600;
                break;
            case 'Fm.Error.show_goal':
                var $5601 = self.name;
                var $5602 = self.dref;
                var $5603 = self.verb;
                var $5604 = self.goal;
                var $5605 = self.context;
                var $5606 = Maybe$none;
                var $5595 = $5606;
                break;
            case 'Fm.Error.waiting':
                var $5607 = self.name;
                var $5608 = Maybe$none;
                var $5595 = $5608;
                break;
            case 'Fm.Error.indirect':
                var $5609 = self.name;
                var $5610 = Maybe$none;
                var $5595 = $5610;
                break;
            case 'Fm.Error.patch':
                var $5611 = self.path;
                var $5612 = self.term;
                var $5613 = Maybe$none;
                var $5595 = $5613;
                break;
            case 'Fm.Error.undefined_reference':
                var $5614 = self.origin;
                var $5615 = self.name;
                var $5616 = $5614;
                var $5595 = $5616;
                break;
            case 'Fm.Error.cant_infer':
                var $5617 = self.origin;
                var $5618 = self.term;
                var $5619 = self.context;
                var $5620 = $5617;
                var $5595 = $5620;
                break;
        };
        return $5595;
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
                        var $5621 = String$flatten$(List$cons$(_typs$4, List$cons$("\u{a}", List$cons$((() => {
                            var self = _errs$3;
                            if (self.length === 0) {
                                var $5622 = "All terms check.";
                                return $5622;
                            } else {
                                var $5623 = self.charCodeAt(0);
                                var $5624 = self.slice(1);
                                var $5625 = _errs$3;
                                return $5625;
                            };
                        })(), List$nil))));
                        return $5621;
                    case 'List.cons':
                        var $5626 = self.head;
                        var $5627 = self.tail;
                        var _name$7 = $5626;
                        var self = Fm$get$(_name$7, _defs$1);
                        switch (self._) {
                            case 'Maybe.none':
                                var $5629 = Fm$Defs$report$go$(_defs$1, $5627, _errs$3, _typs$4);
                                var $5628 = $5629;
                                break;
                            case 'Maybe.some':
                                var $5630 = self.value;
                                var self = $5630;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $5632 = self.file;
                                        var $5633 = self.code;
                                        var $5634 = self.name;
                                        var $5635 = self.term;
                                        var $5636 = self.type;
                                        var $5637 = self.stat;
                                        var _typs$15 = String$flatten$(List$cons$(_typs$4, List$cons$(_name$7, List$cons$(": ", List$cons$(Fm$Term$show$($5636), List$cons$("\u{a}", List$nil))))));
                                        var self = $5637;
                                        switch (self._) {
                                            case 'Fm.Status.init':
                                                var $5639 = Fm$Defs$report$go$(_defs$1, $5627, _errs$3, _typs$15);
                                                var $5638 = $5639;
                                                break;
                                            case 'Fm.Status.wait':
                                                var $5640 = Fm$Defs$report$go$(_defs$1, $5627, _errs$3, _typs$15);
                                                var $5638 = $5640;
                                                break;
                                            case 'Fm.Status.done':
                                                var $5641 = Fm$Defs$report$go$(_defs$1, $5627, _errs$3, _typs$15);
                                                var $5638 = $5641;
                                                break;
                                            case 'Fm.Status.fail':
                                                var $5642 = self.errors;
                                                var self = $5642;
                                                switch (self._) {
                                                    case 'List.nil':
                                                        var $5644 = Fm$Defs$report$go$(_defs$1, $5627, _errs$3, _typs$15);
                                                        var $5643 = $5644;
                                                        break;
                                                    case 'List.cons':
                                                        var $5645 = self.head;
                                                        var $5646 = self.tail;
                                                        var _name_str$19 = Fm$Name$show$($5634);
                                                        var _rel_errs$20 = Fm$Error$relevant$($5642, Bool$false);
                                                        var _rel_msgs$21 = List$mapped$(_rel_errs$20, (_err$21 => {
                                                            var $5648 = String$flatten$(List$cons$(Fm$Error$show$(_err$21, _defs$1), List$cons$((() => {
                                                                var self = Fm$Error$origin$(_err$21);
                                                                switch (self._) {
                                                                    case 'Maybe.none':
                                                                        var $5649 = "";
                                                                        return $5649;
                                                                    case 'Maybe.some':
                                                                        var $5650 = self.value;
                                                                        var self = $5650;
                                                                        switch (self._) {
                                                                            case 'Fm.Origin.new':
                                                                                var $5652 = self.file;
                                                                                var $5653 = self.from;
                                                                                var $5654 = self.upto;
                                                                                var $5655 = String$flatten$(List$cons$("Inside \'", List$cons$($5632, List$cons$("\':\u{a}", List$cons$(Fm$highlight$($5633, $5653, $5654), List$cons$("\u{a}", List$nil))))));
                                                                                var $5651 = $5655;
                                                                                break;
                                                                        };
                                                                        return $5651;
                                                                };
                                                            })(), List$nil)));
                                                            return $5648;
                                                        }));
                                                        var _errs$22 = String$flatten$(List$cons$(_errs$3, List$cons$(String$join$("\u{a}", _rel_msgs$21), List$cons$("\u{a}", List$nil))));
                                                        var $5647 = Fm$Defs$report$go$(_defs$1, $5627, _errs$22, _typs$15);
                                                        var $5643 = $5647;
                                                        break;
                                                };
                                                var $5638 = $5643;
                                                break;
                                        };
                                        var $5631 = $5638;
                                        break;
                                };
                                var $5628 = $5631;
                                break;
                        };
                        return $5628;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Defs$report$go = x0 => x1 => x2 => x3 => Fm$Defs$report$go$(x0, x1, x2, x3);

    function Fm$Defs$report$(_defs$1, _list$2) {
        var $5656 = Fm$Defs$report$go$(_defs$1, _list$2, "", "");
        return $5656;
    };
    const Fm$Defs$report = x0 => x1 => Fm$Defs$report$(x0, x1);

    function Fm$checker$io$one$(_name$1) {
        var $5657 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $5658 = IO$print$(Fm$Defs$report$(_defs$2, List$cons$(_name$1, List$nil)));
            return $5658;
        }));
        return $5657;
    };
    const Fm$checker$io$one = x0 => Fm$checker$io$one$(x0);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $5660 = _list$4;
                var $5659 = $5660;
                break;
            case 'Map.tie':
                var $5661 = self.val;
                var $5662 = self.lft;
                var $5663 = self.rgt;
                var self = $5661;
                switch (self._) {
                    case 'Maybe.none':
                        var $5665 = _list$4;
                        var _list0$8 = $5665;
                        break;
                    case 'Maybe.some':
                        var $5666 = self.value;
                        var $5667 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5667;
                        break;
                };
                var _list1$9 = Map$keys$go$($5662, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5663, (_key$3 + '1'), _list1$9);
                var $5664 = _list2$10;
                var $5659 = $5664;
                break;
        };
        return $5659;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5668 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5668;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Fm$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.nil':
                var $5670 = Monad$pure$(IO$monad)(_defs$2);
                var $5669 = $5670;
                break;
            case 'List.cons':
                var $5671 = self.head;
                var $5672 = self.tail;
                var $5673 = Monad$bind$(IO$monad)(Fm$Synth$one$($5671, _defs$2))((_defs$5 => {
                    var $5674 = Fm$Synth$many$($5672, _defs$5);
                    return $5674;
                }));
                var $5669 = $5673;
                break;
        };
        return $5669;
    };
    const Fm$Synth$many = x0 => x1 => Fm$Synth$many$(x0, x1);

    function Fm$Synth$file$(_file$1, _defs$2) {
        var $5675 = Monad$bind$(IO$monad)(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Fm$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5677 = self.value;
                    var $5678 = Monad$pure$(IO$monad)(Either$left$($5677));
                    var $5676 = $5678;
                    break;
                case 'Either.right':
                    var $5679 = self.value;
                    var _file_defs$6 = $5679;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Fm$Name$from_bits);
                    var $5680 = Monad$bind$(IO$monad)(Fm$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5681 = Monad$pure$(IO$monad)(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5681;
                    }));
                    var $5676 = $5680;
                    break;
            };
            return $5676;
        }));
        return $5675;
    };
    const Fm$Synth$file = x0 => x1 => Fm$Synth$file$(x0, x1);

    function Fm$checker$io$file$(_file$1) {
        var $5682 = Monad$bind$(IO$monad)(Fm$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5684 = self.value;
                    var $5685 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5686 = IO$print$($5684);
                        return $5686;
                    }));
                    var $5683 = $5685;
                    break;
                case 'Either.right':
                    var $5687 = self.value;
                    var self = $5687;
                    switch (self._) {
                        case 'Pair.new':
                            var $5689 = self.fst;
                            var $5690 = self.snd;
                            var _nams$6 = $5689;
                            var _defs$7 = $5690;
                            var $5691 = IO$print$(Fm$Defs$report$(_defs$7, _nams$6));
                            var $5688 = $5691;
                            break;
                    };
                    var $5683 = $5688;
                    break;
            };
            return $5683;
        }));
        return $5682;
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
                        var $5692 = self.value;
                        var $5693 = $5692;
                        return $5693;
                    case 'IO.ask':
                        var $5694 = self.query;
                        var $5695 = self.param;
                        var $5696 = self.then;
                        var $5697 = IO$purify$($5696(""));
                        return $5697;
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
                var $5699 = self.value;
                var $5700 = $5699;
                var $5698 = $5700;
                break;
            case 'Either.right':
                var $5701 = self.value;
                var $5702 = IO$purify$((() => {
                    var _defs$3 = $5701;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Fm$Name$from_bits);
                    var $5703 = Monad$bind$(IO$monad)(Fm$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5704 = Monad$pure$(IO$monad)(Fm$Defs$report$(_defs$5, _nams$4));
                        return $5704;
                    }));
                    return $5703;
                })());
                var $5698 = $5702;
                break;
        };
        return $5698;
    };
    const Fm$checker$code = x0 => Fm$checker$code$(x0);

    function Fm$Term$read$(_code$1) {
        var self = Fm$Parser$term(0n)(_code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $5706 = self.idx;
                var $5707 = self.code;
                var $5708 = self.err;
                var $5709 = Maybe$none;
                var $5705 = $5709;
                break;
            case 'Parser.Reply.value':
                var $5710 = self.idx;
                var $5711 = self.code;
                var $5712 = self.val;
                var $5713 = Maybe$some$($5712);
                var $5705 = $5713;
                break;
        };
        return $5705;
    };
    const Fm$Term$read = x0 => Fm$Term$read$(x0);
    const Fm = (() => {
        var __$1 = Fm$to_core$io$one;
        var __$2 = Fm$checker$io$one;
        var __$3 = Fm$checker$io$file;
        var __$4 = Fm$checker$code;
        var __$5 = Fm$Term$read;
        var $5714 = Fm$checker$io$file$("Main.fm");
        return $5714;
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
        'Fm.Parser.inequality': Fm$Parser$inequality,
        'Fm.Parser.rewrite': Fm$Parser$rewrite,
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