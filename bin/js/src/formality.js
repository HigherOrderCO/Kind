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
                                console.log('File not found: "' + p.param + '"');
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
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Nat$mod$(_n$1, _m$2) {
        var Nat$mod$ = (_n$1, _m$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2]
        });
        var Nat$mod = _n$1 => _m$2 => Nat$mod$(_n$1, _m$2);
        var arg = [_n$1, _m$2];
        while (true) {
            let [_n$1, _m$2] = arg;
            var R = (() => {
                var self = (_n$1 < _m$2);
                if (self) {
                    var $1685 = _n$1;
                    return $1685;
                } else {
                    var $1686 = Nat$mod$((_n$1 - _m$2 <= 0n ? 0n : _n$1 - _m$2), _m$2);
                    return $1686;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
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
                    var $1689 = 35;
                    var $1688 = $1689;
                    break;
                case 'Maybe.some':
                    var $1690 = self.value;
                    var $1691 = $1690;
                    var $1688 = $1691;
                    break;
            };
            var $1687 = $1688;
        } else {
            var $1692 = 35;
            var $1687 = $1692;
        };
        return $1687;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $1693 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $1694 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $1694;
        }));
        return $1693;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $1695 = Nat$to_string_base$(10n, _n$1);
        return $1695;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Fm$color$(_col$1, _str$2) {
        var $1696 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $1696;
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
                    var $1697 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    return $1697;
                } else {
                    var $1698 = self.charCodeAt(0);
                    var $1699 = self.slice(1);
                    var self = ($1698 === 10);
                    if (self) {
                        var _stp$11 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$11;
                        if (self) {
                            var $1702 = Fm$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $1701 = $1702;
                        } else {
                            var _spa$12 = 3n;
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$12));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $1705 = Maybe$some$(_spa$12);
                                        var $1704 = $1705;
                                        break;
                                    case 'Maybe.some':
                                        var $1706 = self.value;
                                        var $1707 = Maybe$some$(Nat$pred$($1706));
                                        var $1704 = $1707;
                                        break;
                                };
                                var _lft$14 = $1704;
                            } else {
                                var $1708 = (self - 1n);
                                var $1709 = _lft$6;
                                var _lft$14 = $1709;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$take$(_siz$13, List$cons$(String$reverse$(_lin$7), _res$8));
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $1703 = Fm$highlight$tc$($1699, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $1701 = $1703;
                        };
                        var $1700 = $1701;
                    } else {
                        var _chr$11 = String$cons$($1698, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $1711 = String$reverse$(Fm$color$("31", Fm$color$("4", _chr$11)));
                            var _chr$12 = $1711;
                        } else {
                            var $1712 = _chr$11;
                            var _chr$12 = $1712;
                        };
                        var _ix0$13 = Nat$pred$(_ix0$2);
                        var _ix1$14 = Nat$pred$(_ix1$3);
                        var _col$15 = Nat$succ$(_col$4);
                        var _lin$16 = String$flatten$(List$cons$(_chr$12, List$cons$(_lin$7, List$nil)));
                        var $1710 = Fm$highlight$tc$($1699, _ix0$13, _ix1$14, _col$15, _row$5, _lft$6, _lin$16, _res$8);
                        var $1700 = $1710;
                    };
                    return $1700;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $1713 = Fm$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $1713;
    };
    const Fm$highlight = x0 => x1 => x2 => Fm$highlight$(x0, x1, x2);

    function Fm$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Fm$Parser$file$(_file$1, _code$2, _defs$3)(0n)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1715 = self.idx;
                var $1716 = self.code;
                var $1717 = self.err;
                var _err$7 = $1717;
                var _hig$8 = Fm$highlight$(_code$2, $1715, Nat$succ$($1715));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $1718 = Either$left$(_str$9);
                var $1714 = $1718;
                break;
            case 'Parser.Reply.value':
                var $1719 = self.idx;
                var $1720 = self.code;
                var $1721 = self.val;
                var $1722 = Either$right$($1721);
                var $1714 = $1722;
                break;
        };
        return $1714;
    };
    const Fm$Defs$read = x0 => x1 => x2 => Fm$Defs$read$(x0, x1, x2);

    function Fm$Synth$load$(_name$1, _defs$2) {
        var _file$3 = Fm$Synth$file_of$(_name$1);
        var $1723 = Monad$bind$(IO$monad)(IO$get_file$(_file$3))((_code$4 => {
            var _read$5 = Fm$Defs$read$(_file$3, _code$4, _defs$2);
            var self = _read$5;
            switch (self._) {
                case 'Either.left':
                    var $1725 = self.value;
                    var $1726 = Monad$pure$(IO$monad)(Maybe$none);
                    var $1724 = $1726;
                    break;
                case 'Either.right':
                    var $1727 = self.value;
                    var _defs$7 = $1727;
                    var self = Fm$get$(_name$1, _defs$7);
                    switch (self._) {
                        case 'Maybe.none':
                            var $1729 = Monad$pure$(IO$monad)(Maybe$none);
                            var $1728 = $1729;
                            break;
                        case 'Maybe.some':
                            var $1730 = self.value;
                            var $1731 = Monad$pure$(IO$monad)(Maybe$some$(_defs$7));
                            var $1728 = $1731;
                            break;
                    };
                    var $1724 = $1728;
                    break;
            };
            return $1724;
        }));
        return $1723;
    };
    const Fm$Synth$load = x0 => x1 => Fm$Synth$load$(x0, x1);

    function IO$print$(_text$1) {
        var $1732 = IO$ask$("print", _text$1, (_skip$2 => {
            var $1733 = IO$end$(Unit$new);
            return $1733;
        }));
        return $1732;
    };
    const IO$print = x0 => IO$print$(x0);
    const Fm$Status$wait = ({
        _: 'Fm.Status.wait'
    });

    function Fm$Check$(_V$1) {
        var $1734 = null;
        return $1734;
    };
    const Fm$Check = x0 => Fm$Check$(x0);

    function Fm$Check$result$(_value$2, _errors$3) {
        var $1735 = ({
            _: 'Fm.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $1735;
    };
    const Fm$Check$result = x0 => x1 => Fm$Check$result$(x0, x1);

    function Fm$Check$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'Fm.Check.result':
                var $1737 = self.value;
                var $1738 = self.errors;
                var self = $1737;
                switch (self._) {
                    case 'Maybe.none':
                        var $1740 = Fm$Check$result$(Maybe$none, $1738);
                        var $1739 = $1740;
                        break;
                    case 'Maybe.some':
                        var $1741 = self.value;
                        var self = _f$4($1741);
                        switch (self._) {
                            case 'Fm.Check.result':
                                var $1743 = self.value;
                                var $1744 = self.errors;
                                var $1745 = Fm$Check$result$($1743, List$concat$($1738, $1744));
                                var $1742 = $1745;
                                break;
                        };
                        var $1739 = $1742;
                        break;
                };
                var $1736 = $1739;
                break;
        };
        return $1736;
    };
    const Fm$Check$bind = x0 => x1 => Fm$Check$bind$(x0, x1);

    function Fm$Check$pure$(_value$2) {
        var $1746 = Fm$Check$result$(Maybe$some$(_value$2), List$nil);
        return $1746;
    };
    const Fm$Check$pure = x0 => Fm$Check$pure$(x0);
    const Fm$Check$monad = Monad$new$(Fm$Check$bind, Fm$Check$pure);

    function Fm$Error$undefined_reference$(_origin$1, _name$2) {
        var $1747 = ({
            _: 'Fm.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $1747;
    };
    const Fm$Error$undefined_reference = x0 => x1 => Fm$Error$undefined_reference$(x0, x1);

    function Fm$Error$waiting$(_name$1) {
        var $1748 = ({
            _: 'Fm.Error.waiting',
            'name': _name$1
        });
        return $1748;
    };
    const Fm$Error$waiting = x0 => Fm$Error$waiting$(x0);

    function Fm$Error$indirect$(_name$1) {
        var $1749 = ({
            _: 'Fm.Error.indirect',
            'name': _name$1
        });
        return $1749;
    };
    const Fm$Error$indirect = x0 => Fm$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $1751 = Maybe$none;
                var $1750 = $1751;
                break;
            case 'Maybe.some':
                var $1752 = self.value;
                var $1753 = Maybe$some$(_f$4($1752));
                var $1750 = $1753;
                break;
        };
        return $1750;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Fm$MPath$o$(_path$1) {
        var $1754 = Maybe$mapped$(_path$1, Fm$Path$o);
        return $1754;
    };
    const Fm$MPath$o = x0 => Fm$MPath$o$(x0);

    function Fm$MPath$i$(_path$1) {
        var $1755 = Maybe$mapped$(_path$1, Fm$Path$i);
        return $1755;
    };
    const Fm$MPath$i = x0 => Fm$MPath$i$(x0);

    function Fm$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $1756 = ({
            _: 'Fm.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $1756;
    };
    const Fm$Error$cant_infer = x0 => x1 => x2 => Fm$Error$cant_infer$(x0, x1, x2);

    function Fm$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $1757 = ({
            _: 'Fm.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $1757;
    };
    const Fm$Error$type_mismatch = x0 => x1 => x2 => x3 => Fm$Error$type_mismatch$(x0, x1, x2, x3);

    function Fm$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $1758 = ({
            _: 'Fm.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $1758;
    };
    const Fm$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Fm$Error$show_goal$(x0, x1, x2, x3, x4);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.nil':
                var $1760 = List$nil;
                var $1759 = $1760;
                break;
            case 'List.cons':
                var $1761 = self.head;
                var $1762 = self.tail;
                var $1763 = $1762;
                var $1759 = $1763;
                break;
        };
        return $1759;
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
                        var $1764 = self.name;
                        var $1765 = self.indx;
                        var $1766 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1766;
                    case 'Fm.Term.ref':
                        var $1767 = self.name;
                        var $1768 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1768;
                    case 'Fm.Term.typ':
                        var $1769 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1769;
                    case 'Fm.Term.all':
                        var $1770 = self.eras;
                        var $1771 = self.self;
                        var $1772 = self.name;
                        var $1773 = self.xtyp;
                        var $1774 = self.body;
                        var $1775 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1775;
                    case 'Fm.Term.lam':
                        var $1776 = self.name;
                        var $1777 = self.body;
                        var $1778 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1778;
                    case 'Fm.Term.app':
                        var $1779 = self.func;
                        var $1780 = self.argm;
                        var $1781 = Fm$SmartMotive$vals$cont$(_expr$1, $1779, List$cons$($1780, _args$3), _defs$4);
                        return $1781;
                    case 'Fm.Term.let':
                        var $1782 = self.name;
                        var $1783 = self.expr;
                        var $1784 = self.body;
                        var $1785 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1785;
                    case 'Fm.Term.def':
                        var $1786 = self.name;
                        var $1787 = self.expr;
                        var $1788 = self.body;
                        var $1789 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1789;
                    case 'Fm.Term.ann':
                        var $1790 = self.done;
                        var $1791 = self.term;
                        var $1792 = self.type;
                        var $1793 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1793;
                    case 'Fm.Term.gol':
                        var $1794 = self.name;
                        var $1795 = self.dref;
                        var $1796 = self.verb;
                        var $1797 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1797;
                    case 'Fm.Term.hol':
                        var $1798 = self.path;
                        var $1799 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1799;
                    case 'Fm.Term.nat':
                        var $1800 = self.natx;
                        var $1801 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1801;
                    case 'Fm.Term.chr':
                        var $1802 = self.chrx;
                        var $1803 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1803;
                    case 'Fm.Term.str':
                        var $1804 = self.strx;
                        var $1805 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1805;
                    case 'Fm.Term.cse':
                        var $1806 = self.path;
                        var $1807 = self.expr;
                        var $1808 = self.name;
                        var $1809 = self.with;
                        var $1810 = self.cses;
                        var $1811 = self.moti;
                        var $1812 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1812;
                    case 'Fm.Term.ori':
                        var $1813 = self.orig;
                        var $1814 = self.expr;
                        var $1815 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $1815;
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
                        var $1816 = self.name;
                        var $1817 = self.indx;
                        var $1818 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1818;
                    case 'Fm.Term.ref':
                        var $1819 = self.name;
                        var $1820 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1820;
                    case 'Fm.Term.typ':
                        var $1821 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1821;
                    case 'Fm.Term.all':
                        var $1822 = self.eras;
                        var $1823 = self.self;
                        var $1824 = self.name;
                        var $1825 = self.xtyp;
                        var $1826 = self.body;
                        var $1827 = Fm$SmartMotive$vals$(_expr$1, $1826(Fm$Term$typ)(Fm$Term$typ), _defs$3);
                        return $1827;
                    case 'Fm.Term.lam':
                        var $1828 = self.name;
                        var $1829 = self.body;
                        var $1830 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1830;
                    case 'Fm.Term.app':
                        var $1831 = self.func;
                        var $1832 = self.argm;
                        var $1833 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1833;
                    case 'Fm.Term.let':
                        var $1834 = self.name;
                        var $1835 = self.expr;
                        var $1836 = self.body;
                        var $1837 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1837;
                    case 'Fm.Term.def':
                        var $1838 = self.name;
                        var $1839 = self.expr;
                        var $1840 = self.body;
                        var $1841 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1841;
                    case 'Fm.Term.ann':
                        var $1842 = self.done;
                        var $1843 = self.term;
                        var $1844 = self.type;
                        var $1845 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1845;
                    case 'Fm.Term.gol':
                        var $1846 = self.name;
                        var $1847 = self.dref;
                        var $1848 = self.verb;
                        var $1849 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1849;
                    case 'Fm.Term.hol':
                        var $1850 = self.path;
                        var $1851 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1851;
                    case 'Fm.Term.nat':
                        var $1852 = self.natx;
                        var $1853 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1853;
                    case 'Fm.Term.chr':
                        var $1854 = self.chrx;
                        var $1855 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1855;
                    case 'Fm.Term.str':
                        var $1856 = self.strx;
                        var $1857 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1857;
                    case 'Fm.Term.cse':
                        var $1858 = self.path;
                        var $1859 = self.expr;
                        var $1860 = self.name;
                        var $1861 = self.with;
                        var $1862 = self.cses;
                        var $1863 = self.moti;
                        var $1864 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1864;
                    case 'Fm.Term.ori':
                        var $1865 = self.orig;
                        var $1866 = self.expr;
                        var $1867 = Fm$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $1867;
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
                        var $1868 = self.name;
                        var $1869 = self.indx;
                        var $1870 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1870;
                    case 'Fm.Term.ref':
                        var $1871 = self.name;
                        var $1872 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1872;
                    case 'Fm.Term.typ':
                        var $1873 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1873;
                    case 'Fm.Term.all':
                        var $1874 = self.eras;
                        var $1875 = self.self;
                        var $1876 = self.name;
                        var $1877 = self.xtyp;
                        var $1878 = self.body;
                        var $1879 = Fm$SmartMotive$nams$cont$(_name$1, $1878(Fm$Term$ref$($1875))(Fm$Term$ref$($1876)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($1876, List$nil)))), _binds$3), _defs$4);
                        return $1879;
                    case 'Fm.Term.lam':
                        var $1880 = self.name;
                        var $1881 = self.body;
                        var $1882 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1882;
                    case 'Fm.Term.app':
                        var $1883 = self.func;
                        var $1884 = self.argm;
                        var $1885 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1885;
                    case 'Fm.Term.let':
                        var $1886 = self.name;
                        var $1887 = self.expr;
                        var $1888 = self.body;
                        var $1889 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1889;
                    case 'Fm.Term.def':
                        var $1890 = self.name;
                        var $1891 = self.expr;
                        var $1892 = self.body;
                        var $1893 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1893;
                    case 'Fm.Term.ann':
                        var $1894 = self.done;
                        var $1895 = self.term;
                        var $1896 = self.type;
                        var $1897 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1897;
                    case 'Fm.Term.gol':
                        var $1898 = self.name;
                        var $1899 = self.dref;
                        var $1900 = self.verb;
                        var $1901 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1901;
                    case 'Fm.Term.hol':
                        var $1902 = self.path;
                        var $1903 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1903;
                    case 'Fm.Term.nat':
                        var $1904 = self.natx;
                        var $1905 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1905;
                    case 'Fm.Term.chr':
                        var $1906 = self.chrx;
                        var $1907 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1907;
                    case 'Fm.Term.str':
                        var $1908 = self.strx;
                        var $1909 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1909;
                    case 'Fm.Term.cse':
                        var $1910 = self.path;
                        var $1911 = self.expr;
                        var $1912 = self.name;
                        var $1913 = self.with;
                        var $1914 = self.cses;
                        var $1915 = self.moti;
                        var $1916 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1916;
                    case 'Fm.Term.ori':
                        var $1917 = self.orig;
                        var $1918 = self.expr;
                        var $1919 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $1919;
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
                var $1921 = self.name;
                var $1922 = self.indx;
                var $1923 = List$nil;
                var $1920 = $1923;
                break;
            case 'Fm.Term.ref':
                var $1924 = self.name;
                var $1925 = List$nil;
                var $1920 = $1925;
                break;
            case 'Fm.Term.typ':
                var $1926 = List$nil;
                var $1920 = $1926;
                break;
            case 'Fm.Term.all':
                var $1927 = self.eras;
                var $1928 = self.self;
                var $1929 = self.name;
                var $1930 = self.xtyp;
                var $1931 = self.body;
                var $1932 = Fm$SmartMotive$nams$cont$(_name$1, $1930, List$nil, _defs$3);
                var $1920 = $1932;
                break;
            case 'Fm.Term.lam':
                var $1933 = self.name;
                var $1934 = self.body;
                var $1935 = List$nil;
                var $1920 = $1935;
                break;
            case 'Fm.Term.app':
                var $1936 = self.func;
                var $1937 = self.argm;
                var $1938 = List$nil;
                var $1920 = $1938;
                break;
            case 'Fm.Term.let':
                var $1939 = self.name;
                var $1940 = self.expr;
                var $1941 = self.body;
                var $1942 = List$nil;
                var $1920 = $1942;
                break;
            case 'Fm.Term.def':
                var $1943 = self.name;
                var $1944 = self.expr;
                var $1945 = self.body;
                var $1946 = List$nil;
                var $1920 = $1946;
                break;
            case 'Fm.Term.ann':
                var $1947 = self.done;
                var $1948 = self.term;
                var $1949 = self.type;
                var $1950 = List$nil;
                var $1920 = $1950;
                break;
            case 'Fm.Term.gol':
                var $1951 = self.name;
                var $1952 = self.dref;
                var $1953 = self.verb;
                var $1954 = List$nil;
                var $1920 = $1954;
                break;
            case 'Fm.Term.hol':
                var $1955 = self.path;
                var $1956 = List$nil;
                var $1920 = $1956;
                break;
            case 'Fm.Term.nat':
                var $1957 = self.natx;
                var $1958 = List$nil;
                var $1920 = $1958;
                break;
            case 'Fm.Term.chr':
                var $1959 = self.chrx;
                var $1960 = List$nil;
                var $1920 = $1960;
                break;
            case 'Fm.Term.str':
                var $1961 = self.strx;
                var $1962 = List$nil;
                var $1920 = $1962;
                break;
            case 'Fm.Term.cse':
                var $1963 = self.path;
                var $1964 = self.expr;
                var $1965 = self.name;
                var $1966 = self.with;
                var $1967 = self.cses;
                var $1968 = self.moti;
                var $1969 = List$nil;
                var $1920 = $1969;
                break;
            case 'Fm.Term.ori':
                var $1970 = self.orig;
                var $1971 = self.expr;
                var $1972 = List$nil;
                var $1920 = $1972;
                break;
        };
        return $1920;
    };
    const Fm$SmartMotive$nams = x0 => x1 => x2 => Fm$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.nil':
                var $1974 = List$nil;
                var $1973 = $1974;
                break;
            case 'List.cons':
                var $1975 = self.head;
                var $1976 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.nil':
                        var $1978 = List$nil;
                        var $1977 = $1978;
                        break;
                    case 'List.cons':
                        var $1979 = self.head;
                        var $1980 = self.tail;
                        var $1981 = List$cons$(Pair$new$($1975, $1979), List$zip$($1976, $1980));
                        var $1977 = $1981;
                        break;
                };
                var $1973 = $1977;
                break;
        };
        return $1973;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);

    function Fm$Term$serialize$name$(_name$1) {
        var $1982 = (fm_name_to_bits(_name$1));
        return $1982;
    };
    const Fm$Term$serialize$name = x0 => Fm$Term$serialize$name$(x0);

    function Fm$Term$serialize$(_term$1, _depth$2, _init$3, _x$4) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $1984 = self.name;
                var $1985 = self.indx;
                var self = ($1985 >= _init$3);
                if (self) {
                    var _name$7 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $1985 <= 0n ? 0n : _depth$2 - $1985)))));
                    var $1987 = (((_name$7(_x$4) + '1') + '0') + '0');
                    var $1986 = $1987;
                } else {
                    var _name$7 = a1 => (a1 + (nat_to_bits($1985)));
                    var $1988 = (((_name$7(_x$4) + '0') + '1') + '0');
                    var $1986 = $1988;
                };
                var $1983 = $1986;
                break;
            case 'Fm.Term.ref':
                var $1989 = self.name;
                var _name$6 = a1 => (a1 + Fm$Term$serialize$name$($1989));
                var $1990 = (((_name$6(_x$4) + '0') + '0') + '0');
                var $1983 = $1990;
                break;
            case 'Fm.Term.typ':
                var $1991 = (((_x$4 + '1') + '1') + '0');
                var $1983 = $1991;
                break;
            case 'Fm.Term.all':
                var $1992 = self.eras;
                var $1993 = self.self;
                var $1994 = self.name;
                var $1995 = self.xtyp;
                var $1996 = self.body;
                var self = $1992;
                if (self) {
                    var $1998 = Bits$i;
                    var _eras$10 = $1998;
                } else {
                    var $1999 = Bits$o;
                    var _eras$10 = $1999;
                };
                var _self$11 = a1 => (a1 + (fm_name_to_bits($1993)));
                var _xtyp$12 = Fm$Term$serialize($1995)(_depth$2)(_init$3);
                var _body$13 = Fm$Term$serialize($1996(Fm$Term$var$($1993, _depth$2))(Fm$Term$var$($1994, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3);
                var $1997 = (((_eras$10(_self$11(_xtyp$12(_body$13(_x$4)))) + '0') + '0') + '1');
                var $1983 = $1997;
                break;
            case 'Fm.Term.lam':
                var $2000 = self.name;
                var $2001 = self.body;
                var _body$7 = Fm$Term$serialize($2001(Fm$Term$var$($2000, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2002 = (((_body$7(_x$4) + '1') + '0') + '1');
                var $1983 = $2002;
                break;
            case 'Fm.Term.app':
                var $2003 = self.func;
                var $2004 = self.argm;
                var _func$7 = Fm$Term$serialize($2003)(_depth$2)(_init$3);
                var _argm$8 = Fm$Term$serialize($2004)(_depth$2)(_init$3);
                var $2005 = (((_func$7(_argm$8(_x$4)) + '0') + '1') + '1');
                var $1983 = $2005;
                break;
            case 'Fm.Term.let':
                var $2006 = self.name;
                var $2007 = self.expr;
                var $2008 = self.body;
                var _expr$8 = Fm$Term$serialize($2007)(_depth$2)(_init$3);
                var _body$9 = Fm$Term$serialize($2008(Fm$Term$var$($2006, _depth$2)))(Nat$succ$(_depth$2))(_init$3);
                var $2009 = (((_expr$8(_body$9(_x$4)) + '1') + '1') + '1');
                var $1983 = $2009;
                break;
            case 'Fm.Term.def':
                var $2010 = self.name;
                var $2011 = self.expr;
                var $2012 = self.body;
                var $2013 = Fm$Term$serialize$($2012($2011), _depth$2, _init$3, _x$4);
                var $1983 = $2013;
                break;
            case 'Fm.Term.ann':
                var $2014 = self.done;
                var $2015 = self.term;
                var $2016 = self.type;
                var $2017 = Fm$Term$serialize$($2015, _depth$2, _init$3, _x$4);
                var $1983 = $2017;
                break;
            case 'Fm.Term.gol':
                var $2018 = self.name;
                var $2019 = self.dref;
                var $2020 = self.verb;
                var _name$8 = a1 => (a1 + (fm_name_to_bits($2018)));
                var $2021 = (((_name$8(_x$4) + '0') + '0') + '0');
                var $1983 = $2021;
                break;
            case 'Fm.Term.hol':
                var $2022 = self.path;
                var $2023 = _x$4;
                var $1983 = $2023;
                break;
            case 'Fm.Term.nat':
                var $2024 = self.natx;
                var $2025 = Fm$Term$serialize$(Fm$Term$unroll_nat$($2024), _depth$2, _init$3, _x$4);
                var $1983 = $2025;
                break;
            case 'Fm.Term.chr':
                var $2026 = self.chrx;
                var $2027 = Fm$Term$serialize$(Fm$Term$unroll_chr$($2026), _depth$2, _init$3, _x$4);
                var $1983 = $2027;
                break;
            case 'Fm.Term.str':
                var $2028 = self.strx;
                var $2029 = Fm$Term$serialize$(Fm$Term$unroll_str$($2028), _depth$2, _init$3, _x$4);
                var $1983 = $2029;
                break;
            case 'Fm.Term.cse':
                var $2030 = self.path;
                var $2031 = self.expr;
                var $2032 = self.name;
                var $2033 = self.with;
                var $2034 = self.cses;
                var $2035 = self.moti;
                var $2036 = _x$4;
                var $1983 = $2036;
                break;
            case 'Fm.Term.ori':
                var $2037 = self.orig;
                var $2038 = self.expr;
                var $2039 = Fm$Term$serialize$($2038, _depth$2, _init$3, _x$4);
                var $1983 = $2039;
                break;
        };
        return $1983;
    };
    const Fm$Term$serialize = x0 => x1 => x2 => x3 => Fm$Term$serialize$(x0, x1, x2, x3);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Fm$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Fm$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$e);
        var _bh$5 = Fm$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$e);
        var $2040 = (_bh$5 === _ah$4);
        return $2040;
    };
    const Fm$Term$identical = x0 => x1 => x2 => Fm$Term$identical$(x0, x1, x2);

    function Fm$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Fm$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $2042 = _to$3;
            var $2041 = $2042;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $2044 = self.name;
                    var $2045 = self.indx;
                    var $2046 = Fm$Term$var$($2044, $2045);
                    var $2043 = $2046;
                    break;
                case 'Fm.Term.ref':
                    var $2047 = self.name;
                    var $2048 = Fm$Term$ref$($2047);
                    var $2043 = $2048;
                    break;
                case 'Fm.Term.typ':
                    var $2049 = Fm$Term$typ;
                    var $2043 = $2049;
                    break;
                case 'Fm.Term.all':
                    var $2050 = self.eras;
                    var $2051 = self.self;
                    var $2052 = self.name;
                    var $2053 = self.xtyp;
                    var $2054 = self.body;
                    var _xtyp$10 = Fm$SmartMotive$replace$($2053, _from$2, _to$3, _lv$4);
                    var _body$11 = $2054(Fm$Term$ref$($2051))(Fm$Term$ref$($2052));
                    var _body$12 = Fm$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $2055 = Fm$Term$all$($2050, $2051, $2052, _xtyp$10, (_s$13 => _x$14 => {
                        var $2056 = _body$12;
                        return $2056;
                    }));
                    var $2043 = $2055;
                    break;
                case 'Fm.Term.lam':
                    var $2057 = self.name;
                    var $2058 = self.body;
                    var _body$7 = $2058(Fm$Term$ref$($2057));
                    var _body$8 = Fm$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2059 = Fm$Term$lam$($2057, (_x$9 => {
                        var $2060 = _body$8;
                        return $2060;
                    }));
                    var $2043 = $2059;
                    break;
                case 'Fm.Term.app':
                    var $2061 = self.func;
                    var $2062 = self.argm;
                    var _func$7 = Fm$SmartMotive$replace$($2061, _from$2, _to$3, _lv$4);
                    var _argm$8 = Fm$SmartMotive$replace$($2062, _from$2, _to$3, _lv$4);
                    var $2063 = Fm$Term$app$(_func$7, _argm$8);
                    var $2043 = $2063;
                    break;
                case 'Fm.Term.let':
                    var $2064 = self.name;
                    var $2065 = self.expr;
                    var $2066 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2065, _from$2, _to$3, _lv$4);
                    var _body$9 = $2066(Fm$Term$ref$($2064));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2067 = Fm$Term$let$($2064, _expr$8, (_x$11 => {
                        var $2068 = _body$10;
                        return $2068;
                    }));
                    var $2043 = $2067;
                    break;
                case 'Fm.Term.def':
                    var $2069 = self.name;
                    var $2070 = self.expr;
                    var $2071 = self.body;
                    var _expr$8 = Fm$SmartMotive$replace$($2070, _from$2, _to$3, _lv$4);
                    var _body$9 = $2071(Fm$Term$ref$($2069));
                    var _body$10 = Fm$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $2072 = Fm$Term$def$($2069, _expr$8, (_x$11 => {
                        var $2073 = _body$10;
                        return $2073;
                    }));
                    var $2043 = $2072;
                    break;
                case 'Fm.Term.ann':
                    var $2074 = self.done;
                    var $2075 = self.term;
                    var $2076 = self.type;
                    var _term$8 = Fm$SmartMotive$replace$($2075, _from$2, _to$3, _lv$4);
                    var _type$9 = Fm$SmartMotive$replace$($2076, _from$2, _to$3, _lv$4);
                    var $2077 = Fm$Term$ann$($2074, _term$8, _type$9);
                    var $2043 = $2077;
                    break;
                case 'Fm.Term.gol':
                    var $2078 = self.name;
                    var $2079 = self.dref;
                    var $2080 = self.verb;
                    var $2081 = _term$1;
                    var $2043 = $2081;
                    break;
                case 'Fm.Term.hol':
                    var $2082 = self.path;
                    var $2083 = _term$1;
                    var $2043 = $2083;
                    break;
                case 'Fm.Term.nat':
                    var $2084 = self.natx;
                    var $2085 = _term$1;
                    var $2043 = $2085;
                    break;
                case 'Fm.Term.chr':
                    var $2086 = self.chrx;
                    var $2087 = _term$1;
                    var $2043 = $2087;
                    break;
                case 'Fm.Term.str':
                    var $2088 = self.strx;
                    var $2089 = _term$1;
                    var $2043 = $2089;
                    break;
                case 'Fm.Term.cse':
                    var $2090 = self.path;
                    var $2091 = self.expr;
                    var $2092 = self.name;
                    var $2093 = self.with;
                    var $2094 = self.cses;
                    var $2095 = self.moti;
                    var $2096 = _term$1;
                    var $2043 = $2096;
                    break;
                case 'Fm.Term.ori':
                    var $2097 = self.orig;
                    var $2098 = self.expr;
                    var $2099 = Fm$SmartMotive$replace$($2098, _from$2, _to$3, _lv$4);
                    var $2043 = $2099;
                    break;
            };
            var $2041 = $2043;
        };
        return $2041;
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
                    var $2102 = self.fst;
                    var $2103 = self.snd;
                    var $2104 = Fm$SmartMotive$replace$(_moti$11, $2103, Fm$Term$ref$($2102), _lv$5);
                    var $2101 = $2104;
                    break;
            };
            return $2101;
        }));
        var $2100 = _moti$10;
        return $2100;
    };
    const Fm$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Fm$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Fm$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.nil':
                var $2106 = _moti$2;
                var $2105 = $2106;
                break;
            case 'List.cons':
                var $2107 = self.head;
                var $2108 = self.tail;
                var self = $2107;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $2110 = self.file;
                        var $2111 = self.code;
                        var $2112 = self.name;
                        var $2113 = self.term;
                        var $2114 = self.type;
                        var $2115 = self.stat;
                        var $2116 = Fm$Term$all$(Bool$false, "", $2112, $2114, (_s$11 => _x$12 => {
                            var $2117 = Fm$Term$desugar_cse$motive$($2108, _moti$2);
                            return $2117;
                        }));
                        var $2109 = $2116;
                        break;
                };
                var $2105 = $2109;
                break;
        };
        return $2105;
    };
    const Fm$Term$desugar_cse$motive = x0 => x1 => Fm$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $2119 = Bool$true;
            var $2118 = $2119;
        } else {
            var $2120 = self.charCodeAt(0);
            var $2121 = self.slice(1);
            var $2122 = Bool$false;
            var $2118 = $2122;
        };
        return $2118;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Fm$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Fm.Term.var':
                var $2124 = self.name;
                var $2125 = self.indx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2127 = _body$4;
                        var $2126 = $2127;
                        break;
                    case 'List.cons':
                        var $2128 = self.head;
                        var $2129 = self.tail;
                        var self = $2128;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2131 = self.file;
                                var $2132 = self.code;
                                var $2133 = self.name;
                                var $2134 = self.term;
                                var $2135 = self.type;
                                var $2136 = self.stat;
                                var $2137 = Fm$Term$lam$($2133, (_x$16 => {
                                    var $2138 = Fm$Term$desugar_cse$argument$(_name$1, $2129, _type$3, _body$4, _defs$5);
                                    return $2138;
                                }));
                                var $2130 = $2137;
                                break;
                        };
                        var $2126 = $2130;
                        break;
                };
                var $2123 = $2126;
                break;
            case 'Fm.Term.ref':
                var $2139 = self.name;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2141 = _body$4;
                        var $2140 = $2141;
                        break;
                    case 'List.cons':
                        var $2142 = self.head;
                        var $2143 = self.tail;
                        var self = $2142;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2145 = self.file;
                                var $2146 = self.code;
                                var $2147 = self.name;
                                var $2148 = self.term;
                                var $2149 = self.type;
                                var $2150 = self.stat;
                                var $2151 = Fm$Term$lam$($2147, (_x$15 => {
                                    var $2152 = Fm$Term$desugar_cse$argument$(_name$1, $2143, _type$3, _body$4, _defs$5);
                                    return $2152;
                                }));
                                var $2144 = $2151;
                                break;
                        };
                        var $2140 = $2144;
                        break;
                };
                var $2123 = $2140;
                break;
            case 'Fm.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2154 = _body$4;
                        var $2153 = $2154;
                        break;
                    case 'List.cons':
                        var $2155 = self.head;
                        var $2156 = self.tail;
                        var self = $2155;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2158 = self.file;
                                var $2159 = self.code;
                                var $2160 = self.name;
                                var $2161 = self.term;
                                var $2162 = self.type;
                                var $2163 = self.stat;
                                var $2164 = Fm$Term$lam$($2160, (_x$14 => {
                                    var $2165 = Fm$Term$desugar_cse$argument$(_name$1, $2156, _type$3, _body$4, _defs$5);
                                    return $2165;
                                }));
                                var $2157 = $2164;
                                break;
                        };
                        var $2153 = $2157;
                        break;
                };
                var $2123 = $2153;
                break;
            case 'Fm.Term.all':
                var $2166 = self.eras;
                var $2167 = self.self;
                var $2168 = self.name;
                var $2169 = self.xtyp;
                var $2170 = self.body;
                var $2171 = Fm$Term$lam$((() => {
                    var self = String$is_empty$($2168);
                    if (self) {
                        var $2172 = _name$1;
                        return $2172;
                    } else {
                        var $2173 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($2168, List$nil))));
                        return $2173;
                    };
                })(), (_x$11 => {
                    var $2174 = Fm$Term$desugar_cse$argument$(_name$1, _wyth$2, $2170(Fm$Term$var$($2167, 0n))(Fm$Term$var$($2168, 0n)), _body$4, _defs$5);
                    return $2174;
                }));
                var $2123 = $2171;
                break;
            case 'Fm.Term.lam':
                var $2175 = self.name;
                var $2176 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2178 = _body$4;
                        var $2177 = $2178;
                        break;
                    case 'List.cons':
                        var $2179 = self.head;
                        var $2180 = self.tail;
                        var self = $2179;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2182 = self.file;
                                var $2183 = self.code;
                                var $2184 = self.name;
                                var $2185 = self.term;
                                var $2186 = self.type;
                                var $2187 = self.stat;
                                var $2188 = Fm$Term$lam$($2184, (_x$16 => {
                                    var $2189 = Fm$Term$desugar_cse$argument$(_name$1, $2180, _type$3, _body$4, _defs$5);
                                    return $2189;
                                }));
                                var $2181 = $2188;
                                break;
                        };
                        var $2177 = $2181;
                        break;
                };
                var $2123 = $2177;
                break;
            case 'Fm.Term.app':
                var $2190 = self.func;
                var $2191 = self.argm;
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
                var $2123 = $2192;
                break;
            case 'Fm.Term.let':
                var $2205 = self.name;
                var $2206 = self.expr;
                var $2207 = self.body;
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
                                var $2219 = Fm$Term$lam$($2215, (_x$17 => {
                                    var $2220 = Fm$Term$desugar_cse$argument$(_name$1, $2211, _type$3, _body$4, _defs$5);
                                    return $2220;
                                }));
                                var $2212 = $2219;
                                break;
                        };
                        var $2208 = $2212;
                        break;
                };
                var $2123 = $2208;
                break;
            case 'Fm.Term.def':
                var $2221 = self.name;
                var $2222 = self.expr;
                var $2223 = self.body;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2225 = _body$4;
                        var $2224 = $2225;
                        break;
                    case 'List.cons':
                        var $2226 = self.head;
                        var $2227 = self.tail;
                        var self = $2226;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2229 = self.file;
                                var $2230 = self.code;
                                var $2231 = self.name;
                                var $2232 = self.term;
                                var $2233 = self.type;
                                var $2234 = self.stat;
                                var $2235 = Fm$Term$lam$($2231, (_x$17 => {
                                    var $2236 = Fm$Term$desugar_cse$argument$(_name$1, $2227, _type$3, _body$4, _defs$5);
                                    return $2236;
                                }));
                                var $2228 = $2235;
                                break;
                        };
                        var $2224 = $2228;
                        break;
                };
                var $2123 = $2224;
                break;
            case 'Fm.Term.ann':
                var $2237 = self.done;
                var $2238 = self.term;
                var $2239 = self.type;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2241 = _body$4;
                        var $2240 = $2241;
                        break;
                    case 'List.cons':
                        var $2242 = self.head;
                        var $2243 = self.tail;
                        var self = $2242;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2245 = self.file;
                                var $2246 = self.code;
                                var $2247 = self.name;
                                var $2248 = self.term;
                                var $2249 = self.type;
                                var $2250 = self.stat;
                                var $2251 = Fm$Term$lam$($2247, (_x$17 => {
                                    var $2252 = Fm$Term$desugar_cse$argument$(_name$1, $2243, _type$3, _body$4, _defs$5);
                                    return $2252;
                                }));
                                var $2244 = $2251;
                                break;
                        };
                        var $2240 = $2244;
                        break;
                };
                var $2123 = $2240;
                break;
            case 'Fm.Term.gol':
                var $2253 = self.name;
                var $2254 = self.dref;
                var $2255 = self.verb;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2257 = _body$4;
                        var $2256 = $2257;
                        break;
                    case 'List.cons':
                        var $2258 = self.head;
                        var $2259 = self.tail;
                        var self = $2258;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2261 = self.file;
                                var $2262 = self.code;
                                var $2263 = self.name;
                                var $2264 = self.term;
                                var $2265 = self.type;
                                var $2266 = self.stat;
                                var $2267 = Fm$Term$lam$($2263, (_x$17 => {
                                    var $2268 = Fm$Term$desugar_cse$argument$(_name$1, $2259, _type$3, _body$4, _defs$5);
                                    return $2268;
                                }));
                                var $2260 = $2267;
                                break;
                        };
                        var $2256 = $2260;
                        break;
                };
                var $2123 = $2256;
                break;
            case 'Fm.Term.hol':
                var $2269 = self.path;
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
                                var $2281 = Fm$Term$lam$($2277, (_x$15 => {
                                    var $2282 = Fm$Term$desugar_cse$argument$(_name$1, $2273, _type$3, _body$4, _defs$5);
                                    return $2282;
                                }));
                                var $2274 = $2281;
                                break;
                        };
                        var $2270 = $2274;
                        break;
                };
                var $2123 = $2270;
                break;
            case 'Fm.Term.nat':
                var $2283 = self.natx;
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
                                var $2295 = Fm$Term$lam$($2291, (_x$15 => {
                                    var $2296 = Fm$Term$desugar_cse$argument$(_name$1, $2287, _type$3, _body$4, _defs$5);
                                    return $2296;
                                }));
                                var $2288 = $2295;
                                break;
                        };
                        var $2284 = $2288;
                        break;
                };
                var $2123 = $2284;
                break;
            case 'Fm.Term.chr':
                var $2297 = self.chrx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2299 = _body$4;
                        var $2298 = $2299;
                        break;
                    case 'List.cons':
                        var $2300 = self.head;
                        var $2301 = self.tail;
                        var self = $2300;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2303 = self.file;
                                var $2304 = self.code;
                                var $2305 = self.name;
                                var $2306 = self.term;
                                var $2307 = self.type;
                                var $2308 = self.stat;
                                var $2309 = Fm$Term$lam$($2305, (_x$15 => {
                                    var $2310 = Fm$Term$desugar_cse$argument$(_name$1, $2301, _type$3, _body$4, _defs$5);
                                    return $2310;
                                }));
                                var $2302 = $2309;
                                break;
                        };
                        var $2298 = $2302;
                        break;
                };
                var $2123 = $2298;
                break;
            case 'Fm.Term.str':
                var $2311 = self.strx;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2313 = _body$4;
                        var $2312 = $2313;
                        break;
                    case 'List.cons':
                        var $2314 = self.head;
                        var $2315 = self.tail;
                        var self = $2314;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2317 = self.file;
                                var $2318 = self.code;
                                var $2319 = self.name;
                                var $2320 = self.term;
                                var $2321 = self.type;
                                var $2322 = self.stat;
                                var $2323 = Fm$Term$lam$($2319, (_x$15 => {
                                    var $2324 = Fm$Term$desugar_cse$argument$(_name$1, $2315, _type$3, _body$4, _defs$5);
                                    return $2324;
                                }));
                                var $2316 = $2323;
                                break;
                        };
                        var $2312 = $2316;
                        break;
                };
                var $2123 = $2312;
                break;
            case 'Fm.Term.cse':
                var $2325 = self.path;
                var $2326 = self.expr;
                var $2327 = self.name;
                var $2328 = self.with;
                var $2329 = self.cses;
                var $2330 = self.moti;
                var self = _wyth$2;
                switch (self._) {
                    case 'List.nil':
                        var $2332 = _body$4;
                        var $2331 = $2332;
                        break;
                    case 'List.cons':
                        var $2333 = self.head;
                        var $2334 = self.tail;
                        var self = $2333;
                        switch (self._) {
                            case 'Fm.Def.new':
                                var $2336 = self.file;
                                var $2337 = self.code;
                                var $2338 = self.name;
                                var $2339 = self.term;
                                var $2340 = self.type;
                                var $2341 = self.stat;
                                var $2342 = Fm$Term$lam$($2338, (_x$20 => {
                                    var $2343 = Fm$Term$desugar_cse$argument$(_name$1, $2334, _type$3, _body$4, _defs$5);
                                    return $2343;
                                }));
                                var $2335 = $2342;
                                break;
                        };
                        var $2331 = $2335;
                        break;
                };
                var $2123 = $2331;
                break;
            case 'Fm.Term.ori':
                var $2344 = self.orig;
                var $2345 = self.expr;
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
                                var $2357 = Fm$Term$lam$($2353, (_x$16 => {
                                    var $2358 = Fm$Term$desugar_cse$argument$(_name$1, $2349, _type$3, _body$4, _defs$5);
                                    return $2358;
                                }));
                                var $2350 = $2357;
                                break;
                        };
                        var $2346 = $2350;
                        break;
                };
                var $2123 = $2346;
                break;
        };
        return $2123;
    };
    const Fm$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Fm$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.none':
                var $2360 = _b$3;
                var $2359 = $2360;
                break;
            case 'Maybe.some':
                var $2361 = self.value;
                var $2362 = Maybe$some$($2361);
                var $2359 = $2362;
                break;
        };
        return $2359;
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
                        var $2363 = self.name;
                        var $2364 = self.indx;
                        var _expr$10 = (() => {
                            var $2367 = _expr$1;
                            var $2368 = _wyth$3;
                            let _expr$11 = $2367;
                            let _defn$10;
                            while ($2368._ === 'List.cons') {
                                _defn$10 = $2368.head;
                                var $2367 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2369 = self.file;
                                            var $2370 = self.code;
                                            var $2371 = self.name;
                                            var $2372 = self.term;
                                            var $2373 = self.type;
                                            var $2374 = self.stat;
                                            var $2375 = $2372;
                                            return $2375;
                                    };
                                })());
                                _expr$11 = $2367;
                                $2368 = $2368.tail;
                            }
                            return _expr$11;
                        })();
                        var $2365 = _expr$10;
                        return $2365;
                    case 'Fm.Term.ref':
                        var $2376 = self.name;
                        var _expr$9 = (() => {
                            var $2379 = _expr$1;
                            var $2380 = _wyth$3;
                            let _expr$10 = $2379;
                            let _defn$9;
                            while ($2380._ === 'List.cons') {
                                _defn$9 = $2380.head;
                                var $2379 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2381 = self.file;
                                            var $2382 = self.code;
                                            var $2383 = self.name;
                                            var $2384 = self.term;
                                            var $2385 = self.type;
                                            var $2386 = self.stat;
                                            var $2387 = $2384;
                                            return $2387;
                                    };
                                })());
                                _expr$10 = $2379;
                                $2380 = $2380.tail;
                            }
                            return _expr$10;
                        })();
                        var $2377 = _expr$9;
                        return $2377;
                    case 'Fm.Term.typ':
                        var _expr$8 = (() => {
                            var $2390 = _expr$1;
                            var $2391 = _wyth$3;
                            let _expr$9 = $2390;
                            let _defn$8;
                            while ($2391._ === 'List.cons') {
                                _defn$8 = $2391.head;
                                var $2390 = Fm$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2392 = self.file;
                                            var $2393 = self.code;
                                            var $2394 = self.name;
                                            var $2395 = self.term;
                                            var $2396 = self.type;
                                            var $2397 = self.stat;
                                            var $2398 = $2395;
                                            return $2398;
                                    };
                                })());
                                _expr$9 = $2390;
                                $2391 = $2391.tail;
                            }
                            return _expr$9;
                        })();
                        var $2388 = _expr$8;
                        return $2388;
                    case 'Fm.Term.all':
                        var $2399 = self.eras;
                        var $2400 = self.self;
                        var $2401 = self.name;
                        var $2402 = self.xtyp;
                        var $2403 = self.body;
                        var _got$13 = Maybe$or$(Fm$get$($2401, _cses$4), Fm$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $2407 = _expr$1;
                                    var $2408 = _wyth$3;
                                    let _expr$15 = $2407;
                                    let _defn$14;
                                    while ($2408._ === 'List.cons') {
                                        _defn$14 = $2408.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Fm.Def.new':
                                                var $2409 = self.file;
                                                var $2410 = self.code;
                                                var $2411 = self.name;
                                                var $2412 = self.term;
                                                var $2413 = self.type;
                                                var $2414 = self.stat;
                                                var $2415 = Fm$Term$app$(_expr$15, $2412);
                                                var $2407 = $2415;
                                                break;
                                        };
                                        _expr$15 = $2407;
                                        $2408 = $2408.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $2405 = _expr$14;
                                var $2404 = $2405;
                                break;
                            case 'Maybe.some':
                                var $2416 = self.value;
                                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, _wyth$3, $2402, $2416, _defs$6);
                                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $2403(Fm$Term$var$($2400, 0n))(Fm$Term$var$($2401, 0n));
                                var $2417 = Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $2404 = $2417;
                                break;
                        };
                        return $2404;
                    case 'Fm.Term.lam':
                        var $2418 = self.name;
                        var $2419 = self.body;
                        var _expr$10 = (() => {
                            var $2422 = _expr$1;
                            var $2423 = _wyth$3;
                            let _expr$11 = $2422;
                            let _defn$10;
                            while ($2423._ === 'List.cons') {
                                _defn$10 = $2423.head;
                                var $2422 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2424 = self.file;
                                            var $2425 = self.code;
                                            var $2426 = self.name;
                                            var $2427 = self.term;
                                            var $2428 = self.type;
                                            var $2429 = self.stat;
                                            var $2430 = $2427;
                                            return $2430;
                                    };
                                })());
                                _expr$11 = $2422;
                                $2423 = $2423.tail;
                            }
                            return _expr$11;
                        })();
                        var $2420 = _expr$10;
                        return $2420;
                    case 'Fm.Term.app':
                        var $2431 = self.func;
                        var $2432 = self.argm;
                        var _expr$10 = (() => {
                            var $2435 = _expr$1;
                            var $2436 = _wyth$3;
                            let _expr$11 = $2435;
                            let _defn$10;
                            while ($2436._ === 'List.cons') {
                                _defn$10 = $2436.head;
                                var $2435 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2437 = self.file;
                                            var $2438 = self.code;
                                            var $2439 = self.name;
                                            var $2440 = self.term;
                                            var $2441 = self.type;
                                            var $2442 = self.stat;
                                            var $2443 = $2440;
                                            return $2443;
                                    };
                                })());
                                _expr$11 = $2435;
                                $2436 = $2436.tail;
                            }
                            return _expr$11;
                        })();
                        var $2433 = _expr$10;
                        return $2433;
                    case 'Fm.Term.let':
                        var $2444 = self.name;
                        var $2445 = self.expr;
                        var $2446 = self.body;
                        var _expr$11 = (() => {
                            var $2449 = _expr$1;
                            var $2450 = _wyth$3;
                            let _expr$12 = $2449;
                            let _defn$11;
                            while ($2450._ === 'List.cons') {
                                _defn$11 = $2450.head;
                                var $2449 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
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
                                _expr$12 = $2449;
                                $2450 = $2450.tail;
                            }
                            return _expr$12;
                        })();
                        var $2447 = _expr$11;
                        return $2447;
                    case 'Fm.Term.def':
                        var $2458 = self.name;
                        var $2459 = self.expr;
                        var $2460 = self.body;
                        var _expr$11 = (() => {
                            var $2463 = _expr$1;
                            var $2464 = _wyth$3;
                            let _expr$12 = $2463;
                            let _defn$11;
                            while ($2464._ === 'List.cons') {
                                _defn$11 = $2464.head;
                                var $2463 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2465 = self.file;
                                            var $2466 = self.code;
                                            var $2467 = self.name;
                                            var $2468 = self.term;
                                            var $2469 = self.type;
                                            var $2470 = self.stat;
                                            var $2471 = $2468;
                                            return $2471;
                                    };
                                })());
                                _expr$12 = $2463;
                                $2464 = $2464.tail;
                            }
                            return _expr$12;
                        })();
                        var $2461 = _expr$11;
                        return $2461;
                    case 'Fm.Term.ann':
                        var $2472 = self.done;
                        var $2473 = self.term;
                        var $2474 = self.type;
                        var _expr$11 = (() => {
                            var $2477 = _expr$1;
                            var $2478 = _wyth$3;
                            let _expr$12 = $2477;
                            let _defn$11;
                            while ($2478._ === 'List.cons') {
                                _defn$11 = $2478.head;
                                var $2477 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2479 = self.file;
                                            var $2480 = self.code;
                                            var $2481 = self.name;
                                            var $2482 = self.term;
                                            var $2483 = self.type;
                                            var $2484 = self.stat;
                                            var $2485 = $2482;
                                            return $2485;
                                    };
                                })());
                                _expr$12 = $2477;
                                $2478 = $2478.tail;
                            }
                            return _expr$12;
                        })();
                        var $2475 = _expr$11;
                        return $2475;
                    case 'Fm.Term.gol':
                        var $2486 = self.name;
                        var $2487 = self.dref;
                        var $2488 = self.verb;
                        var _expr$11 = (() => {
                            var $2491 = _expr$1;
                            var $2492 = _wyth$3;
                            let _expr$12 = $2491;
                            let _defn$11;
                            while ($2492._ === 'List.cons') {
                                _defn$11 = $2492.head;
                                var $2491 = Fm$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2493 = self.file;
                                            var $2494 = self.code;
                                            var $2495 = self.name;
                                            var $2496 = self.term;
                                            var $2497 = self.type;
                                            var $2498 = self.stat;
                                            var $2499 = $2496;
                                            return $2499;
                                    };
                                })());
                                _expr$12 = $2491;
                                $2492 = $2492.tail;
                            }
                            return _expr$12;
                        })();
                        var $2489 = _expr$11;
                        return $2489;
                    case 'Fm.Term.hol':
                        var $2500 = self.path;
                        var _expr$9 = (() => {
                            var $2503 = _expr$1;
                            var $2504 = _wyth$3;
                            let _expr$10 = $2503;
                            let _defn$9;
                            while ($2504._ === 'List.cons') {
                                _defn$9 = $2504.head;
                                var $2503 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
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
                                _expr$10 = $2503;
                                $2504 = $2504.tail;
                            }
                            return _expr$10;
                        })();
                        var $2501 = _expr$9;
                        return $2501;
                    case 'Fm.Term.nat':
                        var $2512 = self.natx;
                        var _expr$9 = (() => {
                            var $2515 = _expr$1;
                            var $2516 = _wyth$3;
                            let _expr$10 = $2515;
                            let _defn$9;
                            while ($2516._ === 'List.cons') {
                                _defn$9 = $2516.head;
                                var $2515 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
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
                                _expr$10 = $2515;
                                $2516 = $2516.tail;
                            }
                            return _expr$10;
                        })();
                        var $2513 = _expr$9;
                        return $2513;
                    case 'Fm.Term.chr':
                        var $2524 = self.chrx;
                        var _expr$9 = (() => {
                            var $2527 = _expr$1;
                            var $2528 = _wyth$3;
                            let _expr$10 = $2527;
                            let _defn$9;
                            while ($2528._ === 'List.cons') {
                                _defn$9 = $2528.head;
                                var $2527 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2529 = self.file;
                                            var $2530 = self.code;
                                            var $2531 = self.name;
                                            var $2532 = self.term;
                                            var $2533 = self.type;
                                            var $2534 = self.stat;
                                            var $2535 = $2532;
                                            return $2535;
                                    };
                                })());
                                _expr$10 = $2527;
                                $2528 = $2528.tail;
                            }
                            return _expr$10;
                        })();
                        var $2525 = _expr$9;
                        return $2525;
                    case 'Fm.Term.str':
                        var $2536 = self.strx;
                        var _expr$9 = (() => {
                            var $2539 = _expr$1;
                            var $2540 = _wyth$3;
                            let _expr$10 = $2539;
                            let _defn$9;
                            while ($2540._ === 'List.cons') {
                                _defn$9 = $2540.head;
                                var $2539 = Fm$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
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
                                _expr$10 = $2539;
                                $2540 = $2540.tail;
                            }
                            return _expr$10;
                        })();
                        var $2537 = _expr$9;
                        return $2537;
                    case 'Fm.Term.cse':
                        var $2548 = self.path;
                        var $2549 = self.expr;
                        var $2550 = self.name;
                        var $2551 = self.with;
                        var $2552 = self.cses;
                        var $2553 = self.moti;
                        var _expr$14 = (() => {
                            var $2556 = _expr$1;
                            var $2557 = _wyth$3;
                            let _expr$15 = $2556;
                            let _defn$14;
                            while ($2557._ === 'List.cons') {
                                _defn$14 = $2557.head;
                                var $2556 = Fm$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Fm.Def.new':
                                            var $2558 = self.file;
                                            var $2559 = self.code;
                                            var $2560 = self.name;
                                            var $2561 = self.term;
                                            var $2562 = self.type;
                                            var $2563 = self.stat;
                                            var $2564 = $2561;
                                            return $2564;
                                    };
                                })());
                                _expr$15 = $2556;
                                $2557 = $2557.tail;
                            }
                            return _expr$15;
                        })();
                        var $2554 = _expr$14;
                        return $2554;
                    case 'Fm.Term.ori':
                        var $2565 = self.orig;
                        var $2566 = self.expr;
                        var _expr$10 = (() => {
                            var $2569 = _expr$1;
                            var $2570 = _wyth$3;
                            let _expr$11 = $2569;
                            let _defn$10;
                            while ($2570._ === 'List.cons') {
                                _defn$10 = $2570.head;
                                var $2569 = Fm$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
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
                                _expr$11 = $2569;
                                $2570 = $2570.tail;
                            }
                            return _expr$11;
                        })();
                        var $2567 = _expr$10;
                        return $2567;
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
                var $2579 = self.name;
                var $2580 = self.indx;
                var $2581 = Maybe$none;
                var $2578 = $2581;
                break;
            case 'Fm.Term.ref':
                var $2582 = self.name;
                var $2583 = Maybe$none;
                var $2578 = $2583;
                break;
            case 'Fm.Term.typ':
                var $2584 = Maybe$none;
                var $2578 = $2584;
                break;
            case 'Fm.Term.all':
                var $2585 = self.eras;
                var $2586 = self.self;
                var $2587 = self.name;
                var $2588 = self.xtyp;
                var $2589 = self.body;
                var _moti$14 = Fm$Term$desugar_cse$motive$(_with$3, _moti$5);
                var _argm$15 = Fm$Term$desugar_cse$argument$(_name$2, List$nil, $2588, _moti$14, _defs$7);
                var _expr$16 = Fm$Term$app$(_expr$1, _argm$15);
                var _type$17 = $2589(Fm$Term$var$($2586, 0n))(Fm$Term$var$($2587, 0n));
                var $2590 = Maybe$some$(Fm$Term$desugar_cse$cases$(_expr$16, _name$2, _with$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $2578 = $2590;
                break;
            case 'Fm.Term.lam':
                var $2591 = self.name;
                var $2592 = self.body;
                var $2593 = Maybe$none;
                var $2578 = $2593;
                break;
            case 'Fm.Term.app':
                var $2594 = self.func;
                var $2595 = self.argm;
                var $2596 = Maybe$none;
                var $2578 = $2596;
                break;
            case 'Fm.Term.let':
                var $2597 = self.name;
                var $2598 = self.expr;
                var $2599 = self.body;
                var $2600 = Maybe$none;
                var $2578 = $2600;
                break;
            case 'Fm.Term.def':
                var $2601 = self.name;
                var $2602 = self.expr;
                var $2603 = self.body;
                var $2604 = Maybe$none;
                var $2578 = $2604;
                break;
            case 'Fm.Term.ann':
                var $2605 = self.done;
                var $2606 = self.term;
                var $2607 = self.type;
                var $2608 = Maybe$none;
                var $2578 = $2608;
                break;
            case 'Fm.Term.gol':
                var $2609 = self.name;
                var $2610 = self.dref;
                var $2611 = self.verb;
                var $2612 = Maybe$none;
                var $2578 = $2612;
                break;
            case 'Fm.Term.hol':
                var $2613 = self.path;
                var $2614 = Maybe$none;
                var $2578 = $2614;
                break;
            case 'Fm.Term.nat':
                var $2615 = self.natx;
                var $2616 = Maybe$none;
                var $2578 = $2616;
                break;
            case 'Fm.Term.chr':
                var $2617 = self.chrx;
                var $2618 = Maybe$none;
                var $2578 = $2618;
                break;
            case 'Fm.Term.str':
                var $2619 = self.strx;
                var $2620 = Maybe$none;
                var $2578 = $2620;
                break;
            case 'Fm.Term.cse':
                var $2621 = self.path;
                var $2622 = self.expr;
                var $2623 = self.name;
                var $2624 = self.with;
                var $2625 = self.cses;
                var $2626 = self.moti;
                var $2627 = Maybe$none;
                var $2578 = $2627;
                break;
            case 'Fm.Term.ori':
                var $2628 = self.orig;
                var $2629 = self.expr;
                var $2630 = Maybe$none;
                var $2578 = $2630;
                break;
        };
        return $2578;
    };
    const Fm$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Error$patch$(_path$1, _term$2) {
        var $2631 = ({
            _: 'Fm.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $2631;
    };
    const Fm$Error$patch = x0 => x1 => Fm$Error$patch$(x0, x1);

    function Fm$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.none':
                var $2633 = Bits$e;
                var $2632 = $2633;
                break;
            case 'Maybe.some':
                var $2634 = self.value;
                var $2635 = $2634(Bits$e);
                var $2632 = $2635;
                break;
        };
        return $2632;
    };
    const Fm$MPath$to_bits = x0 => Fm$MPath$to_bits$(x0);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $2637 = Bool$false;
                var $2636 = $2637;
                break;
            case 'Maybe.some':
                var $2638 = self.value;
                var $2639 = Bool$true;
                var $2636 = $2639;
                break;
        };
        return $2636;
    };
    const Set$has = x0 => x1 => Set$has$(x0, x1);

    function Fm$Term$normalize$(_term$1, _defs$2) {
        var self = Fm$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Fm.Term.var':
                var $2641 = self.name;
                var $2642 = self.indx;
                var $2643 = Fm$Term$var$($2641, $2642);
                var $2640 = $2643;
                break;
            case 'Fm.Term.ref':
                var $2644 = self.name;
                var $2645 = Fm$Term$ref$($2644);
                var $2640 = $2645;
                break;
            case 'Fm.Term.typ':
                var $2646 = Fm$Term$typ;
                var $2640 = $2646;
                break;
            case 'Fm.Term.all':
                var $2647 = self.eras;
                var $2648 = self.self;
                var $2649 = self.name;
                var $2650 = self.xtyp;
                var $2651 = self.body;
                var $2652 = Fm$Term$all$($2647, $2648, $2649, Fm$Term$normalize$($2650, _defs$2), (_s$8 => _x$9 => {
                    var $2653 = Fm$Term$normalize$($2651(_s$8)(_x$9), _defs$2);
                    return $2653;
                }));
                var $2640 = $2652;
                break;
            case 'Fm.Term.lam':
                var $2654 = self.name;
                var $2655 = self.body;
                var $2656 = Fm$Term$lam$($2654, (_x$5 => {
                    var $2657 = Fm$Term$normalize$($2655(_x$5), _defs$2);
                    return $2657;
                }));
                var $2640 = $2656;
                break;
            case 'Fm.Term.app':
                var $2658 = self.func;
                var $2659 = self.argm;
                var $2660 = Fm$Term$app$(Fm$Term$normalize$($2658, _defs$2), Fm$Term$normalize$($2659, _defs$2));
                var $2640 = $2660;
                break;
            case 'Fm.Term.let':
                var $2661 = self.name;
                var $2662 = self.expr;
                var $2663 = self.body;
                var $2664 = Fm$Term$let$($2661, Fm$Term$normalize$($2662, _defs$2), (_x$6 => {
                    var $2665 = Fm$Term$normalize$($2663(_x$6), _defs$2);
                    return $2665;
                }));
                var $2640 = $2664;
                break;
            case 'Fm.Term.def':
                var $2666 = self.name;
                var $2667 = self.expr;
                var $2668 = self.body;
                var $2669 = Fm$Term$def$($2666, Fm$Term$normalize$($2667, _defs$2), (_x$6 => {
                    var $2670 = Fm$Term$normalize$($2668(_x$6), _defs$2);
                    return $2670;
                }));
                var $2640 = $2669;
                break;
            case 'Fm.Term.ann':
                var $2671 = self.done;
                var $2672 = self.term;
                var $2673 = self.type;
                var $2674 = Fm$Term$ann$($2671, Fm$Term$normalize$($2672, _defs$2), Fm$Term$normalize$($2673, _defs$2));
                var $2640 = $2674;
                break;
            case 'Fm.Term.gol':
                var $2675 = self.name;
                var $2676 = self.dref;
                var $2677 = self.verb;
                var $2678 = Fm$Term$gol$($2675, $2676, $2677);
                var $2640 = $2678;
                break;
            case 'Fm.Term.hol':
                var $2679 = self.path;
                var $2680 = Fm$Term$hol$($2679);
                var $2640 = $2680;
                break;
            case 'Fm.Term.nat':
                var $2681 = self.natx;
                var $2682 = Fm$Term$nat$($2681);
                var $2640 = $2682;
                break;
            case 'Fm.Term.chr':
                var $2683 = self.chrx;
                var $2684 = Fm$Term$chr$($2683);
                var $2640 = $2684;
                break;
            case 'Fm.Term.str':
                var $2685 = self.strx;
                var $2686 = Fm$Term$str$($2685);
                var $2640 = $2686;
                break;
            case 'Fm.Term.cse':
                var $2687 = self.path;
                var $2688 = self.expr;
                var $2689 = self.name;
                var $2690 = self.with;
                var $2691 = self.cses;
                var $2692 = self.moti;
                var $2693 = _term$1;
                var $2640 = $2693;
                break;
            case 'Fm.Term.ori':
                var $2694 = self.orig;
                var $2695 = self.expr;
                var $2696 = Fm$Term$normalize$($2695, _defs$2);
                var $2640 = $2696;
                break;
        };
        return $2640;
    };
    const Fm$Term$normalize = x0 => x1 => Fm$Term$normalize$(x0, x1);

    function Fm$Term$equal$patch$(_path$2, _term$3, _ret$4) {
        var $2697 = Fm$Check$result$(Maybe$some$(_ret$4), List$cons$(Fm$Error$patch$(_path$2, Fm$Term$normalize$(_term$3, Map$new)), List$nil));
        return $2697;
    };
    const Fm$Term$equal$patch = x0 => x1 => x2 => Fm$Term$equal$patch$(x0, x1, x2);

    function Fm$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $2699 = self.name;
                var $2700 = self.indx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2702 = self.name;
                        var $2703 = self.indx;
                        var $2704 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2704;
                        break;
                    case 'Fm.Term.ref':
                        var $2705 = self.name;
                        var $2706 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2706;
                        break;
                    case 'Fm.Term.typ':
                        var $2707 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2707;
                        break;
                    case 'Fm.Term.all':
                        var $2708 = self.eras;
                        var $2709 = self.self;
                        var $2710 = self.name;
                        var $2711 = self.xtyp;
                        var $2712 = self.body;
                        var $2713 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2713;
                        break;
                    case 'Fm.Term.lam':
                        var $2714 = self.name;
                        var $2715 = self.body;
                        var $2716 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2716;
                        break;
                    case 'Fm.Term.app':
                        var $2717 = self.func;
                        var $2718 = self.argm;
                        var $2719 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2719;
                        break;
                    case 'Fm.Term.let':
                        var $2720 = self.name;
                        var $2721 = self.expr;
                        var $2722 = self.body;
                        var $2723 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2723;
                        break;
                    case 'Fm.Term.def':
                        var $2724 = self.name;
                        var $2725 = self.expr;
                        var $2726 = self.body;
                        var $2727 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2727;
                        break;
                    case 'Fm.Term.ann':
                        var $2728 = self.done;
                        var $2729 = self.term;
                        var $2730 = self.type;
                        var $2731 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2731;
                        break;
                    case 'Fm.Term.gol':
                        var $2732 = self.name;
                        var $2733 = self.dref;
                        var $2734 = self.verb;
                        var $2735 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2735;
                        break;
                    case 'Fm.Term.hol':
                        var $2736 = self.path;
                        var $2737 = Fm$Term$equal$patch$($2736, _a$1, Unit$new);
                        var $2701 = $2737;
                        break;
                    case 'Fm.Term.nat':
                        var $2738 = self.natx;
                        var $2739 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2739;
                        break;
                    case 'Fm.Term.chr':
                        var $2740 = self.chrx;
                        var $2741 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2741;
                        break;
                    case 'Fm.Term.str':
                        var $2742 = self.strx;
                        var $2743 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2743;
                        break;
                    case 'Fm.Term.cse':
                        var $2744 = self.path;
                        var $2745 = self.expr;
                        var $2746 = self.name;
                        var $2747 = self.with;
                        var $2748 = self.cses;
                        var $2749 = self.moti;
                        var $2750 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2701 = $2750;
                        break;
                    case 'Fm.Term.ori':
                        var $2751 = self.orig;
                        var $2752 = self.expr;
                        var $2753 = Fm$Term$equal$extra_holes$(_a$1, $2752);
                        var $2701 = $2753;
                        break;
                };
                var $2698 = $2701;
                break;
            case 'Fm.Term.ref':
                var $2754 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2756 = self.name;
                        var $2757 = self.indx;
                        var $2758 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2758;
                        break;
                    case 'Fm.Term.ref':
                        var $2759 = self.name;
                        var $2760 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2760;
                        break;
                    case 'Fm.Term.typ':
                        var $2761 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2761;
                        break;
                    case 'Fm.Term.all':
                        var $2762 = self.eras;
                        var $2763 = self.self;
                        var $2764 = self.name;
                        var $2765 = self.xtyp;
                        var $2766 = self.body;
                        var $2767 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2767;
                        break;
                    case 'Fm.Term.lam':
                        var $2768 = self.name;
                        var $2769 = self.body;
                        var $2770 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2770;
                        break;
                    case 'Fm.Term.app':
                        var $2771 = self.func;
                        var $2772 = self.argm;
                        var $2773 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2773;
                        break;
                    case 'Fm.Term.let':
                        var $2774 = self.name;
                        var $2775 = self.expr;
                        var $2776 = self.body;
                        var $2777 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2777;
                        break;
                    case 'Fm.Term.def':
                        var $2778 = self.name;
                        var $2779 = self.expr;
                        var $2780 = self.body;
                        var $2781 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2781;
                        break;
                    case 'Fm.Term.ann':
                        var $2782 = self.done;
                        var $2783 = self.term;
                        var $2784 = self.type;
                        var $2785 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2785;
                        break;
                    case 'Fm.Term.gol':
                        var $2786 = self.name;
                        var $2787 = self.dref;
                        var $2788 = self.verb;
                        var $2789 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2789;
                        break;
                    case 'Fm.Term.hol':
                        var $2790 = self.path;
                        var $2791 = Fm$Term$equal$patch$($2790, _a$1, Unit$new);
                        var $2755 = $2791;
                        break;
                    case 'Fm.Term.nat':
                        var $2792 = self.natx;
                        var $2793 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2793;
                        break;
                    case 'Fm.Term.chr':
                        var $2794 = self.chrx;
                        var $2795 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2795;
                        break;
                    case 'Fm.Term.str':
                        var $2796 = self.strx;
                        var $2797 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2797;
                        break;
                    case 'Fm.Term.cse':
                        var $2798 = self.path;
                        var $2799 = self.expr;
                        var $2800 = self.name;
                        var $2801 = self.with;
                        var $2802 = self.cses;
                        var $2803 = self.moti;
                        var $2804 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2755 = $2804;
                        break;
                    case 'Fm.Term.ori':
                        var $2805 = self.orig;
                        var $2806 = self.expr;
                        var $2807 = Fm$Term$equal$extra_holes$(_a$1, $2806);
                        var $2755 = $2807;
                        break;
                };
                var $2698 = $2755;
                break;
            case 'Fm.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2809 = self.name;
                        var $2810 = self.indx;
                        var $2811 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2811;
                        break;
                    case 'Fm.Term.ref':
                        var $2812 = self.name;
                        var $2813 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2813;
                        break;
                    case 'Fm.Term.typ':
                        var $2814 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2814;
                        break;
                    case 'Fm.Term.all':
                        var $2815 = self.eras;
                        var $2816 = self.self;
                        var $2817 = self.name;
                        var $2818 = self.xtyp;
                        var $2819 = self.body;
                        var $2820 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2820;
                        break;
                    case 'Fm.Term.lam':
                        var $2821 = self.name;
                        var $2822 = self.body;
                        var $2823 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2823;
                        break;
                    case 'Fm.Term.app':
                        var $2824 = self.func;
                        var $2825 = self.argm;
                        var $2826 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2826;
                        break;
                    case 'Fm.Term.let':
                        var $2827 = self.name;
                        var $2828 = self.expr;
                        var $2829 = self.body;
                        var $2830 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2830;
                        break;
                    case 'Fm.Term.def':
                        var $2831 = self.name;
                        var $2832 = self.expr;
                        var $2833 = self.body;
                        var $2834 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2834;
                        break;
                    case 'Fm.Term.ann':
                        var $2835 = self.done;
                        var $2836 = self.term;
                        var $2837 = self.type;
                        var $2838 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2838;
                        break;
                    case 'Fm.Term.gol':
                        var $2839 = self.name;
                        var $2840 = self.dref;
                        var $2841 = self.verb;
                        var $2842 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2842;
                        break;
                    case 'Fm.Term.hol':
                        var $2843 = self.path;
                        var $2844 = Fm$Term$equal$patch$($2843, _a$1, Unit$new);
                        var $2808 = $2844;
                        break;
                    case 'Fm.Term.nat':
                        var $2845 = self.natx;
                        var $2846 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2846;
                        break;
                    case 'Fm.Term.chr':
                        var $2847 = self.chrx;
                        var $2848 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2848;
                        break;
                    case 'Fm.Term.str':
                        var $2849 = self.strx;
                        var $2850 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2850;
                        break;
                    case 'Fm.Term.cse':
                        var $2851 = self.path;
                        var $2852 = self.expr;
                        var $2853 = self.name;
                        var $2854 = self.with;
                        var $2855 = self.cses;
                        var $2856 = self.moti;
                        var $2857 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2808 = $2857;
                        break;
                    case 'Fm.Term.ori':
                        var $2858 = self.orig;
                        var $2859 = self.expr;
                        var $2860 = Fm$Term$equal$extra_holes$(_a$1, $2859);
                        var $2808 = $2860;
                        break;
                };
                var $2698 = $2808;
                break;
            case 'Fm.Term.all':
                var $2861 = self.eras;
                var $2862 = self.self;
                var $2863 = self.name;
                var $2864 = self.xtyp;
                var $2865 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2867 = self.name;
                        var $2868 = self.indx;
                        var $2869 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2869;
                        break;
                    case 'Fm.Term.ref':
                        var $2870 = self.name;
                        var $2871 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2871;
                        break;
                    case 'Fm.Term.typ':
                        var $2872 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2872;
                        break;
                    case 'Fm.Term.all':
                        var $2873 = self.eras;
                        var $2874 = self.self;
                        var $2875 = self.name;
                        var $2876 = self.xtyp;
                        var $2877 = self.body;
                        var $2878 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2878;
                        break;
                    case 'Fm.Term.lam':
                        var $2879 = self.name;
                        var $2880 = self.body;
                        var $2881 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2881;
                        break;
                    case 'Fm.Term.app':
                        var $2882 = self.func;
                        var $2883 = self.argm;
                        var $2884 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2884;
                        break;
                    case 'Fm.Term.let':
                        var $2885 = self.name;
                        var $2886 = self.expr;
                        var $2887 = self.body;
                        var $2888 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2888;
                        break;
                    case 'Fm.Term.def':
                        var $2889 = self.name;
                        var $2890 = self.expr;
                        var $2891 = self.body;
                        var $2892 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2892;
                        break;
                    case 'Fm.Term.ann':
                        var $2893 = self.done;
                        var $2894 = self.term;
                        var $2895 = self.type;
                        var $2896 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2896;
                        break;
                    case 'Fm.Term.gol':
                        var $2897 = self.name;
                        var $2898 = self.dref;
                        var $2899 = self.verb;
                        var $2900 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2900;
                        break;
                    case 'Fm.Term.hol':
                        var $2901 = self.path;
                        var $2902 = Fm$Term$equal$patch$($2901, _a$1, Unit$new);
                        var $2866 = $2902;
                        break;
                    case 'Fm.Term.nat':
                        var $2903 = self.natx;
                        var $2904 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2904;
                        break;
                    case 'Fm.Term.chr':
                        var $2905 = self.chrx;
                        var $2906 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2906;
                        break;
                    case 'Fm.Term.str':
                        var $2907 = self.strx;
                        var $2908 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2908;
                        break;
                    case 'Fm.Term.cse':
                        var $2909 = self.path;
                        var $2910 = self.expr;
                        var $2911 = self.name;
                        var $2912 = self.with;
                        var $2913 = self.cses;
                        var $2914 = self.moti;
                        var $2915 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2866 = $2915;
                        break;
                    case 'Fm.Term.ori':
                        var $2916 = self.orig;
                        var $2917 = self.expr;
                        var $2918 = Fm$Term$equal$extra_holes$(_a$1, $2917);
                        var $2866 = $2918;
                        break;
                };
                var $2698 = $2866;
                break;
            case 'Fm.Term.lam':
                var $2919 = self.name;
                var $2920 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2922 = self.name;
                        var $2923 = self.indx;
                        var $2924 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2924;
                        break;
                    case 'Fm.Term.ref':
                        var $2925 = self.name;
                        var $2926 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2926;
                        break;
                    case 'Fm.Term.typ':
                        var $2927 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2927;
                        break;
                    case 'Fm.Term.all':
                        var $2928 = self.eras;
                        var $2929 = self.self;
                        var $2930 = self.name;
                        var $2931 = self.xtyp;
                        var $2932 = self.body;
                        var $2933 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2933;
                        break;
                    case 'Fm.Term.lam':
                        var $2934 = self.name;
                        var $2935 = self.body;
                        var $2936 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2936;
                        break;
                    case 'Fm.Term.app':
                        var $2937 = self.func;
                        var $2938 = self.argm;
                        var $2939 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2939;
                        break;
                    case 'Fm.Term.let':
                        var $2940 = self.name;
                        var $2941 = self.expr;
                        var $2942 = self.body;
                        var $2943 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2943;
                        break;
                    case 'Fm.Term.def':
                        var $2944 = self.name;
                        var $2945 = self.expr;
                        var $2946 = self.body;
                        var $2947 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2947;
                        break;
                    case 'Fm.Term.ann':
                        var $2948 = self.done;
                        var $2949 = self.term;
                        var $2950 = self.type;
                        var $2951 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2951;
                        break;
                    case 'Fm.Term.gol':
                        var $2952 = self.name;
                        var $2953 = self.dref;
                        var $2954 = self.verb;
                        var $2955 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2955;
                        break;
                    case 'Fm.Term.hol':
                        var $2956 = self.path;
                        var $2957 = Fm$Term$equal$patch$($2956, _a$1, Unit$new);
                        var $2921 = $2957;
                        break;
                    case 'Fm.Term.nat':
                        var $2958 = self.natx;
                        var $2959 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2959;
                        break;
                    case 'Fm.Term.chr':
                        var $2960 = self.chrx;
                        var $2961 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2961;
                        break;
                    case 'Fm.Term.str':
                        var $2962 = self.strx;
                        var $2963 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2963;
                        break;
                    case 'Fm.Term.cse':
                        var $2964 = self.path;
                        var $2965 = self.expr;
                        var $2966 = self.name;
                        var $2967 = self.with;
                        var $2968 = self.cses;
                        var $2969 = self.moti;
                        var $2970 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2921 = $2970;
                        break;
                    case 'Fm.Term.ori':
                        var $2971 = self.orig;
                        var $2972 = self.expr;
                        var $2973 = Fm$Term$equal$extra_holes$(_a$1, $2972);
                        var $2921 = $2973;
                        break;
                };
                var $2698 = $2921;
                break;
            case 'Fm.Term.app':
                var $2974 = self.func;
                var $2975 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $2977 = self.name;
                        var $2978 = self.indx;
                        var $2979 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $2979;
                        break;
                    case 'Fm.Term.ref':
                        var $2980 = self.name;
                        var $2981 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $2981;
                        break;
                    case 'Fm.Term.typ':
                        var $2982 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $2982;
                        break;
                    case 'Fm.Term.all':
                        var $2983 = self.eras;
                        var $2984 = self.self;
                        var $2985 = self.name;
                        var $2986 = self.xtyp;
                        var $2987 = self.body;
                        var $2988 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $2988;
                        break;
                    case 'Fm.Term.lam':
                        var $2989 = self.name;
                        var $2990 = self.body;
                        var $2991 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $2991;
                        break;
                    case 'Fm.Term.app':
                        var $2992 = self.func;
                        var $2993 = self.argm;
                        var $2994 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$($2974, $2992))((_$7 => {
                            var $2995 = Fm$Term$equal$extra_holes$($2975, $2993);
                            return $2995;
                        }));
                        var $2976 = $2994;
                        break;
                    case 'Fm.Term.let':
                        var $2996 = self.name;
                        var $2997 = self.expr;
                        var $2998 = self.body;
                        var $2999 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $2999;
                        break;
                    case 'Fm.Term.def':
                        var $3000 = self.name;
                        var $3001 = self.expr;
                        var $3002 = self.body;
                        var $3003 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $3003;
                        break;
                    case 'Fm.Term.ann':
                        var $3004 = self.done;
                        var $3005 = self.term;
                        var $3006 = self.type;
                        var $3007 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $3007;
                        break;
                    case 'Fm.Term.gol':
                        var $3008 = self.name;
                        var $3009 = self.dref;
                        var $3010 = self.verb;
                        var $3011 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $3011;
                        break;
                    case 'Fm.Term.hol':
                        var $3012 = self.path;
                        var $3013 = Fm$Term$equal$patch$($3012, _a$1, Unit$new);
                        var $2976 = $3013;
                        break;
                    case 'Fm.Term.nat':
                        var $3014 = self.natx;
                        var $3015 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $3015;
                        break;
                    case 'Fm.Term.chr':
                        var $3016 = self.chrx;
                        var $3017 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $3017;
                        break;
                    case 'Fm.Term.str':
                        var $3018 = self.strx;
                        var $3019 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $3019;
                        break;
                    case 'Fm.Term.cse':
                        var $3020 = self.path;
                        var $3021 = self.expr;
                        var $3022 = self.name;
                        var $3023 = self.with;
                        var $3024 = self.cses;
                        var $3025 = self.moti;
                        var $3026 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $2976 = $3026;
                        break;
                    case 'Fm.Term.ori':
                        var $3027 = self.orig;
                        var $3028 = self.expr;
                        var $3029 = Fm$Term$equal$extra_holes$(_a$1, $3028);
                        var $2976 = $3029;
                        break;
                };
                var $2698 = $2976;
                break;
            case 'Fm.Term.let':
                var $3030 = self.name;
                var $3031 = self.expr;
                var $3032 = self.body;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3034 = self.name;
                        var $3035 = self.indx;
                        var $3036 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3036;
                        break;
                    case 'Fm.Term.ref':
                        var $3037 = self.name;
                        var $3038 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3038;
                        break;
                    case 'Fm.Term.typ':
                        var $3039 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3039;
                        break;
                    case 'Fm.Term.all':
                        var $3040 = self.eras;
                        var $3041 = self.self;
                        var $3042 = self.name;
                        var $3043 = self.xtyp;
                        var $3044 = self.body;
                        var $3045 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3045;
                        break;
                    case 'Fm.Term.lam':
                        var $3046 = self.name;
                        var $3047 = self.body;
                        var $3048 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3048;
                        break;
                    case 'Fm.Term.app':
                        var $3049 = self.func;
                        var $3050 = self.argm;
                        var $3051 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3051;
                        break;
                    case 'Fm.Term.let':
                        var $3052 = self.name;
                        var $3053 = self.expr;
                        var $3054 = self.body;
                        var $3055 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3055;
                        break;
                    case 'Fm.Term.def':
                        var $3056 = self.name;
                        var $3057 = self.expr;
                        var $3058 = self.body;
                        var $3059 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3059;
                        break;
                    case 'Fm.Term.ann':
                        var $3060 = self.done;
                        var $3061 = self.term;
                        var $3062 = self.type;
                        var $3063 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3063;
                        break;
                    case 'Fm.Term.gol':
                        var $3064 = self.name;
                        var $3065 = self.dref;
                        var $3066 = self.verb;
                        var $3067 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3067;
                        break;
                    case 'Fm.Term.hol':
                        var $3068 = self.path;
                        var $3069 = Fm$Term$equal$patch$($3068, _a$1, Unit$new);
                        var $3033 = $3069;
                        break;
                    case 'Fm.Term.nat':
                        var $3070 = self.natx;
                        var $3071 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3071;
                        break;
                    case 'Fm.Term.chr':
                        var $3072 = self.chrx;
                        var $3073 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3073;
                        break;
                    case 'Fm.Term.str':
                        var $3074 = self.strx;
                        var $3075 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3075;
                        break;
                    case 'Fm.Term.cse':
                        var $3076 = self.path;
                        var $3077 = self.expr;
                        var $3078 = self.name;
                        var $3079 = self.with;
                        var $3080 = self.cses;
                        var $3081 = self.moti;
                        var $3082 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3033 = $3082;
                        break;
                    case 'Fm.Term.ori':
                        var $3083 = self.orig;
                        var $3084 = self.expr;
                        var $3085 = Fm$Term$equal$extra_holes$(_a$1, $3084);
                        var $3033 = $3085;
                        break;
                };
                var $2698 = $3033;
                break;
            case 'Fm.Term.def':
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
                var $2698 = $3089;
                break;
            case 'Fm.Term.ann':
                var $3142 = self.done;
                var $3143 = self.term;
                var $3144 = self.type;
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
                var $2698 = $3145;
                break;
            case 'Fm.Term.gol':
                var $3198 = self.name;
                var $3199 = self.dref;
                var $3200 = self.verb;
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
                var $2698 = $3201;
                break;
            case 'Fm.Term.hol':
                var $3254 = self.path;
                var $3255 = Fm$Term$equal$patch$($3254, _b$2, Unit$new);
                var $2698 = $3255;
                break;
            case 'Fm.Term.nat':
                var $3256 = self.natx;
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
                var $2698 = $3257;
                break;
            case 'Fm.Term.chr':
                var $3310 = self.chrx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3312 = self.name;
                        var $3313 = self.indx;
                        var $3314 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3314;
                        break;
                    case 'Fm.Term.ref':
                        var $3315 = self.name;
                        var $3316 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3316;
                        break;
                    case 'Fm.Term.typ':
                        var $3317 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3317;
                        break;
                    case 'Fm.Term.all':
                        var $3318 = self.eras;
                        var $3319 = self.self;
                        var $3320 = self.name;
                        var $3321 = self.xtyp;
                        var $3322 = self.body;
                        var $3323 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3323;
                        break;
                    case 'Fm.Term.lam':
                        var $3324 = self.name;
                        var $3325 = self.body;
                        var $3326 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3326;
                        break;
                    case 'Fm.Term.app':
                        var $3327 = self.func;
                        var $3328 = self.argm;
                        var $3329 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3329;
                        break;
                    case 'Fm.Term.let':
                        var $3330 = self.name;
                        var $3331 = self.expr;
                        var $3332 = self.body;
                        var $3333 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3333;
                        break;
                    case 'Fm.Term.def':
                        var $3334 = self.name;
                        var $3335 = self.expr;
                        var $3336 = self.body;
                        var $3337 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3337;
                        break;
                    case 'Fm.Term.ann':
                        var $3338 = self.done;
                        var $3339 = self.term;
                        var $3340 = self.type;
                        var $3341 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3341;
                        break;
                    case 'Fm.Term.gol':
                        var $3342 = self.name;
                        var $3343 = self.dref;
                        var $3344 = self.verb;
                        var $3345 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3345;
                        break;
                    case 'Fm.Term.hol':
                        var $3346 = self.path;
                        var $3347 = Fm$Term$equal$patch$($3346, _a$1, Unit$new);
                        var $3311 = $3347;
                        break;
                    case 'Fm.Term.nat':
                        var $3348 = self.natx;
                        var $3349 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3349;
                        break;
                    case 'Fm.Term.chr':
                        var $3350 = self.chrx;
                        var $3351 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3351;
                        break;
                    case 'Fm.Term.str':
                        var $3352 = self.strx;
                        var $3353 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3353;
                        break;
                    case 'Fm.Term.cse':
                        var $3354 = self.path;
                        var $3355 = self.expr;
                        var $3356 = self.name;
                        var $3357 = self.with;
                        var $3358 = self.cses;
                        var $3359 = self.moti;
                        var $3360 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3311 = $3360;
                        break;
                    case 'Fm.Term.ori':
                        var $3361 = self.orig;
                        var $3362 = self.expr;
                        var $3363 = Fm$Term$equal$extra_holes$(_a$1, $3362);
                        var $3311 = $3363;
                        break;
                };
                var $2698 = $3311;
                break;
            case 'Fm.Term.str':
                var $3364 = self.strx;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3366 = self.name;
                        var $3367 = self.indx;
                        var $3368 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3368;
                        break;
                    case 'Fm.Term.ref':
                        var $3369 = self.name;
                        var $3370 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3370;
                        break;
                    case 'Fm.Term.typ':
                        var $3371 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3371;
                        break;
                    case 'Fm.Term.all':
                        var $3372 = self.eras;
                        var $3373 = self.self;
                        var $3374 = self.name;
                        var $3375 = self.xtyp;
                        var $3376 = self.body;
                        var $3377 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3377;
                        break;
                    case 'Fm.Term.lam':
                        var $3378 = self.name;
                        var $3379 = self.body;
                        var $3380 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3380;
                        break;
                    case 'Fm.Term.app':
                        var $3381 = self.func;
                        var $3382 = self.argm;
                        var $3383 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3383;
                        break;
                    case 'Fm.Term.let':
                        var $3384 = self.name;
                        var $3385 = self.expr;
                        var $3386 = self.body;
                        var $3387 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3387;
                        break;
                    case 'Fm.Term.def':
                        var $3388 = self.name;
                        var $3389 = self.expr;
                        var $3390 = self.body;
                        var $3391 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3391;
                        break;
                    case 'Fm.Term.ann':
                        var $3392 = self.done;
                        var $3393 = self.term;
                        var $3394 = self.type;
                        var $3395 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3395;
                        break;
                    case 'Fm.Term.gol':
                        var $3396 = self.name;
                        var $3397 = self.dref;
                        var $3398 = self.verb;
                        var $3399 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3399;
                        break;
                    case 'Fm.Term.hol':
                        var $3400 = self.path;
                        var $3401 = Fm$Term$equal$patch$($3400, _a$1, Unit$new);
                        var $3365 = $3401;
                        break;
                    case 'Fm.Term.nat':
                        var $3402 = self.natx;
                        var $3403 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3403;
                        break;
                    case 'Fm.Term.chr':
                        var $3404 = self.chrx;
                        var $3405 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3405;
                        break;
                    case 'Fm.Term.str':
                        var $3406 = self.strx;
                        var $3407 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3407;
                        break;
                    case 'Fm.Term.cse':
                        var $3408 = self.path;
                        var $3409 = self.expr;
                        var $3410 = self.name;
                        var $3411 = self.with;
                        var $3412 = self.cses;
                        var $3413 = self.moti;
                        var $3414 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3365 = $3414;
                        break;
                    case 'Fm.Term.ori':
                        var $3415 = self.orig;
                        var $3416 = self.expr;
                        var $3417 = Fm$Term$equal$extra_holes$(_a$1, $3416);
                        var $3365 = $3417;
                        break;
                };
                var $2698 = $3365;
                break;
            case 'Fm.Term.cse':
                var $3418 = self.path;
                var $3419 = self.expr;
                var $3420 = self.name;
                var $3421 = self.with;
                var $3422 = self.cses;
                var $3423 = self.moti;
                var self = _b$2;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $3425 = self.name;
                        var $3426 = self.indx;
                        var $3427 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3427;
                        break;
                    case 'Fm.Term.ref':
                        var $3428 = self.name;
                        var $3429 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3429;
                        break;
                    case 'Fm.Term.typ':
                        var $3430 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3430;
                        break;
                    case 'Fm.Term.all':
                        var $3431 = self.eras;
                        var $3432 = self.self;
                        var $3433 = self.name;
                        var $3434 = self.xtyp;
                        var $3435 = self.body;
                        var $3436 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3436;
                        break;
                    case 'Fm.Term.lam':
                        var $3437 = self.name;
                        var $3438 = self.body;
                        var $3439 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3439;
                        break;
                    case 'Fm.Term.app':
                        var $3440 = self.func;
                        var $3441 = self.argm;
                        var $3442 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3442;
                        break;
                    case 'Fm.Term.let':
                        var $3443 = self.name;
                        var $3444 = self.expr;
                        var $3445 = self.body;
                        var $3446 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3446;
                        break;
                    case 'Fm.Term.def':
                        var $3447 = self.name;
                        var $3448 = self.expr;
                        var $3449 = self.body;
                        var $3450 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3450;
                        break;
                    case 'Fm.Term.ann':
                        var $3451 = self.done;
                        var $3452 = self.term;
                        var $3453 = self.type;
                        var $3454 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3454;
                        break;
                    case 'Fm.Term.gol':
                        var $3455 = self.name;
                        var $3456 = self.dref;
                        var $3457 = self.verb;
                        var $3458 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3458;
                        break;
                    case 'Fm.Term.hol':
                        var $3459 = self.path;
                        var $3460 = Fm$Term$equal$patch$($3459, _a$1, Unit$new);
                        var $3424 = $3460;
                        break;
                    case 'Fm.Term.nat':
                        var $3461 = self.natx;
                        var $3462 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3462;
                        break;
                    case 'Fm.Term.chr':
                        var $3463 = self.chrx;
                        var $3464 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3464;
                        break;
                    case 'Fm.Term.str':
                        var $3465 = self.strx;
                        var $3466 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3466;
                        break;
                    case 'Fm.Term.cse':
                        var $3467 = self.path;
                        var $3468 = self.expr;
                        var $3469 = self.name;
                        var $3470 = self.with;
                        var $3471 = self.cses;
                        var $3472 = self.moti;
                        var $3473 = Monad$pure$(Fm$Check$monad)(Unit$new);
                        var $3424 = $3473;
                        break;
                    case 'Fm.Term.ori':
                        var $3474 = self.orig;
                        var $3475 = self.expr;
                        var $3476 = Fm$Term$equal$extra_holes$(_a$1, $3475);
                        var $3424 = $3476;
                        break;
                };
                var $2698 = $3424;
                break;
            case 'Fm.Term.ori':
                var $3477 = self.orig;
                var $3478 = self.expr;
                var $3479 = Fm$Term$equal$extra_holes$($3478, _b$2);
                var $2698 = $3479;
                break;
        };
        return $2698;
    };
    const Fm$Term$equal$extra_holes = x0 => x1 => Fm$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $3480 = Map$set$(_bits$1, Unit$new, _set$2);
        return $3480;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $3482 = _b$2;
            var $3481 = $3482;
        } else {
            var $3483 = (!_b$2);
            var $3481 = $3483;
        };
        return $3481;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Fm$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Fm$Term$serialize$(Fm$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$e);
        var _bh$7 = Fm$Term$serialize$(Fm$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $3485 = Monad$pure$(Fm$Check$monad)(Bool$true);
            var $3484 = $3485;
        } else {
            var _a1$8 = Fm$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Fm$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Fm$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$e);
            var _bh$11 = Fm$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $3487 = Monad$pure$(Fm$Check$monad)(Bool$true);
                var $3486 = $3487;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = Set$has$(_id$12, _seen$5);
                if (self) {
                    var $3489 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$extra_holes$(_a$1, _b$2))((_$13 => {
                        var $3490 = Monad$pure$(Fm$Check$monad)(Bool$true);
                        return $3490;
                    }));
                    var $3488 = $3489;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Fm.Term.var':
                            var $3492 = self.name;
                            var $3493 = self.indx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3495 = self.name;
                                    var $3496 = self.indx;
                                    var $3497 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3497;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3498 = self.name;
                                    var $3499 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3499;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3500 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3500;
                                    break;
                                case 'Fm.Term.all':
                                    var $3501 = self.eras;
                                    var $3502 = self.self;
                                    var $3503 = self.name;
                                    var $3504 = self.xtyp;
                                    var $3505 = self.body;
                                    var $3506 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3506;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3507 = self.name;
                                    var $3508 = self.body;
                                    var $3509 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3509;
                                    break;
                                case 'Fm.Term.app':
                                    var $3510 = self.func;
                                    var $3511 = self.argm;
                                    var $3512 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3512;
                                    break;
                                case 'Fm.Term.let':
                                    var $3513 = self.name;
                                    var $3514 = self.expr;
                                    var $3515 = self.body;
                                    var $3516 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3516;
                                    break;
                                case 'Fm.Term.def':
                                    var $3517 = self.name;
                                    var $3518 = self.expr;
                                    var $3519 = self.body;
                                    var $3520 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3520;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3521 = self.done;
                                    var $3522 = self.term;
                                    var $3523 = self.type;
                                    var $3524 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3524;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3525 = self.name;
                                    var $3526 = self.dref;
                                    var $3527 = self.verb;
                                    var $3528 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3528;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3529 = self.path;
                                    var $3530 = Fm$Term$equal$patch$($3529, _a$1, Bool$true);
                                    var $3494 = $3530;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3531 = self.natx;
                                    var $3532 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3532;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3533 = self.chrx;
                                    var $3534 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3534;
                                    break;
                                case 'Fm.Term.str':
                                    var $3535 = self.strx;
                                    var $3536 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3536;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3537 = self.path;
                                    var $3538 = self.expr;
                                    var $3539 = self.name;
                                    var $3540 = self.with;
                                    var $3541 = self.cses;
                                    var $3542 = self.moti;
                                    var $3543 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3543;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3544 = self.orig;
                                    var $3545 = self.expr;
                                    var $3546 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3494 = $3546;
                                    break;
                            };
                            var $3491 = $3494;
                            break;
                        case 'Fm.Term.ref':
                            var $3547 = self.name;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3549 = self.name;
                                    var $3550 = self.indx;
                                    var $3551 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3551;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3552 = self.name;
                                    var $3553 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3553;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3554 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3554;
                                    break;
                                case 'Fm.Term.all':
                                    var $3555 = self.eras;
                                    var $3556 = self.self;
                                    var $3557 = self.name;
                                    var $3558 = self.xtyp;
                                    var $3559 = self.body;
                                    var $3560 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3560;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3561 = self.name;
                                    var $3562 = self.body;
                                    var $3563 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3563;
                                    break;
                                case 'Fm.Term.app':
                                    var $3564 = self.func;
                                    var $3565 = self.argm;
                                    var $3566 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3566;
                                    break;
                                case 'Fm.Term.let':
                                    var $3567 = self.name;
                                    var $3568 = self.expr;
                                    var $3569 = self.body;
                                    var $3570 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3570;
                                    break;
                                case 'Fm.Term.def':
                                    var $3571 = self.name;
                                    var $3572 = self.expr;
                                    var $3573 = self.body;
                                    var $3574 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3574;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3575 = self.done;
                                    var $3576 = self.term;
                                    var $3577 = self.type;
                                    var $3578 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3578;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3579 = self.name;
                                    var $3580 = self.dref;
                                    var $3581 = self.verb;
                                    var $3582 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3582;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3583 = self.path;
                                    var $3584 = Fm$Term$equal$patch$($3583, _a$1, Bool$true);
                                    var $3548 = $3584;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3585 = self.natx;
                                    var $3586 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3586;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3587 = self.chrx;
                                    var $3588 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3588;
                                    break;
                                case 'Fm.Term.str':
                                    var $3589 = self.strx;
                                    var $3590 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3590;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3591 = self.path;
                                    var $3592 = self.expr;
                                    var $3593 = self.name;
                                    var $3594 = self.with;
                                    var $3595 = self.cses;
                                    var $3596 = self.moti;
                                    var $3597 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3597;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3598 = self.orig;
                                    var $3599 = self.expr;
                                    var $3600 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3548 = $3600;
                                    break;
                            };
                            var $3491 = $3548;
                            break;
                        case 'Fm.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3602 = self.name;
                                    var $3603 = self.indx;
                                    var $3604 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3604;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3605 = self.name;
                                    var $3606 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3606;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3607 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3607;
                                    break;
                                case 'Fm.Term.all':
                                    var $3608 = self.eras;
                                    var $3609 = self.self;
                                    var $3610 = self.name;
                                    var $3611 = self.xtyp;
                                    var $3612 = self.body;
                                    var $3613 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3613;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3614 = self.name;
                                    var $3615 = self.body;
                                    var $3616 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3616;
                                    break;
                                case 'Fm.Term.app':
                                    var $3617 = self.func;
                                    var $3618 = self.argm;
                                    var $3619 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3619;
                                    break;
                                case 'Fm.Term.let':
                                    var $3620 = self.name;
                                    var $3621 = self.expr;
                                    var $3622 = self.body;
                                    var $3623 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3623;
                                    break;
                                case 'Fm.Term.def':
                                    var $3624 = self.name;
                                    var $3625 = self.expr;
                                    var $3626 = self.body;
                                    var $3627 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3627;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3628 = self.done;
                                    var $3629 = self.term;
                                    var $3630 = self.type;
                                    var $3631 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3631;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3632 = self.name;
                                    var $3633 = self.dref;
                                    var $3634 = self.verb;
                                    var $3635 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3635;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3636 = self.path;
                                    var $3637 = Fm$Term$equal$patch$($3636, _a$1, Bool$true);
                                    var $3601 = $3637;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3638 = self.natx;
                                    var $3639 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3639;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3640 = self.chrx;
                                    var $3641 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3641;
                                    break;
                                case 'Fm.Term.str':
                                    var $3642 = self.strx;
                                    var $3643 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3643;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3644 = self.path;
                                    var $3645 = self.expr;
                                    var $3646 = self.name;
                                    var $3647 = self.with;
                                    var $3648 = self.cses;
                                    var $3649 = self.moti;
                                    var $3650 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3650;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3651 = self.orig;
                                    var $3652 = self.expr;
                                    var $3653 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3601 = $3653;
                                    break;
                            };
                            var $3491 = $3601;
                            break;
                        case 'Fm.Term.all':
                            var $3654 = self.eras;
                            var $3655 = self.self;
                            var $3656 = self.name;
                            var $3657 = self.xtyp;
                            var $3658 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3660 = self.name;
                                    var $3661 = self.indx;
                                    var $3662 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3662;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3663 = self.name;
                                    var $3664 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3664;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3665 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3665;
                                    break;
                                case 'Fm.Term.all':
                                    var $3666 = self.eras;
                                    var $3667 = self.self;
                                    var $3668 = self.name;
                                    var $3669 = self.xtyp;
                                    var $3670 = self.body;
                                    var _seen$23 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$24 = $3658(Fm$Term$var$($3655, _lv$4))(Fm$Term$var$($3656, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $3670(Fm$Term$var$($3667, _lv$4))(Fm$Term$var$($3668, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($3655 === $3667);
                                    var _eq_eras$27 = Bool$eql$($3654, $3666);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var $3672 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3657, $3669, _defs$3, _lv$4, _seen$23))((_eq_type$28 => {
                                            var $3673 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23))((_eq_body$29 => {
                                                var $3674 = Monad$pure$(Fm$Check$monad)((_eq_type$28 && _eq_body$29));
                                                return $3674;
                                            }));
                                            return $3673;
                                        }));
                                        var $3671 = $3672;
                                    } else {
                                        var $3675 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                        var $3671 = $3675;
                                    };
                                    var $3659 = $3671;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3676 = self.name;
                                    var $3677 = self.body;
                                    var $3678 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3678;
                                    break;
                                case 'Fm.Term.app':
                                    var $3679 = self.func;
                                    var $3680 = self.argm;
                                    var $3681 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3681;
                                    break;
                                case 'Fm.Term.let':
                                    var $3682 = self.name;
                                    var $3683 = self.expr;
                                    var $3684 = self.body;
                                    var $3685 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3685;
                                    break;
                                case 'Fm.Term.def':
                                    var $3686 = self.name;
                                    var $3687 = self.expr;
                                    var $3688 = self.body;
                                    var $3689 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3689;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3690 = self.done;
                                    var $3691 = self.term;
                                    var $3692 = self.type;
                                    var $3693 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3693;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3694 = self.name;
                                    var $3695 = self.dref;
                                    var $3696 = self.verb;
                                    var $3697 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3697;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3698 = self.path;
                                    var $3699 = Fm$Term$equal$patch$($3698, _a$1, Bool$true);
                                    var $3659 = $3699;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3700 = self.natx;
                                    var $3701 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3701;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3702 = self.chrx;
                                    var $3703 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3703;
                                    break;
                                case 'Fm.Term.str':
                                    var $3704 = self.strx;
                                    var $3705 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3705;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3706 = self.path;
                                    var $3707 = self.expr;
                                    var $3708 = self.name;
                                    var $3709 = self.with;
                                    var $3710 = self.cses;
                                    var $3711 = self.moti;
                                    var $3712 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3712;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3713 = self.orig;
                                    var $3714 = self.expr;
                                    var $3715 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3659 = $3715;
                                    break;
                            };
                            var $3491 = $3659;
                            break;
                        case 'Fm.Term.lam':
                            var $3716 = self.name;
                            var $3717 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3719 = self.name;
                                    var $3720 = self.indx;
                                    var $3721 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3721;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3722 = self.name;
                                    var $3723 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3723;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3724 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3724;
                                    break;
                                case 'Fm.Term.all':
                                    var $3725 = self.eras;
                                    var $3726 = self.self;
                                    var $3727 = self.name;
                                    var $3728 = self.xtyp;
                                    var $3729 = self.body;
                                    var $3730 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3730;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3731 = self.name;
                                    var $3732 = self.body;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$18 = $3717(Fm$Term$var$($3716, _lv$4));
                                    var _b1_body$19 = $3732(Fm$Term$var$($3731, _lv$4));
                                    var $3733 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17))((_eq_body$20 => {
                                        var $3734 = Monad$pure$(Fm$Check$monad)(_eq_body$20);
                                        return $3734;
                                    }));
                                    var $3718 = $3733;
                                    break;
                                case 'Fm.Term.app':
                                    var $3735 = self.func;
                                    var $3736 = self.argm;
                                    var $3737 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3737;
                                    break;
                                case 'Fm.Term.let':
                                    var $3738 = self.name;
                                    var $3739 = self.expr;
                                    var $3740 = self.body;
                                    var $3741 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3741;
                                    break;
                                case 'Fm.Term.def':
                                    var $3742 = self.name;
                                    var $3743 = self.expr;
                                    var $3744 = self.body;
                                    var $3745 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3745;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3746 = self.done;
                                    var $3747 = self.term;
                                    var $3748 = self.type;
                                    var $3749 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3749;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3750 = self.name;
                                    var $3751 = self.dref;
                                    var $3752 = self.verb;
                                    var $3753 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3753;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3754 = self.path;
                                    var $3755 = Fm$Term$equal$patch$($3754, _a$1, Bool$true);
                                    var $3718 = $3755;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3756 = self.natx;
                                    var $3757 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3757;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3758 = self.chrx;
                                    var $3759 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3759;
                                    break;
                                case 'Fm.Term.str':
                                    var $3760 = self.strx;
                                    var $3761 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3761;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3762 = self.path;
                                    var $3763 = self.expr;
                                    var $3764 = self.name;
                                    var $3765 = self.with;
                                    var $3766 = self.cses;
                                    var $3767 = self.moti;
                                    var $3768 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3768;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3769 = self.orig;
                                    var $3770 = self.expr;
                                    var $3771 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3718 = $3771;
                                    break;
                            };
                            var $3491 = $3718;
                            break;
                        case 'Fm.Term.app':
                            var $3772 = self.func;
                            var $3773 = self.argm;
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
                                    var $3789 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3789;
                                    break;
                                case 'Fm.Term.app':
                                    var $3790 = self.func;
                                    var $3791 = self.argm;
                                    var _seen$17 = Set$set$(_id$12, _seen$5);
                                    var $3792 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3772, $3790, _defs$3, _lv$4, _seen$17))((_eq_func$18 => {
                                        var $3793 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3773, $3791, _defs$3, _lv$4, _seen$17))((_eq_argm$19 => {
                                            var $3794 = Monad$pure$(Fm$Check$monad)((_eq_func$18 && _eq_argm$19));
                                            return $3794;
                                        }));
                                        return $3793;
                                    }));
                                    var $3774 = $3792;
                                    break;
                                case 'Fm.Term.let':
                                    var $3795 = self.name;
                                    var $3796 = self.expr;
                                    var $3797 = self.body;
                                    var $3798 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3798;
                                    break;
                                case 'Fm.Term.def':
                                    var $3799 = self.name;
                                    var $3800 = self.expr;
                                    var $3801 = self.body;
                                    var $3802 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3802;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3803 = self.done;
                                    var $3804 = self.term;
                                    var $3805 = self.type;
                                    var $3806 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3806;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3807 = self.name;
                                    var $3808 = self.dref;
                                    var $3809 = self.verb;
                                    var $3810 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3810;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3811 = self.path;
                                    var $3812 = Fm$Term$equal$patch$($3811, _a$1, Bool$true);
                                    var $3774 = $3812;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3813 = self.natx;
                                    var $3814 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3814;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3815 = self.chrx;
                                    var $3816 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3816;
                                    break;
                                case 'Fm.Term.str':
                                    var $3817 = self.strx;
                                    var $3818 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3818;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3819 = self.path;
                                    var $3820 = self.expr;
                                    var $3821 = self.name;
                                    var $3822 = self.with;
                                    var $3823 = self.cses;
                                    var $3824 = self.moti;
                                    var $3825 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3825;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3826 = self.orig;
                                    var $3827 = self.expr;
                                    var $3828 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3774 = $3828;
                                    break;
                            };
                            var $3491 = $3774;
                            break;
                        case 'Fm.Term.let':
                            var $3829 = self.name;
                            var $3830 = self.expr;
                            var $3831 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3833 = self.name;
                                    var $3834 = self.indx;
                                    var $3835 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3835;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3836 = self.name;
                                    var $3837 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3837;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3838 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3838;
                                    break;
                                case 'Fm.Term.all':
                                    var $3839 = self.eras;
                                    var $3840 = self.self;
                                    var $3841 = self.name;
                                    var $3842 = self.xtyp;
                                    var $3843 = self.body;
                                    var $3844 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3844;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3845 = self.name;
                                    var $3846 = self.body;
                                    var $3847 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3847;
                                    break;
                                case 'Fm.Term.app':
                                    var $3848 = self.func;
                                    var $3849 = self.argm;
                                    var $3850 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3850;
                                    break;
                                case 'Fm.Term.let':
                                    var $3851 = self.name;
                                    var $3852 = self.expr;
                                    var $3853 = self.body;
                                    var _seen$19 = Set$set$(_id$12, _seen$5);
                                    var _a1_body$20 = $3831(Fm$Term$var$($3829, _lv$4));
                                    var _b1_body$21 = $3853(Fm$Term$var$($3851, _lv$4));
                                    var $3854 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($3830, $3852, _defs$3, _lv$4, _seen$19))((_eq_expr$22 => {
                                        var $3855 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19))((_eq_body$23 => {
                                            var $3856 = Monad$pure$(Fm$Check$monad)((_eq_expr$22 && _eq_body$23));
                                            return $3856;
                                        }));
                                        return $3855;
                                    }));
                                    var $3832 = $3854;
                                    break;
                                case 'Fm.Term.def':
                                    var $3857 = self.name;
                                    var $3858 = self.expr;
                                    var $3859 = self.body;
                                    var $3860 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3860;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3861 = self.done;
                                    var $3862 = self.term;
                                    var $3863 = self.type;
                                    var $3864 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3864;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3865 = self.name;
                                    var $3866 = self.dref;
                                    var $3867 = self.verb;
                                    var $3868 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3868;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3869 = self.path;
                                    var $3870 = Fm$Term$equal$patch$($3869, _a$1, Bool$true);
                                    var $3832 = $3870;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3871 = self.natx;
                                    var $3872 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3872;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3873 = self.chrx;
                                    var $3874 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3874;
                                    break;
                                case 'Fm.Term.str':
                                    var $3875 = self.strx;
                                    var $3876 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3876;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3877 = self.path;
                                    var $3878 = self.expr;
                                    var $3879 = self.name;
                                    var $3880 = self.with;
                                    var $3881 = self.cses;
                                    var $3882 = self.moti;
                                    var $3883 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3883;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3884 = self.orig;
                                    var $3885 = self.expr;
                                    var $3886 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3832 = $3886;
                                    break;
                            };
                            var $3491 = $3832;
                            break;
                        case 'Fm.Term.def':
                            var $3887 = self.name;
                            var $3888 = self.expr;
                            var $3889 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $3891 = self.name;
                                    var $3892 = self.indx;
                                    var $3893 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3893;
                                    break;
                                case 'Fm.Term.ref':
                                    var $3894 = self.name;
                                    var $3895 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3895;
                                    break;
                                case 'Fm.Term.typ':
                                    var $3896 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3896;
                                    break;
                                case 'Fm.Term.all':
                                    var $3897 = self.eras;
                                    var $3898 = self.self;
                                    var $3899 = self.name;
                                    var $3900 = self.xtyp;
                                    var $3901 = self.body;
                                    var $3902 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3902;
                                    break;
                                case 'Fm.Term.lam':
                                    var $3903 = self.name;
                                    var $3904 = self.body;
                                    var $3905 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3905;
                                    break;
                                case 'Fm.Term.app':
                                    var $3906 = self.func;
                                    var $3907 = self.argm;
                                    var $3908 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3908;
                                    break;
                                case 'Fm.Term.let':
                                    var $3909 = self.name;
                                    var $3910 = self.expr;
                                    var $3911 = self.body;
                                    var $3912 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3912;
                                    break;
                                case 'Fm.Term.def':
                                    var $3913 = self.name;
                                    var $3914 = self.expr;
                                    var $3915 = self.body;
                                    var $3916 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3916;
                                    break;
                                case 'Fm.Term.ann':
                                    var $3917 = self.done;
                                    var $3918 = self.term;
                                    var $3919 = self.type;
                                    var $3920 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3920;
                                    break;
                                case 'Fm.Term.gol':
                                    var $3921 = self.name;
                                    var $3922 = self.dref;
                                    var $3923 = self.verb;
                                    var $3924 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3924;
                                    break;
                                case 'Fm.Term.hol':
                                    var $3925 = self.path;
                                    var $3926 = Fm$Term$equal$patch$($3925, _a$1, Bool$true);
                                    var $3890 = $3926;
                                    break;
                                case 'Fm.Term.nat':
                                    var $3927 = self.natx;
                                    var $3928 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3928;
                                    break;
                                case 'Fm.Term.chr':
                                    var $3929 = self.chrx;
                                    var $3930 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3930;
                                    break;
                                case 'Fm.Term.str':
                                    var $3931 = self.strx;
                                    var $3932 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3932;
                                    break;
                                case 'Fm.Term.cse':
                                    var $3933 = self.path;
                                    var $3934 = self.expr;
                                    var $3935 = self.name;
                                    var $3936 = self.with;
                                    var $3937 = self.cses;
                                    var $3938 = self.moti;
                                    var $3939 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3939;
                                    break;
                                case 'Fm.Term.ori':
                                    var $3940 = self.orig;
                                    var $3941 = self.expr;
                                    var $3942 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $3890 = $3942;
                                    break;
                            };
                            var $3491 = $3890;
                            break;
                        case 'Fm.Term.ann':
                            var $3943 = self.done;
                            var $3944 = self.term;
                            var $3945 = self.type;
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
                            var $3491 = $3946;
                            break;
                        case 'Fm.Term.gol':
                            var $3999 = self.name;
                            var $4000 = self.dref;
                            var $4001 = self.verb;
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
                            var $3491 = $4002;
                            break;
                        case 'Fm.Term.hol':
                            var $4055 = self.path;
                            var $4056 = Fm$Term$equal$patch$($4055, _b$2, Bool$true);
                            var $3491 = $4056;
                            break;
                        case 'Fm.Term.nat':
                            var $4057 = self.natx;
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
                            var $3491 = $4058;
                            break;
                        case 'Fm.Term.chr':
                            var $4111 = self.chrx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4113 = self.name;
                                    var $4114 = self.indx;
                                    var $4115 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4115;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4116 = self.name;
                                    var $4117 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4117;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4118 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4118;
                                    break;
                                case 'Fm.Term.all':
                                    var $4119 = self.eras;
                                    var $4120 = self.self;
                                    var $4121 = self.name;
                                    var $4122 = self.xtyp;
                                    var $4123 = self.body;
                                    var $4124 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4124;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4125 = self.name;
                                    var $4126 = self.body;
                                    var $4127 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4127;
                                    break;
                                case 'Fm.Term.app':
                                    var $4128 = self.func;
                                    var $4129 = self.argm;
                                    var $4130 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4130;
                                    break;
                                case 'Fm.Term.let':
                                    var $4131 = self.name;
                                    var $4132 = self.expr;
                                    var $4133 = self.body;
                                    var $4134 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4134;
                                    break;
                                case 'Fm.Term.def':
                                    var $4135 = self.name;
                                    var $4136 = self.expr;
                                    var $4137 = self.body;
                                    var $4138 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4138;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4139 = self.done;
                                    var $4140 = self.term;
                                    var $4141 = self.type;
                                    var $4142 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4142;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4143 = self.name;
                                    var $4144 = self.dref;
                                    var $4145 = self.verb;
                                    var $4146 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4146;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4147 = self.path;
                                    var $4148 = Fm$Term$equal$patch$($4147, _a$1, Bool$true);
                                    var $4112 = $4148;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4149 = self.natx;
                                    var $4150 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4150;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4151 = self.chrx;
                                    var $4152 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4152;
                                    break;
                                case 'Fm.Term.str':
                                    var $4153 = self.strx;
                                    var $4154 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4154;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4155 = self.path;
                                    var $4156 = self.expr;
                                    var $4157 = self.name;
                                    var $4158 = self.with;
                                    var $4159 = self.cses;
                                    var $4160 = self.moti;
                                    var $4161 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4161;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4162 = self.orig;
                                    var $4163 = self.expr;
                                    var $4164 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4112 = $4164;
                                    break;
                            };
                            var $3491 = $4112;
                            break;
                        case 'Fm.Term.str':
                            var $4165 = self.strx;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4167 = self.name;
                                    var $4168 = self.indx;
                                    var $4169 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4169;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4170 = self.name;
                                    var $4171 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4171;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4172 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4172;
                                    break;
                                case 'Fm.Term.all':
                                    var $4173 = self.eras;
                                    var $4174 = self.self;
                                    var $4175 = self.name;
                                    var $4176 = self.xtyp;
                                    var $4177 = self.body;
                                    var $4178 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4178;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4179 = self.name;
                                    var $4180 = self.body;
                                    var $4181 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4181;
                                    break;
                                case 'Fm.Term.app':
                                    var $4182 = self.func;
                                    var $4183 = self.argm;
                                    var $4184 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4184;
                                    break;
                                case 'Fm.Term.let':
                                    var $4185 = self.name;
                                    var $4186 = self.expr;
                                    var $4187 = self.body;
                                    var $4188 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4188;
                                    break;
                                case 'Fm.Term.def':
                                    var $4189 = self.name;
                                    var $4190 = self.expr;
                                    var $4191 = self.body;
                                    var $4192 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4192;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4193 = self.done;
                                    var $4194 = self.term;
                                    var $4195 = self.type;
                                    var $4196 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4196;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4197 = self.name;
                                    var $4198 = self.dref;
                                    var $4199 = self.verb;
                                    var $4200 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4200;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4201 = self.path;
                                    var $4202 = Fm$Term$equal$patch$($4201, _a$1, Bool$true);
                                    var $4166 = $4202;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4203 = self.natx;
                                    var $4204 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4204;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4205 = self.chrx;
                                    var $4206 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4206;
                                    break;
                                case 'Fm.Term.str':
                                    var $4207 = self.strx;
                                    var $4208 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4208;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4209 = self.path;
                                    var $4210 = self.expr;
                                    var $4211 = self.name;
                                    var $4212 = self.with;
                                    var $4213 = self.cses;
                                    var $4214 = self.moti;
                                    var $4215 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4215;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4216 = self.orig;
                                    var $4217 = self.expr;
                                    var $4218 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4166 = $4218;
                                    break;
                            };
                            var $3491 = $4166;
                            break;
                        case 'Fm.Term.cse':
                            var $4219 = self.path;
                            var $4220 = self.expr;
                            var $4221 = self.name;
                            var $4222 = self.with;
                            var $4223 = self.cses;
                            var $4224 = self.moti;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4226 = self.name;
                                    var $4227 = self.indx;
                                    var $4228 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4228;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4229 = self.name;
                                    var $4230 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4230;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4231 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4231;
                                    break;
                                case 'Fm.Term.all':
                                    var $4232 = self.eras;
                                    var $4233 = self.self;
                                    var $4234 = self.name;
                                    var $4235 = self.xtyp;
                                    var $4236 = self.body;
                                    var $4237 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4237;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4238 = self.name;
                                    var $4239 = self.body;
                                    var $4240 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4240;
                                    break;
                                case 'Fm.Term.app':
                                    var $4241 = self.func;
                                    var $4242 = self.argm;
                                    var $4243 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4243;
                                    break;
                                case 'Fm.Term.let':
                                    var $4244 = self.name;
                                    var $4245 = self.expr;
                                    var $4246 = self.body;
                                    var $4247 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4247;
                                    break;
                                case 'Fm.Term.def':
                                    var $4248 = self.name;
                                    var $4249 = self.expr;
                                    var $4250 = self.body;
                                    var $4251 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4251;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4252 = self.done;
                                    var $4253 = self.term;
                                    var $4254 = self.type;
                                    var $4255 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4255;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4256 = self.name;
                                    var $4257 = self.dref;
                                    var $4258 = self.verb;
                                    var $4259 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4259;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4260 = self.path;
                                    var $4261 = Fm$Term$equal$patch$($4260, _a$1, Bool$true);
                                    var $4225 = $4261;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4262 = self.natx;
                                    var $4263 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4263;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4264 = self.chrx;
                                    var $4265 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4265;
                                    break;
                                case 'Fm.Term.str':
                                    var $4266 = self.strx;
                                    var $4267 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4267;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4268 = self.path;
                                    var $4269 = self.expr;
                                    var $4270 = self.name;
                                    var $4271 = self.with;
                                    var $4272 = self.cses;
                                    var $4273 = self.moti;
                                    var $4274 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4274;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4275 = self.orig;
                                    var $4276 = self.expr;
                                    var $4277 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4225 = $4277;
                                    break;
                            };
                            var $3491 = $4225;
                            break;
                        case 'Fm.Term.ori':
                            var $4278 = self.orig;
                            var $4279 = self.expr;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4281 = self.name;
                                    var $4282 = self.indx;
                                    var $4283 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4283;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4284 = self.name;
                                    var $4285 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4285;
                                    break;
                                case 'Fm.Term.typ':
                                    var $4286 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4286;
                                    break;
                                case 'Fm.Term.all':
                                    var $4287 = self.eras;
                                    var $4288 = self.self;
                                    var $4289 = self.name;
                                    var $4290 = self.xtyp;
                                    var $4291 = self.body;
                                    var $4292 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4292;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4293 = self.name;
                                    var $4294 = self.body;
                                    var $4295 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4295;
                                    break;
                                case 'Fm.Term.app':
                                    var $4296 = self.func;
                                    var $4297 = self.argm;
                                    var $4298 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4298;
                                    break;
                                case 'Fm.Term.let':
                                    var $4299 = self.name;
                                    var $4300 = self.expr;
                                    var $4301 = self.body;
                                    var $4302 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4302;
                                    break;
                                case 'Fm.Term.def':
                                    var $4303 = self.name;
                                    var $4304 = self.expr;
                                    var $4305 = self.body;
                                    var $4306 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4306;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4307 = self.done;
                                    var $4308 = self.term;
                                    var $4309 = self.type;
                                    var $4310 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4310;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4311 = self.name;
                                    var $4312 = self.dref;
                                    var $4313 = self.verb;
                                    var $4314 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4314;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4315 = self.path;
                                    var $4316 = Fm$Term$equal$patch$($4315, _a$1, Bool$true);
                                    var $4280 = $4316;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4317 = self.natx;
                                    var $4318 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4318;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4319 = self.chrx;
                                    var $4320 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4320;
                                    break;
                                case 'Fm.Term.str':
                                    var $4321 = self.strx;
                                    var $4322 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4322;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4323 = self.path;
                                    var $4324 = self.expr;
                                    var $4325 = self.name;
                                    var $4326 = self.with;
                                    var $4327 = self.cses;
                                    var $4328 = self.moti;
                                    var $4329 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4329;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4330 = self.orig;
                                    var $4331 = self.expr;
                                    var $4332 = Monad$pure$(Fm$Check$monad)(Bool$false);
                                    var $4280 = $4332;
                                    break;
                            };
                            var $3491 = $4280;
                            break;
                    };
                    var $3488 = $3491;
                };
                var $3486 = $3488;
            };
            var $3484 = $3486;
        };
        return $3484;
    };
    const Fm$Term$equal = x0 => x1 => x2 => x3 => x4 => Fm$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;

    function Fm$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var $4333 = Monad$bind$(Fm$Check$monad)((() => {
            var self = _term$1;
            switch (self._) {
                case 'Fm.Term.var':
                    var $4334 = self.name;
                    var $4335 = self.indx;
                    var self = List$at_last$($4335, _ctx$4);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4337 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4334), List$nil));
                            var $4336 = $4337;
                            break;
                        case 'Maybe.some':
                            var $4338 = self.value;
                            var $4339 = Monad$pure$(Fm$Check$monad)((() => {
                                var self = $4338;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4340 = self.fst;
                                        var $4341 = self.snd;
                                        var $4342 = $4341;
                                        return $4342;
                                };
                            })());
                            var $4336 = $4339;
                            break;
                    };
                    return $4336;
                case 'Fm.Term.ref':
                    var $4343 = self.name;
                    var self = Fm$get$($4343, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $4345 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$undefined_reference$(_orig$6, $4343), List$nil));
                            var $4344 = $4345;
                            break;
                        case 'Maybe.some':
                            var $4346 = self.value;
                            var self = $4346;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $4348 = self.file;
                                    var $4349 = self.code;
                                    var $4350 = self.name;
                                    var $4351 = self.term;
                                    var $4352 = self.type;
                                    var $4353 = self.stat;
                                    var _ref_name$15 = $4350;
                                    var _ref_type$16 = $4352;
                                    var _ref_term$17 = $4351;
                                    var _ref_stat$18 = $4353;
                                    var self = _ref_stat$18;
                                    switch (self._) {
                                        case 'Fm.Status.init':
                                            var $4355 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$waiting$(_ref_name$15), List$nil));
                                            var $4354 = $4355;
                                            break;
                                        case 'Fm.Status.wait':
                                            var $4356 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4354 = $4356;
                                            break;
                                        case 'Fm.Status.done':
                                            var $4357 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$nil);
                                            var $4354 = $4357;
                                            break;
                                        case 'Fm.Status.fail':
                                            var $4358 = self.errors;
                                            var $4359 = Fm$Check$result$(Maybe$some$(_ref_type$16), List$cons$(Fm$Error$indirect$(_ref_name$15), List$nil));
                                            var $4354 = $4359;
                                            break;
                                    };
                                    var $4347 = $4354;
                                    break;
                            };
                            var $4344 = $4347;
                            break;
                    };
                    return $4344;
                case 'Fm.Term.typ':
                    var $4360 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                    return $4360;
                case 'Fm.Term.all':
                    var $4361 = self.eras;
                    var $4362 = self.self;
                    var $4363 = self.name;
                    var $4364 = self.xtyp;
                    var $4365 = self.body;
                    var _ctx_size$12 = List$length$(_ctx$4);
                    var _self_var$13 = Fm$Term$var$($4362, _ctx_size$12);
                    var _body_var$14 = Fm$Term$var$($4363, Nat$succ$(_ctx_size$12));
                    var _body_ctx$15 = List$cons$(Pair$new$($4363, $4364), List$cons$(Pair$new$($4362, _term$1), _ctx$4));
                    var $4366 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4364, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$16 => {
                        var $4367 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4365(_self_var$13)(_body_var$14), Maybe$some$(Fm$Term$typ), _defs$3, _body_ctx$15, Fm$MPath$i$(_path$5), _orig$6))((_$17 => {
                            var $4368 = Monad$pure$(Fm$Check$monad)(Fm$Term$typ);
                            return $4368;
                        }));
                        return $4367;
                    }));
                    return $4366;
                case 'Fm.Term.lam':
                    var $4369 = self.name;
                    var $4370 = self.body;
                    var self = _type$2;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4372 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                            var $4371 = $4372;
                            break;
                        case 'Maybe.some':
                            var $4373 = self.value;
                            var _typv$10 = Fm$Term$reduce$($4373, _defs$3);
                            var self = _typv$10;
                            switch (self._) {
                                case 'Fm.Term.var':
                                    var $4375 = self.name;
                                    var $4376 = self.indx;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4373);
                                    var $4377 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4374 = $4377;
                                    break;
                                case 'Fm.Term.ref':
                                    var $4378 = self.name;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4373);
                                    var $4379 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4374 = $4379;
                                    break;
                                case 'Fm.Term.typ':
                                    var _expected$11 = Either$left$("Function");
                                    var _detected$12 = Either$right$($4373);
                                    var $4380 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                    var $4374 = $4380;
                                    break;
                                case 'Fm.Term.all':
                                    var $4381 = self.eras;
                                    var $4382 = self.self;
                                    var $4383 = self.name;
                                    var $4384 = self.xtyp;
                                    var $4385 = self.body;
                                    var _ctx_size$16 = List$length$(_ctx$4);
                                    var _self_var$17 = _term$1;
                                    var _body_var$18 = Fm$Term$var$($4369, _ctx_size$16);
                                    var _body_typ$19 = $4385(_self_var$17)(_body_var$18);
                                    var _body_ctx$20 = List$cons$(Pair$new$($4369, $4384), _ctx$4);
                                    var $4386 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4370(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Fm$MPath$o$(_path$5), _orig$6))((_$21 => {
                                        var $4387 = Monad$pure$(Fm$Check$monad)($4373);
                                        return $4387;
                                    }));
                                    var $4374 = $4386;
                                    break;
                                case 'Fm.Term.lam':
                                    var $4388 = self.name;
                                    var $4389 = self.body;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4373);
                                    var $4390 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4374 = $4390;
                                    break;
                                case 'Fm.Term.app':
                                    var $4391 = self.func;
                                    var $4392 = self.argm;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4373);
                                    var $4393 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4374 = $4393;
                                    break;
                                case 'Fm.Term.let':
                                    var $4394 = self.name;
                                    var $4395 = self.expr;
                                    var $4396 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4373);
                                    var $4397 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4374 = $4397;
                                    break;
                                case 'Fm.Term.def':
                                    var $4398 = self.name;
                                    var $4399 = self.expr;
                                    var $4400 = self.body;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4373);
                                    var $4401 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4374 = $4401;
                                    break;
                                case 'Fm.Term.ann':
                                    var $4402 = self.done;
                                    var $4403 = self.term;
                                    var $4404 = self.type;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4373);
                                    var $4405 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4374 = $4405;
                                    break;
                                case 'Fm.Term.gol':
                                    var $4406 = self.name;
                                    var $4407 = self.dref;
                                    var $4408 = self.verb;
                                    var _expected$14 = Either$left$("Function");
                                    var _detected$15 = Either$right$($4373);
                                    var $4409 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                    var $4374 = $4409;
                                    break;
                                case 'Fm.Term.hol':
                                    var $4410 = self.path;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4373);
                                    var $4411 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4374 = $4411;
                                    break;
                                case 'Fm.Term.nat':
                                    var $4412 = self.natx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4373);
                                    var $4413 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4374 = $4413;
                                    break;
                                case 'Fm.Term.chr':
                                    var $4414 = self.chrx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4373);
                                    var $4415 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4374 = $4415;
                                    break;
                                case 'Fm.Term.str':
                                    var $4416 = self.strx;
                                    var _expected$12 = Either$left$("Function");
                                    var _detected$13 = Either$right$($4373);
                                    var $4417 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                    var $4374 = $4417;
                                    break;
                                case 'Fm.Term.cse':
                                    var $4418 = self.path;
                                    var $4419 = self.expr;
                                    var $4420 = self.name;
                                    var $4421 = self.with;
                                    var $4422 = self.cses;
                                    var $4423 = self.moti;
                                    var _expected$17 = Either$left$("Function");
                                    var _detected$18 = Either$right$($4373);
                                    var $4424 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                    var $4374 = $4424;
                                    break;
                                case 'Fm.Term.ori':
                                    var $4425 = self.orig;
                                    var $4426 = self.expr;
                                    var _expected$13 = Either$left$("Function");
                                    var _detected$14 = Either$right$($4373);
                                    var $4427 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                    var $4374 = $4427;
                                    break;
                            };
                            var $4371 = $4374;
                            break;
                    };
                    return $4371;
                case 'Fm.Term.app':
                    var $4428 = self.func;
                    var $4429 = self.argm;
                    var $4430 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4428, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_func_typ$9 => {
                        var _func_typ$10 = Fm$Term$reduce$(_func_typ$9, _defs$3);
                        var self = _func_typ$10;
                        switch (self._) {
                            case 'Fm.Term.var':
                                var $4432 = self.name;
                                var $4433 = self.indx;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4434 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4431 = $4434;
                                break;
                            case 'Fm.Term.ref':
                                var $4435 = self.name;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4436 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4431 = $4436;
                                break;
                            case 'Fm.Term.typ':
                                var _expected$11 = Either$left$("Function");
                                var _detected$12 = Either$right$(_func_typ$10);
                                var $4437 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4431 = $4437;
                                break;
                            case 'Fm.Term.all':
                                var $4438 = self.eras;
                                var $4439 = self.self;
                                var $4440 = self.name;
                                var $4441 = self.xtyp;
                                var $4442 = self.body;
                                var $4443 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4429, Maybe$some$($4441), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$16 => {
                                    var $4444 = Monad$pure$(Fm$Check$monad)($4442($4428)($4429));
                                    return $4444;
                                }));
                                var $4431 = $4443;
                                break;
                            case 'Fm.Term.lam':
                                var $4445 = self.name;
                                var $4446 = self.body;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4447 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4431 = $4447;
                                break;
                            case 'Fm.Term.app':
                                var $4448 = self.func;
                                var $4449 = self.argm;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4450 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4431 = $4450;
                                break;
                            case 'Fm.Term.let':
                                var $4451 = self.name;
                                var $4452 = self.expr;
                                var $4453 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4454 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4431 = $4454;
                                break;
                            case 'Fm.Term.def':
                                var $4455 = self.name;
                                var $4456 = self.expr;
                                var $4457 = self.body;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4458 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4431 = $4458;
                                break;
                            case 'Fm.Term.ann':
                                var $4459 = self.done;
                                var $4460 = self.term;
                                var $4461 = self.type;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4462 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4431 = $4462;
                                break;
                            case 'Fm.Term.gol':
                                var $4463 = self.name;
                                var $4464 = self.dref;
                                var $4465 = self.verb;
                                var _expected$14 = Either$left$("Function");
                                var _detected$15 = Either$right$(_func_typ$10);
                                var $4466 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4431 = $4466;
                                break;
                            case 'Fm.Term.hol':
                                var $4467 = self.path;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4468 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4431 = $4468;
                                break;
                            case 'Fm.Term.nat':
                                var $4469 = self.natx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4470 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4431 = $4470;
                                break;
                            case 'Fm.Term.chr':
                                var $4471 = self.chrx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4472 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4431 = $4472;
                                break;
                            case 'Fm.Term.str':
                                var $4473 = self.strx;
                                var _expected$12 = Either$left$("Function");
                                var _detected$13 = Either$right$(_func_typ$10);
                                var $4474 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4431 = $4474;
                                break;
                            case 'Fm.Term.cse':
                                var $4475 = self.path;
                                var $4476 = self.expr;
                                var $4477 = self.name;
                                var $4478 = self.with;
                                var $4479 = self.cses;
                                var $4480 = self.moti;
                                var _expected$17 = Either$left$("Function");
                                var _detected$18 = Either$right$(_func_typ$10);
                                var $4481 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4431 = $4481;
                                break;
                            case 'Fm.Term.ori':
                                var $4482 = self.orig;
                                var $4483 = self.expr;
                                var _expected$13 = Either$left$("Function");
                                var _detected$14 = Either$right$(_func_typ$10);
                                var $4484 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4431 = $4484;
                                break;
                        };
                        return $4431;
                    }));
                    return $4430;
                case 'Fm.Term.let':
                    var $4485 = self.name;
                    var $4486 = self.expr;
                    var $4487 = self.body;
                    var _ctx_size$10 = List$length$(_ctx$4);
                    var $4488 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4486, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_expr_typ$11 => {
                        var _body_val$12 = $4487(Fm$Term$var$($4485, _ctx_size$10));
                        var _body_ctx$13 = List$cons$(Pair$new$($4485, _expr_typ$11), _ctx$4);
                        var $4489 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_body_val$12, _type$2, _defs$3, _body_ctx$13, Fm$MPath$i$(_path$5), _orig$6))((_body_typ$14 => {
                            var $4490 = Monad$pure$(Fm$Check$monad)(_body_typ$14);
                            return $4490;
                        }));
                        return $4489;
                    }));
                    return $4488;
                case 'Fm.Term.def':
                    var $4491 = self.name;
                    var $4492 = self.expr;
                    var $4493 = self.body;
                    var $4494 = Fm$Term$check$($4493($4492), _type$2, _defs$3, _ctx$4, _path$5, _orig$6);
                    return $4494;
                case 'Fm.Term.ann':
                    var $4495 = self.done;
                    var $4496 = self.term;
                    var $4497 = self.type;
                    var self = $4495;
                    if (self) {
                        var $4499 = Monad$pure$(Fm$Check$monad)($4497);
                        var $4498 = $4499;
                    } else {
                        var $4500 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4496, Maybe$some$($4497), _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_$10 => {
                            var $4501 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$($4497, Maybe$some$(Fm$Term$typ), _defs$3, _ctx$4, Fm$MPath$i$(_path$5), _orig$6))((_$11 => {
                                var $4502 = Monad$pure$(Fm$Check$monad)($4497);
                                return $4502;
                            }));
                            return $4501;
                        }));
                        var $4498 = $4500;
                    };
                    return $4498;
                case 'Fm.Term.gol':
                    var $4503 = self.name;
                    var $4504 = self.dref;
                    var $4505 = self.verb;
                    var $4506 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$show_goal$($4503, $4504, $4505, _type$2, _ctx$4), List$nil));
                    return $4506;
                case 'Fm.Term.hol':
                    var $4507 = self.path;
                    var $4508 = Fm$Check$result$(_type$2, List$nil);
                    return $4508;
                case 'Fm.Term.nat':
                    var $4509 = self.natx;
                    var $4510 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Nat"));
                    return $4510;
                case 'Fm.Term.chr':
                    var $4511 = self.chrx;
                    var $4512 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("Char"));
                    return $4512;
                case 'Fm.Term.str':
                    var $4513 = self.strx;
                    var $4514 = Monad$pure$(Fm$Check$monad)(Fm$Term$ref$("String"));
                    return $4514;
                case 'Fm.Term.cse':
                    var $4515 = self.path;
                    var $4516 = self.expr;
                    var $4517 = self.name;
                    var $4518 = self.with;
                    var $4519 = self.cses;
                    var $4520 = self.moti;
                    var _expr$13 = $4516;
                    var $4521 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Fm$MPath$o$(_path$5), _orig$6))((_etyp$14 => {
                        var self = $4520;
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _type$2;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4524 = Fm$Term$hol$(Bits$e);
                                        var _moti$15 = $4524;
                                        break;
                                    case 'Maybe.some':
                                        var $4525 = self.value;
                                        var _size$16 = List$length$(_ctx$4);
                                        var _moti$17 = Fm$SmartMotive$make$($4517, $4516, _etyp$14, $4525, _size$16, _defs$3);
                                        var $4526 = _moti$17;
                                        var _moti$15 = $4526;
                                        break;
                                };
                                var $4523 = Maybe$some$(Fm$Term$cse$($4515, $4516, $4517, $4518, $4519, Maybe$some$(_moti$15)));
                                var _dsug$15 = $4523;
                                break;
                            case 'Maybe.some':
                                var $4527 = self.value;
                                var $4528 = Fm$Term$desugar_cse$($4516, $4517, $4518, $4519, $4527, _etyp$14, _defs$3, _ctx$4);
                                var _dsug$15 = $4528;
                                break;
                        };
                        var self = _dsug$15;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4529 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                var $4522 = $4529;
                                break;
                            case 'Maybe.some':
                                var $4530 = self.value;
                                var $4531 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$patch$(Fm$MPath$to_bits$(_path$5), $4530), List$nil));
                                var $4522 = $4531;
                                break;
                        };
                        return $4522;
                    }));
                    return $4521;
                case 'Fm.Term.ori':
                    var $4532 = self.orig;
                    var $4533 = self.expr;
                    var $4534 = Fm$Term$check$($4533, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($4532));
                    return $4534;
            };
        })())((_infr$7 => {
            var self = _type$2;
            switch (self._) {
                case 'Maybe.none':
                    var $4536 = Fm$Check$result$(Maybe$some$(_infr$7), List$nil);
                    var $4535 = $4536;
                    break;
                case 'Maybe.some':
                    var $4537 = self.value;
                    var $4538 = Monad$bind$(Fm$Check$monad)(Fm$Term$equal$($4537, _infr$7, _defs$3, List$length$(_ctx$4), Set$new))((_eqls$9 => {
                        var self = _eqls$9;
                        if (self) {
                            var $4540 = Monad$pure$(Fm$Check$monad)($4537);
                            var $4539 = $4540;
                        } else {
                            var $4541 = Fm$Check$result$(_type$2, List$cons$(Fm$Error$type_mismatch$(_orig$6, Either$right$($4537), Either$right$(_infr$7), _ctx$4), List$nil));
                            var $4539 = $4541;
                        };
                        return $4539;
                    }));
                    var $4535 = $4538;
                    break;
            };
            return $4535;
        }));
        return $4333;
    };
    const Fm$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Fm$Term$check$(x0, x1, x2, x3, x4, x5);

    function Fm$Path$nil$(_x$1) {
        var $4542 = _x$1;
        return $4542;
    };
    const Fm$Path$nil = x0 => Fm$Path$nil$(x0);
    const Fm$MPath$nil = Maybe$some$(Fm$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $4544 = Bool$true;
                var $4543 = $4544;
                break;
            case 'List.cons':
                var $4545 = self.head;
                var $4546 = self.tail;
                var $4547 = Bool$false;
                var $4543 = $4547;
                break;
        };
        return $4543;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Fm$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Fm.Term.var':
                var $4549 = self.name;
                var $4550 = self.indx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4552 = _fn$3(_term$2);
                        var $4551 = $4552;
                        break;
                    case 'o':
                        var $4553 = self.slice(0, -1);
                        var $4554 = _term$2;
                        var $4551 = $4554;
                        break;
                    case 'i':
                        var $4555 = self.slice(0, -1);
                        var $4556 = _term$2;
                        var $4551 = $4556;
                        break;
                };
                var $4548 = $4551;
                break;
            case 'Fm.Term.ref':
                var $4557 = self.name;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4559 = _fn$3(_term$2);
                        var $4558 = $4559;
                        break;
                    case 'o':
                        var $4560 = self.slice(0, -1);
                        var $4561 = _term$2;
                        var $4558 = $4561;
                        break;
                    case 'i':
                        var $4562 = self.slice(0, -1);
                        var $4563 = _term$2;
                        var $4558 = $4563;
                        break;
                };
                var $4548 = $4558;
                break;
            case 'Fm.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4565 = _fn$3(_term$2);
                        var $4564 = $4565;
                        break;
                    case 'o':
                        var $4566 = self.slice(0, -1);
                        var $4567 = _term$2;
                        var $4564 = $4567;
                        break;
                    case 'i':
                        var $4568 = self.slice(0, -1);
                        var $4569 = _term$2;
                        var $4564 = $4569;
                        break;
                };
                var $4548 = $4564;
                break;
            case 'Fm.Term.all':
                var $4570 = self.eras;
                var $4571 = self.self;
                var $4572 = self.name;
                var $4573 = self.xtyp;
                var $4574 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4576 = _fn$3(_term$2);
                        var $4575 = $4576;
                        break;
                    case 'o':
                        var $4577 = self.slice(0, -1);
                        var $4578 = Fm$Term$all$($4570, $4571, $4572, Fm$Term$patch_at$($4577, $4573, _fn$3), $4574);
                        var $4575 = $4578;
                        break;
                    case 'i':
                        var $4579 = self.slice(0, -1);
                        var $4580 = Fm$Term$all$($4570, $4571, $4572, $4573, (_s$10 => _x$11 => {
                            var $4581 = Fm$Term$patch_at$($4579, $4574(_s$10)(_x$11), _fn$3);
                            return $4581;
                        }));
                        var $4575 = $4580;
                        break;
                };
                var $4548 = $4575;
                break;
            case 'Fm.Term.lam':
                var $4582 = self.name;
                var $4583 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4585 = _fn$3(_term$2);
                        var $4584 = $4585;
                        break;
                    case 'o':
                        var $4586 = self.slice(0, -1);
                        var $4587 = Fm$Term$lam$($4582, (_x$7 => {
                            var $4588 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4583(_x$7), _fn$3);
                            return $4588;
                        }));
                        var $4584 = $4587;
                        break;
                    case 'i':
                        var $4589 = self.slice(0, -1);
                        var $4590 = Fm$Term$lam$($4582, (_x$7 => {
                            var $4591 = Fm$Term$patch_at$(Bits$tail$(_path$1), $4583(_x$7), _fn$3);
                            return $4591;
                        }));
                        var $4584 = $4590;
                        break;
                };
                var $4548 = $4584;
                break;
            case 'Fm.Term.app':
                var $4592 = self.func;
                var $4593 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4595 = _fn$3(_term$2);
                        var $4594 = $4595;
                        break;
                    case 'o':
                        var $4596 = self.slice(0, -1);
                        var $4597 = Fm$Term$app$(Fm$Term$patch_at$($4596, $4592, _fn$3), $4593);
                        var $4594 = $4597;
                        break;
                    case 'i':
                        var $4598 = self.slice(0, -1);
                        var $4599 = Fm$Term$app$($4592, Fm$Term$patch_at$($4598, $4593, _fn$3));
                        var $4594 = $4599;
                        break;
                };
                var $4548 = $4594;
                break;
            case 'Fm.Term.let':
                var $4600 = self.name;
                var $4601 = self.expr;
                var $4602 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4604 = _fn$3(_term$2);
                        var $4603 = $4604;
                        break;
                    case 'o':
                        var $4605 = self.slice(0, -1);
                        var $4606 = Fm$Term$let$($4600, Fm$Term$patch_at$($4605, $4601, _fn$3), $4602);
                        var $4603 = $4606;
                        break;
                    case 'i':
                        var $4607 = self.slice(0, -1);
                        var $4608 = Fm$Term$let$($4600, $4601, (_x$8 => {
                            var $4609 = Fm$Term$patch_at$($4607, $4602(_x$8), _fn$3);
                            return $4609;
                        }));
                        var $4603 = $4608;
                        break;
                };
                var $4548 = $4603;
                break;
            case 'Fm.Term.def':
                var $4610 = self.name;
                var $4611 = self.expr;
                var $4612 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4614 = _fn$3(_term$2);
                        var $4613 = $4614;
                        break;
                    case 'o':
                        var $4615 = self.slice(0, -1);
                        var $4616 = Fm$Term$def$($4610, Fm$Term$patch_at$($4615, $4611, _fn$3), $4612);
                        var $4613 = $4616;
                        break;
                    case 'i':
                        var $4617 = self.slice(0, -1);
                        var $4618 = Fm$Term$def$($4610, $4611, (_x$8 => {
                            var $4619 = Fm$Term$patch_at$($4617, $4612(_x$8), _fn$3);
                            return $4619;
                        }));
                        var $4613 = $4618;
                        break;
                };
                var $4548 = $4613;
                break;
            case 'Fm.Term.ann':
                var $4620 = self.done;
                var $4621 = self.term;
                var $4622 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4624 = _fn$3(_term$2);
                        var $4623 = $4624;
                        break;
                    case 'o':
                        var $4625 = self.slice(0, -1);
                        var $4626 = Fm$Term$ann$($4620, Fm$Term$patch_at$(_path$1, $4621, _fn$3), $4622);
                        var $4623 = $4626;
                        break;
                    case 'i':
                        var $4627 = self.slice(0, -1);
                        var $4628 = Fm$Term$ann$($4620, Fm$Term$patch_at$(_path$1, $4621, _fn$3), $4622);
                        var $4623 = $4628;
                        break;
                };
                var $4548 = $4623;
                break;
            case 'Fm.Term.gol':
                var $4629 = self.name;
                var $4630 = self.dref;
                var $4631 = self.verb;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4633 = _fn$3(_term$2);
                        var $4632 = $4633;
                        break;
                    case 'o':
                        var $4634 = self.slice(0, -1);
                        var $4635 = _term$2;
                        var $4632 = $4635;
                        break;
                    case 'i':
                        var $4636 = self.slice(0, -1);
                        var $4637 = _term$2;
                        var $4632 = $4637;
                        break;
                };
                var $4548 = $4632;
                break;
            case 'Fm.Term.hol':
                var $4638 = self.path;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4640 = _fn$3(_term$2);
                        var $4639 = $4640;
                        break;
                    case 'o':
                        var $4641 = self.slice(0, -1);
                        var $4642 = _term$2;
                        var $4639 = $4642;
                        break;
                    case 'i':
                        var $4643 = self.slice(0, -1);
                        var $4644 = _term$2;
                        var $4639 = $4644;
                        break;
                };
                var $4548 = $4639;
                break;
            case 'Fm.Term.nat':
                var $4645 = self.natx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4647 = _fn$3(_term$2);
                        var $4646 = $4647;
                        break;
                    case 'o':
                        var $4648 = self.slice(0, -1);
                        var $4649 = _term$2;
                        var $4646 = $4649;
                        break;
                    case 'i':
                        var $4650 = self.slice(0, -1);
                        var $4651 = _term$2;
                        var $4646 = $4651;
                        break;
                };
                var $4548 = $4646;
                break;
            case 'Fm.Term.chr':
                var $4652 = self.chrx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4654 = _fn$3(_term$2);
                        var $4653 = $4654;
                        break;
                    case 'o':
                        var $4655 = self.slice(0, -1);
                        var $4656 = _term$2;
                        var $4653 = $4656;
                        break;
                    case 'i':
                        var $4657 = self.slice(0, -1);
                        var $4658 = _term$2;
                        var $4653 = $4658;
                        break;
                };
                var $4548 = $4653;
                break;
            case 'Fm.Term.str':
                var $4659 = self.strx;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $4661 = _fn$3(_term$2);
                        var $4660 = $4661;
                        break;
                    case 'o':
                        var $4662 = self.slice(0, -1);
                        var $4663 = _term$2;
                        var $4660 = $4663;
                        break;
                    case 'i':
                        var $4664 = self.slice(0, -1);
                        var $4665 = _term$2;
                        var $4660 = $4665;
                        break;
                };
                var $4548 = $4660;
                break;
            case 'Fm.Term.cse':
                var $4666 = self.path;
                var $4667 = self.expr;
                var $4668 = self.name;
                var $4669 = self.with;
                var $4670 = self.cses;
                var $4671 = self.moti;
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
                var $4548 = $4672;
                break;
            case 'Fm.Term.ori':
                var $4678 = self.orig;
                var $4679 = self.expr;
                var $4680 = Fm$Term$patch_at$(_path$1, $4679, _fn$3);
                var $4548 = $4680;
                break;
        };
        return $4548;
    };
    const Fm$Term$patch_at = x0 => x1 => x2 => Fm$Term$patch_at$(x0, x1, x2);

    function Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, _errs$7, _fixd$8) {
        var self = _errs$7;
        switch (self._) {
            case 'List.nil':
                var self = _fixd$8;
                if (self) {
                    var _type$9 = Fm$Term$bind$(List$nil, (_x$9 => {
                        var $4684 = (_x$9 + '1');
                        return $4684;
                    }), _type$5);
                    var _term$10 = Fm$Term$bind$(List$nil, (_x$10 => {
                        var $4685 = (_x$10 + '0');
                        return $4685;
                    }), _term$4);
                    var _defs$11 = Fm$set$(_name$3, Fm$Def$new$(_file$1, _code$2, _name$3, _term$10, _type$9, Fm$Status$init), _defs$6);
                    var $4683 = Monad$pure$(IO$monad)(Maybe$some$(_defs$11));
                    var $4682 = $4683;
                } else {
                    var $4686 = Monad$pure$(IO$monad)(Maybe$none);
                    var $4682 = $4686;
                };
                var $4681 = $4682;
                break;
            case 'List.cons':
                var $4687 = self.head;
                var $4688 = self.tail;
                var self = $4687;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $4690 = self.origin;
                        var $4691 = self.expected;
                        var $4692 = self.detected;
                        var $4693 = self.context;
                        var $4694 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4688, _fixd$8);
                        var $4689 = $4694;
                        break;
                    case 'Fm.Error.show_goal':
                        var $4695 = self.name;
                        var $4696 = self.dref;
                        var $4697 = self.verb;
                        var $4698 = self.goal;
                        var $4699 = self.context;
                        var $4700 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4688, _fixd$8);
                        var $4689 = $4700;
                        break;
                    case 'Fm.Error.waiting':
                        var $4701 = self.name;
                        var $4702 = Monad$bind$(IO$monad)(Fm$Synth$one$($4701, _defs$6))((_defs$12 => {
                            var $4703 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$12, $4688, Bool$true);
                            return $4703;
                        }));
                        var $4689 = $4702;
                        break;
                    case 'Fm.Error.indirect':
                        var $4704 = self.name;
                        var $4705 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4688, _fixd$8);
                        var $4689 = $4705;
                        break;
                    case 'Fm.Error.patch':
                        var $4706 = self.path;
                        var $4707 = self.term;
                        var self = $4706;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'e':
                                var $4709 = Monad$pure$(IO$monad)(Maybe$none);
                                var $4708 = $4709;
                                break;
                            case 'o':
                                var $4710 = self.slice(0, -1);
                                var _term$14 = Fm$Term$patch_at$($4710, _term$4, (_x$14 => {
                                    var $4712 = $4707;
                                    return $4712;
                                }));
                                var $4711 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$14, _type$5, _defs$6, $4688, Bool$true);
                                var $4708 = $4711;
                                break;
                            case 'i':
                                var $4713 = self.slice(0, -1);
                                var _type$14 = Fm$Term$patch_at$($4713, _type$5, (_x$14 => {
                                    var $4715 = $4707;
                                    return $4715;
                                }));
                                var $4714 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$14, _defs$6, $4688, Bool$true);
                                var $4708 = $4714;
                                break;
                        };
                        var $4689 = $4708;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $4716 = self.origin;
                        var $4717 = self.name;
                        var $4718 = Monad$bind$(IO$monad)(Fm$Synth$one$($4717, _defs$6))((_defs$13 => {
                            var $4719 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$13, $4688, Bool$true);
                            return $4719;
                        }));
                        var $4689 = $4718;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $4720 = self.origin;
                        var $4721 = self.term;
                        var $4722 = self.context;
                        var $4723 = Fm$Synth$fix$(_file$1, _code$2, _name$3, _term$4, _type$5, _defs$6, $4688, _fixd$8);
                        var $4689 = $4723;
                        break;
                };
                var $4681 = $4689;
                break;
        };
        return $4681;
    };
    const Fm$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Fm$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Fm$Status$fail$(_errors$1) {
        var $4724 = ({
            _: 'Fm.Status.fail',
            'errors': _errors$1
        });
        return $4724;
    };
    const Fm$Status$fail = x0 => Fm$Status$fail$(x0);

    function Fm$Synth$one$(_name$1, _defs$2) {
        var self = Fm$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.none':
                var $4726 = Monad$bind$(IO$monad)(Fm$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.none':
                            var $4728 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("Undefined: ", List$cons$(_name$1, List$nil)))))((_$4 => {
                                var $4729 = Monad$pure$(IO$monad)(_defs$2);
                                return $4729;
                            }));
                            var $4727 = $4728;
                            break;
                        case 'Maybe.some':
                            var $4730 = self.value;
                            var $4731 = Fm$Synth$one$(_name$1, $4730);
                            var $4727 = $4731;
                            break;
                    };
                    return $4727;
                }));
                var $4725 = $4726;
                break;
            case 'Maybe.some':
                var $4732 = self.value;
                var self = $4732;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4734 = self.file;
                        var $4735 = self.code;
                        var $4736 = self.name;
                        var $4737 = self.term;
                        var $4738 = self.type;
                        var $4739 = self.stat;
                        var _file$10 = $4734;
                        var _code$11 = $4735;
                        var _name$12 = $4736;
                        var _term$13 = $4737;
                        var _type$14 = $4738;
                        var _stat$15 = $4739;
                        var self = _stat$15;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var _defs$16 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, Fm$Status$wait), _defs$2);
                                var _checked$17 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_type$14, Maybe$some$(Fm$Term$typ), _defs$16, List$nil, Fm$MPath$i$(Fm$MPath$nil), Maybe$none))((_chk_type$17 => {
                                    var $4742 = Monad$bind$(Fm$Check$monad)(Fm$Term$check$(_term$13, Maybe$some$(_type$14), _defs$16, List$nil, Fm$MPath$o$(Fm$MPath$nil), Maybe$none))((_chk_term$18 => {
                                        var $4743 = Monad$pure$(Fm$Check$monad)(Unit$new);
                                        return $4743;
                                    }));
                                    return $4742;
                                }));
                                var self = _checked$17;
                                switch (self._) {
                                    case 'Fm.Check.result':
                                        var $4744 = self.value;
                                        var $4745 = self.errors;
                                        var self = List$is_empty$($4745);
                                        if (self) {
                                            var _defs$20 = Fm$define$(_file$10, _code$11, _name$12, _term$13, _type$14, Bool$true, _defs$16);
                                            var $4747 = Monad$pure$(IO$monad)(_defs$20);
                                            var $4746 = $4747;
                                        } else {
                                            var $4748 = Monad$bind$(IO$monad)(Fm$Synth$fix$(_file$10, _code$11, _name$12, _term$13, _type$14, _defs$16, $4745, Bool$false))((_fixed$20 => {
                                                var self = _fixed$20;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var _stat$21 = Fm$Status$fail$($4745);
                                                        var _defs$22 = Fm$set$(_name$12, Fm$Def$new$(_file$10, _code$11, _name$12, _term$13, _type$14, _stat$21), _defs$16);
                                                        var $4750 = Monad$pure$(IO$monad)(_defs$22);
                                                        var $4749 = $4750;
                                                        break;
                                                    case 'Maybe.some':
                                                        var $4751 = self.value;
                                                        var $4752 = Fm$Synth$one$(_name$12, $4751);
                                                        var $4749 = $4752;
                                                        break;
                                                };
                                                return $4749;
                                            }));
                                            var $4746 = $4748;
                                        };
                                        var $4741 = $4746;
                                        break;
                                };
                                var $4740 = $4741;
                                break;
                            case 'Fm.Status.wait':
                                var $4753 = Monad$pure$(IO$monad)(_defs$2);
                                var $4740 = $4753;
                                break;
                            case 'Fm.Status.done':
                                var $4754 = Monad$pure$(IO$monad)(_defs$2);
                                var $4740 = $4754;
                                break;
                            case 'Fm.Status.fail':
                                var $4755 = self.errors;
                                var $4756 = Monad$pure$(IO$monad)(_defs$2);
                                var $4740 = $4756;
                                break;
                        };
                        var $4733 = $4740;
                        break;
                };
                var $4725 = $4733;
                break;
        };
        return $4725;
    };
    const Fm$Synth$one = x0 => x1 => Fm$Synth$one$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $4758 = _list$3;
                var $4757 = $4758;
                break;
            case 'Map.tie':
                var $4759 = self.val;
                var $4760 = self.lft;
                var $4761 = self.rgt;
                var self = $4759;
                switch (self._) {
                    case 'Maybe.none':
                        var $4763 = _list$3;
                        var _list0$7 = $4763;
                        break;
                    case 'Maybe.some':
                        var $4764 = self.value;
                        var $4765 = List$cons$($4764, _list$3);
                        var _list0$7 = $4765;
                        break;
                };
                var _list1$8 = Map$values$go$($4760, _list0$7);
                var _list2$9 = Map$values$go$($4761, _list1$8);
                var $4762 = _list2$9;
                var $4757 = $4762;
                break;
        };
        return $4757;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $4766 = Map$values$go$(_xs$2, List$nil);
        return $4766;
    };
    const Map$values = x0 => Map$values$(x0);

    function Fm$Name$show$(_name$1) {
        var $4767 = _name$1;
        return $4767;
    };
    const Fm$Name$show = x0 => Fm$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $4769 = 0n;
                var $4768 = $4769;
                break;
            case 'o':
                var $4770 = self.slice(0, -1);
                var $4771 = (2n * Bits$to_nat$($4770));
                var $4768 = $4771;
                break;
            case 'i':
                var $4772 = self.slice(0, -1);
                var $4773 = Nat$succ$((2n * Bits$to_nat$($4772)));
                var $4768 = $4773;
                break;
        };
        return $4768;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $4775 = u16_to_word(self);
                var $4776 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($4775)));
                var $4774 = $4776;
                break;
        };
        return $4774;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Fm$escape$char$(_chr$1) {
        var self = (_chr$1 === Fm$backslash);
        if (self) {
            var $4778 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
            var $4777 = $4778;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $4780 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                var $4779 = $4780;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $4782 = String$cons$(Fm$backslash, String$cons$(_chr$1, String$nil));
                    var $4781 = $4782;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $4784 = String$cons$(_chr$1, String$nil);
                        var $4783 = $4784;
                    } else {
                        var $4785 = String$flatten$(List$cons$(String$cons$(Fm$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $4783 = $4785;
                    };
                    var $4781 = $4783;
                };
                var $4779 = $4781;
            };
            var $4777 = $4779;
        };
        return $4777;
    };
    const Fm$escape$char = x0 => Fm$escape$char$(x0);

    function Fm$escape$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4787 = String$nil;
            var $4786 = $4787;
        } else {
            var $4788 = self.charCodeAt(0);
            var $4789 = self.slice(1);
            var _head$4 = Fm$escape$char$($4788);
            var _tail$5 = Fm$escape$($4789);
            var $4790 = (_head$4 + _tail$5);
            var $4786 = $4790;
        };
        return $4786;
    };
    const Fm$escape = x0 => Fm$escape$(x0);

    function Fm$Term$core$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4792 = self.name;
                var $4793 = self.indx;
                var $4794 = Fm$Name$show$($4792);
                var $4791 = $4794;
                break;
            case 'Fm.Term.ref':
                var $4795 = self.name;
                var $4796 = Fm$Name$show$($4795);
                var $4791 = $4796;
                break;
            case 'Fm.Term.typ':
                var $4797 = "*";
                var $4791 = $4797;
                break;
            case 'Fm.Term.all':
                var $4798 = self.eras;
                var $4799 = self.self;
                var $4800 = self.name;
                var $4801 = self.xtyp;
                var $4802 = self.body;
                var _eras$7 = $4798;
                var self = _eras$7;
                if (self) {
                    var $4804 = "%";
                    var _init$8 = $4804;
                } else {
                    var $4805 = "@";
                    var _init$8 = $4805;
                };
                var _self$9 = Fm$Name$show$($4799);
                var _name$10 = Fm$Name$show$($4800);
                var _xtyp$11 = Fm$Term$core$($4801);
                var _body$12 = Fm$Term$core$($4802(Fm$Term$var$($4799, 0n))(Fm$Term$var$($4800, 0n)));
                var $4803 = String$flatten$(List$cons$(_init$8, List$cons$(_self$9, List$cons$("(", List$cons$(_name$10, List$cons$(":", List$cons$(_xtyp$11, List$cons$(") ", List$cons$(_body$12, List$nil)))))))));
                var $4791 = $4803;
                break;
            case 'Fm.Term.lam':
                var $4806 = self.name;
                var $4807 = self.body;
                var _name$4 = Fm$Name$show$($4806);
                var _body$5 = Fm$Term$core$($4807(Fm$Term$var$($4806, 0n)));
                var $4808 = String$flatten$(List$cons$("#", List$cons$(_name$4, List$cons$(" ", List$cons$(_body$5, List$nil)))));
                var $4791 = $4808;
                break;
            case 'Fm.Term.app':
                var $4809 = self.func;
                var $4810 = self.argm;
                var _func$4 = Fm$Term$core$($4809);
                var _argm$5 = Fm$Term$core$($4810);
                var $4811 = String$flatten$(List$cons$("(", List$cons$(_func$4, List$cons$(" ", List$cons$(_argm$5, List$cons$(")", List$nil))))));
                var $4791 = $4811;
                break;
            case 'Fm.Term.let':
                var $4812 = self.name;
                var $4813 = self.expr;
                var $4814 = self.body;
                var _name$5 = Fm$Name$show$($4812);
                var _expr$6 = Fm$Term$core$($4813);
                var _body$7 = Fm$Term$core$($4814(Fm$Term$var$($4812, 0n)));
                var $4815 = String$flatten$(List$cons$("!", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4791 = $4815;
                break;
            case 'Fm.Term.def':
                var $4816 = self.name;
                var $4817 = self.expr;
                var $4818 = self.body;
                var _name$5 = Fm$Name$show$($4816);
                var _expr$6 = Fm$Term$core$($4817);
                var _body$7 = Fm$Term$core$($4818(Fm$Term$var$($4816, 0n)));
                var $4819 = String$flatten$(List$cons$("$", List$cons$(_name$5, List$cons$(" = ", List$cons$(_expr$6, List$cons$("; ", List$cons$(_body$7, List$nil)))))));
                var $4791 = $4819;
                break;
            case 'Fm.Term.ann':
                var $4820 = self.done;
                var $4821 = self.term;
                var $4822 = self.type;
                var _term$5 = Fm$Term$core$($4821);
                var _type$6 = Fm$Term$core$($4822);
                var $4823 = String$flatten$(List$cons$("{", List$cons$(_term$5, List$cons$(":", List$cons$(_type$6, List$cons$("}", List$nil))))));
                var $4791 = $4823;
                break;
            case 'Fm.Term.gol':
                var $4824 = self.name;
                var $4825 = self.dref;
                var $4826 = self.verb;
                var $4827 = "<GOL>";
                var $4791 = $4827;
                break;
            case 'Fm.Term.hol':
                var $4828 = self.path;
                var $4829 = "<HOL>";
                var $4791 = $4829;
                break;
            case 'Fm.Term.nat':
                var $4830 = self.natx;
                var $4831 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($4830), List$nil)));
                var $4791 = $4831;
                break;
            case 'Fm.Term.chr':
                var $4832 = self.chrx;
                var $4833 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($4832), List$cons$("\'", List$nil))));
                var $4791 = $4833;
                break;
            case 'Fm.Term.str':
                var $4834 = self.strx;
                var $4835 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($4834), List$cons$("\"", List$nil))));
                var $4791 = $4835;
                break;
            case 'Fm.Term.cse':
                var $4836 = self.path;
                var $4837 = self.expr;
                var $4838 = self.name;
                var $4839 = self.with;
                var $4840 = self.cses;
                var $4841 = self.moti;
                var $4842 = "<CSE>";
                var $4791 = $4842;
                break;
            case 'Fm.Term.ori':
                var $4843 = self.orig;
                var $4844 = self.expr;
                var $4845 = Fm$Term$core$($4844);
                var $4791 = $4845;
                break;
        };
        return $4791;
    };
    const Fm$Term$core = x0 => Fm$Term$core$(x0);

    function Fm$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $4848 = _result$2;
            var $4849 = Map$values$(_defs$1);
            let _result$4 = $4848;
            let _defn$3;
            while ($4849._ === 'List.cons') {
                _defn$3 = $4849.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Fm.Def.new':
                        var $4850 = self.file;
                        var $4851 = self.code;
                        var $4852 = self.name;
                        var $4853 = self.term;
                        var $4854 = self.type;
                        var $4855 = self.stat;
                        var self = $4855;
                        switch (self._) {
                            case 'Fm.Status.init':
                                var $4857 = _result$4;
                                var $4856 = $4857;
                                break;
                            case 'Fm.Status.wait':
                                var $4858 = _result$4;
                                var $4856 = $4858;
                                break;
                            case 'Fm.Status.done':
                                var _name$11 = $4852;
                                var _term$12 = Fm$Term$core$($4853);
                                var _type$13 = Fm$Term$core$($4854);
                                var $4859 = String$flatten$(List$cons$(_result$4, List$cons$(_name$11, List$cons$(" : ", List$cons$(_type$13, List$cons$(" = ", List$cons$(_term$12, List$cons$(";\u{a}", List$nil))))))));
                                var $4856 = $4859;
                                break;
                            case 'Fm.Status.fail':
                                var $4860 = self.errors;
                                var $4861 = _result$4;
                                var $4856 = $4861;
                                break;
                        };
                        var $4848 = $4856;
                        break;
                };
                _result$4 = $4848;
                $4849 = $4849.tail;
            }
            return _result$4;
        })();
        var $4846 = _result$3;
        return $4846;
    };
    const Fm$Defs$core = x0 => Fm$Defs$core$(x0);

    function Fm$to_core$io$one$(_name$1) {
        var $4862 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $4863 = Monad$pure$(IO$monad)(Fm$Defs$core$(_defs$2));
            return $4863;
        }));
        return $4862;
    };
    const Fm$to_core$io$one = x0 => Fm$to_core$io$one$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.none':
                var $4865 = Maybe$none;
                var $4864 = $4865;
                break;
            case 'Maybe.some':
                var $4866 = self.value;
                var $4867 = _f$4($4866);
                var $4864 = $4867;
                break;
        };
        return $4864;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);
    const Maybe$monad = Monad$new$(Maybe$bind, Maybe$some);

    function Fm$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4869 = self.name;
                var $4870 = self.indx;
                var $4871 = Maybe$none;
                var $4868 = $4871;
                break;
            case 'Fm.Term.ref':
                var $4872 = self.name;
                var self = ($4872 === "Nat.zero");
                if (self) {
                    var $4874 = Maybe$some$(0n);
                    var $4873 = $4874;
                } else {
                    var $4875 = Maybe$none;
                    var $4873 = $4875;
                };
                var $4868 = $4873;
                break;
            case 'Fm.Term.typ':
                var $4876 = Maybe$none;
                var $4868 = $4876;
                break;
            case 'Fm.Term.all':
                var $4877 = self.eras;
                var $4878 = self.self;
                var $4879 = self.name;
                var $4880 = self.xtyp;
                var $4881 = self.body;
                var $4882 = Maybe$none;
                var $4868 = $4882;
                break;
            case 'Fm.Term.lam':
                var $4883 = self.name;
                var $4884 = self.body;
                var $4885 = Maybe$none;
                var $4868 = $4885;
                break;
            case 'Fm.Term.app':
                var $4886 = self.func;
                var $4887 = self.argm;
                var self = $4886;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $4889 = self.name;
                        var $4890 = self.indx;
                        var $4891 = Maybe$none;
                        var $4888 = $4891;
                        break;
                    case 'Fm.Term.ref':
                        var $4892 = self.name;
                        var self = ($4892 === "Nat.succ");
                        if (self) {
                            var $4894 = Monad$bind$(Maybe$monad)(Fm$Term$show$as_nat$go$($4887))((_pred$5 => {
                                var $4895 = Monad$pure$(Maybe$monad)(Nat$succ$(_pred$5));
                                return $4895;
                            }));
                            var $4893 = $4894;
                        } else {
                            var $4896 = Maybe$none;
                            var $4893 = $4896;
                        };
                        var $4888 = $4893;
                        break;
                    case 'Fm.Term.typ':
                        var $4897 = Maybe$none;
                        var $4888 = $4897;
                        break;
                    case 'Fm.Term.all':
                        var $4898 = self.eras;
                        var $4899 = self.self;
                        var $4900 = self.name;
                        var $4901 = self.xtyp;
                        var $4902 = self.body;
                        var $4903 = Maybe$none;
                        var $4888 = $4903;
                        break;
                    case 'Fm.Term.lam':
                        var $4904 = self.name;
                        var $4905 = self.body;
                        var $4906 = Maybe$none;
                        var $4888 = $4906;
                        break;
                    case 'Fm.Term.app':
                        var $4907 = self.func;
                        var $4908 = self.argm;
                        var $4909 = Maybe$none;
                        var $4888 = $4909;
                        break;
                    case 'Fm.Term.let':
                        var $4910 = self.name;
                        var $4911 = self.expr;
                        var $4912 = self.body;
                        var $4913 = Maybe$none;
                        var $4888 = $4913;
                        break;
                    case 'Fm.Term.def':
                        var $4914 = self.name;
                        var $4915 = self.expr;
                        var $4916 = self.body;
                        var $4917 = Maybe$none;
                        var $4888 = $4917;
                        break;
                    case 'Fm.Term.ann':
                        var $4918 = self.done;
                        var $4919 = self.term;
                        var $4920 = self.type;
                        var $4921 = Maybe$none;
                        var $4888 = $4921;
                        break;
                    case 'Fm.Term.gol':
                        var $4922 = self.name;
                        var $4923 = self.dref;
                        var $4924 = self.verb;
                        var $4925 = Maybe$none;
                        var $4888 = $4925;
                        break;
                    case 'Fm.Term.hol':
                        var $4926 = self.path;
                        var $4927 = Maybe$none;
                        var $4888 = $4927;
                        break;
                    case 'Fm.Term.nat':
                        var $4928 = self.natx;
                        var $4929 = Maybe$none;
                        var $4888 = $4929;
                        break;
                    case 'Fm.Term.chr':
                        var $4930 = self.chrx;
                        var $4931 = Maybe$none;
                        var $4888 = $4931;
                        break;
                    case 'Fm.Term.str':
                        var $4932 = self.strx;
                        var $4933 = Maybe$none;
                        var $4888 = $4933;
                        break;
                    case 'Fm.Term.cse':
                        var $4934 = self.path;
                        var $4935 = self.expr;
                        var $4936 = self.name;
                        var $4937 = self.with;
                        var $4938 = self.cses;
                        var $4939 = self.moti;
                        var $4940 = Maybe$none;
                        var $4888 = $4940;
                        break;
                    case 'Fm.Term.ori':
                        var $4941 = self.orig;
                        var $4942 = self.expr;
                        var $4943 = Maybe$none;
                        var $4888 = $4943;
                        break;
                };
                var $4868 = $4888;
                break;
            case 'Fm.Term.let':
                var $4944 = self.name;
                var $4945 = self.expr;
                var $4946 = self.body;
                var $4947 = Maybe$none;
                var $4868 = $4947;
                break;
            case 'Fm.Term.def':
                var $4948 = self.name;
                var $4949 = self.expr;
                var $4950 = self.body;
                var $4951 = Maybe$none;
                var $4868 = $4951;
                break;
            case 'Fm.Term.ann':
                var $4952 = self.done;
                var $4953 = self.term;
                var $4954 = self.type;
                var $4955 = Maybe$none;
                var $4868 = $4955;
                break;
            case 'Fm.Term.gol':
                var $4956 = self.name;
                var $4957 = self.dref;
                var $4958 = self.verb;
                var $4959 = Maybe$none;
                var $4868 = $4959;
                break;
            case 'Fm.Term.hol':
                var $4960 = self.path;
                var $4961 = Maybe$none;
                var $4868 = $4961;
                break;
            case 'Fm.Term.nat':
                var $4962 = self.natx;
                var $4963 = Maybe$none;
                var $4868 = $4963;
                break;
            case 'Fm.Term.chr':
                var $4964 = self.chrx;
                var $4965 = Maybe$none;
                var $4868 = $4965;
                break;
            case 'Fm.Term.str':
                var $4966 = self.strx;
                var $4967 = Maybe$none;
                var $4868 = $4967;
                break;
            case 'Fm.Term.cse':
                var $4968 = self.path;
                var $4969 = self.expr;
                var $4970 = self.name;
                var $4971 = self.with;
                var $4972 = self.cses;
                var $4973 = self.moti;
                var $4974 = Maybe$none;
                var $4868 = $4974;
                break;
            case 'Fm.Term.ori':
                var $4975 = self.orig;
                var $4976 = self.expr;
                var $4977 = Maybe$none;
                var $4868 = $4977;
                break;
        };
        return $4868;
    };
    const Fm$Term$show$as_nat$go = x0 => Fm$Term$show$as_nat$go$(x0);

    function Fm$Term$show$as_nat$(_term$1) {
        var $4978 = Maybe$mapped$(Fm$Term$show$as_nat$go$(_term$1), Nat$show);
        return $4978;
    };
    const Fm$Term$show$as_nat = x0 => Fm$Term$show$as_nat$(x0);

    function Fm$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $4980 = self.name;
                var $4981 = self.indx;
                var $4982 = Bool$false;
                var $4979 = $4982;
                break;
            case 'Fm.Term.ref':
                var $4983 = self.name;
                var $4984 = (_name$2 === $4983);
                var $4979 = $4984;
                break;
            case 'Fm.Term.typ':
                var $4985 = Bool$false;
                var $4979 = $4985;
                break;
            case 'Fm.Term.all':
                var $4986 = self.eras;
                var $4987 = self.self;
                var $4988 = self.name;
                var $4989 = self.xtyp;
                var $4990 = self.body;
                var $4991 = Bool$false;
                var $4979 = $4991;
                break;
            case 'Fm.Term.lam':
                var $4992 = self.name;
                var $4993 = self.body;
                var $4994 = Bool$false;
                var $4979 = $4994;
                break;
            case 'Fm.Term.app':
                var $4995 = self.func;
                var $4996 = self.argm;
                var $4997 = Bool$false;
                var $4979 = $4997;
                break;
            case 'Fm.Term.let':
                var $4998 = self.name;
                var $4999 = self.expr;
                var $5000 = self.body;
                var $5001 = Bool$false;
                var $4979 = $5001;
                break;
            case 'Fm.Term.def':
                var $5002 = self.name;
                var $5003 = self.expr;
                var $5004 = self.body;
                var $5005 = Bool$false;
                var $4979 = $5005;
                break;
            case 'Fm.Term.ann':
                var $5006 = self.done;
                var $5007 = self.term;
                var $5008 = self.type;
                var $5009 = Bool$false;
                var $4979 = $5009;
                break;
            case 'Fm.Term.gol':
                var $5010 = self.name;
                var $5011 = self.dref;
                var $5012 = self.verb;
                var $5013 = Bool$false;
                var $4979 = $5013;
                break;
            case 'Fm.Term.hol':
                var $5014 = self.path;
                var $5015 = Bool$false;
                var $4979 = $5015;
                break;
            case 'Fm.Term.nat':
                var $5016 = self.natx;
                var $5017 = Bool$false;
                var $4979 = $5017;
                break;
            case 'Fm.Term.chr':
                var $5018 = self.chrx;
                var $5019 = Bool$false;
                var $4979 = $5019;
                break;
            case 'Fm.Term.str':
                var $5020 = self.strx;
                var $5021 = Bool$false;
                var $4979 = $5021;
                break;
            case 'Fm.Term.cse':
                var $5022 = self.path;
                var $5023 = self.expr;
                var $5024 = self.name;
                var $5025 = self.with;
                var $5026 = self.cses;
                var $5027 = self.moti;
                var $5028 = Bool$false;
                var $4979 = $5028;
                break;
            case 'Fm.Term.ori':
                var $5029 = self.orig;
                var $5030 = self.expr;
                var $5031 = Bool$false;
                var $4979 = $5031;
                break;
        };
        return $4979;
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
                        var $5032 = self.name;
                        var $5033 = self.indx;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5035 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5034 = $5035;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5037 = Bool$false;
                                var _wrap$8 = $5037;
                            } else {
                                var $5038 = self.charCodeAt(0);
                                var $5039 = self.slice(1);
                                var $5040 = ($5038 === 40);
                                var _wrap$8 = $5040;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5041 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5041;
                            } else {
                                var $5042 = _func$7;
                                var _func$10 = $5042;
                            };
                            var $5036 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5034 = $5036;
                        };
                        return $5034;
                    case 'Fm.Term.ref':
                        var $5043 = self.name;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5045 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5044 = $5045;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5047 = Bool$false;
                                var _wrap$7 = $5047;
                            } else {
                                var $5048 = self.charCodeAt(0);
                                var $5049 = self.slice(1);
                                var $5050 = ($5048 === 40);
                                var _wrap$7 = $5050;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5051 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5051;
                            } else {
                                var $5052 = _func$6;
                                var _func$9 = $5052;
                            };
                            var $5046 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5044 = $5046;
                        };
                        return $5044;
                    case 'Fm.Term.typ':
                        var _arity$4 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
                        if (self) {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5054 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
                            var $5053 = $5054;
                        } else {
                            var _func$5 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$5;
                            if (self.length === 0) {
                                var $5056 = Bool$false;
                                var _wrap$6 = $5056;
                            } else {
                                var $5057 = self.charCodeAt(0);
                                var $5058 = self.slice(1);
                                var $5059 = ($5057 === 40);
                                var _wrap$6 = $5059;
                            };
                            var _args$7 = String$join$(",", _args$3);
                            var self = _wrap$6;
                            if (self) {
                                var $5060 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                                var _func$8 = $5060;
                            } else {
                                var $5061 = _func$5;
                                var _func$8 = $5061;
                            };
                            var $5055 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
                            var $5053 = $5055;
                        };
                        return $5053;
                    case 'Fm.Term.all':
                        var $5062 = self.eras;
                        var $5063 = self.self;
                        var $5064 = self.name;
                        var $5065 = self.xtyp;
                        var $5066 = self.body;
                        var _arity$9 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$9 === 3n));
                        if (self) {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$11 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$12 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5068 = String$flatten$(List$cons$(_eq_lft$11, List$cons$(" == ", List$cons$(_eq_rgt$12, List$nil))));
                            var $5067 = $5068;
                        } else {
                            var _func$10 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$10;
                            if (self.length === 0) {
                                var $5070 = Bool$false;
                                var _wrap$11 = $5070;
                            } else {
                                var $5071 = self.charCodeAt(0);
                                var $5072 = self.slice(1);
                                var $5073 = ($5071 === 40);
                                var _wrap$11 = $5073;
                            };
                            var _args$12 = String$join$(",", _args$3);
                            var self = _wrap$11;
                            if (self) {
                                var $5074 = String$flatten$(List$cons$("(", List$cons$(_func$10, List$cons$(")", List$nil))));
                                var _func$13 = $5074;
                            } else {
                                var $5075 = _func$10;
                                var _func$13 = $5075;
                            };
                            var $5069 = String$flatten$(List$cons$(_func$13, List$cons$("(", List$cons$(_args$12, List$cons$(")", List$nil)))));
                            var $5067 = $5069;
                        };
                        return $5067;
                    case 'Fm.Term.lam':
                        var $5076 = self.name;
                        var $5077 = self.body;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5079 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5078 = $5079;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5081 = Bool$false;
                                var _wrap$8 = $5081;
                            } else {
                                var $5082 = self.charCodeAt(0);
                                var $5083 = self.slice(1);
                                var $5084 = ($5082 === 40);
                                var _wrap$8 = $5084;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5085 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5085;
                            } else {
                                var $5086 = _func$7;
                                var _func$10 = $5086;
                            };
                            var $5080 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5078 = $5080;
                        };
                        return $5078;
                    case 'Fm.Term.app':
                        var $5087 = self.func;
                        var $5088 = self.argm;
                        var _argm$6 = Fm$Term$show$go$($5088, Fm$MPath$i$(_path$2));
                        var $5089 = Fm$Term$show$app$($5087, Fm$MPath$o$(_path$2), List$cons$(_argm$6, _args$3));
                        return $5089;
                    case 'Fm.Term.let':
                        var $5090 = self.name;
                        var $5091 = self.expr;
                        var $5092 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5094 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5093 = $5094;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5096 = Bool$false;
                                var _wrap$9 = $5096;
                            } else {
                                var $5097 = self.charCodeAt(0);
                                var $5098 = self.slice(1);
                                var $5099 = ($5097 === 40);
                                var _wrap$9 = $5099;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5100 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5100;
                            } else {
                                var $5101 = _func$8;
                                var _func$11 = $5101;
                            };
                            var $5095 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5093 = $5095;
                        };
                        return $5093;
                    case 'Fm.Term.def':
                        var $5102 = self.name;
                        var $5103 = self.expr;
                        var $5104 = self.body;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5106 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5105 = $5106;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5108 = Bool$false;
                                var _wrap$9 = $5108;
                            } else {
                                var $5109 = self.charCodeAt(0);
                                var $5110 = self.slice(1);
                                var $5111 = ($5109 === 40);
                                var _wrap$9 = $5111;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5112 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5112;
                            } else {
                                var $5113 = _func$8;
                                var _func$11 = $5113;
                            };
                            var $5107 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5105 = $5107;
                        };
                        return $5105;
                    case 'Fm.Term.ann':
                        var $5114 = self.done;
                        var $5115 = self.term;
                        var $5116 = self.type;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5118 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5117 = $5118;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5120 = Bool$false;
                                var _wrap$9 = $5120;
                            } else {
                                var $5121 = self.charCodeAt(0);
                                var $5122 = self.slice(1);
                                var $5123 = ($5121 === 40);
                                var _wrap$9 = $5123;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5124 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5124;
                            } else {
                                var $5125 = _func$8;
                                var _func$11 = $5125;
                            };
                            var $5119 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5117 = $5119;
                        };
                        return $5117;
                    case 'Fm.Term.gol':
                        var $5126 = self.name;
                        var $5127 = self.dref;
                        var $5128 = self.verb;
                        var _arity$7 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$7 === 3n));
                        if (self) {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$9 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$10 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5130 = String$flatten$(List$cons$(_eq_lft$9, List$cons$(" == ", List$cons$(_eq_rgt$10, List$nil))));
                            var $5129 = $5130;
                        } else {
                            var _func$8 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$8;
                            if (self.length === 0) {
                                var $5132 = Bool$false;
                                var _wrap$9 = $5132;
                            } else {
                                var $5133 = self.charCodeAt(0);
                                var $5134 = self.slice(1);
                                var $5135 = ($5133 === 40);
                                var _wrap$9 = $5135;
                            };
                            var _args$10 = String$join$(",", _args$3);
                            var self = _wrap$9;
                            if (self) {
                                var $5136 = String$flatten$(List$cons$("(", List$cons$(_func$8, List$cons$(")", List$nil))));
                                var _func$11 = $5136;
                            } else {
                                var $5137 = _func$8;
                                var _func$11 = $5137;
                            };
                            var $5131 = String$flatten$(List$cons$(_func$11, List$cons$("(", List$cons$(_args$10, List$cons$(")", List$nil)))));
                            var $5129 = $5131;
                        };
                        return $5129;
                    case 'Fm.Term.hol':
                        var $5138 = self.path;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5140 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5139 = $5140;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5142 = Bool$false;
                                var _wrap$7 = $5142;
                            } else {
                                var $5143 = self.charCodeAt(0);
                                var $5144 = self.slice(1);
                                var $5145 = ($5143 === 40);
                                var _wrap$7 = $5145;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5146 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5146;
                            } else {
                                var $5147 = _func$6;
                                var _func$9 = $5147;
                            };
                            var $5141 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5139 = $5141;
                        };
                        return $5139;
                    case 'Fm.Term.nat':
                        var $5148 = self.natx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5150 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5149 = $5150;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5152 = Bool$false;
                                var _wrap$7 = $5152;
                            } else {
                                var $5153 = self.charCodeAt(0);
                                var $5154 = self.slice(1);
                                var $5155 = ($5153 === 40);
                                var _wrap$7 = $5155;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5156 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5156;
                            } else {
                                var $5157 = _func$6;
                                var _func$9 = $5157;
                            };
                            var $5151 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5149 = $5151;
                        };
                        return $5149;
                    case 'Fm.Term.chr':
                        var $5158 = self.chrx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5160 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5159 = $5160;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5162 = Bool$false;
                                var _wrap$7 = $5162;
                            } else {
                                var $5163 = self.charCodeAt(0);
                                var $5164 = self.slice(1);
                                var $5165 = ($5163 === 40);
                                var _wrap$7 = $5165;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5166 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5166;
                            } else {
                                var $5167 = _func$6;
                                var _func$9 = $5167;
                            };
                            var $5161 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5159 = $5161;
                        };
                        return $5159;
                    case 'Fm.Term.str':
                        var $5168 = self.strx;
                        var _arity$5 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$5 === 3n));
                        if (self) {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$7 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$8 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5170 = String$flatten$(List$cons$(_eq_lft$7, List$cons$(" == ", List$cons$(_eq_rgt$8, List$nil))));
                            var $5169 = $5170;
                        } else {
                            var _func$6 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$6;
                            if (self.length === 0) {
                                var $5172 = Bool$false;
                                var _wrap$7 = $5172;
                            } else {
                                var $5173 = self.charCodeAt(0);
                                var $5174 = self.slice(1);
                                var $5175 = ($5173 === 40);
                                var _wrap$7 = $5175;
                            };
                            var _args$8 = String$join$(",", _args$3);
                            var self = _wrap$7;
                            if (self) {
                                var $5176 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(")", List$nil))));
                                var _func$9 = $5176;
                            } else {
                                var $5177 = _func$6;
                                var _func$9 = $5177;
                            };
                            var $5171 = String$flatten$(List$cons$(_func$9, List$cons$("(", List$cons$(_args$8, List$cons$(")", List$nil)))));
                            var $5169 = $5171;
                        };
                        return $5169;
                    case 'Fm.Term.cse':
                        var $5178 = self.path;
                        var $5179 = self.expr;
                        var $5180 = self.name;
                        var $5181 = self.with;
                        var $5182 = self.cses;
                        var $5183 = self.moti;
                        var _arity$10 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$10 === 3n));
                        if (self) {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$12 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$13 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5185 = String$flatten$(List$cons$(_eq_lft$12, List$cons$(" == ", List$cons$(_eq_rgt$13, List$nil))));
                            var $5184 = $5185;
                        } else {
                            var _func$11 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$11;
                            if (self.length === 0) {
                                var $5187 = Bool$false;
                                var _wrap$12 = $5187;
                            } else {
                                var $5188 = self.charCodeAt(0);
                                var $5189 = self.slice(1);
                                var $5190 = ($5188 === 40);
                                var _wrap$12 = $5190;
                            };
                            var _args$13 = String$join$(",", _args$3);
                            var self = _wrap$12;
                            if (self) {
                                var $5191 = String$flatten$(List$cons$("(", List$cons$(_func$11, List$cons$(")", List$nil))));
                                var _func$14 = $5191;
                            } else {
                                var $5192 = _func$11;
                                var _func$14 = $5192;
                            };
                            var $5186 = String$flatten$(List$cons$(_func$14, List$cons$("(", List$cons$(_args$13, List$cons$(")", List$nil)))));
                            var $5184 = $5186;
                        };
                        return $5184;
                    case 'Fm.Term.ori':
                        var $5193 = self.orig;
                        var $5194 = self.expr;
                        var _arity$6 = List$length$(_args$3);
                        var self = (Fm$Term$show$is_ref$(_term$1, "Equal") && (_arity$6 === 3n));
                        if (self) {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var _eq_lft$8 = Maybe$default$("?", List$at$(1n, _args$3));
                            var _eq_rgt$9 = Maybe$default$("?", List$at$(2n, _args$3));
                            var $5196 = String$flatten$(List$cons$(_eq_lft$8, List$cons$(" == ", List$cons$(_eq_rgt$9, List$nil))));
                            var $5195 = $5196;
                        } else {
                            var _func$7 = Fm$Term$show$go$(_term$1, _path$2);
                            var self = _func$7;
                            if (self.length === 0) {
                                var $5198 = Bool$false;
                                var _wrap$8 = $5198;
                            } else {
                                var $5199 = self.charCodeAt(0);
                                var $5200 = self.slice(1);
                                var $5201 = ($5199 === 40);
                                var _wrap$8 = $5201;
                            };
                            var _args$9 = String$join$(",", _args$3);
                            var self = _wrap$8;
                            if (self) {
                                var $5202 = String$flatten$(List$cons$("(", List$cons$(_func$7, List$cons$(")", List$nil))));
                                var _func$10 = $5202;
                            } else {
                                var $5203 = _func$7;
                                var _func$10 = $5203;
                            };
                            var $5197 = String$flatten$(List$cons$(_func$10, List$cons$("(", List$cons$(_args$9, List$cons$(")", List$nil)))));
                            var $5195 = $5197;
                        };
                        return $5195;
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
                var $5205 = _list$4;
                var $5204 = $5205;
                break;
            case 'Map.tie':
                var $5206 = self.val;
                var $5207 = self.lft;
                var $5208 = self.rgt;
                var self = $5206;
                switch (self._) {
                    case 'Maybe.none':
                        var $5210 = _list$4;
                        var _list0$8 = $5210;
                        break;
                    case 'Maybe.some':
                        var $5211 = self.value;
                        var $5212 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5211), _list$4);
                        var _list0$8 = $5212;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5207, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5208, (_key$3 + '1'), _list1$9);
                var $5209 = _list2$10;
                var $5204 = $5209;
                break;
        };
        return $5204;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5213 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5213;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $5215 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5214 = $5215;
                break;
            case 'o':
                var $5216 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5218 = List$cons$(_head$6, _tail$7);
                    var $5217 = $5218;
                } else {
                    var $5219 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5220 = Bits$chunks_of$go$(_len$1, $5216, $5219, _chunk$7);
                    var $5217 = $5220;
                };
                var $5214 = $5217;
                break;
            case 'i':
                var $5221 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5223 = List$cons$(_head$6, _tail$7);
                    var $5222 = $5223;
                } else {
                    var $5224 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5225 = Bits$chunks_of$go$(_len$1, $5221, $5224, _chunk$7);
                    var $5222 = $5225;
                };
                var $5214 = $5222;
                break;
        };
        return $5214;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5226 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5226;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5228 = Word$e;
            var $5227 = $5228;
        } else {
            var $5229 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'e':
                    var $5231 = Word$o$(Word$from_bits$($5229, Bits$e));
                    var $5230 = $5231;
                    break;
                case 'o':
                    var $5232 = self.slice(0, -1);
                    var $5233 = Word$o$(Word$from_bits$($5229, $5232));
                    var $5230 = $5233;
                    break;
                case 'i':
                    var $5234 = self.slice(0, -1);
                    var $5235 = Word$i$(Word$from_bits$($5229, $5234));
                    var $5230 = $5235;
                    break;
            };
            var $5227 = $5230;
        };
        return $5227;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Fm$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5238 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5238;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5240 = ((_u16$5 + 71) & 0xFFFF);
                    var $5239 = $5240;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5242 = (Math.max(_u16$5 - 4, 0));
                        var $5241 = $5242;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5244 = 46;
                            var $5243 = $5244;
                        } else {
                            var $5245 = 95;
                            var $5243 = $5245;
                        };
                        var $5241 = $5243;
                    };
                    var $5239 = $5241;
                };
                var _chr$6 = $5239;
            };
            var $5237 = String$cons$(_chr$6, _name$4);
            return $5237;
        }));
        var $5236 = _name$3;
        return $5236;
    };
    const Fm$Name$from_bits = x0 => Fm$Name$from_bits$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $5247 = self.fst;
                var $5248 = self.snd;
                var $5249 = $5247;
                var $5246 = $5249;
                break;
        };
        return $5246;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Fm$Term$show$go$(_term$1, _path$2) {
        var self = Fm$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Fm.Term.var':
                        var $5252 = self.name;
                        var $5253 = self.indx;
                        var $5254 = Fm$Name$show$($5252);
                        var $5251 = $5254;
                        break;
                    case 'Fm.Term.ref':
                        var $5255 = self.name;
                        var _name$4 = Fm$Name$show$($5255);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5257 = _name$4;
                                var $5256 = $5257;
                                break;
                            case 'Maybe.some':
                                var $5258 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Fm$Path$to_bits$($5258));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5259 = String$flatten$(List$cons$(_name$4, List$cons$(Fm$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5256 = $5259;
                                break;
                        };
                        var $5251 = $5256;
                        break;
                    case 'Fm.Term.typ':
                        var $5260 = "Type";
                        var $5251 = $5260;
                        break;
                    case 'Fm.Term.all':
                        var $5261 = self.eras;
                        var $5262 = self.self;
                        var $5263 = self.name;
                        var $5264 = self.xtyp;
                        var $5265 = self.body;
                        var _eras$8 = $5261;
                        var _self$9 = Fm$Name$show$($5262);
                        var _name$10 = Fm$Name$show$($5263);
                        var _type$11 = Fm$Term$show$go$($5264, Fm$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5267 = "<";
                            var _open$12 = $5267;
                        } else {
                            var $5268 = "(";
                            var _open$12 = $5268;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5269 = ">";
                            var _clos$13 = $5269;
                        } else {
                            var $5270 = ")";
                            var _clos$13 = $5270;
                        };
                        var _body$14 = Fm$Term$show$go$($5265(Fm$Term$var$($5262, 0n))(Fm$Term$var$($5263, 0n)), Fm$MPath$i$(_path$2));
                        var $5266 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5251 = $5266;
                        break;
                    case 'Fm.Term.lam':
                        var $5271 = self.name;
                        var $5272 = self.body;
                        var _name$5 = Fm$Name$show$($5271);
                        var _body$6 = Fm$Term$show$go$($5272(Fm$Term$var$($5271, 0n)), Fm$MPath$o$(_path$2));
                        var $5273 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5251 = $5273;
                        break;
                    case 'Fm.Term.app':
                        var $5274 = self.func;
                        var $5275 = self.argm;
                        var $5276 = Fm$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5251 = $5276;
                        break;
                    case 'Fm.Term.let':
                        var $5277 = self.name;
                        var $5278 = self.expr;
                        var $5279 = self.body;
                        var _name$6 = Fm$Name$show$($5277);
                        var _expr$7 = Fm$Term$show$go$($5278, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5279(Fm$Term$var$($5277, 0n)), Fm$MPath$i$(_path$2));
                        var $5280 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5251 = $5280;
                        break;
                    case 'Fm.Term.def':
                        var $5281 = self.name;
                        var $5282 = self.expr;
                        var $5283 = self.body;
                        var _name$6 = Fm$Name$show$($5281);
                        var _expr$7 = Fm$Term$show$go$($5282, Fm$MPath$o$(_path$2));
                        var _body$8 = Fm$Term$show$go$($5283(Fm$Term$var$($5281, 0n)), Fm$MPath$i$(_path$2));
                        var $5284 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5251 = $5284;
                        break;
                    case 'Fm.Term.ann':
                        var $5285 = self.done;
                        var $5286 = self.term;
                        var $5287 = self.type;
                        var _term$6 = Fm$Term$show$go$($5286, Fm$MPath$o$(_path$2));
                        var _type$7 = Fm$Term$show$go$($5287, Fm$MPath$i$(_path$2));
                        var $5288 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5251 = $5288;
                        break;
                    case 'Fm.Term.gol':
                        var $5289 = self.name;
                        var $5290 = self.dref;
                        var $5291 = self.verb;
                        var _name$6 = Fm$Name$show$($5289);
                        var $5292 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5251 = $5292;
                        break;
                    case 'Fm.Term.hol':
                        var $5293 = self.path;
                        var $5294 = "_";
                        var $5251 = $5294;
                        break;
                    case 'Fm.Term.nat':
                        var $5295 = self.natx;
                        var $5296 = String$flatten$(List$cons$(Nat$show$($5295), List$nil));
                        var $5251 = $5296;
                        break;
                    case 'Fm.Term.chr':
                        var $5297 = self.chrx;
                        var $5298 = String$flatten$(List$cons$("\'", List$cons$(Fm$escape$char$($5297), List$cons$("\'", List$nil))));
                        var $5251 = $5298;
                        break;
                    case 'Fm.Term.str':
                        var $5299 = self.strx;
                        var $5300 = String$flatten$(List$cons$("\"", List$cons$(Fm$escape$($5299), List$cons$("\"", List$nil))));
                        var $5251 = $5300;
                        break;
                    case 'Fm.Term.cse':
                        var $5301 = self.path;
                        var $5302 = self.expr;
                        var $5303 = self.name;
                        var $5304 = self.with;
                        var $5305 = self.cses;
                        var $5306 = self.moti;
                        var _expr$9 = Fm$Term$show$go$($5302, Fm$MPath$o$(_path$2));
                        var _name$10 = Fm$Name$show$($5303);
                        var _wyth$11 = String$join$("", List$mapped$($5304, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5309 = self.file;
                                    var $5310 = self.code;
                                    var $5311 = self.name;
                                    var $5312 = self.term;
                                    var $5313 = self.type;
                                    var $5314 = self.stat;
                                    var _name$18 = Fm$Name$show$($5311);
                                    var _type$19 = Fm$Term$show$go$($5313, Maybe$none);
                                    var _term$20 = Fm$Term$show$go$($5312, Maybe$none);
                                    var $5315 = String$flatten$(List$cons$(_name$18, List$cons$(": ", List$cons$(_type$19, List$cons$(" = ", List$cons$(_term$20, List$cons$(";", List$nil)))))));
                                    var $5308 = $5315;
                                    break;
                            };
                            return $5308;
                        })));
                        var _cses$12 = Map$to_list$($5305);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Fm$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Fm$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5316 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5316;
                        })));
                        var self = $5306;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5317 = "";
                                var _moti$14 = $5317;
                                break;
                            case 'Maybe.some':
                                var $5318 = self.value;
                                var $5319 = String$flatten$(List$cons$(": ", List$cons$(Fm$Term$show$go$($5318, Maybe$none), List$nil)));
                                var _moti$14 = $5319;
                                break;
                        };
                        var $5307 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5251 = $5307;
                        break;
                    case 'Fm.Term.ori':
                        var $5320 = self.orig;
                        var $5321 = self.expr;
                        var $5322 = Fm$Term$show$go$($5321, _path$2);
                        var $5251 = $5322;
                        break;
                };
                var $5250 = $5251;
                break;
            case 'Maybe.some':
                var $5323 = self.value;
                var $5324 = $5323;
                var $5250 = $5324;
                break;
        };
        return $5250;
    };
    const Fm$Term$show$go = x0 => x1 => Fm$Term$show$go$(x0, x1);

    function Fm$Term$show$(_term$1) {
        var $5325 = Fm$Term$show$go$(_term$1, Maybe$none);
        return $5325;
    };
    const Fm$Term$show = x0 => Fm$Term$show$(x0);

    function Fm$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.nil':
                var $5327 = List$nil;
                var $5326 = $5327;
                break;
            case 'List.cons':
                var $5328 = self.head;
                var $5329 = self.tail;
                var self = $5328;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5331 = self.origin;
                        var $5332 = self.expected;
                        var $5333 = self.detected;
                        var $5334 = self.context;
                        var $5335 = (!_got$2);
                        var _keep$5 = $5335;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5336 = self.name;
                        var $5337 = self.dref;
                        var $5338 = self.verb;
                        var $5339 = self.goal;
                        var $5340 = self.context;
                        var $5341 = Bool$true;
                        var _keep$5 = $5341;
                        break;
                    case 'Fm.Error.waiting':
                        var $5342 = self.name;
                        var $5343 = Bool$false;
                        var _keep$5 = $5343;
                        break;
                    case 'Fm.Error.indirect':
                        var $5344 = self.name;
                        var $5345 = Bool$false;
                        var _keep$5 = $5345;
                        break;
                    case 'Fm.Error.patch':
                        var $5346 = self.path;
                        var $5347 = self.term;
                        var $5348 = Bool$false;
                        var _keep$5 = $5348;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5349 = self.origin;
                        var $5350 = self.name;
                        var $5351 = (!_got$2);
                        var _keep$5 = $5351;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5352 = self.origin;
                        var $5353 = self.term;
                        var $5354 = self.context;
                        var $5355 = (!_got$2);
                        var _keep$5 = $5355;
                        break;
                };
                var self = $5328;
                switch (self._) {
                    case 'Fm.Error.type_mismatch':
                        var $5356 = self.origin;
                        var $5357 = self.expected;
                        var $5358 = self.detected;
                        var $5359 = self.context;
                        var $5360 = Bool$true;
                        var _got$6 = $5360;
                        break;
                    case 'Fm.Error.show_goal':
                        var $5361 = self.name;
                        var $5362 = self.dref;
                        var $5363 = self.verb;
                        var $5364 = self.goal;
                        var $5365 = self.context;
                        var $5366 = _got$2;
                        var _got$6 = $5366;
                        break;
                    case 'Fm.Error.waiting':
                        var $5367 = self.name;
                        var $5368 = _got$2;
                        var _got$6 = $5368;
                        break;
                    case 'Fm.Error.indirect':
                        var $5369 = self.name;
                        var $5370 = _got$2;
                        var _got$6 = $5370;
                        break;
                    case 'Fm.Error.patch':
                        var $5371 = self.path;
                        var $5372 = self.term;
                        var $5373 = _got$2;
                        var _got$6 = $5373;
                        break;
                    case 'Fm.Error.undefined_reference':
                        var $5374 = self.origin;
                        var $5375 = self.name;
                        var $5376 = Bool$true;
                        var _got$6 = $5376;
                        break;
                    case 'Fm.Error.cant_infer':
                        var $5377 = self.origin;
                        var $5378 = self.term;
                        var $5379 = self.context;
                        var $5380 = _got$2;
                        var _got$6 = $5380;
                        break;
                };
                var _tail$7 = Fm$Error$relevant$($5329, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5381 = List$cons$($5328, _tail$7);
                    var $5330 = $5381;
                } else {
                    var $5382 = _tail$7;
                    var $5330 = $5382;
                };
                var $5326 = $5330;
                break;
        };
        return $5326;
    };
    const Fm$Error$relevant = x0 => x1 => Fm$Error$relevant$(x0, x1);

    function Fm$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.nil':
                var $5384 = "";
                var $5383 = $5384;
                break;
            case 'List.cons':
                var $5385 = self.head;
                var $5386 = self.tail;
                var self = $5385;
                switch (self._) {
                    case 'Pair.new':
                        var $5388 = self.fst;
                        var $5389 = self.snd;
                        var _name$6 = Fm$Name$show$($5388);
                        var _type$7 = Fm$Term$show$($5389);
                        var _rest$8 = Fm$Context$show$($5386);
                        var $5390 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5387 = $5390;
                        break;
                };
                var $5383 = $5387;
                break;
        };
        return $5383;
    };
    const Fm$Context$show = x0 => Fm$Context$show$(x0);

    function Fm$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5391 = Fm$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Fm.Term.var':
                    var $5393 = self.name;
                    var $5394 = self.indx;
                    var $5395 = _term$4;
                    var $5392 = $5395;
                    break;
                case 'Fm.Term.ref':
                    var $5396 = self.name;
                    var self = Fm$get$($5396, _defs$3);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5398 = Fm$Term$ref$($5396);
                            var $5397 = $5398;
                            break;
                        case 'Maybe.some':
                            var $5399 = self.value;
                            var self = $5399;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5401 = self.file;
                                    var $5402 = self.code;
                                    var $5403 = self.name;
                                    var $5404 = self.term;
                                    var $5405 = self.type;
                                    var $5406 = self.stat;
                                    var $5407 = $5404;
                                    var $5400 = $5407;
                                    break;
                            };
                            var $5397 = $5400;
                            break;
                    };
                    var $5392 = $5397;
                    break;
                case 'Fm.Term.typ':
                    var $5408 = _term$4;
                    var $5392 = $5408;
                    break;
                case 'Fm.Term.all':
                    var $5409 = self.eras;
                    var $5410 = self.self;
                    var $5411 = self.name;
                    var $5412 = self.xtyp;
                    var $5413 = self.body;
                    var $5414 = _term$4;
                    var $5392 = $5414;
                    break;
                case 'Fm.Term.lam':
                    var $5415 = self.name;
                    var $5416 = self.body;
                    var $5417 = _term$4;
                    var $5392 = $5417;
                    break;
                case 'Fm.Term.app':
                    var $5418 = self.func;
                    var $5419 = self.argm;
                    var $5420 = _term$4;
                    var $5392 = $5420;
                    break;
                case 'Fm.Term.let':
                    var $5421 = self.name;
                    var $5422 = self.expr;
                    var $5423 = self.body;
                    var $5424 = _term$4;
                    var $5392 = $5424;
                    break;
                case 'Fm.Term.def':
                    var $5425 = self.name;
                    var $5426 = self.expr;
                    var $5427 = self.body;
                    var $5428 = _term$4;
                    var $5392 = $5428;
                    break;
                case 'Fm.Term.ann':
                    var $5429 = self.done;
                    var $5430 = self.term;
                    var $5431 = self.type;
                    var $5432 = _term$4;
                    var $5392 = $5432;
                    break;
                case 'Fm.Term.gol':
                    var $5433 = self.name;
                    var $5434 = self.dref;
                    var $5435 = self.verb;
                    var $5436 = _term$4;
                    var $5392 = $5436;
                    break;
                case 'Fm.Term.hol':
                    var $5437 = self.path;
                    var $5438 = _term$4;
                    var $5392 = $5438;
                    break;
                case 'Fm.Term.nat':
                    var $5439 = self.natx;
                    var $5440 = _term$4;
                    var $5392 = $5440;
                    break;
                case 'Fm.Term.chr':
                    var $5441 = self.chrx;
                    var $5442 = _term$4;
                    var $5392 = $5442;
                    break;
                case 'Fm.Term.str':
                    var $5443 = self.strx;
                    var $5444 = _term$4;
                    var $5392 = $5444;
                    break;
                case 'Fm.Term.cse':
                    var $5445 = self.path;
                    var $5446 = self.expr;
                    var $5447 = self.name;
                    var $5448 = self.with;
                    var $5449 = self.cses;
                    var $5450 = self.moti;
                    var $5451 = _term$4;
                    var $5392 = $5451;
                    break;
                case 'Fm.Term.ori':
                    var $5452 = self.orig;
                    var $5453 = self.expr;
                    var $5454 = _term$4;
                    var $5392 = $5454;
                    break;
            };
            return $5392;
        }));
        return $5391;
    };
    const Fm$Term$expand_at = x0 => x1 => x2 => Fm$Term$expand_at$(x0, x1, x2);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Fm$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Fm.Term.var':
                var $5456 = self.name;
                var $5457 = self.indx;
                var $5458 = Fm$Term$var$($5456, $5457);
                var $5455 = $5458;
                break;
            case 'Fm.Term.ref':
                var $5459 = self.name;
                var _expand$5 = Bool$false;
                var _expand$6 = ((($5459 === "Nat.succ") && (_arity$3 > 1n)) || _expand$5);
                var _expand$7 = ((($5459 === "Nat.zero") && (_arity$3 > 0n)) || _expand$6);
                var _expand$8 = ((($5459 === "Bool.true") && (_arity$3 > 0n)) || _expand$7);
                var _expand$9 = ((($5459 === "Bool.false") && (_arity$3 > 0n)) || _expand$8);
                var self = _expand$9;
                if (self) {
                    var self = Fm$get$($5459, _defs$2);
                    switch (self._) {
                        case 'Maybe.none':
                            var $5462 = Fm$Term$ref$($5459);
                            var $5461 = $5462;
                            break;
                        case 'Maybe.some':
                            var $5463 = self.value;
                            var self = $5463;
                            switch (self._) {
                                case 'Fm.Def.new':
                                    var $5465 = self.file;
                                    var $5466 = self.code;
                                    var $5467 = self.name;
                                    var $5468 = self.term;
                                    var $5469 = self.type;
                                    var $5470 = self.stat;
                                    var $5471 = $5468;
                                    var $5464 = $5471;
                                    break;
                            };
                            var $5461 = $5464;
                            break;
                    };
                    var $5460 = $5461;
                } else {
                    var $5472 = Fm$Term$ref$($5459);
                    var $5460 = $5472;
                };
                var $5455 = $5460;
                break;
            case 'Fm.Term.typ':
                var $5473 = Fm$Term$typ;
                var $5455 = $5473;
                break;
            case 'Fm.Term.all':
                var $5474 = self.eras;
                var $5475 = self.self;
                var $5476 = self.name;
                var $5477 = self.xtyp;
                var $5478 = self.body;
                var $5479 = Fm$Term$all$($5474, $5475, $5476, Fm$Term$expand_ct$($5477, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5480 = Fm$Term$expand_ct$($5478(_s$9)(_x$10), _defs$2, 0n);
                    return $5480;
                }));
                var $5455 = $5479;
                break;
            case 'Fm.Term.lam':
                var $5481 = self.name;
                var $5482 = self.body;
                var $5483 = Fm$Term$lam$($5481, (_x$6 => {
                    var $5484 = Fm$Term$expand_ct$($5482(_x$6), _defs$2, 0n);
                    return $5484;
                }));
                var $5455 = $5483;
                break;
            case 'Fm.Term.app':
                var $5485 = self.func;
                var $5486 = self.argm;
                var $5487 = Fm$Term$app$(Fm$Term$expand_ct$($5485, _defs$2, Nat$succ$(_arity$3)), Fm$Term$expand_ct$($5486, _defs$2, 0n));
                var $5455 = $5487;
                break;
            case 'Fm.Term.let':
                var $5488 = self.name;
                var $5489 = self.expr;
                var $5490 = self.body;
                var $5491 = Fm$Term$let$($5488, Fm$Term$expand_ct$($5489, _defs$2, 0n), (_x$7 => {
                    var $5492 = Fm$Term$expand_ct$($5490(_x$7), _defs$2, 0n);
                    return $5492;
                }));
                var $5455 = $5491;
                break;
            case 'Fm.Term.def':
                var $5493 = self.name;
                var $5494 = self.expr;
                var $5495 = self.body;
                var $5496 = Fm$Term$def$($5493, Fm$Term$expand_ct$($5494, _defs$2, 0n), (_x$7 => {
                    var $5497 = Fm$Term$expand_ct$($5495(_x$7), _defs$2, 0n);
                    return $5497;
                }));
                var $5455 = $5496;
                break;
            case 'Fm.Term.ann':
                var $5498 = self.done;
                var $5499 = self.term;
                var $5500 = self.type;
                var $5501 = Fm$Term$ann$($5498, Fm$Term$expand_ct$($5499, _defs$2, 0n), Fm$Term$expand_ct$($5500, _defs$2, 0n));
                var $5455 = $5501;
                break;
            case 'Fm.Term.gol':
                var $5502 = self.name;
                var $5503 = self.dref;
                var $5504 = self.verb;
                var $5505 = Fm$Term$gol$($5502, $5503, $5504);
                var $5455 = $5505;
                break;
            case 'Fm.Term.hol':
                var $5506 = self.path;
                var $5507 = Fm$Term$hol$($5506);
                var $5455 = $5507;
                break;
            case 'Fm.Term.nat':
                var $5508 = self.natx;
                var $5509 = Fm$Term$nat$($5508);
                var $5455 = $5509;
                break;
            case 'Fm.Term.chr':
                var $5510 = self.chrx;
                var $5511 = Fm$Term$chr$($5510);
                var $5455 = $5511;
                break;
            case 'Fm.Term.str':
                var $5512 = self.strx;
                var $5513 = Fm$Term$str$($5512);
                var $5455 = $5513;
                break;
            case 'Fm.Term.cse':
                var $5514 = self.path;
                var $5515 = self.expr;
                var $5516 = self.name;
                var $5517 = self.with;
                var $5518 = self.cses;
                var $5519 = self.moti;
                var $5520 = _term$1;
                var $5455 = $5520;
                break;
            case 'Fm.Term.ori':
                var $5521 = self.orig;
                var $5522 = self.expr;
                var $5523 = Fm$Term$ori$($5521, $5522);
                var $5455 = $5523;
                break;
        };
        return $5455;
    };
    const Fm$Term$expand_ct = x0 => x1 => x2 => Fm$Term$expand_ct$(x0, x1, x2);

    function Fm$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Fm$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5526 = _term$4;
            var $5527 = _dref$1;
            let _term$6 = $5526;
            let _path$5;
            while ($5527._ === 'List.cons') {
                _path$5 = $5527.head;
                var _term$7 = Fm$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Fm$Term$normalize$(_term$7, Map$new);
                var _term$9 = Fm$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Fm$Term$normalize$(_term$9, Map$new);
                var $5526 = _term$10;
                _term$6 = $5526;
                $5527 = $5527.tail;
            }
            return _term$6;
        })();
        var $5524 = _term$5;
        return $5524;
    };
    const Fm$Term$expand = x0 => x1 => x2 => Fm$Term$expand$(x0, x1, x2);

    function Fm$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5529 = self.origin;
                var $5530 = self.expected;
                var $5531 = self.detected;
                var $5532 = self.context;
                var self = $5530;
                switch (self._) {
                    case 'Either.left':
                        var $5534 = self.value;
                        var $5535 = $5534;
                        var _expected$7 = $5535;
                        break;
                    case 'Either.right':
                        var $5536 = self.value;
                        var $5537 = Fm$Term$show$(Fm$Term$normalize$($5536, Map$new));
                        var _expected$7 = $5537;
                        break;
                };
                var self = $5531;
                switch (self._) {
                    case 'Either.left':
                        var $5538 = self.value;
                        var $5539 = $5538;
                        var _detected$8 = $5539;
                        break;
                    case 'Either.right':
                        var $5540 = self.value;
                        var $5541 = Fm$Term$show$(Fm$Term$normalize$($5540, Map$new));
                        var _detected$8 = $5541;
                        break;
                };
                var $5533 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5532;
                    switch (self._) {
                        case 'List.nil':
                            var $5542 = "";
                            return $5542;
                        case 'List.cons':
                            var $5543 = self.head;
                            var $5544 = self.tail;
                            var $5545 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Fm$Context$show$($5532), List$nil)));
                            return $5545;
                    };
                })(), List$nil)))))))));
                var $5528 = $5533;
                break;
            case 'Fm.Error.show_goal':
                var $5546 = self.name;
                var $5547 = self.dref;
                var $5548 = self.verb;
                var $5549 = self.goal;
                var $5550 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Fm$Name$show$($5546), List$cons$(":\u{a}", List$nil))));
                var self = $5549;
                switch (self._) {
                    case 'Maybe.none':
                        var $5552 = "";
                        var _with_type$9 = $5552;
                        break;
                    case 'Maybe.some':
                        var $5553 = self.value;
                        var _goal$10 = Fm$Term$expand$($5547, $5553, _defs$2);
                        var $5554 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5548;
                            if (self) {
                                var $5555 = Fm$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5556 = _x$11;
                                    return $5556;
                                })));
                                return $5555;
                            } else {
                                var $5557 = Fm$Term$show$(_goal$10);
                                return $5557;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5554;
                        break;
                };
                var self = $5550;
                switch (self._) {
                    case 'List.nil':
                        var $5558 = "";
                        var _with_ctxt$10 = $5558;
                        break;
                    case 'List.cons':
                        var $5559 = self.head;
                        var $5560 = self.tail;
                        var $5561 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Fm$Context$show$($5550), List$nil)));
                        var _with_ctxt$10 = $5561;
                        break;
                };
                var $5551 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5528 = $5551;
                break;
            case 'Fm.Error.waiting':
                var $5562 = self.name;
                var $5563 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5562, List$cons$("\'.", List$nil))));
                var $5528 = $5563;
                break;
            case 'Fm.Error.indirect':
                var $5564 = self.name;
                var $5565 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5564, List$cons$("\'.", List$nil))));
                var $5528 = $5565;
                break;
            case 'Fm.Error.patch':
                var $5566 = self.path;
                var $5567 = self.term;
                var $5568 = String$flatten$(List$cons$("Patching: ", List$cons$(Fm$Term$show$($5567), List$nil)));
                var $5528 = $5568;
                break;
            case 'Fm.Error.undefined_reference':
                var $5569 = self.origin;
                var $5570 = self.name;
                var $5571 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Fm$Name$show$($5570), List$cons$("\u{a}", List$nil))));
                var $5528 = $5571;
                break;
            case 'Fm.Error.cant_infer':
                var $5572 = self.origin;
                var $5573 = self.term;
                var $5574 = self.context;
                var _term$6 = Fm$Term$show$($5573);
                var _context$7 = Fm$Context$show$($5574);
                var $5575 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5528 = $5575;
                break;
        };
        return $5528;
    };
    const Fm$Error$show = x0 => x1 => Fm$Error$show$(x0, x1);

    function Fm$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Fm.Error.type_mismatch':
                var $5577 = self.origin;
                var $5578 = self.expected;
                var $5579 = self.detected;
                var $5580 = self.context;
                var $5581 = $5577;
                var $5576 = $5581;
                break;
            case 'Fm.Error.show_goal':
                var $5582 = self.name;
                var $5583 = self.dref;
                var $5584 = self.verb;
                var $5585 = self.goal;
                var $5586 = self.context;
                var $5587 = Maybe$none;
                var $5576 = $5587;
                break;
            case 'Fm.Error.waiting':
                var $5588 = self.name;
                var $5589 = Maybe$none;
                var $5576 = $5589;
                break;
            case 'Fm.Error.indirect':
                var $5590 = self.name;
                var $5591 = Maybe$none;
                var $5576 = $5591;
                break;
            case 'Fm.Error.patch':
                var $5592 = self.path;
                var $5593 = self.term;
                var $5594 = Maybe$none;
                var $5576 = $5594;
                break;
            case 'Fm.Error.undefined_reference':
                var $5595 = self.origin;
                var $5596 = self.name;
                var $5597 = $5595;
                var $5576 = $5597;
                break;
            case 'Fm.Error.cant_infer':
                var $5598 = self.origin;
                var $5599 = self.term;
                var $5600 = self.context;
                var $5601 = $5598;
                var $5576 = $5601;
                break;
        };
        return $5576;
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
                        var $5602 = String$flatten$(List$cons$(_typs$4, List$cons$("\u{a}", List$cons$((() => {
                            var self = _errs$3;
                            if (self.length === 0) {
                                var $5603 = "All terms check.";
                                return $5603;
                            } else {
                                var $5604 = self.charCodeAt(0);
                                var $5605 = self.slice(1);
                                var $5606 = _errs$3;
                                return $5606;
                            };
                        })(), List$nil))));
                        return $5602;
                    case 'List.cons':
                        var $5607 = self.head;
                        var $5608 = self.tail;
                        var _name$7 = $5607;
                        var self = Fm$get$(_name$7, _defs$1);
                        switch (self._) {
                            case 'Maybe.none':
                                var $5610 = Fm$Defs$report$go$(_defs$1, $5608, _errs$3, _typs$4);
                                var $5609 = $5610;
                                break;
                            case 'Maybe.some':
                                var $5611 = self.value;
                                var self = $5611;
                                switch (self._) {
                                    case 'Fm.Def.new':
                                        var $5613 = self.file;
                                        var $5614 = self.code;
                                        var $5615 = self.name;
                                        var $5616 = self.term;
                                        var $5617 = self.type;
                                        var $5618 = self.stat;
                                        var _typs$15 = String$flatten$(List$cons$(_typs$4, List$cons$(_name$7, List$cons$(": ", List$cons$(Fm$Term$show$($5617), List$cons$("\u{a}", List$nil))))));
                                        var self = $5618;
                                        switch (self._) {
                                            case 'Fm.Status.init':
                                                var $5620 = Fm$Defs$report$go$(_defs$1, $5608, _errs$3, _typs$15);
                                                var $5619 = $5620;
                                                break;
                                            case 'Fm.Status.wait':
                                                var $5621 = Fm$Defs$report$go$(_defs$1, $5608, _errs$3, _typs$15);
                                                var $5619 = $5621;
                                                break;
                                            case 'Fm.Status.done':
                                                var $5622 = Fm$Defs$report$go$(_defs$1, $5608, _errs$3, _typs$15);
                                                var $5619 = $5622;
                                                break;
                                            case 'Fm.Status.fail':
                                                var $5623 = self.errors;
                                                var self = $5623;
                                                switch (self._) {
                                                    case 'List.nil':
                                                        var $5625 = Fm$Defs$report$go$(_defs$1, $5608, _errs$3, _typs$15);
                                                        var $5624 = $5625;
                                                        break;
                                                    case 'List.cons':
                                                        var $5626 = self.head;
                                                        var $5627 = self.tail;
                                                        var _name_str$19 = Fm$Name$show$($5615);
                                                        var _rel_errs$20 = Fm$Error$relevant$($5623, Bool$false);
                                                        var _rel_msgs$21 = List$mapped$(_rel_errs$20, (_err$21 => {
                                                            var $5629 = String$flatten$(List$cons$(Fm$Error$show$(_err$21, _defs$1), List$cons$((() => {
                                                                var self = Fm$Error$origin$(_err$21);
                                                                switch (self._) {
                                                                    case 'Maybe.none':
                                                                        var $5630 = "";
                                                                        return $5630;
                                                                    case 'Maybe.some':
                                                                        var $5631 = self.value;
                                                                        var self = $5631;
                                                                        switch (self._) {
                                                                            case 'Fm.Origin.new':
                                                                                var $5633 = self.file;
                                                                                var $5634 = self.from;
                                                                                var $5635 = self.upto;
                                                                                var $5636 = String$flatten$(List$cons$("Inside \'", List$cons$($5613, List$cons$("\':\u{a}", List$cons$(Fm$highlight$($5614, $5634, $5635), List$cons$("\u{a}", List$nil))))));
                                                                                var $5632 = $5636;
                                                                                break;
                                                                        };
                                                                        return $5632;
                                                                };
                                                            })(), List$nil)));
                                                            return $5629;
                                                        }));
                                                        var _errs$22 = String$flatten$(List$cons$(_errs$3, List$cons$(String$join$("\u{a}", _rel_msgs$21), List$cons$("\u{a}", List$nil))));
                                                        var $5628 = Fm$Defs$report$go$(_defs$1, $5608, _errs$22, _typs$15);
                                                        var $5624 = $5628;
                                                        break;
                                                };
                                                var $5619 = $5624;
                                                break;
                                        };
                                        var $5612 = $5619;
                                        break;
                                };
                                var $5609 = $5612;
                                break;
                        };
                        return $5609;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Fm$Defs$report$go = x0 => x1 => x2 => x3 => Fm$Defs$report$go$(x0, x1, x2, x3);

    function Fm$Defs$report$(_defs$1, _list$2) {
        var $5637 = Fm$Defs$report$go$(_defs$1, _list$2, "", "");
        return $5637;
    };
    const Fm$Defs$report = x0 => x1 => Fm$Defs$report$(x0, x1);

    function Fm$checker$io$one$(_name$1) {
        var $5638 = Monad$bind$(IO$monad)(Fm$Synth$one$(_name$1, Map$new))((_defs$2 => {
            var $5639 = IO$print$(Fm$Defs$report$(_defs$2, List$cons$(_name$1, List$nil)));
            return $5639;
        }));
        return $5638;
    };
    const Fm$checker$io$one = x0 => Fm$checker$io$one$(x0);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.new':
                var $5641 = _list$4;
                var $5640 = $5641;
                break;
            case 'Map.tie':
                var $5642 = self.val;
                var $5643 = self.lft;
                var $5644 = self.rgt;
                var self = $5642;
                switch (self._) {
                    case 'Maybe.none':
                        var $5646 = _list$4;
                        var _list0$8 = $5646;
                        break;
                    case 'Maybe.some':
                        var $5647 = self.value;
                        var $5648 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5648;
                        break;
                };
                var _list1$9 = Map$keys$go$($5643, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5644, (_key$3 + '1'), _list1$9);
                var $5645 = _list2$10;
                var $5640 = $5645;
                break;
        };
        return $5640;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5649 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5649;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Fm$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.nil':
                var $5651 = Monad$pure$(IO$monad)(_defs$2);
                var $5650 = $5651;
                break;
            case 'List.cons':
                var $5652 = self.head;
                var $5653 = self.tail;
                var $5654 = Monad$bind$(IO$monad)(Fm$Synth$one$($5652, _defs$2))((_defs$5 => {
                    var $5655 = Fm$Synth$many$($5653, _defs$5);
                    return $5655;
                }));
                var $5650 = $5654;
                break;
        };
        return $5650;
    };
    const Fm$Synth$many = x0 => x1 => Fm$Synth$many$(x0, x1);

    function Fm$Synth$file$(_file$1, _defs$2) {
        var $5656 = Monad$bind$(IO$monad)(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Fm$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5658 = self.value;
                    var $5659 = Monad$pure$(IO$monad)(Either$left$($5658));
                    var $5657 = $5659;
                    break;
                case 'Either.right':
                    var $5660 = self.value;
                    var _file_defs$6 = $5660;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Fm$Name$from_bits);
                    var $5661 = Monad$bind$(IO$monad)(Fm$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5662 = Monad$pure$(IO$monad)(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5662;
                    }));
                    var $5657 = $5661;
                    break;
            };
            return $5657;
        }));
        return $5656;
    };
    const Fm$Synth$file = x0 => x1 => Fm$Synth$file$(x0, x1);

    function Fm$checker$io$file$(_file$1) {
        var $5663 = Monad$bind$(IO$monad)(Fm$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5665 = self.value;
                    var $5666 = Monad$bind$(IO$monad)(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5667 = IO$print$($5665);
                        return $5667;
                    }));
                    var $5664 = $5666;
                    break;
                case 'Either.right':
                    var $5668 = self.value;
                    var self = $5668;
                    switch (self._) {
                        case 'Pair.new':
                            var $5670 = self.fst;
                            var $5671 = self.snd;
                            var _nams$6 = $5670;
                            var _defs$7 = $5671;
                            var $5672 = IO$print$(Fm$Defs$report$(_defs$7, _nams$6));
                            var $5669 = $5672;
                            break;
                    };
                    var $5664 = $5669;
                    break;
            };
            return $5664;
        }));
        return $5663;
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
                        var $5673 = self.value;
                        var $5674 = $5673;
                        return $5674;
                    case 'IO.ask':
                        var $5675 = self.query;
                        var $5676 = self.param;
                        var $5677 = self.then;
                        var $5678 = IO$purify$($5677(""));
                        return $5678;
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
                var $5680 = self.value;
                var $5681 = $5680;
                var $5679 = $5681;
                break;
            case 'Either.right':
                var $5682 = self.value;
                var $5683 = IO$purify$((() => {
                    var _defs$3 = $5682;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Fm$Name$from_bits);
                    var $5684 = Monad$bind$(IO$monad)(Fm$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5685 = Monad$pure$(IO$monad)(Fm$Defs$report$(_defs$5, _nams$4));
                        return $5685;
                    }));
                    return $5684;
                })());
                var $5679 = $5683;
                break;
        };
        return $5679;
    };
    const Fm$checker$code = x0 => Fm$checker$code$(x0);

    function Fm$Term$read$(_code$1) {
        var self = Fm$Parser$term(0n)(_code$1);
        switch (self._) {
            case 'Parser.Reply.error':
                var $5687 = self.idx;
                var $5688 = self.code;
                var $5689 = self.err;
                var $5690 = Maybe$none;
                var $5686 = $5690;
                break;
            case 'Parser.Reply.value':
                var $5691 = self.idx;
                var $5692 = self.code;
                var $5693 = self.val;
                var $5694 = Maybe$some$($5693);
                var $5686 = $5694;
                break;
        };
        return $5686;
    };
    const Fm$Term$read = x0 => Fm$Term$read$(x0);
    const Fm = (() => {
        var __$1 = Fm$to_core$io$one;
        var __$2 = Fm$checker$io$one;
        var __$3 = Fm$checker$io$file;
        var __$4 = Fm$checker$code;
        var __$5 = Fm$Term$read;
        var $5695 = Fm$checker$io$file$("Main.fm");
        return $5695;
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
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
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
        'List.tail': List$tail,
        'Fm.SmartMotive.vals.cont': Fm$SmartMotive$vals$cont,
        'Fm.SmartMotive.vals': Fm$SmartMotive$vals,
        'Fm.SmartMotive.nams.cont': Fm$SmartMotive$nams$cont,
        'Fm.SmartMotive.nams': Fm$SmartMotive$nams,
        'List.zip': List$zip,
        'Nat.gte': Nat$gte,
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
        'Fm.Term.normalize': Fm$Term$normalize,
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