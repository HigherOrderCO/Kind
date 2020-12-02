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

    function Fm$Term$ann$(_done$1, _term$2, _type$3) {
        var $1140 = ({
            _: 'Fm.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $1140;
    };
    const Fm$Term$ann = x0 => x1 => x2 => Fm$Term$ann$(x0, x1, x2);

    function Fm$Parser$annotation$(_init$1, _term$2) {
        var $1141 = Monad$bind$(Parser$monad)(Fm$Parser$text$("::"))((_$3 => {
            var $1142 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$4 => {
                var $1143 = Monad$bind$(Parser$monad)(Fm$Parser$stop$(_init$1))((_orig$5 => {
                    var $1144 = Monad$pure$(Parser$monad)(Fm$Term$ori$(_orig$5, Fm$Term$ann$(Bool$false, _term$2, _type$4)));
                    return $1144;
                }));
                return $1143;
            }));
            return $1142;
        }));
        return $1141;
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
                var _suffix_parser$5 = Parser$first_of$(List$cons$(Fm$Parser$application$(_init$1, _term$2), List$cons$(Fm$Parser$application$erased$(_init$1, _term$2), List$cons$(Fm$Parser$arrow$(_init$1, _term$2), List$cons$(Fm$Parser$add(_init$1)(_term$2), List$cons$(Fm$Parser$sub(_init$1)(_term$2), List$cons$(Fm$Parser$mul(_init$1)(_term$2), List$cons$(Fm$Parser$div(_init$1)(_term$2), List$cons$(Fm$Parser$mod(_init$1)(_term$2), List$cons$(Fm$Parser$cons$(_init$1, _term$2), List$cons$(Fm$Parser$concat$(_init$1, _term$2), List$cons$(Fm$Parser$string_concat$(_init$1, _term$2), List$cons$(Fm$Parser$sigma$(_init$1, _term$2), List$cons$(Fm$Parser$equality$(_init$1, _term$2), List$cons$(Fm$Parser$inequality$(_init$1, _term$2), List$cons$(Fm$Parser$annotation$(_init$1, _term$2), List$nil))))))))))))))));
                var self = _suffix_parser$5(_idx$3)(_code$4);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1146 = self.idx;
                        var $1147 = self.code;
                        var $1148 = self.err;
                        var $1149 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $1145 = $1149;
                        break;
                    case 'Parser.Reply.value':
                        var $1150 = self.idx;
                        var $1151 = self.code;
                        var $1152 = self.val;
                        var $1153 = Fm$Parser$suffix$(_init$1, $1152, $1150, $1151);
                        var $1145 = $1153;
                        break;
                };
                return $1145;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Parser$suffix = x0 => x1 => x2 => x3 => Fm$Parser$suffix$(x0, x1, x2, x3);
    const Fm$Parser$term = Monad$bind$(Parser$monad)(Parser$get_code)((_code$1 => {
        var $1154 = Monad$bind$(Parser$monad)(Fm$Parser$init)((_init$2 => {
            var $1155 = Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$type, List$cons$(Fm$Parser$forall, List$cons$(Fm$Parser$lambda, List$cons$(Fm$Parser$lambda$erased, List$cons$(Fm$Parser$lambda$nameless, List$cons$(Fm$Parser$parenthesis, List$cons$(Fm$Parser$letforin, List$cons$(Fm$Parser$let, List$cons$(Fm$Parser$get, List$cons$(Fm$Parser$def, List$cons$(Fm$Parser$if, List$cons$(Fm$Parser$char, List$cons$(Fm$Parser$string, List$cons$(Fm$Parser$pair, List$cons$(Fm$Parser$sigma$type, List$cons$(Fm$Parser$some, List$cons$(Fm$Parser$apply, List$cons$(Fm$Parser$list, List$cons$(Fm$Parser$log, List$cons$(Fm$Parser$forin, List$cons$(Fm$Parser$forin2, List$cons$(Fm$Parser$do, List$cons$(Fm$Parser$case, List$cons$(Fm$Parser$open, List$cons$(Fm$Parser$goal, List$cons$(Fm$Parser$hole, List$cons$(Fm$Parser$nat, List$cons$(Fm$Parser$reference, List$nil))))))))))))))))))))))))))))))((_term$3 => {
                var $1156 = Fm$Parser$suffix(_init$2)(_term$3);
                return $1156;
            }));
            return $1155;
        }));
        return $1154;
    }));
    const Fm$Parser$name_term = Monad$bind$(Parser$monad)(Fm$Parser$name)((_name$1 => {
        var $1157 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$2 => {
            var $1158 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$3 => {
                var $1159 = Monad$pure$(Parser$monad)(Pair$new$(_name$1, _type$3));
                return $1159;
            }));
            return $1158;
        }));
        return $1157;
    }));

    function Fm$Binder$new$(_eras$1, _name$2, _term$3) {
        var $1160 = ({
            _: 'Fm.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $1160;
    };
    const Fm$Binder$new = x0 => x1 => x2 => Fm$Binder$new$(x0, x1, x2);

    function Fm$Parser$binder$homo$(_eras$1) {
        var $1161 = Monad$bind$(Parser$monad)(Fm$Parser$text$((() => {
            var self = _eras$1;
            if (self) {
                var $1162 = "<";
                return $1162;
            } else {
                var $1163 = "(";
                return $1163;
            };
        })()))((_$2 => {
            var $1164 = Monad$bind$(Parser$monad)(Parser$until1$(Fm$Parser$text$((() => {
                var self = _eras$1;
                if (self) {
                    var $1165 = ">";
                    return $1165;
                } else {
                    var $1166 = ")";
                    return $1166;
                };
            })()), Fm$Parser$item$(Fm$Parser$name_term)))((_bind$3 => {
                var $1167 = Monad$pure$(Parser$monad)(List$mapped$(_bind$3, (_pair$4 => {
                    var self = _pair$4;
                    switch (self._) {
                        case 'Pair.new':
                            var $1169 = self.fst;
                            var $1170 = self.snd;
                            var $1171 = Fm$Binder$new$(_eras$1, $1169, $1170);
                            var $1168 = $1171;
                            break;
                    };
                    return $1168;
                })));
                return $1167;
            }));
            return $1164;
        }));
        return $1161;
    };
    const Fm$Parser$binder$homo = x0 => Fm$Parser$binder$homo$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.nil':
                var $1173 = _bs$3;
                var $1172 = $1173;
                break;
            case 'List.cons':
                var $1174 = self.head;
                var $1175 = self.tail;
                var $1176 = List$cons$($1174, List$concat$($1175, _bs$3));
                var $1172 = $1176;
                break;
        };
        return $1172;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1178 = List$nil;
                var $1177 = $1178;
                break;
            case 'List.cons':
                var $1179 = self.head;
                var $1180 = self.tail;
                var $1181 = List$concat$($1179, List$flatten$($1180));
                var $1177 = $1181;
                break;
        };
        return $1177;
    };
    const List$flatten = x0 => List$flatten$(x0);
    const Fm$Parser$binder = Monad$bind$(Parser$monad)(Parser$many1$(Parser$first_of$(List$cons$(Fm$Parser$binder$homo$(Bool$true), List$cons$(Fm$Parser$binder$homo$(Bool$false), List$nil)))))((_lists$1 => {
        var $1182 = Monad$pure$(Parser$monad)(List$flatten$(_lists$1));
        return $1182;
    }));

    function Fm$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.nil':
                var $1184 = _body$2;
                var $1183 = $1184;
                break;
            case 'List.cons':
                var $1185 = self.head;
                var $1186 = self.tail;
                var self = $1185;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1188 = self.eras;
                        var $1189 = self.name;
                        var $1190 = self.term;
                        var $1191 = Fm$Term$all$($1188, "", $1189, $1190, (_s$8 => _x$9 => {
                            var $1192 = Fm$Parser$make_forall$($1186, _body$2);
                            return $1192;
                        }));
                        var $1187 = $1191;
                        break;
                };
                var $1183 = $1187;
                break;
        };
        return $1183;
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
                        var $1193 = Maybe$none;
                        return $1193;
                    case 'List.cons':
                        var $1194 = self.head;
                        var $1195 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $1197 = Maybe$some$($1194);
                            var $1196 = $1197;
                        } else {
                            var $1198 = (self - 1n);
                            var $1199 = List$at$($1198, $1195);
                            var $1196 = $1199;
                        };
                        return $1196;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $1200 = List$at$(_index$2, List$reverse$(_list$3));
        return $1200;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Fm$Term$var$(_name$1, _indx$2) {
        var $1201 = ({
            _: 'Fm.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $1201;
    };
    const Fm$Term$var = x0 => x1 => Fm$Term$var$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1203 = self.fst;
                var $1204 = self.snd;
                var $1205 = $1204;
                var $1202 = $1205;
                break;
        };
        return $1202;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Fm$Name$eql$(_a$1, _b$2) {
        var $1206 = (_a$1 === _b$2);
        return $1206;
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
                        var $1207 = Maybe$none;
                        return $1207;
                    case 'List.cons':
                        var $1208 = self.head;
                        var $1209 = self.tail;
                        var self = $1208;
                        switch (self._) {
                            case 'Pair.new':
                                var $1211 = self.fst;
                                var $1212 = self.snd;
                                var self = Fm$Name$eql$(_name$1, $1211);
                                if (self) {
                                    var $1214 = Maybe$some$($1212);
                                    var $1213 = $1214;
                                } else {
                                    var $1215 = Fm$Context$find$(_name$1, $1209);
                                    var $1213 = $1215;
                                };
                                var $1210 = $1213;
                                break;
                        };
                        return $1210;
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
                var $1217 = 0n;
                var $1216 = $1217;
                break;
            case 'List.cons':
                var $1218 = self.head;
                var $1219 = self.tail;
                var $1220 = Nat$succ$(List$length$($1219));
                var $1216 = $1220;
                break;
        };
        return $1216;
    };
    const List$length = x0 => List$length$(x0);

    function Fm$Path$o$(_path$1, _x$2) {
        var $1221 = _path$1((_x$2 + '0'));
        return $1221;
    };
    const Fm$Path$o = x0 => x1 => Fm$Path$o$(x0, x1);

    function Fm$Path$i$(_path$1, _x$2) {
        var $1222 = _path$1((_x$2 + '1'));
        return $1222;
    };
    const Fm$Path$i = x0 => x1 => Fm$Path$i$(x0, x1);

    function Fm$Path$to_bits$(_path$1) {
        var $1223 = _path$1(Bits$e);
        return $1223;
    };
    const Fm$Path$to_bits = x0 => Fm$Path$to_bits$(x0);

    function Fm$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Fm.Term.var':
                var $1225 = self.name;
                var $1226 = self.indx;
                var self = List$at_last$($1226, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1228 = Fm$Term$var$($1225, $1226);
                        var $1227 = $1228;
                        break;
                    case 'Maybe.some':
                        var $1229 = self.value;
                        var $1230 = Pair$snd$($1229);
                        var $1227 = $1230;
                        break;
                };
                var $1224 = $1227;
                break;
            case 'Fm.Term.ref':
                var $1231 = self.name;
                var self = Fm$Context$find$($1231, _vars$1);
                switch (self._) {
                    case 'Maybe.none':
                        var $1233 = Fm$Term$ref$($1231);
                        var $1232 = $1233;
                        break;
                    case 'Maybe.some':
                        var $1234 = self.value;
                        var $1235 = $1234;
                        var $1232 = $1235;
                        break;
                };
                var $1224 = $1232;
                break;
            case 'Fm.Term.typ':
                var $1236 = Fm$Term$typ;
                var $1224 = $1236;
                break;
            case 'Fm.Term.all':
                var $1237 = self.eras;
                var $1238 = self.self;
                var $1239 = self.name;
                var $1240 = self.xtyp;
                var $1241 = self.body;
                var _vlen$9 = List$length$(_vars$1);
                var $1242 = Fm$Term$all$($1237, $1238, $1239, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1240), (_s$10 => _x$11 => {
                    var $1243 = Fm$Term$bind$(List$cons$(Pair$new$($1239, _x$11), List$cons$(Pair$new$($1238, _s$10), _vars$1)), Fm$Path$i(_path$2), $1241(Fm$Term$var$($1238, _vlen$9))(Fm$Term$var$($1239, Nat$succ$(_vlen$9))));
                    return $1243;
                }));
                var $1224 = $1242;
                break;
            case 'Fm.Term.lam':
                var $1244 = self.name;
                var $1245 = self.body;
                var _vlen$6 = List$length$(_vars$1);
                var $1246 = Fm$Term$lam$($1244, (_x$7 => {
                    var $1247 = Fm$Term$bind$(List$cons$(Pair$new$($1244, _x$7), _vars$1), Fm$Path$o(_path$2), $1245(Fm$Term$var$($1244, _vlen$6)));
                    return $1247;
                }));
                var $1224 = $1246;
                break;
            case 'Fm.Term.app':
                var $1248 = self.func;
                var $1249 = self.argm;
                var $1250 = Fm$Term$app$(Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1248), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1249));
                var $1224 = $1250;
                break;
            case 'Fm.Term.let':
                var $1251 = self.name;
                var $1252 = self.expr;
                var $1253 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1254 = Fm$Term$let$($1251, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1252), (_x$8 => {
                    var $1255 = Fm$Term$bind$(List$cons$(Pair$new$($1251, _x$8), _vars$1), Fm$Path$i(_path$2), $1253(Fm$Term$var$($1251, _vlen$7)));
                    return $1255;
                }));
                var $1224 = $1254;
                break;
            case 'Fm.Term.def':
                var $1256 = self.name;
                var $1257 = self.expr;
                var $1258 = self.body;
                var _vlen$7 = List$length$(_vars$1);
                var $1259 = Fm$Term$def$($1256, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1257), (_x$8 => {
                    var $1260 = Fm$Term$bind$(List$cons$(Pair$new$($1256, _x$8), _vars$1), Fm$Path$i(_path$2), $1258(Fm$Term$var$($1256, _vlen$7)));
                    return $1260;
                }));
                var $1224 = $1259;
                break;
            case 'Fm.Term.ann':
                var $1261 = self.done;
                var $1262 = self.term;
                var $1263 = self.type;
                var $1264 = Fm$Term$ann$($1261, Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1262), Fm$Term$bind$(_vars$1, Fm$Path$i(_path$2), $1263));
                var $1224 = $1264;
                break;
            case 'Fm.Term.gol':
                var $1265 = self.name;
                var $1266 = self.dref;
                var $1267 = self.verb;
                var $1268 = Fm$Term$gol$($1265, $1266, $1267);
                var $1224 = $1268;
                break;
            case 'Fm.Term.hol':
                var $1269 = self.path;
                var $1270 = Fm$Term$hol$(Fm$Path$to_bits$(_path$2));
                var $1224 = $1270;
                break;
            case 'Fm.Term.nat':
                var $1271 = self.natx;
                var $1272 = Fm$Term$nat$($1271);
                var $1224 = $1272;
                break;
            case 'Fm.Term.chr':
                var $1273 = self.chrx;
                var $1274 = Fm$Term$chr$($1273);
                var $1224 = $1274;
                break;
            case 'Fm.Term.str':
                var $1275 = self.strx;
                var $1276 = Fm$Term$str$($1275);
                var $1224 = $1276;
                break;
            case 'Fm.Term.cse':
                var $1277 = self.path;
                var $1278 = self.expr;
                var $1279 = self.name;
                var $1280 = self.with;
                var $1281 = self.cses;
                var $1282 = self.moti;
                var _expr$10 = Fm$Term$bind$(_vars$1, Fm$Path$o(_path$2), $1278);
                var _name$11 = $1279;
                var _wyth$12 = $1280;
                var _cses$13 = $1281;
                var _moti$14 = $1282;
                var $1283 = Fm$Term$cse$(Fm$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $1224 = $1283;
                break;
            case 'Fm.Term.ori':
                var $1284 = self.orig;
                var $1285 = self.expr;
                var $1286 = Fm$Term$ori$($1284, Fm$Term$bind$(_vars$1, _path$2, $1285));
                var $1224 = $1286;
                break;
        };
        return $1224;
    };
    const Fm$Term$bind = x0 => x1 => x2 => Fm$Term$bind$(x0, x1, x2);
    const Fm$Status$done = ({
        _: 'Fm.Status.done'
    });

    function Fm$set$(_name$2, _val$3, _map$4) {
        var $1287 = Map$set$((fm_name_to_bits(_name$2)), _val$3, _map$4);
        return $1287;
    };
    const Fm$set = x0 => x1 => x2 => Fm$set$(x0, x1, x2);

    function Fm$define$(_file$1, _code$2, _name$3, _term$4, _type$5, _done$6, _defs$7) {
        var self = _done$6;
        if (self) {
            var $1289 = Fm$Status$done;
            var _stat$8 = $1289;
        } else {
            var $1290 = Fm$Status$init;
            var _stat$8 = $1290;
        };
        var $1288 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$4, _type$5, _stat$8), _defs$7);
        return $1288;
    };
    const Fm$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Fm$define$(x0, x1, x2, x3, x4, x5, x6);

    function Fm$Parser$file$def$(_file$1, _code$2, _defs$3) {
        var $1291 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$4 => {
            var $1292 = Monad$bind$(Parser$monad)(Parser$many$(Fm$Parser$binder))((_args$5 => {
                var _args$6 = List$flatten$(_args$5);
                var $1293 = Monad$bind$(Parser$monad)(Fm$Parser$text$(":"))((_$7 => {
                    var $1294 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_type$8 => {
                        var $1295 = Monad$bind$(Parser$monad)(Fm$Parser$term)((_term$9 => {
                            var _type$10 = Fm$Parser$make_forall$(_args$6, _type$8);
                            var _term$11 = Fm$Parser$make_lambda$(List$mapped$(_args$6, (_x$11 => {
                                var self = _x$11;
                                switch (self._) {
                                    case 'Fm.Binder.new':
                                        var $1298 = self.eras;
                                        var $1299 = self.name;
                                        var $1300 = self.term;
                                        var $1301 = $1299;
                                        var $1297 = $1301;
                                        break;
                                };
                                return $1297;
                            })), _term$9);
                            var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                                var $1302 = (_x$12 + '1');
                                return $1302;
                            }), _type$10);
                            var _term$13 = Fm$Term$bind$(List$nil, (_x$13 => {
                                var $1303 = (_x$13 + '0');
                                return $1303;
                            }), _term$11);
                            var _defs$14 = Fm$define$(_file$1, _code$2, _name$4, _term$13, _type$12, Bool$false, _defs$3);
                            var $1296 = Monad$pure$(Parser$monad)(_defs$14);
                            return $1296;
                        }));
                        return $1295;
                    }));
                    return $1294;
                }));
                return $1293;
            }));
            return $1292;
        }));
        return $1291;
    };
    const Fm$Parser$file$def = x0 => x1 => x2 => Fm$Parser$file$def$(x0, x1, x2);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $1305 = _a$2;
                var $1304 = $1305;
                break;
            case 'Maybe.some':
                var $1306 = self.value;
                var $1307 = $1306;
                var $1304 = $1307;
                break;
        };
        return $1304;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Fm$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $1308 = ({
            _: 'Fm.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $1308;
    };
    const Fm$Constructor$new = x0 => x1 => x2 => Fm$Constructor$new$(x0, x1, x2);

    function Fm$Parser$constructor$(_namespace$1) {
        var $1309 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1310 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_args$3 => {
                var $1311 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1312 = Fm$Parser$binder;
                    return $1312;
                }))))((_inds$4 => {
                    var _args$5 = Maybe$default$(List$nil, _args$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1313 = Monad$pure$(Parser$monad)(Fm$Constructor$new$(_name$2, _args$5, _inds$6));
                    return $1313;
                }));
                return $1311;
            }));
            return $1310;
        }));
        return $1309;
    };
    const Fm$Parser$constructor = x0 => Fm$Parser$constructor$(x0);

    function Fm$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $1314 = ({
            _: 'Fm.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $1314;
    };
    const Fm$Datatype$new = x0 => x1 => x2 => x3 => Fm$Datatype$new$(x0, x1, x2, x3);
    const Fm$Parser$datatype = Monad$bind$(Parser$monad)(Fm$Parser$text$("type "))((_$1 => {
        var $1315 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_name$2 => {
            var $1316 = Monad$bind$(Parser$monad)(Parser$maybe(Fm$Parser$binder))((_pars$3 => {
                var $1317 = Monad$bind$(Parser$monad)(Parser$maybe(Monad$bind$(Parser$monad)(Fm$Parser$text$("~"))((_$4 => {
                    var $1318 = Fm$Parser$binder;
                    return $1318;
                }))))((_inds$4 => {
                    var _pars$5 = Maybe$default$(List$nil, _pars$3);
                    var _inds$6 = Maybe$default$(List$nil, _inds$4);
                    var $1319 = Monad$bind$(Parser$monad)(Fm$Parser$text$("{"))((_$7 => {
                        var $1320 = Monad$bind$(Parser$monad)(Parser$until$(Fm$Parser$text$("}"), Fm$Parser$item$(Fm$Parser$constructor$(_name$2))))((_ctrs$8 => {
                            var $1321 = Monad$pure$(Parser$monad)(Fm$Datatype$new$(_name$2, _pars$5, _inds$6, _ctrs$8));
                            return $1321;
                        }));
                        return $1320;
                    }));
                    return $1319;
                }));
                return $1317;
            }));
            return $1316;
        }));
        return $1315;
    }));

    function Fm$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1324 = self.name;
                        var $1325 = self.pars;
                        var $1326 = self.inds;
                        var $1327 = self.ctrs;
                        var _slf$8 = Fm$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $1330 = _slf$8;
                            var $1331 = $1325;
                            let _slf$10 = $1330;
                            let _var$9;
                            while ($1331._ === 'List.cons') {
                                _var$9 = $1331.head;
                                var $1330 = Fm$Term$app$(_slf$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1332 = self.eras;
                                            var $1333 = self.name;
                                            var $1334 = self.term;
                                            var $1335 = $1333;
                                            return $1335;
                                    };
                                })()));
                                _slf$10 = $1330;
                                $1331 = $1331.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $1337 = _slf$9;
                            var $1338 = $1326;
                            let _slf$11 = $1337;
                            let _var$10;
                            while ($1338._ === 'List.cons') {
                                _var$10 = $1338.head;
                                var $1337 = Fm$Term$app$(_slf$11, Fm$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1339 = self.eras;
                                            var $1340 = self.name;
                                            var $1341 = self.term;
                                            var $1342 = $1340;
                                            return $1342;
                                    };
                                })()));
                                _slf$11 = $1337;
                                $1338 = $1338.tail;
                            }
                            return _slf$11;
                        })();
                        var $1328 = Fm$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $1343 = Fm$Term$typ;
                            return $1343;
                        }));
                        var $1323 = $1328;
                        break;
                };
                var $1322 = $1323;
                break;
            case 'List.cons':
                var $1344 = self.head;
                var $1345 = self.tail;
                var self = $1344;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1347 = self.eras;
                        var $1348 = self.name;
                        var $1349 = self.term;
                        var $1350 = Fm$Term$all$($1347, "", $1348, $1349, (_s$9 => _x$10 => {
                            var $1351 = Fm$Datatype$build_term$motive$go$(_type$1, _name$2, $1345);
                            return $1351;
                        }));
                        var $1346 = $1350;
                        break;
                };
                var $1322 = $1346;
                break;
        };
        return $1322;
    };
    const Fm$Datatype$build_term$motive$go = x0 => x1 => x2 => Fm$Datatype$build_term$motive$go$(x0, x1, x2);

    function Fm$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1353 = self.name;
                var $1354 = self.pars;
                var $1355 = self.inds;
                var $1356 = self.ctrs;
                var $1357 = Fm$Datatype$build_term$motive$go$(_type$1, $1353, $1355);
                var $1352 = $1357;
                break;
        };
        return $1352;
    };
    const Fm$Datatype$build_term$motive = x0 => Fm$Datatype$build_term$motive$(x0);

    function Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1360 = self.name;
                        var $1361 = self.pars;
                        var $1362 = self.inds;
                        var $1363 = self.ctrs;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Fm.Constructor.new':
                                var $1365 = self.name;
                                var $1366 = self.args;
                                var $1367 = self.inds;
                                var _ret$11 = Fm$Term$ref$(Fm$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $1370 = _ret$11;
                                    var $1371 = $1367;
                                    let _ret$13 = $1370;
                                    let _var$12;
                                    while ($1371._ === 'List.cons') {
                                        _var$12 = $1371.head;
                                        var $1370 = Fm$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1372 = self.eras;
                                                    var $1373 = self.name;
                                                    var $1374 = self.term;
                                                    var $1375 = $1374;
                                                    return $1375;
                                            };
                                        })());
                                        _ret$13 = $1370;
                                        $1371 = $1371.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($1360, List$cons$(Fm$Name$read$("."), List$cons$($1365, List$nil))));
                                var _slf$14 = Fm$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $1377 = _slf$14;
                                    var $1378 = $1361;
                                    let _slf$16 = $1377;
                                    let _var$15;
                                    while ($1378._ === 'List.cons') {
                                        _var$15 = $1378.head;
                                        var $1377 = Fm$Term$app$(_slf$16, Fm$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1379 = self.eras;
                                                    var $1380 = self.name;
                                                    var $1381 = self.term;
                                                    var $1382 = $1380;
                                                    return $1382;
                                            };
                                        })()));
                                        _slf$16 = $1377;
                                        $1378 = $1378.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $1384 = _slf$15;
                                    var $1385 = $1366;
                                    let _slf$17 = $1384;
                                    let _var$16;
                                    while ($1385._ === 'List.cons') {
                                        _var$16 = $1385.head;
                                        var $1384 = Fm$Term$app$(_slf$17, Fm$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Fm.Binder.new':
                                                    var $1386 = self.eras;
                                                    var $1387 = self.name;
                                                    var $1388 = self.term;
                                                    var $1389 = $1387;
                                                    return $1389;
                                            };
                                        })()));
                                        _slf$17 = $1384;
                                        $1385 = $1385.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $1368 = Fm$Term$app$(_ret$12, _slf$16);
                                var $1364 = $1368;
                                break;
                        };
                        var $1359 = $1364;
                        break;
                };
                var $1358 = $1359;
                break;
            case 'List.cons':
                var $1390 = self.head;
                var $1391 = self.tail;
                var self = $1390;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1393 = self.eras;
                        var $1394 = self.name;
                        var $1395 = self.term;
                        var _eras$9 = $1393;
                        var _name$10 = $1394;
                        var _xtyp$11 = $1395;
                        var _body$12 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1391);
                        var $1396 = Fm$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $1397 = _body$12;
                            return $1397;
                        }));
                        var $1392 = $1396;
                        break;
                };
                var $1358 = $1392;
                break;
        };
        return $1358;
    };
    const Fm$Datatype$build_term$constructor$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Fm.Constructor.new':
                var $1399 = self.name;
                var $1400 = self.args;
                var $1401 = self.inds;
                var $1402 = Fm$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $1400);
                var $1398 = $1402;
                break;
        };
        return $1398;
    };
    const Fm$Datatype$build_term$constructor = x0 => x1 => Fm$Datatype$build_term$constructor$(x0, x1);

    function Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Fm.Datatype.new':
                        var $1405 = self.name;
                        var $1406 = self.pars;
                        var $1407 = self.inds;
                        var $1408 = self.ctrs;
                        var _ret$8 = Fm$Term$ref$(Fm$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $1411 = _ret$8;
                            var $1412 = $1407;
                            let _ret$10 = $1411;
                            let _var$9;
                            while ($1412._ === 'List.cons') {
                                _var$9 = $1412.head;
                                var $1411 = Fm$Term$app$(_ret$10, Fm$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1413 = self.eras;
                                            var $1414 = self.name;
                                            var $1415 = self.term;
                                            var $1416 = $1414;
                                            return $1416;
                                    };
                                })()));
                                _ret$10 = $1411;
                                $1412 = $1412.tail;
                            }
                            return _ret$10;
                        })();
                        var $1409 = Fm$Term$app$(_ret$9, Fm$Term$ref$((_name$2 + ".Self")));
                        var $1404 = $1409;
                        break;
                };
                var $1403 = $1404;
                break;
            case 'List.cons':
                var $1417 = self.head;
                var $1418 = self.tail;
                var self = $1417;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1420 = self.name;
                        var $1421 = self.args;
                        var $1422 = self.inds;
                        var $1423 = Fm$Term$all$(Bool$false, "", $1420, Fm$Datatype$build_term$constructor$(_type$1, $1417), (_s$9 => _x$10 => {
                            var $1424 = Fm$Datatype$build_term$constructors$go$(_type$1, _name$2, $1418);
                            return $1424;
                        }));
                        var $1419 = $1423;
                        break;
                };
                var $1403 = $1419;
                break;
        };
        return $1403;
    };
    const Fm$Datatype$build_term$constructors$go = x0 => x1 => x2 => Fm$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Fm$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1426 = self.name;
                var $1427 = self.pars;
                var $1428 = self.inds;
                var $1429 = self.ctrs;
                var $1430 = Fm$Datatype$build_term$constructors$go$(_type$1, $1426, $1429);
                var $1425 = $1430;
                break;
        };
        return $1425;
    };
    const Fm$Datatype$build_term$constructors = x0 => Fm$Datatype$build_term$constructors$(x0);

    function Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1433 = Fm$Term$all$(Bool$true, (_name$2 + ".Self"), Fm$Name$read$("P"), Fm$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $1434 = Fm$Datatype$build_term$constructors$(_type$1);
                            return $1434;
                        }));
                        var $1432 = $1433;
                        break;
                    case 'List.cons':
                        var $1435 = self.head;
                        var $1436 = self.tail;
                        var self = $1435;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1438 = self.eras;
                                var $1439 = self.name;
                                var $1440 = self.term;
                                var $1441 = Fm$Term$lam$($1439, (_x$10 => {
                                    var $1442 = Fm$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $1436);
                                    return $1442;
                                }));
                                var $1437 = $1441;
                                break;
                        };
                        var $1432 = $1437;
                        break;
                };
                var $1431 = $1432;
                break;
            case 'List.cons':
                var $1443 = self.head;
                var $1444 = self.tail;
                var self = $1443;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1446 = self.eras;
                        var $1447 = self.name;
                        var $1448 = self.term;
                        var $1449 = Fm$Term$lam$($1447, (_x$10 => {
                            var $1450 = Fm$Datatype$build_term$go$(_type$1, _name$2, $1444, _inds$4);
                            return $1450;
                        }));
                        var $1445 = $1449;
                        break;
                };
                var $1431 = $1445;
                break;
        };
        return $1431;
    };
    const Fm$Datatype$build_term$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_term$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1452 = self.name;
                var $1453 = self.pars;
                var $1454 = self.inds;
                var $1455 = self.ctrs;
                var $1456 = Fm$Datatype$build_term$go$(_type$1, $1452, $1453, $1454);
                var $1451 = $1456;
                break;
        };
        return $1451;
    };
    const Fm$Datatype$build_term = x0 => Fm$Datatype$build_term$(x0);

    function Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.nil':
                        var $1459 = Fm$Term$typ;
                        var $1458 = $1459;
                        break;
                    case 'List.cons':
                        var $1460 = self.head;
                        var $1461 = self.tail;
                        var self = $1460;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1463 = self.eras;
                                var $1464 = self.name;
                                var $1465 = self.term;
                                var $1466 = Fm$Term$all$(Bool$false, "", $1464, $1465, (_s$10 => _x$11 => {
                                    var $1467 = Fm$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $1461);
                                    return $1467;
                                }));
                                var $1462 = $1466;
                                break;
                        };
                        var $1458 = $1462;
                        break;
                };
                var $1457 = $1458;
                break;
            case 'List.cons':
                var $1468 = self.head;
                var $1469 = self.tail;
                var self = $1468;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1471 = self.eras;
                        var $1472 = self.name;
                        var $1473 = self.term;
                        var $1474 = Fm$Term$all$(Bool$false, "", $1472, $1473, (_s$10 => _x$11 => {
                            var $1475 = Fm$Datatype$build_type$go$(_type$1, _name$2, $1469, _inds$4);
                            return $1475;
                        }));
                        var $1470 = $1474;
                        break;
                };
                var $1457 = $1470;
                break;
        };
        return $1457;
    };
    const Fm$Datatype$build_type$go = x0 => x1 => x2 => x3 => Fm$Datatype$build_type$go$(x0, x1, x2, x3);

    function Fm$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1477 = self.name;
                var $1478 = self.pars;
                var $1479 = self.inds;
                var $1480 = self.ctrs;
                var $1481 = Fm$Datatype$build_type$go$(_type$1, $1477, $1478, $1479);
                var $1476 = $1481;
                break;
        };
        return $1476;
    };
    const Fm$Datatype$build_type = x0 => Fm$Datatype$build_type$(x0);

    function Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1484 = self.name;
                        var $1485 = self.args;
                        var $1486 = self.inds;
                        var _ret$7 = Fm$Term$ref$($1484);
                        var _ret$8 = (() => {
                            var $1489 = _ret$7;
                            var $1490 = $1485;
                            let _ret$9 = $1489;
                            let _arg$8;
                            while ($1490._ === 'List.cons') {
                                _arg$8 = $1490.head;
                                var $1489 = Fm$Term$app$(_ret$9, Fm$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Fm.Binder.new':
                                            var $1491 = self.eras;
                                            var $1492 = self.name;
                                            var $1493 = self.term;
                                            var $1494 = $1492;
                                            return $1494;
                                    };
                                })()));
                                _ret$9 = $1489;
                                $1490 = $1490.tail;
                            }
                            return _ret$9;
                        })();
                        var $1487 = _ret$8;
                        var $1483 = $1487;
                        break;
                };
                var $1482 = $1483;
                break;
            case 'List.cons':
                var $1495 = self.head;
                var $1496 = self.tail;
                var self = $1495;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1498 = self.name;
                        var $1499 = self.args;
                        var $1500 = self.inds;
                        var $1501 = Fm$Term$lam$($1498, (_x$9 => {
                            var $1502 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1496);
                            return $1502;
                        }));
                        var $1497 = $1501;
                        break;
                };
                var $1482 = $1497;
                break;
        };
        return $1482;
    };
    const Fm$Constructor$build_term$opt$go = x0 => x1 => x2 => Fm$Constructor$build_term$opt$go$(x0, x1, x2);

    function Fm$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1504 = self.name;
                var $1505 = self.pars;
                var $1506 = self.inds;
                var $1507 = self.ctrs;
                var $1508 = Fm$Constructor$build_term$opt$go$(_type$1, _ctor$2, $1507);
                var $1503 = $1508;
                break;
        };
        return $1503;
    };
    const Fm$Constructor$build_term$opt = x0 => x1 => Fm$Constructor$build_term$opt$(x0, x1);

    function Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.nil':
                        var $1511 = Fm$Term$lam$(Fm$Name$read$("P"), (_x$6 => {
                            var $1512 = Fm$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $1512;
                        }));
                        var $1510 = $1511;
                        break;
                    case 'List.cons':
                        var $1513 = self.head;
                        var $1514 = self.tail;
                        var self = $1513;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1516 = self.eras;
                                var $1517 = self.name;
                                var $1518 = self.term;
                                var $1519 = Fm$Term$lam$($1517, (_x$11 => {
                                    var $1520 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $1514);
                                    return $1520;
                                }));
                                var $1515 = $1519;
                                break;
                        };
                        var $1510 = $1515;
                        break;
                };
                var $1509 = $1510;
                break;
            case 'List.cons':
                var $1521 = self.head;
                var $1522 = self.tail;
                var self = $1521;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1524 = self.eras;
                        var $1525 = self.name;
                        var $1526 = self.term;
                        var $1527 = Fm$Term$lam$($1525, (_x$11 => {
                            var $1528 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $1522, _args$5);
                            return $1528;
                        }));
                        var $1523 = $1527;
                        break;
                };
                var $1509 = $1523;
                break;
        };
        return $1509;
    };
    const Fm$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1530 = self.name;
                var $1531 = self.pars;
                var $1532 = self.inds;
                var $1533 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1535 = self.name;
                        var $1536 = self.args;
                        var $1537 = self.inds;
                        var $1538 = Fm$Constructor$build_term$go$(_type$1, _ctor$2, $1530, $1531, $1536);
                        var $1534 = $1538;
                        break;
                };
                var $1529 = $1534;
                break;
        };
        return $1529;
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
                                var $1542 = self.name;
                                var $1543 = self.pars;
                                var $1544 = self.inds;
                                var $1545 = self.ctrs;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Fm.Constructor.new':
                                        var $1547 = self.name;
                                        var $1548 = self.args;
                                        var $1549 = self.inds;
                                        var _type$13 = Fm$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $1552 = _type$13;
                                            var $1553 = $1543;
                                            let _type$15 = $1552;
                                            let _var$14;
                                            while ($1553._ === 'List.cons') {
                                                _var$14 = $1553.head;
                                                var $1552 = Fm$Term$app$(_type$15, Fm$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1554 = self.eras;
                                                            var $1555 = self.name;
                                                            var $1556 = self.term;
                                                            var $1557 = $1555;
                                                            return $1557;
                                                    };
                                                })()));
                                                _type$15 = $1552;
                                                $1553 = $1553.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $1559 = _type$14;
                                            var $1560 = $1549;
                                            let _type$16 = $1559;
                                            let _var$15;
                                            while ($1560._ === 'List.cons') {
                                                _var$15 = $1560.head;
                                                var $1559 = Fm$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Fm.Binder.new':
                                                            var $1561 = self.eras;
                                                            var $1562 = self.name;
                                                            var $1563 = self.term;
                                                            var $1564 = $1563;
                                                            return $1564;
                                                    };
                                                })());
                                                _type$16 = $1559;
                                                $1560 = $1560.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $1550 = _type$15;
                                        var $1546 = $1550;
                                        break;
                                };
                                var $1541 = $1546;
                                break;
                        };
                        var $1540 = $1541;
                        break;
                    case 'List.cons':
                        var $1565 = self.head;
                        var $1566 = self.tail;
                        var self = $1565;
                        switch (self._) {
                            case 'Fm.Binder.new':
                                var $1568 = self.eras;
                                var $1569 = self.name;
                                var $1570 = self.term;
                                var $1571 = Fm$Term$all$($1568, "", $1569, $1570, (_s$11 => _x$12 => {
                                    var $1572 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $1566);
                                    return $1572;
                                }));
                                var $1567 = $1571;
                                break;
                        };
                        var $1540 = $1567;
                        break;
                };
                var $1539 = $1540;
                break;
            case 'List.cons':
                var $1573 = self.head;
                var $1574 = self.tail;
                var self = $1573;
                switch (self._) {
                    case 'Fm.Binder.new':
                        var $1576 = self.eras;
                        var $1577 = self.name;
                        var $1578 = self.term;
                        var $1579 = Fm$Term$all$($1576, "", $1577, $1578, (_s$11 => _x$12 => {
                            var $1580 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $1574, _args$5);
                            return $1580;
                        }));
                        var $1575 = $1579;
                        break;
                };
                var $1539 = $1575;
                break;
        };
        return $1539;
    };
    const Fm$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Fm$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Fm$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Fm.Datatype.new':
                var $1582 = self.name;
                var $1583 = self.pars;
                var $1584 = self.inds;
                var $1585 = self.ctrs;
                var self = _ctor$2;
                switch (self._) {
                    case 'Fm.Constructor.new':
                        var $1587 = self.name;
                        var $1588 = self.args;
                        var $1589 = self.inds;
                        var $1590 = Fm$Constructor$build_type$go$(_type$1, _ctor$2, $1582, $1583, $1588);
                        var $1586 = $1590;
                        break;
                };
                var $1581 = $1586;
                break;
        };
        return $1581;
    };
    const Fm$Constructor$build_type = x0 => x1 => Fm$Constructor$build_type$(x0, x1);

    function Fm$Parser$file$adt$(_file$1, _code$2, _defs$3) {
        var $1591 = Monad$bind$(Parser$monad)(Fm$Parser$datatype)((_adt$4 => {
            var self = _adt$4;
            switch (self._) {
                case 'Fm.Datatype.new':
                    var $1593 = self.name;
                    var $1594 = self.pars;
                    var $1595 = self.inds;
                    var $1596 = self.ctrs;
                    var _term$9 = Fm$Datatype$build_term$(_adt$4);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $1598 = (_x$10 + '1');
                        return $1598;
                    }), _term$9);
                    var _type$11 = Fm$Datatype$build_type$(_adt$4);
                    var _type$12 = Fm$Term$bind$(List$nil, (_x$12 => {
                        var $1599 = (_x$12 + '0');
                        return $1599;
                    }), _type$11);
                    var _defs$13 = Fm$define$(_file$1, _code$2, $1593, _term$10, _type$12, Bool$false, _defs$3);
                    var _defs$14 = List$fold$($1596, _defs$13, (_ctr$14 => _defs$15 => {
                        var _typ_name$16 = $1593;
                        var _ctr_name$17 = String$flatten$(List$cons$(_typ_name$16, List$cons$(Fm$Name$read$("."), List$cons$((() => {
                            var self = _ctr$14;
                            switch (self._) {
                                case 'Fm.Constructor.new':
                                    var $1601 = self.name;
                                    var $1602 = self.args;
                                    var $1603 = self.inds;
                                    var $1604 = $1601;
                                    return $1604;
                            };
                        })(), List$nil))));
                        var _ctr_term$18 = Fm$Constructor$build_term$(_adt$4, _ctr$14);
                        var _ctr_term$19 = Fm$Term$bind$(List$nil, (_x$19 => {
                            var $1605 = (_x$19 + '1');
                            return $1605;
                        }), _ctr_term$18);
                        var _ctr_type$20 = Fm$Constructor$build_type$(_adt$4, _ctr$14);
                        var _ctr_type$21 = Fm$Term$bind$(List$nil, (_x$21 => {
                            var $1606 = (_x$21 + '0');
                            return $1606;
                        }), _ctr_type$20);
                        var $1600 = Fm$define$(_file$1, _code$2, _ctr_name$17, _ctr_term$19, _ctr_type$21, Bool$false, _defs$15);
                        return $1600;
                    }));
                    var $1597 = Monad$pure$(Parser$monad)(_defs$14);
                    var $1592 = $1597;
                    break;
            };
            return $1592;
        }));
        return $1591;
    };
    const Fm$Parser$file$adt = x0 => x1 => x2 => Fm$Parser$file$adt$(x0, x1, x2);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $1608 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $1607 = $1608;
        } else {
            var $1609 = self.charCodeAt(0);
            var $1610 = self.slice(1);
            var $1611 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $1607 = $1611;
        };
        return $1607;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Fm$Parser$file$end$(_file$1, _code$2, _defs$3) {
        var $1612 = Monad$bind$(Parser$monad)(Fm$Parser$spaces)((_$4 => {
            var $1613 = Monad$bind$(Parser$monad)(Parser$eof)((_$5 => {
                var $1614 = Monad$pure$(Parser$monad)(_defs$3);
                return $1614;
            }));
            return $1613;
        }));
        return $1612;
    };
    const Fm$Parser$file$end = x0 => x1 => x2 => Fm$Parser$file$end$(x0, x1, x2);

    function Fm$Parser$file$(_file$1, _code$2, _defs$3) {
        var $1615 = Monad$bind$(Parser$monad)(Parser$is_eof)((_stop$4 => {
            var self = _stop$4;
            if (self) {
                var $1617 = Monad$pure$(Parser$monad)(_defs$3);
                var $1616 = $1617;
            } else {
                var $1618 = Parser$first_of$(List$cons$(Monad$bind$(Parser$monad)(Fm$Parser$text$("#"))((_$5 => {
                    var $1619 = Monad$bind$(Parser$monad)(Fm$Parser$name1)((_file$6 => {
                        var $1620 = Fm$Parser$file$(_file$6, _code$2, _defs$3);
                        return $1620;
                    }));
                    return $1619;
                })), List$cons$(Monad$bind$(Parser$monad)(Parser$first_of$(List$cons$(Fm$Parser$file$def$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$adt$(_file$1, _code$2, _defs$3), List$cons$(Fm$Parser$file$end$(_file$1, _code$2, _defs$3), List$nil)))))((_defs$5 => {
                    var $1621 = Fm$Parser$file$(_file$1, _code$2, _defs$5);
                    return $1621;
                })), List$nil)));
                var $1616 = $1618;
            };
            return $1616;
        }));
        return $1615;
    };
    const Fm$Parser$file = x0 => x1 => x2 => Fm$Parser$file$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $1622 = null;
        return $1622;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $1624 = "";
                var $1623 = $1624;
                break;
            case 'List.cons':
                var $1625 = self.head;
                var $1626 = self.tail;
                var $1627 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $1628 = "";
                        return $1628;
                    } else {
                        var $1629 = _sep$1;
                        return $1629;
                    };
                })(), List$cons$($1625, List$cons$(String$join$go$(_sep$1, $1626, Bool$false), List$nil))));
                var $1623 = $1627;
                break;
        };
        return $1623;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $1630 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $1630;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Fm$highlight$end$(_col$1, _row$2, _res$3) {
        var $1631 = String$join$("\u{a}", _res$3);
        return $1631;
    };
    const Fm$highlight$end = x0 => x1 => x2 => Fm$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1633 = _a$4;
                var $1632 = $1633;
                break;
            case 'Maybe.some':
                var $1634 = self.value;
                var $1635 = _f$5($1634);
                var $1632 = $1635;
                break;
        };
        return $1632;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1637 = Bool$true;
            var $1636 = $1637;
        } else {
            var $1638 = (self - 1n);
            var $1639 = Bool$false;
            var $1636 = $1639;
        };
        return $1636;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1641 = Nat$zero;
            var $1640 = $1641;
        } else {
            var $1642 = (self - 1n);
            var $1643 = Nat$succ$(Nat$succ$(Nat$double$($1642)));
            var $1640 = $1643;
        };
        return $1640;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1645 = Nat$zero;
            var $1644 = $1645;
        } else {
            var $1646 = (self - 1n);
            var $1647 = $1646;
            var $1644 = $1647;
        };
        return $1644;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.nil':
                var $1649 = List$nil;
                var $1648 = $1649;
                break;
            case 'List.cons':
                var $1650 = self.head;
                var $1651 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $1653 = List$nil;
                    var $1652 = $1653;
                } else {
                    var $1654 = (self - 1n);
                    var $1655 = List$cons$($1650, List$take$($1654, $1651));
                    var $1652 = $1655;
                };
                var $1648 = $1652;
                break;
        };
        return $1648;
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
                    var $1656 = _res$2;
                    return $1656;
                } else {
                    var $1657 = self.charCodeAt(0);
                    var $1658 = self.slice(1);
                    var $1659 = String$reverse$go$($1658, String$cons$($1657, _res$2));
                    return $1659;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1660 = String$reverse$go$(_xs$1, String$nil);
        return $1660;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $1662 = _str$3;
            var $1661 = $1662;
        } else {
            var $1663 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $1665 = String$cons$(_chr$2, String$pad_right$($1663, _chr$2, ""));
                var $1664 = $1665;
            } else {
                var $1666 = self.charCodeAt(0);
                var $1667 = self.slice(1);
                var $1668 = String$cons$($1666, String$pad_right$($1663, _chr$2, $1667));
                var $1664 = $1668;
            };
            var $1661 = $1664;
        };
        return $1661;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $1669 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $1669;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $1670 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $1670;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $1671 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $1671;
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
                    var $1672 = Either$left$(_n$1);
                    return $1672;
                } else {
                    var $1673 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1675 = Either$right$(Nat$succ$($1673));
                        var $1674 = $1675;
                    } else {
                        var $1676 = (self - 1n);
                        var $1677 = Nat$sub_rem$($1676, $1673);
                        var $1674 = $1677;
                    };
                    return $1674;
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
                        var $1678 = self.value;
                        var $1679 = Nat$div_mod$go$($1678, _m$2, Nat$succ$(_d$3));
                        return $1679;
                    case 'Either.right':
                        var $1680 = self.value;
                        var $1681 = Pair$new$(_d$3, _n$1);
                        return $1681;
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
                        var $1682 = self.fst;
                        var $1683 = self.snd;
                        var self = $1682;
                        if (self === 0n) {
                            var $1685 = List$cons$($1683, _res$3);
                            var $1684 = $1685;
                        } else {
                            var $1686 = (self - 1n);
                            var $1687 = Nat$to_base$go$(_base$1, $1682, List$cons$($1683, _res$3));
                            var $1684 = $1687;
                        };
                        return $1684;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $1688 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $1688;
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
                    var $1689 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $1689;
                } else {
                    var $1690 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1692 = _r$3;
                        var $1691 = $1692;
                    } else {
                        var $1693 = (self - 1n);
                        var $1694 = Nat$mod$go$($1693, $1690, Nat$succ$(_r$3));
                        var $1691 = $1694;
                    };
                    return $1691;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $1695 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $1695;
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
                    var $1698 = 35;
                    var $1697 = $1698;
                    break;
                case 'Maybe.some':
                    var $1699 = self.value;
                    var $1700 = $1699;
                    var $1697 = $1700;
                    break;
            };
            var $1696 = $1697;
        } else {
            var $1701 = 35;
            var $1696 = $1701;
        };
        return $1696;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $1702 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $1703 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $1703;
        }));
        return $1702;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $1704 = Nat$to_string_base$(10n, _n$1);
        return $1704;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Fm$color$(_col$1, _str$2) {
        var $1705 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $1705;
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
                    var $1706 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    return $1706;
                } else {
                    var $1707 = self.charCodeAt(0);
                    var $1708 = self.slice(1);
                    var self = ($1707 === 10);
                    if (self) {
                        var _stp$11 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$11;
                        if (self) {
                            var $1711 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $1710 = $1711;
                        } else {
                            var _spa$12 = 3n;
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$12));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $1714 = Maybe$some$(_spa$12);
                                        var $1713 = $1714;
                                        break;
                                    case 'Maybe.some':
                                        var $1715 = self.value;
                                        var $1716 = Maybe$some$(Nat$pred$($1715));
                                        var $1713 = $1716;
                                        break;
                                };
                                var _lft$14 = $1713;
                            } else {
                                var $1717 = (self - 1n);
                                var $1718 = _lft$6;
                                var _lft$14 = $1718;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$take$(_siz$13, List$cons$(String$reverse$(_lin$7), _res$8));
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $1712 = Fm$highlight$tc$($1708, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $1710 = $1712;
                        };
                        var $1709 = $1710;
                    } else {
                        var _chr$11 = String$cons$($1707, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $1720 = String$reverse$(Fm$color$("31", Fm$color$("4", _chr$11)));
                            var _chr$12 = $1720;
                        } else {
                            var $1721 = _chr$11;
                            var _chr$12 = $1721;
                        };
                        var _ix0$13 = Nat$pred$(_ix0$2);
                        var _ix1$14 = Nat$pred$(_ix1$3);
                        var _col$15 = Nat$succ$(_col$4);
                        var _lin$16 = String$flatten$(List$cons$(_chr$12, List$cons$(_lin$7, List$nil)));
                        var $1719 = Fm$highlight$tc$($1708, _ix0$13, _ix1$14, _col$15, _row$5, _lft$6, _lin$16, _res$8);
                        var $1709 = $1719;
                    };
                    return $1709;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $1722 = Fm$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $1722;
    };
    const Fm$highlight = x0 => x1 => x2 => Fm$highlight$(x0, x1, x2);

    function Fm$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Fm$Parser$file$(_file$1, _code$2, _defs$3)(0n)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1724 = self.idx;
                var $1725 = self.code;
                var $1726 = self.err;
                var _err$7 = $1726;
                var _hig$8 = Fm$highlight$(_code$2, $1724, Nat$succ$($1724));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $1727 = Either$left$(_str$9);
                var $1723 = $1727;
                break;
            case 'Parser.Reply.value':
                var $1728 = self.idx;
                var $1729 = self.code;
                var $1730 = self.val;
                var $1731 = Either$right$($1730);
                var $1723 = $1731;
                break;
        };
        return $1723;
    };
    const Fm$Defs$read = x0 => x1 => x2 => Fm$Defs$read$(x0, x1, x2);

    function Fm$Synth$load$(_name$1, _defs$2) {
        var _file$3 = Fm$Synth$file_of$(_name$1);
        var $1732 = Monad$bind$(IO$monad)(IO$get_file$(_file$3))((_code$4 => {
            var _read$5 = Fm$Defs$read$(_file$3, _code$4, _defs$2);
            var self = _read$5;
            switch (self._) {
                case 'Either.left':
                    var $1734 = self.value;
                    var $1735 = Monad$pure$(IO$monad)(Maybe$none);
                    var $1733 = $1735;
                    break;
                case 'Either.right':
                    var $1736 = self.value;
                    var _defs$7 = $1736;
                    var self = Fm$get$(_name$1, _defs$7);
                    switch (self._) {
                        case 'Maybe.none':
                            var $1738 = Monad$pure$(IO$monad)(Maybe$none);
                            var $1737 = $1738;
                            break;
                        case 'Maybe.some':
                            var $1739 = self.value;
                            var $1740 = Monad$pure$(IO$monad)(Maybe$some$(_defs$7));
                            var $1737 = $1740;
                            break;
                    };
                    var $1733 = $1737;
                    break;
            };
            return $1733;
        }));
        return $1732;
    };
    const Fm$Synth$load = x0 => x1 => Fm$Synth$load$(x0, x1);

    function IO$print$(_text$1) {
        var $1741 = IO$ask$("print", _text$1, (_skip$2 => {
            var $1742 = IO$end$(Unit$new);
            return $1742;
        }));
        return $1741;
    };
    const IO$print = x0 => IO$print$(x0);
    const Fm$Status$wait = ({
        _: 'Fm.Status.wait'
    });

    function Fm$Check$(_V$1) {
        var $1743 = null;
        return $1743;
    };
    const Fm$Check = x0 => Fm$Check$(x0);

    function Fm$Check$result$(_value$2, _errors$3) {
        var $1744 = ({
            _: 'Fm.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $1744;
    };
    const Fm$Check$result = x0 => x1 => Fm$Check$result$(x0, x1);

    function Fm$Check$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'Fm.Check.result':
                var $1746 = self.value;
                var $1747 = self.errors;
                var self = $1746;
                switch (self._) {
                    case 'Maybe.none':
                        var $1749 = Fm$Check$result$(Maybe$none, $1747);
                        var $1748 = $1749;
                        break;
                    case 'Maybe.some':
                        var $1750 = self.value;
                        var self = _f$4($1750);
                        switch (self._) {
                            case 'Fm.Check.result':
                                var $1752 = self.value;
                                var $1753 = self.errors;
                                var $1754 = Fm$Check$result$($1752, List$concat$($1747, $1753));
                                var $1751 = $1754;
                                break;
                        };
                        var $1748 = $1751;
                        break;
                };
                var $1745 = $1748;
                break;
        };
        return $1745;
    };
    const Fm$Check$bind = x0 => x1 => Fm$Check$bind$(x0, x1);

    function Fm$Check$pure$(_value$2) {
        var $1755 = Fm$Check$result$(Maybe$some$(_value$2), List$nil);
        return $1755;
    };
    const Fm$Check$pure = x0 => Fm$Check$pure$(x0);
    const Fm$Check$monad = Monad$new$(Fm$Check$bind, Fm$Check$pure);

    function Fm$Error$undefined_reference$(_origin$1, _name$2) {
        var $1756 = ({
            _: 'Fm.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $1756;
    };
    const Fm$Error$undefined_reference = x0 => x1 => Fm$Error$undefined_reference$(x0, x1);

    function Fm$Error$waiting$(_name$1) {
        var $1757 = ({
            _: 'Fm.Error.waiting',
            'name': _name$1
        });
        return $1757;
    };
    const Fm$Error$waiting = x0 => Fm$Error$waiting$(x0);

    function Fm$Error$indirect$(_name$1) {
        var $1758 = ({
            _: 'Fm.Error.indirect',
            'name': _name$1
        });
        return $1758;
    };
    const Fm$Error$indirect = x0 => Fm$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1760 = Maybe$none;
                var $1759 = $1760;
                break;
            case 'Maybe.some':
                var $1761 = self.value;
                var $1762 = Maybe$some$(_f$4($1761));
                var $1759 = $1762;
                break;
        };
        return $1759;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Fm$MPath$o$(_path$1) {
        var $1763 = Maybe$mapped$(_path$1, Fm$Path$o);
        return $1763;
    };
    const Fm$MPath$o = x0 => Fm$MPath$o$(x0);

    function Fm$MPath$i$(_path$1) {
        var $1764 = Maybe$mapped$(_path$1, Fm$Path$i);
        return $1764;
    };
    const Fm$MPath$i = x0 => Fm$MPath$i$(x0);

    function Fm$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $1765 = ({
            _: 'Fm.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $1765;
    };
    const Fm$Error$cant_infer = x0 => x1 => x2 => Fm$Error$cant_infer$(x0, x1, x2);

    function Fm$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $1766 = ({
            _: 'Fm.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $1766;
    };
    const Fm$Error$type_mismatch = x0 => x1 => x2 => x3 => Fm$Error$type_mismatch$(x0, x1, x2, x3);

    function Fm$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $1767 = ({
            _: 'Fm.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $1767;
    };
    const Fm$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Fm$Error$show_goal$(x0, x1, x2, x3, x4);

    function Fm$Term$normalize$(_term$1, _defs$2) {
        var self = Fm$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $1769 = self.name;
                var $1770 = self.indx;
                var $1771 = Fm$Term$var$($1769, $1770);
                var $1768 = $1771;
                break;
            case 'Fm.Term.ref':
                var $1772 = self.name;
                var $1773 = Fm$Term$ref$($1772);
                var $1768 = $1773;
                break;
            case 'Fm.Term.typ':
                var $1774 = Fm$Term$typ;
                var $1768 = $1774;
                break;
            case 'Fm.Term.all':
                var $1775 = self.eras;
                var $1776 = self.self;
                var $1777 = self.name;
                var $1778 = self.xtyp;
                var $1779 = self.body;
                var $1780 = Fm$Term$all$($1775, $1776, $1777, Fm$Term$normalize$($1778, _defs$2), (_s$8 => _x$9 => {
                    var $1781 = Fm$Term$normalize$($1779(_s$8)(_x$9), _defs$2);
                    return $1781;
                }));
                var $1768 = $1780;
                break;
            case 'Fm.Term.lam':
                var $1782 = self.name;
                var $1783 = self.body;
                var $1784 = Fm$Term$lam$($1782, (_x$5 => {
                    var $1785 = Fm$Term$normalize$($1783(_x$5), _defs$2);
                    return $1785;
                }));
                var $1768 = $1784;
                break;
            case 'Fm.Term.app':
                var $1786 = self.func;
                var $1787 = self.argm;
                var $1788 = Fm$Term$app$(Fm$Term$normalize$($1786, _defs$2), Fm$Term$normalize$($1787, _defs$2));
                var $1768 = $1788;
                break;
            case 'Fm.Term.let':
                var $1789 = self.name;
                var $1790 = self.expr;
                var $1791 = self.body;
                var $1792 = Fm$Term$let$($1789, Fm$Term$normalize$($1790, _defs$2), (_x$6 => {
                    var $1793 = Fm$Term$normalize$($1791(_x$6), _defs$2);
                    return $1793;
                }));
                var $1768 = $1792;
                break;
            case 'Fm.Term.def':
                var $1794 = self.name;
                var $1795 = self.expr;
                var $1796 = self.body;
                var $1797 = Fm$Term$def$($1794, Fm$Term$normalize$($1795, _defs$2), (_x$6 => {
                    var $1798 = Fm$Term$normalize$($1796(_x$6), _defs$2);
                    return $1798;
                }));
                var $1768 = $1797;
                break;
            case 'Fm.Term.ann':
                var $1799 = self.done;
                var $1800 = self.term;
                var $1801 = self.type;
                var $1802 = Fm$Term$ann$($1799, Fm$Term$normalize$($1800, _defs$2), Fm$Term$normalize$($1801, _defs$2));
                var $1768 = $1802;
                break;
            case 'Fm.Term.gol':
                var $1803 = self.name;
                var $1804 = self.dref;
                var $1805 = self.verb;
                var $1806 = Fm$Term$gol$($1803, $1804, $1805);
                var $1768 = $1806;
                break;
            case 'Fm.Term.hol':
                var $1807 = self.path;
                var $1808 = Fm$Term$hol$($1807);
                var $1768 = $1808;
                break;
            case 'Fm.Term.nat':
                var $1809 = self.natx;
                var $1810 = Fm$Term$nat$($1809);
                var $1768 = $1810;
                break;
            case 'Fm.Term.chr':
                var $1811 = self.chrx;
                var $1812 = Fm$Term$chr$($1811);
                var $1768 = $1812;
                break;
            case 'Fm.Term.str':
                var $1813 = self.strx;
                var $1814 = Fm$Term$str$($1813);
                var $1768 = $1814;
                break;
            case 'Fm.Term.cse':
                var $1815 = self.path;
                var $1816 = self.expr;
                var $1817 = self.name;
                var $1818 = self.with;
                var $1819 = self.cses;
                var $1820 = self.moti;
                var $1821 = _term$1;
                var $1768 = $1821;
                break;
            case 'Fm.Term.ori':
                var $1822 = self.orig;
                var $1823 = self.expr;
                var $1824 = Fm$Term$normalize$($1823, _defs$2);
                var $1768 = $1824;
                break;
        };
        return $1768;
    };
    const Fm$Term$normalize = x0 => x1 => Fm$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1826 = List$nil;
                var $1825 = $1826;
                break;
            case 'List.cons':
                var $1827 = self.head;
                var $1828 = self.tail;
                var $1829 = $1828;
                var $1825 = $1829;
                break;
        };
        return $1825;
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
                        var $1830 = self.name;
                        var $1831 = self.indx;
                        var $1832 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1832;
                    case 'Fm.Term.ref':
                        var $1833 = self.name;
                        var $1834 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1834;
                    case 'Fm.Term.typ':
                        var $1835 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1835;
                    case 'Fm.Term.all':
                        var $1836 = self.eras;
                        var $1837 = self.self;
                        var $1838 = self.name;
                        var $1839 = self.xtyp;
                        var $1840 = self.body;
                        var $1841 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1841;
                    case 'Fm.Term.lam':
                        var $1842 = self.name;
                        var $1843 = self.body;
                        var $1844 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1844;
                    case 'Fm.Term.app':
                        var $1845 = self.func;
                        var $1846 = self.argm;
                        var $1847 = Fm$SmartMotive$vals$cont$(_expr$1, $1845, List$cons$($1846, _args$3), _defs$4);
                        return $1847;
                    case 'Fm.Term.let':
                        var $1848 = self.name;
                        var $1849 = self.expr;
                        var $1850 = self.body;
                        var $1851 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1851;
                    case 'Fm.Term.def':
                        var $1852 = self.name;
                        var $1853 = self.expr;
                        var $1854 = self.body;
                        var $1855 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1855;
                    case 'Fm.Term.ann':
                        var $1856 = self.done;
                        var $1857 = self.term;
                        var $1858 = self.type;
                        var $1859 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1859;
                    case 'Fm.Term.gol':
                        var $1860 = self.name;
                        var $1861 = self.dref;
                        var $1862 = self.verb;
                        var $1863 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1863;
                    case 'Fm.Term.hol':
                        var $1864 = self.path;
                        var $1865 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1865;
                    case 'Fm.Term.nat':
                        var $1866 = self.natx;
                        var $1867 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1867;
                    case 'Fm.Term.chr':
                        var $1868 = self.chrx;
                        var $1869 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1869;
                    case 'Fm.Term.str':
                        var $1870 = self.strx;
                        var $1871 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1871;
                    case 'Fm.Term.cse':
                        var $1872 = self.path;
                        var $1873 = self.expr;
                        var $1874 = self.name;
                        var $1875 = self.with;
                        var $1876 = self.cses;
                        var $1877 = self.moti;
                        var $1878 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1878;
                    case 'Fm.Term.ori':
                        var $1879 = self.orig;
                        var $1880 = self.expr;
                        var $1881 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1881;
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
                        var $1882 = self.name;
                        var $1883 = self.indx;
                        var $1884 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1884;
                    case 'Fm.Term.ref':
                        var $1885 = self.name;
                        var $1886 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1886;
                    case 'Fm.Term.typ':
                        var $1887 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1887;
                    case 'Fm.Term.all':
                        var $1888 = self.eras;
                        var $1889 = self.self;
                        var $1890 = self.name;
                        var $1891 = self.xtyp;
                        var $1892 = self.body;
                        var $1893 = Fm$SmartMotive$vals$(_expr$1, $1892(Fm$Term$typ)(Fm$Term$typ), _defs$3);
                        return $1893;
                    case 'Fm.Term.lam':
                        var $1894 = self.name;
                        var $1895 = self.body;
                        var $1896 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1896;
                    case 'Fm.Term.app':
                        var $1897 = self.func;
                        var $1898 = self.argm;
                        var $1899 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1899;
                    case 'Fm.Term.let':
                        var $1900 = self.name;
                        var $1901 = self.expr;
                        var $1902 = self.body;
                        var $1903 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1903;
                    case 'Fm.Term.def':
                        var $1904 = self.name;
                        var $1905 = self.expr;
                        var $1906 = self.body;
                        var $1907 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1907;
                    case 'Fm.Term.ann':
                        var $1908 = self.done;
                        var $1909 = self.term;
                        var $1910 = self.type;
                        var $1911 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1911;
                    case 'Fm.Term.gol':
                        var $1912 = self.name;
                        var $1913 = self.dref;
                        var $1914 = self.verb;
                        var $1915 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1915;
                    case 'Fm.Term.hol':
                        var $1916 = self.path;
                        var $1917 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1917;
                    case 'Fm.Term.nat':
                        var $1918 = self.natx;
                        var $1919 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1919;
                    case 'Fm.Term.chr':
                        var $1920 = self.chrx;
                        var $1921 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1921;
                    case 'Fm.Term.str':
                        var $1922 = self.strx;
                        var $1923 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1923;
                    case 'Fm.Term.cse':
                        var $1924 = self.path;
                        var $1925 = self.expr;
                        var $1926 = self.name;
                        var $1927 = self.with;
                        var $1928 = self.cses;
                        var $1929 = self.moti;
                        var $1930 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1930;
                    case 'Fm.Term.ori':
                        var $1931 = self.orig;
                        var $1932 = self.expr;
                        var $1933 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1933;
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
                        var $1934 = self.name;
                        var $1935 = self.indx;
                        var $1936 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1936;
                    case 'Fm.Term.ref':
                        var $1937 = self.name;
                        var $1938 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1938;
                    case 'Fm.Term.typ':
                        var $1939 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1939;
                    case 'Fm.Term.all':
                        var $1940 = self.eras;
                        var $1941 = self.self;
                        var $1942 = self.name;
                        var $1943 = self.xtyp;
                        var $1944 = self.body;
                        var $1945 = Fm$SmartMotive$nams$cont$(_name$1, $1944(Fm$Term$ref$($1941))(Fm$Term$ref$($1942)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($1942, List$nil)))), _binds$3), _defs$4);
                        return $1945;
                    case 'Fm.Term.lam':
                        var $1946 = self.name;
                        var $1947 = self.body;
                        var $1948 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1948;
                    case 'Fm.Term.app':
                        var $1949 = self.func;
                        var $1950 = self.argm;
                        var $1951 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1951;
                    case 'Fm.Term.let':
                        var $1952 = self.name;
                        var $1953 = self.expr;
                        var $1954 = self.body;
                        var $1955 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1955;
                    case 'Fm.Term.def':
                        var $1956 = self.name;
                        var $1957 = self.expr;
                        var $1958 = self.body;
                        var $1959 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1959;
                    case 'Fm.Term.ann':
                        var $1960 = self.done;
                        var $1961 = self.term;
                        var $1962 = self.type;
                        var $1963 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1963;
                    case 'Fm.Term.gol':
                        var $1964 = self.name;
                        var $1965 = self.dref;
                        var $1966 = self.verb;
                        var $1967 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1967;
                    case 'Fm.Term.hol':
                        var $1968 = self.path;
                        var $1969 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1969;
                    case 'Fm.Term.nat':
                        var $1970 = self.natx;
                        var $1971 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1971;
                    case 'Fm.Term.chr':
                        var $1972 = self.chrx;
                        var $1973 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1973;
                    case 'Fm.Term.str':
                        var $1974 = self.strx;
                        var $1975 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1975;
                    case 'Fm.Term.cse':
                        var $1976 = self.path;
                        var $1977 = self.expr;
                        var $1978 = self.name;
                        var $1979 = self.with;
                        var $1980 = self.cses;
                        var $1981 = self.moti;
                        var $1982 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1982;
                    case 'Fm.Term.ori':
                        var $1983 = self.orig;
                        var $1984 = self.expr;
                        var $1985 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1985;
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
                var $1987 = self.name;
                var $1988 = self.indx;
                var $1989 = List$nil;
                var $1986 = $1989;
                break;
            case 'Fm.Term.ref':
                var $1990 = self.name;
                var $1991 = List$nil;
                var $1986 = $1991;
                break;
            case 'Fm.Term.typ':
                var $1992 = List$nil;
                var $1986 = $1992;
                break;
            case 'Fm.Term.all':
                var $1993 = self.eras;
                var $1994 = self.self;
                var $1995 = self.name;
                var $1996 = self.xtyp;
                var $1997 = self.body;
                var $1998 = Fm$SmartMotive$nams$cont$(_name$1, $1996, List$nil, _defs$3);
                var $1986 = $1998;
                break;
            case 'Fm.Term.lam':
                var $1999 = self.name;
                var $2000 = self.body;
                var $2001 = List$nil;
                var $1986 = $2001;
                break;
            case 'Fm.Term.app':
                var $2002 = self.func;
                var $2003 = self.argm;
                var $2004 = List$nil;
                var $1986 = $2004;
                break;
            case 'Fm.Term.let':
                var $2005 = self.name;
                var $2006 = self.expr;
                var $2007 = self.body;
                var $2008 = List$nil;
                var $1986 = $2008;
                break;
            case 'Fm.Term.def':
                var $2009 = self.name;
                var $2010 = self.expr;
                var $2011 = self.body;
                var $2012 = List$nil;
                var $1986 = $2012;
                break;
            case 'Fm.Term.ann':
                var $2013 = self.done;
                var $2014 = self.term;
                var $2015 = self.type;
                var $2016 = List$nil;
                var $1986 = $2016;
                break;
            case 'Fm.Term.gol':
                var $2017 = self.name;
                var $2018 = self.dref;
                var $2019 = self.verb;
                var $2020 = List$nil;
                var $1986 = $2020;
                break;
            case 'Fm.Term.hol':
                var $2021 = self.path;
                var $2022 = List$nil;
                var $1986 = $2022;
                break;
            case 'Fm.Term.nat':
                var $2023 = self.natx;
                var $2024 = List$nil;
                var $1986 = $2024;
                break;
            case 'Fm.Term.chr':
                var $2025 = self.chrx;
                var $2026 = List$nil;
                var $1986 = $2026;
                break;
            case 'Fm.Term.str':
                var $2027 = self.strx;
                var $2028 = List$nil;
                var $1986 = $2028;
                break;
            case 'Fm.Term.cse':
                var $2029 = self.path;
                var $2030 = self.expr;
                var $2031 = self.name;
                var $2032 = self.with;
                var $2033 = self.cses;
                var $2034 = self.moti;
                var $2035 = List$nil;
                var $1986 = $2035;
                break;
            case 'Fm.Term.ori':
                var $2036 = self.orig;
                var $2037 = self.expr;
                var $2038 = List$nil;
                var $1986 = $2038;
                break;
        };
        return $1986;
    };
    const Fm$SmartMotive$nams = x0 => x1 => x2 => Fm$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.nil':
                var $2040 = List$nil;
                var $2039 = $2040;
                break;
            case 'List.cons':
                var $2041 = self.head;
                var $2042 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.nil':
                        var $2044 = List$nil;
                        var $2043 = $2044;
                        break;
                    case 'List.cons':
                        var $2045 = self.head;
                        var $2046 = self.tail;
                        var $2047 = List$cons$(Pair$new$($2041, $2045), List$zip$($2042, $2046));
                        var $2043 = $2047;
                        break;
                };
                var $2039 = $2043;
                break;
        };
        return $2039;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Fm$Term$serialize$name$(_name$1) {
        var $2048 = (fm_name_to_bits(_name$1));
        return $2048;
    };
    const Fm$Term$serialize$name = x0 => Fm$Term$serialize$name$(x0);

    function Fm$Term$serialize$(_term$1, _depth$2, _init$3, _x$4) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2050 = self.name;
                var $2051 = self.indx;
                var self = ($2051 >= _init$3);
                if (self) {
                    var _name$7 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $2051 <= 0n ? 0n : _depth$2 - $2051)))));
                    var $2053 = (((_name$7(_x$4) + '1') + '0') + '0');
                    var $2052 = $2053;
                } else {
                    var _name$7 = a1 => (a1 + (nat_to_bits($2051)));
                    var $2054 = (((_name$7(_x$4) + '0') + '1') + '0');
                    var $2052 = $2054;
                };
                var $2049 = $2052;
                break;
            case 'Fm.Term.ref':
                var $2055 = self.name;
                var _name$6 = a1 => (a1 + Fm$Term$serialize$name$($2055));
                var $2056 = (((_name$6(_x$4) + '0') + '0') + '0');
                var $2049 = $2056;
                break;
            case 'Fm.Term.typ':
                var $2057 = (((_x$4 + '1') + '1') + '0');
                var $2049 = $2057;
                break;
            case 'Fm.Term.all':
                var $2058 = self.eras;
                var $2059 = self.self;
                var $2060 = self.name;
                var $2061 = self.xtyp;
                var $2062 = self.body;
                var self = $2058;
                if (self) {
                    var $2064 = Bits$i;
                    var _eras$10 = $2064;
                } else {
                    var $2065 = Bits$o;
                    var _eras$10 = $2065;
                };
                var _self$11 = a1 => (a1 + (fm_name_to_bits($2059)));
                var _xtyp$12 = Fm$Term$serialize($2061)(_depth$2)(_init$3);
                var _body$13 = Fm$Term$serialize($2062(Fm$Term$var$($2059, _depth$2))(Fm$Term$var$($2060, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3);
                var $2063 = (((_eras$10(_self$11(_xtyp$12(_body$13(_x$4)))) + '0') + '0') + '1');
                var $2049 = $2063;
                break;
            case 'Fm.Term.lam':
                var $2066 = self.name;
                var $2067 = self.body;
                var _body$7 = Fm$Term$serialize($2067(Fm$Term$var$($2066, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2068 = (((_body$7(_x$4) + '1') + '0') + '1');
                var $2049 = $2068;
                break;
            case 'Fm.Term.app':
                var $2069 = self.func;
                var $2070 = self.argm;
                var _func$7 = Fm$Term$serialize($2069)(_depth$2)(_init$3);
                var _argm$8 = Fm$Term$serialize($2070)(_depth$2)(_init$3);
                var $2071 = (((_func$7(_argm$8(_x$4)) + '0') + '1') + '1');
                var $2049 = $2071;
                break;
            case 'Fm.Term.let':
                var $2072 = self.name;
                var $2073 = self.expr;
                var $2074 = self.body;
                var _expr$8 = Fm$Term$serialize($2073)(_depth$2)(_init$3);
                var _body$9 = Fm$Term$serialize($2074(Fm$Term$var$($2072, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2075 = (((_expr$8(_body$9(_x$4)) + '1') + '1') + '1');
                var $2049 = $2075;
                break;
            case 'Fm.Term.def':
                var $2076 = self.name;
                var $2077 = self.expr;
                var $2078 = self.body;
                var $2079 = Fm$Term$serialize$($2078($2077), _depth$2, _init$3, _x$4);
                var $2049 = $2079;
                break;
            case 'Fm.Term.ann':
                var $2080 = self.done;
                var $2081 = self.term;
                var $2082 = self.type;
                var $2083 = Fm$Term$serialize$($2081, _depth$2, _init$3, _x$4);
                var $2049 = $2083;
                break;
            case 'Fm.Term.gol':
                var $2084 = self.name;
                var $2085 = self.dref;
                var $2086 = self.verb;
                var _name$8 = a1 => (a1 + (fm_name_to_bits($2084)));
                var $2087 = (((_name$8(_x$4) + '0') + '0') + '0');
                var $2049 = $2087;
                break;
            case 'Fm.Term.hol':
                var $2088 = self.path;
                var $2089 = _x$4;
                var $2049 = $2089;
                break;
            case 'Fm.Term.nat':
                var $2090 = self.natx;
                var $2091 = Fm$Term$serialize$(Fm$Term$unroll_nat$($2090), _depth$2, _init$3, _x$4);
                var $2049 = $2091;
                break;
            case 'Fm.Term.chr':
                var $2092 = self.chrx;
                var $2093 = Fm$Term$serialize$(Fm$Term$unroll_chr$($2092), _depth$2, _init$3, _x$4);
                var $2049 = $2093;
                break;
            case 'Fm.Term.str':
                var $2094 = self.strx;
                var $2095 = Fm$Term$serialize$(Fm$Term$unroll_str$($2094), _depth$2, _init$3, _x$4);
                var $2049 = $2095;
                break;
            case 'Fm.Term.cse':
                var $2096 = self.path;
                var $2097 = self.expr;
                var $2098 = self.name;
                var $2099 = self.with;
                var $2100 = self.cses;
                var $2101 = self.moti;
                var $2102 = _x$4;
                var $2049 = $2102;
                break;
            case 'Fm.Term.ori':
                var $2103 = self.orig;
                var $2104 = self.expr;
                var $2105 = Fm$Term$serialize$($2104, _depth$2, _init$3, _x$4);
                var $2049 = $2105;
                break;
        };
        return $2049;
    };
    const Fm$Term$serialize = x0 => x1 => x2 => x3 => Fm$Term$serialize$(x0, x1, x2, x3);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Fm$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Fm$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$e);
        var _bh$5 = Fm$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$e);
        var $2106 = (_bh$5 === _ah$4);
        return $2106;
    };
    const Fm$Term$identical = x0 => x1 => x2 => Fm$Term$identical$(x0, x1, x2);

    function Fm$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Fm$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $2108 = _to$3;
            var $2107 = $2108;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $2110 = self.name;
                    var $2111 = self.indx;
                    var $2112 = Fm$Term$var$($2110, $2111);
                    var $2109 = $2112;
                    break;
                case 'Fm.Term.ref':
                    var $2113 = self.name;
                    var $2114 = Fm$Term$ref$($2113);
                    var $2109 = $2114;
                    break;
                case 'Fm.Term.typ':
                    var $2115 = Fm$Term$typ;
                    var $2109 = $2115;
                    break;
                case 'Fm.Term.all':
                    var $2116 = self.eras;
                    var $2117 = self.self;
                    var $2118 = self.name;
                    var $2119 = self.xtyp;
                    var $2120 = self.body;
                    var _xtyp$10 = Fm$SmartMotive$replace$($2119, _from$2, _to$3, _lv$4);
                    var _body$11 = $2120(Fm$Term$ref$($2117))(Fm$Term$ref$($2118));
                    var _body$12 = Fm$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $2121 = Fm$Term$all$($2116, $2117, $2118, _xtyp$10, (_s$13 => _x$14 => {
                        var $2122 = _body$12;
                        return $2122;
                    }));
                    var $2109 = $2121;
                    break;
                case 'Fm.Term.lam':
                    var $2123 = self.name;
                    var $2124 = self.body;
                    var _body$7 = $2124(Fm$Term$ref$($2123));
                    var _body$8 = Fm$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2125 = Fm$Term$lam$($2123, (_x$9 => {
                        var $2126 = _body$8;
                        return $2126;
                    }));
                    var $2109 = $2125;
                    break;
                case 'Fm.Term.app':
                    var $2127 = self.func;
                    var $2128 = self.argm;
                    var _func$7 = Fm$SmartMotive$replace$($2127, _from$2, _to$3, _lv$4);
                    var _argm$8 = Fm$SmartMotive$replace$($2128, _from$2, _to$3, _lv$4);
                    var $2129 = Fm$Term$app$(_func$7, _argm$8);
                    var $2109 = $2129;
                    break;
                case 'Fm.Term.let':
                    var $2130 = self.name;
                    var $2131 = self.expr;
                    var $2132 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2131, _from$2, _to$3, _lv$4);
                    var _body$9 = $2132(Fm$Term$ref$($2130));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2133 = Fm$Term$let$($2130, _expr$8, (_x$11 => {
                        var $2134 = _body$10;
                        return $2134;
                    }));
                    var $2109 = $2133;
                    break;
                case 'Fm.Term.def':
                    var $2135 = self.name;
                    var $2136 = self.expr;
                    var $2137 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2136, _from$2, _to$3, _lv$4);
                    var _body$9 = $2137(Fm$Term$ref$($2135));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2138 = Fm$Term$def$($2135, _expr$8, (_x$11 => {
                        var $2139 = _body$10;
                        return $2139;
                    }));
                    var $2109 = $2138;
                    break;
                case 'Fm.Term.ann':
                    var $2140 = self.done;
                    var $2141 = self.term;
                    var $2142 = self.type;
                    var _term$8 = Fm$SmartMotive$replace$($2141, _from$2, _to$3, _lv$4);
                    var _type$9 = Fm$SmartMotive$replace$($2142, _from$2, _to$3, _lv$4);
                    var $2143 = Fm$Term$ann$($2140, _term$8, _type$9);
                    var $2109 = $2143;
                    break;
                case 'Fm.Term.gol':
                    var $2144 = self.name;
                    var $2145 = self.dref;
                    var $2146 = self.verb;
                    var $2147 = _term$1;
                    var $2109 = $2147;
                    break;
                case 'Fm.Term.hol':
                    var $2148 = self.path;
                    var $2149 = _term$1;
                    var $2109 = $2149;
                    break;
                case 'Fm.Term.nat':
                    var $2150 = self.natx;
                    var $2151 = _term$1;
                    var $2109 = $2151;
                    break;
                case 'Fm.Term.chr':
                    var $2152 = self.chrx;
                    var $2153 = _term$1;
                    var $2109 = $2153;
                    break;
                case 'Fm.Term.str':
                    var $2154 = self.strx;
                    var $2155 = _term$1;
                    var $2109 = $2155;
                    break;
                case 'Fm.Term.cse':
                    var $2156 = self.path;
                    var $2157 = self.expr;
                    var $2158 = self.name;
                    var $2159 = self.with;
                    var $2160 = self.cses;
                    var $2161 = self.moti;
                    var $2162 = _term$1;
                    var $2109 = $2162;
                    break;
                case 'Fm.Term.ori':
                    var $2163 = self.orig;
                    var $2164 = self.expr;
                    var $2165 = Fm$SmartMotive$replace$($2164, _from$2, _to$3, _lv$4);
                    var $2109 = $2165;
                    break;
            };
            var $2107 = $2109;
        };
        return $2107;
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
                    var $2168 = self.fst;
                    var $2169 = self.snd;
                    var $2170 = Fm$SmartMotive$replace$(_moti$11, $2169, Fm$Term$ref$($2168), _lv$5);
                    var $2167 = $2170;
                    break;
            };
            return $2167;
        }));
        var $2166 = _moti$10;
        return $2166;
    };
    const Fm$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Fm$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Fm$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.nil':
                var $2172 = _moti$2;
                var $2171 = $2172;
                break;
            case 'List.cons':
                var $2173 = self.head;
                var $2174 = self.tail;
                var self = $2173;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $2176 = self.file;
                        var $2177 = self.code;
                        var $2178 = self.name;
                        var $2179 = self.term;
                        var $2180 = self.type;
                        var $2181 = self.stat;
                        var $2182 = Fm$Term$all$(Bool$false, "", $2178, $2180, (_s$11 => _x$12 => {
                            var $2183 = Fm$Term$desugar_cse$motive$($2174, _moti$2);
                            return $2183;
                        }));
                        var $2175 = $2182;
                        break;
                };
                var $2171 = $2175;
                break;
        };
        return $2171;
    };
    const Fm$Term$desugar_cse$motive = x0 => x1 => Fm$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $2185 = Bool$true;
            var $2184 = $2185;
        } else {
            var $2186 = self.charCodeAt(0);
            var $2187 = self.slice(1);
            var $2188 = Bool$false;
            var $2184 = $2188;
        };
        return $2184;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Fm$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $2190 = self.name;
                var $2191 = self.indx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2193 = _body$4;
                        var $2192 = $2193;
                        break;
                    case 'List.cons':
                        var $2194 = self.head;
                        var $2195 = self.tail;
                        var self = $2194;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2197 = self.file;
                                var $2198 = self.code;
                                var $2199 = self.name;
                                var $2200 = self.term;
                                var $2201 = self.type;
                                var $2202 = self.stat;
                                var $2203 = Fm$Term$lam$($2199, (_x$16 => {
                                    var $2204 = Fm$Term$desugar_cse$argument$(_name$1, $2195, _type$3, _body$4, _defs$5);
                                    return $2204;
                                }));
                                var $2196 = $2203;
                                break;
                        };
                        var $2192 = $2196;
                        break;
                };
                var $2189 = $2192;
                break;
            case 'Fm.Term.ref':
                var $2205 = self.name;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2207 = _body$4;
                        var $2206 = $2207;
                        break;
                    case 'List.cons':
                        var $2208 = self.head;
                        var $2209 = self.tail;
                        var self = $2208;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2211 = self.file;
                                var $2212 = self.code;
                                var $2213 = self.name;
                                var $2214 = self.term;
                                var $2215 = self.type;
                                var $2216 = self.stat;
                                var $2217 = Fm$Term$lam$($2213, (_x$15 => {
                                    var $2218 = Fm$Term$desugar_cse$argument$(_name$1, $2209, _type$3, _body$4, _defs$5);
                                    return $2218;
                                }));
                                var $2210 = $2217;
                                break;
                        };
                        var $2206 = $2210;
                        break;
                };
                var $2189 = $2206;
                break;
            case 'Fm.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2220 = _body$4;
                        var $2219 = $2220;
                        break;
                    case 'List.cons':
                        var $2221 = self.head;
                        var $2222 = self.tail;
                        var self = $2221;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2224 = self.file;
                                var $2225 = self.code;
                                var $2226 = self.name;
                                var $2227 = self.term;
                                var $2228 = self.type;
                                var $2229 = self.stat;
                                var $2230 = Fm$Term$lam$($2226, (_x$14 => {
                                    var $2231 = Fm$Term$desugar_cse$argument$(_name$1, $2222, _type$3, _body$4, _defs$5);
                                    return $2231;
                                }));
                                var $2223 = $2230;
                                break;
                        };
                        var $2219 = $2223;
                        break;
                };
                var $2189 = $2219;
                break;
            case 'Fm.Term.all':
                var $2232 = self.eras;
                var $2233 = self.self;
                var $2234 = self.name;
                var $2235 = self.xtyp;
                var $2236 = self.body;
                var $2237 = Fm$Term$lam$((() => {
                    var self = String$is_empty$($2234);
                    if (self) {
                        var $2238 = _name$1;
                        return $2238;
                    } else {
                        var $2239 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($2234, List$nil))));
                        return $2239;
                    };
                })(), (_x$11 => {
                    var $2240 = Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, $2236(Fm$Term$var$($2233, 0n))(Fm$Term$var$($2234, 0n)), _body$4, _defs$5);
                    return $2240;
                }));
                var $2189 = $2237;
                break;
            case 'Fm.Term.lam':
                var $2241 = self.name;
                var $2242 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2244 = _body$4;
                        var $2243 = $2244;
                        break;
                    case 'List.cons':
                        var $2245 = self.head;
                        var $2246 = self.tail;
                        var self = $2245;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2248 = self.file;
                                var $2249 = self.code;
                                var $2250 = self.name;
                                var $2251 = self.term;
                                var $2252 = self.type;
                                var $2253 = self.stat;
                                var $2254 = Fm$Term$lam$($2250, (_x$16 => {
                                    var $2255 = Fm$Term$desugar_cse$argument$(_name$1, $2246, _type$3, _body$4, _defs$5);
                                    return $2255;
                                }));
                                var $2247 = $2254;
                                break;
                        };
                        var $2243 = $2247;
                        break;
                };
                var $2189 = $2243;
                break;
            case 'Fm.Term.app':
                var $2256 = self.func;
                var $2257 = self.argm;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2259 = _body$4;
                        var $2258 = $2259;
                        break;
                    case 'List.cons':
                        var $2260 = self.head;
                        var $2261 = self.tail;
                        var self = $2260;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2263 = self.file;
                                var $2264 = self.code;
                                var $2265 = self.name;
                                var $2266 = self.term;
                                var $2267 = self.type;
                                var $2268 = self.stat;
                                var $2269 = Fm$Term$lam$($2265, (_x$16 => {
                                    var $2270 = Fm$Term$desugar_cse$argument$(_name$1, $2261, _type$3, _body$4, _defs$5);
                                    return $2270;
                                }));
                                var $2262 = $2269;
                                break;
                        };
                        var $2258 = $2262;
                        break;
                };
                var $2189 = $2258;
                break;
            case 'Fm.Term.let':
                var $2271 = self.name;
                var $2272 = self.expr;
                var $2273 = self.body;
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
                                var $2285 = Fm$Term$lam$($2281, (_x$17 => {
                                    var $2286 = Fm$Term$desugar_cse$argument$(_name$1, $2277, _type$3, _body$4, _defs$5);
                                    return $2286;
                                }));
                                var $2278 = $2285;
                                break;
                        };
                        var $2274 = $2278;
                        break;
                };
                var $2189 = $2274;
                break;
            case 'Fm.Term.def':
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
                var $2189 = $2290;
                break;
            case 'Fm.Term.ann':
                var $2303 = self.done;
                var $2304 = self.term;
                var $2305 = self.type;
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
                var $2189 = $2306;
                break;
            case 'Fm.Term.gol':
                var $2319 = self.name;
                var $2320 = self.dref;
                var $2321 = self.verb;
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
                var $2189 = $2322;
                break;
            case 'Fm.Term.hol':
                var $2335 = self.path;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2337 = _body$4;
                        var $2336 = $2337;
                        break;
                    case 'List.cons':
                        var $2338 = self.head;
                        var $2339 = self.tail;
                        var self = $2338;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2341 = self.file;
                                var $2342 = self.code;
                                var $2343 = self.name;
                                var $2344 = self.term;
                                var $2345 = self.type;
                                var $2346 = self.stat;
                                var $2347 = Fm$Term$lam$($2343, (_x$15 => {
                                    var $2348 = Fm$Term$desugar_cse$argument$(_name$1, $2339, _type$3, _body$4, _defs$5);
                                    return $2348;
                                }));
                                var $2340 = $2347;
                                break;
                        };
                        var $2336 = $2340;
                        break;
                };
                var $2189 = $2336;
                break;
            case 'Fm.Term.nat':
                var $2349 = self.natx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2351 = _body$4;
                        var $2350 = $2351;
                        break;
                    case 'List.cons':
                        var $2352 = self.head;
                        var $2353 = self.tail;
                        var self = $2352;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2355 = self.file;
                                var $2356 = self.code;
                                var $2357 = self.name;
                                var $2358 = self.term;
                                var $2359 = self.type;
                                var $2360 = self.stat;
                                var $2361 = Fm$Term$lam$($2357, (_x$15 => {
                                    var $2362 = Fm$Term$desugar_cse$argument$(_name$1, $2353, _type$3, _body$4, _defs$5);
                                    return $2362;
                                }));
                                var $2354 = $2361;
                                break;
                        };
                        var $2350 = $2354;
                        break;
                };
                var $2189 = $2350;
                break;
            case 'Fm.Term.chr':
                var $2363 = self.chrx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2365 = _body$4;
                        var $2364 = $2365;
                        break;
                    case 'List.cons':
                        var $2366 = self.head;
                        var $2367 = self.tail;
                        var self = $2366;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2369 = self.file;
                                var $2370 = self.code;
                                var $2371 = self.name;
                                var $2372 = self.term;
                                var $2373 = self.type;
                                var $2374 = self.stat;
                                var $2375 = Fm$Term$lam$($2371, (_x$15 => {
                                    var $2376 = Fm$Term$desugar_cse$argument$(_name$1, $2367, _type$3, _body$4, _defs$5);
                                    return $2376;
                                }));
                                var $2368 = $2375;
                                break;
                        };
                        var $2364 = $2368;
                        break;
                };
                var $2189 = $2364;
                break;
            case 'Fm.Term.str':
                var $2377 = self.strx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2379 = _body$4;
                        var $2378 = $2379;
                        break;
                    case 'List.cons':
                        var $2380 = self.head;
                        var $2381 = self.tail;
                        var self = $2380;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2383 = self.file;
                                var $2384 = self.code;
                                var $2385 = self.name;
                                var $2386 = self.term;
                                var $2387 = self.type;
                                var $2388 = self.stat;
                                var $2389 = Fm$Term$lam$($2385, (_x$15 => {
                                    var $2390 = Fm$Term$desugar_cse$argument$(_name$1, $2381, _type$3, _body$4, _defs$5);
                                    return $2390;
                                }));
                                var $2382 = $2389;
                                break;
                        };
                        var $2378 = $2382;
                        break;
                };
                var $2189 = $2378;
                break;
            case 'Fm.Term.cse':
                var $2391 = self.path;
                var $2392 = self.expr;
                var $2393 = self.name;
                var $2394 = self.with;
                var $2395 = self.cses;
                var $2396 = self.moti;
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
                                var $2408 = Fm$Term$lam$($2404, (_x$20 => {
                                    var $2409 = Fm$Term$desugar_cse$argument$(_name$1, $2400, _type$3, _body$4, _defs$5);
                                    return $2409;
                                }));
                                var $2401 = $2408;
                                break;
                        };
                        var $2397 = $2401;
                        break;
                };
                var $2189 = $2397;
                break;
            case 'Fm.Term.ori':
                var $2410 = self.orig;
                var $2411 = self.expr;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2413 = _body$4;
                        var $2412 = $2413;
                        break;
                    case 'List.cons':
                        var $2414 = self.head;
                        var $2415 = self.tail;
                        var self = $2414;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2417 = self.file;
                                var $2418 = self.code;
                                var $2419 = self.name;
                                var $2420 = self.term;
                                var $2421 = self.type;
                                var $2422 = self.stat;
                                var $2423 = Fm$Term$lam$($2419, (_x$16 => {
                                    var $2424 = Fm$Term$desugar_cse$argument$(_name$1, $2415, _type$3, _body$4, _defs$5);
                                    return $2424;
                                }));
                                var $2416 = $2423;
                                break;
                        };
                        var $2412 = $2416;
                        break;
                };
                var $2189 = $2412;
                break;
        };
        return $2189;
    };
    const Fm$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Fm$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.none':
                var $2426 = _b$3;
                var $2425 = $2426;
                break;
            case 'Maybe.some':
                var $2427 = self.value;
                var $2428 = Maybe$some$($2427);
                var $2425 = $2428;
                break;
        };
        return $2425;
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
                        var $2429 = self.name;
                        var $2430 = self.indx;
                        var _expr$10 = (() => {
                            var $2433 = _expr$1;
                            var $2434 = _wyth$3;
                            let _expr$11 = $2433;
                            let _defn$10;
                            while ($2434._ === 'List.cons') {
                                _defn$10 = $2434.head;
                                var $2433 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2435 = self.file;
                                            var $2436 = self.code;
                                            var $2437 = self.name;
                                            var $2438 = self.term;
                                            var $2439 = self.type;
                                            var $2440 = self.stat;
                                            var $2441 = $2438;
                                            return $2441;
                                    };
                                })());
                                _expr$11 = $2433;
                                $2434 = $2434.tail;
                            }
                            return _expr$11;
                        })();
                        var $2431 = _expr$10;
                        return $2431;
                    case 'Fm.Term.ref':
                        var $2442 = self.name;
                        var _expr$9 = (() => {
                            var $2445 = _expr$1;
                            var $2446 = _wyth$3;
                            let _expr$10 = $2445;
                            let _defn$9;
                            while ($2446._ === 'List.cons') {
                                _defn$9 = $2446.head;
                                var $2445 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2447 = self.file;
                                            var $2448 = self.code;
                                            var $2449 = self.name;
                                            var $2450 = self.term;
                                            var $2451 = self.type;
                                            var $2452 = self.stat;
                                            var $2453 = $2450;
                                            return $2453;
                                    };
                                })());
                                _expr$10 = $2445;
                                $2446 = $2446.tail;
                            }
                            return _expr$10;
                        })();
                        var $2443 = _expr$9;
                        return $2443;
                    case 'Fm.Term.typ':
                        var _expr$8 = (() => {
                            var $2456 = _expr$1;
                            var $2457 = _wyth$3;
                            let _expr$9 = $2456;
                            let _defn$8;
                            while ($2457._ === 'List.cons') {
                                _defn$8 = $2457.head;
                                var $2456 = Fm$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2458 = self.file;
                                            var $2459 = self.code;
                                            var $2460 = self.name;
                                            var $2461 = self.term;
                                            var $2462 = self.type;
                                            var $2463 = self.stat;
                                            var $2464 = $2461;
                                            return $2464;
                                    };
                                })());
                                _expr$9 = $2456;
                                $2457 = $2457.tail;
                            }
                            return _expr$9;
                        })();
                        var $2454 = _expr$8;
                        return $2454;
                    case 'Fm.Term.all':
                        var $2465 = self.eras;
                        var $2466 = self.self;
                        var $2467 = self.name;
                        var $2468 = self.xtyp;
                        var $2469 = self.body;
                        var _got$13 = Maybe$or$(Fm$get$($2467, _cses$4), Fm$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $2473 = _expr$1;
                                    var $2474 = _wyth$3;
                                    let _expr$15 = $2473;
                                    let _defn$14;
                                    while ($2474._ === 'List.cons') {
                                        _defn$14 = $2474.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Fm.Def.new':
                                                var $2475 = self.file;
                                                var $2476 = self.code;
                                                var $2477 = self.name;
                                                var $2478 = self.term;
                                                var $2479 = self.type;
                                                var $2480 = self.stat;
                                                var $2481 = Fm$Term$app$(_expr$15, $2478);
                                                var $2473 = $2481;
                                                break;
                                        };
                                        _expr$15 = $2473;
                                        $2474 = $2474.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $2471 = _expr$14;
                                var $2470 = $2471;
                                break;
                            case 'Maybe.some':
                                var $2482 = self.value;
                                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, _wyth$3, $2468, $2482, _defs$6);
                                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $2469(Fm$Term$var$($2466, 0n))(Fm$Term$var$($2467, 0n));
                                var $2483 = Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $2470 = $2483;
                                break;
                        };
                        return $2470;
                    case 'Fm.Term.lam':
                        var $2484 = self.name;
                        var $2485 = self.body;
                        var _expr$10 = (() => {
                            var $2488 = _expr$1;
                            var $2489 = _wyth$3;
                            let _expr$11 = $2488;
                            let _defn$10;
                            while ($2489._ === 'List.cons') {
                                _defn$10 = $2489.head;
                                var $2488 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2490 = self.file;
                                            var $2491 = self.code;
                                            var $2492 = self.name;
                                            var $2493 = self.term;
                                            var $2494 = self.type;
                                            var $2495 = self.stat;
                                            var $2496 = $2493;
                                            return $2496;
                                    };
                                })());
                                _expr$11 = $2488;
                                $2489 = $2489.tail;
                            }
                            return _expr$11;
                        })();
                        var $2486 = _expr$10;
                        return $2486;
                    case 'Fm.Term.app':
                        var $2497 = self.func;
                        var $2498 = self.argm;
                        var _expr$10 = (() => {
                            var $2501 = _expr$1;
                            var $2502 = _wyth$3;
                            let _expr$11 = $2501;
                            let _defn$10;
                            while ($2502._ === 'List.cons') {
                                _defn$10 = $2502.head;
                                var $2501 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2503 = self.file;
                                            var $2504 = self.code;
                                            var $2505 = self.name;
                                            var $2506 = self.term;
                                            var $2507 = self.type;
                                            var $2508 = self.stat;
                                            var $2509 = $2506;
                                            return $2509;
                                    };
                                })());
                                _expr$11 = $2501;
                                $2502 = $2502.tail;
                            }
                            return _expr$11;
                        })();
                        var $2499 = _expr$10;
                        return $2499;
                    case 'Fm.Term.let':
                        var $2510 = self.name;
                        var $2511 = self.expr;
                        var $2512 = self.body;
                        var _expr$11 = (() => {
                            var $2515 = _expr$1;
                            var $2516 = _wyth$3;
                            let _expr$12 = $2515;
                            let _defn$11;
                            while ($2516._ === 'List.cons') {
                                _defn$11 = $2516.head;
                                var $2515 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2517 = self.file;
                                            var $2518 = self.code;
                                            var $2519 = self.name;
                                            var $2520 = self.term;
                                            var $2521 = self.type;
                                            var $2522 = self.stat;
                                            var $2523 = $2520;
                                            return $2523;
                                    };
                                })());
                                _expr$12 = $2515;
                                $2516 = $2516.tail;
                            }
                            return _expr$12;
                        })();
                        var $2513 = _expr$11;
                        return $2513;
                    case 'Fm.Term.def':
                        var $2524 = self.name;
                        var $2525 = self.expr;
                        var $2526 = self.body;
                        var _expr$11 = (() => {
                            var $2529 = _expr$1;
                            var $2530 = _wyth$3;
                            let _expr$12 = $2529;
                            let _defn$11;
                            while ($2530._ === 'List.cons') {
                                _defn$11 = $2530.head;
                                var $2529 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2531 = self.file;
                                            var $2532 = self.code;
                                            var $2533 = self.name;
                                            var $2534 = self.term;
                                            var $2535 = self.type;
                                            var $2536 = self.stat;
                                            var $2537 = $2534;
                                            return $2537;
                                    };
                                })());
                                _expr$12 = $2529;
                                $2530 = $2530.tail;
                            }
                            return _expr$12;
                        })();
                        var $2527 = _expr$11;
                        return $2527;
                    case 'Fm.Term.ann':
                        var $2538 = self.done;
                        var $2539 = self.term;
                        var $2540 = self.type;
                        var _expr$11 = (() => {
                            var $2543 = _expr$1;
                            var $2544 = _wyth$3;
                            let _expr$12 = $2543;
                            let _defn$11;
                            while ($2544._ === 'List.cons') {
                                _defn$11 = $2544.head;
                                var $2543 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2545 = self.file;
                                            var $2546 = self.code;
                                            var $2547 = self.name;
                                            var $2548 = self.term;
                                            var $2549 = self.type;
                                            var $2550 = self.stat;
                                            var $2551 = $2548;
                                            return $2551;
                                    };
                                })());
                                _expr$12 = $2543;
                                $2544 = $2544.tail;
                            }
                            return _expr$12;
                        })();
                        var $2541 = _expr$11;
                        return $2541;
                    case 'Fm.Term.gol':
                        var $2552 = self.name;
                        var $2553 = self.dref;
                        var $2554 = self.verb;
                        var _expr$11 = (() => {
                            var $2557 = _expr$1;
                            var $2558 = _wyth$3;
                            let _expr$12 = $2557;
                            let _defn$11;
                            while ($2558._ === 'List.cons') {
                                _defn$11 = $2558.head;
                                var $2557 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2559 = self.file;
                                            var $2560 = self.code;
                                            var $2561 = self.name;
                                            var $2562 = self.term;
                                            var $2563 = self.type;
                                            var $2564 = self.stat;
                                            var $2565 = $2562;
                                            return $2565;
                                    };
                                })());
                                _expr$12 = $2557;
                                $2558 = $2558.tail;
                            }
                            return _expr$12;
                        })();
                        var $2555 = _expr$11;
                        return $2555;
                    case 'Fm.Term.hol':
                        var $2566 = self.path;
                        var _expr$9 = (() => {
                            var $2569 = _expr$1;
                            var $2570 = _wyth$3;
                            let _expr$10 = $2569;
                            let _defn$9;
                            while ($2570._ === 'List.cons') {
                                _defn$9 = $2570.head;
                                var $2569 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2571 = self.file;
                                            var $2572 = self.code;
                                            var $2573 = self.name;
                                            var $2574 = self.term;
                                            var $2575 = self.type;
                                            var $2576 = self.stat;
                                            var $2577 = $2574;
                                            return $2577;
                                    };
                                })());
                                _expr$10 = $2569;
                                $2570 = $2570.tail;
                            }
                            return _expr$10;
                        })();
                        var $2567 = _expr$9;
                        return $2567;
                    case 'Fm.Term.nat':
                        var $2578 = self.natx;
                        var _expr$9 = (() => {
                            var $2581 = _expr$1;
                            var $2582 = _wyth$3;
                            let _expr$10 = $2581;
                            let _defn$9;
                            while ($2582._ === 'List.cons') {
                                _defn$9 = $2582.head;
                                var $2581 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2583 = self.file;
                                            var $2584 = self.code;
                                            var $2585 = self.name;
                                            var $2586 = self.term;
                                            var $2587 = self.type;
                                            var $2588 = self.stat;
                                            var $2589 = $2586;
                                            return $2589;
                                    };
                                })());
                                _expr$10 = $2581;
                                $2582 = $2582.tail;
                            }
                            return _expr$10;
                        })();
                        var $2579 = _expr$9;
                        return $2579;
                    case 'Fm.Term.chr':
                        var $2590 = self.chrx;
                        var _expr$9 = (() => {
                            var $2593 = _expr$1;
                            var $2594 = _wyth$3;
                            let _expr$10 = $2593;
                            let _defn$9;
                            while ($2594._ === 'List.cons') {
                                _defn$9 = $2594.head;
                                var $2593 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2595 = self.file;
                                            var $2596 = self.code;
                                            var $2597 = self.name;
                                            var $2598 = self.term;
                                            var $2599 = self.type;
                                            var $2600 = self.stat;
                                            var $2601 = $2598;
                                            return $2601;
                                    };
                                })());
                                _expr$10 = $2593;
                                $2594 = $2594.tail;
                            }
                            return _expr$10;
                        })();
                        var $2591 = _expr$9;
                        return $2591;
                    case 'Fm.Term.str':
                        var $2602 = self.strx;
                        var _expr$9 = (() => {
                            var $2605 = _expr$1;
                            var $2606 = _wyth$3;
                            let _expr$10 = $2605;
                            let _defn$9;
                            while ($2606._ === 'List.cons') {
                                _defn$9 = $2606.head;
                                var $2605 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2607 = self.file;
                                            var $2608 = self.code;
                                            var $2609 = self.name;
                                            var $2610 = self.term;
                                            var $2611 = self.type;
                                            var $2612 = self.stat;
                                            var $2613 = $2610;
                                            return $2613;
                                    };
                                })());
                                _expr$10 = $2605;
                                $2606 = $2606.tail;
                            }
                            return _expr$10;
                        })();
                        var $2603 = _expr$9;
                        return $2603;
                    case 'Fm.Term.cse':
                        var $2614 = self.path;
                        var $2615 = self.expr;
                        var $2616 = self.name;
                        var $2617 = self.with;
                        var $2618 = self.cses;
                        var $2619 = self.moti;
                        var _expr$14 = (() => {
                            var $2622 = _expr$1;
                            var $2623 = _wyth$3;
                            let _expr$15 = $2622;
                            let _defn$14;
                            while ($2623._ === 'List.cons') {
                                _defn$14 = $2623.head;
                                var $2622 = Fm$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2624 = self.file;
                                            var $2625 = self.code;
                                            var $2626 = self.name;
                                            var $2627 = self.term;
                                            var $2628 = self.type;
                                            var $2629 = self.stat;
                                            var $2630 = $2627;
                                            return $2630;
                                    };
                                })());
                                _expr$15 = $2622;
                                $2623 = $2623.tail;
                            }
                            return _expr$15;
                        })();
                        var $2620 = _expr$14;
                        return $2620;
                    case 'Fm.Term.ori':
                        var $2631 = self.orig;
                        var $2632 = self.expr;
                        var _expr$10 = (() => {
                            var $2635 = _expr$1;
                            var $2636 = _wyth$3;
                            let _expr$11 = $2635;
                            let _defn$10;
                            while ($2636._ === 'List.cons') {
                                _defn$10 = $2636.head;
                                var $2635 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2637 = self.file;
                                            var $2638 = self.code;
                                            var $2639 = self.name;
                                            var $2640 = self.term;
                                            var $2641 = self.type;
                                            var $2642 = self.stat;
                                            var $2643 = $2640;
                                            return $2643;
                                    };
                                })());
                                _expr$11 = $2635;
                                $2636 = $2636.tail;
                            }
                            return _expr$11;
                        })();
                        var $2633 = _expr$10;
                        return $2633;
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
                var $2645 = self.name;
                var $2646 = self.indx;
                var $2647 = Maybe$none;
                var $2644 = $2647;
                break;
            case 'Fm.Term.ref':
                var $2648 = self.name;
                var $2649 = Maybe$none;
                var $2644 = $2649;
                break;
            case 'Fm.Term.typ':
                var $2650 = Maybe$none;
                var $2644 = $2650;
                break;
            case 'Fm.Term.all':
                var $2651 = self.eras;
                var $2652 = self.self;
                var $2653 = self.name;
                var $2654 = self.xtyp;
                var $2655 = self.body;
                var _moti$14 = Fm$Term$desugar_cse$motive$(_with$3, _moti$5);
                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, List$nil, $2654, _moti$14, _defs$7);
                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                var _type$17 = $2655(Fm$Term$var$($2652, 0n))(Fm$Term$var$($2653, 0n));
                var $2656 = Maybe$some$(Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _with$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $2644 = $2656;
                break;
            case 'Fm.Term.lam':
                var $2657 = self.name;
                var $2658 = self.body;
                var $2659 = Maybe$none;
                var $2644 = $2659;
                break;
            case 'Fm.Term.app':
                var $2660 = self.func;
                var $2661 = self.argm;
                var $2662 = Maybe$none;
                var $2644 = $2662;
                break;
            case 'Fm.Term.let':
                var $2663 = self.name;
                var $2664 = self.expr;
                var $2665 = self.body;
                var $2666 = Maybe$none;
                var $2644 = $2666;
                break;
            case 'Fm.Term.def':
                var $2667 = self.name;
                var $2668 = self.expr;
                var $2669 = self.body;
                var $2670 = Maybe$none;
                var $2644 = $2670;
                break;
            case 'Fm.Term.ann':
                var $2671 = self.done;
                var $2672 = self.term;
                var $2673 = self.type;
                var $2674 = Maybe$none;
                var $2644 = $2674;
                break;
            case 'Fm.Term.gol':
                var $2675 = self.name;
                var $2676 = self.dref;
                var $2677 = self.verb;
                var $2678 = Maybe$none;
                var $2644 = $2678;
                break;
            case 'Fm.Term.hol':
                var $2679 = self.path;
                var $2680 = Maybe$none;
                var $2644 = $2680;
                break;
            case 'Fm.Term.nat':
                var $2681 = self.natx;
                var $2682 = Maybe$none;
                var $2644 = $2682;
                break;
            case 'Fm.Term.chr':
                var $2683 = self.chrx;
                var $2684 = Maybe$none;
                var $2644 = $2684;
                break;
            case 'Fm.Term.str':
                var $2685 = self.strx;
                var $2686 = Maybe$none;
                var $2644 = $2686;
                break;
            case 'Fm.Term.cse':
                var $2687 = self.path;
                var $2688 = self.expr;
                var $2689 = self.name;
                var $2690 = self.with;
                var $2691 = self.cses;
                var $2692 = self.moti;
                var $2693 = Maybe$none;
                var $2644 = $2693;
                break;
            case 'Fm.Term.ori':
                var $2694 = self.orig;
                var $2695 = self.expr;
                var $2696 = Maybe$none;
                var $2644 = $2696;
                break;
        };
        return $2644;
    };
    const Fm$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Error$patch$(_path$1, _term$2) {
        var $2697 = ({
            _: 'Fm.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $2697;
    };
    const Fm$Error$patch = x0 => x1 => Fm$Error$patch$(x0, x1);

    function Fm$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.none':
                var $2699 = Bits$e;
                var $2698 = $2699;
                break;
            case 'Maybe.some':
                var $2700 = self.value;
                var $2701 = $2700(Bits$e);
                var $2698 = $2701;
                break;
        };
        return $2698;
    };
    const Fm$MPath$to_bits = x0 => Fm$MPath$to_bits$(x0);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $2703 = Bool$false;
                var $2702 = $2703;
                break;
            case 'Maybe.some':
                var $2704 = self.value;
                var $2705 = Bool$true;
                var $2702 = $2705;
                break;
        };
        return $2702;
    };
    const Set$has = x0 => x1 => Set$has$(x0, x1);

    function Fm$Term$equal$patch$(_path$2, _term$3, _ret$4) {
        var $2706 = Fm$Check$result$(Maybe$some$(_ret$4), List$cons$(Fm$Error$patch$(_path$2, Fm$Term$normalize$(_term$3, Map$new)), List$nil));
        return $2706;
    };
    const Fm$Term$equal$patch = x0 => x1 => x2 => Fm$Term$equal$patch$(x0, x1, x2);

    function Fm$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2708 = self.name;
                var $2709 = self.indx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2711 = self.name;
                        var $2712 = self.indx;
                        var $2713 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2713;
                        break;
                    case 'Fm.Term.ref':
                        var $2714 = self.name;
                        var $2715 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2715;
                        break;
                    case 'Fm.Term.typ':
                        var $2716 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2716;
                        break;
                    case 'Fm.Term.all':
                        var $2717 = self.eras;
                        var $2718 = self.self;
                        var $2719 = self.name;
                        var $2720 = self.xtyp;
                        var $2721 = self.body;
                        var $2722 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2722;
                        break;
                    case 'Fm.Term.lam':
                        var $2723 = self.name;
                        var $2724 = self.body;
                        var $2725 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2725;
                        break;
                    case 'Fm.Term.app':
                        var $2726 = self.func;
                        var $2727 = self.argm;
                        var $2728 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2728;
                        break;
                    case 'Fm.Term.let':
                        var $2729 = self.name;
                        var $2730 = self.expr;
                        var $2731 = self.body;
                        var $2732 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2732;
                        break;
                    case 'Fm.Term.def':
                        var $2733 = self.name;
                        var $2734 = self.expr;
                        var $2735 = self.body;
                        var $2736 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2736;
                        break;
                    case 'Fm.Term.ann':
                        var $2737 = self.done;
                        var $2738 = self.term;
                        var $2739 = self.type;
                        var $2740 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2740;
                        break;
                    case 'Fm.Term.gol':
                        var $2741 = self.name;
                        var $2742 = self.dref;
                        var $2743 = self.verb;
                        var $2744 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2744;
                        break;
                    case 'Fm.Term.hol':
                        var $2745 = self.path;
                        var $2746 = Fm$Term$equal$patch$($2745, _a$1, Unit$new);
                        var $2710 = $2746;
                        break;
                    case 'Fm.Term.nat':
                        var $2747 = self.natx;
                        var $2748 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2748;
                        break;
                    case 'Fm.Term.chr':
                        var $2749 = self.chrx;
                        var $2750 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2750;
                        break;
                    case 'Fm.Term.str':
                        var $2751 = self.strx;
                        var $2752 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2752;
                        break;
                    case 'Fm.Term.cse':
                        var $2753 = self.path;
                        var $2754 = self.expr;
                        var $2755 = self.name;
                        var $2756 = self.with;
                        var $2757 = self.cses;
                        var $2758 = self.moti;
                        var $2759 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2710 = $2759;
                        break;
                    case 'Fm.Term.ori':
                        var $2760 = self.orig;
                        var $2761 = self.expr;
                        var $2762 = Fm$Term$equal$extra_holes$(_a$1, $2761);
                        var $2710 = $2762;
                        break;
                };
                var $2707 = $2710;
                break;
            case 'Fm.Term.ref':
                var $2763 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2765 = self.name;
                        var $2766 = self.indx;
                        var $2767 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2767;
                        break;
                    case 'Fm.Term.ref':
                        var $2768 = self.name;
                        var $2769 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2769;
                        break;
                    case 'Fm.Term.typ':
                        var $2770 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2770;
                        break;
                    case 'Fm.Term.all':
                        var $2771 = self.eras;
                        var $2772 = self.self;
                        var $2773 = self.name;
                        var $2774 = self.xtyp;
                        var $2775 = self.body;
                        var $2776 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2776;
                        break;
                    case 'Fm.Term.lam':
                        var $2777 = self.name;
                        var $2778 = self.body;
                        var $2779 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2779;
                        break;
                    case 'Fm.Term.app':
                        var $2780 = self.func;
                        var $2781 = self.argm;
                        var $2782 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2782;
                        break;
                    case 'Fm.Term.let':
                        var $2783 = self.name;
                        var $2784 = self.expr;
                        var $2785 = self.body;
                        var $2786 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2786;
                        break;
                    case 'Fm.Term.def':
                        var $2787 = self.name;
                        var $2788 = self.expr;
                        var $2789 = self.body;
                        var $2790 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2790;
                        break;
                    case 'Fm.Term.ann':
                        var $2791 = self.done;
                        var $2792 = self.term;
                        var $2793 = self.type;
                        var $2794 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2794;
                        break;
                    case 'Fm.Term.gol':
                        var $2795 = self.name;
                        var $2796 = self.dref;
                        var $2797 = self.verb;
                        var $2798 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2798;
                        break;
                    case 'Fm.Term.hol':
                        var $2799 = self.path;
                        var $2800 = Fm$Term$equal$patch$($2799, _a$1, Unit$new);
                        var $2764 = $2800;
                        break;
                    case 'Fm.Term.nat':
                        var $2801 = self.natx;
                        var $2802 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2802;
                        break;
                    case 'Fm.Term.chr':
                        var $2803 = self.chrx;
                        var $2804 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2804;
                        break;
                    case 'Fm.Term.str':
                        var $2805 = self.strx;
                        var $2806 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2806;
                        break;
                    case 'Fm.Term.cse':
                        var $2807 = self.path;
                        var $2808 = self.expr;
                        var $2809 = self.name;
                        var $2810 = self.with;
                        var $2811 = self.cses;
                        var $2812 = self.moti;
                        var $2813 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2764 = $2813;
                        break;
                    case 'Fm.Term.ori':
                        var $2814 = self.orig;
                        var $2815 = self.expr;
                        var $2816 = Fm$Term$equal$extra_holes$(_a$1, $2815);
                        var $2764 = $2816;
                        break;
                };
                var $2707 = $2764;
                break;
            case 'Fm.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2818 = self.name;
                        var $2819 = self.indx;
                        var $2820 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2820;
                        break;
                    case 'Fm.Term.ref':
                        var $2821 = self.name;
                        var $2822 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2822;
                        break;
                    case 'Fm.Term.typ':
                        var $2823 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2823;
                        break;
                    case 'Fm.Term.all':
                        var $2824 = self.eras;
                        var $2825 = self.self;
                        var $2826 = self.name;
                        var $2827 = self.xtyp;
                        var $2828 = self.body;
                        var $2829 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2829;
                        break;
                    case 'Fm.Term.lam':
                        var $2830 = self.name;
                        var $2831 = self.body;
                        var $2832 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2832;
                        break;
                    case 'Fm.Term.app':
                        var $2833 = self.func;
                        var $2834 = self.argm;
                        var $2835 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2835;
                        break;
                    case 'Fm.Term.let':
                        var $2836 = self.name;
                        var $2837 = self.expr;
                        var $2838 = self.body;
                        var $2839 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2839;
                        break;
                    case 'Fm.Term.def':
                        var $2840 = self.name;
                        var $2841 = self.expr;
                        var $2842 = self.body;
                        var $2843 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2843;
                        break;
                    case 'Fm.Term.ann':
                        var $2844 = self.done;
                        var $2845 = self.term;
                        var $2846 = self.type;
                        var $2847 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2847;
                        break;
                    case 'Fm.Term.gol':
                        var $2848 = self.name;
                        var $2849 = self.dref;
                        var $2850 = self.verb;
                        var $2851 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2851;
                        break;
                    case 'Fm.Term.hol':
                        var $2852 = self.path;
                        var $2853 = Fm$Term$equal$patch$($2852, _a$1, Unit$new);
                        var $2817 = $2853;
                        break;
                    case 'Fm.Term.nat':
                        var $2854 = self.natx;
                        var $2855 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2855;
                        break;
                    case 'Fm.Term.chr':
                        var $2856 = self.chrx;
                        var $2857 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2857;
                        break;
                    case 'Fm.Term.str':
                        var $2858 = self.strx;
                        var $2859 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2859;
                        break;
                    case 'Fm.Term.cse':
                        var $2860 = self.path;
                        var $2861 = self.expr;
                        var $2862 = self.name;
                        var $2863 = self.with;
                        var $2864 = self.cses;
                        var $2865 = self.moti;
                        var $2866 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2817 = $2866;
                        break;
                    case 'Fm.Term.ori':
                        var $2867 = self.orig;
                        var $2868 = self.expr;
                        var $2869 = Fm$Term$equal$extra_holes$(_a$1, $2868);
                        var $2817 = $2869;
                        break;
                };
                var $2707 = $2817;
                break;
            case 'Fm.Term.all':
                var $2870 = self.eras;
                var $2871 = self.self;
                var $2872 = self.name;
                var $2873 = self.xtyp;
                var $2874 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2876 = self.name;
                        var $2877 = self.indx;
                        var $2878 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2878;
                        break;
                    case 'Fm.Term.ref':
                        var $2879 = self.name;
                        var $2880 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2880;
                        break;
                    case 'Fm.Term.typ':
                        var $2881 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2881;
                        break;
                    case 'Fm.Term.all':
                        var $2882 = self.eras;
                        var $2883 = self.self;
                        var $2884 = self.name;
                        var $2885 = self.xtyp;
                        var $2886 = self.body;
                        var $2887 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2887;
                        break;
                    case 'Fm.Term.lam':
                        var $2888 = self.name;
                        var $2889 = self.body;
                        var $2890 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2890;
                        break;
                    case 'Fm.Term.app':
                        var $2891 = self.func;
                        var $2892 = self.argm;
                        var $2893 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2893;
                        break;
                    case 'Fm.Term.let':
                        var $2894 = self.name;
                        var $2895 = self.expr;
                        var $2896 = self.body;
                        var $2897 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2897;
                        break;
                    case 'Fm.Term.def':
                        var $2898 = self.name;
                        var $2899 = self.expr;
                        var $2900 = self.body;
                        var $2901 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2901;
                        break;
                    case 'Fm.Term.ann':
                        var $2902 = self.done;
                        var $2903 = self.term;
                        var $2904 = self.type;
                        var $2905 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2905;
                        break;
                    case 'Fm.Term.gol':
                        var $2906 = self.name;
                        var $2907 = self.dref;
                        var $2908 = self.verb;
                        var $2909 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2909;
                        break;
                    case 'Fm.Term.hol':
                        var $2910 = self.path;
                        var $2911 = Fm$Term$equal$patch$($2910, _a$1, Unit$new);
                        var $2875 = $2911;
                        break;
                    case 'Fm.Term.nat':
                        var $2912 = self.natx;
                        var $2913 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2913;
                        break;
                    case 'Fm.Term.chr':
                        var $2914 = self.chrx;
                        var $2915 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2915;
                        break;
                    case 'Fm.Term.str':
                        var $2916 = self.strx;
                        var $2917 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2917;
                        break;
                    case 'Fm.Term.cse':
                        var $2918 = self.path;
                        var $2919 = self.expr;
                        var $2920 = self.name;
                        var $2921 = self.with;
                        var $2922 = self.cses;
                        var $2923 = self.moti;
                        var $2924 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2875 = $2924;
                        break;
                    case 'Fm.Term.ori':
                        var $2925 = self.orig;
                        var $2926 = self.expr;
                        var $2927 = Fm$Term$equal$extra_holes$(_a$1, $2926);
                        var $2875 = $2927;
                        break;
                };
                var $2707 = $2875;
                break;
            case 'Fm.Term.lam':
                var $2928 = self.name;
                var $2929 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2931 = self.name;
                        var $2932 = self.indx;
                        var $2933 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2933;
                        break;
                    case 'Fm.Term.ref':
                        var $2934 = self.name;
                        var $2935 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2935;
                        break;
                    case 'Fm.Term.typ':
                        var $2936 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2936;
                        break;
                    case 'Fm.Term.all':
                        var $2937 = self.eras;
                        var $2938 = self.self;
                        var $2939 = self.name;
                        var $2940 = self.xtyp;
                        var $2941 = self.body;
                        var $2942 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2942;
                        break;
                    case 'Fm.Term.lam':
                        var $2943 = self.name;
                        var $2944 = self.body;
                        var $2945 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2945;
                        break;
                    case 'Fm.Term.app':
                        var $2946 = self.func;
                        var $2947 = self.argm;
                        var $2948 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2948;
                        break;
                    case 'Fm.Term.let':
                        var $2949 = self.name;
                        var $2950 = self.expr;
                        var $2951 = self.body;
                        var $2952 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2952;
                        break;
                    case 'Fm.Term.def':
                        var $2953 = self.name;
                        var $2954 = self.expr;
                        var $2955 = self.body;
                        var $2956 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2956;
                        break;
                    case 'Fm.Term.ann':
                        var $2957 = self.done;
                        var $2958 = self.term;
                        var $2959 = self.type;
                        var $2960 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2960;
                        break;
                    case 'Fm.Term.gol':
                        var $2961 = self.name;
                        var $2962 = self.dref;
                        var $2963 = self.verb;
                        var $2964 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2964;
                        break;
                    case 'Fm.Term.hol':
                        var $2965 = self.path;
                        var $2966 = Fm$Term$equal$patch$($2965, _a$1, Unit$new);
                        var $2930 = $2966;
                        break;
                    case 'Fm.Term.nat':
                        var $2967 = self.natx;
                        var $2968 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2968;
                        break;
                    case 'Fm.Term.chr':
                        var $2969 = self.chrx;
                        var $2970 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2970;
                        break;
                    case 'Fm.Term.str':
                        var $2971 = self.strx;
                        var $2972 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2972;
                        break;
                    case 'Fm.Term.cse':
                        var $2973 = self.path;
                        var $2974 = self.expr;
                        var $2975 = self.name;
                        var $2976 = self.with;
                        var $2977 = self.cses;
                        var $2978 = self.moti;
                        var $2979 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2930 = $2979;
                        break;
                    case 'Fm.Term.ori':
                        var $2980 = self.orig;
                        var $2981 = self.expr;
                        var $2982 = Fm$Term$equal$extra_holes$(_a$1, $2981);
                        var $2930 = $2982;
                        break;
                };
                var $2707 = $2930;
                break;
            case 'Fm.Term.app':
                var $2983 = self.func;
                var $2984 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2986 = self.name;
                        var $2987 = self.indx;
                        var $2988 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $2988;
                        break;
                    case 'Fm.Term.ref':
                        var $2989 = self.name;
                        var $2990 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $2990;
                        break;
                    case 'Fm.Term.typ':
                        var $2991 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $2991;
                        break;
                    case 'Fm.Term.all':
                        var $2992 = self.eras;
                        var $2993 = self.self;
                        var $2994 = self.name;
                        var $2995 = self.xtyp;
                        var $2996 = self.body;
                        var $2997 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $2997;
                        break;
                    case 'Fm.Term.lam':
                        var $2998 = self.name;
                        var $2999 = self.body;
                        var $3000 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $3000;
                        break;
                    case 'Fm.Term.app':
                        var $3001 = self.func;
                        var $3002 = self.argm;
                        var $3003 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$($2983, $3001))((_$7 => {
                            var $3004 = Fm$Term$equal$extra_holes$($2984, $3002);
                            return $3004;
                        }));
                        var $2985 = $3003;
                        break;
                    case 'Fm.Term.let':
                        var $3005 = self.name;
                        var $3006 = self.expr;
                        var $3007 = self.body;
                        var $3008 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $3008;
                        break;
                    case 'Fm.Term.def':
                        var $3009 = self.name;
                        var $3010 = self.expr;
                        var $3011 = self.body;
                        var $3012 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $3012;
                        break;
                    case 'Fm.Term.ann':
                        var $3013 = self.done;
                        var $3014 = self.term;
                        var $3015 = self.type;
                        var $3016 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $3016;
                        break;
                    case 'Fm.Term.gol':
                        var $3017 = self.name;
                        var $3018 = self.dref;
                        var $3019 = self.verb;
                        var $3020 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $3020;
                        break;
                    case 'Fm.Term.hol':
                        var $3021 = self.path;
                        var $3022 = Fm$Term$equal$patch$($3021, _a$1, Unit$new);
                        var $2985 = $3022;
                        break;
                    case 'Fm.Term.nat':
                        var $3023 = self.natx;
                        var $3024 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $3024;
                        break;
                    case 'Fm.Term.chr':
                        var $3025 = self.chrx;
                        var $3026 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $3026;
                        break;
                    case 'Fm.Term.str':
                        var $3027 = self.strx;
                        var $3028 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $3028;
                        break;
                    case 'Fm.Term.cse':
                        var $3029 = self.path;
                        var $3030 = self.expr;
                        var $3031 = self.name;
                        var $3032 = self.with;
                        var $3033 = self.cses;
                        var $3034 = self.moti;
                        var $3035 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2985 = $3035;
                        break;
                    case 'Fm.Term.ori':
                        var $3036 = self.orig;
                        var $3037 = self.expr;
                        var $3038 = Fm$Term$equal$extra_holes$(_a$1, $3037);
                        var $2985 = $3038;
                        break;
                };
                var $2707 = $2985;
                break;
            case 'Fm.Term.let':
                var $3039 = self.name;
                var $3040 = self.expr;
                var $3041 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3043 = self.name;
                        var $3044 = self.indx;
                        var $3045 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3045;
                        break;
                    case 'Fm.Term.ref':
                        var $3046 = self.name;
                        var $3047 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3047;
                        break;
                    case 'Fm.Term.typ':
                        var $3048 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3048;
                        break;
                    case 'Fm.Term.all':
                        var $3049 = self.eras;
                        var $3050 = self.self;
                        var $3051 = self.name;
                        var $3052 = self.xtyp;
                        var $3053 = self.body;
                        var $3054 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3054;
                        break;
                    case 'Fm.Term.lam':
                        var $3055 = self.name;
                        var $3056 = self.body;
                        var $3057 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3057;
                        break;
                    case 'Fm.Term.app':
                        var $3058 = self.func;
                        var $3059 = self.argm;
                        var $3060 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3060;
                        break;
                    case 'Fm.Term.let':
                        var $3061 = self.name;
                        var $3062 = self.expr;
                        var $3063 = self.body;
                        var $3064 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3064;
                        break;
                    case 'Fm.Term.def':
                        var $3065 = self.name;
                        var $3066 = self.expr;
                        var $3067 = self.body;
                        var $3068 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3068;
                        break;
                    case 'Fm.Term.ann':
                        var $3069 = self.done;
                        var $3070 = self.term;
                        var $3071 = self.type;
                        var $3072 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3072;
                        break;
                    case 'Fm.Term.gol':
                        var $3073 = self.name;
                        var $3074 = self.dref;
                        var $3075 = self.verb;
                        var $3076 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3076;
                        break;
                    case 'Fm.Term.hol':
                        var $3077 = self.path;
                        var $3078 = Fm$Term$equal$patch$($3077, _a$1, Unit$new);
                        var $3042 = $3078;
                        break;
                    case 'Fm.Term.nat':
                        var $3079 = self.natx;
                        var $3080 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3080;
                        break;
                    case 'Fm.Term.chr':
                        var $3081 = self.chrx;
                        var $3082 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3082;
                        break;
                    case 'Fm.Term.str':
                        var $3083 = self.strx;
                        var $3084 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3084;
                        break;
                    case 'Fm.Term.cse':
                        var $3085 = self.path;
                        var $3086 = self.expr;
                        var $3087 = self.name;
                        var $3088 = self.with;
                        var $3089 = self.cses;
                        var $3090 = self.moti;
                        var $3091 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3042 = $3091;
                        break;
                    case 'Fm.Term.ori':
                        var $3092 = self.orig;
                        var $3093 = self.expr;
                        var $3094 = Fm$Term$equal$extra_holes$(_a$1, $3093);
                        var $3042 = $3094;
                        break;
                };
                var $2707 = $3042;
                break;
            case 'Fm.Term.def':
                var $3095 = self.name;
                var $3096 = self.expr;
                var $3097 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3099 = self.name;
                        var $3100 = self.indx;
                        var $3101 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3101;
                        break;
                    case 'Fm.Term.ref':
                        var $3102 = self.name;
                        var $3103 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3103;
                        break;
                    case 'Fm.Term.typ':
                        var $3104 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3104;
                        break;
                    case 'Fm.Term.all':
                        var $3105 = self.eras;
                        var $3106 = self.self;
                        var $3107 = self.name;
                        var $3108 = self.xtyp;
                        var $3109 = self.body;
                        var $3110 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3110;
                        break;
                    case 'Fm.Term.lam':
                        var $3111 = self.name;
                        var $3112 = self.body;
                        var $3113 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3113;
                        break;
                    case 'Fm.Term.app':
                        var $3114 = self.func;
                        var $3115 = self.argm;
                        var $3116 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3116;
                        break;
                    case 'Fm.Term.let':
                        var $3117 = self.name;
                        var $3118 = self.expr;
                        var $3119 = self.body;
                        var $3120 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3120;
                        break;
                    case 'Fm.Term.def':
                        var $3121 = self.name;
                        var $3122 = self.expr;
                        var $3123 = self.body;
                        var $3124 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3124;
                        break;
                    case 'Fm.Term.ann':
                        var $3125 = self.done;
                        var $3126 = self.term;
                        var $3127 = self.type;
                        var $3128 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3128;
                        break;
                    case 'Fm.Term.gol':
                        var $3129 = self.name;
                        var $3130 = self.dref;
                        var $3131 = self.verb;
                        var $3132 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3132;
                        break;
                    case 'Fm.Term.hol':
                        var $3133 = self.path;
                        var $3134 = Fm$Term$equal$patch$($3133, _a$1, Unit$new);
                        var $3098 = $3134;
                        break;
                    case 'Fm.Term.nat':
                        var $3135 = self.natx;
                        var $3136 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3136;
                        break;
                    case 'Fm.Term.chr':
                        var $3137 = self.chrx;
                        var $3138 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3138;
                        break;
                    case 'Fm.Term.str':
                        var $3139 = self.strx;
                        var $3140 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3140;
                        break;
                    case 'Fm.Term.cse':
                        var $3141 = self.path;
                        var $3142 = self.expr;
                        var $3143 = self.name;
                        var $3144 = self.with;
                        var $3145 = self.cses;
                        var $3146 = self.moti;
                        var $3147 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3098 = $3147;
                        break;
                    case 'Fm.Term.ori':
                        var $3148 = self.orig;
                        var $3149 = self.expr;
                        var $3150 = Fm$Term$equal$extra_holes$(_a$1, $3149);
                        var $3098 = $3150;
                        break;
                };
                var $2707 = $3098;
                break;
            case 'Fm.Term.ann':
                var $3151 = self.done;
                var $3152 = self.term;
                var $3153 = self.type;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3155 = self.name;
                        var $3156 = self.indx;
                        var $3157 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3157;
                        break;
                    case 'Fm.Term.ref':
                        var $3158 = self.name;
                        var $3159 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3159;
                        break;
                    case 'Fm.Term.typ':
                        var $3160 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3160;
                        break;
                    case 'Fm.Term.all':
                        var $3161 = self.eras;
                        var $3162 = self.self;
                        var $3163 = self.name;
                        var $3164 = self.xtyp;
                        var $3165 = self.body;
                        var $3166 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3166;
                        break;
                    case 'Fm.Term.lam':
                        var $3167 = self.name;
                        var $3168 = self.body;
                        var $3169 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3169;
                        break;
                    case 'Fm.Term.app':
                        var $3170 = self.func;
                        var $3171 = self.argm;
                        var $3172 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3172;
                        break;
                    case 'Fm.Term.let':
                        var $3173 = self.name;
                        var $3174 = self.expr;
                        var $3175 = self.body;
                        var $3176 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3176;
                        break;
                    case 'Fm.Term.def':
                        var $3177 = self.name;
                        var $3178 = self.expr;
                        var $3179 = self.body;
                        var $3180 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3180;
                        break;
                    case 'Fm.Term.ann':
                        var $3181 = self.done;
                        var $3182 = self.term;
                        var $3183 = self.type;
                        var $3184 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3184;
                        break;
                    case 'Fm.Term.gol':
                        var $3185 = self.name;
                        var $3186 = self.dref;
                        var $3187 = self.verb;
                        var $3188 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3188;
                        break;
                    case 'Fm.Term.hol':
                        var $3189 = self.path;
                        var $3190 = Fm$Term$equal$patch$($3189, _a$1, Unit$new);
                        var $3154 = $3190;
                        break;
                    case 'Fm.Term.nat':
                        var $3191 = self.natx;
                        var $3192 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3192;
                        break;
                    case 'Fm.Term.chr':
                        var $3193 = self.chrx;
                        var $3194 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3194;
                        break;
                    case 'Fm.Term.str':
                        var $3195 = self.strx;
                        var $3196 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3196;
                        break;
                    case 'Fm.Term.cse':
                        var $3197 = self.path;
                        var $3198 = self.expr;
                        var $3199 = self.name;
                        var $3200 = self.with;
                        var $3201 = self.cses;
                        var $3202 = self.moti;
                        var $3203 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3154 = $3203;
                        break;
                    case 'Fm.Term.ori':
                        var $3204 = self.orig;
                        var $3205 = self.expr;
                        var $3206 = Fm$Term$equal$extra_holes$(_a$1, $3205);
                        var $3154 = $3206;
                        break;
                };
                var $2707 = $3154;
                break;
            case 'Fm.Term.gol':
                var $3207 = self.name;
                var $3208 = self.dref;
                var $3209 = self.verb;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3211 = self.name;
                        var $3212 = self.indx;
                        var $3213 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3213;
                        break;
                    case 'Fm.Term.ref':
                        var $3214 = self.name;
                        var $3215 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3215;
                        break;
                    case 'Fm.Term.typ':
                        var $3216 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3216;
                        break;
                    case 'Fm.Term.all':
                        var $3217 = self.eras;
                        var $3218 = self.self;
                        var $3219 = self.name;
                        var $3220 = self.xtyp;
                        var $3221 = self.body;
                        var $3222 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3222;
                        break;
                    case 'Fm.Term.lam':
                        var $3223 = self.name;
                        var $3224 = self.body;
                        var $3225 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3225;
                        break;
                    case 'Fm.Term.app':
                        var $3226 = self.func;
                        var $3227 = self.argm;
                        var $3228 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3228;
                        break;
                    case 'Fm.Term.let':
                        var $3229 = self.name;
                        var $3230 = self.expr;
                        var $3231 = self.body;
                        var $3232 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3232;
                        break;
                    case 'Fm.Term.def':
                        var $3233 = self.name;
                        var $3234 = self.expr;
                        var $3235 = self.body;
                        var $3236 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3236;
                        break;
                    case 'Fm.Term.ann':
                        var $3237 = self.done;
                        var $3238 = self.term;
                        var $3239 = self.type;
                        var $3240 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3240;
                        break;
                    case 'Fm.Term.gol':
                        var $3241 = self.name;
                        var $3242 = self.dref;
                        var $3243 = self.verb;
                        var $3244 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3244;
                        break;
                    case 'Fm.Term.hol':
                        var $3245 = self.path;
                        var $3246 = Fm$Term$equal$patch$($3245, _a$1, Unit$new);
                        var $3210 = $3246;
                        break;
                    case 'Fm.Term.nat':
                        var $3247 = self.natx;
                        var $3248 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3248;
                        break;
                    case 'Fm.Term.chr':
                        var $3249 = self.chrx;
                        var $3250 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3250;
                        break;
                    case 'Fm.Term.str':
                        var $3251 = self.strx;
                        var $3252 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3252;
                        break;
                    case 'Fm.Term.cse':
                        var $3253 = self.path;
                        var $3254 = self.expr;
                        var $3255 = self.name;
                        var $3256 = self.with;
                        var $3257 = self.cses;
                        var $3258 = self.moti;
                        var $3259 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3210 = $3259;
                        break;
                    case 'Fm.Term.ori':
                        var $3260 = self.orig;
                        var $3261 = self.expr;
                        var $3262 = Fm$Term$equal$extra_holes$(_a$1, $3261);
                        var $3210 = $3262;
                        break;
                };
                var $2707 = $3210;
                break;
            case 'Fm.Term.hol':
                var $3263 = self.path;
                var $3264 = Fm$Term$equal$patch$($3263, _b$2, Unit$new);
                var $2707 = $3264;
                break;
            case 'Fm.Term.nat':
                var $3265 = self.natx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3267 = self.name;
                        var $3268 = self.indx;
                        var $3269 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3269;
                        break;
                    case 'Fm.Term.ref':
                        var $3270 = self.name;
                        var $3271 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3271;
                        break;
                    case 'Fm.Term.typ':
                        var $3272 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3272;
                        break;
                    case 'Fm.Term.all':
                        var $3273 = self.eras;
                        var $3274 = self.self;
                        var $3275 = self.name;
                        var $3276 = self.xtyp;
                        var $3277 = self.body;
                        var $3278 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3278;
                        break;
                    case 'Fm.Term.lam':
                        var $3279 = self.name;
                        var $3280 = self.body;
                        var $3281 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3281;
                        break;
                    case 'Fm.Term.app':
                        var $3282 = self.func;
                        var $3283 = self.argm;
                        var $3284 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3284;
                        break;
                    case 'Fm.Term.let':
                        var $3285 = self.name;
                        var $3286 = self.expr;
                        var $3287 = self.body;
                        var $3288 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3288;
                        break;
                    case 'Fm.Term.def':
                        var $3289 = self.name;
                        var $3290 = self.expr;
                        var $3291 = self.body;
                        var $3292 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3292;
                        break;
                    case 'Fm.Term.ann':
                        var $3293 = self.done;
                        var $3294 = self.term;
                        var $3295 = self.type;
                        var $3296 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3296;
                        break;
                    case 'Fm.Term.gol':
                        var $3297 = self.name;
                        var $3298 = self.dref;
                        var $3299 = self.verb;
                        var $3300 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3300;
                        break;
                    case 'Fm.Term.hol':
                        var $3301 = self.path;
                        var $3302 = Fm$Term$equal$patch$($3301, _a$1, Unit$new);
                        var $3266 = $3302;
                        break;
                    case 'Fm.Term.nat':
                        var $3303 = self.natx;
                        var $3304 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3304;
                        break;
                    case 'Fm.Term.chr':
                        var $3305 = self.chrx;
                        var $3306 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3306;
                        break;
                    case 'Fm.Term.str':
                        var $3307 = self.strx;
                        var $3308 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3308;
                        break;
                    case 'Fm.Term.cse':
                        var $3309 = self.path;
                        var $3310 = self.expr;
                        var $3311 = self.name;
                        var $3312 = self.with;
                        var $3313 = self.cses;
                        var $3314 = self.moti;
                        var $3315 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3266 = $3315;
                        break;
                    case 'Fm.Term.ori':
                        var $3316 = self.orig;
                        var $3317 = self.expr;
                        var $3318 = Fm$Term$equal$extra_holes$(_a$1, $3317);
                        var $3266 = $3318;
                        break;
                };
                var $2707 = $3266;
                break;
            case 'Fm.Term.chr':
                var $3319 = self.chrx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3321 = self.name;
                        var $3322 = self.indx;
                        var $3323 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3323;
                        break;
                    case 'Fm.Term.ref':
                        var $3324 = self.name;
                        var $3325 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3325;
                        break;
                    case 'Fm.Term.typ':
                        var $3326 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3326;
                        break;
                    case 'Fm.Term.all':
                        var $3327 = self.eras;
                        var $3328 = self.self;
                        var $3329 = self.name;
                        var $3330 = self.xtyp;
                        var $3331 = self.body;
                        var $3332 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3332;
                        break;
                    case 'Fm.Term.lam':
                        var $3333 = self.name;
                        var $3334 = self.body;
                        var $3335 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3335;
                        break;
                    case 'Fm.Term.app':
                        var $3336 = self.func;
                        var $3337 = self.argm;
                        var $3338 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3338;
                        break;
                    case 'Fm.Term.let':
                        var $3339 = self.name;
                        var $3340 = self.expr;
                        var $3341 = self.body;
                        var $3342 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3342;
                        break;
                    case 'Fm.Term.def':
                        var $3343 = self.name;
                        var $3344 = self.expr;
                        var $3345 = self.body;
                        var $3346 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3346;
                        break;
                    case 'Fm.Term.ann':
                        var $3347 = self.done;
                        var $3348 = self.term;
                        var $3349 = self.type;
                        var $3350 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3350;
                        break;
                    case 'Fm.Term.gol':
                        var $3351 = self.name;
                        var $3352 = self.dref;
                        var $3353 = self.verb;
                        var $3354 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3354;
                        break;
                    case 'Fm.Term.hol':
                        var $3355 = self.path;
                        var $3356 = Fm$Term$equal$patch$($3355, _a$1, Unit$new);
                        var $3320 = $3356;
                        break;
                    case 'Fm.Term.nat':
                        var $3357 = self.natx;
                        var $3358 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3358;
                        break;
                    case 'Fm.Term.chr':
                        var $3359 = self.chrx;
                        var $3360 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3360;
                        break;
                    case 'Fm.Term.str':
                        var $3361 = self.strx;
                        var $3362 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3362;
                        break;
                    case 'Fm.Term.cse':
                        var $3363 = self.path;
                        var $3364 = self.expr;
                        var $3365 = self.name;
                        var $3366 = self.with;
                        var $3367 = self.cses;
                        var $3368 = self.moti;
                        var $3369 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3320 = $3369;
                        break;
                    case 'Fm.Term.ori':
                        var $3370 = self.orig;
                        var $3371 = self.expr;
                        var $3372 = Fm$Term$equal$extra_holes$(_a$1, $3371);
                        var $3320 = $3372;
                        break;
                };
                var $2707 = $3320;
                break;
            case 'Fm.Term.str':
                var $3373 = self.strx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3375 = self.name;
                        var $3376 = self.indx;
                        var $3377 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3377;
                        break;
                    case 'Fm.Term.ref':
                        var $3378 = self.name;
                        var $3379 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3379;
                        break;
                    case 'Fm.Term.typ':
                        var $3380 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3380;
                        break;
                    case 'Fm.Term.all':
                        var $3381 = self.eras;
                        var $3382 = self.self;
                        var $3383 = self.name;
                        var $3384 = self.xtyp;
                        var $3385 = self.body;
                        var $3386 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3386;
                        break;
                    case 'Fm.Term.lam':
                        var $3387 = self.name;
                        var $3388 = self.body;
                        var $3389 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3389;
                        break;
                    case 'Fm.Term.app':
                        var $3390 = self.func;
                        var $3391 = self.argm;
                        var $3392 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3392;
                        break;
                    case 'Fm.Term.let':
                        var $3393 = self.name;
                        var $3394 = self.expr;
                        var $3395 = self.body;
                        var $3396 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3396;
                        break;
                    case 'Fm.Term.def':
                        var $3397 = self.name;
                        var $3398 = self.expr;
                        var $3399 = self.body;
                        var $3400 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3400;
                        break;
                    case 'Fm.Term.ann':
                        var $3401 = self.done;
                        var $3402 = self.term;
                        var $3403 = self.type;
                        var $3404 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3404;
                        break;
                    case 'Fm.Term.gol':
                        var $3405 = self.name;
                        var $3406 = self.dref;
                        var $3407 = self.verb;
                        var $3408 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3408;
                        break;
                    case 'Fm.Term.hol':
                        var $3409 = self.path;
                        var $3410 = Fm$Term$equal$patch$($3409, _a$1, Unit$new);
                        var $3374 = $3410;
                        break;
                    case 'Fm.Term.nat':
                        var $3411 = self.natx;
                        var $3412 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3412;
                        break;
                    case 'Fm.Term.chr':
                        var $3413 = self.chrx;
                        var $3414 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3414;
                        break;
                    case 'Fm.Term.str':
                        var $3415 = self.strx;
                        var $3416 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3416;
                        break;
                    case 'Fm.Term.cse':
                        var $3417 = self.path;
                        var $3418 = self.expr;
                        var $3419 = self.name;
                        var $3420 = self.with;
                        var $3421 = self.cses;
                        var $3422 = self.moti;
                        var $3423 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3374 = $3423;
                        break;
                    case 'Fm.Term.ori':
                        var $3424 = self.orig;
                        var $3425 = self.expr;
                        var $3426 = Fm$Term$equal$extra_holes$(_a$1, $3425);
                        var $3374 = $3426;
                        break;
                };
                var $2707 = $3374;
                break;
            case 'Fm.Term.cse':
                var $3427 = self.path;
                var $3428 = self.expr;
                var $3429 = self.name;
                var $3430 = self.with;
                var $3431 = self.cses;
                var $3432 = self.moti;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3434 = self.name;
                        var $3435 = self.indx;
                        var $3436 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3436;
                        break;
                    case 'Fm.Term.ref':
                        var $3437 = self.name;
                        var $3438 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3438;
                        break;
                    case 'Fm.Term.typ':
                        var $3439 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3439;
                        break;
                    case 'Fm.Term.all':
                        var $3440 = self.eras;
                        var $3441 = self.self;
                        var $3442 = self.name;
                        var $3443 = self.xtyp;
                        var $3444 = self.body;
                        var $3445 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3445;
                        break;
                    case 'Fm.Term.lam':
                        var $3446 = self.name;
                        var $3447 = self.body;
                        var $3448 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3448;
                        break;
                    case 'Fm.Term.app':
                        var $3449 = self.func;
                        var $3450 = self.argm;
                        var $3451 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3451;
                        break;
                    case 'Fm.Term.let':
                        var $3452 = self.name;
                        var $3453 = self.expr;
                        var $3454 = self.body;
                        var $3455 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3455;
                        break;
                    case 'Fm.Term.def':
                        var $3456 = self.name;
                        var $3457 = self.expr;
                        var $3458 = self.body;
                        var $3459 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3459;
                        break;
                    case 'Fm.Term.ann':
                        var $3460 = self.done;
                        var $3461 = self.term;
                        var $3462 = self.type;
                        var $3463 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3463;
                        break;
                    case 'Fm.Term.gol':
                        var $3464 = self.name;
                        var $3465 = self.dref;
                        var $3466 = self.verb;
                        var $3467 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3467;
                        break;
                    case 'Fm.Term.hol':
                        var $3468 = self.path;
                        var $3469 = Fm$Term$equal$patch$($3468, _a$1, Unit$new);
                        var $3433 = $3469;
                        break;
                    case 'Fm.Term.nat':
                        var $3470 = self.natx;
                        var $3471 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3471;
                        break;
                    case 'Fm.Term.chr':
                        var $3472 = self.chrx;
                        var $3473 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3473;
                        break;
                    case 'Fm.Term.str':
                        var $3474 = self.strx;
                        var $3475 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3475;
                        break;
                    case 'Fm.Term.cse':
                        var $3476 = self.path;
                        var $3477 = self.expr;
                        var $3478 = self.name;
                        var $3479 = self.with;
                        var $3480 = self.cses;
                        var $3481 = self.moti;
                        var $3482 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3433 = $3482;
                        break;
                    case 'Fm.Term.ori':
                        var $3483 = self.orig;
                        var $3484 = self.expr;
                        var $3485 = Fm$Term$equal$extra_holes$(_a$1, $3484);
                        var $3433 = $3485;
                        break;
                };
                var $2707 = $3433;
                break;
            case 'Fm.Term.ori':
                var $3486 = self.orig;
                var $3487 = self.expr;
                var $3488 = Fm$Term$equal$extra_holes$($3487, _b$2);
                var $2707 = $3488;
                break;
        };
        return $2707;
    };
    const Fm$Term$equal$extra_holes = x0 => x1 => Fm$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $3489 = Map$set$(_bits$1, Unit$new, _set$2);
        return $3489;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $3491 = _b$2;
            var $3490 = $3491;
        } else {
            var $3492 = (!_b$2);
            var $3490 = $3492;
        };
        return $3490;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Fm$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Fm$Term$serialize$(Fm$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$e);
        var _bh$7 = Fm$Term$serialize$(Fm$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $3494 = Monad$pure$(Fm$Check$monad)(Bool$true);
            var $3493 = $3494;
        } else {
            var _a1$8 = Fm$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Fm$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Fm$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$e);
            var _bh$11 = Fm$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $3496 = Monad$pure$(Fm$Check$monad)(Bool$true);
                var $3495 = $3496;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = Set$has$(_id$12, _seen$5);
                if (self) {
                    var $3498 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$(_a$1, _b$2))((_$13 => {
                        var $3499 = Monad$pure$(Fm$Check$monad)(Bool$true);
                        return $3499;
                    }));
                    var $3497 = $3498;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Fm.Term.var':
                            var $3501 = self.name;
                            var $3502 = self.indx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3504 = self.name;
                                    var $3505 = self.indx;
                                    var $3506 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3506;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3507 = self.name;
                                    var $3508 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3508;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3509 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3509;
                                    break;
                                case 'Fm.Term.all':
                                    var $3510 = self.eras;
                                    var $3511 = self.self;
                                    var $3512 = self.name;
                                    var $3513 = self.xtyp;
                                    var $3514 = self.body;
                                    var $3515 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3515;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3516 = self.name;
                                    var $3517 = self.body;
                                    var $3518 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3518;
                                    break;
                                case 'Fm.Term.app':
                                    var $3519 = self.func;
                                    var $3520 = self.argm;
                                    var $3521 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3521;
                                    break;
                                case 'Fm.Term.let':
                                    var $3522 = self.name;
                                    var $3523 = self.expr;
                                    var $3524 = self.body;
                                    var $3525 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3525;
                                    break;
                                case 'Fm.Term.def':
                                    var $3526 = self.name;
                                    var $3527 = self.expr;
                                    var $3528 = self.body;
                                    var $3529 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3529;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3530 = self.done;
                                    var $3531 = self.term;
                                    var $3532 = self.type;
                                    var $3533 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3533;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3534 = self.name;
                                    var $3535 = self.dref;
                                    var $3536 = self.verb;
                                    var $3537 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3537;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3538 = self.path;
                                    var $3539 = Fm$Term$equal$patch$($3538, _a$1, Bool$true);
                                    var $3503 = $3539;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3540 = self.natx;
                                    var $3541 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3541;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3542 = self.chrx;
                                    var $3543 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3543;
                                    break;
                                case 'Fm.Term.str':
                                    var $3544 = self.strx;
                                    var $3545 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3545;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3546 = self.path;
                                    var $3547 = self.expr;
                                    var $3548 = self.name;
                                    var $3549 = self.with;
                                    var $3550 = self.cses;
                                    var $3551 = self.moti;
                                    var $3552 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3552;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3553 = self.orig;
                                    var $3554 = self.expr;
                                    var $3555 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3503 = $3555;
                                    break;
                            };
                            var $3500 = $3503;
                            break;
                        case 'Fm.Term.ref':
                            var $3556 = self.name;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3558 = self.name;
                                    var $3559 = self.indx;
                                    var $3560 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3560;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3561 = self.name;
                                    var $3562 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3562;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3563 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3563;
                                    break;
                                case 'Fm.Term.all':
                                    var $3564 = self.eras;
                                    var $3565 = self.self;
                                    var $3566 = self.name;
                                    var $3567 = self.xtyp;
                                    var $3568 = self.body;
                                    var $3569 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3569;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3570 = self.name;
                                    var $3571 = self.body;
                                    var $3572 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3572;
                                    break;
                                case 'Fm.Term.app':
                                    var $3573 = self.func;
                                    var $3574 = self.argm;
                                    var $3575 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3575;
                                    break;
                                case 'Fm.Term.let':
                                    var $3576 = self.name;
                                    var $3577 = self.expr;
                                    var $3578 = self.body;
                                    var $3579 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3579;
                                    break;
                                case 'Fm.Term.def':
                                    var $3580 = self.name;
                                    var $3581 = self.expr;
                                    var $3582 = self.body;
                                    var $3583 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3583;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3584 = self.done;
                                    var $3585 = self.term;
                                    var $3586 = self.type;
                                    var $3587 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3587;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3588 = self.name;
                                    var $3589 = self.dref;
                                    var $3590 = self.verb;
                                    var $3591 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3591;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3592 = self.path;
                                    var $3593 = Fm$Term$equal$patch$($3592, _a$1, Bool$true);
                                    var $3557 = $3593;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3594 = self.natx;
                                    var $3595 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3595;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3596 = self.chrx;
                                    var $3597 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3597;
                                    break;
                                case 'Fm.Term.str':
                                    var $3598 = self.strx;
                                    var $3599 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3599;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3600 = self.path;
                                    var $3601 = self.expr;
                                    var $3602 = self.name;
                                    var $3603 = self.with;
                                    var $3604 = self.cses;
                                    var $3605 = self.moti;
                                    var $3606 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3606;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3607 = self.orig;
                                    var $3608 = self.expr;
                                    var $3609 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3557 = $3609;
                                    break;
                            };
                            var $3500 = $3557;
                            break;
                        case 'Fm.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3611 = self.name;
                                    var $3612 = self.indx;
                                    var $3613 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3613;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3614 = self.name;
                                    var $3615 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3615;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3616 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3616;
                                    break;
                                case 'Fm.Term.all':
                                    var $3617 = self.eras;
                                    var $3618 = self.self;
                                    var $3619 = self.name;
                                    var $3620 = self.xtyp;
                                    var $3621 = self.body;
                                    var $3622 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3622;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3623 = self.name;
                                    var $3624 = self.body;
                                    var $3625 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3625;
                                    break;
                                case 'Fm.Term.app':
                                    var $3626 = self.func;
                                    var $3627 = self.argm;
                                    var $3628 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3628;
                                    break;
                                case 'Fm.Term.let':
                                    var $3629 = self.name;
                                    var $3630 = self.expr;
                                    var $3631 = self.body;
                                    var $3632 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3632;
                                    break;
                                case 'Fm.Term.def':
                                    var $3633 = self.name;
                                    var $3634 = self.expr;
                                    var $3635 = self.body;
                                    var $3636 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3636;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3637 = self.done;
                                    var $3638 = self.term;
                                    var $3639 = self.type;
                                    var $3640 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3640;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3641 = self.name;
                                    var $3642 = self.dref;
                                    var $3643 = self.verb;
                                    var $3644 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3644;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3645 = self.path;
                                    var $3646 = Fm$Term$equal$patch$($3645, _a$1, Bool$true);
                                    var $3610 = $3646;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3647 = self.natx;
                                    var $3648 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3648;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3649 = self.chrx;
                                    var $3650 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3650;
                                    break;
                                case 'Fm.Term.str':
                                    var $3651 = self.strx;
                                    var $3652 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3652;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3653 = self.path;
                                    var $3654 = self.expr;
                                    var $3655 = self.name;
                                    var $3656 = self.with;
                                    var $3657 = self.cses;
                                    var $3658 = self.moti;
                                    var $3659 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3659;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3660 = self.orig;
                                    var $3661 = self.expr;
                                    var $3662 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3610 = $3662;
                                    break;
                            };
                            var $3500 = $3610;
                            break;
                        case 'Fm.Term.all':
                            var $3663 = self.eras;
                            var $3664 = self.self;
                            var $3665 = self.name;
                            var $3666 = self.xtyp;
                            var $3667 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3669 = self.name;
                                    var $3670 = self.indx;
                                    var $3671 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3671;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3672 = self.name;
                                    var $3673 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3673;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3674 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3674;
                                    break;
                                case 'Fm.Term.all':
                                    var $3675 = self.eras;
                                    var $3676 = self.self;
                                    var $3677 = self.name;
                                    var $3678 = self.xtyp;
                                    var $3679 = self.body;
                                    var _seen$23 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$24 = $3667(Fm$Term$var$($3664, _lv$4))(Fm$Term$var$($3665, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $3679(Fm$Term$var$($3676, _lv$4))(Fm$Term$var$($3677, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($3664 === $3676);
                                    var _eq_eras$27 = Bool$eql$($3663, $3675);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var $3681 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3666, $3678, _defs$3, _lv$4, _seen$23))((_eq_type$28 => {
                                            var $3682 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23))((_eq_body$29 => {
                                                var $3683 = Monad$pure$(Fm$Check$monad)((_eq_type$28 && _eq_body$29));
                                                return $3683;
                                            }));
                                            return $3682;
                                        }));
                                        var $3680 = $3681;
                                    } else {
                                        var $3684 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                        var $3680 = $3684;
                                    };
                                    var $3668 = $3680;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3685 = self.name;
                                    var $3686 = self.body;
                                    var $3687 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3687;
                                    break;
                                case 'Fm.Term.app':
                                    var $3688 = self.func;
                                    var $3689 = self.argm;
                                    var $3690 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3690;
                                    break;
                                case 'Fm.Term.let':
                                    var $3691 = self.name;
                                    var $3692 = self.expr;
                                    var $3693 = self.body;
                                    var $3694 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3694;
                                    break;
                                case 'Fm.Term.def':
                                    var $3695 = self.name;
                                    var $3696 = self.expr;
                                    var $3697 = self.body;
                                    var $3698 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3698;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3699 = self.done;
                                    var $3700 = self.term;
                                    var $3701 = self.type;
                                    var $3702 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3702;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3703 = self.name;
                                    var $3704 = self.dref;
                                    var $3705 = self.verb;
                                    var $3706 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3706;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3707 = self.path;
                                    var $3708 = Fm$Term$equal$patch$($3707, _a$1, Bool$true);
                                    var $3668 = $3708;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3709 = self.natx;
                                    var $3710 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3710;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3711 = self.chrx;
                                    var $3712 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3712;
                                    break;
                                case 'Fm.Term.str':
                                    var $3713 = self.strx;
                                    var $3714 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3714;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3715 = self.path;
                                    var $3716 = self.expr;
                                    var $3717 = self.name;
                                    var $3718 = self.with;
                                    var $3719 = self.cses;
                                    var $3720 = self.moti;
                                    var $3721 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3721;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3722 = self.orig;
                                    var $3723 = self.expr;
                                    var $3724 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3668 = $3724;
                                    break;
                            };
                            var $3500 = $3668;
                            break;
                        case 'Fm.Term.lam':
                            var $3725 = self.name;
                            var $3726 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3728 = self.name;
                                    var $3729 = self.indx;
                                    var $3730 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3730;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3731 = self.name;
                                    var $3732 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3732;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3733 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3733;
                                    break;
                                case 'Fm.Term.all':
                                    var $3734 = self.eras;
                                    var $3735 = self.self;
                                    var $3736 = self.name;
                                    var $3737 = self.xtyp;
                                    var $3738 = self.body;
                                    var $3739 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3739;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3740 = self.name;
                                    var $3741 = self.body;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$18 = $3726(Fm$Term$var$($3725, _lv$4));
                                    var _b1_body$19 = $3741(Fm$Term$var$($3740, _lv$4));
                                    var $3742 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17))((_eq_body$20 => {
                                        var $3743 = Monad$pure$(Fm$Check$monad)(_eq_body$20);
                                        return $3743;
                                    }));
                                    var $3727 = $3742;
                                    break;
                                case 'Fm.Term.app':
                                    var $3744 = self.func;
                                    var $3745 = self.argm;
                                    var $3746 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3746;
                                    break;
                                case 'Fm.Term.let':
                                    var $3747 = self.name;
                                    var $3748 = self.expr;
                                    var $3749 = self.body;
                                    var $3750 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3750;
                                    break;
                                case 'Fm.Term.def':
                                    var $3751 = self.name;
                                    var $3752 = self.expr;
                                    var $3753 = self.body;
                                    var $3754 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3754;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3755 = self.done;
                                    var $3756 = self.term;
                                    var $3757 = self.type;
                                    var $3758 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3758;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3759 = self.name;
                                    var $3760 = self.dref;
                                    var $3761 = self.verb;
                                    var $3762 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3762;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3763 = self.path;
                                    var $3764 = Fm$Term$equal$patch$($3763, _a$1, Bool$true);
                                    var $3727 = $3764;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3765 = self.natx;
                                    var $3766 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3766;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3767 = self.chrx;
                                    var $3768 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3768;
                                    break;
                                case 'Fm.Term.str':
                                    var $3769 = self.strx;
                                    var $3770 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3770;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3771 = self.path;
                                    var $3772 = self.expr;
                                    var $3773 = self.name;
                                    var $3774 = self.with;
                                    var $3775 = self.cses;
                                    var $3776 = self.moti;
                                    var $3777 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3777;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3778 = self.orig;
                                    var $3779 = self.expr;
                                    var $3780 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3727 = $3780;
                                    break;
                            };
                            var $3500 = $3727;
                            break;
                        case 'Fm.Term.app':
                            var $3781 = self.func;
                            var $3782 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3784 = self.name;
                                    var $3785 = self.indx;
                                    var $3786 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3786;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3787 = self.name;
                                    var $3788 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3788;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3789 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3789;
                                    break;
                                case 'Fm.Term.all':
                                    var $3790 = self.eras;
                                    var $3791 = self.self;
                                    var $3792 = self.name;
                                    var $3793 = self.xtyp;
                                    var $3794 = self.body;
                                    var $3795 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3795;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3796 = self.name;
                                    var $3797 = self.body;
                                    var $3798 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3798;
                                    break;
                                case 'Fm.Term.app':
                                    var $3799 = self.func;
                                    var $3800 = self.argm;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var $3801 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3781, $3799, _defs$3, _lv$4, _seen$17))((_eq_func$18 => {
                                        var $3802 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3782, $3800, _defs$3, _lv$4, _seen$17))((_eq_argm$19 => {
                                            var $3803 = Monad$pure$(Fm$Check$monad)((_eq_func$18 && _eq_argm$19));
                                            return $3803;
                                        }));
                                        return $3802;
                                    }));
                                    var $3783 = $3801;
                                    break;
                                case 'Fm.Term.let':
                                    var $3804 = self.name;
                                    var $3805 = self.expr;
                                    var $3806 = self.body;
                                    var $3807 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3807;
                                    break;
                                case 'Fm.Term.def':
                                    var $3808 = self.name;
                                    var $3809 = self.expr;
                                    var $3810 = self.body;
                                    var $3811 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3811;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3812 = self.done;
                                    var $3813 = self.term;
                                    var $3814 = self.type;
                                    var $3815 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3815;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3816 = self.name;
                                    var $3817 = self.dref;
                                    var $3818 = self.verb;
                                    var $3819 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3819;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3820 = self.path;
                                    var $3821 = Fm$Term$equal$patch$($3820, _a$1, Bool$true);
                                    var $3783 = $3821;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3822 = self.natx;
                                    var $3823 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3823;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3824 = self.chrx;
                                    var $3825 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3825;
                                    break;
                                case 'Fm.Term.str':
                                    var $3826 = self.strx;
                                    var $3827 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3827;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3828 = self.path;
                                    var $3829 = self.expr;
                                    var $3830 = self.name;
                                    var $3831 = self.with;
                                    var $3832 = self.cses;
                                    var $3833 = self.moti;
                                    var $3834 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3834;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3835 = self.orig;
                                    var $3836 = self.expr;
                                    var $3837 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3783 = $3837;
                                    break;
                            };
                            var $3500 = $3783;
                            break;
                        case 'Fm.Term.let':
                            var $3838 = self.name;
                            var $3839 = self.expr;
                            var $3840 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3842 = self.name;
                                    var $3843 = self.indx;
                                    var $3844 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3844;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3845 = self.name;
                                    var $3846 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3846;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3847 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3847;
                                    break;
                                case 'Fm.Term.all':
                                    var $3848 = self.eras;
                                    var $3849 = self.self;
                                    var $3850 = self.name;
                                    var $3851 = self.xtyp;
                                    var $3852 = self.body;
                                    var $3853 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3853;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3854 = self.name;
                                    var $3855 = self.body;
                                    var $3856 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3856;
                                    break;
                                case 'Fm.Term.app':
                                    var $3857 = self.func;
                                    var $3858 = self.argm;
                                    var $3859 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3859;
                                    break;
                                case 'Fm.Term.let':
                                    var $3860 = self.name;
                                    var $3861 = self.expr;
                                    var $3862 = self.body;
                                    var _seen$19 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$20 = $3840(Fm$Term$var$($3838, _lv$4));
                                    var _b1_body$21 = $3862(Fm$Term$var$($3860, _lv$4));
                                    var $3863 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3839, $3861, _defs$3, _lv$4, _seen$19))((_eq_expr$22 => {
                                        var $3864 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19))((_eq_body$23 => {
                                            var $3865 = Monad$pure$(Fm$Check$monad)((_eq_expr$22 && _eq_body$23));
                                            return $3865;
                                        }));
                                        return $3864;
                                    }));
                                    var $3841 = $3863;
                                    break;
                                case 'Fm.Term.def':
                                    var $3866 = self.name;
                                    var $3867 = self.expr;
                                    var $3868 = self.body;
                                    var $3869 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3869;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3870 = self.done;
                                    var $3871 = self.term;
                                    var $3872 = self.type;
                                    var $3873 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3873;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3874 = self.name;
                                    var $3875 = self.dref;
                                    var $3876 = self.verb;
                                    var $3877 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3877;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3878 = self.path;
                                    var $3879 = Fm$Term$equal$patch$($3878, _a$1, Bool$true);
                                    var $3841 = $3879;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3880 = self.natx;
                                    var $3881 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3881;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3882 = self.chrx;
                                    var $3883 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3883;
                                    break;
                                case 'Fm.Term.str':
                                    var $3884 = self.strx;
                                    var $3885 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3885;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3886 = self.path;
                                    var $3887 = self.expr;
                                    var $3888 = self.name;
                                    var $3889 = self.with;
                                    var $3890 = self.cses;
                                    var $3891 = self.moti;
                                    var $3892 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3892;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3893 = self.orig;
                                    var $3894 = self.expr;
                                    var $3895 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3841 = $3895;
                                    break;
                            };
                            var $3500 = $3841;
                            break;
                        case 'Fm.Term.def':
                            var $3896 = self.name;
                            var $3897 = self.expr;
                            var $3898 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3900 = self.name;
                                    var $3901 = self.indx;
                                    var $3902 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3902;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3903 = self.name;
                                    var $3904 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3904;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3905 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3905;
                                    break;
                                case 'Fm.Term.all':
                                    var $3906 = self.eras;
                                    var $3907 = self.self;
                                    var $3908 = self.name;
                                    var $3909 = self.xtyp;
                                    var $3910 = self.body;
                                    var $3911 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3911;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3912 = self.name;
                                    var $3913 = self.body;
                                    var $3914 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3914;
                                    break;
                                case 'Fm.Term.app':
                                    var $3915 = self.func;
                                    var $3916 = self.argm;
                                    var $3917 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3917;
                                    break;
                                case 'Fm.Term.let':
                                    var $3918 = self.name;
                                    var $3919 = self.expr;
                                    var $3920 = self.body;
                                    var $3921 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3921;
                                    break;
                                case 'Fm.Term.def':
                                    var $3922 = self.name;
                                    var $3923 = self.expr;
                                    var $3924 = self.body;
                                    var $3925 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3925;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3926 = self.done;
                                    var $3927 = self.term;
                                    var $3928 = self.type;
                                    var $3929 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3929;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3930 = self.name;
                                    var $3931 = self.dref;
                                    var $3932 = self.verb;
                                    var $3933 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3933;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3934 = self.path;
                                    var $3935 = Fm$Term$equal$patch$($3934, _a$1, Bool$true);
                                    var $3899 = $3935;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3936 = self.natx;
                                    var $3937 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3937;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3938 = self.chrx;
                                    var $3939 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3939;
                                    break;
                                case 'Fm.Term.str':
                                    var $3940 = self.strx;
                                    var $3941 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3941;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3942 = self.path;
                                    var $3943 = self.expr;
                                    var $3944 = self.name;
                                    var $3945 = self.with;
                                    var $3946 = self.cses;
                                    var $3947 = self.moti;
                                    var $3948 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3948;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3949 = self.orig;
                                    var $3950 = self.expr;
                                    var $3951 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3899 = $3951;
                                    break;
                            };
                            var $3500 = $3899;
                            break;
                        case 'Fm.Term.ann':
                            var $3952 = self.done;
                            var $3953 = self.term;
                            var $3954 = self.type;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3956 = self.name;
                                    var $3957 = self.indx;
                                    var $3958 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3958;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3959 = self.name;
                                    var $3960 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3960;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3961 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3961;
                                    break;
                                case 'Fm.Term.all':
                                    var $3962 = self.eras;
                                    var $3963 = self.self;
                                    var $3964 = self.name;
                                    var $3965 = self.xtyp;
                                    var $3966 = self.body;
                                    var $3967 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3967;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3968 = self.name;
                                    var $3969 = self.body;
                                    var $3970 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3970;
                                    break;
                                case 'Fm.Term.app':
                                    var $3971 = self.func;
                                    var $3972 = self.argm;
                                    var $3973 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3973;
                                    break;
                                case 'Fm.Term.let':
                                    var $3974 = self.name;
                                    var $3975 = self.expr;
                                    var $3976 = self.body;
                                    var $3977 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3977;
                                    break;
                                case 'Fm.Term.def':
                                    var $3978 = self.name;
                                    var $3979 = self.expr;
                                    var $3980 = self.body;
                                    var $3981 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3981;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3982 = self.done;
                                    var $3983 = self.term;
                                    var $3984 = self.type;
                                    var $3985 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3985;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3986 = self.name;
                                    var $3987 = self.dref;
                                    var $3988 = self.verb;
                                    var $3989 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3989;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3990 = self.path;
                                    var $3991 = Fm$Term$equal$patch$($3990, _a$1, Bool$true);
                                    var $3955 = $3991;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3992 = self.natx;
                                    var $3993 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3993;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3994 = self.chrx;
                                    var $3995 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3995;
                                    break;
                                case 'Fm.Term.str':
                                    var $3996 = self.strx;
                                    var $3997 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $3997;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3998 = self.path;
                                    var $3999 = self.expr;
                                    var $4000 = self.name;
                                    var $4001 = self.with;
                                    var $4002 = self.cses;
                                    var $4003 = self.moti;
                                    var $4004 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $4004;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4005 = self.orig;
                                    var $4006 = self.expr;
                                    var $4007 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3955 = $4007;
                                    break;
                            };
                            var $3500 = $3955;
                            break;
                        case 'Fm.Term.gol':
                            var $4008 = self.name;
                            var $4009 = self.dref;
                            var $4010 = self.verb;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4012 = self.name;
                                    var $4013 = self.indx;
                                    var $4014 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4014;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4015 = self.name;
                                    var $4016 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4016;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4017 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4017;
                                    break;
                                case 'Fm.Term.all':
                                    var $4018 = self.eras;
                                    var $4019 = self.self;
                                    var $4020 = self.name;
                                    var $4021 = self.xtyp;
                                    var $4022 = self.body;
                                    var $4023 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4023;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4024 = self.name;
                                    var $4025 = self.body;
                                    var $4026 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4026;
                                    break;
                                case 'Fm.Term.app':
                                    var $4027 = self.func;
                                    var $4028 = self.argm;
                                    var $4029 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4029;
                                    break;
                                case 'Fm.Term.let':
                                    var $4030 = self.name;
                                    var $4031 = self.expr;
                                    var $4032 = self.body;
                                    var $4033 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4033;
                                    break;
                                case 'Fm.Term.def':
                                    var $4034 = self.name;
                                    var $4035 = self.expr;
                                    var $4036 = self.body;
                                    var $4037 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4037;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4038 = self.done;
                                    var $4039 = self.term;
                                    var $4040 = self.type;
                                    var $4041 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4041;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4042 = self.name;
                                    var $4043 = self.dref;
                                    var $4044 = self.verb;
                                    var $4045 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4045;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4046 = self.path;
                                    var $4047 = Fm$Term$equal$patch$($4046, _a$1, Bool$true);
                                    var $4011 = $4047;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4048 = self.natx;
                                    var $4049 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4049;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4050 = self.chrx;
                                    var $4051 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4051;
                                    break;
                                case 'Fm.Term.str':
                                    var $4052 = self.strx;
                                    var $4053 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4053;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4054 = self.path;
                                    var $4055 = self.expr;
                                    var $4056 = self.name;
                                    var $4057 = self.with;
                                    var $4058 = self.cses;
                                    var $4059 = self.moti;
                                    var $4060 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4060;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4061 = self.orig;
                                    var $4062 = self.expr;
                                    var $4063 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4011 = $4063;
                                    break;
                            };
                            var $3500 = $4011;
                            break;
                        case 'Fm.Term.hol':
                            var $4064 = self.path;
                            var $4065 = Fm$Term$equal$patch$($4064, _b$2, Bool$true);
                            var $3500 = $4065;
                            break;
                        case 'Fm.Term.nat':
                            var $4066 = self.natx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4068 = self.name;
                                    var $4069 = self.indx;
                                    var $4070 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4070;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4071 = self.name;
                                    var $4072 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4072;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4073 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4073;
                                    break;
                                case 'Fm.Term.all':
                                    var $4074 = self.eras;
                                    var $4075 = self.self;
                                    var $4076 = self.name;
                                    var $4077 = self.xtyp;
                                    var $4078 = self.body;
                                    var $4079 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4079;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4080 = self.name;
                                    var $4081 = self.body;
                                    var $4082 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4082;
                                    break;
                                case 'Fm.Term.app':
                                    var $4083 = self.func;
                                    var $4084 = self.argm;
                                    var $4085 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4085;
                                    break;
                                case 'Fm.Term.let':
                                    var $4086 = self.name;
                                    var $4087 = self.expr;
                                    var $4088 = self.body;
                                    var $4089 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4089;
                                    break;
                                case 'Fm.Term.def':
                                    var $4090 = self.name;
                                    var $4091 = self.expr;
                                    var $4092 = self.body;
                                    var $4093 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4093;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4094 = self.done;
                                    var $4095 = self.term;
                                    var $4096 = self.type;
                                    var $4097 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4097;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4098 = self.name;
                                    var $4099 = self.dref;
                                    var $4100 = self.verb;
                                    var $4101 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4101;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4102 = self.path;
                                    var $4103 = Fm$Term$equal$patch$($4102, _a$1, Bool$true);
                                    var $4067 = $4103;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4104 = self.natx;
                                    var $4105 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4105;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4106 = self.chrx;
                                    var $4107 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4107;
                                    break;
                                case 'Fm.Term.str':
                                    var $4108 = self.strx;
                                    var $4109 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4109;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4110 = self.path;
                                    var $4111 = self.expr;
                                    var $4112 = self.name;
                                    var $4113 = self.with;
                                    var $4114 = self.cses;
                                    var $4115 = self.moti;
                                    var $4116 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4116;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4117 = self.orig;
                                    var $4118 = self.expr;
                                    var $4119 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4067 = $4119;
                                    break;
                            };
                            var $3500 = $4067;
                            break;
                        case 'Fm.Term.chr':
                            var $4120 = self.chrx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4122 = self.name;
                                    var $4123 = self.indx;
                                    var $4124 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4124;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4125 = self.name;
                                    var $4126 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4126;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4127 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4127;
                                    break;
                                case 'Fm.Term.all':
                                    var $4128 = self.eras;
                                    var $4129 = self.self;
                                    var $4130 = self.name;
                                    var $4131 = self.xtyp;
                                    var $4132 = self.body;
                                    var $4133 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4133;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4134 = self.name;
                                    var $4135 = self.body;
                                    var $4136 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4136;
                                    break;
                                case 'Fm.Term.app':
                                    var $4137 = self.func;
                                    var $4138 = self.argm;
                                    var $4139 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4139;
                                    break;
                                case 'Fm.Term.let':
                                    var $4140 = self.name;
                                    var $4141 = self.expr;
                                    var $4142 = self.body;
                                    var $4143 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4143;
                                    break;
                                case 'Fm.Term.def':
                                    var $4144 = self.name;
                                    var $4145 = self.expr;
                                    var $4146 = self.body;
                                    var $4147 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4147;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4148 = self.done;
                                    var $4149 = self.term;
                                    var $4150 = self.type;
                                    var $4151 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4151;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4152 = self.name;
                                    var $4153 = self.dref;
                                    var $4154 = self.verb;
                                    var $4155 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4155;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4156 = self.path;
                                    var $4157 = Fm$Term$equal$patch$($4156, _a$1, Bool$true);
                                    var $4121 = $4157;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4158 = self.natx;
                                    var $4159 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4159;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4160 = self.chrx;
                                    var $4161 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4161;
                                    break;
                                case 'Fm.Term.str':
                                    var $4162 = self.strx;
                                    var $4163 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4163;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4164 = self.path;
                                    var $4165 = self.expr;
                                    var $4166 = self.name;
                                    var $4167 = self.with;
                                    var $4168 = self.cses;
                                    var $4169 = self.moti;
                                    var $4170 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4170;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4171 = self.orig;
                                    var $4172 = self.expr;
                                    var $4173 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4121 = $4173;
                                    break;
                            };
                            var $3500 = $4121;
                            break;
                        case 'Fm.Term.str':
                            var $4174 = self.strx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4176 = self.name;
                                    var $4177 = self.indx;
                                    var $4178 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4178;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4179 = self.name;
                                    var $4180 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4180;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4181 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4181;
                                    break;
                                case 'Fm.Term.all':
                                    var $4182 = self.eras;
                                    var $4183 = self.self;
                                    var $4184 = self.name;
                                    var $4185 = self.xtyp;
                                    var $4186 = self.body;
                                    var $4187 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4187;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4188 = self.name;
                                    var $4189 = self.body;
                                    var $4190 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4190;
                                    break;
                                case 'Fm.Term.app':
                                    var $4191 = self.func;
                                    var $4192 = self.argm;
                                    var $4193 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4193;
                                    break;
                                case 'Fm.Term.let':
                                    var $4194 = self.name;
                                    var $4195 = self.expr;
                                    var $4196 = self.body;
                                    var $4197 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4197;
                                    break;
                                case 'Fm.Term.def':
                                    var $4198 = self.name;
                                    var $4199 = self.expr;
                                    var $4200 = self.body;
                                    var $4201 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4201;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4202 = self.done;
                                    var $4203 = self.term;
                                    var $4204 = self.type;
                                    var $4205 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4205;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4206 = self.name;
                                    var $4207 = self.dref;
                                    var $4208 = self.verb;
                                    var $4209 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4209;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4210 = self.path;
                                    var $4211 = Fm$Term$equal$patch$($4210, _a$1, Bool$true);
                                    var $4175 = $4211;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4212 = self.natx;
                                    var $4213 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4213;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4214 = self.chrx;
                                    var $4215 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4215;
                                    break;
                                case 'Fm.Term.str':
                                    var $4216 = self.strx;
                                    var $4217 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4217;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4218 = self.path;
                                    var $4219 = self.expr;
                                    var $4220 = self.name;
                                    var $4221 = self.with;
                                    var $4222 = self.cses;
                                    var $4223 = self.moti;
                                    var $4224 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4224;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4225 = self.orig;
                                    var $4226 = self.expr;
                                    var $4227 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4175 = $4227;
                                    break;
                            };
                            var $3500 = $4175;
                            break;
                        case 'Fm.Term.cse':
                            var $4228 = self.path;
                            var $4229 = self.expr;
                            var $4230 = self.name;
                            var $4231 = self.with;
                            var $4232 = self.cses;
                            var $4233 = self.moti;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4235 = self.name;
                                    var $4236 = self.indx;
                                    var $4237 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4237;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4238 = self.name;
                                    var $4239 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4239;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4240 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4240;
                                    break;
                                case 'Fm.Term.all':
                                    var $4241 = self.eras;
                                    var $4242 = self.self;
                                    var $4243 = self.name;
                                    var $4244 = self.xtyp;
                                    var $4245 = self.body;
                                    var $4246 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4246;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4247 = self.name;
                                    var $4248 = self.body;
                                    var $4249 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4249;
                                    break;
                                case 'Fm.Term.app':
                                    var $4250 = self.func;
                                    var $4251 = self.argm;
                                    var $4252 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4252;
                                    break;
                                case 'Fm.Term.let':
                                    var $4253 = self.name;
                                    var $4254 = self.expr;
                                    var $4255 = self.body;
                                    var $4256 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4256;
                                    break;
                                case 'Fm.Term.def':
                                    var $4257 = self.name;
                                    var $4258 = self.expr;
                                    var $4259 = self.body;
                                    var $4260 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4260;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4261 = self.done;
                                    var $4262 = self.term;
                                    var $4263 = self.type;
                                    var $4264 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4264;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4265 = self.name;
                                    var $4266 = self.dref;
                                    var $4267 = self.verb;
                                    var $4268 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4268;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4269 = self.path;
                                    var $4270 = Fm$Term$equal$patch$($4269, _a$1, Bool$true);
                                    var $4234 = $4270;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4271 = self.natx;
                                    var $4272 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4272;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4273 = self.chrx;
                                    var $4274 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4274;
                                    break;
                                case 'Fm.Term.str':
                                    var $4275 = self.strx;
                                    var $4276 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4276;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4277 = self.path;
                                    var $4278 = self.expr;
                                    var $4279 = self.name;
                                    var $4280 = self.with;
                                    var $4281 = self.cses;
                                    var $4282 = self.moti;
                                    var $4283 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4283;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4284 = self.orig;
                                    var $4285 = self.expr;
                                    var $4286 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4234 = $4286;
                                    break;
                            };
                            var $3500 = $4234;
                            break;
                        case 'Fm.Term.ori':
                            var $4287 = self.orig;
                            var $4288 = self.expr;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4290 = self.name;
                                    var $4291 = self.indx;
                                    var $4292 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4292;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4293 = self.name;
                                    var $4294 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4294;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4295 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4295;
                                    break;
                                case 'Fm.Term.all':
                                    var $4296 = self.eras;
                                    var $4297 = self.self;
                                    var $4298 = self.name;
                                    var $4299 = self.xtyp;
                                    var $4300 = self.body;
                                    var $4301 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4301;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4302 = self.name;
                                    var $4303 = self.body;
                                    var $4304 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4304;
                                    break;
                                case 'Fm.Term.app':
                                    var $4305 = self.func;
                                    var $4306 = self.argm;
                                    var $4307 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4307;
                                    break;
                                case 'Fm.Term.let':
                                    var $4308 = self.name;
                                    var $4309 = self.expr;
                                    var $4310 = self.body;
                                    var $4311 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4311;
                                    break;
                                case 'Fm.Term.def':
                                    var $4312 = self.name;
                                    var $4313 = self.expr;
                                    var $4314 = self.body;
                                    var $4315 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4315;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4316 = self.done;
                                    var $4317 = self.term;
                                    var $4318 = self.type;
                                    var $4319 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4319;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4320 = self.name;
                                    var $4321 = self.dref;
                                    var $4322 = self.verb;
                                    var $4323 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4323;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4324 = self.path;
                                    var $4325 = Fm$Term$equal$patch$($4324, _a$1, Bool$true);
                                    var $4289 = $4325;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4326 = self.natx;
                                    var $4327 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4327;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4328 = self.chrx;
                                    var $4329 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4329;
                                    break;
                                case 'Fm.Term.str':
                                    var $4330 = self.strx;
                                    var $4331 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4331;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4332 = self.path;
                                    var $4333 = self.expr;
                                    var $4334 = self.name;
                                    var $4335 = self.with;
                                    var $4336 = self.cses;
                                    var $4337 = self.moti;
                                    var $4338 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4338;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4339 = self.orig;
                                    var $4340 = self.expr;
                                    var $4341 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4289 = $4341;
                                    break;
                            };
                            var $3500 = $4289;
                            break;
                    };
                    var $3497 = $3500;
                };
                var $3495 = $3497;
            };
            var $3493 = $3495;
        };
        return $3493;
    };
    const Fm$Term$equal = x0 => x1 => x2 => x3 => x4 => Fm$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;

    function Fm$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var $4342 = Monad$bind$(Fm$Check$monad)((() => {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $4343 = self.name;
                    var $4344 = self.indx;
                    var self = List$at_last$($4344, _ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4346 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4343), List$nil));
                            var $4345 = $4346;
                            break;
                        case 'Maybe.some':
                            var $4347 = self.value;
                            var $4348 = Monad$pure$(Fm$Check$monad)((() => {
                                var self = $4347;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4349 = self.fst;
                                        var $4350 = self.snd;
                                        var $4351 = $4350;
                                        return $4351;
                                };
                            })());
                            var $4345 = $4348;
                            break;
                    };
                    return $4345;
                case 'Fm.Term.ref':
                    var $4352 = self.name;
                    var self = Fm$get$($4352, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4354 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4352), List$nil));
                            var $4353 = $4354;
                            break;
                        case 'Maybe.some':
                            var $4355 = self.value;
                            var self = $4355;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $4357 = self.file;
                                    var $4358 = self.code;
                                    var $4359 = self.name;
                                    var $4360 = self.term;
                                    var $4361 = self.type;
                                    var $4362 = self.stat;
                                    var _ref_name$15 = $4359;
                                    var _ref_type$16 = $4361;
                                    var _ref_term$17 = $4360;
                                    var _ref_stat$18 = $4362;
                                    var self = _ref_stat$18;
                                    switch (self._) {
                                        case 'Fm.Status.init':
                                            var $4364 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$waiting$(_ref_name$15), List$nil));
                                            var $4363 = $4364;
                                            break;
                                        case 'Fm.Status.wait':
                                            var $4365 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4363 = $4365;
                                            break;
                                        case 'Fm.Status.done':
                                            var $4366 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4363 = $4366;
                                            break;
                                        case 'Fm.Status.fail':
                                            var $4367 = self.errors;
                                            var $4368 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$indirect$(_ref_name$15), List$nil));
                                            var $4363 = $4368;
                                            break;
                                    };
                                    var $4356 = $4363;
                                    break;
                            };
                            var $4353 = $4356;
                            break;
                    };
                    return $4353;
                case 'Fm.Term.typ':
                    var $4369 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                    return $4369;
                case 'Fm.Term.all':
                    var $4370 = self.eras;
                    var $4371 = self.self;
                    var $4372 = self.name;
                    var $4373 = self.xtyp;
                    var $4374 = self.body;
                    var _ctx_size$12 = List$length$(_ctx$4);
                    var _self_var$13 = Fm$Term$var$($4371, _ctx_size$12);
                    var _body_var$14 = Fm$Term$var$($4372, Nat$succ$(_ctx_size$12));
                    var _body_ctx$15 = List$cons$(Pair$new$($4372, $4373), List$cons$(Pair$new$($4371, _term$1), _ctx$4));
                    var $4375 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4373, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$16 => {
                        var $4376 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4374(_self_var$13)(_body_var$14), Maybe$some$(Fm$Term$typ), _defs$3, _body_ctx$15, Fm$MPath$i$(_path$5), _orig$6))((_$17 => {
                            var $4377 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                            return $4377;
                        }));
                        return $4376;
                    }));
                    return $4375;
                case 'Fm.Term.lam':
                    var $4378 = self.name;
                    var $4379 = self.body;
                    var self = _type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4381 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                            var $4380 = $4381;
                            break;
                        case 'Maybe.some':
                            var $4382 = self.value;
                            var _typv$10 = Fm$Term$reduce$($4382, _defs$3);
                            var self = _typv$10;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4384 = self.name;
                                    var $4385 = self.indx;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4382);
                                    var $4386 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4383 = $4386;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4387 = self.name;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4382);
                                    var $4388 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4383 = $4388;
                                    break;
                                case 'Fm.Term.typ':
                                    var _expected$11 = Either$left$("Function");
                                    var _detected$12 = Either$right$($4382);
                                    var $4389 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                    var $4383 = $4389;
                                    break;
                                case 'Fm.Term.all':
                                    var $4390 = self.eras;
                                    var $4391 = self.self;
                                    var $4392 = self.name;
                                    var $4393 = self.xtyp;
                                    var $4394 = self.body;
                                    var _ctx_size$16 = List$length$(_ctx$4);
                                    var _self_var$17 = _term$1;
                                    var _body_var$18 = Fm$Term$var$($4378, _ctx_size$16);
                                    var _body_typ$19 = $4394(_self_var$17)(_body_var$18);
                                    var _body_ctx$20 = List$cons$(Pair$new$($4378, $4393), _ctx$4);
                                    var $4395 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4379(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Fm$MPath$o$(_path$5), _orig$6))((_$21 => {
                                        var $4396 = Monad$pure$(Fm$Check$monad)($4382);
                                        return $4396;
                                    }));
                                    var $4383 = $4395;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4397 = self.name;
                                    var $4398 = self.body;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4382);
                                    var $4399 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4383 = $4399;
                                    break;
                                case 'Fm.Term.app':
                                    var $4400 = self.func;
                                    var $4401 = self.argm;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4382);
                                    var $4402 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4383 = $4402;
                                    break;
                                case 'Fm.Term.let':
                                    var $4403 = self.name;
                                    var $4404 = self.expr;
                                    var $4405 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4382);
                                    var $4406 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4383 = $4406;
                                    break;
                                case 'Fm.Term.def':
                                    var $4407 = self.name;
                                    var $4408 = self.expr;
                                    var $4409 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4382);
                                    var $4410 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4383 = $4410;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4411 = self.done;
                                    var $4412 = self.term;
                                    var $4413 = self.type;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4382);
                                    var $4414 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4383 = $4414;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4415 = self.name;
                                    var $4416 = self.dref;
                                    var $4417 = self.verb;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4382);
                                    var $4418 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4383 = $4418;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4419 = self.path;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4382);
                                    var $4420 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4383 = $4420;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4421 = self.natx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4382);
                                    var $4422 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4383 = $4422;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4423 = self.chrx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4382);
                                    var $4424 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4383 = $4424;
                                    break;
                                case 'Fm.Term.str':
                                    var $4425 = self.strx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4382);
                                    var $4426 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4383 = $4426;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4427 = self.path;
                                    var $4428 = self.expr;
                                    var $4429 = self.name;
                                    var $4430 = self.with;
                                    var $4431 = self.cses;
                                    var $4432 = self.moti;
                                    var _expected$17 = Either$left$("Function");
                                    var _detected$18 = Either$right$($4382);
                                    var $4433 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                    var $4383 = $4433;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4434 = self.orig;
                                    var $4435 = self.expr;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4382);
                                    var $4436 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4383 = $4436;
                                    break;
                            };
                            var $4380 = $4383;
                            break;
                    };
                    return $4380;
                case 'Fm.Term.app':
                    var $4437 = self.func;
                    var $4438 = self.argm;
                    var $4439 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4437, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_func_typ$9 => {
                        var _func_typ$10 = Fm$Term$reduce$(_func_typ$9, _defs$3);
                        var self = _func_typ$10;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $4441 = self.name;
                                var $4442 = self.indx;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4443 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4440 = $4443;
                                break;
                            case 'Fm.Term.ref':
                                var $4444 = self.name;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4445 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4440 = $4445;
                                break;
                            case 'Fm.Term.typ':
                                var _expected$11 = Either$left$("Function");
                                var _detected$12 = Either$right$(_func_typ$10);
                                var $4446 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4440 = $4446;
                                break;
                            case 'Fm.Term.all':
                                var $4447 = self.eras;
                                var $4448 = self.self;
                                var $4449 = self.name;
                                var $4450 = self.xtyp;
                                var $4451 = self.body;
                                var $4452 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4438, Maybe$some$($4450), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$16 => {
                                    var $4453 = Monad$pure$(Fm$Check$monad)($4451($4437)($4438));
                                    return $4453;
                                }));
                                var $4440 = $4452;
                                break;
                            case 'Fm.Term.lam':
                                var $4454 = self.name;
                                var $4455 = self.body;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4456 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4440 = $4456;
                                break;
                            case 'Fm.Term.app':
                                var $4457 = self.func;
                                var $4458 = self.argm;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4459 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4440 = $4459;
                                break;
                            case 'Fm.Term.let':
                                var $4460 = self.name;
                                var $4461 = self.expr;
                                var $4462 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4463 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4440 = $4463;
                                break;
                            case 'Fm.Term.def':
                                var $4464 = self.name;
                                var $4465 = self.expr;
                                var $4466 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4467 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4440 = $4467;
                                break;
                            case 'Fm.Term.ann':
                                var $4468 = self.done;
                                var $4469 = self.term;
                                var $4470 = self.type;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4471 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4440 = $4471;
                                break;
                            case 'Fm.Term.gol':
                                var $4472 = self.name;
                                var $4473 = self.dref;
                                var $4474 = self.verb;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4475 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4440 = $4475;
                                break;
                            case 'Fm.Term.hol':
                                var $4476 = self.path;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4477 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4440 = $4477;
                                break;
                            case 'Fm.Term.nat':
                                var $4478 = self.natx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4479 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4440 = $4479;
                                break;
                            case 'Fm.Term.chr':
                                var $4480 = self.chrx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4481 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4440 = $4481;
                                break;
                            case 'Fm.Term.str':
                                var $4482 = self.strx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4483 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4440 = $4483;
                                break;
                            case 'Fm.Term.cse':
                                var $4484 = self.path;
                                var $4485 = self.expr;
                                var $4486 = self.name;
                                var $4487 = self.with;
                                var $4488 = self.cses;
                                var $4489 = self.moti;
                                var _expected$17 = Either$left$("Function");
                                var _detected$18 = Either$right$(_func_typ$10);
                                var $4490 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4440 = $4490;
                                break;
                            case 'Fm.Term.ori':
                                var $4491 = self.orig;
                                var $4492 = self.expr;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4493 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4440 = $4493;
                                break;
                        };
                        return $4440;
                    }));
                    return $4439;
                case 'Fm.Term.let':
                    var $4494 = self.name;
                    var $4495 = self.expr;
                    var $4496 = self.body;
                    var _ctx_size$10 = List$length$(_ctx$4);
                    var $4497 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4495, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_expr_typ$11 => {
                        var _body_val$12 = $4496(Fm$Term$var$($4494, _ctx_size$10));
                        var _body_ctx$13 = List$cons$(Pair$new$($4494, _expr_typ$11), _ctx$4);
                        var $4498 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_body_val$12, _type$2, _defs$3, _body_ctx$13, Fm$MPath$i$(_path$5), _orig$6))((_body_typ$14 => {
                            var $4499 = Monad$pure$(Fm$Check$monad)(_body_typ$14);
                            return $4499;
                        }));
                        return $4498;
                    }));
                    return $4497;
                case 'Fm.Term.def':
                    var $4500 = self.name;
                    var $4501 = self.expr;
                    var $4502 = self.body;
                    var $4503 = Fm$Term$check$($4502($4501), _type$2, _defs$3, _ctx$4, _path$5, _orig$6);
                    return $4503;
                case 'Fm.Term.ann':
                    var $4504 = self.done;
                    var $4505 = self.term;
                    var $4506 = self.type;
                    var self = $4504;
                    if (self) {
                        var $4508 = Monad$pure$(Fm$Check$monad)($4506);
                        var $4507 = $4508;
                    } else {
                        var $4509 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4505, Maybe$some$($4506), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$10 => {
                            var $4510 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4506, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$11 => {
                                var $4511 = Monad$pure$(Fm$Check$monad)($4506);
                                return $4511;
                            }));
                            return $4510;
                        }));
                        var $4507 = $4509;
                    };
                    return $4507;
                case 'Fm.Term.gol':
                    var $4512 = self.name;
                    var $4513 = self.dref;
                    var $4514 = self.verb;
                    var $4515 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$show_goal$($4512, $4513, $4514, _type$2, _ctx$4), List$nil));
                    return $4515;
                case 'Fm.Term.hol':
                    var $4516 = self.path;
                    var $4517 = Fm$Check$result$(_type$2, List$nil);
                    return $4517;
                case 'Fm.Term.nat':
                    var $4518 = self.natx;
                    var $4519 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Nat"));
                    return $4519;
                case 'Fm.Term.chr':
                    var $4520 = self.chrx;
                    var $4521 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Char"));
                    return $4521;
                case 'Fm.Term.str':
                    var $4522 = self.strx;
                    var $4523 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("String"));
                    return $4523;
                case 'Fm.Term.cse':
                    var $4524 = self.path;
                    var $4525 = self.expr;
                    var $4526 = self.name;
                    var $4527 = self.with;
                    var $4528 = self.cses;
                    var $4529 = self.moti;
                    var _expr$13 = $4525;
                    var $4530 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_etyp$14 => {
                        var self = $4529;
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _type$2;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4533 = Fm$Term$hol$(Bits$e);
                                        var _moti$15 = $4533;
                                        break;
                                    case 'Maybe.some':
                                        var $4534 = self.value;
                                        var _size$16 = List$length$(_ctx$4);
                                        var _typv$17 = Fm$Term$normalize$($4534, Map$new);
                                        var _moti$18 = Fm$SmartMotive$make$($4526, $4525, _etyp$14, _typv$17, _size$16, _defs$3);
                                        var $4535 = _moti$18;
                                        var _moti$15 = $4535;
                                        break;
                                };
                                var $4532 = Maybe$some$(Fm$Term$cse$($4524, $4525, $4526, $4527, $4528, Maybe$some$(_moti$15)));
                                var _dsug$15 = $4532;
                                break;
                            case 'Maybe.some':
                                var $4536 = self.value;
                                var $4537 = Fm$Term$desugar_cse$($4525, $4526, $4527, $4528, $4536, _etyp$14, _defs$3, _ctx$4);
                                var _dsug$15 = $4537;
                                break;
                        };
                        var self = _dsug$15;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4538 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                var $4531 = $4538;
                                break;
                            case 'Maybe.some':
                                var $4539 = self.value;
                                var $4540 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$patch$(Fm$MPath$to_bits$(_path$5), $4539), List$nil));
                                var $4531 = $4540;
                                break;
                        };
                        return $4531;
                    }));
                    return $4530;
                case 'Fm.Term.ori':
                    var $4541 = self.orig;
                    var $4542 = self.expr;
                    var $4543 = Fm$Term$check$($4542, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($4541));
                    return $4543;
            };
        })())((_infr$7 => {
            var self = _type$2;
            switch (self._) {
                case 'Maybe.none':
                    var $4545 = Fm$Check$result$(Maybe$some$(_infr$7), List$nil);
                    var $4544 = $4545;
                    break;
                case 'Maybe.some':
                    var $4546 = self.value;
                    var $4547 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($4546, _infr$7, _defs$3, List$length$(_ctx$4), Set$new))((_eqls$9 => {
                        var self = _eqls$9;
                        if (self) {
                            var $4549 = Monad$pure$(Fm$Check$monad)($4546);
                            var $4548 = $4549;
                        } else {
                            var $4550 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, Either$right$($4546), Either$right$(_infr$7), _ctx$4), List$nil));
                            var $4548 = $4550;
                        };
                        return $4548;
                    }));
                    var $4544 = $4547;
                    break;
            };
            return $4544;
        }));
        return $4342;
    };
    const Fm$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Term$check$(x0, x1, x2, x3, x4, x5);

    function Fm$Path$nil$(_x$1) {
        var $4551 = _x$1;
        return $4551;
    };
    const Fm$Path$nil = x0 => Fm$Path$nil$(x0);
    const Fm$MPath$nil = Maybe$some$(Fm$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $4553 = Bool$true;
                var $4552 = $4553;
                break;
            case 'List.cons':
                var $4554 = self.head;
                var $4555 = self.tail;
                var $4556 = Bool$false;
                var $4552 = $4556;
                break;
        };
        return $4552;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Fm$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Fm.Term.var':
                var $4558 = self.name;
                var $4559 = self.indx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4561 = _fn$3(_term$2);
                        var $4560 = $4561;
                        break;
                    case 'o':
                        var $4562 = self.slice(0, -1);
                        var $4563 = _term$2;
                        var $4560 = $4563;
                        break;
                    case 'i':
                        var $4564 = self.slice(0, -1);
                        var $4565 = _term$2;
                        var $4560 = $4565;
                        break;
                };
                var $4557 = $4560;
                break;
            case 'Fm.Term.ref':
                var $4566 = self.name;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4568 = _fn$3(_term$2);
                        var $4567 = $4568;
                        break;
                    case 'o':
                        var $4569 = self.slice(0, -1);
                        var $4570 = _term$2;
                        var $4567 = $4570;
                        break;
                    case 'i':
                        var $4571 = self.slice(0, -1);
                        var $4572 = _term$2;
                        var $4567 = $4572;
                        break;
                };
                var $4557 = $4567;
                break;
            case 'Fm.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4574 = _fn$3(_term$2);
                        var $4573 = $4574;
                        break;
                    case 'o':
                        var $4575 = self.slice(0, -1);
                        var $4576 = _term$2;
                        var $4573 = $4576;
                        break;
                    case 'i':
                        var $4577 = self.slice(0, -1);
                        var $4578 = _term$2;
                        var $4573 = $4578;
                        break;
                };
                var $4557 = $4573;
                break;
            case 'Fm.Term.all':
                var $4579 = self.eras;
                var $4580 = self.self;
                var $4581 = self.name;
                var $4582 = self.xtyp;
                var $4583 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4585 = _fn$3(_term$2);
                        var $4584 = $4585;
                        break;
                    case 'o':
                        var $4586 = self.slice(0, -1);
                        var $4587 = Fm$Term$all$($4579, $4580, $4581, Fm$Term$patch_at$($4586, $4582, _fn$3), $4583);
                        var $4584 = $4587;
                        break;
                    case 'i':
                        var $4588 = self.slice(0, -1);
                        var $4589 = Fm$Term$all$($4579, $4580, $4581, $4582, (_s$10 => _x$11 => {
                            var $4590 = Fm$Term$patch_at$($4588, $4583(_s$10)(_x$11), _fn$3);
                            return $4590;
                        }));
                        var $4584 = $4589;
                        break;
                };
                var $4557 = $4584;
                break;
            case 'Fm.Term.lam':
                var $4591 = self.name;
                var $4592 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4594 = _fn$3(_term$2);
                        var $4593 = $4594;
                        break;
                    case 'o':
                        var $4595 = self.slice(0, -1);
                        var $4596 = Fm$Term$lam$($4591, (_x$7 => {
                            var $4597 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4592(_x$7), _fn$3);
                            return $4597;
                        }));
                        var $4593 = $4596;
                        break;
                    case 'i':
                        var $4598 = self.slice(0, -1);
                        var $4599 = Fm$Term$lam$($4591, (_x$7 => {
                            var $4600 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4592(_x$7), _fn$3);
                            return $4600;
                        }));
                        var $4593 = $4599;
                        break;
                };
                var $4557 = $4593;
                break;
            case 'Fm.Term.app':
                var $4601 = self.func;
                var $4602 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4604 = _fn$3(_term$2);
                        var $4603 = $4604;
                        break;
                    case 'o':
                        var $4605 = self.slice(0, -1);
                        var $4606 = Fm$Term$app$(Fm$Term$patch_at$($4605, $4601, _fn$3), $4602);
                        var $4603 = $4606;
                        break;
                    case 'i':
                        var $4607 = self.slice(0, -1);
                        var $4608 = Fm$Term$app$($4601, Fm$Term$patch_at$($4607, $4602, _fn$3));
                        var $4603 = $4608;
                        break;
                };
                var $4557 = $4603;
                break;
            case 'Fm.Term.let':
                var $4609 = self.name;
                var $4610 = self.expr;
                var $4611 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4613 = _fn$3(_term$2);
                        var $4612 = $4613;
                        break;
                    case 'o':
                        var $4614 = self.slice(0, -1);
                        var $4615 = Fm$Term$let$($4609, Fm$Term$patch_at$($4614, $4610, _fn$3), $4611);
                        var $4612 = $4615;
                        break;
                    case 'i':
                        var $4616 = self.slice(0, -1);
                        var $4617 = Fm$Term$let$($4609, $4610, (_x$8 => {
                            var $4618 = Fm$Term$patch_at$($4616, $4611(_x$8), _fn$3);
                            return $4618;
                        }));
                        var $4612 = $4617;
                        break;
                };
                var $4557 = $4612;
                break;
            case 'Fm.Term.def':
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
                        var $4625 = Fm$Term$def$($4619, Fm$Term$patch_at$($4624, $4620, _fn$3), $4621);
                        var $4622 = $4625;
                        break;
                    case 'i':
                        var $4626 = self.slice(0, -1);
                        var $4627 = Fm$Term$def$($4619, $4620, (_x$8 => {
                            var $4628 = Fm$Term$patch_at$($4626, $4621(_x$8), _fn$3);
                            return $4628;
                        }));
                        var $4622 = $4627;
                        break;
                };
                var $4557 = $4622;
                break;
            case 'Fm.Term.ann':
                var $4629 = self.done;
                var $4630 = self.term;
                var $4631 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4633 = _fn$3(_term$2);
                        var $4632 = $4633;
                        break;
                    case 'o':
                        var $4634 = self.slice(0, -1);
                        var $4635 = Fm$Term$ann$($4629, Fm$Term$patch_at$($4634, $4630, _fn$3), $4631);
                        var $4632 = $4635;
                        break;
                    case 'i':
                        var $4636 = self.slice(0, -1);
                        var $4637 = Fm$Term$ann$($4629, $4630, Fm$Term$patch_at$($4636, $4631, _fn$3));
                        var $4632 = $4637;
                        break;
                };
                var $4557 = $4632;
                break;
            case 'Fm.Term.gol':
                var $4638 = self.name;
                var $4639 = self.dref;
                var $4640 = self.verb;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4642 = _fn$3(_term$2);
                        var $4641 = $4642;
                        break;
                    case 'o':
                        var $4643 = self.slice(0, -1);
                        var $4644 = _term$2;
                        var $4641 = $4644;
                        break;
                    case 'i':
                        var $4645 = self.slice(0, -1);
                        var $4646 = _term$2;
                        var $4641 = $4646;
                        break;
                };
                var $4557 = $4641;
                break;
            case 'Fm.Term.hol':
                var $4647 = self.path;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4649 = _fn$3(_term$2);
                        var $4648 = $4649;
                        break;
                    case 'o':
                        var $4650 = self.slice(0, -1);
                        var $4651 = _term$2;
                        var $4648 = $4651;
                        break;
                    case 'i':
                        var $4652 = self.slice(0, -1);
                        var $4653 = _term$2;
                        var $4648 = $4653;
                        break;
                };
                var $4557 = $4648;
                break;
            case 'Fm.Term.nat':
                var $4654 = self.natx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4656 = _fn$3(_term$2);
                        var $4655 = $4656;
                        break;
                    case 'o':
                        var $4657 = self.slice(0, -1);
                        var $4658 = _term$2;
                        var $4655 = $4658;
                        break;
                    case 'i':
                        var $4659 = self.slice(0, -1);
                        var $4660 = _term$2;
                        var $4655 = $4660;
                        break;
                };
                var $4557 = $4655;
                break;
            case 'Fm.Term.chr':
                var $4661 = self.chrx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4663 = _fn$3(_term$2);
                        var $4662 = $4663;
                        break;
                    case 'o':
                        var $4664 = self.slice(0, -1);
                        var $4665 = _term$2;
                        var $4662 = $4665;
                        break;
                    case 'i':
                        var $4666 = self.slice(0, -1);
                        var $4667 = _term$2;
                        var $4662 = $4667;
                        break;
                };
                var $4557 = $4662;
                break;
            case 'Fm.Term.str':
                var $4668 = self.strx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4670 = _fn$3(_term$2);
                        var $4669 = $4670;
                        break;
                    case 'o':
                        var $4671 = self.slice(0, -1);
                        var $4672 = _term$2;
                        var $4669 = $4672;
                        break;
                    case 'i':
                        var $4673 = self.slice(0, -1);
                        var $4674 = _term$2;
                        var $4669 = $4674;
                        break;
                };
                var $4557 = $4669;
                break;
            case 'Fm.Term.cse':
                var $4675 = self.path;
                var $4676 = self.expr;
                var $4677 = self.name;
                var $4678 = self.with;
                var $4679 = self.cses;
                var $4680 = self.moti;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4682 = _fn$3(_term$2);
                        var $4681 = $4682;
                        break;
                    case 'o':
                        var $4683 = self.slice(0, -1);
                        var $4684 = _term$2;
                        var $4681 = $4684;
                        break;
                    case 'i':
                        var $4685 = self.slice(0, -1);
                        var $4686 = _term$2;
                        var $4681 = $4686;
                        break;
                };
                var $4557 = $4681;
                break;
            case 'Fm.Term.ori':
                var $4687 = self.orig;
                var $4688 = self.expr;
                var $4689 = Fm$Term$patch_at$(_path$1, $4688, _fn$3);
                var $4557 = $4689;
                break;
        };
        return $4557;
    };
    const Fm$Term$patch_at = x0 => x1 => x2 => Fm$Term$patch_at$(x0, x1, x2);

    function Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, _errs$7, _fixd$8) {
        var self = _errs$7;
        switch (self._) {
            case 'List.nil':
                var self = _fixd$8;
                if (self) {
                    var _type$9 = Fm$Term$bind$(List$nil, (_x$9 => {
                        var $4693 = (_x$9 + '1');
                        return $4693;
                    }), _type$5);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $4694 = (_x$10 + '0');
                        return $4694;
                    }), _term$4);
                    var _defs$11 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$10, _type$9, Fm$Status$init), _defs$6);
                    var $4692 = Monad$pure$(IO$monad)(Maybe$some$(_defs$11));
                    var $4691 = $4692;
                } else {
                    var $4695 = Monad$pure$(IO$monad)(Maybe$none);
                    var $4691 = $4695;
                };
                var $4690 = $4691;
                break;
            case 'List.cons':
                var $4696 = self.head;
                var $4697 = self.tail;
                var self = $4696;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $4699 = self.origin;
                        var $4700 = self.expected;
                        var $4701 = self.detected;
                        var $4702 = self.context;
                        var $4703 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4697, _fixd$8);
                        var $4698 = $4703;
                        break;
                    case 'Fm.Error.show_goal':
                        var $4704 = self.name;
                        var $4705 = self.dref;
                        var $4706 = self.verb;
                        var $4707 = self.goal;
                        var $4708 = self.context;
                        var $4709 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4697, _fixd$8);
                        var $4698 = $4709;
                        break;
                    case 'Fm.Error.waiting':
                        var $4710 = self.name;
                        var $4711 = Monad$bind$(IO$monad)(Fm$Synth$one$($4710, _defs$6))((_defs$12 => {
                            var $4712 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$12, $4697, Bool$true);
                            return $4712;
                        }));
                        var $4698 = $4711;
                        break;
                    case 'Fm.Error.indirect':
                        var $4713 = self.name;
                        var $4714 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4697, _fixd$8);
                        var $4698 = $4714;
                        break;
                    case 'Fm.Error.patch':
                        var $4715 = self.path;
                        var $4716 = self.term;
                        var self = $4715;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'e':
                                var $4718 = Monad$pure$(IO$monad)(Maybe$none);
                                var $4717 = $4718;
                                break;
                            case 'o':
                                var $4719 = self.slice(0, -1);
                                var _term$14 = Fm$Term$patch_at$($4719, _term$4, (_x$14 => {
                                    var $4721 = $4716;
                                    return $4721;
                                }));
                                var $4720 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$14, _type$5, _defs$6, $4697, Bool$true);
                                var $4717 = $4720;
                                break;
                            case 'i':
                                var $4722 = self.slice(0, -1);
                                var _type$14 = Fm$Term$patch_at$($4722, _type$5, (_x$14 => {
                                    var $4724 = $4716;
                                    return $4724;
                                }));
                                var $4723 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$14, _defs$6, $4697, Bool$true);
                                var $4717 = $4723;
                                break;
                        };
                        var $4698 = $4717;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $4725 = self.origin;
                        var $4726 = self.name;
                        var $4727 = Monad$bind$(IO$monad)(Fm$Synth$one$($4726, _defs$6))((_defs$13 => {
                            var $4728 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$13, $4697, Bool$true);
                            return $4728;
                        }));
                        var $4698 = $4727;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $4729 = self.origin;
                        var $4730 = self.term;
                        var $4731 = self.context;
                        var $4732 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4697, _fixd$8);
                        var $4698 = $4732;
                        break;
                };
                var $4690 = $4698;
                break;
        };
        return $4690;
    };
    const Fm$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Status$fail$(_errors$1) {
        var $4733 = ({
            _: 'Fm.Status.fail',
            'errors': _errors$1
        });
        return $4733;
    };
    const Fm$Status$fail = x0 => Fm$Status$fail$(x0);

    function Fm$Synth$one$(_name$1, _defs$2) {
        var self = Fm$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.none':
                var $4735 = Monad$bind$(IO$monad)(Fm$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4737 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("Undefined: ", List$cons$(_name$1, List$nil)))))((_$4 => {
                                var $4738 = Monad$pure$(IO$monad)(_defs$2);
                                return $4738;
                            }));
                            var $4736 = $4737;
                            break;
                        case 'Maybe.some':
                            var $4739 = self.value;
                            var $4740 = Fm$Synth$one$(_name$1, $4739);
                            var $4736 = $4740;
                            break;
                    };
                    return $4736;
                }));
                var $4734 = $4735;
                break;
            case 'Maybe.some':
                var $4741 = self.value;
                var self = $4741;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4743 = self.file;
                        var $4744 = self.code;
                        var $4745 = self.name;
                        var $4746 = self.term;
                        var $4747 = self.type;
                        var $4748 = self.stat;
                        var _file$10 = $4743;
                        var _code$11 = $4744;
                        var _name$12 = $4745;
                        var _term$13 = $4746;
                        var _type$14 = $4747;
                        var _stat$15 = $4748;
                        var self = _stat$15;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var _defs$16 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, Fm$Status$wait), _defs$2);
                                var _checked$17 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_type$14, Maybe$some$(Fm$Term$typ), _defs$16, List$nil, Fm$MPath$i$(Fm$MPath$nil), Maybe$none))((_chk_type$17 => {
                                    var $4751 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_term$13, Maybe$some$(_type$14), _defs$16, List$nil, Fm$MPath$o$(Fm$MPath$nil), Maybe$none))((_chk_term$18 => {
                                        var $4752 = Monad$pure$(Fm$Check$monad)(Unit$new);
                                        return $4752;
                                    }));
                                    return $4751;
                                }));
                                var self = _checked$17;
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $4753 = self.value;
                                        var $4754 = self.errors;
                                        var self = List$is_empty$($4754);
                                        if (self) {
                                            var _defs$20 = Fm$define$(_file$10, _code$11, _name$12, _term$13, _type$14, Bool$true, _defs$16);
                                            var $4756 = Monad$pure$(IO$monad)(_defs$20);
                                            var $4755 = $4756;
                                        } else {
                                            var $4757 = Monad$bind$(IO$monad)(Fm$Synth$fix$(_file$10, _code$11, _name$12, _term$13, _type$14, _defs$16, $4754, Bool$false))((_fixed$20 => {
                                                var self = _fixed$20;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var _stat$21 = Fm$Status$fail$($4754);
                                                        var _defs$22 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, _stat$21), _defs$16);
                                                        var $4759 = Monad$pure$(IO$monad)(_defs$22);
                                                        var $4758 = $4759;
                                                        break;
                                                    case 'Maybe.some':
                                                        var $4760 = self.value;
                                                        var $4761 = Fm$Synth$one$(_name$12, $4760);
                                                        var $4758 = $4761;
                                                        break;
                                                };
                                                return $4758;
                                            }));
                                            var $4755 = $4757;
                                        };
                                        var $4750 = $4755;
                                        break;
                                };
                                var $4749 = $4750;
                                break;
                            case 'Fm.Status.wait':
                                var $4762 = Monad$pure$(IO$monad)(_defs$2);
                                var $4749 = $4762;
                                break;
                            case 'Fm.Status.done':
                                var $4763 = Monad$pure$(IO$monad)(_defs$2);
                                var $4749 = $4763;
                                break;
                            case 'Fm.Status.fail':
                                var $4764 = self.errors;
                                var $4765 = Monad$pure$(IO$monad)(_defs$2);
                                var $4749 = $4765;
                                break;
                        };
                        var $4742 = $4749;
                        break;
                };
                var $4734 = $4742;
                break;
        };
        return $4734;
    };
    const Fm$Synth$one = x0 => x1 => Fm$Synth$one$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $4767 = _list$3;
                var $4766 = $4767;
                break;
            case 'Map.tie':
                var $4768 = self.val;
                var $4769 = self.lft;
                var $4770 = self.rgt;
                var self = $4768;
                switch (self._) {
                    case 'Maybe.none':
                        var $4772 = _list$3;
                        var _list0$7 = $4772;
                        break;
                    case 'Maybe.some':
                        var $4773 = self.value;
                        var $4774 = List$cons$($4773, _list$3);
                        var _list0$7 = $4774;
                        break;
                };
                var _list1$8 = Map$values$go$($4769, _list0$7);
                var _list2$9 = Map$values$go$($4770, _list1$8);
                var $4771 = _list2$9;
                var $4766 = $4771;
                break;
        };
        return $4766;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $4775 = Map$values$go$(_xs$2, List$nil);
        return $4775;
    };
    const Map$values = x0 => Map$values$(x0);

    function Fm$Name$show$(_name$1) {
        var $4776 = _name$1;
        return $4776;
    };
    const Fm$Name$show = x0 => Fm$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $4778 = 0n;
                var $4777 = $4778;
                break;
            case 'o':
                var $4779 = self.slice(0, -1);
                var $4780 = (2n * Bits$to_nat$($4779));
                var $4777 = $4780;
                break;
            case 'i':
                var $4781 = self.slice(0, -1);
                var $4782 = Nat$succ$((2n * Bits$to_nat$($4781)));
                var $4777 = $4782;
                break;
        };
        return $4777;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $4784 = u16_to_word(self);
                var $4785 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($4784)));
                var $4783 = $4785;
                break;
        };
        return $4783;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Fm$escape$char$(_chr$1) {
        var self = (_chr$1 === Fm$backslash);
        if (self) {
            var $4787 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
            var $4786 = $4787;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $4789 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                var $4788 = $4789;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $4791 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                    var $4790 = $4791;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $4793 = String$cons$(_chr$1, String$nil);
                        var $4792 = $4793;
                    } else {
                        var $4794 = String$flatten$(List$cons$(String$cons$(Fm$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $4792 = $4794;
                    };
                    var $4790 = $4792;
                };
                var $4788 = $4790;
            };
            var $4786 = $4788;
        };
        return $4786;
    };
    const Fm$escape$char = x0 => Fm$escape$char$(x0);

    function Fm$escape$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4796 = String$nil;
            var $4795 = $4796;
        } else {
            var $4797 = self.charCodeAt(0);
            var $4798 = self.slice(1);
            var _head$4 = Fm$escape$char$($4797);
            var _tail$5 = Fm$escape$($4798);
            var $4799 = (_head$4 + _tail$5);
            var $4795 = $4799;
        };
        return $4795;
    };
    const Fm$escape = x0 => Fm$escape$(x0);

    function Fm$Term$core$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4801 = self.name;
                var $4802 = self.indx;
                var $4803 = Fm$Name$show$($4801);
                var $4800 = $4803;
                break;
            case 'Fm.Term.ref':
                var $4804 = self.name;
                var $4805 = Fm$Name$show$($4804);
                var $4800 = $4805;
                break;
            case 'Fm.Term.typ':
                var $4806 = "*";
                var $4800 = $4806;
                break;
            case 'Fm.Term.all':
                var $4807 = self.eras;
                var $4808 = self.self;
                var $4809 = self.name;
                var $4810 = self.xtyp;
                var $4811 = self.body;
                var _eras$7 = $4807;
                var self = _eras$7;
                if (self) {
                    var $4813 = "%";
                    var _init$8 = $4813;
                } else {
                    var $4814 = "@";
                    var _init$8 = $4814;
                };
                var _self$9 = Fm$Name$show$($4808);
                var _name$10 = Fm$Name$show$($4809);
                var _xtyp$11 = Fm$Term$core$($4810);
                var _body$12 = Fm$Term$core$($4811(Fm$Term$var$($4808, 0n))(Fm$Term$var$($4809, 0n)));
                var $4812 = String$flatten$(List$cons$(_init$8, List$cons$(_self$9, List$cons$("(", List$cons$(_name$10, List$cons$(":", List$cons$(_xtyp$11, List$cons$(") ", List$cons$(_body$12, List$nil)))))))));
                var $4800 = $4812;
                break;
            case 'Fm.Term.lam':
                var $4815 = self.name;
                var $4816 = self.body;
                var _name$4 = Fm$Name$show$($4815);
                var _body$5 = Fm$Term$core$($4816(Fm$Term$var$($4815, 0n)));
                var $4817 = String$flatten$(List$cons$("#", List$cons$(_name$4, List$cons$(" ", List$cons$(_body$5, List$nil)))));
                var $4800 = $4817;
                break;
            case 'Fm.Term.app':
                var $4818 = self.func;
                var $4819 = self.argm;
                var _func$4 = Fm$Term$core$($4818);
                var _argm$5 = Fm$Term$core$($4819);
                var $4820 = String$flatten$(List$cons$("(", List$cons$(_func$4, List$cons$(" ", List$cons$(_argm$5, List$cons$(")", List$nil))))));
                var $4800 = $4820;
                break;
            case 'Fm.Term.let':
                var $4821 = self.name;
                var $4822 = self.expr;
                var $4823 = self.body;
                var _name$5 = Fm$Name$show$($4821);
                var _expr$6 = Fm$Term$core$($4822);
                var _body$7 = Fm$Term$core$($4823(Fm$Term$var$($4821, 0n)));
                var $4824 = String$flatten$(List$cons$("!", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4800 = $4824;
                break;
            case 'Fm.Term.def':
                var $4825 = self.name;
                var $4826 = self.expr;
                var $4827 = self.body;
                var _name$5 = Fm$Name$show$($4825);
                var _expr$6 = Fm$Term$core$($4826);
                var _body$7 = Fm$Term$core$($4827(Fm$Term$var$($4825, 0n)));
                var $4828 = String$flatten$(List$cons$("$", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4800 = $4828;
                break;
            case 'Fm.Term.ann':
                var $4829 = self.done;
                var $4830 = self.term;
                var $4831 = self.type;
                var _term$5 = Fm$Term$core$($4830);
                var _type$6 = Fm$Term$core$($4831);
                var $4832 = String$flatten$(List$cons$("{", List$cons$(_term$5, List$cons$(":", List$cons$(_type$6, List$cons$("}", List$nil))))));
                var $4800 = $4832;
                break;
            case 'Fm.Term.gol':
                var $4833 = self.name;
                var $4834 = self.dref;
                var $4835 = self.verb;
                var $4836 = "<GOL>";
                var $4800 = $4836;
                break;
            case 'Fm.Term.hol':
                var $4837 = self.path;
                var $4838 = "<HOL>";
                var $4800 = $4838;
                break;
            case 'Fm.Term.nat':
                var $4839 = self.natx;
                var $4840 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($4839), List$nil)));
                var $4800 = $4840;
                break;
            case 'Fm.Term.chr':
                var $4841 = self.chrx;
                var $4842 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($4841), List$cons$("\'", List$nil))));
                var $4800 = $4842;
                break;
            case 'Fm.Term.str':
                var $4843 = self.strx;
                var $4844 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($4843), List$cons$("\"", List$nil))));
                var $4800 = $4844;
                break;
            case 'Fm.Term.cse':
                var $4845 = self.path;
                var $4846 = self.expr;
                var $4847 = self.name;
                var $4848 = self.with;
                var $4849 = self.cses;
                var $4850 = self.moti;
                var $4851 = "<CSE>";
                var $4800 = $4851;
                break;
            case 'Fm.Term.ori':
                var $4852 = self.orig;
                var $4853 = self.expr;
                var $4854 = Fm$Term$core$($4853);
                var $4800 = $4854;
                break;
        };
        return $4800;
    };
    const Fm$Term$core = x0 => Fm$Term$core$(x0);

    function Fm$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $4857 = _result$2;
            var $4858 = Map$values$(_defs$1);
            let _result$4 = $4857;
            let _defn$3;
            while ($4858._ === 'List.cons') {
                _defn$3 = $4858.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4859 = self.file;
                        var $4860 = self.code;
                        var $4861 = self.name;
                        var $4862 = self.term;
                        var $4863 = self.type;
                        var $4864 = self.stat;
                        var self = $4864;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var $4866 = _result$4;
                                var $4865 = $4866;
                                break;
                            case 'Fm.Status.wait':
                                var $4867 = _result$4;
                                var $4865 = $4867;
                                break;
                            case 'Fm.Status.done':
                                var _name$11 = $4861;
                                var _term$12 = Fm$Term$core$($4862);
                                var _type$13 = Fm$Term$core$($4863);
                                var $4868 = String$flatten$(List$cons$(_result$4, List$cons$(_name$11, List$cons$(" : ", List$cons$(_type$13, List$cons$(" = ", List$cons$(_term$12, List$cons$(";\u{a}", List$nil))))))));
                                var $4865 = $4868;
                                break;
                            case 'Fm.Status.fail':
                                var $4869 = self.errors;
                                var $4870 = _result$4;
                                var $4865 = $4870;
                                break;
                        };
                        var $4857 = $4865;
                        break;
                };
                _result$4 = $4857;
                $4858 = $4858.tail;
            }
            return _result$4;
        })();
        var $4855 = _result$3;
        return $4855;
    };
    const Fm$Defs$core = x0 => Fm$Defs$core$(x0);

    function Fm$to_core$io$one$(_name$1) {
        var $4871 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $4872 = Monad$pure$(IO$monad)(Fm$Defs$core$(_defs$2));
            return $4872;
        }));
        return $4871;
    };
    const Fm$to_core$io$one = x0 => Fm$to_core$io$one$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $4874 = Maybe$none;
                var $4873 = $4874;
                break;
            case 'Maybe.some':
                var $4875 = self.value;
                var $4876 = _f$4($4875);
                var $4873 = $4876;
                break;
        };
        return $4873;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);
    const Maybe$monad = Monad$new$(Maybe$bind, Maybe$some);

    function Fm$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4878 = self.name;
                var $4879 = self.indx;
                var $4880 = Maybe$none;
                var $4877 = $4880;
                break;
            case 'Fm.Term.ref':
                var $4881 = self.name;
                var self = ($4881 === "Nat.zero");
                if (self) {
                    var $4883 = Maybe$some$(0n);
                    var $4882 = $4883;
                } else {
                    var $4884 = Maybe$none;
                    var $4882 = $4884;
                };
                var $4877 = $4882;
                break;
            case 'Fm.Term.typ':
                var $4885 = Maybe$none;
                var $4877 = $4885;
                break;
            case 'Fm.Term.all':
                var $4886 = self.eras;
                var $4887 = self.self;
                var $4888 = self.name;
                var $4889 = self.xtyp;
                var $4890 = self.body;
                var $4891 = Maybe$none;
                var $4877 = $4891;
                break;
            case 'Fm.Term.lam':
                var $4892 = self.name;
                var $4893 = self.body;
                var $4894 = Maybe$none;
                var $4877 = $4894;
                break;
            case 'Fm.Term.app':
                var $4895 = self.func;
                var $4896 = self.argm;
                var self = $4895;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $4898 = self.name;
                        var $4899 = self.indx;
                        var $4900 = Maybe$none;
                        var $4897 = $4900;
                        break;
                    case 'Fm.Term.ref':
                        var $4901 = self.name;
                        var self = ($4901 === "Nat.succ");
                        if (self) {
                            var $4903 = Monad$bind$(Maybe$monad)(Fm$Term$show$as_nat$go$($4896))((_pred$5 => {
                                var $4904 = Monad$pure$(Maybe$monad)(Nat$succ$(_pred$5));
                                return $4904;
                            }));
                            var $4902 = $4903;
                        } else {
                            var $4905 = Maybe$none;
                            var $4902 = $4905;
                        };
                        var $4897 = $4902;
                        break;
                    case 'Fm.Term.typ':
                        var $4906 = Maybe$none;
                        var $4897 = $4906;
                        break;
                    case 'Fm.Term.all':
                        var $4907 = self.eras;
                        var $4908 = self.self;
                        var $4909 = self.name;
                        var $4910 = self.xtyp;
                        var $4911 = self.body;
                        var $4912 = Maybe$none;
                        var $4897 = $4912;
                        break;
                    case 'Fm.Term.lam':
                        var $4913 = self.name;
                        var $4914 = self.body;
                        var $4915 = Maybe$none;
                        var $4897 = $4915;
                        break;
                    case 'Fm.Term.app':
                        var $4916 = self.func;
                        var $4917 = self.argm;
                        var $4918 = Maybe$none;
                        var $4897 = $4918;
                        break;
                    case 'Fm.Term.let':
                        var $4919 = self.name;
                        var $4920 = self.expr;
                        var $4921 = self.body;
                        var $4922 = Maybe$none;
                        var $4897 = $4922;
                        break;
                    case 'Fm.Term.def':
                        var $4923 = self.name;
                        var $4924 = self.expr;
                        var $4925 = self.body;
                        var $4926 = Maybe$none;
                        var $4897 = $4926;
                        break;
                    case 'Fm.Term.ann':
                        var $4927 = self.done;
                        var $4928 = self.term;
                        var $4929 = self.type;
                        var $4930 = Maybe$none;
                        var $4897 = $4930;
                        break;
                    case 'Fm.Term.gol':
                        var $4931 = self.name;
                        var $4932 = self.dref;
                        var $4933 = self.verb;
                        var $4934 = Maybe$none;
                        var $4897 = $4934;
                        break;
                    case 'Fm.Term.hol':
                        var $4935 = self.path;
                        var $4936 = Maybe$none;
                        var $4897 = $4936;
                        break;
                    case 'Fm.Term.nat':
                        var $4937 = self.natx;
                        var $4938 = Maybe$none;
                        var $4897 = $4938;
                        break;
                    case 'Fm.Term.chr':
                        var $4939 = self.chrx;
                        var $4940 = Maybe$none;
                        var $4897 = $4940;
                        break;
                    case 'Fm.Term.str':
                        var $4941 = self.strx;
                        var $4942 = Maybe$none;
                        var $4897 = $4942;
                        break;
                    case 'Fm.Term.cse':
                        var $4943 = self.path;
                        var $4944 = self.expr;
                        var $4945 = self.name;
                        var $4946 = self.with;
                        var $4947 = self.cses;
                        var $4948 = self.moti;
                        var $4949 = Maybe$none;
                        var $4897 = $4949;
                        break;
                    case 'Fm.Term.ori':
                        var $4950 = self.orig;
                        var $4951 = self.expr;
                        var $4952 = Maybe$none;
                        var $4897 = $4952;
                        break;
                };
                var $4877 = $4897;
                break;
            case 'Fm.Term.let':
                var $4953 = self.name;
                var $4954 = self.expr;
                var $4955 = self.body;
                var $4956 = Maybe$none;
                var $4877 = $4956;
                break;
            case 'Fm.Term.def':
                var $4957 = self.name;
                var $4958 = self.expr;
                var $4959 = self.body;
                var $4960 = Maybe$none;
                var $4877 = $4960;
                break;
            case 'Fm.Term.ann':
                var $4961 = self.done;
                var $4962 = self.term;
                var $4963 = self.type;
                var $4964 = Maybe$none;
                var $4877 = $4964;
                break;
            case 'Fm.Term.gol':
                var $4965 = self.name;
                var $4966 = self.dref;
                var $4967 = self.verb;
                var $4968 = Maybe$none;
                var $4877 = $4968;
                break;
            case 'Fm.Term.hol':
                var $4969 = self.path;
                var $4970 = Maybe$none;
                var $4877 = $4970;
                break;
            case 'Fm.Term.nat':
                var $4971 = self.natx;
                var $4972 = Maybe$none;
                var $4877 = $4972;
                break;
            case 'Fm.Term.chr':
                var $4973 = self.chrx;
                var $4974 = Maybe$none;
                var $4877 = $4974;
                break;
            case 'Fm.Term.str':
                var $4975 = self.strx;
                var $4976 = Maybe$none;
                var $4877 = $4976;
                break;
            case 'Fm.Term.cse':
                var $4977 = self.path;
                var $4978 = self.expr;
                var $4979 = self.name;
                var $4980 = self.with;
                var $4981 = self.cses;
                var $4982 = self.moti;
                var $4983 = Maybe$none;
                var $4877 = $4983;
                break;
            case 'Fm.Term.ori':
                var $4984 = self.orig;
                var $4985 = self.expr;
                var $4986 = Maybe$none;
                var $4877 = $4986;
                break;
        };
        return $4877;
    };
    const Fm$Term$show$as_nat$go = x0 => Fm$Term$show$as_nat$go$(x0);

    function Fm$Term$show$as_nat$(_term$1) {
        var $4987 = Maybe$mapped$(Fm$Term$show$as_nat$go$(_term$1), Nat$show);
        return $4987;
    };
    const Fm$Term$show$as_nat = x0 => Fm$Term$show$as_nat$(x0);

    function Fm$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4989 = self.name;
                var $4990 = self.indx;
                var $4991 = Bool$false;
                var $4988 = $4991;
                break;
            case 'Fm.Term.ref':
                var $4992 = self.name;
                var $4993 = (_name$2 === $4992);
                var $4988 = $4993;
                break;
            case 'Fm.Term.typ':
                var $4994 = Bool$false;
                var $4988 = $4994;
                break;
            case 'Fm.Term.all':
                var $4995 = self.eras;
                var $4996 = self.self;
                var $4997 = self.name;
                var $4998 = self.xtyp;
                var $4999 = self.body;
                var $5000 = Bool$false;
                var $4988 = $5000;
                break;
            case 'Fm.Term.lam':
                var $5001 = self.name;
                var $5002 = self.body;
                var $5003 = Bool$false;
                var $4988 = $5003;
                break;
            case 'Fm.Term.app':
                var $5004 = self.func;
                var $5005 = self.argm;
                var $5006 = Bool$false;
                var $4988 = $5006;
                break;
            case 'Fm.Term.let':
                var $5007 = self.name;
                var $5008 = self.expr;
                var $5009 = self.body;
                var $5010 = Bool$false;
                var $4988 = $5010;
                break;
            case 'Fm.Term.def':
                var $5011 = self.name;
                var $5012 = self.expr;
                var $5013 = self.body;
                var $5014 = Bool$false;
                var $4988 = $5014;
                break;
            case 'Fm.Term.ann':
                var $5015 = self.done;
                var $5016 = self.term;
                var $5017 = self.type;
                var $5018 = Bool$false;
                var $4988 = $5018;
                break;
            case 'Fm.Term.gol':
                var $5019 = self.name;
                var $5020 = self.dref;
                var $5021 = self.verb;
                var $5022 = Bool$false;
                var $4988 = $5022;
                break;
            case 'Fm.Term.hol':
                var $5023 = self.path;
                var $5024 = Bool$false;
                var $4988 = $5024;
                break;
            case 'Fm.Term.nat':
                var $5025 = self.natx;
                var $5026 = Bool$false;
                var $4988 = $5026;
                break;
            case 'Fm.Term.chr':
                var $5027 = self.chrx;
                var $5028 = Bool$false;
                var $4988 = $5028;
                break;
            case 'Fm.Term.str':
                var $5029 = self.strx;
                var $5030 = Bool$false;
                var $4988 = $5030;
                break;
            case 'Fm.Term.cse':
                var $5031 = self.path;
                var $5032 = self.expr;
                var $5033 = self.name;
                var $5034 = self.with;
                var $5035 = self.cses;
                var $5036 = self.moti;
                var $5037 = Bool$false;
                var $4988 = $5037;
                break;
            case 'Fm.Term.ori':
                var $5038 = self.orig;
                var $5039 = self.expr;
                var $5040 = Bool$false;
                var $4988 = $5040;
                break;
        };
        return $4988;
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
                        var $5041 = self.name;
                        var $5042 = self.indx;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5044 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5043 = $5044;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5046 = Bool$false;
                                var _wrap$8 = $5046;
                            } else {
                                var $5047 = self.charCodeAt(0);
                                var $5048 = self.slice(1);
                                var $5049 = ($5047 === 40);
                                var _wrap$8 = $5049;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5050 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5050;
                            } else {
                                var $5051 = _func$7;
                                var _func$10 = $5051;
                            };
                            var $5045 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5043 = $5045;
                        };
                        return $5043;
                    case 'Fm.Term.ref':
                        var $5052 = self.name;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5054 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5053 = $5054;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5056 = Bool$false;
                                var _wrap$7 = $5056;
                            } else {
                                var $5057 = self.charCodeAt(0);
                                var $5058 = self.slice(1);
                                var $5059 = ($5057 === 40);
                                var _wrap$7 = $5059;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5060 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5060;
                            } else {
                                var $5061 = _func$6;
                                var _func$9 = $5061;
                            };
                            var $5055 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5053 = $5055;
                        };
                        return $5053;
                    case 'Fm.Term.typ':
                        var _arity$4 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
                        if (self) {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5063 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
                            var $5062 = $5063;
                        } else {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$5;
                            if (self.length === 0) {
                                var $5065 = Bool$false;
                                var _wrap$6 = $5065;
                            } else {
                                var $5066 = self.charCodeAt(0);
                                var $5067 = self.slice(1);
                                var $5068 = ($5066 === 40);
                                var _wrap$6 = $5068;
                            };
                            var _args$7 = String$join$(",", _args$3);
                            var self = _wrap$6;
                            if (self) {
                                var $5069 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                                var _func$8 = $5069;
                            } else {
                                var $5070 = _func$5;
                                var _func$8 = $5070;
                            };
                            var $5064 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
                            var $5062 = $5064;
                        };
                        return $5062;
                    case 'Fm.Term.all':
                        var $5071 = self.eras;
                        var $5072 = self.self;
                        var $5073 = self.name;
                        var $5074 = self.xtyp;
                        var $5075 = self.body;
                        var _arity$9 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$9 === 3n));
                        if (self) {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$11 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$12 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5077 = String$flatten$(List$cons$(_eq_lft$11, List$cons$(" == ", List$cons$(_eq_rgt$12, List$nil))));
                            var $5076 = $5077;
                        } else {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$10;
                            if (self.length === 0) {
                                var $5079 = Bool$false;
                                var _wrap$11 = $5079;
                            } else {
                                var $5080 = self.charCodeAt(0);
                                var $5081 = self.slice(1);
                                var $5082 = ($5080 === 40);
                                var _wrap$11 = $5082;
                            };
                            var _args$12 = String$join$(",", _args$3);
                            var self = _wrap$11;
                            if (self) {
                                var $5083 = String$flatten$(List$cons$("(", List$cons$(_func$10, List$cons$(")", List$nil))));
                                var _func$13 = $5083;
                            } else {
                                var $5084 = _func$10;
                                var _func$13 = $5084;
                            };
                            var $5078 = String$flatten$(List$cons$(_func$13, List$cons$("(", List$cons$(_args$12, List$cons$(")", List$nil)))));
                            var $5076 = $5078;
                        };
                        return $5076;
                    case 'Fm.Term.lam':
                        var $5085 = self.name;
                        var $5086 = self.body;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5088 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5087 = $5088;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5090 = Bool$false;
                                var _wrap$8 = $5090;
                            } else {
                                var $5091 = self.charCodeAt(0);
                                var $5092 = self.slice(1);
                                var $5093 = ($5091 === 40);
                                var _wrap$8 = $5093;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5094 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5094;
                            } else {
                                var $5095 = _func$7;
                                var _func$10 = $5095;
                            };
                            var $5089 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5087 = $5089;
                        };
                        return $5087;
                    case 'Fm.Term.app':
                        var $5096 = self.func;
                        var $5097 = self.argm;
                        var _argm$6 = Fm$Term$show$go$($5097, Fm$MPath$i$(_path$2));
                        var $5098 = Fm$Term$show$app$($5096, Fm$MPath$o$(_path$2), List$cons$(_argm$6, _args$3));
                        return $5098;
                    case 'Fm.Term.let':
                        var $5099 = self.name;
                        var $5100 = self.expr;
                        var $5101 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5103 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5102 = $5103;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5105 = Bool$false;
                                var _wrap$9 = $5105;
                            } else {
                                var $5106 = self.charCodeAt(0);
                                var $5107 = self.slice(1);
                                var $5108 = ($5106 === 40);
                                var _wrap$9 = $5108;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5109 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5109;
                            } else {
                                var $5110 = _func$8;
                                var _func$11 = $5110;
                            };
                            var $5104 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5102 = $5104;
                        };
                        return $5102;
                    case 'Fm.Term.def':
                        var $5111 = self.name;
                        var $5112 = self.expr;
                        var $5113 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5115 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5114 = $5115;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5117 = Bool$false;
                                var _wrap$9 = $5117;
                            } else {
                                var $5118 = self.charCodeAt(0);
                                var $5119 = self.slice(1);
                                var $5120 = ($5118 === 40);
                                var _wrap$9 = $5120;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5121 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5121;
                            } else {
                                var $5122 = _func$8;
                                var _func$11 = $5122;
                            };
                            var $5116 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5114 = $5116;
                        };
                        return $5114;
                    case 'Fm.Term.ann':
                        var $5123 = self.done;
                        var $5124 = self.term;
                        var $5125 = self.type;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5127 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5126 = $5127;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5129 = Bool$false;
                                var _wrap$9 = $5129;
                            } else {
                                var $5130 = self.charCodeAt(0);
                                var $5131 = self.slice(1);
                                var $5132 = ($5130 === 40);
                                var _wrap$9 = $5132;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5133 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5133;
                            } else {
                                var $5134 = _func$8;
                                var _func$11 = $5134;
                            };
                            var $5128 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5126 = $5128;
                        };
                        return $5126;
                    case 'Fm.Term.gol':
                        var $5135 = self.name;
                        var $5136 = self.dref;
                        var $5137 = self.verb;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5139 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5138 = $5139;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5141 = Bool$false;
                                var _wrap$9 = $5141;
                            } else {
                                var $5142 = self.charCodeAt(0);
                                var $5143 = self.slice(1);
                                var $5144 = ($5142 === 40);
                                var _wrap$9 = $5144;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5145 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5145;
                            } else {
                                var $5146 = _func$8;
                                var _func$11 = $5146;
                            };
                            var $5140 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5138 = $5140;
                        };
                        return $5138;
                    case 'Fm.Term.hol':
                        var $5147 = self.path;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5149 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5148 = $5149;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5151 = Bool$false;
                                var _wrap$7 = $5151;
                            } else {
                                var $5152 = self.charCodeAt(0);
                                var $5153 = self.slice(1);
                                var $5154 = ($5152 === 40);
                                var _wrap$7 = $5154;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5155 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5155;
                            } else {
                                var $5156 = _func$6;
                                var _func$9 = $5156;
                            };
                            var $5150 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5148 = $5150;
                        };
                        return $5148;
                    case 'Fm.Term.nat':
                        var $5157 = self.natx;
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
                    case 'Fm.Term.chr':
                        var $5167 = self.chrx;
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
                    case 'Fm.Term.str':
                        var $5177 = self.strx;
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
                    case 'Fm.Term.cse':
                        var $5187 = self.path;
                        var $5188 = self.expr;
                        var $5189 = self.name;
                        var $5190 = self.with;
                        var $5191 = self.cses;
                        var $5192 = self.moti;
                        var _arity$10 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$10 === 3n));
                        if (self) {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$12 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$13 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5194 = String$flatten$(List$cons$(_eq_lft$12, List$cons$(" == ", List$cons$(_eq_rgt$13, List$nil))));
                            var $5193 = $5194;
                        } else {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$11;
                            if (self.length === 0) {
                                var $5196 = Bool$false;
                                var _wrap$12 = $5196;
                            } else {
                                var $5197 = self.charCodeAt(0);
                                var $5198 = self.slice(1);
                                var $5199 = ($5197 === 40);
                                var _wrap$12 = $5199;
                            };
                            var _args$13 = String$join$(",", _args$3);
                            var self = _wrap$12;
                            if (self) {
                                var $5200 = String$flatten$(List$cons$("(", List$cons$(_func$11, List$cons$(")", List$nil))));
                                var _func$14 = $5200;
                            } else {
                                var $5201 = _func$11;
                                var _func$14 = $5201;
                            };
                            var $5195 = String$flatten$(List$cons$(_func$14, List$cons$("(", List$cons$(_args$13, List$cons$(")", List$nil)))));
                            var $5193 = $5195;
                        };
                        return $5193;
                    case 'Fm.Term.ori':
                        var $5202 = self.orig;
                        var $5203 = self.expr;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5205 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5204 = $5205;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5207 = Bool$false;
                                var _wrap$8 = $5207;
                            } else {
                                var $5208 = self.charCodeAt(0);
                                var $5209 = self.slice(1);
                                var $5210 = ($5208 === 40);
                                var _wrap$8 = $5210;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5211 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5211;
                            } else {
                                var $5212 = _func$7;
                                var _func$10 = $5212;
                            };
                            var $5206 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5204 = $5206;
                        };
                        return $5204;
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
                var $5214 = _list$4;
                var $5213 = $5214;
                break;
            case 'Map.tie':
                var $5215 = self.val;
                var $5216 = self.lft;
                var $5217 = self.rgt;
                var self = $5215;
                switch (self._) {
                    case 'Maybe.none':
                        var $5219 = _list$4;
                        var _list0$8 = $5219;
                        break;
                    case 'Maybe.some':
                        var $5220 = self.value;
                        var $5221 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5220), _list$4);
                        var _list0$8 = $5221;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5216, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5217, (_key$3 + '1'), _list1$9);
                var $5218 = _list2$10;
                var $5213 = $5218;
                break;
        };
        return $5213;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5222 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5222;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $5224 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5223 = $5224;
                break;
            case 'o':
                var $5225 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5227 = List$cons$(_head$6, _tail$7);
                    var $5226 = $5227;
                } else {
                    var $5228 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5229 = Bits$chunks_of$go$(_len$1, $5225, $5228, _chunk$7);
                    var $5226 = $5229;
                };
                var $5223 = $5226;
                break;
            case 'i':
                var $5230 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5232 = List$cons$(_head$6, _tail$7);
                    var $5231 = $5232;
                } else {
                    var $5233 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5234 = Bits$chunks_of$go$(_len$1, $5230, $5233, _chunk$7);
                    var $5231 = $5234;
                };
                var $5223 = $5231;
                break;
        };
        return $5223;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5235 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5235;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5237 = Word$e;
            var $5236 = $5237;
        } else {
            var $5238 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'e':
                    var $5240 = Word$o$(Word$from_bits$($5238, Bits$e));
                    var $5239 = $5240;
                    break;
                case 'o':
                    var $5241 = self.slice(0, -1);
                    var $5242 = Word$o$(Word$from_bits$($5238, $5241));
                    var $5239 = $5242;
                    break;
                case 'i':
                    var $5243 = self.slice(0, -1);
                    var $5244 = Word$i$(Word$from_bits$($5238, $5243));
                    var $5239 = $5244;
                    break;
            };
            var $5236 = $5239;
        };
        return $5236;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Fm$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5247 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5247;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5249 = ((_u16$5 + 71) & 0xFFFF);
                    var $5248 = $5249;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5251 = (Math.max(_u16$5 - 4, 0));
                        var $5250 = $5251;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5253 = 46;
                            var $5252 = $5253;
                        } else {
                            var $5254 = 95;
                            var $5252 = $5254;
                        };
                        var $5250 = $5252;
                    };
                    var $5248 = $5250;
                };
                var _chr$6 = $5248;
            };
            var $5246 = String$cons$(_chr$6, _name$4);
            return $5246;
        }));
        var $5245 = _name$3;
        return $5245;
    };
    const Fm$Name$from_bits = x0 => Fm$Name$from_bits$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $5256 = self.fst;
                var $5257 = self.snd;
                var $5258 = $5256;
                var $5255 = $5258;
                break;
        };
        return $5255;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Fm$Term$show$go$(_term$1, _path$2) {
        var self = Fm$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $5261 = self.name;
                        var $5262 = self.indx;
                        var $5263 = Fm$Name$show$($5261);
                        var $5260 = $5263;
                        break;
                    case 'Fm.Term.ref':
                        var $5264 = self.name;
                        var _name$4 = Fm$Name$show$($5264);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5266 = _name$4;
                                var $5265 = $5266;
                                break;
                            case 'Maybe.some':
                                var $5267 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Fm$Path$to_bits$($5267));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5268 = String$flatten$(List$cons$(_name$4, List$cons$(Fm$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5265 = $5268;
                                break;
                        };
                        var $5260 = $5265;
                        break;
                    case 'Fm.Term.typ':
                        var $5269 = "Type";
                        var $5260 = $5269;
                        break;
                    case 'Fm.Term.all':
                        var $5270 = self.eras;
                        var $5271 = self.self;
                        var $5272 = self.name;
                        var $5273 = self.xtyp;
                        var $5274 = self.body;
                        var _eras$8 = $5270;
                        var _self$9 = Fm$Name$show$($5271);
                        var _name$10 = Fm$Name$show$($5272);
                        var _type$11 = Fm$Term$show$go$($5273, Fm$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5276 = "<";
                            var _open$12 = $5276;
                        } else {
                            var $5277 = "(";
                            var _open$12 = $5277;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5278 = ">";
                            var _clos$13 = $5278;
                        } else {
                            var $5279 = ")";
                            var _clos$13 = $5279;
                        };
                        var _body$14 = Fm$Term$show$go$($5274(Fm$Term$var$($5271, 0n))(Fm$Term$var$($5272, 0n)), Fm$MPath$i$(_path$2));
                        var $5275 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5260 = $5275;
                        break;
                    case 'Fm.Term.lam':
                        var $5280 = self.name;
                        var $5281 = self.body;
                        var _name$5 = Fm$Name$show$($5280);
                        var _body$6 = Fm$Term$show$go$($5281(Fm$Term$var$($5280, 0n)), Fm$MPath$o$(_path$2));
                        var $5282 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5260 = $5282;
                        break;
                    case 'Fm.Term.app':
                        var $5283 = self.func;
                        var $5284 = self.argm;
                        var $5285 = Fm$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5260 = $5285;
                        break;
                    case 'Fm.Term.let':
                        var $5286 = self.name;
                        var $5287 = self.expr;
                        var $5288 = self.body;
                        var _name$6 = Fm$Name$show$($5286);
                        var _expr$7 = Fm$Term$show$go$($5287, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5288(Fm$Term$var$($5286, 0n)), Fm$MPath$i$(_path$2));
                        var $5289 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5260 = $5289;
                        break;
                    case 'Fm.Term.def':
                        var $5290 = self.name;
                        var $5291 = self.expr;
                        var $5292 = self.body;
                        var _name$6 = Fm$Name$show$($5290);
                        var _expr$7 = Fm$Term$show$go$($5291, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5292(Fm$Term$var$($5290, 0n)), Fm$MPath$i$(_path$2));
                        var $5293 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5260 = $5293;
                        break;
                    case 'Fm.Term.ann':
                        var $5294 = self.done;
                        var $5295 = self.term;
                        var $5296 = self.type;
                        var _term$6 = Fm$Term$show$go$($5295, Fm$MPath$o$(_path$2));
                        var _type$7 = Fm$Term$show$go$($5296, Fm$MPath$i$(_path$2));
                        var $5297 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5260 = $5297;
                        break;
                    case 'Fm.Term.gol':
                        var $5298 = self.name;
                        var $5299 = self.dref;
                        var $5300 = self.verb;
                        var _name$6 = Fm$Name$show$($5298);
                        var $5301 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5260 = $5301;
                        break;
                    case 'Fm.Term.hol':
                        var $5302 = self.path;
                        var $5303 = "_";
                        var $5260 = $5303;
                        break;
                    case 'Fm.Term.nat':
                        var $5304 = self.natx;
                        var $5305 = String$flatten$(List$cons$(Nat$show$($5304), List$nil));
                        var $5260 = $5305;
                        break;
                    case 'Fm.Term.chr':
                        var $5306 = self.chrx;
                        var $5307 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($5306), List$cons$("\'", List$nil))));
                        var $5260 = $5307;
                        break;
                    case 'Fm.Term.str':
                        var $5308 = self.strx;
                        var $5309 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($5308), List$cons$("\"", List$nil))));
                        var $5260 = $5309;
                        break;
                    case 'Fm.Term.cse':
                        var $5310 = self.path;
                        var $5311 = self.expr;
                        var $5312 = self.name;
                        var $5313 = self.with;
                        var $5314 = self.cses;
                        var $5315 = self.moti;
                        var _expr$9 = Fm$Term$show$go$($5311, Fm$MPath$o$(_path$2));
                        var _name$10 = Fm$Name$show$($5312);
                        var _wyth$11 = String$join$("", List$mapped$($5313, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5318 = self.file;
                                    var $5319 = self.code;
                                    var $5320 = self.name;
                                    var $5321 = self.term;
                                    var $5322 = self.type;
                                    var $5323 = self.stat;
                                    var _name$18 = Fm$Name$show$($5320);
                                    var _type$19 = Fm$Term$show$go$($5322, Maybe$none);
                                    var _term$20 = Fm$Term$show$go$($5321, Maybe$none);
                                    var $5324 = String$flatten$(List$cons$(_name$18, List$cons$(": ", List$cons$(_type$19, List$cons$(" = ", List$cons$(_term$20, List$cons$(";", List$nil)))))));
                                    var $5317 = $5324;
                                    break;
                            };
                            return $5317;
                        })));
                        var _cses$12 = Map$to_list$($5314);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Fm$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Fm$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5325 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5325;
                        })));
                        var self = $5315;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5326 = "";
                                var _moti$14 = $5326;
                                break;
                            case 'Maybe.some':
                                var $5327 = self.value;
                                var $5328 = String$flatten$(List$cons$(": ", List$cons$(Fm$Term$show$go$($5327, Maybe$none), List$nil)));
                                var _moti$14 = $5328;
                                break;
                        };
                        var $5316 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5260 = $5316;
                        break;
                    case 'Fm.Term.ori':
                        var $5329 = self.orig;
                        var $5330 = self.expr;
                        var $5331 = Fm$Term$show$go$($5330, _path$2);
                        var $5260 = $5331;
                        break;
                };
                var $5259 = $5260;
                break;
            case 'Maybe.some':
                var $5332 = self.value;
                var $5333 = $5332;
                var $5259 = $5333;
                break;
        };
        return $5259;
    };
    const Fm$Term$show$go = x0 => x1 => Fm$Term$show$go$(x0, x1);

    function Fm$Term$show$(_term$1) {
        var $5334 = Fm$Term$show$go$(_term$1, Maybe$none);
        return $5334;
    };
    const Fm$Term$show = x0 => Fm$Term$show$(x0);

    function Fm$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.nil':
                var $5336 = List$nil;
                var $5335 = $5336;
                break;
            case 'List.cons':
                var $5337 = self.head;
                var $5338 = self.tail;
                var self = $5337;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5340 = self.origin;
                        var $5341 = self.expected;
                        var $5342 = self.detected;
                        var $5343 = self.context;
                        var $5344 = (!_got$2);
                        var _keep$5 = $5344;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5345 = self.name;
                        var $5346 = self.dref;
                        var $5347 = self.verb;
                        var $5348 = self.goal;
                        var $5349 = self.context;
                        var $5350 = Bool$true;
                        var _keep$5 = $5350;
                        break;
                    case 'Fm.Error.waiting':
                        var $5351 = self.name;
                        var $5352 = Bool$false;
                        var _keep$5 = $5352;
                        break;
                    case 'Fm.Error.indirect':
                        var $5353 = self.name;
                        var $5354 = Bool$false;
                        var _keep$5 = $5354;
                        break;
                    case 'Fm.Error.patch':
                        var $5355 = self.path;
                        var $5356 = self.term;
                        var $5357 = Bool$false;
                        var _keep$5 = $5357;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5358 = self.origin;
                        var $5359 = self.name;
                        var $5360 = (!_got$2);
                        var _keep$5 = $5360;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5361 = self.origin;
                        var $5362 = self.term;
                        var $5363 = self.context;
                        var $5364 = (!_got$2);
                        var _keep$5 = $5364;
                        break;
                };
                var self = $5337;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5365 = self.origin;
                        var $5366 = self.expected;
                        var $5367 = self.detected;
                        var $5368 = self.context;
                        var $5369 = Bool$true;
                        var _got$6 = $5369;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5370 = self.name;
                        var $5371 = self.dref;
                        var $5372 = self.verb;
                        var $5373 = self.goal;
                        var $5374 = self.context;
                        var $5375 = _got$2;
                        var _got$6 = $5375;
                        break;
                    case 'Fm.Error.waiting':
                        var $5376 = self.name;
                        var $5377 = _got$2;
                        var _got$6 = $5377;
                        break;
                    case 'Fm.Error.indirect':
                        var $5378 = self.name;
                        var $5379 = _got$2;
                        var _got$6 = $5379;
                        break;
                    case 'Fm.Error.patch':
                        var $5380 = self.path;
                        var $5381 = self.term;
                        var $5382 = _got$2;
                        var _got$6 = $5382;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5383 = self.origin;
                        var $5384 = self.name;
                        var $5385 = Bool$true;
                        var _got$6 = $5385;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5386 = self.origin;
                        var $5387 = self.term;
                        var $5388 = self.context;
                        var $5389 = _got$2;
                        var _got$6 = $5389;
                        break;
                };
                var _tail$7 = Fm$Error$relevant$($5338, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5390 = List$cons$($5337, _tail$7);
                    var $5339 = $5390;
                } else {
                    var $5391 = _tail$7;
                    var $5339 = $5391;
                };
                var $5335 = $5339;
                break;
        };
        return $5335;
    };
    const Fm$Error$relevant = x0 => x1 => Fm$Error$relevant$(x0, x1);

    function Fm$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.nil':
                var $5393 = "";
                var $5392 = $5393;
                break;
            case 'List.cons':
                var $5394 = self.head;
                var $5395 = self.tail;
                var self = $5394;
                switch (self._) {
                    case 'Pair.new':
                        var $5397 = self.fst;
                        var $5398 = self.snd;
                        var _name$6 = Fm$Name$show$($5397);
                        var _type$7 = Fm$Term$show$($5398);
                        var _rest$8 = Fm$Context$show$($5395);
                        var $5399 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5396 = $5399;
                        break;
                };
                var $5392 = $5396;
                break;
        };
        return $5392;
    };
    const Fm$Context$show = x0 => Fm$Context$show$(x0);

    function Fm$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5400 = Fm$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Fm.Term.var':
                    var $5402 = self.name;
                    var $5403 = self.indx;
                    var $5404 = _term$4;
                    var $5401 = $5404;
                    break;
                case 'Fm.Term.ref':
                    var $5405 = self.name;
                    var self = Fm$get$($5405, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5407 = Fm$Term$ref$($5405);
                            var $5406 = $5407;
                            break;
                        case 'Maybe.some':
                            var $5408 = self.value;
                            var self = $5408;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5410 = self.file;
                                    var $5411 = self.code;
                                    var $5412 = self.name;
                                    var $5413 = self.term;
                                    var $5414 = self.type;
                                    var $5415 = self.stat;
                                    var $5416 = $5413;
                                    var $5409 = $5416;
                                    break;
                            };
                            var $5406 = $5409;
                            break;
                    };
                    var $5401 = $5406;
                    break;
                case 'Fm.Term.typ':
                    var $5417 = _term$4;
                    var $5401 = $5417;
                    break;
                case 'Fm.Term.all':
                    var $5418 = self.eras;
                    var $5419 = self.self;
                    var $5420 = self.name;
                    var $5421 = self.xtyp;
                    var $5422 = self.body;
                    var $5423 = _term$4;
                    var $5401 = $5423;
                    break;
                case 'Fm.Term.lam':
                    var $5424 = self.name;
                    var $5425 = self.body;
                    var $5426 = _term$4;
                    var $5401 = $5426;
                    break;
                case 'Fm.Term.app':
                    var $5427 = self.func;
                    var $5428 = self.argm;
                    var $5429 = _term$4;
                    var $5401 = $5429;
                    break;
                case 'Fm.Term.let':
                    var $5430 = self.name;
                    var $5431 = self.expr;
                    var $5432 = self.body;
                    var $5433 = _term$4;
                    var $5401 = $5433;
                    break;
                case 'Fm.Term.def':
                    var $5434 = self.name;
                    var $5435 = self.expr;
                    var $5436 = self.body;
                    var $5437 = _term$4;
                    var $5401 = $5437;
                    break;
                case 'Fm.Term.ann':
                    var $5438 = self.done;
                    var $5439 = self.term;
                    var $5440 = self.type;
                    var $5441 = _term$4;
                    var $5401 = $5441;
                    break;
                case 'Fm.Term.gol':
                    var $5442 = self.name;
                    var $5443 = self.dref;
                    var $5444 = self.verb;
                    var $5445 = _term$4;
                    var $5401 = $5445;
                    break;
                case 'Fm.Term.hol':
                    var $5446 = self.path;
                    var $5447 = _term$4;
                    var $5401 = $5447;
                    break;
                case 'Fm.Term.nat':
                    var $5448 = self.natx;
                    var $5449 = _term$4;
                    var $5401 = $5449;
                    break;
                case 'Fm.Term.chr':
                    var $5450 = self.chrx;
                    var $5451 = _term$4;
                    var $5401 = $5451;
                    break;
                case 'Fm.Term.str':
                    var $5452 = self.strx;
                    var $5453 = _term$4;
                    var $5401 = $5453;
                    break;
                case 'Fm.Term.cse':
                    var $5454 = self.path;
                    var $5455 = self.expr;
                    var $5456 = self.name;
                    var $5457 = self.with;
                    var $5458 = self.cses;
                    var $5459 = self.moti;
                    var $5460 = _term$4;
                    var $5401 = $5460;
                    break;
                case 'Fm.Term.ori':
                    var $5461 = self.orig;
                    var $5462 = self.expr;
                    var $5463 = _term$4;
                    var $5401 = $5463;
                    break;
            };
            return $5401;
        }));
        return $5400;
    };
    const Fm$Term$expand_at = x0 => x1 => x2 => Fm$Term$expand_at$(x0, x1, x2);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Fm$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5465 = self.name;
                var $5466 = self.indx;
                var $5467 = Fm$Term$var$($5465, $5466);
                var $5464 = $5467;
                break;
            case 'Fm.Term.ref':
                var $5468 = self.name;
                var _expand$5 = Bool$false;
                var _expand$6 = ((($5468 === "Nat.succ") && (_arity$3 > 1n)) || _expand$5);
                var _expand$7 = ((($5468 === "Nat.zero") && (_arity$3 > 0n)) || _expand$6);
                var _expand$8 = ((($5468 === "Bool.true") && (_arity$3 > 0n)) || _expand$7);
                var _expand$9 = ((($5468 === "Bool.false") && (_arity$3 > 0n)) || _expand$8);
                var self = _expand$9;
                if (self) {
                    var self = Fm$get$($5468, _defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5471 = Fm$Term$ref$($5468);
                            var $5470 = $5471;
                            break;
                        case 'Maybe.some':
                            var $5472 = self.value;
                            var self = $5472;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5474 = self.file;
                                    var $5475 = self.code;
                                    var $5476 = self.name;
                                    var $5477 = self.term;
                                    var $5478 = self.type;
                                    var $5479 = self.stat;
                                    var $5480 = $5477;
                                    var $5473 = $5480;
                                    break;
                            };
                            var $5470 = $5473;
                            break;
                    };
                    var $5469 = $5470;
                } else {
                    var $5481 = Fm$Term$ref$($5468);
                    var $5469 = $5481;
                };
                var $5464 = $5469;
                break;
            case 'Fm.Term.typ':
                var $5482 = Fm$Term$typ;
                var $5464 = $5482;
                break;
            case 'Fm.Term.all':
                var $5483 = self.eras;
                var $5484 = self.self;
                var $5485 = self.name;
                var $5486 = self.xtyp;
                var $5487 = self.body;
                var $5488 = Fm$Term$all$($5483, $5484, $5485, Fm$Term$expand_ct$($5486, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5489 = Fm$Term$expand_ct$($5487(_s$9)(_x$10), _defs$2, 0n);
                    return $5489;
                }));
                var $5464 = $5488;
                break;
            case 'Fm.Term.lam':
                var $5490 = self.name;
                var $5491 = self.body;
                var $5492 = Fm$Term$lam$($5490, (_x$6 => {
                    var $5493 = Fm$Term$expand_ct$($5491(_x$6), _defs$2, 0n);
                    return $5493;
                }));
                var $5464 = $5492;
                break;
            case 'Fm.Term.app':
                var $5494 = self.func;
                var $5495 = self.argm;
                var $5496 = Fm$Term$app$(Fm$Term$expand_ct$($5494, _defs$2, Nat$succ$(_arity$3)), Fm$Term$expand_ct$($5495, _defs$2, 0n));
                var $5464 = $5496;
                break;
            case 'Fm.Term.let':
                var $5497 = self.name;
                var $5498 = self.expr;
                var $5499 = self.body;
                var $5500 = Fm$Term$let$($5497, Fm$Term$expand_ct$($5498, _defs$2, 0n), (_x$7 => {
                    var $5501 = Fm$Term$expand_ct$($5499(_x$7), _defs$2, 0n);
                    return $5501;
                }));
                var $5464 = $5500;
                break;
            case 'Fm.Term.def':
                var $5502 = self.name;
                var $5503 = self.expr;
                var $5504 = self.body;
                var $5505 = Fm$Term$def$($5502, Fm$Term$expand_ct$($5503, _defs$2, 0n), (_x$7 => {
                    var $5506 = Fm$Term$expand_ct$($5504(_x$7), _defs$2, 0n);
                    return $5506;
                }));
                var $5464 = $5505;
                break;
            case 'Fm.Term.ann':
                var $5507 = self.done;
                var $5508 = self.term;
                var $5509 = self.type;
                var $5510 = Fm$Term$ann$($5507, Fm$Term$expand_ct$($5508, _defs$2, 0n), Fm$Term$expand_ct$($5509, _defs$2, 0n));
                var $5464 = $5510;
                break;
            case 'Fm.Term.gol':
                var $5511 = self.name;
                var $5512 = self.dref;
                var $5513 = self.verb;
                var $5514 = Fm$Term$gol$($5511, $5512, $5513);
                var $5464 = $5514;
                break;
            case 'Fm.Term.hol':
                var $5515 = self.path;
                var $5516 = Fm$Term$hol$($5515);
                var $5464 = $5516;
                break;
            case 'Fm.Term.nat':
                var $5517 = self.natx;
                var $5518 = Fm$Term$nat$($5517);
                var $5464 = $5518;
                break;
            case 'Fm.Term.chr':
                var $5519 = self.chrx;
                var $5520 = Fm$Term$chr$($5519);
                var $5464 = $5520;
                break;
            case 'Fm.Term.str':
                var $5521 = self.strx;
                var $5522 = Fm$Term$str$($5521);
                var $5464 = $5522;
                break;
            case 'Fm.Term.cse':
                var $5523 = self.path;
                var $5524 = self.expr;
                var $5525 = self.name;
                var $5526 = self.with;
                var $5527 = self.cses;
                var $5528 = self.moti;
                var $5529 = _term$1;
                var $5464 = $5529;
                break;
            case 'Fm.Term.ori':
                var $5530 = self.orig;
                var $5531 = self.expr;
                var $5532 = Fm$Term$ori$($5530, $5531);
                var $5464 = $5532;
                break;
        };
        return $5464;
    };
    const Fm$Term$expand_ct = x0 => x1 => x2 => Fm$Term$expand_ct$(x0, x1, x2);

    function Fm$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Fm$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5535 = _term$4;
            var $5536 = _dref$1;
            let _term$6 = $5535;
            let _path$5;
            while ($5536._ === 'List.cons') {
                _path$5 = $5536.head;
                var _term$7 = Fm$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Fm$Term$normalize$(_term$7, Map$new);
                var _term$9 = Fm$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Fm$Term$normalize$(_term$9, Map$new);
                var $5535 = _term$10;
                _term$6 = $5535;
                $5536 = $5536.tail;
            }
            return _term$6;
        })();
        var $5533 = _term$5;
        return $5533;
    };
    const Fm$Term$expand = x0 => x1 => x2 => Fm$Term$expand$(x0, x1, x2);

    function Fm$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5538 = self.origin;
                var $5539 = self.expected;
                var $5540 = self.detected;
                var $5541 = self.context;
                var self = $5539;
                switch (self._) {
                    case 'Either.left':
                        var $5543 = self.value;
                        var $5544 = $5543;
                        var _expected$7 = $5544;
                        break;
                    case 'Either.right':
                        var $5545 = self.value;
                        var $5546 = Fm$Term$show$(Fm$Term$normalize$($5545, Map$new));
                        var _expected$7 = $5546;
                        break;
                };
                var self = $5540;
                switch (self._) {
                    case 'Either.left':
                        var $5547 = self.value;
                        var $5548 = $5547;
                        var _detected$8 = $5548;
                        break;
                    case 'Either.right':
                        var $5549 = self.value;
                        var $5550 = Fm$Term$show$(Fm$Term$normalize$($5549, Map$new));
                        var _detected$8 = $5550;
                        break;
                };
                var $5542 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5541;
                    switch (self._) {
                        case 'List.nil':
                            var $5551 = "";
                            return $5551;
                        case 'List.cons':
                            var $5552 = self.head;
                            var $5553 = self.tail;
                            var $5554 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Fm$Context$show$($5541), List$nil)));
                            return $5554;
                    };
                })(), List$nil)))))))));
                var $5537 = $5542;
                break;
            case 'Fm.Error.show_goal':
                var $5555 = self.name;
                var $5556 = self.dref;
                var $5557 = self.verb;
                var $5558 = self.goal;
                var $5559 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Fm$Name$show$($5555), List$cons$(":\u{a}", List$nil))));
                var self = $5558;
                switch (self._) {
                    case 'Maybe.none':
                        var $5561 = "";
                        var _with_type$9 = $5561;
                        break;
                    case 'Maybe.some':
                        var $5562 = self.value;
                        var _goal$10 = Fm$Term$expand$($5556, $5562, _defs$2);
                        var $5563 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5557;
                            if (self) {
                                var $5564 = Fm$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5565 = _x$11;
                                    return $5565;
                                })));
                                return $5564;
                            } else {
                                var $5566 = Fm$Term$show$(_goal$10);
                                return $5566;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5563;
                        break;
                };
                var self = $5559;
                switch (self._) {
                    case 'List.nil':
                        var $5567 = "";
                        var _with_ctxt$10 = $5567;
                        break;
                    case 'List.cons':
                        var $5568 = self.head;
                        var $5569 = self.tail;
                        var $5570 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Fm$Context$show$($5559), List$nil)));
                        var _with_ctxt$10 = $5570;
                        break;
                };
                var $5560 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5537 = $5560;
                break;
            case 'Fm.Error.waiting':
                var $5571 = self.name;
                var $5572 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5571, List$cons$("\'.", List$nil))));
                var $5537 = $5572;
                break;
            case 'Fm.Error.indirect':
                var $5573 = self.name;
                var $5574 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5573, List$cons$("\'.", List$nil))));
                var $5537 = $5574;
                break;
            case 'Fm.Error.patch':
                var $5575 = self.path;
                var $5576 = self.term;
                var $5577 = String$flatten$(List$cons$("Patching: ", List$cons$(Fm$Term$show$($5576), List$nil)));
                var $5537 = $5577;
                break;
            case 'Fm.Error.undefined_reference':
                var $5578 = self.origin;
                var $5579 = self.name;
                var $5580 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Fm$Name$show$($5579), List$cons$("\u{a}", List$nil))));
                var $5537 = $5580;
                break;
            case 'Fm.Error.cant_infer':
                var $5581 = self.origin;
                var $5582 = self.term;
                var $5583 = self.context;
                var _term$6 = Fm$Term$show$($5582);
                var _context$7 = Fm$Context$show$($5583);
                var $5584 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5537 = $5584;
                break;
        };
        return $5537;
    };
    const Fm$Error$show = x0 => x1 => Fm$Error$show$(x0, x1);

    function Fm$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5586 = self.origin;
                var $5587 = self.expected;
                var $5588 = self.detected;
                var $5589 = self.context;
                var $5590 = $5586;
                var $5585 = $5590;
                break;
            case 'Fm.Error.show_goal':
                var $5591 = self.name;
                var $5592 = self.dref;
                var $5593 = self.verb;
                var $5594 = self.goal;
                var $5595 = self.context;
                var $5596 = Maybe$none;
                var $5585 = $5596;
                break;
            case 'Fm.Error.waiting':
                var $5597 = self.name;
                var $5598 = Maybe$none;
                var $5585 = $5598;
                break;
            case 'Fm.Error.indirect':
                var $5599 = self.name;
                var $5600 = Maybe$none;
                var $5585 = $5600;
                break;
            case 'Fm.Error.patch':
                var $5601 = self.path;
                var $5602 = self.term;
                var $5603 = Maybe$none;
                var $5585 = $5603;
                break;
            case 'Fm.Error.undefined_reference':
                var $5604 = self.origin;
                var $5605 = self.name;
                var $5606 = $5604;
                var $5585 = $5606;
                break;
            case 'Fm.Error.cant_infer':
                var $5607 = self.origin;
                var $5608 = self.term;
                var $5609 = self.context;
                var $5610 = $5607;
                var $5585 = $5610;
                break;
        };
        return $5585;
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
                        var $5611 = String$flatten$(List$cons$(_typs$4, List$cons$("\u{a}", List$cons$((() => {
                            var self = _errs$3;
                            if (self.length === 0) {
                                var $5612 = "All terms check.";
                                return $5612;
                            } else {
                                var $5613 = self.charCodeAt(0);
                                var $5614 = self.slice(1);
                                var $5615 = _errs$3;
                                return $5615;
                            };
                        })(), List$nil))));
                        return $5611;
                    case 'List.cons':
                        var $5616 = self.head;
                        var $5617 = self.tail;
                        var _name$7 = $5616;
                        var self = Fm$get$(_name$7, _defs$1);
                        switch (self._) {
                            case 'Maybe.none':
                                var $5619 = Fm$Defs$report$go$(_defs$1, $5617, _errs$3, _typs$4);
                                var $5618 = $5619;
                                break;
                            case 'Maybe.some':
                                var $5620 = self.value;
                                var self = $5620;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $5622 = self.file;
                                        var $5623 = self.code;
                                        var $5624 = self.name;
                                        var $5625 = self.term;
                                        var $5626 = self.type;
                                        var $5627 = self.stat;
                                        var _typs$15 = String$flatten$(List$cons$(_typs$4, List$cons$(_name$7, List$cons$(": ", List$cons$(Fm$Term$show$($5626), List$cons$("\u{a}", List$nil))))));
                                        var self = $5627;
                                        switch (self._) {
                                            case 'Fm.Status.init':
                                                var $5629 = Fm$Defs$report$go$(_defs$1, $5617, _errs$3, _typs$15);
                                                var $5628 = $5629;
                                                break;
                                            case 'Fm.Status.wait':
                                                var $5630 = Fm$Defs$report$go$(_defs$1, $5617, _errs$3, _typs$15);
                                                var $5628 = $5630;
                                                break;
                                            case 'Fm.Status.done':
                                                var $5631 = Fm$Defs$report$go$(_defs$1, $5617, _errs$3, _typs$15);
                                                var $5628 = $5631;
                                                break;
                                            case 'Fm.Status.fail':
                                                var $5632 = self.errors;
                                                var self = $5632;
                                                switch (self._) {
                                                    case 'List.nil':
                                                        var $5634 = Fm$Defs$report$go$(_defs$1, $5617, _errs$3, _typs$15);
                                                        var $5633 = $5634;
                                                        break;
                                                    case 'List.cons':
                                                        var $5635 = self.head;
                                                        var $5636 = self.tail;
                                                        var _name_str$19 = Fm$Name$show$($5624);
                                                        var _rel_errs$20 = Fm$Error$relevant$($5632, Bool$false);
                                                        var _rel_msgs$21 = List$mapped$(_rel_errs$20, (_err$21 => {
                                                            var $5638 = String$flatten$(List$cons$(Fm$Error$show$(_err$21, _defs$1), List$cons$((() => {
                                                                var self = Fm$Error$origin$(_err$21);
                                                                switch (self._) {
                                                                    case 'Maybe.none':
                                                                        var $5639 = "";
                                                                        return $5639;
                                                                    case 'Maybe.some':
                                                                        var $5640 = self.value;
                                                                        var self = $5640;
                                                                        switch (self._) {
                                                                            case 'Fm.Origin.new':
                                                                                var $5642 = self.file;
                                                                                var $5643 = self.from;
                                                                                var $5644 = self.upto;
                                                                                var $5645 = String$flatten$(List$cons$("Inside \'", List$cons$($5622, List$cons$("\':\u{a}", List$cons$(Fm$highlight$($5623, $5643, $5644), List$cons$("\u{a}", List$nil))))));
                                                                                var $5641 = $5645;
                                                                                break;
                                                                        };
                                                                        return $5641;
                                                                };
                                                            })(), List$nil)));
                                                            return $5638;
                                                        }));
                                                        var _errs$22 = String$flatten$(List$cons$(_errs$3, List$cons$(String$join$("\u{a}", _rel_msgs$21), List$cons$("\u{a}", List$nil))));
                                                        var $5637 = Fm$Defs$report$go$(_defs$1, $5617, _errs$22, _typs$15);
                                                        var $5633 = $5637;
                                                        break;
                                                };
                                                var $5628 = $5633;
                                                break;
                                        };
                                        var $5621 = $5628;
                                        break;
                                };
                                var $5618 = $5621;
                                break;
                        };
                        return $5618;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Defs$report$go = x0 => x1 => x2 => x3 => Fm$Defs$report$go$(x0, x1, x2, x3);

    function Fm$Defs$report$(_defs$1, _list$2) {
        var $5646 = Fm$Defs$report$go$(_defs$1, _list$2, "", "");
        return $5646;
    };
    const Fm$Defs$report = x0 => x1 => Fm$Defs$report$(x0, x1);

    function Fm$checker$io$one$(_name$1) {
        var $5647 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $5648 = IO$print$(Fm$Defs$report$(_defs$2, List$cons$(_name$1, List$nil)));
            return $5648;
        }));
        return $5647;
    };
    const Fm$checker$io$one = x0 => Fm$checker$io$one$(x0);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $5650 = _list$4;
                var $5649 = $5650;
                break;
            case 'Map.tie':
                var $5651 = self.val;
                var $5652 = self.lft;
                var $5653 = self.rgt;
                var self = $5651;
                switch (self._) {
                    case 'Maybe.none':
                        var $5655 = _list$4;
                        var _list0$8 = $5655;
                        break;
                    case 'Maybe.some':
                        var $5656 = self.value;
                        var $5657 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5657;
                        break;
                };
                var _list1$9 = Map$keys$go$($5652, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5653, (_key$3 + '1'), _list1$9);
                var $5654 = _list2$10;
                var $5649 = $5654;
                break;
        };
        return $5649;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5658 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5658;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Fm$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.nil':
                var $5660 = Monad$pure$(IO$monad)(_defs$2);
                var $5659 = $5660;
                break;
            case 'List.cons':
                var $5661 = self.head;
                var $5662 = self.tail;
                var $5663 = Monad$bind$(IO$monad)(Fm$Synth$one$($5661, _defs$2))((_defs$5 => {
                    var $5664 = Fm$Synth$many$($5662, _defs$5);
                    return $5664;
                }));
                var $5659 = $5663;
                break;
        };
        return $5659;
    };
    const Fm$Synth$many = x0 => x1 => Fm$Synth$many$(x0, x1);

    function Fm$Synth$file$(_file$1, _defs$2) {
        var $5665 = Monad$bind$(IO$monad)(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Fm$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5667 = self.value;
                    var $5668 = Monad$pure$(IO$monad)(Either$left$($5667));
                    var $5666 = $5668;
                    break;
                case 'Either.right':
                    var $5669 = self.value;
                    var _file_defs$6 = $5669;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Fm$Name$from_bits);
                    var $5670 = Monad$bind$(IO$monad)(Fm$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5671 = Monad$pure$(IO$monad)(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5671;
                    }));
                    var $5666 = $5670;
                    break;
            };
            return $5666;
        }));
        return $5665;
    };
    const Fm$Synth$file = x0 => x1 => Fm$Synth$file$(x0, x1);

    function Fm$checker$io$file$(_file$1) {
        var $5672 = Monad$bind$(IO$monad)(Fm$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5674 = self.value;
                    var $5675 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5676 = IO$print$($5674);
                        return $5676;
                    }));
                    var $5673 = $5675;
                    break;
                case 'Either.right':
                    var $5677 = self.value;
                    var self = $5677;
                    switch (self._) {
                        case 'Pair.new':
                            var $5679 = self.fst;
                            var $5680 = self.snd;
                            var _nams$6 = $5679;
                            var _defs$7 = $5680;
                            var $5681 = IO$print$(Fm$Defs$report$(_defs$7, _nams$6));
                            var $5678 = $5681;
                            break;
                    };
                    var $5673 = $5678;
                    break;
            };
            return $5673;
        }));
        return $5672;
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
                        var $5682 = self.value;
                        var $5683 = $5682;
                        return $5683;
                    case 'IO.ask':
                        var $5684 = self.query;
                        var $5685 = self.param;
                        var $5686 = self.then;
                        var $5687 = IO$purify$($5686(""));
                        return $5687;
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
                var $5689 = self.value;
                var $5690 = $5689;
                var $5688 = $5690;
                break;
            case 'Either.right':
                var $5691 = self.value;
                var $5692 = IO$purify$((() => {
                    var _defs$3 = $5691;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Fm$Name$from_bits);
                    var $5693 = Monad$bind$(IO$monad)(Fm$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5694 = Monad$pure$(IO$monad)(Fm$Defs$report$(_defs$5, _nams$4));
                        return $5694;
                    }));
                    return $5693;
                })());
                var $5688 = $5692;
                break;
        };
        return $5688;
    };
    const Fm$checker$code = x0 => Fm$checker$code$(x0);

    function Fm$Term$read$(_code$1) {
        var self = Fm$Parser$term(0n)(_code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $5696 = self.idx;
                var $5697 = self.code;
                var $5698 = self.err;
                var $5699 = Maybe$none;
                var $5695 = $5699;
                break;
            case 'Parser.Reply.value':
                var $5700 = self.idx;
                var $5701 = self.code;
                var $5702 = self.val;
                var $5703 = Maybe$some$($5702);
                var $5695 = $5703;
                break;
        };
        return $5695;
    };
    const Fm$Term$read = x0 => Fm$Term$read$(x0);
    const Fm = (() => {
        var __$1 = Fm$to_core$io$one;
        var __$2 = Fm$checker$io$one;
        var __$3 = Fm$checker$io$file;
        var __$4 = Fm$checker$code;
        var __$5 = Fm$Term$read;
        var $5704 = Fm$checker$io$file$("Main.fm");
        return $5704;
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