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
    const Fm$Parser$u8 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1059 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1060 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1061 = Monad$bind$(Parser$monad)(Fm$Parser$text$("b"))((_$4 => {
                    var _term$5 = Fm$Term$ref$("Nat.to_u8");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$nat$(_natx$3));
                    var $1062 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                        var $1063 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$6));
                        return $1063;
                    }));
                    return $1062;
                }));
                return $1061;
            }));
            return $1060;
        }));
        return $1059;
    }));
    const Fm$Parser$u16 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1064 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1065 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1066 = Monad$bind$(Parser$monad)(Fm$Parser$text$("s"))((_$4 => {
                    var _term$5 = Fm$Term$ref$("Nat.to_u16");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$nat$(_natx$3));
                    var $1067 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                        var $1068 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$6));
                        return $1068;
                    }));
                    return $1067;
                }));
                return $1066;
            }));
            return $1065;
        }));
        return $1064;
    }));
    const Fm$Parser$u32 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1069 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1070 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1071 = Monad$bind$(Parser$monad)(Fm$Parser$text$("u"))((_$4 => {
                    var _term$5 = Fm$Term$ref$("Nat.to_u32");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$nat$(_natx$3));
                    var $1072 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                        var $1073 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$6));
                        return $1073;
                    }));
                    return $1072;
                }));
                return $1071;
            }));
            return $1070;
        }));
        return $1069;
    }));
    const Fm$Parser$u64 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1074 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1075 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1076 = Monad$bind$(Parser$monad)(Fm$Parser$text$("l"))((_$4 => {
                    var _term$5 = Fm$Term$ref$("Nat.to_u64");
                    var _term$6 = Fm$Term$app$(_term$5, Fm$Term$nat$(_natx$3));
                    var $1077 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$7 => {
                        var $1078 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$6));
                        return $1078;
                    }));
                    return $1077;
                }));
                return $1076;
            }));
            return $1075;
        }));
        return $1074;
    }));
    const Fm$Parser$nat = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1079 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$2 => {
            var $1080 = Monad$bind$(Parser$monad)(Parser$nat)((_natx$3 => {
                var $1081 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$4 => {
                    var $1082 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$4, Fm$Term$nat$(_natx$3)));
                    return $1082;
                }));
                return $1081;
            }));
            return $1080;
        }));
        return $1079;
    }));
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $1083 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $1083;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);
    const Fm$Parser$reference = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$1 => {
        var $1084 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var self = (_name$2 === "case");
            if (self) {
                var $1086 = Parser$fail("Reserved keyword.");
                var $1085 = $1086;
            } else {
                var self = (_name$2 === "do");
                if (self) {
                    var $1088 = Parser$fail("Reserved keyword.");
                    var $1087 = $1088;
                } else {
                    var self = (_name$2 === "if");
                    if (self) {
                        var $1090 = Parser$fail("Reserved keyword.");
                        var $1089 = $1090;
                    } else {
                        var self = (_name$2 === "let");
                        if (self) {
                            var $1092 = Parser$fail("Reserved keyword.");
                            var $1091 = $1092;
                        } else {
                            var self = (_name$2 === "def");
                            if (self) {
                                var $1094 = Parser$fail("Reserved keyword.");
                                var $1093 = $1094;
                            } else {
                                var self = (_name$2 === "true");
                                if (self) {
                                    var $1096 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Bool.true"));
                                    var $1095 = $1096;
                                } else {
                                    var self = (_name$2 === "false");
                                    if (self) {
                                        var $1098 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Bool.false"));
                                        var $1097 = $1098;
                                    } else {
                                        var self = (_name$2 === "unit");
                                        if (self) {
                                            var $1100 = Monad$pure$(Parser$monad)(Fm$Term$ref$("Unit.new"));
                                            var $1099 = $1100;
                                        } else {
                                            var self = (_name$2 === "none");
                                            if (self) {
                                                var _term$3 = Fm$Term$ref$("Maybe.none");
                                                var _term$4 = Fm$Term$app$(_term$3, Fm$Term$hol$(Bits$e));
                                                var $1102 = Monad$pure$(Parser$monad)(_term$4);
                                                var $1101 = $1102;
                                            } else {
                                                var self = (_name$2 === "refl");
                                                if (self) {
                                                    var _term$3 = Fm$Term$ref$("Equal.refl");
                                                    var _term$4 = Fm$Term$app$(_term$3, Fm$Term$hol$(Bits$e));
                                                    var _term$5 = Fm$Term$app$(_term$4, Fm$Term$hol$(Bits$e));
                                                    var $1104 = Monad$pure$(Parser$monad)(_term$5);
                                                    var $1103 = $1104;
                                                } else {
                                                    var $1105 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$3 => {
                                                        var $1106 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$3, Fm$Term$ref$(_name$2)));
                                                        return $1106;
                                                    }));
                                                    var $1103 = $1105;
                                                };
                                                var $1101 = $1103;
                                            };
                                            var $1099 = $1101;
                                        };
                                        var $1097 = $1099;
                                    };
                                    var $1095 = $1097;
                                };
                                var $1093 = $1095;
                            };
                            var $1091 = $1093;
                        };
                        var $1089 = $1091;
                    };
                    var $1087 = $1089;
                };
                var $1085 = $1087;
            };
            return $1085;
        }));
        return $1084;
    }));
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Fm$Parser$application$(_init$1, _func$2) {
        var $1107 = Monad$bind$(Parser$monad)(Parser$text("("))((_$3 => {
            var $1108 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$(")"), Fm$Parser$item$(Fm$Parser$term)))((_args$4 => {
                var $1109 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _expr$6 = (() => {
                        var $1112 = _func$2;
                        var $1113 = _args$4;
                        let _f$7 = $1112;
                        let _x$6;
                        while ($1113._ === 'List.cons') {
                            _x$6 = $1113.head;
                            var $1112 = Fm$Term$app$(_f$7, _x$6);
                            _f$7 = $1112;
                            $1113 = $1113.tail;
                        }
                        return _f$7;
                    })();
                    var $1110 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _expr$6));
                    return $1110;
                }));
                return $1109;
            }));
            return $1108;
        }));
        return $1107;
    };
    const Fm$Parser$application = x0 => x1 => Fm$Parser$application$(x0, x1);
    const Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$nil))));

    function Parser$spaces_text$(_text$1) {
        var $1114 = Monad$bind$(Parser$monad)(Parser$spaces)((_$2 => {
            var $1115 = Parser$text(_text$1);
            return $1115;
        }));
        return $1114;
    };
    const Parser$spaces_text = x0 => Parser$spaces_text$(x0);

    function Fm$Parser$application$erased$(_init$1, _func$2) {
        var $1116 = Monad$bind$(Parser$monad)(Parser$get_index)((_init$3 => {
            var $1117 = Monad$bind$(Parser$monad)(Parser$text("<"))((_$4 => {
                var $1118 = Monad$bind$(Parser$monad)(Parser$until1$(Parser$spaces_text$(">"), Fm$Parser$item$(Fm$Parser$term)))((_args$5 => {
                    var $1119 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$3))((_orig$6 => {
                        var _expr$7 = (() => {
                            var $1122 = _func$2;
                            var $1123 = _args$5;
                            let _f$8 = $1122;
                            let _x$7;
                            while ($1123._ === 'List.cons') {
                                _x$7 = $1123.head;
                                var $1122 = Fm$Term$app$(_f$8, _x$7);
                                _f$8 = $1122;
                                $1123 = $1123.tail;
                            }
                            return _f$8;
                        })();
                        var $1120 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$6, _expr$7));
                        return $1120;
                    }));
                    return $1119;
                }));
                return $1118;
            }));
            return $1117;
        }));
        return $1116;
    };
    const Fm$Parser$application$erased = x0 => x1 => Fm$Parser$application$erased$(x0, x1);

    function Fm$Parser$arrow$(_init$1, _xtyp$2) {
        var $1124 = Monad$bind$(Parser$monad)(Fm$Parser$text$("->"))((_$3 => {
            var $1125 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_body$4 => {
                var $1126 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1127 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$all$(Bool$false, "", "", _xtyp$2, (_s$6 => _x$7 => {
                        var $1128 = _body$4;
                        return $1128;
                    }))));
                    return $1127;
                }));
                return $1126;
            }));
            return $1125;
        }));
        return $1124;
    };
    const Fm$Parser$arrow = x0 => x1 => Fm$Parser$arrow$(x0, x1);

    function Fm$Parser$op$(_sym$1, _ref$2, _init$3, _val0$4) {
        var $1129 = Monad$bind$(Parser$monad)(Fm$Parser$text$(_sym$1))((_$5 => {
            var $1130 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$6 => {
                var $1131 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$3))((_orig$7 => {
                    var _term$8 = Fm$Term$ref$(_ref$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val0$4);
                    var _term$10 = Fm$Term$app$(_term$9, _val1$6);
                    var $1132 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$7, _term$10));
                    return $1132;
                }));
                return $1131;
            }));
            return $1130;
        }));
        return $1129;
    };
    const Fm$Parser$op = x0 => x1 => x2 => x3 => Fm$Parser$op$(x0, x1, x2, x3);
    const Fm$Parser$add = Fm$Parser$op("+")("Nat.add");
    const Fm$Parser$sub = Fm$Parser$op("+")("Nat.add");
    const Fm$Parser$mul = Fm$Parser$op("*")("Nat.mul");
    const Fm$Parser$div = Fm$Parser$op("/")("Nat.div");
    const Fm$Parser$mod = Fm$Parser$op("%")("Nat.mod");

    function Fm$Parser$cons$(_init$1, _head$2) {
        var $1133 = Monad$bind$(Parser$monad)(Fm$Parser$text$("&"))((_$3 => {
            var $1134 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_tail$4 => {
                var $1135 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("List.cons");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _head$2);
                    var _term$9 = Fm$Term$app$(_term$8, _tail$4);
                    var $1136 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $1137 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
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
    const Fm$Parser$cons = x0 => x1 => Fm$Parser$cons$(x0, x1);

    function Fm$Parser$concat$(_init$1, _lst0$2) {
        var $1138 = Monad$bind$(Parser$monad)(Fm$Parser$text$("++"))((_$3 => {
            var $1139 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_lst1$4 => {
                var $1140 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("List.concat");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _lst0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _lst1$4);
                    var $1141 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$10 => {
                        var $1142 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$10, _term$9));
                        return $1142;
                    }));
                    return $1141;
                }));
                return $1140;
            }));
            return $1139;
        }));
        return $1138;
    };
    const Fm$Parser$concat = x0 => x1 => Fm$Parser$concat$(x0, x1);

    function Fm$Parser$string_concat$(_init$1, _str0$2) {
        var $1143 = Monad$bind$(Parser$monad)(Fm$Parser$text$("|"))((_$3 => {
            var $1144 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_str1$4 => {
                var $1145 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("String.concat");
                    var _term$7 = Fm$Term$app$(_term$6, _str0$2);
                    var _term$8 = Fm$Term$app$(_term$7, _str1$4);
                    var $1146 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$9 => {
                        var $1147 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$9, _term$8));
                        return $1147;
                    }));
                    return $1146;
                }));
                return $1145;
            }));
            return $1144;
        }));
        return $1143;
    };
    const Fm$Parser$string_concat = x0 => x1 => Fm$Parser$string_concat$(x0, x1);

    function Fm$Parser$sigma$(_init$1, _val0$2) {
        var $1148 = Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$3 => {
            var $1149 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1150 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Sigma.new");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, Fm$Term$hol$(Bits$e));
                    var _term$9 = Fm$Term$app$(_term$8, _val0$2);
                    var _term$10 = Fm$Term$app$(_term$9, _val1$4);
                    var $1151 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$10));
                    return $1151;
                }));
                return $1150;
            }));
            return $1149;
        }));
        return $1148;
    };
    const Fm$Parser$sigma = x0 => x1 => Fm$Parser$sigma$(x0, x1);

    function Fm$Parser$equality$(_init$1, _val0$2) {
        var $1152 = Monad$bind$(Parser$monad)(Fm$Parser$text$("=="))((_$3 => {
            var $1153 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_val1$4 => {
                var $1154 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var _term$6 = Fm$Term$ref$("Equal");
                    var _term$7 = Fm$Term$app$(_term$6, Fm$Term$hol$(Bits$e));
                    var _term$8 = Fm$Term$app$(_term$7, _val0$2);
                    var _term$9 = Fm$Term$app$(_term$8, _val1$4);
                    var $1155 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, _term$9));
                    return $1155;
                }));
                return $1154;
            }));
            return $1153;
        }));
        return $1152;
    };
    const Fm$Parser$equality = x0 => x1 => Fm$Parser$equality$(x0, x1);

    function Fm$Term$ann$(_done$1, _term$2, _type$3) {
        var $1156 = ({
            _: 'Fm.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $1156;
    };
    const Fm$Term$ann = x0 => x1 => x2 => Fm$Term$ann$(x0, x1, x2);

    function Fm$Parser$annotation$(_init$1, _term$2) {
        var $1157 = Monad$bind$(Parser$monad)(Fm$Parser$text$("::"))((_$3 => {
            var $1158 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$4 => {
                var $1159 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1160 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$ann$(Bool$false, _term$2, _type$4)));
                    return $1160;
                }));
                return $1159;
            }));
            return $1158;
        }));
        return $1157;
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
                        var $1162 = self.idx;
                        var $1163 = self.code;
                        var $1164 = self.err;
                        var $1165 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $1161 = $1165;
                        break;
                    case 'Parser.Reply.value':
                        var $1166 = self.idx;
                        var $1167 = self.code;
                        var $1168 = self.val;
                        var $1169 = Fm$Parser$suffix$(_init$1, $1168, $1166, $1167);
                        var $1161 = $1169;
                        break;
                };
                return $1161;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Parser$suffix = x0 => x1 => x2 => x3 => Fm$Parser$suffix$(x0, x1, x2, x3);
    const Fm$Parser$term = Monad$bind$(Parser$monad)(Parser$get_code)((_code$1 => {
        var $1170 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $1171 = Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$type, List$cons$(Fm$Parser$forall, List$cons$(Fm$Parser$lambda, List$cons$(Fm$Parser$lambda$erased, List$cons$(Fm$Parser$lambda$nameless, List$cons$(Fm$Parser$parenthesis, List$cons$(Fm$Parser$letforin, List$cons$(Fm$Parser$let, List$cons$(Fm$Parser$get, List$cons$(Fm$Parser$def, List$cons$(Fm$Parser$if, List$cons$(Fm$Parser$char, List$cons$(Fm$Parser$string, List$cons$(Fm$Parser$pair, List$cons$(Fm$Parser$sigma$type, List$cons$(Fm$Parser$some, List$cons$(Fm$Parser$apply, List$cons$(Fm$Parser$list, List$cons$(Fm$Parser$log, List$cons$(Fm$Parser$forin, List$cons$(Fm$Parser$forin2, List$cons$(Fm$Parser$do, List$cons$(Fm$Parser$case, List$cons$(Fm$Parser$open, List$cons$(Fm$Parser$goal, List$cons$(Fm$Parser$hole, List$cons$(Fm$Parser$u8, List$cons$(Fm$Parser$u16, List$cons$(Fm$Parser$u32, List$cons$(Fm$Parser$u64, List$cons$(Fm$Parser$nat, List$cons$(Fm$Parser$reference, List$nil))))))))))))))))))))))))))))))))))((_term$3 => {
                var $1172 = Fm$Parser$suffix(_init$2)(_term$3);
                return $1172;
            }));
            return $1171;
        }));
        return $1170;
    }));
    const Fm$Parser$name_term = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$1 => {
        var $1173 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$2 => {
            var $1174 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$3 => {
                var $1175 = Monad$pure$(Parser$monad)(Pair$new$(_name$1, _type$3));
                return $1175;
            }));
            return $1174;
        }));
        return $1173;
    }));

    function Fm$Binder$new$(_eras$1, _name$2, _term$3) {
        var $1176 = ({
            _: 'Fm.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $1176;
    };
    const Fm$Binder$new = x0 => x1 => x2 => Fm$Binder$new$(x0, x1, x2);

    function Fm$Parser$binder$homo$(_eras$1) {
        var $1177 = Monad$bind$(Parser$monad)(Fm$Parser$text$((() => {
            var self = _eras$1;
            if (self) {
                var $1178 = "<";
                return $1178;
            } else {
                var $1179 = "(";
                return $1179;
            };
        })()))((_$2 => {
            var $1180 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$((() => {
                var self = _eras$1;
                if (self) {
                    var $1181 = ">";
                    return $1181;
                } else {
                    var $1182 = ")";
                    return $1182;
                };
            })()), Fm$Parser$item$(Fm$Parser$name_term)))((_bind$3 => {
                var $1183 = Monad$pure$(Parser$monad)(List$mapped$(_bind$3, (_pair$4 => {
                    var self = _pair$4;
                    switch (self._) {
                        case 'Pair.new':
                            var $1185 = self.fst;
                            var $1186 = self.snd;
                            var $1187 = Fm$Binder$new$(_eras$1, $1185, $1186);
                            var $1184 = $1187;
                            break;
                    };
                    return $1184;
                })));
                return $1183;
            }));
            return $1180;
        }));
        return $1177;
    };
    const Fm$Parser$binder$homo = x0 => Fm$Parser$binder$homo$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.nil':
                var $1189 = _bs$3;
                var $1188 = $1189;
                break;
            case 'List.cons':
                var $1190 = self.head;
                var $1191 = self.tail;
                var $1192 = List$cons$($1190, List$concat$($1191, _bs$3));
                var $1188 = $1192;
                break;
        };
        return $1188;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1194 = List$nil;
                var $1193 = $1194;
                break;
            case 'List.cons':
                var $1195 = self.head;
                var $1196 = self.tail;
                var $1197 = List$concat$($1195, List$flatten$($1196));
                var $1193 = $1197;
                break;
        };
        return $1193;
    };
    const List$flatten = x0 => List$flatten$(x0);
    const Fm$Parser$binder = Monad$bind$(Parser$monad)(Parser$many1$(Parser$first_of$(List$cons$(Fm$Parser$binder$homo$(Bool$true), List$cons$(Fm$Parser$binder$homo$(Bool$false), List$nil)))))((_lists$1 => {
        var $1198 = Monad$pure$(Parser$monad)(List$flatten$(_lists$1));
        return $1198;
    }));

    function Fm$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.nil':
                var $1200 = _body$2;
                var $1199 = $1200;
                break;
            case 'List.cons':
                var $1201 = self.head;
                var $1202 = self.tail;
                var self = $1201;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1204 = self.eras;
                        var $1205 = self.name;
                        var $1206 = self.term;
                        var $1207 = Fm$Term$all$($1204, "", $1205, $1206, (_s$8 => _x$9 => {
                            var $1208 = Fm$Parser$make_forall$($1202, _body$2);
                            return $1208;
                        }));
                        var $1203 = $1207;
                        break;
                };
                var $1199 = $1203;
                break;
        };
        return $1199;
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
                        var $1209 = Maybe$none;
                        return $1209;
                    case 'List.cons':
                        var $1210 = self.head;
                        var $1211 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $1213 = Maybe$some$($1210);
                            var $1212 = $1213;
                        } else {
                            var $1214 = (self - 1n);
                            var $1215 = List$at$($1214, $1211);
                            var $1212 = $1215;
                        };
                        return $1212;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $1216 = List$at$(_index$2, List$reverse$(_list$3));
        return $1216;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Fm$Term$var$(_name$1, _indx$2) {
        var $1217 = ({
            _: 'Fm.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $1217;
    };
    const Fm$Term$var = x0 => x1 => Fm$Term$var$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1219 = self.fst;
                var $1220 = self.snd;
                var $1221 = $1220;
                var $1218 = $1221;
                break;
        };
        return $1218;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Fm$Name$eql$(_a$1, _b$2) {
        var $1222 = (_a$1 === _b$2);
        return $1222;
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
                        var $1223 = Maybe$none;
                        return $1223;
                    case 'List.cons':
                        var $1224 = self.head;
                        var $1225 = self.tail;
                        var self = $1224;
                        switch (self._) {
                            case 'Pair.new':
                                var $1227 = self.fst;
                                var $1228 = self.snd;
                                var self = Fm$Name$eql$(_name$1, $1227);
                                if (self) {
                                    var $1230 = Maybe$some$($1228);
                                    var $1229 = $1230;
                                } else {
                                    var $1231 = Fm$Context$find$(_name$1, $1225);
                                    var $1229 = $1231;
                                };
                                var $1226 = $1229;
                                break;
                        };
                        return $1226;
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
                var $1233 = 0n;
                var $1232 = $1233;
                break;
            case 'List.cons':
                var $1234 = self.head;
                var $1235 = self.tail;
                var $1236 = Nat$succ$(List$length$($1235));
                var $1232 = $1236;
                break;
        };
        return $1232;
    };
    const List$length = x0 => List$length$(x0);

    function Fm$Path$o$(_path$1, _x$2) {
        var $1237 = _path$1((_x$2 + '0'));
        return $1237;
    };
    const Fm$Path$o = x0 => x1 => Fm$Path$o$(x0, x1);

    function Fm$Path$i$(_path$1, _x$2) {
        var $1238 = _path$1((_x$2 + '1'));
        return $1238;
    };
    const Fm$Path$i = x0 => x1 => Fm$Path$i$(x0, x1);

    function Fm$Path$to_bits$(_path$1) {
        var $1239 = _path$1(Bits$e);
        return $1239;
    };
    const Fm$Path$to_bits = x0 => Fm$Path$to_bits$(x0);

    function Fm$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Fm.Term.var':
                var $1241 = self.name;
                var $1242 = self.indx;
                var self = List$at_last$($1242, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1244 = Fm$Term$var$($1241, $1242);
                        var $1243 = $1244;
                        break;
                    case 'Maybe.some':
                        var $1245 = self.value;
                        var $1246 = Pair$snd$($1245);
                        var $1243 = $1246;
                        break;
                };
                var $1240 = $1243;
                break;
            case 'Fm.Term.ref':
                var $1247 = self.name;
                var self = Fm$Context$find$($1247, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1249 = Fm$Term$ref$($1247);
                        var $1248 = $1249;
                        break;
                    case 'Maybe.some':
                        var $1250 = self.value;
                        var $1251 = $1250;
                        var $1248 = $1251;
                        break;
                };
                var $1240 = $1248;
                break;
            case 'Fm.Term.typ':
                var $1252 = Fm$Term$typ;
                var $1240 = $1252;
                break;
            case 'Fm.Term.all':
                var $1253 = self.eras;
                var $1254 = self.self;
                var $1255 = self.name;
                var $1256 = self.xtyp;
                var $1257 = self.body;
                var _vlen$9 = List$length$(_vars$1);
                var $1258 = Fm$Term$all$($1253, $1254, $1255, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1256), (_s$10 => _x$11 => {
                    var $1259 = Fm$Term$bind$(List$cons$(Pair$new$($1255, _x$11), List$cons$(Pair$new$($1254, _s$10), _vars$1)), Fm$Path$i(_path$2), $1257(Fm$Term$var$($1254, _vlen$9))(Fm$Term$var$($1255, Nat$succ$(_vlen$9))));
                    return $1259;
                }));
                var $1240 = $1258;
                break;
            case 'Fm.Term.lam':
                var $1260 = self.name;
                var $1261 = self.body;
                var _vlen$6 = List$length$(_vars$1);
                var $1262 = Fm$Term$lam$($1260, (_x$7 => {
                    var $1263 = Fm$Term$bind$(List$cons$(Pair$new$($1260, _x$7), _vars$1), Fm$Path$o(_path$2), $1261(Fm$Term$var$($1260, _vlen$6)));
                    return $1263;
                }));
                var $1240 = $1262;
                break;
            case 'Fm.Term.app':
                var $1264 = self.func;
                var $1265 = self.argm;
                var $1266 = Fm$Term$app$(Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1264), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1265));
                var $1240 = $1266;
                break;
            case 'Fm.Term.let':
                var $1267 = self.name;
                var $1268 = self.expr;
                var $1269 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1270 = Fm$Term$let$($1267, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1268), (_x$8 => {
                    var $1271 = Fm$Term$bind$(List$cons$(Pair$new$($1267, _x$8), _vars$1), Fm$Path$i(_path$2), $1269(Fm$Term$var$($1267, _vlen$7)));
                    return $1271;
                }));
                var $1240 = $1270;
                break;
            case 'Fm.Term.def':
                var $1272 = self.name;
                var $1273 = self.expr;
                var $1274 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1275 = Fm$Term$def$($1272, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1273), (_x$8 => {
                    var $1276 = Fm$Term$bind$(List$cons$(Pair$new$($1272, _x$8), _vars$1), Fm$Path$i(_path$2), $1274(Fm$Term$var$($1272, _vlen$7)));
                    return $1276;
                }));
                var $1240 = $1275;
                break;
            case 'Fm.Term.ann':
                var $1277 = self.done;
                var $1278 = self.term;
                var $1279 = self.type;
                var $1280 = Fm$Term$ann$($1277, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1278), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1279));
                var $1240 = $1280;
                break;
            case 'Fm.Term.gol':
                var $1281 = self.name;
                var $1282 = self.dref;
                var $1283 = self.verb;
                var $1284 = Fm$Term$gol$($1281, $1282, $1283);
                var $1240 = $1284;
                break;
            case 'Fm.Term.hol':
                var $1285 = self.path;
                var $1286 = Fm$Term$hol$(Fm$Path$to_bits$(_path$2));
                var $1240 = $1286;
                break;
            case 'Fm.Term.nat':
                var $1287 = self.natx;
                var $1288 = Fm$Term$nat$($1287);
                var $1240 = $1288;
                break;
            case 'Fm.Term.chr':
                var $1289 = self.chrx;
                var $1290 = Fm$Term$chr$($1289);
                var $1240 = $1290;
                break;
            case 'Fm.Term.str':
                var $1291 = self.strx;
                var $1292 = Fm$Term$str$($1291);
                var $1240 = $1292;
                break;
            case 'Fm.Term.cse':
                var $1293 = self.path;
                var $1294 = self.expr;
                var $1295 = self.name;
                var $1296 = self.with;
                var $1297 = self.cses;
                var $1298 = self.moti;
                var _expr$10 = Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1294);
                var _name$11 = $1295;
                var _wyth$12 = $1296;
                var _cses$13 = $1297;
                var _moti$14 = $1298;
                var $1299 = Fm$Term$cse$(Fm$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $1240 = $1299;
                break;
            case 'Fm.Term.ori':
                var $1300 = self.orig;
                var $1301 = self.expr;
                var $1302 = Fm$Term$ori$($1300, Fm$Term$bind$(_vars$1, _path$2, $1301));
                var $1240 = $1302;
                break;
        };
        return $1240;
    };
    const Fm$Term$bind = x0 => x1 => x2 => Fm$Term$bind$(x0, x1, x2);
    const Fm$Status$done = ({
        _: 'Fm.Status.done'
    });

    function Fm$set$(_name$2, _val$3, _map$4) {
        var $1303 = Map$set$((fm_name_to_bits(_name$2)), _val$3, _map$4);
        return $1303;
    };
    const Fm$set = x0 => x1 => x2 => Fm$set$(x0, x1, x2);

    function Fm$define$(_file$1, _code$2, _name$3, _term$4, _type$5, _done$6, _defs$7) {
        var self = _done$6;
        if (self) {
            var $1305 = Fm$Status$done;
            var _stat$8 = $1305;
        } else {
            var $1306 = Fm$Status$init;
            var _stat$8 = $1306;
        };
        var $1304 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$4, _type$5, _stat$8), _defs$7);
        return $1304;
    };
    const Fm$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Fm$define$(x0, x1, x2, x3, x4, x5, x6);

    function Fm$Parser$file$def$(_file$1, _code$2, _defs$3) {
        var $1307 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
            var $1308 = Monad$bind$(Parser$monad)(Parser$many$(Fm$Parser$binder))((_args$5 => {
                var _args$6 = List$flatten$(_args$5);
                var $1309 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$7 => {
                    var $1310 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$8 => {
                        var $1311 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$9 => {
                            var _type$10 = Fm$Parser$make_forall$(_args$6, _type$8);
                            var _term$11 = Fm$Parser$make_lambda$(List$mapped$(_args$6, (_x$11 => {
                                var self = _x$11;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $1314 = self.eras;
                                        var $1315 = self.name;
                                        var $1316 = self.term;
                                        var $1317 = $1315;
                                        var $1313 = $1317;
                                        break;
                                };
                                return $1313;
                            })), _term$9);
                            var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                                var $1318 = (_x$12 + '1');
                                return $1318;
                            }), _type$10);
                            var _term$13 = Fm$Term$bind$(List$nil, (_x$13 => {
                                var $1319 = (_x$13 + '0');
                                return $1319;
                            }), _term$11);
                            var _defs$14 = Fm$define$(_file$1, _code$2, _name$4, _term$13, _type$12, Bool$false, _defs$3);
                            var $1312 = Monad$pure$(Parser$monad)(_defs$14);
                            return $1312;
                        }));
                        return $1311;
                    }));
                    return $1310;
                }));
                return $1309;
            }));
            return $1308;
        }));
        return $1307;
    };
    const Fm$Parser$file$def = x0 => x1 => x2 => Fm$Parser$file$def$(x0, x1, x2);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $1321 = _a$2;
                var $1320 = $1321;
                break;
            case 'Maybe.some':
                var $1322 = self.value;
                var $1323 = $1322;
                var $1320 = $1323;
                break;
        };
        return $1320;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Fm$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $1324 = ({
            _: 'Fm.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $1324;
    };
    const Fm$Constructor$new = x0 => x1 => x2 => Fm$Constructor$new$(x0, x1, x2);

    function Fm$Parser$constructor$(_namespace$1) {
        var $1325 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1326 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_args$3 => {
                var $1327 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1328 = Fm$Parser$binder;
                    return $1328;
                }))))((_inds$4 => {
                    var _args$5 = Maybe$default$(List$nil, _args$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1329 = Monad$pure$(Parser$monad)(Fm$Constructor$new$(_name$2, _args$5, _inds$6));
                    return $1329;
                }));
                return $1327;
            }));
            return $1326;
        }));
        return $1325;
    };
    const Fm$Parser$constructor = x0 => Fm$Parser$constructor$(x0);

    function Fm$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $1330 = ({
            _: 'Fm.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $1330;
    };
    const Fm$Datatype$new = x0 => x1 => x2 => x3 => Fm$Datatype$new$(x0, x1, x2, x3);
    const Fm$Parser$datatype = Monad$bind$(Parser$monad)(Fm$Parser$text$("type "))((_$1 => {
        var $1331 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1332 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_pars$3 => {
                var $1333 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1334 = Fm$Parser$binder;
                    return $1334;
                }))))((_inds$4 => {
                    var _pars$5 = Maybe$default$(List$nil, _pars$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1335 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$7 => {
                        var $1336 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("}"), Fm$Parser$item$(Fm$Parser$constructor$(_name$2))))((_ctrs$8 => {
                            var $1337 = Monad$pure$(Parser$monad)(Fm$Datatype$new$(_name$2, _pars$5, _inds$6, _ctrs$8));
                            return $1337;
                        }));
                        return $1336;
                    }));
                    return $1335;
                }));
                return $1333;
            }));
            return $1332;
        }));
        return $1331;
    }));

    function Fm$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1340 = self.name;
                        var $1341 = self.pars;
                        var $1342 = self.inds;
                        var $1343 = self.ctrs;
                        var _slf$8 = Fm$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $1346 = _slf$8;
                            var $1347 = $1341;
                            let _slf$10 = $1346;
                            let _var$9;
                            while ($1347._ === 'List.cons') {
                                _var$9 = $1347.head;
                                var $1346 = Fm$Term$app$(_slf$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1348 = self.eras;
                                            var $1349 = self.name;
                                            var $1350 = self.term;
                                            var $1351 = $1349;
                                            return $1351;
                                    };
                                })()));
                                _slf$10 = $1346;
                                $1347 = $1347.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $1353 = _slf$9;
                            var $1354 = $1342;
                            let _slf$11 = $1353;
                            let _var$10;
                            while ($1354._ === 'List.cons') {
                                _var$10 = $1354.head;
                                var $1353 = Fm$Term$app$(_slf$11, Fm$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1355 = self.eras;
                                            var $1356 = self.name;
                                            var $1357 = self.term;
                                            var $1358 = $1356;
                                            return $1358;
                                    };
                                })()));
                                _slf$11 = $1353;
                                $1354 = $1354.tail;
                            }
                            return _slf$11;
                        })();
                        var $1344 = Fm$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $1359 = Fm$Term$typ;
                            return $1359;
                        }));
                        var $1339 = $1344;
                        break;
                };
                var $1338 = $1339;
                break;
            case 'List.cons':
                var $1360 = self.head;
                var $1361 = self.tail;
                var self = $1360;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1363 = self.eras;
                        var $1364 = self.name;
                        var $1365 = self.term;
                        var $1366 = Fm$Term$all$($1363, "", $1364, $1365, (_s$9 => _x$10 => {
                            var $1367 = Fm$Datatype$build_term$motive$go$(_type$1, _name$2, $1361);
                            return $1367;
                        }));
                        var $1362 = $1366;
                        break;
                };
                var $1338 = $1362;
                break;
        };
        return $1338;
    };
    const Fm$Datatype$build_term$motive$go = x0 => x1 => x2 => Fm$Datatype$build_term$motive$go$(x0, x1, x2);

    function Fm$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1369 = self.name;
                var $1370 = self.pars;
                var $1371 = self.inds;
                var $1372 = self.ctrs;
                var $1373 = Fm$Datatype$build_term$motive$go$(_type$1, $1369, $1371);
                var $1368 = $1373;
                break;
        };
        return $1368;
    };
    const Fm$Datatype$build_term$motive = x0 => Fm$Datatype$build_term$motive$(x0);

    function Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1376 = self.name;
                        var $1377 = self.pars;
                        var $1378 = self.inds;
                        var $1379 = self.ctrs;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Fm.Constructor.new':
                                var $1381 = self.name;
                                var $1382 = self.args;
                                var $1383 = self.inds;
                                var _ret$11 = Fm$Term$ref$(Fm$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $1386 = _ret$11;
                                    var $1387 = $1383;
                                    let _ret$13 = $1386;
                                    let _var$12;
                                    while ($1387._ === 'List.cons') {
                                        _var$12 = $1387.head;
                                        var $1386 = Fm$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1388 = self.eras;
                                                    var $1389 = self.name;
                                                    var $1390 = self.term;
                                                    var $1391 = $1390;
                                                    return $1391;
                                            };
                                        })());
                                        _ret$13 = $1386;
                                        $1387 = $1387.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($1376, List$cons$(Fm$Name$read$("."), List$cons$($1381, List$nil))));
                                var _slf$14 = Fm$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $1393 = _slf$14;
                                    var $1394 = $1377;
                                    let _slf$16 = $1393;
                                    let _var$15;
                                    while ($1394._ === 'List.cons') {
                                        _var$15 = $1394.head;
                                        var $1393 = Fm$Term$app$(_slf$16, Fm$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1395 = self.eras;
                                                    var $1396 = self.name;
                                                    var $1397 = self.term;
                                                    var $1398 = $1396;
                                                    return $1398;
                                            };
                                        })()));
                                        _slf$16 = $1393;
                                        $1394 = $1394.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $1400 = _slf$15;
                                    var $1401 = $1382;
                                    let _slf$17 = $1400;
                                    let _var$16;
                                    while ($1401._ === 'List.cons') {
                                        _var$16 = $1401.head;
                                        var $1400 = Fm$Term$app$(_slf$17, Fm$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1402 = self.eras;
                                                    var $1403 = self.name;
                                                    var $1404 = self.term;
                                                    var $1405 = $1403;
                                                    return $1405;
                                            };
                                        })()));
                                        _slf$17 = $1400;
                                        $1401 = $1401.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $1384 = Fm$Term$app$(_ret$12, _slf$16);
                                var $1380 = $1384;
                                break;
                        };
                        var $1375 = $1380;
                        break;
                };
                var $1374 = $1375;
                break;
            case 'List.cons':
                var $1406 = self.head;
                var $1407 = self.tail;
                var self = $1406;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1409 = self.eras;
                        var $1410 = self.name;
                        var $1411 = self.term;
                        var _eras$9 = $1409;
                        var _name$10 = $1410;
                        var _xtyp$11 = $1411;
                        var _body$12 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1407);
                        var $1412 = Fm$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $1413 = _body$12;
                            return $1413;
                        }));
                        var $1408 = $1412;
                        break;
                };
                var $1374 = $1408;
                break;
        };
        return $1374;
    };
    const Fm$Datatype$build_term$constructor$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Fm.Constructor.new':
                var $1415 = self.name;
                var $1416 = self.args;
                var $1417 = self.inds;
                var $1418 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1416);
                var $1414 = $1418;
                break;
        };
        return $1414;
    };
    const Fm$Datatype$build_term$constructor = x0 => x1 => Fm$Datatype$build_term$constructor$(x0, x1);

    function Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1421 = self.name;
                        var $1422 = self.pars;
                        var $1423 = self.inds;
                        var $1424 = self.ctrs;
                        var _ret$8 = Fm$Term$ref$(Fm$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $1427 = _ret$8;
                            var $1428 = $1423;
                            let _ret$10 = $1427;
                            let _var$9;
                            while ($1428._ === 'List.cons') {
                                _var$9 = $1428.head;
                                var $1427 = Fm$Term$app$(_ret$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1429 = self.eras;
                                            var $1430 = self.name;
                                            var $1431 = self.term;
                                            var $1432 = $1430;
                                            return $1432;
                                    };
                                })()));
                                _ret$10 = $1427;
                                $1428 = $1428.tail;
                            }
                            return _ret$10;
                        })();
                        var $1425 = Fm$Term$app$(_ret$9, Fm$Term$ref$((_name$2 + ".Self")));
                        var $1420 = $1425;
                        break;
                };
                var $1419 = $1420;
                break;
            case 'List.cons':
                var $1433 = self.head;
                var $1434 = self.tail;
                var self = $1433;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1436 = self.name;
                        var $1437 = self.args;
                        var $1438 = self.inds;
                        var $1439 = Fm$Term$all$(Bool$false, "", $1436, Fm$Datatype$build_term$constructor$(_type$1, $1433), (_s$9 => _x$10 => {
                            var $1440 = Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, $1434);
                            return $1440;
                        }));
                        var $1435 = $1439;
                        break;
                };
                var $1419 = $1435;
                break;
        };
        return $1419;
    };
    const Fm$Datatype$build_term$constructors$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1442 = self.name;
                var $1443 = self.pars;
                var $1444 = self.inds;
                var $1445 = self.ctrs;
                var $1446 = Fm$Datatype$build_term$constructors$go$(_type$1, $1442, $1445);
                var $1441 = $1446;
                break;
        };
        return $1441;
    };
    const Fm$Datatype$build_term$constructors = x0 => Fm$Datatype$build_term$constructors$(x0);

    function Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1449 = Fm$Term$all$(Bool$true, (_name$2 + ".Self"), Fm$Name$read$("P"), Fm$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $1450 = Fm$Datatype$build_term$constructors$(_type$1);
                            return $1450;
                        }));
                        var $1448 = $1449;
                        break;
                    case 'List.cons':
                        var $1451 = self.head;
                        var $1452 = self.tail;
                        var self = $1451;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1454 = self.eras;
                                var $1455 = self.name;
                                var $1456 = self.term;
                                var $1457 = Fm$Term$lam$($1455, (_x$10 => {
                                    var $1458 = Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $1452);
                                    return $1458;
                                }));
                                var $1453 = $1457;
                                break;
                        };
                        var $1448 = $1453;
                        break;
                };
                var $1447 = $1448;
                break;
            case 'List.cons':
                var $1459 = self.head;
                var $1460 = self.tail;
                var self = $1459;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1462 = self.eras;
                        var $1463 = self.name;
                        var $1464 = self.term;
                        var $1465 = Fm$Term$lam$($1463, (_x$10 => {
                            var $1466 = Fm$Datatype$build_term$go$(_type$1, _name$2, $1460, _inds$4);
                            return $1466;
                        }));
                        var $1461 = $1465;
                        break;
                };
                var $1447 = $1461;
                break;
        };
        return $1447;
    };
    const Fm$Datatype$build_term$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_term$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1468 = self.name;
                var $1469 = self.pars;
                var $1470 = self.inds;
                var $1471 = self.ctrs;
                var $1472 = Fm$Datatype$build_term$go$(_type$1, $1468, $1469, $1470);
                var $1467 = $1472;
                break;
        };
        return $1467;
    };
    const Fm$Datatype$build_term = x0 => Fm$Datatype$build_term$(x0);

    function Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1475 = Fm$Term$typ;
                        var $1474 = $1475;
                        break;
                    case 'List.cons':
                        var $1476 = self.head;
                        var $1477 = self.tail;
                        var self = $1476;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1479 = self.eras;
                                var $1480 = self.name;
                                var $1481 = self.term;
                                var $1482 = Fm$Term$all$(Bool$false, "", $1480, $1481, (_s$10 => _x$11 => {
                                    var $1483 = Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $1477);
                                    return $1483;
                                }));
                                var $1478 = $1482;
                                break;
                        };
                        var $1474 = $1478;
                        break;
                };
                var $1473 = $1474;
                break;
            case 'List.cons':
                var $1484 = self.head;
                var $1485 = self.tail;
                var self = $1484;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1487 = self.eras;
                        var $1488 = self.name;
                        var $1489 = self.term;
                        var $1490 = Fm$Term$all$(Bool$false, "", $1488, $1489, (_s$10 => _x$11 => {
                            var $1491 = Fm$Datatype$build_type$go$(_type$1, _name$2, $1485, _inds$4);
                            return $1491;
                        }));
                        var $1486 = $1490;
                        break;
                };
                var $1473 = $1486;
                break;
        };
        return $1473;
    };
    const Fm$Datatype$build_type$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_type$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1493 = self.name;
                var $1494 = self.pars;
                var $1495 = self.inds;
                var $1496 = self.ctrs;
                var $1497 = Fm$Datatype$build_type$go$(_type$1, $1493, $1494, $1495);
                var $1492 = $1497;
                break;
        };
        return $1492;
    };
    const Fm$Datatype$build_type = x0 => Fm$Datatype$build_type$(x0);

    function Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1500 = self.name;
                        var $1501 = self.args;
                        var $1502 = self.inds;
                        var _ret$7 = Fm$Term$ref$($1500);
                        var _ret$8 = (() => {
                            var $1505 = _ret$7;
                            var $1506 = $1501;
                            let _ret$9 = $1505;
                            let _arg$8;
                            while ($1506._ === 'List.cons') {
                                _arg$8 = $1506.head;
                                var $1505 = Fm$Term$app$(_ret$9, Fm$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1507 = self.eras;
                                            var $1508 = self.name;
                                            var $1509 = self.term;
                                            var $1510 = $1508;
                                            return $1510;
                                    };
                                })()));
                                _ret$9 = $1505;
                                $1506 = $1506.tail;
                            }
                            return _ret$9;
                        })();
                        var $1503 = _ret$8;
                        var $1499 = $1503;
                        break;
                };
                var $1498 = $1499;
                break;
            case 'List.cons':
                var $1511 = self.head;
                var $1512 = self.tail;
                var self = $1511;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1514 = self.name;
                        var $1515 = self.args;
                        var $1516 = self.inds;
                        var $1517 = Fm$Term$lam$($1514, (_x$9 => {
                            var $1518 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1512);
                            return $1518;
                        }));
                        var $1513 = $1517;
                        break;
                };
                var $1498 = $1513;
                break;
        };
        return $1498;
    };
    const Fm$Constructor$build_term$opt$go = x0 => x1 => x2 => Fm$Constructor$build_term$opt$go$(x0, x1, x2);

    function Fm$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1520 = self.name;
                var $1521 = self.pars;
                var $1522 = self.inds;
                var $1523 = self.ctrs;
                var $1524 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1523);
                var $1519 = $1524;
                break;
        };
        return $1519;
    };
    const Fm$Constructor$build_term$opt = x0 => x1 => Fm$Constructor$build_term$opt$(x0, x1);

    function Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.nil':
                        var $1527 = Fm$Term$lam$(Fm$Name$read$("P"), (_x$6 => {
                            var $1528 = Fm$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $1528;
                        }));
                        var $1526 = $1527;
                        break;
                    case 'List.cons':
                        var $1529 = self.head;
                        var $1530 = self.tail;
                        var self = $1529;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1532 = self.eras;
                                var $1533 = self.name;
                                var $1534 = self.term;
                                var $1535 = Fm$Term$lam$($1533, (_x$11 => {
                                    var $1536 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $1530);
                                    return $1536;
                                }));
                                var $1531 = $1535;
                                break;
                        };
                        var $1526 = $1531;
                        break;
                };
                var $1525 = $1526;
                break;
            case 'List.cons':
                var $1537 = self.head;
                var $1538 = self.tail;
                var self = $1537;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1540 = self.eras;
                        var $1541 = self.name;
                        var $1542 = self.term;
                        var $1543 = Fm$Term$lam$($1541, (_x$11 => {
                            var $1544 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $1538, _args$5);
                            return $1544;
                        }));
                        var $1539 = $1543;
                        break;
                };
                var $1525 = $1539;
                break;
        };
        return $1525;
    };
    const Fm$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1546 = self.name;
                var $1547 = self.pars;
                var $1548 = self.inds;
                var $1549 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1551 = self.name;
                        var $1552 = self.args;
                        var $1553 = self.inds;
                        var $1554 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, $1546, $1547, $1552);
                        var $1550 = $1554;
                        break;
                };
                var $1545 = $1550;
                break;
        };
        return $1545;
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
                                var $1558 = self.name;
                                var $1559 = self.pars;
                                var $1560 = self.inds;
                                var $1561 = self.ctrs;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Fm.Constructor.new':
                                        var $1563 = self.name;
                                        var $1564 = self.args;
                                        var $1565 = self.inds;
                                        var _type$13 = Fm$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $1568 = _type$13;
                                            var $1569 = $1559;
                                            let _type$15 = $1568;
                                            let _var$14;
                                            while ($1569._ === 'List.cons') {
                                                _var$14 = $1569.head;
                                                var $1568 = Fm$Term$app$(_type$15, Fm$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1570 = self.eras;
                                                            var $1571 = self.name;
                                                            var $1572 = self.term;
                                                            var $1573 = $1571;
                                                            return $1573;
                                                    };
                                                })()));
                                                _type$15 = $1568;
                                                $1569 = $1569.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $1575 = _type$14;
                                            var $1576 = $1565;
                                            let _type$16 = $1575;
                                            let _var$15;
                                            while ($1576._ === 'List.cons') {
                                                _var$15 = $1576.head;
                                                var $1575 = Fm$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1577 = self.eras;
                                                            var $1578 = self.name;
                                                            var $1579 = self.term;
                                                            var $1580 = $1579;
                                                            return $1580;
                                                    };
                                                })());
                                                _type$16 = $1575;
                                                $1576 = $1576.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $1566 = _type$15;
                                        var $1562 = $1566;
                                        break;
                                };
                                var $1557 = $1562;
                                break;
                        };
                        var $1556 = $1557;
                        break;
                    case 'List.cons':
                        var $1581 = self.head;
                        var $1582 = self.tail;
                        var self = $1581;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1584 = self.eras;
                                var $1585 = self.name;
                                var $1586 = self.term;
                                var $1587 = Fm$Term$all$($1584, "", $1585, $1586, (_s$11 => _x$12 => {
                                    var $1588 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $1582);
                                    return $1588;
                                }));
                                var $1583 = $1587;
                                break;
                        };
                        var $1556 = $1583;
                        break;
                };
                var $1555 = $1556;
                break;
            case 'List.cons':
                var $1589 = self.head;
                var $1590 = self.tail;
                var self = $1589;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1592 = self.eras;
                        var $1593 = self.name;
                        var $1594 = self.term;
                        var $1595 = Fm$Term$all$($1592, "", $1593, $1594, (_s$11 => _x$12 => {
                            var $1596 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $1590, _args$5);
                            return $1596;
                        }));
                        var $1591 = $1595;
                        break;
                };
                var $1555 = $1591;
                break;
        };
        return $1555;
    };
    const Fm$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1598 = self.name;
                var $1599 = self.pars;
                var $1600 = self.inds;
                var $1601 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1603 = self.name;
                        var $1604 = self.args;
                        var $1605 = self.inds;
                        var $1606 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, $1598, $1599, $1604);
                        var $1602 = $1606;
                        break;
                };
                var $1597 = $1602;
                break;
        };
        return $1597;
    };
    const Fm$Constructor$build_type = x0 => x1 => Fm$Constructor$build_type$(x0, x1);

    function Fm$Parser$file$adt$(_file$1, _code$2, _defs$3) {
        var $1607 = Monad$bind$(Parser$monad)(Fm$Parser$datatype)((_adt$4 => {
            var self = _adt$4;
            switch (self._) {
                case 'Fm.Datatype.new':
                    var $1609 = self.name;
                    var $1610 = self.pars;
                    var $1611 = self.inds;
                    var $1612 = self.ctrs;
                    var _term$9 = Fm$Datatype$build_term$(_adt$4);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $1614 = (_x$10 + '1');
                        return $1614;
                    }), _term$9);
                    var _type$11 = Fm$Datatype$build_type$(_adt$4);
                    var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                        var $1615 = (_x$12 + '0');
                        return $1615;
                    }), _type$11);
                    var _defs$13 = Fm$define$(_file$1, _code$2, $1609, _term$10, _type$12, Bool$false, _defs$3);
                    var _defs$14 = List$fold$($1612, _defs$13, (_ctr$14 => _defs$15 => {
                        var _typ_name$16 = $1609;
                        var _ctr_name$17 = String$flatten$(List$cons$(_typ_name$16, List$cons$(Fm$Name$read$("."), List$cons$((() => {
                            var self = _ctr$14;
                            switch (self._) {
                                case 'Fm.Constructor.new':
                                    var $1617 = self.name;
                                    var $1618 = self.args;
                                    var $1619 = self.inds;
                                    var $1620 = $1617;
                                    return $1620;
                            };
                        })(), List$nil))));
                        var _ctr_term$18 = Fm$Constructor$build_term$(_adt$4, _ctr$14);
                        var _ctr_term$19 = Fm$Term$bind$(List$nil, (_x$19 => {
                            var $1621 = (_x$19 + '1');
                            return $1621;
                        }), _ctr_term$18);
                        var _ctr_type$20 = Fm$Constructor$build_type$(_adt$4, _ctr$14);
                        var _ctr_type$21 = Fm$Term$bind$(List$nil, (_x$21 => {
                            var $1622 = (_x$21 + '0');
                            return $1622;
                        }), _ctr_type$20);
                        var $1616 = Fm$define$(_file$1, _code$2, _ctr_name$17, _ctr_term$19, _ctr_type$21, Bool$false, _defs$15);
                        return $1616;
                    }));
                    var $1613 = Monad$pure$(Parser$monad)(_defs$14);
                    var $1608 = $1613;
                    break;
            };
            return $1608;
        }));
        return $1607;
    };
    const Fm$Parser$file$adt = x0 => x1 => x2 => Fm$Parser$file$adt$(x0, x1, x2);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $1624 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $1623 = $1624;
        } else {
            var $1625 = self.charCodeAt(0);
            var $1626 = self.slice(1);
            var $1627 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $1623 = $1627;
        };
        return $1623;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Fm$Parser$file$end$(_file$1, _code$2, _defs$3) {
        var $1628 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$4 => {
            var $1629 = Monad$bind$(Parser$monad)(Parser$eof)((_$5 => {
                var $1630 = Monad$pure$(Parser$monad)(_defs$3);
                return $1630;
            }));
            return $1629;
        }));
        return $1628;
    };
    const Fm$Parser$file$end = x0 => x1 => x2 => Fm$Parser$file$end$(x0, x1, x2);

    function Fm$Parser$file$(_file$1, _code$2, _defs$3) {
        var $1631 = Monad$bind$(Parser$monad)(Parser$is_eof)((_stop$4 => {
            var self = _stop$4;
            if (self) {
                var $1633 = Monad$pure$(Parser$monad)(_defs$3);
                var $1632 = $1633;
            } else {
                var $1634 = Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$("#"))((_$5 => {
                    var $1635 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_file$6 => {
                        var $1636 = Fm$Parser$file$(_file$6, _code$2, _defs$3);
                        return $1636;
                    }));
                    return $1635;
                })), List$cons$(Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$file$def$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$adt$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$end$(_file$1, _code$2, _defs$3), List$nil)))))((_defs$5 => {
                    var $1637 = Fm$Parser$file$(_file$1, _code$2, _defs$5);
                    return $1637;
                })), List$nil)));
                var $1632 = $1634;
            };
            return $1632;
        }));
        return $1631;
    };
    const Fm$Parser$file = x0 => x1 => x2 => Fm$Parser$file$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $1638 = null;
        return $1638;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $1640 = "";
                var $1639 = $1640;
                break;
            case 'List.cons':
                var $1641 = self.head;
                var $1642 = self.tail;
                var $1643 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $1644 = "";
                        return $1644;
                    } else {
                        var $1645 = _sep$1;
                        return $1645;
                    };
                })(), List$cons$($1641, List$cons$(String$join$go$(_sep$1, $1642, Bool$false), List$nil))));
                var $1639 = $1643;
                break;
        };
        return $1639;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $1646 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $1646;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Fm$highlight$end$(_col$1, _row$2, _res$3) {
        var $1647 = String$join$("\u{a}", _res$3);
        return $1647;
    };
    const Fm$highlight$end = x0 => x1 => x2 => Fm$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1649 = _a$4;
                var $1648 = $1649;
                break;
            case 'Maybe.some':
                var $1650 = self.value;
                var $1651 = _f$5($1650);
                var $1648 = $1651;
                break;
        };
        return $1648;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1653 = Bool$true;
            var $1652 = $1653;
        } else {
            var $1654 = (self - 1n);
            var $1655 = Bool$false;
            var $1652 = $1655;
        };
        return $1652;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1657 = Nat$zero;
            var $1656 = $1657;
        } else {
            var $1658 = (self - 1n);
            var $1659 = Nat$succ$(Nat$succ$(Nat$double$($1658)));
            var $1656 = $1659;
        };
        return $1656;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1661 = Nat$zero;
            var $1660 = $1661;
        } else {
            var $1662 = (self - 1n);
            var $1663 = $1662;
            var $1660 = $1663;
        };
        return $1660;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.nil':
                var $1665 = List$nil;
                var $1664 = $1665;
                break;
            case 'List.cons':
                var $1666 = self.head;
                var $1667 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $1669 = List$nil;
                    var $1668 = $1669;
                } else {
                    var $1670 = (self - 1n);
                    var $1671 = List$cons$($1666, List$take$($1670, $1667));
                    var $1668 = $1671;
                };
                var $1664 = $1668;
                break;
        };
        return $1664;
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
                    var $1672 = _res$2;
                    return $1672;
                } else {
                    var $1673 = self.charCodeAt(0);
                    var $1674 = self.slice(1);
                    var $1675 = String$reverse$go$($1674, String$cons$($1673, _res$2));
                    return $1675;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1676 = String$reverse$go$(_xs$1, String$nil);
        return $1676;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $1678 = _str$3;
            var $1677 = $1678;
        } else {
            var $1679 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $1681 = String$cons$(_chr$2, String$pad_right$($1679, _chr$2, ""));
                var $1680 = $1681;
            } else {
                var $1682 = self.charCodeAt(0);
                var $1683 = self.slice(1);
                var $1684 = String$cons$($1682, String$pad_right$($1679, _chr$2, $1683));
                var $1680 = $1684;
            };
            var $1677 = $1680;
        };
        return $1677;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $1685 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $1685;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $1686 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $1686;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $1687 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $1687;
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
                    var $1688 = Either$left$(_n$1);
                    return $1688;
                } else {
                    var $1689 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1691 = Either$right$(Nat$succ$($1689));
                        var $1690 = $1691;
                    } else {
                        var $1692 = (self - 1n);
                        var $1693 = Nat$sub_rem$($1692, $1689);
                        var $1690 = $1693;
                    };
                    return $1690;
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
                        var $1694 = self.value;
                        var $1695 = Nat$div_mod$go$($1694, _m$2, Nat$succ$(_d$3));
                        return $1695;
                    case 'Either.right':
                        var $1696 = self.value;
                        var $1697 = Pair$new$(_d$3, _n$1);
                        return $1697;
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
                        var $1698 = self.fst;
                        var $1699 = self.snd;
                        var self = $1698;
                        if (self === 0n) {
                            var $1701 = List$cons$($1699, _res$3);
                            var $1700 = $1701;
                        } else {
                            var $1702 = (self - 1n);
                            var $1703 = Nat$to_base$go$(_base$1, $1698, List$cons$($1699, _res$3));
                            var $1700 = $1703;
                        };
                        return $1700;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $1704 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $1704;
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
                    var $1705 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $1705;
                } else {
                    var $1706 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1708 = _r$3;
                        var $1707 = $1708;
                    } else {
                        var $1709 = (self - 1n);
                        var $1710 = Nat$mod$go$($1709, $1706, Nat$succ$(_r$3));
                        var $1707 = $1710;
                    };
                    return $1707;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $1711 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $1711;
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
                    var $1714 = 35;
                    var $1713 = $1714;
                    break;
                case 'Maybe.some':
                    var $1715 = self.value;
                    var $1716 = $1715;
                    var $1713 = $1716;
                    break;
            };
            var $1712 = $1713;
        } else {
            var $1717 = 35;
            var $1712 = $1717;
        };
        return $1712;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $1718 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $1719 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $1719;
        }));
        return $1718;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $1720 = Nat$to_string_base$(10n, _n$1);
        return $1720;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Fm$color$(_col$1, _str$2) {
        var $1721 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $1721;
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
                    var $1722 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    return $1722;
                } else {
                    var $1723 = self.charCodeAt(0);
                    var $1724 = self.slice(1);
                    var self = ($1723 === 10);
                    if (self) {
                        var _stp$11 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$11;
                        if (self) {
                            var $1727 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $1726 = $1727;
                        } else {
                            var _spa$12 = 3n;
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$12));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $1730 = Maybe$some$(_spa$12);
                                        var $1729 = $1730;
                                        break;
                                    case 'Maybe.some':
                                        var $1731 = self.value;
                                        var $1732 = Maybe$some$(Nat$pred$($1731));
                                        var $1729 = $1732;
                                        break;
                                };
                                var _lft$14 = $1729;
                            } else {
                                var $1733 = (self - 1n);
                                var $1734 = _lft$6;
                                var _lft$14 = $1734;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$take$(_siz$13, List$cons$(String$reverse$(_lin$7), _res$8));
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $1728 = Fm$highlight$tc$($1724, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $1726 = $1728;
                        };
                        var $1725 = $1726;
                    } else {
                        var _chr$11 = String$cons$($1723, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $1736 = String$reverse$(Fm$color$("31", Fm$color$("4", _chr$11)));
                            var _chr$12 = $1736;
                        } else {
                            var $1737 = _chr$11;
                            var _chr$12 = $1737;
                        };
                        var _ix0$13 = Nat$pred$(_ix0$2);
                        var _ix1$14 = Nat$pred$(_ix1$3);
                        var _col$15 = Nat$succ$(_col$4);
                        var _lin$16 = String$flatten$(List$cons$(_chr$12, List$cons$(_lin$7, List$nil)));
                        var $1735 = Fm$highlight$tc$($1724, _ix0$13, _ix1$14, _col$15, _row$5, _lft$6, _lin$16, _res$8);
                        var $1725 = $1735;
                    };
                    return $1725;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $1738 = Fm$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $1738;
    };
    const Fm$highlight = x0 => x1 => x2 => Fm$highlight$(x0, x1, x2);

    function Fm$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Fm$Parser$file$(_file$1, _code$2, _defs$3)(0n)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1740 = self.idx;
                var $1741 = self.code;
                var $1742 = self.err;
                var _err$7 = $1742;
                var _hig$8 = Fm$highlight$(_code$2, $1740, Nat$succ$($1740));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $1743 = Either$left$(_str$9);
                var $1739 = $1743;
                break;
            case 'Parser.Reply.value':
                var $1744 = self.idx;
                var $1745 = self.code;
                var $1746 = self.val;
                var $1747 = Either$right$($1746);
                var $1739 = $1747;
                break;
        };
        return $1739;
    };
    const Fm$Defs$read = x0 => x1 => x2 => Fm$Defs$read$(x0, x1, x2);

    function Fm$Synth$load$(_name$1, _defs$2) {
        var _file$3 = Fm$Synth$file_of$(_name$1);
        var $1748 = Monad$bind$(IO$monad)(IO$get_file$(_file$3))((_code$4 => {
            var _read$5 = Fm$Defs$read$(_file$3, _code$4, _defs$2);
            var self = _read$5;
            switch (self._) {
                case 'Either.left':
                    var $1750 = self.value;
                    var $1751 = Monad$pure$(IO$monad)(Maybe$none);
                    var $1749 = $1751;
                    break;
                case 'Either.right':
                    var $1752 = self.value;
                    var _defs$7 = $1752;
                    var self = Fm$get$(_name$1, _defs$7);
                    switch (self._) {
                        case 'Maybe.none':
                            var $1754 = Monad$pure$(IO$monad)(Maybe$none);
                            var $1753 = $1754;
                            break;
                        case 'Maybe.some':
                            var $1755 = self.value;
                            var $1756 = Monad$pure$(IO$monad)(Maybe$some$(_defs$7));
                            var $1753 = $1756;
                            break;
                    };
                    var $1749 = $1753;
                    break;
            };
            return $1749;
        }));
        return $1748;
    };
    const Fm$Synth$load = x0 => x1 => Fm$Synth$load$(x0, x1);

    function IO$print$(_text$1) {
        var $1757 = IO$ask$("print", _text$1, (_skip$2 => {
            var $1758 = IO$end$(Unit$new);
            return $1758;
        }));
        return $1757;
    };
    const IO$print = x0 => IO$print$(x0);
    const Fm$Status$wait = ({
        _: 'Fm.Status.wait'
    });

    function Fm$Check$(_V$1) {
        var $1759 = null;
        return $1759;
    };
    const Fm$Check = x0 => Fm$Check$(x0);

    function Fm$Check$result$(_value$2, _errors$3) {
        var $1760 = ({
            _: 'Fm.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $1760;
    };
    const Fm$Check$result = x0 => x1 => Fm$Check$result$(x0, x1);

    function Fm$Check$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'Fm.Check.result':
                var $1762 = self.value;
                var $1763 = self.errors;
                var self = $1762;
                switch (self._) {
                    case 'Maybe.none':
                        var $1765 = Fm$Check$result$(Maybe$none, $1763);
                        var $1764 = $1765;
                        break;
                    case 'Maybe.some':
                        var $1766 = self.value;
                        var self = _f$4($1766);
                        switch (self._) {
                            case 'Fm.Check.result':
                                var $1768 = self.value;
                                var $1769 = self.errors;
                                var $1770 = Fm$Check$result$($1768, List$concat$($1763, $1769));
                                var $1767 = $1770;
                                break;
                        };
                        var $1764 = $1767;
                        break;
                };
                var $1761 = $1764;
                break;
        };
        return $1761;
    };
    const Fm$Check$bind = x0 => x1 => Fm$Check$bind$(x0, x1);

    function Fm$Check$pure$(_value$2) {
        var $1771 = Fm$Check$result$(Maybe$some$(_value$2), List$nil);
        return $1771;
    };
    const Fm$Check$pure = x0 => Fm$Check$pure$(x0);
    const Fm$Check$monad = Monad$new$(Fm$Check$bind, Fm$Check$pure);

    function Fm$Error$undefined_reference$(_origin$1, _name$2) {
        var $1772 = ({
            _: 'Fm.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $1772;
    };
    const Fm$Error$undefined_reference = x0 => x1 => Fm$Error$undefined_reference$(x0, x1);

    function Fm$Error$waiting$(_name$1) {
        var $1773 = ({
            _: 'Fm.Error.waiting',
            'name': _name$1
        });
        return $1773;
    };
    const Fm$Error$waiting = x0 => Fm$Error$waiting$(x0);

    function Fm$Error$indirect$(_name$1) {
        var $1774 = ({
            _: 'Fm.Error.indirect',
            'name': _name$1
        });
        return $1774;
    };
    const Fm$Error$indirect = x0 => Fm$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1776 = Maybe$none;
                var $1775 = $1776;
                break;
            case 'Maybe.some':
                var $1777 = self.value;
                var $1778 = Maybe$some$(_f$4($1777));
                var $1775 = $1778;
                break;
        };
        return $1775;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Fm$MPath$o$(_path$1) {
        var $1779 = Maybe$mapped$(_path$1, Fm$Path$o);
        return $1779;
    };
    const Fm$MPath$o = x0 => Fm$MPath$o$(x0);

    function Fm$MPath$i$(_path$1) {
        var $1780 = Maybe$mapped$(_path$1, Fm$Path$i);
        return $1780;
    };
    const Fm$MPath$i = x0 => Fm$MPath$i$(x0);

    function Fm$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $1781 = ({
            _: 'Fm.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $1781;
    };
    const Fm$Error$cant_infer = x0 => x1 => x2 => Fm$Error$cant_infer$(x0, x1, x2);

    function Fm$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $1782 = ({
            _: 'Fm.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $1782;
    };
    const Fm$Error$type_mismatch = x0 => x1 => x2 => x3 => Fm$Error$type_mismatch$(x0, x1, x2, x3);

    function Fm$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $1783 = ({
            _: 'Fm.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $1783;
    };
    const Fm$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Fm$Error$show_goal$(x0, x1, x2, x3, x4);

    function Fm$Term$normalize$(_term$1, _defs$2) {
        var self = Fm$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $1785 = self.name;
                var $1786 = self.indx;
                var $1787 = Fm$Term$var$($1785, $1786);
                var $1784 = $1787;
                break;
            case 'Fm.Term.ref':
                var $1788 = self.name;
                var $1789 = Fm$Term$ref$($1788);
                var $1784 = $1789;
                break;
            case 'Fm.Term.typ':
                var $1790 = Fm$Term$typ;
                var $1784 = $1790;
                break;
            case 'Fm.Term.all':
                var $1791 = self.eras;
                var $1792 = self.self;
                var $1793 = self.name;
                var $1794 = self.xtyp;
                var $1795 = self.body;
                var $1796 = Fm$Term$all$($1791, $1792, $1793, Fm$Term$normalize$($1794, _defs$2), (_s$8 => _x$9 => {
                    var $1797 = Fm$Term$normalize$($1795(_s$8)(_x$9), _defs$2);
                    return $1797;
                }));
                var $1784 = $1796;
                break;
            case 'Fm.Term.lam':
                var $1798 = self.name;
                var $1799 = self.body;
                var $1800 = Fm$Term$lam$($1798, (_x$5 => {
                    var $1801 = Fm$Term$normalize$($1799(_x$5), _defs$2);
                    return $1801;
                }));
                var $1784 = $1800;
                break;
            case 'Fm.Term.app':
                var $1802 = self.func;
                var $1803 = self.argm;
                var $1804 = Fm$Term$app$(Fm$Term$normalize$($1802, _defs$2), Fm$Term$normalize$($1803, _defs$2));
                var $1784 = $1804;
                break;
            case 'Fm.Term.let':
                var $1805 = self.name;
                var $1806 = self.expr;
                var $1807 = self.body;
                var $1808 = Fm$Term$let$($1805, Fm$Term$normalize$($1806, _defs$2), (_x$6 => {
                    var $1809 = Fm$Term$normalize$($1807(_x$6), _defs$2);
                    return $1809;
                }));
                var $1784 = $1808;
                break;
            case 'Fm.Term.def':
                var $1810 = self.name;
                var $1811 = self.expr;
                var $1812 = self.body;
                var $1813 = Fm$Term$def$($1810, Fm$Term$normalize$($1811, _defs$2), (_x$6 => {
                    var $1814 = Fm$Term$normalize$($1812(_x$6), _defs$2);
                    return $1814;
                }));
                var $1784 = $1813;
                break;
            case 'Fm.Term.ann':
                var $1815 = self.done;
                var $1816 = self.term;
                var $1817 = self.type;
                var $1818 = Fm$Term$ann$($1815, Fm$Term$normalize$($1816, _defs$2), Fm$Term$normalize$($1817, _defs$2));
                var $1784 = $1818;
                break;
            case 'Fm.Term.gol':
                var $1819 = self.name;
                var $1820 = self.dref;
                var $1821 = self.verb;
                var $1822 = Fm$Term$gol$($1819, $1820, $1821);
                var $1784 = $1822;
                break;
            case 'Fm.Term.hol':
                var $1823 = self.path;
                var $1824 = Fm$Term$hol$($1823);
                var $1784 = $1824;
                break;
            case 'Fm.Term.nat':
                var $1825 = self.natx;
                var $1826 = Fm$Term$nat$($1825);
                var $1784 = $1826;
                break;
            case 'Fm.Term.chr':
                var $1827 = self.chrx;
                var $1828 = Fm$Term$chr$($1827);
                var $1784 = $1828;
                break;
            case 'Fm.Term.str':
                var $1829 = self.strx;
                var $1830 = Fm$Term$str$($1829);
                var $1784 = $1830;
                break;
            case 'Fm.Term.cse':
                var $1831 = self.path;
                var $1832 = self.expr;
                var $1833 = self.name;
                var $1834 = self.with;
                var $1835 = self.cses;
                var $1836 = self.moti;
                var $1837 = _term$1;
                var $1784 = $1837;
                break;
            case 'Fm.Term.ori':
                var $1838 = self.orig;
                var $1839 = self.expr;
                var $1840 = Fm$Term$normalize$($1839, _defs$2);
                var $1784 = $1840;
                break;
        };
        return $1784;
    };
    const Fm$Term$normalize = x0 => x1 => Fm$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1842 = List$nil;
                var $1841 = $1842;
                break;
            case 'List.cons':
                var $1843 = self.head;
                var $1844 = self.tail;
                var $1845 = $1844;
                var $1841 = $1845;
                break;
        };
        return $1841;
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
                        var $1846 = self.name;
                        var $1847 = self.indx;
                        var $1848 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1848;
                    case 'Fm.Term.ref':
                        var $1849 = self.name;
                        var $1850 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1850;
                    case 'Fm.Term.typ':
                        var $1851 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1851;
                    case 'Fm.Term.all':
                        var $1852 = self.eras;
                        var $1853 = self.self;
                        var $1854 = self.name;
                        var $1855 = self.xtyp;
                        var $1856 = self.body;
                        var $1857 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1857;
                    case 'Fm.Term.lam':
                        var $1858 = self.name;
                        var $1859 = self.body;
                        var $1860 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1860;
                    case 'Fm.Term.app':
                        var $1861 = self.func;
                        var $1862 = self.argm;
                        var $1863 = Fm$SmartMotive$vals$cont$(_expr$1, $1861, List$cons$($1862, _args$3), _defs$4);
                        return $1863;
                    case 'Fm.Term.let':
                        var $1864 = self.name;
                        var $1865 = self.expr;
                        var $1866 = self.body;
                        var $1867 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1867;
                    case 'Fm.Term.def':
                        var $1868 = self.name;
                        var $1869 = self.expr;
                        var $1870 = self.body;
                        var $1871 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1871;
                    case 'Fm.Term.ann':
                        var $1872 = self.done;
                        var $1873 = self.term;
                        var $1874 = self.type;
                        var $1875 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1875;
                    case 'Fm.Term.gol':
                        var $1876 = self.name;
                        var $1877 = self.dref;
                        var $1878 = self.verb;
                        var $1879 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1879;
                    case 'Fm.Term.hol':
                        var $1880 = self.path;
                        var $1881 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1881;
                    case 'Fm.Term.nat':
                        var $1882 = self.natx;
                        var $1883 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1883;
                    case 'Fm.Term.chr':
                        var $1884 = self.chrx;
                        var $1885 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1885;
                    case 'Fm.Term.str':
                        var $1886 = self.strx;
                        var $1887 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1887;
                    case 'Fm.Term.cse':
                        var $1888 = self.path;
                        var $1889 = self.expr;
                        var $1890 = self.name;
                        var $1891 = self.with;
                        var $1892 = self.cses;
                        var $1893 = self.moti;
                        var $1894 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1894;
                    case 'Fm.Term.ori':
                        var $1895 = self.orig;
                        var $1896 = self.expr;
                        var $1897 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1897;
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
                        var $1898 = self.name;
                        var $1899 = self.indx;
                        var $1900 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1900;
                    case 'Fm.Term.ref':
                        var $1901 = self.name;
                        var $1902 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1902;
                    case 'Fm.Term.typ':
                        var $1903 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1903;
                    case 'Fm.Term.all':
                        var $1904 = self.eras;
                        var $1905 = self.self;
                        var $1906 = self.name;
                        var $1907 = self.xtyp;
                        var $1908 = self.body;
                        var $1909 = Fm$SmartMotive$vals$(_expr$1, $1908(Fm$Term$typ)(Fm$Term$typ), _defs$3);
                        return $1909;
                    case 'Fm.Term.lam':
                        var $1910 = self.name;
                        var $1911 = self.body;
                        var $1912 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1912;
                    case 'Fm.Term.app':
                        var $1913 = self.func;
                        var $1914 = self.argm;
                        var $1915 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1915;
                    case 'Fm.Term.let':
                        var $1916 = self.name;
                        var $1917 = self.expr;
                        var $1918 = self.body;
                        var $1919 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1919;
                    case 'Fm.Term.def':
                        var $1920 = self.name;
                        var $1921 = self.expr;
                        var $1922 = self.body;
                        var $1923 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1923;
                    case 'Fm.Term.ann':
                        var $1924 = self.done;
                        var $1925 = self.term;
                        var $1926 = self.type;
                        var $1927 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1927;
                    case 'Fm.Term.gol':
                        var $1928 = self.name;
                        var $1929 = self.dref;
                        var $1930 = self.verb;
                        var $1931 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1931;
                    case 'Fm.Term.hol':
                        var $1932 = self.path;
                        var $1933 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1933;
                    case 'Fm.Term.nat':
                        var $1934 = self.natx;
                        var $1935 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1935;
                    case 'Fm.Term.chr':
                        var $1936 = self.chrx;
                        var $1937 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1937;
                    case 'Fm.Term.str':
                        var $1938 = self.strx;
                        var $1939 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1939;
                    case 'Fm.Term.cse':
                        var $1940 = self.path;
                        var $1941 = self.expr;
                        var $1942 = self.name;
                        var $1943 = self.with;
                        var $1944 = self.cses;
                        var $1945 = self.moti;
                        var $1946 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1946;
                    case 'Fm.Term.ori':
                        var $1947 = self.orig;
                        var $1948 = self.expr;
                        var $1949 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1949;
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
                        var $1950 = self.name;
                        var $1951 = self.indx;
                        var $1952 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1952;
                    case 'Fm.Term.ref':
                        var $1953 = self.name;
                        var $1954 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1954;
                    case 'Fm.Term.typ':
                        var $1955 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1955;
                    case 'Fm.Term.all':
                        var $1956 = self.eras;
                        var $1957 = self.self;
                        var $1958 = self.name;
                        var $1959 = self.xtyp;
                        var $1960 = self.body;
                        var $1961 = Fm$SmartMotive$nams$cont$(_name$1, $1960(Fm$Term$ref$($1957))(Fm$Term$ref$($1958)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($1958, List$nil)))), _binds$3), _defs$4);
                        return $1961;
                    case 'Fm.Term.lam':
                        var $1962 = self.name;
                        var $1963 = self.body;
                        var $1964 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1964;
                    case 'Fm.Term.app':
                        var $1965 = self.func;
                        var $1966 = self.argm;
                        var $1967 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1967;
                    case 'Fm.Term.let':
                        var $1968 = self.name;
                        var $1969 = self.expr;
                        var $1970 = self.body;
                        var $1971 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1971;
                    case 'Fm.Term.def':
                        var $1972 = self.name;
                        var $1973 = self.expr;
                        var $1974 = self.body;
                        var $1975 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1975;
                    case 'Fm.Term.ann':
                        var $1976 = self.done;
                        var $1977 = self.term;
                        var $1978 = self.type;
                        var $1979 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1979;
                    case 'Fm.Term.gol':
                        var $1980 = self.name;
                        var $1981 = self.dref;
                        var $1982 = self.verb;
                        var $1983 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1983;
                    case 'Fm.Term.hol':
                        var $1984 = self.path;
                        var $1985 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1985;
                    case 'Fm.Term.nat':
                        var $1986 = self.natx;
                        var $1987 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1987;
                    case 'Fm.Term.chr':
                        var $1988 = self.chrx;
                        var $1989 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1989;
                    case 'Fm.Term.str':
                        var $1990 = self.strx;
                        var $1991 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1991;
                    case 'Fm.Term.cse':
                        var $1992 = self.path;
                        var $1993 = self.expr;
                        var $1994 = self.name;
                        var $1995 = self.with;
                        var $1996 = self.cses;
                        var $1997 = self.moti;
                        var $1998 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1998;
                    case 'Fm.Term.ori':
                        var $1999 = self.orig;
                        var $2000 = self.expr;
                        var $2001 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $2001;
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
                var $2003 = self.name;
                var $2004 = self.indx;
                var $2005 = List$nil;
                var $2002 = $2005;
                break;
            case 'Fm.Term.ref':
                var $2006 = self.name;
                var $2007 = List$nil;
                var $2002 = $2007;
                break;
            case 'Fm.Term.typ':
                var $2008 = List$nil;
                var $2002 = $2008;
                break;
            case 'Fm.Term.all':
                var $2009 = self.eras;
                var $2010 = self.self;
                var $2011 = self.name;
                var $2012 = self.xtyp;
                var $2013 = self.body;
                var $2014 = Fm$SmartMotive$nams$cont$(_name$1, $2012, List$nil, _defs$3);
                var $2002 = $2014;
                break;
            case 'Fm.Term.lam':
                var $2015 = self.name;
                var $2016 = self.body;
                var $2017 = List$nil;
                var $2002 = $2017;
                break;
            case 'Fm.Term.app':
                var $2018 = self.func;
                var $2019 = self.argm;
                var $2020 = List$nil;
                var $2002 = $2020;
                break;
            case 'Fm.Term.let':
                var $2021 = self.name;
                var $2022 = self.expr;
                var $2023 = self.body;
                var $2024 = List$nil;
                var $2002 = $2024;
                break;
            case 'Fm.Term.def':
                var $2025 = self.name;
                var $2026 = self.expr;
                var $2027 = self.body;
                var $2028 = List$nil;
                var $2002 = $2028;
                break;
            case 'Fm.Term.ann':
                var $2029 = self.done;
                var $2030 = self.term;
                var $2031 = self.type;
                var $2032 = List$nil;
                var $2002 = $2032;
                break;
            case 'Fm.Term.gol':
                var $2033 = self.name;
                var $2034 = self.dref;
                var $2035 = self.verb;
                var $2036 = List$nil;
                var $2002 = $2036;
                break;
            case 'Fm.Term.hol':
                var $2037 = self.path;
                var $2038 = List$nil;
                var $2002 = $2038;
                break;
            case 'Fm.Term.nat':
                var $2039 = self.natx;
                var $2040 = List$nil;
                var $2002 = $2040;
                break;
            case 'Fm.Term.chr':
                var $2041 = self.chrx;
                var $2042 = List$nil;
                var $2002 = $2042;
                break;
            case 'Fm.Term.str':
                var $2043 = self.strx;
                var $2044 = List$nil;
                var $2002 = $2044;
                break;
            case 'Fm.Term.cse':
                var $2045 = self.path;
                var $2046 = self.expr;
                var $2047 = self.name;
                var $2048 = self.with;
                var $2049 = self.cses;
                var $2050 = self.moti;
                var $2051 = List$nil;
                var $2002 = $2051;
                break;
            case 'Fm.Term.ori':
                var $2052 = self.orig;
                var $2053 = self.expr;
                var $2054 = List$nil;
                var $2002 = $2054;
                break;
        };
        return $2002;
    };
    const Fm$SmartMotive$nams = x0 => x1 => x2 => Fm$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.nil':
                var $2056 = List$nil;
                var $2055 = $2056;
                break;
            case 'List.cons':
                var $2057 = self.head;
                var $2058 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.nil':
                        var $2060 = List$nil;
                        var $2059 = $2060;
                        break;
                    case 'List.cons':
                        var $2061 = self.head;
                        var $2062 = self.tail;
                        var $2063 = List$cons$(Pair$new$($2057, $2061), List$zip$($2058, $2062));
                        var $2059 = $2063;
                        break;
                };
                var $2055 = $2059;
                break;
        };
        return $2055;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Fm$Term$serialize$name$(_name$1) {
        var $2064 = (fm_name_to_bits(_name$1));
        return $2064;
    };
    const Fm$Term$serialize$name = x0 => Fm$Term$serialize$name$(x0);

    function Fm$Term$serialize$(_term$1, _depth$2, _init$3, _x$4) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2066 = self.name;
                var $2067 = self.indx;
                var self = ($2067 >= _init$3);
                if (self) {
                    var _name$7 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $2067 <= 0n ? 0n : _depth$2 - $2067)))));
                    var $2069 = (((_name$7(_x$4) + '1') + '0') + '0');
                    var $2068 = $2069;
                } else {
                    var _name$7 = a1 => (a1 + (nat_to_bits($2067)));
                    var $2070 = (((_name$7(_x$4) + '0') + '1') + '0');
                    var $2068 = $2070;
                };
                var $2065 = $2068;
                break;
            case 'Fm.Term.ref':
                var $2071 = self.name;
                var _name$6 = a1 => (a1 + Fm$Term$serialize$name$($2071));
                var $2072 = (((_name$6(_x$4) + '0') + '0') + '0');
                var $2065 = $2072;
                break;
            case 'Fm.Term.typ':
                var $2073 = (((_x$4 + '1') + '1') + '0');
                var $2065 = $2073;
                break;
            case 'Fm.Term.all':
                var $2074 = self.eras;
                var $2075 = self.self;
                var $2076 = self.name;
                var $2077 = self.xtyp;
                var $2078 = self.body;
                var self = $2074;
                if (self) {
                    var $2080 = Bits$i;
                    var _eras$10 = $2080;
                } else {
                    var $2081 = Bits$o;
                    var _eras$10 = $2081;
                };
                var _self$11 = a1 => (a1 + (fm_name_to_bits($2075)));
                var _xtyp$12 = Fm$Term$serialize($2077)(_depth$2)(_init$3);
                var _body$13 = Fm$Term$serialize($2078(Fm$Term$var$($2075, _depth$2))(Fm$Term$var$($2076, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3);
                var $2079 = (((_eras$10(_self$11(_xtyp$12(_body$13(_x$4)))) + '0') + '0') + '1');
                var $2065 = $2079;
                break;
            case 'Fm.Term.lam':
                var $2082 = self.name;
                var $2083 = self.body;
                var _body$7 = Fm$Term$serialize($2083(Fm$Term$var$($2082, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2084 = (((_body$7(_x$4) + '1') + '0') + '1');
                var $2065 = $2084;
                break;
            case 'Fm.Term.app':
                var $2085 = self.func;
                var $2086 = self.argm;
                var _func$7 = Fm$Term$serialize($2085)(_depth$2)(_init$3);
                var _argm$8 = Fm$Term$serialize($2086)(_depth$2)(_init$3);
                var $2087 = (((_func$7(_argm$8(_x$4)) + '0') + '1') + '1');
                var $2065 = $2087;
                break;
            case 'Fm.Term.let':
                var $2088 = self.name;
                var $2089 = self.expr;
                var $2090 = self.body;
                var _expr$8 = Fm$Term$serialize($2089)(_depth$2)(_init$3);
                var _body$9 = Fm$Term$serialize($2090(Fm$Term$var$($2088, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2091 = (((_expr$8(_body$9(_x$4)) + '1') + '1') + '1');
                var $2065 = $2091;
                break;
            case 'Fm.Term.def':
                var $2092 = self.name;
                var $2093 = self.expr;
                var $2094 = self.body;
                var $2095 = Fm$Term$serialize$($2094($2093), _depth$2, _init$3, _x$4);
                var $2065 = $2095;
                break;
            case 'Fm.Term.ann':
                var $2096 = self.done;
                var $2097 = self.term;
                var $2098 = self.type;
                var $2099 = Fm$Term$serialize$($2097, _depth$2, _init$3, _x$4);
                var $2065 = $2099;
                break;
            case 'Fm.Term.gol':
                var $2100 = self.name;
                var $2101 = self.dref;
                var $2102 = self.verb;
                var _name$8 = a1 => (a1 + (fm_name_to_bits($2100)));
                var $2103 = (((_name$8(_x$4) + '0') + '0') + '0');
                var $2065 = $2103;
                break;
            case 'Fm.Term.hol':
                var $2104 = self.path;
                var $2105 = _x$4;
                var $2065 = $2105;
                break;
            case 'Fm.Term.nat':
                var $2106 = self.natx;
                var $2107 = Fm$Term$serialize$(Fm$Term$unroll_nat$($2106), _depth$2, _init$3, _x$4);
                var $2065 = $2107;
                break;
            case 'Fm.Term.chr':
                var $2108 = self.chrx;
                var $2109 = Fm$Term$serialize$(Fm$Term$unroll_chr$($2108), _depth$2, _init$3, _x$4);
                var $2065 = $2109;
                break;
            case 'Fm.Term.str':
                var $2110 = self.strx;
                var $2111 = Fm$Term$serialize$(Fm$Term$unroll_str$($2110), _depth$2, _init$3, _x$4);
                var $2065 = $2111;
                break;
            case 'Fm.Term.cse':
                var $2112 = self.path;
                var $2113 = self.expr;
                var $2114 = self.name;
                var $2115 = self.with;
                var $2116 = self.cses;
                var $2117 = self.moti;
                var $2118 = _x$4;
                var $2065 = $2118;
                break;
            case 'Fm.Term.ori':
                var $2119 = self.orig;
                var $2120 = self.expr;
                var $2121 = Fm$Term$serialize$($2120, _depth$2, _init$3, _x$4);
                var $2065 = $2121;
                break;
        };
        return $2065;
    };
    const Fm$Term$serialize = x0 => x1 => x2 => x3 => Fm$Term$serialize$(x0, x1, x2, x3);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Fm$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Fm$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$e);
        var _bh$5 = Fm$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$e);
        var $2122 = (_bh$5 === _ah$4);
        return $2122;
    };
    const Fm$Term$identical = x0 => x1 => x2 => Fm$Term$identical$(x0, x1, x2);

    function Fm$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Fm$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $2124 = _to$3;
            var $2123 = $2124;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $2126 = self.name;
                    var $2127 = self.indx;
                    var $2128 = Fm$Term$var$($2126, $2127);
                    var $2125 = $2128;
                    break;
                case 'Fm.Term.ref':
                    var $2129 = self.name;
                    var $2130 = Fm$Term$ref$($2129);
                    var $2125 = $2130;
                    break;
                case 'Fm.Term.typ':
                    var $2131 = Fm$Term$typ;
                    var $2125 = $2131;
                    break;
                case 'Fm.Term.all':
                    var $2132 = self.eras;
                    var $2133 = self.self;
                    var $2134 = self.name;
                    var $2135 = self.xtyp;
                    var $2136 = self.body;
                    var _xtyp$10 = Fm$SmartMotive$replace$($2135, _from$2, _to$3, _lv$4);
                    var _body$11 = $2136(Fm$Term$ref$($2133))(Fm$Term$ref$($2134));
                    var _body$12 = Fm$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $2137 = Fm$Term$all$($2132, $2133, $2134, _xtyp$10, (_s$13 => _x$14 => {
                        var $2138 = _body$12;
                        return $2138;
                    }));
                    var $2125 = $2137;
                    break;
                case 'Fm.Term.lam':
                    var $2139 = self.name;
                    var $2140 = self.body;
                    var _body$7 = $2140(Fm$Term$ref$($2139));
                    var _body$8 = Fm$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2141 = Fm$Term$lam$($2139, (_x$9 => {
                        var $2142 = _body$8;
                        return $2142;
                    }));
                    var $2125 = $2141;
                    break;
                case 'Fm.Term.app':
                    var $2143 = self.func;
                    var $2144 = self.argm;
                    var _func$7 = Fm$SmartMotive$replace$($2143, _from$2, _to$3, _lv$4);
                    var _argm$8 = Fm$SmartMotive$replace$($2144, _from$2, _to$3, _lv$4);
                    var $2145 = Fm$Term$app$(_func$7, _argm$8);
                    var $2125 = $2145;
                    break;
                case 'Fm.Term.let':
                    var $2146 = self.name;
                    var $2147 = self.expr;
                    var $2148 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2147, _from$2, _to$3, _lv$4);
                    var _body$9 = $2148(Fm$Term$ref$($2146));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2149 = Fm$Term$let$($2146, _expr$8, (_x$11 => {
                        var $2150 = _body$10;
                        return $2150;
                    }));
                    var $2125 = $2149;
                    break;
                case 'Fm.Term.def':
                    var $2151 = self.name;
                    var $2152 = self.expr;
                    var $2153 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2152, _from$2, _to$3, _lv$4);
                    var _body$9 = $2153(Fm$Term$ref$($2151));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2154 = Fm$Term$def$($2151, _expr$8, (_x$11 => {
                        var $2155 = _body$10;
                        return $2155;
                    }));
                    var $2125 = $2154;
                    break;
                case 'Fm.Term.ann':
                    var $2156 = self.done;
                    var $2157 = self.term;
                    var $2158 = self.type;
                    var _term$8 = Fm$SmartMotive$replace$($2157, _from$2, _to$3, _lv$4);
                    var _type$9 = Fm$SmartMotive$replace$($2158, _from$2, _to$3, _lv$4);
                    var $2159 = Fm$Term$ann$($2156, _term$8, _type$9);
                    var $2125 = $2159;
                    break;
                case 'Fm.Term.gol':
                    var $2160 = self.name;
                    var $2161 = self.dref;
                    var $2162 = self.verb;
                    var $2163 = _term$1;
                    var $2125 = $2163;
                    break;
                case 'Fm.Term.hol':
                    var $2164 = self.path;
                    var $2165 = _term$1;
                    var $2125 = $2165;
                    break;
                case 'Fm.Term.nat':
                    var $2166 = self.natx;
                    var $2167 = _term$1;
                    var $2125 = $2167;
                    break;
                case 'Fm.Term.chr':
                    var $2168 = self.chrx;
                    var $2169 = _term$1;
                    var $2125 = $2169;
                    break;
                case 'Fm.Term.str':
                    var $2170 = self.strx;
                    var $2171 = _term$1;
                    var $2125 = $2171;
                    break;
                case 'Fm.Term.cse':
                    var $2172 = self.path;
                    var $2173 = self.expr;
                    var $2174 = self.name;
                    var $2175 = self.with;
                    var $2176 = self.cses;
                    var $2177 = self.moti;
                    var $2178 = _term$1;
                    var $2125 = $2178;
                    break;
                case 'Fm.Term.ori':
                    var $2179 = self.orig;
                    var $2180 = self.expr;
                    var $2181 = Fm$SmartMotive$replace$($2180, _from$2, _to$3, _lv$4);
                    var $2125 = $2181;
                    break;
            };
            var $2123 = $2125;
        };
        return $2123;
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
                    var $2184 = self.fst;
                    var $2185 = self.snd;
                    var $2186 = Fm$SmartMotive$replace$(_moti$11, $2185, Fm$Term$ref$($2184), _lv$5);
                    var $2183 = $2186;
                    break;
            };
            return $2183;
        }));
        var $2182 = _moti$10;
        return $2182;
    };
    const Fm$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Fm$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Fm$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.nil':
                var $2188 = _moti$2;
                var $2187 = $2188;
                break;
            case 'List.cons':
                var $2189 = self.head;
                var $2190 = self.tail;
                var self = $2189;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $2192 = self.file;
                        var $2193 = self.code;
                        var $2194 = self.name;
                        var $2195 = self.term;
                        var $2196 = self.type;
                        var $2197 = self.stat;
                        var $2198 = Fm$Term$all$(Bool$false, "", $2194, $2196, (_s$11 => _x$12 => {
                            var $2199 = Fm$Term$desugar_cse$motive$($2190, _moti$2);
                            return $2199;
                        }));
                        var $2191 = $2198;
                        break;
                };
                var $2187 = $2191;
                break;
        };
        return $2187;
    };
    const Fm$Term$desugar_cse$motive = x0 => x1 => Fm$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $2201 = Bool$true;
            var $2200 = $2201;
        } else {
            var $2202 = self.charCodeAt(0);
            var $2203 = self.slice(1);
            var $2204 = Bool$false;
            var $2200 = $2204;
        };
        return $2200;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Fm$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $2206 = self.name;
                var $2207 = self.indx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2209 = _body$4;
                        var $2208 = $2209;
                        break;
                    case 'List.cons':
                        var $2210 = self.head;
                        var $2211 = self.tail;
                        var self = $2210;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2213 = self.file;
                                var $2214 = self.code;
                                var $2215 = self.name;
                                var $2216 = self.term;
                                var $2217 = self.type;
                                var $2218 = self.stat;
                                var $2219 = Fm$Term$lam$($2215, (_x$16 => {
                                    var $2220 = Fm$Term$desugar_cse$argument$(_name$1, $2211, _type$3, _body$4, _defs$5);
                                    return $2220;
                                }));
                                var $2212 = $2219;
                                break;
                        };
                        var $2208 = $2212;
                        break;
                };
                var $2205 = $2208;
                break;
            case 'Fm.Term.ref':
                var $2221 = self.name;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2223 = _body$4;
                        var $2222 = $2223;
                        break;
                    case 'List.cons':
                        var $2224 = self.head;
                        var $2225 = self.tail;
                        var self = $2224;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2227 = self.file;
                                var $2228 = self.code;
                                var $2229 = self.name;
                                var $2230 = self.term;
                                var $2231 = self.type;
                                var $2232 = self.stat;
                                var $2233 = Fm$Term$lam$($2229, (_x$15 => {
                                    var $2234 = Fm$Term$desugar_cse$argument$(_name$1, $2225, _type$3, _body$4, _defs$5);
                                    return $2234;
                                }));
                                var $2226 = $2233;
                                break;
                        };
                        var $2222 = $2226;
                        break;
                };
                var $2205 = $2222;
                break;
            case 'Fm.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2236 = _body$4;
                        var $2235 = $2236;
                        break;
                    case 'List.cons':
                        var $2237 = self.head;
                        var $2238 = self.tail;
                        var self = $2237;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2240 = self.file;
                                var $2241 = self.code;
                                var $2242 = self.name;
                                var $2243 = self.term;
                                var $2244 = self.type;
                                var $2245 = self.stat;
                                var $2246 = Fm$Term$lam$($2242, (_x$14 => {
                                    var $2247 = Fm$Term$desugar_cse$argument$(_name$1, $2238, _type$3, _body$4, _defs$5);
                                    return $2247;
                                }));
                                var $2239 = $2246;
                                break;
                        };
                        var $2235 = $2239;
                        break;
                };
                var $2205 = $2235;
                break;
            case 'Fm.Term.all':
                var $2248 = self.eras;
                var $2249 = self.self;
                var $2250 = self.name;
                var $2251 = self.xtyp;
                var $2252 = self.body;
                var $2253 = Fm$Term$lam$((() => {
                    var self = String$is_empty$($2250);
                    if (self) {
                        var $2254 = _name$1;
                        return $2254;
                    } else {
                        var $2255 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($2250, List$nil))));
                        return $2255;
                    };
                })(), (_x$11 => {
                    var $2256 = Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, $2252(Fm$Term$var$($2249, 0n))(Fm$Term$var$($2250, 0n)), _body$4, _defs$5);
                    return $2256;
                }));
                var $2205 = $2253;
                break;
            case 'Fm.Term.lam':
                var $2257 = self.name;
                var $2258 = self.body;
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
                var $2205 = $2259;
                break;
            case 'Fm.Term.app':
                var $2272 = self.func;
                var $2273 = self.argm;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2275 = _body$4;
                        var $2274 = $2275;
                        break;
                    case 'List.cons':
                        var $2276 = self.head;
                        var $2277 = self.tail;
                        var self = $2276;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2279 = self.file;
                                var $2280 = self.code;
                                var $2281 = self.name;
                                var $2282 = self.term;
                                var $2283 = self.type;
                                var $2284 = self.stat;
                                var $2285 = Fm$Term$lam$($2281, (_x$16 => {
                                    var $2286 = Fm$Term$desugar_cse$argument$(_name$1, $2277, _type$3, _body$4, _defs$5);
                                    return $2286;
                                }));
                                var $2278 = $2285;
                                break;
                        };
                        var $2274 = $2278;
                        break;
                };
                var $2205 = $2274;
                break;
            case 'Fm.Term.let':
                var $2287 = self.name;
                var $2288 = self.expr;
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
                                var $2301 = Fm$Term$lam$($2297, (_x$17 => {
                                    var $2302 = Fm$Term$desugar_cse$argument$(_name$1, $2293, _type$3, _body$4, _defs$5);
                                    return $2302;
                                }));
                                var $2294 = $2301;
                                break;
                        };
                        var $2290 = $2294;
                        break;
                };
                var $2205 = $2290;
                break;
            case 'Fm.Term.def':
                var $2303 = self.name;
                var $2304 = self.expr;
                var $2305 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2307 = _body$4;
                        var $2306 = $2307;
                        break;
                    case 'List.cons':
                        var $2308 = self.head;
                        var $2309 = self.tail;
                        var self = $2308;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2311 = self.file;
                                var $2312 = self.code;
                                var $2313 = self.name;
                                var $2314 = self.term;
                                var $2315 = self.type;
                                var $2316 = self.stat;
                                var $2317 = Fm$Term$lam$($2313, (_x$17 => {
                                    var $2318 = Fm$Term$desugar_cse$argument$(_name$1, $2309, _type$3, _body$4, _defs$5);
                                    return $2318;
                                }));
                                var $2310 = $2317;
                                break;
                        };
                        var $2306 = $2310;
                        break;
                };
                var $2205 = $2306;
                break;
            case 'Fm.Term.ann':
                var $2319 = self.done;
                var $2320 = self.term;
                var $2321 = self.type;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2323 = _body$4;
                        var $2322 = $2323;
                        break;
                    case 'List.cons':
                        var $2324 = self.head;
                        var $2325 = self.tail;
                        var self = $2324;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2327 = self.file;
                                var $2328 = self.code;
                                var $2329 = self.name;
                                var $2330 = self.term;
                                var $2331 = self.type;
                                var $2332 = self.stat;
                                var $2333 = Fm$Term$lam$($2329, (_x$17 => {
                                    var $2334 = Fm$Term$desugar_cse$argument$(_name$1, $2325, _type$3, _body$4, _defs$5);
                                    return $2334;
                                }));
                                var $2326 = $2333;
                                break;
                        };
                        var $2322 = $2326;
                        break;
                };
                var $2205 = $2322;
                break;
            case 'Fm.Term.gol':
                var $2335 = self.name;
                var $2336 = self.dref;
                var $2337 = self.verb;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2339 = _body$4;
                        var $2338 = $2339;
                        break;
                    case 'List.cons':
                        var $2340 = self.head;
                        var $2341 = self.tail;
                        var self = $2340;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2343 = self.file;
                                var $2344 = self.code;
                                var $2345 = self.name;
                                var $2346 = self.term;
                                var $2347 = self.type;
                                var $2348 = self.stat;
                                var $2349 = Fm$Term$lam$($2345, (_x$17 => {
                                    var $2350 = Fm$Term$desugar_cse$argument$(_name$1, $2341, _type$3, _body$4, _defs$5);
                                    return $2350;
                                }));
                                var $2342 = $2349;
                                break;
                        };
                        var $2338 = $2342;
                        break;
                };
                var $2205 = $2338;
                break;
            case 'Fm.Term.hol':
                var $2351 = self.path;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2353 = _body$4;
                        var $2352 = $2353;
                        break;
                    case 'List.cons':
                        var $2354 = self.head;
                        var $2355 = self.tail;
                        var self = $2354;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2357 = self.file;
                                var $2358 = self.code;
                                var $2359 = self.name;
                                var $2360 = self.term;
                                var $2361 = self.type;
                                var $2362 = self.stat;
                                var $2363 = Fm$Term$lam$($2359, (_x$15 => {
                                    var $2364 = Fm$Term$desugar_cse$argument$(_name$1, $2355, _type$3, _body$4, _defs$5);
                                    return $2364;
                                }));
                                var $2356 = $2363;
                                break;
                        };
                        var $2352 = $2356;
                        break;
                };
                var $2205 = $2352;
                break;
            case 'Fm.Term.nat':
                var $2365 = self.natx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2367 = _body$4;
                        var $2366 = $2367;
                        break;
                    case 'List.cons':
                        var $2368 = self.head;
                        var $2369 = self.tail;
                        var self = $2368;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2371 = self.file;
                                var $2372 = self.code;
                                var $2373 = self.name;
                                var $2374 = self.term;
                                var $2375 = self.type;
                                var $2376 = self.stat;
                                var $2377 = Fm$Term$lam$($2373, (_x$15 => {
                                    var $2378 = Fm$Term$desugar_cse$argument$(_name$1, $2369, _type$3, _body$4, _defs$5);
                                    return $2378;
                                }));
                                var $2370 = $2377;
                                break;
                        };
                        var $2366 = $2370;
                        break;
                };
                var $2205 = $2366;
                break;
            case 'Fm.Term.chr':
                var $2379 = self.chrx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2381 = _body$4;
                        var $2380 = $2381;
                        break;
                    case 'List.cons':
                        var $2382 = self.head;
                        var $2383 = self.tail;
                        var self = $2382;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2385 = self.file;
                                var $2386 = self.code;
                                var $2387 = self.name;
                                var $2388 = self.term;
                                var $2389 = self.type;
                                var $2390 = self.stat;
                                var $2391 = Fm$Term$lam$($2387, (_x$15 => {
                                    var $2392 = Fm$Term$desugar_cse$argument$(_name$1, $2383, _type$3, _body$4, _defs$5);
                                    return $2392;
                                }));
                                var $2384 = $2391;
                                break;
                        };
                        var $2380 = $2384;
                        break;
                };
                var $2205 = $2380;
                break;
            case 'Fm.Term.str':
                var $2393 = self.strx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2395 = _body$4;
                        var $2394 = $2395;
                        break;
                    case 'List.cons':
                        var $2396 = self.head;
                        var $2397 = self.tail;
                        var self = $2396;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2399 = self.file;
                                var $2400 = self.code;
                                var $2401 = self.name;
                                var $2402 = self.term;
                                var $2403 = self.type;
                                var $2404 = self.stat;
                                var $2405 = Fm$Term$lam$($2401, (_x$15 => {
                                    var $2406 = Fm$Term$desugar_cse$argument$(_name$1, $2397, _type$3, _body$4, _defs$5);
                                    return $2406;
                                }));
                                var $2398 = $2405;
                                break;
                        };
                        var $2394 = $2398;
                        break;
                };
                var $2205 = $2394;
                break;
            case 'Fm.Term.cse':
                var $2407 = self.path;
                var $2408 = self.expr;
                var $2409 = self.name;
                var $2410 = self.with;
                var $2411 = self.cses;
                var $2412 = self.moti;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2414 = _body$4;
                        var $2413 = $2414;
                        break;
                    case 'List.cons':
                        var $2415 = self.head;
                        var $2416 = self.tail;
                        var self = $2415;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2418 = self.file;
                                var $2419 = self.code;
                                var $2420 = self.name;
                                var $2421 = self.term;
                                var $2422 = self.type;
                                var $2423 = self.stat;
                                var $2424 = Fm$Term$lam$($2420, (_x$20 => {
                                    var $2425 = Fm$Term$desugar_cse$argument$(_name$1, $2416, _type$3, _body$4, _defs$5);
                                    return $2425;
                                }));
                                var $2417 = $2424;
                                break;
                        };
                        var $2413 = $2417;
                        break;
                };
                var $2205 = $2413;
                break;
            case 'Fm.Term.ori':
                var $2426 = self.orig;
                var $2427 = self.expr;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2429 = _body$4;
                        var $2428 = $2429;
                        break;
                    case 'List.cons':
                        var $2430 = self.head;
                        var $2431 = self.tail;
                        var self = $2430;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2433 = self.file;
                                var $2434 = self.code;
                                var $2435 = self.name;
                                var $2436 = self.term;
                                var $2437 = self.type;
                                var $2438 = self.stat;
                                var $2439 = Fm$Term$lam$($2435, (_x$16 => {
                                    var $2440 = Fm$Term$desugar_cse$argument$(_name$1, $2431, _type$3, _body$4, _defs$5);
                                    return $2440;
                                }));
                                var $2432 = $2439;
                                break;
                        };
                        var $2428 = $2432;
                        break;
                };
                var $2205 = $2428;
                break;
        };
        return $2205;
    };
    const Fm$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Fm$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.none':
                var $2442 = _b$3;
                var $2441 = $2442;
                break;
            case 'Maybe.some':
                var $2443 = self.value;
                var $2444 = Maybe$some$($2443);
                var $2441 = $2444;
                break;
        };
        return $2441;
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
                        var $2445 = self.name;
                        var $2446 = self.indx;
                        var _expr$10 = (() => {
                            var $2449 = _expr$1;
                            var $2450 = _wyth$3;
                            let _expr$11 = $2449;
                            let _defn$10;
                            while ($2450._ === 'List.cons') {
                                _defn$10 = $2450.head;
                                var $2449 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2451 = self.file;
                                            var $2452 = self.code;
                                            var $2453 = self.name;
                                            var $2454 = self.term;
                                            var $2455 = self.type;
                                            var $2456 = self.stat;
                                            var $2457 = $2454;
                                            return $2457;
                                    };
                                })());
                                _expr$11 = $2449;
                                $2450 = $2450.tail;
                            }
                            return _expr$11;
                        })();
                        var $2447 = _expr$10;
                        return $2447;
                    case 'Fm.Term.ref':
                        var $2458 = self.name;
                        var _expr$9 = (() => {
                            var $2461 = _expr$1;
                            var $2462 = _wyth$3;
                            let _expr$10 = $2461;
                            let _defn$9;
                            while ($2462._ === 'List.cons') {
                                _defn$9 = $2462.head;
                                var $2461 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2463 = self.file;
                                            var $2464 = self.code;
                                            var $2465 = self.name;
                                            var $2466 = self.term;
                                            var $2467 = self.type;
                                            var $2468 = self.stat;
                                            var $2469 = $2466;
                                            return $2469;
                                    };
                                })());
                                _expr$10 = $2461;
                                $2462 = $2462.tail;
                            }
                            return _expr$10;
                        })();
                        var $2459 = _expr$9;
                        return $2459;
                    case 'Fm.Term.typ':
                        var _expr$8 = (() => {
                            var $2472 = _expr$1;
                            var $2473 = _wyth$3;
                            let _expr$9 = $2472;
                            let _defn$8;
                            while ($2473._ === 'List.cons') {
                                _defn$8 = $2473.head;
                                var $2472 = Fm$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2474 = self.file;
                                            var $2475 = self.code;
                                            var $2476 = self.name;
                                            var $2477 = self.term;
                                            var $2478 = self.type;
                                            var $2479 = self.stat;
                                            var $2480 = $2477;
                                            return $2480;
                                    };
                                })());
                                _expr$9 = $2472;
                                $2473 = $2473.tail;
                            }
                            return _expr$9;
                        })();
                        var $2470 = _expr$8;
                        return $2470;
                    case 'Fm.Term.all':
                        var $2481 = self.eras;
                        var $2482 = self.self;
                        var $2483 = self.name;
                        var $2484 = self.xtyp;
                        var $2485 = self.body;
                        var _got$13 = Maybe$or$(Fm$get$($2483, _cses$4), Fm$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $2489 = _expr$1;
                                    var $2490 = _wyth$3;
                                    let _expr$15 = $2489;
                                    let _defn$14;
                                    while ($2490._ === 'List.cons') {
                                        _defn$14 = $2490.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Fm.Def.new':
                                                var $2491 = self.file;
                                                var $2492 = self.code;
                                                var $2493 = self.name;
                                                var $2494 = self.term;
                                                var $2495 = self.type;
                                                var $2496 = self.stat;
                                                var $2497 = Fm$Term$app$(_expr$15, $2494);
                                                var $2489 = $2497;
                                                break;
                                        };
                                        _expr$15 = $2489;
                                        $2490 = $2490.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $2487 = _expr$14;
                                var $2486 = $2487;
                                break;
                            case 'Maybe.some':
                                var $2498 = self.value;
                                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, _wyth$3, $2484, $2498, _defs$6);
                                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $2485(Fm$Term$var$($2482, 0n))(Fm$Term$var$($2483, 0n));
                                var $2499 = Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $2486 = $2499;
                                break;
                        };
                        return $2486;
                    case 'Fm.Term.lam':
                        var $2500 = self.name;
                        var $2501 = self.body;
                        var _expr$10 = (() => {
                            var $2504 = _expr$1;
                            var $2505 = _wyth$3;
                            let _expr$11 = $2504;
                            let _defn$10;
                            while ($2505._ === 'List.cons') {
                                _defn$10 = $2505.head;
                                var $2504 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2506 = self.file;
                                            var $2507 = self.code;
                                            var $2508 = self.name;
                                            var $2509 = self.term;
                                            var $2510 = self.type;
                                            var $2511 = self.stat;
                                            var $2512 = $2509;
                                            return $2512;
                                    };
                                })());
                                _expr$11 = $2504;
                                $2505 = $2505.tail;
                            }
                            return _expr$11;
                        })();
                        var $2502 = _expr$10;
                        return $2502;
                    case 'Fm.Term.app':
                        var $2513 = self.func;
                        var $2514 = self.argm;
                        var _expr$10 = (() => {
                            var $2517 = _expr$1;
                            var $2518 = _wyth$3;
                            let _expr$11 = $2517;
                            let _defn$10;
                            while ($2518._ === 'List.cons') {
                                _defn$10 = $2518.head;
                                var $2517 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2519 = self.file;
                                            var $2520 = self.code;
                                            var $2521 = self.name;
                                            var $2522 = self.term;
                                            var $2523 = self.type;
                                            var $2524 = self.stat;
                                            var $2525 = $2522;
                                            return $2525;
                                    };
                                })());
                                _expr$11 = $2517;
                                $2518 = $2518.tail;
                            }
                            return _expr$11;
                        })();
                        var $2515 = _expr$10;
                        return $2515;
                    case 'Fm.Term.let':
                        var $2526 = self.name;
                        var $2527 = self.expr;
                        var $2528 = self.body;
                        var _expr$11 = (() => {
                            var $2531 = _expr$1;
                            var $2532 = _wyth$3;
                            let _expr$12 = $2531;
                            let _defn$11;
                            while ($2532._ === 'List.cons') {
                                _defn$11 = $2532.head;
                                var $2531 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2533 = self.file;
                                            var $2534 = self.code;
                                            var $2535 = self.name;
                                            var $2536 = self.term;
                                            var $2537 = self.type;
                                            var $2538 = self.stat;
                                            var $2539 = $2536;
                                            return $2539;
                                    };
                                })());
                                _expr$12 = $2531;
                                $2532 = $2532.tail;
                            }
                            return _expr$12;
                        })();
                        var $2529 = _expr$11;
                        return $2529;
                    case 'Fm.Term.def':
                        var $2540 = self.name;
                        var $2541 = self.expr;
                        var $2542 = self.body;
                        var _expr$11 = (() => {
                            var $2545 = _expr$1;
                            var $2546 = _wyth$3;
                            let _expr$12 = $2545;
                            let _defn$11;
                            while ($2546._ === 'List.cons') {
                                _defn$11 = $2546.head;
                                var $2545 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2547 = self.file;
                                            var $2548 = self.code;
                                            var $2549 = self.name;
                                            var $2550 = self.term;
                                            var $2551 = self.type;
                                            var $2552 = self.stat;
                                            var $2553 = $2550;
                                            return $2553;
                                    };
                                })());
                                _expr$12 = $2545;
                                $2546 = $2546.tail;
                            }
                            return _expr$12;
                        })();
                        var $2543 = _expr$11;
                        return $2543;
                    case 'Fm.Term.ann':
                        var $2554 = self.done;
                        var $2555 = self.term;
                        var $2556 = self.type;
                        var _expr$11 = (() => {
                            var $2559 = _expr$1;
                            var $2560 = _wyth$3;
                            let _expr$12 = $2559;
                            let _defn$11;
                            while ($2560._ === 'List.cons') {
                                _defn$11 = $2560.head;
                                var $2559 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2561 = self.file;
                                            var $2562 = self.code;
                                            var $2563 = self.name;
                                            var $2564 = self.term;
                                            var $2565 = self.type;
                                            var $2566 = self.stat;
                                            var $2567 = $2564;
                                            return $2567;
                                    };
                                })());
                                _expr$12 = $2559;
                                $2560 = $2560.tail;
                            }
                            return _expr$12;
                        })();
                        var $2557 = _expr$11;
                        return $2557;
                    case 'Fm.Term.gol':
                        var $2568 = self.name;
                        var $2569 = self.dref;
                        var $2570 = self.verb;
                        var _expr$11 = (() => {
                            var $2573 = _expr$1;
                            var $2574 = _wyth$3;
                            let _expr$12 = $2573;
                            let _defn$11;
                            while ($2574._ === 'List.cons') {
                                _defn$11 = $2574.head;
                                var $2573 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2575 = self.file;
                                            var $2576 = self.code;
                                            var $2577 = self.name;
                                            var $2578 = self.term;
                                            var $2579 = self.type;
                                            var $2580 = self.stat;
                                            var $2581 = $2578;
                                            return $2581;
                                    };
                                })());
                                _expr$12 = $2573;
                                $2574 = $2574.tail;
                            }
                            return _expr$12;
                        })();
                        var $2571 = _expr$11;
                        return $2571;
                    case 'Fm.Term.hol':
                        var $2582 = self.path;
                        var _expr$9 = (() => {
                            var $2585 = _expr$1;
                            var $2586 = _wyth$3;
                            let _expr$10 = $2585;
                            let _defn$9;
                            while ($2586._ === 'List.cons') {
                                _defn$9 = $2586.head;
                                var $2585 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2587 = self.file;
                                            var $2588 = self.code;
                                            var $2589 = self.name;
                                            var $2590 = self.term;
                                            var $2591 = self.type;
                                            var $2592 = self.stat;
                                            var $2593 = $2590;
                                            return $2593;
                                    };
                                })());
                                _expr$10 = $2585;
                                $2586 = $2586.tail;
                            }
                            return _expr$10;
                        })();
                        var $2583 = _expr$9;
                        return $2583;
                    case 'Fm.Term.nat':
                        var $2594 = self.natx;
                        var _expr$9 = (() => {
                            var $2597 = _expr$1;
                            var $2598 = _wyth$3;
                            let _expr$10 = $2597;
                            let _defn$9;
                            while ($2598._ === 'List.cons') {
                                _defn$9 = $2598.head;
                                var $2597 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2599 = self.file;
                                            var $2600 = self.code;
                                            var $2601 = self.name;
                                            var $2602 = self.term;
                                            var $2603 = self.type;
                                            var $2604 = self.stat;
                                            var $2605 = $2602;
                                            return $2605;
                                    };
                                })());
                                _expr$10 = $2597;
                                $2598 = $2598.tail;
                            }
                            return _expr$10;
                        })();
                        var $2595 = _expr$9;
                        return $2595;
                    case 'Fm.Term.chr':
                        var $2606 = self.chrx;
                        var _expr$9 = (() => {
                            var $2609 = _expr$1;
                            var $2610 = _wyth$3;
                            let _expr$10 = $2609;
                            let _defn$9;
                            while ($2610._ === 'List.cons') {
                                _defn$9 = $2610.head;
                                var $2609 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2611 = self.file;
                                            var $2612 = self.code;
                                            var $2613 = self.name;
                                            var $2614 = self.term;
                                            var $2615 = self.type;
                                            var $2616 = self.stat;
                                            var $2617 = $2614;
                                            return $2617;
                                    };
                                })());
                                _expr$10 = $2609;
                                $2610 = $2610.tail;
                            }
                            return _expr$10;
                        })();
                        var $2607 = _expr$9;
                        return $2607;
                    case 'Fm.Term.str':
                        var $2618 = self.strx;
                        var _expr$9 = (() => {
                            var $2621 = _expr$1;
                            var $2622 = _wyth$3;
                            let _expr$10 = $2621;
                            let _defn$9;
                            while ($2622._ === 'List.cons') {
                                _defn$9 = $2622.head;
                                var $2621 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2623 = self.file;
                                            var $2624 = self.code;
                                            var $2625 = self.name;
                                            var $2626 = self.term;
                                            var $2627 = self.type;
                                            var $2628 = self.stat;
                                            var $2629 = $2626;
                                            return $2629;
                                    };
                                })());
                                _expr$10 = $2621;
                                $2622 = $2622.tail;
                            }
                            return _expr$10;
                        })();
                        var $2619 = _expr$9;
                        return $2619;
                    case 'Fm.Term.cse':
                        var $2630 = self.path;
                        var $2631 = self.expr;
                        var $2632 = self.name;
                        var $2633 = self.with;
                        var $2634 = self.cses;
                        var $2635 = self.moti;
                        var _expr$14 = (() => {
                            var $2638 = _expr$1;
                            var $2639 = _wyth$3;
                            let _expr$15 = $2638;
                            let _defn$14;
                            while ($2639._ === 'List.cons') {
                                _defn$14 = $2639.head;
                                var $2638 = Fm$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2640 = self.file;
                                            var $2641 = self.code;
                                            var $2642 = self.name;
                                            var $2643 = self.term;
                                            var $2644 = self.type;
                                            var $2645 = self.stat;
                                            var $2646 = $2643;
                                            return $2646;
                                    };
                                })());
                                _expr$15 = $2638;
                                $2639 = $2639.tail;
                            }
                            return _expr$15;
                        })();
                        var $2636 = _expr$14;
                        return $2636;
                    case 'Fm.Term.ori':
                        var $2647 = self.orig;
                        var $2648 = self.expr;
                        var _expr$10 = (() => {
                            var $2651 = _expr$1;
                            var $2652 = _wyth$3;
                            let _expr$11 = $2651;
                            let _defn$10;
                            while ($2652._ === 'List.cons') {
                                _defn$10 = $2652.head;
                                var $2651 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2653 = self.file;
                                            var $2654 = self.code;
                                            var $2655 = self.name;
                                            var $2656 = self.term;
                                            var $2657 = self.type;
                                            var $2658 = self.stat;
                                            var $2659 = $2656;
                                            return $2659;
                                    };
                                })());
                                _expr$11 = $2651;
                                $2652 = $2652.tail;
                            }
                            return _expr$11;
                        })();
                        var $2649 = _expr$10;
                        return $2649;
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
                var $2661 = self.name;
                var $2662 = self.indx;
                var $2663 = Maybe$none;
                var $2660 = $2663;
                break;
            case 'Fm.Term.ref':
                var $2664 = self.name;
                var $2665 = Maybe$none;
                var $2660 = $2665;
                break;
            case 'Fm.Term.typ':
                var $2666 = Maybe$none;
                var $2660 = $2666;
                break;
            case 'Fm.Term.all':
                var $2667 = self.eras;
                var $2668 = self.self;
                var $2669 = self.name;
                var $2670 = self.xtyp;
                var $2671 = self.body;
                var _moti$14 = Fm$Term$desugar_cse$motive$(_with$3, _moti$5);
                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, List$nil, $2670, _moti$14, _defs$7);
                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                var _type$17 = $2671(Fm$Term$var$($2668, 0n))(Fm$Term$var$($2669, 0n));
                var $2672 = Maybe$some$(Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _with$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $2660 = $2672;
                break;
            case 'Fm.Term.lam':
                var $2673 = self.name;
                var $2674 = self.body;
                var $2675 = Maybe$none;
                var $2660 = $2675;
                break;
            case 'Fm.Term.app':
                var $2676 = self.func;
                var $2677 = self.argm;
                var $2678 = Maybe$none;
                var $2660 = $2678;
                break;
            case 'Fm.Term.let':
                var $2679 = self.name;
                var $2680 = self.expr;
                var $2681 = self.body;
                var $2682 = Maybe$none;
                var $2660 = $2682;
                break;
            case 'Fm.Term.def':
                var $2683 = self.name;
                var $2684 = self.expr;
                var $2685 = self.body;
                var $2686 = Maybe$none;
                var $2660 = $2686;
                break;
            case 'Fm.Term.ann':
                var $2687 = self.done;
                var $2688 = self.term;
                var $2689 = self.type;
                var $2690 = Maybe$none;
                var $2660 = $2690;
                break;
            case 'Fm.Term.gol':
                var $2691 = self.name;
                var $2692 = self.dref;
                var $2693 = self.verb;
                var $2694 = Maybe$none;
                var $2660 = $2694;
                break;
            case 'Fm.Term.hol':
                var $2695 = self.path;
                var $2696 = Maybe$none;
                var $2660 = $2696;
                break;
            case 'Fm.Term.nat':
                var $2697 = self.natx;
                var $2698 = Maybe$none;
                var $2660 = $2698;
                break;
            case 'Fm.Term.chr':
                var $2699 = self.chrx;
                var $2700 = Maybe$none;
                var $2660 = $2700;
                break;
            case 'Fm.Term.str':
                var $2701 = self.strx;
                var $2702 = Maybe$none;
                var $2660 = $2702;
                break;
            case 'Fm.Term.cse':
                var $2703 = self.path;
                var $2704 = self.expr;
                var $2705 = self.name;
                var $2706 = self.with;
                var $2707 = self.cses;
                var $2708 = self.moti;
                var $2709 = Maybe$none;
                var $2660 = $2709;
                break;
            case 'Fm.Term.ori':
                var $2710 = self.orig;
                var $2711 = self.expr;
                var $2712 = Maybe$none;
                var $2660 = $2712;
                break;
        };
        return $2660;
    };
    const Fm$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Error$patch$(_path$1, _term$2) {
        var $2713 = ({
            _: 'Fm.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $2713;
    };
    const Fm$Error$patch = x0 => x1 => Fm$Error$patch$(x0, x1);

    function Fm$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.none':
                var $2715 = Bits$e;
                var $2714 = $2715;
                break;
            case 'Maybe.some':
                var $2716 = self.value;
                var $2717 = $2716(Bits$e);
                var $2714 = $2717;
                break;
        };
        return $2714;
    };
    const Fm$MPath$to_bits = x0 => Fm$MPath$to_bits$(x0);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $2719 = Bool$false;
                var $2718 = $2719;
                break;
            case 'Maybe.some':
                var $2720 = self.value;
                var $2721 = Bool$true;
                var $2718 = $2721;
                break;
        };
        return $2718;
    };
    const Set$has = x0 => x1 => Set$has$(x0, x1);

    function Fm$Term$equal$patch$(_path$2, _term$3, _ret$4) {
        var $2722 = Fm$Check$result$(Maybe$some$(_ret$4), List$cons$(Fm$Error$patch$(_path$2, Fm$Term$normalize$(_term$3, Map$new)), List$nil));
        return $2722;
    };
    const Fm$Term$equal$patch = x0 => x1 => x2 => Fm$Term$equal$patch$(x0, x1, x2);

    function Fm$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2724 = self.name;
                var $2725 = self.indx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2727 = self.name;
                        var $2728 = self.indx;
                        var $2729 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2729;
                        break;
                    case 'Fm.Term.ref':
                        var $2730 = self.name;
                        var $2731 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2731;
                        break;
                    case 'Fm.Term.typ':
                        var $2732 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2732;
                        break;
                    case 'Fm.Term.all':
                        var $2733 = self.eras;
                        var $2734 = self.self;
                        var $2735 = self.name;
                        var $2736 = self.xtyp;
                        var $2737 = self.body;
                        var $2738 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2738;
                        break;
                    case 'Fm.Term.lam':
                        var $2739 = self.name;
                        var $2740 = self.body;
                        var $2741 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2741;
                        break;
                    case 'Fm.Term.app':
                        var $2742 = self.func;
                        var $2743 = self.argm;
                        var $2744 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2744;
                        break;
                    case 'Fm.Term.let':
                        var $2745 = self.name;
                        var $2746 = self.expr;
                        var $2747 = self.body;
                        var $2748 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2748;
                        break;
                    case 'Fm.Term.def':
                        var $2749 = self.name;
                        var $2750 = self.expr;
                        var $2751 = self.body;
                        var $2752 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2752;
                        break;
                    case 'Fm.Term.ann':
                        var $2753 = self.done;
                        var $2754 = self.term;
                        var $2755 = self.type;
                        var $2756 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2756;
                        break;
                    case 'Fm.Term.gol':
                        var $2757 = self.name;
                        var $2758 = self.dref;
                        var $2759 = self.verb;
                        var $2760 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2760;
                        break;
                    case 'Fm.Term.hol':
                        var $2761 = self.path;
                        var $2762 = Fm$Term$equal$patch$($2761, _a$1, Unit$new);
                        var $2726 = $2762;
                        break;
                    case 'Fm.Term.nat':
                        var $2763 = self.natx;
                        var $2764 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2764;
                        break;
                    case 'Fm.Term.chr':
                        var $2765 = self.chrx;
                        var $2766 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2766;
                        break;
                    case 'Fm.Term.str':
                        var $2767 = self.strx;
                        var $2768 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2768;
                        break;
                    case 'Fm.Term.cse':
                        var $2769 = self.path;
                        var $2770 = self.expr;
                        var $2771 = self.name;
                        var $2772 = self.with;
                        var $2773 = self.cses;
                        var $2774 = self.moti;
                        var $2775 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2726 = $2775;
                        break;
                    case 'Fm.Term.ori':
                        var $2776 = self.orig;
                        var $2777 = self.expr;
                        var $2778 = Fm$Term$equal$extra_holes$(_a$1, $2777);
                        var $2726 = $2778;
                        break;
                };
                var $2723 = $2726;
                break;
            case 'Fm.Term.ref':
                var $2779 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2781 = self.name;
                        var $2782 = self.indx;
                        var $2783 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2783;
                        break;
                    case 'Fm.Term.ref':
                        var $2784 = self.name;
                        var $2785 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2785;
                        break;
                    case 'Fm.Term.typ':
                        var $2786 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2786;
                        break;
                    case 'Fm.Term.all':
                        var $2787 = self.eras;
                        var $2788 = self.self;
                        var $2789 = self.name;
                        var $2790 = self.xtyp;
                        var $2791 = self.body;
                        var $2792 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2792;
                        break;
                    case 'Fm.Term.lam':
                        var $2793 = self.name;
                        var $2794 = self.body;
                        var $2795 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2795;
                        break;
                    case 'Fm.Term.app':
                        var $2796 = self.func;
                        var $2797 = self.argm;
                        var $2798 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2798;
                        break;
                    case 'Fm.Term.let':
                        var $2799 = self.name;
                        var $2800 = self.expr;
                        var $2801 = self.body;
                        var $2802 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2802;
                        break;
                    case 'Fm.Term.def':
                        var $2803 = self.name;
                        var $2804 = self.expr;
                        var $2805 = self.body;
                        var $2806 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2806;
                        break;
                    case 'Fm.Term.ann':
                        var $2807 = self.done;
                        var $2808 = self.term;
                        var $2809 = self.type;
                        var $2810 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2810;
                        break;
                    case 'Fm.Term.gol':
                        var $2811 = self.name;
                        var $2812 = self.dref;
                        var $2813 = self.verb;
                        var $2814 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2814;
                        break;
                    case 'Fm.Term.hol':
                        var $2815 = self.path;
                        var $2816 = Fm$Term$equal$patch$($2815, _a$1, Unit$new);
                        var $2780 = $2816;
                        break;
                    case 'Fm.Term.nat':
                        var $2817 = self.natx;
                        var $2818 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2818;
                        break;
                    case 'Fm.Term.chr':
                        var $2819 = self.chrx;
                        var $2820 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2820;
                        break;
                    case 'Fm.Term.str':
                        var $2821 = self.strx;
                        var $2822 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2822;
                        break;
                    case 'Fm.Term.cse':
                        var $2823 = self.path;
                        var $2824 = self.expr;
                        var $2825 = self.name;
                        var $2826 = self.with;
                        var $2827 = self.cses;
                        var $2828 = self.moti;
                        var $2829 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2780 = $2829;
                        break;
                    case 'Fm.Term.ori':
                        var $2830 = self.orig;
                        var $2831 = self.expr;
                        var $2832 = Fm$Term$equal$extra_holes$(_a$1, $2831);
                        var $2780 = $2832;
                        break;
                };
                var $2723 = $2780;
                break;
            case 'Fm.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2834 = self.name;
                        var $2835 = self.indx;
                        var $2836 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2836;
                        break;
                    case 'Fm.Term.ref':
                        var $2837 = self.name;
                        var $2838 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2838;
                        break;
                    case 'Fm.Term.typ':
                        var $2839 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2839;
                        break;
                    case 'Fm.Term.all':
                        var $2840 = self.eras;
                        var $2841 = self.self;
                        var $2842 = self.name;
                        var $2843 = self.xtyp;
                        var $2844 = self.body;
                        var $2845 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2845;
                        break;
                    case 'Fm.Term.lam':
                        var $2846 = self.name;
                        var $2847 = self.body;
                        var $2848 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2848;
                        break;
                    case 'Fm.Term.app':
                        var $2849 = self.func;
                        var $2850 = self.argm;
                        var $2851 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2851;
                        break;
                    case 'Fm.Term.let':
                        var $2852 = self.name;
                        var $2853 = self.expr;
                        var $2854 = self.body;
                        var $2855 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2855;
                        break;
                    case 'Fm.Term.def':
                        var $2856 = self.name;
                        var $2857 = self.expr;
                        var $2858 = self.body;
                        var $2859 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2859;
                        break;
                    case 'Fm.Term.ann':
                        var $2860 = self.done;
                        var $2861 = self.term;
                        var $2862 = self.type;
                        var $2863 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2863;
                        break;
                    case 'Fm.Term.gol':
                        var $2864 = self.name;
                        var $2865 = self.dref;
                        var $2866 = self.verb;
                        var $2867 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2867;
                        break;
                    case 'Fm.Term.hol':
                        var $2868 = self.path;
                        var $2869 = Fm$Term$equal$patch$($2868, _a$1, Unit$new);
                        var $2833 = $2869;
                        break;
                    case 'Fm.Term.nat':
                        var $2870 = self.natx;
                        var $2871 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2871;
                        break;
                    case 'Fm.Term.chr':
                        var $2872 = self.chrx;
                        var $2873 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2873;
                        break;
                    case 'Fm.Term.str':
                        var $2874 = self.strx;
                        var $2875 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2875;
                        break;
                    case 'Fm.Term.cse':
                        var $2876 = self.path;
                        var $2877 = self.expr;
                        var $2878 = self.name;
                        var $2879 = self.with;
                        var $2880 = self.cses;
                        var $2881 = self.moti;
                        var $2882 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2833 = $2882;
                        break;
                    case 'Fm.Term.ori':
                        var $2883 = self.orig;
                        var $2884 = self.expr;
                        var $2885 = Fm$Term$equal$extra_holes$(_a$1, $2884);
                        var $2833 = $2885;
                        break;
                };
                var $2723 = $2833;
                break;
            case 'Fm.Term.all':
                var $2886 = self.eras;
                var $2887 = self.self;
                var $2888 = self.name;
                var $2889 = self.xtyp;
                var $2890 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2892 = self.name;
                        var $2893 = self.indx;
                        var $2894 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2894;
                        break;
                    case 'Fm.Term.ref':
                        var $2895 = self.name;
                        var $2896 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2896;
                        break;
                    case 'Fm.Term.typ':
                        var $2897 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2897;
                        break;
                    case 'Fm.Term.all':
                        var $2898 = self.eras;
                        var $2899 = self.self;
                        var $2900 = self.name;
                        var $2901 = self.xtyp;
                        var $2902 = self.body;
                        var $2903 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2903;
                        break;
                    case 'Fm.Term.lam':
                        var $2904 = self.name;
                        var $2905 = self.body;
                        var $2906 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2906;
                        break;
                    case 'Fm.Term.app':
                        var $2907 = self.func;
                        var $2908 = self.argm;
                        var $2909 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2909;
                        break;
                    case 'Fm.Term.let':
                        var $2910 = self.name;
                        var $2911 = self.expr;
                        var $2912 = self.body;
                        var $2913 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2913;
                        break;
                    case 'Fm.Term.def':
                        var $2914 = self.name;
                        var $2915 = self.expr;
                        var $2916 = self.body;
                        var $2917 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2917;
                        break;
                    case 'Fm.Term.ann':
                        var $2918 = self.done;
                        var $2919 = self.term;
                        var $2920 = self.type;
                        var $2921 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2921;
                        break;
                    case 'Fm.Term.gol':
                        var $2922 = self.name;
                        var $2923 = self.dref;
                        var $2924 = self.verb;
                        var $2925 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2925;
                        break;
                    case 'Fm.Term.hol':
                        var $2926 = self.path;
                        var $2927 = Fm$Term$equal$patch$($2926, _a$1, Unit$new);
                        var $2891 = $2927;
                        break;
                    case 'Fm.Term.nat':
                        var $2928 = self.natx;
                        var $2929 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2929;
                        break;
                    case 'Fm.Term.chr':
                        var $2930 = self.chrx;
                        var $2931 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2931;
                        break;
                    case 'Fm.Term.str':
                        var $2932 = self.strx;
                        var $2933 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2933;
                        break;
                    case 'Fm.Term.cse':
                        var $2934 = self.path;
                        var $2935 = self.expr;
                        var $2936 = self.name;
                        var $2937 = self.with;
                        var $2938 = self.cses;
                        var $2939 = self.moti;
                        var $2940 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2891 = $2940;
                        break;
                    case 'Fm.Term.ori':
                        var $2941 = self.orig;
                        var $2942 = self.expr;
                        var $2943 = Fm$Term$equal$extra_holes$(_a$1, $2942);
                        var $2891 = $2943;
                        break;
                };
                var $2723 = $2891;
                break;
            case 'Fm.Term.lam':
                var $2944 = self.name;
                var $2945 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2947 = self.name;
                        var $2948 = self.indx;
                        var $2949 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2949;
                        break;
                    case 'Fm.Term.ref':
                        var $2950 = self.name;
                        var $2951 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2951;
                        break;
                    case 'Fm.Term.typ':
                        var $2952 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2952;
                        break;
                    case 'Fm.Term.all':
                        var $2953 = self.eras;
                        var $2954 = self.self;
                        var $2955 = self.name;
                        var $2956 = self.xtyp;
                        var $2957 = self.body;
                        var $2958 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2958;
                        break;
                    case 'Fm.Term.lam':
                        var $2959 = self.name;
                        var $2960 = self.body;
                        var $2961 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2961;
                        break;
                    case 'Fm.Term.app':
                        var $2962 = self.func;
                        var $2963 = self.argm;
                        var $2964 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2964;
                        break;
                    case 'Fm.Term.let':
                        var $2965 = self.name;
                        var $2966 = self.expr;
                        var $2967 = self.body;
                        var $2968 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2968;
                        break;
                    case 'Fm.Term.def':
                        var $2969 = self.name;
                        var $2970 = self.expr;
                        var $2971 = self.body;
                        var $2972 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2972;
                        break;
                    case 'Fm.Term.ann':
                        var $2973 = self.done;
                        var $2974 = self.term;
                        var $2975 = self.type;
                        var $2976 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2976;
                        break;
                    case 'Fm.Term.gol':
                        var $2977 = self.name;
                        var $2978 = self.dref;
                        var $2979 = self.verb;
                        var $2980 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2980;
                        break;
                    case 'Fm.Term.hol':
                        var $2981 = self.path;
                        var $2982 = Fm$Term$equal$patch$($2981, _a$1, Unit$new);
                        var $2946 = $2982;
                        break;
                    case 'Fm.Term.nat':
                        var $2983 = self.natx;
                        var $2984 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2984;
                        break;
                    case 'Fm.Term.chr':
                        var $2985 = self.chrx;
                        var $2986 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2986;
                        break;
                    case 'Fm.Term.str':
                        var $2987 = self.strx;
                        var $2988 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2988;
                        break;
                    case 'Fm.Term.cse':
                        var $2989 = self.path;
                        var $2990 = self.expr;
                        var $2991 = self.name;
                        var $2992 = self.with;
                        var $2993 = self.cses;
                        var $2994 = self.moti;
                        var $2995 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2946 = $2995;
                        break;
                    case 'Fm.Term.ori':
                        var $2996 = self.orig;
                        var $2997 = self.expr;
                        var $2998 = Fm$Term$equal$extra_holes$(_a$1, $2997);
                        var $2946 = $2998;
                        break;
                };
                var $2723 = $2946;
                break;
            case 'Fm.Term.app':
                var $2999 = self.func;
                var $3000 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3002 = self.name;
                        var $3003 = self.indx;
                        var $3004 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3004;
                        break;
                    case 'Fm.Term.ref':
                        var $3005 = self.name;
                        var $3006 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3006;
                        break;
                    case 'Fm.Term.typ':
                        var $3007 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3007;
                        break;
                    case 'Fm.Term.all':
                        var $3008 = self.eras;
                        var $3009 = self.self;
                        var $3010 = self.name;
                        var $3011 = self.xtyp;
                        var $3012 = self.body;
                        var $3013 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3013;
                        break;
                    case 'Fm.Term.lam':
                        var $3014 = self.name;
                        var $3015 = self.body;
                        var $3016 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3016;
                        break;
                    case 'Fm.Term.app':
                        var $3017 = self.func;
                        var $3018 = self.argm;
                        var $3019 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$($2999, $3017))((_$7 => {
                            var $3020 = Fm$Term$equal$extra_holes$($3000, $3018);
                            return $3020;
                        }));
                        var $3001 = $3019;
                        break;
                    case 'Fm.Term.let':
                        var $3021 = self.name;
                        var $3022 = self.expr;
                        var $3023 = self.body;
                        var $3024 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3024;
                        break;
                    case 'Fm.Term.def':
                        var $3025 = self.name;
                        var $3026 = self.expr;
                        var $3027 = self.body;
                        var $3028 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3028;
                        break;
                    case 'Fm.Term.ann':
                        var $3029 = self.done;
                        var $3030 = self.term;
                        var $3031 = self.type;
                        var $3032 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3032;
                        break;
                    case 'Fm.Term.gol':
                        var $3033 = self.name;
                        var $3034 = self.dref;
                        var $3035 = self.verb;
                        var $3036 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3036;
                        break;
                    case 'Fm.Term.hol':
                        var $3037 = self.path;
                        var $3038 = Fm$Term$equal$patch$($3037, _a$1, Unit$new);
                        var $3001 = $3038;
                        break;
                    case 'Fm.Term.nat':
                        var $3039 = self.natx;
                        var $3040 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3040;
                        break;
                    case 'Fm.Term.chr':
                        var $3041 = self.chrx;
                        var $3042 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3042;
                        break;
                    case 'Fm.Term.str':
                        var $3043 = self.strx;
                        var $3044 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3044;
                        break;
                    case 'Fm.Term.cse':
                        var $3045 = self.path;
                        var $3046 = self.expr;
                        var $3047 = self.name;
                        var $3048 = self.with;
                        var $3049 = self.cses;
                        var $3050 = self.moti;
                        var $3051 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3001 = $3051;
                        break;
                    case 'Fm.Term.ori':
                        var $3052 = self.orig;
                        var $3053 = self.expr;
                        var $3054 = Fm$Term$equal$extra_holes$(_a$1, $3053);
                        var $3001 = $3054;
                        break;
                };
                var $2723 = $3001;
                break;
            case 'Fm.Term.let':
                var $3055 = self.name;
                var $3056 = self.expr;
                var $3057 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3059 = self.name;
                        var $3060 = self.indx;
                        var $3061 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3061;
                        break;
                    case 'Fm.Term.ref':
                        var $3062 = self.name;
                        var $3063 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3063;
                        break;
                    case 'Fm.Term.typ':
                        var $3064 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3064;
                        break;
                    case 'Fm.Term.all':
                        var $3065 = self.eras;
                        var $3066 = self.self;
                        var $3067 = self.name;
                        var $3068 = self.xtyp;
                        var $3069 = self.body;
                        var $3070 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3070;
                        break;
                    case 'Fm.Term.lam':
                        var $3071 = self.name;
                        var $3072 = self.body;
                        var $3073 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3073;
                        break;
                    case 'Fm.Term.app':
                        var $3074 = self.func;
                        var $3075 = self.argm;
                        var $3076 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3076;
                        break;
                    case 'Fm.Term.let':
                        var $3077 = self.name;
                        var $3078 = self.expr;
                        var $3079 = self.body;
                        var $3080 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3080;
                        break;
                    case 'Fm.Term.def':
                        var $3081 = self.name;
                        var $3082 = self.expr;
                        var $3083 = self.body;
                        var $3084 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3084;
                        break;
                    case 'Fm.Term.ann':
                        var $3085 = self.done;
                        var $3086 = self.term;
                        var $3087 = self.type;
                        var $3088 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3088;
                        break;
                    case 'Fm.Term.gol':
                        var $3089 = self.name;
                        var $3090 = self.dref;
                        var $3091 = self.verb;
                        var $3092 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3092;
                        break;
                    case 'Fm.Term.hol':
                        var $3093 = self.path;
                        var $3094 = Fm$Term$equal$patch$($3093, _a$1, Unit$new);
                        var $3058 = $3094;
                        break;
                    case 'Fm.Term.nat':
                        var $3095 = self.natx;
                        var $3096 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3096;
                        break;
                    case 'Fm.Term.chr':
                        var $3097 = self.chrx;
                        var $3098 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3098;
                        break;
                    case 'Fm.Term.str':
                        var $3099 = self.strx;
                        var $3100 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3100;
                        break;
                    case 'Fm.Term.cse':
                        var $3101 = self.path;
                        var $3102 = self.expr;
                        var $3103 = self.name;
                        var $3104 = self.with;
                        var $3105 = self.cses;
                        var $3106 = self.moti;
                        var $3107 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3058 = $3107;
                        break;
                    case 'Fm.Term.ori':
                        var $3108 = self.orig;
                        var $3109 = self.expr;
                        var $3110 = Fm$Term$equal$extra_holes$(_a$1, $3109);
                        var $3058 = $3110;
                        break;
                };
                var $2723 = $3058;
                break;
            case 'Fm.Term.def':
                var $3111 = self.name;
                var $3112 = self.expr;
                var $3113 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3115 = self.name;
                        var $3116 = self.indx;
                        var $3117 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3117;
                        break;
                    case 'Fm.Term.ref':
                        var $3118 = self.name;
                        var $3119 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3119;
                        break;
                    case 'Fm.Term.typ':
                        var $3120 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3120;
                        break;
                    case 'Fm.Term.all':
                        var $3121 = self.eras;
                        var $3122 = self.self;
                        var $3123 = self.name;
                        var $3124 = self.xtyp;
                        var $3125 = self.body;
                        var $3126 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3126;
                        break;
                    case 'Fm.Term.lam':
                        var $3127 = self.name;
                        var $3128 = self.body;
                        var $3129 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3129;
                        break;
                    case 'Fm.Term.app':
                        var $3130 = self.func;
                        var $3131 = self.argm;
                        var $3132 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3132;
                        break;
                    case 'Fm.Term.let':
                        var $3133 = self.name;
                        var $3134 = self.expr;
                        var $3135 = self.body;
                        var $3136 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3136;
                        break;
                    case 'Fm.Term.def':
                        var $3137 = self.name;
                        var $3138 = self.expr;
                        var $3139 = self.body;
                        var $3140 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3140;
                        break;
                    case 'Fm.Term.ann':
                        var $3141 = self.done;
                        var $3142 = self.term;
                        var $3143 = self.type;
                        var $3144 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3144;
                        break;
                    case 'Fm.Term.gol':
                        var $3145 = self.name;
                        var $3146 = self.dref;
                        var $3147 = self.verb;
                        var $3148 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3148;
                        break;
                    case 'Fm.Term.hol':
                        var $3149 = self.path;
                        var $3150 = Fm$Term$equal$patch$($3149, _a$1, Unit$new);
                        var $3114 = $3150;
                        break;
                    case 'Fm.Term.nat':
                        var $3151 = self.natx;
                        var $3152 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3152;
                        break;
                    case 'Fm.Term.chr':
                        var $3153 = self.chrx;
                        var $3154 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3154;
                        break;
                    case 'Fm.Term.str':
                        var $3155 = self.strx;
                        var $3156 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3156;
                        break;
                    case 'Fm.Term.cse':
                        var $3157 = self.path;
                        var $3158 = self.expr;
                        var $3159 = self.name;
                        var $3160 = self.with;
                        var $3161 = self.cses;
                        var $3162 = self.moti;
                        var $3163 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3114 = $3163;
                        break;
                    case 'Fm.Term.ori':
                        var $3164 = self.orig;
                        var $3165 = self.expr;
                        var $3166 = Fm$Term$equal$extra_holes$(_a$1, $3165);
                        var $3114 = $3166;
                        break;
                };
                var $2723 = $3114;
                break;
            case 'Fm.Term.ann':
                var $3167 = self.done;
                var $3168 = self.term;
                var $3169 = self.type;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3171 = self.name;
                        var $3172 = self.indx;
                        var $3173 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3173;
                        break;
                    case 'Fm.Term.ref':
                        var $3174 = self.name;
                        var $3175 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3175;
                        break;
                    case 'Fm.Term.typ':
                        var $3176 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3176;
                        break;
                    case 'Fm.Term.all':
                        var $3177 = self.eras;
                        var $3178 = self.self;
                        var $3179 = self.name;
                        var $3180 = self.xtyp;
                        var $3181 = self.body;
                        var $3182 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3182;
                        break;
                    case 'Fm.Term.lam':
                        var $3183 = self.name;
                        var $3184 = self.body;
                        var $3185 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3185;
                        break;
                    case 'Fm.Term.app':
                        var $3186 = self.func;
                        var $3187 = self.argm;
                        var $3188 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3188;
                        break;
                    case 'Fm.Term.let':
                        var $3189 = self.name;
                        var $3190 = self.expr;
                        var $3191 = self.body;
                        var $3192 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3192;
                        break;
                    case 'Fm.Term.def':
                        var $3193 = self.name;
                        var $3194 = self.expr;
                        var $3195 = self.body;
                        var $3196 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3196;
                        break;
                    case 'Fm.Term.ann':
                        var $3197 = self.done;
                        var $3198 = self.term;
                        var $3199 = self.type;
                        var $3200 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3200;
                        break;
                    case 'Fm.Term.gol':
                        var $3201 = self.name;
                        var $3202 = self.dref;
                        var $3203 = self.verb;
                        var $3204 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3204;
                        break;
                    case 'Fm.Term.hol':
                        var $3205 = self.path;
                        var $3206 = Fm$Term$equal$patch$($3205, _a$1, Unit$new);
                        var $3170 = $3206;
                        break;
                    case 'Fm.Term.nat':
                        var $3207 = self.natx;
                        var $3208 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3208;
                        break;
                    case 'Fm.Term.chr':
                        var $3209 = self.chrx;
                        var $3210 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3210;
                        break;
                    case 'Fm.Term.str':
                        var $3211 = self.strx;
                        var $3212 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3212;
                        break;
                    case 'Fm.Term.cse':
                        var $3213 = self.path;
                        var $3214 = self.expr;
                        var $3215 = self.name;
                        var $3216 = self.with;
                        var $3217 = self.cses;
                        var $3218 = self.moti;
                        var $3219 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3170 = $3219;
                        break;
                    case 'Fm.Term.ori':
                        var $3220 = self.orig;
                        var $3221 = self.expr;
                        var $3222 = Fm$Term$equal$extra_holes$(_a$1, $3221);
                        var $3170 = $3222;
                        break;
                };
                var $2723 = $3170;
                break;
            case 'Fm.Term.gol':
                var $3223 = self.name;
                var $3224 = self.dref;
                var $3225 = self.verb;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3227 = self.name;
                        var $3228 = self.indx;
                        var $3229 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3229;
                        break;
                    case 'Fm.Term.ref':
                        var $3230 = self.name;
                        var $3231 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3231;
                        break;
                    case 'Fm.Term.typ':
                        var $3232 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3232;
                        break;
                    case 'Fm.Term.all':
                        var $3233 = self.eras;
                        var $3234 = self.self;
                        var $3235 = self.name;
                        var $3236 = self.xtyp;
                        var $3237 = self.body;
                        var $3238 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3238;
                        break;
                    case 'Fm.Term.lam':
                        var $3239 = self.name;
                        var $3240 = self.body;
                        var $3241 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3241;
                        break;
                    case 'Fm.Term.app':
                        var $3242 = self.func;
                        var $3243 = self.argm;
                        var $3244 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3244;
                        break;
                    case 'Fm.Term.let':
                        var $3245 = self.name;
                        var $3246 = self.expr;
                        var $3247 = self.body;
                        var $3248 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3248;
                        break;
                    case 'Fm.Term.def':
                        var $3249 = self.name;
                        var $3250 = self.expr;
                        var $3251 = self.body;
                        var $3252 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3252;
                        break;
                    case 'Fm.Term.ann':
                        var $3253 = self.done;
                        var $3254 = self.term;
                        var $3255 = self.type;
                        var $3256 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3256;
                        break;
                    case 'Fm.Term.gol':
                        var $3257 = self.name;
                        var $3258 = self.dref;
                        var $3259 = self.verb;
                        var $3260 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3260;
                        break;
                    case 'Fm.Term.hol':
                        var $3261 = self.path;
                        var $3262 = Fm$Term$equal$patch$($3261, _a$1, Unit$new);
                        var $3226 = $3262;
                        break;
                    case 'Fm.Term.nat':
                        var $3263 = self.natx;
                        var $3264 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3264;
                        break;
                    case 'Fm.Term.chr':
                        var $3265 = self.chrx;
                        var $3266 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3266;
                        break;
                    case 'Fm.Term.str':
                        var $3267 = self.strx;
                        var $3268 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3268;
                        break;
                    case 'Fm.Term.cse':
                        var $3269 = self.path;
                        var $3270 = self.expr;
                        var $3271 = self.name;
                        var $3272 = self.with;
                        var $3273 = self.cses;
                        var $3274 = self.moti;
                        var $3275 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3226 = $3275;
                        break;
                    case 'Fm.Term.ori':
                        var $3276 = self.orig;
                        var $3277 = self.expr;
                        var $3278 = Fm$Term$equal$extra_holes$(_a$1, $3277);
                        var $3226 = $3278;
                        break;
                };
                var $2723 = $3226;
                break;
            case 'Fm.Term.hol':
                var $3279 = self.path;
                var $3280 = Fm$Term$equal$patch$($3279, _b$2, Unit$new);
                var $2723 = $3280;
                break;
            case 'Fm.Term.nat':
                var $3281 = self.natx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3283 = self.name;
                        var $3284 = self.indx;
                        var $3285 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3285;
                        break;
                    case 'Fm.Term.ref':
                        var $3286 = self.name;
                        var $3287 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3287;
                        break;
                    case 'Fm.Term.typ':
                        var $3288 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3288;
                        break;
                    case 'Fm.Term.all':
                        var $3289 = self.eras;
                        var $3290 = self.self;
                        var $3291 = self.name;
                        var $3292 = self.xtyp;
                        var $3293 = self.body;
                        var $3294 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3294;
                        break;
                    case 'Fm.Term.lam':
                        var $3295 = self.name;
                        var $3296 = self.body;
                        var $3297 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3297;
                        break;
                    case 'Fm.Term.app':
                        var $3298 = self.func;
                        var $3299 = self.argm;
                        var $3300 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3300;
                        break;
                    case 'Fm.Term.let':
                        var $3301 = self.name;
                        var $3302 = self.expr;
                        var $3303 = self.body;
                        var $3304 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3304;
                        break;
                    case 'Fm.Term.def':
                        var $3305 = self.name;
                        var $3306 = self.expr;
                        var $3307 = self.body;
                        var $3308 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3308;
                        break;
                    case 'Fm.Term.ann':
                        var $3309 = self.done;
                        var $3310 = self.term;
                        var $3311 = self.type;
                        var $3312 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3312;
                        break;
                    case 'Fm.Term.gol':
                        var $3313 = self.name;
                        var $3314 = self.dref;
                        var $3315 = self.verb;
                        var $3316 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3316;
                        break;
                    case 'Fm.Term.hol':
                        var $3317 = self.path;
                        var $3318 = Fm$Term$equal$patch$($3317, _a$1, Unit$new);
                        var $3282 = $3318;
                        break;
                    case 'Fm.Term.nat':
                        var $3319 = self.natx;
                        var $3320 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3320;
                        break;
                    case 'Fm.Term.chr':
                        var $3321 = self.chrx;
                        var $3322 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3322;
                        break;
                    case 'Fm.Term.str':
                        var $3323 = self.strx;
                        var $3324 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3324;
                        break;
                    case 'Fm.Term.cse':
                        var $3325 = self.path;
                        var $3326 = self.expr;
                        var $3327 = self.name;
                        var $3328 = self.with;
                        var $3329 = self.cses;
                        var $3330 = self.moti;
                        var $3331 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3282 = $3331;
                        break;
                    case 'Fm.Term.ori':
                        var $3332 = self.orig;
                        var $3333 = self.expr;
                        var $3334 = Fm$Term$equal$extra_holes$(_a$1, $3333);
                        var $3282 = $3334;
                        break;
                };
                var $2723 = $3282;
                break;
            case 'Fm.Term.chr':
                var $3335 = self.chrx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3337 = self.name;
                        var $3338 = self.indx;
                        var $3339 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3339;
                        break;
                    case 'Fm.Term.ref':
                        var $3340 = self.name;
                        var $3341 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3341;
                        break;
                    case 'Fm.Term.typ':
                        var $3342 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3342;
                        break;
                    case 'Fm.Term.all':
                        var $3343 = self.eras;
                        var $3344 = self.self;
                        var $3345 = self.name;
                        var $3346 = self.xtyp;
                        var $3347 = self.body;
                        var $3348 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3348;
                        break;
                    case 'Fm.Term.lam':
                        var $3349 = self.name;
                        var $3350 = self.body;
                        var $3351 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3351;
                        break;
                    case 'Fm.Term.app':
                        var $3352 = self.func;
                        var $3353 = self.argm;
                        var $3354 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3354;
                        break;
                    case 'Fm.Term.let':
                        var $3355 = self.name;
                        var $3356 = self.expr;
                        var $3357 = self.body;
                        var $3358 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3358;
                        break;
                    case 'Fm.Term.def':
                        var $3359 = self.name;
                        var $3360 = self.expr;
                        var $3361 = self.body;
                        var $3362 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3362;
                        break;
                    case 'Fm.Term.ann':
                        var $3363 = self.done;
                        var $3364 = self.term;
                        var $3365 = self.type;
                        var $3366 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3366;
                        break;
                    case 'Fm.Term.gol':
                        var $3367 = self.name;
                        var $3368 = self.dref;
                        var $3369 = self.verb;
                        var $3370 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3370;
                        break;
                    case 'Fm.Term.hol':
                        var $3371 = self.path;
                        var $3372 = Fm$Term$equal$patch$($3371, _a$1, Unit$new);
                        var $3336 = $3372;
                        break;
                    case 'Fm.Term.nat':
                        var $3373 = self.natx;
                        var $3374 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3374;
                        break;
                    case 'Fm.Term.chr':
                        var $3375 = self.chrx;
                        var $3376 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3376;
                        break;
                    case 'Fm.Term.str':
                        var $3377 = self.strx;
                        var $3378 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3378;
                        break;
                    case 'Fm.Term.cse':
                        var $3379 = self.path;
                        var $3380 = self.expr;
                        var $3381 = self.name;
                        var $3382 = self.with;
                        var $3383 = self.cses;
                        var $3384 = self.moti;
                        var $3385 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3336 = $3385;
                        break;
                    case 'Fm.Term.ori':
                        var $3386 = self.orig;
                        var $3387 = self.expr;
                        var $3388 = Fm$Term$equal$extra_holes$(_a$1, $3387);
                        var $3336 = $3388;
                        break;
                };
                var $2723 = $3336;
                break;
            case 'Fm.Term.str':
                var $3389 = self.strx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3391 = self.name;
                        var $3392 = self.indx;
                        var $3393 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3393;
                        break;
                    case 'Fm.Term.ref':
                        var $3394 = self.name;
                        var $3395 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3395;
                        break;
                    case 'Fm.Term.typ':
                        var $3396 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3396;
                        break;
                    case 'Fm.Term.all':
                        var $3397 = self.eras;
                        var $3398 = self.self;
                        var $3399 = self.name;
                        var $3400 = self.xtyp;
                        var $3401 = self.body;
                        var $3402 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3402;
                        break;
                    case 'Fm.Term.lam':
                        var $3403 = self.name;
                        var $3404 = self.body;
                        var $3405 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3405;
                        break;
                    case 'Fm.Term.app':
                        var $3406 = self.func;
                        var $3407 = self.argm;
                        var $3408 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3408;
                        break;
                    case 'Fm.Term.let':
                        var $3409 = self.name;
                        var $3410 = self.expr;
                        var $3411 = self.body;
                        var $3412 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3412;
                        break;
                    case 'Fm.Term.def':
                        var $3413 = self.name;
                        var $3414 = self.expr;
                        var $3415 = self.body;
                        var $3416 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3416;
                        break;
                    case 'Fm.Term.ann':
                        var $3417 = self.done;
                        var $3418 = self.term;
                        var $3419 = self.type;
                        var $3420 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3420;
                        break;
                    case 'Fm.Term.gol':
                        var $3421 = self.name;
                        var $3422 = self.dref;
                        var $3423 = self.verb;
                        var $3424 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3424;
                        break;
                    case 'Fm.Term.hol':
                        var $3425 = self.path;
                        var $3426 = Fm$Term$equal$patch$($3425, _a$1, Unit$new);
                        var $3390 = $3426;
                        break;
                    case 'Fm.Term.nat':
                        var $3427 = self.natx;
                        var $3428 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3428;
                        break;
                    case 'Fm.Term.chr':
                        var $3429 = self.chrx;
                        var $3430 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3430;
                        break;
                    case 'Fm.Term.str':
                        var $3431 = self.strx;
                        var $3432 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3432;
                        break;
                    case 'Fm.Term.cse':
                        var $3433 = self.path;
                        var $3434 = self.expr;
                        var $3435 = self.name;
                        var $3436 = self.with;
                        var $3437 = self.cses;
                        var $3438 = self.moti;
                        var $3439 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3390 = $3439;
                        break;
                    case 'Fm.Term.ori':
                        var $3440 = self.orig;
                        var $3441 = self.expr;
                        var $3442 = Fm$Term$equal$extra_holes$(_a$1, $3441);
                        var $3390 = $3442;
                        break;
                };
                var $2723 = $3390;
                break;
            case 'Fm.Term.cse':
                var $3443 = self.path;
                var $3444 = self.expr;
                var $3445 = self.name;
                var $3446 = self.with;
                var $3447 = self.cses;
                var $3448 = self.moti;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3450 = self.name;
                        var $3451 = self.indx;
                        var $3452 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3452;
                        break;
                    case 'Fm.Term.ref':
                        var $3453 = self.name;
                        var $3454 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3454;
                        break;
                    case 'Fm.Term.typ':
                        var $3455 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3455;
                        break;
                    case 'Fm.Term.all':
                        var $3456 = self.eras;
                        var $3457 = self.self;
                        var $3458 = self.name;
                        var $3459 = self.xtyp;
                        var $3460 = self.body;
                        var $3461 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3461;
                        break;
                    case 'Fm.Term.lam':
                        var $3462 = self.name;
                        var $3463 = self.body;
                        var $3464 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3464;
                        break;
                    case 'Fm.Term.app':
                        var $3465 = self.func;
                        var $3466 = self.argm;
                        var $3467 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3467;
                        break;
                    case 'Fm.Term.let':
                        var $3468 = self.name;
                        var $3469 = self.expr;
                        var $3470 = self.body;
                        var $3471 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3471;
                        break;
                    case 'Fm.Term.def':
                        var $3472 = self.name;
                        var $3473 = self.expr;
                        var $3474 = self.body;
                        var $3475 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3475;
                        break;
                    case 'Fm.Term.ann':
                        var $3476 = self.done;
                        var $3477 = self.term;
                        var $3478 = self.type;
                        var $3479 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3479;
                        break;
                    case 'Fm.Term.gol':
                        var $3480 = self.name;
                        var $3481 = self.dref;
                        var $3482 = self.verb;
                        var $3483 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3483;
                        break;
                    case 'Fm.Term.hol':
                        var $3484 = self.path;
                        var $3485 = Fm$Term$equal$patch$($3484, _a$1, Unit$new);
                        var $3449 = $3485;
                        break;
                    case 'Fm.Term.nat':
                        var $3486 = self.natx;
                        var $3487 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3487;
                        break;
                    case 'Fm.Term.chr':
                        var $3488 = self.chrx;
                        var $3489 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3489;
                        break;
                    case 'Fm.Term.str':
                        var $3490 = self.strx;
                        var $3491 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3491;
                        break;
                    case 'Fm.Term.cse':
                        var $3492 = self.path;
                        var $3493 = self.expr;
                        var $3494 = self.name;
                        var $3495 = self.with;
                        var $3496 = self.cses;
                        var $3497 = self.moti;
                        var $3498 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3449 = $3498;
                        break;
                    case 'Fm.Term.ori':
                        var $3499 = self.orig;
                        var $3500 = self.expr;
                        var $3501 = Fm$Term$equal$extra_holes$(_a$1, $3500);
                        var $3449 = $3501;
                        break;
                };
                var $2723 = $3449;
                break;
            case 'Fm.Term.ori':
                var $3502 = self.orig;
                var $3503 = self.expr;
                var $3504 = Fm$Term$equal$extra_holes$($3503, _b$2);
                var $2723 = $3504;
                break;
        };
        return $2723;
    };
    const Fm$Term$equal$extra_holes = x0 => x1 => Fm$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $3505 = Map$set$(_bits$1, Unit$new, _set$2);
        return $3505;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $3507 = _b$2;
            var $3506 = $3507;
        } else {
            var $3508 = (!_b$2);
            var $3506 = $3508;
        };
        return $3506;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Fm$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Fm$Term$serialize$(Fm$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$e);
        var _bh$7 = Fm$Term$serialize$(Fm$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $3510 = Monad$pure$(Fm$Check$monad)(Bool$true);
            var $3509 = $3510;
        } else {
            var _a1$8 = Fm$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Fm$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Fm$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$e);
            var _bh$11 = Fm$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $3512 = Monad$pure$(Fm$Check$monad)(Bool$true);
                var $3511 = $3512;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = Set$has$(_id$12, _seen$5);
                if (self) {
                    var $3514 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$(_a$1, _b$2))((_$13 => {
                        var $3515 = Monad$pure$(Fm$Check$monad)(Bool$true);
                        return $3515;
                    }));
                    var $3513 = $3514;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Fm.Term.var':
                            var $3517 = self.name;
                            var $3518 = self.indx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3520 = self.name;
                                    var $3521 = self.indx;
                                    var $3522 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3522;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3523 = self.name;
                                    var $3524 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3524;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3525 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3525;
                                    break;
                                case 'Fm.Term.all':
                                    var $3526 = self.eras;
                                    var $3527 = self.self;
                                    var $3528 = self.name;
                                    var $3529 = self.xtyp;
                                    var $3530 = self.body;
                                    var $3531 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3531;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3532 = self.name;
                                    var $3533 = self.body;
                                    var $3534 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3534;
                                    break;
                                case 'Fm.Term.app':
                                    var $3535 = self.func;
                                    var $3536 = self.argm;
                                    var $3537 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3537;
                                    break;
                                case 'Fm.Term.let':
                                    var $3538 = self.name;
                                    var $3539 = self.expr;
                                    var $3540 = self.body;
                                    var $3541 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3541;
                                    break;
                                case 'Fm.Term.def':
                                    var $3542 = self.name;
                                    var $3543 = self.expr;
                                    var $3544 = self.body;
                                    var $3545 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3545;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3546 = self.done;
                                    var $3547 = self.term;
                                    var $3548 = self.type;
                                    var $3549 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3549;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3550 = self.name;
                                    var $3551 = self.dref;
                                    var $3552 = self.verb;
                                    var $3553 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3553;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3554 = self.path;
                                    var $3555 = Fm$Term$equal$patch$($3554, _a$1, Bool$true);
                                    var $3519 = $3555;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3556 = self.natx;
                                    var $3557 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3557;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3558 = self.chrx;
                                    var $3559 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3559;
                                    break;
                                case 'Fm.Term.str':
                                    var $3560 = self.strx;
                                    var $3561 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3561;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3562 = self.path;
                                    var $3563 = self.expr;
                                    var $3564 = self.name;
                                    var $3565 = self.with;
                                    var $3566 = self.cses;
                                    var $3567 = self.moti;
                                    var $3568 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3568;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3569 = self.orig;
                                    var $3570 = self.expr;
                                    var $3571 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3519 = $3571;
                                    break;
                            };
                            var $3516 = $3519;
                            break;
                        case 'Fm.Term.ref':
                            var $3572 = self.name;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3574 = self.name;
                                    var $3575 = self.indx;
                                    var $3576 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3576;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3577 = self.name;
                                    var $3578 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3578;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3579 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3579;
                                    break;
                                case 'Fm.Term.all':
                                    var $3580 = self.eras;
                                    var $3581 = self.self;
                                    var $3582 = self.name;
                                    var $3583 = self.xtyp;
                                    var $3584 = self.body;
                                    var $3585 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3585;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3586 = self.name;
                                    var $3587 = self.body;
                                    var $3588 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3588;
                                    break;
                                case 'Fm.Term.app':
                                    var $3589 = self.func;
                                    var $3590 = self.argm;
                                    var $3591 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3591;
                                    break;
                                case 'Fm.Term.let':
                                    var $3592 = self.name;
                                    var $3593 = self.expr;
                                    var $3594 = self.body;
                                    var $3595 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3595;
                                    break;
                                case 'Fm.Term.def':
                                    var $3596 = self.name;
                                    var $3597 = self.expr;
                                    var $3598 = self.body;
                                    var $3599 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3599;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3600 = self.done;
                                    var $3601 = self.term;
                                    var $3602 = self.type;
                                    var $3603 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3603;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3604 = self.name;
                                    var $3605 = self.dref;
                                    var $3606 = self.verb;
                                    var $3607 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3607;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3608 = self.path;
                                    var $3609 = Fm$Term$equal$patch$($3608, _a$1, Bool$true);
                                    var $3573 = $3609;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3610 = self.natx;
                                    var $3611 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3611;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3612 = self.chrx;
                                    var $3613 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3613;
                                    break;
                                case 'Fm.Term.str':
                                    var $3614 = self.strx;
                                    var $3615 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3615;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3616 = self.path;
                                    var $3617 = self.expr;
                                    var $3618 = self.name;
                                    var $3619 = self.with;
                                    var $3620 = self.cses;
                                    var $3621 = self.moti;
                                    var $3622 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3622;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3623 = self.orig;
                                    var $3624 = self.expr;
                                    var $3625 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3573 = $3625;
                                    break;
                            };
                            var $3516 = $3573;
                            break;
                        case 'Fm.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3627 = self.name;
                                    var $3628 = self.indx;
                                    var $3629 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3629;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3630 = self.name;
                                    var $3631 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3631;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3632 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3632;
                                    break;
                                case 'Fm.Term.all':
                                    var $3633 = self.eras;
                                    var $3634 = self.self;
                                    var $3635 = self.name;
                                    var $3636 = self.xtyp;
                                    var $3637 = self.body;
                                    var $3638 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3638;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3639 = self.name;
                                    var $3640 = self.body;
                                    var $3641 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3641;
                                    break;
                                case 'Fm.Term.app':
                                    var $3642 = self.func;
                                    var $3643 = self.argm;
                                    var $3644 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3644;
                                    break;
                                case 'Fm.Term.let':
                                    var $3645 = self.name;
                                    var $3646 = self.expr;
                                    var $3647 = self.body;
                                    var $3648 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3648;
                                    break;
                                case 'Fm.Term.def':
                                    var $3649 = self.name;
                                    var $3650 = self.expr;
                                    var $3651 = self.body;
                                    var $3652 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3652;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3653 = self.done;
                                    var $3654 = self.term;
                                    var $3655 = self.type;
                                    var $3656 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3656;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3657 = self.name;
                                    var $3658 = self.dref;
                                    var $3659 = self.verb;
                                    var $3660 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3660;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3661 = self.path;
                                    var $3662 = Fm$Term$equal$patch$($3661, _a$1, Bool$true);
                                    var $3626 = $3662;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3663 = self.natx;
                                    var $3664 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3664;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3665 = self.chrx;
                                    var $3666 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3666;
                                    break;
                                case 'Fm.Term.str':
                                    var $3667 = self.strx;
                                    var $3668 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3668;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3669 = self.path;
                                    var $3670 = self.expr;
                                    var $3671 = self.name;
                                    var $3672 = self.with;
                                    var $3673 = self.cses;
                                    var $3674 = self.moti;
                                    var $3675 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3675;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3676 = self.orig;
                                    var $3677 = self.expr;
                                    var $3678 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3626 = $3678;
                                    break;
                            };
                            var $3516 = $3626;
                            break;
                        case 'Fm.Term.all':
                            var $3679 = self.eras;
                            var $3680 = self.self;
                            var $3681 = self.name;
                            var $3682 = self.xtyp;
                            var $3683 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3685 = self.name;
                                    var $3686 = self.indx;
                                    var $3687 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3687;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3688 = self.name;
                                    var $3689 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3689;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3690 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3690;
                                    break;
                                case 'Fm.Term.all':
                                    var $3691 = self.eras;
                                    var $3692 = self.self;
                                    var $3693 = self.name;
                                    var $3694 = self.xtyp;
                                    var $3695 = self.body;
                                    var _seen$23 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$24 = $3683(Fm$Term$var$($3680, _lv$4))(Fm$Term$var$($3681, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $3695(Fm$Term$var$($3692, _lv$4))(Fm$Term$var$($3693, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($3680 === $3692);
                                    var _eq_eras$27 = Bool$eql$($3679, $3691);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var $3697 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3682, $3694, _defs$3, _lv$4, _seen$23))((_eq_type$28 => {
                                            var $3698 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23))((_eq_body$29 => {
                                                var $3699 = Monad$pure$(Fm$Check$monad)((_eq_type$28 && _eq_body$29));
                                                return $3699;
                                            }));
                                            return $3698;
                                        }));
                                        var $3696 = $3697;
                                    } else {
                                        var $3700 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                        var $3696 = $3700;
                                    };
                                    var $3684 = $3696;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3701 = self.name;
                                    var $3702 = self.body;
                                    var $3703 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3703;
                                    break;
                                case 'Fm.Term.app':
                                    var $3704 = self.func;
                                    var $3705 = self.argm;
                                    var $3706 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3706;
                                    break;
                                case 'Fm.Term.let':
                                    var $3707 = self.name;
                                    var $3708 = self.expr;
                                    var $3709 = self.body;
                                    var $3710 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3710;
                                    break;
                                case 'Fm.Term.def':
                                    var $3711 = self.name;
                                    var $3712 = self.expr;
                                    var $3713 = self.body;
                                    var $3714 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3714;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3715 = self.done;
                                    var $3716 = self.term;
                                    var $3717 = self.type;
                                    var $3718 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3718;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3719 = self.name;
                                    var $3720 = self.dref;
                                    var $3721 = self.verb;
                                    var $3722 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3722;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3723 = self.path;
                                    var $3724 = Fm$Term$equal$patch$($3723, _a$1, Bool$true);
                                    var $3684 = $3724;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3725 = self.natx;
                                    var $3726 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3726;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3727 = self.chrx;
                                    var $3728 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3728;
                                    break;
                                case 'Fm.Term.str':
                                    var $3729 = self.strx;
                                    var $3730 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3730;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3731 = self.path;
                                    var $3732 = self.expr;
                                    var $3733 = self.name;
                                    var $3734 = self.with;
                                    var $3735 = self.cses;
                                    var $3736 = self.moti;
                                    var $3737 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3737;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3738 = self.orig;
                                    var $3739 = self.expr;
                                    var $3740 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3684 = $3740;
                                    break;
                            };
                            var $3516 = $3684;
                            break;
                        case 'Fm.Term.lam':
                            var $3741 = self.name;
                            var $3742 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3744 = self.name;
                                    var $3745 = self.indx;
                                    var $3746 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3746;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3747 = self.name;
                                    var $3748 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3748;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3749 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3749;
                                    break;
                                case 'Fm.Term.all':
                                    var $3750 = self.eras;
                                    var $3751 = self.self;
                                    var $3752 = self.name;
                                    var $3753 = self.xtyp;
                                    var $3754 = self.body;
                                    var $3755 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3755;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3756 = self.name;
                                    var $3757 = self.body;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$18 = $3742(Fm$Term$var$($3741, _lv$4));
                                    var _b1_body$19 = $3757(Fm$Term$var$($3756, _lv$4));
                                    var $3758 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17))((_eq_body$20 => {
                                        var $3759 = Monad$pure$(Fm$Check$monad)(_eq_body$20);
                                        return $3759;
                                    }));
                                    var $3743 = $3758;
                                    break;
                                case 'Fm.Term.app':
                                    var $3760 = self.func;
                                    var $3761 = self.argm;
                                    var $3762 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3762;
                                    break;
                                case 'Fm.Term.let':
                                    var $3763 = self.name;
                                    var $3764 = self.expr;
                                    var $3765 = self.body;
                                    var $3766 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3766;
                                    break;
                                case 'Fm.Term.def':
                                    var $3767 = self.name;
                                    var $3768 = self.expr;
                                    var $3769 = self.body;
                                    var $3770 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3770;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3771 = self.done;
                                    var $3772 = self.term;
                                    var $3773 = self.type;
                                    var $3774 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3774;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3775 = self.name;
                                    var $3776 = self.dref;
                                    var $3777 = self.verb;
                                    var $3778 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3778;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3779 = self.path;
                                    var $3780 = Fm$Term$equal$patch$($3779, _a$1, Bool$true);
                                    var $3743 = $3780;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3781 = self.natx;
                                    var $3782 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3782;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3783 = self.chrx;
                                    var $3784 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3784;
                                    break;
                                case 'Fm.Term.str':
                                    var $3785 = self.strx;
                                    var $3786 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3786;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3787 = self.path;
                                    var $3788 = self.expr;
                                    var $3789 = self.name;
                                    var $3790 = self.with;
                                    var $3791 = self.cses;
                                    var $3792 = self.moti;
                                    var $3793 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3793;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3794 = self.orig;
                                    var $3795 = self.expr;
                                    var $3796 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3743 = $3796;
                                    break;
                            };
                            var $3516 = $3743;
                            break;
                        case 'Fm.Term.app':
                            var $3797 = self.func;
                            var $3798 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3800 = self.name;
                                    var $3801 = self.indx;
                                    var $3802 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3802;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3803 = self.name;
                                    var $3804 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3804;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3805 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3805;
                                    break;
                                case 'Fm.Term.all':
                                    var $3806 = self.eras;
                                    var $3807 = self.self;
                                    var $3808 = self.name;
                                    var $3809 = self.xtyp;
                                    var $3810 = self.body;
                                    var $3811 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3811;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3812 = self.name;
                                    var $3813 = self.body;
                                    var $3814 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3814;
                                    break;
                                case 'Fm.Term.app':
                                    var $3815 = self.func;
                                    var $3816 = self.argm;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var $3817 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3797, $3815, _defs$3, _lv$4, _seen$17))((_eq_func$18 => {
                                        var $3818 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3798, $3816, _defs$3, _lv$4, _seen$17))((_eq_argm$19 => {
                                            var $3819 = Monad$pure$(Fm$Check$monad)((_eq_func$18 && _eq_argm$19));
                                            return $3819;
                                        }));
                                        return $3818;
                                    }));
                                    var $3799 = $3817;
                                    break;
                                case 'Fm.Term.let':
                                    var $3820 = self.name;
                                    var $3821 = self.expr;
                                    var $3822 = self.body;
                                    var $3823 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3823;
                                    break;
                                case 'Fm.Term.def':
                                    var $3824 = self.name;
                                    var $3825 = self.expr;
                                    var $3826 = self.body;
                                    var $3827 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3827;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3828 = self.done;
                                    var $3829 = self.term;
                                    var $3830 = self.type;
                                    var $3831 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3831;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3832 = self.name;
                                    var $3833 = self.dref;
                                    var $3834 = self.verb;
                                    var $3835 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3835;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3836 = self.path;
                                    var $3837 = Fm$Term$equal$patch$($3836, _a$1, Bool$true);
                                    var $3799 = $3837;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3838 = self.natx;
                                    var $3839 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3839;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3840 = self.chrx;
                                    var $3841 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3841;
                                    break;
                                case 'Fm.Term.str':
                                    var $3842 = self.strx;
                                    var $3843 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3843;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3844 = self.path;
                                    var $3845 = self.expr;
                                    var $3846 = self.name;
                                    var $3847 = self.with;
                                    var $3848 = self.cses;
                                    var $3849 = self.moti;
                                    var $3850 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3850;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3851 = self.orig;
                                    var $3852 = self.expr;
                                    var $3853 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3799 = $3853;
                                    break;
                            };
                            var $3516 = $3799;
                            break;
                        case 'Fm.Term.let':
                            var $3854 = self.name;
                            var $3855 = self.expr;
                            var $3856 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3858 = self.name;
                                    var $3859 = self.indx;
                                    var $3860 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3860;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3861 = self.name;
                                    var $3862 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3862;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3863 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3863;
                                    break;
                                case 'Fm.Term.all':
                                    var $3864 = self.eras;
                                    var $3865 = self.self;
                                    var $3866 = self.name;
                                    var $3867 = self.xtyp;
                                    var $3868 = self.body;
                                    var $3869 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3869;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3870 = self.name;
                                    var $3871 = self.body;
                                    var $3872 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3872;
                                    break;
                                case 'Fm.Term.app':
                                    var $3873 = self.func;
                                    var $3874 = self.argm;
                                    var $3875 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3875;
                                    break;
                                case 'Fm.Term.let':
                                    var $3876 = self.name;
                                    var $3877 = self.expr;
                                    var $3878 = self.body;
                                    var _seen$19 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$20 = $3856(Fm$Term$var$($3854, _lv$4));
                                    var _b1_body$21 = $3878(Fm$Term$var$($3876, _lv$4));
                                    var $3879 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3855, $3877, _defs$3, _lv$4, _seen$19))((_eq_expr$22 => {
                                        var $3880 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19))((_eq_body$23 => {
                                            var $3881 = Monad$pure$(Fm$Check$monad)((_eq_expr$22 && _eq_body$23));
                                            return $3881;
                                        }));
                                        return $3880;
                                    }));
                                    var $3857 = $3879;
                                    break;
                                case 'Fm.Term.def':
                                    var $3882 = self.name;
                                    var $3883 = self.expr;
                                    var $3884 = self.body;
                                    var $3885 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3885;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3886 = self.done;
                                    var $3887 = self.term;
                                    var $3888 = self.type;
                                    var $3889 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3889;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3890 = self.name;
                                    var $3891 = self.dref;
                                    var $3892 = self.verb;
                                    var $3893 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3893;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3894 = self.path;
                                    var $3895 = Fm$Term$equal$patch$($3894, _a$1, Bool$true);
                                    var $3857 = $3895;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3896 = self.natx;
                                    var $3897 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3897;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3898 = self.chrx;
                                    var $3899 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3899;
                                    break;
                                case 'Fm.Term.str':
                                    var $3900 = self.strx;
                                    var $3901 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3901;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3902 = self.path;
                                    var $3903 = self.expr;
                                    var $3904 = self.name;
                                    var $3905 = self.with;
                                    var $3906 = self.cses;
                                    var $3907 = self.moti;
                                    var $3908 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3908;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3909 = self.orig;
                                    var $3910 = self.expr;
                                    var $3911 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3857 = $3911;
                                    break;
                            };
                            var $3516 = $3857;
                            break;
                        case 'Fm.Term.def':
                            var $3912 = self.name;
                            var $3913 = self.expr;
                            var $3914 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3916 = self.name;
                                    var $3917 = self.indx;
                                    var $3918 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3918;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3919 = self.name;
                                    var $3920 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3920;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3921 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3921;
                                    break;
                                case 'Fm.Term.all':
                                    var $3922 = self.eras;
                                    var $3923 = self.self;
                                    var $3924 = self.name;
                                    var $3925 = self.xtyp;
                                    var $3926 = self.body;
                                    var $3927 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3927;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3928 = self.name;
                                    var $3929 = self.body;
                                    var $3930 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3930;
                                    break;
                                case 'Fm.Term.app':
                                    var $3931 = self.func;
                                    var $3932 = self.argm;
                                    var $3933 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3933;
                                    break;
                                case 'Fm.Term.let':
                                    var $3934 = self.name;
                                    var $3935 = self.expr;
                                    var $3936 = self.body;
                                    var $3937 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3937;
                                    break;
                                case 'Fm.Term.def':
                                    var $3938 = self.name;
                                    var $3939 = self.expr;
                                    var $3940 = self.body;
                                    var $3941 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3941;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3942 = self.done;
                                    var $3943 = self.term;
                                    var $3944 = self.type;
                                    var $3945 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3945;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3946 = self.name;
                                    var $3947 = self.dref;
                                    var $3948 = self.verb;
                                    var $3949 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3949;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3950 = self.path;
                                    var $3951 = Fm$Term$equal$patch$($3950, _a$1, Bool$true);
                                    var $3915 = $3951;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3952 = self.natx;
                                    var $3953 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3953;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3954 = self.chrx;
                                    var $3955 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3955;
                                    break;
                                case 'Fm.Term.str':
                                    var $3956 = self.strx;
                                    var $3957 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3957;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3958 = self.path;
                                    var $3959 = self.expr;
                                    var $3960 = self.name;
                                    var $3961 = self.with;
                                    var $3962 = self.cses;
                                    var $3963 = self.moti;
                                    var $3964 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3964;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3965 = self.orig;
                                    var $3966 = self.expr;
                                    var $3967 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3915 = $3967;
                                    break;
                            };
                            var $3516 = $3915;
                            break;
                        case 'Fm.Term.ann':
                            var $3968 = self.done;
                            var $3969 = self.term;
                            var $3970 = self.type;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3972 = self.name;
                                    var $3973 = self.indx;
                                    var $3974 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $3974;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3975 = self.name;
                                    var $3976 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $3976;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3977 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $3977;
                                    break;
                                case 'Fm.Term.all':
                                    var $3978 = self.eras;
                                    var $3979 = self.self;
                                    var $3980 = self.name;
                                    var $3981 = self.xtyp;
                                    var $3982 = self.body;
                                    var $3983 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $3983;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3984 = self.name;
                                    var $3985 = self.body;
                                    var $3986 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $3986;
                                    break;
                                case 'Fm.Term.app':
                                    var $3987 = self.func;
                                    var $3988 = self.argm;
                                    var $3989 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $3989;
                                    break;
                                case 'Fm.Term.let':
                                    var $3990 = self.name;
                                    var $3991 = self.expr;
                                    var $3992 = self.body;
                                    var $3993 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $3993;
                                    break;
                                case 'Fm.Term.def':
                                    var $3994 = self.name;
                                    var $3995 = self.expr;
                                    var $3996 = self.body;
                                    var $3997 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $3997;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3998 = self.done;
                                    var $3999 = self.term;
                                    var $4000 = self.type;
                                    var $4001 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $4001;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4002 = self.name;
                                    var $4003 = self.dref;
                                    var $4004 = self.verb;
                                    var $4005 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $4005;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4006 = self.path;
                                    var $4007 = Fm$Term$equal$patch$($4006, _a$1, Bool$true);
                                    var $3971 = $4007;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4008 = self.natx;
                                    var $4009 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $4009;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4010 = self.chrx;
                                    var $4011 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $4011;
                                    break;
                                case 'Fm.Term.str':
                                    var $4012 = self.strx;
                                    var $4013 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $4013;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4014 = self.path;
                                    var $4015 = self.expr;
                                    var $4016 = self.name;
                                    var $4017 = self.with;
                                    var $4018 = self.cses;
                                    var $4019 = self.moti;
                                    var $4020 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $4020;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4021 = self.orig;
                                    var $4022 = self.expr;
                                    var $4023 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3971 = $4023;
                                    break;
                            };
                            var $3516 = $3971;
                            break;
                        case 'Fm.Term.gol':
                            var $4024 = self.name;
                            var $4025 = self.dref;
                            var $4026 = self.verb;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4028 = self.name;
                                    var $4029 = self.indx;
                                    var $4030 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4030;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4031 = self.name;
                                    var $4032 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4032;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4033 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4033;
                                    break;
                                case 'Fm.Term.all':
                                    var $4034 = self.eras;
                                    var $4035 = self.self;
                                    var $4036 = self.name;
                                    var $4037 = self.xtyp;
                                    var $4038 = self.body;
                                    var $4039 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4039;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4040 = self.name;
                                    var $4041 = self.body;
                                    var $4042 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4042;
                                    break;
                                case 'Fm.Term.app':
                                    var $4043 = self.func;
                                    var $4044 = self.argm;
                                    var $4045 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4045;
                                    break;
                                case 'Fm.Term.let':
                                    var $4046 = self.name;
                                    var $4047 = self.expr;
                                    var $4048 = self.body;
                                    var $4049 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4049;
                                    break;
                                case 'Fm.Term.def':
                                    var $4050 = self.name;
                                    var $4051 = self.expr;
                                    var $4052 = self.body;
                                    var $4053 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4053;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4054 = self.done;
                                    var $4055 = self.term;
                                    var $4056 = self.type;
                                    var $4057 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4057;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4058 = self.name;
                                    var $4059 = self.dref;
                                    var $4060 = self.verb;
                                    var $4061 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4061;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4062 = self.path;
                                    var $4063 = Fm$Term$equal$patch$($4062, _a$1, Bool$true);
                                    var $4027 = $4063;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4064 = self.natx;
                                    var $4065 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4065;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4066 = self.chrx;
                                    var $4067 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4067;
                                    break;
                                case 'Fm.Term.str':
                                    var $4068 = self.strx;
                                    var $4069 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4069;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4070 = self.path;
                                    var $4071 = self.expr;
                                    var $4072 = self.name;
                                    var $4073 = self.with;
                                    var $4074 = self.cses;
                                    var $4075 = self.moti;
                                    var $4076 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4076;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4077 = self.orig;
                                    var $4078 = self.expr;
                                    var $4079 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4027 = $4079;
                                    break;
                            };
                            var $3516 = $4027;
                            break;
                        case 'Fm.Term.hol':
                            var $4080 = self.path;
                            var $4081 = Fm$Term$equal$patch$($4080, _b$2, Bool$true);
                            var $3516 = $4081;
                            break;
                        case 'Fm.Term.nat':
                            var $4082 = self.natx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4084 = self.name;
                                    var $4085 = self.indx;
                                    var $4086 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4086;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4087 = self.name;
                                    var $4088 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4088;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4089 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4089;
                                    break;
                                case 'Fm.Term.all':
                                    var $4090 = self.eras;
                                    var $4091 = self.self;
                                    var $4092 = self.name;
                                    var $4093 = self.xtyp;
                                    var $4094 = self.body;
                                    var $4095 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4095;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4096 = self.name;
                                    var $4097 = self.body;
                                    var $4098 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4098;
                                    break;
                                case 'Fm.Term.app':
                                    var $4099 = self.func;
                                    var $4100 = self.argm;
                                    var $4101 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4101;
                                    break;
                                case 'Fm.Term.let':
                                    var $4102 = self.name;
                                    var $4103 = self.expr;
                                    var $4104 = self.body;
                                    var $4105 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4105;
                                    break;
                                case 'Fm.Term.def':
                                    var $4106 = self.name;
                                    var $4107 = self.expr;
                                    var $4108 = self.body;
                                    var $4109 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4109;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4110 = self.done;
                                    var $4111 = self.term;
                                    var $4112 = self.type;
                                    var $4113 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4113;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4114 = self.name;
                                    var $4115 = self.dref;
                                    var $4116 = self.verb;
                                    var $4117 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4117;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4118 = self.path;
                                    var $4119 = Fm$Term$equal$patch$($4118, _a$1, Bool$true);
                                    var $4083 = $4119;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4120 = self.natx;
                                    var $4121 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4121;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4122 = self.chrx;
                                    var $4123 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4123;
                                    break;
                                case 'Fm.Term.str':
                                    var $4124 = self.strx;
                                    var $4125 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4125;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4126 = self.path;
                                    var $4127 = self.expr;
                                    var $4128 = self.name;
                                    var $4129 = self.with;
                                    var $4130 = self.cses;
                                    var $4131 = self.moti;
                                    var $4132 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4132;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4133 = self.orig;
                                    var $4134 = self.expr;
                                    var $4135 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4083 = $4135;
                                    break;
                            };
                            var $3516 = $4083;
                            break;
                        case 'Fm.Term.chr':
                            var $4136 = self.chrx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4138 = self.name;
                                    var $4139 = self.indx;
                                    var $4140 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4140;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4141 = self.name;
                                    var $4142 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4142;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4143 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4143;
                                    break;
                                case 'Fm.Term.all':
                                    var $4144 = self.eras;
                                    var $4145 = self.self;
                                    var $4146 = self.name;
                                    var $4147 = self.xtyp;
                                    var $4148 = self.body;
                                    var $4149 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4149;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4150 = self.name;
                                    var $4151 = self.body;
                                    var $4152 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4152;
                                    break;
                                case 'Fm.Term.app':
                                    var $4153 = self.func;
                                    var $4154 = self.argm;
                                    var $4155 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4155;
                                    break;
                                case 'Fm.Term.let':
                                    var $4156 = self.name;
                                    var $4157 = self.expr;
                                    var $4158 = self.body;
                                    var $4159 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4159;
                                    break;
                                case 'Fm.Term.def':
                                    var $4160 = self.name;
                                    var $4161 = self.expr;
                                    var $4162 = self.body;
                                    var $4163 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4163;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4164 = self.done;
                                    var $4165 = self.term;
                                    var $4166 = self.type;
                                    var $4167 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4167;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4168 = self.name;
                                    var $4169 = self.dref;
                                    var $4170 = self.verb;
                                    var $4171 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4171;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4172 = self.path;
                                    var $4173 = Fm$Term$equal$patch$($4172, _a$1, Bool$true);
                                    var $4137 = $4173;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4174 = self.natx;
                                    var $4175 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4175;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4176 = self.chrx;
                                    var $4177 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4177;
                                    break;
                                case 'Fm.Term.str':
                                    var $4178 = self.strx;
                                    var $4179 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4179;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4180 = self.path;
                                    var $4181 = self.expr;
                                    var $4182 = self.name;
                                    var $4183 = self.with;
                                    var $4184 = self.cses;
                                    var $4185 = self.moti;
                                    var $4186 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4186;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4187 = self.orig;
                                    var $4188 = self.expr;
                                    var $4189 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4137 = $4189;
                                    break;
                            };
                            var $3516 = $4137;
                            break;
                        case 'Fm.Term.str':
                            var $4190 = self.strx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4192 = self.name;
                                    var $4193 = self.indx;
                                    var $4194 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4194;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4195 = self.name;
                                    var $4196 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4196;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4197 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4197;
                                    break;
                                case 'Fm.Term.all':
                                    var $4198 = self.eras;
                                    var $4199 = self.self;
                                    var $4200 = self.name;
                                    var $4201 = self.xtyp;
                                    var $4202 = self.body;
                                    var $4203 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4203;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4204 = self.name;
                                    var $4205 = self.body;
                                    var $4206 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4206;
                                    break;
                                case 'Fm.Term.app':
                                    var $4207 = self.func;
                                    var $4208 = self.argm;
                                    var $4209 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4209;
                                    break;
                                case 'Fm.Term.let':
                                    var $4210 = self.name;
                                    var $4211 = self.expr;
                                    var $4212 = self.body;
                                    var $4213 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4213;
                                    break;
                                case 'Fm.Term.def':
                                    var $4214 = self.name;
                                    var $4215 = self.expr;
                                    var $4216 = self.body;
                                    var $4217 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4217;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4218 = self.done;
                                    var $4219 = self.term;
                                    var $4220 = self.type;
                                    var $4221 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4221;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4222 = self.name;
                                    var $4223 = self.dref;
                                    var $4224 = self.verb;
                                    var $4225 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4225;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4226 = self.path;
                                    var $4227 = Fm$Term$equal$patch$($4226, _a$1, Bool$true);
                                    var $4191 = $4227;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4228 = self.natx;
                                    var $4229 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4229;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4230 = self.chrx;
                                    var $4231 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4231;
                                    break;
                                case 'Fm.Term.str':
                                    var $4232 = self.strx;
                                    var $4233 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4233;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4234 = self.path;
                                    var $4235 = self.expr;
                                    var $4236 = self.name;
                                    var $4237 = self.with;
                                    var $4238 = self.cses;
                                    var $4239 = self.moti;
                                    var $4240 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4240;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4241 = self.orig;
                                    var $4242 = self.expr;
                                    var $4243 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4191 = $4243;
                                    break;
                            };
                            var $3516 = $4191;
                            break;
                        case 'Fm.Term.cse':
                            var $4244 = self.path;
                            var $4245 = self.expr;
                            var $4246 = self.name;
                            var $4247 = self.with;
                            var $4248 = self.cses;
                            var $4249 = self.moti;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4251 = self.name;
                                    var $4252 = self.indx;
                                    var $4253 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4253;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4254 = self.name;
                                    var $4255 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4255;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4256 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4256;
                                    break;
                                case 'Fm.Term.all':
                                    var $4257 = self.eras;
                                    var $4258 = self.self;
                                    var $4259 = self.name;
                                    var $4260 = self.xtyp;
                                    var $4261 = self.body;
                                    var $4262 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4262;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4263 = self.name;
                                    var $4264 = self.body;
                                    var $4265 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4265;
                                    break;
                                case 'Fm.Term.app':
                                    var $4266 = self.func;
                                    var $4267 = self.argm;
                                    var $4268 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4268;
                                    break;
                                case 'Fm.Term.let':
                                    var $4269 = self.name;
                                    var $4270 = self.expr;
                                    var $4271 = self.body;
                                    var $4272 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4272;
                                    break;
                                case 'Fm.Term.def':
                                    var $4273 = self.name;
                                    var $4274 = self.expr;
                                    var $4275 = self.body;
                                    var $4276 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4276;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4277 = self.done;
                                    var $4278 = self.term;
                                    var $4279 = self.type;
                                    var $4280 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4280;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4281 = self.name;
                                    var $4282 = self.dref;
                                    var $4283 = self.verb;
                                    var $4284 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4284;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4285 = self.path;
                                    var $4286 = Fm$Term$equal$patch$($4285, _a$1, Bool$true);
                                    var $4250 = $4286;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4287 = self.natx;
                                    var $4288 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4288;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4289 = self.chrx;
                                    var $4290 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4290;
                                    break;
                                case 'Fm.Term.str':
                                    var $4291 = self.strx;
                                    var $4292 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4292;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4293 = self.path;
                                    var $4294 = self.expr;
                                    var $4295 = self.name;
                                    var $4296 = self.with;
                                    var $4297 = self.cses;
                                    var $4298 = self.moti;
                                    var $4299 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4299;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4300 = self.orig;
                                    var $4301 = self.expr;
                                    var $4302 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4250 = $4302;
                                    break;
                            };
                            var $3516 = $4250;
                            break;
                        case 'Fm.Term.ori':
                            var $4303 = self.orig;
                            var $4304 = self.expr;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4306 = self.name;
                                    var $4307 = self.indx;
                                    var $4308 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4308;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4309 = self.name;
                                    var $4310 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4310;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4311 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4311;
                                    break;
                                case 'Fm.Term.all':
                                    var $4312 = self.eras;
                                    var $4313 = self.self;
                                    var $4314 = self.name;
                                    var $4315 = self.xtyp;
                                    var $4316 = self.body;
                                    var $4317 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4317;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4318 = self.name;
                                    var $4319 = self.body;
                                    var $4320 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4320;
                                    break;
                                case 'Fm.Term.app':
                                    var $4321 = self.func;
                                    var $4322 = self.argm;
                                    var $4323 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4323;
                                    break;
                                case 'Fm.Term.let':
                                    var $4324 = self.name;
                                    var $4325 = self.expr;
                                    var $4326 = self.body;
                                    var $4327 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4327;
                                    break;
                                case 'Fm.Term.def':
                                    var $4328 = self.name;
                                    var $4329 = self.expr;
                                    var $4330 = self.body;
                                    var $4331 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4331;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4332 = self.done;
                                    var $4333 = self.term;
                                    var $4334 = self.type;
                                    var $4335 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4335;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4336 = self.name;
                                    var $4337 = self.dref;
                                    var $4338 = self.verb;
                                    var $4339 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4339;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4340 = self.path;
                                    var $4341 = Fm$Term$equal$patch$($4340, _a$1, Bool$true);
                                    var $4305 = $4341;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4342 = self.natx;
                                    var $4343 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4343;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4344 = self.chrx;
                                    var $4345 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4345;
                                    break;
                                case 'Fm.Term.str':
                                    var $4346 = self.strx;
                                    var $4347 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4347;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4348 = self.path;
                                    var $4349 = self.expr;
                                    var $4350 = self.name;
                                    var $4351 = self.with;
                                    var $4352 = self.cses;
                                    var $4353 = self.moti;
                                    var $4354 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4354;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4355 = self.orig;
                                    var $4356 = self.expr;
                                    var $4357 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4305 = $4357;
                                    break;
                            };
                            var $3516 = $4305;
                            break;
                    };
                    var $3513 = $3516;
                };
                var $3511 = $3513;
            };
            var $3509 = $3511;
        };
        return $3509;
    };
    const Fm$Term$equal = x0 => x1 => x2 => x3 => x4 => Fm$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;

    function Fm$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var $4358 = Monad$bind$(Fm$Check$monad)((() => {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $4359 = self.name;
                    var $4360 = self.indx;
                    var self = List$at_last$($4360, _ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4362 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4359), List$nil));
                            var $4361 = $4362;
                            break;
                        case 'Maybe.some':
                            var $4363 = self.value;
                            var $4364 = Monad$pure$(Fm$Check$monad)((() => {
                                var self = $4363;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4365 = self.fst;
                                        var $4366 = self.snd;
                                        var $4367 = $4366;
                                        return $4367;
                                };
                            })());
                            var $4361 = $4364;
                            break;
                    };
                    return $4361;
                case 'Fm.Term.ref':
                    var $4368 = self.name;
                    var self = Fm$get$($4368, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4370 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4368), List$nil));
                            var $4369 = $4370;
                            break;
                        case 'Maybe.some':
                            var $4371 = self.value;
                            var self = $4371;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $4373 = self.file;
                                    var $4374 = self.code;
                                    var $4375 = self.name;
                                    var $4376 = self.term;
                                    var $4377 = self.type;
                                    var $4378 = self.stat;
                                    var _ref_name$15 = $4375;
                                    var _ref_type$16 = $4377;
                                    var _ref_term$17 = $4376;
                                    var _ref_stat$18 = $4378;
                                    var self = _ref_stat$18;
                                    switch (self._) {
                                        case 'Fm.Status.init':
                                            var $4380 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$waiting$(_ref_name$15), List$nil));
                                            var $4379 = $4380;
                                            break;
                                        case 'Fm.Status.wait':
                                            var $4381 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4379 = $4381;
                                            break;
                                        case 'Fm.Status.done':
                                            var $4382 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4379 = $4382;
                                            break;
                                        case 'Fm.Status.fail':
                                            var $4383 = self.errors;
                                            var $4384 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$indirect$(_ref_name$15), List$nil));
                                            var $4379 = $4384;
                                            break;
                                    };
                                    var $4372 = $4379;
                                    break;
                            };
                            var $4369 = $4372;
                            break;
                    };
                    return $4369;
                case 'Fm.Term.typ':
                    var $4385 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                    return $4385;
                case 'Fm.Term.all':
                    var $4386 = self.eras;
                    var $4387 = self.self;
                    var $4388 = self.name;
                    var $4389 = self.xtyp;
                    var $4390 = self.body;
                    var _ctx_size$12 = List$length$(_ctx$4);
                    var _self_var$13 = Fm$Term$var$($4387, _ctx_size$12);
                    var _body_var$14 = Fm$Term$var$($4388, Nat$succ$(_ctx_size$12));
                    var _body_ctx$15 = List$cons$(Pair$new$($4388, $4389), List$cons$(Pair$new$($4387, _term$1), _ctx$4));
                    var $4391 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4389, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$16 => {
                        var $4392 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4390(_self_var$13)(_body_var$14), Maybe$some$(Fm$Term$typ), _defs$3, _body_ctx$15, Fm$MPath$i$(_path$5), _orig$6))((_$17 => {
                            var $4393 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                            return $4393;
                        }));
                        return $4392;
                    }));
                    return $4391;
                case 'Fm.Term.lam':
                    var $4394 = self.name;
                    var $4395 = self.body;
                    var self = _type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4397 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                            var $4396 = $4397;
                            break;
                        case 'Maybe.some':
                            var $4398 = self.value;
                            var _typv$10 = Fm$Term$reduce$($4398, _defs$3);
                            var self = _typv$10;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4400 = self.name;
                                    var $4401 = self.indx;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4398);
                                    var $4402 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4399 = $4402;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4403 = self.name;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4398);
                                    var $4404 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4399 = $4404;
                                    break;
                                case 'Fm.Term.typ':
                                    var _expected$11 = Either$left$("Function");
                                    var _detected$12 = Either$right$($4398);
                                    var $4405 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                    var $4399 = $4405;
                                    break;
                                case 'Fm.Term.all':
                                    var $4406 = self.eras;
                                    var $4407 = self.self;
                                    var $4408 = self.name;
                                    var $4409 = self.xtyp;
                                    var $4410 = self.body;
                                    var _ctx_size$16 = List$length$(_ctx$4);
                                    var _self_var$17 = _term$1;
                                    var _body_var$18 = Fm$Term$var$($4394, _ctx_size$16);
                                    var _body_typ$19 = $4410(_self_var$17)(_body_var$18);
                                    var _body_ctx$20 = List$cons$(Pair$new$($4394, $4409), _ctx$4);
                                    var $4411 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4395(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Fm$MPath$o$(_path$5), _orig$6))((_$21 => {
                                        var $4412 = Monad$pure$(Fm$Check$monad)($4398);
                                        return $4412;
                                    }));
                                    var $4399 = $4411;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4413 = self.name;
                                    var $4414 = self.body;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4398);
                                    var $4415 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4399 = $4415;
                                    break;
                                case 'Fm.Term.app':
                                    var $4416 = self.func;
                                    var $4417 = self.argm;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4398);
                                    var $4418 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4399 = $4418;
                                    break;
                                case 'Fm.Term.let':
                                    var $4419 = self.name;
                                    var $4420 = self.expr;
                                    var $4421 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4398);
                                    var $4422 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4399 = $4422;
                                    break;
                                case 'Fm.Term.def':
                                    var $4423 = self.name;
                                    var $4424 = self.expr;
                                    var $4425 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4398);
                                    var $4426 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4399 = $4426;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4427 = self.done;
                                    var $4428 = self.term;
                                    var $4429 = self.type;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4398);
                                    var $4430 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4399 = $4430;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4431 = self.name;
                                    var $4432 = self.dref;
                                    var $4433 = self.verb;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4398);
                                    var $4434 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4399 = $4434;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4435 = self.path;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4398);
                                    var $4436 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4399 = $4436;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4437 = self.natx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4398);
                                    var $4438 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4399 = $4438;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4439 = self.chrx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4398);
                                    var $4440 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4399 = $4440;
                                    break;
                                case 'Fm.Term.str':
                                    var $4441 = self.strx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4398);
                                    var $4442 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4399 = $4442;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4443 = self.path;
                                    var $4444 = self.expr;
                                    var $4445 = self.name;
                                    var $4446 = self.with;
                                    var $4447 = self.cses;
                                    var $4448 = self.moti;
                                    var _expected$17 = Either$left$("Function");
                                    var _detected$18 = Either$right$($4398);
                                    var $4449 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                    var $4399 = $4449;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4450 = self.orig;
                                    var $4451 = self.expr;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4398);
                                    var $4452 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4399 = $4452;
                                    break;
                            };
                            var $4396 = $4399;
                            break;
                    };
                    return $4396;
                case 'Fm.Term.app':
                    var $4453 = self.func;
                    var $4454 = self.argm;
                    var $4455 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4453, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_func_typ$9 => {
                        var _func_typ$10 = Fm$Term$reduce$(_func_typ$9, _defs$3);
                        var self = _func_typ$10;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $4457 = self.name;
                                var $4458 = self.indx;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4459 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4456 = $4459;
                                break;
                            case 'Fm.Term.ref':
                                var $4460 = self.name;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4461 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4456 = $4461;
                                break;
                            case 'Fm.Term.typ':
                                var _expected$11 = Either$left$("Function");
                                var _detected$12 = Either$right$(_func_typ$10);
                                var $4462 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4456 = $4462;
                                break;
                            case 'Fm.Term.all':
                                var $4463 = self.eras;
                                var $4464 = self.self;
                                var $4465 = self.name;
                                var $4466 = self.xtyp;
                                var $4467 = self.body;
                                var $4468 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4454, Maybe$some$($4466), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$16 => {
                                    var $4469 = Monad$pure$(Fm$Check$monad)($4467($4453)($4454));
                                    return $4469;
                                }));
                                var $4456 = $4468;
                                break;
                            case 'Fm.Term.lam':
                                var $4470 = self.name;
                                var $4471 = self.body;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4472 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4456 = $4472;
                                break;
                            case 'Fm.Term.app':
                                var $4473 = self.func;
                                var $4474 = self.argm;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4475 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4456 = $4475;
                                break;
                            case 'Fm.Term.let':
                                var $4476 = self.name;
                                var $4477 = self.expr;
                                var $4478 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4479 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4456 = $4479;
                                break;
                            case 'Fm.Term.def':
                                var $4480 = self.name;
                                var $4481 = self.expr;
                                var $4482 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4483 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4456 = $4483;
                                break;
                            case 'Fm.Term.ann':
                                var $4484 = self.done;
                                var $4485 = self.term;
                                var $4486 = self.type;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4487 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4456 = $4487;
                                break;
                            case 'Fm.Term.gol':
                                var $4488 = self.name;
                                var $4489 = self.dref;
                                var $4490 = self.verb;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4491 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4456 = $4491;
                                break;
                            case 'Fm.Term.hol':
                                var $4492 = self.path;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4493 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4456 = $4493;
                                break;
                            case 'Fm.Term.nat':
                                var $4494 = self.natx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4495 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4456 = $4495;
                                break;
                            case 'Fm.Term.chr':
                                var $4496 = self.chrx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4497 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4456 = $4497;
                                break;
                            case 'Fm.Term.str':
                                var $4498 = self.strx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4499 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4456 = $4499;
                                break;
                            case 'Fm.Term.cse':
                                var $4500 = self.path;
                                var $4501 = self.expr;
                                var $4502 = self.name;
                                var $4503 = self.with;
                                var $4504 = self.cses;
                                var $4505 = self.moti;
                                var _expected$17 = Either$left$("Function");
                                var _detected$18 = Either$right$(_func_typ$10);
                                var $4506 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4456 = $4506;
                                break;
                            case 'Fm.Term.ori':
                                var $4507 = self.orig;
                                var $4508 = self.expr;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4509 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4456 = $4509;
                                break;
                        };
                        return $4456;
                    }));
                    return $4455;
                case 'Fm.Term.let':
                    var $4510 = self.name;
                    var $4511 = self.expr;
                    var $4512 = self.body;
                    var _ctx_size$10 = List$length$(_ctx$4);
                    var $4513 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4511, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_expr_typ$11 => {
                        var _body_val$12 = $4512(Fm$Term$var$($4510, _ctx_size$10));
                        var _body_ctx$13 = List$cons$(Pair$new$($4510, _expr_typ$11), _ctx$4);
                        var $4514 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_body_val$12, _type$2, _defs$3, _body_ctx$13, Fm$MPath$i$(_path$5), _orig$6))((_body_typ$14 => {
                            var $4515 = Monad$pure$(Fm$Check$monad)(_body_typ$14);
                            return $4515;
                        }));
                        return $4514;
                    }));
                    return $4513;
                case 'Fm.Term.def':
                    var $4516 = self.name;
                    var $4517 = self.expr;
                    var $4518 = self.body;
                    var $4519 = Fm$Term$check$($4518($4517), _type$2, _defs$3, _ctx$4, _path$5, _orig$6);
                    return $4519;
                case 'Fm.Term.ann':
                    var $4520 = self.done;
                    var $4521 = self.term;
                    var $4522 = self.type;
                    var self = $4520;
                    if (self) {
                        var $4524 = Monad$pure$(Fm$Check$monad)($4522);
                        var $4523 = $4524;
                    } else {
                        var $4525 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4521, Maybe$some$($4522), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$10 => {
                            var $4526 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4522, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$11 => {
                                var $4527 = Monad$pure$(Fm$Check$monad)($4522);
                                return $4527;
                            }));
                            return $4526;
                        }));
                        var $4523 = $4525;
                    };
                    return $4523;
                case 'Fm.Term.gol':
                    var $4528 = self.name;
                    var $4529 = self.dref;
                    var $4530 = self.verb;
                    var $4531 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$show_goal$($4528, $4529, $4530, _type$2, _ctx$4), List$nil));
                    return $4531;
                case 'Fm.Term.hol':
                    var $4532 = self.path;
                    var $4533 = Fm$Check$result$(_type$2, List$nil);
                    return $4533;
                case 'Fm.Term.nat':
                    var $4534 = self.natx;
                    var $4535 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Nat"));
                    return $4535;
                case 'Fm.Term.chr':
                    var $4536 = self.chrx;
                    var $4537 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Char"));
                    return $4537;
                case 'Fm.Term.str':
                    var $4538 = self.strx;
                    var $4539 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("String"));
                    return $4539;
                case 'Fm.Term.cse':
                    var $4540 = self.path;
                    var $4541 = self.expr;
                    var $4542 = self.name;
                    var $4543 = self.with;
                    var $4544 = self.cses;
                    var $4545 = self.moti;
                    var _expr$13 = $4541;
                    var $4546 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_etyp$14 => {
                        var self = $4545;
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _type$2;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4549 = Fm$Term$hol$(Bits$e);
                                        var _moti$15 = $4549;
                                        break;
                                    case 'Maybe.some':
                                        var $4550 = self.value;
                                        var _size$16 = List$length$(_ctx$4);
                                        var _typv$17 = Fm$Term$normalize$($4550, Map$new);
                                        var _moti$18 = Fm$SmartMotive$make$($4542, $4541, _etyp$14, _typv$17, _size$16, _defs$3);
                                        var $4551 = _moti$18;
                                        var _moti$15 = $4551;
                                        break;
                                };
                                var $4548 = Maybe$some$(Fm$Term$cse$($4540, $4541, $4542, $4543, $4544, Maybe$some$(_moti$15)));
                                var _dsug$15 = $4548;
                                break;
                            case 'Maybe.some':
                                var $4552 = self.value;
                                var $4553 = Fm$Term$desugar_cse$($4541, $4542, $4543, $4544, $4552, _etyp$14, _defs$3, _ctx$4);
                                var _dsug$15 = $4553;
                                break;
                        };
                        var self = _dsug$15;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4554 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                var $4547 = $4554;
                                break;
                            case 'Maybe.some':
                                var $4555 = self.value;
                                var $4556 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$patch$(Fm$MPath$to_bits$(_path$5), $4555), List$nil));
                                var $4547 = $4556;
                                break;
                        };
                        return $4547;
                    }));
                    return $4546;
                case 'Fm.Term.ori':
                    var $4557 = self.orig;
                    var $4558 = self.expr;
                    var $4559 = Fm$Term$check$($4558, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($4557));
                    return $4559;
            };
        })())((_infr$7 => {
            var self = _type$2;
            switch (self._) {
                case 'Maybe.none':
                    var $4561 = Fm$Check$result$(Maybe$some$(_infr$7), List$nil);
                    var $4560 = $4561;
                    break;
                case 'Maybe.some':
                    var $4562 = self.value;
                    var $4563 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($4562, _infr$7, _defs$3, List$length$(_ctx$4), Set$new))((_eqls$9 => {
                        var self = _eqls$9;
                        if (self) {
                            var $4565 = Monad$pure$(Fm$Check$monad)($4562);
                            var $4564 = $4565;
                        } else {
                            var $4566 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, Either$right$($4562), Either$right$(_infr$7), _ctx$4), List$nil));
                            var $4564 = $4566;
                        };
                        return $4564;
                    }));
                    var $4560 = $4563;
                    break;
            };
            return $4560;
        }));
        return $4358;
    };
    const Fm$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Term$check$(x0, x1, x2, x3, x4, x5);

    function Fm$Path$nil$(_x$1) {
        var $4567 = _x$1;
        return $4567;
    };
    const Fm$Path$nil = x0 => Fm$Path$nil$(x0);
    const Fm$MPath$nil = Maybe$some$(Fm$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $4569 = Bool$true;
                var $4568 = $4569;
                break;
            case 'List.cons':
                var $4570 = self.head;
                var $4571 = self.tail;
                var $4572 = Bool$false;
                var $4568 = $4572;
                break;
        };
        return $4568;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Fm$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Fm.Term.var':
                var $4574 = self.name;
                var $4575 = self.indx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4577 = _fn$3(_term$2);
                        var $4576 = $4577;
                        break;
                    case 'o':
                        var $4578 = self.slice(0, -1);
                        var $4579 = _term$2;
                        var $4576 = $4579;
                        break;
                    case 'i':
                        var $4580 = self.slice(0, -1);
                        var $4581 = _term$2;
                        var $4576 = $4581;
                        break;
                };
                var $4573 = $4576;
                break;
            case 'Fm.Term.ref':
                var $4582 = self.name;
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
                var $4573 = $4583;
                break;
            case 'Fm.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4590 = _fn$3(_term$2);
                        var $4589 = $4590;
                        break;
                    case 'o':
                        var $4591 = self.slice(0, -1);
                        var $4592 = _term$2;
                        var $4589 = $4592;
                        break;
                    case 'i':
                        var $4593 = self.slice(0, -1);
                        var $4594 = _term$2;
                        var $4589 = $4594;
                        break;
                };
                var $4573 = $4589;
                break;
            case 'Fm.Term.all':
                var $4595 = self.eras;
                var $4596 = self.self;
                var $4597 = self.name;
                var $4598 = self.xtyp;
                var $4599 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4601 = _fn$3(_term$2);
                        var $4600 = $4601;
                        break;
                    case 'o':
                        var $4602 = self.slice(0, -1);
                        var $4603 = Fm$Term$all$($4595, $4596, $4597, Fm$Term$patch_at$($4602, $4598, _fn$3), $4599);
                        var $4600 = $4603;
                        break;
                    case 'i':
                        var $4604 = self.slice(0, -1);
                        var $4605 = Fm$Term$all$($4595, $4596, $4597, $4598, (_s$10 => _x$11 => {
                            var $4606 = Fm$Term$patch_at$($4604, $4599(_s$10)(_x$11), _fn$3);
                            return $4606;
                        }));
                        var $4600 = $4605;
                        break;
                };
                var $4573 = $4600;
                break;
            case 'Fm.Term.lam':
                var $4607 = self.name;
                var $4608 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4610 = _fn$3(_term$2);
                        var $4609 = $4610;
                        break;
                    case 'o':
                        var $4611 = self.slice(0, -1);
                        var $4612 = Fm$Term$lam$($4607, (_x$7 => {
                            var $4613 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4608(_x$7), _fn$3);
                            return $4613;
                        }));
                        var $4609 = $4612;
                        break;
                    case 'i':
                        var $4614 = self.slice(0, -1);
                        var $4615 = Fm$Term$lam$($4607, (_x$7 => {
                            var $4616 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4608(_x$7), _fn$3);
                            return $4616;
                        }));
                        var $4609 = $4615;
                        break;
                };
                var $4573 = $4609;
                break;
            case 'Fm.Term.app':
                var $4617 = self.func;
                var $4618 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4620 = _fn$3(_term$2);
                        var $4619 = $4620;
                        break;
                    case 'o':
                        var $4621 = self.slice(0, -1);
                        var $4622 = Fm$Term$app$(Fm$Term$patch_at$($4621, $4617, _fn$3), $4618);
                        var $4619 = $4622;
                        break;
                    case 'i':
                        var $4623 = self.slice(0, -1);
                        var $4624 = Fm$Term$app$($4617, Fm$Term$patch_at$($4623, $4618, _fn$3));
                        var $4619 = $4624;
                        break;
                };
                var $4573 = $4619;
                break;
            case 'Fm.Term.let':
                var $4625 = self.name;
                var $4626 = self.expr;
                var $4627 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4629 = _fn$3(_term$2);
                        var $4628 = $4629;
                        break;
                    case 'o':
                        var $4630 = self.slice(0, -1);
                        var $4631 = Fm$Term$let$($4625, Fm$Term$patch_at$($4630, $4626, _fn$3), $4627);
                        var $4628 = $4631;
                        break;
                    case 'i':
                        var $4632 = self.slice(0, -1);
                        var $4633 = Fm$Term$let$($4625, $4626, (_x$8 => {
                            var $4634 = Fm$Term$patch_at$($4632, $4627(_x$8), _fn$3);
                            return $4634;
                        }));
                        var $4628 = $4633;
                        break;
                };
                var $4573 = $4628;
                break;
            case 'Fm.Term.def':
                var $4635 = self.name;
                var $4636 = self.expr;
                var $4637 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4639 = _fn$3(_term$2);
                        var $4638 = $4639;
                        break;
                    case 'o':
                        var $4640 = self.slice(0, -1);
                        var $4641 = Fm$Term$def$($4635, Fm$Term$patch_at$($4640, $4636, _fn$3), $4637);
                        var $4638 = $4641;
                        break;
                    case 'i':
                        var $4642 = self.slice(0, -1);
                        var $4643 = Fm$Term$def$($4635, $4636, (_x$8 => {
                            var $4644 = Fm$Term$patch_at$($4642, $4637(_x$8), _fn$3);
                            return $4644;
                        }));
                        var $4638 = $4643;
                        break;
                };
                var $4573 = $4638;
                break;
            case 'Fm.Term.ann':
                var $4645 = self.done;
                var $4646 = self.term;
                var $4647 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4649 = _fn$3(_term$2);
                        var $4648 = $4649;
                        break;
                    case 'o':
                        var $4650 = self.slice(0, -1);
                        var $4651 = Fm$Term$ann$($4645, Fm$Term$patch_at$(_path$1, $4646, _fn$3), $4647);
                        var $4648 = $4651;
                        break;
                    case 'i':
                        var $4652 = self.slice(0, -1);
                        var $4653 = Fm$Term$ann$($4645, Fm$Term$patch_at$(_path$1, $4646, _fn$3), $4647);
                        var $4648 = $4653;
                        break;
                };
                var $4573 = $4648;
                break;
            case 'Fm.Term.gol':
                var $4654 = self.name;
                var $4655 = self.dref;
                var $4656 = self.verb;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4658 = _fn$3(_term$2);
                        var $4657 = $4658;
                        break;
                    case 'o':
                        var $4659 = self.slice(0, -1);
                        var $4660 = _term$2;
                        var $4657 = $4660;
                        break;
                    case 'i':
                        var $4661 = self.slice(0, -1);
                        var $4662 = _term$2;
                        var $4657 = $4662;
                        break;
                };
                var $4573 = $4657;
                break;
            case 'Fm.Term.hol':
                var $4663 = self.path;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4665 = _fn$3(_term$2);
                        var $4664 = $4665;
                        break;
                    case 'o':
                        var $4666 = self.slice(0, -1);
                        var $4667 = _term$2;
                        var $4664 = $4667;
                        break;
                    case 'i':
                        var $4668 = self.slice(0, -1);
                        var $4669 = _term$2;
                        var $4664 = $4669;
                        break;
                };
                var $4573 = $4664;
                break;
            case 'Fm.Term.nat':
                var $4670 = self.natx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4672 = _fn$3(_term$2);
                        var $4671 = $4672;
                        break;
                    case 'o':
                        var $4673 = self.slice(0, -1);
                        var $4674 = _term$2;
                        var $4671 = $4674;
                        break;
                    case 'i':
                        var $4675 = self.slice(0, -1);
                        var $4676 = _term$2;
                        var $4671 = $4676;
                        break;
                };
                var $4573 = $4671;
                break;
            case 'Fm.Term.chr':
                var $4677 = self.chrx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4679 = _fn$3(_term$2);
                        var $4678 = $4679;
                        break;
                    case 'o':
                        var $4680 = self.slice(0, -1);
                        var $4681 = _term$2;
                        var $4678 = $4681;
                        break;
                    case 'i':
                        var $4682 = self.slice(0, -1);
                        var $4683 = _term$2;
                        var $4678 = $4683;
                        break;
                };
                var $4573 = $4678;
                break;
            case 'Fm.Term.str':
                var $4684 = self.strx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4686 = _fn$3(_term$2);
                        var $4685 = $4686;
                        break;
                    case 'o':
                        var $4687 = self.slice(0, -1);
                        var $4688 = _term$2;
                        var $4685 = $4688;
                        break;
                    case 'i':
                        var $4689 = self.slice(0, -1);
                        var $4690 = _term$2;
                        var $4685 = $4690;
                        break;
                };
                var $4573 = $4685;
                break;
            case 'Fm.Term.cse':
                var $4691 = self.path;
                var $4692 = self.expr;
                var $4693 = self.name;
                var $4694 = self.with;
                var $4695 = self.cses;
                var $4696 = self.moti;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4698 = _fn$3(_term$2);
                        var $4697 = $4698;
                        break;
                    case 'o':
                        var $4699 = self.slice(0, -1);
                        var $4700 = _term$2;
                        var $4697 = $4700;
                        break;
                    case 'i':
                        var $4701 = self.slice(0, -1);
                        var $4702 = _term$2;
                        var $4697 = $4702;
                        break;
                };
                var $4573 = $4697;
                break;
            case 'Fm.Term.ori':
                var $4703 = self.orig;
                var $4704 = self.expr;
                var $4705 = Fm$Term$patch_at$(_path$1, $4704, _fn$3);
                var $4573 = $4705;
                break;
        };
        return $4573;
    };
    const Fm$Term$patch_at = x0 => x1 => x2 => Fm$Term$patch_at$(x0, x1, x2);

    function Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, _errs$7, _fixd$8) {
        var self = _errs$7;
        switch (self._) {
            case 'List.nil':
                var self = _fixd$8;
                if (self) {
                    var _type$9 = Fm$Term$bind$(List$nil, (_x$9 => {
                        var $4709 = (_x$9 + '1');
                        return $4709;
                    }), _type$5);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $4710 = (_x$10 + '0');
                        return $4710;
                    }), _term$4);
                    var _defs$11 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$10, _type$9, Fm$Status$init), _defs$6);
                    var $4708 = Monad$pure$(IO$monad)(Maybe$some$(_defs$11));
                    var $4707 = $4708;
                } else {
                    var $4711 = Monad$pure$(IO$monad)(Maybe$none);
                    var $4707 = $4711;
                };
                var $4706 = $4707;
                break;
            case 'List.cons':
                var $4712 = self.head;
                var $4713 = self.tail;
                var self = $4712;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $4715 = self.origin;
                        var $4716 = self.expected;
                        var $4717 = self.detected;
                        var $4718 = self.context;
                        var $4719 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4713, _fixd$8);
                        var $4714 = $4719;
                        break;
                    case 'Fm.Error.show_goal':
                        var $4720 = self.name;
                        var $4721 = self.dref;
                        var $4722 = self.verb;
                        var $4723 = self.goal;
                        var $4724 = self.context;
                        var $4725 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4713, _fixd$8);
                        var $4714 = $4725;
                        break;
                    case 'Fm.Error.waiting':
                        var $4726 = self.name;
                        var $4727 = Monad$bind$(IO$monad)(Fm$Synth$one$($4726, _defs$6))((_defs$12 => {
                            var $4728 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$12, $4713, Bool$true);
                            return $4728;
                        }));
                        var $4714 = $4727;
                        break;
                    case 'Fm.Error.indirect':
                        var $4729 = self.name;
                        var $4730 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4713, _fixd$8);
                        var $4714 = $4730;
                        break;
                    case 'Fm.Error.patch':
                        var $4731 = self.path;
                        var $4732 = self.term;
                        var self = $4731;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'e':
                                var $4734 = Monad$pure$(IO$monad)(Maybe$none);
                                var $4733 = $4734;
                                break;
                            case 'o':
                                var $4735 = self.slice(0, -1);
                                var _term$14 = Fm$Term$patch_at$($4735, _term$4, (_x$14 => {
                                    var $4737 = $4732;
                                    return $4737;
                                }));
                                var $4736 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$14, _type$5, _defs$6, $4713, Bool$true);
                                var $4733 = $4736;
                                break;
                            case 'i':
                                var $4738 = self.slice(0, -1);
                                var _type$14 = Fm$Term$patch_at$($4738, _type$5, (_x$14 => {
                                    var $4740 = $4732;
                                    return $4740;
                                }));
                                var $4739 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$14, _defs$6, $4713, Bool$true);
                                var $4733 = $4739;
                                break;
                        };
                        var $4714 = $4733;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $4741 = self.origin;
                        var $4742 = self.name;
                        var $4743 = Monad$bind$(IO$monad)(Fm$Synth$one$($4742, _defs$6))((_defs$13 => {
                            var $4744 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$13, $4713, Bool$true);
                            return $4744;
                        }));
                        var $4714 = $4743;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $4745 = self.origin;
                        var $4746 = self.term;
                        var $4747 = self.context;
                        var $4748 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4713, _fixd$8);
                        var $4714 = $4748;
                        break;
                };
                var $4706 = $4714;
                break;
        };
        return $4706;
    };
    const Fm$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Status$fail$(_errors$1) {
        var $4749 = ({
            _: 'Fm.Status.fail',
            'errors': _errors$1
        });
        return $4749;
    };
    const Fm$Status$fail = x0 => Fm$Status$fail$(x0);

    function Fm$Synth$one$(_name$1, _defs$2) {
        var self = Fm$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.none':
                var $4751 = Monad$bind$(IO$monad)(Fm$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4753 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("Undefined: ", List$cons$(_name$1, List$nil)))))((_$4 => {
                                var $4754 = Monad$pure$(IO$monad)(_defs$2);
                                return $4754;
                            }));
                            var $4752 = $4753;
                            break;
                        case 'Maybe.some':
                            var $4755 = self.value;
                            var $4756 = Fm$Synth$one$(_name$1, $4755);
                            var $4752 = $4756;
                            break;
                    };
                    return $4752;
                }));
                var $4750 = $4751;
                break;
            case 'Maybe.some':
                var $4757 = self.value;
                var self = $4757;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4759 = self.file;
                        var $4760 = self.code;
                        var $4761 = self.name;
                        var $4762 = self.term;
                        var $4763 = self.type;
                        var $4764 = self.stat;
                        var _file$10 = $4759;
                        var _code$11 = $4760;
                        var _name$12 = $4761;
                        var _term$13 = $4762;
                        var _type$14 = $4763;
                        var _stat$15 = $4764;
                        var self = _stat$15;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var _defs$16 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, Fm$Status$wait), _defs$2);
                                var _checked$17 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_type$14, Maybe$some$(Fm$Term$typ), _defs$16, List$nil, Fm$MPath$i$(Fm$MPath$nil), Maybe$none))((_chk_type$17 => {
                                    var $4767 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_term$13, Maybe$some$(_type$14), _defs$16, List$nil, Fm$MPath$o$(Fm$MPath$nil), Maybe$none))((_chk_term$18 => {
                                        var $4768 = Monad$pure$(Fm$Check$monad)(Unit$new);
                                        return $4768;
                                    }));
                                    return $4767;
                                }));
                                var self = _checked$17;
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $4769 = self.value;
                                        var $4770 = self.errors;
                                        var self = List$is_empty$($4770);
                                        if (self) {
                                            var _defs$20 = Fm$define$(_file$10, _code$11, _name$12, _term$13, _type$14, Bool$true, _defs$16);
                                            var $4772 = Monad$pure$(IO$monad)(_defs$20);
                                            var $4771 = $4772;
                                        } else {
                                            var $4773 = Monad$bind$(IO$monad)(Fm$Synth$fix$(_file$10, _code$11, _name$12, _term$13, _type$14, _defs$16, $4770, Bool$false))((_fixed$20 => {
                                                var self = _fixed$20;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var _stat$21 = Fm$Status$fail$($4770);
                                                        var _defs$22 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, _stat$21), _defs$16);
                                                        var $4775 = Monad$pure$(IO$monad)(_defs$22);
                                                        var $4774 = $4775;
                                                        break;
                                                    case 'Maybe.some':
                                                        var $4776 = self.value;
                                                        var $4777 = Fm$Synth$one$(_name$12, $4776);
                                                        var $4774 = $4777;
                                                        break;
                                                };
                                                return $4774;
                                            }));
                                            var $4771 = $4773;
                                        };
                                        var $4766 = $4771;
                                        break;
                                };
                                var $4765 = $4766;
                                break;
                            case 'Fm.Status.wait':
                                var $4778 = Monad$pure$(IO$monad)(_defs$2);
                                var $4765 = $4778;
                                break;
                            case 'Fm.Status.done':
                                var $4779 = Monad$pure$(IO$monad)(_defs$2);
                                var $4765 = $4779;
                                break;
                            case 'Fm.Status.fail':
                                var $4780 = self.errors;
                                var $4781 = Monad$pure$(IO$monad)(_defs$2);
                                var $4765 = $4781;
                                break;
                        };
                        var $4758 = $4765;
                        break;
                };
                var $4750 = $4758;
                break;
        };
        return $4750;
    };
    const Fm$Synth$one = x0 => x1 => Fm$Synth$one$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $4783 = _list$3;
                var $4782 = $4783;
                break;
            case 'Map.tie':
                var $4784 = self.val;
                var $4785 = self.lft;
                var $4786 = self.rgt;
                var self = $4784;
                switch (self._) {
                    case 'Maybe.none':
                        var $4788 = _list$3;
                        var _list0$7 = $4788;
                        break;
                    case 'Maybe.some':
                        var $4789 = self.value;
                        var $4790 = List$cons$($4789, _list$3);
                        var _list0$7 = $4790;
                        break;
                };
                var _list1$8 = Map$values$go$($4785, _list0$7);
                var _list2$9 = Map$values$go$($4786, _list1$8);
                var $4787 = _list2$9;
                var $4782 = $4787;
                break;
        };
        return $4782;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $4791 = Map$values$go$(_xs$2, List$nil);
        return $4791;
    };
    const Map$values = x0 => Map$values$(x0);

    function Fm$Name$show$(_name$1) {
        var $4792 = _name$1;
        return $4792;
    };
    const Fm$Name$show = x0 => Fm$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $4794 = 0n;
                var $4793 = $4794;
                break;
            case 'o':
                var $4795 = self.slice(0, -1);
                var $4796 = (2n * Bits$to_nat$($4795));
                var $4793 = $4796;
                break;
            case 'i':
                var $4797 = self.slice(0, -1);
                var $4798 = Nat$succ$((2n * Bits$to_nat$($4797)));
                var $4793 = $4798;
                break;
        };
        return $4793;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $4800 = u16_to_word(self);
                var $4801 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($4800)));
                var $4799 = $4801;
                break;
        };
        return $4799;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Fm$escape$char$(_chr$1) {
        var self = (_chr$1 === Fm$backslash);
        if (self) {
            var $4803 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
            var $4802 = $4803;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $4805 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                var $4804 = $4805;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $4807 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                    var $4806 = $4807;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $4809 = String$cons$(_chr$1, String$nil);
                        var $4808 = $4809;
                    } else {
                        var $4810 = String$flatten$(List$cons$(String$cons$(Fm$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $4808 = $4810;
                    };
                    var $4806 = $4808;
                };
                var $4804 = $4806;
            };
            var $4802 = $4804;
        };
        return $4802;
    };
    const Fm$escape$char = x0 => Fm$escape$char$(x0);

    function Fm$escape$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4812 = String$nil;
            var $4811 = $4812;
        } else {
            var $4813 = self.charCodeAt(0);
            var $4814 = self.slice(1);
            var _head$4 = Fm$escape$char$($4813);
            var _tail$5 = Fm$escape$($4814);
            var $4815 = (_head$4 + _tail$5);
            var $4811 = $4815;
        };
        return $4811;
    };
    const Fm$escape = x0 => Fm$escape$(x0);

    function Fm$Term$core$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4817 = self.name;
                var $4818 = self.indx;
                var $4819 = Fm$Name$show$($4817);
                var $4816 = $4819;
                break;
            case 'Fm.Term.ref':
                var $4820 = self.name;
                var $4821 = Fm$Name$show$($4820);
                var $4816 = $4821;
                break;
            case 'Fm.Term.typ':
                var $4822 = "*";
                var $4816 = $4822;
                break;
            case 'Fm.Term.all':
                var $4823 = self.eras;
                var $4824 = self.self;
                var $4825 = self.name;
                var $4826 = self.xtyp;
                var $4827 = self.body;
                var _eras$7 = $4823;
                var self = _eras$7;
                if (self) {
                    var $4829 = "%";
                    var _init$8 = $4829;
                } else {
                    var $4830 = "@";
                    var _init$8 = $4830;
                };
                var _self$9 = Fm$Name$show$($4824);
                var _name$10 = Fm$Name$show$($4825);
                var _xtyp$11 = Fm$Term$core$($4826);
                var _body$12 = Fm$Term$core$($4827(Fm$Term$var$($4824, 0n))(Fm$Term$var$($4825, 0n)));
                var $4828 = String$flatten$(List$cons$(_init$8, List$cons$(_self$9, List$cons$("(", List$cons$(_name$10, List$cons$(":", List$cons$(_xtyp$11, List$cons$(") ", List$cons$(_body$12, List$nil)))))))));
                var $4816 = $4828;
                break;
            case 'Fm.Term.lam':
                var $4831 = self.name;
                var $4832 = self.body;
                var _name$4 = Fm$Name$show$($4831);
                var _body$5 = Fm$Term$core$($4832(Fm$Term$var$($4831, 0n)));
                var $4833 = String$flatten$(List$cons$("#", List$cons$(_name$4, List$cons$(" ", List$cons$(_body$5, List$nil)))));
                var $4816 = $4833;
                break;
            case 'Fm.Term.app':
                var $4834 = self.func;
                var $4835 = self.argm;
                var _func$4 = Fm$Term$core$($4834);
                var _argm$5 = Fm$Term$core$($4835);
                var $4836 = String$flatten$(List$cons$("(", List$cons$(_func$4, List$cons$(" ", List$cons$(_argm$5, List$cons$(")", List$nil))))));
                var $4816 = $4836;
                break;
            case 'Fm.Term.let':
                var $4837 = self.name;
                var $4838 = self.expr;
                var $4839 = self.body;
                var _name$5 = Fm$Name$show$($4837);
                var _expr$6 = Fm$Term$core$($4838);
                var _body$7 = Fm$Term$core$($4839(Fm$Term$var$($4837, 0n)));
                var $4840 = String$flatten$(List$cons$("!", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4816 = $4840;
                break;
            case 'Fm.Term.def':
                var $4841 = self.name;
                var $4842 = self.expr;
                var $4843 = self.body;
                var _name$5 = Fm$Name$show$($4841);
                var _expr$6 = Fm$Term$core$($4842);
                var _body$7 = Fm$Term$core$($4843(Fm$Term$var$($4841, 0n)));
                var $4844 = String$flatten$(List$cons$("$", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4816 = $4844;
                break;
            case 'Fm.Term.ann':
                var $4845 = self.done;
                var $4846 = self.term;
                var $4847 = self.type;
                var _term$5 = Fm$Term$core$($4846);
                var _type$6 = Fm$Term$core$($4847);
                var $4848 = String$flatten$(List$cons$("{", List$cons$(_term$5, List$cons$(":", List$cons$(_type$6, List$cons$("}", List$nil))))));
                var $4816 = $4848;
                break;
            case 'Fm.Term.gol':
                var $4849 = self.name;
                var $4850 = self.dref;
                var $4851 = self.verb;
                var $4852 = "<GOL>";
                var $4816 = $4852;
                break;
            case 'Fm.Term.hol':
                var $4853 = self.path;
                var $4854 = "<HOL>";
                var $4816 = $4854;
                break;
            case 'Fm.Term.nat':
                var $4855 = self.natx;
                var $4856 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($4855), List$nil)));
                var $4816 = $4856;
                break;
            case 'Fm.Term.chr':
                var $4857 = self.chrx;
                var $4858 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($4857), List$cons$("\'", List$nil))));
                var $4816 = $4858;
                break;
            case 'Fm.Term.str':
                var $4859 = self.strx;
                var $4860 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($4859), List$cons$("\"", List$nil))));
                var $4816 = $4860;
                break;
            case 'Fm.Term.cse':
                var $4861 = self.path;
                var $4862 = self.expr;
                var $4863 = self.name;
                var $4864 = self.with;
                var $4865 = self.cses;
                var $4866 = self.moti;
                var $4867 = "<CSE>";
                var $4816 = $4867;
                break;
            case 'Fm.Term.ori':
                var $4868 = self.orig;
                var $4869 = self.expr;
                var $4870 = Fm$Term$core$($4869);
                var $4816 = $4870;
                break;
        };
        return $4816;
    };
    const Fm$Term$core = x0 => Fm$Term$core$(x0);

    function Fm$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $4873 = _result$2;
            var $4874 = Map$values$(_defs$1);
            let _result$4 = $4873;
            let _defn$3;
            while ($4874._ === 'List.cons') {
                _defn$3 = $4874.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4875 = self.file;
                        var $4876 = self.code;
                        var $4877 = self.name;
                        var $4878 = self.term;
                        var $4879 = self.type;
                        var $4880 = self.stat;
                        var self = $4880;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var $4882 = _result$4;
                                var $4881 = $4882;
                                break;
                            case 'Fm.Status.wait':
                                var $4883 = _result$4;
                                var $4881 = $4883;
                                break;
                            case 'Fm.Status.done':
                                var _name$11 = $4877;
                                var _term$12 = Fm$Term$core$($4878);
                                var _type$13 = Fm$Term$core$($4879);
                                var $4884 = String$flatten$(List$cons$(_result$4, List$cons$(_name$11, List$cons$(" : ", List$cons$(_type$13, List$cons$(" = ", List$cons$(_term$12, List$cons$(";\u{a}", List$nil))))))));
                                var $4881 = $4884;
                                break;
                            case 'Fm.Status.fail':
                                var $4885 = self.errors;
                                var $4886 = _result$4;
                                var $4881 = $4886;
                                break;
                        };
                        var $4873 = $4881;
                        break;
                };
                _result$4 = $4873;
                $4874 = $4874.tail;
            }
            return _result$4;
        })();
        var $4871 = _result$3;
        return $4871;
    };
    const Fm$Defs$core = x0 => Fm$Defs$core$(x0);

    function Fm$to_core$io$one$(_name$1) {
        var $4887 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $4888 = Monad$pure$(IO$monad)(Fm$Defs$core$(_defs$2));
            return $4888;
        }));
        return $4887;
    };
    const Fm$to_core$io$one = x0 => Fm$to_core$io$one$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $4890 = Maybe$none;
                var $4889 = $4890;
                break;
            case 'Maybe.some':
                var $4891 = self.value;
                var $4892 = _f$4($4891);
                var $4889 = $4892;
                break;
        };
        return $4889;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);
    const Maybe$monad = Monad$new$(Maybe$bind, Maybe$some);

    function Fm$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4894 = self.name;
                var $4895 = self.indx;
                var $4896 = Maybe$none;
                var $4893 = $4896;
                break;
            case 'Fm.Term.ref':
                var $4897 = self.name;
                var self = ($4897 === "Nat.zero");
                if (self) {
                    var $4899 = Maybe$some$(0n);
                    var $4898 = $4899;
                } else {
                    var $4900 = Maybe$none;
                    var $4898 = $4900;
                };
                var $4893 = $4898;
                break;
            case 'Fm.Term.typ':
                var $4901 = Maybe$none;
                var $4893 = $4901;
                break;
            case 'Fm.Term.all':
                var $4902 = self.eras;
                var $4903 = self.self;
                var $4904 = self.name;
                var $4905 = self.xtyp;
                var $4906 = self.body;
                var $4907 = Maybe$none;
                var $4893 = $4907;
                break;
            case 'Fm.Term.lam':
                var $4908 = self.name;
                var $4909 = self.body;
                var $4910 = Maybe$none;
                var $4893 = $4910;
                break;
            case 'Fm.Term.app':
                var $4911 = self.func;
                var $4912 = self.argm;
                var self = $4911;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $4914 = self.name;
                        var $4915 = self.indx;
                        var $4916 = Maybe$none;
                        var $4913 = $4916;
                        break;
                    case 'Fm.Term.ref':
                        var $4917 = self.name;
                        var self = ($4917 === "Nat.succ");
                        if (self) {
                            var $4919 = Monad$bind$(Maybe$monad)(Fm$Term$show$as_nat$go$($4912))((_pred$5 => {
                                var $4920 = Monad$pure$(Maybe$monad)(Nat$succ$(_pred$5));
                                return $4920;
                            }));
                            var $4918 = $4919;
                        } else {
                            var $4921 = Maybe$none;
                            var $4918 = $4921;
                        };
                        var $4913 = $4918;
                        break;
                    case 'Fm.Term.typ':
                        var $4922 = Maybe$none;
                        var $4913 = $4922;
                        break;
                    case 'Fm.Term.all':
                        var $4923 = self.eras;
                        var $4924 = self.self;
                        var $4925 = self.name;
                        var $4926 = self.xtyp;
                        var $4927 = self.body;
                        var $4928 = Maybe$none;
                        var $4913 = $4928;
                        break;
                    case 'Fm.Term.lam':
                        var $4929 = self.name;
                        var $4930 = self.body;
                        var $4931 = Maybe$none;
                        var $4913 = $4931;
                        break;
                    case 'Fm.Term.app':
                        var $4932 = self.func;
                        var $4933 = self.argm;
                        var $4934 = Maybe$none;
                        var $4913 = $4934;
                        break;
                    case 'Fm.Term.let':
                        var $4935 = self.name;
                        var $4936 = self.expr;
                        var $4937 = self.body;
                        var $4938 = Maybe$none;
                        var $4913 = $4938;
                        break;
                    case 'Fm.Term.def':
                        var $4939 = self.name;
                        var $4940 = self.expr;
                        var $4941 = self.body;
                        var $4942 = Maybe$none;
                        var $4913 = $4942;
                        break;
                    case 'Fm.Term.ann':
                        var $4943 = self.done;
                        var $4944 = self.term;
                        var $4945 = self.type;
                        var $4946 = Maybe$none;
                        var $4913 = $4946;
                        break;
                    case 'Fm.Term.gol':
                        var $4947 = self.name;
                        var $4948 = self.dref;
                        var $4949 = self.verb;
                        var $4950 = Maybe$none;
                        var $4913 = $4950;
                        break;
                    case 'Fm.Term.hol':
                        var $4951 = self.path;
                        var $4952 = Maybe$none;
                        var $4913 = $4952;
                        break;
                    case 'Fm.Term.nat':
                        var $4953 = self.natx;
                        var $4954 = Maybe$none;
                        var $4913 = $4954;
                        break;
                    case 'Fm.Term.chr':
                        var $4955 = self.chrx;
                        var $4956 = Maybe$none;
                        var $4913 = $4956;
                        break;
                    case 'Fm.Term.str':
                        var $4957 = self.strx;
                        var $4958 = Maybe$none;
                        var $4913 = $4958;
                        break;
                    case 'Fm.Term.cse':
                        var $4959 = self.path;
                        var $4960 = self.expr;
                        var $4961 = self.name;
                        var $4962 = self.with;
                        var $4963 = self.cses;
                        var $4964 = self.moti;
                        var $4965 = Maybe$none;
                        var $4913 = $4965;
                        break;
                    case 'Fm.Term.ori':
                        var $4966 = self.orig;
                        var $4967 = self.expr;
                        var $4968 = Maybe$none;
                        var $4913 = $4968;
                        break;
                };
                var $4893 = $4913;
                break;
            case 'Fm.Term.let':
                var $4969 = self.name;
                var $4970 = self.expr;
                var $4971 = self.body;
                var $4972 = Maybe$none;
                var $4893 = $4972;
                break;
            case 'Fm.Term.def':
                var $4973 = self.name;
                var $4974 = self.expr;
                var $4975 = self.body;
                var $4976 = Maybe$none;
                var $4893 = $4976;
                break;
            case 'Fm.Term.ann':
                var $4977 = self.done;
                var $4978 = self.term;
                var $4979 = self.type;
                var $4980 = Maybe$none;
                var $4893 = $4980;
                break;
            case 'Fm.Term.gol':
                var $4981 = self.name;
                var $4982 = self.dref;
                var $4983 = self.verb;
                var $4984 = Maybe$none;
                var $4893 = $4984;
                break;
            case 'Fm.Term.hol':
                var $4985 = self.path;
                var $4986 = Maybe$none;
                var $4893 = $4986;
                break;
            case 'Fm.Term.nat':
                var $4987 = self.natx;
                var $4988 = Maybe$none;
                var $4893 = $4988;
                break;
            case 'Fm.Term.chr':
                var $4989 = self.chrx;
                var $4990 = Maybe$none;
                var $4893 = $4990;
                break;
            case 'Fm.Term.str':
                var $4991 = self.strx;
                var $4992 = Maybe$none;
                var $4893 = $4992;
                break;
            case 'Fm.Term.cse':
                var $4993 = self.path;
                var $4994 = self.expr;
                var $4995 = self.name;
                var $4996 = self.with;
                var $4997 = self.cses;
                var $4998 = self.moti;
                var $4999 = Maybe$none;
                var $4893 = $4999;
                break;
            case 'Fm.Term.ori':
                var $5000 = self.orig;
                var $5001 = self.expr;
                var $5002 = Maybe$none;
                var $4893 = $5002;
                break;
        };
        return $4893;
    };
    const Fm$Term$show$as_nat$go = x0 => Fm$Term$show$as_nat$go$(x0);

    function Fm$Term$show$as_nat$(_term$1) {
        var $5003 = Maybe$mapped$(Fm$Term$show$as_nat$go$(_term$1), Nat$show);
        return $5003;
    };
    const Fm$Term$show$as_nat = x0 => Fm$Term$show$as_nat$(x0);

    function Fm$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5005 = self.name;
                var $5006 = self.indx;
                var $5007 = Bool$false;
                var $5004 = $5007;
                break;
            case 'Fm.Term.ref':
                var $5008 = self.name;
                var $5009 = (_name$2 === $5008);
                var $5004 = $5009;
                break;
            case 'Fm.Term.typ':
                var $5010 = Bool$false;
                var $5004 = $5010;
                break;
            case 'Fm.Term.all':
                var $5011 = self.eras;
                var $5012 = self.self;
                var $5013 = self.name;
                var $5014 = self.xtyp;
                var $5015 = self.body;
                var $5016 = Bool$false;
                var $5004 = $5016;
                break;
            case 'Fm.Term.lam':
                var $5017 = self.name;
                var $5018 = self.body;
                var $5019 = Bool$false;
                var $5004 = $5019;
                break;
            case 'Fm.Term.app':
                var $5020 = self.func;
                var $5021 = self.argm;
                var $5022 = Bool$false;
                var $5004 = $5022;
                break;
            case 'Fm.Term.let':
                var $5023 = self.name;
                var $5024 = self.expr;
                var $5025 = self.body;
                var $5026 = Bool$false;
                var $5004 = $5026;
                break;
            case 'Fm.Term.def':
                var $5027 = self.name;
                var $5028 = self.expr;
                var $5029 = self.body;
                var $5030 = Bool$false;
                var $5004 = $5030;
                break;
            case 'Fm.Term.ann':
                var $5031 = self.done;
                var $5032 = self.term;
                var $5033 = self.type;
                var $5034 = Bool$false;
                var $5004 = $5034;
                break;
            case 'Fm.Term.gol':
                var $5035 = self.name;
                var $5036 = self.dref;
                var $5037 = self.verb;
                var $5038 = Bool$false;
                var $5004 = $5038;
                break;
            case 'Fm.Term.hol':
                var $5039 = self.path;
                var $5040 = Bool$false;
                var $5004 = $5040;
                break;
            case 'Fm.Term.nat':
                var $5041 = self.natx;
                var $5042 = Bool$false;
                var $5004 = $5042;
                break;
            case 'Fm.Term.chr':
                var $5043 = self.chrx;
                var $5044 = Bool$false;
                var $5004 = $5044;
                break;
            case 'Fm.Term.str':
                var $5045 = self.strx;
                var $5046 = Bool$false;
                var $5004 = $5046;
                break;
            case 'Fm.Term.cse':
                var $5047 = self.path;
                var $5048 = self.expr;
                var $5049 = self.name;
                var $5050 = self.with;
                var $5051 = self.cses;
                var $5052 = self.moti;
                var $5053 = Bool$false;
                var $5004 = $5053;
                break;
            case 'Fm.Term.ori':
                var $5054 = self.orig;
                var $5055 = self.expr;
                var $5056 = Bool$false;
                var $5004 = $5056;
                break;
        };
        return $5004;
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
                        var $5057 = self.name;
                        var $5058 = self.indx;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5060 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5059 = $5060;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5062 = Bool$false;
                                var _wrap$8 = $5062;
                            } else {
                                var $5063 = self.charCodeAt(0);
                                var $5064 = self.slice(1);
                                var $5065 = ($5063 === 40);
                                var _wrap$8 = $5065;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5066 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5066;
                            } else {
                                var $5067 = _func$7;
                                var _func$10 = $5067;
                            };
                            var $5061 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5059 = $5061;
                        };
                        return $5059;
                    case 'Fm.Term.ref':
                        var $5068 = self.name;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5070 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5069 = $5070;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5072 = Bool$false;
                                var _wrap$7 = $5072;
                            } else {
                                var $5073 = self.charCodeAt(0);
                                var $5074 = self.slice(1);
                                var $5075 = ($5073 === 40);
                                var _wrap$7 = $5075;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5076 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5076;
                            } else {
                                var $5077 = _func$6;
                                var _func$9 = $5077;
                            };
                            var $5071 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5069 = $5071;
                        };
                        return $5069;
                    case 'Fm.Term.typ':
                        var _arity$4 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
                        if (self) {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5079 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
                            var $5078 = $5079;
                        } else {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$5;
                            if (self.length === 0) {
                                var $5081 = Bool$false;
                                var _wrap$6 = $5081;
                            } else {
                                var $5082 = self.charCodeAt(0);
                                var $5083 = self.slice(1);
                                var $5084 = ($5082 === 40);
                                var _wrap$6 = $5084;
                            };
                            var _args$7 = String$join$(",", _args$3);
                            var self = _wrap$6;
                            if (self) {
                                var $5085 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                                var _func$8 = $5085;
                            } else {
                                var $5086 = _func$5;
                                var _func$8 = $5086;
                            };
                            var $5080 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
                            var $5078 = $5080;
                        };
                        return $5078;
                    case 'Fm.Term.all':
                        var $5087 = self.eras;
                        var $5088 = self.self;
                        var $5089 = self.name;
                        var $5090 = self.xtyp;
                        var $5091 = self.body;
                        var _arity$9 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$9 === 3n));
                        if (self) {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$11 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$12 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5093 = String$flatten$(List$cons$(_eq_lft$11, List$cons$(" == ", List$cons$(_eq_rgt$12, List$nil))));
                            var $5092 = $5093;
                        } else {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$10;
                            if (self.length === 0) {
                                var $5095 = Bool$false;
                                var _wrap$11 = $5095;
                            } else {
                                var $5096 = self.charCodeAt(0);
                                var $5097 = self.slice(1);
                                var $5098 = ($5096 === 40);
                                var _wrap$11 = $5098;
                            };
                            var _args$12 = String$join$(",", _args$3);
                            var self = _wrap$11;
                            if (self) {
                                var $5099 = String$flatten$(List$cons$("(", List$cons$(_func$10, List$cons$(")", List$nil))));
                                var _func$13 = $5099;
                            } else {
                                var $5100 = _func$10;
                                var _func$13 = $5100;
                            };
                            var $5094 = String$flatten$(List$cons$(_func$13, List$cons$("(", List$cons$(_args$12, List$cons$(")", List$nil)))));
                            var $5092 = $5094;
                        };
                        return $5092;
                    case 'Fm.Term.lam':
                        var $5101 = self.name;
                        var $5102 = self.body;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5104 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5103 = $5104;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5106 = Bool$false;
                                var _wrap$8 = $5106;
                            } else {
                                var $5107 = self.charCodeAt(0);
                                var $5108 = self.slice(1);
                                var $5109 = ($5107 === 40);
                                var _wrap$8 = $5109;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5110 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5110;
                            } else {
                                var $5111 = _func$7;
                                var _func$10 = $5111;
                            };
                            var $5105 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5103 = $5105;
                        };
                        return $5103;
                    case 'Fm.Term.app':
                        var $5112 = self.func;
                        var $5113 = self.argm;
                        var _argm$6 = Fm$Term$show$go$($5113, Fm$MPath$i$(_path$2));
                        var $5114 = Fm$Term$show$app$($5112, Fm$MPath$o$(_path$2), List$cons$(_argm$6, _args$3));
                        return $5114;
                    case 'Fm.Term.let':
                        var $5115 = self.name;
                        var $5116 = self.expr;
                        var $5117 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5119 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5118 = $5119;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5121 = Bool$false;
                                var _wrap$9 = $5121;
                            } else {
                                var $5122 = self.charCodeAt(0);
                                var $5123 = self.slice(1);
                                var $5124 = ($5122 === 40);
                                var _wrap$9 = $5124;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5125 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5125;
                            } else {
                                var $5126 = _func$8;
                                var _func$11 = $5126;
                            };
                            var $5120 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5118 = $5120;
                        };
                        return $5118;
                    case 'Fm.Term.def':
                        var $5127 = self.name;
                        var $5128 = self.expr;
                        var $5129 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5131 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5130 = $5131;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5133 = Bool$false;
                                var _wrap$9 = $5133;
                            } else {
                                var $5134 = self.charCodeAt(0);
                                var $5135 = self.slice(1);
                                var $5136 = ($5134 === 40);
                                var _wrap$9 = $5136;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5137 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5137;
                            } else {
                                var $5138 = _func$8;
                                var _func$11 = $5138;
                            };
                            var $5132 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5130 = $5132;
                        };
                        return $5130;
                    case 'Fm.Term.ann':
                        var $5139 = self.done;
                        var $5140 = self.term;
                        var $5141 = self.type;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5143 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5142 = $5143;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5145 = Bool$false;
                                var _wrap$9 = $5145;
                            } else {
                                var $5146 = self.charCodeAt(0);
                                var $5147 = self.slice(1);
                                var $5148 = ($5146 === 40);
                                var _wrap$9 = $5148;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5149 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5149;
                            } else {
                                var $5150 = _func$8;
                                var _func$11 = $5150;
                            };
                            var $5144 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5142 = $5144;
                        };
                        return $5142;
                    case 'Fm.Term.gol':
                        var $5151 = self.name;
                        var $5152 = self.dref;
                        var $5153 = self.verb;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5155 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5154 = $5155;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5157 = Bool$false;
                                var _wrap$9 = $5157;
                            } else {
                                var $5158 = self.charCodeAt(0);
                                var $5159 = self.slice(1);
                                var $5160 = ($5158 === 40);
                                var _wrap$9 = $5160;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5161 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5161;
                            } else {
                                var $5162 = _func$8;
                                var _func$11 = $5162;
                            };
                            var $5156 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5154 = $5156;
                        };
                        return $5154;
                    case 'Fm.Term.hol':
                        var $5163 = self.path;
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
                    case 'Fm.Term.nat':
                        var $5173 = self.natx;
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
                    case 'Fm.Term.chr':
                        var $5183 = self.chrx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5185 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5184 = $5185;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5187 = Bool$false;
                                var _wrap$7 = $5187;
                            } else {
                                var $5188 = self.charCodeAt(0);
                                var $5189 = self.slice(1);
                                var $5190 = ($5188 === 40);
                                var _wrap$7 = $5190;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5191 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5191;
                            } else {
                                var $5192 = _func$6;
                                var _func$9 = $5192;
                            };
                            var $5186 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5184 = $5186;
                        };
                        return $5184;
                    case 'Fm.Term.str':
                        var $5193 = self.strx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5195 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5194 = $5195;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5197 = Bool$false;
                                var _wrap$7 = $5197;
                            } else {
                                var $5198 = self.charCodeAt(0);
                                var $5199 = self.slice(1);
                                var $5200 = ($5198 === 40);
                                var _wrap$7 = $5200;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5201 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5201;
                            } else {
                                var $5202 = _func$6;
                                var _func$9 = $5202;
                            };
                            var $5196 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5194 = $5196;
                        };
                        return $5194;
                    case 'Fm.Term.cse':
                        var $5203 = self.path;
                        var $5204 = self.expr;
                        var $5205 = self.name;
                        var $5206 = self.with;
                        var $5207 = self.cses;
                        var $5208 = self.moti;
                        var _arity$10 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$10 === 3n));
                        if (self) {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$12 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$13 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5210 = String$flatten$(List$cons$(_eq_lft$12, List$cons$(" == ", List$cons$(_eq_rgt$13, List$nil))));
                            var $5209 = $5210;
                        } else {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$11;
                            if (self.length === 0) {
                                var $5212 = Bool$false;
                                var _wrap$12 = $5212;
                            } else {
                                var $5213 = self.charCodeAt(0);
                                var $5214 = self.slice(1);
                                var $5215 = ($5213 === 40);
                                var _wrap$12 = $5215;
                            };
                            var _args$13 = String$join$(",", _args$3);
                            var self = _wrap$12;
                            if (self) {
                                var $5216 = String$flatten$(List$cons$("(", List$cons$(_func$11, List$cons$(")", List$nil))));
                                var _func$14 = $5216;
                            } else {
                                var $5217 = _func$11;
                                var _func$14 = $5217;
                            };
                            var $5211 = String$flatten$(List$cons$(_func$14, List$cons$("(", List$cons$(_args$13, List$cons$(")", List$nil)))));
                            var $5209 = $5211;
                        };
                        return $5209;
                    case 'Fm.Term.ori':
                        var $5218 = self.orig;
                        var $5219 = self.expr;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5221 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5220 = $5221;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5223 = Bool$false;
                                var _wrap$8 = $5223;
                            } else {
                                var $5224 = self.charCodeAt(0);
                                var $5225 = self.slice(1);
                                var $5226 = ($5224 === 40);
                                var _wrap$8 = $5226;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5227 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5227;
                            } else {
                                var $5228 = _func$7;
                                var _func$10 = $5228;
                            };
                            var $5222 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5220 = $5222;
                        };
                        return $5220;
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
                var $5230 = _list$4;
                var $5229 = $5230;
                break;
            case 'Map.tie':
                var $5231 = self.val;
                var $5232 = self.lft;
                var $5233 = self.rgt;
                var self = $5231;
                switch (self._) {
                    case 'Maybe.none':
                        var $5235 = _list$4;
                        var _list0$8 = $5235;
                        break;
                    case 'Maybe.some':
                        var $5236 = self.value;
                        var $5237 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5236), _list$4);
                        var _list0$8 = $5237;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5232, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5233, (_key$3 + '1'), _list1$9);
                var $5234 = _list2$10;
                var $5229 = $5234;
                break;
        };
        return $5229;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5238 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5238;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $5240 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5239 = $5240;
                break;
            case 'o':
                var $5241 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5243 = List$cons$(_head$6, _tail$7);
                    var $5242 = $5243;
                } else {
                    var $5244 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5245 = Bits$chunks_of$go$(_len$1, $5241, $5244, _chunk$7);
                    var $5242 = $5245;
                };
                var $5239 = $5242;
                break;
            case 'i':
                var $5246 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5248 = List$cons$(_head$6, _tail$7);
                    var $5247 = $5248;
                } else {
                    var $5249 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5250 = Bits$chunks_of$go$(_len$1, $5246, $5249, _chunk$7);
                    var $5247 = $5250;
                };
                var $5239 = $5247;
                break;
        };
        return $5239;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5251 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5251;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5253 = Word$e;
            var $5252 = $5253;
        } else {
            var $5254 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'e':
                    var $5256 = Word$o$(Word$from_bits$($5254, Bits$e));
                    var $5255 = $5256;
                    break;
                case 'o':
                    var $5257 = self.slice(0, -1);
                    var $5258 = Word$o$(Word$from_bits$($5254, $5257));
                    var $5255 = $5258;
                    break;
                case 'i':
                    var $5259 = self.slice(0, -1);
                    var $5260 = Word$i$(Word$from_bits$($5254, $5259));
                    var $5255 = $5260;
                    break;
            };
            var $5252 = $5255;
        };
        return $5252;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Fm$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5263 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5263;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5265 = ((_u16$5 + 71) & 0xFFFF);
                    var $5264 = $5265;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5267 = (Math.max(_u16$5 - 4, 0));
                        var $5266 = $5267;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5269 = 46;
                            var $5268 = $5269;
                        } else {
                            var $5270 = 95;
                            var $5268 = $5270;
                        };
                        var $5266 = $5268;
                    };
                    var $5264 = $5266;
                };
                var _chr$6 = $5264;
            };
            var $5262 = String$cons$(_chr$6, _name$4);
            return $5262;
        }));
        var $5261 = _name$3;
        return $5261;
    };
    const Fm$Name$from_bits = x0 => Fm$Name$from_bits$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $5272 = self.fst;
                var $5273 = self.snd;
                var $5274 = $5272;
                var $5271 = $5274;
                break;
        };
        return $5271;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Fm$Term$show$go$(_term$1, _path$2) {
        var self = Fm$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $5277 = self.name;
                        var $5278 = self.indx;
                        var $5279 = Fm$Name$show$($5277);
                        var $5276 = $5279;
                        break;
                    case 'Fm.Term.ref':
                        var $5280 = self.name;
                        var _name$4 = Fm$Name$show$($5280);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5282 = _name$4;
                                var $5281 = $5282;
                                break;
                            case 'Maybe.some':
                                var $5283 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Fm$Path$to_bits$($5283));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5284 = String$flatten$(List$cons$(_name$4, List$cons$(Fm$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5281 = $5284;
                                break;
                        };
                        var $5276 = $5281;
                        break;
                    case 'Fm.Term.typ':
                        var $5285 = "Type";
                        var $5276 = $5285;
                        break;
                    case 'Fm.Term.all':
                        var $5286 = self.eras;
                        var $5287 = self.self;
                        var $5288 = self.name;
                        var $5289 = self.xtyp;
                        var $5290 = self.body;
                        var _eras$8 = $5286;
                        var _self$9 = Fm$Name$show$($5287);
                        var _name$10 = Fm$Name$show$($5288);
                        var _type$11 = Fm$Term$show$go$($5289, Fm$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5292 = "<";
                            var _open$12 = $5292;
                        } else {
                            var $5293 = "(";
                            var _open$12 = $5293;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5294 = ">";
                            var _clos$13 = $5294;
                        } else {
                            var $5295 = ")";
                            var _clos$13 = $5295;
                        };
                        var _body$14 = Fm$Term$show$go$($5290(Fm$Term$var$($5287, 0n))(Fm$Term$var$($5288, 0n)), Fm$MPath$i$(_path$2));
                        var $5291 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5276 = $5291;
                        break;
                    case 'Fm.Term.lam':
                        var $5296 = self.name;
                        var $5297 = self.body;
                        var _name$5 = Fm$Name$show$($5296);
                        var _body$6 = Fm$Term$show$go$($5297(Fm$Term$var$($5296, 0n)), Fm$MPath$o$(_path$2));
                        var $5298 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5276 = $5298;
                        break;
                    case 'Fm.Term.app':
                        var $5299 = self.func;
                        var $5300 = self.argm;
                        var $5301 = Fm$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5276 = $5301;
                        break;
                    case 'Fm.Term.let':
                        var $5302 = self.name;
                        var $5303 = self.expr;
                        var $5304 = self.body;
                        var _name$6 = Fm$Name$show$($5302);
                        var _expr$7 = Fm$Term$show$go$($5303, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5304(Fm$Term$var$($5302, 0n)), Fm$MPath$i$(_path$2));
                        var $5305 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5276 = $5305;
                        break;
                    case 'Fm.Term.def':
                        var $5306 = self.name;
                        var $5307 = self.expr;
                        var $5308 = self.body;
                        var _name$6 = Fm$Name$show$($5306);
                        var _expr$7 = Fm$Term$show$go$($5307, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5308(Fm$Term$var$($5306, 0n)), Fm$MPath$i$(_path$2));
                        var $5309 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5276 = $5309;
                        break;
                    case 'Fm.Term.ann':
                        var $5310 = self.done;
                        var $5311 = self.term;
                        var $5312 = self.type;
                        var _term$6 = Fm$Term$show$go$($5311, Fm$MPath$o$(_path$2));
                        var _type$7 = Fm$Term$show$go$($5312, Fm$MPath$i$(_path$2));
                        var $5313 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5276 = $5313;
                        break;
                    case 'Fm.Term.gol':
                        var $5314 = self.name;
                        var $5315 = self.dref;
                        var $5316 = self.verb;
                        var _name$6 = Fm$Name$show$($5314);
                        var $5317 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5276 = $5317;
                        break;
                    case 'Fm.Term.hol':
                        var $5318 = self.path;
                        var $5319 = "_";
                        var $5276 = $5319;
                        break;
                    case 'Fm.Term.nat':
                        var $5320 = self.natx;
                        var $5321 = String$flatten$(List$cons$(Nat$show$($5320), List$nil));
                        var $5276 = $5321;
                        break;
                    case 'Fm.Term.chr':
                        var $5322 = self.chrx;
                        var $5323 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($5322), List$cons$("\'", List$nil))));
                        var $5276 = $5323;
                        break;
                    case 'Fm.Term.str':
                        var $5324 = self.strx;
                        var $5325 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($5324), List$cons$("\"", List$nil))));
                        var $5276 = $5325;
                        break;
                    case 'Fm.Term.cse':
                        var $5326 = self.path;
                        var $5327 = self.expr;
                        var $5328 = self.name;
                        var $5329 = self.with;
                        var $5330 = self.cses;
                        var $5331 = self.moti;
                        var _expr$9 = Fm$Term$show$go$($5327, Fm$MPath$o$(_path$2));
                        var _name$10 = Fm$Name$show$($5328);
                        var _wyth$11 = String$join$("", List$mapped$($5329, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5334 = self.file;
                                    var $5335 = self.code;
                                    var $5336 = self.name;
                                    var $5337 = self.term;
                                    var $5338 = self.type;
                                    var $5339 = self.stat;
                                    var _name$18 = Fm$Name$show$($5336);
                                    var _type$19 = Fm$Term$show$go$($5338, Maybe$none);
                                    var _term$20 = Fm$Term$show$go$($5337, Maybe$none);
                                    var $5340 = String$flatten$(List$cons$(_name$18, List$cons$(": ", List$cons$(_type$19, List$cons$(" = ", List$cons$(_term$20, List$cons$(";", List$nil)))))));
                                    var $5333 = $5340;
                                    break;
                            };
                            return $5333;
                        })));
                        var _cses$12 = Map$to_list$($5330);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Fm$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Fm$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5341 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5341;
                        })));
                        var self = $5331;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5342 = "";
                                var _moti$14 = $5342;
                                break;
                            case 'Maybe.some':
                                var $5343 = self.value;
                                var $5344 = String$flatten$(List$cons$(": ", List$cons$(Fm$Term$show$go$($5343, Maybe$none), List$nil)));
                                var _moti$14 = $5344;
                                break;
                        };
                        var $5332 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5276 = $5332;
                        break;
                    case 'Fm.Term.ori':
                        var $5345 = self.orig;
                        var $5346 = self.expr;
                        var $5347 = Fm$Term$show$go$($5346, _path$2);
                        var $5276 = $5347;
                        break;
                };
                var $5275 = $5276;
                break;
            case 'Maybe.some':
                var $5348 = self.value;
                var $5349 = $5348;
                var $5275 = $5349;
                break;
        };
        return $5275;
    };
    const Fm$Term$show$go = x0 => x1 => Fm$Term$show$go$(x0, x1);

    function Fm$Term$show$(_term$1) {
        var $5350 = Fm$Term$show$go$(_term$1, Maybe$none);
        return $5350;
    };
    const Fm$Term$show = x0 => Fm$Term$show$(x0);

    function Fm$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.nil':
                var $5352 = List$nil;
                var $5351 = $5352;
                break;
            case 'List.cons':
                var $5353 = self.head;
                var $5354 = self.tail;
                var self = $5353;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5356 = self.origin;
                        var $5357 = self.expected;
                        var $5358 = self.detected;
                        var $5359 = self.context;
                        var $5360 = (!_got$2);
                        var _keep$5 = $5360;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5361 = self.name;
                        var $5362 = self.dref;
                        var $5363 = self.verb;
                        var $5364 = self.goal;
                        var $5365 = self.context;
                        var $5366 = Bool$true;
                        var _keep$5 = $5366;
                        break;
                    case 'Fm.Error.waiting':
                        var $5367 = self.name;
                        var $5368 = Bool$false;
                        var _keep$5 = $5368;
                        break;
                    case 'Fm.Error.indirect':
                        var $5369 = self.name;
                        var $5370 = Bool$false;
                        var _keep$5 = $5370;
                        break;
                    case 'Fm.Error.patch':
                        var $5371 = self.path;
                        var $5372 = self.term;
                        var $5373 = Bool$false;
                        var _keep$5 = $5373;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5374 = self.origin;
                        var $5375 = self.name;
                        var $5376 = (!_got$2);
                        var _keep$5 = $5376;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5377 = self.origin;
                        var $5378 = self.term;
                        var $5379 = self.context;
                        var $5380 = (!_got$2);
                        var _keep$5 = $5380;
                        break;
                };
                var self = $5353;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5381 = self.origin;
                        var $5382 = self.expected;
                        var $5383 = self.detected;
                        var $5384 = self.context;
                        var $5385 = Bool$true;
                        var _got$6 = $5385;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5386 = self.name;
                        var $5387 = self.dref;
                        var $5388 = self.verb;
                        var $5389 = self.goal;
                        var $5390 = self.context;
                        var $5391 = _got$2;
                        var _got$6 = $5391;
                        break;
                    case 'Fm.Error.waiting':
                        var $5392 = self.name;
                        var $5393 = _got$2;
                        var _got$6 = $5393;
                        break;
                    case 'Fm.Error.indirect':
                        var $5394 = self.name;
                        var $5395 = _got$2;
                        var _got$6 = $5395;
                        break;
                    case 'Fm.Error.patch':
                        var $5396 = self.path;
                        var $5397 = self.term;
                        var $5398 = _got$2;
                        var _got$6 = $5398;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5399 = self.origin;
                        var $5400 = self.name;
                        var $5401 = Bool$true;
                        var _got$6 = $5401;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5402 = self.origin;
                        var $5403 = self.term;
                        var $5404 = self.context;
                        var $5405 = _got$2;
                        var _got$6 = $5405;
                        break;
                };
                var _tail$7 = Fm$Error$relevant$($5354, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5406 = List$cons$($5353, _tail$7);
                    var $5355 = $5406;
                } else {
                    var $5407 = _tail$7;
                    var $5355 = $5407;
                };
                var $5351 = $5355;
                break;
        };
        return $5351;
    };
    const Fm$Error$relevant = x0 => x1 => Fm$Error$relevant$(x0, x1);

    function Fm$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.nil':
                var $5409 = "";
                var $5408 = $5409;
                break;
            case 'List.cons':
                var $5410 = self.head;
                var $5411 = self.tail;
                var self = $5410;
                switch (self._) {
                    case 'Pair.new':
                        var $5413 = self.fst;
                        var $5414 = self.snd;
                        var _name$6 = Fm$Name$show$($5413);
                        var _type$7 = Fm$Term$show$($5414);
                        var _rest$8 = Fm$Context$show$($5411);
                        var $5415 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5412 = $5415;
                        break;
                };
                var $5408 = $5412;
                break;
        };
        return $5408;
    };
    const Fm$Context$show = x0 => Fm$Context$show$(x0);

    function Fm$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5416 = Fm$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Fm.Term.var':
                    var $5418 = self.name;
                    var $5419 = self.indx;
                    var $5420 = _term$4;
                    var $5417 = $5420;
                    break;
                case 'Fm.Term.ref':
                    var $5421 = self.name;
                    var self = Fm$get$($5421, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5423 = Fm$Term$ref$($5421);
                            var $5422 = $5423;
                            break;
                        case 'Maybe.some':
                            var $5424 = self.value;
                            var self = $5424;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5426 = self.file;
                                    var $5427 = self.code;
                                    var $5428 = self.name;
                                    var $5429 = self.term;
                                    var $5430 = self.type;
                                    var $5431 = self.stat;
                                    var $5432 = $5429;
                                    var $5425 = $5432;
                                    break;
                            };
                            var $5422 = $5425;
                            break;
                    };
                    var $5417 = $5422;
                    break;
                case 'Fm.Term.typ':
                    var $5433 = _term$4;
                    var $5417 = $5433;
                    break;
                case 'Fm.Term.all':
                    var $5434 = self.eras;
                    var $5435 = self.self;
                    var $5436 = self.name;
                    var $5437 = self.xtyp;
                    var $5438 = self.body;
                    var $5439 = _term$4;
                    var $5417 = $5439;
                    break;
                case 'Fm.Term.lam':
                    var $5440 = self.name;
                    var $5441 = self.body;
                    var $5442 = _term$4;
                    var $5417 = $5442;
                    break;
                case 'Fm.Term.app':
                    var $5443 = self.func;
                    var $5444 = self.argm;
                    var $5445 = _term$4;
                    var $5417 = $5445;
                    break;
                case 'Fm.Term.let':
                    var $5446 = self.name;
                    var $5447 = self.expr;
                    var $5448 = self.body;
                    var $5449 = _term$4;
                    var $5417 = $5449;
                    break;
                case 'Fm.Term.def':
                    var $5450 = self.name;
                    var $5451 = self.expr;
                    var $5452 = self.body;
                    var $5453 = _term$4;
                    var $5417 = $5453;
                    break;
                case 'Fm.Term.ann':
                    var $5454 = self.done;
                    var $5455 = self.term;
                    var $5456 = self.type;
                    var $5457 = _term$4;
                    var $5417 = $5457;
                    break;
                case 'Fm.Term.gol':
                    var $5458 = self.name;
                    var $5459 = self.dref;
                    var $5460 = self.verb;
                    var $5461 = _term$4;
                    var $5417 = $5461;
                    break;
                case 'Fm.Term.hol':
                    var $5462 = self.path;
                    var $5463 = _term$4;
                    var $5417 = $5463;
                    break;
                case 'Fm.Term.nat':
                    var $5464 = self.natx;
                    var $5465 = _term$4;
                    var $5417 = $5465;
                    break;
                case 'Fm.Term.chr':
                    var $5466 = self.chrx;
                    var $5467 = _term$4;
                    var $5417 = $5467;
                    break;
                case 'Fm.Term.str':
                    var $5468 = self.strx;
                    var $5469 = _term$4;
                    var $5417 = $5469;
                    break;
                case 'Fm.Term.cse':
                    var $5470 = self.path;
                    var $5471 = self.expr;
                    var $5472 = self.name;
                    var $5473 = self.with;
                    var $5474 = self.cses;
                    var $5475 = self.moti;
                    var $5476 = _term$4;
                    var $5417 = $5476;
                    break;
                case 'Fm.Term.ori':
                    var $5477 = self.orig;
                    var $5478 = self.expr;
                    var $5479 = _term$4;
                    var $5417 = $5479;
                    break;
            };
            return $5417;
        }));
        return $5416;
    };
    const Fm$Term$expand_at = x0 => x1 => x2 => Fm$Term$expand_at$(x0, x1, x2);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Fm$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5481 = self.name;
                var $5482 = self.indx;
                var $5483 = Fm$Term$var$($5481, $5482);
                var $5480 = $5483;
                break;
            case 'Fm.Term.ref':
                var $5484 = self.name;
                var _expand$5 = Bool$false;
                var _expand$6 = ((($5484 === "Nat.succ") && (_arity$3 > 1n)) || _expand$5);
                var _expand$7 = ((($5484 === "Nat.zero") && (_arity$3 > 0n)) || _expand$6);
                var _expand$8 = ((($5484 === "Bool.true") && (_arity$3 > 0n)) || _expand$7);
                var _expand$9 = ((($5484 === "Bool.false") && (_arity$3 > 0n)) || _expand$8);
                var self = _expand$9;
                if (self) {
                    var self = Fm$get$($5484, _defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5487 = Fm$Term$ref$($5484);
                            var $5486 = $5487;
                            break;
                        case 'Maybe.some':
                            var $5488 = self.value;
                            var self = $5488;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5490 = self.file;
                                    var $5491 = self.code;
                                    var $5492 = self.name;
                                    var $5493 = self.term;
                                    var $5494 = self.type;
                                    var $5495 = self.stat;
                                    var $5496 = $5493;
                                    var $5489 = $5496;
                                    break;
                            };
                            var $5486 = $5489;
                            break;
                    };
                    var $5485 = $5486;
                } else {
                    var $5497 = Fm$Term$ref$($5484);
                    var $5485 = $5497;
                };
                var $5480 = $5485;
                break;
            case 'Fm.Term.typ':
                var $5498 = Fm$Term$typ;
                var $5480 = $5498;
                break;
            case 'Fm.Term.all':
                var $5499 = self.eras;
                var $5500 = self.self;
                var $5501 = self.name;
                var $5502 = self.xtyp;
                var $5503 = self.body;
                var $5504 = Fm$Term$all$($5499, $5500, $5501, Fm$Term$expand_ct$($5502, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5505 = Fm$Term$expand_ct$($5503(_s$9)(_x$10), _defs$2, 0n);
                    return $5505;
                }));
                var $5480 = $5504;
                break;
            case 'Fm.Term.lam':
                var $5506 = self.name;
                var $5507 = self.body;
                var $5508 = Fm$Term$lam$($5506, (_x$6 => {
                    var $5509 = Fm$Term$expand_ct$($5507(_x$6), _defs$2, 0n);
                    return $5509;
                }));
                var $5480 = $5508;
                break;
            case 'Fm.Term.app':
                var $5510 = self.func;
                var $5511 = self.argm;
                var $5512 = Fm$Term$app$(Fm$Term$expand_ct$($5510, _defs$2, Nat$succ$(_arity$3)), Fm$Term$expand_ct$($5511, _defs$2, 0n));
                var $5480 = $5512;
                break;
            case 'Fm.Term.let':
                var $5513 = self.name;
                var $5514 = self.expr;
                var $5515 = self.body;
                var $5516 = Fm$Term$let$($5513, Fm$Term$expand_ct$($5514, _defs$2, 0n), (_x$7 => {
                    var $5517 = Fm$Term$expand_ct$($5515(_x$7), _defs$2, 0n);
                    return $5517;
                }));
                var $5480 = $5516;
                break;
            case 'Fm.Term.def':
                var $5518 = self.name;
                var $5519 = self.expr;
                var $5520 = self.body;
                var $5521 = Fm$Term$def$($5518, Fm$Term$expand_ct$($5519, _defs$2, 0n), (_x$7 => {
                    var $5522 = Fm$Term$expand_ct$($5520(_x$7), _defs$2, 0n);
                    return $5522;
                }));
                var $5480 = $5521;
                break;
            case 'Fm.Term.ann':
                var $5523 = self.done;
                var $5524 = self.term;
                var $5525 = self.type;
                var $5526 = Fm$Term$ann$($5523, Fm$Term$expand_ct$($5524, _defs$2, 0n), Fm$Term$expand_ct$($5525, _defs$2, 0n));
                var $5480 = $5526;
                break;
            case 'Fm.Term.gol':
                var $5527 = self.name;
                var $5528 = self.dref;
                var $5529 = self.verb;
                var $5530 = Fm$Term$gol$($5527, $5528, $5529);
                var $5480 = $5530;
                break;
            case 'Fm.Term.hol':
                var $5531 = self.path;
                var $5532 = Fm$Term$hol$($5531);
                var $5480 = $5532;
                break;
            case 'Fm.Term.nat':
                var $5533 = self.natx;
                var $5534 = Fm$Term$nat$($5533);
                var $5480 = $5534;
                break;
            case 'Fm.Term.chr':
                var $5535 = self.chrx;
                var $5536 = Fm$Term$chr$($5535);
                var $5480 = $5536;
                break;
            case 'Fm.Term.str':
                var $5537 = self.strx;
                var $5538 = Fm$Term$str$($5537);
                var $5480 = $5538;
                break;
            case 'Fm.Term.cse':
                var $5539 = self.path;
                var $5540 = self.expr;
                var $5541 = self.name;
                var $5542 = self.with;
                var $5543 = self.cses;
                var $5544 = self.moti;
                var $5545 = _term$1;
                var $5480 = $5545;
                break;
            case 'Fm.Term.ori':
                var $5546 = self.orig;
                var $5547 = self.expr;
                var $5548 = Fm$Term$ori$($5546, $5547);
                var $5480 = $5548;
                break;
        };
        return $5480;
    };
    const Fm$Term$expand_ct = x0 => x1 => x2 => Fm$Term$expand_ct$(x0, x1, x2);

    function Fm$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Fm$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5551 = _term$4;
            var $5552 = _dref$1;
            let _term$6 = $5551;
            let _path$5;
            while ($5552._ === 'List.cons') {
                _path$5 = $5552.head;
                var _term$7 = Fm$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Fm$Term$normalize$(_term$7, Map$new);
                var _term$9 = Fm$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Fm$Term$normalize$(_term$9, Map$new);
                var $5551 = _term$10;
                _term$6 = $5551;
                $5552 = $5552.tail;
            }
            return _term$6;
        })();
        var $5549 = _term$5;
        return $5549;
    };
    const Fm$Term$expand = x0 => x1 => x2 => Fm$Term$expand$(x0, x1, x2);

    function Fm$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5554 = self.origin;
                var $5555 = self.expected;
                var $5556 = self.detected;
                var $5557 = self.context;
                var self = $5555;
                switch (self._) {
                    case 'Either.left':
                        var $5559 = self.value;
                        var $5560 = $5559;
                        var _expected$7 = $5560;
                        break;
                    case 'Either.right':
                        var $5561 = self.value;
                        var $5562 = Fm$Term$show$(Fm$Term$normalize$($5561, Map$new));
                        var _expected$7 = $5562;
                        break;
                };
                var self = $5556;
                switch (self._) {
                    case 'Either.left':
                        var $5563 = self.value;
                        var $5564 = $5563;
                        var _detected$8 = $5564;
                        break;
                    case 'Either.right':
                        var $5565 = self.value;
                        var $5566 = Fm$Term$show$(Fm$Term$normalize$($5565, Map$new));
                        var _detected$8 = $5566;
                        break;
                };
                var $5558 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5557;
                    switch (self._) {
                        case 'List.nil':
                            var $5567 = "";
                            return $5567;
                        case 'List.cons':
                            var $5568 = self.head;
                            var $5569 = self.tail;
                            var $5570 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Fm$Context$show$($5557), List$nil)));
                            return $5570;
                    };
                })(), List$nil)))))))));
                var $5553 = $5558;
                break;
            case 'Fm.Error.show_goal':
                var $5571 = self.name;
                var $5572 = self.dref;
                var $5573 = self.verb;
                var $5574 = self.goal;
                var $5575 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Fm$Name$show$($5571), List$cons$(":\u{a}", List$nil))));
                var self = $5574;
                switch (self._) {
                    case 'Maybe.none':
                        var $5577 = "";
                        var _with_type$9 = $5577;
                        break;
                    case 'Maybe.some':
                        var $5578 = self.value;
                        var _goal$10 = Fm$Term$expand$($5572, $5578, _defs$2);
                        var $5579 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5573;
                            if (self) {
                                var $5580 = Fm$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5581 = _x$11;
                                    return $5581;
                                })));
                                return $5580;
                            } else {
                                var $5582 = Fm$Term$show$(_goal$10);
                                return $5582;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5579;
                        break;
                };
                var self = $5575;
                switch (self._) {
                    case 'List.nil':
                        var $5583 = "";
                        var _with_ctxt$10 = $5583;
                        break;
                    case 'List.cons':
                        var $5584 = self.head;
                        var $5585 = self.tail;
                        var $5586 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Fm$Context$show$($5575), List$nil)));
                        var _with_ctxt$10 = $5586;
                        break;
                };
                var $5576 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5553 = $5576;
                break;
            case 'Fm.Error.waiting':
                var $5587 = self.name;
                var $5588 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5587, List$cons$("\'.", List$nil))));
                var $5553 = $5588;
                break;
            case 'Fm.Error.indirect':
                var $5589 = self.name;
                var $5590 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5589, List$cons$("\'.", List$nil))));
                var $5553 = $5590;
                break;
            case 'Fm.Error.patch':
                var $5591 = self.path;
                var $5592 = self.term;
                var $5593 = String$flatten$(List$cons$("Patching: ", List$cons$(Fm$Term$show$($5592), List$nil)));
                var $5553 = $5593;
                break;
            case 'Fm.Error.undefined_reference':
                var $5594 = self.origin;
                var $5595 = self.name;
                var $5596 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Fm$Name$show$($5595), List$cons$("\u{a}", List$nil))));
                var $5553 = $5596;
                break;
            case 'Fm.Error.cant_infer':
                var $5597 = self.origin;
                var $5598 = self.term;
                var $5599 = self.context;
                var _term$6 = Fm$Term$show$($5598);
                var _context$7 = Fm$Context$show$($5599);
                var $5600 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5553 = $5600;
                break;
        };
        return $5553;
    };
    const Fm$Error$show = x0 => x1 => Fm$Error$show$(x0, x1);

    function Fm$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5602 = self.origin;
                var $5603 = self.expected;
                var $5604 = self.detected;
                var $5605 = self.context;
                var $5606 = $5602;
                var $5601 = $5606;
                break;
            case 'Fm.Error.show_goal':
                var $5607 = self.name;
                var $5608 = self.dref;
                var $5609 = self.verb;
                var $5610 = self.goal;
                var $5611 = self.context;
                var $5612 = Maybe$none;
                var $5601 = $5612;
                break;
            case 'Fm.Error.waiting':
                var $5613 = self.name;
                var $5614 = Maybe$none;
                var $5601 = $5614;
                break;
            case 'Fm.Error.indirect':
                var $5615 = self.name;
                var $5616 = Maybe$none;
                var $5601 = $5616;
                break;
            case 'Fm.Error.patch':
                var $5617 = self.path;
                var $5618 = self.term;
                var $5619 = Maybe$none;
                var $5601 = $5619;
                break;
            case 'Fm.Error.undefined_reference':
                var $5620 = self.origin;
                var $5621 = self.name;
                var $5622 = $5620;
                var $5601 = $5622;
                break;
            case 'Fm.Error.cant_infer':
                var $5623 = self.origin;
                var $5624 = self.term;
                var $5625 = self.context;
                var $5626 = $5623;
                var $5601 = $5626;
                break;
        };
        return $5601;
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
                        var $5627 = String$flatten$(List$cons$(_typs$4, List$cons$("\u{a}", List$cons$((() => {
                            var self = _errs$3;
                            if (self.length === 0) {
                                var $5628 = "All terms check.";
                                return $5628;
                            } else {
                                var $5629 = self.charCodeAt(0);
                                var $5630 = self.slice(1);
                                var $5631 = _errs$3;
                                return $5631;
                            };
                        })(), List$nil))));
                        return $5627;
                    case 'List.cons':
                        var $5632 = self.head;
                        var $5633 = self.tail;
                        var _name$7 = $5632;
                        var self = Fm$get$(_name$7, _defs$1);
                        switch (self._) {
                            case 'Maybe.none':
                                var $5635 = Fm$Defs$report$go$(_defs$1, $5633, _errs$3, _typs$4);
                                var $5634 = $5635;
                                break;
                            case 'Maybe.some':
                                var $5636 = self.value;
                                var self = $5636;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $5638 = self.file;
                                        var $5639 = self.code;
                                        var $5640 = self.name;
                                        var $5641 = self.term;
                                        var $5642 = self.type;
                                        var $5643 = self.stat;
                                        var _typs$15 = String$flatten$(List$cons$(_typs$4, List$cons$(_name$7, List$cons$(": ", List$cons$(Fm$Term$show$($5642), List$cons$("\u{a}", List$nil))))));
                                        var self = $5643;
                                        switch (self._) {
                                            case 'Fm.Status.init':
                                                var $5645 = Fm$Defs$report$go$(_defs$1, $5633, _errs$3, _typs$15);
                                                var $5644 = $5645;
                                                break;
                                            case 'Fm.Status.wait':
                                                var $5646 = Fm$Defs$report$go$(_defs$1, $5633, _errs$3, _typs$15);
                                                var $5644 = $5646;
                                                break;
                                            case 'Fm.Status.done':
                                                var $5647 = Fm$Defs$report$go$(_defs$1, $5633, _errs$3, _typs$15);
                                                var $5644 = $5647;
                                                break;
                                            case 'Fm.Status.fail':
                                                var $5648 = self.errors;
                                                var self = $5648;
                                                switch (self._) {
                                                    case 'List.nil':
                                                        var $5650 = Fm$Defs$report$go$(_defs$1, $5633, _errs$3, _typs$15);
                                                        var $5649 = $5650;
                                                        break;
                                                    case 'List.cons':
                                                        var $5651 = self.head;
                                                        var $5652 = self.tail;
                                                        var _name_str$19 = Fm$Name$show$($5640);
                                                        var _rel_errs$20 = Fm$Error$relevant$($5648, Bool$false);
                                                        var _rel_msgs$21 = List$mapped$(_rel_errs$20, (_err$21 => {
                                                            var $5654 = String$flatten$(List$cons$(Fm$Error$show$(_err$21, _defs$1), List$cons$((() => {
                                                                var self = Fm$Error$origin$(_err$21);
                                                                switch (self._) {
                                                                    case 'Maybe.none':
                                                                        var $5655 = "";
                                                                        return $5655;
                                                                    case 'Maybe.some':
                                                                        var $5656 = self.value;
                                                                        var self = $5656;
                                                                        switch (self._) {
                                                                            case 'Fm.Origin.new':
                                                                                var $5658 = self.file;
                                                                                var $5659 = self.from;
                                                                                var $5660 = self.upto;
                                                                                var $5661 = String$flatten$(List$cons$("Inside \'", List$cons$($5638, List$cons$("\':\u{a}", List$cons$(Fm$highlight$($5639, $5659, $5660), List$cons$("\u{a}", List$nil))))));
                                                                                var $5657 = $5661;
                                                                                break;
                                                                        };
                                                                        return $5657;
                                                                };
                                                            })(), List$nil)));
                                                            return $5654;
                                                        }));
                                                        var _errs$22 = String$flatten$(List$cons$(_errs$3, List$cons$(String$join$("\u{a}", _rel_msgs$21), List$cons$("\u{a}", List$nil))));
                                                        var $5653 = Fm$Defs$report$go$(_defs$1, $5633, _errs$22, _typs$15);
                                                        var $5649 = $5653;
                                                        break;
                                                };
                                                var $5644 = $5649;
                                                break;
                                        };
                                        var $5637 = $5644;
                                        break;
                                };
                                var $5634 = $5637;
                                break;
                        };
                        return $5634;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Defs$report$go = x0 => x1 => x2 => x3 => Fm$Defs$report$go$(x0, x1, x2, x3);

    function Fm$Defs$report$(_defs$1, _list$2) {
        var $5662 = Fm$Defs$report$go$(_defs$1, _list$2, "", "");
        return $5662;
    };
    const Fm$Defs$report = x0 => x1 => Fm$Defs$report$(x0, x1);

    function Fm$checker$io$one$(_name$1) {
        var $5663 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $5664 = IO$print$(Fm$Defs$report$(_defs$2, List$cons$(_name$1, List$nil)));
            return $5664;
        }));
        return $5663;
    };
    const Fm$checker$io$one = x0 => Fm$checker$io$one$(x0);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $5666 = _list$4;
                var $5665 = $5666;
                break;
            case 'Map.tie':
                var $5667 = self.val;
                var $5668 = self.lft;
                var $5669 = self.rgt;
                var self = $5667;
                switch (self._) {
                    case 'Maybe.none':
                        var $5671 = _list$4;
                        var _list0$8 = $5671;
                        break;
                    case 'Maybe.some':
                        var $5672 = self.value;
                        var $5673 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5673;
                        break;
                };
                var _list1$9 = Map$keys$go$($5668, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5669, (_key$3 + '1'), _list1$9);
                var $5670 = _list2$10;
                var $5665 = $5670;
                break;
        };
        return $5665;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5674 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5674;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Fm$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.nil':
                var $5676 = Monad$pure$(IO$monad)(_defs$2);
                var $5675 = $5676;
                break;
            case 'List.cons':
                var $5677 = self.head;
                var $5678 = self.tail;
                var $5679 = Monad$bind$(IO$monad)(Fm$Synth$one$($5677, _defs$2))((_defs$5 => {
                    var $5680 = Fm$Synth$many$($5678, _defs$5);
                    return $5680;
                }));
                var $5675 = $5679;
                break;
        };
        return $5675;
    };
    const Fm$Synth$many = x0 => x1 => Fm$Synth$many$(x0, x1);

    function Fm$Synth$file$(_file$1, _defs$2) {
        var $5681 = Monad$bind$(IO$monad)(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Fm$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5683 = self.value;
                    var $5684 = Monad$pure$(IO$monad)(Either$left$($5683));
                    var $5682 = $5684;
                    break;
                case 'Either.right':
                    var $5685 = self.value;
                    var _file_defs$6 = $5685;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Fm$Name$from_bits);
                    var $5686 = Monad$bind$(IO$monad)(Fm$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5687 = Monad$pure$(IO$monad)(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5687;
                    }));
                    var $5682 = $5686;
                    break;
            };
            return $5682;
        }));
        return $5681;
    };
    const Fm$Synth$file = x0 => x1 => Fm$Synth$file$(x0, x1);

    function Fm$checker$io$file$(_file$1) {
        var $5688 = Monad$bind$(IO$monad)(Fm$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5690 = self.value;
                    var $5691 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5692 = IO$print$($5690);
                        return $5692;
                    }));
                    var $5689 = $5691;
                    break;
                case 'Either.right':
                    var $5693 = self.value;
                    var self = $5693;
                    switch (self._) {
                        case 'Pair.new':
                            var $5695 = self.fst;
                            var $5696 = self.snd;
                            var _nams$6 = $5695;
                            var _defs$7 = $5696;
                            var $5697 = IO$print$(Fm$Defs$report$(_defs$7, _nams$6));
                            var $5694 = $5697;
                            break;
                    };
                    var $5689 = $5694;
                    break;
            };
            return $5689;
        }));
        return $5688;
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
                        var $5698 = self.value;
                        var $5699 = $5698;
                        return $5699;
                    case 'IO.ask':
                        var $5700 = self.query;
                        var $5701 = self.param;
                        var $5702 = self.then;
                        var $5703 = IO$purify$($5702(""));
                        return $5703;
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
                var $5705 = self.value;
                var $5706 = $5705;
                var $5704 = $5706;
                break;
            case 'Either.right':
                var $5707 = self.value;
                var $5708 = IO$purify$((() => {
                    var _defs$3 = $5707;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Fm$Name$from_bits);
                    var $5709 = Monad$bind$(IO$monad)(Fm$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5710 = Monad$pure$(IO$monad)(Fm$Defs$report$(_defs$5, _nams$4));
                        return $5710;
                    }));
                    return $5709;
                })());
                var $5704 = $5708;
                break;
        };
        return $5704;
    };
    const Fm$checker$code = x0 => Fm$checker$code$(x0);

    function Fm$Term$read$(_code$1) {
        var self = Fm$Parser$term(0n)(_code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $5712 = self.idx;
                var $5713 = self.code;
                var $5714 = self.err;
                var $5715 = Maybe$none;
                var $5711 = $5715;
                break;
            case 'Parser.Reply.value':
                var $5716 = self.idx;
                var $5717 = self.code;
                var $5718 = self.val;
                var $5719 = Maybe$some$($5718);
                var $5711 = $5719;
                break;
        };
        return $5711;
    };
    const Fm$Term$read = x0 => Fm$Term$read$(x0);
    const Fm = (() => {
        var __$1 = Fm$to_core$io$one;
        var __$2 = Fm$checker$io$one;
        var __$3 = Fm$checker$io$file;
        var __$4 = Fm$checker$code;
        var __$5 = Fm$Term$read;
        var $5720 = Fm$checker$io$file$("Main.fm");
        return $5720;
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