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
    const Fm$Parser$letforrange$u32 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $500 = Monad$bind$(Parser$monad)(Fm$Parser$text$("let "))((_$2 => {
            var $501 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$3 => {
                var $502 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$4 => {
                    var $503 = Monad$bind$(Parser$monad)(Fm$Parser$text$("for "))((_$5 => {
                        var $504 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_elem$6 => {
                            var $505 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$7 => {
                                var $506 = Monad$bind$(Parser$monad)(Fm$Parser$text$("U32"))((_$8 => {
                                    var $507 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$9 => {
                                        var $508 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_idx0$10 => {
                                            var $509 = Monad$bind$(Parser$monad)(Fm$Parser$text$(".."))((_$11 => {
                                                var $510 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_idx1$12 => {
                                                    var $511 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$13 => {
                                                        var $512 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_loop$14 => {
                                                            var $513 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$15 => {
                                                                var $514 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$16 => {
                                                                    var $515 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$17 => {
                                                                        var _term$18 = Fm$Term$ref$("U32.for");
                                                                        var _term$19 = Fm$Term$app$(_term$18, Fm$Term$hol$(Bits$e));
                                                                        var _term$20 = Fm$Term$app$(_term$19, Fm$Term$ref$(_name$3));
                                                                        var _term$21 = Fm$Term$app$(_term$20, _idx0$10);
                                                                        var _term$22 = Fm$Term$app$(_term$21, _idx1$12);
                                                                        var _lamb$23 = Fm$Term$lam$(_elem$6, (_e$23 => {
                                                                            var $517 = Fm$Term$lam$(_name$3, (_s$24 => {
                                                                                var $518 = _loop$14;
                                                                                return $518;
                                                                            }));
                                                                            return $517;
                                                                        }));
                                                                        var _term$24 = Fm$Term$app$(_term$22, _lamb$23);
                                                                        var _term$25 = Fm$Term$let$(_name$3, _term$24, (_x$25 => {
                                                                            var $519 = _body$16;
                                                                            return $519;
                                                                        }));
                                                                        var $516 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$17, _term$25));
                                                                        return $516;
                                                                    }));
                                                                    return $515;
                                                                }));
                                                                return $514;
                                                            }));
                                                            return $513;
                                                        }));
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
    const Fm$Parser$letforin = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $520 = Monad$bind$(Parser$monad)(Fm$Parser$text$("let "))((_$2 => {
            var $521 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$3 => {
                var $522 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$4 => {
                    var $523 = Monad$bind$(Parser$monad)(Fm$Parser$text$("for "))((_$5 => {
                        var $524 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_elem$6 => {
                            var $525 = Monad$bind$(Parser$monad)(Fm$Parser$text$("in"))((_$7 => {
                                var $526 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_list$8 => {
                                    var $527 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$9 => {
                                        var $528 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_loop$10 => {
                                            var $529 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$11 => {
                                                var $530 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$12 => {
                                                    var $531 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$13 => {
                                                        var _term$14 = Fm$Term$ref$("List.for");
                                                        var _term$15 = Fm$Term$app$(_term$14, Fm$Term$hol$(Bits$e));
                                                        var _term$16 = Fm$Term$app$(_term$15, _list$8);
                                                        var _term$17 = Fm$Term$app$(_term$16, Fm$Term$hol$(Bits$e));
                                                        var _term$18 = Fm$Term$app$(_term$17, Fm$Term$ref$(_name$3));
                                                        var _lamb$19 = Fm$Term$lam$(_elem$6, (_i$19 => {
                                                            var $533 = Fm$Term$lam$(_name$3, (_x$20 => {
                                                                var $534 = _loop$10;
                                                                return $534;
                                                            }));
                                                            return $533;
                                                        }));
                                                        var _term$20 = Fm$Term$app$(_term$18, _lamb$19);
                                                        var _term$21 = Fm$Term$let$(_name$3, _term$20, (_x$21 => {
                                                            var $535 = _body$12;
                                                            return $535;
                                                        }));
                                                        var $532 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$13, _term$21));
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
                        return $524;
                    }));
                    return $523;
                }));
                return $522;
            }));
            return $521;
        }));
        return $520;
    }));
    const Fm$Parser$let = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $536 = Monad$bind$(Parser$monad)(Fm$Parser$text$("let "))((_$2 => {
            var $537 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$3 => {
                var $538 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$4 => {
                    var $539 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$5 => {
                        var $540 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$6 => {
                            var $541 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$7 => {
                                var $542 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$8 => {
                                    var $543 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$8, Fm$Term$let$(_name$3, _expr$5, (_x$9 => {
                                        var $544 = _body$7;
                                        return $544;
                                    }))));
                                    return $543;
                                }));
                                return $542;
                            }));
                            return $541;
                        }));
                        return $540;
                    }));
                    return $539;
                }));
                return $538;
            }));
            return $537;
        }));
        return $536;
    }));
    const Fm$Parser$get = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $545 = Monad$bind$(Parser$monad)(Fm$Parser$text$("let "))((_$2 => {
            var $546 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$3 => {
                var $547 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_nam0$4 => {
                    var $548 = Monad$bind$(Parser$monad)(Fm$Parser$text$(","))((_$5 => {
                        var $549 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_nam1$6 => {
                            var $550 = Monad$bind$(Parser$monad)(Fm$Parser$text$("}"))((_$7 => {
                                var $551 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$8 => {
                                    var $552 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$9 => {
                                        var $553 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$10 => {
                                            var $554 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$11 => {
                                                var $555 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$12 => {
                                                    var _term$13 = _expr$9;
                                                    var _term$14 = Fm$Term$app$(_term$13, Fm$Term$lam$("x", (_x$14 => {
                                                        var $557 = Fm$Term$hol$(Bits$e);
                                                        return $557;
                                                    })));
                                                    var _term$15 = Fm$Term$app$(_term$14, Fm$Term$lam$(_nam0$4, (_x$15 => {
                                                        var $558 = Fm$Term$lam$(_nam1$6, (_y$16 => {
                                                            var $559 = _body$11;
                                                            return $559;
                                                        }));
                                                        return $558;
                                                    })));
                                                    var $556 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$12, _term$15));
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
                        return $549;
                    }));
                    return $548;
                }));
                return $547;
            }));
            return $546;
        }));
        return $545;
    }));

    function Fm$Term$def$(_name$1, _expr$2, _body$3) {
        var $560 = ({
            _: 'Fm.Term.def',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $560;
    };
    const Fm$Term$def = x0 => x1 => x2 => Fm$Term$def$(x0, x1, x2);
    const Fm$Parser$def = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $561 = Monad$bind$(Parser$monad)(Fm$Parser$text$("def "))((_$2 => {
            var $562 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$3 => {
                var $563 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$4 => {
                    var $564 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$5 => {
                        var $565 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$6 => {
                            var $566 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$7 => {
                                var $567 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$8 => {
                                    var $568 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$8, Fm$Term$def$(_name$3, _expr$5, (_x$9 => {
                                        var $569 = _body$7;
                                        return $569;
                                    }))));
                                    return $568;
                                }));
                                return $567;
                            }));
                            return $566;
                        }));
                        return $565;
                    }));
                    return $564;
                }));
                return $563;
            }));
            return $562;
        }));
        return $561;
    }));
    const Fm$Parser$if = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $570 = Monad$bind$(Parser$monad)(Fm$Parser$text$("if "))((_$2 => {
            var $571 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_cond$3 => {
                var $572 = Monad$bind$(Parser$monad)(Fm$Parser$text$("then"))((_$4 => {
                    var $573 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_tcse$5 => {
                        var $574 = Monad$bind$(Parser$monad)(Fm$Parser$text$("else"))((_$6 => {
                            var $575 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_fcse$7 => {
                                var $576 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$8 => {
                                    var _term$9 = _cond$3;
                                    var _term$10 = Fm$Term$app$(_term$9, Fm$Term$lam$("", (_x$10 => {
                                        var $578 = Fm$Term$hol$(Bits$e);
                                        return $578;
                                    })));
                                    var _term$11 = Fm$Term$app$(_term$10, _tcse$5);
                                    var _term$12 = Fm$Term$app$(_term$11, _fcse$7);
                                    var $577 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$8, _term$12));
                                    return $577;
                                }));
                                return $576;
                            }));
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
        return $570;
    }));

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.nil':
                var $580 = List$nil;
                var $579 = $580;
                break;
            case 'List.cons':
                var $581 = self.head;
                var $582 = self.tail;
                var $583 = List$cons$(_f$4($581), List$mapped$($582, _f$4));
                var $579 = $583;
                break;
        };
        return $579;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $584 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $584;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const Fm$backslash = 92;
    const Fm$escapes = List$cons$(Pair$new$("\\b", 8), List$cons$(Pair$new$("\\f", 12), List$cons$(Pair$new$("\\n", 10), List$cons$(Pair$new$("\\r", 13), List$cons$(Pair$new$("\\t", 9), List$cons$(Pair$new$("\\v", 11), List$cons$(Pair$new$(String$cons$(Fm$backslash, String$cons$(Fm$backslash, String$nil)), Fm$backslash), List$cons$(Pair$new$("\\\"", 34), List$cons$(Pair$new$("\\0", 0), List$cons$(Pair$new$("\\\'", 39), List$nil))))))))));
    const Fm$Parser$char$single = Parser$first_of$(List$cons$(Parser$first_of$(List$mapped$(Fm$escapes, (_esc$1 => {
        var self = _esc$1;
        switch (self._) {
            case 'Pair.new':
                var $586 = self.fst;
                var $587 = self.snd;
                var $588 = Monad$bind$(Parser$monad)(Parser$text($586))((_$4 => {
                    var $589 = Monad$pure$(Parser$monad)($587);
                    return $589;
                }));
                var $585 = $588;
                break;
        };
        return $585;
    }))), List$cons$(Parser$one, List$nil)));

    function Fm$Term$chr$(_chrx$1) {
        var $590 = ({
            _: 'Fm.Term.chr',
            'chrx': _chrx$1
        });
        return $590;
    };
    const Fm$Term$chr = x0 => Fm$Term$chr$(x0);
    const Fm$Parser$char = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $591 = Monad$bind$(Parser$monad)(Fm$Parser$text$("\'"))((_$2 => {
            var $592 = Monad$bind$(Parser$monad)(Fm$Parser$char$single)((_chrx$3 => {
                var $593 = Monad$bind$(Parser$monad)(Parser$text("\'"))((_$4 => {
                    var $594 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                        var $595 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$chr$(_chrx$3)));
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

    function Fm$Term$str$(_strx$1) {
        var $596 = ({
            _: 'Fm.Term.str',
            'strx': _strx$1
        });
        return $596;
    };
    const Fm$Term$str = x0 => Fm$Term$str$(x0);
    const Fm$Parser$string = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var _quot$2 = String$cons$(34, String$nil);
        var $597 = Monad$bind$(Parser$monad)(Fm$Parser$text$(_quot$2))((_$3 => {
            var $598 = Monad$bind$(Parser$monad)(Parser$until$(Parser$text(_quot$2), Fm$Parser$char$single))((_chrs$4 => {
                var _strx$5 = List$fold$(_chrs$4, String$nil, String$cons);
                var $599 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$6 => {
                    var $600 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, Fm$Term$str$(_strx$5)));
                    return $600;
                }));
                return $599;
            }));
            return $598;
        }));
        return $597;
    }));
    const Fm$Parser$pair = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $601 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$2 => {
            var $602 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val0$3 => {
                var $603 = Monad$bind$(Parser$monad)(Fm$Parser$text$(","))((_$4 => {
                    var $604 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$5 => {
                        var $605 = Monad$bind$(Parser$monad)(Fm$Parser$text$("}"))((_$6 => {
                            var $606 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                                var _term$8 = Fm$Term$ref$("Pair.new");
                                var _term$9 = Fm$Term$app$(_term$8, Fm$Term$hol$(Bits$e));
                                var _term$10 = Fm$Term$app$(_term$9, Fm$Term$hol$(Bits$e));
                                var _term$11 = Fm$Term$app$(_term$10, _val0$3);
                                var _term$12 = Fm$Term$app$(_term$11, _val1$5);
                                var $607 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$12));
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
        return $601;
    }));
    const Fm$Parser$sigma$type = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $608 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$2 => {
            var $609 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$3 => {
                var $610 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$4 => {
                    var $611 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_typ0$5 => {
                        var $612 = Monad$bind$(Parser$monad)(Fm$Parser$text$("}"))((_$6 => {
                            var $613 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_typ1$7 => {
                                var $614 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$8 => {
                                    var _term$9 = Fm$Term$ref$("Sigma");
                                    var _term$10 = Fm$Term$app$(_term$9, _typ0$5);
                                    var _term$11 = Fm$Term$app$(_term$10, Fm$Term$lam$("x", (_x$11 => {
                                        var $616 = _typ1$7;
                                        return $616;
                                    })));
                                    var $615 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$8, _term$11));
                                    return $615;
                                }));
                                return $614;
                            }));
                            return $613;
                        }));
                        return $612;
                    }));
                    return $611;
                }));
                return $610;
            }));
            return $609;
        }));
        return $608;
    }));
    const Fm$Parser$some = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $617 = Monad$bind$(Parser$monad)(Fm$Parser$text$("some("))((_$2 => {
            var $618 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$3 => {
                var $619 = Monad$bind$(Parser$monad)(Fm$Parser$text$(")"))((_$4 => {
                    var $620 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                        var _term$6 = Fm$Term$ref$("Maybe.some");
                        var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                        var _term$8 = Fm$Term$app$(_term$7, _expr$3);
                        var $621 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$8));
                        return $621;
                    }));
                    return $620;
                }));
                return $619;
            }));
            return $618;
        }));
        return $617;
    }));
    const Fm$Parser$apply = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $622 = Monad$bind$(Parser$monad)(Fm$Parser$text$("apply("))((_$2 => {
            var $623 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_func$3 => {
                var $624 = Monad$bind$(Parser$monad)(Fm$Parser$text$(","))((_$4 => {
                    var $625 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_equa$5 => {
                        var $626 = Monad$bind$(Parser$monad)(Fm$Parser$text$(")"))((_$6 => {
                            var $627 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                                var _term$8 = Fm$Term$ref$("Equal.apply");
                                var _term$9 = Fm$Term$app$(_term$8, Fm$Term$hol$(Bits$e));
                                var _term$10 = Fm$Term$app$(_term$9, Fm$Term$hol$(Bits$e));
                                var _term$11 = Fm$Term$app$(_term$10, Fm$Term$hol$(Bits$e));
                                var _term$12 = Fm$Term$app$(_term$11, Fm$Term$hol$(Bits$e));
                                var _term$13 = Fm$Term$app$(_term$12, _func$3);
                                var _term$14 = Fm$Term$app$(_term$13, _equa$5);
                                var $628 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$14));
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

    function Fm$Name$read$(_str$1) {
        var $629 = _str$1;
        return $629;
    };
    const Fm$Name$read = x0 => Fm$Name$read$(x0);
    const Fm$Parser$list = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $630 = Monad$bind$(Parser$monad)(Fm$Parser$text$("["))((_$2 => {
            var $631 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("]"), Fm$Parser$item$(Fm$Parser$term)))((_vals$3 => {
                var $632 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$4 => {
                    var $633 = Monad$pure$(Parser$monad)(List$fold$(_vals$3, Fm$Term$app$(Fm$Term$ref$(Fm$Name$read$("List.nil")), Fm$Term$hol$(Bits$e)), (_x$5 => _xs$6 => {
                        var _term$7 = Fm$Term$ref$(Fm$Name$read$("List.cons"));
                        var _term$8 = Fm$Term$app$(_term$7, Fm$Term$hol$(Bits$e));
                        var _term$9 = Fm$Term$app$(_term$8, _x$5);
                        var _term$10 = Fm$Term$app$(_term$9, _xs$6);
                        var $634 = Fm$Term$ori$(_orig$4, _term$10);
                        return $634;
                    })));
                    return $633;
                }));
                return $632;
            }));
            return $631;
        }));
        return $630;
    }));
    const Fm$Parser$log = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $635 = Monad$bind$(Parser$monad)(Fm$Parser$text$("log("))((_$2 => {
            var $636 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$(")"), Fm$Parser$item$(Fm$Parser$term)))((_strs$3 => {
                var $637 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_cont$4 => {
                    var _term$5 = Fm$Term$ref$("Debug.log");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$hol$(Bits$e));
                    var _args$7 = List$fold$(_strs$3, Fm$Term$ref$("String.nil"), (_x$7 => _xs$8 => {
                        var _arg$9 = Fm$Term$ref$("String.concat");
                        var _arg$10 = Fm$Term$app$(_arg$9, _x$7);
                        var _arg$11 = Fm$Term$app$(_arg$10, _xs$8);
                        var $639 = _arg$11;
                        return $639;
                    }));
                    var _term$8 = Fm$Term$app$(_term$6, _args$7);
                    var _term$9 = Fm$Term$app$(_term$8, Fm$Term$lam$("x", (_x$9 => {
                        var $640 = _cont$4;
                        return $640;
                    })));
                    var $638 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $641 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
                        return $641;
                    }));
                    return $638;
                }));
                return $637;
            }));
            return $636;
        }));
        return $635;
    }));
    const Fm$Parser$forin = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $642 = Monad$bind$(Parser$monad)(Fm$Parser$text$("for "))((_$2 => {
            var $643 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_elem$3 => {
                var $644 = Monad$bind$(Parser$monad)(Fm$Parser$text$("in"))((_$4 => {
                    var $645 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_list$5 => {
                        var $646 = Monad$bind$(Parser$monad)(Fm$Parser$text$("with"))((_$6 => {
                            var $647 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$7 => {
                                var $648 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$8 => {
                                    var $649 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_loop$9 => {
                                        var $650 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                                            var _term$11 = Fm$Term$ref$("List.for");
                                            var _term$12 = Fm$Term$app$(_term$11, Fm$Term$hol$(Bits$e));
                                            var _term$13 = Fm$Term$app$(_term$12, _list$5);
                                            var _term$14 = Fm$Term$app$(_term$13, Fm$Term$hol$(Bits$e));
                                            var _term$15 = Fm$Term$app$(_term$14, Fm$Term$ref$(_name$7));
                                            var _lamb$16 = Fm$Term$lam$(_elem$3, (_i$16 => {
                                                var $652 = Fm$Term$lam$(_name$7, (_x$17 => {
                                                    var $653 = _loop$9;
                                                    return $653;
                                                }));
                                                return $652;
                                            }));
                                            var _term$17 = Fm$Term$app$(_term$15, _lamb$16);
                                            var _term$18 = Fm$Term$let$(_name$7, _term$17, (_x$18 => {
                                                var $654 = Fm$Term$ref$(_name$7);
                                                return $654;
                                            }));
                                            var $651 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$18));
                                            return $651;
                                        }));
                                        return $650;
                                    }));
                                    return $649;
                                }));
                                return $648;
                            }));
                            return $647;
                        }));
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
    const Fm$Parser$forrange$u32 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $655 = Monad$bind$(Parser$monad)(Fm$Parser$text$("for "))((_$2 => {
            var $656 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_elem$3 => {
                var $657 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$4 => {
                    var $658 = Monad$bind$(Parser$monad)(Fm$Parser$text$("U32"))((_$5 => {
                        var $659 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$6 => {
                            var $660 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_idx0$7 => {
                                var $661 = Monad$bind$(Parser$monad)(Fm$Parser$text$(".."))((_$8 => {
                                    var $662 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_idx1$9 => {
                                        var $663 = Monad$bind$(Parser$monad)(Fm$Parser$text$("with"))((_$10 => {
                                            var $664 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$11 => {
                                                var $665 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$12 => {
                                                    var $666 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_loop$13 => {
                                                        var $667 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$14 => {
                                                            var _term$15 = Fm$Term$ref$("U32.for");
                                                            var _term$16 = Fm$Term$app$(_term$15, Fm$Term$hol$(Bits$e));
                                                            var _term$17 = Fm$Term$app$(_term$16, Fm$Term$ref$(_name$11));
                                                            var _term$18 = Fm$Term$app$(_term$17, _idx0$7);
                                                            var _term$19 = Fm$Term$app$(_term$18, _idx1$9);
                                                            var _lamb$20 = Fm$Term$lam$(_elem$3, (_e$20 => {
                                                                var $669 = Fm$Term$lam$(_name$11, (_s$21 => {
                                                                    var $670 = _loop$13;
                                                                    return $670;
                                                                }));
                                                                return $669;
                                                            }));
                                                            var _term$21 = Fm$Term$app$(_term$19, _lamb$20);
                                                            var _term$22 = Fm$Term$let$(_name$11, _term$21, (_x$22 => {
                                                                var $671 = Fm$Term$ref$(_name$11);
                                                                return $671;
                                                            }));
                                                            var $668 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$14, _term$22));
                                                            return $668;
                                                        }));
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
                        }));
                        return $659;
                    }));
                    return $658;
                }));
                return $657;
            }));
            return $656;
        }));
        return $655;
    }));
    const Fm$Parser$forin2 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $672 = Monad$bind$(Parser$monad)(Fm$Parser$text$("for "))((_$2 => {
            var $673 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_elem$3 => {
                var $674 = Monad$bind$(Parser$monad)(Fm$Parser$text$("in"))((_$4 => {
                    var $675 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_list$5 => {
                        var $676 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$6 => {
                            var $677 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$7 => {
                                var $678 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$8 => {
                                    var $679 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_loop$9 => {
                                        var $680 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$10 => {
                                            var $681 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$11 => {
                                                var $682 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$12 => {
                                                    var _term$13 = Fm$Term$ref$("List.for");
                                                    var _term$14 = Fm$Term$app$(_term$13, Fm$Term$hol$(Bits$e));
                                                    var _term$15 = Fm$Term$app$(_term$14, _list$5);
                                                    var _term$16 = Fm$Term$app$(_term$15, Fm$Term$hol$(Bits$e));
                                                    var _term$17 = Fm$Term$app$(_term$16, Fm$Term$ref$(_name$7));
                                                    var _lamb$18 = Fm$Term$lam$(_elem$3, (_i$18 => {
                                                        var $684 = Fm$Term$lam$(_name$7, (_x$19 => {
                                                            var $685 = _loop$9;
                                                            return $685;
                                                        }));
                                                        return $684;
                                                    }));
                                                    var _term$19 = Fm$Term$app$(_term$17, _lamb$18);
                                                    var _term$20 = Fm$Term$let$(_name$7, _term$19, (_x$20 => {
                                                        var $686 = _body$11;
                                                        return $686;
                                                    }));
                                                    var $683 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$12, _term$20));
                                                    return $683;
                                                }));
                                                return $682;
                                            }));
                                            return $681;
                                        }));
                                        return $680;
                                    }));
                                    return $679;
                                }));
                                return $678;
                            }));
                            return $677;
                        }));
                        return $676;
                    }));
                    return $675;
                }));
                return $674;
            }));
            return $673;
        }));
        return $672;
    }));

    function Fm$Parser$do$statements$(_monad_name$1) {
        var $687 = Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $688 = Monad$bind$(Parser$monad)(Fm$Parser$text$("var "))((_$3 => {
                var $689 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
                    var $690 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$5 => {
                        var $691 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$6 => {
                            var $692 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$7 => {
                                var $693 = Monad$bind$(Parser$monad)(Fm$Parser$do$statements$(_monad_name$1))((_body$8 => {
                                    var $694 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$2))((_orig$9 => {
                                        var _term$10 = Fm$Term$app$(Fm$Term$ref$("Monad.bind"), Fm$Term$ref$(_monad_name$1));
                                        var _term$11 = Fm$Term$app$(_term$10, Fm$Term$ref$((_monad_name$1 + ".monad")));
                                        var _term$12 = Fm$Term$app$(_term$11, Fm$Term$hol$(Bits$e));
                                        var _term$13 = Fm$Term$app$(_term$12, Fm$Term$hol$(Bits$e));
                                        var _term$14 = Fm$Term$app$(_term$13, _expr$6);
                                        var _term$15 = Fm$Term$app$(_term$14, Fm$Term$lam$(_name$4, (_x$15 => {
                                            var $696 = _body$8;
                                            return $696;
                                        })));
                                        var $695 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$9, _term$15));
                                        return $695;
                                    }));
                                    return $694;
                                }));
                                return $693;
                            }));
                            return $692;
                        }));
                        return $691;
                    }));
                    return $690;
                }));
                return $689;
            }));
            return $688;
        })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $697 = Monad$bind$(Parser$monad)(Fm$Parser$text$("let "))((_$3 => {
                var $698 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
                    var $699 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$5 => {
                        var $700 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$6 => {
                            var $701 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$7 => {
                                var $702 = Monad$bind$(Parser$monad)(Fm$Parser$do$statements$(_monad_name$1))((_body$8 => {
                                    var $703 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$2))((_orig$9 => {
                                        var $704 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$9, Fm$Term$let$(_name$4, _expr$6, (_x$10 => {
                                            var $705 = _body$8;
                                            return $705;
                                        }))));
                                        return $704;
                                    }));
                                    return $703;
                                }));
                                return $702;
                            }));
                            return $701;
                        }));
                        return $700;
                    }));
                    return $699;
                }));
                return $698;
            }));
            return $697;
        })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $706 = Monad$bind$(Parser$monad)(Fm$Parser$text$("return "))((_$3 => {
                var $707 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$4 => {
                    var $708 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$5 => {
                        var $709 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$2))((_orig$6 => {
                            var _term$7 = Fm$Term$app$(Fm$Term$ref$("Monad.pure"), Fm$Term$ref$(_monad_name$1));
                            var _term$8 = Fm$Term$app$(_term$7, Fm$Term$ref$((_monad_name$1 + ".monad")));
                            var _term$9 = Fm$Term$app$(_term$8, Fm$Term$hol$(Bits$e));
                            var _term$10 = Fm$Term$app$(_term$9, _expr$4);
                            var $710 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, _term$10));
                            return $710;
                        }));
                        return $709;
                    }));
                    return $708;
                }));
                return $707;
            }));
            return $706;
        })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $711 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$3 => {
                var $712 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$4 => {
                    var $713 = Monad$bind$(Parser$monad)(Fm$Parser$do$statements$(_monad_name$1))((_body$5 => {
                        var $714 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$2))((_orig$6 => {
                            var _term$7 = Fm$Term$app$(Fm$Term$ref$("Monad.bind"), Fm$Term$ref$(_monad_name$1));
                            var _term$8 = Fm$Term$app$(_term$7, Fm$Term$ref$((_monad_name$1 + ".monad")));
                            var _term$9 = Fm$Term$app$(_term$8, Fm$Term$hol$(Bits$e));
                            var _term$10 = Fm$Term$app$(_term$9, Fm$Term$hol$(Bits$e));
                            var _term$11 = Fm$Term$app$(_term$10, _expr$3);
                            var _term$12 = Fm$Term$app$(_term$11, Fm$Term$lam$("", (_x$12 => {
                                var $716 = _body$5;
                                return $716;
                            })));
                            var $715 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, _term$12));
                            return $715;
                        }));
                        return $714;
                    }));
                    return $713;
                }));
                return $712;
            }));
            return $711;
        })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$2 => {
            var $717 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$3 => {
                var $718 = Monad$pure$(Parser$monad)(_expr$2);
                return $718;
            }));
            return $717;
        })), List$nil))))));
        return $687;
    };
    const Fm$Parser$do$statements = x0 => Fm$Parser$do$statements$(x0);
    const Fm$Parser$do = Monad$bind$(Parser$monad)(Fm$Parser$text$("do "))((_$1 => {
        var $719 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $720 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$3 => {
                var $721 = Monad$bind$(Parser$monad)(Fm$Parser$do$statements$(_name$2))((_term$4 => {
                    var $722 = Monad$bind$(Parser$monad)(Fm$Parser$text$("}"))((_$5 => {
                        var $723 = Monad$pure$(Parser$monad)(_term$4);
                        return $723;
                    }));
                    return $722;
                }));
                return $721;
            }));
            return $720;
        }));
        return $719;
    }));

    function Fm$Term$nat$(_natx$1) {
        var $724 = ({
            _: 'Fm.Term.nat',
            'natx': _natx$1
        });
        return $724;
    };
    const Fm$Term$nat = x0 => Fm$Term$nat$(x0);

    function Fm$Term$unroll_nat$(_natx$1) {
        var self = _natx$1;
        if (self === 0n) {
            var $726 = Fm$Term$ref$(Fm$Name$read$("Nat.zero"));
            var $725 = $726;
        } else {
            var $727 = (self - 1n);
            var _func$3 = Fm$Term$ref$(Fm$Name$read$("Nat.succ"));
            var _argm$4 = Fm$Term$nat$($727);
            var $728 = Fm$Term$app$(_func$3, _argm$4);
            var $725 = $728;
        };
        return $725;
    };
    const Fm$Term$unroll_nat = x0 => Fm$Term$unroll_nat$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function Fm$Term$unroll_chr$bits$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $730 = Fm$Term$ref$(Fm$Name$read$("Bits.e"));
                var $729 = $730;
                break;
            case 'o':
                var $731 = self.slice(0, -1);
                var $732 = Fm$Term$app$(Fm$Term$ref$(Fm$Name$read$("Bits.o")), Fm$Term$unroll_chr$bits$($731));
                var $729 = $732;
                break;
            case 'i':
                var $733 = self.slice(0, -1);
                var $734 = Fm$Term$app$(Fm$Term$ref$(Fm$Name$read$("Bits.i")), Fm$Term$unroll_chr$bits$($733));
                var $729 = $734;
                break;
        };
        return $729;
    };
    const Fm$Term$unroll_chr$bits = x0 => Fm$Term$unroll_chr$bits$(x0);

    function Fm$Term$unroll_chr$(_chrx$1) {
        var _bits$2 = (u16_to_bits(_chrx$1));
        var _term$3 = Fm$Term$ref$(Fm$Name$read$("Word.from_bits"));
        var _term$4 = Fm$Term$app$(_term$3, Fm$Term$nat$(16n));
        var _term$5 = Fm$Term$app$(_term$4, Fm$Term$unroll_chr$bits$(_bits$2));
        var _term$6 = Fm$Term$app$(Fm$Term$ref$(Fm$Name$read$("U16.new")), _term$5);
        var $735 = _term$6;
        return $735;
    };
    const Fm$Term$unroll_chr = x0 => Fm$Term$unroll_chr$(x0);

    function Fm$Term$unroll_str$(_strx$1) {
        var self = _strx$1;
        if (self.length === 0) {
            var $737 = Fm$Term$ref$(Fm$Name$read$("String.nil"));
            var $736 = $737;
        } else {
            var $738 = self.charCodeAt(0);
            var $739 = self.slice(1);
            var _char$4 = Fm$Term$chr$($738);
            var _term$5 = Fm$Term$ref$(Fm$Name$read$("String.cons"));
            var _term$6 = Fm$Term$app$(_term$5, _char$4);
            var _term$7 = Fm$Term$app$(_term$6, Fm$Term$str$($739));
            var $740 = _term$7;
            var $736 = $740;
        };
        return $736;
    };
    const Fm$Term$unroll_str = x0 => Fm$Term$unroll_str$(x0);

    function Fm$Term$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $742 = self.name;
                var $743 = self.indx;
                var $744 = _term$1;
                var $741 = $744;
                break;
            case 'Fm.Term.ref':
                var $745 = self.name;
                var self = Fm$get$($745, _defs$2);
                switch (self._) {
                    case 'Maybe.none':
                        var $747 = Fm$Term$ref$($745);
                        var $746 = $747;
                        break;
                    case 'Maybe.some':
                        var $748 = self.value;
                        var self = $748;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $750 = self.file;
                                var $751 = self.code;
                                var $752 = self.name;
                                var $753 = self.term;
                                var $754 = self.type;
                                var $755 = self.stat;
                                var $756 = Fm$Term$reduce$($753, _defs$2);
                                var $749 = $756;
                                break;
                        };
                        var $746 = $749;
                        break;
                };
                var $741 = $746;
                break;
            case 'Fm.Term.typ':
                var $757 = _term$1;
                var $741 = $757;
                break;
            case 'Fm.Term.all':
                var $758 = self.eras;
                var $759 = self.self;
                var $760 = self.name;
                var $761 = self.xtyp;
                var $762 = self.body;
                var $763 = _term$1;
                var $741 = $763;
                break;
            case 'Fm.Term.lam':
                var $764 = self.name;
                var $765 = self.body;
                var $766 = _term$1;
                var $741 = $766;
                break;
            case 'Fm.Term.app':
                var $767 = self.func;
                var $768 = self.argm;
                var _func$5 = Fm$Term$reduce$($767, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $770 = self.name;
                        var $771 = self.indx;
                        var $772 = _term$1;
                        var $769 = $772;
                        break;
                    case 'Fm.Term.ref':
                        var $773 = self.name;
                        var $774 = _term$1;
                        var $769 = $774;
                        break;
                    case 'Fm.Term.typ':
                        var $775 = _term$1;
                        var $769 = $775;
                        break;
                    case 'Fm.Term.all':
                        var $776 = self.eras;
                        var $777 = self.self;
                        var $778 = self.name;
                        var $779 = self.xtyp;
                        var $780 = self.body;
                        var $781 = _term$1;
                        var $769 = $781;
                        break;
                    case 'Fm.Term.lam':
                        var $782 = self.name;
                        var $783 = self.body;
                        var $784 = Fm$Term$reduce$($783($768), _defs$2);
                        var $769 = $784;
                        break;
                    case 'Fm.Term.app':
                        var $785 = self.func;
                        var $786 = self.argm;
                        var $787 = _term$1;
                        var $769 = $787;
                        break;
                    case 'Fm.Term.let':
                        var $788 = self.name;
                        var $789 = self.expr;
                        var $790 = self.body;
                        var $791 = _term$1;
                        var $769 = $791;
                        break;
                    case 'Fm.Term.def':
                        var $792 = self.name;
                        var $793 = self.expr;
                        var $794 = self.body;
                        var $795 = _term$1;
                        var $769 = $795;
                        break;
                    case 'Fm.Term.ann':
                        var $796 = self.done;
                        var $797 = self.term;
                        var $798 = self.type;
                        var $799 = _term$1;
                        var $769 = $799;
                        break;
                    case 'Fm.Term.gol':
                        var $800 = self.name;
                        var $801 = self.dref;
                        var $802 = self.verb;
                        var $803 = _term$1;
                        var $769 = $803;
                        break;
                    case 'Fm.Term.hol':
                        var $804 = self.path;
                        var $805 = _term$1;
                        var $769 = $805;
                        break;
                    case 'Fm.Term.nat':
                        var $806 = self.natx;
                        var $807 = _term$1;
                        var $769 = $807;
                        break;
                    case 'Fm.Term.chr':
                        var $808 = self.chrx;
                        var $809 = _term$1;
                        var $769 = $809;
                        break;
                    case 'Fm.Term.str':
                        var $810 = self.strx;
                        var $811 = _term$1;
                        var $769 = $811;
                        break;
                    case 'Fm.Term.cse':
                        var $812 = self.path;
                        var $813 = self.expr;
                        var $814 = self.name;
                        var $815 = self.with;
                        var $816 = self.cses;
                        var $817 = self.moti;
                        var $818 = _term$1;
                        var $769 = $818;
                        break;
                    case 'Fm.Term.ori':
                        var $819 = self.orig;
                        var $820 = self.expr;
                        var $821 = _term$1;
                        var $769 = $821;
                        break;
                };
                var $741 = $769;
                break;
            case 'Fm.Term.let':
                var $822 = self.name;
                var $823 = self.expr;
                var $824 = self.body;
                var $825 = Fm$Term$reduce$($824($823), _defs$2);
                var $741 = $825;
                break;
            case 'Fm.Term.def':
                var $826 = self.name;
                var $827 = self.expr;
                var $828 = self.body;
                var $829 = Fm$Term$reduce$($828($827), _defs$2);
                var $741 = $829;
                break;
            case 'Fm.Term.ann':
                var $830 = self.done;
                var $831 = self.term;
                var $832 = self.type;
                var $833 = Fm$Term$reduce$($831, _defs$2);
                var $741 = $833;
                break;
            case 'Fm.Term.gol':
                var $834 = self.name;
                var $835 = self.dref;
                var $836 = self.verb;
                var $837 = _term$1;
                var $741 = $837;
                break;
            case 'Fm.Term.hol':
                var $838 = self.path;
                var $839 = _term$1;
                var $741 = $839;
                break;
            case 'Fm.Term.nat':
                var $840 = self.natx;
                var $841 = Fm$Term$reduce$(Fm$Term$unroll_nat$($840), _defs$2);
                var $741 = $841;
                break;
            case 'Fm.Term.chr':
                var $842 = self.chrx;
                var $843 = Fm$Term$reduce$(Fm$Term$unroll_chr$($842), _defs$2);
                var $741 = $843;
                break;
            case 'Fm.Term.str':
                var $844 = self.strx;
                var $845 = Fm$Term$reduce$(Fm$Term$unroll_str$($844), _defs$2);
                var $741 = $845;
                break;
            case 'Fm.Term.cse':
                var $846 = self.path;
                var $847 = self.expr;
                var $848 = self.name;
                var $849 = self.with;
                var $850 = self.cses;
                var $851 = self.moti;
                var $852 = _term$1;
                var $741 = $852;
                break;
            case 'Fm.Term.ori':
                var $853 = self.orig;
                var $854 = self.expr;
                var $855 = Fm$Term$reduce$($854, _defs$2);
                var $741 = $855;
                break;
        };
        return $741;
    };
    const Fm$Term$reduce = x0 => x1 => Fm$Term$reduce$(x0, x1);
    const Map$new = ({
        _: 'Map.new'
    });

    function Fm$Def$new$(_file$1, _code$2, _name$3, _term$4, _type$5, _stat$6) {
        var $856 = ({
            _: 'Fm.Def.new',
            'file': _file$1,
            'code': _code$2,
            'name': _name$3,
            'term': _term$4,
            'type': _type$5,
            'stat': _stat$6
        });
        return $856;
    };
    const Fm$Def$new = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Def$new$(x0, x1, x2, x3, x4, x5);
    const Fm$Status$init = ({
        _: 'Fm.Status.init'
    });
    const Fm$Parser$case$with = Monad$bind$(Parser$monad)(Fm$Parser$text$("with"))((_$1 => {
        var $857 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $858 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$3 => {
                var $859 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$4 => {
                    var $860 = Monad$bind$(Parser$monad)(Fm$Parser$text$("="))((_$5 => {
                        var $861 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$6 => {
                            var $862 = Monad$pure$(Parser$monad)(Fm$Def$new$("", "", _name$2, _term$6, _type$4, Fm$Status$init));
                            return $862;
                        }));
                        return $861;
                    }));
                    return $860;
                }));
                return $859;
            }));
            return $858;
        }));
        return $857;
    }));
    const Fm$Parser$case$case = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$1 => {
        var $863 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$2 => {
            var $864 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$3 => {
                var $865 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(",")))((_$4 => {
                    var $866 = Monad$pure$(Parser$monad)(Pair$new$(_name$1, _term$3));
                    return $866;
                }));
                return $865;
            }));
            return $864;
        }));
        return $863;
    }));

    function Map$tie$(_val$2, _lft$3, _rgt$4) {
        var $867 = ({
            _: 'Map.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $867;
    };
    const Map$tie = x0 => x1 => x2 => Map$tie$(x0, x1, x2);

    function Map$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'Map.new':
                        var $870 = Map$tie$(Maybe$some$(_val$3), Map$new, Map$new);
                        var $869 = $870;
                        break;
                    case 'Map.tie':
                        var $871 = self.val;
                        var $872 = self.lft;
                        var $873 = self.rgt;
                        var $874 = Map$tie$(Maybe$some$(_val$3), $872, $873);
                        var $869 = $874;
                        break;
                };
                var $868 = $869;
                break;
            case 'o':
                var $875 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.new':
                        var $877 = Map$tie$(Maybe$none, Map$set$($875, _val$3, Map$new), Map$new);
                        var $876 = $877;
                        break;
                    case 'Map.tie':
                        var $878 = self.val;
                        var $879 = self.lft;
                        var $880 = self.rgt;
                        var $881 = Map$tie$($878, Map$set$($875, _val$3, $879), $880);
                        var $876 = $881;
                        break;
                };
                var $868 = $876;
                break;
            case 'i':
                var $882 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.new':
                        var $884 = Map$tie$(Maybe$none, Map$new, Map$set$($882, _val$3, Map$new));
                        var $883 = $884;
                        break;
                    case 'Map.tie':
                        var $885 = self.val;
                        var $886 = self.lft;
                        var $887 = self.rgt;
                        var $888 = Map$tie$($885, $886, Map$set$($882, _val$3, $887));
                        var $883 = $888;
                        break;
                };
                var $868 = $883;
                break;
        };
        return $868;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Map$from_list$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.nil':
                var $890 = Map$new;
                var $889 = $890;
                break;
            case 'List.cons':
                var $891 = self.head;
                var $892 = self.tail;
                var self = $891;
                switch (self._) {
                    case 'Pair.new':
                        var $894 = self.fst;
                        var $895 = self.snd;
                        var $896 = Map$set$(_f$3($894), $895, Map$from_list$(_f$3, $892));
                        var $893 = $896;
                        break;
                };
                var $889 = $893;
                break;
        };
        return $889;
    };
    const Map$from_list = x0 => x1 => Map$from_list$(x0, x1);

    function Fm$Term$cse$(_path$1, _expr$2, _name$3, _with$4, _cses$5, _moti$6) {
        var $897 = ({
            _: 'Fm.Term.cse',
            'path': _path$1,
            'expr': _expr$2,
            'name': _name$3,
            'with': _with$4,
            'cses': _cses$5,
            'moti': _moti$6
        });
        return $897;
    };
    const Fm$Term$cse = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Term$cse$(x0, x1, x2, x3, x4, x5);
    const Fm$Parser$case = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $898 = Monad$bind$(Parser$monad)(Fm$Parser$text$("case "))((_$2 => {
            var $899 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$3 => {
                var $900 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$4 => {
                    var $901 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("as"))((_$5 => {
                        var $902 = Fm$Parser$name1;
                        return $902;
                    }))))((_name$5 => {
                        var self = _name$5;
                        switch (self._) {
                            case 'Maybe.none':
                                var self = Fm$Term$reduce$(_expr$4, Map$new);
                                switch (self._) {
                                    case 'Fm.Term.var':
                                        var $905 = self.name;
                                        var $906 = self.indx;
                                        var $907 = $905;
                                        var $904 = $907;
                                        break;
                                    case 'Fm.Term.ref':
                                        var $908 = self.name;
                                        var $909 = $908;
                                        var $904 = $909;
                                        break;
                                    case 'Fm.Term.typ':
                                        var $910 = Fm$Name$read$("self");
                                        var $904 = $910;
                                        break;
                                    case 'Fm.Term.all':
                                        var $911 = self.eras;
                                        var $912 = self.self;
                                        var $913 = self.name;
                                        var $914 = self.xtyp;
                                        var $915 = self.body;
                                        var $916 = Fm$Name$read$("self");
                                        var $904 = $916;
                                        break;
                                    case 'Fm.Term.lam':
                                        var $917 = self.name;
                                        var $918 = self.body;
                                        var $919 = Fm$Name$read$("self");
                                        var $904 = $919;
                                        break;
                                    case 'Fm.Term.app':
                                        var $920 = self.func;
                                        var $921 = self.argm;
                                        var $922 = Fm$Name$read$("self");
                                        var $904 = $922;
                                        break;
                                    case 'Fm.Term.let':
                                        var $923 = self.name;
                                        var $924 = self.expr;
                                        var $925 = self.body;
                                        var $926 = Fm$Name$read$("self");
                                        var $904 = $926;
                                        break;
                                    case 'Fm.Term.def':
                                        var $927 = self.name;
                                        var $928 = self.expr;
                                        var $929 = self.body;
                                        var $930 = Fm$Name$read$("self");
                                        var $904 = $930;
                                        break;
                                    case 'Fm.Term.ann':
                                        var $931 = self.done;
                                        var $932 = self.term;
                                        var $933 = self.type;
                                        var $934 = Fm$Name$read$("self");
                                        var $904 = $934;
                                        break;
                                    case 'Fm.Term.gol':
                                        var $935 = self.name;
                                        var $936 = self.dref;
                                        var $937 = self.verb;
                                        var $938 = Fm$Name$read$("self");
                                        var $904 = $938;
                                        break;
                                    case 'Fm.Term.hol':
                                        var $939 = self.path;
                                        var $940 = Fm$Name$read$("self");
                                        var $904 = $940;
                                        break;
                                    case 'Fm.Term.nat':
                                        var $941 = self.natx;
                                        var $942 = Fm$Name$read$("self");
                                        var $904 = $942;
                                        break;
                                    case 'Fm.Term.chr':
                                        var $943 = self.chrx;
                                        var $944 = Fm$Name$read$("self");
                                        var $904 = $944;
                                        break;
                                    case 'Fm.Term.str':
                                        var $945 = self.strx;
                                        var $946 = Fm$Name$read$("self");
                                        var $904 = $946;
                                        break;
                                    case 'Fm.Term.cse':
                                        var $947 = self.path;
                                        var $948 = self.expr;
                                        var $949 = self.name;
                                        var $950 = self.with;
                                        var $951 = self.cses;
                                        var $952 = self.moti;
                                        var $953 = Fm$Name$read$("self");
                                        var $904 = $953;
                                        break;
                                    case 'Fm.Term.ori':
                                        var $954 = self.orig;
                                        var $955 = self.expr;
                                        var $956 = Fm$Name$read$("self");
                                        var $904 = $956;
                                        break;
                                };
                                var _name$6 = $904;
                                break;
                            case 'Maybe.some':
                                var $957 = self.value;
                                var $958 = $957;
                                var _name$6 = $958;
                                break;
                        };
                        var $903 = Monad$bind$(Parser$monad)(Parser$many$(Fm$Parser$case$with))((_wyth$7 => {
                            var $959 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$8 => {
                                var $960 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("}"), Fm$Parser$case$case))((_cses$9 => {
                                    var _cses$10 = Map$from_list$(Fm$Name$to_bits, _cses$9);
                                    var $961 = Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$11 => {
                                        var $962 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$12 => {
                                            var $963 = Monad$pure$(Parser$monad)(Maybe$some$(_term$12));
                                            return $963;
                                        }));
                                        return $962;
                                    })), List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$("!"))((_$11 => {
                                        var $964 = Monad$pure$(Parser$monad)(Maybe$none);
                                        return $964;
                                    })), List$cons$(Monad$pure$(Parser$monad)(Maybe$some$(Fm$Term$hol$(Bits$e))), List$nil)))))((_moti$11 => {
                                        var $965 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$12 => {
                                            var $966 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$12, Fm$Term$cse$(Bits$e, _expr$4, _name$6, _wyth$7, _cses$10, _moti$11)));
                                            return $966;
                                        }));
                                        return $965;
                                    }));
                                    return $961;
                                }));
                                return $960;
                            }));
                            return $959;
                        }));
                        return $903;
                    }));
                    return $901;
                }));
                return $900;
            }));
            return $899;
        }));
        return $898;
    }));
    const Fm$Parser$open = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $967 = Monad$bind$(Parser$monad)(Fm$Parser$text$("open "))((_$2 => {
            var $968 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$3 => {
                var $969 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_expr$4 => {
                    var $970 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("as"))((_$5 => {
                        var $971 = Fm$Parser$name1;
                        return $971;
                    }))))((_name$5 => {
                        var $972 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$text$(";")))((_$6 => {
                            var self = _name$5;
                            switch (self._) {
                                case 'Maybe.none':
                                    var self = Fm$Term$reduce$(_expr$4, Map$new);
                                    switch (self._) {
                                        case 'Fm.Term.var':
                                            var $975 = self.name;
                                            var $976 = self.indx;
                                            var $977 = $975;
                                            var $974 = $977;
                                            break;
                                        case 'Fm.Term.ref':
                                            var $978 = self.name;
                                            var $979 = $978;
                                            var $974 = $979;
                                            break;
                                        case 'Fm.Term.typ':
                                            var $980 = Fm$Name$read$("self");
                                            var $974 = $980;
                                            break;
                                        case 'Fm.Term.all':
                                            var $981 = self.eras;
                                            var $982 = self.self;
                                            var $983 = self.name;
                                            var $984 = self.xtyp;
                                            var $985 = self.body;
                                            var $986 = Fm$Name$read$("self");
                                            var $974 = $986;
                                            break;
                                        case 'Fm.Term.lam':
                                            var $987 = self.name;
                                            var $988 = self.body;
                                            var $989 = Fm$Name$read$("self");
                                            var $974 = $989;
                                            break;
                                        case 'Fm.Term.app':
                                            var $990 = self.func;
                                            var $991 = self.argm;
                                            var $992 = Fm$Name$read$("self");
                                            var $974 = $992;
                                            break;
                                        case 'Fm.Term.let':
                                            var $993 = self.name;
                                            var $994 = self.expr;
                                            var $995 = self.body;
                                            var $996 = Fm$Name$read$("self");
                                            var $974 = $996;
                                            break;
                                        case 'Fm.Term.def':
                                            var $997 = self.name;
                                            var $998 = self.expr;
                                            var $999 = self.body;
                                            var $1000 = Fm$Name$read$("self");
                                            var $974 = $1000;
                                            break;
                                        case 'Fm.Term.ann':
                                            var $1001 = self.done;
                                            var $1002 = self.term;
                                            var $1003 = self.type;
                                            var $1004 = Fm$Name$read$("self");
                                            var $974 = $1004;
                                            break;
                                        case 'Fm.Term.gol':
                                            var $1005 = self.name;
                                            var $1006 = self.dref;
                                            var $1007 = self.verb;
                                            var $1008 = Fm$Name$read$("self");
                                            var $974 = $1008;
                                            break;
                                        case 'Fm.Term.hol':
                                            var $1009 = self.path;
                                            var $1010 = Fm$Name$read$("self");
                                            var $974 = $1010;
                                            break;
                                        case 'Fm.Term.nat':
                                            var $1011 = self.natx;
                                            var $1012 = Fm$Name$read$("self");
                                            var $974 = $1012;
                                            break;
                                        case 'Fm.Term.chr':
                                            var $1013 = self.chrx;
                                            var $1014 = Fm$Name$read$("self");
                                            var $974 = $1014;
                                            break;
                                        case 'Fm.Term.str':
                                            var $1015 = self.strx;
                                            var $1016 = Fm$Name$read$("self");
                                            var $974 = $1016;
                                            break;
                                        case 'Fm.Term.cse':
                                            var $1017 = self.path;
                                            var $1018 = self.expr;
                                            var $1019 = self.name;
                                            var $1020 = self.with;
                                            var $1021 = self.cses;
                                            var $1022 = self.moti;
                                            var $1023 = Fm$Name$read$("self");
                                            var $974 = $1023;
                                            break;
                                        case 'Fm.Term.ori':
                                            var $1024 = self.orig;
                                            var $1025 = self.expr;
                                            var $1026 = Fm$Name$read$("self");
                                            var $974 = $1026;
                                            break;
                                    };
                                    var _name$7 = $974;
                                    break;
                                case 'Maybe.some':
                                    var $1027 = self.value;
                                    var $1028 = $1027;
                                    var _name$7 = $1028;
                                    break;
                            };
                            var _wyth$8 = List$nil;
                            var $973 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_rest$9 => {
                                var _cses$10 = Map$from_list$(Fm$Name$to_bits, List$cons$(Pair$new$("_", _rest$9), List$nil));
                                var _moti$11 = Maybe$some$(Fm$Term$hol$(Bits$e));
                                var $1029 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$12 => {
                                    var $1030 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$12, Fm$Term$cse$(Bits$e, _expr$4, _name$7, _wyth$8, _cses$10, _moti$11)));
                                    return $1030;
                                }));
                                return $1029;
                            }));
                            return $973;
                        }));
                        return $972;
                    }));
                    return $970;
                }));
                return $969;
            }));
            return $968;
        }));
        return $967;
    }));

    function Parser$digit$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $1032 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
            var $1031 = $1032;
        } else {
            var $1033 = self.charCodeAt(0);
            var $1034 = self.slice(1);
            var _sidx$5 = Nat$succ$(_idx$1);
            var self = ($1033 === 48);
            if (self) {
                var $1036 = Parser$Reply$value$(_sidx$5, $1034, 0n);
                var $1035 = $1036;
            } else {
                var self = ($1033 === 49);
                if (self) {
                    var $1038 = Parser$Reply$value$(_sidx$5, $1034, 1n);
                    var $1037 = $1038;
                } else {
                    var self = ($1033 === 50);
                    if (self) {
                        var $1040 = Parser$Reply$value$(_sidx$5, $1034, 2n);
                        var $1039 = $1040;
                    } else {
                        var self = ($1033 === 51);
                        if (self) {
                            var $1042 = Parser$Reply$value$(_sidx$5, $1034, 3n);
                            var $1041 = $1042;
                        } else {
                            var self = ($1033 === 52);
                            if (self) {
                                var $1044 = Parser$Reply$value$(_sidx$5, $1034, 4n);
                                var $1043 = $1044;
                            } else {
                                var self = ($1033 === 53);
                                if (self) {
                                    var $1046 = Parser$Reply$value$(_sidx$5, $1034, 5n);
                                    var $1045 = $1046;
                                } else {
                                    var self = ($1033 === 54);
                                    if (self) {
                                        var $1048 = Parser$Reply$value$(_sidx$5, $1034, 6n);
                                        var $1047 = $1048;
                                    } else {
                                        var self = ($1033 === 55);
                                        if (self) {
                                            var $1050 = Parser$Reply$value$(_sidx$5, $1034, 7n);
                                            var $1049 = $1050;
                                        } else {
                                            var self = ($1033 === 56);
                                            if (self) {
                                                var $1052 = Parser$Reply$value$(_sidx$5, $1034, 8n);
                                                var $1051 = $1052;
                                            } else {
                                                var self = ($1033 === 57);
                                                if (self) {
                                                    var $1054 = Parser$Reply$value$(_sidx$5, $1034, 9n);
                                                    var $1053 = $1054;
                                                } else {
                                                    var $1055 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
                                                    var $1053 = $1055;
                                                };
                                                var $1051 = $1053;
                                            };
                                            var $1049 = $1051;
                                        };
                                        var $1047 = $1049;
                                    };
                                    var $1045 = $1047;
                                };
                                var $1043 = $1045;
                            };
                            var $1041 = $1043;
                        };
                        var $1039 = $1041;
                    };
                    var $1037 = $1039;
                };
                var $1035 = $1037;
            };
            var $1031 = $1035;
        };
        return $1031;
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
                        var $1056 = _res$4;
                        return $1056;
                    case 'List.cons':
                        var $1057 = self.head;
                        var $1058 = self.tail;
                        var $1059 = Nat$from_base$go$(_b$1, $1058, (_b$1 * _p$3), (($1057 * _p$3) + _res$4));
                        return $1059;
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
                        var $1060 = _res$3;
                        return $1060;
                    case 'List.cons':
                        var $1061 = self.head;
                        var $1062 = self.tail;
                        var $1063 = List$reverse$go$($1062, List$cons$($1061, _res$3));
                        return $1063;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $1064 = List$reverse$go$(_xs$2, List$nil);
        return $1064;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Nat$from_base$(_base$1, _ds$2) {
        var $1065 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1065;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);
    const Parser$nat = Monad$bind$(Parser$monad)(Parser$many1$(Parser$digit))((_digits$1 => {
        var $1066 = Monad$pure$(Parser$monad)(Nat$from_base$(10n, _digits$1));
        return $1066;
    }));

    function Bits$tail$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $1068 = Bits$e;
                var $1067 = $1068;
                break;
            case 'o':
                var $1069 = self.slice(0, -1);
                var $1070 = $1069;
                var $1067 = $1070;
                break;
            case 'i':
                var $1071 = self.slice(0, -1);
                var $1072 = $1071;
                var $1067 = $1072;
                break;
        };
        return $1067;
    };
    const Bits$tail = x0 => Bits$tail$(x0);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $1074 = (Bits$e + '1');
                var $1073 = $1074;
                break;
            case 'o':
                var $1075 = self.slice(0, -1);
                var $1076 = ($1075 + '1');
                var $1073 = $1076;
                break;
            case 'i':
                var $1077 = self.slice(0, -1);
                var $1078 = (Bits$inc$($1077) + '0');
                var $1073 = $1078;
                break;
        };
        return $1073;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function Maybe$to_bool$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1080 = Bool$false;
                var $1079 = $1080;
                break;
            case 'Maybe.some':
                var $1081 = self.value;
                var $1082 = Bool$true;
                var $1079 = $1082;
                break;
        };
        return $1079;
    };
    const Maybe$to_bool = x0 => Maybe$to_bool$(x0);

    function Fm$Term$gol$(_name$1, _dref$2, _verb$3) {
        var $1083 = ({
            _: 'Fm.Term.gol',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3
        });
        return $1083;
    };
    const Fm$Term$gol = x0 => x1 => x2 => Fm$Term$gol$(x0, x1, x2);
    const Fm$Parser$goal = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1084 = Monad$bind$(Parser$monad)(Fm$Parser$text$("?"))((_$2 => {
            var $1085 = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$3 => {
                var $1086 = Monad$bind$(Parser$monad)(Parser$many$(Monad$bind$(Parser$monad)(Fm$Parser$text$("-"))((_$4 => {
                    var $1087 = Monad$bind$(Parser$monad)(Parser$nat)((_nat$5 => {
                        var _bits$6 = Bits$reverse$(Bits$tail$(Bits$reverse$((nat_to_bits(_nat$5)))));
                        var $1088 = Monad$pure$(Parser$monad)(_bits$6);
                        return $1088;
                    }));
                    return $1087;
                }))))((_dref$4 => {
                    var $1089 = Monad$bind$(Parser$monad)(Monad$bind$(Parser$monad)(Parser$maybe(Parser$text("-")))((_verb$5 => {
                        var $1090 = Monad$pure$(Parser$monad)(Maybe$to_bool$(_verb$5));
                        return $1090;
                    })))((_verb$5 => {
                        var $1091 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$6 => {
                            var $1092 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, Fm$Term$gol$(_name$3, _dref$4, _verb$5)));
                            return $1092;
                        }));
                        return $1091;
                    }));
                    return $1089;
                }));
                return $1086;
            }));
            return $1085;
        }));
        return $1084;
    }));
    const Fm$Parser$hole = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1093 = Monad$bind$(Parser$monad)(Fm$Parser$text$("_"))((_$2 => {
            var $1094 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$3 => {
                var $1095 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$3, Fm$Term$hol$(Bits$e)));
                return $1095;
            }));
            return $1094;
        }));
        return $1093;
    }));
    const Fm$Parser$nat = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1096 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1097 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1098 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$4 => {
                    var $1099 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$4, Fm$Term$nat$(_natx$3)));
                    return $1099;
                }));
                return $1098;
            }));
            return $1097;
        }));
        return $1096;
    }));
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $1100 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $1100;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);
    const Fm$Parser$reference = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1101 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var self = (_name$2 === "case");
            if (self) {
                var $1103 = Parser$fail("Reserved keyword.");
                var $1102 = $1103;
            } else {
                var self = (_name$2 === "do");
                if (self) {
                    var $1105 = Parser$fail("Reserved keyword.");
                    var $1104 = $1105;
                } else {
                    var self = (_name$2 === "if");
                    if (self) {
                        var $1107 = Parser$fail("Reserved keyword.");
                        var $1106 = $1107;
                    } else {
                        var self = (_name$2 === "let");
                        if (self) {
                            var $1109 = Parser$fail("Reserved keyword.");
                            var $1108 = $1109;
                        } else {
                            var self = (_name$2 === "def");
                            if (self) {
                                var $1111 = Parser$fail("Reserved keyword.");
                                var $1110 = $1111;
                            } else {
                                var self = (_name$2 === "true");
                                if (self) {
                                    var $1113 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Bool.true"));
                                    var $1112 = $1113;
                                } else {
                                    var self = (_name$2 === "false");
                                    if (self) {
                                        var $1115 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Bool.false"));
                                        var $1114 = $1115;
                                    } else {
                                        var self = (_name$2 === "unit");
                                        if (self) {
                                            var $1117 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Unit.new"));
                                            var $1116 = $1117;
                                        } else {
                                            var self = (_name$2 === "none");
                                            if (self) {
                                                var _term$3 = Fm$Term$ref$("Maybe.none");
                                                var _term$4 = Fm$Term$app$(_term$3, Fm$Term$hol$(Bits$e));
                                                var $1119 = Monad$pure$(Parser$monad)(_term$4);
                                                var $1118 = $1119;
                                            } else {
                                                var self = (_name$2 === "refl");
                                                if (self) {
                                                    var _term$3 = Fm$Term$ref$("Equal.refl");
                                                    var _term$4 = Fm$Term$app$(_term$3, Fm$Term$hol$(Bits$e));
                                                    var _term$5 = Fm$Term$app$(_term$4, Fm$Term$hol$(Bits$e));
                                                    var $1121 = Monad$pure$(Parser$monad)(_term$5);
                                                    var $1120 = $1121;
                                                } else {
                                                    var $1122 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$3 => {
                                                        var $1123 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$3, Fm$Term$ref$(_name$2)));
                                                        return $1123;
                                                    }));
                                                    var $1120 = $1122;
                                                };
                                                var $1118 = $1120;
                                            };
                                            var $1116 = $1118;
                                        };
                                        var $1114 = $1116;
                                    };
                                    var $1112 = $1114;
                                };
                                var $1110 = $1112;
                            };
                            var $1108 = $1110;
                        };
                        var $1106 = $1108;
                    };
                    var $1104 = $1106;
                };
                var $1102 = $1104;
            };
            return $1102;
        }));
        return $1101;
    }));
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Fm$Parser$application$(_init$1, _func$2) {
        var $1124 = Monad$bind$(Parser$monad)(Parser$text("("))((_$3 => {
            var $1125 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$(")"), Fm$Parser$item$(Fm$Parser$term)))((_args$4 => {
                var $1126 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _expr$6 = (() => {
                        var $1129 = _func$2;
                        var $1130 = _args$4;
                        let _f$7 = $1129;
                        let _x$6;
                        while ($1130._ === 'List.cons') {
                            _x$6 = $1130.head;
                            var $1129 = Fm$Term$app$(_f$7, _x$6);
                            _f$7 = $1129;
                            $1130 = $1130.tail;
                        }
                        return _f$7;
                    })();
                    var $1127 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _expr$6));
                    return $1127;
                }));
                return $1126;
            }));
            return $1125;
        }));
        return $1124;
    };
    const Fm$Parser$application = x0 => x1 => Fm$Parser$application$(x0, x1);
    const Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$nil))));

    function Parser$spaces_text$(_text$1) {
        var $1131 = Monad$bind$(Parser$monad)(Parser$spaces)((_$2 => {
            var $1132 = Parser$text(_text$1);
            return $1132;
        }));
        return $1131;
    };
    const Parser$spaces_text = x0 => Parser$spaces_text$(x0);

    function Fm$Parser$application$erased$(_init$1, _func$2) {
        var $1133 = Monad$bind$(Parser$monad)(Parser$get_index)((_init$3 => {
            var $1134 = Monad$bind$(Parser$monad)(Parser$text("<"))((_$4 => {
                var $1135 = Monad$bind$(Parser$monad)(Parser$until1$(Parser$spaces_text$(">"), Fm$Parser$item$(Fm$Parser$term)))((_args$5 => {
                    var $1136 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$3))((_orig$6 => {
                        var _expr$7 = (() => {
                            var $1139 = _func$2;
                            var $1140 = _args$5;
                            let _f$8 = $1139;
                            let _x$7;
                            while ($1140._ === 'List.cons') {
                                _x$7 = $1140.head;
                                var $1139 = Fm$Term$app$(_f$8, _x$7);
                                _f$8 = $1139;
                                $1140 = $1140.tail;
                            }
                            return _f$8;
                        })();
                        var $1137 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, _expr$7));
                        return $1137;
                    }));
                    return $1136;
                }));
                return $1135;
            }));
            return $1134;
        }));
        return $1133;
    };
    const Fm$Parser$application$erased = x0 => x1 => Fm$Parser$application$erased$(x0, x1);

    function Fm$Parser$arrow$(_init$1, _xtyp$2) {
        var $1141 = Monad$bind$(Parser$monad)(Fm$Parser$text$("->"))((_$3 => {
            var $1142 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$4 => {
                var $1143 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1144 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$all$(Bool$false, "", "", _xtyp$2, (_s$6 => _x$7 => {
                        var $1145 = _body$4;
                        return $1145;
                    }))));
                    return $1144;
                }));
                return $1143;
            }));
            return $1142;
        }));
        return $1141;
    };
    const Fm$Parser$arrow = x0 => x1 => Fm$Parser$arrow$(x0, x1);

    function Fm$Parser$op$(_sym$1, _ref$2, _init$3, _val0$4) {
        var $1146 = Monad$bind$(Parser$monad)(Fm$Parser$text$(_sym$1))((_$5 => {
            var $1147 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$6 => {
                var $1148 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$3))((_orig$7 => {
                    var _term$8 = Fm$Term$ref$(_ref$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val0$4);
                    var _term$10 = Fm$Term$app$(_term$9, _val1$6);
                    var $1149 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$10));
                    return $1149;
                }));
                return $1148;
            }));
            return $1147;
        }));
        return $1146;
    };
    const Fm$Parser$op = x0 => x1 => x2 => x3 => Fm$Parser$op$(x0, x1, x2, x3);
    const Fm$Parser$add = Fm$Parser$op("+")("Nat.add");
    const Fm$Parser$sub = Fm$Parser$op("+")("Nat.add");
    const Fm$Parser$mul = Fm$Parser$op("*")("Nat.mul");
    const Fm$Parser$div = Fm$Parser$op("/")("Nat.div");
    const Fm$Parser$mod = Fm$Parser$op("%")("Nat.mod");

    function Fm$Parser$cons$(_init$1, _head$2) {
        var $1150 = Monad$bind$(Parser$monad)(Fm$Parser$text$("&"))((_$3 => {
            var $1151 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_tail$4 => {
                var $1152 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("List.cons");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _head$2);
                    var _term$9 = Fm$Term$app$(_term$8, _tail$4);
                    var $1153 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $1154 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
                        return $1154;
                    }));
                    return $1153;
                }));
                return $1152;
            }));
            return $1151;
        }));
        return $1150;
    };
    const Fm$Parser$cons = x0 => x1 => Fm$Parser$cons$(x0, x1);

    function Fm$Parser$concat$(_init$1, _lst0$2) {
        var $1155 = Monad$bind$(Parser$monad)(Fm$Parser$text$("++"))((_$3 => {
            var $1156 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_lst1$4 => {
                var $1157 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("List.concat");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _lst0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _lst1$4);
                    var $1158 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $1159 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
                        return $1159;
                    }));
                    return $1158;
                }));
                return $1157;
            }));
            return $1156;
        }));
        return $1155;
    };
    const Fm$Parser$concat = x0 => x1 => Fm$Parser$concat$(x0, x1);

    function Fm$Parser$string_concat$(_init$1, _str0$2) {
        var $1160 = Monad$bind$(Parser$monad)(Fm$Parser$text$("|"))((_$3 => {
            var $1161 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_str1$4 => {
                var $1162 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("String.concat");
                    var _term$7 = Fm$Term$app$(_term$6, _str0$2);
                    var _term$8 = Fm$Term$app$(_term$7, _str1$4);
                    var $1163 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$9 => {
                        var $1164 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$9, _term$8));
                        return $1164;
                    }));
                    return $1163;
                }));
                return $1162;
            }));
            return $1161;
        }));
        return $1160;
    };
    const Fm$Parser$string_concat = x0 => x1 => Fm$Parser$string_concat$(x0, x1);

    function Fm$Parser$sigma$(_init$1, _val0$2) {
        var $1165 = Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$3 => {
            var $1166 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1167 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Sigma.new");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, Fm$Term$hol$(Bits$e));
                    var _term$9 = Fm$Term$app$(_term$8, _val0$2);
                    var _term$10 = Fm$Term$app$(_term$9, _val1$4);
                    var $1168 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$10));
                    return $1168;
                }));
                return $1167;
            }));
            return $1166;
        }));
        return $1165;
    };
    const Fm$Parser$sigma = x0 => x1 => Fm$Parser$sigma$(x0, x1);

    function Fm$Parser$equality$(_init$1, _val0$2) {
        var $1169 = Monad$bind$(Parser$monad)(Fm$Parser$text$("=="))((_$3 => {
            var $1170 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1171 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Equal");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _val0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val1$4);
                    var $1172 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$9));
                    return $1172;
                }));
                return $1171;
            }));
            return $1170;
        }));
        return $1169;
    };
    const Fm$Parser$equality = x0 => x1 => Fm$Parser$equality$(x0, x1);

    function Fm$Parser$inequality$(_init$1, _val0$2) {
        var $1173 = Monad$bind$(Parser$monad)(Fm$Parser$text$("!="))((_$3 => {
            var $1174 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1175 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Equal");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _val0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val1$4);
                    var _term$10 = Fm$Term$app$(Fm$Term$ref$("Not"), _term$9);
                    var $1176 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$10));
                    return $1176;
                }));
                return $1175;
            }));
            return $1174;
        }));
        return $1173;
    };
    const Fm$Parser$inequality = x0 => x1 => Fm$Parser$inequality$(x0, x1);

    function Fm$Parser$rewrite$(_init$1, _subt$2) {
        var $1177 = Monad$bind$(Parser$monad)(Fm$Parser$text$("::"))((_$3 => {
            var $1178 = Monad$bind$(Parser$monad)(Fm$Parser$text$("rewrite"))((_$4 => {
                var $1179 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$5 => {
                    var $1180 = Monad$bind$(Parser$monad)(Fm$Parser$text$("in"))((_$6 => {
                        var $1181 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$7 => {
                            var $1182 = Monad$bind$(Parser$monad)(Fm$Parser$text$("with"))((_$8 => {
                                var $1183 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_iseq$9 => {
                                    var $1184 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                                        var _term$11 = Fm$Term$ref$("Equal.rewrite");
                                        var _term$12 = Fm$Term$app$(_term$11, Fm$Term$hol$(Bits$e));
                                        var _term$13 = Fm$Term$app$(_term$12, Fm$Term$hol$(Bits$e));
                                        var _term$14 = Fm$Term$app$(_term$13, Fm$Term$hol$(Bits$e));
                                        var _term$15 = Fm$Term$app$(_term$14, Fm$Term$lam$(_name$5, (_x$15 => {
                                            var $1186 = _type$7;
                                            return $1186;
                                        })));
                                        var _term$16 = Fm$Term$app$(_term$15, _iseq$9);
                                        var _term$17 = Fm$Term$app$(_term$16, _subt$2);
                                        var $1185 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$17));
                                        return $1185;
                                    }));
                                    return $1184;
                                }));
                                return $1183;
                            }));
                            return $1182;
                        }));
                        return $1181;
                    }));
                    return $1180;
                }));
                return $1179;
            }));
            return $1178;
        }));
        return $1177;
    };
    const Fm$Parser$rewrite = x0 => x1 => Fm$Parser$rewrite$(x0, x1);

    function Fm$Term$ann$(_done$1, _term$2, _type$3) {
        var $1187 = ({
            _: 'Fm.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $1187;
    };
    const Fm$Term$ann = x0 => x1 => x2 => Fm$Term$ann$(x0, x1, x2);

    function Fm$Parser$annotation$(_init$1, _term$2) {
        var $1188 = Monad$bind$(Parser$monad)(Fm$Parser$text$("::"))((_$3 => {
            var $1189 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$4 => {
                var $1190 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1191 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$ann$(Bool$false, _term$2, _type$4)));
                    return $1191;
                }));
                return $1190;
            }));
            return $1189;
        }));
        return $1188;
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
                        var $1193 = self.idx;
                        var $1194 = self.code;
                        var $1195 = self.err;
                        var $1196 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $1192 = $1196;
                        break;
                    case 'Parser.Reply.value':
                        var $1197 = self.idx;
                        var $1198 = self.code;
                        var $1199 = self.val;
                        var $1200 = Fm$Parser$suffix$(_init$1, $1199, $1197, $1198);
                        var $1192 = $1200;
                        break;
                };
                return $1192;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Parser$suffix = x0 => x1 => x2 => x3 => Fm$Parser$suffix$(x0, x1, x2, x3);
    const Fm$Parser$term = Monad$bind$(Parser$monad)(Parser$get_code)((_code$1 => {
        var $1201 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $1202 = Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$type, List$cons$(Fm$Parser$forall, List$cons$(Fm$Parser$lambda, List$cons$(Fm$Parser$lambda$erased, List$cons$(Fm$Parser$lambda$nameless, List$cons$(Fm$Parser$parenthesis, List$cons$(Fm$Parser$letforrange$u32, List$cons$(Fm$Parser$letforin, List$cons$(Fm$Parser$let, List$cons$(Fm$Parser$get, List$cons$(Fm$Parser$def, List$cons$(Fm$Parser$if, List$cons$(Fm$Parser$char, List$cons$(Fm$Parser$string, List$cons$(Fm$Parser$pair, List$cons$(Fm$Parser$sigma$type, List$cons$(Fm$Parser$some, List$cons$(Fm$Parser$apply, List$cons$(Fm$Parser$list, List$cons$(Fm$Parser$log, List$cons$(Fm$Parser$forin, List$cons$(Fm$Parser$forrange$u32, List$cons$(Fm$Parser$forin2, List$cons$(Fm$Parser$do, List$cons$(Fm$Parser$case, List$cons$(Fm$Parser$open, List$cons$(Fm$Parser$goal, List$cons$(Fm$Parser$hole, List$cons$(Fm$Parser$nat, List$cons$(Fm$Parser$reference, List$nil))))))))))))))))))))))))))))))))((_term$3 => {
                var $1203 = Fm$Parser$suffix(_init$2)(_term$3);
                return $1203;
            }));
            return $1202;
        }));
        return $1201;
    }));
    const Fm$Parser$name_term = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$1 => {
        var $1204 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$2 => {
            var $1205 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$3 => {
                var $1206 = Monad$pure$(Parser$monad)(Pair$new$(_name$1, _type$3));
                return $1206;
            }));
            return $1205;
        }));
        return $1204;
    }));

    function Fm$Binder$new$(_eras$1, _name$2, _term$3) {
        var $1207 = ({
            _: 'Fm.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $1207;
    };
    const Fm$Binder$new = x0 => x1 => x2 => Fm$Binder$new$(x0, x1, x2);

    function Fm$Parser$binder$homo$(_eras$1) {
        var $1208 = Monad$bind$(Parser$monad)(Fm$Parser$text$((() => {
            var self = _eras$1;
            if (self) {
                var $1209 = "<";
                return $1209;
            } else {
                var $1210 = "(";
                return $1210;
            };
        })()))((_$2 => {
            var $1211 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$((() => {
                var self = _eras$1;
                if (self) {
                    var $1212 = ">";
                    return $1212;
                } else {
                    var $1213 = ")";
                    return $1213;
                };
            })()), Fm$Parser$item$(Fm$Parser$name_term)))((_bind$3 => {
                var $1214 = Monad$pure$(Parser$monad)(List$mapped$(_bind$3, (_pair$4 => {
                    var self = _pair$4;
                    switch (self._) {
                        case 'Pair.new':
                            var $1216 = self.fst;
                            var $1217 = self.snd;
                            var $1218 = Fm$Binder$new$(_eras$1, $1216, $1217);
                            var $1215 = $1218;
                            break;
                    };
                    return $1215;
                })));
                return $1214;
            }));
            return $1211;
        }));
        return $1208;
    };
    const Fm$Parser$binder$homo = x0 => Fm$Parser$binder$homo$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.nil':
                var $1220 = _bs$3;
                var $1219 = $1220;
                break;
            case 'List.cons':
                var $1221 = self.head;
                var $1222 = self.tail;
                var $1223 = List$cons$($1221, List$concat$($1222, _bs$3));
                var $1219 = $1223;
                break;
        };
        return $1219;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1225 = List$nil;
                var $1224 = $1225;
                break;
            case 'List.cons':
                var $1226 = self.head;
                var $1227 = self.tail;
                var $1228 = List$concat$($1226, List$flatten$($1227));
                var $1224 = $1228;
                break;
        };
        return $1224;
    };
    const List$flatten = x0 => List$flatten$(x0);
    const Fm$Parser$binder = Monad$bind$(Parser$monad)(Parser$many1$(Parser$first_of$(List$cons$(Fm$Parser$binder$homo$(Bool$true), List$cons$(Fm$Parser$binder$homo$(Bool$false), List$nil)))))((_lists$1 => {
        var $1229 = Monad$pure$(Parser$monad)(List$flatten$(_lists$1));
        return $1229;
    }));

    function Fm$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.nil':
                var $1231 = _body$2;
                var $1230 = $1231;
                break;
            case 'List.cons':
                var $1232 = self.head;
                var $1233 = self.tail;
                var self = $1232;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1235 = self.eras;
                        var $1236 = self.name;
                        var $1237 = self.term;
                        var $1238 = Fm$Term$all$($1235, "", $1236, $1237, (_s$8 => _x$9 => {
                            var $1239 = Fm$Parser$make_forall$($1233, _body$2);
                            return $1239;
                        }));
                        var $1234 = $1238;
                        break;
                };
                var $1230 = $1234;
                break;
        };
        return $1230;
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
                        var $1240 = Maybe$none;
                        return $1240;
                    case 'List.cons':
                        var $1241 = self.head;
                        var $1242 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $1244 = Maybe$some$($1241);
                            var $1243 = $1244;
                        } else {
                            var $1245 = (self - 1n);
                            var $1246 = List$at$($1245, $1242);
                            var $1243 = $1246;
                        };
                        return $1243;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $1247 = List$at$(_index$2, List$reverse$(_list$3));
        return $1247;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Fm$Term$var$(_name$1, _indx$2) {
        var $1248 = ({
            _: 'Fm.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $1248;
    };
    const Fm$Term$var = x0 => x1 => Fm$Term$var$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1250 = self.fst;
                var $1251 = self.snd;
                var $1252 = $1251;
                var $1249 = $1252;
                break;
        };
        return $1249;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Fm$Name$eql$(_a$1, _b$2) {
        var $1253 = (_a$1 === _b$2);
        return $1253;
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
                        var $1254 = Maybe$none;
                        return $1254;
                    case 'List.cons':
                        var $1255 = self.head;
                        var $1256 = self.tail;
                        var self = $1255;
                        switch (self._) {
                            case 'Pair.new':
                                var $1258 = self.fst;
                                var $1259 = self.snd;
                                var self = Fm$Name$eql$(_name$1, $1258);
                                if (self) {
                                    var $1261 = Maybe$some$($1259);
                                    var $1260 = $1261;
                                } else {
                                    var $1262 = Fm$Context$find$(_name$1, $1256);
                                    var $1260 = $1262;
                                };
                                var $1257 = $1260;
                                break;
                        };
                        return $1257;
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
                var $1264 = 0n;
                var $1263 = $1264;
                break;
            case 'List.cons':
                var $1265 = self.head;
                var $1266 = self.tail;
                var $1267 = Nat$succ$(List$length$($1266));
                var $1263 = $1267;
                break;
        };
        return $1263;
    };
    const List$length = x0 => List$length$(x0);

    function Fm$Path$o$(_path$1, _x$2) {
        var $1268 = _path$1((_x$2 + '0'));
        return $1268;
    };
    const Fm$Path$o = x0 => x1 => Fm$Path$o$(x0, x1);

    function Fm$Path$i$(_path$1, _x$2) {
        var $1269 = _path$1((_x$2 + '1'));
        return $1269;
    };
    const Fm$Path$i = x0 => x1 => Fm$Path$i$(x0, x1);

    function Fm$Path$to_bits$(_path$1) {
        var $1270 = _path$1(Bits$e);
        return $1270;
    };
    const Fm$Path$to_bits = x0 => Fm$Path$to_bits$(x0);

    function Fm$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Fm.Term.var':
                var $1272 = self.name;
                var $1273 = self.indx;
                var self = List$at_last$($1273, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1275 = Fm$Term$var$($1272, $1273);
                        var $1274 = $1275;
                        break;
                    case 'Maybe.some':
                        var $1276 = self.value;
                        var $1277 = Pair$snd$($1276);
                        var $1274 = $1277;
                        break;
                };
                var $1271 = $1274;
                break;
            case 'Fm.Term.ref':
                var $1278 = self.name;
                var self = Fm$Context$find$($1278, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1280 = Fm$Term$ref$($1278);
                        var $1279 = $1280;
                        break;
                    case 'Maybe.some':
                        var $1281 = self.value;
                        var $1282 = $1281;
                        var $1279 = $1282;
                        break;
                };
                var $1271 = $1279;
                break;
            case 'Fm.Term.typ':
                var $1283 = Fm$Term$typ;
                var $1271 = $1283;
                break;
            case 'Fm.Term.all':
                var $1284 = self.eras;
                var $1285 = self.self;
                var $1286 = self.name;
                var $1287 = self.xtyp;
                var $1288 = self.body;
                var _vlen$9 = List$length$(_vars$1);
                var $1289 = Fm$Term$all$($1284, $1285, $1286, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1287), (_s$10 => _x$11 => {
                    var $1290 = Fm$Term$bind$(List$cons$(Pair$new$($1286, _x$11), List$cons$(Pair$new$($1285, _s$10), _vars$1)), Fm$Path$i(_path$2), $1288(Fm$Term$var$($1285, _vlen$9))(Fm$Term$var$($1286, Nat$succ$(_vlen$9))));
                    return $1290;
                }));
                var $1271 = $1289;
                break;
            case 'Fm.Term.lam':
                var $1291 = self.name;
                var $1292 = self.body;
                var _vlen$6 = List$length$(_vars$1);
                var $1293 = Fm$Term$lam$($1291, (_x$7 => {
                    var $1294 = Fm$Term$bind$(List$cons$(Pair$new$($1291, _x$7), _vars$1), Fm$Path$o(_path$2), $1292(Fm$Term$var$($1291, _vlen$6)));
                    return $1294;
                }));
                var $1271 = $1293;
                break;
            case 'Fm.Term.app':
                var $1295 = self.func;
                var $1296 = self.argm;
                var $1297 = Fm$Term$app$(Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1295), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1296));
                var $1271 = $1297;
                break;
            case 'Fm.Term.let':
                var $1298 = self.name;
                var $1299 = self.expr;
                var $1300 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1301 = Fm$Term$let$($1298, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1299), (_x$8 => {
                    var $1302 = Fm$Term$bind$(List$cons$(Pair$new$($1298, _x$8), _vars$1), Fm$Path$i(_path$2), $1300(Fm$Term$var$($1298, _vlen$7)));
                    return $1302;
                }));
                var $1271 = $1301;
                break;
            case 'Fm.Term.def':
                var $1303 = self.name;
                var $1304 = self.expr;
                var $1305 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1306 = Fm$Term$def$($1303, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1304), (_x$8 => {
                    var $1307 = Fm$Term$bind$(List$cons$(Pair$new$($1303, _x$8), _vars$1), Fm$Path$i(_path$2), $1305(Fm$Term$var$($1303, _vlen$7)));
                    return $1307;
                }));
                var $1271 = $1306;
                break;
            case 'Fm.Term.ann':
                var $1308 = self.done;
                var $1309 = self.term;
                var $1310 = self.type;
                var $1311 = Fm$Term$ann$($1308, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1309), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1310));
                var $1271 = $1311;
                break;
            case 'Fm.Term.gol':
                var $1312 = self.name;
                var $1313 = self.dref;
                var $1314 = self.verb;
                var $1315 = Fm$Term$gol$($1312, $1313, $1314);
                var $1271 = $1315;
                break;
            case 'Fm.Term.hol':
                var $1316 = self.path;
                var $1317 = Fm$Term$hol$(Fm$Path$to_bits$(_path$2));
                var $1271 = $1317;
                break;
            case 'Fm.Term.nat':
                var $1318 = self.natx;
                var $1319 = Fm$Term$nat$($1318);
                var $1271 = $1319;
                break;
            case 'Fm.Term.chr':
                var $1320 = self.chrx;
                var $1321 = Fm$Term$chr$($1320);
                var $1271 = $1321;
                break;
            case 'Fm.Term.str':
                var $1322 = self.strx;
                var $1323 = Fm$Term$str$($1322);
                var $1271 = $1323;
                break;
            case 'Fm.Term.cse':
                var $1324 = self.path;
                var $1325 = self.expr;
                var $1326 = self.name;
                var $1327 = self.with;
                var $1328 = self.cses;
                var $1329 = self.moti;
                var _expr$10 = Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1325);
                var _name$11 = $1326;
                var _wyth$12 = $1327;
                var _cses$13 = $1328;
                var _moti$14 = $1329;
                var $1330 = Fm$Term$cse$(Fm$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $1271 = $1330;
                break;
            case 'Fm.Term.ori':
                var $1331 = self.orig;
                var $1332 = self.expr;
                var $1333 = Fm$Term$ori$($1331, Fm$Term$bind$(_vars$1, _path$2, $1332));
                var $1271 = $1333;
                break;
        };
        return $1271;
    };
    const Fm$Term$bind = x0 => x1 => x2 => Fm$Term$bind$(x0, x1, x2);
    const Fm$Status$done = ({
        _: 'Fm.Status.done'
    });

    function Fm$set$(_name$2, _val$3, _map$4) {
        var $1334 = Map$set$((fm_name_to_bits(_name$2)), _val$3, _map$4);
        return $1334;
    };
    const Fm$set = x0 => x1 => x2 => Fm$set$(x0, x1, x2);

    function Fm$define$(_file$1, _code$2, _name$3, _term$4, _type$5, _done$6, _defs$7) {
        var self = _done$6;
        if (self) {
            var $1336 = Fm$Status$done;
            var _stat$8 = $1336;
        } else {
            var $1337 = Fm$Status$init;
            var _stat$8 = $1337;
        };
        var $1335 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$4, _type$5, _stat$8), _defs$7);
        return $1335;
    };
    const Fm$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Fm$define$(x0, x1, x2, x3, x4, x5, x6);

    function Fm$Parser$file$def$(_file$1, _code$2, _defs$3) {
        var $1338 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
            var $1339 = Monad$bind$(Parser$monad)(Parser$many$(Fm$Parser$binder))((_args$5 => {
                var _args$6 = List$flatten$(_args$5);
                var $1340 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$7 => {
                    var $1341 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$8 => {
                        var $1342 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$9 => {
                            var _type$10 = Fm$Parser$make_forall$(_args$6, _type$8);
                            var _term$11 = Fm$Parser$make_lambda$(List$mapped$(_args$6, (_x$11 => {
                                var self = _x$11;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $1345 = self.eras;
                                        var $1346 = self.name;
                                        var $1347 = self.term;
                                        var $1348 = $1346;
                                        var $1344 = $1348;
                                        break;
                                };
                                return $1344;
                            })), _term$9);
                            var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                                var $1349 = (_x$12 + '1');
                                return $1349;
                            }), _type$10);
                            var _term$13 = Fm$Term$bind$(List$nil, (_x$13 => {
                                var $1350 = (_x$13 + '0');
                                return $1350;
                            }), _term$11);
                            var _defs$14 = Fm$define$(_file$1, _code$2, _name$4, _term$13, _type$12, Bool$false, _defs$3);
                            var $1343 = Monad$pure$(Parser$monad)(_defs$14);
                            return $1343;
                        }));
                        return $1342;
                    }));
                    return $1341;
                }));
                return $1340;
            }));
            return $1339;
        }));
        return $1338;
    };
    const Fm$Parser$file$def = x0 => x1 => x2 => Fm$Parser$file$def$(x0, x1, x2);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $1352 = _a$2;
                var $1351 = $1352;
                break;
            case 'Maybe.some':
                var $1353 = self.value;
                var $1354 = $1353;
                var $1351 = $1354;
                break;
        };
        return $1351;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Fm$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $1355 = ({
            _: 'Fm.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $1355;
    };
    const Fm$Constructor$new = x0 => x1 => x2 => Fm$Constructor$new$(x0, x1, x2);

    function Fm$Parser$constructor$(_namespace$1) {
        var $1356 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1357 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_args$3 => {
                var $1358 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1359 = Fm$Parser$binder;
                    return $1359;
                }))))((_inds$4 => {
                    var _args$5 = Maybe$default$(List$nil, _args$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1360 = Monad$pure$(Parser$monad)(Fm$Constructor$new$(_name$2, _args$5, _inds$6));
                    return $1360;
                }));
                return $1358;
            }));
            return $1357;
        }));
        return $1356;
    };
    const Fm$Parser$constructor = x0 => Fm$Parser$constructor$(x0);

    function Fm$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $1361 = ({
            _: 'Fm.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $1361;
    };
    const Fm$Datatype$new = x0 => x1 => x2 => x3 => Fm$Datatype$new$(x0, x1, x2, x3);
    const Fm$Parser$datatype = Monad$bind$(Parser$monad)(Fm$Parser$text$("type "))((_$1 => {
        var $1362 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1363 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_pars$3 => {
                var $1364 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1365 = Fm$Parser$binder;
                    return $1365;
                }))))((_inds$4 => {
                    var _pars$5 = Maybe$default$(List$nil, _pars$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1366 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$7 => {
                        var $1367 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("}"), Fm$Parser$item$(Fm$Parser$constructor$(_name$2))))((_ctrs$8 => {
                            var $1368 = Monad$pure$(Parser$monad)(Fm$Datatype$new$(_name$2, _pars$5, _inds$6, _ctrs$8));
                            return $1368;
                        }));
                        return $1367;
                    }));
                    return $1366;
                }));
                return $1364;
            }));
            return $1363;
        }));
        return $1362;
    }));

    function Fm$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1371 = self.name;
                        var $1372 = self.pars;
                        var $1373 = self.inds;
                        var $1374 = self.ctrs;
                        var _slf$8 = Fm$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $1377 = _slf$8;
                            var $1378 = $1372;
                            let _slf$10 = $1377;
                            let _var$9;
                            while ($1378._ === 'List.cons') {
                                _var$9 = $1378.head;
                                var $1377 = Fm$Term$app$(_slf$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1379 = self.eras;
                                            var $1380 = self.name;
                                            var $1381 = self.term;
                                            var $1382 = $1380;
                                            return $1382;
                                    };
                                })()));
                                _slf$10 = $1377;
                                $1378 = $1378.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $1384 = _slf$9;
                            var $1385 = $1373;
                            let _slf$11 = $1384;
                            let _var$10;
                            while ($1385._ === 'List.cons') {
                                _var$10 = $1385.head;
                                var $1384 = Fm$Term$app$(_slf$11, Fm$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1386 = self.eras;
                                            var $1387 = self.name;
                                            var $1388 = self.term;
                                            var $1389 = $1387;
                                            return $1389;
                                    };
                                })()));
                                _slf$11 = $1384;
                                $1385 = $1385.tail;
                            }
                            return _slf$11;
                        })();
                        var $1375 = Fm$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $1390 = Fm$Term$typ;
                            return $1390;
                        }));
                        var $1370 = $1375;
                        break;
                };
                var $1369 = $1370;
                break;
            case 'List.cons':
                var $1391 = self.head;
                var $1392 = self.tail;
                var self = $1391;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1394 = self.eras;
                        var $1395 = self.name;
                        var $1396 = self.term;
                        var $1397 = Fm$Term$all$($1394, "", $1395, $1396, (_s$9 => _x$10 => {
                            var $1398 = Fm$Datatype$build_term$motive$go$(_type$1, _name$2, $1392);
                            return $1398;
                        }));
                        var $1393 = $1397;
                        break;
                };
                var $1369 = $1393;
                break;
        };
        return $1369;
    };
    const Fm$Datatype$build_term$motive$go = x0 => x1 => x2 => Fm$Datatype$build_term$motive$go$(x0, x1, x2);

    function Fm$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1400 = self.name;
                var $1401 = self.pars;
                var $1402 = self.inds;
                var $1403 = self.ctrs;
                var $1404 = Fm$Datatype$build_term$motive$go$(_type$1, $1400, $1402);
                var $1399 = $1404;
                break;
        };
        return $1399;
    };
    const Fm$Datatype$build_term$motive = x0 => Fm$Datatype$build_term$motive$(x0);

    function Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1407 = self.name;
                        var $1408 = self.pars;
                        var $1409 = self.inds;
                        var $1410 = self.ctrs;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Fm.Constructor.new':
                                var $1412 = self.name;
                                var $1413 = self.args;
                                var $1414 = self.inds;
                                var _ret$11 = Fm$Term$ref$(Fm$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $1417 = _ret$11;
                                    var $1418 = $1414;
                                    let _ret$13 = $1417;
                                    let _var$12;
                                    while ($1418._ === 'List.cons') {
                                        _var$12 = $1418.head;
                                        var $1417 = Fm$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1419 = self.eras;
                                                    var $1420 = self.name;
                                                    var $1421 = self.term;
                                                    var $1422 = $1421;
                                                    return $1422;
                                            };
                                        })());
                                        _ret$13 = $1417;
                                        $1418 = $1418.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($1407, List$cons$(Fm$Name$read$("."), List$cons$($1412, List$nil))));
                                var _slf$14 = Fm$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $1424 = _slf$14;
                                    var $1425 = $1408;
                                    let _slf$16 = $1424;
                                    let _var$15;
                                    while ($1425._ === 'List.cons') {
                                        _var$15 = $1425.head;
                                        var $1424 = Fm$Term$app$(_slf$16, Fm$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1426 = self.eras;
                                                    var $1427 = self.name;
                                                    var $1428 = self.term;
                                                    var $1429 = $1427;
                                                    return $1429;
                                            };
                                        })()));
                                        _slf$16 = $1424;
                                        $1425 = $1425.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $1431 = _slf$15;
                                    var $1432 = $1413;
                                    let _slf$17 = $1431;
                                    let _var$16;
                                    while ($1432._ === 'List.cons') {
                                        _var$16 = $1432.head;
                                        var $1431 = Fm$Term$app$(_slf$17, Fm$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1433 = self.eras;
                                                    var $1434 = self.name;
                                                    var $1435 = self.term;
                                                    var $1436 = $1434;
                                                    return $1436;
                                            };
                                        })()));
                                        _slf$17 = $1431;
                                        $1432 = $1432.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $1415 = Fm$Term$app$(_ret$12, _slf$16);
                                var $1411 = $1415;
                                break;
                        };
                        var $1406 = $1411;
                        break;
                };
                var $1405 = $1406;
                break;
            case 'List.cons':
                var $1437 = self.head;
                var $1438 = self.tail;
                var self = $1437;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1440 = self.eras;
                        var $1441 = self.name;
                        var $1442 = self.term;
                        var _eras$9 = $1440;
                        var _name$10 = $1441;
                        var _xtyp$11 = $1442;
                        var _body$12 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1438);
                        var $1443 = Fm$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $1444 = _body$12;
                            return $1444;
                        }));
                        var $1439 = $1443;
                        break;
                };
                var $1405 = $1439;
                break;
        };
        return $1405;
    };
    const Fm$Datatype$build_term$constructor$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Fm.Constructor.new':
                var $1446 = self.name;
                var $1447 = self.args;
                var $1448 = self.inds;
                var $1449 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1447);
                var $1445 = $1449;
                break;
        };
        return $1445;
    };
    const Fm$Datatype$build_term$constructor = x0 => x1 => Fm$Datatype$build_term$constructor$(x0, x1);

    function Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1452 = self.name;
                        var $1453 = self.pars;
                        var $1454 = self.inds;
                        var $1455 = self.ctrs;
                        var _ret$8 = Fm$Term$ref$(Fm$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $1458 = _ret$8;
                            var $1459 = $1454;
                            let _ret$10 = $1458;
                            let _var$9;
                            while ($1459._ === 'List.cons') {
                                _var$9 = $1459.head;
                                var $1458 = Fm$Term$app$(_ret$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1460 = self.eras;
                                            var $1461 = self.name;
                                            var $1462 = self.term;
                                            var $1463 = $1461;
                                            return $1463;
                                    };
                                })()));
                                _ret$10 = $1458;
                                $1459 = $1459.tail;
                            }
                            return _ret$10;
                        })();
                        var $1456 = Fm$Term$app$(_ret$9, Fm$Term$ref$((_name$2 + ".Self")));
                        var $1451 = $1456;
                        break;
                };
                var $1450 = $1451;
                break;
            case 'List.cons':
                var $1464 = self.head;
                var $1465 = self.tail;
                var self = $1464;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1467 = self.name;
                        var $1468 = self.args;
                        var $1469 = self.inds;
                        var $1470 = Fm$Term$all$(Bool$false, "", $1467, Fm$Datatype$build_term$constructor$(_type$1, $1464), (_s$9 => _x$10 => {
                            var $1471 = Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, $1465);
                            return $1471;
                        }));
                        var $1466 = $1470;
                        break;
                };
                var $1450 = $1466;
                break;
        };
        return $1450;
    };
    const Fm$Datatype$build_term$constructors$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1473 = self.name;
                var $1474 = self.pars;
                var $1475 = self.inds;
                var $1476 = self.ctrs;
                var $1477 = Fm$Datatype$build_term$constructors$go$(_type$1, $1473, $1476);
                var $1472 = $1477;
                break;
        };
        return $1472;
    };
    const Fm$Datatype$build_term$constructors = x0 => Fm$Datatype$build_term$constructors$(x0);

    function Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1480 = Fm$Term$all$(Bool$true, (_name$2 + ".Self"), Fm$Name$read$("P"), Fm$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $1481 = Fm$Datatype$build_term$constructors$(_type$1);
                            return $1481;
                        }));
                        var $1479 = $1480;
                        break;
                    case 'List.cons':
                        var $1482 = self.head;
                        var $1483 = self.tail;
                        var self = $1482;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1485 = self.eras;
                                var $1486 = self.name;
                                var $1487 = self.term;
                                var $1488 = Fm$Term$lam$($1486, (_x$10 => {
                                    var $1489 = Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $1483);
                                    return $1489;
                                }));
                                var $1484 = $1488;
                                break;
                        };
                        var $1479 = $1484;
                        break;
                };
                var $1478 = $1479;
                break;
            case 'List.cons':
                var $1490 = self.head;
                var $1491 = self.tail;
                var self = $1490;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1493 = self.eras;
                        var $1494 = self.name;
                        var $1495 = self.term;
                        var $1496 = Fm$Term$lam$($1494, (_x$10 => {
                            var $1497 = Fm$Datatype$build_term$go$(_type$1, _name$2, $1491, _inds$4);
                            return $1497;
                        }));
                        var $1492 = $1496;
                        break;
                };
                var $1478 = $1492;
                break;
        };
        return $1478;
    };
    const Fm$Datatype$build_term$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_term$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1499 = self.name;
                var $1500 = self.pars;
                var $1501 = self.inds;
                var $1502 = self.ctrs;
                var $1503 = Fm$Datatype$build_term$go$(_type$1, $1499, $1500, $1501);
                var $1498 = $1503;
                break;
        };
        return $1498;
    };
    const Fm$Datatype$build_term = x0 => Fm$Datatype$build_term$(x0);

    function Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1506 = Fm$Term$typ;
                        var $1505 = $1506;
                        break;
                    case 'List.cons':
                        var $1507 = self.head;
                        var $1508 = self.tail;
                        var self = $1507;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1510 = self.eras;
                                var $1511 = self.name;
                                var $1512 = self.term;
                                var $1513 = Fm$Term$all$(Bool$false, "", $1511, $1512, (_s$10 => _x$11 => {
                                    var $1514 = Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $1508);
                                    return $1514;
                                }));
                                var $1509 = $1513;
                                break;
                        };
                        var $1505 = $1509;
                        break;
                };
                var $1504 = $1505;
                break;
            case 'List.cons':
                var $1515 = self.head;
                var $1516 = self.tail;
                var self = $1515;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1518 = self.eras;
                        var $1519 = self.name;
                        var $1520 = self.term;
                        var $1521 = Fm$Term$all$(Bool$false, "", $1519, $1520, (_s$10 => _x$11 => {
                            var $1522 = Fm$Datatype$build_type$go$(_type$1, _name$2, $1516, _inds$4);
                            return $1522;
                        }));
                        var $1517 = $1521;
                        break;
                };
                var $1504 = $1517;
                break;
        };
        return $1504;
    };
    const Fm$Datatype$build_type$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_type$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1524 = self.name;
                var $1525 = self.pars;
                var $1526 = self.inds;
                var $1527 = self.ctrs;
                var $1528 = Fm$Datatype$build_type$go$(_type$1, $1524, $1525, $1526);
                var $1523 = $1528;
                break;
        };
        return $1523;
    };
    const Fm$Datatype$build_type = x0 => Fm$Datatype$build_type$(x0);

    function Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1531 = self.name;
                        var $1532 = self.args;
                        var $1533 = self.inds;
                        var _ret$7 = Fm$Term$ref$($1531);
                        var _ret$8 = (() => {
                            var $1536 = _ret$7;
                            var $1537 = $1532;
                            let _ret$9 = $1536;
                            let _arg$8;
                            while ($1537._ === 'List.cons') {
                                _arg$8 = $1537.head;
                                var $1536 = Fm$Term$app$(_ret$9, Fm$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1538 = self.eras;
                                            var $1539 = self.name;
                                            var $1540 = self.term;
                                            var $1541 = $1539;
                                            return $1541;
                                    };
                                })()));
                                _ret$9 = $1536;
                                $1537 = $1537.tail;
                            }
                            return _ret$9;
                        })();
                        var $1534 = _ret$8;
                        var $1530 = $1534;
                        break;
                };
                var $1529 = $1530;
                break;
            case 'List.cons':
                var $1542 = self.head;
                var $1543 = self.tail;
                var self = $1542;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1545 = self.name;
                        var $1546 = self.args;
                        var $1547 = self.inds;
                        var $1548 = Fm$Term$lam$($1545, (_x$9 => {
                            var $1549 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1543);
                            return $1549;
                        }));
                        var $1544 = $1548;
                        break;
                };
                var $1529 = $1544;
                break;
        };
        return $1529;
    };
    const Fm$Constructor$build_term$opt$go = x0 => x1 => x2 => Fm$Constructor$build_term$opt$go$(x0, x1, x2);

    function Fm$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1551 = self.name;
                var $1552 = self.pars;
                var $1553 = self.inds;
                var $1554 = self.ctrs;
                var $1555 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1554);
                var $1550 = $1555;
                break;
        };
        return $1550;
    };
    const Fm$Constructor$build_term$opt = x0 => x1 => Fm$Constructor$build_term$opt$(x0, x1);

    function Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.nil':
                        var $1558 = Fm$Term$lam$(Fm$Name$read$("P"), (_x$6 => {
                            var $1559 = Fm$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $1559;
                        }));
                        var $1557 = $1558;
                        break;
                    case 'List.cons':
                        var $1560 = self.head;
                        var $1561 = self.tail;
                        var self = $1560;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1563 = self.eras;
                                var $1564 = self.name;
                                var $1565 = self.term;
                                var $1566 = Fm$Term$lam$($1564, (_x$11 => {
                                    var $1567 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $1561);
                                    return $1567;
                                }));
                                var $1562 = $1566;
                                break;
                        };
                        var $1557 = $1562;
                        break;
                };
                var $1556 = $1557;
                break;
            case 'List.cons':
                var $1568 = self.head;
                var $1569 = self.tail;
                var self = $1568;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1571 = self.eras;
                        var $1572 = self.name;
                        var $1573 = self.term;
                        var $1574 = Fm$Term$lam$($1572, (_x$11 => {
                            var $1575 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $1569, _args$5);
                            return $1575;
                        }));
                        var $1570 = $1574;
                        break;
                };
                var $1556 = $1570;
                break;
        };
        return $1556;
    };
    const Fm$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1577 = self.name;
                var $1578 = self.pars;
                var $1579 = self.inds;
                var $1580 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1582 = self.name;
                        var $1583 = self.args;
                        var $1584 = self.inds;
                        var $1585 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, $1577, $1578, $1583);
                        var $1581 = $1585;
                        break;
                };
                var $1576 = $1581;
                break;
        };
        return $1576;
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
                                var $1589 = self.name;
                                var $1590 = self.pars;
                                var $1591 = self.inds;
                                var $1592 = self.ctrs;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Fm.Constructor.new':
                                        var $1594 = self.name;
                                        var $1595 = self.args;
                                        var $1596 = self.inds;
                                        var _type$13 = Fm$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $1599 = _type$13;
                                            var $1600 = $1590;
                                            let _type$15 = $1599;
                                            let _var$14;
                                            while ($1600._ === 'List.cons') {
                                                _var$14 = $1600.head;
                                                var $1599 = Fm$Term$app$(_type$15, Fm$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1601 = self.eras;
                                                            var $1602 = self.name;
                                                            var $1603 = self.term;
                                                            var $1604 = $1602;
                                                            return $1604;
                                                    };
                                                })()));
                                                _type$15 = $1599;
                                                $1600 = $1600.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $1606 = _type$14;
                                            var $1607 = $1596;
                                            let _type$16 = $1606;
                                            let _var$15;
                                            while ($1607._ === 'List.cons') {
                                                _var$15 = $1607.head;
                                                var $1606 = Fm$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1608 = self.eras;
                                                            var $1609 = self.name;
                                                            var $1610 = self.term;
                                                            var $1611 = $1610;
                                                            return $1611;
                                                    };
                                                })());
                                                _type$16 = $1606;
                                                $1607 = $1607.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $1597 = _type$15;
                                        var $1593 = $1597;
                                        break;
                                };
                                var $1588 = $1593;
                                break;
                        };
                        var $1587 = $1588;
                        break;
                    case 'List.cons':
                        var $1612 = self.head;
                        var $1613 = self.tail;
                        var self = $1612;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1615 = self.eras;
                                var $1616 = self.name;
                                var $1617 = self.term;
                                var $1618 = Fm$Term$all$($1615, "", $1616, $1617, (_s$11 => _x$12 => {
                                    var $1619 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $1613);
                                    return $1619;
                                }));
                                var $1614 = $1618;
                                break;
                        };
                        var $1587 = $1614;
                        break;
                };
                var $1586 = $1587;
                break;
            case 'List.cons':
                var $1620 = self.head;
                var $1621 = self.tail;
                var self = $1620;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1623 = self.eras;
                        var $1624 = self.name;
                        var $1625 = self.term;
                        var $1626 = Fm$Term$all$($1623, "", $1624, $1625, (_s$11 => _x$12 => {
                            var $1627 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $1621, _args$5);
                            return $1627;
                        }));
                        var $1622 = $1626;
                        break;
                };
                var $1586 = $1622;
                break;
        };
        return $1586;
    };
    const Fm$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1629 = self.name;
                var $1630 = self.pars;
                var $1631 = self.inds;
                var $1632 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1634 = self.name;
                        var $1635 = self.args;
                        var $1636 = self.inds;
                        var $1637 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, $1629, $1630, $1635);
                        var $1633 = $1637;
                        break;
                };
                var $1628 = $1633;
                break;
        };
        return $1628;
    };
    const Fm$Constructor$build_type = x0 => x1 => Fm$Constructor$build_type$(x0, x1);

    function Fm$Parser$file$adt$(_file$1, _code$2, _defs$3) {
        var $1638 = Monad$bind$(Parser$monad)(Fm$Parser$datatype)((_adt$4 => {
            var self = _adt$4;
            switch (self._) {
                case 'Fm.Datatype.new':
                    var $1640 = self.name;
                    var $1641 = self.pars;
                    var $1642 = self.inds;
                    var $1643 = self.ctrs;
                    var _term$9 = Fm$Datatype$build_term$(_adt$4);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $1645 = (_x$10 + '1');
                        return $1645;
                    }), _term$9);
                    var _type$11 = Fm$Datatype$build_type$(_adt$4);
                    var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                        var $1646 = (_x$12 + '0');
                        return $1646;
                    }), _type$11);
                    var _defs$13 = Fm$define$(_file$1, _code$2, $1640, _term$10, _type$12, Bool$false, _defs$3);
                    var _defs$14 = List$fold$($1643, _defs$13, (_ctr$14 => _defs$15 => {
                        var _typ_name$16 = $1640;
                        var _ctr_name$17 = String$flatten$(List$cons$(_typ_name$16, List$cons$(Fm$Name$read$("."), List$cons$((() => {
                            var self = _ctr$14;
                            switch (self._) {
                                case 'Fm.Constructor.new':
                                    var $1648 = self.name;
                                    var $1649 = self.args;
                                    var $1650 = self.inds;
                                    var $1651 = $1648;
                                    return $1651;
                            };
                        })(), List$nil))));
                        var _ctr_term$18 = Fm$Constructor$build_term$(_adt$4, _ctr$14);
                        var _ctr_term$19 = Fm$Term$bind$(List$nil, (_x$19 => {
                            var $1652 = (_x$19 + '1');
                            return $1652;
                        }), _ctr_term$18);
                        var _ctr_type$20 = Fm$Constructor$build_type$(_adt$4, _ctr$14);
                        var _ctr_type$21 = Fm$Term$bind$(List$nil, (_x$21 => {
                            var $1653 = (_x$21 + '0');
                            return $1653;
                        }), _ctr_type$20);
                        var $1647 = Fm$define$(_file$1, _code$2, _ctr_name$17, _ctr_term$19, _ctr_type$21, Bool$false, _defs$15);
                        return $1647;
                    }));
                    var $1644 = Monad$pure$(Parser$monad)(_defs$14);
                    var $1639 = $1644;
                    break;
            };
            return $1639;
        }));
        return $1638;
    };
    const Fm$Parser$file$adt = x0 => x1 => x2 => Fm$Parser$file$adt$(x0, x1, x2);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $1655 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $1654 = $1655;
        } else {
            var $1656 = self.charCodeAt(0);
            var $1657 = self.slice(1);
            var $1658 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $1654 = $1658;
        };
        return $1654;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Fm$Parser$file$end$(_file$1, _code$2, _defs$3) {
        var $1659 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$4 => {
            var $1660 = Monad$bind$(Parser$monad)(Parser$eof)((_$5 => {
                var $1661 = Monad$pure$(Parser$monad)(_defs$3);
                return $1661;
            }));
            return $1660;
        }));
        return $1659;
    };
    const Fm$Parser$file$end = x0 => x1 => x2 => Fm$Parser$file$end$(x0, x1, x2);

    function Fm$Parser$file$(_file$1, _code$2, _defs$3) {
        var $1662 = Monad$bind$(Parser$monad)(Parser$is_eof)((_stop$4 => {
            var self = _stop$4;
            if (self) {
                var $1664 = Monad$pure$(Parser$monad)(_defs$3);
                var $1663 = $1664;
            } else {
                var $1665 = Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$("#"))((_$5 => {
                    var $1666 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_file$6 => {
                        var $1667 = Fm$Parser$file$(_file$6, _code$2, _defs$3);
                        return $1667;
                    }));
                    return $1666;
                })), List$cons$(Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$file$def$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$adt$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$end$(_file$1, _code$2, _defs$3), List$nil)))))((_defs$5 => {
                    var $1668 = Fm$Parser$file$(_file$1, _code$2, _defs$5);
                    return $1668;
                })), List$nil)));
                var $1663 = $1665;
            };
            return $1663;
        }));
        return $1662;
    };
    const Fm$Parser$file = x0 => x1 => x2 => Fm$Parser$file$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $1669 = null;
        return $1669;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $1671 = "";
                var $1670 = $1671;
                break;
            case 'List.cons':
                var $1672 = self.head;
                var $1673 = self.tail;
                var $1674 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $1675 = "";
                        return $1675;
                    } else {
                        var $1676 = _sep$1;
                        return $1676;
                    };
                })(), List$cons$($1672, List$cons$(String$join$go$(_sep$1, $1673, Bool$false), List$nil))));
                var $1670 = $1674;
                break;
        };
        return $1670;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $1677 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $1677;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Fm$highlight$end$(_col$1, _row$2, _res$3) {
        var $1678 = String$join$("\u{a}", _res$3);
        return $1678;
    };
    const Fm$highlight$end = x0 => x1 => x2 => Fm$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1680 = _a$4;
                var $1679 = $1680;
                break;
            case 'Maybe.some':
                var $1681 = self.value;
                var $1682 = _f$5($1681);
                var $1679 = $1682;
                break;
        };
        return $1679;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1684 = Bool$true;
            var $1683 = $1684;
        } else {
            var $1685 = (self - 1n);
            var $1686 = Bool$false;
            var $1683 = $1686;
        };
        return $1683;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1688 = Nat$zero;
            var $1687 = $1688;
        } else {
            var $1689 = (self - 1n);
            var $1690 = Nat$succ$(Nat$succ$(Nat$double$($1689)));
            var $1687 = $1690;
        };
        return $1687;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1692 = Nat$zero;
            var $1691 = $1692;
        } else {
            var $1693 = (self - 1n);
            var $1694 = $1693;
            var $1691 = $1694;
        };
        return $1691;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.nil':
                var $1696 = List$nil;
                var $1695 = $1696;
                break;
            case 'List.cons':
                var $1697 = self.head;
                var $1698 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $1700 = List$nil;
                    var $1699 = $1700;
                } else {
                    var $1701 = (self - 1n);
                    var $1702 = List$cons$($1697, List$take$($1701, $1698));
                    var $1699 = $1702;
                };
                var $1695 = $1699;
                break;
        };
        return $1695;
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
                    var $1703 = _res$2;
                    return $1703;
                } else {
                    var $1704 = self.charCodeAt(0);
                    var $1705 = self.slice(1);
                    var $1706 = String$reverse$go$($1705, String$cons$($1704, _res$2));
                    return $1706;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1707 = String$reverse$go$(_xs$1, String$nil);
        return $1707;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $1709 = _str$3;
            var $1708 = $1709;
        } else {
            var $1710 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $1712 = String$cons$(_chr$2, String$pad_right$($1710, _chr$2, ""));
                var $1711 = $1712;
            } else {
                var $1713 = self.charCodeAt(0);
                var $1714 = self.slice(1);
                var $1715 = String$cons$($1713, String$pad_right$($1710, _chr$2, $1714));
                var $1711 = $1715;
            };
            var $1708 = $1711;
        };
        return $1708;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $1716 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $1716;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $1717 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $1717;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $1718 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $1718;
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
                    var $1719 = Either$left$(_n$1);
                    return $1719;
                } else {
                    var $1720 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1722 = Either$right$(Nat$succ$($1720));
                        var $1721 = $1722;
                    } else {
                        var $1723 = (self - 1n);
                        var $1724 = Nat$sub_rem$($1723, $1720);
                        var $1721 = $1724;
                    };
                    return $1721;
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
                        var $1725 = self.value;
                        var $1726 = Nat$div_mod$go$($1725, _m$2, Nat$succ$(_d$3));
                        return $1726;
                    case 'Either.right':
                        var $1727 = self.value;
                        var $1728 = Pair$new$(_d$3, _n$1);
                        return $1728;
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
                        var $1729 = self.fst;
                        var $1730 = self.snd;
                        var self = $1729;
                        if (self === 0n) {
                            var $1732 = List$cons$($1730, _res$3);
                            var $1731 = $1732;
                        } else {
                            var $1733 = (self - 1n);
                            var $1734 = Nat$to_base$go$(_base$1, $1729, List$cons$($1730, _res$3));
                            var $1731 = $1734;
                        };
                        return $1731;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $1735 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $1735;
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
                    var $1736 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $1736;
                } else {
                    var $1737 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1739 = _r$3;
                        var $1738 = $1739;
                    } else {
                        var $1740 = (self - 1n);
                        var $1741 = Nat$mod$go$($1740, $1737, Nat$succ$(_r$3));
                        var $1738 = $1741;
                    };
                    return $1738;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $1742 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $1742;
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
                    var $1745 = 35;
                    var $1744 = $1745;
                    break;
                case 'Maybe.some':
                    var $1746 = self.value;
                    var $1747 = $1746;
                    var $1744 = $1747;
                    break;
            };
            var $1743 = $1744;
        } else {
            var $1748 = 35;
            var $1743 = $1748;
        };
        return $1743;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $1749 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $1750 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $1750;
        }));
        return $1749;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $1751 = Nat$to_string_base$(10n, _n$1);
        return $1751;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Fm$color$(_col$1, _str$2) {
        var $1752 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $1752;
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
                    var $1753 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    return $1753;
                } else {
                    var $1754 = self.charCodeAt(0);
                    var $1755 = self.slice(1);
                    var self = ($1754 === 10);
                    if (self) {
                        var _stp$11 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$11;
                        if (self) {
                            var $1758 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $1757 = $1758;
                        } else {
                            var _spa$12 = 3n;
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$12));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $1761 = Maybe$some$(_spa$12);
                                        var $1760 = $1761;
                                        break;
                                    case 'Maybe.some':
                                        var $1762 = self.value;
                                        var $1763 = Maybe$some$(Nat$pred$($1762));
                                        var $1760 = $1763;
                                        break;
                                };
                                var _lft$14 = $1760;
                            } else {
                                var $1764 = (self - 1n);
                                var $1765 = _lft$6;
                                var _lft$14 = $1765;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$take$(_siz$13, List$cons$(String$reverse$(_lin$7), _res$8));
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $1759 = Fm$highlight$tc$($1755, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $1757 = $1759;
                        };
                        var $1756 = $1757;
                    } else {
                        var _chr$11 = String$cons$($1754, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $1767 = String$reverse$(Fm$color$("31", Fm$color$("4", _chr$11)));
                            var _chr$12 = $1767;
                        } else {
                            var $1768 = _chr$11;
                            var _chr$12 = $1768;
                        };
                        var _ix0$13 = Nat$pred$(_ix0$2);
                        var _ix1$14 = Nat$pred$(_ix1$3);
                        var _col$15 = Nat$succ$(_col$4);
                        var _lin$16 = String$flatten$(List$cons$(_chr$12, List$cons$(_lin$7, List$nil)));
                        var $1766 = Fm$highlight$tc$($1755, _ix0$13, _ix1$14, _col$15, _row$5, _lft$6, _lin$16, _res$8);
                        var $1756 = $1766;
                    };
                    return $1756;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $1769 = Fm$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $1769;
    };
    const Fm$highlight = x0 => x1 => x2 => Fm$highlight$(x0, x1, x2);

    function Fm$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Fm$Parser$file$(_file$1, _code$2, _defs$3)(0n)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1771 = self.idx;
                var $1772 = self.code;
                var $1773 = self.err;
                var _err$7 = $1773;
                var _hig$8 = Fm$highlight$(_code$2, $1771, Nat$succ$($1771));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $1774 = Either$left$(_str$9);
                var $1770 = $1774;
                break;
            case 'Parser.Reply.value':
                var $1775 = self.idx;
                var $1776 = self.code;
                var $1777 = self.val;
                var $1778 = Either$right$($1777);
                var $1770 = $1778;
                break;
        };
        return $1770;
    };
    const Fm$Defs$read = x0 => x1 => x2 => Fm$Defs$read$(x0, x1, x2);

    function Fm$Synth$load$(_name$1, _defs$2) {
        var _file$3 = Fm$Synth$file_of$(_name$1);
        var $1779 = Monad$bind$(IO$monad)(IO$get_file$(_file$3))((_code$4 => {
            var _read$5 = Fm$Defs$read$(_file$3, _code$4, _defs$2);
            var self = _read$5;
            switch (self._) {
                case 'Either.left':
                    var $1781 = self.value;
                    var $1782 = Monad$pure$(IO$monad)(Maybe$none);
                    var $1780 = $1782;
                    break;
                case 'Either.right':
                    var $1783 = self.value;
                    var _defs$7 = $1783;
                    var self = Fm$get$(_name$1, _defs$7);
                    switch (self._) {
                        case 'Maybe.none':
                            var $1785 = Monad$pure$(IO$monad)(Maybe$none);
                            var $1784 = $1785;
                            break;
                        case 'Maybe.some':
                            var $1786 = self.value;
                            var $1787 = Monad$pure$(IO$monad)(Maybe$some$(_defs$7));
                            var $1784 = $1787;
                            break;
                    };
                    var $1780 = $1784;
                    break;
            };
            return $1780;
        }));
        return $1779;
    };
    const Fm$Synth$load = x0 => x1 => Fm$Synth$load$(x0, x1);

    function IO$print$(_text$1) {
        var $1788 = IO$ask$("print", _text$1, (_skip$2 => {
            var $1789 = IO$end$(Unit$new);
            return $1789;
        }));
        return $1788;
    };
    const IO$print = x0 => IO$print$(x0);
    const Fm$Status$wait = ({
        _: 'Fm.Status.wait'
    });

    function Fm$Check$(_V$1) {
        var $1790 = null;
        return $1790;
    };
    const Fm$Check = x0 => Fm$Check$(x0);

    function Fm$Check$result$(_value$2, _errors$3) {
        var $1791 = ({
            _: 'Fm.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $1791;
    };
    const Fm$Check$result = x0 => x1 => Fm$Check$result$(x0, x1);

    function Fm$Check$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'Fm.Check.result':
                var $1793 = self.value;
                var $1794 = self.errors;
                var self = $1793;
                switch (self._) {
                    case 'Maybe.none':
                        var $1796 = Fm$Check$result$(Maybe$none, $1794);
                        var $1795 = $1796;
                        break;
                    case 'Maybe.some':
                        var $1797 = self.value;
                        var self = _f$4($1797);
                        switch (self._) {
                            case 'Fm.Check.result':
                                var $1799 = self.value;
                                var $1800 = self.errors;
                                var $1801 = Fm$Check$result$($1799, List$concat$($1794, $1800));
                                var $1798 = $1801;
                                break;
                        };
                        var $1795 = $1798;
                        break;
                };
                var $1792 = $1795;
                break;
        };
        return $1792;
    };
    const Fm$Check$bind = x0 => x1 => Fm$Check$bind$(x0, x1);

    function Fm$Check$pure$(_value$2) {
        var $1802 = Fm$Check$result$(Maybe$some$(_value$2), List$nil);
        return $1802;
    };
    const Fm$Check$pure = x0 => Fm$Check$pure$(x0);
    const Fm$Check$monad = Monad$new$(Fm$Check$bind, Fm$Check$pure);

    function Fm$Error$undefined_reference$(_origin$1, _name$2) {
        var $1803 = ({
            _: 'Fm.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $1803;
    };
    const Fm$Error$undefined_reference = x0 => x1 => Fm$Error$undefined_reference$(x0, x1);

    function Fm$Error$waiting$(_name$1) {
        var $1804 = ({
            _: 'Fm.Error.waiting',
            'name': _name$1
        });
        return $1804;
    };
    const Fm$Error$waiting = x0 => Fm$Error$waiting$(x0);

    function Fm$Error$indirect$(_name$1) {
        var $1805 = ({
            _: 'Fm.Error.indirect',
            'name': _name$1
        });
        return $1805;
    };
    const Fm$Error$indirect = x0 => Fm$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1807 = Maybe$none;
                var $1806 = $1807;
                break;
            case 'Maybe.some':
                var $1808 = self.value;
                var $1809 = Maybe$some$(_f$4($1808));
                var $1806 = $1809;
                break;
        };
        return $1806;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Fm$MPath$o$(_path$1) {
        var $1810 = Maybe$mapped$(_path$1, Fm$Path$o);
        return $1810;
    };
    const Fm$MPath$o = x0 => Fm$MPath$o$(x0);

    function Fm$MPath$i$(_path$1) {
        var $1811 = Maybe$mapped$(_path$1, Fm$Path$i);
        return $1811;
    };
    const Fm$MPath$i = x0 => Fm$MPath$i$(x0);

    function Fm$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $1812 = ({
            _: 'Fm.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $1812;
    };
    const Fm$Error$cant_infer = x0 => x1 => x2 => Fm$Error$cant_infer$(x0, x1, x2);

    function Fm$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $1813 = ({
            _: 'Fm.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $1813;
    };
    const Fm$Error$type_mismatch = x0 => x1 => x2 => x3 => Fm$Error$type_mismatch$(x0, x1, x2, x3);

    function Fm$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $1814 = ({
            _: 'Fm.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $1814;
    };
    const Fm$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Fm$Error$show_goal$(x0, x1, x2, x3, x4);

    function Fm$Term$normalize$(_term$1, _defs$2) {
        var self = Fm$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $1816 = self.name;
                var $1817 = self.indx;
                var $1818 = Fm$Term$var$($1816, $1817);
                var $1815 = $1818;
                break;
            case 'Fm.Term.ref':
                var $1819 = self.name;
                var $1820 = Fm$Term$ref$($1819);
                var $1815 = $1820;
                break;
            case 'Fm.Term.typ':
                var $1821 = Fm$Term$typ;
                var $1815 = $1821;
                break;
            case 'Fm.Term.all':
                var $1822 = self.eras;
                var $1823 = self.self;
                var $1824 = self.name;
                var $1825 = self.xtyp;
                var $1826 = self.body;
                var $1827 = Fm$Term$all$($1822, $1823, $1824, Fm$Term$normalize$($1825, _defs$2), (_s$8 => _x$9 => {
                    var $1828 = Fm$Term$normalize$($1826(_s$8)(_x$9), _defs$2);
                    return $1828;
                }));
                var $1815 = $1827;
                break;
            case 'Fm.Term.lam':
                var $1829 = self.name;
                var $1830 = self.body;
                var $1831 = Fm$Term$lam$($1829, (_x$5 => {
                    var $1832 = Fm$Term$normalize$($1830(_x$5), _defs$2);
                    return $1832;
                }));
                var $1815 = $1831;
                break;
            case 'Fm.Term.app':
                var $1833 = self.func;
                var $1834 = self.argm;
                var $1835 = Fm$Term$app$(Fm$Term$normalize$($1833, _defs$2), Fm$Term$normalize$($1834, _defs$2));
                var $1815 = $1835;
                break;
            case 'Fm.Term.let':
                var $1836 = self.name;
                var $1837 = self.expr;
                var $1838 = self.body;
                var $1839 = Fm$Term$let$($1836, Fm$Term$normalize$($1837, _defs$2), (_x$6 => {
                    var $1840 = Fm$Term$normalize$($1838(_x$6), _defs$2);
                    return $1840;
                }));
                var $1815 = $1839;
                break;
            case 'Fm.Term.def':
                var $1841 = self.name;
                var $1842 = self.expr;
                var $1843 = self.body;
                var $1844 = Fm$Term$def$($1841, Fm$Term$normalize$($1842, _defs$2), (_x$6 => {
                    var $1845 = Fm$Term$normalize$($1843(_x$6), _defs$2);
                    return $1845;
                }));
                var $1815 = $1844;
                break;
            case 'Fm.Term.ann':
                var $1846 = self.done;
                var $1847 = self.term;
                var $1848 = self.type;
                var $1849 = Fm$Term$ann$($1846, Fm$Term$normalize$($1847, _defs$2), Fm$Term$normalize$($1848, _defs$2));
                var $1815 = $1849;
                break;
            case 'Fm.Term.gol':
                var $1850 = self.name;
                var $1851 = self.dref;
                var $1852 = self.verb;
                var $1853 = Fm$Term$gol$($1850, $1851, $1852);
                var $1815 = $1853;
                break;
            case 'Fm.Term.hol':
                var $1854 = self.path;
                var $1855 = Fm$Term$hol$($1854);
                var $1815 = $1855;
                break;
            case 'Fm.Term.nat':
                var $1856 = self.natx;
                var $1857 = Fm$Term$nat$($1856);
                var $1815 = $1857;
                break;
            case 'Fm.Term.chr':
                var $1858 = self.chrx;
                var $1859 = Fm$Term$chr$($1858);
                var $1815 = $1859;
                break;
            case 'Fm.Term.str':
                var $1860 = self.strx;
                var $1861 = Fm$Term$str$($1860);
                var $1815 = $1861;
                break;
            case 'Fm.Term.cse':
                var $1862 = self.path;
                var $1863 = self.expr;
                var $1864 = self.name;
                var $1865 = self.with;
                var $1866 = self.cses;
                var $1867 = self.moti;
                var $1868 = _term$1;
                var $1815 = $1868;
                break;
            case 'Fm.Term.ori':
                var $1869 = self.orig;
                var $1870 = self.expr;
                var $1871 = Fm$Term$normalize$($1870, _defs$2);
                var $1815 = $1871;
                break;
        };
        return $1815;
    };
    const Fm$Term$normalize = x0 => x1 => Fm$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1873 = List$nil;
                var $1872 = $1873;
                break;
            case 'List.cons':
                var $1874 = self.head;
                var $1875 = self.tail;
                var $1876 = $1875;
                var $1872 = $1876;
                break;
        };
        return $1872;
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
                        var $1877 = self.name;
                        var $1878 = self.indx;
                        var $1879 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1879;
                    case 'Fm.Term.ref':
                        var $1880 = self.name;
                        var $1881 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1881;
                    case 'Fm.Term.typ':
                        var $1882 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1882;
                    case 'Fm.Term.all':
                        var $1883 = self.eras;
                        var $1884 = self.self;
                        var $1885 = self.name;
                        var $1886 = self.xtyp;
                        var $1887 = self.body;
                        var $1888 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1888;
                    case 'Fm.Term.lam':
                        var $1889 = self.name;
                        var $1890 = self.body;
                        var $1891 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1891;
                    case 'Fm.Term.app':
                        var $1892 = self.func;
                        var $1893 = self.argm;
                        var $1894 = Fm$SmartMotive$vals$cont$(_expr$1, $1892, List$cons$($1893, _args$3), _defs$4);
                        return $1894;
                    case 'Fm.Term.let':
                        var $1895 = self.name;
                        var $1896 = self.expr;
                        var $1897 = self.body;
                        var $1898 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1898;
                    case 'Fm.Term.def':
                        var $1899 = self.name;
                        var $1900 = self.expr;
                        var $1901 = self.body;
                        var $1902 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1902;
                    case 'Fm.Term.ann':
                        var $1903 = self.done;
                        var $1904 = self.term;
                        var $1905 = self.type;
                        var $1906 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1906;
                    case 'Fm.Term.gol':
                        var $1907 = self.name;
                        var $1908 = self.dref;
                        var $1909 = self.verb;
                        var $1910 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1910;
                    case 'Fm.Term.hol':
                        var $1911 = self.path;
                        var $1912 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1912;
                    case 'Fm.Term.nat':
                        var $1913 = self.natx;
                        var $1914 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1914;
                    case 'Fm.Term.chr':
                        var $1915 = self.chrx;
                        var $1916 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1916;
                    case 'Fm.Term.str':
                        var $1917 = self.strx;
                        var $1918 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1918;
                    case 'Fm.Term.cse':
                        var $1919 = self.path;
                        var $1920 = self.expr;
                        var $1921 = self.name;
                        var $1922 = self.with;
                        var $1923 = self.cses;
                        var $1924 = self.moti;
                        var $1925 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1925;
                    case 'Fm.Term.ori':
                        var $1926 = self.orig;
                        var $1927 = self.expr;
                        var $1928 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1928;
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
                        var $1929 = self.name;
                        var $1930 = self.indx;
                        var $1931 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1931;
                    case 'Fm.Term.ref':
                        var $1932 = self.name;
                        var $1933 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1933;
                    case 'Fm.Term.typ':
                        var $1934 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1934;
                    case 'Fm.Term.all':
                        var $1935 = self.eras;
                        var $1936 = self.self;
                        var $1937 = self.name;
                        var $1938 = self.xtyp;
                        var $1939 = self.body;
                        var $1940 = Fm$SmartMotive$vals$(_expr$1, $1939(Fm$Term$typ)(Fm$Term$typ), _defs$3);
                        return $1940;
                    case 'Fm.Term.lam':
                        var $1941 = self.name;
                        var $1942 = self.body;
                        var $1943 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1943;
                    case 'Fm.Term.app':
                        var $1944 = self.func;
                        var $1945 = self.argm;
                        var $1946 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1946;
                    case 'Fm.Term.let':
                        var $1947 = self.name;
                        var $1948 = self.expr;
                        var $1949 = self.body;
                        var $1950 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1950;
                    case 'Fm.Term.def':
                        var $1951 = self.name;
                        var $1952 = self.expr;
                        var $1953 = self.body;
                        var $1954 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1954;
                    case 'Fm.Term.ann':
                        var $1955 = self.done;
                        var $1956 = self.term;
                        var $1957 = self.type;
                        var $1958 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1958;
                    case 'Fm.Term.gol':
                        var $1959 = self.name;
                        var $1960 = self.dref;
                        var $1961 = self.verb;
                        var $1962 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1962;
                    case 'Fm.Term.hol':
                        var $1963 = self.path;
                        var $1964 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1964;
                    case 'Fm.Term.nat':
                        var $1965 = self.natx;
                        var $1966 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1966;
                    case 'Fm.Term.chr':
                        var $1967 = self.chrx;
                        var $1968 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1968;
                    case 'Fm.Term.str':
                        var $1969 = self.strx;
                        var $1970 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1970;
                    case 'Fm.Term.cse':
                        var $1971 = self.path;
                        var $1972 = self.expr;
                        var $1973 = self.name;
                        var $1974 = self.with;
                        var $1975 = self.cses;
                        var $1976 = self.moti;
                        var $1977 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1977;
                    case 'Fm.Term.ori':
                        var $1978 = self.orig;
                        var $1979 = self.expr;
                        var $1980 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1980;
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
                        var $1981 = self.name;
                        var $1982 = self.indx;
                        var $1983 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1983;
                    case 'Fm.Term.ref':
                        var $1984 = self.name;
                        var $1985 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1985;
                    case 'Fm.Term.typ':
                        var $1986 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1986;
                    case 'Fm.Term.all':
                        var $1987 = self.eras;
                        var $1988 = self.self;
                        var $1989 = self.name;
                        var $1990 = self.xtyp;
                        var $1991 = self.body;
                        var $1992 = Fm$SmartMotive$nams$cont$(_name$1, $1991(Fm$Term$ref$($1988))(Fm$Term$ref$($1989)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($1989, List$nil)))), _binds$3), _defs$4);
                        return $1992;
                    case 'Fm.Term.lam':
                        var $1993 = self.name;
                        var $1994 = self.body;
                        var $1995 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1995;
                    case 'Fm.Term.app':
                        var $1996 = self.func;
                        var $1997 = self.argm;
                        var $1998 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1998;
                    case 'Fm.Term.let':
                        var $1999 = self.name;
                        var $2000 = self.expr;
                        var $2001 = self.body;
                        var $2002 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2002;
                    case 'Fm.Term.def':
                        var $2003 = self.name;
                        var $2004 = self.expr;
                        var $2005 = self.body;
                        var $2006 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2006;
                    case 'Fm.Term.ann':
                        var $2007 = self.done;
                        var $2008 = self.term;
                        var $2009 = self.type;
                        var $2010 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2010;
                    case 'Fm.Term.gol':
                        var $2011 = self.name;
                        var $2012 = self.dref;
                        var $2013 = self.verb;
                        var $2014 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2014;
                    case 'Fm.Term.hol':
                        var $2015 = self.path;
                        var $2016 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2016;
                    case 'Fm.Term.nat':
                        var $2017 = self.natx;
                        var $2018 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2018;
                    case 'Fm.Term.chr':
                        var $2019 = self.chrx;
                        var $2020 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2020;
                    case 'Fm.Term.str':
                        var $2021 = self.strx;
                        var $2022 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2022;
                    case 'Fm.Term.cse':
                        var $2023 = self.path;
                        var $2024 = self.expr;
                        var $2025 = self.name;
                        var $2026 = self.with;
                        var $2027 = self.cses;
                        var $2028 = self.moti;
                        var $2029 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2029;
                    case 'Fm.Term.ori':
                        var $2030 = self.orig;
                        var $2031 = self.expr;
                        var $2032 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2032;
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
                var $2034 = self.name;
                var $2035 = self.indx;
                var $2036 = List$nil;
                var $2033 = $2036;
                break;
            case 'Fm.Term.ref':
                var $2037 = self.name;
                var $2038 = List$nil;
                var $2033 = $2038;
                break;
            case 'Fm.Term.typ':
                var $2039 = List$nil;
                var $2033 = $2039;
                break;
            case 'Fm.Term.all':
                var $2040 = self.eras;
                var $2041 = self.self;
                var $2042 = self.name;
                var $2043 = self.xtyp;
                var $2044 = self.body;
                var $2045 = Fm$SmartMotive$nams$cont$(_name$1, $2043, List$nil, _defs$3);
                var $2033 = $2045;
                break;
            case 'Fm.Term.lam':
                var $2046 = self.name;
                var $2047 = self.body;
                var $2048 = List$nil;
                var $2033 = $2048;
                break;
            case 'Fm.Term.app':
                var $2049 = self.func;
                var $2050 = self.argm;
                var $2051 = List$nil;
                var $2033 = $2051;
                break;
            case 'Fm.Term.let':
                var $2052 = self.name;
                var $2053 = self.expr;
                var $2054 = self.body;
                var $2055 = List$nil;
                var $2033 = $2055;
                break;
            case 'Fm.Term.def':
                var $2056 = self.name;
                var $2057 = self.expr;
                var $2058 = self.body;
                var $2059 = List$nil;
                var $2033 = $2059;
                break;
            case 'Fm.Term.ann':
                var $2060 = self.done;
                var $2061 = self.term;
                var $2062 = self.type;
                var $2063 = List$nil;
                var $2033 = $2063;
                break;
            case 'Fm.Term.gol':
                var $2064 = self.name;
                var $2065 = self.dref;
                var $2066 = self.verb;
                var $2067 = List$nil;
                var $2033 = $2067;
                break;
            case 'Fm.Term.hol':
                var $2068 = self.path;
                var $2069 = List$nil;
                var $2033 = $2069;
                break;
            case 'Fm.Term.nat':
                var $2070 = self.natx;
                var $2071 = List$nil;
                var $2033 = $2071;
                break;
            case 'Fm.Term.chr':
                var $2072 = self.chrx;
                var $2073 = List$nil;
                var $2033 = $2073;
                break;
            case 'Fm.Term.str':
                var $2074 = self.strx;
                var $2075 = List$nil;
                var $2033 = $2075;
                break;
            case 'Fm.Term.cse':
                var $2076 = self.path;
                var $2077 = self.expr;
                var $2078 = self.name;
                var $2079 = self.with;
                var $2080 = self.cses;
                var $2081 = self.moti;
                var $2082 = List$nil;
                var $2033 = $2082;
                break;
            case 'Fm.Term.ori':
                var $2083 = self.orig;
                var $2084 = self.expr;
                var $2085 = List$nil;
                var $2033 = $2085;
                break;
        };
        return $2033;
    };
    const Fm$SmartMotive$nams = x0 => x1 => x2 => Fm$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.nil':
                var $2087 = List$nil;
                var $2086 = $2087;
                break;
            case 'List.cons':
                var $2088 = self.head;
                var $2089 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.nil':
                        var $2091 = List$nil;
                        var $2090 = $2091;
                        break;
                    case 'List.cons':
                        var $2092 = self.head;
                        var $2093 = self.tail;
                        var $2094 = List$cons$(Pair$new$($2088, $2092), List$zip$($2089, $2093));
                        var $2090 = $2094;
                        break;
                };
                var $2086 = $2090;
                break;
        };
        return $2086;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Fm$Term$serialize$name$(_name$1) {
        var $2095 = (fm_name_to_bits(_name$1));
        return $2095;
    };
    const Fm$Term$serialize$name = x0 => Fm$Term$serialize$name$(x0);

    function Fm$Term$serialize$(_term$1, _depth$2, _init$3, _x$4) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2097 = self.name;
                var $2098 = self.indx;
                var self = ($2098 >= _init$3);
                if (self) {
                    var _name$7 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $2098 <= 0n ? 0n : _depth$2 - $2098)))));
                    var $2100 = (((_name$7(_x$4) + '1') + '0') + '0');
                    var $2099 = $2100;
                } else {
                    var _name$7 = a1 => (a1 + (nat_to_bits($2098)));
                    var $2101 = (((_name$7(_x$4) + '0') + '1') + '0');
                    var $2099 = $2101;
                };
                var $2096 = $2099;
                break;
            case 'Fm.Term.ref':
                var $2102 = self.name;
                var _name$6 = a1 => (a1 + Fm$Term$serialize$name$($2102));
                var $2103 = (((_name$6(_x$4) + '0') + '0') + '0');
                var $2096 = $2103;
                break;
            case 'Fm.Term.typ':
                var $2104 = (((_x$4 + '1') + '1') + '0');
                var $2096 = $2104;
                break;
            case 'Fm.Term.all':
                var $2105 = self.eras;
                var $2106 = self.self;
                var $2107 = self.name;
                var $2108 = self.xtyp;
                var $2109 = self.body;
                var self = $2105;
                if (self) {
                    var $2111 = Bits$i;
                    var _eras$10 = $2111;
                } else {
                    var $2112 = Bits$o;
                    var _eras$10 = $2112;
                };
                var _self$11 = a1 => (a1 + (fm_name_to_bits($2106)));
                var _xtyp$12 = Fm$Term$serialize($2108)(_depth$2)(_init$3);
                var _body$13 = Fm$Term$serialize($2109(Fm$Term$var$($2106, _depth$2))(Fm$Term$var$($2107, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3);
                var $2110 = (((_eras$10(_self$11(_xtyp$12(_body$13(_x$4)))) + '0') + '0') + '1');
                var $2096 = $2110;
                break;
            case 'Fm.Term.lam':
                var $2113 = self.name;
                var $2114 = self.body;
                var _body$7 = Fm$Term$serialize($2114(Fm$Term$var$($2113, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2115 = (((_body$7(_x$4) + '1') + '0') + '1');
                var $2096 = $2115;
                break;
            case 'Fm.Term.app':
                var $2116 = self.func;
                var $2117 = self.argm;
                var _func$7 = Fm$Term$serialize($2116)(_depth$2)(_init$3);
                var _argm$8 = Fm$Term$serialize($2117)(_depth$2)(_init$3);
                var $2118 = (((_func$7(_argm$8(_x$4)) + '0') + '1') + '1');
                var $2096 = $2118;
                break;
            case 'Fm.Term.let':
                var $2119 = self.name;
                var $2120 = self.expr;
                var $2121 = self.body;
                var _expr$8 = Fm$Term$serialize($2120)(_depth$2)(_init$3);
                var _body$9 = Fm$Term$serialize($2121(Fm$Term$var$($2119, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2122 = (((_expr$8(_body$9(_x$4)) + '1') + '1') + '1');
                var $2096 = $2122;
                break;
            case 'Fm.Term.def':
                var $2123 = self.name;
                var $2124 = self.expr;
                var $2125 = self.body;
                var $2126 = Fm$Term$serialize$($2125($2124), _depth$2, _init$3, _x$4);
                var $2096 = $2126;
                break;
            case 'Fm.Term.ann':
                var $2127 = self.done;
                var $2128 = self.term;
                var $2129 = self.type;
                var $2130 = Fm$Term$serialize$($2128, _depth$2, _init$3, _x$4);
                var $2096 = $2130;
                break;
            case 'Fm.Term.gol':
                var $2131 = self.name;
                var $2132 = self.dref;
                var $2133 = self.verb;
                var _name$8 = a1 => (a1 + (fm_name_to_bits($2131)));
                var $2134 = (((_name$8(_x$4) + '0') + '0') + '0');
                var $2096 = $2134;
                break;
            case 'Fm.Term.hol':
                var $2135 = self.path;
                var $2136 = _x$4;
                var $2096 = $2136;
                break;
            case 'Fm.Term.nat':
                var $2137 = self.natx;
                var $2138 = Fm$Term$serialize$(Fm$Term$unroll_nat$($2137), _depth$2, _init$3, _x$4);
                var $2096 = $2138;
                break;
            case 'Fm.Term.chr':
                var $2139 = self.chrx;
                var $2140 = Fm$Term$serialize$(Fm$Term$unroll_chr$($2139), _depth$2, _init$3, _x$4);
                var $2096 = $2140;
                break;
            case 'Fm.Term.str':
                var $2141 = self.strx;
                var $2142 = Fm$Term$serialize$(Fm$Term$unroll_str$($2141), _depth$2, _init$3, _x$4);
                var $2096 = $2142;
                break;
            case 'Fm.Term.cse':
                var $2143 = self.path;
                var $2144 = self.expr;
                var $2145 = self.name;
                var $2146 = self.with;
                var $2147 = self.cses;
                var $2148 = self.moti;
                var $2149 = _x$4;
                var $2096 = $2149;
                break;
            case 'Fm.Term.ori':
                var $2150 = self.orig;
                var $2151 = self.expr;
                var $2152 = Fm$Term$serialize$($2151, _depth$2, _init$3, _x$4);
                var $2096 = $2152;
                break;
        };
        return $2096;
    };
    const Fm$Term$serialize = x0 => x1 => x2 => x3 => Fm$Term$serialize$(x0, x1, x2, x3);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Fm$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Fm$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$e);
        var _bh$5 = Fm$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$e);
        var $2153 = (_bh$5 === _ah$4);
        return $2153;
    };
    const Fm$Term$identical = x0 => x1 => x2 => Fm$Term$identical$(x0, x1, x2);

    function Fm$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Fm$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $2155 = _to$3;
            var $2154 = $2155;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $2157 = self.name;
                    var $2158 = self.indx;
                    var $2159 = Fm$Term$var$($2157, $2158);
                    var $2156 = $2159;
                    break;
                case 'Fm.Term.ref':
                    var $2160 = self.name;
                    var $2161 = Fm$Term$ref$($2160);
                    var $2156 = $2161;
                    break;
                case 'Fm.Term.typ':
                    var $2162 = Fm$Term$typ;
                    var $2156 = $2162;
                    break;
                case 'Fm.Term.all':
                    var $2163 = self.eras;
                    var $2164 = self.self;
                    var $2165 = self.name;
                    var $2166 = self.xtyp;
                    var $2167 = self.body;
                    var _xtyp$10 = Fm$SmartMotive$replace$($2166, _from$2, _to$3, _lv$4);
                    var _body$11 = $2167(Fm$Term$ref$($2164))(Fm$Term$ref$($2165));
                    var _body$12 = Fm$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $2168 = Fm$Term$all$($2163, $2164, $2165, _xtyp$10, (_s$13 => _x$14 => {
                        var $2169 = _body$12;
                        return $2169;
                    }));
                    var $2156 = $2168;
                    break;
                case 'Fm.Term.lam':
                    var $2170 = self.name;
                    var $2171 = self.body;
                    var _body$7 = $2171(Fm$Term$ref$($2170));
                    var _body$8 = Fm$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2172 = Fm$Term$lam$($2170, (_x$9 => {
                        var $2173 = _body$8;
                        return $2173;
                    }));
                    var $2156 = $2172;
                    break;
                case 'Fm.Term.app':
                    var $2174 = self.func;
                    var $2175 = self.argm;
                    var _func$7 = Fm$SmartMotive$replace$($2174, _from$2, _to$3, _lv$4);
                    var _argm$8 = Fm$SmartMotive$replace$($2175, _from$2, _to$3, _lv$4);
                    var $2176 = Fm$Term$app$(_func$7, _argm$8);
                    var $2156 = $2176;
                    break;
                case 'Fm.Term.let':
                    var $2177 = self.name;
                    var $2178 = self.expr;
                    var $2179 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2178, _from$2, _to$3, _lv$4);
                    var _body$9 = $2179(Fm$Term$ref$($2177));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2180 = Fm$Term$let$($2177, _expr$8, (_x$11 => {
                        var $2181 = _body$10;
                        return $2181;
                    }));
                    var $2156 = $2180;
                    break;
                case 'Fm.Term.def':
                    var $2182 = self.name;
                    var $2183 = self.expr;
                    var $2184 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2183, _from$2, _to$3, _lv$4);
                    var _body$9 = $2184(Fm$Term$ref$($2182));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2185 = Fm$Term$def$($2182, _expr$8, (_x$11 => {
                        var $2186 = _body$10;
                        return $2186;
                    }));
                    var $2156 = $2185;
                    break;
                case 'Fm.Term.ann':
                    var $2187 = self.done;
                    var $2188 = self.term;
                    var $2189 = self.type;
                    var _term$8 = Fm$SmartMotive$replace$($2188, _from$2, _to$3, _lv$4);
                    var _type$9 = Fm$SmartMotive$replace$($2189, _from$2, _to$3, _lv$4);
                    var $2190 = Fm$Term$ann$($2187, _term$8, _type$9);
                    var $2156 = $2190;
                    break;
                case 'Fm.Term.gol':
                    var $2191 = self.name;
                    var $2192 = self.dref;
                    var $2193 = self.verb;
                    var $2194 = _term$1;
                    var $2156 = $2194;
                    break;
                case 'Fm.Term.hol':
                    var $2195 = self.path;
                    var $2196 = _term$1;
                    var $2156 = $2196;
                    break;
                case 'Fm.Term.nat':
                    var $2197 = self.natx;
                    var $2198 = _term$1;
                    var $2156 = $2198;
                    break;
                case 'Fm.Term.chr':
                    var $2199 = self.chrx;
                    var $2200 = _term$1;
                    var $2156 = $2200;
                    break;
                case 'Fm.Term.str':
                    var $2201 = self.strx;
                    var $2202 = _term$1;
                    var $2156 = $2202;
                    break;
                case 'Fm.Term.cse':
                    var $2203 = self.path;
                    var $2204 = self.expr;
                    var $2205 = self.name;
                    var $2206 = self.with;
                    var $2207 = self.cses;
                    var $2208 = self.moti;
                    var $2209 = _term$1;
                    var $2156 = $2209;
                    break;
                case 'Fm.Term.ori':
                    var $2210 = self.orig;
                    var $2211 = self.expr;
                    var $2212 = Fm$SmartMotive$replace$($2211, _from$2, _to$3, _lv$4);
                    var $2156 = $2212;
                    break;
            };
            var $2154 = $2156;
        };
        return $2154;
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
                    var $2215 = self.fst;
                    var $2216 = self.snd;
                    var $2217 = Fm$SmartMotive$replace$(_moti$11, $2216, Fm$Term$ref$($2215), _lv$5);
                    var $2214 = $2217;
                    break;
            };
            return $2214;
        }));
        var $2213 = _moti$10;
        return $2213;
    };
    const Fm$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Fm$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Fm$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.nil':
                var $2219 = _moti$2;
                var $2218 = $2219;
                break;
            case 'List.cons':
                var $2220 = self.head;
                var $2221 = self.tail;
                var self = $2220;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $2223 = self.file;
                        var $2224 = self.code;
                        var $2225 = self.name;
                        var $2226 = self.term;
                        var $2227 = self.type;
                        var $2228 = self.stat;
                        var $2229 = Fm$Term$all$(Bool$false, "", $2225, $2227, (_s$11 => _x$12 => {
                            var $2230 = Fm$Term$desugar_cse$motive$($2221, _moti$2);
                            return $2230;
                        }));
                        var $2222 = $2229;
                        break;
                };
                var $2218 = $2222;
                break;
        };
        return $2218;
    };
    const Fm$Term$desugar_cse$motive = x0 => x1 => Fm$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $2232 = Bool$true;
            var $2231 = $2232;
        } else {
            var $2233 = self.charCodeAt(0);
            var $2234 = self.slice(1);
            var $2235 = Bool$false;
            var $2231 = $2235;
        };
        return $2231;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Fm$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $2237 = self.name;
                var $2238 = self.indx;
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
                var $2236 = $2239;
                break;
            case 'Fm.Term.ref':
                var $2252 = self.name;
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
                                var $2264 = Fm$Term$lam$($2260, (_x$15 => {
                                    var $2265 = Fm$Term$desugar_cse$argument$(_name$1, $2256, _type$3, _body$4, _defs$5);
                                    return $2265;
                                }));
                                var $2257 = $2264;
                                break;
                        };
                        var $2253 = $2257;
                        break;
                };
                var $2236 = $2253;
                break;
            case 'Fm.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2267 = _body$4;
                        var $2266 = $2267;
                        break;
                    case 'List.cons':
                        var $2268 = self.head;
                        var $2269 = self.tail;
                        var self = $2268;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2271 = self.file;
                                var $2272 = self.code;
                                var $2273 = self.name;
                                var $2274 = self.term;
                                var $2275 = self.type;
                                var $2276 = self.stat;
                                var $2277 = Fm$Term$lam$($2273, (_x$14 => {
                                    var $2278 = Fm$Term$desugar_cse$argument$(_name$1, $2269, _type$3, _body$4, _defs$5);
                                    return $2278;
                                }));
                                var $2270 = $2277;
                                break;
                        };
                        var $2266 = $2270;
                        break;
                };
                var $2236 = $2266;
                break;
            case 'Fm.Term.all':
                var $2279 = self.eras;
                var $2280 = self.self;
                var $2281 = self.name;
                var $2282 = self.xtyp;
                var $2283 = self.body;
                var $2284 = Fm$Term$lam$((() => {
                    var self = String$is_empty$($2281);
                    if (self) {
                        var $2285 = _name$1;
                        return $2285;
                    } else {
                        var $2286 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($2281, List$nil))));
                        return $2286;
                    };
                })(), (_x$11 => {
                    var $2287 = Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, $2283(Fm$Term$var$($2280, 0n))(Fm$Term$var$($2281, 0n)), _body$4, _defs$5);
                    return $2287;
                }));
                var $2236 = $2284;
                break;
            case 'Fm.Term.lam':
                var $2288 = self.name;
                var $2289 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2291 = _body$4;
                        var $2290 = $2291;
                        break;
                    case 'List.cons':
                        var $2292 = self.head;
                        var $2293 = self.tail;
                        var self = $2292;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2295 = self.file;
                                var $2296 = self.code;
                                var $2297 = self.name;
                                var $2298 = self.term;
                                var $2299 = self.type;
                                var $2300 = self.stat;
                                var $2301 = Fm$Term$lam$($2297, (_x$16 => {
                                    var $2302 = Fm$Term$desugar_cse$argument$(_name$1, $2293, _type$3, _body$4, _defs$5);
                                    return $2302;
                                }));
                                var $2294 = $2301;
                                break;
                        };
                        var $2290 = $2294;
                        break;
                };
                var $2236 = $2290;
                break;
            case 'Fm.Term.app':
                var $2303 = self.func;
                var $2304 = self.argm;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2306 = _body$4;
                        var $2305 = $2306;
                        break;
                    case 'List.cons':
                        var $2307 = self.head;
                        var $2308 = self.tail;
                        var self = $2307;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2310 = self.file;
                                var $2311 = self.code;
                                var $2312 = self.name;
                                var $2313 = self.term;
                                var $2314 = self.type;
                                var $2315 = self.stat;
                                var $2316 = Fm$Term$lam$($2312, (_x$16 => {
                                    var $2317 = Fm$Term$desugar_cse$argument$(_name$1, $2308, _type$3, _body$4, _defs$5);
                                    return $2317;
                                }));
                                var $2309 = $2316;
                                break;
                        };
                        var $2305 = $2309;
                        break;
                };
                var $2236 = $2305;
                break;
            case 'Fm.Term.let':
                var $2318 = self.name;
                var $2319 = self.expr;
                var $2320 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2322 = _body$4;
                        var $2321 = $2322;
                        break;
                    case 'List.cons':
                        var $2323 = self.head;
                        var $2324 = self.tail;
                        var self = $2323;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2326 = self.file;
                                var $2327 = self.code;
                                var $2328 = self.name;
                                var $2329 = self.term;
                                var $2330 = self.type;
                                var $2331 = self.stat;
                                var $2332 = Fm$Term$lam$($2328, (_x$17 => {
                                    var $2333 = Fm$Term$desugar_cse$argument$(_name$1, $2324, _type$3, _body$4, _defs$5);
                                    return $2333;
                                }));
                                var $2325 = $2332;
                                break;
                        };
                        var $2321 = $2325;
                        break;
                };
                var $2236 = $2321;
                break;
            case 'Fm.Term.def':
                var $2334 = self.name;
                var $2335 = self.expr;
                var $2336 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2338 = _body$4;
                        var $2337 = $2338;
                        break;
                    case 'List.cons':
                        var $2339 = self.head;
                        var $2340 = self.tail;
                        var self = $2339;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2342 = self.file;
                                var $2343 = self.code;
                                var $2344 = self.name;
                                var $2345 = self.term;
                                var $2346 = self.type;
                                var $2347 = self.stat;
                                var $2348 = Fm$Term$lam$($2344, (_x$17 => {
                                    var $2349 = Fm$Term$desugar_cse$argument$(_name$1, $2340, _type$3, _body$4, _defs$5);
                                    return $2349;
                                }));
                                var $2341 = $2348;
                                break;
                        };
                        var $2337 = $2341;
                        break;
                };
                var $2236 = $2337;
                break;
            case 'Fm.Term.ann':
                var $2350 = self.done;
                var $2351 = self.term;
                var $2352 = self.type;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2354 = _body$4;
                        var $2353 = $2354;
                        break;
                    case 'List.cons':
                        var $2355 = self.head;
                        var $2356 = self.tail;
                        var self = $2355;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2358 = self.file;
                                var $2359 = self.code;
                                var $2360 = self.name;
                                var $2361 = self.term;
                                var $2362 = self.type;
                                var $2363 = self.stat;
                                var $2364 = Fm$Term$lam$($2360, (_x$17 => {
                                    var $2365 = Fm$Term$desugar_cse$argument$(_name$1, $2356, _type$3, _body$4, _defs$5);
                                    return $2365;
                                }));
                                var $2357 = $2364;
                                break;
                        };
                        var $2353 = $2357;
                        break;
                };
                var $2236 = $2353;
                break;
            case 'Fm.Term.gol':
                var $2366 = self.name;
                var $2367 = self.dref;
                var $2368 = self.verb;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2370 = _body$4;
                        var $2369 = $2370;
                        break;
                    case 'List.cons':
                        var $2371 = self.head;
                        var $2372 = self.tail;
                        var self = $2371;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2374 = self.file;
                                var $2375 = self.code;
                                var $2376 = self.name;
                                var $2377 = self.term;
                                var $2378 = self.type;
                                var $2379 = self.stat;
                                var $2380 = Fm$Term$lam$($2376, (_x$17 => {
                                    var $2381 = Fm$Term$desugar_cse$argument$(_name$1, $2372, _type$3, _body$4, _defs$5);
                                    return $2381;
                                }));
                                var $2373 = $2380;
                                break;
                        };
                        var $2369 = $2373;
                        break;
                };
                var $2236 = $2369;
                break;
            case 'Fm.Term.hol':
                var $2382 = self.path;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2384 = _body$4;
                        var $2383 = $2384;
                        break;
                    case 'List.cons':
                        var $2385 = self.head;
                        var $2386 = self.tail;
                        var self = $2385;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2388 = self.file;
                                var $2389 = self.code;
                                var $2390 = self.name;
                                var $2391 = self.term;
                                var $2392 = self.type;
                                var $2393 = self.stat;
                                var $2394 = Fm$Term$lam$($2390, (_x$15 => {
                                    var $2395 = Fm$Term$desugar_cse$argument$(_name$1, $2386, _type$3, _body$4, _defs$5);
                                    return $2395;
                                }));
                                var $2387 = $2394;
                                break;
                        };
                        var $2383 = $2387;
                        break;
                };
                var $2236 = $2383;
                break;
            case 'Fm.Term.nat':
                var $2396 = self.natx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2398 = _body$4;
                        var $2397 = $2398;
                        break;
                    case 'List.cons':
                        var $2399 = self.head;
                        var $2400 = self.tail;
                        var self = $2399;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2402 = self.file;
                                var $2403 = self.code;
                                var $2404 = self.name;
                                var $2405 = self.term;
                                var $2406 = self.type;
                                var $2407 = self.stat;
                                var $2408 = Fm$Term$lam$($2404, (_x$15 => {
                                    var $2409 = Fm$Term$desugar_cse$argument$(_name$1, $2400, _type$3, _body$4, _defs$5);
                                    return $2409;
                                }));
                                var $2401 = $2408;
                                break;
                        };
                        var $2397 = $2401;
                        break;
                };
                var $2236 = $2397;
                break;
            case 'Fm.Term.chr':
                var $2410 = self.chrx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2412 = _body$4;
                        var $2411 = $2412;
                        break;
                    case 'List.cons':
                        var $2413 = self.head;
                        var $2414 = self.tail;
                        var self = $2413;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2416 = self.file;
                                var $2417 = self.code;
                                var $2418 = self.name;
                                var $2419 = self.term;
                                var $2420 = self.type;
                                var $2421 = self.stat;
                                var $2422 = Fm$Term$lam$($2418, (_x$15 => {
                                    var $2423 = Fm$Term$desugar_cse$argument$(_name$1, $2414, _type$3, _body$4, _defs$5);
                                    return $2423;
                                }));
                                var $2415 = $2422;
                                break;
                        };
                        var $2411 = $2415;
                        break;
                };
                var $2236 = $2411;
                break;
            case 'Fm.Term.str':
                var $2424 = self.strx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2426 = _body$4;
                        var $2425 = $2426;
                        break;
                    case 'List.cons':
                        var $2427 = self.head;
                        var $2428 = self.tail;
                        var self = $2427;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2430 = self.file;
                                var $2431 = self.code;
                                var $2432 = self.name;
                                var $2433 = self.term;
                                var $2434 = self.type;
                                var $2435 = self.stat;
                                var $2436 = Fm$Term$lam$($2432, (_x$15 => {
                                    var $2437 = Fm$Term$desugar_cse$argument$(_name$1, $2428, _type$3, _body$4, _defs$5);
                                    return $2437;
                                }));
                                var $2429 = $2436;
                                break;
                        };
                        var $2425 = $2429;
                        break;
                };
                var $2236 = $2425;
                break;
            case 'Fm.Term.cse':
                var $2438 = self.path;
                var $2439 = self.expr;
                var $2440 = self.name;
                var $2441 = self.with;
                var $2442 = self.cses;
                var $2443 = self.moti;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2445 = _body$4;
                        var $2444 = $2445;
                        break;
                    case 'List.cons':
                        var $2446 = self.head;
                        var $2447 = self.tail;
                        var self = $2446;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2449 = self.file;
                                var $2450 = self.code;
                                var $2451 = self.name;
                                var $2452 = self.term;
                                var $2453 = self.type;
                                var $2454 = self.stat;
                                var $2455 = Fm$Term$lam$($2451, (_x$20 => {
                                    var $2456 = Fm$Term$desugar_cse$argument$(_name$1, $2447, _type$3, _body$4, _defs$5);
                                    return $2456;
                                }));
                                var $2448 = $2455;
                                break;
                        };
                        var $2444 = $2448;
                        break;
                };
                var $2236 = $2444;
                break;
            case 'Fm.Term.ori':
                var $2457 = self.orig;
                var $2458 = self.expr;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2460 = _body$4;
                        var $2459 = $2460;
                        break;
                    case 'List.cons':
                        var $2461 = self.head;
                        var $2462 = self.tail;
                        var self = $2461;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2464 = self.file;
                                var $2465 = self.code;
                                var $2466 = self.name;
                                var $2467 = self.term;
                                var $2468 = self.type;
                                var $2469 = self.stat;
                                var $2470 = Fm$Term$lam$($2466, (_x$16 => {
                                    var $2471 = Fm$Term$desugar_cse$argument$(_name$1, $2462, _type$3, _body$4, _defs$5);
                                    return $2471;
                                }));
                                var $2463 = $2470;
                                break;
                        };
                        var $2459 = $2463;
                        break;
                };
                var $2236 = $2459;
                break;
        };
        return $2236;
    };
    const Fm$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Fm$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.none':
                var $2473 = _b$3;
                var $2472 = $2473;
                break;
            case 'Maybe.some':
                var $2474 = self.value;
                var $2475 = Maybe$some$($2474);
                var $2472 = $2475;
                break;
        };
        return $2472;
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
                        var $2476 = self.name;
                        var $2477 = self.indx;
                        var _expr$10 = (() => {
                            var $2480 = _expr$1;
                            var $2481 = _wyth$3;
                            let _expr$11 = $2480;
                            let _defn$10;
                            while ($2481._ === 'List.cons') {
                                _defn$10 = $2481.head;
                                var $2480 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2482 = self.file;
                                            var $2483 = self.code;
                                            var $2484 = self.name;
                                            var $2485 = self.term;
                                            var $2486 = self.type;
                                            var $2487 = self.stat;
                                            var $2488 = $2485;
                                            return $2488;
                                    };
                                })());
                                _expr$11 = $2480;
                                $2481 = $2481.tail;
                            }
                            return _expr$11;
                        })();
                        var $2478 = _expr$10;
                        return $2478;
                    case 'Fm.Term.ref':
                        var $2489 = self.name;
                        var _expr$9 = (() => {
                            var $2492 = _expr$1;
                            var $2493 = _wyth$3;
                            let _expr$10 = $2492;
                            let _defn$9;
                            while ($2493._ === 'List.cons') {
                                _defn$9 = $2493.head;
                                var $2492 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2494 = self.file;
                                            var $2495 = self.code;
                                            var $2496 = self.name;
                                            var $2497 = self.term;
                                            var $2498 = self.type;
                                            var $2499 = self.stat;
                                            var $2500 = $2497;
                                            return $2500;
                                    };
                                })());
                                _expr$10 = $2492;
                                $2493 = $2493.tail;
                            }
                            return _expr$10;
                        })();
                        var $2490 = _expr$9;
                        return $2490;
                    case 'Fm.Term.typ':
                        var _expr$8 = (() => {
                            var $2503 = _expr$1;
                            var $2504 = _wyth$3;
                            let _expr$9 = $2503;
                            let _defn$8;
                            while ($2504._ === 'List.cons') {
                                _defn$8 = $2504.head;
                                var $2503 = Fm$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2505 = self.file;
                                            var $2506 = self.code;
                                            var $2507 = self.name;
                                            var $2508 = self.term;
                                            var $2509 = self.type;
                                            var $2510 = self.stat;
                                            var $2511 = $2508;
                                            return $2511;
                                    };
                                })());
                                _expr$9 = $2503;
                                $2504 = $2504.tail;
                            }
                            return _expr$9;
                        })();
                        var $2501 = _expr$8;
                        return $2501;
                    case 'Fm.Term.all':
                        var $2512 = self.eras;
                        var $2513 = self.self;
                        var $2514 = self.name;
                        var $2515 = self.xtyp;
                        var $2516 = self.body;
                        var _got$13 = Maybe$or$(Fm$get$($2514, _cses$4), Fm$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $2520 = _expr$1;
                                    var $2521 = _wyth$3;
                                    let _expr$15 = $2520;
                                    let _defn$14;
                                    while ($2521._ === 'List.cons') {
                                        _defn$14 = $2521.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Fm.Def.new':
                                                var $2522 = self.file;
                                                var $2523 = self.code;
                                                var $2524 = self.name;
                                                var $2525 = self.term;
                                                var $2526 = self.type;
                                                var $2527 = self.stat;
                                                var $2528 = Fm$Term$app$(_expr$15, $2525);
                                                var $2520 = $2528;
                                                break;
                                        };
                                        _expr$15 = $2520;
                                        $2521 = $2521.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $2518 = _expr$14;
                                var $2517 = $2518;
                                break;
                            case 'Maybe.some':
                                var $2529 = self.value;
                                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, _wyth$3, $2515, $2529, _defs$6);
                                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $2516(Fm$Term$var$($2513, 0n))(Fm$Term$var$($2514, 0n));
                                var $2530 = Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $2517 = $2530;
                                break;
                        };
                        return $2517;
                    case 'Fm.Term.lam':
                        var $2531 = self.name;
                        var $2532 = self.body;
                        var _expr$10 = (() => {
                            var $2535 = _expr$1;
                            var $2536 = _wyth$3;
                            let _expr$11 = $2535;
                            let _defn$10;
                            while ($2536._ === 'List.cons') {
                                _defn$10 = $2536.head;
                                var $2535 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2537 = self.file;
                                            var $2538 = self.code;
                                            var $2539 = self.name;
                                            var $2540 = self.term;
                                            var $2541 = self.type;
                                            var $2542 = self.stat;
                                            var $2543 = $2540;
                                            return $2543;
                                    };
                                })());
                                _expr$11 = $2535;
                                $2536 = $2536.tail;
                            }
                            return _expr$11;
                        })();
                        var $2533 = _expr$10;
                        return $2533;
                    case 'Fm.Term.app':
                        var $2544 = self.func;
                        var $2545 = self.argm;
                        var _expr$10 = (() => {
                            var $2548 = _expr$1;
                            var $2549 = _wyth$3;
                            let _expr$11 = $2548;
                            let _defn$10;
                            while ($2549._ === 'List.cons') {
                                _defn$10 = $2549.head;
                                var $2548 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2550 = self.file;
                                            var $2551 = self.code;
                                            var $2552 = self.name;
                                            var $2553 = self.term;
                                            var $2554 = self.type;
                                            var $2555 = self.stat;
                                            var $2556 = $2553;
                                            return $2556;
                                    };
                                })());
                                _expr$11 = $2548;
                                $2549 = $2549.tail;
                            }
                            return _expr$11;
                        })();
                        var $2546 = _expr$10;
                        return $2546;
                    case 'Fm.Term.let':
                        var $2557 = self.name;
                        var $2558 = self.expr;
                        var $2559 = self.body;
                        var _expr$11 = (() => {
                            var $2562 = _expr$1;
                            var $2563 = _wyth$3;
                            let _expr$12 = $2562;
                            let _defn$11;
                            while ($2563._ === 'List.cons') {
                                _defn$11 = $2563.head;
                                var $2562 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2564 = self.file;
                                            var $2565 = self.code;
                                            var $2566 = self.name;
                                            var $2567 = self.term;
                                            var $2568 = self.type;
                                            var $2569 = self.stat;
                                            var $2570 = $2567;
                                            return $2570;
                                    };
                                })());
                                _expr$12 = $2562;
                                $2563 = $2563.tail;
                            }
                            return _expr$12;
                        })();
                        var $2560 = _expr$11;
                        return $2560;
                    case 'Fm.Term.def':
                        var $2571 = self.name;
                        var $2572 = self.expr;
                        var $2573 = self.body;
                        var _expr$11 = (() => {
                            var $2576 = _expr$1;
                            var $2577 = _wyth$3;
                            let _expr$12 = $2576;
                            let _defn$11;
                            while ($2577._ === 'List.cons') {
                                _defn$11 = $2577.head;
                                var $2576 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2578 = self.file;
                                            var $2579 = self.code;
                                            var $2580 = self.name;
                                            var $2581 = self.term;
                                            var $2582 = self.type;
                                            var $2583 = self.stat;
                                            var $2584 = $2581;
                                            return $2584;
                                    };
                                })());
                                _expr$12 = $2576;
                                $2577 = $2577.tail;
                            }
                            return _expr$12;
                        })();
                        var $2574 = _expr$11;
                        return $2574;
                    case 'Fm.Term.ann':
                        var $2585 = self.done;
                        var $2586 = self.term;
                        var $2587 = self.type;
                        var _expr$11 = (() => {
                            var $2590 = _expr$1;
                            var $2591 = _wyth$3;
                            let _expr$12 = $2590;
                            let _defn$11;
                            while ($2591._ === 'List.cons') {
                                _defn$11 = $2591.head;
                                var $2590 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2592 = self.file;
                                            var $2593 = self.code;
                                            var $2594 = self.name;
                                            var $2595 = self.term;
                                            var $2596 = self.type;
                                            var $2597 = self.stat;
                                            var $2598 = $2595;
                                            return $2598;
                                    };
                                })());
                                _expr$12 = $2590;
                                $2591 = $2591.tail;
                            }
                            return _expr$12;
                        })();
                        var $2588 = _expr$11;
                        return $2588;
                    case 'Fm.Term.gol':
                        var $2599 = self.name;
                        var $2600 = self.dref;
                        var $2601 = self.verb;
                        var _expr$11 = (() => {
                            var $2604 = _expr$1;
                            var $2605 = _wyth$3;
                            let _expr$12 = $2604;
                            let _defn$11;
                            while ($2605._ === 'List.cons') {
                                _defn$11 = $2605.head;
                                var $2604 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2606 = self.file;
                                            var $2607 = self.code;
                                            var $2608 = self.name;
                                            var $2609 = self.term;
                                            var $2610 = self.type;
                                            var $2611 = self.stat;
                                            var $2612 = $2609;
                                            return $2612;
                                    };
                                })());
                                _expr$12 = $2604;
                                $2605 = $2605.tail;
                            }
                            return _expr$12;
                        })();
                        var $2602 = _expr$11;
                        return $2602;
                    case 'Fm.Term.hol':
                        var $2613 = self.path;
                        var _expr$9 = (() => {
                            var $2616 = _expr$1;
                            var $2617 = _wyth$3;
                            let _expr$10 = $2616;
                            let _defn$9;
                            while ($2617._ === 'List.cons') {
                                _defn$9 = $2617.head;
                                var $2616 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2618 = self.file;
                                            var $2619 = self.code;
                                            var $2620 = self.name;
                                            var $2621 = self.term;
                                            var $2622 = self.type;
                                            var $2623 = self.stat;
                                            var $2624 = $2621;
                                            return $2624;
                                    };
                                })());
                                _expr$10 = $2616;
                                $2617 = $2617.tail;
                            }
                            return _expr$10;
                        })();
                        var $2614 = _expr$9;
                        return $2614;
                    case 'Fm.Term.nat':
                        var $2625 = self.natx;
                        var _expr$9 = (() => {
                            var $2628 = _expr$1;
                            var $2629 = _wyth$3;
                            let _expr$10 = $2628;
                            let _defn$9;
                            while ($2629._ === 'List.cons') {
                                _defn$9 = $2629.head;
                                var $2628 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2630 = self.file;
                                            var $2631 = self.code;
                                            var $2632 = self.name;
                                            var $2633 = self.term;
                                            var $2634 = self.type;
                                            var $2635 = self.stat;
                                            var $2636 = $2633;
                                            return $2636;
                                    };
                                })());
                                _expr$10 = $2628;
                                $2629 = $2629.tail;
                            }
                            return _expr$10;
                        })();
                        var $2626 = _expr$9;
                        return $2626;
                    case 'Fm.Term.chr':
                        var $2637 = self.chrx;
                        var _expr$9 = (() => {
                            var $2640 = _expr$1;
                            var $2641 = _wyth$3;
                            let _expr$10 = $2640;
                            let _defn$9;
                            while ($2641._ === 'List.cons') {
                                _defn$9 = $2641.head;
                                var $2640 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2642 = self.file;
                                            var $2643 = self.code;
                                            var $2644 = self.name;
                                            var $2645 = self.term;
                                            var $2646 = self.type;
                                            var $2647 = self.stat;
                                            var $2648 = $2645;
                                            return $2648;
                                    };
                                })());
                                _expr$10 = $2640;
                                $2641 = $2641.tail;
                            }
                            return _expr$10;
                        })();
                        var $2638 = _expr$9;
                        return $2638;
                    case 'Fm.Term.str':
                        var $2649 = self.strx;
                        var _expr$9 = (() => {
                            var $2652 = _expr$1;
                            var $2653 = _wyth$3;
                            let _expr$10 = $2652;
                            let _defn$9;
                            while ($2653._ === 'List.cons') {
                                _defn$9 = $2653.head;
                                var $2652 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2654 = self.file;
                                            var $2655 = self.code;
                                            var $2656 = self.name;
                                            var $2657 = self.term;
                                            var $2658 = self.type;
                                            var $2659 = self.stat;
                                            var $2660 = $2657;
                                            return $2660;
                                    };
                                })());
                                _expr$10 = $2652;
                                $2653 = $2653.tail;
                            }
                            return _expr$10;
                        })();
                        var $2650 = _expr$9;
                        return $2650;
                    case 'Fm.Term.cse':
                        var $2661 = self.path;
                        var $2662 = self.expr;
                        var $2663 = self.name;
                        var $2664 = self.with;
                        var $2665 = self.cses;
                        var $2666 = self.moti;
                        var _expr$14 = (() => {
                            var $2669 = _expr$1;
                            var $2670 = _wyth$3;
                            let _expr$15 = $2669;
                            let _defn$14;
                            while ($2670._ === 'List.cons') {
                                _defn$14 = $2670.head;
                                var $2669 = Fm$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2671 = self.file;
                                            var $2672 = self.code;
                                            var $2673 = self.name;
                                            var $2674 = self.term;
                                            var $2675 = self.type;
                                            var $2676 = self.stat;
                                            var $2677 = $2674;
                                            return $2677;
                                    };
                                })());
                                _expr$15 = $2669;
                                $2670 = $2670.tail;
                            }
                            return _expr$15;
                        })();
                        var $2667 = _expr$14;
                        return $2667;
                    case 'Fm.Term.ori':
                        var $2678 = self.orig;
                        var $2679 = self.expr;
                        var _expr$10 = (() => {
                            var $2682 = _expr$1;
                            var $2683 = _wyth$3;
                            let _expr$11 = $2682;
                            let _defn$10;
                            while ($2683._ === 'List.cons') {
                                _defn$10 = $2683.head;
                                var $2682 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2684 = self.file;
                                            var $2685 = self.code;
                                            var $2686 = self.name;
                                            var $2687 = self.term;
                                            var $2688 = self.type;
                                            var $2689 = self.stat;
                                            var $2690 = $2687;
                                            return $2690;
                                    };
                                })());
                                _expr$11 = $2682;
                                $2683 = $2683.tail;
                            }
                            return _expr$11;
                        })();
                        var $2680 = _expr$10;
                        return $2680;
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
                var $2692 = self.name;
                var $2693 = self.indx;
                var $2694 = Maybe$none;
                var $2691 = $2694;
                break;
            case 'Fm.Term.ref':
                var $2695 = self.name;
                var $2696 = Maybe$none;
                var $2691 = $2696;
                break;
            case 'Fm.Term.typ':
                var $2697 = Maybe$none;
                var $2691 = $2697;
                break;
            case 'Fm.Term.all':
                var $2698 = self.eras;
                var $2699 = self.self;
                var $2700 = self.name;
                var $2701 = self.xtyp;
                var $2702 = self.body;
                var _moti$14 = Fm$Term$desugar_cse$motive$(_with$3, _moti$5);
                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, List$nil, $2701, _moti$14, _defs$7);
                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                var _type$17 = $2702(Fm$Term$var$($2699, 0n))(Fm$Term$var$($2700, 0n));
                var $2703 = Maybe$some$(Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _with$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $2691 = $2703;
                break;
            case 'Fm.Term.lam':
                var $2704 = self.name;
                var $2705 = self.body;
                var $2706 = Maybe$none;
                var $2691 = $2706;
                break;
            case 'Fm.Term.app':
                var $2707 = self.func;
                var $2708 = self.argm;
                var $2709 = Maybe$none;
                var $2691 = $2709;
                break;
            case 'Fm.Term.let':
                var $2710 = self.name;
                var $2711 = self.expr;
                var $2712 = self.body;
                var $2713 = Maybe$none;
                var $2691 = $2713;
                break;
            case 'Fm.Term.def':
                var $2714 = self.name;
                var $2715 = self.expr;
                var $2716 = self.body;
                var $2717 = Maybe$none;
                var $2691 = $2717;
                break;
            case 'Fm.Term.ann':
                var $2718 = self.done;
                var $2719 = self.term;
                var $2720 = self.type;
                var $2721 = Maybe$none;
                var $2691 = $2721;
                break;
            case 'Fm.Term.gol':
                var $2722 = self.name;
                var $2723 = self.dref;
                var $2724 = self.verb;
                var $2725 = Maybe$none;
                var $2691 = $2725;
                break;
            case 'Fm.Term.hol':
                var $2726 = self.path;
                var $2727 = Maybe$none;
                var $2691 = $2727;
                break;
            case 'Fm.Term.nat':
                var $2728 = self.natx;
                var $2729 = Maybe$none;
                var $2691 = $2729;
                break;
            case 'Fm.Term.chr':
                var $2730 = self.chrx;
                var $2731 = Maybe$none;
                var $2691 = $2731;
                break;
            case 'Fm.Term.str':
                var $2732 = self.strx;
                var $2733 = Maybe$none;
                var $2691 = $2733;
                break;
            case 'Fm.Term.cse':
                var $2734 = self.path;
                var $2735 = self.expr;
                var $2736 = self.name;
                var $2737 = self.with;
                var $2738 = self.cses;
                var $2739 = self.moti;
                var $2740 = Maybe$none;
                var $2691 = $2740;
                break;
            case 'Fm.Term.ori':
                var $2741 = self.orig;
                var $2742 = self.expr;
                var $2743 = Maybe$none;
                var $2691 = $2743;
                break;
        };
        return $2691;
    };
    const Fm$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Error$patch$(_path$1, _term$2) {
        var $2744 = ({
            _: 'Fm.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $2744;
    };
    const Fm$Error$patch = x0 => x1 => Fm$Error$patch$(x0, x1);

    function Fm$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.none':
                var $2746 = Bits$e;
                var $2745 = $2746;
                break;
            case 'Maybe.some':
                var $2747 = self.value;
                var $2748 = $2747(Bits$e);
                var $2745 = $2748;
                break;
        };
        return $2745;
    };
    const Fm$MPath$to_bits = x0 => Fm$MPath$to_bits$(x0);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $2750 = Bool$false;
                var $2749 = $2750;
                break;
            case 'Maybe.some':
                var $2751 = self.value;
                var $2752 = Bool$true;
                var $2749 = $2752;
                break;
        };
        return $2749;
    };
    const Set$has = x0 => x1 => Set$has$(x0, x1);

    function Fm$Term$equal$patch$(_path$2, _term$3, _ret$4) {
        var $2753 = Fm$Check$result$(Maybe$some$(_ret$4), List$cons$(Fm$Error$patch$(_path$2, Fm$Term$normalize$(_term$3, Map$new)), List$nil));
        return $2753;
    };
    const Fm$Term$equal$patch = x0 => x1 => x2 => Fm$Term$equal$patch$(x0, x1, x2);

    function Fm$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2755 = self.name;
                var $2756 = self.indx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2758 = self.name;
                        var $2759 = self.indx;
                        var $2760 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2760;
                        break;
                    case 'Fm.Term.ref':
                        var $2761 = self.name;
                        var $2762 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2762;
                        break;
                    case 'Fm.Term.typ':
                        var $2763 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2763;
                        break;
                    case 'Fm.Term.all':
                        var $2764 = self.eras;
                        var $2765 = self.self;
                        var $2766 = self.name;
                        var $2767 = self.xtyp;
                        var $2768 = self.body;
                        var $2769 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2769;
                        break;
                    case 'Fm.Term.lam':
                        var $2770 = self.name;
                        var $2771 = self.body;
                        var $2772 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2772;
                        break;
                    case 'Fm.Term.app':
                        var $2773 = self.func;
                        var $2774 = self.argm;
                        var $2775 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2775;
                        break;
                    case 'Fm.Term.let':
                        var $2776 = self.name;
                        var $2777 = self.expr;
                        var $2778 = self.body;
                        var $2779 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2779;
                        break;
                    case 'Fm.Term.def':
                        var $2780 = self.name;
                        var $2781 = self.expr;
                        var $2782 = self.body;
                        var $2783 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2783;
                        break;
                    case 'Fm.Term.ann':
                        var $2784 = self.done;
                        var $2785 = self.term;
                        var $2786 = self.type;
                        var $2787 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2787;
                        break;
                    case 'Fm.Term.gol':
                        var $2788 = self.name;
                        var $2789 = self.dref;
                        var $2790 = self.verb;
                        var $2791 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2791;
                        break;
                    case 'Fm.Term.hol':
                        var $2792 = self.path;
                        var $2793 = Fm$Term$equal$patch$($2792, _a$1, Unit$new);
                        var $2757 = $2793;
                        break;
                    case 'Fm.Term.nat':
                        var $2794 = self.natx;
                        var $2795 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2795;
                        break;
                    case 'Fm.Term.chr':
                        var $2796 = self.chrx;
                        var $2797 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2797;
                        break;
                    case 'Fm.Term.str':
                        var $2798 = self.strx;
                        var $2799 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2799;
                        break;
                    case 'Fm.Term.cse':
                        var $2800 = self.path;
                        var $2801 = self.expr;
                        var $2802 = self.name;
                        var $2803 = self.with;
                        var $2804 = self.cses;
                        var $2805 = self.moti;
                        var $2806 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2757 = $2806;
                        break;
                    case 'Fm.Term.ori':
                        var $2807 = self.orig;
                        var $2808 = self.expr;
                        var $2809 = Fm$Term$equal$extra_holes$(_a$1, $2808);
                        var $2757 = $2809;
                        break;
                };
                var $2754 = $2757;
                break;
            case 'Fm.Term.ref':
                var $2810 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2812 = self.name;
                        var $2813 = self.indx;
                        var $2814 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2814;
                        break;
                    case 'Fm.Term.ref':
                        var $2815 = self.name;
                        var $2816 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2816;
                        break;
                    case 'Fm.Term.typ':
                        var $2817 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2817;
                        break;
                    case 'Fm.Term.all':
                        var $2818 = self.eras;
                        var $2819 = self.self;
                        var $2820 = self.name;
                        var $2821 = self.xtyp;
                        var $2822 = self.body;
                        var $2823 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2823;
                        break;
                    case 'Fm.Term.lam':
                        var $2824 = self.name;
                        var $2825 = self.body;
                        var $2826 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2826;
                        break;
                    case 'Fm.Term.app':
                        var $2827 = self.func;
                        var $2828 = self.argm;
                        var $2829 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2829;
                        break;
                    case 'Fm.Term.let':
                        var $2830 = self.name;
                        var $2831 = self.expr;
                        var $2832 = self.body;
                        var $2833 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2833;
                        break;
                    case 'Fm.Term.def':
                        var $2834 = self.name;
                        var $2835 = self.expr;
                        var $2836 = self.body;
                        var $2837 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2837;
                        break;
                    case 'Fm.Term.ann':
                        var $2838 = self.done;
                        var $2839 = self.term;
                        var $2840 = self.type;
                        var $2841 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2841;
                        break;
                    case 'Fm.Term.gol':
                        var $2842 = self.name;
                        var $2843 = self.dref;
                        var $2844 = self.verb;
                        var $2845 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2845;
                        break;
                    case 'Fm.Term.hol':
                        var $2846 = self.path;
                        var $2847 = Fm$Term$equal$patch$($2846, _a$1, Unit$new);
                        var $2811 = $2847;
                        break;
                    case 'Fm.Term.nat':
                        var $2848 = self.natx;
                        var $2849 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2849;
                        break;
                    case 'Fm.Term.chr':
                        var $2850 = self.chrx;
                        var $2851 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2851;
                        break;
                    case 'Fm.Term.str':
                        var $2852 = self.strx;
                        var $2853 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2853;
                        break;
                    case 'Fm.Term.cse':
                        var $2854 = self.path;
                        var $2855 = self.expr;
                        var $2856 = self.name;
                        var $2857 = self.with;
                        var $2858 = self.cses;
                        var $2859 = self.moti;
                        var $2860 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2811 = $2860;
                        break;
                    case 'Fm.Term.ori':
                        var $2861 = self.orig;
                        var $2862 = self.expr;
                        var $2863 = Fm$Term$equal$extra_holes$(_a$1, $2862);
                        var $2811 = $2863;
                        break;
                };
                var $2754 = $2811;
                break;
            case 'Fm.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2865 = self.name;
                        var $2866 = self.indx;
                        var $2867 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2867;
                        break;
                    case 'Fm.Term.ref':
                        var $2868 = self.name;
                        var $2869 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2869;
                        break;
                    case 'Fm.Term.typ':
                        var $2870 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2870;
                        break;
                    case 'Fm.Term.all':
                        var $2871 = self.eras;
                        var $2872 = self.self;
                        var $2873 = self.name;
                        var $2874 = self.xtyp;
                        var $2875 = self.body;
                        var $2876 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2876;
                        break;
                    case 'Fm.Term.lam':
                        var $2877 = self.name;
                        var $2878 = self.body;
                        var $2879 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2879;
                        break;
                    case 'Fm.Term.app':
                        var $2880 = self.func;
                        var $2881 = self.argm;
                        var $2882 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2882;
                        break;
                    case 'Fm.Term.let':
                        var $2883 = self.name;
                        var $2884 = self.expr;
                        var $2885 = self.body;
                        var $2886 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2886;
                        break;
                    case 'Fm.Term.def':
                        var $2887 = self.name;
                        var $2888 = self.expr;
                        var $2889 = self.body;
                        var $2890 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2890;
                        break;
                    case 'Fm.Term.ann':
                        var $2891 = self.done;
                        var $2892 = self.term;
                        var $2893 = self.type;
                        var $2894 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2894;
                        break;
                    case 'Fm.Term.gol':
                        var $2895 = self.name;
                        var $2896 = self.dref;
                        var $2897 = self.verb;
                        var $2898 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2898;
                        break;
                    case 'Fm.Term.hol':
                        var $2899 = self.path;
                        var $2900 = Fm$Term$equal$patch$($2899, _a$1, Unit$new);
                        var $2864 = $2900;
                        break;
                    case 'Fm.Term.nat':
                        var $2901 = self.natx;
                        var $2902 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2902;
                        break;
                    case 'Fm.Term.chr':
                        var $2903 = self.chrx;
                        var $2904 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2904;
                        break;
                    case 'Fm.Term.str':
                        var $2905 = self.strx;
                        var $2906 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2906;
                        break;
                    case 'Fm.Term.cse':
                        var $2907 = self.path;
                        var $2908 = self.expr;
                        var $2909 = self.name;
                        var $2910 = self.with;
                        var $2911 = self.cses;
                        var $2912 = self.moti;
                        var $2913 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2864 = $2913;
                        break;
                    case 'Fm.Term.ori':
                        var $2914 = self.orig;
                        var $2915 = self.expr;
                        var $2916 = Fm$Term$equal$extra_holes$(_a$1, $2915);
                        var $2864 = $2916;
                        break;
                };
                var $2754 = $2864;
                break;
            case 'Fm.Term.all':
                var $2917 = self.eras;
                var $2918 = self.self;
                var $2919 = self.name;
                var $2920 = self.xtyp;
                var $2921 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2923 = self.name;
                        var $2924 = self.indx;
                        var $2925 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2925;
                        break;
                    case 'Fm.Term.ref':
                        var $2926 = self.name;
                        var $2927 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2927;
                        break;
                    case 'Fm.Term.typ':
                        var $2928 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2928;
                        break;
                    case 'Fm.Term.all':
                        var $2929 = self.eras;
                        var $2930 = self.self;
                        var $2931 = self.name;
                        var $2932 = self.xtyp;
                        var $2933 = self.body;
                        var $2934 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2934;
                        break;
                    case 'Fm.Term.lam':
                        var $2935 = self.name;
                        var $2936 = self.body;
                        var $2937 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2937;
                        break;
                    case 'Fm.Term.app':
                        var $2938 = self.func;
                        var $2939 = self.argm;
                        var $2940 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2940;
                        break;
                    case 'Fm.Term.let':
                        var $2941 = self.name;
                        var $2942 = self.expr;
                        var $2943 = self.body;
                        var $2944 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2944;
                        break;
                    case 'Fm.Term.def':
                        var $2945 = self.name;
                        var $2946 = self.expr;
                        var $2947 = self.body;
                        var $2948 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2948;
                        break;
                    case 'Fm.Term.ann':
                        var $2949 = self.done;
                        var $2950 = self.term;
                        var $2951 = self.type;
                        var $2952 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2952;
                        break;
                    case 'Fm.Term.gol':
                        var $2953 = self.name;
                        var $2954 = self.dref;
                        var $2955 = self.verb;
                        var $2956 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2956;
                        break;
                    case 'Fm.Term.hol':
                        var $2957 = self.path;
                        var $2958 = Fm$Term$equal$patch$($2957, _a$1, Unit$new);
                        var $2922 = $2958;
                        break;
                    case 'Fm.Term.nat':
                        var $2959 = self.natx;
                        var $2960 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2960;
                        break;
                    case 'Fm.Term.chr':
                        var $2961 = self.chrx;
                        var $2962 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2962;
                        break;
                    case 'Fm.Term.str':
                        var $2963 = self.strx;
                        var $2964 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2964;
                        break;
                    case 'Fm.Term.cse':
                        var $2965 = self.path;
                        var $2966 = self.expr;
                        var $2967 = self.name;
                        var $2968 = self.with;
                        var $2969 = self.cses;
                        var $2970 = self.moti;
                        var $2971 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2922 = $2971;
                        break;
                    case 'Fm.Term.ori':
                        var $2972 = self.orig;
                        var $2973 = self.expr;
                        var $2974 = Fm$Term$equal$extra_holes$(_a$1, $2973);
                        var $2922 = $2974;
                        break;
                };
                var $2754 = $2922;
                break;
            case 'Fm.Term.lam':
                var $2975 = self.name;
                var $2976 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2978 = self.name;
                        var $2979 = self.indx;
                        var $2980 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $2980;
                        break;
                    case 'Fm.Term.ref':
                        var $2981 = self.name;
                        var $2982 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $2982;
                        break;
                    case 'Fm.Term.typ':
                        var $2983 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $2983;
                        break;
                    case 'Fm.Term.all':
                        var $2984 = self.eras;
                        var $2985 = self.self;
                        var $2986 = self.name;
                        var $2987 = self.xtyp;
                        var $2988 = self.body;
                        var $2989 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $2989;
                        break;
                    case 'Fm.Term.lam':
                        var $2990 = self.name;
                        var $2991 = self.body;
                        var $2992 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $2992;
                        break;
                    case 'Fm.Term.app':
                        var $2993 = self.func;
                        var $2994 = self.argm;
                        var $2995 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $2995;
                        break;
                    case 'Fm.Term.let':
                        var $2996 = self.name;
                        var $2997 = self.expr;
                        var $2998 = self.body;
                        var $2999 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $2999;
                        break;
                    case 'Fm.Term.def':
                        var $3000 = self.name;
                        var $3001 = self.expr;
                        var $3002 = self.body;
                        var $3003 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $3003;
                        break;
                    case 'Fm.Term.ann':
                        var $3004 = self.done;
                        var $3005 = self.term;
                        var $3006 = self.type;
                        var $3007 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $3007;
                        break;
                    case 'Fm.Term.gol':
                        var $3008 = self.name;
                        var $3009 = self.dref;
                        var $3010 = self.verb;
                        var $3011 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $3011;
                        break;
                    case 'Fm.Term.hol':
                        var $3012 = self.path;
                        var $3013 = Fm$Term$equal$patch$($3012, _a$1, Unit$new);
                        var $2977 = $3013;
                        break;
                    case 'Fm.Term.nat':
                        var $3014 = self.natx;
                        var $3015 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $3015;
                        break;
                    case 'Fm.Term.chr':
                        var $3016 = self.chrx;
                        var $3017 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $3017;
                        break;
                    case 'Fm.Term.str':
                        var $3018 = self.strx;
                        var $3019 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $3019;
                        break;
                    case 'Fm.Term.cse':
                        var $3020 = self.path;
                        var $3021 = self.expr;
                        var $3022 = self.name;
                        var $3023 = self.with;
                        var $3024 = self.cses;
                        var $3025 = self.moti;
                        var $3026 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2977 = $3026;
                        break;
                    case 'Fm.Term.ori':
                        var $3027 = self.orig;
                        var $3028 = self.expr;
                        var $3029 = Fm$Term$equal$extra_holes$(_a$1, $3028);
                        var $2977 = $3029;
                        break;
                };
                var $2754 = $2977;
                break;
            case 'Fm.Term.app':
                var $3030 = self.func;
                var $3031 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3033 = self.name;
                        var $3034 = self.indx;
                        var $3035 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3035;
                        break;
                    case 'Fm.Term.ref':
                        var $3036 = self.name;
                        var $3037 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3037;
                        break;
                    case 'Fm.Term.typ':
                        var $3038 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3038;
                        break;
                    case 'Fm.Term.all':
                        var $3039 = self.eras;
                        var $3040 = self.self;
                        var $3041 = self.name;
                        var $3042 = self.xtyp;
                        var $3043 = self.body;
                        var $3044 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3044;
                        break;
                    case 'Fm.Term.lam':
                        var $3045 = self.name;
                        var $3046 = self.body;
                        var $3047 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3047;
                        break;
                    case 'Fm.Term.app':
                        var $3048 = self.func;
                        var $3049 = self.argm;
                        var $3050 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$($3030, $3048))((_$7 => {
                            var $3051 = Fm$Term$equal$extra_holes$($3031, $3049);
                            return $3051;
                        }));
                        var $3032 = $3050;
                        break;
                    case 'Fm.Term.let':
                        var $3052 = self.name;
                        var $3053 = self.expr;
                        var $3054 = self.body;
                        var $3055 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3055;
                        break;
                    case 'Fm.Term.def':
                        var $3056 = self.name;
                        var $3057 = self.expr;
                        var $3058 = self.body;
                        var $3059 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3059;
                        break;
                    case 'Fm.Term.ann':
                        var $3060 = self.done;
                        var $3061 = self.term;
                        var $3062 = self.type;
                        var $3063 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3063;
                        break;
                    case 'Fm.Term.gol':
                        var $3064 = self.name;
                        var $3065 = self.dref;
                        var $3066 = self.verb;
                        var $3067 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3067;
                        break;
                    case 'Fm.Term.hol':
                        var $3068 = self.path;
                        var $3069 = Fm$Term$equal$patch$($3068, _a$1, Unit$new);
                        var $3032 = $3069;
                        break;
                    case 'Fm.Term.nat':
                        var $3070 = self.natx;
                        var $3071 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3071;
                        break;
                    case 'Fm.Term.chr':
                        var $3072 = self.chrx;
                        var $3073 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3073;
                        break;
                    case 'Fm.Term.str':
                        var $3074 = self.strx;
                        var $3075 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3075;
                        break;
                    case 'Fm.Term.cse':
                        var $3076 = self.path;
                        var $3077 = self.expr;
                        var $3078 = self.name;
                        var $3079 = self.with;
                        var $3080 = self.cses;
                        var $3081 = self.moti;
                        var $3082 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3032 = $3082;
                        break;
                    case 'Fm.Term.ori':
                        var $3083 = self.orig;
                        var $3084 = self.expr;
                        var $3085 = Fm$Term$equal$extra_holes$(_a$1, $3084);
                        var $3032 = $3085;
                        break;
                };
                var $2754 = $3032;
                break;
            case 'Fm.Term.let':
                var $3086 = self.name;
                var $3087 = self.expr;
                var $3088 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3090 = self.name;
                        var $3091 = self.indx;
                        var $3092 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3092;
                        break;
                    case 'Fm.Term.ref':
                        var $3093 = self.name;
                        var $3094 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3094;
                        break;
                    case 'Fm.Term.typ':
                        var $3095 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3095;
                        break;
                    case 'Fm.Term.all':
                        var $3096 = self.eras;
                        var $3097 = self.self;
                        var $3098 = self.name;
                        var $3099 = self.xtyp;
                        var $3100 = self.body;
                        var $3101 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3101;
                        break;
                    case 'Fm.Term.lam':
                        var $3102 = self.name;
                        var $3103 = self.body;
                        var $3104 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3104;
                        break;
                    case 'Fm.Term.app':
                        var $3105 = self.func;
                        var $3106 = self.argm;
                        var $3107 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3107;
                        break;
                    case 'Fm.Term.let':
                        var $3108 = self.name;
                        var $3109 = self.expr;
                        var $3110 = self.body;
                        var $3111 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3111;
                        break;
                    case 'Fm.Term.def':
                        var $3112 = self.name;
                        var $3113 = self.expr;
                        var $3114 = self.body;
                        var $3115 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3115;
                        break;
                    case 'Fm.Term.ann':
                        var $3116 = self.done;
                        var $3117 = self.term;
                        var $3118 = self.type;
                        var $3119 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3119;
                        break;
                    case 'Fm.Term.gol':
                        var $3120 = self.name;
                        var $3121 = self.dref;
                        var $3122 = self.verb;
                        var $3123 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3123;
                        break;
                    case 'Fm.Term.hol':
                        var $3124 = self.path;
                        var $3125 = Fm$Term$equal$patch$($3124, _a$1, Unit$new);
                        var $3089 = $3125;
                        break;
                    case 'Fm.Term.nat':
                        var $3126 = self.natx;
                        var $3127 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3127;
                        break;
                    case 'Fm.Term.chr':
                        var $3128 = self.chrx;
                        var $3129 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3129;
                        break;
                    case 'Fm.Term.str':
                        var $3130 = self.strx;
                        var $3131 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3131;
                        break;
                    case 'Fm.Term.cse':
                        var $3132 = self.path;
                        var $3133 = self.expr;
                        var $3134 = self.name;
                        var $3135 = self.with;
                        var $3136 = self.cses;
                        var $3137 = self.moti;
                        var $3138 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3089 = $3138;
                        break;
                    case 'Fm.Term.ori':
                        var $3139 = self.orig;
                        var $3140 = self.expr;
                        var $3141 = Fm$Term$equal$extra_holes$(_a$1, $3140);
                        var $3089 = $3141;
                        break;
                };
                var $2754 = $3089;
                break;
            case 'Fm.Term.def':
                var $3142 = self.name;
                var $3143 = self.expr;
                var $3144 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3146 = self.name;
                        var $3147 = self.indx;
                        var $3148 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3148;
                        break;
                    case 'Fm.Term.ref':
                        var $3149 = self.name;
                        var $3150 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3150;
                        break;
                    case 'Fm.Term.typ':
                        var $3151 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3151;
                        break;
                    case 'Fm.Term.all':
                        var $3152 = self.eras;
                        var $3153 = self.self;
                        var $3154 = self.name;
                        var $3155 = self.xtyp;
                        var $3156 = self.body;
                        var $3157 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3157;
                        break;
                    case 'Fm.Term.lam':
                        var $3158 = self.name;
                        var $3159 = self.body;
                        var $3160 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3160;
                        break;
                    case 'Fm.Term.app':
                        var $3161 = self.func;
                        var $3162 = self.argm;
                        var $3163 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3163;
                        break;
                    case 'Fm.Term.let':
                        var $3164 = self.name;
                        var $3165 = self.expr;
                        var $3166 = self.body;
                        var $3167 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3167;
                        break;
                    case 'Fm.Term.def':
                        var $3168 = self.name;
                        var $3169 = self.expr;
                        var $3170 = self.body;
                        var $3171 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3171;
                        break;
                    case 'Fm.Term.ann':
                        var $3172 = self.done;
                        var $3173 = self.term;
                        var $3174 = self.type;
                        var $3175 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3175;
                        break;
                    case 'Fm.Term.gol':
                        var $3176 = self.name;
                        var $3177 = self.dref;
                        var $3178 = self.verb;
                        var $3179 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3179;
                        break;
                    case 'Fm.Term.hol':
                        var $3180 = self.path;
                        var $3181 = Fm$Term$equal$patch$($3180, _a$1, Unit$new);
                        var $3145 = $3181;
                        break;
                    case 'Fm.Term.nat':
                        var $3182 = self.natx;
                        var $3183 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3183;
                        break;
                    case 'Fm.Term.chr':
                        var $3184 = self.chrx;
                        var $3185 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3185;
                        break;
                    case 'Fm.Term.str':
                        var $3186 = self.strx;
                        var $3187 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3187;
                        break;
                    case 'Fm.Term.cse':
                        var $3188 = self.path;
                        var $3189 = self.expr;
                        var $3190 = self.name;
                        var $3191 = self.with;
                        var $3192 = self.cses;
                        var $3193 = self.moti;
                        var $3194 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3145 = $3194;
                        break;
                    case 'Fm.Term.ori':
                        var $3195 = self.orig;
                        var $3196 = self.expr;
                        var $3197 = Fm$Term$equal$extra_holes$(_a$1, $3196);
                        var $3145 = $3197;
                        break;
                };
                var $2754 = $3145;
                break;
            case 'Fm.Term.ann':
                var $3198 = self.done;
                var $3199 = self.term;
                var $3200 = self.type;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3202 = self.name;
                        var $3203 = self.indx;
                        var $3204 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3204;
                        break;
                    case 'Fm.Term.ref':
                        var $3205 = self.name;
                        var $3206 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3206;
                        break;
                    case 'Fm.Term.typ':
                        var $3207 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3207;
                        break;
                    case 'Fm.Term.all':
                        var $3208 = self.eras;
                        var $3209 = self.self;
                        var $3210 = self.name;
                        var $3211 = self.xtyp;
                        var $3212 = self.body;
                        var $3213 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3213;
                        break;
                    case 'Fm.Term.lam':
                        var $3214 = self.name;
                        var $3215 = self.body;
                        var $3216 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3216;
                        break;
                    case 'Fm.Term.app':
                        var $3217 = self.func;
                        var $3218 = self.argm;
                        var $3219 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3219;
                        break;
                    case 'Fm.Term.let':
                        var $3220 = self.name;
                        var $3221 = self.expr;
                        var $3222 = self.body;
                        var $3223 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3223;
                        break;
                    case 'Fm.Term.def':
                        var $3224 = self.name;
                        var $3225 = self.expr;
                        var $3226 = self.body;
                        var $3227 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3227;
                        break;
                    case 'Fm.Term.ann':
                        var $3228 = self.done;
                        var $3229 = self.term;
                        var $3230 = self.type;
                        var $3231 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3231;
                        break;
                    case 'Fm.Term.gol':
                        var $3232 = self.name;
                        var $3233 = self.dref;
                        var $3234 = self.verb;
                        var $3235 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3235;
                        break;
                    case 'Fm.Term.hol':
                        var $3236 = self.path;
                        var $3237 = Fm$Term$equal$patch$($3236, _a$1, Unit$new);
                        var $3201 = $3237;
                        break;
                    case 'Fm.Term.nat':
                        var $3238 = self.natx;
                        var $3239 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3239;
                        break;
                    case 'Fm.Term.chr':
                        var $3240 = self.chrx;
                        var $3241 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3241;
                        break;
                    case 'Fm.Term.str':
                        var $3242 = self.strx;
                        var $3243 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3243;
                        break;
                    case 'Fm.Term.cse':
                        var $3244 = self.path;
                        var $3245 = self.expr;
                        var $3246 = self.name;
                        var $3247 = self.with;
                        var $3248 = self.cses;
                        var $3249 = self.moti;
                        var $3250 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3201 = $3250;
                        break;
                    case 'Fm.Term.ori':
                        var $3251 = self.orig;
                        var $3252 = self.expr;
                        var $3253 = Fm$Term$equal$extra_holes$(_a$1, $3252);
                        var $3201 = $3253;
                        break;
                };
                var $2754 = $3201;
                break;
            case 'Fm.Term.gol':
                var $3254 = self.name;
                var $3255 = self.dref;
                var $3256 = self.verb;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3258 = self.name;
                        var $3259 = self.indx;
                        var $3260 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3260;
                        break;
                    case 'Fm.Term.ref':
                        var $3261 = self.name;
                        var $3262 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3262;
                        break;
                    case 'Fm.Term.typ':
                        var $3263 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3263;
                        break;
                    case 'Fm.Term.all':
                        var $3264 = self.eras;
                        var $3265 = self.self;
                        var $3266 = self.name;
                        var $3267 = self.xtyp;
                        var $3268 = self.body;
                        var $3269 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3269;
                        break;
                    case 'Fm.Term.lam':
                        var $3270 = self.name;
                        var $3271 = self.body;
                        var $3272 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3272;
                        break;
                    case 'Fm.Term.app':
                        var $3273 = self.func;
                        var $3274 = self.argm;
                        var $3275 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3275;
                        break;
                    case 'Fm.Term.let':
                        var $3276 = self.name;
                        var $3277 = self.expr;
                        var $3278 = self.body;
                        var $3279 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3279;
                        break;
                    case 'Fm.Term.def':
                        var $3280 = self.name;
                        var $3281 = self.expr;
                        var $3282 = self.body;
                        var $3283 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3283;
                        break;
                    case 'Fm.Term.ann':
                        var $3284 = self.done;
                        var $3285 = self.term;
                        var $3286 = self.type;
                        var $3287 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3287;
                        break;
                    case 'Fm.Term.gol':
                        var $3288 = self.name;
                        var $3289 = self.dref;
                        var $3290 = self.verb;
                        var $3291 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3291;
                        break;
                    case 'Fm.Term.hol':
                        var $3292 = self.path;
                        var $3293 = Fm$Term$equal$patch$($3292, _a$1, Unit$new);
                        var $3257 = $3293;
                        break;
                    case 'Fm.Term.nat':
                        var $3294 = self.natx;
                        var $3295 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3295;
                        break;
                    case 'Fm.Term.chr':
                        var $3296 = self.chrx;
                        var $3297 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3297;
                        break;
                    case 'Fm.Term.str':
                        var $3298 = self.strx;
                        var $3299 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3299;
                        break;
                    case 'Fm.Term.cse':
                        var $3300 = self.path;
                        var $3301 = self.expr;
                        var $3302 = self.name;
                        var $3303 = self.with;
                        var $3304 = self.cses;
                        var $3305 = self.moti;
                        var $3306 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3257 = $3306;
                        break;
                    case 'Fm.Term.ori':
                        var $3307 = self.orig;
                        var $3308 = self.expr;
                        var $3309 = Fm$Term$equal$extra_holes$(_a$1, $3308);
                        var $3257 = $3309;
                        break;
                };
                var $2754 = $3257;
                break;
            case 'Fm.Term.hol':
                var $3310 = self.path;
                var $3311 = Fm$Term$equal$patch$($3310, _b$2, Unit$new);
                var $2754 = $3311;
                break;
            case 'Fm.Term.nat':
                var $3312 = self.natx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3314 = self.name;
                        var $3315 = self.indx;
                        var $3316 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3316;
                        break;
                    case 'Fm.Term.ref':
                        var $3317 = self.name;
                        var $3318 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3318;
                        break;
                    case 'Fm.Term.typ':
                        var $3319 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3319;
                        break;
                    case 'Fm.Term.all':
                        var $3320 = self.eras;
                        var $3321 = self.self;
                        var $3322 = self.name;
                        var $3323 = self.xtyp;
                        var $3324 = self.body;
                        var $3325 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3325;
                        break;
                    case 'Fm.Term.lam':
                        var $3326 = self.name;
                        var $3327 = self.body;
                        var $3328 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3328;
                        break;
                    case 'Fm.Term.app':
                        var $3329 = self.func;
                        var $3330 = self.argm;
                        var $3331 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3331;
                        break;
                    case 'Fm.Term.let':
                        var $3332 = self.name;
                        var $3333 = self.expr;
                        var $3334 = self.body;
                        var $3335 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3335;
                        break;
                    case 'Fm.Term.def':
                        var $3336 = self.name;
                        var $3337 = self.expr;
                        var $3338 = self.body;
                        var $3339 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3339;
                        break;
                    case 'Fm.Term.ann':
                        var $3340 = self.done;
                        var $3341 = self.term;
                        var $3342 = self.type;
                        var $3343 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3343;
                        break;
                    case 'Fm.Term.gol':
                        var $3344 = self.name;
                        var $3345 = self.dref;
                        var $3346 = self.verb;
                        var $3347 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3347;
                        break;
                    case 'Fm.Term.hol':
                        var $3348 = self.path;
                        var $3349 = Fm$Term$equal$patch$($3348, _a$1, Unit$new);
                        var $3313 = $3349;
                        break;
                    case 'Fm.Term.nat':
                        var $3350 = self.natx;
                        var $3351 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3351;
                        break;
                    case 'Fm.Term.chr':
                        var $3352 = self.chrx;
                        var $3353 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3353;
                        break;
                    case 'Fm.Term.str':
                        var $3354 = self.strx;
                        var $3355 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3355;
                        break;
                    case 'Fm.Term.cse':
                        var $3356 = self.path;
                        var $3357 = self.expr;
                        var $3358 = self.name;
                        var $3359 = self.with;
                        var $3360 = self.cses;
                        var $3361 = self.moti;
                        var $3362 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3313 = $3362;
                        break;
                    case 'Fm.Term.ori':
                        var $3363 = self.orig;
                        var $3364 = self.expr;
                        var $3365 = Fm$Term$equal$extra_holes$(_a$1, $3364);
                        var $3313 = $3365;
                        break;
                };
                var $2754 = $3313;
                break;
            case 'Fm.Term.chr':
                var $3366 = self.chrx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3368 = self.name;
                        var $3369 = self.indx;
                        var $3370 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3370;
                        break;
                    case 'Fm.Term.ref':
                        var $3371 = self.name;
                        var $3372 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3372;
                        break;
                    case 'Fm.Term.typ':
                        var $3373 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3373;
                        break;
                    case 'Fm.Term.all':
                        var $3374 = self.eras;
                        var $3375 = self.self;
                        var $3376 = self.name;
                        var $3377 = self.xtyp;
                        var $3378 = self.body;
                        var $3379 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3379;
                        break;
                    case 'Fm.Term.lam':
                        var $3380 = self.name;
                        var $3381 = self.body;
                        var $3382 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3382;
                        break;
                    case 'Fm.Term.app':
                        var $3383 = self.func;
                        var $3384 = self.argm;
                        var $3385 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3385;
                        break;
                    case 'Fm.Term.let':
                        var $3386 = self.name;
                        var $3387 = self.expr;
                        var $3388 = self.body;
                        var $3389 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3389;
                        break;
                    case 'Fm.Term.def':
                        var $3390 = self.name;
                        var $3391 = self.expr;
                        var $3392 = self.body;
                        var $3393 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3393;
                        break;
                    case 'Fm.Term.ann':
                        var $3394 = self.done;
                        var $3395 = self.term;
                        var $3396 = self.type;
                        var $3397 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3397;
                        break;
                    case 'Fm.Term.gol':
                        var $3398 = self.name;
                        var $3399 = self.dref;
                        var $3400 = self.verb;
                        var $3401 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3401;
                        break;
                    case 'Fm.Term.hol':
                        var $3402 = self.path;
                        var $3403 = Fm$Term$equal$patch$($3402, _a$1, Unit$new);
                        var $3367 = $3403;
                        break;
                    case 'Fm.Term.nat':
                        var $3404 = self.natx;
                        var $3405 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3405;
                        break;
                    case 'Fm.Term.chr':
                        var $3406 = self.chrx;
                        var $3407 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3407;
                        break;
                    case 'Fm.Term.str':
                        var $3408 = self.strx;
                        var $3409 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3409;
                        break;
                    case 'Fm.Term.cse':
                        var $3410 = self.path;
                        var $3411 = self.expr;
                        var $3412 = self.name;
                        var $3413 = self.with;
                        var $3414 = self.cses;
                        var $3415 = self.moti;
                        var $3416 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3367 = $3416;
                        break;
                    case 'Fm.Term.ori':
                        var $3417 = self.orig;
                        var $3418 = self.expr;
                        var $3419 = Fm$Term$equal$extra_holes$(_a$1, $3418);
                        var $3367 = $3419;
                        break;
                };
                var $2754 = $3367;
                break;
            case 'Fm.Term.str':
                var $3420 = self.strx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3422 = self.name;
                        var $3423 = self.indx;
                        var $3424 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3424;
                        break;
                    case 'Fm.Term.ref':
                        var $3425 = self.name;
                        var $3426 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3426;
                        break;
                    case 'Fm.Term.typ':
                        var $3427 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3427;
                        break;
                    case 'Fm.Term.all':
                        var $3428 = self.eras;
                        var $3429 = self.self;
                        var $3430 = self.name;
                        var $3431 = self.xtyp;
                        var $3432 = self.body;
                        var $3433 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3433;
                        break;
                    case 'Fm.Term.lam':
                        var $3434 = self.name;
                        var $3435 = self.body;
                        var $3436 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3436;
                        break;
                    case 'Fm.Term.app':
                        var $3437 = self.func;
                        var $3438 = self.argm;
                        var $3439 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3439;
                        break;
                    case 'Fm.Term.let':
                        var $3440 = self.name;
                        var $3441 = self.expr;
                        var $3442 = self.body;
                        var $3443 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3443;
                        break;
                    case 'Fm.Term.def':
                        var $3444 = self.name;
                        var $3445 = self.expr;
                        var $3446 = self.body;
                        var $3447 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3447;
                        break;
                    case 'Fm.Term.ann':
                        var $3448 = self.done;
                        var $3449 = self.term;
                        var $3450 = self.type;
                        var $3451 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3451;
                        break;
                    case 'Fm.Term.gol':
                        var $3452 = self.name;
                        var $3453 = self.dref;
                        var $3454 = self.verb;
                        var $3455 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3455;
                        break;
                    case 'Fm.Term.hol':
                        var $3456 = self.path;
                        var $3457 = Fm$Term$equal$patch$($3456, _a$1, Unit$new);
                        var $3421 = $3457;
                        break;
                    case 'Fm.Term.nat':
                        var $3458 = self.natx;
                        var $3459 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3459;
                        break;
                    case 'Fm.Term.chr':
                        var $3460 = self.chrx;
                        var $3461 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3461;
                        break;
                    case 'Fm.Term.str':
                        var $3462 = self.strx;
                        var $3463 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3463;
                        break;
                    case 'Fm.Term.cse':
                        var $3464 = self.path;
                        var $3465 = self.expr;
                        var $3466 = self.name;
                        var $3467 = self.with;
                        var $3468 = self.cses;
                        var $3469 = self.moti;
                        var $3470 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3421 = $3470;
                        break;
                    case 'Fm.Term.ori':
                        var $3471 = self.orig;
                        var $3472 = self.expr;
                        var $3473 = Fm$Term$equal$extra_holes$(_a$1, $3472);
                        var $3421 = $3473;
                        break;
                };
                var $2754 = $3421;
                break;
            case 'Fm.Term.cse':
                var $3474 = self.path;
                var $3475 = self.expr;
                var $3476 = self.name;
                var $3477 = self.with;
                var $3478 = self.cses;
                var $3479 = self.moti;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3481 = self.name;
                        var $3482 = self.indx;
                        var $3483 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3483;
                        break;
                    case 'Fm.Term.ref':
                        var $3484 = self.name;
                        var $3485 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3485;
                        break;
                    case 'Fm.Term.typ':
                        var $3486 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3486;
                        break;
                    case 'Fm.Term.all':
                        var $3487 = self.eras;
                        var $3488 = self.self;
                        var $3489 = self.name;
                        var $3490 = self.xtyp;
                        var $3491 = self.body;
                        var $3492 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3492;
                        break;
                    case 'Fm.Term.lam':
                        var $3493 = self.name;
                        var $3494 = self.body;
                        var $3495 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3495;
                        break;
                    case 'Fm.Term.app':
                        var $3496 = self.func;
                        var $3497 = self.argm;
                        var $3498 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3498;
                        break;
                    case 'Fm.Term.let':
                        var $3499 = self.name;
                        var $3500 = self.expr;
                        var $3501 = self.body;
                        var $3502 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3502;
                        break;
                    case 'Fm.Term.def':
                        var $3503 = self.name;
                        var $3504 = self.expr;
                        var $3505 = self.body;
                        var $3506 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3506;
                        break;
                    case 'Fm.Term.ann':
                        var $3507 = self.done;
                        var $3508 = self.term;
                        var $3509 = self.type;
                        var $3510 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3510;
                        break;
                    case 'Fm.Term.gol':
                        var $3511 = self.name;
                        var $3512 = self.dref;
                        var $3513 = self.verb;
                        var $3514 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3514;
                        break;
                    case 'Fm.Term.hol':
                        var $3515 = self.path;
                        var $3516 = Fm$Term$equal$patch$($3515, _a$1, Unit$new);
                        var $3480 = $3516;
                        break;
                    case 'Fm.Term.nat':
                        var $3517 = self.natx;
                        var $3518 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3518;
                        break;
                    case 'Fm.Term.chr':
                        var $3519 = self.chrx;
                        var $3520 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3520;
                        break;
                    case 'Fm.Term.str':
                        var $3521 = self.strx;
                        var $3522 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3522;
                        break;
                    case 'Fm.Term.cse':
                        var $3523 = self.path;
                        var $3524 = self.expr;
                        var $3525 = self.name;
                        var $3526 = self.with;
                        var $3527 = self.cses;
                        var $3528 = self.moti;
                        var $3529 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3480 = $3529;
                        break;
                    case 'Fm.Term.ori':
                        var $3530 = self.orig;
                        var $3531 = self.expr;
                        var $3532 = Fm$Term$equal$extra_holes$(_a$1, $3531);
                        var $3480 = $3532;
                        break;
                };
                var $2754 = $3480;
                break;
            case 'Fm.Term.ori':
                var $3533 = self.orig;
                var $3534 = self.expr;
                var $3535 = Fm$Term$equal$extra_holes$($3534, _b$2);
                var $2754 = $3535;
                break;
        };
        return $2754;
    };
    const Fm$Term$equal$extra_holes = x0 => x1 => Fm$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $3536 = Map$set$(_bits$1, Unit$new, _set$2);
        return $3536;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $3538 = _b$2;
            var $3537 = $3538;
        } else {
            var $3539 = (!_b$2);
            var $3537 = $3539;
        };
        return $3537;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Fm$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Fm$Term$serialize$(Fm$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$e);
        var _bh$7 = Fm$Term$serialize$(Fm$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $3541 = Monad$pure$(Fm$Check$monad)(Bool$true);
            var $3540 = $3541;
        } else {
            var _a1$8 = Fm$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Fm$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Fm$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$e);
            var _bh$11 = Fm$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $3543 = Monad$pure$(Fm$Check$monad)(Bool$true);
                var $3542 = $3543;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = Set$has$(_id$12, _seen$5);
                if (self) {
                    var $3545 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$(_a$1, _b$2))((_$13 => {
                        var $3546 = Monad$pure$(Fm$Check$monad)(Bool$true);
                        return $3546;
                    }));
                    var $3544 = $3545;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Fm.Term.var':
                            var $3548 = self.name;
                            var $3549 = self.indx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3551 = self.name;
                                    var $3552 = self.indx;
                                    var $3553 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3553;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3554 = self.name;
                                    var $3555 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3555;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3556 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3556;
                                    break;
                                case 'Fm.Term.all':
                                    var $3557 = self.eras;
                                    var $3558 = self.self;
                                    var $3559 = self.name;
                                    var $3560 = self.xtyp;
                                    var $3561 = self.body;
                                    var $3562 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3562;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3563 = self.name;
                                    var $3564 = self.body;
                                    var $3565 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3565;
                                    break;
                                case 'Fm.Term.app':
                                    var $3566 = self.func;
                                    var $3567 = self.argm;
                                    var $3568 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3568;
                                    break;
                                case 'Fm.Term.let':
                                    var $3569 = self.name;
                                    var $3570 = self.expr;
                                    var $3571 = self.body;
                                    var $3572 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3572;
                                    break;
                                case 'Fm.Term.def':
                                    var $3573 = self.name;
                                    var $3574 = self.expr;
                                    var $3575 = self.body;
                                    var $3576 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3576;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3577 = self.done;
                                    var $3578 = self.term;
                                    var $3579 = self.type;
                                    var $3580 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3580;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3581 = self.name;
                                    var $3582 = self.dref;
                                    var $3583 = self.verb;
                                    var $3584 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3584;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3585 = self.path;
                                    var $3586 = Fm$Term$equal$patch$($3585, _a$1, Bool$true);
                                    var $3550 = $3586;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3587 = self.natx;
                                    var $3588 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3588;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3589 = self.chrx;
                                    var $3590 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3590;
                                    break;
                                case 'Fm.Term.str':
                                    var $3591 = self.strx;
                                    var $3592 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3592;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3593 = self.path;
                                    var $3594 = self.expr;
                                    var $3595 = self.name;
                                    var $3596 = self.with;
                                    var $3597 = self.cses;
                                    var $3598 = self.moti;
                                    var $3599 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3599;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3600 = self.orig;
                                    var $3601 = self.expr;
                                    var $3602 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3550 = $3602;
                                    break;
                            };
                            var $3547 = $3550;
                            break;
                        case 'Fm.Term.ref':
                            var $3603 = self.name;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3605 = self.name;
                                    var $3606 = self.indx;
                                    var $3607 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3607;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3608 = self.name;
                                    var $3609 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3609;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3610 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3610;
                                    break;
                                case 'Fm.Term.all':
                                    var $3611 = self.eras;
                                    var $3612 = self.self;
                                    var $3613 = self.name;
                                    var $3614 = self.xtyp;
                                    var $3615 = self.body;
                                    var $3616 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3616;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3617 = self.name;
                                    var $3618 = self.body;
                                    var $3619 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3619;
                                    break;
                                case 'Fm.Term.app':
                                    var $3620 = self.func;
                                    var $3621 = self.argm;
                                    var $3622 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3622;
                                    break;
                                case 'Fm.Term.let':
                                    var $3623 = self.name;
                                    var $3624 = self.expr;
                                    var $3625 = self.body;
                                    var $3626 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3626;
                                    break;
                                case 'Fm.Term.def':
                                    var $3627 = self.name;
                                    var $3628 = self.expr;
                                    var $3629 = self.body;
                                    var $3630 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3630;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3631 = self.done;
                                    var $3632 = self.term;
                                    var $3633 = self.type;
                                    var $3634 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3634;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3635 = self.name;
                                    var $3636 = self.dref;
                                    var $3637 = self.verb;
                                    var $3638 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3638;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3639 = self.path;
                                    var $3640 = Fm$Term$equal$patch$($3639, _a$1, Bool$true);
                                    var $3604 = $3640;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3641 = self.natx;
                                    var $3642 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3642;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3643 = self.chrx;
                                    var $3644 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3644;
                                    break;
                                case 'Fm.Term.str':
                                    var $3645 = self.strx;
                                    var $3646 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3646;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3647 = self.path;
                                    var $3648 = self.expr;
                                    var $3649 = self.name;
                                    var $3650 = self.with;
                                    var $3651 = self.cses;
                                    var $3652 = self.moti;
                                    var $3653 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3653;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3654 = self.orig;
                                    var $3655 = self.expr;
                                    var $3656 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3604 = $3656;
                                    break;
                            };
                            var $3547 = $3604;
                            break;
                        case 'Fm.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3658 = self.name;
                                    var $3659 = self.indx;
                                    var $3660 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3660;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3661 = self.name;
                                    var $3662 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3662;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3663 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3663;
                                    break;
                                case 'Fm.Term.all':
                                    var $3664 = self.eras;
                                    var $3665 = self.self;
                                    var $3666 = self.name;
                                    var $3667 = self.xtyp;
                                    var $3668 = self.body;
                                    var $3669 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3669;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3670 = self.name;
                                    var $3671 = self.body;
                                    var $3672 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3672;
                                    break;
                                case 'Fm.Term.app':
                                    var $3673 = self.func;
                                    var $3674 = self.argm;
                                    var $3675 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3675;
                                    break;
                                case 'Fm.Term.let':
                                    var $3676 = self.name;
                                    var $3677 = self.expr;
                                    var $3678 = self.body;
                                    var $3679 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3679;
                                    break;
                                case 'Fm.Term.def':
                                    var $3680 = self.name;
                                    var $3681 = self.expr;
                                    var $3682 = self.body;
                                    var $3683 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3683;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3684 = self.done;
                                    var $3685 = self.term;
                                    var $3686 = self.type;
                                    var $3687 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3687;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3688 = self.name;
                                    var $3689 = self.dref;
                                    var $3690 = self.verb;
                                    var $3691 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3691;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3692 = self.path;
                                    var $3693 = Fm$Term$equal$patch$($3692, _a$1, Bool$true);
                                    var $3657 = $3693;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3694 = self.natx;
                                    var $3695 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3695;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3696 = self.chrx;
                                    var $3697 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3697;
                                    break;
                                case 'Fm.Term.str':
                                    var $3698 = self.strx;
                                    var $3699 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3699;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3700 = self.path;
                                    var $3701 = self.expr;
                                    var $3702 = self.name;
                                    var $3703 = self.with;
                                    var $3704 = self.cses;
                                    var $3705 = self.moti;
                                    var $3706 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3706;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3707 = self.orig;
                                    var $3708 = self.expr;
                                    var $3709 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3657 = $3709;
                                    break;
                            };
                            var $3547 = $3657;
                            break;
                        case 'Fm.Term.all':
                            var $3710 = self.eras;
                            var $3711 = self.self;
                            var $3712 = self.name;
                            var $3713 = self.xtyp;
                            var $3714 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3716 = self.name;
                                    var $3717 = self.indx;
                                    var $3718 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3718;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3719 = self.name;
                                    var $3720 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3720;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3721 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3721;
                                    break;
                                case 'Fm.Term.all':
                                    var $3722 = self.eras;
                                    var $3723 = self.self;
                                    var $3724 = self.name;
                                    var $3725 = self.xtyp;
                                    var $3726 = self.body;
                                    var _seen$23 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$24 = $3714(Fm$Term$var$($3711, _lv$4))(Fm$Term$var$($3712, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $3726(Fm$Term$var$($3723, _lv$4))(Fm$Term$var$($3724, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($3711 === $3723);
                                    var _eq_eras$27 = Bool$eql$($3710, $3722);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var $3728 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3713, $3725, _defs$3, _lv$4, _seen$23))((_eq_type$28 => {
                                            var $3729 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23))((_eq_body$29 => {
                                                var $3730 = Monad$pure$(Fm$Check$monad)((_eq_type$28 && _eq_body$29));
                                                return $3730;
                                            }));
                                            return $3729;
                                        }));
                                        var $3727 = $3728;
                                    } else {
                                        var $3731 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                        var $3727 = $3731;
                                    };
                                    var $3715 = $3727;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3732 = self.name;
                                    var $3733 = self.body;
                                    var $3734 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3734;
                                    break;
                                case 'Fm.Term.app':
                                    var $3735 = self.func;
                                    var $3736 = self.argm;
                                    var $3737 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3737;
                                    break;
                                case 'Fm.Term.let':
                                    var $3738 = self.name;
                                    var $3739 = self.expr;
                                    var $3740 = self.body;
                                    var $3741 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3741;
                                    break;
                                case 'Fm.Term.def':
                                    var $3742 = self.name;
                                    var $3743 = self.expr;
                                    var $3744 = self.body;
                                    var $3745 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3745;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3746 = self.done;
                                    var $3747 = self.term;
                                    var $3748 = self.type;
                                    var $3749 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3749;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3750 = self.name;
                                    var $3751 = self.dref;
                                    var $3752 = self.verb;
                                    var $3753 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3753;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3754 = self.path;
                                    var $3755 = Fm$Term$equal$patch$($3754, _a$1, Bool$true);
                                    var $3715 = $3755;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3756 = self.natx;
                                    var $3757 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3757;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3758 = self.chrx;
                                    var $3759 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3759;
                                    break;
                                case 'Fm.Term.str':
                                    var $3760 = self.strx;
                                    var $3761 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3761;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3762 = self.path;
                                    var $3763 = self.expr;
                                    var $3764 = self.name;
                                    var $3765 = self.with;
                                    var $3766 = self.cses;
                                    var $3767 = self.moti;
                                    var $3768 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3768;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3769 = self.orig;
                                    var $3770 = self.expr;
                                    var $3771 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3715 = $3771;
                                    break;
                            };
                            var $3547 = $3715;
                            break;
                        case 'Fm.Term.lam':
                            var $3772 = self.name;
                            var $3773 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3775 = self.name;
                                    var $3776 = self.indx;
                                    var $3777 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3777;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3778 = self.name;
                                    var $3779 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3779;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3780 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3780;
                                    break;
                                case 'Fm.Term.all':
                                    var $3781 = self.eras;
                                    var $3782 = self.self;
                                    var $3783 = self.name;
                                    var $3784 = self.xtyp;
                                    var $3785 = self.body;
                                    var $3786 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3786;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3787 = self.name;
                                    var $3788 = self.body;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$18 = $3773(Fm$Term$var$($3772, _lv$4));
                                    var _b1_body$19 = $3788(Fm$Term$var$($3787, _lv$4));
                                    var $3789 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17))((_eq_body$20 => {
                                        var $3790 = Monad$pure$(Fm$Check$monad)(_eq_body$20);
                                        return $3790;
                                    }));
                                    var $3774 = $3789;
                                    break;
                                case 'Fm.Term.app':
                                    var $3791 = self.func;
                                    var $3792 = self.argm;
                                    var $3793 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3793;
                                    break;
                                case 'Fm.Term.let':
                                    var $3794 = self.name;
                                    var $3795 = self.expr;
                                    var $3796 = self.body;
                                    var $3797 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3797;
                                    break;
                                case 'Fm.Term.def':
                                    var $3798 = self.name;
                                    var $3799 = self.expr;
                                    var $3800 = self.body;
                                    var $3801 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3801;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3802 = self.done;
                                    var $3803 = self.term;
                                    var $3804 = self.type;
                                    var $3805 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3805;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3806 = self.name;
                                    var $3807 = self.dref;
                                    var $3808 = self.verb;
                                    var $3809 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3809;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3810 = self.path;
                                    var $3811 = Fm$Term$equal$patch$($3810, _a$1, Bool$true);
                                    var $3774 = $3811;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3812 = self.natx;
                                    var $3813 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3813;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3814 = self.chrx;
                                    var $3815 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3815;
                                    break;
                                case 'Fm.Term.str':
                                    var $3816 = self.strx;
                                    var $3817 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3817;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3818 = self.path;
                                    var $3819 = self.expr;
                                    var $3820 = self.name;
                                    var $3821 = self.with;
                                    var $3822 = self.cses;
                                    var $3823 = self.moti;
                                    var $3824 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3824;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3825 = self.orig;
                                    var $3826 = self.expr;
                                    var $3827 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3827;
                                    break;
                            };
                            var $3547 = $3774;
                            break;
                        case 'Fm.Term.app':
                            var $3828 = self.func;
                            var $3829 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3831 = self.name;
                                    var $3832 = self.indx;
                                    var $3833 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3833;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3834 = self.name;
                                    var $3835 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3835;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3836 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3836;
                                    break;
                                case 'Fm.Term.all':
                                    var $3837 = self.eras;
                                    var $3838 = self.self;
                                    var $3839 = self.name;
                                    var $3840 = self.xtyp;
                                    var $3841 = self.body;
                                    var $3842 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3842;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3843 = self.name;
                                    var $3844 = self.body;
                                    var $3845 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3845;
                                    break;
                                case 'Fm.Term.app':
                                    var $3846 = self.func;
                                    var $3847 = self.argm;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var $3848 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3828, $3846, _defs$3, _lv$4, _seen$17))((_eq_func$18 => {
                                        var $3849 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3829, $3847, _defs$3, _lv$4, _seen$17))((_eq_argm$19 => {
                                            var $3850 = Monad$pure$(Fm$Check$monad)((_eq_func$18 && _eq_argm$19));
                                            return $3850;
                                        }));
                                        return $3849;
                                    }));
                                    var $3830 = $3848;
                                    break;
                                case 'Fm.Term.let':
                                    var $3851 = self.name;
                                    var $3852 = self.expr;
                                    var $3853 = self.body;
                                    var $3854 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3854;
                                    break;
                                case 'Fm.Term.def':
                                    var $3855 = self.name;
                                    var $3856 = self.expr;
                                    var $3857 = self.body;
                                    var $3858 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3858;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3859 = self.done;
                                    var $3860 = self.term;
                                    var $3861 = self.type;
                                    var $3862 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3862;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3863 = self.name;
                                    var $3864 = self.dref;
                                    var $3865 = self.verb;
                                    var $3866 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3866;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3867 = self.path;
                                    var $3868 = Fm$Term$equal$patch$($3867, _a$1, Bool$true);
                                    var $3830 = $3868;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3869 = self.natx;
                                    var $3870 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3870;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3871 = self.chrx;
                                    var $3872 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3872;
                                    break;
                                case 'Fm.Term.str':
                                    var $3873 = self.strx;
                                    var $3874 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3874;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3875 = self.path;
                                    var $3876 = self.expr;
                                    var $3877 = self.name;
                                    var $3878 = self.with;
                                    var $3879 = self.cses;
                                    var $3880 = self.moti;
                                    var $3881 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3881;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3882 = self.orig;
                                    var $3883 = self.expr;
                                    var $3884 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3830 = $3884;
                                    break;
                            };
                            var $3547 = $3830;
                            break;
                        case 'Fm.Term.let':
                            var $3885 = self.name;
                            var $3886 = self.expr;
                            var $3887 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3889 = self.name;
                                    var $3890 = self.indx;
                                    var $3891 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3891;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3892 = self.name;
                                    var $3893 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3893;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3894 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3894;
                                    break;
                                case 'Fm.Term.all':
                                    var $3895 = self.eras;
                                    var $3896 = self.self;
                                    var $3897 = self.name;
                                    var $3898 = self.xtyp;
                                    var $3899 = self.body;
                                    var $3900 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3900;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3901 = self.name;
                                    var $3902 = self.body;
                                    var $3903 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3903;
                                    break;
                                case 'Fm.Term.app':
                                    var $3904 = self.func;
                                    var $3905 = self.argm;
                                    var $3906 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3906;
                                    break;
                                case 'Fm.Term.let':
                                    var $3907 = self.name;
                                    var $3908 = self.expr;
                                    var $3909 = self.body;
                                    var _seen$19 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$20 = $3887(Fm$Term$var$($3885, _lv$4));
                                    var _b1_body$21 = $3909(Fm$Term$var$($3907, _lv$4));
                                    var $3910 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3886, $3908, _defs$3, _lv$4, _seen$19))((_eq_expr$22 => {
                                        var $3911 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19))((_eq_body$23 => {
                                            var $3912 = Monad$pure$(Fm$Check$monad)((_eq_expr$22 && _eq_body$23));
                                            return $3912;
                                        }));
                                        return $3911;
                                    }));
                                    var $3888 = $3910;
                                    break;
                                case 'Fm.Term.def':
                                    var $3913 = self.name;
                                    var $3914 = self.expr;
                                    var $3915 = self.body;
                                    var $3916 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3916;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3917 = self.done;
                                    var $3918 = self.term;
                                    var $3919 = self.type;
                                    var $3920 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3920;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3921 = self.name;
                                    var $3922 = self.dref;
                                    var $3923 = self.verb;
                                    var $3924 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3924;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3925 = self.path;
                                    var $3926 = Fm$Term$equal$patch$($3925, _a$1, Bool$true);
                                    var $3888 = $3926;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3927 = self.natx;
                                    var $3928 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3928;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3929 = self.chrx;
                                    var $3930 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3930;
                                    break;
                                case 'Fm.Term.str':
                                    var $3931 = self.strx;
                                    var $3932 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3932;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3933 = self.path;
                                    var $3934 = self.expr;
                                    var $3935 = self.name;
                                    var $3936 = self.with;
                                    var $3937 = self.cses;
                                    var $3938 = self.moti;
                                    var $3939 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3939;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3940 = self.orig;
                                    var $3941 = self.expr;
                                    var $3942 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3888 = $3942;
                                    break;
                            };
                            var $3547 = $3888;
                            break;
                        case 'Fm.Term.def':
                            var $3943 = self.name;
                            var $3944 = self.expr;
                            var $3945 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3947 = self.name;
                                    var $3948 = self.indx;
                                    var $3949 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3949;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3950 = self.name;
                                    var $3951 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3951;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3952 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3952;
                                    break;
                                case 'Fm.Term.all':
                                    var $3953 = self.eras;
                                    var $3954 = self.self;
                                    var $3955 = self.name;
                                    var $3956 = self.xtyp;
                                    var $3957 = self.body;
                                    var $3958 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3958;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3959 = self.name;
                                    var $3960 = self.body;
                                    var $3961 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3961;
                                    break;
                                case 'Fm.Term.app':
                                    var $3962 = self.func;
                                    var $3963 = self.argm;
                                    var $3964 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3964;
                                    break;
                                case 'Fm.Term.let':
                                    var $3965 = self.name;
                                    var $3966 = self.expr;
                                    var $3967 = self.body;
                                    var $3968 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3968;
                                    break;
                                case 'Fm.Term.def':
                                    var $3969 = self.name;
                                    var $3970 = self.expr;
                                    var $3971 = self.body;
                                    var $3972 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3972;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3973 = self.done;
                                    var $3974 = self.term;
                                    var $3975 = self.type;
                                    var $3976 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3976;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3977 = self.name;
                                    var $3978 = self.dref;
                                    var $3979 = self.verb;
                                    var $3980 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3980;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3981 = self.path;
                                    var $3982 = Fm$Term$equal$patch$($3981, _a$1, Bool$true);
                                    var $3946 = $3982;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3983 = self.natx;
                                    var $3984 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3984;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3985 = self.chrx;
                                    var $3986 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3986;
                                    break;
                                case 'Fm.Term.str':
                                    var $3987 = self.strx;
                                    var $3988 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3988;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3989 = self.path;
                                    var $3990 = self.expr;
                                    var $3991 = self.name;
                                    var $3992 = self.with;
                                    var $3993 = self.cses;
                                    var $3994 = self.moti;
                                    var $3995 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3995;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3996 = self.orig;
                                    var $3997 = self.expr;
                                    var $3998 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3946 = $3998;
                                    break;
                            };
                            var $3547 = $3946;
                            break;
                        case 'Fm.Term.ann':
                            var $3999 = self.done;
                            var $4000 = self.term;
                            var $4001 = self.type;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4003 = self.name;
                                    var $4004 = self.indx;
                                    var $4005 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4005;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4006 = self.name;
                                    var $4007 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4007;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4008 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4008;
                                    break;
                                case 'Fm.Term.all':
                                    var $4009 = self.eras;
                                    var $4010 = self.self;
                                    var $4011 = self.name;
                                    var $4012 = self.xtyp;
                                    var $4013 = self.body;
                                    var $4014 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4014;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4015 = self.name;
                                    var $4016 = self.body;
                                    var $4017 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4017;
                                    break;
                                case 'Fm.Term.app':
                                    var $4018 = self.func;
                                    var $4019 = self.argm;
                                    var $4020 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4020;
                                    break;
                                case 'Fm.Term.let':
                                    var $4021 = self.name;
                                    var $4022 = self.expr;
                                    var $4023 = self.body;
                                    var $4024 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4024;
                                    break;
                                case 'Fm.Term.def':
                                    var $4025 = self.name;
                                    var $4026 = self.expr;
                                    var $4027 = self.body;
                                    var $4028 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4028;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4029 = self.done;
                                    var $4030 = self.term;
                                    var $4031 = self.type;
                                    var $4032 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4032;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4033 = self.name;
                                    var $4034 = self.dref;
                                    var $4035 = self.verb;
                                    var $4036 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4036;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4037 = self.path;
                                    var $4038 = Fm$Term$equal$patch$($4037, _a$1, Bool$true);
                                    var $4002 = $4038;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4039 = self.natx;
                                    var $4040 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4040;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4041 = self.chrx;
                                    var $4042 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4042;
                                    break;
                                case 'Fm.Term.str':
                                    var $4043 = self.strx;
                                    var $4044 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4044;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4045 = self.path;
                                    var $4046 = self.expr;
                                    var $4047 = self.name;
                                    var $4048 = self.with;
                                    var $4049 = self.cses;
                                    var $4050 = self.moti;
                                    var $4051 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4051;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4052 = self.orig;
                                    var $4053 = self.expr;
                                    var $4054 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4002 = $4054;
                                    break;
                            };
                            var $3547 = $4002;
                            break;
                        case 'Fm.Term.gol':
                            var $4055 = self.name;
                            var $4056 = self.dref;
                            var $4057 = self.verb;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4059 = self.name;
                                    var $4060 = self.indx;
                                    var $4061 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4061;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4062 = self.name;
                                    var $4063 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4063;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4064 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4064;
                                    break;
                                case 'Fm.Term.all':
                                    var $4065 = self.eras;
                                    var $4066 = self.self;
                                    var $4067 = self.name;
                                    var $4068 = self.xtyp;
                                    var $4069 = self.body;
                                    var $4070 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4070;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4071 = self.name;
                                    var $4072 = self.body;
                                    var $4073 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4073;
                                    break;
                                case 'Fm.Term.app':
                                    var $4074 = self.func;
                                    var $4075 = self.argm;
                                    var $4076 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4076;
                                    break;
                                case 'Fm.Term.let':
                                    var $4077 = self.name;
                                    var $4078 = self.expr;
                                    var $4079 = self.body;
                                    var $4080 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4080;
                                    break;
                                case 'Fm.Term.def':
                                    var $4081 = self.name;
                                    var $4082 = self.expr;
                                    var $4083 = self.body;
                                    var $4084 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4084;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4085 = self.done;
                                    var $4086 = self.term;
                                    var $4087 = self.type;
                                    var $4088 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4088;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4089 = self.name;
                                    var $4090 = self.dref;
                                    var $4091 = self.verb;
                                    var $4092 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4092;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4093 = self.path;
                                    var $4094 = Fm$Term$equal$patch$($4093, _a$1, Bool$true);
                                    var $4058 = $4094;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4095 = self.natx;
                                    var $4096 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4096;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4097 = self.chrx;
                                    var $4098 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4098;
                                    break;
                                case 'Fm.Term.str':
                                    var $4099 = self.strx;
                                    var $4100 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4100;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4101 = self.path;
                                    var $4102 = self.expr;
                                    var $4103 = self.name;
                                    var $4104 = self.with;
                                    var $4105 = self.cses;
                                    var $4106 = self.moti;
                                    var $4107 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4107;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4108 = self.orig;
                                    var $4109 = self.expr;
                                    var $4110 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4058 = $4110;
                                    break;
                            };
                            var $3547 = $4058;
                            break;
                        case 'Fm.Term.hol':
                            var $4111 = self.path;
                            var $4112 = Fm$Term$equal$patch$($4111, _b$2, Bool$true);
                            var $3547 = $4112;
                            break;
                        case 'Fm.Term.nat':
                            var $4113 = self.natx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4115 = self.name;
                                    var $4116 = self.indx;
                                    var $4117 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4117;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4118 = self.name;
                                    var $4119 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4119;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4120 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4120;
                                    break;
                                case 'Fm.Term.all':
                                    var $4121 = self.eras;
                                    var $4122 = self.self;
                                    var $4123 = self.name;
                                    var $4124 = self.xtyp;
                                    var $4125 = self.body;
                                    var $4126 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4126;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4127 = self.name;
                                    var $4128 = self.body;
                                    var $4129 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4129;
                                    break;
                                case 'Fm.Term.app':
                                    var $4130 = self.func;
                                    var $4131 = self.argm;
                                    var $4132 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4132;
                                    break;
                                case 'Fm.Term.let':
                                    var $4133 = self.name;
                                    var $4134 = self.expr;
                                    var $4135 = self.body;
                                    var $4136 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4136;
                                    break;
                                case 'Fm.Term.def':
                                    var $4137 = self.name;
                                    var $4138 = self.expr;
                                    var $4139 = self.body;
                                    var $4140 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4140;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4141 = self.done;
                                    var $4142 = self.term;
                                    var $4143 = self.type;
                                    var $4144 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4144;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4145 = self.name;
                                    var $4146 = self.dref;
                                    var $4147 = self.verb;
                                    var $4148 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4148;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4149 = self.path;
                                    var $4150 = Fm$Term$equal$patch$($4149, _a$1, Bool$true);
                                    var $4114 = $4150;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4151 = self.natx;
                                    var $4152 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4152;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4153 = self.chrx;
                                    var $4154 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4154;
                                    break;
                                case 'Fm.Term.str':
                                    var $4155 = self.strx;
                                    var $4156 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4156;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4157 = self.path;
                                    var $4158 = self.expr;
                                    var $4159 = self.name;
                                    var $4160 = self.with;
                                    var $4161 = self.cses;
                                    var $4162 = self.moti;
                                    var $4163 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4163;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4164 = self.orig;
                                    var $4165 = self.expr;
                                    var $4166 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4114 = $4166;
                                    break;
                            };
                            var $3547 = $4114;
                            break;
                        case 'Fm.Term.chr':
                            var $4167 = self.chrx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4169 = self.name;
                                    var $4170 = self.indx;
                                    var $4171 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4171;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4172 = self.name;
                                    var $4173 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4173;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4174 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4174;
                                    break;
                                case 'Fm.Term.all':
                                    var $4175 = self.eras;
                                    var $4176 = self.self;
                                    var $4177 = self.name;
                                    var $4178 = self.xtyp;
                                    var $4179 = self.body;
                                    var $4180 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4180;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4181 = self.name;
                                    var $4182 = self.body;
                                    var $4183 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4183;
                                    break;
                                case 'Fm.Term.app':
                                    var $4184 = self.func;
                                    var $4185 = self.argm;
                                    var $4186 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4186;
                                    break;
                                case 'Fm.Term.let':
                                    var $4187 = self.name;
                                    var $4188 = self.expr;
                                    var $4189 = self.body;
                                    var $4190 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4190;
                                    break;
                                case 'Fm.Term.def':
                                    var $4191 = self.name;
                                    var $4192 = self.expr;
                                    var $4193 = self.body;
                                    var $4194 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4194;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4195 = self.done;
                                    var $4196 = self.term;
                                    var $4197 = self.type;
                                    var $4198 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4198;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4199 = self.name;
                                    var $4200 = self.dref;
                                    var $4201 = self.verb;
                                    var $4202 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4202;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4203 = self.path;
                                    var $4204 = Fm$Term$equal$patch$($4203, _a$1, Bool$true);
                                    var $4168 = $4204;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4205 = self.natx;
                                    var $4206 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4206;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4207 = self.chrx;
                                    var $4208 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4208;
                                    break;
                                case 'Fm.Term.str':
                                    var $4209 = self.strx;
                                    var $4210 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4210;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4211 = self.path;
                                    var $4212 = self.expr;
                                    var $4213 = self.name;
                                    var $4214 = self.with;
                                    var $4215 = self.cses;
                                    var $4216 = self.moti;
                                    var $4217 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4217;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4218 = self.orig;
                                    var $4219 = self.expr;
                                    var $4220 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4168 = $4220;
                                    break;
                            };
                            var $3547 = $4168;
                            break;
                        case 'Fm.Term.str':
                            var $4221 = self.strx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4223 = self.name;
                                    var $4224 = self.indx;
                                    var $4225 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4225;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4226 = self.name;
                                    var $4227 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4227;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4228 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4228;
                                    break;
                                case 'Fm.Term.all':
                                    var $4229 = self.eras;
                                    var $4230 = self.self;
                                    var $4231 = self.name;
                                    var $4232 = self.xtyp;
                                    var $4233 = self.body;
                                    var $4234 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4234;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4235 = self.name;
                                    var $4236 = self.body;
                                    var $4237 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4237;
                                    break;
                                case 'Fm.Term.app':
                                    var $4238 = self.func;
                                    var $4239 = self.argm;
                                    var $4240 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4240;
                                    break;
                                case 'Fm.Term.let':
                                    var $4241 = self.name;
                                    var $4242 = self.expr;
                                    var $4243 = self.body;
                                    var $4244 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4244;
                                    break;
                                case 'Fm.Term.def':
                                    var $4245 = self.name;
                                    var $4246 = self.expr;
                                    var $4247 = self.body;
                                    var $4248 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4248;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4249 = self.done;
                                    var $4250 = self.term;
                                    var $4251 = self.type;
                                    var $4252 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4252;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4253 = self.name;
                                    var $4254 = self.dref;
                                    var $4255 = self.verb;
                                    var $4256 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4256;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4257 = self.path;
                                    var $4258 = Fm$Term$equal$patch$($4257, _a$1, Bool$true);
                                    var $4222 = $4258;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4259 = self.natx;
                                    var $4260 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4260;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4261 = self.chrx;
                                    var $4262 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4262;
                                    break;
                                case 'Fm.Term.str':
                                    var $4263 = self.strx;
                                    var $4264 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4264;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4265 = self.path;
                                    var $4266 = self.expr;
                                    var $4267 = self.name;
                                    var $4268 = self.with;
                                    var $4269 = self.cses;
                                    var $4270 = self.moti;
                                    var $4271 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4271;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4272 = self.orig;
                                    var $4273 = self.expr;
                                    var $4274 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4222 = $4274;
                                    break;
                            };
                            var $3547 = $4222;
                            break;
                        case 'Fm.Term.cse':
                            var $4275 = self.path;
                            var $4276 = self.expr;
                            var $4277 = self.name;
                            var $4278 = self.with;
                            var $4279 = self.cses;
                            var $4280 = self.moti;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4282 = self.name;
                                    var $4283 = self.indx;
                                    var $4284 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4284;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4285 = self.name;
                                    var $4286 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4286;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4287 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4287;
                                    break;
                                case 'Fm.Term.all':
                                    var $4288 = self.eras;
                                    var $4289 = self.self;
                                    var $4290 = self.name;
                                    var $4291 = self.xtyp;
                                    var $4292 = self.body;
                                    var $4293 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4293;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4294 = self.name;
                                    var $4295 = self.body;
                                    var $4296 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4296;
                                    break;
                                case 'Fm.Term.app':
                                    var $4297 = self.func;
                                    var $4298 = self.argm;
                                    var $4299 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4299;
                                    break;
                                case 'Fm.Term.let':
                                    var $4300 = self.name;
                                    var $4301 = self.expr;
                                    var $4302 = self.body;
                                    var $4303 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4303;
                                    break;
                                case 'Fm.Term.def':
                                    var $4304 = self.name;
                                    var $4305 = self.expr;
                                    var $4306 = self.body;
                                    var $4307 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4307;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4308 = self.done;
                                    var $4309 = self.term;
                                    var $4310 = self.type;
                                    var $4311 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4311;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4312 = self.name;
                                    var $4313 = self.dref;
                                    var $4314 = self.verb;
                                    var $4315 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4315;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4316 = self.path;
                                    var $4317 = Fm$Term$equal$patch$($4316, _a$1, Bool$true);
                                    var $4281 = $4317;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4318 = self.natx;
                                    var $4319 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4319;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4320 = self.chrx;
                                    var $4321 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4321;
                                    break;
                                case 'Fm.Term.str':
                                    var $4322 = self.strx;
                                    var $4323 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4323;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4324 = self.path;
                                    var $4325 = self.expr;
                                    var $4326 = self.name;
                                    var $4327 = self.with;
                                    var $4328 = self.cses;
                                    var $4329 = self.moti;
                                    var $4330 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4330;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4331 = self.orig;
                                    var $4332 = self.expr;
                                    var $4333 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4281 = $4333;
                                    break;
                            };
                            var $3547 = $4281;
                            break;
                        case 'Fm.Term.ori':
                            var $4334 = self.orig;
                            var $4335 = self.expr;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4337 = self.name;
                                    var $4338 = self.indx;
                                    var $4339 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4339;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4340 = self.name;
                                    var $4341 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4341;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4342 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4342;
                                    break;
                                case 'Fm.Term.all':
                                    var $4343 = self.eras;
                                    var $4344 = self.self;
                                    var $4345 = self.name;
                                    var $4346 = self.xtyp;
                                    var $4347 = self.body;
                                    var $4348 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4348;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4349 = self.name;
                                    var $4350 = self.body;
                                    var $4351 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4351;
                                    break;
                                case 'Fm.Term.app':
                                    var $4352 = self.func;
                                    var $4353 = self.argm;
                                    var $4354 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4354;
                                    break;
                                case 'Fm.Term.let':
                                    var $4355 = self.name;
                                    var $4356 = self.expr;
                                    var $4357 = self.body;
                                    var $4358 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4358;
                                    break;
                                case 'Fm.Term.def':
                                    var $4359 = self.name;
                                    var $4360 = self.expr;
                                    var $4361 = self.body;
                                    var $4362 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4362;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4363 = self.done;
                                    var $4364 = self.term;
                                    var $4365 = self.type;
                                    var $4366 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4366;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4367 = self.name;
                                    var $4368 = self.dref;
                                    var $4369 = self.verb;
                                    var $4370 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4370;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4371 = self.path;
                                    var $4372 = Fm$Term$equal$patch$($4371, _a$1, Bool$true);
                                    var $4336 = $4372;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4373 = self.natx;
                                    var $4374 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4374;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4375 = self.chrx;
                                    var $4376 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4376;
                                    break;
                                case 'Fm.Term.str':
                                    var $4377 = self.strx;
                                    var $4378 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4378;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4379 = self.path;
                                    var $4380 = self.expr;
                                    var $4381 = self.name;
                                    var $4382 = self.with;
                                    var $4383 = self.cses;
                                    var $4384 = self.moti;
                                    var $4385 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4385;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4386 = self.orig;
                                    var $4387 = self.expr;
                                    var $4388 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4336 = $4388;
                                    break;
                            };
                            var $3547 = $4336;
                            break;
                    };
                    var $3544 = $3547;
                };
                var $3542 = $3544;
            };
            var $3540 = $3542;
        };
        return $3540;
    };
    const Fm$Term$equal = x0 => x1 => x2 => x3 => x4 => Fm$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;

    function Fm$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var $4389 = Monad$bind$(Fm$Check$monad)((() => {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $4390 = self.name;
                    var $4391 = self.indx;
                    var self = List$at_last$($4391, _ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4393 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4390), List$nil));
                            var $4392 = $4393;
                            break;
                        case 'Maybe.some':
                            var $4394 = self.value;
                            var $4395 = Monad$pure$(Fm$Check$monad)((() => {
                                var self = $4394;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4396 = self.fst;
                                        var $4397 = self.snd;
                                        var $4398 = $4397;
                                        return $4398;
                                };
                            })());
                            var $4392 = $4395;
                            break;
                    };
                    return $4392;
                case 'Fm.Term.ref':
                    var $4399 = self.name;
                    var self = Fm$get$($4399, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4401 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4399), List$nil));
                            var $4400 = $4401;
                            break;
                        case 'Maybe.some':
                            var $4402 = self.value;
                            var self = $4402;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $4404 = self.file;
                                    var $4405 = self.code;
                                    var $4406 = self.name;
                                    var $4407 = self.term;
                                    var $4408 = self.type;
                                    var $4409 = self.stat;
                                    var _ref_name$15 = $4406;
                                    var _ref_type$16 = $4408;
                                    var _ref_term$17 = $4407;
                                    var _ref_stat$18 = $4409;
                                    var self = _ref_stat$18;
                                    switch (self._) {
                                        case 'Fm.Status.init':
                                            var $4411 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$waiting$(_ref_name$15), List$nil));
                                            var $4410 = $4411;
                                            break;
                                        case 'Fm.Status.wait':
                                            var $4412 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4410 = $4412;
                                            break;
                                        case 'Fm.Status.done':
                                            var $4413 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4410 = $4413;
                                            break;
                                        case 'Fm.Status.fail':
                                            var $4414 = self.errors;
                                            var $4415 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$indirect$(_ref_name$15), List$nil));
                                            var $4410 = $4415;
                                            break;
                                    };
                                    var $4403 = $4410;
                                    break;
                            };
                            var $4400 = $4403;
                            break;
                    };
                    return $4400;
                case 'Fm.Term.typ':
                    var $4416 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                    return $4416;
                case 'Fm.Term.all':
                    var $4417 = self.eras;
                    var $4418 = self.self;
                    var $4419 = self.name;
                    var $4420 = self.xtyp;
                    var $4421 = self.body;
                    var _ctx_size$12 = List$length$(_ctx$4);
                    var _self_var$13 = Fm$Term$var$($4418, _ctx_size$12);
                    var _body_var$14 = Fm$Term$var$($4419, Nat$succ$(_ctx_size$12));
                    var _body_ctx$15 = List$cons$(Pair$new$($4419, $4420), List$cons$(Pair$new$($4418, _term$1), _ctx$4));
                    var $4422 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4420, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$16 => {
                        var $4423 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4421(_self_var$13)(_body_var$14), Maybe$some$(Fm$Term$typ), _defs$3, _body_ctx$15, Fm$MPath$i$(_path$5), _orig$6))((_$17 => {
                            var $4424 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                            return $4424;
                        }));
                        return $4423;
                    }));
                    return $4422;
                case 'Fm.Term.lam':
                    var $4425 = self.name;
                    var $4426 = self.body;
                    var self = _type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4428 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                            var $4427 = $4428;
                            break;
                        case 'Maybe.some':
                            var $4429 = self.value;
                            var _typv$10 = Fm$Term$reduce$($4429, _defs$3);
                            var self = _typv$10;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4431 = self.name;
                                    var $4432 = self.indx;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4429);
                                    var $4433 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4430 = $4433;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4434 = self.name;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4429);
                                    var $4435 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4430 = $4435;
                                    break;
                                case 'Fm.Term.typ':
                                    var _expected$11 = Either$left$("Function");
                                    var _detected$12 = Either$right$($4429);
                                    var $4436 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                    var $4430 = $4436;
                                    break;
                                case 'Fm.Term.all':
                                    var $4437 = self.eras;
                                    var $4438 = self.self;
                                    var $4439 = self.name;
                                    var $4440 = self.xtyp;
                                    var $4441 = self.body;
                                    var _ctx_size$16 = List$length$(_ctx$4);
                                    var _self_var$17 = _term$1;
                                    var _body_var$18 = Fm$Term$var$($4425, _ctx_size$16);
                                    var _body_typ$19 = $4441(_self_var$17)(_body_var$18);
                                    var _body_ctx$20 = List$cons$(Pair$new$($4425, $4440), _ctx$4);
                                    var $4442 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4426(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Fm$MPath$o$(_path$5), _orig$6))((_$21 => {
                                        var $4443 = Monad$pure$(Fm$Check$monad)($4429);
                                        return $4443;
                                    }));
                                    var $4430 = $4442;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4444 = self.name;
                                    var $4445 = self.body;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4429);
                                    var $4446 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4430 = $4446;
                                    break;
                                case 'Fm.Term.app':
                                    var $4447 = self.func;
                                    var $4448 = self.argm;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4429);
                                    var $4449 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4430 = $4449;
                                    break;
                                case 'Fm.Term.let':
                                    var $4450 = self.name;
                                    var $4451 = self.expr;
                                    var $4452 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4429);
                                    var $4453 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4430 = $4453;
                                    break;
                                case 'Fm.Term.def':
                                    var $4454 = self.name;
                                    var $4455 = self.expr;
                                    var $4456 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4429);
                                    var $4457 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4430 = $4457;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4458 = self.done;
                                    var $4459 = self.term;
                                    var $4460 = self.type;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4429);
                                    var $4461 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4430 = $4461;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4462 = self.name;
                                    var $4463 = self.dref;
                                    var $4464 = self.verb;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4429);
                                    var $4465 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4430 = $4465;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4466 = self.path;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4429);
                                    var $4467 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4430 = $4467;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4468 = self.natx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4429);
                                    var $4469 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4430 = $4469;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4470 = self.chrx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4429);
                                    var $4471 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4430 = $4471;
                                    break;
                                case 'Fm.Term.str':
                                    var $4472 = self.strx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4429);
                                    var $4473 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4430 = $4473;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4474 = self.path;
                                    var $4475 = self.expr;
                                    var $4476 = self.name;
                                    var $4477 = self.with;
                                    var $4478 = self.cses;
                                    var $4479 = self.moti;
                                    var _expected$17 = Either$left$("Function");
                                    var _detected$18 = Either$right$($4429);
                                    var $4480 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                    var $4430 = $4480;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4481 = self.orig;
                                    var $4482 = self.expr;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4429);
                                    var $4483 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4430 = $4483;
                                    break;
                            };
                            var $4427 = $4430;
                            break;
                    };
                    return $4427;
                case 'Fm.Term.app':
                    var $4484 = self.func;
                    var $4485 = self.argm;
                    var $4486 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4484, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_func_typ$9 => {
                        var _func_typ$10 = Fm$Term$reduce$(_func_typ$9, _defs$3);
                        var self = _func_typ$10;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $4488 = self.name;
                                var $4489 = self.indx;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4490 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4487 = $4490;
                                break;
                            case 'Fm.Term.ref':
                                var $4491 = self.name;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4492 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4487 = $4492;
                                break;
                            case 'Fm.Term.typ':
                                var _expected$11 = Either$left$("Function");
                                var _detected$12 = Either$right$(_func_typ$10);
                                var $4493 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4487 = $4493;
                                break;
                            case 'Fm.Term.all':
                                var $4494 = self.eras;
                                var $4495 = self.self;
                                var $4496 = self.name;
                                var $4497 = self.xtyp;
                                var $4498 = self.body;
                                var $4499 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4485, Maybe$some$($4497), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$16 => {
                                    var $4500 = Monad$pure$(Fm$Check$monad)($4498($4484)($4485));
                                    return $4500;
                                }));
                                var $4487 = $4499;
                                break;
                            case 'Fm.Term.lam':
                                var $4501 = self.name;
                                var $4502 = self.body;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4503 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4487 = $4503;
                                break;
                            case 'Fm.Term.app':
                                var $4504 = self.func;
                                var $4505 = self.argm;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4506 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4487 = $4506;
                                break;
                            case 'Fm.Term.let':
                                var $4507 = self.name;
                                var $4508 = self.expr;
                                var $4509 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4510 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4487 = $4510;
                                break;
                            case 'Fm.Term.def':
                                var $4511 = self.name;
                                var $4512 = self.expr;
                                var $4513 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4514 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4487 = $4514;
                                break;
                            case 'Fm.Term.ann':
                                var $4515 = self.done;
                                var $4516 = self.term;
                                var $4517 = self.type;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4518 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4487 = $4518;
                                break;
                            case 'Fm.Term.gol':
                                var $4519 = self.name;
                                var $4520 = self.dref;
                                var $4521 = self.verb;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4522 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4487 = $4522;
                                break;
                            case 'Fm.Term.hol':
                                var $4523 = self.path;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4524 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4487 = $4524;
                                break;
                            case 'Fm.Term.nat':
                                var $4525 = self.natx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4526 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4487 = $4526;
                                break;
                            case 'Fm.Term.chr':
                                var $4527 = self.chrx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4528 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4487 = $4528;
                                break;
                            case 'Fm.Term.str':
                                var $4529 = self.strx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4530 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4487 = $4530;
                                break;
                            case 'Fm.Term.cse':
                                var $4531 = self.path;
                                var $4532 = self.expr;
                                var $4533 = self.name;
                                var $4534 = self.with;
                                var $4535 = self.cses;
                                var $4536 = self.moti;
                                var _expected$17 = Either$left$("Function");
                                var _detected$18 = Either$right$(_func_typ$10);
                                var $4537 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4487 = $4537;
                                break;
                            case 'Fm.Term.ori':
                                var $4538 = self.orig;
                                var $4539 = self.expr;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4540 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4487 = $4540;
                                break;
                        };
                        return $4487;
                    }));
                    return $4486;
                case 'Fm.Term.let':
                    var $4541 = self.name;
                    var $4542 = self.expr;
                    var $4543 = self.body;
                    var _ctx_size$10 = List$length$(_ctx$4);
                    var $4544 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4542, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_expr_typ$11 => {
                        var _body_val$12 = $4543(Fm$Term$var$($4541, _ctx_size$10));
                        var _body_ctx$13 = List$cons$(Pair$new$($4541, _expr_typ$11), _ctx$4);
                        var $4545 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_body_val$12, _type$2, _defs$3, _body_ctx$13, Fm$MPath$i$(_path$5), _orig$6))((_body_typ$14 => {
                            var $4546 = Monad$pure$(Fm$Check$monad)(_body_typ$14);
                            return $4546;
                        }));
                        return $4545;
                    }));
                    return $4544;
                case 'Fm.Term.def':
                    var $4547 = self.name;
                    var $4548 = self.expr;
                    var $4549 = self.body;
                    var $4550 = Fm$Term$check$($4549($4548), _type$2, _defs$3, _ctx$4, _path$5, _orig$6);
                    return $4550;
                case 'Fm.Term.ann':
                    var $4551 = self.done;
                    var $4552 = self.term;
                    var $4553 = self.type;
                    var self = $4551;
                    if (self) {
                        var $4555 = Monad$pure$(Fm$Check$monad)($4553);
                        var $4554 = $4555;
                    } else {
                        var $4556 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4552, Maybe$some$($4553), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$10 => {
                            var $4557 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4553, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$11 => {
                                var $4558 = Monad$pure$(Fm$Check$monad)($4553);
                                return $4558;
                            }));
                            return $4557;
                        }));
                        var $4554 = $4556;
                    };
                    return $4554;
                case 'Fm.Term.gol':
                    var $4559 = self.name;
                    var $4560 = self.dref;
                    var $4561 = self.verb;
                    var $4562 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$show_goal$($4559, $4560, $4561, _type$2, _ctx$4), List$nil));
                    return $4562;
                case 'Fm.Term.hol':
                    var $4563 = self.path;
                    var $4564 = Fm$Check$result$(_type$2, List$nil);
                    return $4564;
                case 'Fm.Term.nat':
                    var $4565 = self.natx;
                    var $4566 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Nat"));
                    return $4566;
                case 'Fm.Term.chr':
                    var $4567 = self.chrx;
                    var $4568 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Char"));
                    return $4568;
                case 'Fm.Term.str':
                    var $4569 = self.strx;
                    var $4570 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("String"));
                    return $4570;
                case 'Fm.Term.cse':
                    var $4571 = self.path;
                    var $4572 = self.expr;
                    var $4573 = self.name;
                    var $4574 = self.with;
                    var $4575 = self.cses;
                    var $4576 = self.moti;
                    var _expr$13 = $4572;
                    var $4577 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_etyp$14 => {
                        var self = $4576;
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _type$2;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4580 = Fm$Term$hol$(Bits$e);
                                        var _moti$15 = $4580;
                                        break;
                                    case 'Maybe.some':
                                        var $4581 = self.value;
                                        var _size$16 = List$length$(_ctx$4);
                                        var _typv$17 = Fm$Term$normalize$($4581, Map$new);
                                        var _moti$18 = Fm$SmartMotive$make$($4573, $4572, _etyp$14, _typv$17, _size$16, _defs$3);
                                        var $4582 = _moti$18;
                                        var _moti$15 = $4582;
                                        break;
                                };
                                var $4579 = Maybe$some$(Fm$Term$cse$($4571, $4572, $4573, $4574, $4575, Maybe$some$(_moti$15)));
                                var _dsug$15 = $4579;
                                break;
                            case 'Maybe.some':
                                var $4583 = self.value;
                                var $4584 = Fm$Term$desugar_cse$($4572, $4573, $4574, $4575, $4583, _etyp$14, _defs$3, _ctx$4);
                                var _dsug$15 = $4584;
                                break;
                        };
                        var self = _dsug$15;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4585 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                var $4578 = $4585;
                                break;
                            case 'Maybe.some':
                                var $4586 = self.value;
                                var $4587 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$patch$(Fm$MPath$to_bits$(_path$5), $4586), List$nil));
                                var $4578 = $4587;
                                break;
                        };
                        return $4578;
                    }));
                    return $4577;
                case 'Fm.Term.ori':
                    var $4588 = self.orig;
                    var $4589 = self.expr;
                    var $4590 = Fm$Term$check$($4589, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($4588));
                    return $4590;
            };
        })())((_infr$7 => {
            var self = _type$2;
            switch (self._) {
                case 'Maybe.none':
                    var $4592 = Fm$Check$result$(Maybe$some$(_infr$7), List$nil);
                    var $4591 = $4592;
                    break;
                case 'Maybe.some':
                    var $4593 = self.value;
                    var $4594 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($4593, _infr$7, _defs$3, List$length$(_ctx$4), Set$new))((_eqls$9 => {
                        var self = _eqls$9;
                        if (self) {
                            var $4596 = Monad$pure$(Fm$Check$monad)($4593);
                            var $4595 = $4596;
                        } else {
                            var $4597 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, Either$right$($4593), Either$right$(_infr$7), _ctx$4), List$nil));
                            var $4595 = $4597;
                        };
                        return $4595;
                    }));
                    var $4591 = $4594;
                    break;
            };
            return $4591;
        }));
        return $4389;
    };
    const Fm$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Term$check$(x0, x1, x2, x3, x4, x5);

    function Fm$Path$nil$(_x$1) {
        var $4598 = _x$1;
        return $4598;
    };
    const Fm$Path$nil = x0 => Fm$Path$nil$(x0);
    const Fm$MPath$nil = Maybe$some$(Fm$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $4600 = Bool$true;
                var $4599 = $4600;
                break;
            case 'List.cons':
                var $4601 = self.head;
                var $4602 = self.tail;
                var $4603 = Bool$false;
                var $4599 = $4603;
                break;
        };
        return $4599;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Fm$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Fm.Term.var':
                var $4605 = self.name;
                var $4606 = self.indx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4608 = _fn$3(_term$2);
                        var $4607 = $4608;
                        break;
                    case 'o':
                        var $4609 = self.slice(0, -1);
                        var $4610 = _term$2;
                        var $4607 = $4610;
                        break;
                    case 'i':
                        var $4611 = self.slice(0, -1);
                        var $4612 = _term$2;
                        var $4607 = $4612;
                        break;
                };
                var $4604 = $4607;
                break;
            case 'Fm.Term.ref':
                var $4613 = self.name;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4615 = _fn$3(_term$2);
                        var $4614 = $4615;
                        break;
                    case 'o':
                        var $4616 = self.slice(0, -1);
                        var $4617 = _term$2;
                        var $4614 = $4617;
                        break;
                    case 'i':
                        var $4618 = self.slice(0, -1);
                        var $4619 = _term$2;
                        var $4614 = $4619;
                        break;
                };
                var $4604 = $4614;
                break;
            case 'Fm.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4621 = _fn$3(_term$2);
                        var $4620 = $4621;
                        break;
                    case 'o':
                        var $4622 = self.slice(0, -1);
                        var $4623 = _term$2;
                        var $4620 = $4623;
                        break;
                    case 'i':
                        var $4624 = self.slice(0, -1);
                        var $4625 = _term$2;
                        var $4620 = $4625;
                        break;
                };
                var $4604 = $4620;
                break;
            case 'Fm.Term.all':
                var $4626 = self.eras;
                var $4627 = self.self;
                var $4628 = self.name;
                var $4629 = self.xtyp;
                var $4630 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4632 = _fn$3(_term$2);
                        var $4631 = $4632;
                        break;
                    case 'o':
                        var $4633 = self.slice(0, -1);
                        var $4634 = Fm$Term$all$($4626, $4627, $4628, Fm$Term$patch_at$($4633, $4629, _fn$3), $4630);
                        var $4631 = $4634;
                        break;
                    case 'i':
                        var $4635 = self.slice(0, -1);
                        var $4636 = Fm$Term$all$($4626, $4627, $4628, $4629, (_s$10 => _x$11 => {
                            var $4637 = Fm$Term$patch_at$($4635, $4630(_s$10)(_x$11), _fn$3);
                            return $4637;
                        }));
                        var $4631 = $4636;
                        break;
                };
                var $4604 = $4631;
                break;
            case 'Fm.Term.lam':
                var $4638 = self.name;
                var $4639 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4641 = _fn$3(_term$2);
                        var $4640 = $4641;
                        break;
                    case 'o':
                        var $4642 = self.slice(0, -1);
                        var $4643 = Fm$Term$lam$($4638, (_x$7 => {
                            var $4644 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4639(_x$7), _fn$3);
                            return $4644;
                        }));
                        var $4640 = $4643;
                        break;
                    case 'i':
                        var $4645 = self.slice(0, -1);
                        var $4646 = Fm$Term$lam$($4638, (_x$7 => {
                            var $4647 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4639(_x$7), _fn$3);
                            return $4647;
                        }));
                        var $4640 = $4646;
                        break;
                };
                var $4604 = $4640;
                break;
            case 'Fm.Term.app':
                var $4648 = self.func;
                var $4649 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4651 = _fn$3(_term$2);
                        var $4650 = $4651;
                        break;
                    case 'o':
                        var $4652 = self.slice(0, -1);
                        var $4653 = Fm$Term$app$(Fm$Term$patch_at$($4652, $4648, _fn$3), $4649);
                        var $4650 = $4653;
                        break;
                    case 'i':
                        var $4654 = self.slice(0, -1);
                        var $4655 = Fm$Term$app$($4648, Fm$Term$patch_at$($4654, $4649, _fn$3));
                        var $4650 = $4655;
                        break;
                };
                var $4604 = $4650;
                break;
            case 'Fm.Term.let':
                var $4656 = self.name;
                var $4657 = self.expr;
                var $4658 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4660 = _fn$3(_term$2);
                        var $4659 = $4660;
                        break;
                    case 'o':
                        var $4661 = self.slice(0, -1);
                        var $4662 = Fm$Term$let$($4656, Fm$Term$patch_at$($4661, $4657, _fn$3), $4658);
                        var $4659 = $4662;
                        break;
                    case 'i':
                        var $4663 = self.slice(0, -1);
                        var $4664 = Fm$Term$let$($4656, $4657, (_x$8 => {
                            var $4665 = Fm$Term$patch_at$($4663, $4658(_x$8), _fn$3);
                            return $4665;
                        }));
                        var $4659 = $4664;
                        break;
                };
                var $4604 = $4659;
                break;
            case 'Fm.Term.def':
                var $4666 = self.name;
                var $4667 = self.expr;
                var $4668 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4670 = _fn$3(_term$2);
                        var $4669 = $4670;
                        break;
                    case 'o':
                        var $4671 = self.slice(0, -1);
                        var $4672 = Fm$Term$def$($4666, Fm$Term$patch_at$($4671, $4667, _fn$3), $4668);
                        var $4669 = $4672;
                        break;
                    case 'i':
                        var $4673 = self.slice(0, -1);
                        var $4674 = Fm$Term$def$($4666, $4667, (_x$8 => {
                            var $4675 = Fm$Term$patch_at$($4673, $4668(_x$8), _fn$3);
                            return $4675;
                        }));
                        var $4669 = $4674;
                        break;
                };
                var $4604 = $4669;
                break;
            case 'Fm.Term.ann':
                var $4676 = self.done;
                var $4677 = self.term;
                var $4678 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4680 = _fn$3(_term$2);
                        var $4679 = $4680;
                        break;
                    case 'o':
                        var $4681 = self.slice(0, -1);
                        var $4682 = Fm$Term$ann$($4676, Fm$Term$patch_at$($4681, $4677, _fn$3), $4678);
                        var $4679 = $4682;
                        break;
                    case 'i':
                        var $4683 = self.slice(0, -1);
                        var $4684 = Fm$Term$ann$($4676, $4677, Fm$Term$patch_at$($4683, $4678, _fn$3));
                        var $4679 = $4684;
                        break;
                };
                var $4604 = $4679;
                break;
            case 'Fm.Term.gol':
                var $4685 = self.name;
                var $4686 = self.dref;
                var $4687 = self.verb;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4689 = _fn$3(_term$2);
                        var $4688 = $4689;
                        break;
                    case 'o':
                        var $4690 = self.slice(0, -1);
                        var $4691 = _term$2;
                        var $4688 = $4691;
                        break;
                    case 'i':
                        var $4692 = self.slice(0, -1);
                        var $4693 = _term$2;
                        var $4688 = $4693;
                        break;
                };
                var $4604 = $4688;
                break;
            case 'Fm.Term.hol':
                var $4694 = self.path;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4696 = _fn$3(_term$2);
                        var $4695 = $4696;
                        break;
                    case 'o':
                        var $4697 = self.slice(0, -1);
                        var $4698 = _term$2;
                        var $4695 = $4698;
                        break;
                    case 'i':
                        var $4699 = self.slice(0, -1);
                        var $4700 = _term$2;
                        var $4695 = $4700;
                        break;
                };
                var $4604 = $4695;
                break;
            case 'Fm.Term.nat':
                var $4701 = self.natx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4703 = _fn$3(_term$2);
                        var $4702 = $4703;
                        break;
                    case 'o':
                        var $4704 = self.slice(0, -1);
                        var $4705 = _term$2;
                        var $4702 = $4705;
                        break;
                    case 'i':
                        var $4706 = self.slice(0, -1);
                        var $4707 = _term$2;
                        var $4702 = $4707;
                        break;
                };
                var $4604 = $4702;
                break;
            case 'Fm.Term.chr':
                var $4708 = self.chrx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4710 = _fn$3(_term$2);
                        var $4709 = $4710;
                        break;
                    case 'o':
                        var $4711 = self.slice(0, -1);
                        var $4712 = _term$2;
                        var $4709 = $4712;
                        break;
                    case 'i':
                        var $4713 = self.slice(0, -1);
                        var $4714 = _term$2;
                        var $4709 = $4714;
                        break;
                };
                var $4604 = $4709;
                break;
            case 'Fm.Term.str':
                var $4715 = self.strx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4717 = _fn$3(_term$2);
                        var $4716 = $4717;
                        break;
                    case 'o':
                        var $4718 = self.slice(0, -1);
                        var $4719 = _term$2;
                        var $4716 = $4719;
                        break;
                    case 'i':
                        var $4720 = self.slice(0, -1);
                        var $4721 = _term$2;
                        var $4716 = $4721;
                        break;
                };
                var $4604 = $4716;
                break;
            case 'Fm.Term.cse':
                var $4722 = self.path;
                var $4723 = self.expr;
                var $4724 = self.name;
                var $4725 = self.with;
                var $4726 = self.cses;
                var $4727 = self.moti;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4729 = _fn$3(_term$2);
                        var $4728 = $4729;
                        break;
                    case 'o':
                        var $4730 = self.slice(0, -1);
                        var $4731 = _term$2;
                        var $4728 = $4731;
                        break;
                    case 'i':
                        var $4732 = self.slice(0, -1);
                        var $4733 = _term$2;
                        var $4728 = $4733;
                        break;
                };
                var $4604 = $4728;
                break;
            case 'Fm.Term.ori':
                var $4734 = self.orig;
                var $4735 = self.expr;
                var $4736 = Fm$Term$patch_at$(_path$1, $4735, _fn$3);
                var $4604 = $4736;
                break;
        };
        return $4604;
    };
    const Fm$Term$patch_at = x0 => x1 => x2 => Fm$Term$patch_at$(x0, x1, x2);

    function Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, _errs$7, _fixd$8) {
        var self = _errs$7;
        switch (self._) {
            case 'List.nil':
                var self = _fixd$8;
                if (self) {
                    var _type$9 = Fm$Term$bind$(List$nil, (_x$9 => {
                        var $4740 = (_x$9 + '1');
                        return $4740;
                    }), _type$5);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $4741 = (_x$10 + '0');
                        return $4741;
                    }), _term$4);
                    var _defs$11 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$10, _type$9, Fm$Status$init), _defs$6);
                    var $4739 = Monad$pure$(IO$monad)(Maybe$some$(_defs$11));
                    var $4738 = $4739;
                } else {
                    var $4742 = Monad$pure$(IO$monad)(Maybe$none);
                    var $4738 = $4742;
                };
                var $4737 = $4738;
                break;
            case 'List.cons':
                var $4743 = self.head;
                var $4744 = self.tail;
                var self = $4743;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $4746 = self.origin;
                        var $4747 = self.expected;
                        var $4748 = self.detected;
                        var $4749 = self.context;
                        var $4750 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4744, _fixd$8);
                        var $4745 = $4750;
                        break;
                    case 'Fm.Error.show_goal':
                        var $4751 = self.name;
                        var $4752 = self.dref;
                        var $4753 = self.verb;
                        var $4754 = self.goal;
                        var $4755 = self.context;
                        var $4756 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4744, _fixd$8);
                        var $4745 = $4756;
                        break;
                    case 'Fm.Error.waiting':
                        var $4757 = self.name;
                        var $4758 = Monad$bind$(IO$monad)(Fm$Synth$one$($4757, _defs$6))((_defs$12 => {
                            var $4759 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$12, $4744, Bool$true);
                            return $4759;
                        }));
                        var $4745 = $4758;
                        break;
                    case 'Fm.Error.indirect':
                        var $4760 = self.name;
                        var $4761 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4744, _fixd$8);
                        var $4745 = $4761;
                        break;
                    case 'Fm.Error.patch':
                        var $4762 = self.path;
                        var $4763 = self.term;
                        var self = $4762;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'e':
                                var $4765 = Monad$pure$(IO$monad)(Maybe$none);
                                var $4764 = $4765;
                                break;
                            case 'o':
                                var $4766 = self.slice(0, -1);
                                var _term$14 = Fm$Term$patch_at$($4766, _term$4, (_x$14 => {
                                    var $4768 = $4763;
                                    return $4768;
                                }));
                                var $4767 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$14, _type$5, _defs$6, $4744, Bool$true);
                                var $4764 = $4767;
                                break;
                            case 'i':
                                var $4769 = self.slice(0, -1);
                                var _type$14 = Fm$Term$patch_at$($4769, _type$5, (_x$14 => {
                                    var $4771 = $4763;
                                    return $4771;
                                }));
                                var $4770 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$14, _defs$6, $4744, Bool$true);
                                var $4764 = $4770;
                                break;
                        };
                        var $4745 = $4764;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $4772 = self.origin;
                        var $4773 = self.name;
                        var $4774 = Monad$bind$(IO$monad)(Fm$Synth$one$($4773, _defs$6))((_defs$13 => {
                            var $4775 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$13, $4744, Bool$true);
                            return $4775;
                        }));
                        var $4745 = $4774;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $4776 = self.origin;
                        var $4777 = self.term;
                        var $4778 = self.context;
                        var $4779 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4744, _fixd$8);
                        var $4745 = $4779;
                        break;
                };
                var $4737 = $4745;
                break;
        };
        return $4737;
    };
    const Fm$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Status$fail$(_errors$1) {
        var $4780 = ({
            _: 'Fm.Status.fail',
            'errors': _errors$1
        });
        return $4780;
    };
    const Fm$Status$fail = x0 => Fm$Status$fail$(x0);

    function Fm$Synth$one$(_name$1, _defs$2) {
        var self = Fm$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.none':
                var $4782 = Monad$bind$(IO$monad)(Fm$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4784 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("Undefined: ", List$cons$(_name$1, List$nil)))))((_$4 => {
                                var $4785 = Monad$pure$(IO$monad)(_defs$2);
                                return $4785;
                            }));
                            var $4783 = $4784;
                            break;
                        case 'Maybe.some':
                            var $4786 = self.value;
                            var $4787 = Fm$Synth$one$(_name$1, $4786);
                            var $4783 = $4787;
                            break;
                    };
                    return $4783;
                }));
                var $4781 = $4782;
                break;
            case 'Maybe.some':
                var $4788 = self.value;
                var self = $4788;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4790 = self.file;
                        var $4791 = self.code;
                        var $4792 = self.name;
                        var $4793 = self.term;
                        var $4794 = self.type;
                        var $4795 = self.stat;
                        var _file$10 = $4790;
                        var _code$11 = $4791;
                        var _name$12 = $4792;
                        var _term$13 = $4793;
                        var _type$14 = $4794;
                        var _stat$15 = $4795;
                        var self = _stat$15;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var _defs$16 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, Fm$Status$wait), _defs$2);
                                var _checked$17 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_type$14, Maybe$some$(Fm$Term$typ), _defs$16, List$nil, Fm$MPath$i$(Fm$MPath$nil), Maybe$none))((_chk_type$17 => {
                                    var $4798 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_term$13, Maybe$some$(_type$14), _defs$16, List$nil, Fm$MPath$o$(Fm$MPath$nil), Maybe$none))((_chk_term$18 => {
                                        var $4799 = Monad$pure$(Fm$Check$monad)(Unit$new);
                                        return $4799;
                                    }));
                                    return $4798;
                                }));
                                var self = _checked$17;
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $4800 = self.value;
                                        var $4801 = self.errors;
                                        var self = List$is_empty$($4801);
                                        if (self) {
                                            var _defs$20 = Fm$define$(_file$10, _code$11, _name$12, _term$13, _type$14, Bool$true, _defs$16);
                                            var $4803 = Monad$pure$(IO$monad)(_defs$20);
                                            var $4802 = $4803;
                                        } else {
                                            var $4804 = Monad$bind$(IO$monad)(Fm$Synth$fix$(_file$10, _code$11, _name$12, _term$13, _type$14, _defs$16, $4801, Bool$false))((_fixed$20 => {
                                                var self = _fixed$20;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var _stat$21 = Fm$Status$fail$($4801);
                                                        var _defs$22 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, _stat$21), _defs$16);
                                                        var $4806 = Monad$pure$(IO$monad)(_defs$22);
                                                        var $4805 = $4806;
                                                        break;
                                                    case 'Maybe.some':
                                                        var $4807 = self.value;
                                                        var $4808 = Fm$Synth$one$(_name$12, $4807);
                                                        var $4805 = $4808;
                                                        break;
                                                };
                                                return $4805;
                                            }));
                                            var $4802 = $4804;
                                        };
                                        var $4797 = $4802;
                                        break;
                                };
                                var $4796 = $4797;
                                break;
                            case 'Fm.Status.wait':
                                var $4809 = Monad$pure$(IO$monad)(_defs$2);
                                var $4796 = $4809;
                                break;
                            case 'Fm.Status.done':
                                var $4810 = Monad$pure$(IO$monad)(_defs$2);
                                var $4796 = $4810;
                                break;
                            case 'Fm.Status.fail':
                                var $4811 = self.errors;
                                var $4812 = Monad$pure$(IO$monad)(_defs$2);
                                var $4796 = $4812;
                                break;
                        };
                        var $4789 = $4796;
                        break;
                };
                var $4781 = $4789;
                break;
        };
        return $4781;
    };
    const Fm$Synth$one = x0 => x1 => Fm$Synth$one$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $4814 = _list$3;
                var $4813 = $4814;
                break;
            case 'Map.tie':
                var $4815 = self.val;
                var $4816 = self.lft;
                var $4817 = self.rgt;
                var self = $4815;
                switch (self._) {
                    case 'Maybe.none':
                        var $4819 = _list$3;
                        var _list0$7 = $4819;
                        break;
                    case 'Maybe.some':
                        var $4820 = self.value;
                        var $4821 = List$cons$($4820, _list$3);
                        var _list0$7 = $4821;
                        break;
                };
                var _list1$8 = Map$values$go$($4816, _list0$7);
                var _list2$9 = Map$values$go$($4817, _list1$8);
                var $4818 = _list2$9;
                var $4813 = $4818;
                break;
        };
        return $4813;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $4822 = Map$values$go$(_xs$2, List$nil);
        return $4822;
    };
    const Map$values = x0 => Map$values$(x0);

    function Fm$Name$show$(_name$1) {
        var $4823 = _name$1;
        return $4823;
    };
    const Fm$Name$show = x0 => Fm$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $4825 = 0n;
                var $4824 = $4825;
                break;
            case 'o':
                var $4826 = self.slice(0, -1);
                var $4827 = (2n * Bits$to_nat$($4826));
                var $4824 = $4827;
                break;
            case 'i':
                var $4828 = self.slice(0, -1);
                var $4829 = Nat$succ$((2n * Bits$to_nat$($4828)));
                var $4824 = $4829;
                break;
        };
        return $4824;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $4831 = u16_to_word(self);
                var $4832 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($4831)));
                var $4830 = $4832;
                break;
        };
        return $4830;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Fm$escape$char$(_chr$1) {
        var self = (_chr$1 === Fm$backslash);
        if (self) {
            var $4834 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
            var $4833 = $4834;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $4836 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                var $4835 = $4836;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $4838 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                    var $4837 = $4838;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $4840 = String$cons$(_chr$1, String$nil);
                        var $4839 = $4840;
                    } else {
                        var $4841 = String$flatten$(List$cons$(String$cons$(Fm$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $4839 = $4841;
                    };
                    var $4837 = $4839;
                };
                var $4835 = $4837;
            };
            var $4833 = $4835;
        };
        return $4833;
    };
    const Fm$escape$char = x0 => Fm$escape$char$(x0);

    function Fm$escape$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4843 = String$nil;
            var $4842 = $4843;
        } else {
            var $4844 = self.charCodeAt(0);
            var $4845 = self.slice(1);
            var _head$4 = Fm$escape$char$($4844);
            var _tail$5 = Fm$escape$($4845);
            var $4846 = (_head$4 + _tail$5);
            var $4842 = $4846;
        };
        return $4842;
    };
    const Fm$escape = x0 => Fm$escape$(x0);

    function Fm$Term$core$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4848 = self.name;
                var $4849 = self.indx;
                var $4850 = Fm$Name$show$($4848);
                var $4847 = $4850;
                break;
            case 'Fm.Term.ref':
                var $4851 = self.name;
                var $4852 = Fm$Name$show$($4851);
                var $4847 = $4852;
                break;
            case 'Fm.Term.typ':
                var $4853 = "*";
                var $4847 = $4853;
                break;
            case 'Fm.Term.all':
                var $4854 = self.eras;
                var $4855 = self.self;
                var $4856 = self.name;
                var $4857 = self.xtyp;
                var $4858 = self.body;
                var _eras$7 = $4854;
                var self = _eras$7;
                if (self) {
                    var $4860 = "%";
                    var _init$8 = $4860;
                } else {
                    var $4861 = "@";
                    var _init$8 = $4861;
                };
                var _self$9 = Fm$Name$show$($4855);
                var _name$10 = Fm$Name$show$($4856);
                var _xtyp$11 = Fm$Term$core$($4857);
                var _body$12 = Fm$Term$core$($4858(Fm$Term$var$($4855, 0n))(Fm$Term$var$($4856, 0n)));
                var $4859 = String$flatten$(List$cons$(_init$8, List$cons$(_self$9, List$cons$("(", List$cons$(_name$10, List$cons$(":", List$cons$(_xtyp$11, List$cons$(") ", List$cons$(_body$12, List$nil)))))))));
                var $4847 = $4859;
                break;
            case 'Fm.Term.lam':
                var $4862 = self.name;
                var $4863 = self.body;
                var _name$4 = Fm$Name$show$($4862);
                var _body$5 = Fm$Term$core$($4863(Fm$Term$var$($4862, 0n)));
                var $4864 = String$flatten$(List$cons$("#", List$cons$(_name$4, List$cons$(" ", List$cons$(_body$5, List$nil)))));
                var $4847 = $4864;
                break;
            case 'Fm.Term.app':
                var $4865 = self.func;
                var $4866 = self.argm;
                var _func$4 = Fm$Term$core$($4865);
                var _argm$5 = Fm$Term$core$($4866);
                var $4867 = String$flatten$(List$cons$("(", List$cons$(_func$4, List$cons$(" ", List$cons$(_argm$5, List$cons$(")", List$nil))))));
                var $4847 = $4867;
                break;
            case 'Fm.Term.let':
                var $4868 = self.name;
                var $4869 = self.expr;
                var $4870 = self.body;
                var _name$5 = Fm$Name$show$($4868);
                var _expr$6 = Fm$Term$core$($4869);
                var _body$7 = Fm$Term$core$($4870(Fm$Term$var$($4868, 0n)));
                var $4871 = String$flatten$(List$cons$("!", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4847 = $4871;
                break;
            case 'Fm.Term.def':
                var $4872 = self.name;
                var $4873 = self.expr;
                var $4874 = self.body;
                var _name$5 = Fm$Name$show$($4872);
                var _expr$6 = Fm$Term$core$($4873);
                var _body$7 = Fm$Term$core$($4874(Fm$Term$var$($4872, 0n)));
                var $4875 = String$flatten$(List$cons$("$", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4847 = $4875;
                break;
            case 'Fm.Term.ann':
                var $4876 = self.done;
                var $4877 = self.term;
                var $4878 = self.type;
                var _term$5 = Fm$Term$core$($4877);
                var _type$6 = Fm$Term$core$($4878);
                var $4879 = String$flatten$(List$cons$("{", List$cons$(_term$5, List$cons$(":", List$cons$(_type$6, List$cons$("}", List$nil))))));
                var $4847 = $4879;
                break;
            case 'Fm.Term.gol':
                var $4880 = self.name;
                var $4881 = self.dref;
                var $4882 = self.verb;
                var $4883 = "<GOL>";
                var $4847 = $4883;
                break;
            case 'Fm.Term.hol':
                var $4884 = self.path;
                var $4885 = "<HOL>";
                var $4847 = $4885;
                break;
            case 'Fm.Term.nat':
                var $4886 = self.natx;
                var $4887 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($4886), List$nil)));
                var $4847 = $4887;
                break;
            case 'Fm.Term.chr':
                var $4888 = self.chrx;
                var $4889 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($4888), List$cons$("\'", List$nil))));
                var $4847 = $4889;
                break;
            case 'Fm.Term.str':
                var $4890 = self.strx;
                var $4891 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($4890), List$cons$("\"", List$nil))));
                var $4847 = $4891;
                break;
            case 'Fm.Term.cse':
                var $4892 = self.path;
                var $4893 = self.expr;
                var $4894 = self.name;
                var $4895 = self.with;
                var $4896 = self.cses;
                var $4897 = self.moti;
                var $4898 = "<CSE>";
                var $4847 = $4898;
                break;
            case 'Fm.Term.ori':
                var $4899 = self.orig;
                var $4900 = self.expr;
                var $4901 = Fm$Term$core$($4900);
                var $4847 = $4901;
                break;
        };
        return $4847;
    };
    const Fm$Term$core = x0 => Fm$Term$core$(x0);

    function Fm$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $4904 = _result$2;
            var $4905 = Map$values$(_defs$1);
            let _result$4 = $4904;
            let _defn$3;
            while ($4905._ === 'List.cons') {
                _defn$3 = $4905.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4906 = self.file;
                        var $4907 = self.code;
                        var $4908 = self.name;
                        var $4909 = self.term;
                        var $4910 = self.type;
                        var $4911 = self.stat;
                        var self = $4911;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var $4913 = _result$4;
                                var $4912 = $4913;
                                break;
                            case 'Fm.Status.wait':
                                var $4914 = _result$4;
                                var $4912 = $4914;
                                break;
                            case 'Fm.Status.done':
                                var _name$11 = $4908;
                                var _term$12 = Fm$Term$core$($4909);
                                var _type$13 = Fm$Term$core$($4910);
                                var $4915 = String$flatten$(List$cons$(_result$4, List$cons$(_name$11, List$cons$(" : ", List$cons$(_type$13, List$cons$(" = ", List$cons$(_term$12, List$cons$(";\u{a}", List$nil))))))));
                                var $4912 = $4915;
                                break;
                            case 'Fm.Status.fail':
                                var $4916 = self.errors;
                                var $4917 = _result$4;
                                var $4912 = $4917;
                                break;
                        };
                        var $4904 = $4912;
                        break;
                };
                _result$4 = $4904;
                $4905 = $4905.tail;
            }
            return _result$4;
        })();
        var $4902 = _result$3;
        return $4902;
    };
    const Fm$Defs$core = x0 => Fm$Defs$core$(x0);

    function Fm$to_core$io$one$(_name$1) {
        var $4918 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $4919 = Monad$pure$(IO$monad)(Fm$Defs$core$(_defs$2));
            return $4919;
        }));
        return $4918;
    };
    const Fm$to_core$io$one = x0 => Fm$to_core$io$one$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $4921 = Maybe$none;
                var $4920 = $4921;
                break;
            case 'Maybe.some':
                var $4922 = self.value;
                var $4923 = _f$4($4922);
                var $4920 = $4923;
                break;
        };
        return $4920;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);
    const Maybe$monad = Monad$new$(Maybe$bind, Maybe$some);

    function Fm$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4925 = self.name;
                var $4926 = self.indx;
                var $4927 = Maybe$none;
                var $4924 = $4927;
                break;
            case 'Fm.Term.ref':
                var $4928 = self.name;
                var self = ($4928 === "Nat.zero");
                if (self) {
                    var $4930 = Maybe$some$(0n);
                    var $4929 = $4930;
                } else {
                    var $4931 = Maybe$none;
                    var $4929 = $4931;
                };
                var $4924 = $4929;
                break;
            case 'Fm.Term.typ':
                var $4932 = Maybe$none;
                var $4924 = $4932;
                break;
            case 'Fm.Term.all':
                var $4933 = self.eras;
                var $4934 = self.self;
                var $4935 = self.name;
                var $4936 = self.xtyp;
                var $4937 = self.body;
                var $4938 = Maybe$none;
                var $4924 = $4938;
                break;
            case 'Fm.Term.lam':
                var $4939 = self.name;
                var $4940 = self.body;
                var $4941 = Maybe$none;
                var $4924 = $4941;
                break;
            case 'Fm.Term.app':
                var $4942 = self.func;
                var $4943 = self.argm;
                var self = $4942;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $4945 = self.name;
                        var $4946 = self.indx;
                        var $4947 = Maybe$none;
                        var $4944 = $4947;
                        break;
                    case 'Fm.Term.ref':
                        var $4948 = self.name;
                        var self = ($4948 === "Nat.succ");
                        if (self) {
                            var $4950 = Monad$bind$(Maybe$monad)(Fm$Term$show$as_nat$go$($4943))((_pred$5 => {
                                var $4951 = Monad$pure$(Maybe$monad)(Nat$succ$(_pred$5));
                                return $4951;
                            }));
                            var $4949 = $4950;
                        } else {
                            var $4952 = Maybe$none;
                            var $4949 = $4952;
                        };
                        var $4944 = $4949;
                        break;
                    case 'Fm.Term.typ':
                        var $4953 = Maybe$none;
                        var $4944 = $4953;
                        break;
                    case 'Fm.Term.all':
                        var $4954 = self.eras;
                        var $4955 = self.self;
                        var $4956 = self.name;
                        var $4957 = self.xtyp;
                        var $4958 = self.body;
                        var $4959 = Maybe$none;
                        var $4944 = $4959;
                        break;
                    case 'Fm.Term.lam':
                        var $4960 = self.name;
                        var $4961 = self.body;
                        var $4962 = Maybe$none;
                        var $4944 = $4962;
                        break;
                    case 'Fm.Term.app':
                        var $4963 = self.func;
                        var $4964 = self.argm;
                        var $4965 = Maybe$none;
                        var $4944 = $4965;
                        break;
                    case 'Fm.Term.let':
                        var $4966 = self.name;
                        var $4967 = self.expr;
                        var $4968 = self.body;
                        var $4969 = Maybe$none;
                        var $4944 = $4969;
                        break;
                    case 'Fm.Term.def':
                        var $4970 = self.name;
                        var $4971 = self.expr;
                        var $4972 = self.body;
                        var $4973 = Maybe$none;
                        var $4944 = $4973;
                        break;
                    case 'Fm.Term.ann':
                        var $4974 = self.done;
                        var $4975 = self.term;
                        var $4976 = self.type;
                        var $4977 = Maybe$none;
                        var $4944 = $4977;
                        break;
                    case 'Fm.Term.gol':
                        var $4978 = self.name;
                        var $4979 = self.dref;
                        var $4980 = self.verb;
                        var $4981 = Maybe$none;
                        var $4944 = $4981;
                        break;
                    case 'Fm.Term.hol':
                        var $4982 = self.path;
                        var $4983 = Maybe$none;
                        var $4944 = $4983;
                        break;
                    case 'Fm.Term.nat':
                        var $4984 = self.natx;
                        var $4985 = Maybe$none;
                        var $4944 = $4985;
                        break;
                    case 'Fm.Term.chr':
                        var $4986 = self.chrx;
                        var $4987 = Maybe$none;
                        var $4944 = $4987;
                        break;
                    case 'Fm.Term.str':
                        var $4988 = self.strx;
                        var $4989 = Maybe$none;
                        var $4944 = $4989;
                        break;
                    case 'Fm.Term.cse':
                        var $4990 = self.path;
                        var $4991 = self.expr;
                        var $4992 = self.name;
                        var $4993 = self.with;
                        var $4994 = self.cses;
                        var $4995 = self.moti;
                        var $4996 = Maybe$none;
                        var $4944 = $4996;
                        break;
                    case 'Fm.Term.ori':
                        var $4997 = self.orig;
                        var $4998 = self.expr;
                        var $4999 = Maybe$none;
                        var $4944 = $4999;
                        break;
                };
                var $4924 = $4944;
                break;
            case 'Fm.Term.let':
                var $5000 = self.name;
                var $5001 = self.expr;
                var $5002 = self.body;
                var $5003 = Maybe$none;
                var $4924 = $5003;
                break;
            case 'Fm.Term.def':
                var $5004 = self.name;
                var $5005 = self.expr;
                var $5006 = self.body;
                var $5007 = Maybe$none;
                var $4924 = $5007;
                break;
            case 'Fm.Term.ann':
                var $5008 = self.done;
                var $5009 = self.term;
                var $5010 = self.type;
                var $5011 = Maybe$none;
                var $4924 = $5011;
                break;
            case 'Fm.Term.gol':
                var $5012 = self.name;
                var $5013 = self.dref;
                var $5014 = self.verb;
                var $5015 = Maybe$none;
                var $4924 = $5015;
                break;
            case 'Fm.Term.hol':
                var $5016 = self.path;
                var $5017 = Maybe$none;
                var $4924 = $5017;
                break;
            case 'Fm.Term.nat':
                var $5018 = self.natx;
                var $5019 = Maybe$none;
                var $4924 = $5019;
                break;
            case 'Fm.Term.chr':
                var $5020 = self.chrx;
                var $5021 = Maybe$none;
                var $4924 = $5021;
                break;
            case 'Fm.Term.str':
                var $5022 = self.strx;
                var $5023 = Maybe$none;
                var $4924 = $5023;
                break;
            case 'Fm.Term.cse':
                var $5024 = self.path;
                var $5025 = self.expr;
                var $5026 = self.name;
                var $5027 = self.with;
                var $5028 = self.cses;
                var $5029 = self.moti;
                var $5030 = Maybe$none;
                var $4924 = $5030;
                break;
            case 'Fm.Term.ori':
                var $5031 = self.orig;
                var $5032 = self.expr;
                var $5033 = Maybe$none;
                var $4924 = $5033;
                break;
        };
        return $4924;
    };
    const Fm$Term$show$as_nat$go = x0 => Fm$Term$show$as_nat$go$(x0);

    function Fm$Term$show$as_nat$(_term$1) {
        var $5034 = Maybe$mapped$(Fm$Term$show$as_nat$go$(_term$1), Nat$show);
        return $5034;
    };
    const Fm$Term$show$as_nat = x0 => Fm$Term$show$as_nat$(x0);

    function Fm$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5036 = self.name;
                var $5037 = self.indx;
                var $5038 = Bool$false;
                var $5035 = $5038;
                break;
            case 'Fm.Term.ref':
                var $5039 = self.name;
                var $5040 = (_name$2 === $5039);
                var $5035 = $5040;
                break;
            case 'Fm.Term.typ':
                var $5041 = Bool$false;
                var $5035 = $5041;
                break;
            case 'Fm.Term.all':
                var $5042 = self.eras;
                var $5043 = self.self;
                var $5044 = self.name;
                var $5045 = self.xtyp;
                var $5046 = self.body;
                var $5047 = Bool$false;
                var $5035 = $5047;
                break;
            case 'Fm.Term.lam':
                var $5048 = self.name;
                var $5049 = self.body;
                var $5050 = Bool$false;
                var $5035 = $5050;
                break;
            case 'Fm.Term.app':
                var $5051 = self.func;
                var $5052 = self.argm;
                var $5053 = Bool$false;
                var $5035 = $5053;
                break;
            case 'Fm.Term.let':
                var $5054 = self.name;
                var $5055 = self.expr;
                var $5056 = self.body;
                var $5057 = Bool$false;
                var $5035 = $5057;
                break;
            case 'Fm.Term.def':
                var $5058 = self.name;
                var $5059 = self.expr;
                var $5060 = self.body;
                var $5061 = Bool$false;
                var $5035 = $5061;
                break;
            case 'Fm.Term.ann':
                var $5062 = self.done;
                var $5063 = self.term;
                var $5064 = self.type;
                var $5065 = Bool$false;
                var $5035 = $5065;
                break;
            case 'Fm.Term.gol':
                var $5066 = self.name;
                var $5067 = self.dref;
                var $5068 = self.verb;
                var $5069 = Bool$false;
                var $5035 = $5069;
                break;
            case 'Fm.Term.hol':
                var $5070 = self.path;
                var $5071 = Bool$false;
                var $5035 = $5071;
                break;
            case 'Fm.Term.nat':
                var $5072 = self.natx;
                var $5073 = Bool$false;
                var $5035 = $5073;
                break;
            case 'Fm.Term.chr':
                var $5074 = self.chrx;
                var $5075 = Bool$false;
                var $5035 = $5075;
                break;
            case 'Fm.Term.str':
                var $5076 = self.strx;
                var $5077 = Bool$false;
                var $5035 = $5077;
                break;
            case 'Fm.Term.cse':
                var $5078 = self.path;
                var $5079 = self.expr;
                var $5080 = self.name;
                var $5081 = self.with;
                var $5082 = self.cses;
                var $5083 = self.moti;
                var $5084 = Bool$false;
                var $5035 = $5084;
                break;
            case 'Fm.Term.ori':
                var $5085 = self.orig;
                var $5086 = self.expr;
                var $5087 = Bool$false;
                var $5035 = $5087;
                break;
        };
        return $5035;
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
                        var $5088 = self.name;
                        var $5089 = self.indx;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5091 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5090 = $5091;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5093 = Bool$false;
                                var _wrap$8 = $5093;
                            } else {
                                var $5094 = self.charCodeAt(0);
                                var $5095 = self.slice(1);
                                var $5096 = ($5094 === 40);
                                var _wrap$8 = $5096;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5097 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5097;
                            } else {
                                var $5098 = _func$7;
                                var _func$10 = $5098;
                            };
                            var $5092 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5090 = $5092;
                        };
                        return $5090;
                    case 'Fm.Term.ref':
                        var $5099 = self.name;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5101 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5100 = $5101;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5103 = Bool$false;
                                var _wrap$7 = $5103;
                            } else {
                                var $5104 = self.charCodeAt(0);
                                var $5105 = self.slice(1);
                                var $5106 = ($5104 === 40);
                                var _wrap$7 = $5106;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5107 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5107;
                            } else {
                                var $5108 = _func$6;
                                var _func$9 = $5108;
                            };
                            var $5102 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5100 = $5102;
                        };
                        return $5100;
                    case 'Fm.Term.typ':
                        var _arity$4 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
                        if (self) {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5110 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
                            var $5109 = $5110;
                        } else {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$5;
                            if (self.length === 0) {
                                var $5112 = Bool$false;
                                var _wrap$6 = $5112;
                            } else {
                                var $5113 = self.charCodeAt(0);
                                var $5114 = self.slice(1);
                                var $5115 = ($5113 === 40);
                                var _wrap$6 = $5115;
                            };
                            var _args$7 = String$join$(",", _args$3);
                            var self = _wrap$6;
                            if (self) {
                                var $5116 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                                var _func$8 = $5116;
                            } else {
                                var $5117 = _func$5;
                                var _func$8 = $5117;
                            };
                            var $5111 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
                            var $5109 = $5111;
                        };
                        return $5109;
                    case 'Fm.Term.all':
                        var $5118 = self.eras;
                        var $5119 = self.self;
                        var $5120 = self.name;
                        var $5121 = self.xtyp;
                        var $5122 = self.body;
                        var _arity$9 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$9 === 3n));
                        if (self) {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$11 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$12 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5124 = String$flatten$(List$cons$(_eq_lft$11, List$cons$(" == ", List$cons$(_eq_rgt$12, List$nil))));
                            var $5123 = $5124;
                        } else {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$10;
                            if (self.length === 0) {
                                var $5126 = Bool$false;
                                var _wrap$11 = $5126;
                            } else {
                                var $5127 = self.charCodeAt(0);
                                var $5128 = self.slice(1);
                                var $5129 = ($5127 === 40);
                                var _wrap$11 = $5129;
                            };
                            var _args$12 = String$join$(",", _args$3);
                            var self = _wrap$11;
                            if (self) {
                                var $5130 = String$flatten$(List$cons$("(", List$cons$(_func$10, List$cons$(")", List$nil))));
                                var _func$13 = $5130;
                            } else {
                                var $5131 = _func$10;
                                var _func$13 = $5131;
                            };
                            var $5125 = String$flatten$(List$cons$(_func$13, List$cons$("(", List$cons$(_args$12, List$cons$(")", List$nil)))));
                            var $5123 = $5125;
                        };
                        return $5123;
                    case 'Fm.Term.lam':
                        var $5132 = self.name;
                        var $5133 = self.body;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5135 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5134 = $5135;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5137 = Bool$false;
                                var _wrap$8 = $5137;
                            } else {
                                var $5138 = self.charCodeAt(0);
                                var $5139 = self.slice(1);
                                var $5140 = ($5138 === 40);
                                var _wrap$8 = $5140;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5141 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5141;
                            } else {
                                var $5142 = _func$7;
                                var _func$10 = $5142;
                            };
                            var $5136 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5134 = $5136;
                        };
                        return $5134;
                    case 'Fm.Term.app':
                        var $5143 = self.func;
                        var $5144 = self.argm;
                        var _argm$6 = Fm$Term$show$go$($5144, Fm$MPath$i$(_path$2));
                        var $5145 = Fm$Term$show$app$($5143, Fm$MPath$o$(_path$2), List$cons$(_argm$6, _args$3));
                        return $5145;
                    case 'Fm.Term.let':
                        var $5146 = self.name;
                        var $5147 = self.expr;
                        var $5148 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5150 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5149 = $5150;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5152 = Bool$false;
                                var _wrap$9 = $5152;
                            } else {
                                var $5153 = self.charCodeAt(0);
                                var $5154 = self.slice(1);
                                var $5155 = ($5153 === 40);
                                var _wrap$9 = $5155;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5156 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5156;
                            } else {
                                var $5157 = _func$8;
                                var _func$11 = $5157;
                            };
                            var $5151 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5149 = $5151;
                        };
                        return $5149;
                    case 'Fm.Term.def':
                        var $5158 = self.name;
                        var $5159 = self.expr;
                        var $5160 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5162 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5161 = $5162;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5164 = Bool$false;
                                var _wrap$9 = $5164;
                            } else {
                                var $5165 = self.charCodeAt(0);
                                var $5166 = self.slice(1);
                                var $5167 = ($5165 === 40);
                                var _wrap$9 = $5167;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5168 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5168;
                            } else {
                                var $5169 = _func$8;
                                var _func$11 = $5169;
                            };
                            var $5163 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5161 = $5163;
                        };
                        return $5161;
                    case 'Fm.Term.ann':
                        var $5170 = self.done;
                        var $5171 = self.term;
                        var $5172 = self.type;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5174 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5173 = $5174;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5176 = Bool$false;
                                var _wrap$9 = $5176;
                            } else {
                                var $5177 = self.charCodeAt(0);
                                var $5178 = self.slice(1);
                                var $5179 = ($5177 === 40);
                                var _wrap$9 = $5179;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5180 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5180;
                            } else {
                                var $5181 = _func$8;
                                var _func$11 = $5181;
                            };
                            var $5175 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5173 = $5175;
                        };
                        return $5173;
                    case 'Fm.Term.gol':
                        var $5182 = self.name;
                        var $5183 = self.dref;
                        var $5184 = self.verb;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5186 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5185 = $5186;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5188 = Bool$false;
                                var _wrap$9 = $5188;
                            } else {
                                var $5189 = self.charCodeAt(0);
                                var $5190 = self.slice(1);
                                var $5191 = ($5189 === 40);
                                var _wrap$9 = $5191;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5192 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5192;
                            } else {
                                var $5193 = _func$8;
                                var _func$11 = $5193;
                            };
                            var $5187 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5185 = $5187;
                        };
                        return $5185;
                    case 'Fm.Term.hol':
                        var $5194 = self.path;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5196 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5195 = $5196;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5198 = Bool$false;
                                var _wrap$7 = $5198;
                            } else {
                                var $5199 = self.charCodeAt(0);
                                var $5200 = self.slice(1);
                                var $5201 = ($5199 === 40);
                                var _wrap$7 = $5201;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5202 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5202;
                            } else {
                                var $5203 = _func$6;
                                var _func$9 = $5203;
                            };
                            var $5197 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5195 = $5197;
                        };
                        return $5195;
                    case 'Fm.Term.nat':
                        var $5204 = self.natx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5206 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5205 = $5206;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5208 = Bool$false;
                                var _wrap$7 = $5208;
                            } else {
                                var $5209 = self.charCodeAt(0);
                                var $5210 = self.slice(1);
                                var $5211 = ($5209 === 40);
                                var _wrap$7 = $5211;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5212 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5212;
                            } else {
                                var $5213 = _func$6;
                                var _func$9 = $5213;
                            };
                            var $5207 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5205 = $5207;
                        };
                        return $5205;
                    case 'Fm.Term.chr':
                        var $5214 = self.chrx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5216 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5215 = $5216;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5218 = Bool$false;
                                var _wrap$7 = $5218;
                            } else {
                                var $5219 = self.charCodeAt(0);
                                var $5220 = self.slice(1);
                                var $5221 = ($5219 === 40);
                                var _wrap$7 = $5221;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5222 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5222;
                            } else {
                                var $5223 = _func$6;
                                var _func$9 = $5223;
                            };
                            var $5217 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5215 = $5217;
                        };
                        return $5215;
                    case 'Fm.Term.str':
                        var $5224 = self.strx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5226 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5225 = $5226;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5228 = Bool$false;
                                var _wrap$7 = $5228;
                            } else {
                                var $5229 = self.charCodeAt(0);
                                var $5230 = self.slice(1);
                                var $5231 = ($5229 === 40);
                                var _wrap$7 = $5231;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5232 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5232;
                            } else {
                                var $5233 = _func$6;
                                var _func$9 = $5233;
                            };
                            var $5227 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5225 = $5227;
                        };
                        return $5225;
                    case 'Fm.Term.cse':
                        var $5234 = self.path;
                        var $5235 = self.expr;
                        var $5236 = self.name;
                        var $5237 = self.with;
                        var $5238 = self.cses;
                        var $5239 = self.moti;
                        var _arity$10 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$10 === 3n));
                        if (self) {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$12 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$13 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5241 = String$flatten$(List$cons$(_eq_lft$12, List$cons$(" == ", List$cons$(_eq_rgt$13, List$nil))));
                            var $5240 = $5241;
                        } else {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$11;
                            if (self.length === 0) {
                                var $5243 = Bool$false;
                                var _wrap$12 = $5243;
                            } else {
                                var $5244 = self.charCodeAt(0);
                                var $5245 = self.slice(1);
                                var $5246 = ($5244 === 40);
                                var _wrap$12 = $5246;
                            };
                            var _args$13 = String$join$(",", _args$3);
                            var self = _wrap$12;
                            if (self) {
                                var $5247 = String$flatten$(List$cons$("(", List$cons$(_func$11, List$cons$(")", List$nil))));
                                var _func$14 = $5247;
                            } else {
                                var $5248 = _func$11;
                                var _func$14 = $5248;
                            };
                            var $5242 = String$flatten$(List$cons$(_func$14, List$cons$("(", List$cons$(_args$13, List$cons$(")", List$nil)))));
                            var $5240 = $5242;
                        };
                        return $5240;
                    case 'Fm.Term.ori':
                        var $5249 = self.orig;
                        var $5250 = self.expr;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5252 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5251 = $5252;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5254 = Bool$false;
                                var _wrap$8 = $5254;
                            } else {
                                var $5255 = self.charCodeAt(0);
                                var $5256 = self.slice(1);
                                var $5257 = ($5255 === 40);
                                var _wrap$8 = $5257;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5258 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5258;
                            } else {
                                var $5259 = _func$7;
                                var _func$10 = $5259;
                            };
                            var $5253 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5251 = $5253;
                        };
                        return $5251;
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
                var $5261 = _list$4;
                var $5260 = $5261;
                break;
            case 'Map.tie':
                var $5262 = self.val;
                var $5263 = self.lft;
                var $5264 = self.rgt;
                var self = $5262;
                switch (self._) {
                    case 'Maybe.none':
                        var $5266 = _list$4;
                        var _list0$8 = $5266;
                        break;
                    case 'Maybe.some':
                        var $5267 = self.value;
                        var $5268 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5267), _list$4);
                        var _list0$8 = $5268;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5263, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5264, (_key$3 + '1'), _list1$9);
                var $5265 = _list2$10;
                var $5260 = $5265;
                break;
        };
        return $5260;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5269 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5269;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $5271 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5270 = $5271;
                break;
            case 'o':
                var $5272 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5274 = List$cons$(_head$6, _tail$7);
                    var $5273 = $5274;
                } else {
                    var $5275 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5276 = Bits$chunks_of$go$(_len$1, $5272, $5275, _chunk$7);
                    var $5273 = $5276;
                };
                var $5270 = $5273;
                break;
            case 'i':
                var $5277 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5279 = List$cons$(_head$6, _tail$7);
                    var $5278 = $5279;
                } else {
                    var $5280 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5281 = Bits$chunks_of$go$(_len$1, $5277, $5280, _chunk$7);
                    var $5278 = $5281;
                };
                var $5270 = $5278;
                break;
        };
        return $5270;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5282 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5282;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5284 = Word$e;
            var $5283 = $5284;
        } else {
            var $5285 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'e':
                    var $5287 = Word$o$(Word$from_bits$($5285, Bits$e));
                    var $5286 = $5287;
                    break;
                case 'o':
                    var $5288 = self.slice(0, -1);
                    var $5289 = Word$o$(Word$from_bits$($5285, $5288));
                    var $5286 = $5289;
                    break;
                case 'i':
                    var $5290 = self.slice(0, -1);
                    var $5291 = Word$i$(Word$from_bits$($5285, $5290));
                    var $5286 = $5291;
                    break;
            };
            var $5283 = $5286;
        };
        return $5283;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Fm$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5294 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5294;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5296 = ((_u16$5 + 71) & 0xFFFF);
                    var $5295 = $5296;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5298 = (Math.max(_u16$5 - 4, 0));
                        var $5297 = $5298;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5300 = 46;
                            var $5299 = $5300;
                        } else {
                            var $5301 = 95;
                            var $5299 = $5301;
                        };
                        var $5297 = $5299;
                    };
                    var $5295 = $5297;
                };
                var _chr$6 = $5295;
            };
            var $5293 = String$cons$(_chr$6, _name$4);
            return $5293;
        }));
        var $5292 = _name$3;
        return $5292;
    };
    const Fm$Name$from_bits = x0 => Fm$Name$from_bits$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $5303 = self.fst;
                var $5304 = self.snd;
                var $5305 = $5303;
                var $5302 = $5305;
                break;
        };
        return $5302;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Fm$Term$show$go$(_term$1, _path$2) {
        var self = Fm$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $5308 = self.name;
                        var $5309 = self.indx;
                        var $5310 = Fm$Name$show$($5308);
                        var $5307 = $5310;
                        break;
                    case 'Fm.Term.ref':
                        var $5311 = self.name;
                        var _name$4 = Fm$Name$show$($5311);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5313 = _name$4;
                                var $5312 = $5313;
                                break;
                            case 'Maybe.some':
                                var $5314 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Fm$Path$to_bits$($5314));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5315 = String$flatten$(List$cons$(_name$4, List$cons$(Fm$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5312 = $5315;
                                break;
                        };
                        var $5307 = $5312;
                        break;
                    case 'Fm.Term.typ':
                        var $5316 = "Type";
                        var $5307 = $5316;
                        break;
                    case 'Fm.Term.all':
                        var $5317 = self.eras;
                        var $5318 = self.self;
                        var $5319 = self.name;
                        var $5320 = self.xtyp;
                        var $5321 = self.body;
                        var _eras$8 = $5317;
                        var _self$9 = Fm$Name$show$($5318);
                        var _name$10 = Fm$Name$show$($5319);
                        var _type$11 = Fm$Term$show$go$($5320, Fm$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5323 = "<";
                            var _open$12 = $5323;
                        } else {
                            var $5324 = "(";
                            var _open$12 = $5324;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5325 = ">";
                            var _clos$13 = $5325;
                        } else {
                            var $5326 = ")";
                            var _clos$13 = $5326;
                        };
                        var _body$14 = Fm$Term$show$go$($5321(Fm$Term$var$($5318, 0n))(Fm$Term$var$($5319, 0n)), Fm$MPath$i$(_path$2));
                        var $5322 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5307 = $5322;
                        break;
                    case 'Fm.Term.lam':
                        var $5327 = self.name;
                        var $5328 = self.body;
                        var _name$5 = Fm$Name$show$($5327);
                        var _body$6 = Fm$Term$show$go$($5328(Fm$Term$var$($5327, 0n)), Fm$MPath$o$(_path$2));
                        var $5329 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5307 = $5329;
                        break;
                    case 'Fm.Term.app':
                        var $5330 = self.func;
                        var $5331 = self.argm;
                        var $5332 = Fm$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5307 = $5332;
                        break;
                    case 'Fm.Term.let':
                        var $5333 = self.name;
                        var $5334 = self.expr;
                        var $5335 = self.body;
                        var _name$6 = Fm$Name$show$($5333);
                        var _expr$7 = Fm$Term$show$go$($5334, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5335(Fm$Term$var$($5333, 0n)), Fm$MPath$i$(_path$2));
                        var $5336 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5307 = $5336;
                        break;
                    case 'Fm.Term.def':
                        var $5337 = self.name;
                        var $5338 = self.expr;
                        var $5339 = self.body;
                        var _name$6 = Fm$Name$show$($5337);
                        var _expr$7 = Fm$Term$show$go$($5338, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5339(Fm$Term$var$($5337, 0n)), Fm$MPath$i$(_path$2));
                        var $5340 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5307 = $5340;
                        break;
                    case 'Fm.Term.ann':
                        var $5341 = self.done;
                        var $5342 = self.term;
                        var $5343 = self.type;
                        var _term$6 = Fm$Term$show$go$($5342, Fm$MPath$o$(_path$2));
                        var _type$7 = Fm$Term$show$go$($5343, Fm$MPath$i$(_path$2));
                        var $5344 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5307 = $5344;
                        break;
                    case 'Fm.Term.gol':
                        var $5345 = self.name;
                        var $5346 = self.dref;
                        var $5347 = self.verb;
                        var _name$6 = Fm$Name$show$($5345);
                        var $5348 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5307 = $5348;
                        break;
                    case 'Fm.Term.hol':
                        var $5349 = self.path;
                        var $5350 = "_";
                        var $5307 = $5350;
                        break;
                    case 'Fm.Term.nat':
                        var $5351 = self.natx;
                        var $5352 = String$flatten$(List$cons$(Nat$show$($5351), List$nil));
                        var $5307 = $5352;
                        break;
                    case 'Fm.Term.chr':
                        var $5353 = self.chrx;
                        var $5354 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($5353), List$cons$("\'", List$nil))));
                        var $5307 = $5354;
                        break;
                    case 'Fm.Term.str':
                        var $5355 = self.strx;
                        var $5356 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($5355), List$cons$("\"", List$nil))));
                        var $5307 = $5356;
                        break;
                    case 'Fm.Term.cse':
                        var $5357 = self.path;
                        var $5358 = self.expr;
                        var $5359 = self.name;
                        var $5360 = self.with;
                        var $5361 = self.cses;
                        var $5362 = self.moti;
                        var _expr$9 = Fm$Term$show$go$($5358, Fm$MPath$o$(_path$2));
                        var _name$10 = Fm$Name$show$($5359);
                        var _wyth$11 = String$join$("", List$mapped$($5360, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5365 = self.file;
                                    var $5366 = self.code;
                                    var $5367 = self.name;
                                    var $5368 = self.term;
                                    var $5369 = self.type;
                                    var $5370 = self.stat;
                                    var _name$18 = Fm$Name$show$($5367);
                                    var _type$19 = Fm$Term$show$go$($5369, Maybe$none);
                                    var _term$20 = Fm$Term$show$go$($5368, Maybe$none);
                                    var $5371 = String$flatten$(List$cons$(_name$18, List$cons$(": ", List$cons$(_type$19, List$cons$(" = ", List$cons$(_term$20, List$cons$(";", List$nil)))))));
                                    var $5364 = $5371;
                                    break;
                            };
                            return $5364;
                        })));
                        var _cses$12 = Map$to_list$($5361);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Fm$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Fm$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5372 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5372;
                        })));
                        var self = $5362;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5373 = "";
                                var _moti$14 = $5373;
                                break;
                            case 'Maybe.some':
                                var $5374 = self.value;
                                var $5375 = String$flatten$(List$cons$(": ", List$cons$(Fm$Term$show$go$($5374, Maybe$none), List$nil)));
                                var _moti$14 = $5375;
                                break;
                        };
                        var $5363 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5307 = $5363;
                        break;
                    case 'Fm.Term.ori':
                        var $5376 = self.orig;
                        var $5377 = self.expr;
                        var $5378 = Fm$Term$show$go$($5377, _path$2);
                        var $5307 = $5378;
                        break;
                };
                var $5306 = $5307;
                break;
            case 'Maybe.some':
                var $5379 = self.value;
                var $5380 = $5379;
                var $5306 = $5380;
                break;
        };
        return $5306;
    };
    const Fm$Term$show$go = x0 => x1 => Fm$Term$show$go$(x0, x1);

    function Fm$Term$show$(_term$1) {
        var $5381 = Fm$Term$show$go$(_term$1, Maybe$none);
        return $5381;
    };
    const Fm$Term$show = x0 => Fm$Term$show$(x0);

    function Fm$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.nil':
                var $5383 = List$nil;
                var $5382 = $5383;
                break;
            case 'List.cons':
                var $5384 = self.head;
                var $5385 = self.tail;
                var self = $5384;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5387 = self.origin;
                        var $5388 = self.expected;
                        var $5389 = self.detected;
                        var $5390 = self.context;
                        var $5391 = (!_got$2);
                        var _keep$5 = $5391;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5392 = self.name;
                        var $5393 = self.dref;
                        var $5394 = self.verb;
                        var $5395 = self.goal;
                        var $5396 = self.context;
                        var $5397 = Bool$true;
                        var _keep$5 = $5397;
                        break;
                    case 'Fm.Error.waiting':
                        var $5398 = self.name;
                        var $5399 = Bool$false;
                        var _keep$5 = $5399;
                        break;
                    case 'Fm.Error.indirect':
                        var $5400 = self.name;
                        var $5401 = Bool$false;
                        var _keep$5 = $5401;
                        break;
                    case 'Fm.Error.patch':
                        var $5402 = self.path;
                        var $5403 = self.term;
                        var $5404 = Bool$false;
                        var _keep$5 = $5404;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5405 = self.origin;
                        var $5406 = self.name;
                        var $5407 = (!_got$2);
                        var _keep$5 = $5407;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5408 = self.origin;
                        var $5409 = self.term;
                        var $5410 = self.context;
                        var $5411 = (!_got$2);
                        var _keep$5 = $5411;
                        break;
                };
                var self = $5384;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5412 = self.origin;
                        var $5413 = self.expected;
                        var $5414 = self.detected;
                        var $5415 = self.context;
                        var $5416 = Bool$true;
                        var _got$6 = $5416;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5417 = self.name;
                        var $5418 = self.dref;
                        var $5419 = self.verb;
                        var $5420 = self.goal;
                        var $5421 = self.context;
                        var $5422 = _got$2;
                        var _got$6 = $5422;
                        break;
                    case 'Fm.Error.waiting':
                        var $5423 = self.name;
                        var $5424 = _got$2;
                        var _got$6 = $5424;
                        break;
                    case 'Fm.Error.indirect':
                        var $5425 = self.name;
                        var $5426 = _got$2;
                        var _got$6 = $5426;
                        break;
                    case 'Fm.Error.patch':
                        var $5427 = self.path;
                        var $5428 = self.term;
                        var $5429 = _got$2;
                        var _got$6 = $5429;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5430 = self.origin;
                        var $5431 = self.name;
                        var $5432 = Bool$true;
                        var _got$6 = $5432;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5433 = self.origin;
                        var $5434 = self.term;
                        var $5435 = self.context;
                        var $5436 = _got$2;
                        var _got$6 = $5436;
                        break;
                };
                var _tail$7 = Fm$Error$relevant$($5385, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5437 = List$cons$($5384, _tail$7);
                    var $5386 = $5437;
                } else {
                    var $5438 = _tail$7;
                    var $5386 = $5438;
                };
                var $5382 = $5386;
                break;
        };
        return $5382;
    };
    const Fm$Error$relevant = x0 => x1 => Fm$Error$relevant$(x0, x1);

    function Fm$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.nil':
                var $5440 = "";
                var $5439 = $5440;
                break;
            case 'List.cons':
                var $5441 = self.head;
                var $5442 = self.tail;
                var self = $5441;
                switch (self._) {
                    case 'Pair.new':
                        var $5444 = self.fst;
                        var $5445 = self.snd;
                        var _name$6 = Fm$Name$show$($5444);
                        var _type$7 = Fm$Term$show$(Fm$Term$normalize$($5445, Map$new));
                        var _rest$8 = Fm$Context$show$($5442);
                        var $5446 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5443 = $5446;
                        break;
                };
                var $5439 = $5443;
                break;
        };
        return $5439;
    };
    const Fm$Context$show = x0 => Fm$Context$show$(x0);

    function Fm$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5447 = Fm$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Fm.Term.var':
                    var $5449 = self.name;
                    var $5450 = self.indx;
                    var $5451 = _term$4;
                    var $5448 = $5451;
                    break;
                case 'Fm.Term.ref':
                    var $5452 = self.name;
                    var self = Fm$get$($5452, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5454 = Fm$Term$ref$($5452);
                            var $5453 = $5454;
                            break;
                        case 'Maybe.some':
                            var $5455 = self.value;
                            var self = $5455;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5457 = self.file;
                                    var $5458 = self.code;
                                    var $5459 = self.name;
                                    var $5460 = self.term;
                                    var $5461 = self.type;
                                    var $5462 = self.stat;
                                    var $5463 = $5460;
                                    var $5456 = $5463;
                                    break;
                            };
                            var $5453 = $5456;
                            break;
                    };
                    var $5448 = $5453;
                    break;
                case 'Fm.Term.typ':
                    var $5464 = _term$4;
                    var $5448 = $5464;
                    break;
                case 'Fm.Term.all':
                    var $5465 = self.eras;
                    var $5466 = self.self;
                    var $5467 = self.name;
                    var $5468 = self.xtyp;
                    var $5469 = self.body;
                    var $5470 = _term$4;
                    var $5448 = $5470;
                    break;
                case 'Fm.Term.lam':
                    var $5471 = self.name;
                    var $5472 = self.body;
                    var $5473 = _term$4;
                    var $5448 = $5473;
                    break;
                case 'Fm.Term.app':
                    var $5474 = self.func;
                    var $5475 = self.argm;
                    var $5476 = _term$4;
                    var $5448 = $5476;
                    break;
                case 'Fm.Term.let':
                    var $5477 = self.name;
                    var $5478 = self.expr;
                    var $5479 = self.body;
                    var $5480 = _term$4;
                    var $5448 = $5480;
                    break;
                case 'Fm.Term.def':
                    var $5481 = self.name;
                    var $5482 = self.expr;
                    var $5483 = self.body;
                    var $5484 = _term$4;
                    var $5448 = $5484;
                    break;
                case 'Fm.Term.ann':
                    var $5485 = self.done;
                    var $5486 = self.term;
                    var $5487 = self.type;
                    var $5488 = _term$4;
                    var $5448 = $5488;
                    break;
                case 'Fm.Term.gol':
                    var $5489 = self.name;
                    var $5490 = self.dref;
                    var $5491 = self.verb;
                    var $5492 = _term$4;
                    var $5448 = $5492;
                    break;
                case 'Fm.Term.hol':
                    var $5493 = self.path;
                    var $5494 = _term$4;
                    var $5448 = $5494;
                    break;
                case 'Fm.Term.nat':
                    var $5495 = self.natx;
                    var $5496 = _term$4;
                    var $5448 = $5496;
                    break;
                case 'Fm.Term.chr':
                    var $5497 = self.chrx;
                    var $5498 = _term$4;
                    var $5448 = $5498;
                    break;
                case 'Fm.Term.str':
                    var $5499 = self.strx;
                    var $5500 = _term$4;
                    var $5448 = $5500;
                    break;
                case 'Fm.Term.cse':
                    var $5501 = self.path;
                    var $5502 = self.expr;
                    var $5503 = self.name;
                    var $5504 = self.with;
                    var $5505 = self.cses;
                    var $5506 = self.moti;
                    var $5507 = _term$4;
                    var $5448 = $5507;
                    break;
                case 'Fm.Term.ori':
                    var $5508 = self.orig;
                    var $5509 = self.expr;
                    var $5510 = _term$4;
                    var $5448 = $5510;
                    break;
            };
            return $5448;
        }));
        return $5447;
    };
    const Fm$Term$expand_at = x0 => x1 => x2 => Fm$Term$expand_at$(x0, x1, x2);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Fm$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5512 = self.name;
                var $5513 = self.indx;
                var $5514 = Fm$Term$var$($5512, $5513);
                var $5511 = $5514;
                break;
            case 'Fm.Term.ref':
                var $5515 = self.name;
                var _expand$5 = Bool$false;
                var _expand$6 = ((($5515 === "Nat.succ") && (_arity$3 > 1n)) || _expand$5);
                var _expand$7 = ((($5515 === "Nat.zero") && (_arity$3 > 0n)) || _expand$6);
                var _expand$8 = ((($5515 === "Bool.true") && (_arity$3 > 0n)) || _expand$7);
                var _expand$9 = ((($5515 === "Bool.false") && (_arity$3 > 0n)) || _expand$8);
                var self = _expand$9;
                if (self) {
                    var self = Fm$get$($5515, _defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5518 = Fm$Term$ref$($5515);
                            var $5517 = $5518;
                            break;
                        case 'Maybe.some':
                            var $5519 = self.value;
                            var self = $5519;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5521 = self.file;
                                    var $5522 = self.code;
                                    var $5523 = self.name;
                                    var $5524 = self.term;
                                    var $5525 = self.type;
                                    var $5526 = self.stat;
                                    var $5527 = $5524;
                                    var $5520 = $5527;
                                    break;
                            };
                            var $5517 = $5520;
                            break;
                    };
                    var $5516 = $5517;
                } else {
                    var $5528 = Fm$Term$ref$($5515);
                    var $5516 = $5528;
                };
                var $5511 = $5516;
                break;
            case 'Fm.Term.typ':
                var $5529 = Fm$Term$typ;
                var $5511 = $5529;
                break;
            case 'Fm.Term.all':
                var $5530 = self.eras;
                var $5531 = self.self;
                var $5532 = self.name;
                var $5533 = self.xtyp;
                var $5534 = self.body;
                var $5535 = Fm$Term$all$($5530, $5531, $5532, Fm$Term$expand_ct$($5533, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5536 = Fm$Term$expand_ct$($5534(_s$9)(_x$10), _defs$2, 0n);
                    return $5536;
                }));
                var $5511 = $5535;
                break;
            case 'Fm.Term.lam':
                var $5537 = self.name;
                var $5538 = self.body;
                var $5539 = Fm$Term$lam$($5537, (_x$6 => {
                    var $5540 = Fm$Term$expand_ct$($5538(_x$6), _defs$2, 0n);
                    return $5540;
                }));
                var $5511 = $5539;
                break;
            case 'Fm.Term.app':
                var $5541 = self.func;
                var $5542 = self.argm;
                var $5543 = Fm$Term$app$(Fm$Term$expand_ct$($5541, _defs$2, Nat$succ$(_arity$3)), Fm$Term$expand_ct$($5542, _defs$2, 0n));
                var $5511 = $5543;
                break;
            case 'Fm.Term.let':
                var $5544 = self.name;
                var $5545 = self.expr;
                var $5546 = self.body;
                var $5547 = Fm$Term$let$($5544, Fm$Term$expand_ct$($5545, _defs$2, 0n), (_x$7 => {
                    var $5548 = Fm$Term$expand_ct$($5546(_x$7), _defs$2, 0n);
                    return $5548;
                }));
                var $5511 = $5547;
                break;
            case 'Fm.Term.def':
                var $5549 = self.name;
                var $5550 = self.expr;
                var $5551 = self.body;
                var $5552 = Fm$Term$def$($5549, Fm$Term$expand_ct$($5550, _defs$2, 0n), (_x$7 => {
                    var $5553 = Fm$Term$expand_ct$($5551(_x$7), _defs$2, 0n);
                    return $5553;
                }));
                var $5511 = $5552;
                break;
            case 'Fm.Term.ann':
                var $5554 = self.done;
                var $5555 = self.term;
                var $5556 = self.type;
                var $5557 = Fm$Term$ann$($5554, Fm$Term$expand_ct$($5555, _defs$2, 0n), Fm$Term$expand_ct$($5556, _defs$2, 0n));
                var $5511 = $5557;
                break;
            case 'Fm.Term.gol':
                var $5558 = self.name;
                var $5559 = self.dref;
                var $5560 = self.verb;
                var $5561 = Fm$Term$gol$($5558, $5559, $5560);
                var $5511 = $5561;
                break;
            case 'Fm.Term.hol':
                var $5562 = self.path;
                var $5563 = Fm$Term$hol$($5562);
                var $5511 = $5563;
                break;
            case 'Fm.Term.nat':
                var $5564 = self.natx;
                var $5565 = Fm$Term$nat$($5564);
                var $5511 = $5565;
                break;
            case 'Fm.Term.chr':
                var $5566 = self.chrx;
                var $5567 = Fm$Term$chr$($5566);
                var $5511 = $5567;
                break;
            case 'Fm.Term.str':
                var $5568 = self.strx;
                var $5569 = Fm$Term$str$($5568);
                var $5511 = $5569;
                break;
            case 'Fm.Term.cse':
                var $5570 = self.path;
                var $5571 = self.expr;
                var $5572 = self.name;
                var $5573 = self.with;
                var $5574 = self.cses;
                var $5575 = self.moti;
                var $5576 = _term$1;
                var $5511 = $5576;
                break;
            case 'Fm.Term.ori':
                var $5577 = self.orig;
                var $5578 = self.expr;
                var $5579 = Fm$Term$ori$($5577, $5578);
                var $5511 = $5579;
                break;
        };
        return $5511;
    };
    const Fm$Term$expand_ct = x0 => x1 => x2 => Fm$Term$expand_ct$(x0, x1, x2);

    function Fm$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Fm$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5582 = _term$4;
            var $5583 = _dref$1;
            let _term$6 = $5582;
            let _path$5;
            while ($5583._ === 'List.cons') {
                _path$5 = $5583.head;
                var _term$7 = Fm$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Fm$Term$normalize$(_term$7, Map$new);
                var _term$9 = Fm$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Fm$Term$normalize$(_term$9, Map$new);
                var $5582 = _term$10;
                _term$6 = $5582;
                $5583 = $5583.tail;
            }
            return _term$6;
        })();
        var $5580 = _term$5;
        return $5580;
    };
    const Fm$Term$expand = x0 => x1 => x2 => Fm$Term$expand$(x0, x1, x2);

    function Fm$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5585 = self.origin;
                var $5586 = self.expected;
                var $5587 = self.detected;
                var $5588 = self.context;
                var self = $5586;
                switch (self._) {
                    case 'Either.left':
                        var $5590 = self.value;
                        var $5591 = $5590;
                        var _expected$7 = $5591;
                        break;
                    case 'Either.right':
                        var $5592 = self.value;
                        var $5593 = Fm$Term$show$(Fm$Term$normalize$($5592, Map$new));
                        var _expected$7 = $5593;
                        break;
                };
                var self = $5587;
                switch (self._) {
                    case 'Either.left':
                        var $5594 = self.value;
                        var $5595 = $5594;
                        var _detected$8 = $5595;
                        break;
                    case 'Either.right':
                        var $5596 = self.value;
                        var $5597 = Fm$Term$show$(Fm$Term$normalize$($5596, Map$new));
                        var _detected$8 = $5597;
                        break;
                };
                var $5589 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5588;
                    switch (self._) {
                        case 'List.nil':
                            var $5598 = "";
                            return $5598;
                        case 'List.cons':
                            var $5599 = self.head;
                            var $5600 = self.tail;
                            var $5601 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Fm$Context$show$($5588), List$nil)));
                            return $5601;
                    };
                })(), List$nil)))))))));
                var $5584 = $5589;
                break;
            case 'Fm.Error.show_goal':
                var $5602 = self.name;
                var $5603 = self.dref;
                var $5604 = self.verb;
                var $5605 = self.goal;
                var $5606 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Fm$Name$show$($5602), List$cons$(":\u{a}", List$nil))));
                var self = $5605;
                switch (self._) {
                    case 'Maybe.none':
                        var $5608 = "";
                        var _with_type$9 = $5608;
                        break;
                    case 'Maybe.some':
                        var $5609 = self.value;
                        var _goal$10 = Fm$Term$expand$($5603, $5609, _defs$2);
                        var $5610 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5604;
                            if (self) {
                                var $5611 = Fm$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5612 = _x$11;
                                    return $5612;
                                })));
                                return $5611;
                            } else {
                                var $5613 = Fm$Term$show$(_goal$10);
                                return $5613;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5610;
                        break;
                };
                var self = $5606;
                switch (self._) {
                    case 'List.nil':
                        var $5614 = "";
                        var _with_ctxt$10 = $5614;
                        break;
                    case 'List.cons':
                        var $5615 = self.head;
                        var $5616 = self.tail;
                        var $5617 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Fm$Context$show$($5606), List$nil)));
                        var _with_ctxt$10 = $5617;
                        break;
                };
                var $5607 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5584 = $5607;
                break;
            case 'Fm.Error.waiting':
                var $5618 = self.name;
                var $5619 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5618, List$cons$("\'.", List$nil))));
                var $5584 = $5619;
                break;
            case 'Fm.Error.indirect':
                var $5620 = self.name;
                var $5621 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5620, List$cons$("\'.", List$nil))));
                var $5584 = $5621;
                break;
            case 'Fm.Error.patch':
                var $5622 = self.path;
                var $5623 = self.term;
                var $5624 = String$flatten$(List$cons$("Patching: ", List$cons$(Fm$Term$show$($5623), List$nil)));
                var $5584 = $5624;
                break;
            case 'Fm.Error.undefined_reference':
                var $5625 = self.origin;
                var $5626 = self.name;
                var $5627 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Fm$Name$show$($5626), List$cons$("\u{a}", List$nil))));
                var $5584 = $5627;
                break;
            case 'Fm.Error.cant_infer':
                var $5628 = self.origin;
                var $5629 = self.term;
                var $5630 = self.context;
                var _term$6 = Fm$Term$show$($5629);
                var _context$7 = Fm$Context$show$($5630);
                var $5631 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5584 = $5631;
                break;
        };
        return $5584;
    };
    const Fm$Error$show = x0 => x1 => Fm$Error$show$(x0, x1);

    function Fm$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5633 = self.origin;
                var $5634 = self.expected;
                var $5635 = self.detected;
                var $5636 = self.context;
                var $5637 = $5633;
                var $5632 = $5637;
                break;
            case 'Fm.Error.show_goal':
                var $5638 = self.name;
                var $5639 = self.dref;
                var $5640 = self.verb;
                var $5641 = self.goal;
                var $5642 = self.context;
                var $5643 = Maybe$none;
                var $5632 = $5643;
                break;
            case 'Fm.Error.waiting':
                var $5644 = self.name;
                var $5645 = Maybe$none;
                var $5632 = $5645;
                break;
            case 'Fm.Error.indirect':
                var $5646 = self.name;
                var $5647 = Maybe$none;
                var $5632 = $5647;
                break;
            case 'Fm.Error.patch':
                var $5648 = self.path;
                var $5649 = self.term;
                var $5650 = Maybe$none;
                var $5632 = $5650;
                break;
            case 'Fm.Error.undefined_reference':
                var $5651 = self.origin;
                var $5652 = self.name;
                var $5653 = $5651;
                var $5632 = $5653;
                break;
            case 'Fm.Error.cant_infer':
                var $5654 = self.origin;
                var $5655 = self.term;
                var $5656 = self.context;
                var $5657 = $5654;
                var $5632 = $5657;
                break;
        };
        return $5632;
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
                        var $5658 = String$flatten$(List$cons$(_typs$4, List$cons$("\u{a}", List$cons$((() => {
                            var self = _errs$3;
                            if (self.length === 0) {
                                var $5659 = "All terms check.";
                                return $5659;
                            } else {
                                var $5660 = self.charCodeAt(0);
                                var $5661 = self.slice(1);
                                var $5662 = _errs$3;
                                return $5662;
                            };
                        })(), List$nil))));
                        return $5658;
                    case 'List.cons':
                        var $5663 = self.head;
                        var $5664 = self.tail;
                        var _name$7 = $5663;
                        var self = Fm$get$(_name$7, _defs$1);
                        switch (self._) {
                            case 'Maybe.none':
                                var $5666 = Fm$Defs$report$go$(_defs$1, $5664, _errs$3, _typs$4);
                                var $5665 = $5666;
                                break;
                            case 'Maybe.some':
                                var $5667 = self.value;
                                var self = $5667;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $5669 = self.file;
                                        var $5670 = self.code;
                                        var $5671 = self.name;
                                        var $5672 = self.term;
                                        var $5673 = self.type;
                                        var $5674 = self.stat;
                                        var _typs$15 = String$flatten$(List$cons$(_typs$4, List$cons$(_name$7, List$cons$(": ", List$cons$(Fm$Term$show$($5673), List$cons$("\u{a}", List$nil))))));
                                        var self = $5674;
                                        switch (self._) {
                                            case 'Fm.Status.init':
                                                var $5676 = Fm$Defs$report$go$(_defs$1, $5664, _errs$3, _typs$15);
                                                var $5675 = $5676;
                                                break;
                                            case 'Fm.Status.wait':
                                                var $5677 = Fm$Defs$report$go$(_defs$1, $5664, _errs$3, _typs$15);
                                                var $5675 = $5677;
                                                break;
                                            case 'Fm.Status.done':
                                                var $5678 = Fm$Defs$report$go$(_defs$1, $5664, _errs$3, _typs$15);
                                                var $5675 = $5678;
                                                break;
                                            case 'Fm.Status.fail':
                                                var $5679 = self.errors;
                                                var self = $5679;
                                                switch (self._) {
                                                    case 'List.nil':
                                                        var $5681 = Fm$Defs$report$go$(_defs$1, $5664, _errs$3, _typs$15);
                                                        var $5680 = $5681;
                                                        break;
                                                    case 'List.cons':
                                                        var $5682 = self.head;
                                                        var $5683 = self.tail;
                                                        var _name_str$19 = Fm$Name$show$($5671);
                                                        var _rel_errs$20 = Fm$Error$relevant$($5679, Bool$false);
                                                        var _rel_msgs$21 = List$mapped$(_rel_errs$20, (_err$21 => {
                                                            var $5685 = String$flatten$(List$cons$(Fm$Error$show$(_err$21, _defs$1), List$cons$((() => {
                                                                var self = Fm$Error$origin$(_err$21);
                                                                switch (self._) {
                                                                    case 'Maybe.none':
                                                                        var $5686 = "";
                                                                        return $5686;
                                                                    case 'Maybe.some':
                                                                        var $5687 = self.value;
                                                                        var self = $5687;
                                                                        switch (self._) {
                                                                            case 'Fm.Origin.new':
                                                                                var $5689 = self.file;
                                                                                var $5690 = self.from;
                                                                                var $5691 = self.upto;
                                                                                var $5692 = String$flatten$(List$cons$("Inside \'", List$cons$($5669, List$cons$("\':\u{a}", List$cons$(Fm$highlight$($5670, $5690, $5691), List$cons$("\u{a}", List$nil))))));
                                                                                var $5688 = $5692;
                                                                                break;
                                                                        };
                                                                        return $5688;
                                                                };
                                                            })(), List$nil)));
                                                            return $5685;
                                                        }));
                                                        var _errs$22 = String$flatten$(List$cons$(_errs$3, List$cons$(String$join$("\u{a}", _rel_msgs$21), List$cons$("\u{a}", List$nil))));
                                                        var $5684 = Fm$Defs$report$go$(_defs$1, $5664, _errs$22, _typs$15);
                                                        var $5680 = $5684;
                                                        break;
                                                };
                                                var $5675 = $5680;
                                                break;
                                        };
                                        var $5668 = $5675;
                                        break;
                                };
                                var $5665 = $5668;
                                break;
                        };
                        return $5665;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Defs$report$go = x0 => x1 => x2 => x3 => Fm$Defs$report$go$(x0, x1, x2, x3);

    function Fm$Defs$report$(_defs$1, _list$2) {
        var $5693 = Fm$Defs$report$go$(_defs$1, _list$2, "", "");
        return $5693;
    };
    const Fm$Defs$report = x0 => x1 => Fm$Defs$report$(x0, x1);

    function Fm$checker$io$one$(_name$1) {
        var $5694 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $5695 = IO$print$(Fm$Defs$report$(_defs$2, List$cons$(_name$1, List$nil)));
            return $5695;
        }));
        return $5694;
    };
    const Fm$checker$io$one = x0 => Fm$checker$io$one$(x0);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $5697 = _list$4;
                var $5696 = $5697;
                break;
            case 'Map.tie':
                var $5698 = self.val;
                var $5699 = self.lft;
                var $5700 = self.rgt;
                var self = $5698;
                switch (self._) {
                    case 'Maybe.none':
                        var $5702 = _list$4;
                        var _list0$8 = $5702;
                        break;
                    case 'Maybe.some':
                        var $5703 = self.value;
                        var $5704 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5704;
                        break;
                };
                var _list1$9 = Map$keys$go$($5699, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5700, (_key$3 + '1'), _list1$9);
                var $5701 = _list2$10;
                var $5696 = $5701;
                break;
        };
        return $5696;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5705 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5705;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Fm$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.nil':
                var $5707 = Monad$pure$(IO$monad)(_defs$2);
                var $5706 = $5707;
                break;
            case 'List.cons':
                var $5708 = self.head;
                var $5709 = self.tail;
                var $5710 = Monad$bind$(IO$monad)(Fm$Synth$one$($5708, _defs$2))((_defs$5 => {
                    var $5711 = Fm$Synth$many$($5709, _defs$5);
                    return $5711;
                }));
                var $5706 = $5710;
                break;
        };
        return $5706;
    };
    const Fm$Synth$many = x0 => x1 => Fm$Synth$many$(x0, x1);

    function Fm$Synth$file$(_file$1, _defs$2) {
        var $5712 = Monad$bind$(IO$monad)(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Fm$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5714 = self.value;
                    var $5715 = Monad$pure$(IO$monad)(Either$left$($5714));
                    var $5713 = $5715;
                    break;
                case 'Either.right':
                    var $5716 = self.value;
                    var _file_defs$6 = $5716;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Fm$Name$from_bits);
                    var $5717 = Monad$bind$(IO$monad)(Fm$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5718 = Monad$pure$(IO$monad)(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5718;
                    }));
                    var $5713 = $5717;
                    break;
            };
            return $5713;
        }));
        return $5712;
    };
    const Fm$Synth$file = x0 => x1 => Fm$Synth$file$(x0, x1);

    function Fm$checker$io$file$(_file$1) {
        var $5719 = Monad$bind$(IO$monad)(Fm$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5721 = self.value;
                    var $5722 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5723 = IO$print$($5721);
                        return $5723;
                    }));
                    var $5720 = $5722;
                    break;
                case 'Either.right':
                    var $5724 = self.value;
                    var self = $5724;
                    switch (self._) {
                        case 'Pair.new':
                            var $5726 = self.fst;
                            var $5727 = self.snd;
                            var _nams$6 = $5726;
                            var _defs$7 = $5727;
                            var $5728 = IO$print$(Fm$Defs$report$(_defs$7, _nams$6));
                            var $5725 = $5728;
                            break;
                    };
                    var $5720 = $5725;
                    break;
            };
            return $5720;
        }));
        return $5719;
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
                        var $5729 = self.value;
                        var $5730 = $5729;
                        return $5730;
                    case 'IO.ask':
                        var $5731 = self.query;
                        var $5732 = self.param;
                        var $5733 = self.then;
                        var $5734 = IO$purify$($5733(""));
                        return $5734;
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
                var $5736 = self.value;
                var $5737 = $5736;
                var $5735 = $5737;
                break;
            case 'Either.right':
                var $5738 = self.value;
                var $5739 = IO$purify$((() => {
                    var _defs$3 = $5738;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Fm$Name$from_bits);
                    var $5740 = Monad$bind$(IO$monad)(Fm$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5741 = Monad$pure$(IO$monad)(Fm$Defs$report$(_defs$5, _nams$4));
                        return $5741;
                    }));
                    return $5740;
                })());
                var $5735 = $5739;
                break;
        };
        return $5735;
    };
    const Fm$checker$code = x0 => Fm$checker$code$(x0);

    function Fm$Term$read$(_code$1) {
        var self = Fm$Parser$term(0n)(_code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $5743 = self.idx;
                var $5744 = self.code;
                var $5745 = self.err;
                var $5746 = Maybe$none;
                var $5742 = $5746;
                break;
            case 'Parser.Reply.value':
                var $5747 = self.idx;
                var $5748 = self.code;
                var $5749 = self.val;
                var $5750 = Maybe$some$($5749);
                var $5742 = $5750;
                break;
        };
        return $5742;
    };
    const Fm$Term$read = x0 => Fm$Term$read$(x0);
    const Fm = (() => {
        var __$1 = Fm$to_core$io$one;
        var __$2 = Fm$checker$io$one;
        var __$3 = Fm$checker$io$file;
        var __$4 = Fm$checker$code;
        var __$5 = Fm$Term$read;
        var $5751 = Fm$checker$io$file$("Main.fm");
        return $5751;
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
        'Fm.Parser.letforrange.u32': Fm$Parser$letforrange$u32,
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
        'Fm.Parser.forrange.u32': Fm$Parser$forrange$u32,
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