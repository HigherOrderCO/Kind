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
    const Fm$Parser$u8 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1096 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1097 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1098 = Monad$bind$(Parser$monad)(Fm$Parser$text$("b"))((_$4 => {
                    var _term$5 = Fm$Term$ref$("Nat.to_u8");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$nat$(_natx$3));
                    var $1099 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                        var $1100 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$6));
                        return $1100;
                    }));
                    return $1099;
                }));
                return $1098;
            }));
            return $1097;
        }));
        return $1096;
    }));
    const Fm$Parser$u16 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1101 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1102 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1103 = Monad$bind$(Parser$monad)(Fm$Parser$text$("s"))((_$4 => {
                    var _term$5 = Fm$Term$ref$("Nat.to_u16");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$nat$(_natx$3));
                    var $1104 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                        var $1105 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$6));
                        return $1105;
                    }));
                    return $1104;
                }));
                return $1103;
            }));
            return $1102;
        }));
        return $1101;
    }));
    const Fm$Parser$u32 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1106 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1107 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1108 = Monad$bind$(Parser$monad)(Fm$Parser$text$("u"))((_$4 => {
                    var _term$5 = Fm$Term$ref$("Nat.to_u32");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$nat$(_natx$3));
                    var $1109 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                        var $1110 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$6));
                        return $1110;
                    }));
                    return $1109;
                }));
                return $1108;
            }));
            return $1107;
        }));
        return $1106;
    }));
    const Fm$Parser$u64 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1111 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1112 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1113 = Monad$bind$(Parser$monad)(Fm$Parser$text$("l"))((_$4 => {
                    var _term$5 = Fm$Term$ref$("Nat.to_u64");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$nat$(_natx$3));
                    var $1114 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                        var $1115 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$6));
                        return $1115;
                    }));
                    return $1114;
                }));
                return $1113;
            }));
            return $1112;
        }));
        return $1111;
    }));
    const Fm$Parser$nat = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1116 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1117 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1118 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$4 => {
                    var $1119 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$4, Fm$Term$nat$(_natx$3)));
                    return $1119;
                }));
                return $1118;
            }));
            return $1117;
        }));
        return $1116;
    }));
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $1120 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $1120;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);
    const Fm$Parser$reference = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1121 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var self = (_name$2 === "case");
            if (self) {
                var $1123 = Parser$fail("Reserved keyword.");
                var $1122 = $1123;
            } else {
                var self = (_name$2 === "do");
                if (self) {
                    var $1125 = Parser$fail("Reserved keyword.");
                    var $1124 = $1125;
                } else {
                    var self = (_name$2 === "if");
                    if (self) {
                        var $1127 = Parser$fail("Reserved keyword.");
                        var $1126 = $1127;
                    } else {
                        var self = (_name$2 === "let");
                        if (self) {
                            var $1129 = Parser$fail("Reserved keyword.");
                            var $1128 = $1129;
                        } else {
                            var self = (_name$2 === "def");
                            if (self) {
                                var $1131 = Parser$fail("Reserved keyword.");
                                var $1130 = $1131;
                            } else {
                                var self = (_name$2 === "true");
                                if (self) {
                                    var $1133 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Bool.true"));
                                    var $1132 = $1133;
                                } else {
                                    var self = (_name$2 === "false");
                                    if (self) {
                                        var $1135 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Bool.false"));
                                        var $1134 = $1135;
                                    } else {
                                        var self = (_name$2 === "unit");
                                        if (self) {
                                            var $1137 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Unit.new"));
                                            var $1136 = $1137;
                                        } else {
                                            var self = (_name$2 === "none");
                                            if (self) {
                                                var _term$3 = Fm$Term$ref$("Maybe.none");
                                                var _term$4 = Fm$Term$app$(_term$3, Fm$Term$hol$(Bits$e));
                                                var $1139 = Monad$pure$(Parser$monad)(_term$4);
                                                var $1138 = $1139;
                                            } else {
                                                var self = (_name$2 === "refl");
                                                if (self) {
                                                    var _term$3 = Fm$Term$ref$("Equal.refl");
                                                    var _term$4 = Fm$Term$app$(_term$3, Fm$Term$hol$(Bits$e));
                                                    var _term$5 = Fm$Term$app$(_term$4, Fm$Term$hol$(Bits$e));
                                                    var $1141 = Monad$pure$(Parser$monad)(_term$5);
                                                    var $1140 = $1141;
                                                } else {
                                                    var $1142 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$3 => {
                                                        var $1143 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$3, Fm$Term$ref$(_name$2)));
                                                        return $1143;
                                                    }));
                                                    var $1140 = $1142;
                                                };
                                                var $1138 = $1140;
                                            };
                                            var $1136 = $1138;
                                        };
                                        var $1134 = $1136;
                                    };
                                    var $1132 = $1134;
                                };
                                var $1130 = $1132;
                            };
                            var $1128 = $1130;
                        };
                        var $1126 = $1128;
                    };
                    var $1124 = $1126;
                };
                var $1122 = $1124;
            };
            return $1122;
        }));
        return $1121;
    }));
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Fm$Parser$application$(_init$1, _func$2) {
        var $1144 = Monad$bind$(Parser$monad)(Parser$text("("))((_$3 => {
            var $1145 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$(")"), Fm$Parser$item$(Fm$Parser$term)))((_args$4 => {
                var $1146 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _expr$6 = (() => {
                        var $1149 = _func$2;
                        var $1150 = _args$4;
                        let _f$7 = $1149;
                        let _x$6;
                        while ($1150._ === 'List.cons') {
                            _x$6 = $1150.head;
                            var $1149 = Fm$Term$app$(_f$7, _x$6);
                            _f$7 = $1149;
                            $1150 = $1150.tail;
                        }
                        return _f$7;
                    })();
                    var $1147 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _expr$6));
                    return $1147;
                }));
                return $1146;
            }));
            return $1145;
        }));
        return $1144;
    };
    const Fm$Parser$application = x0 => x1 => Fm$Parser$application$(x0, x1);
    const Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$nil))));

    function Parser$spaces_text$(_text$1) {
        var $1151 = Monad$bind$(Parser$monad)(Parser$spaces)((_$2 => {
            var $1152 = Parser$text(_text$1);
            return $1152;
        }));
        return $1151;
    };
    const Parser$spaces_text = x0 => Parser$spaces_text$(x0);

    function Fm$Parser$application$erased$(_init$1, _func$2) {
        var $1153 = Monad$bind$(Parser$monad)(Parser$get_index)((_init$3 => {
            var $1154 = Monad$bind$(Parser$monad)(Parser$text("<"))((_$4 => {
                var $1155 = Monad$bind$(Parser$monad)(Parser$until1$(Parser$spaces_text$(">"), Fm$Parser$item$(Fm$Parser$term)))((_args$5 => {
                    var $1156 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$3))((_orig$6 => {
                        var _expr$7 = (() => {
                            var $1159 = _func$2;
                            var $1160 = _args$5;
                            let _f$8 = $1159;
                            let _x$7;
                            while ($1160._ === 'List.cons') {
                                _x$7 = $1160.head;
                                var $1159 = Fm$Term$app$(_f$8, _x$7);
                                _f$8 = $1159;
                                $1160 = $1160.tail;
                            }
                            return _f$8;
                        })();
                        var $1157 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, _expr$7));
                        return $1157;
                    }));
                    return $1156;
                }));
                return $1155;
            }));
            return $1154;
        }));
        return $1153;
    };
    const Fm$Parser$application$erased = x0 => x1 => Fm$Parser$application$erased$(x0, x1);

    function Fm$Parser$arrow$(_init$1, _xtyp$2) {
        var $1161 = Monad$bind$(Parser$monad)(Fm$Parser$text$("->"))((_$3 => {
            var $1162 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$4 => {
                var $1163 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1164 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$all$(Bool$false, "", "", _xtyp$2, (_s$6 => _x$7 => {
                        var $1165 = _body$4;
                        return $1165;
                    }))));
                    return $1164;
                }));
                return $1163;
            }));
            return $1162;
        }));
        return $1161;
    };
    const Fm$Parser$arrow = x0 => x1 => Fm$Parser$arrow$(x0, x1);

    function Fm$Parser$op$(_sym$1, _ref$2, _init$3, _val0$4) {
        var $1166 = Monad$bind$(Parser$monad)(Fm$Parser$text$(_sym$1))((_$5 => {
            var $1167 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$6 => {
                var $1168 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$3))((_orig$7 => {
                    var _term$8 = Fm$Term$ref$(_ref$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val0$4);
                    var _term$10 = Fm$Term$app$(_term$9, _val1$6);
                    var $1169 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$10));
                    return $1169;
                }));
                return $1168;
            }));
            return $1167;
        }));
        return $1166;
    };
    const Fm$Parser$op = x0 => x1 => x2 => x3 => Fm$Parser$op$(x0, x1, x2, x3);
    const Fm$Parser$add = Fm$Parser$op("+")("Nat.add");
    const Fm$Parser$sub = Fm$Parser$op("+")("Nat.add");
    const Fm$Parser$mul = Fm$Parser$op("*")("Nat.mul");
    const Fm$Parser$div = Fm$Parser$op("/")("Nat.div");
    const Fm$Parser$mod = Fm$Parser$op("%")("Nat.mod");

    function Fm$Parser$cons$(_init$1, _head$2) {
        var $1170 = Monad$bind$(Parser$monad)(Fm$Parser$text$("&"))((_$3 => {
            var $1171 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_tail$4 => {
                var $1172 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("List.cons");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _head$2);
                    var _term$9 = Fm$Term$app$(_term$8, _tail$4);
                    var $1173 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $1174 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
                        return $1174;
                    }));
                    return $1173;
                }));
                return $1172;
            }));
            return $1171;
        }));
        return $1170;
    };
    const Fm$Parser$cons = x0 => x1 => Fm$Parser$cons$(x0, x1);

    function Fm$Parser$concat$(_init$1, _lst0$2) {
        var $1175 = Monad$bind$(Parser$monad)(Fm$Parser$text$("++"))((_$3 => {
            var $1176 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_lst1$4 => {
                var $1177 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("List.concat");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _lst0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _lst1$4);
                    var $1178 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $1179 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
                        return $1179;
                    }));
                    return $1178;
                }));
                return $1177;
            }));
            return $1176;
        }));
        return $1175;
    };
    const Fm$Parser$concat = x0 => x1 => Fm$Parser$concat$(x0, x1);

    function Fm$Parser$string_concat$(_init$1, _str0$2) {
        var $1180 = Monad$bind$(Parser$monad)(Fm$Parser$text$("|"))((_$3 => {
            var $1181 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_str1$4 => {
                var $1182 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("String.concat");
                    var _term$7 = Fm$Term$app$(_term$6, _str0$2);
                    var _term$8 = Fm$Term$app$(_term$7, _str1$4);
                    var $1183 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$9 => {
                        var $1184 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$9, _term$8));
                        return $1184;
                    }));
                    return $1183;
                }));
                return $1182;
            }));
            return $1181;
        }));
        return $1180;
    };
    const Fm$Parser$string_concat = x0 => x1 => Fm$Parser$string_concat$(x0, x1);

    function Fm$Parser$sigma$(_init$1, _val0$2) {
        var $1185 = Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$3 => {
            var $1186 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1187 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Sigma.new");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, Fm$Term$hol$(Bits$e));
                    var _term$9 = Fm$Term$app$(_term$8, _val0$2);
                    var _term$10 = Fm$Term$app$(_term$9, _val1$4);
                    var $1188 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$10));
                    return $1188;
                }));
                return $1187;
            }));
            return $1186;
        }));
        return $1185;
    };
    const Fm$Parser$sigma = x0 => x1 => Fm$Parser$sigma$(x0, x1);

    function Fm$Parser$equality$(_init$1, _val0$2) {
        var $1189 = Monad$bind$(Parser$monad)(Fm$Parser$text$("=="))((_$3 => {
            var $1190 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1191 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Equal");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _val0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val1$4);
                    var $1192 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$9));
                    return $1192;
                }));
                return $1191;
            }));
            return $1190;
        }));
        return $1189;
    };
    const Fm$Parser$equality = x0 => x1 => Fm$Parser$equality$(x0, x1);

    function Fm$Parser$inequality$(_init$1, _val0$2) {
        var $1193 = Monad$bind$(Parser$monad)(Fm$Parser$text$("!="))((_$3 => {
            var $1194 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1195 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Equal");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _val0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val1$4);
                    var _term$10 = Fm$Term$app$(Fm$Term$ref$("Not"), _term$9);
                    var $1196 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$10));
                    return $1196;
                }));
                return $1195;
            }));
            return $1194;
        }));
        return $1193;
    };
    const Fm$Parser$inequality = x0 => x1 => Fm$Parser$inequality$(x0, x1);

    function Fm$Parser$rewrite$(_init$1, _subt$2) {
        var $1197 = Monad$bind$(Parser$monad)(Fm$Parser$text$("::"))((_$3 => {
            var $1198 = Monad$bind$(Parser$monad)(Fm$Parser$text$("rewrite"))((_$4 => {
                var $1199 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$5 => {
                    var $1200 = Monad$bind$(Parser$monad)(Fm$Parser$text$("in"))((_$6 => {
                        var $1201 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$7 => {
                            var $1202 = Monad$bind$(Parser$monad)(Fm$Parser$text$("with"))((_$8 => {
                                var $1203 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_iseq$9 => {
                                    var $1204 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                                        var _term$11 = Fm$Term$ref$("Equal.rewrite");
                                        var _term$12 = Fm$Term$app$(_term$11, Fm$Term$hol$(Bits$e));
                                        var _term$13 = Fm$Term$app$(_term$12, Fm$Term$hol$(Bits$e));
                                        var _term$14 = Fm$Term$app$(_term$13, Fm$Term$hol$(Bits$e));
                                        var _term$15 = Fm$Term$app$(_term$14, Fm$Term$lam$(_name$5, (_x$15 => {
                                            var $1206 = _type$7;
                                            return $1206;
                                        })));
                                        var _term$16 = Fm$Term$app$(_term$15, _iseq$9);
                                        var _term$17 = Fm$Term$app$(_term$16, _subt$2);
                                        var $1205 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$17));
                                        return $1205;
                                    }));
                                    return $1204;
                                }));
                                return $1203;
                            }));
                            return $1202;
                        }));
                        return $1201;
                    }));
                    return $1200;
                }));
                return $1199;
            }));
            return $1198;
        }));
        return $1197;
    };
    const Fm$Parser$rewrite = x0 => x1 => Fm$Parser$rewrite$(x0, x1);

    function Fm$Term$ann$(_done$1, _term$2, _type$3) {
        var $1207 = ({
            _: 'Fm.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $1207;
    };
    const Fm$Term$ann = x0 => x1 => x2 => Fm$Term$ann$(x0, x1, x2);

    function Fm$Parser$annotation$(_init$1, _term$2) {
        var $1208 = Monad$bind$(Parser$monad)(Fm$Parser$text$("::"))((_$3 => {
            var $1209 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$4 => {
                var $1210 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1211 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$ann$(Bool$false, _term$2, _type$4)));
                    return $1211;
                }));
                return $1210;
            }));
            return $1209;
        }));
        return $1208;
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
                        var $1213 = self.idx;
                        var $1214 = self.code;
                        var $1215 = self.err;
                        var $1216 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $1212 = $1216;
                        break;
                    case 'Parser.Reply.value':
                        var $1217 = self.idx;
                        var $1218 = self.code;
                        var $1219 = self.val;
                        var $1220 = Fm$Parser$suffix$(_init$1, $1219, $1217, $1218);
                        var $1212 = $1220;
                        break;
                };
                return $1212;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Parser$suffix = x0 => x1 => x2 => x3 => Fm$Parser$suffix$(x0, x1, x2, x3);
    const Fm$Parser$term = Monad$bind$(Parser$monad)(Parser$get_code)((_code$1 => {
        var $1221 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $1222 = Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$type, List$cons$(Fm$Parser$forall, List$cons$(Fm$Parser$lambda, List$cons$(Fm$Parser$lambda$erased, List$cons$(Fm$Parser$lambda$nameless, List$cons$(Fm$Parser$parenthesis, List$cons$(Fm$Parser$letforrange$u32, List$cons$(Fm$Parser$letforin, List$cons$(Fm$Parser$let, List$cons$(Fm$Parser$get, List$cons$(Fm$Parser$def, List$cons$(Fm$Parser$if, List$cons$(Fm$Parser$char, List$cons$(Fm$Parser$string, List$cons$(Fm$Parser$pair, List$cons$(Fm$Parser$sigma$type, List$cons$(Fm$Parser$some, List$cons$(Fm$Parser$apply, List$cons$(Fm$Parser$list, List$cons$(Fm$Parser$log, List$cons$(Fm$Parser$forin, List$cons$(Fm$Parser$forrange$u32, List$cons$(Fm$Parser$forin2, List$cons$(Fm$Parser$do, List$cons$(Fm$Parser$case, List$cons$(Fm$Parser$open, List$cons$(Fm$Parser$goal, List$cons$(Fm$Parser$hole, List$cons$(Fm$Parser$u8, List$cons$(Fm$Parser$u16, List$cons$(Fm$Parser$u32, List$cons$(Fm$Parser$u64, List$cons$(Fm$Parser$nat, List$cons$(Fm$Parser$reference, List$nil))))))))))))))))))))))))))))))))))))((_term$3 => {
                var $1223 = Fm$Parser$suffix(_init$2)(_term$3);
                return $1223;
            }));
            return $1222;
        }));
        return $1221;
    }));
    const Fm$Parser$name_term = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$1 => {
        var $1224 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$2 => {
            var $1225 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$3 => {
                var $1226 = Monad$pure$(Parser$monad)(Pair$new$(_name$1, _type$3));
                return $1226;
            }));
            return $1225;
        }));
        return $1224;
    }));

    function Fm$Binder$new$(_eras$1, _name$2, _term$3) {
        var $1227 = ({
            _: 'Fm.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $1227;
    };
    const Fm$Binder$new = x0 => x1 => x2 => Fm$Binder$new$(x0, x1, x2);

    function Fm$Parser$binder$homo$(_eras$1) {
        var $1228 = Monad$bind$(Parser$monad)(Fm$Parser$text$((() => {
            var self = _eras$1;
            if (self) {
                var $1229 = "<";
                return $1229;
            } else {
                var $1230 = "(";
                return $1230;
            };
        })()))((_$2 => {
            var $1231 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$((() => {
                var self = _eras$1;
                if (self) {
                    var $1232 = ">";
                    return $1232;
                } else {
                    var $1233 = ")";
                    return $1233;
                };
            })()), Fm$Parser$item$(Fm$Parser$name_term)))((_bind$3 => {
                var $1234 = Monad$pure$(Parser$monad)(List$mapped$(_bind$3, (_pair$4 => {
                    var self = _pair$4;
                    switch (self._) {
                        case 'Pair.new':
                            var $1236 = self.fst;
                            var $1237 = self.snd;
                            var $1238 = Fm$Binder$new$(_eras$1, $1236, $1237);
                            var $1235 = $1238;
                            break;
                    };
                    return $1235;
                })));
                return $1234;
            }));
            return $1231;
        }));
        return $1228;
    };
    const Fm$Parser$binder$homo = x0 => Fm$Parser$binder$homo$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.nil':
                var $1240 = _bs$3;
                var $1239 = $1240;
                break;
            case 'List.cons':
                var $1241 = self.head;
                var $1242 = self.tail;
                var $1243 = List$cons$($1241, List$concat$($1242, _bs$3));
                var $1239 = $1243;
                break;
        };
        return $1239;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1245 = List$nil;
                var $1244 = $1245;
                break;
            case 'List.cons':
                var $1246 = self.head;
                var $1247 = self.tail;
                var $1248 = List$concat$($1246, List$flatten$($1247));
                var $1244 = $1248;
                break;
        };
        return $1244;
    };
    const List$flatten = x0 => List$flatten$(x0);
    const Fm$Parser$binder = Monad$bind$(Parser$monad)(Parser$many1$(Parser$first_of$(List$cons$(Fm$Parser$binder$homo$(Bool$true), List$cons$(Fm$Parser$binder$homo$(Bool$false), List$nil)))))((_lists$1 => {
        var $1249 = Monad$pure$(Parser$monad)(List$flatten$(_lists$1));
        return $1249;
    }));

    function Fm$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.nil':
                var $1251 = _body$2;
                var $1250 = $1251;
                break;
            case 'List.cons':
                var $1252 = self.head;
                var $1253 = self.tail;
                var self = $1252;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1255 = self.eras;
                        var $1256 = self.name;
                        var $1257 = self.term;
                        var $1258 = Fm$Term$all$($1255, "", $1256, $1257, (_s$8 => _x$9 => {
                            var $1259 = Fm$Parser$make_forall$($1253, _body$2);
                            return $1259;
                        }));
                        var $1254 = $1258;
                        break;
                };
                var $1250 = $1254;
                break;
        };
        return $1250;
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
                        var $1260 = Maybe$none;
                        return $1260;
                    case 'List.cons':
                        var $1261 = self.head;
                        var $1262 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $1264 = Maybe$some$($1261);
                            var $1263 = $1264;
                        } else {
                            var $1265 = (self - 1n);
                            var $1266 = List$at$($1265, $1262);
                            var $1263 = $1266;
                        };
                        return $1263;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $1267 = List$at$(_index$2, List$reverse$(_list$3));
        return $1267;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Fm$Term$var$(_name$1, _indx$2) {
        var $1268 = ({
            _: 'Fm.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $1268;
    };
    const Fm$Term$var = x0 => x1 => Fm$Term$var$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1270 = self.fst;
                var $1271 = self.snd;
                var $1272 = $1271;
                var $1269 = $1272;
                break;
        };
        return $1269;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Fm$Name$eql$(_a$1, _b$2) {
        var $1273 = (_a$1 === _b$2);
        return $1273;
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
                        var $1274 = Maybe$none;
                        return $1274;
                    case 'List.cons':
                        var $1275 = self.head;
                        var $1276 = self.tail;
                        var self = $1275;
                        switch (self._) {
                            case 'Pair.new':
                                var $1278 = self.fst;
                                var $1279 = self.snd;
                                var self = Fm$Name$eql$(_name$1, $1278);
                                if (self) {
                                    var $1281 = Maybe$some$($1279);
                                    var $1280 = $1281;
                                } else {
                                    var $1282 = Fm$Context$find$(_name$1, $1276);
                                    var $1280 = $1282;
                                };
                                var $1277 = $1280;
                                break;
                        };
                        return $1277;
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
                var $1284 = 0n;
                var $1283 = $1284;
                break;
            case 'List.cons':
                var $1285 = self.head;
                var $1286 = self.tail;
                var $1287 = Nat$succ$(List$length$($1286));
                var $1283 = $1287;
                break;
        };
        return $1283;
    };
    const List$length = x0 => List$length$(x0);

    function Fm$Path$o$(_path$1, _x$2) {
        var $1288 = _path$1((_x$2 + '0'));
        return $1288;
    };
    const Fm$Path$o = x0 => x1 => Fm$Path$o$(x0, x1);

    function Fm$Path$i$(_path$1, _x$2) {
        var $1289 = _path$1((_x$2 + '1'));
        return $1289;
    };
    const Fm$Path$i = x0 => x1 => Fm$Path$i$(x0, x1);

    function Fm$Path$to_bits$(_path$1) {
        var $1290 = _path$1(Bits$e);
        return $1290;
    };
    const Fm$Path$to_bits = x0 => Fm$Path$to_bits$(x0);

    function Fm$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Fm.Term.var':
                var $1292 = self.name;
                var $1293 = self.indx;
                var self = List$at_last$($1293, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1295 = Fm$Term$var$($1292, $1293);
                        var $1294 = $1295;
                        break;
                    case 'Maybe.some':
                        var $1296 = self.value;
                        var $1297 = Pair$snd$($1296);
                        var $1294 = $1297;
                        break;
                };
                var $1291 = $1294;
                break;
            case 'Fm.Term.ref':
                var $1298 = self.name;
                var self = Fm$Context$find$($1298, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1300 = Fm$Term$ref$($1298);
                        var $1299 = $1300;
                        break;
                    case 'Maybe.some':
                        var $1301 = self.value;
                        var $1302 = $1301;
                        var $1299 = $1302;
                        break;
                };
                var $1291 = $1299;
                break;
            case 'Fm.Term.typ':
                var $1303 = Fm$Term$typ;
                var $1291 = $1303;
                break;
            case 'Fm.Term.all':
                var $1304 = self.eras;
                var $1305 = self.self;
                var $1306 = self.name;
                var $1307 = self.xtyp;
                var $1308 = self.body;
                var _vlen$9 = List$length$(_vars$1);
                var $1309 = Fm$Term$all$($1304, $1305, $1306, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1307), (_s$10 => _x$11 => {
                    var $1310 = Fm$Term$bind$(List$cons$(Pair$new$($1306, _x$11), List$cons$(Pair$new$($1305, _s$10), _vars$1)), Fm$Path$i(_path$2), $1308(Fm$Term$var$($1305, _vlen$9))(Fm$Term$var$($1306, Nat$succ$(_vlen$9))));
                    return $1310;
                }));
                var $1291 = $1309;
                break;
            case 'Fm.Term.lam':
                var $1311 = self.name;
                var $1312 = self.body;
                var _vlen$6 = List$length$(_vars$1);
                var $1313 = Fm$Term$lam$($1311, (_x$7 => {
                    var $1314 = Fm$Term$bind$(List$cons$(Pair$new$($1311, _x$7), _vars$1), Fm$Path$o(_path$2), $1312(Fm$Term$var$($1311, _vlen$6)));
                    return $1314;
                }));
                var $1291 = $1313;
                break;
            case 'Fm.Term.app':
                var $1315 = self.func;
                var $1316 = self.argm;
                var $1317 = Fm$Term$app$(Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1315), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1316));
                var $1291 = $1317;
                break;
            case 'Fm.Term.let':
                var $1318 = self.name;
                var $1319 = self.expr;
                var $1320 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1321 = Fm$Term$let$($1318, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1319), (_x$8 => {
                    var $1322 = Fm$Term$bind$(List$cons$(Pair$new$($1318, _x$8), _vars$1), Fm$Path$i(_path$2), $1320(Fm$Term$var$($1318, _vlen$7)));
                    return $1322;
                }));
                var $1291 = $1321;
                break;
            case 'Fm.Term.def':
                var $1323 = self.name;
                var $1324 = self.expr;
                var $1325 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1326 = Fm$Term$def$($1323, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1324), (_x$8 => {
                    var $1327 = Fm$Term$bind$(List$cons$(Pair$new$($1323, _x$8), _vars$1), Fm$Path$i(_path$2), $1325(Fm$Term$var$($1323, _vlen$7)));
                    return $1327;
                }));
                var $1291 = $1326;
                break;
            case 'Fm.Term.ann':
                var $1328 = self.done;
                var $1329 = self.term;
                var $1330 = self.type;
                var $1331 = Fm$Term$ann$($1328, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1329), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1330));
                var $1291 = $1331;
                break;
            case 'Fm.Term.gol':
                var $1332 = self.name;
                var $1333 = self.dref;
                var $1334 = self.verb;
                var $1335 = Fm$Term$gol$($1332, $1333, $1334);
                var $1291 = $1335;
                break;
            case 'Fm.Term.hol':
                var $1336 = self.path;
                var $1337 = Fm$Term$hol$(Fm$Path$to_bits$(_path$2));
                var $1291 = $1337;
                break;
            case 'Fm.Term.nat':
                var $1338 = self.natx;
                var $1339 = Fm$Term$nat$($1338);
                var $1291 = $1339;
                break;
            case 'Fm.Term.chr':
                var $1340 = self.chrx;
                var $1341 = Fm$Term$chr$($1340);
                var $1291 = $1341;
                break;
            case 'Fm.Term.str':
                var $1342 = self.strx;
                var $1343 = Fm$Term$str$($1342);
                var $1291 = $1343;
                break;
            case 'Fm.Term.cse':
                var $1344 = self.path;
                var $1345 = self.expr;
                var $1346 = self.name;
                var $1347 = self.with;
                var $1348 = self.cses;
                var $1349 = self.moti;
                var _expr$10 = Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1345);
                var _name$11 = $1346;
                var _wyth$12 = $1347;
                var _cses$13 = $1348;
                var _moti$14 = $1349;
                var $1350 = Fm$Term$cse$(Fm$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $1291 = $1350;
                break;
            case 'Fm.Term.ori':
                var $1351 = self.orig;
                var $1352 = self.expr;
                var $1353 = Fm$Term$ori$($1351, Fm$Term$bind$(_vars$1, _path$2, $1352));
                var $1291 = $1353;
                break;
        };
        return $1291;
    };
    const Fm$Term$bind = x0 => x1 => x2 => Fm$Term$bind$(x0, x1, x2);
    const Fm$Status$done = ({
        _: 'Fm.Status.done'
    });

    function Fm$set$(_name$2, _val$3, _map$4) {
        var $1354 = Map$set$((fm_name_to_bits(_name$2)), _val$3, _map$4);
        return $1354;
    };
    const Fm$set = x0 => x1 => x2 => Fm$set$(x0, x1, x2);

    function Fm$define$(_file$1, _code$2, _name$3, _term$4, _type$5, _done$6, _defs$7) {
        var self = _done$6;
        if (self) {
            var $1356 = Fm$Status$done;
            var _stat$8 = $1356;
        } else {
            var $1357 = Fm$Status$init;
            var _stat$8 = $1357;
        };
        var $1355 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$4, _type$5, _stat$8), _defs$7);
        return $1355;
    };
    const Fm$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Fm$define$(x0, x1, x2, x3, x4, x5, x6);

    function Fm$Parser$file$def$(_file$1, _code$2, _defs$3) {
        var $1358 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
            var $1359 = Monad$bind$(Parser$monad)(Parser$many$(Fm$Parser$binder))((_args$5 => {
                var _args$6 = List$flatten$(_args$5);
                var $1360 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$7 => {
                    var $1361 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$8 => {
                        var $1362 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$9 => {
                            var _type$10 = Fm$Parser$make_forall$(_args$6, _type$8);
                            var _term$11 = Fm$Parser$make_lambda$(List$mapped$(_args$6, (_x$11 => {
                                var self = _x$11;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $1365 = self.eras;
                                        var $1366 = self.name;
                                        var $1367 = self.term;
                                        var $1368 = $1366;
                                        var $1364 = $1368;
                                        break;
                                };
                                return $1364;
                            })), _term$9);
                            var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                                var $1369 = (_x$12 + '1');
                                return $1369;
                            }), _type$10);
                            var _term$13 = Fm$Term$bind$(List$nil, (_x$13 => {
                                var $1370 = (_x$13 + '0');
                                return $1370;
                            }), _term$11);
                            var _defs$14 = Fm$define$(_file$1, _code$2, _name$4, _term$13, _type$12, Bool$false, _defs$3);
                            var $1363 = Monad$pure$(Parser$monad)(_defs$14);
                            return $1363;
                        }));
                        return $1362;
                    }));
                    return $1361;
                }));
                return $1360;
            }));
            return $1359;
        }));
        return $1358;
    };
    const Fm$Parser$file$def = x0 => x1 => x2 => Fm$Parser$file$def$(x0, x1, x2);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $1372 = _a$2;
                var $1371 = $1372;
                break;
            case 'Maybe.some':
                var $1373 = self.value;
                var $1374 = $1373;
                var $1371 = $1374;
                break;
        };
        return $1371;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Fm$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $1375 = ({
            _: 'Fm.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $1375;
    };
    const Fm$Constructor$new = x0 => x1 => x2 => Fm$Constructor$new$(x0, x1, x2);

    function Fm$Parser$constructor$(_namespace$1) {
        var $1376 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1377 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_args$3 => {
                var $1378 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1379 = Fm$Parser$binder;
                    return $1379;
                }))))((_inds$4 => {
                    var _args$5 = Maybe$default$(List$nil, _args$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1380 = Monad$pure$(Parser$monad)(Fm$Constructor$new$(_name$2, _args$5, _inds$6));
                    return $1380;
                }));
                return $1378;
            }));
            return $1377;
        }));
        return $1376;
    };
    const Fm$Parser$constructor = x0 => Fm$Parser$constructor$(x0);

    function Fm$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $1381 = ({
            _: 'Fm.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $1381;
    };
    const Fm$Datatype$new = x0 => x1 => x2 => x3 => Fm$Datatype$new$(x0, x1, x2, x3);
    const Fm$Parser$datatype = Monad$bind$(Parser$monad)(Fm$Parser$text$("type "))((_$1 => {
        var $1382 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1383 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_pars$3 => {
                var $1384 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1385 = Fm$Parser$binder;
                    return $1385;
                }))))((_inds$4 => {
                    var _pars$5 = Maybe$default$(List$nil, _pars$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1386 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$7 => {
                        var $1387 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("}"), Fm$Parser$item$(Fm$Parser$constructor$(_name$2))))((_ctrs$8 => {
                            var $1388 = Monad$pure$(Parser$monad)(Fm$Datatype$new$(_name$2, _pars$5, _inds$6, _ctrs$8));
                            return $1388;
                        }));
                        return $1387;
                    }));
                    return $1386;
                }));
                return $1384;
            }));
            return $1383;
        }));
        return $1382;
    }));

    function Fm$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1391 = self.name;
                        var $1392 = self.pars;
                        var $1393 = self.inds;
                        var $1394 = self.ctrs;
                        var _slf$8 = Fm$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $1397 = _slf$8;
                            var $1398 = $1392;
                            let _slf$10 = $1397;
                            let _var$9;
                            while ($1398._ === 'List.cons') {
                                _var$9 = $1398.head;
                                var $1397 = Fm$Term$app$(_slf$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1399 = self.eras;
                                            var $1400 = self.name;
                                            var $1401 = self.term;
                                            var $1402 = $1400;
                                            return $1402;
                                    };
                                })()));
                                _slf$10 = $1397;
                                $1398 = $1398.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $1404 = _slf$9;
                            var $1405 = $1393;
                            let _slf$11 = $1404;
                            let _var$10;
                            while ($1405._ === 'List.cons') {
                                _var$10 = $1405.head;
                                var $1404 = Fm$Term$app$(_slf$11, Fm$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1406 = self.eras;
                                            var $1407 = self.name;
                                            var $1408 = self.term;
                                            var $1409 = $1407;
                                            return $1409;
                                    };
                                })()));
                                _slf$11 = $1404;
                                $1405 = $1405.tail;
                            }
                            return _slf$11;
                        })();
                        var $1395 = Fm$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $1410 = Fm$Term$typ;
                            return $1410;
                        }));
                        var $1390 = $1395;
                        break;
                };
                var $1389 = $1390;
                break;
            case 'List.cons':
                var $1411 = self.head;
                var $1412 = self.tail;
                var self = $1411;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1414 = self.eras;
                        var $1415 = self.name;
                        var $1416 = self.term;
                        var $1417 = Fm$Term$all$($1414, "", $1415, $1416, (_s$9 => _x$10 => {
                            var $1418 = Fm$Datatype$build_term$motive$go$(_type$1, _name$2, $1412);
                            return $1418;
                        }));
                        var $1413 = $1417;
                        break;
                };
                var $1389 = $1413;
                break;
        };
        return $1389;
    };
    const Fm$Datatype$build_term$motive$go = x0 => x1 => x2 => Fm$Datatype$build_term$motive$go$(x0, x1, x2);

    function Fm$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1420 = self.name;
                var $1421 = self.pars;
                var $1422 = self.inds;
                var $1423 = self.ctrs;
                var $1424 = Fm$Datatype$build_term$motive$go$(_type$1, $1420, $1422);
                var $1419 = $1424;
                break;
        };
        return $1419;
    };
    const Fm$Datatype$build_term$motive = x0 => Fm$Datatype$build_term$motive$(x0);

    function Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1427 = self.name;
                        var $1428 = self.pars;
                        var $1429 = self.inds;
                        var $1430 = self.ctrs;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Fm.Constructor.new':
                                var $1432 = self.name;
                                var $1433 = self.args;
                                var $1434 = self.inds;
                                var _ret$11 = Fm$Term$ref$(Fm$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $1437 = _ret$11;
                                    var $1438 = $1434;
                                    let _ret$13 = $1437;
                                    let _var$12;
                                    while ($1438._ === 'List.cons') {
                                        _var$12 = $1438.head;
                                        var $1437 = Fm$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1439 = self.eras;
                                                    var $1440 = self.name;
                                                    var $1441 = self.term;
                                                    var $1442 = $1441;
                                                    return $1442;
                                            };
                                        })());
                                        _ret$13 = $1437;
                                        $1438 = $1438.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($1427, List$cons$(Fm$Name$read$("."), List$cons$($1432, List$nil))));
                                var _slf$14 = Fm$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $1444 = _slf$14;
                                    var $1445 = $1428;
                                    let _slf$16 = $1444;
                                    let _var$15;
                                    while ($1445._ === 'List.cons') {
                                        _var$15 = $1445.head;
                                        var $1444 = Fm$Term$app$(_slf$16, Fm$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1446 = self.eras;
                                                    var $1447 = self.name;
                                                    var $1448 = self.term;
                                                    var $1449 = $1447;
                                                    return $1449;
                                            };
                                        })()));
                                        _slf$16 = $1444;
                                        $1445 = $1445.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $1451 = _slf$15;
                                    var $1452 = $1433;
                                    let _slf$17 = $1451;
                                    let _var$16;
                                    while ($1452._ === 'List.cons') {
                                        _var$16 = $1452.head;
                                        var $1451 = Fm$Term$app$(_slf$17, Fm$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1453 = self.eras;
                                                    var $1454 = self.name;
                                                    var $1455 = self.term;
                                                    var $1456 = $1454;
                                                    return $1456;
                                            };
                                        })()));
                                        _slf$17 = $1451;
                                        $1452 = $1452.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $1435 = Fm$Term$app$(_ret$12, _slf$16);
                                var $1431 = $1435;
                                break;
                        };
                        var $1426 = $1431;
                        break;
                };
                var $1425 = $1426;
                break;
            case 'List.cons':
                var $1457 = self.head;
                var $1458 = self.tail;
                var self = $1457;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1460 = self.eras;
                        var $1461 = self.name;
                        var $1462 = self.term;
                        var _eras$9 = $1460;
                        var _name$10 = $1461;
                        var _xtyp$11 = $1462;
                        var _body$12 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1458);
                        var $1463 = Fm$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $1464 = _body$12;
                            return $1464;
                        }));
                        var $1459 = $1463;
                        break;
                };
                var $1425 = $1459;
                break;
        };
        return $1425;
    };
    const Fm$Datatype$build_term$constructor$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Fm.Constructor.new':
                var $1466 = self.name;
                var $1467 = self.args;
                var $1468 = self.inds;
                var $1469 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1467);
                var $1465 = $1469;
                break;
        };
        return $1465;
    };
    const Fm$Datatype$build_term$constructor = x0 => x1 => Fm$Datatype$build_term$constructor$(x0, x1);

    function Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1472 = self.name;
                        var $1473 = self.pars;
                        var $1474 = self.inds;
                        var $1475 = self.ctrs;
                        var _ret$8 = Fm$Term$ref$(Fm$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $1478 = _ret$8;
                            var $1479 = $1474;
                            let _ret$10 = $1478;
                            let _var$9;
                            while ($1479._ === 'List.cons') {
                                _var$9 = $1479.head;
                                var $1478 = Fm$Term$app$(_ret$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1480 = self.eras;
                                            var $1481 = self.name;
                                            var $1482 = self.term;
                                            var $1483 = $1481;
                                            return $1483;
                                    };
                                })()));
                                _ret$10 = $1478;
                                $1479 = $1479.tail;
                            }
                            return _ret$10;
                        })();
                        var $1476 = Fm$Term$app$(_ret$9, Fm$Term$ref$((_name$2 + ".Self")));
                        var $1471 = $1476;
                        break;
                };
                var $1470 = $1471;
                break;
            case 'List.cons':
                var $1484 = self.head;
                var $1485 = self.tail;
                var self = $1484;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1487 = self.name;
                        var $1488 = self.args;
                        var $1489 = self.inds;
                        var $1490 = Fm$Term$all$(Bool$false, "", $1487, Fm$Datatype$build_term$constructor$(_type$1, $1484), (_s$9 => _x$10 => {
                            var $1491 = Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, $1485);
                            return $1491;
                        }));
                        var $1486 = $1490;
                        break;
                };
                var $1470 = $1486;
                break;
        };
        return $1470;
    };
    const Fm$Datatype$build_term$constructors$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1493 = self.name;
                var $1494 = self.pars;
                var $1495 = self.inds;
                var $1496 = self.ctrs;
                var $1497 = Fm$Datatype$build_term$constructors$go$(_type$1, $1493, $1496);
                var $1492 = $1497;
                break;
        };
        return $1492;
    };
    const Fm$Datatype$build_term$constructors = x0 => Fm$Datatype$build_term$constructors$(x0);

    function Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1500 = Fm$Term$all$(Bool$true, (_name$2 + ".Self"), Fm$Name$read$("P"), Fm$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $1501 = Fm$Datatype$build_term$constructors$(_type$1);
                            return $1501;
                        }));
                        var $1499 = $1500;
                        break;
                    case 'List.cons':
                        var $1502 = self.head;
                        var $1503 = self.tail;
                        var self = $1502;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1505 = self.eras;
                                var $1506 = self.name;
                                var $1507 = self.term;
                                var $1508 = Fm$Term$lam$($1506, (_x$10 => {
                                    var $1509 = Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $1503);
                                    return $1509;
                                }));
                                var $1504 = $1508;
                                break;
                        };
                        var $1499 = $1504;
                        break;
                };
                var $1498 = $1499;
                break;
            case 'List.cons':
                var $1510 = self.head;
                var $1511 = self.tail;
                var self = $1510;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1513 = self.eras;
                        var $1514 = self.name;
                        var $1515 = self.term;
                        var $1516 = Fm$Term$lam$($1514, (_x$10 => {
                            var $1517 = Fm$Datatype$build_term$go$(_type$1, _name$2, $1511, _inds$4);
                            return $1517;
                        }));
                        var $1512 = $1516;
                        break;
                };
                var $1498 = $1512;
                break;
        };
        return $1498;
    };
    const Fm$Datatype$build_term$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_term$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1519 = self.name;
                var $1520 = self.pars;
                var $1521 = self.inds;
                var $1522 = self.ctrs;
                var $1523 = Fm$Datatype$build_term$go$(_type$1, $1519, $1520, $1521);
                var $1518 = $1523;
                break;
        };
        return $1518;
    };
    const Fm$Datatype$build_term = x0 => Fm$Datatype$build_term$(x0);

    function Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1526 = Fm$Term$typ;
                        var $1525 = $1526;
                        break;
                    case 'List.cons':
                        var $1527 = self.head;
                        var $1528 = self.tail;
                        var self = $1527;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1530 = self.eras;
                                var $1531 = self.name;
                                var $1532 = self.term;
                                var $1533 = Fm$Term$all$(Bool$false, "", $1531, $1532, (_s$10 => _x$11 => {
                                    var $1534 = Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $1528);
                                    return $1534;
                                }));
                                var $1529 = $1533;
                                break;
                        };
                        var $1525 = $1529;
                        break;
                };
                var $1524 = $1525;
                break;
            case 'List.cons':
                var $1535 = self.head;
                var $1536 = self.tail;
                var self = $1535;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1538 = self.eras;
                        var $1539 = self.name;
                        var $1540 = self.term;
                        var $1541 = Fm$Term$all$(Bool$false, "", $1539, $1540, (_s$10 => _x$11 => {
                            var $1542 = Fm$Datatype$build_type$go$(_type$1, _name$2, $1536, _inds$4);
                            return $1542;
                        }));
                        var $1537 = $1541;
                        break;
                };
                var $1524 = $1537;
                break;
        };
        return $1524;
    };
    const Fm$Datatype$build_type$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_type$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1544 = self.name;
                var $1545 = self.pars;
                var $1546 = self.inds;
                var $1547 = self.ctrs;
                var $1548 = Fm$Datatype$build_type$go$(_type$1, $1544, $1545, $1546);
                var $1543 = $1548;
                break;
        };
        return $1543;
    };
    const Fm$Datatype$build_type = x0 => Fm$Datatype$build_type$(x0);

    function Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1551 = self.name;
                        var $1552 = self.args;
                        var $1553 = self.inds;
                        var _ret$7 = Fm$Term$ref$($1551);
                        var _ret$8 = (() => {
                            var $1556 = _ret$7;
                            var $1557 = $1552;
                            let _ret$9 = $1556;
                            let _arg$8;
                            while ($1557._ === 'List.cons') {
                                _arg$8 = $1557.head;
                                var $1556 = Fm$Term$app$(_ret$9, Fm$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1558 = self.eras;
                                            var $1559 = self.name;
                                            var $1560 = self.term;
                                            var $1561 = $1559;
                                            return $1561;
                                    };
                                })()));
                                _ret$9 = $1556;
                                $1557 = $1557.tail;
                            }
                            return _ret$9;
                        })();
                        var $1554 = _ret$8;
                        var $1550 = $1554;
                        break;
                };
                var $1549 = $1550;
                break;
            case 'List.cons':
                var $1562 = self.head;
                var $1563 = self.tail;
                var self = $1562;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1565 = self.name;
                        var $1566 = self.args;
                        var $1567 = self.inds;
                        var $1568 = Fm$Term$lam$($1565, (_x$9 => {
                            var $1569 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1563);
                            return $1569;
                        }));
                        var $1564 = $1568;
                        break;
                };
                var $1549 = $1564;
                break;
        };
        return $1549;
    };
    const Fm$Constructor$build_term$opt$go = x0 => x1 => x2 => Fm$Constructor$build_term$opt$go$(x0, x1, x2);

    function Fm$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1571 = self.name;
                var $1572 = self.pars;
                var $1573 = self.inds;
                var $1574 = self.ctrs;
                var $1575 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1574);
                var $1570 = $1575;
                break;
        };
        return $1570;
    };
    const Fm$Constructor$build_term$opt = x0 => x1 => Fm$Constructor$build_term$opt$(x0, x1);

    function Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.nil':
                        var $1578 = Fm$Term$lam$(Fm$Name$read$("P"), (_x$6 => {
                            var $1579 = Fm$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $1579;
                        }));
                        var $1577 = $1578;
                        break;
                    case 'List.cons':
                        var $1580 = self.head;
                        var $1581 = self.tail;
                        var self = $1580;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1583 = self.eras;
                                var $1584 = self.name;
                                var $1585 = self.term;
                                var $1586 = Fm$Term$lam$($1584, (_x$11 => {
                                    var $1587 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $1581);
                                    return $1587;
                                }));
                                var $1582 = $1586;
                                break;
                        };
                        var $1577 = $1582;
                        break;
                };
                var $1576 = $1577;
                break;
            case 'List.cons':
                var $1588 = self.head;
                var $1589 = self.tail;
                var self = $1588;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1591 = self.eras;
                        var $1592 = self.name;
                        var $1593 = self.term;
                        var $1594 = Fm$Term$lam$($1592, (_x$11 => {
                            var $1595 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $1589, _args$5);
                            return $1595;
                        }));
                        var $1590 = $1594;
                        break;
                };
                var $1576 = $1590;
                break;
        };
        return $1576;
    };
    const Fm$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1597 = self.name;
                var $1598 = self.pars;
                var $1599 = self.inds;
                var $1600 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1602 = self.name;
                        var $1603 = self.args;
                        var $1604 = self.inds;
                        var $1605 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, $1597, $1598, $1603);
                        var $1601 = $1605;
                        break;
                };
                var $1596 = $1601;
                break;
        };
        return $1596;
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
                                var $1609 = self.name;
                                var $1610 = self.pars;
                                var $1611 = self.inds;
                                var $1612 = self.ctrs;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Fm.Constructor.new':
                                        var $1614 = self.name;
                                        var $1615 = self.args;
                                        var $1616 = self.inds;
                                        var _type$13 = Fm$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $1619 = _type$13;
                                            var $1620 = $1610;
                                            let _type$15 = $1619;
                                            let _var$14;
                                            while ($1620._ === 'List.cons') {
                                                _var$14 = $1620.head;
                                                var $1619 = Fm$Term$app$(_type$15, Fm$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1621 = self.eras;
                                                            var $1622 = self.name;
                                                            var $1623 = self.term;
                                                            var $1624 = $1622;
                                                            return $1624;
                                                    };
                                                })()));
                                                _type$15 = $1619;
                                                $1620 = $1620.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $1626 = _type$14;
                                            var $1627 = $1616;
                                            let _type$16 = $1626;
                                            let _var$15;
                                            while ($1627._ === 'List.cons') {
                                                _var$15 = $1627.head;
                                                var $1626 = Fm$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1628 = self.eras;
                                                            var $1629 = self.name;
                                                            var $1630 = self.term;
                                                            var $1631 = $1630;
                                                            return $1631;
                                                    };
                                                })());
                                                _type$16 = $1626;
                                                $1627 = $1627.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $1617 = _type$15;
                                        var $1613 = $1617;
                                        break;
                                };
                                var $1608 = $1613;
                                break;
                        };
                        var $1607 = $1608;
                        break;
                    case 'List.cons':
                        var $1632 = self.head;
                        var $1633 = self.tail;
                        var self = $1632;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1635 = self.eras;
                                var $1636 = self.name;
                                var $1637 = self.term;
                                var $1638 = Fm$Term$all$($1635, "", $1636, $1637, (_s$11 => _x$12 => {
                                    var $1639 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $1633);
                                    return $1639;
                                }));
                                var $1634 = $1638;
                                break;
                        };
                        var $1607 = $1634;
                        break;
                };
                var $1606 = $1607;
                break;
            case 'List.cons':
                var $1640 = self.head;
                var $1641 = self.tail;
                var self = $1640;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1643 = self.eras;
                        var $1644 = self.name;
                        var $1645 = self.term;
                        var $1646 = Fm$Term$all$($1643, "", $1644, $1645, (_s$11 => _x$12 => {
                            var $1647 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $1641, _args$5);
                            return $1647;
                        }));
                        var $1642 = $1646;
                        break;
                };
                var $1606 = $1642;
                break;
        };
        return $1606;
    };
    const Fm$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1649 = self.name;
                var $1650 = self.pars;
                var $1651 = self.inds;
                var $1652 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1654 = self.name;
                        var $1655 = self.args;
                        var $1656 = self.inds;
                        var $1657 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, $1649, $1650, $1655);
                        var $1653 = $1657;
                        break;
                };
                var $1648 = $1653;
                break;
        };
        return $1648;
    };
    const Fm$Constructor$build_type = x0 => x1 => Fm$Constructor$build_type$(x0, x1);

    function Fm$Parser$file$adt$(_file$1, _code$2, _defs$3) {
        var $1658 = Monad$bind$(Parser$monad)(Fm$Parser$datatype)((_adt$4 => {
            var self = _adt$4;
            switch (self._) {
                case 'Fm.Datatype.new':
                    var $1660 = self.name;
                    var $1661 = self.pars;
                    var $1662 = self.inds;
                    var $1663 = self.ctrs;
                    var _term$9 = Fm$Datatype$build_term$(_adt$4);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $1665 = (_x$10 + '1');
                        return $1665;
                    }), _term$9);
                    var _type$11 = Fm$Datatype$build_type$(_adt$4);
                    var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                        var $1666 = (_x$12 + '0');
                        return $1666;
                    }), _type$11);
                    var _defs$13 = Fm$define$(_file$1, _code$2, $1660, _term$10, _type$12, Bool$false, _defs$3);
                    var _defs$14 = List$fold$($1663, _defs$13, (_ctr$14 => _defs$15 => {
                        var _typ_name$16 = $1660;
                        var _ctr_name$17 = String$flatten$(List$cons$(_typ_name$16, List$cons$(Fm$Name$read$("."), List$cons$((() => {
                            var self = _ctr$14;
                            switch (self._) {
                                case 'Fm.Constructor.new':
                                    var $1668 = self.name;
                                    var $1669 = self.args;
                                    var $1670 = self.inds;
                                    var $1671 = $1668;
                                    return $1671;
                            };
                        })(), List$nil))));
                        var _ctr_term$18 = Fm$Constructor$build_term$(_adt$4, _ctr$14);
                        var _ctr_term$19 = Fm$Term$bind$(List$nil, (_x$19 => {
                            var $1672 = (_x$19 + '1');
                            return $1672;
                        }), _ctr_term$18);
                        var _ctr_type$20 = Fm$Constructor$build_type$(_adt$4, _ctr$14);
                        var _ctr_type$21 = Fm$Term$bind$(List$nil, (_x$21 => {
                            var $1673 = (_x$21 + '0');
                            return $1673;
                        }), _ctr_type$20);
                        var $1667 = Fm$define$(_file$1, _code$2, _ctr_name$17, _ctr_term$19, _ctr_type$21, Bool$false, _defs$15);
                        return $1667;
                    }));
                    var $1664 = Monad$pure$(Parser$monad)(_defs$14);
                    var $1659 = $1664;
                    break;
            };
            return $1659;
        }));
        return $1658;
    };
    const Fm$Parser$file$adt = x0 => x1 => x2 => Fm$Parser$file$adt$(x0, x1, x2);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $1675 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $1674 = $1675;
        } else {
            var $1676 = self.charCodeAt(0);
            var $1677 = self.slice(1);
            var $1678 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $1674 = $1678;
        };
        return $1674;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Fm$Parser$file$end$(_file$1, _code$2, _defs$3) {
        var $1679 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$4 => {
            var $1680 = Monad$bind$(Parser$monad)(Parser$eof)((_$5 => {
                var $1681 = Monad$pure$(Parser$monad)(_defs$3);
                return $1681;
            }));
            return $1680;
        }));
        return $1679;
    };
    const Fm$Parser$file$end = x0 => x1 => x2 => Fm$Parser$file$end$(x0, x1, x2);

    function Fm$Parser$file$(_file$1, _code$2, _defs$3) {
        var $1682 = Monad$bind$(Parser$monad)(Parser$is_eof)((_stop$4 => {
            var self = _stop$4;
            if (self) {
                var $1684 = Monad$pure$(Parser$monad)(_defs$3);
                var $1683 = $1684;
            } else {
                var $1685 = Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$("#"))((_$5 => {
                    var $1686 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_file$6 => {
                        var $1687 = Fm$Parser$file$(_file$6, _code$2, _defs$3);
                        return $1687;
                    }));
                    return $1686;
                })), List$cons$(Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$file$def$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$adt$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$end$(_file$1, _code$2, _defs$3), List$nil)))))((_defs$5 => {
                    var $1688 = Fm$Parser$file$(_file$1, _code$2, _defs$5);
                    return $1688;
                })), List$nil)));
                var $1683 = $1685;
            };
            return $1683;
        }));
        return $1682;
    };
    const Fm$Parser$file = x0 => x1 => x2 => Fm$Parser$file$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $1689 = null;
        return $1689;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $1691 = "";
                var $1690 = $1691;
                break;
            case 'List.cons':
                var $1692 = self.head;
                var $1693 = self.tail;
                var $1694 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $1695 = "";
                        return $1695;
                    } else {
                        var $1696 = _sep$1;
                        return $1696;
                    };
                })(), List$cons$($1692, List$cons$(String$join$go$(_sep$1, $1693, Bool$false), List$nil))));
                var $1690 = $1694;
                break;
        };
        return $1690;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $1697 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $1697;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Fm$highlight$end$(_col$1, _row$2, _res$3) {
        var $1698 = String$join$("\u{a}", _res$3);
        return $1698;
    };
    const Fm$highlight$end = x0 => x1 => x2 => Fm$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1700 = _a$4;
                var $1699 = $1700;
                break;
            case 'Maybe.some':
                var $1701 = self.value;
                var $1702 = _f$5($1701);
                var $1699 = $1702;
                break;
        };
        return $1699;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1704 = Bool$true;
            var $1703 = $1704;
        } else {
            var $1705 = (self - 1n);
            var $1706 = Bool$false;
            var $1703 = $1706;
        };
        return $1703;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1708 = Nat$zero;
            var $1707 = $1708;
        } else {
            var $1709 = (self - 1n);
            var $1710 = Nat$succ$(Nat$succ$(Nat$double$($1709)));
            var $1707 = $1710;
        };
        return $1707;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1712 = Nat$zero;
            var $1711 = $1712;
        } else {
            var $1713 = (self - 1n);
            var $1714 = $1713;
            var $1711 = $1714;
        };
        return $1711;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.nil':
                var $1716 = List$nil;
                var $1715 = $1716;
                break;
            case 'List.cons':
                var $1717 = self.head;
                var $1718 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $1720 = List$nil;
                    var $1719 = $1720;
                } else {
                    var $1721 = (self - 1n);
                    var $1722 = List$cons$($1717, List$take$($1721, $1718));
                    var $1719 = $1722;
                };
                var $1715 = $1719;
                break;
        };
        return $1715;
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
                    var $1723 = _res$2;
                    return $1723;
                } else {
                    var $1724 = self.charCodeAt(0);
                    var $1725 = self.slice(1);
                    var $1726 = String$reverse$go$($1725, String$cons$($1724, _res$2));
                    return $1726;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1727 = String$reverse$go$(_xs$1, String$nil);
        return $1727;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $1729 = _str$3;
            var $1728 = $1729;
        } else {
            var $1730 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $1732 = String$cons$(_chr$2, String$pad_right$($1730, _chr$2, ""));
                var $1731 = $1732;
            } else {
                var $1733 = self.charCodeAt(0);
                var $1734 = self.slice(1);
                var $1735 = String$cons$($1733, String$pad_right$($1730, _chr$2, $1734));
                var $1731 = $1735;
            };
            var $1728 = $1731;
        };
        return $1728;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $1736 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $1736;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $1737 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $1737;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $1738 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $1738;
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
                    var $1739 = Either$left$(_n$1);
                    return $1739;
                } else {
                    var $1740 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1742 = Either$right$(Nat$succ$($1740));
                        var $1741 = $1742;
                    } else {
                        var $1743 = (self - 1n);
                        var $1744 = Nat$sub_rem$($1743, $1740);
                        var $1741 = $1744;
                    };
                    return $1741;
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
                        var $1745 = self.value;
                        var $1746 = Nat$div_mod$go$($1745, _m$2, Nat$succ$(_d$3));
                        return $1746;
                    case 'Either.right':
                        var $1747 = self.value;
                        var $1748 = Pair$new$(_d$3, _n$1);
                        return $1748;
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
                        var $1749 = self.fst;
                        var $1750 = self.snd;
                        var self = $1749;
                        if (self === 0n) {
                            var $1752 = List$cons$($1750, _res$3);
                            var $1751 = $1752;
                        } else {
                            var $1753 = (self - 1n);
                            var $1754 = Nat$to_base$go$(_base$1, $1749, List$cons$($1750, _res$3));
                            var $1751 = $1754;
                        };
                        return $1751;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $1755 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $1755;
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
                    var $1756 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $1756;
                } else {
                    var $1757 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1759 = _r$3;
                        var $1758 = $1759;
                    } else {
                        var $1760 = (self - 1n);
                        var $1761 = Nat$mod$go$($1760, $1757, Nat$succ$(_r$3));
                        var $1758 = $1761;
                    };
                    return $1758;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $1762 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $1762;
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
                    var $1765 = 35;
                    var $1764 = $1765;
                    break;
                case 'Maybe.some':
                    var $1766 = self.value;
                    var $1767 = $1766;
                    var $1764 = $1767;
                    break;
            };
            var $1763 = $1764;
        } else {
            var $1768 = 35;
            var $1763 = $1768;
        };
        return $1763;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $1769 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $1770 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $1770;
        }));
        return $1769;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $1771 = Nat$to_string_base$(10n, _n$1);
        return $1771;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Fm$color$(_col$1, _str$2) {
        var $1772 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $1772;
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
                    var $1773 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    return $1773;
                } else {
                    var $1774 = self.charCodeAt(0);
                    var $1775 = self.slice(1);
                    var self = ($1774 === 10);
                    if (self) {
                        var _stp$11 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$11;
                        if (self) {
                            var $1778 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $1777 = $1778;
                        } else {
                            var _spa$12 = 3n;
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$12));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $1781 = Maybe$some$(_spa$12);
                                        var $1780 = $1781;
                                        break;
                                    case 'Maybe.some':
                                        var $1782 = self.value;
                                        var $1783 = Maybe$some$(Nat$pred$($1782));
                                        var $1780 = $1783;
                                        break;
                                };
                                var _lft$14 = $1780;
                            } else {
                                var $1784 = (self - 1n);
                                var $1785 = _lft$6;
                                var _lft$14 = $1785;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$take$(_siz$13, List$cons$(String$reverse$(_lin$7), _res$8));
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $1779 = Fm$highlight$tc$($1775, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $1777 = $1779;
                        };
                        var $1776 = $1777;
                    } else {
                        var _chr$11 = String$cons$($1774, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $1787 = String$reverse$(Fm$color$("31", Fm$color$("4", _chr$11)));
                            var _chr$12 = $1787;
                        } else {
                            var $1788 = _chr$11;
                            var _chr$12 = $1788;
                        };
                        var _ix0$13 = Nat$pred$(_ix0$2);
                        var _ix1$14 = Nat$pred$(_ix1$3);
                        var _col$15 = Nat$succ$(_col$4);
                        var _lin$16 = String$flatten$(List$cons$(_chr$12, List$cons$(_lin$7, List$nil)));
                        var $1786 = Fm$highlight$tc$($1775, _ix0$13, _ix1$14, _col$15, _row$5, _lft$6, _lin$16, _res$8);
                        var $1776 = $1786;
                    };
                    return $1776;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $1789 = Fm$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $1789;
    };
    const Fm$highlight = x0 => x1 => x2 => Fm$highlight$(x0, x1, x2);

    function Fm$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Fm$Parser$file$(_file$1, _code$2, _defs$3)(0n)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1791 = self.idx;
                var $1792 = self.code;
                var $1793 = self.err;
                var _err$7 = $1793;
                var _hig$8 = Fm$highlight$(_code$2, $1791, Nat$succ$($1791));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $1794 = Either$left$(_str$9);
                var $1790 = $1794;
                break;
            case 'Parser.Reply.value':
                var $1795 = self.idx;
                var $1796 = self.code;
                var $1797 = self.val;
                var $1798 = Either$right$($1797);
                var $1790 = $1798;
                break;
        };
        return $1790;
    };
    const Fm$Defs$read = x0 => x1 => x2 => Fm$Defs$read$(x0, x1, x2);

    function Fm$Synth$load$(_name$1, _defs$2) {
        var _file$3 = Fm$Synth$file_of$(_name$1);
        var $1799 = Monad$bind$(IO$monad)(IO$get_file$(_file$3))((_code$4 => {
            var _read$5 = Fm$Defs$read$(_file$3, _code$4, _defs$2);
            var self = _read$5;
            switch (self._) {
                case 'Either.left':
                    var $1801 = self.value;
                    var $1802 = Monad$pure$(IO$monad)(Maybe$none);
                    var $1800 = $1802;
                    break;
                case 'Either.right':
                    var $1803 = self.value;
                    var _defs$7 = $1803;
                    var self = Fm$get$(_name$1, _defs$7);
                    switch (self._) {
                        case 'Maybe.none':
                            var $1805 = Monad$pure$(IO$monad)(Maybe$none);
                            var $1804 = $1805;
                            break;
                        case 'Maybe.some':
                            var $1806 = self.value;
                            var $1807 = Monad$pure$(IO$monad)(Maybe$some$(_defs$7));
                            var $1804 = $1807;
                            break;
                    };
                    var $1800 = $1804;
                    break;
            };
            return $1800;
        }));
        return $1799;
    };
    const Fm$Synth$load = x0 => x1 => Fm$Synth$load$(x0, x1);

    function IO$print$(_text$1) {
        var $1808 = IO$ask$("print", _text$1, (_skip$2 => {
            var $1809 = IO$end$(Unit$new);
            return $1809;
        }));
        return $1808;
    };
    const IO$print = x0 => IO$print$(x0);
    const Fm$Status$wait = ({
        _: 'Fm.Status.wait'
    });

    function Fm$Check$(_V$1) {
        var $1810 = null;
        return $1810;
    };
    const Fm$Check = x0 => Fm$Check$(x0);

    function Fm$Check$result$(_value$2, _errors$3) {
        var $1811 = ({
            _: 'Fm.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $1811;
    };
    const Fm$Check$result = x0 => x1 => Fm$Check$result$(x0, x1);

    function Fm$Check$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'Fm.Check.result':
                var $1813 = self.value;
                var $1814 = self.errors;
                var self = $1813;
                switch (self._) {
                    case 'Maybe.none':
                        var $1816 = Fm$Check$result$(Maybe$none, $1814);
                        var $1815 = $1816;
                        break;
                    case 'Maybe.some':
                        var $1817 = self.value;
                        var self = _f$4($1817);
                        switch (self._) {
                            case 'Fm.Check.result':
                                var $1819 = self.value;
                                var $1820 = self.errors;
                                var $1821 = Fm$Check$result$($1819, List$concat$($1814, $1820));
                                var $1818 = $1821;
                                break;
                        };
                        var $1815 = $1818;
                        break;
                };
                var $1812 = $1815;
                break;
        };
        return $1812;
    };
    const Fm$Check$bind = x0 => x1 => Fm$Check$bind$(x0, x1);

    function Fm$Check$pure$(_value$2) {
        var $1822 = Fm$Check$result$(Maybe$some$(_value$2), List$nil);
        return $1822;
    };
    const Fm$Check$pure = x0 => Fm$Check$pure$(x0);
    const Fm$Check$monad = Monad$new$(Fm$Check$bind, Fm$Check$pure);

    function Fm$Error$undefined_reference$(_origin$1, _name$2) {
        var $1823 = ({
            _: 'Fm.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $1823;
    };
    const Fm$Error$undefined_reference = x0 => x1 => Fm$Error$undefined_reference$(x0, x1);

    function Fm$Error$waiting$(_name$1) {
        var $1824 = ({
            _: 'Fm.Error.waiting',
            'name': _name$1
        });
        return $1824;
    };
    const Fm$Error$waiting = x0 => Fm$Error$waiting$(x0);

    function Fm$Error$indirect$(_name$1) {
        var $1825 = ({
            _: 'Fm.Error.indirect',
            'name': _name$1
        });
        return $1825;
    };
    const Fm$Error$indirect = x0 => Fm$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1827 = Maybe$none;
                var $1826 = $1827;
                break;
            case 'Maybe.some':
                var $1828 = self.value;
                var $1829 = Maybe$some$(_f$4($1828));
                var $1826 = $1829;
                break;
        };
        return $1826;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Fm$MPath$o$(_path$1) {
        var $1830 = Maybe$mapped$(_path$1, Fm$Path$o);
        return $1830;
    };
    const Fm$MPath$o = x0 => Fm$MPath$o$(x0);

    function Fm$MPath$i$(_path$1) {
        var $1831 = Maybe$mapped$(_path$1, Fm$Path$i);
        return $1831;
    };
    const Fm$MPath$i = x0 => Fm$MPath$i$(x0);

    function Fm$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $1832 = ({
            _: 'Fm.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $1832;
    };
    const Fm$Error$cant_infer = x0 => x1 => x2 => Fm$Error$cant_infer$(x0, x1, x2);

    function Fm$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $1833 = ({
            _: 'Fm.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $1833;
    };
    const Fm$Error$type_mismatch = x0 => x1 => x2 => x3 => Fm$Error$type_mismatch$(x0, x1, x2, x3);

    function Fm$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $1834 = ({
            _: 'Fm.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $1834;
    };
    const Fm$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Fm$Error$show_goal$(x0, x1, x2, x3, x4);

    function Fm$Term$normalize$(_term$1, _defs$2) {
        var self = Fm$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $1836 = self.name;
                var $1837 = self.indx;
                var $1838 = Fm$Term$var$($1836, $1837);
                var $1835 = $1838;
                break;
            case 'Fm.Term.ref':
                var $1839 = self.name;
                var $1840 = Fm$Term$ref$($1839);
                var $1835 = $1840;
                break;
            case 'Fm.Term.typ':
                var $1841 = Fm$Term$typ;
                var $1835 = $1841;
                break;
            case 'Fm.Term.all':
                var $1842 = self.eras;
                var $1843 = self.self;
                var $1844 = self.name;
                var $1845 = self.xtyp;
                var $1846 = self.body;
                var $1847 = Fm$Term$all$($1842, $1843, $1844, Fm$Term$normalize$($1845, _defs$2), (_s$8 => _x$9 => {
                    var $1848 = Fm$Term$normalize$($1846(_s$8)(_x$9), _defs$2);
                    return $1848;
                }));
                var $1835 = $1847;
                break;
            case 'Fm.Term.lam':
                var $1849 = self.name;
                var $1850 = self.body;
                var $1851 = Fm$Term$lam$($1849, (_x$5 => {
                    var $1852 = Fm$Term$normalize$($1850(_x$5), _defs$2);
                    return $1852;
                }));
                var $1835 = $1851;
                break;
            case 'Fm.Term.app':
                var $1853 = self.func;
                var $1854 = self.argm;
                var $1855 = Fm$Term$app$(Fm$Term$normalize$($1853, _defs$2), Fm$Term$normalize$($1854, _defs$2));
                var $1835 = $1855;
                break;
            case 'Fm.Term.let':
                var $1856 = self.name;
                var $1857 = self.expr;
                var $1858 = self.body;
                var $1859 = Fm$Term$let$($1856, Fm$Term$normalize$($1857, _defs$2), (_x$6 => {
                    var $1860 = Fm$Term$normalize$($1858(_x$6), _defs$2);
                    return $1860;
                }));
                var $1835 = $1859;
                break;
            case 'Fm.Term.def':
                var $1861 = self.name;
                var $1862 = self.expr;
                var $1863 = self.body;
                var $1864 = Fm$Term$def$($1861, Fm$Term$normalize$($1862, _defs$2), (_x$6 => {
                    var $1865 = Fm$Term$normalize$($1863(_x$6), _defs$2);
                    return $1865;
                }));
                var $1835 = $1864;
                break;
            case 'Fm.Term.ann':
                var $1866 = self.done;
                var $1867 = self.term;
                var $1868 = self.type;
                var $1869 = Fm$Term$ann$($1866, Fm$Term$normalize$($1867, _defs$2), Fm$Term$normalize$($1868, _defs$2));
                var $1835 = $1869;
                break;
            case 'Fm.Term.gol':
                var $1870 = self.name;
                var $1871 = self.dref;
                var $1872 = self.verb;
                var $1873 = Fm$Term$gol$($1870, $1871, $1872);
                var $1835 = $1873;
                break;
            case 'Fm.Term.hol':
                var $1874 = self.path;
                var $1875 = Fm$Term$hol$($1874);
                var $1835 = $1875;
                break;
            case 'Fm.Term.nat':
                var $1876 = self.natx;
                var $1877 = Fm$Term$nat$($1876);
                var $1835 = $1877;
                break;
            case 'Fm.Term.chr':
                var $1878 = self.chrx;
                var $1879 = Fm$Term$chr$($1878);
                var $1835 = $1879;
                break;
            case 'Fm.Term.str':
                var $1880 = self.strx;
                var $1881 = Fm$Term$str$($1880);
                var $1835 = $1881;
                break;
            case 'Fm.Term.cse':
                var $1882 = self.path;
                var $1883 = self.expr;
                var $1884 = self.name;
                var $1885 = self.with;
                var $1886 = self.cses;
                var $1887 = self.moti;
                var $1888 = _term$1;
                var $1835 = $1888;
                break;
            case 'Fm.Term.ori':
                var $1889 = self.orig;
                var $1890 = self.expr;
                var $1891 = Fm$Term$normalize$($1890, _defs$2);
                var $1835 = $1891;
                break;
        };
        return $1835;
    };
    const Fm$Term$normalize = x0 => x1 => Fm$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1893 = List$nil;
                var $1892 = $1893;
                break;
            case 'List.cons':
                var $1894 = self.head;
                var $1895 = self.tail;
                var $1896 = $1895;
                var $1892 = $1896;
                break;
        };
        return $1892;
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
                        var $1897 = self.name;
                        var $1898 = self.indx;
                        var $1899 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1899;
                    case 'Fm.Term.ref':
                        var $1900 = self.name;
                        var $1901 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1901;
                    case 'Fm.Term.typ':
                        var $1902 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1902;
                    case 'Fm.Term.all':
                        var $1903 = self.eras;
                        var $1904 = self.self;
                        var $1905 = self.name;
                        var $1906 = self.xtyp;
                        var $1907 = self.body;
                        var $1908 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1908;
                    case 'Fm.Term.lam':
                        var $1909 = self.name;
                        var $1910 = self.body;
                        var $1911 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1911;
                    case 'Fm.Term.app':
                        var $1912 = self.func;
                        var $1913 = self.argm;
                        var $1914 = Fm$SmartMotive$vals$cont$(_expr$1, $1912, List$cons$($1913, _args$3), _defs$4);
                        return $1914;
                    case 'Fm.Term.let':
                        var $1915 = self.name;
                        var $1916 = self.expr;
                        var $1917 = self.body;
                        var $1918 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1918;
                    case 'Fm.Term.def':
                        var $1919 = self.name;
                        var $1920 = self.expr;
                        var $1921 = self.body;
                        var $1922 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1922;
                    case 'Fm.Term.ann':
                        var $1923 = self.done;
                        var $1924 = self.term;
                        var $1925 = self.type;
                        var $1926 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1926;
                    case 'Fm.Term.gol':
                        var $1927 = self.name;
                        var $1928 = self.dref;
                        var $1929 = self.verb;
                        var $1930 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1930;
                    case 'Fm.Term.hol':
                        var $1931 = self.path;
                        var $1932 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1932;
                    case 'Fm.Term.nat':
                        var $1933 = self.natx;
                        var $1934 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1934;
                    case 'Fm.Term.chr':
                        var $1935 = self.chrx;
                        var $1936 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1936;
                    case 'Fm.Term.str':
                        var $1937 = self.strx;
                        var $1938 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1938;
                    case 'Fm.Term.cse':
                        var $1939 = self.path;
                        var $1940 = self.expr;
                        var $1941 = self.name;
                        var $1942 = self.with;
                        var $1943 = self.cses;
                        var $1944 = self.moti;
                        var $1945 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1945;
                    case 'Fm.Term.ori':
                        var $1946 = self.orig;
                        var $1947 = self.expr;
                        var $1948 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1948;
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
                        var $1949 = self.name;
                        var $1950 = self.indx;
                        var $1951 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1951;
                    case 'Fm.Term.ref':
                        var $1952 = self.name;
                        var $1953 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1953;
                    case 'Fm.Term.typ':
                        var $1954 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1954;
                    case 'Fm.Term.all':
                        var $1955 = self.eras;
                        var $1956 = self.self;
                        var $1957 = self.name;
                        var $1958 = self.xtyp;
                        var $1959 = self.body;
                        var $1960 = Fm$SmartMotive$vals$(_expr$1, $1959(Fm$Term$typ)(Fm$Term$typ), _defs$3);
                        return $1960;
                    case 'Fm.Term.lam':
                        var $1961 = self.name;
                        var $1962 = self.body;
                        var $1963 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1963;
                    case 'Fm.Term.app':
                        var $1964 = self.func;
                        var $1965 = self.argm;
                        var $1966 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1966;
                    case 'Fm.Term.let':
                        var $1967 = self.name;
                        var $1968 = self.expr;
                        var $1969 = self.body;
                        var $1970 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1970;
                    case 'Fm.Term.def':
                        var $1971 = self.name;
                        var $1972 = self.expr;
                        var $1973 = self.body;
                        var $1974 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1974;
                    case 'Fm.Term.ann':
                        var $1975 = self.done;
                        var $1976 = self.term;
                        var $1977 = self.type;
                        var $1978 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1978;
                    case 'Fm.Term.gol':
                        var $1979 = self.name;
                        var $1980 = self.dref;
                        var $1981 = self.verb;
                        var $1982 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1982;
                    case 'Fm.Term.hol':
                        var $1983 = self.path;
                        var $1984 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1984;
                    case 'Fm.Term.nat':
                        var $1985 = self.natx;
                        var $1986 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1986;
                    case 'Fm.Term.chr':
                        var $1987 = self.chrx;
                        var $1988 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1988;
                    case 'Fm.Term.str':
                        var $1989 = self.strx;
                        var $1990 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1990;
                    case 'Fm.Term.cse':
                        var $1991 = self.path;
                        var $1992 = self.expr;
                        var $1993 = self.name;
                        var $1994 = self.with;
                        var $1995 = self.cses;
                        var $1996 = self.moti;
                        var $1997 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1997;
                    case 'Fm.Term.ori':
                        var $1998 = self.orig;
                        var $1999 = self.expr;
                        var $2000 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $2000;
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
                        var $2001 = self.name;
                        var $2002 = self.indx;
                        var $2003 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2003;
                    case 'Fm.Term.ref':
                        var $2004 = self.name;
                        var $2005 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2005;
                    case 'Fm.Term.typ':
                        var $2006 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2006;
                    case 'Fm.Term.all':
                        var $2007 = self.eras;
                        var $2008 = self.self;
                        var $2009 = self.name;
                        var $2010 = self.xtyp;
                        var $2011 = self.body;
                        var $2012 = Fm$SmartMotive$nams$cont$(_name$1, $2011(Fm$Term$ref$($2008))(Fm$Term$ref$($2009)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($2009, List$nil)))), _binds$3), _defs$4);
                        return $2012;
                    case 'Fm.Term.lam':
                        var $2013 = self.name;
                        var $2014 = self.body;
                        var $2015 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2015;
                    case 'Fm.Term.app':
                        var $2016 = self.func;
                        var $2017 = self.argm;
                        var $2018 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2018;
                    case 'Fm.Term.let':
                        var $2019 = self.name;
                        var $2020 = self.expr;
                        var $2021 = self.body;
                        var $2022 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2022;
                    case 'Fm.Term.def':
                        var $2023 = self.name;
                        var $2024 = self.expr;
                        var $2025 = self.body;
                        var $2026 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2026;
                    case 'Fm.Term.ann':
                        var $2027 = self.done;
                        var $2028 = self.term;
                        var $2029 = self.type;
                        var $2030 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2030;
                    case 'Fm.Term.gol':
                        var $2031 = self.name;
                        var $2032 = self.dref;
                        var $2033 = self.verb;
                        var $2034 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2034;
                    case 'Fm.Term.hol':
                        var $2035 = self.path;
                        var $2036 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2036;
                    case 'Fm.Term.nat':
                        var $2037 = self.natx;
                        var $2038 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2038;
                    case 'Fm.Term.chr':
                        var $2039 = self.chrx;
                        var $2040 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2040;
                    case 'Fm.Term.str':
                        var $2041 = self.strx;
                        var $2042 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2042;
                    case 'Fm.Term.cse':
                        var $2043 = self.path;
                        var $2044 = self.expr;
                        var $2045 = self.name;
                        var $2046 = self.with;
                        var $2047 = self.cses;
                        var $2048 = self.moti;
                        var $2049 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2049;
                    case 'Fm.Term.ori':
                        var $2050 = self.orig;
                        var $2051 = self.expr;
                        var $2052 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2052;
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
                var $2054 = self.name;
                var $2055 = self.indx;
                var $2056 = List$nil;
                var $2053 = $2056;
                break;
            case 'Fm.Term.ref':
                var $2057 = self.name;
                var $2058 = List$nil;
                var $2053 = $2058;
                break;
            case 'Fm.Term.typ':
                var $2059 = List$nil;
                var $2053 = $2059;
                break;
            case 'Fm.Term.all':
                var $2060 = self.eras;
                var $2061 = self.self;
                var $2062 = self.name;
                var $2063 = self.xtyp;
                var $2064 = self.body;
                var $2065 = Fm$SmartMotive$nams$cont$(_name$1, $2063, List$nil, _defs$3);
                var $2053 = $2065;
                break;
            case 'Fm.Term.lam':
                var $2066 = self.name;
                var $2067 = self.body;
                var $2068 = List$nil;
                var $2053 = $2068;
                break;
            case 'Fm.Term.app':
                var $2069 = self.func;
                var $2070 = self.argm;
                var $2071 = List$nil;
                var $2053 = $2071;
                break;
            case 'Fm.Term.let':
                var $2072 = self.name;
                var $2073 = self.expr;
                var $2074 = self.body;
                var $2075 = List$nil;
                var $2053 = $2075;
                break;
            case 'Fm.Term.def':
                var $2076 = self.name;
                var $2077 = self.expr;
                var $2078 = self.body;
                var $2079 = List$nil;
                var $2053 = $2079;
                break;
            case 'Fm.Term.ann':
                var $2080 = self.done;
                var $2081 = self.term;
                var $2082 = self.type;
                var $2083 = List$nil;
                var $2053 = $2083;
                break;
            case 'Fm.Term.gol':
                var $2084 = self.name;
                var $2085 = self.dref;
                var $2086 = self.verb;
                var $2087 = List$nil;
                var $2053 = $2087;
                break;
            case 'Fm.Term.hol':
                var $2088 = self.path;
                var $2089 = List$nil;
                var $2053 = $2089;
                break;
            case 'Fm.Term.nat':
                var $2090 = self.natx;
                var $2091 = List$nil;
                var $2053 = $2091;
                break;
            case 'Fm.Term.chr':
                var $2092 = self.chrx;
                var $2093 = List$nil;
                var $2053 = $2093;
                break;
            case 'Fm.Term.str':
                var $2094 = self.strx;
                var $2095 = List$nil;
                var $2053 = $2095;
                break;
            case 'Fm.Term.cse':
                var $2096 = self.path;
                var $2097 = self.expr;
                var $2098 = self.name;
                var $2099 = self.with;
                var $2100 = self.cses;
                var $2101 = self.moti;
                var $2102 = List$nil;
                var $2053 = $2102;
                break;
            case 'Fm.Term.ori':
                var $2103 = self.orig;
                var $2104 = self.expr;
                var $2105 = List$nil;
                var $2053 = $2105;
                break;
        };
        return $2053;
    };
    const Fm$SmartMotive$nams = x0 => x1 => x2 => Fm$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.nil':
                var $2107 = List$nil;
                var $2106 = $2107;
                break;
            case 'List.cons':
                var $2108 = self.head;
                var $2109 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.nil':
                        var $2111 = List$nil;
                        var $2110 = $2111;
                        break;
                    case 'List.cons':
                        var $2112 = self.head;
                        var $2113 = self.tail;
                        var $2114 = List$cons$(Pair$new$($2108, $2112), List$zip$($2109, $2113));
                        var $2110 = $2114;
                        break;
                };
                var $2106 = $2110;
                break;
        };
        return $2106;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Fm$Term$serialize$name$(_name$1) {
        var $2115 = (fm_name_to_bits(_name$1));
        return $2115;
    };
    const Fm$Term$serialize$name = x0 => Fm$Term$serialize$name$(x0);

    function Fm$Term$serialize$(_term$1, _depth$2, _init$3, _x$4) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2117 = self.name;
                var $2118 = self.indx;
                var self = ($2118 >= _init$3);
                if (self) {
                    var _name$7 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $2118 <= 0n ? 0n : _depth$2 - $2118)))));
                    var $2120 = (((_name$7(_x$4) + '1') + '0') + '0');
                    var $2119 = $2120;
                } else {
                    var _name$7 = a1 => (a1 + (nat_to_bits($2118)));
                    var $2121 = (((_name$7(_x$4) + '0') + '1') + '0');
                    var $2119 = $2121;
                };
                var $2116 = $2119;
                break;
            case 'Fm.Term.ref':
                var $2122 = self.name;
                var _name$6 = a1 => (a1 + Fm$Term$serialize$name$($2122));
                var $2123 = (((_name$6(_x$4) + '0') + '0') + '0');
                var $2116 = $2123;
                break;
            case 'Fm.Term.typ':
                var $2124 = (((_x$4 + '1') + '1') + '0');
                var $2116 = $2124;
                break;
            case 'Fm.Term.all':
                var $2125 = self.eras;
                var $2126 = self.self;
                var $2127 = self.name;
                var $2128 = self.xtyp;
                var $2129 = self.body;
                var self = $2125;
                if (self) {
                    var $2131 = Bits$i;
                    var _eras$10 = $2131;
                } else {
                    var $2132 = Bits$o;
                    var _eras$10 = $2132;
                };
                var _self$11 = a1 => (a1 + (fm_name_to_bits($2126)));
                var _xtyp$12 = Fm$Term$serialize($2128)(_depth$2)(_init$3);
                var _body$13 = Fm$Term$serialize($2129(Fm$Term$var$($2126, _depth$2))(Fm$Term$var$($2127, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3);
                var $2130 = (((_eras$10(_self$11(_xtyp$12(_body$13(_x$4)))) + '0') + '0') + '1');
                var $2116 = $2130;
                break;
            case 'Fm.Term.lam':
                var $2133 = self.name;
                var $2134 = self.body;
                var _body$7 = Fm$Term$serialize($2134(Fm$Term$var$($2133, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2135 = (((_body$7(_x$4) + '1') + '0') + '1');
                var $2116 = $2135;
                break;
            case 'Fm.Term.app':
                var $2136 = self.func;
                var $2137 = self.argm;
                var _func$7 = Fm$Term$serialize($2136)(_depth$2)(_init$3);
                var _argm$8 = Fm$Term$serialize($2137)(_depth$2)(_init$3);
                var $2138 = (((_func$7(_argm$8(_x$4)) + '0') + '1') + '1');
                var $2116 = $2138;
                break;
            case 'Fm.Term.let':
                var $2139 = self.name;
                var $2140 = self.expr;
                var $2141 = self.body;
                var _expr$8 = Fm$Term$serialize($2140)(_depth$2)(_init$3);
                var _body$9 = Fm$Term$serialize($2141(Fm$Term$var$($2139, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2142 = (((_expr$8(_body$9(_x$4)) + '1') + '1') + '1');
                var $2116 = $2142;
                break;
            case 'Fm.Term.def':
                var $2143 = self.name;
                var $2144 = self.expr;
                var $2145 = self.body;
                var $2146 = Fm$Term$serialize$($2145($2144), _depth$2, _init$3, _x$4);
                var $2116 = $2146;
                break;
            case 'Fm.Term.ann':
                var $2147 = self.done;
                var $2148 = self.term;
                var $2149 = self.type;
                var $2150 = Fm$Term$serialize$($2148, _depth$2, _init$3, _x$4);
                var $2116 = $2150;
                break;
            case 'Fm.Term.gol':
                var $2151 = self.name;
                var $2152 = self.dref;
                var $2153 = self.verb;
                var _name$8 = a1 => (a1 + (fm_name_to_bits($2151)));
                var $2154 = (((_name$8(_x$4) + '0') + '0') + '0');
                var $2116 = $2154;
                break;
            case 'Fm.Term.hol':
                var $2155 = self.path;
                var $2156 = _x$4;
                var $2116 = $2156;
                break;
            case 'Fm.Term.nat':
                var $2157 = self.natx;
                var $2158 = Fm$Term$serialize$(Fm$Term$unroll_nat$($2157), _depth$2, _init$3, _x$4);
                var $2116 = $2158;
                break;
            case 'Fm.Term.chr':
                var $2159 = self.chrx;
                var $2160 = Fm$Term$serialize$(Fm$Term$unroll_chr$($2159), _depth$2, _init$3, _x$4);
                var $2116 = $2160;
                break;
            case 'Fm.Term.str':
                var $2161 = self.strx;
                var $2162 = Fm$Term$serialize$(Fm$Term$unroll_str$($2161), _depth$2, _init$3, _x$4);
                var $2116 = $2162;
                break;
            case 'Fm.Term.cse':
                var $2163 = self.path;
                var $2164 = self.expr;
                var $2165 = self.name;
                var $2166 = self.with;
                var $2167 = self.cses;
                var $2168 = self.moti;
                var $2169 = _x$4;
                var $2116 = $2169;
                break;
            case 'Fm.Term.ori':
                var $2170 = self.orig;
                var $2171 = self.expr;
                var $2172 = Fm$Term$serialize$($2171, _depth$2, _init$3, _x$4);
                var $2116 = $2172;
                break;
        };
        return $2116;
    };
    const Fm$Term$serialize = x0 => x1 => x2 => x3 => Fm$Term$serialize$(x0, x1, x2, x3);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Fm$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Fm$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$e);
        var _bh$5 = Fm$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$e);
        var $2173 = (_bh$5 === _ah$4);
        return $2173;
    };
    const Fm$Term$identical = x0 => x1 => x2 => Fm$Term$identical$(x0, x1, x2);

    function Fm$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Fm$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $2175 = _to$3;
            var $2174 = $2175;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $2177 = self.name;
                    var $2178 = self.indx;
                    var $2179 = Fm$Term$var$($2177, $2178);
                    var $2176 = $2179;
                    break;
                case 'Fm.Term.ref':
                    var $2180 = self.name;
                    var $2181 = Fm$Term$ref$($2180);
                    var $2176 = $2181;
                    break;
                case 'Fm.Term.typ':
                    var $2182 = Fm$Term$typ;
                    var $2176 = $2182;
                    break;
                case 'Fm.Term.all':
                    var $2183 = self.eras;
                    var $2184 = self.self;
                    var $2185 = self.name;
                    var $2186 = self.xtyp;
                    var $2187 = self.body;
                    var _xtyp$10 = Fm$SmartMotive$replace$($2186, _from$2, _to$3, _lv$4);
                    var _body$11 = $2187(Fm$Term$ref$($2184))(Fm$Term$ref$($2185));
                    var _body$12 = Fm$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $2188 = Fm$Term$all$($2183, $2184, $2185, _xtyp$10, (_s$13 => _x$14 => {
                        var $2189 = _body$12;
                        return $2189;
                    }));
                    var $2176 = $2188;
                    break;
                case 'Fm.Term.lam':
                    var $2190 = self.name;
                    var $2191 = self.body;
                    var _body$7 = $2191(Fm$Term$ref$($2190));
                    var _body$8 = Fm$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2192 = Fm$Term$lam$($2190, (_x$9 => {
                        var $2193 = _body$8;
                        return $2193;
                    }));
                    var $2176 = $2192;
                    break;
                case 'Fm.Term.app':
                    var $2194 = self.func;
                    var $2195 = self.argm;
                    var _func$7 = Fm$SmartMotive$replace$($2194, _from$2, _to$3, _lv$4);
                    var _argm$8 = Fm$SmartMotive$replace$($2195, _from$2, _to$3, _lv$4);
                    var $2196 = Fm$Term$app$(_func$7, _argm$8);
                    var $2176 = $2196;
                    break;
                case 'Fm.Term.let':
                    var $2197 = self.name;
                    var $2198 = self.expr;
                    var $2199 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2198, _from$2, _to$3, _lv$4);
                    var _body$9 = $2199(Fm$Term$ref$($2197));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2200 = Fm$Term$let$($2197, _expr$8, (_x$11 => {
                        var $2201 = _body$10;
                        return $2201;
                    }));
                    var $2176 = $2200;
                    break;
                case 'Fm.Term.def':
                    var $2202 = self.name;
                    var $2203 = self.expr;
                    var $2204 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2203, _from$2, _to$3, _lv$4);
                    var _body$9 = $2204(Fm$Term$ref$($2202));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2205 = Fm$Term$def$($2202, _expr$8, (_x$11 => {
                        var $2206 = _body$10;
                        return $2206;
                    }));
                    var $2176 = $2205;
                    break;
                case 'Fm.Term.ann':
                    var $2207 = self.done;
                    var $2208 = self.term;
                    var $2209 = self.type;
                    var _term$8 = Fm$SmartMotive$replace$($2208, _from$2, _to$3, _lv$4);
                    var _type$9 = Fm$SmartMotive$replace$($2209, _from$2, _to$3, _lv$4);
                    var $2210 = Fm$Term$ann$($2207, _term$8, _type$9);
                    var $2176 = $2210;
                    break;
                case 'Fm.Term.gol':
                    var $2211 = self.name;
                    var $2212 = self.dref;
                    var $2213 = self.verb;
                    var $2214 = _term$1;
                    var $2176 = $2214;
                    break;
                case 'Fm.Term.hol':
                    var $2215 = self.path;
                    var $2216 = _term$1;
                    var $2176 = $2216;
                    break;
                case 'Fm.Term.nat':
                    var $2217 = self.natx;
                    var $2218 = _term$1;
                    var $2176 = $2218;
                    break;
                case 'Fm.Term.chr':
                    var $2219 = self.chrx;
                    var $2220 = _term$1;
                    var $2176 = $2220;
                    break;
                case 'Fm.Term.str':
                    var $2221 = self.strx;
                    var $2222 = _term$1;
                    var $2176 = $2222;
                    break;
                case 'Fm.Term.cse':
                    var $2223 = self.path;
                    var $2224 = self.expr;
                    var $2225 = self.name;
                    var $2226 = self.with;
                    var $2227 = self.cses;
                    var $2228 = self.moti;
                    var $2229 = _term$1;
                    var $2176 = $2229;
                    break;
                case 'Fm.Term.ori':
                    var $2230 = self.orig;
                    var $2231 = self.expr;
                    var $2232 = Fm$SmartMotive$replace$($2231, _from$2, _to$3, _lv$4);
                    var $2176 = $2232;
                    break;
            };
            var $2174 = $2176;
        };
        return $2174;
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
                    var $2235 = self.fst;
                    var $2236 = self.snd;
                    var $2237 = Fm$SmartMotive$replace$(_moti$11, $2236, Fm$Term$ref$($2235), _lv$5);
                    var $2234 = $2237;
                    break;
            };
            return $2234;
        }));
        var $2233 = _moti$10;
        return $2233;
    };
    const Fm$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Fm$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Fm$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.nil':
                var $2239 = _moti$2;
                var $2238 = $2239;
                break;
            case 'List.cons':
                var $2240 = self.head;
                var $2241 = self.tail;
                var self = $2240;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $2243 = self.file;
                        var $2244 = self.code;
                        var $2245 = self.name;
                        var $2246 = self.term;
                        var $2247 = self.type;
                        var $2248 = self.stat;
                        var $2249 = Fm$Term$all$(Bool$false, "", $2245, $2247, (_s$11 => _x$12 => {
                            var $2250 = Fm$Term$desugar_cse$motive$($2241, _moti$2);
                            return $2250;
                        }));
                        var $2242 = $2249;
                        break;
                };
                var $2238 = $2242;
                break;
        };
        return $2238;
    };
    const Fm$Term$desugar_cse$motive = x0 => x1 => Fm$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $2252 = Bool$true;
            var $2251 = $2252;
        } else {
            var $2253 = self.charCodeAt(0);
            var $2254 = self.slice(1);
            var $2255 = Bool$false;
            var $2251 = $2255;
        };
        return $2251;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Fm$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $2257 = self.name;
                var $2258 = self.indx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2260 = _body$4;
                        var $2259 = $2260;
                        break;
                    case 'List.cons':
                        var $2261 = self.head;
                        var $2262 = self.tail;
                        var self = $2261;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2264 = self.file;
                                var $2265 = self.code;
                                var $2266 = self.name;
                                var $2267 = self.term;
                                var $2268 = self.type;
                                var $2269 = self.stat;
                                var $2270 = Fm$Term$lam$($2266, (_x$16 => {
                                    var $2271 = Fm$Term$desugar_cse$argument$(_name$1, $2262, _type$3, _body$4, _defs$5);
                                    return $2271;
                                }));
                                var $2263 = $2270;
                                break;
                        };
                        var $2259 = $2263;
                        break;
                };
                var $2256 = $2259;
                break;
            case 'Fm.Term.ref':
                var $2272 = self.name;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2274 = _body$4;
                        var $2273 = $2274;
                        break;
                    case 'List.cons':
                        var $2275 = self.head;
                        var $2276 = self.tail;
                        var self = $2275;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2278 = self.file;
                                var $2279 = self.code;
                                var $2280 = self.name;
                                var $2281 = self.term;
                                var $2282 = self.type;
                                var $2283 = self.stat;
                                var $2284 = Fm$Term$lam$($2280, (_x$15 => {
                                    var $2285 = Fm$Term$desugar_cse$argument$(_name$1, $2276, _type$3, _body$4, _defs$5);
                                    return $2285;
                                }));
                                var $2277 = $2284;
                                break;
                        };
                        var $2273 = $2277;
                        break;
                };
                var $2256 = $2273;
                break;
            case 'Fm.Term.typ':
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
                                var $2297 = Fm$Term$lam$($2293, (_x$14 => {
                                    var $2298 = Fm$Term$desugar_cse$argument$(_name$1, $2289, _type$3, _body$4, _defs$5);
                                    return $2298;
                                }));
                                var $2290 = $2297;
                                break;
                        };
                        var $2286 = $2290;
                        break;
                };
                var $2256 = $2286;
                break;
            case 'Fm.Term.all':
                var $2299 = self.eras;
                var $2300 = self.self;
                var $2301 = self.name;
                var $2302 = self.xtyp;
                var $2303 = self.body;
                var $2304 = Fm$Term$lam$((() => {
                    var self = String$is_empty$($2301);
                    if (self) {
                        var $2305 = _name$1;
                        return $2305;
                    } else {
                        var $2306 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($2301, List$nil))));
                        return $2306;
                    };
                })(), (_x$11 => {
                    var $2307 = Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, $2303(Fm$Term$var$($2300, 0n))(Fm$Term$var$($2301, 0n)), _body$4, _defs$5);
                    return $2307;
                }));
                var $2256 = $2304;
                break;
            case 'Fm.Term.lam':
                var $2308 = self.name;
                var $2309 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2311 = _body$4;
                        var $2310 = $2311;
                        break;
                    case 'List.cons':
                        var $2312 = self.head;
                        var $2313 = self.tail;
                        var self = $2312;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2315 = self.file;
                                var $2316 = self.code;
                                var $2317 = self.name;
                                var $2318 = self.term;
                                var $2319 = self.type;
                                var $2320 = self.stat;
                                var $2321 = Fm$Term$lam$($2317, (_x$16 => {
                                    var $2322 = Fm$Term$desugar_cse$argument$(_name$1, $2313, _type$3, _body$4, _defs$5);
                                    return $2322;
                                }));
                                var $2314 = $2321;
                                break;
                        };
                        var $2310 = $2314;
                        break;
                };
                var $2256 = $2310;
                break;
            case 'Fm.Term.app':
                var $2323 = self.func;
                var $2324 = self.argm;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2326 = _body$4;
                        var $2325 = $2326;
                        break;
                    case 'List.cons':
                        var $2327 = self.head;
                        var $2328 = self.tail;
                        var self = $2327;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2330 = self.file;
                                var $2331 = self.code;
                                var $2332 = self.name;
                                var $2333 = self.term;
                                var $2334 = self.type;
                                var $2335 = self.stat;
                                var $2336 = Fm$Term$lam$($2332, (_x$16 => {
                                    var $2337 = Fm$Term$desugar_cse$argument$(_name$1, $2328, _type$3, _body$4, _defs$5);
                                    return $2337;
                                }));
                                var $2329 = $2336;
                                break;
                        };
                        var $2325 = $2329;
                        break;
                };
                var $2256 = $2325;
                break;
            case 'Fm.Term.let':
                var $2338 = self.name;
                var $2339 = self.expr;
                var $2340 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2342 = _body$4;
                        var $2341 = $2342;
                        break;
                    case 'List.cons':
                        var $2343 = self.head;
                        var $2344 = self.tail;
                        var self = $2343;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2346 = self.file;
                                var $2347 = self.code;
                                var $2348 = self.name;
                                var $2349 = self.term;
                                var $2350 = self.type;
                                var $2351 = self.stat;
                                var $2352 = Fm$Term$lam$($2348, (_x$17 => {
                                    var $2353 = Fm$Term$desugar_cse$argument$(_name$1, $2344, _type$3, _body$4, _defs$5);
                                    return $2353;
                                }));
                                var $2345 = $2352;
                                break;
                        };
                        var $2341 = $2345;
                        break;
                };
                var $2256 = $2341;
                break;
            case 'Fm.Term.def':
                var $2354 = self.name;
                var $2355 = self.expr;
                var $2356 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2358 = _body$4;
                        var $2357 = $2358;
                        break;
                    case 'List.cons':
                        var $2359 = self.head;
                        var $2360 = self.tail;
                        var self = $2359;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2362 = self.file;
                                var $2363 = self.code;
                                var $2364 = self.name;
                                var $2365 = self.term;
                                var $2366 = self.type;
                                var $2367 = self.stat;
                                var $2368 = Fm$Term$lam$($2364, (_x$17 => {
                                    var $2369 = Fm$Term$desugar_cse$argument$(_name$1, $2360, _type$3, _body$4, _defs$5);
                                    return $2369;
                                }));
                                var $2361 = $2368;
                                break;
                        };
                        var $2357 = $2361;
                        break;
                };
                var $2256 = $2357;
                break;
            case 'Fm.Term.ann':
                var $2370 = self.done;
                var $2371 = self.term;
                var $2372 = self.type;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2374 = _body$4;
                        var $2373 = $2374;
                        break;
                    case 'List.cons':
                        var $2375 = self.head;
                        var $2376 = self.tail;
                        var self = $2375;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2378 = self.file;
                                var $2379 = self.code;
                                var $2380 = self.name;
                                var $2381 = self.term;
                                var $2382 = self.type;
                                var $2383 = self.stat;
                                var $2384 = Fm$Term$lam$($2380, (_x$17 => {
                                    var $2385 = Fm$Term$desugar_cse$argument$(_name$1, $2376, _type$3, _body$4, _defs$5);
                                    return $2385;
                                }));
                                var $2377 = $2384;
                                break;
                        };
                        var $2373 = $2377;
                        break;
                };
                var $2256 = $2373;
                break;
            case 'Fm.Term.gol':
                var $2386 = self.name;
                var $2387 = self.dref;
                var $2388 = self.verb;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2390 = _body$4;
                        var $2389 = $2390;
                        break;
                    case 'List.cons':
                        var $2391 = self.head;
                        var $2392 = self.tail;
                        var self = $2391;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2394 = self.file;
                                var $2395 = self.code;
                                var $2396 = self.name;
                                var $2397 = self.term;
                                var $2398 = self.type;
                                var $2399 = self.stat;
                                var $2400 = Fm$Term$lam$($2396, (_x$17 => {
                                    var $2401 = Fm$Term$desugar_cse$argument$(_name$1, $2392, _type$3, _body$4, _defs$5);
                                    return $2401;
                                }));
                                var $2393 = $2400;
                                break;
                        };
                        var $2389 = $2393;
                        break;
                };
                var $2256 = $2389;
                break;
            case 'Fm.Term.hol':
                var $2402 = self.path;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2404 = _body$4;
                        var $2403 = $2404;
                        break;
                    case 'List.cons':
                        var $2405 = self.head;
                        var $2406 = self.tail;
                        var self = $2405;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2408 = self.file;
                                var $2409 = self.code;
                                var $2410 = self.name;
                                var $2411 = self.term;
                                var $2412 = self.type;
                                var $2413 = self.stat;
                                var $2414 = Fm$Term$lam$($2410, (_x$15 => {
                                    var $2415 = Fm$Term$desugar_cse$argument$(_name$1, $2406, _type$3, _body$4, _defs$5);
                                    return $2415;
                                }));
                                var $2407 = $2414;
                                break;
                        };
                        var $2403 = $2407;
                        break;
                };
                var $2256 = $2403;
                break;
            case 'Fm.Term.nat':
                var $2416 = self.natx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2418 = _body$4;
                        var $2417 = $2418;
                        break;
                    case 'List.cons':
                        var $2419 = self.head;
                        var $2420 = self.tail;
                        var self = $2419;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2422 = self.file;
                                var $2423 = self.code;
                                var $2424 = self.name;
                                var $2425 = self.term;
                                var $2426 = self.type;
                                var $2427 = self.stat;
                                var $2428 = Fm$Term$lam$($2424, (_x$15 => {
                                    var $2429 = Fm$Term$desugar_cse$argument$(_name$1, $2420, _type$3, _body$4, _defs$5);
                                    return $2429;
                                }));
                                var $2421 = $2428;
                                break;
                        };
                        var $2417 = $2421;
                        break;
                };
                var $2256 = $2417;
                break;
            case 'Fm.Term.chr':
                var $2430 = self.chrx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2432 = _body$4;
                        var $2431 = $2432;
                        break;
                    case 'List.cons':
                        var $2433 = self.head;
                        var $2434 = self.tail;
                        var self = $2433;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2436 = self.file;
                                var $2437 = self.code;
                                var $2438 = self.name;
                                var $2439 = self.term;
                                var $2440 = self.type;
                                var $2441 = self.stat;
                                var $2442 = Fm$Term$lam$($2438, (_x$15 => {
                                    var $2443 = Fm$Term$desugar_cse$argument$(_name$1, $2434, _type$3, _body$4, _defs$5);
                                    return $2443;
                                }));
                                var $2435 = $2442;
                                break;
                        };
                        var $2431 = $2435;
                        break;
                };
                var $2256 = $2431;
                break;
            case 'Fm.Term.str':
                var $2444 = self.strx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2446 = _body$4;
                        var $2445 = $2446;
                        break;
                    case 'List.cons':
                        var $2447 = self.head;
                        var $2448 = self.tail;
                        var self = $2447;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2450 = self.file;
                                var $2451 = self.code;
                                var $2452 = self.name;
                                var $2453 = self.term;
                                var $2454 = self.type;
                                var $2455 = self.stat;
                                var $2456 = Fm$Term$lam$($2452, (_x$15 => {
                                    var $2457 = Fm$Term$desugar_cse$argument$(_name$1, $2448, _type$3, _body$4, _defs$5);
                                    return $2457;
                                }));
                                var $2449 = $2456;
                                break;
                        };
                        var $2445 = $2449;
                        break;
                };
                var $2256 = $2445;
                break;
            case 'Fm.Term.cse':
                var $2458 = self.path;
                var $2459 = self.expr;
                var $2460 = self.name;
                var $2461 = self.with;
                var $2462 = self.cses;
                var $2463 = self.moti;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2465 = _body$4;
                        var $2464 = $2465;
                        break;
                    case 'List.cons':
                        var $2466 = self.head;
                        var $2467 = self.tail;
                        var self = $2466;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2469 = self.file;
                                var $2470 = self.code;
                                var $2471 = self.name;
                                var $2472 = self.term;
                                var $2473 = self.type;
                                var $2474 = self.stat;
                                var $2475 = Fm$Term$lam$($2471, (_x$20 => {
                                    var $2476 = Fm$Term$desugar_cse$argument$(_name$1, $2467, _type$3, _body$4, _defs$5);
                                    return $2476;
                                }));
                                var $2468 = $2475;
                                break;
                        };
                        var $2464 = $2468;
                        break;
                };
                var $2256 = $2464;
                break;
            case 'Fm.Term.ori':
                var $2477 = self.orig;
                var $2478 = self.expr;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2480 = _body$4;
                        var $2479 = $2480;
                        break;
                    case 'List.cons':
                        var $2481 = self.head;
                        var $2482 = self.tail;
                        var self = $2481;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2484 = self.file;
                                var $2485 = self.code;
                                var $2486 = self.name;
                                var $2487 = self.term;
                                var $2488 = self.type;
                                var $2489 = self.stat;
                                var $2490 = Fm$Term$lam$($2486, (_x$16 => {
                                    var $2491 = Fm$Term$desugar_cse$argument$(_name$1, $2482, _type$3, _body$4, _defs$5);
                                    return $2491;
                                }));
                                var $2483 = $2490;
                                break;
                        };
                        var $2479 = $2483;
                        break;
                };
                var $2256 = $2479;
                break;
        };
        return $2256;
    };
    const Fm$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Fm$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.none':
                var $2493 = _b$3;
                var $2492 = $2493;
                break;
            case 'Maybe.some':
                var $2494 = self.value;
                var $2495 = Maybe$some$($2494);
                var $2492 = $2495;
                break;
        };
        return $2492;
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
                        var $2496 = self.name;
                        var $2497 = self.indx;
                        var _expr$10 = (() => {
                            var $2500 = _expr$1;
                            var $2501 = _wyth$3;
                            let _expr$11 = $2500;
                            let _defn$10;
                            while ($2501._ === 'List.cons') {
                                _defn$10 = $2501.head;
                                var $2500 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2502 = self.file;
                                            var $2503 = self.code;
                                            var $2504 = self.name;
                                            var $2505 = self.term;
                                            var $2506 = self.type;
                                            var $2507 = self.stat;
                                            var $2508 = $2505;
                                            return $2508;
                                    };
                                })());
                                _expr$11 = $2500;
                                $2501 = $2501.tail;
                            }
                            return _expr$11;
                        })();
                        var $2498 = _expr$10;
                        return $2498;
                    case 'Fm.Term.ref':
                        var $2509 = self.name;
                        var _expr$9 = (() => {
                            var $2512 = _expr$1;
                            var $2513 = _wyth$3;
                            let _expr$10 = $2512;
                            let _defn$9;
                            while ($2513._ === 'List.cons') {
                                _defn$9 = $2513.head;
                                var $2512 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2514 = self.file;
                                            var $2515 = self.code;
                                            var $2516 = self.name;
                                            var $2517 = self.term;
                                            var $2518 = self.type;
                                            var $2519 = self.stat;
                                            var $2520 = $2517;
                                            return $2520;
                                    };
                                })());
                                _expr$10 = $2512;
                                $2513 = $2513.tail;
                            }
                            return _expr$10;
                        })();
                        var $2510 = _expr$9;
                        return $2510;
                    case 'Fm.Term.typ':
                        var _expr$8 = (() => {
                            var $2523 = _expr$1;
                            var $2524 = _wyth$3;
                            let _expr$9 = $2523;
                            let _defn$8;
                            while ($2524._ === 'List.cons') {
                                _defn$8 = $2524.head;
                                var $2523 = Fm$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2525 = self.file;
                                            var $2526 = self.code;
                                            var $2527 = self.name;
                                            var $2528 = self.term;
                                            var $2529 = self.type;
                                            var $2530 = self.stat;
                                            var $2531 = $2528;
                                            return $2531;
                                    };
                                })());
                                _expr$9 = $2523;
                                $2524 = $2524.tail;
                            }
                            return _expr$9;
                        })();
                        var $2521 = _expr$8;
                        return $2521;
                    case 'Fm.Term.all':
                        var $2532 = self.eras;
                        var $2533 = self.self;
                        var $2534 = self.name;
                        var $2535 = self.xtyp;
                        var $2536 = self.body;
                        var _got$13 = Maybe$or$(Fm$get$($2534, _cses$4), Fm$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $2540 = _expr$1;
                                    var $2541 = _wyth$3;
                                    let _expr$15 = $2540;
                                    let _defn$14;
                                    while ($2541._ === 'List.cons') {
                                        _defn$14 = $2541.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Fm.Def.new':
                                                var $2542 = self.file;
                                                var $2543 = self.code;
                                                var $2544 = self.name;
                                                var $2545 = self.term;
                                                var $2546 = self.type;
                                                var $2547 = self.stat;
                                                var $2548 = Fm$Term$app$(_expr$15, $2545);
                                                var $2540 = $2548;
                                                break;
                                        };
                                        _expr$15 = $2540;
                                        $2541 = $2541.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $2538 = _expr$14;
                                var $2537 = $2538;
                                break;
                            case 'Maybe.some':
                                var $2549 = self.value;
                                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, _wyth$3, $2535, $2549, _defs$6);
                                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $2536(Fm$Term$var$($2533, 0n))(Fm$Term$var$($2534, 0n));
                                var $2550 = Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $2537 = $2550;
                                break;
                        };
                        return $2537;
                    case 'Fm.Term.lam':
                        var $2551 = self.name;
                        var $2552 = self.body;
                        var _expr$10 = (() => {
                            var $2555 = _expr$1;
                            var $2556 = _wyth$3;
                            let _expr$11 = $2555;
                            let _defn$10;
                            while ($2556._ === 'List.cons') {
                                _defn$10 = $2556.head;
                                var $2555 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2557 = self.file;
                                            var $2558 = self.code;
                                            var $2559 = self.name;
                                            var $2560 = self.term;
                                            var $2561 = self.type;
                                            var $2562 = self.stat;
                                            var $2563 = $2560;
                                            return $2563;
                                    };
                                })());
                                _expr$11 = $2555;
                                $2556 = $2556.tail;
                            }
                            return _expr$11;
                        })();
                        var $2553 = _expr$10;
                        return $2553;
                    case 'Fm.Term.app':
                        var $2564 = self.func;
                        var $2565 = self.argm;
                        var _expr$10 = (() => {
                            var $2568 = _expr$1;
                            var $2569 = _wyth$3;
                            let _expr$11 = $2568;
                            let _defn$10;
                            while ($2569._ === 'List.cons') {
                                _defn$10 = $2569.head;
                                var $2568 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2570 = self.file;
                                            var $2571 = self.code;
                                            var $2572 = self.name;
                                            var $2573 = self.term;
                                            var $2574 = self.type;
                                            var $2575 = self.stat;
                                            var $2576 = $2573;
                                            return $2576;
                                    };
                                })());
                                _expr$11 = $2568;
                                $2569 = $2569.tail;
                            }
                            return _expr$11;
                        })();
                        var $2566 = _expr$10;
                        return $2566;
                    case 'Fm.Term.let':
                        var $2577 = self.name;
                        var $2578 = self.expr;
                        var $2579 = self.body;
                        var _expr$11 = (() => {
                            var $2582 = _expr$1;
                            var $2583 = _wyth$3;
                            let _expr$12 = $2582;
                            let _defn$11;
                            while ($2583._ === 'List.cons') {
                                _defn$11 = $2583.head;
                                var $2582 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2584 = self.file;
                                            var $2585 = self.code;
                                            var $2586 = self.name;
                                            var $2587 = self.term;
                                            var $2588 = self.type;
                                            var $2589 = self.stat;
                                            var $2590 = $2587;
                                            return $2590;
                                    };
                                })());
                                _expr$12 = $2582;
                                $2583 = $2583.tail;
                            }
                            return _expr$12;
                        })();
                        var $2580 = _expr$11;
                        return $2580;
                    case 'Fm.Term.def':
                        var $2591 = self.name;
                        var $2592 = self.expr;
                        var $2593 = self.body;
                        var _expr$11 = (() => {
                            var $2596 = _expr$1;
                            var $2597 = _wyth$3;
                            let _expr$12 = $2596;
                            let _defn$11;
                            while ($2597._ === 'List.cons') {
                                _defn$11 = $2597.head;
                                var $2596 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2598 = self.file;
                                            var $2599 = self.code;
                                            var $2600 = self.name;
                                            var $2601 = self.term;
                                            var $2602 = self.type;
                                            var $2603 = self.stat;
                                            var $2604 = $2601;
                                            return $2604;
                                    };
                                })());
                                _expr$12 = $2596;
                                $2597 = $2597.tail;
                            }
                            return _expr$12;
                        })();
                        var $2594 = _expr$11;
                        return $2594;
                    case 'Fm.Term.ann':
                        var $2605 = self.done;
                        var $2606 = self.term;
                        var $2607 = self.type;
                        var _expr$11 = (() => {
                            var $2610 = _expr$1;
                            var $2611 = _wyth$3;
                            let _expr$12 = $2610;
                            let _defn$11;
                            while ($2611._ === 'List.cons') {
                                _defn$11 = $2611.head;
                                var $2610 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2612 = self.file;
                                            var $2613 = self.code;
                                            var $2614 = self.name;
                                            var $2615 = self.term;
                                            var $2616 = self.type;
                                            var $2617 = self.stat;
                                            var $2618 = $2615;
                                            return $2618;
                                    };
                                })());
                                _expr$12 = $2610;
                                $2611 = $2611.tail;
                            }
                            return _expr$12;
                        })();
                        var $2608 = _expr$11;
                        return $2608;
                    case 'Fm.Term.gol':
                        var $2619 = self.name;
                        var $2620 = self.dref;
                        var $2621 = self.verb;
                        var _expr$11 = (() => {
                            var $2624 = _expr$1;
                            var $2625 = _wyth$3;
                            let _expr$12 = $2624;
                            let _defn$11;
                            while ($2625._ === 'List.cons') {
                                _defn$11 = $2625.head;
                                var $2624 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2626 = self.file;
                                            var $2627 = self.code;
                                            var $2628 = self.name;
                                            var $2629 = self.term;
                                            var $2630 = self.type;
                                            var $2631 = self.stat;
                                            var $2632 = $2629;
                                            return $2632;
                                    };
                                })());
                                _expr$12 = $2624;
                                $2625 = $2625.tail;
                            }
                            return _expr$12;
                        })();
                        var $2622 = _expr$11;
                        return $2622;
                    case 'Fm.Term.hol':
                        var $2633 = self.path;
                        var _expr$9 = (() => {
                            var $2636 = _expr$1;
                            var $2637 = _wyth$3;
                            let _expr$10 = $2636;
                            let _defn$9;
                            while ($2637._ === 'List.cons') {
                                _defn$9 = $2637.head;
                                var $2636 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2638 = self.file;
                                            var $2639 = self.code;
                                            var $2640 = self.name;
                                            var $2641 = self.term;
                                            var $2642 = self.type;
                                            var $2643 = self.stat;
                                            var $2644 = $2641;
                                            return $2644;
                                    };
                                })());
                                _expr$10 = $2636;
                                $2637 = $2637.tail;
                            }
                            return _expr$10;
                        })();
                        var $2634 = _expr$9;
                        return $2634;
                    case 'Fm.Term.nat':
                        var $2645 = self.natx;
                        var _expr$9 = (() => {
                            var $2648 = _expr$1;
                            var $2649 = _wyth$3;
                            let _expr$10 = $2648;
                            let _defn$9;
                            while ($2649._ === 'List.cons') {
                                _defn$9 = $2649.head;
                                var $2648 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2650 = self.file;
                                            var $2651 = self.code;
                                            var $2652 = self.name;
                                            var $2653 = self.term;
                                            var $2654 = self.type;
                                            var $2655 = self.stat;
                                            var $2656 = $2653;
                                            return $2656;
                                    };
                                })());
                                _expr$10 = $2648;
                                $2649 = $2649.tail;
                            }
                            return _expr$10;
                        })();
                        var $2646 = _expr$9;
                        return $2646;
                    case 'Fm.Term.chr':
                        var $2657 = self.chrx;
                        var _expr$9 = (() => {
                            var $2660 = _expr$1;
                            var $2661 = _wyth$3;
                            let _expr$10 = $2660;
                            let _defn$9;
                            while ($2661._ === 'List.cons') {
                                _defn$9 = $2661.head;
                                var $2660 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2662 = self.file;
                                            var $2663 = self.code;
                                            var $2664 = self.name;
                                            var $2665 = self.term;
                                            var $2666 = self.type;
                                            var $2667 = self.stat;
                                            var $2668 = $2665;
                                            return $2668;
                                    };
                                })());
                                _expr$10 = $2660;
                                $2661 = $2661.tail;
                            }
                            return _expr$10;
                        })();
                        var $2658 = _expr$9;
                        return $2658;
                    case 'Fm.Term.str':
                        var $2669 = self.strx;
                        var _expr$9 = (() => {
                            var $2672 = _expr$1;
                            var $2673 = _wyth$3;
                            let _expr$10 = $2672;
                            let _defn$9;
                            while ($2673._ === 'List.cons') {
                                _defn$9 = $2673.head;
                                var $2672 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2674 = self.file;
                                            var $2675 = self.code;
                                            var $2676 = self.name;
                                            var $2677 = self.term;
                                            var $2678 = self.type;
                                            var $2679 = self.stat;
                                            var $2680 = $2677;
                                            return $2680;
                                    };
                                })());
                                _expr$10 = $2672;
                                $2673 = $2673.tail;
                            }
                            return _expr$10;
                        })();
                        var $2670 = _expr$9;
                        return $2670;
                    case 'Fm.Term.cse':
                        var $2681 = self.path;
                        var $2682 = self.expr;
                        var $2683 = self.name;
                        var $2684 = self.with;
                        var $2685 = self.cses;
                        var $2686 = self.moti;
                        var _expr$14 = (() => {
                            var $2689 = _expr$1;
                            var $2690 = _wyth$3;
                            let _expr$15 = $2689;
                            let _defn$14;
                            while ($2690._ === 'List.cons') {
                                _defn$14 = $2690.head;
                                var $2689 = Fm$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2691 = self.file;
                                            var $2692 = self.code;
                                            var $2693 = self.name;
                                            var $2694 = self.term;
                                            var $2695 = self.type;
                                            var $2696 = self.stat;
                                            var $2697 = $2694;
                                            return $2697;
                                    };
                                })());
                                _expr$15 = $2689;
                                $2690 = $2690.tail;
                            }
                            return _expr$15;
                        })();
                        var $2687 = _expr$14;
                        return $2687;
                    case 'Fm.Term.ori':
                        var $2698 = self.orig;
                        var $2699 = self.expr;
                        var _expr$10 = (() => {
                            var $2702 = _expr$1;
                            var $2703 = _wyth$3;
                            let _expr$11 = $2702;
                            let _defn$10;
                            while ($2703._ === 'List.cons') {
                                _defn$10 = $2703.head;
                                var $2702 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2704 = self.file;
                                            var $2705 = self.code;
                                            var $2706 = self.name;
                                            var $2707 = self.term;
                                            var $2708 = self.type;
                                            var $2709 = self.stat;
                                            var $2710 = $2707;
                                            return $2710;
                                    };
                                })());
                                _expr$11 = $2702;
                                $2703 = $2703.tail;
                            }
                            return _expr$11;
                        })();
                        var $2700 = _expr$10;
                        return $2700;
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
                var $2712 = self.name;
                var $2713 = self.indx;
                var $2714 = Maybe$none;
                var $2711 = $2714;
                break;
            case 'Fm.Term.ref':
                var $2715 = self.name;
                var $2716 = Maybe$none;
                var $2711 = $2716;
                break;
            case 'Fm.Term.typ':
                var $2717 = Maybe$none;
                var $2711 = $2717;
                break;
            case 'Fm.Term.all':
                var $2718 = self.eras;
                var $2719 = self.self;
                var $2720 = self.name;
                var $2721 = self.xtyp;
                var $2722 = self.body;
                var _moti$14 = Fm$Term$desugar_cse$motive$(_with$3, _moti$5);
                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, List$nil, $2721, _moti$14, _defs$7);
                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                var _type$17 = $2722(Fm$Term$var$($2719, 0n))(Fm$Term$var$($2720, 0n));
                var $2723 = Maybe$some$(Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _with$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $2711 = $2723;
                break;
            case 'Fm.Term.lam':
                var $2724 = self.name;
                var $2725 = self.body;
                var $2726 = Maybe$none;
                var $2711 = $2726;
                break;
            case 'Fm.Term.app':
                var $2727 = self.func;
                var $2728 = self.argm;
                var $2729 = Maybe$none;
                var $2711 = $2729;
                break;
            case 'Fm.Term.let':
                var $2730 = self.name;
                var $2731 = self.expr;
                var $2732 = self.body;
                var $2733 = Maybe$none;
                var $2711 = $2733;
                break;
            case 'Fm.Term.def':
                var $2734 = self.name;
                var $2735 = self.expr;
                var $2736 = self.body;
                var $2737 = Maybe$none;
                var $2711 = $2737;
                break;
            case 'Fm.Term.ann':
                var $2738 = self.done;
                var $2739 = self.term;
                var $2740 = self.type;
                var $2741 = Maybe$none;
                var $2711 = $2741;
                break;
            case 'Fm.Term.gol':
                var $2742 = self.name;
                var $2743 = self.dref;
                var $2744 = self.verb;
                var $2745 = Maybe$none;
                var $2711 = $2745;
                break;
            case 'Fm.Term.hol':
                var $2746 = self.path;
                var $2747 = Maybe$none;
                var $2711 = $2747;
                break;
            case 'Fm.Term.nat':
                var $2748 = self.natx;
                var $2749 = Maybe$none;
                var $2711 = $2749;
                break;
            case 'Fm.Term.chr':
                var $2750 = self.chrx;
                var $2751 = Maybe$none;
                var $2711 = $2751;
                break;
            case 'Fm.Term.str':
                var $2752 = self.strx;
                var $2753 = Maybe$none;
                var $2711 = $2753;
                break;
            case 'Fm.Term.cse':
                var $2754 = self.path;
                var $2755 = self.expr;
                var $2756 = self.name;
                var $2757 = self.with;
                var $2758 = self.cses;
                var $2759 = self.moti;
                var $2760 = Maybe$none;
                var $2711 = $2760;
                break;
            case 'Fm.Term.ori':
                var $2761 = self.orig;
                var $2762 = self.expr;
                var $2763 = Maybe$none;
                var $2711 = $2763;
                break;
        };
        return $2711;
    };
    const Fm$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Error$patch$(_path$1, _term$2) {
        var $2764 = ({
            _: 'Fm.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $2764;
    };
    const Fm$Error$patch = x0 => x1 => Fm$Error$patch$(x0, x1);

    function Fm$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.none':
                var $2766 = Bits$e;
                var $2765 = $2766;
                break;
            case 'Maybe.some':
                var $2767 = self.value;
                var $2768 = $2767(Bits$e);
                var $2765 = $2768;
                break;
        };
        return $2765;
    };
    const Fm$MPath$to_bits = x0 => Fm$MPath$to_bits$(x0);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $2770 = Bool$false;
                var $2769 = $2770;
                break;
            case 'Maybe.some':
                var $2771 = self.value;
                var $2772 = Bool$true;
                var $2769 = $2772;
                break;
        };
        return $2769;
    };
    const Set$has = x0 => x1 => Set$has$(x0, x1);

    function Fm$Term$equal$patch$(_path$2, _term$3, _ret$4) {
        var $2773 = Fm$Check$result$(Maybe$some$(_ret$4), List$cons$(Fm$Error$patch$(_path$2, Fm$Term$normalize$(_term$3, Map$new)), List$nil));
        return $2773;
    };
    const Fm$Term$equal$patch = x0 => x1 => x2 => Fm$Term$equal$patch$(x0, x1, x2);

    function Fm$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2775 = self.name;
                var $2776 = self.indx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2778 = self.name;
                        var $2779 = self.indx;
                        var $2780 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2780;
                        break;
                    case 'Fm.Term.ref':
                        var $2781 = self.name;
                        var $2782 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2782;
                        break;
                    case 'Fm.Term.typ':
                        var $2783 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2783;
                        break;
                    case 'Fm.Term.all':
                        var $2784 = self.eras;
                        var $2785 = self.self;
                        var $2786 = self.name;
                        var $2787 = self.xtyp;
                        var $2788 = self.body;
                        var $2789 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2789;
                        break;
                    case 'Fm.Term.lam':
                        var $2790 = self.name;
                        var $2791 = self.body;
                        var $2792 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2792;
                        break;
                    case 'Fm.Term.app':
                        var $2793 = self.func;
                        var $2794 = self.argm;
                        var $2795 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2795;
                        break;
                    case 'Fm.Term.let':
                        var $2796 = self.name;
                        var $2797 = self.expr;
                        var $2798 = self.body;
                        var $2799 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2799;
                        break;
                    case 'Fm.Term.def':
                        var $2800 = self.name;
                        var $2801 = self.expr;
                        var $2802 = self.body;
                        var $2803 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2803;
                        break;
                    case 'Fm.Term.ann':
                        var $2804 = self.done;
                        var $2805 = self.term;
                        var $2806 = self.type;
                        var $2807 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2807;
                        break;
                    case 'Fm.Term.gol':
                        var $2808 = self.name;
                        var $2809 = self.dref;
                        var $2810 = self.verb;
                        var $2811 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2811;
                        break;
                    case 'Fm.Term.hol':
                        var $2812 = self.path;
                        var $2813 = Fm$Term$equal$patch$($2812, _a$1, Unit$new);
                        var $2777 = $2813;
                        break;
                    case 'Fm.Term.nat':
                        var $2814 = self.natx;
                        var $2815 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2815;
                        break;
                    case 'Fm.Term.chr':
                        var $2816 = self.chrx;
                        var $2817 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2817;
                        break;
                    case 'Fm.Term.str':
                        var $2818 = self.strx;
                        var $2819 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2819;
                        break;
                    case 'Fm.Term.cse':
                        var $2820 = self.path;
                        var $2821 = self.expr;
                        var $2822 = self.name;
                        var $2823 = self.with;
                        var $2824 = self.cses;
                        var $2825 = self.moti;
                        var $2826 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2777 = $2826;
                        break;
                    case 'Fm.Term.ori':
                        var $2827 = self.orig;
                        var $2828 = self.expr;
                        var $2829 = Fm$Term$equal$extra_holes$(_a$1, $2828);
                        var $2777 = $2829;
                        break;
                };
                var $2774 = $2777;
                break;
            case 'Fm.Term.ref':
                var $2830 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2832 = self.name;
                        var $2833 = self.indx;
                        var $2834 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2834;
                        break;
                    case 'Fm.Term.ref':
                        var $2835 = self.name;
                        var $2836 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2836;
                        break;
                    case 'Fm.Term.typ':
                        var $2837 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2837;
                        break;
                    case 'Fm.Term.all':
                        var $2838 = self.eras;
                        var $2839 = self.self;
                        var $2840 = self.name;
                        var $2841 = self.xtyp;
                        var $2842 = self.body;
                        var $2843 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2843;
                        break;
                    case 'Fm.Term.lam':
                        var $2844 = self.name;
                        var $2845 = self.body;
                        var $2846 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2846;
                        break;
                    case 'Fm.Term.app':
                        var $2847 = self.func;
                        var $2848 = self.argm;
                        var $2849 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2849;
                        break;
                    case 'Fm.Term.let':
                        var $2850 = self.name;
                        var $2851 = self.expr;
                        var $2852 = self.body;
                        var $2853 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2853;
                        break;
                    case 'Fm.Term.def':
                        var $2854 = self.name;
                        var $2855 = self.expr;
                        var $2856 = self.body;
                        var $2857 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2857;
                        break;
                    case 'Fm.Term.ann':
                        var $2858 = self.done;
                        var $2859 = self.term;
                        var $2860 = self.type;
                        var $2861 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2861;
                        break;
                    case 'Fm.Term.gol':
                        var $2862 = self.name;
                        var $2863 = self.dref;
                        var $2864 = self.verb;
                        var $2865 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2865;
                        break;
                    case 'Fm.Term.hol':
                        var $2866 = self.path;
                        var $2867 = Fm$Term$equal$patch$($2866, _a$1, Unit$new);
                        var $2831 = $2867;
                        break;
                    case 'Fm.Term.nat':
                        var $2868 = self.natx;
                        var $2869 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2869;
                        break;
                    case 'Fm.Term.chr':
                        var $2870 = self.chrx;
                        var $2871 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2871;
                        break;
                    case 'Fm.Term.str':
                        var $2872 = self.strx;
                        var $2873 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2873;
                        break;
                    case 'Fm.Term.cse':
                        var $2874 = self.path;
                        var $2875 = self.expr;
                        var $2876 = self.name;
                        var $2877 = self.with;
                        var $2878 = self.cses;
                        var $2879 = self.moti;
                        var $2880 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2831 = $2880;
                        break;
                    case 'Fm.Term.ori':
                        var $2881 = self.orig;
                        var $2882 = self.expr;
                        var $2883 = Fm$Term$equal$extra_holes$(_a$1, $2882);
                        var $2831 = $2883;
                        break;
                };
                var $2774 = $2831;
                break;
            case 'Fm.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2885 = self.name;
                        var $2886 = self.indx;
                        var $2887 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2887;
                        break;
                    case 'Fm.Term.ref':
                        var $2888 = self.name;
                        var $2889 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2889;
                        break;
                    case 'Fm.Term.typ':
                        var $2890 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2890;
                        break;
                    case 'Fm.Term.all':
                        var $2891 = self.eras;
                        var $2892 = self.self;
                        var $2893 = self.name;
                        var $2894 = self.xtyp;
                        var $2895 = self.body;
                        var $2896 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2896;
                        break;
                    case 'Fm.Term.lam':
                        var $2897 = self.name;
                        var $2898 = self.body;
                        var $2899 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2899;
                        break;
                    case 'Fm.Term.app':
                        var $2900 = self.func;
                        var $2901 = self.argm;
                        var $2902 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2902;
                        break;
                    case 'Fm.Term.let':
                        var $2903 = self.name;
                        var $2904 = self.expr;
                        var $2905 = self.body;
                        var $2906 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2906;
                        break;
                    case 'Fm.Term.def':
                        var $2907 = self.name;
                        var $2908 = self.expr;
                        var $2909 = self.body;
                        var $2910 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2910;
                        break;
                    case 'Fm.Term.ann':
                        var $2911 = self.done;
                        var $2912 = self.term;
                        var $2913 = self.type;
                        var $2914 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2914;
                        break;
                    case 'Fm.Term.gol':
                        var $2915 = self.name;
                        var $2916 = self.dref;
                        var $2917 = self.verb;
                        var $2918 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2918;
                        break;
                    case 'Fm.Term.hol':
                        var $2919 = self.path;
                        var $2920 = Fm$Term$equal$patch$($2919, _a$1, Unit$new);
                        var $2884 = $2920;
                        break;
                    case 'Fm.Term.nat':
                        var $2921 = self.natx;
                        var $2922 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2922;
                        break;
                    case 'Fm.Term.chr':
                        var $2923 = self.chrx;
                        var $2924 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2924;
                        break;
                    case 'Fm.Term.str':
                        var $2925 = self.strx;
                        var $2926 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2926;
                        break;
                    case 'Fm.Term.cse':
                        var $2927 = self.path;
                        var $2928 = self.expr;
                        var $2929 = self.name;
                        var $2930 = self.with;
                        var $2931 = self.cses;
                        var $2932 = self.moti;
                        var $2933 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2884 = $2933;
                        break;
                    case 'Fm.Term.ori':
                        var $2934 = self.orig;
                        var $2935 = self.expr;
                        var $2936 = Fm$Term$equal$extra_holes$(_a$1, $2935);
                        var $2884 = $2936;
                        break;
                };
                var $2774 = $2884;
                break;
            case 'Fm.Term.all':
                var $2937 = self.eras;
                var $2938 = self.self;
                var $2939 = self.name;
                var $2940 = self.xtyp;
                var $2941 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2943 = self.name;
                        var $2944 = self.indx;
                        var $2945 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2945;
                        break;
                    case 'Fm.Term.ref':
                        var $2946 = self.name;
                        var $2947 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2947;
                        break;
                    case 'Fm.Term.typ':
                        var $2948 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2948;
                        break;
                    case 'Fm.Term.all':
                        var $2949 = self.eras;
                        var $2950 = self.self;
                        var $2951 = self.name;
                        var $2952 = self.xtyp;
                        var $2953 = self.body;
                        var $2954 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2954;
                        break;
                    case 'Fm.Term.lam':
                        var $2955 = self.name;
                        var $2956 = self.body;
                        var $2957 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2957;
                        break;
                    case 'Fm.Term.app':
                        var $2958 = self.func;
                        var $2959 = self.argm;
                        var $2960 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2960;
                        break;
                    case 'Fm.Term.let':
                        var $2961 = self.name;
                        var $2962 = self.expr;
                        var $2963 = self.body;
                        var $2964 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2964;
                        break;
                    case 'Fm.Term.def':
                        var $2965 = self.name;
                        var $2966 = self.expr;
                        var $2967 = self.body;
                        var $2968 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2968;
                        break;
                    case 'Fm.Term.ann':
                        var $2969 = self.done;
                        var $2970 = self.term;
                        var $2971 = self.type;
                        var $2972 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2972;
                        break;
                    case 'Fm.Term.gol':
                        var $2973 = self.name;
                        var $2974 = self.dref;
                        var $2975 = self.verb;
                        var $2976 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2976;
                        break;
                    case 'Fm.Term.hol':
                        var $2977 = self.path;
                        var $2978 = Fm$Term$equal$patch$($2977, _a$1, Unit$new);
                        var $2942 = $2978;
                        break;
                    case 'Fm.Term.nat':
                        var $2979 = self.natx;
                        var $2980 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2980;
                        break;
                    case 'Fm.Term.chr':
                        var $2981 = self.chrx;
                        var $2982 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2982;
                        break;
                    case 'Fm.Term.str':
                        var $2983 = self.strx;
                        var $2984 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2984;
                        break;
                    case 'Fm.Term.cse':
                        var $2985 = self.path;
                        var $2986 = self.expr;
                        var $2987 = self.name;
                        var $2988 = self.with;
                        var $2989 = self.cses;
                        var $2990 = self.moti;
                        var $2991 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2942 = $2991;
                        break;
                    case 'Fm.Term.ori':
                        var $2992 = self.orig;
                        var $2993 = self.expr;
                        var $2994 = Fm$Term$equal$extra_holes$(_a$1, $2993);
                        var $2942 = $2994;
                        break;
                };
                var $2774 = $2942;
                break;
            case 'Fm.Term.lam':
                var $2995 = self.name;
                var $2996 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2998 = self.name;
                        var $2999 = self.indx;
                        var $3000 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3000;
                        break;
                    case 'Fm.Term.ref':
                        var $3001 = self.name;
                        var $3002 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3002;
                        break;
                    case 'Fm.Term.typ':
                        var $3003 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3003;
                        break;
                    case 'Fm.Term.all':
                        var $3004 = self.eras;
                        var $3005 = self.self;
                        var $3006 = self.name;
                        var $3007 = self.xtyp;
                        var $3008 = self.body;
                        var $3009 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3009;
                        break;
                    case 'Fm.Term.lam':
                        var $3010 = self.name;
                        var $3011 = self.body;
                        var $3012 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3012;
                        break;
                    case 'Fm.Term.app':
                        var $3013 = self.func;
                        var $3014 = self.argm;
                        var $3015 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3015;
                        break;
                    case 'Fm.Term.let':
                        var $3016 = self.name;
                        var $3017 = self.expr;
                        var $3018 = self.body;
                        var $3019 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3019;
                        break;
                    case 'Fm.Term.def':
                        var $3020 = self.name;
                        var $3021 = self.expr;
                        var $3022 = self.body;
                        var $3023 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3023;
                        break;
                    case 'Fm.Term.ann':
                        var $3024 = self.done;
                        var $3025 = self.term;
                        var $3026 = self.type;
                        var $3027 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3027;
                        break;
                    case 'Fm.Term.gol':
                        var $3028 = self.name;
                        var $3029 = self.dref;
                        var $3030 = self.verb;
                        var $3031 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3031;
                        break;
                    case 'Fm.Term.hol':
                        var $3032 = self.path;
                        var $3033 = Fm$Term$equal$patch$($3032, _a$1, Unit$new);
                        var $2997 = $3033;
                        break;
                    case 'Fm.Term.nat':
                        var $3034 = self.natx;
                        var $3035 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3035;
                        break;
                    case 'Fm.Term.chr':
                        var $3036 = self.chrx;
                        var $3037 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3037;
                        break;
                    case 'Fm.Term.str':
                        var $3038 = self.strx;
                        var $3039 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3039;
                        break;
                    case 'Fm.Term.cse':
                        var $3040 = self.path;
                        var $3041 = self.expr;
                        var $3042 = self.name;
                        var $3043 = self.with;
                        var $3044 = self.cses;
                        var $3045 = self.moti;
                        var $3046 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2997 = $3046;
                        break;
                    case 'Fm.Term.ori':
                        var $3047 = self.orig;
                        var $3048 = self.expr;
                        var $3049 = Fm$Term$equal$extra_holes$(_a$1, $3048);
                        var $2997 = $3049;
                        break;
                };
                var $2774 = $2997;
                break;
            case 'Fm.Term.app':
                var $3050 = self.func;
                var $3051 = self.argm;
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
                        var $3070 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$($3050, $3068))((_$7 => {
                            var $3071 = Fm$Term$equal$extra_holes$($3051, $3069);
                            return $3071;
                        }));
                        var $3052 = $3070;
                        break;
                    case 'Fm.Term.let':
                        var $3072 = self.name;
                        var $3073 = self.expr;
                        var $3074 = self.body;
                        var $3075 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3075;
                        break;
                    case 'Fm.Term.def':
                        var $3076 = self.name;
                        var $3077 = self.expr;
                        var $3078 = self.body;
                        var $3079 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3079;
                        break;
                    case 'Fm.Term.ann':
                        var $3080 = self.done;
                        var $3081 = self.term;
                        var $3082 = self.type;
                        var $3083 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3083;
                        break;
                    case 'Fm.Term.gol':
                        var $3084 = self.name;
                        var $3085 = self.dref;
                        var $3086 = self.verb;
                        var $3087 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3087;
                        break;
                    case 'Fm.Term.hol':
                        var $3088 = self.path;
                        var $3089 = Fm$Term$equal$patch$($3088, _a$1, Unit$new);
                        var $3052 = $3089;
                        break;
                    case 'Fm.Term.nat':
                        var $3090 = self.natx;
                        var $3091 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3091;
                        break;
                    case 'Fm.Term.chr':
                        var $3092 = self.chrx;
                        var $3093 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3093;
                        break;
                    case 'Fm.Term.str':
                        var $3094 = self.strx;
                        var $3095 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3095;
                        break;
                    case 'Fm.Term.cse':
                        var $3096 = self.path;
                        var $3097 = self.expr;
                        var $3098 = self.name;
                        var $3099 = self.with;
                        var $3100 = self.cses;
                        var $3101 = self.moti;
                        var $3102 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3052 = $3102;
                        break;
                    case 'Fm.Term.ori':
                        var $3103 = self.orig;
                        var $3104 = self.expr;
                        var $3105 = Fm$Term$equal$extra_holes$(_a$1, $3104);
                        var $3052 = $3105;
                        break;
                };
                var $2774 = $3052;
                break;
            case 'Fm.Term.let':
                var $3106 = self.name;
                var $3107 = self.expr;
                var $3108 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3110 = self.name;
                        var $3111 = self.indx;
                        var $3112 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3112;
                        break;
                    case 'Fm.Term.ref':
                        var $3113 = self.name;
                        var $3114 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3114;
                        break;
                    case 'Fm.Term.typ':
                        var $3115 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3115;
                        break;
                    case 'Fm.Term.all':
                        var $3116 = self.eras;
                        var $3117 = self.self;
                        var $3118 = self.name;
                        var $3119 = self.xtyp;
                        var $3120 = self.body;
                        var $3121 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3121;
                        break;
                    case 'Fm.Term.lam':
                        var $3122 = self.name;
                        var $3123 = self.body;
                        var $3124 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3124;
                        break;
                    case 'Fm.Term.app':
                        var $3125 = self.func;
                        var $3126 = self.argm;
                        var $3127 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3127;
                        break;
                    case 'Fm.Term.let':
                        var $3128 = self.name;
                        var $3129 = self.expr;
                        var $3130 = self.body;
                        var $3131 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3131;
                        break;
                    case 'Fm.Term.def':
                        var $3132 = self.name;
                        var $3133 = self.expr;
                        var $3134 = self.body;
                        var $3135 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3135;
                        break;
                    case 'Fm.Term.ann':
                        var $3136 = self.done;
                        var $3137 = self.term;
                        var $3138 = self.type;
                        var $3139 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3139;
                        break;
                    case 'Fm.Term.gol':
                        var $3140 = self.name;
                        var $3141 = self.dref;
                        var $3142 = self.verb;
                        var $3143 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3143;
                        break;
                    case 'Fm.Term.hol':
                        var $3144 = self.path;
                        var $3145 = Fm$Term$equal$patch$($3144, _a$1, Unit$new);
                        var $3109 = $3145;
                        break;
                    case 'Fm.Term.nat':
                        var $3146 = self.natx;
                        var $3147 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3147;
                        break;
                    case 'Fm.Term.chr':
                        var $3148 = self.chrx;
                        var $3149 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3149;
                        break;
                    case 'Fm.Term.str':
                        var $3150 = self.strx;
                        var $3151 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3151;
                        break;
                    case 'Fm.Term.cse':
                        var $3152 = self.path;
                        var $3153 = self.expr;
                        var $3154 = self.name;
                        var $3155 = self.with;
                        var $3156 = self.cses;
                        var $3157 = self.moti;
                        var $3158 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3109 = $3158;
                        break;
                    case 'Fm.Term.ori':
                        var $3159 = self.orig;
                        var $3160 = self.expr;
                        var $3161 = Fm$Term$equal$extra_holes$(_a$1, $3160);
                        var $3109 = $3161;
                        break;
                };
                var $2774 = $3109;
                break;
            case 'Fm.Term.def':
                var $3162 = self.name;
                var $3163 = self.expr;
                var $3164 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3166 = self.name;
                        var $3167 = self.indx;
                        var $3168 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3168;
                        break;
                    case 'Fm.Term.ref':
                        var $3169 = self.name;
                        var $3170 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3170;
                        break;
                    case 'Fm.Term.typ':
                        var $3171 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3171;
                        break;
                    case 'Fm.Term.all':
                        var $3172 = self.eras;
                        var $3173 = self.self;
                        var $3174 = self.name;
                        var $3175 = self.xtyp;
                        var $3176 = self.body;
                        var $3177 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3177;
                        break;
                    case 'Fm.Term.lam':
                        var $3178 = self.name;
                        var $3179 = self.body;
                        var $3180 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3180;
                        break;
                    case 'Fm.Term.app':
                        var $3181 = self.func;
                        var $3182 = self.argm;
                        var $3183 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3183;
                        break;
                    case 'Fm.Term.let':
                        var $3184 = self.name;
                        var $3185 = self.expr;
                        var $3186 = self.body;
                        var $3187 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3187;
                        break;
                    case 'Fm.Term.def':
                        var $3188 = self.name;
                        var $3189 = self.expr;
                        var $3190 = self.body;
                        var $3191 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3191;
                        break;
                    case 'Fm.Term.ann':
                        var $3192 = self.done;
                        var $3193 = self.term;
                        var $3194 = self.type;
                        var $3195 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3195;
                        break;
                    case 'Fm.Term.gol':
                        var $3196 = self.name;
                        var $3197 = self.dref;
                        var $3198 = self.verb;
                        var $3199 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3199;
                        break;
                    case 'Fm.Term.hol':
                        var $3200 = self.path;
                        var $3201 = Fm$Term$equal$patch$($3200, _a$1, Unit$new);
                        var $3165 = $3201;
                        break;
                    case 'Fm.Term.nat':
                        var $3202 = self.natx;
                        var $3203 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3203;
                        break;
                    case 'Fm.Term.chr':
                        var $3204 = self.chrx;
                        var $3205 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3205;
                        break;
                    case 'Fm.Term.str':
                        var $3206 = self.strx;
                        var $3207 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3207;
                        break;
                    case 'Fm.Term.cse':
                        var $3208 = self.path;
                        var $3209 = self.expr;
                        var $3210 = self.name;
                        var $3211 = self.with;
                        var $3212 = self.cses;
                        var $3213 = self.moti;
                        var $3214 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3165 = $3214;
                        break;
                    case 'Fm.Term.ori':
                        var $3215 = self.orig;
                        var $3216 = self.expr;
                        var $3217 = Fm$Term$equal$extra_holes$(_a$1, $3216);
                        var $3165 = $3217;
                        break;
                };
                var $2774 = $3165;
                break;
            case 'Fm.Term.ann':
                var $3218 = self.done;
                var $3219 = self.term;
                var $3220 = self.type;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3222 = self.name;
                        var $3223 = self.indx;
                        var $3224 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3224;
                        break;
                    case 'Fm.Term.ref':
                        var $3225 = self.name;
                        var $3226 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3226;
                        break;
                    case 'Fm.Term.typ':
                        var $3227 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3227;
                        break;
                    case 'Fm.Term.all':
                        var $3228 = self.eras;
                        var $3229 = self.self;
                        var $3230 = self.name;
                        var $3231 = self.xtyp;
                        var $3232 = self.body;
                        var $3233 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3233;
                        break;
                    case 'Fm.Term.lam':
                        var $3234 = self.name;
                        var $3235 = self.body;
                        var $3236 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3236;
                        break;
                    case 'Fm.Term.app':
                        var $3237 = self.func;
                        var $3238 = self.argm;
                        var $3239 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3239;
                        break;
                    case 'Fm.Term.let':
                        var $3240 = self.name;
                        var $3241 = self.expr;
                        var $3242 = self.body;
                        var $3243 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3243;
                        break;
                    case 'Fm.Term.def':
                        var $3244 = self.name;
                        var $3245 = self.expr;
                        var $3246 = self.body;
                        var $3247 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3247;
                        break;
                    case 'Fm.Term.ann':
                        var $3248 = self.done;
                        var $3249 = self.term;
                        var $3250 = self.type;
                        var $3251 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3251;
                        break;
                    case 'Fm.Term.gol':
                        var $3252 = self.name;
                        var $3253 = self.dref;
                        var $3254 = self.verb;
                        var $3255 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3255;
                        break;
                    case 'Fm.Term.hol':
                        var $3256 = self.path;
                        var $3257 = Fm$Term$equal$patch$($3256, _a$1, Unit$new);
                        var $3221 = $3257;
                        break;
                    case 'Fm.Term.nat':
                        var $3258 = self.natx;
                        var $3259 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3259;
                        break;
                    case 'Fm.Term.chr':
                        var $3260 = self.chrx;
                        var $3261 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3261;
                        break;
                    case 'Fm.Term.str':
                        var $3262 = self.strx;
                        var $3263 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3263;
                        break;
                    case 'Fm.Term.cse':
                        var $3264 = self.path;
                        var $3265 = self.expr;
                        var $3266 = self.name;
                        var $3267 = self.with;
                        var $3268 = self.cses;
                        var $3269 = self.moti;
                        var $3270 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3221 = $3270;
                        break;
                    case 'Fm.Term.ori':
                        var $3271 = self.orig;
                        var $3272 = self.expr;
                        var $3273 = Fm$Term$equal$extra_holes$(_a$1, $3272);
                        var $3221 = $3273;
                        break;
                };
                var $2774 = $3221;
                break;
            case 'Fm.Term.gol':
                var $3274 = self.name;
                var $3275 = self.dref;
                var $3276 = self.verb;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3278 = self.name;
                        var $3279 = self.indx;
                        var $3280 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3280;
                        break;
                    case 'Fm.Term.ref':
                        var $3281 = self.name;
                        var $3282 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3282;
                        break;
                    case 'Fm.Term.typ':
                        var $3283 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3283;
                        break;
                    case 'Fm.Term.all':
                        var $3284 = self.eras;
                        var $3285 = self.self;
                        var $3286 = self.name;
                        var $3287 = self.xtyp;
                        var $3288 = self.body;
                        var $3289 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3289;
                        break;
                    case 'Fm.Term.lam':
                        var $3290 = self.name;
                        var $3291 = self.body;
                        var $3292 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3292;
                        break;
                    case 'Fm.Term.app':
                        var $3293 = self.func;
                        var $3294 = self.argm;
                        var $3295 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3295;
                        break;
                    case 'Fm.Term.let':
                        var $3296 = self.name;
                        var $3297 = self.expr;
                        var $3298 = self.body;
                        var $3299 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3299;
                        break;
                    case 'Fm.Term.def':
                        var $3300 = self.name;
                        var $3301 = self.expr;
                        var $3302 = self.body;
                        var $3303 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3303;
                        break;
                    case 'Fm.Term.ann':
                        var $3304 = self.done;
                        var $3305 = self.term;
                        var $3306 = self.type;
                        var $3307 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3307;
                        break;
                    case 'Fm.Term.gol':
                        var $3308 = self.name;
                        var $3309 = self.dref;
                        var $3310 = self.verb;
                        var $3311 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3311;
                        break;
                    case 'Fm.Term.hol':
                        var $3312 = self.path;
                        var $3313 = Fm$Term$equal$patch$($3312, _a$1, Unit$new);
                        var $3277 = $3313;
                        break;
                    case 'Fm.Term.nat':
                        var $3314 = self.natx;
                        var $3315 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3315;
                        break;
                    case 'Fm.Term.chr':
                        var $3316 = self.chrx;
                        var $3317 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3317;
                        break;
                    case 'Fm.Term.str':
                        var $3318 = self.strx;
                        var $3319 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3319;
                        break;
                    case 'Fm.Term.cse':
                        var $3320 = self.path;
                        var $3321 = self.expr;
                        var $3322 = self.name;
                        var $3323 = self.with;
                        var $3324 = self.cses;
                        var $3325 = self.moti;
                        var $3326 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3277 = $3326;
                        break;
                    case 'Fm.Term.ori':
                        var $3327 = self.orig;
                        var $3328 = self.expr;
                        var $3329 = Fm$Term$equal$extra_holes$(_a$1, $3328);
                        var $3277 = $3329;
                        break;
                };
                var $2774 = $3277;
                break;
            case 'Fm.Term.hol':
                var $3330 = self.path;
                var $3331 = Fm$Term$equal$patch$($3330, _b$2, Unit$new);
                var $2774 = $3331;
                break;
            case 'Fm.Term.nat':
                var $3332 = self.natx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3334 = self.name;
                        var $3335 = self.indx;
                        var $3336 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3336;
                        break;
                    case 'Fm.Term.ref':
                        var $3337 = self.name;
                        var $3338 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3338;
                        break;
                    case 'Fm.Term.typ':
                        var $3339 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3339;
                        break;
                    case 'Fm.Term.all':
                        var $3340 = self.eras;
                        var $3341 = self.self;
                        var $3342 = self.name;
                        var $3343 = self.xtyp;
                        var $3344 = self.body;
                        var $3345 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3345;
                        break;
                    case 'Fm.Term.lam':
                        var $3346 = self.name;
                        var $3347 = self.body;
                        var $3348 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3348;
                        break;
                    case 'Fm.Term.app':
                        var $3349 = self.func;
                        var $3350 = self.argm;
                        var $3351 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3351;
                        break;
                    case 'Fm.Term.let':
                        var $3352 = self.name;
                        var $3353 = self.expr;
                        var $3354 = self.body;
                        var $3355 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3355;
                        break;
                    case 'Fm.Term.def':
                        var $3356 = self.name;
                        var $3357 = self.expr;
                        var $3358 = self.body;
                        var $3359 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3359;
                        break;
                    case 'Fm.Term.ann':
                        var $3360 = self.done;
                        var $3361 = self.term;
                        var $3362 = self.type;
                        var $3363 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3363;
                        break;
                    case 'Fm.Term.gol':
                        var $3364 = self.name;
                        var $3365 = self.dref;
                        var $3366 = self.verb;
                        var $3367 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3367;
                        break;
                    case 'Fm.Term.hol':
                        var $3368 = self.path;
                        var $3369 = Fm$Term$equal$patch$($3368, _a$1, Unit$new);
                        var $3333 = $3369;
                        break;
                    case 'Fm.Term.nat':
                        var $3370 = self.natx;
                        var $3371 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3371;
                        break;
                    case 'Fm.Term.chr':
                        var $3372 = self.chrx;
                        var $3373 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3373;
                        break;
                    case 'Fm.Term.str':
                        var $3374 = self.strx;
                        var $3375 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3375;
                        break;
                    case 'Fm.Term.cse':
                        var $3376 = self.path;
                        var $3377 = self.expr;
                        var $3378 = self.name;
                        var $3379 = self.with;
                        var $3380 = self.cses;
                        var $3381 = self.moti;
                        var $3382 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3333 = $3382;
                        break;
                    case 'Fm.Term.ori':
                        var $3383 = self.orig;
                        var $3384 = self.expr;
                        var $3385 = Fm$Term$equal$extra_holes$(_a$1, $3384);
                        var $3333 = $3385;
                        break;
                };
                var $2774 = $3333;
                break;
            case 'Fm.Term.chr':
                var $3386 = self.chrx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3388 = self.name;
                        var $3389 = self.indx;
                        var $3390 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3390;
                        break;
                    case 'Fm.Term.ref':
                        var $3391 = self.name;
                        var $3392 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3392;
                        break;
                    case 'Fm.Term.typ':
                        var $3393 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3393;
                        break;
                    case 'Fm.Term.all':
                        var $3394 = self.eras;
                        var $3395 = self.self;
                        var $3396 = self.name;
                        var $3397 = self.xtyp;
                        var $3398 = self.body;
                        var $3399 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3399;
                        break;
                    case 'Fm.Term.lam':
                        var $3400 = self.name;
                        var $3401 = self.body;
                        var $3402 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3402;
                        break;
                    case 'Fm.Term.app':
                        var $3403 = self.func;
                        var $3404 = self.argm;
                        var $3405 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3405;
                        break;
                    case 'Fm.Term.let':
                        var $3406 = self.name;
                        var $3407 = self.expr;
                        var $3408 = self.body;
                        var $3409 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3409;
                        break;
                    case 'Fm.Term.def':
                        var $3410 = self.name;
                        var $3411 = self.expr;
                        var $3412 = self.body;
                        var $3413 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3413;
                        break;
                    case 'Fm.Term.ann':
                        var $3414 = self.done;
                        var $3415 = self.term;
                        var $3416 = self.type;
                        var $3417 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3417;
                        break;
                    case 'Fm.Term.gol':
                        var $3418 = self.name;
                        var $3419 = self.dref;
                        var $3420 = self.verb;
                        var $3421 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3421;
                        break;
                    case 'Fm.Term.hol':
                        var $3422 = self.path;
                        var $3423 = Fm$Term$equal$patch$($3422, _a$1, Unit$new);
                        var $3387 = $3423;
                        break;
                    case 'Fm.Term.nat':
                        var $3424 = self.natx;
                        var $3425 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3425;
                        break;
                    case 'Fm.Term.chr':
                        var $3426 = self.chrx;
                        var $3427 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3427;
                        break;
                    case 'Fm.Term.str':
                        var $3428 = self.strx;
                        var $3429 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3429;
                        break;
                    case 'Fm.Term.cse':
                        var $3430 = self.path;
                        var $3431 = self.expr;
                        var $3432 = self.name;
                        var $3433 = self.with;
                        var $3434 = self.cses;
                        var $3435 = self.moti;
                        var $3436 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3387 = $3436;
                        break;
                    case 'Fm.Term.ori':
                        var $3437 = self.orig;
                        var $3438 = self.expr;
                        var $3439 = Fm$Term$equal$extra_holes$(_a$1, $3438);
                        var $3387 = $3439;
                        break;
                };
                var $2774 = $3387;
                break;
            case 'Fm.Term.str':
                var $3440 = self.strx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3442 = self.name;
                        var $3443 = self.indx;
                        var $3444 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3444;
                        break;
                    case 'Fm.Term.ref':
                        var $3445 = self.name;
                        var $3446 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3446;
                        break;
                    case 'Fm.Term.typ':
                        var $3447 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3447;
                        break;
                    case 'Fm.Term.all':
                        var $3448 = self.eras;
                        var $3449 = self.self;
                        var $3450 = self.name;
                        var $3451 = self.xtyp;
                        var $3452 = self.body;
                        var $3453 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3453;
                        break;
                    case 'Fm.Term.lam':
                        var $3454 = self.name;
                        var $3455 = self.body;
                        var $3456 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3456;
                        break;
                    case 'Fm.Term.app':
                        var $3457 = self.func;
                        var $3458 = self.argm;
                        var $3459 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3459;
                        break;
                    case 'Fm.Term.let':
                        var $3460 = self.name;
                        var $3461 = self.expr;
                        var $3462 = self.body;
                        var $3463 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3463;
                        break;
                    case 'Fm.Term.def':
                        var $3464 = self.name;
                        var $3465 = self.expr;
                        var $3466 = self.body;
                        var $3467 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3467;
                        break;
                    case 'Fm.Term.ann':
                        var $3468 = self.done;
                        var $3469 = self.term;
                        var $3470 = self.type;
                        var $3471 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3471;
                        break;
                    case 'Fm.Term.gol':
                        var $3472 = self.name;
                        var $3473 = self.dref;
                        var $3474 = self.verb;
                        var $3475 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3475;
                        break;
                    case 'Fm.Term.hol':
                        var $3476 = self.path;
                        var $3477 = Fm$Term$equal$patch$($3476, _a$1, Unit$new);
                        var $3441 = $3477;
                        break;
                    case 'Fm.Term.nat':
                        var $3478 = self.natx;
                        var $3479 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3479;
                        break;
                    case 'Fm.Term.chr':
                        var $3480 = self.chrx;
                        var $3481 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3481;
                        break;
                    case 'Fm.Term.str':
                        var $3482 = self.strx;
                        var $3483 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3483;
                        break;
                    case 'Fm.Term.cse':
                        var $3484 = self.path;
                        var $3485 = self.expr;
                        var $3486 = self.name;
                        var $3487 = self.with;
                        var $3488 = self.cses;
                        var $3489 = self.moti;
                        var $3490 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3441 = $3490;
                        break;
                    case 'Fm.Term.ori':
                        var $3491 = self.orig;
                        var $3492 = self.expr;
                        var $3493 = Fm$Term$equal$extra_holes$(_a$1, $3492);
                        var $3441 = $3493;
                        break;
                };
                var $2774 = $3441;
                break;
            case 'Fm.Term.cse':
                var $3494 = self.path;
                var $3495 = self.expr;
                var $3496 = self.name;
                var $3497 = self.with;
                var $3498 = self.cses;
                var $3499 = self.moti;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3501 = self.name;
                        var $3502 = self.indx;
                        var $3503 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3503;
                        break;
                    case 'Fm.Term.ref':
                        var $3504 = self.name;
                        var $3505 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3505;
                        break;
                    case 'Fm.Term.typ':
                        var $3506 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3506;
                        break;
                    case 'Fm.Term.all':
                        var $3507 = self.eras;
                        var $3508 = self.self;
                        var $3509 = self.name;
                        var $3510 = self.xtyp;
                        var $3511 = self.body;
                        var $3512 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3512;
                        break;
                    case 'Fm.Term.lam':
                        var $3513 = self.name;
                        var $3514 = self.body;
                        var $3515 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3515;
                        break;
                    case 'Fm.Term.app':
                        var $3516 = self.func;
                        var $3517 = self.argm;
                        var $3518 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3518;
                        break;
                    case 'Fm.Term.let':
                        var $3519 = self.name;
                        var $3520 = self.expr;
                        var $3521 = self.body;
                        var $3522 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3522;
                        break;
                    case 'Fm.Term.def':
                        var $3523 = self.name;
                        var $3524 = self.expr;
                        var $3525 = self.body;
                        var $3526 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3526;
                        break;
                    case 'Fm.Term.ann':
                        var $3527 = self.done;
                        var $3528 = self.term;
                        var $3529 = self.type;
                        var $3530 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3530;
                        break;
                    case 'Fm.Term.gol':
                        var $3531 = self.name;
                        var $3532 = self.dref;
                        var $3533 = self.verb;
                        var $3534 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3534;
                        break;
                    case 'Fm.Term.hol':
                        var $3535 = self.path;
                        var $3536 = Fm$Term$equal$patch$($3535, _a$1, Unit$new);
                        var $3500 = $3536;
                        break;
                    case 'Fm.Term.nat':
                        var $3537 = self.natx;
                        var $3538 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3538;
                        break;
                    case 'Fm.Term.chr':
                        var $3539 = self.chrx;
                        var $3540 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3540;
                        break;
                    case 'Fm.Term.str':
                        var $3541 = self.strx;
                        var $3542 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3542;
                        break;
                    case 'Fm.Term.cse':
                        var $3543 = self.path;
                        var $3544 = self.expr;
                        var $3545 = self.name;
                        var $3546 = self.with;
                        var $3547 = self.cses;
                        var $3548 = self.moti;
                        var $3549 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3500 = $3549;
                        break;
                    case 'Fm.Term.ori':
                        var $3550 = self.orig;
                        var $3551 = self.expr;
                        var $3552 = Fm$Term$equal$extra_holes$(_a$1, $3551);
                        var $3500 = $3552;
                        break;
                };
                var $2774 = $3500;
                break;
            case 'Fm.Term.ori':
                var $3553 = self.orig;
                var $3554 = self.expr;
                var $3555 = Fm$Term$equal$extra_holes$($3554, _b$2);
                var $2774 = $3555;
                break;
        };
        return $2774;
    };
    const Fm$Term$equal$extra_holes = x0 => x1 => Fm$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $3556 = Map$set$(_bits$1, Unit$new, _set$2);
        return $3556;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $3558 = _b$2;
            var $3557 = $3558;
        } else {
            var $3559 = (!_b$2);
            var $3557 = $3559;
        };
        return $3557;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Fm$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Fm$Term$serialize$(Fm$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$e);
        var _bh$7 = Fm$Term$serialize$(Fm$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $3561 = Monad$pure$(Fm$Check$monad)(Bool$true);
            var $3560 = $3561;
        } else {
            var _a1$8 = Fm$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Fm$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Fm$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$e);
            var _bh$11 = Fm$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $3563 = Monad$pure$(Fm$Check$monad)(Bool$true);
                var $3562 = $3563;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = Set$has$(_id$12, _seen$5);
                if (self) {
                    var $3565 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$(_a$1, _b$2))((_$13 => {
                        var $3566 = Monad$pure$(Fm$Check$monad)(Bool$true);
                        return $3566;
                    }));
                    var $3564 = $3565;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Fm.Term.var':
                            var $3568 = self.name;
                            var $3569 = self.indx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3571 = self.name;
                                    var $3572 = self.indx;
                                    var $3573 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3573;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3574 = self.name;
                                    var $3575 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3575;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3576 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3576;
                                    break;
                                case 'Fm.Term.all':
                                    var $3577 = self.eras;
                                    var $3578 = self.self;
                                    var $3579 = self.name;
                                    var $3580 = self.xtyp;
                                    var $3581 = self.body;
                                    var $3582 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3582;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3583 = self.name;
                                    var $3584 = self.body;
                                    var $3585 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3585;
                                    break;
                                case 'Fm.Term.app':
                                    var $3586 = self.func;
                                    var $3587 = self.argm;
                                    var $3588 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3588;
                                    break;
                                case 'Fm.Term.let':
                                    var $3589 = self.name;
                                    var $3590 = self.expr;
                                    var $3591 = self.body;
                                    var $3592 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3592;
                                    break;
                                case 'Fm.Term.def':
                                    var $3593 = self.name;
                                    var $3594 = self.expr;
                                    var $3595 = self.body;
                                    var $3596 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3596;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3597 = self.done;
                                    var $3598 = self.term;
                                    var $3599 = self.type;
                                    var $3600 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3600;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3601 = self.name;
                                    var $3602 = self.dref;
                                    var $3603 = self.verb;
                                    var $3604 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3604;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3605 = self.path;
                                    var $3606 = Fm$Term$equal$patch$($3605, _a$1, Bool$true);
                                    var $3570 = $3606;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3607 = self.natx;
                                    var $3608 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3608;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3609 = self.chrx;
                                    var $3610 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3610;
                                    break;
                                case 'Fm.Term.str':
                                    var $3611 = self.strx;
                                    var $3612 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3612;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3613 = self.path;
                                    var $3614 = self.expr;
                                    var $3615 = self.name;
                                    var $3616 = self.with;
                                    var $3617 = self.cses;
                                    var $3618 = self.moti;
                                    var $3619 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3619;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3620 = self.orig;
                                    var $3621 = self.expr;
                                    var $3622 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3570 = $3622;
                                    break;
                            };
                            var $3567 = $3570;
                            break;
                        case 'Fm.Term.ref':
                            var $3623 = self.name;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3625 = self.name;
                                    var $3626 = self.indx;
                                    var $3627 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3627;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3628 = self.name;
                                    var $3629 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3629;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3630 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3630;
                                    break;
                                case 'Fm.Term.all':
                                    var $3631 = self.eras;
                                    var $3632 = self.self;
                                    var $3633 = self.name;
                                    var $3634 = self.xtyp;
                                    var $3635 = self.body;
                                    var $3636 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3636;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3637 = self.name;
                                    var $3638 = self.body;
                                    var $3639 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3639;
                                    break;
                                case 'Fm.Term.app':
                                    var $3640 = self.func;
                                    var $3641 = self.argm;
                                    var $3642 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3642;
                                    break;
                                case 'Fm.Term.let':
                                    var $3643 = self.name;
                                    var $3644 = self.expr;
                                    var $3645 = self.body;
                                    var $3646 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3646;
                                    break;
                                case 'Fm.Term.def':
                                    var $3647 = self.name;
                                    var $3648 = self.expr;
                                    var $3649 = self.body;
                                    var $3650 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3650;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3651 = self.done;
                                    var $3652 = self.term;
                                    var $3653 = self.type;
                                    var $3654 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3654;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3655 = self.name;
                                    var $3656 = self.dref;
                                    var $3657 = self.verb;
                                    var $3658 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3658;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3659 = self.path;
                                    var $3660 = Fm$Term$equal$patch$($3659, _a$1, Bool$true);
                                    var $3624 = $3660;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3661 = self.natx;
                                    var $3662 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3662;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3663 = self.chrx;
                                    var $3664 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3664;
                                    break;
                                case 'Fm.Term.str':
                                    var $3665 = self.strx;
                                    var $3666 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3666;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3667 = self.path;
                                    var $3668 = self.expr;
                                    var $3669 = self.name;
                                    var $3670 = self.with;
                                    var $3671 = self.cses;
                                    var $3672 = self.moti;
                                    var $3673 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3673;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3674 = self.orig;
                                    var $3675 = self.expr;
                                    var $3676 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3624 = $3676;
                                    break;
                            };
                            var $3567 = $3624;
                            break;
                        case 'Fm.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3678 = self.name;
                                    var $3679 = self.indx;
                                    var $3680 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3680;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3681 = self.name;
                                    var $3682 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3682;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3683 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3683;
                                    break;
                                case 'Fm.Term.all':
                                    var $3684 = self.eras;
                                    var $3685 = self.self;
                                    var $3686 = self.name;
                                    var $3687 = self.xtyp;
                                    var $3688 = self.body;
                                    var $3689 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3689;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3690 = self.name;
                                    var $3691 = self.body;
                                    var $3692 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3692;
                                    break;
                                case 'Fm.Term.app':
                                    var $3693 = self.func;
                                    var $3694 = self.argm;
                                    var $3695 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3695;
                                    break;
                                case 'Fm.Term.let':
                                    var $3696 = self.name;
                                    var $3697 = self.expr;
                                    var $3698 = self.body;
                                    var $3699 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3699;
                                    break;
                                case 'Fm.Term.def':
                                    var $3700 = self.name;
                                    var $3701 = self.expr;
                                    var $3702 = self.body;
                                    var $3703 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3703;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3704 = self.done;
                                    var $3705 = self.term;
                                    var $3706 = self.type;
                                    var $3707 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3707;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3708 = self.name;
                                    var $3709 = self.dref;
                                    var $3710 = self.verb;
                                    var $3711 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3711;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3712 = self.path;
                                    var $3713 = Fm$Term$equal$patch$($3712, _a$1, Bool$true);
                                    var $3677 = $3713;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3714 = self.natx;
                                    var $3715 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3715;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3716 = self.chrx;
                                    var $3717 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3717;
                                    break;
                                case 'Fm.Term.str':
                                    var $3718 = self.strx;
                                    var $3719 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3719;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3720 = self.path;
                                    var $3721 = self.expr;
                                    var $3722 = self.name;
                                    var $3723 = self.with;
                                    var $3724 = self.cses;
                                    var $3725 = self.moti;
                                    var $3726 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3726;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3727 = self.orig;
                                    var $3728 = self.expr;
                                    var $3729 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3677 = $3729;
                                    break;
                            };
                            var $3567 = $3677;
                            break;
                        case 'Fm.Term.all':
                            var $3730 = self.eras;
                            var $3731 = self.self;
                            var $3732 = self.name;
                            var $3733 = self.xtyp;
                            var $3734 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3736 = self.name;
                                    var $3737 = self.indx;
                                    var $3738 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3738;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3739 = self.name;
                                    var $3740 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3740;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3741 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3741;
                                    break;
                                case 'Fm.Term.all':
                                    var $3742 = self.eras;
                                    var $3743 = self.self;
                                    var $3744 = self.name;
                                    var $3745 = self.xtyp;
                                    var $3746 = self.body;
                                    var _seen$23 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$24 = $3734(Fm$Term$var$($3731, _lv$4))(Fm$Term$var$($3732, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $3746(Fm$Term$var$($3743, _lv$4))(Fm$Term$var$($3744, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($3731 === $3743);
                                    var _eq_eras$27 = Bool$eql$($3730, $3742);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var $3748 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3733, $3745, _defs$3, _lv$4, _seen$23))((_eq_type$28 => {
                                            var $3749 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23))((_eq_body$29 => {
                                                var $3750 = Monad$pure$(Fm$Check$monad)((_eq_type$28 && _eq_body$29));
                                                return $3750;
                                            }));
                                            return $3749;
                                        }));
                                        var $3747 = $3748;
                                    } else {
                                        var $3751 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                        var $3747 = $3751;
                                    };
                                    var $3735 = $3747;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3752 = self.name;
                                    var $3753 = self.body;
                                    var $3754 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3754;
                                    break;
                                case 'Fm.Term.app':
                                    var $3755 = self.func;
                                    var $3756 = self.argm;
                                    var $3757 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3757;
                                    break;
                                case 'Fm.Term.let':
                                    var $3758 = self.name;
                                    var $3759 = self.expr;
                                    var $3760 = self.body;
                                    var $3761 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3761;
                                    break;
                                case 'Fm.Term.def':
                                    var $3762 = self.name;
                                    var $3763 = self.expr;
                                    var $3764 = self.body;
                                    var $3765 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3765;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3766 = self.done;
                                    var $3767 = self.term;
                                    var $3768 = self.type;
                                    var $3769 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3769;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3770 = self.name;
                                    var $3771 = self.dref;
                                    var $3772 = self.verb;
                                    var $3773 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3773;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3774 = self.path;
                                    var $3775 = Fm$Term$equal$patch$($3774, _a$1, Bool$true);
                                    var $3735 = $3775;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3776 = self.natx;
                                    var $3777 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3777;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3778 = self.chrx;
                                    var $3779 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3779;
                                    break;
                                case 'Fm.Term.str':
                                    var $3780 = self.strx;
                                    var $3781 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3781;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3782 = self.path;
                                    var $3783 = self.expr;
                                    var $3784 = self.name;
                                    var $3785 = self.with;
                                    var $3786 = self.cses;
                                    var $3787 = self.moti;
                                    var $3788 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3788;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3789 = self.orig;
                                    var $3790 = self.expr;
                                    var $3791 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3735 = $3791;
                                    break;
                            };
                            var $3567 = $3735;
                            break;
                        case 'Fm.Term.lam':
                            var $3792 = self.name;
                            var $3793 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3795 = self.name;
                                    var $3796 = self.indx;
                                    var $3797 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3797;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3798 = self.name;
                                    var $3799 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3799;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3800 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3800;
                                    break;
                                case 'Fm.Term.all':
                                    var $3801 = self.eras;
                                    var $3802 = self.self;
                                    var $3803 = self.name;
                                    var $3804 = self.xtyp;
                                    var $3805 = self.body;
                                    var $3806 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3806;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3807 = self.name;
                                    var $3808 = self.body;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$18 = $3793(Fm$Term$var$($3792, _lv$4));
                                    var _b1_body$19 = $3808(Fm$Term$var$($3807, _lv$4));
                                    var $3809 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17))((_eq_body$20 => {
                                        var $3810 = Monad$pure$(Fm$Check$monad)(_eq_body$20);
                                        return $3810;
                                    }));
                                    var $3794 = $3809;
                                    break;
                                case 'Fm.Term.app':
                                    var $3811 = self.func;
                                    var $3812 = self.argm;
                                    var $3813 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3813;
                                    break;
                                case 'Fm.Term.let':
                                    var $3814 = self.name;
                                    var $3815 = self.expr;
                                    var $3816 = self.body;
                                    var $3817 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3817;
                                    break;
                                case 'Fm.Term.def':
                                    var $3818 = self.name;
                                    var $3819 = self.expr;
                                    var $3820 = self.body;
                                    var $3821 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3821;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3822 = self.done;
                                    var $3823 = self.term;
                                    var $3824 = self.type;
                                    var $3825 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3825;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3826 = self.name;
                                    var $3827 = self.dref;
                                    var $3828 = self.verb;
                                    var $3829 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3829;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3830 = self.path;
                                    var $3831 = Fm$Term$equal$patch$($3830, _a$1, Bool$true);
                                    var $3794 = $3831;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3832 = self.natx;
                                    var $3833 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3833;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3834 = self.chrx;
                                    var $3835 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3835;
                                    break;
                                case 'Fm.Term.str':
                                    var $3836 = self.strx;
                                    var $3837 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3837;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3838 = self.path;
                                    var $3839 = self.expr;
                                    var $3840 = self.name;
                                    var $3841 = self.with;
                                    var $3842 = self.cses;
                                    var $3843 = self.moti;
                                    var $3844 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3844;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3845 = self.orig;
                                    var $3846 = self.expr;
                                    var $3847 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3794 = $3847;
                                    break;
                            };
                            var $3567 = $3794;
                            break;
                        case 'Fm.Term.app':
                            var $3848 = self.func;
                            var $3849 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3851 = self.name;
                                    var $3852 = self.indx;
                                    var $3853 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3853;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3854 = self.name;
                                    var $3855 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3855;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3856 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3856;
                                    break;
                                case 'Fm.Term.all':
                                    var $3857 = self.eras;
                                    var $3858 = self.self;
                                    var $3859 = self.name;
                                    var $3860 = self.xtyp;
                                    var $3861 = self.body;
                                    var $3862 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3862;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3863 = self.name;
                                    var $3864 = self.body;
                                    var $3865 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3865;
                                    break;
                                case 'Fm.Term.app':
                                    var $3866 = self.func;
                                    var $3867 = self.argm;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var $3868 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3848, $3866, _defs$3, _lv$4, _seen$17))((_eq_func$18 => {
                                        var $3869 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3849, $3867, _defs$3, _lv$4, _seen$17))((_eq_argm$19 => {
                                            var $3870 = Monad$pure$(Fm$Check$monad)((_eq_func$18 && _eq_argm$19));
                                            return $3870;
                                        }));
                                        return $3869;
                                    }));
                                    var $3850 = $3868;
                                    break;
                                case 'Fm.Term.let':
                                    var $3871 = self.name;
                                    var $3872 = self.expr;
                                    var $3873 = self.body;
                                    var $3874 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3874;
                                    break;
                                case 'Fm.Term.def':
                                    var $3875 = self.name;
                                    var $3876 = self.expr;
                                    var $3877 = self.body;
                                    var $3878 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3878;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3879 = self.done;
                                    var $3880 = self.term;
                                    var $3881 = self.type;
                                    var $3882 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3882;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3883 = self.name;
                                    var $3884 = self.dref;
                                    var $3885 = self.verb;
                                    var $3886 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3886;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3887 = self.path;
                                    var $3888 = Fm$Term$equal$patch$($3887, _a$1, Bool$true);
                                    var $3850 = $3888;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3889 = self.natx;
                                    var $3890 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3890;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3891 = self.chrx;
                                    var $3892 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3892;
                                    break;
                                case 'Fm.Term.str':
                                    var $3893 = self.strx;
                                    var $3894 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3894;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3895 = self.path;
                                    var $3896 = self.expr;
                                    var $3897 = self.name;
                                    var $3898 = self.with;
                                    var $3899 = self.cses;
                                    var $3900 = self.moti;
                                    var $3901 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3901;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3902 = self.orig;
                                    var $3903 = self.expr;
                                    var $3904 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3850 = $3904;
                                    break;
                            };
                            var $3567 = $3850;
                            break;
                        case 'Fm.Term.let':
                            var $3905 = self.name;
                            var $3906 = self.expr;
                            var $3907 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3909 = self.name;
                                    var $3910 = self.indx;
                                    var $3911 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3911;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3912 = self.name;
                                    var $3913 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3913;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3914 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3914;
                                    break;
                                case 'Fm.Term.all':
                                    var $3915 = self.eras;
                                    var $3916 = self.self;
                                    var $3917 = self.name;
                                    var $3918 = self.xtyp;
                                    var $3919 = self.body;
                                    var $3920 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3920;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3921 = self.name;
                                    var $3922 = self.body;
                                    var $3923 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3923;
                                    break;
                                case 'Fm.Term.app':
                                    var $3924 = self.func;
                                    var $3925 = self.argm;
                                    var $3926 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3926;
                                    break;
                                case 'Fm.Term.let':
                                    var $3927 = self.name;
                                    var $3928 = self.expr;
                                    var $3929 = self.body;
                                    var _seen$19 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$20 = $3907(Fm$Term$var$($3905, _lv$4));
                                    var _b1_body$21 = $3929(Fm$Term$var$($3927, _lv$4));
                                    var $3930 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3906, $3928, _defs$3, _lv$4, _seen$19))((_eq_expr$22 => {
                                        var $3931 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19))((_eq_body$23 => {
                                            var $3932 = Monad$pure$(Fm$Check$monad)((_eq_expr$22 && _eq_body$23));
                                            return $3932;
                                        }));
                                        return $3931;
                                    }));
                                    var $3908 = $3930;
                                    break;
                                case 'Fm.Term.def':
                                    var $3933 = self.name;
                                    var $3934 = self.expr;
                                    var $3935 = self.body;
                                    var $3936 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3936;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3937 = self.done;
                                    var $3938 = self.term;
                                    var $3939 = self.type;
                                    var $3940 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3940;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3941 = self.name;
                                    var $3942 = self.dref;
                                    var $3943 = self.verb;
                                    var $3944 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3944;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3945 = self.path;
                                    var $3946 = Fm$Term$equal$patch$($3945, _a$1, Bool$true);
                                    var $3908 = $3946;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3947 = self.natx;
                                    var $3948 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3948;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3949 = self.chrx;
                                    var $3950 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3950;
                                    break;
                                case 'Fm.Term.str':
                                    var $3951 = self.strx;
                                    var $3952 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3952;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3953 = self.path;
                                    var $3954 = self.expr;
                                    var $3955 = self.name;
                                    var $3956 = self.with;
                                    var $3957 = self.cses;
                                    var $3958 = self.moti;
                                    var $3959 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3959;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3960 = self.orig;
                                    var $3961 = self.expr;
                                    var $3962 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3908 = $3962;
                                    break;
                            };
                            var $3567 = $3908;
                            break;
                        case 'Fm.Term.def':
                            var $3963 = self.name;
                            var $3964 = self.expr;
                            var $3965 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3967 = self.name;
                                    var $3968 = self.indx;
                                    var $3969 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $3969;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3970 = self.name;
                                    var $3971 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $3971;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3972 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $3972;
                                    break;
                                case 'Fm.Term.all':
                                    var $3973 = self.eras;
                                    var $3974 = self.self;
                                    var $3975 = self.name;
                                    var $3976 = self.xtyp;
                                    var $3977 = self.body;
                                    var $3978 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $3978;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3979 = self.name;
                                    var $3980 = self.body;
                                    var $3981 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $3981;
                                    break;
                                case 'Fm.Term.app':
                                    var $3982 = self.func;
                                    var $3983 = self.argm;
                                    var $3984 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $3984;
                                    break;
                                case 'Fm.Term.let':
                                    var $3985 = self.name;
                                    var $3986 = self.expr;
                                    var $3987 = self.body;
                                    var $3988 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $3988;
                                    break;
                                case 'Fm.Term.def':
                                    var $3989 = self.name;
                                    var $3990 = self.expr;
                                    var $3991 = self.body;
                                    var $3992 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $3992;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3993 = self.done;
                                    var $3994 = self.term;
                                    var $3995 = self.type;
                                    var $3996 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $3996;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3997 = self.name;
                                    var $3998 = self.dref;
                                    var $3999 = self.verb;
                                    var $4000 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $4000;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4001 = self.path;
                                    var $4002 = Fm$Term$equal$patch$($4001, _a$1, Bool$true);
                                    var $3966 = $4002;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4003 = self.natx;
                                    var $4004 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $4004;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4005 = self.chrx;
                                    var $4006 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $4006;
                                    break;
                                case 'Fm.Term.str':
                                    var $4007 = self.strx;
                                    var $4008 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $4008;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4009 = self.path;
                                    var $4010 = self.expr;
                                    var $4011 = self.name;
                                    var $4012 = self.with;
                                    var $4013 = self.cses;
                                    var $4014 = self.moti;
                                    var $4015 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $4015;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4016 = self.orig;
                                    var $4017 = self.expr;
                                    var $4018 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3966 = $4018;
                                    break;
                            };
                            var $3567 = $3966;
                            break;
                        case 'Fm.Term.ann':
                            var $4019 = self.done;
                            var $4020 = self.term;
                            var $4021 = self.type;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4023 = self.name;
                                    var $4024 = self.indx;
                                    var $4025 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4025;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4026 = self.name;
                                    var $4027 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4027;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4028 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4028;
                                    break;
                                case 'Fm.Term.all':
                                    var $4029 = self.eras;
                                    var $4030 = self.self;
                                    var $4031 = self.name;
                                    var $4032 = self.xtyp;
                                    var $4033 = self.body;
                                    var $4034 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4034;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4035 = self.name;
                                    var $4036 = self.body;
                                    var $4037 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4037;
                                    break;
                                case 'Fm.Term.app':
                                    var $4038 = self.func;
                                    var $4039 = self.argm;
                                    var $4040 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4040;
                                    break;
                                case 'Fm.Term.let':
                                    var $4041 = self.name;
                                    var $4042 = self.expr;
                                    var $4043 = self.body;
                                    var $4044 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4044;
                                    break;
                                case 'Fm.Term.def':
                                    var $4045 = self.name;
                                    var $4046 = self.expr;
                                    var $4047 = self.body;
                                    var $4048 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4048;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4049 = self.done;
                                    var $4050 = self.term;
                                    var $4051 = self.type;
                                    var $4052 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4052;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4053 = self.name;
                                    var $4054 = self.dref;
                                    var $4055 = self.verb;
                                    var $4056 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4056;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4057 = self.path;
                                    var $4058 = Fm$Term$equal$patch$($4057, _a$1, Bool$true);
                                    var $4022 = $4058;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4059 = self.natx;
                                    var $4060 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4060;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4061 = self.chrx;
                                    var $4062 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4062;
                                    break;
                                case 'Fm.Term.str':
                                    var $4063 = self.strx;
                                    var $4064 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4064;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4065 = self.path;
                                    var $4066 = self.expr;
                                    var $4067 = self.name;
                                    var $4068 = self.with;
                                    var $4069 = self.cses;
                                    var $4070 = self.moti;
                                    var $4071 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4071;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4072 = self.orig;
                                    var $4073 = self.expr;
                                    var $4074 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4022 = $4074;
                                    break;
                            };
                            var $3567 = $4022;
                            break;
                        case 'Fm.Term.gol':
                            var $4075 = self.name;
                            var $4076 = self.dref;
                            var $4077 = self.verb;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4079 = self.name;
                                    var $4080 = self.indx;
                                    var $4081 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4081;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4082 = self.name;
                                    var $4083 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4083;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4084 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4084;
                                    break;
                                case 'Fm.Term.all':
                                    var $4085 = self.eras;
                                    var $4086 = self.self;
                                    var $4087 = self.name;
                                    var $4088 = self.xtyp;
                                    var $4089 = self.body;
                                    var $4090 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4090;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4091 = self.name;
                                    var $4092 = self.body;
                                    var $4093 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4093;
                                    break;
                                case 'Fm.Term.app':
                                    var $4094 = self.func;
                                    var $4095 = self.argm;
                                    var $4096 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4096;
                                    break;
                                case 'Fm.Term.let':
                                    var $4097 = self.name;
                                    var $4098 = self.expr;
                                    var $4099 = self.body;
                                    var $4100 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4100;
                                    break;
                                case 'Fm.Term.def':
                                    var $4101 = self.name;
                                    var $4102 = self.expr;
                                    var $4103 = self.body;
                                    var $4104 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4104;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4105 = self.done;
                                    var $4106 = self.term;
                                    var $4107 = self.type;
                                    var $4108 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4108;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4109 = self.name;
                                    var $4110 = self.dref;
                                    var $4111 = self.verb;
                                    var $4112 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4112;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4113 = self.path;
                                    var $4114 = Fm$Term$equal$patch$($4113, _a$1, Bool$true);
                                    var $4078 = $4114;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4115 = self.natx;
                                    var $4116 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4116;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4117 = self.chrx;
                                    var $4118 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4118;
                                    break;
                                case 'Fm.Term.str':
                                    var $4119 = self.strx;
                                    var $4120 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4120;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4121 = self.path;
                                    var $4122 = self.expr;
                                    var $4123 = self.name;
                                    var $4124 = self.with;
                                    var $4125 = self.cses;
                                    var $4126 = self.moti;
                                    var $4127 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4127;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4128 = self.orig;
                                    var $4129 = self.expr;
                                    var $4130 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4078 = $4130;
                                    break;
                            };
                            var $3567 = $4078;
                            break;
                        case 'Fm.Term.hol':
                            var $4131 = self.path;
                            var $4132 = Fm$Term$equal$patch$($4131, _b$2, Bool$true);
                            var $3567 = $4132;
                            break;
                        case 'Fm.Term.nat':
                            var $4133 = self.natx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4135 = self.name;
                                    var $4136 = self.indx;
                                    var $4137 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4137;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4138 = self.name;
                                    var $4139 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4139;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4140 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4140;
                                    break;
                                case 'Fm.Term.all':
                                    var $4141 = self.eras;
                                    var $4142 = self.self;
                                    var $4143 = self.name;
                                    var $4144 = self.xtyp;
                                    var $4145 = self.body;
                                    var $4146 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4146;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4147 = self.name;
                                    var $4148 = self.body;
                                    var $4149 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4149;
                                    break;
                                case 'Fm.Term.app':
                                    var $4150 = self.func;
                                    var $4151 = self.argm;
                                    var $4152 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4152;
                                    break;
                                case 'Fm.Term.let':
                                    var $4153 = self.name;
                                    var $4154 = self.expr;
                                    var $4155 = self.body;
                                    var $4156 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4156;
                                    break;
                                case 'Fm.Term.def':
                                    var $4157 = self.name;
                                    var $4158 = self.expr;
                                    var $4159 = self.body;
                                    var $4160 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4160;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4161 = self.done;
                                    var $4162 = self.term;
                                    var $4163 = self.type;
                                    var $4164 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4164;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4165 = self.name;
                                    var $4166 = self.dref;
                                    var $4167 = self.verb;
                                    var $4168 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4168;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4169 = self.path;
                                    var $4170 = Fm$Term$equal$patch$($4169, _a$1, Bool$true);
                                    var $4134 = $4170;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4171 = self.natx;
                                    var $4172 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4172;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4173 = self.chrx;
                                    var $4174 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4174;
                                    break;
                                case 'Fm.Term.str':
                                    var $4175 = self.strx;
                                    var $4176 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4176;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4177 = self.path;
                                    var $4178 = self.expr;
                                    var $4179 = self.name;
                                    var $4180 = self.with;
                                    var $4181 = self.cses;
                                    var $4182 = self.moti;
                                    var $4183 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4183;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4184 = self.orig;
                                    var $4185 = self.expr;
                                    var $4186 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4134 = $4186;
                                    break;
                            };
                            var $3567 = $4134;
                            break;
                        case 'Fm.Term.chr':
                            var $4187 = self.chrx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4189 = self.name;
                                    var $4190 = self.indx;
                                    var $4191 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4191;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4192 = self.name;
                                    var $4193 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4193;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4194 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4194;
                                    break;
                                case 'Fm.Term.all':
                                    var $4195 = self.eras;
                                    var $4196 = self.self;
                                    var $4197 = self.name;
                                    var $4198 = self.xtyp;
                                    var $4199 = self.body;
                                    var $4200 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4200;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4201 = self.name;
                                    var $4202 = self.body;
                                    var $4203 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4203;
                                    break;
                                case 'Fm.Term.app':
                                    var $4204 = self.func;
                                    var $4205 = self.argm;
                                    var $4206 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4206;
                                    break;
                                case 'Fm.Term.let':
                                    var $4207 = self.name;
                                    var $4208 = self.expr;
                                    var $4209 = self.body;
                                    var $4210 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4210;
                                    break;
                                case 'Fm.Term.def':
                                    var $4211 = self.name;
                                    var $4212 = self.expr;
                                    var $4213 = self.body;
                                    var $4214 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4214;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4215 = self.done;
                                    var $4216 = self.term;
                                    var $4217 = self.type;
                                    var $4218 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4218;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4219 = self.name;
                                    var $4220 = self.dref;
                                    var $4221 = self.verb;
                                    var $4222 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4222;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4223 = self.path;
                                    var $4224 = Fm$Term$equal$patch$($4223, _a$1, Bool$true);
                                    var $4188 = $4224;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4225 = self.natx;
                                    var $4226 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4226;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4227 = self.chrx;
                                    var $4228 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4228;
                                    break;
                                case 'Fm.Term.str':
                                    var $4229 = self.strx;
                                    var $4230 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4230;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4231 = self.path;
                                    var $4232 = self.expr;
                                    var $4233 = self.name;
                                    var $4234 = self.with;
                                    var $4235 = self.cses;
                                    var $4236 = self.moti;
                                    var $4237 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4237;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4238 = self.orig;
                                    var $4239 = self.expr;
                                    var $4240 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4188 = $4240;
                                    break;
                            };
                            var $3567 = $4188;
                            break;
                        case 'Fm.Term.str':
                            var $4241 = self.strx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4243 = self.name;
                                    var $4244 = self.indx;
                                    var $4245 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4245;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4246 = self.name;
                                    var $4247 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4247;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4248 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4248;
                                    break;
                                case 'Fm.Term.all':
                                    var $4249 = self.eras;
                                    var $4250 = self.self;
                                    var $4251 = self.name;
                                    var $4252 = self.xtyp;
                                    var $4253 = self.body;
                                    var $4254 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4254;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4255 = self.name;
                                    var $4256 = self.body;
                                    var $4257 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4257;
                                    break;
                                case 'Fm.Term.app':
                                    var $4258 = self.func;
                                    var $4259 = self.argm;
                                    var $4260 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4260;
                                    break;
                                case 'Fm.Term.let':
                                    var $4261 = self.name;
                                    var $4262 = self.expr;
                                    var $4263 = self.body;
                                    var $4264 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4264;
                                    break;
                                case 'Fm.Term.def':
                                    var $4265 = self.name;
                                    var $4266 = self.expr;
                                    var $4267 = self.body;
                                    var $4268 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4268;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4269 = self.done;
                                    var $4270 = self.term;
                                    var $4271 = self.type;
                                    var $4272 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4272;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4273 = self.name;
                                    var $4274 = self.dref;
                                    var $4275 = self.verb;
                                    var $4276 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4276;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4277 = self.path;
                                    var $4278 = Fm$Term$equal$patch$($4277, _a$1, Bool$true);
                                    var $4242 = $4278;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4279 = self.natx;
                                    var $4280 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4280;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4281 = self.chrx;
                                    var $4282 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4282;
                                    break;
                                case 'Fm.Term.str':
                                    var $4283 = self.strx;
                                    var $4284 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4284;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4285 = self.path;
                                    var $4286 = self.expr;
                                    var $4287 = self.name;
                                    var $4288 = self.with;
                                    var $4289 = self.cses;
                                    var $4290 = self.moti;
                                    var $4291 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4291;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4292 = self.orig;
                                    var $4293 = self.expr;
                                    var $4294 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4242 = $4294;
                                    break;
                            };
                            var $3567 = $4242;
                            break;
                        case 'Fm.Term.cse':
                            var $4295 = self.path;
                            var $4296 = self.expr;
                            var $4297 = self.name;
                            var $4298 = self.with;
                            var $4299 = self.cses;
                            var $4300 = self.moti;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4302 = self.name;
                                    var $4303 = self.indx;
                                    var $4304 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4304;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4305 = self.name;
                                    var $4306 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4306;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4307 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4307;
                                    break;
                                case 'Fm.Term.all':
                                    var $4308 = self.eras;
                                    var $4309 = self.self;
                                    var $4310 = self.name;
                                    var $4311 = self.xtyp;
                                    var $4312 = self.body;
                                    var $4313 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4313;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4314 = self.name;
                                    var $4315 = self.body;
                                    var $4316 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4316;
                                    break;
                                case 'Fm.Term.app':
                                    var $4317 = self.func;
                                    var $4318 = self.argm;
                                    var $4319 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4319;
                                    break;
                                case 'Fm.Term.let':
                                    var $4320 = self.name;
                                    var $4321 = self.expr;
                                    var $4322 = self.body;
                                    var $4323 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4323;
                                    break;
                                case 'Fm.Term.def':
                                    var $4324 = self.name;
                                    var $4325 = self.expr;
                                    var $4326 = self.body;
                                    var $4327 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4327;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4328 = self.done;
                                    var $4329 = self.term;
                                    var $4330 = self.type;
                                    var $4331 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4331;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4332 = self.name;
                                    var $4333 = self.dref;
                                    var $4334 = self.verb;
                                    var $4335 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4335;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4336 = self.path;
                                    var $4337 = Fm$Term$equal$patch$($4336, _a$1, Bool$true);
                                    var $4301 = $4337;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4338 = self.natx;
                                    var $4339 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4339;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4340 = self.chrx;
                                    var $4341 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4341;
                                    break;
                                case 'Fm.Term.str':
                                    var $4342 = self.strx;
                                    var $4343 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4343;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4344 = self.path;
                                    var $4345 = self.expr;
                                    var $4346 = self.name;
                                    var $4347 = self.with;
                                    var $4348 = self.cses;
                                    var $4349 = self.moti;
                                    var $4350 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4350;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4351 = self.orig;
                                    var $4352 = self.expr;
                                    var $4353 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4301 = $4353;
                                    break;
                            };
                            var $3567 = $4301;
                            break;
                        case 'Fm.Term.ori':
                            var $4354 = self.orig;
                            var $4355 = self.expr;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4357 = self.name;
                                    var $4358 = self.indx;
                                    var $4359 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4359;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4360 = self.name;
                                    var $4361 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4361;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4362 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4362;
                                    break;
                                case 'Fm.Term.all':
                                    var $4363 = self.eras;
                                    var $4364 = self.self;
                                    var $4365 = self.name;
                                    var $4366 = self.xtyp;
                                    var $4367 = self.body;
                                    var $4368 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4368;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4369 = self.name;
                                    var $4370 = self.body;
                                    var $4371 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4371;
                                    break;
                                case 'Fm.Term.app':
                                    var $4372 = self.func;
                                    var $4373 = self.argm;
                                    var $4374 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4374;
                                    break;
                                case 'Fm.Term.let':
                                    var $4375 = self.name;
                                    var $4376 = self.expr;
                                    var $4377 = self.body;
                                    var $4378 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4378;
                                    break;
                                case 'Fm.Term.def':
                                    var $4379 = self.name;
                                    var $4380 = self.expr;
                                    var $4381 = self.body;
                                    var $4382 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4382;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4383 = self.done;
                                    var $4384 = self.term;
                                    var $4385 = self.type;
                                    var $4386 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4386;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4387 = self.name;
                                    var $4388 = self.dref;
                                    var $4389 = self.verb;
                                    var $4390 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4390;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4391 = self.path;
                                    var $4392 = Fm$Term$equal$patch$($4391, _a$1, Bool$true);
                                    var $4356 = $4392;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4393 = self.natx;
                                    var $4394 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4394;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4395 = self.chrx;
                                    var $4396 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4396;
                                    break;
                                case 'Fm.Term.str':
                                    var $4397 = self.strx;
                                    var $4398 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4398;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4399 = self.path;
                                    var $4400 = self.expr;
                                    var $4401 = self.name;
                                    var $4402 = self.with;
                                    var $4403 = self.cses;
                                    var $4404 = self.moti;
                                    var $4405 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4405;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4406 = self.orig;
                                    var $4407 = self.expr;
                                    var $4408 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4356 = $4408;
                                    break;
                            };
                            var $3567 = $4356;
                            break;
                    };
                    var $3564 = $3567;
                };
                var $3562 = $3564;
            };
            var $3560 = $3562;
        };
        return $3560;
    };
    const Fm$Term$equal = x0 => x1 => x2 => x3 => x4 => Fm$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;

    function Fm$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var $4409 = Monad$bind$(Fm$Check$monad)((() => {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $4410 = self.name;
                    var $4411 = self.indx;
                    var self = List$at_last$($4411, _ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4413 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4410), List$nil));
                            var $4412 = $4413;
                            break;
                        case 'Maybe.some':
                            var $4414 = self.value;
                            var $4415 = Monad$pure$(Fm$Check$monad)((() => {
                                var self = $4414;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4416 = self.fst;
                                        var $4417 = self.snd;
                                        var $4418 = $4417;
                                        return $4418;
                                };
                            })());
                            var $4412 = $4415;
                            break;
                    };
                    return $4412;
                case 'Fm.Term.ref':
                    var $4419 = self.name;
                    var self = Fm$get$($4419, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4421 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4419), List$nil));
                            var $4420 = $4421;
                            break;
                        case 'Maybe.some':
                            var $4422 = self.value;
                            var self = $4422;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $4424 = self.file;
                                    var $4425 = self.code;
                                    var $4426 = self.name;
                                    var $4427 = self.term;
                                    var $4428 = self.type;
                                    var $4429 = self.stat;
                                    var _ref_name$15 = $4426;
                                    var _ref_type$16 = $4428;
                                    var _ref_term$17 = $4427;
                                    var _ref_stat$18 = $4429;
                                    var self = _ref_stat$18;
                                    switch (self._) {
                                        case 'Fm.Status.init':
                                            var $4431 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$waiting$(_ref_name$15), List$nil));
                                            var $4430 = $4431;
                                            break;
                                        case 'Fm.Status.wait':
                                            var $4432 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4430 = $4432;
                                            break;
                                        case 'Fm.Status.done':
                                            var $4433 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4430 = $4433;
                                            break;
                                        case 'Fm.Status.fail':
                                            var $4434 = self.errors;
                                            var $4435 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$indirect$(_ref_name$15), List$nil));
                                            var $4430 = $4435;
                                            break;
                                    };
                                    var $4423 = $4430;
                                    break;
                            };
                            var $4420 = $4423;
                            break;
                    };
                    return $4420;
                case 'Fm.Term.typ':
                    var $4436 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                    return $4436;
                case 'Fm.Term.all':
                    var $4437 = self.eras;
                    var $4438 = self.self;
                    var $4439 = self.name;
                    var $4440 = self.xtyp;
                    var $4441 = self.body;
                    var _ctx_size$12 = List$length$(_ctx$4);
                    var _self_var$13 = Fm$Term$var$($4438, _ctx_size$12);
                    var _body_var$14 = Fm$Term$var$($4439, Nat$succ$(_ctx_size$12));
                    var _body_ctx$15 = List$cons$(Pair$new$($4439, $4440), List$cons$(Pair$new$($4438, _term$1), _ctx$4));
                    var $4442 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4440, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$16 => {
                        var $4443 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4441(_self_var$13)(_body_var$14), Maybe$some$(Fm$Term$typ), _defs$3, _body_ctx$15, Fm$MPath$i$(_path$5), _orig$6))((_$17 => {
                            var $4444 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                            return $4444;
                        }));
                        return $4443;
                    }));
                    return $4442;
                case 'Fm.Term.lam':
                    var $4445 = self.name;
                    var $4446 = self.body;
                    var self = _type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4448 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                            var $4447 = $4448;
                            break;
                        case 'Maybe.some':
                            var $4449 = self.value;
                            var _typv$10 = Fm$Term$reduce$($4449, _defs$3);
                            var self = _typv$10;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4451 = self.name;
                                    var $4452 = self.indx;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4449);
                                    var $4453 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4450 = $4453;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4454 = self.name;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4449);
                                    var $4455 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4450 = $4455;
                                    break;
                                case 'Fm.Term.typ':
                                    var _expected$11 = Either$left$("Function");
                                    var _detected$12 = Either$right$($4449);
                                    var $4456 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                    var $4450 = $4456;
                                    break;
                                case 'Fm.Term.all':
                                    var $4457 = self.eras;
                                    var $4458 = self.self;
                                    var $4459 = self.name;
                                    var $4460 = self.xtyp;
                                    var $4461 = self.body;
                                    var _ctx_size$16 = List$length$(_ctx$4);
                                    var _self_var$17 = _term$1;
                                    var _body_var$18 = Fm$Term$var$($4445, _ctx_size$16);
                                    var _body_typ$19 = $4461(_self_var$17)(_body_var$18);
                                    var _body_ctx$20 = List$cons$(Pair$new$($4445, $4460), _ctx$4);
                                    var $4462 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4446(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Fm$MPath$o$(_path$5), _orig$6))((_$21 => {
                                        var $4463 = Monad$pure$(Fm$Check$monad)($4449);
                                        return $4463;
                                    }));
                                    var $4450 = $4462;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4464 = self.name;
                                    var $4465 = self.body;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4449);
                                    var $4466 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4450 = $4466;
                                    break;
                                case 'Fm.Term.app':
                                    var $4467 = self.func;
                                    var $4468 = self.argm;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4449);
                                    var $4469 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4450 = $4469;
                                    break;
                                case 'Fm.Term.let':
                                    var $4470 = self.name;
                                    var $4471 = self.expr;
                                    var $4472 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4449);
                                    var $4473 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4450 = $4473;
                                    break;
                                case 'Fm.Term.def':
                                    var $4474 = self.name;
                                    var $4475 = self.expr;
                                    var $4476 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4449);
                                    var $4477 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4450 = $4477;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4478 = self.done;
                                    var $4479 = self.term;
                                    var $4480 = self.type;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4449);
                                    var $4481 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4450 = $4481;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4482 = self.name;
                                    var $4483 = self.dref;
                                    var $4484 = self.verb;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4449);
                                    var $4485 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4450 = $4485;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4486 = self.path;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4449);
                                    var $4487 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4450 = $4487;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4488 = self.natx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4449);
                                    var $4489 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4450 = $4489;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4490 = self.chrx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4449);
                                    var $4491 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4450 = $4491;
                                    break;
                                case 'Fm.Term.str':
                                    var $4492 = self.strx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4449);
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
                                    var _detected$18 = Either$right$($4449);
                                    var $4500 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                    var $4450 = $4500;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4501 = self.orig;
                                    var $4502 = self.expr;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4449);
                                    var $4503 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4450 = $4503;
                                    break;
                            };
                            var $4447 = $4450;
                            break;
                    };
                    return $4447;
                case 'Fm.Term.app':
                    var $4504 = self.func;
                    var $4505 = self.argm;
                    var $4506 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4504, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_func_typ$9 => {
                        var _func_typ$10 = Fm$Term$reduce$(_func_typ$9, _defs$3);
                        var self = _func_typ$10;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $4508 = self.name;
                                var $4509 = self.indx;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4510 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4507 = $4510;
                                break;
                            case 'Fm.Term.ref':
                                var $4511 = self.name;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4512 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4507 = $4512;
                                break;
                            case 'Fm.Term.typ':
                                var _expected$11 = Either$left$("Function");
                                var _detected$12 = Either$right$(_func_typ$10);
                                var $4513 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4507 = $4513;
                                break;
                            case 'Fm.Term.all':
                                var $4514 = self.eras;
                                var $4515 = self.self;
                                var $4516 = self.name;
                                var $4517 = self.xtyp;
                                var $4518 = self.body;
                                var $4519 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4505, Maybe$some$($4517), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$16 => {
                                    var $4520 = Monad$pure$(Fm$Check$monad)($4518($4504)($4505));
                                    return $4520;
                                }));
                                var $4507 = $4519;
                                break;
                            case 'Fm.Term.lam':
                                var $4521 = self.name;
                                var $4522 = self.body;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4523 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4507 = $4523;
                                break;
                            case 'Fm.Term.app':
                                var $4524 = self.func;
                                var $4525 = self.argm;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4526 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4507 = $4526;
                                break;
                            case 'Fm.Term.let':
                                var $4527 = self.name;
                                var $4528 = self.expr;
                                var $4529 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4530 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4507 = $4530;
                                break;
                            case 'Fm.Term.def':
                                var $4531 = self.name;
                                var $4532 = self.expr;
                                var $4533 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4534 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4507 = $4534;
                                break;
                            case 'Fm.Term.ann':
                                var $4535 = self.done;
                                var $4536 = self.term;
                                var $4537 = self.type;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4538 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4507 = $4538;
                                break;
                            case 'Fm.Term.gol':
                                var $4539 = self.name;
                                var $4540 = self.dref;
                                var $4541 = self.verb;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4542 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4507 = $4542;
                                break;
                            case 'Fm.Term.hol':
                                var $4543 = self.path;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4544 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4507 = $4544;
                                break;
                            case 'Fm.Term.nat':
                                var $4545 = self.natx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4546 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4507 = $4546;
                                break;
                            case 'Fm.Term.chr':
                                var $4547 = self.chrx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4548 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4507 = $4548;
                                break;
                            case 'Fm.Term.str':
                                var $4549 = self.strx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4550 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4507 = $4550;
                                break;
                            case 'Fm.Term.cse':
                                var $4551 = self.path;
                                var $4552 = self.expr;
                                var $4553 = self.name;
                                var $4554 = self.with;
                                var $4555 = self.cses;
                                var $4556 = self.moti;
                                var _expected$17 = Either$left$("Function");
                                var _detected$18 = Either$right$(_func_typ$10);
                                var $4557 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4507 = $4557;
                                break;
                            case 'Fm.Term.ori':
                                var $4558 = self.orig;
                                var $4559 = self.expr;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4560 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4507 = $4560;
                                break;
                        };
                        return $4507;
                    }));
                    return $4506;
                case 'Fm.Term.let':
                    var $4561 = self.name;
                    var $4562 = self.expr;
                    var $4563 = self.body;
                    var _ctx_size$10 = List$length$(_ctx$4);
                    var $4564 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4562, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_expr_typ$11 => {
                        var _body_val$12 = $4563(Fm$Term$var$($4561, _ctx_size$10));
                        var _body_ctx$13 = List$cons$(Pair$new$($4561, _expr_typ$11), _ctx$4);
                        var $4565 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_body_val$12, _type$2, _defs$3, _body_ctx$13, Fm$MPath$i$(_path$5), _orig$6))((_body_typ$14 => {
                            var $4566 = Monad$pure$(Fm$Check$monad)(_body_typ$14);
                            return $4566;
                        }));
                        return $4565;
                    }));
                    return $4564;
                case 'Fm.Term.def':
                    var $4567 = self.name;
                    var $4568 = self.expr;
                    var $4569 = self.body;
                    var $4570 = Fm$Term$check$($4569($4568), _type$2, _defs$3, _ctx$4, _path$5, _orig$6);
                    return $4570;
                case 'Fm.Term.ann':
                    var $4571 = self.done;
                    var $4572 = self.term;
                    var $4573 = self.type;
                    var self = $4571;
                    if (self) {
                        var $4575 = Monad$pure$(Fm$Check$monad)($4573);
                        var $4574 = $4575;
                    } else {
                        var $4576 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4572, Maybe$some$($4573), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$10 => {
                            var $4577 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4573, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$11 => {
                                var $4578 = Monad$pure$(Fm$Check$monad)($4573);
                                return $4578;
                            }));
                            return $4577;
                        }));
                        var $4574 = $4576;
                    };
                    return $4574;
                case 'Fm.Term.gol':
                    var $4579 = self.name;
                    var $4580 = self.dref;
                    var $4581 = self.verb;
                    var $4582 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$show_goal$($4579, $4580, $4581, _type$2, _ctx$4), List$nil));
                    return $4582;
                case 'Fm.Term.hol':
                    var $4583 = self.path;
                    var $4584 = Fm$Check$result$(_type$2, List$nil);
                    return $4584;
                case 'Fm.Term.nat':
                    var $4585 = self.natx;
                    var $4586 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Nat"));
                    return $4586;
                case 'Fm.Term.chr':
                    var $4587 = self.chrx;
                    var $4588 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Char"));
                    return $4588;
                case 'Fm.Term.str':
                    var $4589 = self.strx;
                    var $4590 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("String"));
                    return $4590;
                case 'Fm.Term.cse':
                    var $4591 = self.path;
                    var $4592 = self.expr;
                    var $4593 = self.name;
                    var $4594 = self.with;
                    var $4595 = self.cses;
                    var $4596 = self.moti;
                    var _expr$13 = $4592;
                    var $4597 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_etyp$14 => {
                        var self = $4596;
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _type$2;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4600 = Fm$Term$hol$(Bits$e);
                                        var _moti$15 = $4600;
                                        break;
                                    case 'Maybe.some':
                                        var $4601 = self.value;
                                        var _size$16 = List$length$(_ctx$4);
                                        var _typv$17 = Fm$Term$normalize$($4601, Map$new);
                                        var _moti$18 = Fm$SmartMotive$make$($4593, $4592, _etyp$14, _typv$17, _size$16, _defs$3);
                                        var $4602 = _moti$18;
                                        var _moti$15 = $4602;
                                        break;
                                };
                                var $4599 = Maybe$some$(Fm$Term$cse$($4591, $4592, $4593, $4594, $4595, Maybe$some$(_moti$15)));
                                var _dsug$15 = $4599;
                                break;
                            case 'Maybe.some':
                                var $4603 = self.value;
                                var $4604 = Fm$Term$desugar_cse$($4592, $4593, $4594, $4595, $4603, _etyp$14, _defs$3, _ctx$4);
                                var _dsug$15 = $4604;
                                break;
                        };
                        var self = _dsug$15;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4605 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                var $4598 = $4605;
                                break;
                            case 'Maybe.some':
                                var $4606 = self.value;
                                var $4607 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$patch$(Fm$MPath$to_bits$(_path$5), $4606), List$nil));
                                var $4598 = $4607;
                                break;
                        };
                        return $4598;
                    }));
                    return $4597;
                case 'Fm.Term.ori':
                    var $4608 = self.orig;
                    var $4609 = self.expr;
                    var $4610 = Fm$Term$check$($4609, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($4608));
                    return $4610;
            };
        })())((_infr$7 => {
            var self = _type$2;
            switch (self._) {
                case 'Maybe.none':
                    var $4612 = Fm$Check$result$(Maybe$some$(_infr$7), List$nil);
                    var $4611 = $4612;
                    break;
                case 'Maybe.some':
                    var $4613 = self.value;
                    var $4614 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($4613, _infr$7, _defs$3, List$length$(_ctx$4), Set$new))((_eqls$9 => {
                        var self = _eqls$9;
                        if (self) {
                            var $4616 = Monad$pure$(Fm$Check$monad)($4613);
                            var $4615 = $4616;
                        } else {
                            var $4617 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, Either$right$($4613), Either$right$(_infr$7), _ctx$4), List$nil));
                            var $4615 = $4617;
                        };
                        return $4615;
                    }));
                    var $4611 = $4614;
                    break;
            };
            return $4611;
        }));
        return $4409;
    };
    const Fm$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Term$check$(x0, x1, x2, x3, x4, x5);

    function Fm$Path$nil$(_x$1) {
        var $4618 = _x$1;
        return $4618;
    };
    const Fm$Path$nil = x0 => Fm$Path$nil$(x0);
    const Fm$MPath$nil = Maybe$some$(Fm$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $4620 = Bool$true;
                var $4619 = $4620;
                break;
            case 'List.cons':
                var $4621 = self.head;
                var $4622 = self.tail;
                var $4623 = Bool$false;
                var $4619 = $4623;
                break;
        };
        return $4619;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Fm$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Fm.Term.var':
                var $4625 = self.name;
                var $4626 = self.indx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4628 = _fn$3(_term$2);
                        var $4627 = $4628;
                        break;
                    case 'o':
                        var $4629 = self.slice(0, -1);
                        var $4630 = _term$2;
                        var $4627 = $4630;
                        break;
                    case 'i':
                        var $4631 = self.slice(0, -1);
                        var $4632 = _term$2;
                        var $4627 = $4632;
                        break;
                };
                var $4624 = $4627;
                break;
            case 'Fm.Term.ref':
                var $4633 = self.name;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4635 = _fn$3(_term$2);
                        var $4634 = $4635;
                        break;
                    case 'o':
                        var $4636 = self.slice(0, -1);
                        var $4637 = _term$2;
                        var $4634 = $4637;
                        break;
                    case 'i':
                        var $4638 = self.slice(0, -1);
                        var $4639 = _term$2;
                        var $4634 = $4639;
                        break;
                };
                var $4624 = $4634;
                break;
            case 'Fm.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4641 = _fn$3(_term$2);
                        var $4640 = $4641;
                        break;
                    case 'o':
                        var $4642 = self.slice(0, -1);
                        var $4643 = _term$2;
                        var $4640 = $4643;
                        break;
                    case 'i':
                        var $4644 = self.slice(0, -1);
                        var $4645 = _term$2;
                        var $4640 = $4645;
                        break;
                };
                var $4624 = $4640;
                break;
            case 'Fm.Term.all':
                var $4646 = self.eras;
                var $4647 = self.self;
                var $4648 = self.name;
                var $4649 = self.xtyp;
                var $4650 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4652 = _fn$3(_term$2);
                        var $4651 = $4652;
                        break;
                    case 'o':
                        var $4653 = self.slice(0, -1);
                        var $4654 = Fm$Term$all$($4646, $4647, $4648, Fm$Term$patch_at$($4653, $4649, _fn$3), $4650);
                        var $4651 = $4654;
                        break;
                    case 'i':
                        var $4655 = self.slice(0, -1);
                        var $4656 = Fm$Term$all$($4646, $4647, $4648, $4649, (_s$10 => _x$11 => {
                            var $4657 = Fm$Term$patch_at$($4655, $4650(_s$10)(_x$11), _fn$3);
                            return $4657;
                        }));
                        var $4651 = $4656;
                        break;
                };
                var $4624 = $4651;
                break;
            case 'Fm.Term.lam':
                var $4658 = self.name;
                var $4659 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4661 = _fn$3(_term$2);
                        var $4660 = $4661;
                        break;
                    case 'o':
                        var $4662 = self.slice(0, -1);
                        var $4663 = Fm$Term$lam$($4658, (_x$7 => {
                            var $4664 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4659(_x$7), _fn$3);
                            return $4664;
                        }));
                        var $4660 = $4663;
                        break;
                    case 'i':
                        var $4665 = self.slice(0, -1);
                        var $4666 = Fm$Term$lam$($4658, (_x$7 => {
                            var $4667 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4659(_x$7), _fn$3);
                            return $4667;
                        }));
                        var $4660 = $4666;
                        break;
                };
                var $4624 = $4660;
                break;
            case 'Fm.Term.app':
                var $4668 = self.func;
                var $4669 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4671 = _fn$3(_term$2);
                        var $4670 = $4671;
                        break;
                    case 'o':
                        var $4672 = self.slice(0, -1);
                        var $4673 = Fm$Term$app$(Fm$Term$patch_at$($4672, $4668, _fn$3), $4669);
                        var $4670 = $4673;
                        break;
                    case 'i':
                        var $4674 = self.slice(0, -1);
                        var $4675 = Fm$Term$app$($4668, Fm$Term$patch_at$($4674, $4669, _fn$3));
                        var $4670 = $4675;
                        break;
                };
                var $4624 = $4670;
                break;
            case 'Fm.Term.let':
                var $4676 = self.name;
                var $4677 = self.expr;
                var $4678 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4680 = _fn$3(_term$2);
                        var $4679 = $4680;
                        break;
                    case 'o':
                        var $4681 = self.slice(0, -1);
                        var $4682 = Fm$Term$let$($4676, Fm$Term$patch_at$($4681, $4677, _fn$3), $4678);
                        var $4679 = $4682;
                        break;
                    case 'i':
                        var $4683 = self.slice(0, -1);
                        var $4684 = Fm$Term$let$($4676, $4677, (_x$8 => {
                            var $4685 = Fm$Term$patch_at$($4683, $4678(_x$8), _fn$3);
                            return $4685;
                        }));
                        var $4679 = $4684;
                        break;
                };
                var $4624 = $4679;
                break;
            case 'Fm.Term.def':
                var $4686 = self.name;
                var $4687 = self.expr;
                var $4688 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4690 = _fn$3(_term$2);
                        var $4689 = $4690;
                        break;
                    case 'o':
                        var $4691 = self.slice(0, -1);
                        var $4692 = Fm$Term$def$($4686, Fm$Term$patch_at$($4691, $4687, _fn$3), $4688);
                        var $4689 = $4692;
                        break;
                    case 'i':
                        var $4693 = self.slice(0, -1);
                        var $4694 = Fm$Term$def$($4686, $4687, (_x$8 => {
                            var $4695 = Fm$Term$patch_at$($4693, $4688(_x$8), _fn$3);
                            return $4695;
                        }));
                        var $4689 = $4694;
                        break;
                };
                var $4624 = $4689;
                break;
            case 'Fm.Term.ann':
                var $4696 = self.done;
                var $4697 = self.term;
                var $4698 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4700 = _fn$3(_term$2);
                        var $4699 = $4700;
                        break;
                    case 'o':
                        var $4701 = self.slice(0, -1);
                        var $4702 = Fm$Term$ann$($4696, Fm$Term$patch_at$($4701, $4697, _fn$3), $4698);
                        var $4699 = $4702;
                        break;
                    case 'i':
                        var $4703 = self.slice(0, -1);
                        var $4704 = Fm$Term$ann$($4696, $4697, Fm$Term$patch_at$($4703, $4698, _fn$3));
                        var $4699 = $4704;
                        break;
                };
                var $4624 = $4699;
                break;
            case 'Fm.Term.gol':
                var $4705 = self.name;
                var $4706 = self.dref;
                var $4707 = self.verb;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4709 = _fn$3(_term$2);
                        var $4708 = $4709;
                        break;
                    case 'o':
                        var $4710 = self.slice(0, -1);
                        var $4711 = _term$2;
                        var $4708 = $4711;
                        break;
                    case 'i':
                        var $4712 = self.slice(0, -1);
                        var $4713 = _term$2;
                        var $4708 = $4713;
                        break;
                };
                var $4624 = $4708;
                break;
            case 'Fm.Term.hol':
                var $4714 = self.path;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4716 = _fn$3(_term$2);
                        var $4715 = $4716;
                        break;
                    case 'o':
                        var $4717 = self.slice(0, -1);
                        var $4718 = _term$2;
                        var $4715 = $4718;
                        break;
                    case 'i':
                        var $4719 = self.slice(0, -1);
                        var $4720 = _term$2;
                        var $4715 = $4720;
                        break;
                };
                var $4624 = $4715;
                break;
            case 'Fm.Term.nat':
                var $4721 = self.natx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4723 = _fn$3(_term$2);
                        var $4722 = $4723;
                        break;
                    case 'o':
                        var $4724 = self.slice(0, -1);
                        var $4725 = _term$2;
                        var $4722 = $4725;
                        break;
                    case 'i':
                        var $4726 = self.slice(0, -1);
                        var $4727 = _term$2;
                        var $4722 = $4727;
                        break;
                };
                var $4624 = $4722;
                break;
            case 'Fm.Term.chr':
                var $4728 = self.chrx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4730 = _fn$3(_term$2);
                        var $4729 = $4730;
                        break;
                    case 'o':
                        var $4731 = self.slice(0, -1);
                        var $4732 = _term$2;
                        var $4729 = $4732;
                        break;
                    case 'i':
                        var $4733 = self.slice(0, -1);
                        var $4734 = _term$2;
                        var $4729 = $4734;
                        break;
                };
                var $4624 = $4729;
                break;
            case 'Fm.Term.str':
                var $4735 = self.strx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4737 = _fn$3(_term$2);
                        var $4736 = $4737;
                        break;
                    case 'o':
                        var $4738 = self.slice(0, -1);
                        var $4739 = _term$2;
                        var $4736 = $4739;
                        break;
                    case 'i':
                        var $4740 = self.slice(0, -1);
                        var $4741 = _term$2;
                        var $4736 = $4741;
                        break;
                };
                var $4624 = $4736;
                break;
            case 'Fm.Term.cse':
                var $4742 = self.path;
                var $4743 = self.expr;
                var $4744 = self.name;
                var $4745 = self.with;
                var $4746 = self.cses;
                var $4747 = self.moti;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4749 = _fn$3(_term$2);
                        var $4748 = $4749;
                        break;
                    case 'o':
                        var $4750 = self.slice(0, -1);
                        var $4751 = _term$2;
                        var $4748 = $4751;
                        break;
                    case 'i':
                        var $4752 = self.slice(0, -1);
                        var $4753 = _term$2;
                        var $4748 = $4753;
                        break;
                };
                var $4624 = $4748;
                break;
            case 'Fm.Term.ori':
                var $4754 = self.orig;
                var $4755 = self.expr;
                var $4756 = Fm$Term$patch_at$(_path$1, $4755, _fn$3);
                var $4624 = $4756;
                break;
        };
        return $4624;
    };
    const Fm$Term$patch_at = x0 => x1 => x2 => Fm$Term$patch_at$(x0, x1, x2);

    function Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, _errs$7, _fixd$8) {
        var self = _errs$7;
        switch (self._) {
            case 'List.nil':
                var self = _fixd$8;
                if (self) {
                    var _type$9 = Fm$Term$bind$(List$nil, (_x$9 => {
                        var $4760 = (_x$9 + '1');
                        return $4760;
                    }), _type$5);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $4761 = (_x$10 + '0');
                        return $4761;
                    }), _term$4);
                    var _defs$11 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$10, _type$9, Fm$Status$init), _defs$6);
                    var $4759 = Monad$pure$(IO$monad)(Maybe$some$(_defs$11));
                    var $4758 = $4759;
                } else {
                    var $4762 = Monad$pure$(IO$monad)(Maybe$none);
                    var $4758 = $4762;
                };
                var $4757 = $4758;
                break;
            case 'List.cons':
                var $4763 = self.head;
                var $4764 = self.tail;
                var self = $4763;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $4766 = self.origin;
                        var $4767 = self.expected;
                        var $4768 = self.detected;
                        var $4769 = self.context;
                        var $4770 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4764, _fixd$8);
                        var $4765 = $4770;
                        break;
                    case 'Fm.Error.show_goal':
                        var $4771 = self.name;
                        var $4772 = self.dref;
                        var $4773 = self.verb;
                        var $4774 = self.goal;
                        var $4775 = self.context;
                        var $4776 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4764, _fixd$8);
                        var $4765 = $4776;
                        break;
                    case 'Fm.Error.waiting':
                        var $4777 = self.name;
                        var $4778 = Monad$bind$(IO$monad)(Fm$Synth$one$($4777, _defs$6))((_defs$12 => {
                            var $4779 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$12, $4764, Bool$true);
                            return $4779;
                        }));
                        var $4765 = $4778;
                        break;
                    case 'Fm.Error.indirect':
                        var $4780 = self.name;
                        var $4781 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4764, _fixd$8);
                        var $4765 = $4781;
                        break;
                    case 'Fm.Error.patch':
                        var $4782 = self.path;
                        var $4783 = self.term;
                        var self = $4782;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'e':
                                var $4785 = Monad$pure$(IO$monad)(Maybe$none);
                                var $4784 = $4785;
                                break;
                            case 'o':
                                var $4786 = self.slice(0, -1);
                                var _term$14 = Fm$Term$patch_at$($4786, _term$4, (_x$14 => {
                                    var $4788 = $4783;
                                    return $4788;
                                }));
                                var $4787 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$14, _type$5, _defs$6, $4764, Bool$true);
                                var $4784 = $4787;
                                break;
                            case 'i':
                                var $4789 = self.slice(0, -1);
                                var _type$14 = Fm$Term$patch_at$($4789, _type$5, (_x$14 => {
                                    var $4791 = $4783;
                                    return $4791;
                                }));
                                var $4790 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$14, _defs$6, $4764, Bool$true);
                                var $4784 = $4790;
                                break;
                        };
                        var $4765 = $4784;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $4792 = self.origin;
                        var $4793 = self.name;
                        var $4794 = Monad$bind$(IO$monad)(Fm$Synth$one$($4793, _defs$6))((_defs$13 => {
                            var $4795 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$13, $4764, Bool$true);
                            return $4795;
                        }));
                        var $4765 = $4794;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $4796 = self.origin;
                        var $4797 = self.term;
                        var $4798 = self.context;
                        var $4799 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4764, _fixd$8);
                        var $4765 = $4799;
                        break;
                };
                var $4757 = $4765;
                break;
        };
        return $4757;
    };
    const Fm$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Status$fail$(_errors$1) {
        var $4800 = ({
            _: 'Fm.Status.fail',
            'errors': _errors$1
        });
        return $4800;
    };
    const Fm$Status$fail = x0 => Fm$Status$fail$(x0);

    function Fm$Synth$one$(_name$1, _defs$2) {
        var self = Fm$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.none':
                var $4802 = Monad$bind$(IO$monad)(Fm$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4804 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("Undefined: ", List$cons$(_name$1, List$nil)))))((_$4 => {
                                var $4805 = Monad$pure$(IO$monad)(_defs$2);
                                return $4805;
                            }));
                            var $4803 = $4804;
                            break;
                        case 'Maybe.some':
                            var $4806 = self.value;
                            var $4807 = Fm$Synth$one$(_name$1, $4806);
                            var $4803 = $4807;
                            break;
                    };
                    return $4803;
                }));
                var $4801 = $4802;
                break;
            case 'Maybe.some':
                var $4808 = self.value;
                var self = $4808;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4810 = self.file;
                        var $4811 = self.code;
                        var $4812 = self.name;
                        var $4813 = self.term;
                        var $4814 = self.type;
                        var $4815 = self.stat;
                        var _file$10 = $4810;
                        var _code$11 = $4811;
                        var _name$12 = $4812;
                        var _term$13 = $4813;
                        var _type$14 = $4814;
                        var _stat$15 = $4815;
                        var self = _stat$15;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var _defs$16 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, Fm$Status$wait), _defs$2);
                                var _checked$17 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_type$14, Maybe$some$(Fm$Term$typ), _defs$16, List$nil, Fm$MPath$i$(Fm$MPath$nil), Maybe$none))((_chk_type$17 => {
                                    var $4818 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_term$13, Maybe$some$(_type$14), _defs$16, List$nil, Fm$MPath$o$(Fm$MPath$nil), Maybe$none))((_chk_term$18 => {
                                        var $4819 = Monad$pure$(Fm$Check$monad)(Unit$new);
                                        return $4819;
                                    }));
                                    return $4818;
                                }));
                                var self = _checked$17;
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $4820 = self.value;
                                        var $4821 = self.errors;
                                        var self = List$is_empty$($4821);
                                        if (self) {
                                            var _defs$20 = Fm$define$(_file$10, _code$11, _name$12, _term$13, _type$14, Bool$true, _defs$16);
                                            var $4823 = Monad$pure$(IO$monad)(_defs$20);
                                            var $4822 = $4823;
                                        } else {
                                            var $4824 = Monad$bind$(IO$monad)(Fm$Synth$fix$(_file$10, _code$11, _name$12, _term$13, _type$14, _defs$16, $4821, Bool$false))((_fixed$20 => {
                                                var self = _fixed$20;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var _stat$21 = Fm$Status$fail$($4821);
                                                        var _defs$22 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, _stat$21), _defs$16);
                                                        var $4826 = Monad$pure$(IO$monad)(_defs$22);
                                                        var $4825 = $4826;
                                                        break;
                                                    case 'Maybe.some':
                                                        var $4827 = self.value;
                                                        var $4828 = Fm$Synth$one$(_name$12, $4827);
                                                        var $4825 = $4828;
                                                        break;
                                                };
                                                return $4825;
                                            }));
                                            var $4822 = $4824;
                                        };
                                        var $4817 = $4822;
                                        break;
                                };
                                var $4816 = $4817;
                                break;
                            case 'Fm.Status.wait':
                                var $4829 = Monad$pure$(IO$monad)(_defs$2);
                                var $4816 = $4829;
                                break;
                            case 'Fm.Status.done':
                                var $4830 = Monad$pure$(IO$monad)(_defs$2);
                                var $4816 = $4830;
                                break;
                            case 'Fm.Status.fail':
                                var $4831 = self.errors;
                                var $4832 = Monad$pure$(IO$monad)(_defs$2);
                                var $4816 = $4832;
                                break;
                        };
                        var $4809 = $4816;
                        break;
                };
                var $4801 = $4809;
                break;
        };
        return $4801;
    };
    const Fm$Synth$one = x0 => x1 => Fm$Synth$one$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $4834 = _list$3;
                var $4833 = $4834;
                break;
            case 'Map.tie':
                var $4835 = self.val;
                var $4836 = self.lft;
                var $4837 = self.rgt;
                var self = $4835;
                switch (self._) {
                    case 'Maybe.none':
                        var $4839 = _list$3;
                        var _list0$7 = $4839;
                        break;
                    case 'Maybe.some':
                        var $4840 = self.value;
                        var $4841 = List$cons$($4840, _list$3);
                        var _list0$7 = $4841;
                        break;
                };
                var _list1$8 = Map$values$go$($4836, _list0$7);
                var _list2$9 = Map$values$go$($4837, _list1$8);
                var $4838 = _list2$9;
                var $4833 = $4838;
                break;
        };
        return $4833;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $4842 = Map$values$go$(_xs$2, List$nil);
        return $4842;
    };
    const Map$values = x0 => Map$values$(x0);

    function Fm$Name$show$(_name$1) {
        var $4843 = _name$1;
        return $4843;
    };
    const Fm$Name$show = x0 => Fm$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $4845 = 0n;
                var $4844 = $4845;
                break;
            case 'o':
                var $4846 = self.slice(0, -1);
                var $4847 = (2n * Bits$to_nat$($4846));
                var $4844 = $4847;
                break;
            case 'i':
                var $4848 = self.slice(0, -1);
                var $4849 = Nat$succ$((2n * Bits$to_nat$($4848)));
                var $4844 = $4849;
                break;
        };
        return $4844;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $4851 = u16_to_word(self);
                var $4852 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($4851)));
                var $4850 = $4852;
                break;
        };
        return $4850;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Fm$escape$char$(_chr$1) {
        var self = (_chr$1 === Fm$backslash);
        if (self) {
            var $4854 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
            var $4853 = $4854;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $4856 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                var $4855 = $4856;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $4858 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                    var $4857 = $4858;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $4860 = String$cons$(_chr$1, String$nil);
                        var $4859 = $4860;
                    } else {
                        var $4861 = String$flatten$(List$cons$(String$cons$(Fm$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $4859 = $4861;
                    };
                    var $4857 = $4859;
                };
                var $4855 = $4857;
            };
            var $4853 = $4855;
        };
        return $4853;
    };
    const Fm$escape$char = x0 => Fm$escape$char$(x0);

    function Fm$escape$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4863 = String$nil;
            var $4862 = $4863;
        } else {
            var $4864 = self.charCodeAt(0);
            var $4865 = self.slice(1);
            var _head$4 = Fm$escape$char$($4864);
            var _tail$5 = Fm$escape$($4865);
            var $4866 = (_head$4 + _tail$5);
            var $4862 = $4866;
        };
        return $4862;
    };
    const Fm$escape = x0 => Fm$escape$(x0);

    function Fm$Term$core$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4868 = self.name;
                var $4869 = self.indx;
                var $4870 = Fm$Name$show$($4868);
                var $4867 = $4870;
                break;
            case 'Fm.Term.ref':
                var $4871 = self.name;
                var $4872 = Fm$Name$show$($4871);
                var $4867 = $4872;
                break;
            case 'Fm.Term.typ':
                var $4873 = "*";
                var $4867 = $4873;
                break;
            case 'Fm.Term.all':
                var $4874 = self.eras;
                var $4875 = self.self;
                var $4876 = self.name;
                var $4877 = self.xtyp;
                var $4878 = self.body;
                var _eras$7 = $4874;
                var self = _eras$7;
                if (self) {
                    var $4880 = "%";
                    var _init$8 = $4880;
                } else {
                    var $4881 = "@";
                    var _init$8 = $4881;
                };
                var _self$9 = Fm$Name$show$($4875);
                var _name$10 = Fm$Name$show$($4876);
                var _xtyp$11 = Fm$Term$core$($4877);
                var _body$12 = Fm$Term$core$($4878(Fm$Term$var$($4875, 0n))(Fm$Term$var$($4876, 0n)));
                var $4879 = String$flatten$(List$cons$(_init$8, List$cons$(_self$9, List$cons$("(", List$cons$(_name$10, List$cons$(":", List$cons$(_xtyp$11, List$cons$(") ", List$cons$(_body$12, List$nil)))))))));
                var $4867 = $4879;
                break;
            case 'Fm.Term.lam':
                var $4882 = self.name;
                var $4883 = self.body;
                var _name$4 = Fm$Name$show$($4882);
                var _body$5 = Fm$Term$core$($4883(Fm$Term$var$($4882, 0n)));
                var $4884 = String$flatten$(List$cons$("#", List$cons$(_name$4, List$cons$(" ", List$cons$(_body$5, List$nil)))));
                var $4867 = $4884;
                break;
            case 'Fm.Term.app':
                var $4885 = self.func;
                var $4886 = self.argm;
                var _func$4 = Fm$Term$core$($4885);
                var _argm$5 = Fm$Term$core$($4886);
                var $4887 = String$flatten$(List$cons$("(", List$cons$(_func$4, List$cons$(" ", List$cons$(_argm$5, List$cons$(")", List$nil))))));
                var $4867 = $4887;
                break;
            case 'Fm.Term.let':
                var $4888 = self.name;
                var $4889 = self.expr;
                var $4890 = self.body;
                var _name$5 = Fm$Name$show$($4888);
                var _expr$6 = Fm$Term$core$($4889);
                var _body$7 = Fm$Term$core$($4890(Fm$Term$var$($4888, 0n)));
                var $4891 = String$flatten$(List$cons$("!", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4867 = $4891;
                break;
            case 'Fm.Term.def':
                var $4892 = self.name;
                var $4893 = self.expr;
                var $4894 = self.body;
                var _name$5 = Fm$Name$show$($4892);
                var _expr$6 = Fm$Term$core$($4893);
                var _body$7 = Fm$Term$core$($4894(Fm$Term$var$($4892, 0n)));
                var $4895 = String$flatten$(List$cons$("$", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4867 = $4895;
                break;
            case 'Fm.Term.ann':
                var $4896 = self.done;
                var $4897 = self.term;
                var $4898 = self.type;
                var _term$5 = Fm$Term$core$($4897);
                var _type$6 = Fm$Term$core$($4898);
                var $4899 = String$flatten$(List$cons$("{", List$cons$(_term$5, List$cons$(":", List$cons$(_type$6, List$cons$("}", List$nil))))));
                var $4867 = $4899;
                break;
            case 'Fm.Term.gol':
                var $4900 = self.name;
                var $4901 = self.dref;
                var $4902 = self.verb;
                var $4903 = "<GOL>";
                var $4867 = $4903;
                break;
            case 'Fm.Term.hol':
                var $4904 = self.path;
                var $4905 = "<HOL>";
                var $4867 = $4905;
                break;
            case 'Fm.Term.nat':
                var $4906 = self.natx;
                var $4907 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($4906), List$nil)));
                var $4867 = $4907;
                break;
            case 'Fm.Term.chr':
                var $4908 = self.chrx;
                var $4909 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($4908), List$cons$("\'", List$nil))));
                var $4867 = $4909;
                break;
            case 'Fm.Term.str':
                var $4910 = self.strx;
                var $4911 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($4910), List$cons$("\"", List$nil))));
                var $4867 = $4911;
                break;
            case 'Fm.Term.cse':
                var $4912 = self.path;
                var $4913 = self.expr;
                var $4914 = self.name;
                var $4915 = self.with;
                var $4916 = self.cses;
                var $4917 = self.moti;
                var $4918 = "<CSE>";
                var $4867 = $4918;
                break;
            case 'Fm.Term.ori':
                var $4919 = self.orig;
                var $4920 = self.expr;
                var $4921 = Fm$Term$core$($4920);
                var $4867 = $4921;
                break;
        };
        return $4867;
    };
    const Fm$Term$core = x0 => Fm$Term$core$(x0);

    function Fm$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $4924 = _result$2;
            var $4925 = Map$values$(_defs$1);
            let _result$4 = $4924;
            let _defn$3;
            while ($4925._ === 'List.cons') {
                _defn$3 = $4925.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4926 = self.file;
                        var $4927 = self.code;
                        var $4928 = self.name;
                        var $4929 = self.term;
                        var $4930 = self.type;
                        var $4931 = self.stat;
                        var self = $4931;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var $4933 = _result$4;
                                var $4932 = $4933;
                                break;
                            case 'Fm.Status.wait':
                                var $4934 = _result$4;
                                var $4932 = $4934;
                                break;
                            case 'Fm.Status.done':
                                var _name$11 = $4928;
                                var _term$12 = Fm$Term$core$($4929);
                                var _type$13 = Fm$Term$core$($4930);
                                var $4935 = String$flatten$(List$cons$(_result$4, List$cons$(_name$11, List$cons$(" : ", List$cons$(_type$13, List$cons$(" = ", List$cons$(_term$12, List$cons$(";\u{a}", List$nil))))))));
                                var $4932 = $4935;
                                break;
                            case 'Fm.Status.fail':
                                var $4936 = self.errors;
                                var $4937 = _result$4;
                                var $4932 = $4937;
                                break;
                        };
                        var $4924 = $4932;
                        break;
                };
                _result$4 = $4924;
                $4925 = $4925.tail;
            }
            return _result$4;
        })();
        var $4922 = _result$3;
        return $4922;
    };
    const Fm$Defs$core = x0 => Fm$Defs$core$(x0);

    function Fm$to_core$io$one$(_name$1) {
        var $4938 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $4939 = Monad$pure$(IO$monad)(Fm$Defs$core$(_defs$2));
            return $4939;
        }));
        return $4938;
    };
    const Fm$to_core$io$one = x0 => Fm$to_core$io$one$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $4941 = Maybe$none;
                var $4940 = $4941;
                break;
            case 'Maybe.some':
                var $4942 = self.value;
                var $4943 = _f$4($4942);
                var $4940 = $4943;
                break;
        };
        return $4940;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);
    const Maybe$monad = Monad$new$(Maybe$bind, Maybe$some);

    function Fm$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4945 = self.name;
                var $4946 = self.indx;
                var $4947 = Maybe$none;
                var $4944 = $4947;
                break;
            case 'Fm.Term.ref':
                var $4948 = self.name;
                var self = ($4948 === "Nat.zero");
                if (self) {
                    var $4950 = Maybe$some$(0n);
                    var $4949 = $4950;
                } else {
                    var $4951 = Maybe$none;
                    var $4949 = $4951;
                };
                var $4944 = $4949;
                break;
            case 'Fm.Term.typ':
                var $4952 = Maybe$none;
                var $4944 = $4952;
                break;
            case 'Fm.Term.all':
                var $4953 = self.eras;
                var $4954 = self.self;
                var $4955 = self.name;
                var $4956 = self.xtyp;
                var $4957 = self.body;
                var $4958 = Maybe$none;
                var $4944 = $4958;
                break;
            case 'Fm.Term.lam':
                var $4959 = self.name;
                var $4960 = self.body;
                var $4961 = Maybe$none;
                var $4944 = $4961;
                break;
            case 'Fm.Term.app':
                var $4962 = self.func;
                var $4963 = self.argm;
                var self = $4962;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $4965 = self.name;
                        var $4966 = self.indx;
                        var $4967 = Maybe$none;
                        var $4964 = $4967;
                        break;
                    case 'Fm.Term.ref':
                        var $4968 = self.name;
                        var self = ($4968 === "Nat.succ");
                        if (self) {
                            var $4970 = Monad$bind$(Maybe$monad)(Fm$Term$show$as_nat$go$($4963))((_pred$5 => {
                                var $4971 = Monad$pure$(Maybe$monad)(Nat$succ$(_pred$5));
                                return $4971;
                            }));
                            var $4969 = $4970;
                        } else {
                            var $4972 = Maybe$none;
                            var $4969 = $4972;
                        };
                        var $4964 = $4969;
                        break;
                    case 'Fm.Term.typ':
                        var $4973 = Maybe$none;
                        var $4964 = $4973;
                        break;
                    case 'Fm.Term.all':
                        var $4974 = self.eras;
                        var $4975 = self.self;
                        var $4976 = self.name;
                        var $4977 = self.xtyp;
                        var $4978 = self.body;
                        var $4979 = Maybe$none;
                        var $4964 = $4979;
                        break;
                    case 'Fm.Term.lam':
                        var $4980 = self.name;
                        var $4981 = self.body;
                        var $4982 = Maybe$none;
                        var $4964 = $4982;
                        break;
                    case 'Fm.Term.app':
                        var $4983 = self.func;
                        var $4984 = self.argm;
                        var $4985 = Maybe$none;
                        var $4964 = $4985;
                        break;
                    case 'Fm.Term.let':
                        var $4986 = self.name;
                        var $4987 = self.expr;
                        var $4988 = self.body;
                        var $4989 = Maybe$none;
                        var $4964 = $4989;
                        break;
                    case 'Fm.Term.def':
                        var $4990 = self.name;
                        var $4991 = self.expr;
                        var $4992 = self.body;
                        var $4993 = Maybe$none;
                        var $4964 = $4993;
                        break;
                    case 'Fm.Term.ann':
                        var $4994 = self.done;
                        var $4995 = self.term;
                        var $4996 = self.type;
                        var $4997 = Maybe$none;
                        var $4964 = $4997;
                        break;
                    case 'Fm.Term.gol':
                        var $4998 = self.name;
                        var $4999 = self.dref;
                        var $5000 = self.verb;
                        var $5001 = Maybe$none;
                        var $4964 = $5001;
                        break;
                    case 'Fm.Term.hol':
                        var $5002 = self.path;
                        var $5003 = Maybe$none;
                        var $4964 = $5003;
                        break;
                    case 'Fm.Term.nat':
                        var $5004 = self.natx;
                        var $5005 = Maybe$none;
                        var $4964 = $5005;
                        break;
                    case 'Fm.Term.chr':
                        var $5006 = self.chrx;
                        var $5007 = Maybe$none;
                        var $4964 = $5007;
                        break;
                    case 'Fm.Term.str':
                        var $5008 = self.strx;
                        var $5009 = Maybe$none;
                        var $4964 = $5009;
                        break;
                    case 'Fm.Term.cse':
                        var $5010 = self.path;
                        var $5011 = self.expr;
                        var $5012 = self.name;
                        var $5013 = self.with;
                        var $5014 = self.cses;
                        var $5015 = self.moti;
                        var $5016 = Maybe$none;
                        var $4964 = $5016;
                        break;
                    case 'Fm.Term.ori':
                        var $5017 = self.orig;
                        var $5018 = self.expr;
                        var $5019 = Maybe$none;
                        var $4964 = $5019;
                        break;
                };
                var $4944 = $4964;
                break;
            case 'Fm.Term.let':
                var $5020 = self.name;
                var $5021 = self.expr;
                var $5022 = self.body;
                var $5023 = Maybe$none;
                var $4944 = $5023;
                break;
            case 'Fm.Term.def':
                var $5024 = self.name;
                var $5025 = self.expr;
                var $5026 = self.body;
                var $5027 = Maybe$none;
                var $4944 = $5027;
                break;
            case 'Fm.Term.ann':
                var $5028 = self.done;
                var $5029 = self.term;
                var $5030 = self.type;
                var $5031 = Maybe$none;
                var $4944 = $5031;
                break;
            case 'Fm.Term.gol':
                var $5032 = self.name;
                var $5033 = self.dref;
                var $5034 = self.verb;
                var $5035 = Maybe$none;
                var $4944 = $5035;
                break;
            case 'Fm.Term.hol':
                var $5036 = self.path;
                var $5037 = Maybe$none;
                var $4944 = $5037;
                break;
            case 'Fm.Term.nat':
                var $5038 = self.natx;
                var $5039 = Maybe$none;
                var $4944 = $5039;
                break;
            case 'Fm.Term.chr':
                var $5040 = self.chrx;
                var $5041 = Maybe$none;
                var $4944 = $5041;
                break;
            case 'Fm.Term.str':
                var $5042 = self.strx;
                var $5043 = Maybe$none;
                var $4944 = $5043;
                break;
            case 'Fm.Term.cse':
                var $5044 = self.path;
                var $5045 = self.expr;
                var $5046 = self.name;
                var $5047 = self.with;
                var $5048 = self.cses;
                var $5049 = self.moti;
                var $5050 = Maybe$none;
                var $4944 = $5050;
                break;
            case 'Fm.Term.ori':
                var $5051 = self.orig;
                var $5052 = self.expr;
                var $5053 = Maybe$none;
                var $4944 = $5053;
                break;
        };
        return $4944;
    };
    const Fm$Term$show$as_nat$go = x0 => Fm$Term$show$as_nat$go$(x0);

    function Fm$Term$show$as_nat$(_term$1) {
        var $5054 = Maybe$mapped$(Fm$Term$show$as_nat$go$(_term$1), Nat$show);
        return $5054;
    };
    const Fm$Term$show$as_nat = x0 => Fm$Term$show$as_nat$(x0);

    function Fm$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5056 = self.name;
                var $5057 = self.indx;
                var $5058 = Bool$false;
                var $5055 = $5058;
                break;
            case 'Fm.Term.ref':
                var $5059 = self.name;
                var $5060 = (_name$2 === $5059);
                var $5055 = $5060;
                break;
            case 'Fm.Term.typ':
                var $5061 = Bool$false;
                var $5055 = $5061;
                break;
            case 'Fm.Term.all':
                var $5062 = self.eras;
                var $5063 = self.self;
                var $5064 = self.name;
                var $5065 = self.xtyp;
                var $5066 = self.body;
                var $5067 = Bool$false;
                var $5055 = $5067;
                break;
            case 'Fm.Term.lam':
                var $5068 = self.name;
                var $5069 = self.body;
                var $5070 = Bool$false;
                var $5055 = $5070;
                break;
            case 'Fm.Term.app':
                var $5071 = self.func;
                var $5072 = self.argm;
                var $5073 = Bool$false;
                var $5055 = $5073;
                break;
            case 'Fm.Term.let':
                var $5074 = self.name;
                var $5075 = self.expr;
                var $5076 = self.body;
                var $5077 = Bool$false;
                var $5055 = $5077;
                break;
            case 'Fm.Term.def':
                var $5078 = self.name;
                var $5079 = self.expr;
                var $5080 = self.body;
                var $5081 = Bool$false;
                var $5055 = $5081;
                break;
            case 'Fm.Term.ann':
                var $5082 = self.done;
                var $5083 = self.term;
                var $5084 = self.type;
                var $5085 = Bool$false;
                var $5055 = $5085;
                break;
            case 'Fm.Term.gol':
                var $5086 = self.name;
                var $5087 = self.dref;
                var $5088 = self.verb;
                var $5089 = Bool$false;
                var $5055 = $5089;
                break;
            case 'Fm.Term.hol':
                var $5090 = self.path;
                var $5091 = Bool$false;
                var $5055 = $5091;
                break;
            case 'Fm.Term.nat':
                var $5092 = self.natx;
                var $5093 = Bool$false;
                var $5055 = $5093;
                break;
            case 'Fm.Term.chr':
                var $5094 = self.chrx;
                var $5095 = Bool$false;
                var $5055 = $5095;
                break;
            case 'Fm.Term.str':
                var $5096 = self.strx;
                var $5097 = Bool$false;
                var $5055 = $5097;
                break;
            case 'Fm.Term.cse':
                var $5098 = self.path;
                var $5099 = self.expr;
                var $5100 = self.name;
                var $5101 = self.with;
                var $5102 = self.cses;
                var $5103 = self.moti;
                var $5104 = Bool$false;
                var $5055 = $5104;
                break;
            case 'Fm.Term.ori':
                var $5105 = self.orig;
                var $5106 = self.expr;
                var $5107 = Bool$false;
                var $5055 = $5107;
                break;
        };
        return $5055;
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
                        var $5108 = self.name;
                        var $5109 = self.indx;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5111 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5110 = $5111;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5113 = Bool$false;
                                var _wrap$8 = $5113;
                            } else {
                                var $5114 = self.charCodeAt(0);
                                var $5115 = self.slice(1);
                                var $5116 = ($5114 === 40);
                                var _wrap$8 = $5116;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5117 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5117;
                            } else {
                                var $5118 = _func$7;
                                var _func$10 = $5118;
                            };
                            var $5112 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5110 = $5112;
                        };
                        return $5110;
                    case 'Fm.Term.ref':
                        var $5119 = self.name;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5121 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5120 = $5121;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5123 = Bool$false;
                                var _wrap$7 = $5123;
                            } else {
                                var $5124 = self.charCodeAt(0);
                                var $5125 = self.slice(1);
                                var $5126 = ($5124 === 40);
                                var _wrap$7 = $5126;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5127 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5127;
                            } else {
                                var $5128 = _func$6;
                                var _func$9 = $5128;
                            };
                            var $5122 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5120 = $5122;
                        };
                        return $5120;
                    case 'Fm.Term.typ':
                        var _arity$4 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
                        if (self) {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5130 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
                            var $5129 = $5130;
                        } else {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$5;
                            if (self.length === 0) {
                                var $5132 = Bool$false;
                                var _wrap$6 = $5132;
                            } else {
                                var $5133 = self.charCodeAt(0);
                                var $5134 = self.slice(1);
                                var $5135 = ($5133 === 40);
                                var _wrap$6 = $5135;
                            };
                            var _args$7 = String$join$(",", _args$3);
                            var self = _wrap$6;
                            if (self) {
                                var $5136 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                                var _func$8 = $5136;
                            } else {
                                var $5137 = _func$5;
                                var _func$8 = $5137;
                            };
                            var $5131 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
                            var $5129 = $5131;
                        };
                        return $5129;
                    case 'Fm.Term.all':
                        var $5138 = self.eras;
                        var $5139 = self.self;
                        var $5140 = self.name;
                        var $5141 = self.xtyp;
                        var $5142 = self.body;
                        var _arity$9 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$9 === 3n));
                        if (self) {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$11 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$12 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5144 = String$flatten$(List$cons$(_eq_lft$11, List$cons$(" == ", List$cons$(_eq_rgt$12, List$nil))));
                            var $5143 = $5144;
                        } else {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$10;
                            if (self.length === 0) {
                                var $5146 = Bool$false;
                                var _wrap$11 = $5146;
                            } else {
                                var $5147 = self.charCodeAt(0);
                                var $5148 = self.slice(1);
                                var $5149 = ($5147 === 40);
                                var _wrap$11 = $5149;
                            };
                            var _args$12 = String$join$(",", _args$3);
                            var self = _wrap$11;
                            if (self) {
                                var $5150 = String$flatten$(List$cons$("(", List$cons$(_func$10, List$cons$(")", List$nil))));
                                var _func$13 = $5150;
                            } else {
                                var $5151 = _func$10;
                                var _func$13 = $5151;
                            };
                            var $5145 = String$flatten$(List$cons$(_func$13, List$cons$("(", List$cons$(_args$12, List$cons$(")", List$nil)))));
                            var $5143 = $5145;
                        };
                        return $5143;
                    case 'Fm.Term.lam':
                        var $5152 = self.name;
                        var $5153 = self.body;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5155 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5154 = $5155;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5157 = Bool$false;
                                var _wrap$8 = $5157;
                            } else {
                                var $5158 = self.charCodeAt(0);
                                var $5159 = self.slice(1);
                                var $5160 = ($5158 === 40);
                                var _wrap$8 = $5160;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5161 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5161;
                            } else {
                                var $5162 = _func$7;
                                var _func$10 = $5162;
                            };
                            var $5156 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5154 = $5156;
                        };
                        return $5154;
                    case 'Fm.Term.app':
                        var $5163 = self.func;
                        var $5164 = self.argm;
                        var _argm$6 = Fm$Term$show$go$($5164, Fm$MPath$i$(_path$2));
                        var $5165 = Fm$Term$show$app$($5163, Fm$MPath$o$(_path$2), List$cons$(_argm$6, _args$3));
                        return $5165;
                    case 'Fm.Term.let':
                        var $5166 = self.name;
                        var $5167 = self.expr;
                        var $5168 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5170 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5169 = $5170;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5172 = Bool$false;
                                var _wrap$9 = $5172;
                            } else {
                                var $5173 = self.charCodeAt(0);
                                var $5174 = self.slice(1);
                                var $5175 = ($5173 === 40);
                                var _wrap$9 = $5175;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5176 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5176;
                            } else {
                                var $5177 = _func$8;
                                var _func$11 = $5177;
                            };
                            var $5171 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5169 = $5171;
                        };
                        return $5169;
                    case 'Fm.Term.def':
                        var $5178 = self.name;
                        var $5179 = self.expr;
                        var $5180 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5182 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5181 = $5182;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5184 = Bool$false;
                                var _wrap$9 = $5184;
                            } else {
                                var $5185 = self.charCodeAt(0);
                                var $5186 = self.slice(1);
                                var $5187 = ($5185 === 40);
                                var _wrap$9 = $5187;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5188 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5188;
                            } else {
                                var $5189 = _func$8;
                                var _func$11 = $5189;
                            };
                            var $5183 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5181 = $5183;
                        };
                        return $5181;
                    case 'Fm.Term.ann':
                        var $5190 = self.done;
                        var $5191 = self.term;
                        var $5192 = self.type;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5194 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5193 = $5194;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5196 = Bool$false;
                                var _wrap$9 = $5196;
                            } else {
                                var $5197 = self.charCodeAt(0);
                                var $5198 = self.slice(1);
                                var $5199 = ($5197 === 40);
                                var _wrap$9 = $5199;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5200 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5200;
                            } else {
                                var $5201 = _func$8;
                                var _func$11 = $5201;
                            };
                            var $5195 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5193 = $5195;
                        };
                        return $5193;
                    case 'Fm.Term.gol':
                        var $5202 = self.name;
                        var $5203 = self.dref;
                        var $5204 = self.verb;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5206 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5205 = $5206;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5208 = Bool$false;
                                var _wrap$9 = $5208;
                            } else {
                                var $5209 = self.charCodeAt(0);
                                var $5210 = self.slice(1);
                                var $5211 = ($5209 === 40);
                                var _wrap$9 = $5211;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5212 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5212;
                            } else {
                                var $5213 = _func$8;
                                var _func$11 = $5213;
                            };
                            var $5207 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5205 = $5207;
                        };
                        return $5205;
                    case 'Fm.Term.hol':
                        var $5214 = self.path;
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
                    case 'Fm.Term.nat':
                        var $5224 = self.natx;
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
                    case 'Fm.Term.chr':
                        var $5234 = self.chrx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5236 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5235 = $5236;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5238 = Bool$false;
                                var _wrap$7 = $5238;
                            } else {
                                var $5239 = self.charCodeAt(0);
                                var $5240 = self.slice(1);
                                var $5241 = ($5239 === 40);
                                var _wrap$7 = $5241;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5242 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5242;
                            } else {
                                var $5243 = _func$6;
                                var _func$9 = $5243;
                            };
                            var $5237 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5235 = $5237;
                        };
                        return $5235;
                    case 'Fm.Term.str':
                        var $5244 = self.strx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5246 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5245 = $5246;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5248 = Bool$false;
                                var _wrap$7 = $5248;
                            } else {
                                var $5249 = self.charCodeAt(0);
                                var $5250 = self.slice(1);
                                var $5251 = ($5249 === 40);
                                var _wrap$7 = $5251;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5252 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5252;
                            } else {
                                var $5253 = _func$6;
                                var _func$9 = $5253;
                            };
                            var $5247 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5245 = $5247;
                        };
                        return $5245;
                    case 'Fm.Term.cse':
                        var $5254 = self.path;
                        var $5255 = self.expr;
                        var $5256 = self.name;
                        var $5257 = self.with;
                        var $5258 = self.cses;
                        var $5259 = self.moti;
                        var _arity$10 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$10 === 3n));
                        if (self) {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$12 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$13 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5261 = String$flatten$(List$cons$(_eq_lft$12, List$cons$(" == ", List$cons$(_eq_rgt$13, List$nil))));
                            var $5260 = $5261;
                        } else {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$11;
                            if (self.length === 0) {
                                var $5263 = Bool$false;
                                var _wrap$12 = $5263;
                            } else {
                                var $5264 = self.charCodeAt(0);
                                var $5265 = self.slice(1);
                                var $5266 = ($5264 === 40);
                                var _wrap$12 = $5266;
                            };
                            var _args$13 = String$join$(",", _args$3);
                            var self = _wrap$12;
                            if (self) {
                                var $5267 = String$flatten$(List$cons$("(", List$cons$(_func$11, List$cons$(")", List$nil))));
                                var _func$14 = $5267;
                            } else {
                                var $5268 = _func$11;
                                var _func$14 = $5268;
                            };
                            var $5262 = String$flatten$(List$cons$(_func$14, List$cons$("(", List$cons$(_args$13, List$cons$(")", List$nil)))));
                            var $5260 = $5262;
                        };
                        return $5260;
                    case 'Fm.Term.ori':
                        var $5269 = self.orig;
                        var $5270 = self.expr;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5272 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5271 = $5272;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5274 = Bool$false;
                                var _wrap$8 = $5274;
                            } else {
                                var $5275 = self.charCodeAt(0);
                                var $5276 = self.slice(1);
                                var $5277 = ($5275 === 40);
                                var _wrap$8 = $5277;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5278 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5278;
                            } else {
                                var $5279 = _func$7;
                                var _func$10 = $5279;
                            };
                            var $5273 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5271 = $5273;
                        };
                        return $5271;
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
                var $5281 = _list$4;
                var $5280 = $5281;
                break;
            case 'Map.tie':
                var $5282 = self.val;
                var $5283 = self.lft;
                var $5284 = self.rgt;
                var self = $5282;
                switch (self._) {
                    case 'Maybe.none':
                        var $5286 = _list$4;
                        var _list0$8 = $5286;
                        break;
                    case 'Maybe.some':
                        var $5287 = self.value;
                        var $5288 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5287), _list$4);
                        var _list0$8 = $5288;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5283, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5284, (_key$3 + '1'), _list1$9);
                var $5285 = _list2$10;
                var $5280 = $5285;
                break;
        };
        return $5280;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5289 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5289;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $5291 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5290 = $5291;
                break;
            case 'o':
                var $5292 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5294 = List$cons$(_head$6, _tail$7);
                    var $5293 = $5294;
                } else {
                    var $5295 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5296 = Bits$chunks_of$go$(_len$1, $5292, $5295, _chunk$7);
                    var $5293 = $5296;
                };
                var $5290 = $5293;
                break;
            case 'i':
                var $5297 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5299 = List$cons$(_head$6, _tail$7);
                    var $5298 = $5299;
                } else {
                    var $5300 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5301 = Bits$chunks_of$go$(_len$1, $5297, $5300, _chunk$7);
                    var $5298 = $5301;
                };
                var $5290 = $5298;
                break;
        };
        return $5290;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5302 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5302;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5304 = Word$e;
            var $5303 = $5304;
        } else {
            var $5305 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'e':
                    var $5307 = Word$o$(Word$from_bits$($5305, Bits$e));
                    var $5306 = $5307;
                    break;
                case 'o':
                    var $5308 = self.slice(0, -1);
                    var $5309 = Word$o$(Word$from_bits$($5305, $5308));
                    var $5306 = $5309;
                    break;
                case 'i':
                    var $5310 = self.slice(0, -1);
                    var $5311 = Word$i$(Word$from_bits$($5305, $5310));
                    var $5306 = $5311;
                    break;
            };
            var $5303 = $5306;
        };
        return $5303;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Fm$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5314 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5314;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5316 = ((_u16$5 + 71) & 0xFFFF);
                    var $5315 = $5316;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5318 = (Math.max(_u16$5 - 4, 0));
                        var $5317 = $5318;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5320 = 46;
                            var $5319 = $5320;
                        } else {
                            var $5321 = 95;
                            var $5319 = $5321;
                        };
                        var $5317 = $5319;
                    };
                    var $5315 = $5317;
                };
                var _chr$6 = $5315;
            };
            var $5313 = String$cons$(_chr$6, _name$4);
            return $5313;
        }));
        var $5312 = _name$3;
        return $5312;
    };
    const Fm$Name$from_bits = x0 => Fm$Name$from_bits$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $5323 = self.fst;
                var $5324 = self.snd;
                var $5325 = $5323;
                var $5322 = $5325;
                break;
        };
        return $5322;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Fm$Term$show$go$(_term$1, _path$2) {
        var self = Fm$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $5328 = self.name;
                        var $5329 = self.indx;
                        var $5330 = Fm$Name$show$($5328);
                        var $5327 = $5330;
                        break;
                    case 'Fm.Term.ref':
                        var $5331 = self.name;
                        var _name$4 = Fm$Name$show$($5331);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5333 = _name$4;
                                var $5332 = $5333;
                                break;
                            case 'Maybe.some':
                                var $5334 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Fm$Path$to_bits$($5334));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5335 = String$flatten$(List$cons$(_name$4, List$cons$(Fm$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5332 = $5335;
                                break;
                        };
                        var $5327 = $5332;
                        break;
                    case 'Fm.Term.typ':
                        var $5336 = "Type";
                        var $5327 = $5336;
                        break;
                    case 'Fm.Term.all':
                        var $5337 = self.eras;
                        var $5338 = self.self;
                        var $5339 = self.name;
                        var $5340 = self.xtyp;
                        var $5341 = self.body;
                        var _eras$8 = $5337;
                        var _self$9 = Fm$Name$show$($5338);
                        var _name$10 = Fm$Name$show$($5339);
                        var _type$11 = Fm$Term$show$go$($5340, Fm$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5343 = "<";
                            var _open$12 = $5343;
                        } else {
                            var $5344 = "(";
                            var _open$12 = $5344;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5345 = ">";
                            var _clos$13 = $5345;
                        } else {
                            var $5346 = ")";
                            var _clos$13 = $5346;
                        };
                        var _body$14 = Fm$Term$show$go$($5341(Fm$Term$var$($5338, 0n))(Fm$Term$var$($5339, 0n)), Fm$MPath$i$(_path$2));
                        var $5342 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5327 = $5342;
                        break;
                    case 'Fm.Term.lam':
                        var $5347 = self.name;
                        var $5348 = self.body;
                        var _name$5 = Fm$Name$show$($5347);
                        var _body$6 = Fm$Term$show$go$($5348(Fm$Term$var$($5347, 0n)), Fm$MPath$o$(_path$2));
                        var $5349 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5327 = $5349;
                        break;
                    case 'Fm.Term.app':
                        var $5350 = self.func;
                        var $5351 = self.argm;
                        var $5352 = Fm$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5327 = $5352;
                        break;
                    case 'Fm.Term.let':
                        var $5353 = self.name;
                        var $5354 = self.expr;
                        var $5355 = self.body;
                        var _name$6 = Fm$Name$show$($5353);
                        var _expr$7 = Fm$Term$show$go$($5354, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5355(Fm$Term$var$($5353, 0n)), Fm$MPath$i$(_path$2));
                        var $5356 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5327 = $5356;
                        break;
                    case 'Fm.Term.def':
                        var $5357 = self.name;
                        var $5358 = self.expr;
                        var $5359 = self.body;
                        var _name$6 = Fm$Name$show$($5357);
                        var _expr$7 = Fm$Term$show$go$($5358, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5359(Fm$Term$var$($5357, 0n)), Fm$MPath$i$(_path$2));
                        var $5360 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5327 = $5360;
                        break;
                    case 'Fm.Term.ann':
                        var $5361 = self.done;
                        var $5362 = self.term;
                        var $5363 = self.type;
                        var _term$6 = Fm$Term$show$go$($5362, Fm$MPath$o$(_path$2));
                        var _type$7 = Fm$Term$show$go$($5363, Fm$MPath$i$(_path$2));
                        var $5364 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5327 = $5364;
                        break;
                    case 'Fm.Term.gol':
                        var $5365 = self.name;
                        var $5366 = self.dref;
                        var $5367 = self.verb;
                        var _name$6 = Fm$Name$show$($5365);
                        var $5368 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5327 = $5368;
                        break;
                    case 'Fm.Term.hol':
                        var $5369 = self.path;
                        var $5370 = "_";
                        var $5327 = $5370;
                        break;
                    case 'Fm.Term.nat':
                        var $5371 = self.natx;
                        var $5372 = String$flatten$(List$cons$(Nat$show$($5371), List$nil));
                        var $5327 = $5372;
                        break;
                    case 'Fm.Term.chr':
                        var $5373 = self.chrx;
                        var $5374 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($5373), List$cons$("\'", List$nil))));
                        var $5327 = $5374;
                        break;
                    case 'Fm.Term.str':
                        var $5375 = self.strx;
                        var $5376 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($5375), List$cons$("\"", List$nil))));
                        var $5327 = $5376;
                        break;
                    case 'Fm.Term.cse':
                        var $5377 = self.path;
                        var $5378 = self.expr;
                        var $5379 = self.name;
                        var $5380 = self.with;
                        var $5381 = self.cses;
                        var $5382 = self.moti;
                        var _expr$9 = Fm$Term$show$go$($5378, Fm$MPath$o$(_path$2));
                        var _name$10 = Fm$Name$show$($5379);
                        var _wyth$11 = String$join$("", List$mapped$($5380, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5385 = self.file;
                                    var $5386 = self.code;
                                    var $5387 = self.name;
                                    var $5388 = self.term;
                                    var $5389 = self.type;
                                    var $5390 = self.stat;
                                    var _name$18 = Fm$Name$show$($5387);
                                    var _type$19 = Fm$Term$show$go$($5389, Maybe$none);
                                    var _term$20 = Fm$Term$show$go$($5388, Maybe$none);
                                    var $5391 = String$flatten$(List$cons$(_name$18, List$cons$(": ", List$cons$(_type$19, List$cons$(" = ", List$cons$(_term$20, List$cons$(";", List$nil)))))));
                                    var $5384 = $5391;
                                    break;
                            };
                            return $5384;
                        })));
                        var _cses$12 = Map$to_list$($5381);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Fm$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Fm$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5392 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5392;
                        })));
                        var self = $5382;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5393 = "";
                                var _moti$14 = $5393;
                                break;
                            case 'Maybe.some':
                                var $5394 = self.value;
                                var $5395 = String$flatten$(List$cons$(": ", List$cons$(Fm$Term$show$go$($5394, Maybe$none), List$nil)));
                                var _moti$14 = $5395;
                                break;
                        };
                        var $5383 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5327 = $5383;
                        break;
                    case 'Fm.Term.ori':
                        var $5396 = self.orig;
                        var $5397 = self.expr;
                        var $5398 = Fm$Term$show$go$($5397, _path$2);
                        var $5327 = $5398;
                        break;
                };
                var $5326 = $5327;
                break;
            case 'Maybe.some':
                var $5399 = self.value;
                var $5400 = $5399;
                var $5326 = $5400;
                break;
        };
        return $5326;
    };
    const Fm$Term$show$go = x0 => x1 => Fm$Term$show$go$(x0, x1);

    function Fm$Term$show$(_term$1) {
        var $5401 = Fm$Term$show$go$(_term$1, Maybe$none);
        return $5401;
    };
    const Fm$Term$show = x0 => Fm$Term$show$(x0);

    function Fm$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.nil':
                var $5403 = List$nil;
                var $5402 = $5403;
                break;
            case 'List.cons':
                var $5404 = self.head;
                var $5405 = self.tail;
                var self = $5404;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5407 = self.origin;
                        var $5408 = self.expected;
                        var $5409 = self.detected;
                        var $5410 = self.context;
                        var $5411 = (!_got$2);
                        var _keep$5 = $5411;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5412 = self.name;
                        var $5413 = self.dref;
                        var $5414 = self.verb;
                        var $5415 = self.goal;
                        var $5416 = self.context;
                        var $5417 = Bool$true;
                        var _keep$5 = $5417;
                        break;
                    case 'Fm.Error.waiting':
                        var $5418 = self.name;
                        var $5419 = Bool$false;
                        var _keep$5 = $5419;
                        break;
                    case 'Fm.Error.indirect':
                        var $5420 = self.name;
                        var $5421 = Bool$false;
                        var _keep$5 = $5421;
                        break;
                    case 'Fm.Error.patch':
                        var $5422 = self.path;
                        var $5423 = self.term;
                        var $5424 = Bool$false;
                        var _keep$5 = $5424;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5425 = self.origin;
                        var $5426 = self.name;
                        var $5427 = (!_got$2);
                        var _keep$5 = $5427;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5428 = self.origin;
                        var $5429 = self.term;
                        var $5430 = self.context;
                        var $5431 = (!_got$2);
                        var _keep$5 = $5431;
                        break;
                };
                var self = $5404;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5432 = self.origin;
                        var $5433 = self.expected;
                        var $5434 = self.detected;
                        var $5435 = self.context;
                        var $5436 = Bool$true;
                        var _got$6 = $5436;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5437 = self.name;
                        var $5438 = self.dref;
                        var $5439 = self.verb;
                        var $5440 = self.goal;
                        var $5441 = self.context;
                        var $5442 = _got$2;
                        var _got$6 = $5442;
                        break;
                    case 'Fm.Error.waiting':
                        var $5443 = self.name;
                        var $5444 = _got$2;
                        var _got$6 = $5444;
                        break;
                    case 'Fm.Error.indirect':
                        var $5445 = self.name;
                        var $5446 = _got$2;
                        var _got$6 = $5446;
                        break;
                    case 'Fm.Error.patch':
                        var $5447 = self.path;
                        var $5448 = self.term;
                        var $5449 = _got$2;
                        var _got$6 = $5449;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5450 = self.origin;
                        var $5451 = self.name;
                        var $5452 = Bool$true;
                        var _got$6 = $5452;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5453 = self.origin;
                        var $5454 = self.term;
                        var $5455 = self.context;
                        var $5456 = _got$2;
                        var _got$6 = $5456;
                        break;
                };
                var _tail$7 = Fm$Error$relevant$($5405, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5457 = List$cons$($5404, _tail$7);
                    var $5406 = $5457;
                } else {
                    var $5458 = _tail$7;
                    var $5406 = $5458;
                };
                var $5402 = $5406;
                break;
        };
        return $5402;
    };
    const Fm$Error$relevant = x0 => x1 => Fm$Error$relevant$(x0, x1);

    function Fm$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.nil':
                var $5460 = "";
                var $5459 = $5460;
                break;
            case 'List.cons':
                var $5461 = self.head;
                var $5462 = self.tail;
                var self = $5461;
                switch (self._) {
                    case 'Pair.new':
                        var $5464 = self.fst;
                        var $5465 = self.snd;
                        var _name$6 = Fm$Name$show$($5464);
                        var _type$7 = Fm$Term$show$(Fm$Term$normalize$($5465, Map$new));
                        var _rest$8 = Fm$Context$show$($5462);
                        var $5466 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5463 = $5466;
                        break;
                };
                var $5459 = $5463;
                break;
        };
        return $5459;
    };
    const Fm$Context$show = x0 => Fm$Context$show$(x0);

    function Fm$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5467 = Fm$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Fm.Term.var':
                    var $5469 = self.name;
                    var $5470 = self.indx;
                    var $5471 = _term$4;
                    var $5468 = $5471;
                    break;
                case 'Fm.Term.ref':
                    var $5472 = self.name;
                    var self = Fm$get$($5472, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5474 = Fm$Term$ref$($5472);
                            var $5473 = $5474;
                            break;
                        case 'Maybe.some':
                            var $5475 = self.value;
                            var self = $5475;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5477 = self.file;
                                    var $5478 = self.code;
                                    var $5479 = self.name;
                                    var $5480 = self.term;
                                    var $5481 = self.type;
                                    var $5482 = self.stat;
                                    var $5483 = $5480;
                                    var $5476 = $5483;
                                    break;
                            };
                            var $5473 = $5476;
                            break;
                    };
                    var $5468 = $5473;
                    break;
                case 'Fm.Term.typ':
                    var $5484 = _term$4;
                    var $5468 = $5484;
                    break;
                case 'Fm.Term.all':
                    var $5485 = self.eras;
                    var $5486 = self.self;
                    var $5487 = self.name;
                    var $5488 = self.xtyp;
                    var $5489 = self.body;
                    var $5490 = _term$4;
                    var $5468 = $5490;
                    break;
                case 'Fm.Term.lam':
                    var $5491 = self.name;
                    var $5492 = self.body;
                    var $5493 = _term$4;
                    var $5468 = $5493;
                    break;
                case 'Fm.Term.app':
                    var $5494 = self.func;
                    var $5495 = self.argm;
                    var $5496 = _term$4;
                    var $5468 = $5496;
                    break;
                case 'Fm.Term.let':
                    var $5497 = self.name;
                    var $5498 = self.expr;
                    var $5499 = self.body;
                    var $5500 = _term$4;
                    var $5468 = $5500;
                    break;
                case 'Fm.Term.def':
                    var $5501 = self.name;
                    var $5502 = self.expr;
                    var $5503 = self.body;
                    var $5504 = _term$4;
                    var $5468 = $5504;
                    break;
                case 'Fm.Term.ann':
                    var $5505 = self.done;
                    var $5506 = self.term;
                    var $5507 = self.type;
                    var $5508 = _term$4;
                    var $5468 = $5508;
                    break;
                case 'Fm.Term.gol':
                    var $5509 = self.name;
                    var $5510 = self.dref;
                    var $5511 = self.verb;
                    var $5512 = _term$4;
                    var $5468 = $5512;
                    break;
                case 'Fm.Term.hol':
                    var $5513 = self.path;
                    var $5514 = _term$4;
                    var $5468 = $5514;
                    break;
                case 'Fm.Term.nat':
                    var $5515 = self.natx;
                    var $5516 = _term$4;
                    var $5468 = $5516;
                    break;
                case 'Fm.Term.chr':
                    var $5517 = self.chrx;
                    var $5518 = _term$4;
                    var $5468 = $5518;
                    break;
                case 'Fm.Term.str':
                    var $5519 = self.strx;
                    var $5520 = _term$4;
                    var $5468 = $5520;
                    break;
                case 'Fm.Term.cse':
                    var $5521 = self.path;
                    var $5522 = self.expr;
                    var $5523 = self.name;
                    var $5524 = self.with;
                    var $5525 = self.cses;
                    var $5526 = self.moti;
                    var $5527 = _term$4;
                    var $5468 = $5527;
                    break;
                case 'Fm.Term.ori':
                    var $5528 = self.orig;
                    var $5529 = self.expr;
                    var $5530 = _term$4;
                    var $5468 = $5530;
                    break;
            };
            return $5468;
        }));
        return $5467;
    };
    const Fm$Term$expand_at = x0 => x1 => x2 => Fm$Term$expand_at$(x0, x1, x2);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Fm$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5532 = self.name;
                var $5533 = self.indx;
                var $5534 = Fm$Term$var$($5532, $5533);
                var $5531 = $5534;
                break;
            case 'Fm.Term.ref':
                var $5535 = self.name;
                var _expand$5 = Bool$false;
                var _expand$6 = ((($5535 === "Nat.succ") && (_arity$3 > 1n)) || _expand$5);
                var _expand$7 = ((($5535 === "Nat.zero") && (_arity$3 > 0n)) || _expand$6);
                var _expand$8 = ((($5535 === "Bool.true") && (_arity$3 > 0n)) || _expand$7);
                var _expand$9 = ((($5535 === "Bool.false") && (_arity$3 > 0n)) || _expand$8);
                var self = _expand$9;
                if (self) {
                    var self = Fm$get$($5535, _defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5538 = Fm$Term$ref$($5535);
                            var $5537 = $5538;
                            break;
                        case 'Maybe.some':
                            var $5539 = self.value;
                            var self = $5539;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5541 = self.file;
                                    var $5542 = self.code;
                                    var $5543 = self.name;
                                    var $5544 = self.term;
                                    var $5545 = self.type;
                                    var $5546 = self.stat;
                                    var $5547 = $5544;
                                    var $5540 = $5547;
                                    break;
                            };
                            var $5537 = $5540;
                            break;
                    };
                    var $5536 = $5537;
                } else {
                    var $5548 = Fm$Term$ref$($5535);
                    var $5536 = $5548;
                };
                var $5531 = $5536;
                break;
            case 'Fm.Term.typ':
                var $5549 = Fm$Term$typ;
                var $5531 = $5549;
                break;
            case 'Fm.Term.all':
                var $5550 = self.eras;
                var $5551 = self.self;
                var $5552 = self.name;
                var $5553 = self.xtyp;
                var $5554 = self.body;
                var $5555 = Fm$Term$all$($5550, $5551, $5552, Fm$Term$expand_ct$($5553, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5556 = Fm$Term$expand_ct$($5554(_s$9)(_x$10), _defs$2, 0n);
                    return $5556;
                }));
                var $5531 = $5555;
                break;
            case 'Fm.Term.lam':
                var $5557 = self.name;
                var $5558 = self.body;
                var $5559 = Fm$Term$lam$($5557, (_x$6 => {
                    var $5560 = Fm$Term$expand_ct$($5558(_x$6), _defs$2, 0n);
                    return $5560;
                }));
                var $5531 = $5559;
                break;
            case 'Fm.Term.app':
                var $5561 = self.func;
                var $5562 = self.argm;
                var $5563 = Fm$Term$app$(Fm$Term$expand_ct$($5561, _defs$2, Nat$succ$(_arity$3)), Fm$Term$expand_ct$($5562, _defs$2, 0n));
                var $5531 = $5563;
                break;
            case 'Fm.Term.let':
                var $5564 = self.name;
                var $5565 = self.expr;
                var $5566 = self.body;
                var $5567 = Fm$Term$let$($5564, Fm$Term$expand_ct$($5565, _defs$2, 0n), (_x$7 => {
                    var $5568 = Fm$Term$expand_ct$($5566(_x$7), _defs$2, 0n);
                    return $5568;
                }));
                var $5531 = $5567;
                break;
            case 'Fm.Term.def':
                var $5569 = self.name;
                var $5570 = self.expr;
                var $5571 = self.body;
                var $5572 = Fm$Term$def$($5569, Fm$Term$expand_ct$($5570, _defs$2, 0n), (_x$7 => {
                    var $5573 = Fm$Term$expand_ct$($5571(_x$7), _defs$2, 0n);
                    return $5573;
                }));
                var $5531 = $5572;
                break;
            case 'Fm.Term.ann':
                var $5574 = self.done;
                var $5575 = self.term;
                var $5576 = self.type;
                var $5577 = Fm$Term$ann$($5574, Fm$Term$expand_ct$($5575, _defs$2, 0n), Fm$Term$expand_ct$($5576, _defs$2, 0n));
                var $5531 = $5577;
                break;
            case 'Fm.Term.gol':
                var $5578 = self.name;
                var $5579 = self.dref;
                var $5580 = self.verb;
                var $5581 = Fm$Term$gol$($5578, $5579, $5580);
                var $5531 = $5581;
                break;
            case 'Fm.Term.hol':
                var $5582 = self.path;
                var $5583 = Fm$Term$hol$($5582);
                var $5531 = $5583;
                break;
            case 'Fm.Term.nat':
                var $5584 = self.natx;
                var $5585 = Fm$Term$nat$($5584);
                var $5531 = $5585;
                break;
            case 'Fm.Term.chr':
                var $5586 = self.chrx;
                var $5587 = Fm$Term$chr$($5586);
                var $5531 = $5587;
                break;
            case 'Fm.Term.str':
                var $5588 = self.strx;
                var $5589 = Fm$Term$str$($5588);
                var $5531 = $5589;
                break;
            case 'Fm.Term.cse':
                var $5590 = self.path;
                var $5591 = self.expr;
                var $5592 = self.name;
                var $5593 = self.with;
                var $5594 = self.cses;
                var $5595 = self.moti;
                var $5596 = _term$1;
                var $5531 = $5596;
                break;
            case 'Fm.Term.ori':
                var $5597 = self.orig;
                var $5598 = self.expr;
                var $5599 = Fm$Term$ori$($5597, $5598);
                var $5531 = $5599;
                break;
        };
        return $5531;
    };
    const Fm$Term$expand_ct = x0 => x1 => x2 => Fm$Term$expand_ct$(x0, x1, x2);

    function Fm$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Fm$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5602 = _term$4;
            var $5603 = _dref$1;
            let _term$6 = $5602;
            let _path$5;
            while ($5603._ === 'List.cons') {
                _path$5 = $5603.head;
                var _term$7 = Fm$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Fm$Term$normalize$(_term$7, Map$new);
                var _term$9 = Fm$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Fm$Term$normalize$(_term$9, Map$new);
                var $5602 = _term$10;
                _term$6 = $5602;
                $5603 = $5603.tail;
            }
            return _term$6;
        })();
        var $5600 = _term$5;
        return $5600;
    };
    const Fm$Term$expand = x0 => x1 => x2 => Fm$Term$expand$(x0, x1, x2);

    function Fm$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5605 = self.origin;
                var $5606 = self.expected;
                var $5607 = self.detected;
                var $5608 = self.context;
                var self = $5606;
                switch (self._) {
                    case 'Either.left':
                        var $5610 = self.value;
                        var $5611 = $5610;
                        var _expected$7 = $5611;
                        break;
                    case 'Either.right':
                        var $5612 = self.value;
                        var $5613 = Fm$Term$show$(Fm$Term$normalize$($5612, Map$new));
                        var _expected$7 = $5613;
                        break;
                };
                var self = $5607;
                switch (self._) {
                    case 'Either.left':
                        var $5614 = self.value;
                        var $5615 = $5614;
                        var _detected$8 = $5615;
                        break;
                    case 'Either.right':
                        var $5616 = self.value;
                        var $5617 = Fm$Term$show$(Fm$Term$normalize$($5616, Map$new));
                        var _detected$8 = $5617;
                        break;
                };
                var $5609 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5608;
                    switch (self._) {
                        case 'List.nil':
                            var $5618 = "";
                            return $5618;
                        case 'List.cons':
                            var $5619 = self.head;
                            var $5620 = self.tail;
                            var $5621 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Fm$Context$show$($5608), List$nil)));
                            return $5621;
                    };
                })(), List$nil)))))))));
                var $5604 = $5609;
                break;
            case 'Fm.Error.show_goal':
                var $5622 = self.name;
                var $5623 = self.dref;
                var $5624 = self.verb;
                var $5625 = self.goal;
                var $5626 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Fm$Name$show$($5622), List$cons$(":\u{a}", List$nil))));
                var self = $5625;
                switch (self._) {
                    case 'Maybe.none':
                        var $5628 = "";
                        var _with_type$9 = $5628;
                        break;
                    case 'Maybe.some':
                        var $5629 = self.value;
                        var _goal$10 = Fm$Term$expand$($5623, $5629, _defs$2);
                        var $5630 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5624;
                            if (self) {
                                var $5631 = Fm$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5632 = _x$11;
                                    return $5632;
                                })));
                                return $5631;
                            } else {
                                var $5633 = Fm$Term$show$(_goal$10);
                                return $5633;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5630;
                        break;
                };
                var self = $5626;
                switch (self._) {
                    case 'List.nil':
                        var $5634 = "";
                        var _with_ctxt$10 = $5634;
                        break;
                    case 'List.cons':
                        var $5635 = self.head;
                        var $5636 = self.tail;
                        var $5637 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Fm$Context$show$($5626), List$nil)));
                        var _with_ctxt$10 = $5637;
                        break;
                };
                var $5627 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5604 = $5627;
                break;
            case 'Fm.Error.waiting':
                var $5638 = self.name;
                var $5639 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5638, List$cons$("\'.", List$nil))));
                var $5604 = $5639;
                break;
            case 'Fm.Error.indirect':
                var $5640 = self.name;
                var $5641 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5640, List$cons$("\'.", List$nil))));
                var $5604 = $5641;
                break;
            case 'Fm.Error.patch':
                var $5642 = self.path;
                var $5643 = self.term;
                var $5644 = String$flatten$(List$cons$("Patching: ", List$cons$(Fm$Term$show$($5643), List$nil)));
                var $5604 = $5644;
                break;
            case 'Fm.Error.undefined_reference':
                var $5645 = self.origin;
                var $5646 = self.name;
                var $5647 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Fm$Name$show$($5646), List$cons$("\u{a}", List$nil))));
                var $5604 = $5647;
                break;
            case 'Fm.Error.cant_infer':
                var $5648 = self.origin;
                var $5649 = self.term;
                var $5650 = self.context;
                var _term$6 = Fm$Term$show$($5649);
                var _context$7 = Fm$Context$show$($5650);
                var $5651 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5604 = $5651;
                break;
        };
        return $5604;
    };
    const Fm$Error$show = x0 => x1 => Fm$Error$show$(x0, x1);

    function Fm$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5653 = self.origin;
                var $5654 = self.expected;
                var $5655 = self.detected;
                var $5656 = self.context;
                var $5657 = $5653;
                var $5652 = $5657;
                break;
            case 'Fm.Error.show_goal':
                var $5658 = self.name;
                var $5659 = self.dref;
                var $5660 = self.verb;
                var $5661 = self.goal;
                var $5662 = self.context;
                var $5663 = Maybe$none;
                var $5652 = $5663;
                break;
            case 'Fm.Error.waiting':
                var $5664 = self.name;
                var $5665 = Maybe$none;
                var $5652 = $5665;
                break;
            case 'Fm.Error.indirect':
                var $5666 = self.name;
                var $5667 = Maybe$none;
                var $5652 = $5667;
                break;
            case 'Fm.Error.patch':
                var $5668 = self.path;
                var $5669 = self.term;
                var $5670 = Maybe$none;
                var $5652 = $5670;
                break;
            case 'Fm.Error.undefined_reference':
                var $5671 = self.origin;
                var $5672 = self.name;
                var $5673 = $5671;
                var $5652 = $5673;
                break;
            case 'Fm.Error.cant_infer':
                var $5674 = self.origin;
                var $5675 = self.term;
                var $5676 = self.context;
                var $5677 = $5674;
                var $5652 = $5677;
                break;
        };
        return $5652;
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
                        var $5678 = String$flatten$(List$cons$(_typs$4, List$cons$("\u{a}", List$cons$((() => {
                            var self = _errs$3;
                            if (self.length === 0) {
                                var $5679 = "All terms check.";
                                return $5679;
                            } else {
                                var $5680 = self.charCodeAt(0);
                                var $5681 = self.slice(1);
                                var $5682 = _errs$3;
                                return $5682;
                            };
                        })(), List$nil))));
                        return $5678;
                    case 'List.cons':
                        var $5683 = self.head;
                        var $5684 = self.tail;
                        var _name$7 = $5683;
                        var self = Fm$get$(_name$7, _defs$1);
                        switch (self._) {
                            case 'Maybe.none':
                                var $5686 = Fm$Defs$report$go$(_defs$1, $5684, _errs$3, _typs$4);
                                var $5685 = $5686;
                                break;
                            case 'Maybe.some':
                                var $5687 = self.value;
                                var self = $5687;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $5689 = self.file;
                                        var $5690 = self.code;
                                        var $5691 = self.name;
                                        var $5692 = self.term;
                                        var $5693 = self.type;
                                        var $5694 = self.stat;
                                        var _typs$15 = String$flatten$(List$cons$(_typs$4, List$cons$(_name$7, List$cons$(": ", List$cons$(Fm$Term$show$($5693), List$cons$("\u{a}", List$nil))))));
                                        var self = $5694;
                                        switch (self._) {
                                            case 'Fm.Status.init':
                                                var $5696 = Fm$Defs$report$go$(_defs$1, $5684, _errs$3, _typs$15);
                                                var $5695 = $5696;
                                                break;
                                            case 'Fm.Status.wait':
                                                var $5697 = Fm$Defs$report$go$(_defs$1, $5684, _errs$3, _typs$15);
                                                var $5695 = $5697;
                                                break;
                                            case 'Fm.Status.done':
                                                var $5698 = Fm$Defs$report$go$(_defs$1, $5684, _errs$3, _typs$15);
                                                var $5695 = $5698;
                                                break;
                                            case 'Fm.Status.fail':
                                                var $5699 = self.errors;
                                                var self = $5699;
                                                switch (self._) {
                                                    case 'List.nil':
                                                        var $5701 = Fm$Defs$report$go$(_defs$1, $5684, _errs$3, _typs$15);
                                                        var $5700 = $5701;
                                                        break;
                                                    case 'List.cons':
                                                        var $5702 = self.head;
                                                        var $5703 = self.tail;
                                                        var _name_str$19 = Fm$Name$show$($5691);
                                                        var _rel_errs$20 = Fm$Error$relevant$($5699, Bool$false);
                                                        var _rel_msgs$21 = List$mapped$(_rel_errs$20, (_err$21 => {
                                                            var $5705 = String$flatten$(List$cons$(Fm$Error$show$(_err$21, _defs$1), List$cons$((() => {
                                                                var self = Fm$Error$origin$(_err$21);
                                                                switch (self._) {
                                                                    case 'Maybe.none':
                                                                        var $5706 = "";
                                                                        return $5706;
                                                                    case 'Maybe.some':
                                                                        var $5707 = self.value;
                                                                        var self = $5707;
                                                                        switch (self._) {
                                                                            case 'Fm.Origin.new':
                                                                                var $5709 = self.file;
                                                                                var $5710 = self.from;
                                                                                var $5711 = self.upto;
                                                                                var $5712 = String$flatten$(List$cons$("Inside \'", List$cons$($5689, List$cons$("\':\u{a}", List$cons$(Fm$highlight$($5690, $5710, $5711), List$cons$("\u{a}", List$nil))))));
                                                                                var $5708 = $5712;
                                                                                break;
                                                                        };
                                                                        return $5708;
                                                                };
                                                            })(), List$nil)));
                                                            return $5705;
                                                        }));
                                                        var _errs$22 = String$flatten$(List$cons$(_errs$3, List$cons$(String$join$("\u{a}", _rel_msgs$21), List$cons$("\u{a}", List$nil))));
                                                        var $5704 = Fm$Defs$report$go$(_defs$1, $5684, _errs$22, _typs$15);
                                                        var $5700 = $5704;
                                                        break;
                                                };
                                                var $5695 = $5700;
                                                break;
                                        };
                                        var $5688 = $5695;
                                        break;
                                };
                                var $5685 = $5688;
                                break;
                        };
                        return $5685;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Defs$report$go = x0 => x1 => x2 => x3 => Fm$Defs$report$go$(x0, x1, x2, x3);

    function Fm$Defs$report$(_defs$1, _list$2) {
        var $5713 = Fm$Defs$report$go$(_defs$1, _list$2, "", "");
        return $5713;
    };
    const Fm$Defs$report = x0 => x1 => Fm$Defs$report$(x0, x1);

    function Fm$checker$io$one$(_name$1) {
        var $5714 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $5715 = IO$print$(Fm$Defs$report$(_defs$2, List$cons$(_name$1, List$nil)));
            return $5715;
        }));
        return $5714;
    };
    const Fm$checker$io$one = x0 => Fm$checker$io$one$(x0);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $5717 = _list$4;
                var $5716 = $5717;
                break;
            case 'Map.tie':
                var $5718 = self.val;
                var $5719 = self.lft;
                var $5720 = self.rgt;
                var self = $5718;
                switch (self._) {
                    case 'Maybe.none':
                        var $5722 = _list$4;
                        var _list0$8 = $5722;
                        break;
                    case 'Maybe.some':
                        var $5723 = self.value;
                        var $5724 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5724;
                        break;
                };
                var _list1$9 = Map$keys$go$($5719, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5720, (_key$3 + '1'), _list1$9);
                var $5721 = _list2$10;
                var $5716 = $5721;
                break;
        };
        return $5716;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5725 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5725;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Fm$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.nil':
                var $5727 = Monad$pure$(IO$monad)(_defs$2);
                var $5726 = $5727;
                break;
            case 'List.cons':
                var $5728 = self.head;
                var $5729 = self.tail;
                var $5730 = Monad$bind$(IO$monad)(Fm$Synth$one$($5728, _defs$2))((_defs$5 => {
                    var $5731 = Fm$Synth$many$($5729, _defs$5);
                    return $5731;
                }));
                var $5726 = $5730;
                break;
        };
        return $5726;
    };
    const Fm$Synth$many = x0 => x1 => Fm$Synth$many$(x0, x1);

    function Fm$Synth$file$(_file$1, _defs$2) {
        var $5732 = Monad$bind$(IO$monad)(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Fm$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5734 = self.value;
                    var $5735 = Monad$pure$(IO$monad)(Either$left$($5734));
                    var $5733 = $5735;
                    break;
                case 'Either.right':
                    var $5736 = self.value;
                    var _file_defs$6 = $5736;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Fm$Name$from_bits);
                    var $5737 = Monad$bind$(IO$monad)(Fm$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5738 = Monad$pure$(IO$monad)(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5738;
                    }));
                    var $5733 = $5737;
                    break;
            };
            return $5733;
        }));
        return $5732;
    };
    const Fm$Synth$file = x0 => x1 => Fm$Synth$file$(x0, x1);

    function Fm$checker$io$file$(_file$1) {
        var $5739 = Monad$bind$(IO$monad)(Fm$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5741 = self.value;
                    var $5742 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5743 = IO$print$($5741);
                        return $5743;
                    }));
                    var $5740 = $5742;
                    break;
                case 'Either.right':
                    var $5744 = self.value;
                    var self = $5744;
                    switch (self._) {
                        case 'Pair.new':
                            var $5746 = self.fst;
                            var $5747 = self.snd;
                            var _nams$6 = $5746;
                            var _defs$7 = $5747;
                            var $5748 = IO$print$(Fm$Defs$report$(_defs$7, _nams$6));
                            var $5745 = $5748;
                            break;
                    };
                    var $5740 = $5745;
                    break;
            };
            return $5740;
        }));
        return $5739;
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
                        var $5749 = self.value;
                        var $5750 = $5749;
                        return $5750;
                    case 'IO.ask':
                        var $5751 = self.query;
                        var $5752 = self.param;
                        var $5753 = self.then;
                        var $5754 = IO$purify$($5753(""));
                        return $5754;
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
                var $5756 = self.value;
                var $5757 = $5756;
                var $5755 = $5757;
                break;
            case 'Either.right':
                var $5758 = self.value;
                var $5759 = IO$purify$((() => {
                    var _defs$3 = $5758;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Fm$Name$from_bits);
                    var $5760 = Monad$bind$(IO$monad)(Fm$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5761 = Monad$pure$(IO$monad)(Fm$Defs$report$(_defs$5, _nams$4));
                        return $5761;
                    }));
                    return $5760;
                })());
                var $5755 = $5759;
                break;
        };
        return $5755;
    };
    const Fm$checker$code = x0 => Fm$checker$code$(x0);

    function Fm$Term$read$(_code$1) {
        var self = Fm$Parser$term(0n)(_code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $5763 = self.idx;
                var $5764 = self.code;
                var $5765 = self.err;
                var $5766 = Maybe$none;
                var $5762 = $5766;
                break;
            case 'Parser.Reply.value':
                var $5767 = self.idx;
                var $5768 = self.code;
                var $5769 = self.val;
                var $5770 = Maybe$some$($5769);
                var $5762 = $5770;
                break;
        };
        return $5762;
    };
    const Fm$Term$read = x0 => Fm$Term$read$(x0);
    const Fm = (() => {
        var __$1 = Fm$to_core$io$one;
        var __$2 = Fm$checker$io$one;
        var __$3 = Fm$checker$io$file;
        var __$4 = Fm$checker$code;
        var __$5 = Fm$Term$read;
        var $5771 = Fm$checker$io$file$("Main.fm");
        return $5771;
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
        'Fm.Parser.u8': Fm$Parser$u8,
        'Fm.Parser.u16': Fm$Parser$u16,
        'Fm.Parser.u32': Fm$Parser$u32,
        'Fm.Parser.u64': Fm$Parser$u64,
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